// Skill descriptions are paraphrased from the linked September 18, 2026
// database snapshot. Build priorities are editorial advice, not tested rankings.
const REVEAL = 'https://about.ncsoft.com/en/news/article/aion2-update-250530-2';
const UPDATE = 'https://about.ncsoft.com/en/news/article/aion2_update_260325';
const DATABASE = 'https://aion2.app/db/skills?class=Templar';
const skill = (id, name) => `<a href="https://aion2.app/db/skills/${id}">${name}</a>`;

export const TEMPLAR_PAGE = {
  path: '/aion-2-templar/',
  title: 'Aion 2 Templar Guide: Skills, Builds & Gear',
  description: 'Aion 2 Templar guide to core skills, leveling priorities, PvE tank and PvP builds, gear choices and keybinds. Includes sources and a first-dungeon checklist.',
  h1: 'Aion 2 Templar Guide',
  eyebrow: 'Class guide · Reviewed October 13, 2026',
  lead: 'Templar is Aion 2’s frontline tank. Learn the skills behind its threat, control and protection, then choose a practical starting build for leveling, dungeons or PvP.',
  published: '2026-10-13',
  updated: '2026-10-13',
  ogType: 'article',
  crumbs: [['Aion 2 Templar Guide']],
  schema: 'article',
  priority: '0.9',
  body: () => `<div class="content">
<p class="hint">By <a href="/about/">Aion 2 Name Generator</a> · Published <time datetime="2026-10-13">October 13, 2026</time></p>
<section class="panel" aria-labelledby="quick-answer">
<h2 id="quick-answer">Aion 2 Templar at a glance</h2>
<p><strong>Choose Templar if you enjoy holding enemy attention and protecting a group.</strong> NCSOFT identifies it as a core tank. Your first learning goals are a dependable attack loop, a timely block and control over the pull. <a href="${REVEAL}">Official class reveal</a>.</p>
<div class="cards">
<a class="card" href="#leveling"><span class="tag">Solo &amp; leveling</span><strong>Build your attack loop</strong><span>Connect shield attacks, Judgment and MP recovery.</span></a>
<a class="card" href="#pve-build"><span class="tag">Dungeon tank</span><strong>Keep the party stable</strong><span>Plan threat, personal defense and party protection.</span></a>
<a class="card" href="#pvp-build"><span class="tag">Group PvP</span><strong>Control the engagement</strong><span>Disrupt pressure on allies and keep an escape available.</span></a>
</div>
</section>

<nav aria-label="On this page"><ul class="toc">
<li><a href="#skills">Core skills</a></li>
<li><a href="#leveling">Leveling &amp; points</a></li>
<li><a href="#pve-build">PvE build</a></li>
<li><a href="#pvp-build">PvP build</a></li>
<li><a href="#gear">Gear priorities</a></li>
<li><a href="#controls">Keybinds &amp; macros</a></li>
<li><a href="#checklist">Dungeon checklist</a></li>
<li><a href="#sources">Sources &amp; version</a></li>
<li><a href="#faq">FAQ</a></li>
</ul></nav>
<p class="note"><strong>Version scope:</strong> skill summaries below use Aion2.app’s September 18, 2026 client-data snapshot, reviewed October 13. It is a community database, not an official Global patch reference. Compare names, unlocks and specializations with your region’s current tooltips. The build priorities are our suggested starting points, not a tested best-in-slot setup or current tier ranking.</p>

<h2 id="skills">Aion 2 Templar skills: what each tool does</h2>
<p>The useful distinction is between generating threat, moving an enemy and surviving its response. Learn which button solves which problem before spending every point on damage. The linked skill entries contain the snapshot details; the practice tips are our recommendations.</p>
<div class="table-wrap" role="region" aria-label="Core Templar skills" tabindex="0"><table>
<thead><tr><th scope="col">Skill</th><th scope="col">Snapshot function</th><th scope="col">Practice focus</th></tr></thead>
<tbody>
<tr><th scope="row">${skill('12010000', 'Vicious Strike')}</th><td>A close-range attack that increases Enmity and restores MP, with follow-up chain attacks.</td><td>Use the chain to maintain activity while recovering resources.</td></tr>
<tr><th scope="row">${skill('12040000', 'Pummel')}</th><td>An attack that spends MP, increases Enmity and chains into Punishing Strike.</td><td>Watch your MP instead of repeating the spender without recovery.</td></tr>
<tr><th scope="row">${skill('12100000', 'Shield Smite')}</th><td>A shield attack with a stun effect that opens a short Judgment window.</td><td>Recognize the follow-up prompt while still watching the enemy.</td></tr>
<tr><th scope="row">${skill('12240000', 'Judgment')}</th><td>A close-range hit that adds Enmity; its specializations change its damage and cooldown behavior.</td><td>Keep the follow-up on an easy key and use it when available and safe.</td></tr>
<tr><th scope="row">${skill('12130000', 'Poach')}</th><td>A ranged pull with a root effect. Immunities and specializations can change the result.</td><td>Choose a safe landing position before pulling a target toward you.</td></tr>
<tr><th scope="row">${skill('12090000', 'Punishment')}</th><td>A charged attack with area damage and an Executor buff.</td><td>Charge during a safe opening; be ready to move for a mechanic.</td></tr>
<tr><th scope="row">${skill('12120000', 'Taunt')}</th><td>A Stigma that raises Enmity and applies an offensive debuff; the snapshot also lists a chance-based player taunt.</td><td>Know its PvE and PvP effects instead of assuming every target behaves alike.</td></tr>
<tr><th scope="row">${skill('12110000', 'Shield of Protection')}</th><td>A sustained defensive Stigma that guarantees block and improves block damage reduction.</td><td>Time it against the incoming attack and confirm your current movement restrictions.</td></tr>
<tr><th scope="row">${skill('12320000', 'Nezekan’s Shield')}</th><td>A Stigma that grants a temporary protective shield to you and nearby party members.</td><td>Save it for a planned group damage window and check ally range.</td></tr>
</tbody></table></div>
<p><strong>What about Battlefield Banner?</strong> NCSOFT announced this Templar Stigma in its <a href="${UPDATE}">March 25, 2026 class overhaul</a>. That announcement also expanded Stigma slots in the service it covered. Check your client before treating its slot count or skill availability as a Global build rule.</p>

<h2 id="leveling">Leveling and skill-point priorities</h2>
<p>For a first Templar, we suggest investing in a small set of skills you can use consistently. Follow your available progression quests, practice on manageable pulls and adjust the next upgrade to the problem you actually encounter.</p>
<ol>
<li><strong>Make the basic loop comfortable.</strong> Practice Vicious Strike for MP recovery and the Pummel chain for spending. Keep enough resources available for the next mechanic.</li>
<li><strong>Learn Shield Smite into Judgment.</strong> Check the trigger in your client, then practice using the opening without losing track of the enemy’s attack.</li>
<li><strong>Read the next specialization before spending.</strong> A change to resource use, movement or a follow-up can matter more to your current rotation than a small damage increase.</li>
<li><strong>Add Punishment when available.</strong> Test where a charge fits between enemy attacks. If it repeatedly gets interrupted, change your timing before investing further.</li>
<li><strong>Prepare for group play.</strong> When your client unlocks the relevant Stigmas, review Taunt and Shield of Protection before filling every available slot with damage.</li>
</ol>
<p>As an example of why breakpoints matter, the linked snapshot lists a <strong>skill-level 12 Pummel specialization</strong> that lets Punishing Strike reduce Punishment’s cooldown, and a <strong>skill-level 16 Judgment specialization</strong> that removes Judgment’s cooldown. These are skill levels, not character levels, and the latter does not by itself remove activation requirements. Verify both in your client before copying a point allocation. Sources: ${skill('12040000', 'Pummel')} and ${skill('12240000', 'Judgment')}.</p>

<h2 id="pve-build">Templar PvE build: a starting tank setup</h2>
<p><strong>Start with a working attack loop, a threat tool and a defense you can time.</strong> Our recommended foundation is the Vicious Strike/Pummel loop, Shield Smite and Judgment, then Taunt and Shield of Protection where available. For a group learning unavoidable damage, consider Nezekan’s Shield as a party-protection option.</p>
<p>This is a priority list, not a fixed bar or a maximum-rank allocation. Use the slots and points your region actually provides. If you can already survive the encounter comfortably, evaluate damage or party utility in the remaining choices; if you repeatedly die to one mechanic, solve that first.</p>
<h3>A practice sequence for an ordinary pull</h3>
<ol>
<li>Pick the target and a safe place to fight. Use Poach only when pulling it toward you helps the group.</li>
<li>Establish attention with your threat tools, then settle into your attack loop.</li>
<li>Use Shield Smite and its Judgment opening when appropriate; recover MP with Vicious Strike as needed.</li>
<li>Pause the attack sequence for a telegraphed hit. Move or use the suitable defense, then resume.</li>
<li>Keep a party shield for the agreed damage window instead of spending every cooldown at the start.</li>
</ol>
<p>Use this as a practice exercise rather than a boss script. Interruptions, immunities and encounter mechanics can all change the order.</p>

<h2 id="pvp-build">Templar PvP build: control and protection</h2>
<p>For a first group PvP setup, we suggest keeping your familiar attack loop and choosing the remaining tools around protecting allies. Review Poach for displacement, Shield Smite for control and an available defensive Stigma for the enemy’s response. Confirm each effect’s player-target rules in the <a href="${DATABASE}">skill database</a> and your live client.</p>
<ul>
<li><strong>Agree on a target.</strong> Pulling an opponent into your team only helps if allies are ready to follow up.</li>
<li><strong>Keep protection within reach.</strong> Before chasing, check whether an ally is under pressure and whether you can return safely.</li>
<li><strong>Leave one response available.</strong> Avoid committing movement and every defensive option to the same opening.</li>
<li><strong>Review PvP effects separately.</strong> NCSOFT’s <a href="${UPDATE}">March 2026 overhaul</a> separated PvE and PvP damage calculations. A PvE damage recommendation alone does not establish a PvP winner.</li>
</ul>
<p>A duel, a small group fight and a large battle have different demands. This guide does not assign Templar an S-tier rating: we have not measured the current regional matchups.</p>

<h2 id="gear">Templar gear and stat priorities</h2>
<p>The linked skill records specify <strong>Longsword</strong> as the weapon. Before upgrading, compare the item’s actual options with the skills and activity you use. The table below is a decision checklist, not a mathematical stat-weight ranking or a named endgame gear set.</p>
<div class="table-wrap" role="region" aria-label="Templar gear decisions" tabindex="0"><table>
<thead><tr><th scope="col">Your problem</th><th scope="col">Review first</th><th scope="col">A useful check</th></tr></thead>
<tbody>
<tr><th scope="row">Slow solo fights</th><td>Weapon progression, attack-related options and skill upgrades.</td><td>Repeat a comparable pull and compare clear time without changing everything at once.</td></tr>
<tr><th scope="row">Dying in dungeons</th><td>Missed mechanics, then HP, defensive options and block-related effects available on your gear.</td><td>Identify the hit that killed you and whether your defense was ready.</td></tr>
<tr><th scope="row">Losing enemy attention</th><td>Opening timing, Enmity effects and gaps in your attack loop.</td><td>Check when the target switches before replacing otherwise useful gear.</td></tr>
<tr><th scope="row">Losing PvP trades</th><td>PvP-specific options, defensive uptime and whether your control lands.</td><td>Compare against similar opponents in the same mode, not a PvE target.</td></tr>
</tbody></table></div>
<p>Spend scarce materials after identifying the next upgrade’s purpose. Check enhancement costs, replacement plans and any regional transfer rules in game. A list copied from another region may use different equipment or progression systems.</p>

<h2 id="controls">Keybinds and macro settings</h2>
<p>Our suggested layout puts the attack loop together, the block on a separate easy key, and Poach/Taunt beside target controls. Keep Judgment’s trigger visible. You should be able to move the camera and defend without searching across the keyboard.</p>
<p>For a macro setup, begin by checking which shortcuts your current client supports. Practice this manual sequence first: <strong>target → establish threat → use an available follow-up → respond to the attack</strong>. A fixed timer cannot tell whether you need to stop charging, change targets or save a shield for an ally. This page provides no automated rotation or unverified macro syntax.</p>

<h2 id="checklist">Your first-dungeon checklist</h2>
<ul>
<li>Read the current tooltip for your threat skill and defensive Stigma.</li>
<li>Confirm the next Judgment trigger and your MP recovery option.</li>
<li>Choose a defensive response for the encounter’s dangerous hit.</li>
<li>Agree with the party on the pull and the group-shield timing, if equipped.</li>
<li>After the attempt, change one thing: timing, positioning, a skill choice or a gear option.</li>
</ul>

<section class="panel" aria-labelledby="name-your-templar">
<h2 id="name-your-templar">Give your Templar a name</h2>
<p>Starting a new tank? Try names such as Aldric, Dawnward or Duskguard in the <a href="/templar-name-generator/">Templar name generator</a>. Choose a faction, save a shortlist and check availability in game.</p>
<p>Browse the <a href="/aion-2-names-list/">Aion 2 names and servers list</a> or use the <a href="/">main name generator</a> for another class.</p>
</section>

<h2 id="sources">Sources and version notes</h2>
<p>This guide combines published class information with linked skill records and our own beginner checklists. It is a source-based introduction; we have not tested these builds in current Global endgame encounters.</p>
<ul>
<li><a href="${REVEAL}">NCSOFT: AION2’s Core Content Unveiled</a>, June 4, 2025 — the official Templar tank role.</li>
<li><a href="${UPDATE}">NCSOFT: Major Class Overhaul</a>, March 25, 2026 — Battlefield Banner and historical combat-system changes.</li>
<li><a href="${DATABASE}">Aion2.app: Templar skills</a> — community database stating it uses NCSOFT API data; the reviewed pages identify client snapshot September 18, 2026 (14,926). Individual records are linked in the skill table.</li>
</ul>
<p class="hint">Reviewed October 13, 2026. Regional translations, balance values, skill caps and Stigma slots may differ. Check your current client before spending points or upgrade materials.</p>
</div>`,
  faq: [
    { q: 'What is Templar in Aion 2?', a: 'Templar is a frontline tank class. NCSOFT’s <a href="https://about.ncsoft.com/en/news/article/aion2-update-250530-2">class reveal</a> identifies its core tanking role. The skills covered here combine Enmity generation, control and defensive options, making party protection a useful focus when learning the class.' },
    { q: 'What is a good starting Aion 2 Templar PvE build?', a: 'Our suggested foundation is Vicious Strike and Pummel, Shield Smite into Judgment, then Taunt and Shield of Protection when available. Consider Nezekan’s Shield for group protection. Match the choices to your client’s unlocks and slots; this is a beginner priority list, not a tested maximum-damage build.' },
    { q: 'Which Templar skills should I level first?', a: 'Start with the attack loop you use consistently, then inspect the next specializations for Judgment, Vicious Strike and Pummel. Add the defenses needed for your content. See the <a href="#leveling">leveling priorities</a> for examples of skill-level breakpoints and why you should verify them in your region.' },
    { q: 'Is Templar good for solo play or PvP?', a: 'For solo play, start with a repeatable damage loop and reliable resource recovery. For group PvP, our recommendation is to practice control and ally protection. This page does not establish a current tier ranking or claim that Templar clears faster than other classes.' },
    { q: 'Should I copy a Korean or Taiwan Templar build on Global?', a: 'Use it as a reference, then compare skill names, unlocks, specializations, Stigma slots and equipment with Global’s current tooltips. A shared class name does not guarantee that a point allocation or item setup transfers between regions.' },
    { q: 'Where can I generate a Templar character name?', a: 'Use the <a href="/templar-name-generator/">Aion 2 Templar name generator</a> for knightly names, protective aliases and faction-based options. It is free, and you can save a shortlist in your browser before checking names in game.' }
  ]
};
