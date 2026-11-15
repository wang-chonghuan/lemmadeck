# Independent Modern Text Review: c3-s15 through s18-t1

2026-11-15. Independent reviewer: Sagan; not the template author.

**Text conclusion: PASS for all four current template pairs.**
Reviewed all **55 upper-level prose blocks and 10 written prompts**, not a sample:
19/13/10/13 blocks and 4/4/2/0 prompts respectively.
No substantive adaptation, source-binding, numeric, formula, symbol, historical
identity, or written-task omission defect found. No revision required.

**This is not image approval or whole-lesson production approval.** The figures
are being authored separately. No image spec, artwork, render, answer key,
author answer solution, interaction, DB, publish, or Git operation was used.

## Scope and Authority

Repository: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Paths below are relative to this repository.

Modern input directory:
`.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/<id>/`.
Read `lesson.template.json` and `exercises.template.json` for each of:
`phy6-c3-s15`, `phy6-c3-s16`, `phy6-c3-s17`, `phy6-c3-s18-t1`.

Compared against each corresponding assembled source:
`ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/<id>/{lesson,exercises}.json`.
Read the edition text contract and the relevant local text-validation rules.

Modern text means the templates' **upper-level `prose[].text` and
`exercises[].text/lines`**, not `source.data`. Embedded snapshots were checked
only as source provenance and were never mistaken for modern text.
All eight snapshot data objects exactly match the actual assembled source JSON,
and all eight declared source SHA256 values match current source file bytes.

Previously completed source pixel approval is reused. No source page or source
image was reopened or reapproved. This review tests the adaptation against the
authorized assembled sources, not the correctness of every historical/source
scientific simplification against present-day knowledge.

## Complete Prose Comparison

Block numbers are one-based positions in the upper-level template prose array.
Every listed block has matching kind, id, label, printed_page and ordered
source_refs, with source_text equal to the actual corresponding source text.
Figure/caption entries are included for textual identity and coverage only.

### phy6-c3-s15: Force

19/19 blocks retained. Only block8 text changes; all other texts are identical.

| Block | Source refs | Independent finding |
| --- | --- | --- |
| 1 | p0075#13, p0076#1 | Prior sections20/22, inertia/interaction and speed-change statement retained; cross-page prose complete. |
| 2 | p0076#2, p0076#7 | Person pushing a cart, start of motion and causal agent retained. |
| 3 | p0076#3 | fig50 identity retained; no image approval. |
| 4 | p0076#4 | fig51 identity retained; no image approval. |
| 5 | p0076#5 | Caption50 retained. |
| 6 | p0076#6 | Caption51 retained. |
| 7 | p0076#8 | Iron on floating cork, attraction by magnet, and joint motion retained. |
| 8 | p0076#9 | Only Cyrillic а/б -> Latin a/b; hand/ball/spring compression and release stages and causal explanation unchanged. `changes=["symbol"]` is accurate. |
| 9 | p0076#10 | fig52 identity retained. |
| 10 | p0076#11 | Caption52 retained. |
| 11 | p0076#12 | Hand/racket stopping a moving ball or changing direction retained. |
| 12 | p0076#13, p0077#1 | Full summary across the page boundary retained. |
| 13 | p0077#2 | Force language and cause-of-velocity-change definition retained. |
| 14 | p0077#3 | Whole/individual-part motion, ball deformation, seated person, and board midpoint-versus-ends displacement explanation retained. |
| 15 | p0077#4 | fig53 identity retained. |
| 16 | p0077#5 | fig54 identity retained. |
| 17 | p0077#6 | Caption53 retained. |
| 18 | p0077#7 | Caption54 retained. |
| 19 | p0077#8 | Different required forces, car/motorcycle comparison, force magnitude and physical-quantity statement retained. |

The source's qualitative examples remain course examples. No new numeric force,
equal-time assumption, measurement, or answer annotation was inserted.

### phy6-c3-s16: Gravitation and Gravity

13/13 texts unchanged; source history declarations added on block12.

