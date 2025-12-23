"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

export default function Switch({
  checked,
  onCheckedChange,
  className = "",
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={[
        "relative h-6 w-11 rounded-full border border-white/10",
        checked ? "bg-[color:var(--accent)]" : "bg-white/10",
        "transition-colors",
        className,
      ].join(" ")}
    >
      <SwitchPrimitive.Thumb
        className={[
          "block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5",
        ].join(" ")}
      />
    </SwitchPrimitive.Root>
  );
}
