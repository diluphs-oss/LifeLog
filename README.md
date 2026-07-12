# LifeLog

Your all-in-one daily tracker: punch in/out, tasks, ideas, lunch receipts (with €12 allowance tracking), to-dos, expenses, wishlist, movies, links, and a downloadable daily PDF — installable as an app on Android and Mac.

## Tonight's setup (about 30-40 minutes)

### 1. Supabase (database + storage) — ~10 min
1. Go to https://supabase.com → New project (free tier)
2. Once created: **SQL Editor** → New query → paste everything from `supabase/schema.sql` → Run
3. **Storage** → New bucket → name it `receipts` → make it **public**
4. **Authentication** → Providers → make sure **Email** is enabled (magic link, no password needed)
5. **Project Settings > API** → copy your `Project URL` and `anon public` key

### 2. Local setup — ~5 min
```bash
npm install
cp .env.local.example .env.local
# paste your Supabase URL + anon key into .env.local
npm run dev
```
Open http://localhost:3000 — sign in with your email (you'll get a magic link).

### 3. Email sending (optional, for the evening report) — ~5 min
1. Turn on 2-Factor Authentication on your Google account (if not already)
2. Go to https://myaccount.google.com/apppasswords → create an app password for "Mail"
3. Add `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `REPORT_EMAIL_TO` to `.env.local`

### 4. Telegram sending (optional) — ~3 min
1. Message **@BotFather** on Telegram → `/newbot` → follow prompts → copy the token
2. Message **@userinfobot** → it replies with your chat ID
3. Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to `.env.local`

### 5. Deploy to Vercel (so it's live on your phone too) — ~10 min
1. Push this folder to a new GitHub repo
2. Go to https://vercel.com → New Project → import the repo
3. In Vercel's project settings → Environment Variables → paste everything from your `.env.local`
4. Deploy — you'll get a live URL like `lifelog-yourname.vercel.app`

### 6. Install on your devices
- **Android (Chrome)**: open the URL → menu (⋮) → "Install app"
- **Mac (Safari or Chrome)**: open the URL → File/Share menu → "Add to Dock"

## Still to do (swap these when ready)
- Replace `/public/icon-192.png` and `/public/icon-512.png` with your Pixar-style avatar (192x192 and 512x512 PNGs)
- The "documents" tab currently just stores links — easiest is to upload files to your Google Drive and paste the share link in

## Notes
- Data is private to your Supabase project — only you (via magic link) can access it, enforced by Row Level Security.
- Receipt photos go to Supabase Storage (free tier: 1GB). If you fill that up over time, move older photos to Google Drive and just keep the amount in the app.
- The evening report banner appears automatically after 5 PM and lets you send the day's PDF via email, Telegram, or both — or dismiss it.
