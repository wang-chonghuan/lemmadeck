# STEMROBIN-180 C/180-4: n160 Independent ANSWER SOURCE Freeze b91

Status: SOURCE reference only, before candidate disclosure. This is not a production PASS, a whole-lesson SOURCE/TEXT re-review, or authorization to promote.

## Scope

- Lesson: `7p / modern-us-neutral / phy7-c2-s4-n160`.
- Six complete written prompts independently solved from the approved seed and full bound modern prose.
- Read cap2 and gate 2 of `ld-s10y-answer` for solution completeness and explanatory-answer requirements. No prepare, finalize, renderer, native, publication or database command was run.
- The seed and its modern binding pairs were checked by SHA-256 and structured equality. Only approved bindings were read. Original lesson reads were restricted to answer-relevant source/modern distinctions; original exercises were used only to distinguish prompt wording.
- No author answer-key/template, choices, final keys or solution was read. No candidate was disclosed. `capturedBinding=null` describes the supplied seed, not a claim about the existence of answers elsewhere.
- Actual images: 0; figure references across the six prompts: 0; image budget: 0. Figure captions and names were read as prose only; no image or SVG-pixel interpretation occurred.
- No setup, freshness, backend, Grill, Git, environment, paid, other-chat, agent, branch, worker or old-session inspection was performed.

## Independent Reference

Complete reasoning, Chinese solutions, prompt identity, source locators and source/modern distinctions are frozen in:

`tmp/resume-180-4/answer-review160/source/independent-solutions.json`

Complete per-question facets, evidence and rejection guards are frozen in:

`tmp/resume-180-4/answer-review160/source/coverage.json`

The solutions are independently derived written responses, not copied book answers and not production answer keys. All six call for explanatory free responses; `ungraded` is a recommendation only. No automatic expected values or mathematical-input checks were authored or claimed.

| Question | Required Facets | Independent Solution Summary |
| --- | ---: | --- |
| Q1 | 5 | Suspended powered conductor between magnet poles; closing the circuit produces displacement; removing the magnet while still powered removes that displacement; the contrast establishes the magnetic force in this arrangement. Preserve the modern parallel-direction zero-force limit. |
| Q2 | 5 | Direction depends on both current and magnetic field. Reverse either one with the other unchanged and the force reverses. No invented absolute left/right direction or nonzero-force direction in the parallel case. |
| Q3 | 4 | From the explicitly given plane-parallel initial position, the frame rotates about the vertical axis toward the plane-perpendicular equilibrium. Inertia can carry it through; neither immediate stopping nor indefinite same-direction motion with unchanged current is asserted. |
| Q4 | 6 | Start with Q3's already-moving frame, use inertial passage through equilibrium, reverse winding current at the necessary time after passage, then repeat at successive half-turn intervals so the altered forces continue the same rotation. Keep the winding externally powered. |
| Q5 | 2 | A commutator automatically reverses winding current at the necessary times; the simple split-ring/brush arrangement serves this function. |
| Q6 | 9 | Construction: two mutually insulated metal half-rings, common shaft with the frame, separate winding-end connections, brushes providing the power connection. Operation: contacts swap each half-turn, winding current reverses, timing respects inertial passage, forces then support the same rotation, and powered repetition sustains the described motion. |

Coverage: 6/6 questions; 7/7 response components; 31/31 required facets. Q6 separately covers 4/4 construction facets and 5/5 operation facets. Missing questions: 0; duplicate questions: 0.

These counts describe the independent reference only. They do not claim that an undisclosed candidate covers those facets.

## Source And Modern

1. `p0403#3`: The original book's unqualified force statement is not reinstated. The modern prose limits the experiment's conclusion and expressly makes this magnetic force zero when the conductor is parallel to the field.
2. `p0406#8` with `p0404#8`: The original Q3 does not itself state the initial orientation. The modern Q3 explicitly supplies the frame-plane-parallel initial condition. The solution follows the modern prompt.
3. `p0405#1`: The original opening can be read as reversal alone producing a half-turn, but its later instruction already requires inertial passage. The modern opening makes prior inertial passage and timely reversal explicit. Q4 retains both and does not imply self-starting from rest at stable equilibrium.
4. `p0405#3`, `p0405#4`, `p0405#9`, `p0406#1`: Construction and the half-turn contact exchange remain source-supported. The F/E and D-to-C/A-to-B sequence is a textual corroboration only, not an image-derived location claim or a mandatory label-recall facet. Q6's operation is qualified by modern `p0405#1`.

Modern prompt locators `p0406#6` through `p0406#11` are inherited from the approved seed. The bound exercise objects do not themselves expose a `source_refs` field; the review does not invent that field or claim independent page/image inspection.

No new formula or unreferenced historical fact is introduced. Half-turn intervals and existing letter names come from the approved prose.

## Binding Hashes

| Approved File | SHA-256 |
| --- | --- |
| Seed | `039fee375098f9a51fc0a892146aaae906b124e351fdf7d86a39460c80f3442d` |
| Modern lesson source and target, each | `0d7ee8aeee804ce571696fee2d5967abb7e7b8d1cab4b468c78b66ba1cb0ad43` |
| Modern exercise source and target, each | `d7b6f7e903067ffb029879de583c04f8bdc353116c297d56847e443c5c1a2e64` |
| Original lesson binding | `bd0111fc1aae517772323fe96c1f0494cd62fa352e387d74fefc9874486c71c0` |
| Original exercise binding | `e7e94cff03211210d181f3d1804dc87f93048c742d719c880fcee2b4c0b39117` |

Exact input/output byte hashes are recorded in:

`tmp/resume-180-4/answer-review160/source/source-freeze.sha256`

The report, independent solutions, coverage and hash manifest are frozen readable with mode `0444`. The manifest lists the three review payloads and seven bound input paths; its own hash is returned separately, without a circular self-hash.

## Stop Boundary

Stop at this independent SOURCE freeze. No candidate comparison, production/renderer/native verification, answer finalization, official gate PASS or promotion is claimed. A later FINAL comparison requires explicit follow-up authorization. No unrelated edit was intentionally changed.
