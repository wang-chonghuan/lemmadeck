# STEMROBIN-184: 10c Physical54/55 Original-Only First Author Report

## Status and Scope

Source authorship only. Physical54 FIRST finalize exited 0; physical55 FIRST
finalize exited 1. The batch is **not globally PASS**. All pipeline operations
stopped at that first finalize failure. No retry, repair, reprepare, vectorize,
assemble, adaptation, render, validation, publication, DB connection, deployment,
Git write, ticket update, chat operation, plan update or usage update followed.
The only post-failure work was preservation, read-only inspection of this author's
own audit/page JSON, and production of this evidence report/manifest.

Authorized cwd:
`/Users/yong/.codex/worktrees/a07e/lemmadeck`.

Evidence root, abbreviated E below:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p54-p55-author-evidence`.

Durable page root, abbreviated D below:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages`.

Prepared source root, abbreviated W below:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/10c/pages`.

Ownership was limited to new source authorship in D/0054 and D/0055 and files
under E. App code, pipeline modules, other source pages, others' edits and existing
evidence were not changed or reverted. Both durable directories were absent before
this authorship. Each complete page.md was created once with apply_patch. FIRST
finalize alone subsequently rewrote that page's frontmatter/figure metadata and
generated its page.json/audit.json. No source write occurred after the failure.

Read instructions: `.intentfold/readme.md`, project.json,
engineering/operations/product including their Redlines, lesson SKILL.md and image
SKILL.md image-batch rules. Exact policy bytes are retained in E/policy-bytecopies.
No IntentFold workflow invocation was made. The 6g capture-script implementation
was read as a mechanical evidence-recording reference only; its authored mathematics
and all prior author/reviewer mathematics were not read.

## Source Isolation and Budget

Prepare54/55 had already run ONCE0 according to the user's authorization. No
prepare was observed or run in this turn, and it was never repeated.

Only W/0054/page.png and W/0055/page.png originals were read, separately and at
`detail: original`. The already prepared page55 grid was read only to locate
figure boxes. Four crops were made from the original PNGs with recorded source
hashes, boxes, complete commands and exact output hashes. No PDF pages were rendered
or visually loaded; finalize's internal source binding/hash is not new source
authorship evidence.

Actual image-load ledger:

| Load | Source | Detail | Purpose |
|---|---|---|---|
| 1 | W/0054/page.png | original | Complete physical54 original-only reading |
| 2 | E/crops/p54-inequalities.png | original | Slanted inequality glyphs |
| 3 | E/crops/p54-final-set-glyph.png | original | Independently observed bold inclined Z |
| 4 | W/0055/page.png | original | Complete physical55 original-only reading |
| 5 | W/0055/page.grid.png | original | Figure positions, not mathematical truth |
| 6 | E/crops/p55-fig32.png | original | Figure32 labels and stroke inventory |
| 7 | E/crops/p55-fig33.png | original | Figure33 labels, guides and marks |

Budget: **7/8 batch loads; 7/24 context loads; 0 prior images; 0 reopens**.
One batch only. W/0054/page.grid.png was retained byte-for-byte but not loaded.
Generated finalize crops were retained and hashed, not reopened. No image payload
is included in the response or report.

RAW source bindings:

| Source | Bytes | SHA256 |
|---|---:|---|
| W/0054/page.png | 65863 | `38b0ff3372a6b6d7a6773334dae2caaaad920118acd515e4e9eea3fd66b7d5f7` |
| W/0055/page.png | 82462 | `d6dc690b00c551b7c15c7392b574a0a62ac304c02aa33bfaec74e237eac1e7c4` |
| W/0055/page.grid.png | 104768 | `784a912e1ce866fec12510122357f4c976ae4ba2078d96c96bf384d7fac107ae` |

Every original grid, RAW, layout and template, including physical54's unopened
grid, is retained in E/targetbefore/work and again in every subsequent complete
snapshot. Their complete hashes, sizes and filesystem metadata are in the phase
metadata and manifest. The original prepared dimensions are 1695 x 2580 at 300 dpi.

## Continuation and Boundaries

The only prior source context is the user-supplied unit identity
`ana10-c6-s3-n86`, OPEN, body-only worked examples, and this prior final literal:

```text
$\arccos 0=\frac{\pi}{2}$，因为$\cos\frac{\pi}{2}=0$，
```

That literal was not copied into physical54. Its first actual row starts `而且`.
All glyphs and notation on physical54/55 were read independently from their own
pixels. No preceding images or authored mathematical text were consulted.

Neither physical54 nor physical55 has an h1/h2/h3 heading. No TOC lookup was
therefore made; no later identity, content, page range or right boundary was
inferred. The unit identity above remains user-supplied, not a newly claimed TOC
boundary.

Physical54's first block is `p cont`, closing the incoming source paragraph at
row3. Its last a=1 paragraph ends with a printed period and is not falsely marked
as an unfinished paragraph; the unit independently remains OPEN. Physical55's
a=-1 case starts a visibly new paragraph in that same unit. Physical55's ten-row
general-case paragraph is `p open`, ending literally `现在，为了写出方`.
Figure33/caption/footer are transparent to that unfinished body object. No
following character, word, paragraph, heading or physical56 pixel was read.

## Complete Physical54 Rows

All rows below are complete authored source strings, not corrected mathematics.
One numbered row corresponds to one printed row. Formula subexpressions share
their original single row. There are 22 body rows and one footer row, in nine
blocks; no caption, figure, exercise head or exercise block.

| Block | Kind/Flags | Rows | Ownership |
|---|---|---|---|
| 1 | p cont | 1-3 | Incoming body paragraph of ana10-c6-s3-n86 |
| 2 | p | 4-5 | Body explanation of two tables |
| 3 | p | 6-12 | Body angle/radian formulas, not tasks |
| 4 | p | 13 | Body-only worked example label 例 1 |
| 5 | p | 14-16 | Worked example calculations in body |
| 6 | p | 17-18 | Body equation and same-row equation tag |
| 7 | p | 19-20 | Body; references 图 32 |
| 8 | p | 21-22 | Complete a=1 body paragraph; unit OPEN |
| 9 | foot | 23 | Printed page number |

```text
01 而且　$\frac{\pi}{2}\in[0,\pi]$；
02 $\arccos\left(-\frac{\sqrt{2}}{2}\right)=\frac{3\pi}{4}$，因为　$\cos\frac{3\pi}{4}=-\frac{\sqrt{2}}{2}$，
03 而且　$\frac{3\pi}{4}\in[0,\pi]$.
04 求带有四位小数的 $\arccos$ 函数值，要利用两个表：用度
05 表示的角度的余弦表和把角度的度数换算成弧度的表.
06 为了求出 $\arccos x$，在 $0^\circ\leqslant\alpha^\circ\leqslant180^\circ$ 范围内求出角度
07 $\alpha^\circ$，使得
08 $\cos\alpha^\circ=x$；
09 把 $\alpha^\circ$ 表示成弧度：
10 $\alpha^\circ=y$ 弧度.
11 得到
12 $\cos y=x$，$\arccos x=y$.
13 例 1　求 $\arccos 0.8746$.
14 $0.8746\approx\cos29^\circ$，
15 $29^\circ\approx0.5061$ 弧度，
16 $\arccos0.8746\approx0.5061$.
17 现在说明怎样借助引入的反余弦函数解最简单的方程
18 $\cos x=a$.　（1）
19 因为 $-1\leqslant\cos x\leqslant1$，那么当 $a>1$ 和 $a<-1$ 时，方程（1）
20 无解（图 32）.
21 当 $a=1$ 时，方程（1）有解.
22 $x=2\pi k$，$k\in\boldsymbol{Z}$.
23 48
```

The source y-band for every row is preserved in E/author-observations.json and
E/author-inventory.json. All `samerow` flags are false. Row18's right-hand `(1)`
is part of its formula row, not a second block or a second counted row. The two
filled bullets flanking footer48 are source-visible decorative glyphs recorded
here and in the footer inventory, not mathematical punctuation or extra rows.

## Complete Physical55 Rows

There are 12 body rows, two caption rows and one footer row, in seven blocks. The
two figures are body illustrations, not exercises. No h1/h2/h3, exhead or ex exists.

| Block | Kind/Flags | Text Rows | Ownership |
|---|---|---|---|
| 1 | fig 图 32 | none | Body figure, referenced by physical54 row20 |
| 2 | cap 图 32 | 1 | Separate caption row, outside figure crop |
| 3 | p | 2-3 | New body paragraph, a=-1 case |
| 4 | p open | 4-13 | General-case body paragraph, unfinished at 方 |
| 5 | fig 图 33 | none | Body figure referenced at row6 |
| 6 | cap 图 33 | 14 | Separate caption row, outside figure crop |
| 7 | foot | 15 | Printed page number |

```text
01 图 32
02 当 $a=-1$ 时，
03 $x=\pi+2\pi k$，$k\in\boldsymbol{Z}$.
04 为了求出当 $|a|<1$ 时方程（1）所有的解，只要在长度为
05 $2\pi$ 的任一闭区间上，求出这个方程所有的解就行了，因为余
06 弦的周期等于 $2\pi$. 由图 33 可以看出，取闭区间 $[-\pi,\pi]$ 比
07 较方便. 实际上，在闭区间 $[0,\pi]$ 上，余弦是下降的，并且取
08 它的每一个值一次. 而在闭区间 $[-\pi,0]$ 上，余弦是上升的，
09 并且也取它的每一个值一次. 于是，在这两个闭区间的每一
10 闭区间上，方程（1）有一个解. 根据定义，在闭区间 $[0,\pi]$ 上，
11 方程（1）的解是 $\arccos a$. 由于余弦函数是偶函数，在闭区
12 间 $[-\pi,0]$ 上，方程（1）的解等于 $-\arccos a$. 因此，在闭区
13 间 $[-\pi,\pi]$ 上，方程（1）的解是 $\pm\arccos a$. 现在，为了写出方
14 图 33
15 49
```

Every `samerow` flag is false. Both `owner_exercise` fields are null, intentionally:
these are body figures owned by ana10-c6-s3-n86. Captions remain separate cap blocks.
No textual crop was converted into a figure; no displayed math row was replaced
by an image. Footer49 has two visible filled decorative bullets, recorded in the
inventory but not as additional text rows.

## Glyph, Math and Emphasis Inventory

The row strings above expose every transcribed body/caption/footer glyph and
mathematical span. E/author-inventory.json additionally records **each encoded
Unicode glyph in order with its codepoint and position for every row**, every
math span with its exact literal and LaTeX commands, all block flags/boxes/owners,
full frontmatter, full audit, row SHA256 and all target variants. The manifest
includes that entire inventory, not merely a path to it. This is serialization
of this author's own retained source records, not independent review, mathematical
validation or an assertion that any unknown source glyph is resolved by code.

Physical54 math variables: x, y, a, k, heavy inclined uppercase Z. Greek source
glyphs: pi and alpha. Operators/glyphs: arccos, cos, equality, minus, membership,
slanted less-than-or-equal, strict greater-than/less-than, approximate equality,
fraction bars, radicals and degree superscripts. The inequalities at row6 were
read in the dedicated crop; `\leqslant` was used rather than borrowing prior
notation. Row19's slanted source signs were read in the physical54 original.
Radical2, fractions pi/2, 3pi/4, negative radical2/2 and parentheses retain their
source arrangement.

Physical55 math variables: a, x, k, independently observed heavy inclined Z;
Greek pi. Source operators: minus, plus, equality, membership, absolute-value
bars, strict inequalities and plus-or-minus. All visible intervals are closed
square-bracket intervals, not reinterpreted open intervals. No hidden or inferred
interval endpoint, integer bound or later solution formula is inserted.

Both pages' final Z glyphs are heavy and inclined uppercase serif forms. Encoding
is `\boldsymbol{Z}`, not an inferred `\mathbb{Z}`. The physical54 dedicated crop
retains the exact source appearance; physical55's own original independently
supplies its glyph. Any fine typographic correspondence beyond visible bold/
inclined appearance is not a mathematical claim.

Numeric lexemes on physical54 include 0, 1, 2, 3, 4, 180, 0.8746, 29, 0.5061,
32 and 48. Physical55 includes -1, 1, 2, 0, 32, 33 and 49. No rounding, evaluation
or source-number replacement was performed.

Sentence-final source dots use ASCII `.`; Chinese commas, colons, semicolons and
reference parentheses use fullwidth punctuation. Interval commas and math
delimiters are ASCII in math. Degree signs are encoded as `^\circ`, Greek letters
as math macros, minus as ASCII `-`, and fractions as `\frac`. No superscript Unicode
replacement, invented equation, guessed missing glyph, CJK text inside math or
cross-line `↵` was supplied. Layout gaps use U+3000 where aligned; ordinary spaces
at inline math/CJK boundaries are encoding/layout choices, not claimed exact
typographic advance widths.

`例 1` is a visible body-only worked-example label. No semantic bold prose spans
were independently distinguishable and asserted. The only encoded mathematical
bold emphasis is Z. No heading, question object or exercise numbering was invented.

## Complete Figure32 Source Inventory

One subfigure: an unframed coordinate plot. It contains one heavy cosine-shaped
wave, the horizontal x-axis with a right arrow, vertical y-axis with an upward
arrow, two bounding/extreme horizontal lines and two additional out-of-range
horizontal levels. There is no table, lattice, printed curve equation, named
point sequence or curve arrowhead.

Every visible label:
`y`, `x`, `0`, `1`, `-1`, upper `a`, `a>1`, lower a-like glyph read `a`,
`a<-1`, `-2\pi`, `-\pi`, `\pi`, `2\pi`, `3\pi`.
Caption `图 32` is outside the figure, a separate row.

Approximate original-pixel structure, not newly measured exact coordinates:

| Feature | Visible Position/Relation |
|---|---|
| y-axis | x about741, upward arrow near y282, continues to about676 |
| x-axis | y about486, right arrow; gap around x920-941 |
| upper out-of-range level | y about371; a and a>1 printed above it |
| upper extreme level | y about408, label1, touches three visible maxima |
| lower extreme level | y about563, label-1, touches three visible minima |
| lower out-of-range level | y about622; a and a<-1 below it; gap x824-850 |
| visible wave maxima | approximately (272,409), (741,408), (1207,410) |
| visible wave minima | approximately (505,563), (974,561), (1441,559) |
| wave ends actually visible | approximately (228,423) and (1485,549); no extension |

All five vertical guides are inventoried independently: at -2pi, a mostly solid
trace from the left peak to the axis near x272; at -pi, a dashed/broken axis-to-
trough trace near x506; at pi, a thin broken axis-to-trough trace near x974; at
2pi, a dashed peak-to-axis trace near x1206; at 3pi, a dashed axis-to-trough trace
near x1440. Dark junction/curve ink is retained without manufacturing a named-
point list or a uniform dot-count assertion.

UNKNOWN: whether the gaps in the horizontal strokes are intentional breaks or
lost ink. UNKNOWN: whether the far-right small blob is a deliberate mark or
irregular source ink. No endpoint semantics, missing label, regularization or
erratum is inferred.

Original rough box `[210,270,1300,420]`; FIRST finalize snapped
`[223,272,1277,406]`, reporting 61 components. No caption ink was included in the
rough image box. The source-only inspection crop retained the original 1300 x420
pixels; the finalize crop was retained but not visually reopened.

## Complete Figure33 Source Inventory

One subfigure: unframed coordinate plot with one continuous heavy cosine-shaped
wave, an x-axis with a right arrow, a y-axis with an upward arrow, upper and lower
horizontal levels, broken/dashed projection guides and dark axis dots. No table,
regular lattice, printed curve equation, curve arrow or named point label exists.

Every visible label:
`y`, `x`, `0`, `-\pi`, `\pi`, upper a-like glyph read `a`, `0<a<1`,
lower a-like glyph read `a`, `-1<a<0`.
Caption `图 33` is a separate row, outside the figure.

The repeated upper/lower a-like labels are preserved as observed. In particular,
no visibly absent minus was inserted in the upper label. UNKNOWN whether this
repetition expresses an intended convention or a source-visible defect; no
mathematical erratum is asserted.

The y-axis is near x753 and continues from its upward arrow below the lower level.
The upper level runs approximately (183,1933) to (1401,1945); the lower level
approximately (187,2039) to (1433,2052). Source horizontal strokes are slightly
sloped and uneven, not regularized. The visible wave has three maxima around
(278,1908), (753,1912), (1214,1918), and two minima around (516,2065), (984,2074).
Its actually visible ends are around (188,1948) and (1458,2076); no further curve,
period, endpoint or crossing is inferred.

Every projection guide or central mark is retained:

| Stable Source ID | Approximate x / Position | Pixel Observation |
|---|---|---|
| f33-upper-left-1 | 216 | Dashed upper crossing to filled x-axis dot |
| f33-upper-left-2 | 343 | Dashed upper crossing to filled x-axis dot |
| f33-lower-left-1 | 453 | Filled x-axis dot, dashed guide down to lower crossing |
| f33-trough-mpi | 516 | Dashed guide toward left trough; -pi label |
| f33-lower-left-2 | 577 | Filled x-axis dot, dashed guide down to lower crossing |
| f33-upper-center-left | 688 | Dashed upper crossing to filled x-axis dot |
| f33-y-upper-mark | (753,1935) | Dark upper-level/y-axis junction mark |
| f33-y-origin-mark | (753,1988) | Axis junction; printed0 beside it |
| f33-y-lower-mark | (753,2040) | Small ring-like/light-centered mark |
| f33-upper-center-right | 820 | Dashed upper crossing to filled x-axis dot |
| f33-lower-center-right-1 | 918 | Filled x-axis dot, dashed guide down |
| f33-trough-pi | 983 | Dashed guide toward right trough; pi label |
| f33-lower-center-right-2 | 1051 | Filled x-axis dot, dashed guide down |
| f33-upper-right-1 | 1170 | Dashed upper crossing to filled x-axis dot |
| f33-upper-right-2 | 1292 | Dashed upper crossing to filled x-axis dot |
| f33-lower-right-last | 1393 | Filled x-axis dot, guide to last visible lower crossing |

The upper level has six visible wave intersections; the lower level has five
within the actual source extent. These are source visual inventory counts, not
an equation-solution proof. No sixth lower intersection beyond the visible right
end is inferred. UNKNOWN mathematical open/closed-point meaning of ring/dot
appearances; only pixel appearance is claimed.

Original rough box `[170,1810,1340,350]`; FIRST finalize snapped
`[180,1809,1327,341]`, reporting 57 components and ownership
`snapped-components`, neighbours `[]`, 36540 owned ink pixels, owned-ink SHA256
`f3ef12e1519658cd9719d4d873661c845ae0451b15d33e7fc7a8c813de0ca2b6`.
This ownership metadata is the actual command output, not independent semantic
or geometric validation. The finalize crop was retained, not reopened.

## Crop Commands and Hashes

All four crop commands exited0, with empty stdout/stderr. The exact executable,
argument array, start/pending/end records and byte streams are in
E/commands/crop-*/. The source-only crop command was:

```text
<lesson-skill>/.venv/bin/python -B -c
'from PIL import Image; import sys; im=Image.open(sys.argv[1]); im.crop(tuple(map(int,sys.argv[3:]))).save(sys.argv[2])'
<original-page.png> <new-exclusive-output.png> left top right bottom
```

No source file was changed. No resizing, interpolation, thresholding, masking
or enhancement was applied. Bounds use original PNG coordinates.

| Crop | LTRB Box | SHA256 |
|---|---|---|
| p54-inequalities.png | [650,790,1080,880] | `771503e250de480faed3ab31294d84010c5272cd7bbe543e22d5e6badb4fd520` |
| p54-final-set-glyph.png | [535,2130,945,2240] | `8e06406f0e63da94e7472c51f901fd8bf6dd286f6c1518ebb88985dae3199326` |
| p55-fig32.png | [210,270,1510,690] | `c31a55ea2a07e646859ac1b32233622c6bde3f8def4e7ac7d486b1ed651ebd3f` |
| p55-fig33.png | [170,1810,1510,2160] | `147fe0de6dc9d906f4b53a1a3a1ac3aca5cdc09ffe22ad875f50eef3071e482c` |

For physical54 crops, the original source hash is
`38b0ff3372a6b6d7a6773334dae2caaaad920118acd515e4e9eea3fd66b7d5f7`.
For physical55 crops it is
`d6dc690b00c551b7c15c7392b574a0a62ac304c02aa33bfaec74e237eac1e7c4`.
Each crop JSON independently binds source hash, XYWH and LTRB, command and output.

## FIRST Finalize Commands and Results

The exclusive E/record.mjs recorder was created with apply_patch. It saved initial
complete target state and exact tool/runtime bytes before source writing, guarded
one finalize per page, and guarded against further pipeline calls after
E/firstfailure.json. No pipeline module was edited.

Both FIRST finalize calls used this executable:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`.
Both used `-B`, `shell:false`, cwd above, timeout120000ms and
`PYTHONDONTWRITEBYTECODE=1`. No secret environment values are recorded.

