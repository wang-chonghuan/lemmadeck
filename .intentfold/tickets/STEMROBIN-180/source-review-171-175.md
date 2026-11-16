# Source171–175 Independent Full Review

Date: 2026-11-16. Identity: `independent_agent`, current Codex reviewer, not Wegener and not the author of these pages. This is one complete source review, not an answer review or modern-text approval. The s15 answer-author role remains paused at its previously frozen raw solutions pending the final160 notification.

**Verdict: FAIL. No whole-page or cohort approval and no approved manifest is issued.** All five pages have a genuine footer-sign omission;175 additionally changes a task's printed verb. Existing mechanical PASS, complete crop checks and unaffected-body conclusions are preserved separately. No repair or gate rerun was performed.

## Confirmed Findings

### B175-1 — Exercise32/3 changes “浮在” to “浸在”

Affected unit: physical175, printed164, `p0175#12`, `ex 3 open` under “练习32”. The actual final printed line reads:

> （3）图169所示的是同一个物体分别浮在两种不同的液体中的情

The frozen MD line91 and JSON `blocks[11].lines[0]` instead read:

> （3）图169所示的是同一个物体分别浸在两种不同的液体中的情

The source character is **浮**, not浸. It was checked in the full original page and then an exact original-pixel strip, x590..1350/y1915..1985, displayed from memory without writing an image. This changes the stated physical condition, not merely a synonymous editorial spelling. The correct `open:true` and final “情” do not excuse the wrong verb. The handoff's `last_open.text` repeats the same incorrect “浸在” and is not an independent source witness.

Exact candidate: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-171-175/artifacts/6p/pages/0175/page.md:91`, plus its paired `page.json`. **FAIL.** No176 page or fig169 pixels were opened, and no missing continuation was inferred.

### B171-F … B175-F — Both printed footer dots are omitted

Every original page visibly has a round dot before and after the printed page number. Every frozen MD/JSON footer contains only the number. These are deliberate matching footer marks, not one isolated scan speck. The source contract requires source signs/footer fidelity; correct `printed_page` metadata does not preserve omitted printed glyphs.

| Finding | Source unit | Actual printed footer | Frozen foot lines | MD location |
| --- | --- | --- | --- | --- |
| B171-F | `p0171#12` | round dot,160,round dot | `["160"]` | `page.md:100` |
| B172-F | `p0172#8` | round dot,161,round dot | `["161"]` | `page.md:78` |
| B173-F | `p0173#10` | round dot,162,round dot | `["162"]` | `page.md:82` |
| B174-F | `p0174#11` | round dot,163,round dot | `["163"]` | `page.md:105` |
| B175-F | `p0175#13` | round dot,164,round dot | `["164"]` | `page.md:94` |

All paths in this table are under `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-171-175/artifacts/6p/pages/NNNN/`. Both the MD and corresponding JSON omit the marks; there is no normalization record explaining removal. Accepted faithful middle-dot encoding can represent such round signs, but this reviewer does not edit or select a repair.

Each affected footer is **FAIL**. This leaves171–174 body conclusions reusable but does not approve those whole pages.

### Preliminary Reading Corrected, Not A Finding

An early full-page reading suggested that171 Exercise30/3 might contain an added“体”. A detailed original-pixel strip x550..1200/y450..515 shows **圆柱体** clearly. The frozen text is correct there. That preliminary concern was withdrawn during this single review and is not a defect, repair request or extra review.

## Scope and Actual Inspection

Read the complete current `ld-s10y-lesson` cap1 source/block/character rules and cap3 vector contract, plus `profiles/soviet-cn.json`. Every actual ungridded `page.png` was opened individually at original resolution, in order171,172,173,174,175. Every complete MD, JSON and audit was read. All four actual crop PNGs were then opened individually. No multi-page downscaled sheet substituted for source inspection.

Only the last open block was exposed from durable170 JSON for continuation context:

`（1）在天平的横梁上悬挂两个质量相同的圆柱体，一个是铅的，一个是铝的. 这时天平处于平衡状态. 若把这两个圆柱体同时浸入水中，天平的平衡受不受到破坏？若浸入酒精中又如何？试说明理由，并`

This is the durable tail, with no extra period after“并”. The source-author handoff's historical user-supplied prefix is not substituted for it. No170 pixels or earlier content were reviewed.

The permitted TOC identities `phy6-c4-s17` and `phy6-c4-s17-t1` were read only to check the unnumbered portrait's explicit lesson ownership. No lesson answers, book answers, main-private solutions, choices, interactions or modern s15 text were read.

## Complete Body and Object Audit

