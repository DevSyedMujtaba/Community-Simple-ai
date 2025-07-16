import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";
import { supabase } from "@/lib/supabaseClient";

const HomeownerMessages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, any[]>>({});
  const [residents, setResidents] = useState<any[]>([]);
  const [hoaId, setHoaId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserType] = useState<'homeowner'>("homeowner");
  const [boardMember, setBoardMember] = useState<any>(null);

  // Fetch HOA and user info
  useEffect(() => {
    const fetchInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) return;
      setCurrentUserId(session.user.id);
      // Get approved HOA join request
      const { data: join } = await supabase
        .from('hoa_join_requests')
        .select('hoa_id, hoa_communities(board_member_id)')
        .eq('user_id', session.user.id)
        .eq('status', 'approved')
        .single();
      if (!join) return;
      setHoaId(join.hoa_id);
      // Get board member info
      const boardId = join.hoa_communities?.board_member_id;
      if (boardId) {
        const { data: boardProfile } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('id', boardId)
          .single();
        setBoardMember({
          id: boardProfile?.id,
          name: `${boardProfile?.first_name || ''} ${boardProfile?.last_name || ''}`.trim() || 'Board Member',
          type: 'board',
        });
      }
      // Get all residents (other homeowners)
      const { data: residentReqs } = await supabase
        .from('hoa_join_requests')
        .select('user_id, profiles!user_id(id, first_name, last_name)')
        .eq('hoa_id', join.hoa_id)
        .eq('status', 'approved');
      const mappedResidents = (residentReqs || [])
        .filter(r => r.profiles?.id !== session.user.id)
        .map(r => ({
          id: r.profiles?.id,
          name: `${r.profiles?.first_name || ''} ${r.profiles?.last_name || ''}`.trim() || 'Homeowner',
          type: 'homeowner',
        }));
      setResidents(mappedResidents);
    };
    fetchInfo();
  }, []);

  // Fetch all conversations for the current user
  const fetchConversations = async () => {
    if (!hoaId || !currentUserId) return;
    // Fetch all messages for this homeowner in this HOA
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('hoa_id', hoaId)
      .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }
    // Build a map of unique conversation partners (board + other residents)
    const conversationMap: Record<string, any> = {};
    (data || []).forEach(msg => {
      const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
      // Only allow conversations with board or other residents
      let user = null;
      if (boardMember && otherUserId === boardMember.id) user = boardMember;
      else user = residents.find(u => u.id === otherUserId);
      if (user && !conversationMap[otherUserId]) {
        // Calculate unread count for this conversation
        const unreadCount = (data || []).filter(m =>
          ((m.sender_id === otherUserId && m.receiver_id === currentUserId) && m.isread === false)
        ).length;
        conversationMap[otherUserId] = {
          id: `conv-${otherUserId}`,
      participants: [
              { id: currentUserId, name: "You", type: "homeowner" },
              { id: user.id, name: user.name, type: user.type }
      ],
      lastMessage: {
              id: msg.id,
              content: msg.content,
              senderId: msg.sender_id,
              senderName: msg.sender_id === currentUserId ? 'You' : user.name,
              senderType: msg.sender_id === currentUserId ? 'homeowner' : user.type,
              timestamp: new Date(msg.created_at),
              isread: msg.isread,
      },
            unreadCount
          };
        }
      });
      setConversations(Object.values(conversationMap));
    };

  useEffect(() => {
    fetchConversations();
  }, [hoaId, currentUserId, residents, boardMember]);

  // Fetch messages for selected conversation
  const fetchMessagesForConversation = async (conversationId: string) => {
    if (!conversationId) return;
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    let homeownerId = currentUserId;
    let otherId = conversation.participants.find(p => p.id !== currentUserId)?.id;
    if (!homeownerId || !otherId) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('hoa_id', hoaId)
      .or(`and(sender_id.eq.${homeownerId},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${homeownerId})`)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }
    const user = boardMember && otherId === boardMember.id
      ? boardMember
      : residents.find(u => u.id === otherId);
    const mappedMessages = (data || []).map(msg => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.sender_id,
      senderName: msg.sender_id === homeownerId ? 'You' : (user ? user.name : 'User'),
      senderType: msg.sender_id === homeownerId ? 'homeowner' : (user ? user.type : 'homeowner'),
      timestamp: new Date(msg.created_at),
      isread: true,
    }));
    setMessagesByConversation(prev => ({
      ...prev,
      [conversationId]: mappedMessages,
    }));
    // Update lastMessage in conversations
    if (mappedMessages.length > 0) {
      const lastMsg = mappedMessages[mappedMessages.length - 1];
      setConversations(prev => prev.map(c =>
        c.id === conversationId
          ? { ...c, lastMessage: lastMsg }
          : c
      ));
    }
  };

  useEffect(() => {
    fetchMessagesForConversation(selectedConversationId!);
  }, [selectedConversationId, hoaId, currentUserId, boardMember, residents, conversations]);

  // Real-time subscription
  useEffect(() => {
    if (!hoaId || !currentUserId) return;
    const channel = supabase
      .channel('messages-realtime-homeowner')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `hoa_id=eq.${hoaId}`,
        },
        (payload) => {
          // Always refetch the conversation list for real-time badge updates
          fetchConversations();
          // Optionally, also refetch messages for the open chat
          if (selectedConversationId) fetchMessagesForConversation(selectedConversationId);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [hoaId, currentUserId, selectedConversationId, conversations]);

  // Handle sending new message
  const handleSendMessage = async (conversationId: string, content: string) => {
    if (!content.trim()) return;
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    if (!otherParticipant) return;
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          hoa_id: hoaId,
          sender_id: currentUserId,
          receiver_id: otherParticipant.id,
          content,
          created_at: new Date().toISOString(),
          isread: false, // Always set isread to false for new messages
        },
      ]);
    if (error) {
      console.error('Error sending message:', error);
      return;
    }
    await fetchMessagesForConversation(conversationId);
  };

  // Handle starting new conversation
  const handleStartNewConversation = (participantId: string) => {
    let conversation = conversations.find(conv =>
      conv.participants.some(p => p.id === participantId)
    );
    if (!conversation) {
      const user =
        (boardMember && participantId === boardMember.id)
          ? boardMember
          : residents.find(u => u.id === participantId);
      if (!user) return;
      conversation = {
        id: `conv-${participantId}`,
        participants: [
          { id: currentUserId, name: "You", type: "homeowner" },
          { id: user.id, name: user.name, type: user.type }
        ],
        lastMessage: undefined,
        unreadCount: 0
      };
      setConversations(prev => [...prev, conversation]);
    }
    setSelectedConversationId(conversation.id);
  };

  // Handle conversation selection
  const handleSelectConversation = async (conversationId: string) => {
    setSelectedConversationId(conversationId);
    // Mark all unread messages as read in this conversation
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    let homeownerId = currentUserId;
    let otherId = conversation.participants.find(p => p.id !== currentUserId)?.id;
    if (!homeownerId || !otherId) return;
    // Update unread messages in Supabase
    await supabase
      .from('messages')
      .update({ isread: true })
      .eq('hoa_id', hoaId)
      .eq('sender_id', otherId)
      .eq('receiver_id', homeownerId)
      .eq('isread', false);
    // Refetch messages for this conversation
    fetchMessagesForConversation(conversationId);
    // Refetch the conversation list to update unread badge
    fetchConversations();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-6 w-6 mr-2 text-[#254F70]" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChatInterface
            key={selectedConversationId}
            currentUserId={currentUserId}
            currentUserType={currentUserType}
            conversations={conversations}
            messages={selectedConversationId ? (messagesByConversation[selectedConversationId] || []) : []}
            onSendMessage={handleSendMessage}
            onStartNewConversation={handleStartNewConversation}
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversationId}
            hoaId={hoaId || ""}
            availableUsers={boardMember ? [boardMember, ...residents] : residents}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeownerMessages;
