# Physical p47-p51 Independent Transcription Review

Verdict: **REVISE, footer ornaments only**. All inspected exercise/prose/formula text, figures53-60, ownership, and open/cont boundaries PASS. No mathematical or instructional correction is requested.

Scope: new physical pages47-51, printed37-41, in the existing STEMROBIN-184 worktree. For each page, opened its complete high-resolution clean PNG first, then current page.md/audit and that page's finalized PNG crops, before advancing to the next page. Current page.json was inspected structurally for the recorded boundaries and hashes. No author-page/crop edit, finalize, assemble, answer solving, browser, publish or commit. Already-reviewed pages11-46 were not reopened. Figure37-42 inventories/drafts remain retained and untouched during this review.

## Concrete Finding

The printed folios on all five clean originals have a circular dot on each side of the number. Current page.md and page.json foot blocks omit both dots:

| Block | Current foot | Faithful foot | Source location (approximate) |
| --- | --- | --- | --- |
| `p0047#12` | `37` | `· 37 ·` | lower-right, y1935-1970 |
| `p0048#13` | `38` | `· 38 ·` | lower-left, y1935-1970 |
| `p0049#12` | `39` | `· 39 ·` | lower-right, y1955-1985 |
| `p0050#17` | `40` | `· 40 ·` | lower-left, y1940-1970 |
| `p0051#14` | `41` | `· 41 ·` | lower-right, y1945-1980 |

Smallest remedy: parent restores only those foot bodies and refreshes their derived page artifacts with the existing pipeline. Each decorated folio is still one print row: do not add rows, alter expected counts, change the counter, edit figure boxes or crop pixels. This is a minor faithful-layer omission, not a defect in the learner-facing mathematical content; all other observations below can be retained while the parent applies that mechanical repair.

## New Page Observations

- **47:** exercises103/104/105/106 have3/1/3/2 printed rows respectively and match all words, punctuation, formulas and subparts. In103, noncollinear A/B/C, closed broken line ABC, and the union of lines AB/BC/CA are preserved. In105, Cyrillic а/б/в and "不属于圆周内部" are faithful; no "闭" is added to109 later or other problem text regularized mathematically. Section11 starts after106. First prose has8 rows, split around figure54 with `p open`/`p cont open`. Last words "它是二者的" require48's "公共边界." Caption54 shares that prose's final row. Figure53 has no invented empty `ex cont`; its owner102 is retained using the parent's previously-recorded46 boundary context, not a reopened46 review.
- **48:** first `p cont` supplies exactly "公共边界.". Definition is the union of a simple closed broken line and its interior. The source actually prints "多边形不属于边界的点", without an extra "的"; this is retained. Vertex/edge/perimeter wording and ordered names ABCD, BCDA, CDAB all match. Prose split around55 reconnects; caption55 shares "BCDA，CDAB，等等." rather than becoming an additional row. Diagonal examples remain AB/CD/EF. The convex-figure definition and figure57 references remain Cyrillic а/г/д versus б/в/е, without reordering or solving. The last paragraph is complete on48 although its illustration57 follows on49.
- **49:** figure57 is one six-group inventory, not six figure IDs. Figure58 is one three-group inventory containing five outlines: а has1, б has2, в has2. The triangle/more-than-three-sides prose and singleton/empty-set convexity statement match pixels. Exercises107-109 are complete;108's superscript hollow circle is preserved as `\circ`, not a colon. Its variables are n and p.109 actually says "任一折线"; it is not changed to "闭折线".110 starts "两个角的交集" and ends at the single character "顶"; `ex 110 open` is correct.
- **50:** `ex 110 cont` begins "点呢？", joining49's "顶" without an invented word/space, then preserves the second triangle-intersection question.111-122 wording and all numeric subparts match. Explicit source-marker enlargement confirms111's star and112/113/114/115 hollow circles;120's hollow-circle scan has a right-side break and is appropriately represented as `\circ`.117/118 stars are visible on the clean original.115 preserves all four cases, including "去掉圆心以后的圆" and "去掉一点以后的平面", across its figure-interrupted open/cont pair.116's last line shares caption59, but59 remains owned by115.119 preserves "不凸的多边形".121 exactly preserves `(n>3)`, "始点" and the two-row ray question; no inequality correction or solution is made.122(1) ends in a question mark but the exercise correctly remains open for51's subpart2.
- **51:** `ex 122 cont` contains the complete second question.123's star, equality comparison in1), and greater-than wording in2) match. The section12 boundary follows123 and must not be merged into section11's exercises. All20 prose rows are retained: the first5-row A/B/C versus D/E/K paragraph;4-row convexity introduction split only at caption60;2-row statement14;4-row same/opposite-region paragraph;2-row half-plane definition;2-row notation paragraph; final1-row statement about same-origin rays. Source wording "连线" is retained, without adding "段". The notation is exactly `[p,C)`, left square/right round, not an interval rewrite. Caption60 shares "域中的两点及其连线都属于该"; the following `p cont` closes the same sentence. Statement14's printed vertical emphasis bar is a layout marker, not a missing theorem/figure number. Final paragraph cites61, which is not on51; no fake crop or empty continuation is inserted.

