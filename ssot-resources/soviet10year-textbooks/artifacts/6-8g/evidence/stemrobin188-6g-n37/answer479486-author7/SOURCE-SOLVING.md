# Source-first independent solving

Date: 2026-11-23. Role: bounded AUTHOR only, not reviewer or approver.
W = /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188
Owned directory: W/.intentfold/tickets/STEMROBIN-188/tmp/n37-answer479486-author7
Scope: book 6-8g, modern-us-neutral, geo68-c3-s2-n37, written exercises
479 and 486 only, in that order.

This document was authored before candidate-answer-keys.json existed. Its next
step is a 0444 seal before candidate creation. No earlier standards, reviewer
FIRST files, answer keys, choice keys, peer outputs or parent keys were consulted.
The prepared template was queried only for its 479/486 entries and header.
The canonical exercise file was queried only for its 479/486 entries and header
keys. A preliminary selector returned an empty list because this file uses
number/source_number rather than exercise/id; the corrected selector retrieved
the two authorized entries. This was a query diagnostic, not a source failure.

## Exact semantic inputs

All paths below resolve relative to W. SHA-256 hashes bind whole input files;
hashing a containing file is not consultation of its other exercise contents.

- Canonical modern exercises:
  ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/lessons/geo68-c3-s2-n37/exercises.json
  ad5b62e04d1f9d14825d32255127af2101cbec2955f403a361534ee82ae354b2
  Read only number/source_number 479 and 486. Source anchors: p0172#9 and p0173#11.
- Native prepared template:
  .tmp/ld-s10y-answer/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n37/answer-keys.template.json
  cdecea8b9148684f512147240a5bfdac82fef8a48758ff5fdeae586b7af8482d
  Only answers with exercise "479" and "486", plus schema/book/lesson/edition/status.
  The jq -cS projection with that header and those entries, including its final
  newline, has SHA-256 f2cf5ee6a830013f46d511dfeb208a272509fc2adff746eb5937208d6a2cf805.
- Original figure 230:
  ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-230.png
  c15026fd061594260867f8ce83a2fc33a0ba8de472ebda87b34e57569870d27f
- Original figure 231:
  ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-231.png
  e8e8b389d51b21ddab9d8b53b3f560a05b69931e406ef8deead5b5789da04dba
- Modern final SVG 230:
  ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/fig-230.svg
  a06e50e1f3d6b60b70f8f5bfb62b972c600a0c352fad35674fba73e5d72ec72a
- Modern final SVG 231:
  ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/fig-231.svg
  f5bf96cbcdb8482be898f80194e90bbdaac212cedd599a1fdfba7383f9294b8c
- Actual FigureSpec 230:
  ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/fig-230.spec.json
  8dcb640d0cbb3132983c7970c56cbb655a01b20ee29682e5ad010c564370bfb2
- Actual FigureSpec 231:
  ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/fig-231.spec.json
  e4d86df3e3718724828c281720367db68921529b07db85e2282a9e9519a70220

Required production instructions were read, not executed:

- .claude/skills/ld-s10y-answer/SKILL.md
  ae4e3ed6df73d03314a524d446af463564d2c1313a72eab7bc6edb024e220932
- .claude/skills/ld-s10y-lesson/references/production-resume.md
  13b89b436d595d08af0d5d5408a74bba552807d025973de5cb5857d3b25bb9a9

Routing/engineering/operations instructions were also read. No IntentFold
capability, bootstrap, service, paid/model call, dependency operation, git
operation, native prepare/finalize/render, DB access or product browser ran.

## Actual figure observations and limitations

Original PNG 230 was viewed once at its native supplied size, without crop:
two roughly horizontal unmarked strokes, upper labels with A/P/B shapes,
lower C/Q/D shapes; one oblique stroke rises rightward from the M-shaped lower
endpoint to the N-shaped upper endpoint. It crosses the lower stroke at Q and
the upper stroke at P. No angle arc, number or perpendicular marker was seen.
The original label alphabet remains UNKNOWN; the modern approved names supply
the naming convention, not a retroactive identification of the scan's alphabet.

Original PNG 231 was viewed once without crop:
upper A/B/C-shaped labels, lower F/D/E-shaped labels; the oblique stroke runs
from the upper-left R-shaped endpoint through B, then the dark lower crossing
D, to the lower-right P-shaped endpoint. A single arc lies right/below B,
between the rightward upper-row ray and the downward-right diagonal ray.
Its adjacent glyph looks a-like, but a versus alpha remains UNKNOWN as a scan
fact. A tiny speck above/right of the C-shaped label is visible; its role is
UNKNOWN. It is not promoted to a prime, point, label or extra geometric datum.

Both actual modern FigureSpecs were read in full. Spec 230 declares ordered
A-P-B, C-Q-D, M-Q-P-N and AB parallel CD. Spec 231 declares ordered A-B-C,
F-D-E, R-B-D-P and AC parallel FE, with the sole given alpha arc CBD. Their
layout coordinates/displacements are not measurements of the mathematical
angle, and do not authorize numeric alpha, perpendicularity or finite-length
equality.

