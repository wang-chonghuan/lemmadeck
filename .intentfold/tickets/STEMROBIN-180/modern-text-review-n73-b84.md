# STEMROBIN-180 B84: Independent Modern TEXT Review of n73

Final verdict: PASS for current lesson template SHA-256 `4c9d25129e5fe1826fc665e5b99039190bd8d8fe968670101347b3af29f9f1e4`, after the parent's one authorized affected repair and an affected-only continuation.

First-candidate verdict: HOLD. One concrete edition-text contract defect; no substantive scientific or whole-task fidelity defect found. The original finding and complete first-candidate review are preserved below, followed by the affected continuation that closes it.

Reviewed on 2026-11-18. Exactly one substantive independent review of the complete candidate plus one authorized affected-only continuation, not a source re-review or a new approval of previously approved source. All shell commands explicitly used `/Users/yong/.codex/worktrees/0f12/lemmadeck`. No reviewer candidate or source edits.

## Original Finding

**[P2] Added formula token prevents modern finalization.**

- File: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b84-n73-source/work/adapt/8p/modern-us-neutral/lessons/phy8-c4-s2-n73/lesson.template.json:115`.
- Target: `lesson.prose[7].text`; source binding `p0282#7`.
- Candidate SHA-256: `31a6375703172733d7ce42f160b256c8f0d689a5f8bd7da41f01ca49b3ebce7f`.
- Source has two `$1$` expressions. The modern ideal-model clarification adds a third. Source math signature is `["1", "1"]`; modern signature is `["1", "1", "1"]`.
- The added statement is scientifically correct, but the binding contract permits formula changes only through source-bound errata. This target has `changes: ["clarification"]` and no bound erratum. The sole valid erratum belongs to `lesson.prose[16]`, not this target.
- Actual read-only `edition.validate_text` returned a math-change-without-bound-erratum error for `lesson.prose[7]`. The controlling comparison is `/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/edition.py:836`.
- Deterministic sentence formatting does not remove this mismatch. Preserve the scientifically sound ideal-model clarification while avoiding an additional mathematical or nonformula numeric token. Do not change source, fabricate an erratum, or relax the validator.

No other concrete defects were found. This is not PASS for the unchanged candidate.

## First-Candidate Complete Review

The following pointers are into the complete modern templates, not excerpts. All 17 prose objects and all four exercise objects were read in full alongside their embedded raw counterparts. The embedded `source.data` objects deep-equal the recovered canonical raw JSON. Every `source_text`, identity field, source reference, exercise number, group, and figure attachment matches raw.

