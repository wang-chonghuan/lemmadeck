# Native62 Affected Typography Supplement

2026-11-23. SAME sole independent SOURCE reviewer. Exact workdir:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
Only T62-1/2/3 were visually reviewed; no replacement wholepage review.

## Result

| Unit | Native-pixel decision | Current finalized MD | Edits |
| --- | --- | --- | --- |
| T62-1, definition extent | PASS: ordinary-weight italic lead only; following definition text ordinary upright | Lines61-62: `*物体的加速度*` followed by ordinary text/punctuation | 0 |
| T62-2, question weight | PASS: ordinary upright body face, no extra bold treatment | Line58: plain question, two question marks | 0 |
| T62-3, three terms | PASS: ordinary-weight italic, no additional bold class | Lines46/47/48: single-star `加速运动`, `减速运动`, `加速运动` | 0 |

All three held typography distinctions are now resolved against the authentic
native pixels. New definite source defects0; remaining affected HOLD units0.
Together with the prior unchanged semantic review, this supplies current
page62 SOURCE approval. This is not a new FIRST, a rerun of its wholepage
review, permission to edit raw source, or approval of modern corrected text.

## Native Source Premise

The parent supplied a concrete extraction premise: PDF object123 is a native
1-bit CCITT stencil,1472x2240 at261ppi; the prepared1695x2580,300dpi page was
resampled. The extracted original is:

`.tmp/180-7-n12/native62/scan-000.png`

Observed file:58352 bytes,1472x2240,1-bit grayscale, SHA256
`7fe0d2984289f0d65e969c3f002876b47942e8f04c0d70aa12e0b94d56b64406`.
The object number/CCITT/ppi identification is parent-supplied; the PNG
dimensions,mode and identity were verified locally. PDF extraction was not
rerun by this reviewer.

The stencil's stored polarity is white glyphs on black. It was retained,
not inverted. No resize, interpolation, upsampling, contrast enhancement,
threshold change, rotation, shear, OCR or conjectural font reconstruction.
Crop save/redecode was checked to preserve exactly the source mode1 pixels.
The older crops named `p0062-*-native.png` remain historical: they were native
to the resampled prepared render, not native to PDF object123.

## Crop Inventory And Independent Order

All boxes are `[left,top,right,bottom]`. Coordinates were mapped using
`1472/1695` horizontally and `2240/2580` vertically, flooring left/top and
ceiling right/bottom to include the original rectangle.

| Crop | Prepared-coordinate box | Native-coordinate box | Native size |
| --- | --- | --- | --- |
| T62-1 | [145,1190,1460,1730] | [125,1033,1268,1503] | 1143x470 |
| T62-2 | [145,1030,1460,1405] | [125,894,1268,1220] | 1143x326 |
| T62-3 | [145,535,1460,1155] | [125,464,1268,1003] | 1143x539 |

Each of these three images was inspected once, in the table order, without
opening the whole extracted PNG. The source-only observations were frozen in
`source-review/native62-typography/independent-observations.md` before rereading
current MD targets. The old report and inventories were not amended.
No fourth image, reopen, other-page source or image payload delivery followed.

## Concrete Typography Evidence

**T62-1:** "物体的加速度" has localized rightward glyph slant. After the
lead, "是由物体在不同时刻速度的两个数值之" returns to upright ordinary
body. Repeated "物体"/"速度" in that same line provide same-glyph comparison;
the following "差来确定" agrees with ordinary "它们的差并没有改变" later
in the crop. There is no continuous italic run through the whole definition.
The isolated filled sentence point cannot establish a different italic
punctuation class, and no italic point/wrapper is required. The current
lead-only wrapper is correct, not merely an uncertain minimum retained.

**T62-2:** the question matches the ordinary upright face above. In particular,
"是相对的" and "是不是相对的" preserve the same native fine/thick stroke
pattern and open interiors; "速度" in the question matches ordinary "速度"
above. There is no systematic extra-thick/bold class or italic slant. The
definition lead below provides a clearly different slant treatment which the
question does not share. Ordinary plain text is positively supported.

**T62-3:** the three terminology occurrences distinguish themselves by
localized italic slant, not extra weight. Adjacent ordinary "加速"/"运动"
in "加速直线运动与减速直线运动" and nearby prose provide local native
comparisons. Fine/thick serif strokes and open interiors remain those of
ordinary weight; isolated scan/stroke irregularities do not form systematic
bold thickening. The surrounding six-row paragraph is not one italic span.
Each existing single-star term agrees. No additional bold markup is warranted.

No unrelated heading/other-page bold example was reopened or assumed as a
control. These decisions rely on positive adjacent normal-face and slant
comparisons, not on a claim that absence of an available bold control proves
every uncertain style normal.

## Current Bindings And Page61 Acknowledgment

`source-review/native62-typography/bindings.json` records current62 MD/JSON,
typed-body/formula identities against the prior finalized bindings, native
source/crops, frozen observations, prior frozen report and this supplement.
No unchanged source body was visually reviewed again.

The latest page61 metadata registration was read, not its original image.
Both current MD and JSON contain:

- id `p0061-projection-norm-1`
- block `p0061#6`
- exact original `它们投影的绝对值等于矢量和的绝对值`
- reason distinguishing each vector's own projection magnitude from the sum,
  including the source-bound1+3=4 counterexample and requiring explicit modern
  correction.

The actual `pages/0061/finalize-source-erratum/` receipt reports the exact
workdir, exit0,25/25 rows,0 normalizations, empty stderr, from
2026-11-23T07:36:14.277Z to07:36:14.873Z. MD/JSON typed-body and formula
identities are bound to the prior review without image replay. This confirms
source-bound registration and preservation of raw wording; it does NOT approve
unseen modern corrected prose or erase the source's scientific contradiction.
The earlier SCI finding/report remains frozen.

## Historical Preservation And Usage

Original report:
`.intentfold/tickets/STEMROBIN-180/source-review-8p-n12-recovery.md`,
SHA256 `1734e547c2500ce97762616a3b55273150d8d0f400757444154bc53d5dd6714e`,
remains unchanged, including its original three HOLD decisions and prior
image accounting. Old source failures, FIRSTs, author repair counts,
mechanical recovery, image counters and known/unknown cost records are retained.
This supplement changes the current affected verdict, not historical facts.

Prior reviewer images8 + new native crops3 = **11/24 cumulative**.
This expressly authorized native typography phase uses **3/3 images**;
reopens0, wholepage views0, other-page source images0, returned payloads0.
New source edits0; new repairs0; finalize/assembly/promotion/modern review0.
No solutions, keys, answer drafts or parent solution file read.
No DB/deploy/Git writes, installs, chats, timers, workers or paid requests.
Historical unknown model/service cost remains unknown, not reset to0.

Only this supplemental report and supporting files under the existing
`source-review/` evidence root were written. All commands used the exact
authorized workdir. No pending command remains.

**Return this affected result; wait for the next same-reviewer phase.**
