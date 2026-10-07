// Static site builder for aion2namegenerator.org
// Usage: node build.mjs   ->  outputs ./dist
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const NG = require('./src/assets/namegen.js');

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const SITE = {
  url: 'https://aion2namegenerator.org',
  name: 'Aion 2 Name Generator',
  updated: '2026-10-07',
  updatedHuman: 'October 7, 2026'
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
<label class="field"><span>Max length: <b class="len-out">12</b></span><input type="range" name="maxLen" min="4" max="16" value="12"></label>
</div>
<div class="gen-actions"><button class="btn" type="submit">Generate Names</button><button type="button" class="btn btn-ghost btn-sm copy-all">Copy all</button><p class="hint">Click a name to copy · ☆ save · ↻ spelling variants if it's taken</p></div>
</form>
<ul class="results" aria-live="polite">${initial
    .map((n) => `<li class="name-card" data-faction="${n.faction}"><span class="name-text">${esc(n.name)}</span><span class="name-meta">${NG.FACTIONS[n.faction].label} · ${n.gender === 'f' ? 'Female' : 'Male'}${n.cls ? ' · ' + NG.CLASSES[n.cls].label : ''}</span></li>`)
    .join('')}</ul>
</section>`;
}

const favoritesPanel = `<section class="panel favorites" aria-label="Saved names">
<div class="panel-head"><h3>★ Your saved names</h3><button type="button" class="btn btn-ghost btn-sm fav-clear" hidden>Clear</button></div>
<p class="fav-empty">Tap ☆ on any name to keep a shortlist here. It's stored only in your browser.</p>
<ul class="results"></ul>
</section>`;

const variantTool = `<section class="panel" id="variant-tool" aria-label="Name variant maker">
<h3>Name already taken? Make a variant</h3>
<p class="hint">Character names are unique, so popular picks go fast. Type your favorite and get spelling variants that keep the same sound.</p>
<form class="inline-form"><input type="text" placeholder="e.g. Ariel" maxlength="16" aria-label="Name to vary" autocomplete="off" spellcheck="false"><button class="btn" type="submit">Show variants</button></form>
<ul class="results"></ul>
</section>`;

// ---------------------------------------------------------------- shared blocks
function classCards(exclude) {
  return `<div class="cards">${CLASS_KEYS.filter((k) => k !== exclude)
    .map((k) => `<a class="card" href="${classUrl(k)}"><span class="tag">${NG.CLASSES[k].role}</span><strong>${NG.CLASSES[k].label} Name Generator</strong><span>${esc(CLASS_COPY[k].card)}</span></a>`)
    .join('')}</div>`;
}
const factionCards = `<div class="cards">
<a class="card elyos" href="/elyos-name-generator/"><span class="tag">Light · Elysea</span><strong>Elyos Name Generator</strong><span>Bright, flowing names with angelic -iel and -ael endings.</span></a>
<a class="card asmodian" href="/asmodian-name-generator/"><span class="tag">Shadow · Asmodae</span><strong>Asmodian Name Generator</strong><span>Sharp, dark names built on hard Z, K and TH sounds.</span></a>
<a class="card" href="/aion-2-names-list/"><span class="tag">Lists · Servers</span><strong>Aion 2 Names List</strong><span>Hundreds of ready-made names plus every Aion 2 server name.</span></a>
</div>`;

// ---------------------------------------------------------------- class copy
const CLASS_COPY = {
  gladiator: {
    card: 'Heavy, battle-hardened names for frontline bruisers.',
    lead: 'Forge a name that sounds like steel hitting steel. Generate Gladiator names for Elyos and Asmodian warriors who win fights by charging straight into them.',
    about: `<p>The Gladiator is Aion 2's frontline bruiser: a heavy-weapon fighter that trades blows up close, shrugs off punishment and turns crowds of enemies into a single, messy problem for them. A good Gladiator name should feel just as heavy. Think short, punchy syllables, hard consonants like <strong>B, G, D, K and R</strong>, and endings such as <em>-gar</em>, <em>-dor</em> and <em>-rak</em>.</p>
<p>Elyos Gladiators can lean noble and heroic (<em>Varion</em>, <em>Thoras</em>), while Asmodian Gladiators sound right with a rougher, more brutal edge (<em>Brakgar</em>, <em>Korrak</em>). Switch the tone to <strong>Epic compound</strong> if you'd rather have a name that tells people what you do, like <em>Dawnbreaker</em> or <em>Bloodrend</em>.</p>`,
    tips: ['Keep it under 9 letters: short names read better above your head in big PvP fights.', 'Hard stops (k, g, d, x) at the end of a name make it sound more aggressive.', 'Weapon and fury words (blade, rend, maul, fury) make strong compound names.'],
    faq: [
      { q: 'What is a good Gladiator name in Aion 2?', a: 'Strong Gladiator names are short and forceful. Something like Brakgar, Thorvan or Steelfury works because the hard consonants match the class fantasy. Use the generator above with the class locked to Gladiator for unlimited ideas.' },
      { q: 'Should my Gladiator name be different for Elyos and Asmodian?', a: 'It doesn\'t have to be, but it helps you blend in. Elyos names tend to be smoother with vowels like a, e and i, while Asmodian names use harsher sounds like z, k and th. Pick a faction in the generator and the syllables adjust automatically.' }
    ]
  },
  templar: {
    card: 'Noble, oath-bound names for shield-wielding tanks.',
    lead: 'Templars hold the line so everyone else can live. Generate dignified, oath-sworn names for Aion 2 Templar tanks on the Elyos and Asmodian sides.',
    about: `<p>The Templar is Aion 2's dedicated tank: armored, shield in hand, built for damage mitigation and keeping enemies' attention on themselves. Templar names traditionally sound <strong>knightly and dependable</strong>. Think of a holy order, a sworn guardian or the last wall before the healer.</p>
<p>The generator mixes Templar-flavored roots such as <em>Aeg-</em>, <em>Val-</em>, <em>Ald-</em> and <em>Ser-</em> with endings like <em>-ric</em>, <em>-ard</em> and <em>-ius</em>, which gives names like <em>Aldric</em>, <em>Valerius</em> or <em>Serion</em>. The <strong>Epic compound</strong> tone builds shield-themed names: <em>Dawnward</em>, <em>Silveroath</em> and <em>Grimbastion</em>.</p>`,
    tips: ['Names ending in -ric, -ard and -ius carry a classic paladin and knight feel.', 'For Asmodian Templars, pair dark words with protective ones: Duskguard, Ashwall.', 'A calm, readable name is easy for your party to call out during a pull.'],
    faq: [
      { q: 'What are some cool Templar names for Aion 2?', a: 'Try Aldric, Valerion, Aegisar, Dawnward or Ravenshield. Lock the class to Templar in the generator above to get a fresh batch every click.' },
      { q: 'Is the Templar a tank in Aion 2?', a: 'Yes. The Templar is the main tank class, known for heavy defense, damage mitigation and aggro control, which is why this generator leans toward protective, honorable names.' }
    ]
  },
  assassin: {
    card: 'Sharp, quiet names for stealthy burst killers.',
    lead: 'The best Assassin names are short, sharp and gone before anyone reads them twice. Generate stealthy Aion 2 Assassin names for both factions.',
    about: `<p>The Assassin is Aion 2's stealth melee class. It strikes from the shadows, deals huge burst damage and relies on timing and positioning. Your name should feel <strong>quick and quiet</strong>. Sibilant sounds (<em>s, sh, z</em>), sharp vowels and x or ix endings fit perfectly: <em>Vexira</em>, <em>Shiyss</em>, <em>Nyrix</em>.</p>
<p>Asmodian Assassins naturally lean toward the shadows, so names like <em>Zyrix</em> or <em>Triniel</em>-inspired <em>Trinka</em> feel at home. Elyos Assassins can be just as deadly with lighter, elegant names like <em>Saelith</em>. Choose the <strong>Short & clean</strong> tone for names of five letters or fewer.</p>`,
    tips: ['Under 7 letters is ideal. Assassins should be hard to read and hard to catch.', 'Soft S and SH sounds mixed with a sharp X or K make a name feel like a blade.', 'Compound ideas: Nightfang, Duskwhisper, Shadowveil, Ashstep.'],
    faq: [
      { q: 'What makes a good Assassin name?', a: 'Short, sharp and a little mysterious. Names like Vex, Nyrix, Shade or Duskfang suit the class\'s stealthy burst play style.' },
      { q: 'Can I generate female Assassin names?', a: 'Yes. Set Gender to Female and Class to Assassin and the generator uses feminine endings such as -ira, -yss and -ith.' }
    ]
  },
  ranger: {
    card: 'Swift, wild names for bow-wielding hunters.',
    lead: 'Hunters of the wilds need names that carry on the wind. Generate Aion 2 Ranger names inspired by bows, hawks and forest trails.',
    about: `<p>The Ranger is Aion 2's long-range physical damage dealer, fighting with a bow and traps while keeping enemies at a distance. Ranger names work best when they feel <strong>natural and swift</strong>: soft consonants, airy vowels and endings like <em>-wyn</em>, <em>-ra</em> and <em>-el</em>.</p>
<p>Elyos Rangers fit sylvan, almost elven names such as <em>Sylwyn</em> or <em>Lirael</em>. Asmodian Rangers can go darker and more predatory with names like <em>Fenrak</em> or <em>Ravenshot</em>. The compound tone mixes your faction's words with hunter terms like <em>arrow, hawk, quill, strider</em> and <em>snare</em>.</p>`,
    tips: ['Nature roots (Syl-, Fen-, Ash-, Lir-) give a woodland feel.', 'Bird and wind themes suit a class that fights from range: Skyhawk, Galequill.', 'Two syllables are ideal: easy to type in party chat and quick to shout.'],
    faq: [
      { q: 'What are good Ranger names for Aion 2?', a: 'Sylwyn, Fenara, Lirael, Dawnarrow and Ravenshot are good starting points. Set the class to Ranger above for endless variations.' },
      { q: 'Does the generator check if a Ranger name is available?', a: 'No tool outside the game can check live availability. Generate a shortlist, save your favorites with the ☆ button, then try them at character creation. If one is taken, use ↻ to get spelling variants.' }
    ]
  },
  sorcerer: {
    card: 'Arcane, elemental names for spell-slinging casters.',
    lead: 'Fire, frost and forbidden knowledge. Generate arcane Aion 2 Sorcerer names that sound like they could level a battlefield.',
    about: `<p>The Sorcerer is Aion 2's ranged magic damage dealer: fragile, but devastating with area spells. Sorcerer names should sound <strong>arcane and a little exotic</strong>. The generator favors letters like <em>Z, X, Y</em> and <em>M</em>, and endings such as <em>-zar</em>, <em>-eus</em> and <em>-yth</em>, giving names like <em>Myrzar</em>, <em>Xerys</em> or <em>Ilfeus</em>.</p>
<p>For an elemental theme, switch to <strong>Epic compound</strong>: Elyos casters get radiant names like <em>Sunflare</em> or <em>Starember</em>, while Asmodian Sorcerers get <em>Frostcinder</em>, <em>Voidhex</em> and <em>Grimblaze</em>.</p>`,
    tips: ['Z, X and Y instantly make a name feel magical.', 'Greek-style endings (-eus, -ys, -on) give a scholarly, old-world wizard vibe.', 'Elemental compounds are popular, so check variants if your first pick is taken.'],
    faq: [
      { q: 'What are some cool Sorcerer names?', a: 'Myrzar, Xerion, Vyreth, Sunflare and Frostcinder are a few examples. Every click of the generator with the class set to Sorcerer gives 10 new ones.' },
      { q: 'Are Sorcerer names different from Spiritmaster names?', a: 'Both are magic users, but this generator gives Sorcerers sharper, elemental-sounding names, while Spiritmaster names lean ethereal and spirit-themed.' }
    ]
  },
  spiritmaster: {
    card: 'Ethereal names for summoners who command spirits.',
    lead: 'A Spiritmaster never fights alone. Generate ethereal Aion 2 Spiritmaster names for summoners who bind elemental spirits to their will.',
    about: `<p>The Spiritmaster is Aion 2's summoner and controller. It commands spirits to pressure enemies and lock down the battlefield. The class fantasy is about <strong>bonds, pacts and elemental forces</strong>, so names that feel ethereal and otherworldly work best: soft openings like <em>Ae-, Ori-, Eth-</em> and <em>Sel-</em> with flowing endings like <em>-ora, -yn</em> and <em>-iel</em>.</p>
<p>Try <em>Oriyn</em>, <em>Ethora</em> or <em>Selaen</em> for Elyos, or <em>Nyroth</em> and <em>Terzoth</em> for Asmodian. With the compound tone you'll get pact-themed names like <em>Starwisp</em>, <em>Gloomcaller</em> and <em>Voidbond</em>.</p>`,
    tips: ['Names that sound like they belong to the spirit world fit best: airy vowels, few hard stops.', 'Caller, pact, bond and wisp are great compound endings.', 'Some players name their character after the element they focus on.'],
    faq: [
      { q: 'What is a good Spiritmaster name?', a: 'Ethereal names such as Oriyn, Ethora, Selaen or Gloomcaller suit the summoner fantasy. Use the generator with class set to Spiritmaster for more.' },
      { q: 'What does the Spiritmaster do in Aion 2?', a: 'It is a summoner and controller class that commands spirits to pressure enemies and provide crowd control and utility.' }
    ]
  },
  cleric: {
    card: 'Graceful, holy names for healers.',
    lead: 'Every party remembers its healer\'s name. Generate graceful, holy Aion 2 Cleric names for Elyos and Asmodian healers.',
    about: `<p>The Cleric is Aion 2's healer, the person keeping everyone alive. Cleric names tend to be <strong>gentle, graceful and faintly holy</strong>: soft consonants, lots of vowels and endings like <em>-ine</em>, <em>-iel</em> and <em>-ara</em>. Think <em>Seraphine</em>, <em>Amariel</em> or <em>Celara</em>.</p>
<p>Asmodian healers don't have to sound sweet. Darker devotional names like <em>Lumena</em> (a nod to Lumiel) or <em>Gravemercy</em> work well. The compound tone pairs faction words with healing themes: <em>Dawnmercy</em>, <em>Halobloom</em>, <em>Moonvigil</em>.</p>`,
    tips: ['The -iel ending echoes Aion\'s Empyrean Lords and fits a divine healer.', 'Make it easy to type. Your party will be whispering it a lot.', 'Healing words (grace, mercy, bloom, vigil) make memorable compound names.'],
    faq: [
      { q: 'What are some pretty Cleric names for Aion 2?', a: 'Seraphine, Amariel, Celara, Lysine and Halobloom are popular styles. Lock the class to Cleric and gender to Female above for more graceful names.' },
      { q: 'Is the Cleric the healer class in Aion 2?', a: 'Yes. The Cleric is the main healer, so this generator gives it soft, holy-sounding names.' }
    ]
  },
  chanter: {
    card: 'Rhythmic, mantra-inspired names for battle supports.',
    lead: 'Half warrior, half hymn. Generate rhythmic Aion 2 Chanter names for the support class that fights on the front line while empowering the party.',
    about: `<p>The Chanter is Aion 2's hybrid support. It fights with a staff and buffs the party with mantras and chants while still holding its own in melee. Chanter names suit a <strong>monk-like, rhythmic feel</strong>: syllables that roll off the tongue, like <em>Canto</em>, <em>Hanrei</em>, <em>Loryn</em> or <em>Sorantu</em>.</p>
<p>The generator gives Chanters roots like <em>Ca-, Han-, Lo-, Ry-</em> and endings like <em>-ant, -yr, -ren</em>. The compound tone turns out names like <em>Dawnhymn</em>, <em>Stormchant</em> and <em>Ashmantra</em>, which is perfect if you want people to know you're the one keeping the buffs up.</p>`,
    tips: ['Musical words (hymn, chant, verse, echo) are a natural fit.', 'Repeating sounds (Lolan, Sesaren) give a name a chant-like rhythm.', 'Chanters are often the shot-caller: pick something short enough to say in voice chat.'],
    faq: [
      { q: 'What is a good Chanter name?', a: 'Rhythmic, monk-like names such as Canto, Loryn, Hanrei or Dawnhymn suit the class. Use the generator above for more.' },
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
  lead: 'Generate unique character names for Aion 2 in one click. Pick your faction, class and gender, then copy the name straight into character creation.',
  app: true,
  body: () => `${generatorWidget({ seed: 11 })}
${favoritesPanel}
${variantTool}
<div class="content">
<h2>Pick a faction-specific generator</h2>
<p>Elyos and Asmodians don't just fight each other, they sound different too. Each faction page tunes the syllables to its side of Atreia.</p>
</div>
${factionCards}
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
<li><strong>It's unique enough to be available.</strong> Character names are unique, so obvious picks like "Ariel" or "Shadow" vanish on day one. Small spelling twists such as Aryel or Ariell keep the sound and get you through.</li>
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
      ['Lore roots', 'Ari (Ariel), Kais (Kaisinel), Neze (Nezekan), Yus (Yustiel), Vai (Vaizel), Sanc (Sanctum), Poe (Poeta)'],
      ['Compound words', 'Dawn, Light, Sun, Star, Silver, Gold, Halo, Aether, Glory']
    ],
    faq: [
      { q: 'What do Elyos names sound like?', a: 'Elyos names are bright and melodic, with plenty of vowels and soft consonants like l, r, s and v. Many end in -iel or -ael, echoing Elyos Empyrean Lords such as Ariel, Kaisinel and Yustiel.' },
      { q: 'Can I generate female Elyos names?', a: 'Yes. Set Gender to Female in the generator. Female Elyos names use endings like -ia, -ara, -ielle and -wyn, for example Celara, Lirielle or Aurwyn.' },
      { q: 'Can I name my character after an Empyrean Lord?', a: 'Exact lord names like Ariel are almost always taken. Try the Lore-inspired tone for names built on their roots (Arion, Kaisor, Yusara), or use ↻ to get spelling variants.' }
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
      ['Lore roots', 'Azph (Azphel), Zik (Zikel), March (Marchutan), Trin (Triniel), Lum (Lumiel), Pandae (Pandaemonium), Morh (Morheim)'],
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
<h2>Naming your ${K.label}</h2>
${C.about}
<h3>Quick tips</h3>
<ul>${C.tips.map((t) => `<li>${t}</li>`).join('')}</ul>

<div class="cols">
<div><h2>Elyos ${K.label} names</h2>
${nameList(names({ faction: 'elyos', cls: k }, 12, 300 + i))}</div>
<div><h2>Asmodian ${K.label} names</h2>
${nameList(names({ faction: 'asmodian', cls: k }, 12, 400 + i))}</div>
</div>
<div class="cols">
<div><h3>Male ${K.label} names</h3>
${nameList(names({ gender: 'm', cls: k, style: 'fantasy' }, 10, 500 + i))}</div>
<div><h3>Female ${K.label} names</h3>
${nameList(names({ gender: 'f', cls: k, style: 'fantasy' }, 10, 600 + i))}</div>
</div>
<h3>Epic ${K.label} names</h3>
${nameList(names({ cls: k, style: 'compound' }, 14, 700 + i))}

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
const EU_ELYOS = ['Siel', 'Nezekan', 'Vaizel', 'Kaisinel', 'Ariel', 'Meslamtaeda', 'Fregion', 'Hithanya', 'Marchutan'];
const EU_ASMO = ['Israphel', 'Zikel', 'Triniel', 'Lumiel', 'Azphel', 'Beritra', 'Ereshkigal', 'Nemon', 'Yustiel'];
const LAUNCH_NEW = ['Lamuatan', 'Atiel', 'Gauss', 'Agnita', 'Ishtar', 'Fafnir', 'Tiamat', 'Indnath'];
const LAUNCH_MORE = ['Nania', 'Hadala', 'Tahavatha', 'Ludra', 'Luteros', 'Ulgorn', 'Phernos', 'Munin', 'Daminu', 'Odar', 'Kasaka', 'Zemurru', 'Bakarma', 'Kromede', 'Tsenka', 'Quai', 'Kochi', 'Baba'];
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
  eyebrow: `Updated ${SITE.updatedHuman}`,
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

<div class="content">
<h2 id="servers">Aion 2 server names</h2>
<p>Aion 2 servers are split by faction: you create an Elyos character on an Elyos server or an Asmodian character on an Asmodian server. Servers are linked so you can still meet the other faction through rifts and in the Abyss. Because <strong>character names only need to be unique on your own server</strong>, a name that's taken on one server may still be free on another.</p>

<h3>European servers by faction</h3>
<div class="table-wrap"><table>
<thead><tr><th>Elyos servers</th><th>Asmodian servers</th></tr></thead>
<tbody>${EU_ELYOS.map((e, i) => `<tr><td class="elyos">${e}</td><td class="asmo">${EU_ASMO[i] || ''}</td></tr>`).join('')}</tbody>
</table></div>

<h3>Servers added for the free-to-play launch</h3>
<p>The following servers were announced for the free-to-play launch on October 5, 2026. New worlds are a great chance to claim a short or popular name before anyone else does.</p>
<div class="table-wrap"><table>
<thead><tr><th>Status</th><th>Servers</th></tr></thead>
<tbody>
<tr><th scope="row">New</th><td>${LAUNCH_NEW.join(', ')}</td></tr>
<tr><th scope="row">Also listed</th><td>${LAUNCH_MORE.join(', ')}</td></tr>
</tbody></table></div>
<p class="note">Server lists change with new launches, merges and regional openings. This list was last checked on ${SITE.updatedHuman} against public launch coverage. Your in-game server selection screen is always the final word.</p>

<h3>Where do Aion 2 server names come from?</h3>
<p>Most server names come straight from Aion lore: the twelve <strong>Empyrean Lords</strong> (Siel, Israphel, Ariel, Azphel and the rest), the <strong>Balaur Dragon Lords</strong> (Beritra, Ereshkigal, Meslamtaeda, Fregion, Tiamat) and other mythic figures. They're great inspiration for your own name, though you'll need your own twist since the originals are always taken.</p>

<h2 id="empyrean-lords">The Twelve Empyrean Lords</h2>
<div class="table-wrap"><table>
<thead><tr><th>Lord</th><th>Faction</th><th>Known as</th></tr></thead>
<tbody>${LORDS.map(([n, f, t]) => `<tr><td class="${f === 'Elyos' ? 'elyos' : f === 'Asmodian' ? 'asmo' : ''}">${n}</td><td>${f}</td><td>${t}</td></tr>`).join('')}</tbody>
</table></div>
<p>Siel and Israphel held the Aetheric Field together and belong to neither faction, which is why their names often sit at the top of both server lists.</p>
</div>`,
  faq: [
    { q: 'Are Aion 2 character names unique per server?', a: 'Yes. A name only has to be free on the server you\'re creating your character on, so a name taken on Siel might still be available on another server.' },
    { q: 'What are the Aion 2 server names?', a: `In Europe, Elyos servers include ${EU_ELYOS.slice(0, 6).join(', ')} and more, while Asmodian servers include ${EU_ASMO.slice(0, 6).join(', ')} and more. See the full table above, last checked ${SITE.updatedHuman}.` },
    { q: 'Why are Aion 2 servers named Siel, Israphel, Ariel and Azphel?', a: 'They\'re named after the Empyrean Lords and other figures from Aion lore. Siel (Lady of Time) and Israphel (Lord of Space) held the Aetheric Field, Ariel leads the Elyos lords and Azphel leads the Asmodian lords.' },
    { q: 'My favorite name is taken. What now?', a: 'Use the variant maker above. It keeps the sound but changes the spelling (Ariel → Aryel, Ariell, Arielle). Or try the same name on a newer server.' }
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
<p>Each faction has its own sound palette, bright and vowel-rich for the Elyos and hard and consonant-heavy for the Asmodians, inspired by the naming patterns in Aion lore. Class pages add themed roots and words. A small filter removes awkward letter clusters and obvious offensive words, but always give a name a quick once-over before you commit.</p>
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
<h2>Server logs and third parties</h2>
<p>Like most websites, our hosting provider may keep standard server logs (such as IP address, browser type and pages requested) for security and performance. Fonts are loaded from Google Fonts, which may receive your IP address when fonts load. If we add analytics or advertising in the future, this policy will be updated to describe it.</p>
<h2>Children</h2>
<p>This site doesn't knowingly collect personal information from anyone, including children.</p>
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
  ['/aion-2-names-list/', 'Names List & Servers']
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
    graph.push({ '@type': 'Article', headline: page.h1, description: page.description, url, dateModified: SITE.updated, author: { '@type': 'Organization', name: SITE.name } });
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
<div><h4>Factions</h4><ul><li><a href="/">Aion 2 Name Generator</a></li><li><a href="/elyos-name-generator/">Elyos Names</a></li><li><a href="/asmodian-name-generator/">Asmodian Names</a></li><li><a href="/aion-2-names-list/">Names List &amp; Servers</a></li></ul></div>
<div><h4>Classes</h4><ul>${CLASS_KEYS.slice(0, 4).map((k) => `<li><a href="${classUrl(k)}">${NG.CLASSES[k].label} Names</a></li>`).join('')}</ul></div>
<div><h4>&nbsp;</h4><ul>${CLASS_KEYS.slice(4).map((k) => `<li><a href="${classUrl(k)}">${NG.CLASSES[k].label} Names</a></li>`).join('')}</ul></div>
</div>
<p class="legal">© 2026 aion2namegenerator.org · <a href="/about/">About</a> · <a href="/privacy/">Privacy</a><br>Unofficial fan site, not affiliated with NCSOFT. AION is a trademark of NCSOFT Corporation.</p>
</div></footer>
${page.app ? `<script src="/assets/namegen.js?v=${v.ng}" defer></script>\n<script src="/assets/app.js?v=${v.app}" defer></script>` : `<script src="/assets/app.js?v=${v.app}" defer></script>`}
</body>
</html>
`;
}

// ---------------------------------------------------------------- build
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
for (const f of ['style.css', 'namegen.js', 'app.js']) fs.copyFileSync(path.join(SRC, 'assets', f), path.join(DIST, 'assets', f));
const v = {
  css: hash(path.join(SRC, 'assets', 'style.css')),
  ng: hash(path.join(SRC, 'assets', 'namegen.js')),
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
${pages.map((p) => `  <url><loc>${SITE.url}${p.path}</loc><lastmod>${SITE.updated}</lastmod><priority>${p.priority || '0.5'}</priority></url>`).join('\n')}
</urlset>
`);

console.log(`Built ${pages.length} pages -> ${DIST}`);
pages.forEach((p) => console.log('  ' + p.path));
