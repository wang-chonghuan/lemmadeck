# CHOICES Display Review 7

Status: **pass**. STEMROBIN-188, `geo68-c3-s2-n38` only, offline finish=review.
No canonical promotion. This is an independent display observation, not a mathematical,
semantic, source-fidelity, or product-functionality verdict.

## Bound Inputs

- Manifest: `ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/display7/choices.json`
  SHA-256 `93f617a7118714689fffb3cf6e89800c22d08ab57c2265afb81dba39a8cf70e6`.
- Expected visible content: `choices-repair7/view-only.json` under the same evidence root,
  SHA-256 `24a583e352284d24a3602def7d0241434a658068dd80adb95f42fa5b61683457`.
- Each of the five original screenshot hashes matched its manifest entry.
  The per-file hashes, regions, asset bindings and detailed question inventory are in `review7.json`.
- Canonical title observed: 多边形的内角和. Lesson hash matched the manifest:
  `43f85928254712341e9145eaa60eb05ecbfbe0305fa8a1553a2c5b1e70887af4`.
- Existing independent semantic PASS and native with-review validator/retainer PASS
  for 20 questions / 83 options were reused from the human instruction. Source, mathematics
  and figure PASS were reused without reopening those reviews or original images.

## Complete Visible Coverage

| Original screenshot | Vertical pixels | Questions | Options |
| --- | --- | --- | --- |
| Desktop 1440 part 1 | 0-5424 | 1-11 | 46 |
| Desktop 1440 part 2 | 5424-9235 | 12-20 | 37 |
| Mobile 390 part 1 | 0-4835 | 1-8 | 34 |
| Mobile 390 part 2 | 4835-10152 | 9-18 | 41 |
| Mobile 390 part 3 | 10152-11490 | 19-20 | 8 |

All five screenshots were opened once each. Both viewports contain all 20 stems and
83 options: 40 stem instances and 166 option instances were observed.
There are 18 single-mode questions with 72 radios and two multiple-mode questions
(q4 a-f and q18 a-e) with 11 checkboxes per viewport. Native controls are 16x16 px,
aligned before their letters/first lines, and do not cover prose, math or tables.

The observation included every ordered triple in q1; primed proof endings in q2;
all correspondence clauses and decimal-angle tuples in q3; the six explanations
in q4; all definition/classification/reason endings in q5-8 and q10-12; all proof
clauses through the last BCL term in q13; every four-entry tuple in q14-16;
complete total-angle paragraphs in q17; the d, 2d(n-2), 4d stem and all five option
endings in q18; and the full final proof paragraphs/formulas in q19-20.
This checks display completeness only, without deciding which assertions are correct.

Q9 contains four full tables per viewport. Each has three headers and three
3-column body rows; A,B / B,C / C,A and both numeric columns are present.
On mobile the long headers wrap distinctly. All four last-column right edges fit
inside the choice content at x=374; no horizontal table tail is omitted.

Four source-asset figures used by the views are present at both widths:
q4 fig-233 (A,B,C,F,H,M,N and 1-6); q5 fig-234 (A-D) then fig-232 (A-G);
q13 fig-238 (M,A,N,K,C,L,B). Lines, arcs, hatching and labels are visible without
cropping, label collision, or prose/control overlap. Their widths are 640 px
desktop and 358 px mobile. Manifest minimum label sizes are 36/38 px desktop and
20.1375/21.25625 px mobile; seed asset hashes matched. No figure mathematics
or source relationship was re-reviewed.

## Hidden Endpoints

Initial screenshots were not treated as proof of hidden tails. The installed
app Playwright ran an authorized headless/offline reconstruction of the original
producer's choices-branch substring unchanged, with its exact CSS and `choiceHtml`.
Visible question content came only from the view-only projection; draft was projected
to q.id at runtime only. Canonical title, actual seed assets and display metadata were used.
The modern text body was not loaded, and no saved `choices.html` was assumed.
No original content/style or canonical file was changed.

Reconstructed heights exactly matched the manifest totals, 9235 and 11490 px.
The same visible HTML hash applies to both widths:
`bb5ca5a40acd11675a36560351ff822b25470acfcd02406cba18e30f4c8df767`.
All 369 horizontal containers per viewport reached their actual endpoints.
There are 262 math fragments per viewport and zero KaTeX errors.
Long tuples, equations and tables have no genuinely uncovered tails.

Only three small q20 V1 fragments (stem, option b, option c) have 2px overflow
at each width. Six minimal endpoint windows were captured after actual
scrollLeft=2 assertions and assembled at 1:1 scale into one 480x168 contact sheet.
It was opened once; each complete V and subscript 1 is legible. No further image
opens were needed. Individual crop buffers were not opened or retained as files.

- `endpoints.json`: SHA-256 `65919ad8d4306ccbf9529f4b931fd01e0199c0908aabf1f4a4582ba2c37da03b`.
- `horizontal-windows.json`: SHA-256 `d333e279569da673adc712f7d78842e3d3053ffeef1c9f393544c8aa19ae1ed2`.
- `horizontal-ends-contact.png`: SHA-256 `25d36a6e5d62eec184f5b552d574dfe84e286c75b75a1e8f36b660c633d8fe5c`.

## Seams And Limits

Desktop cut y=5424 is floor(q12 start), after q11's intact final paragraph.
Mobile cuts y=4835 and y=10152 are floor(q9 start) and floor(q19 start), after
the intact q8 and q18 endings. Regions are contiguous with no missing or
duplicated content; only the question boundary rules lie beside the cuts.
Q20's final option/formula/punctuation, separator and bottom margin are visible.
Bottom clearance is approximately 80 px desktop and 64 px mobile.

Findings requiring revision: none. All original and supplementary observations
are headless/offline evidence only. They do not certify headed production rendering,
selection/judging/persistence, accessibility behavior, DB integration or mathematics.
No answer-key file, original scan, standard, author or other reviewer was opened.
No keys, draft intent or coverage entered model context or the rendered surface.
No DB, environment, paid call, installation, network freshness, Git, agents,
messages, timers, shared/app edits or canonical promotion occurred.

Counters: prior context image opens 0; original opens 5; original reopens 0;
additional opens 1; batch/context total 6 (limits 8/24); additional allowance
used 1 of 3; one retained contact sheet from six unscaled endpoint crop buffers;
new whole-page captures 0; two offline inspector executions; paid calls 0;
original-source image opens 0; mathematical resolves 0; canonical writes 0.

All owned review and supporting evidence files are sealed mode 0444.
