# STEMROBIN-184 - Sole AUTHOR-byte StageB Comparison

Status: COMPLETE comparison; one source-supported punctuation repair and one qualified subscript uncertainty reported. No repair applied. WAIT.
Date: 2026-11-17.
Workspace: /Users/yong/.codex/worktrees/a07e/lemmadeck.
Scope: book10c physical118-121 / printed112-115 only.

## Authority and Immutability

- The parent explicitly reported complete consumption of frozen StageA and all seven image events, then disclosed this sole six-file AUTHOR byte set.
- StageA remains unchanged: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121-review/source-first.md`, SHA-256 `eeeb8a7cb79689d9928c33232110bfacb80548f080188694130ada4a0ae015a1`.
- StageA ledger remains unchanged: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121-review/ledger.md`, SHA-256 `78d3f99d15e8e02ae219c8b894553da9de9252d3e724f2b2c1de88bd9c26bc4f`.
- The initial UNKNOWN statements are historical independent observations and are not retroactively edited.
- All six AUTHOR files were hash-checked and read in full. No additional author version, grid, adjacent page, old image/crop, answer, choice, TOC, or review was discovered.
- This is a source-fidelity comparison, not finalize, parser/renderer acceptance, mathematical approval, or publication.

## Exact AUTHOR Input Freeze

| File | SHA-256, matched to parent disclosure |
| --- | --- |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0118/page.md | 6fcbd1c4b46eaf2069eab4ce8c4a3b773021a316817b97fbed0ae270d3daef22 |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0119/page.md | b65a1a1e553e9a739c805becbd1a44fe5dd4d8b885b2f3067850b27ba5ec7297 |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0120/page.md | c8fd46d3bc4a853b001e60636ebf221de72cda61e427343c4a42d25dbd591764 |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0121/page.md | 075db8247314fe9cbf7d4171d17edfbf8f6c760583d71c40fcc194a8a33ecbae |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121/author-handoff.md | 09e2afb5b8f39e24afa3c0d6efa7e12c36f2f4411a98b08995db3bc4724bfd32 |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121/author-ledger.md | 89fa364735542eb63bbbda1b6fb68948bc1c2060ab3519325dd319d886f25233 |

The four render SHA-256 values and 1695 x 2580 dimensions in AUTHOR frontmatter agree with independently checked StageA originals. Printed-page numbers agree. PDF/profile hashes are disclosed AUTHOR metadata, not independently validated here by additional PDF/profile reads.

## Findings

### F1 - Source-Supported Terminal Punctuation Repair

Affected source row: frozen `119.r15`; AUTHOR block `p0119#10`.

- Frozen StageA transcribes the triangle-area calculation with a terminal period.
- AUTHOR transcribes that same row with a terminal comma and repeats this interpretation in page notes, the handoff, and the AUTHOR ledger.
- The sole permitted new StageB native crop, event I08, shows the actual terminal mark as a compact dot-like period, without a discernible descending comma tail. This supports the frozen period reading, not the AUTHOR comma.
- Required faithful-page repair: change only the terminal punctuation of `p0119#10` from `，` to `。`. Do not modify numbers, factors, limits, primes, or the result.
- Keep `<!-- p open -->` at `p0119#10` and `<!-- p cont -->` at `p0120#1`. A sentence period does not close the worked-example owner: the requested final area difference is still supplied on physical120. Do not remove the continuation because of this punctuation repair.
- This finding is based on newly observed source pixels, not the algebra, the author's assertion, or the grammatical likelihood of a comma.

Evidence:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121-review/0119-stageB-triangle-terminal-native.png`
SHA-256 `079ece104cdf8f00c4b54c130a30b3bdfac3f0aeec11dd3b6f7fa1e6cbde0316`.
Source rectangle [300,2135,880,120]; native 880 x 120, no scaling/filtering/annotation.

### Q1 - Small Triangle Subscript Remains Qualified

- The final small subscript glyph in the same triangle-area row is rounded/C-or-O-shaped in the native crop. Frozen StageA and AUTHOR both represent the identifier as `BAC`; the prose also explicitly says triangle `BAC`.
- The prose or expected geometric subtraction must not be used to repair an uncertain formula glyph.
- This comparison does not establish a source-supported replacement of that formula's final subscript character. No `C -> O` or `O -> C` repair is ordered.
- Retain this qualification with the review evidence. Do not treat the shared `BAC` transcription as a new independent pixel-level certification of that small character. The permanent image budget is exhausted, so no further inspection is performed.
- The larger `BA3C` identifier elsewhere is the same literal transcription in both records; StageA's historical alphabet-convention qualification remains preserved. No numeric/letter normalization is authorized.

### F2 - Exact Registered Conflict Binding Verified, No Repair

`p0119-math-1` is correctly bound to `p0119#9`, the ninth actual typed block including figures and captions. Its header is `p`, not the triangle continuation block.

