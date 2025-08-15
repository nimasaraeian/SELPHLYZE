"use client";

import { useEffect, useState } from "react";

type Book = { title: string; author: string; cover?: string; amazon: string };

const UNSPLASH_PLACEHOLDER = "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80&auto=format&fit=crop";

const library: { name: string; color: string; books: Book[] }[] = [
  { name: "Personality", color: "from-teal-500 to-emerald-600", books: [
      { title: "Personality: What Makes You the Way You Are", author: "Daniel Nettle", amazon: "https://www.amazon.com/s?k=Personality+Daniel+Nettle" },
      { title: "Quiet", author: "Susan Cain", amazon: "https://www.amazon.com/s?k=Quiet+Susan+Cain" },
      { title: "The Personality Brokers", author: "Merve Emre", amazon: "https://www.amazon.com/s?k=The+Personality+Brokers+Merve+Emre" },
  ]},
  { name: "Emotions & Affect", color: "from-indigo-500 to-purple-600", books: [
      { title: "Emotional Intelligence", author: "Daniel Goleman", amazon: "https://www.amazon.com/s?k=Emotional+Intelligence+Daniel+Goleman" },
      { title: "Emotional Agility", author: "Susan David", amazon: "https://www.amazon.com/s?k=Emotional+Agility+Susan+David" },
      { title: "The Language of Emotions", author: "Karla McLaren", amazon: "https://www.amazon.com/s?k=The+Language+of+Emotions+Karla+McLaren" },
  ]},
  { name: "Cognition", color: "from-blue-500 to-cyan-600", books: [
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", amazon: "https://www.amazon.com/s?k=Thinking+Fast+and+Slow+Kahneman" },
      { title: "How the Mind Works", author: "Steven Pinker", amazon: "https://www.amazon.com/s?k=How+the+Mind+Works+Pinker" },
      { title: "Cognitive Psychology: A Student's Handbook", author: "Michael Eysenck", amazon: "https://www.amazon.com/s?k=Cognitive+Psychology+Eysenck" },
  ]},
  { name: "Motivation", color: "from-amber-500 to-orange-600", books: [
      { title: "Drive", author: "Daniel H. Pink", amazon: "https://www.amazon.com/s?k=Drive+Daniel+Pink" },
      { title: "Why We Do What We Do", author: "Edward L. Deci", amazon: "https://www.amazon.com/s?k=Why+We+Do+What+We+Do+Deci" },
      { title: "Mindset", author: "Carol S. Dweck", amazon: "https://www.amazon.com/s?k=Mindset+Carol+Dweck" },
  ]},
  { name: "Perception", color: "from-fuchsia-500 to-pink-600", books: [
      { title: "Sensation and Perception", author: "Jeremy M. Wolfe", amazon: "https://www.amazon.com/s?k=Sensation+and+Perception+Wolfe" },
      { title: "The Man Who Mistook His Wife for a Hat", author: "Oliver Sacks", amazon: "https://www.amazon.com/s?k=The+Man+Who+Mistook+His+Wife+for+a+Hat" },
      { title: "An Anthropologist on Mars", author: "Oliver Sacks", amazon: "https://www.amazon.com/s?k=An+Anthropologist+on+Mars+Sacks" },
  ]},
  { name: "Social Behavior", color: "from-rose-500 to-red-600", books: [
      { title: "Influence", author: "Robert B. Cialdini", amazon: "https://www.amazon.com/s?k=Influence+Robert+Cialdini" },
      { title: "Social Intelligence", author: "Daniel Goleman", amazon: "https://www.amazon.com/s?k=Social+Intelligence+Goleman" },
      { title: "Connected", author: "Nicholas A. Christakis & James H. Fowler", amazon: "https://www.amazon.com/s?k=Connected+Christakis+Fowler" },
  ]},
  { name: "Values & Beliefs", color: "from-emerald-500 to-green-600", books: [
      { title: "The Righteous Mind", author: "Jonathan Haidt", amazon: "https://www.amazon.com/s?k=The+Righteous+Mind+Haidt" },
      { title: "Moral Tribes", author: "Joshua Greene", amazon: "https://www.amazon.com/s?k=Moral+Tribes+Joshua+Greene" },
      { title: "Man's Search for Meaning", author: "Viktor E. Frankl", amazon: "https://www.amazon.com/s?k=Man%27s+Search+for+Meaning+Frankl" },
  ]},
  { name: "Habits & Lifestyle", color: "from-teal-500 to-cyan-600", books: [
      { title: "Atomic Habits", author: "James Clear", amazon: "https://www.amazon.com/s?k=Atomic+Habits+James+Clear" },
      { title: "The Power of Habit", author: "Charles Duhigg", amazon: "https://www.amazon.com/s?k=The+Power+of+Habit+Charles+Duhigg" },
      { title: "Tiny Habits", author: "BJ Fogg", amazon: "https://www.amazon.com/s?k=Tiny+Habits+BJ+Fogg" },
  ]},
  { name: "Decision-Making", color: "from-indigo-500 to-blue-600", books: [
      { title: "Nudge", author: "Richard H. Thaler & Cass R. Sunstein", amazon: "https://www.amazon.com/s?k=Nudge+Thaler+Sunstein" },
      { title: "Predictably Irrational", author: "Dan Ariely", amazon: "https://www.amazon.com/s?k=Predictably+Irrational+Dan+Ariely" },
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", amazon: "https://www.amazon.com/s?k=Thinking+Fast+and+Slow+Kahneman" },
  ]},
  { name: "Coping & Resilience", color: "from-yellow-500 to-amber-600", books: [
      { title: "Option B", author: "Sheryl Sandberg & Adam Grant", amazon: "https://www.amazon.com/s?k=Option+B+Sandberg+Grant" },
      { title: "The Upside of Stress", author: "Kelly McGonigal", amazon: "https://www.amazon.com/s?k=The+Upside+of+Stress+McGonigal" },
      { title: "Resilience", author: "Steven M. Southwick & Dennis S. Charney", amazon: "https://www.amazon.com/s?k=Resilience+Southwick+Charney" },
  ]},
  { name: "Self-Concept & Identity", color: "from-purple-500 to-fuchsia-600", books: [
      { title: "Self-Compassion", author: "Kristin Neff", amazon: "https://www.amazon.com/s?k=Self-Compassion+Kristin+Neff" },
      { title: "The Ego Trick", author: "Julian Baggini", amazon: "https://www.amazon.com/s?k=The+Ego+Trick+Julian+Baggini" },
      { title: "The Self Illusion", author: "Bruce Hood", amazon: "https://www.amazon.com/s?k=The+Self+Illusion+Bruce+Hood" },
  ]},
  { name: "Learning & Adaptability", color: "from-cyan-500 to-teal-600", books: [
      { title: "Make It Stick", author: "Peter C. Brown et al.", amazon: "https://www.amazon.com/s?k=Make+It+Stick+Peter+Brown" },
      { title: "Peak", author: "Anders Ericsson", amazon: "https://www.amazon.com/s?k=Peak+Anders+Ericsson" },
      { title: "Ultralearning", author: "Scott Young", amazon: "https://www.amazon.com/s?k=Ultralearning+Scott+Young" },
  ]},
  { name: "Psychopathology", color: "from-red-500 to-rose-600", books: [
      { title: "The Body Keeps the Score", author: "Bessel van der Kolk", amazon: "https://www.amazon.com/s?k=The+Body+Keeps+the+Score" },
      { title: "An Unquiet Mind", author: "Kay Redfield Jamison", amazon: "https://www.amazon.com/s?k=An+Unquiet+Mind+Kay+Redfield+Jamison" },
      { title: "Lost Connections", author: "Johann Hari", amazon: "https://www.amazon.com/s?k=Lost+Connections+Johann+Hari" },
  ]},
];

 

