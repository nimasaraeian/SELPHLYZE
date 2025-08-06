"use client";

import { useState } from "react";

export default function SynclyzePage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.error) {
        setResponse(`❌ Error: ${data.error}`);
      } else {
        setResponse(JSON.stringify(data, null, 2));
      }
    } catch (err: any) {
      setResponse(`❌ Fetch failed: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1>🔗 Synclyze Test</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your prompt here..."
          style={{ width: "100%", height: "100px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Analyze
        </button>
      </form>
      {response && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: "10px",
            marginTop: "20px",
            whiteSpace: "pre-wrap",
          }}
        >
          {response}
        </pre>
      )}
    </div>
  );
}