The frontmatter `original` is present byte-for-byte, including dollar delimiters and one `↵`, in that exact block body:

```text
$S_{BA3C}=\int_{-2}^1(3-2x-x^2)dx=\left.\left(3x-x^2-\frac{x^3}{3}\right)\right|_{-1}^1↵=3-1-\frac{1}{3}-3\cdot(-2)+(-2)^2+\frac{(-2)^3}{3}=9$
```

The block also contains its preceding `根据（4）式，` row and an external terminal semicolon. The registered original appropriately excludes that prose and semicolon.

The integral lower bound `-2`, evaluation lower bound `-1`, and subsequent `(-2)` substitutions match the independent source observations. The reason records their visible internal conflict. No algebraic correction, approved replacement expression, or mathematical approval is asserted.

## Every-Block / Every-Row Comparison

StageA row references below are frozen identifiers, not machine bands or tool-expected counts. `MATCH` means source-content/row/owner comparison only; it does not certify a pipeline command.

### Physical118

| AUTHOR block | Frozen rows | Comparison |
| --- | --- | --- |
| p0118#1 p cont | 118.r01 | MATCH integral `(1)`, limits a/b, F(b)-F(a). Leading continuation supported by bounded parent transport described below; not a new theorem. |
| p0118#2 p | 118.r02 | MATCH formula name, including physically observed 兹 spelling and bold emphasis. |
| p0118#3 p | 118.r03 | MATCH solved example1 prompt, lower -1 / upper2, x^2. |
| p0118#4 p | 118.r04-r05 | MATCH antiderivative x^3/3 and every term of evaluation ending3; both physical rows retained. |
| p0118#5 p | 118.r06-r08 | MATCH increment wording, evaluation-bar notation, equation `(2)`, all three rows. |
| p0118#6 p | 118.r09-r10 | MATCH formula reformulation and `(3)`, both rows. |
| p0118#7 p | 118.r11-r12 | MATCH example2 heading and full sine/cosine evaluation, limits0/pi, result2; exposition, not `ex`. |
| p0118#8 p | 118.r13-r15 | MATCH section100 and fig48 text references, area display and `(4)`, all three rows. No imported figure48. |
| p0118#9 p | 118.r16-r17 | MATCH nonnegative-function area conclusion, both rows. |
| p0118#10 foot | 118.foot | MATCH printed112 and flanking furniture, not prose. |

No omission, duplicate source row, new problem, or figure/table is introduced. The source's punctuation outside math in AUTHOR and the StageA displays' mathematical punctuation placement are representation differences, not altered formulas.

### Physical119

| AUTHOR block | Frozen rows / object | Comparison |
| --- | --- | --- |
| p0119#1 p | 119.r01-r02 | MATCH example2's area interpretation and value2, both rows. |
| p0119#2 fig54 | StageA fig54 | MATCH coarse instructional graph inventory and example2 owner; AUTHOR box [296,490,590,410] is consistent with independently coarse [295,485,580,410], not claimed identical exact geometry. |
| p0119#3 cap54 | 119.cap54 | MATCH separate caption. |
| p0119#4 fig55 | StageA fig55 | MATCH line/curve, A/B/C, projection, y mark, hatched region, and solved-example3 owner. AUTHOR coarse [962,480,478,410] consistent with independently coarse [970,480,475,405]. |
| p0119#5 cap55 samerow | 119.cap55 | MATCH caption shares physical row with cap54; source inventories do not convert graph interiors into prose. |
| p0119#6 p | 119.r03-r04 | MATCH whole example3 prompt, y=1-x and y=3-2x-x^2, both rows. |
| p0119#7 p | 119.r05-r08 | MATCH graph reference, both system equations in their two actual rows, and post-system sentence. One `↵` accompanies the LaTeX system separator; no duplicate literal source-row break. No split into tasks. |
| p0119#8 p | 119.r09-r11 | MATCH equality, x=1/-2, curvilinear region identifier and triangle-area difference; all three rows. |
| p0119#9 p | 119.r12-r14 | MATCH formula `(4)` lead-in and both physical rows of the continuous area equality; exactly one `↵`, all indices and terms preserved. F2 binding verified. |
| p0119#10 p open | 119.r15 | All mathematical factors/result agree with frozen transcription; terminal punctuation differs, repair F1. Small final subscript remains qualified under Q1. Preserve open worked-example owner. |
| p0119#11 foot | 119.foot | MATCH printed113; transparent to the continuation. |

