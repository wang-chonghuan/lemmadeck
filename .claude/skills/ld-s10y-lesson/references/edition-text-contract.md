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

Numbered subparts join ordinary wrapped continuations, but an existing blank-line boundary or a sentence-ending newline outside math after the final subpart preserves the following independent paragraphs and their sentence newlines instead of folding them into that subpart.

## Source-Bound Errata

A confirmed mathematical printing error remains unchanged in the faithful page block and is recorded
in that page's frontmatter:

`original` and `corrected` may be a formula or a mathematical statement written in prose.
Math delimiters are not required for a statement correction; the same exact source binding,
nonempty replacement, unique original span and removal of the original wording are required.

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
`adapt-prepare`, `adapt-finalize`, and publication revalidation reconstruct the authoritative target
bindings from the page stream using the lesson identity and assembly rules. Missing legacy
`source_refs`/`pages` are recovered from that result; populated references must match it exactly or
validation fails and instructs the author to rerun `assemble`. Only an erratum absent from the
authoritative lesson binding is unrelated. Ambiguous reconstruction, incorrect populated references,
or an `original` that no longer appears exactly once in its authoritative raw lesson/exercise target
fails rather than silently dropping the registered erratum.

The edition author fills only `corrected`, updates the target text, and adds `math-correction` to that
target's `changes`. `adapt-finalize` rejects a missing record, wrong page or block, stale page hash,
original mismatch, unchanged propagation, or any formula change not reproduced by the registered
replacement.
