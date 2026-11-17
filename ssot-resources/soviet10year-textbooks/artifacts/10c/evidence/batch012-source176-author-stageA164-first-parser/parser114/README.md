# Bounded Heading Parser Evidence

Same authorized STEMROBIN-184 SessionB cap3 continuation. The only production
edit is SEC_NUM in .claude/skills/ld-s10y-lesson/tools/assemble.py. The baseline
snapshot includes the actual existing dirty file; no Git operation is used.

The supplied source heading is represented independently as a synthetic string,
not loaded from any source paragraph. Expected number/title tuples are authored
from the requested heading contract. No existing unit tests are consulted.
The harness executes only the AST-isolated production regex assignment, never
imports the assembler or calls its assembly/TOC-claiming functions.

The intended recognition adds inline-math numbers with an optional braced TeX
star superscript. Existing inline plus, plain numbers, literal star, separate
math star and blacktriangledown decoration stay compatible. It does not add
display math, general mathematical expressions or arbitrary superscripts.
Both match and fullmatch must retain exactly the number/title capture groups.

Actual commands, both output streams, command exits, script hashes and parser
hashes are recorded by evidence.py. The new reproduction is run once before
the patch and must fail with exit 1. Only newly authored focused cases run after
the patch; none are an old PASS suite or a source-content acceptance check.

The relevant TOC entry is derived independently from the literal reported
title and printedNumber, never from a slug or an invented chapter/section ID.
Its exact fields are in focused.stdout.txt. This does not claim that any
retained lesson has been reassembled or its fallback directory corrected.

Read-only baseline/finish hashes cover layout.py, the Chinese 10c TOC, every
file under source pages 168-171 and the retained initial assembly. Comparing
those hashes is not a repeated source gate, finalize or assembly operation.
assemble.diff is the full production delta against the entry snapshot;
complete.diff also includes every newly authored scratch script and this note.
freeze.json hashes all remaining scratch files, excluding only itself.

The first focused command exited 1 at its final case: a synthetic negative
incorrectly rejected arbitrary math in a title after a valid whitespace
separator. Its exact original script, 55 successful cases (110 match/fullmatch
assertions), failed assertion and both streams are retained unchanged.
No successful cases are rerun. check_boundary.py independently asserts title
preservation after whitespace and rejection of an unsupported adjacent
decoration without a separator. finish_evidence.py captures only those two
new boundary cases, derives the TOC entry and freezes the complete evidence.
No second production patch is made to satisfy the incorrect expectation.

Commands in chronological order, from the repository root:

```sh
python3 -B .intentfold/tickets/STEMROBIN-184/tmp/production-114-heading-parser/evidence.py baseline
python3 -B .intentfold/tickets/STEMROBIN-184/tmp/production-114-heading-parser/evidence.py reproduce
# Apply the bounded SEC_NUM patch with apply_patch.
python3 -B .intentfold/tickets/STEMROBIN-184/tmp/production-114-heading-parser/evidence.py finish
# First focused command exited 1 at the invalid final synthetic expectation.
# Add only the new boundary checks and finish script with apply_patch.
python3 -B .intentfold/tickets/STEMROBIN-184/tmp/production-114-heading-parser/finish_evidence.py
```

No model images, browser, backend/DB, source gate, prepare, finalize, assembly,
app, dependency, schema, setup, refresh or Charter edits are part of this task.
Parent work on pages 164/165 is neither observed as acceptance nor modified.
This result is only parser-focused command evidence, not lesson/full-book PASS.
