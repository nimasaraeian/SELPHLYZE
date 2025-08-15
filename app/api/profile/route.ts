import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/app/lib/supabaseServer";

const ProfileSchema = z.object({
  full_name: z.string().min(1).max(80),
  username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/),
  bio: z.string().max(280).optional().nullable(),
  location: z.string().max(80).optional().nullable(),
  tagline: z.string().max(120).optional().nullable(),
  links: z.any().optional(),
  language: z.string().max(8).optional().nullable(),
  timezone: z.string().max(64).optional().nullable(),
  public: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = ProfileSchema.parse(json);
    const s = getSupabaseServer();
    const { data: { user } } = await s.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    // Ensure username is unique if provided
    if (body.username) {
      const { data: exists } = await s
        .from("profiles")
        .select("id")
        .eq("username", body.username)
        .neq("id", user.id)
        .maybeSingle();
      if (exists) return NextResponse.json({ error: "username_taken" }, { status: 409 });
    }

    const update = {
      full_name: body.full_name,
      bio: body.bio ?? null,
      location: body.location ?? null,
      tagline: body.tagline ?? null,
      links: body.links ?? null,
      languages: body.language ? [body.language] : undefined,
      timezone: body.timezone ?? null,
      public: body.public ?? undefined,
      username: body.username,
    } as any;

    await s.from("profiles").update(update).eq("id", user.id);
    await s.from('activity').insert({ user_id: user.id, type: 'PROFILE_UPDATED', payload: { username: body.username } }).select().maybeSingle();

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}


