"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

export default function Slider({
  value,
  min,
  max,
  step,
  onValueChange,
  className = "",
  variant = "default",
}: {
  value: number[];
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number[]) => void;
  className?: string;
  variant?: "default" | "timeline";
}) {
  const isTimeline = variant === "timeline";

  return (
    <SliderPrimitive.Root
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={onValueChange}
      className={[
        "group relative flex w-full touch-none select-none items-center",
        isTimeline ? "cursor-pointer py-1" : "",
        className,
      ].join(" ")}
    >
      <SliderPrimitive.Track
        className={[
          "relative w-full grow overflow-hidden rounded-full transition-all duration-200",
          isTimeline
            ? "h-1 group-hover:h-1.5 bg-white/20"
            : "h-1 bg-white/15",
        ].join(" ")}
      >
        <SliderPrimitive.Range className="absolute h-full bg-[color:var(--accent)]" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={[
          "block rounded-full bg-[color:var(--accent)] shadow-md transition-all duration-200 focus:outline-none",
          isTimeline
            ? "h-0 w-0 group-hover:h-3.5 group-hover:w-3.5"
            : "h-3 w-3 ring-1 ring-black/30 bg-white",
        ].join(" ")}
      />
    </SliderPrimitive.Root>
  );
}
