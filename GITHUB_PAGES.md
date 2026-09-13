# Host on GitHub Pages (free)

Static site on **GitHub Pages**; newsletter API stays on **Render** (see [NEWSLETTER_SETUP.md](NEWSLETTER_SETUP.md)).

## 1. Create the GitHub repo

1. On [github.com](https://github.com) → **New repository**.
2. Under org **[EQB-CreativeTech](https://github.com/EQB-CreativeTech)**, name the repo **`landing-page`** (recommended).
3. Do **not** add a README if you already have this project locally.

From your project folder:

```bash
cd "/path/to/1. Landing-Page"
git init
git add .
git commit -m "Initial EQB landing page"
git branch -M main
git remote add origin https://github.com/EQB-CreativeTech/landing-page.git
git push -u origin main
```

## 2. Turn on GitHub Pages

1. Repo → **Settings** → **Pages**.
2. **Build and deployment** → Source: **GitHub Actions** (not “Deploy from branch”).
3. Push to `main` (or run the **Deploy to GitHub Pages** workflow manually under **Actions**).

Your site URL will be:

```text
https://eqb-creativetech.github.io/landing-page/
```

Open that URL — `index.html` redirects to `eqbcreativetech.home.html`.

## 3. Newsletter API (Render) — CORS for GitHub

GitHub Pages cannot run the Node API. Deploy `server/` on Render as described in [NEWSLETTER_SETUP.md](NEWSLETTER_SETUP.md).

On Render, set **CORS_ORIGINS** to your GitHub Pages origin **only the host, no path**:

```text
https://eqb-creativetech.github.io
```

If you later add a custom domain (e.g. `https://www.eqbcreativetech.com`), add it comma-separated:

```text
https://eqb-creativetech.github.io,https://www.eqbcreativetech.com
```

## 4. Point the home page at your API

Edit `js/config.local.js` and uncomment:

```js
window.EQB_DATA.newsletter.endpoint = "https://YOUR-RENDER-SERVICE.onrender.com/api/newsletter/subscribe";
```

Commit and push — the next Pages deploy will use the live API.

```bash
git add js/config.local.js
git commit -m "Wire newsletter to production API"
git push
```

## 5. Quick test

1. Open `https://eqb-creativetech.github.io/landing-page/eqbcreativetech.home.html`
2. Scroll to **Stay Updated**, subscribe with a test email.
3. If it fails: browser **DevTools → Network** on the subscribe request; on Render check **Logs** and **CORS_ORIGINS**.

## What lives where

| Item | GitHub | Render | Supabase |
|------|--------|--------|----------|
| HTML / CSS / JS | Yes (Pages) | No | No |
| Newsletter API | No | Yes | — |
| Subscriber emails | No | No | Yes (table) |
| Welcome email SMTP | No | Yes (env vars) | No |

Contact form still uses FormSubmit from the browser; no GitHub backend needed.

## Optional: custom domain

Repo **Settings → Pages → Custom domain** → add your domain and DNS records GitHub shows. Then add that `https://` origin to Render **CORS_ORIGINS**.
