"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

export default function AuthGate({ onAuthed }: { onAuthed?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && onAuthed) onAuthed();
    });
    return () => sub.subscription.unsubscribe();
  }, [onAuthed]);

  const signUp = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: typeof window !== 'undefined' ? window.location.href : undefined } });
      if (error) throw error;
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900/70 border border-slate-700 p-6 rounded-2xl text-white">
      <h3 className="text-xl font-bold mb-4">Sign in or create an account</h3>

      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button onClick={signIn} disabled={loading} className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700">Sign in</button>
          <button onClick={signUp} disabled={loading} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600">Sign up</button>
        </div>
        <div className="mt-4">
          <button onClick={signInWithGoogle} disabled={loading} className="w-full px-4 py-2 rounded-lg bg-white text-black font-medium hover:opacity-90">Continue with Google</button>
        </div>
      </div>
    </div>
  );
}