Both figures remain prose-owned, not exercise-owned. The graph54 origin glyph is explicitly qualified 0/O-shaped in AUTHOR; this is compatible with the independently observed shape rather than an omitted datum. There are no printed tables.

### Physical120

| AUTHOR block | Frozen rows | Comparison |
| --- | --- | --- |
| p0120#1 p cont | 120.r01-r02 | MATCH exact 于是 continuation and full final area difference; closes the whole worked example3, not an unsolved task. No algebraic correction of its antecedent. |
| p0120#2 exhead | 120.r03 | MATCH 习题 heading. |
| p0120#3 exhead | 120.r04 | MATCH shared 求积分 instruction for425-433. |
| p0120#4 ex425 | 120.r05 left | MATCH limits1/4, square-root denominator. |
| p0120#5 ex426 samerow | 120.r05 middle | MATCH limits0/pi/4, cos-squared denominator, same physical row. |
| p0120#6 ex427 samerow | 120.r05 right | MATCH limits-1/1, x^4, same physical row. |
| p0120#7 ex428 | 120.r06 left | MATCH lowerpi / upperpi/2 and cos x; printed bound order retained. |
| p0120#8 ex429 samerow | 120.r06 middle | MATCH both negative limits -pi/2 and -pi/3, sin-squared denominator. |
| p0120#9 ex430 samerow | 120.r06 right | MATCH limits1/8, cube root of x^2; root index and radicand exponent retained. |
| p0120#10 ex431 | 120.r07 left | MATCH lower2 / upper1/3 and x-squared denominator; no exchange of limits. |
| p0120#11 ex432 samerow | 120.r07 middle | MATCH lower1/2 / upper1, x-cubed denominator. |
| p0120#12 ex433 samerow | 120.r07 right | MATCH limits1/10, x-squared denominator. |
| p0120#13 exhead | 120.r08 | MATCH shared area request including 先作图, scopes434-439. |
| p0120#14 ex434 | 120.r09 | MATCH all four givens: y=x^3, x=1, x=3, y=0. |
| p0120#15 ex435 | 120.r10 | MATCH printed star, y=sqrt(x), y=0, x=4. |
| p0120#16 ex436 | 120.r11 | MATCH y=2+x-x^2 and y=0, no change in signs. |
| p0120#17 ex437 | 120.r12 | MATCH y=cos x, y=0 and absolute-x non-strict slanted inequality <=pi/2 via `\leqslant`. |
| p0120#18 ex438 | 120.r13 | MATCH y=x^2 and y=2x. |
| p0120#19 ex439 | 120.r14 | MATCH printed star, y=x^2 and cube-root x. |
| p0120#20 h3 | 120.r15 | MATCH actual heading102 and full title; separates prior exercise owner from new exposition. |
| p0120#21 p | 120.r16 | MATCH dummy-variable statement. |
| p0120#22 p | 120.r17 | MATCH complete a/b x/t/z integral equality and ellipsis. |
| p0120#23 p open | 120.r18 | MATCH proof-introducing colon and open state leading into121. |
| p0120#24 foot | 120.foot | MATCH printed114; transparent to that continuation. |

All15 eligible unsolved task objects are present exactly once under their correct shared request. No solved example, proof, graph, or expository formula becomes `ex`. Three-column `samerow` structure agrees with the independent visual rows; no expected counter count is imposed.

### Physical121

| AUTHOR block | Frozen rows | Comparison |
| --- | --- | --- |
| p0121#1 p cont | 121.r01-r03 | MATCH both Newton-Leibniz equalities, inline 以及/等等 and same-number conclusion; completes120's colon-led justification. Both differences contain actual source minus strokes observed in StageA I06. |
| p0121#2 p | 121.r04-r06 | MATCH x as upper bound, t as dummy variable, and displayed integral; all three rows. |
| p0121#3 p | 121.r07-r08 | MATCH derivative assertion, prime, f(x), and equation `(1)`; no fabricated theorem heading or task. |
| p0121#4 p | 121.r09-r12 | MATCH whole proof, integral representation, 因此, every prime/minus/bracket in the complete derivative chain. Source minus, not multiplication dot, confirmed in StageA I07. |
| p0121#5 p | 121.r13-r14 | MATCH lead-in and a-to-a zero calculation. |
| p0121#6 p | 121.r15-r17 | MATCH prose/display/prose grammatical object, capital F(x), antiderivative assertion and zero-at-a ending. |
| p0121#7 p | 121.r18-r19 | MATCH q in both occurrences, final display `(2)` and local full stop. |
| p0121#8 foot | 121.foot | MATCH printed115 and flanking furniture. |

