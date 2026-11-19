# B86 Repair2 Affected SCIENCE Review: Final Candidate5

2026-11-19, Europe/Dublin. STEMROBIN-180, existing cap3 session180-3.

**PASS: exactly two repaired prose text fields and four normalized anchor sides.**
New SCIENCE prose PASS2 / REVISE0; anchor PASS4 / REVISE0.
Prior seven affected prose PASSes and all nine declaration PASSes are reused,
not reviewed again. This is no whole-lesson, source, figure or integration gate.

The semantic/anchor review was performed once on candidate4.
Final candidate5 has exactly the same JSON values; the already-performed
verdict is bound to its final bytes by a separate byte-only comparison.
Candidate4 and the prior affected REVISE report remain unchanged.

## Exact Final Binding

Final root:
[candidate5](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-science-repair2/candidate5/).

| Final Lesson | Bytes | SHA256 |
| --- | ---: | --- |
| s18-t1 | 19958 | `c72dc797ae9ab15ac82874cf7af5ea9d10bb539aecc2998419e60eb14ec98ac8` |
| s22 | 6969 | `d58f9f2078e702faa076029bd22df18812fc3640c41fcb216981458de240e2ed` |

The reviewed, immutable candidate4 bindings were:
s18 20006 bytes,
`07e47e75e4fc29e08f090233dddd4b755feaae8b9ef52f2ff75a2499ad0cfc38`;
s22 7065 bytes,
`2a9a870b15dc2bc7a3655da25c5699e36acb26ea337ec6eab5263a4efafc19f3`.
The review independently guarded those hashes before assessing the two texts.

The protected-byte baseline is the prior candidate3:
s18 `fb3c99004996ff511698569ef18261791c36bb58f42b637a8bd9ba7b5c808a75`;
s22 `3033cac12b181d3edd7c8b47ab005fe3e41d483c2b5f32bffbc365fd12f134c7`.
No recovered original RAW/source package was reopened.

Author repair2
[receipt.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-repair2/receipt.json)
is7547 bytes, SHA256
`dc3932e7967c229c586e48e218c3a69bc8980ff781e7659e3d6e5ae866fd138b`.
The final
[byte-continuation receipt](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-byte-continuation.json)
and both final lessons are hashed in the new byte-binding evidence.

## Two SCIENCE Verdicts

| Final Candidate / Exact Pointer | Verdict | Independent Reason |
| --- | --- | --- |
| s18 `/prose/3/text`, refs `p0082#9,p0083#1` | PASS | The settling/recoil qualifications remain. The repaired sentence explicitly says `本讲义把图 61，b 作为卸载后理想状态的示意来讨论`, followed by `不据此认定实际弹簧在断线瞬间就没有伸长`. This identifies a modern adopted teaching interpretation instead of asserting a verified original-panel meaning or observation time. |
| s22 `/prose/0/text`, refs `p0092#17,p0093#1` | PASS | `若物体静止且处于平衡，它们便大小相等、方向相反` now gives a sufficient resting-equilibrium condition, not a necessary rest condition. The statement that spring stretching alone does not establish balance remains; no zero-velocity conclusion is inferred merely from balanced forces. |

These two judgments resolve only the corresponding findings in the unchanged
prior affected report. No new source fact, measured timing, apparatus premise,
worked exercise, formula or answer is supplied.

Still UNKNOWN: actual recoil duration/damping and observation time, relaxation
before landing, the original panel-b intention, cabin rotation/initial motion,
container geometry/wetting, pressure differences and existing flow.
The adopted ideal illustration does not resolve those UNKNOWNs.
Zero source/apparatus UNKNOWNs resolved; no source or raster was reopened.

## Four Anchor Verdicts

| Final Candidate / Exact Pointer | Verdict | Evidence |
| --- | --- | --- |
| s18 `/section_breaks/1/after` | PASS | Exactly equals the prior independently recorded first normalized right paragraph. The changed prose3 sentence occurs later; the raw prefix through the first normalized paragraph is unchanged. |
| s18 `/section_breaks/2/after` | PASS | Exactly equals the prior normalized right paragraph ending at `近似失重状态；`. The surrounding prose6/8 and the before anchor are unchanged. |
| s22 `/section_breaks/0/before` | PASS | Exactly equals saved normalized outline paragraph1, including the newline after `一定相等；` and the repaired sufficient-condition sentence. |
| s22 `/section_breaks/0/after` | PASS | Exactly equals saved normalized outline paragraph2, including the newline after `整体的平动；`. |

s18's two full normalized pairs were reused from
[prior independent evidence](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-affected-review/independent-evidence.json).
Their complete before/after strings match candidate4 and consequently candidate5.
The prose3 first changed character is beyond the preserved normalized first
paragraph; the evidence records both offsets. No s18 normalization was repeated.

s22's parent supplied one actual affected-only normalized-neighborhood
`prose_flow.mjs` call, returncode0, cwd the mandated worktree, empty stderr:
[call.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-repair2/call.json),
[input](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-repair2/s22-normalized-neighborhood.json),
[stdout](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-repair2/prose-flow.stdout),
[stderr](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-repair2/prose-flow.stderr).

That saved call received an empty `section_breaks` array. Its stdout therefore
enumerates three paragraphs but does not itself claim a boundary-contract PASS.
The review checked the saved outline against the saved normalized input,
checked its text characters against candidate4 apart from layout whitespace,
and found exactly one adjacent match for the repaired full pair:
outline paragraph1 before paragraph2, match index2.
This was a structured saved-output comparison, not a new parser execution.
No `prose_flow.mjs`, normalizer, `proseFlow` or whole lesson parser ran here.

