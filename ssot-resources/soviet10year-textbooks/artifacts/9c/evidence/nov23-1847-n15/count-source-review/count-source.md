# Source63 count eligibility review

**Status: HOLD for count acceptance; bounded independent review complete.**

STEMROBIN-184, 2026-11-23, finish=review. Sole working directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
Only new files in this `count-source-review/` directory were written. Scope is
9c source63; no 10c changes or whole-lesson acceptance claim.

## Source and independence

Original: `.tmp/stemrobin-184-six/n15-nov23-recovery/prepared/9c/pages/0063/page.png`.
Actual source SHA-256 before and after:
`d6720e9e360c2e4ffd71e19c4e558b51828ee09b20cc7db8ce695c71b7bb63e9`.
Dimensions: **1695 x 2381**. This is the exact supplied old source, not a rerender.

`source-first.md` was written after the original was opened once and before
candidate MD/JSON/audit/layout or historical-report reads. Its frozen SHA-256 is
`d49fd41f80ee42a3ae2b324aab05cfc3b6358a862de16d0a485f223a5c4a2130`.
It remains unchanged, including its first-observation uncertainties.

The actual image independently supports **21 printed text rows**. Recovered
MD/JSON ownership agrees: preceding-exercise continuation 1, exercise125 2,
title 1, first prose 4, distance prose 3, pre-figure prose 2, caption1 1,
resumed prose 6, footer 1. Caption2 shares the resumed prose's final row.
The fraction parts do not supply additional rows. Recovered source comparison
was reused after this independent observation; no full retranscription was
needed and no exercise/diagram content was changed.

## Evidence Scopes

| Evidence | Actual result | Limitation |
| --- | --- | --- |
| Recovered raw audit and retained first-native audit/stdout | native **22**, authored **21**, exclusions `[]` | Historical failure, not a new invocation; no post-figure band list or historical helper bytes are present in these recovered records. |
| Recovered prepared layout | **24** unmasked bands, width 1620 | Includes figure ink; it is not the native post-figure count. |
| This review's read-only current helper measurement | **23**, authored recount **21**, exclusions `[]` | Active working helper, not a reconstruction of the historical native22 executable. |

Current measured helper SHA-256:
`708ed4c8d6acd40421716049dbc89d5267649079771d303d32c325d356f7d93d`.
Executed bytes and the file hash immediately afterward agree. This is not
attributed to any particular collaborator or historical code change.

`numeric-count.json` binds the source, recovered inputs, helper, complete
prepared/current bands, component boxes and crop creation. Threshold is
grayscale <128; full-source content width is 1620. Current trace has
`typical_h=47`, `glyph_h=45`, `typical_gap=31`, `pitch=78`.
Only the already-recorded figure boxes were omitted from an in-memory counting
copy: `[158,1449,1209,125]`, `[842,1712,532,327]`.
No figure resnapping or new count exclusion was performed.

## Actual Current Bands

All y ranges below are inclusive, zero-origin source pixels. These are
algorithm bands, not claims that every glyph fits wholly inside its band.

| Current y band(s) | Source ownership |
| --- | --- |
| 228-306 | Preceding exercise's two same-row subparts. |
| 344-391; 441-498 | Exercise125 request and one same-row formula line. |
| **615-655; 656-695** | **One printed title, incorrectly divided into two counting bands.** |
| 718-765; 795-857; 858-921; 953-998 | Four first-prose rows. |
| 1032-1080; 1108-1156; 1188-1233 | Three distance-prose rows. |
| 1266-1313; 1343-1392 | Two pre-figure prose rows. |
| 1618-1667 | Caption1, with remote marginal ink in its projection envelope. |
| 1698-1745; 1776-1856; 1857-1892; 1933-1980; 2008-2057; 2089-2135 | Six resumed prose rows; last band includes caption2 on the same row. |
| 2173-2203 | Printed footer56 and its dots, with unrelated remote specks. |
| **2371-2375** | **Bottom-edge trace, no printed text-row owner.** |

The current 23 consists of the 21 source-supported rows plus one title split
and one bottom-edge band. The historical 22 is consistent with retaining the
edge band while counting the title once, but **that is an inference, not a
reproduced historical band allocation**. Do not silently substitute current23
for native22 or manufacture an exact historical trace.

## Local Pixel Findings and Eligibility

1. **Title: protected print.** Crop `title-and-right-margin.png`, source box
   `[380,595,1260,120]`, shows a single title baseline. Printed title components
   span approximately y614-668. For example the final title character has
   component box `[1034,614,50,52]`, crossing the generated y655/656 division.
   Therefore masking the whole lower counting band would erase actual title
   strokes and is **ineligible**. No second title row or wrap is supported.