The table records actual source comparison of all54 blocks. “Body PASS” excludes the separately failing footer, not the page as a whole. Rows are independently counted printed rows including the footer; their totals are not proof of textual correctness.

| Physical/printed page | All blocks and source rows checked | Unaffected substantive conclusion | Whole-page result |
| --- | --- | --- | --- |
| 171/160 |12blocks;27rows: ex1-cont1 + ex2/3/4 three rows each + ex5 one + portrait0 + cap4 + heading1 + prose3/5/2 + foot1| Body/caption/ownership PASS; footer B171-F | FAIL |
| 172/161 |8blocks;26rows: prose1/3/6/6/3/3/3 + foot1| All prose/quoted continuation PASS; footer B172-F | FAIL |
| 173/162 |10blocks;25rows: quote-cont1 + exhead1 + q1 six + h3 one + prose4/4/1/4/2 + foot1| Body/full task/emphasis PASS; footer B173-F | FAIL |
| 174/163 |11blocks;22rows: prose1/6 + two figs0 + two same-row captions1 + prose3/5/2/3 + foot1| Body/formula/figure grouping/emphasis PASS; footer B174-F | FAIL |
| 175/164 |13blocks;19rows: cont1 + exhead1 + questions2/1/2/2 + exhead1 + exercises4/2 + fig0 + cap1 + ex3-open1 + foot1| Other questions/exercises/caption PASS; ex3 B175-1 and footer B175-F | FAIL |

171: Exercise30/1's actual continuation is“用实验检验所得的结论. 浮力的大小与物体的体积有什么关系？”, correctly `ex 1 cont`. Exercises2–5 retain both-liquid/balance experiments, iron/aluminum and added-weight conditions,0.1分米³ with water/kerosene, and lead diving weights. The actual wording“圆柱体” in Exercise3 is preserved. The four portrait-caption rows preserve287年—212年, ancient-Greek identity, physical/mathematical work and the lever/fluid-statical references. The biography is a caption, not a newly fabricated exercise or numbered illustration.

The unnumbered portrait and its caption both explicitly belong to `phy6-c4-s17`; the actual supplemental-reading heading follows them and is the distinct `phy6-c4-s17-t1`. No misleading nearest-exercise ownership or new numbered figure was invented. The source names希罗/叙拉古,公元前250年,王冠,工匠,黄金/其它材料 and the physical line order all remain. The final prose block correctly stays open after“同体积的水的”.

172: All seven prose fragments retain19.3 twice in the first row and once in the next paragraph, the source spelling“制做”, weighing in air/water, displaced-water weight and volume/density reasoning, the excited quotation and《论浮体》. The source prints“判（公理）七”; the unusual source word is correctly retained and documented, not silently replaced. The open quoted paragraph ends after“物体所排开的液体”.

173: The first fragment“的重量.” closes that quotation. Exercise31 has no printed exercise number; `q1` is an internal identifier only. All six printed task rows remain one task, retaining20N,18.75N, requested density, the gold/silver composition request, and the deliberately rounded20000/10000kg/m³ densities. No task was lost or fabricated by splitting. “65. 物体的浮沉” is a genuine heading. The initially stationary body's two vertical forces and the greater/equal/less comparison, the bold three-case explanation, changing immersed volume on rising, and equilibrium at the surface all remain. The multi-row emphasis in case2 is preserved. These three cases are prose, not a new exercise group.

174: The complete overflow-weighing experiment retains initial filling to the outlet, prior air weighing, displaced volume, and the comparison to the floating body's weight. Fig166 and167 captions actually share one printed row; the second `cap` has `samerow:true`. Fig-internal石蜡/软木 labels are retained in the crop, not copied as new body rows. Water/alcohol/salt-solution/mercury examples, bold displaced-liquid-weight statement and dotted source emphasis converted to Markdown are retained. The density comparisons retain the **实心固体** condition, all three comparison directions and the iron/water/mercury examples. The formulas are faithful `rho=1000` and `rho=800`, withkg/m³ units and the actual line break. The final paragraph remains open after“在上”.

175: “面.” correctly closes174's open paragraph. The four “问题” tasks and separate“练习32” retain their local printed numbering, all requested explanations, the boat/nail contrast and all exercise1 stages. The first reference genuinely prints“图168，б”; the next is alsoб and the restoration referenceв. These are actual Cyrillic codepoints, not Latin replacements. The caption remains outside the crop. The final exercise is correctly open and retains the visible terminal“情”, but its floating condition is mistranscribed as B175-1.

## Cross-Page, Source Errata and Uncertainty

