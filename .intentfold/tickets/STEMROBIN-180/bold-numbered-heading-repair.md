# Bold Numbered Heading: FIRST Failure and Sole Repair

STEMROBIN-180/C, 2026-11-16. Approved SOURCE pages 265-267 were assembled
once. The command returned exit 0, but the fully bold numbered headings
103 and 104 became anonymous x2/x3 entries with null card IDs. FIRST output
remains unchanged in `.tmp/ld-s10y-lesson/approved-7p-265267/`; the observed
identity failure is frozen in `tmp/7p-bold-heading-FIRST-failure.json`.

The sole parser repair unwraps a complete outer bold pair only when matching
the printed numeric heading. Printed title and all SOURCE blocks remain exact.
It does not rewrite SOURCE typography or invent TOC identity.

The focused test command ran once and passed three cases. Its receipt is
`tmp/commands/batch24-bold-heading-focused-tests.call.json`. This is not
a full project test run or formal handoff.

The affected approved cohort was copied to
`.tmp/ld-s10y-lesson/approved-7p-265267-heading-repair-01/` and assembled once.
103/104 now have their authoritative TOC IDs. n103 prose, figures and all
five tasks were compared structurally with the preserved FIRST outputs and
are unchanged. Only complete n103 was retained from that cohort.

The subsequent approved continuous 267-269 cohort was assembled once with
the repaired parser. Only complete n104, four tasks and no figures, was
retained. Prefix n103 fragments and unfinished n105 were excluded.
The existing orphan-cont warning on the cohort's incoming prefix remains
historical evidence; it does not certify the excluded prefix as a full unit.

Repair budget: 1/1 exhausted, mechanical-inclusive. No substantive SOURCE
re-review, image opening, global reassembly, DB operation, publication,
application/dependency/schema change, merge, deployment or closure.
