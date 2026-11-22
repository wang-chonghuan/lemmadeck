# PhaseB: one exact TEXT ONLY comparison, physical 72-73 book10c

## Scope and status

- STEMROBIN-184 /184-6; continuation date 2026-11-22; sole write ownership is this NEW `phaseB` directory.
- Every exec cwd is `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck`.
- This comparison uses the immutable PhaseA baseline already in context, without rereading its files or images: seal `e7ad00bf44a75bbe66212feca252fab9151505bb6f5cbe61f10f5b2dc495b76d`; 0072 freeze `590dde3e04d2abb4e1e296beedbb4cb855d4958cb2cb4ff4cbc2d6764eda1467`; 0073 freeze `d131ab9fb77ee735b1d1df8d0cd8e7d37f77322ad529848cdc7a8d72d14b389d`.
- Current 0072 MD exactly matches the released SHA `7ea6bcae9bb0ff0856b7ccf117a0da3cbfa6a04dd09cd8af28997a24c7b7dae3`; current 0073 MD exactly matches `b6e86efa559164323fcf745dc85f26fa66528c9973041d596f5cb70e4ef1b47e`.
- Only those two current candidates' `page.md`, `page.json`, `audit.json` and the two authorized first-finalize receipts' seven text files each were read. Each file was read once. Candidate source/profile/render fields are unverified text metadata, not newly inspected source bytes or a profile approval.
- The receipt output snapshots hash-match all six current candidate files. This is one released candidate comparison, not a new candidate iteration.
- Status: **SCOPED HOLD / NO WHOLE-SOURCE PASS**. All 40 actual rows and all 27 tasks are mapped below; row/task structure and mathematical content match the PhaseA baseline. F01 is a punctuation delta; F02 records footer ornament omissions. H71 remains a separate unreviewed ownership-metadata repair. N89 remains genuinely open.

## Findings and remaining HOLDs

### F01: missing terminal punctuation at 73-R16

- PhaseA 73-R16 ends `关系式(1)成立。`; exact candidate `page.json` block 13 line 1, and its MD, end `关系式(1)成立` without terminal punctuation.
- The first receipt's `input-page.md` also lacks it, and the output retains the omission; this is not a finalizer-introduced change.
- This is an exact textual fidelity delta to the immutable baseline, not a claim based on a source reopen. It does not remove a row, alter the mathematical statement, or justify marking this paragraph open.
- A narrowly affected punctuation correction and separate exact release are needed before claiming baseline-exact textual agreement. No candidate or producer file was edited here.

### F02: footer ornaments omitted

- PhaseA 72-R21 records `• 66 •`; candidate foot block contains only `66`.
- PhaseA 73-R19 records `• 67 •`; candidate foot block contains only `67`.
- The numerical page identities and row positions match. The two flanking dots on each row are not represented in candidate text. These are ornament-level fidelity deltas, not missing tasks, diagrams or extra print rows.
- No source exclusion or permission to erase these observations is granted by this report. Parent disposition is still required if strict ornament-level transcription is demanded.

### H71: incoming request ownership is not yet metadata-complete

- PhaseA directly observed tasks 211-214 before the first different request on 72. Parent-agent TEXT supplied the complete preceding unit-circle/cotangent request: `设单位圆上的点 P_t 对应的余切值满足下列不等式或方 / 程，画出点 P_t 的集合：`.
- Exact 72 correctly starts with four closed `ex` blocks; it neither duplicates that absent-on-72 request nor fabricates a `p cont`.
- Current 71 request-owner metadata repair is pending according to this release. No 71 candidate, source, live record or native result was read. Consequently completion of the cross-page owner array for 211-214 is **HOLD**, not verified.
- This HOLD concerns only the affected 71 metadata linkage. It does not authorize inventing a request on 72 or reopening these images.

### Provenance correction, without rewriting history

