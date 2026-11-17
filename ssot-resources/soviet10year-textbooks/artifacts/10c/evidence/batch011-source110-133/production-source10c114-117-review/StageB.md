# STEMROBIN-184 book10c physical114-117: sole StageB

Status: COMPLETE StageB. Findings and repair instructions only; WAIT.
Disposition: REPAIR REQUIRED, with one unresolved source digit.
This is not source finalization, a math approval, a gate result, or publication acceptance.
Date: 2026-11-17.
Workspace: /Users/yong/.codex/worktrees/a07e/lemmadeck

## Authorization and immutable evidence

- Parent explicitly reported complete consumption of frozen StageA and disclosed the exact four author page.md files plus two author records for the SOLE StageB.
- Complete bounded text of all six disclosed files was read after their SHA-256 values were checked. All matched the disclosed values.
- Frozen StageA source-first.md remains `9c2f533056d786c8d61a6083e1fcdab99bba5d734b6548584e85e32eee893579`.
- Frozen StageA ledger.md remains `9c4db0f998f404674822d5193e4e5f93f0c0defb750597f3dd122a3419239f7a`.
- No StageA bytes, original PNG, durable author page, author record, or other worker's output was edited.
- Four NEW essential native crops were made only from this reviewer's original physical114/116/117 PNGs. No author crop was opened or used. Each new crop was dimension/hash/rectangle checked before one individual `detail: original` open.
- Permanent visual usage: StageA4 + StageB4 = 8/8; no reset, no original reopen, no adjacent original, no image payload returned to parent24/24.
- Exact source, author and crop manifests are in stageB-ledger.md. This report applies to those exact author bytes, not a later edited version.

## Findings and affected repair instructions

### F1 [P1] Shared area directive is typed as lesson prose, not exercise-owned text

Affected author: physical0116/page.md lines50-54; current blocks p0116#3 `exhead` and p0116#4 `p`.
Affected exercises: printed419-424, current p0116#5 through p0116#10.
Source evidence: frozen StageA116.T12-T19, especially T13.

The printed directive `计算由下列直线和曲线所围成的图形的面积：` governs all six following unsolved exercises. Its words are present in the author file, but `<!-- p -->` assigns that directive to lesson prose. The six `ex` blocks consequently do not inherit the directive through the current exercise-group representation.

This is a typed ownership defect, not missing source ink, wrong numerical data or a line-count defect. Static contract inspection only: lesson SKILL.md cap2 assigns ex/exhead to exercises and the remaining blocks to prose; tools/assemble.py lines139-171 sets `group = B.text_of(b)` for exhead, attaches that group to each following ex, and appends a p to prose. No pipeline function was invoked.

Minimum existing-format repair, for the authorized author/parent to perform:

```markdown
<!-- exhead -->
习题
计算由下列直线和曲线所围成的图形的面积：
```

Keep the directive's actual source row immediately after the actual `习题` row in ONE existing exhead; remove only the intervening `<!-- p -->` marker, not the directive text. Keep the six numbered ex blocks and their exact givens unchanged. In the current format the complete two-row header becomes the inherited group text; do not claim that the resulting group text is still the bare one-word label `习题`.

Do not create a second exhead: each exhead advances group identity in the current contract. Do not duplicate the directive into six faithful page bodies, invent a numbered task for it, introduce a schema field, add boundaries, or alter printed-row evidence. Update the author's affected block-map references after an authorized repair; do not manipulate counters to preserve stale block numbers.

### F2 [P2] Source unit101 heading has 茨, not author 兹

Affected author: physical0116/page.md line78, current p0116#12 h3.
Source evidence: frozen StageA116.T21; new native crop B2, source rect [400,2050,710,110].

The source heading is `101. 牛顿-莱布尼茨公式`. The native crop shows the character 茨 after 尼, not 兹. This confirms the StageA reading. Author body line78 instead says `101. 牛顿-莱布尼兹公式`.

Repair the current faithful h3 text's final surname character from 兹 to 茨, preserving number101 and the printed heading's content. Correct the corresponding current-observation labels in physical116 notes line29, author-handoff lines49-50, and author-ledger's unit101 heading entries (lines98 and184). Historical statements about what an earlier draft contained may be retained as history if explicitly labeled; they must not remain claims about the actual source glyph.

