// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <html lang="en">
      <body className="bg-black text-white font-sans min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 pt-16">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
