# N18 source comparison after Stage A

Status: comparison complete; proposed exclusions only, no source or counter change and no finalization approval.
Date: 2026-11-23.
Ticket / target: STEMROBIN-184 / ana9-c3-s1-n18.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Review sequence and image accounting

The original page-71 PNG was opened once before any draft disclosure, and the observations were frozen in `reviewer/source-first.md`. That original has SHA-256 `4b95e479cc416ad7ee6ec88bcb889fc6d810c4580f9f979778faef4988926cfb`, dimensions 1695 x 2381. The approved N18-only page-70 text was used without reopening page 70.

Only after Stage A did I read the disclosed `original-0071.md` and `first-native-0071/{page.md,page.json,audit.json}`. I then opened each of the four bound crop images once, in the following order. Their hashes were independently checked against `reviewer-crops/bindings.json` before opening.

| Loaded image | Source-coordinate crop box | SHA-256 | Cumulative loaded images |
|---|---|---|---|
| Original page 71, Stage A | Full original, 1695 x 2381 | `4b95e479cc416ad7ee6ec88bcb889fc6d810c4580f9f979778faef4988926cfb` | 1 |
| right-heading-margin | [1490,780,205,220] | `c2dd6d26205e453de5cc65b9a2d0bb7b84243028573aad3bf0f294f37677040a` | 2 |
| extreme-bottom-edge | [0,2300,1695,81] | `fb23b40d9e07ff017b5a4614b291c3d28bb16f707e12608a95375a7b471f3afd` | 3 |
| lower-general-term | [130,1725,1350,85] | `ff6d9442fdbf55ff6e7f905b74dde434f9320c54bb2af80515cab3814b7d2677` | 4 |
| upper-general-term | [130,1905,1400,115] | `9546605e2a29e79e1af3255cfbd2edd412ae346ed166dd9f93e4dc83f97537e1` | 5 |

Cumulative image use: **5/8 batch and 5/24 context**. No other image, grid, crop or reopen was loaded. One upper-general-term call had a mistyped nonexistent path and failed without loading an image; its corrected bound path was subsequently opened once. That failed call does not add an image exposure.

After the crop inspection, the already-prepared `layout.json` line-band coordinates were read as text for causal comparison. No OCR, new crop, source preparation or counter execution was performed.

## G01 and G02 resolved from ink

### G01: last digit of the lower approximation

The lower-general-term crop contains the second printed row of the insufficient-approximation item. The terminal digit subscript is **n**, not m. Its visible glyph has the single n-shaped arch/terminal; the surrounding comma and rough ink made the full-page provisional reading look wider. The crop does not show a separate additional arch supporting m.

The source-faithful general term is:

```tex
\alpha_n=a.a_1a_2\cdots a_n,\ \cdots;
```

The leftmost alpha is clipped at the crop's left boundary, but the disputed terminal digit and its subscript are visible. Its resolution does not depend on inferring the formula from a truncation rule.

**Result: n, resolved.** `original-0071.md:71` and `first-native-0071/page.md:77` already use `a_n` and need no correction at G01.

### G02: exponent in the upper approximation

The upper-general-term crop shows the exponent on the final power of 10 as **n**, not m. The same crop also shows n as the general approximation's subscript and as the last retained digit's subscript. The exponent is a legible n-shaped glyph, not a mathematically supplied replacement.

The source-faithful continued print row is:

```tex
+\frac{1}{10^2},\ \cdots,\alpha'_n=a.a_1a_2\cdots a_n+\frac{1}{10^n},\ \cdots.
```

**Result: n, resolved.** `original-0071.md:75` and `first-native-0071/page.md:81` already use `10^n` and need no correction at G02.

The crop supports one prime on the general excess approximation. The nearby rough/detached trace noted in Stage A does not establish a second prime or an extra operator.

These findings supersede only the G01/G02 provisional m/n interpretations in the comparison record. The pre-disclosure `source-first.md` remains unchanged, preserving the original uncertainty and review chronology. There is no n/m mathematical erratum to register.

## Complete content and boundary comparison

The historical draft's block body is byte-identical to the first-native Markdown's block body after their metadata frontmatter. The native JSON exposes the same eleven blocks. The comparison below is against the frozen source rows, not a reverse derivation from the audit's requested count.

