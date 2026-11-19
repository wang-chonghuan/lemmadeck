# STEMROBIN-182 FIRST Independent Faithful Source Review

W: /Users/yong/.codex/worktrees/d9b1/lemmadeck

Scope: book7a, physical221-227 only. Independent comparison of current page.md/page.json/audit.json with the seven source grids, not acceptance of the author's verdict. The author's two reports match the exact requested SHA256 values.

Overall source verdict: REVISE. Six pages PASS; physical225 has one unique, localized condition-sign transcription defect. No page is BLOCKED. Complete modern lessons, assembly, answers, modern figures and publication are NOT reviewed or approved.

Exactly seven image reads in this review: physical221,222,223,224,225,226,227, in that order; each page.grid.png once, one image per call, one batch of 7/8 and 7/24 in this context. Zero reopens, extra crop views, page.png views, physical220 views, old figures, sample batches or image payloads in the return.

All shell commands used explicit workdir W. The only file written is this report. No Git, .env, network, DB, app, figure generation, publisher, prepare/finalize rerun, content edit or tool repair.

## Verdicts And Counters

The existing FIRST finalize receipts were read and reused, not rerun. All seven have exit0, signal null, error null and empty stderr. These establish mechanical results, not source faithfulness: physical225's wrong relation sign passes the same counter.

| Physical / printed | Source verdict | FIRST MD/printed lines | Blocks | Object inventory | Localized defect |
|---|---|---|---|---|---|
| 221 / 215 | PASS | 19/19 | 12 | p9, fig1, cap1, foot1 | none |
| 222 / 216 | PASS | 24/24 | 10 | p1, ex7, exhead1, foot1 | none |
| 223 / 217 | PASS | 23/23 | 11 | h2:1, h3:1, p8, foot1 | none |
| 224 / 218 | PASS | 22/22 | 10 | p6, ex3, foot1 | none |
| 225 / 219 | REVISE | 27/27 | 8 | ex7, foot1 | 765 б): a≥0 must be a>0 |
| 226 / 220 | PASS | 22/22 | 10 | ex8, exhead1, foot1 | none |
| 227 / 221 | PASS, opening page only | 24/24 | 14 | h3:1, p12, foot1 | none |

Total: 161 physical text lines, 75 blocks; p36, ex25 fragments, h2:1, h3:2, exhead2, fig1, cap1, foot7. The 25 exercise fragments represent 23 unique exercises, 754-776; 763 and 769 each occupy two pages, not duplicate exercises. Exactly one source figure: fig-54. No unnumbered table, owner-ex figure, h1 or samerow block.

All current audit.json files have empty errors, normalizations, unknown_chars and katex_warnings, and errata=0. Current MD frontmatter equals page.json.meta; all nonfigure block-body lines match page.json.blocks[].lines exactly. Figure identity, box, caption and flags agree across MD, JSON and audit. Source-grid text rows were compared independently; row counts below include headings, captions and footers, exclude figure ink, and count the sole formula ↵ as a physical break.

## Unique Correction

F225-765-б: physical225 / printed219, eighth physical text row, right-hand subpart of exercise765's first subpart row, approximately x=970-1110, y=770-810 in the source grid.

- Current MD: /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0225/page.md:48
- Current JSON: /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0225/page.json:73; JSON pointer /blocks/2/lines/1.
- Evidence: /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0225/page.grid.png
- Current subpart: `б) $\sqrt{a^2}$，设 $a\geq 0$；`
- Printed subpart: `б) $\sqrt{a^2}$，设 $a>0$；`
- Sole required token correction: `\geq` -> `>` in 765 б)'s condition only.

The source has a plain greater-than chevron here. The source's non-strict signs in neighboring 765 а) `c≥0` and 765 г) `a≥0` are visibly different and correctly retained. Do not change those signs. The wrong token broadens the stated variable scope to zero; even though the simplifying expression also works at zero, this is a source-transcription defect, not a reason to modernize or silently repair the exercise. Original label, radical scope, exponent, punctuation, horizontal row, block flags and 27/27 counter remain otherwise correct. This report performs no correction.

## Page-By-Page Pixel Review

### Physical221: PASS

Block/physical-row map: B1 p cont [1]; B2 p [2]; B3 p [3-5]; B4 p [6-7]; B5 p [8]; B6 p [9-10]; B7 fig54 [figure only]; B8 cap54 [11]; B9 p [12-16]; B10 p [17]; B11 p open [18]; B12 foot215 [19].

