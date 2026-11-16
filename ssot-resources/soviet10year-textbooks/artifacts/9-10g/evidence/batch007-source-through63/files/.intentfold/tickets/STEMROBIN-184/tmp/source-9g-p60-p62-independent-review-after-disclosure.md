# STEMROBIN-184 / 9-10g physical60-62 / same unique SOURCE StageB

## Verdict and scope

REVISE: semantic unit routing and literal source-text discrepancies.

This completes comparison of the disclosed physical60/61/62 Markdown, JSON, audits, recorded first-finalize outputs, and the four actual crops against the unchanged accepted StageA. Crop retention passes within this limited comparison. The candidates do not receive an overall source-fidelity PASS.

Physical63's unverified draft and all physical63 candidate/output files remain excluded and unopened. This review does not approve physical63 or complete §17. No source command was rerun, no math was solved, and no line counter, validator, test, Git, database, browser, app, modern edition, answer, or other-chat operation was used.

This is the same unique StageB resumed after corrected disclosure. The first binding-only failure remains preserved, not replaced or rewritten.

## Findings

### R1 / REVISE: actual unit boundaries lack semantic unit-start routing

Locations:

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0060/page.md:64`, and its JSON `blocks[3].kind`.
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0062/page.md:96`, and its JSON `blocks[11].kind`.

Both actual starts, `§16. 空间的方向` and `§17. 向量`, are recorded only as `h2`; neither page supplies an `h3` unit-start role or another disclosed semantic unit-start binding. The author notes justify this with absence of an independently printed h3. That is a font/printed-heading observation, not adequate semantic routing.

The already-read lesson skill's cap2 contract says h3 opens a unit while h1/h2 supply ancestor headings. The unchanged StageA establishes an actual boundary before §16 on60, and another before §17 on62 after167. These are not merely two ancestor-label changes within an unchanged preceding content unit. Under the stated routing contract, the candidates fail to represent those actual unit starts as unit boundaries; §16 prose/exercises and the start of §17 cannot be accepted as correctly routed merely because their printed titles are present.

Required correction is semantic unit-start routing for the existing printed §16/§17 headings, consistent with the lesson contract. Do not invent a second printed heading, change the title, turn prose items1/2 into units, or declare §17 complete. Preserve161-163 in the preceding §15 exercise context,164-167 under §16, and the final open paragraph under §17.

No assembly was run and no downstream misbinding is claimed as an observed runtime result. The finding is the missing semantic boundary in the candidate roles relative to the loaded contract and frozen actual source boundaries.

### R2 / REVISE: exercise167 wording diverges from frozen source

Location:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0062/page.md:94`

The same discrepancy appears in JSON `blocks[10].lines[1]`.

Accepted StageA:

```text
CD 的相关位置如何？
```

Candidate:

```text
$CD$的相互位置如何？
```

Math delimiters and readable spacing are not the finding. The source word `相关` was changed to `相互`. This does not match the frozen source-first observation. A more conventional geometric phrase is not evidence that the source printed it.

Within this authorization, no original reopen or new mathematical reasoning may adjudicate the difference. Restore the frozen literal or explicitly retain this discrepancy as UNKNOWN pending authorized source adjudication; do not silently approve the substituted word. This is a comparison finding against the accepted freeze, not a new glyph-resolution claim.

The rest of167 retains both ray-bracket expressions, ↑↑ versus ↑↓, the shared MN comparison ray, AB/CD query roles, and the final question mark. The exercise ends before the actual §17 heading.

### R3 / REVISE: punctuation was removed or changed within source clauses

R3a location:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0060/page.md:77`

JSON `blocks[5].lines[3]` has the same text.

Accepted StageA retains a comma after the closed figure62а reference:

```text
个半平面中的同一个半平面上（图62, а），那么这样的两条射
```

Candidate:

```text
个半平面中的同一个半平面上（图62，а）那么这样的两条射
```

The separator before `那么` is omitted. This finding is not about ASCII versus full-width comma encoding inside a figure citation; it is about the absent visible clause punctuation.