This is faithful heading transcription, not a request to rename the historical person in a modern edition or normalize the spelling using external knowledge.

### F3 [P2] Full stop after 被积函数 was changed to a comma

Affected author: physical0117/page.md line61, current p0117#6.
Source evidence: frozen StageA117.T17, from the StageA original-detail whole-page observation.

StageA recorded `做被积函数。而变量 x 叫做积分变量。` The disclosed author text is `做被积函数，而变量$x$叫做积分变量．...`.

Repair the comma after 被积函数 to a source full stop, using the faithful layer's existing full-stop encoding:

```markdown
做被积函数．而变量$x$叫做积分变量．端点为$a$和$b$的闭区
```

Keep the actual source row boundary after 闭区 and all other notation unchanged. This finding rests on the frozen StageA observation, not on a dedicated StageB crop; no such crop is claimed and no image is reopened.

### U1 [Unresolved] Smallest nested exponent is not conclusively decoded

Affected author: physical0116/page.md line48, current p0116#2; notes lines25-26; author-handoff lines56-59; author-ledger lines207-213.
Source evidence: frozen StageA116.T11 plus new native crop B1, source rect [400,900,230,90].

StageA tentatively read `y=2^{x^2}` and explicitly left the smallest superscript unresolved. The author tentatively wrote `y=2^{x^3}` and explicitly left 3 versus 2 unresolved, even after its own two crops. Those author crops were NOT opened here.

This reviewer's independent new native crop isolates the small glyph, but the degraded tiny raster still does not justify a conclusive digit assignment. Thus neither the tentative 2 nor tentative 3 is promoted to a verified source fact. The author is not found to have a proved exponent error solely because its tentative digit differs from StageA.

Required handling: retain explicit unresolved-source status; do not silently flip x^3 to x^2, claim 3 is verified, or create a mathematical erratum. Source-first resolution needs further parent-authorized bounded evidence in a separately authorized budget/context, if required. All eight permitted visual loads in this invocation are now used; no further crop or reopen is authorized here.

## Source settlements that are not author defects

- B3, physical117 source rect [300,1870,960,105], clearly shows a comma after `F'=f` before `那么`. The author's line66 is faithful. Frozen StageA117.T20 omitted that comma in its visual text record; this is an ADDITIVE StageB settlement, not a retrospective edit of StageA.
- B4, physical114 source rect [500,1815,915,330], clearly shows a full stop after F(a) in equation(1) and after f(x) in equation(2). Author physical114 lines55 and60 correctly retain both full stops. There is no requested punctuation repair to these equations.
- Physical116 equation(4) has no additional full stop in the StageA observation; author line38 correctly leaves it without one.
- Physical115 deliberately says `等式（3）` after the preceding inequality discussion. Author line55 preserves that source wording. Do not repair it to 不等式 on mathematical/terminological grounds.
- Physical115's first displayed limit has numerator ΔS without `(x)`; its later derivative-definition limit has ΔS(x). Author lines57 and59 faithfully keep the difference.
- Exercise421 uses non-strict slanted lower-stroke inequalities. Author `\leqslant` agrees with the observed visual class. Exact underlying Unicode/code-point identity is not inferable from a printed font; no strictness repair is needed.
- Greek Φ and Latin F, integral lower a / upper b, f(x)dx, and a>b / a=b in physical117 are preserved by the author. No algebra change or new successor formula is indicated.

## Additive bounded predecessor and owner linkage

Historical StageA state remains unchanged: physical114 actually began `限。因此，`, and physical113 owner/start/link were UNKNOWN at that time.

The parent NOW transports independent source110-113 text stating:

1. Physical112 has heading100 after exercises409-418.
2. Unit100 example1 requests the x^2 region on [1,2] and owns figure49.
3. Physical113 is the worked derivation with figures50/51, ending exactly:

```markdown
由此可以看出，当$\Delta x$趋向零时，分式$\frac{\Delta S(x)}{\Delta x}$有等于$x^2$的极
```

The parent reports the footer107 after that text. No preceding pixels were opened by this reviewer.

