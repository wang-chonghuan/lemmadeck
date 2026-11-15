# S7-T1 Modern Text Author Freeze

Date: 2026-11-15. Ticket: STEMROBIN-180. Batch 9's zero-question supplemental
reading slot. **Author draft frozen; independent full TEXT review pending.**
This report is not the author's self-review or approval.

## Scope

Workspace:
`/Users/yong/.codex/worktrees/0f12/lemmadeck`

Fresh owned scratch:
`.tmp/ld-s10y-lesson/text-author-c4-s7-t1`

Candidate:
`adapt/6p/modern-us-neutral/lessons/phy6-c4-s7-t1`

Read the complete current durable raw `lesson.json`, `lesson.md` and
`exercises.json`, the lesson skill/cap4 text contract and current modern profile.
The full closed raw contains 16 blocks: 8 paragraphs, 4 figures, 4 captions;
0 exercises. The candidate retains exactly those blocks and identities.
The original title, null number, source bindings and raw snapshots are unchanged.
No source-page review was repeated. The original figure PNGs were opened for
context only; no modern figure gate was performed.

## Text Authorship

| Raw Binding / One-Based Prose Block | Authored Treatment And Preserved Content |
| --- | --- |
| `p0139#3` / 1 | Chinese punctuation and canonical line layout only. Retains several-kilometre ocean depth, 10 kilometres not being the greatest depth, approximately 100000000 pascals and the parenthetical 100000 kilopascals. |
| `p0139#4` / 2 | Punctuation/layout only. Retains water's small compressibility and the comparison of deep and near-surface seawater density, without changing “small” into “zero”. |
| `p0139#5` / 3 | Modernizes 考查/其它 to 考察/其他 and explicitly attributes the source's deep-ocean fish/other-organism description to the textbook. Retains adaptation to high pressure, pressures measured in millions of pascals and the stated same internal pressure. No species, expedition, record depth or externally verified modern claim is invented. |
| `p0139#6` / 4 | Explicitly scopes all three original statements as the textbook's historical narrative: special training, no special protective means, 80 metres, about 800 kilopascals, and the source's greater-depth/chest-damage condition. Adds the concise source-bound clarification quoted below; nothing is silently deleted or medically corrected. |
| `p0139#7`, `p0139#10`, `p0140#1` / 5 | Retains riverbed work, repair of ships/dams, salvage, rubberized cloth over thermal clothing, screw-attached thick-window helmet, lead shoes and chest/back weights, the source sinking explanation, continuous hose air and hose restrictions. Also retains carried compressed air in strong steel cylinders, “not exceeding 90 metres”, the bold water-breathing-apparatus name, figure 124 and the swimmer-use statement. Equipment/practices are source-attributed historical descriptions; the 90-metre sentence is itself explicitly historical after paragraph normalization. 贮 becomes 储. |
| `p0139#8-9` / 6-7 | Figure/caption 123, its identity and original source binding remain unchanged. |
| `p0140#2` / 8 | Preserves the source's deep-sea-device transition and both bold device names. The line-split adjacent bold runs are joined into the continuous `**深海探测器和海底潜水考察箱**`; no word is changed by that markup joining. Adds historical attribution and modernizes 考查 to 考察. |
| `p0140#3-4` / 9-10 | Figure/caption 124 and source identities remain unchanged. |
| `p0140#5` / 11 | Preserves the extremely strong steel sphere, thick glass windows, people inside, telephone communication with the surface and lowering by steel cable from a specialized ship. Source-attributed apparatus description; 考查/呆 become 考察/待. |
| `p0140#6-7` / 12-13 | Figure/caption 125 and source identities remain unchanged. |
| `p0141#1` / 14 | Retains the no-cable-to-ship distinction, onboard engine and movement in any direction at great depth. Source attribution; 相联 becomes 相连. No operational specification is added. |
| `p0141#2-3` / 15-16 | Figure/caption 126 and source identities remain unchanged. |

At `p0139#6`, the exact added clarification is:

> 这些历史描述不是潜水建议，也不表示所述深度对任何人安全。

`changes` declares `clarification` for the historical attribution and that
sentence, `language-modernization` for the lexical updates and `layout` for
punctuation/markup/line layout. No non-formula value was changed:
`numeric_changes` remains empty everywhere. No mathematical expression occurs
in the raw or candidate, so there are zero changed math bytes and no KaTeX
execution/coverage is claimed. The official prepared errata list remains empty.

The source's 80/90-metre claims and injury account are preserved *as historical
textbook statements*, not certified scientific/medical claims or contemporary
safe depths. No modern diving advice, research, training instruction or child
experiment authorization is supplied. The source is not sanitized by deleting
equipment, depths, conditions or historical practice.

