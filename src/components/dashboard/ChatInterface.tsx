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
  hoaIds?: string[]; // Add this prop for all joined communities
  documents: Array<{ id: string; name: string; summary: string; }>;
}

/**
 * Chat Interface Component - RAG Powered
 * AI-powered Q&A interface for document-based queries
 * Provides contextual responses based on uploaded HOA documents
 */
const ChatInterface = ({ hoaId, hoaIds = [], documents }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hello! I'm your HOA AI assistant. I can help you understand your community rules and regulations based on your uploaded documents. What would you like to know?" }
  ]);
  
  // Generate dynamic questions based on available documents
  const generateSuggestedQuestions = () => {
    const baseQuestions = [
      "What are the HOA fees and when are they due?",
      "What are the rules about parking?",
      "Can I make changes to my property?",
      "What are the maintenance responsibilities?",
      "How do I report a violation?",
      "What are the quiet hours?"
    ];

    // If we have documents, try to generate more specific questions
    if (documents.length > 0) {
      const processedDocs = documents.filter(doc => doc.summary && doc.summary.trim() !== '');
      
      if (processedDocs.length > 0) {
        // Add document-specific questions
        const docQuestions = processedDocs.map(doc => {
          const docName = doc.name.toLowerCase();
          if (docName.includes('bylaws') || docName.includes('cc&r')) {
            return "What are the main rules and restrictions?";
          } else if (docName.includes('budget') || docName.includes('financial')) {
            return "What are the current fees and assessments?";
          } else if (docName.includes('maintenance') || docName.includes('repair')) {
            return "What maintenance is the HOA responsible for?";
          } else if (docName.includes('parking') || docName.includes('vehicle')) {
            return "What are the parking rules and restrictions?";
          } else if (docName.includes('architectural') || docName.includes('modification')) {
            return "What changes require HOA approval?";
          } else {
            return `What's in the ${doc.name} document?`;
          }
        });

        // Combine base questions with document-specific ones, removing duplicates
        const allQuestions = [...baseQuestions, ...docQuestions];
        return [...new Set(allQuestions)].slice(0, 8); // Limit to 8 questions
      }
    }

    return baseQuestions;
  };

  // Load AI-generated questions when documents change
  useEffect(() => {
    const loadAIGeneratedQuestions = async () => {
      if (documents.length === 0) return;
      
      const processedDocs = documents.filter(doc => doc.summary && doc.summary.trim() !== '');
      if (processedDocs.length === 0) return;

      setLoadingQuestions(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const response = await fetch('https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ 
            documents: processedDocs,
            hoaId: hoaId
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.questions && data.questions.length > 0) {
            setSuggestedQuestions(data.questions);
          }
        }
      } catch (error) {
        console.error('Failed to load AI-generated questions:', error);
        // Fallback to generated questions
        setSuggestedQuestions(generateSuggestedQuestions());
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadAIGeneratedQuestions();
  }, [documents, hoaId]);

  // Example: Fetch chat users from all joined communities
  useEffect(() => {
    const fetchChatUsers = async () => {
      if (!hoaIds.length) return;
      console.log('[ChatInterface] Fetching chat users for hoaIds:', hoaIds);
      // Fetch all approved members from all joined communities
      const { data: members, error } = await supabase
        .from("hoa_join_requests")
        .select("user_id, hoa_id, status")
        .in("hoa_id", hoaIds)
        .eq("status", "approved");
      console.log('[ChatInterface] Members fetched:', members, 'Error:', error);
      // TODO: Set chat users state here if you use it
      // setChatUsers(members || []);
    };
    fetchChatUsers();
  }, [hoaIds]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "What are the HOA fees and when are they due?",
    "What are the rules about parking?",
    "Can I make changes to my property?",
    "What are the maintenance responsibilities?",
    "How do I report a violation?",
    "What are the quiet hours?"
  ]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuestionSubmit = async (questionText: string) => {
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: questionText };

    const { data: { session } } = await supabase.auth.getSession();
    // Prepare document context for better RAG
    const documentContext = documents
      .filter(doc => doc.summary && doc.summary.trim() !== '')
      .map(doc => ({
        name: doc.name,
        summary: doc.summary,
        id: doc.id
      }));

    const response = await fetch('https://yurteupcbisnkcrtjsbv.supabase.co/functions/v1/ask-ai-assistant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          documents: documentContext,
          hoaId: hoaId
        })
    });

    const data = await response.json();
    
    // Handle different response scenarios
    let assistantMessage = '';
    if (response.ok && data.answer) {
      assistantMessage = data.answer;
    } else if (data.error) {
      assistantMessage = `I'm sorry, I encountered an error: ${data.error}. Please try again or contact support if the issue persists.`;
    } else if (documents.length === 0) {
      assistantMessage = "I don't have access to any documents yet. Please upload some HOA documents first so I can help answer your questions.";
    } else if (documents.filter(doc => doc.summary && doc.summary.trim() !== '').length === 0) {
      assistantMessage = "I can see you have documents uploaded, but they're still being processed. Please wait a few moments for the AI summaries to be generated, then try asking your question again.";
    } else {
      assistantMessage = "I'm sorry, I couldn't find specific information about that in your uploaded documents. Try asking about:\n\n• HOA rules and regulations\n• Fee structures and payment schedules\n• Maintenance responsibilities\n• Community guidelines\n• Or be more specific about what you're looking for";
    }
    
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: assistantMessage }]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    await handleQuestionSubmit(input);
  };

  return (
    <div className="space-y-4">
      {/* Document Status */}
      {documents.length > 0 && (
        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
          <span className="font-medium">Available documents:</span> {documents.filter(doc => doc.summary && doc.summary.trim() !== '').length} of {documents.length} processed
          {documents.filter(doc => !doc.summary || doc.summary.trim() === '').length > 0 && (
            <span className="text-orange-600 ml-2">
              ({documents.filter(doc => !doc.summary || doc.summary.trim() === '').length} still processing...)
            </span>
          )}
        </div>
      )}
      
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

          {/* Suggested Questions */}
          {documents.length > 0 && (
            <div className="border-t p-2 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">
                Try asking:
                {loadingQuestions && (
                  <span className="ml-2 text-orange-600">(Generating questions...)</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(question);
                      // Auto-submit the question
                      const userMessage: Message = { id: Date.now().toString(), role: 'user', content: question };
                      setMessages(prev => [...prev, userMessage]);
                      setInput('');
                      setIsLoading(true);
                      
                      // Call the same submit logic
                      handleQuestionSubmit(question);
                    }}
                    className="text-xs sm:text-sm px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

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
