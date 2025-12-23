"use client";

import React, { useRef, useState } from "react";
import { FileVideo2, Captions, Trash2, UploadCloud } from "lucide-react";
import Button from "../../../components/ui/Button";

interface FileUploadProps {
  onVideoUpload: (file: File) => void;
  onSubtitleUpload: (file: File) => void;
  hasVideo: boolean;
  hasSubtitles: boolean;
  onClearVideo: () => void;
  onClearSubtitles: () => void;
}

export default function FileUpload({
  onVideoUpload,
  onSubtitleUpload,
  hasVideo,
  hasSubtitles,
  onClearVideo,
  onClearSubtitles,
}: FileUploadProps) {
  const videoInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [subtitleFileName, setSubtitleFileName] = useState("");

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFileName(file.name);
      onVideoUpload(file);
    }
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubtitleFileName(file.name);
      onSubtitleUpload(file);
    }
  };

  const handleClearVideo = () => {
    setVideoFileName("");
    onClearVideo();
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleClearSubtitles = () => {
    setSubtitleFileName("");
    onClearSubtitles();
    if (subtitleInputRef.current) subtitleInputRef.current.value = "";
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-xs font-medium text-white/70">Video</label>
        <div className="flex gap-2">
          <div
            onClick={() => videoInputRef.current?.click()}
            className="group flex-1 cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/7"
          >
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg,.mp4,.webm,.ogv"
              onChange={handleVideoChange}
              className="hidden"
            />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/7">
                {videoFileName ? (
                  <FileVideo2 className="h-4 w-4 text-white/75" />
                ) : (
                  <UploadCloud className="h-4 w-4 text-white/75" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-white">
                  {videoFileName ? videoFileName : "Choose a video file"}
                </p>
                <p className="text-xs text-white/45">MP4, WebM, OGV</p>
              </div>
            </div>
          </div>
          {hasVideo && (
            <Button type="button" variant="danger" onClick={handleClearVideo} className="shrink-0">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-white/70">Subtitles</label>
        <div className="flex gap-2">
          <div
            onClick={() => subtitleInputRef.current?.click()}
            className="group flex-1 cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/7"
          >
            <input
              ref={subtitleInputRef}
              type="file"
              accept=".srt,.vtt"
              onChange={handleSubtitleChange}
              className="hidden"
            />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/7">
                <Captions className="h-4 w-4 text-white/75" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm text-white">
                  {subtitleFileName ? subtitleFileName : "Add subtitles (optional)"}
                </p>
                <p className="text-xs text-white/45">SRT or VTT</p>
              </div>
            </div>
          </div>
          {hasSubtitles && (
            <Button type="button" variant="danger" onClick={handleClearSubtitles} className="shrink-0">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        <p className="mt-2 text-xs text-white/45">Subtitle timing must match the video.</p>
      </div>
    </div>
  );
}
