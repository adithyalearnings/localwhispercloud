# Local Whisper Cloud

A browser-based transcription and writing workspace. Record from a microphone or upload audio, transcribe it with Groq's hosted Whisper API, and rephrase or summarize the result in a React interface.

> Important: despite the repository's name and some older in-app copy, this version is **not local or offline transcription**. Audio is sent directly from your browser to Groq for processing. Do not upload sensitive material unless you are comfortable with that data flow. The app currently stores your Groq API key in the browser's `localStorage`; use a key with limited access and avoid shared devices.

## What it does

- Audio upload and browser microphone recording
- Hosted Whisper transcription via Groq (default model: `whisper-large-v3`)
- Rephrase and summarize transcript text using Groq chat models
- Copy and PDF export, plus links/clipboard helpers for other writing tools
- Responsive UI built with React, TypeScript, Vite, Tailwind CSS and shadcn/ui

## Run locally

Requires Node.js and npm plus your own Groq API key.

```bash
git clone https://github.com/adithyalearnings/localwhispercloud.git
cd localwhispercloud
npm install
npm run dev
```

Open the local URL printed by Vite, then add your Groq key in Settings. `npm run build` produces the static site; `npm run preview` serves the build locally. No backend is bundled with this repository.

## Architecture and caveats

The browser calls `https://api.groq.com/openai/v1/audio/transcriptions` and `/chat/completions` directly. This means the key is available to code running in the browser, and recordings/transcripts leave the device for cloud processing. The existing UI and documentation also include older local/offline, ONNX and desktop-installer claims that do not match the current implementation; treat this README and the source as authoritative until those screens are corrected. This is a prototype, not a privacy-preserving local Whisper distribution.

## License

MIT — see [LICENSE](LICENSE).
