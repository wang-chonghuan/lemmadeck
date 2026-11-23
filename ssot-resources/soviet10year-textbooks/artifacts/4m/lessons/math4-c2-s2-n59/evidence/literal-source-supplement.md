# N59 affected literal source supplement

Frozen on 2026-11-23 for STEMROBIN-187, lesson `math4-c2-s2-n59`.
Scope: four specifically authorized literal-source questions only. This is
not whole-lesson approval, a modern-figure review, or an answer audit.
Previous HOLD reports remain untouched and are not superseded by this file.

## Independent method and limits

Read the image-batch rules, lesson rules and production-resume contract before
opening images. Observations below came directly from the authorized source
PNGs, without reading raw/modern page Markdown or JSON, author/independent
reports, answer/choice artifacts, solution values or tests. No exercises were
solved. No modern figure was opened, and no affected comparison was performed.

All shell calls used the explicit working directory
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.
Only this new supplement and the necessary source crop listed below were
written. No existing edits, staging or evidence were changed. No source,
tool, template, index or progress edits; no DB/environment changes, service
calls, installation, commit/push, chat messaging or ticket operations.

## Literal verdicts

### 1. Exercise 980, fifth Cyrillic subpart д): FIRM

The entire printed subpart is:

`д) 96.3 + 0.081;`

The numeral before the plus sign is **96.3, not 963**. There is a distinct
printed low decimal point between the 6 and 3, visibly comparable in vertical
placement to the decimal point in `0.081` on the same line. The full-page view
establishes this glyph; no crop was necessary.

Source: physical PNG page `0217`, printed page 208, exercise 980, second
subpart row, middle entry. Punctuation and spacing here are readable
transcription, not a claim about exact punctuation codepoints or widths.

### 2. Exercise 1004, Cyrillic б): FIRM

The printed subpart, retaining visible number grouping, reads:

`б) 146 325 − (72 · 306 − 1693) + 75 014.`

The complete opening is **`146 325 − (`**: one grouped integer **146325**,
followed by subtraction and an opening parenthesis. It is **not**
`146 · 325`.

The full-page view established the line but could not reliably classify the
very small trace in the gap between 6 and 3. One unmodified source crop was
therefore necessary. In that crop there is no solid, centered multiplication
dot between `146` and `325`. A minute low-position speck in the gap lies near
the digits' lower edge; it is scan noise, not a printed mid-dot. In contrast,
the actual multiplication dot between `72` and `306` on this same line is
substantial and centered vertically within the numeral height. Whitespace
separates the opening groups; it is not an operator.

Source: physical PNG page `0220`, printed page 211, exercise 1004, second
subpart. Crop identity and exact source rectangle are recorded below.
No arithmetic was evaluated.

### 3. Exercise 1005, opening words: FIRM

The exact opening word sequence around the length is:

`把一长 7.35 米的管子锯成两段（图 223）`

There is **no 根** between `一` and `长`. The source has `把一长`, not
`把一根长`. Do not silently modernize the wording or supply a classifier.
The full-page view is sufficient; no crop was used.

Source: physical PNG page `0220`, printed page 211, exercise 1005, first line.
Spaces and parenthesis encoding in this transcription do not establish a
typographic-facsimile requirement.

### 4. Figure 223, unknown glyph and dimension arrowheads

**FIRM, readable glyph:** above the long pipe's dimension line is an upright,
diagonally crossed, x/X-like mark. It resembles a capital X, but the source
is an isolated, roughly drawn label without a dependable letter-case reference.
It is not a plus-shaped cross.

**Specific remaining HOLD, case only:** the pixels do not reliably establish
uppercase versus lowercase, or an exact Latin/Cyrillic codepoint or typeface.
Do not certify a precise case from this supplement. The readable crossed
unknown label itself is established; this limitation does not create a new
typographic-facsimile gate.

**FIRM, all four arrowhead directions:** both dimension lines have outward
arrowheads:

| Dimension line | Endpoint | Visible arrowhead direction |
| --- | --- | --- |
| Long pipe, crossed unknown label | Left | Leftwards, toward the left terminal |
| Long pipe, crossed unknown label | Right | Rightwards, toward the right terminal |
| Short pipe, `2.89米` label | Left | Leftwards, toward the left terminal |
| Short pipe, `2.89米` label | Right | Rightwards, toward the right terminal |

The dedicated source figure view establishes the four wedge directions; no
precise arrow geometry, font matching or modern-output comparison is claimed.
No additional figure crop was made.

## Source identities

Paths below are relative to the explicit working directory above. These are
byte identities of the images actually inspected, not new publication
dependencies on disposable scratch.

| Inspected source | Dimensions | SHA-256 |
| --- | --- | --- |
| `.tmp/ld-s10y-lesson/4m/pages/0217/page.png` | 1504 x 2172 | `c4647a8a0885c890bd45021faf592bea5d14e503b1a0c03680e4bb482b0fe209` |
| `.tmp/ld-s10y-lesson/4m/pages/0220/page.png` | 1504 x 2172 | `a9a3067a14d3863395571044eb10d0268dd74857313bbe4dfa6fb96cf8574416` |
| `.tmp/ld-s10y-lesson/4m/pages/0220/figures/fig-223.png` | 1040 x 381 | `a2c88a7878cac487edb497256bed709dca5e4dc4c8eaee6605667519a12b1cd6` |

## Retained necessary crop

- Path relative to this evidence directory:
  `literal-crops/0220-ex1004-b-opening.png`.
- Parent source: `.tmp/ld-s10y-lesson/4m/pages/0220/page.png`, SHA-256
  `a9a3067a14d3863395571044eb10d0268dd74857313bbe4dfa6fb96cf8574416`.
- Rectangle: `(325, 1345, 1100, 1405)`, in original pixels, ordered
  `(left, top, right, bottom)`, with right/bottom exclusive. Located visually
  from the authorized full-page pixels before cropping.
- Output: 775 x 60 pixels; SHA-256
  `9e70474bf8751595fde8e6447e23ac68775bbe9c6a8d23457887373088e4bc7c`.
- Mechanism: existing lesson virtualenv's PIL `Image.crop`, then PNG save.
  No resizing, thresholding, sharpening, retouching or synthesis.
- Reason: distinguish a possible operator in the opening numeral gap from
  lower-position scan noise. Opened once, never reopened.

## Actual image usage

| Load | Image | Opens |
| --- | --- | --- |
| 1 | Authorized full page `0217/page.png` | 1 |
| 2 | Authorized full page `0220/page.png` | 1 |
| 3 | Authorized source `0220/figures/fig-223.png` | 1 |
| 4 | New targeted crop `0220-ex1004-b-opening.png` | 1 |

Total: **4 image loads out of the authorized maximum 5**, one image per tool
call, zero reopens. New targeted source crops: **1 out of maximum 2**;
none for exercise 980. No additional image loads are needed or authorized
by this frozen supplement. The parent receives text only.

## Stop boundary

This supplement is frozen at this handoff. Literal findings do not change any
previous HOLD report or authorize whole-lesson approval. A subsequent zero-image
affected comparison or answer audit requires separate parent authorization.
