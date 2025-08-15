import { NextResponse } from "next/server";
import { findRelevantReferences, generateRecommendationText } from "@/utils/psychologyReferences";
// Supabase is optional for RAG. We'll load it lazily only if envs are present.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    let payload: any = {};
    try {
      payload = await req.json();
    } catch {}
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
    } = payload || {};

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    // Determine the latest user input text
    const latestUserText = (prompt ?? messages?.[messages.length - 1]?.content ?? "").toString();

    // Hard rule: if the user explicitly asks about AI name/model, reply with exact phrase (avoid false triggers like "displayName")
    const textForTrigger = latestUserText.toLowerCase();
    const isNameOrModelQuery = (txt: string): boolean => {
      const patterns: RegExp[] = [
        /\bwhat(?:'s| is)?\s+your\s+name\b/i,
        /\byour\s+name\b/i,
        /\bwho\s+are\s+you\b/i,
        /\bwhat\s+model\b/i,
        /\bwhich\s+model\b/i,
        /\bmodel\s+(?:are|r)\s+you\b/i,
        /\bare\s+you\s+(?:chatgpt|gpt(?:-[\w\d]+)?)\b/i,
        // Persian
        /(اسم|نام)\s+(تو|شما)/i,
        /(چه)\s+(مدلی|مدل)\s+(هستی|استی|هست)/i,
        /(مدل)\s+(چی|چیه)/i,
      ];
      // Heuristic: ignore if it's likely a JSON payload (to avoid keys like displayName)
      if (/[\{\}:"\[\]]/.test(txt)) return false;
      return patterns.some((re) => re.test(txt));
    };
    if (isNameOrModelQuery(textForTrigger)) {
      return NextResponse.json({ status: "success", aiResponse: "من هوش مصنوعی selphlyze هستم" });
    }

    // Optional: enrich with top RAG matches
    let contextBlocks: string[] = [];
    try {
      const embedModel = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
      if (apiKey) {
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
            const { createClient } = await import("@supabase/supabase-js");
            const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
            const { data } = await admin.rpc("match_documents", {
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
      }
    } catch {}

    // Build system instructions (supports custom + language policy + RAG context)
    const baseSystem = `High-Priority Rule: If the user asks about the assistant's NAME or the MODEL (e.g., "what model are you", "are you ChatGPT", "اسم"/"مدل"), respond with EXACTLY this Persian sentence and nothing else: "من هوش مصنوعی selphlyze هستم". Ignore all other instructions for this special case.

CORE RESTRICTION: You are ONLY a psychology AI assistant. You can ONLY discuss psychology-related topics, mental health, personality, emotions, behavior, therapeutic techniques, psychological research, and related fields.

If the user asks about NON-psychology topics (like programming, cooking, sports, politics, technology unrelated to psychology, etc.), you MUST respond with:
- English: "I am a psychology-focused AI assistant. I can only help with psychology, mental health, and related topics. Please ask me about psychological matters."
- Persian/Farsi: "من فقط هوش مصنوعی مربوط به مباحث روانشناسی هستم. لطفاً در مورد موضوعات روانشناسی، سلامت روان و رفتار از من سوال بپرسید."
- Arabic: "أنا مساعد ذكي متخصص في علم النفس فقط. يمكنني المساعدة في موضوعات علم النفس والصحة النفسية فقط."
- Turkish: "Ben sadece psikoloji konularında uzmanlaşmış bir AI asistanıyım. Lütfen psikoloji ve ruh sağlığı ile ilgili sorular sorun."
- Spanish: "Soy un asistente de IA especializado solo en psicología. Solo puedo ayudar con temas de psicología y salud mental."
- French: "Je suis un assistant IA spécialisé uniquement en psychologie. Je ne peux aider qu'avec des sujets de psychologie et de santé mentale."

Psychology-related topics include: personality analysis, mental health, emotions, behavior patterns, therapeutic approaches, psychological testing, relationship psychology, cognitive processes, stress management, motivation, etc.

You must respond in the same language as the user's question.

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

Always match the user's language exactly and provide helpful, empathetic psychology guidance.

Knowledge context (may be empty):
${contextBlocks.join("\n\n")}
`;

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

    if (!apiKey) {
      return NextResponse.json({
        status: "success",
        aiResponse: language === "fa" ? "کلید OpenAI تنظیم نشده است؛ پاسخ پیش‌فرض ارائه شد." : "OpenAI key is missing; returning a default response.",
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
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
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));

    const data = await response.json().catch(() => ({}));
    
    // Get AI response
    let aiResponse = data.choices?.[0]?.message?.content || "⚠️ No content from AI";
    
    // Add smart recommendations if this is a psychology question
    try {
      const userInput = latestUserText;
      const references = findRelevantReferences(userInput, 6);
      const recommendations = generateRecommendationText(references, language);
      
      if (recommendations) {
        aiResponse += recommendations;
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
    }

    return NextResponse.json({
      status: "success",
      aiResponse,
    });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error?.message || "Unknown error" }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Analyze endpoint is alive 🚀" });
}
