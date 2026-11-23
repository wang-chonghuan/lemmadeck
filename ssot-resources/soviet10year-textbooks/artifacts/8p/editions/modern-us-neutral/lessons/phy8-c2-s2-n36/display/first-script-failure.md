# First display-script failure

2026-11-23, authorized STEMROBIN-180 worktree. The first call to the ticket's
`180-7-n36-display.mjs` exited 1 at line 39 on desktop choices:

```text
AssertionError [ERR_ASSERTION]: 20 !== 0
actual: 20
expected: 0
```

Desktop text and exercises had already passed their assertions and produced
their screenshots. No mobile check had run. The failing assertion incorrectly
required zero inputs on the choice preview; the official renderer uses 20
disabled native selection markers (4 checkboxes and 16 radios), without keys or
live interaction. This was an acceptance-script defect, not a content verdict.

The script now forbids textareas, math fields and enabled inputs on choices,
checks the expected disabled marker types/counts, and still requires zero inputs
on text and written exercises. The two completed desktop observations are
reused; only the remaining four surfaces resume. No renderer, content, source,
answer or choice snapshot changed.
