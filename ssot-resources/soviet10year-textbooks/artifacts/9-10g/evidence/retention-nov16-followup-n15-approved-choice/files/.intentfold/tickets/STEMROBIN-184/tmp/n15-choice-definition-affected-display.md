# n15 Definition Repair: Affected Display

The parent opened exactly four existing screenshots once, without browser reruns
or source/option mathematics review. Current Q1/Q2 text and all alternatives are
legible at desktop 1440x960 and mobile 390x844. No overlapping text, clipped
question controls, missing alternatives, or error-only state was observed.
The full title wraps on mobile without overlapping the question.

| Screenshot | SHA-256 |
| --- | --- |
| choices-n15-q1-1440.png | 6963283cdab4a1f564919be7ce8516be4e7122217e329816308d1f3b0c125f6c |
| choices-n15-q1-390.png | e53b975934b6a00d22ff9fdee26b1d47a3a350d9f4d5833cb4001d4b6aa299e3 |
| choices-n15-q2-1440.png | 180af90440ae3f20f34cce3ce7624555461d0fd316a9d88a5b04d172cd0b0bab |
| choices-n15-q2-390.png | 13715c1cfca3d7f4c4de7a653ccf71216e76e128566540471b8034284d444890 |

Paths are under
`.intentfold/tickets/STEMROBIN-184/tmp/offline/geo910-c1-s2-n15/`.
The corresponding choices-n15-q1-report.json and choices-n15-q2-report.json each
record a single isolated-headless browser invocation, desktop/mobile geometry,
all option bounds, actual SVG label sizes, and scroll-end reachability.

Q2 desktop shows the whole current figure with its point labels, plane and
reference line. Mobile screenshot is deliberately at the right end of the
640px scroll media: left-side points are outside this scroll position, not
missing from the asset. The existing figure approval and unchanged asset bytes
are reused; this is not a new full-source figure fidelity gate.

Result: PASS for the two changed question displays. Q3-Q7 are unchanged and their
existing full-package display evidence is reused. This does not certify judging,
database persistence, headed/OS behavior or product integration.

Image ledger: this batch 4 opens, all successful, no crops or reopens. Parent
context cumulative count is now 24/24; no more parent image loads in this context.
