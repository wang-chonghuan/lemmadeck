# Independent Answer Author: Initial21 And Active13

2026-11-15. STEMROBIN-180. **Source-derived drafts complete; final modern text/figure binding pending.** Author only, not independent answer approval or official cap2 gate.

## Current Scope

The original s5/s6/s7 assignment produced all 21 complete derivations, kept at
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/author-c4-s5-s7/author-answers.json`.
Its SHA-256 is unchanged:
`ab299f2439bb459f2fd2abb9371deaab947e46ea84273edf2bd230a9e5904ac8`.
The same bytes and original source-figure notes are copied into `initial-21-preserved/`; `manifest.json` records the source/snapshot hashes. This report does not bind or finalize s5 or s7: main deferred them after necessary figures113 and118 exhausted their sole repair budgets. No failed figure is repaired or chased by this answer author.

Main's latest batch9 scope is **s6+s9, 13 exercises**, not a three-lesson replacement. The active draft is separately staged, preserving the original21 and the separate raw s9 draft:

| Artifact | Absolute path under `/Users/yong/.codex/worktrees/0f12/lemmadeck` | SHA-256 |
| --- | --- | --- |
| Active13 answers | `.tmp/ld-s10y-answer/author-c4-s5-s7/active-s6-s9/author-answers.json` | 53b60b6427d98cdf3b785218d9ebcb3dafbce3ebe4e9ed6a9b4495fe9ed28730 |
| Inputs, images, exact identities, arithmetic | `.tmp/ld-s10y-answer/author-c4-s5-s7/active-s6-s9/author-provenance.json` | 516ef5106ba4507549ae604c191d4c1c554f90cb5fb75134a883db096918698c |
| Separate s9 raw-derived answers | `.tmp/ld-s10y-answer/author-c4-s5-s7/s9/source-derived-answers.json` | 10e8925f3b34967e2d360b1b2fc088ff4423b7f954ac355ad81c3f7cd1417c2c |
| Original21 snapshot manifest | `.tmp/ld-s10y-answer/author-c4-s5-s7/initial-21-preserved/manifest.json` | a9b1111947b0db3d5329ad8ed981b782b713792ca8b1a9d00403e18c71d7f364 |

Detailed frozen draft handoff:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/author-c4-s5-s7/active-s6-s9/author-handoff-draft.json`.
This snapshot is frozen only as an initial author draft; final readiness is not claimed. Future modern-text/figure observations or answer amendments must be separate, not overwrite original derivations.

## Author Decisions

All answers are `source: derived`; no bookRaw is fabricated. Each task retains existing cap2 fields `exercise`, `prompt`, `grading`, `displayAnswer`, `parts`, `historical_entities`; the scratch cohort adds `lesson` for unique cross-lesson identity. Main's stable cap2 machinery owns eventual final prompt/figureEvidence binding.

s6 has 10 complete answers: five conceptual questions, three numeric tasks and two compound experimental assignments. The five conceptual questions and both experiments are whole-task `ungraded`, `parts=[]`; three solely numerical tasks are `auto`, with five numeric parts. s9's three definition/explanation/experimental answers are all `ungraded`, `parts=[]`. Active total: **3 auto, 10 ungraded, 5 numeric parts**. Initial21 remains **4 auto, 17 ungraded**, with s5 two and s7 nine now deferred/unbound.

| Active lesson / exercise | Derived result or complete scope | Grading |
| --- | --- | --- |
| s6 / 1–5 | Density/depth/g, proportionality conditions, local wall depth, formula/units; distinguish liquid self-weight from total pressure | ungraded |
| s6 / g2-1 | Water5880 Pa; kerosene4704 Pa; mercury79968 Pa, original order | auto, three parts |
| s6 / g2-2 | 1030×9.8×10900 =110024600 Pa, source constant-density model | auto |
| s6 / g2-3 | Load49 N, pressure9800 Pa, area0.005 m² =50 cm²; state board/bladder/head idealization | auto |
| s6 / g3-1 | Experiment recording plus all five subquestions: cause, initial direction, implication, curved trajectories and range dependence | ungraded |
| s6 / g3-2 | Apparatus roles, equal rise, pressure-transmission law, different immersed depths and full equilibrium explanation; no claim of actual completed experiment | ungraded |
| s9 / 1 | Earth's atmosphere is the surrounding air layer; no invented top-boundary height | ungraded |
| s9 / 2 | Gravity/air weight and compression; pressure acts in all directions, not only downward | ungraded |
| s9 / 3 | Both original experiments140/141, each with setup, expected observation and low-pressure/external-air explanation | ungraded |

Original liquid-density table actually opened:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/tbl-p0071-01.png`.
Its kg/m³ rows visibly give pure water1000, kerosene800, mercury13600, seawater1030. Source caption `p0071#1`, crop `p0071#2`. No contemporary substituted density or g=10. Existing Python Decimal independently calculated the displayed numeric results; this is author arithmetic, not runtime judge/gate testing.

Model limits retained: fig113 light-bottom release is qualitative, not arbitrary-weight exact equal-level threshold; fig116 jet range also depends on drop to receiving level and does not universally favor the lowest hole; fig115 uses the written1m/5kg idealization rather than scan measurements. S7 original derivations preserve fig118 numbering (2 narrow-neck, 3 upward-widening), different from119, and the 2m²/5m barrel result98000N as scalar added load, not vector resultant. Those answers are deferred, not bound to failed figures.

Historical declarations in the initial21 are only item-local retained Pascal terms that occur in the corresponding prompt and displayed answer (s7/5,6,g2-2). For s6/g3-2 the source-grounded law name answers “which law”; its prompt does not name the person, so no false matching biography declaration is made. SI units receive no generic cultural waiver or biography additions.

## Read Boundary And Actual Usage

Read current answer skill cap2, gate2 and stable schema/validator field mechanism, not any old answer output. Fully read authorized complete modern s5 metadata candidate, s6 original frozen templates, s7 frozen templates and all original written prompts/raw lesson context. For s9 read only approved raw lesson/exercises and actual originals140/141, pending full modern text freeze.

All original PNG110–122 and140/141 were separately opened with `functions.view_image`: **15 source figures plus one liquid-density table**. Source observations and measured input hashes are recorded in provenance and source-figure notes. No in-progress modern figure or final modern spec was opened for this answer task.

No main answer-source report, independent answer review, old answer/key, choice, solver, interaction or history read. No browser, formal prepare/bind/finalize, tests, DB/pub/app/schema/dependency/Git/tool writes or figure changes. Separate model/image/service calls0; no new environment. Shell reads/`rg`/`shasum`, manual `apply_patch` author files, one existing-Python `stage-active-drafts.py` call for own-snapshot staging/input identity/Decimal arithmetic only. No official gate claim, model-token meter available, self-approval or promotion.

## Pending Handoff

**Waiting for main's exact frozen s9 full modern text paths and ready final modern figures/specs114–117 and promoted140/141.** Author must actually inspect those final assets/specs and compare the full final prompt/context before the final answer freeze. Do not read under-construction bytes or use this source-only draft as final figureEvidence.

After that, a separate amendment/final handoff can retain the original21 and this initial13 snapshot. Main performs independent comparison and the authorized stable official prepare/bind/finalize. None ran here. No in-flight task-owned session; stop pending exact readiness.
