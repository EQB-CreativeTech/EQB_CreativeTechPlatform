# Deploy to EQB-CreativeTech on GitHub

Target org: **[EQB-CreativeTech](https://github.com/EQB-CreativeTech)**  
Recommended repo name: **`landing-page`**  
Live URL after deploy: **https://eqb-creativetech.github.io/landing-page/**

## A. Create the repository (browser)

1. Sign in as a member of **EQB-CreativeTech**.
2. Open [New repository](https://github.com/organizations/EQB-CreativeTech/repositories/new) (org) or **Repositories → New** on the org profile.
3. Settings:
   - **Repository name:** `landing-page`
   - **Description:** `EQB Creative Tech — official landing page (IT, TNPSC, Art Studio)`
   - **Public**
   - Do **not** add README, .gitignore, or license (this project already has them).
4. Click **Create repository**.

## B. Push this project (terminal)

From this folder:

```bash
cd "/Users/mohanamanjula.s/Mohana-MY/other_sts/z-EQB Creative Tech/1. Landing-Page"

git remote add origin https://github.com/EQB-CreativeTech/landing-page.git
git push -u origin main
```

If `origin` already exists with a wrong URL:

```bash
git remote set-url origin https://github.com/EQB-CreativeTech/landing-page.git
git push -u origin main
```

Use SSH if you prefer:

```bash
git remote add origin git@github.com:EQB-CreativeTech/landing-page.git
```

## C. Enable GitHub Pages

1. Repo → **Settings** → **Pages**.
2. **Build and deployment** → **Source:** **GitHub Actions**.
3. Open **Actions** → run **Deploy to GitHub Pages** (or wait for the push on `main` to trigger it).
4. When green, open **Settings → Pages** for the published URL.

## D. Newsletter API (after site is live)

GitHub Pages does not run Node. Use Render + Supabase + Gmail — see [NEWSLETTER_SETUP.md](NEWSLETTER_SETUP.md).

On Render, set:

```text
CORS_ORIGINS=https://eqb-creativetech.github.io
```

In `js/config.local.js`, set your Render subscribe URL and push again.

## E. Repo settings (recommended)

- **Settings → General → Social preview:** upload a 1280×640 brand image.
- **About** (right sidebar on repo home): add website `https://eqb-creativetech.github.io/landing-page/` and topics: `landing-page`, `education`, `tnpsc`, `eqb-creative-tech`.
