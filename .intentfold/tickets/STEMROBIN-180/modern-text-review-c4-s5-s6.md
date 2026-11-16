# Independent Modern Text Review: C4-S5/S6

Date: 2026-11-15. Ticket: STEMROBIN-180. Reviewer: independent agent, not text author Bacon.

## Verdict And First Rejection

| Lesson | Full Text Verdict | Smallest Affected Unit |
| --- | --- | --- |
| phy6-c4-s5 | REVISE | `lesson.template.json.prose[1].historical_entities` |
| phy6-c4-s6 | PASS, text only | None; source-model limits below remain explicit |

First substantive rejection `S5-HISTORY-1` is retained in this report. There was no author text repair/failure recorded in the supplied handoff. This report does not approve modern figures, an entire finalized lesson, answers, classroom safety, or publication.

`S5-HISTORY-1`: s5 `prose[1]`, bound to `p0128#3` and `p0128#6`, retains two occurrences of “帕斯卡定律”, but its `historical_entities` is `[]`. This is the retained instructional scientific identity naming the pressure-transmission law, not a fictional Russian name to replace. The current modern profile rule and lesson skill cap4 require retained instructional historical identities to have an item-local `term` and source-bound `reason`. The text-only mechanical report does not check semantic completeness of those declarations. Minimum repair is one declaration for the retained Pascal term in this block, with its reason tied to these raw references; do not replace the law, add biography, alter formulas, or modify prose/anchors/figures/exercises. One declaration covers the retained term; separate declarations for its two occurrences are not required.

This finding does not require declarations for s6's ordinary SI unit names “帕斯卡/千帕斯卡”: those are units, not an instructional attribution to a historical person. s5's physics content, task fidelity and anchors otherwise pass the comparison below. No second substantive review or author repair was performed by this reviewer.

## Scope And Read Boundary

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

Raw root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p`.

Candidate root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s5-s6/adapt/6p/modern-us-neutral/lessons`.

Complete raw `lesson.json`, `lesson.md`, and `exercises.json` for both lessons were read before judging the complete candidate `lesson.template.json`, `exercises.template.json`, and `figures.template.json`. Batch author report/handoff, per-lesson handoffs and their text-only mechanical evidence were read. All eight complete original PNGs 110–117 were personally opened at their native full extent; these were source/context observations, not a repeated source-page approval or a modern-figure gate.

No main answer-source, solver report, answer key, answer-author file, choice, old interaction, or independent-review history was read. No browser, window, app, network, DB, Git, dependency installation, render, assembly, finalize, or promotion was used. Only this review report was written; the author templates, durable raw, tools and evidence were not edited.

The source approvals are reused. No original page/corpus review was repeated. Current candidate source snapshots equal the full current raw objects in memory; their stored raw hashes also match the measured raw bytes. All raw identity fields, prose source references, exercise `pages`, `number`, `source_number`, `group`, `group_id`, `figure_refs`, figure objects and ownership survive.

## Complete Block Comparison

Indices below are zero-based candidate/raw prose indices, not final published paragraph numbers. Every block was compared, including figure and caption blocks.

### S5: 20 Blocks, 12 Paragraph Blocks, 2 Tasks

