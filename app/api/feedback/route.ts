import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, comment, context } = body || {};
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "invalid rating" }, { status: 400 });
    }
    let supabase: any = null;
    try { supabase = (await import("@/app/lib/supabaseServer")).getSupabaseServer; } catch {}
    if (!supabase) return NextResponse.json({ ok: true });
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("feedback").insert({
      user_id: user?.id ?? null,
      rating,
      comment: comment || null,
      context: context || null,
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}