- 170→171: correct same Exercise30/1 continuation from the only permitted durable open tail; no previous-page pixels.
- 171→172: `p open` / `p cont`, “同体积的水的” + “重量的19.3倍…”, correct without inserted content.
- 172→173: quoted `p open` / `p cont`, “物体所排开的液体” + “的重量.” and the closing quotation, correct.
- 173→174: preceding paragraph closes normally;174 begins a new paragraph, not a false continuation.
- 174→175: `p open` / `p cont`, “在上” + “面.”, correct.
- 175→176: Exercise32/3 must remain open. Only the source word浮 is established here; no next-page text or fig169 is inferred or reviewed.

The source's first “图168，б” conflicts with the plainly labelled initialа state in the actual three-state figure. The raw letter is correctly preserved, and the source notes explicitly identify that printed cross-reference issue. It is a source-print issue, not authorization to correct raw text or add an answer. No additional confirmed mathematical formula erratum was found in the allowed pages. The source's unusual“判” and density rounding likewise remain faithfully recorded.

## All Four Actual Crops and Vector Evidence

Opened every actual crop individually after full-page inspection; compared the source objects and boundaries rather than treating component counts as completeness proof.

| Crop | Source page/exact box x,y,w,h | Actual PNG pixels | Independently observed retained content | Existing vector mismatch |
| --- | --- | --- | --- | --- |
| `tbl-p0171-01` |171;929,622,403,509|427×533| Complete oval head/shoulder portrait and halftone field, no biography text baked in; explicit owner as above |1.437% |
| `fig-166` |174;314,727,317,255|341×279| Floating block partly immersed, filled vessel, overflow spout and receiving cup/liquid; no lost cup edge or added readings |0.028% |
| `fig-167` |174;823,761,416,200|440×224| Complete basin, water level/marks, both labelled bodies石蜡/软木, and their different immersion; no shifted source labels |0.000% |
| `fig-168` |175;221,1417,1019,429|1043×453| Allа/б/в stages, balances/weights, overflow vessels/spouts, body in latter stages, and receiving cups; no omitted subfigure |0.001% |

Each PNG has12px white padding per side. A read-only pixel comparison confirms all four **source-box interiors** equal their original-page pixels exactly. Two full padded rectangles differ from literal page crops only in the white padding, not the interior; no interior fidelity was falsely claimed from file-byte equality. Source and crop visuals were both inspected.

Parsed each complete existing SVG as XML, without rendering or modifying it. Each has the corresponding crop-sized viewBox, one combined `path`, `fill="currentColor"` and `fill-rule="evenodd"`; there are no image/script/foreignObject layers. The closed contour counts are2912/97/72/132 respectively, including holes; these implementation counts are not presented as source-object counts.

Existing official vector stdout explicitly records the four mismatch rates above, all below the2% source-vector contract.172/173 vectorize were genuine no-figure operations. This is reused recorded mechanical evidence, not a newly performed raster comparison or vector gate. No claim is made to have opened a newly rasterized SVG preview.

## Frozen Hash Binding

Candidate root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-171-175/`.

Author handoff:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-171-175/author-handoff.json`

SHA256: `bb5959fa7c02dd6a63a360395e24dd59c2dc9cfe6d4058dffa77d59e128cf9e2`.