Both final SVG files were opened as text after the visual tool failures.
Markup 230 contains three visible line elements (AB, CD, MN) and the eight
named labels A/P/B/C/Q/D/M/N; its point ellipses are hidden and no visible angle
arc is present. Markup 231 contains visible AC/FE/RP lines, a visible CBD arc,
the eight point labels A/B/C/F/D/E/R/P, a visible D ellipse and alpha text.
These are actual markup observations, NOT observations of rendered modern
images, font legibility, clipping or appearance.

Modern SVG VISUAL inspection remains incomplete:

1. functions.view_image on fig-230.svg: unsupported image data.
2. functions.view_image on fig-231.svg: unsupported image data.
3. CUA hidden in-app local-file view of fig-230.svg: iab unavailable.
4. CUA Chrome local-file view of fig-230.svg: URL protocol blocked by browser
   security policy. No page opened. No workaround or further browser attempted.

CUA completion recording initially exceeded its 80-character maximum, then
succeeded with a shortened summary. This was a reporting error, not imagery or
content approval. No screenshots, crops or image conversions were made.

Image accounting for this fresh bounded author context: 2 successful original
image emissions; 0 successful modern image emissions. There were 4 direct
image-tool requests (2 successful PNG + 2 failed SVG) and 2 additional failed
modern-view opening attempts. Conservatively count all 6 attempts, including
reopens, against both batch 8 and context 24 limits. Four distinct requested
image files; no reset. Modern fig-230: 3 attempts, fig-231: 1 attempt;
original fig-230: 1, original fig-231: 1.

## Independent solution: 479

The task asks for concrete angle pairs whose two sides respectively point in
the same directions, on figure 230. It does not ask for a generic criterion.

From A-P-B and C-Q-D on the parallel rows:

- PA and QC point the same way (leftward in this drawing).
- PB and QD point the same way (rightward).

From M-Q-P-N on the transversal:

- PN and QN point the same way (toward N).
- PM and QM point the same way (toward M).

Choose one ray from each row-direction class and one from each transversal
direction class. The resulting complete four cross-vertex pairs are:

1. angle APN and angle CQN: sides PA/QC and PN/QN.
2. angle NPB and angle NQD: sides PN/QN and PB/QD.
3. angle BPM and angle DQM: sides PB/QD and PM/QM.
4. angle MPA and angle MQC: sides PM/QM and PA/QC.

Every listed pair has individually same-directed corresponding sides, hence
equal angles. This explicitly accounts for all four sectors at P and the
matching four sectors at Q; opposite-directed sides are not substituted.
No numerical angle values or new point labels are needed.

## Independent solution: 486

The modern prompt explicitly supplies AC parallel FE and alpha; it requests:
(1) angles equal to alpha, and (2) four ordered pairs of ray directions:
BC/DE, BC/DF, BA/DR, BR/DE. It supplies no numeric alpha.

The single given arc is angle CBD = alpha. The ordered incidences give:

- BA and BC are opposite rays.
- BR and BD are opposite rays; BD and BP are the same ray.
- DF and DE are opposite rays.
- DR and DP are opposite rays; DR and DB are the same ray.
- BC and DE have the same direction on the parallel rows.
- BA and DF have the same direction.
- BD and DP have the same direction.
- BR and DR have the same direction.

Part 1:

angle CBD = alpha is given.
angle ABR = angle CBD = alpha by vertical angles at B.
angle EDP = angle CBD = alpha by corresponding angles on AC parallel FE
and the R-B-D-P transversal.
angle FDR = angle EDP = alpha by vertical angles at D.

Thus the concrete four sectors are CBD, ABR, EDP and FDR, all alpha.
The additional angles besides the marked one are ABR, EDP and FDR.
The same-ray aliases CBP for CBD and FDB for FDR denote no extra sectors.
The other four crossing sectors have measure 180 degrees - alpha, from
adjacent opposite rays; no additional numerical or perpendicular condition
is imposed.

Part 2 uses angles BETWEEN RAY DIRECTIONS, not between unoriented supporting
lines. A construction is to translate the second ray's origin to B while
preserving its direction, using only rays already named in the figure:

a. Translate DE to B: it coincides in direction with BC.
   The two rays coincide after translation; angle = 0 degrees.

b. Translate DF to B: it coincides in direction with BA.
   BA is opposite BC; angle = angle CBA = 180 degrees.

c. Translate DR to B: it coincides in direction with BR.
   The required angle becomes angle ABR = alpha, proved in part 1.

d. Translate DE to B: it coincides in direction with BC.
   The required angle becomes angle RBC.
   Since BR and BD are opposite rays,
   angle RBC + angle CBD = 180 degrees.
   Therefore angle = 180 degrees - alpha.

Ordered result: 0 degrees; 180 degrees; alpha; 180 degrees - alpha.
No new construction-point letter, prime, measured numeric angle, source-speck
interpretation, keyboard behavior, interaction schema or automatic judgment
is introduced.

## Author-only boundary

Both written standards can be encoded as derived, ungraded, parts=[] with
complete read-only display proofs and the ray-translation construction above.
The actual native prompt and figureEvidence objects must be copied unchanged.
Candidate status remains draft. This source derivation is not semantic
self-approval. The missing modern visual observation is a concrete outstanding
failure to disclose to the parent, not permission to reuse unseen reviewer
records or to finalize/publish. All artifacts remain solely in the owned path.
