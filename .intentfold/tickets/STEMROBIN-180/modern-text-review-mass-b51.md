# Independent Mass TEXT Review

2026-11-17, STEMROBIN-180, 6p `phy6-c3-s9`. **BLOCK**. Sole independent TEXT judgment, written before source-only solving. No second repair is authorized: author manual repair 1/1 used, initial candidate-check failures 0.

## Substantive Defects

1. **D1: missing domain of the inverse mass/speed rule.** `lesson.template.json:27,73,90,124` (prose indices 0,3,4,6) does not establish both bodies initially at rest in the measuring inertial frame, negligible external horizontal impulse during interaction, and comparison of horizontal speed magnitudes in that same frame. Initial rest is explicit only in the numerical example and later summary; isolation and common frame are nowhere explicit. "In this experiment" does not supply those conditions. For arbitrary initial velocities the final-speed rule is false: equal masses can exchange velocities 3 and 1 m/s in a one-dimensional elastic collision and leave with unequal speeds. Generally compare velocity changes under equal/opposite internal impulses, not arbitrary final speeds.
2. **D2: the boat comparisons leave component/frame ambiguity.** `lesson.template.json:107` (index 5) compares the person's and boat's unqualified speeds without initial rest, isolation or horizontal components. Original fig-43 visibly includes an upward jump: vertical external forces prevent the horizontal mass relation from applying to total speeds. `exercises.template.json:178` (`g2-4`) gives initial boat rest and opposite directions but never says both numerical speeds are horizontal and relative to the same shore/inertial frame. A person-to-boat interpretation differs from a shore-relative interpretation. The current prose cannot resolve this for an independent learner.

These are physics/solvability defects, not layout defects. Candidate bytes remain untouched; no repair, replacement candidate or FIG judgment was made.

## Full Coverage

Read complete canonical `raw6p` lesson JSON, Markdown and exercises, and all three current candidate templates. `raw6p` here resolves to `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p`; no literal local directory named `raw6p` exists.

| Prose index / source binding | Independent observation |
|---|---|
| 0 / p0062#7,#10 | Cart apparatus and scope checked; D1. |
| 1 / p0062#8 | fig-44 identity preserved, original pixels viewed. |
| 2 / p0062#9 | fig-44 caption preserved. |
| 3 / p0063#1 | 20, 40 cm/s, factor 2 and reciprocal 1/2 unchanged and conditionally correct; D1. |
| 4 / p0063#2 | Earlier fig-41 reference retained, original viewed; D1. |
| 5 / p0063#3 | Earlier fig-43 reference retained, original viewed; D2. |
| 6 / p0063#4 | Mass concept and examples preserved, initially-static summary present; D1. |
| 7 / p0063#5 | Kilogram introduction correct. |
| 8 / p0063#6 | fig-45 identity preserved, original viewed. |
| 9 / p0063#7 | Prototype explicitly historical; alloy, location, copies retained; no new definition/date. |
| 10 / p0063#8 | fig-45 caption preserved. |
| 11 / p0064#1 | Larger/smaller unit introduction preserved. |
| 12 / p0064#2 | Metric tonne: 1 t = 1000 kg. |
| 13 / p0064#3 | Metric quintal: 1 = 100 kg. |
| 14 / p0064#4 | 1 g = 0.001 kg. |
| 15 / p0064#5 | 1 mg = 0.000001 kg. |

All 9 tasks reviewed in full: `g1` identities 1,2,3,4,5 bind p0064#7,#8,#9,#10,#11; `g2` identities g2-1,g2-2,g2-3,g2-4 retain printed numbers 1,2,3,4 and bind p0064#13,#14,#15,#16. Group names, lines/text consistency, counts, source snapshots, empty direct task figure refs/display lists, and numerical data are preserved. Questions 1-3 use the scoped interaction rule (D1); question 4's "first introduced" clarification preserves the kilogram target; question 5 remains open. Small-boat and recoil tasks retain their source explanations without added operational details; g2-1 needs comparable mass, not merely small dimensions; g2-4 has D2. No invented task or answer content appears.

Four historical declarations on index 9 retain source-present 国际千克原器, 法国, 巴黎, 塞佛尔城, each with a p0063#7 reason; other blocks/tasks have no historical entities requiring declarations. No numeric changes or errata were introduced. Only figs 44/45 belong to this candidate's manifest; 41/43 are preserved earlier-lesson prose references, not missing local figure blocks.

## Evidence And Boundary

Current three candidate hashes were computed once and match the named author evidence; the binding and independent four-image observations live in `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-review-mass-b51/manifest.json`. Reused the single mechanics PASS (`text-check.json`) and final flow PASS (`final-prose-flow.json`: 15 paragraphs, 14 math spans, boundaries 5/10); neither was rerun and neither proves semantic physics correctness.

Actual image use: **4/8 task, 4/24 context**, each original PNG once, no crops/reopens; parent receives text only, 0 image payloads. Offline review only. No answers, other solutions, choices, interactions or prior ticket outputs were read, except the explicitly named text-author report/evidence. No source/normalize/FIG gates, services, DB, publish, retain, finalize, Git, app or dependency operations. Existing budgets and others' files unchanged.
