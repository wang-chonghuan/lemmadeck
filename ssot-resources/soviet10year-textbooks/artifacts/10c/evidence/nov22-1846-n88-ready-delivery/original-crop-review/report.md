# N88 Original-to-Existing-Crop Preservation Review

STEMROBIN-184 /184-6; finish=review; 2026-11-22. Result: PASS for fig-38, fig-39, fig-40, fig-41 at the optical figure-object preservation boundary only. No concrete figure-object content defect found; no crop or metadata correction requested or performed.

R = /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck

W = R/.tmp/stemrobin-184-six/source10c5255-work/10c/pages

Evidence directory = R/.tmp/stemrobin-184-six/n88-original-crop-gap-first

The evidence directory initially did not exist (read-only shell test exit 0). The first evidence write was original-freeze.md, after all three sole original-page views and before any crop read/view or page/audit metadata read. Its frozen SHA256 is a78deb8366fd31d2bd869ada54b65e2d0bc08b7f2a9fb6525f56f4adcbc5159d.

## Optical Findings

| Figure | Verdict | Concrete retained content |
| --- | --- | --- |
| 38 | PASS | Both axes, arrows and labels, one complete printed solid branch, right dashed boundary with both extremes, round origin glyph and stacked label are intact. Detached hook near original (654,1642) and ink near (847,1906) are retained. No figure clipping or foreign prose. |
| 39 | PASS | Five solid branches with all printed ends, five dashed boundaries, central solid vertical axis, horizontal axis/arrows and all original label groups remain. Irregular ink near the right-of-center dashed boundary remains. Origin glyph retained without deciding 0 versus O. No figure clipping or foreign prose. Sparse whitening is disclosed below. |
| 40 | PASS | Both axes/arrows, full descending branch with both original printed ends, complete upper dashed horizontal line to both sides, all original label groups and short transverse axis ink remain. Origin glyph retained without deciding 0 versus O. No figure clipping or foreign prose. Eight whitened pixels lie outside the reported object box. |
| 41 | PASS | Both axes/arrows/labels, upper and lower horizontal strokes, full printed solid branch and tail, right dashed boundary and bottom ink/hook remain. BOTH short vertical projection guides, their dark junction/endpoint ink, and the lower joining ink are preserved. No figure clipping or foreign prose. No point or offscale interpretation. |

All four printed figure-number captions are outside the graph-object windows, exactly as observed in the original-only freeze. Each corresponding current page.json retains a separate kind=cap block labelled for that figure: 38 has lines=["图38"]; 39, 40 and 41 have lines=["图 39"], ["图 40"], ["图 41"]. This is separated caption retention, not a missing-caption defect. This review does NOT assert that caption pixels are embedded in the crop, nor does it review rendered lesson caption display.

## Actual Windows and Padding

Coordinates are [x,y,width,height], in original-page pixels. Each page.json fig box agrees with its audit.json figure box and with the reported box. Existing crop dimensions, not guessed dimensions, determine the padded source window; cached RGBA comparison tests that window.

| Figure | Reported/current box | Actual source window | Actual crop size | Padding L/T/R/B | RGBA mismatched pixels |
| --- | --- | --- | --- | --- | --- |
| 38 | [613,1458,525,685] | [601,1446,549,709] | 549x709 | 12/12/12/12 | 0 / 389241 |
| 39 | [158,603,1287,554] | [146,591,1311,578] | 1311x578 | 12/12/12/12 | 100 / 757758 |
| 40 | [413,1649,783,502] | [401,1637,807,526] | 807x526 | 12/12/12/12 | 8 / 424482 |
| 41 | [945,397,465,550] | [933,385,489,574] | 489x574 | 12/12/12/12 | 0 / 280686 |

At dark-ink threshold min(R,G,B)<200, all crop ink bounding boxes equal the reported boxes, all four crops have 12 white pixels on each side, and all four have zero dark pixels on their outermost border. Dark crop pixel totals: 38=19949; 39=55013; 40=22990; 41=25837. Bounding boxes and equality are corroboration, not substitutes for the original-first optical review.

Figure 39: all 100 differing source pixels are dark and become white in the existing crop. There are 18 small disconnected clusters, all in the top strip y=591..610, spanning x=165..1152. Of these pixels, 48 are inside and 52 outside the reported rectangular box. None removes the inventoried axes, arrows, y-shaped label, branch ends, guides or label groups. The largest near-axis cluster is 23 pixels at [659,595,7,10]. The sole additional source-cache ROI [620,585,95,95], enlarged 4x nearest-neighbor, optically shows this cluster is disconnected from the arrow and y-shaped glyph. It is detached irregular source ink of UNKNOWN intent, not a newly invented marker or an encoding/decoration approval gate. PASS means graph-object preservation, NOT literal retention of every dark source pixel.

Figure 40: all eight differences whiten dark source pixels outside the reported box, in clusters [657,1637,1,1] (1 pixel), [935,1638,1,2] (2 pixels), and [401,1879,4,3] (5 pixels). There are zero pixel differences inside the figure box.

