# B86 Affected-Only SCIENCE Review: s18-t1 And s22

2026-11-19, Europe/Dublin. STEMROBIN-180, existing cap3 session180-3.

**REVISE, bounded to two prose fields and four normalized boundary sides.**
Seven affected prose fields PASS SCIENCE; all nine declaration fields PASS.
The exact 22-pointer delta and protected-field invariants PASS.
Neither lesson receives an unrestricted or integration PASS.
No candidate, prior report, source, shared session record or pipeline tool changed.

## Findings

### s18 prose3: Unknown Panel Intent Is Stated As Fact -- REVISE

Candidate `/prose/3/text`, source refs `p0082#9,p0083#1`,
[line75](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-science-repair/candidate3/phy6-c3-s18-t1/lesson.template.json:75).

The settling and recoil qualifications are scientifically appropriate.
The remaining sentence says "图 61，b 表示卸载后的理想状态".
That is an unqualified assertion about what the panel represents.
The source's intended panel-b observation/model and timing remain UNKNOWN;
neither a raster nor its missing exact authoritative spec was available to this review.
Adding `physics-clarification` records an adaptation but does not, by itself,
turn a statement about the original panel into an expressly chosen teaching model.

Required bounded change: identify any unloaded/relaxed state as this modern
discussion's idealization, not a verified fact about the original panel.
Keep the a/b references and the non-instantaneous recoil distinction.
Do not infer a measured observation time, damping, relaxation before landing,
or what the raster actually depicts. No figure reopening is needed or requested.
This is a source-uncertainty boundary finding on the new prose, not a FIG verdict.
The earlier diagnosis's suggested sentence is not binding scientific approval.

### s22 prose0: Rest Is Made Necessary For Force Balance -- REVISE

Candidate `/prose/0/text`, source refs `p0092#17,p0093#1`,
[line16](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-science-repair/candidate3/phy6-c3-s22/lesson.template.json:16).

The main-external-force limitation, water-reaction propulsion explanation and
retained saw/ship/spring examples are sound in their stated scope.
The final clause says "物体静止且处于平衡时，它们才大小相等、方向相反".
The "才" formulation makes rest a necessary condition for the two forces to balance.
Equal-and-opposite forces constrain acceleration, not instantaneous velocity;
force balance can occur while a body is moving. This reinstates the
velocity/acceleration confusion that the spring clarification must remove.

Required bounded change: express the resting equilibrium case as sufficient,
not necessary; retain that stretching alone does not establish equilibrium.
No formula, worked example, exercise answer or additional apparatus premise is needed.

### Four Normalized Literal Anchors -- REVISE

The parent's report of `normalize_lesson_layout` preceding `prose_flow_contract`
made a structural-only normalization check necessary. Its claimed producer
exit2 is context supplied by the parent, not a producer run repeated here.
Reading the existing functions confirmed the order and literal equality contract.

Only the six textual neighborhood blocks were passed to the existing
`edition.normalize_prose_layout`: s18 indices `2,3,6,8`; s22 indices `0,1`.
Indices2/6 were structural neighbors only, not new SCIENCE or TEXT review objects.
No `normalize_lesson_layout`, whole lesson parser, producer or finalizer ran.
The existing `htmlfrag.js` outline/section-break functions then checked only
the three projected neighborhoods, retaining each candidate pair.

| Candidate / Pointer | Normalized Literal Failure | Verdict |
| --- | --- | --- |
| s18 `/section_breaks/1/after`, [line400](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-science-repair/candidate3/phy6-c3-s18-t1/lesson.template.json:400) | Raw anchor includes all prose3. The first normalized right paragraph ends at `挂好物体后，弹簧可能先上下振动；`; the following material is another paragraph. | REVISE |
| s18 `/section_breaks/2/after`, [line404](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-science-repair/candidate3/phy6-c3-s18-t1/lesson.template.json:404) | The first normalized right paragraph ends at `近似失重状态；`; the final gravity clause is a separate paragraph. | REVISE |
| s22 `/section_breaks/0/before`, [line137](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-science-repair/candidate3/phy6-c3-s22/lesson.template.json:137) | The normalized last left paragraph contains a literal newline after `一定相等；`; the candidate anchor does not. | REVISE |
| s22 `/section_breaks/0/after`, [line138](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-science-repair/candidate3/phy6-c3-s22/lesson.template.json:138) | The normalized first right paragraph contains a literal newline after `整体的平动；`; the candidate anchor does not. | REVISE |

Each projected boundary contract returned:
`section_breaks[0] must identify exactly one adjacent paragraph pair; matched 0`.
The local projection index0 maps to original s18 boundary1/2 or s22 boundary0.
All four changed sides fail independently; raw equality with author-selected
strings does not establish normalized contract validity.
The retained s18 before sides are not defective or newly science-reviewed.

Structural REVISE does not revoke SCIENCE PASS for s18 prose8 or s22 prose1.
Likewise, a mechanically correct replacement anchor would not remove either
of the two prose findings above. The parent owns any actual repair;
this review has not written replacement strings into a candidate.

