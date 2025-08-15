"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, Apple, Heart, TrendingUp, Brain, Zap } from "lucide-react";

const questions = [
  "How do emotions influence your eating habits?",
  "What triggers your food cravings most often?",
  "How do you feel about your relationship with food?",
  "What role does food play in your social life?",
  "How do you approach trying new foods?",
  "What influences your food choices the most?",
  "How do you handle stress-related eating?",
  "What's your attitude toward healthy eating?",
  "How do you feel after eating certain foods?",
  "What childhood food memories still affect you today?"
];

const optionSets = [
  ["Strong Influence", "Moderate Influence", "Some Influence", "Little Influence", "No Influence"],
  ["Stress", "Boredom", "Happiness", "Social Situations", "Habit"],
  ["Very Positive", "Mostly Positive", "Neutral", "Somewhat Negative", "Very Negative"],
  ["Central Role", "Important Role", "Moderate Role", "Minor Role", "No Role"],
  ["Very Adventurous", "Somewhat Adventurous", "Cautious", "Very Cautious", "Avoid New Foods"],
  ["Health", "Taste", "Convenience", "Price", "Mood"],
  ["Eat More", "Eat Less", "Change Food Types", "No Change", "Stop Eating"],
  ["Very Important", "Important", "Moderately Important", "Somewhat Important", "Not Important"],
  ["Energized", "Satisfied", "Guilty", "Uncomfortable", "No Particular Feeling"],
  ["Very Influential", "Somewhat Influential", "Moderately Influential", "Slightly Influential", "Not Influential"]
];

export default function FoodlyzePage() {
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
      const prompt = `Food Psychology and Nutritional Behavior Analysis - Please analyze these responses and provide insights about eating patterns, food relationships, emotional eating, and recommendations for developing a healthy relationship with food: ${questions.map((q, i) => `${q}: ${answers[i] || "No answer"}`).join("; ")}`;

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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Foodlyze
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore your relationship with food, understand eating patterns, and develop a healthier approach to nutrition.
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
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
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
                        ? "bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-lg border border-orange-500"
                        : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-600 hover:border-orange-500/50"
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
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-gray-500 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all disabled:cursor-not-allowed flex items-center gap-3"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  Analyzing Food Psychology...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Analyze My Food Profile
                </>
              )}
            </motion.button>
          </div>
        </form>

        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm border border-orange-600/30 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <Apple className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Food Psychology Analysis
              </h2>
            </div>
            
            <div className="grid gap-6 mb-6">
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-600">
                <Heart className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300">Emotional eating patterns and food relationships</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-600">
                <TrendingUp className="w-5 h-5 text-red-400" />
                <span className="text-gray-300">Nutritional mindfulness and healthy habits guidance</span>
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
