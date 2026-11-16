# 10c physical31-34: sole independent StageB source review

Reviewer: Dalton. Ticket: STEMROBIN-184. Date: 2026-11-16.
Scope: physical31-34 only, immutable Banach disclosure, one complete StageB
comparison against the prior original-first freeze. No source edits.

## Verdicts and Findings

| Page / folio | Independent source verdict | First actual mechanical result, retained |
| --- | --- | --- |
| 31 /25 | REVISE representation only: F31 below. All other observed prose/math/rows/objects/crops/boundaries PASS. | 9/9, exit1, unsupported U+25BA; NOT PASS |
| 32 /26 | PASS for complete observed text/math/objects/crops/boundaries. Origin-label codepoint remains unassigned in pixels. | 13/13, exit0 |
| 33 /27 | REVISE typography: F33 below. Other definite text/math/objects/crop/boundaries PASS; U33 remains unresolved. | 13/13, exit0, does not detect F33 |
| 34 /28 | UNKNOWN at U34 only; definite text/math/rows/objects/boundaries PASS. No unconditional full-text PASS for the unresolved glyph. | 24/24, exit0, does not resolve U34 |

### F31: Printed right-pointing filled opening marker

Stable location: `p0031#5`, first stored/printed line,
durable `pages/0031/page.md:74`.

Current exact start:

```text
►按照上面规定的图象变换规则第三条，由
```

My pre-author StageA records a printed, filled, right-pointing triangular
opening marker on this very explanation row. It is not a scan artifact,
arrow on a graph, bullet for a numbered task, mathematical inequality,
footnote callout or extra print row. Its closing counterpart is the filled
left-pointing marker in `p0032#1`, second printed line, after the period.
The explanation continues at the discourse level into32; this does not make
the complete31 sentences into truncated textual fragments.

The shape/fill/direction and marker role are independently confirmed by that
freeze. No source digital Unicode identity can be recovered from a scanned
glyph. The author's chosen U+25BA is rejected by the actual current gate;
this is a representation failure, not missing source text or a count problem.

Smallest source-faithful recommendation: replace only the leading `►` with
`$\blacktriangleright$` on the same existing line, preserving the following
text, all line breaks and the matching left marker on32. This mirrors the
already retained LaTeX fill/direction representation of the closing marker,
not a claim about the original font codepoint. Do not remove the marker,
add a row, alter a formula, whitelist U+25BA or add a noise exclusion.
This recommendation was NOT applied or validated here. Parent authorization
and affected-only verification are still required.

### F33: Task68 raised star flattened and ordered after the period

Stable location: `p0033#12`, first stored/printed line,
durable `pages/0033/page.md:87`.

Current exact prefix is `68.* `, with a baseline period followed by an
ordinary baseline star. My original-first freeze independently records a
raised star attached to68 and a baseline task-separator period. The current
literal text does not preserve that typography or the number/star/period
roles. The author's handoff admits the physical raised placement but its
stored text still flattens it. Mechanical PASS is not acceptance of this
discrepancy.

Smallest recommendation: `68.* ` -> `$68^{*}$. ` on this same line, leaving
the `<!-- ex 68 -->` identity, period, four printed task lines, all four
ordered transformations, both requests and all other tasks unchanged.
The cap1 contract requires superscripts in LaTeX. This is not a new
footnote, subpart, answer or mathematical correction. No repair was made.

### U33: Function-name codepoint in tasks64/65

Stable locations: `p0033#8` and `p0033#9`; stored text uses `$v(x)=...$`
in both. The pre-author freeze identifies the same lowercase v-like glyph
on both source tasks, but does not distinguish Latin v from Greek nu.
The paired shape/case and every following mathematical token match; no
transformation calculation was used to infer a function name.

Current author notes do not explicitly record this particular v/nu limit.
It remains an identification UNKNOWN, not a confirmed wrong formula and
not a reason to switch both symbols by intuition. Record the provisional
codepoint and this uncertainty in notes if the parent requests metadata
repair; do not silently normalize it or claim that this review resolved it.

### U34: Exact 需/须 glyph

Stable location: `p0034#4`, third stored/printed line:

```text
在我们来说明，上面的一般性结论无需烦琐的计算就可以证
```