- The earlier 67-72 span was a TOC-derived nominal parent hint, not direct human or pixel authority. Actual incoming N88 exercise material includes 232-237 above the N89 heading on 73.
- The author's reported phrase `human page71hint` is mistaken provenance. That hint was **parent-agent TEXT under the original human delegation**, not a new direct-human instruction or newly viewed page-71 pixels.
- Author closure, handoff SHA `e5ddd13e4bb56a6d70f58a8edcfd308ecaea202e85e5c5d2a6457015db85099d` and evidence SHA `3c5eb37dc1633f5324a33ef8796c3ddd3681589a7e09afd04f6d64fabe97663b` are supplied parent context only; the author package was not opened. Author history and report remain unchanged.

## Complete 40-row / 27-task mapping

`B<n>.L<m>` means the one-based index in the respective current `page.json.blocks`, followed by its actual `lines` entry. Paired block references on a row are not two source rows. `MATCH` concerns observed content and row/object structure, not font/codepoint identity, solutions or course acceptance. Operator styling, whitespace and comma shape are not treated as semantic mathematical changes.

| PhaseA row | Exact current JSON location | Content/task signature | Result |
| --- | --- | --- | --- |
| 72-R01 | B1.L1 + B2.L1 | 211: 0 <= ctg t <= 1; 212: -2 <= ctg t <= 2 | MATCH; B2 samerow |
| 72-R02 | B3.L1 + B4.L1 | 213: ctg t = 1.5; 214: ctg t = 0 | MATCH; B4 samerow |
| 72-R03 | B5.L1 | 求反余切的值： | MATCH, owner array S1 |
| 72-R04 | B6.L1 + B7.L1 | 215: arcctg sqrt(3); 216: arcctg 1/sqrt(3) | MATCH; B7 samerow |
| 72-R05 | B8.L1 + B9.L1 | 217: arcctg 1; 218: arcctg 0 | MATCH; B9 samerow |
| 72-R06 | B10.L1 + B11.L1 | 219: arcctg(-sqrt(3)); 220: arcctg(-1) | MATCH; B11 samerow |
| 72-R07 | B12.L1 | 221: arcctg(-1/sqrt(3)) | MATCH, no paired task |
| 72-R08 | B13.L1 | 用等号或不等号代替星号，以便得到真命题： | MATCH, owner array S2 |
| 72-R09 | B14.L1 | 222: arcctg 1 * arctg 1 | MATCH, unfilled comparison star |
| 72-R10 | B15.L1 | 223: arcctg sqrt(3) * arctg sqrt(3) | MATCH, unfilled comparison star |
| 72-R11 | B16.L1 | 224: arcctg 1/sqrt(3) * arctg 1/sqrt(3) | MATCH, unfilled comparison star |
| 72-R12 | B17.L1 | 225: arcctg 0 * arctg 0 | MATCH, unfilled comparison star |
| 72-R13 | B18.L1 | 226: arcctg 2 * arctg 2 | MATCH, unfilled comparison star |
| 72-R14 | B19.L1 | 求和式的值： | MATCH, owner array S3 |
| 72-R15 | B20.L1 | 227: arctg sqrt(3) + arcctg sqrt(3) | MATCH |
| 72-R16 | B21.L1 | 228: arctg 1/sqrt(3) + arcctg 1/sqrt(3) | MATCH |
| 72-R17 | B22.L1 + B23.L1 | 229: arctg 1 + arcctg 1; 230: arctg 0 + arcctg 0 | MATCH; B23 samerow |
| 72-R18 | B24.L1 | 231: 利用求反函数的导数的公式（参看第112小节）证明： | MATCH, own task request |
| 72-R19 | B24.L2 | arctg' x = 1/(1+x^2), first displayed derivative | MATCH, separate actual row |
| 72-R20 | B24.L3 | arcctg' x = -1/(1+x^2), second displayed derivative | MATCH, task closed |
| 72-R21 | B25.L1 | footer 66 | F02: flanking dots omitted |
| 73-R01 | B1.L1 | 232. 证明： | MATCH, new task |
| 73-R02 | B1.L2 | arctg x + arcctg x = pi/2 | MATCH, task closed |
| 73-R03 | B2.L1 | 解方程： | MATCH, owner array S4 |
| 73-R04 | B3.L1 + B4.L1 | 233: ctg x = 1; 234: ctg (1/2)x = sqrt(3) | MATCH; B4 samerow |
| 73-R05 | B5.L1 + B6.L1 | 235: ctg 2x = 1/sqrt(3); 236: ctg 3x = 3.5 | MATCH; B6 samerow |
| 73-R06 | B7.L1 | 237: ctg (1/5)x = 0 | MATCH, last pre-heading task |
| 73-R07 | B8.L1 | section 18: 三角恒等式和三角方程 | MATCH, h2 |
| 73-R08 | B9.L1 | 89. 同角三角函数之间的关系 | MATCH, h3 |
| 73-R09 | B10.L1 | 正如你们所知道的...四个三 | MATCH, introductory prose row 1 |
| 73-R10 | B10.L2 | 角函数之间存在三个基本关系式： | MATCH, continuation inside same p |
| 73-R11 | B11.L1 | sin^2 alpha + cos^2 alpha = 1, (1) | MATCH, number on formula row |
| 73-R12 | B11.L2 | tg alpha = sin alpha / cos alpha, (2) | MATCH, number on formula row |
| 73-R13 | B11.L3 | ctg alpha = cos alpha / sin alpha, (3) | MATCH, number on formula row |
| 73-R14 | B12.L1 | 由这些关系式...一些其他关系式。要 | MATCH, prose row 1 |
| 73-R15 | B12.L2 | 求利用这些基本关系式...已经遇到过。 | MATCH, not a shared exercise request |
| 73-R16 | B13.L1 | 对于所有的值 alpha in R，关系式(1)成立 | F01: baseline terminal dot absent |
| 73-R17 | B14.L1 | 对于使 tg alpha 有定义...属于实数域 R | MATCH, first row of open p |
| 73-R18 | B14.L2 | 的所有 alpha (pi/2 + pi n, n in Z, excluded)...(2)式成立。对 | MATCH, true open ending 对 |
| 73-R19 | B15.L1 | footer 67 | F02: flanking dots omitted |

