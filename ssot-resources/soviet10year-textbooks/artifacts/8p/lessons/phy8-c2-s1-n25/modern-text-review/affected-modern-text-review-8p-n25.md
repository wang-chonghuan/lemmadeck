# Affected WHOLETEXT / SCIENCE follow-up: 8p n25

Date: 2026-11-23. Ticket: STEMROBIN-180.
Exact workdir: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180.
Target: phy8-c2-s1-n25, modern-us-neutral, repaired current draft.
Sole independent semantic reviewer; affected follow-up only.

## Verdict

**New affected bytes: PASS. Derived aggregate WHOLETEXT: PASS.
Derived aggregate SCIENCE: PASS.**

Both original necessary findings are resolved. No remaining necessary text
revision or semantic HOLD is identified. This aggregate combines the original
review's unchanged passed findings with this affected review; it is not a new
whole-text or SOURCE review. The original REVISE report, binding and failed
author snapshot remain unchanged, including their historical verdicts.

## Exact Delta

Comparison against `author-snapshot-01/lesson.template.json` establishes only
these three changed values:

- `prose[9].text`: p0118#1; one historical attribution replacement.
- `prose[11].text`: p0118#3 + p0118#5; the intrinsic-mass paragraph.
- `section_breaks[2].after`: the exact revised intrinsic-mass paragraph.

After excluding precisely these values, the complete structured documents
are equal. Thus no other prose object, source text/ref/data, metadata,
historical entity, change declaration, erratum or boundary value changed.
The exercise template is byte-identical to the original bound template.
This is delta verification, not another semantic reading of unaffected objects.

## Affected Findings

### N25-MT-01: Resolved, SCIENCE PASS

Refs: **p0118#3 + p0118#5**.
Target: `lesson.template.json#/prose/11/text`.
Actual revised paragraph:

> 在同一*物体*的组成和内部状态不变的条件下，它的质量表示其固有性质（惯性）。
> 不管*物体*处于什么地方，或相对于观察者怎样运动，它的这种质量不会仅因这些变化而改变。
> 这里的质量指静止质量，也称不变质量；如果物体的组成或内部状态发生改变，则不能用这段话断定它的质量仍然相同。

The opening explicitly restricts the claim to the same body with unchanged
composition and internal state. It retains mass as the measure of intrinsic
inertia and identifies rest/invariant mass. Position or observer-relative
motion alone is not said to alter that mass. The ending explicitly forbids
inferring constancy after a composition/internal-state change.

Consequently the previous unrestricted interaction-independence statement
is gone; naming invariant mass no longer implies unconditional constancy
through interactions. The qualification is consistent with the unchanged
low-speed/neglected-connection-energy discussion and legacy relativistic-mass
explanation already passed. No new formula, quantity or printing erratum
is introduced. No further correction to this paragraph is needed.

### N25-MT-02: Resolved, WHOLETEXT PASS

Ref: **p0118#1**.
Target: `lesson.template.json#/prose/9/text`.
The exact replacement is:

> Before: 当时在苏联，与一些其他国家一样，有这个标准器的复制品.
> After: 旧教材还记载，在苏联，与一些其他国家一样，有这个标准器的复制品.

The copy account is now attributed to the old textbook rather than to the
preceding 1889 prototype event. The original national identity is retained,
without introducing a replacement country or an invented date. Everything
else in this source-bound prose block is unchanged, including 1889, the
prototype/BIPM/France account, water approximation, gram conversion and
current-SI clarification. No further historical-attribution correction
is needed.

## Affected Anchor And Caller Evidence

The caller's `prose-flow-repair` receipt records one successful execution of
the existing `prose_flow.mjs` on the current template. Its stdout contains
exactly paragraphs 0-29. The boundary into paragraph 21 is:

- Before: `也不能按重量来测量很小的质量，例如组成物体的原子和粒子的质量.`
- After: exactly the revised three-sentence p0118#3 + p0118#5 paragraph
  quoted above.