The transported terminal `极` and this reviewer's independently observed physical114 initial `限` support the additive bounded `极|限` splice. Consequently author p0114#1 can be linked to unit100 example1, with its whole-owner endpoint at physical114.T12 / author line46, `S(2)=7/3`.

The theorem1 statement/proof and 419-424 inherit containing unit100 before the locally observed §20/unit101 boundary. These containing-unit identities use the transported heading/start, not a fresh visual inspection of physical112-113. The complete local theorem/proof and local task closures remain independently observed on physical114-116.

This supplies a bounded whole-owner map, not this reviewer's independent re-review of every external row/figure49-51. Author-ledger's extra transported physical113 beginning is treated as a claim in the disclosed author record, not a new independent pixel observation. Do not retroactively replace frozen StageA's UNKNOWN or duplicate an unseen h3 into physical114.

## Complete Row-by-Row Comparison

These are manual evidence locators and literal author file line numbers, not detector results, counter overrides or finalized audits.
`MATCH` allows math wrappers, ordinary spacing and visual-equivalent full-stop encoding; it does not allow comma/full-stop substitution, altered inequalities, digits, rows or semantic owners.
All source text rows are represented below. All author body rows are covered; no unexplained extra body row was found.

### Physical0114 / printed108

| StageA row | Author line | Content / result |
| --- | --- | --- |
| 114.T01 | 36 | terminal 限 + 因此; MATCH; bounded predecessor added only in StageB |
| 114.T02 | 37 | S' limit ΔS(x)/Δx = x^2; MATCH |
| 114.T03 | 38 | S(x) antiderivative of x^2 / basic property; MATCH |
| 114.T04 | 39 | x^3/3+C and S(1)=0; MATCH |
| 114.T05 | 40 | x=1, figure50 degenerates to vertical segment; MATCH |
| 114.T06 | 41, before ↵ | zero area, S(1)=1^3/3+C=; MATCH |
| 114.T07 | 41, after ↵ | 0，由此得出; MATCH; one encoded printed break |
| 114.T08 | 42 | C=-1/3; MATCH |
| 114.T09 | 43 | 于是; MATCH |
| 114.T10 | 44 | S(x)=x^3/3-1/3; MATCH |
| 114.T11 | 45 | requested area introduction; MATCH |
| 114.T12 | 46 | S(2)=2^3/3-1/3=7/3; MATCH; incoming example suffix closes |
| 114.T13 | 49 | general-case transition; MATCH |
| 114.T14 | 52 | theorem1, f continuous/nonnegative on [a,b]; MATCH |
| 114.T15 | 53 | S curved-trapezoid area, figure48, F; MATCH |
| 114.T16 | 54 | interval containing [a,b], antiderivative hypothesis; MATCH |
| 114.T17 | 55 | S=F(b)-F(a), full stop, (1); MATCH, B4 confirms punctuation |
| 114.T18 | 58 | left-of-x partial area, figure52; MATCH |
| 114.T19 | 59 | area S(x), derivative proof introduction; MATCH |
| 114.T20 | 60 | S'(x)=f(x), full stop, (2); MATCH, B4 confirms punctuation |
| 114.T21 | 61 | Δx>0, ΔS(x)=S(x+Δx)-S(x), figure53; MATCH |
| 114.T22 | 62 | continuity at x, arbitrary ε>0; MATCH; outgoing proof |
| 114.F01 | 65 | footer108; MATCH |

### Physical0115 / printed109

