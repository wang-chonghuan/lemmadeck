# PhaseB independent original-freeze vs exact candidate

Date: 2026-11-22. Disposition: HOLD. One released candidate, TEXT ONLY, 0 new image/ROI/decode and 0 native producer.

## Findings and exact repair locations

1. **HOLD-SOURCE-65-P8:** `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-work/artifacts/10c/pages/0065/page.md:78`, JSON `blocks[10].lines[0]` (`p0065#11`), changes the frozen source terminal colon after `连续并且有导数` to `。`. PhaseA L22 is `8. 对于所有的$x\in D(\operatorname{tg})$，函数$\operatorname{tg}$连续并且有导数：`. Restore the colon; document that no derivative follows on 0065 and 0066 starts with property 9. Add no derivative, fake cont/open, empty object or invented source erratum. The author handoff line 69's "complete sentence" claim cannot override the freeze. Candidate notes at MD line 25 / meta.notes[2] should distinguish actual page closure from the unresolved missing expression.
2. **HOLD-PUNCT-65-P4:** same candidate MD line 65, JSON `blocks[6].lines[0]` (`p0065#7`), has `周期函数：对于所有的`; PhaseA L17 has `周期函数；对于所有的`. Restore the frozen semicolon category. This is a category-level textual discrepancy; exact historical font shape remains UNKNOWN and no new glyph inference was performed.
3. **HOLD-PUNCT-67-NEGATIVE:** `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-work/artifacts/10c/pages/0067/page.md:64`, JSON `blocks[3].lines[1]` (`p0067#4`), changes the frozen terminal period after `是负的` into `，`. PhaseA L09 ends `是负的.`; L10 starts `就是说`. Restore a period category at that boundary, not a comma joining the source sentences. Exact period Unicode/font normalization is not settled here.
4. **HOLD-NATIVE-66-COUNT:** the exact first finalize receipt still records exit 1, printed 24 / authored 23. All frozen 22 body rows + 1 foot row are represented; all 22 tasks and four shared requests are present. No omitted source row has been found to "repair" by adding text. The extra native row's origin is UNKNOWN. Safe noncontent observations below are geometry BASIS ONLY, not an exclusion applied/approved and not a counter-result promise.
5. **HOLD-UNKNOWN-FIGURE/TYPOGRAPHY:** unknown internal ink, exact graph glyph/crop preservation and typography remain unresolved under the original freeze. `unknown_chars: []`, author `UNKNOWNglyph0`, 33 native components and "labels stay in crop" are not independent pixel/glyph/crop approval. Candidate prose inventory can be compared, but the actual crop was not opened or decoded.

No candidate, author report, PhaseA evidence or tool was modified. Repairs above are precise recommendations for a separately released affected-only candidate, not actions taken or permission for downstream production.

## Comparison method and normalization limits

- Authority: `phaseA/seal.md` and its three immutable source-first transcriptions; hashes and current candidate/receipt bindings are in `bindings.md`.
- `p0065#N`, `p0066#N`, `p0067#N` below are one-based block positions; JSON array indices in findings are zero-based. MD line numbers refer to the exact released bytes.
- Every source textual row is mapped below. Shared horizontal rows and true formula breaks are evaluated against the freeze, not against native expected counts.
- MATCH-TEXT means words, mathematical variables/operators/relations, task ownership and source row structure correspond; it is NOT glyph/font/crop or course approval.
- Differences such as ASCII source period representation vs Chinese full stop, spaces, footer dot codepoints and `\mathbb{Z/R}` vs `\mathbf{Z/R}` are recorded as typography/encoding questions, not solved by inference. Formula punctuation being moved outside math is not treated as loss of its category. Three category-changing punctuation discrepancies are separately held above.
- No equation was solved. No glyph was inferred from an answer, adjacent unviewed page, native schema, solver or author claim.

## 0065: every frozen row and object

