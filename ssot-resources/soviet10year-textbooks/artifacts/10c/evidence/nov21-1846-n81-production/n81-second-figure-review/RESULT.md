# Independent figure review: n81 figures 17-20

STEMROBIN-184/184-6 remains OPEN for parent intake and actual closure.
Finish=review. No record_review, promotion, producer gate, render, repair,
publication, DB, Git, product edit, agent spawn or peer message was performed.
This is a bounded independent DRAFT review, not whole-lesson acceptance.

ROOT=/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck
Owned output directory:
/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n81-second-figure-review/

## Verdicts

| Figure | Scientific/source | Actual640 display | Overall |
| --- | --- | --- | --- |
| 17 | PASS | FAIL: O intersects solid curve | FAIL |
| 18 | PASS | PASS within captured DRAFT | PASS |
| 19 | PASS | PASS within captured DRAFT | PASS |
| 20 | PASS | PASS within captured DRAFT | PASS |

### Figure 17: FAIL, local label collision

The solid cos(20x) path preserves all five positive crests and four complete
negative troughs. Peaks at -pi/5,-pi/10,0,pi/10,pi/5 and the source's printed
pi/10,pi/5,-1 relationships are correct. The dashed cos(x) remains a broad
positive arch with both partial outer branches, rising left and falling right.
Both curves retain amplitude 1 and share the y-axis maximum. Period pi/10,
solid/dashed association, formula signs and the single shared frame are sound.

However, actual native640 view 5 visibly shows the rising solid branch crossing
the modern O label immediately left/below the origin. This is not a question
about whether the source glyph is O or 0. Its declared editorial identity is
acceptable, but its emitted placement is not clear of the curve.

The actual SVG has end-anchored O at native640 (267.953846,289.381709), font
22.666667px. Inverse interpolation of the actual solid M/L path puts that
branch at (258.168641,289.381709), only 9.785205px left of the text's end
anchor, visibly within the O glyph footprint in the permitted capture.
Exact font-outline bounds were not measured or decoded. The source-first
formula supplies the same crossing independently; this is not just a
bounding-box assumption.

Current render.json says pass and collisions=[], but that does not disprove
this actual curve/label collision. The earlier pi/5 collision was repaired
by the documented tick-label changes; it is not this remaining O collision.
No repair was made. This candidate must not be treated as independently
visually approved on the strength of its render status.

The pi labels are 16.666667px at640, readable and bound to the correct tick
positions; other labels are22.666667px. Neither formula is clipped. No
new endpoint dots, extra numeric quantities, answer text or cultural content
was added. Maximum continuous cosine approximation bound:0.016495530px
at640 for solid,0.016176983px for dashed.

### Figure 18: PASS within captured DRAFT

Solid cos(2x) and dashed cos(x) retain the single shared frame, same unit
amplitude and common central maximum. Solid has three interior positive
crests plus the two near-cut positive crests and four complete troughs.
Dashed has the central crest, both positive outer branches and two complete
troughs. Solid period pi is half the reference's2pi; printed pi and2pi align
with solid maxima, not zeros. No guide, y-value or reference formula was
invented. Exact outer cuts are accepted as documented modern composition,
not as recovered endpoints or domain restrictions.

Source18 does not visibly print x; the added x is explicitly declared
editorial naming justified by the edition's axes. O is also explicitly
editorial, not original glyph recovery. The labels are22.666667px at640,
readable in view6, with no observed clipping or misleading overlap.
The curve identities are independently recovered from actual output path
coordinates, not objectCount. Maximum continuous bound at640:0.005874765px.

### Figure 19: PASS within captured DRAFT

The solid cos(2x+4) is correctly translated left by2 from dashed cos(2x).
Both retain amplitude1 and period pi. Four solid positive crests and three
complete interior troughs remain, together with the negative rising left
partial branch and negative falling right partial branch. Dashed retains
three full crests, four troughs, positive falling left and rising right
partial branches. Unequal modern windows do not erase either curve's edge
topology. At x=0 solid is negative and rising while dashed is at its maximum.

