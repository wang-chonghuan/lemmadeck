# Exercise85 Changed-Only Errata Review

2026-11-15. STEMROBIN-184. **PASS** for the two registered source-wording clarifications and current modern s8 exercise85. This is not a whole-lesson review, finalization or promotion.

## Source and Unchanged Geometry

Reused my actual-pixel investigation, whose preserved evidence copy is byte-identical to the original report. Did not reopen old page images or read answers/choices. Compared current p0038 with HEAD `c0d74c560df844bc50af80ab818858843b5f862b`; the baseline page.md hash exactly matches the investigation's original hash.

- page.md body after frontmatter is byte-identical.
- Entire page.json is structurally identical after removing only `meta.errata`: all source blocks, wording, rows, figure boxes and geometry remain unchanged.
- Entire audit.json is structurally identical after removing only its errata count, now 2 rather than 0. Source ownership/crop evidence, 16-row reconciliation and error list are unchanged.
- Actual source PNG hash is unchanged.

The faithful exercise in `p0038#1` remains:

```text
85.** 已知一正方形$ABCD$.1) 证明：以这个正方形的所有
顶点为顶点的简单闭折线共有五条.2) 证明：以这个
正方形的所有顶点为顶点的简单非闭曲线共有20条.
```

## Exact Bindings and Modern Replacement

`p0038-polyline-vertices-85-1` binds this exact source substring, occurring once:

```text
1) 证明：以这个正方形的所有顶点为顶点的简单闭折线共有五条.
```

Its registered correction is:

```text
1) 证明：顶点均取自这个正方形的四个顶点的简单闭折线共有五条.
```

`p0038-polyline-wording-85-2` binds this exact source substring, occurring once:

```text
2) 证明：以这个正方形的所有顶点为顶点的简单非闭曲线共有20条.
```

Its registered correction is:

```text
2) 证明：顶点均取自这个正方形的四个顶点的简单非闭折线共有20条.
```

Both faithful entries point to `p0038#1`; both modern entries target `exercises[15]`, which is actually source exercise85, with physical page38, printed page28, the unchanged PDF identity and current actual page.json SHA-256. The modern exercise's `pages` is exactly `["p0038#1"]`; its source_text exactly equals the faithful block's joined text. Applying only the two registered replacements to source_text exactly reproduces current modern text after removing layout newlines. Its text and three lines agree; `changes` contains layout and math-correction, `numeric_changes` is empty, and figure references/attachments remain empty.

## Mathematical Fitness

The existing independent exhaustive enumeration applies directly, without new conventions:

- All four vertices required: 1 simple closed and 8 simple open.
- Vertices selected from those four, using source `n>2`: four triangles plus the square boundary = 5 closed; twelve three-vertex paths plus eight noncrossing four-vertex paths = 20 open.
- One-segment paths would add six, giving 26, but source `n>2` excludes them.
- “顶点均取自……四个顶点” explicitly denotes the allowed vertex pool, not compulsory use of all four. “简单非闭折线” excludes arbitrary curved arcs. Source counts and square geometry remain unchanged.

The clarifications therefore resolve the source-wording ambiguity identified by my earlier investigation. No numerical erratum, invented distances, added points or answer annotation is required. I did not re-review other modern exercises or source pages.

## Actual SHA-256

| File | SHA-256 |
|---|---|
| Original investigation and preserved evidence copy | `0441c3ca92e4a1fd1783c26938e71e0e2e4f24cfc525f913e62a30bbd8f01ff4` |
| Baseline p0038/page.md | `5cf830e211178aa0814220082745e210fb6e4a4a07cc97dc96b07955a862abe9` |
| Actual p0038/page.png | `4ed288ebc5278ffa1d27b28729dcdd979afb5b5cf02b12445a5283a207d79e2b` |
| Current p0038/page.md | `337eeeab1cbbdbbf1377ffb12493badea5075c51312bbdf08df50dbef785fda0` |
| Current p0038/page.json | `5849fe0beb3650dee708722c6b8b72894202fe81f9e439f34217e64d1bc7c321` |
| Current p0038/audit.json | `98714672d2c6a2201d0d44693f4a4554783a16528aded70596ac1b8f20a4abec` |
| Current s8 exercises.template.json | `71ce211692ea9035e80d3d29de3026d6cf41e77d99286771fc46b0ed4e3292d3` |
| Current s8 lesson.template.json | `42eb8f81173e123fb1a44fbf287d9655db7a29613aeb49034e88bb779c8a5777` |

Only this changed-only report was written for this review. No source/modern edit, finalization, assembly, test, DB, browser, network or promotion operation was performed.