My original-first R11 leaves 需/须 unresolved at precisely this word.
The author selected 需 without an explicit note for this bounded unknown.
All surrounding characters, the row break before `明.`, and all mathematics
match the freeze. There is no independent basis here to certify 需 or to
replace it with 须. This is not a newly discovered mathematical erratum.

Carry this as a text-glyph UNKNOWN, with a faithful provisional-reading
note if the parent requests it. No original was reopened to guess the
glyph, and this report gives no unconditional full-text approval at U34.

## Frozen Inputs and Method

StageA, preserved unchanged:
`tmp/source-review-10c-p31-p34-source-first.md`,
24235 bytes,
SHA-256 `8448093d5ad4901f8f7ce4bcec54a3fab9bfe57f9897f50e9d57c44b458973ca`.

Disclosed author report:
`tmp/source-10c-p31-p34-author.md`,
13197 bytes,
SHA-256 `847597725430b68e88d478fcb171efa6e6d07d23753253450f3e7d42910717b5`.
Its retained evidence copy has the same hash.

Read the entire four current durable MD bodies/frontmatter, JSON meta/blocks,
audits, immutable author report, object-boundaries and actual first
command/stdout/stderr records. Reviewed each actual fig16-20 crop separately
at original detail. Expectations came from my pre-author freeze, not the
author's rows, prose or crop descriptions.

No original page or grid was visually reopened in StageB. No concrete
discrepancy required new full-page or exact-pixel viewing: F31/F33 are
decidable from the already frozen marker/typography observations, while
U33/U34 remain explicitly unresolved. Hashing existing PNG bytes is not a
second visual source inventory. No prior27-30 originals/crops or unrelated
author/reviewer/answer/choice material was read.

Read cap1 for same-print-row objects, superscript notation, actual formula
breaks and unknown-in-notes requirements. No production validator, counter,
prepare/finalize, vectorize, assemble, render, browser, service, DB, Git,
network, index or source/tool operation ran.

Read-only evidence commands used `cat`/`sed`/`nl`, `shasum`, `diff -u`,
inline Node `fs.readFileSync`/JSON/crypto/Buffer equality, and the existing
Python/Pillow for crop dimensions and decoded crop-pixel hashes only.
These are evidence reads, not another source gate or expected-row generator.

## Whole-Page Text, Math and Object Comparison

### Physical31 / Printed25

Seven JSON objects exactly match the independently frozen source inventory:
fig16, cap16, fig17, cap17, four-row paragraph, two-row paragraph, footer25.
The MD headers/body and JSON kinds/labels/lines agree throughout, including
empty fig lines and separate textual captions. Both graph objects have no
invented exercise owner. No task, title, table or teaching footnote is lost.

Outside F31, all six printed explanation rows match, including the real
separate `$y=\cos x$` row; the third-rule reference; `$Oy$`; the literal
`$1:\frac{1}{\omega}$`; `$\cos\omega x$`; right for `$\varphi<0$`, left for
`$\varphi>0$`; absolute displacement `$\frac{|\varphi|}{\omega}$`; and final
`$\cos(\omega x+\varphi)$`. Tall fractions stay within their actual rows.
No coefficient/sign/absolute-value bar is missing or corrected.

My independent decomposition remains6 explanatory rows +2 caption rows
+1 footer =9. The first actual audit also has9/9, but its character FAIL
remains. This agreement is not the reason for the independent content finding.

The two complete sentences have their source periods, and no artificial
empty `p cont` is present. The broader triangle-delimited explanation
continues into32. Figures16/17 belong to physical30's frozen example2
references, not new written exercises on31.

### Physical32 / Printed26

Eight objects match completely: paragraphs of2,3,5 printed rows;
fig18/cap18; fig19/cap19; footer26. The closing
`$\blacktriangleleft$` remains on the second row of the first paragraph,
after the period, not another object/row.

Every original literal transformation is retained:
`$Ox$`, `$k=\frac{1}{A}$`, function(1), `$Oy$`,
`$1:\frac{1}{\omega}$`,
`$\vec r\left(-\frac{\varphi}{\omega},0\right)$`,
and the distinct later ratio `$1:A$`. Those distinct source forms have
not been silently made equivalent by a mathematical rewrite.
The third summary step breaks before `$Ox$` on the actual next print row.

Worked example3 retains `$y=3\cos(2x+4)$`, all five printed rows, and all
three steps in order: ratio `$1:\frac{1}{2}$` with figure18; translation
`$\vec r(-2,0)$` with figure19; ratio `$1:3$` with figure20. Vector arrows,
minus signs, coordinates, figure references and punctuation roles remain.
It has not been converted to a written task or supplied an answer.

