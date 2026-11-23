# P53-only fragment repair: applied and focused PASS

All commands used explicit workdir
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
Only the fragment-classifier block in `layout.py::line_bands` changed after the
guarded entry. The verified nonempty-core guard remains. The portable test adds
four p53 methods; original methods, deletion masks and expectations are unchanged.
This is technical counter evidence, not semantic source approval or a finalize.

## Cause and minimal repair

The retained p53 inventory is 15 prose/formula rows plus footer, with no figures
or fractions. Original first finalize remains 17 printed / 16 authored.
No source omission was identified in the previous single image inspection.

- Isolated band y1871..1907 contains 21x10, 18x7 and 29x16 fragments. The latter
  two fail the existing 60% box-density check. Their local 3x3 opening retains
  81.9%, 82.8% and 95.8% respectively, with short, hole-free opened cores.
- Deletion724..792 leaves another actual margin group: 57x34, two substantial
  fragments and 18 satellite pixels. Its width exceeds the old 54.4-pixel limit.
  The 34x30 fragment retains 91.4% and shrinks to a 25-pixel core; the 23x16
  fragment retains 89.4%. Simply repairing the isolated band leaves this deletion
  at 16 instead of the required 15.
- The new fallback is confined to the existing narrow-margin fragment classifier:
  width is bounded by the same glyph-relative scale, at least two substantial
  fragments must retain 80% through local 3x3 opening, cores must remain short
  and hole-free, and tiny satellites are capped at 15% of group area.
  Existing closed-hole, fragment-width and neighborhood vetoes remain.
- Taller fragments additionally require a height reduction of at least 10% of
  glyph height. This is necessary: the actual small hollow glyph at x438/y240
  loses its tiny hole during closing and retains a 25-pixel core from 26 pixels.
  The first candidate deleted it at both margins despite matching source counts.
  Requiring a substantial tail preserves that glyph while admitting the actual
  five-pixel debris tail. Larger hollow and full-height real glyph controls pass.

The earlier diagnosis's zero-hole values describe the closed fragment masks,
not all raw ink: some debris has 2 or 3 pinhole pixels. No source pixels are
altered. There are no page-specific production masks, counts or coordinates.
Global solid-core, emphasis-dot, glyph-height and fraction logic are unchanged.

## Actual retained results

Paths below are relative to this report's directory. Failures include subtests.

| Evidence | P53 methods/failures | Source53 | Delete724..792 | Guard | Prior focused | Shared |
| --- | --- | --- | --- | --- | --- | --- |
| `baseline-01/` | 10/35 | 17/16 | 17/15 | 2/2 PASS | 13/13 PASS | 47, 4 failures, 2 skips |
| `candidate-01/` | 10/0 | 16/16 | 15/15 | 2/2 PASS | 13/13 PASS | unchanged |
| `candidate-01-hollow-control/` | 11/2 | 16/16 | 15/15 | 2/2 PASS | 13/13 PASS | unchanged |
| `candidate-02/` | 11/0 | 16/16 | 15/15 | 2/2 PASS | 13/13 PASS | unchanged |
| `current-final/` | 11/0 | 16/16 | 15/15 | 2/2 PASS | 13/13 PASS | unchanged |

All 16 actual interior-row deletions lower the count to 15 without deleting
margin ink; all 16 authored omissions fail reconciliation. Mirroring, actual
glyph/footer movement and standalone addition, two genuine hollow glyph sizes,
full-height glyphs, nearby-glyph veto and nonmutation controls pass.
Combined runner exit is honestly 1 because the shared original numeral 1/7
failures at left21/1549 remain; the two skips require original107.
The n7 fragmented-margin six methods pass within that shared run.

`entry/` retains the guarded layout/test snapshot and actual diagnosis.
Each executed candidate retains its exact layout/test, results.json and streams.
`scope-verification.json` and `layout-current.diff` verify the applied delta,
unchanged prior/n7 tests, unchanged first45/48 failures and53 inputs, and the
unchanged original Ampere report and rejected broad candidate02.
That earlier broad candidate's 24 methods / 10 failures remain preserved.

## Deferred and Unchanged

Original45 is 17/15 and48 is 26/25; their first receipts and artifacts remain at
the durable `pages/0045/finalize-initial/` and `pages/0048/finalize-initial/`.
Their fraction/arrow and margin gaps are deferred. No current45/48 count replay
was performed after this p53 fragment change; no PASS is claimed for them.
P54's author-reported first22/21 separator gap y2095..2101 is still unhandled;
its two scientific footnote rows and true fractions were not touched or replayed.
Parent-reported finalize44 15/15 and47 17/17 remain prior successful evidence.
Prepare55 was not inspected or replayed in this resume; only its previously
verified empty-core guard and controls are retained.

## Hashes and Usage

Applied layout SHA256:
`9872032f001b8066dc6ce223bd8381fc0d2b50953950a26c5a9aaeae3c44b9f6`

Focused portable test SHA256:
`bb62ef1ead3e13572e5f903fbe790190378bfa9b54ad4894825c0868ef8252a9`

Original p53 render SHA256:
`4ca8b99d5cba9822b9df924b470b4ef81fec20a683e5a72157190a033fb77d40`

Zero new images or reopens: cumulative usage remains 6/8 batch and6/24 context.
Only numerical masks from the already inspected p53 source were read.
No source/page/audit/product-crop/index/lesson writes, finalize, source55 replay,
Git, DB, app/schema, installation, paid requests, chat, timers or messages.
Installer/user/parent changes and original packages were preserved.
