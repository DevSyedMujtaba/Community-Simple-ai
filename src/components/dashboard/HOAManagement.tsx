import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Search, Filter, Calendar, MapPin, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
interface HOAMember {
  id: string;
  name: string;
  email: string;
  role: 'homeowner' | 'board';
  joinDate: string;
  status: 'active' | 'pending' | 'inactive';
}
interface HOA {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  totalUnits: number;
  createdDate: string;
  boardMembers: number;
  activeMembers: number;
  pendingRequests: number;
  contactEmail: string;
  contactPhone: string;
  members: HOAMember[];
}
interface JoinRequest {
  id: string;
  status: string;
  created_at: string;
  user_id: string;
  board_member_id: string | null;
}
interface HOAUser {
  id: string;
  email: string;
  name: string;
}
interface HOAUsersResponse {
  users: HOAUser[];
}

// Add US states and sample cities mapping at the top of the file (after imports)
const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

const US_CITIES: { [key: string]: string[] } = {
  AL: ['Montgomery'],
  AK: ['Juneau'],
  AZ: ['Phoenix'],
  AR: ['Little Rock'],
  CA: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
  CO: ['Denver'],
  CT: ['Hartford'],
  DE: ['Dover'],
  FL: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee'],
  GA: ['Atlanta'],
  HI: ['Honolulu'],
  ID: ['Boise'],
  IL: ['Chicago', 'Springfield', 'Naperville', 'Peoria'],
  IN: ['Indianapolis'],
  IA: ['Des Moines'],
  KS: ['Topeka'],
  KY: ['Frankfort'],
  LA: ['Baton Rouge'],
  ME: ['Augusta'],
  MD: ['Annapolis'],
  MA: ['Boston'],
  MI: ['Lansing'],
  MN: ['Saint Paul'],
  MS: ['Jackson'],
  MO: ['Jefferson City'],
  MT: ['Helena'],
  NE: ['Lincoln'],
  NV: ['Carson City'],
  NH: ['Concord'],
  NJ: ['Trenton'],
  NM: ['Santa Fe'],
  NY: ['New York City', 'Buffalo', 'Rochester', 'Albany'],
  NC: ['Raleigh'],
  ND: ['Bismarck'],
  OH: ['Columbus'],
  OK: ['Oklahoma City'],
  OR: ['Salem'],
  PA: ['Harrisburg'],
  RI: ['Providence'],
  SC: ['Columbia'],
  SD: ['Pierre'],
  TN: ['Nashville'],
  TX: ['Houston', 'Dallas', 'Austin', 'San Antonio'],
  UT: ['Salt Lake City'],
  VT: ['Montpelier'],
  VA: ['Richmond'],
  WA: ['Olympia'],
  WV: ['Charleston'],
  WI: ['Madison'],
  WY: ['Cheyenne'],
};

/**
 * HOA Management Component for Admin Dashboard
 * Displays all HOAs on the platform with their members and statistics
 * Provides filtering, search, and HOA management capabilities
 */
const HOAManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [expandedHOA, setExpandedHOA] = useState<string | null>(null);
  const [communityForm, setCommunityForm] = useState({
    name: "",
    state: "",
    city: "",
    address: "",
    units: "",
    contact_email: "",
    contact_phone: "",
    description: ""
  });
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [myCommunity, setMyCommunity] = useState(null);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [showCommunityForm, setShowCommunityForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef(null);
  const [userId, setUserId] = useState("");
  const [activeMembers, setActiveMembers] = useState(0);
  const [pendingMembers, setPendingMembers] = useState(0);
  const [members, setMembers] = useState<HOAMember[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [allHOAs, setAllHOAs] = useState<any[]>([]);
  const [allHOAsLoading, setAllHOAsLoading] = useState(false);
  const [allHOAsError, setAllHOAsError] = useState<string | null>(null);
  const [hoaMembers, setHoaMembers] = useState<{ [hoaId: string]: any[] }>({});
  const [hoaMembersLoading, setHoaMembersLoading] = useState<{ [hoaId: string]: boolean }>({});

  useEffect(() => {
    // Get the current session on mount
    const getToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAccessToken(session?.access_token || "");
    };
    getToken();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccessToken(session?.access_token || "");
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      setUserRole(profile?.role || null);
    };
    fetchRole();
  }, []);

  useEffect(() => {
    const fetchCommunity = async () => {
      setCommunityLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMyCommunity(null);
        setCommunityLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("hoa_communities")
        .select("id, name, state, city, address, contact_email, contact_phone, description, created_at")
        .eq("board_member_id", user.id)
        .single();
      setMyCommunity(data || null);
      setCommunityLoading(false);
    };
    fetchCommunity();
  }, [formSuccess]);

  useEffect(() => {
    if (formSuccess) {
      setShowCommunityForm(false);
    }
  }, [formSuccess]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || "");
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchMemberCounts = async () => {
      if (!myCommunity?.id) {
        setActiveMembers(0);
        setPendingMembers(0);
        return;
      }
      const { data: joinRequests, error } = await supabase
        .from('hoa_join_requests')
        .select('status')
        .eq('hoa_id', myCommunity.id);
      if (error || !joinRequests) {
        setActiveMembers(0);
        setPendingMembers(0);
        return;
      }
      setActiveMembers(joinRequests.filter(jr => jr.status === 'approved').length);
      setPendingMembers(joinRequests.filter(jr => jr.status === 'pending').length);
    };
    fetchMemberCounts();
  }, [myCommunity]);

  // Fetch members for this HOA
  useEffect(() => {
    const fetchMembers = async () => {
      if (!myCommunity?.id) {
        setMembers([]);
        return;
      }
      const { data: joinRequests, error } = await supabase
        .from('hoa_join_requests')
        .select('id, status, created_at, user_id, board_member_id')
        .eq('hoa_id', myCommunity.id);
      console.log('joinRequests:', joinRequests, 'error:', error, 'hoa_id:', myCommunity.id);
      if (error || !joinRequests) {
        setMembers([]);
        return;
      }
      // Only include users whose latest join request is not rejected
      const latestJoinRequests: Record<string, any> = {};
      (joinRequests as JoinRequest[]).forEach((jr) => {
        if (!latestJoinRequests[jr.user_id] || new Date(jr.created_at) > new Date(latestJoinRequests[jr.user_id].created_at)) {
          latestJoinRequests[jr.user_id] = jr;
        }
      });
      const filteredJoinRequests = Object.values(latestJoinRequests).filter((jr: any) => jr.status !== 'rejected');
      // Get all user_ids
      const userIds = filteredJoinRequests.map((jr: any) => jr.user_id);
      // Fetch emails and names from edge function
      let usersData: HOAUsersResponse = { users: [] };
      try {
        const res = await fetch(
          `https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/get-hoa-users?user_ids=${userIds.join(',')}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        usersData = await res.json();
      } catch (e) {
        console.error('Error fetching emails from edge function:', e);
      }
      // Map joinRequests to members with email and name
      const mappedMembers: HOAMember[] = filteredJoinRequests.map((m: any) => {
        const user: HOAUser | undefined = usersData.users.find((u) => String(u.id) === String(m.user_id));
        return {
          id: m.user_id,
          name: user?.name || '',
          email: user?.email || '',
          role: (m.board_member_id === m.user_id ? 'board' : 'homeowner') as 'board' | 'homeowner',
          joinDate: m.created_at,
          status: m.status === 'approved' ? 'active' : (m.status as 'active' | 'pending' | 'inactive'),
        };
      });
      setMembers(mappedMembers);
    };
    fetchMembers();
  }, [myCommunity, accessToken]);

  // Fetch all HOAs and their stats for admin
  useEffect(() => {
    const fetchAllHOAs = async () => {
      if (userRole !== 'admin') return;
      setAllHOAsLoading(true);
      setAllHOAsError(null);
      try {
        // 1. Fetch all HOAs (include board_member_id)
        const { data: hoas, error: hoasError } = await supabase
          .from('hoa_communities')
          .select('*');
        if (hoasError) throw hoasError;
        // 2. For each HOA, fetch join request counts
        const hoaStats = await Promise.all(
          (hoas || []).map(async (hoa: any) => {
            const { data: joinRequests, error: jrError } = await supabase
              .from('hoa_join_requests')
              .select('status')
              .eq('hoa_id', hoa.id);
            if (jrError) return { ...hoa, activeMembers: 0, pendingRequests: 0 };
            const activeMembers = joinRequests.filter((jr: any) => jr.status === 'approved').length;
            const pendingRequests = joinRequests.filter((jr: any) => jr.status === 'pending').length;
            return {
              ...hoa,
              activeMembers,
              pendingRequests,
            };
          })
        );
        // 3. Fetch all unique board_member_ids
        const boardMemberIds = Array.from(new Set((hoas || []).map((h: any) => h.board_member_id).filter(Boolean)));
        let boardMembers: HOAUsersResponse = { users: [] };
        if (boardMemberIds.length > 0) {
          try {
            const res = await fetch(
              `https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/get-hoa-users?user_ids=${boardMemberIds.join(',')}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
              }
            );
            boardMembers = await res.json();
            console.log('HOA board members:', boardMembers);
          } catch (e) {
            console.error('Error fetching board member info from edge function:', e);
          }
        }
        // 4. Attach board member info to each HOA
        const hoaStatsWithBoard = hoaStats.map((hoa: any) => {
          const board = boardMembers.users.find((u: any) => String(u.id) === String(hoa.board_member_id));
          return {
            ...hoa,
            boardMember: board || null,
          };
        });
        setAllHOAs(hoaStatsWithBoard);
      } catch (err: any) {
        setAllHOAsError(err.message || 'Failed to fetch HOAs');
      } finally {
        setAllHOAsLoading(false);
      }
    };
    fetchAllHOAs();
  }, [userRole, accessToken]);

  const handleCommunityInput = (e) => {
    const { name, value } = e.target;
    setCommunityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    setFormSuccess(false);

    if (!accessToken) {
      setFormError("You must be logged in as a board member to create a community.");
      setFormLoading(false);
      return;
    }

    try {
      const response = await fetch("https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/create_hoa_community", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(communityForm)
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setFormSuccess(true);
        setCommunityForm({
          name: "",
          state: "",
          city: "",
          address: "",
          units: "",
          contact_email: "",
          contact_phone: "",
          description: ""
        });
      } else {
        setFormError(result.error || "Failed to create community.");
      }
    } catch (err) {
      setFormError("An unexpected error occurred.");
    } finally {
      setFormLoading(false);
    }
  };

  // Update city options when state changes
  useEffect(() => {
    // Find the state code for the selected state name
    const selectedStateObj = US_STATES.find(s => s.name === communityForm.state);
    const stateCode = selectedStateObj ? selectedStateObj.code : null;
    if (stateCode && US_CITIES[stateCode]) {
      setCityOptions(US_CITIES[stateCode]);
      // If the current city is not in the new options, default to the first city
      if (!US_CITIES[stateCode].includes(communityForm.city)) {
        setCommunityForm((prev) => ({ ...prev, city: US_CITIES[stateCode][0] || "" }));
      }
    } else {
      setCityOptions([]);
      setCommunityForm((prev) => ({ ...prev, city: "" }));
    }
  }, [communityForm.state]);

  // Remove the static hoas array and related logic
  // Only show the board member's own community in the list
  let displayHOAs = [];
  if (myCommunity) {
    const matchesSearch = myCommunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      myCommunity.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      myCommunity.state.toLowerCase().includes(searchTerm.toLowerCase());
    // Add status filter logic if needed (for now, always true)
    if (matchesSearch) {
      displayHOAs = [{
        id: myCommunity.id,
        name: myCommunity.name,
        address: myCommunity.address,
        city: myCommunity.city,
        state: myCommunity.state,
        totalUnits: myCommunity.units,
        createdDate: myCommunity.created_at,
        boardMembers: 1,
        activeMembers: activeMembers,
        pendingRequests: pendingMembers,
        contactEmail: myCommunity.contact_email,
        contactPhone: myCommunity.contact_phone,
        members: members,
      }];
    }
  }

  // Calculate platform statistics
  const stats = userRole === 'admin'
    ? {
        totalHOAs: allHOAs.length,
        totalUnits: allHOAs.reduce((sum, hoa) => sum + (hoa.units || 0), 0),
        totalMembers: allHOAs.reduce((sum, hoa) => sum + (hoa.activeMembers || 0), 0),
        pendingRequests: allHOAs.reduce((sum, hoa) => sum + (hoa.pendingRequests || 0), 0),
      }
    : {
        totalHOAs: myCommunity ? 1 : 0,
        totalUnits: myCommunity ? Number(myCommunity.units) : 0,
        totalMembers: activeMembers,
        pendingRequests: pendingMembers
      };

  // Get status color for members
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'homeowner':
        return 'bg-blue-100 text-blue-800';
      case 'board':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fetch members for a specific HOA (admin view)
  const fetchMembersForHOA = async (hoaId: string) => {
    setHoaMembersLoading(prev => ({ ...prev, [hoaId]: true }));
    try {
      // 1. Fetch all approved join requests for this HOA
      const { data: joinRequests, error } = await supabase
        .from('hoa_join_requests')
        .select('user_id, created_at, board_member_id, status')
        .eq('hoa_id', hoaId)
        .eq('status', 'approved');
      if (error) throw error;
      // 2. Collect all unique user_ids
      const userIds = (joinRequests || []).map((jr: any) => String(jr.user_id));
      if (userIds.length === 0) {
        setHoaMembers(prev => ({ ...prev, [hoaId]: [] }));
        return;
      }
      // 3. Fetch user info from Edge Function
      let usersData: HOAUsersResponse = { users: [] };
      try {
        const res = await fetch(
          `https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/get-hoa-users?user_ids=${userIds.join(',')}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        usersData = await res.json();
      } catch (e) {
        console.error('Error fetching emails from edge function:', e);
      }
      // 4. Merge joinRequests with user info
      const members = (joinRequests || []).map((jr: any) => {
        const user: HOAUser | undefined = usersData.users.find((u) => String(u.id) === String(jr.user_id));
        return {
          id: jr.user_id,
          name: user?.name || '',
          email: user?.email || '',
          role: (jr.board_member_id === jr.user_id ? 'board' : 'homeowner') as 'board' | 'homeowner',
          joinDate: jr.created_at,
          status: 'active',
        };
      });
      setHoaMembers(prev => ({ ...prev, [hoaId]: members }));
    } catch (err) {
      setHoaMembers(prev => ({ ...prev, [hoaId]: [] }));
    } finally {
      setHoaMembersLoading(prev => ({ ...prev, [hoaId]: false }));
    }
  };

  // Toggle HOA expansion and fetch members if needed
  const handleToggleHOAExpansion = (hoaId: string) => {
    if (expandedHOA === hoaId) {
      setExpandedHOA(null);
    } else {
      setExpandedHOA(hoaId);
      if (!hoaMembers[hoaId]) {
        fetchMembersForHOA(hoaId);
      }
    }
  };
  return (
    <div className="space-y-6 w-full max-w-full box-border overflow-x-hidden">
      {/* Create Community Button and Form (only for non-admins) */}
      {userRole !== 'admin' && !showCommunityForm && (
        <Button
          className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base mb-4"
          onClick={() => setShowCommunityForm(true)}
        >
          Create Community
        </Button>
      )}
      {userRole !== 'admin' && showCommunityForm && (
        <Card className="rounded-xl border w-full mb-4">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Create New HOA Community</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCommunitySubmit} className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Community Name</Label>
                  <Input name="name" value={communityForm.name} onChange={handleCommunityInput} required />
                </div>
                <div>
                  <Label>State</Label>
                  <select
                    name="state"
                    value={communityForm.state}
                    onChange={handleCommunityInput}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="" disabled>Select a state</option>
                    {US_STATES.map((state) => (
                      <option key={state.code} value={state.name}>{state.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>City</Label>
                  <select
                    name="city"
                    value={communityForm.city}
                    onChange={handleCommunityInput}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    disabled={!communityForm.state || cityOptions.length === 0}
                  >
                    <option value="" disabled>Select a city</option>
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Address</Label>
                  <Input name="address" value={communityForm.address} onChange={handleCommunityInput} required />
                </div>
                <div>
                  <Label>Contact Email</Label>
                  <Input name="contact_email" type="email" value={communityForm.contact_email} onChange={handleCommunityInput} required />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input name="contact_phone" value={communityForm.contact_phone} onChange={handleCommunityInput} required />
                </div>
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Input name="description" value={communityForm.description} onChange={handleCommunityInput} />
              </div>
              {formError && <div className="text-red-600 text-sm mb-2">{formError}</div>}
              {formSuccess && <div className="text-green-600 text-sm mb-2">Community created successfully!</div>}
              <div className="flex gap-2">
                <Button type="submit" disabled={formLoading} className="w-full h-11 sm:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base rounded-lg">
                  {formLoading ? "Creating..." : "Create Community"}
                </Button>
                <Button type="button" variant="outline" className="w-full h-11 sm:h-12" onClick={() => setShowCommunityForm(false)} disabled={formLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      {/* Platform Statistics */}
      <div className="flex flex-col gap-2 w-full">
        <Card className="rounded-xl border w-full">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center w-full">
            <div className="text-base xs:text-lg md:text-xl font-bold text-purple-600 break-words">{stats.totalHOAs}</div>
            <div className="text-xs xs:text-sm md:text-sm text-gray-600 break-words">Total HOAs</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border w-full">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center w-full">
            <div className="text-base xs:text-lg md:text-xl font-bold text-green-600 break-words">{stats.totalMembers.toLocaleString()}</div>
            <div className="text-xs xs:text-sm md:text-sm text-gray-600 break-words">Active Members</div>
          </CardContent>
        </Card>
        <Card className="rounded-xl border w-full">
          <CardContent className="p-2 xs:p-3 sm:p-4 text-center w-full">
            <div className="text-base xs:text-lg md:text-xl font-bold text-orange-600 break-words">{stats.pendingRequests}</div>
            <div className="text-xs xs:text-sm md:text-sm text-gray-600 break-words">Pending Requests</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search HOAs, cities, or states..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <select value={statusFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary w-full max-w-xs text-sm appearance-none leading-tight sm:w-auto sm:max-w-none" style={{ fontSize: '14px' }}>
            <option value="all">All HOAs</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* HOAs List */}
      <div className="space-y-4">
        {userRole === 'admin'
          ? allHOAs.map(hoa => {
              console.log('HOA card:', hoa);
              return (
                <Card key={hoa.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-purple-100 p-3 rounded-full">
                            <Building2 className="h-6 w-6 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{hoa.name}</h3>
                        </div>
                        {/* Board Member Info (force render for debug) */}
                        <div className="flex items-center gap-2 mb-1 text-xs text-gray-600 bg-yellow-100 p-1 rounded">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-800">Board Member:</span>
                          <span>{hoa.boardMember?.name || 'No Name'}</span>
                          <span className="mx-1">|</span>
                          <span>{hoa.boardMember?.email || 'No Email'}</span>
                        </div>
                        {/* End Board Member Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {hoa.city}, {hoa.state}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Created {new Date(hoa.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {hoa.contact_email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {hoa.contact_phone}
                          </div>
                        </div>
                        <div className="flex gap-4 mt-2 flex-wrap w-full">
                          <div className="bg-green-50 rounded p-2 w-full sm:w-auto flex flex-col justify-center box-border">
                            <div className="text-sm font-medium text-green-900">Active Members</div>
                            <div className="text-lg font-bold text-green-700">{hoa.activeMembers}</div>
                          </div>
                          <div className="bg-orange-50 rounded p-2 w-full sm:w-auto flex flex-col justify-center box-border">
                            <div className="text-sm font-medium text-orange-900">Pending</div>
                            <div className="text-lg font-bold text-orange-700">{hoa.pendingRequests}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center items-center md:ml-8">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#254F70] text-[#254F70] hover:bg-blue-50 min-w-[110px] h-9"
                          onClick={() => handleToggleHOAExpansion(hoa.id)}
                        >
                          {expandedHOA === hoa.id ? 'Hide Members' : 'View Members'}
                        </Button>
                      </div>
                    </div>
                    {/* Members List (expanded) */}
                    {expandedHOA === hoa.id && (
                      <>
                        <hr className="my-6" />
                        <div className="mb-4 text-lg font-semibold text-gray-900">Members ({hoaMembers[hoa.id]?.length || 0})</div>
                        {hoaMembersLoading[hoa.id] ? (
                          <div className="flex justify-center items-center py-8">
                            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                          </div>
                        ) : (
                          <div className="space-y-4 w-full">
                            {(hoaMembers[hoa.id] || []).map(member => (
                              <div key={member.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-4 bg-gray-50 rounded-xl w-full min-w-0 box-border">
                                <div className="flex items-center gap-3 min-w-0 flex-1 flex-wrap w-full">
                                  <div className="bg-gray-200 p-2 rounded-full">
                                    <Users className="h-6 w-6 text-gray-600" />
                                  </div>
                                  <div className="min-w-0 w-full sm:w-auto">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <span className="font-semibold text-gray-900 truncate break-words max-w-full">{member.name}</span>
                                      <Badge className={getRoleColor(member.role)} variant="secondary">{member.role}</Badge>
                                      {['active', 'inactive', 'suspended'].includes(member.status) && (
                                        <Badge className={getStatusColor(member.status)} variant="secondary">{member.status}</Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-600 truncate break-words w-full sm:w-auto">{member.email} <span className="mx-1">•</span> Joined {new Date(member.joinDate).toLocaleDateString()}</div>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" className="border-[#254F70] text-[#254F70] hover:bg-blue-50 w-full sm:w-auto">
                                  View Profile
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })
          : displayHOAs.map(hoa => (
              <Card key={hoa.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* HOA Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Building2 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{hoa.name}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{hoa.city}, {hoa.state}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>Created {new Date(hoa.createdDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{hoa.contactEmail}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{hoa.contactPhone}</span>
                          </div>
                        </div>
                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div className="bg-green-50 p-2 rounded">
                            <div className="font-medium text-green-900">Active Members</div>
                            <div className="text-green-700">{hoa.activeMembers}</div>
                          </div>
                          <div className="bg-orange-50 p-2 rounded">
                            <div className="font-medium text-orange-900">Pending</div>
                            <div className="text-orange-700">{hoa.pendingRequests}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleToggleHOAExpansion(hoa.id)} className="text-[#254F70] border-[#254F70] hover:bg-blue-50">
                        {expandedHOA === hoa.id ? 'Hide Members' : 'View Members'}
                      </Button>
                    </div>
                  </div>
                  {/* Expanded Members List */}
                  {expandedHOA === hoa.id && <div className="border-t pt-4 w-full">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">
                        Members ({hoa.members.length})
                      </h4>
                      <div className="space-y-3 w-full max-w-md mx-auto px-0 box-border overflow-x-visible border border-red-500">
                        {hoa.members.map(member => <div key={member.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg w-full min-w-0 box-border">
                            <div className="flex items-center space-x-3 min-w-0 flex-1 flex-wrap w-full">
                              <div className="bg-gray-200 p-2 rounded-full">
                                <Users className="h-4 w-4 text-gray-600" />
                              </div>
                              <div className="min-w-0 w-full sm:w-auto">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                                  <span className="font-medium text-gray-900 truncate break-words max-w-full">{member.name}</span>
                                  <div className="flex gap-2 flex-wrap">
                                    <Badge className={getRoleColor(member.role)} variant="secondary">
                                      {member.role}
                                    </Badge>
                                    <Badge className={getStatusColor(member.status)} variant="secondary">
                                      {member.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-600 mt-1 truncate break-words w-full sm:w-auto">
                                  <span className="truncate block sm:inline">{member.email}</span>
                                  <span className="hidden sm:inline"> • </span>
                                  <span className="block sm:inline">Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="text-gray-600 border-gray-600 hover:bg-gray-100 w-full sm:w-auto">
                              View Profile
                            </Button>
                          </div>)}
                      </div>
                    </div>}
                </CardContent>
              </Card>
            ))}
      </div>
      {userRole === 'admin' && allHOAs.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No HOAs found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' ? 'Adjust your search criteria or filters to see more results.' : 'No HOAs registered in the system yet.'}
            </p>
          </CardContent>
        </Card>
      )}
      {userRole !== 'admin' && displayHOAs.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No HOAs found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' ? 'Adjust your search criteria or filters to see more results.' : 'No HOAs registered in the system yet.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
export default HOAManagement;