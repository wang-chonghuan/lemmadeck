# Edition Text Contract

## Shared Prose Figures

A modern prose block may add `figures: [{"id": "fig-03", "label": "图 3"}]`
to display a numbered figure that its faithful `source_text` explicitly references.
The original prose count, order, identity and source snapshot stay unchanged.
The figure must exist in the source book and the modern `figures.json`, with the
same current source, spec, render and review checks as locally owned figures.
The shared prose renderer inserts it after that block's final paragraph.
Display each shared figure only once per lesson.

## Descriptive Subscripts

The source's upright Cyrillic descriptive subscripts `\mathrm{м}` (maximum)
and `\mathrm{н}` (normal) may be localized to upright Latin `\mathrm{m}` and
`\mathrm{n}` in the modern edition with `notation` in `changes`. The source
snapshot remains untouched. These two label aliases do not permit changing
variables, numerical values, signs, equations or physical meanings.

## Apparatus Labels

The standalone air-bulb label `$Г$` may be localized to `$G$` with `notation`
in `changes` and an explicit block-level declaration:

```json
{
  "notation_changes": [
    {
      "kind": "apparatus-label",
      "from": "$Г$",
      "to": "$G$",
      "reason": "The source identifies this as the air-bulb label; the modern figure uses G."
    }
  ]
}
```

The label must occur exactly once as a complete math token in the source block
and the replacement exactly once in the modern block. The source snapshot
remains untouched. This is not a scientific erratum and does not authorize
substitutions inside equations or any other Cyrillic variable.

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
