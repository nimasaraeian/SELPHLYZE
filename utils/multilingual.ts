// Multilingual Support System for SELPHLYZE AI

export type SupportedLanguage = 'fa' | 'en' | 'ar' | 'es' | 'fr' | 'de' | 'it' | 'ru' | 'zh' | 'ja' | 'ko' | 'hi' | 'tr' | 'pt' | 'nl';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  rtl: boolean;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', rtl: true, flag: '🇮🇷' },
  { code: 'en', name: 'English', nativeName: 'English', rtl: false, flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true, flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false, flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false, flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false, flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false, flag: '🇮🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false, flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false, flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false, flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false, flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false, flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false, flag: '🇹🇷' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false, flag: '🇵🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', rtl: false, flag: '🇳🇱' },
];

// Language Detection Patterns
const LANGUAGE_PATTERNS = {
  fa: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
  ar: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/,
  zh: /[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf]/,
  ja: /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/,
  ko: /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff]/,
  hi: /[\u0900-\u097f]/,
  ru: /[\u0400-\u04ff]/,
  de: /\b(der|die|das|und|oder|aber|mit|von|zu|in|auf|für|bei|nach|vor|über|unter|zwischen)\b/i,
  fr: /\b(le|la|les|de|du|des|et|ou|mais|avec|dans|sur|pour|par|entre|sous|depuis)\b/i,
  es: /\b(el|la|los|las|de|del|y|o|pero|con|en|por|para|entre|bajo|desde)\b/i,
  it: /\b(il|la|lo|gli|le|di|del|e|o|ma|con|in|su|per|tra|sotto|da)\b/i,
  pt: /\b(o|a|os|as|de|do|da|e|ou|mas|com|em|por|para|entre|sob|desde)\b/i,
  nl: /\b(de|het|een|en|of|maar|met|in|op|voor|bij|na|over|onder|tussen)\b/i,
  tr: /\b(ve|veya|ama|ile|için|den|dan|da|de|bu|şu|o)\b/i,
};

