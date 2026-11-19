# n92 FIRST ANSWER FINAL, b94

First verdict: **PASS**. Candidate physics, units, grading, notes, derived identity and complete frozen-SOURCE facet coverage pass for all five written questions. No finding, no candidate correction and no SOURCE/TEXT rerun.

## Authorized Inputs

Parent directly confirmed actual prior bindings complete before disclosing this key: TEXT manifest `70b7cc83c8e7d1a54f2d83bee84c6cb464f25acc191766edd360114ce8b7ff3b` (bound20), ANSWER SOURCE manifest `9dcabb4799aeb31f2fd219280abfd862bb47220955b441525619bd1373318901` (bound21). The existing independent solutions remain unchanged: 19766 bytes, SHA-256 `dba8d751aa0fc323acecde9268564e1201dd6b5cb10a801f289feb8833fd59e3`, mode `0444`, **17** facets, counts **3 / 2 / 3 / 4 / 5**.

Only author key read: `tmp/resume-180-4/n92-answer-author/FIRST-candidate.json` below this ticket, **3705** bytes, SHA-256 `27e5e3899c814c4cf317fe69eb8e458534cf45dd4bba945d390ee5c7ce43f788`, mode `0444`.

## Complete Comparison

| Exercise | Facets | Verdict |
| --- | --- | --- |
| 1 | 3/3 | PASS: unit mass (1 g or 1 kg), material, temperature rise of 1 degree Celsius and required heat are explicit. Symbol c and all unit examples are consistent. Ungraded, empty parts; note correctly explains semantic grading limitations. |
| 2 | 2/2 | PASS: 4200 J/(kg·degree Celsius) followed by 1 cal/(g·degree Celsius), with exactly two separately labeled numeric parts, expected `4200` and `1`. Heating examples preserve the 1 kg/1 g distinction. Note explicitly preserves source rounding and part order. |
| 3 | 3/3 | PASS: 1 kg lead; +1 degree Celsius needs 140 J; -1 degree Celsius releases 140 J. Internal energy increases/decreases by 140 J in the lesson model. Ungraded and empty parts, not a fake one-number explanation. |
| 4 | 4/4 | PASS: 1 kg/+1 degree Celsius normalization, internal-energy increase in joules, cooling decrease and equal-mass/equal-temperature-change comparison. Explicitly rejects treating c as total existing internal energy. Ungraded; no mandatory formula or keyword judge. |
| 5 | 5/5 | PASS: large water specific heat, summer absorption, nearby summer heat moderation, winter release and nearby winter cold moderation. Full causal chain, ungraded with empty parts. Note correctly rejects a lone “水的比热大” as a complete automatically gradable explanation. |

All five `displayAnswer`, `parts`, `grading`, `notes`, `source` and `bookRaw` values were read. Lesson `phy7-c1-s1-n92`, book `7p`, edition `modern-us-neutral`, exercises `1..5` match the frozen questions. All five answers honestly declare `source: derived`, `bookRaw: null`; no historical entities are introduced.

All **17** frozen facets are covered. Celsius increments, kg/g and J/cal/kcal denominator conventions are sound. Water's source-rounded **4200**, lead's **140**, heating/cooling directions and both seasonal effects are unchanged. Seven inline math spans are balanced and contain no forbidden CJK punctuation. Q2 is the only automatic task, with **two fixed-unit numeric parts**; the other **four reasoning tasks are ungraded**.

The frozen SOURCE makes the additional heat formula and scientific-limit elaborations optional. Q4 stays within the lesson's temperature-change model; it does not supply an unrestricted formula or claim constant specific heat through state changes. Its omission of an explicit phase/work caveat is therefore not a defect.

## Later Metadata Binding

This candidate is intentionally **not yet prepare-generated** while edition FIG work remains in progress. This is **semantic FIRST FINAL PASS**, not a claim that prepare/finalize, runtime or publication gates have already passed.

The reviewed semantic projection contains `book`, `lesson`, `edition` and `answers`, with each answer projected to `exercise`, `grading`, `source`, `bookRaw`, `displayAnswer`, `parts`, `notes`, `historical_entities`. Recursively sort object keys, preserve array order, serialize using `JSON.stringify` without whitespace. SHA-256:

`1a1a2521633d521b1c119fdb290ba3ea99cfca98b7f9e7ad5d94d55d7ad2b06f`

Parent can bind later prepare-generated metadata without a full semantic replay only when that reviewed identity and complete projection remain unchanged. Changes to displayed text, numeric parts/units/values, grading, notes or derived identity require affected review. Later tool validation remains required; this result grants no figure or publication approval.

## Frozen Outputs

Machine report: `tmp/resume-180-4/n92-ANSWER-FINAL/report.json`; exact direct-input/current-SOURCE/output binding: sibling `manifest.json`. Both files and this note are mode `0444`.

Images/scans read: **0 / 0**. No table FIG review, source/key-history read, SOURCE/TEXT rerun, existing-source/candidate edit, new recorder, prepare/finalize, full test, app, Git, env, DB, browser, network, paid call or promotion. The worker stops after this FINAL freeze.
