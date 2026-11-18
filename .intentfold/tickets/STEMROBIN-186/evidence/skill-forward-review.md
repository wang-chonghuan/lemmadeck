# STEMROBIN-186: Scoped Forward Decisions

One hypothetical independent behavioral pass for the parent's AC3 evidence, not an audit or AC3 sign-off. Inputs: only lesson SKILL.md, production-resume.md and choice SKILL.md. Scenario hashes are assumptions, not runtime verification. No production, network/model/paid calls, browser/images, DB/env, commits, agents, skill edits or old-worktree writes.

## Scenario 1: Completed Content, Failed Execution

Decision: reuse passed content; recover only failed execution within the four-lesson offline authorization.

1. Collect already returned child reports before replacements. Bind paths/hashes to current seed, draft, review and lesson/assets. Reuse passed preparation, authoring, independent text review and exact valid retained outputs; compression is neither invalidation nor completion.
2. Preserve the first failure receipt and approved snapshots read-only. Create only the missing output parent in the active checkout. Separate immutable evidence from the 0444 working/output file: use writable working copies and a parent permitting output replacement, never chmod evidence. A different existing retention target/owner must be resolved, not overwritten.
3. Retry only failed `retain_choices.py --repo . --book <checkpoint-book> --lesson <checkpoint-card> --source <approved-directory>` calls; then only failed `p2c.py adapt-finalize` calls with original book/edition and affected IDs. Use the exact active root. Reuse successful calls; no new seed preparation, author or semantic review for unchanged bytes. Current checker/finalizer validation still runs.
4. If content/source/assets actually change, obtain affected-only review. Execution repair is not approval. Keep actual content-revision, image and paid-call usage, including failed real calls; never reset allowances.
5. Preserve `FIRST1/1 HOLD`; do not cross its held gate. Its meaning is undefined here. If it holds retain/finalize themselves, stop before those calls. Directory/permission recovery cannot clear it or turn it into a content verdict.

No image/model work, publication, DB/browser acceptance, commit/push or fifth lesson is authorized. Unfinished gates remain unfinished.

## Scenario 2: Latest Direct Human Pause

Decision: `全部先暂停` controls now. Stop continuation, including retries and dispatch; do not finish stages to tidy the checkpoint. Report paused from known facts, preserving evidence and usage. Older quoted resume, heartbeat and completed repair cannot lift the pause.

Only fresh direct human resume for that scope permits pending result collection/binding, failed retain/finalize recovery and other unfinished authorized phases. Passed unchanged author/review stays reusable. Separate HOLD release, another batch, paid/image work, publication, DB/browser acceptance and commits require explicit applicable authority, not merely an offline resume.

## Scenario 3: Partial Page Preparation

Decision: page 1 reusable; page 2 failed, not approved; pages 3/4 unrun.

1. Preserve page 2's exit-1 receipt and valid partial output. Identify the cause from saved machine results; mixed stdout uses `production.py read-json` for all complete top-level documents, not a successful producer rerun.
2. Correct only an evidenced technical cause using existing local inputs/runtime. Missing/ambiguous source requires resolution, not guessing. Preserve the sealed original/PDF/runtime references.
3. While authorized, use `production.py prepare-range --repo <active-checkout> --book <checkpoint-book> --first 1 --last 4 --work <existing-work>` with existing referenced runtime: reuse page 1, retry page 2, then prepare 3/4 only after preceding success. Stop at first failure and stop its dependent phases. Unrelated completed work remains usable. Preparation is not content approval. If paused, wait for fresh direct resume.
4. Retain existing source/PDF/runtime paths, Git revision and hashes; keep the first failure receipt once and genuinely changed candidate snapshot once if needed. No binary/runtime/whole-PDF or earlier evidence-package copies. Do not claim downstream completion.

## Concrete Instruction Gaps

- Lesson SKILL.md:48's non-fail-fast preparation loop conflicts with production-resume.md:26,45-46's first-failure stop. Use the range wrapper here.
- production-resume.md:16-17's commit/push/next-batch instruction lacks explicit bounded offline-delivery qualification. This request authorizes neither.
- `FIRST1/1 HOLD` is undefined in these files; checkpoint meaning is needed to identify the held phase. Do not silently clear/reinterpret it.

Otherwise the tested decisions are explicit. No new review, reporting or budget system is proposed.