The current `section_breaks[2]` equals that actual tool boundary object.
Its `before` remains unchanged. The other three boundary objects are exactly
the original passed objects. The four after-indices remain **6, 15, 21, 25**
(zero-based); paragraph count remains **30**.

Inspected caller receipts, with their stdout and empty stderr:

- `.tmp/180-7-n25/modern-repair/execution.json`: exact authorized cwd,
  the parent's repair script, exit_code 0; stdout identifies only the two refs.
- `.tmp/180-7-n25/prose-flow-repair/execution.json`: exact authorized cwd,
  `prose_flow.mjs` and current lesson template arguments, exit_code 0.
- `.tmp/180-7-n25/boundaries-repair/execution.json`: exact authorized cwd,
  the parent's boundary selector and retained flow stdout, exit_code 0;
  stdout reports four section breaks for this lesson.

These parent-owned execution facts and stream hashes are retained in the
affected binding. The `.tmp/` locations are provenance, not dependencies
of the accepted text snapshot. The reviewer did not rerun the repair,
prose-flow command or boundary selector.

## Reused Findings And Aggregate

The original review's passed findings for the other **16 of 18 objects**
(including figure/caption presence only), all seven unchanged exercise stems,
formula/number fidelity and source bindings are reused without re-review.
Dollar-delimited formulas and ordered numeric literals in the two affected
blocks are also unchanged; the exact delta excludes any change elsewhere.
Registered errata and numeric_changes remain zero.

The prior SOURCE PASS and primary-source context are reused through the
original modern-text binding. No original page, pixel, crop, PDF, figure,
answer or choice content was reopened. The rest-mass qualification and
historical attribution above resolve the only two necessary original
WHOLETEXT/SCIENCE findings, which establishes the derived aggregate PASS.
There is no figure, display, solution or answer/choice-key approval.

## Current Snapshot And Preservation

The sole new author snapshot is
**`author-snapshot-02/lesson.template.json`**, byte-identical to the current
repaired lesson template and mode **0444**. The unchanged exercise snapshot
is reused from `author-snapshot-01/`; no duplicate exercise snapshot is made.
Evidence snapshots are not editable edition templates.

SHA-256:

- Current lesson template / new snapshot:
  `713def5d7da63a4154e6b900b383c815c345a3bb67027a360c7303ae20d504f4`.
- Unchanged current exercise template / reused snapshot:
  `e51f53b0031870680c440ffb9c91afd1d89b3af6edbc811da78c53d11abb712f`.
- Preserved original report:
  `23ba489962042482cb170eb345d62ddfa222cd8fe37350d1f2a51be25c4f6d00`.
- Preserved original binding:
  `384b9ed4f30b734ad4a21f2ed74e8c367e5bd4c807e9bc99b7d38c0c628b8b15`.
- Preserved original failed lesson snapshot:
  `41ad50b91bbcba4a22a429353625bd6328de4a194b8ef6a5181a5cb798c19567`.

The separate **`affected-modern-text-bindings.json`** records this report,
accepted current template hash, affected refs/anchor, original evidence
bindings, caller execution evidence and actual scope. No full-package hash
or new evidence-package copy is introduced.

## Technical Recovery And Limits

The reviewer's first snapshot-copy `node -e` call exited **1** with
`SyntaxError: Unexpected token '}'` and `Expected ',', got '}'`: a trailing
extra closing brace caused parsing to fail before file operations. No input
or output bytes changed in that attempt. The copy command alone was corrected
and rerun once, exit **0**, producing the exact read-only snapshot above.
This original technical failure is preserved here and in the affected
binding; it is not a scientific REVISE/HOLD or a hidden content correction.

All writes are only this separate affected report, affected binding and new
lesson snapshot, within `modern-text-review/`. The original REVISE evidence,
all author templates and other dirty/staged/installer/source/failure files
are untouched. **Actual images: 0.** No source re-review, new whole review,
author edit, finalize/assemble/render, Git/DB/install/browser/paid call,
new agent/chat, peer message or figure/answer approval occurred.