| Block | Source refs | Independent finding |
| --- | --- | --- |
| 1 | p0078#5, p0078#8 | Horizontal throw, curved trajectory, satellite motion and terrestrial falling/flowing examples retained with figure55/56 references. |
| 2 | p0078#6 | fig55 identity retained. |
| 3 | p0078#7 | Caption55 retained. |
| 4 | p0078#9 | fig56 identity retained. |
| 5 | p0078#10 | fig57 identity retained. |
| 6 | p0078#11 | Caption56 retained. |
| 7 | p0078#12 | Caption57 retained. |
| 8 | p0078#13, p0079#1 | Earth/body mutual attraction, tide example, Sun/planets and universal mutual-attraction definition retained across pages. |
| 9 | p0079#2 | Importance of Earth's attraction retained. |
| 10 | p0079#3 | Gravity defined as Earth's attractive force retained. |
| 11 | p0079#4 | Course proportionality of gravity to mass, multiplier comparison and equal-mass conclusion retained. |
| 12 | p0079#10, p0080#1 | Complete Newton biography, original1643-1727 dates, British identity, motion/gravitation/optics/mathematics contributions retained; no fictional relocation. |
| 13 | p0079#11 | Newton portrait entry `tbl-p0079-01` and label retained; does not certify a candidate portrait's appearance or historical fidelity. |

Block12 declarations are exactly `伊萨克·牛顿` and `英国`, with nonempty
source-specific reasons. Each term occurs in both the actual source text and
upper-level modern text. Dates and biography remain unchanged, so text changes
are correctly empty despite added declaration metadata.

The equal-mass/proportionality and tide statements are preserved course-level
source statements, not newly generalized physics claims or external verification.
No latitude/g condition, contemporary historical date correction, or new formula
was silently added.

### phy6-c3-s17: Elastic Force

10/10 blocks retained. Only symbol/layout differences in blocks3,4,7.

| Block | Source refs | Independent finding |
| --- | --- | --- |
| 1 | p0080#3 | Gravity and unsupported rain/snow/leaves examples retained. |
| 2 | p0080#4 | Supported snow at rest and the support/suspension question retained. |
| 3 | p0080#5 | Board horizontal on two supports, central mass, bending/stopping stages retained; only а/б -> a/b with symbol declaration. Original **一小段时间** remains unchanged, not corrected to distance. |
| 4 | p0080#6, p0080#9 | Added newline after the question only; downward gravity and an upward force explanation complete. Layout declaration accurate. |
| 5 | p0080#7 | fig58 identity retained. |
| 6 | p0080#8 | Caption58 retained. |
| 7 | p0080#10, p0081#1 | Question separations and б -> b only; deformation, upward elastic force, opposing directions, greater bending/force and source stopping explanation retained across pages. |
| 8 | p0081#2, p0081#5 | Compressed spring and stretched suspension examples, increasing elastic force, and source equilibrium/stretching conclusion retained. |
| 9 | p0081#3 | fig59 identity retained. |
| 10 | p0081#4 | Caption59 retained. |

The source's simplified settling description is not expanded into a modern
oscillation/damping account. No source correction is authorized or required for
this adaptation review. Newlines change layout only, not question or clause
content; no sentence was removed to make the comparison pass.

### phy6-c3-s18-t1: Weightlessness Supplement

13/13 blocks retained, zero written exercises. This is the unnumbered
supplementary lesson, not the parent s18 course. Title and null number preserved.

| Block | Source refs | Independent finding |
| --- | --- | --- |
| 1 | p0082#6 | Opening becomes generic exploration: spacecraft orbit Earth and probes travel to Moon/other planets; removes the source's epoch-relative "we live in the beginning" framing without changing the lesson's free-flight/weightlessness questions or scope. Context/layout declarations accurate. |
| 2 | p0082#7 | Weight as pressing support or pulling suspension due to Earth's attraction retained. |
| 3 | p0082#8 | Joint free fall of body and support/suspension, both subject to gravity, and both questions retained; only newline. |
| 4 | p0082#9, p0083#1 | Initial fixed support, hanging spring/body, stretching, balance, burned suspension line and joint fall retained; only а/б -> a/b. |
| 5 | p0083#2 | fig61 identity retained. |
| 6 | p0083#3 | Unstretched spring in joint fall, weight zero and **gravity not zero** explicitly retained. |
| 7 | p0083#4, p0083#6 | Body and stand falling together, absence of pressure and zero weight retained. |
| 8 | p0083#5 | Caption61 retained at its assembled-source location. |
| 9 | p0083#7, p0084#1 | Orbital free-fall analogy, shared motion of satellite/contents/astronaut, unloaded stand/spring and weightlessness retained. |
| 10 | p0083#8 | fig62 identity retained. |
| 11 | p0083#9 | Caption62 retained. |
| 12 | p0084#2 | Complete source list: floating objects, liquid, pendulum, limbs/up-down perception and relative constant straight-line motion until collision retained. No new measurement or universal claim inserted. |
| 13 | p0084#3 | Only prefix `苏联宇航员` -> `宇航员`; full `格·斯·季托夫` identity and camera-collision experience preserved, `culture` declaration present. |

