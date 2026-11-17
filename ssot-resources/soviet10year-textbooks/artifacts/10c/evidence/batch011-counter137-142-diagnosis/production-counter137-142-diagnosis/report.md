# STEMROBIN-184 Session B: Bounded Computational Diagnosis

Status: DIAGNOSIS_COMPLETE; 137_TRANSFERRED_TO_PARENT; WAIT.

Date: 2026-11-17. Same authorized IntentFold cap3 invocation.
Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Owned output directory:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter137-142-diagnosis`.

## Scope and Evidence Limits

- Computational diagnosis only. Zero images viewed, emitted, plotted, or saved. Pillow decoded only the three remaining authorized native source files into numerical arrays.
- No full-page count, `line_bands`, prepare, finalize, test, browser, network, git, database, publisher, app, dependency installation, live-ticket read, setup, or refresh was run. The diagnostic importer replaces `line_bands` with a function that raises immediately.
- Only this new output directory was written. Existing production code, metadata, exclusions, Markdown, source images, expected rows, and other workers' files were not edited.
- No count/finalize/test was run on 133/134 or passed physical pages 135/136/138/139/143. Shared review documents contain historical rows for other pages; those textual reads are not new page checks.
- All totals below come from already consumed first-finalize audits and independent source-first observations. No mathematical reconstruction or fresh total is supplied.
- Source-component boxes are exact numerical ink bounds at grayscale `<128`; semantic roles are attributed from immutable source text and horizontal placement, not a new visual glyph reading. Coordinates are native XYWH; saved vertical bands use inclusive endpoints.
- Local helper sensitivity checks use scales 42, 44, 46, 48, 50, 52. These are not claimed to reproduce the complete page's runtime `line_h` or `glyph_h`. They explain local rejection paths without computing a page-wide scale or total.
- Prepared `layout.json` bands are existing preparation evidence, not a newly generated first-finalize trace. On 140/141 there are no figures or exclusions; their saved 22/25 bands agree with the recorded first-finalize totals. On 142 the prepared projection includes figure ink, so its middle-page bands must not be represented as the masked finalize trace.

## Recorded Failures

| Physical Page | First Finalize Printed | Markdown | Independent Source | Difference | Diagnosis |
| --- | ---: | ---: | ---: | ---: | --- |
| 137 | 21 | 20 | 20 | +1 | Parent now owns its source-observed footnote separator exclusion; no further diagnosis here |
| 140 | 22 | 18 | 18 | +4 | Four saved integral-row envelopes split in half; small printed ancillary roles reject carrier ownership |
| 141 | 25 | 23 | 23 | +2 | Two saved integral-row envelopes split in half; analogous star/comma rejection |
| 142 | 23 | 21 | 21 | +2 | Two existing bottom-edge bands survive the intermediate-width decoration filter; not the chapter separator |

All four first-finalize audits have zero normalizations, empty `unknown_chars`, empty `katex_warnings`, and only the count discrepancy. Those automated empty lists do not resolve source-level UNKNOWNs.

## 137 Ownership Transfer

The subsequent human instruction transferred the immediate 137 decision to the parent. Already consumed independent `source-first.md` text identifies the footnote separator approximately `[240,2074,487,9]`; the parent additionally reports an existing prepared standalone band `[2075,2080]`. The independent 20-row inventory excludes that separator.

The parent will make only the 137 metadata separator-exclusion decision using those frozen observations, with no new image and no counter patch. This subtask does not authorize, implement, verify, or recount that change.

Preserved work before transfer: audit/text/code reads, and command `020-geometry137`, which exited 1 at `import numpy` under the system Python before any image decode. No successful 137 numeric image analysis occurred. No 137 page/image/metadata access was performed after transfer; the final frozen-input check deliberately omits 137's mutable durable files.

## 140: Four Concrete Integral Oversplits

Independent source row anchors: source-first physical-140 table R06, R08, R09, R17. Each is one printed row; R06 has two side-by-side starred exercises, not two vertical rows.

| Source Row / Owner | Existing Saved Bands | Integral Carrier Source Boxes | First Rejecting Ancillary Box at Scale 46 | Attributed Role | Body-Core Y Intersection |
| --- | --- | --- | --- | --- | --- |
| R06, 505/506 shared row | `[752,804]`, `[805,857]` | `[282,754,20,92]`; `[915,761,23,94]` | `[232,774,19,18]` | printed star before the first integral | `[794.25,800.25]` |
| R08, 509 subitem a | `[1026,1073]`, `[1074,1121]` | `[354,1028,24,93]` | `[745,1080,11,18]` | comma after the integrand/differential run, before parameter condition | `[1063.5,1073.0]` |
| R09, 509 subitem b | `[1157,1206]`, `[1207,1256]` | `[352,1163,23,93]` | `[734,1220,9,17]` | comma after the differential run, before parameter condition | `[1201.75,1211.25]` |
| R17, 515 | `[2126,2172]`, `[2173,2219]` | `[275,2125,19,94]` | `[225,2149,19,19]` | printed star before the integral | `[2176.25,2176.75]` |

These pairs partition the entire tall envelope at its approximate midpoint, not at a separately established printed baseline. They provide four concrete extra-band locations consistent with the recorded +4. No delta was used to select an exclusion or modify text.

### Production Rejection

Current frozen `_single_carrier_row` (`layout.py:1003-1055`) establishes body glyphs with a height lower bound of `0.6*glyph_h`, intersects their central halves, then examines smaller components outside that intersection. Every such component must be near a tall narrow carrier; otherwise it returns false at line 1050.

At scale 46, each box above is smaller than the body lower bound, misses the narrow body-core intersection, and has `nearest=[]`. These are legitimate source-observed stars/commas, not integral limits and not extra lines. The body's skew/font-height mixture makes the common intersection narrow, particularly the half-pixel interval on R17.

`_single_fraction_row` returns false on all six sampled scales for all four suspects. This is not proof of multiple printed rows: the fraction helper begins by requiring an accepted horizontal bar. Integral-only rows need not have such a bar. Existing `_bounded_carrier_limit_ownership` can own several actual endpoint groups at the lower sampled scales, but cannot rescue the no-rule early return in `_single_fraction_row`, and it does not classify remote printed punctuation.

The later expansion at `layout.py:1333-1375` gates on carrier/subscript/fraction evidence and then estimates multiplicity from tall envelopes. A carrier false negative therefore exposes a one-row integral envelope to splitting. No expansion or page count was invoked here.

### Integral Limit Geometry, Not Noise

For R08, existing bounded endpoint ownership at scales 42-46 finds upper-group boxes `[381,1026,13,19]`, `[396,1026,13,11]` and lower `[381,1102,13,20]`.
For R09 it finds upper `[378,1158,13,24]`, `[394,1162,13,11]` and lower `[378,1238,14,19]`.
For R17 scales 42-44 find upper `[298,2126,12,19]`, lower `[297,2204,17,16]`.

These belong to carrier endpoints; they must not be turned into exclusions. The particular rejection boxes in the table are instead small body-owned printed ancillary roles. Both kinds need ownership, not pixel erasure.

### Fraction and Other Controls

The 504 displayed fraction R02 has one saved band `[338,420]`. The inline fraction on source R03 has a body fragment `[479,540]` and detached denominator fragment `[548,557]`; source R04's ordinary text is `[573,617]`. Existing saved bands `[477,547]`, `[548,617]` still represent two bands for two independently observed rows, but place the fraction denominator with the following row. This is a boundary-ownership risk, not one of the four extra rows. Do not delete the denominator, insert an extra Markdown row, or merge the two genuine source rows.

Saved R07 `[886,1019]` includes a tiny next-row head fragment near `[314,1017,15,3]`; that also is a boundary concern, not an additional saved row.
R11 `[1385,1484]` and R12 `[1515,1621]` remain single saved bands; at scale 46 their existing fraction helper returns true despite carrier rejection on stars. Do not force every minus/equality stroke to become a fraction rule to generalize that accidental rescue.

The measured margin components `[1594,630,16,13]`, `[1619,662,12,12]`, `[1600,828,14,11]`, `[1597,1359,11,10]`, `[1595,1556,11,10]` are retained as an unclassified numerical margin inventory. They do not explain the four identified midpoint splits and are not proposed exclusions.

## 141: Two Concrete Integral Oversplits

| Source Row / Owner | Existing Saved Bands | Original Carriers / Delimiters | First Rejecting Ancillary Box at Scale 46 | Attributed Role | Body-Core Y Intersection |
| --- | --- | --- | --- | --- | --- |
| R01, 516 first row | `[233,279]`, `[280,326]` | integrals `[389,233,22,92]`; `[633,233,23,94]` | `[343,260,17,16]` | printed star before first integral | `[278.75,284.25]` |
| R07, 519 | `[858,907]`, `[908,957]` | absolute-value delimiters `[403,858,5,100]`, `[619,858,8,101]`; integrals `[420,861,22,94]`, `[685,862,23,93]` | `[928,912,10,17]` | comma after the right differential, before the condition | `[897.25,910.5]` |

Both reject at current `layout.py:1050` with `nearest=[]` at scale 46; the same carrier/fraction rejection persists through all six sampled scales. These are the two saved extra-band locations consistent with the first-finalize +2, not two missing Markdown rows.

For 519, numerical mirroring of only the selected band's existing tall-streak cleanup removes the two straight absolute-value delimiter components on a counting-only local copy. Original source components remain intact and available as context. That cleanup is a secondary ownership concern: a generic repair must preserve delimiter context rather than infer that actual printed absolute-value bars are scan streaks. Neither integral carrier is removed in those local checks.

Controls: 517 R03 `[438,528]`, 518 R05 `[648,741]`, and 520's display R11 `[1238,1329]` are single saved bands. At scale 46 the first two are rescued by the current fraction helper; 520's simple integral passes the carrier helper directly. This difference explains why all definite integrals are not split uniformly.

### UNKNOWN518 Is Protected

The small detached mark near 518's x/comma run is still UNKNOWN. No box is asserted to identify that mark, no character intent is assigned, and no exclusion, noise label, derivative interpretation, added punctuation, or accepted mask is proposed for it. Its native source array and all source text remain unchanged. Its existing saved R05 band is not one of the two extras.

The 518 control merely passed the unchanged source row into existing production helper predicates; their internal scratch operations are not new source classifications or durable masks. The recommended proof below must specifically retain UNKNOWN518 rather than generalizing "small remote mark" deletion.

The left-margin component inventory `[13,633,15,13]`, `[10,828,14,11]`, `[21,1359,13,10]`, `[23,1554,10,12]` remains unclassified. No margin exclusion is recommended to fix 141.

## 142: Two Bottom-Edge Regions, Not a Separator Oversplit

| Existing Saved Band | Exact Native Ink Envelope | Ink Pixels | Complete Source Components | Maximum Complete Component Height | Gap Below Last Saved Footer Band |
| --- | --- | ---: | ---: | ---: | ---: |
| `[2479,2481]` | `[772,2479,133,3]` | 64 | 17 | 3 | 190 px |
| `[2485,2488]` | `[1404,2485,244,4]` | 116 | 34 | 3 | 196 px |

These are bottom-edge scan-mark candidates: tiny fragmented components outside the independently observed 21 printed rows and below the saved footer `[2257,2288]`. Existing source-first evidence reports margin/edge marks rather than additional legible text. This diagnosis is numerical localization, not a newly inspected visual approval.

### Exact Filter Failure

The current final decoration filter (`layout.py:1383-1428`) uses:

- `thin = band_height < 0.4*typical_h`;
- a width condition requiring `band_w > 0.3*content_w` or `band_w < 0.05*content_w`;
- a top-edge test `a < 0.02*page_h`, not a corresponding general bottom-edge test;
- special bottom folio preservation.

Here `content_w=1695`, so the width cutoffs are 84.75 and 508.5. Widths 133 and 244 lie between them; the width condition is false even though both envelopes are thin throughout the sampled 42-52 scales. Consequently the decoration expression cannot remove either band through that branch. Their complete original components are only 1-3 pixels high, not complete body glyphs or folio digits.

The figure box `[727,1086,631,1048]` does not intersect either candidate. Figure removal leaves their pixels unchanged. Local predicates plus already saved bottom bands explain a concrete +2 mechanism without generating a masked page total.

### Separator and Text Controls

The independently identified chapter separator has exact connected-component box `[113,628,1264,11]`, area 9493. A nearby unclassified margin component `[1594,626,15,13]` widens the combined local envelope to `[113,626,1496,15]`. This envelope is thin for all sampled scales and is over the wide cutoff. It is absent from existing saved bands and would satisfy the current decoration-width branch. It is not the concrete +2 diagnosis; adding only its exclusion would not address the two retained bottom bands.

The chapter title is still two genuine rows. Local formula fragments `[1204,1249]` and `[1286,1328]` belong to the already approved equality split across R08/R09 and must remain two rows. The caption and final prose share the local `[2171,2215]` projection, consistent with the source-approved shared row; no caption duplication is diagnosed.

The right-edge component `[1600,818,15,17]` is not in the saved bands. Its surrounding y-window also contains unrelated short punctuation at x841, so the combined `[841,818,774,17]` window must not be misrepresented as that component's own box.

Figure 67's exact grid dimensions and terminal x-axis arrowhead remain UNKNOWN. No graph interior was inspected, counted, redrawn, regularized, or used to supply mathematical facts. Figure 64/65 O/0 UNKNOWNs remain untouched.

## Smallest Generic Prerequisites, No Patch

### 140/141: A Local Ownership Proof Before Any Counter Edit

1. Bind the six exact suspect envelopes and their complete source-component context to the source and frozen-layout hashes. Retain independent row ownership as an external witness, not a target inferred from current outputs.
2. Establish a generic body-owned ancillary-role relation for small printed stars/commas outside a narrow central-half intersection. Separate this from integral endpoint ownership. Require a demonstrated common full-body row and spatial support; do not discard every short component or widen a gap globally.
3. Ensure original integral/absolute-value delimiter components and endpoint groups survive as ownership context even when the counting-only cleanup suppresses a stem. The no-horizontal-rule integral case needs a carrier proof; it must not depend on interpreting unrelated equality/minus strokes as fraction bars.
4. Before a separately authorized smallest production change, prove the local positive cases (single integral plus star/comma, side-by-side integrals, multi-glyph limits, source skew, absolute-value carriers) and negative cases (two independently supported adjacent rows, stacked fractions, tiny legitimate final numbers, and 140 R03/R04). Include a protected-UNKNOWN case retaining 518 unchanged. These are proposed proof prerequisites, not tests run now and not requirements copied from old test assertions.

The narrowest likely implementation surface is `_single_carrier_row`/its existing ownership support. Do not begin with page IDs, expected totals, Markdown rewrites, new exclusions over printed formula roles, a broad projection-threshold change, or a full counter refactor. A local helper result is not a claim that an unimplemented fix passes production.

### 142: Existing Metadata Is the Smaller Immediate Route

If the parent separately authorizes using the already consumed nontext-margin observation plus these exact numerical bounds, the two minimal candidate `scan-artifact` boxes are `[772,2479,133,3]` and `[1404,2485,244,4]`. Both satisfy the existing bottom-edge geometry predicate (`y >= 0.95*2580 = 2451`) without a schema change.

Prerequisites: bind to the native 142 source hash, record an attributable nontext reason and its frozen source-first reference, retain all footer/figure/other source pixels, and distinguish this computational localization from independent visual box approval. If existing broad margin testimony is insufficient for that exact semantic decision, keep the candidates pending; this report does not manufacture a new source witness or authorize another image.

Do not use a whole-bottom-page mask, do not add the already filtered chapter separator merely to chase the delta, and do not alter the source-approved 21 rows. No metadata was changed here.

## Frozen Paths and Hashes

Frozen production layout:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py`
SHA-256 `5a40298cf32590aa93fc87d5b158efda0e6d85b1defbfe7b8d3fb8a515c325b7`.

