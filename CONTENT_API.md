# EQB Creative Tech — content API contract

The front end loads marketing copy from bundled seed data in [`js/data.js`](js/data.js) and [`js/pages/*.js`](js/pages/). When `EQB_DATA.api.baseUrl` is set, [`js/content-loader.js`](js/content-loader.js) fetches JSON and deep-merges it over the seed. Invalid or failed responses keep the bundled UI unchanged.

## Configuration

```js
EQB_DATA.api = {
  baseUrl: "https://api.example.com", // empty string = seed only
  timeoutMs: 8000,
  endpoints: {
    bundle: "/api/v1/content",           // optional: single payload
    site: "/api/v1/site",                // optional: global chrome only
    home: "/api/v1/pages/home",          // home page slice
    page: "/api/v1/pages/:slug"          // academy pages (it-academy, etc.)
  }
};
```

Use either `bundle` **or** the `site` + `home` / `page` endpoints, not both.

## Bundle response shape

```json
{
  "site": { "nav": [], "footer": {} },
  "pages": {
    "home": {
      "pageContent": { "hero": {}, "sections": {}, "domains": [] }
    },
    "it-academy": { "pageTitle": "", "hero": {}, "tracks": {}, "outcomes": {}, "cta": {} }
  }
}
```

## `site` object

Matches `EQB_DATA.site` in [`js/data.js`](js/data.js):

- `nav`: `{ id, label, href, homeHref?, scrollTarget? }[]`
- `footer.about`, `footer.quickLinks`, `footer.resources`, `footer.contact`, `footer.social`, `footer.copyright`

## Home `pageContent` object

Matches `EQB_DATA.pageContent`:

- `hero`: `badge`, `titleHtml`, `description`, `actions[]`, `card`
- `sections`: `domains`, `howItWorks`, `contact`, `newsletter`
- `heroStats`, `domains`, `stats`, `steps`, `contactAside`

Home endpoint may return `{ "pageContent": { ... } }` instead of nesting under `pages.home`.

## Academy `pageData` object

Matches `window.EQB_PAGE_DATA` in [`js/pages/it-academy.js`](js/pages/it-academy.js):

- `pageTitle`, `navbarCta`, `hero`, `tracks`, `outcomes`, `cta`

Slug values align with `data-page` on `<body>`: `it-academy`, `tnpsc-academy`, `art-studio`.

Bundle responses may use `pages["it-academy"]` or a dedicated `pageData` field on the page endpoint response.

## Runtime state

After `EQB_CONTENT_LOADER.load(pageId)`:

- `window.EQB_CONTENT_STATE` — `{ site, pageContent, pageData }`
- `window.EQB_DATA.site` / `pageContent` and `window.EQB_PAGE_DATA` are updated in place for chatbot and legacy readers.

## Enabling the API

1. Deploy an endpoint returning JSON that matches the shapes above.
2. Set `EQB_DATA.api.baseUrl` (e.g. via a small non-committed `js/config.local.js` loaded after `data.js`).
3. Verify all four HTML pages still render; the loader re-renders once when remote content arrives.
