# STEMROBIN-180 / B88 / n41 Independent Affected TEXT Review

## Verdict

**PASS: F1-F5 resolved in the exact candidate bytes below. STOP.**

Date: 2026-11-19. Same cap3 invocation `180-3`.
Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
This is an independent scientific review of affected TEXT only, not a new full
SOURCE/TEXT review, author approval, figure approval, or production release.
The original full fidelity PASS is reused. The original scientific
**FIRST HOLD / REVISE remains FIRST HOLD / REVISE**, with its bytes unchanged.
The author receipt's historical review-pending status is not rewritten.

Scientific scope: `/prose/0`, `/prose/2`, `/prose/3`, `/prose/5`,
`/exercises/3` and `/exercises/4`, including all sentences and tasks in those
entries. Immediate unchanged direction/ratio context and the two requested
boundary sides were used only to settle the original five findings.
Unchanged entries were compared mechanically for unauthorized differences,
not independently given another full scientific verdict.

Path shorthand, all relative to the workspace above:

- `T`: `.intentfold/tickets/STEMROBIN-180`.
- `C`: `.tmp/ld-s10y-lesson/b88-friction-author/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n41`.
- `F`: `.tmp/ld-s10y-lesson/b88-friction-recovery/templates/phy8-c2-s2-n41`.
- Receipt: `T/tmp/b88-n41-affected-review/receipt.json`.

## Exact Findings

### F1: PASS / Static And Kinetic Coefficients

`C/lesson.template.json:27,78`; `/prose/0`, `/prose/3`;
source `p0166#8`, `p0167#3`.
The opening identifies the original equality as a simplifying approximation,
explicitly denies general equality, and requires separate coefficient
determination. The formula paragraph identifies its unchanged parameter as
the kinetic coefficient and excludes using it alone to determine starting.
Its fixed material/surface and applicable normal-load dry-sliding model is
an empirical approximation, not a universal material law.
The unchanged neighboring ratio definition remains a kinetic magnitude
ratio in this context; it does not reinstate a common static/kinetic parameter.
Saved OpenStax lines 124-199 and 349 support these distinctions.

### F2: PASS / The 10 N Example Does Not Guarantee Starting

`C/lesson.template.json:111`; `/prose/5`; source `p0167#5`,
read with `/prose/0` and `/prose/3`.
The example now specifies an already-sliding block, fixed horizontal table,
horizontal push, negligible other vertical forces and a kinetic coefficient.
The original `0.5`, `20` N weight and `10` N force are unchanged.
Reviewer diagnostic only: the normal force is 20 N, kinetic resistance is
`0.5 * 20 = 10` N, and the stated push balances it. This supports continued
uniform sliding, not spontaneous starting.
The final sentences explicitly deny a starting guarantee, including when a
same-value approximation puts the push exactly at the static limit.
Saved OpenStax lines 147-175 and 268-341, together with NASA lines 40-42,
support the distinction. No new coefficient or starting threshold was supplied.

### F3: PASS / A Force Contribution Is Not Actual Relative Acceleration

`C/lesson.template.json:61`; `/prose/2`; source `p0167#2`.
All of the rewritten entry was checked. It limits the opposing acceleration
statement to the sliding friction force's own contribution, explicitly says
actual relative speed need not decrease, and includes other forces and
contact-surface motion. The fixed-surface, greater same-direction push
example demonstrates possible acceleration without making a general
friction-direction claim about the net acceleration.
Saved OpenStax lines 103-109 and 551-603 and NASA lines 40-42 and 126-140
support this reasoning. The original unconditional slowdown is not retained
as the candidate's physical conclusion.

### F4: PASS / Q4 Is Explicitly Coefficient-Dependent

`C/exercises.template.json:78`; `/exercises/3`; source `p0168#11`.
The entire original question and both tasks remain: required constant-speed
push, then motion under a greater push. The added condition explicitly
specifies the fixed horizontal floor, horizontal same-direction push,
constant normal force and dry-sliding model.
It states that the contact materials and kinetic coefficient are missing,
asks for a coefficient-dependent force and an explanation of why a unique
numerical force cannot be determined. This expressly resolves the apparent
numerical demand in the retained original wording; retaining that wording is
not a remaining missing-data finding.
The second task specifies constant greater push and unchanged other
conditions, making the net-force reasoning determinate within the model.
No floor material, coefficient, numerical push, or new value of gravity was
invented. Saved OpenStax lines 124-199 and 268-341 and NASA lines 40-42 and
126-140 support the dependency and equilibrium reasoning.
No student answer key was authored.

### F5: PASS / Q5 Has A Defined Sustained-Sliding Load Model

`C/exercises.template.json:101`; `/exercises/4`;
source `p0168#12 -> p0169#1`.
The complete original question and cross-page task are retained.
The original `600` N sustained force, `0.005` coefficient and `100` kg empty
sled mass are unchanged. The addition makes the surface and pull horizontal,
the sled already sliding, the given coefficient kinetic, and other
resistance negligible. The requested upper limit is explicitly cargo
weight under sustained uniform towing, not a starting-from-rest limit.
These conditions determine the idealized force balance and preserve the
distinction between empty-sled mass, total supported weight and cargo
weight. No coefficient correction, real-material measurement claim, slope,
static coefficient or real-horse capacity assertion was fabricated.
Saved OpenStax lines 178-199 and 268-341 and NASA lines 40-42 support the
model. No numerical cargo answer or mass-as-weight substitution was added.

## Affected Binding

All three candidate hashes match the human instruction and author seal:

