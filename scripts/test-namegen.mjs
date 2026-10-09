import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const NG = require('../src/assets/namegen.js');

test('rejects reported awkward names, repeated syllables and exact lore names', () => {
  const rejected = ['Morhmoel', 'Zikguak', 'Belusluyx', 'Lalaria', 'Zezera', 'Frostfrost', 'Lightlight', 'Aaael', 'Qzxr'];
  for (const name of rejected.concat(NG.KNOWN_NAMES)) {
    assert.equal(NG.scoreName(name), 0, name);
    assert.equal(NG.scoreName(name.toUpperCase()), 0, name + ' case-insensitive');
  }
  for (const name of ['Celara', 'Liriel', 'Morax', 'Zaroth', 'Dawnward', 'Nightshade', 'Frostflame']) {
    assert.ok(NG.scoreName(name) >= 78, `keep readable fantasy/compound name ${name}`);
  }
});

test('all factions, genders, classes and tones produce full, distinct batches', () => {
  const known = new Set(NG.KNOWN_NAMES.map(name => name.toLowerCase()));
  const all = new Set();
  for (const faction of Object.keys(NG.FACTIONS)) {
    for (const gender of ['m', 'f']) {
      for (const cls of [null, ...Object.keys(NG.CLASSES)]) {
        for (const style of Object.keys(NG.STYLES)) {
          for (const seed of [7, 42, 2026]) {
            const opts = { faction, gender, cls, style, seed, count: 10, maxLen: 12 };
            const names = NG.generate(opts);
            const context = JSON.stringify(opts);
            assert.equal(names.length, 10, context);
            assert.equal(new Set(names.map(n => n.name)).size, 10, context);
            for (const item of names) {
              assert.match(item.name, /^[A-Z][a-z]{2,11}$/);
              assert.ok(!known.has(item.name.toLowerCase()), item.name);
              assert.equal(item.faction, faction);
              assert.equal(item.gender, gender);
              assert.equal(item.cls, cls);
              assert.equal(item.style, style);
              if (style === 'short') assert.ok(item.name.length <= 7, item.name);
              all.add(item.name);
            }
          }
        }
      }
    }
  }
  assert.ok(all.size > 1000, `retain variety across 4,320 names; got ${all.size}`);
});

test('seeded output is stable and prefix/length constraints survive ranking', () => {
  const opts = { faction: 'asmodian', cls: 'cleric', seed: 12345, count: 15 };
  assert.deepEqual(NG.generate(opts), NG.generate(opts));
  assert.notDeepEqual(NG.generate(opts), NG.generate({ ...opts, seed: 54321 }));
  for (const startsWith of ['K', 'Al', 'Mor']) {
    for (const maxLen of [4, 7, 12, 16]) {
      const names = NG.generate({ startsWith, maxLen, minLen: 4, seed: 17, count: 10 });
      assert.ok(names.length > 0, `${startsWith}, ${maxLen}`);
      for (const { name } of names) {
        assert.ok(name.toLowerCase().startsWith(startsWith.toLowerCase()), name);
        assert.ok(name.length >= 4 && name.length <= maxLen, name);
      }
    }
  }
  assert.deepEqual(NG.generate({ startsWith: 'Qzx', maxLen: 4, seed: 1 }), []);
});

test('variants obey the same quality gate and the chosen length', () => {
  const known = new Set(NG.KNOWN_NAMES.map(name => name.toLowerCase()));
  const samples = ['Celara', 'Ariel', 'Zaroth', 'Morhmoel', 'Belusluyx', 'Ariela', 'Frostflame'];
  assert.ok(NG.variants('Celara').length >= 4);
  assert.ok(NG.variants('Nightshade').length > 0, 'preserve readable compound variants');
  assert.ok(NG.variants('Ariel').includes('Aryel'));
  assert.ok(!NG.variants('Ariela').includes('Ariel'));
  for (const name of samples) {
    for (const maxLen of [4, 7, 12, 16]) {
      const variants = NG.variants(name, 12, { maxLen });
      assert.equal(new Set(variants).size, variants.length);
      for (const variant of variants) {
        assert.ok(variant.length <= maxLen && variant.length >= 3, variant);
        assert.notEqual(variant.toLowerCase(), name.toLowerCase());
        assert.ok(!known.has(variant.toLowerCase()), variant);
        assert.ok(NG.scoreName(variant) >= 78, variant);
      }
    }
  }
  assert.deepEqual(NG.variants(''), []);
  assert.deepEqual(NG.variants('A'), []);
});

test('built generator/variant pages include scoped rules and readable static examples', () => {
  const dist = new URL('../dist/', import.meta.url);
  const folders = readdirSync(dist, { withFileTypes: true }).filter(x => x.isDirectory() && x.name !== 'assets');
  const paths = ['index.html', ...folders.map(x => join(x.name, 'index.html'))];
  let checked = 0;
  for (const path of paths) {
    const html = readFileSync(new URL(path.replaceAll('\\', '/'), dist), 'utf8');
    if (!html.includes('id="generator"') && !html.includes('id="variant-tool"')) continue;
    checked++;
    assert.equal((html.match(/id="naming-rules"/g) || []).length, 1, path);
    for (const text of ['Global', 'Korea (KR)', 'Taiwan (TW)', 'Historical reservation rules', 'Current limits unverified', 'about.ncsoft.com/en/news/article/aion2_update_251016']) {
      assert.ok(html.includes(text), `${path}: ${text}`);
    }
    for (const list of html.matchAll(/<ul class="name-list">([\s\S]*?)<\/ul>/g)) {
      for (const item of list[1].matchAll(/<li>([A-Za-z]+)<\/li>/g)) assert.ok(NG.scoreName(item[1]) >= 78, `${path}: ${item[1]}`);
    }
  }
  assert.equal(checked, 13);
});
