"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { normalizeToAppLanguage, type AppLanguage } from "@/providers/LanguageProvider";

type Props = {
  initial: {
    fullName?: string;
    language?: AppLanguage;
    ageRange?: string;
    gender?: string;
  };
  onSaved?: () => void;
};

export default function ProfileOnboarding({ initial, onSaved }: Props) {
  const [fullName, setFullName] = useState(initial.fullName || "");
  const [language, setLanguage] = useState<AppLanguage>(initial.language || "en");
  const [ageRange, setAgeRange] = useState(initial.ageRange || "");
  const [gender, setGender] = useState(initial.gender || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const user = session.user;
      await supabase.from('profiles').update({
        full_name: fullName,
        languages: [language],
        bio: (ageRange || gender) ? `Age: ${ageRange || '-'} • Gender: ${gender || '-'}` : null,
      }).eq('id', user.id);

      // Cache preferred language locally for app
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('globalLanguage', normalizeToAppLanguage(language)); } catch {}
      }

      onSaved?.();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-white text-xl font-bold mb-4">Complete your profile</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Full name</label>
          <input value={fullName} onChange={(e)=>setFullName(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Language</label>
          <select value={language} onChange={(e)=>setLanguage(e.target.value as AppLanguage)} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none">
            <option value="en">English</option>
            <option value="fa">فارسی</option>
            <option value="tr">Türkçe</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Age range</label>
          <select value={ageRange} onChange={(e)=>setAgeRange(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none">
            <option value="">Select</option>
            <option value="15-20">15 - 20</option>
            <option value="20-25">20 - 25</option>
            <option value="25-30">25 - 30</option>
            <option value="30-35">30 - 35</option>
            <option value="35-40">35 - 40</option>
            <option value="40-45">40 - 45</option>
            <option value="45-50">45 - 50</option>
            <option value="50-60">50 - 60</option>
            <option value="60+">60+</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Gender</label>
          <select value={gender} onChange={(e)=>setGender(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-teal-500 focus:outline-none">
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      <div className="mt-5">
        <button onClick={save} disabled={loading} className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white">Save</button>
      </div>
    </div>
  );
}






























