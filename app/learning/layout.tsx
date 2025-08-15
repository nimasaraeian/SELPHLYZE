import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Center | Selphlyze",
  description: "Comprehensive psychology learning resources: expert articles, authoritative books, and educational podcasts in psychology and mental health",
  keywords: ["psychology articles", "psychology books", "psychology podcasts", "learning resources", "mental health"],
};

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
