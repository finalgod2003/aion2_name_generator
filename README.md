# aion2namegenerator.org

Static site for the **Aion 2 Name Generator**. No dependencies, just Node 18+.

```
node build.mjs     # build -> dist/
node serve.mjs     # preview at http://localhost:4321
```

## Structure

| Path | Purpose |
|---|---|
| `build.mjs` | All page content, layout, SEO meta, JSON-LD, sitemap/robots |
| `src/assets/namegen.js` | Name engine (syllables per faction / gender / class). Shared by browser and build |
| `src/assets/app.js` | UI: generate, copy, favorites (localStorage), spelling variants |
| `src/assets/style.css` | Styles |
| `dist/` | Build output. Deploy this folder |

## Pages

- `/` – Aion 2 Name Generator (main keyword)
- `/elyos-name-generator/`, `/asmodian-name-generator/`
- `/gladiator-` `/templar-` `/assassin-` `/ranger-` `/sorcerer-` `/spiritmaster-` `/cleric-` `/chanter-name-generator/`
- `/aion-2-names-list/` – names list + server names + Empyrean Lords
- `/about/`, `/privacy/`, `404.html`

## Deploy (Cloudflare Pages / Netlify / Vercel)

- Build command: `node build.mjs`
- Output directory: `dist`
- After going live, submit `https://aion2namegenerator.org/sitemap.xml` in Google Search Console.

## Updating

- Server list: edit `EU_ELYOS`, `EU_ASMO`, `LAUNCH_NEW`, `LAUNCH_MORE` in `build.mjs`, and bump `SITE.updated`.
- Static example names are seeded, so they stay stable between builds. Change a seed to reshuffle a list.