The minus sign in -2 survives and its guide is genuinely connected:
the actual output line inverse-transforms to (-2,0)->(-2,1), terminating
on the second solid crest with zero path-incidence residual. No horizontal
translation arrow, extra y-value or dashed formula was added. Labels are
22.666667px at640, readable in view7; no clipping or misleading overlap was
observed. Maximum continuous bound at640:0.005871298px.

### Figure 20: PASS within captured DRAFT

Solid3cos(2x+4) and dashed cos(2x+4) retain the same phase, period pi,
all nine displayed zero crossings including drawing cuts, and four complete
positive/four complete negative lobes each. The solid is triple the
reference without a phase change; both are negative and rising at x=0.
Actual polyline scaling residual at201 overlap samples is approximately
1.0e-12 user units. Both near-baseline outer branches rise, as in the source.

Every guide is present and incident on the actual curve, not merely on a
declared arithmetic assertion. Vertical output:
(-2,0)->(-2,3), passing through the dashed crest(-2,1).
Horizontal output:(0,3)->(-2+pi,3), reaching the next solid maximum.
Output path-incidence residuals are4.44e-16 and1.69e-14 user units.
The printed3 is retained; no -2,+1,-3 or crossing numeral was invented.

The recovered y,3 and formula labels are18.666667px at640; x and O are
22.666667px. View8 shows the formula in a clear upper band and both guides
legibly separated from text. No clipping or misleading overlap was observed.
Maximum continuous bound at640:0.014059266px solid,0.004686422px dashed.

## Independent method and provenance

The complete approved n81 lesson/exercises JSON was read before candidates.
All nine exercise prompts60-68 were context only, not solved. No answers,
keys, choices or interaction specifications were read. Relevant source-first
equations are worked-example mathematics, not exercise answers.

Four original images were opened once each in17,18,19,20 order. The source
inventory, quantities, lobes, partial branches, guide incidence and analytical
expectations were frozen before ANY author/candidate/report reads:
source-freeze.md SHA256
381e68d6c4f451e1f1a37ee759f018a0e825b7fdb337380e87fb53ad7baa97a7.

After freezing, the author documents were read as proposals, never independent
proof. The four existing native640 captures were then viewed once each in the
same order. No image reopens, crops, raster pixel decodes or new captures.

Reviewer-only inspect-output.py parses XML with the standard library and
strictly parses the actual M/L curve paths. All8 path strings match their
current specs AND the current draft HTML, with correct emitted transforms
and solid/dashed styling. Actual coordinates were inverse-transformed using
the output scale and canvas frame. Every vertex and five interior points per
segment were checked against independently frozen cosine equations. The
curvature bound A*omega^2*dx^2/8 plus maximum vertex residual bounds the entire
piecewise-linear curve, not just sampled points. Every in-window analytic
zero and extremum was checked against actual polyline interpolation.

All curves fit their canvases. Labels match embedded draft text/positions.
No visible point markers occur. Inventory object/assertion IDs resolve.
Only declared label changes distinguish17/20 recoveries from their preserved
first specs; curves, geometry, source, text and assertions are unchanged.
Eight existing execution receipts have verified stdout/stderr byte and
SHA256 bindings. Four author validator receipts/streams and20 selected author
manifest bindings also match measured inputs. This is no producer gate rerun.

geometry-evidence.json contains all exact absolute input/evidence paths,
78 measured byte/hash bindings, equations, path-string hashes, extrema/zeros,
derivative signs, guide coordinates, label anchors, recovery changes and
existing execution receipts.
SHA256:a5b7fa4b17b63cb2cefa9256b51f792c1450f8021b9685e8eb453c40741b7e7f.

The author-declared finite windows are display composition only. Original
O/0 codepoints remain UNKNOWN; no claim of source letter recovery is made.
There are no extra answer-bearing additions or cultural text/symbols in
these mathematical outputs.

## Exact figure bindings

Paths in this section are ROOT-relative; every path is fully expanded in
geometry-evidence.json and usage-ledger.json.

