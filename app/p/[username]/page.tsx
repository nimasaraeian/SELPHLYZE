import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Props = { params: { username: string } };

export default async function PublicProfilePage({ params }: Props) {
	const { username } = params;
	if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
		return (
			<main className="min-h-screen flex items-center justify-center p-6">
				<div className="max-w-md w-full text-center">
					<h1 className="text-2xl font-bold mb-2">Public profile</h1>
					<p className="text-gray-500">Supabase is not configured.</p>
				</div>
			</main>
		);
	}

	const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
	const { data: profile } = await s
		.from("profiles")
		.select("id, full_name, username, avatar_url, bio, location, languages, public")
		.eq("username", username)
		.maybeSingle();

	if (!profile || profile.public === false) return notFound();

	return (
		<main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-24 px-6">
			<div className="max-w-3xl mx-auto">
				<div className="rounded-3xl p-8 bg-[var(--surface)] border border-[var(--border)]">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--surface)] border border-[var(--border)]">
							{profile.avatar_url ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img src={profile.avatar_url} alt={profile.full_name || profile.username} className="w-full h-full object-cover" />
							) : (
								<div className="w-full h-full grid place-items-center text-[var(--muted)]">👤</div>
							)}
						</div>
						<div>
							<h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
							<p className="text-[var(--muted)] text-sm">@{profile.username}</p>
						</div>
					</div>
					{profile.bio && <p className="mt-4 text-[var(--foreground)]">{profile.bio}</p>}
					<div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
						{profile.location && <span>📍 {profile.location}</span>}
						{Array.isArray(profile.languages) && profile.languages.length > 0 && (
							<span>🌐 {profile.languages.join(", ")}</span>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}

















