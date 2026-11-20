# STEMROBIN-180/180-6 n130 modern TEXT independent review b99

2026-11-20. Target only: `phy7-c2-s2-n130`, 电量和电流强度.
All commands used explicit workdir
`/Users/yong/.codex/worktrees/stemrobin-180-six/lemmadeck`.

## Decision

**TEXT PASS, 0 HOLD.** Only the frozen modern lesson/exercises/figures templates
and approved assembled raw n130 lesson/exercises were compared.
No canonical edit, adapt-finalize, choice, ANSWER candidate comparison,
DISPLAY, other-page SOURCE review or full-course count was performed.

Actual target counts: **11 source prose objects, 15 display paragraphs,
5 original written questions, 0 structural figures, 2 section breaks**.
Independent ANSWER SOURCE: 5 complete solutions / 19 covered facets / 0 HOLD,
separately frozen in `answer-source-n130-b99.md`.

## Bindings and Integrity

The specified author manifest is 0444 and has exact SHA256
`82c403d84f6d2d4daf6dc01a0496f4a1efdd1476df7bff8facd648db51c171cd`.
All **10 listed input bindings** were checked against actual byte counts and
hashes before reading template content. The three frozen author templates
also equal their bound working templates byte-for-byte and are 0444.

Raw lesson: 4479 bytes,
`ffb52f4321d286d5db38edd33eefc72cb72775ef3c039af3233bcee1388d2a3a`.
Raw exercises: 1942 bytes,
`8e09a099e32c2aabcbcc34a898e798752eae6eb4e36a9098d9f0e698c26b8e75`.
Embedded source data and source hashes equal those approved raw files.
No raw content was edited.

## Complete Target TEXT Comparison

| Prose index | Content and comparison |
| --- | --- |
| 0 | Current effects and unit-time charge preserved; layout only. |
| 1 | Electrons/ions, motion, particle charge and total charge preserved. |
| 2 | 电量, chemical effect, deposited substance and weighing argument preserved across p0326#9/p0327#1. |
| 3 | More charge through a cross-section in the same 1 second means stronger current; unchanged. |
| 4 | Definition preserved; only adjacent bold runs joined. |
| 5 | Divide charge by its passage time; printed 通过去的 retained; only adjacent bold runs joined. |
| 6 | Verbal charge/time fraction and punctuation unchanged. |
| 7 | I/q/t meanings preserved; modern newline after the colon is layout, not a word change. |
| 8 | `I=q/t` and letter case unchanged. |
| 9 | Strong/weak explanations and unit-time condition preserved, including italic explanatory terms. |
| 10 | Steady simple series circuit, no continuing charge accumulation, equal charge in the same time, series definition and forward reference preserved across p0327#9/p0328#1. |

Formula delimiter content was compared exactly; only whitespace outside math
was ignored for layout comparison. All source refs and other inherited prose
metadata are unchanged. Changes are only `layout`; numeric and historical
entity changes are empty.

All five original questions remain exactly worded, in order 1..5 / group g1.
Question 5's raw two-line physical wrap becomes one modern line without losing
any character. Figures, figure refs and figures template are empty.

## Real Shared Parser Evidence

Executed once, actual exit **0**:

```text
node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs --json .intentfold/tickets/STEMROBIN-180/tmp/resume-180-6/n130-text-author/lesson.template.json
```

Actual stdout produced 15 paragraphs and resolved breaks **[4, 12]**.
These are parser outputs, not manually counted prose or line indices.
Direct calls to the same `htmlfrag.js` APIs subsequently agreed:
`proseOutline`, `sectionBreakIndices`, `proseFlow`, and `proseInline`.

Exact boundary 1 is between parser paragraphs 3 and 4: before is the whole
paragraph beginning `这是因为每一个离子就是物质的一个粒子.` and ending
`则电量就是可以计算的.`; after is exactly
`在 $1$ 秒钟内通过导体截面的电量越大，则电路中的电流就越强.`.

Exact boundary 2 is between paragraphs 11 and 12: before is exactly
`现在我们可以讲，电流的各种效应的强弱程度是与电流强度有关的.`; after is
the whole three-line paragraph beginning
`在由电源及首尾相接的一串导体(参看图 $268$)所组成的简单电路中`
and ending `在单位时间内通过电路中导体的任何一个截面处的电量都相等.`.

The complete exact before/after strings, including newlines, are saved in
`text-parser-evidence.json`; they equal the template objects byte-for-string
and match exactly one adjacent pair through the shared parser.
`htmlfrag-evidence.html` is actual parser-generated evidence, not a screenshot
or a fabricated paragraph count: 15 `<p>` elements, 2 `<hr>`, 0 image elements,
and no KaTeX errors.

## Two Bold Joins

Real `proseInline` output shows the raw adjacent `****` seams as literal text:
`电流****强度` and `通****过`. Modern output removes only these seams and
renders each definition/instruction as one `<strong>...</strong>`.
All words, punctuation and the numeral/formula remain intact. These are
modern layout fixes only; the raw strings are retained unchanged.

## Semantic and Cohort Scope

Strong/weak current is explicitly charge per unit time, not arbitrary total
charge. Accumulated electrolysis product corresponds to accumulated charge.
The equal-current explanation is conditioned on a stable, unbranched,
end-to-end series circuit and no continuing local charge accumulation.
It is not a statement that all branches have equal current.

Figure 268 remains a prose cross-reference, not this lesson's structural
figure. No replacement is generated. Incoming fragment and incomplete n131
are excluded. Eight tasks / figure 279 are cohort-boundary diagnostic context,
not this target's tasks or figure; their image/content was not opened.
Only the boundary JSON was read, not its old leaf packages or source pictures.

## Technical Recovery and Provenance

The first own verifier exited 1 on prose index 7 because its whitespace
comparator converted a permitted newline after a colon into a spurious space.
The receipt is preserved in `check-text-first-failure.json`. Only that
comparator was corrected: formula strings stay exact while prose layout
whitespace is ignored. Corrected verifier exit **0**. No author edit, content
repair, image reopen, successful CLI replay or allowance reset occurred.

Earlier sealed wording `human supplied` for precise bytes/finalize/counts
means actual parent tool receipts forwarded by the parent, not a new human
observation or new quota approval. Old sealed files remain unchanged.
Current binding/parser results are this reviewer's own command evidence.
Narrow assemble and adapt-prepare exit 0 are parent receipts/forwarding,
not locally rerun stages or new semantic approval.

## Seal and Stop

Only new own directory `tmp/resume-180-6/n130-independent/` and the two new
durable reports were written. Its manifest binds necessary current inputs
and outputs, is 0444, and returns exact bytes/hash from the seal command.
New images **0**; cumulative **8/8 batch, 8/24 context**, remaining **0/16**.
No other reviewer, descendant, chat message, model/credential/quota change,
DB/Git/merge/deploy or full-course counter change occurred.
TEXT and independent SOURCE complete; stop and wait for the parent.
