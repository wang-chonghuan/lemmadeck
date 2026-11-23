# N58 independent modern figure review

Ticket: STEMROBIN-187. Date: 2026-11-23.

## Scope and image ledger

Independent figure-only review. Owns this new Markdown evidence file only.
No source solutions, answer keys, choices, database, environment files,
dependencies, model services, commits, pushes, other chats or agents.
No producer rerun, content repair, independent review JSON or promotion is authorized.
The parent has permanently consumed 24/24 images; handoff is text only.

This fresh context plans exactly four image opens in one batch (limit 8,
context limit 24), with no crops, reopens or failed candidate PNG:

1. Original `ssot-resources/soviet10year-textbooks/artifacts/4m/figures/fig-222.png`,
   opened once, first.
2. Original `ssot-resources/soviet10year-textbooks/artifacts/4m/figures/tbl-p0216-01.png`,
   opened once, second.
3. Final `.tmp/stemrobin-187/n58/figures/fig-222.repair1.normal640.png`,
   opened once, third, after reading current templates 967/974.
4. Final `.tmp/stemrobin-187/n58/figures/tbl-p0216-01.normal640.png`,
   opened once, fourth.

Images actually opened at this inventory checkpoint: 2/8 batch, 2/24 context.
No candidate image, exercise template or author inventory has yet been read.
Final actual image count: exactly 4/8 batch and 4/24 context. No image-bearing
handoff, full-resolution duplicate, crop, reopen, screenshot or failed PNG
open occurred. The candidate PNG native dimensions equal their 640-pixel
normal display dimensions. Numerical pixel reads below emit no images and
do not add visual context loads.

## Original pixel inventory, recorded before text and author evidence

### fig-222

One unframed monochrome angle diagram on a plain white background. A single
common vertex lies near the left side, approximately mid-height, labelled A
immediately above/left. Four heavy continuous solid strokes start at this
same vertex. There are no arrowheads, dashed strokes, additional vertices,
endpoint dots, axes, grid, measurement scale or panel subdivisions.

From top to bottom clockwise, the four rays go (1) steeply upper-right to a
label whose printed glyph is visibly Q-shaped, with a lower-right tail;
(2) gently upper-right to M; (3) gently lower-right to K; (4) steeply
lower-right to P. Each endpoint has just its own label, placed near the
end and not at a separate vertex. The visible identities from pixels are
A, Q-shaped upper label, M, K, P. Whether the upper identity should be O
is not a pixel fact and must be resolved from the current exercise text.

Exactly one small, unfilled arc is visible inside the angle between the
third and fourth rays, centred on the common vertex and connecting the
AK-side and AP-side. No arcs mark the other intervals. No equal-angle
ticks, equal-length ticks, right-angle square, numeric degree label,
equality symbol or numerical answer is present. The endpoint lengths are
unequal. The two upper adjacent angular gaps appear broadly similar; the
K-to-P gap is visibly larger. These are not pixel-exact equal constructions.
The K-to-P opening looks roughly
half a right angle; no exact paper calibration can be inferred from this
unscaled crop. Inventory wording correction: the first checkpoint
mistakenly described all three gaps as broadly similar. This wording was
corrected from the retained original observation, without reopening either
original and without changing any producer asset.

No diagram caption, explanatory prose, Cyrillic words, flags, decorative
historical symbols or other instructional objects occur in the crop.
Tiny isolated scan flecks are not mathematical marks.

### tbl-p0216-01

One monochrome rectangular table on white with four columns and four rows
including the boundary headers and upper-left corner: 16 cells total.
The complete outer rectangle is present; three internal vertical and
three internal horizontal dividers form the complete lattice. Source
strokes are slightly uneven, and header/interior cell widths are not
pixel-identical, but there is no missing row, column, border or merged cell.

Coordinates below are one-based (row, column), top to bottom and left to
right. The corner (1,1) is blank. The top header values are (1,2) `0.35`,
(1,3) `0.72`, (1,4) `1.14`. The left header values are (2,1) `5.43`,
(3,1) `0.68`, (4,1) `1.71`. All six use decimal points, no units, signs
or extra digits. All nine cells (rows 2-4, columns 2-4) are blank.