Block13 historical declaration names `格·斯·季托夫` with a source-specific
reason. The term occurs in source and modern text. Removal of the nationality
modifier is the authorized culture change, not conversion of a real person
into an anonymous/fictitious narrator.

The opening's change from generic spaceship interplanetary travel to probe
travel is background wording only; it adds no numeric claim, fictitious mission,
date, name, or alteration to the free-flight conditions. The remaining source
clauses equal the original after declared newline changes.

## All Written Prompts Retained

All10 texts are exactly equal to the assembled-source text. Modern `lines`
join to the same full text; changes/numeric_changes/history declarations are
empty. Every number, source_number, group, group_id, ordered pages, figure_refs,
and figures field matches its source. No hidden answer or choice conversion.

| Course / prompt | Source identity | Complete task preserved |
| --- | --- | --- |
| s15 /1 | g1 问题, source1, p0077#10 | Result of one body acting on another. |
| s15 /2 | g1 问题, source2, p0078#1 | Supply examples of speed changing through other bodies' action. |
| s15 /3 | g1 问题, source3, p0078#2 | Define force. |
| s15 /4 | g1 问题, source4, p0078#3 | Explain change of shape under force. |
| s16 /1 | g1 问题, source1, p0079#6 | Explain the horizontal stone's non-straight path. |
| s16 /2 | g1 问题, source2, p0079#7 | Identify the force keeping bodies at Earth's surface. |
| s16 /3 | g1 问题, source3, p0079#8 | Define gravity. |
| s16 /4 | g1 问题, source4, p0079#9 | Relation between gravity and mass. |
| s17 /1 | g1 问题, source1, p0081#7 | Result of gravity acting on a body. |
| s17 /2 | g1 问题, source2, p0081#8 | Define elastic force. |

s18-t1 source count0 and modern count0 agree; its rhetorical prose questions are
not fabricated into new written exercises. No omitted source prompt or duplicate
was found. All10 source and modern written-prompt figure references are empty.

## Numeric, Formula, and Figure Boundaries

All55 blocks retain their ordered inline math fragments exactly.
`numeric_changes` and lesson errata lists are empty. All non-symbol differences
are either declared newlines or the two explicitly reviewed s18-t1 culture/context
changes. Source section20/22 references, figure numbers50-59/61-62, historical
1643/1727, and written question numbers remain intact.

Actual symbol conversions: s15 block8; s17 blocks3 and7; s18-t1 block4.
Cyrillic а/б (U+0430/U+0431) become Latin a/b (U+0061/U+0062), without changing
which experimental stage is referenced. No upper-level modern text retains
Cyrillic characters. These are text-label checks, not proof that a modern
candidate graphic has matching stages or correct physics.

All declared source figure entries and captions retain identity/order. This
review does not inspect, approve, unblock, or promote fig50-59, the Newton
portrait, or fig61/62. Text PASS cannot substitute for their independent reviews.

Section breaks were empty at the initial text review. The bounded final-snapshot
check below approves their subsequent additions only. The templates still need
the ordinary production gates. No browser, final render, adaptation finalize,
or whole-lesson approval is claimed here.

## Final Section-Break Addendum

2026-11-15: **PASS for the added paragraph boundaries.** Reused the completed
55-block/10-prompt substantive text review; did not repeat source pixel review.
Read the scratch `set-batch-4-boundaries.mjs` but did not execute its writes.
Actually ran read-only `prose_flow.mjs --json` for each final lesson template.
All declared before/after pairs exactly equal the tool's adjacent paragraphs;
all resolved indices are unique and nonzero.

| Course | Count | Resolved paragraph indices (zero-based) | Boundary purpose |
| --- | --- | --- | --- |
| phy6-c3-s15 | 3 | 6, 7, 8 | Force definition; deformation; force magnitude. |
| phy6-c3-s16 | 2 | 2, 5 | Earth's attraction; Newton history. |
| phy6-c3-s17 | 3 | 1, 4, 6 | Supported rest; origin of elastic force; compressed spring and suspension. |
| phy6-c3-s18-t1 | 3 | 2, 4, 7 | Weight definition; joint-fall experiment; orbital weightlessness. |

