import { NextResponse } from "next/server";
import { z } from "zod";

const AddSchema = z.object({
  type: z.enum(["BOOK","PODCAST","ARTICLE"]),
  title: z.string().min(1),
  author: z.string().optional().nullable(),
  url: z.string().url().optional().nullable(),
  coverUrl: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
});

export async function POST(req: Request) {
  try {
    const body = AddSchema.parse(await req.json());
    const { getSupabaseServer } = await import("@/app/lib/supabaseServer");
    const s = getSupabaseServer();
    const { data: { user } } = await s.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { data: c } = await s
      .from("content")
      .insert({ type: body.type, title: body.title, author: body.author, url: body.url, cover_url: body.coverUrl, tags: body.tags })
      .select("id")
      .single();

    await s.from("user_content").insert({ user_id: user.id, content_id: c!.id, status: 'TO_READ' });
    await s.from("activity").insert({ user_id: user.id, type: 'CONTENT_ADDED', ref_id: c!.id, payload: { type: body.type } });

    return NextResponse.json({ ok: true, id: c!.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}


