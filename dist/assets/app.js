/* Aion 2 Name Generator – UI */
(function () {
  'use strict';
  var NG = window.AionNameGen;
  var FAV_KEY = 'a2ng:favorites';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function loadFavs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { return []; }
  }
  function saveFavs(list) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch (e) { /* storage unavailable */ }
  }
  var favs = loadFavs();

  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    if (!t) { t = el('div', 'toast'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1600);
  }

  function copy(text) {
    var done = function () { toast('Copied “' + text + '”'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
    } else { fallbackCopy(text); done(); }
  }
  function fallbackCopy(text) {
    var ta = el('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  function isFav(name) { return favs.indexOf(name) !== -1; }
  function toggleFav(name) {
    if (isFav(name)) favs.splice(favs.indexOf(name), 1); else favs.unshift(name);
    favs = favs.slice(0, 100);
    saveFavs(favs);
    renderFavs();
    $$('[data-fav="' + name + '"]').forEach(function (b) { setFavBtn(b, name); });
  }
  function setFavBtn(btn, name) {
    var on = isFav(name);
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.title = on ? 'Remove from favorites' : 'Save to favorites';
    btn.textContent = on ? '★' : '☆';
  }

  function nameCard(item, showMeta) {
    var li = el('li', 'name-card');
    if (item.faction) li.setAttribute('data-faction', item.faction);
    var main = el('button', 'name-text', item.name);
    main.type = 'button';
    main.title = 'Copy ' + item.name;
    main.addEventListener('click', function () { copy(item.name); });
    li.appendChild(main);
    if (showMeta && item.faction) {
      var meta = [NG.FACTIONS[item.faction].label, item.gender === 'f' ? 'Female' : 'Male'];
      if (item.cls) meta.push(NG.CLASSES[item.cls].label);
      li.appendChild(el('span', 'name-meta', meta.join(' · ')));
    }
    var actions = el('span', 'name-actions');
    var c = el('button', 'icon-btn', '⧉'); c.type = 'button'; c.title = 'Copy'; c.setAttribute('aria-label', 'Copy ' + item.name);
    c.addEventListener('click', function () { copy(item.name); });
    var f = el('button', 'icon-btn fav'); f.type = 'button'; f.setAttribute('data-fav', item.name); f.setAttribute('aria-label', 'Favorite ' + item.name);
    setFavBtn(f, item.name);
    f.addEventListener('click', function () { toggleFav(item.name); });
    var v = el('button', 'icon-btn', '↻'); v.type = 'button'; v.title = 'Name taken? Show spelling variants'; v.setAttribute('aria-label', 'Variants of ' + item.name);
    v.addEventListener('click', function () { showVariants(item.name); });
    actions.appendChild(c); actions.appendChild(f); actions.appendChild(v);
    li.appendChild(actions);
    return li;
  }

  // ---------- Generator widgets ----------
  function readOpts(form) {
    var fd = function (n) { var x = form.querySelector('[name="' + n + '"]:checked') || form.querySelector('[name="' + n + '"]'); return x ? x.value : ''; };
    return {
      faction: fd('faction') === 'any' ? null : fd('faction'),
      gender: fd('gender') === 'any' ? null : fd('gender'),
      cls: fd('cls') === 'any' ? null : fd('cls'),
      style: fd('style') === 'any' ? null : fd('style'),
      startsWith: fd('startsWith'),
      maxLen: parseInt(fd('maxLen'), 10) || 12,
      count: 10
    };
  }

  function initGenerator(root) {
    var form = $('form', root);
    var list = $('.results', root);
    var lenOut = $('.len-out', root);
    var lenIn = $('[name="maxLen"]', root);
    if (lenIn && lenOut) lenIn.addEventListener('input', function () { lenOut.textContent = lenIn.value; });

    function run() {
      var opts = readOpts(form);
      var names = NG.generate(opts);
      list.innerHTML = '';
      if (!names.length) {
        list.appendChild(el('li', 'empty', 'No names matched these filters. Try a longer max length or a different starting letter.'));
        return;
      }
      names.forEach(function (n) { list.appendChild(nameCard(n, true)); });
      list.classList.remove('pop'); void list.offsetWidth; list.classList.add('pop');
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    $$('input[type=radio], select', form).forEach(function (i) { i.addEventListener('change', run); });
    var copyAll = $('.copy-all', root);
    if (copyAll) copyAll.addEventListener('click', function () {
      var names = $$('.name-text', list).map(function (b) { return b.textContent; });
      if (names.length) { copy(names.join('\n')); toast('Copied ' + names.length + ' names'); }
    });
    run();
  }

  // ---------- Favorites ----------
  function renderFavs() {
    $$('.favorites').forEach(function (box) {
      var ul = $('ul', box);
      var empty = $('.fav-empty', box);
      ul.innerHTML = '';
      favs.forEach(function (n) { ul.appendChild(nameCard({ name: n }, false)); });
      if (empty) empty.hidden = favs.length > 0;
      var clr = $('.fav-clear', box);
      if (clr) clr.hidden = favs.length === 0;
    });
  }

  // ---------- Variants ----------
  function showVariants(name) {
    var tool = $('#variant-tool');
    if (tool) {
      var inp = $('input', tool);
      inp.value = name;
      renderVariants(tool, name);
      tool.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    var vs = NG.variants(name, 8);
    toast(vs.length ? 'Try: ' + vs.slice(0, 4).join(', ') : 'No variants found');
  }
  function renderVariants(tool, name) {
    var ul = $('.results', tool);
    ul.innerHTML = '';
    var vs = NG.variants(name, 12);
    if (!vs.length) { ul.appendChild(el('li', 'empty', 'Type a name with at least 2 letters.')); return; }
    vs.forEach(function (v) { ul.appendChild(nameCard({ name: v }, false)); });
  }
  function initVariantTool(tool) {
    var form = $('form', tool), inp = $('input', tool);
    form.addEventListener('submit', function (e) { e.preventDefault(); renderVariants(tool, inp.value); });
  }

  // ---------- Static name lists (click to copy) ----------
  function initStaticLists() {
    $$('.name-list li').forEach(function (li) {
      li.tabIndex = 0;
      li.title = 'Click to copy';
      var go = function () { copy(li.textContent.trim()); };
      li.addEventListener('click', go);
      li.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
  }

  // ---------- Nav ----------
  function initNav() {
    var btn = $('.nav-toggle'), nav = $('#site-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    $$('.generator').forEach(initGenerator);
    var vt = $('#variant-tool'); if (vt) initVariantTool(vt);
    $$('.fav-clear').forEach(function (b) {
      b.addEventListener('click', function () {
        if (confirm('Clear all saved names?')) { favs = []; saveFavs(favs); renderFavs(); $$('[data-fav]').forEach(function (x) { setFavBtn(x, x.getAttribute('data-fav')); }); }
      });
    });
    renderFavs();
    initStaticLists();
  });
})();