Candidate MD: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-work/artifacts/10c/pages/0065/page.md`.

| Frozen row | Candidate MD line / block | Independent comparison |
| --- | --- | --- |
| L01 | 38 / #1 | Example 3 heading present, prose, not exercise |
| L02 | 39 / #1 | tg x = sqrt(3), same equation |
| L03 | 40 / #1 | Reference (2) and request/result introducer retained |
| L04 | 41 / #1 | arctg sqrt(3) + pi n, n in Z, trailing comma category retained |
| L05 | 42 / #1 | pi/3 + pi n, n in Z, example closes |
| L06 | 45 / #2 | Example 4 heading present, prose |
| L07 | 46 / #2 | tg x = 5.177 retained |
| L08 | 47 / #2 | Reference (2) retained |
| L09 | 48 / #2 | arctg 5.177 + pi k, approximate x=1.38+pi k, k in Z; k not n |
| L10 | 51 / #3 | Tangent properties introduction retained |
| L11 | 54 / #4 | Domain exclusion pi/2 + pi n and n in Z retained |
| L12 | 55 / #4 | Domain sentence second row retained |
| L13 | 58 / #5 | Range E(tg)=R and therefore retained |
| L14 | 59 / #5 | Unbounded-function second row retained |
| L15 | 62 before actual `↵` / #6 | Oddness and equality before source break retained |
| L16 | 62 after actual `↵` / #6 | Negative tg x after equals, real second row retained |
| L17 | 65 / #7 | All property-4 words/math present, but semicolon -> colon: HOLD-PUNCT-65-P4 |
| L18 | 66 / #7 | x in D(tg), tg(x+pi)=tg x retained |
| L19 | 69 / #8 | x=pi n, n in Z, tg x=0 retained |
| L20 | 72 / #9 | Source ]pi n, pi/2+pi n[, n in Z, tg x>0 retained |
| L21 | 75 / #10 | Source ]-pi/2+pi n, pi n[, n in Z, tg x<0 retained |
| L22 | 78 / #11 | Differentiability claim present, but colon -> period: HOLD-SOURCE-65-P8 |
| F01 | 81 / #12 | Printed number 59 present; two source flank shapes omitted from textual foot; exact flank glyph UNKNOWN |

- Object total: 11 prose blocks + 1 foot, with example 3 using five source rows, example 4 four, and properties 1-8 as source prose.
- Two-row property 3 is represented with one actual `↵`; this preserves source L15/L16 without an empty continuation.
- No new heading/exercise/request/figure/caption appears. All open/cont/samerow flags are false except the actual intra-formula break, not a flag.
- Independent row baseline remains 22 body + 1 foot = 23, matching native 23/23 but NOT granting source approval despite the punctuation defects.
- Page 0064 remains TEXT HINT ONLY; no new comparison or pixel approval of that page.
- The absence of a derivative after property 8 is not repaired by inventing mathematics. Source 0066 begins property 9; a trailing colon is not evidence for a real outgoing cont/open object.

## 0066: every frozen printed row

Candidate MD: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-work/artifacts/10c/pages/0066/page.md`.

