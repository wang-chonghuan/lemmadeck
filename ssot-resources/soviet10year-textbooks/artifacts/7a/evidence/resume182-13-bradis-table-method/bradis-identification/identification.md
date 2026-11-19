# Bradis Source Identification

STEMROBIN-182, 2026-11-19. Source identification and table location only.
Checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch: `codex/STEMROBIN-182-textbooks`.
HEAD at identification: `e16207d939526da0ebb2cfc528f084f0c3791afb`.

## Actual Book

**V. M. Bradis, Four-figure Mathematical Tables**, Moscow: **Drofa, 2010**,
**13th edition, stereotype reprint**. Russian title transliteration:
*Chetyrekhznachnye matematicheskie tablitsy*. The colophon expands the author
to **Vladimir Modestovich Bradis**. Exact Cyrillic transcriptions are preserved
as Unicode escapes in `identification.json`.

- PDF 1: front cover identifies V. M. Bradis, the title, and Drofa.
- PDF 2: title page explicitly states the 13th stereotype edition, Moscow,
  Drofa, and **2010**.
- PDF 3: bibliographic verso repeats that identity and year; extent
  `93, [3] s. : il.`; ISBN **978-5-358-07433-0**; copyright Drofa **1995**.
- PDF 97: full author name and colophon; **signed for printing 14.08.09
  (August 14, 2009)**. This is not a separately stated completed-printing date.
- PDF 98: back cover repeats the ISBN.

The publication year is thus supported by actual title/verso pixels, not the
archive filename's `2010` or PDF creation metadata. Publication year 2010,
copyright 1995 and the 2009 printing-signature date are different statements.
An independent actual press-completion year is not visible.

## Table Locations

The contents on **PDF 96** directly prints these start-page references:
Table III **Squares**, 32; instructions for Table III, 34;
Table IV **Square roots**, 35; instructions for Table IV, 39;
Table V **Cubes**, 40.

| Item | Printed pages | Projected PDF pages |
|---|---|---|
| III Squares, before instructions | 32-33 | 33-34 |
| III instructions | starts 34 | starts 35 |
| III table plus instructions | 32-34 | 33-35 |
| IV Square roots, before instructions | 35-38 | 36-39 |
| IV instructions | starts 39 | starts 40 |
| IV table plus instructions | 35-39 | 36-40 |
| Following V Cubes | starts 40 | starts 41 |

**Range ends are inferred from the following contents entry**, not printed as
explicit ranges. Table data may share an instruction page; this has not been
checked. No Table III/IV body, heading, footer, correction column, or value
was inspected in this assignment.

**Only one real page-number anchor is available:** PDF 4 has printed footer
**3**, so the working projection is **PDF = printed + 1**. No other supplied
image has a legible printed-page footer. In particular, the reference numbers
in the contents are not that page's own footer. Interior continuity and the
global offset remain unverified; the PDF ranges above are next-inspection
projections, not authenticated table locations.

## Instructions And Preprocessing

PDF 4, printed page 3, visibly contains *General calculation rules*. It
distinguishes exact/approximate data; explains rounding and reliable digits;
warns against placeholder zeroes in approximate integers; relates retained
decimal places or significant digits to the input precision; gives general
precision guidance for powers and roots; and recommends one reserve digit
in intermediate results, discarded at the end.

Its preface describes direct table entries as rounded within half a last-place
unit, and interpolated entries as potentially less accurate, usually within
a last-place unit. This records the candidate's statement only; it validates
no exercise result.

The contents puts the general rules at printed 3, followed by Table I at 5:
thus their inferred span is printed **3-4**, projected PDF **4-5**. Only PDF 4
was inspected. Table-specific use instructions are at printed **34** and
**39**, projected PDF **35** and **40**, both uninspected.

The contents also locates *Explanations to the tables* at printed **85**,
followed by *Important formulas* at 92: inferred explanation span
**85-91**, projected PDF **86-92**. The inspected general-rules text itself
cross-refers to interpolation on printed **85-90**, projected PDF **86-91**.
Those referenced pages were not opened.

Specific argument domains, decimal/mantissa normalization, scaling,
tabulation steps, row/column meanings, correction signs and interpolation
procedures cannot be established from the eight allowed images. No required
lesson input/value ranges were invented.

## Exact Next Inspection Targets

A future fresh batch can inspect **PDF 33-40 inclusive**, exactly eight pages:
Squares start and continuation (33-34), its instructions (35), Square roots
start/continuations (36-39), and its instructions (40). First confirm real
footers against expected printed **32-39**; correct the projection if needed.
The following-table boundary is projected **PDF 41 / printed 40** and would
require a later batch, not a ninth image here. General explanations are a
separate possible later target at projected PDF 86-92.

This list locates candidate primary scan pages. It does not authorize opening
them, lookup, mathematical solving, a new lesson/content gate, or approval.

## Condition And Limits

The front cover, title, verso and general-rules page are present and readable.
There is no visible evidence of missing material before printed page 3.
Missing original blank leaves or other front matter cannot be excluded. The
tail contains a readable formula continuation (PDF 95), contents (96),
colophon (97), and back cover (98), without legible pagination anchors.

No allowed image is visibly blank, garbled or unreadable for identification.
Cover table backgrounds are decoration, not lookup evidence. Uninspected
interior pages could still be missing, duplicated, reordered, corrupted or
unreadable. Neither full PDF structural integrity nor interior pagination was
established.

The edition is bibliographically identifiable; its mathematical entries and
correction system, and equivalence to the historical textbook's Bradis table
version, remain **unverified**. The printed word "stereotype" alone does not
prove such equivalence.

No n38/n39 lesson prose was needed to identify this named work. No answer
keys, reviewer/choice artifacts, external pages, environment files, databases,
models, agents or operational workflows were used. Zero table lookups, zero
table-value transcriptions, no solving, no answer-provenance approval.
**n38/n39 HOLD status is unchanged.**

## Evidence

The preserved candidate PDF is 6,144,851 bytes; its full SHA-256 is:

`249b865dc7ae985ecfa6604531efb5e8b7896c481db1a5e2f4170940f4033656`

The reported 98-page, no-OCR characterization is supplied by the user; no new
PDF structural scan, OCR or render was performed. Existing acquisition records
report the observed DPVA ZIP download via CloakBrowser and byte-preserving
single-payload extraction to the ASCII name `book.pdf`. The earlier legacy
filename unzip error is not evidence of a damaged mathematical scan.

`hashes.json` contains full SHA-256 hashes and sizes for the entire PDF and
all eight existing PNGs. `image-ledger.json` binds each one-time
`detail: original` image load to its hash, observation and counter.
Image count: **0 -> 8**; no crops, reopens, new renders or additional images.
No PDF/PNG copies or source changes were made. Only the four evidence files
in this authorized identification directory were created.
