import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("🔑 OPENAI KEY:", process.env.OPENAI_API_KEY ? "Loaded" : "Missing");

  try {
    const { answers } = await req.json();

    const prompt = `
    You are a professional psychologist AI specialized in personality assessment.
    Analyze the following test answers and provide a DEEP and DETAILED psychological analysis. 
    Include not only scores, but rich explanations, emotional tendencies, cognitive strengths, 
    potential challenges, and actionable growth recommendations.

    Answers: ${JSON.stringify(answers)}

    Return ONLY valid JSON in this structure (no extra text outside JSON):

    {
      "sections": [
        {
          "title": "Openness",
          "value": "percentage",
          "color": "indigo",
          "position": "topLeft",
          "description": "Detailed explanation of openness including creativity, adaptability, and curiosity."
        },
        {
          "title": "Conscientiousness",
          "value": "percentage",
          "color": "yellow",
          "position": "topRight",
          "description": "Explanation of conscientiousness including discipline, reliability, and organization."
        },
        {
          "title": "Extraversion",
          "value": "percentage",
          "color": "green",
          "position": "bottomLeft",
          "description": "Description of sociability, energy levels, and approach to social interactions."
        },
        {
          "title": "Emotional Stability",
          "value": "percentage",
          "color": "red",
          "position": "bottomRight",
          "description": "Analysis of emotional resilience, stress management, and mood balance."
        }
      ],
      "summary": [
        "🧠 Personality Type: A rich description of the user's personality type",
        "💡 Strengths: Multiple strengths with context and examples",
        "⚠ Weaknesses: Potential challenges with psychological explanation",
        "🎯 Growth Path: Specific recommendations for personal and professional growth",
        "⚡ Emotional Style: Detailed analysis of emotional regulation and patterns"
      ]
    }
    `;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8, // کمی خلاق‌تر
      }),
    });

    const data = await res.json();
    console.log("🔄 Full Response:", JSON.stringify(data, null, 2));

    const content = data.choices?.[0]?.message?.content?.trim();
    console.log("AI Raw Content:", content);

    if (!content) {
      return NextResponse.json({ error: "No content from AI" }, { status: 500 });
    }

    try {
      const clean = content
        .replace(/^```json/, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      return NextResponse.json(JSON.parse(clean));
    } catch (e) {
      console.error("❌ JSON Parse Error:", content);
      return NextResponse.json(
        { error: "Invalid JSON from AI", raw: content },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("🔥 API Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}
