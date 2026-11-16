# Physical40 Count-Only Diagnostic And Metadata Repair

2026-11-16, STEMROBIN-184. Sole source StageB was read first:39 passed,
40 retained21/22 mechanical failure, and101 retained literal adjacency
with unresolved semantics. No whole source review is repeated.

## Diagnosis And Observation Ownership

Confucius created the byte-identical first-failure/current snapshots,
one read-only diagnostic and three native strips under
`T/10c-p40-count-diagnostic/`. Its next model request failed at the
50-image request limit before a diagnostic handoff report was written.
The parent resumed from the already saved results without rerunning the
diagnostic. This report does not fabricate an author final response.

The diagnostic reproduces22 existing bands and21 block rows, with no
exclusions or code/threshold changes. All source38 exercises, five
exheads, the folio and23 samerow flags are unchanged. The first21 bands
cover the real source content, ending with folio2282-2316. The extra
band is2472-2492, width1628 with x extent20-1647, after the folio.

The parent actually opened both existing full-width native bottom
strips separately: source boxes[0,2440,850,100] and
[850,2440,845,100]. Together they cover the entire page width and show
only a broken near-horizontal scan edge and isolated blank-margin
specks, without text/formulas/captions. The separate folio strip
[130,2258,230,90] shows the complete printed34 and its two dots.
The parent did not reopen the full page or review all task mathematics.
These observations establish scan ink, not a split fraction or missing row.

## Exact Repair

Only page.md frontmatter changes:

- Add scan-artifact count exclusion[0,2452,1695,128]. It lies in the
  bottom5% of the2580px page and wholly after the real folio. It affects
  only the counting copy, not source pixels or extraction.
- Replace notes[2]'s overcertain mixed-number interpretation with
  literal sin/2/stacked1-over7/pi adjacency and explicit semanticUNKNOWN.
  Task101 remains unchanged, without a new multiplication mark,
  parentheses, result or math erratum.
- Replace notes[3] with the actual first-failure/diagnosis chronology.

No body, source identity, formula, real line, samerow, heading, figure,
expected count, application code or toolkit change is made.
The wrapper `finalize-10c-p40-count-metadata.mjs` records one actual
affected finalize, full streams and resulting triples. Its subsequent
block equality assertion is mechanical scope protection, not another
substantive source review. The original failure remains immutable.

## Remaining Gate

The same original reviewer owns the affected-only notes/exclusion
comparison. This diagnostic is not independent approval of its own
repair, does not resolve101, and does not approve complete83/84,
modern content, answers, choices or publication. No new full-project
check or DB/Git operation is performed.
