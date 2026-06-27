import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/dashboard", label: "Feed" },
  { to: "/hackathons", label: "Hackathons" },
  { to: "/finance", label: "Finance" },
  { to: "/paths", label: "Paths" },
  { to: "/mentor", label: "Mentor" },
] as const;

function initials(name?: string | null) {
  if (!name) return "U";
  return name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 glass-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center text-white font-bold font-display">N</div>
          <span className="font-display font-bold text-lg"><span className="text-foreground">Next</span><span className="text-primary">Gen</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => {
            const active = pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 relative">
          <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-white text-sm font-semibold">
            {initials(user?.user_metadata?.full_name || user?.email)}
          </div>
          <button
            onClick={() => setOpen(o => !o)}
            className="h-9 w-9 grid place-items-center rounded-lg hover:bg-surface-elevated text-muted-foreground"
            aria-label="Menu"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-48 card-surface bg-surface-elevated overflow-hidden shadow-xl"
              >
                <Link to="/profile" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-surface">My Profile</Link>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-surface">Dashboard</Link>
                <div className="h-px bg-border" />
                <button onClick={handleSignOut} className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-surface">Sign out</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
