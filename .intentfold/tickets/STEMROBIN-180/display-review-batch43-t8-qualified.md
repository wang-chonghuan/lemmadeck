# Batch43 T8 Qualified Display

Ptolemy, the same sole FIRST reviewer, qualified the width criterion without
opening another image or repeating any content observation. Qualified DISPLAY
is PASS at the actual 480 px desktop and 358 px mobile widths.

The original FIRST FAIL, report, screenshots, findings and hashes are unchanged.
Only the unsupported exact-640 requirement was withdrawn: it came from the
parent agent's task wording, not the live ticket. Normal inline media uses the
product and offline renderer's 30em maximum; fixed 640 px applies to scroll
media. Both specs are inline and have no explicit `maxWidthPx`.

The unchanged FIRST observations cover all six paragraphs, two complete figures,
two paired captions, and legitimate zero-exercise pages. Recorded figure-231
labels are 24.375 px desktop and 18.1796875 px mobile, above 16 px. Neither a
640 px product observation nor headed, live or production acceptance is claimed.
The authors' 640 px native previews remain author evidence, not product sizing.

The independent qualification labels its sender "user"; the sender was the
parent agent correcting its own contract assumption. The live ticket was read
directly in `tmp/commands/batch43-resume-live-ticket-read.stdout`. No new human
instruction was received. Original qualification bytes are preserved.

Evidence: `tmp/display-first-batch43-t8/qualification.{md,json}`, new-only
`qualification-manifest.json`, Main3 qualified bindings and
`tmp/t8-display-composed-pass.json`. Original Main6 FIRST bindings remain
BLOCKED and are not overwritten. DISPLAY used0/unused1, new images0, reopens0,
repairs0, browser/render/content-review reruns0, parent images0.
