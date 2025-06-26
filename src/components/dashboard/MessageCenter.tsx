import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, User, Clock, Filter } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  senderType: 'homeowner' | 'board';
  recipient: string;
  subject: string;
  content: string;
  timestamp: Date;
  status: 'unread' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high';
  category: string;
}

/**
 * Message Center Component for Board Members
 * Handles communication between board members and homeowners
 * Features message threading, filtering, and status management
 */
const MessageCenter = () => {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  type FilterType = 'all' | 'unread' | 'replied';
  const [filter, setFilter] = useState<FilterType>('all');
  const [replyText, setReplyText] = useState('');

  // Sample messages data
  const messages: Message[] = [
    {
      id: '1',
      sender: 'Sarah Johnson',
      senderType: 'homeowner',
      recipient: 'HOA Board',
      subject: 'Pet Policy Clarification',
      content: 'Hello, I recently adopted a rescue dog and want to make sure I\'m following all pet policies correctly. The breed is listed as a mix, so I\'m not sure if it falls under any breed restrictions. Can you please clarify the registration process and any specific requirements?',
      timestamp: new Date('2024-01-15T10:30:00'),
      status: 'unread',
      priority: 'medium',
      category: 'Pets'
    },
    {
      id: '2',
      sender: 'Mike Chen',
      senderType: 'homeowner',
      recipient: 'HOA Board',
      subject: 'Guest Parking Issue',
      content: 'My guests were towed from the visitor parking area last night. They arrived at 7 PM and were towed around 11 PM. I thought the 72-hour limit applied to consecutive days, not within the same day. Please help me understand the policy and how to get their car back.',
      timestamp: new Date('2024-01-14T14:20:00'),
      status: 'replied',
      priority: 'high',
      category: 'Parking'
    },
    {
      id: '3',
      sender: 'Linda Rodriguez',
      senderType: 'homeowner',
      recipient: 'HOA Board',
      subject: 'Architectural Request Submission',
      content: 'I would like to install solar panels on my roof and paint my front door a different color. I have the specifications and color samples ready. What is the process for submitting an architectural request, and how long does approval typically take?',
      timestamp: new Date('2024-01-13T09:15:00'),
      status: 'read',
      priority: 'medium',
      category: 'Architecture'
    },
    {
      id: '4',
      sender: 'David Wilson',
      senderType: 'homeowner',
      recipient: 'HOA Board',
      subject: 'Noise Complaint Follow-up',
      content: 'Following up on my previous noise complaint about unit 205B. The loud music and parties are still happening past quiet hours multiple times per week. I\'ve documented dates and times. What is the next step in the violation process?',
      timestamp: new Date('2024-01-12T16:45:00'),
      status: 'unread',
      priority: 'high',
      category: 'Noise'
    },
    {
      id: '5',
      sender: 'Emma Thompson',
      senderType: 'homeowner',
      recipient: 'HOA Board',
      subject: 'Community Pool Schedule Question',
      content: 'I noticed the pool schedule posted online shows different hours than what\'s posted at the pool area. Could you please clarify the correct operating hours? Also, are there any planned maintenance closures coming up?',
      timestamp: new Date('2024-01-11T11:00:00'),
      status: 'replied',
      priority: 'low',
      category: 'Amenities'
    }
  ];

  // Filter messages based on status
  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.status === filter;
  });

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
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

  // Handle sending reply
  const handleSendReply = (messageId: string) => {
    console.log('Sending reply to message:', messageId, 'Content:', replyText);
    setReplyText('');
    // In real implementation, this would send the reply and update message status
  };

  return (
    <div className="space-y-6">
      {/* Message Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {messages.filter(m => m.status === 'unread').length}
            </div>
            <div className="text-sm text-gray-600">Unread</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {messages.filter(m => m.priority === 'high').length}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {messages.filter(m => m.status === 'replied').length}
            </div>
            <div className="text-sm text-gray-600">Replied</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {messages.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
        </div>
        <div className="flex space-x-2">
          {(['all', 'unread', 'replied'] as FilterType[]).map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption)}
              className="capitalize min-w-[80px]"
            >
              {filterOption}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredMessages.map((message) => (
          <Card 
            key={message.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedMessage === message.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
          >
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 min-w-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="bg-gray-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base break-words">{message.sender}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">Unit Homeowner</p>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg break-words">{message.subject}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mb-3 break-words">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {message.timestamp.toLocaleDateString()}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {message.category}
                    </Badge>
                  </div>
                  {selectedMessage === message.id && (
                    <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base break-words">
                        {message.content}
                      </p>
                      {/* Reply Section */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Reply to {message.sender}</h4>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your response..."
                          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none text-sm sm:text-base min-h-[44px] break-words"
                          rows={4}
                        />
                        <div className="flex justify-end mt-3">
                          <Button
                            onClick={() => handleSendReply(message.id)}
                            disabled={!replyText.trim()}
                            className="bg-primary hover:bg-primary/90 min-h-[44px]"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-row sm:flex-col items-end sm:items-end space-x-2 sm:space-x-0 sm:space-y-2 mt-2 sm:mt-0">
                  <Badge className={getPriorityColor(message.priority)} variant="outline">
                    {message.priority} priority
                  </Badge>
                  <Badge className={getStatusColor(message.status)} variant="secondary">
                    {message.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {filter === 'all' 
                ? 'No messages from homeowners yet.' 
                : `No ${filter} messages at this time.`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MessageCenter;
