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

## Deploy (Cloudflare Pages)

Cloudflare Pages project `aion2-name-generator` is connected to
[`finalgod2003/aion2_name_generator`](https://github.com/finalgod2003/aion2_name_generator).
Every push to `main` automatically builds and deploys the production site:
https://aion2-name-generator.pages.dev. Other branches receive preview deployments.

- Production branch: `main`
- Framework preset: `None`
- Root directory: repository root
- Build command: `node build.mjs`
- Output directory: `dist`

Push source changes to GitHub; Cloudflare rebuilds `dist/` during deployment.
The previous direct-upload project, `aion2namegenerator`, is retained separately
and does not receive these automatic deployments.

The production custom domain is `https://www.aion2namegenerator.org`.
Canonical URLs, structured data, robots.txt, and the sitemap use this hostname.
Submit `https://www.aion2namegenerator.org/sitemap.xml` under the
`aion2namegenerator.org` domain property in Google Search Console.

## Updating

- Analytics: GA4 property `Aion 2 Name Generator`, web stream `Aion 2 Name Generator — Web`, measurement ID `G-78SPRSKSMN`. The shared layout in `build.mjs` includes one Google tag per page, with Google signals and advertising personalization disabled. The privacy page describes analytics collection.

- Server list: edit `EU_ELYOS`, `EU_ASMO`, `LAUNCH_NEW`, `LAUNCH_MORE` in `build.mjs`, and bump `SITE.updated`.
- Static example names are seeded, so they stay stable between builds. Change a seed to reshuffle a list.
