import { SupportedLanguage } from "./multilingual";

const FALLBACK_DICTIONARY: Record<SupportedLanguage, Record<string, string>> = {
  fa: {
    // Likert options
    "Strongly Disagree": "کاملاً مخالفم",
    "Disagree": "مخالفم",
    "Somewhat Disagree": "تا حدی مخالفم",
    "Neutral": "خنثی",
    "Somewhat Agree": "تا حدی موافقم",
    "Agree": "موافقم",
    "Strongly Agree": "کاملاً موافقم",
    // Personality-psychology sample questions
    "How do you feel when meeting new people?": "وقتی با افراد جدید ملاقات می‌کنید چه احساسی دارید؟",
    "How do you usually react in stressful situations?": "معمولاً در موقعیت‌های پراسترس چگونه واکنش نشان می‌دهید؟",
    "How do you approach solving a new problem?": "چطور به حل یک مشکل جدید نزدیک می‌شوید؟",
    "What motivates you most to achieve your goals?": "چه چیزی بیش از همه شما را برای رسیدن به اهداف‌تان انگیزه می‌دهد؟",
    "How do you react to unexpected changes?": "در برابر تغییرات غیرمنتظره چگونه واکنش نشان می‌دهید؟",
  },
  zh: {
    // Likert options
    "Strongly Disagree": "强烈不同意",
    "Disagree": "不同意",
    "Somewhat Disagree": "有点不同意",
    "Neutral": "中立",
    "Somewhat Agree": "有点同意",
    "Agree": "同意",
    "Strongly Agree": "强烈同意",
    // Personality-psychology sample questions
    "How do you feel when meeting new people?": "与新认识的人见面时你的感受如何？",
    "How do you usually react in stressful situations?": "在压力情境下你通常如何反应？",
    "How do you approach solving a new problem?": "你如何着手解决一个新问题？",
    "What motivates you most to achieve your goals?": "什么最能激励你实现目标？",
    "How do you react to unexpected changes?": "你如何应对突发变化？",
  },
  ja: {
    "Strongly Disagree": "全くそう思わない",
    "Disagree": "あまりそう思わない",
    "Somewhat Disagree": "ややそう思わない",
    "Neutral": "どちらでもない",
    "Somewhat Agree": "ややそう思う",
    "Agree": "そう思う",
    "Strongly Agree": "とてもそう思う",
    "How do you feel when meeting new people?": "新しい人と会うとき、どんな気持ちになりますか？",
    "How do you usually react in stressful situations?": "ストレスの多い状況で、ふだんどのように反応しますか？",
    "How do you approach solving a new problem?": "新しい問題の解決にどのように取り組みますか？",
    "What motivates you most to achieve your goals?": "目標達成のために、あなたを最も動機づけるものは何ですか？",
    "How do you react to unexpected changes?": "予期しない変化にどう対応しますか？",
  },
  fr: {
    "Strongly Disagree": "Tout à fait en désaccord",
    "Disagree": "En désaccord",
    "Somewhat Disagree": "Plutôt en désaccord",
    "Neutral": "Neutre",
    "Somewhat Agree": "Plutôt d'accord",
    "Agree": "D'accord",
    "Strongly Agree": "Tout à fait d'accord",
    "How do you feel when meeting new people?": "Comment vous sentez‑vous lorsque vous rencontrez de nouvelles personnes ?",
    "How do you usually react in stressful situations?": "Comment réagissez‑vous généralement dans des situations stressantes ?",
    "How do you approach solving a new problem?": "Comment abordez‑vous la résolution d’un nouveau problème ?",
    "What motivates you most to achieve your goals?": "Qu’est‑ce qui vous motive le plus à atteindre vos objectifs ?",
    "How do you react to unexpected changes?": "Comment réagissez‑vous face à des changements inattendus ?",
  },
  es: {
    "Strongly Disagree": "Totalmente en desacuerdo",
    "Disagree": "En desacuerdo",
    "Somewhat Disagree": "Algo en desacuerdo",
    "Neutral": "Neutral",
    "Somewhat Agree": "Algo de acuerdo",
    "Agree": "De acuerdo",
    "Strongly Agree": "Totalmente de acuerdo",
    "How do you feel when meeting new people?": "¿Cómo te sientes al conocer gente nueva?",
    "How do you usually react in stressful situations?": "¿Cómo reaccionas normalmente en situaciones de estrés?",
    "How do you approach solving a new problem?": "¿Cómo abordas la solución de un problema nuevo?",
    "What motivates you most to achieve your goals?": "¿Qué te motiva más para alcanzar tus objetivos?",
    "How do you react to unexpected changes?": "¿Cómo reaccionas ante cambios inesperados?",
  },
  ar: {}, tr: {}, ru: {}, ko: {}, hi: {}, pt: {}, en: {},
};

function getCacheKey(lang: SupportedLanguage, text: string) {
  return `tx:${lang}:${text}`;
}

function readCached(lang: SupportedLanguage, texts: string[]): (string | null)[] {
  if (typeof window === 'undefined') return texts.map(() => null);
  return texts.map((t) => {
    try {
      const k = getCacheKey(lang, t);
      const v = localStorage.getItem(k);
      return v ? v : null;
    } catch {
      return null;
    }
  });
}

function writeCached(lang: SupportedLanguage, original: string[], translated: string[]) {
  if (typeof window === 'undefined') return;
  original.forEach((src, i) => {
    const dst = translated[i];
    if (!dst) return;
    try {
      localStorage.setItem(getCacheKey(lang, src), dst);
    } catch {}
  });
}

export async function translateArray(texts: string[], language: SupportedLanguage): Promise<string[]> {
  if (language === "en") return texts;
  // 1) try cache per-entry
  const cached = readCached(language, texts);
  const missingIdx: number[] = [];
  const missingTexts: string[] = [];
  cached.forEach((v, i) => { if (v === null) { missingIdx.push(i); missingTexts.push(texts[i]); } });
  let translatedMissing: string[] = [];
  try {
    if (missingTexts.length > 0) {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: missingTexts, language }),
      });
      if (!res.ok) throw new Error("translate API failed");
      const data = await res.json();
      translatedMissing = Array.isArray(data.translations) ? data.translations : missingTexts;
      // If model returned identical texts, attempt fallback dictionary for those
      const dict = FALLBACK_DICTIONARY[language] || {} as Record<string, string>;
      translatedMissing = translatedMissing.map((t, i) => {
        const original = missingTexts[i];
        return t !== original ? t : (dict[original] || original);
      });
      // write to cache
      writeCached(language, missingTexts, translatedMissing);
    }
  } catch {
    // Offline fallback dictionary for all
    const dict = FALLBACK_DICTIONARY[language] || {} as Record<string, string>;
    return texts.map((t) => {
      const cachedVal = cached[texts.indexOf(t)];
      return (cachedVal as string) || dict[t] || t;
    });
  }
  // Merge cached + fetched
  const result = texts.map((src, i) => cached[i] ?? translatedMissing[missingIdx.indexOf(i)] ?? src);
  return result;
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}


