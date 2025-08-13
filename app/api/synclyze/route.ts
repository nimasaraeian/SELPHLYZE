import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userOne, userTwo, meta } = await req.json();

    // Baseline deterministic scoring to avoid generic outputs
    const allAnswers: string = Object.values(userTwo || {}).join(" \n ").toLowerCase();
    const count = (re: RegExp) => (allAnswers.match(re) || []).length;

    const anxSignals = count(/worry|worst|anxious|checking|multiple messages|pull away|hurt/i);
    const avoSignals = count(/give them space|wait|ignore|distant|withdraw|stay silent|act as if nothing/i);
    const secSignals = count(/ask|offer|calm|listen|compromise|research together|gently/i);
    const disSignals = Math.min(anxSignals, avoSignals);

    const attachmentPick = (() => {
      const arr = [
        { k: "SEC", v: secSignals },
        { k: "ANX", v: anxSignals },
        { k: "AVO", v: avoSignals },
        { k: "DIS", v: disSignals },
      ].sort((a, b) => b.v - a.v);
      return (arr[0]?.v ?? 0) === 0 ? "SEC" : arr[0].k;
    })();

    const eqScoreBase =
      secSignals +
      count(/observe|body language|tone|comfort|soft(er)? tone|empathy|listen/i) -
      count(/match their tone|irritated|withdraw|assume/i);
    const toScaled = (v: number) => Math.max(1, Math.min(5, Math.round(2 + v)));
    const eqScore = toScaled(eqScoreBase / 3);

    const conflictPick = (() => {
      const col = count(/compromise|together|ask direct|calm|listen|research together|questions to understand/i);
      const comp = count(/stick firmly|defend|match their tone/i);
      const avo = count(/leave the room|change the topic|delay/i);
      const acc = count(/let them choose/i);
      const arr = [
        { k: "COL", v: col },
        { k: "COMP", v: comp },
        { k: "AVO", v: avo },
        { k: "ACC", v: acc },
      ].sort((a, b) => b.v - a.v);
      return arr[0]?.v === arr[1]?.v ? "MIX" : (arr[0]?.k || "COL");
    })();

    const empathyScore = toScaled(
      (count(/tone|body language|soft(er)? tone|hug|comfort|perspective/i) - count(/judge|assume worst/i)) / 2
    );

    const languagePick = (() => {
      const dir = count(/ask direct|ask directly|follow-up|questions/i);
      const ind = count(/wait for them to speak|indirect|keep suspense/i);
      const emo = count(/emoji|emotional/i);
      const neu = count(/when they have time|neutral/i);
      const arr = [
        { k: "DIR", v: dir },
        { k: "IND", v: ind },
        { k: "EMO", v: emo },
        { k: "NEU", v: neu },
      ].sort((a, b) => b.v - a.v);
      return arr[0]?.v === arr[1]?.v ? "MIX" : (arr[0]?.k || "DIR");
    })();

    const baseline = {
      code: `SYNC(${attachmentPick}-E${eqScore}-${conflictPick}-EA${empathyScore}-${languagePick})`,
      scores: {
        attachment: attachmentPick === "SEC" ? 4 : attachmentPick === "ANX" || attachmentPick === "AVO" ? 3 : 2,
        eq: eqScore,
        conflict: conflictPick === "COL" ? 4 : conflictPick === "MIX" ? 3 : 2,
        empathy: empathyScore,
        language: languagePick === "DIR" || languagePick === "EMO" ? 4 : languagePick === "MIX" ? 3 : 2,
      },
    };

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY missing");
    }
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const prompt = `You are the AI psychometric engine for the Selphlyze platform (Synclyze module).

Input Data:
Partner 1 (reference): ${JSON.stringify(userOne, null, 2)}
Partner 2 (current): ${JSON.stringify(userTwo, null, 2)}

Meta (grouping): ${JSON.stringify(meta || {}, null, 2)}

Baseline (DO NOT change these; align narrative with them):
code: ${baseline.code}
scores: ${JSON.stringify(baseline.scores)}

Task:
Return STRICT JSON with ONLY these keys (no code fences, no extra commentary):
{
  "sections": {
    "attachment": { "title": "Attachment Style", "summary": "...", "behaviors": ["..."], "impact": ["..."], "strengths": ["..."], "risks": ["..."], "recommendations": ["..."] },
    "eq": { "title": "Emotional Intelligence", "summary": "...", "behaviors": ["..."], "impact": ["..."], "strengths": ["..."], "risks": ["..."], "recommendations": ["..."] },
    "conflictStyle": { "title": "Conflict Style", "summary": "...", "behaviors": ["..."], "impact": ["..."], "strengths": ["..."], "risks": ["..."], "recommendations": ["..."] },
    "empathyAccuracy": { "title": "Empathy Accuracy", "summary": "...", "behaviors": ["..."], "impact": ["..."], "strengths": ["..."], "risks": ["..."], "recommendations": ["..."] },
    "languageStyle": { "title": "Language Style", "summary": "...", "behaviors": ["..."], "impact": ["..."], "strengths": ["..."], "risks": ["..."], "recommendations": ["..."] }
  },
  "byCategory": {
    "textual": { "summary": "...", "insights": ["..."], "risks": ["..."], "recommendations": ["..."] },
    "visual": { "summary": "...", "insights": ["..."], "risks": ["..."], "recommendations": ["..."] },
    "audio": { "summary": "...", "insights": ["..."], "risks": ["..."], "recommendations": ["..."] }
  }
}

Rules:
- Use ONLY the provided answers and meta to produce narrative; do NOT generalize or reuse examples.
- Do NOT output any code or scores; they are already computed and provided above.
- Keep language concise, evidence-based, and aligned with the baseline code and scores.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    // Try to parse strict JSON; fallback to basic extraction
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json({ code: baseline.code, scores: baseline.scores, sections: parsed.sections, byCategory: parsed.byCategory });
    } catch {
      // Fallback: extract code and wrap explanation in generic section
      const cleaned = content.trim();
      return NextResponse.json({ code: baseline.code, scores: baseline.scores, sections: { overview: { title: "Overview", summary: cleaned } }, raw: content });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
