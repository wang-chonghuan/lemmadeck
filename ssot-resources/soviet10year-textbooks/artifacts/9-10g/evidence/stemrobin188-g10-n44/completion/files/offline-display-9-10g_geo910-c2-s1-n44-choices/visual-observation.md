# SAME188-6 / STEMROBIN-188 N44 Choices Visual Observation

Date: 2026-11-20. Status: **PASS**, limited to static visual inspection of the two retained N44 choices full-page PNGs. No complete-lesson, production, publication, or closed-ticket claim.

Root: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`.

## Evidence and Actual Image Ledger

Exactly **2 actual image loads**, one batch of 2, via `functions.view_image`. Each complete PNG was opened once; no crops, reopens, source images, browser, renderer, or rerun. This is within the authorized 2-load budget and skill limits of 8 per batch / 24 per context.

| Load | Surface (inherited viewport) | File under this report directory | Recomputed SHA-256 | Result |
| --- | --- | --- | --- | --- |
| 1 | desktop1440x960 | `geo910-c2-s1-n44/choices-1440.png` | `7fab795ae30ae44fb985792ef2268066c7eb8a4e2e922933e61c6e8b2f3e846d` | Matches result.json; visually inspected |
| 2 | mobile390x844 | `geo910-c2-s1-n44/choices-390.png` | `82f285c2bd15c78fc1566c7f61d9dcbbcd5e72215a26fd76222c949c8347b64b` | Matches result.json; visually inspected |

`result.json` SHA-256: `63bc921acd5396f9c4b59c28467b89bb313ccd51df3f2f085b8ef6d92820c5a9`. It was not modified. Both original labels remain `mechanical display pass; visual inspection pending`; this separate record supplies the visual verdict.

Expected learner content was read only through `questions[].view` in retained core `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44/choice-set/draft.json`. Its recomputed SHA-256, `1ac2e55df52bd24fbf155ac33ac5455d5d44da85852e07b80bdefce0d40d5106`, matches both result entries.

## Hash-Bound Pixel Observations

Both image hashes above bind these observations:

- The Chinese title is intact and on one line in both images. All 10 question groups and 44 option markers/text endpoints are visible.
- Questions 1, 9, 10 have square checkbox markers; questions 2-8 have circular radio markers. Question 1 has a-h; every other question has a-d. This matches 3 multiple / 7 single from the view projection.
- Question 1 option a is already checked in both retained screenshots. The observer made no clicks and infers no answer correctness.
- The first stem retains the five named points A, B, D, E, G. All eight construction options finish visibly with their terminal point names, including mobile wraps.
- Both figures are complete within the page. Figure 06 shows O, M and its dot, all three vector-axis arrows with i/j/k labels, and the full O-to-M arrow. Figure 07 shows O, A/B/C/M marks and labels, x/y/z labels, i/j/k labels, solid segments, dashed extensions, and full outer endpoints/arrowheads.
- Chinese glyphs, fractions, radicals, vector arrows, subscripts, braces, angle signs, and pi are visible. No missing-glyph boxes or visible KaTeX error text were found.
- Desktop content remains inside its column. Mobile stems and options wrap with marker/letter columns separated from continuation text. No visible clipping, horizontal overflow, accidental overlap, or truncated option endpoint was found.
- Final question wording preserves the internal AC/BD intersection, rays toward A or C and B or D, all distinct angle sizes, choose-all instruction, and arccos range [0,pi]. Its final option d, following separator, and bottom whitespace are visible in both images.

## Per-Question Endpoints

These are display checks, not validation of mathematical or choice semantics. Every row passed on both PNGs.

| Ordinal | Visible controls | Complete content / terminal markers |
| --- | --- | --- |
| 1 | 8 checkboxes a-h | Five-point stem; both figures; option ends a A, b B, c D, d E, e G, f A, g B, h D |
| 2 | 4 radios a-d | Both coordinate groups; both tuples in every option, including final fractions and punctuation |
| 3 | 4 radios a-d | B coordinates and full distance expression in each option; d ends with 10 |
| 4 | 4 radios a-d | All four triples and closing punctuation; d ends with (0,1,0) |
| 5 | 4 radios a-d | Both median names; both expressions in each option, including fractions; d ends with 3 |
| 6 | 4 radios a-d | All four complete radical/fraction expressions; d ends with sqrt(182)/2 |
| 7 | 4 radios a-d | Three angle names and range; three arccos expressions per option, all terminal punctuation |
| 8 | 4 radios a-d | Complete scope wording; a has one pair, b/c/d each have all three pairs and closing braces |
| 9 | 4 checkboxes a-d | Four-point/order stem; all argument endings, vector arrows, and punctuation |
| 10 | 4 checkboxes a-d | Complete ray-choice scope/range; full fractions/radicals and pi-minus prefixes; d ends with pi-arccos(63/sqrt(6441)) |

**Tables: not applicable.** Current `questions[].view` contains no tables, and neither PNG contains one. No table endpoint or other-surface completeness claim is made.

**Nonblocking mobile wrap:** question 7 option c's final punctuation is on a separate line. All three expressions and punctuation are present; it does not overlap the next option.

## Inherited Mechanical Values

Copied from `result.json`, not newly measured:

| Surface | Viewport / document width | Title width | Figure 06 / 07 widths | Minimum figure text px |
| --- | --- | --- | --- | --- |
| Desktop | 1440 / 1440 | 684.8125 | 480 / 480 | 28 |
| Mobile | 390 / 390 | 358 | 358 / 358 | 20.883333333333333 |

## Limitations

Existing figure/source/math/text/four-surface PASS is inherited from the assignment, not re-reviewed. No source image or answer/review fields were opened; no mathematical or answer/choice semantic verdict was made.

Static screenshots show native-style radio/checkbox shapes, not independently proven HTML implementation or accessibility. No new measurements, clicks, keyboard tests, dynamic checks, browser, renderer, rerun, DB, environment, installation, publication, service, backend, Git, or contact operations occurred. The title was observed, not compared with lesson source.

No blockers were observed within this authorized static choices scope. Only `visual-observation.json` and `visual-observation.md` were written; result.json, screenshots, retained content, and others' work were left unchanged.
