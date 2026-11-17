# B51 First Independent FIG Review: fig-32

Verdict: **PASS**, limited to this hash-bound figure candidate. No essential
source-reading, mathematical, visual, cultural, or answer-leakage defect
observed. This is not a TEXT approval, promotion, lesson finalization, or
publication. Ticket identity from the author manifest: STEMROBIN-180;
lesson: 6p/phy6-c3-s5. Review date: 2026-11-17.

## Independent Pixel Inventory Frozen Before Spec

Both canonical originals were opened once FIRST, before reading either candidate
spec, the author's inventory, or any modern PNG. The reviewer's inventory was
frozen in the chat at that point; this section transcribes that independent
observation, not the author's object list.

- One shared distance-time frame, no subpanels. Lower-left origin labelled 0;
  horizontal positive time axis and vertical positive distance axis, each with
  an arrowhead beyond its last labelled tick.
- Source units: hours horizontally, kilometers vertically, with t and s.
  Exactly six horizontal ticks: [2, 4, 6, 8, 10, 12]; exactly five vertical
  ticks: [100, 200, 300, 400, 500]. Intervals are equal within each axis.
- One solid, nearly straight handdrawn trajectory begins at the common origin
  and ends approximately at (12 h, 500 km). It does not continue to the arrow.
  This is an approximate plotted endpoint, NOT a printed exact coordinate pair.
- No projection, queried-point marker, speed caption, formula, endpoint
  caption, grid, extra trajectory, or answer guide. Isolated scan specks are
  not instructional objects.
- Modern-only choices: regularized vector strokes, English unit headings,
  readable typography, whitespace, and subpixel construction anchors.

Inventory mapping after the freeze: `shared-distance-time-frame`,
`time-scale-six-ticks`, `distance-scale-five-ticks`, and
`single-solid-uniform-trajectory` cover these observations. Their referenced
axis, tick, endpoint, connects, displacement, and perpendicular IDs resolve in
the read spec and preserved author validation evidence; object counts alone
were not treated as source-fidelity proof.

## Full Text Binding

Read the complete approved modern lesson and exercises templates, including
their source data, plus the complete canonical raw lesson and exercises.
Both candidates contain the same 18 actual authoritative strings: ten prose
blocks followed by all eight exercise texts, not merely file paths or hashes.
Read-only JSON comparison confirmed exact ordered equality of every string AND
its lesson/exercise identity against those templates, including line breaks,
math escapes, and punctuation. The extra provenance preamble is not counted
among the 18 strings. Embedded raw source data and source hashes also match
the canonical raw files.

The identities checked are the ten prose sources
`p0053#3`, `p0053#4`, `p0053#5`, `p0053#6`, `p0053#7`, `p0053#8`,
`p0053#9`, `p0053#10,p0054#1`, `p0054#2`, `p0054#3`, and the eight tasks
`g1:1#p0054#5`, `g1:2#p0054#6`, `g2:g2-1#p0054#8`,
`g2:g2-2#p0054#9`, `g2:3#p0054#10`, `g2:4#p0054#11`,
`g2:5#p0054#14`, `g2:6#p0055#5`.

The actual bound fig-32 task retains the $os$ distance axis, $ot$ time axis,
and the 10-hour read-from-graph request. The original handdrawn line supports
an approximate reading in that neighborhood; this review does NOT infer a
printed exact 10-hour value or create a numerical answer. The vector endpoint
(12, 500) is a reasonable regularization of the observed endpoint. The spec's
`trajectory-given-endpoint` name and exact-coordinate inventory wording do not
establish that the raster printed an exact pair. No such caption is displayed;
no material source-reading discrepancy is observed.

| Complete text input, absolute path | Actual SHA-256 |
| --- | --- |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-distancetime-b51/lessons/phy6-c3-s5/lesson.template.json | bc828629d4e55f090d923af8dddaeeaf94585cb7f14f78e0eda2a5778bdd1cae |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-distancetime-b51/lessons/phy6-c3-s5/exercises.template.json | b3c2cd60f882a6df86567d37e96a78fc1f72dca3b3286a4cca6c42974a3b61c6 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s5/lesson.json | fbfe15649b33ce82c2c0327730e24dd20fa86c78ca0cd83e301771d4c6c53f8f |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s5/exercises.json | 7f10b147ad619680bd9ff439e2034e51b73f4bcc7bd3c97c322c9c9b5a1d24f0 |

