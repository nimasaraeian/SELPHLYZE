"use client";

import { useState, useEffect } from "react";

const questions = [
  "Do you prefer spending weekends together or separately?",
  "How often do you share your daily feelings with your partner?",
  "What’s your preferred way to resolve conflicts?",
  "How do you express love the most (words, actions, gifts, time)?",
];

const options = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

export default function InvitePage() {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const sessionData =
    typeof window !== "undefined" ? localStorage.getItem("synclyzeAnswers") : null;
  const session = sessionData ? JSON.parse(sessionData) : null;

  const handleSelect = (qIndex: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/synclyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userOne: session?.answers,
          userTwo: answers,
        }),
      });

      const data = await res.json();
      setResponse(data.analysis || "⚠️ No analysis result received.");
    } catch (err: any) {
      setResponse(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-400 mb-10">
          Partner Sync Test
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
                        ? "bg-indigo-500 text-white shadow-md"
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
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-10 py-3 rounded-lg font-semibold text-lg shadow-lg transition disabled:opacity-50"
            >
              {loading ? "⏳ Analyzing relationship..." : "Submit Partner Answers"}
            </button>
          </div>
        </form>

        {response && (
          <div className="mt-12 bg-gray-800 border border-indigo-600 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">Relationship Analysis</h2>
            <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}
