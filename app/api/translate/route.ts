import { NextResponse } from "next/server";

type RequestBody = {
  texts: string[];
  language: string; // target language code (e.g., 'fa')
};

export async function POST(req: Request) {
  try {
    const { texts, language }: RequestBody = await req.json();
    if (!Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ error: "texts must be a non-empty array" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is missing");

    const system = `You are a professional translator. Translate the given array of UI strings into the target language.
Strict requirements:
- Return ONLY a JSON array of strings, no extra text
- Keep the order exactly the same as input
- Do not explain or add notes
- Preserve placeholders or numbers if present
- Target language code: ${language}`;

    const user = JSON.stringify({ texts });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content returned from translation model");

    // Attempt to parse JSON array
    let translated: string[];
    try {
      translated = JSON.parse(content);
      if (!Array.isArray(translated)) throw new Error("Parsed content is not an array");
    } catch (e) {
      // If the model included extra text, try to extract JSON array
      const match = content.match(/\[([\s\S]*?)\]/);
      if (!match) throw e;
      translated = JSON.parse(match[0]);
    }

    if (translated.length !== texts.length) {
      // Fallback: return original texts to avoid UI break
      return NextResponse.json({ translations: texts, warning: "length_mismatch" });
    }

    return NextResponse.json({ translations: translated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Translate endpoint is alive 🚀" });
}


