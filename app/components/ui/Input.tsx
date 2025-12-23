"use client";

import * as React from "react";

export default function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/40",
        "outline-none focus:ring-2 focus:ring-[color:var(--accent)]/60 focus:border-transparent",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
