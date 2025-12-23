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
}: {
  value: number[];
  min: number;
  max: number;
  step?: number;
  onValueChange: (value: number[]) => void;
  className?: string;
}) {
  return (
    <SliderPrimitive.Root
      value={value}
      min={min}
      max={max}
      step={step}
      onValueChange={onValueChange}
      className={[
        "relative flex w-full touch-none select-none items-center",
        className,
      ].join(" ")}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-white/15">
        <SliderPrimitive.Range className="absolute h-full bg-[color:var(--accent)]" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-3.5 w-3.5 rounded-full bg-white shadow ring-1 ring-black/30 transition-transform focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/60" />
    </SliderPrimitive.Root>
  );
}
