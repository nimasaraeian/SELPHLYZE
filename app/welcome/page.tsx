"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SUPPORTED_LANGUAGES } from "@/utils/multilingual";

export default function WelcomeQuestions() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const router = useRouter();

  const isComplete = age && gender && language;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-100 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Before You Begin 🌱
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Please answer a few quick questions to personalize your journey.
        </p>

        {/* Age */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Age</label>
          <input
            type="number"
            min="10"
            max="99"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select your gender</option>
            <option value="male">Male ♂</option>
            <option value="female">Female ♀</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>

        {/* Language */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">Select your language</option>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.nativeName}
              </option>
            ))}
          </select>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            // Persist basic info for other parts of app
            localStorage.setItem(
              "userInfo",
              JSON.stringify({ age, gender, language })
            );

            // Derive ageRange compatible with SimpleAISearch modal logic
            const ageNum = parseInt(age, 10);
            let ageRange = "";
            if (!isNaN(ageNum)) {
              if (ageNum < 15) ageRange = "15-20";
              else if (ageNum < 20) ageRange = "15-20";
              else if (ageNum < 25) ageRange = "20-25";
              else if (ageNum < 30) ageRange = "25-30";
              else if (ageNum < 35) ageRange = "30-35";
              else if (ageNum < 40) ageRange = "35-40";
              else if (ageNum < 45) ageRange = "40-45";
              else if (ageNum < 50) ageRange = "45-50";
              else if (ageNum < 60) ageRange = "50-60";
              else if (ageNum < 70) ageRange = "60-70";
              else if (ageNum < 80) ageRange = "70-80";
              else ageRange = "80+";
            }

            // Also set the AI profile expected by SimpleAISearch so modal won't be missed later
            localStorage.setItem(
              "aiUserProfile",
              JSON.stringify({
                displayName: "",
                ageRange,
                gender,
                language,
              })
            );
            // Set global language so all pages immediately use user's choice
            try {
              localStorage.setItem("globalLanguage", language);
            } catch {}
            router.push("/tests");
          }}
          disabled={!isComplete}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            isComplete
              ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>
      </motion.div>
    </div>
  );
}
