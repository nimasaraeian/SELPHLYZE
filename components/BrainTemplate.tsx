"use client";
import { useEffect, useState } from "react";

export default function BrainTemplate() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("userResponses");
    if (!storedData) {
      setError("❌ No response data found.");
      setLoading(false);
      return;
    }

    fetch("/api/analyze", {
      method: "POST",
      body: storedData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          setError(res.error);
        } else {
          setData(res);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("❌ Error contacting AI");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-10">⏳ Analyzing...</div>;
  if (error) return <div className="text-red-500 p-10 text-center">{error}</div>;
  if (!data?.sections || !Array.isArray(data.sections)) return <div className="text-center p-10">Invalid response format.</div>;

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">🧠 Analysis Results</h2>
      <ul className="grid grid-cols-2 gap-4">
        {data.sections.map((s: any, index: number) => (
          <li key={index} className="bg-gray-100 rounded-lg p-4 shadow">
            <h3 className="text-lg font-semibold" style={{ color: s.color }}>{s.title}</h3>
            <p>{s.value}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">📋 Summary</h3>
        <ul className="list-disc pl-5">
          {data.summary?.map((s: string, idx: number) => (
            <li key={idx}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
