"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  Brain,
  MessageCircle,
  Sparkles,
  Target,
  Users,
  TestTube,
  Heart,
  Clock,
  X,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";
import { detectLanguage, getTranslation, getKeywords, getQuickActions, SupportedLanguage } from "@/utils/multilingual";

interface ChatMessage {
  id: string;
  type: "user" | "ai" | "suggestion";
  content: string;
  timestamp: Date;
  suggestions?: {
    text: string;
    action: string;
    icon: React.ComponentType<any>;
  }[];
}

interface SearchResult {
  type: "therapist" | "test" | "module" | "article";
  title: string;
  description: string;
  path: string;
  relevance: number;
}

export default function AISearchChat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("en");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Dynamic keywords based on detected language
  const getRoutingKeywords = (language: SupportedLanguage) => ({
    therapist: getKeywords("therapist", language),
    tests: ["test", "assessment", "quiz", "evaluation", "psychology test"],
    modules: ["module", "analysis", "synclyze", "shadowlyze", "ai module"],
    depression: getKeywords("depression", language),
    anxiety: getKeywords("anxiety", language),
    relationship: ["relationship", "love", "partner", "romantic", "marriage"]
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Load chat history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChat = localStorage.getItem("aiChatHistory");
      if (savedChat) {
        try {
          const parsedMessages = JSON.parse(savedChat);
          // Convert timestamp strings back to Date objects
          const messagesWithDates = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setChatMessages(messagesWithDates);
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      }
    }
  }, []);

  // Save chat to localStorage
  const saveChatHistory = (messages: ChatMessage[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem("aiChatHistory", JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    }
  };

  // Update current language when user types
  const updateLanguage = (text: string) => {
    const detectedLang = detectLanguage(text);
    setCurrentLanguage(detectedLang);
    return detectedLang;
  };

  // Smart routing based on multilingual keywords
  const getSmartRouting = (query: string, language: SupportedLanguage): SearchResult[] => {
    const results: SearchResult[] = [];
    const lowercaseQuery = query.toLowerCase();
    const keywords = getRoutingKeywords(language);
    
    // Check for therapist keywords
    if (keywords.therapist.some(keyword => lowercaseQuery.includes(keyword.toLowerCase()))) {
      results.push({
        type: "therapist",
        title: getTranslation("therapists", language, "sections"),
        description: "Connect with professional therapists worldwide",
        path: "/therapists",
        relevance: 0.9
      });
    }

    // Check for test keywords
    if (keywords.tests.some(keyword => lowercaseQuery.includes(keyword.toLowerCase()))) {
      results.push({
        type: "test",
        title: getTranslation("tests", language, "sections"),
        description: "Take AI-powered psychological assessments",
        path: "/tests",
        relevance: 0.8
      });
    }

    // Check for module keywords
    if (keywords.modules.some(keyword => lowercaseQuery.includes(keyword.toLowerCase()))) {
      results.push({
        type: "module",
        title: getTranslation("modules", language, "sections"),
        description: "Advanced psychological analysis tools",
        path: "/modules",
        relevance: 0.7
      });
    }

    // Check for depression keywords
    if (keywords.depression.some(keyword => lowercaseQuery.includes(keyword.toLowerCase()))) {
      results.push({
        type: "test",
        title: language === "fa" ? "ارزیابی افسردگی" : "Depression Assessment",
        description: language === "fa" ? "تست تخصصی غربالگری افسردگی" : "Professional depression screening test",
        path: "/tests/stress-psychology",
        relevance: 0.95
      });
    }

    // Check for anxiety keywords
    if (keywords.anxiety.some(keyword => lowercaseQuery.includes(keyword.toLowerCase()))) {
      results.push({
        type: "test",
        title: language === "fa" ? "تست اضطراب و استرس" : "Anxiety & Stress Test",
        description: language === "fa" ? "ارزیابی جامع اضطراب" : "Comprehensive anxiety evaluation",
        path: "/tests/stress-psychology", 
        relevance: 0.95
      });
    }

    return results.sort((a, b) => b.relevance - a.relevance);
  };

  // Generate AI response in multiple languages
  const generateAIResponse = async (userMessage: string, language: SupportedLanguage): Promise<string> => {
    const routing = getSmartRouting(userMessage, language);
    
    try {
      const languageNames = {
        fa: "Persian/Farsi", en: "English", ar: "Arabic", es: "Spanish", fr: "French",
        de: "German", it: "Italian", ru: "Russian", zh: "Chinese", ja: "Japanese",
        ko: "Korean", hi: "Hindi", tr: "Turkish", pt: "Portuguese", nl: "Dutch"
      };

      const prompt = userMessage;

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language }),
      });

      const data = await response.json();
      return data.aiResponse || getTranslation("understanding", language);
    } catch (error) {
      return getTranslation("understanding", language);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    // Detect language and update current language
    const detectedLanguage = updateLanguage(searchQuery);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: searchQuery,
      timestamp: new Date()
    };

    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setShowChat(true);
    setIsLoading(true);

    // Get smart routing results with detected language
    const routing = getSmartRouting(searchQuery, detectedLanguage);
    setSearchResults(routing);

    try {
      // Generate AI response in detected language
      const aiResponse = await generateAIResponse(searchQuery, detectedLanguage);
      
      // Create suggestions based on routing
      const suggestions = routing.slice(0, 3).map(result => ({
        text: result.title,
        action: result.path,
        icon: result.type === "therapist" ? Users : 
              result.type === "test" ? TestTube : 
              result.type === "module" ? Brain : Heart
      }));

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
        suggestions: suggestions.length > 0 ? suggestions : undefined
      };

      const finalMessages = [...newMessages, aiMessage];
      setChatMessages(finalMessages);
      saveChatHistory(finalMessages);

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: getTranslation("understanding", detectedLanguage),
        timestamp: new Date()
      };
      const finalMessages = [...newMessages, errorMessage];
      setChatMessages(finalMessages);
      saveChatHistory(finalMessages);
    }

    setIsLoading(false);
    setSearchQuery("");
  };

  const handleSuggestionClick = (action: string) => {
    router.push(action);
  };

  const clearChat = () => {
    setChatMessages([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("aiChatHistory");
    }
    setShowChat(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 overflow-hidden">
          <div className="pl-6 pr-4">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // Update language as user types
              if (e.target.value.trim()) {
                updateLanguage(e.target.value);
              }
            }}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder={
              currentLanguage === "fa" ? "هر چیزی که در ذهن دارید بنویسید..." :
              currentLanguage === "es" ? "Escribe lo que tengas en mente..." :
              "Write whatever is on your mind..."
            }
            className="flex-1 px-4 py-5 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isLoading}
            className="mr-2 p-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 rounded-full transition-all"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </motion.div>
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Chat Interface */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mt-6 bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    {currentLanguage === "fa" ? "دستیار هوشمند روانشناسی" :
                     currentLanguage === "es" ? "Asistente de Psicología IA" :
                     "AI Psychology Assistant"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {currentLanguage === "fa" ? "برای کمک به سفر سلامت روان شما اینجا هستم" :
                     currentLanguage === "es" ? "Aquí para ayudarte en tu viaje de salud mental" :
                     "Here to help with your mental health journey"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearChat}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowChat(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Start a conversation about your mental health concerns</p>
                  <p className="text-gray-500 text-sm mt-2">I'm here to listen and guide you to the right resources</p>
                </div>
              )}

              {chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                    <div className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === "user" 
                          ? "bg-gradient-to-r from-purple-500 to-pink-500" 
                          : "bg-gradient-to-r from-teal-500 to-blue-500"
                      }`}>
                        {message.type === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      
                      <div className={`flex-1 ${message.type === "user" ? "text-right" : "text-left"}`}>
                        <div className={`inline-block p-4 rounded-2xl ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-slate-800 text-gray-200"
                        }`}>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        
                        {/* AI Suggestions */}
                        {message.suggestions && (
                          <div className="mt-3 space-y-2">
                            <p className="text-gray-400 text-sm">Suggested actions:</p>
                            {message.suggestions.map((suggestion, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSuggestionClick(suggestion.action)}
                                className="flex items-center gap-2 w-full p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-left transition-colors group"
                              >
                                <suggestion.icon className="w-4 h-4 text-teal-400" />
                                <span className="text-white group-hover:text-teal-300 transition-colors">
                                  {suggestion.text}
                                </span>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-teal-400 ml-auto transition-colors" />
                              </motion.button>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-800 p-4 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-2 h-2 bg-teal-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          className="w-2 h-2 bg-teal-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          className="w-2 h-2 bg-teal-400 rounded-full"
                        />
                        <span className="text-gray-400 text-sm ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions - Dynamic based on language */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex flex-wrap gap-2">
                {getQuickActions(currentLanguage).map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchQuery(action.query);
                      setTimeout(handleSearch, 100); // Small delay to ensure searchQuery is set
                    }}
                    className="px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
                  >
                    {action.text}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
