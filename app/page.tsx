"use client";

import { useState, useRef, useEffect } from "react";
import VideoPlayer from "./features/player/components/VideoPlayer";
import FileUpload from "./features/player/components/FileUpload";
import { Subtitle, parseSubtitles } from "./features/subtitles/subtitleParser";
import Button from "./components/ui/Button";
import Input from "./components/ui/Input";
import Switch from "./components/ui/Switch";
import { Link2, MonitorPlay, Captions } from "lucide-react";

export default function Home() {
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoUrlDraft, setVideoUrlDraft] = useState<string>("");
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setVideoUrl("");
    setVideoUrlDraft("");
  };

  const handleVideoUrlSubmit = (url: string) => {
    const trimmed = url.trim();
    setVideoUrl(trimmed);
    setVideoSrc("");
  };

  const handleSubtitleUpload = async (file: File) => {
    const text = await file.text();
    const parsed = parseSubtitles(text);
    setSubtitles(parsed);
  };

  const handleClearSubtitles = () => {
    setSubtitles([]);
  };

  const handleClearVideo = () => {
    setVideoSrc("");
    setVideoUrl("");
    setVideoUrlDraft("");
  };

  useEffect(() => {
    return () => {
      if (videoSrc.startsWith("blob:")) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [videoSrc]);

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [isFocusMode]);

  return (
    <div className={isFocusMode ? "min-h-screen bg-black" : "min-h-screen bg-[color:var(--background)]"}>
      {!isFocusMode && (
        <header className="sticky top-0 z-40">
          <div className="surface-glass">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-[color:var(--accent)]" />
                <span className="text-base font-bold tracking-wide text-white">Watchroom</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/50">Focus</span>
                <Switch checked={isFocusMode} onCheckedChange={() => setIsFocusMode(!isFocusMode)} />
              </div>
            </div>
          </div>
        </header>
      )}

      <main className={isFocusMode ? "" : "mx-auto w-full max-w-6xl px-4 pb-10 pt-6 sm:px-6"}>
        <div className={isFocusMode ? "" : "space-y-6"}>
          <section className={isFocusMode ? "" : "rounded-2xl surface-glass p-3"}>
            <VideoPlayer
              videoSrc={videoSrc}
              videoUrl={videoUrl}
              subtitles={subtitles}
              videoRef={videoRef}
              isFocusMode={isFocusMode}
            />
          </section>

          {!isFocusMode && (
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="surface rounded-2xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <MonitorPlay className="h-4 w-4 text-white/70" />
                    <h2 className="text-sm font-semibold">Local files</h2>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <span className="inline-flex items-center gap-1">
                      <Captions className="h-3.5 w-3.5" />
                      {subtitles.length ? `${subtitles.length} cues` : "No subtitles"}
                    </span>
                  </div>
                </div>

                <FileUpload
                  onVideoUpload={handleVideoUpload}
                  onSubtitleUpload={handleSubtitleUpload}
                  hasVideo={!!videoSrc || !!videoUrl}
                  hasSubtitles={subtitles.length > 0}
                  onClearVideo={handleClearVideo}
                  onClearSubtitles={handleClearSubtitles}
                />
              </div>

              <div className="surface rounded-2xl p-5">
                <div className="mb-4 flex items-center gap-2 text-white">
                  <Link2 className="h-4 w-4 text-white/70" />
                  <h2 className="text-sm font-semibold">External URL</h2>
                </div>

                <div className="space-y-3">
                  <Input
                    type="url"
                    placeholder="YouTube/Vimeo link or direct media URL (mp4/webm)"
                    value={videoUrlDraft}
                    onChange={(e) => setVideoUrlDraft(e.target.value)}
                  />

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleVideoUrlSubmit(videoUrlDraft)}
                      disabled={!videoUrlDraft.trim()}
                    >
                      Load
                    </Button>
                    {(!!videoSrc || !!videoUrl) && (
                      <Button type="button" variant="danger" onClick={handleClearVideo}>
                        Clear
                      </Button>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed text-white/55">
                    YouTube/Vimeo open in an embedded player. Some sites still block playback (CORS/DRM). Direct file URLs work best.
                  </p>
                </div>
              </div>
            </section>
          )}

          {isFocusMode && (
            <div className="fixed right-4 top-4 z-50">
              <Button variant="ghost" onClick={() => setIsFocusMode(false)}>
                Exit focus (Esc)
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
