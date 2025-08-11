// Multilingual Support System for SELPHLYZE AI

export type SupportedLanguage = 'en' | 'fr' | 'es' | 'pt' | 'ko' | 'ja' | 'zh' | 'ar' | 'fa' | 'tr' | 'ru' | 'hi';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  rtl: boolean;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false, flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false, flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false, flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false, flag: '🇵🇹' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false, flag: '🇰🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false, flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false, flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true, flag: '🇸🇦' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', rtl: true, flag: '🇮🇷' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false, flag: '🇹🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false, flag: '🇷🇺' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false, flag: '🇮🇳' },
];

// Language Detection Patterns
const LANGUAGE_PATTERNS = {
  // Character-based patterns (check first for reliability)
  ko: /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff]/,
  ja: /[\u3040-\u309f\u30a0-\u30ff]/,
  zh: /[\u4e00-\u9fff\u3400-\u4dbf]/,
  ar: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
  fa: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
  ru: /[\u0400-\u04ff]/,
  hi: /[\u0900-\u097f]/,
  
  // Turkish specific characters and common words (expanded)
  tr: /[çğıöşü]|(\b(merhaba|selam|günaydın|iyi akşamlar|teşekkür(ler)?|lütfen|yardım|nasılsın|ve|veya|ama|ile|için|den|dan|da|de|bu|şu|o|bir|olan|değil|nedir|nasıl|ne|kim|nerede|ne zaman)\b)/i,
  
  // Word-based patterns (check after character patterns)
  en: /\b(the|and|or|but|with|in|on|for|by|at|from|to|of|is|are|was|were|what|how|when|where|why)\b/i,
  fr: /\b(le|la|les|de|du|des|et|ou|mais|avec|dans|sur|pour|par|entre|sous|depuis|que|qui|comment|quand|où|pourquoi)\b/i,
  es: /\b(el|la|los|las|de|del|y|o|pero|con|en|por|para|entre|bajo|desde|que|quien|como|cuando|donde|por que)\b/i,
  pt: /\b(o|a|os|as|de|do|da|e|ou|mas|com|em|por|para|entre|sob|desde|que|quem|como|quando|onde|por que)\b/i,
};

// Enhanced Language Detection
export const detectLanguage = (text: string): SupportedLanguage => {
  if (!text || text.trim().length === 0) return 'en';
  
  const normalizedText = text.toLowerCase().trim();
  
  // Priority order: Check character-based languages first (most reliable)
  const characterBasedLanguages = ['ko', 'ja', 'zh', 'ru', 'hi'];
  const scriptBasedLanguages = ['ar', 'fa'];
  const wordBasedLanguages = ['tr', 'en', 'fr', 'es', 'pt'];
  
  // 1. Check character-based languages first
  for (const lang of characterBasedLanguages) {
    if (LANGUAGE_PATTERNS[lang as keyof typeof LANGUAGE_PATTERNS]?.test(text)) {
      return lang as SupportedLanguage;
    }
  }
  
  // 2. Check Arabic script languages (Arabic vs Persian)
  for (const lang of scriptBasedLanguages) {
    if (LANGUAGE_PATTERNS[lang as keyof typeof LANGUAGE_PATTERNS]?.test(text)) {
      // Special handling for Arabic vs Persian
      if (lang === 'fa' || lang === 'ar') {
        // Persian-specific characters
        if (/[پچژگ]/.test(text)) return 'fa';
        // Arabic-specific patterns
        if (/[ذضظغ]/.test(text)) return 'ar';
        // Default to Persian for mixed content
        return 'fa';
      }
      return lang as SupportedLanguage;
    }
  }
  
  // 3. Check word-based languages (including Turkish with special characters)
  for (const lang of wordBasedLanguages) {
    if (LANGUAGE_PATTERNS[lang as keyof typeof LANGUAGE_PATTERNS]?.test(normalizedText)) {
      return lang as SupportedLanguage;
    }
  }
  
  // Fallback to English
  return 'en';
};