There is no plus sign, zero in the corner, interior result, answer,
arrow, recursion indicator, caption, row/column name, decorative symbol
or additional table. The immediate-above/immediate-left operation is not
encoded in these pixels and must be checked against the exercise prose.

## Frozen Decision

**PASS: fig-222.repair1 and tbl-p0216-01 only.**
Frozen at `2026-11-23T03:29:23Z` against the inputs and outputs below.
This is substantive independent source-fidelity, mathematical, cultural
and normal-640 visual review, not publication approval or an independent
`ld-s10y-image/review@1` JSON. Parent collection, durable retention,
any JSON review recording, edition bindings and integrated lesson/product
acceptance remain outside this assignment. Do not substitute the preserved
bare `fig-222` failure for `fig-222.repair1`.

No REVISE findings remain in these two candidate figures. No further
content repair was made or automatically authorized. A change to any
source, current task text, candidate spec/output/report or display scope
invalidates this frozen review for the affected figure.

## Current Text and Independent Comparison

Only question-facing current exercise entries 967 and 974 were displayed
from the supplied `exercises.template.json`; solutions, answers and choices
were not consulted. Both specs embed exact current copies of both texts,
and the numerical check verified equality with the current template.

967 states that AK bisects OAP and AM bisects OAK, asks the learner to
measure KAP, then calculate OAM. Textual O resolves the Q-shaped source
upper glyph: the modern clean O is explicitly disclosed in the candidate
description and inventory as text-driven regularization, not a claim that
the original pixels print a clean O.

974 explicitly limits filling to the nine interior cells, uses the two
numbers immediately above and immediately left of each cell, and leaves
the upper-left corner blank. This is recursive adjacent-cell propagation,
not nine independent sums of the top and left headers. No interior results
were calculated or read for this review.

### fig-222.repair1

- All five identities A/O/M/K/P are present once and legible. A is clear
  above/left of the shared vertex; O/M/K/P sit near their corresponding
  ray ends. Clockwise order is AO, AM, AK, AP, all originating at A.
- Four solid rays and exactly one unfilled minor KAP arc remain. The arc
  attaches to AP and AK, is centred at A, and has radius 92 in this
  isotropic 640x720 canvas. No additional arc, arrowhead, angle value,
  answer, equality symbol, equal-angle tick or equal-length mark appears.
- Exact modern bisectors follow the task text, not the rough source
  angular spacings. AK is the internal bisector of OAP; AM is the internal
  bisector of OAK. Independent coordinate evaluation gives a maximum
  bisector residual of `1.78e-15` degrees. The exactness belongs to the
  modern text-driven construction, not an exact-paper interpretation.
- K and P retain the author's fitted original stroke directions, with
  candidate KAP `48.964842406725` degrees. Independent fitting used K
  column medians x135..325/y245..310 (191 samples) and P row medians
  y325..430/x70..150 (106 samples), dark threshold 100. It yields about
  `49.042307197` degrees, only `0.077464790` degrees from the candidate.
  This independently supports preservation of an approximately 49-degree
  drawn angle. There is no convenient 50-degree substitution, paper
  calibration, dewarping or exact-original-measurement prerequisite.
  The many digits identify machine results, not precision of the scan.
- The source inventory group `fig222-shared-vertex-rays` covers every
  `fig222-A/O/M/K/P` point, all four segments and `fig222-KAP`. Its required
  `pointRelationships` mapping covers every point through within-group
  `*-connects` assertions plus direction/source-fit displacements.
- All 20 mapped relationships were independently evaluated. Equal-radius
  witnesses, their positive collinear ray placement, perpendicular chords
  and strict internal angle-region containment establish both bisectors
  without marking an answer. The selector's `angleRegion` assertion checks
  the correct minor AP-to-AK sweep and endpoints, not merely arc count.
  Current validator code supports and executes these assertion types;
  preserved official draft validation exited 0 with no errors.
- Witnesses occur only as coordinate literals in assertions, never as
  render objects or labels. Tiny 1-pixel point anchors are disclosed modern
  additions, not additional source identities. No cultural wording or
  historical decoration leaked into the clean output.

### tbl-p0216-01

