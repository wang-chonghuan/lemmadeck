# n102 DISPLAY Group-Heading Repair

The independent FIRST DISPLAY review found one rendering defect: literal Markdown
delimiters in the two canonical group headings. The original FAIL report,
six screenshots and three HTML files remain unchanged.

The existing inline renderer now formats exercise group headings. A bounded
`--groups-only` mode validates the expected existing tags before writing and
changes only those tags. Three focused tests passed once: formatting and HTML
escaping, exact partial delta with repeat rejection, and atomic mismatch.

One actual DISPLAY repair was applied to exclusive copies of the original HTML.
Exactly two tags changed from literal `**练习50**` and `**作业**` to strong markup.
Text and choice HTML, canonical lesson/exercises/figures, adaptation audit,
answer keys and choice draft remain byte-identical. No content revision,
full rerender, choice-validator replay or answer-finalize replay occurred.

One isolated headless browser check covered only the two affected headings at
1440x960 and390x844. Exact label text, strong markup, visible size, viewport fit,
following-group geometry and absence of page errors passed. Four heading-only
screenshots were produced; browser closed. Independent affected visual review
is separate and must be composed with the unchanged FIRST observations.

Receipts: `tmp/commands/batch42-n102-group-tests.call.json`,
`tmp/commands/batch42-n102-group-only-repair.call.json`,
`tmp/commands/batch42-n102-group-affected-browser.call.json`;
exact delta: `tmp/n102-group-repair-delta.json`;
affected browser evidence: `tmp/n102-group-repair-evidence/report.json`.

Actual DISPLAY repair budget: used1/unused0. Parent image opens0.
This is offline evidence, not live-product acceptance or publication.