```text
-B /Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 54
-B /Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 55
```

Before each spawn, both entire target directories and work directories, exact
original SOURCE-MD for both pages, and all tool modules were copied. `start.json`
and `result-before-call.json` were written with pending exit/null state. Exclusive
stdout.bin/stderr.bin files were opened before the call. After return, exit,
signal/error, elapsed time and stream hashes were recorded, and complete target/
work/tool/SOURCE-MD snapshots were saved. All pending records remain retained,
not overwritten.

Physical54:

```text
startedAt 2026-11-16T13:06:17.950Z
endedAt   2026-11-16T13:06:18.389Z
elapsedMs 437.679917
exit      0
signal    null
error     null
[finalize] 10c p0054: 9 块 / 23 行（印刷 23）, 插图 0 张, 规范化 0 处
  ✓ 通过 行数对账 + 白名单 + 公式
```

Physical55:

```text
startedAt 2026-11-16T13:06:23.991Z
endedAt   2026-11-16T13:06:24.445Z
elapsedMs 452.9295
exit      1
signal    null
error     null
[finalize] 10c p0055: 7 块 / 15 行（印刷 17）, 插图 2 张, 规范化 0 处
    fig-32(图 32) → [223, 272, 1277, 406]
    fig-33(图 33) → [180, 1809, 1327, 341]
  ✗ 失败 1 项:
    - 行数对不上：印刷 17 行，块体 15 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```