| Frozen row | Candidate MD line(s) / block(s) | Independent comparison |
| --- | --- | --- |
| L01 | 40 / #1 | Property 9 first row retained |
| L02 | 41 / #1 | Full French interval and n in Z retained; tall fractions count one source row |
| L03 | 42 / #1 | Tangent increases statement retained |
| L04 | 45 / #2 | Single exercise heading 习题 retained as exhead |
| L05 | 48 / #3 | Shared proof request, p with owners 182-189 |
| L06 | 51,54 / #4,#5 | 182/183 same horizontal row; 183 samerow=true |
| L07 | 57,60 / #6,#7 | 184/185 same row; 185 samerow=true |
| L08 | 63 / #8 | Complete task 186 retained |
| L09 | 66 / #9 | Complete task 187 retained |
| L10 | 69 / #10 | Complete task 188 retained |
| L11 | 72 before `↵` / #11 | 189 first four angle terms retained |
| L12 | 72 after `↵` / #11 | 189 final strict comparison and -10 degrees retained |
| L13 | 75 / #12 | Unit-circle P_t condition, row ending 方 retained |
| L14 | 76 / #12 | 程 plus drawing request and P_t collection retained |
| L15 | 79,82,85 / #13,#14,#15 | Tasks 190/191/192 one row, last two samerow=true |
| L16 | 88,91 / #16,#17 | Tasks 193/194 one row, 194 samerow=true |
| L17 | 94 / #18 | Shared inverse-tangent request retained |
| L18 | 97,100,103 / #19,#20,#21 | Tasks 195/196/197 one row, last two samerow=true |
| L19 | 106 / #22 | Complete task 198 retained |
| L20 | 109 / #23 | Shared solving request retained |
| L21 | 112,115,118 / #24,#25,#26 | Tasks 199/200/201 one row, last two samerow=true |
| L22 | 121,124 / #27,#28 | Tasks 202/203 one row, 203 samerow=true |
| F01 | 127 / #29 | Printed number 60 retained; textual flank shapes omitted, exact glyph UNKNOWN |

All 23 frozen textual rows are accounted for. There is no missing extra "24th source row" established by this comparison. A source row and a block are different units: source 22 body rows + 1 foot corresponds to 29 blocks because parallel exercises are separate objects.

### All 22 tasks, individually

The following are source/candidate signature comparisons, not solutions.

| Task / JSON block | MD line | Frozen signature retained | Source layout |
| --- | --- | --- | --- |
| 182 / #4 | 51 | tg 200 degrees = tg 20 degrees | L06 left |
| 183 / #5 | 54 | tg 21.2pi = tg 0.2pi | L06 right, samerow |
| 184 / #6 | 57 | tg(-300 degrees) = tg 60 degrees | L07 left |
| 185 / #7 | 60 | tg 6pi = tg 0 = 0 | L07 right, samerow |
| 186 / #8 | 63 | tg 3.6pi = tg(-0.4pi) = -tg 0.4pi | L08 |
| 187 / #9 | 66 | tg 3 = tg(3-pi) = -tg(pi-3) | L09 |
| 188 / #10 | 69 | tg 10 < tg 15 < tg 30 < tg 60 < tg 75, all in degrees | L10 |
| 189 / #11 | 72 | tg(-75) < tg(-60) < tg(-30) < tg(-15) < tg(-10), all in degrees | L11-L12, one real break before final < |
| 190 / #13 | 79 | 0 weak-less-than tg t weak-less-than 1; both `\leqslant` | L15 left |
| 191 / #14 | 82 | -2 strict-less-than tg t weak-less-than -1; right `\leqslant` | L15 centre, samerow |
| 192 / #15 | 85 | tg t = 2.5 | L15 right, samerow |
| 193 / #16 | 88 | tg t = -4.5 | L16 left |
| 194 / #17 | 91 | tg t = 0 | L16 next, samerow |
| 195 / #19 | 97 | arctg sqrt(3) | L18 left |
| 196 / #20 | 100 | arctg 1/sqrt(3) | L18 centre, samerow |
| 197 / #21 | 103 | arctg 1 | L18 right, samerow |
| 198 / #22 | 106 | arctg 0 | L19 |
| 199 / #24 | 112 | tg x = 1 | L21 left |
| 200 / #25 | 115 | tg (1/2)x = 1/sqrt(3), coefficient unparenthesized in source notation | L21 centre, samerow |
| 201 / #26 | 118 | tg 2x = sqrt(3) | L21 right, samerow |
| 202 / #27 | 121 | tg 3x = 3.5 | L22 left |
| 203 / #28 | 124 | tg((1/4)x+pi/4) = 0 | L22 next, samerow, fully closed |

