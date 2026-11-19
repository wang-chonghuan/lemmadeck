# STEMROBIN-180 B85: Independent Affected-Only TEXT Review

Date: 2026-11-18. Existing cap3 invocation; no setup or freshness action.
Workspace R: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Review scratch S: `R/.intentfold/tickets/STEMROBIN-180/tmp/b85-zero-summary-review/`.

**t12: PASS for the nine affected TEXT blocks. t13: REVISE for two affected emphasis arrangements; its repaired science passes.**
These are hash-bound, affected-only dispositions, not new whole-course, SOURCE, FIG, answer, rendering, gate or release approvals.

## Remaining Essential Finding

### E1 [P2]: Moving The Closing Marker Does Not Address The Recorded Vector-Formula Cause

Target: `phy8-c2-s2-t13`, `/prose/3/text` (`p0171#2`) and `/prose/5/text` (`p0171#4`).
Candidate SHA-256: `07ca18a2ee2f2be2da7d4207218870545d33ad4d15123197741a61480a300382`.

The original B57 report explicitly records that these two spans fail even when the raw text is passed through the same inline renderer: newlines in generated vector-formula HTML prevent the italic match. That is a distinct cause from the friction paragraph's detached closing delimiter.

Both B85 substitutions only remove the LF immediately before the closing `*`. Both still put their entire vector-bearing formula inside the same `*...*` span. The opening marker, formula payload and formula-within-emphasis arrangement are unchanged. The submitted edit does not address the original recorded cause; balanced source markers alone cannot overturn that specific HOLD.

This conclusion compares the affected substitution to the preserved original finding. It is **not** a new renderer run or a claim to have observed the current HTML or pixels. No new rendering prerequisite is being invented.

Concrete text-only fixes, not applied:

1. `/prose/3/text`: close the prose emphasis immediately after the sentence preceding the formula, before the existing LF. Keep `$|\vec{F}|=G\frac{m_1m_2}{r^2}$` and its punctuation unchanged on the formula line, outside that emphasis span. Remove the now-superfluous final closing marker. Structure: `*<unchanged introductory sentence>*` followed by LF and the unchanged formula/punctuation.
2. `/prose/5/text`: replace the one formula-crossing emphasis span with two prose-only spans. Close the first immediately before `$m|\vec{g}|$`; reopen immediately after that formula and close at the existing sentence end. Structure: `*<unchanged prose prefix>*$m|\vec{g}|$*<unchanged prose suffix>*`. Keep all prose, the conditional approximation, formula bytes and punctuation unchanged.

These fixes keep the mathematical expressions and source prose; the math remains mathematical typesetting rather than being enclosed in a prose-emphasis match. Do not remove vector arrows, magnitude bars or a scientific condition to work around emphasis. No tool change, renderer claim, new author round or follow-on action is authorized by this report.

## Exact Input Binding

Both candidate files were hashed once over their actual bytes, in the same read that selected the affected fields. Both matched the human-supplied SHA-256. No approved input/stage was revalidated.

| Target | Immutable candidate under `R/.tmp/ld-s10y-lesson/b85-zero-summary/candidate/` | Bytes | Actual SHA-256 | Affected TEXT verdict |
| --- | --- | ---: | --- | --- |
| t12 | `phy8-c2-s1-t12/lesson.template.json` | 18276 | `ef1ff73f7b820ea43933403bdb2a275f3a0f3c378ccb5dcb5ceacf2fac6659b4` | PASS |
| t13 | `phy8-c2-s2-t13/lesson.template.json` | 8277 | `07ca18a2ee2f2be2da7d4207218870545d33ad4d15123197741a61480a300382` | REVISE: E1 only |

The original complete reports were read before the candidate changes:

- t12: `R/.intentfold/tickets/STEMROBIN-180/tmp/b85-zero-summary/FIRST/reports/modern-text-review-fourth-summary-b58.md`, original D1-D4 REVISE and 13/13 retention PASS.
- t13: `R/.intentfold/tickets/STEMROBIN-180/tmp/b85-zero-summary/FIRST/reports/modern-text-review-summaries-b57.md`, original Hooke/friction/emphasis REVISE; the other three lessons in that historical report are not this review's targets.

Before/after inputs: the supplied `R/.intentfold/tickets/STEMROBIN-180/tmp/b85-zero-summary/diffs.json` and the two lesson FIRST files under `R/.tmp/ld-s10y-lesson/b85-zero-summary/FIRST/<id>/`.
The recovery report binds the FIRST lesson hashes to `e404d31016433fd7a4475c9e90b0b4f8a0d5fa3c489f6e7279737efface55484` (t12) and `81d93825c7f52a1bfc9cd7264e5ba6a89da47758d7937426a67bb04fe54b8c51` (t13). Those provenance bindings are reused, not rehashed or recovered again here.