| Block | Raw References | Independent Comparison |
| --- | --- | --- |
| 0 | p0128#2 | Liquid weight is the investigation's premise; no claim of uniform pressure at all depths added. |
| 1 | p0128#3, p0128#6 | All levels `aa/bb/cc/dd`, layer numbers `1/2`, downward depth increase, transmission and bottom/wall/immersed-object conclusion retained; exact bold conclusion retained. Content PASS; historical declaration REVISE as above. |
| 2 | p0128#4 | fig-110 identity and position retained. |
| 3 | p0128#5 | Complete caption 图110 retained. |
| 4 | p0128#7 | Bottom opening, thin rubber membrane, water and outward bulge retained; panel а becomes Latin a. |
| 5 | p0128#8 | Taller water column/more bulge emphasis, subsequent static equilibrium, gravity and membrane elasticity all retained. |
| 6 | p0129#1 | fig-111 identity and position retained. |
| 7 | p0129#2 | Complete caption 图111 retained. |
| 8 | p0129#3 | Same-water immersion, gradual flattening, upward/downward pressures and equal internal/external levels retained; panel б becomes b. |
| 9 | p0129#4 | Side-opening membrane experiment retained; panel а becomes a, not an upward-only experiment. |
| 10 | p0129#5 | fig-112 identity and position retained. |
| 11 | p0129#6 | Complete caption 图112 retained. |
| 12 | p0129#7 | Equal water levels and equal side pressures retained; 象图 becomes 像图, б becomes b. |
| 13 | p0129#8, p0130#1 | Removable-bottom vessel, immersed cylinder, upward support, gradual pouring and release retained in full; panels a/b correctly mapped. Source idealization is limited below. |
| 14 | p0130#2 | fig-113 identity and position retained. |
| 15 | p0130#3 | Complete caption 图113 retained. |
| 16 | p0130#4 | Opposite liquid-column pressures and the bottom's own gravity retained; no new assertion of a weightless bottom. |
| 17 | p0130#5 | Both sides' water can be replaced by the same other liquid; no claim that unlike liquids equalize at equal heights added. |
| 18 | p0130#6 | Complete bold result: same-depth isotropy and increase with depth. Newline inside the bold span preserves the emphasis content. |
| 19 | p0130#7 | Gas weight, small ordinary gas density and “许多情况下” qualification retained; it does not say total gas pressure is negligible. |

### S6: 19 Blocks, 17 Paragraph Blocks, 10 Tasks

| Block | Raw References | Independent Comparison |
| --- | --- | --- |
| 0 | p0131#5 | Complete bold objective: calculating bottom and wall pressure; specific example precedes derivation. |
| 1 | p0131#6 | Rectangular tank, fig114, bottom area 16 m², depth 5 m and requested pressure retained. |
| 2 | p0131#7 | fig-114 identity and position retained. |
| 3 | p0131#8 | Complete caption 图114 retained. |
| 4 | p0131#9 | Force equals this rectangular vertical water column's weight; context is not generalized to arbitrarily shaped vessels. |
| 5 | p0131#10, p0132#1 | Complete volume → density/mass → weight → bottom-force chain, 80 m³, 1000 kg/m³, 80000 kg, g=9.8 N/kg, ≈800000 N and both emphases retained. |
| 6 | p0132#2, p0132#3 | Division by 16 m², 50000 N/m² = 50000 Pa = 50 kPa retained as downstream use of the rounded preceding weight. |
| 7 | p0132#4 | Transition from specific data to general derivation retained. |
| 8 | p0132#5 | Complete definitions of h, ρ and S retained. |
| 9 | p0132#6 | V=Sh retained. |
| 10 | p0132#7 | m=ρV and m=ρSh retained. |
| 11 | p0132#8 | P=gm and P=gρSh retained; uppercase P is force/weight, not pressure p. |
| 12 | p0132#9, p0132#10 | Complete division p=P/S and p=gρSh/S retained. Terminal punctuation now a stop instead of a dangling comma; formula bytes unchanged. |
| 13 | p0132#11 | Original separate “即 p=gρh” block retained; no cancellation/formula omitted. |
| 14 | p0132#12 | Complete bold proportionality to density and height retained. |
| 15 | p0132#13 | Wall/internal/upward pressure extension and same-depth isotropy retained; no direction-dependent pressure added. |
| 16 | p0133#1, p0133#2, p0133#3 | Entire emphasized SI-unit convention, kg/m³, m, g=9.8 N/kg and N/m² or Pa retained. |
| 17 | p0133#4 | Full worked-example prompt: oil depth 10 m, density 800 kg/m³, requested tank-bottom pressure. |
| 18 | p0133#5 | Entire source worked example retained, including two four-row inner arrays, outer vertical divider, short left hline, unknown p, substitution, ≈80000 Pa = 80 kPa. This is source prose, not an accessed answer key. |

