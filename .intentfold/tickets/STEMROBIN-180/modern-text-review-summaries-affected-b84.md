# STEMROBIN-180 B84: Independent Affected-Only Modern TEXT Review

Date: 2026-11-18. Workspace and explicit cwd for every current shell command:
`/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Existing cap3 continuation; no update, setup, or new capability.

Read the complete `modern-text-review-summaries-b57.md` and `modern-text-recovery-summaries-b84.md` before judging the candidates. The author recovery verdict was not adopted as independent scientific approval. Scope is exactly seven changed `prose[].text` entries and their seven `changes` arrays, with necessary immediate context. Unchanged prose was checked for equality, not scientifically reapproved. No new SOURCE or whole-TEXT review.

## Per-Unit Verdict

| Candidate unit | Affected scientific verdict | Affected fidelity / preservation | Parent disposition |
| --- | --- | --- | --- |
| `phy8-c2-s3-t14` | **PASS** | **PASS** | Only this hash-bound candidate's affected TEXT objections are cleared. |
| `phy8-c3-s1-t7` | **REVISE** | **PASS** | Do not finalize; remaining defect at `/prose/4/text`, with scope inherited from `/prose/3/text`. |
| `phy8-c4-s1-t5` | **PASS** | **PASS** | Only this hash-bound candidate's affected TEXT objection is cleared. |

Parent may finalize only PASS units, subject to its existing gates and authorization. This reviewer finalized nothing and changed no HOLD, status, checkpoint, or usage record. **Original B57 FIRST HOLDs remain historical and unchanged.** `phy8-c2-s2-t13` and its original findings were not reviewed or modified.

## Exact Seven-Entry Assessment

Indices are zero-based. Every listed `text` pointer has exactly the corresponding `/prose/<index>/changes` pointer changed from `["layout"]` to `["layout", "physics-clarification"]`.

| Unit | Text pointer | Approved source | Independent affected judgment |
| --- | --- | --- | --- |
| t14 | `/prose/0/text` | `p0211#6` | **PASS.** Explicit Newtonian applicability and inertial-frame formulation remove the universal claim. Initial coordinates and initial velocity remain stated. The resultant determines acceleration, not instantaneous velocity or necessarily the direction of travel. The trajectory sentence and four emphasis spans remain exact. No new domain threshold or physics lesson is required. |
| t14 | `/prose/1/text` | `p0211#7` | **PASS.** Particle modeling now depends on unresolved size/deformation/rotation details, not a blanket requirement of translation. Center-of-mass motion remains separately describable during rotation. The maintained pure-translation claim is qualified to a rigid body in an inertial frame, zero total torque about its center of mass, and no initial rotation. The force-system couple and initial-state qualifications remove the resultant-line and compulsory-translation errors. |
| t14 | `/prose/2/text` | `p0211#8` | **PASS.** It restricts the objection to unmodified Newtonian motion equations and includes both real forces and frame-dependent inertial terms. Acceleration with zero real resultant and constant relative velocity with a nonzero real resultant are correctly stated as possibilities, not universal assertions. |
| t7 | `/prose/3/text` | `p0230#10` | **PASS for the signed-sum statement itself.** A specified common-axis algebraic sum with opposite rotational senses assigned opposite signs is appropriate for an axial/planar test. The second zero condition and numbered order survive. Its separate unrestricted fixed-axis branch does not, however, justify the full-force magnitude rule in the next entry; see the joint scope defect below. |
| t7 | `/prose/4/text` | `p0230#11` | **REVISE.** Magnitude and sign are distinguished, but full force magnitude times axis-to-line distance is still asserted for the preceding unrestricted fixed-axis model. Fixed-axis rotation alone does not impose the required force-plane orientation. |
| t7 | `/prose/5/text` | `p0230#12` | **PASS.** Stable, unstable, and neutral equilibrium are admitted. Unstable equilibrium still satisfies the equilibrium conditions at the position itself; the small-displacement resultant force or torque is destabilizing rather than restoring. The former categorical nonexistence assertion is removed without changing the approved source transcription or inventing an erratum. |
| t5 | `/prose/1/text` | `p0242#9` | **PASS.** The same constant vector net external force acting over the same duration gives the same vector momentum change. Equal final momenta additionally require equal initial momenta; equality of final momentum with the impulse requires zero initial momentum. The existing `t`, `\vec{F}`, `\vec{F}t` payloads and vector character remain exact. |