Both stderr streams are empty. Both audits record normalizations0, no
unknown-codepoint entries, no KaTeX warnings, errata0 and count_exclusions[].
Those are the observed command fields, not proof that semantic UNKNOWNs,
source-visible defects or full author fidelity are independently resolved.

The failure's exact cause beyond the mismatch remains UNKNOWN. Physical55's
prepared layout contains top and bottom margin bands (0-18 and2479-2511), and
thin source-visible marks are in the original. They are **not** claimed to be
the independently confirmed cause of 17 versus15. No exclusion, blank row,
duplicate text, artificial ↵, omitted math or diagnostic rerun was added.

FIRST finalize still rewrote physical55/page.md and produced physical55/page.json,
audit.json and two work PNG crops before returning1. That entire failed state is
retained as-is. File existence and successful crop production do not confer PASS.

## Complete Before/After Records

All six snapshots contain both authorized target directories, all work files,
all target-before/after variants and exact tool/runtime bytes. Absence is
explicitly recorded, not represented by an empty invented page. Before-source
targetbefore records both durable directories and both SOURCE-MD as absent.

| Complete Record | SHA256 |
|---|---|
| E/targetbefore/metadata.json | `97175d947bdf0f811363b03ebcba4c1b564c4525c249da71da6ccfd9de9adaf9` |
| E/before-finalize-0054/metadata.json | `7455bde0a312c5d39f896b57ef09273732187eeaac41faee73b036fec1f3a0ac` |
| E/after-finalize-0054/metadata.json | `0aca7f41c4be8006d628982a851846392f5037710343b359920e062e21b886bd` |
| E/before-finalize-0055/metadata.json | `c837400a5f2918617c761520a78091746bab3b464d584c1e1ffbae431a38515d` |
| E/after-finalize-0055/metadata.json | `5539770d9ea0f843956b54ef13eb6f85556305a3956c8d05afd2f5323ec712eb` |
| E/targetafter/metadata.json | `c37130e2c06bfdd26db76318e7fe8820d9979b7cb1ea5b528dbc3525587eae07` |
| E/initial-bindings.json | `82ee45f83249e9ca985e46f725d3a37f86d8dd79f53ca84998a3969ca89ea0cc` |
| E/end-bindings.json | `46d5a8ddb13c4ee1cb5b08d1528d5c76e2f9fb6dd9d4c3b840768c973ca6be64` |
| E/firstfailure.json | `bd4886988ca778c46ca7f8a81628c74d63e8725eb76f5da55f75f1b24fcebb3a` |