No block, footnote, named source reference, condition, emphasis or caption in these two approved raw lesson objects was silently dropped. These raw lesson objects contain no separate footnote block. Remaining textual edits are sentence punctuation outside mathematics, layout, Latin panel labels, 像图 and 制作; decimal points and all numerical data remain original. `numeric_changes` and source `errata` remain empty.

## Complete Exercise Comparison

All 12 tasks were compared independently for purpose, clauses and source/figure identity. A compound task remains a compound task; questions within it were not counted as newly authored exercises.

| Lesson / Identity | Raw References | Independent Comparison |
| --- | --- | --- |
| s5 g1 / 1 | p0131#2 | Complete experimental explanation of both different-depth pressure and same-depth directional equality. Neither part lost or turned into name recognition. |
| s5 g1 / 2 | p0131#3 | “很多情况下” and bold **重量** retained. Question concerns the weight contribution, not all gas pressure. |
| s6 g1 / 1 | p0133#7 | Which quantities determine bottom pressure retained; not bottom force. |
| s6 g1 / 2 | p0133#8 | Dependence on column height retained. |
| s6 g1 / 3 | p0133#9 | Dependence on liquid density retained. |
| s6 g1 / 4 | p0133#10 | Quantities needed for wall pressure retained; depth at the relevant wall point is not replaced by wall area. |
| s6 g1 / 5 | p0133#11 | Formula for both bottom and wall pressure retained. |
| s6 练习23 / g2-1 | p0133#13 | All three media, water/kerosene/mercury, and 0.6 m depth retained. Still depends on source density reference data, not invented local densities. |
| s6 练习23 / g2-2 | p0133#14 | 10900 m, sea basin context, qualifier “之一” and supplied seawater density 1030 kg/m³ retained. No named current record/location or unverified modern dataset substituted. |
| s6 练习23 / g2-3 | p0133#15, p0134#1 | Football bladder, vertical water tube, water filling, small board, 5 kg mass, 1 m water column and contact-area question all retained; fig115 remains attached. |
| s6 作业 / g3-1 | p0134#7 | All apparatus/action clauses retained: tall container, three side holes at different heights on one straight line, plugs, fill, open and observe fig116. All five questions remain: why outflow; near-wall direction; implication; curved shape; different ranges. No blanket “lowest always farthest” answer added. |
| s6 作业 / g3-2 | p0134#8, p0134#11, p0135#1 | Half-full sealed bottle, four tubes, three immersed ends, two bent tubes, fourth air-side end/bulb, hand or weight compression, equal rises, making/using apparatus, optional mouth inflation, explanation, law identification, different end depths and repeated observation/explanation all retained. fig117 panels mapped to a/b. |

Exercise identities remain s5 `g1:1/2`; s6 `g1:1..5`, `g2:g2-1..g2-3`, `g3:g3-1..g3-2`, with original displayed subnumbers, group headings and source references. No task was solved or converted to auto-grading in the candidate. Source practical production/observation remains required, not claimed completed by reading prose.

## Actual Original Figure Observations And Ownership

Each PNG below was opened once, completely. These observations bound text meaning only; no modern artwork/spec/render review was performed.

| Source PNG | Actual Observed Relationships | Text Ownership |
| --- | --- | --- |
| fig-110 | One vertical vessel; free surface aa; descending levels bb, cc, dd; layers 1 and 2 correctly between successive levels. | s5 prose |
| fig-111 | Two panels: bottom membrane bulges on standalone water tube; immersed tube has equal water levels, flat membrane, opposing vertical arrows. | s5 prose |
| fig-112 | Two panels: side membrane bulges; immersed tube and outer vessel at equal water levels with opposing horizontal arrows at membrane. | s5 prose |
| fig-113 | Two panels of removable-bottom cylinder, external water, retaining thread and pouring/release; source not a membrane apparatus. | s5 prose |
| fig-114 | Rectangular tank, vertical h mark, bottom edge marked 4米; text supplies area16 m² and depth5 m. Artwork does not independently measure those values or provide an unmarked second bottom dimension. | s6 prose only |
| fig-115 | Football bladder under a board and source 5 kg mass marking, water connection to a clamped vertical tube; no precision 1 m scale visible. | s6 g2-3 |
| fig-116 | Three side outlets at different heights, outgoing near-horizontal directions and curved streams, elevated container and receiving vessel; not a scale drawing of jet ranges. | s6 g3-1 |
| fig-117 | Two panels; bottle partly water/partly air, three liquid-side tubes with bent lower ends, separate air-side bulb tube; compression arrows and elevated liquid columns. | s6 g3-2 |

