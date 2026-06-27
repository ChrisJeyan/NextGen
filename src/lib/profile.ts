import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  school: string | null;
  city: string | null;
  grade: string | null;
  skills: string[];
  interests: string[];
  goals: { name: string; progress: number }[];
  xp: number;
  level: number;
  badges: string[];
  github_url: string | null;
  created_at: string;
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setProfile(null); setLoading(false); return; }
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (data) setProfile(data as unknown as Profile);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  return { profile, loading, refresh, setProfile };
}

export const xpToNextLevel = (level: number) => level * 500;
export const levelProgress = (xp: number, level: number) => {
  const need = xpToNextLevel(level);
  return Math.min(100, (xp / need) * 100);
};
