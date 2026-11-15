# S9 Independent Modern Text Review

## Findings And Verdict

**PASS - TEXT ONLY.** No required revisions found in the frozen candidate.

Independent full reading covered all 11 source/modern blocks, all 3 original
tasks, the complete embedded raw snapshots, the historical declaration and all
3 section anchors. Original PNGs 140 and 141 were opened separately for semantic
context. The verdict is bound to the file hashes below, not to future edits.

Informational, not a revision request: `帕斯卡` occurs in neither
`forbidden_terms` nor `forbidden_person_names`. Naming Pascal's law here is not
a scientific-history exercise and needs no cultural exemption. The existing
single declaration at `p0147#3` is nevertheless narrowly source-bound: the term
appears in both raw and modern text, and its reason preserves the real law name
without adding biography. It neither exempts other content nor changes a prompt.

Date: 2026-11-15. Ticket: STEMROBIN-180. Reviewer: this independently assigned
reviewing agent; not the main author of this s9 candidate.

## Scope And Inputs

Workspace root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck`

Candidate directory, relative to that root:
`.tmp/ld-s10y-lesson/text-author-main-c4-s9/adapt/6p/modern-us-neutral/lessons/phy6-c4-s9/`

Approved raw directory:
`ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s9/`

Read in full: raw `lesson.json`, `lesson.md`, `exercises.json`; candidate
`lesson.template.json`, `exercises.template.json`, `figures.template.json`;
author report and handoff; both retained failed lesson snapshots. Read the
lesson skill, modern profile and edition text contract. The figure template was
read only for identities/source bindings, not as evidence of modern figure
completion.

Preserved identities: `phy6-c4-s9`, section 56, 大气压强, physical pages 147-148,
printed pages 136-137, source figure identities `fig-140` and `fig-141`.

| Coverage | Exact Count |
| --- | --- |
| Raw and candidate prose blocks | 11 each |
| Paragraph / figure / caption blocks | 7 / 2 / 2 each |
| Canonical display paragraphs recorded in the frozen handoff | 10 |
| Original tasks independently read | 3 of 3 |
| Original PNGs actually opened | 2 of 2 |
| Section-boundary anchor pairs read | 3 of 3 |
| Historical declarations | 1, at `p0147#3` |
| Mathematical expressions / numeric-change records / errata | 0 / 0 / 0 |
| Required revisions found | 0 |
| Existing failed snapshots retained | 2 |
| Gates rerun / candidate edits | 0 / 0 |

## Complete Block Review

Block numbers below are one-based positions in the frozen `prose` array.

| Block / Source Binding | Independent Text Judgment |
| --- | --- |
| 1, `p0147#2` | Atmosphere definition, bold 大气, satellite observation, “约有几千千米” and the air-ocean/seabed analogy are all retained. “本教材记述” explicitly attributes the source's height statement; it does not invent a modern measured boundary, precision, mission or date. The source quantity and unit remain unchanged. |
| 2, `p0147#3` | The complete bold gravity/compression sentence is preserved. The lower-layer compression and all-direction pressure explanation remain source-faithful. In this static-fluid teaching context, directionality is not a claim that atmospheric pressure is equal at different altitudes. No gas incompressibility or new force/pressure formula is introduced. Pascal's real law name is retained, not replaced with a fictional person. |
| 3, `p0147#4` | Pressure acting on Earth's surface and objects, including bold 大气压强, is preserved. 象 becomes 像 without changing the physical claim. This is pressure, not a new assertion about an object's net vector force. |
| 4, `p0147#5` | The transition from atmospheric-pressure definition to explanatory examples is complete and unchanged in meaning. |
| 5, `p0147#6` | The glass tube, tightly contacting piston, submerged lower end, upward piston motion, upward water motion, exterior-air action and pump connection are all retained. “近似真空、压强较低的空间” qualifies the source's absolute vacuum rather than reversing the mechanism or asserting zero pressure. The explanation is qualitative and tied to the illustrated sealed/submerged arrangement; it does not promise unlimited pumping height or a calibrated water rise. |
| 6, `p0147#7` | `fig-140` identity, label and source binding remain unchanged. No new text or solution annotation is inserted into this placeholder. Modern artwork is outside this verdict. |
| 7, `p0147#8` | `fig-141` identity, label and source binding remain unchanged and distinct from 140. Modern artwork is outside this verdict. |
| 8, `p0147#9` | Caption 图 140 is retained without relabeling or extra instructional claims. |
| 9, `p0147#10` | Caption 图 141 is retained without relabeling or extra instructional claims. |
| 10, `p0147#11` + `p0148#1` | The entire cross-page experiment is present: cylindrical vessel, stopper, valved tube, extraction of air, immersion of the tube end, opening the valve, fountain-like entry and greater external than internal pressure. 稀薄的空气 is retained, so the explanation does not require perfect evacuation. The pressure difference has the correct direction. 象 becomes 像 only. No source condition, continuation or concluding causal sentence is lost. |
| 11, `p0148#2` | The complete forward transition to further atmospheric-pressure phenomena is retained; no next-lesson content or extra question is added. |