Modern template directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b84-n73-source/work/adapt/8p/modern-us-neutral/lessons/phy8-c4-s2-n73/`

| Target | Text Line | Source Binding | Independent Scientific / Fidelity Judgment |
| --- | --- | --- | --- |
| `lesson.prose[0]` | 16 | `p0281#11` | Total input and useful work distinguished; original introductory purpose retained. |
| `lesson.prose[1]` | 30 | `p0281#12,p0282#1` | Crane lifting and machine-tool cutting both retained. Cutting resistance is task-dependent useful work, not automatically a useless friction loss. |
| `lesson.prose[2]` | 45 | `p0282#2` | Practical friction/internal-energy losses explained without claiming every friction force does negative work or that internal energy can never do work. Useful output remains tied to the chosen mechanical task. |
| `lesson.prose[3]` | 59 | `p0282#3` | Efficiency introduced as the useful fraction of input; original concept retained. |
| `lesson.prose[4]` | 73 | `p0282#4` | Same machine, same process, complete input accounting required for the ratio. |
| `lesson.prose[5]` | 87 | `p0282#5` | Turbine-driven DC generator and mechanical-to-electrical conversion retained. Generator input, rather than an unspecified whole-plant input, is identified. |
| `lesson.prose[6]` | 101 | `p0282#6` | Useful electrical output/input energy ratio is scientifically appropriate; energy and work use compatible units. |
| `lesson.prose[7]` | 115 | `p0282#7` | Accounting for stored energy and distinguishing actual losses from the lossless ideal model are sound. Contract defect described above prevents approval. |
| `lesson.prose[8]` | 129 | `p0282#8` | Loss of useful output is not destruction of energy; machine/environment accounting preserves conservation. |
| `lesson.prose[9]` | 143 | `p0282#9,p0283#1` | Percentage expression, variables, denominator and source formula retained. |
| `lesson.prose[10]` | 158 | `p0283#2` | Example 1 retains 10 kW, 75%, 2 tonnes, 50 m and the time question. Power is explicitly total input to the same work process, not useful lifting output. |
| `lesson.prose[11]` | 172 | `p0283#3` | Useful output is gravitational potential-energy increase; endpoint kinetic-energy change neglected and input power constant. Original work formulas and variable meanings retained. |
| `lesson.prose[12]` | 186 | `p0283#4` | Efficiency applied once to total input. Original substitution and approximate 130 s retained; direct arithmetic gives 130.66666666666666 s, consistent with the source approximation. |
| `lesson.prose[13]` | 200 | `p0283#5` | Example 2 retains 2 tonnes, constant speed and 80 m descent. No engine supply and no other dissipative losses are explicit model assumptions, not claims about every real car. |
| `lesson.prose[14]` | 214 | `p0283#6,p0284#1` | Car/Earth potential-energy accounting and unchanged kinetic energy justify the braking internal-energy increase under the stated model. The no-braking comparison has matching assumptions. |
| `lesson.prose[15]` | 229 | `p0284#2` | Original substitution introduction retained; no new numerical data. |
| `lesson.prose[16]` | 243 | `p0284#3` | Authorized erratum alone changes the result. `2000 * 9.8 * 80 = 1568000 J`, correctly approximated as `1.6 * 10^6 J`, not the raw printed `16 * 10^6 J`. |
| `exercises.exercises[0]` | 10 | `p0284#5` | Full solar-origin-to-hydroelectricity-to-electric-furnace question retained. No energy-conversion answer supplied. |
| `exercises.exercises[1]` | 29 | `p0284#6` | Asks where the falling object's decrease in gravitational potential energy goes. Does not fabricate an exclusively kinetic endpoint or silently assume away impact/dissipation. |
| `exercises.exercises[2]` | 48 | `p0284#7` | Source fictional person consistently mapped to Alex in text and lines. Heavy hammer, lifting, descent, anvil strike and energy-conversion task retained; no answer supplied. |
| `exercises.exercises[3]` | 67 | `p0284#8` | Hypothetical elastically deformed metal spring, sulfuric acid able to dissolve that metal, completed dissolution and fate of stored elastic energy all retained. Explicit theoretical-only/corrosion warning; no experimental instructions. No acid concentration, particular metal, exclusive energy partition, reaction product or complete reaction-energy result invented. The open question does not manufacture certainty. |

`figures.template.json:6` is an empty figure list. Both raw and modern lesson/exercises have zero figure references or attachments. No figures are missing or newly invented.

## First-Candidate Binding Evidence

| Input | SHA-256 |
| --- | --- |
| `lesson.template.json` | `31a6375703172733d7ce42f160b256c8f0d689a5f8bd7da41f01ca49b3ebce7f` |
| `exercises.template.json` | `855fe9454e74b6d01c0da9347f2bf097eba4e5f6aaa3fabf404f8e93360c2ca2` |
| `figures.template.json` | `790940832560ab1bd0b0d782ca8b574a2f21e5c5e77f3b4ec32921fe176d5972` |
| Recovered canonical `lesson.json` | `138aa78e299487ed904494a3ccdcc425cac9675563fff8345fcca09321cc5f88` |
| Recovered canonical `exercises.json` | `0a04a3be6458034d40119c5d722c24106a65950daa7b44f6db807f25739a9bb1` |
| Recovered canonical `lesson.md` | `f51cec57850a0372921f8d680659aeec4a496e615a21c8f28e9a7848ba7e51bc` |
| Source `pages/0284/page.json` | `722594cac255a3f0eeabddea11a336e64a7859520cd225163fc9d7a6353e1fc1` |
| Binding `recovery-n73-b84.md` | `23a4a38b8f7c4fb7a65cdfa1f4a62ff1e512df5a48520e5b055395cc708cfbc2` |
| Existing recovery manifest | `55463ddf7de9b120d133676ff8b120bd971e2f7c2c9093c7e6bcb7705b556d1a` |

