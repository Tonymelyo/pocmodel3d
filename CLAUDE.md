# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a POC (Proof of Concept) for an AI-powered terrain analysis platform that generates 3D models from 2D images and provides investment recommendations for real estate projects.

**Core workflow:**
1. User uploads a terrain photo + description (location, surface, constraints)
2. Backend generates a 3D model (.glb) via AI API (Tripo3D/Meshy/Luma)
3. Backend analyzes the terrain via GPT-4o (constraints, project recommendations, investor targets)
4. Frontend displays interactive 3D model + analysis report

## Development Commands

```bash
# Development server (with Turbopack)
npm run dev

# Production build (with Turbopack)
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture

### Tech Stack
- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript (strict mode enabled)
- **Tailwind CSS 4** with PostCSS plugin
- Uses `@/*` path alias for imports (maps to root directory)

### Planned Structure (not yet implemented)

```
app/
├── page.tsx                    # Main upload/analysis UI
├── layout.tsx                  # Root layout with Geist fonts
├── globals.css                 # Tailwind + theme variables
└── api/
    └── analyze-terrain/
        └── route.ts            # POST handler for terrain analysis

components/
├── ui/                         # shadcn/ui components
├── TerrainUploader.tsx         # File upload component
├── TerrainForm.tsx             # Terrain description form
├── ModelViewer.tsx             # React Three Fiber 3D viewer
└── AnalysisReport.tsx          # AI analysis display

lib/
├── ai/
│   ├── tripo3d.ts              # 3D generation API client
│   └── openai.ts               # GPT-4o vision analysis
└── utils.ts

types/
├── terrain.ts                  # Terrain data types
└── api.ts                      # API response types

public/
├── models/                     # Generated .glb files
└── examples/                   # Sample terrain photos
```

### Key Configuration

**TypeScript:** Strict mode enabled, path alias `@/*` maps to project root

**Tailwind CSS 4:** Uses inline `@theme` directive in `globals.css` with CSS variables for theming (`--background`, `--foreground`, `--font-sans`, `--font-mono`)

**Fonts:** Geist Sans and Geist Mono loaded via `next/font/google` in `app/layout.tsx`

**ESLint:** Flat config format using `FlatCompat` for Next.js rules (`next/core-web-vitals`, `next/typescript`)

## Environment Variables

Required API keys (add to `.env.local`):

```env
OPENAI_API_KEY=sk-...
TRIPO3D_API_KEY=...
# OR Meshy/Luma alternatives
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Important:** All `.env*` files are gitignored

## API Integration Notes

### `/api/analyze-terrain` workflow:
1. Accept multipart/form-data (photo + JSON description)
2. Call 3D generation API (async, may take 30s-2min)
3. Call OpenAI GPT-4o with vision (image + text context)
4. Return structured JSON: `{ modelUrl, analysis: { constraints, strengths, projects, investors, potential } }`

### Expected AI services:
- **3D Generation:** Tripo3D, Meshy, or Luma AI (image → .glb file)
- **Vision Analysis:** OpenAI GPT-4o (multimodal analysis of terrain photo + description)

## Styling Approach

- Tailwind CSS 4 with custom theme variables
- Dark mode via `prefers-color-scheme` media query
- Design system: Geist fonts, semantic color tokens (`background`, `foreground`)
- Future: shadcn/ui components for forms, buttons, cards

## Future Dependencies (to be added)

When implementing 3D visualization:
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Helpers (OrbitControls, etc.)
- `three` - 3D library

When implementing UI components:
- `shadcn/ui` - Copy components into `components/ui/`

When implementing API clients:
- OpenAI SDK or fetch to `https://api.openai.com/v1/chat/completions`
- Tripo3D/Meshy/Luma API client

## Development Notes

- **Turbopack enabled** for both dev and build (faster than webpack)
- Use App Router conventions (Server Components by default, add `'use client'` when needed)
- Store generated 3D models in `/public/models/` with unique IDs
- Handle async 3D generation with polling or webhooks
- TypeScript strict mode: no implicit any, strict null checks
