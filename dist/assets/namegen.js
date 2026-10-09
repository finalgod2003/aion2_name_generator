/* Aion 2 Name Generator – core engine (shared by browser + build script) */
(function (root) {
  'use strict';

  var FACTIONS = {
    elyos: {
      label: 'Elyos',
      m: {
        start: ['Ae', 'Al', 'Ar', 'Cae', 'Cel', 'Da', 'El', 'Er', 'Ga', 'Ha', 'Ia', 'Ka', 'Lu', 'Ly', 'Ma', 'Ne', 'Ol', 'Ra', 'Sa', 'Se', 'Ta', 'Ti', 'Va', 'Ze', 'Ori', 'Hel', 'Sol', 'Aur'],
        mid: ['ri', 'la', 'le', 'li', 'ra', 're', 'va', 'ne', 'si', 'the', 'lo', 'ma', 'di', 'ce', 'lu'],
        end: ['el', 'iel', 'ael', 'ion', 'ius', 'an', 'ar', 'ias', 'os', 'eon', 'ian', 'ith', 'orn', 'en', 'ras', 'iel']
      },
      f: {
        start: ['Ae', 'Al', 'Ari', 'Cae', 'Cel', 'Eli', 'Ely', 'Fae', 'Ia', 'Is', 'Lu', 'Ly', 'Mi', 'Na', 'Ra', 'Sa', 'Se', 'Si', 'Ta', 'Ve', 'Yu', 'Ze', 'Ori', 'Sol', 'Aur', 'Ila'],
        mid: ['ri', 'la', 'le', 'li', 'ra', 'na', 'si', 'the', 'lu', 'ne', 'ma', 'vi', 'ce'],
        end: ['iel', 'ia', 'ara', 'ella', 'ine', 'yra', 'ena', 'ys', 'ira', 'ielle', 'eth', 'ea', 'is', 'ae', 'wyn', 'iel']
      },
      lore: ['Ari', 'Kais', 'Nez', 'Yus', 'Vai', 'Siel', 'Ely', 'San', 'Po', 'Vert', 'Hel', 'The', 'Lyra', 'Ael', 'Ingi'],
      words: ['Dawn', 'Light', 'Sun', 'Star', 'Silver', 'Gold', 'Sky', 'Holy', 'Bright', 'Aether', 'Glory', 'Halo', 'Lumen', 'Solar', 'White', 'Morning', 'Pure', 'Sacred', 'Day', 'Gleam']
    },
    asmodian: {
      label: 'Asmodian',
      m: {
        start: ['Az', 'Bra', 'Dra', 'Gor', 'Kha', 'Kr', 'Mor', 'Mal', 'Nox', 'Ra', 'Sk', 'Tor', 'Vor', 'Xa', 'Za', 'Zu', 'Gr', 'Vey', 'Ul', 'Dur', 'Ka', 'Mar', 'Zik', 'Rha', 'Vel', 'Sar'],
        mid: ['ka', 'ro', 'gu', 'tha', 'zo', 're', 'mo', 'ga', 'ru', 'xa', 'ze', 'do', 'ku'],
        end: ['ak', 'oth', 'gar', 'ar', 'uth', 'ok', 'ez', 'an', 'ul', 'orn', 'ax', 'eth', 'mar', 'kar', 'ion', 'el', 'us', 'ir']
      },
      f: {
        start: ['Az', 'Bel', 'Dra', 'Esh', 'Ka', 'Lil', 'Mor', 'Mal', 'Ny', 'Ra', 'Sha', 'Tri', 'Va', 'Vy', 'Xi', 'Za', 'Zy', 'Ly', 'Ke', 'Isha', 'Sev', 'Ny'],
        mid: ['ka', 'ri', 'ze', 'tha', 'ra', 'mo', 'lu', 'xi', 'ne', 'va', 'sha'],
        end: ['ys', 'ra', 'eth', 'iss', 'ka', 'ia', 'yx', 'ena', 'ira', 'ith', 'esh', 'ara', 'ael', 'iel', 'ix', 'yne']
      },
      lore: ['Aza', 'Zik', 'Trin', 'Lum', 'Mar', 'Isra', 'Panda', 'Ishal', 'Mor', 'Bel', 'Bru', 'Alta', 'Kro', 'Nyx', 'Umbra'],
      words: ['Dusk', 'Shadow', 'Night', 'Blood', 'Ash', 'Grim', 'Raven', 'Void', 'Storm', 'Frost', 'Doom', 'Black', 'Umbra', 'Moon', 'Dread', 'Wolf', 'Crimson', 'Hollow', 'Bone', 'Gloom']
    }
  };

  var CLASSES = {
    gladiator: {
      label: 'Gladiator', role: 'Melee DPS / Bruiser',
      start: ['Bra', 'Gar', 'Thor', 'Dra', 'Kor', 'Var', 'Bru', 'Hro'],
      end: ['gar', 'dor', 'rik', 'an', 'os', 'ox', 'rak'],
      words: ['blade', 'fury', 'breaker', 'rend', 'brand', 'howl', 'cleave', 'axe', 'rage', 'steel', 'maul', 'reaver']
    },
    templar: {
      label: 'Templar', role: 'Tank',
      start: ['Aeg', 'Val', 'Gal', 'Ser', 'Ald', 'Bas', 'Ord', 'Ced'],
      end: ['or', 'ric', 'ard', 'ion', 'ius', 'and', 'en'],
      words: ['shield', 'ward', 'oath', 'guard', 'bastion', 'aegis', 'vow', 'wall', 'keep', 'bulwark', 'crest', 'hold']
    },
    assassin: {
      label: 'Assassin', role: 'Stealth Melee DPS',
      start: ['Shi', 'Ny', 'Vex', 'Sly', 'Ka', 'Sa', 'Zy', 'Ree'],
      end: ['ix', 'ae', 'yss', 'ith', 'ra', 'ek', 'ys'],
      words: ['fang', 'shade', 'whisper', 'edge', 'veil', 'stalker', 'dagger', 'venom', 'step', 'mark', 'kiss', 'thorn']
    },
    ranger: {
      label: 'Ranger', role: 'Ranged Physical DPS',
      start: ['Fen', 'Syl', 'Ash', 'Lir', 'Rho', 'Ta', 'Hawk', 'Wyn'],
      end: ['wyn', 'ra', 'en', 'el', 'is', 'ar', 'ley'],
      words: ['arrow', 'hawk', 'wind', 'shot', 'thorn', 'strider', 'bow', 'quill', 'eye', 'feather', 'trail', 'snare']
    },
    sorcerer: {
      label: 'Sorcerer', role: 'Ranged Magic DPS',
      start: ['Zar', 'Myr', 'Xe', 'Ilf', 'Vy', 'Ma', 'Ign', 'Ore'],
      end: ['zar', 'ys', 'eus', 'ix', 'ra', 'on', 'yth'],
      words: ['flame', 'frost', 'spell', 'flare', 'weaver', 'storm', 'ember', 'hex', 'blaze', 'bolt', 'rime', 'cinder']
    },
    spiritmaster: {
      label: 'Spiritmaster', role: 'Summoner / Controller',
      start: ['Ae', 'Ny', 'Ori', 'Eth', 'Sel', 'Te', 'Ter', 'Gal'],
      end: ['ae', 'iel', 'yn', 'ora', 'is', 'en', 'oth'],
      words: ['spirit', 'caller', 'gale', 'soul', 'bind', 'rune', 'pact', 'wisp', 'tide', 'stone', 'ether', 'bond']
    },
    cleric: {
      label: 'Cleric', role: 'Healer',
      start: ['Se', 'Ama', 'Ce', 'Ly', 'Ma', 'Ari', 'Bea', 'Ele'],
      end: ['ine', 'iel', 'ara', 'ia', 'el', 'ius', 'ce'],
      words: ['grace', 'mend', 'light', 'prayer', 'mercy', 'halo', 'bloom', 'faith', 'balm', 'saint', 'hope', 'vigil']
    },
    chanter: {
      label: 'Chanter', role: 'Support / Melee Hybrid',
      start: ['Ca', 'Han', 'Lo', 'Ry', 'Ve', 'So', 'Mu', 'Can'],
      end: ['ant', 'yr', 'os', 'ren', 'ael', 'u', 'an'],
      words: ['hymn', 'song', 'echo', 'chant', 'mantra', 'verse', 'staff', 'drum', 'psalm', 'call', 'rhyme', 'tone']
    }
  };

  var STYLES = {
    fantasy: 'Fantasy',
    lore: 'Lore-inspired',
    compound: 'Epic compound',
    short: 'Short & clean'
  };

  var REAL_WORDS = /^(says|kaka|aeys|alel|olel|zeel|brar|seon|sale|male|tale|bale|kill|mama|papa|lala)$/i;
  var BLOCK = /(fuc|fuk|nigg|niga|nazi|sex|cum|tits|dik|dick|cock|kkk|rape|shit|porn|anal|cunt|slut|whore|fag|hitler)/i;
  var VOWELS = 'aeiouy';
  // Exact lore names are excluded for originality, not because the game reserves them.
  var KNOWN_NAMES = [
    'Ariel', 'Kaisinel', 'Nezekan', 'Yustiel', 'Vaizel', 'Azphel', 'Marchutan',
    'Zikel', 'Triniel', 'Lumiel', 'Siel', 'Israphel', 'Fregion', 'Tiamat',
    'Ereshkigal', 'Meslamtaeda', 'Beritra', 'Hithanya', 'Hitani', 'Nemon'
  ];
  var KNOWN_LOOKUP = {};
  KNOWN_NAMES.forEach(function (name) { KNOWN_LOOKUP[name.toLowerCase()] = true; });
  var MIN_QUALITY = 78;
  var ONSETS = /^(bl|br|ch|cl|cr|dr|fl|fr|gl|gr|hr|kh|kl|kr|ph|pl|pr|rh|sh|sk|sl|sm|sn|sp|st|sw|th|tr|tw|vr|wr|zh|chr|scr|shr|spr|str|thr)$/;
  var MEDIALS = /^(bl|br|ch|ck|cl|cr|dd|dr|ff|fl|fr|gl|gr|kh|kk|kl|kr|lb|lc|ld|lf|lg|lk|ll|lm|ln|lp|lr|ls|lt|lv|mb|mm|mn|mp|mr|ms|mt|nc|nd|ng|nk|nn|ns|nt|nv|nx|ph|pl|pr|rb|rc|rd|rf|rg|rh|rk|rl|rm|rn|rp|rr|rs|rt|rv|rz|sc|sh|sk|sl|sm|sn|sp|ss|st|sv|sw|th|tr|tt|tw|vr|zh|zz|chr|ldr|lth|mbr|mph|mpr|nch|ncr|ndr|ngr|nkr|nst|nth|ntr|rch|rgr|rsh|rsk|rst|rth|scr|shr|spr|str|thr)$/;
  var CODAS = /^(ch|ck|ft|ld|lf|lk|ll|lm|ln|ls|lt|nd|ng|nk|nn|ns|nt|nx|rd|rk|rl|rm|rn|rr|rs|rt|sh|sk|sp|ss|st|th|lth|nth|rch|rth)$/;

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); }
  function isV(c) { return !!c && VOWELS.indexOf(c) !== -1; }

  // Join syllables while smoothing awkward seams.
  function join(parts) {
    var out = '';
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].toLowerCase();
      if (!out) { out = p; continue; }
      var a = out.charAt(out.length - 1), b = p.charAt(0);
      if (a === b) p = p.slice(1);
      if (isV(a) && p && isV(p.charAt(0))) {
        // Elide a trailing vowel rather than dropping the start of an ending:
        // "mo" + "el" becomes "mel", while "a" + "el" keeps "ael".
        var seam = a + p.charAt(0);
        if (isV(p.charAt(1) || 'x') || !/^(ae|ai|au|ea|ei|ia|ie|io|oo|ou|ya|ye|yo)$/.test(seam)) out = out.slice(0, -1);
      }
      out += p;
    }
    return out.replace(/(.)\1\1+/g, '$1$1');
  }

  function compoundParts(n) {
    var roots = FACTIONS.elyos.words.concat(FACTIONS.asmodian.words);
    var endings = [].concat.apply([], objValues(CLASSES).map(function (c) { return c.words; }));
    for (var i = 0; i < roots.length; i++) {
      var first = roots[i].toLowerCase();
      if (n.indexOf(first) !== 0) continue;
      var last = n.slice(first.length);
      if (endings.indexOf(last) !== -1) return [first, last, true];
      // A familiar word may retain its boundary in a spelling variant (Nightshada).
      if (last.length >= 4) return [first, last, false];
    }
    return null;
  }

  // A pronunciation heuristic for Latin fantasy names, not a game-validity score.
  function scoreName(name) {
    var n = String(name || '').toLowerCase();
    if (!/^[a-z]{3,16}$/.test(n) || !/[aeiouy]/.test(n)) return 0;
    if (KNOWN_LOOKUP[n] || BLOCK.test(n) || REAL_WORDS.test(n)) return 0;
    if (/(.)\1\1/.test(n) || /([a-z]{2,4})\1/.test(n)) return 0;

    // Keep readable word boundaries in names such as Nightshade and Frostflame.
    var compound = compoundParts(n);
    if (compound) {
      if (compound[0] === compound[1]) return 0;
      return compound[2] ? 96 : Math.min(92, scoreName(compound[1]));
    }
    if (/[aeiouy]{3}/.test(n) || /(aa|ii|uu|yy|ao|uo|iu|yi|iy|uy|ui|ua|q[^u])/.test(n) || /q$/.test(n)) return 0;

    var score = 100;
    var clusters = /[^aeiouy]{2,}/g, match;
    while ((match = clusters.exec(n))) {
      var allowed = match.index === 0 ? ONSETS : match.index + match[0].length === n.length ? CODAS : MEDIALS;
      if (!allowed.test(match[0])) return 0;
      if (match[0].length === 3) score -= 8;
    }
    var vowels = n.match(/[aeiouy]/g).length / n.length;
    if (vowels < 0.3 || vowels > 0.65) score -= 12;
    var syllables = n.match(/[aeiouy]+/g).length;
    if (syllables > 3) score -= (syllables - 3) * 8;
    if (n.length === 3) score -= 12;
    if (/ee|oe|eo/.test(n)) score -= 10;
    if ((n.match(/y/g) || []).length > 1) score -= 12;
    if (n.length > 10) score -= (n.length - 10) * 3;
    return Math.max(0, score);
  }

  function resolve(opts, rng) {
    var faction = opts.faction && FACTIONS[opts.faction] ? opts.faction : (rng() < 0.5 ? 'elyos' : 'asmodian');
    var gender = opts.gender === 'm' || opts.gender === 'f' ? opts.gender : (rng() < 0.5 ? 'm' : 'f');
    var cls = opts.cls && CLASSES[opts.cls] ? opts.cls : null;
    var style = opts.style && STYLES[opts.style] ? opts.style : null;
    if (!style) {
      var r = rng();
      style = r < 0.5 ? 'fantasy' : r < 0.72 ? 'lore' : r < 0.9 ? 'compound' : 'short';
    }
    return { faction: faction, gender: gender, cls: cls, style: style };
  }

  function startsWithFilter(arr, sw) {
    return arr.filter(function (x) { return x.toLowerCase().indexOf(sw) === 0; });
  }

  function buildOne(o, rng, sw) {
    var F = FACTIONS[o.faction], G = F[o.gender], C = o.cls ? CLASSES[o.cls] : null;
    var start = C && rng() < 0.45 ? pick(rng, C.start) : pick(rng, G.start);
    if (sw) {
      var pool = startsWithFilter(G.start.concat(C ? C.start : []), sw);
      if (!pool.length) {
        pool = isV(sw.charAt(sw.length - 1))
          ? [sw + 'l', sw + 'r', sw + 'n', sw + 'v', sw + 'th', sw]
          : [sw + 'a', sw + 'e', sw + 'i', sw + 'o', sw + 'ae', sw + 'y'];
      }
      start = pick(rng, pool);
      if (o.style === 'lore' && !startsWithFilter(F.lore, sw).length) o.style = 'fantasy';
      if (o.style === 'compound' && !startsWithFilter(F.words, sw).length) o.style = 'fantasy';
    }
    // Class endings skew masculine, so female names keep the faction's feminine endings.
    var end = C && o.gender === 'm' && rng() < 0.35 ? pick(rng, C.end) : pick(rng, G.end);
    switch (o.style) {
      case 'short':
        return join([start, end]);
      case 'lore':
        return join([pick(rng, sw ? startsWithFilter(F.lore, sw) : F.lore), rng() < 0.2 ? pick(rng, G.mid) : '', end]);
      case 'compound':
        var w = C ? pick(rng, C.words) : pick(rng, pick(rng, objValues(CLASSES)).words);
        return pick(rng, sw ? startsWithFilter(F.words, sw) : F.words) + w;
      default:
        var parts = [start];
        if (rng() < 0.4) parts.push(pick(rng, G.mid));
        parts.push(end);
        return join(parts);
    }
  }

  function objValues(o) { return Object.keys(o).map(function (k) { return o[k]; }); }

  /**
   * generate({ faction, gender, cls, style, count, maxLen, minLen, startsWith, seed })
   * returns [{ name, faction, gender, cls, style }]
   */
  function generate(opts) {
    opts = opts || {};
    var rng = mulberry32(opts.seed != null ? opts.seed : Math.floor(Math.random() * 1e9));
    var count = opts.count || 12;
    var maxLen = opts.maxLen || 12;
    var minLen = opts.minLen || 3;
    var sw = (opts.startsWith || '').toLowerCase().replace(/[^a-z]/g, '');
    var seen = {}, out = [], tries = 0;
    while (out.length < count && tries < count * 400) {
      var o = resolve(opts, rng);
      var best = null, bestScore = MIN_QUALITY - 1;
      // Compare a small pool within the same faction/gender/style to retain variety.
      for (var i = 0; i < 8 && tries < count * 400; i++) {
        tries++;
        var candidate = { faction: o.faction, gender: o.gender, cls: o.cls, style: o.style };
        var raw = buildOne(candidate, rng, sw);
        if (sw && raw.toLowerCase().indexOf(sw) !== 0) continue;
        var name = cap(raw);
        var limit = candidate.style === 'short' ? Math.min(maxLen, 7) : maxLen;
        if (name.length > limit || name.length < minLen || seen[name]) continue;
        var score = scoreName(name);
        if (score <= bestScore) continue;
        bestScore = score;
        best = { name: name, faction: candidate.faction, gender: candidate.gender, cls: candidate.cls, style: candidate.style };
      }
      if (best) { seen[best.name] = 1; out.push(best); }
    }
    return out;
  }

  /** Spelling variants for when a name is already taken on your server. */
  function variants(input, max, opts) {
    opts = opts || {};
    var maxLen = opts.maxLen || 12;
    var base = cap(String(input || '').replace(/[^A-Za-z]/g, ''));
    if (base.length < 2) return [];
    var n = base.toLowerCase(), set = {}, list = [];
    function add(v) {
      v = cap(v);
      if (v.length < 3 || v.length > maxLen || v.toLowerCase() === n || set[v] || scoreName(v) < MIN_QUALITY) return;
      set[v] = 1; list.push(v);
    }
    if (/i/.test(n)) add(n.replace(/i(?!.*i)/, 'y'));
    if (/y/.test(n)) add(n.replace(/y/, 'i'));
    if (/c/.test(n)) add(n.replace(/c/, 'k'));
    if (/k/.test(n)) add(n.replace(/k/, 'kh'));
    if (/f/.test(n)) add(n.replace(/f/, 'ph'));
    if (/ph/.test(n)) add(n.replace(/ph/, 'f'));
    if (/s$/.test(n)) add(n + 's');
    if (/l$/.test(n)) add(n + 'l');
    if (/l$/.test(n)) add(n + 'le');
    if (/n$/.test(n)) add(n + 'n');
    if (/a$/.test(n)) add(n + 'h');
    if (/e$/.test(n)) add(n.slice(0, -1) + 'ae');
    if (isV(n.charAt(n.length - 1))) { add(n + 'l'); add(n + 'th'); add(n + 'ra'); }
    else { add(n + 'a'); if (!/l$/.test(n)) add(n + 'iel'); add(n + 'yn'); add(n + 'is'); }
    if (!isV(n.charAt(0)) && isV(n.charAt(1))) add(n.charAt(0) + 'h' + n.slice(1));
    if (isV(n.charAt(0))) add('a' + n.slice(1) === n ? 'e' + n.slice(1) : 'a' + n.slice(1));
    var m = n.match(/^(.*?[aeiouy])([^aeiouy])(.*)$/);
    if (m) add(m[1] + m[2] + m[2] + m[3]);
    add(n.replace(/([aeiou])/, '$1$1').replace(/(aa|ii|uu)/, function (x) { return x.charAt(0) + 'e'; }));
    add('Ael' + n);
    add(n + 'ion');
    return list.sort(function (a, b) { return scoreName(b) - scoreName(a); }).slice(0, max || 12);
  }

  var api = {
    FACTIONS: FACTIONS, CLASSES: CLASSES, STYLES: STYLES,
    generate: generate, variants: variants, scoreName: scoreName,
    KNOWN_NAMES: KNOWN_NAMES, mulberry32: mulberry32
  };
  root.AionNameGen = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