| Figure | Input/output path | SHA256 |
| --- | --- | --- |
| 17 source | ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-17.png | 2635c2d39c0b80b6e232ce9716e668a6a7d28f0ec5d1e94ac489bb7e4a7b148b |
| 17 spec | .tmp/stemrobin-184-six/n81-second-render/fig-17/label-recovery/spec.json | ecbb030d67ac5f3b398c8b0b29fe24efed7f0dc2d8f5f839277c4c30c8460f11 |
| 17 render | .tmp/stemrobin-184-six/n81-second-render/fig-17/label-recovery/render.json | cf8308c3b1a6d225e6e79d3663420a68315021d268973fe1a8014fae90134699 |
| 17 SVG | .tmp/stemrobin-184-six/n81-second-render/fig-17/label-recovery/fig-17.svg | a6deaf0df6f81e09a4b86623cef3aa6def60ad59f07ccd25b6f9d108e7eec5dd |
| 17 capture | .tmp/stemrobin-184-six/n81-second-render/fig-17/native640.png | 0f661002cc9be3d2634375edd655fae86c34e0af6ed4ff924a3e886016b6aab2 |
| 18 source | ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-18.png | 128bc913f07c26f427d77d931f0810df6ac01b908f6701372c868e53e973118e |
| 18 spec | .tmp/stemrobin-184-six/n81-second-render/fig-18/spec.json | 63e09af3ca110f65bd84ea1cc6667ba4e39b4fd0b33bb344fa5052a4e027965a |
| 18 render | .tmp/stemrobin-184-six/n81-second-render/fig-18/render.json | b1a711280691d5e577a2fc3b3d0c39578a6c47f018545896f4dee1b9f9444fe6 |
| 18 SVG | .tmp/stemrobin-184-six/n81-second-render/fig-18/fig-18.svg | e9afa901d016c2ee5d3eabead6364e56d0815286495dd3eb907176972f1302b8 |
| 18 capture | .tmp/stemrobin-184-six/n81-second-render/fig-18/native640.png | 4d917e4b1b2734c374c932a4c4d487627908dfb674fd389dcbfab14f6eb1ed1a |
| 19 source | ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-19.png | 0cbcd58f36f0eb90c458e5cb63da16c16e20e1d32f2ce7b9bc17994530641cdc |
| 19 spec | .tmp/stemrobin-184-six/n81-second-render/fig-19/spec.json | 24c8a72538d40dc150a19606635633118377b44e3693df3446ee301f7818c346 |
| 19 render | .tmp/stemrobin-184-six/n81-second-render/fig-19/render.json | dc4c2a94ac4ded829bb981e6130dd25a6c0c28ee3745ac4082c9834aa9a55b5f |
| 19 SVG | .tmp/stemrobin-184-six/n81-second-render/fig-19/fig-19.svg | 3eadc91d63e1bca441deebcd725462a8a1e44b0320159a2db752f8b76e2c2ed7 |
| 19 capture | .tmp/stemrobin-184-six/n81-second-render/fig-19/native640.png | 0f869e12d45e8d4a37b604a364344ce59d67e0986473d82a2cd42248111105fe |
| 20 source | ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-20.png | 458541c1db6511f9532eeccd1692304e9027c082eb89aab00b85d8a8c167321a |
| 20 spec | .tmp/stemrobin-184-six/n81-second-render/fig-20/label-recovery/spec.json | f5ae159fb1caaf955e4790ebb443a4ee288984b090847c0b4e39211b5636047e |
| 20 render | .tmp/stemrobin-184-six/n81-second-render/fig-20/label-recovery/render.json | 6fc121ed53f8c6b7a5d148e8cb8d1e9b91501d0f21edd79024624062d67839b1 |
| 20 SVG | .tmp/stemrobin-184-six/n81-second-render/fig-20/label-recovery/fig-20.svg | 68c55307796219046a02121fda4825a555aa521813fdb65df4d7aeff4ef39e80 |
| 20 capture | .tmp/stemrobin-184-six/n81-second-render/fig-20/native640.png | 61422c811a9a7fc10115410a018e58176d1f7179d5648a1297cf11b40c9a1637 |

## Actual execution receipts

Existing producer receipts read and stream-checked, NOT executed by reviewer:
directory .tmp/stemrobin-184-six/n81-n82-stages/.

