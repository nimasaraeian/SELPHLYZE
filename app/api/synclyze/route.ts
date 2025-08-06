import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userOne, userTwo } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY missing");
    }

    const prompt = `Compare the following answers from two partners and provide a detailed analysis of their relationship compatibility:
    
    Partner 1: ${JSON.stringify(userOne, null, 2)}
    Partner 2: ${JSON.stringify(userTwo, null, 2)}
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const message =
      data?.choices?.[0]?.message?.content || "⚠️ No analysis content from AI.";

    return NextResponse.json({ analysis: message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
