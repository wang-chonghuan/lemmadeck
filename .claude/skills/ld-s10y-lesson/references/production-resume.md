# Per-lesson delivery SOP

The binding delivery sequence for the lesson, image, choice and answer skills.

**One lesson, one session.** The session boundary is the lesson boundary: finish the
authorized lesson, record it, and end the session. Do not begin another lesson in a
session that has already delivered one.

That is the whole reason this file is short. Production cost is not the content —
it is the session's own history, re-read on every turn. A session that runs lesson
after lesson grows monotonically and pays for all of it again each turn, so its cost
rises with the square of its length. Ending the session is the only thing that makes
the cost per lesson flat.

**One stage, one session, too.** Inside a lesson the same arithmetic applies to the
stages. STEMROBIN-191 measured one 12-exercise lesson end to end: 437 turns at an
average context of 252K, $78 at list price, of which cache reads were 98% of the
tokens and 68% of the money — the session re-reading its own history. Its two halves
did comparable amounts of work and differed mainly in accumulated context, 187K
against 330K, and the later half paid $0.240 a turn against $0.139. Hand the next
stage what it needs (the checkpoint, the paths, the lesson id) and start it in a new
session, rather than carrying cap1's page scans and potrace logs into cap6.

The caller's pause or offline authorization overrides the publish steps below.

## Required workflow

Source pages and shared inputs may be prepared together. Delivery is per lesson.

1. **Produce** the authorized lesson and every component the assignment names:
   prose, exercises, figures, answers/interactions, and choices where requested.
   Keep the substantive source, mathematics and option review. Check the new or
   changed lesson's desktop/mobile display once, using offline or product evidence
   applicable to its current files. Reuse valid unchanged bound evidence. Shared app
   behaviour — keyboards, judging, SPA navigation — needs no retest per lesson.

2. **Retain** the reviewed lesson and its dependencies under
   `ssot-resources/soviet10year-textbooks/artifacts/<book>/`, in the existing page,
   edition, figure, answer and choice paths. Keep the first failure receipt and the
   changed candidate snapshot once. Never commit secrets or runtime dependencies.

3. **Commit and push** this lesson's owned paths to the worker's recorded branch.
   Name the paths explicitly; never `git add -A`. For a detached checkout, push
   `HEAD:<recorded-branch>`. A normal successful push is enough. A failed push blocks
   this lesson's publication, not unrelated source work.

4. **Submit** the pushed lesson to the authorized DB writer with its lesson id,
   branch/commit and retained paths. One caller-designated writer serializes writes,
   using the named publishers with exactly one `--lesson <id>`, in order: base
   lesson, answers, interactions, then retained choices where requested. Publish the
   pushed snapshot, not later uncommitted edits.

5. **Read back** that lesson once: edition, content presence and counts, and the
   requested components. Reuse the display evidence from step 1. Only an uncovered
   display change, an actual failure, or an explicit functional-test request needs
   the affected cap7 check.

6. **Record and end.** Write the lesson's stage and this session's real token usage
   into the checkpoint, then **end this session**:

   ```bash
   python3 .claude/skills/ld-s10y-lesson/tools/checkpoint.py set-lesson \
     --repo . --ticket <ticket-id> --lesson <card-id> --stage published \
     --commit <sha> --session <session-id>
   python3 .claude/skills/ld-s10y-lesson/tools/meter.py record \
     --repo . --ticket <ticket-id>
   ```

   `meter.py` exits non-zero past its budget. That is not a failure of the lesson —
   it is the signal that this session was already too long, and the next lesson
   starts in a new one regardless.

   The next lesson starts in a **new session**, from the checkpoint.

## Production worker configuration

- Use a **200K-context model** for production work. A 1M-context model removes the
  ceiling that would otherwise force compaction, and the session runs to 900K+ with
  every turn billed at that size.
- **Check that ceiling before the first tool call, and state the number.** Nothing
  in the pipeline enforces it: the STEMROBIN-191 run reached a 389K peak context
  with every turn billed at that size and no warning anywhere. If the session's
  model does not have a 200K window, say so and stop instead of starting the lesson.
