# STEMROBIN-180/180-6: new SOURCE 7p327 independent review b99

Date: 2026-11-20. Physical page 327, printed page 316 only.
Workdir: `/Users/yong/.codex/worktrees/stemrobin-180-six/lemmadeck`.

## Decision

**SOURCE FAIL / sourceApproval=false.**

One confirmed new content defect affects B09/L21 only:

- Original pixels: `路中导体的任何一个截面处的电量都相等`
- New candidate: `路中导体的任何一个截面的电量都相等`
- Missing character: `处`.
- Author `page.md`: line 73.
- Author `page.json`: `blocks[8].lines[3]`.
- Working MD and JSON have the same omission, being byte-identical to the
  author snapshots.
- Evidence: independently frozen inventory L21 and original-derived
  `crop-terminal.png`, crop box (165, 1565, 1335, 1980). The source character
  occurs in the fourth row of this crop.

No author content was repaired. No whole-page approval is issued.
24/24 rows and exit 0 are technical evidence, not semantic approval.

## Original-First Sequence

1. Read the shared image-batch rules, cap1 block format, and technical recovery.
2. Verify original `page.png` SHA256 before opening pixels:
   `d4af2a7e456bbe10314f836bfc625b7c27f2bc15edeeb023bff28849a122eca6`.
3. Open prepared `page.grid.png` once, then original `page.png` once.
4. Inspect six self-made original-PNG crops, no PDF rendering or preparation.
5. Freeze the complete page inventory, then chmod it 0444, before opening
   author files. Frozen inventory hash:
   `ff35a314268e59eb925ef1960916634a23e6e3e70f5dd89ba8a7f2ae134b0f5f`.
6. Verify the author manifest:
   2181 bytes, 0444,
   `6e50d5e1584e48ec8a29d9ecb93779147786405ea8ef79fb2bb37c1b2dec5260`.
7. Read all author MD, JSON, audit and manifest; compare all 10 blocks and
   all 24 rows, including prose, formulae, emphasis, punctuation and footer.
8. Save `comparison-before-history.md` and execute byte verification.
9. Only then read old FIRST history. No old reviewer was invoked.