R3b location:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0061/page.md:66`

JSON `blocks[1].lines[1]` has the same change.

Accepted StageA:

```text
射线，这两条射线叫做同方向的（图63, а），如果 h₁ ∩ h₂ 不是
```

Candidate:

```text
射线，这两条射线叫做同方向的（图63，а）. 如果$h_1\cap h_2$不是
```

The source comma linking the two cases is replaced with a period and a new sentence. Preserve the frozen delimiter rather than editorially splitting the clause. No printed line was added or removed at this position; the issue is literal punctuation fidelity, not a line-count disagreement.

## Block-by-block comparison

Block references below are the existing JSON order, numbered from1 for readability. They are not generated expected counts. Matching text/continuation observations do not override R1-R3.

### Physical60 / printed53

| Block | Candidate role | Comparison |
| --- | --- | --- |
| 1 | ex161 cont, closed | Remaining parallelism items2/3 and final period match. It completes the allowed prior tail, does not repeat161 or start a new question. |
| 2 | ex162, closed | Both proof requests retained; second request starts on the first row and continues on the next. No added premise/figure/answer. |
| 3 | ex163, closed | Symmetry about O, self-mapping condition, center definition, question and all seven object types retained, including both line/plane union cases and the printed 并/集 break. |
| 4 | h2 §16 | Printed title and boundary position match; semantic unit-start role fails R1. |
| 5 | p, closed | Complete introduction retained, including 星际站 and 八年级学校课程. No new group heading or invented title. |
| 6 | p open | Prose item1, ray notation `[O₁A₁)`/`[O₂A₂)`, different parallel lines, α, §3, boundary `(O₁O₂)`, α₁/α₂ and same-half-plane case retained. Last character remains 射. R3a affects clause punctuation. |
| 7 | fig62, no exercise owner | Correct prose figure, with both panels retained in actual crop. No owner-ex fabricated. |
| 8 | cap62 | Correct single figure caption, separate from the crop and from body text. |
| 9 | foot | Printed53 retained as footer, not prose or exercise content. |

Source context from the accepted prior tail makes161-163 part of §15. The author's more limited tail did not identify that preceding section, so its inherited-section UNKNOWN is not independently wrong; it must not erase the review's permitted frozen context or justify moving those exercises into §16.

### Physical61 / printed54

| Block | Candidate role | Comparison |
| --- | --- | --- |
| 1 | p cont, closed | Initial 线 joins preceding 射. Same/opposite direction wording and62б reference retained, with paragraph ending after the second row. |
| 2 | p, closed | Number2 is prose, not a course/exercise. Same-line premise, ray-intersection criterion, ∩, and63а/б/в/г roles retained. R3b changes its source delimiter. |
| 3 | fig63, no exercise owner | Correct item2 prose figure; actual crop retains four rows and their labels/relationships. |
| 4 | fig64, no exercise owner | Correct explicitly referenced M/AB construction figure, not a third prose subpart or exercise diagram. |
| 5 | cap63 | Single separate caption retained. |
| 6 | cap64 samerow | Correct caption-sharing band with63; not duplicate body text or a merged figure. |
| 7 | p, closed | ↑↑/↑↓ signs, AB, M, m, m₁/m₂, `(AB)`, §4问题, common origin M, explicit m₁ same-direction role, bracketed `[AB)` and opposite ray retained. Preserves source period after the 如果给定 clause and 图/64 split. |
| 8 | p, closed | Both uniqueness claims, same and opposite direction from each spatial point, retained. |
| 9 | p, closed | Central-symmetry ray statement, source plane construction instruction and 公理9 retained. This is source prose, not a reviewer-supplied solution. |
| 10 | foot | Printed54 retained as footer. |

No new section/group/exercise is fabricated on61. All paragraphs close, but that fact alone does not give a §16 right boundary; it is supplied by the actual §17 heading on62.

### Physical62 / printed55

| Block | Candidate role | Comparison |
| --- | --- | --- |
| 1 | p, closed | Reflexive, symmetric and transitive same-direction relations retained, with h,h₁,h₂,h₃ and65 reference. No new proof. |
| 2 | p, closed | Literal 同一条直线 retained, not corrected to 射线. Three short printed rows and definition wording retained. |
| 3 | p open | Second direction paragraph begins and remains open at 集 across the figure/caption. |
| 4 | fig65, no exercise owner | Correct §16 prose figure, not164's tetrahedron or165's parallelepiped. Actual crop retains full arrangement. |
| 5 | cap65 samerow | Correct separate caption beside the short prose row ending 集. |
| 6 | p cont, closed | Initial 合 completes 集合, then complete final sentence closes before 习题. |
| 7 | exhead | Actual 习题 group retained; spacing does not create a new unit. |
| 8 | ex164, closed | Four stated tetrahedron rays AB,AC,AD,CD and both direction questions retained. Raised circle remains after164 in body; stable block label164 is not a deletion of that print mark. |
| 9 | ex165, closed | Parallelepiped name and ordered full ray list AB,AD,AA₁,BC,C₁D,BB₁,C₁C,A₁D₁ retained. Literal C₁D has no invented D₁. Both requests and 反方/向 split retained. Raised circle after165 retained. |
| 10 | ex166, closed | Literal1°) position retained, distinct from the main166 label. Transitivity question and source proof request with both rays opposite to the third retained. No answer supplied. |
| 11 | ex167, closed | Relations and question boundary retained; queried-word mismatch R2 remains. |
| 12 | h2 §17 | Actual printed title follows167. Semantic unit-start routing fails R1. |
| 13 | p open | Exactly the seen initial §17 row retained, ending 一. It is not complete §17 or exercise168. |
| 14 | foot | Printed55 retained as footer, transparent to paragraph continuation. |

All crop/caption roles are prose roles by explicit source references. No unnumbered exercise figure or missing owner-exercise condition is observed. The scalar/geometry descriptions are retained without inferred answers.

## Actual crop comparisons

Only these four actual source crops were opened, once each at original resolution, after authorized binding. No original was reopened.

### Figure62 / PASS for crop retention

Bothа/б panels, their irregular plane outlines, separators and rays are retained. Each panel retains O₁,O₂,A₁,A₂,h₁,h₂,α₁,α₂.

Inа, O₂ is above O₁ on the slanted separator; h₂ goes right to A₂, h₁ right to A₁, on the same side. Inб, O₂ is upper-left of O₁ along the descending separator; h₂ extends toward lower-left A₂, h₁ toward upper-right A₁, on opposite sides. Half-plane labels and all support strokes remain. Subfigure marks and a small ink mark below/right ofа are retained. The crop does not include caption62 or surrounding prose.

No arrow, point name, metric condition, coordinate or hidden-edge convention was added.

### Figure63 / PASS for crop retention

All fourа/б/в/г rows and complete finite support strokes are retained. O₁/O₂ dots and h₁/h₂ labels remain. Rowв correctly has h₂ over the left portion and h₁ over the right; rowг has the single coincident-origin mark and explicit O₁=O₂ label. No copied label order replaces the reversed third row.

The extra oblique ink afterб and the underline-like mark below O₁ inв remain visible; they were not removed or resolved into new mathematical symbols. No arrowhead or endpoint-inclusion mark was invented. Caption63 is excluded from the crop.

### Figure64 / PASS for crop retention

Both complete oblique strokes and A,B,M,m,m₁,m₂ labels remain. A and M have clear filled marks; B remains a label on the left stroke, without a newly fabricated separate point dot. The right line through M retains its upper m₁ and lower m₂ portions. No connector, arrowhead, angle, coordinate or equality tick is added. Caption64 and neighboring63 pixels are excluded.

### Figure65 / PASS for crop retention

Left h₃, middle h₂ and right h₁ are retained with distinct origin/incidence positions. The full plane outline and all three pairwise planar supports remain, including their extensions toward the contour. No support is replaced with a generic triangle-only shorthand; no named α plane or new origin name is added.

Small contour interruptions near the bottom remain visible and are not regularized into a claimed dashed edge. Caption65 and body prose are excluded. No axis, graduated graph, metric value or arrowhead is added.

There is no numerical read-from-graph plot in these candidates. Schematic finite stroke ends and ray incidences agree with the frozen inventory; exact endpoint coordinates, maxima, minima and numerical graph values are neither present nor fabricated.

## UNKNOWN preservation

Crop retention does not clear the frozen StageA's fine-source uncertainties:

- p60-U1: separately intentional point-dot shape versus thick joined strokes at ray/separator intersections remains UNKNOWN.
- p60-U2: O-shaped glyph versus zero-shaped type distinction remains a transcription convention; point-name roles and subscripts1/2 are preserved.
- p61-U1: extra oblique ink afterб remains visible and UNKNOWN as a symbol/blemish.
- p61-U2: underline-like ink below O₁ inв remains visible and UNKNOWN; no prime/vector/extra line is supplied.
- p61-U3: separately printed B point-dot intention remains UNKNOWN; its printed label/incidence role is preserved.
- p61-U4: exact typography/encoding of paired arrows remains UNKNOWN; visible ↑↑ and ↑↓ direction sequences match.
- p62-U1: tiny lower-contour/support interruptions remain UNKNOWN as deliberate dashes versus damaged print.
- p62-U2: separately intentional marker shape at the origins remains UNKNOWN; the three incidence relationships are retained.
- p62-U3: circle-like marks' exact encoding/category/difficulty meaning remains UNKNOWN; positions after164, after165 and inside1°) are preserved.

The author's empty `unresolved_source_glyphs_identified_by_author` and the audits' empty `unknown_chars` arrays do not supersede these independent source uncertainties. They do not constitute a glyph-resolution PASS. This review carries the UNKNOWN facts forward without adding errata, mathematical repairs, extra visuals or interpretations. R2 also remains an unresolved candidate-versus-freeze wording discrepancy under the permitted no-reopen scope.

## Corrected disclosure and evidence binding

Authorized immutable disclosure directory:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p60-p62-corrected-disclosure/`