| StageA row/object | Author line | Content / result |
| --- | --- | --- |
| fig52 | 35; notes26 | supplied graph object, proof owner, coarse box; MATCH at coarse level |
| fig53 | 37; notes27 | supplied graph object, proof owner, coarse box; MATCH at coarse level |
| 115.C01 | 40 | caption52; MATCH |
| 115.C02 | 43; header42 | caption53 and samerow; MATCH |
| 115.T01 | 46 | δ>0, absolute Δx bound; MATCH |
| 115.T02 | 47 | f(x)-ε<f(x+Δx)<f(x)+ε and positive Δx; MATCH |
| 115.T03 | 48 | figure53 parenthetical; MATCH |
| 115.T04 | 49 | areaABCD < ΔS(x) < areaKMCD; MATCH |
| 115.T05 | 50 | 或; MATCH |
| 115.T06 | 51 | [f(x)-ε]Δx < ΔS(x) < [f(x)+ε]Δx; MATCH |
| 115.T07 | 52 | 就是; MATCH |
| 115.T08 | 53 | quotient inequality and (3); MATCH |
| 115.T09 | 54 | negative increment -δ<Δx<0; MATCH |
| 115.T10 | 55 | literal 等式(3), 0<abs(Δx)<δ, trailing 极; MATCH |
| 115.T11 | 56 | 限的定义，这就是说; MATCH |
| 115.T12 | 57 | limit ΔS/Δx=f(x), without numerator(x); MATCH |
| 115.T13 | 58 | derivative-definition introduction; MATCH |
| 115.T14 | 59 | S' limit ΔS(x)/Δx; MATCH |
| 115.T15 | 60 | concludes equation(2); MATCH |
| 115.T16 | 63 | S(x) antiderivative, trailing 原函; MATCH |
| 115.T17 | 64 | S(x)=F(x)+C, constant, trailing 我; MATCH |
| 115.T18 | 65 | S(a)=0, x=a, figure52, trailing 垂直; MATCH |
| 115.T19 | 66 | zero-area segment / choose C / equation; MATCH |
| 115.T20 | 67 | S(a)=F(a)+C=0, no proof closure here; MATCH |
| 115.F01 | 70 | footer109; MATCH |

### Physical0116 / printed110

| StageA row | Author line | Content / result |
| --- | --- | --- |
| 116.T01 | 36 | 成立 + C=-F(a) on same baseline; MATCH |
| 116.T02 | 37 | 于是; MATCH |
| 116.T03 | 38 | S(x)=F(x)-F(a), (4), no added stop; MATCH |
| 116.T04 | 39 | figure48, S(b), S=S(b), trailing 那; MATCH |
| 116.T05 | 40 | x=b, derives(1) from(4); MATCH; proof closes |
| 116.T06 | 43 | derivative calculation difficulty; MATCH |
| 116.T07 | 44 | greater difficulty finding antiderivatives; MATCH |
| 116.T08 | 45 | existence question / intervalI / continuous; MATCH |
| 116.T09 | 46 | existence assertion, simple functions; MATCH |
| 116.T10 | 47 | not representable by school-function combinations; MATCH |
| 116.T11 | 48 | prose MATCH; x^2 versus x^3 unresolved U1, B1 not conclusive |
| 116.T12 | 51; header50 | 习题; MATCH |
| 116.T13 | 54; header53 | directive words MATCH; typed-owner FAIL F1 |
| 116.T14 | 57 | 419: y=x^2,y=0,x=3; MATCH |
| 116.T15 | 60 | 420: y=1/x^2,y=0,x=1,x=2; MATCH |
| 116.T16 | 63 | 421: y=sin x,y=0,non-strict 0..π; MATCH visual glyph class |
| 116.T17 | 66 | 422: y=1/cos^2 x,y=0,x=0,x=π/4; MATCH |
| 116.T18 | 69 | 423: y=2x-x^2,y=0; MATCH |
| 116.T19 | 72 | 424: y=(x+2)^2,y=0,x=0; MATCH |
| 116.T20 | 75; header74 | §20 积分; MATCH |
| 116.T21 | 78; header77 | 101 heading: 茨 versus author兹; FAIL F2, B2 conclusive |
| 116.T22 | 81; header80 | intro ends 如; MATCH, remains open |
| 116.F01 | 84 | footer110; MATCH |

### Physical0117 / printed111

