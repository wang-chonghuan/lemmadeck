# N60 source-author observations

## Status and boundary

- Ticket: STEMROBIN-187. Lesson: `math4-c2-s2-n60`, `60. 数的四舍五入`.
- Workdir for every shell command: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.
- Offline source-author handoff only; these are my observations, not an independent source review or approval.
- Owned durable writes: new `pages/0222/page.md`, `pages/0223/page.md`, `pages/0224/page.md`, this report, and `author-solutions.md`, all below the 4m artifact root named below.
- Page221 is read-only. I read its N60 portion and observed the required full-page grid once; incidental N59 rows were not transcribed, solved or reviewed. The supplied N59 commit `6b762187945f3786e04d23a42b38502cc0179953` is historical caller context, not rechecked Git state.
- No answer keys, choices, judging parts, interactions, other source/solution reports, tests or modern lesson were read. No DB/.env, network, model/paid services, installs, publishers, pipeline finalize/assemble/adapt/vectorize, indexes, progress files or Git writes were used.
- The cap1 transcription rules, production-resume contract, image-batch rules and capture-gate reference were read as rules only. No IntentFold capability, update or live ticket operation was invoked because this bounded assignment is offline.

Artifact root: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/ssot-resources/soviet10year-textbooks/artifacts/4m`.

## Source bindings

The prepared frontmatter's `schema`, `book`, `page`, `source`, `render` and `profile` are retained exactly. Added printed-page/printed-line counts and notes come from the actual grids, not from a prior lesson or key.

Source PDF named in the prepared templates: `4m 苏联十年制学校教材 数学 四年级.pdf`.
Prepared PDF SHA256: `642b18080aeaedd63a713f8e7e83c179459df1f5a21a93d80841a6c8530600d8`.
Prepared profile: `soviet-cn`, SHA256 `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`.
Prepared renders: 300 dpi, 1504 x 2172. Render SHA256 values below are from the templates; grid SHA256 values are independently hashed actual grid files. These are different files and different hashes.

| Physical / printed | Actual grid path | Grid SHA256 | Prepared render SHA256 |
| --- | --- | --- | --- |
| 221 / 212 | `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/ld-s10y-lesson/4m/pages/0221/page.grid.png` | `149e44c7c302f544a445cf2d5c2bbfbf8b3429b0bc13974b542fe8e46e3ef8d2` | Not inspected; page221 remains read-only. |
| 222 / 213 | `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/ld-s10y-lesson/4m/pages/0222/page.grid.png` | `8d24c59de504b1b01b2b781c80eb69c9b0f7e019a769f93a2884be69d75561f5` | `e97aefc966e97ae55608b45efebb6ca53364d63e2719961665e5eae4d195eeff` |
| 223 / 214 | `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/ld-s10y-lesson/4m/pages/0223/page.grid.png` | `127bf20d056e97fcbaa15ffb839f84a972d40f9f59cecbe7349244de8f31d6b4` | `eaec59e1b93078df50bdcc1e85331deb22043f70ee52e6d4fdd7709586bc4a8e` |
| 224 / 215 | `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/ld-s10y-lesson/4m/pages/0224/page.grid.png` | `06a6e20e0984152219a4311ba4920bf5e47abe3ff6c19de5d395d7ea0672b139` | `5c27a0f4977dd318ebad845b01d43d5cf92a64e4a815e312783fb6d5cc184185` |

TOC: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/ssot-resources/soviet10year-textbooks/toc/4m/zh.json`.
TOC SHA256: `35f60224523ab693f8484b806944aeb1a5e542cc123352ff41be79890a676a85`.
It names N60 at printed212 and `math4-c2-s3-n61`, `小数的乘法`, at printed215.

