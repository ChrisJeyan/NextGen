import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { School, MapPin, GraduationCap, Github } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Avatar, Button, Card, FadeIn, Input, Pill, ProgressBar, Textarea } from "@/components/ui-bits";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/lib/auth";
import { useProfile, levelProgress } from "@/lib/profile";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

const ALL_SKILLS = ["React","Python","JavaScript","Flutter","Figma","Node.js","ML/AI","Rust","Java","C++","UI/UX","Data Science","Blockchain","Game Dev"];
const ALL_BADGES = [
  { emoji: "🚀", name: "First Ship" },
  { emoji: "🏆", name: "Hackathon Winner" },
  { emoji: "💰", name: "First Save" },
  { emoji: "🔥", name: "30-Day Streak" },
  { emoji: "🧠", name: "AI Builder" },
  { emoji: "🤝", name: "Co-Founder" },
];

function ProfilePage() {
  const { user, loading } = useRequireAuth();
  const { profile, refresh } = useProfile();
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState({ full_name: "", bio: "", skills: [] as string[], github_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setDraft({
      full_name: profile.full_name ?? "",
      bio: profile.bio ?? "",
      skills: profile.skills ?? [],
      github_url: profile.github_url ?? "",
    });
  }, [profile]);

  if (loading || !user || !profile) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading...</div>;

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update(draft).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile updated");
    setEdit(false);
    refresh();
  };

  const unlocked = new Set(profile.badges ?? []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4">
        <FadeIn>
          <Card>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="rounded-2xl bg-gradient-primary grid place-items-center text-white font-display font-bold text-3xl flex-shrink-0" style={{ width: 96, height: 96 }}>
                {(draft.full_name || "U").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div className="flex-1 w-full">
                {edit ? (
                  <Input value={draft.full_name} onChange={e => setDraft({ ...draft, full_name: e.target.value })} className="text-xl font-display font-bold" />
                ) : (
                  <h1 className="font-display font-bold text-2xl">{profile.full_name}</h1>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                  {profile.school && <span className="flex items-center gap-1"><School className="h-3 w-3" />{profile.school}</span>}
                  {profile.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{profile.city}</span>}
                  {profile.grade && <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{profile.grade}</span>}
                </div>
                <div className="mt-4 max-w-xs">
                  <div className="flex justify-between text-xs">
                    <span className="text-primary font-medium">Level {profile.level}</span>
                    <span className="text-muted-foreground">{profile.xp} XP</span>
                  </div>
                  <ProgressBar value={levelProgress(profile.xp, profile.level)} className="mt-1" />
                </div>
              </div>
              {edit ? (
                <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
              ) : (
                <Button variant="ghost" onClick={() => setEdit(true)}>Edit</Button>
              )}
            </div>
          </Card>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-display font-semibold mb-3">About</h3>
            {edit ? (
              <>
                <Textarea rows={3} value={draft.bio} onChange={e => setDraft({ ...draft, bio: e.target.value })} placeholder="Tell builders who you are..." />
                <Input className="mt-3" value={draft.github_url} onChange={e => setDraft({ ...draft, github_url: e.target.value })} placeholder="https://github.com/yourhandle" />
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">{profile.bio || "No bio yet."}</p>
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-1 mt-3"><Github className="h-3.5 w-3.5" />GitHub</a>
                )}
              </>
            )}
          </Card>

          <Card>
            <h3 className="font-display font-semibold mb-3">Skills</h3>
            {edit ? (
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map(s => (
                  <Pill key={s} active={draft.skills.includes(s)} onClick={() => setDraft({ ...draft, skills: draft.skills.includes(s) ? draft.skills.filter(x => x !== s) : [...draft.skills, s] })}>{s}</Pill>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {profile.skills?.length ? profile.skills.map(s => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">{s}</span>
                )) : <span className="text-sm text-muted-foreground">No skills added.</span>}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="font-display font-semibold mb-3">Active Goals</h3>
            <div className="space-y-3">
              {(profile.goals ?? []).length === 0 && <span className="text-sm text-muted-foreground">No goals yet.</span>}
              {(profile.goals ?? []).map((g, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs"><span>🎯 {g.name}</span><span className="text-muted-foreground">{g.progress}%</span></div>
                  <ProgressBar value={g.progress} className="mt-1" />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-display font-semibold mb-3">Badges</h3>
            <div className="grid grid-cols-3 gap-2">
              {ALL_BADGES.map(b => {
                const u = unlocked.has(b.name);
                return (
                  <div key={b.name} className={`card-surface !p-3 text-center ${u ? "" : "opacity-40"}`}>
                    <div className="text-2xl">{b.emoji}</div>
                    <div className="text-[11px] mt-1">{b.name}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
