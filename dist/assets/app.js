/* Aion 2 Name Generator – UI */
(function () {
  'use strict';
  var NG = window.AionNameGen;
  var NT = window.AionNameTools;
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
    try { return NT ? NT.normalizeFavorites(JSON.parse(localStorage.getItem(FAV_KEY))) : []; } catch (e) { return []; }
  }
  function saveFavs(list) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); } catch (e) { toast('Browser storage is unavailable. Copy or export your shortlist before leaving.'); }
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

  function copy(text, message) {
    var done = function (ok) { toast(ok ? message || 'Copied “' + text + '”' : 'Copy was blocked. Select the text or use Export TXT.'); return ok; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return done(true); }, function () { return done(fallbackCopy(text)); });
    }
    return Promise.resolve(done(fallbackCopy(text)));
  }
  function fallbackCopy(text) {
    var ta = el('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { /* report failure to caller */ }
    document.body.removeChild(ta);
    return ok;
  }

  function isFav(name) { return favs.indexOf(name) !== -1; }
  function toggleFav(name) {
    if (isFav(name)) favs.splice(favs.indexOf(name), 1);
    else {
      if (favs.length >= 100) { toast('Your shortlist has 100 names. Remove one before saving another.'); return; }
      favs.unshift(name);
    }
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
    v.addEventListener('click', function () { showVariants(item.name, li); });
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
    var sort = $('.result-sort', root);
    var shareBox = $('.share-link-box', root);
    var batch = [], seed, generatedOpts;
    var restored = NT.readState(window.location.search, readOpts(form));
    ['faction', 'gender', 'cls', 'style', 'startsWith', 'maxLen'].forEach(function (key) {
      var value = restored[key] == null ? 'any' : String(restored[key]);
      $$('[name="' + key + '"]', form).forEach(function (input) {
        if (input.type === 'radio') input.checked = input.value === value;
        else input.value = value;
      });
    });
    lenOut.textContent = lenIn.value;
    sort.value = restored.sort;
    if (lenIn && lenOut) lenIn.addEventListener('input', function () { lenOut.textContent = lenIn.value; });

    function render() {
      var names = NT.sortNames(batch, sort.value);
      list.innerHTML = '';
      $('.copy-all', root).disabled = names.length === 0;
      $('.results-count', root).textContent = names.length + ' names';
      if (!names.length) {
        list.appendChild(el('li', 'empty', 'No names matched these filters. Try a longer max length or a different starting letter.'));
        return;
      }
      names.forEach(function (n) { list.appendChild(nameCard(n, true)); });
      if (names.length < generatedOpts.count) {
        list.appendChild(el('li', 'empty', 'Found ' + names.length + ' readable matches. Try a longer maximum or a different starting letter for more.'));
      }
      list.classList.remove('pop'); void list.offsetWidth; list.classList.add('pop');
    }
    function run(initialSeed) {
      seed = typeof initialSeed === 'number' ? initialSeed : Math.floor(Math.random() * 1e9);
      generatedOpts = readOpts(form);
      generatedOpts.seed = seed;
      batch = NG.generate(generatedOpts);
      shareBox.hidden = true;
      render();
    }
    form.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    if (lenIn) lenIn.addEventListener('change', run);
    $$('input[type=radio], select', form).forEach(function (i) { i.addEventListener('change', run); });
    $('[name="startsWith"]', form).addEventListener('change', run);
    sort.addEventListener('change', function () { shareBox.hidden = true; render(); });
    $('.share-filters', root).addEventListener('click', function () {
      // Include unsent text edits too; the shared link and visible batch must agree.
      if (JSON.stringify(readOpts(form)) !== JSON.stringify(Object.assign({}, generatedOpts, { seed: undefined }))) run();
      var url = NT.shareUrl(window.location.href, Object.assign({}, generatedOpts, { sort: sort.value }));
      var input = $('input', shareBox);
      input.value = url;
      shareBox.hidden = false;
      copy(url, 'Filter link copied').then(function (ok) { if (!ok) { input.focus(); input.select(); } });
    });
    var copyAll = $('.copy-all', root);
    if (copyAll) copyAll.addEventListener('click', function () {
      var names = $$('.name-text', list).map(function (b) { return b.textContent; });
      if (names.length) copy(names.join('\n'), 'Copied ' + names.length + ' names');
    });
    run(restored.seed);
  }

  // ---------- Favorites ----------
  function renderFavs() {
    $$('.favorites').forEach(function (box) {
      var ul = $('ul', box);
      var empty = $('.fav-empty', box);
      ul.innerHTML = '';
      NT.sortNames(favs, $('.fav-sort', box).value).forEach(function (n) { ul.appendChild(nameCard({ name: n }, false)); });
      if (empty) empty.hidden = favs.length > 0;
      $('.fav-count', box).textContent = favs.length + ' / 100';
      $$('.fav-copy, .fav-export, .fav-sort', box).forEach(function (control) { control.disabled = favs.length === 0; });
      var clr = $('.fav-clear', box);
      if (clr) clr.hidden = favs.length === 0;
    });
  }

  function initFavorites(box) {
    function orderedNames() { return NT.sortNames(favs, $('.fav-sort', box).value); }
    $('.fav-sort', box).addEventListener('change', renderFavs);
    $('.fav-copy', box).addEventListener('click', function () {
      if (favs.length) copy(orderedNames().join('\n'), 'Copied ' + favs.length + ' saved names');
    });
    $('.fav-export', box).addEventListener('click', function () {
      if (!favs.length) return;
      var url = URL.createObjectURL(new Blob([NT.textFile(orderedNames())], { type: 'text/plain;charset=utf-8' }));
      var link = el('a'); link.href = url; link.download = 'aion-2-saved-names.txt';
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      toast('TXT download started');
    });
  }

  // ---------- Variants ----------
  function showVariants(name, card) {
    var tool = $('#variant-tool');
    var source = card && card.closest('#variant-tool, .generator');
    var lengthInput = source ? $('[name="maxLen"]', source) : $('.generator [name="maxLen"]') || $('#variant-tool [name="maxLen"]');
    var maxLen = lengthInput ? parseInt(lengthInput.value, 10) : 12;
    if (tool) {
      var inp = $('input', tool);
      inp.value = name;
      $('[name="maxLen"]', tool).value = String(maxLen);
      renderVariants(tool, name);
      tool.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    var vs = NG.variants(name, 8, { maxLen: maxLen });
    toast(vs.length ? 'Try: ' + vs.slice(0, 4).join(', ') : 'No readable variants fit. Try a longer maximum length.');
  }
  function renderVariants(tool, name) {
    var ul = $('.results', tool);
    ul.innerHTML = '';
    var maxLen = parseInt($('[name="maxLen"]', tool).value, 10);
    var vs = NG.variants(name, 12, { maxLen: maxLen });
    if (!vs.length) { ul.appendChild(el('li', 'empty', 'No readable variants fit. Try a different name or a longer maximum length.')); return; }
    vs.forEach(function (v) { ul.appendChild(nameCard({ name: v }, false)); });
  }
  function initVariantTool(tool) {
    var form = $('form', tool), inp = $('input', tool);
    form.addEventListener('submit', function (e) { e.preventDefault(); renderVariants(tool, inp.value); });
    $('[name="maxLen"]', tool).addEventListener('change', function () { if (inp.value) renderVariants(tool, inp.value); });
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
    $$('.curated-name').forEach(function (card) {
      var name = card.getAttribute('data-name');
      $('.curated-copy', card).addEventListener('click', function () { copy(name); });
      var button = $('[data-fav]', card);
      setFavBtn(button, name);
      button.addEventListener('click', function () { toggleFav(name); });
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
    $$('.favorites').forEach(initFavorites);
    $$('.fav-clear').forEach(function (b) {
      b.addEventListener('click', function () {
        if (confirm('Clear all saved names?')) { favs = []; saveFavs(favs); renderFavs(); $$('[data-fav]').forEach(function (x) { setFavBtn(x, x.getAttribute('data-fav')); }); }
      });
    });
    renderFavs();
    initStaticLists();
    window.addEventListener('storage', function (event) {
      if (event.key !== FAV_KEY && event.key !== null) return;
      favs = loadFavs(); renderFavs();
      $$('[data-fav]').forEach(function (button) { setFavBtn(button, button.getAttribute('data-fav')); });
    });
  });
})();
