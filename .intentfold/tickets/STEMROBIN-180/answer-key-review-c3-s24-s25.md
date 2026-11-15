# Independent Answer-Key Comparison: s24–s25

2026-11-15. Ticket: STEMROBIN-180. First authorized key-disclosure stage.

**s25: PASS,3/3 complete derived/ungraded answers. s24: PENDING,0/7 compared; await main's explicit generation-ready notice. Overall ten-answer batch is not yet approved.**

## Frozen Independent Baseline and Scope

Used the already frozen independent answers, not a fresh solution influenced by the author key:

`.intentfold/tickets/STEMROBIN-180/tmp/answer-source-c3-s22-s25.md`

Actual byte SHA-256 remains `8835e441bf5ea3bb299e255be3ad282f5220b8dc785493067f8540c845a571f4`. Its nineteen answers remain unchanged. Only s25's three existing source solutions were compared here; s24 answers/keys were not disclosed or read.

Read the current durable s25 answer key, exact exercise identities/prompts, normalized lesson prose and figure manifest, plus the applicable answer skill/gate. Reused this reviewer's actual source/modern fig76 observation and its independent PASS without reopening pixels or repeating image approval. Current durable artwork/SVG are byte-identical to that observed candidate.

No author draft or key was edited. No source answer was rewritten, no finalize/validate/render/publish was run, and no browser/app/DB/Git/dependency/service action occurred.

## s25 Bound Snapshot

Durable lesson root: `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s25/`.

| File | Actual Byte SHA-256 |
| --- | --- |
| `answer-keys.json` | `457aa0526d232384f6cd073288e004b9e39f85b51303b526bdc3c4626555dd84` |
| `lesson.json` | `4246084d93c002365db57681fb1c6c3ea5af17a8f9c97873de3cbe462e59b121` |
| `exercises.json` | `7656b35c32b3beb172b3d13055fac6cb2ee8998ae1b6979380ae6d93a1399a5c` |
| `figures.json` | `7035a10df3336d7a2755e3db7f85cb8a8467d5a2449fc052ea2366aebb7f92e4` |
| Durable `figures/fig-76.svg`, relative to edition root | `14000467eefeec90a4341bee4d5795ea7296441fbae9a599728edcd1c37cb7a0` |
| Durable `figures/fig-76.artwork.png`, relative to edition root | `e1aca1c1175c6f0649fa669c86b3c5d7dccbc8ad84e4582af650b9256540aa4a` |
| Durable `figures/fig-76.review.json`, relative to edition root | `e8cd4b78acd9238e1cafbfcab2cc3b93495232986701522c11553f71b8dd439a` |

Lesson/exercises/figures have actual status `ready`; answer keys remain `draft`, awaiting main's batch finalize. This semantic comparison is not a claim they have been finalized.

All three answer IDs exactly match `{1,2,3}` in source order, with matching current prompts; no duplicate or missing answer. Every exercise is group `g1`, printed `问题`, with stable/printed numbers1/2/3 and source pages p0099#9, p0100#1, p0100#2. The complete durable exercise objects equal frozen exercise objects; normalized prose differs only by whitespace layout from frozen prose.

All three keys have `source: derived`, `grading: ungraded`, `parts: []`, and nonempty complete `displayAnswer`. No `expected`, numeric auto-grading surrogate or bookRaw attribution is introduced. Their empty `figureEvidence` arrays correspond to empty per-exercise figure refs; the figure belongs to the lesson prose. This report still compares the lesson apparatus because the experimental protocols depend on it.

## s25 /1 — Measurement of Friction

**PASS.** Frozen source solution requires a zeroed/appropriate instrument, horizontal pulling on a horizontal contact surface, uniform rectilinear sliding, stable reading and horizontal force balance. It does not equate any arbitrary instantaneous gauge reading to friction.

The author's answer preserves the essential task: attach the gauge, pull horizontally, achieve uniform rectilinear motion and wait for a stable indication. It explicitly restricts the two-force balance to the horizontal direction, identifies spring pull versus contact friction, and excludes acceleration/deceleration and additional unaccounted horizontal forces. Thus it agrees with the frozen relation `horizontal pull − sliding friction =0`; neither the block's gravity nor support force is denied.

