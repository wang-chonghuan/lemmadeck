# n81 figures 13/17: independent affected display review

STEMROBIN-184/184-6; offline; finish=review; 2026-11-21.
ROOT=/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck.
Owner: ROOT/.tmp/stemrobin-184-six/n81-two-origin-affected-review/ only.
State: OPEN for parent text-only intake and authorized actual closure.
This is reviewer scratch, not review@1, promotion or whole-lesson acceptance.

## Findings first

**Figure 13: FAIL for the current captured candidate.** The authorized O and
pi/3 changes pass: O is now isolated northwest of the true axes intersection,
and pi/3 is below/right of its exact tick, away from the solid rising branch.
Neither repaired glyph is crossed by a painted curve, axis or tick in any of
the three inspected views.

There is a separate residual display defect at the unchanged **-1 y label**.
In native640, the desktop figure-region capture and the mobile starting
segment, the upper/right portion of the digit 1 joins the black solid curve
beside its bottom trough. The numeral and the curve do not have a clean
visible gap. The value can be inferred from context, but its glyph is not
independently clean for a learner reading the graph. This is a newly noticed
defect in an unchanged component, not a defect introduced by moving O/pi/3
and not wrong mathematics. Existing scientific PASS and the renderer's
empty collisions array do not waive it. No raster/font-outline measurement
or new mathematical proof was performed.

**Figure 17: PASS within the three captured DRAFT views.** The smaller O is
readable in the narrow space left of the y-axis and below the x-axis.
The solid rising branch stays visibly to its left; it no longer traverses
the glyph. The y-axis stays to its right and the x-axis above it, with
discernible separation. No new origin ambiguity, misleading tick association
or glyph clipping was observed. The marker is still hidden at (0,0):
visible O remains the declared editorial label, not a source dot or tick.
Both formulas, the -1 value, and the two previously accepted pi tick labels
remain readable in the whole native/desktop views. Mobile shows only the
starting segment, including a clear O and -1, not both complete pi labels
or the right-hand formulas. Those unseen mobile portions are not accepted.

| Figure | Scientific/source reuse | Changed-label display | Current captured-candidate verdict |
| --- | --- | --- | --- |
| 13 | PASS | O and pi/3 PASS | FAIL: unchanged -1 glyph/solid-curve contact |
| 17 | PASS | O PASS | PASS within captured DRAFT scope |

## Science reuse and text comparison

The complete approved DRAFT lesson.json and exercises.json were read before
candidates. All nine prompts 60-68 were context only, not solved. Their
current hashes match both prior independent freezes:
lesson 08f28c1f3356435f58a8eba12c7691abb2bf01836cdb0e7380068c9accb65ce6;
exercises 7a2b399482b34db36025d408b362ed9fa0506876cda74a52276d2de2771e6988.
No answers, keys, choices or interactions were read.

The source13-freeze/affected-review/evidence-bindings and the
source-freeze/RESULT/geometry-evidence records were read and their selected
owned hashes matched their parent intakes. Both previous whole-candidate
verdicts remain FAIL. Their actual post-intake closures are present:
origin reviewer 01a1fe7c-b360-7570-b1cb-d5102169c8c7 at
2026-11-21T14:34:00.496Z; second reviewer
01a1fe87-5f2b-78c0-94bd-51a3da92e4ff at 2026-11-21T14:46:36.573Z.
These are prior reviewer closures, not closure of this reviewer or ticket.

The new helper compares only the two prior/current candidates and their
named evidence. Full structured spec equality holds after excluding only:
13 origin-editorial.labelPlacement and x-tick-0-value.at/labelPlacement;
17 f17-origin-modern-O.fontSize/labelPlacement.
All other objects, curve d strings, style, labels, geometry, assertions,
source, inventory, authoritative text, canvas, layout and display are equal.
Parsed actual SVG trees are also equal except affected label x/y,
text-anchor/font-size attributes. Label text, colors and weights are retained.
Each current target SVG is embedded byte-for-byte in its bound draft HTML.
No old checker or producer was rerun.

| Figure | Equal prior/current unaffected spec SHA256 | Equal prior/current unaffected SVG-tree SHA256 |
| --- | --- | --- |
| 13 | a9cb4132dc7242d83a02532ae56fb1cbb9863476f265456a448b874d9a8b2777 | d3a54885b86f1169279aa974b8e5b890bf9efe989773471b3419c4affea19e53 |
| 17 | 12f71536c1dfebfd74983806eaa6e328c0355ce968f6a38221e7106d1004c420 | 3257c69f244298a1043c2866022eca021db12c83a458b8d02f565ea048114803 |

These hashes describe explicitly normalized components, not whole-spec
approval. Reused findings retain 13's rightward pi/3 translation, equal
amplitude/period, 3 crests/2 troughs each, 5/6 zeros and correct formula
leaders; 17's solid cos(20x), broad dashed cos(x), five positive crests,
four complete troughs, equal amplitude, period pi/10 and correct printed
pi/10, pi/5 and -1 quantities. None was re-solved.
Original O/0 remains UNKNOWN. Editorial O does not recover a source
codepoint. Finite windows remain display composition, not recovered source
endpoints or mathematical domain restrictions.

## Display observations and limits

