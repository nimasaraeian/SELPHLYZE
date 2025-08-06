"use client";

import { useState } from "react";

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

  const handleSelect = (qIndex: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const prompt = questions.map((q, i) => `${q} → ${answers[i] || "No answer"}`).join("\n");

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.error) {
        setResponse(`❌ Error: ${data.error}`);
      } else if (data.aiResponse) {
        setResponse(data.aiResponse);
      } else {
        setResponse("⚠️ No content received from AI.");
      }
    } catch (err: any) {
      setResponse(`❌ Fetch failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-400">
        🔗 Synclyze Compatibility Test
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, i) => (
          <div key={i} className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <p className="font-semibold mb-4 text-lg">{q}</p>
            <div className="flex flex-wrap gap-3">
              {options.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => handleSelect(i, option)}
                  className={`px-4 py-2 rounded-lg border ${
                    answers[i] === option
                      ? "bg-green-500 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-md transition disabled:opacity-50"
          >
            {loading ? "⏳ Analyzing..." : "Submit & Get Analysis"}
          </button>
        </div>
      </form>

      {response && (
        <div className="mt-10 bg-gray-900 border border-green-600 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-green-400 mb-4">AI Analysis Result</h2>
          <p className="whitespace-pre-wrap text-gray-200">{response}</p>
        </div>
      )}
    </div>
  );
}