The source's three emphasis spans are preserved: 大气, the gravity/compression
sentence and 大气压强. Figures/captions remain in the same prose order. All
source references remain attached to their corresponding complete blocks,
including the two-reference cross-page block. No footnote occurs in this raw
lesson, so there is no omitted footnote.

## Questions And Conditions

| Task / Source Binding | Independent Prompt Judgment |
| --- | --- |
| `g1-1`, `p0148#4` | “（1）什么是地球的大气？” is unchanged. It remains a definition question, with no invented numerical atmospheric boundary or extra requirement. |
| `g1-2`, `p0148#5` | “（2）大气压强是由于什么而产生的？” is unchanged. It still asks for the physical cause, not merely a law name, a fixed measured pressure or a worked numerical result. |
| `g1-3`, `p0148#6` | “（3）叙述几个证明大气压强存在的实验。” retains the original open request for several experiments. Only the final period is modernized. It is not narrowed to one experiment, converted into a forced-choice task or expanded into compulsory home construction. |

All three retain `number = source_number = 1/2/3`, group 问题, `group_id = g1`,
their original `pages` bindings and one-line prompts. Each retains empty
`figure_refs` and `figures`; the body experiments remain available as lesson
context without inventing exercise-specific figure ownership. No extra task,
subpart, datum, unit conversion, condition or embedded answer is introduced.
There is no quantitative problem whose omitted condition would make a requested
numeric answer indeterminate. No answer key or solution was consulted or written.

## Original Pixel Context

Both original PNGs were opened with the local image viewer, not inferred from
SVG/spec metadata.

- `fig-140.png`, 203 x 328: an open water vessel surrounds the lower end of an
  upright tube; water is shown higher within the tube; a solid piston sits above
  that water, with a rod/handle and an upward arrow alongside it. These visible
  relationships support the candidate's piston-lifting description. The image
  has no calibrated length, pressure scale or numerical height to transfer.
- `fig-141.png`, 195 x 367: a closed upper vessel is supported over an open water
  vessel; a tube passes through its bottom closure into the lower water, with a
  valve on the tube; the upper tube outlet and depicted upward spray lie inside
  the closed vessel. This is the valved, lower-pressure-vessel experiment, not a
  second piston apparatus. Evacuation and pressure values come from the prose,
  not from invented pixel measurements.

This checks apparatus/text correspondence only. No modern figure, FigureSpec,
theme sample, label-size, collision, rendering or visual-approval gate was
performed.

## Language, Declarations And Flow

Modern Chinese punctuation and complete-sentence line breaks preserve the source
meaning. The two declared clarification changes are limited to explicit
textbook attribution and the qualified vacuum description. Numeric changes and
errata remain empty; no formula was changed. No fictional cultural scenario,
unbound historical person, forbidden profile term or Cyrillic enumeration was
introduced.

The three anchor pairs correspond to real conceptual transitions:

1. “地球的表面就是这个海底。” to the bold gravity/compression paragraph:
   definition and air-ocean setting become the origin/transmission explanation.
2. The general phenomena transition to the opening of 图140:
   theory becomes the piston experiment.
3. The completed low-pressure/pump explanation to the opening of 图141:
   the first apparatus gives way to the distinct valved-vessel experiment.

Both sides of each pair are present verbatim in the frozen final paragraph text.
The recorded resolver positions `[2,5,7]` and count 10 are reused from the
existing handoff; no flow command or position-counting gate was rerun. The
anchors' conceptual appropriateness was judged independently from their text.

## Reused Mechanical Evidence And Limits

