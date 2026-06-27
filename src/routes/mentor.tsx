import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Send } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Avatar, Card, FadeIn } from "@/components/ui-bits";
import { useRequireAuth } from "@/lib/auth";
import { useProfile } from "@/lib/profile";

export const Route = createFileRoute("/mentor")({ component: Mentor });

type Msg = { role: "user" | "ai"; text: string };

const QUICK = [
  { emoji: "💡", text: "Project idea for my skills" },
  { emoji: "🗺️", text: "Career roadmap" },
  { emoji: "🏆", text: "Find me hackathons" },
  { emoji: "📝", text: "Review my goals" },
  { emoji: "💰", text: "Finance advice" },
  { emoji: "🤝", text: "Find co-founders" },
];

const REPLIES = [
  "Great question! Based on your skills, I'd start by building a small MVP this weekend — ship before you polish.",
  "Here's the plan: pick one skill, go deep for 30 days, then publish a project demoing it. Builders ship.",
  "I'd recommend Smart India Hackathon Junior and ETHIndia for your stack. Both close in the next 60 days.",
  "Your goals look ambitious but feasible. Break each one into a 7-day micro-milestone and post the wins here.",
];

function Mentor() {
  const { user, loading } = useRequireAuth();
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);

  if (loading || !user) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading...</div>;

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
      setMessages(m => [...m, { role: "ai", text: reply }]);
      setThinking(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-4 flex-1 flex flex-col">
        <Card className="!p-4 flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center text-white"><Bot className="h-5 w-5" /></div>
          <div>
            <div className="font-display font-semibold">AI Mentor</div>
            <div className="text-xs text-success flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Online · Powered by Claude</div>
          </div>
        </Card>

        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {messages.length === 0 ? (
            <FadeIn>
              <div className="text-center py-10">
                <div className="text-5xl">👋</div>
                <h2 className="font-display font-bold text-2xl mt-3">Hey {profile?.full_name?.split(" ")[0] ?? "there"}!</h2>
                <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
                  I'm your AI mentor. Ask me anything about projects, hackathons, goals, or finance.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-6 max-w-xl mx-auto">
                  {QUICK.map(q => (
                    <button key={q.text} onClick={() => send(q.text)} className="card-surface !p-3 text-left text-sm hover:border-primary transition-colors">
                      <span className="mr-1.5">{q.emoji}</span>{q.text}
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>
          ) : (
            messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "ai" && <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center text-white flex-shrink-0"><Bot className="h-4 w-4" /></div>}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user" ? "bg-primary text-primary-foreground" : "bg-surface-elevated"
                }`}>{m.text}</div>
                {m.role === "user" && <Avatar name={profile?.full_name} size={32} />}
              </motion.div>
            ))
          )}
          {thinking && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center text-white"><Bot className="h-4 w-4" /></div>
              <div className="bg-surface-elevated rounded-2xl px-4 py-3 flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="sticky bottom-0 bg-background pt-2">
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
            <input
              value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-surface border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
            <button type="submit" className="h-10 w-10 grid place-items-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"><Send className="h-4 w-4" /></button>
          </form>
          <p className="text-[11px] text-muted-foreground text-center mt-2">AI mentor may make mistakes. Always verify important information.</p>
        </div>
      </div>
    </div>
  );
}
