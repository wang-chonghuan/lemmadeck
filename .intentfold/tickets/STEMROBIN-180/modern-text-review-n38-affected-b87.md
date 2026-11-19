# B87 n38 Independent Affected-Only Measurement Review

## Decision

**PASS, limited to F1's revised P3 teaching/measurement clarification and its
change declaration in the exact candidate2 below. No actionable defect found.**
Same STEMROBIN-180 cap3 invocation180-3, 2026-11-19. This is not a new full
SOURCE/adaptation review, product acceptance, publication approval, or approval
of any other lesson, page, source finding, or instrument specification.

Reuse the full SOURCE binding and permitted punctuation/space adaptation PASS
in `modern-text-review-suspended-mass-b58.md`. Its original P3 F1 teaching HOLD,
other source HOLD/FAIL findings, and old internal repair-budget 1/1 history
remain unchanged. This result resolves that teaching ambiguity for this exact
revised candidate only; it does not relabel FIRST. The human's supplied latest
22:05:44 direction permits ordinary source-backed repairs; no old budget was
reset or used as a present prohibition.

## Scientific Meaning And Framing

Reviewed the entire affected `/prose/2/text`, its declaration, the recovered
actual Sartorius public overview, and the saved affected normalized text and
both actual proseFlow paragraphs. The revised P3 is:

> 天平是很灵敏的仪器。
> 原教材把“灵敏度最高的天平”的最小可测质量描述为“百万分之几克”，这是原书的量级介绍，不是所有天平在任何条件下都能可靠测量的最小质量保证。
>
> 天平显示的最小变化量与满足某一相对测量不确定度要求的最小样品质量不是同一概念。
> 实际可靠称量的下限取决于所用天平、测量条件和允许的不确定度，应按具体仪器的说明和测量要求确定。

The first output paragraph explicitly attributes both quoted phrases to the
original textbook. They are faithful phrases from the unchanged P3
`source_text`, not quotations attributed to Sartorius. The millionths-of-a-gram
scale is retained as source description, not asserted as a current worldwide
best, an instrument-independent reliable minimum, or a proved historical
limit. No conversion to milligrams, replacement number, capacity range, or
instrument-specific claim is introduced.

The second output paragraph distinguishes display increment from the minimum
sample mass meeting a specified relative measurement uncertainty. It does not
equate readability, sensitivity, and reliable minimum mass or claim that
displaying a tiny increment makes that sample mass reliably measurable.
The opening qualitative sensitivity sentence introduces no such equivalence.
The particular instrument, measurement conditions, and permitted uncertainty
are identified as necessary context; no arbitrary reliable lower limit or
unsupported uncertainty percentage is chosen.

The recovered public overview directly supports the uncertainty qualification:
it explains that smaller sample weights have larger relative measurement
uncertainty and that minimum sample weights are specified against a relative
uncertainty limit. This is overview evidence only. The instrument/conditions
qualification is a conservative measurement interpretation consistent with
B58 F1, not a claimed quotation or model-specific result from the gated paper.
No gated paper, calculation, specification table, or new web material was read.

`changes` is exactly `["layout", "physics-clarification"]`, accurately declaring
the substantive qualification rather than disguising it as punctuation.
`numeric_changes` and `historical_entities` remain empty: the quoted source
quantity is not numerically replaced, and no historical entity is introduced.
The raw snapshot, `source_text`, source references, and empty `errata` remain
exact; the adaptation is not presented as a source-transcription correction.

## Exact Static Scope

Only these two value pointers differ between FIRST and candidate2:

```text
/prose/2/text
/prose/2/changes
```

All nine FIRST/candidate1/candidate2 templates have canonical serialized JSON
bytes. Replacing those two candidate value tokens with their FIRST values
reproduces FIRST lesson bytes exactly. Thus bytes outside those values are
unchanged, not merely semantically equivalent. Full P1/P2 objects, all three
`source_text` values and ordered source references, every source metadata field,
and the complete embedded raw snapshot are exact.

The three lesson formulas, and their three embedded raw-source occurrences,
remain exact and ordered:

```latex
|\vec{F}|=m|\vec{g}|
|\vec{P}|=|\vec{F}|
m=\frac{|\vec{P}|}{|\vec{g}|}
```

Candidate1 also differs from FIRST at exactly the same two value pointers.
Candidate2 differs from candidate1 only at `/prose/2/text`: exactly two sentence
LFs are inserted, with every non-LF character unchanged. Candidate1 already
contains the double LF separating the two output paragraphs; it is preserved.

