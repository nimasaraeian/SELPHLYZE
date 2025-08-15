import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { experiment, variant, eventType, metadata } = body || {};
    if (!experiment || !variant || !eventType) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }
    let supabase: any = null;
    try { 
      const { getSupabaseServer } = await import("@/app/lib/supabaseServer");
      supabase = getSupabaseServer();
    } catch {}
    if (!supabase) return NextResponse.json({ ok: true });
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("ab_events").insert({
      user_id: user?.id ?? null,
      experiment,
      variant,
      event_type: eventType,
      metadata: metadata || {},
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}













