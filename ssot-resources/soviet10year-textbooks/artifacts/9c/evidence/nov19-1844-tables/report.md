# STEMROBIN-184 B Independent Figure Review

**PASS** for tbl-p0028-01 and tbl-p0031-01, bound only to the bytes below.
This is not a canonical review, promotion, or permission to publish.

## Findings

No required correction found. Both originals were inspected once before the
frozen inventory or candidates. All six m headers, six n rows, 21 coefficients
and 15 blank m>n positions agree with source pixels and independently computed
mathematics. p28 uses arrangements n!/(n-m)!; p31 uses combinations
n!/[m!(n-m)!]. All six unheaded p31 row sums equal 2^n: 1,2,4,8,16,32.
The p31 pixel dash remains unclassified provenance, not a coefficient.

Both retain a shared rectangular frame and the actual source separators;
there are no body-row or coefficient-column rules, no new lattice, no printed
anchor markers, invented sums heading, extra m=6, zeros or placeholders.
Spacing, taller composition and straightened/reconnected rules are declared
modern regularization. The m/n diagonal relation remains readable.

All 35 p28 and 41 p31 hidden labelled anchors have visible labels, inside-frame
assertions and mapped point-relationship coverage wholly within their inventory
group (34/40 displacements respectively). Those maps express regularized
logical relationships, not exact scan-pixel distances. gridDimensions is not
applicable: neither spec has a finite grid object and neither image has a
finite instructional lattice. objectCount is not substituted for it.

## Display Evidence

Exactly four whole-SVG screenshots, at actual640px and331px per figure, were
captured and inspected once. Both frames and all rows are visible. Projected
minimum text at331px is 16.5500px (p28) and16.5496px (p31); at640px it is
32.0000px and31.9992px. Projected text equals the declared labels and anchors,
shares column/row alignments, has no collisions and leaves all15 invalid
positions empty. Painted glyph bounds stay inside the frames; finite border
geometry stays inside each SVG. No unreadable rows or glyph clipping observed.

Neutral, accent and print DOM checks pass using the actual app token block.
Visible paint correctly remains ink/paper in an ink-only table; accent-role
variables recolor but do not invent highlighted content. Literal default
colors in hidden construction nodes cannot paint. Print remains legible.

Nonblocking limitation: p31 m narrowly clears the diagonal, about0.090px
at640 and0.054px at331 using conservative projected glyph rectangles.
No collision measured or observed in tested Chrome/Arial. Other font/platform
metrics are not certified.

## Diagnostic Honesty

The initial checks.json is retained unchanged. Its theme failures came from
my fixture selecting the first :root block without sr tokens. The separate
corrected diagnostic passes all12 theme cases. Initial screenshots' neutral
fallback ink/paper match the corrected fixture's visible paint.

The p31 m font box extends above the top frame by about1.148px at640 and0.605px
at331. That unpainted font extent is not glyph clipping. A separate DOM-only
alphabetic-baseline/Canvas ink measurement confirms all painted glyph bounds
inside the frame and no ink/rule intersections. Diagnostics produced no more
screenshots or visual image opens and reran no validator or producer.

## Scope And Preservation

Official spec validators passed once each at rendered stage. Both existing
official render reports pass and bind the current specs/SVGs; neither renderer
was rerun. Existing app Playwright was explicitly headless:true and isolated;
owned browsers closed in finally. Browser network requests:0.

Only this review directory was written. Reviewed inputs and frozen inventory
bytes remained unchanged. No models/network, old chats/agents, DB, publish,
git, canonical changes, record_review, finalization or promotion. Temporary
paths remain candidate-only; no full product-page, durable-path or publication
acceptance is claimed. Images ledger:6 total (2 originals +4 screenshots),
hard maximum8, zero reopens/crops/enhancements.

## Hash Bindings

SHA-256; report.json also binds the skill, validator, renderer, app CSS,
browser instructions and all review scripts/evidence.

tbl-p0028-01 source: `0b34204139b6d55244cc648681351dbc07d7c3301ebefe319bb99e42aace94af`

tbl-p0028-01 spec.json: `9fd7e8a900a691cd5e495b1d2a48871c3d2fb1714b5362ee1bd2e19ed451fc88`

tbl-p0028-01 figure.svg: `9287aa22885133ced242bd0995437c3382384df06b5c6433fcca696a187d69ae`

tbl-p0028-01 render.json: `f9b5c48522672a925efe4bbf274205f3984bcd94af9283c1b3edccb4f76c2e18`

tbl-p0031-01 source: `a7bb6fe27832d572966838281d714fe3efd0c54ce9f5b7de7684a3f86cab4d2f`

tbl-p0031-01 spec.json: `673eb31bfaa53c512e4a004fedc95b8f987a98b23879dd382d50de35e77d0f1a`

tbl-p0031-01 figure.svg: `8a09c1b4d602e5eef4b192f4197b7e5f57c4c4963ba747560bce47d56d744112`

tbl-p0031-01 render.json: `95afc3f2dfa6e785b6a07040508abe0f39f093c50aea694a73f69dfcda7c8b12`

Frozen source inventory.json: `bf0d363ee24aac2f393b1165e58c23f9ce600715d2ba046c80d7a407d03cf7d7`

checks.json: `faba70b14f2fc80d7ad29091fe19e571f9ffe4c617f2daa8c658b5f79af4c68b`

diagnostic.json: `5ba365f985e9d694fe5b3d1a69307783584edd336e176125353a73be733ff5aa`

glyph-check.json: `6a8394ccc4f85cde569971d85a1c0e99bde2efbdd290afd6348d22d2f432fa1c`

images-ledger.json: `42fd19ed26da4b358471ae0683f643f444ddfc8a5d455fbcf106c9af3315180c`
