"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, TrendingUp, CreditCard, Target, Brain, Zap, DollarSign } from "lucide-react";

type Section = {
  key: 'Watch' | 'Home' | 'Dining' | 'Sofa' | 'Car' | 'Vacation' | 'Bag' | 'Glasses' | 'Beverage' | 'Shoes';
  title: string;
  image: string;
  questions: string[];
  options: string[][];
};

const sections: Section[] = [
  {
    key: 'Watch',
    title: 'Watch Preferences',
    image: '/image/shoplyze/soplyze2.png',
    questions: [
      'When buying a watch, what is your top priority?',
      'How often do you change or upgrade your watch?',
      'Which watch style do you prefer most?',
      'How do you usually purchase watches?',
      'What influences your watch choice the most?',
      'How important is brand loyalty to you when buying watches?'
    ],
    options: [
      ['Durability', 'Design & aesthetics', 'Brand prestige', 'Price affordability'],
      ['Every year', 'Every 3–5 years', 'Only when broken or outdated', 'Monthly as a fashion accessory'],
      ['Sleek modern metal', 'Vintage leather strap', 'Rugged sports model', 'Luxury gold or gem-studded'],
      ['In-store after trying it on', 'Online after detailed reviews', 'Gifted to me', 'At brand-exclusive boutiques'],
      ['Brand heritage/history', 'Friend/family recommendations', 'Social media trends', 'Technical specifications'],
      ['Very important – always same brand', 'Somewhat important – 2–3 favorites', 'Not important – explore different brands', 'No loyalty at all']
    ]
  },
  {
    key: 'Home',
    title: 'Home Selection',
    image: '/image/shoplyze/soplyze3.png',
    questions: [
      'When choosing a home, what is your top priority?',
      'How often do you consider moving or upgrading your living space?',
      'Which home type best fits your ideal lifestyle?',
      'How do you usually search for homes?',
      'What influences your housing choice the most?',
      'How important is neighborhood prestige to you?'
    ],
    options: [
      ['Location & accessibility', 'Architectural style & aesthetics', 'Size & layout', 'Price/value ratio'],
      ['Every 1–2 years', 'Every 5–10 years', 'Only when life changes (marriage, job, kids)', 'Never, I prefer staying long-term'],
      ['Modern minimalist villa', 'Cozy countryside cottage', 'Central city apartment', 'Grand historic estate'],
      ['Real estate websites/apps', 'Through personal networks and referrals', 'Real estate agents exclusively', 'Auctions or special property events'],
      ['Proximity to work/schools', 'Outdoor & green space access', 'Architectural uniqueness', 'Resale value potential'],
      ['Very important – must be upscale', 'Somewhat important – balance of value and prestige', 'Not important – function over status', 'I prefer under-the-radar neighborhoods']
    ]
  },
  {
    key: 'Dining',
    title: 'Dining Selection',
    image: '/image/shoplyze/soplyze4.png',
    questions: [
      'When choosing a dining table, what matters most to you?',
      'How often do you change or upgrade your dining furniture?',
      'Which dining style best suits your personality?',
      'How do you usually shop for dining furniture?',
      'What influences your decision most?',
      'How important is the dining space atmosphere to you?'
    ],
    options: [
      ['Style and design', 'Functionality and space efficiency', 'Durability and materials', 'Price and value'],
      ['Every 1–3 years', 'Every 5–8 years', 'Only when it’s damaged or outdated', 'Rarely, I keep it for decades'],
      ['Minimal and bright', 'Formal and traditional', 'Modern and urban', 'Warm and eclectic'],
      ['In-store showroom visits', 'Online browsing and reviews', 'Custom-made orders', 'Second-hand or vintage markets'],
      ['Size and seating capacity', 'Material quality and craftsmanship', 'Interior design match', 'Price promotions'],
      ['Very important – I host often', 'Somewhat important – I like it to look nice', 'Not important – it’s just functional', 'I prefer casual eating anywhere']
    ]
  },
  {
    key: 'Sofa',
    title: 'Sofa Selection',
    image: '/image/shoplyze/soplyze5.png',
    questions: [
      'When choosing a sofa, what is your top priority?',
      'How often do you replace or upgrade your sofa?',
      'Which sofa style resonates most with your personality?',
      'How do you usually shop for sofas?',
      'What influences your sofa choice the most?',
      'How important is the sofa in your daily life?'
    ],
    options: [
      ['Comfort and ergonomics', 'Aesthetics and color coordination', 'Durability and material quality', 'Price and affordability'],
      ['Every 2–3 years', 'Every 5–8 years', 'Every 10+ years', 'Only when damaged or uncomfortable'],
      ['Sleek and modern', 'Bright and expressive', 'Cozy and neutral', 'Soft and indulgent'],
      ['In-store showroom test', 'Online with reviews and photos', 'Custom-made to match interior', 'Second-hand or refurbished'],
      ['Size and fit for the living space', 'Material durability and maintenance ease', 'Brand and design reputation', 'Price discounts or promotions'],
      ['Central – I spend a lot of time on it', 'Important – used daily but not excessively', 'Moderate – only for occasional use', 'Not important – mostly decorative']
    ]
  },
  {
    key: 'Car',
    title: 'Car Selection',
    image: '/image/shoplyze/soplyze6.png',
    questions: [
      'When choosing a car, what is your top priority?',
      'How often do you replace or upgrade your car?',
      'Which car style fits your personality best?',
      'How do you usually shop for cars?',
      'What influences your car choice the most?',
      'How important is fuel efficiency in your decision?'
    ],
    options: [
      ['Performance and speed', 'Comfort and convenience', 'Fuel efficiency and eco-friendliness', 'Price and affordability'],
      ['Every 2–3 years', 'Every 5–7 years', 'Every 10+ years', 'Only when the current one is no longer functional'],
      ['Luxury sedan – status-focused and refined', 'Off-road SUV – adventurous and resilient', 'Sports car – energetic and thrill-seeking', 'Electric hatchback – sustainable and practical'],
      ['Visit multiple dealerships in person', 'Online research and price comparisons', 'Through personal connections or recommendations', 'Certified pre-owned programs'],
      ['Brand reputation and heritage', 'Safety features and ratings', 'Interior technology and connectivity', 'Resale value potential'],
      ['Very important – top priority', 'Somewhat important – balanced with performance', 'Not important – performance comes first', 'Only important for cost-saving reasons']
    ]
  },
  {
    key: 'Vacation',
    title: 'Vacation Home Selection',
    image: '/image/shoplyze/soplyze7.png',
    questions: [
      'When choosing a vacation home, what is your top priority?',
      'How often would you ideally visit your vacation home?',
      'Which vacation setting best matches your lifestyle?',
      'How would you furnish your vacation home?',
      'What would influence your choice of vacation home the most?',
      'How important is rental potential to you?'
    ],
    options: [
      ['Scenic views and environment', 'Proximity to attractions and activities', 'Comfort and amenities', 'Privacy and seclusion'],
      ['Several times a year', 'Once a year for a long stay', 'Only during special events or holidays', 'Rarely – mostly for investment purposes'],
      ['Beachfront – relaxed and sunny', 'Mountain – adventurous and tranquil', 'City – vibrant and connected', 'Countryside – peaceful and traditional'],
      ['Minimalist for easy upkeep', 'Luxurious and high-end décor', 'Cozy and rustic', 'Eclectic and colorful'],
      ['Investment potential and ROI', 'Climate and weather', 'Accessibility from your main home', 'Local culture and community'],
      ['Very important – main decision factor', 'Somewhat important – nice extra income', 'Not important – personal use only', 'Only if maintenance costs are high']
    ]
  },
  {
    key: 'Bag',
    title: 'Bag Selection',
    image: '/image/shoplyze/soplyze8.png',
    questions: [
      'When choosing a bag, what is your top priority?',
      'How often do you buy a new bag?',
      'Which type of bag do you use most often?',
      'How do you usually shop for bags?',
      'What influences your choice the most?',
      'How important is brand recognition to you?'
    ],
    options: [
      ['Durability and material quality', 'Style and fashion statement', 'Storage capacity and functionality', 'Price and affordability'],
      ['Every season (3–4 times a year)', 'Once a year', 'Every 2–3 years', 'Only when the old one is damaged'],
      ['Backpack – practical and versatile', 'Tote – casual and spacious', 'Briefcase – professional and structured', 'Handbag – stylish and expressive'],
      ['In-store for hands-on feel', 'Online with detailed specs and reviews', 'Through brand outlets only', 'Second-hand or vintage markets'],
      ['Brand reputation', 'Functionality and compartments', 'Aesthetic and trendiness', 'Price discounts'],
      ['Very important – brand defines quality', 'Somewhat important – but not a deal-breaker', 'Not important – function matters more', 'I avoid branded items']
    ]
  },
  {
    key: 'Glasses',
    title: 'Glasses Selection',
    image: '/image/shoplyze/soplyze9.png',
    questions: [
      'When choosing glasses, what is your top priority?',
      'How often do you change or upgrade your glasses?',
      'Which frame style best matches your personality?',
      'How do you usually shop for glasses?',
      'What influences your glasses choice the most?',
      'How important are advanced lens features to you?'
    ],
    options: [
      ['Comfort and fit', 'Frame style and design', 'Lens quality and features (anti-glare, blue light filter)', 'Price and affordability'],
      ['Every year', 'Every 2 years', 'Every 3–5 years', 'Only when my prescription changes significantly'],
      ['Thin metal – classic and professional', 'Bold acetate – expressive and trendy', 'Rimless – minimalist and subtle', 'Retro round – vintage and intellectual'],
      ['Optical stores with in-person fitting', 'Online with virtual try-on tools', 'Designer brand showrooms', 'Discount or wholesale outlets'],
      ['Comfort and weight', 'Frame aesthetics and color', 'Brand reputation', 'Price and promotions'],
      ['Very important – I always choose premium lenses', 'Somewhat important – I select them when affordable', 'Not important – basic lenses are fine', 'Only important if recommended by an optometrist']
    ]
  },
  {
    key: 'Beverage',
    title: 'Beverage Preference',
    image: '/image/shoplyze/soplyze10.png',
    questions: [
      'When choosing a beverage, what is your top priority?',
      'How often do you buy your favorite beverage?',
      'Which type of beverage best matches your personality?',
      'How do you usually purchase beverages?',
      'What influences your beverage choice the most?',
      'How important is presentation to you?'
    ],
    options: [
      ['Taste and flavor profile', 'Health benefits', 'Energy boost', 'Price and availability'],
      ['Daily', 'Several times a week', 'Once a week', 'Only occasionally'],
      ['Espresso – focused, driven, and intense', 'Latte – balanced, warm, and approachable', 'Iced Tea – relaxed, social, and easy-going', 'Fresh Juice – vibrant, optimistic, and energetic'],
      ['Specialty coffee/tea shops', 'Supermarkets or convenience stores', 'Online subscription services', 'Homemade'],
      ['Flavor variety', 'Nutritional content', 'Brand or café reputation', 'Price promotions'],
      ['Very important – it enhances my enjoyment', 'Somewhat important – nice to have but not essential', 'Not important – taste matters more', 'Only relevant for special occasions']
    ]
  },
  {
    key: 'Shoes',
    title: 'Shoes Selection',
    image: '/image/shoplyze/soplyze1.png',
    questions: [
      'When buying shoes, what is your top priority?',
      'How often do you buy new shoes?',
      'Which shoe type do you buy most often?',
      'How do you usually shop for shoes?',
      'What influences your decision most?',
      'How important is brand loyalty to you?'
    ],
    options: [
      ['Comfort', 'Style', 'Price', 'Brand reputation'],
      ['Every month', 'Every 3–6 months', 'Once a year', 'Only when needed (worn out)'],
      ['Sneakers', 'Formal shoes', 'Boots', 'Sandals'],
      ['In-store after trying them on', 'Online with size chart reference', 'Online with free returns', 'Second-hand or thrift stores'],
      ['Online reviews', 'Social media trends', 'Discounts and promotions', 'Recommendations from friends/family'],
      ['Very important – I always buy the same brand', 'Somewhat important – I have 2–3 go-to brands', 'Not important – I try different brands', 'I don’t notice brands at all']
    ]
  }
];

