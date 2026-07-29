# ProCapital — Next.js + Payload CMS

Dynamic ProCapital website with a team admin dashboard.

## What you get

- **Public site** (Next.js App Router): homepage, equity release, resident mortgage, off-plan guides
- **Admin dashboard** at `/admin` (Payload CMS): pages, logos/media, site settings, team users
- **Lead form API** at `/api/leadrat` (replaces `leadrat.php`)

## Quick start

```bash
cd Desktop/procapital-nextjs
npm install
npm run seed
npm run dev
```

1. Open http://localhost:3000 — public site  
2. Open http://localhost:3000/admin — create your first **Admin** user  
3. Add more teammates under **Users** (Admin role can invite)

## Dashboard guide

| Area | Path | What you can change |
|------|------|---------------------|
| Pages | `/admin/collections/pages` | Add/edit pages, SEO, hero, services, FAQs, guide HTML |
| Media | `/admin/collections/media` | Upload logos and images |
| Site Settings | `/admin/globals/site-settings` | Logo, phone, email, WhatsApp, ticker rates, disclaimers |
| Users | `/admin/collections/users` | Team logins — Admin or Editor |

## LeadRat CRM key

In `.env`:

```
LEADRAT_API_KEY=your_real_key_here
```

Optional Google Sheet backup:

```
LEADRAT_BACKUP_URL=https://script.google.com/...
```

## Deploy on Vercel (recommended)

SQLite is fine for local. For production on Vercel:

1. Create a free Postgres DB on [Neon](https://neon.tech)
2. Switch adapter from `@payloadcms/db-sqlite` to `@payloadcms/db-postgres` in `payload.config.ts`
3. Set env vars in Vercel:
   - `DATABASE_URL` (Neon connection string)
   - `PAYLOAD_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (your live domain)
   - `LEADRAT_API_KEY`
4. For media uploads on Vercel, add S3 / Vercel Blob storage (`@payloadcms/storage-vercel-blob` or S3)
5. Push to GitHub → Import in Vercel → Deploy
6. Run seed once against production (or recreate pages in admin)
7. Point `procapital.ae` DNS to Vercel

## Scripts

- `npm run dev` — develop
- `npm run seed` — load ProCapital content + logo
- `npm run build` / `npm start` — production
- `npm run generate:types` — refresh Payload TypeScript types
