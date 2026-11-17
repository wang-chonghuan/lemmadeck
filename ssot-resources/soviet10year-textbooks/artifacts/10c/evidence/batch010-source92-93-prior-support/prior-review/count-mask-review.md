# 10c physical 92: bottom count-mask review

2026-11-16 / STEMROBIN-184.
Decision: **ACCEPT** the exact proposed count-only exclusion
`[0,2470,1695,40]`, kind `scan-artifact`.

## Independent source observation

Inspected one genuinely new, native-resolution crop of the actual original:
`[0,2380,1695,200]` in `(x,y,width,height)` coordinates, covering the full-width
bottom strip of the 1695x2580 source.

The strip contains a thin, irregular, interrupted horizontal trace across its
left/central portion, plus sparse isolated scan specks. It has no readable text,
numeral, formula, caption, folio, figure component, or structured printed rule.
Its broken and uneven outline is scan-margin artifact, not a source object.

The proposed rectangle spans original x `[0,1695)` and y `[2470,2510)`;
inside the crop this is x `[0,1695)`, y `[90,130)`. It covers the horizontal
artifact without covering any source content or folio. The reported layout band
`[2484,2488]` lies inside this rectangle (crop-local y 104-108), consistent with
the visible trace. The whole inspected bottom strip is free of source content.

Acceptance is for masking this scan-only area in the counting copy, not for
altering original pixels, adding/removing transcription rows, or imposing an
expected line total. No gate was run; the reported 20-print/19-MD failure and
layout coordinates were supplied by Parent, not independently recomputed here.

## Source and evidence

Original:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c90-93/10c/pages/0092/page.png`

Original SHA-256, unchanged from Stage A:
`e93bf21a0bb1774f3d23a8f3bcae568de1f37242fcb696a3187287860c0b9991`

New native crop beside this report:
`count-mask-p0092-bottom-native.png`

Crop SHA-256:
`8bb17ccd19aa8afd671676117dc5c8dec836276a051ff9949036d4f73e01356a`

Lifetime image open 8: this crop alone, once, original detail.
Permanent allocation now **8/8**, context **8/24**.
No full-page or old-crop reopen; no image payload returned to Parent.
Only this new crop and report were written. Stage A, Stage B, their ledger,
durable MD/metadata, and source pixels were not changed. No further review added.