| Input | Verified SHA256 |
| --- | --- |
| Accepted StageA, unchanged | `5383c0ab85d33e07716d73cf642c706419f10ce16bb56c5146187fa5d6b2c970` |
| Corrected immutable author manifest | `6913a8f2b75e1b6402e5532bca066ce9dc4996be9fd14fcaf18add47dbea5bee` |
| Immutable unchanged author report | `bda299305fc8e166c50a145c6c831b7445b9e38b6924493fe1bb16452e7d72a8` |
| disclosure.json, observed digest | `7ccdddfa68c5273f1272f8d0d741d56d8b91cd199d51f1696f952e814fdd0126` |
| Initial binding failure, original and immutable copy unchanged | `8b61a753606e5b58b14628e976dc56d93dbd7eb88f560a6451da647e060ec569` |

The author report was read in full. The entire authorized manifest was read as metadata, including all three command records and their before/after file inventories. Long repeated path prefixes were shortened only for read-only JSON display; the raw manifest hash above binds the actual file. No listed helper code, layout, template, source PDF, or63 draft was opened to infer content.

Earlier manifest digest `ad14607f3f40d7dabdba588f48507fce05791d145fd1e4c2ee73180a8d17cb36` remains only a historical observed digest. The corrected disclosure explicitly states its bytes were not retained; this review does not claim an earlier snapshot exists or that its contents are known.

