# FIRST independent modern FIGURE review: n5 / 19-21

Date: 2026-11-23. Ticket: STEMROBIN-180 / 180-7.
Sole FIRST independent reviewer; these are substantive first verdicts, not
renewed approvals or author-preview endorsements.

Every command used explicit workdir
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
No source/spec/geometry/math/tool/text/manifest/DB/Git changes, installation,
bootstrap, paid calls, or new agents. Other workers' edits were preserved.

## Written verdict before promotion

**fig-19 PASS. fig-20 REVISE. fig-21 PASS.**

This written approval authorizes unchanged fig-19 and fig-21 SVG/spec promotion
only. Figure20 is not approved or promoted. Lesson publication, actual owning
lesson DOM display acceptance, F7 modern assets, and figure22 modern pixels are
outside this verdict.

The independent source freeze was saved before reading any author report,
candidate spec, inventory, current preview, or edition text:
`.tmp/180-7-n5-review-19-21/source-first.md`,
SHA-256 `3baf7d90807cba751101d0a52edc1ca029f01810e45350c932dfe8d7d0049254`.
The three durable original PNGs were individually opened once, uncropped.
The handoff was first read as paths/hashes only; author inventory did not
replace the independent source record.

Image use: **6 total = 3 originals + 3 composites**. Each composite contains
the current 640px PNG at full resolution plus 480px and 318px views.
No source replay, source crop, whole-batch reopen, optional finding image, or
additional image for text review. Original PNGs remain the source; the
composites are display evidence only.

## Exact inspected candidate bindings

Candidate prefix: `.tmp/180-7-n5-figures-19-21/`.
Specs: `specs/fig-N.r1.spec.json`; SVG/report: `render/fig-N.r1.svg` and
`render/fig-N.r1.render.json`; PNG: `previews/fig-N.r1.png`.

| Figure | Original PNG SHA-256 | Current spec SHA-256 |
| --- | --- | --- |
| 19 | 98370364987503ee52744d3b007389d61ab182cfd038914c14f985c4d4171bd2 | 98cf99c1596e1de14dd51c6a8347c728c6ec7378a6c67eddfcbdb59fb31dbc63 |
| 20 | f42099a98394107bb8d663471cc9cf97a7c9b444716173416f9685989eabc8fe | c88c7e68bb9a62cf75a91650bbf27522c7e50898f971cba5a4d8fce55283e232 |
| 21 | a4605a9d47afdab96eee5c6a2330da42f9ea7f6b818b0bd7105e5e95ac3b7842 | 60ae6a78f4faa3552248a543914cbad21fe4cae47fa5e50d69d6d93adc9a8751 |

| Figure | Current SVG SHA-256 | Current render report SHA-256 |
| --- | --- | --- |
| 19 | b0ee26b25bb3b35fb9c1f3dee8c04c0b5d071a5161c738c05039118d6ff9fe28 | f18b8249c369f0b3e62d9fca056101eacdd234f7b0198e12c79a36fa55f7bf60 |
| 20 | 2497b6f2d177e2faa6e21fafe7bd9663ba2eba78a6159cab7d46d29eee559747 | e9ae7459a48e0f6fe629d44bce7007d8830a147294a7dedfb57e5c24ba39b9f6 |
| 21 | 2bbc176f743d1bc6a9511a6373e25a176766f637205069ecc0abbd9d120e0cc3 | c1751a70f8e1dc4a38fa837b37f01855040826ac4fa96d988740a84dcc692d5a |

| Figure | Current PNG SHA-256 | Inspected composite SHA-256 |
| --- | --- | --- |
| 19 | 5329138bf1f9462e5e4a918d40be146b9b2973990e2682c99ca6cb92d562fde5 | 42453be3d38ba730d8a1eaa7aaed0a1587786bc57a9ce872c4f88dca64b51a1d |
| 20 | d5b447e64c699f0cb711a044c63df61e0bea388c551ce130f127ab78a5e67767 | e8f5bdd912054772714d6cd2082c329368473b2609558659ec9a10016cb81ea2 |
| 21 | 74a4d58ac33f5ca982d59e8cc921de63686978120a165933fa916a2a7f2f3346 | 9a9163a5ba76cd8c5e4a497368506bccd1fe509a6fea2060c929b62309ddb9ae |

Composites: `.tmp/180-7-n5-review-19-21/fig-N.r1.composite.png`.
All handoff file hashes, current spec/report/SVG references, relevant prose
equality, endpoint equations, projection-foot order and reported text minima
were checked by the reviewer-owned `check-current.mjs`. Its current binding
record is `.tmp/180-7-n5-review-19-21/current-bindings.json`,
SHA-256 `e88090b2f163c3fec23614bc2baa1fb475a231668d24ff26bda6f25e29c8b6e9`.
Existing `validate_spec.py --stage rendered` passed separately for all three.
Mechanical PASS does not override figure20's visual/source-fidelity REVISE.

