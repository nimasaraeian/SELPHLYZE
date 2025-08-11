"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StartConfirm from "@/components/StartConfirm";
import { useLanguage } from "@/providers/LanguageProvider";
import { translateArray } from "@/utils/i18nTest";

const questions = [
  { id: 1, text: "How do you feel when meeting new people?" },
  { id: 2, text: "How do you usually react in stressful situations?" },
  { id: 3, text: "How do you approach solving a new problem?" },
  { id: 4, text: "What motivates you most to achieve your goals?" },
  { id: 5, text: "How do you react to unexpected changes?" },
];

const options = [
  "Strongly Disagree",
  "Disagree",
  "Somewhat Disagree",
  "Neutral",
  "Somewhat Agree",
  "Agree",
  "Strongly Agree",
];

export default function PersonalityTestPage() {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const router = useRouter();
  const { language } = useLanguage();
  const [confirmOpen, setConfirmOpen] = useState(true);

  const [tQuestions, setTQuestions] = useState<string[]>(questions.map(q => q.text));
  const [tOptions, setTOptions] = useState<string[]>(options);

  useEffect(() => {
    const load = async () => {
      try {
        const qTexts = questions.map(q => q.text);
        const [qt, ot] = await Promise.all([
          translateArray(qTexts, language),
          translateArray(options, language)
        ]);
        setTQuestions(qt);
        setTOptions(ot);
      } catch {
        setTQuestions(questions.map(q => q.text));
        setTOptions(options);
      }
    };
    load();
  }, [language]);

  const handleSelect = (qId: number, value: string) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleSubmit = async () => {
    localStorage.setItem("testAnswers", JSON.stringify({ answers, language }));
    router.push("/analysis");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-800 p-8 text-white">
      <StartConfirm
        open={confirmOpen}
        language={language}
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => router.push('/tests')}
      />
      <h1 className="text-4xl font-extrabold text-cyan-300 mb-8 drop-shadow-lg">
        Personality Test
      </h1>

      <div className="space-y-8 w-full max-w-4xl">
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20"
          >
            <h2 className="font-bold text-xl mb-5 text-cyan-200 drop-shadow-md">
              {tQuestions[q.id - 1] || q.text}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(q.id, opt)}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all shadow-md
                    ${
                      answers[q.id] === opt
                        ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg scale-105"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={Object.keys(answers).length < questions.length}
        className="mt-10 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
      >
        {language === 'fa' ? 'تحلیل شخصیت من' : language === 'es' ? 'Analizar Mi Personalidad' : 'Analyze My Personality'}
      </button>
    </div>
  );
}
