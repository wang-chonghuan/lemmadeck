# N88 Ready Prose Affected-Only Review

Status: HOLD (visual coverage only). SAME STEMROBIN-184 /184-6, finish=review.
Date: 2026-11-22. Sole write root: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n88-ready-prose-display-affected-first.

## Findings

- P2: Desktop block5, block8 paragraph7 and section boundary1 lack a new actual visual
  observation. First screenshot saved successfully but its IHDR is 736x804, whereas
  its requested clip was 736x2065. The first non-full-page screenshot was truncated
  at the original viewport bottom. DOM checks for those regions PASS.
- P3: Mobile boundary2's exact anchors and DOM rule/spacing PASS. The rule cannot be
  independently distinguished in the figure-masked new image.
- Eight successful screenshots were viewed once each in a single batch of eight.
  No ninth capture/view or old screenshot replay was performed.

## Passed Evidence

All eight affected blocks comprise 21 paragraphs. Each viewport inspected these
plus 5 additional boundary-anchor paragraphs: 26 actual paragraph observations,
with all five adjacent pairs exact. Desktop1440x960 and mobile390x844 ran headed
Chromium149.0.7827.55 using the installed app Playwright copy and an offline file URL.
Chinese body size16.96px, font/weight consistent, text-indent0, Chinese glyph clipping0.
Document/client widths desktop1425/1425, mobile375/375; no full-page horizontal overflow.
Sentence grouping uses 2-3 independent rows, with attached formula rows and short
bridge/qualifier/equation-label tails explicitly recorded, not counted as long prose.

The actual HTML has42 p.para nodes, not50 paragraphs. The50 proseFlow items are
42 paragraphs +4 figure items +4 captions. Count preparation's first exit1 was
preserved; only this mapping was recovered. No render/finalizer was replayed.

Four canonical lesson/exercise/figure-manifest/audit files byte-match raw ready and
retain the four supplied SHA-256 hashes. Four promoted specs differ only at
/source/image/path; four SVGs are byte-exact. Active current spec/render/review/source
and output bindings are valid, durable and hash-current. Substantive old notes and
render measurements are exact, not repeated. Historical promotion provenance is not
a runtime dependency. Native canonical finalizer's original actual exit0 receipt
and both complete streams were checked and reused.

## Actual Receipts

intake-first exit1 (42 vs50); targets-recovery exit0; desktop-first exit1
(second screenshot clip); desktop-capture-only exit0 (remaining bands2-4 only);
mobile-first exit0. Each local execution.json records cwd, executable, argv,
exit/status, timestamps and complete stdout/stderr bindings. First desktop script
was retained before the one-line fullPage correction for the unrun mobile stage.
No passed desktop assertion stage was replayed.

findings.json binds receipts, all eight PNG paths/hashes, actual dimensions,
observations, canonical files and usage.json. seal's own receipt is in seal-first/.
No PNG/SVG or source/crop image is returned to the parent; these paths are evidence
references, not an invitation to reopen the whole batch.

## Usage And Limits

Parent permanent24/24, inheritedcharges74, paid0, feesUNKNOWN, complete0 unchanged.
Actual screenshot attempts9: successfulfiles8, failedcalls1, imageviews8.
Singlebatch8, contextloads8/24. Figure/source/crop/old-image views0, model/paid calls0,
render/finalizer replay0, network/backend/DB/Git/install0, canonical/app/ticket edits0.
All browser contexts, browsers and subprocesses closed.
Original science/source/crop/math/figure/choice/written-display PASS is reused.
Encoding, decorative and offscale UNKNOWN remain. No completed lesson is claimed.

Only a separately authorized bounded new visual observation of the named missing
regions remains; already passed assertions and inherited image reviews must not
be repeated.
