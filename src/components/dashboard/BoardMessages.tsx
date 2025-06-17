
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
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
 * Board Messages Component
 * Modern chat interface for board members to communicate with homeowners
 * Features conversation management and community communication tools
 */
const BoardMessages = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string>();

  // Current user (board member) - in real app this would come from auth context
  const currentUserId = 'board-1';
  const currentUserType = 'board' as const;

  // Sample conversations data for board members
  const [conversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      participants: [
        { id: 'board-1', name: 'You', type: 'board' },
        { id: 'homeowner-1', name: 'John Smith', type: 'homeowner' }
      ],
      lastMessage: {
        id: 'msg-1',
        content: 'Hi, I have a question about the pet policy. I recently adopted a rescue dog.',
        senderId: 'homeowner-1',
        senderName: 'John Smith',
        senderType: 'homeowner',
        timestamp: new Date('2024-01-15T10:00:00'),
        isRead: false
      },
      unreadCount: 1
    },
    {
      id: 'conv-2',
      participants: [
        { id: 'board-1', name: 'You', type: 'board' },
        { id: 'homeowner-2', name: 'Lisa Davis', type: 'homeowner' }
      ],
      lastMessage: {
        id: 'msg-3',
        content: 'Thank you for resolving the parking issue so quickly!',
        senderId: 'homeowner-2',
        senderName: 'Lisa Davis',
        senderType: 'homeowner',
        timestamp: new Date('2024-01-14T16:45:00'),
        isRead: true
      },
      unreadCount: 0
    },
    {
      id: 'conv-3',
      participants: [
        { id: 'board-1', name: 'You', type: 'board' },
        { id: 'homeowner-3', name: 'Robert Chen', type: 'homeowner' }
      ],
      lastMessage: {
        id: 'msg-5',
        content: 'Is there an update on the pool maintenance schedule?',
        senderId: 'homeowner-3',
        senderName: 'Robert Chen',
        senderType: 'homeowner',
        timestamp: new Date('2024-01-13T14:20:00'),
        isRead: false
      },
      unreadCount: 2
    }
  ]);

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
          isRead: false
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
          isRead: true
        },
        {
          id: 'msg-3',
          content: 'We\'ve contacted the towing company and they will refund the fees. Sorry for the inconvenience.',
          senderId: 'board-1',
          senderName: 'You',
          senderType: 'board',
          timestamp: new Date('2024-01-14T15:30:00'),
          isRead: true
        },
        {
          id: 'msg-4',
          content: 'Thank you for resolving the parking issue so quickly!',
          senderId: 'homeowner-2',
          senderName: 'Lisa Davis',
          senderType: 'homeowner',
          timestamp: new Date('2024-01-14T16:45:00'),
          isRead: true
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
          isRead: false
        },
        {
          id: 'msg-6',
          content: 'Also, when will the community center be reopening?',
          senderId: 'homeowner-3',
          senderName: 'Robert Chen',
          senderType: 'homeowner',
          timestamp: new Date('2024-01-13T14:22:00'),
          isRead: false
        }
      ];
    }
    
    return [];
  };

  // Handle sending new message
  const handleSendMessage = (conversationId: string, content: string) => {
    console.log('Board member sending message to conversation:', conversationId, 'Content:', content);
    // In real implementation, this would send via API and update conversation state
  };

  // Handle starting new conversation
  const handleStartNewConversation = (participantId: string) => {
    console.log('Board member starting new conversation with homeowner:', participantId);
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
            <MessageSquare className="h-6 w-6 mr-2 text-primary" />
            Community Messages
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

export default BoardMessages;