`author-handoff.json` records final text-only check exit 0 and reports source
snapshot equality, identity/source bindings, errata/text/numbered-task checks,
normalizer idempotence, figure references and the flow positions. The author
report describes the same outcome. These are existing author-side mechanical
records, not a new independent execution or standalone captured stdout log.
This review independently read the full raw/candidate content and measured file
hashes, but intentionally did not rerun source, flow, full adaptation or rendering
gates. Zero mathematical expressions means no KaTeX coverage is being claimed.

The two failed snapshots were read and their hashes match the frozen handoff:
the first retains the noncanonical first-paragraph split; the second retains
spaces in the prose 图 140 / 图 141 references. The final candidate contains the
reported canonical split and original compact references. Both first-failure
files remain untouched; this review does not erase or relabel those author
attempts.

The idealized demonstrations are accepted as source-faithful qualitative
teaching, not as validated procedures for arbitrary pressures, heights or
equipment. No apparatus safety certification or experiment performance claim is
made. The satellite/height narrative was not externally verified and is accepted
only with the candidate's explicit textbook attribution.

## Frozen SHA-256 Bindings

All paths below are relative to the workspace root stated above. Hashes were
measured read-only during this review; candidate lesson/exercise hashes match
the user's assigned freeze exactly.

| Candidate Directory File | SHA-256 |
| --- | --- |
| `lesson.template.json` | `c02a2b41944b573952d75824820ad3a6e7a3cee7ac7506b77156ae24622ffcf4` |
| `exercises.template.json` | `3741f9187fdfcf64703c8c8758eb538f67be9e686d61bfb7961766c06f5870b1` |
| `figures.template.json` (identity-only) | `260e5b4d99b4c93c5dfa2fcb53facd48a7f24822a564a794af3dc317d82e029a` |

| Approved Raw Directory File | SHA-256 |
| --- | --- |
| `lesson.json` | `b7c35468f2b2d80954ee5fdce822fa3691e768a1661b098e2a89ac708c614ecb` |
| `lesson.md` | `601042ffe0293e9c65147d40243bbaec0a78f0f7f472b2a2dff255a28f6e374c` |
| `exercises.json` | `601a7a4f980206b54707d22de27030b748dde3ea2ea7231de0098874efb45b8b` |

| Other Read Input | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-140.png` | `1607d873e47e08f16f4eb4c777cae59ec7187d94476b0b223fd8d3d4f1fdd1b9` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-141.png` | `08ee2794b8dd4008a74f78eb3b72794fd3606cc1cacb0a232a658748a4ce4825` |
| `.tmp/ld-s10y-lesson/text-author-main-c4-s9/author-handoff.json` | `7adf912d7e879a3fd2a2f565f4437d01a623f8a11a5e106101fd81efb8bc7e36` |
| `.tmp/ld-s10y-lesson/text-author-main-c4-s9/lesson.first-layout-check-failed.json` | `907d105ba443b1c823a8778a3d1b3daa2c61bfbd7ff589ade6c89012fdcc3c77` |
| `.tmp/ld-s10y-lesson/text-author-main-c4-s9/lesson.second-number-check-failed.json` | `35b9e63d5083af2856265360dabff7a1312b97c989ad6f9ecd0667214600af81` |
| `.intentfold/tickets/STEMROBIN-180/modern-text-author-c4-s9.md` | `d0b5f9818d6c8422fed28ba5cfd0a57744db4231271514f7fd897816a377b22f` |
| `.claude/skills/ld-s10y-lesson/SKILL.md` | `b3666f4ea4a094c269a2d628a455cbb00598e770d93903fd810597e6f8a9b405` |
| `.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json` | `f03840602a5de0c22b7eea096fe24db758c6d66b6532c75cda26c6766a1573f1` |
| `.claude/skills/ld-s10y-lesson/references/edition-text-contract.md` | `8deecbc68434e57b30ed8717dc22170a1988a0856af200a1875da58a3334bf90` |

## Independence And Stop

No answer-source, authored key, answer review, choice, main solution or unrelated
review was read. No candidate, raw source, image, earlier figure116/117 freeze,
stable skill/tool, app, schema, dependency or database was edited. No service,
browser session, Git operation, prepare/finalize or promotion was run.

The only authored output is this report. The text-only PASS is not whole-lesson
approval, publication authorization, modern-figure approval or safety
certification. Any later text change requires assessment against the affected
bindings; the present candidate remains unchanged for main's next stage.