- Full 4x4 lattice including the header row, header column and corner:
  16 cells, complete outer border, three internal divisions per axis.
  `tbl974-4x4` is an executable `gridDimensions` assertion, not a
  substitute object-count claim. Numerical bounds, step and phase checks
  independently confirm four rows and columns.
- One-based exact cells match the original inventory:
  (1,2) 0.35; (1,3) 0.72; (1,4) 1.14;
  (2,1) 5.43; (3,1) 0.68; (4,1) 1.71.
  IDs `tbl974-r0-c1/c2/c3` and `tbl974-r1/r2/r3-c0` map these six source
  labels. The supplemental numerical check verifies both their text and
  actual cell centres, rather than relying only on six-text object count.
- The corner and all nine interior cells remain blank. Every pixel at
  least five pixels inside each of these ten cells is at least 250
  grayscale. Every horizontal and vertical border/divider is continuous:
  4290 sampled positions across all ten grid lines pass.
- No plus sign, corner zero, units, extra label or result is present.
  Straight evenly spaced lines and centred labels are disclosed
  presentation regularization, with no numerical givens changed.
  The figure is compatible with immediate-above/immediate-left recursion.

### Display and Evidence Binding

Both candidates are instructional scroll figures at declared actual media
width 640, minimum text 16. Their source SVG canvases and inspected native
PNGs are 640x720 and 640x360; there is no shrink transform at this width.
Both official reports PASS with no collisions/failures and measured minimum
text **32 px**. SVG text parsing independently confirms five/six exact
labels at 32 px. Visual review confirms no clipping, collision, missing
label or missing border at normal width.

Numerical checks find 7792 and 11449 dark pixels respectively, with no dark
pixels in the four-pixel outer canvas edge. Both previews are nonblank and
clean; semantic CSS-variable output is retained. No integrated product
scroll-end, theme, mobile viewport or lesson acceptance was repeated or
claimed under this figure-only scope.

Current source-image SHA-256, report-to-spec and report-to-SVG hashes and
current authoritative-text equality all match. PNG hashes bind the
specific visually inspected previews here; the existing render reports
bind candidate SVGs, not durable promoted assets.

## Actual Commands and Preserved Stages

All shell commands used
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187` as workdir.
No producer, official validator, renderer or previously passing stage was
rerun. Existing command records were read as evidence, and bindings were
checked rather than recreated:

- Initial command exits: angle draft validation 0, angle render 2;
  table draft validation 0, table render 0.
- The angle's first failure is a `fig222-A-label` NW overlap with score
  `33.739607682218775`. Its spec/SVG/report/PNG and command results remain.
  The first failed PNG was hash-read only, never decoded or visually opened.
- Repair command exits: angle draft validation 0, angle render 0.
  Exact structured spec comparison confirms the only content change is
  A-label horizontal offset +12 to -12. Geometry, text and assertions
  are unchanged. The repair command set contains no table command.
- Independent read-only check:
  `.claude/skills/ld-s10y-lesson/.venv/bin/python .tmp/stemrobin-187/n58/figure-review/check-numerics.py`
  exited **0**, all numerical checks PASS. It writes no output, generates
  no PNG, emits no image payload, invokes no producer and creates no
  independent review JSON. Only its new numerical-check source is retained
  in the optional authorized scratch directory.
- `shasum -a 256` confirmed the current hashes below. Dirty edits were
  preserved. Writes comprise this new report and the new numerical-check
  script only.

## Frozen Paths and SHA-256

All paths below are relative to the authorized absolute worktree root
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.

| Current input | SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s2-n58/exercises.template.json` | `de5a52d94ed1e5d59c847fffe61d3fad386d1e6ebf54562c7ec9d62addc70da0` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/figures/fig-222.png` | `a2bbe279a2f55e8b0e1066c0bb9db425ae77130e4fcd4994b42e10492920c0cd` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/figures/tbl-p0216-01.png` | `32c1efa4e2f87c8293ccd88bfdb3537b7385c16fea8cca6d516e7cbd63b4c92a` |

Candidate paths below use `.tmp/stemrobin-187/n58/figures/`:

