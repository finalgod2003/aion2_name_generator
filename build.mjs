// Static site builder for aion2namegenerator.org
// Usage: node build.mjs   ->  outputs ./dist
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { CLASS_GUIDES } from './src/class-guides.mjs';

const require = createRequire(import.meta.url);
const NG = require('./src/assets/namegen.js');

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const SITE = {
  url: 'https://www.aion2namegenerator.org',
  name: 'Aion 2 Name Generator',
  ga4MeasurementId: 'G-78SPRSKSMN',
  plausibleScriptUrl: 'https://stats.blackholeenglish.com/js/pa--mC4qqgntIU3F98__NNUn.js',
  updated: '2026-10-09',
  updatedHuman: 'October 9, 2026'
};
const TRANSFER = {
  updated: '2026-10-11',
  updatedHuman: 'October 11, 2026',
  announced: 'October 9, 2026',
  productsUrl: 'https://store.steampowered.com/news/app/3393110/view/712288859283523636',
  qaUrl: 'https://store.steampowered.com/news/app/3393110/view/712288859283523639'
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const hash = (file) => crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
const CLASS_KEYS = Object.keys(NG.CLASSES);
const classUrl = (k) => `/${k}-name-generator/`;

// ---------------------------------------------------------------- helpers
function names(opts, count, seed) {
  return NG.generate({ ...opts, count, seed }).map((n) => n.name);
}
function nameList(list) {
  return `<ul class="name-list">${list.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>`;
}
function faqHtml(faq) {
  return `<section class="faq"><h2 id="faq">Frequently Asked Questions</h2>${faq
    .map((f) => `<details><summary>${esc(f.q)}</summary><p>${f.a}</p></details>`)
    .join('')}</section>`;
}
function stripTags(s) { return s.replace(/<[^>]+>/g, ''); }

const LOGO = `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d68a"/><stop offset="1" stop-color="#9b7cf6"/></linearGradient></defs><path fill="url(#lg)" d="M32 6c2 7 2 14 0 22-2-8-2-15 0-22zM30 30C22 18 12 14 3 14c5 4 7 9 8 13-3-1-6-1-8 0 5 2 8 5 10 9-2 0-4 0-6 1 6 2 13 3 19 1zm4 0c8-12 18-16 27-16-5 4-7 9-8 13 3-1 6-1 8 0-5 2-8 5-10 9 2 0 4 0 6 1-6 2-13 3-19 1zM32 34l6 8-6 16-6-16z"/></svg>`;

const namingRules = `<details class="naming-rules" id="naming-rules">
<summary>Name length &amp; regional rules <span>Global · KR · TW</span></summary>
<p><strong>12 is this tool's default length preference.</strong> The slider lets you choose a maximum of 4–16 letters; generated names use A–Z only and have at least 3 letters. These are generator settings, not a guarantee that a name meets your region's game rules.</p>
<div class="table-wrap"><table>
<thead><tr><th scope="col">Region</th><th scope="col">What is verified</th></tr></thead>
<tbody>
<tr><th scope="row">Global</th><td><strong>Current limits unverified by this site.</strong> Check the current character-creation screen for length, allowed characters and name availability. We do not apply the Korean reservation rules to Global.</td></tr>
<tr><th scope="row">Korea (KR)</th><td><strong>Historical reservation rules, October 16, 2025:</strong> 1–12 characters using Korean, English or digits; names were unique within a server. This is not confirmation of today's live-service rules. <a href="https://about.ncsoft.com/en/news/article/aion2_update_251016">NCSOFT announcement</a>.</td></tr>
<tr><th scope="row">Taiwan (TW)</th><td><strong>Current limits unverified by this site.</strong> The <a href="https://about.ncsoft.com/tw/news/article/aion2_update_251016_2">Taiwan announcement of October 16, 2025</a> directs players to local event rules without specifying a length limit. We do not assume the Korean limit applies.</td></tr>
</tbody></table></div>
<p class="hint">Sources reviewed October 9, 2026. The generator filters exact matches to a curated list of well-known Aion characters for originality; this is not an official reserved-name list. Availability and acceptance must be checked in game.</p>
</details>`;

// ---------------------------------------------------------------- generator widget
function generatorWidget(preset = {}) {
  const f = preset.faction || 'any';
  const c = preset.cls || 'any';
  const radio = (name, value, label, checked) =>
    `<label><input type="radio" name="${name}" value="${value}"${checked ? ' checked' : ''}><span>${label}</span></label>`;
  const initial = NG.generate({ faction: preset.faction, cls: preset.cls, count: 10, seed: preset.seed || 7 });
  return `<section class="generator" id="generator" aria-label="Name generator">
<form>
<div class="gen-grid">
<fieldset class="field"><legend>Faction</legend><div class="seg">${radio('faction', 'any', 'Any', f === 'any')}${radio('faction', 'elyos', 'Elyos', f === 'elyos')}${radio('faction', 'asmodian', 'Asmodian', f === 'asmodian')}</div></fieldset>
<fieldset class="field"><legend>Gender</legend><div class="seg">${radio('gender', 'any', 'Any', true)}${radio('gender', 'm', 'Male', false)}${radio('gender', 'f', 'Female', false)}</div></fieldset>
<label class="field"><span>Class</span><select name="cls"><option value="any"${c === 'any' ? ' selected' : ''}>Any class</option>${CLASS_KEYS.map((k) => `<option value="${k}"${c === k ? ' selected' : ''}>${NG.CLASSES[k].label}</option>`).join('')}</select></label>
<label class="field"><span>Tone</span><select name="style"><option value="any">Mixed</option>${Object.entries(NG.STYLES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>
<label class="field"><span>Starts with</span><input type="text" name="startsWith" maxlength="3" placeholder="Any letter, e.g. K" autocomplete="off" spellcheck="false"></label>
<label class="field"><span>Max length: <b class="len-out">12</b></span><input type="range" name="maxLen" min="4" max="16" value="12" aria-describedby="length-note"></label>
</div>
<p class="hint length-note" id="length-note">Length is a tool preference, not a verified game limit. See the regional rules below.</p>
<div class="gen-actions"><button class="btn" type="submit">Generate Names</button><button type="button" class="btn btn-ghost btn-sm copy-all">Copy all</button><button type="button" class="btn btn-ghost btn-sm share-filters">Share filters</button><p class="hint">Click a name to copy · ☆ save · ↻ spelling variants if it's taken</p></div>
</form>
<div class="share-link-box" hidden><label class="field"><span>Link to these filters &amp; this batch</span><input type="text" readonly aria-label="Shareable filter link"></label><p class="hint">Anyone with this link can view the filters and recreate this batch. Saved names stay in your browser.</p></div>
${namingRules}
<div class="list-toolbar"><span class="hint results-count">10 names</span>${sortControl('result-sort', 'Sort results', 'Generated order')}</div>
<p class="hint sort-note">Readability uses our spelling heuristic; it is not a game rule or availability check.</p>
<ul class="results" aria-live="polite">${initial
    .map((n) => `<li class="name-card" data-faction="${n.faction}"><span class="name-text">${esc(n.name)}</span><span class="name-meta">${NG.FACTIONS[n.faction].label} · ${n.gender === 'f' ? 'Female' : 'Male'}${n.cls ? ' · ' + NG.CLASSES[n.cls].label : ''}</span></li>`)
    .join('')}</ul>
</section>`;
}

function sortControl(cls, label, original) {
  return `<label class="sort-control"><span>${label}</span><select class="${cls}"><option value="original">${original}</option><option value="shortest">Length: shortest first</option><option value="longest">Length: longest first</option><option value="readability">Readability: highest first</option></select></label>`;
}

const favoritesPanel = `<section class="panel favorites" aria-label="Saved names">
<div class="panel-head"><h3>★ Your saved names <span class="fav-count hint">0 / 100</span></h3><button type="button" class="btn btn-ghost btn-sm fav-clear" hidden>Clear</button></div>
<div class="list-toolbar"><div class="shortlist-actions"><button type="button" class="btn btn-ghost btn-sm fav-copy" disabled>Copy saved names</button><button type="button" class="btn btn-ghost btn-sm fav-export" disabled>Export TXT</button></div>${sortControl('fav-sort', 'Sort saved names', 'Recently saved')}</div>
<p class="hint">Up to 100 names, stored in this browser. Copy and TXT export use the displayed order. Readability is a spelling estimate.</p>
<p class="fav-empty">Tap ☆ on any name to keep a shortlist here. It's stored only in your browser.</p>
<ul class="results"></ul>
</section>`;

const variantTool = `<section class="panel" id="variant-tool" aria-label="Name variant maker">
<h3>Name already taken? Make a variant</h3>
<p class="hint">Try a different spelling, then check availability in game. Variants use the same readability and known-character filters as the generator. Length is a tool preference; <a href="#naming-rules">check regional rules</a>.</p>
<form class="inline-form"><input type="text" placeholder="e.g. Celara" maxlength="16" aria-label="Name to vary" autocomplete="off" spellcheck="false"><label class="field variant-length"><span>Max length</span><select name="maxLen">${Array.from({ length: 13 }, (_, i) => i + 4).map(n => `<option value="${n}"${n === 12 ? ' selected' : ''}>${n} letters</option>`).join('')}</select></label><button class="btn" type="submit">Show variants</button></form>
<ul class="results"></ul>
</section>`;

// ---------------------------------------------------------------- shared blocks
function classCards(exclude) {
  return `<div class="cards">${CLASS_KEYS.filter((k) => k !== exclude)
    .map((k) => `<a class="card" href="${classUrl(k)}"><span class="tag">${NG.CLASSES[k].role}</span><strong>${NG.CLASSES[k].label} Name Generator</strong><span>${esc(CLASS_COPY[k].card)}</span></a>`)
    .join('')}</div>`;
}
const HUB_CARDS = [
  ['/elyos-name-generator/', 'elyos', 'Light · Elysea', 'Elyos Name Generator', 'Bright, flowing names with angelic -iel and -ael endings.'],
  ['/asmodian-name-generator/', 'asmodian', 'Shadow · Asmodae', 'Asmodian Name Generator', 'Sharp, dark names built on hard Z, K and TH sounds.'],
  ['/aion-2-names-list/', '', 'Lists · Servers', 'Aion 2 Names List', 'Hundreds of ready-made names plus every Aion 2 server name.'],
  ['/aion-2-server-transfer/', '', 'EA Oct 14 · Launch Oct 21', 'Aion 2 Server Transfer', 'Transfer windows, storage rules and a backup-name shortlist.']
];
function factionCards(exclude) {
  return `<div class="cards">
${HUB_CARDS.filter(([href]) => href !== exclude).map(([href, cls, tag, title, text]) => `<a class="card${cls ? ' ' + cls : ''}" href="${href}"><span class="tag">${tag}</span><strong>${title}</strong><span>${esc(text)}</span></a>`).join('\n')}
</div>`;
}

function classGuide(key) {
  const guide = CLASS_GUIDES[key], label = NG.CLASSES[key].label;
  return `<section class="class-guide" aria-label="${label} naming guide">
<h2>${esc(guide.title)}</h2>
<div class="class-context"><h3>The class behind the name</h3><p>${esc(guide.context)}</p>
<p class="hint">Sources: <a href="https://about.ncsoft.com/en/news/article/aion2-update-250530-2">NCSOFT class reveal, June 2025</a> · <a href="https://about.ncsoft.com/en/news/article/aion2_update_260325">March 2026 class update</a>. Historical context; skill names and availability may differ by region or update.</p></div>
<p>${esc(guide.interpretation)}</p>
${guide.directions.map(([title, body]) => `<h3>${esc(title)}</h3><p>${esc(body)}</p>`).join('')}
<h2>Six handpicked ${label} names</h2>
<p class="hint">Original suggestions selected for their sound and theme. These are creative interpretations, not official names or availability claims. Click a name to copy it, or ☆ to save it.</p>
<ul class="curated-names">${guide.picks.map(([name, theme, reason]) => `<li class="curated-name" data-name="${name}"><div class="panel-head"><button type="button" class="curated-copy" aria-label="Copy ${name}">${name}</button><button type="button" class="icon-btn fav" data-fav="${name}" aria-label="Favorite ${name}" aria-pressed="false">☆</button></div><span class="pick-theme">${esc(theme)}</span><p>${esc(reason)}</p></li>`).join('')}</ul>
<h3>Try a ${label} naming direction</h3>
<div class="recipe-links">${guide.recipes.map(([title, faction, style, startsWith, maxLen]) => {
    const params = new URLSearchParams({ faction, cls: key, style, maxLen, ...(startsWith ? { startsWith } : {}) });
    return `<a class="recipe-link" href="${classUrl(key)}?${esc(params.toString())}#generator"><strong>${esc(title)} →</strong><span>${NG.FACTIONS[faction].label} · ${esc(NG.STYLES[style])} · up to ${maxLen} letters${startsWith ? ' · starts ' + startsWith : ''}</span></a>`;
  }).join('')}</div>
<p class="note"><strong>A final sound check:</strong> ${esc(guide.check)}</p>
</section>`;
}

// ---------------------------------------------------------------- class copy
const CLASS_COPY = {
  gladiator: {
    card: 'Heavy, battle-hardened names for frontline bruisers.',
    lead: 'Forge a name that sounds like steel hitting steel. Generate Gladiator names for Elyos and Asmodian warriors who win fights by charging straight into them.',
    faq: [
      { q: 'What is a good Gladiator name in Aion 2?', a: 'Garran gives an arena veteran a firm personal name; Dawnblade suggests a radiant duelist; Ashcleave suits a battle survivor. Choose between a personal name and a combat alias, then use one of the naming directions above to make more.' },
      { q: 'Should my Gladiator name be different for Elyos and Asmodian?', a: 'It doesn\'t have to be, but it helps you blend in. Elyos names tend to be smoother with vowels like a, e and i, while Asmodian names use harsher sounds like z, k and th. Pick a faction in the generator and the syllables adjust automatically.' }
    ]
  },
  templar: {
    card: 'Noble, oath-bound names for shield-wielding tanks.',
    lead: 'Templars hold the line so everyone else can live. Generate dignified, oath-sworn names for Aion 2 Templar tanks on the Elyos and Asmodian sides.',
    faq: [
      { q: 'What are some cool Templar names for Aion 2?', a: 'Aldric and Valen suit sworn knights, while Dawnward and Duskguard make the protective theme explicit. Ravenoath adds the idea of a solemn promise. The curated picks above explain each direction.' },
      { q: 'Is the Templar a tank in Aion 2?', a: 'Yes. The Templar is the main tank class, known for heavy defense, damage mitigation and aggro control, which is why this generator leans toward protective, honorable names.' }
    ]
  },
  assassin: {
    card: 'Sharp, quiet names for stealthy burst killers.',
    lead: 'The best Assassin names are short, sharp and gone before anyone reads them twice. Generate stealthy Aion 2 Assassin names for both factions.',
    faq: [
      { q: 'What makes a good Assassin name?', a: 'A clean outline and an easy pronunciation help a short alias stand out. Try Nyra for a quiet personal name, Vexira for an elegant edge, or Ashstep for a fleeting-trace theme.' },
      { q: 'Can I generate female Assassin names?', a: 'Yes. Set Gender to Female and Class to Assassin and the generator uses feminine endings such as -ira, -yss and -ith.' }
    ]
  },
  ranger: {
    card: 'Swift, wild names for bow-wielding hunters.',
    lead: 'Hunters of the wilds need names that carry on the wind. Generate Aion 2 Ranger names inspired by bows, hawks and forest trails.',
    faq: [
      { q: 'What are good Ranger names for Aion 2?', a: 'Fenara suggests a landscape, Dawnhawk suggests a lookout, and Raventrail suggests a patient tracker. Start with the place or creature you want to evoke, then keep the name focused on that image.' },
      { q: 'Does the generator check if a Ranger name is available?', a: 'No tool outside the game can check live availability. Generate a shortlist, save your favorites with the ☆ button, then try them at character creation. If one is taken, use ↻ to get spelling variants.' }
    ]
  },
  sorcerer: {
    card: 'Arcane, elemental names for spell-slinging casters.',
    lead: 'Fire, frost and forbidden knowledge. Generate arcane Aion 2 Sorcerer names that sound like they could level a battlefield.',
    faq: [
      { q: 'What are some cool Sorcerer names?', a: 'Xerion suits an arcane scholar. Sunflare feels hot and brilliant; Moonrime feels quiet and cold. Frostcinder deliberately combines opposite elements for a more conflicted character.' },
      { q: 'Are Sorcerer names different from Spiritmaster names?', a: 'Both are magic users, but this generator gives Sorcerers sharper, elemental-sounding names, while Spiritmaster names lean ethereal and spirit-themed.' }
    ]
  },
  spiritmaster: {
    card: 'Ethereal names for summoners who command spirits.',
    lead: 'A Spiritmaster never fights alone. Generate ethereal Aion 2 Spiritmaster names for summoners who bind elemental spirits to their will.',
    faq: [
      { q: 'What is a good Spiritmaster name?', a: 'Ethora and Selaen offer soft personal names. Starwisp suggests a gentle companion, while Voidbond and Ashpact emphasize the agreement between a summoner and a spirit.' },
      { q: 'What does the Spiritmaster do in Aion 2?', a: 'It is a summoner and controller class that commands spirits to pressure enemies and provide crowd control and utility.' }
    ]
  },
  cleric: {
    card: 'Graceful, holy names for healers.',
    lead: 'Every party remembers its healer\'s name. Generate graceful, holy Aion 2 Cleric names for Elyos and Asmodian healers.',
    faq: [
      { q: 'What are some pretty Cleric names for Aion 2?', a: 'Celara and Amariel have flowing personal-name forms. Dawnmercy feels reassuring, while Moonvigil offers a quieter protective mood. These suggestions can suit any character whose personality matches the theme.' },
      { q: 'Is the Cleric the healer class in Aion 2?', a: 'Yes. The Cleric is the main healer, so this generator gives it soft, holy-sounding names.' }
    ]
  },
  chanter: {
    card: 'Rhythmic, mantra-inspired names for battle supports.',
    lead: 'Half warrior, half hymn. Generate rhythmic Aion 2 Chanter names for the support class that fights on the front line while empowering the party.',
    faq: [
      { q: 'What is a good Chanter name?', a: 'Loren and Haren have an even two-beat cadence. Dawnecho suggests a rallying voice, Ashverse a traveling refrain, and Stormsong a forceful battle chorus. Say the name aloud to choose the rhythm you prefer.' },
      { q: 'What role does the Chanter play in Aion 2?', a: 'The Chanter is a support and melee hybrid that empowers allies while still fighting up close, so its names lean toward chant and mantra themes.' }
    ]
  }
};

// ---------------------------------------------------------------- pages
const pages = [];

// Home
pages.push({
  path: '/',
  title: 'Aion 2 Name Generator — Elyos & Asmodian Names (Free)',
  description: 'Free Aion 2 name generator for Elyos and Asmodian characters. Pick faction, class and tone, get 10 names instantly. No signup. Runs in your browser.',
  h1: 'Aion 2 Name Generator — Elyos & Asmodian Names',
  eyebrow: 'Free · Elyos & Asmodian · All 8 classes',
  lead: 'Find a readable fantasy name for your Aion 2 character. Pick your faction, class and gender, then try your favorites at character creation.',
  app: true,
  body: () => `${generatorWidget({ seed: 11 })}
${favoritesPanel}
${variantTool}
<div class="content">
<h2>Pick a faction-specific generator</h2>
<p>Elyos and Asmodians don't just fight each other, they sound different too. Each faction page tunes the syllables to its side of Atreia.</p>
</div>
${factionCards()}
<div class="content">
<h2>Aion 2 name generators by class</h2>
<p>Every class page uses the same engine but adds class-flavored roots and themed words, so a Templar gets names like <em>Aldric</em> or <em>Dawnward</em> while an Assassin gets <em>Nyrix</em> or <em>Duskfang</em>.</p>
</div>
${classCards()}
<div class="content">
<h2>How to use the Aion 2 Name Generator</h2>
<ol>
<li><strong>Choose a faction.</strong> Elyos names are bright and flowing, Asmodian names are dark and sharp. Leave it on <em>Any</em> for a mix.</li>
<li><strong>Set gender and class.</strong> Gender changes the endings (-iel vs -ius, -ira vs -oth). Class adds themed roots and words.</li>
<li><strong>Pick a tone.</strong> <em>Fantasy</em> builds names from syllables, <em>Lore-inspired</em> borrows roots from Aion's gods and places, <em>Epic compound</em> creates names like Dawnblade, and <em>Short &amp; clean</em> keeps them tiny.</li>
<li><strong>Refine.</strong> Use <em>Starts with</em> for a specific initial and the slider to cap the length.</li>
<li><strong>Copy and save.</strong> Click a name to copy it, ☆ to add it to your shortlist, or ↻ to get spelling variants if it's already taken in game.</li>
</ol>

<h2>What makes a good Aion 2 character name?</h2>
<ul>
<li><strong>It fits your faction.</strong> Aion's lore gives each side its own sound. Elyos Empyrean Lords have names like Ariel, Kaisinel and Yustiel, while the Asmodians follow Azphel, Zikel and Marchutan. Matching that sound makes your Daeva feel at home.</li>
<li><strong>It's easy to read and type.</strong> Party members will whisper you, guildmates will call you out in voice chat, and enemies will see it over your head in the Abyss.</li>
<li><strong>It gives you alternatives.</strong> The generator avoids exact matches to a curated list of well-known Aion characters. Save a few names and try spelling variants; availability and naming rules still need to be checked on your server.</li>
<li><strong>It ages well.</strong> Jokes and memes get old fast. A name you'll still like at max level is worth the extra minute.</li>
</ul>

<h2>Sample Aion 2 names</h2>
<p>A quick taste. Click any name to copy it, or browse hundreds more in the <a href="/aion-2-names-list/">Aion 2 names list</a>.</p>
<h3>Elyos</h3>
${nameList(names({ faction: 'elyos' }, 14, 101))}
<h3>Asmodian</h3>
${nameList(names({ faction: 'asmodian' }, 14, 202))}
</div>`,
  faq: [
    { q: 'Is this Aion 2 name generator free?', a: 'Yes. It runs entirely in your browser, with no sign-up and no limits. Generate as many names as you like.' },
    { q: 'Are the generated names available in Aion 2?', a: 'The names are randomly built, so most are uncommon, but no outside tool can check live availability on your server. Save a shortlist with ☆ and try them at character creation. If one is taken, the ↻ button suggests spelling variants.' },
    { q: 'Is 12 characters the official Aion 2 name limit?', a: 'It is this tool\'s default preference. NCSOFT confirmed 1–12 characters for the Korean reservation event on October 16, 2025. We have not verified current Global or Taiwan limits. See the <a href="#naming-rules">regional rules and official sources</a> before choosing a name.' },
    { q: 'What\'s the difference between Elyos and Asmodian names?', a: 'Elyos names use soft, bright sounds and angelic endings like -iel, -ael and -ia. Asmodian names use harsher consonants (z, k, th, r) and endings like -oth, -ak and -eth. You can try both on the <a href="/elyos-name-generator/">Elyos</a> and <a href="/asmodian-name-generator/">Asmodian</a> pages.' },
    { q: 'Which classes does the generator support?', a: 'All eight Aion 2 classes: Gladiator, Templar, Assassin, Ranger, Sorcerer, Spiritmaster, Cleric and Chanter. Each has its own page with themed names.' },
    { q: 'Can I use these names for other games?', a: 'Of course. The names are original fantasy names, so they work for any MMORPG, tabletop campaign or story.' }
  ],
  schema: 'app',
  priority: '1.0'
});

// Faction pages
const FACTION_COPY = {
  elyos: {
    title: 'Elyos Name Generator – Aion 2 Elyos Names (Male & Female)',
    description: 'Generate Elyos names for Aion 2. Bright, angelic male and female names inspired by Elysea and the Empyrean Lords, for every class. Free and instant.',
    h1: 'Elyos Name Generator',
    eyebrow: 'Aion 2 · Faction of Light',
    lead: 'Radiant, flowing names for the children of Elysea. Generate male and female Elyos names for any Aion 2 class.',
    about: `<p>The Elyos live in <strong>Elysea</strong>, the sunlit upper half of the shattered world of Atreia, and their capital is the gleaming city of Sanctum. They see themselves as the protectors of the light. Their names reflect that: open vowels, gentle consonants and a strong angelic flavor.</p>
<p>The clearest model is the Elyos Empyrean Lords: <strong>Ariel</strong>, <strong>Kaisinel</strong>, <strong>Nezekan</strong>, <strong>Yustiel</strong> and <strong>Vaizel</strong>. Notice the <em>-el</em> and <em>-iel</em> endings? This generator uses them, plus classical endings like <em>-ion</em>, <em>-ius</em> and <em>-ias</em> for male names and <em>-ia</em>, <em>-ara</em>, <em>-ielle</em> and <em>-wyn</em> for female names.</p>`,
    patterns: [
      ['Male endings', '-iel, -ael, -ion, -ius, -ias, -eon, -orn'],
      ['Female endings', '-iel, -ia, -ara, -ella, -ielle, -yra, -wyn'],
      ['Common openings', 'Ae, Al, Ari, Cel, Ely, Lu, Ori, Sol, Aur'],
      ['Lore roots', 'Ari (Ariel), Kais (Kaisinel), Nez (Nezekan), Yus (Yustiel), Vai (Vaizel), San (Sanctum), Po (Poeta)'],
      ['Compound words', 'Dawn, Light, Sun, Star, Silver, Gold, Halo, Aether, Glory']
    ],
    faq: [
      { q: 'What do Elyos names sound like?', a: 'Elyos names are bright and melodic, with plenty of vowels and soft consonants like l, r, s and v. Many end in -iel or -ael, echoing Elyos Empyrean Lords such as Ariel, Kaisinel and Yustiel.' },
      { q: 'Can I generate female Elyos names?', a: 'Yes. Set Gender to Female in the generator. Female Elyos names use endings like -ia, -ara, -ielle and -wyn, for example Celara, Lirielle or Aurwyn.' },
      { q: 'Can I name my character after an Empyrean Lord?', a: 'This generator excludes exact matches to the twelve Empyrean Lords to help you find your own name. The Lore-inspired tone still uses their sound patterns. This is our originality filter, not an official restriction; check acceptance and availability in game.' }
    ]
  },
  asmodian: {
    title: 'Asmodian Name Generator – Aion 2 Asmodian Names',
    description: 'Generate dark Asmodian names for Aion 2. Sharp male and female names inspired by Asmodae, Pandaemonium and the Asmodian Empyrean Lords. Free, all classes.',
    h1: 'Asmodian Name Generator',
    eyebrow: 'Aion 2 · Faction of Shadow',
    lead: 'Sharp, shadowed names for the survivors of Asmodae. Generate male and female Asmodian names for any Aion 2 class.',
    about: `<p>The Asmodians live in <strong>Asmodae</strong>, the cold, dim lower half of Atreia, ruled from the fortress-city of Pandaemonium. Generations in the dark hardened them, and their names sound like it: tight consonant clusters, deep vowels and hard endings.</p>
<p>Look to the Asmodian Empyrean Lords for the template: <strong>Azphel</strong>, <strong>Zikel</strong>, <strong>Marchutan</strong>, <strong>Triniel</strong> and <strong>Lumiel</strong>. This generator builds on that palette with openings like <em>Az-, Kr-, Mor-, Vor-</em> and <em>Zu-</em>, and endings like <em>-oth, -ak, -gar</em> and <em>-eth</em> for men and <em>-ys, -iss, -yx</em> and <em>-esh</em> for women.</p>`,
    patterns: [
      ['Male endings', '-oth, -ak, -gar, -uth, -ez, -kar, -mar, -ax'],
      ['Female endings', '-ys, -ra, -eth, -iss, -yx, -esh, -ith, -yne'],
      ['Common openings', 'Az, Bra, Dra, Kha, Kr, Mor, Vor, Xa, Zu, Zik'],
      ['Lore roots', 'Aza (Azphel), Zik (Zikel), Mar (Marchutan), Trin (Triniel), Lum (Lumiel), Panda (Pandaemonium), Mor (Morheim)'],
      ['Compound words', 'Dusk, Shadow, Night, Blood, Ash, Raven, Void, Umbra, Dread']
    ],
    faq: [
      { q: 'What do Asmodian names sound like?', a: 'Asmodian names are darker and sharper than Elyos names. They use hard consonants like z, k, r and th and endings such as -oth, -ak and -eth, echoing lords like Azphel, Zikel and Marchutan.' },
      { q: 'Can I generate female Asmodian names?', a: 'Yes. Set Gender to Female. You\'ll get names like Vyrys, Morith, Zykess or Shaleth, which are dark but elegant.' },
      { q: 'Do Asmodian names have to sound evil?', a: 'Not at all. Asmodians aren\'t villains, they\'re survivors. Lore-inspired names like Lumena or Trinara are dark without being cartoonishly evil.' }
    ]
  }
};

for (const fk of ['elyos', 'asmodian']) {
  const C = FACTION_COPY[fk];
  const other = fk === 'elyos' ? 'asmodian' : 'elyos';
  const L = NG.FACTIONS[fk].label;
  pages.push({
    path: `/${fk}-name-generator/`,
    title: C.title,
    description: C.description,
    h1: C.h1,
    eyebrow: C.eyebrow,
    lead: C.lead,
    faction: fk,
    app: true,
    crumbs: [[L + ' Name Generator']],
    body: () => `${generatorWidget({ faction: fk, seed: fk === 'elyos' ? 21 : 22 })}
${favoritesPanel}
<div class="content">
<h2>About ${L} names</h2>
${C.about}
<h2>${L} naming patterns</h2>
<div class="table-wrap"><table><tbody>${C.patterns.map(([a, b]) => `<tr><th scope="row">${a}</th><td>${b}</td></tr>`).join('')}</tbody></table></div>

<h2>${L} male names</h2>
${nameList(names({ faction: fk, gender: 'm', style: 'fantasy' }, 16, fk === 'elyos' ? 31 : 32))}
<h2>${L} female names</h2>
${nameList(names({ faction: fk, gender: 'f', style: 'fantasy' }, 16, fk === 'elyos' ? 41 : 42))}
<h2>Lore-inspired ${L} names</h2>
<p>Built on roots borrowed from ${L} gods and places.</p>
${nameList(names({ faction: fk, style: 'lore' }, 16, fk === 'elyos' ? 51 : 52))}
<h2>Epic ${L} names</h2>
${nameList(names({ faction: fk, style: 'compound' }, 14, fk === 'elyos' ? 61 : 62))}

<h2>${L} names by class</h2>
<p>Want something tuned to your role? Every class page lets you lock the faction to ${L}.</p>
</div>
${classCards()}
<div class="content">
<p>Playing the other side? Try the <a href="/${other}-name-generator/">${NG.FACTIONS[other].label} name generator</a>, or go back to the main <a href="/">Aion 2 name generator</a>.</p>
</div>`,
    faq: C.faq,
    schema: 'app',
    priority: '0.9'
  });
}

// Class pages
CLASS_KEYS.forEach((k, i) => {
  const K = NG.CLASSES[k];
  const C = CLASS_COPY[k];
  pages.push({
    path: classUrl(k),
    title: `Aion 2 ${K.label} Name Generator – Elyos & Asmodian Names`,
    description: `Free Aion 2 ${K.label} name generator. ${C.card} Male & female names for Elyos and Asmodian, copied in one click.`,
    h1: `Aion 2 ${K.label} Name Generator`,
    eyebrow: `${K.role} · Elyos & Asmodian`,
    lead: C.lead,
    app: true,
    crumbs: [[`${K.label} Name Generator`]],
    body: () => `${generatorWidget({ cls: k, seed: 70 + i })}
${favoritesPanel}
<div class="content">
${classGuide(k)}

<h2>Other Aion 2 class name generators</h2>
</div>
${classCards(k)}
<div class="content"><p>Or generate by faction: <a href="/elyos-name-generator/">Elyos names</a> · <a href="/asmodian-name-generator/">Asmodian names</a> · <a href="/aion-2-names-list/">full Aion 2 names list</a>.</p></div>`,
    faq: [
      ...C.faq,
      { q: `How do I use the ${K.label} name generator?`, a: `The class is already set to ${K.label}. Choose Elyos or Asmodian, pick a gender and tone, then hit Generate. Click any name to copy it, or ☆ to save it to your shortlist.` }
    ],
    schema: 'app',
    priority: '0.8'
  });
});

// Names list + servers
// Official pairings from NCSOFT's "New Server and Matchmaking Information" notice (Oct 4, 2026).
// Each entry is [Elyos server, Asmodian server]. aa = Advanced Access servers, launch = commercial launch servers.
const SERVERS = {
  Europe: {
    aa: [['Siel', 'Israphel'], ['Nezekan', 'Zikel'], ['Vaizel', 'Triniel'], ['Kaisinel', 'Lumiel'], ['Yustiel', 'Marchutan'], ['Ariel', 'Azphel'], ['Fregion', 'Ereshkigal'], ['Meslamtaeda', 'Beritra'], ['Hithanya', 'Nemon']],
    launch: [['Nania', 'Hadala'], ['Tahavatha', 'Ludra'], ['Luteros', 'Ulgorn'], ['Phernos', 'Munin'], ['Daminu', 'Odar'], ['Kasaka', 'Zemurru'], ['Bakarma', 'Kromede'], ['Tsenka', 'Quai'], ['Kochi', 'Baba'], ['Ishtar', 'Fafnir'], ['Tiamat', 'Indnath'], ['Gauss', 'Agnita'], ['Lamuatan', 'Atiel']]
  },
  'NA East': {
    aa: [['Siel', 'Israphel'], ['Nezekan', 'Zikel'], ['Vaizel', 'Triniel']],
    launch: [['Kaisinel', 'Lumiel'], ['Yustiel', 'Marchutan'], ['Ariel', 'Azphel'], ['Fregion', 'Ereshkigal'], ['Meslamtaeda', 'Beritra']]
  },
  'NA West': {
    aa: [['Siel', 'Israphel'], ['Nezekan', 'Zikel']],
    launch: [['Vaizel', 'Triniel'], ['Kaisinel', 'Lumiel'], ['Yustiel', 'Marchutan']]
  },
  'Latin America': {
    aa: [['Siel', 'Israphel'], ['Nezekan', 'Zikel']],
    launch: [['Vaizel', 'Triniel'], ['Kaisinel', 'Lumiel'], ['Yustiel', 'Marchutan'], ['Ariel', 'Azphel']]
  },
  Asia: {
    aa: [['Siel', 'Israphel'], ['Nezekan', 'Zikel'], ['Vaizel', 'Triniel']],
    launch: [['Kaisinel', 'Lumiel'], ['Yustiel', 'Marchutan'], ['Ariel', 'Azphel'], ['Fregion', 'Ereshkigal'], ['Meslamtaeda', 'Beritra'], ['Hitani', 'Nemon']]
  }
};
const SERVERS_CHECKED = 'October 4, 2026';
const pairList = (pairs, side) => pairs.map((p) => p[side]).join(', ');
// Full Elyos / Asmodian / pairing table for one region
function serverTable(region) {
  const R = SERVERS[region];
  const rows = (pairs, type) => pairs.map(([e, a]) => `<tr><td>${type}</td><td class="elyos">${e}</td><td class="asmo">${a}</td></tr>`).join('');
  return `<div class="table-wrap"><table>
<thead><tr><th>Server type</th><th>Elyos server</th><th>Asmodian server</th></tr></thead>
<tbody>${rows(R.aa, 'Advanced Access')}${rows(R.launch, 'Launch')}</tbody>
</table></div>`;
}
// Compact table: one row per region and server type
function regionSummaryTable(regions) {
  return `<div class="table-wrap"><table>
<thead><tr><th>Region</th><th>Type</th><th>Elyos servers</th><th>Asmodian servers</th></tr></thead>
<tbody>${regions.map((r) => ['aa', 'launch'].map((t) => `<tr><th scope="row">${r}</th><td>${t === 'aa' ? 'Advanced Access' : 'Launch'}</td><td class="elyos">${pairList(SERVERS[r][t], 0)}</td><td class="asmo">${pairList(SERVERS[r][t], 1)}</td></tr>`).join('')).join('')}</tbody>
</table></div>`;
}
const LORDS = [
  ['Ariel', 'Elyos', 'Lady of Light; leader of the Elyos lords'],
  ['Kaisinel', 'Elyos', 'Lord of Illusion'],
  ['Nezekan', 'Elyos', 'Lord of Justice'],
  ['Yustiel', 'Elyos', 'Lady of Life'],
  ['Vaizel', 'Elyos', 'Elyos Empyrean Lord'],
  ['Azphel', 'Asmodian', 'Lord of Darkness; leader of the Asmodian lords'],
  ['Marchutan', 'Asmodian', 'Lord of Fate'],
  ['Zikel', 'Asmodian', 'Lord of Destruction'],
  ['Triniel', 'Asmodian', 'Asmodian Empyrean Lord'],
  ['Lumiel', 'Asmodian', 'Asmodian Empyrean Lord'],
  ['Siel', 'Neither', 'Lady of Time'],
  ['Israphel', 'Neither', 'Lord of Space']
];

pages.push({
  path: '/aion-2-names-list/',
  title: 'Aion 2 Names List & Server Names (2026) – 250+ Names',
  description: 'Big list of Aion 2 names: Elyos and Asmodian male and female names, names for every class, cool and short names, plus the full Aion 2 server name list.',
  h1: 'Aion 2 Names List & Server Names',
  updated: TRANSFER.updated,
  eyebrow: `Updated ${TRANSFER.updatedHuman}`,
  lead: 'Hundreds of ready-to-use Aion 2 character names sorted by faction, class and style, plus the full list of Aion 2 server names and the lore behind them.',
  app: true,
  crumbs: [['Aion 2 Names List']],
  body: () => `<div class="content">
<ul class="toc">
<li><a href="#elyos-names">Elyos names</a></li>
<li><a href="#asmodian-names">Asmodian names</a></li>
<li><a href="#class-names">Names by class</a></li>
<li><a href="#cool-names">Cool names</a></li>
<li><a href="#short-names">Short names</a></li>
<li><a href="#lore-names">Lore names</a></li>
<li><a href="#servers">Server names</a></li>
<li><a href="#empyrean-lords">Empyrean Lords</a></li>
</ul>
<p class="note">Click any name to copy it. These lists are fixed so you can bookmark them. Want fresh ideas? Use the <a href="/">Aion 2 name generator</a> for unlimited random names.</p>

<h2 id="elyos-names">Elyos names</h2>
<div class="cols">
<div><h3>Male Elyos names</h3>${nameList(names({ faction: 'elyos', gender: 'm' }, 24, 1001))}</div>
<div><h3>Female Elyos names</h3>${nameList(names({ faction: 'elyos', gender: 'f' }, 24, 1002))}</div>
</div>
<p><a href="/elyos-name-generator/">Generate more Elyos names →</a></p>

<h2 id="asmodian-names">Asmodian names</h2>
<div class="cols">
<div><h3>Male Asmodian names</h3>${nameList(names({ faction: 'asmodian', gender: 'm' }, 24, 1003))}</div>
<div><h3>Female Asmodian names</h3>${nameList(names({ faction: 'asmodian', gender: 'f' }, 24, 1004))}</div>
</div>
<p><a href="/asmodian-name-generator/">Generate more Asmodian names →</a></p>

<h2 id="class-names">Aion 2 names by class</h2>
${CLASS_KEYS.map((k, i) => `<h3>${NG.CLASSES[k].label} names</h3>${nameList(names({ cls: k }, 12, 1100 + i))}<p><a href="${classUrl(k)}">${NG.CLASSES[k].label} name generator →</a></p>`).join('\n')}

<h2 id="cool-names">Cool Aion 2 names</h2>
<p>Epic two-part names that tell everyone what you're about.</p>
<div class="cols">
<div><h3>Elyos</h3>${nameList(names({ faction: 'elyos', style: 'compound' }, 18, 1201))}</div>
<div><h3>Asmodian</h3>${nameList(names({ faction: 'asmodian', style: 'compound' }, 18, 1202))}</div>
</div>

<h2 id="short-names">Short Aion 2 names (5 letters or fewer)</h2>
<p>Short names are easy to read in crowded fights and easy to type, but they're also the first to go. Grab one early.</p>
${nameList(names({ style: 'short', maxLen: 5 }, 30, 1301))}

<h2 id="lore-names">Lore-inspired names</h2>
<p>Built from the roots of Aion's gods, cities and regions: Sanctum, Poeta, Pandaemonium, Ishalgen, Morheim and more.</p>
<div class="cols">
<div><h3>Elyos lore names</h3>${nameList(names({ faction: 'elyos', style: 'lore' }, 16, 1401))}</div>
<div><h3>Asmodian lore names</h3>${nameList(names({ faction: 'asmodian', style: 'lore' }, 16, 1402))}</div>
</div>
</div>

${variantTool}
${favoritesPanel}
${namingRules}

<div class="content">
<h2 id="servers">Aion 2 server names</h2>
<p>Aion 2 servers are split by faction: you create an Elyos character on an Elyos server or an Asmodian character on an Asmodian server. Servers are linked so you can still meet the other faction through rifts and in the Abyss. Name uniqueness was per server in the 2025 Korean reservation event; check your current region's rules before relying on the same name being available elsewhere.</p>

<h3>European servers</h3>
<p>Each row is an Elyos server and the Asmodian server it's paired with for the Abyss and other cross-faction modes. <strong>Advanced Access</strong> servers opened first, in the early-access period before launch; <strong>Launch</strong> servers opened for the free-to-play launch on October 5, 2026. Newer worlds are a great chance to claim a short or popular name before anyone else does.</p>
${serverTable('Europe')}

<h3>North America, Latin America and Asia servers</h3>
${regionSummaryTable(['NA East', 'NA West', 'Latin America', 'Asia'])}
<p class="note">Server lists and pairings change with new launches, merges and rebalancing. This list follows NCSOFT's official server and matchmaking notice as of ${SERVERS_CHECKED}. Your in-game server selection screen is always the final word.</p>
</div>
<div class="cards">
<a class="card" href="/aion-2-server-transfer/"><span class="tag">EA Oct 14 · Launch Oct 21</span><strong>Aion 2 Server Transfer Guide</strong><span>Transfer windows, storage rules and a backup-name shortlist.</span></a>
<a class="card" href="/"><span class="tag">Generator</span><strong>Aion 2 Name Generator</strong><span>Your name is taken on the new server? Generate fresh ideas in one click.</span></a>
</div>
<div class="content">

<h3>Where do Aion 2 server names come from?</h3>
<p>Most server names come straight from Aion lore: the twelve <strong>Empyrean Lords</strong> (Siel, Israphel, Ariel, Azphel and the rest), the <strong>Balaur Dragon Lords</strong> (Beritra, Ereshkigal, Meslamtaeda, Fregion, Tiamat) and other mythic figures. Use their sound as inspiration for your own name. The generator excludes exact matches to these characters; the reference lists below retain their official names.</p>

<h2 id="empyrean-lords">The Twelve Empyrean Lords</h2>
<div class="table-wrap"><table>
<thead><tr><th>Lord</th><th>Faction</th><th>Known as</th></tr></thead>
<tbody>${LORDS.map(([n, f, t]) => `<tr><td class="${f === 'Elyos' ? 'elyos' : f === 'Asmodian' ? 'asmo' : ''}">${n}</td><td>${f}</td><td>${t}</td></tr>`).join('')}</tbody>
</table></div>
<p>Siel and Israphel held the Aetheric Field together and belong to neither faction, which is why their names often sit at the top of both server lists.</p>
</div>`,
  faq: [
    { q: 'Are Aion 2 character names unique per server?', a: 'NCSOFT confirmed per-server uniqueness for the Korean name-reservation event in October 2025. We have not verified that this applies to every current region. Check the <a href="#naming-rules">regional rules</a> and your character-creation screen.' },
    { q: 'What are the Aion 2 server names?', a: `In Europe, Elyos servers include ${SERVERS.Europe.aa.slice(0, 6).map((p) => p[0]).join(', ')} and more, while Asmodian servers include ${SERVERS.Europe.aa.slice(0, 6).map((p) => p[1]).join(', ')} and more. See the full tables above, based on NCSOFT's server notice as of ${SERVERS_CHECKED}.` },
    { q: 'Can I transfer my character to another Aion 2 server?', a: 'Yes. The October 2026 windows are October 14–21 for Early Access and October 21–28 for launch servers (European dates, maintenance boundaries). See the <a href="/aion-2-server-transfer/">transfer guide</a> for eligibility, costs and renaming.' },
    { q: 'Why are Aion 2 servers named Siel, Israphel, Ariel and Azphel?', a: 'They\'re named after the Empyrean Lords and other figures from Aion lore. Siel (Lady of Time) and Israphel (Lord of Space) held the Aetheric Field, Ariel leads the Elyos lords and Azphel leads the Asmodian lords.' },
    { q: 'My favorite name is taken. What now?', a: 'Use the variant maker above. It keeps the sound but changes the spelling (Ariel → Aryel, Ariell, Arielle). Or try the same name on a newer server.' }
  ],
  schema: 'article',
  priority: '0.9'
});

// Server transfer guide
// Global rules: NCSOFT's Server Transfer Products Info and Q&A (October 9, 2026).
pages.push({
  path: '/aion-2-server-transfer/',
  title: 'Aion 2 Server Transfer – Oct 14/21 Dates, Names & Storage',
  description: 'Aion 2 transfer guide: Early Access Oct 14–21, launch Oct 21–28, mandatory renaming, Server Storage exclusions and character-slot costs. European dates.',
  h1: 'Aion 2 Server Transfer Guide',
  updated: TRANSFER.updated,
  eyebrow: `EA Oct 14 · Launch Oct 21 · Updated ${TRANSFER.updatedHuman}`,
  lead: 'Plan your move, check what travels with your Daeva, and prepare a name shortlist before choosing a destination.',
  app: true,
  crumbs: [['Aion 2 Server Transfer']],
  body: () => `<div class="content">
<ul class="toc">
<li><a href="#quick-facts">Quick facts</a></li>
<li><a href="#who-can-transfer">Who can move where</a></li>
<li><a href="#character-names">Your character name</a></li>
<li><a href="#storage">Storage and character slots</a></li>
<li><a href="#checklist">Prep checklist</a></li>
<li><a href="#unconfirmed">Future transfers</a></li>
<li><a href="#faq">FAQ</a></li>
</ul>
<p class="note">Based on NCSOFT's <a href="${TRANSFER.productsUrl}">Server Transfer Products Info</a> and <a href="${TRANSFER.qaUrl}">Server Transfer Q&amp;A</a>, published ${TRANSFER.announced}. Reviewed ${TRANSFER.updatedHuman}.</p>

<h2 id="quick-facts">Aion 2 server transfer: quick facts</h2>
<div class="table-wrap"><table><tbody>
<tr><th scope="row">Early Access window</th><td><strong>October 14–21, 2026 (CEST)</strong> / October 13–20 (PDT)</td></tr>
<tr><th scope="row">Launch server window</th><td><strong>October 21–28, 2026 (CEST/CET)</strong> / October 20–27 (PDT)</td></tr>
<tr><th scope="row">Transfer price</th><td>0 Quna base fee and per character; 1,000 Quna per extra destination character slot needed</td></tr>
<tr><th scope="row">Account limit</th><td>One transfer across the entire event; multiple characters can move together</td></tr>
</tbody></table></div>
<p>Each window opens after maintenance and closes before the following maintenance. Apply through <strong>In-Game Shop → Server Transfer</strong> during your region's daily hours; see the <a href="${TRANSFER.productsUrl}">official schedule</a>.</p>

<h2 id="who-can-transfer">Who can move where</h2>
<p>Stay within your <strong>faction and region</strong>. Early Access (also called Advanced Access) characters can move only to Early Access servers. Departure and destination capacity limits both apply.</p>
${regionSummaryTable(Object.keys(SERVERS))}
<p class="note">Server counts were checked ${SERVERS_CHECKED}; they do not show live transfer availability. See the <a href="/aion-2-names-list/#servers">full server list with pairings</a>.</p>

<h2 id="character-names">Will you keep your character name?</h2>
<p><strong>Every transferred character becomes <code>@TemporaryName</code>, even without a name collision.</strong> Choose a name on first login; your previous name is reusable only if available on the destination. This Global rule is confirmed in the <a href="${TRANSFER.qaUrl}">official Q&amp;A</a>.</p>
<ul>
<li><strong>Prepare three to five backups.</strong> Save them with ☆ below so they're one click away.</li>
<li><strong>Keep the sound, change the spelling.</strong> If your name is taken, try a variant: Ariel → Aryel, Ariell or Arielle.</li>
<li><strong>Export your shortlist.</strong> Keep a TXT copy handy while switching between the game and your browser.</li>
</ul>
</div>
${variantTool}
${generatorWidget({ seed: 31 })}
${favoritesPanel}
<div class="content">

<h2 id="storage">What happens to storage and character slots?</h2>
<p><strong>Server Storage items and Kina stay behind.</strong> Put anything you need in the transferring character's inventory or Character Storage. Character Storage contents and expansions travel with you; Server Storage keeps the higher expansion count of the two servers. Purchased character-slot expansions remain on the original server. See the <a href="${TRANSFER.qaUrl}">storage and slot answers</a>.</p>

<h2 id="checklist">Before requesting a transfer</h2>
<ol>
<li><strong>Check eligibility:</strong> level 10+, apply from a village, no Legion membership or pending application, and no active Duty Missions.</li>
<li><strong>Clear pending items:</strong> Market listings, collections and proceeds; Shop Storage (including Founder’s Pack); and unclaimed mail.</li>
<li><strong>Review your destination.</strong> Agree on a server with friends, check its slots, and review the storage guidance above.</li>
<li><strong>Save your names.</strong> Use the <a href="/">Aion 2 name generator</a> or variant maker and export your shortlist before opening the game.</li>
</ol>
<p>Eligibility comes from the <a href="${TRANSFER.productsUrl}">product notice</a>. Completed requests cannot be canceled or reversed.</p>

<h2 id="unconfirmed">What about future transfer events?</h2>
<p>These notices cover October 2026. Dates and prices for any later event remain unannounced.</p>

<h2>Transfer or start fresh?</h2>
<p>Compare the time you have invested in your character with the time you would spend starting again. If you are still early in leveling, creating a character where your friends play may suit you. For an established character, start with the transfer checklist and your destination choice.</p>
</div>
${factionCards('/aion-2-server-transfer/')}`,
  faq: [
    { q: 'When do Aion 2 server transfers start?', a: 'After October 14 maintenance for Early Access; October 21 for launch servers (2026 European dates). See the <a href="#quick-facts">windows and time zones</a>.' },
    { q: 'Are Aion 2 server transfers free?', a: 'Transfers cost 0 Quna; additional destination character slots cost 1,000 Quna each. See <a href="#quick-facts">prices</a>.' },
    { q: 'Can I transfer from Elyos to Asmodian?', a: 'No. Both faction and region must stay the same.' },
    { q: 'Can I move from an Advanced Access server to a launch server?', a: 'No. Early Access characters must choose another Early Access server.' },
    { q: 'Will I keep my character name after a server transfer?', a: 'Every transfer assigns @TemporaryName; rename on first login, even without a collision. See <a href="#character-names">name rules and backup ideas</a>.' },
    { q: 'Does Server Storage move with my character?', a: 'Its items and Kina stay behind. See <a href="#storage">what to move before transferring</a>.' },
    { q: 'Can I play with friends on another server without transferring?', a: 'Yes. All instanced content, including dungeons, is cross-server, so you can group with friends on other servers before or instead of transferring.' }
  ],
  schema: 'article',
  priority: '0.9'
});

// About + privacy
pages.push({
  path: '/about/',
  title: 'About – Aion 2 Name Generator',
  description: 'About aion2namegenerator.org, a free, unofficial fan-made name generator for Aion 2 players.',
  h1: 'About Aion 2 Name Generator',
  lead: 'A small, free fan tool for naming your Daeva.',
  crumbs: [['About']],
  body: () => `<div class="content">
<p>aion2namegenerator.org is a free, fan-made tool that helps Aion 2 players find a character name they'll actually like. Names are generated in your browser from hand-tuned syllable sets for each faction and class, with spelling variants for when your first choice is taken.</p>
<h2>How the names are made</h2>
<p>Each faction has its own sound palette, bright and vowel-rich for the Elyos and hard and consonant-heavy for the Asmodians, inspired by the naming patterns in Aion lore. Class pages add themed roots and words. The engine compares several candidates for readable vowel and consonant patterns, rejects repeated syllables and obvious offensive words, and excludes exact matches to a curated list of well-known Aion characters. Spelling variants use the same filters. Readability is subjective, and this tool cannot verify in-game availability or current regional naming rules.</p>
<h2>Disclaimer</h2>
<p>This is an unofficial fan site. It is not affiliated with, endorsed by or sponsored by NCSOFT. AION and related names are trademarks of NCSOFT Corporation. Server lists are compiled from public information and may be out of date.</p>
<p><a href="/">← Back to the Aion 2 name generator</a></p>
</div>`,
  priority: '0.3'
});
pages.push({
  path: '/privacy/',
  title: 'Privacy Policy – Aion 2 Name Generator',
  description: 'Privacy policy for aion2namegenerator.org.',
  h1: 'Privacy Policy',
  lead: `Last updated ${SITE.updatedHuman}.`,
  crumbs: [['Privacy Policy']],
  body: () => `<div class="content">
<p>We keep this simple: the name generator runs entirely in your browser and doesn't require an account.</p>
<h2>Data stored on your device</h2>
<p>When you save names with the ☆ button, they're stored in your browser's local storage on your own device. They're never sent to us, and you can clear them at any time with the "Clear" button or by clearing your browser data.</p>
<p>Copy and TXT export let you take your shortlist with you. Share filters creates a link containing the selected filters (including any starting letters), sorting choice and a number used to recreate the generated batch. These URL parameters are visible to anyone you share the link with and may appear in hosting logs or page-view analytics. The link does not include your saved names.</p>
<h2>Server logs and third parties</h2>
<p>Like most websites, our hosting provider may keep standard server logs (such as IP address, browser type and pages requested) for security and performance. Fonts are loaded from Google Fonts, which may receive your IP address when fonts load.</p>
<h2>Website analytics</h2>
<p>We use Google Analytics 4 to understand website traffic and interactions, including pages viewed, referral sources, scrolling and device or browser information. Google Analytics uses cookies and pseudonymous identifiers to measure visits. We do not send generated or saved character names to Google Analytics. Google signals and advertising personalization are disabled in our analytics code.</p>
<p>Learn more about how Google uses information from websites in <a href="https://policies.google.com/technologies/partner-sites">Google's partner-site privacy information</a>. You can manage cookies through your browser settings or use the <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out browser add-on</a>.</p>
<p>We also use self-hosted Plausible Analytics at stats.blackholeenglish.com to measure page views, referral sources, browser and device information, approximate location, page engagement, outbound link clicks, file downloads and form submission events without analytics cookies. The analytics server receives technical request information, including your IP address, to process visits. Generated or saved character names and form field values are not included in these analytics events.</p>
<h2>Children</h2>
<p>This site does not ask visitors, including children, to provide names, email addresses or other contact details to use the generator.</p>
<h2>Changes</h2>
<p>If this policy changes, the date at the top of this page will be updated.</p>
</div>`,
  priority: '0.2'
});

// ---------------------------------------------------------------- layout
const NAV = [
  ['/', 'Name Generator'],
  ['/elyos-name-generator/', 'Elyos'],
  ['/asmodian-name-generator/', 'Asmodian'],
  ['/templar-name-generator/', 'Classes'],
  ['/aion-2-names-list/', 'Names List & Servers'],
  ['/aion-2-server-transfer/', 'Server Transfer']
];

function jsonLd(page) {
  const url = SITE.url + page.path;
  const graph = [];
  if (page.path === '/') {
    graph.push({ '@type': 'WebSite', '@id': SITE.url + '/#website', url: SITE.url + '/', name: SITE.name, inLanguage: 'en' });
  }
  if (page.schema === 'app') {
    graph.push({
      '@type': 'WebApplication', name: page.h1, url, applicationCategory: 'GameApplication', operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript', description: page.description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    });
  }
  if (page.schema === 'article') {
    graph.push({ '@type': 'Article', headline: page.h1, description: page.description, url, dateModified: page.updated || SITE.updated, author: { '@type': 'Organization', name: SITE.name } });
  }
  if (page.crumbs) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Aion 2 Name Generator', item: SITE.url + '/' }, { '@type': 'ListItem', position: 2, name: page.crumbs[0][0], item: url }]
    });
  }
  if (page.faq) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: stripTags(f.a) } }))
    });
  }
  return graph.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>` : '';
}

function layout(page, v) {
  const url = SITE.url + page.path;
  const isClass = CLASS_KEYS.some((k) => page.path === classUrl(k));
  const nav = NAV.map(([href, label]) => {
    const cur = href === page.path || (label === 'Classes' && isClass);
    return `<li><a href="${href}"${cur ? ' aria-current="page"' : ''}>${label}</a></li>`;
  }).join('');
  const crumbs = page.crumbs
    ? `<nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="/">Aion 2 Name Generator</a></li><li aria-current="page">${esc(page.crumbs[0][0])}</li></ol></nav>`
    : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.ga4MeasurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${SITE.ga4MeasurementId}', {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
</script>
<!-- Self-hosted Plausible analytics -->
<script async src="${SITE.plausibleScriptUrl}"></script>
<script>
  // Keep local development and deployment previews out of Plausible statistics.
  if (window.location.hostname === '${new URL(SITE.url).hostname}') {
    window.plausible = window.plausible || function() {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
    window.plausible.init = window.plausible.init || function(options) {
      window.plausible.o = options || {};
    };
    window.plausible.init();
  }
</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#0d0f17">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/style.css?v=${v.css}">
${jsonLd(page)}
</head>
<body${page.faction ? ` data-faction="${page.faction}"` : ''}>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap">
<a class="brand" href="/">${LOGO}<span>Aion 2 Name Generator</span></a>
<button class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">☰</button>
<nav id="site-nav" aria-label="Main"><ul>${nav}</ul></nav>
</div></header>
<main id="main" class="wrap">
${crumbs}
<section class="hero">
${page.eyebrow ? `<span class="eyebrow">${esc(page.eyebrow)}</span>` : ''}
<h1>${esc(page.h1)}</h1>
${page.lead ? `<p class="lead">${esc(page.lead)}</p>` : ''}
</section>
${page.body()}
${page.faq ? `<div class="content">${faqHtml(page.faq)}</div>` : ''}
</main>
<footer class="site-footer"><div class="wrap">
<div class="foot-grid">
<div><h4>Aion 2 Name Generator</h4><p>Free, unofficial name generator for Aion 2 players. Elyos &amp; Asmodian names for every class.</p></div>
<div><h4>Factions</h4><ul><li><a href="/">Aion 2 Name Generator</a></li><li><a href="/elyos-name-generator/">Elyos Names</a></li><li><a href="/asmodian-name-generator/">Asmodian Names</a></li><li><a href="/aion-2-names-list/">Names List &amp; Servers</a></li><li><a href="/aion-2-server-transfer/">Server Transfer</a></li></ul></div>
<div><h4>Classes</h4><ul>${CLASS_KEYS.slice(0, 4).map((k) => `<li><a href="${classUrl(k)}">${NG.CLASSES[k].label} Names</a></li>`).join('')}</ul></div>
<div><h4>&nbsp;</h4><ul>${CLASS_KEYS.slice(4).map((k) => `<li><a href="${classUrl(k)}">${NG.CLASSES[k].label} Names</a></li>`).join('')}</ul></div>
</div>
<p class="legal">© 2026 aion2namegenerator.org · <a href="/about/">About</a> · <a href="/privacy/">Privacy</a><br>Unofficial fan site, not affiliated with NCSOFT. AION is a trademark of NCSOFT Corporation.</p>
</div></footer>
${page.app ? `<script src="/assets/namegen.js?v=${v.ng}" defer></script>\n<script src="/assets/name-tools.js?v=${v.tools}" defer></script>\n<script src="/assets/app.js?v=${v.app}" defer></script>` : `<script src="/assets/app.js?v=${v.app}" defer></script>`}
</body>
</html>
`;
}