The independent row decomposition10+2 captions+1 footer =13 matches the
retained first13/13 record. The actual text concludes normally, while
figure20 remains a delayed apparatus reference until33. No false empty
open/cont fragment or exercise ownership has been added.

### Physical33 / Printed27

Thirteen objects match the full inventory: fig20/cap20; three-row exhead;
nine independent tasks60-68; footer27. The common two-row question after
`习题` is complete, including its `函` / `数的图象？` print break.

Tasks60-67 preserve all eight separate identities and their mathematical
occurrence order:

| Task / stable block | Stored source math, compared to freeze |
| --- | --- |
| 60 /p0033#4 | `$f(x)=\sin2x$` |
| 61 /p0033#5 | `$f(x)=\cos\left(\frac{1}{3}x\right)$` |
| 62 /p0033#6 | `$g(x)=4\sin x$` |
| 63 /p0033#7 | `$g(x)=\frac{2}{3}\cos x$` |
| 64 /p0033#8 | `$v(x)=\sin\left(x+\frac{\pi}{2}\right)$`, name limited by U33 |
| 65 /p0033#9 | `$v(x)=\cos(x-3)$`, same name limited by U33 |
| 66 /p0033#10 | `$F(x)=2\cos(3x-2)$` |
| 67 /p0033#11 | `$F(x)=\frac{1}{2}\sin(2x+5)$` |

Right-column61/63/65/67 alone have `samerow=true`; all other task first
rows are not marked samerow. Thus the eight tasks correctly preserve four
actual horizontal rows, not eight. All original task-terminal periods
remain outside the inline mathematical expressions in the transcription.

Task68 is four complete printed rows. Apart from F33, it retains the source
`y=cos x`, four ordered actions
`1:\frac{1}{4}`, `\vec r(\frac{1}{2},0)`, `1:5`,
`\vec r(0,-3)`, the split before `的比例压缩`, and BOTH requests
`得到什么函数的图象？` and `写出这个函数.` No result was derived or
substituted for either request.

Independent row decomposition1 caption+3 heading/common+4 paired task
rows+4 task68 rows+1 footer =13. The first13/13 mechanical result cannot
approve the baseline star discrepancy or recover the U33 font codepoint.

Figure20 precedes the exercise heading and closes example3's apparatus,
not an inferred owned exercise diagram. All nine tasks end here; no open
task is carried into34. No missing teaching footnote was found; the raised
star is task notation, not a new footnote invented by this reviewer.

### Physical34 / Printed28

Seven objects match: new h3 heading82, five paragraph/formula objects, footer28.
There are no source figure/caption/task/teaching-footnote objects to hide.

The complete prose through the final reference to70 matches all definite
frozen characters and source row breaks, with U34 the sole unresolved
text glyph. References260 and70 remain literal prose, not newly claimed
tasks/answers. Equation tags(1)/(2) and their periods remain.

Full math identity comparison:

- Equation(1) retains distinct `A_1/A_2`, `\omega_1/\omega_2`,
  `\varphi_1/\varphi_2`, both cos terms and their sum.
- Same-frequency conclusion retains `\omega_1` and `\omega_2`, equation(2)
  `$f(t)=A\cos(\omega t+\varphi)$`,
  `$\omega=\omega_1=\omega_2$`, all four named constants and `A,\varphi`.
- Both `f_1(t)`/`f_2(t)` definitions use the common unsubscripted `\omega`
  exactly as frozen. They share one display row.
- Both double-prime equations, their minus signs, all subscripts and the
  comma remain; they also share one display row.
- `$k=\omega^2$` occurs both where originally printed, not substituted for
  a frequency or augmented by a new sign/positivity condition.
- The sum `$f=f_1+f_2$` and the whole following derivation retain every
  equality, double prime, coefficient, minus sign, bracket and terminal comma.

Exact actual single-break identity in MD AND JSON:

```text
$f''(t)=f_1''(t)+f_2''(t)=-kf_1(t)-kf_2(t)↵=-k[f_1(t)+f_2(t)]=-kf(t)$，
```

It is stored as one complete formula with exactly the frozen break before
the continuing equals sign. The proof object has four stored MD/JSON lines
representing five printed rows; the freeze already distinguished this from
the single-row paired definitions and tall fractions. No count script was
run to construct this expectation.