All protected current candidates and crops match corrected disclosure and authorized manifest:

| Protected file | Verified SHA256 |
| --- | --- |
| pages/0060/page.md | `3d50f53def64975590701f27c99294914045c2a31eefbadb95ab2adb21e04a11` |
| pages/0060/page.json | `0a858d3cbbedacaf4fa40ecdfe837562fe1c2d7f17d44329f6ca40ad57e54c70` |
| pages/0060/audit.json | `59d21d8168df8b4dbd32c24c67a791864f5ed7b331fcb8138aff1f4260272350` |
| pages/0061/page.md | `c45fa7e79d7c2ae7c2051ee2f361fdc9a2c88a94a74093c27450cf2b8053ad80` |
| pages/0061/page.json | `4a0c889553f3a6380b64fff41f9e724b1a02b41ba190a619a59e99bc8d78c45b` |
| pages/0061/audit.json | `baa5c69b3aff92946ee3a16c9cded9a69e1284504087419263fda32bc1909b56` |
| pages/0062/page.md | `db3855fa26dad0e7abdc330e4e4d3d8b6555ea024a975397e8bb5d32ef72790d` |
| pages/0062/page.json | `bf61c0ca9187b07db949c1d04e49e1e7825e78a227b0fac079f45ff2695f6fca` |
| pages/0062/audit.json | `1619a15dff593b4727e2d027610114228f5672df062f0d3acb59e42c67afc87a` |
| actual0060 crop fig62 | `1a7fcf866312be5c9827e8185b55b297e16ae9edd2e2dc4e1dcc89d4268c7cfb` |
| actual0061 crop fig63 | `8bc29170e588184eb2c612dacba4c7bfbf0d83d88e1106454302ba50b8d8ac5f` |
| actual0061 crop fig64 | `1f27aa01ffb48f811328894e535ca46f5c9d534e9468e450d811965679efaafc` |
| actual0062 crop fig65 | `3eca7c34248a5a98b6c02cf830ffc13fd8edaf24a989c3b19d84db5502d23a86` |

