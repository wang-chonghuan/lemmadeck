# 10c physical p7–p10 Independent Source Review

Ticket: STEMROBIN-184. Date: 2026-11-15.
Role: independent source reviewer, not page author.
Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

## Conclusion

No definite word, formula, exercise-number, printed-row transcription, or object-boundary discrepancy was found in the four current page bodies. Figure1's actual crop preserves the printed diagram and labels without importing prose or its caption.

This is NOT a four-page finalize PASS. The existing p7 21/19 FAIL, p8 21/20 FAIL, and p9 19/18 FAIL remain unchanged; p10 remains 22/22 PASS. Independent source counts are respectively **19, 20, 18, 22**, including the actual dotted folios. P7 has both a false split of a chapter-title row and a counted scan-edge band. P8–9 have counted scan-edge bands.

## Evidence Order and Scope

Read the current lesson skill cap1. Viewed each full original `page.png` individually at original resolution, in order p7, p8, p9, p10; independently observed source text and rows before reading that page's MD/audit/layout. Viewed the actual fig1 crop after its original p7. Checked structured page JSON against the observed text and flags. Only after all four source-first observations did I read `source-10c-p7-p10-author.md`; its conclusions did not supply my source evidence.

No other book pages, answers, choices, modern artifacts, or other reviewers were read. No prepare/finalize/assemble/adapt, browser, service, network, DB, publisher, tests, tool modification, or source-page write was performed. A read-only `python -B` diagnostic used the existing `layout.ink_mask`, `line_bands`, and `counting_ink` on in-memory copies only; it did not overwrite any audit or add an exclusion.

## Independent Row Counts

One row means one printed horizontal text/formula row, not a numerator or denominator. `↵` is counted only at a genuine printed formula break. Parallel exercises and the caption sharing a formula row are counted once.

| Physical / Printed | Independently counted row groups | Actual rows | Current audit printed/MD | Status |
| --- | --- | ---: | --- | --- |
| 7 / 1 | Chapter title2 + section1 + unit1 + opening prose2 + displayed formula1 + assumptions introduction2 + а)3 + б)/caption shared1 + final prose3 + footnote2 + folio1 | 19 | 21/19 | Source transcription PASS; count FAIL retained |
| 8 / 2 | Initial continuation6 + negative-x paragraph3 + derivation paragraph10 + folio1 | 20 | 21/20 | Source transcription PASS; count FAIL retained |
| 9 / 3 | Continued equality3 + example introduction1 + example1 two rows + example2 one row + exercise heading/instruction2 + exercises eight horizontal rows + folio1 | 18 | 19/18 | Source transcription PASS; count FAIL retained |
| 10 / 4 | Exercises11–14: 2+3+1+2 + unit heading1 + introduction2 + derivative formulas3 + domain paragraph2 + cosine-proof paragraph4 + unfinished final paragraph1 + folio1 | 22 | 22/22 | Source transcription and existing count PASS |

## Page7: Source Text, Boundary, and Figure1

- Actual chapter title has exactly two rows: `第六章 三角函数及其图象` / `和导数（续）`. The second is a single centered title row; its characters and parentheses do not introduce another printed line.
- Actual subsequent headings are `§ 15. 三角函数的导函数` and `75. 正弦函数的导函数`. No exercise number is printed on this page.
- The displayed source reads `sin′ x = cos x` with a raised footnote star, followed by `(1)`. The MD's prime and raised star retain these printed marks. The explanatory paragraph breaks at `这两点假` / `设的正确性）：`, as on the source.
- Assumption а) occupies three source rows, ending in the single displayed limit `lim_{Δx→0} cos(x+Δx)=cos x`; б) is one tall fraction/limit row, `lim_{x→0}(sin x/x)=1`. MD uses Cyrillic `а` and `б` as required.
- `图 1` is printed beside the б) formula within that same horizontal row. `cap samerow` is appropriate; counting the caption as another independent row would be incorrect.
- The three-row final paragraph ends literally `整段弧AB的长`; its arc marks over `P_0A`, `P_0B`, and `AB` are retained. `p open` is necessary. The two-row starred footnote is separate teaching text: `等式(1)可以写成` / `(sin x)′=cos x`. Its transparency does not terminate the open paragraph.
- Actual folio has both side dots: `· 1 ·`.