// ---------------------------------------------------------------- build
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
for (const f of ['style.css', 'namegen.js', 'name-tools.js', 'app.js']) fs.copyFileSync(path.join(SRC, 'assets', f), path.join(DIST, 'assets', f));
const v = {
  css: hash(path.join(SRC, 'assets', 'style.css')),
  ng: hash(path.join(SRC, 'assets', 'namegen.js')),
  tools: hash(path.join(SRC, 'assets', 'name-tools.js')),
  app: hash(path.join(SRC, 'assets', 'app.js'))
};

for (const page of pages) {
  const dir = path.join(DIST, page.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), layout(page, v));
}

// 404
fs.writeFileSync(path.join(DIST, '404.html'), layout({
  path: '/404.html', title: 'Page not found – Aion 2 Name Generator', description: 'Page not found.', h1: 'Lost in the Abyss',
  lead: 'This page drifted into a rift. Head back and generate a name instead.',
  body: () => `<div class="content" style="text-align:center"><p><a class="btn" href="/">Open the Aion 2 Name Generator</a></p></div>`
}, v).replace('<meta name="robots" content="index,follow,max-image-preview:large">', '<meta name="robots" content="noindex">'));

// favicon, robots, sitemap
fs.writeFileSync(path.join(DIST, 'favicon.svg'), LOGO.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '));
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${SITE.url}${p.path}</loc><lastmod>${p.updated || SITE.updated}</lastmod><priority>${p.priority || '0.5'}</priority></url>`).join('\n')}
</urlset>
`);

console.log(`Built ${pages.length} pages -> ${DIST}`);
pages.forEach((p) => console.log('  ' + p.path));
