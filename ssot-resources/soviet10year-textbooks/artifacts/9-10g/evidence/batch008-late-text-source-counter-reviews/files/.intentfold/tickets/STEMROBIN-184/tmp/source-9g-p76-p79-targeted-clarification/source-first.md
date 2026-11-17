# Frozen Independent Original-PNG Observations

Ticket: STEMROBIN-184. Scope: targeted source clarification only.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Scratch: `.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p76-p79-targeted-clarification/`.

This file is frozen BEFORE reading the competing independent-review file.
It must not be revised to conform to that reviewer. Comparison belongs in a
separate report. No answers, candidate counter, modern figures, or other
workers' findings have been read.

## Evidence Boundary

- Eight image displays total, in order: H1, H2, H3, H4, H5, H6, H7,
  H4-reserved. Each was displayed once; no whole pages, grids, footers, or
  image reopens. Original PNGs were decoded only by the bounded crop helper.
- All source images: RGB, 1506 x 2126. Native crops preserve source pixels.
  Display copies use exactly 2x nearest-neighbor, no enhancement.
- Coordinates below are integer original-source pixels, zero-based,
  `[x,y,width,height]`, half-open rectangles. They are exact observation
  windows, NOT claimed minimal ink-component bounding boxes.
- `crop-provenance.json` records source, native-PNG, native-pixel, and
  display-PNG SHA-256 plus transforms and absolute paths.
- Layout JSON and selected authoritative MD blocks were read only to
  localize. No existing MD value is used as proof of a glyph. For H3, the MD
  was seen before pixels for localization; this is disclosed rather than
  presenting the task as blind to the transcription.
- No source writes, counting, finalize, audit, whole-gate, DB, publish, Git,
  ticket backend, IntentFold restart/update, or source edits.

## H1 - Physical 76, Exercise 199(2)

Crop: `[400,1600,900,135]`; target window `[718,1624,38,34]`.
The operator immediately before the OA6 vector is a PLUS-shaped glyph.
A vertical stroke crosses the horizontal stroke. It is not merely a
horizontal minus. Visible local sequence: `OA2 + OA4 + OA6`.
Status: VERIFIED PLUS; confidence HIGH (0.99).
No regular-hexagon calculation or expected solution was used.

## H2 - Physical 76, Uniqueness Proof

Crop: `[200,480,1120,140]`; punctuation window `[327,581,18,24]`.
Between the first `+yb` and Chinese `和`, the source has a single compact,
solid low dot. No comma tail, hollow Chinese full-stop ring, or second
colon dot is visible. The next printed token is `和`.
Status: VERIFIED SOLID PERIOD/FULL-STOP CLASS; confidence HIGH (0.99).
This class observation does not establish a Unicode width/codepoint.

## H3 - Physical 77, Exercise 203

Crop: `[180,515,1200,300]`. All three exercise rows are vertically visible;
the crop also has an incidental next-exercise top line below them, which
was not reviewed. The crop's left edge clips the initial characters of
row 2 and the leading vector on row 3. Therefore a COMPLETE independent
full-row transcription is NOT claimed. The held punctuation and all eight
within-triplet delimiter positions are inside the viewed crop.

- Row 1, approximately y531-573: exercise number 203, parallelepiped label,
  and the beginning of the coplanarity prompt are visible.
- Row 2, approximately y600-643: the mark immediately after the visible
  `共面` is question-mark shaped: upper curved/hooked ink and a separate
  lower dot. Target window `[296,600,27,44]`.
  Status: VERIFIED QUESTION MARK; confidence HIGH (0.98).
- The within-triplet delimiters have comma-shaped ink: a dark top and a
  short descending/slanting tail, not an isolated solid period.
  Observation windows, in triplet order:
  1: `[477,628,22,20]`, `[587,629,22,20]`;
  2: `[829,628,22,20]`, `[911,628,22,20]`;
  3: `[1177,628,22,20]`, `[1256,628,22,20]`;
  4: `[338,697,24,20]`, `[445,697,24,20]`.
  Status: VERIFIED COMMA CLASS at all eight positions;
  confidence HIGH (0.96). Pixel shapes do not decide fullwidth encoding.
- Semicolon-shaped separators are visible after the first two triplets
  on row 2 and after the clipped leading vector of row 3. They are not
  within-triplet delimiters. The last vector has a terminal solid dot.
- Row 3, approximately y671-715: after `4)`, and before AD, a tiny
  disconnected low solid speck is visible. Window `[249,701,10,12]`.
  Status: VERIFIED VISIBLE SOLID SPECK; confidence HIGH (0.94).
  Its semantic classification as intentionally printed punctuation versus
  incidental scan/print debris is UNKNOWN. Do not silently delete it or
  promote it to a conventional stop without further authority.