Actual crop inspected: `.tmp/ld-s10y-lesson/10c/pages/0007/figures/fig-01.png`.

The diagram includes O at the left vertex, A/B at the upper/lower arc intersections, C at the chord/horizontal-line intersection, P_0 at the right arc, and two x angle labels. OA, OB, chord AB, the horizontal O–C–P_0 stroke, curved right boundary continuing beyond A/B, and both angle arcs are preserved. No extra named point or exercise ownership is introduced. It is a body figure, not an exercise-only figure. The caption and adjacent prose are outside the crop.

Recorded ink box is `[1072,1340,317,356]`; the actual PNG is **341×380**, i.e. not the ink-box dimensions. The reviewed PNG includes surrounding crop margin. Its hash is recorded below; no recrop or promotion was done.

## Page8: Source Text and Continuation

- The first printed word is `度`, closing p7's `长` into `长度`; `p cont` is correct. The first formula is `|AB|=|AC|+|CB|=2 sin x`, followed by the chord/arc ratio `(2 sin x)/(2x)=sin x/x`.
- The small-positive-x prose and the negative-x equality `sin(-x)/(-x)=sin x/x` are retained. No fraction was split into numerator/denominator body rows.
- The text really says `现在转回到推出(1)式`, then introduces `lim_{Δx→0}(Δ sin x/Δx)`. The delta increments and subtraction signs match the printed source.
- The source identity has `2 cos((α+β)/2) sin((α−β)/2)` and the reference `参看第74小节`. The substitutions are `α=x+Δx`, `β=x`.
- The increment equality genuinely occupies two rows: `Δ sin x=sin(x+Δx)−sin x` / `=2 cos(x+Δx/2) sin(Δx/2)`. Its single `↵` is faithful.
- The last displayed formula stops at `sin′ x=lim_{Δx→0}(Δ sin x/Δx)` without closing punctuation. `p open` correctly awaits the next page's leading equality.
- Actual folio is `· 2 ·`; there is no figure or heading on this page.

## Page9: Source Text, Numbers, and Shared Rows

- The first derivation is three actual rows, continuing p8: the difference-quotient substitution, the product of two limits with nested half-increment fraction, and `=cos x·1=cos x`. Current `p cont` and two `↵` preserve the continuation and all three rows.
- `例 利用复合函数微分法，得出：` introduces two numbered body examples, not exercise1/2. Example1 has its real second line `=a cos(ax+b)`; example2 retains `−(1/x²) cos(1/x)`.
- The exercise heading and common instruction are both printed: `习题` / `求下列函数的导函数：`.
- Independently read every printed exercise: 1 `f(x)=sin3x`; 2 `g(x)=sin((1/2)x+π)`; 3 `h(x)=sin(π/2−x)`; 4 `M(x)=3 sin²(2x−1)`; 5 `f(t)=sin2t cos t−sin t cos2t`; 6 `f(x)=sin(-x)+sin x`; 7 `g(x)=sin2x−2 sin x cos x+5`; 8 `h(x)=sin(2x−3.5)+sin2x`; 9 `M(x)=2x+3.6 sin⁵(π−x)`; 10 `f(u)=cos2u cos(π/2)−sin2u·sin(π/2)`. All match the current MD.
- Exercise1/2 are one printed row; exercise3/4 are one printed row. Separate exercise blocks with `samerow` on 2 and4 are appropriate. The decimal3.5, coefficient3.6, uppercase M, exponent5, variable u, and explicit final multiplication dot were observed rather than inferred from identities.
- No exercise or paragraph is unfinished at the page bottom. Actual folio is `· 3 ·`; no figure is printed.

## Page10: Source Text, Stars, and Next-Unit Boundary

