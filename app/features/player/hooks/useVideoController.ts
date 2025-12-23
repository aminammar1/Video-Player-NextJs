"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import { getCurrentSubtitle, type Subtitle } from "../../subtitles/subtitleParser";
import { canReactPlayerPlay, isDirectMediaUrl } from "../utils/mediaSource";

export interface UseVideoControllerArgs {
  videoSrc: string;
  videoUrl: string;
  subtitles: Subtitle[];
  videoRef: React.RefObject<HTMLVideoElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isFocusMode: boolean;
}

export function useVideoController({
  videoSrc,
  videoUrl,
  subtitles,
  videoRef,
  containerRef,
  isFocusMode,
}: UseVideoControllerArgs) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [lastNonZeroVolume, setLastNonZeroVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [playbackError, setPlaybackError] = useState<string>("");

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const videoSourceUrl = videoSrc || videoUrl;
  const shouldUseEmbedPlayer =
    !!videoUrl && !isDirectMediaUrl(videoUrl) && canReactPlayerPlay(videoUrl);

  useEffect(() => {
    if (subtitles.length > 0) {
      setCurrentSubtitle(getCurrentSubtitle(subtitles, currentTime));
    } else {
      setCurrentSubtitle("");
    }
  }, [currentTime, subtitles]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

    if (isPlaying && isFocusMode) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      void videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (e?: React.SyntheticEvent<HTMLVideoElement>) => {
    const nextTime = e?.currentTarget?.currentTime ?? videoRef.current?.currentTime;
    if (typeof nextTime === "number" && Number.isFinite(nextTime)) setCurrentTime(nextTime);
  };

  const handleLoadedMetadata = (e?: React.SyntheticEvent<HTMLVideoElement>) => {
    const nextDuration = e?.currentTarget?.duration ?? videoRef.current?.duration;
    if (typeof nextDuration === "number" && Number.isFinite(nextDuration)) setDuration(nextDuration);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) videoRef.current.volume = newVolume;
    if (newVolume > 0) setLastNonZeroVolume(newVolume);
  };

  const handleToggleMute = () => {
    if (volume === 0) {
      handleVolumeChange(lastNonZeroVolume || 1);
    } else {
      handleVolumeChange(0);
    }
  };

  const handleTimelineChange = (newTime: number) => {
    setCurrentTime(newTime);
    if (videoRef.current) videoRef.current.currentTime = newTime;
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || target?.isContentEditable;
      if (isTyping) return;

      if (!videoRef.current) return;

      if (e.key === " ") {
        e.preventDefault();
        handlePlayPause();
        return;
      }

      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        handleFullscreen();
        return;
      }

      if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        handleToggleMute();
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleTimelineChange(Math.max(0, currentTime - 5));
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleTimelineChange(Math.min(duration || 0, currentTime + 5));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        handleVolumeChange(Math.min(1, Math.round((volume + 0.1) * 10) / 10));
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        handleVolumeChange(Math.max(0, Math.round((volume - 0.1) * 10) / 10));
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentTime, duration, volume, isPlaying]);

  return {
    videoSourceUrl,
    shouldUseEmbedPlayer,

    isPlaying,
    currentTime,
    duration,
    volume,
    isFullscreen,
    showControls,
    currentSubtitle,
    playbackError,

    setIsPlaying,
    setShowControls,
    setPlaybackError,

    handleMouseMove,
    handlePlayPause,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleTimelineChange,
    handleVolumeChange,
    handleToggleMute,
    handleFullscreen,
  };
}
