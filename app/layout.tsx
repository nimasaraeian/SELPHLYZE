// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingAIChat from "@/components/FloatingAIChat";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });
const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nimasaraeian.com"),
  title: "Nima Saraeian | AI & Psychology",
  description:
    "Official website of Nima Saraeian, AI-driven psychological researcher and founder of Selphlyze.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${serif.variable}`}>
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