## Remaining Scientific Defect

**[P2] `phy8-c3-s1-t7`, `/prose/4/text`, second sentence; source `p0230#11`.**
Exact candidate line: [lesson.template.json:77](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b84-summaries/candidate/phy8-c3-s1-t7/lesson.template.json:77).
The governing scope originates at [line 60](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b84-summaries/candidate/phy8-c3-s1-t7/lesson.template.json:60), `/prose/3/text`, `p0230#10`, in the explicit alternative `或固定轴`.

The second sentence applies its magnitude product to `上述模型`. In general, torque about a specified axis is the component of the vector moment along that axis, not the magnitude of the entire moment about a point. Merely fixing the rotation axis does not make an arbitrary force perpendicular to it.

Reviewer-only counterexample: choose an application point offset from a fixed axis and a force parallel to that axis. The axis and the force's line are distinct parallel lines, so their perpendicular separation and the force magnitude are both nonzero. Nevertheless, the force has zero torque **about that axis**; its vector moment is perpendicular to the axis. The candidate's product instead gives a nonzero axial-torque magnitude. This can falsely reject an axial equilibrium or predict rotation about an axis the force cannot drive.

The signed sum and magnitude product need one consistent force-plane/axis scope, or the axial-component distinction must be respected. This is the unresolved part of the original torque finding, not a demand for a new formula, numerical example, source correction, or expanded mechanics lesson. No replacement prose was authored. The diagnostic in the local evidence uses normalized vectors only to demonstrate the defect; it is not a source quantity or candidate addition.

## Preserved Evidence

The independent, ticket-local [checker](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b84-summaries-affected-review/check.mjs) ran once, exit 0. It does not call the author's verifier or any producer, renderer, gate, or finalizer.
[Integrity evidence and exact affected before/after strings](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b84-summaries-affected-review/integrity.json), SHA-256:
`60944b21eb3fb968bd35482a0cb91143f414c76cbaaa8666c58f916f297adb1a`.

- All **9 FIRST files** match the original B57 byte hashes and counts. All 9 candidates match the B84 final manifest; all 18 files remain `0444`. Six E/F candidates are byte-identical to FIRST.
- The only logical differences are the **7 text + 7 changes pointers** above. All other JSON values, identity, titles, printed titles, pages, schema, edition, draft status, metadata, section breaks, errata, historical declarations, and embedded `source` objects remain exact.
- All canonical raw lesson/exercise hashes and six recovered raw snapshots match their source SHA fields and embedded JSON. All 14 ordered prose/source-reference mappings and `source_text` strings match the existing approved page snapshots. This is binding/preservation verification, not a new transcription approval.
- The nine recovered page MD/JSON/audit files match the hashes in the existing SOURCE reports. Their existing approvals are complete; missing necessary SOURCE approvals: **none**. Existing image evidence is inherited, not reopened or reapproved.
- Unchanged approved blocks are exactly t7 `[0,1,2,6]` and t5 `[0,2,3]`: **7 complete blocks**. The entire t14 `[0]` suffix after its first sentence is also unchanged, including the four emphasis spans and initial-condition trajectory paragraph.
- Ordered math payloads and ASCII numeric tokens are exact in every prose entry. The only math payloads in these units remain `t`, `\vec{F}`, `\vec{F}t`. All `numeric_changes` remain empty; `1)`/`2)` and both equilibrium zeros survive. No formula, sign, vector arrow, or source number was altered or added.
- t5's isolated-system total-momentum paragraph and complete bold span are untouched. Newton's source-bound declarations at t14 `[0]` and `[2]` are untouched, with the term retained in source and candidate.
- Four saved historical call/output envelopes retain their recovery-manifest hashes, call identities, and `historical_only=true`, `replayed=false` declarations. The original prepare/author calls and failed-then-corrected retention history were neither rerun nor reset.

