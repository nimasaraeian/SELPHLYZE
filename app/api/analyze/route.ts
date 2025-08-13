import { NextResponse } from "next/server";
// Supabase is optional for RAG. We'll load it lazily only if envs are present.

export async function POST(req: Request) {
  try {
    const {
      prompt,
      language = "en",
      messages,
      system,
    }: {
      prompt?: string;
      language?: string;
      messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
      system?: string;
    } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is missing");
    }
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    // Determine the latest user input text
    const latestUserText = (prompt ?? messages?.[messages.length - 1]?.content ?? "").toString();

    // Hard rule: if the user asks about AI name or model, reply with the exact phrase (FA)
    const lower = latestUserText.toLowerCase();
    const nameModelTriggers = [
      // English
      "your name", "what is your name", "who are you", "name", "model", "what model", "which model", "gpt", "chatgpt", "which gpt",
      // Persian
      "اسم", "نام", "مدل", "چه مدلی", "اسم هوش مصنوعی", "چی هستی", "چه مدلی هستی",
      // Generic
      "ai name", "ai model", "llm", "model name", "model version"
    ];
    if (nameModelTriggers.some((t) => lower.includes(t))) {
      return NextResponse.json({ status: "success", aiResponse: "من هوش مصنوعی selphlyze هستم" });
    }

    // Optional: enrich with top RAG matches
    let contextBlocks: string[] = [];
    try {
      const embedModel = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
      const embedResp = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model: embedModel, input: prompt || messages?.slice(-1)?.[0]?.content || "" }),
      });
      const embedJson = await embedResp.json();
      const qvec: number[] | undefined = embedJson?.data?.[0]?.embedding;
      if (qvec && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const { supabaseServer } = await import("@/app/lib/supabaseServer");
          const { data } = await supabaseServer.rpc("match_documents", {
            p_namespace: null,
            p_query_embedding: qvec as unknown as any,
            p_match_count: 5,
          });
          if (Array.isArray(data)) {
            contextBlocks = data
              .slice(0, 5)
              .map((d: any) => `${d.title ? `Title: ${d.title}\n` : ""}${d.text}`);
          }
        } catch {}
      }
    } catch {}

    // Build system instructions (supports custom + language policy + RAG context)
    const baseSystem = `High-Priority Rule: If the user asks about the assistant's NAME or the MODEL (e.g., "what model are you", "are you ChatGPT", "اسم"/"مدل"), respond with EXACTLY this Persian sentence and nothing else: "من هوش مصنوعی selphlyze هستم". Ignore all other instructions for this special case.\n\nYou are a helpful AI psychology assistant. You must respond in the same language as the user's question. \n\nLanguage code: ${language}\n\nLanguage Guidelines:\n- en: Respond in English\n- fa: پاسخ را به زبان فارسی بدهید\n- ar: يجب أن تجيب باللغة العربية\n- tr: Türkçe yanıt vermelisiniz\n- es: Responde en español\n- fr: Répondez en français\n- ru: Отвечайте на русском языке\n- zh: 请用中文回答\n- ja: 日本語で答えてください\n- ko: 한국어로 답변해주세요\n- hi: हिंदी में उत्तर दें\n- pt: Responda em português\n\nAlways match the user's language exactly and provide helpful, empathetic psychology guidance.\n\nKnowledge context (may be empty):\n${contextBlocks.join("\n\n")}\n`;

    const systemContent = `${system ? `${system}\n\n` : ""}${baseSystem}`;

    // Build messages payload: prefer provided multi-turn messages; fallback to single-turn prompt
    const messagesPayload: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemContent },
      ...(
        Array.isArray(messages) && messages.length > 0
          ? messages.map((m) => ({ role: m.role, content: String(m.content || "") })).slice(-20) // cap history
          : (prompt ? [{ role: "user" as const, content: prompt }] : [])
      ),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messagesPayload,
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
