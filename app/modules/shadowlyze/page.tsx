"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Moon, Brain, Zap, ArrowRight } from "lucide-react";

const questions = [
  "What trait in others annoys you the most?",
  "When do you feel most uncomfortable about yourself?",
  "What behaviors do you judge harshly in others?",
  "What aspects of your personality do you try to hide?",
  "What emotions do you find most difficult to express?",
  "When do you feel like you're wearing a mask?",
  "What would you never want others to discover about you?",
  "What patterns do you repeat despite knowing they're harmful?",
  "What triggers your strongest negative reactions?",
  "What parts of yourself do you refuse to acknowledge?"
];

const options = ["Never", "Rarely", "Sometimes", "Often", "Always"];

export default function ShadowlyzePage() {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const handleSelect = (qIndex: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponse("");

    try {
      const prompt = `Shadow Self Analysis - Please analyze these responses and provide insights about hidden patterns, unconscious behaviors, and shadow aspects: ${questions.map((q, i) => `${q}: ${answers[i] || "No answer"}`).join("; ")}`;

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

  const progress = ((currentStep + 1) / questions.length) * 100;
  const isCurrentAnswered = answers[currentStep] !== undefined;
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
              Shadowlyze
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Explore your shadow self - the hidden aspects of your personality that influence your behavior unconsciously.
          </p>
        </motion.header>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Progress</span>
            <span className="text-sm text-purple-400 font-medium">{currentStep + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
            />
          </div>
        </div>

        {!loading && !response && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-2xl"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Moon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-4 leading-relaxed">
                  {questions[currentStep]}
                </h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {options.map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(currentStep, option)}
                      className={`p-4 rounded-xl transition-all text-left ${
                        answers[currentStep] === option
                          ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg border border-purple-500"
                          : "bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-slate-600 hover:border-purple-500/50"
                      }`}
                    >
                      <span className="font-medium">{option}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-700">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep 
                        ? "bg-purple-500" 
                        : answers[index] 
                        ? "bg-purple-300" 
                        : "bg-slate-600"
                    }`}
                  />
                ))}
              </div>

              {currentStep < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!isCurrentAnswered}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Analyze Shadow
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Zap className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Your Shadow Self</h3>
            <p className="text-gray-400">Exploring hidden patterns and unconscious behaviors...</p>
          </motion.div>
        )}

        {/* Results */}
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm border border-purple-600/30 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                Shadow Analysis Results
              </h2>
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
