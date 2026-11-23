# N38 Actual Candidate Comparison 7

Outcome: COMPARISON_PASS_WITH_499_HOLD.
Owner: Carver, same original188-7 independent context.
Scope: content/mathematics comparison only, review/offline.

## Findings and decisions

No required mathematical revision was found in the disclosed 20 prose
paragraphs or 17 standards. The review did not infer approval from the text
author's mechanical math-preservation checks: definitions, proof dependencies,
angle orientation, classification quantifiers, expanded cases, vertex pairings,
existence conditions, and the alternative proofs were compared substantively
against the already sealed FIRST.

- Prose: 20 PASS, 0 REVISE, 0 HOLD.
- Prompts: 17 PASS, 0 REVISE, 1 HOLD (499).
- Standards: exactly the 17 supplied entries, all PASS; no 499 answer entry,
  slot, placeholder, or approval was created.
- Required changed fields: none among the passing items.
- Held fields: exercise 499's figure-dependent delivery at
  `exercises.template.json#/exercises/11/figure_refs` and
  `#/exercises/11/figures`, and its unsupplied answer candidate.
  Its literal text was compared, but 499 as a complete task is not approved.

The PASS decisions are mathematical decisions for the exact bound candidate
bytes, under the recorded current-prose conventions. They are not modern-image,
layout/rendering, native-finalization, answer-runtime/grading, choice, DB,
publication, or whole-lesson approvals.

## Exact bindings

Sole cwd:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`

Owned output root:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/.intentfold/tickets/STEMROBIN-188/tmp/n38-content-independent7`