Actual first printed text is `是函数`, not `就是函数` on this page alone. First block is correctly cont; the externally supplied physical220 final `就` joins it into `就是函数`. No invented left-page text.

The contradiction proof retains both alternatives, all subscripts 1/2, squared parenthesized radicals, strict less-than signs, equalities, and final strict greater-than. The original folds `已` / `知条件矛盾.`, `曲` / `线连结各点`, and `函` / `数的值` are present at their physical rows. The values 12,144,200,40000 and the equality examples retain their printed digits and scope. The interval notation `[0, +∞[` is source notation, not converted to a modern closing parenthesis.

Figure54 is a fig object, not caption text or an exercise. Its caption is a separate cap block. The final p open ends in the printed character `映`; physical222 begins `射.`.

Exact right-open tail:

```text
因此，函数 $y=\sqrt{x}$ 是集合 $[0,\ +\infty[$ 到它自身上的映
```

### Physical222: PASS

Block/physical-row map: B1 p cont [1]; B2 ex754 [2-4]; B3 ex755 [5-6]; B4 ex756 [7-9]; B5 ex757 [10-12]; B6 ex758 [13-15]; B7 ex759 [16-19]; B8 exhead [20]; B9 ex760 [21-23]; B10 foot216 [24].

First printed text is exactly `射.`; cont correctly closes 221's `映`. Exercises754-760 and `复 习 题` are complete in their printed order. The source's root values, point coordinates/signs, inequalities, open interval brackets, absolute-value denominators and whole-fraction radical in 760 е) match the transcription. In particular, 757's `0≤x≤4`, 759 а)'s non-strict relations, 760 в)'s `2|x|-6`, 760 г)'s `4|x|+8`, and 760 е)'s denominator `x^2+1` retain their actual scopes.

Original subpart layout: 754 а/б on separate rows; 756 а/б then в/г; 757 а then б then numeric1/2/3 together; 758 а/б/в together; 759 а,б,в as three rows with three relations each; 760 а/б/в then г/д/е. Point labels A,B,C,D in 755 are not Cyrillic subpart labels. No formula ↵ is needed.

Right-open tails: none. Last source object is complete ex760, ending in `е) $\sqrt{\frac{5-x}{x^2+1}}$.`. Physical223 visibly starts §11 and n36, so n35's local right boundary is after760 on222.

The recorded physical222 post-finalize change was boundary metadata only after the author's sole223 grid read, in page.md and page.json; source body unchanged, no finalizer repeat. Current notes correctly state the independently visible222/223 boundary; current MD/JSON bodies agree. The original FIRST receipt remains reused.

### Physical223: PASS

Block/physical-row map: B1 h2 [1]; B2 h3 [2]; B3 p [3-4]; B4 p [5-6]; B5 p [7-10]; B6 p [11-12]; B7 p [13-14]; B8 p [15-19]; B9 p [20-21]; B10 p open [22]; B11 foot217 [23].

The source opens `§11. 含二次根式的代数式的变形`, then `36. 恒 等 式`; neither is continuation of n35. Roots of squares, fractions, negative numbers and the identity `sqrt(x^2)=|x|` preserve radical scopes and the nonnegative/negative cases. The example values 6,2/3,0,-5,-0.3,-24.5 and coefficient0.2 match the pixels.

Original folds include `因` / `为对于任何`, `等` / `于 x`, `就` / `是说`, `相` / `同.`, and `例` / `子.`. Identity(1) is on its own printed row followed by the identity claim; no formula ↵ needed.

Example1 is instructional p, not exercise1. Its statement is complete on this page but its worked solution starts224; p open is appropriate for that continuing example object.

Exact right-open tail:

```text
1. 当 $x=-24.5$ 时，求式 $0.2\sqrt{x^2}$ 的值.
```

### Physical224: PASS

Block/physical-row map: B1 p cont [1-3]; B2 p [4]; B3 p [5-7]; B4 p [8]; B5 p [9-10]; B6 p [11-12]; B7 ex761 [13-16]; B8 ex762 [17-20]; B9 ex763 open [21]; B10 foot218 [22].

