# Inertia B52: Q4 Affected Continuation

Current complete verdict: **TEXT PASS** for the three templates in `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-repair-inertia-b52`.

Composition: original unaffected TEXT findings/evidence **PASS** + repaired Q4 **affected PASS**. `B52-TEXT-01` is resolved for this repaired candidate. Main may retain these exact repaired templates through its existing workflow. This is a continuation of the same independent review, not a second full review or FINAL/FIG/publication approval.

Date: 2026-11-17. Same checkout: `/Users/yong/.codex/worktrees/0f12/lemmadeck`. The original BLOCK report and source-only freeze remain unchanged and describe the original candidate, not this repaired one.

## Only Affected Change

Read only the repaired Q4, current canonical Q4 and its supporting canonical paragraph, the frozen source-only Q4 answer, and existing affected-operation evidence. A byte diff of original/repaired exercises shows exactly two changed lines: `exercises[3].text` and its single `lines` entry. Both remove only `原来正在运动的`. No other exercise field or task changes.

Canonical `p0057#8`:

> （4）假若阻碍运动的因素全都不存在，物体将怎样运动？

Repaired Q4:

> （4）假设一切阻碍运动的因素都不存在，物体也不受其他物体的作用。物体会怎样运动？

The initial state is now unrestricted, as in the canonical question. The retained no-other-body-interaction clarification is supported by the complete canonical paragraph bound to `p0056#6 + p0057#1`, which explicitly gives rest or uniform rectilinear motion with unchanged velocity. No force, initial speed, reference-frame or experimental-data requirement was added.

Q4 identity remains `number/source_number = 4`, `问题/g1`, `pages = ["p0057#8"]`; `figure_refs/figures` remain empty. Its original source text, source snapshot, changes declaration, numeric changes and historical declarations are unchanged.

## Frozen Answer Applicability

The existing `source-only.json` task 4 applies without modification:

- Its ideal no-interaction condition matches the repaired question.
- Its two initial-state branches are both applicable now: continuing rest, or uniform rectilinear motion along the original direction with unchanged speed.
- Its same-reference qualification and distinction between a cleared sandy route and the no-interaction ideal remain applicable.
- The task remains qualitative, with no newly supplied velocity or numerical result.

This is comparison against the already frozen source reasoning only. No source solving, answer rewrite, new answer source, or full FINAL answer comparison occurred. The freeze's historical `not-final-approved` status is preserved; TEXT PASS here does not rewrite that historical record.

## Unaffected Evidence Reused

Reuse the original independent review's complete 13-block assessment, other four task assessments, source-pixel observations, source bindings, and saved normalization/prose-flow/focused-check evidence. Lesson and figure template bytes match the original review bindings exactly. The exercise byte diff establishes that the four unaffected tasks and all other exercise metadata are unchanged.

No full TEXT gate, math gate, SOURCE/FIG gate, normalization, prose-flow or rendering was replayed. New image opens in this continuation: **0**; cumulative original review/solve batch/task/context counts remain **3/3/3**, with zero reopens, crops and parent payloads.

## Existing Affected Operation Evidence

Read, do not rerun:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/batch52-inertia-q4-affected-check.{call.json,stdout,stderr}`

- Actual command finished at `2026-11-17T02:42:39.997Z`, exit **0**.
- Existing `validate_text`, numbered-subpart layout and `lines == text.splitlines()` checks were limited to Q4. The recorded operation also compared the four other tasks for equality.
- Actual stdout: `errors: []`, new exercise SHA below, `text_repairs: 1`, `original_read_correction: 1`, `unchanged_text_gates_rerun: 0`.
- Stderr is empty. This reviewer did not execute the checker again.

Read the existing repair-copy operation too: it copied three original frozen templates into the separate repair directory with exclusive creation, exit **0**, before the Q4 change. The byte diff exit `1` in this continuation means the expected two-line difference exists, not an acceptance failure.

Factual operation accounting under the current human instruction: original author actual TEXT repairs **0**; main's actual Q4 TEXT repair **1**; entry jq read-only correction **1**, separately recorded and not counted as an actual TEXT repair. The original conservative `1/1` budget wording is preserved verbatim in the original reports. No additional human-approval gate is introduced.

## Current Byte Bindings

All hashes below were read from current file bytes in this affected continuation.

| Repaired template | SHA-256 |
|---|---|
| `lesson.template.json` | `07e3c5069b4bf0c9c59ed105c45cbbba6f5bea220734a7b67352ee6f2a371986` |
| `exercises.template.json` | `7f50a7a4b5e24e7d8504f890e52a5c87319b7df12a5078e8ee15a43882080e2f` |
| `figures.template.json` | `86ff4a5b8b41cec5e56a7cfacaaad561fc1433f29fb241f381394675af3be44d` |

| Preserved report/source/evidence | SHA-256 |
|---|---|
| Original `modern-text-review-inertia-b52.md` | `cf7ed7b0c5e3761a66cdc86a08c6a374dba1a17259548e28576cc937a4ca4983` |
| Original author `modern-text-author-inertia-b52.md` | `ddd3043f827f52390a07e754856a59fc7a06bc26be0412f62b5e1a57dce85359` |
| Original author `exercises.template.json` | `cb7a9cdd57527063dda93efbce917f3656dc284f7523973a03e7ad483e2df8db` |
| Frozen `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-review-inertia-b52/source-only.json` | `ad52f08807bdabf159022009839211b26d70c9d0d0fec143fe0c9496da99e2ae` |
| Current canonical `lessons/phy6-c3-s6/lesson.json` | `6d44c56b0f401bbf4431c03b8aca571ef0c0a320bfd0c42a4dd38f3422c15a37` |
| Current canonical `lessons/phy6-c3-s6/exercises.json` | `d8a171dbfdf36f71f3c628b3feabf9320d032494c670bcb43b0d2b4a1fe64bf8` |
| `batch52-inertia-q4-affected-check.call.json` | `e2c7e52a33f6cee05941bb1fe6530f4ce73911b9f698e446b78a97e3a3a25280` |
| `batch52-inertia-q4-affected-check.stdout` | `cb0a0d2c265d47f66ca5b1c7edf449b7b4e1364270d99fcd0e71286a88ec7aac` |
| `batch52-inertia-q4-affected-check.stderr` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

Canonical paths above are below `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/`. Command evidence paths are below the ticket's `tmp/commands/`; original report and author paths remain those bound by the first review.

## Boundary

Affected continuation complete: **TEXT PASS**, no remaining essential TEXT finding for these exact repaired bytes. Only this addendum was written. No original report/freeze, candidate, other session artifact, inherited failure, checker, figure, durable edition, DB, publication, Git, service, app or dependency was modified.
