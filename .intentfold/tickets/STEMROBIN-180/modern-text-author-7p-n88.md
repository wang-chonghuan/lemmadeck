# n88 modern TEXT author freeze

- Scope: `phy7-c1-s1-n88`, Chinese `modern-us-neutral` TEXT only.
- Isolated root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n88`.
- Status: authored candidate frozen for FIRST independent full TEXT review. No independent approval, retention, adapt-finalize, figure approval or complete-lesson claim.
- Complete raw JSON/Markdown/exercises were read before authoring: 10 prose entries (8 paragraphs, 1 body figure, 1 caption), 8 original tasks. All source snapshots, lesson identities and exercise `number/source_number/group/group_id/pages/figure_refs/figures` remain unchanged.
- All 8 tasks remain: g1 `1..5` in `问题`; g2 `g2-1..g2-3` in `练习 44`. No task, quantitative reading, answer, choice or interaction was invented.

## Source observations

Actual full original `ssot-resources/soviet10year-textbooks/artifacts/7p/figures/fig-222.png` was opened before modern edits. The flask's black/plain sides, stopper, thin right-angle tube, colored liquid plug, complete horizontal tube end and incoming rays are retained as context. There are no readable temperature numbers or calibrated temperature units. The source distance `约一米` comes from prose, not guessed picture dimensions.

Only the necessary original physical page 233 image was additionally opened to distinguish emphasis: the high-temperature radiation sentence is bold; the vacuum-transmission distinction has dotted emphasis. Modern text uses closed bold/italic spans with punctuation outside their markers. Original raw encoding is untouched; no source review/gate was rerun.

## Declared Edits

- `prose[0]`: preserves all thermoscope apparatus and sensitivity facts. Distinguishes attached graduations from a calibrated thermometer; describes the historical textbook demonstration without asking children to handle hot metal/glass.
- `prose[3..4]`: retains hot metal, lateral placement, approximately one metre, rightward plug movement, heated-air expansion and radiation. Air's poor conductivity and side placement support the intended primary-radiation interpretation, but do not absolutely exclude conduction, drafts or convection.
- `prose[5]`: preserves radiation, vacuum propagation and the Sun example, with source-bound emphasis/layout clarification.
- `prose[6]`: retains body/stove/bulb examples and hotter-body emission comparison; adds equal area/surface conditions and distinguishes gross emission from net absorption minus emission.
- `prose[7]`: retains absorbed radiation and internal energy; qualifies temperature increase with material/wavelength, energy exchange and unchanged physical state.
- `prose[8]`: retains both flask orientations, comparative plug displacement, black-surface emission/cooling, and bright/black kettle comparison. States equal comparison conditions, relevant material/wavelength limits, solar absorption versus self-emission bands, and other heat-transfer contributions.
- `prose[9]`: retains all silver-white balloon/wing and black satellite-component examples as source textbook design examples, not universal modern design rules or color-only net-heating claims.
- All prompts preserve their original cognitive tasks. q3 asks for the textbook demonstration description rather than unsupervised hazardous reproduction; q4/g2-3 bound surface claims to relevant bands/material/comparison conditions; g2-1 retains walls/open hot-air windows/sunlight through glass and asks all applicable heat-transfer forms; g2-2 asks the primary transfer and conditions, without supplying its answer.
- No new given value or formula; `numeric_changes=[]`, math signatures unchanged (0 formulas). `historical_entities=[]`: this source has no retained cultural-exception historical identity.

## Layout And Mechanics

Canonical normalization yielded 17 actual paragraphs. Three concept boundaries at resolved indices `6,10,15` use exact adjacent final-paragraph text from the single real `prose_flow.mjs --json` output, not manually counted prose blocks. Exact anchors are in `authored-anchors.json` and the candidate lesson.

One full TEXT author check ran through current lesson APIs: 18 upper-text targets, source snapshots, identities, all tasks, normalized layout, references, numbers, math, profile and actual flow. It exited 1 solely because my scratch checker incorrectly expected the two authorized edited working templates still to equal their pre-edit hashes. The first failure, its candidate bytes, stdout/stderr/call and checker are preserved under `first-failure/`.

The sole mechanical-inclusive repair distinguishes immutable prepared snapshots/before-edit lineage from authorized mutable author output. The targeted binding check exited 0 over all 19 snapshot pairs; candidate lesson/exercises/figures bytes are unchanged from the first full check. All successful content/flow checks are reused, not rerun. This is not a stable-tool patch or an exemption. Budget is exhausted at `1/1`; any remaining essential issue blocks this candidate.

Current combined evidence: `repair-01/text-only-mechanics-combined.json`; targeted evidence: `repair-01/binding-repair.json`; original full failure: `text-only-mechanics.json`. No source/finalize/render/image gate was run.

## Frozen Bytes

Three templates under `adapt/7p/modern-us-neutral/lessons/phy7-c1-s1-n88`:

- `lesson.template.json`: SHA-256 `0d42802d4f611d8eb07d22deb6bab1579d01619c225437e522f5dc788341a683`.
- `exercises.template.json`: SHA-256 `8298badcefa12849ad66595d9bd67eb34cf4de4f870a38327cddb71e998173f2`.
- `figures.template.json`: SHA-256 `a0af1b4391412a9db3c278582defb83cf477ec0653fb78974ae006c34927e787` (unchanged prepared template).

Full modern/raw prose and all prompts, source inventory, conditions/adjustments, profile, identities, exact input bindings and final anchors: `author-context.json`. Full file manifest and byte-for-byte `frozen-01` copies: `manifest.json`; entry: `author-handoff.json`. The handoff supplies exact absolute paths and hashes for independent review.

## Calls And Boundaries

Exact argument arrays, exits, stdout/stderr hashes and tool epochs are in `author-ledger.json` and `evidence/*.call.json`.

- Official adapt-prepare: once, exit0, explicit isolated `--work` and artifact `--root`; default `--books` unchanged.
- Snapshot/author/canonical normalization/actual flow/anchor recording: once each, all exit0.
- Full TEXT mechanics: once, exit1 (the two scratch binding assertions above).
- Sole targeted binding repair: once, exit0; full mechanics reruns0 and flow CLI reruns0.
- Shared Python uses `-B` and `PYTHONDONTWRITEBYTECODE=1`; all recorded stable tool/profile hashes were unchanged within each call.
- Figure authoring/render/preview/service/official-review/promote calls0 for n88. No browser or process left running.
- No canonical raw/modern edition, answers, choices, private solutions, DB, Git, app, schema, dependencies or stable tools were read or modified outside the explicitly permitted source/text API context.

Figure222 remains a future independent image-author/reviewer dependency. This freeze is TEXT only, not ready for complete-lesson finalization. Figure210 remains BLOCKED1/1 untouched. Figure211's separate author freeze is unchanged and already available for FIRST independent figure review.
