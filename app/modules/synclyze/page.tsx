"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaWhatsapp, FaTelegram, FaLink } from "react-icons/fa6";

export default function SynclyzePage() {
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [showShare, setShowShare] = useState(false);

  const questions = [
    "How important is emotional connection in your relationship?",
    "Do you prefer spending weekends together or separately?",
    "How often do you share your daily feelings with your partner?",
    "What’s your preferred way to resolve conflicts?",
    "How do you express love the most (words, actions, gifts, time)?",
  ];

  const handleAnswer = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, module: "Synclyze" }),
      });

      const data = await res.json();
      if (data.error) {
        setAnalysis({ error: data.error });
      } else {
        setAnalysis(data);
      }
    } catch (error) {
      setAnalysis({ error: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const inviteLink = typeof window !== "undefined"
    ? window.location.href
    : "https://selphlyze.com/modules/synclyze";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl mt-10"
    >
      {/* Sync with Partner بالا سمت راست */}
      <div className="absolute top-6 right-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl shadow-lg hover:shadow-2xl transition"
          onClick={() => setShowShare(!showShare)}
        >
          Sync with Partner
        </motion.button>

        {showShare && (
          <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-4 w-56">
            <p className="text-gray-800 font-semibold mb-3">Share Invite</p>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/?text=Join me on Synclyze: ${inviteLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-600 hover:underline"
              >
                <FaWhatsapp /> WhatsApp
              </a>
              <a
                href={`https://t.me/share/url?url=${inviteLink}&text=Join me on Synclyze`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sky-500 hover:underline"
              >
                <FaTelegram /> Telegram
              </a>
              <a
                href={`mailto:?subject=Join me on Synclyze&body=Take the test with me: ${inviteLink}`}
                className="flex items-center gap-2 text-red-500 hover:underline"
              >
                <FaEnvelope /> Gmail
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(inviteLink)}
                className="flex items-center gap-2 text-gray-600 hover:underline"
              >
                <FaLink /> Copy Link
              </button>
            </div>
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold text-indigo-600 mb-8 text-center">
        Synclyze Relationship Test
      </h1>

      {questions.map((q, index) => (
        <div key={index} className="mb-6">
          <p className="font-semibold mb-3 text-gray-800">{q}</p>
          <div className="flex gap-3 flex-wrap">
            {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map(
              (option) => (
                <label
                  key={option}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition ${
                    answers[index] === option
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleAnswer(index, option)}
                    className="hidden"
                  />
                  {option}
                </label>
              )
            )}
          </div>
        </div>
      ))}

      {/* Submit Button پایین */}
      <div className="text-center mt-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all disabled:opacity-70"
          onClick={handleSubmit}
        >
          {loading ? "Analyzing..." : "Submit & Get Analysis"}
        </motion.button>
      </div>

      {/* نمایش تحلیل */}
      {analysis && !analysis.error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 bg-gray-100 p-6 rounded-xl shadow-inner"
        >
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">
            Your Personalized Analysis
          </h2>

          {/* Sections */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {analysis.sections.map((sec: any, i: number) => (
              <div
                key={i}
                className="p-5 rounded-xl shadow-lg bg-white border border-gray-200"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {sec.title}
                </h3>
                <p className="text-sm text-gray-700 mb-1">Score: {sec.value}%</p>
                <p className="text-sm text-gray-600">{sec.description}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-xl font-bold text-indigo-700 mb-4">Summary</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-800">
              {analysis.summary.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* نمایش خطا */}
      {analysis?.error && (
        <p className="mt-8 text-center text-red-600 font-semibold">
          ❌ {analysis.error}
        </p>
      )}
    </motion.div>
  );
}
