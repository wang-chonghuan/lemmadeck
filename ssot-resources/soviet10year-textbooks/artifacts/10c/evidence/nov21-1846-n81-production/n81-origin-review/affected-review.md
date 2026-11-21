# n81 figures 12-16: fresh independent affected review

Date: 2026-11-21. Ticket STEMROBIN-184/184-6, finish=review.
ROOT: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck
Status: OPEN for bounded intake and actual closure.
This is textual reviewer scratch, not review@1, promotion, publication, a
producer rerun, or whole-lesson acceptance.

## Findings first

**Figure 13: FAIL, current whole-candidate display.** The editorial name O
is mathematically appropriate and honestly attributed, but its present
placement is not sufficiently clean for a child reading the graph alone.
In the native640, desktop surface, and visible mobile starting segment, the
rising dashed stroke crowds the right/lower side of O into a tailed/slashed
appearance. The solid rising branch also cuts through the pi/3 text area.
These are display defects, not wrong functions or unresolved coordinates.
The current render report's empty collisions list does not override the
actual views. The historical figure-13 failed render and absence of prior
whole-candidate visual acceptance are preserved, not retrospectively passed.

Independent actual-SVG evidence, at its fixed 640-pixel media width:

- Axes meet at screen (261.7004048583,185.1428571429). The source-space
  editorial anchor is exactly (0,0), not the old displaced label coordinate.
- O is 18px, end-anchored at (257.7004048583,207.1428571429), with SW
  placement and offset [6,12]. Thus the anchor is correct, but clearance is
  not: a painted dashed portion is at (254.8054132447,209) and
  (254.2151465830,211), in the observed right/lower glyph neighborhood.
- The dashed path has non-scaling 1.5px stroke and dasharray 7.5,7.5.
  The midline intersection at y=207.1428571429 happens to be in a dash gap;
  I do NOT claim every point of that continuous mathematical path is painted.
  The neighboring painted portions, and their observed glyph interference,
  are the finding. No new raster or font/glyph pixel measurement was made.
- pi/3 is 18px, middle-anchored at
  (292.5467514941,209.8285714286). The actual solid 2.6px stroke passes
  through that text-height band at (285.4075812038,209.8285714286).
  The value remains inferable, but inference is not clean typography.
  This unchanged label-to-curve problem had no accepted visual component
  for figure 13 to reuse.

## Per-figure verdicts

| Figure | Current affected verdict | Substantive findings |
| --- | --- | --- |
| 12 | PASS | Reuse the accepted solid sin(x+pi/4) left shift, dashed sin x, equal amplitude/period, 3 crests/2 troughs per curve, 5/6 roots, full end portions, two correct formula leaders, -pi/4 and +/-1 scale. New O is visibly clear SE of the true origin and separate from -pi/4. |
| 13 | FAIL | Fresh source-first comparison and actual-path analysis PASS for mathematics, source topology, formula association, quantities and provenance; current O/curve and pi/3/curve readability FAIL as above. No whole-candidate acceptance. |
| 14 | PASS | Reuse accepted common zeros/extremum abscissas, 3 humps/2 troughs, solid 4cos x versus dashed cos x, only +/-4 y numerals and no x numerals/leaders. The fourfold ratio remains explicitly approved-text-derived regularization, NOT a recovered scan measurement or source erratum. New O is clear SW of the true origin. |
| 15 | PASS | Reuse accepted solid (2/3)cos x inside dashed cos x, shared phase/zeros, central hump and both outer troughs/finite portions, positive left and negative right ends, y1/-1/-2/3, and no added +2/3 or x tick/leader. New O is clear SW of the true origin, away from the negative y values. |
| 16 | PASS | Reuse accepted broad solid cos(x/2) versus dashed cos x, shared central crest, solid zeros at -pi/pi, both outer negative trough portions, dashed intervening troughs/outer crests, and solid negative versus dashed positive at 2pi. No added y numerals/leader. New O is clear SW of the true origin and separate from the three x values. |

PASS here is a bounded substantive affected-review verdict using qualified
unchanged components plus the newly inspected origin/display change. It is
not a claim that the old whole figures were approved, that new product/print
surfaces for 12/14/15/16 were inspected, or that a promotable review record
exists. No original images for those four figures were reopened.

