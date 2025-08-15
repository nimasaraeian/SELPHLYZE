import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { getSupabaseServer } = await import("@/app/lib/supabaseServer");
  const s = getSupabaseServer();
  const { data: { user } } = await s.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const from = Number(url.searchParams.get('from') || 0);
  const limit = Math.min(50, Number(url.searchParams.get('limit') || 20));
  const { data } = await s.from('activity').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).range(from, from + limit - 1);
  return NextResponse.json({ items: data || [] });
}


