# 9-10g physical44-47: sole independent source StageB review

Date: 2026-11-16. Ticket STEMROBIN-184.
Authority: parent-agent delegation under existing human ticket authority.
Role: independent source reviewer, not author Peirce.

**Aggregate verdict: REVISE. Three bounded body transcription differences; twelve source crops PASS. No counting defect or mathematical repair is proposed.**

This is the single substantive StageB comparison after original-only StageA. The full original pages were not reopened. All current MD/JSON/audits and saved actual finalize command/results were read; all twelve current source crops were actually opened separately at original detail. Only three concrete text-discrepancy regions were additionally enlarged from original pixels in memory. No source file, metadata, audit, crop, tool or author report was edited.

## 1. Immutable inputs and chronology

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
`T` below means `.intentfold/tickets/STEMROBIN-184/tmp/` relative to that workspace.

- Original-only StageA: `T/source-review-geo910-p44-p47-source-first.md`, actual raw SHA256 `da910f4aea9c9384ba3302e856d62a58310defe3dcd353ef4e653c43a3d41a9b`. Its bytes remain unchanged.
- Disclosed immutable author handoff: `T/source-geo910-p44-p47-author.md`, actual raw SHA256 `f5f36994d66e30789cff236cd09d5862b5e1c78828d654c746ce57dd8b6abc95`.
- Author evidence root: `T/source-geo910-p44-p47-evidence/`; its `hashes.json` actual raw SHA256 is `d88732e7ae383569ce5bafd76f525c6d52caff9f25dd18cd578dc64f57f1da7d`. A manifest/author observation was not substituted for direct image or text comparison.
- Current durable inputs: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/{0044,0045,0046,0047}/{page.md,page.json,audit.json}`.
- Current originals/crops: `.tmp/ld-s10y-lesson/9-10g/pages/<page>/`.

All twelve current durable MD/JSON/audit files are byte-identical to the corresponding `after-finalize/durable/` snapshot. All four current original PNGs and grids are byte-identical to both `before-finalize/prepared/` and `after-finalize/prepared/`. All twelve current crop PNGs are byte-identical to their `after-finalize/prepared/figures/` snapshots. Thus the following findings concern the disclosed first result, not an unannounced later author repair.

## 2. Minimal findings

Coordinates are original `[x,y,w,h]`; JSON block and line indexes below are explicitly zero-based, not invented stable source-block IDs.

### R1: physical45 literal 连结 was changed to 连接

- Current `0045/page.md:131`; `0045/page.json /blocks/14/lines/1`:
  `于点 $O$ 对称的平行四边形 $ODEF$（§12性质3）. 连接点 $C$ 和`
- Actual source:
  `于点 O 对称的平行四边形 ODEF（§12性质3）. 连结点 C 和`
- StageA independently froze `连结点 C 和`. A bounded original region `[120,1860,1200,150]`, enlarged 1.5x in memory during StageB, independently confirms the printed second character is `结`, not `接`.
- Smallest body correction: only `连接` -> `连结`. Preserve both paragraph flags (`cont:true`, `open:true`), both original physical rows, all formula names, and the continuation on46.
- Consequential metadata-only wording: `0045/meta.notes[4]` and `0046/meta.notes[1]` quote the incoming tail as `连接点C和`; those quotes should likewise say `连结点C和`. The latter is not a body error on46. The immutable author's narrative also quotes the mistaken spelling, but this review changes no author evidence.

### R2: physical47 作出的 was changed to 画出的

- Current `0047/page.md:75`; `0047/page.json /blocks/4/lines/1`:
  `б): 它们中的每一条都和画出的线段中的一条平行，且长度`
- Actual source:
  `б）：它们中的每一条都和作出的线段中的一条平行，且长度`
- StageA's original-only full-page observation and its independently enlarged text region `[110,760,1200,80]` already settled `作出的线段`. This region was not reopened in StageB.
- Smallest correction: only `画出的` -> `作出的`; retain the source second-panel selector, colon, physical row and `cont:true/open:false`. This is a word-fidelity error, not grounds to change any geometric assertion.

### R3: physical47 exercise109 sentence period was changed to comma

- Current `0047/page.md:101`; `0047/page.json /blocks/10/lines/0`:
  `109. 已知三角形和它的两条高的直观图，求作原三角`
- Actual source:
  `109. 已知三角形和它的两条高的直观图. 求作原三角`
- StageA recorded the sentence break. Bounded original region `[120,1800,1210,210]`, enlarged 1.5x in memory, confirms the printed baseline dot after `直观图`, followed by a sentence space and `求作`.
- Smallest correction: only `直观图，求作` -> `直观图. 求作`. Preserve the next physical row `形外接圆心.`, original two-altitude premise, original circumcentre request and closed exercise boundary.

### Concrete discrepancy resolved in the current author's favour

StageA initially recorded `等腰梯形有对称轴. 利用...` on45, while the current author writes `等腰梯形有对称轴，利用...` at MD103, JSON `/blocks/6/lines/0`. A bounded original region `[120,950,1200,190]`, enlarged 1.5x, clearly shows a comma with a descending stroke after `轴`. **Current text PASS; no correction is needed here.** This explicitly refines my initial punctuation reading without rewriting or hiding StageA. It was not inferred from grammar or the author.

These three new text details were emitted as image bytes in memory with the existing lesson Python/Pillow runtime; no scratch crop file, new full-page image, counter, renderer or browser was produced.

## 3. Complete page/object/flag comparison

All53 current typed blocks were compared, including all20 prose fragments, twelve figures, thirteen caption blocks, four folios, one exercise heading and three exercises. Formula wrappers, ASCII source sentence periods/parentheses, spaces around mathematical text, and the single `↵` are representation rather than invented source mathematics.

| Physical / printed | Page verdict | Detailed outcome |
| --- | --- | --- |
|44 /37 | PASS within this page's scope | All seven prose fragments and their19 source body rows agree. Initial `/blocks/0` is `p cont`, closes on this page; all later paragraphs close. Definition of direct image, dependence on orientation and projection direction, triangle examples, nonpreservation of angles/nonparallel length ratios, median preservation and parallelogram alternatives remain complete. Two figures/two same-row captions and dotted folio are faithful. Fig44 is only a forward text reference here. |
|45 /38 | REVISE: R1 only in body | All mathematical strings and conditions otherwise retained, including the literal plain `O` versus later `O_1`, literal `A_1B_1C_1D_1` versus earlier `A_1B_1C_1O_1`, later `ABCO`, both base ratios and three trapezoid relations. No guessed mathematical erratum. `/blocks/8` is `p open`; `/blocks/14` is `p cont open` across inserted figures and into46. R1 also affects this page's quoted metadata tail. |
|46 /39 | REVISE: R1 consequential metadata quote only; body/crops PASS | Initial `/blocks/0` is `p cont` and closes the previous construction with `D、A和F`. Tetrahedron's convex/concave alternatives and explicit proof deferral retained. All eight parallelepiped names, studied tetrahedron `A_1ABD`, three initial arbitrary segments and restriction on subsequent choices retained. Last `/blocks/11` is `p open`, ending literal `其它`. No body change is requested on46. |
|47 /40 | REVISE: R2/R3 only | Two top figures/captions precede transparent incoming `p cont`, which closes46's paragraph. Original `不象`, `其它`/`其他`, grade `十年级`, reference to old fig24, and no visible terminal period after `讨论` remain. Exhead is followed by all complete exercises107-109; no empty excont or open exercise is invented. All three segment types/direction in107, both numeric parts and `垂`/`线` source wrap in108, and full original request in109 remain. |

Exact structural checks:

- The same-row caption pairs are42/43,44/45,46/47,48/49,50/51 and52/53. Only each second caption is `samerow:true`.
- Physical45's separate `/blocks/11` caption owns the external typeset `а)　б)` row. Its two-panel geometric illustration retains its other, handwritten-looking selectors. No repeated ownership of the same ink is required.
- Formula `$|AB|:↵|CD|$` on45 contains exactly one source row break. The two JSON strings of the trapezoid paragraph therefore represent three printed rows. No numerator/denominator duplication or removed row is needed.
- Source geometric labels remain uppercase Latin with source subscripts; printed subfigure selectors use Cyrillic `а`/`б`. Exercise108's numeric source parts remain numeric, not invented alphabetic subparts.
- Exercise107 retains `$107^{\circ}$` and all three original source rows;108 and109 have no invented marker. Ex109 remains original circumcentre, not orthocentre.
- All source figures are numbered正文 figures; `owner_exercise:null` is appropriate. No source exercise requests/references a new or duplicated image among42-53.
- There are no actual teaching footnotes on these four pages. All four actual folios retain both dots: `· 37 ·` through `· 40 ·`.
- No new h3/title appears within these four pages. No whole enclosing lesson completion is claimed.
- Physical44's predecessor phrase “这” is author-reported from43, not independently reverified by this scope. StageA's explicit predecessor UNKNOWN remains; this does not contradict the actual incoming `样的图形` or justify reopening43.

## 4. Printed-row reconciliation and actual saved finalize evidence

StageA's20/16/12/18 ledger counted body plus numbered-caption baselines, excluding foot and retaining fig47's selectors in whole-figure ownership. Current author's ownership separates its outer typeset selectors into a caption row. Actual horizontal-sharing reconciliation:

| Physical | Body rows | Numbered-caption shared physical rows | Additional separately transcribed panel-caption row | Folio row | Full current total | Saved MD / printed result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
|44 |19 |1 |0 |1 |21 |21 /21 |
|45 |14 |2 |1 |1 |18 |18 /18 |
|46 |10 |2 |0 |1 |13 |13 /13 |
|47 |17 |1 |0 |1 |19 |19 /19 |

Thus the actual total is71 rows under current figure/caption ownership. It is not70 by forcing StageA's earlier envelope ownership, nor is a new body row implied on45. No `count_exclusions`, fabricated formula break, omitted text or manual expected-count override is warranted.

Read saved per-page `finalize-run.json`, `finalize.stdout.txt` and empty `finalize.stderr.txt` under `T/source-geo910-p44-p47-evidence/<page>/`. The exact common argv is:

```text
[".claude/skills/ld-s10y-lesson/.venv/bin/python",
 ".claude/skills/ld-s10y-lesson/tools/p2c.py",
 "finalize", "--book", "9-10g", "--page", "<44|45|46|47>"]
