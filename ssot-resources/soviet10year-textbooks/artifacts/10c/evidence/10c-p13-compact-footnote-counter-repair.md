# Compact Footnote Row Counter Repair

Date: 2026-11-15. Ticket: STEMROBIN-184.
Scope: `layout.py` row expansion, not source wording or page-count overrides.

The non-author source review independently counted three printed instructional
footnote rows on 10c physical13. Its full source observation and actual
footnote crop were frozen before the author audit was read. Removing the
independently identified bottom scan rule and footnote separator exposed a
real 20/21 undercount: the original22/21 result had included non-text ink.
The intermediate MD/JSON/audit remain in
`source-10c-p13-exclusions-before-counter/`.

The reproduced synthetic page has five ordinary body rows and three compact
footnote rows. The old counter returned7 instead of the independently defined8.
The two-row version also returned6 instead of7: compact ordinary-height rows
were being collapsed by the wider body line pitch, not by a fraction identity.

## Minimal Change

Reuse `_row_fragments` to recognize at least two separate ordinary-height
glyph rows inside a merged band. Such rows can enter expansion even below
the body-height threshold and retain their actual row count instead of the
body-pitch estimate. Existing fraction-start and `_single_fraction_row`
checks remain in place. No masks, figure edits, page identifiers, expected
count parameters, or source-content changes were added.

Current tool SHA-256:
`82f801c4fcd1192f538d4d51695e576ddf6c1b3653b7c72e35099004902c94ae`.
This also includes the separately documented earlier clipped-folio fix.

## Verification Already Executed

The final implementation passed4 new compact-row cases,4 related small-footnote
cases,7 fraction-spacing cases and6 compound-fraction cases. Four optional
source-fixture subcases were skipped because their local fixtures were absent.
The new cases cover three full rows, a short final third row, two compact
rows, and a genuine single compact fraction. Related tests were rerun only
after the implementation changed; this report does not run them again.

New test SHA-256:
`95ddc4457642ffe5a7ffc15d15ca0f9010660b2e37a03b69b32d0de2b5829cff`.

Actual p13 finalize passed21/21. MD and the whole page JSON are byte-identical
to the intermediate snapshot. The independent reviewer's audit-only appendix
confirmed exactly two changed fields: `lines_printed`20 to21 and `errors` to
an empty array. Exclusions, body text, row breaks, figure3 crop and source
pixels are unchanged. Final audit SHA-256:
`b3bf5eb308432e2de816ebbf452a4dac3e9012dd42325d9d2238555aeb639059`.

Independent source/changed-only report:
`transcription-review-10c-p11-p14.md`, SHA-256
`999a78150335f014e31d9a7cd6c8c5ee09ce0c4970308fc21386770e9b8be39b`.
All four source pages now reconcile20/23/21/21. P12's three original
cross-block math-fragment warnings remain for assembled-formula validation.
Unit77 remains incomplete. No assembly, publication or full-project check
is claimed by this repair record.
