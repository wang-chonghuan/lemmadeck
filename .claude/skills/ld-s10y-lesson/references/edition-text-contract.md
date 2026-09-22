# Edition Text Contract

## Section Boundaries

`section_breaks` is authored as adjacent final-paragraph anchors:

```json
{
  "section_breaks": [
    {
      "before": "同组例式的最后一个实际段落",
      "after": "下一个概念的第一个实际段落"
    }
  ]
}
```

Run `node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs <lesson.template.json>` and copy the
reported boundary object. The command, validator, offline renderer, and publisher all use
`htmlfrag.js` `proseParagraphs`/`proseFlow`. Do not count prose blocks or blank lines independently.

## Source-Bound Errata

A confirmed mathematical printing error remains unchanged in the faithful page block and is recorded
in that page's frontmatter:

```json
{
  "errata": [
    {
      "id": "p0013-math-1",
      "block": "p0013#7",
      "original": "$a+b+c$",
      "reason": "The printed relation fails the stated substitution check."
    }
  ]
}
```

`finalize` verifies that the block exists and contains `original`. `assemble` preserves the source
block reference. `adapt-prepare` then creates the lesson-level record with the physical/printed page,
page JSON SHA-256, PDF SHA-256, target, original expression, and an empty `corrected` field.
For a legacy raw lesson that predates `source_refs`, `adapt-prepare` reconstructs those references
from the authoritative page stream using the lesson identity and assembly rules. If that
reconstruction is ambiguous, or if a page erratum's `original` no longer appears exactly once in
its bound raw lesson/exercise target, preparation fails and instructs the author to rerun
`assemble`; it never treats the registered erratum as unrelated and silently drops it.

The edition author fills only `corrected`, updates the target text, and adds `math-correction` to that
target's `changes`. `adapt-finalize` rejects a missing record, wrong page or block, stale page hash,
original mismatch, unchanged propagation, or any formula change not reproduced by the registered
replacement.
