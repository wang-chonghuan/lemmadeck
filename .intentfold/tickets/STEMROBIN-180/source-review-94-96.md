# Source Review: Physical Pages 94-96

2026-11-15. Reviewer: main-session Codex, independent from source author Nash.

**First conclusion: FAIL only for one added comma in p0096#8.**
Physical94 and95 PASS; physical96's other text, all exercise conditions, source
figure74, and page structure PASS. The first96 snapshot must remain rejected
until its single correction is independently checked by another reviewer.
This is not modern-figure, answer, publication or whole-book approval.

## Actual Inspection

Opened each complete original300dpi page.png separately for94,95,96. Read the
entire corresponding durable page.md/page.json/audit.json, not a sample.
Separately opened all five complete page-scoped source PNGs70,71,72,73,74,
including rightmost and bottommost content and figure-internal labels.
The complete source was compared before this report was written.

Paths are relative to `/Users/yong/.codex/worktrees/0f12/lemmadeck`:
source renders `.tmp/ld-s10y-lesson/6p/pages/<page>/`; durable source
`ssot-resources/soviet10year-textbooks/artifacts/6p/pages/<page>/`.
Read93's final text only to test the incoming open/cont relationship; its
independent full-page review belongs to Banach. No97 pixels were inspected.

The original96 definition was also opened as a670x225 unmodified pixel crop
from `[200,1780]`, retained in ticket tmp/source96-definition.png. An in-memory
Sharp import was unavailable in node_repl; sips made the actual source crop
without altering the source. This diagnostic is not a source repair.

## Only Finding

p0096#8 second printed line currently says:

```text
表面上运动时，所产生的与运动方
```

The actual source shows:

```text
表面上运动时所产生的与运动方
```

There is no comma between 时 and 所. The current U+FF0C is an added glyph,
not normalization or a scientific erratum. Remove only that comma.
The punctuation after the complete definition and figure74 reference, all
other wording, and all quantities must remain unchanged.
Line-count25/25, matching MD/JSON and an empty audit do not settle this defect.

## Complete Page Ledger

| Page / block | Lines | Pixel comparison |
| --- | ---: | --- |
|94 #1/#2|0/1|Complete fig70 and separate caption; no text baked into crop.|
|94 #3|2|Incoming bold conclusion ends with same-direction resultant and sum of magnitudes, joining93's "两个力" to "的合力".|
|94 #4|2|Figure71 reference and exact R/F1/F2 symbols retained.|
|94 #5/#6/#7/#8|0/0/1/1 shared|Complete figures71/72; captions share one printed row, cap72 samerow.|
|94 #9|3|Opposite directions, same line, figure72 а,5N weight, string tied to pan, final"钩住" open preserved. Final5 has required join space before 牛顿.|
|94 #10|1|Printed footer83. Total10 distinct rows.|
|95 #1|1|Incoming"线" closes94's hook-string sentence;2N upward pull and figure72 б correct.|
|95 #2|3|3N reading,5N and2N forces, magnitude difference and3N=5N-2N all exact.|
|95 #3|3|Full bold opposite-direction resultant definition, larger-component direction and magnitude difference. Original"二分力" retained.|
|95 #4|3|Figure73 and F1/F2/R references exact.|
|95 #5/#6/#7/#8|3/0/1 shared/2|Equal-opposite forces, zero resultant, complete figure73 and cap,5N upward pull,zero pointer and5N-5N=0 all retained; open/cont across transparent figure correct.|
|95 #9|2|Complete bold statement: rest OR uniform straight motion, not only rest.|
|95 #10/#11/#12/#13/#14|1/2/2/2/1|问题; questions1-3 complete, no added answers; footer84. Total25 distinct rows.|
|96 #1/#2|2/1|Question4 completes prior questions1-3; exercise17 is separate heading, not an invented new course.|
|96 #3|2|Person70kg,box20kg,on shoulder, pressure on ground; every unit/condition exact.|
|96 #4|4|Four people,330/380N versus300/400N, direction and resultant both requested. All numbers exact.|
|96 #5|3|Parachutist uniform descent,total person-plus-parachute700N; resistance and scaled drawing requested; both arrows at same point on action line retained.|
|96 #6|1|38.摩擦力 title exact.|
|96 #7|8|Complete sled,inertia,nonuniform deceleration,skating boy,bicycle and force reasoning, including parenthetic decreasing-speed condition.|
|96 #8|3|Complete friction definition and figure74 reference; only extra comma described above FAIL.|
|96 #9/#10/#11|0/1 shared/1|Complete source fig74; cap shares last definition row;footer85. Total25 distinct rows.|

