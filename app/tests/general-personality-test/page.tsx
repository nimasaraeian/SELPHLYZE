"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import StartConfirm from "@/components/StartConfirm";
import { useLanguage } from "@/providers/LanguageProvider";

type DescriptiveOption = {
  text: string;
  tags: string; // Hidden tag bundle per requirement
};

type ScenarioItem = {
  id: number; // Q number
  prompt: string;
  options: DescriptiveOption[]; // exactly 7
};

type ScenarioLikertItem = ScenarioItem & {
  likertPrompt: string;
};

type LikertOnlyItem = {
  id: number;
  prompt: string;
};

type OpenEndedItem = {
  id: number;
  prompt: string;
};

type ResponseState = {
  // For scenario items
  descriptiveChoice?: number; // index 0..6
  notes?: string;
  // Likert (1..7) when present
  likert?: number;
  // Open-ended
  openText?: string;
};

const SCENARIO_Q6_15: ScenarioItem[] = [
  {
    id: 6,
    prompt: "Q6 – Public Speaking Opportunity\nYour manager asks you to give a presentation to a large audience next week.",
    options: [
      { text: "Accept enthusiastically and start preparing right away.", tags: "High Extraversion – ENFJ – Type 3" },
      { text: "Accept, but plan carefully to avoid mistakes.", tags: "High Conscientiousness – ISTJ – Type 1" },
      { text: "Decline, preferring to work behind the scenes.", tags: "Low Extraversion – INTP – Type 5" },
      { text: "Accept if the topic excites you creatively.", tags: "High Openness – ENFP – Type 7" },
      { text: "Agree only if you can present with a co-speaker.", tags: "Moderate Agreeableness – ISFJ – Type 9" },
      { text: "Use it as a chance to impress and boost your status.", tags: "High Achievement Focus – ENTJ – Type 8" },
      { text: "Suggest someone else who might be better suited.", tags: "Moderate Prudence – INFJ – Type 2" },
    ],
  },
  {
    id: 7,
    prompt: "Q7 – Receiving Criticism\nYour supervisor gives you unexpected negative feedback on your work.",
    options: [
      { text: "Listen carefully and thank them for their honesty.", tags: "High Agreeableness – ISFJ – Type 2" },
      { text: "Ask for specific examples to understand the issue.", tags: "High Conscientiousness – INTJ – Type 5" },
      { text: "Feel defensive but try to hide it.", tags: "High Neuroticism – INFP – Type 4" },
      { text: "Immediately start improving the weak areas.", tags: "High Achievement Orientation – ESTJ – Type 1" },
      { text: "Dismiss the feedback if you think it’s unfair.", tags: "Low Agreeableness – ESTP – Type 8" },
      { text: "Reflect quietly and decide later whether to act.", tags: "Moderate Introversion – INFJ – Type 9" },
      { text: "Use it as motivation to prove them wrong.", tags: "High Competitiveness – ENTJ – Type 3" },
    ],
  },
  {
    id: 8,
    prompt: "Q8 – Unplanned Free Day\nYour planned activities for the day get cancelled.",
    options: [
      { text: "Use the time for a personal project or hobby.", tags: "High Openness – INTP – Type 5" },
      { text: "Catch up on chores or overdue tasks.", tags: "High Conscientiousness – ISTJ – Type 1" },
      { text: "Call friends and arrange a spontaneous outing.", tags: "High Extraversion – ESFP – Type 7" },
      { text: "Spend the day relaxing and doing nothing.", tags: "High Emotional Regulation – ISFP – Type 9" },
      { text: "Learn something new online.", tags: "High Curiosity – ENTP – Type 7" },
      { text: "Go for physical activity or sports.", tags: "High Energy – ESTP – Type 8" },
      { text: "Volunteer or help someone in need.", tags: "High Altruism – ENFJ – Type 2" },
    ],
  },
  {
    id: 9,
    prompt: "Q9 – Disagreement in a Meeting\nDuring a meeting, you strongly disagree with a proposed plan.",
    options: [
      { text: "Voice your opinion clearly and argue your case.", tags: "High Assertiveness – ENTJ – Type 8" },
      { text: "Suggest an alternative approach.", tags: "High Problem-Solving – ENTP – Type 7" },
      { text: "Ask questions to challenge the idea indirectly.", tags: "Moderate Openness – INFJ – Type 5" },
      { text: "Stay silent to avoid conflict.", tags: "Low Extraversion – ISFP – Type 9" },
      { text: "Support the idea to keep harmony, even if you disagree.", tags: "High Agreeableness – ISFJ – Type 2" },
      { text: "Ask for more time to think before deciding.", tags: "High Prudence – INTJ – Type 5" },
      { text: "Try to find a middle ground solution.", tags: "High Cooperation – ENFJ – Type 9" },
    ],
  },
  {
    id: 10,
    prompt: "Q10 – Helping a Stranger\nYou see someone struggling to carry heavy bags.",
    options: [
      { text: "Offer help immediately without hesitation.", tags: "High Agreeableness – ENFJ – Type 2" },
      { text: "Offer help only if they seem very tired.", tags: "Moderate Agreeableness – ISFJ – Type 9" },
      { text: "Wait to see if someone else helps.", tags: "Low Initiative – INTP – Type 5" },
      { text: "Offer help but make a light joke to ease the situation.", tags: "High Openness – ENTP – Type 7" },
      { text: "Ignore and continue with your own tasks.", tags: "Low Agreeableness – ESTP – Type 8" },
      { text: "Offer help and also suggest better carrying methods.", tags: "High Conscientiousness – ISTJ – Type 1" },
      { text: "Help only if it doesn’t delay your schedule.", tags: "Moderate Prudence – ENTJ – Type 3" },
    ],
  },
  {
    id: 11,
    prompt: "Q11 – Tight Budget\nYou’re on a very limited budget this month.",
    options: [
      { text: "Strictly cut unnecessary expenses.", tags: "High Conscientiousness – ISTJ – Type 1" },
      { text: "Look for creative low-cost activities.", tags: "High Openness – ENTP – Type 7" },
      { text: "Borrow money from a trusted friend.", tags: "Moderate Agreeableness – ISFJ – Type 9" },
      { text: "Take on a quick side job to earn extra.", tags: "High Achievement Focus – ENTJ – Type 3" },
      { text: "Ask family for temporary support.", tags: "High Emotionality – INFJ – Type 4" },
      { text: "Sell unused items for extra cash.", tags: "High Resourcefulness – ESTP – Type 8" },
      { text: "Maintain lifestyle and hope things work out.", tags: "Low Conscientiousness – ESFP – Type 7" },
    ],
  },
  {
    id: 12,
    prompt: "Q12 – Leading a New Project\nYou’re offered to lead a high-visibility project.",
    options: [
      { text: "Accept immediately with excitement.", tags: "High Extraversion – ENFJ – Type 3" },
      { text: "Accept after carefully planning responsibilities.", tags: "High Conscientiousness – ISTJ – Type 1" },
      { text: "Decline to avoid stress.", tags: "High Neuroticism – INFP – Type 4" },
      { text: "Accept if you can innovate freely.", tags: "High Openness – ENTP – Type 7" },
      { text: "Share leadership with another person.", tags: "High Cooperation – ISFJ – Type 9" },
      { text: "Accept only if it boosts career opportunities.", tags: "High Strategic Focus – ENTJ – Type 8" },
      { text: "Decline and recommend a more experienced colleague.", tags: "Moderate Prudence – INFJ – Type 2" },
    ],
  },
  {
    id: 13,
    prompt: "Q13 – Handling a Mistake\nYou make a mistake at work.",
    options: [
      { text: "Admit it immediately to your boss.", tags: "High Honesty-Humility – ISTJ – Type 1" },
      { text: "Try to fix it quietly before anyone notices.", tags: "High Conscientiousness – INTJ – Type 5" },
      { text: "Downplay the mistake if it’s minor.", tags: "Low Agreeableness – ESTP – Type 8" },
      { text: "Apologize and explain the circumstances.", tags: "High Agreeableness – ISFJ – Type 2" },
      { text: "Learn from it and make a process change.", tags: "High Openness – ENTP – Type 7" },
      { text: "Ask for advice from a colleague.", tags: "High Cooperation – ENFJ – Type 9" },
      { text: "Delay telling anyone until you have a solution.", tags: "Moderate Prudence – INFP – Type 4" },
    ],
  },
  {
    id: 14,
    prompt: "Q14 – Unexpected Praise\nYour boss publicly praises you for your work.",
    options: [
      { text: "Thank them and share credit with the team.", tags: "High Agreeableness – ENFJ – Type 2" },
      { text: "Accept graciously and feel proud.", tags: "High Extraversion – ESFP – Type 3" },
      { text: "Feel uncomfortable with public attention.", tags: "High Introversion – INFJ – Type 4" },
      { text: "Use the moment to ask for new opportunities.", tags: "High Strategic Thinking – ENTJ – Type 8" },
      { text: "Downplay it as part of the job.", tags: "Moderate Humility – ISTJ – Type 1" },
      { text: "Redirect praise to someone else.", tags: "High Altruism – ISFJ – Type 9" },
      { text: "Enjoy it but stay silent.", tags: "Moderate Emotionality – INFP – Type 4" },
    ],
  },
  {
    id: 15,
    prompt: "Q15 – Group Decision\nYour group needs to choose a restaurant for dinner.",
    options: [
      { text: "Suggest your favorite without hesitation.", tags: "High Assertiveness – ESTP – Type 8" },
      { text: "Ask for everyone’s preferences first.", tags: "High Agreeableness – ENFJ – Type 9" },
      { text: "Let others decide; you’re fine with anything.", tags: "Low Conscientiousness – ISFP – Type 9" },
      { text: "Suggest something new and adventurous.", tags: "High Openness – ENTP – Type 7" },
      { text: "Pick the most convenient option.", tags: "High Practicality – ISTJ – Type 1" },
      { text: "Offer two or three options to vote on.", tags: "High Cooperation – ENFJ – Type 2" },
      { text: "Choose based on dietary needs of the group.", tags: "High Empathy – INFJ – Type 4" },
    ],
  },
];