The unchanged existing B57 report hash is `2a365fbdccf55a17861977f1c7f3fdd33db513d750739fffb3ad7cab852ba034`.
Reused SOURCE report hashes are `7245b640c46fa1544fe10f77508382d849b6dc9d9ea3a2c72688612ab0a8a5ea` for 0211 and `f86a077da8e52bb95d376750c5e3443be0954201ff1db203cb0fef7bab374751` for 0230/0242. Existing reports and recovered copies are byte-equal. These are reused approvals, not repeated whole approvals.

## Bound Final Nine Files

Candidate root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b84-summaries/candidate/`.
L/E/F denote `lesson.template.json`, `exercises.template.json`, `figures.template.json` under the exact unit directory. These are final **candidate** bytes, not finalized edition outputs.

| Unit | File | Actual SHA-256 | Bytes |
| --- | --- | --- | ---: |
| `phy8-c2-s3-t14` | L | `c625c3224d92d02fa2fc21b2d22ed3271d4d532e592b79f2efd66fc9b7a4f8f4` | 6494 |
| `phy8-c2-s3-t14` | E | `44e8d280a69c9d6653155bb63f53244c0f9d65b86eb17962e83174af008368c4` | 419 |
| `phy8-c2-s3-t14` | F | `5ee22c33449b303f5253e3e465c454b4dfbd4f9ffe366736177c9973b249d616` | 153 |
| `phy8-c3-s1-t7` | L | `6488fa5105e67279453fed35a565082595312b4a7ef7540430be5f8e5bf0871f` | 6688 |
| `phy8-c3-s1-t7` | E | `768f6607c7954e0a4d039f8c99a311d3846576a967fc59b5b582b3d4b8cbb28d` | 416 |
| `phy8-c3-s1-t7` | F | `c56e1e22e5ca5404f47ebcdb7d0f1267053087d998267734568ca93b7e25dba1` | 152 |
| `phy8-c4-s1-t5` | L | `bb29857a0a725fe1ee15dec6cf1cf67fb37896c0c01fad8b7d5056ffae6c3184` | 4378 |
| `phy8-c4-s1-t5` | E | `08b38ae6608fc07608d842115b66f5cccd96745f1f0d3599d7bb0298357bc8ef` | 416 |
| `phy8-c4-s1-t5` | F | `3b973d58e1bf492eae16b48dfd83435427bb87a01577f4a165a42030b892a578` | 152 |

Every absolute FIRST/candidate path, hash, size, and mode is in `integrity.json`'s `manifest`. A verdict does not transfer to changed bytes.

## Physics Basis And Boundary

Read primary OpenStax textbook text through `cloak-fetch`, without screenshots or image inspection: *University Physics Volume 1*, 5.2 (inertial frames), 11.1 (separate translation/rotation), 10.6 (vector torque, common-axis signs and magnitude); *College Physics*, 6.4 (real versus fictitious forces in non-inertial frames), 9.3 (unstable equilibrium); and *University Physics Volume 1*, 9.2 (impulse and momentum change). The axial counterexample is this reviewer's deduction from the vector torque definition, independently calculated by the checker. These references are scientific judgment aids, not new textbook SOURCE approvals.

[Five additional text-read receipts](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b84-summaries-affected-review/reference-reads.json), SHA-256 `39723a50682e06d6a561472b9ea8ad91bcf8b199d213aafa2fba5bbe4947b0c6`, record URLs, status 200, explicit cwd, and rendered-text hashes. The 10.6 read is in this session's successful shell output. An additional guessed Engineering Statics page returned 404 and supplied no evidence.

**Current-review images opened: 0. Generated images: 0. Paid generation calls: 0.**
Summary figures: 0. Exercises/answers/choices authored or reviewed: 0.
No candidate/source repair, prepare, assembly, regeneration, finalization, production validation, rendering, KaTeX invocation, Git, DB, service operation, descendant, message, or publication action occurred. No whole approval was repeated.

Only this report and files below
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b84-summaries-affected-review/`
were written. Other workers' files were preserved. No owned command session remains running at completion.
