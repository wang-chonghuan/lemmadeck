# N58 Boundary Recovery

The initial modern text snapshots in this directory remain unchanged.
The first official adapt-finalize exited 2:

`lesson.section_breaks 无法由 proseFlow 解析: section_breaks[1] must identify exactly one adjacent paragraph pair; matched 0`

The existing normalizer groups the four rule items into two short paragraphs:
prefix plus items 1/2, followed by items 3/4. The first snapshot's second
`after` anchor named the unsplit four-item paragraph, so it became stale.

Only the rule paragraph spacing and that anchor were corrected. A subsequent
prose_flow call against the still-stale anchor also exited 2; the tool's
`--stdin` outline with section_breaks omitted then reported the actual two
paragraph texts. The working anchor now copies the first actual rule paragraph
verbatim. No formula, number, rule, source binding, exercise or figure changed.
Passed figure/source review was not rerun.