The key contains no numerical reading or invented scale. It omits optional setup details such as zeroing/range selection, repetition and writing the reading in N, but that does not remove the determining method or its required uniform-motion condition. These remain practical requirements when actually carrying out the experiment, not evidence that the key or a text submission has performed it.

Actual fig76(a) shows block direct contact, connected spring and gauge. Its preserved leftward internal indicator is not a newly added external pull direction; the answer correctly uses the rightward spring pull specified by the lesson. No conflict with the full source/modern apparatus was found.

## s25 /2 — Dependence on Pressing Force

**PASS.** Frozen source solution separates the manipulated vertical load from controlled block, material, lubrication/contact condition and horizontal pulling method, measures stable readings twice, and compares the observations under those conditions.

The key holds block/contact material/pulling method fixed, measures before and after adding known weights, retains constant-speed motion and compares stable readings. It correctly identifies added vertical load as increased pressing force and uses “若读数增大”/“在该实验条件下” rather than pretending data have been collected. It also preserves the source hand-pressure alternative and its poorer load control, and warns against simultaneously changing material or using acceleration-stage readings.

This is complete procedural/reasoning coverage, not just “more pressure gives more friction.” No fixed coefficient, exact proportionality, instrument precision or Pa pressure value is invented. The optional independent formulas for N before/after loading are not necessary for the requested qualitative demonstration. Existing fig76 need not depict an added weight: the source prose itself instructs this experimental variation, and neither diagram nor key has silently changed the original figure load.

## s25 /3 — Equal-Load Sliding/Rolling Comparison

**PASS.** Frozen source solution requires two trials with the same block/load and surface, stable horizontal constant-speed pulls, and the source's **two round rods** in the second trial.

The key explicitly keeps load and block fixed, first measures sliding, then uses fig76(b)'s **两根圆棍**, requires normal rolling, measures both stable readings and infers the smaller rolling resistance only if that reading is smaller in this experiment. It controls contact conditions/pull direction and excludes changing mass or acceleration to manufacture a difference.

This matches the actual source and durable modern image: the right lower block has exactly two tangent rollers, unlike the separate left lower runner-sled scene. The key does not mistake sled runners for rollers, infer a force ratio from drawn coil lengths or interpret the opposing internal arrows as unequal imposed force vectors.

The comparison is valid as the elementary apparatus's equivalent resistance under controlled conditions. It does not assert a universal all-material/all-speed law or give fabricated measurements. The actual setup still needs stable motion, free-running rods and attention to apparatus resistance/rod weight; these source-first limits remain unchanged. “载荷相同” is not weakened to merely “two blocks look the same.”

## Grading, Limitations and Closure

All three original tasks ask for methods and experimental reasoning. Their `ungraded` classification is appropriate: complete explanation, control-variable design, apparatus operation and collected evidence are not reliably auto-judged by matching a local scalar. The author's explicit statement that point selection does not constitute an experiment is consistent with the frozen baseline.

Repeated generic `notes` about the overall ungraded policy are not treated as per-task proof; the substantive task-specific content above comes from each actual `displayAnswer`. No essential omission or wrong mathematical/physical assertion was found in this bound s25 snapshot, so no first FAIL or repair request is invented.

**s25 comparison COMPLETE/PASS3/3. s24 remains PENDING7/7.** Await main before opening its new key. A future key or prompt/figure-data change invalidates only the affected comparison; no ten-answer batch approval, answer finalize or publication occurs here.

## Authorized s24 Disclosure and Final Batch Closure

2026-11-15. Main explicitly disclosed the seven durable s24 keys after its one authorized anchor repair and successful adapt-finalize retry. The earlier PENDING statements above are retained as first-stage chronology; this appended comparison closes that pending stage. **s24 PASS7/7; combined semantic answer-key comparison PASS10/10**, comprising these seven newly reviewed keys and the unchanged prior s25 PASS3/3.

