
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, ArrowLeft, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderType: 'homeowner' | 'board' | 'admin';
  timestamp: Date;
  isRead: boolean;
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
  messages,
  onSendMessage,
  onStartNewConversation,
  onSelectConversation,
  selectedConversationId
}: ChatInterfaceProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock users for search - in real app this would come from API
  const availableUsers = [
    { id: '1', name: 'John Smith', type: 'homeowner' as const, unitNumber: '205A' },
    { id: '2', name: 'Sarah Johnson', type: 'board' as const, role: 'President' },
    { id: '3', name: 'Mike Wilson', type: 'board' as const, role: 'Secretary' },
    { id: '4', name: 'Lisa Davis', type: 'homeowner' as const, unitNumber: '112B' },
  ];

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
  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    user.id !== currentUserId &&
    !conversations.some(conv => 
      conv.participants.some(p => p.id === user.id)
    )
  );

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

  return (
    <div className="h-[600px] flex border rounded-lg overflow-hidden bg-white">
      {/* Conversations List - Hidden on mobile when chat is open */}
      <div className={`w-full md:w-1/3 border-r bg-gray-50 flex flex-col ${
        showMobileChat ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Header */}
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Messages</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewChat(!showNewChat)}
              className="text-primary border-primary hover:bg-primary hover:text-white"
            >
              <Search className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations or New Chat Users */}
        <ScrollArea className="flex-1">
          {showNewChat ? (
            <div className="p-2">
              <div className="text-sm text-gray-600 mb-2 px-2">Start new conversation</div>
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    onStartNewConversation(user.id);
                    setShowNewChat(false);
                    setSearchQuery('');
                  }}
                  className="flex items-center p-3 hover:bg-white rounded-lg cursor-pointer transition-colors"
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{user.name}</div>
                    <div className="text-sm text-gray-500">
                      {user.type === 'homeowner' ? `Unit ${user.unitNumber}` : user.role}
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
            <div className="p-2">
              {filteredConversations.map((conversation) => {
                const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
                const isActive = conversation.id === selectedConversationId;
                
                return (
                  <div
                    key={conversation.id}
                    onClick={() => handleMobileConversationSelect(conversation.id)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      isActive ? 'bg-primary text-white' : 'hover:bg-white'
                    }`}
                  >
                    <Avatar className="h-12 w-12 mr-3">
                      <AvatarFallback className={isActive ? 'bg-white text-primary' : 'bg-blue-100 text-blue-600'}>
                        {getUserInitials(otherParticipant?.name || 'Unknown')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className={`font-medium truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                          {otherParticipant?.name || 'Unknown User'}
                        </div>
                        {conversation.lastMessage && (
                          <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                            {formatTime(conversation.lastMessage.timestamp)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        {conversation.lastMessage && (
                          <div className={`text-sm truncate ${isActive ? 'text-white/80' : 'text-gray-600'}`}>
                            {conversation.lastMessage.content}
                          </div>
                        )}
                        {conversation.unreadCount > 0 && !isActive && (
                          <Badge variant="destructive" className="ml-2 text-xs">
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
      <div className={`w-full md:w-2/3 flex flex-col ${
        !showMobileChat && selectedConversationId ? 'hidden md:flex' : 
        showMobileChat || selectedConversationId ? 'flex' : 'hidden md:flex'
      }`}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden mr-2"
                onClick={() => setShowMobileChat(false)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <Avatar className="h-10 w-10 mr-3">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {getUserInitials(selectedConversation.participants.find(p => p.id !== currentUserId)?.name || 'Unknown')}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="font-medium text-gray-900">
                  {selectedConversation.participants.find(p => p.id !== currentUserId)?.name || 'Unknown User'}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedConversation.participants.find(p => p.id !== currentUserId)?.type === 'board' ? 'Board Member' : 'Homeowner'}
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwn = message.senderId === currentUserId;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
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
            <div className="p-4 border-t bg-white">
              <div className="flex items-center space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-primary hover:bg-primary/90"
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
