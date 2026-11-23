# N59 Bounded Independent Display Review

Date: 2026-11-23. Ticket: STEMROBIN-187. Lesson: math4-c2-s2-n59.

Verdict: **PASS for the inspected visual-layout samples.** No concrete accidental
clipping, overlap, unreadable main typography, or missing/blank figure was observed
in those samples. This verdict follows eight actual image inspections, not merely
the retained report's PASS.

Working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.
Evidence paths below are relative to
`ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s2-n59/evidence/display/`.

## Boundary And Reused Evidence

- Read the ld-s10y-image image-batch rules and production-resume display boundary.
- Used the existing completed `report.json` and eight existing full-page PNGs.
  The retained `check.mjs` was read selectively for provenance, never executed.
- The retained report covers desktop 1440x960 and mobile 390x844, all four views,
  full lesson text, 33 written exercises, 41 choices, and 33 answers. Its existing
  whole-content projection, DOM geometry/font, figure-reference, scroll-end and
  no-error checks are reused, not rerun or claimed as new execution.
- The report still contains `visualReviewPending: true`; it was left unchanged.
  This companion document records the separate bounded visual observations.
- No browser capture, render, validator, keyboard, product, source, mathematics,
  option-correctness or figure-fidelity review was performed. No DB, environment,
  network, paid, publication, Git, app, course-source or progress operations.
- Writes were limited to this document, eight inspection PNGs and the optional
  image-processing helper `inspection/make_strips.py`. Existing files and staging
  were not modified.

## Actual Image Usage And Samples

One fresh batch, **8 actual model-context image loads / 8 allowed**;
this review's cumulative context usage **8 / 24**. Zero reopens, zero additional
crop loads, and zero original full-page image displays. The parent's previously
used 24/24 context was not reopened or imported. Pillow decoding/processing
produced one composite per record; only the eight composites below were loaded
with `view_image`, once each, in this order.

All samples retain the original screenshot width and pixels without rescaling.
Each band has a 24px inspection-only coordinate label. Source intervals are
half-open original PNG y-coordinates, across its entire width. Label bars and
abrupt joins are sampling artifacts, not page layout.

| Load | Existing PNG Size | Inspected Composite Size | Original Y Bands | Visually Inspected Content |
| --- | --- | --- | --- | --- |
| 1 | text-1440.png, 1440x960 | text-1440-inspection.png, 1440x984 | [0,960) | Entire retained image: title, prose, long equality, subtraction array, four-rule list, exercise link and footer. |
| 2 | text-390.png, 390x957 | text-390-inspection.png, 390x981 | [0,957) | Entire retained image: same content, wrapped rule text and initial left position of the horizontally scrolling equality. |
| 3 | exercises-1440.png, 1440x5235 | exercises-1440-inspection.png, 1440x1856 | [0,951), [4210,4636), [4828,5235) | Heading and exercises 976-980; exercise 1005 stem plus actual fig-223; exercises 1007-1008 and return link. A fragment of preceding exercise 1004 is cut at the figure-band start. |
| 4 | exercises-390.png, 390x6317 | exercises-390-inspection.png, 390x1857 | [0,550), [703,1062), [5245,5705), [5925,6317) | Heading, exercises 976-978, complete nine-row list in 980, 1005 stem and left portion of fig-223, 1007-1008 and return link. A preceding 1004 fragment is cut at the figure-band start. |
| 5 | choices-1440.png, 1440x13492 | choices-1440-inspection.png, 1440x1899 | [0,300), [5898,6620), [11855,12280), [13136,13492) | Heading, choice 1 stem and option A; choice 20 stem and entire actual fig-choice-4m-992-measure; choice 38 stem and actual fig-223; choice 41 stem, all A-D options and page end. |
| 6 | choices-390.png, 390x15752 | choices-390-inspection.png, 390x1885 | [0,379), [7190,7945), [13950,14265), [15345,15685) | Heading, choice 1 stem and multiline option A; choice 20 stem and initial left part of its actual figure; fig-223's initial left picture band only, not choice 38 stem/options; choice 41 stem and all A-D options. Final 67px of screenshot footer whitespace omitted. |
| 7 | answers-1440.png, 1440x3936 | answers-1440-inspection.png, 1440x1898 | [0,910), [1930,2200), [3290,3936) | Heading and answers 976-982; prose/angle-notation answers 992-993; final answers 1004-1008 and footer. |
| 8 | answers-390.png, 390x5072 | answers-390-inspection.png, 390x1839 | [0,800), [2500,2865), [4470,5072) | Heading and answers 976-980; wrapped prose/angle-notation answers 992-993; final answers 1005-1008 and footer. |

All composite paths are under `inspection/`.

## Observed Layout

**Typography and mathematics:** Main Chinese prose and mathematical digits/signs
are clear in both widths. The text-view subtraction array has distinct rows,
aligned decimal columns and an unobstructed rule/result. Desktop equality and
fraction terms have sufficient vertical clearance. Mobile prose wraps without
covering adjacent content; the long equality remains a horizontal scroll line,
not an accidentally overflowing whole page. Sampled written lists, multicharacter
exercise numbers, choice markers and answer headings are separated from bodies.
Angle accents, degree signs and wrapped mathematical answers in 992-993 are
visually distinguishable. No arithmetic or notation correctness is asserted.

**Options and answers:** Choice 1 option A wraps coherently, including its longer
mobile verification expressions, with its marker in a separate column. Choice
41's complete A-D list is readable and separated at both widths; its mobile
question stem wraps above the options without overlap. Sampled answer paragraphs
and calculation lists remain within their column and clear of separators.

