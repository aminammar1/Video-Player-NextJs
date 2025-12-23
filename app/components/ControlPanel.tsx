"use client";

import React from "react";
import Switch from "./ui/Switch";
import { Keyboard, Subtitles } from "lucide-react";

interface ControlPanelProps {
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  subtitleCount: number;
}

export default function ControlPanel({
  isFocusMode,
  onToggleFocusMode,
  subtitleCount,
}: ControlPanelProps) {
  return (
    <div className="surface rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-white">Focus mode</p>
          <p className="text-xs text-white/55">Hides panels. Controls auto-hide while playing.</p>
        </div>
        <Switch checked={isFocusMode} onCheckedChange={() => onToggleFocusMode()} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-white">
            <Subtitles className="h-4 w-4 text-white/70" />
            <span className="text-xs font-medium">Subtitles</span>
          </div>
          <p className="mt-1 text-xs text-white/55">
            {subtitleCount > 0 ? `${subtitleCount} cues loaded` : "None loaded"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-2 text-white">
            <Keyboard className="h-4 w-4 text-white/70" />
            <span className="text-xs font-medium">Shortcuts</span>
          </div>
          <p className="mt-1 text-xs text-white/55">Space, F, M, Arrows</p>
        </div>
      </div>
    </div>
  );
}