| Faithful page path | SHA256 |
| --- | --- |
| `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0221/page.md` (read-only) | `f6cb9f2400de9f00317203aabd3b1773a005ca2ad5537eadca3647ac5e073644` |
| `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0222/page.md` | `2f690437f6a3e1bdc67af71b54979b7542c33140a8de199f098cd33fdc04b220` |
| `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0223/page.md` | `b2058471802f573164296868dd4875e8ffac1769ba94ecb6507b4bca21f4d8e4` |
| `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0224/page.md` | `5852e4056db5c40289574da9ea3f0b8f05c8d017b74782011475824535f00ddd` |

## Printed lines and block scope

One nonblank body line is one physical printed text line, except the existing page221 split formula explicitly uses `↵` for its second physical line. Figure-internal marks/labels are not prose lines. A horizontal shared caption row is counted once, not twice.

| Page | Source-observed printed lines | Body accounting | Coverage |
| --- | --- | --- | --- |
| 222 / 213 | 24 | 22 prose + 1 caption + 1 foot | Complete physical page; all lesson content is N60. |
| 223 / 214 | 25 | 23 exercise + 1 exhead + 1 foot; fig225 caption shares the last line of1013 | Complete physical page; all lesson content is N60. |
| 224 / 215 | 22 | 10 exercise + 1 exhead + 2 boundary headings + 8 boundary prose + 1 foot | Complete physical page; N60 ends before `p0224#7`. |

Total new-page printed lines: 71. Counts are my visual source counts and a read-only body-line tally, not official line-band/finalize evidence.

- N60 first block: `p0221#4`, h3 `60. 数的四舍五入`.
- N60 first prose: `p0221#5`, the 1公斤糖果 / 1卢布48戈比 / 100克 problem.
- Cross-page prose: `p0221#10 p open` ends `把14.8改`; `p0222#1 p cont` begins `为近似值15`.
- N60 last prose: `p0222#13`, `$28\,148.3\approx28\,000=$28个千。`.
- N60 prose: 17 physical p segments, joined into 16 logical p objects; 32 physical prose lines, plus 1 h3 line. Page221 contributes 6 p segments / 10 prose lines; page222 contributes 11 p segments / 22 prose lines, with one cross-page merge.
- N60 written exercise range: 1009 through1019, inclusive; 11 complete exercise objects. First: `p0223#1`; last: `p0224#6`.
- Cross-page exercise: 1015, `p0223#10 ex open` plus `p0224#1 ex cont`; the complete request ends `的几分之几？`.
- N60 exercise bodies: 33 physical lines, 12 page segments joined into 11 objects.
- N60 printed exercise groups: unnamed initial group, `复习题`, `家庭作业题`; 2 exhead lines.
- Explicit labelled subparts: 8 total, namely1012 а/б/в,1013 а/б/в,1017 а/б. Letters are Cyrillic `а` U+0430, `б` U+0431, `в` U+0432, not Latin substitutes.
- N60 has 2 figure objects and 2 caption texts, with fig225's caption sharing an exercise row. N60 unique physical text rows across the four pages, excluding footers and N61, total69.

## Literal exercise observations frozen before solving

| Exercise / refs | Source request and all values |
| --- | --- |
| 1009 / `p0223#1` | For each of5.38,82.71,121.3, give its two adjacent natural-number bounds and the natural number it approximates. No letter labels. |
| 1010 / `p0223#2` | Round to个位:7.265,11.638,0.23,8.5,300.499,6.5108. |
| 1011 / `p0223#3` | `1普特（俄重量单位）等于16.38公斤`; give kilograms after rounding to个位 and to十分位. Both precisions are requested. |
| 1012 / `p0223#4` | а)十分位:2.781,3.1423,203.962,62.35,80.45. б)百分位:0.07268,1.35506,10.081,76.544,4.455; the last value is on the following printed line. в)十位:167.1,2085.04,444.4,300.7. The source says十位, not十分位, forв). |
| 1013 / `p0223#6`, figure `p0223#7`, caption `p0223#8` | A station covers the large circle and B station the small circle in图225. а)only A; б)only B; в)both stations. A further unlabelled request asks which region is the intersection of the two circles. All four requests belong to this exercise. |
| 1014 / `p0223#9` | Rewrite the product `$2.75\cdot3$` as a sum and compute its value. Both requests must be answered. |
| 1015 / `p0223#10` + `p0224#1` | Cloth is cut into equal parts;3 parts make a连衣裙, the remaining5 parts make a罩衫. Give both fractions of the whole. |
| 1016 / `p0224#2` | Filling a pool takes6 hours; after1 hour25 minutes, what fraction of the pool is filled? The printed text does not explicitly add a uniform-flow phrase. |
| 1017 / `p0224#4` | а)个位:1.69,1.198,37.444,37.5444,802.3032. б)十分位:0.3691,0.8218,0.9702,61.3501. Last values in each subpart are on separate continuation lines, not new subparts. |
| 1018 / `p0224#5` | Draw two intersecting straight lines making155 degrees and find all the other intersection angles. Both construction and three remaining angles are requested. |
| 1019 / `p0224#6` | Calculate exactly `$[(37.3+21.7)\cdot13+8688]:31-196$`; the source literal is8688, divisor31, final subtrahend196. |