These mappings cover each task 211-237 once. The signatures for 234 and 237 describe a fractional coefficient before `x`, not a denominator containing `x`; no mathematical grouping was added to the candidate. The table's English/ASCII signatures are summaries, not replacements for the exact formulas.

## Shared requests and exact arrays

| ID | Current block | Full current request | Exact owner_exercises array | Result |
| --- | --- | --- | --- | --- |
| S1 | 72 B5 | 求反余切的值： | `["215","216","217","218","219","220","221"]` | Matches source grouping |
| S2 | 72 B13 | 用等号或不等号代替星号，以便得到真命题： | `["222","223","224","225","226"]` | Matches source grouping |
| S3 | 72 B19 | 求和式的值： | `["227","228","229","230"]` | Matches source grouping |
| S4 | 73 B2 | 解方程： | `["233","234","235","236","237"]` | Matches source grouping |

- All four are `p`, not `exhead` or fabricated tasks; their MD `owners-ex` arrays match JSON `owner_exercises` without duplicates.
- 211-214 have an incoming shared request whose actual source ownership was established in PhaseA but whose affected 71 metadata remains H71.
- 231's own proof request belongs to 72 B24 and its two formula rows. It is outside S3; `open:false`, `cont:false`.
- 232 owns `证明：` and its formula in 73 B1; `open:false`, `cont:false`. It is not 231 continuation.
- Stars in 222-226 remain placeholders for equality/inequality, with neither solved replacements nor reinterpretation as multiplication. S2 provides their meaning.

## Boundary, row and figure checks