const SCENARIO_LIKERT_Q16_25: ScenarioLikertItem[] = [
  {
    id: 16,
    prompt: "Q16 – Missed Opportunity\nA friend tells you about a great job opportunity that you just missed.",
    options: [
      { text: "Feel deeply regretful and dwell on it.", tags: "High Neuroticism – INFP – Type 4" },
      { text: "Accept it calmly and move on.", tags: "High Emotional Regulation – ISFJ – Type 9" },
      { text: "Analyze why you missed it and adjust for next time.", tags: "High Conscientiousness – INTJ – Type 5" },
      { text: "Joke about it to lighten the mood.", tags: "High Openness – ENTP – Type 7" },
      { text: "Immediately search for similar opportunities.", tags: "High Achievement Focus – ENTJ – Type 3" },
      { text: "", tags: "" },
      { text: "", tags: "" },
    ],
    likertPrompt:
      "How strongly do you agree that missing opportunities motivates you to act faster in the future? (1–7)",
  },
  {
    id: 17,
    prompt: "Q17 – Unfair Rule at Work\nYour workplace introduces a new policy you feel is unfair.",
    options: [
      { text: "Follow the rule but express discontent privately.", tags: "Moderate Agreeableness – ISFJ – Type 9" },
      { text: "Challenge the rule directly with management.", tags: "High Assertiveness – ENTJ – Type 8" },
      { text: "Look for ways to work around it.", tags: "Low Conscientiousness – ESTP – Type 7" },
      { text: "Leave the job if it affects you too much.", tags: "High Decisiveness – ENTP – Type 7" },
      { text: "Adapt without complaint.", tags: "High Compliance – ISTJ – Type 1" },
      { text: "", tags: "" },
      { text: "", tags: "" },
    ],
    likertPrompt:
      "How strongly do you agree that confronting authority is necessary when rules are unjust? (1–7)",
  },
  {
    id: 18,
    prompt: "Q18 – Helping a Colleague Under Pressure\nA colleague is visibly stressed about a deadline.",
    options: [
      { text: "Offer to share their workload.", tags: "High Agreeableness – ENFJ – Type 2" },
      { text: "Give them advice on time management.", tags: "High Conscientiousness – ISTJ – Type 1" },
      { text: "Offer emotional support without taking on tasks.", tags: "High Emotionality – INFJ – Type 4" },
      { text: "Stay out of it to focus on your own work.", tags: "Low Agreeableness – INTP – Type 5" },
      { text: "Suggest delegating their tasks to others.", tags: "High Practicality – ESTJ – Type 3" },
      { text: "", tags: "" },
      { text: "", tags: "" },
    ],
    likertPrompt:
      "How strongly do you agree that helping others at work should be prioritized over your own tasks? (1–7)",
  },
  {
    id: 19,
    prompt: "Q19 – Sudden Change in Travel Plans\nYour flight is delayed by 6 hours.",
    options: [
      { text: "Use the time to work or study.", tags: "High Conscientiousness – INTJ – Type 5" },
      { text: "Explore the airport or nearby area.", tags: "High Openness – ENFP – Type 7" },
      { text: "Socialize with other passengers.", tags: "High Extraversion – ESFP – Type 3" },
      { text: "Relax and watch movies or read.", tags: "High Emotional Regulation – ISFP – Type 9" },
      { text: "Complain to airline staff for better service.", tags: "High Assertiveness – ESTP – Type 8" },
      { text: "", tags: "" },
      { text: "", tags: "" },
    ],
    likertPrompt:
      "How strongly do you agree that adapting quickly to unexpected changes is one of your strengths? (1–7)",
  },
  {
    id: 20,
    prompt: "Q20 – Being Assigned an Unfamiliar Task\nYour boss asks you to handle a task you’ve never done before.",
    options: [
      { text: "Accept eagerly as a learning opportunity.", tags: "High Openness – ENTP – Type 7" },
      { text: "Accept but request training first.", tags: "High Conscientiousness – ISTJ – Type 1" },
      { text: "Hesitate but agree to try.", tags: "Moderate Emotionality – INFP – Type 4" },
      { text: "Decline, explaining it’s outside your expertise.", tags: "Low Openness – ISFJ – Type 9" },
      { text: "Delegate it to someone more experienced.", tags: "High Strategic Thinking – ENTJ – Type 8" },
      { text: "", tags: "" },
      { text: "", tags: "" },
    ],
    likertPrompt:
      "How strongly do you agree that stepping into unknown situations helps you grow? (1–7)",
  },
  {
    id: 21,
    prompt: "Q21 – Social Media Disagreement\nYou see a close friend post something you strongly disagree with.",
    options: [
      { text: "Comment publicly to express your view.", tags: "High Assertiveness – ESTP – Type 8" },
      { text: "Message them privately to discuss.", tags: "High Agreeableness – ENFJ – Type 9" },
      { text: "Ignore it; everyone is entitled to their opinion.", tags: "Low Conscientiousness – ISFP – Type 9" },
      { text: "Post a general status expressing your stance.", tags: "Moderate Openness – ENTP – Type 7" },
      { text: "Unfollow or mute them.", tags: "Moderate Emotionality – INFJ – Type 4" },
      { text: "", tags: "" },
      { text: "", tags: "" },
    ],
    likertPrompt:
      "How strongly do you agree that public debates are important for truth to emerge? (1–7)",
  },
  {
    id: 22,
    prompt: "Q22 – Group Task with Unequal Effort\nIn a group project, one member is not contributing.",
    options: [
      { text: "Address them directly and request more effort.", tags: "High Assertiveness – ENTJ – Type 8" },
      { text: "Take on their tasks to ensure success.", tags: "High Agreeableness – ENFJ – Type 2" },
      { text: "Report the issue to the leader.", tags: "High Conscientiousness – ISTJ – Type 1" },
      { text: "Ignore it and focus on your own part.", tags: "Low Agreeableness – INTP – Type 5" },
      { text: "Try to motivate them with encouragement.", tags: "High Empathy – INFJ – Type 4" },
      { text: "", tags: "" },
      { text: "", tags: "" },
    ],
    likertPrompt:
      "How strongly do you agree that teamwork requires equal effort from all members? (1–7)",
  },
  {
    id: 23,
    prompt: "Q23 – Learning Something New\nYou’re offered a free course in a skill unrelated to your job.",
    options: [
      { text: "Take it eagerly for personal growth.", tags: "High Openness – ENFP – Type 7" },
      { text: "Take it only if it may help your career later.", tags: "High Strategic Focus – ENTJ – Type 8" },
      { text: "Decline to save time for relevant skills.", tags: "High Practicality – ISTJ – Type 1" },
      { text: "Take it if friends are also joining.", tags: "High Social Orientation – ESFP – Type 3" },
      { text: "Delay deciding until later.", tags: "Moderate Prudence – INFP – Type 4" },
      { text: "", tags: "" },
      { text: "", tags: "" },
    ],
    likertPrompt:
      "How strongly do you agree that exploring unrelated skills is valuable? (1–7)",
  },
  {
    id: 24,
    prompt: "Q24 – Handling an Overconfident Colleague\nA colleague often overestimates their abilities.",
    options: [
      { text: "Let them handle tasks and learn from mistakes.", tags: "Low Agreeableness – ESTP – Type 8" },
      { text: "Offer constructive feedback privately.", tags: "High Agreeableness – ENFJ – Type 2" },
      { text: "Take over important tasks to avoid risk.", tags: "High Conscientiousness – ISTJ – Type 1" },
      { text: "Publicly correct their overconfidence.", tags: "High Assertiveness – ENTJ – Type 8" },
      { text: "Avoid working directly with them.", tags: "Moderate Emotionality – INFJ – Type 4" },
      { text: "", tags: "" },
      { text: "", tags: "" },
    ],
    likertPrompt:
      "How strongly do you agree that direct confrontation is the best way to correct overconfidence? (1–7)",
  },
  {
    id: 25,
    prompt: "Q25 – Facing an Impossible Deadline\nYou’re given a deadline that seems impossible.",
    options: [
      { text: "Work extra hours to meet it.", tags: "High Conscientiousness – ISTJ – Type 1" },
      { text: "Negotiate for more time.", tags: "High Assertiveness – ENTJ – Type 8" },
      { text: "Prioritize essential tasks and cut less important ones.", tags: "High Strategic Thinking – INTJ – Type 5" },
      { text: "Seek help from colleagues.", tags: "High Agreeableness – ENFJ – Type 2" },
      { text: "Accept it and deliver what you can.", tags: "Moderate Emotional Regulation – ISFP – Type 9" },
      { text: "", tags: "" },
      { text: "", tags: "" },
    ],
    likertPrompt:
      "How strongly do you agree that pushing yourself beyond limits is worth it to meet goals? (1–7)",
  },
];

