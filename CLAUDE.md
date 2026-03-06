# TamaPR Website

## Project Overview
Ethical PR & Communications consultancy website for Tama Munira Wazome (Nairobi, Kenya).

## Tech Stack
- **Framework**: Astro 5.x with static output + server-rendered API routes
- **Styling**: Tailwind CSS 4.x via `@tailwindcss/vite` plugin
- **CMS**: Sanity.io v3 (project ID: `cjtepxlw`, dataset: `production`)
- **Hosting**: Vercel with `@astrojs/vercel` adapter
- **Email**: Resend API for contact form
- **Fonts**: Playfair Display (serif) + Inter (sans) via Google Fonts CDN

## Project Structure
```
src/
  assets/images/     # Static images (hero, portrait, logo)
  components/        # Reusable Astro components
  layouts/           # BaseLayout, BlogLayout
  lib/sanity.ts      # Sanity client + image URL builder
  pages/             # File-based routing
    api/             # Server-rendered API routes (prerender = false)
    insights/        # Blog posts and video series
    projects/        # Case study pages
  styles/global.css  # Tailwind theme + animation systems
sanity/              # Sanity Studio (separate workspace)
```

## Key Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
cd sanity && npx sanity dev   # Run Sanity Studio
```

## Design Tokens
- Navy: #1B2A4A, Terracotta: #B85C3C, Olive: #6B7F3B, Amber: #D4A843
- Cream: #F5F0E8, Warm White: #FDFBF7

## Animation Systems
11 animation systems defined in global.css: Page Loader, Custom Cursor, Letter-by-letter, Parallax, Scroll Reveal (IntersectionObserver, threshold 0.12), Magnetic Buttons (0.15 multiplier), Pillar hover-invert, Process hover-invert, Service border animation, Counter animation, Reading progress bar.

## Important Notes
- API routes (`api/contact.ts`, `api/newsletter.ts`) use `export const prerender = false`
- Sanity image URL builder uses named export `createImageUrlBuilder`
- Tailwind v4 uses `@theme` blocks in CSS (not `tailwind.config.js`)
- All content is from `TamaPR.txt` reference document
