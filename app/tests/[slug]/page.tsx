"use client";

import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";

export default function TestFallbackPage({ params }: { params: { slug: string } }) {
  const { language } = useLanguage();
  // Gate: ensure name/age/gender exist before proceeding with any test
  const ProfileGate = require("@/components/ProfileGate").default;

  const t = {
    en: {
      title: "Test coming soon",
      body: "This test page is not available yet. We are preparing high‑quality questions and analysis.",
      back: "Back to Tests",
    },
    fa: {
      title: "این تست به‌زودی آماده می‌شود",
      body: "این صفحه فعلاً در دسترس نیست. در حال آماده‌سازی سوالات و تحلیل‌های باکیفیت هستیم.",
      back: "بازگشت به تست‌ها",
    },
    tr: {
      title: "Test yakında geliyor",
      body: "Bu test sayfası henüz hazır değil. Yüksek kaliteli sorular ve analizler hazırlıyoruz.",
      back: "Testlere Dön",
    },
    es: {
      title: "Prueba disponible pronto",
      body: "Esta página de prueba aún no está disponible. Estamos preparando preguntas y análisis de alta calidad.",
      back: "Volver a Pruebas",
    },
    fr: {
      title: "Test bientôt disponible",
      body: "Cette page de test n'est pas encore disponible. Nous préparons des questions et des analyses de haute qualité.",
      back: "Retour aux Tests",
    },
  } as const;

  const L = (t as any)[language] || (t as any).en;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center p-8">
      <ProfileGate />
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          {L.title}
        </h1>
        <p className="text-gray-300 mb-8">{L.body}</p>
        <Link
          href="/tests"
          className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-semibold"
        >
          {L.back}
        </Link>
      </div>
    </main>
  );
}