## Native Visual Comparison

Opened the exact manifest-named full native PNGs at 306 and 640 once each,
with original-detail viewing, no crops or reopens. Both preserve the complete
tick arrays, correct s (km)/t (h) units, single zero, arrowheads, common origin,
solid trajectory, and its stopping point. Labels remain aligned to their
ticks and distinct from strokes. No black rendering, clipping, collisions,
missing data, added answer guides, or source-cultural text is visible.

Reused native evidence reports actual transformed minimum text 16.25625 px
at media width 306 and 34 px at 640, all 14 labels measured, no overflow,
no errors, status PASS. Reused repair render confirms no collisions and
both display checks PASS. No browser, renderer, native capture, standalone
validation, TEXT gate, or separate math gate was rerun.

## Repair Evidence Reused

Author manifest records one standalone validation PASS, first render FAIL
(exit 2, 12 collision entries), and the sole affected repair render PASS.
Read-only structural comparison with the preserved failed spec confirms only
`labelPlacement.offset` components on 12 objects changed: origin and all
11 tick labels. Coordinates, curve endpoint, tick arrays, units, assertions,
font sizes, strokes, gap threshold, and authoritative text are unchanged.
Repair budget is exhausted: used 1/1, remaining 0. No exhausted-repair waiver
was applied, and no candidate repair was made.

All identities below were independently SHA-256 checked against the manifest.
Preview/native identities additionally agree with the native evidence.

| Evidence, absolute path | Actual SHA-256 |
| --- | --- |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-32.png | 3e785f6fcf9d45b17a4574c5714073fd918521190f3dc64d33c1c0c655bb0a26 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-32/fig-32.spec.json | 2ae327c4a256fe37d206303a57d7828c10f50f5dc18194fc7875147b5fa7d0ad |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-32/fig-32.svg | 85ca6483cc6291fb055f7ec4e9b632b8802397e0581faf5a015bbe4b15d4043b |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-32/repair-01-render.json | 756d460d9d42407fbdc6915b6886580472acf95c0a9727945e03e00e820297cd |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-32/native-preview.json | 7e3e4b64809ebdb4a8fe9d945b1eacf822953be821765c1d24fc14ed48f799a0 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-32/native-306.png | b051f42d5fb4f23143c2f95f88cf4e8af74464a5c7d9b0380ed4fb485a1242c3 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-32/native-640.png | f805210c09cbb5748d3a813a1d4987236718f447a8465a327682113984d611cd |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-32/output-manifest.json | 53b07e5700bd5f3426a8a3bf7b3692413896fcd2366f236a8c956e3ebf654738 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-32/source-inventory.md | c9980dd8f285123ce4ce14d9f4c6b67193b7e6e497c492c5b1bebff716ac1cbf |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-32/first-validate.json | 5e040e2712234dd03ad57291aa99dfa4c8e77cfaf1f5e24d8031d372c6cd3ceb |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-32/first-failure/fig-32.spec.json | b579ce15703cdb0d770efacc217a6daa3c2f75f083711708a2965a4ba2bef92e |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-32/first-failure/fig-32.svg | 06da6785c5410442e747109234f136f04f4c8d47993e493f04bc9351e8698293 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-32/first-failure/first-render.json | 95f7fd9b0a5e05ef245ebb11385131f4cfde4fb812c42e7a2688682c154541f9 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-32/first-failure/failure.md | d12b044f6bdb7715e7c125b9d585be9ec4b6a3aee2c94a9f9aceb1ecd515fd4a |

## Scope And Recording

Record `review.json` once using the existing `record_review.py`, the exact
current spec and repair render, status pass, and this report's path/hash in
notes. Its mandatory embedded rendered-spec/provenance checks are not an extra
standalone author-validation run.

Image ledger for this review task: fig-32 original 1 + native 2 = 3;
fig-33 original 1 + native 2 = 3; total 6, maximum batch 6 <= 8,
context 6 <= 24, crops 0, reopens 0, parent image loads 0. No speedtable image
was opened. Only the two independent reports and two requested review files
are written; other workers' candidate/evidence files remain unchanged.
No answers, keys, choice artifacts, service, DB, Git, app, or dependencies
were accessed for modification. No promotion or finalization is authorized.