Independent decomposition1 heading+22 prose/formula rows+1 footer =24
matches the retained first24/24. The differential-equation proof and final
two-row conclusion are complete on this page. The new82 unit begins here,
but its continuation beyond34 is unobserved and NOT declared complete.

## Actual Whole Crop Review and Geometry Binding

Each actual crop was opened separately once for this StageB, at original
detail, under `.tmp/ld-s10y-lesson/10c/pages/NNNN/figures/`.
All five current raw crop files are byte-identical to the evidence
`pNNNN/after/crops/` copy. All figure IDs/labels/snapped boxes agree between
MD block heads, JSON meta.figures, JSON fig blocks and audit.figures.
Rough-to-snapped geometry is recorded below, not silently treated as a
hand-measured exact source box.

| Figure/page | Author rough [x,y,w,h] -> actual audit ink box | Actual RGB PNG dimensions | Crop verdict |
| --- | --- | --- | --- |
| 16/31 | [230,280,1250,350] -> [240,294,1212,321] | 1236x345 | PASS |
| 17/31 | [470,720,790,865] -> [477,731,780,841] | 804x865 | PASS |
| 18/32 | [200,1295,1135,300] -> [217,1306,1096,268] | 1120x292 | PASS |
| 19/32 | [130,1790,1280,345] -> [142,1799,1238,317] | 1262x341 | PASS |
| 20/33 | [270,290,1180,650] -> [274,302,1167,620] | 1191x644 | PASS |

Actual image width/height are each24 pixels larger than the stored ink-box
width/height, consistent with12-pixel padding on each side. Do not call
the PNG dimensions the ink box or report that padding as missing source ink.
No crop was regenerated, edited, promoted or compared by a new renderer.
No new exact pixel-to-source-region equality test is claimed; source-file
identity, actual audit geometry, immutable crop bytes and direct whole-crop
observations provide the reviewed binding.

- Fig16: whole solid broad `y=cos(x/2)` and dashed `y=cos x`, shared crest,
  all finite ends/dashed lobes, axes/arrows/negative vertical continuation,
  x/y, oval origin and -pi/pi/2pi retained. No crest1 or new point label.
- Fig17: whole five-crest/four-trough solid `y=cos20x`, broad dashed
  `y=cos x`, both labels, axes/arrows/negative vertical extent, x/y,
  oval origin, -1, pi/10 and pi/5 retained. The dense line is not cropped
  to only a few periods; neither style is dropped.
- Fig18: complete faster solid and slower dashed traces with their outer
  portions, axes/arrows/negative vertical extent, y, oval origin, pi/2pi
  and `y=cos2x`. No x letter, -pi, crest1 or extra dashed-function label
  was introduced. The absence of those source labels is not crop damage.
- Fig19: complete solid and same-frequency dashed traces, all ends and
  lobes, axes/arrows/x/y/oval origin, `y=cos(2x+4)`, and the actual -2
  label with its vertical dashed crest guide. No pi tick or inferred
  dashed-function label was added.
- Fig20: complete four positive crests/four negative troughs and finite
  ends of the large solid trace; all lower-amplitude dashed lobes;
  axes/arrows/x/y/oval origin; `y=3cos(2x+4)`; height3 and its horizontal
  dashed guide; left positive crest's vertical dashed guide. The latter
  guide is unlabelled here: -2 was NOT imported from fig19. No -3,
  numerical period, new disks or extra reference-function label.

All separate source captions remain text outside the image domains. No
body/task/footer/caption is trapped in these crops. Small scan specks within
the original crop pixels remain rather than being cleaned or reinterpreted.
Oval origin glyphs remain literal pixels with O/0 codepoint uncertainty,
not mathematically inferred zero labels.

