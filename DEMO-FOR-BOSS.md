# Demo deploy for boss approval (no custom domain yet)

Goal: get a public URL like `https://procapital-xxxx.vercel.app` to send your boss.
Do **not** connect `procapital.ae` until they approve.

---

## A) Create free Neon database (required)

1. Open https://console.neon.tech and sign up / log in
2. **Create project**
   - Name: `procapital-demo`
   - Region: pick closest (e.g. Singapore / Frankfurt)
3. After it opens, go to **Dashboard → Connection details**
4. Copy the connection string that starts with:
   `postgresql://...`
5. Keep that string ready (this is your `DATABASE_URL`)

Tip: use the connection string with `sslmode=require` if shown.

---

## B) Put the code on GitHub

1. Open https://github.com/new
2. Repository name: `procapital-nextjs`
3. Private repo recommended
4. Create repository (do not add README if GitHub offers files — empty is fine)

On your PC, in PowerShell:

```powershell
cd C:\Users\PROWIN\Desktop\procapital-nextjs
git init
git add .
git commit --trailer "Co-authored-by: Cursor <cursoragent@cursor.com>" -m "ProCapital demo site for Vercel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/procapital-nextjs.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## C) Deploy on Vercel (free Hobby)

1. Open https://vercel.com and log in with GitHub
2. **Add New… → Project**
3. Import `procapital-nextjs`
4. Before Deploy, open **Environment Variables** and add:

| Name | Value |
|------|--------|
| `DATABASE_URL` | paste Neon `postgresql://...` |
| `PAYLOAD_SECRET` | any long random string (example: use a password generator, 32+ chars) |
| `NEXT_PUBLIC_SITE_URL` | leave blank for first deploy, or set after you get the vercel.app URL |
| `LEADRAT_API_KEY` | your LeadRat key |

Optional later: `BLOB_READ_WRITE_TOKEN` (for media uploads)

5. Click **Deploy**
6. Wait until status is Ready
7. Open the site URL shown (ends with `.vercel.app`)

8. Then set:
   - `NEXT_PUBLIC_SITE_URL` = that exact `https://....vercel.app` URL  
   - Redeploy (Deployments → … → Redeploy)

---

## D) Create admin user on the demo

1. Open `https://YOUR-DEMO.vercel.app/admin`
2. Create the first admin / log in with Super Admin
3. Confirm homepage + one guide page load
4. Quick test: change Header CTA text → Save → refresh website

If `/admin` is empty / schema issues, from your PC (with Neon URL set temporarily):

```powershell
cd C:\Users\PROWIN\Desktop\procapital-nextjs
$env:DATABASE_URL="paste-neon-url-here"
$env:PAYLOAD_SECRET="same-as-vercel"
$env:NEXT_PUBLIC_SITE_URL="https://YOUR-DEMO.vercel.app"
npm run seed
npm run seed:structure
npm run seed:superadmin
```

Then log in with the Super Admin credentials from seed output.

---

## E) Send to your boss

Send something like:

> Hi — please review the ProCapital demo site (not live domain yet):  
> Website: https://YOUR-DEMO.vercel.app  
> Admin (optional): https://YOUR-DEMO.vercel.app/admin  
> Notes: design/content for approval. Domain `procapital.ae` will be connected after sign-off.

Do **not** share production Super Admin password unless required.

---

## F) After approval (later)

1. Vercel → Project → Settings → Domains → add `procapital.ae`
2. Update DNS at your domain provider as Vercel shows
3. Set `NEXT_PUBLIC_SITE_URL=https://procapital.ae`
4. Redeploy

---

## Local computer remains safe

Your PC still uses SQLite (`file:./procapital-nextjs.db`).  
Demo/production use Neon Postgres. They do not overwrite each other.