- Every same-row pair in PhaseA has the second task's `samerow:true`: 72 pairs 211/212, 213/214, 215/216, 217/218, 219/220, 229/230; 73 pairs 233/234, 235/236. No lone task was given a fabricated companion.
- Both derivative formulas of 231 remain different `lines` entries inside one complete task. Fraction heights do not add rows and no artificial `cont` is used.
- Source formula labels (1), (2), (3) remain at the end of the same respective B11 line, not separate rows, captions or exercises.
- 232-237 are ordered before h2 section 18 and h3 unit 89, preserving the actual incoming N88 tail. This is page text structure, not an assembled-course ownership verification.
- The introductory prose retains the `三 / 角函数` split. The later paragraph retains `要 / 求利用` and remains ordinary prose.
- 73 B14 is `p`, `open:true`, `cont:false`, two actual lines, ending exactly `对`. The trailing space after the first line is present; no unseen next-page text was supplied. Footer 67 does not close it.
- Both audits contain empty figure arrays and `count_exclusions:[]`; this agrees with PhaseA's no-figure inventory. No exclusion is proposed, approved or applied here.
- Native audits report 21/21 for 72 and 19/19 for 73. These are intake results, not a counter rerun and not proof that omitted punctuation/ornaments match pixels.

## First receipt facts and actual technical faults

| First receipt directory under W/receipts | Execution SHA256 | Scope/cwd/exit | stdout result | Actual stderr fault |
| --- | --- | --- | --- | --- |
| `nov22-finalize-p0072-01` | `fab77ba8358dcd09a33cae8fb415d3a196fd8f1f253d19d525f99a9e15c65a8b` | explicit 10c, page 72, cwd R, exitCode 0 | 25 blocks, 21 MD / 21 printed rows, 0 figures | ignored `_removeHandlerRef` cleanup exception; instrumentation `profile` raises `AttributeError: 'NoneType' object has no attribute 'startswith'` |
| `nov22-finalize-p0073-01` | `0b0eb11ff1af316663b9559847a19a41a13e1e3011182a830b0512dd11db6e54` | explicit 10c, page 73, cwd R, exitCode 0 | 15 blocks, 19 MD / 19 printed rows, 0 figures | same ignored cleanup exception, different function address |

- Recorded argv uses the correct work/artifacts roots and explicit book/page. No conflicting exit/cwd aliases were observed.
- Each receipt's input, three outputs and two stream digests match the once-read corresponding text bytes. All six output digests also match the exact inspected current candidates. Digests are in `bindings.sha256`.
- Both audits have empty `errors`, `normalizations`, `unknown_chars`, `katex_warnings`, `count_exclusions` and `figures`, and `errata:0`.
- The actual cleanup warnings are preserved in existing stderr files and in this report; they are not silently erased, promoted to source defects or claimed to be fixed. Finalize was not rerun.
- Producer instrumentation, source paths and image-trace paths appearing in receipt text were not followed. Producer-side decoding/cycle counts remain UNKNOWN.

## Intake bindings and usage

- `bindings.sha256` records the SHA256 of all 20 authorized text inputs as observed in this one intake, plus this own comparison report. It binds no newly read source PNG/PDF/profile.
- The PhaseA identities above are already-frozen context references, not fresh byte reads. The supplied author hashes are provenance references only.
- PhaseB new images: **0**; source reopens: **0**; ROI creations: **0**; crops read: **0**; explicit decode operations: **0**; new codec cycles: no review-controlled codec operation.
- PhaseA model image count remains **2/8**; overall context contains the same two originals, no additional payload. Parent's reported **24/24** image budget is unchanged.
- Upstream/internal codec-cycle totals: **UNKNOWN**. Paid jobs invoked: **0**. Actual monetary costs: **UNKNOWN**.
- Five read-only intake exec calls completed synchronously with exit 0: two candidate reads, one PhaseB absence/receipt-name check, two receipt reads. No persistent exec session was started.
- New evidence files are authored with `apply_patch` only in this new phaseB directory. Final local hashing concerns only these own new texts; candidates, PhaseA, author history and producer receipts remain untouched.

## Stop

This is the one exact released comparison. Stop here. F01/F02 and H71 are not fixed or released by this review. No whole-course/source-codepoint PASS, N89 closure, publication, exclusion authorization or downstream-stage release is implied.
