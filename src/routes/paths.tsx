import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Map as MapIcon, Sparkles, Check, Play } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button, Card, FadeIn, Input, Pill, ProgressBar } from "@/components/ui-bits";
import { useRequireAuth } from "@/lib/auth";

export const Route = createFileRoute("/paths")({ component: Paths });

const SUGGESTIONS = ["Cybersecurity","Blockchain Dev","Mobile App Dev","Data Science","Game Dev","DevOps"];

type Path = {
  id: string; emoji: string; title: string; level: string; duration: string;
  progress: number; steps: { name: string; resources: string[] }[];
};

const PATHS: Path[] = [
  {
    id: "ai", emoji: "🤖", title: "Become an AI Engineer", level: "Intermediate", duration: "6 months", progress: 35,
    steps: [
      { name: "Python fundamentals", resources: ["freeCodeCamp","Replit 100 days"] },
      { name: "Linear algebra & stats", resources: ["3Blue1Brown","Khan Academy"] },
      { name: "Build first ML model", resources: ["Kaggle Titanic","scikit-learn docs"] },
      { name: "Deep learning with PyTorch", resources: ["fast.ai","PyTorch tutorials"] },
      { name: "Ship an AI side project", resources: ["Hugging Face Spaces"] },
    ],
  },
  {
    id: "web", emoji: "🌐", title: "Modern Web Developer", level: "Beginner", duration: "4 months", progress: 60,
    steps: [
      { name: "HTML, CSS, JS basics", resources: ["MDN","Scrimba"] },
      { name: "React fundamentals", resources: ["React docs","Net Ninja"] },
      { name: "Backend with Node + Supabase", resources: ["Supabase docs"] },
      { name: "Deploy to Vercel", resources: ["Vercel guide"] },
    ],
  },
];

function PathCard({ p }: { p: Path }) {
  const [open, setOpen] = useState(false);
  const current = Math.floor((p.steps.length * p.progress) / 100);
  return (
    <Card>
      <button onClick={() => setOpen(o => !o)} className="w-full text-left">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{p.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-semibold">{p.title}</div>
            <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
              <span className="px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">{p.level}</span>
              <span>{p.duration}</span>
              <span>{p.steps.length} steps</span>
            </div>
          </div>
          <div className="text-right text-xs">
            <div className="text-primary font-semibold">{p.progress}%</div>
          </div>
        </div>
        <ProgressBar value={p.progress} className="mt-3" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-5 space-y-3">
              {p.steps.map((s, i) => {
                const done = i < current;
                const isNow = i === current;
                return (
                  <div key={i} className="flex gap-3">
                    <div className={`h-7 w-7 rounded-full grid place-items-center text-xs font-semibold flex-shrink-0 ${
                      done ? "bg-success text-white" : isNow ? "bg-primary text-white" : "bg-surface-elevated text-muted-foreground"
                    }`}>{done ? <Check className="h-3 w-3" /> : i + 1}</div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${isNow ? "text-primary" : ""}`}>{s.name}</div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {s.resources.map(r => <span key={r} className="text-[10px] px-2 py-0.5 rounded-full bg-surface-elevated text-muted-foreground">{r}</span>)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button className="w-full mt-5"><Play className="h-3.5 w-3.5 inline mr-1" />Continue this path</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function Paths() {
  const { user, loading } = useRequireAuth();
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const generate = () => {
    if (!goal.trim()) return;
    setResult(`Roadmap for "${goal}": Start with fundamentals (4 weeks), build 3 projects (8 weeks), contribute to OSS (4 weeks), then apply for hackathons + internships. Mentor will tune this weekly.`);
  };

  if (loading || !user) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <FadeIn>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-secondary/15 grid place-items-center text-secondary"><MapIcon className="h-5 w-5" /></div>
            <h1 className="font-display font-bold text-3xl">Learning Paths</h1>
          </div>
          <p className="text-muted-foreground">AI-generated roadmaps. Built around your goals.</p>
        </FadeIn>

        <Card className="mt-6">
          <h2 className="font-display font-semibold text-lg flex items-center gap-2"><Sparkles className="h-4 w-4 text-warning" />Generate my path</h2>
          <div className="flex gap-2 mt-4">
            <Input value={goal} onChange={e => setGoal(e.target.value)} placeholder="e.g. Become an AI Engineer" />
            <Button onClick={generate}>✨ Generate</Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {SUGGESTIONS.map(s => <Pill key={s} onClick={() => setGoal(s)}>{s}</Pill>)}
          </div>
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-lg border border-primary bg-primary/5 text-sm">
              {result}
            </motion.div>
          )}
        </Card>

        <h2 className="font-display font-bold text-xl mt-10 mb-4">Popular paths</h2>
        <div className="space-y-3">
          {PATHS.map(p => <PathCard key={p.id} p={p} />)}
        </div>
      </div>
    </div>
  );
}
