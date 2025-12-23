# Watchroom

A modern, browser-based video player built with Next.js and Tailwind CSS. Designed for friends and couples to watch together on one screen.

## Features

### Playback
- Local file playback (MP4/WebM/OGV)
- External URLs:
  - Direct media URLs play in the native HTML5 `<video>` element
  - YouTube/Vimeo links open via an embedded player (`react-player`)
- Subtitles: SRT + VTT upload and render
- Controls: play/pause, seek, volume, mute, fullscreen, time display

### Focus mode
- Turns the page into a clean, cinema-style player
- Controls auto-hide after a short idle while playing
- Press `Esc` to exit focus mode

### UI
- Dark, cinematic theme with subtle “date night” glow
- Responsive layout

## Getting started

### Prerequisites
- Node.js 18+ (with npm or yarn)

### Installation

1. Navigate to the project:
```bash
cd video-player-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open `http://localhost:3000`

### Build for production

```bash
npm run build
npm start
```

## How to use

### Load a video
- Local: use the “Local files” picker
- External URL: paste a URL and click “Load”

### Add subtitles
- Upload an `.srt` or `.vtt` file
- Subtitles render on top of the video (Netflix-like style)

### Keyboard shortcuts
- `Space`: play/pause
- `F`: fullscreen
- `M`: mute
- `←` / `→`: seek 5 seconds
- `↑` / `↓`: volume

## Project structure

```
app/
├── features/
│   ├── player/
│   │   ├── components/      # Player UI components
│   │   ├── hooks/           # Player state + behavior (logic)
│   │   └── utils/           # Source detection helpers
│   └── subtitles/           # SRT/VTT parsing + types
├── components/ui/           # Shared UI primitives
├── page.tsx                 # Single-page app shell
├── layout.tsx               # Root layout
└── globals.css              # Theme + global styles
```

## Notes / limitations
- Many websites cannot be played in a browser video element due to CORS/DRM.
- For best results, use direct media URLs (`.mp4`, `.webm`) or upload a local file.

## Tech

### Technologies Used
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- `react-player` for embedded sources (YouTube/Vimeo)

### Client-Side Only
All functionality is handled on the client-side:
- No backend server required
- All video processing happens in the browser
- Subtitle parsing is done locally
- No data is sent to external servers

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 📝 Subtitle Format Support

### SRT Format
```
1
00:00:00,000 --> 00:00:05,000
First subtitle line

2
00:00:05,000 --> 00:00:10,000
Second subtitle line
```

### VTT Format
```
WEBVTT

00:00:00.000 --> 00:00:05.000
First subtitle line

00:00:05.000 --> 00:00:10.000
Second subtitle line
```

## 🔄 Component Architecture

### VideoPlayer
- Main container for video playback
- Handles video element and refs
- Manages subtitle display
- Coordinates with VideoControls

### VideoControls
- Playback timeline and scrubbing
- Volume control
- Time display
- Fullscreen toggle
- Custom styled range inputs

### FileUpload
- Video file upload interface
- Subtitle file upload interface
- File state management
- Clear/Reset functionality

### ControlPanel
- Focus mode toggle
- Keyboard shortcuts reference
- Feature overview
- Subtitle status display

## Docker

Build and run:

```bash
docker build -t watchroom .
docker run --rm -p 3000:3000 watchroom
```
