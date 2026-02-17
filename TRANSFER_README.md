# Sports News Site - Transfer Documentation

## Project Overview

Russian sports news media website with admin panel for content management, bookmaker ratings, and match schedules.

**Live Site:** Your Vercel deployment URL
**GitHub:** https://github.com/Lanakosuhina/sports-news

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **ORM:** Prisma
- **Database:** PostgreSQL (Neon)
- **Auth:** NextAuth.js
- **Editor:** TipTap (WYSIWYG)
- **Hosting:** Vercel

---

## Quick Start (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/Lanakosuhina/sports-news.git
cd sports-news
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create `.env` file with these variables:
```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: SportDB API (paid)
SPORTDB_API_KEY=""

# Cron job authentication
CRON_SECRET="your-cron-secret"
```

### 4. Setup Database
```bash
# Generate Prisma client
npm run db:push

# Seed initial data (creates admin user)
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Open http://localhost:3000

---

## Admin Panel Access

**URL:** `/admin/login`

**Default Credentials:**
- Email: `admin@sportsnews.com`
- Password: `admin123`

**IMPORTANT:** Change the admin password after first login!

---

## Database Management

### Neon PostgreSQL Setup

1. Go to https://neon.tech
2. Create free account
3. Create new project
4. Copy connection string to `DATABASE_URL`

### Common Database Commands

```bash
# Push schema changes to database
npm run db:push

# Create migrations (for production)
npm run db:migrate

# Seed initial data
npm run db:seed

# Open Prisma Studio (visual database editor)
npm run db:studio
```

### Backup Database

Using Neon dashboard:
1. Go to your Neon project
2. Click "Branches" → "main"
3. Click "..." → "Create branch" (this creates a backup)

Using pg_dump:
```bash
pg_dump "your-database-url" > backup.sql
```

### Restore Database
```bash
psql "your-database-url" < backup.sql
```

---

## Vercel Deployment

### Initial Setup

1. Go to https://vercel.com
2. Import GitHub repository
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
   - `CRON_SECRET`

### Update Deployment

Changes are automatically deployed when you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Manual Redeploy
```bash
npx vercel --prod
```

### Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/edit variables
3. Redeploy for changes to take effect

---

## Project Structure

```
src/
├── app/
│   ├── (main)/              # Public pages
│   │   ├── page.tsx         # Homepage
│   │   ├── category/[slug]/ # Category pages
│   │   ├── article/[slug]/  # Article pages
│   │   ├── matches/         # Match schedules
│   │   └── bookmaker/[slug]/# Bookmaker pages
│   ├── admin/               # Admin panel
│   │   ├── login/           # Login page
│   │   └── (dashboard)/     # Protected admin routes
│   └── api/                 # API routes
├── components/              # React components
├── lib/
│   ├── prisma.ts           # Database client
│   ├── auth.ts             # Authentication
│   ├── thesportsdb.ts      # Free matches API
│   └── sportdb.ts          # Paid matches API
└── types/                  # TypeScript types
```

---

## Key Features

### Content Management
- Articles with WYSIWYG editor
- Categories and tags
- Image uploads to `/public/uploads/`
- SEO fields (meta description, OG images)

### Bookmaker System
- Bookmaker profiles with ratings
- Bonus pages (freebet, no deposit, etc.)
- App download links (iOS/Android)
- Promo codes and cards

### Match Schedules
- Football and hockey matches
- Uses TheSportsDB free API
- Today/Tomorrow/All matches views

### Import System
- RSS feed import
- Semi-automatic article import
- Cron job every 30 minutes

---

## API Endpoints

### Public
- `GET /api/articles` - List articles
- `GET /api/categories` - List categories
- `GET /api/tags` - List tags

### Protected (requires auth)
- `POST /api/articles` - Create article
- `PUT /api/articles/[id]` - Update article
- `DELETE /api/articles/[id]` - Delete article
- `POST /api/upload` - Upload images

### Cron
- `GET /api/import/cron` - Auto-check import sources

---

## Changing Admin Password

1. Open Prisma Studio: `npm run db:studio`
2. Go to "User" table
3. Find admin user
4. Generate new bcrypt hash: https://bcrypt-generator.com/
5. Update `password` field with new hash

Or via code:
```typescript
import bcrypt from 'bcryptjs'
const hash = await bcrypt.hash('new-password', 12)
// Update in database
```

---

## Creating New Admin User

```bash
npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('your-password', 12);
  await prisma.user.create({
    data: {
      email: 'newadmin@example.com',
      name: 'New Admin',
      password: hash,
      role: 'ADMIN'
    }
  });
  console.log('User created!');
}
main();
"
```

---

## Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` format
- Ensure SSL is enabled (`?sslmode=require`)
- Check Neon dashboard for connection limits

### Build Errors
```bash
# Regenerate Prisma client
npx prisma generate

# Clear Next.js cache
rm -rf .next
npm run build
```

### Authentication Issues
- Check `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies

### Matches Not Loading
- TheSportsDB free API has rate limits
- Check console for API errors
- Data is cached for 5 minutes

---

## Useful Links

- **Neon Dashboard:** https://console.neon.tech
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs
- **TheSportsDB API:** https://www.thesportsdb.com/api.php

---

## Support

For technical issues, check:
1. Vercel deployment logs
2. Browser console errors
3. Neon connection logs

---

## License

Private project. All rights reserved.