## Crop Completeness And Ownership

All eight current finalized crops were opened completely and compared to their own page pixels. Captions/adjacent prose are outside the crops.

| Figure | Page / exact finalized box `[x,y,w,h]` | Pixel content retained |
| --- | --- | --- |
| 53 | 47 / `[181,221,1093,349]` | Four Cyrillic groups; а's three branches at O; б's O1/O2 strokes; в's O1/O2 configuration and descending crossing stroke; г's four separated origins O1-O4 and full strokes. No clipped branch, origin, label or added graph point. Owner102 remains the prior exercise, not103. |
| 54 | 47 / `[778,1477,498,360]` | Complete rectilinear spiral-like closed boundary, hatched region/white channel, and the separate slanted line p with its p label. No prose/caption inside; body figure for section11. |
| 55 | 48 / `[779,703,357,231]` | All four boundary edges, hatching and A/B/C/D labels; source C is genuinely faint but its surviving ink is retained. Caption55 remains text. |
| 56 | 48 / `[172,1226,1071,263]` | All three polygons, complete AB/CD/EF diagonals, six endpoint letters, hatching and fine/faint strokes. Three images share one figure number; no invented subpart labels. |
| 57 | 49 / `[175,234,1115,563]` | All six source groups а/б/в/г/д/е, the full closed shapes, open-right lower-left depiction, lower-right boundary branches and all hatching. Open/crop-truncated depictions are not falsely closed. |
| 58 | 49 / `[189,1039,1094,261]` | All five closed outlines and three Cyrillic group labels, including both figures in each of б/в. Isolated source specks are not treated as new mathematical points. |
| 59 | 50 / `[847,628,296,530]` | Entire outer/inner ring boundaries, semicircle arc and diameter, all hatching, both а/б labels. Owner115 is explicit; caption's physical adjacency to116 does not change ownership. |
| 60 | 51 / `[824,486,422,469]` | Complete slanted boundary p, hatch field, AB and DE, fine A-M-E stroke, M crossing mark, A/B/C/D/E/K and p/M labels. C's small circular depiction/central mark and very faint K ink remain as printed, without reinterpretation or newly drawn dots. Section12 body figure, not an exercise attachment. |

## Independent Rows And Completion Boundary

The visual row tallies agree with current audits, without running the counter or taking expected counts from its output:

| Physical page | Source-derived tally | Current audit |
| --- | --- | --- |
| 47 | exercises9 + title1 + prose8 + separate caption53:1 + folio1; caption54 adds0 |20/20|
| 48 | prose18 + separate caption56:1 + folio1; caption55 adds0 |20/20|
| 49 | prose3 + exercise heading1 + exercise rows5 + two captions2 + folio1 |12/12|
| 50 | exercise rows25 + folio1; caption59 adds0 |26/26|
| 51 | exercise rows3 + title1 + prose20 + folio1; caption60 adds0 |25/25|

