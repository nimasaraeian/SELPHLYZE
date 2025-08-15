"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, TrendingUp, Timer, Brain, Zap } from "lucide-react";

const questions = [
  "How do you perceive time when you're engaged in activities you enjoy?",
  "What's your relationship with deadlines and time pressure?",
  "How do you prioritize tasks when you have multiple deadlines?",
  "What time of day do you feel most productive?",
  "How do you handle waiting or unexpected delays?",
  "What's your approach to long-term planning vs. short-term tasks?",
  "How does your perception of time change under stress?",
  "What role does time play in your decision-making process?",
  "How do you feel about past, present, and future focus?",
  "What patterns do you notice in your procrastination habits?"
];

const optionSets = [
  ["Time Flies", "Time Slows", "No Change", "Varies Greatly", "Never Notice"],
  ["Love the Challenge", "Work Well Under Pressure", "Moderate Stress", "High Anxiety", "Avoid at All Costs"],
  ["Deadline First", "Importance First", "Effort Required", "Interest Level", "Random Order"],
  ["Early Morning", "Mid-Morning", "Afternoon", "Evening", "Late Night"],
  ["Very Patient", "Somewhat Patient", "Neutral", "Impatient", "Very Impatient"],
  ["Long-term Focus", "Balance Both", "Short-term Focus", "Varies by Situation", "No Clear Preference"],
  ["Time Speeds Up", "Time Slows Down", "No Change", "Becomes Chaotic", "Lose Track Completely"],
  ["Major Factor", "Important Factor", "Moderate Factor", "Minor Factor", "Not a Factor"],
  ["Past-Focused", "Present-Focused", "Future-Focused", "Balanced", "Varies"],
  ["Clear Patterns", "Some Patterns", "Occasional Patterns", "Rare Patterns", "No Patterns"]
];

export default function TimelyzePage() {
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
      const prompt = `Time Psychology and Temporal Behavior Analysis - Please analyze these responses and provide insights about time perception, productivity patterns, temporal personality traits, and recommendations for better time management and productivity: ${questions.map((q, i) => `${q}: ${answers[i] || "No answer"}`).join("; ")}`;

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

  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
              Timelyze
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Understand your relationship with time, discover your temporal personality, and optimize your productivity patterns.
          </p>
        </motion.header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {questions.map((question, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 shadow-lg"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-semibold text-sm">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{question}</h3>
              </div>
              
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 ml-12">
                {optionSets[i].map((option) => (
                  <motion.button
                    key={option}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(i, option)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      answers[i] === option
                        ? "bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg border border-violet-500"
                        : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-600 hover:border-violet-500/50"
                    }`}
                  >
                    <span className="font-medium">{option}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}

          <div className="flex justify-center pt-6">
            <motion.button
              type="submit"
              disabled={loading || !allAnswered}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-gray-500 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all disabled:cursor-not-allowed flex items-center gap-3"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  Analyzing Time Psychology...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Analyze My Time Profile
                </>
              )}
            </motion.button>
          </div>
        </form>

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm border border-violet-600/30 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
                Time Psychology Analysis
              </h2>
            </div>
            
            <div className="grid gap-6 mb-6">
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-600">
                <Calendar className="w-5 h-5 text-violet-400" />
                <span className="text-gray-300">Temporal personality and time perception patterns</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-600">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300">Productivity optimization and time management strategies</span>
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
