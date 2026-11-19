# STEMROBIN-180 C/180-4: n160 Limited FINAL b91

Verdict: **LIMITED FINAL REVISE**. This is a comparison of six disclosed answers, not whole-lesson/course or official production approval.

## Finding

**[P2] Q1 adds an unsupported apparatus detail.** Candidate `displayAnswer` at [line 14](/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck/.tmp/ld-s10y-lesson/resume-180-4-n160/author-answer-candidate.json:14) says `并通过开关和可调电阻接入电源电路`. The approved seed prose and frozen independent solution supply the suspended powered conductor, magnet poles, circuit closure and no-magnet control, but no adjustable resistor. The literal `可调电阻` is absent from both approved reference texts. With no bound figure evidence and an image budget of zero, this review cannot authenticate that extra apparatus detail.

Minimal author revision: remove `和可调电阻`, leaving `并通过开关接入电源电路`. Retain the displacement, no-magnet control and parallel-direction qualification. No author edit was made.

This is a source-boundedness finding under the authorized text-only/no-new-facts scope, not an assertion that such a resistor would make an experiment physically invalid. The core Q1 solution covers its five frozen facets; the unsupported addition is a separate blocking finding. No change to the SOURCE freeze is needed.

## Actual Comparison

| Question | Frozen Facets Covered | Limited Result |
| --- | ---: | --- |
| Q1 | 5/5 | REVISE: unsupported extra hardware only |
| Q2 | 5/5 | PASS: both directional dependencies, separate reversals, parallel zero-force limit |
| Q3 | 4/4 | PASS: modern initial condition, vertical-axis rotation, perpendicular-plane equilibrium, inertial qualification |
| Q4 | 6/6 | PASS: prior inertial passage, necessary reversal timing, subsequent half-turn repetition, original direction, power supply; no guaranteed self-starting at equilibrium or permanent motion |
| Q5 | 2/2 | PASS: commutator and automatic winding-current reversal |
| Q6 | 9/9 | PASS: construction 4/4 and operation 5/5, not merely a construction description |

Actual totals: 6/6 full display answers compared; 6/6 full prompts matched; 31/31 frozen required facets covered; 7/7 response components covered; 5 questions limited PASS and 1 REVISE; 1 blocking sourcing finding; 0 missing or duplicate questions.

Facet coverage is semantic, not literal-string answer matching. The evidence records 27 direct matches and 4 semantic/contextual matches:

- Q1-F5's negation of nonzero parallel force is equivalent to the frozen modern qualification.
- Q4-F1 uses the previous-question reference: Q3 supplies the moving initial frame and Q4 expressly rejects guaranteed equilibrium-at-rest self-starting.
- Q4-F5's current-dependent turning action is equivalent to the frozen force-direction account.
- Q6-O4 gives contact exchange, current reversal, inertial passage and continued original rotation; the candidate's Q2 explicitly supplies current-to-force reversal. This contextual link is recorded openly, not represented as an extra sentence in Q6 or filled from its notes.

Q2's simultaneous-reversal sentence is a corollary of its already-frozen single-reversal relations, not a new external source claim. Qualitative turning-moment wording adds no formula. Q6's F/E and D-to-C/A-to-B sequence matches the frozen textual corroboration; no image was viewed and labels are not newly required facets. Fixed-brush wording is consistent with the frozen exchange of rotating half-rings against the same brushes; no brush geometry is inferred.

## Metadata

- Candidate hash: `90a4d966217aac671fb6a8d8da973c6edf3cfeb16890834acc8a0415f489b38b`.
- Schema: `ld-s10y-answer/lesson-answers@1`; book `7p`, lesson `phy7-c2-s4-n160`, edition `modern-us-neutral`: 3/3 identity fields match.
- Ordered unique exercise IDs `1` through `6` and complete prompts match the frozen independent solutions and approved seed: 6/6 each. Group/source-number identity is supplied by the unambiguous frozen join, not claimed as an extra candidate field.
- `source=derived`: 6/6; `grading=ungraded`: 6/6; `parts=[]`: 6/6; `figureEvidence=[]`: 6/6; `historical_entities=[]`: 6/6; no `bookRaw`.
- Empty automatic parts are appropriate for these explanatory ungraded responses. Q6's two response components were assessed separately in its full display text; empty parts do not excuse omitted content.
- Candidate status remains `draft`; no status promotion or automatic-input validation is claimed. Notes were read but were not used to repair display-answer content.

## Freeze And Scope

All four FIRST SOURCE files retain their exact prior hashes and mode `0444`:

| FIRST SOURCE File | SHA-256 |
| --- | --- |
| Report | `d98496a194a67f6e5b43ba90756cbc2c0e7671643d1e61dadc4afdc5ecfcb10f` |
| Independent solutions | `9234e2196aaa9385f6a9d2f35b469f45cdee37b4c9308f17fb79ae2b5ba641b3` |
| Coverage | `5c12a0017bb6ab313bda650dd0e896159156651731c7566a43e82bbe868c54b1` |
| SOURCE hash freeze | `08e44ad49ede7f6b416b404421e22a8b25a70de0e163e5c5b46aa0c606390477` |

Complete candidate snapshot, all 31 facet mappings, full-answer evidence, metadata and finding F1 are frozen in:

`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/answer-review160/final/candidate-comparison.json`

The report and evidence hashes, plus the candidate, seed and four prior SOURCE hashes, are recorded in:

`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/answer-review160/final/final-freeze.sha256`

These three FINAL files are frozen readable with mode `0444`; the manifest's own hash is returned separately. FINAL evidence is ticket-local; no new repo-root `tmp` output was created.

Actual images viewed: 0; image budget: 0. SOURCE was not solved again or altered. No author edits, new external facts, image interpretation, renderer/native/finalize/publish, database/backend/Git or other-agent operations occurred.

Stop at this concrete limited FINAL REVISE. This report does not authorize production, whole-course approval or any promotion.
