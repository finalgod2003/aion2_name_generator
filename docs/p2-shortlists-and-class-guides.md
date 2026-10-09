# P2: shortlists, sharing and class guides

Implemented October 9, 2026.

## Player-facing behavior

- Generated results and saved names have independent sorting: original order,
  shortest first, longest first, or highest estimated readability first.
  Sorting keeps the same names and preserves the original order of tied items.
- Copy saved names and Export TXT use the displayed shortlist order. TXT is
  UTF-8 with one name per line and Windows-friendly CRLF line endings.
- Favorites keep the existing `a2ng:favorites` localStorage key and string-array
  format. Existing names remain usable. Malformed values are ignored safely;
  storage failures explain that the player should copy or export before leaving.
  The 100-name limit no longer silently evicts the oldest saved name.
- Share filters creates a URL containing the faction, gender, class, tone,
  prefix, maximum length, result sort and random seed. Reopening the URL restores
  the same batch with the current generator version. The link is also displayed
  for manual copying. It never contains the saved shortlist. The privacy page
  explains that URL parameters can appear in logs and page-view analytics.
- Eight class pages replace repetitive generated lists with two distinct naming
  directions, six curated names with reasons, two usable filter presets, a spoken
  name check, and sourced historical class context. All 48 picks are distinct
  and pass the existing quality filter. Curated picks support copy and save.

## Code locations

- `src/assets/name-tools.js`: pure URL, sorting, favorites normalization and TXT
  helpers, shared between browser code and Node tests.
- `src/assets/app.js`: controls and browser interactions.
- `src/class-guides.mjs`: original editorial content and preset data.
- `build.mjs`: shared widgets, guide markup, asset hashes and privacy copy.

The engine's readability score remains a subjective spelling heuristic, not an
official naming rule, availability check or claim about human pronunciation.
Changing the generation engine in a future release may change seeded results.

## Content sources

- [NCSOFT class reveal, June 4, 2025](https://about.ncsoft.com/en/news/article/aion2-update-250530-2)
- [NCSOFT class update, March 25, 2026](https://about.ncsoft.com/en/news/article/aion2_update_260325)

Reviewed October 9, 2026. These provide class context, not current regional build
advice. Skill names and availability can vary by region and update. Naming themes,
curated examples and their explanations are this site's creative interpretations.
The Ranger/Marksman and Spiritmaster/Elementalist wording is explained on those
pages rather than silently treating all English announcements as identical.

## Verification

```sh
node build.mjs
node --test scripts/test-namegen.mjs scripts/test-name-tools.mjs
node scripts/check-domains.mjs
```

The tests cover the P1 corpus of 4,320 names, URL round trips and invalid inputs,
stable sorting, legacy favorites and invalid storage shapes, TXT ordering, all
48 editorial names, and all 16 class presets.

Browser checks cover sorting without regeneration, curated favorites, persistence
across navigation, clipboard contents, actual TXT download contents, shared-link
reproduction, unsubmitted prefix edits, class preset navigation, and desktop and
mobile layout.