First p cont is the worked solution of223's example1. Its formula occupies two actual physical rows, breaking after the closing absolute-value bar of `|-24.5|`, before the next equals sign. Current single complete math span preserves exactly that one ↵:

```text
因为 $\sqrt{x^2}=|x|$，所以
$0.2\sqrt{x^2}=0.2\times|x|=0.2\times|-24.5|↵=0.2\times24.5=4.9$.
```

Thus B1 has two stored JSON strings but three physical rows; the fraction examples and later radicals are not extra text rows. No other formula break is present.

Examples2/3 and their solutions are p objects, not ex objects. The source's `x<5`, `-(x-5)=5-x`, coefficient1/2, powers8/4 and `|a^4|` match. Ex761 retains the two complete sets and its x/-a alternatives in а then б order, each spanning two rows. Ex762 preserves а/б/в, г/д/е, ж/з/и in three horizontal rows, including decimal signs and values -23,52,-61. Last ex763 is only a printed prompt; its subparts begin225.

Exact right-open tail:

```text
763. 求下列各式的值：
```

### Physical225: REVISE

Block/physical-row map: B1 ex763 cont [1-3]; B2 ex764 [4-6]; B3 ex765 [7-10]; B4 ex766 [11-13]; B5 ex767 [14-19]; B6 ex768 [20-23]; B7 ex769 open [24-26]; B8 foot219 [27].

Only F225-765-б above requires correction. All other observed words, digits, signs, radical scopes, subpart labels and folds match. No mathematical erratum is established and no formula ↵ is needed.

Ex763 cont completes224's prompt with а/б/в in three rows, including the negative mixed number `-1 2/3`, not an exponent or a product. Ex764 has а/б/в together and г alone. Ex765 has а/б, в/г, д/е in that horizontal order.

Ex766 preserves square scopes and the full polynomial radicals `x^2+2x+1` and `4y^2-4y+1`. Ex767 is intentionally asymmetric: а/б share the first subpart row, then в,г,д,е each occupy their own physical row. The commas after в,г,д are printed; they are not to be rewritten into semicolons or used to justify reordering.

Ex768 preserves а/б/в, г/д/е, ж/з as three rows, powers4,6,4,8,8,4,8,10 respectively, and coefficients3,-2,0.1,100 where printed. Ex769 has а/б then в/г and remains open after the final semicolon; д/е start226.

Exact right-open tail:

```text
769. 化简：
а) $\sqrt{y^6}$，$y\geq 0$；　　б) $\sqrt{m^4}$，$m$ 是任意数；
в) $\sqrt{x^{10}}$，$x<0$；　　г) $5\sqrt{a^8}$，$a<0$；
```

### Physical226: PASS

Block/physical-row map: B1 ex769 cont [1]; B2 ex770 [2-4]; B3 ex771 [5-7]; B4 ex772 [8-10]; B5 ex773 [11-12]; B6 exhead [13]; B7 ex774 [14-15]; B8 ex775 [16-19]; B9 ex776 [20-21]; B10 foot220 [22].

First row completes769 with д/е in their actual horizontal order:

```text
д) $\frac{1}{3}\sqrt{c^{12}}$，$c\geq 0$；　　е) $1.5\sqrt{z^{18}}$，$z<0$.
```

Nested radicals in770 and their squared outer arguments match. Ex771 б)'s `+1` is outside `sqrt(x^2)`; it must not be moved under the radical. Ex772 keeps all four non-strict ≤ relations and the printed2.5 bound. Ex770-772 each retain а/б then в/г.

Ex773 and774 ask for drawing/graphical solution, but the source has no printed figure, so no fig or owner-ex object is missing. `复 习 题` is between773 and774. Ex774 retains а/б together;775 retains а/б,в/г,д/е, including the negative right side in в), with `x+1`, `6x-3`, `10x+7` inside their radicals as printed. No formula ↵ needed.

Right-open tails: none. Ex776 is complete across its two printed rows:

```text
776. 变量 $x$ 取哪些值时，函数 $y=\frac{1}{3}x-8$ 的值属于区间
$[-1,\ 1]$？
```

Physical227 visibly starts n37; n36's right boundary is after776 on226.

### Physical227: PASS, n37 Still Open

Block/physical-row map: B1 h3 [1]; B2 p [2-4]; B3 p [5]; B4 p [6]; B5 p [7-11]; B6 p [12-14]; B7 p [15-16]; B8 p [17]; B9 p [18]; B10 p [19-20]; B11 p [21]; B12 p [22]; B13 p open [23]; B14 foot221 [24].

