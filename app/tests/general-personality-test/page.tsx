"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { translateArray } from "@/utils/i18nTest";
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

const SCENARIO_Q1_15: ScenarioItem[] = [
  {
    id: 1,
    prompt:
      "Q1 – Team Crisis\nA key project deadline is tomorrow, but a critical task is incomplete due to a colleague’s mistake. The team is looking at you for a decision.",
    options: [
      { text: "Take immediate control, reassign tasks, and push the team to meet the deadline.", tags: "High Extraversion – ENTJ – Type 3 – HEXACO Diligence" },
      { text: "Pause, analyze root causes, and create a step-by-step recovery plan.", tags: "High Conscientiousness – INTJ – Type 5 – HEXACO Prudence" },
      { text: "Encourage the team emotionally, emphasizing unity and mutual support.", tags: "High Agreeableness – ENFJ – Type 2 – HEXACO Emotionality" },
      { text: "Suggest a creative pivot to turn the mistake into an opportunity.", tags: "High Openness – ENTP – Type 7 – CliftonStrengths Ideation" },
      { text: "Focus only on your part of the project, letting others handle the mistake.", tags: "Low Extraversion – ISTP – Type 9 – HEXACO Low Social Boldness" },
      { text: "Confront the colleague directly to ensure accountability and future caution.", tags: "High Assertiveness – Dark Triad Machiavellianism – Type 8" },
      { text: "Suggest a short break to clear minds before deciding the next step.", tags: "High Emotional Regulation – ISFJ – Type 6 – HEXACO Patience" },
    ],
  },
  {
    id: 2,
    prompt:
      "Q2 – Social Invitation\nA friend invites you to a large networking event with many strangers.",
    options: [
      { text: "Attend enthusiastically, aiming to meet as many people as possible.", tags: "High Extraversion – ESFP – Type 7 – HEXACO Social Boldness" },
      { text: "Attend selectively, focusing on meeting a few key contacts.", tags: "Moderate Extraversion – ENTP – Type 3 – Strategic Thinking" },
      { text: "Politely decline, preferring to spend time alone or with close friends.", tags: "Low Extraversion – INFP – Type 4 – HEXACO Reserved" },
      { text: "Go to observe people and learn from interactions without actively networking.", tags: "High Openness – INTP – Type 5 – HEXACO Inquisitiveness" },
      { text: "Accept to support your friend, even if the event isn’t your style.", tags: "High Agreeableness – ISFJ – Type 9 – HEXACO Altruism" },
      { text: "Decline and suggest an alternative smaller gathering.", tags: "Moderate Agreeableness – INFJ – Type 2 – Preference for Intimacy" },
      { text: "Attend only if it aligns with a professional or strategic goal.", tags: "High Conscientiousness – ENTJ – Type 8 – HEXACO Prudence" },
    ],
  },
  {
    id: 3,
    prompt:
      "Q3 – Ethical Dilemma\nYou notice a colleague taking office supplies home without permission.",
    options: [
      { text: "Report them immediately to a supervisor.", tags: "High Honesty-Humility – ISTJ – Type 1" },
      { text: "Approach them privately to discuss why it’s wrong.", tags: "High Agreeableness – ESFJ – Type 2" },
      { text: "Ignore it; it’s not your business.", tags: "Low Conscientiousness – INTP – Type 5" },
      { text: "Subtly make a joke about it to hint at awareness.", tags: "Moderate Openness – ENTP – Type 7" },
      { text: "Evaluate if the company mistreats employees before deciding.", tags: "High Analytical Thinking – INTJ – Type 5" },
      { text: "Take it as a sign of low morale and think about systemic issues.", tags: "High Emotionality – INFJ – Type 4" },
      { text: "Confront them publicly to set an example.", tags: "High Assertiveness – ESTP – Type 8" },
    ],
  },
  {
    id: 4,
    prompt:
      "Q4 – Last-Minute Plan Change\nYour weekend hiking trip gets cancelled due to bad weather.",
    options: [
      { text: "Quickly plan an alternative exciting activity.", tags: "High Openness – ENFP – Type 7" },
      { text: "Reschedule the trip for another date immediately.", tags: "High Conscientiousness – ISTJ – Type 1" },
      { text: "Suggest staying in and doing something relaxing.", tags: "High Emotional Regulation – ISFP – Type 9" },
      { text: "Organize a group indoor event to keep everyone engaged.", tags: "High Extraversion – ESFP – Type 3" },
      { text: "Take the opportunity for personal reflection or reading.", tags: "High Introversion – INFJ – Type 4" },
      { text: "Ask everyone for suggestions and vote.", tags: "High Agreeableness – ENFJ – Type 2" },
      { text: "Decide to spend the time on unfinished work or projects.", tags: "High Achievement Focus – ENTJ – Type 8" },
    ],
  },
  {
    id: 5,
    prompt:
      "Q5 – Conflict in a Group\nTwo friends in your group have an argument, and the tension is affecting everyone.",
    options: [
      { text: "Step in and mediate directly.", tags: "High Agreeableness – ENFJ – Type 9" },
      { text: "Listen to both sides separately before suggesting a solution.", tags: "High Conscientiousness – INFJ – Type 2" },
      { text: "Let them resolve it on their own.", tags: "Low Agreeableness – INTP – Type 5" },
      { text: "Distract the group with humor to diffuse tension.", tags: "High Openness – ENTP – Type 7" },
      { text: "Take sides with the person you feel is right.", tags: "Moderate Honesty-Humility – ESTP – Type 8" },
      { text: "Avoid the conflict entirely by leaving.", tags: "Low Extraversion – ISFP – Type 4" },
      { text: "Propose a group discussion to address the issue openly.", tags: "High Extraversion – ESFJ – Type 1" },
    ],
  },
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
  const [tScenario1to15, setTScenario1to15] = useState<ScenarioItem[]>(SCENARIO_Q1_15);
  const [tScenarioLikert16to25, setTScenarioLikert16to25] = useState<ScenarioLikertItem[]>(SCENARIO_LIKERT_Q16_25);
  const [tLikert26to30, setTLikert26to30] = useState<LikertOnlyItem[]>(LIKERT_Q26_30);
  const [tOpen31to35, setTOpen31to35] = useState<OpenEndedItem[]>(OPEN_Q31_35);

  // Translate prompts and options when language changes
  useEffect(() => {
    const doTranslate = async () => {
      // Ensure we honor saved aiUserProfile language, if present
      let lang = language;
      try {
        const saved = localStorage.getItem('aiUserProfile');
        if (saved) {
          const p = JSON.parse(saved);
          if (p?.language) lang = p.language;
        }
      } catch {}

      if (lang === 'en') {
        setTScenario1to15(SCENARIO_Q1_15);
        setTScenarioLikert16to25(SCENARIO_LIKERT_Q16_25);
        setTLikert26to30(LIKERT_Q26_30);
        setTOpen31to35(OPEN_Q31_35);
        return;
      }
      // Q1-15
      const prompts1to15 = SCENARIO_Q1_15.map(q => q.prompt);
      const options1to15 = SCENARIO_Q1_15.flatMap(q => q.options.map(o => o.text || ""));
      const [tp1, to1] = await Promise.all([
        translateArray(prompts1to15, lang),
        translateArray(options1to15, lang),
      ]);
      let optIdx = 0;
      const translated1to15 = SCENARIO_Q1_15.map((q, i) => ({
        ...q,
        prompt: tp1[i] || q.prompt,
        options: q.options.map((o) => ({ ...o, text: to1[optIdx++] || o.text })),
      }));

      // Q16-25
      const prompts16to25 = SCENARIO_LIKERT_Q16_25.map(q => q.prompt);
      const likertPrompts = SCENARIO_LIKERT_Q16_25.map(q => q.likertPrompt);
      const options16to25 = SCENARIO_LIKERT_Q16_25.flatMap(q => q.options.map(o => o.text || ""));
      const [tp2, tlp, to2] = await Promise.all([
        translateArray(prompts16to25, lang),
        translateArray(likertPrompts, lang),
        translateArray(options16to25, lang),
      ]);
      optIdx = 0;
      const translated16to25 = SCENARIO_LIKERT_Q16_25.map((q, i) => ({
        ...q,
        prompt: tp2[i] || q.prompt,
        options: q.options.map((o) => ({ ...o, text: (to2[optIdx++] || o.text) })),
        likertPrompt: tlp[i] || q.likertPrompt,
      }));

      // Q26-30 Likert
      const prompts26to30 = LIKERT_Q26_30.map(q => q.prompt);
      const tp3 = await translateArray(prompts26to30, lang);
      const translated26to30 = LIKERT_Q26_30.map((q, i) => ({ ...q, prompt: tp3[i] || q.prompt }));

      // Q31-35 Open
      const prompts31to35 = OPEN_Q31_35.map(q => q.prompt);
      const tp4 = await translateArray(prompts31to35, lang);
      const translated31to35 = OPEN_Q31_35.map((q, i) => ({ ...q, prompt: tp4[i] || q.prompt }));

      setTScenario1to15(translated1to15);
      setTScenarioLikert16to25(translated16to25);
      setTLikert26to30(translated26to30);
      setTOpen31to35(translated31to35);
    };
    doTranslate();
  }, [language]);

  // Responses keyed by question id
  const [responses, setResponses] = useState<Record<number, ResponseState>>({});
  const [startTs, setStartTs] = useState<number | null>(null);
  const [endTs, setEndTs] = useState<number | null>(null);

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
      const durationMs = startTs && endTs ? endTs - startTs : null;
      localStorage.setItem(
        "selphlyze_general_personality_v1",
        JSON.stringify({ responses, meta: { startTs, endTs, durationMs }, language })
      );
      (async () => {
        try {
          const { supabase } = await import("@/app/lib/supabaseClient");
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            await supabase.from('test_results').insert({
              user_id: session.user.id,
              test_slug: 'general-personality-test',
              test_name: 'General Personality Test',
              score: null,
              payload: { responses, meta: { startTs, endTs, durationMs }, language },
              started_at: startTs ? new Date(startTs).toISOString() : null,
              finished_at: new Date().toISOString()
            });
          }
        } catch {}
      })();
      alert("Responses saved.");
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

  const ui = useMemo(() => {
    if (language === 'fa') {
      return {
        title: 'آزمون شخصیت سلـف‌لایز – ۳۵ سوال',
        likertLabel: 'لیکرت (۱–کاملاً مخالفم … ۷–کاملاً موافقم)',
        legend1: '۱ = کاملاً مخالفم',
        legend2: '۲ = مخالفم',
        legend3: '۳ = تا حدی مخالفم',
        legend4: '۴ = خنثی',
        legend5: '۵ = تا حدی موافقم',
        legend6: '۶ = موافقم',
        legend7: '۷ = کاملاً موافقم',
        openPlaceholder: 'پاسخ خود را بنویسید (حداقل ۱۰ کاراکتر).',
        submit: 'ارسال پاسخ‌ها',
      } as const;
    }
    if (language === 'es') {
      return {
        title: 'Test de Personalidad Selphlyze – 35 Preguntas',
        likertLabel: 'Likert (1–Totalmente en desacuerdo … 7–Totalmente de acuerdo)',
        legend1: '1 = Totalmente en desacuerdo',
        legend2: '2 = En desacuerdo',
        legend3: '3 = Algo en desacuerdo',
        legend4: '4 = Neutral',
        legend5: '5 = Algo de acuerdo',
        legend6: '6 = De acuerdo',
        legend7: '7 = Totalmente de acuerdo',
        openPlaceholder: 'Escribe tu respuesta (mínimo 10 caracteres).',
        submit: 'Enviar respuestas',
      } as const;
    }
    return {
      title: 'Selphlyze Personality Test – 35 Items',
      likertLabel: 'Likert (1–Strongly Disagree … 7–Strongly Agree)',
      legend1: '1 = Strongly Disagree',
      legend2: '2 = Disagree',
      legend3: '3 = Somewhat Disagree',
      legend4: '4 = Neutral',
      legend5: '5 = Somewhat Agree',
      legend6: '6 = Agree',
      legend7: '7 = Strongly Agree',
      openPlaceholder: 'Write your answer (min 10 characters).',
      submit: 'Submit Responses',
    } as const;
  }, [language]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-white py-20 px-6">
      {/* Start Confirm */}
      {/* Start modal removed per request */}

      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          {ui.title}
        </h1>

        {/* Q1–Q15 Scenario */}
        {tScenario1to15.map((q, qi) => (
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
          </motion.section>
        ))}

        {/* Q16–Q25 Scenario + Likert */}
        {tScenarioLikert16to25.map((q) => (
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
              <p className="text-sm text-gray-300 mb-2">{q.likertPrompt}</p>
              <LikertScale qid={q.id} />
              <div className="mt-2 text-xs text-gray-400 flex flex-wrap gap-3">
                <span>{ui.legend1}</span>
                <span>{ui.legend2}</span>
                <span>{ui.legend3}</span>
                <span>{ui.legend4}</span>
                <span>{ui.legend5}</span>
                <span>{ui.legend6}</span>
                <span>{ui.legend7}</span>
              </div>
            </div>
          </motion.section>
        ))}

        {/* Q26–Q30 Likert only */}
        {tLikert26to30.map((q) => (
          <motion.section
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/70 border border-slate-700 rounded-2xl p-6 shadow-xl"
          >
            <h2 className="font-bold text-lg mb-2">Q{q.id} – {q.prompt}</h2>
            <p className="text-sm text-gray-300 mb-2">{ui.likertLabel}</p>
            <LikertScale qid={q.id} />
            <div className="mt-2 text-xs text-gray-400 flex flex-wrap gap-3">
              <span>{ui.legend1}</span>
              <span>{ui.legend2}</span>
              <span>{ui.legend3}</span>
              <span>{ui.legend4}</span>
              <span>{ui.legend5}</span>
              <span>{ui.legend6}</span>
              <span>{ui.legend7}</span>
            </div>
          </motion.section>
        ))}

        {/* Q31–Q35 Open-ended */}
        {tOpen31to35.map((q) => (
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
              placeholder={ui.openPlaceholder}
            />
          </motion.section>
        ))}

        <div className="sticky bottom-6 flex justify-center">
          <button
            onClick={() => { setEndTs(Date.now()); handleSubmit(); }}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl hover:from-teal-400 hover:to-blue-400 transition"
          >
            {ui.submit}
          </button>
        </div>
      </div>
    </main>
  );
}


