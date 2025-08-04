"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function WelcomeQuestions() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const router = useRouter();

  const isComplete = age && gender && country;

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

        {/* Country */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
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

        {/* Continue Button */}
        <button
          onClick={() => {
            localStorage.setItem(
              "userInfo",
              JSON.stringify({ age, gender, country })
            );
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