const LIKERT_Q26_30: LikertOnlyItem[] = [
  { id: 26, prompt: "I enjoy taking the lead in group situations." },
  { id: 27, prompt: "I prefer sticking to proven methods rather than experimenting." },
  { id: 28, prompt: "I find it easy to understand other people’s emotions." },
  { id: 29, prompt: "I stay calm and focused under pressure." },
  { id: 30, prompt: "I enjoy exploring completely new and unfamiliar experiences." },
];

const OPEN_Q31_35: OpenEndedItem[] = [
  { id: 31, prompt: "Describe a recent situation where you had to adapt to a major change. What did you do?" },
  { id: 32, prompt: "What motivates you the most when working on a challenging task?" },
  { id: 33, prompt: "How do you usually handle disagreements with close friends or family?" },
  { id: 34, prompt: "Describe your ideal work environment in as much detail as possible." },
  { id: 35, prompt: "What is one personal weakness you are actively trying to improve, and how?" },
];

export default function GeneralPersonalityTestPage() {
  const { language } = useLanguage();
  const [confirmOpen, setConfirmOpen] = useState(true);

  // Responses keyed by question id
  const [responses, setResponses] = useState<Record<number, ResponseState>>({});

  const setChoice = (qid: number, idx: number) => {
    setResponses((prev) => ({ ...prev, [qid]: { ...prev[qid], descriptiveChoice: idx } }));
  };
  const setNotes = (qid: number, value: string) => {
    setResponses((prev) => ({ ...prev, [qid]: { ...prev[qid], notes: value } }));
  };
  const setLikert = (qid: number, val: number) => {
    setResponses((prev) => ({ ...prev, [qid]: { ...prev[qid], likert: val } }));
  };
  const setOpenText = (qid: number, value: string) => {
    setResponses((prev) => ({ ...prev, [qid]: { ...prev[qid], openText: value } }));
  };

  const handleSubmit = () => {
    try {
      localStorage.setItem("selphlyze_general_personality_v1", JSON.stringify(responses));
      alert("Responses saved. Analysis coming soon.");
    } catch {}
  };

  const LikertScale = ({ qid }: { qid: number }) => (
    <div className="flex flex-wrap gap-2 mt-3">
      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
        <button
          key={n}
          onClick={() => setLikert(qid, n)}
          className={`px-3 py-1.5 rounded-lg text-sm border transition ${
            responses[qid]?.likert === n
              ? "bg-teal-600 text-white border-teal-500"
              : "bg-slate-800/60 text-gray-200 border-slate-600 hover:bg-slate-700"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white py-20 px-6">
      {/* Start Confirm */}
      <StartConfirm
        open={confirmOpen}
        language={language}
        onConfirm={() => setConfirmOpen(false)}
        onCancel={() => history.back()}
      />

      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Selphlyze Personality Test – 35 Items
        </h1>

        {/* Q6–Q15 Scenario */}
        {SCENARIO_Q6_15.map((q, qi) => (
          <motion.section
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="font-bold text-lg mb-4">{q.prompt}</h2>
            <div className="grid gap-3">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setChoice(q.id, idx)}
                  className={`text-left p-3 rounded-xl transition border ${
                    responses[q.id]?.descriptiveChoice === idx
                      ? "bg-teal-600 text-white border-teal-500"
                      : "bg-slate-800/60 text-gray-200 border-slate-600 hover:bg-slate-700"
                  }`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
            {/* Notes under every item */}
            <div className="mt-4">
              <label className="block text-sm text-gray-300 mb-1">Notes (optional)</label>
              <textarea
                value={responses[q.id]?.notes || ""}
                onChange={(e) => setNotes(q.id, e.target.value)}
                className="w-full h-20 p-3 rounded-xl bg-slate-800 border border-slate-600 text-white"
                placeholder="Add any thoughts or context..."
              />
            </div>
          </motion.section>
        ))}

        {/* Q16–Q25 Scenario + Likert */}
        {SCENARIO_LIKERT_Q16_25.map((q) => (
          <motion.section
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="font-bold text-lg mb-4">{q.prompt}</h2>
            <div className="grid gap-3">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setChoice(q.id, idx)}
                  className={`text-left p-3 rounded-xl transition border ${
                    responses[q.id]?.descriptiveChoice === idx
                      ? "bg-teal-600 text-white border-teal-500"
                      : "bg-slate-800/60 text-gray-200 border-slate-600 hover:bg-slate-700"
                  } ${opt.text ? "" : "hidden"}`}
                >
                  {opt.text}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-300">{q.likertPrompt}</p>
              <LikertScale qid={q.id} />
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-300 mb-1">Notes (optional)</label>
              <textarea
                value={responses[q.id]?.notes || ""}
                onChange={(e) => setNotes(q.id, e.target.value)}
                className="w-full h-20 p-3 rounded-xl bg-slate-800 border border-slate-600 text-white"
                placeholder="Add any thoughts or context..."
              />
            </div>
          </motion.section>
        ))}

        {/* Q26–Q30 Likert only */}
        {LIKERT_Q26_30.map((q) => (
          <motion.section
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="font-bold text-lg mb-2">Q{q.id} – {q.prompt}</h2>
            <p className="text-sm text-gray-300">Likert (1–Strongly Disagree … 7–Strongly Agree)</p>
            <LikertScale qid={q.id} />
            <div className="mt-4">
              <label className="block text-sm text-gray-300 mb-1">Notes (optional)</label>
              <textarea
                value={responses[q.id]?.notes || ""}
                onChange={(e) => setNotes(q.id, e.target.value)}
                className="w-full h-20 p-3 rounded-xl bg-slate-800 border border-slate-600 text-white"
                placeholder="Add any thoughts or context..."
              />
            </div>
          </motion.section>
        ))}

        {/* Q31–Q35 Open-ended */}
        {OPEN_Q31_35.map((q) => (
          <motion.section
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="font-bold text-lg mb-2">Q{q.id} – {q.prompt}</h2>
            <textarea
              value={responses[q.id]?.openText || ""}
              onChange={(e) => setOpenText(q.id, e.target.value)}
              className="w-full min-h-28 p-3 rounded-xl bg-slate-800 border border-slate-600 text-white"
              placeholder="Write your answer (min 10 characters)."
            />
            <div className="mt-4">
              <label className="block text-sm text-gray-300 mb-1">Notes (optional)</label>
              <textarea
                value={responses[q.id]?.notes || ""}
                onChange={(e) => setNotes(q.id, e.target.value)}
                className="w-full h-20 p-3 rounded-xl bg-slate-800 border border-slate-600 text-white"
                placeholder="Add any thoughts or context..."
              />
            </div>
          </motion.section>
        ))}

        <div className="sticky bottom-6 flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl hover:from-teal-400 hover:to-blue-400 transition"
          >
            Submit Responses
          </button>
        </div>
      </div>
    </main>
  );
}