Counts: 3 lesson prose objects; 1 affected source prose object, P3 `p0162#3`;
2 FIRST P3 sentences becoming 4 revised sentences; 2 saved output paragraphs
of 2 sentences each; 0 tasks; 0 figures; 3 unchanged lesson formulas.
Both empty task/figure templates are byte-identical across all three stages.

The saved actual `normalized_text` equals candidate2 P3 exactly. Its two saved
proseFlow paragraph texts rejoin with `\n\n` to the same exact string; their
indices are `(0,0,0)` and `(1,0,1)`. `resolvedBreaks` and `boundaries` are empty.
This is a static comparison against previously produced output, not a replay
or a new rendering/learner-layout approval.

## Input Hashes

All paths below are relative to
`/Users/yong/.codex/worktrees/0f12/lemmadeck`. Template paths share
`.tmp/ld-s10y-lesson/b87-n38-recovery/`.

| Exact template | Bytes | SHA-256 |
| --- | ---: | --- |
| FIRST/lesson.template.json | 6271 | `3e8d145ca3d19c8efce04200ee24ef0c61e809239500bc68326cd0718c64e03d` |
| candidate1/lesson.template.json | 6698 | `e8932b68e2869e51a2444769b3b3b548943957f9bb93f6a3b4d7f0ceec19af77` |
| candidate2/lesson.template.json | 6702 | `101b98ab6ff63ba6f3783e7089503aeb0a6115654b6b8fbc0a5d2102879d30db` |
| FIRST, candidate1, candidate2: exercises.template.json, each | 419 | `13cd8eaa331cd45b2c1fa9ae08a166d38537fed567b16c6cceafcd1ed659777e` |
| FIRST, candidate1, candidate2: figures.template.json, each | 153 | `d7d6fd80b75e6b9b6278725dd2c229bc92eb6f20217dccd22db9cbd88230103e` |

Supporting paths share `.intentfold/tickets/STEMROBIN-180/`.

| Existing evidence | Bytes | SHA-256 |
| --- | ---: | --- |
| modern-text-review-suspended-mass-b58.md | 16207 | `15b1724bac8c3858dda36c7bf1d1748d3f8b5548791a032103ebbdb731fb8c75` |
| modern-text-repair-n38-b87.md | 2102 | `a7ccb89da22c4787b489c73cffeb23a6267bf3fb529e82d03f0af43f6b3da329` |
| tmp/b87-n38-recovery/receipt.json | 1615 | `6fb55884e15983c4969882020997a065c2f866d115f311c0c5647783af1a61bb` |
| tmp/b87-n38-recovery/layout-receipt.json | 445 | `9959da093bf9ea2c67f8d9faf7029632d1ed0a28a55b06004e562f06d95583de` |
| tmp/b87-n38-recovery/primary-sartorius.stdout | 2825 | `859eed17a65b69d64e308939912fcb9c0f2bae15934cdb1ef35bb488a3128d51` |
| tmp/b83-n65-raw-and-text/b87-n38-affected-layout-output.stdout | 1373 | `931b9a1948144af437037b7ba32f8eed4a5308356704254f752f1635581c44d8` |

The three FIRST hashes match B58's recorded template identities. The primary
overview matches its recorded 2825-byte recovery and exact historical hash.
The supplied candidate2 hash and both receipts' candidate identities match.

## Checks, Counts, And Stop

Completed read-only static comparison: **37/37 grouped assertions PASS,
exit0**. No input defect was found. The first reviewer helper attempt passed
16 groups, then exited1 because its difference walker treated the entire
`prose` array as one value and reported `/prose` rather than nested pointers.
The helper was corrected in memory to descend object arrays; no input or
evidence file was changed. That helper failure is not a candidate defect,
pipeline result, or hidden clean first-attempt claim.

Parent evidence records 1 scientific repair, 2 normalization calls, 1 proseFlow
call, and 0 images. The parent note retains the initial recovery hash failure;
the layout receipt retains its initial unchanged-text assertion failure.
Those historical failures and candidate1 were not changed or relabeled.

This reviewer performed 0 repairs, 0 normalization/proseFlow/pipeline calls,
0 new SOURCE reviews, 0 images, 0 paid calls, and 0 fetches. No descendant or
other-chat access, setup/freshness, backend, Git, app/dependency, DB/publisher,
prepare/assembly, product render, or broader acceptance operation occurred.
Every shell command used the supplied workspace as cwd. Only this authorized
new report was written; other agents' work and all supplied inputs remain
untouched. Report SHA is returned separately to avoid a self-hash. **STOP.**