| Figure | PNG bytes | Raw SHA-256 | Decoded RGB pixel SHA-256 |
| --- | ---: | --- | --- |
| 16 | 8804 | `31a56cd4f038577c8d24ce43ce1c2888c2e1aecd45183008cda39cdbe79577bd` | `5e18484df61f995442cc156d11cea138e3bd08b04162d20c2d5a96d572381fb3` |
| 17 | 15210 | `2635c2d39c0b80b6e232ce9716e668a6a7d28f0ec5d1e94ac489bb7e4a7b148b` | `a9872efd72262d6f395069a032acf400829855d4082a411b57109f7cfdc2254d` |
| 18 | 8827 | `128bc913f07c26f427d77d931f0810df6ac01b908f6701372c868e53e973118e` | `dd0af8c68d8a903f5d278a332c3aa110fcbcd1447ffdcef735a7d5fd46c7f0e5` |
| 19 | 10825 | `0cbcd58f36f0eb90c458e5cb63da16c16e20e1d32f2ce7b9bc17994530641cdc` | `b55099d590d1752cb3a78d42822366db82a02841fe558d5607787efcaee1ffea` |
| 20 | 14764 | `458541c1db6511f9532eeccd1692304e9027c082eb89aab00b85d8a8c167321a` | `a3fb3fc47092224ba6aa601a9109d574722f3e8994bde7af53ddf4b5a3238f87` |

Pixel hashes are read-only SHA-256 of `Image.tobytes()` in the stated RGB
mode and dimensions, without conversion/overlay/new crop generation.

## Current Source and Durable Binding

Every current original PNG byte hash equals the pre-author frozen hash and
the retained `before/page.png` bytes. The original RGB1695x2580 pixel hashes
below are reused from StageA, not a repeated visual source read.

| Page | Current PNG bytes / raw SHA-256 | Frozen RGB pixel SHA-256 |
| --- | --- | --- |
| 31 | 58359 / `b2856ca9834afd57d5601063a70542c97622853e8523509825660a09763ab925` | `2fb17beccb6ff153cb13d01d3923352229711101667568ec54b2b90f5c3da2ec` |
| 32 | 72920 / `e39cf79620b4dc3893705be0518cf6a8829dd109b2d59a99224687f31804bcce` | `50f1a935a2cf6e362a4a1b32369a9f40794a9f763f48748fb35f6d7bba668719` |
| 33 | 66679 / `1c33b9c2eb95900dd1077b31011517f5dbf06922371aaf2955fc1ac3c4c75c35` | `1df63797ccf00a1c50c162b1fb5baf8ae3a2b5a7f1952ef319e2c9190e22a070` |
| 34 | 82052 / `a222c82da6a63df836b245a25c8075fe03f5c20ec538aaa9d61f33d80e61d1de` | `86abe74d768b2d36f47cb70555d0a265db30e4c532e14e68c4c9ff6f5d4cf1a6` |

All MD frontmatter parses equal to JSON meta. Source.pdf/source.pdf_page,
printed folios, dimensions, dpi and render SHA agree throughout.
The common PDF binding is
`47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`.
This review did not reread/re-hash the PDF and does not claim a new PDF
identity audit. The profile binding is
`dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`.

All12 current durable files below are byte-identical to retained first
`after/` snapshots; this includes the failed31 audit, not just passed files.

| Page | File | Bytes | Current raw SHA-256 |
| --- | --- | ---: | --- |
| 31 | page.md | 2695 | `2bdfd23268db2c253d5e103b5cad5ca635bff5b0988381677c8f921befd5ffc3` |
| 31 | page.json | 4235 | `d20b1080f9ff06bfdb5d52e4a41d2e33f56dbf7781aef24db15604d07cd2db2e` |
| 31 | audit.json | 870 | `1ba56035250e597c150143a6a10d9345bbf91aa6d67c7d2e8f4b95f9eb68e062` |
| 32 | page.md | 3107 | `587f2780ace9f893e11c231c92de84bf0a806fff10d79f32756e02f41bb4b903` |
| 32 | page.json | 4871 | `76d68f1c9e19cb7f59b0e2533c90337fe00ba596eba25abd476ffd93a04765b6` |
| 32 | audit.json | 681 | `af2bc4f80101fb2bcc395257380819a53eb3f3ad9677dd8fb491adc3c3089d39` |
| 33 | page.md | 2844 | `4158fecf2ce0c793338a273d6a431252e88842382b5b6fc76cf395c09b6d5620` |
| 33 | page.json | 5465 | `8aa6a23f1f73281e81890fc3671a2624b0693662acb7064a70c9e8bbea1439b7` |
| 33 | audit.json | 441 | `7bfd1c95d2569330993b7b69ed30b783b774a5aae33e8e794a4536c046e67ccd` |
| 34 | page.md | 3257 | `0defdfb0204d514223fc5aedf979b4371dd0569d424d879a55ab579a31c7d21e` |
| 34 | page.json | 4893 | `e6a1fa4c5e0817d657cddd0d7c9d2d0d5e83b9fa8b4faa873299313ddef48081` |
| 34 | audit.json | 203 | `9efc1a89d59c7c26d55d31693e920ef885e412b4e1a6e3d12a83af3ad44bde6a` |