The recovered original SOURCE281-284 approval chain is inherited from the binding recovery report, not reissued here. Exact canonical raw bytes remain unchanged. Erratum `p0284-math-1` matches source page/PDF identity, page hash, block `p0284#3`, original expression, reason and target `lesson.prose[16]`; the corrected modern text is the exact authorized replacement plus sentence punctuation.

Authoritative pure-reader evidence: `edition.validate_text` executed once over all 21 targets, with no prepare/finalize/render/publish calls. Exactly one error, at `lesson.prose[7]`; the other 20 targets pass formula and nonformula-number checks. Cultural neutrality and complete scientific meaning were reviewed independently above, not inferred from that validator. This was not a full adaptation or rendering gate.

An earlier ad hoc read-only formula assertion stopped at the same added-token discrepancy; its failure is preserved in the hash manifest. It made no writes and did not constitute another substantive review. The subsequent authoritative diagnostic covered all remaining targets as well as the same defect; no author/review stage or old approval was rerun.

`section_breaks` is empty. Deterministic sentence layout and later rendered acceptance remain the parent's responsibility; neither is substituted for the current formula-contract finding.

Evidence manifest:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b84-n73-text-review/hash-manifest.json`

## Affected Continuation

Authorized by the parent's direct 2026-11-18 instruction after the first candidate had been fully read and hash-bound. The parent reports author 1 round plus 1 affected repair; those counts are inherited, not reset. No producers have been run by this reviewer.

Exact first-candidate preservation supplied by parent:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b84-n73-authored-before-math-count-fix.json`

Its SHA-256 is `31a6375703172733d7ce42f160b256c8f0d689a5f8bd7da41f01ca49b3ebce7f` (20799 bytes), exactly the candidate originally reviewed. The original report before this continuation had SHA-256 `33c6449773fce0dce789f740094eb8638fd06b96b1073409902d4a1bb72b1b1c`; this is a historical report hash, not a claim that the now-extended report still has those bytes.

The final current `lesson.template.json` has SHA-256 `4c9d25129e5fe1826fc665e5b99039190bd8d8fe968670101347b3af29f9f1e4` (20808 bytes).

Only `lesson.prose[7].text` changed: the third `$1$` became Chinese words meaning one hundred percent. The first two `$1$` expressions, the input/system accounting and the lossless-ideal premise remain unchanged. The equality has exactly the same scientific meaning; no source formula or new numerical premise was introduced.

At `2026-11-18T22:55:26.635Z`, the authoritative read-only `edition.validate_text` was called once for this affected target alone. Result: no errors; source and modern math signatures both `["1", "1"]`, and both nonformula numeric signatures empty. The original P2 finding is therefore CLOSED for this final candidate; its original HOLD remains recorded above.

Structured comparison with the exact saved first candidate, masking only this text field, deep-equals the entire remaining lesson JSON. The other 16 prose objects, embedded source snapshot, erratum and every other field are unchanged controls, not re-reviewed content. The exercise and figure templates retain their original hashes. Their original substantive review and the other 16 prose judgments carry forward without repetition.

An output-integrity check immediately before the parent's follow-up detected the changed lesson hash and stopped. It did not silently rebind or approve changed content. That historical hash-mismatch event is preserved in the evidence manifest; the direct follow-up then authorized this affected continuation.

Final TEXT result: PASS, combining the original complete review of unchanged controls with this single affected continuation. This is not producer/finalization, rendering, source, answer, choice, publication or full-course acceptance.

Scope counts: substantive independent TEXT review 1; affected review continuation 1 (one prose target only); source review/rebuild 0; reviewer candidate edits 0; paid calls 0; image opens/generation 0; answers/choices authored 0; Git/services/DB/publication 0; agent descendants/other-chat operations 0. Only this report and the hash manifest are written. No checkpoint, counters, usage files, approvals or other contributors' files are changed.
