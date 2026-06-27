import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Button, Card, Input, Pill, ProgressBar } from "@/components/ui-bits";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/lib/auth";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const GRADES = ["Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12","College Year 1","College Year 2"];
const SKILLS = ["React","Python","JavaScript","Flutter","Figma","Node.js","ML/AI","Rust","Java","C++","UI/UX","Data Science","Blockchain","Game Dev"];
const INTERESTS = ["Startups","Hackathons","Open Source","AI/ML","Web Dev","Mobile Apps","Finance","Design","Robotics","Space Tech","EdTech","HealthTech"];

function Onboarding() {
  const { user, loading } = useRequireAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [school, setSchool] = useState("");
  const [city, setCity] = useState("");
  const [grade, setGrade] = useState("Grade 9");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState("");
  const [goals, setGoals] = useState<{ name: string; progress: number }[]>([]);
  const [saving, setSaving] = useState(false);

  if (loading || !user) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading...</div>;

  const toggle = (arr: string[], v: string, set: (s: string[]) => void) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const addGoal = () => {
    if (!goalInput.trim() || goals.length >= 5) return;
    setGoals([...goals, { name: goalInput.trim(), progress: 0 }]);
    setGoalInput("");
  };

  const finish = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      school, city, grade, skills, interests, goals,
    }).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile saved! Welcome to NextGen 🚀");
    navigate({ to: "/dashboard" });
  };

  const next = () => setStep(s => Math.min(4, s + 1));
  const back = () => setStep(s => Math.max(0, s - 1));

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Step {step + 1} of 5</span><span>{Math.round(((step + 1) / 5) * 100)}%</span>
          </div>
          <ProgressBar value={((step + 1) / 5) * 100} />
        </div>

        <Card className="min-h-[420px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              {step === 0 && (
                <div className="text-center py-6">
                  <div className="text-6xl mb-4">🚀</div>
                  <h2 className="font-display font-bold text-3xl">Welcome, builder.</h2>
                  <p className="text-muted-foreground mt-3">Let's set up your profile in 5 quick steps so we can match you with the right hackathons, paths, and mentors.</p>
                </div>
              )}
              {step === 1 && (
                <div>
                  <h2 className="font-display font-bold text-2xl">About you</h2>
                  <p className="text-muted-foreground text-sm mt-1">Just the basics.</p>
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground">School / College</label>
                      <Input value={school} onChange={e => setSchool(e.target.value)} placeholder="DPS R.K. Puram" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">City</label>
                      <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Bengaluru" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Grade</label>
                      <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm">
                        {GRADES.map(g => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <h2 className="font-display font-bold text-2xl">What can you build?</h2>
                  <p className="text-muted-foreground text-sm mt-1">Tap your skills. Honest beats impressive.</p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {SKILLS.map(s => (
                      <Pill key={s} active={skills.includes(s)} onClick={() => toggle(skills, s, setSkills)}>{s}</Pill>
                    ))}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div>
                  <h2 className="font-display font-bold text-2xl">What excites you?</h2>
                  <p className="text-muted-foreground text-sm mt-1">Pick anything you'd love to explore.</p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {INTERESTS.map(s => (
                      <Pill key={s} active={interests.includes(s)} onClick={() => toggle(interests, s, setInterests)}>{s}</Pill>
                    ))}
                  </div>
                </div>
              )}
              {step === 4 && (
                <div>
                  <h2 className="font-display font-bold text-2xl">Your goals</h2>
                  <p className="text-muted-foreground text-sm mt-1">Up to 5. We'll track them with you.</p>
                  <div className="flex gap-2 mt-6">
                    <Input value={goalInput} onChange={e => setGoalInput(e.target.value)} placeholder="Ship my first app" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addGoal())} />
                    <Button onClick={addGoal} disabled={goals.length >= 5}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {goals.map((g, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-full bg-primary/15 border border-primary/40 text-primary text-sm flex items-center gap-2">
                        {g.name}
                        <button onClick={() => setGoals(goals.filter((_, j) => j !== i))} className="text-primary/70 hover:text-primary"><X className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 pt-6 border-t border-border flex justify-between">
            <Button variant="ghost" onClick={back} disabled={step === 0}>Back</Button>
            {step < 4 ? (
              <Button onClick={next}>Continue →</Button>
            ) : (
              <Button onClick={finish} disabled={saving}>{saving ? "Saving..." : "🚀 Enter NextGen"}</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