The breaks neither insert answers nor sever a question from its explanation.
All four exercises files and all eight assembled-source files retain the
previously recorded byte hashes. Current embedded source lesson data exactly
equals the assembled source. Narrow continuity assertions reproduce the
previously approved symbol/context/culture transformations, allowing declared
layout whitespace, across the same prose positions. No new substantive text
difference was found by these checks.

Evidence limitation: the reviewer did not retain the previous complete template
bytes. Clearing/removing `section_breaks` and reserializing current JSON does
not recover the previous raw hashes. Therefore exact whole-template
only-`section_breaks` equality is the author's reported change scope, not a
reviewer-proven byte diff; formatting normalization alone is not asserted as
the established cause. Boundary PASS and the reused substantive findings are
bound to the real final hashes below.

Preserved initial reviewed lesson-template hashes:

| Course | Initial lesson.template.json SHA256 |
| --- | --- |
| phy6-c3-s15 | `2adacaef58a55cba30afca5687bd351b6a1dced62b566ac23dc528868d8fe4d4` |
| phy6-c3-s16 | `7a45a169e28386bc3700270443c6c9113a022f3c65eb6dcc3aac16a43e8c1e5d` |
| phy6-c3-s17 | `5499f9d5efaaf5907ebedd62e9d6cdc13755a3b05643a94b6ef9f213882b7510` |
| phy6-c3-s18-t1 | `438f76e9a378820bf00897375cb896a12396670398fd4efdfe11da65cfcadd74` |

## Actual Snapshot Hashes

All hashes are SHA256 of real file bytes computed with Node crypto.

| Course | Modern lesson.template.json | Modern exercises.template.json |
| --- | --- | --- |
| phy6-c3-s15 | `6220965c96d575ebfc474309626cd54ea94605703c43f4f5c4bb73d021cadae8` | `794143435f24a4a53d42bad7e37effa574dd172b4ed9c26f2ba06787223962c4` |
| phy6-c3-s16 | `55586149ddd000a348531148ce9b22c20ab2222afc7887bc737dae55f5e6dc84` | `44c86db0c92128aecc39e4c7b2bab77c64313a432d33c6d2f511dd5bba16aac3` |
| phy6-c3-s17 | `df47070681d36b1de93c49fa741255fc32ac28ce25d00037bf7f043cb8200285` | `41c19d185426aa5a7e77ca89096a9f7393ae41693724dd38fa2ee4fe0a9d1743` |
| phy6-c3-s18-t1 | `38b5179aa3d0616061458de5ac8e8511495612fb672eb69beb71a383ef84e9f5` | `e1cfabcdfdda63775eddefc881de26090609a9b39b9745266c762b4926bef91e` |

| Course | Assembled source lesson.json | Assembled source exercises.json |
| --- | --- | --- |
| phy6-c3-s15 | `a731588db8d7a8fbd019308f905f03d0670453d32141061f0065c0dae48ab6dd` | `43465bcaa046b80482e6613bf55a52e3300f15282029df9f114baa695e942f99` |
| phy6-c3-s16 | `ad9b50688bb39125dde394427415501183f0f89e650321fe9e3449c075d364fa` | `9a3bfe78cd4a4b09b3a58e9bc135797c60aeb55bd0ef8c963105a69c41202f6f` |
| phy6-c3-s17 | `96a0622e518b457b68e37042abe7310b7abc61a61f677a712b2b48b4f2d36754` | `93bc5210b3494e06a85b23610c6b706a4cda057b1f667454cd90ae14c3560f16` |
| phy6-c3-s18-t1 | `877a564b4ee404092c924e81bc8032f850c0bebee1b575eb0bff4e26a2ac7575` | `d5c1fbee1e627d3108fd84653df6348fbb7b86d85700c8ae2a7b3f9afcbd3732` |

## Verification and Stop

Ran read-only Node assertions for all counts, eight snapshots/hash bindings,
55 source_refs/metadata/source_text comparisons, all math fragments, numeric
declarations, complete symbol/layout differences, all10 prompt identities/texts,
Newton/Britain declarations, source phrase preservation and Titov-only modifier
removal. **Actual result: PASS.**

Only this report was added and its final-snapshot addendum updated. No author template, source, skill, image, answer,
DB, Git, publication, or other task file was changed. No source re-review or
image approval was performed. The text-review stage stopped after this report;
the separately authorized independent answer-source stage has its own record.

Runtime: Codex; independent identity Sagan. Exact deployed model ID, reasoning
setting, and aggregate input/output/total token usage are not observable and
are unknown.