Evidence root N38:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38`

| Candidate/support file relative to N38 | Observed SHA-256 |
| --- | --- |
| text-author7/candidate/lesson.template.json | 9f61dabc64e3545533685aa2026402ccc7431ca42e78d791532b7c264bae5d9b |
| text-author7/candidate/exercises.template.json | ebb0a3a864771163705b9c6f441deedbab5d1e611992e63439da11c328784f60 |
| seventeen-answers-author7/candidate-answer-keys.json | 61bd1ae85a3103f84dacbf635fa8c97ee3929d66d9699323bf63fe14fcbb71f3 |
| seventeen-answers-author7/AUTHOR-RECORD.json | 5f92a6c2cd73a5e6ce2c568e078c65654a31ec628af6002b137f336a12166360 |
| text-author7/SOURCE-ADAPTATION.md | 3385efb6e02abff1f34b6d223bc249fc725ac5b9f6fd7f1eb0f259d4833d8789 |

All four human-supplied candidate/record hashes matched the actual disclosed
files. The supporting adaptation document's hash was also recorded.

The immutable FIRST basis is the existing owned SOURCE-FIRST.md
`59753dd08d741bb7e7107416b17be428e04144a6d6484cfdbd711b35f7c867fd`,
source-review.json
`f6d1523d74a10dc9dfb55880e37897fe30902328ca8c66b2324a1c912b88faa9`,
and first-seal.json
`9d58dee154d220942b28aef01471c0845e2a08bf0527e3894d02cd4491b52b64`.
The direct human instruction confirms retention at N38/content-independent7.
Those three files were not changed or rehashed, and the source was not re-solved
or reread. Their prior fail/UNKNOWN records remain authoritative history.

The answer AUTHOR record describes initial native-template prompt hashes and
explicitly leaves final modern-prompt binding pending. This comparison binds
the supplied standards to the actual disclosed modern prompt fields, not to an
assumption that those historical prompt hashes are unchanged. Exact current
prose, prompt, and standard field hashes and JSON pointers appear in the JSON
companion. Hashes of field text are UTF-8 SHA-256 without an added newline.
This binding does not cover future edited or finalized bytes.

## Every prose paragraph

Pointers are zero-based JSON pointers in the bound lesson template. Twelve
figure/caption objects remain structural context, not additional prose or a
modern-figure review.

| Pointer | Source refs / role | Decision and substantive comparison |
| --- | --- | --- |
| /prose/1/text | p0174#3: definitions | PASS. Convex interior and its adjacent supplementary exterior retained; BAG role not changed into a remote angle. |
| /prose/3/text | p0174#5: introduction | PASS. Same theorem introduction; no new premise. |
| /prose/4/text | p0174#6: theorem 47 | PASS. Nondegenerate triangle sum remains 180 degrees. |
| /prose/6/text | p0174#8: givens | PASS. Angles 1,2,3 remain the three interiors; line splitting does not reassign vertices. |
| /prose/7/text | p0174#9: goal | PASS. Same three-angle sum, not a previously assumed premise. |
| /prose/8/text | p0174#10,#12: construction | PASS. Parallel through C and both side continuations retained. |
| /prose/10/text | p0174#13: 1=4 | PASS. Both same-directed ray pairs retained, consistent with sealed figure-233 topology. |
| /prose/11/text | p0174#14: 3=6 | PASS. Same analogous direction-based equality; no arc/bar inference. |
| /prose/12/text | p0174#15,p0175#1: conclusion | PASS. 2=5 is vertical; 4,5,6 partition straight MCN; substitution proves the sum. |
| /prose/13/text | p0174#16: footnote | PASS. Terminological angle/measure shorthand retained, not a mathematical premise. |
| /prose/14/text | p0175#2: corollary 1 | PASS. One right/obtuse interior leaves two positive angles with sum at most 90, both acute. |
| /prose/15/text | p0175#3: corollary 2 | PASS. Equilateral plus equal-side/opposite-angle fact yields three 60-degree interiors. |
| /prose/16/text | p0175#4: corollary 3 | PASS. Exterior equals the two nonadjacent interiors, not its adjacent interior. |
| /prose/19/text | p0175#7: exterior proof | PASS. Two 180-degree sums share C; cancel C. No circular exterior premise. |
| /prose/20/text | p0175#8: theorem 48 | PASS. Convex n-gon formula 2d(n-2) retained with integer n>=3 context. |
| /prose/21/text | p0175#9,#12,p0176#1: O-fan proof | PASS. O inside convex polygon; n triangles; 2dn minus full 4d at O. |
| /prose/24/text | p0176#2: quadrilateral | PASS. n=4 gives 4d. |
| /prose/25/text | p0176#3: theorem 49 | PASS. Convexity and one selected exterior per vertex both explicit. |
| /prose/26/text | p0176#4: exterior sum proof | PASS. n supplementary pairs minus interior sum gives 4d; no duplicate-vertex count. |
| /prose/31/text | p0176#9: nonconvex note | PASS. Ordinary simple nonconvex interior-sum extension and actual three-triangle pentagon basis retained; not an unsigned exterior-sum extension. |

The candidate does not add a guessed historical d definition. The sealed FIRST
already derives 2d=180 degrees by comparing theorem 47 with the polygon proof's
explicit per-triangle 2d. The modern prose preserves both premises, and standards
504 and 505 state this derivation explicitly. Thus using d=90 in those solutions
is a current-prose inference, not source-glyph recovery.

The preserved black-square/bar expressions do not acquire an independently
asserted original role. Source letter codes, fine glyphs, black-bar roles, and
historical axiom names/numbers remain provenance UNKNOWN.

## Every prompt and supplied standard

P means the prompt decision; S means the supplied standard decision. Each PASS
retains the source task, with expanded cases handled by its standard rather
than by silently strengthening the prompt.

| Exercise | P | S | Substantive result and affected field |
| --- | --- | --- | --- |
| 488 | PASS | PASS | All three ordered ratios; angle triples (30,60,90), (30,70,80), (36,36,108); positivity and sum checked against FIRST. No required field change. |
| 489 | PASS | PASS | Two corresponding pairs imply equal third angles by subtraction; no whole-triangle congruence claim. Prompt uses modern term for congruence; standard's older synonym is mathematically equivalent. |
| 490 | PASS | PASS | Intersections X,Y,Z correspond to FIRST U,V,W; midpoint identities and simultaneous reversal give 25,68,87 at the specified vertices, not supplements. |
| 491 | PASS | PASS | Parallel existence, extension, additivity/straight angle, substitution, same-directed rays and vertical angles match the actual proof. No invented earlier axiom serial numbers; uniqueness is not used in this angle calculation. |
| 492 | PASS | PASS | Exterior can be smaller only than its adjacent obtuse interior; both remote interiors are smaller than the exterior. 120,30,30 witness matches FIRST. |
| 493 | PASS | PASS | All definitions and equal/greater/less conditions retained. Third case correctly says whole-triangle type is underdetermined, not necessarily acute; all three types and the added positive-angle intervals are valid. Unknown source labels remain unresolved. |
| 494 | PASS | PASS | Universal every-pair condition yields all three interiors acute; not changed to one pair. |
| 495* | PASS | PASS | A=60,B=72,C=48; altitude A/B,B/C,C/A gives 48,60,72; bisector pairs give 66,60,54. Full-line smaller angles distinguished from 114,120,126 ray angles. |
| 496 | PASS | PASS | Both vertex roles retained: apex 80 with bases 50,50; base 80 with other base 80 and apex 20. Exhaustive and constructible. |
| 497 | PASS | PASS | Unchanged literal request read under current lesson's one-exterior-per-vertex convention. Standard explicitly proves distinct-vertex impossibility and describes the same-vertex exception. |
| 498 | PASS | PASS | Acute exterior implies obtuse adjacent interior; equality to either remote interior impossible, so equality can only mean an adjacent right angle. |
| 499 | HOLD | Not supplied or reviewed | Literal prompt still has MN parallel KL and the same angle sum. Its required modern-figure incidence/orientation and answer are deferred; no 499 approval or answer slot. |
| 500 | PASS | PASS | All four sums: 1440,1800,5040,16920 degrees, same printed side counts and n>=3 context. |
| 501 | PASS | PASS | All four inverse results: 8,11,24,12; integer side-count condition and existence retained. |
| 502 | PASS | PASS | Equiangular formula gives 10,12,36,40. Standard's 60<=alpha<180 bound is consistent with integer n>=3. Regular polygons are existence witnesses, not an equal-side hypothesis. |
| 503 | PASS | PASS | Convex one-per-vertex positive exterior sum gives both impossibilities; standard explicitly excludes reflex unsigned counting and duplicate sectors. Sharp examples and four-right/no-extra-positive-angle deduction are valid. |
| 504 | PASS | PASS | Five decisions yes(53), yes(22), no(40/3), no(15/2), yes(11); exact noninteger rejection, d derivation, 990 and 1620 conversions, and existence witnesses match FIRST. |
| 505* | PASS | PASS | Both genuinely different proofs are supplied. Triangle uses a valid noncircular perpendicular-direction lemma plus five foot positions; polygon uses the same valid boundary-vertex fan criterion as FIRST. Details below. |

The answer array has only IDs 488-498 and 500-505. This report adds no missing
499 candidate. Author record's derived/ungraded/empty-parts assignment is a
reported direct human override, not an auto-grading choice newly approved by
this content/mathematics comparison.

Nonblocking terminology observation: at
`candidate-answer-keys.json#/answers/1/displayAnswer`, the standard still uses
the older Chinese congruence term where modern prompt 489 uses the modern term.
They express the same angle congruence and do not change the proof or required
answer. This is not a mathematical REVISE and no author edit was performed.

