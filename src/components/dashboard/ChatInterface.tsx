import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send, Bot, User } from "lucide-react";

interface ChatInterfaceProps {
  documents: Array<{
    id: string;
    name: string;
    summary: string;
  }>;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

/**
 * Chat Interface Component
 * AI-powered Q&A interface for document-based queries
 * Provides contextual responses based on uploaded HOA documents
 */
const ChatInterface = ({ documents }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your HOA AI assistant. I can help you understand your community rules and regulations based on your uploaded documents. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Generate AI response based on user query
  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Sample responses based on common HOA queries
    if (message.includes('pet') || message.includes('dog') || message.includes('cat')) {
      return "Based on your HOA documents, pet policies typically include: Maximum of 2 pets per unit, breed restrictions may apply (check specific document for details), pets must be leashed in common areas, and owners are responsible for cleanup. Would you like me to look up specific breed restrictions?";
    }
    
    if (message.includes('parking')) {
      return "Your HOA parking rules include: 2 designated parking spaces per unit, guest parking is available but limited to 72 hours, vehicles must be registered with management, and no commercial vehicles or RVs in resident parking. Violations may result in towing at owner's expense.";
    }
    
    if (message.includes('noise') || message.includes('quiet')) {
      return "Noise ordinances in your community: Quiet hours are typically 10 PM to 7 AM on weekdays and 11 PM to 8 AM on weekends. Excessive noise complaints will result in written warnings, followed by fines. Music, parties, and construction activities must comply with these hours.";
    }
    
    if (message.includes('fee') || message.includes('dues') || message.includes('payment')) {
      return "HOA fees and payment information: Monthly dues vary by unit type (typically $200-$400), payments are due by the 1st of each month, late fees apply after 15 days, and you can pay online through the resident portal or by check. Special assessments may apply for major community improvements.";
    }
    
    if (message.includes('pool') || message.includes('amenities') || message.includes('gym')) {
      return "Community amenities access: Pool hours are 6 AM to 10 PM daily, fitness center requires key fob access, common areas can be reserved for private events, and guests must be accompanied by residents. Some amenities may have seasonal restrictions.";
    }
    
    // Default response
    return "I'd be happy to help you with that question! Based on your uploaded HOA documents, I can provide specific information about community rules, fees, amenities, and compliance requirements. Could you please be more specific about what aspect of your HOA you'd like to know about?";
  };

  // Handle sending a message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-4">
      {/* Document Status */}
      {documents.length === 0 ? (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">No documents uploaded</p>
                <p className="text-sm text-yellow-700">
                  Upload HOA documents first to enable AI-powered Q&A support.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">
                  {documents.length} document{documents.length > 1 ? 's' : ''} loaded
                </p>
                <p className="text-sm text-green-700">
                  AI is ready to answer questions about your HOA documents.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      <Card className="min-h-[300px] h-full flex flex-col">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90vw] sm:max-w-xs lg:max-w-md px-2 sm:px-4 py-2 rounded-lg break-words whitespace-pre-line word-break min-w-0 ${
                    message.type === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    {message.type === 'bot' && (
                      <Bot className="h-4 w-4 mt-1 text-gray-600" />
                    )}
                    {message.type === 'user' && (
                      <User className="h-4 w-4 mt-1 text-white" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm break-words whitespace-pre-line min-w-0">{message.content}</p>
                      <p className={`text-[11px] sm:text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-gray-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t p-2 sm:p-4">
            <div className="flex flex-col xs:flex-row gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  documents.length === 0 
                    ? "Upload documents first to start chatting..." 
                    : "Ask about your HOA rules, fees, or policies..."
                }
                disabled={documents.length === 0 || isTyping}
                className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed text-xs sm:text-base min-h-[40px] sm:min-h-[44px]"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || documents.length === 0 || isTyping}
                className="bg-[#254F70] hover:bg-primary/90 min-h-[40px] sm:min-h-[44px] px-3 sm:px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