- Exercises11–14 continue the printed sequence1–14 in this observed range. All four are complete on p10. The raised stars after12,13,14 are visibly printed and retained.
- Exercise11 says `当x取所有的值时`, gives `f(x)=2x−sin x`, and specifies a positive derivative and rising function on real set R.
- Exercise12 gives `g(x)=x−sin x`, asks when its derivative becomes zero, then asks to prove it is rising on R and draw its graph. Its three printed rows, including the separate `图象.`, are retained.
- Exercise13 is exactly the one-row instruction `讨论函数h(x)=x−2 sin x`.
- Exercise14 uses the original interval `]−∞,∞[` and `g(x)=sin(2x−5)−3x`. The expression genuinely breaks after the first-row sine term; `↵` before `−3x` is correct. There is no source basis for replacing the interval notation.
- The new heading is `76. 余弦函数、正切函数和余切函数的导函数`. Its introduction retains the reference `第75小节`.
- The three displayed formulas preserve source signs, powers, function notation, and numbers: `cos′ x=−sin x (1)`, `tg′ x=1/cos²x (2)`, `ctg′ x=−1/sin²x (3)`.
- The domain paragraph says each formula holds at every point within the corresponding function's domain. The cosine identity and chain-rule derivation are printed as transcribed, including the real second equality row `=sin x(-1)=−sin x`.
- The last paragraph ends literally `为了证明(2)式和(3)式，我们利用商的导数公式和已知`; `p open` is necessary. No completion from an unseen page is inferred.
- Actual folio is `· 4 ·`. No figure is printed.

## Count-Only Findings and Legal Suggestions

All original PNGs are **1695×2580**. The existing `scan-artifact` bottom-margin criterion is `y >= 0.95×2580 = 2451`. The suggestions below therefore use the legal box `[0,2451,1695,129]`, entirely inside the PNG. This is not a body-text mask or an expected-count override.

| Page | Independently observed non-text ink | Current counted band | Suggested count_exclusion | Source-based safety |
| --- | --- | --- | --- | --- |
| 7 | Fragmented near-horizontal bottom scan boundary, becoming a curved/dense edge at the lower right | `[2463,2494]` | `scan-artifact`, `[0,2451,1695,129]` | Entire proposed strip is below the actual folio ending at y2312; no title, prose, formula, footnote, caption, or figure lies in it |
| 8 | Long uneven bottom scan boundary with denser portions and rightward fragments | `[2464,2492]` | `scan-artifact`, `[0,2451,1695,129]` | Entire strip is below the folio ending at y2306; the final quotient formula is higher still; no body or teaching pixels are removed |
| 9 | Fragmented bottom scan boundary, dense left/central pieces and curved right edge | `[2464,2491]` | `scan-artifact`, `[0,2451,1695,129]` | Entire strip is below the folio ending at y2281; exercise10 and its fractions are above it; no body or figure pixels are removed |

The proposed strip includes scan-edge ink, not literally zero dark pixels. “No body pixels” means no printed instructional or folio glyph pixels; the retained dark pixels are precisely the observed scanning boundary. A few higher edge fragments may lie outside this conservative legal strip; no assertion is made that it removes every margin speck.

Read-only application of the existing validator and counter to these proposed boxes gives:

- p7: **21 → 20**, not19. Remaining chapter-title bands are `[560,605]` and `[606,652]`, two adjacent pieces of the one original row `和导数（续）`.
- p8: **21 → 20**, last retained band `[2277,2306]`, the real folio.
- p9: **19 → 18**, last retained band `[2259,2281]`, the real folio.

These are diagnostic in-memory results, NOT new finalize outcomes. No suggested box has been written to a page.

**P7 unresolved counting defect:** neither title band is eligible for `scan-artifact` or `separator-rule`; they contain actual heading glyphs. Do not mask either, split the MD title, invent `↵`, add blank content, or delete text to obtain a count. The title has one second row even if the counter still fails after a legal bottom exclusion.

