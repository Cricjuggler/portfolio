# Rohan Kumar — Portfolio

Single-page, scroll-driven personal site. Senior PM × AI Builder.

**Stack:** static HTML / CSS / vanilla JS. No build step, no framework, no dependencies.

## Local preview

```bash
python -m http.server 5173
# then open http://localhost:5173
```

## Files

| Path | Purpose |
|---|---|
| `index.html` | All sections, pre-rendered |
| `styles.css` | Design tokens + layout + motion |
| `app.js` | Scroll progress, active section, reveal observers, theme toggle, cursor blob |
| `favicon.svg` | Inline serif "R" + accent dot |
| `assets/rohan-portrait.png` | Hero portrait (4:5) |
| `assets/og-image.png` | 1200×630 social card |
| `assets/Rohan_Kumar_Resume.pdf` | Downloadable résumé |
| `vercel.json` | Cache + security headers |

## Deploy

Pushed to `main` → auto-deploys on Vercel.

## Notes

- `og:image` and `twitter:image` reference `assets/og-image.png` — update to an absolute URL (`https://yourdomain.com/assets/og-image.png`) once a custom domain is attached, otherwise some social-card scrapers won't pick it up.
- Theme toggle persists to `localStorage`; respects `prefers-color-scheme` until the user picks.
- `.gen-og.py` regenerates the social card (requires `pillow` and the three font files in `.fonts/`).