Candidate manifests retain s5 figures110–113 and s6 figures114–117. Prepared modern figure entries are draft placeholders, not approved assets. All future generated/deterministic outputs need their own independent figure gate; this text report must not be reused as visual approval. Panel Latinization in Chinese prose does not certify future image-label language.

## Actual Shared ProseFlow

On deep copies only, called existing `edition.normalize_lesson_layout`; then `edition.prose_flow_contract(normalized.prose, [])` to obtain the real outline, followed by the current authored anchors. Both calls use shared `prose_flow.mjs --stdin` / `htmlfrag.js`. No raw/template write or finalize was involved.

Both candidates were already normalized: changed block list `[]`. s5 actual final paragraph count16; s6 count20. Empty-anchor and anchored calls all returned no errors. Actual flow equals each bound author's `normalized-prose-flow.json`; each pair of author normalized-flow and CLI stdout files is byte-identical.

Indices below are zero-based actual paragraph indices. Each full before/after anchor appears exactly once in its own outline and refers to immediately adjacent paragraphs, including the required third sentence where present.

| Lesson | Before → After Index | Source Block Boundary | Actual Concept Boundary |
| --- | --- | --- | --- |
| s5 | 3 → 4 | prose[1] final paragraph → prose[4] | “这个结论可以用实验来验证。” → bottom-opening membrane experiment, ending “这表明底部受到了水的压力作用。” |
| s5 | 9 → 10 | prose[12] → prose[13] first paragraph | Equal lateral pressure → detachable-bottom setup; after anchor includes the third sentence about upward pressure holding the bottom. |
| s5 | 14 → 15 | prose[18] → prose[19] | Complete two-sentence bold liquid result → full three-sentence gas-weight explanation. |
| s6 | 7 → 8 | prose[6] → prose[7] | Rounded specific50 kPa computation → general symbolic derivation. |
| s6 | 16 → 17 | prose[15] → prose[16] | Same-depth wall/internal/upward extension → entire emphasized SI-unit convention. |
| s6 | 17 → 18 | prose[16] → prose[17] | Entire SI-unit convention → worked oil-example prompt. |

Resolved break arrays are s5 `[4,10,15]`, s6 `[8,17,18]`. No boundary relies on a manually counted prose block, crosses a nonadjacent paragraph, or truncates the normalizer's after paragraph. Full exact anchors are retained in the hash-bound candidate and flow evidence below.

## Source-Model And Adaptation Limits

