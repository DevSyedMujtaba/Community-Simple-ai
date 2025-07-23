import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Send, Bot, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface ChatInterfaceProps {
  hoaId: string;
  documents: Array<{ id: string; name: string; summary: string; }>;
}

/**
 * Chat Interface Component - RAG Powered
 * AI-powered Q&A interface for document-based queries
 * Provides contextual responses based on uploaded HOA documents
 */
const ChatInterface = ({ hoaId, documents }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hello! I'm your HOA AI assistant. I can help you understand your community rules and regulations based on your uploaded documents. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/ask-ai-assistant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] })
    });

    const data = await response.json();
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.answer }]);
    // Log token usage if available
    if (data.tokens_used) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id) {
        await supabase.from('token_usage').insert([
          {
            user_id: user.id,
            tokens_used: data.tokens_used,
            created_at: new Date().toISOString(),
          }
        ]);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Chat Messages */}
      <Card className="min-h-[300px] h-full flex flex-col">
        <CardContent className="p-0 h-full flex flex-col">
          <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90vw] sm:max-w-xs lg:max-w-md px-2 sm:px-4 py-2 rounded-lg break-words whitespace-pre-line word-break min-w-0 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    {message.role === 'assistant' && (
                      <Bot className="h-4 w-4 mt-1 text-gray-600" />
                    )}
                    {message.role === 'user' && (
                      <User className="h-4 w-4 mt-1 text-white" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm break-words whitespace-pre-line min-w-0">{message.content}</p>
                      <p className={`text-[11px] sm:text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isLoading && (
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
          <form onSubmit={handleSubmit} className="border-t p-2 sm:p-4">
            <div className="flex flex-col xs:flex-row gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  documents.length === 0 
                    ? "Upload documents first to start chatting..." 
                    : "Ask about your HOA rules, fees, or policies..."
                }
                disabled={documents.length === 0 || isLoading}
                className="flex-1 p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed text-xs sm:text-base min-h-[40px] sm:min-h-[44px]"
              />
              <Button
                type="submit"
                disabled={!input.trim() || documents.length === 0 || isLoading}
                className="bg-[#254F70] hover:bg-primary/90 min-h-[40px] sm:min-h-[44px] px-3 sm:px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
