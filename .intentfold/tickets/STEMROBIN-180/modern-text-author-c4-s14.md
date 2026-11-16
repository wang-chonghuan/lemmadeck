# phy6-c4-s14 Modern Text Author Freeze

Ticket: STEMROBIN-180. Printed section: 61, 压强计.
Status: frozen author candidate; independent full TEXT review pending.
The author mechanical PASS is not independent approval or course completion.

## Scope And Authority

- Complete durable raw `lesson.json`, `lesson.md`, `exercises.json` read: 20 prose blocks, 3 questions, 7 figures153–159.
- Raw root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s14`.
- Raw lesson SHA256: `4a5268486c9322314bbfdac2e016880f6b68f4768c9db88ac3b70dfe88aa1689`.
- Raw exercises SHA256: `6f9297ce4e1dea9c6d26c50fbc17ebe341c1b807a0ca84d22692dd6f51d04d6b`.
- Each original PNG153–159 was independently opened completely at original detail with `functions.view_image`; no figure was authored or modified.
- Source page bindings cover158–161. Actual source snapshots, raw file hashes, page MD/JSON/audit hashes, original PNG hashes and profile hashes are retained in the author scratch.

## Authored Text

Only six paragraph blocks changed, by Chinese full-stop typography and complete-sentence layout. All original wording, emphasis, numeric/object bindings, figure references, caption texts, questions1–3, question grouping and order remain. No numeric_changes, new formulas, added experimental steps, answers, choices or cultural fictional replacements.

The existing 帕斯卡定律 remains in prose[1]. One retained identity declaration for `帕斯卡` is locally bound to p0159#5 and its pressure-transfer explanation; no biography or generic cultural waiver.

The U-tube, rubber hose, membrane box, compressed-air transmission, unequal levels and equilibrium explanation remain complete. Depth comparison and membrane orientation order upward → sideways → downward remain. Metal apparatus bindings remain tube1, pointer2, gear3, stopcock4 and lever5, including closed-end movement, elastic return and pointer movement toward zero.

Original153/155 central scale visible2,1,0,1,2 has no clearly stated unit; none was guessed or added. Original158 dial0–10 and N/cm² were observed and not converted or added to prose. No modern figure output/spec/candidate was created.

The raw definition's wording “测量大于或小于大气压强的仪器” is retained without an unauthorized scientific correction. All `source_text`, source snapshots, `source_refs`, exercise `pages`, identity and figure metadata remain unchanged.

## Commands And Evidence

All commands used shared existing Python:
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`

Task helper: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s14/author_tools.py`.
Actions `prepare`, `normalize`, `check`, `freeze` each run once.

- `prepare` invoked official `p2c.py adapt-prepare --book 6p --edition modern-us-neutral --lesson phy6-c4-s14 --root /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts --work /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s14`: exit0; initial templates preserved in prepare-freeze.
- `normalize` invoked existing edition layout formatters, then `node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs --json <candidate>`: exit0. Manual author state preserved in authored-pre-normalize.
- Actual normalized prose_flow yields11 paragraphs. Four adjacent anchor pairs copied from actual output resolve at1,6,7,9: definition→liquid apparatus; height difference→depth experiment; depth→direction experiment; liquid→metal apparatus.
- One text-only stable-helper check: PASS/exit0;23 targets;20/20 prose blocks;3/3 questions;7/7 source figure IDs; source/identity/errata/numbers/formulas/culture/layout/anchors/reference membership checked; errors=[]; KaTeX warnings=[].
- Figures template is byte-identical to official prepare. No figure gate or full validator was run.
- No firstFAIL occurred; no repair or repeated gate. There is no failure snapshot to suppress.

## Frozen Handoff

Candidate directory: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s14/adapt/6p/modern-us-neutral/lessons/phy6-c4-s14`.

- `lesson.template.json`: SHA256 `0c67880c0f4e795067c4ff2547b3f2bf3519e8eeefc5fd18466b0e07bf918974`.
- `exercises.template.json`: SHA256 `11e6ec7e11f8278562ced757da847aa9b0bd28db3e656079615a72462805dd08`.
- Unchanged `figures.template.json`: SHA256 `5bea1483f90796737e64a34875fdd245f6ec24aac2f9edabd69b3d2d89b277dc`.

Scratch root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s14`.
`author-handoff.json` binds exact template/report/snapshot/manifest hashes; `author-freeze-manifest.json` lists frozen files; `full-text-snapshot.json` contains complete raw and modern lesson/exercise documents; `raw-source-snapshot` preserves original three raw files; `authored-field-diff.json` records actual field-level differences.

No adapt-finalize, render, assemble, publication, source/durable/app/DB/Git/dependency/stable-tool edits, browser, tests or external service calls. Only task-local helper and candidate/report files were written. Model token usage and cost were not measured. No in-flight tool/session. Authoring stops here with frozen bytes; independent TEXT review and later figure assignments belong to main.
