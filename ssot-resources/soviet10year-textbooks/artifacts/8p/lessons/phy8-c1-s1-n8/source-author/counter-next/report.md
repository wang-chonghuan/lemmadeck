# STEMROBIN-180 counter recovery: guard applied, count repair not accepted

Every command used explicit workdir
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
This is a disjoint technical sidecar result, not source/content approval.
The parent retains affected-finalize and source-review ownership.

## Current applied change

Only `layout.py::line_bands` was changed: `solid_core` now requires
`np.any(core)` before the existing 70%-area/hole-free checks.
An earlier margin-cluster bounding box can enclose a disconnected later cluster.
After the earlier box is removed, that later region has zero ink. Previously,
`0 >= 0` and no holes made the empty core "solid", then `core_rows[-1]` crashed.

The actual new prepare55 traceback at
`.tmp/ld-s10y-lesson/8p/pages/0055/prepare.0001.stderr` was read, not replayed.
Its SHA256 is
`750cb795b2bfb259c79fa65dabc01f1a8257dff72e0f0901e283c02896b176b0`.
The portable nested-cluster control reproduces the same IndexError on entry.
`empty-core-baseline/`: 2 tests, 1 error. `empty-core-fixed/`: 2 tests, no failures/errors.
Source55 pixels/counts were not observed; no prepare55 or finalize was run.

Current layout SHA256:
`17d1ebc192fdd97d8ee4a86d4dc8b7b41afef7afd2c97ce15106d00beb1b19e5`.
Added portable test `tools/test_line_bands_counter_rows.py` SHA256:
`ec18910e0fa30685c35ac255d1373f1f524796df032425b278e91ff4c3e6df55`.
The new file retains failing recovery controls; it is not an all-green claim.

## Actual source and counter diagnosis

Original45 and48 were inspected independently, once each. The related53 source
was inspected once after direct authorization. Their row inventories agree with
15, 25 and 16 authored rows respectively. No missing source row was identified.
This narrow row inventory does not approve wording, mathematics or source semantics.

- P45: the arrow above the inline fraction is split into band y361..376,
  separate from its y390..462 printed row. Three left-margin debris fragments
  produce the extra y1857..1894 band. Initial median height 29 yields glyph
  estimate 24, excluding many full-sized body glyphs. Simply enlarging that
  estimate did not repair the counts and disturbed other bands.
- P48: clipped margin debris at x1648/y578, 31x42 after counting-edge exclusion,
  misses the compact-shape check. Its solid opening core is 570 pixels of 666,
  with a 26x25 core and no hole. It bridges the preceding prose and fraction.
  Independently, deleting that mark still counts 26: the genuine fraction
  y600..703 is split twice. Its local math-component height is about 30 versus
  global body glyph height 43; the helper's global-size decision is false.
  Therefore this was not merely a presumed blot fix.
- P53: 15 prose/formula rows y228..1413 plus footer y2263..2293; no figures or
  fractions. Disconnected left-margin debris creates the extra y1871..1907 band.
  The three relevant closed fragments are 21x10/127 pixels, 18x7/58 pixels,
  and 29x16/213 pixels. Current glyph estimate is 38. No source omission found.

Actual durable first failures remain referenced, not copied or overwritten:
`pages/0045/finalize-initial/` (17/15, zero normalizations),
`pages/0048/finalize-initial/` (26/25, zero normalizations), and
`pages/0053/` with `source-finalize.execution.json/.stdout/.stderr` (17/16).
Entry diagnoses bind original argv, streams, audit, source/render hashes:
`entry/diagnosis.json`, `entry/related53-diagnosis.json`.
P46 was not run after the p45 failure, and this sidecar did not run it.

## Retained actual candidates and checks

Counts are counted/authored. Failure totals include unittest subtest failures.
Shared checks are the same existing n7 fragmented-margin, margin-core, fraction,
short-continuation, expanded-layout and hollow-margin checks used previously.

