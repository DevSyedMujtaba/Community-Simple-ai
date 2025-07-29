import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";
import { supabase } from "@/lib/supabaseClient";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderType: 'homeowner' | 'board' | 'admin';
  timestamp: Date;
  isread: boolean;
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    type: 'homeowner' | 'board' | 'admin';
    avatar?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
}

// Define types for residents and messages
interface Resident {
  id: string;
  name: string;
  email?: string;
  unit?: string;
  status?: string;
  joinDate?: string;
}

interface BoardMessagesProps {
  onUnreadCountChange?: (count: number) => void;
}

/**
 * Board Messages Component
 * Modern chat interface for board members to communicate with homeowners
 * Features conversation management and community communication tools
 */
const BoardMessages = ({ onUnreadCountChange }: BoardMessagesProps) => {
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const [hoaId, setHoaId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserType] = useState<'board'>("board");
  const [residents, setResidents] = useState<Resident[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messagesByConversation, setMessagesByConversation] = useState<Record<string, Message[]>>({});

  // Move fetchConversations to the top level so it's always in scope
  const fetchConversations = async () => {
    console.log('[fetchConversations] hoaId:', hoaId, 'currentUserId:', currentUserId);
    console.log('[fetchConversations] residents:', residents);
    if (!hoaId || !currentUserId) return;
    // Fetch all messages for this board member in this HOA
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
    console.log('[fetchConversations] messages:', data);
    // Build a map of unique conversation partners
    const conversationMap: Record<string, Conversation> = {};
    (data || []).forEach((msg: any) => {
      const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
      if (!conversationMap[otherUserId]) {
        // Find user in residents
        const user = residents.find(u => u.id === otherUserId);
        if (user) {
          // Calculate unread count for this conversation
          const unreadCount = (data || []).filter((m: any) =>
            ((m.sender_id === otherUserId && m.receiver_id === currentUserId) && m.isread === false)
          ).length;
          conversationMap[otherUserId] = {
            id: `conv-${otherUserId}`,
      participants: [
              { id: currentUserId, name: "You", type: "board" },
              { id: user.id, name: user.name, type: "homeowner" }
      ],
      lastMessage: {
              id: msg.id,
              content: msg.content,
              senderId: msg.sender_id,
              senderName: msg.sender_id === currentUserId ? 'You' : user.name,
              senderType: (msg.sender_id === currentUserId ? 'board' : 'homeowner') as 'homeowner' | 'board' | 'admin',
              timestamp: new Date(msg.created_at),
              isread: msg.isread,
            },
            unreadCount
          };
        } else {
          console.log('[fetchConversations] No resident found for userId:', otherUserId);
        }
      }
    });
    const conversationsArr = Object.values(conversationMap);
    console.log('[fetchConversations] conversations:', conversationsArr);
    setConversations(conversationsArr);
  };

  useEffect(() => {
    const fetchResidents = async () => {
      // 1. Get current session
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session:', session);
      if (!session || !session.user) return;
      setCurrentUserId(session.user.id);
      // 2. Get HOA for this board member
      const { data: community } = await supabase
        .from("hoa_communities")
        .select("id")
        .eq("board_member_id", session.user.id)
        .single();
      console.log('Community:', community);
      if (!community) return;
      setHoaId(community.id);
      // 3. Fetch all join requests for this HOA (not just approved)
      const { data: allReqs, error: allReqsError } = await supabase
        .from("hoa_join_requests")
        .select("id, user_id, unit_number, phone_number, status, created_at, profiles:profiles!user_id(id, first_name, last_name)")
        .eq("hoa_id", community.id);
      console.log('Join Requests:', allReqs, 'Error:', allReqsError);
      if (allReqsError || !allReqs) {
        setResidents([]);
        return;
      }
      // Only include users whose latest join request is not rejected
      const latestJoinRequests: Record<string, any> = {};
      allReqs.forEach((req: any) => {
        if (!latestJoinRequests[req.user_id] || new Date(req.created_at) > new Date(latestJoinRequests[req.user_id].created_at)) {
          latestJoinRequests[req.user_id] = req;
        }
      });
      const filteredReqs = Object.values(latestJoinRequests).filter((req: any) => req.status !== 'rejected');
      console.log('Filtered Join Requests:', filteredReqs);
      // 4. Map residents for ChatInterface
      const mappedResidents = filteredReqs.map((req: any) => ({
        id: req.profiles?.id || req.user_id,
        name: req.profiles ? `${req.profiles.first_name || ''} ${req.profiles.last_name || ''}`.trim() : 'Unknown',
        email: req.profiles?.email || '',
        unit: req.unit_number,
        status: req.status,
        joinDate: req.created_at,
      }));
      console.log('Mapped Residents:', mappedResidents);
      setResidents(mappedResidents);
      console.log('[fetchResidents] residents set:', mappedResidents);
      // Do not call fetchConversations here; let the useEffect below handle it
    };
    fetchResidents();
  }, []);

  // Call fetchConversations only when hoaId, currentUserId, and residents are all set
  useEffect(() => {
    if (hoaId && currentUserId && residents.length > 0) {
    fetchConversations();
    }
  }, [hoaId, currentUserId, residents]);

  // Debug log: log selectedConversationId whenever it changes
  useEffect(() => {
    console.log('selectedConversationId changed:', selectedConversationId);
  }, [selectedConversationId]);

  // Debug log: log messagesByConversation keys whenever it updates
  useEffect(() => {
    console.log('messagesByConversation keys:', Object.keys(messagesByConversation));
  }, [messagesByConversation]);

  // Extract fetchMessagesForConversation as a function
  const fetchMessagesForConversation = async (conversationId: string) => {
    console.log('fetchMessagesForConversation called with:', conversationId);
    if (!conversationId) return;
    // Find the conversation and participants
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    // Ensure we always have board and homeowner IDs
    const boardId = currentUserId;
    let homeownerId: string | null = null;
    for (const p of conversation.participants) {
      if (p.type === 'homeowner') homeownerId = p.id;
    }
    if (!boardId || !homeownerId) return;
    // Fetch messages where (sender/receiver are the two participants, in either direction) and hoa_id matches
    console.log('[BoardMessages][fetchMessagesForConversation] hoaId:', hoaId, 'boardId:', boardId, 'homeownerId:', homeownerId);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('hoa_id', hoaId)
      .or(`and(sender_id.eq.${boardId},receiver_id.eq.${homeownerId}),and(sender_id.eq.${homeownerId},receiver_id.eq.${boardId})`)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('[BoardMessages][fetchMessagesForConversation] Error fetching messages:', error);
      return;
    }
    console.log('[BoardMessages][fetchMessagesForConversation] messages:', data);
    // Map messages to the format expected by ChatInterface
    const homeowner = residents.find(u => u.id === homeownerId);
    const mappedMessages: Message[] = (data || []).map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.sender_id,
      senderName: msg.sender_id === boardId ? 'You' : (homeowner ? homeowner.name : 'Homeowner'),
      senderType: (msg.sender_id === boardId ? 'board' : 'homeowner') as 'homeowner' | 'board' | 'admin',
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
    if (!selectedConversationId) return;
    const conversation = conversations.find(c => c.id === selectedConversationId);
    if (!conversation) return;
    fetchMessagesForConversation(selectedConversationId);
  }, [selectedConversationId, conversations, hoaId, currentUserId, currentUserType, residents]);

  // Real-time subscription effect
  useEffect(() => {
    if (!hoaId || !currentUserId) return;
    // Subscribe to realtime messages for this HOA
    const channel = supabase
      .channel('messages-realtime')
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
  }, [hoaId, currentUserId, selectedConversationId]);

  // Sample messages for different conversations
  const getMessagesForConversation = (conversationId: string): Message[] => {
    if (conversationId === 'conv-1') {
      return [
        {
          id: 'msg-1',
          content: 'Hi, I have a question about the pet policy. I recently adopted a rescue dog and wanted to make sure I\'m following all the rules.',
          senderId: 'homeowner-1',
          senderName: 'John Smith',
          senderType: 'homeowner',
          timestamp: new Date('2024-01-15T10:00:00'),
          isread: false
        }
      ];
    }
    
    if (conversationId === 'conv-2') {
      return [
        {
          id: 'msg-2',
          content: 'I wanted to report that my guest\'s car was towed yesterday.',
          senderId: 'homeowner-2',
          senderName: 'Lisa Davis',
          senderType: 'homeowner',
          timestamp: new Date('2024-01-14T12:00:00'),
          isread: true
        },
        {
          id: 'msg-3',
          content: 'We\'ve contacted the towing company and they will refund the fees. Sorry for the inconvenience.',
          senderId: 'board-1',
          senderName: 'You',
          senderType: 'board',
          timestamp: new Date('2024-01-14T15:30:00'),
          isread: true
        },
        {
          id: 'msg-4',
          content: 'Thank you for resolving the parking issue so quickly!',
          senderId: 'homeowner-2',
          senderName: 'Lisa Davis',
          senderType: 'homeowner',
          timestamp: new Date('2024-01-14T16:45:00'),
          isread: true
        }
      ];
    }

    if (conversationId === 'conv-3') {
      return [
        {
          id: 'msg-5',
          content: 'Is there an update on the pool maintenance schedule?',
          senderId: 'homeowner-3',
          senderName: 'Robert Chen',
          senderType: 'homeowner',
          timestamp: new Date('2024-01-13T14:20:00'),
          isread: false
        },
        {
          id: 'msg-6',
          content: 'Also, when will the community center be reopening?',
          senderId: 'homeowner-3',
          senderName: 'Robert Chen',
          senderType: 'homeowner',
          timestamp: new Date('2024-01-13T14:22:00'),
          isread: false
        }
      ];
    }
    
    return [];
  };

  // Handle sending new message
  const handleSendMessage = async (conversationId: string, content: string) => {
    if (!content.trim()) return;
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    if (!otherParticipant) return;
    const messagePayload = {
          hoa_id: hoaId,
          sender_id: currentUserId,
          receiver_id: otherParticipant.id,
          content,
          created_at: new Date().toISOString(),
      isread: false,
    };
    console.log('[BoardMessages][handleSendMessage] Inserting message:', messagePayload);
    const { data, error } = await supabase
      .from('messages')
      .insert([messagePayload]);
    if (error) {
      console.error('[BoardMessages][handleSendMessage] Error sending message:', error);
      return;
    }
    console.log('[BoardMessages][handleSendMessage] Message sent, data:', data);
    await fetchMessagesForConversation(conversationId);
  };

  // Handle starting new conversation
  const handleStartNewConversation = (participantId: string) => {
    // Check if conversation already exists
    let conversation = conversations.find(conv =>
      conv.participants.some(p => p.id === participantId)
    );
    if (!conversation) {
      // Find the user object
      const user = residents.find(u => u.id === participantId);
      if (!user) return;
      // Create new conversation
      conversation = {
        id: `conv-${participantId}`,
        participants: [
          { id: currentUserId, name: "You", type: "board" },
          { id: user.id, name: user.name, type: "homeowner" }
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
    const boardId = currentUserId;
    let homeownerId: string | null = null;
    for (const p of conversation.participants) {
      if (p.type === 'homeowner') homeownerId = p.id;
    }
    if (!boardId || !homeownerId) return;
    // Update unread messages in Supabase
    await supabase
      .from('messages')
      .update({ isread: true })
      .eq('hoa_id', hoaId)
      .eq('sender_id', homeownerId)
      .eq('receiver_id', boardId)
      .eq('isread', false);
    // Refetch messages for this conversation
    fetchMessagesForConversation(conversationId);
    // Refetch the conversation list to update unread badge
    fetchConversations();
  };

  // Debug log to check what messages are being passed to ChatInterface
  console.log('BoardMessages conversations:', conversations);
  console.log('Rendering ChatInterface with messages:', selectedConversationId, messagesByConversation[selectedConversationId]);

  // After conversations is set or updated, calculate totalUnread
  const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(totalUnread);
    }
  }, [totalUnread, onUnreadCountChange]);

  return (
    <div className="space-y-4">
      <Card className="w-full min-w-0">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="flex items-center text-base sm:text-lg min-w-0 break-words">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-[#254F70] flex-shrink-0" />
            Community Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 xs:p-3 sm:p-4 min-w-0">
          <div className="min-w-0">
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
            availableUsers={residents}
            messagesUnread={totalUnread}
          />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BoardMessages;
