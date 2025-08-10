"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, TrendingUp, CreditCard, Target, Brain, Zap, DollarSign } from "lucide-react";

const questions = [
  "What triggers your impulse purchases most often?",
  "How do you feel after making a large purchase?",
  "What influences your brand choices the most?",
  "How do you research products before buying?",
  "What shopping environment do you prefer?",
  "How do sales and discounts affect your buying decisions?",
  "What role does social media play in your shopping habits?",
  "How do you handle buyer's remorse?",
  "What motivates you to try new products or brands?",
  "How do you balance price vs. quality in your decisions?"
];

const optionSets = [
  ["Emotions", "Advertisements", "Sales/Discounts", "Social Influence", "Convenience"],
  ["Satisfied", "Guilty", "Excited", "Anxious", "Regretful"],
  ["Quality", "Price", "Brand Reputation", "Reviews", "Design/Aesthetics"],
  ["Online Reviews", "Friends/Family", "Social Media", "Expert Opinions", "Trial/Testing"],
  ["Online Shopping", "Physical Stores", "Boutiques", "Malls", "Local Markets"],
  ["Strong Influence", "Moderate Influence", "Slight Influence", "No Influence", "Negative Influence"],
  ["Major Influence", "Some Influence", "Minor Influence", "No Influence", "Negative Influence"],
  ["Return Items", "Accept It", "Research More", "Avoid Similar Purchases", "Share Experience"],
  ["Innovation", "Recommendations", "Curiosity", "Need", "Status"],
  ["Quality First", "Price First", "Balance Both", "Brand Trust", "Value for Money"]
];

export default function ShoplyzePage() {
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
      const prompt = `Shopping Psychology and Consumer Behavior Analysis - Please analyze these responses and provide insights about shopping patterns, consumer psychology, spending behaviors, and recommendations for mindful purchasing: ${questions.map((q, i) => `${q}: ${answers[i] || "No answer"}`).join("; ")}`;

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
    <div className="min-h-screen bg-gradient-to-b from-black via-emerald-950/20 to-black text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
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
              Shoplyze
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Understand your shopping psychology, consumer behavior patterns, and develop mindful purchasing habits.
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
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
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
                        ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-500"
                        : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-600 hover:border-emerald-500/50"
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
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-gray-500 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all disabled:cursor-not-allowed flex items-center gap-3"
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
        </form>

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