- Each task is kind ex, with exactly its frozen source number; none is missing, duplicated, renumbered or left open.
- Every task has cont=false/open=false. Task 189 is two source rows but one completed object.
- The figure-request point is P_t, preserved with its lowered t; no diagram was printed on 0066 and none is introduced.

### All four owner requests, individually

| Request / JSON block | MD lines | Exact candidate owner array | Source-freeze comparison |
| --- | --- | --- | --- |
| 证明 / #3 | 47-48 | ["182","183","184","185","186","187","188","189"] | MATCH-TEXT, p not exhead |
| Unit-circle condition AND drawing request / #12 | 74-76 | ["190","191","192","193","194"] | MATCH-TEXT, both P_t references and 方/程 break retained |
| 求反正切的值 / #18 | 93-94 | ["195","196","197","198"] | MATCH-TEXT, p not exhead |
| 解方程 / #23 | 108-109 | ["199","200","201","202","203"] | MATCH-TEXT, p not exhead |

JSON owner_exercises arrays correspond to the MD owners-ex declarations, with no duplicates, unexpected owner or cross-group spill. The single source heading remains 习题. No assembly/group-ID/course behavior is inferred because assembly was not run.

### Noncontent geometry BASIS ONLY for the unresolved count

Verbatim from sealed p0066.freeze.md, not new pixel inspection:

> - Pure upper edge ink is detached from正文: approximate narrow observed rectangle `[145,0,973,4]`. The source upper edge may clip that ink; this is not proof of its off-page origin.
> - Pure lower edge fragments occupy approximately `[0,2482,1125,11]`, disconnected/sparse rather than one continuous printed rule. NO exclusion applied or approved.

- Same freeze records main body approximately x=140..1410, y=266..2240, foot x=163..300, y=2287..2328. The edge bands are separated from known text/foot by clear y gaps in that original observation.
- These are the narrow source-observed, approximate coordinate rectangles available as NONCONTENT geometry basis only. No tighter pixel envelope is newly claimed, no mask is made, and no counter is promised to change.
- The current audit has count_exclusions=[] and an unresolved 24/23 failure. This reviewer does not approve/apply an exclusion, assert the extra row comes from either edge, or call the counter defective.
- Outer-right isolated marks and internal dots are UNKNOWN, not authorized scan-artifact exclusions. In particular the frozen internal dots near (786,536), (883,590), (936,188), (775,1474) and other unknown ink cannot be hidden or erased.
- Do not delete a source row, change a task/condition, add `↵`, add a blank row, duplicate prose, alter samerow, or overwrite expected/printed lines to force 24/24 or 23/23.
- Any later counting-copy investigation or affected-only native rerun requires its own release, retaining the first failure. Neither happens in this PhaseB.

## 0067: every frozen textual row and boundary

