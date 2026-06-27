import { motion } from "framer-motion";
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "success" | "danger" | "secondary";
  size?: "sm" | "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", children, ...rest },
  ref,
) {
  const sizes: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  const variants: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-white hover:bg-secondary/90",
    ghost: "bg-transparent border border-border text-foreground hover:bg-surface-elevated",
    success: "bg-success text-white hover:bg-success/90",
    danger: "bg-danger text-white hover:bg-danger/90",
  };
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
});

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className = "", ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 ${className}`}
      {...rest}
    />
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className = "", ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={`w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 resize-none ${className}`}
      {...rest}
    />
  );
});

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card-surface p-5 ${className}`}>{children}</div>;
}

export function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Pill({
  active,
  onClick,
  children,
  className = "",
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      type="button"
      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
        active
          ? "bg-primary/15 border-primary text-primary shadow-[0_0_20px_-5px_rgba(99,102,241,0.6)]"
          : "bg-surface border-border text-muted-foreground hover:text-foreground"
      } ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2 w-full bg-muted rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-full bg-gradient-primary"
      />
    </div>
  );
}

export function Avatar({ name, size = 40 }: { name?: string | null; size?: number }) {
  const init = (name || "U").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="rounded-full bg-gradient-primary grid place-items-center text-white font-semibold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {init}
    </div>
  );
}
