import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/app/lib/getSupabaseServer";

const ProgressSchema = z.object({
  currentStep: z.number().int().min(0),
  percent: z.number().int().min(0).max(100),
});

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const body = ProgressSchema.parse(await req.json());
    const s = getSupabaseServer();
    const { data: { user } } = await s.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { data: moduleRow } = await s.from("modules").select("id").eq("slug", slug).maybeSingle();
    if (!moduleRow) return NextResponse.json({ error: "module_not_found" }, { status: 404 });

    const upsert = await s
      .from("module_progress")
      .upsert({ user_id: user.id, module_id: moduleRow.id, current_step: body.currentStep, percent: body.percent }, { onConflict: "user_id,module_id" })
      .select("id")
      .single();

    await s.from("activity").insert({ user_id: user.id, type: "MODULE_UPDATED", ref_id: moduleRow.id, payload: { percent: body.percent } });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}