## Affected Block Ledger

Pointers and indices are zero-based. All thirteen entire affected before/after prose blocks, their embedded source text, references and declarations were inspected. Only immediate unchanged joints were consulted: t12 indices 3, 5, 7 and t13 indices 1, 4. No whole raw SOURCE or whole candidate TEXT replay occurred.

| Target | Exact text pointer | Source reference | Substantive judgment | Disposition |
| --- | --- | --- | --- | --- |
| t12 | `/prose/0/text` | `p0140#9` | Restricts the motion-change claim to an applicable classical model and inertial frame; adds direction to force magnitude. No claim that each nonzero individual force must cause acceleration. | PASS, D1/D2 |
| t12 | `/prose/1/text` | `p0140#10` | Acceleration now depends on both resultant and mass. The comparison fixes the resultant; inertia remains intrinsic and measured by mass, not a separate accelerating force. No arbitrary interacting-pair acceleration ratio is asserted. | PASS, D1 |
| t12 | `/prose/2/text` | `p0140#11`, `p0141#1` | Keeps the inertial-frame concept while explicitly restricting predictions to an applicable classical model. It no longer offers the choice of frame as a cure for every physical regime. | PASS, D2 |
| t12 | `/prose/6/text` | `p0141#5` | The bold second law names the vector sum of all external forces on the selected body, constant mass and inertial/classical scope. Acceleration follows the resultant, not necessarily velocity. Individual gravity/support forces are not each equated to the actual total mass-times-acceleration. | PASS, D1 |
| t12 | `/prose/8/text` | `p0141#7` | Keeps equal, opposite, same-interaction reciprocal forces and explicitly assigns them to different bodies. They do not cancel in one body's force sum; equal reciprocal forces alone do not imply equal accelerations. | PASS, D3 |
| t12 | `/prose/9/text` | `p0141#8` | Withdraws universal solvability and says Newton's laws do not supply interaction laws by themselves. Known mass and a resultant-force law replace knowing only an instantaneous individual force. Read with the next affected block's initial data. | PASS, D1/D2 |
| t12 | `/prose/10/text` | `p0141#9` | Preserves force-to-acceleration-to-velocity/displacement/coordinates in a constant-mass point or center-of-mass translational model. Position and velocity refer to the same initial time and inertial frame; rotation/deformation require their own model/data. No constant-acceleration restriction is invented. | PASS, D1/D2 |
| t12 | `/prose/11/text` | `p0141#10`, `p0142#1` | Retains the spacecraft application as prediction from modeled forces and measured/estimated initial data, not exact future knowledge. Distinguishes approximate fixed-mass coasting from propellant-expelling propulsion and requires consistent mass/exhaust/thrust accounting. It neither supplies an incorrect open-system momentum equation nor instructs double-counting thrust. Numerical computation is usual for complicated actual models, not necessary for every variable force. | PASS, D4 |
| t12 | `/prose/12/text` | `p0142#2` | Keeps the closing velocity/acceleration/force objectives with model/data qualifications. Mass and acceleration determine the resultant; decomposing individual forces needs interaction models and conditions. | PASS, D1/D2 |
| t13 | `/prose/2/text` | `p0170#13`, `p0171#1` | Adds linear-elastic, small-deformation applicability without demanding continuing deformation. Preserves the signed restoring component `$F=-kx$`, not a negative force magnitude. The paired markers enclose the revised text without a detached closing paragraph. | PASS science and textual markers |
| t13 | `/prose/3/text` | `p0171#2` | Formula/model physics PASS is reused. Removing only the closing LF leaves the known vector-formula-crossing emphasis arrangement intact. | REVISE, E1 |
| t13 | `/prose/5/text` | `p0171#4` | Near-Earth magnitude/approximation physics PASS is reused, including the small-height condition. Removing only the closing LF leaves the known vector-formula-crossing emphasis arrangement intact. | REVISE, E1 |
| t13 | `/prose/6/text` | `p0171#5` | Static/sliding refer to relative contact slip. Static friction opposes impending slip; sliding friction opposes actual slip, not necessarily laboratory-frame motion. Static friction responds while the no-slip case applies; the text does not promise unlimited static balance. The empirical sliding approximation identifies surface/normal-force dependence and approximate speed independence. Both separated text units have their own paired markers; neither closes with a delimiter-only paragraph. | PASS science and textual markers |

The t13 friction edit does not claim that friction can be inferred from zero relative speed alone. Its responsive-static statement is read with the explicit no-relative-slip condition, not as an unrestricted force law. No new coefficient, threshold number, formula or exercise is required for this short summary.