1. s5 detachable-bottom prose[13]/[16] is retained as the source qualitative, light-bottom demonstration. With finite bottom weight, actual loss of support can occur before exactly equal water levels: the pressure-difference force need only cease balancing that weight. This text-fidelity verdict does not certify an exact release threshold or precision measurement from fig113. No new erratum was registered or source formula changed.
2. Same-liquid equal-level membrane results assume static liquid and a suitably thin, freely responding membrane. Replacing both liquids by another same liquid preserves the qualitative result; different inside/outside densities do not necessarily balance at equal heights.
3. The gas-density ratio is a source ordinary-condition simplification, not a universal ratio for all gases, temperatures or pressures. “许多情况下” and the weight-contribution restriction survive. It must not be read as negligible pressure of compressed gas or as permission to ignore gas-weight variation over arbitrary height.
4. s6 `p=ρgh` denotes the static liquid-column contribution measured from the free surface, for the source constant-density model; it is not a claim that total absolute pressure lacks an applied/surface pressure. The source rectangular-column derivation and same-depth extension remain contextually intact.
5. Source g=9.8 N/kg and rounding are retained, not silently replaced by g=10. Exact arithmetic for the source tank gives784000 N and49000 Pa; source first rounds force to≈800000 N, then obtains50000 Pa=50 kPa from that rounded input. Oil gives78400 Pa, rounded in source to≈80000 Pa=80 kPa. Subsequent equalities use the rounded values; this is not an exact9.8→10 identity or a reason to rewrite frozen formulas.
6. s6 g2-1 requires density-reference information beyond this lesson's locally stated water/oil examples. This review did not consult answers or invent a density table. The deep-sea exercise preserves a supplied constant density and source hypothetical calculation, not contemporary precision oceanography or a newly asserted deepest-place record.
7. fig115/g2-3 uses the source idealization of the load/board/bladder and stated water-column height; actual board weight, bladder elasticity and height-reference corrections can matter. The preserved text does not newly quantify these effects or turn the unscaled picture into measured data.
8. fig116/g3-1 asks actual observation plus explanation. Jet range depends on depth, outlet elevation above the receiving level and flight time; the three illustrated trajectories do not justify a universal lowest-hole maximum-range rule.
9. fig117/g3-2 keeps real construction, compression and varied-depth repetition. Equal rises concern static connected same-liquid columns under common air overpressure; path shape/end depth does not alone determine final surface height. Actual sealing, capillarity and settling can affect observations.
10. Optional rubber-tube mouth inflation is preserved as the original historical experiment method, not silently deleted or replaced. This text/source comparison is not modern classroom-safety clearance for mouth contact, sealed-glass pressure, weights or fabricated glass apparatus. Future implementation needs appropriate apparatus/supervision safeguards; no hazardous-pressure magnitude or safe construction certification is inferred here.

Ordinary culture-neutral material remains unchanged. The source sea-basin phrase remains unnamed and qualified, not a new modern real-world claim. No fictional Soviet identity, currency conversion, numerical cultural substitution, or political symbol was introduced. s5's missing local Pascal declaration is the concrete history/adaptation contract defect and remains a rejection, despite otherwise faithful content.

## Frozen Inputs And Evidence

All values below are measured SHA-256 of current file bytes, not reconstructed/canonical JSON hashes. Source paths in these tables are relative to the full roots stated above.

### Raw Lesson Files

| Lesson / File Under Raw `lessons/` | SHA-256 |
| --- | --- |
| phy6-c4-s5/lesson.json | a58723ce6993efd6ea5968d54942c22bc30176805affc0191885ffd09ff93143 |
| phy6-c4-s5/lesson.md | 4e1ef4a9cb43a561a7c7704da39cc57b022a9ff21c89e80464462c9fddb96a3b |
| phy6-c4-s5/exercises.json | fd18d7541b82a088de898c1c56d104a4f8bbd0aa4d0498d3e56f04b7d75a8108 |
| phy6-c4-s6/lesson.json | 19812124440615460ad49857bbcce8b67e145aa262bd683b3ee29667c7dab65c |
| phy6-c4-s6/lesson.md | 0a4d552ba78056c62608327bcd4fbda6aa9dcd2aec624c146f5f755a87e9bf9f |
| phy6-c4-s6/exercises.json | 68904ad65c3794686588c05899147bc6b1c6a5b0eeef234702d070ffaf6d2bc9 |

### Frozen Candidate And Author Evidence