Source heading is `37. 积和分式的平方根`. The opening calculations retain81×4,324,18^2,18, and distinguish printed multiplication dots from ×. Theorem1's two nonnegative conditions, `sqrt(ab)` versus the product of separate roots, proof steps1)/2), and all squared factors match. These numbered proof steps are p, not exercises.

At MD line54 / B5 row3 the actual printed wording is `成立，我们应当规定 ...`, matching the author's questioned `我们应当规定`. This is a pixel-supported source reading. It is awkward proof wording, not evidence to substitute `证明` or another mathematically conventional phrase. No glyph correction or scientific erratum is asserted here.

The original folds `等` / `式（1）是正确的.` and `平方根的` / `积.` are preserved. Theorem2 has `a≥0` but strictly `b>0`, with the entire a/b under the left radical and separate roots in the right quotient. The statement is printed in full on this page; it does not establish completion of the theorem/proof or n37. No formula ↵ needed.

Exact right-open tail:

```text
定理2 如果 $a\geq 0$ 和 $b>0$，那么 $\sqrt{\frac{a}{b}}=\frac{\sqrt{a}}{\sqrt{b}}$.
```

## Figure54 Source Inventory And Box

Evidence is the sole221 grid view, not a reopened source crop:

/Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0221/page.grid.png

One whole rectangular ruled coordinate graph, not multiple subfigures: complete enclosing grid/frame and dense internal ruling; horizontal and vertical axes with arrowheads; x and y labels; origin numeral0; x values1-9; y values1-4; one increasing curved trace starting at the origin and extending right; in-graph label `y=√x`. The surrounding grid below/left of the axes is source content too, and is retained. No invented extra diagram, point label or caption belongs inside this object.

The final source box `[243,893,1087,549]` means x=[243,1330), y=[893,1442) in the1504×2289 source raster. The viewed graph's entire top/left/right/bottom grid frame, axes, labels and curve are inside this box. The preceding text ends above it; separate printed caption `图 54` is below, approximately y1470-1505, and is excluded. Thus the box retains the whole source graph without text caption or body text. The existing audit reports coarse box `[235,885,1100,560]`, final box above, components144; that component count is a mechanical crop fact, not a count of mathematical objects.

Existing crop, hashed but not visually opened:

/Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0221/figures/fig-54.png

SHA256: 480bb2e509e6e900b0d620376a1ddf4932fe3ae98fdbff66ca893696f27be46d

Figure ownership: prose n35, owner_exercise null. MD fig block, JSON meta/fig block, audit box and separate cap agree. No modern FigureSpec, generated drawing or mathematical interpolation was reviewed.

## Boundaries And Faithfulness Limits

External physical220 / printed214 tail is supplied authority, not a pixel observation of this review:

```text
较大的自变量值对应于较大的函数值. 一般地，可以证明，如果 $x_1$ 和 $x_2$ 是非负数，并且 $x_2>x_1$，那么 $\sqrt{x_2}>\sqrt{x_1}$，就
```

External footer:214. Local221 starts:

```text
是函数 $y=\sqrt{x}$ 在整个定义域里是增函数.
```

`就` + `是函数` joins to `就是函数`; do not insert a new `就` into221 or report the boundary as a missing character.

- n35 start physical220 / printed214 is externally supplied and not independently reread. Its local right boundary is independently confirmed physical222 / printed216 after complete760 and before223's §11/n36 heading. Only221-222 receive local source PASS here; this is not complete n35 or modern-lesson approval.
- n36 starts physical223 / printed217 at `36. 恒 等 式` under §11, continues through example1 across223/224, ex763 across224/225 and ex769 across225/226, and ends physical226 / printed220 after complete776. Boundary is confirmed; current source verdict for its reviewed span is REVISE because of765 б). No modern lesson approved.
- n37 starts physical227 / printed221 at `37. 积和分式的平方根`, remains open at theorem2. Physical228 and later content are unobserved. Local opening page PASS does not approve n37 completion.

Original MD whitespace is an explicit join separator. Spaces around inline math, original horizontal subpart separators, and legitimate Chinese line joins are not omissions. The exact observed physical folds are retained; the one ↵ is a math-span layout marker, not a source glyph or an inserted arithmetic operation.

