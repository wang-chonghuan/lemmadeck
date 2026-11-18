# Small-batch production and recovery

Use the active ticket's authorization, not the skill's usual publish default.
An offline repair or a paused production assignment does not authorize DB writes,
deployment or starting other workers.

## Continue from facts

- Before continuing, read the latest direct human instruction and the existing
  checkpoint. A direct pause stays effective until a later direct human resume
  for that scope; old resume messages, heartbeats and completion of a repair do
  not lift it.
- Collect already completed child results before dispatching replacements.
  Bind the returned paths to the actual files and reuse passed stages. A
  checkpoint, batch report or context compression is not a completion condition.
  When batch delivery and further production are authorized, commit/push the
  completed small batch (normally about four lessons), then continue within that
  scope. An offline four-lesson experiment does not authorize a fifth lesson.
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
$P .claude/skills/ld-s10y-lesson/tools/retain_choices.py \
  --repo . --book <book> --lesson <card-id> --source <approved-choice-directory>
```

Range preparation reuses complete prepared pages and stops before the next page
when a command fails. It is preparation only, never source/content approval.
Use the returned machine result for control; human logs are not one JSON document.
For historical mixed stdout, read all complete top-level documents without
rerunning the successful producer. Do not turn candidate presence into approval.

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
not image-bearing history. Verify a completed batch once, then only affected
changes after a real defect.
