"use client";

import React from "react";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
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
  isLooping: boolean;
  onPlayPause: () => void;
  onTimelineChange: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleLoop: () => void;
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
  isLooping,
  onPlayPause,
  onTimelineChange,
  onVolumeChange,
  onToggleMute,
  onToggleLoop,
  onFullscreen,
  isFocusMode,
}: VideoControlsProps) {
  const clampedDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const clampedTime = Math.min(Math.max(currentTime, 0), clampedDuration || 0);

  return (
    <div className="space-y-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-3 pt-8">
      <Slider
        value={[clampedTime]}
        min={0}
        max={clampedDuration || 0}
        step={0.1}
        onValueChange={(v) => onTimelineChange(v[0] ?? 0)}
        variant="timeline"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onPlayPause}
            className="text-white transition-all hover:scale-110"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" fill="currentColor" />
            ) : (
              <Play className="h-6 w-6" fill="currentColor" />
            )}
          </button>

          <button
            onClick={() => onTimelineChange(Math.max(0, currentTime - 10))}
            className="text-white/80 transition-all hover:text-white hover:scale-110"
            title="Rewind 10s"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          <button
            onClick={() => onTimelineChange(Math.min(clampedDuration, currentTime + 10))}
            className="text-white/80 transition-all hover:text-white hover:scale-110"
            title="Forward 10s"
          >
            <SkipForward className="h-5 w-5" />
          </button>

          <div className="group flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className="text-white/80 transition-all hover:text-white hover:scale-110"
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
            <div className="w-0 overflow-hidden transition-all duration-300 group-hover:w-24">
              <Slider
                value={[volume]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={(v) => onVolumeChange(v[0] ?? 0)}
              />
            </div>
          </div>

          <div className="ml-1 text-xs font-mono font-medium text-white/70">
            {formatTime(clampedTime)} <span className="text-white/30">/</span> {formatTime(clampedDuration)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLoop}
            className={`transition-all hover:scale-110 ${isLooping ? "text-[color:var(--accent)] hover:text-red-400" : "text-white/80 hover:text-[color:var(--accent)]"}`}
            title={isLooping ? "Disable loop" : "Enable loop"}
          >
            <Repeat className="h-5 w-5" />
          </button>

          <button
            onClick={onFullscreen}
            className="text-white/80 transition-all hover:text-white hover:scale-110"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
