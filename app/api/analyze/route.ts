import { NextResponse } from "next/server";
// import { findRelevantReferences, generateRecommendationText } from "@/utils/psychologyReferences";
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
      // Provide helpful fallback responses for psychology questions
      const fallbackResponses = {
        en: "🔑 OpenAI API key is not configured. To enable AI features, please:\n\n1. Create a .env.local file in your project root\n2. Add: OPENAI_API_KEY=sk-your-key-here\n3. Get your key from: https://platform.openai.com/api-keys\n4. Restart your development server\n\nFor now, here's a general psychology tip: Practice mindfulness meditation for 10 minutes daily to reduce stress and improve mental clarity.",
        fa: "🔑 کلید API OpenAI تنظیم نشده است. برای فعال‌سازی ویژگی‌های AI، لطفاً:\n\n1. فایل .env.local در ریشه پروژه ایجاد کنید\n2. این خط را اضافه کنید: OPENAI_API_KEY=sk-your-key-here\n3. کلید خود را از اینجا دریافت کنید: https://platform.openai.com/api-keys\n4. سرور توسعه را مجدداً راه‌اندازی کنید\n\nفعلاً، یک نکته روانشناسی عمومی: روزانه 10 دقیقه مدیتیشن ذهن‌آگاهی انجام دهید تا استرس کاهش یابد و وضوح ذهنی بهبود یابد.",
        ar: "🔑 مفتاح OpenAI API غير مُكوّن. لتمكين ميزات الذكاء الاصطناعي، يرجى:\n\n1. إنشاء ملف .env.local في جذر المشروع\n2. إضافة: OPENAI_API_KEY=sk-your-key-here\n3. احصل على مفتاحك من: https://platform.openai.com/api-keys\n4. أعد تشغيل خادم التطوير\n\nفي الوقت الحالي، نصيحة نفسية عامة: مارس التأمل الذهني لمدة 10 دقائق يومياً لتقليل التوتر وتحسين الوضوح العقلي.",
        tr: "🔑 OpenAI API anahtarı yapılandırılmamış. AI özelliklerini etkinleştirmek için lütfen:\n\n1. Proje kökünde .env.local dosyası oluşturun\n2. Şunu ekleyin: OPENAI_API_KEY=sk-your-key-here\n3. Anahtarınızı buradan alın: https://platform.openai.com/api-keys\n4. Geliştirme sunucusunu yeniden başlatın\n\nŞimdilik, genel bir psikoloji ipucu: Stresi azaltmak ve zihinsel netliği artırmak için günde 10 dakika farkındalık meditasyonu yapın.",
        es: "🔑 La clave API de OpenAI no está configurada. Para habilitar las funciones de IA, por favor:\n\n1. Crea un archivo .env.local en la raíz del proyecto\n2. Agrega: OPENAI_API_KEY=sk-your-key-here\n3. Obtén tu clave de: https://platform.openai.com/api-keys\n4. Reinicia tu servidor de desarrollo\n\nPor ahora, un consejo de psicología general: Practica meditación de atención plena durante 10 minutos diarios para reducir el estrés y mejorar la claridad mental.",
        fr: "🔑 La clé API OpenAI n'est pas configurée. Pour activer les fonctionnalités d'IA, veuillez:\n\n1. Créer un fichier .env.local à la racine du projet\n2. Ajouter: OPENAI_API_KEY=sk-your-key-here\n3. Obtenir votre clé depuis: https://platform.openai.com/api-keys\n4. Redémarrer votre serveur de développement\n\nPour l'instant, un conseil de psychologie général: Pratiquez la méditation de pleine conscience pendant 10 minutes par jour pour réduire le stress et améliorer la clarté mentale."
      };
      
      const fallbackResponse = fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.en;
      
      return NextResponse.json({
        status: "success",
        aiResponse: fallbackResponse,
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
    
    // Recommendations removed - AI will only provide direct answers without book/podcast/article suggestions

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