**Actual pictures:** Desktop choice 20 contains a visible, nonblank quadrilateral,
with A, B, C and D labels clear of the shape and surrounding prose. The retained
geometry places this new 992 figure at 640x600px; the visible white space is
around a real outlined figure, not an empty media block. Desktop fig-223 appears
below the relevant written/choice stems, with both illustrated pipe groups and
the x / 2.89 m labels visible and clear of adjacent content. Its retained picture
box is 640x295.375px. This is picture-placement review only, not a comparison
against original source pixels or mathematical figure semantics.

**Scrolling and clipping:** Mobile choice 20 shows A/D and the left portion of
the quadrilateral; B/C are outside the initially visible horizontal window.
Mobile fig-223 likewise shows the left pipe group rather than the full right
group. These are expected scroll-window boundaries, not visual failures. The
unchanged report records endReached=true for both mobile choice figures
(282px extents), the mobile exercise figure (330px extent), other mobile exercise
scrolls (38px/19px), mobile text (186px), and desktop exercise scroll (13px).
No new scrolling interaction was performed. No accidental clipping of sampled
ordinary prose, answer bodies or option markers was observed.

**Page flow:** Sampled starts, figure bands and final items have coherent vertical
spacing. Footer whitespace, inter-item separation and padding within the wide
instructional picture boxes do not indicate missing content in the inspected
bands. End links are visible where retained screenshots include them; their
functionality is not retested.

## Limitations

Only the two short text screenshots were inspected in full. Long written,
choice and answer pages were sampled at the exact bands above: most intervening
items and options were not visually read, and this review does not claim every
pixel or every option was inspected. Options under choices 20 and 38 were not
sampled; mobile choice 38's stem was not sampled. Offscreen mobile figure portions
were not visually inspected at a scrolled-right position; desktop pictures and
the retained horizontal-end evidence are complementary, not a new mobile capture.
Whole-content DOM checks are the existing report's evidence, not a substitute for
these visual observations and not a claim of exhaustive visual coverage.

No new backend, publication, content-correctness or source-fidelity claim follows
from this display-only PASS.

## SHA-256 Bindings

Report, retained driver and helper:

| File | SHA-256 |
| --- | --- |
| report.json | 26510df6ce235af5acea4543c04b050a0ef0786da776d65b148d2e55d34c8c92 |
| check.mjs | 887cca830c8975532f7fb5bd5efb96d7ad27bfe2d0cc5ba17071e9d7071cebf8 |
| inspection/make_strips.py | 9bc303d37d3d353478e789bc443fe2ff0665823308b4452590d3f1617e871d25 |

Recorded lesson inputs were independently byte-hashed without reviewing their
content; all five matched `report.json.inputs`. Paths are relative to
`ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/lessons/math4-c2-s2-n59/`.

| Input | SHA-256 |
| --- | --- |
| lesson.json | cbccb0899ec6bc09cf45fa11390ab1333b81f1c0fe2c112f06a187620dd69918 |
| exercises.json | 8a7c6ee4d4ab88fcbed8e5791555c4fc4d356e10b8681bccf2aa083dc445c80c |
| figures.json | 6d4beaa4e58315ca137cbd160414cbd7efed49fb9eea6f8f040ff27d488aafd9 |
| choice-set/draft.json | b1f6b0ad234af88bbcc14fb9f4ec4e9cbec9e0f4e52afe449f82640751158661 |
| answer-keys.json | fb31f598863d195b2ecc9346237e9d50984f9c1a0e3aa6e4a66be4f3b1d3dc3a |

Original screenshot hashes were independently computed and all eight matched
their retained report records. Composite hashes identify the actual images
loaded for this review.

| Record | Original Screenshot SHA-256 | Inspection Composite SHA-256 |
| --- | --- | --- |
| text-1440 | 4157e88e918ce3e19436f0a2f629a9140354368e827f212ba21909dd4b641216 | 67993fd727cd736d9c509600192021698f462f12215f0d0bbc5458848e385fb3 |
| text-390 | 794653153b646928c4ab9b0e8d57a3dd9c6efb87dc2f734bb93af79a028f7b8a | c0104c8f206e5b638e3ff68ce24c289e18eb22f708fa6c8f554bd15747f9fb50 |
| exercises-1440 | 79ca808457ddd84dc9b5a3479c782f0e62affae7545be586be1c3863b04cb927 | 8ccf8dfa0b3329f436e94bb018a265d743fc4f5b9dabdddf696da865589b4349 |
| exercises-390 | 704a4a89553594240b6b8594039aea87ccb01a780a38fa3ff2695ce3bec1f824 | 686812b0727078f9d22a2b4b66d902e7ada9612300c17b104ead2c83b6c7e525 |
| choices-1440 | 9b94f94c202aca4071dd307f8cc62cd66a7dc42185974133710fecdf343e6b55 | ab289bf170d03556f742d76056faab504f777b66724d071c76567d52fad777bd |
| choices-390 | ecf5165bebf560c7418b7f26cd6e72d04afc2483f6f65776463e1e7deda3b489 | b00f0fd4cffd674a0fa0f8ecfe2e4204fb3a35a550c28bc2bb2ac45f1276affb |
| answers-1440 | de6e9f5e6ba95a730624214917be488cc77d909781696ad08c2868ae2f869768 | 72408c1aa78d61b05695e230e605b7c19242b6e15b8d936a73b6808fdfc01f4d |
| answers-390 | a3ef34795eb73007b8de38db1235ad04844ee1c97b20552ce2273f821b0f2265 | 21873d1ca5328f46aa302752ade3bdef54b2ca0234df173ed13247838a027055 |
