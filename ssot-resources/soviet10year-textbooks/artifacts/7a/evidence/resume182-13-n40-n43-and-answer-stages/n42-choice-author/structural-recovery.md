# Once-only structural checker receipt

The one choice-validator invocation exited 2 with:

```text
contract error: stem: embedded media/HTML/URL
```

The check uses `</?[A-Za-z][^>]*>` to reject embedded HTML. Compact visible
math in the graph-height stem, `x^2<x+2` followed later by `x^2>x+2`,
matches that expression as if it were an HTML tag. The same issue could
affect three comparison-table alternatives.

Manual apply_patch correction: insert spaces around the mathematical < and >
operators in the affected stem and those three alternative strings. No math,
condition, key, misconception, graph, source solution, or coverage changed.
No checker/tool code was edited.

`draft.failed-media-filter.json` and `hashes.failed-media-filter.json` preserve
the failed snapshot. `structural-validation.json` preserves the sole execution
receipt. The final draft/view projection and hashes were refreshed without
invoking the validator. The final snapshot has no claimed structural pass.

Missing evidence: a structural-validator result for the final spaced snapshot.
The user's once-only run budget is exhausted; this author does not guess that
the remainder of the structural checker would pass. Parent confirmation and
independent semantic/image review are required before integration.
