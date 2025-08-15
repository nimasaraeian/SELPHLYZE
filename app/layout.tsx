// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingAIChat from "@/components/FloatingAIChat";
import StructuredData from "@/components/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL("https://selphlyze.com"),
  title: {
    default: "Selphlyze - AI-Powered Psychology & Self-Analysis Platform",
    template: "%s | Selphlyze"
  },
  description: "Discover your psychological patterns with AI-powered analysis. Take personality tests, explore emotional intelligence, and unlock insights about yourself with Selphlyze's advanced psychometric tools.",
  keywords: ["psychology", "AI analysis", "personality test", "emotional intelligence", "self-analysis", "psychometric", "behavioral patterns", "cognitive assessment"],
  authors: [{ name: "Nima Saraeian" }],
  creator: "Nima Saraeian",
  publisher: "Selphlyze",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fa_IR', 'es_ES'],
    url: 'https://selphlyze.com',
    title: 'Selphlyze - AI-Powered Psychology & Self-Analysis',
    description: 'Discover your psychological patterns with AI-powered analysis. Take personality tests and unlock insights about yourself.',
    siteName: 'Selphlyze',
    images: [
      {
        url: '/image/SELPHLYZE_LOGO.png',
        width: 1200,
        height: 630,
        alt: 'Selphlyze - AI Psychology Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Selphlyze - AI-Powered Psychology Platform',
    description: 'Discover your psychological patterns with AI-powered analysis',
    images: ['/image/SELPHLYZE_LOGO.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  category: 'psychology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${serif.variable}`}>
      <head>
        <StructuredData />
        <GoogleAnalytics GA_TRACKING_ID={process.env.NEXT_PUBLIC_GA_ID} />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <LanguageProvider>
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 pt-16">{children}</main>

            {/* Footer */}
            <Footer />

            {/* Global AI Chat Assistant */}
            <FloatingAIChat />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