Source faithfulness and scientific judgment are separate. F225-765-б is an observed transcription error. The retained227 wording is source-supported awkward prose. Problems with impossible equations or negative right sides, such as771 б) and775 в), are intentionally printed exercises, not errors to repair. No confirmed source mathematical erratum is registered by this review.

## Hash-Bound Evidence

All listed SHA256 values were checked against current local bytes. The complete author's JSON bindings were independently rehashed:86 unique paths,0 mismatches. The author's MD and JSON hashes were additionally checked against the user-provided values. No copied evidence package or producer rerun.

Source PDF, hash only, no PDF page rendering/opening:

/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/sources/soviet10years/7a 苏联十年制学校数学教材 代数 七年级.pdf

8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052

Author reports:

```text
d9f90fcd32e5751ce09c96293eb4baab7b19c063470cdc3b5169ca3c9e901cea  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/source221-227-author.md
94940606f0992669bc594569528bb8fe0cc30956fcc7d52a2377b0eedc0c380d  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/source221-227-author.json
```

Instructions read:

```text
f63f3eac20f57814d511b3c792c58637a45627cdbf3fba3f89a59a4980f6ffec  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.claude/skills/ld-s10y-lesson/SKILL.md
8d489fdcdd1a00866e951958009f6c8602e6b970108f8e7fc87368c3197b6a58  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.claude/skills/ld-s10y-lesson/references/production-resume.md
d31ecbea164b4c5c0ac781146976f50381466ae4a8931486bdb2e92e29015747  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.agents/skills/ld-s10y-image/SKILL.md
```

### Current Source Triplets And Images

Physical221:

```text
61917c4e3fa6cdf1af49897dbc88a37f2bceeac8a0a4985c6d9b4be7b6bd69bb  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0221/page.md
bdf6d8e5283021ee302b992d7edd0eec3b34032147cc632f2181071d9a93ecef  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0221/page.json
0ee9c24fc6a29e36c81419701a498aeec3cb7151aa4bbefc3e6352c9150cb6f9  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0221/audit.json
6126c0b5f90d1c1fc74428df14f7473685161257d07046b098bc279d0d5d70a3  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0221/page.png
9007322687993c7b73a29d348f8fec4686985bddf2c9c7ff00e4cac81a517b87  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0221/page.grid.png
fb055442a1aa68f553880f3c7dae143068a40148368d7a339a41645c88b33077  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0221/page.template.md
8f4b63d91bc41daf64528358b6505ae386f2a755c38702a793427eff7c8f9808  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0221/layout.json
```

Physical222:

```text
1007d32ccdd15de082e9a5b3df3169927f75379dbf6c42f3c3b341507dce780c  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0222/page.md
e514a1851229912593dd3d6a2d40e366b1735b4e02d9975e5bf68e570e0c4767  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0222/page.json
54b75e2ac874240b39c18b087792db82358d0aaccbbef0b30c54a7c0212ca99d  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0222/audit.json
213f6547ba562b9fd3dd9850e7fbab77fb4ed6642f500eb85a57830fa4513699  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0222/page.png
2d7088c31bceaf5559516968b2b4418f606d46ac5d0150773dbd40f7d191c6fb  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0222/page.grid.png
35a22cd7188b8fab53fc6b6252e5302bc0c6d87b6879f6df86d2ca7425ece20d  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0222/page.template.md
f9346de0d8db91de6737ef1346590ed8e604f552a9fe08453f1b46749f3db13c  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0222/layout.json
```

Physical223:

```text
d2737a24eaebdab8ff17afeb94d230cbc277dcd6f5cae0c3b0939c04c7efaa20  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0223/page.md
95ae90da0d955fe9d8b5644a46ca4ce8474ba23e17708266697621f740fbc4a1  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0223/page.json
df675dc0494c6cfe7de3f9482d65225245137249c7f454759da6caae10b3ffdf  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0223/audit.json
2235750c5752a2420f9b64712f716378095f2c2fe5b1447006b86486b0808ec2  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0223/page.png
91fe374842b21f33d096e81c87969b1853dd7b5a47ace63bff89556b271c54d4  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0223/page.grid.png
d45b445558719c2e249200610be71f14b02cbdb79c35f55f37d7d82723d67030  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0223/page.template.md
557ca6b9a47aea2943aea5dec49f77ee17c3ec96b3f6d4b951ff9921330b33de  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0223/layout.json
```

