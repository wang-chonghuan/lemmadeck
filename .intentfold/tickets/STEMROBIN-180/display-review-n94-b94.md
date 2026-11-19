# STEMROBIN-180: Independent n94 DISPLAY Review

Status: **pass**. Lesson: `phy7-c1-s1-n94`. Finish: review. Loaded images: **8/8**, exactly six existing native screenshots plus two supplemental contact sheets, with no reopens or other lesson images.

Scope: existing offline file HTML at desktop 1440x960 and mobile 390x844, surfaces text/exercises/choices. Native counts/errors/geometry are reused from the hash-verified passed report, selecting only its six n94 rows. No whole acceptance or semantic SOURCE/CHOICE/ANSWER rerun.

## Observations

- Text, desktop: Chinese short prose, q/Q/Q=qm, fractions and powers are legible without overlap. fig-226 is a nonblank inline 640x320 diagram. The 640x1000 fuel table contains 12 data rows and three columns; the final formula, definition and navigation remain visible.
- Text, mobile: short prose/formulas wrap in the 358 px usable column. The actual native fig-226 size is 358x179, with distinct O/C labels and arrow. No blanket 340 px request. The table intentionally has its own horizontal scroll area; actual endpoints are 0/282 px.
- Exercises, desktop: eight written tasks, split into two groups of four, remain readable through the last task and return link. The table occurs once under ex-g2-1.
- Exercises, mobile: task numbers, prose and formula text stay separate in the narrower task-body layout. Its 640 px table uses an approximately 310 px scroll area; actual endpoints are 0/330 px. Middle/right positions expose the complete Coal intervals, and bottom/end captures expose Hydrogen and 30000 with intact borders.
- Choices, desktop: four stems and 18 options render legibly with aligned checkbox/radio markers, units and powers. Three complete tables belong to q2, q3 and q4, not an exercise-sharing duplication.
- Choices, mobile: all stems/options wrap legibly through the final option. Each repeated figure ID was selected by actual occurrence and mapped to choice-n94-q2/q3/q4; every table reaches actual 0/282 px endpoints and shows its final row/rightmost value at the bottom.

All five actual mobile table occurrences preserve the 12-row, 3-column display, Brown coal (Moscow region), Coal's complete J/kg interval 2.7x10^7 to 3.0x10^7 and kcal/kg interval 6500 to 7500, ending with Hydrogen / 12x10^7 / 30000. Initial partial table columns are recoverable in-figure scroll clipping, not content loss.

No overlap, unrecoverable cutoff, blank media or visible answer-key metadata leak was found. The native n94 rows report zero formula errors, zero document overflow, leakedFields=false, lastVisible=true, eight written tasks, four choice questions and 18 options. Parent-passed actual minimum-text geometry is reused, not repeated.

## Evidence

Root for every command:
`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`

Native report:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/display-b94/7p/report.json`

Verified SHA256:
`087e2d1a21f9f6a28d071d0869c6a3fc49a3fe09fbce06ec18bde86ef8867dfb`

New evidence directory:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-display-b94/`

That directory contains `inputs.json`, `mobile-scroll.json`, all 20 actual browser viewport crops, the two opened contact sheets, `report.json`, supplemental scripts and `manifest.json`. The manifest binds exact absolute paths, SHA256 and bytes for inputs, outputs and recorder receipts, with crop-to-sheet derivations and the eight actually loaded image bindings.

## Limits

This is headless Chromium with the installed app Playwright copy, context offline=true, existing file URLs, and no server. It is not live app or formal headed acceptance, DB publication or deployment verification. The native screenshots are full-page captures at the assigned viewport sizes. The contact sheets preserve native crop scale and add reviewer-only labels; lesson HTML/content was not modified. Browser/context were closed in finally. No external requests, console errors, page errors or technical failures occurred.

Only the new evidence directory, this note and uniquely labeled recorder receipts were written. No source/content edits, environment/DB/publish/deploy/paid calls/dependency/app/git actions or other-agent operations occurred. Outputs and manifest are sealed 0444. The final seal/verification recorder receipts bind the immutable output hashes after command completion, avoiding a circular manifest self-hash.