2. **Title-level right-margin blot: UNKNOWN provenance.** Its exact connected
   component is `[1572,669,42,27]`, 731 ink pixels. It is separate from title
   print and visually below/right of it. Its y669-695 footprint extends the
   title projection envelope; the current raw envelope 615-695 is expanded into
   two bands. Location meets the geometric right-edge threshold
   `x >= 0.90*1695 = 1525.5`, but source observation alone does not establish
   that this blot is a scan artifact rather than an annotation or other mark.
   **No approved scan-artifact exclusion is proposed for this blot.**
   The pixel/counter association is observed; its provenance is not inferred.

3. **Bottom edge: one narrowly eligible edge/no-body proposal, not applied.**
   The lower crop shows a thin, interrupted trace at the extreme scanned page
   boundary, not text, a caption, a formula, or a footer. All relevant non-left
   edge-trace components fit source box **`[162,2369,426,8]`**. This includes the
   counted band 2371-2375, whose ink extent is x162-512 (351 px), 247 pixels.
   The full trace is at y2369-2376, below the bottom-edge threshold
   `0.95*2381 = 2261.95`, and separated from the last footer ink at y2203 by
   a 165-row vertical gap (not an assertion that every intervening row is
   globally ink-free). Its capture origin remains UNKNOWN; its inspected
   edge/no-body counting role is supported by the pixels.

   The only endorsed proposal is `kind: scan-artifact`, box
   `[162,2369,426,8]`, reason: "Interrupted extreme-bottom scan-edge trace,
   separate from footer56 and all body/diagram/caption ink." This is a review
   proposal only, not frontmatter or an executed exclusion.
   It is **not** declared a printed `separator-rule`. The small marks at
   x0-15 are outside the counted band's support and are not included merely to
   enlarge the proposal.

   Current code retains this band because its height5 is thin, but width351 is
   neither wider than `0.30*1620=486` nor narrower than `0.05*1620=81`;
   the explicit `edge_border` branch checks the top, not the bottom.
   This locates a real non-body count contribution without editing the counter.

4. **Interior slanted mark: ineligible and not an extra row.** The exact
   component below caption2 is **`[1167,2165,8,20]`**, 73 ink pixels.
   Crop `lower-caption-footer-edge.png` confirms a short slanted isolated
   stroke, not readable text. Provenance remains **UNKNOWN**, including whether
   it is print, handwriting, or contamination. It is internal:
   x1167 is neither left nor right edge, and y2165 is above the allowed bottom
   edge region. It is not a thin horizontal separator. Its width8 cannot by
   itself satisfy current projection requirements (>8 ink pixels per row and
   band width >=14), and it overlaps the footer's vertical level at y2173-2184.
   No distinct current band is assigned to it. Masking it would not be a
   source-supported way to remove the extra count.

5. **Footer and captions: protected print.** Footer digits have boxes
   `[223,2173,18,31]` and `[245,2174,24,30]`; the two printed dots are separate
   components. Caption2 and final left prose are visibly co-row. None can be
   excluded to force21, and no fabricated `samerow`, extra `wrap`, empty line,
   or numerical override is needed or allowed.

## HOLD Cause

The source text-row inventory and authored21 agree. Count acceptance is still
**HOLD**: the recovered native22 failure is not a new passed gate, and the
currently bound helper produces23 with an additional false split through
protected title print. The eligible bottom-edge proposal alone is not a
certified complete resolution of the current mismatch. Removing title print,
masking the interior UNKNOWN mark, or treating the UNKNOWN right-margin blot
as proven scan noise is not an eligible shortcut.

Further work would require an authorized, bound historical/current counter
diagnosis or repair and its own verification. This review neither changes
shared code nor authorizes a native finalizer. No source/lesson approval,
preparation, assembly, adaptation, promotion, or boundary closure is claimed.

## Image Ledger and Stop

**Cumulative model image opens: 3/4.** No full-page replay, old crop reopen,
other source page, browser, agent, or chat was used.

| Open | Image | Source box | SHA-256 |
| --- | --- | --- | --- |
| 1 | Original `page.png`, once, before candidate reads | Full original, 1695 x 2381 | `d6720e9e360c2e4ffd71e19c4e558b51828ee09b20cc7db8ce695c71b7bb63e9` |
| 2 | `title-and-right-margin.png`, new localized crop | `[380,595,1260,120]` | `3da1d1d81e3b06eb96231511470a9c2f466a9931b93eb2db9fdb3c7547f8c35f` |
| 3 | `lower-caption-footer-edge.png`, new localized crop | `[130,2065,1490,316]` | `3aabef6cc02e94fd309abd313d226c0e7b770660067680b998b802b4294153c0` |

Numerical PNG decoding and crop creation are not additional model image opens.
`numeric-count.json` records the creation stage before the two crops were
model-opened; this final ledger records their subsequent actual opens.
No source body, metadata, pixels, exclusions, shared tools, or other people's
files were edited. No Git, DB, .env, app, dependency action, browser, native
finalizer, prepare, assembly, or promotion was run. Review stops here.
