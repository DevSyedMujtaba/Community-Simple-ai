
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";

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

/**
 * Homeowner Messages Component
 * Modern chat interface for homeowners to communicate with board members
 * Features conversation threading and real-time messaging experience
 */
const HomeownerMessages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string>();

  // Current user (homeowner) - in real app this would come from auth context
  const currentUserId = 'homeowner-1';
  const currentUserType = 'homeowner' as const;

  // Sample conversations data
  const [conversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      participants: [
        { id: 'homeowner-1', name: 'You', type: 'homeowner' },
        { id: 'board-1', name: 'Sarah Johnson', type: 'board' }
      ],
      lastMessage: {
        id: 'msg-2',
        content: 'Thank you for your inquiry about the pet policy. Based on your description, your rescue dog should be fine.',
        senderId: 'board-1',
        senderName: 'Sarah Johnson',
        senderType: 'board',
        timestamp: new Date('2024-01-15T14:30:00'),
        isRead: false
      },
      unreadCount: 1
    },
    {
      id: 'conv-2',
      participants: [
        { id: 'homeowner-1', name: 'You', type: 'homeowner' },
        { id: 'board-2', name: 'Mike Wilson', type: 'board' }
      ],
      lastMessage: {
        id: 'msg-4',
        content: 'We understand your concern about the towing incident. The 72-hour limit applies to consecutive parking.',
        senderId: 'board-2',
        senderName: 'Mike Wilson',
        senderType: 'board',
        timestamp: new Date('2024-01-14T16:20:00'),
        isRead: true
      },
      unreadCount: 0
    }
  ]);

  // Sample messages for selected conversation
  const getMessagesForConversation = (conversationId: string): Message[] => {
    if (conversationId === 'conv-1') {
      return [
        {
          id: 'msg-1',
          content: 'Hi, I have a question about the pet policy. I recently adopted a rescue dog and wanted to make sure I\'m following all the rules.',
          senderId: 'homeowner-1',
          senderName: 'You',
          senderType: 'homeowner',
          timestamp: new Date('2024-01-15T10:00:00'),
          isRead: true
        },
        {
          id: 'msg-2',
          content: 'Thank you for your inquiry about the pet policy. Based on your description, your rescue dog should be fine as long as it\'s under 80lbs and properly registered. Please submit the pet registration form with breed documentation.',
          senderId: 'board-1',
          senderName: 'Sarah Johnson',
          senderType: 'board',
          timestamp: new Date('2024-01-15T14:30:00'),
          isRead: false
        }
      ];
    }
    
    if (conversationId === 'conv-2') {
      return [
        {
          id: 'msg-3',
          content: 'I wanted to report that my guest\'s car was towed yesterday even though it was parked in a visitor spot for less than 24 hours.',
          senderId: 'homeowner-1',
          senderName: 'You',
          senderType: 'homeowner',
          timestamp: new Date('2024-01-14T12:00:00'),
          isRead: true
        },
        {
          id: 'msg-4',
          content: 'We understand your concern about the towing incident. The 72-hour limit applies to consecutive parking, but there\'s also a restriction on overnight parking without a permit. We\'ve contacted the towing company to resolve this matter.',
          senderId: 'board-2',
          senderName: 'Mike Wilson',
          senderType: 'board',
          timestamp: new Date('2024-01-14T16:20:00'),
          isRead: true
        }
      ];
    }
    
    return [];
  };

  // Handle sending new message
  const handleSendMessage = (conversationId: string, content: string) => {
    console.log('Sending message to conversation:', conversationId, 'Content:', content);
    // In real implementation, this would send via API
  };

  // Handle starting new conversation
  const handleStartNewConversation = (participantId: string) => {
    console.log('Starting new conversation with user:', participantId);
    // In real implementation, this would create a new conversation
    const newConversationId = `conv-${Date.now()}`;
    setSelectedConversationId(newConversationId);
  };

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-6 w-6 mr-2 text-primary" />
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChatInterface
            currentUserId={currentUserId}
            currentUserType={currentUserType}
            conversations={conversations}
            messages={selectedConversationId ? getMessagesForConversation(selectedConversationId) : []}
            onSendMessage={handleSendMessage}
            onStartNewConversation={handleStartNewConversation}
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversationId}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeownerMessages;