| Template | Candidate SHA-256 | Exact FIRST SHA-256 |
|---|---|---|
| lesson | `ca6d4ff8c3c7b41d4a4f89cfc7ca20fbf55c356e5b711111b142874bdfdd029d` | `ccbfc68022d616738022aa32f439a397ca06489c8d08b6a6bdbca8726a4fb990` |
| exercises | `5da3d2035680d759baaf2c731f1280817f12248fabef3e8fd0e35373c8567067` | `867f96e00e2596cab8f50e798eeb564fda25a3099cdb4d5ba2408ca66597d199` |
| figures JSON only | `9278be9c33d1a12cb643e97302e92fdb618d638f724af703ebb231c8bd0a71d1` | `9278be9c33d1a12cb643e97302e92fdb618d638f724af703ebb231c8bd0a71d1` |

Both template `source` objects are identical to FIRST, including the
embedded raw snapshots. They equal the existing raw JSON objects and bind
to actual raw file hashes:
lesson `acc0a3837f8e83d19105f04c0b1f2af638ef412414fe73306082dd2eadc6e4a5`;
exercises `6b344ad5fe8784371f85081f42290c1e3f3620a9c60e98802a8c9db29170f0c0`.
Affected `source_text`, source references/pages, numbering, grouping,
figure references, numeric-change declarations and existing metadata are
unchanged. All original question tasks and data remain; `lines.join("\n")`
equals each affected question's full `text`.

Changed JSON paths are only selected prose `text` and appended
`changes/1 = physics-clarification`; selected exercise `text`, appended
`lines/1` and `changes/1`; and the two `section_breaks` entries.
Replacing only these fields with FIRST values in memory reproduces the
entire FIRST file byte-for-byte. Both original and candidate serialization
were checked against their actual UTF-8 bytes, including final newline.
This is a read-only identity check, not a production parser or normalization
rerun. No unauthorized difference was found.

The affected formula and inline parameter tokens are unchanged:
`|\vec{F}_{\text{摩}}|=\mu|\vec{N}|` and `\mu`.
The unchanged immediate `/prose/4` definition retains
`\mu=\frac{|\vec{F}_{\text{摩}}|}{|\vec{N}|}` and its inline `\mu`.
Vectors remain inside magnitude bars; the ratio requires nonzero normal
load. Numeric tokens match FIRST in order, including the figure reference
`114`, all three example values and both questions' original data.
No registered formula correction or source erratum was introduced.

## Observed Boundaries

Only `T/tmp/b83-n65-raw-and-text/b88-friction-affected-layout.stdout` was
used for production paragraph identity; SHA-256:
`f418855e6ac9e6acc08285ed03090f4cf9b06c34c3bfd4ecd0bf7ad4d9d4cda5`.

- Adjacent `5/6`: `/prose/2`'s accelerating-push example ends the motion
  discussion; `/prose/3`'s actual first final paragraph begins the empirical
  magnitude/coefficient discussion. Both complete anchor strings match
  the saved paragraph texts exactly.
- Adjacent `10/11`: `/prose/5`'s starting-limit caveat ends the example;
  the unchanged first paragraph of `/prose/8` starts the contact-pair
  properties discussion. Both complete anchor strings match exactly.
  This is paragraph adjacency from the observed flow, not prose-block
  adjacency inferred across the intervening figure/caption.

The capture reports 18 paragraphs, with empty `resolvedBreaks` and
`boundaries`. It predates the copied anchors; these empty arrays are not
claimed as successful post-edit boundary validation.
The review checked anchor equality and adjacency directly against the
saved paragraph inventory, without generating a new inventory, running a
validator or making any renderer/DISPLAY claim.
No new scientific verdict is assigned to the unaffected general area,
position or table statements.

## Saved Authority And Preservation

No fetching or archive expansion occurred. Recovery provenance binds the
recovered FIRST templates and both local primary captures; actual hashes
match its recorded seals. Scientific conclusions above were independently
reasoned from those captures, not adopted from the author's verdict.

| Existing record/capture | Actual SHA-256 |
|---|---|
| FIRST sliding-friction review | `91a791ccdfc5c7103ab0da4ae4ca0b0b3c758c837f428aaa5ce91ede4bb8a999` |
| Scoped repair record | `4ceda62590c98870bb1f3f6b66ee1229b557cb72ec04a932b8ebc674a8eb4bb9` |
| Author sealed receipt | `451afba2ff640a21d49eb548facf2cc4291cd2502505b00ffb2aedce246296bb` |
| Recovery provenance | `e827c4c0d67993fe9c2edaf1414ab622a124c656b9895bc038acc85473c54efb` |
| Saved OpenStax friction text | `ff6d839a5c75ce35f28037d3d7f645eba066bbfe976093edff5fd5ff49d28f90` |
| Saved NASA Newton text | `cbb7e1607b1627612f86fd4dc1e6d2f9e583da7405d97b0b53b231d0587b1086` |

The receipt records actual commands, hashes, affected checks and boundary
text hashes. Three initial root-level `tmp/...` reads failed with missing
paths; the existing files were located under `T/tmp/...`. This was a
read-only path correction, not production recovery or a scientific round.

Only this report and its receipt were written. Candidate, raw, approved,
FIRST and other workers' files were not edited. Actual image/OCR/source-pixel
access, figure generation and figure approval: **ZERO**. The figures JSON
was hashed for identity only; no image asset was opened or decoded.
No freshness/setup/backend replay, other-chat/supervisor actions, parser,
normalization, pipeline, finalize, answers, choices, DISPLAY, Git, DB, app,
dependency, publisher or publication action was performed.
This affected TEXT PASS releases none of those stages. STOP.
