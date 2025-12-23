"use client";

import * as React from "react";

type Variant = "primary" | "ghost" | "danger";

type Size = "sm" | "md";

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

  const sizes: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  };

  const variants: Record<Variant, string> = {
    primary:
      "bg-[color:var(--accent)] text-white hover:brightness-90",
    ghost:
      "bg-white/5 text-white hover:bg-white/10 border border-white/10",
    danger:
      "bg-red-500/15 text-red-200 hover:bg-red-500/25 border border-red-500/20",
  };

  return (
    <button
      className={[base, sizes[size], variants[variant], className].join(" ")}
      {...props}
    />
  );
}
