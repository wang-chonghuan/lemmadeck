# Batch10 Retention Boundary Repair

The first staged-resource path check exited1. It found actual scratch path
dependencies in the s13 choice-set copies of `frozen-manifest.json` and
`source-first-freeze.json`, not a mathematical or figure defect.

Those two uncommitted copied metadata files were removed from the retained
resource directory. The original author files under the ticket's
`tmp/choices/phy6-c4-s13/` remain unchanged. The scratch retention helper now
excludes these two author-freeze files. It was not rerun on existing output.

No source seed, draft, option, key, semantic review, authored solution,
final lesson, figure or rendered HTML was changed. Their previous substantive
independent approvals and display check remain applicable. The next staging
check covers only the affected retention boundary; no semantic gate or
browser check is repeated.
