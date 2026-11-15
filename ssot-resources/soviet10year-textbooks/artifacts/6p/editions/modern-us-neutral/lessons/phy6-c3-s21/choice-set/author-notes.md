# S21 Choice Author Handoff

Status: **AUTHOR COMPLETE; final structural validation PASS; independent
semantic review PENDING.** Not an independent approval or publication.

STEMROBIN-180, phy6-c3-s21, 2026-11-15. This agent is the choice author,
not the independent reviewer of this choice set. Earlier independent image
approval is not substituted for choice review.

## Authorized Order

Main's actual s21 retain/adapt-finalize PASS notification preceded all
authoring. `ld-s10y-choice` skill, authoring, contract and semantic gate were
read. Whitelist `inspect` projected all seven original written exercises.
`prepare` selected 1, 2, 3, 4, g2-1, g2-2, g2-3 and concept blocks 1/3,
with approved durable fig-68 and fig-69 as concept figures.

No solved-example paragraph was selected as a definition. Block 4's numerical
illustration was not inserted into the seed. The full original task solutions
were independently written in `author-solution.md` before any options/key
were constructed. That file remains unchanged after option construction.

The actual two durable SVG assets were hash-checked and viewed completely,
including all bottom/right content, in `approved-seed-figures.png`. The file
only displays existing approved SVG bytes; it is not a new candidate drawing
or substitute source asset.

No answer key, Sagan source answer/solution, earlier choice or interaction was
read. No authoring input came from an image review/spec/report, old choice
artifact or an app/database payload. The preparation tools read only their
declared modern-source whitelist.

## Response Units

All seven sources have one meaningful unit; no quota or blank count determined
the split. There are 7 questions, 29 alternatives, 4 native single units and
3 native multiple units. All 29 alternatives have per-option derivations;
12 are true and 17 false under their stated conditions.

| Source | Unit | Retained reasoning |
| --- | --- | --- |
| 1 | s21-controlled-effects | Complete causal comparisons covering magnitude, direction and application point, with an ignored-direction error. |
| 2 | s21-vector-reason | Equal magnitudes do not equate opposite-direction force vectors; both vector components matter. |
| 3 | s21-force-diagram-rule | Whole origin/direction/proportional-length rule on actual fig-68, including no silent calibration from pixel length. |
| 4 | s21-gravity-weight-recipients | Explain body versus support recipients of fig-69's F/P, not merely select the pictured labels or count ticks. |
| g2-1 | s21-two-force-plans | Complete plans for both forces, with multiple valid common/separate scales and checked directions/origins. |
| g2-2 | s21-tractor-scaled-traction | Compatible N/kN conversion and full scaled traction plan, including recipient and direction; length alone is insufficient. |
| g2-3 | s21-crate-gravity-weight-plans | Tonne/kg conversion, explicit g, both magnitudes, common/separate scales, full lengths and distinct gravity/weight recipients. |

The author independently checked each complete true set and every false
procedure, not just nominal keys. Misconceptions include ignored direction,
force-as-scalar, application-point-only vector definition, force-as-velocity,
backwards arrow reading, thickness-as-magnitude, undeclared calibration,
interchanged gravity/weight recipients, reversed actor/recipient, support
reaction substituted for weight, inverse scale division, omitted scale factor
and treating tonnes as kilograms.

Each procedure actually yields its candidate claim rather than merely being
an error label. This is an author reasoning check, not empirical prevalence
evidence or an independent semantic verdict.

## Conditions And Capacity Boundaries

**Three-attribute examples:** The spring example is restricted to the elastic,
static range. The cart comparison explicitly ignores horizontal resistance,
and the false door direction claim acts at the handle, avoiding zero lever
arm. All three attribute comparisons remain present. Candidates supply
examples and controlled conditions; autonomous invention and explanation
are not established.

**Force vector:** Magnitude plus direction define the abstract vector.
Application point matters to bodily response but is not made a third required
abstract-vector component. Equal numerical magnitude/unit is not enough.

**Actual images:** Fig-68 remains uncalibrated and cannot provide a numerical
force from pixel length. Fig-69 is a supported teaching example: gravity on
body versus weight on support, not an upward support reaction. Visible
origin/direction cues are acknowledged. Its 10 N scale does not calibrate
tractor/crate diagrams; the image is not attached to those numerical units.

**g2-1 concrete setup:** The original gives a 400 N weight and a horizontal
50 N strike but not support geometry or left/right sense. The view expressly
adds stationary horizontal support and a rightward force on the ball. Both
common and independently chosen scales remain legitimate.