Figure 38 target neighborhoods: source [646,1634,17,17] contains 42 dark pixels and maps to crop [45,188,17,17]; source [837,1896,21,21] contains 177 and maps to [236,450,21,21]. Figure 41 guide/join neighborhoods: source [1116,627,14,69] contains 442 dark pixels, [1239,684,14,151] contains 1108, and [1228,808,40,91] contains 1201. These are source-ink counts, NOT invented point counts; the corresponding full-window RGBA comparisons for 38 and 41 have zero differences.

## Source and Crop Bindings

All seven SHA256 values match the user's supplied bindings. Paths below are relative to W as defined above; no source file was copied or modified.

| Input | SHA256 |
| --- | --- |
| 0067/page.png | 9a44b92ddc85de932deb74d3904ed4ffd20e3e6ff831cda60153b4f67fa3936e |
| 0068/page.png | 2673987852cc46b5246754bed8747a35b1a4661ff76da2d3f0dd9e21c42723ae |
| 0070/page.png | d83dc5f270be7d7f98d19bd02672a60bd9ca2e8a1ef5f290ec16c6c6224f9e0f |
| 0067/figures/fig-38.png | 8f1953eb1cf72141a9525cc3c7cd0fcc555c8c25a1c96b855cd2df52c39a11fe |
| 0068/figures/fig-39.png | 7be19e271de8d30a7cb2c57a071af19046c3aa4b78bd4561e7fac0056de63059 |
| 0068/figures/fig-40.png | 54279b4331afed11935346f24af7ea6a8fa982de47404f5dbe070e5d5c9718c1 |
| 0070/figures/fig-41.png | dd36550a7f2afcac2c417ac5bdb10a62c311a5c72f2f3265f0efc1956fb59f08 |

Only the corresponding figure/caption metadata was used for approval. Metadata root: R/.tmp/stemrobin-184-six/source10c5255-work/artifacts/10c/pages.

| Page | page.json SHA256 | audit.json SHA256 |
| --- | --- | --- |
| 0067 | 0a2bc79bd8079f47df8f504d6c6c0515ed38bc08409422395ced0ac6ac9992d8 | 6a9f19c1c84549983e5f497b37ad77746bb7ec375a0ba9a557d4c24134414e9a |
| 0068 | 3eba7552e57ad95e4b42f10cef562054530b164c816c5145bc4bce80b0677192 | c7706de8561ceb21511820350ea154899c53fedb30a9286ce12c32fa9e655d21 |
| 0070 | 47b4f01f3644e33b5d1e75b7163c9252d823e69100a82a0926cb7f7522903317 | 8dba7b1b8b4fcc30d381b803430d85fcc9a1112b64c816cfa4d14f29d6d1fc51 |

## Usage and Boundaries

One batch: 3 original views + 4 actual existing crop views + 1 genuinely needed source-cache ROI view = 8/8 batch, 8/24 this fresh context. Originals and existing crops: exactly seven image file opens/reads, exactly seven explicit PNG pixel decodes, zero reopens. ROI: one diagnostic source rectangle extraction, one generated PNG creation/encode/write, one view, zero ROI file reads/decodes/reopens. No producer recrop, replacement, renderer run or generated modern figure. Four full cached source-window comparisons and two affected-only sparse difference-localization scans. Tool-internal display decoding is not exposed and is not fabricated as an independently measured count.

No native producer command was run. Eight read-only shell calls completed with exit 0 and no live exec sessions; see execution.md for command arguments, actual checkout context and observed streams. Node initialization had two retained technical errors before any image access: restricted sharp import of ../package.json and unavailable local sharp module. PNG decoding then used the already available pngjs; no install/network/paid call. After the original freeze, the initial metadata type selection yielded no fig blocks; this was an empty query result, not a thrown execution failure.

Scope deviation disclosed: one overbroad metadata-selection result accidentally surfaced current page prose lines because null box fields matched the selector. The query was immediately narrowed to kind=fig/cap. No prose, exercise, answer, source correction or mathematical approval was derived from those lines. No modern specs, SVGs, renders, choices, answers or keys were read.

UNKNOWN remains UNKNOWN: exact original Unicode/fonts, origin zero/O encoding, faint/decorative/point intent, detached fleck meaning, and offscale interpretation. Existing prose corrections, owner/errata and modern math/culture/display PASS are reused without new review. This PASS does not upgrade whole-lesson, whole-source, codepoint or publishing approval.

Only new files in this evidence directory were written. All dirt/edits/FAIL/locks/fees and all existing source/crop/metadata files were preserved. No finalizer, crop replacement, source reauthoring, DB/env/backend/network/Git mutation, install, or paid call. Parent 24/24 remains spent. Inherited accounting is kept as supplied: known charges=74, paid=0, fees=UNKNOWN, complete=0; this independent review's eight local image views are reported separately, not used to reset or reinterpret inherited accounting. The missing preservation stage is now reviewed and may be reused by the parent to finish N88 within the existing authorization.

Diagnostic ROI (do not forward image payload): evidence-directory/fig-39-upper-arrow-source-roi.png; SHA256 389466738aab1360b0c2f6d9990fa690d2d7484d0a3235de4097b1d145ec12d7.