// Enhanced Language Detection
export const detectLanguage = (text: string): SupportedLanguage => {
  if (!text || text.trim().length === 0) return 'en';
  
  const normalizedText = text.toLowerCase().trim();
  
  // Check for specific character patterns first (more reliable)
  for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (pattern.test(normalizedText)) {
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
  
  // Fallback to English
  return 'en';
};

// Translations for AI System
export const AI_TRANSLATIONS = {
  // AI Responses and System Messages
  aiGreeting: {
    fa: 'سلام! من دستیار هوشمند روانشناسی شما هستم. چطور می‌تونم کمکتون کنم؟',
    en: 'Hello! I\'m your AI psychology assistant. How can I help you today?',
    ar: 'مرحباً! أنا مساعدك النفسي الذكي. كيف يمكنني مساعدتك اليوم؟',
    es: '¡Hola! Soy tu asistente de psicología AI. ¿Cómo puedo ayudarte hoy?',
    fr: 'Bonjour! Je suis votre assistant IA en psychologie. Comment puis-je vous aider aujourd\'hui?',
    de: 'Hallo! Ich bin Ihr KI-Psychologie-Assistent. Wie kann ich Ihnen heute helfen?',
    it: 'Ciao! Sono il tuo assistente AI di psicologia. Come posso aiutarti oggi?',
    ru: 'Привет! Я ваш ИИ-помощник по психологии. Как я могу помочь вам сегодня?',
    zh: '你好！我是您的AI心理学助手。今天我可以为您做些什么？',
    ja: 'こんにちは！私はあなたのAI心理学アシスタントです。今日はどのようにお手伝いできますか？',
    ko: '안녕하세요! 저는 당신의 AI 심리학 어시스턴트입니다. 오늘 어떻게 도와드릴까요?',
    hi: 'नमस्ते! मैं आपका AI मनोविज्ञान सहायक हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?',
    tr: 'Merhaba! Ben sizin AI psikoloji asistanınızım. Bugün size nasıl yardımcı olabilirim?',
    pt: 'Olá! Eu sou seu assistente de psicologia AI. Como posso ajudá-lo hoje?',
    nl: 'Hallo! Ik ben je AI psychologie-assistent. Hoe kan ik je vandaag helpen?',
  },
  
  // Understanding responses
  understanding: {
    fa: 'درک کردم که نگران هستید. بیایید منابع مناسب را برای شما پیدا کنیم.',
    en: 'I understand you\'re concerned. Let me help you find the right resources.',
    ar: 'أفهم أنك قلق. دعني أساعدك في العثور على الموارد المناسبة.',
    es: 'Entiendo que estés preocupado. Permíteme ayudarte a encontrar los recursos adecuados.',
    fr: 'Je comprends que vous êtes inquiet. Laissez-moi vous aider à trouver les bonnes ressources.',
    de: 'Ich verstehe, dass Sie besorgt sind. Lassen Sie mich Ihnen helfen, die richtigen Ressourcen zu finden.',
    it: 'Capisco che sei preoccupato. Lascia che ti aiuti a trovare le risorse giuste.',
    ru: 'Я понимаю, что вы обеспокоены. Позвольте мне помочь вам найти подходящие ресурсы.',
    zh: '我理解您的担忧。让我帮您找到合适的资源。',
    ja: 'ご心配されているのを理解しています。適切なリソースを見つけるお手伝いをさせてください。',
    ko: '걱정하고 계시는 것을 이해합니다. 적절한 자원을 찾는 데 도움을 드리겠습니다.',
    hi: 'मैं समझता हूँ कि आप चिंतित हैं। मुझे आपके लिए सही संसाधन खोजने में मदद करने दें।',
    tr: 'Endişeli olduğunuzu anlıyorum. Size doğru kaynakları bulmada yardımcı olmama izin verin.',
    pt: 'Entendo que você está preocupado. Deixe-me ajudá-lo a encontrar os recursos certos.',
    nl: 'Ik begrijp dat je je zorgen maakt. Laat me je helpen de juiste bronnen te vinden.',
  },

  // Section Navigation
  sections: {
    therapists: {
      fa: 'یافتن تراپیست‌ها',
      en: 'Find Therapists',
      ar: 'العثور على المعالجين',
      es: 'Encontrar Terapeutas',
      fr: 'Trouver des Thérapeutes',
      de: 'Therapeuten finden',
      it: 'Trova Terapeuti',
      ru: 'Найти Терапевтов',
      zh: '寻找治疗师',
      ja: 'セラピストを見つける',
      ko: '치료사 찾기',
      hi: 'चिकित्सक खोजें',
      tr: 'Terapist Bul',
      pt: 'Encontrar Terapeutas',
      nl: 'Therapeuten vinden',
    },
    tests: {
      fa: 'تست‌های روانشناسی',
      en: 'Psychology Tests',
      ar: 'اختبارات علم النفس',
      es: 'Pruebas de Psicología',
      fr: 'Tests de Psychologie',
      de: 'Psychologie-Tests',
      it: 'Test di Psicologia',
      ru: 'Психологические Тесты',
      zh: '心理学测试',
      ja: '心理学テスト',
      ko: '심리학 테스트',
      hi: 'मनोविज्ञान परीक्षण',
      tr: 'Psikoloji Testleri',
      pt: 'Testes de Psicologia',
      nl: 'Psychologie Tests',
    },
    modules: {
      fa: 'ماژول‌های هوش مصنوعی',
      en: 'AI Psychology Modules',
      ar: 'وحدات علم النفس بالذكاء الاصطناعي',
      es: 'Módulos de Psicología IA',
      fr: 'Modules de Psychologie IA',
      de: 'KI-Psychologie-Module',
      it: 'Moduli di Psicologia IA',
      ru: 'ИИ Модули Психологии',
      zh: 'AI心理学模块',
      ja: 'AI心理学モジュール',
      ko: 'AI 심리학 모듈',
      hi: 'AI मनोविज्ञान मॉड्यूल',
      tr: 'AI Psikoloji Modülleri',
      pt: 'Módulos de Psicologia IA',
      nl: 'AI Psychologie Modules',
    },
    articles: {
      fa: 'مقالات روانشناسی',
      en: 'Psychology Articles',
      ar: 'مقالات علم النفس',
      es: 'Artículos de Psicología',
      fr: 'Articles de Psychologie',
      de: 'Psychologie-Artikel',
      it: 'Articoli di Psicologia',
      ru: 'Статьи по Психологии',
      zh: '心理学文章',
      ja: '心理学記事',
      ko: '심리학 기사',
      hi: 'मनोविज्ञान लेख',
      tr: 'Psikoloji Makaleleri',
      pt: 'Artigos de Psicologia',
      nl: 'Psychologie Artikelen',
    }
  },

  // Keyword mappings for routing
  keywords: {
    therapist: {
      fa: ['تراپیست', 'روانشناس', 'مشاور', 'درمانگر', 'روان‌درمانگر'],
      en: ['therapist', 'therapy', 'counselor', 'psychologist', 'counseling'],
      ar: ['معالج', 'طبيب نفسي', 'مستشار', 'علاج نفسي'],
      es: ['terapeuta', 'terapia', 'consejero', 'psicólogo', 'asesoramiento'],
      fr: ['thérapeute', 'thérapie', 'conseiller', 'psychologue', 'conseil'],
      de: ['therapeut', 'therapie', 'berater', 'psychologe', 'beratung'],
      it: ['terapeuta', 'terapia', 'consulente', 'psicologo', 'consulenza'],
      ru: ['терапевт', 'терапия', 'консультант', 'психолог', 'консультирование'],
      zh: ['治疗师', '治疗', '咨询师', '心理学家', '咨询'],
      ja: ['セラピスト', 'セラピー', 'カウンセラー', '心理学者', 'カウンセリング'],
      ko: ['치료사', '치료', '상담사', '심리학자', '상담'],
      hi: ['चिकित्सक', 'चिकित्सा', 'सलाहकार', 'मनोवैज्ञानिक', 'परामर्श'],
      tr: ['terapist', 'terapi', 'danışman', 'psikolog', 'danışmanlık'],
      pt: ['terapeuta', 'terapia', 'conselheiro', 'psicólogo', 'aconselhamento'],
      nl: ['therapeut', 'therapie', 'adviseur', 'psycholoog', 'advies'],
    },
    depression: {
      fa: ['افسردگی', 'غمگین', 'ناراحت', 'دلخور', 'اندوه'],
      en: ['depression', 'sad', 'depressed', 'sadness', 'melancholy'],
      ar: ['اكتئاب', 'حزين', 'مكتئب', 'حزن', 'كآبة'],
      es: ['depresión', 'triste', 'deprimido', 'tristeza', 'melancolía'],
      fr: ['dépression', 'triste', 'déprimé', 'tristesse', 'mélancolie'],
      de: ['depression', 'traurig', 'deprimiert', 'traurigkeit', 'melancholie'],
      it: ['depressione', 'triste', 'depresso', 'tristezza', 'malinconia'],
      ru: ['депрессия', 'грустный', 'депрессивный', 'грусть', 'меланхолия'],
      zh: ['抑郁', '悲伤', '沮丧', '忧郁', '悲哀'],
      ja: ['うつ病', '悲しい', 'うつ状態', '悲しみ', '憂鬱'],
      ko: ['우울증', '슬픈', '우울한', '슬픔', '우울'],
      hi: ['अवसाद', 'उदास', 'निराश', 'दुःख', 'मायूसी'],
      tr: ['depresyon', 'üzgün', 'depresif', 'üzüntü', 'melankoli'],
      pt: ['depressão', 'triste', 'deprimido', 'tristeza', 'melancolia'],
      nl: ['depressie', 'verdrietig', 'depressief', 'verdriet', 'melancholie'],
    },
    anxiety: {
      fa: ['اضطراب', 'نگرانی', 'استرس', 'تنش', 'نگران'],
      en: ['anxiety', 'worry', 'stress', 'anxious', 'nervous'],
      ar: ['قلق', 'قلق', 'توتر', 'متوتر', 'عصبي'],
      es: ['ansiedad', 'preocupación', 'estrés', 'ansioso', 'nervioso'],
      fr: ['anxiété', 'inquiétude', 'stress', 'anxieux', 'nerveux'],
      de: ['angst', 'sorge', 'stress', 'ängstlich', 'nervös'],
      it: ['ansia', 'preoccupazione', 'stress', 'ansioso', 'nervoso'],
      ru: ['тревога', 'беспокойство', 'стресс', 'тревожный', 'нервный'],
      zh: ['焦虑', '担心', '压力', '焦虑的', '紧张'],
      ja: ['不安', '心配', 'ストレス', '不安な', '神経質'],
      ko: ['불안', '걱정', '스트레스', '불안한', '신경질적인'],
      hi: ['चिंता', 'चिंता', 'तनाव', 'चिंतित', 'नर्वस'],
      tr: ['kaygı', 'endişe', 'stres', 'kaygılı', 'gergin'],
      pt: ['ansiedade', 'preocupação', 'estresse', 'ansioso', 'nervoso'],
      nl: ['angst', 'zorgen', 'stress', 'angstig', 'nerveus'],
    }
  }
};

// Quick Actions for different languages
export const QUICK_ACTIONS = {
  fa: [
    { text: 'احساس افسردگی دارم', query: 'فکر می‌کنم افسردگی دارم' },
    { text: 'یافتن تراپیست', query: 'نیاز به یافتن تراپیست متخصص دارم' },
    { text: 'انجام تست', query: 'می‌خوام یک تست روانشناسی انجام بدم' },
    { text: 'کمک برای اضطراب', query: 'با اضطراب و استرس دست و پنجه نرم می‌کنم' }
  ],
  en: [
    { text: 'I feel depressed', query: 'I think I\'m experiencing depression' },
    { text: 'Find a therapist', query: 'I need to find a professional therapist' },
    { text: 'Take a test', query: 'I want to take a psychology test' },
    { text: 'Anxiety help', query: 'I\'m dealing with anxiety and stress' }
  ],
  ar: [
    { text: 'أشعر بالاكتئاب', query: 'أعتقد أنني أعاني من الاكتئاب' },
    { text: 'العثور على معالج', query: 'أحتاج إلى العثور على معالج متخصص' },
    { text: 'إجراء اختبار', query: 'أريد إجراء اختبار نفسي' },
    { text: 'مساعدة القلق', query: 'أتعامل مع القلق والتوتر' }
  ],
  es: [
    { text: 'Me siento deprimido', query: 'Creo que estoy experimentando depresión' },
    { text: 'Encontrar terapeuta', query: 'Necesito encontrar un terapeuta profesional' },
    { text: 'Hacer una prueba', query: 'Quiero hacer una prueba de psicología' },
    { text: 'Ayuda con ansiedad', query: 'Estoy lidiando con ansiedad y estrés' }
  ],
  fr: [
    { text: 'Je me sens déprimé', query: 'Je pense que je fais une dépression' },
    { text: 'Trouver un thérapeute', query: 'J\'ai besoin de trouver un thérapeute professionnel' },
    { text: 'Passer un test', query: 'Je veux passer un test de psychologie' },
    { text: 'Aide pour l\'anxiété', query: 'Je fais face à l\'anxiété et au stress' }
  ],
  de: [
    { text: 'Ich fühle mich deprimiert', query: 'Ich glaube, ich leide unter Depression' },
    { text: 'Therapeut finden', query: 'Ich muss einen professionellen Therapeuten finden' },
    { text: 'Test machen', query: 'Ich möchte einen Psychologie-Test machen' },
    { text: 'Hilfe bei Angst', query: 'Ich kämpfe mit Angst und Stress' }
  ],
  it: [
    { text: 'Mi sento depresso', query: 'Penso di soffrire di depressione' },
    { text: 'Trova terapeuta', query: 'Ho bisogno di trovare un terapeuta professionale' },
    { text: 'Fare un test', query: 'Voglio fare un test di psicologia' },
    { text: 'Aiuto per l\'ansia', query: 'Sto affrontando ansia e stress' }
  ],
  ru: [
    { text: 'Чувствую депрессию', query: 'Думаю, у меня депрессия' },
    { text: 'Найти терапевта', query: 'Мне нужно найти профессионального терапевта' },
    { text: 'Пройти тест', query: 'Хочу пройти психологический тест' },
    { text: 'Помощь с тревогой', query: 'Борюсь с тревогой и стрессом' }
  ],
  zh: [
    { text: '我感到抑郁', query: '我觉得我可能患有抑郁症' },
    { text: '寻找治疗师', query: '我需要寻找专业治疗师' },
    { text: '进行测试', query: '我想进行心理学测试' },
    { text: '焦虑帮助', query: '我正在应对焦虑和压力' }
  ],
  ja: [
    { text: 'うつを感じます', query: 'うつ病かもしれません' },
    { text: 'セラピストを探す', query: '専門のセラピストを見つける必要があります' },
    { text: 'テストを受ける', query: '心理学テストを受けたいです' },
    { text: '不安のヘルプ', query: '不安とストレスに対処しています' }
  ],
  ko: [
    { text: '우울감을 느껴요', query: '우울증일 것 같아요' },
    { text: '치료사 찾기', query: '전문 치료사를 찾아야 해요' },
    { text: '테스트 받기', query: '심리학 테스트를 받고 싶어요' },
    { text: '불안 도움', query: '불안과 스트레스를 겪고 있어요' }
  ],
  hi: [
    { text: 'मुझे अवसाद लगता है', query: 'मुझे लगता है कि मुझे अवसाद है' },
    { text: 'चिकित्सक खोजें', query: 'मुझे एक पेशेवर चिकित्सक खोजने की जरूरत है' },
    { text: 'परीक्षण लें', query: 'मैं एक मनोविज्ञान परीक्षण लेना चाहता हूं' },
    { text: 'चिंता की मदद', query: 'मैं चिंता और तनाव से निपट रहा हूं' }
  ],
  tr: [
    { text: 'Depresif hissediyorum', query: 'Depresyon yaşadığımı düşünüyorum' },
    { text: 'Terapist bul', query: 'Profesyonel bir terapist bulmam gerekiyor' },
    { text: 'Test yap', query: 'Bir psikoloji testi yapmak istiyorum' },
    { text: 'Kaygı yardımı', query: 'Kaygı ve stresle başa çıkıyorum' }
  ],
  pt: [
    { text: 'Sinto-me deprimido', query: 'Acho que estou passando por depressão' },
    { text: 'Encontrar terapeuta', query: 'Preciso encontrar um terapeuta profissional' },
    { text: 'Fazer teste', query: 'Quero fazer um teste de psicologia' },
    { text: 'Ajuda com ansiedade', query: 'Estou lidando com ansiedade e estresse' }
  ],
  nl: [
    { text: 'Ik voel me depressief', query: 'Ik denk dat ik depressief ben' },
    { text: 'Therapeut vinden', query: 'Ik moet een professionele therapeut vinden' },
    { text: 'Test doen', query: 'Ik wil een psychologietest doen' },
    { text: 'Hulp bij angst', query: 'Ik heb te maken met angst en stress' }
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