13: both changed labels remain 18px. Emitted O is end-anchored at
(243.7004048583,165.1428571429); pi/3 is start-anchored at
(310.5467514941,205.1428571429). Their source-space anchors are respectively
(0,0) and the exact existing pi/3 tick. The residual -1 is unchanged,
center-anchored at (234.8204048583,288), 18px.

17: O emits at canvas (415.5307692308,436.4725631769), end anchor,
font26, hence fixed640 anchor (277.0205128205,290.9817087846) and
17.333333px. The two unchanged pi labels remain16.666667px.
No font size or placement has been inferred from the filename alone.

The bound owner receipts record headed desktop1440x960/mobile390x844.
Their existing screenshots are figure-region captures, not a visual
inspection of every region of a full viewport. Both have fixedmedia640,
desktop container685/mobile343, no reported page overflow, and native
mobile horizontal wheel0->297 (expected297). Stream-checked measurements
prove reachability only; no mobile end or alternate theme image was viewed.
Mobile clipping of the right part of the scroll media is expected internal
scroll composition, not evidence of a clipped source curve or page overflow.
No unseen final lesson, product page or print surface is accepted.

## Exact bindings and actual receipts

All absolute candidate/capture/receipt paths, actual byte lengths and SHA256
are in comparison.json. It binds both spec/SVG/render/changes/display files,
the two target draft HTML files, six captures, selected prior review records,
both intakes/closures and all six named execution receipts and streams.
Source-image hashes are inherited from the unchanged source fields and
independent freezes; this reviewer did not read even their raw image bytes.

| Current binding | SHA256 |
| --- | --- |
| n81-fig13-label-recovery/spec.json | 1d1293e3cc028ca343075f9af13881d1857122c047476336984a312b85013892 |
| n81-fig13-label-recovery/fig-13.svg | 3a3339bd64355e94718f5413ce912a5e856af899b563129df8d92cb2b8a2fff4 |
| n81-fig13-label-recovery/render.json | 79916c0cede1107facc2b79ce81d1dd59d5079f2dd7cea9988190b6b74c0fd4d |
| n81-fig17-label-recovery/spec.json | 6c4b23c89e94db7c00d7ccef17def49ddb91ecfe4e338002eee0603224b028e6 |
| n81-fig17-label-recovery/fig-17.svg | 0a788d39cbcf84a9a185d0331b3f2f833490651598c04e595eb3faf75312e7be |
| n81-fig17-label-recovery/render.json | 55c7edf55c5b2672f01756e7d6511faf59e5b222535613ddba0ba14272145f31 |

These table paths start at ROOT/.tmp/stemrobin-184-six/.
Existing actual receipts under n81-n82-stages, NOT executed by this reviewer:

| Receipt stem | UTC start -> end on 2026-11-21 | Exit |
| --- | --- | --- |
| fig13-two-label-recovery-render | 14:34:17.317 -> 14:34:18.220 | 0 |
| fig13-recovery-draft-offline-render | 14:34:29.972 -> 14:34:30.031 | 0 |
| fig13-recovery-headed-capture | 14:34:57.656 -> 14:34:58.866 | 0 |
| fig17-origin-clearance-render | 14:46:49.845 -> 14:46:50.899 | 0 |
| fig17-recovery-draft-offline-render | 14:46:58.247 -> 14:46:58.302 | 0 |
| fig17-recovery-headed-capture | 14:47:02.056 -> 14:47:03.175 | 0 |

Every receipt names ROOT, no signal/launch error, matching stdout/stderr
bytes/hashes; all six stderr streams are empty. Render stdout reports PASS
for17objects/8labels. Both offline stdout records report37prose/9exercises.
Capture stdout binds its exact display-evidence.json and matching viewport,
width, overflow and wheel observations. These technical PASS results do not
override the figure13 visual finding.

## Six-view ledger and failures preserved

Exactly one batch, initial0, six6/6, context6/24. Actual view order:
13 native640; 13 surface1440; 13 surface390;
17 native640; 17 surface1440; 17 surface390.
Each full supplied file was viewed once. usage-ledger.json records the six
absolute paths and capture hashes with per-view findings. No reopen, crop,
programmatic raster decode, new capture, original or other image was loaded.
Parent remains permanently24/24; this return is TEXT ONLY.

The two original whole-candidate visual FAILs remain preserved, as do their
historical technical failures: figure13's earlier render FAIL; figure17's
initial render exit2; the old independent reviewer helper exit1. No prior
FAIL has been rewritten as PASS.

This reviewer helper first actually exited1 (tool chunk e96656) because it
looked for SVG id instead of data-label-id; the exact failed script hash and
stderr are preserved in comparison-first-failure.receipt.json.
Only that helper was corrected. The second actual invocation81862a exited0,
2026-11-21T14:50:03.450514+00:00->14:50:03.472200+00:00.
comparison.execution.json binds its actual tool result, script and output.
The earlier ls directory probe4e8783 exited1 because the owned directory did
not yet exist; this was not a producer or candidate failure.

self-excluded-manifest.json lists every owned output except itself, with
absolute path, bytes and SHA256; inspected input bindings live in the bound
comparison.json. No copied/embedded images exist in owned scratch.
No app/Git/DB/paid-generation/network/install/freshness/spawn/messages,
producer rerun/repair/promotion/record_review/canonical edit or completion
delta was performed. Other owners' files were not edited or reverted.
Agent token usage and hidden billing remain UNKNOWN, not asserted zero.

OPEN. Parent intake and authorized actual closure have not occurred here.
