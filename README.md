# EQB Creative Tech — Landing Page

Official marketing site for **EQB Creative Tech**: IT Academy, TNPSC Academy, and Art Studio. Multi-page static site with themes, contact form, AI chat assistant, and newsletter signup.

| | |
|---|---|
| **Organization** | [EQB-CreativeTech on GitHub](https://github.com/EQB-CreativeTech) |
| **Live site** | `https://eqb-creativetech.github.io/landing-page/` *(after Pages deploy)* |
| **Stack** | HTML, CSS, Bootstrap Icons, vanilla JavaScript |

## Pages

| Page | File |
|------|------|
| Home | [`eqbcreativetech.home.html`](eqbcreativetech.home.html) |
| IT Academy | [`eqbcreativetech.it-academy.html`](eqbcreativetech.it-academy.html) |
| TNPSC Academy | [`eqbcreativetech.tnpsc-academy.html`](eqbcreativetech.tnpsc-academy.html) |
| Art Studio | [`eqbcreativetech.art-studio.html`](eqbcreativetech.art-studio.html) |

`index.html` redirects to the home page.

## Features

- Light / dark mode and customizable color palettes
- Responsive layout and academy page templates
- Contact form (FormSubmit)
- Newsletter subscribe with welcome email and duplicate detection (API in `server/`)
- Optional remote content API ([`CONTENT_API.md`](CONTENT_API.md))

## Run locally

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080).

Newsletter API (optional):

```bash
cd server && cp .env.example .env   # add SMTP + Supabase for production
npm install && npm start
```

## Deploy on GitHub Pages

This repo includes [`.github/workflows/github-pages.yml`](.github/workflows/github-pages.yml).

1. Push to the [`EQB-CreativeTech`](https://github.com/EQB-CreativeTech) organization (see [`DEPLOY_EQB_GITHUB.md`](DEPLOY_EQB_GITHUB.md)).
2. Repo → **Settings** → **Pages** → Source: **GitHub Actions**.
3. Newsletter production: [`NEWSLETTER_SETUP.md`](NEWSLETTER_SETUP.md) and [`GITHUB_PAGES.md`](GITHUB_PAGES.md).

## Project layout

| Path | Role |
|------|------|
| `css/` | Global and academy styles |
| `js/data.js` | Nav, footer, themes, home content |
| `js/pages/` | Academy page copy |
| `js/content.js`, `js/academy-content.js` | Renderers |
| `js/ui.js`, `js/forms.js`, `js/chrome.js` | UI, forms, shared widgets |
| `server/` | Newsletter API (Node + Express) |

## License

MIT — see [LICENSE](LICENSE).
