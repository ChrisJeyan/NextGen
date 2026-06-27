import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Bot, Heart, ArrowUpRight, Trophy, Coins, Map as MapIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Avatar, Button, Card, FadeIn, ProgressBar, Textarea } from "@/components/ui-bits";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/lib/auth";
import { useProfile, levelProgress } from "@/lib/profile";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

type Post = {
  id: string;
  user_id: string;
  content: string;
  type: string;
  likes: number;
  created_at: string;
  profile?: { full_name: string | null; grade: string | null; city: string | null } | null;
};

const POST_TYPES = [
  { id: "build", emoji: "🛠️", label: "Built something" },
  { id: "win", emoji: "🏆", label: "Won/Achieved" },
  { id: "learn", emoji: "📚", label: "Learned something" },
  { id: "finance", emoji: "💰", label: "Finance milestone" },
];

const typeColor: Record<string, string> = {
  build: "bg-primary/15 text-primary border-primary/30",
  win: "bg-warning/15 text-warning border-warning/30",
  learn: "bg-secondary/15 text-secondary border-secondary/30",
  finance: "bg-success/15 text-success border-success/30",
};

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Dashboard() {
  const { user, loading } = useRequireAuth();
  const { profile } = useProfile();
  const [tab, setTab] = useState<"foryou" | "builders">("foryou");
  const [posts, setPosts] = useState<Post[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [content, setContent] = useState("");
  const [type, setType] = useState("build");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: postRows } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(50);
      if (!postRows) return;
      const ids = Array.from(new Set(postRows.map(p => p.user_id)));
      const { data: profs } = await supabase.from("profiles").select("id,full_name,grade,city").in("id", ids);
      const map = new Map((profs ?? []).map(p => [p.id, p]));
      setPosts(postRows.map(p => ({ ...p, profile: map.get(p.user_id) ?? null })) as Post[]);
    };
    load();
    const ch = supabase.channel("posts-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, async (payload) => {
        const np = payload.new as Post;
        const { data: prof } = await supabase.from("profiles").select("full_name,grade,city").eq("id", np.user_id).maybeSingle();
        setPosts(prev => [{ ...np, profile: prof ?? null }, ...prev]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "posts" }, (payload) => {
        const up = payload.new as Post;
        setPosts(prev => prev.map(p => p.id === up.id ? { ...p, likes: up.likes } : p));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  if (loading || !user) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading...</div>;

  const submitPost = async () => {
    if (!content.trim()) return;
    setPosting(true);
    const { error } = await supabase.from("posts").insert({ user_id: user.id, content: content.trim(), type });
    setPosting(false);
    if (error) { toast.error(error.message); return; }
    setContent(""); setComposerOpen(false);
    toast.success("Posted!");
  };

  const like = async (id: string) => {
    const { error } = await supabase.rpc("increment_post_likes", { post_id: id });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid lg:grid-cols-[260px_1fr_300px] gap-6">
        {/* LEFT */}
        <aside className="space-y-4">
          <Card>
            <div className="flex flex-col items-center text-center">
              <Avatar name={profile?.full_name} size={64} />
              <div className="font-display font-semibold mt-3">{profile?.full_name ?? "Builder"}</div>
              <div className="text-xs text-muted-foreground">{profile?.grade} {profile?.city ? `· ${profile.city}` : ""}</div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-primary">Level {profile?.level ?? 1}</span>
                <span className="text-muted-foreground">{profile?.xp ?? 0} XP</span>
              </div>
              <ProgressBar value={levelProgress(profile?.xp ?? 0, profile?.level ?? 1)} className="mt-2" />
            </div>
            {profile?.skills?.length ? (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {profile.skills.slice(0, 6).map(s => (
                  <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">{s}</span>
                ))}
              </div>
            ) : null}
          </Card>

          <Card>
            <h3 className="font-display font-semibold text-sm">Active Goals</h3>
            <div className="mt-3 space-y-3">
              {(profile?.goals?.length ? profile.goals : [{ name: "Set your first goal", progress: 0 }]).slice(0, 4).map((g, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs"><span>{g.name}</span><span className="text-muted-foreground">{g.progress}%</span></div>
                  <ProgressBar value={g.progress} className="mt-1" />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-display font-semibold text-sm mb-3">Quick links</h3>
            <div className="space-y-1.5">
              <Link to="/hackathons" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><Trophy className="h-4 w-4" />Hackathons</Link>
              <Link to="/finance" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><Coins className="h-4 w-4" />Finance Lab</Link>
              <Link to="/paths" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><MapIcon className="h-4 w-4" />Learning Paths</Link>
            </div>
          </Card>
        </aside>

        {/* CENTER */}
        <main className="space-y-4 min-w-0">
          <div className="flex gap-1 p-1 card-surface w-fit">
            <button onClick={() => setTab("foryou")} className={`px-4 py-1.5 rounded-md text-sm font-medium ${tab === "foryou" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>For You</button>
            <button onClick={() => setTab("builders")} className={`px-4 py-1.5 rounded-md text-sm font-medium ${tab === "builders" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Builders</button>
          </div>

          {/* composer */}
          <Card>
            <motion.div layout className="overflow-hidden">
              {!composerOpen ? (
                <button onClick={() => setComposerOpen(true)} className="w-full text-left text-muted-foreground text-sm py-1">
                  Share what you built, won, learned, or saved...
                </button>
              ) : (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {POST_TYPES.map(t => (
                      <button key={t.id} onClick={() => setType(t.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${type === t.id ? typeColor[t.id] : "bg-surface border-border text-muted-foreground"}`}>
                        {t.emoji} {t.label}
                      </button>
                    ))}
                  </div>
                  <Textarea value={content} onChange={e => setContent(e.target.value)} maxLength={500} rows={3} className="mt-3" placeholder="What's the update?" />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">{content.length}/500</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setComposerOpen(false); setContent(""); }}>Cancel</Button>
                      <Button size="sm" onClick={submitPost} disabled={posting || !content.trim()}>Post</Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </Card>

          {posts.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-5xl mb-3">🌱</div>
              <h3 className="font-display font-semibold text-lg">No posts yet — be the first!</h3>
              <Button className="mt-4" onClick={() => setComposerOpen(true)}>Write the first post</Button>
            </Card>
          ) : (
            <AnimatePresence>
              {posts.map(p => {
                const tdef = POST_TYPES.find(t => t.id === p.type);
                return (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card>
                      <div className="flex items-start gap-3">
                        <Avatar name={p.profile?.full_name} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="font-semibold text-sm">{p.profile?.full_name ?? "Builder"}</span>
                            {tdef && <span className={`text-[11px] px-2 py-0.5 rounded-full border ${typeColor[p.type]}`}>{tdef.emoji} {tdef.label}</span>}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {[p.profile?.grade, p.profile?.city, timeAgo(p.created_at)].filter(Boolean).join(" · ")}
                          </div>
                          <p className="text-sm mt-3 whitespace-pre-wrap">{p.content}</p>
                          <div className="flex items-center gap-3 mt-4 text-xs">
                            <button onClick={() => like(p.id)} className="flex items-center gap-1.5 text-muted-foreground hover:text-pink">
                              <Heart className="h-4 w-4" /> {p.likes}
                            </button>
                            <Link to="/mentor" className="flex items-center gap-1 text-primary hover:underline">
                              Ask mentor <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </main>

        {/* RIGHT */}
        <aside className="space-y-4">
          <Card>
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center text-white"><Bot className="h-4 w-4" /></div>
              <div>
                <div className="font-display font-semibold text-sm">AI Mentor</div>
                <div className="text-[11px] text-success flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Online</div>
              </div>
            </div>
            <p className="text-sm mt-3">Hey {profile?.full_name?.split(" ")[0] ?? "builder"} 👋</p>
            <div className="mt-3 space-y-2">
              {["Give me a project idea →","What hackathon should I join? →","Review my goals →"].map(q => (
                <Link key={q} to="/mentor" className="block text-xs text-muted-foreground hover:text-primary p-2 rounded bg-surface-elevated">{q}</Link>
              ))}
            </div>
            <Link to="/mentor"><Button className="w-full mt-3" size="sm">Open Mentor Chat</Button></Link>
          </Card>

          <Card>
            <h3 className="font-display font-semibold text-sm mb-3">Community</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total posts</span><span className="font-semibold">{posts.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Your level</span><span className="font-semibold text-primary">Lv {profile?.level ?? 1}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Your XP</span><span className="font-semibold">{profile?.xp ?? 0}</span></div>
            </div>
          </Card>

          <Card>
            <h3 className="font-display font-semibold text-sm mb-3">Post types</h3>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              {POST_TYPES.map(t => <div key={t.id}>{t.emoji} {t.label}</div>)}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