No named historical person/place/institution requires a retained-name
declaration in this reading. Every `historical_entities` array remains empty.
Generic historical attribution uses `clarification`, not a cultural exemption.

## Quantity Inventory And Mechanical Limit

Author reading compared these actual literals and contexts in the complete
raw/candidate text. This inventory is not a new automatic-grading task:

| Source Block | Preserved Quantity / Context |
| --- | --- |
| 1 | `10千米`; `(这个深度不是最大的)` meaning retained; `100000000帕斯卡`; `100000千帕斯卡`; approximately retained |
| 3 | `以百万帕斯卡计`; same stated internal/external pressure |
| 4 | `80米`; special-training/no-special-protection historical condition; `800千帕斯卡`; approximately retained |
| 5 | `不超过90米`; compressed air in strong steel cylinders; references `图123`, `图124` |
| 11 / 14 | Source references `图125` / `图126`; no added dimensions or rated depths |

Important coverage limit: the current official `number_signature` output does
not enumerate numeric literals immediately adjacent to Chinese unit characters.
Its recorded arrays are empty for the prose depth/pressure values, while the
space-separated captions produce 123-126. Consequently the official
number-signature check alone does **not** prove those quantity literals were
preserved. They are listed here from full author reading for independent source
comparison; the tool was not patched and no numeric exemption was added.

## Canonical Layout And Actual Anchors

The existing `edition.normalize_lesson_layout` normalized all eight paragraph
blocks, producing 12 final display paragraphs. Empty exercises were passed
through `normalize_exercise_layout` without inventing any task.
`prose_flow.mjs --json <actual-normalized-template>` ran after normalization,
and its complete stdout is preserved in `normalization-and-flow.json`.

Three actual adjacent paragraph pairs were copied from that outline into
`section_breaks`: deep-ocean organism discussion to historical human diving;
the historical-depth clarification to the historical work/equipment account;
and the swimmer-use sentence to deep-sea vessels. The final official
`prose_flow_contract` resolved them at `[3,5,9]`. They were not derived by
counting source blocks or hand-written integer boundaries.

## Actual Original Figure Context

Each full original below was opened once with `view_image(detail="original")`.
It is only context for this text and future figure authors, not new source
approval or a modern illustration review.

| Original | Dimensions | Observed Context |
| --- | --- | --- |
| 123 | 251 x 571 | Complete standing, heavily equipped diver, helmet/window area, upper connection, suit, arms/hands and both boots. |
| 124 | 947 x 294 | Complete horizontal swimmer with breathing/cylinder equipment, face covering, bubbles, both fins and long handheld implement extending to the left. That source object was not deleted or reinterpreted as a new task. |
| 125 | 347 x 487 | Steel sphere depiction, suspension chain/eye, separate upper lead, window openings and lower supports; source linework is retained as context, not supplemented with derived pressure labels. |
| 126 | 943 x 704 | Separate elongated craft with viewing area and two illuminated regions containing sea-life shapes; no tether-to-ship is drawn. The engine/mobility description comes from the prose, not an invented pixel measurement. |

