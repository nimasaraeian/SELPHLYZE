import { NextResponse } from "next/server";
import { z } from "zod";

const StatusSchema = z.object({
  contentId: z.string().uuid(),
  status: z.enum(["TO_READ","IN_PROGRESS","DONE"]).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.any().optional(),
});

export async function POST(req: Request) {
  try {
    const body = StatusSchema.parse(await req.json());
    const { getSupabaseServer } = await import("@/app/lib/supabaseServer");
    const s = getSupabaseServer();
    const { data: { user } } = await s.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const update: any = {};
    if (body.status) update.status = body.status;
    if (typeof body.progress === 'number') update.progress = body.progress;
    if (typeof body.rating === 'number') update.rating = body.rating;
    if (typeof body.notes !== 'undefined') update.notes = body.notes;
    if (body.status === 'DONE') update.completed_at = new Date().toISOString();

    await s.from('user_content').update(update).eq('user_id', user.id).eq('content_id', body.contentId);
    if (body.status === 'DONE') {
      await s.from('activity').insert({ user_id: user.id, type: 'CONTENT_COMPLETED', ref_id: body.contentId });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}


