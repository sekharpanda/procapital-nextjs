# Deploy ProCapital to Vercel (free tier)

This app uses **SQLite locally** and **Postgres on Vercel**. Do not point production at SQLite.

## 1) Neon Postgres (free)

1. Go to https://neon.tech and create a free project
2. Copy the connection string (`postgresql://...`)
3. Keep it for Vercel as `DATABASE_URL`

## 2) GitHub

1. Create a GitHub repo
2. Push this project (`.env` stays private ? it is gitignored)

```bash
git init
git add .
git commit --trailer "Co-authored-by: Cursor <cursoragent@cursor.com>" -m "Prepare ProCapital for Vercel"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## 3) Vercel project

1. https://vercel.com ? **Add New Project** ? Import the GitHub repo
2. Framework: Next.js (auto)
3. Environment variables:

| Name | Value |
|------|--------|
| `DATABASE_URL` | Neon `postgresql://...` string |
| `PAYLOAD_SECRET` | Long random string (32+ chars) |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-PROJECT.vercel.app` first, then custom domain |
| `LEADRAT_API_KEY` | Your LeadRat key |
| `BLOB_READ_WRITE_TOKEN` | Optional; from Vercel Storage ? Blob |

4. Deploy

## 4) First production data

After first deploy opens:

1. Visit `https://YOUR-PROJECT.vercel.app/admin`
2. If no user exists, create Super Admin **or** run seeds against Neon locally:

```bash
# Temporarily set Neon URL in a local shell (do not commit)
$env:DATABASE_URL="postgresql://..."
$env:PAYLOAD_SECRET="same-as-vercel"
$env:NEXT_PUBLIC_SITE_URL="https://YOUR-PROJECT.vercel.app"
npm run seed
npm run seed:structure
npm run seed:superadmin
```

## 5) Custom domain (procapital.ae)

1. Vercel ? Project ? **Settings ? Domains**
2. Add `procapital.ae` and `www.procapital.ae`
3. At your domain DNS provider, add the records Vercel shows (usually A/CNAME)
4. Wait for SSL to become **Valid**
5. Update Vercel env `NEXT_PUBLIC_SITE_URL=https://procapital.ae` and redeploy

## Local development (unchanged)

Keep `.env` as:

```
DATABASE_URL=file:./procapital-nextjs.db
```

`npm run dev` continues to use SQLite ? production Postgres does not affect local.
