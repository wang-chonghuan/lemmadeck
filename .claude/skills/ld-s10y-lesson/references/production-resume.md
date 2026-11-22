# Per-lesson delivery SOP and recovery

Use the active ticket's authorization, not the skill's usual publish default.
An offline repair or a paused production assignment does not authorize DB writes,
deployment or starting other workers. This is the binding delivery sequence for
the lesson, image, choice and answer skills, not an optional batching suggestion.

## Strict delivery sequence

Source pages and shared inputs may be prepared together, and multi-lesson tools
may reuse their invocation-local source stream. Delivery is different: finish and
save each complete authorized lesson immediately. Do not wait for four lessons,
a chapter, a context checkpoint or the next scheduled inspection.

1. Complete the selected lesson and every component required by the assignment:
   prose, exercises, figures, answers/interactions and choices where requested.
   Obtain the required substantive source, mathematics and option review, and
   check the complete lesson's offline desktop/mobile display once. Reuse valid,
   unchanged bound evidence; do not repeat the author's or reviewer's work as a
   parent acceptance gate. A raw page, approved figure or structural pass alone
   is not a complete lesson.
2. Retain the reviewed lesson and its necessary dependencies under
   `ssot-resources/soviet10year-textbooks/artifacts/<book>/`. Use the existing
   page, edition, figure, answer and choice paths. Retain indispensable review
   snapshots and their referenced receipts/streams there too when scratch holds
   the only copy; use a lesson-local `evidence/` directory for supporting files
   without an existing durable location. Preserve original bytes, failures,
   source bindings and hashes. Record retained locations in the existing
   checkpoint, not a new handoff package. Paths/hashes pointing only into an
   auto-cleanable worker tree or ignored `tmp/` are not a backup. Never commit
   secrets, runtime dependencies or whole duplicate evidence packages.
3. Before publication, commit this lesson's owned artifacts and required
   source/index/asset changes, then ordinary push to the worker's recorded
   existing branch. Use the exact authorized absolute workdir. Do not stage
   unrelated dirty or already staged work, use `git add -A`, create a replacement
   branch, merge, deploy or force push. For a detached checkout, push
   `HEAD:<recorded-existing-branch>`. Confirm the necessary files are committed
   and the remote branch contains that commit once; no content re-review is
   needed. A checkpoint, Git lock, local commit or successful tool call is not
   remote preservation. Failed push stops dependent publication, not preservation.
4. Submit that pushed lesson immediately to the already authorized DB writer
   using the existing checkpoint and its lesson ID, branch/commit and retained
   paths. Multi-session production uses one caller-designated writer; producers
   do not acquire DB authorization from this SOP. Publish the pushed lesson
   snapshot and its dependencies, not later uncommitted worker edits; use the
   existing retention/intake contract without merging worker branches.
   The writer serializes writes, uses the existing named publishers with exactly
   one `--lesson <id>`, and runs
   only the required stages in order: base lesson, answers, interactions, then
   retained choices where requested. Do not use `--all` or publish unchanged
   earlier lessons. Do not turn single-lesson submission into a four-lesson queue
   gate, periodic full intake or a new service. A busy writer does not prevent
   source work on the next authorized lesson.
5. After the required writes succeed, perform one affected-lesson DB readback
   and the required cap7 product/display check. This is cap7's readback, not an
   extra query pass before repeating cap7. Reuse the offline semantic
   display review; the product check verifies actual publication/integration,
   not a second full content review. Keep actual results in existing durable
   evidence/checkpoint locations. New indispensable result files created after
   the first push need an evidence-only commit and ordinary push; do not rerun
   generation or reviews to save them. Record local completion, pushed commit
   and verified DB publication separately. A pushed lesson is not yet verified
   in the DB, and a DB row is not a backup of its source/review artifacts.

Continue with the next authorized lesson after its predecessor's immediate
delivery/submission, not after a batch report. Offline-only assignments stop at
their authorized handoff; they do not call publishers. Explicitly paused
assignments remain paused even after this SOP is repaired or installed.
If a rule is missing or conflicts with the assignment, report the concrete
conflict to the caller before that stage; do not invent an extra gate or bypass
a required review.

## Failure and stop boundaries

Keep successful commits, pushes and publisher results when a later stage fails.
Diagnose the concrete cause, then resume only the missing/failed stage for that
lesson. If a write's outcome is uncertain, read back that lesson before retrying;
do not blindly republish the base or regenerate the lesson. Existing answers,
interactions and valid choices must survive a permitted base republish.

On a direct pause or shutdown request, do not start the next lesson. Finish only
the nearest safe in-flight step, retain completed work and an honest incomplete
checkpoint, and stop owned tasks. Preserve unfinished files and existing staging.
Save/push in-scope checkpoint bytes when authorized, clearly marked incomplete;
do not publish an incomplete lesson or infer a resume from saving it.

## Continue from facts