| Actual receipt | Exit | Receipt SHA256 |
| --- | --- | --- |
| fig17-first-new-render.receipt.json | 2 | 9b6a7fc2ee102af886e1dde4a9b319beb95c9f66166b1e8dfce83348d901e8f7 |
| fig18-first-new-render.receipt.json | 0 | 8a5c44373b80c51dee752d30de95af0c44d762b2d6bb67381df145c935f04fc7 |
| fig19-first-new-render.receipt.json | 0 | 424aa8b25d271a88e1f0a0ec5e3328e019da948262b00daa15201de3de39ab81 |
| fig20-first-new-render.receipt.json | 2 | 8c1086326400edeb93176717080cc09861a04290d13b1dcfb05384eb3640e26b |
| fig17-label-recovery-render.receipt.json | 0 | f7d27c28c76230adebfa87cadc7d5b6b37b8b6d39ec2cd46e538fab4dbe4702a |
| fig20-label-recovery-render.receipt.json | 0 | f40fbf0837c91885e102e1bfa91d7441eda3fc8757e3c329313258d86f972644 |
| all9-draft-offline-render.receipt.json | 0 | 0d5a4e2a503937bedeb09524e671f9a95bcce3a2885f0403f83aaff024c0fc73 |
| second-draft-display-capture.receipt.json | 0 | db42d0839df85c889b31276d83cd87b7555c8b1eaa067d8b05e68a65fcb617f3 |

Author validation.execution.json receipts for17,18,19,20 each record one
actual invocation, exit0, stdout127 bytes, stderr0 bytes. All four exact
spec/stream bindings were checked in actual tool exec a48071, exit0.
These receipts bind original author specs, not a newly invoked recovery gate.

Reviewer geometry check actually ran twice. Exec0b95d5 exited1 due to a
reviewer-script empty-zero-list assumption for17's positive dashed arch;
inspection-first-failure.receipt.json preserves that failure. Only the
reviewer script was corrected; no candidate changed. Exec997029 then exited0
at2026-11-21T14:40:11.148683Z through14:40:11.203459Z.
inspection.execution.json records the actual command, ROOT cwd, script hash,
output hash and tool receipts. No timestamps or metering were invented for
the failed run.

## Display scope and usage

display-evidence.json SHA256
07f5b0fa3f40b3e96f012af85ac7b211364c1209ea943260c0ae2327eb4bc9dc.
Its current draft text.html SHA256 is
98b85cf58fd8ae4015a50250fd5ac839cfab353afae409be68009c7cbdb339be.

The existing headed-owner evidence records desktop1440x960 and mobile390x844,
media640, no page overflow, and mobile horizontal wheel reaching297px in a
343px container. Minimum displayed label sizes are16.666667,22.666667,
22.666667,18.666667px for17-20. These supplied measurements were checked as
evidence; the reviewer did NOT operate a browser, view separate mobile/end
captures, or view alternate themes. Only the four full native640 captures
were visually inspected. No whole-page or whole-lesson visual acceptance.

Actual image usage: fresh initial0; one8/8 batch; source4 then output4;
context8/24; each image once; no reopen/crop/decode/new capture/other image.
Parent remains permanently24/24 and receives TEXT ONLY. The owned directory
contains no copied or embedded images. usage-ledger.json has every absolute
view path, exact hash, ordinal and cumulative usage.

Paid generation/network/DB/publication/Git/installs/bootstrap/freshness
checks/producer gates/renders/record_review/promote/spawn/messages:0.
No other participant's files were modified or reverted.
Actual agent token usage and hidden billing are UNKNOWN because no metering
receipt is exposed; zero paid-generation calls is not a claim of zero
agent-runtime charges.

manifest.json inventories every owned output except itself with absolute
paths, actual bytes and SHA256, explicitly self-excluded to prevent circular
hashing. It will be generated only after this report and receipts exist.

## Parent intake boundary

Figure17 has a concrete unresolved visual FAIL. Figures18-20 are independent
PASS only for their exact current captured DRAFT bindings. No further
image-bearing review is authorized in this batch. Any affected repair needs
its own authorized review path; this reviewer did not perform it.

Modern finalization, canonical review recording, whole-lesson approval and
ticket closure are not performed. State remains OPEN until parent intake
and an authorized actual closure. No closure or approval app/tool operation
was called.
