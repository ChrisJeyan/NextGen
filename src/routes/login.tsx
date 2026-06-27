import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Card, FadeIn, Input } from "@/components/ui-bits";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    navigate({ to: "/dashboard" });
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
          <h1 className="font-display font-bold text-2xl">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Let's keep building.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" disabled={submitting} className="w-full mt-2">
              {submitting ? "Logging in..." : "Log in"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            New here? <Link to="/signup" className="text-primary font-medium">Create an account</Link>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