- Before continuing, read the latest direct human instruction and the existing
  checkpoint. A direct pause stays effective until a later direct human resume
  for that scope; old resume messages, heartbeats and completion of a repair do
  not lift it.
- Collect already completed child results before dispatching replacements.
  Bind the returned paths to the actual files and reuse passed stages. A
  checkpoint, batch report or context compression is not a completion condition.
  Follow the single-lesson delivery sequence above within the authorized scope.
  A bounded offline experiment does not authorize another lesson or DB writes.
- Distinguish tool execution failure, content review failure, missing/ambiguous
  source, and human approval. A bad cwd, missing output directory, read-only
  working file or output-parser error is not a scientific verdict or a permanent
  prohibition on that content.
- Preserve the failed call and any valid output. Correct the identified technical
  cause and continue only the failed stage; do not redo passed authors/reviews or
  count recovery as approval. Content changes still need affected-only review.
  Real content-revision, image and paid-call usage is never reset.
- Read a checkpoint's HOLD reason to identify the held phase. A technical repair
  corrects its execution diagnosis, not a separate content or approval HOLD.
- Stop dependent stages at their first failure. Independent completed work remains
  usable; a local gap does not block unrelated authorized lessons.

## Existing tool contracts

Commands run from the exact active checkout root. Book identity is explicit;
neither the environment nor another book supplies a default.

```bash
P=.claude/skills/ld-s10y-lesson/.venv/bin/python
$P .claude/skills/ld-s10y-lesson/tools/production.py prepare-range \
  --repo . --book <book> --first <physical-page> --last <physical-page> \
  --work .tmp/ld-s10y-lesson
$P .claude/skills/ld-s10y-lesson/tools/production.py read-json \
  --input <saved-stdout>
$P .claude/skills/ld-s10y-lesson/tools/production.py read-receipt \
  --input <saved-execution.json> --expected <handoff-execution.json>
$P .claude/skills/ld-s10y-lesson/tools/retain_choices.py \
  --repo . --book <book> --lesson <card-id> --source <approved-choice-directory>
```

Range preparation reuses complete prepared pages and stops before the next page
when a command fails. It is preparation only, never source/content approval.
Use the returned machine result for control; human logs are not one JSON document.
For historical mixed stdout, read all complete top-level documents without
rerunning the successful producer. Do not turn candidate presence into approval.

Receive a handoff once using its status, scope, referenced files/hashes, actual
execution receipts and required substantive review. Do not add a parent gate
that reads every JSON scalar, the entire checker source, or every package file
before releasing the next stage. Only expand a specific missing or conflicting
fact. The parent does not redo the child's content or image review.

`read-receipt` compares execution facts across the known `cwd`/`workdir`,
`exitCode`/`exit_code`/`returncode`, `argv`/`child_argv` and flat/nested `streams`
wrappers. A string `command` is one executable, with `argv` supplying its
arguments; shell strings are not parsed. Optional timestamps, counters and extra
package metadata are not equality gates. Conflicting aliases, nonzero or missing
exit status, interrupted calls, missing streams and recorded hash drift fail.
Resolve relative stream paths against each receipt's directory. This read-only
helper does not execute commands or establish content approval; retain the
original receipt and its source/review bindings. Do not invent missing evidence
or compare a whole child record against a handoff's partial metadata object.

For local repairs, run only the affected downstream lesson stages. `assemble`
still reconciles the authoritative book structure, but replaces only changed
outputs; it does not delete other lesson directories or attached evidence.
The current book index, not leftover directories, defines the active set.
Multi-lesson edition commands share one invocation-local source page stream and
source reconstruction. A later invocation rereads source; there is no persistent
cache that can conceal changed pages or errata.

Choice retention verifies the existing choice checker against the current lesson,
its projection and assets. It refuses a wrong owner or a different existing
target; exact outputs can be reused. The seed's original index trace stays
historical: adding unrelated lessons to the book index does not invalidate
unchanged reviewed question content. Changed lesson files or assets still fail.

Immutable evidence and editable outputs are different files. Keep the original
approved snapshots read-only; make a writable working copy. Modern finalization
replaces its output files, not the evidence snapshot or its permissions.

When importing already approved raw lessons into a repair checkout, `p2c.py
reindex --book <book> --toc <toc.json>` derives the index from retained lesson
files without rewriting them. It is not a substitute for assembling or reviewing
new/incomplete source.

## Evidence without duplicate packages

Reference the existing source/PDF/runtime path, Git revision and file hash.
Keep the first failure receipt and changed candidate snapshot once. Do not copy
Node, Python, whole PDFs or a whole earlier evidence package into each new batch.
Only a genuinely required changed input or output needs new bytes.
Follow the image skill's bounded contexts; return text and evidence paths/hashes,
not image-bearing history. Check each completed lesson once at the required
display surfaces, then only affected changes after a real defect. A new handoff,
commit, push or checkpoint alone does not invalidate a passed review.
