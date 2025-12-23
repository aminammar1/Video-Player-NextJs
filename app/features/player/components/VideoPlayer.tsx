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
      <div className="w-full aspect-video rounded-xl bg-black/80 flex items-center justify-center border border-white/10">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
            <Film className="h-5 w-5 text-white/70" />
          </div>
          <p className="text-white/60 text-sm">Load a local file or paste a direct media URL</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full bg-black rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ${isFullscreen ? "fixed inset-0 rounded-none z-50" : ""
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
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-6">
            <div className="max-w-lg rounded-2xl border border-white/10 bg-black/70 p-5 text-center">
              <p className="text-sm font-semibold text-white">Can’t play this source</p>
              <p className="mt-2 text-xs leading-relaxed text-white/65">{playbackError}</p>
            </div>
          </div>
        )}

        {/* Controls overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"
            } ${isFocusMode && !showControls ? "pointer-events-none" : ""}`}
        >
          {/* Play button overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayPause}
                className="w-20 h-20 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-105 border border-white/15"
              >
                <Play className="h-9 w-9 text-white" fill="currentColor" />
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
              onPlayPause={handlePlayPause}
              onTimelineChange={handleTimelineChange}
              onVolumeChange={handleVolumeChange}
              onToggleMute={handleToggleMute}
              onFullscreen={handleFullscreen}
              isFocusMode={isFocusMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
