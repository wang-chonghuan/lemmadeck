# Figures 30 and 33 Independent Review

2026-11-15. Reviewer: Codex in this chat, independent of Aristotle and the
parent repair author. **fig30 BLOCKED; fig33 PASS and recorded.**
Future batch8 only; this finding does not hold delivery of batches1/6/7.

Read `ld-s10y-image` and its quality gate. Reopened both actual original PNGs
and physical p37 PNG before reading current specs/context. Compared actual
SVG objects, current canvas PNGs and existing evidence once. No answers,
choices, rerender, new browser, model, DB, promotion or durable edit.

## Figure 30: BLOCKED

### 1. Exact Incidence Required by Exercise84 Remains Unresolved

Source-first inventory confirms three unconnected groups, 14 named dots:
a = A/C/B in the lower row, D above C; b = A/D above, B intermediate,
M/C below; c = P/Q/R above M/S. Source captions a/b/c are preserved in that
order. No source joining strokes, measurements or exact-incidence text
appear. Current spec has all 14 points/labels and three captions, no edges.
All 11 in-group displacement assertions match their object coordinates;
every source named point participates. These assertions fix layout, not
the exact incidence needed for counting.

Independent dark-ink measurement: gray <96, largest 8-neighbour component
inside independently selected 21x21 source-dot windows. Pixel residuals
are middle-dot distances from the line through the outer-dot centroids.
They are printing observations, not mathematical premises.

| Triple | Original centroid residual | Current 640px layout residual |
|---|---:|---:|
| a A-C-B | 2.714px | 0.02958px |
| b M-B-D | 1.638px | 1.15434px |
| b A-B-C | 4.983px | 7.07068px |

Original centers: a A(25.754,156.646), C(138.925,158.925),
B(255.192,166.775); b M(411.243,182.081), B(503.923,112.231),
D(599.949,43.992), A(424.385,62.321), C(579.514,171.550).
Named ink boxes are about 11-14px wide and 9-14px high. A-C-B and M-B-D
are particularly consistent with an intended straight row at dot precision;
A-B-C is approximately aligned with weaker evidence.

The current s8 definition excludes adjacent collinear segments and says
subsequent "polylines" are simple polylines. Exercise84 counts such objects
using fig30 vertices. Whether A-C-B is exactly collinear therefore determines
whether the path A-C-B qualifies at all. Current coordinates have nonzero
determinants (-4, -197, 950 for the triples above), although the first bend
is visually imperceptible. Neither treating every triple as generic because
its determinant is nonzero nor adding exact collinearity from raster
centroids is independently warranted. The spec's disclaimer of exact
collinearity does not resolve this instructional premise.

Smallest valid next step: source-task authority explicitly settle the
intended incidence contract for these triples, retaining the source
uncertainty. Bind that clarification to the modern task/spec before giving
an unconditional counting answer. Do not move dots to fit guessed counts.
No exercise84 counts or answer artifacts were produced in this review.

The c-group isolated ink at box [731,188,746,199), centroid
(737.709,193.581), has 117 dark pixels and an irregular two-lobed outline
with a notch/uneven upper edge. It has no attached point name. This supports
treating it as unowned ink rather than inventing a sixth c vertex. Pixel
morphology is not proof of its printing origin; the confident inventory is
five **named** c points, not a guessed extra mathematical point.

### 2. Current Canvas PNG Is Still the Rejected Preview

Current SVG/spec/render hashes match and render status is PASS. All 14 SVG
point positions are exactly (spec.x, 340-spec.y); all 17 label texts are
present. Current label anchors are C(107,204), B(175,208), D(108,96),
a)(105,256). Their associations are local and unambiguous; b B and M no
longer use the old neighbour-facing fallback. All non-label object fields,
source, assertions, canvas and display equal the retained rejected-002 spec.
Minimum text at actual fixed 640px media is 24px, not source-canvas-only.

However, actual `fig-30.canvas.png` hashes identically to both rejected-003
and rejected-004 canvases. Its measured label ink bands retain the old
positions (half-open y ranges):

| Label | Current canvas ink y | Required by current SVG's label-only translation |
|---|---|---|
| C | [178,197) | [192,211), +14px |
| B | [182,201) | [196,215), +14px |
| D | [70,89) | [84,103), +14px |
| a) | [228,251) | [244,267), +16px |

Thus even this purported current full canvas is stale, in addition to the
acknowledged old media/viewport files. It cannot certify the repaired
snapshot visually. Smallest evidence remedy: under separate authorization,
refresh the preview from the current SVG without changing mathematical
geometry; preserve historical files. No refresh was performed here.
No fig30 approved review record was written.

## Figure 33: PASS

