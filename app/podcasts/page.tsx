export default function PodcastsPage() {
  const platforms: { name: string; logo: string; buildUrl: (q: string) => string }[] = [
    { name: "Spotify", logo: "/podcasts/spotify.svg", buildUrl: (q) => `https://open.spotify.com/search/${encodeURIComponent(q)}/podcasts` },
    { name: "Apple Podcasts", logo: "/podcasts/apple-podcasts.svg", buildUrl: (q) => `https://podcasts.apple.com/search?term=${encodeURIComponent(q)}` },
    { name: "Google Podcasts", logo: "/podcasts/google-podcasts.svg", buildUrl: (q) => `https://podcasts.google.com/search/${encodeURIComponent(q)}` },
    { name: "Pocket Casts", logo: "/podcasts/pocketcasts.svg", buildUrl: (q) => `https://pocketcasts.com/search/${encodeURIComponent(q)}` },
    { name: "Overcast", logo: "/podcasts/overcast.svg", buildUrl: (q) => `https://overcast.fm/podcasts?query=${encodeURIComponent(q)}` },
    { name: "Castbox", logo: "/podcasts/castbox.svg", buildUrl: (q) => `https://castbox.fm/search?query=${encodeURIComponent(q)}` },
  ];

  const categories = [
    { title: "Personality Psychology", query: "personality psychology" },
    { title: "Cognitive Psychology", query: "cognitive psychology" },
    { title: "Behavioral Psychology", query: "behavioral psychology" },
    { title: "Developmental Psychology", query: "developmental psychology" },
    { title: "Social Psychology", query: "social psychology" },
    { title: "Clinical Psychology", query: "clinical psychology" },
    { title: "Biopsychology/Neuropsychology", query: "biopsychology neuropsychology" },
    { title: "Health Psychology", query: "health psychology" },
    { title: "Educational Psychology", query: "educational psychology" },
    { title: "Industrial–Organizational", query: "industrial organizational psychology" },
    { title: "Positive Psychology", query: "positive psychology" },
    { title: "Cultural/Cross‑Cultural", query: "cross cultural psychology" },
    { title: "Forensic Psychology", query: "forensic psychology" },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold">Psychology Podcasts</h1>
          <p className="text-slate-300 mt-2">Browse by 13 core domains. Each card links to topic feeds across major platforms.</p>
        </header>

        <section className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.title} className="rounded-3xl p-6 border bg-[var(--surface)] border-[var(--border)] hover:border-teal-500/60 transition shadow-[0_10px_30px_rgba(2,6,23,0.06)] hover:shadow-[0_16px_40px_rgba(2,6,23,0.10)]">
              <div className="mb-5">
                <h2 className="text-2xl font-bold">{cat.title}</h2>
                <p className="text-[var(--muted)] text-sm">Tap a platform to view curated search results</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {platforms.map((p, i) => (
                  <a key={p.name} href={p.buildUrl(cat.query)} target="_blank" rel="noreferrer" className="group block rounded-xl p-3 border bg-[var(--surface)] border-[var(--border)] hover:border-teal-500 shadow-[0_4px_14px_rgba(2,6,23,0.05)] hover:shadow-[0_8px_20px_rgba(2,6,23,0.09)] transition transform hover:-translate-y-0.5" style={{ transitionDelay: `${i * 20}ms` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt={p.name} className="w-10 h-10 rounded-md mx-auto mb-2" />
                    <div className="text-center text-[11px] text-[var(--muted)] group-hover:text-teal-700">{p.name}</div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}


