"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  ArrowRight,
  Brain,
  Users,
  TestTube,
  Heart,
  Clock,
  RefreshCw,
  Home,
  BookOpen,
  Settings,
  HelpCircle
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { detectLanguage, getTranslation, getKeywords, getQuickActions, SupportedLanguage } from "@/utils/multilingual";
import { useLanguage, normalizeToAppLanguage } from "@/providers/LanguageProvider";

interface ChatMessage {
  id: string;
  type: "user" | "ai" | "suggestion";
  content: string;
  timestamp: Date;
  suggestions?: {
    text: string;
    action: string;
  }[];
}

export default function FloatingAIChat() {
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(globalLanguage);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedChat = localStorage.getItem("globalAIChatHistory");
      if (savedChat) {
        try {
          const parsedMessages = JSON.parse(savedChat);
          // Convert timestamp strings back to Date objects
          const messagesWithDates = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      }
    }
  }, []);

  // Sync currentLanguage with global language
  useEffect(() => {
    setCurrentLanguage(globalLanguage);
  }, [globalLanguage]);

  // Save chat history
  const saveChatHistory = (newMessages: ChatMessage[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem("globalAIChatHistory", JSON.stringify(newMessages));
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    }
  };

  // Get current page context
  const getCurrentPageContext = () => {
    const pageContexts: Record<string, string> = {
      "/": "home page",
      "/tests": "psychology tests section",
      "/psychology": "psychology articles section", 
      "/modules": "AI psychology modules section",
      "/therapists": "therapist network section",
      "/profile": "user profile section"
    };
    
    return pageContexts[pathname] || `${pathname} section`;
  };

  // Update current language when user types
  const updateLanguage = (text: string) => {
    const detectedLang = detectLanguage(text);
    setCurrentLanguage(detectedLang);
    setGlobalLanguage(normalizeToAppLanguage(detectedLang));
    return detectedLang;
  };

  // Smart routing with page context and multilingual support
  const getContextualRouting = (query: string, language: SupportedLanguage) => {
    const lowercaseQuery = query.toLowerCase();
    const currentContext = getCurrentPageContext();
    const suggestions = [];
    const keywords = {
      therapist: getKeywords("therapist", language),
      depression: getKeywords("depression", language),
      anxiety: getKeywords("anxiety", language),
    };

    // Home navigation
    const homeKeywords = ["home", "خانه", "صفحه اصلی", "inicio", "accueil", "casa", "дом", "家", "ホーム", "홈", "घर", "ev", "início"];
    if (homeKeywords.some(keyword => lowercaseQuery.includes(keyword))) {
      suggestions.push({
        text: language === "fa" ? "برو به خانه" : 
              language === "ar" ? "الذهاب إلى الصفحة الرئيسية" :
              language === "es" ? "Ir al Inicio" :
              language === "fr" ? "Aller à l'Accueil" :
              language === "ru" ? "На Главную" :
              language === "zh" ? "回到首页" :
              language === "ja" ? "ホームに戻る" :
              language === "ko" ? "홈으로 가기" :
              language === "hi" ? "घर जाएं" :
              language === "tr" ? "Ana Sayfaya Git" :
              language === "pt" ? "Ir para o Início" :
              "Go Home",
        action: "/",

      });
    }

    // Tests
    const testKeywords = ["test", "تست", "آزمون", "prueba", "test", "тест", "测试", "テスト", "테스트", "परीक्षण", "test", "teste"];
    if (testKeywords.some(keyword => lowercaseQuery.includes(keyword)) || 
        keywords.depression.some(keyword => lowercaseQuery.includes(keyword.toLowerCase())) ||
        keywords.anxiety.some(keyword => lowercaseQuery.includes(keyword.toLowerCase()))) {
      suggestions.push({
        text: getTranslation("tests", language, "sections"),
        action: "/tests",

      });
    }

    // Therapists
    if (keywords.therapist.some(keyword => lowercaseQuery.includes(keyword.toLowerCase()))) {
      suggestions.push({
        text: getTranslation("therapists", language, "sections"),
        action: "/therapists", 

      });
    }

    // Modules
    const moduleKeywords = ["module", "ماژول", "analysis", "تحلیل", "módulo", "module", "модуль", "模块", "モジュール", "모듈", "मॉड्यूल", "modül", "módulo"];
    if (moduleKeywords.some(keyword => lowercaseQuery.includes(keyword))) {
      suggestions.push({
        text: getTranslation("modules", language, "sections"),
        action: "/modules",

      });
    }

    // Articles
    const articleKeywords = ["article", "مقاله", "research", "پژوهش", "artículo", "article", "статья", "文章", "記事", "기사", "लेख", "makale", "artigo"];
    if (articleKeywords.some(keyword => lowercaseQuery.includes(keyword))) {
      suggestions.push({
        text: getTranslation("articles", language, "sections"),
        action: "/psychology",

      });
    }

    // Profile
    const profileKeywords = ["profile", "پروفایل", "account", "حساب", "perfil", "profil", "профиль", "个人资料", "プロフィール", "프로필", "प्रोफ़ाइल", "profil", "perfil"];
    if (profileKeywords.some(keyword => lowercaseQuery.includes(keyword))) {
      suggestions.push({
        text: language === "fa" ? "پروفایل من" :
              language === "ar" ? "ملفي الشخصي" :
              language === "es" ? "Mi Perfil" :
              language === "fr" ? "Mon Profil" :
              language === "ru" ? "Мой Профиль" :
              language === "zh" ? "我的资料" :
              language === "ja" ? "マイプロフィール" :
              language === "ko" ? "내 프로필" :
              language === "hi" ? "मेरी प्रोफ़ाइल" :
              language === "tr" ? "Profilim" :
              language === "pt" ? "Meu Perfil" :
              "My Profile",
        action: "/profile",

      });
    }

    return suggestions;
  };

  // Generate contextual AI response in multiple languages
  const generateContextualResponse = async (userMessage: string, language: SupportedLanguage): Promise<string> => {
    const currentContext = getCurrentPageContext();
    const suggestions = getContextualRouting(userMessage, language);
    
    try {
      const languageNames: Record<SupportedLanguage, string> = {
        en: "English",
        fr: "French",
        es: "Spanish",
        pt: "Portuguese",
        ko: "Korean",
        ja: "Japanese",
        zh: "Chinese",
        ar: "Arabic",
        fa: "Persian/Farsi",
        tr: "Turkish",
        ru: "Russian",
        hi: "Hindi",
      };

      const prompt = `You are an AI psychology assistant. User is currently on the ${currentContext} and said: "${userMessage}". 
      Language: ${languageNames[language]}.
      Available sections: ${suggestions.map(s => s.text).join(", ")}.
      
      Respond in ${languageNames[language]} with:
      1. Acknowledge their question/concern
      2. Provide helpful context about current page if relevant
      3. Guide them to appropriate sections
      4. Be supportive and professional
      
      Keep under 100 words and use natural conversational language.`;

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language }),
      });

      const data = await response.json();
      return data.aiResponse || getTranslation("aiGreeting", language);
    } catch (error) {
      return getTranslation("understanding", language);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Detect language and update current language
      const detectedLanguage = updateLanguage(inputMessage);
      
      const aiResponse = await generateContextualResponse(inputMessage, detectedLanguage);
      const suggestions = getContextualRouting(inputMessage, detectedLanguage);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
        suggestions: suggestions.length > 0 ? suggestions : undefined
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);

    } catch (error) {
      const detectedLanguage = updateLanguage(inputMessage);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai", 
        content: getTranslation("understanding", detectedLanguage),
        timestamp: new Date()
      };
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    }

    setIsLoading(false);
    setInputMessage("");
  };

  const handleSuggestionClick = (action: string) => {
    router.push(action);
    setIsOpen(false);
  };

  const clearChat = () => {
    setMessages([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("globalAIChatHistory");
    }
  };

  // Initial greeting when opening chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const currentContext = getCurrentPageContext();
      // Try to detect browser language, fallback to English
      const browserLang = navigator.language.substring(0, 2) as SupportedLanguage;
      const detectedLang = ["en", "fr", "es", "pt", "ko", "ja", "zh", "ar", "fa", "tr", "ru", "hi"].includes(browserLang) 
        ? browserLang as SupportedLanguage 
        : "en";
      
      setCurrentLanguage(detectedLang);
      setGlobalLanguage(normalizeToAppLanguage(detectedLang));
      
          const greetingMessage: ChatMessage = {
        id: "greeting",
        type: "ai",
        content: getTranslation("aiGreeting", detectedLang),
        timestamp: new Date(),
        suggestions: [
          { text: getTranslation("tests", detectedLang, "sections"), action: "/tests" },
          { text: getTranslation("therapists", detectedLang, "sections"), action: "/therapists" },
              { text: getTranslation("modules", detectedLang, "sections"), action: "/modules" }
        ]
      };
      
      setMessages([greetingMessage]);
    }
  }, [isOpen]);

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 rounded-full shadow-2xl flex items-center justify-center"
          >
            <MessageCircle className="w-8 h-8 text-white" />
            {/* Notification dot */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl ${
              isMinimized ? "w-80 h-16" : "w-96 h-[500px]"
            } transition-all duration-300`}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">
                    {currentLanguage === "fa" ? "دستیار هوشمند" :
                     currentLanguage === "ar" ? "المساعد الذكي" :
                     currentLanguage === "es" ? "Asistente IA" :
                     currentLanguage === "fr" ? "Assistant IA" :
                     currentLanguage === "ru" ? "ИИ-Помощник" :
                     currentLanguage === "zh" ? "AI助手" :
                     currentLanguage === "ja" ? "AIアシスタント" :
                     currentLanguage === "ko" ? "AI 어시스턴트" :
                     currentLanguage === "hi" ? "AI सहायक" :
                     currentLanguage === "tr" ? "AI Asistanı" :
                     currentLanguage === "pt" ? "Assistente IA" :
                     "AI Assistant"}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {currentLanguage === "fa" ? "آنلاین • آماده کمک" :
                     currentLanguage === "ar" ? "متصل • جاهز للمساعدة" :
                     currentLanguage === "es" ? "En línea • Aquí para ayudar" :
                     currentLanguage === "fr" ? "En ligne • Ici pour aider" :
                     currentLanguage === "ru" ? "Онлайн • Готов помочь" :
                     currentLanguage === "zh" ? "在线 • 随时帮助" :
                     currentLanguage === "ja" ? "オンライン • サポート準備完了" :
                     currentLanguage === "ko" ? "온라인 • 도움 준비" :
                     currentLanguage === "hi" ? "ऑनलाइन • मदद के लिए तैयार" :
                     currentLanguage === "tr" ? "Çevrimiçi • Yardıma hazır" :
                     currentLanguage === "pt" ? "Online • Aqui para ajudar" :
                     "Online • Here to help"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearChat}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Chat Content - Hidden when minimized */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 h-80 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[85%] ${message.type === "user" ? "order-2" : "order-1"}`}>
                        <div className={`flex items-start gap-2 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.type === "user" 
                              ? "bg-gradient-to-r from-purple-500 to-pink-500" 
                              : "bg-gradient-to-r from-teal-500 to-blue-500"
                          }`}>
                            {message.type === "user" ? (
                              <User className="w-3 h-3 text-white" />
                            ) : (
                              <Bot className="w-3 h-3 text-white" />
                            )}
                          </div>
                          
                          <div className={`flex-1 ${message.type === "user" ? "text-right" : "text-left"}`}>
                            <div className={`inline-block p-3 rounded-xl text-sm ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                : "bg-slate-800 text-gray-200"
                            }`}>
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>
                            
                            {/* Suggestions */}
                            {message.suggestions && (
                              <div className="mt-2 space-y-1">
                                {message.suggestions.map((suggestion, index) => {
                                  // Get the appropriate icon based on action
                                  let IconComponent;
                                  if (suggestion.action === "/tests") IconComponent = TestTube;
                                  else if (suggestion.action === "/therapists") IconComponent = Users;
                                  else if (suggestion.action === "/modules") IconComponent = Brain;
                                  else if (suggestion.action === "/psychology") IconComponent = BookOpen;
                                  else if (suggestion.action === "/profile") IconComponent = User;
                                  else if (suggestion.action === "/") IconComponent = Home;
                                  else IconComponent = Heart;

                                  return (
                                    <motion.button
                                      key={index}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() => handleSuggestionClick(suggestion.action)}
                                      className="flex items-center gap-2 w-full p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-left text-xs transition-colors group"
                                    >
                                      <IconComponent className="w-3 h-3 text-teal-400" />
                                      <span className="text-white group-hover:text-teal-300 transition-colors">
                                        {suggestion.text}
                                      </span>
                                      <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-teal-400 ml-auto transition-colors" />
                                    </motion.button>
                                  );
                                })}
                              </div>
                            )}
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
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className="bg-slate-800 p-3 rounded-xl">
                          <div className="flex items-center gap-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="w-1.5 h-1.5 bg-teal-400 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                              className="w-1.5 h-1.5 bg-teal-400 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                              className="w-1.5 h-1.5 bg-teal-400 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-700">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => {
                        setInputMessage(e.target.value);
                        // Update language as user types
                        if (e.target.value.trim()) {
                          updateLanguage(e.target.value);
                        }
                      }}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      placeholder={
                        currentLanguage === "fa" ? "پیام خود را تایپ کنید..." :
                        currentLanguage === "ar" ? "اكتب رسالتك..." :
                        currentLanguage === "es" ? "Escribe tu mensaje..." :
                      currentLanguage === "fr" ? "Tapez votre message..." :
                        currentLanguage === "ru" ? "Введите ваше сообщение..." :
                        currentLanguage === "zh" ? "输入您的消息..." :
                        currentLanguage === "ja" ? "メッセージを入力してください..." :
                        currentLanguage === "ko" ? "메시지를 입력하세요..." :
                        currentLanguage === "hi" ? "अपना संदेश टाइप करें..." :
                        currentLanguage === "tr" ? "Mesajınızı yazın..." :
                      currentLanguage === "pt" ? "Digite sua mensagem..." :
                        "Type your message..."
                      }
                      className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 text-sm focus:border-teal-500 focus:outline-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="p-2 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 rounded-lg transition-all"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