Physical p37, faithful `page.md` and the modern exercise's retained
`source_text` all literally say `已知圆`, not `已知圆周`. The current s1
definitions distinguish boundary distance=r from closed-disc distance<=r.
Original fig33 has A/B strictly inside, O central, T/M outside, one unfilled
outline and no solution strokes. A connection containing A/B cannot avoid
the closed disc even at its endpoints. Registered erratum
`p0037-boundary-term-83` therefore correctly changes only modern exercise83
to `已知圆周`; faithful text and diagram geometry remain unchanged.

All four spec authority entries exactly match current s8 exercise83 and s1
paragraph/definitions. Original and current point placement/ownership agree:
A upper-left inside, B right inside, T upper-left outside, M upper-right
outside, O center. Independently computed distances against radius135:
O=0, A=69.64194, B=90.13878, T=243.82371, M=210.77239. All mapped
displacements and five actual SVG marker coordinates agree. Five English
labels and one circular outline are visible; no extra marker, filled
obstacle, length, boundary point, edge or answer annotation.

Objects/assertions/canvas/display are deep-equal to metadata-before-001;
SVG/canvas/media PNG bytes are identical to that pre-context snapshot.
Current spec/SVG hashes match the metadata-only rebound render report.
Reused 640px media evidence has 26px labels; existing 390px/1440px fixture
evidence reports media640, containers306/628 and reachable scroll334/12.
These are existing offline display observations, not newly executed browser
or headed-app acceptance. No old fig30 display evidence supports this pass.

`record_review.py --render` ran once for fig33, exit0, writing `status: pass`
at `2026-11-15T16:22:29.153056+00:00`. Its built-in current-hash/validation
guard is not a second substantive review. Record read once; bindings match.
No process remains active.

## Exact Snapshot Hashes

Figure-local names refer to
`.intentfold/tickets/STEMROBIN-184/tmp/s8-fig29-33/fig-NN/`.

| Artifact | SHA-256 |
|---|---|
| Original fig30 PNG | `83ac9deaf6b0ac97fb6114e8c27d0ba55333e313ce082f333801f0129eb4d820` |
| fig30 spec | `bc131079fe35e95be75d37537d58e3c6883b05637df5c55136408a3d72e968ce` |
| fig30 SVG | `000785895119ae84dbb06255f834425cc22c9cac2596e39369031e07a08b2130` |
| fig30 render | `c8ac5cdeec6cff1d5ed7d7707cfae5ed810ef0f5092dda1411b047a23e89f027` |
| fig30 canvas PNG (STALE) | `2e05573b0c1366113ea6bcce5cca20695bd8c13d0289825d2a99246587be02a7` |
| Original fig33 PNG | `07e6a27cbc92db1b214726e59f76924776a38874d860b04d440bf907382a675a` |
| fig33 spec | `2763cd35e79a5ec113789eea6eb26c3073b1ccdb2792d83aec4d76e7d482f416` |
| fig33 SVG | `17b69b30c18849489155564edfda44900a45543ddfd00d48981409c5c3e8a5e9` |
| fig33 render | `8402008d018b8adeac8930acf460638b5134b9b393c266ac576d6b2b33c8ed13` |
| fig33 canvas PNG | `f65761a04806de0d2c1611ed145f059f7aa57266d5c1f09d835d4f4071dec36e` |
| fig33 media640 PNG | `3a3eb74ffbc3bdd4813c384301b139674a61282bbbb41e20ec51e14b6bd1844c` |
| fig33 review | `47ce91cf0a48ab553f05b6c450a24e504c6b72a3cef0a9b755e7dd3e42e29fc1` |
| Physical p37 PNG | `f5e2f8d157c74a2803d8b57f7a6033d28718f0634643be1aa9120a49db17d987` |
| Faithful p37 page.md | `99e5defa6e051c26b6e717a76af543859f3b79145c6f15c9ffbd9e3fd361194c` |
| Faithful p37 page.json / erratum source | `35c7c5032e17614dd129834020a920a6c37b1aadbb27d0e1701e47b77f328fc6` |
| Current s8 lesson template | `c6644e2f8d81f9dc9173621d5c7a8476a7cd470aff520f26baf2df11e9ea06de` |
| Current s8 exercises template | `08fef28289e18cdc4194b2b3d4b83fb93f504194227f6c3dd8f8245499d181ec` |
| Current s1 lesson template | `e3992918cd8c5eba0728ac31b7dfb77d7d73d432c3942e929e673e00f105730e` |

Original PNGs are under
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/`;
faithful p37 is under the same book's `pages/0037/`; source page PNG is
`.tmp/ld-s10y-lesson/6-8g/pages/0037/page.png`; current templates are under
`.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c1-sN/`.
Only this report and the authorized fig33 scratch review were written.
