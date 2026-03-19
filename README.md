# Mutants & Monsters — Card Builder v3.0 (A.S.P.I.C.E. Edition)

A single-page web application for building two-sided game cards for the **Mutants & Monsters (M&M)** tabletop RPG. Built by Chaz with Claude.

## What It Does

Fill out one form — the app routes every field to the correct card face and updates both previews in real time.

## Two Card Faces

| Face | Name | Description |
|------|------|-------------|
| Front | **Threat Scan** | Combat glance: name, portrait, tagline, Level/HP/DEF bar, 2 primary attacks |
| Back | **Containment Dossier** | Full reference: A.S.P.I.C.E. stats, Tactical Profile, all attacks, Anomaly Manifestations, Special Traits, Origin File |

## Three Card Classes

| Class | Color | Emoji |
|-------|-------|-------|
| Mutant | Green `#4CAF50` | ☢️ |
| Monster | Amber `#D4842A` | 👾 |
| Character | Blue `#2980B9` | 🧑 |

## Features

- **Live Preview** — both card faces update on every keystroke
- **A.S.P.I.C.E. Attributes** — 6-stat system (Adaptability, Strength, Perception, Intellect, Constitution, Ego) with auto-calculated modifiers
- **Emoji Attack Picker** — 9 damage families, supports 1–2 emoji combos per attack
- **Image Upload** — drag-and-drop portrait for the Threat Scan
- **Export PNGs** — downloads `[name]_threat_scan.png` + `[name]_containment_dossier.png` at 2× resolution
- **Export PDF** — landscape US Letter page with both faces side-by-side
- **3 Sample Cards** — Radioactive Jackalope (Mutant), Sentinel Drone MK-IV (Monster), Sara Chen (Character)

## Tech Stack

- React 18 + Vite
- Tailwind CSS + CSS custom properties for class-color theming
- Fonts: Orbitron (headers), Share Tech Mono (stats)
- `html-to-image` for PNG capture
- `jsPDF` for PDF generation

## File Structure

```
webapp/src/
  types/card.ts              — CardData interface, CLASS_COLORS, getModifier, sample data
  components/mm/
    ThreatScan.tsx           — Front card face component
    ContainmentDossier.tsx   — Back card face component
    BuilderForm.tsx          — All form sections (Identity, Combat, A.S.P.I.C.E., Tactical, Narrative)
    HpBar.tsx                — Animated HP bar (green→yellow→red)
    EmojiPicker.tsx          — Attack family emoji dropdown
    ImageUpload.tsx          — Drag-and-drop portrait uploader
  utils/
    exportCard.ts            — html-to-image PNG export
    exportPdf.ts             — jsPDF landscape PDF export
  pages/Index.tsx            — Main app layout (form + dual preview)
```

## Future Roadmap

- Gemini image generation (portrait "Generate" tab)
- Card flip animation (CSS 3D transform)
- Card persistence (save/load from database)
- Multi-card PDF portfolio compiler (M&M Bestiary)
- Game table mode with WebSocket sync

## Railway Deployment

This monorepo deploys as **two separate Railway services** — one for the backend API and one for the frontend webapp.

### Setup

1. **Create a new Railway project** with two services:
   - **Backend service** — set the root directory to `/backend`
   - **Frontend service** — set the root directory to `/webapp`

2. **Add a Railway Postgres plugin** and connect it to the backend service. Railway auto-injects `DATABASE_URL`.

3. **Backend env vars:**
   - `PORT` — Railway sets this automatically
   - `RAILWAY_PUBLIC_DOMAIN` — (optional) auto-set by Railway, used for CORS

4. **Frontend env vars:**
   - `VITE_API_URL` — set to the backend service's Railway URL (e.g. `https://your-backend.up.railway.app`) after the first deploy

5. **Database migrations:** Run the following as a Railway deploy command for the backend service:
   ```
   bunx prisma migrate deploy
   ```

### How It Works

- Both services use Dockerfiles (`backend/Dockerfile`, `webapp/Dockerfile`)
- The backend runs Hono on Bun with Prisma (PostgreSQL)
- The frontend builds with Vite and is served as static files via `serve`
- CORS is configured to accept `*.railway.app` and `*.up.railway.app` origins