Exact author manifest:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-171-175/manifest.json`

SHA256: `744afca4d6ea94b1a8b8f7e76b8e7f8db7923622f8a23591097ef38de558fa6f`, matching main's notification. All92 distinct listed files were rechecked for exact byte count and SHA256: **zero mismatches**. This immutable candidate manifest is **not** an approved manifest.

| Page | Original page.png SHA256 | page.md SHA256 | page.json SHA256 | audit.json SHA256 |
| --- | --- | --- | --- | --- |
|171|`8bd34e86b745f2bc7427edbadc149f566a4e67f938ed3b6204e87eaf65c6d585`|`3210a07f816908a67886b0ed8e20d95b7270e2010eabed32747f83acd36122f5`|`44e8851c8a49eb883733c483588466a53d949f2aafbedf80284ed7badfa704cc`|`3580fc2432357adc097e33021a3f25ee7d5f1444a414f3452cca96bc71f01314`|
|172|`b6dc96c4b3db2dd3f076e637ca7e786df3e12cd404a70c650bbc70c236755105`|`526d714ff6e8e4914da69950fd54e0a3a192007ce65a0c54e0beef0a52df4742`|`365b68609800df8b221cdcf3c89b207b95759e3773ce2ee294bb765414f48fa6`|`f07bd6baf7c7bc8b8909ac2f95956f430422856ddbeba7c3af8e0e714bd43e15`|
|173|`d280e693c6ea8b3850a9356dda7ce3e4a9e1c34c74d7db24f0188ca71be1c601`|`6f0f08e043e800b13e6a22d70a76cddefff5b5d7f792261a5734ae52ab865b5c`|`feaf5d4dcb2aaf14f037e61b3d0cba47911a049197ad417a44d85dac2bc8114d`|`5ff030d0fffb9164932dbaf729722c354561aedf6dab02c54a3e4038207240b7`|
|174|`e6f8c2105f502a6e93f2138d763917c7e32de9b1493c9f69987a7c991bb893d6`|`65e42512938c43883632c19888c3f68508bb5cad821ea625adeb2f03e9d5268f`|`28f8d5c411b5c7332e8bc1d96890e24342dcc1360db317aeccb4f1d2aa4c7939`|`4be1c30160729ace59d6e98386c3a5b371cbd62e2536b3a0b5b0813f1e72a0b5`|
|175|`faa28ba0c978b98f1899b9fa973f5b16d4733243be3dc3cc4a1dee0dede962ee`|`533a6c893d24740e0ef43518bb5f75bd9b45b15f0edfbcdad6c9115c1094cb6f`|`db6b7df69d1f2d57f771b2d25ab00064d63627b8dcb6b2cf8f008c673022e20d`|`aea0dd6626f244cd42351bffc35fd10a655ee2cb574bc310478419c6663d54ef`|

MD/JSON/audit paths follow `artifacts/6p/pages/NNNN/`; full-page originals follow `work/6p/pages/NNNN/page.png`, all under the absolute candidate root above. Each MD frontmatter exactly matches JSON metadata; all54 block line arrays match paired JSON.

| Actual crop paths under `work/6p/pages/NNNN/figures/` | PNG SHA256 | SVG SHA256 |
| --- | --- | --- |
|0171/`tbl-p0171-01`|`1af979de014f2333fa6e692a43cf1b4a48507c7a4fac241abbc5d33a8e1de0c8`|`1295d337e504443ea0b1ff85b5b583a619d196e97f0dfa1dfc1e67eb3d444f1f`|
|0174/`fig-166`|`bef845efce09ec05c9b8b783635c8c39290827aa63970a7e3cbaa5bd79d9280f`|`ef4b5c43627719e0553bbde61e168e6542daa296994ba8e5ab798e59bbbfdb56`|
|0174/`fig-167`|`0b4a6a81ade3c19a2cf39d13398045f0a760c04d1b10419419c1a62ae734e152`|`b43532ac825997a8adeadbf6fa77e14335bdd26b81a32764ed0667691b6c309f`|
|0175/`fig-168`|`51cc8115c3e90b0bc68c80739a1d7b0f5617fcd015bbbc2904bbc4635285da57`|`573f3d87ce65bd6686c676453004829c5ead19d908e7a65726f1266bc85eb334`|

The only earlier-page context file is `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0170/page.json`, current SHA256 `b1767dd56b4d4ab0bf48829b4c3b35ac39c01edb403b1f7074c983a93b2f9473`; only its last open block was exposed/read.

## Mechanical Reuse and Final Disposition

All five existing audits show27/27,26/26,25/25,22/22,19/19; all have zero normalizations, unknown characters, errors and KaTeX warnings. Independently counted119rows agree, including the single shared166/167caption row. The correct line totals cannot detect either a one-character substitution or missing footer dots, which is why the source verdict remains FAIL.

Read and verified all15 original prepare/finalize/vectorize call records and their stdout/stderr hashes. All calls record exactly one invocation per stage/page, exit0, matching argv and stable tool hashes within each call. Shared `layout.py` hashes change between some stages/pages; that recorded concurrent tool provenance is retained honestly and is not attributed to a reviewer edit. No call was repeated. The author's `first_failure:null` remains unchanged; this report is the first substantive failure evidence for the affected source units.

Only this ticket report is written. No approvedmanifest, source/page/crop/SVG/audit/author-handoff edit, gate invocation, rendering, vectorization, assembly, promotion, Git, DB, network, model, dependency, browser or publication occurred. Two character-detail strips were displayed only in memory from existing page pixels; no evidence image or artwork file was created.

**Stop at FAIL.** Main receives exact affected units B175-1 and B171-F/B172-F/B173-F/B174-F/B175-F. All other checked body/caption/ownership/continuation/crop/vector-evidence conclusions above remain available for affected-only reuse after any separately authorized author action. This reviewer does not repair. Wait for finalmodern160/finaltext before returning to s15 answer production.
