# 7p / phy7-c1-s1-n82 modern TEXT author handoff

Status: TEXT AUTHOR READY, pending independent full text review. This is not independent approval, figure approval, or adapt-finalize.

## Scope and immutable source

- Author owns only `.tmp/ld-s10y-lesson/text-author-7p-n82/` and this report. The official prepare used book `7p`, edition `modern-us-neutral`, and lesson `phy7-c1-s1-n82`, with the canonical artifacts root and this isolated workroot.
- Complete raw lesson: 17 prose entries (13 paragraphs, two figures, two captions); four original questions in `问题` / `g1`; source refs span p0216 through p0219. No new question, figure, answer, choice, measurement, or formula.
- Raw lesson SHA256: `4d25283ee9388815bf4a193990041f7a5f52e7e90e222458c710c33c283fea01`.
- Raw exercises SHA256: `e4ab444801a98be4cdddfc66005e773f1e9272c50380c5d1f53fdf87b9fbece8`.
- Full raw JSON/MD snapshots, the source page MD/JSON/audit bindings, original figure PNG/SVG bindings and prepared templates are recorded in `input-binding.json` (SHA256 `40b57f76de14e20e4dd582a7cc6ceef312445eb7004c55d800dfbc36cd4d44c9`). Nested `source.data`, every `source_text`, identity, group, number and source ref remain unchanged.

## Complete modern content

| Upper entries | Source refs | Preserved content and scoped wording |
|---|---|---|
| 0 | p0216#10 | Potential and kinetic forms; both original emphasis spans. |
| 1 | p0216#11, p0217#1 | Interaction/attraction/repulsion; raised stone and Earth, compressed/stretched spring, compressed gas. Potential energy is described as an interacting-system property. |
| 2 | p0217#2 | Moving water, wind, rolling ball, flying bullet; mass and speed dependence; reference frame made explicit. Bullet remains a motion example, not operational advice. |
| 3 | p0217#3 | Bold mutual conversion statement and literal §80 reference. |
| 4 | p0217#4 | Introduction to the original lead-ball/lead-plate example, framed as textbook discussion rather than student lead-handling instructions. |
| 5 | p0217#5, p0217#10 | Ball originally on plate, raised and released (208), falling potential decrease/kinetic increase, impact and final rest (209). Air-resistance approximation, plate-based zero and rest reference are explicit qualifications, not invented source measurements. |
| 6–9 | p0217#6–9 | Exact fig208/cap208/fig209/cap209 identities, placement order, labels and source refs; no image changes. |
| 10 | p0217#11 | Mechanical energy did not disappear. |
| 11 | p0217#12, p0218#1 | Flattened ball, dented plate, both deform; original italic emphasis retained. |
| 12 | p0218#2 | Immediate post-impact temperature measurement and both becoming warmer, explicitly a source-described outcome without numerical readings. |
| 13 | p0218#3 | Emphasized deformation and heating; corresponding particle energy changes. |
| 14 | p0218#4 | §11 mean molecular motion/kinetic energy, §12 interaction/close-range repulsion, changed relative positions/potential energy, mechanical-energy conversion. Heating is scoped to temperature increase; deformation/heating are not asserted to be the only possible energy destinations. Both original emphasis roles remain. |
| 15 | p0218#5 | Bold internal-energy definition, all particles and their motion/interactions; “无规则运动” and total energy clarify microscopic rather than whole-body motion. |
| 16 | p0218#6 | Internal energy distinguished from macroscopic kinetic/potential energy; bold 内能 retained. |

All four task objects remain in order: g1-1 lifting **and** falling, g1-2 collision state changes, g1-3 energy conversion, g1-4 internal-energy definition. Lead identities remain consistent with the lesson. Prompts contain no newly authored answers or numerical values.

## Actual original figure observation

Both durable PNGs were actually opened individually before prepare in this same author run; no repeated source review was performed. Full text-context inventory is `source-figure-inventory.json`.