All five audits have no errors. Decorations do not change the one-row folio count. This review does not approve a new source range, assembly or lesson modernization. The parent reports52/figure61 separately reviewed; that evidence is not claimed as this reviewer's work. The planned11-52 source assembly targets modern s9/s10/s11 only. **s12 remains incomplete**; its opening and downstream61 reference are not completion evidence. Actual modern s9 templates are still parent-supplied prerequisites for retained figures37-42's first bind/render; no source inventory repetition is needed.

## Observation Hashes

Paths: `C` = `.tmp/ld-s10y-lesson/6-8g/pages`; `A` = `ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages`. These bind the inspected pre-footer-repair snapshots.

| File | SHA-256 |
| --- | --- |
| `C/0047/page.png` | `013246250d638ca83fd44c4d3fc3139d393237583d78c8054e8a88e489c0ed60` |
| `A/0047/page.md` | `8abc7efdb5d0e3b4b81d7a02c9268823f63d0020e0a9d28cb2797deffd98ba0c` |
| `A/0047/page.json` | `44876e6b871902ff63188eda654ac2aaa6688363fc7af27bb916ef00144dbf4a` |
| `A/0047/audit.json` | `6f05eef52ee4e289903666fc799d1321a1ca9e3854a67af09853438f021e335c` |
| `C/0047/figures/fig-53.png` | `de291023adcc61a513976e65c8125bf168b133cd27aa173bd5fd05bb51469533` |
| `C/0047/figures/fig-54.png` | `9bc8e1e8b5befe8b8a64ca5d0dc25956409aa810c99cf2fb560734d398cd157c` |
| `C/0048/page.png` | `7593f5dbb514c67478b34e5d6bc6c35b18ed7a98679befea0d3506efa2bbbd88` |
| `A/0048/page.md` | `de808a63d66aba5f71e80b022a2a682dbbbc4cbdff10b5f2c6aae76014369bc0` |
| `A/0048/page.json` | `101cc1794b9f20c5294926cce53fd0e4450115fd7db87c5b81a674a1f736078b` |
| `A/0048/audit.json` | `0eef7c5a35865ea815ebba5386d54649052e73d1b0145ee7dff34134bf59b1f2` |
| `C/0048/figures/fig-55.png` | `21677db9a2c6efb642bc0f64f79fb45464c9a6e7f77c99df54788f10f027e346` |
| `C/0048/figures/fig-56.png` | `db5f43e10ce8b81596ab40634e3a98c25c6bea5bd6c48cad27b5b12449894605` |
| `C/0049/page.png` | `1339ddbcb33374b9f9b4fec34b45dbc4c7a7046c1943bbd61a1056d95d2c6fd0` |
| `A/0049/page.md` | `fd055582a9f098fb0255e9b15c3276fd07a9e713c11cdd136965d4bf3c42552f` |
| `A/0049/page.json` | `0477d7cf7707e192696643c567268680f699c77396a4b69731ab526f304f6360` |
| `A/0049/audit.json` | `3543a2662b3a4ac552e2617d20562bfcacfe089943ce1b89b76ba613fa61d86d` |
| `C/0049/figures/fig-57.png` | `254e023de8734f6b50d85d6e212e3cc2638bd720bcdb29521e19650853c584dc` |
| `C/0049/figures/fig-58.png` | `718edaa03db8a174de572c1fd2c9e74eaf5eae625bdf749cdfd8678210fd8a95` |
| `C/0050/page.png` | `6827f27d0945280f40e1f830240261bc761ce2996ef12bd1b9a7b412454c7dc7` |
| `A/0050/page.md` | `a9a0d99038a0c71f5b117b57f1df293ff6bcd2663a33e09b55c475e67a5c49fd` |
| `A/0050/page.json` | `4c69ed93fd98fcbbe4dbd87ffa00e67a3263bedfcb0bd9baea9dc17e682c0c5f` |
| `A/0050/audit.json` | `2a642dc240e8d8c531f8a5811ac5decf246b26fb5ec70f14d2e9f0a604f48b18` |
| `C/0050/figures/fig-59.png` | `32c7a17f1236bc42acf886421065d7a3413906199f3f348bbc91799443f594f0` |
| `C/0051/page.png` | `d5723bfc0371125d8d80950bbf6005bd64b9366e73366e1026217224bcf5e9ae` |
| `A/0051/page.md` | `86cd0c474bb3160be1dd9c177bf39e91bd54be430524e9eff116fe02996f2d92` |
| `A/0051/page.json` | `840e76419ab8eff096d3df263490a94479588a6d5dace6d529d312c1a0f442d8` |
| `A/0051/audit.json` | `d4c52d60aeba52ca08c9aaa1abf87b1ab28a0362406a4a8c7828fe7b469347d1` |
| `C/0051/figures/fig-60.png` | `37851886ac8f9c3b7e193a737c2da34dfe2d2129496f686574d5fe2e8d6388e1` |