// Translations for AI System
export const AI_TRANSLATIONS = {
  // AI Responses and System Messages
  aiGreeting: {
    en: 'Hello! I\'m your AI psychology assistant. How can I help you today?',
    fr: 'Bonjour! Je suis votre assistant IA en psychologie. Comment puis-je vous aider aujourd\'hui?',
    es: '¡Hola! Soy tu asistente de psicología AI. ¿Cómo puedo ayudarte hoy?',
    pt: 'Olá! Eu sou seu assistente de psicologia AI. Como posso ajudá-lo hoje?',
    ko: '안녕하세요! 저는 당신의 AI 심리학 어시스턴트입니다. 오늘 어떻게 도와드릴까요?',
    ja: 'こんにちは！私はあなたのAI心理学アシスタントです。今日はどのようにお手伝いできますか？',
    zh: '你好！我是您的AI心理学助手。今天我可以为您做些什么？',
    ar: 'مرحباً! أنا مساعدك النفسي الذكي. كيف يمكنني مساعدتك اليوم؟',
    fa: 'سلام! من دستیار هوشمند روانشناسی شما هستم. چطور می‌تونم کمکتون کنم؟',
    tr: 'Merhaba! Ben sizin AI psikoloji asistanınızım. Bugün size nasıl yardımcı olabilirim?',
    ru: 'Привет! Я ваш ИИ-помощник по психологии. Как я могу помочь вам сегодня?',
    hi: 'नमस्ते! मैं आपका AI मनोविज्ञान सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?',
  },
  
  // Understanding responses
  understanding: {
    en: 'I understand you\'re concerned. Let me help you find the right resources.',
    fr: 'Je comprends que vous êtes inquiet. Laissez-moi vous aider à trouver les bonnes ressources.',
    es: 'Entiendo que estés preocupado. Permíteme ayudarte a encontrar los recursos adecuados.',
    pt: 'Entendo que você está preocupado. Deixe-me ajudá-lo a encontrar os recursos certos.',
    ko: '걱정하고 계시는 것을 이해합니다. 적절한 자원을 찾는 데 도움을 드리겠습니다.',
    ja: 'ご心配されているのを理解しています。適切なリソースを見つけるお手伝いをさせてください。',
    zh: '我理解您的担忧。让我帮您找到合适的资源。',
    ar: 'أفهم أنك قلق. دعني أساعدك في العثور على الموارد المناسبة.',
    fa: 'درک کردم که نگران هستید. بیایید منابع مناسب را برای شما پیدا کنیم.',
    tr: 'Endişeli olduğunuzu anlıyorum. Size doğru kaynakları bulmada yardımcı olmama izin verin.',
    ru: 'Я понимаю, что вы обеспокоены. Позвольте мне помочь вам найти подходящие ресурсы.',
    hi: 'मैं समझता हूँ कि आप चिंतित हैं। मुझे आपके लिए सही संसाधन खोजने में मदद करने दें।',
  },

  // Section Navigation
  sections: {
    therapists: {
      en: 'Find Therapists',
      fr: 'Trouver des Thérapeutes',
      es: 'Encontrar Terapeutas',
      pt: 'Encontrar Terapeutas',
      ko: '치료사 찾기',
      ja: 'セラピストを見つける',
      zh: '寻找治疗师',
      ar: 'العثور على المعالجين',
      fa: 'یافتن تراپیست‌ها',
      tr: 'Terapist Bul',
      ru: 'Найти Терапевтов',
      hi: 'चिकित्सक खोजें',
    },
    tests: {
      en: 'Psychology Tests',
      fr: 'Tests de Psychologie',
      es: 'Pruebas de Psicología',
      pt: 'Testes de Psicologia',
      ko: '심리학 테스트',
      ja: '心理学テスト',
      zh: '心理学测试',
      ar: 'اختبارات علم النفس',
      fa: 'تست‌های روانشناسی',
      tr: 'Psikoloji Testleri',
      ru: 'Психологические Тесты',
      hi: 'मनोविज्ञान परीक्षण',
    },
    modules: {
      en: 'AI Psychology Modules',
      fr: 'Modules de Psychologie IA',
      es: 'Módulos de Psicología IA',
      pt: 'Módulos de Psicologia IA',
      ko: 'AI 심리학 모듈',
      ja: 'AI心理学モジュール',
      zh: 'AI心理学模块',
      ar: 'وحدات علم النفس بالذكاء الاصطناعي',
      fa: 'ماژول‌های هوش مصنوعی',
      tr: 'AI Psikoloji Modülleri',
      ru: 'ИИ Модули Психологии',
      hi: 'AI मनोविज्ञान मॉड्यूल',
    },
    articles: {
      en: 'Psychology Articles',
      fr: 'Articles de Psychologie',
      es: 'Artículos de Psicología',
      pt: 'Artigos de Psicologia',
      ko: '심리학 기사',
      ja: '心理学記事',
      zh: '心理学文章',
      ar: 'مقالات علم النفس',
      fa: 'مقالات روانشناسی',
      tr: 'Psikoloji Makaleleri',
      ru: 'Статьи по Психологии',
      hi: 'मनोविज्ञान लेख',
    }
  },

  // Keyword mappings for routing
  keywords: {
    therapist: {
      en: ['therapist', 'therapy', 'counselor', 'psychologist', 'counseling'],
      fr: ['thérapeute', 'thérapie', 'conseiller', 'psychologue', 'conseil'],
      es: ['terapeuta', 'terapia', 'consejero', 'psicólogo', 'asesoramiento'],
      pt: ['terapeuta', 'terapia', 'conselheiro', 'psicólogo', 'aconselhamento'],
      ko: ['치료사', '치료', '상담사', '심리학자', '상담'],
      ja: ['セラピスト', 'セラピー', 'カウンセラー', '心理学者', 'カウンセリング'],
      zh: ['治疗师', '治疗', '咨询师', '心理学家', '咨询'],
      ar: ['معالج', 'طبيب نفسي', 'مستشار', 'علاج نفسي'],
      fa: ['تراپیست', 'روانشناس', 'مشاور', 'درمانگر', 'روان‌درمانگر'],
      tr: ['terapist', 'terapi', 'danışman', 'psikolog', 'danışmanlık'],
      ru: ['терапевт', 'терапия', 'консультант', 'психолог', 'консультирование'],
      hi: ['चिकित्सक', 'चिकित्सा', 'सलाहकार', 'मनोवैज्ञानिक', 'परामर्श'],
    },
    depression: {
      en: ['depression', 'sad', 'depressed', 'sadness', 'melancholy'],
      fr: ['dépression', 'triste', 'déprimé', 'tristesse', 'mélancolie'],
      es: ['depresión', 'triste', 'deprimido', 'tristeza', 'melancolía'],
      pt: ['depressão', 'triste', 'deprimido', 'tristeza', 'melancolia'],
      ko: ['우울증', '슬픈', '우울한', '슬픔', '우울'],
      ja: ['うつ病', '悲しい', 'うつ状態', '悲しみ', '憂鬱'],
      zh: ['抑郁', '悲伤', '沮丧', '忧郁', '悲哀'],
      ar: ['اكتئاب', 'حزين', 'مكتئب', 'حزن', 'كآبة'],
      fa: ['افسردگی', 'غمگین', 'ناراحت', 'دلخور', 'اندوه'],
      tr: ['depresyon', 'üzgün', 'depresif', 'üzüntü', 'melankoli'],
      ru: ['депрессия', 'грустный', 'депрессивный', 'грусть', 'меланхолия'],
      hi: ['अवसाद', 'उदास', 'निराश', 'दुःख', 'मायूसी'],
    },
    anxiety: {
      en: ['anxiety', 'worry', 'stress', 'anxious', 'nervous'],
      fr: ['anxiété', 'inquiétude', 'stress', 'anxieux', 'nerveux'],
      es: ['ansiedad', 'preocupación', 'estrés', 'ansioso', 'nervioso'],
      pt: ['ansiedade', 'preocupação', 'estresse', 'ansioso', 'nervoso'],
      ko: ['불안', '걱정', '스트레스', '불안한', '신경질적인'],
      ja: ['不安', '心配', 'ストレス', '不安な', '神経質'],
      zh: ['焦虑', '担心', '压力', '焦虑的', '紧张'],
      ar: ['قلق', 'قلق', 'توتر', 'متوتر', 'عصبي'],
      fa: ['اضطراب', 'نگرانی', 'استرس', 'تنش', 'نگران'],
      tr: ['kaygı', 'endişe', 'stres', 'kaygılı', 'gergin'],
      ru: ['тревога', 'беспокойство', 'стресс', 'тревожный', 'нервный'],
      hi: ['चिंता', 'चिंता', 'तनाव', 'चिंतित', 'नर्वस'],
    }
  }
};

