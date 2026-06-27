import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Coins, PiggyBank, TrendingUp, Wallet, Shield } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, FadeIn } from "@/components/ui-bits";
import { useRequireAuth } from "@/lib/auth";

export const Route = createFileRoute("/finance")({ component: Finance });

const TOPICS = [
  { icon: PiggyBank, color: "text-success bg-success/15", title: "Saving", desc: "Build the habit early" },
  { icon: TrendingUp, color: "text-primary bg-primary/15", title: "Investing", desc: "Make money work for you" },
  { icon: Coins, color: "text-warning bg-warning/15", title: "SIP & Gold", desc: "Compounding 101" },
  { icon: Wallet, color: "text-secondary bg-secondary/15", title: "Budgeting", desc: "Track every rupee" },
];

const CHALLENGES = [
  {
    id: "c1", emoji: "💰", title: "₹500 birthday money",
    desc: "Your grandma gave you ₹500. What's the smartest move?",
    options: [
      "Spend it all on gaming skins",
      "Put ₹400 in savings, spend ₹100",
      "Lend it to a friend",
      "Buy lottery tickets",
    ],
    correct: 1,
    feedback: "80/20 split is the way. Save first, then enjoy what's left guilt-free.",
  },
  {
    id: "c2", emoji: "📈", title: "First ₹1000 to invest",
    desc: "You saved ₹1000. Best place to start?",
    options: ["Crypto meme coin","Index fund SIP","Stock tip from YouTube","Cash under mattress"],
    correct: 1,
    feedback: "Index fund SIPs beat 90% of stock pickers over 10 years. Boring wins.",
  },
  {
    id: "c3", emoji: "🛡️", title: "Emergency fund",
    desc: "How much should an emergency fund cover?",
    options: ["1 week of expenses","3-6 months of expenses","1 year of income","No need, parents handle it"],
    correct: 1,
    feedback: "3-6 months is the gold standard. It buys you freedom and peace.",
  },
];

const BADGES = [
  { emoji: "💰", name: "First Save", unlocked: true },
  { emoji: "📈", name: "SIP Starter", unlocked: false },
  { emoji: "🛡️", name: "Safety First", unlocked: false },
  { emoji: "🏦", name: "Finance Pro", unlocked: false },
];

function ChallengeCard({ c }: { c: typeof CHALLENGES[number] }) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked !== null;
  return (
    <Card>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3 text-left">
          <div className="text-2xl">{c.emoji}</div>
          <div>
            <div className="font-display font-semibold">{c.title}</div>
            <div className="text-xs text-muted-foreground">+50 XP · Decision challenge</div>
          </div>
        </div>
        {done && <span className="text-xs px-2 py-1 rounded-full bg-success/15 text-success border border-success/30">✓ Done</span>}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-4 text-sm text-muted-foreground">{c.desc}</div>
            <div className="grid gap-2 mt-4">
              {c.options.map((o, i) => {
                const isCorrect = done && i === c.correct;
                const isWrong = done && picked === i && i !== c.correct;
                return (
                  <button
                    key={i}
                    disabled={done}
                    onClick={() => setPicked(i)}
                    className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                      isCorrect ? "border-success bg-success/15 text-success"
                      : isWrong ? "border-danger bg-danger/15 text-danger"
                      : "border-border bg-surface hover:border-primary"
                    }`}
                  >{o}</button>
                );
              })}
            </div>
            {done && (
              <div className="mt-4 p-3 rounded-lg bg-surface-elevated text-sm">
                {c.feedback} <span className="text-success font-semibold">+50 XP earned!</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function Finance() {
  const { user, loading } = useRequireAuth();
  if (loading || !user) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading...</div>;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <FadeIn>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-success/15 grid place-items-center text-success"><Coins className="h-5 w-5" /></div>
                <h1 className="font-display font-bold text-3xl">Finance Lab</h1>
              </div>
              <p className="text-muted-foreground">Learn money through daily decisions, not boring lectures.</p>
            </div>
            <Card className="!p-4 text-right min-w-[140px]">
              <div className="text-xs text-muted-foreground">XP earned today</div>
              <div className="font-display font-bold text-2xl text-warning">+50</div>
            </Card>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
          {TOPICS.map((t, i) => (
            <FadeIn key={t.title} delay={i * 0.05}>
              <motion.div whileHover={{ y: -4 }}><Card>
                <div className={`h-10 w-10 rounded-lg grid place-items-center mb-3 ${t.color}`}><t.icon className="h-5 w-5" /></div>
                <div className="font-display font-semibold">{t.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{t.desc}</div>
              </Card></motion.div>
            </FadeIn>
          ))}
        </div>

        <h2 className="font-display font-bold text-xl mt-10 mb-4">Daily Challenges</h2>
        <div className="space-y-3">
          {CHALLENGES.map(c => <ChallengeCard key={c.id} c={c} />)}
        </div>

        <h2 className="font-display font-bold text-xl mt-10 mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-warning" />Finance Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map(b => (
            <Card key={b.name} className={`text-center ${!b.unlocked ? "opacity-40" : ""}`}>
              <div className="text-3xl">{b.emoji}</div>
              <div className="font-display font-semibold text-sm mt-2">{b.name}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{b.unlocked ? "Unlocked" : "Locked"}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