Only the frozen s24 source solutions were used for this new comparison; none of the nineteen independent solutions was rewritten or re-derived after key disclosure. Frozen source report byte SHA-256 remains `8835e441bf5ea3bb299e255be3ad282f5220b8dc785493067f8540c845a571f4`. The existing s25 report content is retained without modification or substantive re-review; its current answer-key hash was checked only to confirm the prior binding still holds.

Read the actual s24 keys, complete current exercise objects and relevant durable lesson context. Reused prior actual source/modern fig74/75 observation and independent PASS, together with main's confirmed observation of source74/75/76 and approved modern figures/specs. No image was reopened, reapproved or rendered here. In particular, fig74's source object remains a sled, not a block; the block mentioned in answer1 is a separate proposed tabletop experiment. Fig75(a)'s rough contact and fig75(b)'s separating lubricant layer support the stated elementary mechanisms, not measured roughness, film thickness or a force ratio. Prior fig76 apparatus evidence remains in the untouched s25 section.

## s24 Bound Snapshot

Durable lesson root: `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s24/`.

| File | Actual Byte SHA-256 |
| --- | --- |
| `answer-keys.json` | `ac0ce0e0f49202c546e00e7ef213d05dcc8b57df8ee27cf1b69dd81e0445a770` |
| `lesson.json` | `5b2150df23c9d80bd5c3b32926d1980f7056437864a733f37df23f577131c25f` |
| `exercises.json` | `a70413c39e0e530fecd14d4d3a5d451cdf4cb998df4908152febd03f708c050b` |
| `figures.json` | `d527c5dfa940c5951a12def936c46bc717ce1582a5bb6b84703b0cbf97d36493` |

Lesson/exercises are `ready`; answer keys are still `draft`. This report approves the bound semantic comparison, not an unperformed answer finalize or publication. The anchor-only repair and its first failed snapshot remain separate preserved evidence; neither the repair nor this report changes authoritative prose, exercises or figures.

All seven key IDs/prompts exactly match current exercises `{1,2,3,4,5,6,7}` in source order. Each retains `group_id:g1`, printed group `问题`, corresponding printed number1–7, and source pages p0098#5–p0098#11. Complete durable exercise objects equal the frozen scratch exercise objects. All seven keys are `source:derived`, `grading:ungraded`, with `parts:[]` and complete nonempty `displayAnswer`; no `bookRaw` attribution or `expected` surrogate is introduced. Empty per-key `figureEvidence` agrees with empty exercise figure refs, rather than omitting an exercise-owned diagram; lesson-prose figure dependencies were still considered above.

## s24 /1 — Observations and an Implementable Experiment

**PASS.** The key supplies both requested components: sled coasting onto level ground and bicycle coasting as observations, plus horizontal constant-speed pulling of a block on a horizontal tabletop with a dynamometer as an experiment. It preserves inertia rather than suggesting that inertia is consumed or a force is always needed to sustain motion.

It explicitly distinguishes a change of motion indicating resistance from identifying all observed resistance as contact friction: air resistance may also contribute to the everyday examples. For the tabletop demonstration, steady horizontal pull and uniform sliding provide the force-balance condition relevant to opposing contact resistance. The answer gives contact surface, motion condition and observable stable indication; it does not fabricate a reading, coefficient or completed experiment. The frozen source's additional zeroing, repetition and changing contact conditions are useful practical extensions, not omitted required components of this examples question. No need to list every possible observation, such as the additional skater example, to cover the task.

## s24 /2 — Definition within the Source's Motion-Contact Scope

**PASS.** The answer identifies contacting bodies, relative surface motion and resistance opposing that relative motion, expressly limiting the definition to this lesson's motion-friction context. It keeps gravity, elastic force and air resistance distinct from the contact friction being defined.

This agrees with the frozen source solution and fig74's sled/contact-resistance example. “Opposing” is not an unrestricted assertion about any body's ground-frame velocity. The key does not purport to define every static-friction role, driven-wheel traction or pure-rolling contact force; those frozen limitations remain applicable rather than being erased to make the key appear universally complete.

## s24 /3 — Both Source Causes

