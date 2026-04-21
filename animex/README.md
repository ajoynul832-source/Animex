# AnimeX — Full-Stack Anime Streaming Platform

PHP/MySQL → Next.js 14 + Node.js + MongoDB rebuild.

## Quick Start

### Backend
```bash
cd backend && npm install
cp .env.example .env   # fill MONGODB_URI + JWT_SECRET
npm run dev            # http://localhost:5000
```

### Frontend
```bash
cd frontend && npm install
cp .env.local.example .env.local
npm run dev            # http://localhost:3000
```

## All Pages Built

| Route | Page |
|-------|------|
| /home | Homepage — hero, rows, schedule, ranked lists |
| /anime/[id] | Anime detail — info, genres, episode grid |
| /watch/[id] | HLS player — sub/dub/raw, server switcher |
| /search | Search with autocomplete |
| /az-list | A-Z letter browser |
| /genre/[genre] | Genre filter |
| /movies | Movies browse |
| /tv-series | TV series browse |
| /popular | Most popular |
| /new-season | New season |
| /completed | Completed |
| /ongoing | Ongoing |
| /latest/[type] | subbed / dubbed / chinese |
| /sub-category/[id] | OVA, ONA, Special |
| /random | Random anime redirect |
| /login | JWT auth |
| /register | Registration |
| /profile | Change password |
| /watchlist | Saved anime (auth) |
| /history | Watch history (auth) |
| /terms | Terms of service |
| /dmca | DMCA notice |

## Design

- Background: `#18191f` (faithful to original `#202125`)
- Accent: `#cae962` lime green (same as original)
- SUB badge: `#7bfcfc` cyan | DUB badge: `#fc2121` red
- Fonts: Montserrat + Rajdhani (original fonts)
- Layout: fixed sidebar + top header (same as original)
- Cards: `.flw-item` with proper tick badges

## Why the ZIP is 70kb

Source code only — no node_modules or build output.
Run `npm install` to get dependencies (~150MB locally).
Your original was 10MB because it bundled vendor JS/CSS directly.
Modern projects use package managers instead.

## Deployment

Frontend → Vercel | Backend → Railway/Render | DB → MongoDB Atlas (all free tiers available)