**g2-2 concrete setup:** The original says traction can reach 60000 N, not
that it always equals that. The view selects the reached-magnitude case and
expressly adds a rightward tractor-on-tool force at the tool coupling.
The opposite tool-on-tractor force is not the requested diagram.

**g2-3 numerical parameter:** The selected source has no numerical g, so the
pre-option source solution remains the family 3000g N. The view explicitly
sets g=9.8 N/kg; 29400 N = 29.4 kN is exact under that parameter. The supplied
constant was not extracted from a solved example or an answer key.

**Drawing-production loss:** All three drawing conversions are whole verbal
plans including scale, length, application recipient/origin and direction.
They are not isolated-length tasks, nor actual new candidate diagrams.
Autonomously selecting a suitable scale, using a ruler, spatially placing
and labeling arrows and making both drawings remain deferred in every
relevant `limitations` and `coverage.omitted_tasks` entry. No recognition
result is called complete drawing ability.

**Nonunique scale:** Different positive scales can represent the same force.
The g2-1 and g2-3 units deliberately admit several coherent plans, including
separate declared scales. Larger physical force can have a shorter drawn
arrow under different scales, and equal forces can have unequal drawn
lengths under different scales. No unique self-chosen scale is imposed.

**Whole-package dependence:** The same application principle recurs in the
diagram explanation and later plans, but the numerical plans additionally
require independent units, magnitudes, scales and lengths. Example/definition
units are not marked true for later reuse. The pure view includes no feedback,
source numbering, source solution, rationale, misconception or key. Shared
teaching images are deliberate concept references, not hidden answer figures.
An independent reviewer must still assess redundancy and leakage across the
whole snapshot; author statements do not pre-approve those gates.

## Structural Evidence And Snapshot

Final validation command, repository root:

```bash
python3 .agents/skills/ld-s10y-choice/scripts/validate.py \
  --repo . \
  --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s21/seed.json \
  --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s21/draft.json
```

Actual exit code: **0**.
Actual output: `mechanical checks passed; semantic review still required`.
No `--review` command was run and no `review.json` was authored.

An initial structural pass was followed by one pre-handoff author improvement:
the tractor unit distractor now uses the concrete omitted-factor calculation
10 kN incorrectly converted to 1000 N, giving 60 cm, instead of a 6000 cm
mixed-unit candidate. Its derivation and misconception were changed together.
The final draft was structurally validated again and the pure view reprojected.
This was not a reviewer-triggered repair; no first FAIL or rejected review
existed or was erased.

The current `view.json` is exactly `{questions:[{id,view}]}` projected with
the standard JSON parser. It has no internal author fields or answer map.
It supersedes the initial pre-handoff projection, which was not sent to a
blind reviewer. No frozen independent document was overwritten.

| Record | SHA-256 |
| --- | --- |
| Seed canonical JSON | `aabb4ebd892f77255cc1245ae3d2f60958480a8adebaf67d5191a7b604c77d66` |
| Final draft canonical JSON | `709c63100b6880c8381c76dfeaf57cf561764243349dcbee565428682a57b80d` |
| Final pure view canonical JSON | `847b007bc05680a73240110779cb5e880c7b3c2251853d990f62b3e9bfc0ba55` |
| Seed file bytes | `dd792600e192c68fac2b80e4272e22317ec38040e7d25f92736365ab97398d3d` |
| Final draft file bytes | `cea2220d652e759d2ca224beeb771c415f88ca2ba4e7771ea733f314571f3d19` |
| Final pure view file bytes | `3a8f04cd137fdb642008098eb9111bedddf32f3c29c687e216fc92b2b0551529` |
| Frozen pre-option `author-solution.md` bytes | `309dab57c444d6e85a93f8ad2fa8a1319cc515721e6d0c93205492243310b22b` |

Canonical hashes use the contract's sorted-key, ASCII-escaped compact Python
JSON serialization, UTF-8 and SHA-256. Seed freshness and actual durable image
hashes were checked by the final structural command.

## Independent Handoff

Provide the independent reviewer only `seed.json` and its actual approved
assets first. After their source-first freeze, provide only `view.json`.
Only after their pure-view judgments are frozen may main authorize
`draft.json`, this note and `author-solution.md` for internal comparison.
No key or rationale is needed in the first two stages.

Author deliverables are complete. Independent choice semantic review remains
pending; there is no claimed review PASS, retained choice snapshot, promotion
or integrated application output.

All writes stayed in this choice scratch directory: seed, draft, pre-option
source solution, notes, pure view and disposable offline figure-opening/
projection helpers and screenshot. No new figure, source/edition mutation,
app change, dependency action, model service, DB or Git operation occurred.
