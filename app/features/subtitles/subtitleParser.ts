export interface Subtitle {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
}

function timeToSeconds(raw: string): number {
  // Supports:
  // - SRT: 00:01:02,500
  // - VTT: 00:01:02.500
  // - VTT (no hours): 01:02.500
  const timeString = raw.trim().replace(/\s+/g, "");
  if (!timeString) return 0;

  const parts = timeString.split(":");
  const hasHours = parts.length === 3;

  const hours = hasHours ? parseInt(parts[0] ?? "0", 10) : 0;
  const minutes = parseInt(parts[hasHours ? 1 : 0] ?? "0", 10);
  const secondsPart = parts[hasHours ? 2 : 1] ?? "0";

  const [secondsStr, msStr] = secondsPart.split(/[\.,]/);
  const seconds = parseInt(secondsStr ?? "0", 10);
  const milliseconds = msStr ? parseInt(msStr.padEnd(3, "0").slice(0, 3), 10) : 0;

  const safeHours = Number.isFinite(hours) ? hours : 0;
  const safeMinutes = Number.isFinite(minutes) ? minutes : 0;
  const safeSeconds = Number.isFinite(seconds) ? seconds : 0;
  const safeMs = Number.isFinite(milliseconds) ? milliseconds : 0;

  return safeHours * 3600 + safeMinutes * 60 + safeSeconds + safeMs / 1000;
}

export function parseSubtitles(content: string): Subtitle[] {
  const subtitles: Subtitle[] = [];

  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  if (normalized.includes("WEBVTT")) {
    const lines = normalized.split("\n");
    let i = 0;
    let id = 0;

    while (i < lines.length) {
      const line = lines[i].trim();

      if (line.includes("-->")) {
        const timeParts = line.split("-->");
        const startTime = timeToSeconds(timeParts[0].trim());
        const endTime = timeToSeconds(timeParts[1].trim().split(" ")[0]);

        let text = "";
        i++;
        while (i < lines.length && lines[i].trim() && !lines[i].includes("-->")) {
          if (text) text += "\n";
          text += lines[i].trim();
          i++;
        }

        if (text) {
          subtitles.push({
            id: id++,
            startTime,
            endTime,
            text,
          });
        }
      } else {
        i++;
      }
    }
  } else {
    const blocks = normalized.split(/\n{2,}/);

    blocks.forEach((block, index) => {
      const lines = block.trim().split("\n");
      if (lines.length >= 3) {
        const timeLine = lines[1];
        if (timeLine.includes("-->")) {
          const timeParts = timeLine.split("-->");
          const startTime = timeToSeconds(timeParts[0].trim());
          const endTime = timeToSeconds(timeParts[1].trim());
          const text = lines.slice(2).join("\n");

          subtitles.push({
            id: index,
            startTime,
            endTime,
            text,
          });
        }
      }
    });
  }

  return subtitles;
}

export function getCurrentSubtitle(subtitles: Subtitle[], currentTime: number): string {
  const current = subtitles.find(
    (sub) => currentTime >= sub.startTime && currentTime <= sub.endTime
  );
  return current ? current.text : "";
}
