# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sports news media website with admin panel for content management. Built with Next.js 14+ App Router.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** NextAuth.js
- **Editor:** TipTap (WYSIWYG)

## Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema to database (no migrations)
npm run db:migrate   # Run migrations
npm run db:seed      # Seed initial data
npm run db:studio    # Open Prisma Studio
```

## Getting Started

1. Copy `.env` and configure `DATABASE_URL` for your PostgreSQL instance
2. Run `npm run db:push` to create database tables
3. Run `npm run db:seed` to create admin user and initial data
4. Login at `/admin/login` with `admin@sportsnews.com` / `admin123`

## Project Structure

```
src/
├── app/
│   ├── (main)/              # Public pages (layout with header/footer)
│   │   ├── page.tsx         # Homepage
│   │   ├── category/[slug]/ # Category pages
│   │   ├── article/[slug]/  # Article pages
│   │   ├── tag/[slug]/      # Tag pages
│   │   ├── search/          # Search page
│   │   └── page/[slug]/     # Static pages
│   ├── admin/
│   │   ├── login/           # Admin login
│   │   └── (dashboard)/     # Protected admin routes
│   │       ├── articles/    # Article management
│   │       ├── categories/  # Category management
│   │       └── tags/        # Tag management
│   ├── api/                 # API routes
│   ├── sitemap.ts           # Dynamic sitemap
│   └── robots.ts            # Robots.txt
├── components/
│   ├── admin/               # Admin components
│   ├── layout/              # Header, Footer, Sidebar
│   ├── news/                # Article cards, category grid
│   ├── providers/           # Session provider
│   └── ui/                  # Pagination, CookieConsent
├── lib/
│   ├── prisma.ts            # Prisma client
│   ├── auth.ts              # NextAuth config
│   └── utils.ts             # Utility functions
└── types/                   # TypeScript types
```

## Key Features

- SSR for SEO (all pages server-rendered)
- Automatic sitemap.xml and robots.txt
- Open Graph and Twitter Cards
- WYSIWYG editor (TipTap)
- Image upload to `/public/uploads/`
- Category and league filters
- Tag system
- View counter
- Cookie consent (GDPR)
- Admin authentication with NextAuth
- **Semi-automatic news import** from RSS feeds

## Import System (Priority #2)

The import system allows semi-automatic import of news from external sources.

### Features
- RSS feed parsing from configurable sources
- Preview articles before importing
- Bulk import with category/tag assignment
- Background job checks every 30 minutes (via Vercel Cron)
- Import notifications in admin dashboard
- Match results import

### Admin Pages
- `/admin/import` - Import dashboard (sources, pending items, jobs)
- `/admin/import/matches` - Manual match results entry

### API Endpoints
- `GET /api/import/sources` - List import sources
- `POST /api/import/sources` - Add new source
- `POST /api/import/sources/[id]/check` - Check source for new items
- `GET /api/import/items` - List imported items
- `POST /api/import/items/[id]/import` - Import item as article
- `POST /api/import/items/[id]/skip` - Skip item
- `POST /api/import/bulk` - Bulk import items
- `GET /api/import/cron` - Cron endpoint (auto-check all sources)
- `POST /api/import/matches` - Import match results

### Adding New Sources
Sources can be added via the admin UI or directly in `/src/lib/import/sources.ts`.

### Configuration
- `CRON_SECRET` - Optional secret for cron endpoint authentication
- Vercel Cron configured in `vercel.json` (runs every 30 minutes)

## Database Models

- **Article** - News articles with categories, tags, SEO fields
- **Category** - Sport categories (Football, Basketball, etc.)
- **League** - Sub-categories within sports
- **Tag** - Article tags
- **User** - Admin users (ADMIN/EDITOR roles)
- **Match** - Match results (attachable to articles)
- **Team/Standing** - Team data and league tables
- **Page** - Static content pages
- **AdZone** - Advertisement placements
- **SiteSettings** - Global site configuration
- **ImportSource** - External news sources (RSS, API, Scraper)
- **ImportedItem** - Fetched articles pending review
- **ImportJob** - Import job history
- **ImportNotification** - Admin notifications for new imports