The finalized current template is
`.tmp/ld-s10y-lesson/adapt/8p/modern-us-neutral/lessons/phy8-c1-s1-n5/lesson.template.json`,
SHA-256 `0d64d52579593024087aec5f033d4a429e63075c1297bcf1913fc967788f6ef5`.
The old author extraction template digest was
`71e7685ee56dc56a9a1314ce085959c647120ea6dbe3b0105e8ae4d7b62343b1`;
the complete relevant figure19/20/21 paragraphs still match current prose
exactly. Full modern-text review is separately recorded in `modern-text-review.md`.

## Findings and source-to-candidate comparison

### fig-20: REVISE / source projection indicators omitted

The independent original-pixel freeze records outlined horizontal projection
indicators for A-D and D-C above the main axis, as well as the solid/dashed
horizontal projection guide at that level. The actual current full/480/318
pixels show only a single solid notched f_x/c_x bracket row and the lower
a_x/b_x brackets. No outlined horizontal projection indicators remain; the
source's upper horizontal solid/dashed distinction is not represented.

Current objects map the four brackets and four vertical drops but contain no
corresponding horizontal projection-indicator objects/assertions. Endpoint
marker additions and notch regularization do not cover this omission. The
retained earlier raw `source-first.md` also explicitly inventories horizontal
projection arrows; it corroborates, but did not supply, this independent freeze.

Required affected repair: restore the source's horizontal projection indicators
and their directed A-to-D / C-to-D meaning, with the applicable outlined and
solid/dashed distinctions in the same frame. Declare/map them separately from
brackets and add executable endpoint relationships. Do not invent numbers or
change the already-correct vector chain, foot order, or algebra. A changed
candidate requires affected-only actual-pixel review; this first REVISE and
the current r1 candidate must remain preserved.

Unrelated checks PASS: a=(250,60), b=(210,173), c=(-140,-251),
f=(320,-18)=a+b+c; feet A<B<D<C; correct vertical drops, four foot labels,
four component labels, rightward x axis, upper/lower bracket spans, negative
c projection, hollow f, readable vector marks. No Y axis, numbers, unwanted
point names, cultural wording, black/empty/broken rendering, or label overlap.

### fig-19: PASS / actual repaired pixels settle first author failure

All five semantic arrows and five source vector labels are present: separate
a right and longer b left; lower translated a right, offset b left, and
short outlined a+b left. The lower right endpoints align and both rows have
the same vertical translation. Exact vectors are a=(320,0), b=(-440,0),
sum=(-120,0); construction copies equal the standalone vectors.

The current pixels visibly show ordinary a/b, the plus sign, and a separate
over-arrow on each operand at full, 480 and 318 widths. No missing-glyph box
remains. The hollow sum shaft/head is readable and distinct from a and b.
All labels are attached unambiguously, and the modern endpoint markers
are small/unlabelled and explicitly declared additions, not source facts.

This is a real current-r1 independent PASS, not inference from render status.
The first author's fig-19 r0 visual FAIL remains indispensable historical
evidence and is retained with its failed spec/preview/output bindings.

### fig-21: PASS / full subtraction construction

Separate standalone a up-left and b up-right remain separate. Triangle a
runs bottom-right to top; -b runs top to bottom-left; hollow c runs
bottom-right to bottom-left. The entire c=a-b label, both minus signs,
equality and all vector marks are readable at full/480/318 widths.

Exact vectors a=(-120,252), b=(80,252), -b=(-80,-252), c=(-200,0)
prove identical a, reversed equal-magnitude b, and c=a-b at coincident
triangle endpoints. No extra frame, axes, measurements, point labels, or
answer-bearing additions. No overlap, clipping, empty/black/broken pixels,
or cultural residue. Small endpoint markers are declared modern additions.
The author's first r0 label-collision FAIL is preserved, not overwritten.

## Display / color / retention boundaries

All visible figure text is Latin/mathematical notation. Semantic ink/accent,
muted guides and paper roles are declared; SVG reports use CSS variables.
Reported transformed text minima: 17.8875px at 318, 20.1375px at 358,
27px at 480. Actual full/480/318 composites were inspected. No additional
product acceptance gate or claim of owning-lesson DOM measurement is added.

After this written approval, fig-19 and fig-21 may be copied unchanged to
`artifacts/8p/editions/modern-us-neutral/figures/fig-N.svg` and `fig-N.spec.json`.
Only copied render-report path metadata may be structurally rebound to those
durable files. Existing `record_review.py` then records a current durable
PASS. No geometry rerender is authorized or necessary.

The `.tmp` batch and independent evidence remain intact, especially figure20's
first failures and current unapproved candidate. Indispensable fig-19/21
source-first/author inventory, current pixels, failure and bound review
evidence are retained alongside their owning durable figures without any
runtime/package copy. The promotion receipt supplies final durable hashes.
