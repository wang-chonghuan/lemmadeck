# Figure 69 Independent Review

Outcome: **PASS** for the explicitly authorized final modern figure snapshot.
Affected repair unit: none. No genuine first visual or semantic FAIL occurred;
no failure record was overwritten, deleted, or weakened to obtain agreement.

STEMROBIN-180, 2026-11-15. Independent continuation reviewer, not Ramanujan
and not this figure's author.

## Scope And Order

Review began only after main explicitly reported author COMPLETE and supplied
the final spec/SVG/render digests. Current author handoff hashes and final notes
were verified, not adopted as independent approval. The complete original PNG
was reopened. Both full current s21 and s18 lesson/exercise templates were
read, including all seven s21 exercises, both s18 exercises and s18's explicit
reference to fig-69. The image skill, FigureSpec contract and quality gate were
reread. No answer key, choice material or other figure review was used.

The author complete width/theme and mobile-right sheets were inspected. The
exact final SVG was then independently displayed and scrolled in six offline
browser cases. No author rendering command, product, DB or service was run.
Existing source/text PASS and author render PASS are not the basis of approval.

## Independent Source Inventory

These observations come from the complete 719 x 391 original pixels:

| Original observation | Current realization and independent comparison |
| --- | --- |
| Two upright tied sacks, left and right, with gathered tops, neck ties, bulging bodies and flattened lower edges | `left/right-bag-body`, `left/right-bag-top`, and `left/right-bag-tie` preserve both depictions. These are two views of one example, not two given masses. No complete table or legs are source pixels. |
| F arrow begins INSIDE the left sack, passes through its bottom and points DOWN; F is beside the lower arrow | `gravity-F-origin`, `gravity-F-arrow`, `gravity-F-label` preserve the bag recipient and downward direction. |
| P arrow begins at the right sack's BOTTOM CONTACT and points DOWN; P is beside its lower end | `weight-P-origin`, `weight-P-arrow`, `weight-P-label` preserve a support-contact start, not a second bag-interior force. |
| THREE transverse shaft marks on each original arrow, six in total | `gravity-F-tick-1..3` and `weight-P-tick-1..3` retain all six identities. The arrowhead is not counted as a fourth original tick. |
| Short horizontal scale at bottom left, labelled 10 newtons in Chinese | `source-10N-scale` and `source-10N-label` retain the given value as `10 N`. The source bar does not give a centimetre rule or exact original pixel calibration. |
| Both complete sacks, downward heads, F/P, all six shaft marks and scale are visible | All are present in the modern full-width image. No upward reaction arrow, extra panel letter, mass label, grid or numerical force answer was added. |

The six current `source.inventory` groups agree with this independent complete
inventory. Mapped objects and assertions exist. The two scale caps and support
strokes are clarifying modern objects, not additional original table/scale
marks; the separate author inventory and final notes expressly declare this.

## Force Recipients And Exact Current Geometry

The complete s18 text defines gravity as acting on the BODY and weight as the
body's action on SUPPORT or suspension. The s21 example concerns one 5 kg bag
resting on a table. Accordingly, F and P must not be two interior bag forces,
an upward support reaction, or a Newton-third-law opposite-direction pair.

F starts at `[167,458]`, visibly and geometrically inside `left-bag-body`,
and ends at `[167,258]`. Its displacement is `[0,-200]`. The bag's base is
y=326, so F crosses that base before its downward head. The `inside` and
`connects` assertions describe this actual geometry.

P starts at `[472,326]` and ends at `[472,126]`, also `[0,-200]`. Its start is
on BOTH the finite bag-bottom segment x=444..493 and finite support segment
x=388..544 at y=326. This was checked from the actual coordinates, not merely
from an infinite `pointOnLine` assertion. The visible dot is at their contact
and P immediately descends below it. The interior of the right sack has no
second shaft. This preserves the recipient distinction required by s18.

The two short support lines and application dots clarify the stated resting
contact. They are explicitly declared additions, not source table geometry.
The qualitative polygon sacks retain ties and both bodies without inventing
material dimensions, exact mass labels or culturally specific decoration.

## Three Original Ticks, Added Fourth And Scale

The original has three visible transverse marks per arrow. It does not prove
perfectly equal pixel lengths or an exact fivefold ratio to its rough scale bar.
The source inventory's approximate pixel observations are not accepted as
precise measurements.

The new fourth tick on each shaft is individually identified as
`added-gravity-F-tick-4` / `added-weight-P-tick-4`; the description, separate
modern-additions record and author notes distinguish both from the six
original tick identities. All eight current ticks were seen in the complete
modern images, and the four P ticks were seen after mobile scrolling.

The current scale runs from `[62,164]` to `[102,164]`: length 40 user units.
The F tick centers are y=418,378,338,298 between start 458 and tip 258.
The P tick centers are y=286,246,206,166 between start 326 and tip 126.
Therefore every interval is 40, both complete vectors are 200, and their
scale ratio is exactly 5. The equal lengths, interval assertions and added
tick `connects` assertions match this independently checked arithmetic.
The equal source/screen axis scales preserve the current length ratio.

This is modern regularization for the EXISTING worked example, whose current
text gives 9.8 N/kg times 5 kg = 49 N, rounded to approximately 50 N.
Five intervals of the original 10 N unit depict that rounded result. It is
not an exact-49-N construction, an exact measurement of the scanned arrows,
or a claim that the original had four transverse marks.

The 0.5 cm per 1 N illustrative rule elsewhere in s21 is not applied to this
separate 10 N scale. On-screen sizes are not physical centimetres.

