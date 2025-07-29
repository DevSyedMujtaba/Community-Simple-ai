import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";
import { supabase } from "@/lib/supabaseClient";

const HomeownerMessages = ({ hoaIds = [] }: { hoaIds?: string[] }) => {
  // --- State ---
  const [selectedConversation, setSelectedConversation] = useState<{ id: string; hoaId: string } | null>(null);
  const [conversations, setConversations] = useState<any[]>([]); // Each conversation: { id, hoaId, participants, lastMessage, unreadCount }
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, any[]>>({});
  const [residentsByHoa, setResidentsByHoa] = useState<Record<string, any[]>>({});
  const [hoaList, setHoaList] = useState<any[]>([]); // [{ hoa_id, hoa_communities }]
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserType] = useState<'homeowner'>("homeowner");
  const [boardMembersByHoa, setBoardMembersByHoa] = useState<Record<string, any>>({});

  // --- Fetch HOA and user info ---
  useEffect(() => {
    const fetchInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) return;
      setCurrentUserId(session.user.id);
      // Get all approved HOA join requests for this user
      let joinRequests = [];
      if (hoaIds.length > 0) {
        const { data: joins, error } = await supabase
          .from('hoa_join_requests')
          .select('hoa_id, hoa_communities(board_member_id, name)')
          .in('hoa_id', hoaIds)
          .eq('user_id', session.user.id)
          .eq('status', 'approved');
        console.log('[HomeownerMessages] joinRequests:', joins, 'Error:', error);
        joinRequests = joins || [];
      }
      if (!joinRequests.length) return;
      setHoaList(joinRequests);
      // Fetch board members for each HOA
      const boardMembers: Record<string, any> = {};
      for (const join of joinRequests) {
        const boardId = join.hoa_communities?.board_member_id;
        if (boardId) {
          const { data: boardProfile } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .eq('id', boardId)
            .single();
          boardMembers[join.hoa_id] = {
            id: boardProfile?.id,
            name: `${boardProfile?.first_name || ''} ${boardProfile?.last_name || ''}`.trim() || 'Board Member',
            type: 'board',
          };
        }
      }
      setBoardMembersByHoa(boardMembers);
      // Fetch residents for each HOA
      const residentsByHoa: Record<string, any[]> = {};
      for (const join of joinRequests) {
        const { data: residentReqs, error: residentError } = await supabase
          .from('hoa_join_requests')
          .select('user_id, profiles!user_id(id, first_name, last_name), hoa_id')
          .eq('hoa_id', join.hoa_id)
          .eq('status', 'approved');
        console.log(`[HomeownerMessages] residentReqs for HOA ${join.hoa_id}:`, residentReqs, 'Error:', residentError);
        const mappedResidents = (residentReqs || [])
          .filter(r => r.profiles?.id !== session.user.id)
          .map(r => ({
            id: r.profiles?.id,
            name: `${r.profiles?.first_name || ''} ${r.profiles?.last_name || ''}`.trim() || 'Homeowner',
            type: 'homeowner',
          }));
        residentsByHoa[join.hoa_id] = mappedResidents;
      }
      setResidentsByHoa(residentsByHoa);
    };
    fetchInfo();
  }, [hoaIds]);

  // --- Fetch all conversations for the current user across all HOAs ---
  const fetchConversations = async () => {
    if (!hoaList.length || !currentUserId) return;
    let allConversations: any[] = [];
    for (const join of hoaList) {
      const hoaId = join.hoa_id;
      // Fetch all messages for this homeowner in this HOA
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('hoa_id', hoaId)
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });
      if (error) {
        console.error(`[HomeownerMessages] Error fetching conversations for HOA ${hoaId}:`, error);
        continue;
      }
      // Build a map of unique conversation partners (board + other residents)
      const conversationMap: Record<string, any> = {};
      (data || []).forEach(msg => {
        const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
        // Only allow conversations with board or other residents
        let user = null;
        if (boardMembersByHoa[hoaId] && otherUserId === boardMembersByHoa[hoaId].id) user = boardMembersByHoa[hoaId];
        else user = (residentsByHoa[hoaId] || []).find(u => u.id === otherUserId);
        if (user && !conversationMap[otherUserId]) {
          // Calculate unread count for this conversation
          const unreadCount = (data || []).filter(m =>
            ((m.sender_id === otherUserId && m.receiver_id === currentUserId) && m.isread === false)
          ).length;
          conversationMap[otherUserId] = {
            id: `conv-${hoaId}-${otherUserId}`,
            hoaId,
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
            unreadCount,
            hoaName: join.hoa_communities?.name || '',
          };
        }
      });
      allConversations = [...allConversations, ...Object.values(conversationMap)];
    }
    setConversations(allConversations);
    console.log('[HomeownerMessages] conversations:', allConversations);
  };

  useEffect(() => {
    fetchConversations();
  }, [hoaList, currentUserId, residentsByHoa, boardMembersByHoa]);

  // --- Fetch messages for selected conversation ---
  const fetchMessagesForConversation = async (conversationKey: { id: string; hoaId: string } | null) => {
    if (!conversationKey) return;
    const { id: conversationId, hoaId } = conversationKey;
    const conversation = conversations.find(c => c.id === conversationId && c.hoaId === hoaId);
    if (!conversation) return;
    let homeownerId = currentUserId;
    let otherId = conversation.participants.find(p => p.id !== currentUserId)?.id;
    if (!homeownerId || !otherId) return;
    console.log('[fetchMessagesForConversation] hoaId:', hoaId, 'homeownerId:', homeownerId, 'otherId:', otherId);
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
    console.log('[fetchMessagesForConversation] messages:', data);
    const user = boardMembersByHoa[hoaId] && otherId === boardMembersByHoa[hoaId].id
      ? boardMembersByHoa[hoaId]
      : (residentsByHoa[hoaId] || []).find(u => u.id === otherId);
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
        c.id === conversationId && c.hoaId === hoaId
          ? { ...c, lastMessage: lastMsg }
          : c
      ));
    }
  };

  useEffect(() => {
    fetchMessagesForConversation(selectedConversation);
  }, [selectedConversation, conversations, residentsByHoa, boardMembersByHoa]);

  // --- Real-time subscription for all HOAs ---
  useEffect(() => {
    if (!hoaList.length || !currentUserId) return;
    const channels = hoaList.map(join => {
      const hoaId = join.hoa_id;
      return supabase
        .channel(`messages-realtime-homeowner-${hoaId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `hoa_id=eq.${hoaId}`,
          },
          (payload) => {
            fetchConversations();
            if (selectedConversation && selectedConversation.hoaId === hoaId) {
              fetchMessagesForConversation(selectedConversation);
            }
          }
        )
        .subscribe();
    });
    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [hoaList, currentUserId, selectedConversation, conversations]);

  // --- Handle sending new message ---
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
          hoa_id: conversation.hoaId,
          sender_id: currentUserId,
          receiver_id: otherParticipant.id,
          content,
          created_at: new Date().toISOString(),
          isread: false,
        },
      ]);
    if (error) {
      console.error('Error sending message:', error);
      return;
    }
    await fetchMessagesForConversation({ id: conversationId, hoaId: conversation.hoaId });
  };

  // --- Handle starting new conversation ---
  const handleStartNewConversation = (participantId: string, hoaId: string) => {
    let conversation = conversations.find(conv =>
      conv.participants.some(p => p.id === participantId) && conv.hoaId === hoaId
    );
    if (!conversation) {
      const user =
        (boardMembersByHoa[hoaId] && participantId === boardMembersByHoa[hoaId].id)
          ? boardMembersByHoa[hoaId]
          : (residentsByHoa[hoaId] || []).find(u => u.id === participantId);
      if (!user) return;
      conversation = {
        id: `conv-${hoaId}-${participantId}`,
        hoaId,
        participants: [
          { id: currentUserId, name: "You", type: "homeowner" },
          { id: user.id, name: user.name, type: user.type }
        ],
        lastMessage: undefined,
        unreadCount: 0,
        hoaName: hoaList.find(h => h.hoa_id === hoaId)?.hoa_communities?.name || '',
      };
      setConversations(prev => [...prev, conversation]);
    }
    setSelectedConversation({ id: conversation.id, hoaId });
  };

  // --- Handle conversation selection ---
  const handleSelectConversation = async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    setSelectedConversation({ id: conversationId, hoaId: conversation.hoaId });
    // Mark all unread messages as read in this conversation
    let homeownerId = currentUserId;
    let otherId = conversation.participants.find(p => p.id !== currentUserId)?.id;
    if (!homeownerId || !otherId) return;
    await supabase
      .from('messages')
      .update({ isread: true })
      .eq('hoa_id', conversation.hoaId)
      .eq('sender_id', otherId)
      .eq('receiver_id', homeownerId)
      .eq('isread', false);
    fetchMessagesForConversation({ id: conversationId, hoaId: conversation.hoaId });
    fetchConversations();
  };

  // --- UI ---
  // Build available users for starting new conversations, grouped by HOA
  const availableUsers = hoaList.flatMap(join => {
    const hoaId = join.hoa_id;
    const board = boardMembersByHoa[hoaId] ? [boardMembersByHoa[hoaId]] : [];
    const residents = residentsByHoa[hoaId] || [];
    return board.concat(residents).map(u => ({ ...u, hoaId, hoaName: join.hoa_communities?.name || '' }));
  });

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
            key={selectedConversation ? selectedConversation.id : 'none'}
            currentUserId={currentUserId}
            currentUserType={currentUserType}
            conversations={conversations}
            messages={selectedConversation ? (messagesByConversation[selectedConversation.id] || []) : []}
            onSendMessage={handleSendMessage}
            onStartNewConversation={(participantId: string, hoaId: string) => handleStartNewConversation(participantId, hoaId)}
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversation ? selectedConversation.id : undefined}
            hoaId={selectedConversation ? selectedConversation.hoaId : ''}
            availableUsers={availableUsers}
            showHoaName={hoaList.length > 1}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeownerMessages;
