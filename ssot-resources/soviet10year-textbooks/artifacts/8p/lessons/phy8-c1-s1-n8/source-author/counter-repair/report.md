# STEMROBIN-180/180-7 n8 counter technical repair, including affected p47

Workdir for every command:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
Counter verification only. No source/content PASS, finalize, publication or
lesson completion is inferred. Parent owns affected finalize and source review,
including initial p45/p46. Source43's existing 26/26 result was not rerun.

## Exact scope

- Modified only `.claude/skills/ld-s10y-lesson/tools/layout.py::line_bands`,
  specifically the existing first marginal-blot classifier: 51 added / 15
  removed lines. All code outside the function is byte-identical to entry.
- Added the 201-line portable
  `.claude/skills/ld-s10y-lesson/tools/test_line_bands_margin_rounding.py`.
  It renders only p44/p47 from the existing original PDF and reads durable
  page artifacts. It has no `.tmp` fixture dependency.
- All diagnostics, snapshots, logs, diffs and this report are confined to
  `.tmp/180-7-n8-counter/`. Originals were referenced, not copied into a
  second source/intake package.
- The committed n7 fragment classifier and every following line of owner code,
  n7 portable test, and all existing shared tests remain byte-identical.
- No source page/md/audit/crop/index/lesson, installer/user/parent files, Git
  state, DB, `.env`, installs/updates, models, app/schema, publish, branch,
  worktree, chat, timer or message writes. No finalize invocation.

## Actual cause and repair

P44 source and its right-margin crop independently show 15 printed rows:
caption, continuation, 5 prose/formula rows, 7 prose/formula rows, footer.
The two disconnected extra margin bands are blemishes, not omitted text.

The compact-width lower bound is floored; glyph-height and shallow-core width
upper bounds are ceiled. The existing solid-core test is reused, not replaced:
at least 70% of original ink must survive opening, and the surviving core must
have no hole. This permits shallow smears with incidental holes, or a compact
blot at most two pixels above the height limit whose solid core fits the limit.
It does not exempt ordinary hollow glyphs or arbitrary taller components.

P44's 257-pixel blot has 31 disconnected satellite pixels. The isolation
exception requires the entire clearance-height projection to contain ink only
on that same outer margin. Every neighboring closed component must be at most
0.5 glyph height and 0.2 glyph width; total satellite area is capped at 15% of
the candidate area. Only the candidate blot is removed; satellites stay.
Interior ink, full-height neighbors and excessive satellite area veto it.
No global trim, y-specific production rule or content mask was added.

P47's first candidate still counted 18. Its isolated 56x30 blot has 906 ink
pixels, a 16-pixel (4x4) incidental hole, and an 8x8-opened hole-free core of
647 pixels (71.41%). The shallow solid-core path now handles it. One deletion
control changed glyph height from 44 to 43: width 56 missed 1.3*43=55.9.
Ceiling that existing upper bound fixed the actual remaining cause.

## Preserved failures and test design

The first candidate and its original tests/output remain unchanged in
`candidate-01/`: p44 counted 15, but 17 failing assertions remained.
The trace in `candidate-01-diagnosis.json` showed a changed post-cleanup row
median, no removed body or fraction pixels, and three row deletions that left
one marginal blot because the glyph estimate became 25..25.25.
The bounded solid-core height path fixed those actual count failures.

Initial tests also imposed exact counter-band endpoints and inserted extra
footer/fraction rows, which changed the page's global size estimate even on
baseline. Final tests use independently retained source-row anchors with a
one-to-one band mapping, and move real glyph/footer/fraction pixels horizontally
within their original rows. The original stricter failures remain available.
No expected row count, actual-row deletion requirement or authored-omission
failure was weakened. Final pixel trace removes zero body/fraction pixels.

## Actual results

Failure counts below include unittest subtest failures, not distinct methods.

| Evidence directory | Focused methods / failures | p44 | p47 | Shared methods / failures / skips |
| --- | --- | --- | --- | --- |
| `baseline-00` | 9 / 26, initial fixture | 17 | not yet included | 47 / 4 / 2 |
| `baseline-focused-03` | 13 / 44, final fixture | 17 | 18 | reused unchanged baseline-00 |
| `candidate-01` | 9 / 17, initial fixture | 15 | not yet included | 47 / 4 / 2 |
| `candidate-01-focused-02` | 12 / 21, p47 added | 15 | 18 | reused unchanged candidate-01 |
| `candidate-02` | 12 / 1, p47 width-rounding negative | 15 | 17 | 47 / 4 / 2 |
| `candidate-03` | 13 / 0 | 15 | 17 | 47 / 4 / 2 |

Final focused tests prove all 15 p44 and 17 p47 row anchors survive, every one
of the 32 actual pixel-row deletions lowers count to 14/16, and each of p44's
15 authored-row omissions still fails reconciliation. Removing either/both p44
specks leaves 15; removing p47's blot leaves 17. Genuine edge glyph, footer and
fraction controls, mirrored blots and neighbor/satellite vetoes pass.

Shared checks were only existing n7 portable line-band tests, margin-core,
fraction, short-continuation, expanded layout and hollow-margin tests.
All four baseline/candidate failures are unchanged `1`/`7` numeral subtests at
left=21/1549. Both skips require the unavailable original107 fixture. No new
shared failure/error; not a whole-suite-green claim. Combined runner exit is 1.
Unchanged n7 p29/p31/p158 diagnostic evidence was reused, not rerun.

Commands: skill Python with `-B`, executing this scratch `run_checks.py` for the
listed labels (baseline-focused and candidate-01-focused used `--reuse-layout`
and `--focused-only`). Intermediate `baseline-focused-02` is also retained.
`diagnose_candidate.py` exited 0; `verify_scope.py` exited 0.
No full-book tests, source normalization or finalize pipeline was run.

## Evidence and images

Exact deltas: `candidate.diff`, `portable-test.diff`.
Final result/logs: `candidate-03/results.json`, `focused.txt`, `shared.txt`.
Scope/input bindings and final read-only pixel trace: `scope-verification.json`.
Entry layout: `baseline-00/layout.py`; failed candidates:
`candidate-01/layout.py`, `candidate-02/layout.py`.
Final layout SHA256:
`dc04dfd7bf234e6e21e51166f31d78ef83e8c9f63b8cfaaa9dd1893361fd51cc`.
Portable test SHA256:
`699f20844154fa9d5fb8ed92c9d19a04b40abf4178896e45e99a9ca9f5387610`.

Existing first failures remain at
`.tmp/180-7-n8-source-author/first-failure-p0044/` and
`ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0047/finalize-first-failure/`.
Author reports, actual streams, source PNGs, page artifacts and retained crops
all match their before/after hashes in verification. Parent has not been asked
to recreate any intake package or approve content from counter results.

Exactly 3 images opened in this fresh batch (3/8), no reopens:

1. `.tmp/ld-s10y-lesson/8p/pages/0044/page.png`
2. `.tmp/180-7-n8-source-author/p0044-right-margin.png`
3. `ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0047/finalize-first-failure/margin-extra-band.png`

P47's crop independently confirms a scanner blot; its full source/author images
were not opened. No p41/p43/p45/p46 image, browser screenshot or paid/model call.