Exact original SOURCE-MD and final SOURCE-MD:

| Variant | Bytes | SHA256 |
|---|---:|---|
| E/before-finalize-0054/SOURCE-MD/0054.md | 2756 | `441c64d045e462811131c279dfc0a13aa358d62dff2b7bc8044c8b098a382d19` |
| E/after-finalize-0054/SOURCE-MD/0054.md | 2858 | `c1fd0697ec18832ed67e0de3a3f391212c6e8db05695f47828faa8b376045301` |
| E/before-finalize-0055/SOURCE-MD/0055.md | 2913 | `19da422616f7c494dbe5d72180f1fbb4fbc2e773d0ef9e34760e7f7f5a3c632f` |
| E/after-finalize-0055/SOURCE-MD/0055.md | 3348 | `5b9c7af4278211419d78157e30fa3d8bb6c4c203c75762dcc1deb4df4fe757c2` |

Bytes differ because FIRST finalize writes authoritative frontmatter, printed
line counts/provenance and figure IDs/boxes/references. Both report normalization
count0. Original manually authored bytes are preserved, not replaced by final
bytes in the evidence.

All applicable current pipeline modules are retained exactly in every phase:
p2c.py, blocks.py, layout.py, normalize.py, mathcheck.py, katex_check.js,
soviet-cn.json and KaTeX package.json. Python symlink target/realpath and resolved
executable bytes, and Node executable bytes, are also retained and hashed. The
recorder's initial bytes are retained as recorder-initial.mjs; record.mjs itself
was not modified after initial capture.

