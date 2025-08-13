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
import { useRouter } from "next/navigation";
import { detectLanguage, SupportedLanguage, SUPPORTED_LANGUAGES } from "@/utils/multilingual";
import { useLanguage, normalizeToAppLanguage } from "@/providers/LanguageProvider";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function SimpleAISearch() {
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(globalLanguage);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [ageRange, setAgeRange] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>("en");
  const [savePermanently, setSavePermanently] = useState<boolean>(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();



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

  // Load chat history and user profile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChat = localStorage.getItem("simpleAiChatHistory");
      const savedProfile = localStorage.getItem("aiUserProfile");
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
      let shouldOpenProfileModal = false;
      if (savedProfile) {
        try {
          const p = JSON.parse(savedProfile);
          const hasDisplayName = Boolean(p.displayName && String(p.displayName).trim());
          const hasAgeRange = Boolean(p.ageRange && String(p.ageRange).trim());
          const hasGender = Boolean(p.gender && String(p.gender).trim());
          const hasLanguage = Boolean(p.language && String(p.language).trim());

          setDisplayName(p.displayName || "");
          setAgeRange(p.ageRange || "");
          setGender(p.gender || "");
          if (p.language) {
            setPreferredLanguage(p.language as SupportedLanguage);
            setCurrentLanguage(p.language as SupportedLanguage);
            setGlobalLanguage(normalizeToAppLanguage(p.language as SupportedLanguage));
          }

          if (!(hasDisplayName && hasAgeRange && hasGender && hasLanguage)) {
            shouldOpenProfileModal = true;
          }
        } catch {
          shouldOpenProfileModal = true;
        }
      } else {
        shouldOpenProfileModal = true;
      }

      if (shouldOpenProfileModal) {
        setShowProfileModal(true);
      }

      // Allow forcing the modal via URL parameter: ?profile=1 or ?forceModal=1
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('profile') === '1' || params.get('forceModal') === '1') {
          setShowProfileModal(true);
        }
      } catch {}
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

      const prompt = userMessage;

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

    // Ensure profile is collected before search
    if (!displayName || !ageRange || !gender || !preferredLanguage) {
      setShowProfileModal(true);
      return;
    }

    // Prefer user's chosen language over detection
    const detectedLanguage = detectLanguage(searchQuery);
    const languageToUse: SupportedLanguage = preferredLanguage || globalLanguage || detectedLanguage;
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

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-6 text-white">
                <h3 className="text-xl font-bold">Personalize your AI</h3>
                <p className="opacity-90 text-sm">Please provide a few details so we can tailor guidance.</p>
              </div>
              <div className="p-6 space-y-4 text-gray-800">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter a name you'd like me to use"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Age Range</label>
                    <select
                      value={ageRange}
                      onChange={(e) => setAgeRange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select age range</option>
                      <option value="15-20">15 - 20</option>
                      <option value="20-25">20 - 25</option>
                      <option value="25-30">25 - 30</option>
                      <option value="30-35">30 - 35</option>
                      <option value="35-40">35 - 40</option>
                      <option value="40-45">40 - 45</option>
                      <option value="45-50">45 - 50</option>
                      <option value="50-60">50 - 60</option>
                      <option value="60-70">60 - 70</option>
                      <option value="70-80">70 - 80</option>
                      <option value="80+">80+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male ♂</option>
                      <option value="female">Female ♀</option>
                      <option value="other">Other / Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value as SupportedLanguage)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select language</option>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.nativeName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    id="savePermanently"
                    type="checkbox"
                    checked={savePermanently}
                    onChange={(e) => setSavePermanently(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="savePermanently" className="text-sm text-gray-700 select-none">
                    Save these details to my profile for future visits
                  </label>
                </div>

                <button
                  disabled={!displayName || !ageRange || !gender || !preferredLanguage}
                  onClick={() => {
                    const profile = {
                      displayName,
                      ageRange,
                      gender,
                      language: preferredLanguage,
                    };
                    if (typeof window !== 'undefined') {
                      if (savePermanently) {
                        localStorage.setItem('aiUserProfile', JSON.stringify(profile));
                      } else {
                        // Ensure it's not stored permanently
                        localStorage.removeItem('aiUserProfile');
                      }
                    }
                    setCurrentLanguage(preferredLanguage);
                    setGlobalLanguage(normalizeToAppLanguage(preferredLanguage));
                    setShowProfileModal(false);
                  }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    displayName && ageRange && gender && preferredLanguage
                      ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Quick actions */}
      <div className="flex items-center justify-end mb-2">
        <button
          type="button"
          onClick={() => setShowProfileModal(true)}
          className="text-sm text-teal-300 hover:text-teal-200 underline"
        >
          Edit profile
        </button>
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