The whole provided derivative assertion/proof and both antiderivative statements remain exposition. No121 unsolved request is created. The right/global closure of unit102 remains UNKNOWN.

## Bounded Predecessor Transport

Authority here is the parent's new bounded TEXT, attributed to independent114-117 source observation. No preceding source pixels or preceding author/review files were read.

The parent supplies:

- Actual physical116 has §20 积分 and a101 heading.
- Physical117 defines the integral as F(b)-F(a), with reversed/equal limits permitted.
- Exact final117 MAIN row: `于是，根据积分的定义*，如果$F'=f$那么`
- Teaching footnote and foot111 are transparent to that open main exposition.

Together with independently observed118.r01, this establishes p0118#1 as the continuation of101 exposition. It resolves the bounded predecessor owner and demonstrates that117's main exposition continues into118; it does not certify a whole prior theorem/proof/lesson as complete.

The pre102 examples and exercise group can now be boundedly attributed to101 because the provided page sequence has no intervening numbered heading before the actual102 heading. The observed right boundary of that101 tail is immediately before102. Earlier whole-unit contents remain outside this review.

Historical StageA `UNKNOWN` remains intact. AUTHOR notes/ledger preserve both initial UNKNOWN and transport qualification; their additional reported predecessor title/footnote detail is not treated as a new direct source observation by this reviewer. No exact footnote text or predecessor body is imported.

Unit102 still begins at120.r15 and has unknown right/global closure beyond121. No out-of-range endpoint was inferred from a local period.

## Whole Owners and Eligibility

- Example1: p0118#3-4, complete supplied prompt/calculation; not eligible unsolved content.
- Example2: p0118#7 plus p0119#1-3 and fig54, complete supplied calculation/area interpretation; not eligible.
- Example3: p0119#4-10 including fig55, through p0120#1. Complete supplied prompt, system, solution and final area; retain whole ownership and continuation after F1. Not eligible.
- Unit102 variable-name assertion/justification: p0120#21-23 -> p0121#1, complete supplied argument; not eligible.
- Unit102 derivative assertion/proof: p0121#2-4, complete provided claim/proof; not eligible.
- Unit102 zero-width/zero-initial/value-q derivations: p0121#5-7, complete locally; not eligible.
- Only425-439 are source-complete eligible unsolved tasks;101 ownership is transport-qualified. No answers/choices/seeds were authored or approved in this review.
- Figure48 remains an external text reference. No external figure existence/owner approval.

## AUTHOR Handoff and Ledger Comparison

- Both were read completely at their disclosed hashes, including all seven reported AUTHOR image events and the full block/real-row mapping.
- Their source/page identities, row coverage, separate same-row captions, system/equality row breaks, exercise-column layout, figure inventories/owners, completed examples/proofs, transport-qualified predecessor attribution, and retained `-1` conflict agree with independent observations as detailed above.
- AUTHOR crop paths/hashes are textual provenance reports only. No AUTHOR crop was opened, and these seven AUTHOR image events do not consume this reviewer's image slots.
- The comma claim for119's final triangle row is the source-supported exception F1.
- Their limit statements do not claim finalize/acceptance/publish, do not pretend102 globally closed, and do not certify figure48 externally. No other omitted/duplicated printed row, changed formula, wrong task type, or wrong figure/example owner was found in the disclosed text set.
- StageA's former "one crop slot unused" is a frozen StageA checkpoint, not a license for another image after this StageB: reviewer usage is now8/8.

## Affected Repairs, Not Applied

1. Durable physical119 page.md: p0119#10 terminal `， -> 。`; keep `p open`. Update its note saying the last example3 row ends with a comma to a source-period statement with unchanged example continuation.
2. AUTHOR handoff: replace the `comma-to-于是` boundary description with period-to-于是, retaining p0119#10 -> p0120#1 and transparent foot113.
3. AUTHOR ledger: correct p0119#10 / R16 `terminal comma` to terminal period; retain the worked-example ownership and row mapping.
4. Preserve Q1 in review/parent integration evidence; no unverified formula-index replacement is authorized.

No change is needed to physical118,120,121 bodies or p0119-math-1's binding/original. No file in the sole AUTHOR input set was changed. A future authorized repair changes its hashes and is not silently covered by this exact-byte comparison.

## End State

StageA and its ledger immutable. StageB complete with all findings above; no page edits, finalize, counter/count repair, assembly, tests, mathematical approval, Git, workflow, or other-chat action. Reviewer image use8/8 permanently; no further images.

Return this file and `stageB-ledger.md` with external SHA-256 freezes, text only. WAIT for the parent; no proactive new author-byte discovery or production action.