## Editorial origin and source uncertainty

Every candidate declares origin-editorial at (0,0), removes it from
shared-frame's printed-source object list, and maps it only in the separately
declared modern-origin-naming group. The edition's Ox/Oy convention supports
the conventional name O for the known Cartesian origin. It is not a new
unknown-coordinate task, numeral tick, solved exercise annotation, or
recovered source glyph. All visible question marks have been removed.

The original O/0 codepoint remains UNKNOWN for all five. Naming O does not
resolve it. Exact unlabelled crop boundaries also remain unrecovered:
the candidates explicitly describe their finite numerical windows as modern
sampling choices, not source domain facts. Figure 14's scan ratio limit
likewise remains intact. These are honest source limits, not waived facts.

## Independence and reuse

The original fig-13 PNG was viewed exactly once with the complete approved
n81 lesson/exercises before any candidate or prior report. Its independently
frozen inventory and expectations are in source13-freeze.md. Only after that
file was written did Stage 2 begin.

The two permitted durable reports were read after the freeze. Their hashes
remain 829570cea329a92d006e22f55916224fec2f41d98b66e20a3cbd554379c707cd
(independent review) and
d4500c83fd61800dcdc696af409578ca77103a34639aa04ff24c872a93853f13
(prior source-first freeze). Their qualified acceptance for 12/14/15/16 is
reused; their unexplained-question-mark HOLDs and figure-13 historical render
FAIL remain historical findings on the old candidates. The old figure-12
collision is not erased either. No author solution/inventory was opened.

Single-read current/prior evidence was cached. Structural comparison finds
only origin naming/anchor/placement, its separate provenance group, related
descriptions, and the retained inventory-path reference changed. All other
objects, d strings, assertions, canvas, layout, display and authoritativeText
are identical. The canonical unchanged-component JSON byte hashes match:

| Figure | Prior = current unchanged-component SHA256 |
| --- | --- |
| 12 | 95a00c022ad97d0ed9b020e1571899179ae902136eb83cc6d19c4ac77bf6ac6b |
| 13 | 7931326db0531af048cf9ce5f86039da2c60bc21a90531d306f28fc53dc88318 |
| 14 | bc6672cbdc6b8ff116c8a07169cac8bac27fc8a84bfd4572ea1acafb010bd14b |
| 15 | 6e640d98bdd429e538c4487893281dcd05c0e69c9505364e2f300f887dfc0cc1 |
| 16 | b73ef58362639118d4a3c772e997ad827b01037572ff1bcc01ffa2870adab175 |

This is equality of the defined serialized unaffected components, not
equality of entire changed specs or a new source-fidelity proof. All actual
SVG curve d strings equal their specs. Each context's ordered title and
nearbyText exactly equals authoritativeText; no context owns exercises.
Current approved lesson/exercise hashes equal the prior accepted bindings.

## Fresh figure-13 mathematics

Parsed the actual SVG XML independently with stdlib ElementTree, using cached
SVG text on stdin at exact ROOT. Parsed its actual M/L path coordinates,
not just assertions on independent coordinate literals. No image decoding,
rendering, browser execution, or producer calculation was used.

Each path has 3201 monotone-x samples. Invert the raw layer using
x=pathX+xMin and y=yMax-pathY. The actual layer scales are
(29.4560912605,102.8571428571), exactly the canvas scales.
Against independently expected sin(x-pi/3) and sin x, maximum point residuals
are 9.539e-10 and 9.545e-10; midpoint interpolation errors are below 3.259e-6.
The solid path has 5 zeros, 3 crests, 2 troughs; dashed has 6,3,2.
Both retain amplitude 1 and period 2pi. The solid is right-shifted by pi/3,
not vertically displaced. Dashed crosses the origin; solid is negative there
and crosses at the labelled positive pi/3. Both leaders attach to their
respective correct curves with zero formula residual.

Solid starts below and ends above; dashed starts and ends below and extends
farther on both sides. These signs and complete visible lobe portions agree
with the independently frozen original. Numerical endpoints in the computed
audit are candidate sampling endpoints only, not recovered source values.
One shared frame, printed +/-1 scale and pi/3, two formulas/leaders, and
absence of grid/dots/extra panels are preserved. No answer to tasks 60-68,
new mathematical datum, cultural ornament, Cyrillic label or scan texture
was introduced. All actual SVG labels are ASCII and 18px at fixed640.
Adequate nominal font size does not clear the display failures.

