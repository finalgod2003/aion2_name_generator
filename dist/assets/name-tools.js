/* Small, shared helpers for shortlists, sorting and reproducible filter links. */
(function (root) {
  'use strict';
  var NG = typeof module !== 'undefined' && module.exports ? require('./namegen.js') : root.AionNameGen;
  var SORTS = ['original', 'shortest', 'longest', 'readability'];

  function normalizeFavorites(value) {
    if (!Array.isArray(value)) return [];
    var seen = Object.create(null);
    return value.filter(function (name) {
      if (typeof name !== 'string' || !/^[A-Za-z]{1,16}$/.test(name) || seen[name.toLowerCase()]) return false;
      seen[name.toLowerCase()] = true;
      return true;
    }).slice(0, 100);
  }

  function sortNames(items, order) {
    // Carry the original index so ties stay stable, including saved-name order.
    return items.map(function (item, index) { return { item: item, index: index }; })
      .sort(function (a, b) {
        var an = typeof a.item === 'string' ? a.item : a.item.name;
        var bn = typeof b.item === 'string' ? b.item : b.item.name;
        var difference = order === 'shortest' ? an.length - bn.length
          : order === 'longest' ? bn.length - an.length
          : order === 'readability' ? NG.scoreName(bn) - NG.scoreName(an) : 0;
        return difference || a.index - b.index;
      }).map(function (entry) { return entry.item; });
  }

  function readState(search, defaults) {
    defaults = defaults || {};
    var p = new URLSearchParams(search), out = {};
    var choices = { faction: Object.keys(NG.FACTIONS), gender: ['m', 'f'], cls: Object.keys(NG.CLASSES), style: Object.keys(NG.STYLES) };
    Object.keys(choices).forEach(function (key) {
      var value = p.has(key) ? p.get(key) : defaults[key];
      out[key] = choices[key].indexOf(value) >= 0 ? value : null;
    });
    out.startsWith = String(p.has('startsWith') ? p.get('startsWith') : defaults.startsWith || '').replace(/[^a-z]/gi, '').slice(0, 3);
    var length = p.has('maxLen') ? Number(p.get('maxLen')) : defaults.maxLen;
    out.maxLen = Number.isInteger(length) && length >= 4 && length <= 16 ? length : 12;
    out.sort = SORTS.indexOf(p.get('sort')) >= 0 ? p.get('sort') : 'original';
    var seed = p.get('seed');
    if (seed !== null && /^\d{1,10}$/.test(seed) && Number(seed) <= 4294967295) out.seed = Number(seed);
    out.count = 10;
    return out;
  }

  function shareUrl(href, state) {
    var url = new URL(href);
    url.search = '';
    ['faction', 'gender', 'cls', 'style'].forEach(function (key) { url.searchParams.set(key, state[key] || 'any'); });
    if (state.startsWith) url.searchParams.set('startsWith', state.startsWith);
    url.searchParams.set('maxLen', String(state.maxLen));
    url.searchParams.set('sort', SORTS.indexOf(state.sort) >= 0 ? state.sort : 'original');
    if (state.seed != null) url.searchParams.set('seed', String(state.seed));
    url.hash = 'generator';
    return url.href;
  }

  function textFile(names) { return names.length ? names.join('\r\n') + '\r\n' : ''; }

  var api = { normalizeFavorites: normalizeFavorites, sortNames: sortNames, readState: readState, shareUrl: shareUrl, textFile: textFile };
  root.AionNameTools = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