export default function ShoplyzePage() {
  const [answers, setAnswers] = useState<{ [section: number]: { [q: number]: string } }>({});
  const [sectionIndex, setSectionIndex] = useState<number>(0);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  const handleSelect = (qIndex: number, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [sectionIndex]: { ...(prev[sectionIndex] || {}), [qIndex]: option }
    }));
    const section = sections[sectionIndex];
    const lastQuestionIdx = section.questions.length - 1;
    if (qIndex < lastQuestionIdx) {
      setQuestionIndex(qIndex + 1);
    } else {
      setCompletionMessage(`${section.key} section completed.`);
      if (sectionIndex < sections.length - 1) {
        setSectionIndex(sectionIndex + 1);
        setQuestionIndex(0);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const prompt = `Shopping Psychology and Consumer Behavior Analysis — Shoplyze Multi-Section Quiz: ${sections.map((s, si) => `${s.key}: ${s.questions.map((q, qi) => `${q} -> ${(answers[si] && answers[si][qi]) ? answers[si][qi] : 'No answer'}`).join('; ')}`).join(' | ')}. Provide insights about purchasing patterns, home and lifestyle preferences, consumer psychology, and practical recommendations.`;

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.aiResponse || "⚠️ No content received from AI.");
    } catch (err: any) {
      setResponse(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const allAnswered = sections.every((s, si) => s.questions.every((_, qi) => !!(answers[si] && answers[si][qi] !== undefined)));

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              {`Shoplyze — ${sections[sectionIndex].title}`}
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Understand your shopping psychology, consumer behavior patterns, and develop mindful purchasing habits.
          </p>
        </motion.header>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-[45%] md:sticky md:top-6 rounded-2xl overflow-hidden border border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sections[sectionIndex].image} alt={`${sections[sectionIndex].key} preference`} className="w-full h-[420px] md:h-[520px] object-contain bg-slate-900" />
          </div>
          <form onSubmit={handleSubmit} className="w-full md:w-[55%] space-y-8">
            <motion.div
              key={`${sectionIndex}-${questionIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-lg"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-semibold text-sm">{questionIndex + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{sections[sectionIndex].questions[questionIndex]}</h3>
                  <p className="text-xs text-gray-400 mt-1">{questionIndex + 1} / {sections[sectionIndex].questions.length}</p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-2 ml-12">
                {sections[sectionIndex].options[questionIndex].map((option) => (
                  <motion.button
                    key={option}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(questionIndex, option)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      answers[sectionIndex] && answers[sectionIndex][questionIndex] === option
                        ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-500"
                        : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-600 hover:border-emerald-500/50"
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {completionMessage && (
              <div className="text-center text-emerald-300 text-sm">{completionMessage}</div>
            )}

            {allAnswered && (
              <>
                <div className="flex justify-center pt-4">
            <motion.button
              type="submit"
                    disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all flex items-center gap-3"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  Analyzing Shopping Psychology...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Analyze My Shopping Profile
                </>
              )}
            </motion.button>
          </div>
              </>
            )}
        </form>
        </div>

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm border border-emerald-600/30 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Shopping Psychology Analysis
              </h2>
            </div>
            
            <div className="grid gap-6 mb-6">
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-600">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-300">Consumer behavior patterns and spending triggers</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-600">
                <DollarSign className="w-5 h-5 text-teal-400" />
                <span className="text-gray-300">Financial mindfulness and purchasing recommendations</span>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">{response}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
