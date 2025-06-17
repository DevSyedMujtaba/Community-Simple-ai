
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, User, Clock, Plus } from "lucide-react";

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: string;
  senderType: 'homeowner' | 'board';
  timestamp: Date;
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
}

/**
 * Homeowner Messages Component
 * Allows homeowners to send messages to board members and view responses
 * Features responsive design and message threading
 */
const HomeownerMessages = () => {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyText, setReplyText] = useState('');

  // Sample messages data
  const messages: Message[] = [
    {
      id: '1',
      subject: 'Pet Policy Response',
      content: 'Thank you for your inquiry about the pet policy. Based on your description, your rescue dog should be fine as long as it\'s under 80lbs and properly registered. Please submit the pet registration form with breed documentation.',
      sender: 'HOA Board',
      senderType: 'board',
      timestamp: new Date('2024-01-15T14:30:00'),
      status: 'unread',
      priority: 'medium'
    },
    {
      id: '2',
      subject: 'Guest Parking Clarification',
      content: 'We understand your concern about the towing incident. The 72-hour limit applies to consecutive parking, but there\'s also a restriction on overnight parking without a permit. We\'ve contacted the towing company to resolve this matter.',
      sender: 'HOA Board',
      senderType: 'board',
      timestamp: new Date('2024-01-14T16:20:00'),
      status: 'read',
      priority: 'high'
    }
  ];

  // Handle sending new message
  const handleSendMessage = () => {
    if (!newSubject.trim() || !newContent.trim()) return;
    
    console.log('Sending new message:', { subject: newSubject, content: newContent });
    setNewSubject('');
    setNewContent('');
    setShowNewMessage(false);
    // In real implementation, this would send the message to the board
  };

  // Handle sending reply
  const handleSendReply = (messageId: string) => {
    if (!replyText.trim()) return;
    
    console.log('Sending reply to message:', messageId, 'Content:', replyText);
    setReplyText('');
    // In real implementation, this would send the reply
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-gray-100 text-gray-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with New Message Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
          <p className="text-sm text-gray-600">
            Communicate with your HOA board members
          </p>
        </div>
        <Button 
          onClick={() => setShowNewMessage(!showNewMessage)}
          className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* New Message Form */}
      {showNewMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Send Message to HOA Board</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Enter message subject..."
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <Textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full resize-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setShowNewMessage(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!newSubject.trim() || !newContent.trim()}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        {messages.map((message) => (
          <Card 
            key={message.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedMessage === message.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
          >
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-green-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{message.sender}</h4>
                      <p className="text-sm text-gray-600">Board Member</p>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{message.subject}</h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {message.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                  
                  {selectedMessage === message.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {message.content}
                      </p>
                      
                      {/* Reply Section */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Reply</h4>
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          className="w-full resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end mt-3">
                          <Button
                            onClick={() => handleSendReply(message.id)}
                            disabled={!replyText.trim()}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex sm:flex-col items-start sm:items-end gap-2">
                  <Badge className={getStatusColor(message.status)} variant="secondary">
                    {message.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {messages.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600 mb-4">
              Start a conversation with your HOA board by sending your first message.
            </p>
            <Button 
              onClick={() => setShowNewMessage(true)}
              variant="outline" 
              className="text-primary border-primary hover:bg-primary hover:text-white"
            >
              Send First Message
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HomeownerMessages;