## Six-Pointer And Byte Preservation

The one repair2 comparison independently derived exactly3 changes per lesson,
six total, and matched full before/after values to the repair2 receipt:

- s18 `/prose/3/text`, `/section_breaks/1/after`, `/section_breaks/2/after`.
- s22 `/prose/0/text`, `/section_breaks/0/before`, `/section_breaks/0/after`.

There were zero unauthorized JSON-pointer changes and zero protected-tree
failures. Removing only these six fields leaves candidate4 and candidate3
lesson trees deeply equal. All nine declaration arrays are unchanged, as are
source data/text/refs, identities, kinds, metadata, numeric/historical
declarations, unaffected prose, figure metadata and other boundary sides.
The four exercise/scaffold files compared as opaque bytes were identical;
no task or artwork content was reviewed.

Candidate4's Python reserialization separately introduced48/96 whitespace bytes
outside the authorized values. JSON equality alone was not labeled byte
preservation. The parent retained candidate4 and produced candidate5 from the
candidate3 bytes using only the six authorized string-token replacements.

One new byte-only check guarded all six old/reviewed/final lesson hashes,
proved both candidate5 lesson JSONs equal the reviewed candidate4 values,
and independently located only the six named root-field string tokens.
The root markers were line-anchored to exclude nested source snapshots.
Each token's decoded old/new value matched the already-reviewed delta.
All eight byte segments before, between and after those six tokens matched
candidate3 exactly. Thus all bytes outside the authorized tokens are preserved,
with zero protected-byte failures. Candidate5 removes exactly48+96=144
candidate4 whitespace bytes. No semantic or anchor review was repeated.

The continuation receipt records the parent's first helper attempt exit1,
with zero writes because its marker also matched a nested snapshot.
The parent supplied corrected attempt2 exit0. Neither helper attempt was replayed,
and neither failure is represented as a semantic repair/review round.

## Reused PASS Scope

Prior affected SCIENCE PASS7 remains:
s18 prose0/5/8/11; s22 prose1/2/3.
All9 declaration PASSes remain:
s18 `/prose/{0,3,5,8,11}/changes`;
s22 `/prose/{0,1,2,3}/changes`.
Their unchanged values were checked as protected fields, not judged again.
New prose PASS2 plus reused7 covers the original nine affected prose repair units;
it is not a fresh whole lesson review.

Prior full TEXT-fidelity, unaffected s18 prose/task evidence, s22 task PASSes,
and FIG62 evidence are reused without replay or renewed approval.
FIG61's separate exact-spec/authoritativeText dependency remains unresolved.
This report approves no source, figure, image, answer or choice artifact.

The original
[affected REVISE report](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/modern-science-review-s18t1-s22-affected-b86.md)
remains16279 bytes, SHA256
`245434975c54473170ac8bfedcc73c613cd5e54203880a65cb7c77f2f0f9a46b`.
Its candidate3 verdict is historical, not overwritten or retroactively relabeled.

## Actual Counts And Evidence

| Newly Reviewed Set | PASS | REVISE |
| --- | ---: | ---: |
| Repaired prose text fields, 2 | 2 | 0 |
| Repaired normalized anchor sides, 4 | 4 | 0 |
| Total newly reviewed fields, 6 | 6 | 0 |

One affected2 content-review round; exact JSON delta6; protected-field failures0;
unchanged opaque task/scaffold files4. Prior prose PASS7 and declaration PASS9
are reused, not new verdicts. Three affected boundary pairs PASS: two reused
s18 normalized pairs and one s22 pair with one saved-outline match.

Actual reviewer execution: one scoped evidence-check Node command, exit0,
then one final byte-binding Node command, exit0. No child processes;
new normalizer/prose-parser/producer/helper calls0, whole review replay0.
The parent's saved affected s22 prose-flow call count is1, not a reviewer call.
Final byte-only checks: lesson hashes2, candidate4 JSON-equality checks2,
authorized tokens6, unchanged byte segments8, new science/anchor reviews0.

Owned evidence:

- [review2-check.mjs](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-affected2-review/review2-check.mjs) and [independent-evidence.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-affected2-review/independent-evidence.json): candidate4 bindings, independently derived6-pointer delta, invariants, protected reused PASS scopes and saved normalized pair comparisons.
- [byte-bind-candidate5.mjs](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-affected2-review/byte-bind-candidate5.mjs) and [candidate5-byte-binding.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-affected2-review/candidate5-byte-binding.json): final candidate5 hashes, equal reviewed values, exact token spans, all protected byte-segment hashes, continuation receipt binding and counts.
- [final-seal.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b86-6p-science-affected2-review/final-seal.json): unchanged read-only input bindings and owned output hashes; sealing only, no review replay.

Every shell cwd was explicitly `/Users/yong/.codex/worktrees/0f12/lemmadeck`;
there were no child cwd defaults. Manual files used `apply_patch`;
generated evidence used exclusive creation. Only this new report and its new
owned scratch directory were written. Candidates3/4/5, prior reports and parent
receipts/evidence remain unchanged.

Source/figure/image/answer/choice/task/full TEXT review, source solve/reopening,
canonical/candidate writes, backend/setup/freshness, Git/DB/publish/services,
paid calls/messages/descendants/app/dependency/official-tool changes: all0.
No downstream action is authorized by this scope.

**PASS for the six affected fields at the final candidate5 bindings. STOP.**
