"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<html>
			<body>
				<main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-6">
					<div className="max-w-md w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 text-center">
						<h1 className="text-2xl font-bold mb-2">مشکلی پیش آمده</h1>
						<p className="text-[var(--muted)] text-sm mb-4">{error?.message || "An unexpected error occurred."}</p>
						<button onClick={() => reset()} className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white">تلاش مجدد</button>
					</div>
				</main>
			</body>
		</html>
	);
}