| StageA row | Author line | Content / result |
| --- | --- | --- |
| 117.T01 | 35 | 下 + antiderivative increment calculation; MATCH |
| 117.T02 | 36 | other problems / trailing 函; MATCH |
| 117.T03 | 37 | infinitely many antiderivatives / trailing 计; MATCH |
| 117.T04 | 38 | choice independence question and answer; MATCH |
| 117.T05 | 41 | F and Φ antiderivatives on I; MATCH |
| 117.T06 | 42 | antiderivative property, constantC; MATCH |
| 117.T07 | 43 | x∈I, Φ(x)=F(x)+C, a/b inI; MATCH |
| 117.T08 | 44 | full endpoint increment identity; MATCH |
| 117.T09 | 45 | equal increments conclusion; MATCH |
| 117.T10 | 48 | depends only on f,a,b; MATCH |
| 117.T11 | 51 | rationale for naming increment; MATCH |
| 117.T12 | 52 | dedicated name and symbol; MATCH |
| 117.T13 | 55 | definition start, F(b)-F(a); MATCH |
| 117.T14 | 56 | integral froma tob definition end; MATCH |
| 117.T15 | 59 | integral lowera/upperb, f(x)dx, trailing 积; MATCH |
| 117.T16 | 60 | limit names, integral sign, trailing 叫; MATCH |
| 117.T17 | 61 | text/terms MATCH except source stop changed to comma after 被积函数; FAIL F3 |
| 117.T18 | 62 | integration interval, upperb need not greater, trailing 积; MATCH |
| 117.T19 | 63 | lowera, possible a>b or a=b; MATCH |
| 117.T20 | 66; header65 | definition marker*, F'=f,那么; author comma CONFIRMED B3; StageA omission settled additively |
| 117.N01 | 69; header68 | starred note: other texts call it definite integral; MATCH |
| 117.N02 | 70 | 原函数的普遍形式 F(x)+C / 不定积分; MATCH |
| 117.N03 | 71 | distinction / special name, trailing 也; MATCH |
| 117.N04 | 72 | 定积分 / this source does not adopt the term; MATCH |
| 117.F01 | 75 | footer111; MATCH |

## Complete Block/Owner Comparison

| Author block | StageA evidence and semantic owner | Type/boundary result |
| --- | --- | --- |
| p0114#1 p cont | 114.T01-T12, incoming worked suffix | cont justified additively by parent 极/限; closes at S(2)=7/3; no invented h3 |
| p0114#2 p | 114.T13 general transition | complete sentence, correct |
| p0114#3 p | 114.T14-T17 theorem1 statement | whole supplied statement, correct |
| p0114#4 p open | 114.T18-T22 theorem1 derivative-proof start | correct open after ε>0 |
| p0114#5 foot | 114.F01 | correct, not proof content |
| p0115#1 fig52 | graph52 and theorem1 proof | correct prose-owned fig, not an exercise |
| p0115#2 fig53 | graph53 and theorem1 proof | correct prose-owned fig, not an exercise |
| p0115#3 cap52 | 115.C01 | correct caption ownership |
| p0115#4 cap53 samerow | 115.C02 | correct shared caption baseline |
| p0115#5 p cont | 115.T01-T15 | closes first proof paragraph at derives(2), correct |
| p0115#6 p open | 115.T16-T20 | second proof paragraph, correct open at equation0 |
| p0115#7 foot | 115.F01 | correct |
| p0116#1 p cont | 116.T01-T05 | completes theorem1 proof, correct |
| p0116#2 p | 116.T06-T11 | complete instructional paragraph, not extra exercise; U1 unresolved digit |
| p0116#3 exhead | 116.T12 | exercise group start, correct but directive must be attached F1 |
| p0116#4 p | 116.T13 common task directive | wrong prose ownership F1 |
| p0116#5 ex419 | 116.T14 | locally closed task, exact givens; common directive F1 |
| p0116#6 ex420 | 116.T15 | locally closed task, exact givens; common directive F1 |
| p0116#7 ex421 | 116.T16 | locally closed task, exact givens; common directive F1 |
| p0116#8 ex422 | 116.T17 | locally closed task, exact givens; common directive F1 |
| p0116#9 ex423 | 116.T18 | locally closed task, exact givens; common directive F1 |
| p0116#10 ex424 | 116.T19 | locally closed task, exact givens; common directive F1 |
| p0116#11 h2 | 116.T20 §20 积分 | correctly starts new section after exercises |
| p0116#12 h3 | 116.T21 numbered101 | correct boundary/number; surname glyph F2 |
| p0116#13 p open | 116.T22 | intro open after 如, correct |
| p0116#14 foot | 116.F01 | correct |
| p0117#1 p cont | 117.T01-T04 | 如/下 intro splice, closes intro paragraph, correct |
| p0117#2 p | 117.T05-T09 | complete independence argument, correct |
| p0117#3 p | 117.T10 | conclusion, correct |
| p0117#4 p | 117.T11-T12 | naming rationale, correct |
| p0117#5 p | 117.T13-T14 | complete integral definition, correct; underline acknowledged, not a figure |
| p0117#6 p | 117.T15-T19 | complete notation/terminology, correct owner; punctuation F3 |
| p0117#7 p open | 117.T20 | correctly open after 那么, comma correct B3 |
| p0117#8 foot note | 117.N01-N04 | whole teaching note, correct, transparent to open main sentence |
| p0117#9 foot | 117.F01 | page footer, correct |

