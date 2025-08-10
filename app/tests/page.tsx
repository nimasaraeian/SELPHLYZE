"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { testCategories } from "../../data/tests";
import { motion } from "framer-motion";

export default function TestsPage() {
  const [showModal, setShowModal] = useState(false);
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedTest, setSelectedTest] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  // Category icons mapping
  const getCategoryIcon = (categoryTitle: string) => {
    if (categoryTitle.includes("Core Personality")) return "🧠";
    if (categoryTitle.includes("Lifestyle & Sensory")) return "🎨";
    if (categoryTitle.includes("Professional & Decision")) return "💼";
    if (categoryTitle.includes("Relationships & Social")) return "❤️";
    if (categoryTitle.includes("Health & Emotional")) return "🧘";
    if (categoryTitle.includes("Behavioral & Communication")) return "🎭";
    if (categoryTitle.includes("Consumer & Media")) return "🛍️";
    if (categoryTitle.includes("Memory & Cognitive")) return "🧠";
    return "🔬";
  };

  const isComplete = ageRange && gender && country;

  const startTest = (testUrl: string) => {
    setSelectedTest(testUrl);
    setShowModal(true);
  };

  const handleContinue = async () => {
    localStorage.setItem(
      "userInfo",
      JSON.stringify({ ageRange, gender, country, displayName })
    );
    setShowModal(false);
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      router.push(selectedTest);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-20 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Explore Our AI-Powered Tests
        </h1>

        {testCategories.map((cat, index) => (
          <section key={index} className="mb-20">
            <h2 className="text-3xl font-bold mb-10 text-center text-teal-300">
              {cat.category}
            </h2>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {cat.tests.map((test, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group relative overflow-hidden bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-teal-400/60 shadow-xl hover:shadow-teal-500/20 transition-all duration-500 hover:scale-[1.02] flex flex-col"
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative p-6 flex flex-col h-full">
                    {/* Category Icon */}
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="text-2xl">{getCategoryIcon(cat.category)}</div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-teal-300 transition-colors text-center leading-tight">
                      {test.title}
                    </h3>

                    <p className="text-gray-400 group-hover:text-gray-300 mb-6 text-sm leading-relaxed text-center flex-grow">
                      {test.description}
                    </p>

                    <button
                      onClick={() =>
                        startTest(
                          `/tests/${test.title
                            .toLowerCase()
                            .replace(/ /g, "-")
                            .replace(/[^\w-]+/g, "")}`
                        )
                      }
                      className="mt-auto w-full py-3 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold hover:from-teal-400 hover:to-blue-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:shadow-teal-500/25"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Start Test
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md text-gray-800 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-center mb-4 text-indigo-600">
              Before You Begin 🌱
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Please answer these quick questions to personalize your journey.
            </p>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Display Name</label>
              <input
                type="text"
                placeholder="Enter your display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Age Range</label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select your age range</option>
                <option value="15-20">15 - 20</option>
                <option value="20-25">20 - 25</option>
                <option value="25-30">25 - 30</option>
                <option value="30-40">30 - 40</option>
                <option value="40-50">40 - 50</option>
                <option value="50+">50+</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select your gender</option>
                <option value="male">Male ♂</option>
                <option value="female">Female ♀</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select your country</option>
                <option value="usa">United States</option>
                <option value="canada">Canada</option>
                <option value="germany">Germany</option>
                <option value="turkey">Turkey</option>
                <option value="iran">Iran</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              disabled={!isComplete}
              onClick={handleContinue}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                isComplete
                  ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue →
            </button>
          </motion.div>
        </motion.div>
      )}

      {isAnalyzing && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/90 z-[9999]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full"
          ></motion.div>
          <p className="mt-6 text-lg font-semibold text-teal-300">
            Analyzing your responses...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            This may take a few seconds
          </p>
        </div>
      )}
    </main>
  );
}