Important current module hashes:

| Module | SHA256 |
|---|---|
| p2c.py | `691f50adcd8e3e8b72f035ef0f3521c943b03e30f6d57daa099d40d3b16725e1` |
| blocks.py | `1b6540373067b80cdc34ab7973a26ccfc1b21b62f655139731f16408ea072b66` |
| layout.py | `1fc40bd09c423c94c1497de995b43c98f497710c29c7fd753076414b9c96ed48` |
| normalize.py | `65db6b013806f0dd9de0a739e09714c8cdfaebd8f9cb41c4edcb5e242beae29f` |
| mathcheck.py | `8f703e723234c3ccc4d9b329d8e2f7b0053d0af261d0526169c31110a53fa8f7` |
| katex_check.js | `59c500172eca6dd76baea669aa0d92f67c28512253a751018782a5006a619b56` |
| soviet-cn.json | `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849` |

## Command Record Hashes

Complete command records include start/pending/result/stdout/stderr, with all
five file hashes in E/author-inventory.json and the manifest. The result-record
hashes below refer to E/commands/<name>/result.json.

| Command Name | Exit | Result SHA256 |
|---|---:|---|
| crop-p54-inequalities | 0 | `b24fface8a6758d57c00f428537473a89669b78ec190f57cbfeee690482df1a4` |
| crop-p54-final-set-glyph | 0 | `37699a935327d9c1a1fdf9d7541192bb6ef89b49e067b4682d39f3d91b8dc690` |
| crop-p55-fig32 | 0 | `3f32b09dd009098b84ebf5fd66748b69c6bfcf018cb06d12ec9642930580103b` |
| crop-p55-fig33 | 0 | `86767ecec1a15c816562b93c4fa1ecee1215c99d7c25eaa2c5c850f81dd69b09` |
| finalize-0054-first | 0 | `a199a1b6f51f0be746a27e68a572bd502d2912e09bac4667ae4775593c82ecc3` |
| finalize-0055-first | 1 | `60d96c5dae1221e91379a91c7bbcba7e8344e78262e838ec7f3e3359e5f3c005` |
| read-p54-audit | 0 | `d35263b17652b80455c84fd0fcfdc224689c635273bd73fa3c65cf959df317fd` |
| read-p55-audit | 0 | `fc80d5070f0187c043ce6b53db6ce45ee3a1bd82f7551d89484bf03e289df03f` |
| read-p54-page-json | 0 | `439182856f11d83df4e25dae3dae3d400cf4455cb8b94ef4a8494b62d53556a9` |
| read-p55-page-json | 0 | `7bfb7d9ff1f1eaa4c31dfc3ff83be79cf3937aabff280256088a9c9b8778c2fb` |

