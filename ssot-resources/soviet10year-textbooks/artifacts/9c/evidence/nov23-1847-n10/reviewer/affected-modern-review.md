# N10 affected modern wording and anchor review

STEMROBIN-184 / `ana9-c2-s3-n10`, 2026-11-23.

Sole working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Result and Scope

**PASS for the affected p0043#2 wording and matching section-break anchor. No substantive defect found in the current final single-sentence version.**

Reviewed only `/prose/5` and its matching `/section_breaks/2` anchor in the current lesson template. This assessment supersedes neither source evidence nor other reviews. The prior [modern-review.md](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/modern-review.md), [source-math.md](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/source-math.md), corrected source comparisons and [answer-review.md](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/answer-review.md) are reused for unchanged content.

The earlier two-sentence counting draft is not the reviewed candidate. The caller's latest single-sentence wording is the bound version below.

## Current Affected Text

Source identity remains `p0043#2`, printed page 36.

```text
在每个球被取出的机会相等的假设下，从10个不同的小球中取出一个，10个球各自对应一种基本结果，合计10种等可能的基本结果。
a) 红球有5个，因此事件的概率等于$\frac5{10}=\frac12$。
b) 非黑球共有8个，包括3个白球和5个红球，因此所求概率等于$\frac8{10}=\frac45$。
```

The counting sentence still assumes equal individual-ball chances, draws one ball from ten distinct physical balls, and counts those ten individual outcomes rather than equiprobable color categories. Combining the counting clauses does not change the sample space, event, denominator, or argument.

Compared with frozen source p43:L04-L09:

- Both source and revised text have the nonformula numeral sequence `10,10,10,5,8,3,5`; in particular, all three source occurrences of `10` are preserved.
- The a/b subparts remain red and not black. Both explanations and the favorable counts are unchanged.
- The formula signature remains exactly `\frac5{10}=\frac12`, then `\frac8{10}=\frac45`, agreeing with the retained independent source solving.

This is a meaningful counting explanation, not merely added numerals to satisfy the mechanical occurrence check.

## Matching Anchor

- `/section_breaks/2/before` exactly equals the complete current `/prose/5/text`, including the single counting sentence and unchanged a/b lines.
- Its `after` still equals the previously approved Example 2 opening:

```text
例2。
有五条线段，长度分别是1、3、5、7和9厘米。
从中不放回地随机取出三条，每组三条线段被选中的机会相等。
```

- A targeted read-only assertion check confirmed the current text, source numeral sequence, formula signature, unique matching anchor and unchanged `after`; exit code 0.
- The caller's documented normalize-helper/proseFlow result `breaks [1,4,8,16]`, with no errors, is reused. The affected normalized paragraph boundary remains **8**. That flow index is distinct from the raw JSON anchor array index **2**. No whole-lesson flow computation or semantic re-review was rerun here.

The retained `modern-first-failure.audit.json` records the earlier missing-`10` failure. It was inspected without modification. The caller also retains the prior anchor failure; neither failure is erased or misrepresented as a new substantive mathematical defect.

## Exact Current Binding and Stop

Template:

`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n10-nov23-source4345/adapt/9c/modern-us-neutral/lessons/ana9-c2-s3-n10/lesson.template.json`

SHA-256: `fb92f640a64f832cab7691f9a8ffe1658a334cd48b9994a07a555c86ec436dcb`.

All other modern prose/tasks, source findings, answer approvals, table-related prose and figure objects are reused unchanged as directed, not reopened for review. Additional image opens: **0**; cumulative visual opens remain **5**.

No keys, choices, N11, figures, DB, `.env`, Git, dependency, network or other-agent operations were undertaken. No candidate or prior evidence was edited; only this report is newly written.

Stop after this affected-only confirmation.
