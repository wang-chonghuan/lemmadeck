# phy6-c4-s20 modern text author

Status: AUTHOR COMPLETE, frozen for independent text review. Not an
adapt-finalize result, figure approval or whole-lesson PASS.

## Exact scope and inputs

Complete approved raw lesson and exercises were read from:

- [lesson.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s20/lesson.json),
  SHA `920d6f684c4ec7cecf459994e5255815ed50cb1d9413f943cab12125da25ba8e`.
- [exercises.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s20/exercises.json),
  SHA `3a183f28c1dc578bcf736308dd46096b73c2c981442b4bb6f753abd09f696e75`.

All 10 source prose blocks, all two original tasks and actual full original
PNG173/174/175 were read. Source page reviews were reused; no page-pixel
reaudit or source assembly was performed. No answers, private source
solutions, choices, previous choice outputs or authored answer files were read.

The supplied once-prepared templates were retained in `prepared-snapshot/`;
this author did not rerun adapt-prepare. No raw/durable file was changed.

## Frozen candidate

Template root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s20/adapt/6p/modern-us-neutral/lessons/phy6-c4-s20/`

| File | SHA-256 |
| --- | --- |
| lesson.template.json | `9921c9d0d5bdfe5701ab8a3acb4ef54d426c79911e7129440a64621447a43268` |
| exercises.template.json | `73426fc0ddb6832d553ba543dcfed61be6c9bd2030ecf3ec8347b8f94154957d` |
| figures.template.json | `557a30df7347e8dafd7ef922b70305cf95c02486df6d32a1b7a4b47fac203e04` |
| author-context.json | `df3a9dcb6f585c01dc20d26b0806e447ab4886db9b3e8f0c15435cbce3815ebc` |

[author-context.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s20/author-context.json)
contains all upper-modern blocks and both full prompts, complete identity/
reference/change/history metadata, original PNG bindings and the actual
boundaries. It does not substitute nested raw excerpts for modern text.

Counts: 10 source/modern blocks = 8 p + 1 figure + 1 caption; 12 normalized
正文 paragraphs; 2 prompts in 练习34/g1, original numbers 1 and 2; 3 figures.
Title/card/group/number/source_refs/pages and figure ownership remain unchanged.

## Full block and task account

| Source block/unit | Preserved content and declared adaptation |
| --- | --- |
| p0179#6 | Early desire for flight and balloon use; fig173 reference intact; modern punctuation/wording. |
| p0179#7/#10 + p0180#1 | Hot air, hydrogen/helium comparison, standard-pressure approximate givens, equal-volume displaced-air buoyancy, both subtractions and bold gas-lift definition; own envelope/basket load scope clarified. |
| p0179#8/#9 | fig173 body figure and caption unchanged. |
| p0180#2 | Air density/altitude comparison limited to fixed displaced volume; sand is poured from ballast bags, not whole bags dropped; upper height and gas-valve descent account retained as historical operating description, not modern flight guidance. |
| p0180#3 | Daily launches at the source-described places, diameter, height, instruments/radio, altitude/pressure/temperature/humidity, wind direction/strength and weather-forecast role retained; no present-day national-operational claim. |
| p0180#4 | Giant stratosphere balloons, original volume range and bold 同温层气球 retained; “不久前” replaced with explicit source attribution. |
| p0180#5 | 1934, 22km, source record claim, three actual historical names, historical craft/institution name and fatal descent accident retained; celebratory rhetoric removed. |
| p0180#6 | Bold lighter-than-air aircraft classification retained as the class introduced here. |
| p0180#7 | First 飞机 remains bold, second occurrence is not made bold; heavier-than-air contrast and later-course boundary retained, major transport form attributed to the textbook rather than asserted as a new current fact. |
| g1/1 p0181#2 | Compressed-air bottle on balance, stopper, switched glass tube and initially uninflated toy balloon; weights balance a, bottle air inflates balloon b and equilibrium is lost; actual classroom observation/explanation task retained without an added direction, mass argument or answer. Source labels а/б become a/b. Historical apparatus/safety boundary stated. |
| g1/2 p0181#5 | Light glass sphere suspended from balance, added weights, initial balance, bell jar/air pump, removal of ambient air and observed imbalance; original explanatory question and fig175 reference retained without a solution. |

## Quantities, physics and history boundaries

All original number sequences and `$...$` signatures remain unchanged per
source block/task. No numeric_changes or unregistered formula correction:
13/0.9/1.8/12.1/11.2 N; all unit-volume statements; 1–2m, 35–40km,
20000–30000m$^3$; 1934; craft-name 1; 22km.

The numerical gas weights remain the source's standard-pressure approximate
data. No new temperature, g value, measured pressure or precision is invented.
Gas lift is displaced-air weight minus filling-gas weight, before envelope,
basket or other apparatus weight is subtracted; it is not all useful payload.
The fixed-volume altitude comparison is not applied to expanding real
balloons or to a constant high-altitude diameter.

“现在”“我国”“不久前” are not turned into unsourced modern US claims.
Historical country, three source-translated real names and the historical
craft/institution identity have per-item `historical_entities` declarations
bound to p0180#5 and present in both original and modern text. The record
and accident are explicitly textbook reports, not independently reverified
history or current records. No web/service request was made.

## Layout evidence and first failure

First scoped text/identity/number/formula check exited 0. Inspection of its
actual normalized outline found **S20-BOLD-LAYOUT-1**: the definition's closing
bold marker was separated into the next paragraph. That initial mechanical
exit0 was not used to claim correct emphasis.

The exact rejected templates, report, ledger and helper are immutable at
[rejected-bold-layout-1/manifest.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s20/rejected-bold-layout-1/manifest.json),
SHA `dfeb158bab9733db608a525a3b3cc78a493bd0c7befafea18b0327506cafd8ce`.
[first-failure.md](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s20/first-failure.md)
records the specific defect.

One smallest author repair moves only the definition's closing bold marker
before its sentence stop and deterministically regroups prose[1]. All
non-layout affected wording, other author text/metadata, both prompts and
figure declarations are unchanged. The affected check exited 0; unchanged
units reuse their original scoped checks. No shared normalizer was edited.

After actual `edition.normalize_lesson_layout`, the anchor-free outline has
12 paragraphs. The official shared proseFlow resolves all three current
anchors uniquely at indices **4, 6, 10**:
gas comparison → altitude model; historical altitude operations → atmosphere
research; historical flight report → aircraft classes. These are copied
complete adjacent paragraph anchors, not prose-block counts.

[author-layout-report.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s20/author-layout-report.json),
[author-layout-repaired-1.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s20/author-layout-repaired-1.json)
and [author-boundary-report.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s20/author-boundary-report.json)
contain the actual scoped evidence. The ledger gives exact argv/exit/tool
hashes; there was no full test, browser or adapt-finalize.

## Figure boundary and handoff

fig173 is in body prose; fig174/175 belong to exercises 1/2 respectively.
All three original full PNGs were actually viewed; their source SHA and
dimensions are in the complete author context. The prepared figure
declarations are byte-identical and remain unresolved modern dependencies.
No modern image/spec/render/review was authored, reused or approved here.

[author-handoff.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s20/author-handoff.json)
and its manifest bind the current full templates/context, raw sources,
all author evidence, unchanged prepared snapshots and preserved first failure.
Main must independently review the text and separately distribute/approve
fig173/174/175. Await that notification; do not start figures from partial
context. No retention, canonical write, finalize, publication, DB, Git, app,
dependency, private-answer access or extra full gate occurred. 166/168 stay
immutable.
