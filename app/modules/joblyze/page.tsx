"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, TrendingUp, Users, Target, Brain, Zap } from "lucide-react";

const questions = [
  "What motivates you most in your work environment?",
  "How do you prefer to receive feedback from supervisors?",
  "What type of work tasks energize you the most?",
  "How do you handle workplace stress and pressure?",
  "What kind of team dynamics do you thrive in?",
  "How important is work-life balance to you?",
  "What career advancement paths appeal to you most?",
  "How do you prefer to communicate with colleagues?",
  "What workplace values are most important to you?",
  "How do you approach learning new skills at work?"
];

const optionSets = [
  ["Recognition", "Financial Reward", "Personal Growth", "Making Impact", "Creative Freedom"],
  ["Direct & Immediate", "Written Reports", "Regular Meetings", "Peer Reviews", "Self-Assessment"],
  ["Analytical Tasks", "Creative Projects", "Team Collaboration", "Problem Solving", "Strategic Planning"],
  ["Take Breaks", "Seek Support", "Work Harder", "Delegate Tasks", "Find Solutions"],
  ["Small Teams", "Large Groups", "Independent Work", "Cross-functional", "Leadership Roles"],
  ["Extremely Important", "Very Important", "Moderately Important", "Somewhat Important", "Not Important"],
  ["Management Track", "Technical Expert", "Entrepreneurship", "Consulting", "Teaching/Mentoring"],
  ["Face-to-Face", "Email/Messages", "Video Calls", "Formal Meetings", "Casual Conversations"],
  ["Innovation", "Stability", "Diversity", "Growth", "Ethics"],
  ["Training Programs", "Mentorship", "Self-Study", "Practice/Experience", "Workshops"]
];

export default function JoblyzePage() {
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
      const prompt = `Career and Workplace Psychology Analysis - Please analyze these responses and provide insights about career compatibility, workplace preferences, professional strengths, and development recommendations: ${questions.map((q, i) => `${q}: ${answers[i] || "No answer"}`).join("; ")}`;

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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
              Joblyze
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover your ideal career path, workplace preferences, and professional development opportunities through AI-powered analysis.
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
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
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
                        ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg border border-blue-500"
                        : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-600 hover:border-blue-500/50"
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
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-gray-500 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all disabled:cursor-not-allowed flex items-center gap-3"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  Analyzing Career Profile...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Analyze My Career Profile
                </>
              )}
            </motion.button>
          </div>
        </form>

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm border border-blue-600/30 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                Career Analysis Results
              </h2>
            </div>
            
            <div className="grid gap-6 mb-6">
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-600">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Personalized career recommendations and workplace insights</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-600">
                <Users className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-300">Team dynamics and collaboration style analysis</span>
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
