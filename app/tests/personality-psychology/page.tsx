"use client";
import { useEffect, useState } from "react";

export default function PersonalityPsychologyPage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [analysis, setAnalysis] = useState<string>("");

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) setUserInfo(JSON.parse(data));
  }, []);

  const analyzeTest = async () => {
    if (!userInfo) return;

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: userInfo, answers }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log("AI raw response:", data);

      const aiText = data.choices?.[0]?.message?.content || "No analysis received.";
      setAnalysis(aiText);
    } catch (error) {
      console.error("Error analyzing:", error);
      setAnalysis("❌ Could not get analysis. Please check server logs.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10">
      {userInfo && (
        <div className="mb-8 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-indigo-400">
            Welcome {userInfo.displayName || "Guest"} 👋
          </h2>
          <p>Age Range: {userInfo.ageRange}</p>
          <p>Gender: {userInfo.gender}</p>
          <p>Country: {userInfo.country}</p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Personality Test (5 Questions)</h1>

      {/* Questions */}
      {[
        "I enjoy meeting new people.",
        "I often plan things carefully before doing them.",
        "I get stressed easily.",
        "I like trying out new experiences.",
        "I prefer working in a team rather than alone."
      ].map((q, idx) => (
        <div key={idx} className="mb-6">
          <label className="block mb-2">{q}</label>
          <select
            onChange={(e) =>
              setAnswers((prev: any) => ({ ...prev, [`q${idx + 1}`]: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg text-black"
          >
            <option value="">Select</option>
            <option value="strongly agree">Strongly Agree</option>
            <option value="agree">Agree</option>
            <option value="neutral">Neutral</option>
            <option value="disagree">Disagree</option>
            <option value="strongly disagree">Strongly Disagree</option>
          </select>
        </div>
      ))}

      <button
        onClick={analyzeTest}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700"
      >
        Submit and Analyze →
      </button>

      {analysis && (
        <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Your Personalized Analysis</h2>
          <p className="text-gray-300 whitespace-pre-line">{analysis}</p>
        </div>
      )}
    </main>
  );
}
