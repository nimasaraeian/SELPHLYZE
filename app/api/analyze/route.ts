import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { profile, answers } = body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // یادت باشه در .env کلیدتو بذاری
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a psychology analysis engine for Selphlyze. Provide detailed and personalized analysis."
        },
        {
          role: "user",
          content: `Here is a test profile:
Name: ${profile.displayName || "Anonymous"}
Age Range: ${profile.ageRange}
Gender: ${profile.gender}
Country: ${profile.country}
Answers: ${JSON.stringify(answers)}

Please analyze this person’s psychological profile in detail.`
        }
      ],
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
