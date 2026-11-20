# FIG70 R106 Affected Follow-Up R1

Verdict: **PASS**, affected-only, by the same current reviewer.
FIG70-R106-01 and FIG70-R106-02 are closed. No new callout defect was found.
This combines current affected approval with reused unaffected FIRST findings;
it is not a new SOURCE or full-figure review.

## Current Affected Findings

- **FIG70-R106-01 closed.** Both lower-member object IDs and horizontal assertion
  IDs are neutral. The first inventory description states that the visible
  member's mechanical function is UNKNOWN, rather than calling it a reference,
  support, pointer or constraint. The second description explicitly separates
  qualitatively similar source spans from the prose-required same stretched
  length. Regularized loaded equality is not presented as exact pixel equality.
- **FIG70-R106-02 closed.** Four plain thin leaders connect each left force/mass
  label to its own block's right edge. The 1 N label now visibly points to the
  upper rectangle, not its upstream suspension connector. Both upper labels
  identify that block; both lower labels identify the lower block. The new
  inventory group expressly classifies the leaders and upper/lower assignment
  as modern additions, not recovered source ordering or connector tensions.
- **No new callout defect.** In the single new composite image, at both full
  640 and mobile 297 widths, leaders are visible and distinguishable, do not
  cross one another or the hooks, and have no arrowheads. They introduce no
  extra force vector, numeric value, dimension, cultural symbol or lower-member
  interpretation. Label text and anchors remain unchanged.

Affected SVG endpoints (screen coordinates):

| Label | Label-side endpoint | Own block endpoint |
|---|---|---|
| 1 N | (244,374) | (208,400), upper edge y=395..435 |
| 0.1 kg | (224,428) | (208,420), upper edge y=395..435 |
| 2 N | (244,491) | (208,495), lower edge y=472..536 |
| 0.2 kg | (224,549) | (208,530), lower edge y=472..536 |

All four endpoints lie on the finite edge of the assigned rectangle. Four
`connects` plus four `pointOnLine` assertions cover their declared connections
and own-edge incidence; actual finite-edge locations were also inspected.
All 48,980 current SVG bytes were parsed as XML; affected leader/member
elements and label positions were read without rendering. No marker reference
is present. The no-arrow visual finding is not inferred from assertion names.

## Exactly What Was Reused

- FIRST pixel-only inventory, frozen before any original prose/candidate read:
  SHA256 `7a6c7e595e178b999d5f079f29848bf25c971d8a0a104530ce1f742baa84dac7`.
  It establishes two stands, two serial left blocks, one larger right block,
  hooks/transverse members, and no original numeric labels. Function and
  exact pixel equality remain UNKNOWN.
- FIRST prose facts: 0.1 kg / 1 N and 0.2 kg / 2 N under the explicit 10 N/kg
  approximation, one 3 N replacement, and the same stretched length.
  Prose does not specify which original block is upper or lower.
- FIRST unaffected findings: units/values, prose-required loaded equality,
  complete apparatus structure/counts, English panel identity/culture handling,
  and the fact that the 3 N value is already teaching prose, not newly supplied
  answer-key material. Original image, old screenshot, recovered templates and
  old candidate were not reopened for semantic review.
- FIRST failing review/report/result/before-after records/manifest remain
  byte- and mode-identical. FIRST manifest SHA256:
  `1e3a1e673951d753a90abac13bc7ea83dfcd2aeb3f3823ba0aa8953d9d87587c`.
  The parent's prior 25-binding exit-0 receipt is reused, not rerun.

## Boundaries And Recording

`geometryChanged=false` refers to EXISTING apparatus geometry. Four new visible
callout segments were added; the SVG/spec hashes changed. This is not
byte-identical regeneration, and determinism did not approve semantics.

Current supplied render PASS: 35 objects / 7 labels / 7 width checks.
Current native PASS: 14 observations / 98 label observations / minimum
16.70625 px. This is current-app-CSS fixture evidence, not headed-product or
full-course DISPLAY acceptance.

Official `record_review.py` ran **once**, exit **0**, after the affected PASS
decision. Its owned `affected-r1/fig-70.review.json` binds the current source,
spec, render and SVG and records the combined reuse basis in its notes.
No canonical review or candidate was changed.

Actual new image loads: **1**; cumulative context image loads: **3**
(original 1, FIRST native 1, affected native 1). No crops, reopens, browser or
render. New image-generation calls, reviewer repairs and budget resets: **0**.
Historical repair 1/1 + new layout 1 + new association 1 = cumulative **3**,
retained under the latest direct ordinary reversible recovery authority;
neither the counter nor authority establishes scientific approval.
Tokens: **UNKNOWN**. Billing: **UNKNOWN**.

Twenty actual input dependencies are bound before/after by SHA256, bytes and
mode. All six new files are frozen `0444`; the manifest binds the five other
outputs and returns its own digest externally. No other stages, gates, chats,
agents, repairs, promotion, DB or Git changes occurred.
