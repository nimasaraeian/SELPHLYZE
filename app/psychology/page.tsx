import ArticleCard from "@/components/ArticleCard";

export const metadata = {
  title: "Psychology | Scientific Articles & Achievements",
  description:
    "Curated scientific articles and achievements across psychology domains: cognitive, clinical, social, developmental, neuropsychology, and more.",
};

const categories: {
  title: string;
  items: { title: string; summary: string; link: string; gradient: [string, string] }[];
}[] = [
  {
    title: "Cognitive Psychology",
    items: [
      {
        title: "Working Memory & Attention",
        summary: "Core mechanisms of information maintenance, attentional control, and executive function.",
        link: "https://scholar.google.com/scholar?q=working+memory+attention+cognitive+psychology",
        gradient: ["#0ea5e9", "#9333ea"],
      },
      {
        title: "Cognitive Biases in Decisions",
        summary: "How heuristics and biases shape risk, choice, and judgment under uncertainty.",
        link: "https://scholar.google.com/scholar?q=cognitive+biases+decision+making+heuristics",
        gradient: ["#06b6d4", "#3b82f6"],
      },
      {
        title: "Emotion–Cognition Interaction",
        summary: "Influences of affect on memory, learning, and problem solving.",
        link: "https://scholar.google.com/scholar?q=emotion+cognition+interaction+psychology",
        gradient: ["#14b8a6", "#84cc16"],
      },
    ],
  },
  {
    title: "Clinical & Health Psychology",
    items: [
      {
        title: "Depression & Anxiety Assessment",
        summary: "Evidence-based diagnostics, scales, and treatment outcome measurement.",
        link: "https://scholar.google.com/scholar?q=depression+anxiety+assessment+clinical+psychology",
        gradient: ["#ef4444", "#f59e0b"],
      },
      {
        title: "CBT & Third-Wave Therapies",
        summary: "Cognitive-behavioral, mindfulness-based, and acceptance-commitment approaches.",
        link: "https://scholar.google.com/scholar?q=CBT+mindfulness+ACT+clinical+psychology",
        gradient: ["#f97316", "#22c55e"],
      },
      {
        title: "Digital Phenotyping",
        summary: "Using smartphones and wearables to infer mental health states in real time.",
        link: "https://scholar.google.com/scholar?q=digital+phenotyping+mental+health",
        gradient: ["#f43f5e", "#8b5cf6"],
      },
    ],
  },
  {
    title: "Social & Personality Psychology",
    items: [
      {
        title: "Personality Traits & Outcomes",
        summary: "Big Five, dark triad, and links to life, health, and work outcomes.",
        link: "https://scholar.google.com/scholar?q=personality+traits+big+five+outcomes",
        gradient: ["#06b6d4", "#10b981"],
      },
      {
        title: "Social Influence & Persuasion",
        summary: "Conformity, obedience, and mechanisms of attitude change.",
        link: "https://scholar.google.com/scholar?q=social+influence+persuasion+attitude+change",
        gradient: ["#3b82f6", "#a855f7"],
      },
      {
        title: "Emotion Regulation in Groups",
        summary: "Interpersonal regulation strategies and collective behavior dynamics.",
        link: "https://scholar.google.com/scholar?q=emotion+regulation+interpersonal+collective+behavior",
        gradient: ["#22c55e", "#0ea5e9"],
      },
    ],
  },
  {
    title: "Developmental Psychology",
    items: [
      {
        title: "Cognitive Development",
        summary: "Trajectories of language, theory of mind, and executive functions.",
        link: "https://scholar.google.com/scholar?q=cognitive+development+executive+functions+language",
        gradient: ["#84cc16", "#22c55e"],
      },
      {
        title: "Attachment & Parenting",
        summary: "Attachment styles, caregiving, and long-term socio-emotional outcomes.",
        link: "https://scholar.google.com/scholar?q=attachment+parenting+developmental+psychology",
        gradient: ["#f59e0b", "#06b6d4"],
      },
      {
        title: "Adolescence & Identity",
        summary: "Risk-taking, identity formation, and peer influences.",
        link: "https://scholar.google.com/scholar?q=adolescence+identity+risk+taking",
        gradient: ["#8b5cf6", "#22d3ee"],
      },
    ],
  },
  {
    title: "Neuropsychology & Cognitive Neuroscience",
    items: [
      {
        title: "Brain Networks & Cognition",
        summary: "Functional connectivity, networks, and cognitive control.",
        link: "https://scholar.google.com/scholar?q=functional+connectivity+cognitive+control+neuroscience",
        gradient: ["#0ea5e9", "#22d3ee"],
      },
      {
        title: "Emotion Circuits",
        summary: "Amygdala, prefrontal cortex, and neurobiological models of emotion.",
        link: "https://scholar.google.com/scholar?q=amygdala+prefrontal+emotion+circuits",
        gradient: ["#ef4444", "#6b7280"],
      },
      {
        title: "Neuropsychological Assessment",
        summary: "Cognitive batteries and lesion-symptom mapping for diagnosis.",
        link: "https://scholar.google.com/scholar?q=neuropsychological+assessment+lesion+symptom+mapping",
        gradient: ["#6b7280", "#a855f7"],
      },
    ],
  },
  {
    title: "Positive & Applied Psychology",
    items: [
      {
        title: "Well-being & Flourishing",
        summary: "Models and interventions to enhance subjective and psychological well-being.",
        link: "https://scholar.google.com/scholar?q=well-being+flourishing+positive+psychology",
        gradient: ["#22c55e", "#84cc16"],
      },
      {
        title: "Behavioral Economics",
        summary: "Nudging, choice architecture, and behavior change mechanisms.",
        link: "https://scholar.google.com/scholar?q=behavioral+economics+nudge+choice+architecture",
        gradient: ["#f59e0b", "#06b6d4"],
      },
      {
        title: "Work & Organizational Psychology",
        summary: "Motivation, leadership, and team dynamics in modern workplaces.",
        link: "https://scholar.google.com/scholar?q=organizational+psychology+motivation+leadership+teams",
        gradient: ["#0ea5e9", "#10b981"],
      },
    ],
  },
  {
    title: "Digital & AI Psychology",
    items: [
      {
        title: "Cyberpsychology",
        summary: "Behavior, identity, and emotion across digital platforms and social media.",
        link: "https://scholar.google.com/scholar?q=cyberpsychology+digital+behavior+identity",
        gradient: ["#6366f1", "#06b6d4"],
      },
      {
        title: "AI for Psychometrics",
        summary: "Machine learning for personality, emotion recognition, and cognitive profiling.",
        link: "https://scholar.google.com/scholar?q=AI+psychometrics+emotion+recognition+personality",
        gradient: ["#10b981", "#3b82f6"],
      },
      {
        title: "Ethics & Responsible AI",
        summary: "Fairness, transparency, and privacy in psychological AI systems.",
        link: "https://scholar.google.com/scholar?q=responsible+AI+ethics+psychology+fairness+privacy",
        gradient: ["#f43f5e", "#22d3ee"],
      },
    ],
  },
];

export default function PsychologyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Psychology Articles & Scientific Achievements
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Explore curated research topics and milestones across core domains of psychology. Click any card to browse
            scholarly articles for deeper study.
          </p>
        </header>

        <div className="space-y-16">
          {categories.map((cat) => (
            <section key={cat.title}>
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-teal-300 text-center">
                {cat.title}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((item) => (
                  <ArticleCard
                    key={item.title}
                    title={item.title}
                    summary={item.summary}
                    link={item.link}
                    gradient={item.gradient}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}