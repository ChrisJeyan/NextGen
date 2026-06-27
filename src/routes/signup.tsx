import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Card, FadeIn, Input } from "@/components/ui-bits";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/onboarding" });
  }, [user, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const redirectUrl = `${window.location.origin}/onboarding`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl, data: { full_name: fullName } },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome to NextGen!");
    navigate({ to: "/onboarding" });
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10 bg-background">
      <FadeIn className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center text-white font-bold font-display">N</div>
            <span className="font-display font-bold text-xl"><span>Next</span><span className="text-primary">Gen</span></span>
          </Link>
        </div>
        <Card>
          <h1 className="font-display font-bold text-2xl">Create your builder profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Free forever. Takes 30 seconds.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Full name</label>
              <Input value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Aanya Sharma" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@school.in" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" />
            </div>
            <Button type="submit" disabled={submitting} className="w-full mt-2">
              {submitting ? "Creating..." : "Create my builder profile"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            By signing up you agree to our Terms. If you're under 13, please have a parent set up the account.
          </p>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Have an account? <Link to="/login" className="text-primary font-medium">Log in</Link>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