Targeted marker enlargements, derived only from50's clean image and saved in ticket tmp:
`p50-review-111-115-markers.png`, source box `[125,345,235,815]`,4x, SHA-256 `3264700121bf1b7c9551a8906068d89eea0eff353f0475efbc450fc4120d7a3e`;
`p50-review-120-marker.png`, source box `[125,1575,235,1635]`,4x, SHA-256 `d21083564b299dfa34e2104ebe24493f2405b406519cc313154c8a3af8530db6`.

## Changed-Only Footer Confirmation

Current verdict: **PASS** for47-51 after the parent's footer-only repair.
Reused the already-observed source folio dots and every original prose,
formula, crop, ownership, row-count and open/cont observation above; no
second page/image review, counter run, finalize or assemble.

Each current page.md has exactly one foot body `· 37 ·` through `· 41 ·`.
Each corresponding page.json has exactly one `foot` block whose sole line
is that decorated folio. Replacing only that current foot with its original
undecorated number recovers the exact previously-recorded page.md SHA-256.
Doing the equivalent structured page.json foot replacement and original
two-space/newline serialization recovers the exact prior page.json SHA-256.
Thus no other page text, metadata, figure box, owner or boundary changed.

All five clean source PNGs, all eight finalized fig53-60 PNGs and all five
audit.json files still have exactly the observation hashes above. The
audits therefore remain20/20,20/20,12/12,26/26,25/25 with no errors; decorated
folios still occupy one row. This confirmation covers47-51 only, not the
parent-owned44-46/52 reviews. Section12 remains incomplete.

| Current artifact | SHA-256 |
| --- | --- |
| `A/0047/page.md` | `e1154c49edd4d02360e6fc40068a5f986986e12972ae0deccbcd349658b791cf` |
| `A/0047/page.json` | `1e81e234468cb2bceb262aec7b53a3c8070c91cf8e08ef8c91fc705e8442eaf0` |
| `A/0048/page.md` | `a030b5e399defea3b390dcae4f72a348531a0c27fa06958d1c28ba1ad8f0798a` |
| `A/0048/page.json` | `a88c00eb4d5ad4e5cb1f3859f814945cc443af758d50ed9f6df82de896757060` |
| `A/0049/page.md` | `f8f8385514ca8f2fac6c38ebe582b3c8b643eeead9e1e68068b4f4e05f2c4a28` |
| `A/0049/page.json` | `afe31e98bf5a57a87dbea04656a268c104d0f9b2fb57e0216621c1696040ecf0` |
| `A/0050/page.md` | `9fa7ac10790c8e8ee83edd7294339840fadca52979446de1324050fba2b268ae` |
| `A/0050/page.json` | `44cd4abeba67a4215c43137be850c4041d7af294f2632a6a7554e9f0cfe6dcb4` |
| `A/0051/page.md` | `61ce5d0714d6ddd3773ac0e735b624b5768ba567fc9c2c3d28c570ecc8caa605` |
| `A/0051/page.json` | `c9798621a4a56c30aa5c2febce5e671c2283c8b3f7f44b057b58931f6752f114` |
