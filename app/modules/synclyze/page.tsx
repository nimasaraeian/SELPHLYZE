"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Heart, MessageCircle, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, Circle, Save as SaveIcon, RotateCcw, Music2, Headphones } from "lucide-react";

type Question = { id: string; text: string; options: string[] };
type Scenario = { id: string; title: string; image: string; prompt: string; options: string[] };
type Section = { title: string; questions: Question[] };

const questionnaire: Section[] = [
  {
    title: "Attachment Style",
    questions: [
      {
        id: "attach-1",
        text:
          "You are planning a weekend trip with your partner. They suddenly say they might have to cancel due to work. What’s your first inner reaction?",
        options: [
          "Feel hurt but avoid showing it.",
          "Offer to reschedule immediately.",
          "Pretend it’s fine, but feel distant inside.",
          "Ask if work can wait until after the trip.",
          "Feel indifferent and make solo plans.",
        ],
      },
      {
        id: "attach-2",
        text:
          "Your partner hasn’t replied to your text all day. What’s your most likely next step?",
        options: [
          "Send a short “Are you okay?” message.",
          "Keep checking the phone every few minutes.",
          "Wait patiently until they respond.",
          "Get annoyed and send multiple messages.",
          "Distract yourself with another activity.",
        ],
      },
    ],
  },
  {
    title: "Emotional Intelligence",
    questions: [
      {
        id: "ei-1",
        text: "You notice your partner is quieter than usual at dinner. What do you do first?",
        options: [
          "Ask directly if something’s wrong.",
          "Share a personal story to open them up.",
          "Wait for them to speak first.",
          "Change the topic to something lighter.",
          "Offer comfort without asking questions.",
        ],
      },
      {
        id: "ei-2",
        text: "Your partner seems upset, but insists they’re “fine.” What’s your instinct?",
        options: [
          "Believe them and drop the subject.",
          "Observe their body language more closely.",
          "Ask again in a softer tone later.",
          "Make a joke to lighten the mood.",
          "Offer a hug or physical comfort.",
        ],
      },
    ],
  },
  {
    title: "Conflict Style",
    questions: [
      {
        id: "conf-1",
        text:
          "During a disagreement about money, your partner raises their voice. What’s your natural reaction?",
        options: [
          "Match their tone.",
          "Speak more calmly to balance things.",
          "Leave the room to cool off.",
          "Change the topic to stop the fight.",
          "Ask direct questions to understand their point.",
        ],
      },
      {
        id: "conf-2",
        text: "You and your partner can’t agree on where to live. What’s your approach?",
        options: [
          "Compromise halfway.",
          "Research together for alternatives.",
          "Let them choose to avoid conflict.",
          "Stick firmly to your choice.",
          "Delay the decision until later.",
        ],
      },
    ],
  },
  {
    title: "Empathy Accuracy",
    questions: [
      {
        id: "emp-1",
        text:
          "Your partner is telling you a story about their bad day. What are you most focused on?",
        options: [
          "Their exact words.",
          "Their tone of voice.",
          "Their body language.",
          "How you would feel in their place.",
          "Thinking of solutions.",
        ],
      },
      {
        id: "emp-2",
        text:
          "You give your partner a gift, but they seem less excited than expected. What’s your thought?",
        options: [
          "They didn’t like it.",
          "They’re tired or distracted.",
          "They’re hiding their real feelings.",
          "It doesn’t matter—it’s the gesture.",
          "They might surprise me with gratitude later.",
        ],
      },
    ],
  },
  {
    title: "Language Style",
    questions: [
      {
        id: "lang-1",
        text: "When you send a long message, you expect your partner to…",
        options: [
          "Reply with a similar length.",
          "Acknowledge quickly, even if short.",
          "Use emojis or emotional cues.",
          "Ask follow-up questions.",
          "Respond when they have time.",
        ],
      },
      {
        id: "lang-2",
        text:
          "Your partner sends you a two-word reply to a heartfelt message. How do you react?",
        options: [
          "Feel disappointed but let it go.",
          "Ask if they read it fully.",
          "Assume they’re busy.",
          "Respond equally shortly.",
          "Call them to talk instead.",
        ],
      },
    ],
  },
];