## Complete Modern Text And Leakage

All 25 nonempty spec authoritative entries exactly match the ordered current
s21 and s18 titles, prose/captions and nine total exercise texts. The review
used the full upper modern text, not merely the embedded original snapshots.

The modern image is the existing worked-example diagram and s18's teaching
reference, not a newly authored question solution. It visibly contains only
F, P and the source-given 10 N scale. It adds no `F=P=50 N`, 5 kg, 400 N,
60000 N, 3-tonne exercise result, answer marking or internal key. Equal
vectors and five intervals teach the already supplied rounded example;
they do not silently disclose a separate unsolved exercise answer.

The image alone does not certify independent production of drawings or
general force knowledge. The s18 recipient distinction is a teaching fact
the source already illustrates, not an answer-key addition.

## Actual Width, Theme And Mobile Right/Bottom

Each local fixture was checked to contain the exact final SVG bytes.
Independent Playwright used the already installed app package with local
Chrome, without opening the product or starting a server. The final report
records zero external HTTP(S) requests.

| Appearance | Viewport / actual media | Minimum transformed font | Horizontal end |
| --- | --- | --- | --- |
| Neutral, mixed/accent stress, print | 306 / 640 px | 30 px | 334 / 334 |
| Neutral, mixed/accent stress, print | 640 / 640 px | 30 px | 0 / 0 |

Media height is 560 px in every case. The mobile view deliberately retains
640 px media, rather than shrinking it to 306 and making labels too small.
The scroll endpoint was actually set and measured, not inferred from CSS.
At that endpoint, the full right sack, contact dot/support, all four P ticks,
downward head and entire P label are visible. Left F and scale are reachable
at scroll start; neither is expected to remain simultaneously visible at
the right end. Full 640 px viewing verifies both panels together.

All six cases passed exact width, complete label set, minimum font, nonblank
pixels, full geometry/stroke boundaries, no page overflow and end reachability.
Current root-viewBox extrema including stroke allowance are approximately
x=49.81..545.5, y=36.5..493.88 within 640 x 560. The bottom scale, F head,
lower P head/label and far-right support/body content have clear margins.
No empty/broken raster, missing item, label overlap or clipping was seen.

The final independent composite was actually inspected: rows are neutral,
mixed, then print; columns are whole 640 px media, 306 px scroll start, and
306 px scroll end. The author complete and separate right-end sheets were
also inspected. Font evidence uses the actual SVG screen transform, not the
model's resized composite image.

Only F, P and `10 N` are visible lettering. Chinese source units are translated,
and no Cyrillic, Soviet symbol, flag, uniform, book texture or cultural label
was carried over. Semantic CSS-variable roles recolor successfully; neutral
and print preserve the full distinction without relying on color alone.

## Binding

All digests below are SHA-256 of actual file bytes:

| Artifact | SHA-256 |
| --- | --- |
| Original `fig-69.png` | `44b493d9c47e347ac55c6e73ff9491b5a634080e5e883301e7955484aa3d1f08` |
| Final `spec.json` | `431f062b4290219f2b4ad0bd7d73c606ace3e01bce525f0d35eee6326ed65702` |
| Final `fig-69.svg` | `a9c32beeb29aa87c1782b61554aed93b495330b6b9a7d3aeb4dc44a821bfcee9` |
| Final `render.json` | `3394a67270a7cd81465c2280ab7597796e913ece9db433c5915b46d5452e3cb0` |
| s21 `lesson.template.json` | `2c606df09eece61650ad678c11d340a4d2cc55cc16bf610b8215a9e5a0b1e953` |
| s21 `exercises.template.json` | `3eda9387f883b2d3a6c18d09edac1ea326bf10b622aa67aefbe874002869f89d` |
| s18 `lesson.template.json` | `10e86dd05f3e829a2b225bf2e79e5dc1261c94009de0a779355618fb4523c956` |
| s18 `exercises.template.json` | `ac8fb24421155a7a45e6645edcfba7359a3a4e3b2b20a04d81a576d2c4c53b7a` |
| `independent-preview/media-checks.json` | `59d73be0dc136c06684089a9a579343f7c6d991a6c22373714caa247316fc673` |
| `independent-preview/independent-width-theme-sheet.png` | `904a7617098111467435ed2f589b5d319634eb5f8ff73fe61d58792493ecd5a3` |

The final render metadata binds the actual spec and SVG and reports zero
collisions. `record_review.py --spec spec.json --render render.json` records
the separate `ld-s10y-image/review@1` source/spec/render/output binding and PASS,
with this report's digest in its notes. There is no artwork/generation layer.

## Limits And Handoff

PASS is for the authorized final modern figure at the measured offline widths.
It does not assert headed-product width measurement, lesson acceptance,
retention or promotion. The mixed recoloring is a stress fixture, not a new
app theme/token. Scratch output paths remain scratch; durable relocation or
any source/spec/render/SVG change requires correctly rebound evidence.

The original rough scan is never presented as exact scale geometry. Both
new fourth ticks, exact intervals/equal lengths, support strokes, application
dots and scale caps remain declared additions. Their justification is the
current prose, not a hidden key. Mobile horizontal scrolling is intentional;
simultaneous whole-image visibility at 306 px is not claimed.

Only the required independent reports/review JSON and disposable offline
script/screenshots/evidence were written in the two permitted scratch roots.
No author spec/SVG/render/notes, source PNG, lesson/template, edition, app,
dependencies, DB, Git state or other agent's work was modified. No author
render was rerun, no repair was attempted, and no promotion occurred.
There is no affected unit requiring main-authorized repair.