Coverage counting convention: 51 explicit result slots when1009's bound pair and nearest integer count separately for each input,1013's intersection counts separately,1014's sum and value count separately, and1018's construction plus each of3 remaining angles count separately. These are result slots, not51 original exercises or letter-labelled subparts. Rounding requests number34:1009 has3,1010 has6,1011 has2,1012 has14,1017 has9.

## Prose observations and conventions

- `p0221#5` through`p0221#10` preserve rubles/kopecks and the actual values:1公斤 costs1卢布48戈比;100克 is one tenth of a kilogram; the calculation gives14.8戈比, between14 and15, nearer15. No currency modernization was made.
- `p0222#2` explicitly distinguishes the first fractional digit0/1/2/3/4 from5/6/7/8/9, giving14.407 near14 and14.513 near15.
- `p0222#5` explicitly states that14.5 is equidistant and that rounding uses the excess approximation15. This is the source's tie rule, not an inferred answer-key convention.
- `p0222#6` explicitly directs inspection of the first discarded digit only, adding1 for5 through9, leaving the retained digit unchanged for0 through4, and replacing discarded integer-place digits with zeros. It does not direct serial intermediate rounding.
- `p0222#7` through`p0222#10`:86.2759 to one fractional place, first discarded digit7, printed86.3; approximate symbol read as“约等于”.
- `p0222#11` through`p0222#13`:28 148.3 to千位, first discarded digit1, printed28 000=28个千.

## Figure inventory from actual pixels

Source boxes are `[x,y,w,h]` in the1504 x2172 prepared page coordinates. They are coarse, unsnapped source boxes only. No original figure was vectorized, redrawn or replaced, and no FigureSpec/modern figure was authored.

### fig-224: N60 prose

- Source: actual page222 grid, `p0222#3`; caption `p0222#4` reads `图224`; prose explicitly references it at `p0222#2`.
- Owner: `math4-c2-s2-n60`, prose, not an exercise or N61 boundary.
- Source box: `[205,595,1110,110]`; caption excluded, near `[710,725,135,45]`.
- One horizontal segment/number-line stroke, not a two-dimensional chart; endpoint labels14 and15.
- Nine labelled intermediate tenths ticks, left to right: `14,1`, `14,2`, `14,3`, `14,4`, `14,5`, `14,6`, `14,7`, `14,8`, `14,9`. With the endpoints these mark ten adjacent intervals.
- Two additional positions/short marks labelled below the segment: `14,407`, between14,4 and14,5; `14,513`, between14,5 and14,6. These comma labels are original image facts; prose uses14.407 and14.513.
- No arrows, origin0, vertical axis, negative interval, exact scale measurements or answer-colored highlight were observed or added.
- No extra crop was needed for this figure.

### fig-225: N60 exercise1013

