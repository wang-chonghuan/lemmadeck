# CHOICE Review: phy6-c5-s8 / b51

**PASS.** Sole first independent reviewer; 9 source exercises, 4 questions, all 17 options checked. Nine source solutions were frozen before draft view disclosure; complete pure-view truth, misconception and fidelity judgments were frozen before reading full author fields. Author source_solution, task, unit_reason, conditions, concept_blocks, limitations, figure_observations, exact sets, all rationales and all coverage entries were then compared. No essential defect or authoring repair.

Canonical snapshots, confirmed by the reviewed validator:
- Seed: `8fca4fd05009cf1c1b0b18afeb094250185a7ae29baa3eb7d9a1a8b242cbcebb`
- Draft: `4f8c8c55b211823f8d9dbfd78a3401a9dbbce621b98b01c148275398951f500f`

## Every Option

| Question | Option | Truth | Independent check / misconception |
| --- | --- | --- | --- |
| lever-golden-judgments | A | correct | Equal opposing moments; longer arm requires smaller force. |
| lever-golden-judgments | B | incorrect | l1=2l2 gives F1=F2/2, not 2F2; force ratio was not inverted. |
| lever-golden-judgments | C | correct | Common rotation and common vertical-force projection give s1/s2=F2/F1. |
| lever-golden-judgments | D | incorrect | Reducing both force and travel by n gives only 1/n^2 of required work. |
| lever-golden-judgments | E | correct | (F/n)*(ns)=Fs for the same ideal task. |
| pulley-complete-record | A | correct | 3 m; 160*14=2240 J; 160*10=1600 J. |
| pulley-complete-record | B | incorrect | s=h incorrectly yields 1.5 m, 1120 J, 800 J. |
| pulley-complete-record | C | incorrect | s=h/2 incorrectly yields 0.75 m, 560 J, 400 J. |
| pulley-complete-record | D | incorrect | 3 m is right; using load 320 N with rope travel doubles both works. |
| pulley-reverse-operation | A | correct | Reverse routing gives axle travel H/2 and effort 2G. |
| pulley-reverse-operation | B | incorrect | Applies normal G/2 effort after reversal; input work would be GH/4. |
| pulley-reverse-operation | C | incorrect | Normal roles still require 2H and G/2, not reverse-mode numbers. |
| pulley-reverse-operation | D | incorrect | Moving-pulley geometry is not 1:1; correct GH product alone is insufficient. |
| hydraulic-complete-proof | A | correct | Equal pressure and equal volume give reciprocal ratios, then equal work. |
| hydraulic-complete-proof | B | incorrect | False F1*S1=F2*S2 inverts force ratio and yields work ratio >1. |
| hydraulic-complete-proof | C | incorrect | False direct travel/area ratio yields work ratio <1. |
| hydraulic-complete-proof | D | incorrect | Unequal areas forbid equal force and travel; two false steps accidentally give 1. |

Native true sets: lever `{A,C,E}`; the three single questions each `{A}`. All agree with the disclosed author fields. For reversed operation the pulley must have downward rope legs at the driven axle; fig-196 is explicitly the initial normal arrangement, not the modified drawing.

Coverage: `1/2/3/5` form the lever/golden-law unit; `4/g2-1/g2-2` form the complete pulley record; `g2-3` the reversed plan; `q1` the pressure-volume proof. No fixed question quota. The complete table, plan and proof are genuine mathematical units. Recognition/elimination loses independent explanation, numerical production, construction/operation and proof generation; the author records these losses. No essential task is silently removed, no equivalent options or package answer leakage found.

Images: **4 opens, 0 reopens/crops, one batch, context 4/24; parent text only**. Current actual SVGs 195/196/181/100 were independently converted at native sizes 640x400 / 640x1000 / 640x480 / 640x560, then fully opened. SVG/PNG bindings and full-edge observations are retained. Official figure_checks contains exactly the 3 question-used figures; selected concept fig-195 is additionally documented in the source freeze and native manifest. No new figures or SOURCE/TEXT/FIG promotion gate was replayed.

## Official Validation

Executed once, with the completed review, using the existing shared Python environment and `-B`; no standalone structural rerun:

```sh
/Users/yong/.codex/worktrees/00b1/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c5-s8/seed-b51.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c5-s8/draft-b51.json --review .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c5-s8/review-b51.json
```

Exit **0**; exact output: `mechanical checks passed; declared semantic review: pass (not automatically proved)`.

[Official review](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c5-s8/review-b51.json) | [Small manifest](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choice-review-c5-s8-b51/manifest.json) | [Source freeze](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choice-review-c5-s8-b51/source-solutions-frozen.md) | [Pure-view freeze](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/choice-review-c5-s8-b51/pure-view-frozen.md)

Seed/draft and shared changes preserved. No final keys, other choice sets, interactions, prior outputs or author source-solution/report files consulted; no DB, publish, retain, Git, application, dependency or service changes.