The t12 propulsion sentence is a model-consistency qualification, not a derivation: exhausted momentum and thrust describe related accounting and must not be added twice. The numerical-computation conclusion is retained with practical, rather than logical-necessity, wording.

## Fidelity And Reused Approvals

The thirteen inspected affected blocks keep their original embedded `source_text`, ordered `source_refs`, numeric-change records and historical declarations. The three affected t13 math payloads remain exactly `F=-kx`, `|\vec{F}|=G\frac{m_1m_2}{r^2}` and `m|\vec{g}|`; t12 adds no mathematical payload. Signed restoration, vector arrows and gravity magnitude bars are retained. Scientific qualifications correct overgeneralization without changing the source snapshot or inventing a source erratum.

The existing recovery integrity result, not a new comparison loop, is reused for the complete unchanged source snapshots, all other fields, numbers, historical declarations, empty task/figure arrays and candidate draft status. The manifest reports thirteen text substitutions and eleven changes-list substitutions. Their paired `/prose/<index>/changes` pointers carry the supplied `physics-clarification` additions; t13 indices 3 and 5 remain layout-only.

Unchanged original whole-TEXT local PASS findings remain in effect. In particular t12 indices 3, 4, 5, 7 and t13 indices 0, 1, 4 are not newly approved or revised. Original full-retention results are preserved; this affected review does not reissue them.

Existing t12 SOURCE PASS for the heading/body through `p0142#2` and t13 SOURCE PASS for the heading/body through `p0171#5` are reused exactly as scoped by the recovery report. No source-page text, pixel, crop, raw lesson file or authoritative transcription was reviewed anew.

**n38 is excluded.** Its unchanged UNKNOWN/HOLD remains as supplied; no candidate, measurement investigation, review, repair or new disposition was made for it.

## Scientific Reference Evidence

Discovery searches returned no usable result content. Actual reference evidence is the rendered text fetched once per page through `cloak-fetch`; all four returned HTTP 200/exit 0, with empty stderr. Only relevant scientific passages were read. No image or screenshot payload was opened.

| Ref | Authoritative primary educational source / relevant scope | Captured file under S | SHA-256 |
| --- | --- | --- | --- |
| P1 | NASA Glenn, Newton's Laws of Motion: resultant, constant-mass form, different-body reciprocal forces | `nasa-newton.stdout.txt` | `9218076267b8173683ebf8572e92304fede1304cf76f707eeaca07c9653f63e9` |
| P2 | Caltech, The Feynman Lectures on Physics I-9, sections 9-1 and 9-4 to 9-7: mass/inertia, vectors, force models, initial data and approximate numerical trajectories | `feynman-dynamics.stdout.txt` | `5070cb08cc0a9dd9417751253912041c601c3c2c71bf01f418a80908dda8a3fc` |
| P3 | OpenStax, University Physics Volume 1, 6.2 Friction: relative contact motion, responsive bounded static friction and empirical sliding models | `openstax-friction.stdout.txt` | `ff6d839a5c75ce35f28037d3d7f645eba066bbfe976093edff5fd5ff49d28f90` |
| P4 | OpenStax, College Physics, 5.3 Elasticity: small-deformation/linear range, not all elastic response | `openstax-elasticity.stdout.txt` | `68921b47e17d492e1eb557346fffe1909f38a77de23e7d060dcc2c009394e084` |

Exact URLs, command arguments, explicit cwd, start/end timestamps, exit codes and stream hashes are in the matching `.receipt.json` files. General-model/non-cancellation/propulsion implications are reviewer reasoning applied to the submitted text and original findings; historical computational speeds and NASA's simplified individual-force wording are not adopted as new teaching.

## Limits And Counts

- Author repair rounds already consumed: t12 **1**, t13 **1**. Additional repairs in this review: **0**. No count reset or second round; REVISE is returned for the authorized caller's decision.
- Images authorized/opened: **0/0**. Image generation, paid/model-service calls and service retries: **0**. Public text fetches: **4**, once each, no retries. Billed model usage is unavailable, not asserted to be zero.
- Only this new report and S were written. FIRST, candidates, original reports, canonical source, product tools and other agents' files were untouched.
- No setup/freshness, source/pixel review, prepare, finalizer, index, render/proseFlow, test/build, Git, environment, DB, publisher, payment, message, ticket update or agent-descendant operation occurred.
- No FIG, answer, gate, final paragraph count, actual emphasis rendering, UI, modern-ready, finalization or publication result is claimed. No dependent stage was started.

Machine-readable dispositions: `S/review-ledger.json`. `S/review-seal.json` binds this report and the new evidence outputs externally, without rehashing candidates or approved stages.

**Final affected-only disposition: t12 PASS (9/9); t13 REVISE (2/4, E1 at indices 3 and 5), with repaired Hooke/friction science PASS. Zero images.**