- One worker per lesson. Parallel lessons are parallel sessions, not one session
  doing more.

## Resume

The checkpoint is the only resume input:

```bash
python3 .claude/skills/ld-s10y-lesson/tools/checkpoint.py check \
  --repo . --ticket <ticket-id>
```

Read the latest direct human instruction and the checkpoint, then continue the first
lesson that is not `published`. A direct pause stays effective until a later direct
human resume for that scope; old resume messages, heartbeats and the completion of a
repair do not lift it.

Collect already completed child results before dispatching replacements. Bind
returned paths to the actual files and reuse passed stages. A bounded offline
experiment does not authorize another lesson or a DB write.

## Failure and stop boundaries

Keep successful commits, pushes and publisher results when a later stage fails.
Diagnose the concrete cause, then resume only the missing or failed stage for that
lesson. If a write's outcome is uncertain, read that lesson back before retrying.
Existing answers, interactions and valid choices must survive a permitted base
republish.

Distinguish these four, because they have different remedies:

| What happened | What it is |
|---|---|
| bad cwd, missing output directory, read-only file, parser error | tool execution failure — fix and resume the failed stage |
| review found the content wrong | content failure — revise, then affected-only review |
| source missing or ambiguous | a stop with evidence, not a verdict on the content |
| human approval absent | a stop; never self-granted |

A technical repair corrects its execution diagnosis, not a content or approval HOLD.
Stop dependent stages at their first failure; independent completed work stays usable.

**A stop is not a wait.** When something genuinely needs a human, ask once, then
keep working on whatever does not depend on the answer, and end the turn — do not
hold the session open waiting. The STEMROBIN-191 run spent 129 of its 172
wall-clock minutes idle between asking and being answered: wall clock that buys
nothing while a large context stays alive and the next turn re-reads all of it.

On a direct pause or shutdown request, do not start the next lesson. Finish only the
nearest safe in-flight step, retain completed work, write an honest incomplete
checkpoint, and stop. Do not publish an incomplete lesson or infer a resume from
saving one.

## Tool contracts

Commands run from the exact active checkout root. Book identity is explicit; neither
the environment nor another book supplies a default.

```bash
P=.claude/skills/ld-s10y-lesson/.venv/bin/python
$P .claude/skills/ld-s10y-lesson/tools/production.py prepare-range \
  --repo . --book <book> --first <physical-page> --last <physical-page> \
  --work .tmp/ld-s10y-lesson
$P .claude/skills/ld-s10y-lesson/tools/production.py read-json --input <saved-stdout>
$P .claude/skills/ld-s10y-lesson/tools/production.py read-receipt \
  --input <saved-execution.json> --expected <handoff-execution.json>
$P .claude/skills/ld-s10y-lesson/tools/retain_choices.py \
  --repo . --book <book> --lesson <card-id> --source <approved-choice-directory>
```

`checkpoint.py` and `meter.py` use the system `python3` and the standard library;
they do not need the virtual environment.

Range preparation reuses complete prepared pages and stops before the next page when
a command fails. It is preparation only, never source or content approval. Use the
returned machine result for control.

`read-receipt` compares execution facts across the known `cwd`/`workdir`,
`exitCode`/`exit_code`/`returncode`, `argv`/`child_argv` and flat/nested `streams`
wrappers. Conflicting aliases, nonzero or missing exit status, interrupted calls,
missing streams and recorded hash drift fail. It establishes no content approval.

For local repairs, run only the affected downstream lesson stages. `assemble`
reconciles the authoritative book structure and replaces only changed outputs; the
current book index, not leftover directories, defines the active set.

`reindex --book <book> --toc <toc.json>` derives the index from retained lesson files
without rewriting them, for importing already approved raw lessons into a repair
checkout.

Keep approved snapshots read-only and work from a writable copy. Modern finalization
replaces its output files, not the evidence snapshot.

## Evidence

Reference the existing source/PDF/runtime path, Git revision and file hash. One
applicable desktop/mobile display review of new or changed content, then affected
checks only after a real defect. Do not copy Node, Python, whole PDFs or an earlier
evidence package into a new batch. Return text and evidence paths or hashes, not
image-bearing history.