| File Under Candidate Lesson | s5 SHA-256 | s6 SHA-256 |
| --- | --- | --- |
| lesson.template.json | ba206492c4457bda2ec9add399b4c950b2238f8b57178c18154694811afeb6f9 | d9a2adae43c22454c8f5a6f682260fd88ec410bfe38af4ed9cade6708ba8918c |
| exercises.template.json | 9952920ce2eada39e878670dba64c61deba0257ec5b43dd68e182f062a74dfb9 | 8d101fa8c090d6148adcbb2cc154a1e71da164fd21702c6fde4e7f96830f3870 |
| figures.template.json | be66c2ce8f5b3d18a873e772626625d60f20c2072493095c015e537fa57c85a0 | 68841e46dd319e24cd447e8f0ed93d19e3e152780807a478e9ca6dbde999a23e |
| author-handoff.json | 16ea0baa9f2996f0db4bc1f9e6063414d8b142264469026a615d83f13c1c830e | c6f34d593f8a7def3af329a4f2bf8c9927b803165152205fd8943a6bfd8fc540 |
| author-checks.json | 0325d233f0e25719fb301c1c16bd744411295871bbf5b89005514c5be4aeeec7 | 48f18cafff8cde6342f697ffefa7b8b81bb2762c27284232931151daa06ddb6c |
| author-katex.json | ea814cac315d976e442a261a5c25de3cb076631e3ee134520e77bc78e4d40408 | da449d6a6b537d18e361fb4fce8e686812d1aa9da6a37943c2af323ab09ce4fe |
| normalized-prose-flow.json | 6bc0dcba26974a6150dbe981a3a0645c51810de9d1fa8ca7824c599171e2be03 | 6b976319a9fc89523fa1c08375efd9ffd5e26a804467ec2a4932280c81773b7d |
| prose-flow-cli.stdout.json | 6bc0dcba26974a6150dbe981a3a0645c51810de9d1fa8ca7824c599171e2be03 | 6b976319a9fc89523fa1c08375efd9ffd5e26a804467ec2a4932280c81773b7d |

Batch author-handoff path: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s5-s6/author-handoff.json`.
SHA-256: `26e83465fc5c9713fc04bbdb3c582e9cb2acffbcac8c5741b4838cdfb75836db`.

Author's bound49-formula record was reused: s5 eight, s6 forty-one; parse PASS, warnings0, exact source formula bytes and outside-math numbers recorded preserved. No KaTeX/math validator or complete author check was rerun. This evidence establishes mechanical preservation/parseability, not independent mathematical/historical approval.

### Personally Viewed Original PNGs

| File Under Raw `figures/` | SHA-256 |
| --- | --- |
| fig-110.png | 548846db3beb89c382fb1dfa0c3e04b65c6f5e4f22704c873e19c708833a9768 |
| fig-111.png | dcaad029275b118366eecb41b16217e97a862daf24a58c4b016782a3a2d22edc |
| fig-112.png | 43250c2de718983c669a1bd03a56e70c757b82cbc19d83321a99e7bac306b184 |
| fig-113.png | c679b8b8ff5a583f18517340920eeed51a2ba006d2880ea4b6e9879800b8ce58 |
| fig-114.png | 10405c879c73804cc0a5bff9f7d7bb6090ee05085414fea86071fb7a8dbbffb6 |
| fig-115.png | 359dde9dac76ba26875c7073e7f93e5256954c227239157de58e9a4f48b3f912 |
| fig-116.png | 9841fdbb95c89262bc5d52d85241e0bd44eb5aad7a610cd7634aaf717e0332f4 |
| fig-117.png | 4a505fab84fff7c89224cd2f8fa062b4acb3245db2435d5090a9bdd21aeb517f |

### Contract And Shared Boundary Implementation

| Workspace Relative File | SHA-256 |
| --- | --- |
| .claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json | f03840602a5de0c22b7eea096fe24db758c6d66b6532c75cda26c6766a1573f1 |
| .claude/skills/ld-s10y-lesson/tools/edition.py | b48f7beedb54635876f426526d8541925c956c0f84e298f77c3fe34c229f4b2c |
| .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs | f2a16357e2a0d5f8541b0cb401c5193c9cb10f6333dc16f92d5c7a18a5bee309 |
| .claude/skills/ld-s10y-lesson/tools/htmlfrag.js | c2f0301c5ba7811336a5268a404f795ace7873b75eb93c42c10186f3d9c3f9f6 |

An initial reviewer in-memory command had a Python syntax typo and exited before reading/normalizing any content; the corrected command completed. This was not an author content failure, formula rerun, changed snapshot or adapt-finalize attempt.

Stop state: full substantive text comparison completed once; s5 first rejection preserved, s6 text PASS bound to the above snapshot. Await main/author handling of the smallest rejected declaration unit. No self-repair or whole-lesson approval.
