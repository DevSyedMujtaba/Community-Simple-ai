import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// TypeScript type for the aggregated user data
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'homeowner' | 'board';
  hoaName: string;
  joinDate: string;
  lastActive: string;
  messagesSent: number;
  messagesReceived: number;
  tokenUsage: number;
  status: 'active' | 'inactive' | 'suspended' | 'rejected';
}

interface UseAdminUsersResult {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
}

// Custom hook to fetch and aggregate user data for admin dashboard
const useAdminUsers = (): UseAdminUsersResult & { refetch: () => Promise<void> } => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*, status');
      if (profilesError) throw profilesError;

      // 2. Fetch all homeowner_details and board_member_details
      const [homeownersRes, boardMembersRes] = await Promise.all([
        supabase.from('homeowner_details').select('*'),
        supabase.from('board_member_details').select('*'),
      ]);
      if (homeownersRes.error) throw homeownersRes.error;
      if (boardMembersRes.error) throw boardMembersRes.error;
      const homeowners = homeownersRes.data || [];
      const boardMembers = boardMembersRes.data || [];

      // 3. Fetch all messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('id,sender_id,receiver_id,created_at');
      if (messagesError) throw messagesError;

      // 4. Fetch all token usage
      const { data: tokens, error: tokensError } = await supabase
        .from('token_usage')
        .select('user_id,tokens_used,created_at');
      if (tokensError) throw tokensError;

      // 5. Fetch all HOA communities (for board member HOA names)
      const { data: hoas, error: hoasError } = await supabase
        .from('hoa_communities')
        .select('id,name');
      if (hoasError) throw hoasError;

      // 6. Fetch all HOA join requests (for homeowners' community)
      const { data: joinRequests, error: joinRequestsError } = await supabase
        .from('hoa_join_requests')
        .select('id,hoa_id,user_id,status,created_at')
      if (joinRequestsError) throw joinRequestsError;

      // 7. Fetch join/active dates and email from edge function
      const { data: { session } } = await supabase.auth.getSession();
      let authDates: Record<string, { email: string; created_at: string; last_sign_in_at: string }> = {};
      try {
        const res = await fetch('https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/get-auth-users-dates', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        const json = await res.json();
        if (json.users && Array.isArray(json.users)) {
          authDates = Object.fromEntries(
            json.users.map((u: any) => [u.id, { email: u.email, created_at: u.created_at, last_sign_in_at: u.last_sign_in_at }])
          );
        }
      } catch (e) {
        // If the edge function fails, fallback to empty
        authDates = {};
      }

      // 8. Aggregate user data
      const usersData: AdminUser[] = profiles
        .filter((profile: any) => profile.role !== 'admin') // Exclude admin users
        .map((profile: any) => {
          // Get role-specific details
          let hoaName = '';
          let status: 'active' | 'inactive' | 'suspended' | 'rejected' = profile.status || 'active';
          if (profile.role === 'homeowner') {
            // Find the latest join request for this user
            const userJoinRequests = joinRequests
              .filter((jr: any) => jr.user_id === profile.id)
              .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            const latestJoin = userJoinRequests[0];
            if (latestJoin && latestJoin.hoa_id) {
              const hoa = hoas.find((h: any) => h.id === latestJoin.hoa_id);
              hoaName = hoa?.name || 'N/A';
            } else {
              hoaName = 'N/A';
            }
          } else if (profile.role === 'board') {
            const board = boardMembers.find((b: any) => b.user_id === profile.id);
            hoaName = board?.hoa_name || 'N/A';
          }

          // Messages sent/received
          const messagesSent = messages.filter((m: any) => m.sender_id === profile.id).length;
          const messagesReceived = messages.filter((m: any) => m.receiver_id === profile.id).length;

          // Token usage sum
          const tokenUsage = tokens
            .filter((t: any) => t.user_id === profile.id)
            .reduce((sum: number, t: any) => sum + (t.tokens_used || 0), 0);

          // Join and last active dates and email from auth.users (edge function)
          let joinDate = 'N/A';
          let lastActive = 'N/A';
          let email = profile.email || '';
          if (authDates[profile.id]) {
            joinDate = authDates[profile.id].created_at
              ? new Date(authDates[profile.id].created_at).toISOString().split('T')[0]
              : 'N/A';
            lastActive = authDates[profile.id].last_sign_in_at
              ? new Date(authDates[profile.id].last_sign_in_at).toISOString().split('T')[0]
              : 'N/A';
            email = authDates[profile.id].email || email;
          }

          return {
            id: profile.id,
            name: `${profile.first_name} ${profile.last_name}`,
            email,
            role: profile.role === 'board' ? 'board' : 'homeowner',
            hoaName,
            joinDate,
            lastActive,
            messagesSent,
            messagesReceived,
            tokenUsage,
            status,
          };
        });

      setUsers(usersData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
};

export default useAdminUsers; 