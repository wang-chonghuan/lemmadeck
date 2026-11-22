# One exact-candidate TEXTONLY PhaseB: HOLD

STEMROBIN-184 /184-6; 2026-11-22. One comparison, same context, zero new images.
R = `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck`.
W = `R/.tmp/stemrobin-184-six/source10c5255-work`.
Candidate base = `W/artifacts/10c/pages`.
Immutable freeze base = `R/.tmp/stemrobin-184-six/source10c6871-review/phaseA`.
PhaseA seal SHA256 = `ae8f6a7217424ae1bb1bfe6953b180315567ffea57edd7c87f9ddf214213bb70`.

`MATCH` below means local text/object agreement with the frozen observation, not course PASS, truth-check, pixel/crop approval or promotion. JSON block indices are zero-based. Markdown line references were obtained from the released text, not an image or counter.

## Findings, ordered by impact

| ID | Location | Frozen source vs exact candidate | Verdict |
| --- | --- | --- | --- |
| B01 | 0070 L01; MD:50; JSON `blocks[0].lines[0]` | Freeze, confirmed by PhaseA native ROI: `任一闭区`; candidate: `任一区` | REQUIRED CORRECTION: missing visible `闭`; do not normalize the source wording by mathematics |
| B02a | 0069 L01; MD:38; JSON `blocks[0].lines[0]` | Freeze `由反函数的定义得出，`; candidate `由反函数的定义得出：` | Punctuation mismatch |
| B02b | 0070 L15; MD:76; JSON `blocks[5].lines[1]` | Freeze comma after first `x=arcctg 1+πk`; candidate semicolon | Punctuation mismatch |
| B02c | 0070 L20; MD:87; JSON `blocks[8].lines[0]` | Freeze `现在列出余切的基本性质。`; candidate ends `：` | Punctuation mismatch |
| B03 | 0068 L02; JSON `blocks[0].lines[1]` | Freeze U68-1 operator UNKNOWN; candidate commits to `π(n+1)` | HOLD, not a definite wrong-operator verdict. Do not confirm plus by mathematical inference; empty native `unknown_chars` cannot resolve this source UNKNOWN |
| B04 | First 0070 native execution/audit/stdout | Actual exit 1, printed/body 26/25; original error retained | HOLD. No missing independent row was found relative to freeze, but that is NOT counterproof, counter diagnosis or permission to pad text |
| B05 | 0071 R02a/R02b; MD:90/91; JSON `blocks[16]` | Two request rows retained; metadata explicitly says owners UNKNOWN; no guessed exercise number/list | Word-level MATCH, forward attachment HOLD until 72 source is observed/reviewed; do not silently treat this unowned request as lesson prose |
| B06 | Figure inventory, especially 41 | Released handoff does not enumerate the two projection guides/dark intersection marks recorded in freeze or retain U70-3 joining uncertainty | Inventory-completeness HOLD. This does not prove their removal from the native crop; no crop bytes were read or approved |

Input/output snapshot comparison establishes that literal prose/formula/caption/footer payloads were unchanged by native finalization. B01/B02 were already in the authored inputs, not introduced by a native prose normalization. Recorded `normalizations: []` does not erase these independent findings.

## Complete row coverage

All 82 independently frozen source baselines are covered by the ranges below. This is coverage of existing source observations, not a new machine/image row count. Operator styling (`\mathrm` vs `\operatorname`), editorial spaces and bracket codepoint width are not treated as different source words/signs. No multiplication order, interval orientation, decimal, sign or degree symbol was repaired by mathematics.

| Page | Freeze rows/objects | Candidate JSON mapping | Result |
| --- | --- | --- | --- |
| 0068 | L01..L04 | `blocks[0]`, four prose rows | Words/vector/formula tokens and breaks MATCH except U68-1 operator HOLD |
| 0068 | C01 | `blocks[2]` | `图 39`, separate caption MATCH |
| 0068 | L05..L09 | `blocks[3]`, five rows | All prose/domain/range/function tokens MATCH; `open=true`, final `y=x` has no added punctuation |
| 0068 | C02; F01 | `blocks[5]`; `blocks[6]` | `图 40`; numeric foot `62` MATCH; footer-side marks stay UNKNOWN, not extra prose |
| 0069 | L01..L02 | `blocks[0]` | Incoming `cont=true`, `是对称的。`, D/E intervals and `减函数` MATCH; B02a punctuation differs |
| 0069 | L03; L04..L06 | `blocks[1]`; `blocks[2]` | Intro and all three printed value/reason/condition rows MATCH; no extra fraction baselines |
| 0069 | L07..L08 | `blocks[3]` | `利用用度` and table-conversion wording MATCH |
| 0069 | L09..L16 | `blocks[4]` | All eight instruction/equality rows, alpha degree rings, inequality bounds and endings MATCH |
| 0069 | L17..L20 | `blocks[5]` | Example 1, 3.078/18 degrees/0.3142 and approximation signs MATCH; not an exercise |
| 0069 | L21..L22; F01 | `blocks[6]`; `blocks[7]` | Introduction/equation (1) on one equation row; foot `63` MATCH; no outgoing sentence open |
| 0070 | L01..L10 | `blocks[0]` | Same ten independent prose rows and order; B01 missing glyph; remaining tokens MATCH |
| 0070 | C01, same row region as L10 | `blocks[2]` | `图 41`, `samerow=true` MATCH; do not create another full-width source row to fix 26/25 |
| 0070 | L11 | `blocks[3]` | Equation (2), `cont=true`, complete intra-page join from `blocks[0].open=true` MATCH |
| 0070 | L12..L15 | `blocks[4]`, `blocks[5]` | Example 2 and formulas MATCH; B02b separator differs |
| 0070 | L16..L19 | `blocks[6]`, `blocks[7]` | Example 3, radical/formulas, k-shaped variable and source breaks MATCH |
| 0070 | L20; L21..L22; L23..L24; F01 | `blocks[8]`; `[9]`; `[10]`; `[11]` | B02c ending differs; properties 1/2, all conditions/range tokens and foot `64` MATCH; no outgoing sentence open |
| 0071 | L01..L10 | `blocks[0]`..`[6]` | Properties 3..9, every interval/order/sign/condition and real break after `=` MATCH; property 4 remains `x∈(ctg)` with no added D |
| 0071 | H01; R01 | `blocks[7]`; `blocks[8]` | `习题` is exhead; `证明：` is p; exact owners 204..210 MATCH |
| 0071 | E204..E210 | `blocks[9]`..`[15]` | Seven exact numbered task rows MATCH; task details below |
| 0071 | R02a/R02b; F01 | `blocks[16]`; `[17]` | Both full request rows and foot `65` MATCH; P with lowered t-shaped glyph encoding UNKNOWN; forward owners UNKNOWN |

