"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/providers/LanguageProvider";

type MinimalProfile = {
  fullName: string;
  ageRange: string;
  gender: string;
};

function readLocalProfile(): MinimalProfile | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("localProfileV1");
    if (!raw) return null;
    const p = JSON.parse(raw);
    return {
      fullName: p.fullName || "",
      ageRange: p.ageRange || "",
      gender: p.gender || "",
    };
  } catch {
    return null;
  }
}

export default function ProfileGate() {
  const { language } = useLanguage();
  const [open, setOpen] = useState<boolean>(false);
  const [fullName, setFullName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = readLocalProfile();
    if (!existing || !existing.fullName || !existing.ageRange || !existing.gender) {
      setOpen(true);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      en: {
        title: "Tell us about you",
        name: "Full name",
        age: "Age range",
        gender: "Gender",
        select: "Select",
        male: "Male",
        female: "Female",
        other: "Other",
        save: "Continue",
      },
      fa: {
        title: "درباره خودت بگو",
        name: "نام و نام خانوادگی",
        age: "بازه سنی",
        gender: "جنسیت",
        select: "انتخاب کنید",
        male: "مذکر",
        female: "مونث",
        other: "سایر / مایل نیستم",
        save: "ادامه",
      },
      tr: { title: "Kendinizden bahsedin", name: "Ad Soyad", age: "Yaş aralığı", gender: "Cinsiyet", select: "Seçiniz", male: "Erkek", female: "Kadın", other: "Diğer", save: "Devam" },
      es: { title: "Cuéntanos sobre ti", name: "Nombre completo", age: "Rango de edad", gender: "Género", select: "Seleccionar", male: "Hombre", female: "Mujer", other: "Otro", save: "Continuar" },
      fr: { title: "Parlez-nous de vous", name: "Nom complet", age: "Tranche d'âge", gender: "Sexe", select: "Sélectionner", male: "Homme", female: "Femme", other: "Autre", save: "Continuer" },
    };
    const L = dict[language] || dict.en;
    return L[key];
  };

  const save = () => {
    try {
      if (typeof window === "undefined") return;
      const localProfile = {
        fullName,
        ageRange,
        gender,
      };
      localStorage.setItem("localProfileV1", JSON.stringify(localProfile));

      // Keep aiUserProfile in sync for analysis context
      const aiProfile = {
        displayName: fullName,
        ageRange,
        gender,
        language,
      };
      localStorage.setItem("aiUserProfile", JSON.stringify(aiProfile));

      setOpen(false);
    } catch {}
  };

  if (!open) return null;

  const canSave = Boolean(fullName && ageRange && gender);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-6 text-white">
            <h3 className="text-xl font-bold">{t("title")}</h3>
          </div>
          <div className="p-6 space-y-4 text-gray-800">
            <div>
              <label className="block text-sm font-medium mb-1">{t("name")}</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("age")}</label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">{t("select")}</option>
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
                <label className="block text-sm font-medium mb-1">{t("gender")}</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">{t("select")}</option>
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                  <option value="other">{t("other")}</option>
                </select>
              </div>
            </div>
            <button
              disabled={!canSave}
              onClick={save}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                canSave ? "bg-teal-600 text-white hover:bg-teal-700 shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {t("save")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}



