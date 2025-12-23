import ReactPlayer from "react-player";

export function isDirectMediaUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("blob:")) return true;
  return /\.(mp4|webm|ogv|ogg)(\?|#|$)/i.test(url);
}

export function canReactPlayerPlay(url: string): boolean {
  const anyPlayer = ReactPlayer as unknown as { canPlay?: (u: string) => boolean };
  if (typeof anyPlayer.canPlay === "function") return anyPlayer.canPlay(url);
  return true;
}
