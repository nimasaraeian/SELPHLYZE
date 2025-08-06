"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  "Do you prefer spending weekends together or separately?",
  "How often do you share your daily feelings with your partner?",
  "What’s your preferred way to resolve conflicts?",
  "How do you express love the most (words, actions, gifts, time)?",
];

const options = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

export default function SynclyzePage() {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const router = useRouter();

  const handleSelect = (qIndex: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const prompt = questions.map((q, i) => `${q}: ${answers[i] || "No answer"}`).join("\n");

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

  const handleSyncWithPartner = () => {
    const sessionId = Date.now().toString();
    localStorage.setItem("synclyzeAnswers", JSON.stringify({ sessionId, answers }));
    router.push(`/modules/synclyze/invite?session=${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-green-400 mb-10">
          🔗 Synclyze Compatibility Test
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((q, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6 shadow-lg">
              <p className="text-lg font-semibold mb-4">{q}</p>
              <div className="flex flex-wrap gap-3">
                {options.map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => handleSelect(i, option)}
                    className={`px-4 py-2 rounded-lg transition ${
                      answers[i] === option
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-center gap-6 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-3 rounded-lg font-semibold text-lg shadow-lg transition disabled:opacity-50"
            >
              {loading ? "⏳ Analyzing..." : "Submit & Get Analysis"}
            </button>

            <button
              type="button"
              onClick={handleSyncWithPartner}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg transition"
            >
              🔗 Sync with Partner
            </button>
          </div>
        </form>

        {response && (
          <div className="mt-12 bg-gray-800 border border-green-600 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-green-400 mb-4">AI Analysis Result</h2>
            <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