The corresponding13 raw snapshot files under the manifest's `snapshots/p0062-after-first-finalize/files/` were also hashed and match these current-file hashes. Six before/after inventory files and the three initial draft files for60-62 were raw-hash checked against their manifest entries. Initial drafts were digest inputs only, not independent source observations;63's draft was not accessed.

## Recorded first-finalize evidence

The actual bound stdout and stderr files were read, not reexecuted. Manifest records exactly one first-finalize command for each reviewed page, with exit0, no retry, null signal/spawn error. These are recorded historical results, not new command results from this review.

| Page | Existing stdout observation | Bound stdout SHA256 |
| --- | --- | --- |
| 60 | Reports20/20, fig62, zero normalizations | `bad48e00f7af29abb4951521313e6e20b3b8a8dba690c54d60193548a9b24b0a` |
| 61 | Reports18/18, fig63/64, zero normalizations | `221e4c072abd20ef866d0807dbace5db05c4490933d0e44b87d1b39e782a1fbd` |
| 62 | Reports24/24, fig65, zero normalizations | `e0d7ac73dff365be877d42b1b2e5e8c4d98988e7bc78d1b3698fc692b28a1fdd` |

All three stderr files are empty and have SHA256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`. Current audits retain empty errors/normalizations/unknown-character/KaTeX-warning/count-exclusion arrays and zero errata. Figure identifiers/boxes agree between MD metadata, JSON and audits.

Those existing mechanical successes do not test semantic unit ownership or resolve source wording/punctuation. No expected line total was created, no count was recomputed, and no audit output was changed to obtain a PASS.

## Image budget and stop

| Load | Stage | Actual visual input |
| --- | --- | --- |
| 1-4 | Accepted StageA | Original pages60,61,62,63, once separately |
| 5 | Same StageB | Actual fig62 crop, once |
| 6 | Same StageB | Actual fig63 crop, once |
| 7 | Same StageB | Actual fig64 crop, once |
| 8 | Same StageB | Actual fig65 crop, once |

Hard batch usage8/8. Current image-context usage8/24. StageB added exactly four crop images; original reopens0, crop reopens0, other visual loads0. Binding-failure checkpoint added zero images. No ninth image is loaded or authorized.

Only this new after-disclosure review file was manually written. StageA, the original binding-failure report and preserved copy, corrected disclosure, author artifacts, source pages/crops/snapshots, book/gates/answers and other workers' edits remain unchanged. Stop at this limited REVISE; no repair, further gate, or physical63 acceptance is self-authorized.
