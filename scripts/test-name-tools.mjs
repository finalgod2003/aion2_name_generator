import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { CLASS_GUIDES } from '../src/class-guides.mjs';

const require = createRequire(import.meta.url);
const NG = require('../src/assets/namegen.js');
const NT = require('../src/assets/name-tools.js');

test('a shared link restores filters, sort and the same generated batch', () => {
  const original = { faction: 'asmodian', gender: 'f', cls: 'cleric', style: 'fantasy', startsWith: 'Mor', maxLen: 9, sort: 'readability', seed: 345678, count: 10 };
  const url = new URL(NT.shareUrl('https://www.aion2namegenerator.org/cleric-name-generator/?utm_source=old&favorites=private#old', original));
  const restored = NT.readState(url.search, { cls: 'templar' });
  assert.deepEqual(restored, original);
  assert.equal(url.pathname, '/cleric-name-generator/');
  assert.equal(url.hash, '#generator');
  assert.equal(url.searchParams.has('favorites'), false);
  assert.equal(url.searchParams.has('utm_source'), false);
  assert.deepEqual(NT.sortNames(NG.generate(restored), restored.sort), NT.sortNames(NG.generate(original), original.sort));
});

test('invalid URLs stay bounded and explicit Any overrides a page preset', () => {
  const defaults = { cls: 'templar', faction: 'elyos', maxLen: 12 };
  assert.equal(NT.readState('', defaults).cls, 'templar');
  assert.equal(NT.readState('?cls=any&faction=any', defaults).cls, null);
  const bad = NT.readState('?cls=script&gender=unknown&maxLen=999&seed=-1&startsWith=%3Cimg%3E&sort=surprise', defaults);
  assert.equal(bad.cls, null);
  assert.equal(bad.gender, null);
  assert.equal(bad.maxLen, 12);
  assert.equal(bad.seed, undefined);
  assert.equal(bad.startsWith, 'img');
  assert.equal(bad.sort, 'original');
  for (const seed of ['', '1.5', 'Infinity', '4294967296']) assert.equal(NT.readState('?seed=' + seed).seed, undefined);
  for (const seed of [0, 4294967295]) assert.equal(NT.readState('?seed=' + seed).seed, seed);
});

test('sorting preserves all names, stable ties, metadata and original saved order', () => {
  const names = ['Dawnward', 'Morax', 'Liriel', 'Nyra', 'Vexira'];
  const snapshot = [...names];
  assert.deepEqual(NT.sortNames(names, 'shortest'), ['Nyra', 'Morax', 'Liriel', 'Vexira', 'Dawnward']);
  assert.deepEqual(NT.sortNames(names, 'longest'), ['Dawnward', 'Liriel', 'Vexira', 'Morax', 'Nyra']);
  const items = names.map((name, index) => ({ name, faction: 'elyos', index }));
  const sorted = NT.sortNames(items, 'readability');
  for (let i = 1; i < sorted.length; i++) assert.ok(NG.scoreName(sorted[i - 1].name) >= NG.scoreName(sorted[i].name));
  for (const item of sorted) assert.strictEqual(item, items[item.index]);
  assert.deepEqual(names, snapshot);
  assert.deepEqual(NT.sortNames(names, 'original'), snapshot);
});

test('existing favorites survive normalization; malformed storage cannot break the page', () => {
  assert.deepEqual(NT.normalizeFavorites(['Celara', 'Nightshade', 'Morax']), ['Celara', 'Nightshade', 'Morax']);
  assert.deepEqual(NT.normalizeFavorites(['Celara', 'celara', null, 42, '<script>', 'Morax']), ['Celara', 'Morax']);
  for (const value of [null, {}, 'Celara', 123]) assert.deepEqual(NT.normalizeFavorites(value), []);
  const many = Array.from({ length: 120 }, (_, i) => 'Name' + String.fromCharCode(65 + Math.floor(i / 26), 65 + i % 26));
  assert.equal(NT.normalizeFavorites(many).length, 100);
});

test('TXT contains exactly the displayed shortlist, one name per line', () => {
  assert.equal(NT.textFile([]), '');
  assert.equal(NT.textFile(NT.sortNames(['Celara', 'Morax'], 'shortest')), 'Morax\r\nCelara\r\n');
});

test('all eight guides have distinct editorial picks and working class-specific recipes', () => {
  assert.deepEqual(Object.keys(CLASS_GUIDES), Object.keys(NG.CLASSES));
  const allNames = new Set(), titles = new Set();
  for (const [cls, guide] of Object.entries(CLASS_GUIDES)) {
    assert.ok(!titles.has(guide.title)); titles.add(guide.title);
    assert.equal(guide.picks.length, 6);
    const html = readFileSync(new URL(`../dist/${cls}-name-generator/index.html`, import.meta.url), 'utf8');
    assert.ok(html.includes(guide.title));
    assert.ok(html.includes('aion2_update_260325'));
    for (const [name, theme, reason] of guide.picks) {
      assert.ok(NG.scoreName(name) >= 78, `${cls}: ${name}`);
      assert.ok(!allNames.has(name), `duplicate editorial pick: ${name}`); allNames.add(name);
      assert.ok(theme && reason.length > 25);
      assert.ok(html.includes(`data-name="${name}"`));
    }
    for (const [, faction, style, startsWith, maxLen] of guide.recipes) {
      const batch = NG.generate({ faction, cls, style, startsWith, maxLen, count: 10, seed: 42 });
      assert.equal(batch.length, 10, `${cls}: ${style}, ${startsWith}`);
      assert.ok(batch.every(item => item.cls === cls && item.faction === faction && item.name.length <= maxLen));
    }
  }
  assert.equal(allNames.size, 48);
});