No complete printed word/formula row, caption, equation label, property item or visible task was omitted as a row. This narrower observation does not imply every glyph was faithfully transcribed: B01 and B02 are real differences.

## Three figure/object comparisons

| Figure | Frozen required inventory vs released textual inventory/metadata | Outcome |
| --- | --- | --- |
| 39, 0068 `blocks[1]` | One x/y-axis graph, five descending visible branches; five dashed verticals labelled -2π,-π,π,2π,3π; midpoint labels -3π/2,-π/2,π/2,3π/2,5π/2; origin zero/O-like glyph; caption 39 separately in `[2]`. Released handoff lists branches/axes/labels; MD/JSON/audit agree on id and snapped box `[158,603,1287,554]` | Textual object identity/inventory broadly MATCH; origin encoding remains UNKNOWN; exact snapped crop/ink fidelity NOT inspected or approved |
| 40, 0068 `blocks[4]` | x/y axes; origin glyph; π and π/2 vertical labels; dashed horizontal near π; one finitely observed descending stroke, no diagonal line; separate caption 40 in `[5]`. Metadata box `[413,1649,783,502]` | Listed labels/styles MATCH; retain frozen rough crossings/endpoints. Author exact π/2 crossing/asymptotic wording is not independent exact-coordinate/tail proof; no invented `y=x` diagonal is approved; crop NOT inspected |
| 41, 0070 `blocks[1]` | x/y axes; zero/O-like origin; π/2 and π labels; dashed vertical; descending stroke; two separate horizontal levels, each `a`, with `a>0` and `a<0`; two dashed/dotted projection guides and dark intersection/axis marks, U70-3 joining ink UNKNOWN; caption `[2].samerow=true`. Metadata box `[945,397,465,550]` | Basic graph/labels/levels and caption-row identity MATCH. Handoff projection/mark inventory incomplete (B06); no crop-loss inference, exact coordinate assertion, origin decoding or pixel approval |

Candidate fig links and audit box/component/ink-hash strings are metadata only. No source/crop/native PNG bytes, hash/header/decode or fresh image was accessed in PhaseB. Geometry inventory comes only from immutable PhaseA text. 0069/0071 have no figure/caption; mentioning a unit circle does not create a figure. Reference to figure 38 remains outside this source scope.

## Seven tasks and shared conditions

| Source task | Candidate | Frozen formula/features checked | Result |
| --- | --- | --- | --- |
| 204 | `[9]`, ex 204 | 312/48 degrees, equality, negative ctg, ending | MATCH |
| 205 | `[10]`, ex 205 | 17.3π/0.3π, decimal points, equality | MATCH |
| 206 | `[11]`, ex 206 | (-320 degrees)/40 degrees, parentheses, equality | MATCH |
| 207 | `[12]`, ex 207 | 6.4π, (-0.6π), negative ctg 0.6π, both equalities | MATCH |
| 208 | `[13]`, ex 208 | Mixed-number `7 1/2` beside π, π/2, =0; one row | MATCH |
| 209 | `[14]`, ex 209 | 5/15/31/45 degrees, three `>` signs, order | MATCH |
| 210 | `[15]`, ex 210 | -4/-14/-28/-45 degrees, four parentheses, three `<` signs | MATCH |

For every task, the number, full formula, punctuation, ex-kind and shared proof request `[8].owner_exercises=["204","205","206","207","208","209","210"]` agree. No answer/choice layer or mathematical solving used. There are no new per-task conditions, invented figures or duplicated requests. The different final drawing request remains separate and unassigned, not attached to 210.

## Full HOLD boundary

Required source corrections B01/B02; unresolved operator U68-1; native 0070 first FAIL; figure inventory/crop-approval limitations; and U71 forward owners all remain active. Other PhaseA glyph-code, footer and isolated/internal ink UNKNOWNs are not promoted by empty machine uncertainty fields. Exact limited 0070 blank-edge classification is returned separately; it does not resolve any of these holds.

No full N88/course PASS: only physical 68..71 compared; 67/72/73 were not opened. No source/freeze/candidate edit, exclusion application, native rerun, counter, downstream stage or promotion. Comparison closed; no second candidate/version comparison is performed under this release.
