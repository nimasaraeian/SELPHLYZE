"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";

export default function BrainTemplate() {
  const { language } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [aiText, setAiText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const pp = localStorage.getItem("testAnswers");
      const general = localStorage.getItem("selphlyze_general_personality_v1");
      const profile = localStorage.getItem("aiUserProfile");

      if (!pp && !general) {
        setError(language === 'fa' ? '❌ داده‌ای برای تحلیل یافت نشد.' : language === 'es' ? '❌ No hay datos para analizar.' : '❌ No response data found.');
        setLoading(false);
        return;
      }

      const prompt = `Analyze the following Selphlyze test responses and produce a personalized, high-signal psychological report in the user's language.

Constraints:
- Structure with: Key Traits, Behavioral Tendencies, Strengths, Watch-outs, Practical Recommendations (3–5 items), and Next Steps.
- Reference concrete cues from answers. Avoid generic statements. Keep to 180–260 words.

Inputs (JSON):
- userProfile: ${profile || '{}'}
- personalityPsychologyTest: ${pp || '{}'}
- generalPersonalityTest: ${general || '{}'}
`;

      fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            setError(res.error);
          } else {
            setAiText(res.aiResponse || "");
            setData(res);
          }
          setLoading(false);
        })
        .catch(() => {
          setError(language === 'fa' ? '❌ خطا در ارتباط با هوش مصنوعی' : language === 'es' ? '❌ Error al contactar con la IA' : '❌ Error contacting AI');
          setLoading(false);
        });
    } catch {
      setError(language === 'fa' ? '❌ خطای داخلی' : language === 'es' ? '❌ Error interno' : '❌ Internal error');
      setLoading(false);
    }
  }, [language]);

  if (loading)
    return <div className="text-center p-10">{language === 'fa' ? '⏳ در حال تحلیل...' : language === 'es' ? '⏳ Analizando...' : '⏳ Analyzing...'}</div>;

  if (error)
    return <div className="text-red-500 p-10 text-center">{error}</div>;

  // If we have direct AI text, show it
  if (aiText) {
    return (
      <div className="p-10">
        <h2 className="text-2xl font-bold mb-4">
          {language === 'fa' ? '🧠 نتایج تحلیل' : language === 'es' ? '🧠 Resultados del análisis' : '🧠 Analysis Results'}
        </h2>
        <div className="prose prose-invert max-w-none whitespace-pre-wrap">{aiText}</div>
        <div className="mt-6">
          <a href="/profile" className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-semibold">
            {language === 'fa' ? 'رفتن به صفحه پروفایل و مشاهده نتایج' : language === 'es' ? 'Ir a mi perfil para ver resultados' : 'Go to Profile to view results'}
          </a>
        </div>
      </div>
    );
  }

  if (!data?.sections || !Array.isArray(data.sections))
    return <div className="text-center p-10">{language === 'fa' ? 'فرمت پاسخ نامعتبر است.' : language === 'es' ? 'Formato de respuesta no válido.' : 'Invalid response format.'}</div>;

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">{language === 'fa' ? '🧠 نتایج تحلیل' : language === 'es' ? '🧠 Resultados del análisis' : '🧠 Analysis Results'}</h2>
      <ul className="grid grid-cols-2 gap-4">
        {data.sections.map((s: any, index: number) => (
          <li
            key={index}
            className="bg-gray-100 rounded-lg p-4 shadow"
          >
            <h3 className="text-lg font-semibold" style={{ color: s.color }}>
              {s.title}
            </h3>
            <p>{s.value}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">{language === 'fa' ? '📋 خلاصه' : language === 'es' ? '📋 Resumen' : '📋 Summary'}</h3>
        <ul className="list-disc pl-5">
          {data.summary?.map((s: string, idx: number) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <a href="/profile" className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-semibold">
          {language === 'fa' ? 'رفتن به صفحه پروفایل و مشاهده نتایج' : language === 'es' ? 'Ir a mi perfil para ver resultados' : 'Go to Profile to view results'}
        </a>
      </div>
    </div>
  );
}