Physical224:

```text
2722e35b916158bb4619f72f8aa1a5a1d7facac351b2c52cea6bbc5a1a9fe9fe  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0224/page.md
19ebd8af694362da30e1ba132612da778c550705a532771a0d085f1cc890ea61  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0224/page.json
40d82361af839f0ad17518b3833312c1125f6c806dc601659b26d27b1e1f0df2  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0224/audit.json
699e3c845c8fe3a107c26846f16e4f83f3f3791b61cd16c6c0ebc58fbf91ef73  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0224/page.png
d946d988e36a0b8586c6adac6acd88b36a0e587a8aeeb66a9b6138755c65da91  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0224/page.grid.png
304ce97128ab1c97e94001d991a3040be525cd12d0831caa6924dfc553c31603  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0224/page.template.md
dea486cc87224cf99f070f4f400da20f1027fc872e49ede055ee55bf92a7bb29  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0224/layout.json
```

Physical225:

```text
ef978f4d64f535f1ba79c8fe11fe6ece1925fc7406449936cc4964f06a41af94  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0225/page.md
018ea72f99dbc7f05a004f1e8fe67a02558254e97ad15dde3a7d593499e7fc47  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0225/page.json
010eff84d3f5abc6ffe3dd9c3ae8a881625f709e120436a0cabcb0ed684482df  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0225/audit.json
fd2581a3b31c9b98266c6c25357636cc187b1cb27bb89b059d3f52f97e8689e3  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0225/page.png
ff694c04416b0d648b61c824f7fd5bbb86e4905faf29abdb4e4db77263cf2964  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0225/page.grid.png
37b5336ed748b6cea68ed85825c51c5e23c0c0f3479ea71d78a0d6e2696f168a  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0225/page.template.md
36d90b48fcb72ad15fe44f9c5abb3b8c88e62c0b9c818f040e7c7805db97eb7b  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0225/layout.json
```

Physical226:

```text
9ca297130b74f6e5045a2f9372b8094cdc4046f7f1a293434f8f151325e61666  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0226/page.md
597ce0b74fc5220f6d965c9ecd98e11aaa717d8634db30350d8e4cfb34d96910  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0226/page.json
5daa57519c6e52063312054effeee2f6d17d976b30468b9f24f29efea6b24da8  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0226/audit.json
db5f7a83d2bf370266daaafbf7cc51223aad70ca2a5c406b49c44a76d00fab4a  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0226/page.png
e1780ff2c018f7d1860bbcc40016186786566e5b2c46d1c0beb768ee88d4ce2c  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0226/page.grid.png
76c2a31bff6678ca2dd7c19b7617306e8c180512fb0e421da8c987cdc7dcf58a  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0226/page.template.md
1b6ff697de80368ef435dbb2a6ba92aeb5b48df6164571b73f49aa2f8de6484f  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0226/layout.json
```

Physical227:

```text
afa09684990cce1512c4fbef7c36424fce995d2e802ee10fa5862122608427f7  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0227/page.md
d07991bcf4c4d2c7dd58d7c920c7f703e1fac6319174150e94acf834b15bdf52  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0227/page.json
d27467b347a0e15ad386c2ea3d9867b299eb98107589488fe01503551fe64997  /Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages/0227/audit.json
be772f23047d5968f128ba559fa06d350818a0dfe6a8510e466982d5007c2676  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0227/page.png
f05e7d90b0921d953f5eb1e7254333e7ea08c0c4b74606b20d791f650acc3c2c  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0227/page.grid.png
d49b6a9044ab1371ffebab03a205850e25d955d6427cb73e3320a354541d579a  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0227/page.template.md
beffb148f744251c38a733773a9168f7646849f7e44dcf87dae4ddad1042c891  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.tmp/ld-s10y-lesson/7a/pages/0227/layout.json
```

### Reused FIRST Receipt Identity

Each receipt's recorded cwd is W. Each recorded command is the existing lesson Python with `-B`, p2c.py finalize, explicit book7a, its own physical page and work `.tmp/ld-s10y-lesson`. These are descriptions of historical execution, not commands executed by this reviewer.