| Frozen source content | Native block, kind and rows | Finding |
|---|---|---|
| A01-A04, continued N18 paragraph | 1, p cont, 4 rows | Complete. Starts `应关系表明`, correctly joining page 70's `一一对`. The real-number sequence breaks across the same two printed rows. |
| A05-A08, closing N18 paragraph | 2, p, 4 rows | Complete. Includes the reading recommendation, formation of an independent discipline, `19` century and the source word `兴致`. |
| H01, section heading | 3, h2, 1 row | Complete. `§6. 无穷数列·数列的极限` and its middle dot are retained. |
| H02, N19 heading | 4, h3, 1 row | Complete. `19. 无　穷　数　列`; the draft retains the title's wide letter spacing. |
| B01-B03, geometric-sequence introduction | 5, p, 3 rows | Complete. First term 1, ratio 2, sequence 1,2,4,8,16,... are retained. |
| B04-B06, decimal introduction | 6, p, 3 rows | Complete. The stop after `例子`, decimal literal, Greek alpha and digit letters are retained in meaning and row placement. |
| B07, digit sequence | 7, p, 1 row | Complete. All listed digits through the general `a_n` and ellipses are present. |
| B08-B09, insufficient approximations | 8, p, 2 rows | Complete. Both initial terms and the general term are present. G01 now independently confirms the existing n. |
| B10-B11, excess approximations | 9, p, 2 rows | Complete. The second term continues into the next print row with +1/10^2. G02 confirms the existing final 10^n. |
| B12, final incomplete N19 sentence | 10, p open, 1 row | Complete as visible. Stops at `在这个对应关系`; no unseen continuation is fabricated. |
| F01, printed-page footer | 11, foot, 1 row | Page number 64 is present. Its two decorative bullet-like marks are acknowledged in metadata notes but not reproduced in foot text. |

No Chinese word, mathematical term, digit, equation, semantic label, instructional object, numbered prose item or source-body row was found missing. No exercise or figure needs to be added. The native `figures: []` is consistent with the original, not a basis for deciding that fact.

N18's final sentence closes before the h2 section heading, exactly as frozen. Everything below h2/h3 belongs to N19. The numbered `1)`, `2)`, `3)` entries remain prose, not exercises. Nothing from this page authorizes publishing complete N19.

### Literal typography caveats

The draft substitutes Chinese full stops `。` for the solid period-like source stops. Examples include `然数。` at original line 40, `实数$x$。` at line 42, `了解。` at line 46 and `兴致。` at line 48, with analogous substitutions in the N19 prose/list endings. These do not omit text or create rows, but they are not a facsimile of those printed stop glyphs. For strictly source-literal punctuation, use period-like `.` stops at the corresponding locations rather than claim `。` was printed there.

The draft also represents prose colons with `：`; the frozen report used `:` as a transcription convention. A bitmap does not itself specify Unicode code points. No missing colon or changed mathematical relation is identified from that encoding choice.

The page-64 footer is complete in semantic content, but not an ink-for-ink transcription: the surrounding decorative marks occur only in the notes, not the foot body. They must remain acknowledged; they are neither missing mathematical content nor eligible masking over the footer. Reproducing those decorations would be a literal-footer decision, not a line-count remedy.

Thus **substantive prose/body/footer content is complete**, with the punctuation/decorative-foot distinctions disclosed rather than hidden under a blanket literal-glyph PASS.

## The actual native failure and causal row-band comparison

The preserved first-native audit reports:

```text
lines_printed: 25
lines_md: 23
figures: []
normalizations: []
unknown_chars: []
katex_warnings: []
count_exclusions: []
error: printed 25 rows versus 23 block-body rows
```

The native block row-length vector is `[4,4,1,1,3,3,1,2,2,1,1]`. Its source-content coverage is explained above. The prepared 25 bands map to the frozen source as follows:

| Prepared band positions | Source ownership |
|---|---|
| 1-8: [149,196] through [692,749] | A01-A08, the two N18 paragraphs |
| 9: [833,885] | Non-content right-margin blot, independently visible in right-heading-margin |
| 10: [886,938] | H01, actual section-heading text |
| 11: [1013,1066] | H02, N19 heading |
| 12-23: [1108,1168] through [2036,2095] | B01-B12, including the two separate approximation continuation rows |
| 24: [2096,2154] | F01, printed-page footer |
| 25: [2325,2380] | Non-content extreme-bottom edge line, independently visible in extreme-bottom-edge |