**PASS.** Both required causes are present: microscopic surface protrusions, scratches and irregularities that obstruct relative motion, and attraction between molecules of contacting bodies. The rough-versus-highly-polished discussion preserves the source's distinction and expressly rejects the claim that visually smooth surfaces necessarily have zero friction.

This is the source's elementary mechanism account, not a measured law relating roughness to a friction coefficient or a complete theory of all rolling-energy losses. No value is inferred from fig75's enlarged schematic geometry. The molecular cause is not omitted or collapsed into “roughness only.”

## s24 /4 — Lubrication's Effect and Explanation

**PASS.** The key answers both clauses: appropriate lubrication usually reduces friction, and the separating film reduces direct solid contact/interlocking while relative motion occurs mainly within the lubricant layer. It preserves the lesson's oil example and ice-blade/thin-water-film illustration, not just the slogan “lubrication reduces friction.”

“合适” and “通常” keep this within the stated conditions, consistent with the frozen solution. The answer explicitly rejects zero friction and absence of all interaction. The source's qualitative “好多倍” supplies no fixed ratio to calculate; the key correctly invents neither a numerical reduction nor a film thickness. The thin-water-layer example remains the source's elementary explanation, not a claim to exhaust all skating physics or guarantee that every liquid reduces resistance in every application.

## s24 /5 — The Two Taught Motion-Friction Categories

**PASS.** Sliding and rolling are both named and explained, with sled sliding and wheel/log/barrel rolling examples. The answer explicitly calls them this section's two motion-friction categories rather than the complete taxonomy of all friction.

This matches the frozen baseline: static friction may be a broader supplemental category, but the original task in this section does not require an untaught systematic account of it. No source-required third category is dropped, and no assertion is made that all friction must fit only these two labels.

## s24 /6 — Relative Sliding, Not Merely Ground-Frame Motion

**PASS.** The key requires one contacting body to slide relative to the other's surface and gives sled/skis on snow and block-on-table examples. It explicitly rejects inferring sliding solely from a change of position relative to the ground.

This preserves the frozen distinction: bodies carried together without relative surface slip, or pure rolling contacts, are not sliding cases merely because the object has a ground-frame velocity. The conditions and examples both survive; the answer is not reduced to an unexplained label.

## s24 /7 — Rolling Defined by Contact Motion

**PASS.** The answer identifies rolling over another body's surface, gives wheel-on-track/road and log/barrel examples, and distinguishes rolling from sliding by the contact-motion mode rather than object name or speed. Read with its express “本课所说” scope and the preceding resistance definition, it identifies the source's rolling-friction/resistance role without claiming all forces at a wheel are rolling resistance.

The frozen source's locked-wheel and driven-wheel cautions remain: a locked wheel sliding on the road is not pure rolling; static traction that drives a wheel is not automatically a backward rolling-resistance force. The key does not explicitly reproduce those supplemental examples, but its contact-mode criterion and lesson scope do not contradict them or omit a required part of this definition task. No measured sliding/rolling ratio or universal resistance law is asserted.

## Final Coverage and Limits

The seven actual task-specific `displayAnswer` fields, not their repeated generic `notes`, establish the judgments above. Definitions, both causes, observation plus experiment, lubrication explanation, and sliding/rolling examples and conditions are all covered. Free-form explanation and experimental evidence remain `ungraded`; a scalar or point-selection answer is not substituted for those tasks.

No essential defect was found in the bound s24 keys, so there is no affected repair unit or new first FAIL. Existing first-failure evidence from other completed tasks is left intact. Frozen source solutions, prior s25 conclusions and all durable/author/image files are unchanged. No new source solution, s25 substantive review, fig77 task, browser/app/DB/Git/dependency/service action, mechanical author rerun, finalize or publish occurred.

**Final result: s24 COMPLETE/PASS7/7 + preserved s25 COMPLETE/PASS3/3 = answer-key comparison COMPLETE/PASS10/10.** Main owns the subsequent batch finalize. A later change to any bound key, relevant prompt or figure data requires only its affected comparison to be reopened.