## Actual executions and headed surfaces

The five current render receipts bind exact ROOT, node, render_spec.mjs,
their current --spec/--svg/--report paths, exit0, no signal/launch error and
matching stdout/stderr. The reports say pass with no collisions and
18px minimum; these mechanical results are preserved as results, not semantic
approval. Current spec/SVG hashes match reports and candidate/change manifests.
All five source byte hashes, prior spec/context hashes and seven capture byte
hashes match their bound evidence; no missing/mismatched binding was found.

Actual UTC execution intervals on 2026-11-21:

| Receipt under n81-n82-stages | Start -> end | Exit |
| --- | --- | --- |
| fig12-origin-render | 14:13:04.092 -> 14:13:05.401 | 0 |
| fig13-origin-render | 14:13:04.095 -> 14:13:05.402 | 0 |
| fig14-origin-render | 14:13:04.139 -> 14:13:05.401 | 0 |
| fig15-origin-render | 14:13:11.631 -> 14:13:12.479 | 0 |
| fig16-origin-render | 14:13:11.705 -> 14:13:12.499 | 0 |
| partial-draft-offline-render | 14:15:11.167 -> 14:15:11.227 | 0 |
| partial-draft-display-capture | 14:15:14.618 -> 14:15:16.546 | 0 |
| fig13-native-wheel | 14:15:53.817 -> 14:15:54.693 | 0 |

The owner-rendered partial-draft HTML embeds all five exact current SVG
strings. Its SHA256 is
65b1d64ca1e79323b11f5489117f026ea99d63c0335494d85c26ae08af0212ee.
Display evidence SHA256 is
75bc742708221a9c13ac2383011f7d382fd2bab242c272ec77befe761fea9ebf;
native-wheel evidence is
1e6f6f1826048c13ca59cf21963f912eb379edcfd7c3207e910921d646a21ed5.
Both match the actual capture/wheel execution stdout bindings.

Desktop viewport 1440x960 reports container685/media640, 18px text and no
page overflow. Its surface view shows the complete graph and caption.
Mobile viewport390x844 reports container343/media640 and 18px text, no page
overflow, internal horizontal scrolling. Its actual surface view shows the
starting segment including O/pi/3 and caption, not unseen terminal content.
The separate native wheel receipt records before0 -> after297, expected297,
and zero screenshots. This proves mechanical horizontal reachability only;
no mobile end-content visual observation is claimed.

Figures 17-20 remain missing in this PARTIAL DRAFT. Neither successful offline
execution nor these two surface captures accepts the whole lesson.

## Actual image ledger

Every entry was viewed once, in this exact order, with no crop/reopen/new
capture. Paths are under ROOT; R is .tmp/stemrobin-184-six/n81-origin-repair.

| # | Actual view |
| --- | --- |
| 1 | ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-13.png, Stage 1 original |
| 2 | R/fig-12/native640.png, whole current640 |
| 3 | R/fig-13/native640.png, whole current640 |
| 4 | R/fig-14/native640.png, whole current640 |
| 5 | R/fig-15/native640.png, whole current640 |
| 6 | R/fig-16/native640.png, whole current640 |
| 7 | R/fig13-surface-1440.png, actual headed partial-draft surface |
| 8 | R/fig13-surface-390.png, actual headed partial-draft starting segment |

Exactly eight images, no reopens, crops, programmatic pixel decodes or extra
captures. Raw PNG SHA256 hashing did not decode pixels or create new views.
Full input/output/execution/image bindings and computed checks are in
evidence-bindings.json. self-excluded-manifest.json enumerates those inspected
inputs and these scratch outputs, excluding itself to avoid self-reference.
No source, candidate, durable report or other owner's edit was changed.
No network/DB/Git/paid/install/app operation, new agent, or message was sent.
No repair, reviewrecord, promotion, closure or completion delta is claimed.

Remain OPEN. Further intake is text-only and cannot reopen the image budget.
