"use client";

import React from "react";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import Slider from "../../../components/ui/Slider";

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  onPlayPause: () => void;
  onTimelineChange: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onFullscreen: () => void;
  isFocusMode: boolean;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "00:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export default function VideoControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  onPlayPause,
  onTimelineChange,
  onVolumeChange,
  onToggleMute,
  onFullscreen,
  isFocusMode,
}: VideoControlsProps) {
  const clampedDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const clampedTime = Math.min(Math.max(currentTime, 0), clampedDuration || 0);

  return (
    <div className="space-y-3 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4">
      <Slider
        value={[clampedTime]}
        min={0}
        max={clampedDuration || 0}
        step={0.1}
        onValueChange={(v) => onTimelineChange(v[0] ?? 0)}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onPlayPause}
            className="text-white/95 transition-colors hover:text-white"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="text-white/95 transition-colors hover:text-white"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : volume < 0.5 ? (
                <Volume1 className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            <div className="w-28">
              <Slider
                value={[volume]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={(v) => onVolumeChange(v[0] ?? 0)}
              />
            </div>
          </div>

          <div className="text-xs font-mono text-white/70">
            {formatTime(clampedTime)} <span className="text-white/35">/</span> {formatTime(clampedDuration)}
          </div>
        </div>

        <button
          onClick={onFullscreen}
          className="text-white/95 transition-colors hover:text-white"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