FIRST finalize stdout hashes:
physical54 `b319ba10ad2a46f08ec08e53a974ade65a349cd2a4c782cfc207ee01397aa720`;
physical55 `3bc5673b4079884ac01a20fd9b1febd3fe8d529cfe0de2068d14f6c0927ae4f3`.
Both stderr and all empty crop streams have SHA256
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Outer evidence-only commands were `node E/record.mjs initial`, seven `observe`
reservations, four `crop` calls, the two `finalize` calls, `end`, four `read` calls,
`node E/package-records.mjs`, a read-only `shasum -a 256` of the six current durable
files, and the final `seal`. The six final digests match targetafter exactly; the
hash command, exit0, stdout and empty stderr are retained after the fact in
E/final-durable-hash-observation.json. Observe reservations were each
followed by exactly one functions.view_image call at detail original. Initial/end
returned their binding paths and exited0; observation calls returned text path/
hash bindings and exited0. Manual file creation used apply_patch only.

Bootstrap read-only shell discovery before the recorder was not falsely described
as live-archived stdout. Policy/tool/template/layout bytes were retained later
before source writing. `pwd` exited0. A combined ls exited1 because the two durable
page directories were absent, and a new-evidence-directory ls exited1 because E
did not exist before apply_patch. These were expected absence probes, not failed
pipeline runs, not pre-existing authorship, and not independent reviews. Their
known command/exit context is retained in initial-bindings.json. No Git command,
all-project check or external service call was made.

