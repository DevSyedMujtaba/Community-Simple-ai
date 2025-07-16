import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, ArrowLeft, User } from "lucide-react";
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

interface ChatInterfaceProps {
  currentUserId: string;
  currentUserType: 'homeowner' | 'board' | 'admin';
  conversations: Conversation[];
  messages: Message[];
  onSendMessage: (conversationId: string, content: string) => void;
  onStartNewConversation: (participantId: string) => void;
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId?: string;
  hoaId: string;
  otherParticipantId?: string;
  availableUsers?: any[]; // <-- Add this line
}

/**
 * Modern Chat Interface Component
 * Provides WhatsApp-like messaging experience with conversation list and chat view
 * Features mobile-responsive design with proper message threading
 */
const ChatInterface = ({
  currentUserId,
  currentUserType,
  conversations,
  messages: initialMessages,
  onSendMessage,
  onStartNewConversation,
  onSelectConversation,
  selectedConversationId,
  hoaId,
  otherParticipantId,
  availableUsers = [], // <-- Add this line
}: ChatInterfaceProps) => {
  // Debug log to check conversations prop and unreadCount
  console.log('ChatInterface conversations prop:', conversations);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Remove the internal availableUsers state and fetch
  // const [availableUsers, setAvailableUsers] = useState([]);

  // Mock users for search - in real app this would come from API
  // const availableUsers = [
  //   { id: '1', name: 'John Smith', type: 'homeowner' as const, unitNumber: '205A' },
  //   { id: '2', name: 'Sarah Johnson', type: 'board' as const, role: 'President' },
  //   { id: '3', name: 'Mike Wilson', type: 'board' as const, role: 'Secretary' },
  //   { id: '4', name: 'Lisa Davis', type: 'homeowner' as const, unitNumber: '112B' },
  // ];

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Filter available users for new chat
  // useEffect(() => {
  //   if (!hoaId || !currentUserId) return;
  //   const fetchUsers = async () => {
  //     const { data, error } = await supabase
  //       .from('hoa_join_requests')
  //       .select('user_id, profiles (id, first_name, last_name, role, phone, unit_number)')
  //       .eq('hoa_id', hoaId)
  //       .eq('status', 'active');
  //     if (data) {
  //       setAvailableUsers(
  //         data
  //           .map((m) => m.profiles)
  //           .filter((u) => u && u.id !== currentUserId)
  //       );
  //     }
  //   };
  //   fetchUsers();
  // }, [hoaId, currentUserId]);

  // Get current conversation
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  // Handle sending message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversationId) return;
    
    onSendMessage(selectedConversationId, newMessage);
    setNewMessage('');
  };

  // Handle key press in message input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Mobile conversation selection handler
  const handleMobileConversationSelect = (conversationId: string) => {
    onSelectConversation(conversationId);
    setShowMobileChat(true);
  };

  // Realtime subscription for new messages
  useEffect(() => {
    if (!hoaId || !currentUserId || !otherParticipantId) return;
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
          const msg = payload.new;
          // Only add if it's between these two users
          if (
            (msg.sender_id === currentUserId && msg.receiver_id === otherParticipantId) ||
            (msg.sender_id === otherParticipantId && msg.receiver_id === currentUserId)
          ) {
            setMessages((prev) => [...prev, {
              id: msg.id,
              content: msg.content,
              senderId: msg.sender_id,
              senderName: '', // Optionally fetch/display name
              senderType: '', // Optionally fetch/display type
              timestamp: new Date(msg.created_at),
              isread: true // Or handle read status as needed
            }]);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [hoaId, currentUserId, otherParticipantId]);

  // Sync local messages state with prop when it changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Use the availableUsers prop for filteredUsers
  const filteredUsers = availableUsers.filter(user =>
    (`${user.name}`.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-[400px] h-full flex flex-col md:flex-row border rounded-lg overflow-hidden bg-white max-h-[80vh] w-full min-w-0">
      {/* Conversations List - Hidden on mobile when chat is open */}
      <div className={`w-full md:w-1/3 border-r bg-gray-50 flex flex-col min-h-[300px] max-h-full min-w-0 ${
        selectedConversationId && !showNewChat ? 'hidden' : 'flex'
      } md:flex`}>
        {/* Header */}
        <div className="p-2 xs:p-3 sm:p-4 border-b bg-white">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-2 xs:mb-3">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg min-w-0 break-words">Messages</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewChat(!showNewChat)}
              className="text-[#254F70] border-[#254F70] hover:bg-primary hover:text-white min-h-[40px] w-full xs:w-auto"
            >
              <Search className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
          
          {/* Search Input */}
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm min-h-[40px] w-full"
            />
          </div>
        </div>

        {/* Conversations or New Chat Users */}
        <ScrollArea className="flex-1 min-h-0 max-h-full">
          {showNewChat ? (
            <div className="p-2">
              <div className="text-sm text-gray-600 mb-2 px-2">Start new conversation</div>
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    onStartNewConversation(user.id);
                    setShowNewChat(false); // Hide the list after selecting a user
                    setSearchQuery('');
                  }}
                  className="flex items-center p-3 hover:bg-white rounded-lg cursor-pointer transition-colors min-h-[44px]"
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-[#254F70] text-white">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate flex items-center">
                      {user.name}
                      {user.type === 'board' && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">Board</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.unit ? `Unit ${user.unit}` : user.type === 'board' ? 'Board Member' : 'Homeowner'}
                    </div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No users found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-1 xs:p-2 min-w-0">
              {filteredConversations.map((conversation) => {
                const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
                const isActive = conversation.id === selectedConversationId;
                return (
                  <div
                    key={conversation.id}
                    onClick={() => handleMobileConversationSelect(conversation.id)}
                    className={`flex items-center gap-2 p-2 xs:p-3 rounded-lg cursor-pointer transition-colors min-h-[40px] min-w-0 ${
                      isActive ? 'bg-primary text-white' : 'hover:bg-white'
                    }`}
                  >
                    <Avatar className="h-9 w-9 xs:h-10 xs:w-10 sm:h-12 sm:w-12 mr-2 sm:mr-3 flex-shrink-0">
                      <AvatarFallback className={isActive ? 'bg-white text-primary' : 'bg-blue-100 text-blue-600'}>
                        {getUserInitials(otherParticipant?.name || 'Unknown')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between min-w-0 gap-2">
                        <div className={`font-medium truncate flex items-center ${isActive ? 'text-white' : 'text-gray-900'} min-w-0`} style={{maxWidth: '50vw'}}>
                          {otherParticipant?.name || 'Unknown User'}
                          {otherParticipant?.type === 'board' && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">Board</span>
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'} ml-2 flex-shrink-0`}>
                            {formatTime(conversation.lastMessage.timestamp)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1 min-w-0 gap-2">
                        {conversation.lastMessage && (
                          <div className={`text-xs xs:text-sm truncate ${isActive ? 'text-white/80' : 'text-gray-600'} min-w-0`} style={{maxWidth: '40vw'}}>
                            {conversation.lastMessage.content}
                          </div>
                        )}
                        {conversation.unreadCount > 0 && conversation.id !== selectedConversationId && (
                          <Badge variant="destructive" className="ml-2 text-xs flex-shrink-0 w-6 h-6 flex items-center justify-center">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredConversations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No conversations yet</p>
                  <p className="text-sm mt-1">Start a new conversation</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area - Full width on mobile when conversation is selected */}
      <div className={`w-full md:w-2/3 flex flex-col min-h-[300px] max-h-full min-w-0 ${
        selectedConversationId ? 'flex' : 'hidden'
      } md:flex`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-2 xs:p-3 sm:p-4 border-b bg-white flex items-center min-h-[40px] gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden mr-2"
                onClick={() => onSelectConversation("")}
                aria-label="Back to conversations"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <Avatar className="h-9 w-9 xs:h-10 xs:w-10 mr-2 xs:mr-3">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {getUserInitials(selectedConversation.participants.find(p => p.id !== currentUserId)?.name || 'Unknown')}
                </AvatarFallback>
              </Avatar>
              
              <div className="font-medium text-gray-900 text-base sm:text-lg min-w-0 break-words">
                  {selectedConversation.participants.find(p => p.id !== currentUserId)?.name || 'Unknown User'}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-2 xs:p-3 sm:p-4 min-h-0 max-h-full">
              <div className="space-y-2 xs:space-y-3">
                {messages.map((message) => {
                  const isOwn = message.senderId === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} min-w-0`}
                    >
                      <div
                        className={`max-w-[80vw] sm:max-w-xs lg:max-w-md px-3 xs:px-4 py-2 rounded-lg break-words shadow-md ${
                          isOwn
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="text-sm break-words">{message.content}</div>
                        <div
                          className={`text-xs mt-1 ${
                            isOwn ? 'text-white/80' : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-2 xs:p-3 sm:p-4 border-t bg-white">
              <div className="flex items-center gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 min-h-[40px] text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-primary hover:bg-primary/90 min-h-[40px] w-10 xs:w-12"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">Select a conversation</div>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
