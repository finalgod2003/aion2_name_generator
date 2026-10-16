const MAP = 'https://corpus.gg/games/aion-2/map/hidden-cubes';
const CORPUS = 'https://corpus.gg/blog/aion-2/hidden-cubes';
const RELAY = 'https://raidrelay.com/aion-2-hidden-cube-guide';
const MOBALYTICS = 'https://mobalytics.gg/gamebase/guides/aion-2-hidden-cubes';

export const HIDDEN_CUBES_PAGE = {
  path: '/aion-2-cubes/',
  title: 'Aion 2 Cubes: Hidden Cube Locations, Keys & Rewards',
  description: 'Find Aion 2 Hidden Cubes in Verteron and Altgard. Learn how cube spawns work, where to get keys, what rewards to expect, and how to use an interactive map.',
  h1: 'Aion 2 Cubes: Hidden Cube Guide',
  eyebrow: 'World exploration · Reviewed October 16, 2026',
  lead: 'Follow the sound, check above and below your route, and bring a Hidden Cube key. This guide covers the open-world cubes in Verteron and Altgard.',
  published: '2026-10-16',
  updated: '2026-10-16',
  ogType: 'article',
  crumbs: [['Aion 2 Cubes']],
  schema: 'article',
  priority: '0.8',
  body: () => `<article class="content cubes-guide">
<p class="hint">By <a href="/about/">Aion 2 Name Generator</a> · Published <time datetime="2026-10-16">October 16, 2026</time></p>

<section class="cube-brief" aria-labelledby="cube-brief-title">
<svg class="cube-brief-art" viewBox="0 0 140 140" aria-hidden="true"><defs><linearGradient id="cube-top" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffb29d"/><stop offset="1" stop-color="#e76075"/></linearGradient><linearGradient id="cube-side" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a53c67"/><stop offset="1" stop-color="#582b59"/></linearGradient></defs><path d="M70 11 122 40 70 70 18 40Z" fill="url(#cube-top)"/><path d="M18 40 70 70v60L18 100Z" fill="#803452"/><path d="M122 40 70 70v60l52-30Z" fill="url(#cube-side)"/><path d="m70 11 52 29v60l-52 30-52-30V40Z" fill="none" stroke="#f3a4a0" stroke-width="2"/><path d="m18 40 52 30 52-30M70 70v60" fill="none" stroke="#f3a4a0" stroke-width="2"/></svg>
<div><span class="cube-kicker">The field rule</span><h2 id="cube-brief-title">A map shows possibilities, not a live chest.</h2><p>Hidden Cubes appear in groups of possible spots. If a marker is empty, search the rest of its group, look at different heights, and listen for the nearby hum. Another player may have opened the cube already.</p></div>
</section>

<nav aria-label="On this page"><ul class="toc">
<li><a href="#locations">Locations &amp; map</a></li><li><a href="#find">How to find one</a></li><li><a href="#keys">Cube keys</a></li><li><a href="#rewards">Rewards</a></li><li><a href="#sources">Sources</a></li><li><a href="#faq">FAQ</a></li>
</ul></nav>

<h2 id="locations">Where are Aion 2 Hidden Cubes?</h2>
<p>Look for the small red cubes while exploring your faction's home region. The linked community map marks <em>possible spawn positions</em> in Verteron and Altgard; it cannot show which cubes are present on your server right now.</p>
<div class="cube-map-grid">
<div class="cube-map-card cube-map-elyos"><span class="cube-map-label">Elyos territory</span><h3>Verteron</h3><p>Start near your current quest area, then sweep nearby cliffs, ledges and water rather than chasing every map point.</p><a href="${MAP}">Open map · select Verteron <span aria-hidden="true">↗</span></a></div>
<div class="cube-map-card cube-map-asmo"><span class="cube-map-label">Asmodian territory</span><h3>Altgard</h3><p>Work through one search group at a time. If a marked position is empty, check its other spots before moving on.</p><a href="${MAP}">Open map · select Altgard <span aria-hidden="true">↗</span></a></div>
</div>
<p class="hint">The <a href="${MAP}">Corpus Hidden Cube map</a> groups possible positions and lets you filter ground and water spots. Its listening tool narrows candidates near the point where you heard a cube.</p>

<h2 id="find">How to find and open a cube</h2>
<ol class="cube-steps">
<li><strong>Carry a key.</strong> Check your inventory for a Hidden Cube key before starting a route; the mapped Verteron and Altgard cubes require one in the reviewed Global client data.</li>
<li><strong>Keep sound effects audible.</strong> A cube gives off a hum nearby. Pause occasionally and turn toward the sound; visual clues include its red glow.</li>
<li><strong>Search vertically.</strong> Look on ledges and high ground, then under bridges or in water. A flat map marker does not tell you the cube's height.</li>
<li><strong>Interact and choose the key.</strong> Confirm the selected key in the opening menu, wait for the animation, and collect the rewards.</li>
</ol>
<p class="note"><strong>Empty marker?</strong> Cube positions are shared and the active spot can change within a group. Search the neighboring positions or return later; a fixed respawn timer has not been confirmed for this guide.</p>

<h2 id="keys">How to get Hidden Cube keys</h2>
<p>Start with sources you can earn through normal play. The availability of shops, passes and event rewards can change by region or season.</p>
<div class="table-wrap" role="region" aria-label="Hidden Cube key sources" tabindex="0"><table>
<thead><tr><th scope="col">Source</th><th scope="col">What to check</th></tr></thead><tbody>
<tr><th scope="row">Monolith progression</th><td>Review the rewards at your faction's Monolith as you clear regional exploration.</td></tr>
<tr><th scope="row">Achievements</th><td>Look under exploration and gathering. The “Who Brought the Chest?” chain also rewards keys as you open cubes.</td></tr>
<tr><th scope="row">Duty rewards</th><td>Inspect the offered rewards on Duties and Duty Scrolls for a Hidden Cube key.</td></tr>
<tr><th scope="row">Attendance, events &amp; shops</th><td>Check current regional rewards and prices in your own client before spending currency.</td></tr>
</tbody></table></div>

<h2 id="rewards">What do Hidden Cubes give?</h2>
<p>Recent Global client-data guides list <strong>1,000 Soul Crystals</strong> from a keyed opening, alongside Silentium, Soul Codex, a Seed of Detection and Power Shards. Other possible drops include consumables and rare cosmetics such as skins or wings. Those extras are chance rewards, so a single cube should not be treated as a guaranteed cosmetic drop.</p>
<p>Soul Crystals support Pet Genus progression. If that is your goal, collecting available keys and opening cubes along your normal exploration route is a practical starting point. The exact reward table may change with an update; compare your current in-game rewards with the <a href="${RELAY}">Global client-data breakdown</a> before planning around quantities or drop chances.</p>

<section class="panel" aria-labelledby="name-after-exploring"><h2 id="name-after-exploring">Exploring on a new character?</h2><p>Pick a name for the Daeva who will hunt your next cube. Try the <a href="/">Aion 2 name generator</a>, or browse the <a href="/elyos-name-generator/">Elyos</a> and <a href="/asmodian-name-generator/">Asmodian</a> collections.</p></section>

<h2 id="sources">Sources and version notes</h2>
<p>This guide summarizes community research based on the Global client and player observations. Map pins are possible positions, and shop offers or reward tables may differ after updates.</p>
<ul>
<li><a href="${MAP}">Corpus Hidden Cube map</a> and <a href="${CORPUS}">keys and spawn guide</a> — grouped map positions, key sources and achievements.</li>
<li><a href="${RELAY}">Raid Relay Hidden Cube guide</a> — Global client-data review and player checks, updated October 10, 2026.</li>
<li><a href="${MOBALYTICS}">Mobalytics Hidden Cube guide</a> — visual and audio search tips and the opening flow, updated October 15, 2026.</li>
</ul>
<p class="hint">Reviewed October 16, 2026. This is an unofficial fan guide; check your current client for region-specific details.</p>
</article>`,
  faq: [
    { q: 'Do Hidden Cubes appear at every map marker?', a: 'No. The map shows possible spots within search groups. A cube can be at another spot in the group, or another player may have opened it. Search nearby and check different heights.' },
    { q: 'Do I need a key to open an Aion 2 Hidden Cube?', a: 'The Verteron and Altgard cubes in the reviewed Global client data require a Hidden Cube key. Check the opening menu and your current regional client before assuming other zones work the same way.' },
    { q: 'Where can I get Hidden Cube keys?', a: 'Check Monolith rewards, exploration and gathering achievements, Duties and Duty Scrolls. Attendance, events and shops may offer more depending on your region and season.' },
    { q: 'What is the difference between a Hidden Cube and the inventory Cube?', a: 'A Hidden Cube is an open-world chest that you find and open for rewards. The inventory Cube is your character’s item storage. This guide covers Hidden Cubes.' },
    { q: 'Can I hear a Hidden Cube?', a: 'Yes. Community guides report a nearby hum. Keep Sound Effects audible and use the sound to narrow your search; a similar exploration sound can also come from other collectibles.' }
  ]
};