- The leading characters clipped on rows 2/3 remain OUTSIDE OBSERVED
  COVERAGE; they have not been restored from MD or mathematical inference.

## H4 - Physical 79, Lower OC=c

Initial crop `[200,1510,670,160]` missed the left-hand `=c` and its stop.
The only reserved eighth display was used for this necessary unresolved
position: `[100,1600,260,70]`.
Punctuation window `[184,1650,13,17]`.
The reserved crop shows `=c` with an overhead arrow on c, followed by a
single solid low dot, then `以线段`. There is no comma tail or hollow ring.
Status: VERIFIED SOLID PERIOD/FULL-STOP CLASS; confidence HIGH (0.99).

## H5 - Physical 78, Figure 86, C1/C/B

Crop: `[733,263,493,286]`, exactly the supplied coarse source box.
Point/junction observation windows:
`C1 [853,307,60,66]`, `C [1126,274,74,70]`, `B [775,273,66,62]`.
These are source-pixel windows, not inferred geometry.

- At C1 a leftward head-like wedge is visibly aligned with the shallow
  C-to-C1 stroke; its wings flare to the right of its tip. The shallow
  stroke continues rightward through the marked M location toward C.
  Window `[870,315,40,32]`.
  Status: VERIFIED head toward C1 on the C-C1 stroke;
  confidence HIGH (0.90).
- At C1 the steeper O-to-C1 stroke reaches the same dark junction on the
  B-A stroke. Additional dark angled ink is present, but part coincides
  with the crossing stroke. Separate complete OC1 wings, and any further
  head assigned to BC1/C1B, are NOT independently distinguishable.
  Window `[853,324,60,49]`.
  Status: UNKNOWN additional head count/ownership.
- Near C, a distinct up-right head-like widening is visible below/left of
  the C junction, on the steep stroke arriving from O. Its local
  orientation follows that steep O-C stroke.
  Window `[1130,295,42,45]`.
  Status: VERIFIED head toward C on O-C; confidence HIGH (0.91).
- At the C junction itself, the upper horizontal B-C stroke, shallow
  C1-C stroke, A-C stroke, and O-C stroke merge into heavy ink. Whether
  an additional independent A-C or C1-C head is present is UNKNOWN.
  Window `[1150,274,43,28]`.
- At B, dark oblique fan/wedge ink is visible where the horizontal B-C
  stroke and the strokes toward O and C1/A meet. A one-to-one assignment
  of all wings to OB versus C1B/AB is UNKNOWN; shared or hidden wings
  are not counted as independently verified heads.
  Window `[775,273,66,62]`.

The residual UNKNOWNs are overlap-limited, not proof of arrow absence.
No eighth display was used to guess at these merged junctions.

## H6 - Physical 79, Figure 87, S Junction

Crop: `[863,1180,345,435]`, exactly the supplied coarse source box.
Junction window `[977,1231,49,76]`.

- The dashed near-vertical D-to-S stroke has a clearly visible upward
  head below S, with the near-vertical shaft and lateral flaring ink
  distinguishable from the oblique stroke.
  Window `[977,1248,25,44]`.
  Status: VERIFIED head toward S on D-S; confidence HIGH (0.94).
- The dashed O-to-S oblique stroke has a dark solid terminal stretch
  reaching the same S junction. A right-side widening/angled mark is
  visible there, but an independent complete pair of OS arrow wings
  cannot be distinguished from DS and the meeting edges.
  Window `[981,1234,37,56]`.
  Status: UNKNOWN independent OS arrowhead presence/ownership.
  Do not complete a hidden wing or label DS-only/OS-only/both as settled.

## H7 - Physical 78, First Median-Ratio RHS

Crop: `[200,900,1000,110]`.
RHS CC1 text window `[585,931,96,49]`;
overhead window `[585,910,96,24]`.
The first ratio reads visually as an arrowed MC1 on the left, equals,
one-third, then CC1 on the right. No overhead arrow shaft or head is
visible above that first RHS CC1. On the SAME source row, the next MC1
and the later CC1 both have readily visible overhead right arrows.
Status: VERIFIED NO VISIBLE OVERHEAD ARROW ON FIRST RHS CC1;
confidence HIGH (0.99).
This is typography evidence only, not a mathematical correction or erratum.

## G1 - Acknowledgment Only

The known footer inventory includes dark ornaments flanking the page
number. Acknowledged from the supplied task context ONLY. No footer crop
was made or opened and no new independent footer verification is claimed.

## Freeze

Independent findings complete. Image budget exhausted at 8/8.
Next permitted action: textual comparison of the named reviewer file's
H1-H7/G1 sections, preserving this file and its hash unchanged.
