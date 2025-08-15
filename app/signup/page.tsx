"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function SignUpPage() {
	const router = useRouter();
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [awaitConfirmation, setAwaitConfirmation] = useState<boolean>(false);

	useEffect(() => {
		// اگر کاربر لاگین است، به پروفایل هدایت شود
		const check = async () => {
			try {
				const { data: { session } } = await supabase.auth.getSession();
				if (session) router.replace("/profile");
			} catch {}
		};
		check();
	}, [router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
    try {
      setLoading(true);
      setError(null);

			// Sign up user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/profile` : undefined }
      });
			if (signUpError) throw signUpError;
			const user = signUpData.user;
			if (!user) throw new Error("Sign up did not return a user.");

			// Check if session exists (depends on email confirmation settings)
			const { data: sessionData } = await supabase.auth.getSession();
			const hasSession = Boolean(sessionData.session);
			if (!hasSession) {
				setAwaitConfirmation(true);
				return; // stop here; user must confirm email before profile creation
			}

			let avatarUrl: string | null = null;
			if (avatarFile) {
				const filePath = `${user.id}/${Date.now()}_${avatarFile.name}`;
				const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, avatarFile, { upsert: true });
				if (!uploadError) {
					const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
					avatarUrl = data.publicUrl;
				}
			}

			// determine username (optional). slugify if not provided
			const baseCandidate = (username || fullName || email.split("@")[0] || "user")
				.toLowerCase()
				.replace(/[^a-z0-9_]+/g, "_")
				.replace(/^_+|_+$/g, "");
			let finalUsername = baseCandidate || `user_${user.id.slice(0, 6)}`;
			// ensure uniqueness with a few tries
			for (let i = 0; i < 3; i++) {
				const { data: exists } = await supabase
					.from("profiles")
					.select("id")
					.eq("username", finalUsername)
					.maybeSingle();
				if (!exists) break;
				finalUsername = `${baseCandidate}_${Math.floor(Math.random() * 1000)}`;
			}

			// create or update profile row
			await supabase.from("profiles").upsert(
				{
					id: user.id,
					full_name: fullName || email.split("@")[0],
					avatar_url: avatarUrl,
					languages: ["English"],
					user_type: "client",
					username: finalUsername,
					public: true,
				},
				{ onConflict: "id" }
			);

			// هدایت به پروفایل
			router.replace("/profile");
		} catch (e: any) {
			setError(e.message || "خطا در ثبت‌نام");
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-24 px-6">
			<div className="max-w-lg mx-auto">
				<div className="rounded-3xl p-8 bg-[var(--surface)] border border-[var(--border)]">
					<h1 className="text-3xl font-extrabold mb-6 text-center">Create your account</h1>
					<p className="text-[var(--muted)] text-sm text-center mb-8">Name and avatar are optional; email and password are required for sign-in.</p>
					{awaitConfirmation ? (
						<div className="space-y-4 text-center">
							<p className="text-[var(--foreground)]">We have sent a confirmation link to your email.</p>
							<p className="text-[var(--muted)] text-sm">Please verify your email, then return and sign in. Your profile will be created automatically on first login.</p>
						</div>
					) : (
					<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm mb-2 text-[var(--muted)]">Username (optional)</label>
					<input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="e.g., john_doe" className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:border-teal-500 outline-none" />
				</div>
				<div>
							<label className="block text-sm mb-2 text-[var(--muted)]">Full name (optional)</label>
							<input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:border-teal-500 outline-none" />
						</div>
						<div>
							<label className="block text-sm mb-2 text-[var(--muted)]">Email</label>
							<input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:border-teal-500 outline-none" />
						</div>
						<div>
							<label className="block text-sm mb-2 text-[var(--muted)]">Password</label>
							<input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:border-teal-500 outline-none" />
						</div>
						<div>
							<label className="block text-sm mb-2 text-[var(--muted)]">Profile photo (optional)</label>
							<input type="file" accept="image/*" onChange={(e)=>setAvatarFile(e.target.files?.[0] || null)} className="w-full text-sm" />
						</div>
						{error && <p className="text-red-400 text-sm">{error}</p>}
						<button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-medium">
							{loading ? "Creating your account..." : "Create account"}
						</button>
					</form>
					)}
					<div className="text-center mt-4 text-sm text-[var(--muted)]">
						Already have an account? <a href="/profile" className="text-teal-400 hover:underline">Sign in</a>
					</div>
				</div>
			</div>
		</main>
	);
}