The right blot precedes the section heading vertically, so its band is not an omitted second heading row. The bottom line is below the footer, so its band is not an omitted footer/body row. The crop evidence establishes these identities; the numerical difference of two did not establish them.

The bands already preserve the source's actual two-row real-number sequence and two-row excess-approximation item. Do not add `↵`, `parallelwraps`, `samerow`, blank rows or duplicate text to make these objects count again.

This provides a concrete causal explanation of the extra detected bands, not proof of a successful excluded-copy rerun. No counter was run and the original FAIL remains unchanged.

## Exact eligible exclusion proposals

Both newly inspected non-content ROIs qualify for count-copy exclusion as **scan-artifact**. The right ROI is an irregular solid blot isolated in the outer margin. The bottom ROI is a thin sloping/jagged scan-edge line, not a printed instructional or section separator. I do not classify either as a content `separator-rule`.

The following are exact integer proposal coordinates in the bound 1695 x 2381 original. The right proposal is a padded ink enclosure inside its inspected ROI, not a claim of machine-snapped component bounds; the bottom proposal uses its full bound ROI. Neither has been applied.

```json
[
  {
    "kind": "scan-artifact",
    "box": [1550, 825, 80, 65],
    "reason": "Irregular isolated right-margin blot seen in the bound right-heading-margin crop; outside every typeset body, heading and footer object. Its y-range overlaps the spurious prepared band [833,885], not a missing text row."
  },
  {
    "kind": "scan-artifact",
    "box": [0, 2300, 1695, 81],
    "reason": "Bound extreme-bottom-edge ROI contains only the sloping/jagged scan-edge line and detached marginal specks below the printed footer. No typeset body, heading or footer ink is included."
  }
]
```

Nonintersection basis:

- Right box has x in [1550,1630) and y in [825,890). The inspected parent ROI is already entirely outside the heading/body column. H01's typeset ink is far to its left, even where vertical ranges approach or overlap. N18 body ends above this box; the footer is far below.
- Bottom box has y in [2300,2381). All printed body content ends at or above the B12 band ending 2095, and the footer's band ends at 2154. The entire bottom ROI begins below both, with ample blank separation.
- Neither box intersects the general-term crops or their formulas. Decimal points, primes, exponents, punctuation and footer decorations are not excluded.
- Stage A's other coarse marginal-speck candidates are not automatically approved or needed here. These two proposals are based on the newly inspected ink and binding geometry, not on applying every provisional exclusion until a target total appears.

## Concrete actions and stop

1. **No n/m source correction:** retain the draft's `a_n` and `10^n`; G01/G02 are resolved by pixels. The correction is to the provisional reviewer interpretation, recorded here without rewriting Stage A.
2. **No missing-body or wrap correction:** retain all existing source-body lines, two-line math continuations, p cont/p open boundaries, h2/h3 ownership and prose-list classification.
3. **Literal-stop caveat:** restore the source's period-like stops if enforcing exact printed punctuation; do not mislabel the draft's `。` normalization as original glyph fidelity. Keep the decorative-footer distinction explicit.
4. **Counter remedy proposal only:** the two specific scan-artifact boxes above are eligible for count-copy masking. Any authorized implementation must preserve original pixels, source text, figures and the first failure. A later actual rerun must establish its own result; this review supplies no target override or synthetic PASS.
5. Raw page 70 remains untouched. N18 modern density/nondegeneracy clarification is outside this stage and is not reviewed or approved here.

Only `reviewer/source-comparison.md` was created during this stage. The Stage A reports, historical/native artifacts, source/exclusions/code, modern content and every other file were left unchanged. No finalize, Git, database, environment, app, dependency, network or other-agent action was taken. Stop after this comparison.

## Retained textual evidence bindings

| Evidence | SHA-256 |
|---|---|
| original-0071.md | `0580ad53b3321620cc01f3f484d164b1f57841425d9d5d9dbf90a72d4dd28f96` |
| first-native-0071/page.md | `00dc744783c9dba418017cb087df2c2e84087f3bcf9523ce32bea7e54491b23f` |
| first-native-0071/page.json | `f39c5a5e6936090731a1adfda8f1b6a3a770b705d1e8b6d5037d04b6ab25d198` |
| first-native-0071/audit.json | `750371d12629940d71c43627c959083aee5a4c848b16958bb7a8716f02b6a081` |
| prepared/9c/pages/0071/layout.json | `70f52d5607a290f4f12211bb253a520c3e87a7ce555917147f7e45e451acecf9` |
