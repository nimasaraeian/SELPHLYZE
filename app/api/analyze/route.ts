import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, language = "en" } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is missing");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI psychology assistant. You must respond in the same language as the user's question. 

Language code: ${language}

Language Guidelines:
- en: Respond in English
- fa: پاسخ را به زبان فارسی بدهید
- ar: يجب أن تجيب باللغة العربية
- tr: Türkçe yanıt vermelisiniz
- es: Responde en español
- fr: Répondez en français
- ru: Отвечайте на русском языке
- zh: 请用中文回答
- ja: 日本語で答えてください
- ko: 한국어로 답변해주세요
- hi: हिंदी में उत्तर दें
- pt: Responda em português

Always match the user's language exactly and provide helpful, empathetic psychology guidance.`
          },
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      status: "success",
      aiResponse: data.choices?.[0]?.message?.content || "⚠️ No content from AI",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Analyze endpoint is alive 🚀" });
}
