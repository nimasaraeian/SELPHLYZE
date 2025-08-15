"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Send, 
  Bot, 
  User, 
  Brain,
  Clock,
  X,
  RefreshCw
} from "lucide-react";
import { detectLanguage, SupportedLanguage, SUPPORTED_LANGUAGES } from "@/utils/multilingual";
import { useLanguage, normalizeToAppLanguage } from "@/providers/LanguageProvider";
import { useUserTracking } from "@/hooks/useUserTracking";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function SimpleAISearch() {
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage();
  const { getUserFirstName, isLoggedIn, trackAIConversation } = useUserTracking();
  const userFirstName = getUserFirstName();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(globalLanguage);
  const chatEndRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    // Only scroll within the chat container, not the entire page
    if (showChat && chatMessages.length > 0 && chatEndRef.current) {
      setTimeout(() => {
        const chatContainer = chatEndRef.current?.closest('.overflow-y-auto');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 150);
    }
  }, [chatMessages, showChat]);

  // Load chat history
  useEffect(() => {
    setCurrentLanguage(globalLanguage);
  }, [globalLanguage]);

  // Load chat history only (no profile collection on landing)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChat = localStorage.getItem("simpleAiChatHistory");
      if (savedChat) {
        try {
          const parsedMessages = JSON.parse(savedChat);
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
        localStorage.setItem("simpleAiChatHistory", JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    }
  };

  // Smart routing suggestions
  const getRoutingSuggestions = (query: string): string[] => {
    const suggestions: string[] = [];
    const lowercaseQuery = query.toLowerCase();
    
    if (['therapist', 'therapy', 'counselor', 'تراپیست', 'روانشناس', 'مشاور'].some(keyword => lowercaseQuery.includes(keyword))) {
      suggestions.push(currentLanguage === "fa" ? "🔗 یافتن تراپیست‌ها" : "🔗 Find Therapists");
    }
    
    if (['test', 'assessment', 'تست', 'آزمون', 'ارزیابی'].some(keyword => lowercaseQuery.includes(keyword))) {
      suggestions.push(currentLanguage === "fa" ? "🔗 تست‌های روانشناسی" : "🔗 Psychology Tests");
    }
    
    if (['depression', 'افسردگی', 'غمگین', 'sad'].some(keyword => lowercaseQuery.includes(keyword))) {
      suggestions.push(currentLanguage === "fa" ? "🔗 تست افسردگی" : "🔗 Depression Test");
    }
    
    return suggestions;
  };

  // Generate AI response
  const generateAIResponse = async (userMessage: string, language: SupportedLanguage): Promise<string> => {
    try {
      const languageNames: Record<SupportedLanguage, string> = {
        en: "English",
        fa: "Persian/Farsi",
        ar: "Arabic",
        tr: "Turkish",
        es: "Spanish",
        fr: "French",
        ru: "Russian",
        zh: "Chinese",
        ja: "Japanese",
        ko: "Korean",
        hi: "Hindi",
        pt: "Portuguese",
      };

      // Create personalized prompt
      let prompt = userMessage;
      if (isLoggedIn && userFirstName) {
        prompt = `User: ${userFirstName} is asking: "${userMessage}". Please address them personally by their name (${userFirstName}) and provide a helpful psychology-focused response.`;
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const fallbacks: Record<SupportedLanguage, string> = {
        fa: "متوجه نگرانی شما هستم. بیایید منابع مناسب را برای شما پیدا کنیم.",
        ar: "أنا أتفهم قلقك. دعني أساعدك في العثور على الموارد المناسبة.",
        tr: "Endişeni anlıyorum. Sana uygun kaynakları bulmana yardımcı olayım.",
        es: "Entiendo tu preocupación. Déjame ayudarte a encontrar los recursos adecuados.",
        fr: "Je comprends votre inquiétude. Laissez-moi vous aider à trouver les bonnes ressources.",
        ru: "Я понимаю вашу обеспокоенность. Позвольте помочь найти подходящие ресурсы.",
        zh: "我理解你的担忧。让我帮助你找到合适的资源。",
        ja: "ご心配を理解しています。適切なリソースを見つけるお手伝いをします。",
        ko: "걱정하시는 마음 이해합니다. 적절한 자료를 찾을 수 있도록 도와드릴게요.",
        hi: "मैं आपकी चिंता समझता हूँ। मैं आपको सही संसाधन ढूँढने में मदद करता हूँ।",
        pt: "Entendo sua preocupação. Deixe-me ajudar a encontrar os recursos certos.",
        en: "I understand your concern. Let me help you find the right resources.",
      };
      return data.aiResponse || fallbacks[language];
    } catch (error) {
      console.error("AI Response Error:", error);
      const fallbacks: Record<SupportedLanguage, string> = {
        fa: "متوجه نگرانی شما هستم. بیایید منابع مناسب را برای شما پیدا کنیم.",
        ar: "أنا أتفهم قلقك. دعني أساعدك في العثور على الموارد المناسبة.",
        tr: "Endişeni anlıyorum. Sana uygun kaynakları bulmana yardımcı olayım.",
        es: "Entiendo tu preocupación. Déjame ayudarte a encontrar los recursos adecuados.",
        fr: "Je comprends votre inquiétude. Laissez-moi vous aider à trouver les bonnes ressources.",
        ru: "Я понимаю вашу обеспокоенность. Позвольте помочь найти подходящие ресурсы.",
        zh: "我理解你的担忧。让我帮助你找到合适的资源。",
        ja: "ご心配を理解しています。適切なリソースを見つけるお手伝いをします。",
        ko: "걱정하시는 마음 이해합니다. 적절한 자료를 찾을 수 있도록 도와드릴게요.",
        hi: "मैं आपकी चिंता समझता हूँ। मैं आपको सही संसाधन ढूँढने में मदद करता हूँ।",
        pt: "Entendo sua preocupação. Deixe-me ajudar a encontrar os recursos certos.",
        en: "I understand your concern. Let me help you find the right resources.",
      };
      return fallbacks[language];
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    // Prefer user's chosen language over detection
    const detectedLanguage = detectLanguage(searchQuery);
    const languageToUse: SupportedLanguage = globalLanguage || detectedLanguage;
    setCurrentLanguage(languageToUse);
    setGlobalLanguage(normalizeToAppLanguage(languageToUse));

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

    try {
      const aiResponse = await generateAIResponse(searchQuery, languageToUse);
      const suggestions = getRoutingSuggestions(searchQuery);
      
      let fullAiResponse = aiResponse;
      if (suggestions.length > 0) {
        fullAiResponse += "\n\n" + suggestions.join("\n");
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: fullAiResponse,
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, aiMessage];
      setChatMessages(finalMessages);
      saveChatHistory(finalMessages);
      
      // Track AI conversation for user
      trackAIConversation(searchQuery, fullAiResponse);

    } catch (error) {
      console.error("Search Error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: currentLanguage === "fa" 
          ? "متاسفانه مشکلی پیش آمد. لطفاً دوباره تلاش کنید."
          : "Sorry, something went wrong. Please try again.",
        timestamp: new Date()
      };
      const finalMessages = [...newMessages, errorMessage];
      setChatMessages(finalMessages);
      saveChatHistory(finalMessages);
    }

    setIsLoading(false);
    setSearchQuery("");
  };

  const clearChat = () => {
    setChatMessages([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("simpleAiChatHistory");
    }
    setShowChat(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* Language selector (replaces Start) */}
      <div className="flex items-center justify-center mb-4">
        <select
          value={currentLanguage}
          onChange={(e) => {
            const code = e.target.value as SupportedLanguage;
            setCurrentLanguage(code);
            setGlobalLanguage(normalizeToAppLanguage(code));
          }}
          className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.nativeName}
            </option>
          ))}
        </select>
      </div>

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
              if (e.target.value.trim()) {
                setCurrentLanguage(detectLanguage(e.target.value));
              }
            }}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder={
              !searchQuery.trim()
                ? (
                    currentLanguage === "fa" ? "هر چیزی که در ذهن دارید بنویسید..." :
                    currentLanguage === "ar" ? "اكتب أي شيء في ذهنك..." :
                    currentLanguage === "es" ? "Escribe lo que tengas en mente..." :
                    currentLanguage === "fr" ? "Écrivez ce que vous avez en tête..." :
                    currentLanguage === "tr" ? "Aklınızda ne varsa yazın..." :
                    currentLanguage === "ru" ? "Напишите, что у вас на уме..." :
                    currentLanguage === "zh" ? "写下您心中所想..." :
                    currentLanguage === "ja" ? "心に思うことを書いてください..." :
                    currentLanguage === "ko" ? "마음에 있는 것을 써보세요..." :
                    currentLanguage === "hi" ? "अपने मन की बात लिखें..." :
                    currentLanguage === "pt" ? "Escreva o que está em sua mente..." :
                    "Write whatever is on your mind..."
                  )
                : (
                    currentLanguage === "fa" ? "هر چیزی که در ذهن دارید بنویسید..." :
                    currentLanguage === "ar" ? "اكتب أي شيء في ذهنك..." :
                    currentLanguage === "es" ? "Escribe lo que tengas en mente..." :
                    currentLanguage === "fr" ? "Écrivez ce que vous avez en tête..." :
                    currentLanguage === "tr" ? "Aklınızda ne varsa yazın..." :
                    currentLanguage === "ru" ? "Напишите, что у вас на уме..." :
                    currentLanguage === "zh" ? "写下您心中所想..." :
                    currentLanguage === "ja" ? "心に思うことを書いてください..." :
                    currentLanguage === "ko" ? "마음에 있는 것을 써보세요..." :
                    currentLanguage === "hi" ? "अपने मन की बात लिखें..." :
                    currentLanguage === "pt" ? "Escreva o que está em sua mente..." :
                    "Write whatever is on your mind..."
                  )
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
                <RefreshCw className="w-5 h-5 text-white preserve-white" />
              </motion.div>
            ) : (
              <Send className="w-5 h-5 text-white preserve-white" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Chat Interface */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mt-6 bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden max-w-full"
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
                     currentLanguage === "ar" ? "مساعد علم النفس الذكي" :
                     currentLanguage === "es" ? "Asistente de Psicología IA" :
                     currentLanguage === "fr" ? "Assistant IA Psychologie" :
                     currentLanguage === "tr" ? "AI Psikoloji Asistanı" :
                     currentLanguage === "ru" ? "ИИ Помощник Психолога" :
                     currentLanguage === "zh" ? "AI心理学助手" :
                     currentLanguage === "ja" ? "AI心理学アシスタント" :
                     currentLanguage === "ko" ? "AI 심리학 어시스턴트" :
                     currentLanguage === "hi" ? "AI मनोविज्ञान सहायक" :
                     currentLanguage === "pt" ? "Assistente de Psicologia IA" :
                     "AI Psychology Assistant"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {currentLanguage === "fa" ? "آماده کمک به شما" :
                     currentLanguage === "ar" ? "جاهز للمساعدة" :
                     currentLanguage === "es" ? "Listo para ayudar" :
                     currentLanguage === "fr" ? "Prêt à aider" :
                     currentLanguage === "tr" ? "Yardıma hazır" :
                     currentLanguage === "ru" ? "Готов помочь" :
                     currentLanguage === "zh" ? "准备帮助" :
                     currentLanguage === "ja" ? "お手伝いします" :
                     currentLanguage === "ko" ? "도움 준비 완료" :
                     currentLanguage === "hi" ? "मदद के लिए तैयार" :
                     currentLanguage === "pt" ? "Pronto para ajudar" :
                     "Ready to help"}
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
            <div className="h-64 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {currentLanguage === "fa" ? "سوال یا نگرانی خود را بنویسید" : "Write your question or concern"}
                  </p>
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
                        <span className="text-gray-400 text-sm ml-2">
                          {currentLanguage === "fa" ? "در حال پردازش..." : "Processing..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