| Snapshot/evidence | New focused methods/failures/errors | P45 | P48 | P53 | Prior focused | Shared tests/failures/skips |
| --- | --- | --- | --- | --- | --- | --- |
| `baseline-00` | 12/61/0 | 17/15 | 26/25 | not included | 13/0 | 47/4/2 |
| `hypothesis-01` | diagnostic only | 17/15 | 26/25 | not included | not run | not run |
| `candidate-01` | 12/14/0 | 16/15 | 25/25 | 17/16, separate diagnosis | 13/0 | 47/4/2 |
| `baseline-extended-01` | 24/106/1 | 17/15 | 26/25 | 17/16 | 13/0 | 47/4/2 |
| `candidate-02` | 24/10/0 | 15/15 | 25/25 | 16/16 | 13/0 | 47/4/2 |
| `current-final` | 24/106/0 | 17/15 | 26/25 | 17/16 | 13/0 | 47/4/2 |

Candidate02 attempts local body-backed dot/fragment sizing, hole-free solid
fragment cores, compact-core recognition for clipped tails, fraction-proven
arrow joins and local math sizing with a full-body-glyph veto.
It is NOT applied. Its layout SHA256:
`75bbb7f903982ec11b6899dfcabf2187b5942252555a2e2f17516fa2995ec048`.

Matching counts are insufficient: candidate02 still loses the standalone real
hollow caption glyph at both margins, fails standalone actual-fraction controls,
fails three actual-row deletion controls, and fails the right-margin moved
fraction control. The 10 original failing assertions are retained unchanged in
`candidate-02/focused.txt`; no expectations or deletion controls were weakened.
All 56 authored omission checks and original 44/47 focused assertions pass on
this candidate, but that does not outweigh its genuine edge-control failures.
Count recovery remains incomplete; only the verified execution guard was accepted.

Every actually run baseline/candidate has its layout/test snapshot, `results.json`,
`prior_focused.txt`, `focused.txt`, and `shared.txt`.
The shared four failures are unchanged numeral 1/7 subtests at left=21/1549;
the two skips require original107. Combined runners exit 1. No whole-suite PASS.
The prior Ampere package `.tmp/180-7-n8-counter/` is untouched, including its
13-pass focused result, original 4 failures/2 skips and actual candidates.
Parent-reported finalize44 PASS15/15 and finalize47 PASS17/17 were not replayed.

## Precisely Unhandled P54

P54 first finalize is 22/21, zero figures/normalizations. The source author's
reported extra is the horizontal footnote separator y2095..2101. Scientific
footnote `p0054#10` has two actual rows and two genuine fractions that must stay;
the standalone formula has another fraction. No separator/minus/fraction-bar
rule was added, no source54 image was opened, and no counter/finalize54 ran here.
Its source-author report, audit and actual receipt/stream hashes are bound in
`scope-verification.json`. This is an unhandled local technical gap, not a
scientific/source HOLD. Summary closure at p0053#5 and the chapter-two boundary
on54 are parent-owned source facts, not changed by this result.

## Scope and Image Usage

`scope-verification.json` proves current layout differs from entry by the
nonempty-core guard only. All bytes outside line_bands, the existing portable
rounding test, and shared/n7 tests match entry. Retained45/48 failures and all
bound53 source/receipt/stream/render inputs have no hash drift.
`layout-current.diff` is the applied delta; `candidate-02.diff` is unaccepted.

Exactly 6 images were opened, once each, in this context/batch (6/8; 6/24):

1. `.tmp/ld-s10y-lesson/8p/pages/0045/page.png`
2. `.tmp/ld-s10y-lesson/8p/pages/0048/page.png`
3. `.tmp/180-7-n8-counter-next/p0045-fraction.png`
4. `.tmp/180-7-n8-counter-next/p0045-fragment.png`
5. `.tmp/180-7-n8-counter-next/p0048-narrow-margin.png`
6. `.tmp/ld-s10y-lesson/8p/pages/0053/page.png`

No reopens, other source images, screenshots, paid/model requests or browser use.
No source/page/audit/crop/index/lesson writes, page-specific production masks,
normalization, finalize, Git, DB, app/schema, installs/updates, chat, timers or
inter-chat messages. Scratch crops and generated evidence are only under the
authorized `.tmp/180-7-n8-counter-next/`. Installer/user/parent work was preserved.