## Exact Bindings

Candidate root:
[candidate3](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-science-repair/candidate3/).
Both lesson comparisons used the retained author FIRST copies, not reopened
original RAW lessons, source packages, scans or figures.

| Input | Bytes | SHA256 |
| --- | ---: | --- |
| s18 candidate lesson | 20248 | `fb3c99004996ff511698569ef18261791c36bb58f42b637a8bd9ba7b5c808a75` |
| s22 candidate lesson | 6965 | `3033cac12b181d3edd7c8b47ab005fe3e41d483c2b5f32bffbc365fd12f134c7` |
| candidate manifest | 34841 | `130e2a47bbe8fcc602fd99d9ef752b68776ab0a7b038a20e411ebacbe6af196c` |
| s18 FIRST lesson | 18428 | `38b5179aa3d0616061458de5ac8e8511495612fb672eb69beb71a383ef84e9f5` |
| s22 FIRST lesson | 5990 | `809065c8c7ff3c763f2fe007d5713c5de3bef6e360f0e9dfcd21ad5e8a2ad913` |
| prior SCIENCE diagnosis | 18672 | `f20867c1017fbcaee47477adaa172d27f16bd5d70706b3fc920fc6f81004ac5e` |
| author repair report | 8941 | `5465f27577cbb63a97d668a099833693ea8e9a25a5a4baf724816897a37a1394` |

All exact paths and additional input/tool hashes are in
[independent-evidence.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-affected-review/independent-evidence.json).
Author `exact-delta.json` SHA is
`dc8906cfa50e5ea4bd716d7d5b3a5f7fa7ac8ea4e590182202678a5effd15577`;
`selected-boundaries.json` SHA is
`56bd16d9f9e9c6025b364acc767cae96fb35099b3ac1125f97a063ee3119c6df`.

## Exact Scope Verdicts

Only these newly changed fields are reviewed. The reasons below are elementary
conditional mechanics/fluid statements, not new source facts or task solutions.

| Candidate / Prose Text Pointer | SCIENCE | Reason |
| --- | --- | --- |
| s18 `/prose/0/text` | PASS | Shared ideal joint-fall boundary excludes thrust, significant drag, local gravity differences, rotation and additional pushing; actual flight is called approximate. Both exploration questions remain. |
| s18 `/prose/3/text` | REVISE | Correct settling/recoil conditions; unsupported definite panel-b meaning remains as described above. |
| s18 `/prose/5/text` | PASS | Transient spring interaction is retained; zero support/suspension weight with nonzero gravity is expressly limited to a relaxed ideal common-fall state. No guarantee of actual settling is asserted. |
| s18 `/prose/8/text` | PASS | Orbital continuous fall remains; zero ordinary load is an explicitly local nonrotating/unforced approximation, not absence of gravity. Read with the retained affected prose5 transient qualification. |
| s18 `/prose/11/text` | PASS | All six examples retain physical qualifications: force/initial-motion limits, nonzero pressure and possible flow, surface/wetting/shape effects, pendulum motion, limb inertia, cabin directions and short-time/small-region nonrotating relative motion. No actual fluid or cabin conditions are claimed. |
| s22 `/prose/0/text` | REVISE | Main-force and ship-reaction additions are sound; the resting-only balance condition is not. |
| s22 `/prose/1/text` | PASS | Resultant equivalence is limited to a point mass/overall translation, excluding full rotation/deformation equivalence. |
| s22 `/prose/2/text` | PASS | The emphasized definition independently retains overall-translation scope. |
| s22 `/prose/3/text` | PASS | Addition includes direction, applies to forces on one body and does not add a further physical force. No wall-response or material-linearity law is invented. |

**Declaration PASS, exact pointers:** s18 `/prose/{0,3,5,8,11}/changes`;
s22 `/prose/{0,1,2,3}/changes`. Each is its previous string array, in the
same order, plus exactly one appended `physics-clarification`.
No clarification is mislabeled solely as layout. This declaration-only PASS
does not approve the two REVISE texts.

**Structural REVISE, exact pointers:** s18 `/section_breaks/1/after`,
`/section_breaks/2/after`; s22 `/section_breaks/0/before`,
`/section_breaks/0/after`. Normalized anchor PASS count is zero.

## Independent Delta And Protected Invariants

One new structured comparison independently derived the full old/new delta from
FIRST versus candidate bytes before consulting the recorded deltas for equality.
String-array `changes` is compared as one field pointer, matching the manifest's
field-level convention, not as an appended array-element pointer.

The exact set is **s18 12 + s22 10 = 22**:
nine `/text` fields, nine `/changes` arrays, and four boundary sides.
Full before/after values match both the manifest delta and author evidence delta;
there are zero unauthorized changes or protected-tree failures.
Removing only those authorized field values leaves two deeply identical lesson trees.
Thus source data/text/refs, identities, kinds, metadata, historical declarations,
numeric declarations, formulas, figure metadata, untouched prose and other
boundary sides remain unchanged. This is not a renewed RAW/TEXT comparison.