export default function BooksPage() {
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    // hydrate from cache
    try {
      const cached = typeof window !== 'undefined' ? localStorage.getItem('bookCovers') : null;
      if (cached) setCovers(JSON.parse(cached));
    } catch {}
  }, []);

  useEffect(() => {
    // persist cache
    try {
      if (typeof window !== 'undefined') localStorage.setItem('bookCovers', JSON.stringify(covers));
    } catch {}
  }, [covers]);

  useEffect(() => {
    let cancelled = false;
    const fetchCovers = async () => {
      try {
        const localFound = new Set<string>();
        const fetchGoogleCover = async (title: string, author: string): Promise<string | null> => {
          try {
            const q = new URLSearchParams({ q: `intitle:${title} inauthor:${author}`, maxResults: '1', printType: 'books' });
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?${q.toString()}`);
            const data = await res.json();
            const info = data?.items?.[0]?.volumeInfo;
            const links = info?.imageLinks || {};
            const url = links.extraLarge || links.large || links.medium || links.small || links.thumbnail || links.smallThumbnail || '';
            return url ? url.replace('http://', 'https://') : null;
          } catch { return null; }
        };

        const tasks: Array<Promise<void>> = [];
        for (const cat of library) {
          for (const b of cat.books) {
            const key = `${b.title}__${b.author}`;
            if (covers[key]) continue;
            tasks.push((async () => {
              try {
                // Try Google Books first
                let url = await fetchGoogleCover(b.title, b.author);
                // Fallback to Open Library
                if (!url) {
                  const q = new URLSearchParams({ title: b.title, author: b.author, limit: '1' });
                  const res = await fetch(`https://openlibrary.org/search.json?${q.toString()}`);
                  const data = await res.json();
                  const doc = data?.docs?.[0];
                  if (doc?.isbn?.length) {
                    url = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
                  } else if (doc?.cover_i) {
                    url = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
                  }
                }
                if (url && !cancelled) {
                  setCovers(prev => ({ ...prev, [key]: url }));
                  localFound.add(key);
                }
              } catch {}
            })());
          }
        }
        await Promise.all(tasks);
        // Log missing covers for manual follow-up
        const missing: string[] = [];
        for (const cat of library) {
          for (const b of cat.books) {
            const key = `${b.title}__${b.author}`;
            if (!localFound.has(key) && !covers[key]) missing.push(`${b.title} — ${b.author}`);
          }
        }
        if (missing.length && !cancelled) {
          // eslint-disable-next-line no-console
          console.warn("Books without covers:", missing);
        }
      } catch {}
    };
    fetchCovers();
    return () => { cancelled = true; };
  }, [refreshToken]);
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold">Psychology Books Library</h1>
          <p className="text-slate-300 mt-2">Browse and curate essential reads across psychology</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => { try { localStorage.removeItem('bookCovers'); } catch {} setCovers({}); setRefreshToken(v => v + 1); }}
              className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700"
            >
              Refresh Covers
            </button>
          </div>
        </header>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {library.map((cat) => (
            <section key={cat.name} className="group relative overflow-hidden rounded-3xl border bg-[var(--surface)] border-[var(--border)] hover:border-teal-500/60 transition shadow-[0_10px_30px_rgba(2,6,23,0.06)] hover:shadow-[0_16px_40px_rgba(2,6,23,0.10)]">
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-20 transition`} />
                 <div className="relative p-8">
                <h2 className="text-2xl font-bold mb-2">{cat.name}</h2>
                <p className="text-[var(--muted)] mb-6">Curated best-sellers and classics</p>
                <div className="grid grid-cols-3 gap-3">
                  {cat.books.slice(0,6).map((b, i) => {
                    const key = `${b.title}__${b.author}`;
                    const cover = covers[key] || b.cover || UNSPLASH_PLACEHOLDER;
                    const isMissing = cover === UNSPLASH_PLACEHOLDER || (!covers[key] && !b.cover);
                    return (
                    <a key={b.title} href={b.amazon} target="_blank" rel="noreferrer" className="group/book block transform transition hover:-translate-y-0.5" style={{ transitionDelay: `${i * 20}ms` }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cover} alt={b.title} className={`aspect-[2/3] w-full object-cover rounded-xl border ${isMissing ? 'border-rose-600' : 'border-[var(--border)]'} group-hover:border-teal-500 transition`} />
                      {isMissing && <div className="mt-1 text-[10px] text-rose-400">Cover not found (using placeholder)</div>}
                      <div className="mt-2 text-xs text-[var(--foreground)] line-clamp-2">{b.title}</div>
                      <div className="text-[10px] text-[var(--muted)]/80">{b.author}</div>
                    </a>
                  );})}
                </div>
                <div className="mt-6 flex gap-3">
                  <a href={`https://www.amazon.com/s?k=${encodeURIComponent(cat.name+" psychology")}`} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 preserve-white">Explore on Amazon</a>
                  <button className="px-4 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]">Wishlist</button>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}