Own evidence directory:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6/source327-independent/`.

## Complete Page Comparison

| Unit | Original observations and current comparison |
| --- | --- |
| B01 / L01-L02 | Incoming `出的物质的质量`; no new paragraph indentation. Wording complete; `p cont`, not open. First `物质` italic marker is present. See typeface uncertainty below for the second occurrence. |
| B02 / L03-L04 | Charge through a cross-section in 1 second and stronger current; wording, numeral, row break and terminal dot agree. `秒钟` does not require a separate italic marker. |
| B03 / L05-L06 | Two-row bold definition of current strength; full wording preserved. |
| B04 / L07-L08 | Two-row bold instruction to divide charge by time; printed unusual `通过去的` retained. |
| B05 / L09 | Verbal equality, numerator 电量 / denominator 时间, stacked fraction and final dot agree. One printed row. |
| B06 / L10-L11 | Italic Latin I/q/t, long explanatory dashes, commas and `时`/`间` split agree. |
| B07 / L12 | `I=q/t`, uppercase I, lowercase q and t, stacked fraction, end dot agree. |
| B08 / L13-L17 | All five prose rows agree; quoted terms and enumeration punctuation preserved. Later `强电流` and `弱电流` have italic markers. Initial list remains ordinary type. |
| B09 / L18-L23 | Figure 268 is a textual reference, not a figure. Reasoning and punctuation otherwise agree; L21 omits `处`. Last visible punctuation is semicolon, and `p open` is supported by the source. |
| B10 / L24 | Footer 316 flanked by black dots; separate from prose. Italic numeral marker is present, with exact footer font classification not elevated to a defect. |

Independently counted: 24 printed rows / 10 blocks / 0 exercises / 0 figures.
No heading, caption, footnote, table or image was found. Tall fractions count
as single printed rows. No source erratum or scientific correction is asserted.

## Typeface and Boundary Uncertainty

The immutable initial inventory overclassified the second `物质` and three
`单位` occurrences as emphasis. During the full comparison I explicitly
withheld those style claims as definite findings: ordinary serif glyph strokes
can look oblique. Their initial classification is retained, not silently
rewritten, in `inventory-frozen.md`; the later caution was saved before old
FIRST was read. These four uncertain typeface units are **not** new confirmed
author defects and must not be counted as repairs or used to approve content.

Candidate marker presence for the three historical italic units is a current
byte fact. The old report's semantic interpretation is recorded as history,
not substituted for original pixels. Quote-mark italic treatment, sentence-dot
weight beside bold text, parenthesis width, and exact footer font are not
strong enough to become additional defects.

This review independently resolves the outgoing boundary: both parts of the
semicolon are visible after `类比的`; the paragraph is open. The incoming
unindented fragment supports `cont`. Neither neighboring page was opened or
reapproved. The prior review's terminal-dot/closed-paragraph reading remains
historical uncertainty; this new observation does not erase it.

## Historical FIRST and Allowance

The old exact candidate bytes are unavailable; these are wholly reconstructed
new candidate bytes, not recovered old bytes.

Old durable `.intentfold/tickets/STEMROBIN-180/source-review-7p-326327.md`
was read only after the independent whole-page comparison was saved.
Its 327 findings remain:

- 327-I1: omitted italic first `物质`, printed row 01.
- 327-I2: omitted italic explanatory `强电流`, printed row 14.
- 327-I3: omitted italic explanatory `弱电流`, printed row 15.

The new candidate contains all three corresponding markers. That does not
restore historical bytes, reset the previous SOURCE failure, or convert old
reviews into approval of this new page.

Historical shared repair record remains **limit1 / used0 / unused1**.
This reviewer performed 0 content repairs and grants no new allowance.
Historical failures, expenses, actual usage and environmental records were not
edited. No checkpoint or usage file was written.

## Actual Byte and Command Evidence

`byte-comparison.json` records that:

- All three author snapshots equal their working candidates byte-for-byte.
- MD JSON frontmatter equals `page.json.meta`.
- MD block body equals serialization of all JSON blocks and flags.
- All six necessary current-page entries in the author manifest match actual
  byte counts and SHA256 values.
- Actual audit: printed 24 / MD 24, normalizations 0, unknown characters 0,
  KaTeX warnings 0, errors 0. Actual JSON: 10 blocks, 0 exercises, 0 figures.

The human-supplied new finalize result is exit 0 / 24 of 24 / 10 blocks /
0 normalizations. This reviewer verified actual audit bytes but did not run
finalize and does not claim to have opened a new saved process receipt.
`commands.md` retains every executed command's status, including both absent
directory queries (exit 1). Required file reads, crop generation and byte
verification exited 0. Missing own output directory was minimally corrected
with mkdir; no successful visual stage was repeated.

The final `manifest.json` contains only necessary current-page input and own
output paths, byte counts and hashes. It excludes old reports, old producer
receipts, PDF/runtime/profile dependencies and other pages; none are packaged.
Final manifest mode and exact SHA256 are returned from the seal command.

## Image Limits and Stop

Actual visual loads: 1 prepared grid + 1 original whole PNG + 6 own crops =
**8/8 batch, 8/24 context**. Remaining: **0 batch, 16 context**.
Reopens: 0; author screenshots: 0; other-page images: 0;
image payloads sent to parent: 0. Evidence paths and text only are returned.

No old chat/reviewer wake-up, descendants, peer/supervisor message, new
production chat/worktree, model/credential/quota change, DB/Git/merge/deploy,
raw/canonical/source/index/checkpoint/usage edit, or
assemble/finalize/modernize/choice/ANSWER/DISPLAY was performed.
Approved 326/328 were not reviewed. No n129/n112 screenshots were opened,
no n130 assembly was performed, and n131 remains excluded.

Only the specified own evidence directory and this durable review were
written. This one-page review is complete; stop and wait after handback,
without prefetching another page.