Candidate MD: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-work/artifacts/10c/pages/0067/page.md`.

| Frozen row | Candidate MD line / block | Independent comparison |
| --- | --- | --- |
| L01 | 50 / #1 | 88*. title first row, cotangent properties/graph and inverse cotangent words retained; punctuation/font details not approved |
| L02 | 51 / #1 | Title second row and ctg x=a retained |
| L03 | 54 / #2 | Least positive period pi and research introduction retained |
| L04 | 55 / #2 | y=ctg x, interval-length argument retained |
| L05 | 56 / #2 | Source ]0,pi[ and removed endpoints sentence retained |
| L06 | 57 / #2 | No definition at endpoints and derivative introducer retained |
| L07 | 60 / #3 | ctg postfix prime, leading minus, numerator 1, sin squared x denominator retained |
| L08 | 63 / #4 | Exclusion x=pi n, n in Z; opening parenthesis and cross-row x text retained |
| L09 | 64 / #4 | Closing parenthesis and negative -1/sin^2 x retained, but terminal period -> comma: HOLD-PUNCT-67-NEGATIVE |
| L10 | 65 / #4 | ]0,pi[, decreases statement and start of next sentence retained |
| L11 | 66 / #4 | ctg pi/2=0 and reference 图38 retained |
| C01 | 72 / #6 | Caption 图38 retained, separate from figure; spacing vs freeze 图 38 is typography UNKNOWN |
| F01 | 75 / #7 | Printed number 61 retained; flank shapes omitted textually, exact glyph UNKNOWN |

- Independent source baseline = 11 body rows + 1 caption + 1 foot = 13, matching native 13/13 but not granting source/crop approval.
- Heading is h3 with two lines; prime belongs to ctg, exponent 2 to sin; no derivative sign was changed.
- Figure block #5 is between the final prose and independent caption; figure ID/label links are consistent textually.
- No exercise/shared request/teaching footnote exists. Source sentences are complete at page bottom; N88 UNIT completion is NOT established.
- N87's source closure at 0066 is confirmed by the new N88 heading on 0067. Closure is NOT a course PASS, and no full-book/TOC/lesson gate is run.

## Figure 38: ALL inventory vs claims, and unresolved pixel fidelity

Independent inventory comes only from the immutable p0067.freeze.md. Current notes, MD, JSON and audit are TEXT compared here.

| Frozen object/relationship | Candidate text/declaration | Disposition |
| --- | --- | --- |
| One graph, no inset/table/panel | One fig-38 on 0067, no other figure on these pages | MATCH-TEXT |
| Two solid axes with positive arrowheads | Meta notes describe x,y axes and arrows | MATCH-TEXT inventory, actual glyph/stroke retention UNKNOWN |
| Label y at upper axis arrow | y named in notes/handoff | Present in textual inventory only |
| Label x at right axis arrow | x named in notes/handoff | Present in textual inventory only |
| Label 0 below-left of intersection | 0 named as origin in notes/handoff | Present in textual inventory only |
| Label pi/2 below curve-crossing neighborhood | pi/2 named in notes/handoff | Present in textual inventory only; exact glyph/tick geometry UNKNOWN |
| Label pi below right dashed-line neighborhood | pi named in notes/handoff | Present in textual inventory only; exact placement UNKNOWN |
| One decreasing curve, above axis on left and below on right | Notes say one descending branch crossing the horizontal axis | MATCH-TEXT relationship, no unseen branch inferred |
| One dashed line near pi, extending above/below axis | Notes/handoff say vertical dashed line at pi | MATCH-TEXT neighborhood; exact straightness/location not independently approved |
| Curve crosses near pi/2 label; scan is distorted | Notes say "在pi/2穿过" | Limit claim to original neighborhood, not exact pixel-coordinate equality; source prose ctg(pi/2)=0 is retained separately |
| No y numeric ticks/function-name label/endpoints/extra branches | Notes/handoff state no y values/function label/extra subfigures | MATCH-TEXT negatives; crop cannot independently prove them here |
| Separate caption 图 38, owned by N88 prose | #4 reference -> #5 fig -> #6 cap, no owner-ex | MATCH-TEXT ownership/caption linkage |
| UNKNOWN curved ink around (654,1642), left of y-axis | Not identified in meta notes; audit unknown_chars=[] | Remains UNKNOWN; neither an inferred minus/tick nor removable artifact |
| UNKNOWN dark mark near (847,1906), pi/2 denominator neighborhood | Not identified in meta notes; author claims zero glyph UNKNOWN | Remains UNKNOWN; not a point-object or crop-fidelity approval |

- Native declaration `[613,1458,525,685]` agrees across current MD figure header, meta.figures, JSON figure block and audit.figures. Audit records from `[600,1450,550,700]` and 33 components; this is reproducible TEXT geometry, not independent retained-ink proof.
- PhaseA rough inventory box `[610,1454,538,687]` was intentionally conservative and approximate. It is not an exact crop oracle; small envelope differences cannot be declared safe/unsafe from TEXT alone.
- Author-reported crop: `W/10c/pages/0067/figures/fig-38.png`, reported SHA-256 `8f1953eb1cf72141a9525cc3c7cd0fcc555c8c25a1c96b855cd2df52c39a11fe`. No crop/image bytes were read or hashed anew; that SHA remains AUTHOR-REPORTED.
- The candidate MD link is `figures/fig-38.png`; its existence, resolution and displayed bytes are not newly checked by decoding.
- Thus exact crop envelope, all faint/unknown ink retention, actual graph label glyphs and source typography remain HOLD/UNKNOWN. The figure's semantic inventory is textually consistent, but crop/content/figure approval is NOT issued.
- No modern FigureSpec/native expected inventory is consulted, and no modern figure is generated or assessed.

## Independent UNKNOWN and author-claim disposition

- No semantic exercise/formula glyph discrepancy was discovered against the PhaseA transcription, but that does NOT mean UNKNOWN=0 for the source.
- Exact historical Z/R face (`\mathbb` freeze notation vs `\mathbf` candidate notation), prime/star typography, period shape/codepoint, caption spacing and foot-flank glyph shapes remain typography/encoding UNKNOWN. No token/font substitution is approved by a solver or native whitelist.
- Flanking printed shapes exist in all three PhaseA footer observations, but current foot blocks contain only numbers 59/60/61. Their absence from TEXT is explicit; do not invent an exact dot/diamond character to claim a fully faithful footer.
- Sparse internal/margin unknown ink and Figure 38 unknown marks remain unresolved; no exclusion or erasure is approved.
- Author handoff line 73's `UNKNOWNglyph0`, native unknown_chars=[] and normalizations=[] are author/native claims of recognition/validation, not an independent source-glyph verdict.
- Author handoff line 69's property-8 complete-sentence claim conflicts with the frozen colon/missing-expression fact. Source closure is preserved WITHOUT correcting missing source mathematics.
- Author handoff lines 79-80's crop-fidelity implications cannot override the approximate source inventory and unresolved marks. Crop was not independently opened by the author or this PhaseB reviewer.

## Preserved HOLD, repair scope and usage

- Overall exact-candidate disposition: HOLD, no page/course/content/figure approval.
- 0065: source punctuation repair required at #7 and #11; annotate unresolved property-8 omission, preserving no actual outgoing open.
- 0066: task/row/ownership comparison complete with no semantic omission found; first native count HOLD persists. Only frozen noncontent edge BASIS is returned, no applied exclusion or guaranteed repair.
- 0067: period/comma boundary repair required at #4; graph semantic inventory matches textually, exact glyph/crop/typography UNKNOWN persists. N88 start only.
- Any revised candidate needs its own precise changed-file/hash release for affected-only text review. This single exact-candidate review does not authorize a retry, new image or downstream producer.
- PhaseB new model image payloads 0, originals 0, reopens 0, ROI payloads 0, native crop/decode/image metadata operations 0, image bytes read 0.
- Prior reviewer PhaseA image usage remains 3 originals / 8 batch / 24 context; PhaseB adds 0 and does not reset any context/budget. Parent remains exhausted 24/24; return TEXT/path/hash only.
- Native producer calls 0; text-receipt verification 1 read-only pass for three receipts. No prepare/finalize/vectorize/assemble/adapt/render or old whole-book gate.
- Exact model identifier, provider/tool/model/token charges UNKNOWN. New deliberate paid service calls 0; no claim of free model cost. Author/native trace counts are inherited AUTHOR-REPORTED, not reset or claimed to be new reviewer calls.
- All reviewer exec calls so far exited 0; receipt page-0066 exit 1 is preserved as an inherited producer failure, not concealed or rerun. All three ignored logging/instrumentation shutdown exceptions are preserved separately in bindings.md.
- No candidate or skill edits. No Git/backend/network/DB/paid-generation/downstream/other-agent-message calls. Only released candidate TEXT was read and new PhaseB reports were written, with apply_patch.