cwd: /Users/yong/.codex/worktrees/a07e/lemmadeck
```

Each saved run has `exit:0`, `signal:null`, `error:null`. Actual stdout reports respectively12/16/13/12 blocks,21/18/13/19 MD lines equal to printed lines,2/4/4/2 figures and0 normalizations; all four print `通过 行数对账 + 白名单 + 公式`. Current audits independently contain empty normalizations, unknown_chars, katex_warnings, count_exclusions and errors, with `errata:0`. These are real first-run mechanical PASS results, not semantic approval or reviewer-run gates. No failure is present in these four disclosed first-run records, and none was invented or rerun.

| Physical | Saved finalize-run.json SHA256 | Saved finalize.stdout.txt SHA256 |
| --- | --- | --- |
|44 |`e3446beb93c20ec4974a0af3584295a249a86970200aad407a647b6bd5a9e5ea` |`d8d4ba59dd9c73936eb842d9238c48043436679520e2a17271c6b2669dc39f92` |
|45 |`aa9c71f2c9a39a79d5b68d02212189b2234db957edaefca525cdb467f165cf15` |`bf9eadb92b2832ca0fcb4eb27f03e41f30022e78d1dbfd2c59610760ffb3df84` |
|46 |`7fde533bd0ed545ffe15bebfea1018bdb9f438287c14d2743024ffd3eaf8ec4d` |`03795713010969f992924ccbae1db93a16ef370c465b12ee55f7d6c8c857a785` |
|47 |`ae02009694727831263ee4c95deb889372c28b6c361c092033bf5f73b7df627e` |`10049dac246b75cf7384d00ee290cc3497104bacce1bd38076f4e03356fdcd1d` |

All four stderr files have0 bytes and raw SHA256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

## 5. Current source-crop gate: all twelve PASS

Each current PNG below was opened alone in this order42 through53, at original detail, and compared to my frozen original inventory. No spec/render/report was substituted for an image. Actual boxes match both page.meta.figures, figure blocks and audit records.

All current PNGs include12px padding on each side: image dimensions are `(box.width+24, box.height+24)`. A read-only RGB comparison using Pillow confirmed every crop's central declared region equals the original page at its exact `[x,y,w,h]` pixel box. Padding does not stand in for lost source ink. All crops exclude body and main numbered captions; fig47/52's intended internal selectors remain.

| Page / fig | Exact box | Direct full-crop evidence and outcome | Current crop PNG raw SHA256 |
| --- | --- | --- | --- |
|44 /42 |[147,735,458,321] |PASS: both completely hatched triangles, all six vertex names, three projector strokes and full upright wall contour retained. No clipped label or caption. |`840dda308db460541e341bcc28b92204afae8ed45ea6eb55f6653e5845c0ee21` |
|44 /43 |[744,801,537,244] |PASS: A/B/C/O/alpha, all three medians, AB single and BC double ticks and complete irregular plane contour retained. No AC tick invented; no connected source stroke discarded. |`e037449c64215e013546c0e784ac5425aceabbf64caf9548480b5adfbfa3fdb3` |
|45 /44 |[131,459,508,212] |PASS: all five labels, four parallelogram edges, solid DB and entire plane contour. Original isolated blob below-left of B retained unnamed. |`84f2e30929eeae0c0fc6702a86fb43f3b3d72c7d366f90723ee109196a762a03` |
|45 /45 |[858,441,411,238] |PASS: full trapezoid/alpha patch and all A/B/C/D labels; no invented right angle, diagonal or measurement. Original small plane-border ink discontinuity is retained, not repaired. |`b0a93b958a118777a2cbbc10e7766732db8b901b6871c781b68f9325b13921ec` |
|45 /46 |[125,1536,459,191] |PASS: seven labels in original B/N/E/A and C/M/D order, both bases, DE and both MN continuing tails. No square or equality tick added. |`c40873ef1e49c0c875cc961cbdd58965eae4d6e0b0e719b081e7455199d62275` |
|45 /47 |[701,1412,566,315] |PASS: both hexagons, all fourteen names including O_1/O, both diagonals per panel and internal selectors retained. External typeset selector row is separately and faithfully owned by caption text. |`a064e8a9d9eb7c35a781a7633a2de26519462941404453868550863771d0e4c4` |
|46 /48 |[159,612,588,368] |PASS: entire unlabeled wire tetrahedron, its rough/doubled wire ink, shadow network, four projectors/short extensions and full wall contour retained. No names inserted. |`3b87fca16c3eff86a0c154d2d2be9b48d864799e33a7480219173c43f9d56846` |
|46 /49 |[855,611,405,383] |PASS: four labels/four outer edges, solid DB and dashed AC complete; crossing does not acquire a new point name. |`49c4c72bb3bb28a360e16238ebb1c15e4438e8b9044329f55d461559cbf5d514` |
|46 /50 |[161,1267,387,363] |PASS: outer ABD triangle, internal C and all three dashed C spokes complete. No metric mark or unlabeled vertex lost. |`ebb7e9dcf4ab9fcaa768b7aee2641a897e06ce0158fb6f3e7843f2656dced165` |
|46 /51 |[741,1278,514,388] |PASS: all eight labels/twelve box edges, solid emphasized DA_1/BA_1 and dashed DB retained, alongside hidden BC/CD/CC_1. No diagonal omitted or bottom/top label clipped. |`f10b6b23792b7b172b25d8ec1c3fef160ca0737ce579d73513a67ba338e11b34` |
|47 /52 |[134,232,525,364] |PASS: first panel's four dark dots/four names/three finite segments, second panel's eight names/twelve edges/three hidden edges, both selectors retained. No extra diagonal. |`066f2e5f4e98f11938870aa40701c124b1401bfc013b5fa10fdf74da961804ef` |
|47 /53 |[671,317,605,263] |PASS: both complete cube images, alpha, all hidden box strokes and separate interrupted plane contour retained. Entire right/top protruding image remains inside crop; plane crossings are not named points. |`2cdd0b5f80d7716c8fe5bbd5d51475e6f1f10fb9af2b8e2763511913b70580a4` |

Exact current path for each crop is `.tmp/ld-s10y-lesson/9-10g/pages/<page>/figures/fig-<NN>.png`; saved equal copy is `T/source-geo910-p44-p47-evidence/<page>/after-finalize/prepared/figures/fig-<NN>.png`.

Source graphical uncertainties remain faithful rather than silently resolved: fig44's blob has no invented name; fig43 has no confidently observed AC equality ticks; handwritten fig47 selector shape alone cannot distinguish Latin/Cyrillic code points. These are not crop defects.

## 6. Actual current identities

All hashes in this report are actual SHA256 of file bytes, not mathematical digests, source guesses or SHA1. All four page JSON identities bind book9-10g, physical pages44-47, actual printed pages37-40, dpi300 and1506x2126 render dimensions. PDF binding is unchanged:
`1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a`.

| Page | Original page.png SHA256 | Current durable page.md SHA256 |
| --- | --- | --- |
|0044 |`4c250ed6feaebf9a9f241bd7c40ec414cab621b0ec2db7b47aac0c51bbcfeb5f` |`dfc083028dd2b54d32654ac98b2cfed47d87b434657eced0059fc7dc83917e5a` |
|0045 |`e7cf29af729553b90d17e4edbab030181bf0dc74a2011833693c26214d144c8a` |`2e5ce060297e397091d6739b975ee0993728bac42ec528bd8453c94e2f7e5601` |
|0046 |`0f9998f699da0487e77c26d168fa3750e86e7b462acaf81ef385caa5e09fe77b` |`a007d557ab77bbb0cef70291075efb498acb9cad9f27210732addb9b3213a88b` |
|0047 |`7b59b0eac45959921e83dd602b7c0a4080b2a0b4e37a0c9d2ad8044ddb185bfd` |`4845c513b4cdc4d23c55058dce98c55d0c3067c441a2424224d79a3d944c296a` |

| Page | Current durable page.json SHA256 | Current durable audit.json SHA256 |
| --- | --- | --- |
|0044 |`1d7efd8480a0b3902fe94c1608038d8a34d479427985a21bf9aa1ae47f8e33cf` |`c6c9f7f73b6c8163b57003abc344eaba632e8e8dc224f688047e51db93537895` |
|0045 |`d6248d998531d15e5c33ab1f99f2728212ba190ef3cb2badc6e0eca0d414e82c` |`157d7abd6991250cd133805fb4a0b5b9e34436baf0ad2164128a137e162b8b75` |
|0046 |`8d38cf66f126505a896372fcac18816473d28092eebf4ef06cdc80f55d81e08b` |`017229fa40d1d6d0dd7dae7264c1d555c6d99a5675d9dbfcd2d5e6760dcb56e5` |
|0047 |`8e5d7e0c1e0be39498a92eda82ea5ab0d60745f614fd3799456803fe9985de73` |`46d4a0e62e82a171f7b0dcd4dd5e8ec0db2ffcce432eb0d0a1b2a03177379861` |

Current original grid hashes also equal StageA:

-44: `cdebd1ce0b5568a9cfa385b1d9c46d1a258e1906e2a10daa78fa1b131be6f310`.
-45: `bf46c68258275a30cd537b817febb6b4d72401daa51b08932dc2664a9adaeb1b`.
-46: `6cec6563e721563e08366882c6f849abd8a3e470553cbaea3c5e213dc5e8d4c6`.
-47: `f24b99b84f90e8cbe41d1d99f68c29331a5d8f852d82428b7c555289d6251b98`.

## 7. Stop and affected-only handoff

Parent should address only R1/R2/R3 and R1's two consequent metadata quotes, retaining first-result evidence and all existing correct mathematics, rows, flags, crop bytes and boundaries. Original literal O/O_1 and quadrilateral-name discrepancies remain source facts, not newly authorized errata. No full-page/whole-batch repeat review is requested.

Only this new ticket tmp report was written, using apply_patch. StageA and all author/source/evidence files remain untouched. No modern/answers/choice/other solve/review inputs were read, and no prepare/finalize/counter/validator/test/assembly/vectorize/tool/source/index/Git/DB/network/browser/other-chat action was run. The read-only crop pixel comparison and bounded original text details are part of this first source StageB, not a second figure gate.

**STOP at immutable StageB report. Await parent; no repair, promotion or rerun performed.**