s18 retains13 prose positions and3 boundaries; s22 retains4 prose positions and
its one existing boundary. s18 boundary0, boundary1/2 before sides and all eight
untouched prose positions are protected and equal. This includes the four
previous SCIENCE-PASS prose positions and four nonphysical positions.
The camera-collision account and its historical declarations are unchanged,
not historically verified again.

The two exercise templates and two figure scaffolds were compared only as
opaque bytes, not opened as tasks, artwork or source facts: four identical files.
s18 has zero written tasks; the two s22 tasks and both prior task PASSes are
reused without a new review or answer. This opaque preservation check is not FIG work.

## Reuse And UNKNOWNs

Prior full TEXT-fidelity and old passed-boundary evidence is reused, not replayed
or reissued for these new normalized strings:
`modern-text-review-c3-s15-s18t1.md`, SHA
`1474fbc2d464a5dcb04650e1bbac53cdfc4486d32ff1bec127d24ecf0f1cf3ed`;
`modern-text-review-c3-s22-s25.md`, SHA
`9ec8650bc20917417897004d0141af4b0f6de9c91692c5fbc67b3f63b45c7026`.
The retained four s18 SCIENCE-PASS blocks and two s22 task PASSes are not counted
among the seven new affected prose PASSes.

Still UNKNOWN: actual recoil duration, damping and observation timing;
whether relaxation occurs before landing; the intended source panel-b model;
cabin attitude/rotation and initial relative motion; container shape/wetting,
pressure differences and existing flow. Zero source/apparatus UNKNOWNs resolved.
Model conditions are not raster measurements. The prose3 finding specifically
prevents an unknown panel intention being relabeled a verified ideal-state fact.

FIG61's separate missing exact old spec/authoritativeText and historical dependency
remain unresolved. No new FIG61 approval is issued. FIG62 approval is reused
untouched; no artwork, image or figure rendering was opened.

## Actual Counts And Evidence

| Newly Judged Field Set | PASS | REVISE |
| --- | ---: | ---: |
| s18 affected prose texts, 5 | 4 | 1 |
| s22 affected prose texts, 4 | 3 | 1 |
| Physics-clarification declaration fields, 9 | 9 | 0 |
| Normalized boundary sides, 4 | 0 | 4 |
| Total changed fields, 22 | 16 | 6 |

Actual new SCIENCE review rounds:1 across two courses; affected prose judgments9,
new prose PASS7 and REVISE2; new written-task/figure judgments0.
The exact-delta/protected-invariant result is a separate scoped mechanical PASS,
not an additional science-object verdict.

Actual structural execution: one scratch-check Node process, exit0; one Python
normalization child, exit0, no stderr; six top-level supplied-text calls to
`normalize_prose_layout` (its own recursion is intrinsic, not extra review rounds);
four strings changed by normalization. Three two-block neighborhoods expand to
nine paragraphs, three per neighborhood. Three explicit `proseOutline` calls
and three `sectionBreakIndices` calls ran; each contract internally builds its
outline. All three literal-pair checks failed with matched0, caught and recorded.
No `prose_flow.mjs` CLI, `proseFlow`, `normalize_lesson_layout`, whole producer,
or passed-stage review/parser was replayed.
Exit0 means the scratch evidence recorder succeeded, not that the anchors passed.

Evidence, all within the sole owned scratch directory:

- [independent-check.mjs](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-affected-review/independent-check.mjs): independently failing hash, delta and protection assertions; affected normalized contract checks.
- [normalize-affected.py](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-affected-review/normalize-affected.py): six-string-only existing normalizer wrapper.
- [normalization.call.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-affected-review/normalization.call.json): exact executable, argv, cwd, six-string input, exit/signal/stderr.
- [normalization.output.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-affected-review/normalization.output.json): exact raw/normalized strings and changed flags.
- [independent-evidence.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-affected-review/independent-evidence.json): all bindings, full independently derived22-pointer old/new delta, declarations, protected invariants, exact normalized pairs, failures and counts.
- [final-seal.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-affected-review/final-seal.json): final unchanged-input hashes and owned output bindings; no review replay.

Every shell and the sole child cwd was explicitly
`/Users/yong/.codex/worktrees/0f12/lemmadeck`.
The Python child used `-B`/`PYTHONDONTWRITEBYTECODE=1`; no dependency or tool file
was written. Manual files used `apply_patch`; generated evidence used exclusive
creation. Only this report and its owned scratch directory were written.

Source reopening/solve, new full TEXT/source review, author repair, canonical/index,
figures/images, answers/choices, setup/freshness/backend, Git/publish/DB/services,
paid/browser/web calls, descendants/messages/app, dependency/official-tool changes
and downstream integration: all0. Historical reports and candidates remain sealed.

**STOP. Parent-owned repair only; no repair or passed-stage replay authorized here.**