// Quick Actions for different languages
export const QUICK_ACTIONS = {
  en: [
    { text: 'I feel depressed', query: 'I think I\'m experiencing depression' },
    { text: 'Find a therapist', query: 'I need to find a professional therapist' },
    { text: 'Take a test', query: 'I want to take a psychology test' },
    { text: 'Anxiety help', query: 'I\'m dealing with anxiety and stress' }
  ],
  fr: [
    { text: 'Je me sens déprimé', query: 'Je pense que je fais une dépression' },
    { text: 'Trouver un thérapeute', query: 'J\'ai besoin de trouver un thérapeute professionnel' },
    { text: 'Passer un test', query: 'Je veux passer un test de psychologie' },
    { text: 'Aide pour l\'anxiété', query: 'Je fais face à l\'anxiété et au stress' }
  ],
  es: [
    { text: 'Me siento deprimido', query: 'Creo que estoy experimentando depresión' },
    { text: 'Encontrar terapeuta', query: 'Necesito encontrar un terapeuta profesional' },
    { text: 'Hacer una prueba', query: 'Quiero hacer una prueba de psicología' },
    { text: 'Ayuda con ansiedad', query: 'Estoy lidiando con ansiedad y estrés' }
  ],
  pt: [
    { text: 'Sinto-me deprimido', query: 'Acho que estou passando por depressão' },
    { text: 'Encontrar terapeuta', query: 'Preciso encontrar um terapeuta profissional' },
    { text: 'Fazer teste', query: 'Quero fazer um teste de psicologia' },
    { text: 'Ajuda com ansiedade', query: 'Estou lidando com ansiedade e estresse' }
  ],
  ko: [
    { text: '우울감을 느껴요', query: '우울증일 것 같아요' },
    { text: '치료사 찾기', query: '전문 치료사를 찾아야 해요' },
    { text: '테스트 받기', query: '심리학 테스트를 받고 싶어요' },
    { text: '불안 도움', query: '불안과 스트레스를 겪고 있어요' }
  ],
  ja: [
    { text: 'うつを感じます', query: 'うつ病かもしれません' },
    { text: 'セラピストを探す', query: '専門のセラピストを見つける必要があります' },
    { text: 'テストを受ける', query: '心理学テストを受けたいです' },
    { text: '不安のヘルプ', query: '不安とストレスに対処しています' }
  ],
  zh: [
    { text: '我感到抑郁', query: '我觉得我可能患有抑郁症' },
    { text: '寻找治疗师', query: '我需要寻找专业治疗师' },
    { text: '进行测试', query: '我想进行心理学测试' },
    { text: '焦虑帮助', query: '我正在应对焦虑和压力' }
  ],
  ar: [
    { text: 'أشعر بالاكتئاب', query: 'أعتقد أنني أعاني من الاكتئاب' },
    { text: 'العثور على معالج', query: 'أحتاج إلى العثور على معالج متخصص' },
    { text: 'إجراء اختبار', query: 'أريد إجراء اختبار نفسي' },
    { text: 'مساعدة القلق', query: 'أتعامل مع القلق والتوتر' }
  ],
  fa: [
    { text: 'احساس افسردگی دارم', query: 'فکر می‌کنم افسردگی دارم' },
    { text: 'یافتن تراپیست', query: 'نیاز به یافتن تراپیست متخصص دارم' },
    { text: 'انجام تست', query: 'می‌خوام یک تست روانشناسی انجام بدم' },
    { text: 'کمک برای اضطراب', query: 'با اضطراب و استرس دست و پنجه نرم می‌کنم' }
  ],
  tr: [
    { text: 'Depresif hissediyorum', query: 'Depresyon yaşadığımı düşünüyorum' },
    { text: 'Terapist bul', query: 'Profesyonel bir terapist bulmam gerekiyor' },
    { text: 'Test yap', query: 'Bir psikoloji testi yapmak istiyorum' },
    { text: 'Kaygı yardımı', query: 'Kaygı ve stresle başa çıkıyorum' }
  ],
  ru: [
    { text: 'Чувствую депрессию', query: 'Думаю, у меня депрессия' },
    { text: 'Найти терапевта', query: 'Мне нужно найти профессионального терапевта' },
    { text: 'Пройти тест', query: 'Хочу пройти психологический тест' },
    { text: 'Помощь с тревогой', query: 'Борюсь с тревогой и стрессом' }
  ],
  hi: [
    { text: 'मुझे अवसाद लगता है', query: 'मुझे लगता है कि मुझे अवसाद है' },
    { text: 'चिकित्सक खोजें', query: 'मुझे एक पेशेवर चिकित्सक खोजने की जरूरत है' },
    { text: 'परीक्षण लें', query: 'मैं एक मनोविज्ञान परीक्षण लेना चाहता हूं' },
    { text: 'चिंता की मदद', query: 'मैं चिंता और तनाव से निपट रहा हूं' }
  ]
};

// Get translation for a key and language
export const getTranslation = (key: string, language: SupportedLanguage, section?: string): string => {
  try {
    if (section) {
      return (AI_TRANSLATIONS as any)[section]?.[key]?.[language] || 
             (AI_TRANSLATIONS as any)[section]?.[key]?.['en'] || 
             key;
    }
    return (AI_TRANSLATIONS as any)[key]?.[language] || 
           (AI_TRANSLATIONS as any)[key]?.['en'] || 
           key;
  } catch {
    return key;
  }
};

// Get keywords for a specific category and language
export const getKeywords = (category: string, language: SupportedLanguage): string[] => {
  return AI_TRANSLATIONS.keywords[category as keyof typeof AI_TRANSLATIONS.keywords]?.[language] || [];
};

// Get quick actions for a language
export const getQuickActions = (language: SupportedLanguage) => {
  return QUICK_ACTIONS[language] || QUICK_ACTIONS.en;
};

// Get language info
export const getLanguageInfo = (code: SupportedLanguage): LanguageInfo | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};