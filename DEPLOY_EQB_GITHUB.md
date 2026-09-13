# Deploy to EQB-CreativeTech on GitHub

Target org: **[EQB-CreativeTech](https://github.com/EQB-CreativeTech)**  
Repository: **[EQB_CreativeTechPlatform](https://github.com/EQB-CreativeTech/EQB_CreativeTechPlatform)**  
Live URL: **https://eqb-creativetech.github.io/EQB_CreativeTechPlatform/**

## Push updates (terminal)

```bash
cd "/Users/mohanamanjula.s/Mohana-MY/other_sts/z-EQB Creative Tech/1. Landing-Page"

git remote set-url origin https://github.com/EQB-CreativeTech/EQB_CreativeTechPlatform.git
git push origin main
```

SSH:

```bash
git remote set-url origin git@github.com:EQB-CreativeTech/EQB_CreativeTechPlatform.git
```

## Enable GitHub Pages (one-time)

1. Repo → **Settings** → **Pages**.
2. **Build and deployment** → **Source:** **GitHub Actions**.
3. **Actions** → **Deploy to GitHub Pages** → confirm a green run on `main`.

## Newsletter API (after site is live)

GitHub Pages does not run Node. Use Render + Supabase + Gmail — see [NEWSLETTER_SETUP.md](NEWSLETTER_SETUP.md).

On Render, set:

```text
CORS_ORIGINS=https://eqb-creativetech.github.io
```

In `js/config.local.js`, set your Render subscribe URL and push again.

## Repo settings (recommended)

- **About** → Website: `https://eqb-creativetech.github.io/EQB_CreativeTechPlatform/`
- Topics: `eqb-creative-tech`, `education`, `tnpsc`, `landing-page`