| Current candidate file | SHA-256 |
| --- | --- |
| `fig-222.repair1.spec.json` | `eb6c5b4de5702d49d55b695b4848e69c390c484531359b1269777966879c4950` |
| `fig-222.repair1.svg` | `918f4468d646d845a72c107e4942e6a109851195d73d9b161d84c00b0811fb75` |
| `fig-222.repair1.render.json` | `6c4d40633ff2a5f10d5b7aeab73990c511a01a58d110c9c3d58546c6540a95a5` |
| `fig-222.repair1.normal640.png` | `b1b18cf1536956f764ea83ca00516dc98cbd6e55747b912339c800351bb12652` |
| `tbl-p0216-01.spec.json` | `9ffebbe09093d3b89cf3ddd1c0b90373c8e029ea2744d877b19d62bf192312c5` |
| `tbl-p0216-01.svg` | `b3e8d061c7413bc08aa72ab0f245c853908f33e18cf7be4cbc52c156bbd2070e` |
| `tbl-p0216-01.render.json` | `9f13a9fd15f3a499e9cfbe5599eebb3c62e6ebef4b5b76bf256b1f1db74d0776` |
| `tbl-p0216-01.normal640.png` | `4b62f9bafa0b229d5364f534bfef9665aa9f16d92892eee0e41a188a683e6707` |

Preserved nonfinal files and existing supporting evidence use the same
candidate directory unless a full relative path is shown:

| Evidence | SHA-256 |
| --- | --- |
| `fig-222.spec.json` (failed initial candidate) | `e9246a40da8b99627d72c82eed96061ecb254c7401712e50cbff87a33f730a21` |
| `fig-222.svg` (failed initial candidate) | `fa4adca69e0b18fbd287087ffd3fb4af13e5fc94a6f4be6488a98e224cbbbcca` |
| `fig-222.render.json` (FAIL, not final) | `7e126aa8f30c8587b934b504c8a173b19dc4504dcbb81f7f3d8a093cc9e1f968` |
| `fig-222.normal640.png` (never opened) | `e9a64695aa20ee3b647ed8c42a9c89ba9e6a0f1540a0d964d3e4d54c4aaeac3e` |
| `candidate-command-results.json` | `1de077c3e8180bd8b6442455ca090751b86d927fe69b02b0865a423ee2478e16` |
| `repair1-command-results.json` | `eaf40fc267f452c9337c01424f2c5c52476d3a5572e70daa782e194eb7841692` |
| `source-ray-fit.json` | `a2a12b54ea66a8ee9d2a5a1c77a785b2602de583535382818ae3d2edfa9091cd` |
| `author-candidate-check.json` (author only) | `d98f58e52821b49412c6e4333f0f89559ae1a346a662fa05d7af7e280afb8681` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s2-n58/evidence/figure-author.md` (read only after inventory) | `e721374941afb095d24322b65585a89256cf067edff39621519d9ee994354d4d` |
| `.tmp/stemrobin-187/n58/figure-review/check-numerics.py` (new numerical-only check) | `def98dd27df8acf5c92f914f9c61384b3e3614622705c828f0facbd805fdce19` |

Binding worktree protocol/tool inputs:

| Path | SHA-256 |
| --- | --- |
| `.agents/skills/ld-s10y-image/SKILL.md` | `c0f7f9b7ab9203195a54fd35f812db4313dd242c31e47ef6ece4b38f46197f32` |
| `.agents/skills/ld-s10y-image/references/figure-spec.md` | `b428dba727222552ee18a28f385a2d0affa089110d22f3288a571af78a950959` |
| `.agents/skills/ld-s10y-image/references/quality-gate.md` | `36ec37ff120139309ade57b4aa315b1595490311aa50bb974f7401201ef84b29` |
| `.agents/skills/ld-s10y-image/scripts/validate_spec.py` | `07178e284c492d9a28ebadaf2fc36209e2cc5c06870ef335fd34b7e7ff670f7d` |
| `.agents/skills/ld-s10y-image/scripts/render_spec.mjs` | `cc55cf5875722e25e96e1c52ed2c3fbe75fc6f2d6ca85fc160ae23f0b25e0e9d` |
| `.agents/skills/ld-s10y-image/assets/figure-spec.schema.json` | `c7958c99d5dc6809a9da9cd242887a31948910ce3fed4a37146ed31dd8ea87ed` |
