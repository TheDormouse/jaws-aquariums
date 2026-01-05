# JAWS Aquariums — Developer Docs Home

This repo contains the JAWS Aquariums marketing/portfolio site built with Next.js and React Three Fiber. Production is hosted on Vercel; this README is the entry point for dev-oriented documentation.

## Status
- Live hosting: Vercel
- Hero design: ~50% — readability/CTA copy and transition cue between sections still in progress.
- Lower-page copy/layout: needs a wording/spacing pass for the Why Us and Contact areas; mobile fit under review.
- 3D scene: enhanced water/caustic shaders, ocean-floor depth, and a new aquarium GLB with fade-in; stable.

## Tech Stack
- Next.js 16 (App Router)
- React 19
- React Three Fiber + Drei + Three.js
- CSS Modules for page-level styling

## Getting Started
1) Install deps: `npm install`
2) Run dev server: `npm run dev`
3) Lint (Next.js rules): `npm run lint`

## Scripts
- `npm run dev` — start the Next.js dev server
- `npm run build` — production build
- `npm run start` — run the built app
- `npm run lint` — Next.js/ESLint

## Deployment (Vercel)
- Default: push to the tracked branch; Vercel builds and deploys automatically.
- Manual: `vercel --prod` (requires Vercel CLI auth and project linkage).
- Environment: no secrets required yet; add via Vercel dashboard if needed.

## Project Structure
- `app/` — App Router pages, layout, and styles
  - `page.js` / `page.module.css` — homepage and styling
  - `components/` — 3D scene (`Shark.jsx`), testimonials slider, logo, etc.
- `public/` — static assets (GLBs, images, fonts)
- `scripts/` — utility scripts (e.g., GLB inspection, image scraping)

## Working Notes
- CTA copy: align tone between phone/email CTAs; shorten subtitle for readability.
- Section transitions: add a natural scroll/snap or chevron cue from hero → services.
- Accessibility: verify color contrast on buttons/pills; confirm focus states after copy updates.