No source quantity, formula, historical wording or exercise was modernized.
The original approximations and qualitative statements were judged for faithful
transcription, not silently rewritten against contemporary science.

## Complete Figure Inventory

-70: two complete stand/spring states; Cyrillic а/б; left two chained weights,
right one larger weight; hooks, spring endpoints, crossbars, vertical stand
and bases complete. No numerical labels or newly inferred lengths.
-71: one circle/body; vertical co-origin same-direction F1,F2,R arrows,
including the inner short white arrow and complete lower resultant arrowhead;
all three original labels complete.
-72: left and right complete round dial instruments with stands,bottom0 marks,
and original needles; left weight on pan; right pan/weight/string,hand holding
the upper force meter and its2牛顿 label; Cyrillicа/б complete. No reading
invented from an unnumbered dial.
-73: one circular body; common vertical line,upwardF1,downwardF2 and shorter
downwardR, all tips and labels complete. Original solid/hollow distinctions
retained, no inferred numerical force values.
-74: left-facing prone boy and sled,complete boots and runners,snowy mountain/
trees, rightward friction arrow and F摩擦 label. The arrow is friction opposing
leftward sled motion, not a rightward velocity arrow. No caption or page footer
inside any crop.

Read-only Pillow assertions confirmed each crop's inner rectangle exactly
equals the source page box, with12px padding on each side:
70 `[358,242,876,492]`,71 `[272,1203,277,474]`,
72 `[842,1121,409,571]`,73 `[978,668,220,360]`,
74 `[915,1654,432,286]`. PNG sizes900x516,301x498,433x595,244x384,456x310.
No crop overlap or missing semantic edge found. This does not independently
certify SVG rasterization errors or any future modern redraw.

## Mechanical Scope And First Snapshot

Existing block parser reconstructs all10/14/11 blocks exactly from MD to JSON,
including every flag,label,box,owner and generated source figure id.
Printed-line counts10/25/25 match all audits; errors empty. Original page PNG
hashes match their stored render hashes. The read-only check exited0,
but explicitly states structural/crop PASS is not semantic approval.
No full-project tests or build ran.

| Page | First page.json SHA256 | Source page.png SHA256 |
| --- | --- | --- |
|94|`8d35e4a8d2fd422e9d65976e6100522400346c376840944ae545a3d3fae4ae44`|`35be178f2dddbd7aa7e243c5937125dc11f7212ae69ccc7aac2adec4897c8cf1`|
|95|`07b956eabed5b41c138aaeb0c7be8cfe9b1708d0e38bc213f2276a406d73aa3a`|`476a93c3d68964c1cd4dbf4203f37fb20246b7699f7b537dd62ed6c1025b1fd6`|
|96|`b7e2132d5b12afb6bb77a328d9646906e43304ccf4930030734eb10da108cc4e`|`ae027ece18698e585081a9cd5e097b1a841e2c5f67b54fdd2d03e6f8e51104f5`|

Rejected96 MD SHA `eef4924cbf125bb9032e135dfa8a558b03d9b67bd7dfe98d8e45ad91f51627ce`;
audit SHA `834dd0706b141c143351fb987ef40bdc9d194dc55b128cf4beda00c16fcff32f`;
figure74 SHA `65255ee854934d5a8b7e9ed24c1e4475bd1090084581abb66fb737133181e972`.
First96 MD/JSON/audit must be retained before the single repair.
This first review adds only its evidence/report, with no source mutation or
approval of future source/modern content. Subsequent author repair and
independent affected-only review are separate stages.