- Source: actual page223 grid, `p0223#7`; caption `p0223#8` reads `图225`; request reference `p0223#6`.
- Owner: `math4-c2-s2-n60`,复习题1013, with all three letter subparts and the intersection request.
- Source box: `[855,1190,395,520]`; caption excluded, near `[1010,1725,135,45]`.
- Two intersecting circular outlines, larger above and smaller below, forming one lens-shaped common interior.
- A printed dot and `A` label lie in the large circle above the overlap; a printed dot and `B` label lie in the small circle below the overlap.
- `I` is inside only the large circle; `II` is in the overlap; `III` is inside only the small circle; `IV` is outside both, to the right of the overlap.
- Both circle outlines, both marked points/letters, all four Roman region labels and the single caption are present. No radii, numerical distances, grid dimensions, broadcasting strengths or extra regions are specified by the source.
- Scan-grid coordinates are observational aids, not metric mathematical givens; no exact center alignment or radius ratio is asserted as a problem condition.
- Local inspection crop from the existing grid: `[855,1190,395,585]`, including the caption, used once to resolve the right-hand Roman label as `IV`.
- Crop file: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/ld-s10y-lesson/4m/pages/0223/fig225.author-crop.png`.
- Crop SHA256: `658ebda3036f73761050f85fe7815b0f8ccf66b3cf2610331ad1fed4ad92acd9`. It is disposable inspection evidence, not a replacement original or finalized figure.

### N61 boundary reference, not a captured N60 figure

- `p0224#7`: `§10. 乘法`; `p0224#8`: `61. 小数的乘法`.
- `p0224#9` through`p0224#12` capture all8 visible prose rows, including original units, fractions and `图VII`.
- `图VII` is a Roman-numbered figure/plate reference belonging to the N61 boundary text at`p0224#11`, not图224/225 and not owned by N60.
- No image for图VII is printed on page224. No figure block, cropbox, asset or solution for it was manufactured or inspected.
- `p0224#12 p open` ends `写成：`; continuation is outside this assignment. N61 completeness, external-plate resolution and N61 solutions are not claimed.

## Holds, failures and actual image usage

- Genuine unresolved source-glyph/literal HOLDs:0. One mathematical endpoint SOURCE HOLD / errata is registered as`p0222-math-1`, bound to`p0222#2` and the unchanged original `在从14到15这个线段上的所有数的整数部分都是14`. A segment including the labelled endpoint15 cannot have integer part14 at every point:15 has integer part15. The source does not print an exclusion of15. Do not silently treat it as a half-open interval or author a correction before fresh source review. This prose-only HOLD does not alter any written exercise input or the explicit rounding tie rule. Page223 and page224 errata arrays remain empty.
- The initial source-author draft had not flagged this endpoint problem; the subsequent source-semantics check retained the original text and added only the HOLD/errata diagnostic. Initial page222 SHA256 was`690a1721837a9133ace83ee1c0685a426ff7183e8abd1e806563e890349c3d97`. That draft is not the current page binding or an approved snapshot.
- The initial ambiguity in fig225's outside label was preserved as an inspection question and resolved from the one permitted local crop asIV. It was not inferred from region algebra.
- Tool failure preserved: the first in-memory crop attempt through `node_repl` /`sharp` failed with `Unsupported import specifier "../package.json" in node_repl. Only .js and .mjs files are supported.` It emitted0 images and wrote no source. Recovery used the existing Pillow environment solely to crop the existing grid, then opened that crop once.
- Read-only setup failures: the first TOC jq traversal reached null and exited5 after printing N60; a recursive object selection then found N60 and N61. The initial owned-directory existence check exited1 because all new targets were absent; `apply_patch` created the authorized files. Neither failure changes source conclusions or denotes approval.
- Image batch:1; actual loaded images:5 = four full grids221/222/223/224 opened once each + one fig225-specific crop. Whole-page reopens:0; other crops:0; cumulative context images:5, below8 per batch and24 cumulative. Failed crop import added0.
- No new source renders/prepare calls and no replacement originals. No parent image payload is returned.
- Handoff remains source-author-only, awaiting the parent's official finalize and a fresh independent source reviewer. No source-review PASS, final lesson completion or production publication is claimed.