Frozen native sources:

| Physical | Absolute Source Path | SHA-256 |
| --- | --- | --- |
| 140 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c140-143/10c/pages/0140/page.png` | `4eb984096f1d32e336a878c18bb0bb6b6f5aec2df163a284f29ccef1ce335f0a` |
| 141 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c140-143/10c/pages/0141/page.png` | `51796ced1bb6abc743e56b8ebeac3d332fcf6fe64b6511af4929878418779264` |
| 142 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c140-143/10c/pages/0142/page.png` | `90c06b974b29b8f8ea14493c559a53ff763d35d6c4297c96cafcb883ee7cab0c` |

Saved layout hashes: 140 `bb265f76f32339a43d19b72b55759f452f5ed74a9f79c2df42a9c7bca7e36a28`; 141 `06ca075de33054de7a5e16cc15ea40fe7948a76f250398f659b24a516b7ba6df`; 142 `9544d9a2b82cb3f087de3b0133af535f924651bff687530ded78ac0179e21a15`.

Independent 140-143 source-first text:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c140-143-review/source-first.md`
SHA-256 `b7d04339ecb441bc965bb230f56f6045c4628b766a0e3c602da20695df450518`.

Complete source/tool/durable/first-operation hash inventory:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter137-142-diagnosis/032-input-freeze-before.stdout`.
The final seal rechecks these exact paths/bytes, excluding transferred 137 durable inputs.

Full numerical evidence is preserved in `023-geometry140.stdout`, `024-geometry141.stdout`, `025-geometry142.stdout`, `029-local140.stdout`, `030-local141.stdout`, `031-local142.stdout`, and `036-exact-suspect-details.stdout` under the owned absolute directory above. No file contains an image payload.

Every recorded execution has arguments, cwd, exit code, separate exact stdout/stderr files, and SHA-256 hashes in owned `commands/*.json`. Failed commands are retained, not hidden: 014 addressed a nonexistent `tools/page.py`; 019 found no tracked pyvenv config; 020 system Python lacked numpy and stopped before image decode; 021's read-only runtime inventory listed several absent paths. The already installed skill `.venv/bin/python` then ran the successful numeric scripts; nothing was installed.

Bootstrap `pwd` predates the recording helper; its captured output is reconstructed byte-exactly and hashed during sealing. Older runner records are enriched with their wrapper invocation arguments during sealing. All manual script/report edits used apply_patch; generated logs and hashes were written only within the owned directory.

The final freeze writes `hashes/SHA256SUMS`, `hashes/manifest.json`, and the self-recorded freeze command/stdout/stderr, verifies recorded stream digests, and makes all owned outputs read-only. The manifest's own digest is returned separately to avoid recursive hashing. The final self-record/streams are outside that manifest and record their exact stream hashes plus its digest; all preceding command streams, scripts, and this report are covered by the manifest. This is a sealed diagnostic report, not a passed production check.

WAIT. No subsequent operation is authorized by this report.
