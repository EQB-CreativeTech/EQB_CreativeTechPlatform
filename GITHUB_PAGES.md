# Host on GitHub Pages (free)

Repo: **[EQB-CreativeTech/EQB_CreativeTechPlatform](https://github.com/EQB-CreativeTech/EQB_CreativeTechPlatform)**  
Live site: **https://eqb-creativetech.github.io/EQB_CreativeTechPlatform/**

Newsletter API stays on **Render** (see [NEWSLETTER_SETUP.md](NEWSLETTER_SETUP.md)).

## 1. Push code

```bash
cd "/path/to/1. Landing-Page"
git remote set-url origin https://github.com/EQB-CreativeTech/EQB_CreativeTechPlatform.git
git push origin main
```

## 2. Turn on GitHub Pages

1. Push to `main` and wait until **Actions** → **Deploy to GitHub Pages** is green (publishes the `gh-pages` branch).
2. Repo → **Settings** → **Pages**.
3. **Source:** **Deploy from a branch** → branch **`gh-pages`** → **`/ (root)`** → **Save**.

`index.html` redirects to `eqbcreativetech.home.html`.

## 3. Newsletter API (Render) — CORS for GitHub

On Render, set **CORS_ORIGINS** to the Pages origin (host only, no path):

```text
https://eqb-creativetech.github.io
```

Custom domain example:

```text
https://eqb-creativetech.github.io,https://www.eqbcreativetech.com
```

## 4. Point the home page at your API

Edit `js/config.local.js` and set your Render subscribe URL, then push.

## 5. Quick test

1. Open `https://eqb-creativetech.github.io/EQB_CreativeTechPlatform/eqbcreativetech.home.html`
2. Scroll to **Stay Updated** and test subscribe (after Render API is configured).

## What lives where

| Item | GitHub | Render | Supabase |
|------|--------|--------|----------|
| HTML / CSS / JS | Yes (Pages) | No | No |
| Newsletter API | No | Yes | — |
| Subscriber emails | No | No | Yes (table) |
| Welcome email SMTP | No | Yes (env vars) | No |

Contact form uses FormSubmit from the browser.

## Optional: custom domain

Repo **Settings → Pages → Custom domain** → add DNS records GitHub shows. Add that `https://` origin to Render **CORS_ORIGINS**.