## Focused alternative-proof comparison: 505

FIRST's triangle proof used half-turn copies. The candidate is not required to
copy that method: the source task asks for a method different from section 38,
not one prescribed by the independent solver. The candidate's perpendicular-foot
decomposition meets that requirement.

The candidate establishes its right-triangle complement lemma before applying
it. A sloping line's acute angles with two perpendicular directions fill one
right-angle sector after direction-preserving transport to a common point.
That uses perpendicular directions, same-directed angle equality, and sector
additivity, not triangle sum or the later exterior theorem. It therefore does
not use an unproved "the two acute angles of a right triangle sum to 90" as a
triangle-sum corollary. Translating directions for this lemma is not the
source's whole-triangle parallel-through-C/side-extension/vertical-angle proof.

| Candidate foot case | Compared identities and conclusion | Decision |
| --- | --- | --- |
| H strictly between A,B | A+p=90, B+q=90; C=p+q; sum=180 | PASS |
| H=A | A=90, lemma gives B+C=90 | PASS |
| H=B | B=90, lemma gives A+C=90 | PASS |
| H,A,B in this order | x+p=90, B+q=90; A=180-x; C=q-p; total=270-(x+p)=180 | PASS |
| A,B,H in this order | y+p=90, A+q=90; B=180-y; C=q-p; total=270-(y+p)=180 | PASS |

These exhaust a unique perpendicular foot's positions on the base line and
do not exclude obtuse triangles. The outside-foot cases use a difference
because the nearer-vertex ray is inside the sector between the perpendicular
and farther-vertex ray; no incorrect sum is substituted there.

For the convex polygon, V1V3 through V1V(n-1) give n-3 internal diagonals and
n-2 triangles, including zero diagonals/one triangle when n=3. Their angles
partition the polygon interiors. This uses the newly established part-1 result
and does not introduce O or subtract a full turn. It is distinct from the
source polygon proof and matches FIRST's noncircular dependency boundary.

## Holds, provenance, failures, and counters

499 remains HOLD only for its actual missing modern-figure/answer stages.
The sealed source basis is already sufficient and must not be re-solved or
reopened. A later explicitly approved modern-238 preview can use the sole
remaining slot; this turn neither opens a new image nor gives a figure verdict.

Provenance UNKNOWN and the source-derived ambiguity in 493 are not erased.
The passing standard explicitly handles the ambiguity. Scope qualifications in
497/503 are explanations of the current lesson's convention, not claims that
the source printed additional words or new source-glyph identities.

The comparison's first four-file hash command guessed the record basename
AUTHOR.md. The three candidate hashes succeeded, but that fourth path was absent:
`shasum: .../seventeen-answers-author7/AUTHOR.md: No such file or directory`,
exit code 1. A narrowly scoped `rg --files ... -g '*AUTHOR*'` identified
AUTHOR-RECORD.json; its actual hash matches the supplied record hash. No failed
command was rerun, no valid candidate result was discarded, and no mathematical
HOLD or rejection was inferred from this path failure. This record preserves
the additional failure; it does not rewrite the original FIRST failure history.

Counters remain: originals 7/7, assignment images 7/8, context images 7/24,
original loads once each, modern preview 0, new/reopened/cropped images 0,
paid external calls 0. No DB, Git, deployment, installs, new workers, producers,
shared-tool calls, supervisor/peer messages, timers, or background tasks ran.
Only the disclosed candidates/support records and output-binding metadata were
read; referenced author solving/STOP files, native templates, FigureSpecs,
old answers, choices, unrelated lessons, and original source inputs were not
followed or opened.

The immutable FIRST and author candidates remain untouched. Only these two new
comparison files are written and sealed 0444. Stop after this textual handoff;
do not start the modern-238 gate or manufacture a 499 answer.
