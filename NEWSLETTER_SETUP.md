# Newsletter — free production setup

Your site is **static HTML**; the newsletter needs a small **API** (in `server/`) plus **SMTP** for welcome emails. Everything below has a **free tier** that is fine for a landing page long term.

## Architecture

| Piece | Role | Free option |
|-------|------|-------------|
| Landing pages | Home + academy HTML | GitHub Pages, Netlify, or Cloudflare Pages |
| Newsletter API | Duplicate check + send email | [Render](https://render.com) Web Service (free) |
| Subscriber list | Persistent storage | [Supabase](https://supabase.com) Postgres (free) **or** local JSON file on your laptop only |
| Outbound email | Welcome template | **Gmail App Password** (free, ~500 emails/day) |

> **Why Supabase on Render?** Render’s free disk is temporary. Subscribers must live in Supabase (or another database), not only `subscribers.json`, or the list can reset when the service redeploys.

---

## Part 1 — Database (Supabase, ~5 minutes)

1. Create a free account at [supabase.com](https://supabase.com) → **New project**.
2. Open **SQL Editor** → paste and run [`server/supabase/newsletter_subscribers.sql`](server/supabase/newsletter_subscribers.sql).
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`  
     Use **only on the server**, never in the browser.

You can view subscribers anytime in **Table Editor → newsletter_subscribers**.

---

## Part 2 — Email (Gmail App Password, free)

1. Use a Google account you control (e.g. `s.mohanamanjula@gmail.com`).
2. Turn on [2-Step Verification](https://myaccount.google.com/security).
3. Create an [App Password](https://myaccount.google.com/apppasswords) for “Mail”.
4. Use these in the API env:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
MAIL_FROM="EQB Creative Tech <your@gmail.com>"
```

---

## Part 3 — Deploy the API (Render, free)

1. Push this repo to **GitHub** (if it isn’t already).
2. [Render](https://render.com) → **New → Web Service** → connect the repo.
3. Settings:
   - **Root directory:** `server`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Instance type:** Free
4. **Environment** variables:

| Key | Example |
|-----|---------|
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (service role) |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | your Gmail |
| `SMTP_PASS` | App Password |
| `MAIL_FROM` | `EQB Creative Tech <your@gmail.com>` |
| `CORS_ORIGINS` | Your live site URL(s), comma-separated |

**CORS_ORIGINS** must include every origin where users open the site, for example:

```text
https://yourname.github.io,https://www.eqbcreativetech.com
```

No `http://localhost` on Render unless you add it for local testing.

5. Deploy → copy the service URL, e.g. `https://eqb-newsletter.onrender.com`.

6. Test:

```bash
curl -s -X POST https://eqb-newsletter.onrender.com/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com"}'
```

Expect `201` and a welcome email in the inbox.

**Render free note:** The service sleeps after ~15 minutes without traffic. The first request after sleep may take 30–60 seconds (cold start). Normal for a free tier.

---

## Part 4 — Connect the frontend

Default in `js/data.js` is localhost for development. For production, **do not** commit your live URL in `data.js` if you prefer; use a local override:

1. Copy `js/config.local.js.example` → `js/config.local.js`.
2. Set:

```js
window.EQB_DATA.newsletter.endpoint = "https://eqb-newsletter.onrender.com/api/newsletter/subscribe";
```

3. On **eqbcreativetech.home.html**, load it right after `data.js`:

```html
<script src="js/data.js"></script>
<script src="js/config.local.js"></script>
```

If you deploy only static files (GitHub Pages), include `config.local.js` in the upload with the production endpoint, or set `newsletter.endpoint` directly in `data.js`.

---

## Part 5 — Host the static site (free)

| Host | Notes |
|------|--------|
| **GitHub Pages** | Repo → Settings → Pages → branch `main` / `/root` |
| **Netlify** | Drag folder or connect repo; no build step needed |
| **Cloudflare Pages** | Same; fast CDN |

Your **contact form** already uses FormSubmit and does not need this API. Only **newsletter** uses `EQB_DATA.newsletter.endpoint`.

---

## Local development (same as before)

```bash
# Terminal 1 — API (with server/.env filled in, including Supabase optional locally)
cd server && npm install && npm start

# Terminal 2 — static site
python3 -m http.server 8080
```

Open `http://localhost:8080/eqbcreativetech.home.html` — endpoint stays `http://localhost:3847/...` from `data.js`.

For local API **without** Supabase, omit Supabase env vars; the API uses `server/data/subscribers.json`.

---

## Costs and limits (typical free tier)

- **Render:** Free web service; cold starts; not for high traffic.
- **Supabase:** Free project; plenty of rows for newsletter emails.
- **Gmail SMTP:** ~500 messages/day per account; enough for most academies.
- **GitHub Pages / Netlify / Cloudflare:** Free for static sites.

No credit card is required for Supabase/Render/GitHub Pages on their free tiers (policies can change; check each site).

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Browser: “Failed to fetch” / CORS | Add your site URL to `CORS_ORIGINS` on Render |
| `email_not_configured` | Set all `SMTP_*` and `MAIL_FROM` on Render |
| `already_subscribed` works but no email | Check Render logs; verify App Password and `MAIL_FROM` |
| Slow first subscribe | Render free cold start — wait and retry |
| Duplicate works on one device only | You’re only using `localStorage`; API + Supabase fixes global duplicates |

---

## Optional upgrades (still low cost)

- **Custom domain** on Render + static host (free SSL on both).
- **Brevo** or **Resend** free tiers instead of Gmail if you outgrow Gmail limits.
- Paid Render instance to remove cold starts (only if traffic justifies it).