- `fig-208.png` SHA256 `e2973cb78c7a7e877cbd449eeebc042250456830a02ec3332d52102be5072f51`: complete boy holding the round ball above the complete plate; no numerical or temperature marks.
- `fig-209.png` SHA256 `a221de02221fc7de68fffa865f45125fd726f81650812badcdc243153ca2bf54`: complete boy, dashed initial ball position, downward dashed path/arrowhead, ball on the complete plate. No quantified flattening/dent or temperature is inferred from the pixels.
- The supplied figure template is unchanged. Its `modernized` entries/spec paths are official prepare placeholders, not authored media or approved figures.

## Execution and results

Executable: `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`.
Helper: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n82/author-workflow.py`; stages reuse the existing c5-s6 scratch-author pattern and canonical lesson APIs.

1. `prepare`: one official `p2c.py adapt-prepare --book 7p --edition modern-us-neutral --lesson phy7-c1-s1-n82 --root /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts --work /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n82`, exit0, 17/4/2. Actual command and stdout/stderr: `prepare-execution.json`, SHA256 `51acfba04e69e4355febfbc118c201704dc193ed005e853f1296737a73ae435a`.
2. `normalize`: one canonical author formatting batch, exit0.
3. `flow`: one `prose_flow.mjs --json` inspection, exit0. Anchors copied from actual adjacent output, not block counts.
4. `mechanics`: one text-only batch, exit0/PASS, all 21 upper text targets. Source snapshots, identity, errata, text declarations, full literal numeric tokens, emphasis roles, task metadata, layout, figure references and KaTeX checked through existing APIs. No formulas, no KaTeX warnings, no source errata. Final 15 prose-flow paragraphs, boundaries `[4,7,11,13]`. This batch does not validate modern figure media.
5. `freeze`: metadata/snapshot creation only, no repeat gate; exact handoff binds final templates, context, ledger, report, execution and immutable snapshot.

Mechanical evidence SHA256: `1764f5bcd7288f2022c28c79766862d78895c8669a36e2f7551b44fc78f44d17`.
Final prose-flow SHA256: `befdc1958da81f68acbce705c6cabc20134f71c7b5106810a1ce9c9496ac6db5`.
API NUMBER signatures and complete literal digit inventories are recorded separately; CJK-adjacent reference digits are not treated as API NUMBER matches.

Actual tool epoch is captured before/after every execution. At the mechanics call: p2c `acda64449af5a9c043a8502e7840f6391c95cf01a63458bbf005011b773fa8ac`; edition `4c15c8aba51f65eb5ee3bf3cdeecf9691777b221bd120b590aba7e448f64cf19`; mathcheck `8f703e723234c3ccc4d9b329d8e2f7b0053d0af261d0526169c31110a53fa8f7`; prose_flow `f2a16357e2a0d5f8541b0cb401c5193c9cb10f6333dc16f92d5c7a18a5bee309`; htmlfrag `c2f0301c5ba7811336a5268a404f795ace7873b75eb93c42c10186f3d9c3f9f6`. Historical epochs are retained as actual execution records, not substituted with current hashes.

## Frozen candidates

Root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n82/adapt/7p/modern-us-neutral/lessons/phy7-c1-s1-n82/`.

- `lesson.template.json`: `57f97c652cd181cff0b5c71491bf9efbedd19bea9558e834ed7bb5204379864d`.
- `exercises.template.json`: `6eb813689ba6162fecfd6d20e0e2abb7a7574c4c43d343108c0c1bf36f9e957e`.
- `figures.template.json`: `2dd721dc19eb4d05e4af59ff906fc5f072c025d03563dd494c33735605792a16`.
- Handoff: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n82/author-handoff.json`; immutable copies and file manifest: `frozen-01/`.

No first failure; repairs0/1. No browser, service/model, dependency/environment change, DB, Git, modern figure creation/review/render, canonical/index/assembly/retain/finalize/publish/promotion. The author does not independently approve this lesson.