The full initial-author MD body is not byte-equal to the current body on
31/32/33: actual `diff -u` shows only official snapped fig block boxes and
inserted image links in those bodies. The34 body is byte-equal. Across all
four before/current diffs the frontmatter also gains actual printed_lines,
figures and provenance. No prose, formula, task, note, original source
binding, caption or footer changed during that first finalize. The
initial body-equality false observations are disclosed rather than called
evidence of text loss; full diffs explain them.

## First Actual Gate Evidence, No Rerun

The retained commands all name the existing
`.claude/skills/ld-s10y-lesson/.venv/bin/python -B`
and `tools/p2c.py finalize --book 10c --page N`.
Each command record has `run_count:1`, no signal/error, exits1/0/0/0.
No command was executed by this reviewer.

| Page | First stdout bytes / SHA-256 |
| --- | --- |
| 31 | 234 / `40e7e7f6bdee1d09a8a94ea7e03abf7a9fae3f12f212d41f0187a6ad3c0e6c12` |
| 32 | 222 / `300ab2b7ba6b25dd2c52f05b5a00ad55b77d7a46e0c28f1137657fb3e925c829` |
| 33 | 176 / `70d8df860eb90c56212a25a4f981d49b76c31b54db8ef89d3ff89fcef84c1544` |
| 34 | 130 / `2b122d7d0ea0c06ea9169903b7cd66d0d8acf87e9e360c0d916d6a5b996774bc` |

All four stderr files are empty with SHA-256
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
All audits retain `normalizations:[]`, `katex_warnings:[]`, errata0,
`count_exclusions:[]`. Only31 has the unknown-char entry/error:

```text
白名单外字符 1 处: ►(U+25BA)
```

Its audit's `p#5` maps unambiguously to stable `p0031#5`. The original
failure audit/stdout/exit and source bytes remain intact. There was no
counter/expectation repair, deletion, padding, new exclusion or whitelist
change. First32/33/34 PASS is mechanical evidence, not an independent
decision about source glyphs or a complete lesson release.

Evidence metadata raw bindings:

- `object-boundaries.json`:10508 bytes,
  `6d434b7434322d13c9f6e4e8b85eb363eacb4d976bcc1abfc4ad22f807340d95`.
- `page-bindings.json`:8495 bytes,
  `38f158fe79fb145e28933e37e83752b773d29a51909e6ffbcd39058830f60b39`.
- `immutable-manifest.json`:12813 bytes,
  `399112fe08e18d7c723a6455e25ec33156b4b27f75d62145b9bb07921fb2dc7c`.

Object-boundaries agrees with the fully read current blocks, but its line
counts were not my source expectations. No broad traversal of preparatory
grids/templates or unrelated evidence was performed to certify the manifest.

## Boundaries, Remaining Limits and Stop

Observed apparatus links close faithfully:
physical30 frozen example2 references ->31 figures16/17;
31 triangle-opened explanation ->32 left marker;
32 example3 figure20 reference ->33 actual fig20;
33 complete tasks60-68 ->34 real new-unit82 heading.

All current blocks have `open=false` and `cont=false`; no incomplete
sentence/formula/task or inserted empty fragment contradicts that on these
four pages. Only right-column61/63/65/67 use samerow. Source captions/footer
remain separate and complete. Unit82 beyond34 remains unobserved/open at
lesson scope, not a completed batch/card. Earlier26 notation and55/A-above
unknowns remain unchanged and outside this review.

Only definite needed repairs are F31's same-row filled right-marker
representation and F33's task-star superscript/baseline-period typography.
U33/U34 require honest uncertainty handling, not a guessed mathematical or
word substitution. No new definite missing prose, altered mathematical
identity, cropped apparatus or false page boundary was found. All five
actual crops PASS once; do not redo them for these text-only findings.

Only this scratch report was created with apply_patch. The original-first
freeze and author evidence remain unchanged. No official review record,
promotion, source/JSON/audit repair, tool/index change or subsequent page
work occurred. STOP after this immutable review; any repair and affected-only
follow-up requires parent authorization.