P7's title separator and footnote separator are also visibly printed rules, not prose, but they do not appear as extra bands in the reviewed current audit path. No separator exclusion is needed to explain the retained mismatch. P10 has a thin bottom scan boundary too, but it is not an extra current counted band; no p10 exclusion or edit is suggested.

## Actual SHA-256 Bindings

Computed directly from current local bytes, not copied from author claims. At review time MD and page JSON represent the same observed bodies/flags; render metadata agrees with each actual PNG hash. All four current `count_exclusions` remain `[]`.

Path prefixes:

- Pixels/layout: `.tmp/ld-s10y-lesson/10c/pages/00NN/`
- Durable pages: `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/00NN/`

| Page | File | SHA-256 |
| --- | --- | --- |
| 7 | page.png | `0f9412befdb57b4a8cf1ba74732dda253a93f308990cd51879c6c1ce5bfda2d0` |
| 7 | page.md | `d1e2f135b6e24e00b27624b46fcbda0a3ad7b2a79f1c975b8bebb829e634ac0b` |
| 7 | page.json | `a227455c737a4310ea022dd666318c42a90bfb3ab0fe05431feb38d005b7f0d2` |
| 7 | audit.json | `690501765596080b1c9d4d6c69328daa56340808659f82ddc1a555735e65b90f` |
| 7 | layout.json | `fb5bf75d33f5c8f354dc41cdead3665998ed6e3a3791018f7de8173ebad73db0` |
| 8 | page.png | `7db8b93fd4c11723282a1a91a42940623d57424d8ea65ba6a41a70cec6737a05` |
| 8 | page.md | `82d6be8e59828ba3a69fc7b2f835a9a0a9319926c070f19e4fc2816aae925175` |
| 8 | page.json | `1f3905f7611dc3cbf03935a439fb8d1015807443841f51e2b6849d0b114d0ba8` |
| 8 | audit.json | `bc1b75e2efa353f1673ee4767689e91de40d9c6c2a0bb4c9a52536d92beb670a` |
| 8 | layout.json | `e16429ce10af1b8358b62216b38ddd6f948c6709d5255b69f401e8a72a6383bb` |
| 9 | page.png | `d599c190c459ed486bc74feda49302ec1e3ce2670ced98d58a6defd07d3e94d9` |
| 9 | page.md | `69ebc3cd92fdcac26b3e0ef59343849fa5de81482bce9df5bbeee3535f0b88f2` |
| 9 | page.json | `07df7588ae32eebdea0b42f85e2b54ce27b175dc810ece037fc909b40d060f12` |
| 9 | audit.json | `4d2ba037d3369718b3ed3a2cf830cdd157b97d8518f3a10c688802f2709f9b4d` |
| 9 | layout.json | `563efd72b57b37d2b50edb5860f95531e85659ddbc6873ecdee57a937529720a` |
| 10 | page.png | `54700646927ef780171c30500317736b983b18371d5e4f01ce63745255d963bd` |
| 10 | page.md | `1341a441d516c2e0bbe7857bd399b9e1c9001e1bd89252d1681646feb0f54431` |
| 10 | page.json | `3e5f2f2075ee7b6e14a4299303ff368174972435610a0e8962872fa3be953f93` |
| 10 | audit.json | `3df4c2c59af394891e99cafb21bcb30e8e406862942cfb8fa87cc090d4b54677` |
| 10 | layout.json | `d6f5fbe997bdec6dbca7c461c14f2b3e48e74abaf94224b2bb11de322b70682c` |
| 7 | figures/fig-01.png | `1a6f43b35e3313697c317285cadc79e6a14d263681661ccbe77efbfe02841101` |

The page metadata records PDF SHA-256 `47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`; the PDF itself was not rehashed or reopened in this scan-bounded review.

## Stop

Only this independent report was written. All original pixels, durable pages, figure crop, audits, and existing failures were preserved. Parent owns any metadata registration and subsequent counting resolution; no whole-batch source approval or publication is asserted.
