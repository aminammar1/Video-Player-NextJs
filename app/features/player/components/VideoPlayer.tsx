"use client";

import React, { useRef } from "react";
import ReactPlayer from "react-player";
import { Film, Play } from "lucide-react";

import VideoControls from "./VideoControls";
import { useVideoController } from "../hooks/useVideoController";
import type { Subtitle } from "../../subtitles/subtitleParser";

interface VideoPlayerProps {
  videoSrc: string;
  videoUrl: string;
  subtitles: Subtitle[];
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isFocusMode: boolean;
}

export default function VideoPlayer({
  videoSrc,
  videoUrl,
  subtitles,
  videoRef,
  isFocusMode,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    videoSourceUrl,
    shouldUseEmbedPlayer,
    isPlaying,
    currentTime,
    duration,
    volume,
    isFullscreen,
    isLooping,
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
    handleToggleLoop,
    handleFullscreen,
  } = useVideoController({
    videoSrc,
    videoUrl,
    subtitles,
    videoRef,
    containerRef,
    isFocusMode,
  });

  if (!videoSourceUrl) {
    return (
      <div className="w-full aspect-video rounded-xl bg-black/90 flex items-center justify-center border border-white/5">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10">
            <Film className="h-6 w-6 text-white/50" />
          </div>
          <p className="text-white/50 text-sm font-medium">Load a local file or paste a media URL</p>
          <p className="text-white/30 text-xs mt-1">Supports MP4, WebM, YouTube, Vimeo</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full bg-black overflow-hidden shadow-2xl shadow-black/50 transition-all duration-300 ${isFullscreen ? "fixed inset-0 z-50" : "rounded-xl"
        }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && isFocusMode && setShowControls(false)}
    >
      <div className="relative w-full aspect-video bg-black">
        {/* Video element / Embedded player */}
        {shouldUseEmbedPlayer ? (
          <ReactPlayer
            ref={videoRef as unknown as React.RefObject<HTMLVideoElement>}
            src={videoUrl}
            width="100%"
            height="100%"
            controls={false}
            className="w-full h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={() =>
              setPlaybackError(
                "This source can't be played here. Try a direct media URL (mp4/webm) or upload a local file."
              )
            }
            config={{
              youtube: {
                rel: 0,
              },
            }}
          />
        ) : (
          <video
            ref={videoRef}
            src={videoSourceUrl}
            loop={isLooping}
            className="w-full h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={() =>
              setPlaybackError(
                "The browser can't play this source. Many sites block video playback (CORS/DRM). Use a direct media URL (mp4/webm) or upload a file."
              )
            }
          />
        )}

        {/* Subtitles display */}
        {currentSubtitle && (
          <div
            className={`absolute left-0 right-0 px-6 text-center pointer-events-none transition-all duration-200 ${showControls ? "bottom-24" : "bottom-14"
              }`}
          >
            <p className="subtitle-netflix mx-auto max-w-[85%] whitespace-pre-wrap text-[18px] leading-relaxed sm:text-[20px]">
              {currentSubtitle}
            </p>
          </div>
        )}

        {/* Playback error */}
        {playbackError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-6">
            <div className="max-w-lg rounded-2xl border border-white/10 bg-black/80 p-6 text-center backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">Can&apos;t play this source</p>
              <p className="mt-2 text-xs leading-relaxed text-white/60">{playbackError}</p>
            </div>
          </div>
        )}

        {/* Click to play/pause */}
        <div
          className="absolute inset-0"
          onClick={handlePlayPause}
        />

        {/* Controls overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${showControls ? "opacity-100" : "opacity-0"
            }`}
        />

        <div
          className={`absolute inset-0 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"
            } ${isFocusMode && !showControls ? "pointer-events-none" : ""}`}
        >
          {/* Center play button overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={handlePlayPause}
                className="pointer-events-auto w-16 h-16 rounded-full bg-white/10 hover:bg-[color:var(--accent)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20 hover:border-transparent"
              >
                <Play className="h-7 w-7 text-white ml-0.5" fill="currentColor" />
              </button>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0">
            <VideoControls
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              isMuted={volume === 0}
              isFullscreen={isFullscreen}
              isLooping={isLooping}
              onPlayPause={handlePlayPause}
              onTimelineChange={handleTimelineChange}
              onVolumeChange={handleVolumeChange}
              onToggleMute={handleToggleMute}
              onToggleLoop={handleToggleLoop}
              onFullscreen={handleFullscreen}
              isFocusMode={isFocusMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
