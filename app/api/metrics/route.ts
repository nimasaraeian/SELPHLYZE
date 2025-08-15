import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/getSupabaseServer";

export async function GET() {
  try {
    const supabase = getSupabaseServer();

    const { count: testCount } = await supabase.from("test_results").select("id", { count: "exact", head: true });
    const { data: fb } = await supabase.from("feedback").select("rating");
    const ratings = Array.isArray(fb) ? fb.map((r: any) => Number(r.rating)).filter((n) => !isNaN(n)) : [];
    const positive = ratings.length ? Math.round((ratings.filter((r) => r >= 4).length / ratings.length) * 100) : 0;

    return NextResponse.json({ tests: testCount || 0, positive });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


