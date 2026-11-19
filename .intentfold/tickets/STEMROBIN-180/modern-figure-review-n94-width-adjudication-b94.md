# n94 / b94 Width Adjudication

2026-11-19. STEMROBIN-180, offline C, finish=review. Independent reviewer: n94-FIRST-FIG.

## Verdict

**Independent FIG PASS for both unchanged candidates.** This adjudicates only the corrected WIDTH criterion and reuses the original source/scientific/visual PASS verdicts and four image observations. No new full figure review occurred.

Parent H01, corresponding to original finding `N94-FIRST-FIG-E1`, is **resolved as an invalid premise**: the parent explicitly withdrew its erroneous actual 340 px requirement. The skill requires measured actual media width, not a hypothetical 340 px column. Actual inline widths are 640/358/297 px; actual fixed scroll media is 640/660 px.

The original HOLD remains unchanged and frozen. FIRST manifest SHA `4cce3ba03e10d684bf5c629b68dca0235276f8e80a6018f840778dddabd5c693`, 328 verified hash-binding occurrences, 269 unique paths. Original report SHA `0c7969c9ab39e2117505bf7773a93c5423e52a8489a32e26e5390e55be869e8d`; original durable review SHA `bb51ce68b89a2e6fa2b016177b5d50d1d87ef3484a50ad6d07713d4c59ed493b`.

## Measured Widths

| Figure | Layout | Actual Media Width | Minimum Native Text | Observations |
| --- | --- | --- | --- | --- |
| fig-226 | Inline | 640 px | 38 px | 7 |
| fig-226 | Inline | 358 px | 21.25625 px | 3 |
| fig-226 | Inline | 297 px | 17.634375 px | 2 |
| tbl-p0247-01 | Scroll | 640 px | 17 px | 10 |
| tbl-p0247-01 | Scroll | 660 px | 17.53125 px | 4 |

Both frozen specs declare every measured width. Fig-226 stays within its 640 px maximum and actual client width. The 297 px exercise-helper media has actual native neutral/accent observations; the 358 px offline mobile prose media is also actually measured. The scroll table retains fixed 640/660 px media regardless of its narrower client.

All 26 per-figure native observations match the frozen aggregate report. Every label's screen size agrees with the spec font size scaled by actual media width, stays at least 16 px, and has `insideSvg: true`. Actual height preserves the canvas aspect ratio. Page overflow is zero; existing scroll ends are reachable with the required endpoint columns visible. No legitimate width gap remains.

## Evidence Reused

- Author `width-probe.json`: SHA `d85fbb8529e38c75a8ae0c168c24412470f30d479ce97d9fc19fe383d1101025`; 12 existing current-CSS helper geometry rows.
- Author `native-offline-report.json`: SHA `0d034a89173a6097dcd0e87fe0d4fb0666dabb9e7199bb79cfd44ff15c4229c0`; 26 existing observations and 4 final offline text/exercise surfaces at desktop 1440 px and mobile 390 px.
- Existing fig-226 combined-native image: SHA `c5b0e8bcdb7b1cd7ed318d1d43a21ff63b17e810061b05830cd51b92ad7e31fa`.
- Existing table combined-native image: SHA `b5f3f48d47b2ef245d939ad4343bf9f9dbcedfdfaf56d869f0d06795cd52d831`.

All source/figure/spec/render/capture bytes remain unchanged. Image hashes were checked without opening images. The original two genuine author first-render failures and one exhausted repair per figure remain historical facts; no usage or repair-budget reset.

## Scope And Freeze

Counts: 2 FIG PASS, 5 measured width variants, 26 native observations reused, 12 width-probe rows reused, 4 offline surfaces reused, 4 original image observations reused. New images/crops/reopens/renders/full figure reviews/repairs/paid calls/model calls/canonical writes: **zero**. Invalid-premise HOLD resolved: 1; legitimate width gaps: 0.

No deformation to 340 px, official `ld-s10y-image/review@1`, publication approval, promotion or finalization.

New artifacts under `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-FIG-width-adjudication/`: `report.json`, `output-manifest.json`, and `freeze-receipt.json`. Width audit receipt: `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/commands/n94-width-005-audit-1.json`.

This Markdown, report, and manifest are immutable `0444` and bind original HOLD provenance, unchanged inputs/evidence, and closed recorder receipts. The detached freeze receipt binds the manifest and completed seal command without circular hashing. No original artifact or foreign permission changed.
