# n103 CHOICE Binding: Sole Mechanical Repair

STEMROBIN-180/C, 2026-11-16. Main's FIRST binding/copy command exited one
before copying or retaining anything. The recursive byte-hash wrapper treated
`source_trace[0].sha256` as the whole `book.json` file's raw SHA-256. That field
is instead the lesson-scoped projection returned by the skill's
`prepare.py::book_lesson_hash`. The original failure streams and call receipt
remain unchanged in `tmp/commands/batch25-n103-choice-bind-copy.*`.

Main initially described this as a historical-index mismatch before inspecting
the hash contract. That diagnosis was incorrect; it is not evidence of stale
source content. The sole repair binds the original book reference through the
existing projection helper, binds the three modern input files by their raw
hashes, and checks the remaining frozen author and reviewer files normally.
No original manifest, SOURCE, seed, draft, author solution, review or answer
is edited.

The unit's total repair budget becomes 1/1 exhausted, including this Main
mechanical correction. The author and reviewer FIRST budget declarations remain
historical, not rewritten. The completed blind review and sole review-bound
official validator exit zero are reused, never rerun. Six exact retention-name
copies are permitted only after the corrected bindings pass.