export default function SynclyzeModulePage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [result, setResult] = useState<
    | null
    | {
        code?: string;
        explanation?: string;
        raw?: string;
        error?: string;
        scores?: { attachment: number; eq: number; conflict: number; empathy: number; language: number };
        sections?: Record<
          string,
          {
            title: string;
            summary?: string;
            behaviors?: string[];
            impact?: string[];
            strengths?: string[];
            risks?: string[];
            recommendations?: string[];
          }
        >;
        byCategory?: {
          textual?: { summary?: string; insights?: string[]; risks?: string[]; recommendations?: string[] };
          visual?: { summary?: string; insights?: string[]; risks?: string[]; recommendations?: string[] };
          audio?: { summary?: string; insights?: string[]; risks?: string[]; recommendations?: string[] };
        };
      }
  >(null);

  // Audio flow states
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioConsent, setAudioConsent] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioElapsed, setAudioElapsed] = useState(0);
  const [audioDone, setAudioDone] = useState<boolean>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('synclyzeAudioDone') === '1';
    return false;
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setMounted(true); setIsMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Synclyze...</p>
        </div>
      </div>
    );
  }

  const sessionData =
    typeof window !== "undefined" ? localStorage.getItem("synclyzeAnswers") : null;
  const session = sessionData ? JSON.parse(sessionData) : null;

  const scenarios: Scenario[] = [
    // New posture-based visual questions (women / men)
    {
      id: "vis-women-1",
      title: "Posture – Conversation Start (Women)",
      image: "/image/synclyze women.jpeg",
      prompt:
        "When imagining this person approaching you in a real-life setting, which posture feels more inviting to start a conversation?",
      options: [
        "Panel 1",
        "Panel 2",
      ],
    },
    {
      id: "vis-men-2",
      title: "Posture – Sharing Personal News (Men)",
      image: "/image/synclyze men.jpeg",
      prompt:
        "If you were about to share personal news, in which posture would you feel more comfortable opening up?",
      options: [
        "Panel 1",
        "Panel 2",
      ],
    },
    {
      id: "vis-1",
      title: "Q1 – Park Bench Silence",
      image: "/image/synclyze1.jpg",
      prompt: "What would you most likely do in this moment?",
      options: [
        "Give them space and wait for them to speak first.",
        "Gently ask what’s bothering them.",
        "Try to lighten the mood with a joke or distraction.",
        "Feel that this distance is a sign of coldness in the relationship.",
        "Ignore it and continue with my own thoughts.",
        "Immediately worry that something serious is wrong.",
        "Judge internally that they shouldn’t act so distant.",
      ],
    },
    {
      id: "vis-2",
      title: "Q2 – Unexpected Phone Call",
      image: "/image/synclyze3.jpg",
      prompt: "How would you react in this situation?",
      options: [
        "Wait patiently until they finish the call.",
        "Offer to help with whatever is troubling them.",
        "Ask directly if everything is okay.",
        "Feel anxious and wonder if the trip will be ruined.",
        "Keep packing and act as if nothing happened.",
        "Try to cheer them up afterward.",
        "Feel upset that they didn’t share the issue immediately.",
      ],
    },
    {
      id: "vis-3",
      title: "Q3 – Restaurant Disagreement",
      image: "/image/synclyze2.jpg",
      prompt: "How would you handle this moment?",
      options: [
        "Calmly listen and let them finish their point.",
        "Suggest a break in the conversation to avoid escalation.",
        "Defend my point more strongly.",
        "Change the topic to something neutral.",
        "Stay silent and keep my thoughts to myself.",
        "Feel irritated and withdraw emotionally.",
        "Try to make them laugh to diffuse tension.",
      ],
    },
    // Audio-based questions block (placed mid-visual flow)
    {
      id: "aud-1",
      title: "Audio – Memory Recall",
      image: "",
      prompt: "What number was mentioned in the recording?",
      options: ["12", "16", "24", "28", "34", "40"],
    },
    {
      id: "aud-2",
      title: "Audio – Color Recognition",
      image: "",
      prompt: "Which two colors were mentioned?",
      options: [
        "Blue & Green",
        "Blue & Yellow",
        "Green & Red",
        "Yellow & White",
        "Red & Black",
        "White & Green",
      ],
    },
    {
      id: "aud-3",
      title: "Audio – Dual-Detail Check",
      image: "",
      prompt: "What was the background sound while the speaker was talking?",
      options: [
        "Ocean waves",
        "Cafe ambience with soft acoustic guitar",
        "Car engine noise",
        "Rainfall with piano",
        "Crowd cheering",
        "Silence",
      ],
    },
    {
      id: "vis-4",
      title: "Q4 – Missed Message",
      image: "/image/synclyze5.jpg",
      prompt: "What’s your first instinct?",
      options: [
        "Assume they were busy and it’s nothing serious.",
        "Feel slightly hurt but decide to let it go.",
        "Ask them directly why they didn’t reply.",
        "Start imagining worst-case scenarios.",
        "Wait to see if they bring it up themselves.",
        "Distract myself to avoid overthinking.",
        "Feel the need to check their activity online.",
      ],
    },
    {
      id: "vis-5",
      title: "Q5 – Gift Surprise",
      image: "/image/synclyze4.jpg",
      prompt: "How would you interpret their reaction?",
      options: [
        "They’re just surprised and didn’t expect it.",
        "They might not like surprises.",
        "The gift may not match their taste.",
        "They’re shy about showing emotions.",
        "They’re thinking about something unrelated.",
        "They appreciate it but express it subtly.",
        "They feel uncomfortable receiving gifts.",
      ],
    },
    // New abstract concept images with two questions each
    {
      id: "vis-con1-q1",
      title: "Image 1 – Abstract Landscape with Two Figures at a Distance",
      image: "/image/synclyze consept 1.jpg",
      prompt: "When you look at these two figures, what do you think is happening between them?",
      options: [
        "They’re maintaining a respectful distance while feeling connected.",
        "They’re drifting apart emotionally despite physical awareness.",
        "They’re waiting for the right moment to reconnect.",
        "They’re avoiding each other to prevent conflict.",
        "They’re silently supporting each other from afar.",
        "They’re comfortable in their independence without needing closeness.",
      ],
    },
    {
      id: "vis-con1-q2",
      title: "Image 1 – Abstract Landscape with Two Figures at a Distance",
      image: "/image/synclyze consept 1.jpg",
      prompt: "If you were in this scene with your partner, how close would you want to stand?",
      options: [
        "Very close — I prefer strong physical proximity.",
        "Close enough to feel presence but with personal space.",
        "Moderate — closeness when needed, distance when comfortable.",
        "Slightly apart — I like emotional connection without physical intensity.",
        "Far — I need space to feel safe.",
        "It depends entirely on the situation and mood.",
      ],
    },
    {
      id: "vis-con2-q3",
      title: "Image 2 – Two Hands Reaching Toward Each Other, Not Yet Touching",
      image: "/image/synclyze consept 2.jpg",
      prompt: "What do you feel will happen next in this moment?",
      options: [
        "The hands will connect warmly and fully.",
        "They’ll touch lightly but not hold.",
        "They’ll stay in this almost-touch state for a while.",
        "One will pull away before contact.",
        "They’ll both withdraw without touching.",
        "Uncertain — the outcome could go either way.",
      ],
    },
    {
      id: "vis-con2-q4",
      title: "Image 2 – Two Hands Reaching Toward Each Other, Not Yet Touching",
      image: "/image/synclyze consept 2.jpg",
      prompt: "If this were your relationship, how would you want this scene to end?",
      options: [
        "With full connection and warmth.",
        "With gentle touch, no more.",
        "By keeping the suspense longer.",
        "By stepping back for comfort.",
        "By deciding together whether to connect or not.",
        "I wouldn’t want to decide — I’d follow my partner’s lead.",
      ],
    },
    {
      id: "vis-con3-q5",
      title: "Image 3 – Two Abstract Human Silhouettes",
      image: "/image/synclyze consept 3.jpg",
      prompt: "Which figure do you relate to more?",
      options: [
        "The one facing forward — open and direct.",
        "The one turned away — reflective and guarded.",
        "Both equally — depending on the context.",
        "Neither — I react differently than both.",
        "I can’t choose — both sides feel incomplete.",
        "I notice the space between them more than the figures themselves.",
      ],
    },
    {
      id: "vis-con3-q6",
      title: "Image 3 – Two Abstract Human Silhouettes",
      image: "/image/synclyze consept 3.jpg",
      prompt:
        "If these figures represented you and your partner during a disagreement, how would you want the scene to change?",
      options: [
        "Both facing each other openly.",
        "Both turning slightly toward a shared point.",
        "One holding space while the other approaches.",
        "Both turning away to cool down.",
        "One signaling readiness while the other decides.",
        "Leaving the scene as it is — some space is healthy.",
      ],
    },
  ];

  const totalQuestions = useMemo(
    () =>
      questionnaire.reduce((acc, s) => acc + s.questions.length, 0) +
      scenarios.length,
    []
  );
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelect = (qid: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  // Flatten questions for wizard navigation
  const flatQuestions = useMemo(
    () => [
      ...questionnaire.flatMap((sec) =>
        sec.questions.map((q) => ({ ...q, section: sec.title }))
      ),
      ...scenarios.map((s) => ({ id: s.id, text: `${s.prompt}`, options: s.options, section: s.title })),
    ],
    []
  );

  const current = flatQuestions[currentIndex];

  // Draft persistence for better UX
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const draft = localStorage.getItem('synclyzeDraft');
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed && parsed.answers) setAnswers(parsed.answers);
        if (typeof parsed.currentIndex === 'number') setCurrentIndex(parsed.currentIndex);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('synclyzeDraft', JSON.stringify({ answers, currentIndex }));
    } catch {}
  }, [answers, currentIndex]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem('synclyzeAudioDone', audioDone ? '1' : '0'); } catch {}
  }, [audioDone]);

  // Keyboard shortcuts 1..5
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      const idx = Number(key) - 1;
      if (!current) return;
      if (idx >= 0 && idx < current.options.length) {
        handleSelect(current.id, current.options[idx]);
      }
      if (key === 'ArrowRight') next();
      if (key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current]);

  const next = () => setCurrentIndex((i) => Math.min(i + 1, flatQuestions.length - 1));
  const prev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  const startAudio = () => {
    setAudioConsent(true);
    setTimeout(() => {
      const a = audioRef.current;
      if (a) {
        try {
          a.currentTime = 0;
          a.play()?.then(() => setAudioPlaying(true)).catch(() => {});
        } catch {}
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent | MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Transform answers into readable mapping
    const readable: Record<string, string> = {};
    questionnaire.forEach((sec) => {
      sec.questions.forEach((q) => {
        if (answers[q.id]) readable[`${sec.title} — ${q.text}`] = answers[q.id];
      });
    });

    try {
      const res = await fetch("/api/synclyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userOne: session?.answers,
          userTwo: {
            ...readable,
            ...Object.fromEntries(
              scenarios.map((s) => [
                `${s.title} — ${s.prompt}`,
                answers[s.id] || "",
              ])
            ),
          },
          meta: {
            textualKeys: questionnaire.flatMap(sec => sec.questions.map(q => `${sec.title} — ${q.text}`)),
            visualKeys: scenarios.filter(s => s.id.startsWith('vis-')).map(s => `${s.title} — ${s.prompt}`),
            audioKeys: scenarios.filter(s => s.id.startsWith('aud-')).map(s => `${s.title} — ${s.prompt}`),
          }
        }),
      });

      const data = await res.json();
      if (data.code || data.explanation || data.scores || data.sections || data.byCategory) {
        setResult({ code: data.code, explanation: data.explanation, raw: data.raw, scores: data.scores, sections: data.sections, ...('byCategory' in data ? { byCategory: data.byCategory } : {}) });
        try {
          localStorage.setItem('synclyzeResult', JSON.stringify({ code: data.code, scores: data.scores, sections: data.sections, byCategory: data.byCategory, ts: Date.now() }));
        } catch {}
      } else if (data.analysis) {
        // backward compatibility
        setResult({ explanation: data.analysis });
      } else if (data.error) {
        setResult({ error: data.error });
      } else {
        setResult({ error: "⚠️ No analysis result received." });
      }
      // Save this user's answers for potential later comparison
      if (typeof window !== 'undefined') {
        localStorage.setItem("synclyzeAnswers", JSON.stringify({ answers: readable }));
      }
    } catch (err: any) {
      setResult({ error: `❌ Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Local UI helpers for charts/cards (kept minimal; bars now use Tailwind gradient) */}
        {/* Header */}
        <div className="sticky top-20 z-10 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-slate-900/40 backdrop-blur-md border border-slate-700 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Synclyze</h1>
              <p className="text-slate-300">
                Subtle, indirect, multi-layered questions to assess harmony in attachment,
                empathy, conflict style, and language dynamics.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400 mb-1">Progress</div>
              <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-teal-500 to-blue-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-slate-400 mt-1">{answeredCount}/{totalQuestions} answered</div>
              <div className="flex items-center gap-2 justify-end mt-3">
                <button
                  type="button"
                  onClick={() => { try { localStorage.setItem('synclyzeDraft', JSON.stringify({ answers, currentIndex })); } catch {} }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 inline-flex items-center gap-2"
                >
                  <SaveIcon className="w-4 h-4" /> Save draft
                </button>
                  <button
                    type="button"
                  onClick={() => { 
                    setAnswers({}); 
                    setCurrentIndex(0); 
                    setAudioConsent(false);
                    setAudioDone(false);
                    setAudioElapsed(0);
                    try { 
                      localStorage.removeItem('synclyzeDraft'); 
                      localStorage.removeItem('synclyzeAudioDone');
                      localStorage.removeItem('synclyzeAnswers');
                    } catch {}
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wizard Question Card */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3 text-slate-400 text-sm">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>{current?.section} • Question {currentIndex + 1} of {flatQuestions.length}</span>
          </div>

          <motion.div
            key={current?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700 rounded-2xl p-8"
          >
            {/* Visual for scenarios */}
            {current && current.id.startsWith('vis-') && (
              <div className="mb-5">
                {(() => {
                  const sc = scenarios.find(s => s.id === current.id);
                  if (!sc) return null;
                  return (
                    <div className="rounded-xl border border-slate-700 bg-slate-900/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sc.image} alt={sc.title} className="w-1/2 h-auto object-contain mx-auto" />
                      <div className="p-4 text-slate-200 text-sm text-center">{sc.title}</div>
                    </div>
                  );
                })()}
              </div>
            )}
            {/* Audio flow for audio questions */}
            {current && current.id.startsWith('aud-') && (
              <div className="mb-6">
                {/* Intro and consent only on first audio question, if not done */}
                {!audioDone && current.id === 'aud-1' && !audioConsent && (
                  <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-800/60 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Synclyze Audio Task</div>
                        <div className="text-slate-400 text-xs">Please use headphones for best results</div>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm mb-4">
                      In this task, we will play a one-minute audio. After your confirmation, playback starts and related questions will appear only after it finishes.
                    </p>
                  <button
                    type="button"
                      onClick={startAudio}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-blue-600 text-white"
                    >
                      <Music2 className="w-4 h-4" /> Start 1-minute Playback
                    </button>
                  </div>
                )}
                {/* Player during playback (no controls), block nav */}
                {!audioDone && current.id === 'aud-1' && audioConsent && (
                  <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900/80 to-slate-800/60 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                        <Music2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Playing…</div>
                        <div className="text-slate-400 text-xs">Elapsed: {Math.min(60, Math.floor(audioElapsed))}s</div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                      <div className="h-2 bg-gradient-to-r from-teal-500 to-blue-500" style={{ width: `${Math.min(100, (audioElapsed/60)*100)}%` }} />
                    </div>
                    <audio
                      ref={audioRef}
                      preload="auto"
                      onTimeUpdate={(e) => {
                        const a = e.currentTarget;
                        setAudioElapsed(a.currentTime);
                        if (a.currentTime >= 60) {
                          try { a.pause(); } catch {}
                          setAudioPlaying(false);
                          setAudioDone(true);
                        }
                      }}
                      onPlay={() => setAudioPlaying(true)}
                      onPause={() => setAudioPlaying(false)}
                      className="hidden"
                    >
                      <source src={encodeURI('/music/synclyze music.mp3')} type="audio/mpeg" />
                    </audio>
                    <div className="text-slate-400 text-xs">Please stay on this page. Questions appear after playback ends.</div>
                  </div>
                )}
                {/* Info card for subsequent audio questions before completion */}
                {!audioDone && current.id !== 'aud-1' && (
                  <div className="rounded-xl border border-yellow-700/40 bg-yellow-900/10 p-4 text-yellow-200 text-sm">
                    Please complete the one-minute audio playback first. These questions will be enabled afterward.
                  </div>
                )}
                {/* After audio finished, show a small note on first card */}
                {audioDone && current.id === 'aud-1' && (
                  <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-slate-300 text-sm mb-4">
                    Audio session completed. Please answer the related questions.
                  </div>
                )}
              </div>
            )}
            {/* Only show the question and options when not in audio playback gating */}
            {!(current?.id?.startsWith('aud-') && !audioDone) && (
              <>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-relaxed">{current?.text}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {current?.options.map((opt, i) => {
                const selected = answers[current.id] === opt;
                const isAudioGate = current.id.startsWith('aud-') && !audioDone;
                return (
                  <motion.button
                    key={opt}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => !isAudioGate && handleSelect(current.id, opt)}
                    disabled={isAudioGate}
                    className={`text-left px-3 py-2 rounded-lg border transition flex items-start gap-2.5 ${
                      selected
                        ? "bg-teal-600/90 text-white border-teal-400 shadow"
                        : isAudioGate
                          ? "bg-slate-900/30 text-slate-500 border-slate-800 cursor-not-allowed"
                          : "bg-slate-900/60 text-slate-200 border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    <div className={`mt-0.5 ${selected ? 'text-white' : 'text-teal-300'}`}>{['💙','🕊️','🤔','😊','⚖️'][i] || '✨'}</div>
                    <div className="flex-1">
                      <p className="text-sm md:text-base leading-relaxed">{opt}</p>
              </div>
                    {selected ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500" />
                    )}
                  </motion.button>
                );
              })}
            </div>
              </>
            )}

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={prev}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={next}
                  disabled={currentIndex === flatQuestions.length - 1 || (current?.id?.startsWith('aud-') && !audioDone)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-40"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
            <button
                  type="button"
                  onClick={handleSubmit as any}
                  disabled={loading || answeredCount !== totalQuestions}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow disabled:opacity-50"
            >
                  {answeredCount !== totalQuestions ? 'Complete all questions' : (loading ? 'Analyzing...' : 'Finish & Analyze')}
            </button>
          </div>
            </div>
          </motion.div>
        </div>

        {/* Video placeholders removed as requested; space dedicated to questions */}

        {result && (
          <div className="mt-12 space-y-6">
            {/* Code chip (kept separate; not included in narrative) */}
            {result.code && (
              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4">
                <div className="text-sm text-slate-400 mb-1">Synclyze Code</div>
                <div className="inline-block px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-teal-300 font-mono">
                  {result.code}
                </div>
              </div>
            )}

            {/* Scores chart */}
            {result.scores && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Dimension Scores</h3>
                  <ScoresBarChart scores={result.scores} />
                </div>
                 <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700 rounded-2xl p-6">
                   <h3 className="text-lg font-bold text-white mb-4">Radar Overview</h3>
                   <div suppressHydrationWarning>
                     {isMounted ? (
                       <RadarChart scores={result.scores} />
                     ) : (
                       <div className="h-64 grid place-items-center text-slate-500 text-sm">Loading…</div>
                     )}
                   </div>
                 </div>
              </div>
            )}

            {/* Sections grid */}
            {result.sections && (
              <div className="grid gap-6 md:grid-cols-2">
                {Object.entries(result.sections).map(([key, sec]) => (
                  <AnalysisCard key={key} title={sec.title} summary={sec.summary} lists={{
                    Behaviors: sec.behaviors,
                    Impact: sec.impact,
                    Strengths: sec.strengths,
                    Risks: sec.risks,
                    Recommendations: sec.recommendations,
                  }} />
                ))}
              </div>
            )}

            {/* Category breakdown: textual / visual / audio */}
            {result.byCategory && (
              <div className="grid gap-6 md:grid-cols-3">
                {(['textual', 'visual', 'audio'] as const).map((cat) => {
                  const data = result.byCategory?.[cat];
                  if (!data) return null;
                  return (
                    <AnalysisCard
                      key={cat}
                      title={cat === 'textual' ? 'Text Questions' : cat === 'visual' ? 'Visual Questions' : 'Audio Questions'}
                      summary={data.summary}
                      lists={{
                        Insights: data.insights,
                        Risks: data.risks,
                        Recommendations: data.recommendations,
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Fallback explanation text */}
            {answeredCount === totalQuestions && !result.sections && result.explanation && (
              <div className="bg-slate-900/80 border border-teal-600 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-teal-400 mb-4">Relationship Analysis</h2>
                <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">{result.explanation}</p>
              </div>
            )}

            {result.error && (
              <div className="bg-slate-900/80 border border-red-700 rounded-xl p-6">
                <p className="text-red-400 leading-relaxed">{result.error}</p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Fullscreen analyzing modal */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-[var(--overlay)] backdrop-blur-sm flex items-center justify-center">
          <div className="w-80 rounded-2xl border border-emerald-500/30 bg-[var(--surface)] p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4" />
                <path d="M12 18v4" />
                <path d="M4.93 4.93l2.83 2.83" />
                <path d="M16.24 16.24l2.83 2.83" />
                <path d="M2 12h4" />
                <path d="M18 12h4" />
                <path d="M4.93 19.07l2.83-2.83" />
                <path d="M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <div className="text-white font-semibold mb-1">Generating Analysis…</div>
            <div className="text-slate-400 text-xs">This may take a few seconds</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoresBarChart({ scores }: { scores: { attachment: number; eq: number; conflict: number; empathy: number; language: number } }) {
  const items = [
    { key: 'attachment', label: 'Attachment', value: scores.attachment },
    { key: 'eq', label: 'Emotional Intelligence', value: scores.eq },
    { key: 'conflict', label: 'Conflict Style', value: scores.conflict },
    { key: 'empathy', label: 'Empathy Accuracy', value: scores.empathy },
    { key: 'language', label: 'Language Style', value: scores.language },
  ];
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.key}>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{it.label}</span>
            <span>{it.value}/5</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"
              style={{ width: `${Math.max(2, Math.min(100, (it.value / 5) * 100))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RadarChart({ scores }: { scores: { attachment: number; eq: number; conflict: number; empathy: number; language: number } }) {
  const labels = ["Attachment", "EQ", "Conflict", "Empathy", "Language"];
  const values = [scores.attachment, scores.eq, scores.conflict, scores.empathy, scores.language];
  const max = 5;
  const points = values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const r = (v / max) * 100; // radius in px
    const x = 120 + r * Math.cos(angle);
    const y = 120 + r * Math.sin(angle);
    return `${x},${y}`;
  });
  const gridRadii = [20, 40, 60, 80, 100];
  return (
    <svg viewBox="0 0 240 240" className="w-full h-64">
      {/* grid */}
      <g stroke="#334155" strokeOpacity="0.6" fill="none">
        {gridRadii.map((r) => (
          <circle key={r} cx={120} cy={120} r={r} />
        ))}
      </g>
      {/* axes */}
      <g stroke="#475569" strokeOpacity="0.6">
        {labels.map((_, i) => {
          const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
          const x = 120 + 100 * Math.cos(angle);
          const y = 120 + 100 * Math.sin(angle);
          return <line key={i} x1={120} y1={120} x2={x} y2={y} />;
        })}
      </g>
      {/* polygon */}
      <polygon points={points.join(" ")} fill="#14b8a6" fillOpacity="0.25" stroke="#10b981" strokeWidth={2} />
      {/* dots */}
      {points.map((p, i) => {
        const [x, y] = p.split(',').map(Number);
        return <circle key={i} cx={x} cy={y} r={3} fill="#22d3ee" />
      })}
      {/* labels */}
      {labels.map((label, i) => {
        const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const x = 120 + 118 * Math.cos(angle);
        const y = 120 + 118 * Math.sin(angle);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#cbd5e1" fontSize="10">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function AnalysisCard({ title, summary, lists }: { title: string; summary?: string; lists: Record<string, string[] | undefined> }) {
  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      {summary && <p className="text-slate-300 text-sm mb-4">{summary}</p>}
      <div className="grid gap-4">
        {Object.entries(lists).map(([k, arr]) =>
          arr && arr.length ? (
            <div key={k}>
              <div className="text-teal-300 text-xs font-semibold mb-1">{k}</div>
              <ul className="list-disc list-inside text-slate-200 text-sm space-y-1">
                {arr.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