The author's split between the unit101 introductory paragraph and its following F/Φ argument agrees with the actual paragraph structure. StageA's broader semantic introductory/independence owner is not a demand to merge those paragraphs. Likewise the two theorem proof paragraphs retain the same whole-proof owner across their printed paragraph break.

## Figures, Tables and Completeness Limits

- Only two supplied figures,52/53, both on physical115 and owned by theorem1 proof. Both captions are preserved once with explicit samerow for53. No table.
- Sourcefig52 coarse box [220,270,615,380] and sourcefig53 [840,260,690,375] are consistent with StageA's approximate inventory bounds; this is NOT exact cropping/snapping approval.
- Graph52 axes, origin0, a/x, y=f(x), hatched S(x) agree. Its far-right label was not confidently visible in StageA. Author's `unlabelled` is acceptable only as observation shorthand for no confidently seen label, not a proved absence or permission to erase a faint label.
- Graph53 x/y axes,0,a,x,x+Δx,b, three dashed levels, K/M,A/B,D/C, strip hatching and curve agree at coarse inventory level.
- Fine line joins, exact boundary dashing, arrow endpoints, all stroke containment and graph pixel geometry remain QUALIFIED/UNVERIFIED. No diagram crop was used, no vectorization/render/assertion work done.
- Text-only figures48/50 stay in their printed prose owners. Figure48 raster remains unseen. Figures49-51 ownership is bounded transported context, not this reviewer's new native inventory.
- Complete supplied theorem1 statement and proof are present; no theorem content is missing between114 and116. This is source/text completeness, not independent mathematical approval.
- There are six locally closed unsolved tasks419-424. Their formulas are faithful, but common directive ownership requires F1.
- Example1's endpoint at114 S(2)=7/3 is independently observed; its start and external physical112-113 body are known only through transported text. No extra solved/unsolved task is created from proof prose or the sample function.
- Unit101 has a supplied local start and complete local definition/terminology/footnote, but ends this range OPEN at `如果 F'=f，那么`. No physical118 formula or whole-unit completion is inferred.
- PDF/profile hashes are carried author metadata and consistent across the six disclosed records. This invocation does not independently inspect/hash the PDF/profile or authorize changing them.

## Author Record Comparison and Hold

- Author-handoff and author-ledger agree with all four disclosed author hashes and original PNG hashes. Their author6/8 budget and author crop paths/hashes are textual claims; no author image payload was loaded.
- Their whole-row maps account for all source rows, including the one ↵ break on114, shared caption baseline on115, same-row C formula on116, and teaching footnote on117.
- Their local proof/example/task/unit boundary claims are supported to the limits above. Their declaration that the shared prompt applies to419-424 is semantically correct, but not implemented by the current p typing.
- Their current title claims need F2 correction. Their unresolved digit remains genuinely unresolved U1, not a resolved disagreement. Their comma after F'=f is source-faithful B3.
- All records explicitly distinguish initial UNKNOWN from later bounded linkage, and author work from independent review. No retroactive prior-certainty claim is adopted here.

COMPLETE StageB findings recorded. No source repair performed, no finalize/count repair/gate/assemble/math approval/tests/Git/workflow action. New report and new ledger are the only manual text outputs; the four native crop files are the only new image evidence.

WAIT for parent consumption and further explicit direction. No further visual loads, processing, author artifact discovery or product operation in this invocation.