Exact opened paths:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-123.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-124.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-125.png
/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-126.png
```

## Call Ledger And First Failures

Shared interpreter for all Python calls:
`env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`

| Phase | Calls / Exit | Evidence |
| --- | --- | --- |
| Official `p2c.py adapt-prepare --book 6p --edition modern-us-neutral --lesson phy6-c4-s7-t1 --work .tmp/ld-s10y-lesson/text-author-c4-s7-t1` | 1 / 0 | 16 blocks, 0 tasks, 4 figures; fresh templates; artifact root and source-manifest defaults unchanged |
| Scratch wrapper `author-text-tools.py normalize`, using existing canonical normalizers and actual flow CLI | 1 / 0 | `normalization-and-flow.json`, including exact CLI args/stdout/stderr and pre-anchor outline |
| Scratch wrapper `author-text-tools.py check`, using existing text-only APIs | 1 / 0 | `text-only-check.json`, complete input hashes, numeric signatures, flow and empty errors |

The last phase is the **only full text-only check invocation**. It verifies
complete raw snapshots, schemas/edition/lesson identities, all 16 source bindings,
source_text preservation, official text/cultural/numeric/math rules, exact math
tokens, empty exercise identity, normalizer idempotence and figure-reference
identity with actual figure objects. It resolves the final anchors through the
official flow contract.

The zero errata list is reused from official prepare and checked unchanged;
the authority-page errata/source gate was not rerun. No full adaptation validator
or modern-figure validator is invoked by the scratch wrapper. The local wrapper
only records calls to existing APIs; it changes no stable tool/profile/schema
and refuses to overwrite an already recorded text-check run.

First failures: **0**. Repairs/retries: **0**. No failed candidate or log was
overwritten. No empty KaTeX run, independent semantic PASS or figure approval is
claimed by the text-only exit 0.

## Exact Frozen Hashes

All scratch paths below are relative to this report's directory.

| Frozen File | SHA-256 |
| --- | --- |
| `adapt/6p/modern-us-neutral/lessons/phy6-c4-s7-t1/lesson.template.json` | `0107cd20af656758b17fc5cd97afc1b3b2760c7ad6ca3c0b13852b7ca61580b3` |
| `adapt/6p/modern-us-neutral/lessons/phy6-c4-s7-t1/exercises.template.json` | `58712bae1ad525d675c4bbac26a74aef50f44ea31548c82ad6c2004e6810033c` |
| `adapt/6p/modern-us-neutral/lessons/phy6-c4-s7-t1/figures.template.json` | `919a6190a69d000c2c1acd2cbc5588edaa463d682a328ad0ed1a20e49aef2553` |
| `adapt/6p/modern-us-neutral/book.template.json` (official prepare output, untouched) | `b70bb9a2382d6169e1c9b3d0698b72004683bee3d1685809a33ef8b9712e8232` |
| `author-text-tools.py` | `67f931f628120cad1ef5ee970de6bc28a9a0f403ad99cc3c5f3f00dac89c8acd` |
| `normalization-and-flow.json` | `71d6d3e2e3eb9e35e432509768062e5ab5ea4e25eabc6144f584056c49d305ff` |
| `text-only-check.json` | `fd86d0ce9e9cc9ce4e72bb191e1cd36bca166956cd17d09be2456f233b9ff4ab` |

Raw lesson directory:
`ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s7-t1`

| Raw File / Original Asset | SHA-256 |
| --- | --- |
| `lesson.json` | `001641c820468cd7fc2335f289cade7b5a97a0ed901a6e789f5b47cd7da58039` |
| `lesson.md` | `f51d342e42d1b575926a2451345b49694dd406e7d22e1d042b65a2aab0da1bd4` |
| `exercises.json` | `25cc266b0d3a39b59ef220cbc78e7267e33b98b7ac7128826ae2725dfd8de0d6` |
| `artifacts/6p/figures/fig-123.png` | `6187c66ff7571dc73a9f4012152f3945371482e2232498b398ee47c58f4dbd30` |
| `artifacts/6p/figures/fig-124.png` | `10303a0645907c4cf50a707196dd4ed2d8a4d654fbfd58ff09c28049e2600a9b` |
| `artifacts/6p/figures/fig-125.png` | `67df314c32314b364bf490ae2af3e440767b30712de49d0ec762b54bf70f71f2` |
| `artifacts/6p/figures/fig-126.png` | `9fa43056425519df9929653387fe6058d1a50c0de3c6a264606c6c5a6f26342c` |

Read-only production contract/tool bindings:

```text
b3666f4ea4a094c269a2d628a455cbb00598e770d93903fd810597e6f8a9b405  .claude/skills/ld-s10y-lesson/SKILL.md
483ebed7d79146af36e547a3d8c88ac4fdca06944fb46c759f83e2cb14a6b06b  .claude/skills/ld-s10y-lesson/tools/p2c.py
b48f7beedb54635876f426526d8541925c956c0f84e298f77c3fe34c229f4b2c  .claude/skills/ld-s10y-lesson/tools/edition.py
f2a16357e2a0d5f8541b0cb401c5193c9cb10f6333dc16f92d5c7a18a5bee309  .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs
c2f0301c5ba7811336a5268a404f795ace7873b75eb93c42c10186f3d9c3f9f6  .claude/skills/ld-s10y-lesson/tools/htmlfrag.js
f03840602a5de0c22b7eea096fe24db758c6d66b6532c75cda26c6766a1573f1  .claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json
8deecbc68434e57b30ed8717dc22170a1988a0856af200a1875da58a3334bf90  .claude/skills/ld-s10y-lesson/references/edition-text-contract.md
```

## Handoff And Stop

`author-handoff.json` binds this report, all candidates, scratch evidence and
source PNGs. Independent TEXT review is next. Figure authors 123-126 may use
this complete frozen text and the original assets as their semantic/context
inputs; they must independently inspect their own originals and may not treat
this text author freeze as figure approval.

Modern figure creation/review remains pending. No finalize, durable edition
promotion, book/index edit, source change, question/answer/choice authoring,
app/DB/schema/dependency/Git operation, service or browser was performed.
No 156+ task or prior source re-review was started. No contemporary diving
research or safety advice was offered. Owned tool sessions are closed.
