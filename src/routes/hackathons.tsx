import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Search, Calendar, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button, Card, FadeIn, Input, Pill } from "@/components/ui-bits";
import { useRequireAuth } from "@/lib/auth";

export const Route = createFileRoute("/hackathons")({ component: Hackathons });

const FILTERS = ["All","Online","Offline","Hybrid","AI","Web3","Students"];

type H = { id: string; title: string; org: string; mode: string; tags: string[]; date: string; prize: string; match: number; hot?: boolean; ai?: boolean };
const DATA: H[] = [
  { id: "1", title: "Smart India Hackathon Junior", org: "MoE · AICTE", mode: "Hybrid", tags: ["AI","Students"], date: "12 Aug", prize: "₹5,00,000", match: 96, hot: true },
  { id: "2", title: "ETHIndia Builders", org: "Devfolio", mode: "Offline", tags: ["Web3"], date: "30 Sep", prize: "₹12,00,000", match: 78, ai: true },
  { id: "3", title: "GenAI Open", org: "TechCrunch India", mode: "Online", tags: ["AI"], date: "5 Sep", prize: "₹3,00,000", match: 91, hot: true },
  { id: "4", title: "Code for Bharat", org: "Govt of India", mode: "Offline", tags: ["Students"], date: "20 Oct", prize: "₹2,50,000", match: 84 },
  { id: "5", title: "Build4India Web3", org: "Polygon", mode: "Hybrid", tags: ["Web3","AI"], date: "1 Nov", prize: "₹8,00,000", match: 72, ai: true },
  { id: "6", title: "Hack the Future", org: "MLH India", mode: "Online", tags: ["Students","AI"], date: "15 Dec", prize: "₹4,00,000", match: 88 },
];

function Hackathons() {
  const { user, loading } = useRequireAuth();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => DATA.filter(h => {
    const matchesQ = h.title.toLowerCase().includes(q.toLowerCase()) || h.org.toLowerCase().includes(q.toLowerCase());
    const matchesF = filter === "All" || h.mode === filter || h.tags.includes(filter);
    return matchesQ && matchesF;
  }), [q, filter]);

  if (loading || !user) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading...</div>;

  const matchColor = (m: number) => m >= 90 ? "text-success" : m >= 80 ? "text-primary" : "text-warning";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <FadeIn>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-warning/15 grid place-items-center text-warning"><Trophy className="h-5 w-5" /></div>
            <h1 className="font-display font-bold text-3xl">Hackathons</h1>
          </div>
          <p className="text-muted-foreground">AI-matched to your skills. Apply before they close.</p>
        </FadeIn>

        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search hackathons..." className="pl-9" />
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {FILTERS.map(f => <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Pill>)}
        </div>

        {filtered.length === 0 ? (
          <Card className="mt-8 text-center py-12 text-muted-foreground">No hackathons found. Try a different filter.</Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {filtered.map((h, i) => (
              <FadeIn key={h.id} delay={i * 0.05}>
                <motion.div whileHover={{ y: -4 }}>
                  <Card>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {h.hot && <span className="text-[11px] px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30">🔥 Hot</span>}
                        {h.ai && !h.hot && <span className="text-[11px] px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/30">AI-matched for you</span>}
                        <h3 className="font-display font-semibold text-lg mt-2">{h.title}</h3>
                        <div className="text-xs text-muted-foreground">{h.org}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-display font-bold text-2xl ${matchColor(h.match)}`}>{h.match}%</div>
                        <div className="text-[10px] text-muted-foreground">match</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {h.tags.map(t => <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/15 text-primary">{t}</span>)}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{h.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{h.mode}</span>
                    </div>
                    <div className="text-success font-display font-bold text-xl mt-3">{h.prize}</div>
                    <div className="mt-4 flex gap-2">
                      <Button className="flex-1">View & Apply →</Button>
                      <Button
                        variant={saved.has(h.id) ? "success" : "ghost"}
                        onClick={() => setSaved(s => { const n = new Set(s); n.has(h.id) ? n.delete(h.id) : n.add(h.id); return n; })}
                      >
                        {saved.has(h.id) ? "✓ Saved" : "Save"}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
