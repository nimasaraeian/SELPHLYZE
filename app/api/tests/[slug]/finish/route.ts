import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/app/lib/getSupabaseServer";

const FinishSchema = z.object({
  score: z.any(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const body = FinishSchema.parse(await req.json());
    const s = getSupabaseServer();
    const { data: { user } } = await s.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    // Ensure test exists or create catalog entry if missing
    const { data: test } = await s.from("tests_catalog").select("id").eq("slug", slug).maybeSingle();
    let testId = test?.id as string | undefined;
    if (!testId) {
      const ins = await s.from("tests_catalog").insert({ slug, title: slug }).select("id").single();
      testId = ins.data?.id;
    }

    // Insert result
    const { data: tr } = await s
      .from("test_results")
      .insert({
        user_id: user.id,
        test_slug: slug,
        test_name: slug,
        score: null,
        payload: body.score ?? {},
        started_at: body.startedAt ? new Date(body.startedAt).toISOString() : new Date().toISOString(),
        finished_at: body.completedAt ? new Date(body.completedAt).toISOString() : new Date().toISOString(),
      })
      .select("id")
      .single();

    // Activity
    await s.from("activity").insert({ user_id: user.id, type: "TEST_COMPLETED", ref_id: tr?.id, payload: { slug } });

    return NextResponse.json({ ok: true, id: tr?.id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}


