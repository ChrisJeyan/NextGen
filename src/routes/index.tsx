import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Rocket, Trophy, Coins, Bot, Map, Users, Sparkles } from "lucide-react";
import { Button, FadeIn } from "@/components/ui-bits";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  { icon: Rocket, title: "Builder Profile", desc: "Showcase your projects, skills, and wins. One link, everything you've built." },
  { icon: Trophy, title: "Hackathon Hub", desc: "AI-matched hackathons across India — online, offline, hybrid." },
  { icon: Coins, title: "Finance Lab", desc: "Learn saving, SIPs, and budgeting through daily decision challenges." },
  { icon: Bot, title: "AI Mentor", desc: "24/7 mentor that knows your skills, goals, and helps you ship faster." },
  { icon: Map, title: "Learning Paths", desc: "AI-generated roadmaps to become an AI engineer, app dev, or anything." },
  { icon: Users, title: "Find Co-Founders", desc: "Match with builders who share your stack and ambition." },
];

const stats = [
  { v: "10K+", l: "Young Builders" },
  { v: "500+", l: "Hackathons Listed" },
  { v: "₹2Cr+", l: "Prizes Discovered" },
];

const samplePosts = [
  { emoji: "🏆", who: "Aanya, Grade 11", text: "Won 1st place at SIH Junior with my AI homework helper. 6 months of grinding paid off." },
  { emoji: "💰", who: "Rohan, Grade 9", text: "Saved ₹5000 from tuition money — started my first SIP today. Big move for a 14-year-old." },
  { emoji: "🚀", who: "Krish, College Y1", text: "Shipped my first app to Play Store. 200 downloads in 48 hours. Building > studying." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* nav */}
      <header className="sticky top-0 z-50 glass-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center text-white font-bold font-display">N</div>
            <span className="font-display font-bold text-lg"><span className="text-foreground">Next</span><span className="text-primary">Gen</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link to="/signup"><Button size="sm">Start free</Button></Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-40 right-10 h-64 w-64 rounded-full bg-pink/20 blur-[100px]" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground mb-6">
              <Sparkles className="h-3 w-3 text-warning" /> Built for India's 13–18
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display font-bold text-5xl sm:text-7xl leading-[1.05] tracking-tight">
              Your skills define <br />
              <span className="text-gradient">your future</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              NextGen is where India's young builders showcase projects, discover hackathons, master money, and find co-founders — before they turn 18.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link to="/signup"><Button size="lg">Start building free</Button></Link>
              <Link to="/login"><Button size="lg" variant="ghost">I have an account</Button></Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
              {stats.map(s => (
                <div key={s.l} className="text-center">
                  <div className="font-display font-bold text-2xl sm:text-3xl text-gradient">{s.v}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <FadeIn>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-center">Everything a young builder needs</h2>
          <p className="text-muted-foreground text-center mt-3">Six tools. One ridiculous unfair advantage.</p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.05}>
              <motion.div whileHover={{ y: -4 }} className="card-surface p-6 h-full">
                <div className="h-10 w-10 rounded-lg bg-primary/15 grid place-items-center text-primary mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* community */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <FadeIn>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-center">Real wins from real builders</h2>
        </FadeIn>
        <div className="grid sm:grid-cols-3 gap-4 mt-12">
          {samplePosts.map((p, i) => (
            <FadeIn key={p.who} delay={i * 0.1}>
              <motion.div whileHover={{ y: -4 }} className="card-surface p-6 h-full">
                <div className="text-3xl mb-3">{p.emoji}</div>
                <p className="text-sm text-foreground">"{p.text}"</p>
                <div className="text-xs text-muted-foreground mt-4">— {p.who}</div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <FadeIn>
          <div className="card-surface p-10 text-center bg-gradient-primary border-0">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">Stop scrolling. Start building.</h2>
            <p className="mt-3 text-white/85">Free forever. Your future self will thank you.</p>
            <Link to="/signup" className="inline-block mt-6">
              <Button variant="ghost" size="lg" className="bg-white text-primary border-white hover:bg-white/90">Create my profile →</Button>
            </Link>
          </div>
        </FadeIn>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-primary grid place-items-center text-white text-xs font-bold">N</div>
            <span>© 2026 NextGen Builders</span>
          </div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