| Physical | Recorded start UTC | Recorded finish UTC | Exit |
|---|---|---|---|
| 221 | 2026-11-18T23:02:22.011Z | 2026-11-18T23:02:22.424Z | 0 |
| 222 | 2026-11-18T23:02:54.442Z | 2026-11-18T23:02:54.852Z | 0 |
| 223 | 2026-11-18T23:03:41.487Z | 2026-11-18T23:03:41.806Z | 0 |
| 224 | 2026-11-18T23:04:18.715Z | 2026-11-18T23:04:19.103Z | 0 |
| 225 | 2026-11-18T23:04:50.808Z | 2026-11-18T23:04:51.192Z | 0 |
| 226 | 2026-11-18T23:05:22.110Z | 2026-11-18T23:05:22.480Z | 0 |
| 227 | 2026-11-18T23:06:22.085Z | 2026-11-18T23:06:22.493Z | 0 |

Physical221:

```text
af7a768127b2c38338fdbd3d72727205726fa26b7a8e0221705171c355806f24  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0221-FIRST.start.json
88251de9e3bd6b3e05dd592f1fcfd457b488e4751c829f207f4c7e6eec415cab  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0221-FIRST.stdout
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0221-FIRST.stderr
c909dfb9cbaf2890f1c3af028ada5a6d9ee24d1c8abfdb04eccb916e68aff483  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0221-FIRST.receipt.json
```

Physical222:

```text
bdc270678f00629a84888f6f1f9e43d5cb2778e07b713fd1f5e9aefe9b7aba8c  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0222-FIRST.start.json
ba772a246d64271e889076c6c843657faa823701fafddaf8369c8400004f0c57  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0222-FIRST.stdout
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0222-FIRST.stderr
9e334a29118e92df9eaa11dd8e5554a17eee52cef47c1ff198c365dacccf9fe0  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0222-FIRST.receipt.json
```

Physical223:

```text
68cf9d924ade06f496f76ceb0af1477d9dd1c0ef77c6b88d7d193c3d190386eb  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0223-FIRST.start.json
714dd58cbc23d10b2a876bf1f5215f0fe65892ddaba91974a868d6feb164402e  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0223-FIRST.stdout
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0223-FIRST.stderr
87e12ee251c3a86d9ad17164b0317bc9eaf90ba3412ac8a48af479251b17039a  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0223-FIRST.receipt.json
```

Physical224:

```text
a04eb8b202c652d0d2419b62c6f2628c81b410cba593155303fca584ee168460  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0224-FIRST.start.json
e112e3363aa84f85833c374dcf4ab5c2c32021e9f9e66beb9cbbd7e3bc961cf1  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0224-FIRST.stdout
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0224-FIRST.stderr
4e382c3a1ead220ee9aa7a36ba0f6189c710137e7fed402e7cce12db3a347a57  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0224-FIRST.receipt.json
```

Physical225:

```text
85fc76b372a8b278af7be816eff14e7150d310ddee2ba6ef822c7b0edcfff191  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0225-FIRST.start.json
a5de10ec8359739e3e583d37c327f3a44cc27d223aa7fe18115242ca0f67767d  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0225-FIRST.stdout
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0225-FIRST.stderr
50654ad745ab86fd7531a6ab0f19a63298d8d74f62c6d5ed8dfb79886170dfb6  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0225-FIRST.receipt.json
```

Physical226:

```text
8a524466ef9ce8247ffc9fed30c455a0a4945e3ab8f31c7491a58793e30d2de3  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0226-FIRST.start.json
22eced6333d35a533cc6046b68a39669def8cc7c56ca3d9452c37230c4121d2d  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0226-FIRST.stdout
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0226-FIRST.stderr
64774e6de5cd96b4940af90665e1f514fbe065d36e2a2996c013d0ba284f018e  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0226-FIRST.receipt.json
```

Physical227:

```text
bc304b8d649c76b91ab2c9c69445b044a5b97b6ff6eba38d69bb611237956468  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0227-FIRST.start.json
5d6b3f6b84651f3f899af7cf8206d6c8959f82ba1d3f32341bb75d9bdb8f8ea6  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0227-FIRST.stdout
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0227-FIRST.stderr
aa07a643868331a0f9e6904abfb71829e7b198b77b4acf9484c8f95fba9b3e33  /Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/stages/source-author-p0227-FIRST.receipt.json
```

The first-execution results remain historical evidence. Their reuse does not overrule F225-765-б or grant any downstream lesson approval.