## Final Durable and Work Outputs

| Output | SHA256 |
|---|---|
| D/0054/page.md | `c1fd0697ec18832ed67e0de3a3f391212c6e8db05695f47828faa8b376045301` |
| D/0054/page.json | `ea0a74ad730469535e327915fcab777a2bcbdebfb0bff9b01aac2374a75145e2` |
| D/0054/audit.json | `4a8ecc9105887e1f39ca870cacabed6bf325f8e314f4220663ab5b167ca0ada0` |
| D/0055/page.md | `5b9c7af4278211419d78157e30fa3d8bb6c4c203c75762dcc1deb4df4fe757c2` |
| D/0055/page.json | `b818d4c305d5bad0b3e9fd9264085c8e43d4806fb013e87308b9560f0cae52e7` |
| D/0055/audit.json | `4e976bd937cd38b78b600b4f3f193bedd335261bb0b86af6b113f23febca7de1` |
| W/0055/figures/fig-32.png | `4f6d856324360d9d003a786b3e30a3f6ee9c8e7f4334d7cdcf5d25ec2f9fc389` |
| W/0055/figures/fig-33.png | `79448cb8db527f855acac1e7734df1fdc4fbd0c5ead65f2897a5505aefa41d95` |

The figure PNGs are failed-run source crops, not approved modern figures. No SVG
was generated, opened or inferred. No all-book gallery, lesson, answer, choice,
modern/spec or later-source artifact was consulted or produced.

## Freeze

Complete machine-readable row/glyph/image/command/variant inventory:
E/author-inventory.json, 534498 bytes, SHA256
`39381f55c77d8b33b7baa2daeccce85bcbe99fef67f1b44c57fea62e8270c84e`.
E/package-record-bindings.json binds all named before/after records and output
hashes. Its serializer only reads this author's retained JSON and computes
hashes; it does not run pipeline validation, inspect pixels or perform review.

This full original-only report is frozen before any independent review. None
was read. E/full-author-manifest.json is written exclusively after this report,
includes its hash, the complete author inventory and every package file's absolute
path/size/SHA256, and prevents further recorder writes. Manifest self-hash is
returned externally, avoiding an impossible self-referential embedded hash.

Final condition remains: physical54 FIRST finalize exit0, physical55 FIRST
finalize exit1 with exact 17/15 mismatch, unit ana10-c6-s3-n86 OPEN, seven image
loads, no retry/repair and no global PASS. STOP after returning package paths and
SHA256.
