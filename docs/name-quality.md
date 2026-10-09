# Name quality and regional rule notes

Updated October 9, 2026.

## Generation

The browser and static examples share `src/assets/namegen.js`.
Each output position compares up to eight candidates with the same resolved
faction, gender, class and tone. A bounded retry budget prevents impossible
prefix/length combinations from hanging the page. Candidates below the quality
threshold are rejected; the engine never relaxes that threshold just to fill a
batch. The UI explains partial or empty results.

The internal 0–100 score checks Latin-letter pronunciation patterns: vowel
balance, consonant clusters by position, repeated syllables and excessive
length. Familiar compound words keep their word boundary, so `Nightshade` is
not treated as one long consonant cluster. It is a heuristic, not an objective
human rating or an official game validator. Syllable joins and lore stems were
also adjusted to reduce awkward seams, rather than only hiding bad examples.

The exact-match exclusion list covers the twelve Empyrean Lords, five Dragon
Lords and other lore figures already referenced by this site, including known
English spelling variants. It is curated and non-exhaustive. This originality
filter does not claim that these names are officially reserved or unavailable.

Spelling variants use the same filters and respect the selected maximum length.
The standalone variant maker has its own maximum selector; opening it from a
generator result carries over the generator's current limit. Short tone caps
names at seven letters. Existing browser favorites remain available.

## Regional information

Every page with a generator or variant tool has one accessible, collapsible
regional-rules panel. The default maximum of 12 is labeled as a tool preference;
the tool generates Latin letters, with a minimum of three letters and an
adjustable maximum of 4–16. These are not promised game constraints.

- **Korea:** the official October 16, 2025 reservation announcement specifies
  1–12 Korean, English or numeric characters and per-server uniqueness. This is
  historical event evidence, not verification of today's live-service policy.
- **Taiwan:** its October 16, 2025 announcement points to local event rules
  without specifying a length limit. Current limits remain unverified here.
- **Global:** current limits remain unverified here. No Korean or Taiwan rule
  is automatically applied to Global.

Sources:

- [NCSOFT Korean reservation announcement (English)](https://about.ncsoft.com/en/news/article/aion2_update_251016)
- [NCSOFT Taiwan reservation announcement](https://about.ncsoft.com/tw/news/article/aion2_update_251016_2)

When updating these notes, verify the region and effective date of a current
official source. Update the shared panel in `build.mjs` and related FAQs together.

## Validation

Run from the repository root:

```sh
node build.mjs
node --test scripts/test-namegen.mjs
```

The suite covers the three reported awkward examples, repeated syllables,
known-character exclusions, 4,320 names spanning every faction/gender/class/tone,
seed stability, prefix and length constraints, spelling variants and the built
regional panels on all 13 tool pages. It also protects readable compounds such
as `Nightshade` from an overly broad offensive-word filter.

Browser checks cover changing the length slider, prefix filtering, opening the
regional panel, the inherited and standalone variant limits, an impossible
prefix, and mobile layout.
