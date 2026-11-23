# STEMROBIN-188 N37 - bounded text and seven-standard comparison

Date: 2026-11-23.
Status: PASS_SCOPED_TEXT_AND_SEVEN_STANDARDS_WITH_EXPLICIT_UNKNOWNS.
This is comparison against the existing FIRST, not new source solving,
replacement FIRST, source/crop rereview, modern-figure approval, or whole-lesson
approval. The four disclosed candidate files were read without modification.

## Exact bindings and reused FIRST

Every command cwd:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188` (W).

Owned comparison output root:
`W/.intentfold/tickets/STEMROBIN-188/tmp/n37-content-independent7`.

Let E denote the exact candidate evidence root:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n37`.

Actual disclosed inputs, all observed mode 0444:

- `E/text-author7/candidate/lesson.template.json`
  SHA-256 `c5837502d8984364b97b4b77272519144d1dddf15f36c887572047e7ed098a83`
- `E/text-author7/candidate/exercises.template.json`
  SHA-256 `afb2e2ffebcd00204877c5bc65858a18be901d94baa0ddd1a76585b89d2c2cd2`
- `E/text-author7/candidate/figures.template.json`
  SHA-256 `ab74fae0bb4843d4b8acfa41b176c44e900fcc2c0aab0627276537f54fc98d0f`
- `E/seven-answers-author7/candidate-answer-keys.json`
  SHA-256 `7c1a8d69280974e65c62020bb097b8c2ca0c79b6d713763b0305efff7f4dfcdd`

Unchanged original FIRST, both still 0444:

- `W/.intentfold/tickets/STEMROBIN-188/tmp/n37-content-independent7/SOURCE-FIRST.md`
  SHA-256 `b31993fa620fb84a02f4d68df86e23af16c67ce95537724760014fdfed4e4914`
- `W/.intentfold/tickets/STEMROBIN-188/tmp/n37-content-independent7/source-review.json`
  SHA-256 `b3233e5dcb08d590a0289bf51192faac4e4a6c64097ee82bbd6ccd166dd4be0f`

The retained `E/content-independent7/SOURCE-FIRST.md` was checked by digest
only and matches that original MD hash. No extra FIRST copy was created.
The sealed source-review.json and already frozen solutions were reused.
The author's separate SOURCE-SOLVING.md mentioned in answer notes was not read.

The candidates' embedded complete raw source snapshots serialize to the
exact original bound digests:

- lesson: `d6f9fa5d20e0af46340c1aa39631db1d2281c8ca3e1ca1654564aef4c7fb8f6d`
- exercises: `e168b2951fdd627bd5eb3808e6aa8a50a694d9534a5b09fe76b294a2bd911bd1`

Their source.path/source.sha256 fields also agree with FIRST. Per-entry
source_text and source references agree with those embedded snapshots.
This is candidate-to-FIRST binding evidence, not renewed source approval.
No raw source file or source page was reopened.

The figure manifest's source PNG paths/hashes match FIRST:

- fig-229: `d12430595d34eddd92ad4f9aa3d8036549397e98460929fe4ccd3fb02002fa3c`
- fig-230: `c15026fd061594260867f8ce83a2fc33a0ba8de472ebda87b34e57569870d27f`
- fig-231: `e8e8b389d51b21ddab9d8b53b3f560a05b69931e406ef8deead5b5789da04dba`

No image, spec, rendered output, or modern-figure review was opened. Manifest
binding consistency does not approve any modern figure or its geometry.

## Four actual mathematical prose entries

1. **Translation and equality of convex angles - PASS.**
   The candidate preserves arbitrary O and O1, the corresponding same-direction
   rays, the translation sending O to O1, and the displayed equality
   `\widehat{AOB}=\widehat{A_1O_1B_1}`. It maps rays, without asserting that
   the chosen labeled A/B points map to A1/B1. Changing the word for image
   to its modern Chinese spelling and splitting sentences changes no mathematics.
2. **Vertex-independent direction-angle definition - PASS.**
   The magnitude remains independent of O, is defined through the convex
   angle, and assigns a direction paired with itself 0 degrees.
3. **Same-direction corresponding sides - PASS.**
   Both the convex qualification and corresponding-side direction condition
   remain. The modern congruence term has the same meaning as the original;
   it is not merely a parallel-line claim.
4. **Magnitude versus region and common initial point - PASS.**
   The distinction between angle magnitude and the two regions remains,
   along with selection of the convex angle and the common-origin condition.
   There is no reflex, signed-turn, or endpoint-joining reinterpretation.

The two non-text entries also remain: one fig-229 prose entry and its caption.
The actual total is six prose entries, four mathematical texts.
Both section-break objects mark the intended proof/definition and
theorem/clarification transitions textually. Rendered placement or layout
has not been verified and is not approved by this comparison.

## All nine prompt bodies, subparts, and figure bindings

All nine retain their number/source_number, group/group_id, page references,
source_text, and figure_refs/display bindings. Their lines arrays exactly
represent their modern text. No task is missing or newly added.

- **479 - PASS prompt/binding only.** Preserves the two parallel lines cut
  by a third and asks for angles with both corresponding sides in the same
  directions, not merely all equal angles. Only fig-230 is referenced/displayed.
  Its candidate answer is intentionally absent and is not compared.
- **480 - PASS.** Both original location cases remain literally about M on,
  or not on, one side; case 2 is not changed to "on neither side." Both
  same-direction and opposite-direction construction variants remain.
  All four construction combinations in FIRST remain applicable. No figure.
- **481 - PASS.** Strict betweenness and both ordered ray pairs remain:
  `[AB)`/`[BC)`, then `[AB)`/`[CB)`. No figure.
- **482 - PASS.** Preserves construction of rays AB/CD and an angle at the
  given M equal to their direction separation. No nonparallel condition added.
  No figure.
- **483 - PASS.** Retains two convex angles with opposite corresponding
  side directions and the congruence conclusion. No figure.
- **484 - PASS.** Retains one same-direction pair, the other opposite, two
  convex angles, and the 180-degree sum. No figure.
- **485 - PASS.** Preserves all three pairs and order: south/west,
  south/north, east/southeast. No figure.
- **486 - PASS prompt/binding only.** Part 1 keeps fig-231,
  `(AC) parallel (FE)`, and the alpha-angle request. Part 2 keeps, in order,
  BC/DE, BC/DF, BA/DR, BR/DE. Modern a/b/c/d labels are edition indexing;
  they do not resolve the source glyph/alphabet UNKNOWN. Only fig-231 is
  referenced/displayed. The candidate answer is intentionally absent and
  is not compared.
- **487 - PASS.** Retains the literal source-star occurrence in source_text
  and embedded source data and keeps the modern displayed star in
  `$487^{*}$`. That formatting assigns no semantic role to the mark.
  The statement remains about two acute angles, or two obtuse angles,
  with perpendicular sides, not an acute/obtuse mixture or arbitrary angles.
  Congruence terminology is modernized without changing the conclusion.
  No figure.

Coverage is nine prompt bodies and 17 printed terminal requests, or 19 when
480's two direction variants are expanded. The sole prose figure is fig-229;
the sole exercise figures are fig-230 at 479 and fig-231 at 486.
Figure manifest IDs and source PNG bindings match that division exactly.

## Seven actual standards against sealed solutions

The answer array contains exactly 480,481,482,483,484,485,487, in that order.
All seven have source=derived, grading=ungraded, parts=[], figureEvidence=[],
and explicit author-only/read-only notes. The file is 0444.
No inputs, keyboard, interaction, or grading work was added or approved.

- **480 - PASS.** Covers both location cases and both direction choices,
  reuses coincident supports, handles M=O, and selects actual half-rays.
  It explicitly avoids the MA trap beyond A and the undefined MA when M=A.
  Translation and simultaneous reversal agree with FIRST; the 0/180
  direction boundaries do not narrow the original wording.
- **481 - PASS.** The two results are 0 then 180 degrees with strict
  A-B-C order and correct orientation of `[CB)`. Different origins are
  handled using the definition rather than a spurious triangle.
- **482 - PASS.** Gives the concrete support-line/half-ray construction
  at M, permits coincident supports, chooses the convex sector, and handles
  0/180 boundaries. A!=B and C!=D simply make the named rays well-defined,
  not new nonparallel or placement hypotheses.
- **483 - PASS.** Translation followed by a half-turn identifies both
  opposite corresponding sides. The distance calculation justifies the
  congruence transformation. It distinguishes one reversal from two.
- **484 - PASS.** The common side divides a straight angle in the relevant
  half-plane. Alpha+beta=180 and beta=180-alpha match FIRST; zero/straight
  boundaries and the right-angle case are correctly distinguished.
- **485 - PASS.** Results 90,180,45 degrees match all three frozen subparts,
  with adjacent cardinal directions, opposite south/north, and the southeast
  bisector. The standard excludes reflex turns.
- **487 - PASS.** Covers all four same/opposite choices after a common
  quarter-turn. Both-same and both-opposite yield alpha; the two mixed
  choices yield 180-alpha. The explicit both-acute/both-obtuse argument
  excludes the mixed choices, and the 30/150 counterexample matches FIRST.
  The right/right extension is not substituted for the original condition.

These seven standards cover 11 printed terminal requests, or 13 after
expanding 480's variants. No missing figure-free standard or mathematical
mismatch was found.

## Findings and unresolved boundaries

No blocking content/mathematics defect was found in the disclosed text or
seven standards. This PASS applies only to those actual file digests.

Nonblocking integration boundary: every standard's prompt exactly matches
its bound raw source_text, rather than the modern candidate's text bytes.
The mathematical wording is equivalent to the disclosed modern prompt
(including the harmless congruence-term modernization). This review binds
the actual candidate files and confirms that equivalence; it does not
claim the answer prompts have already been finalized against the modern
edition, or perform that later binding/finalization.

480's position-wording ambiguity is preserved and remains nonessential
because the construction works for arbitrary M. No source wording is repaired.

All FIRST UNKNOWNs remain UNKNOWN: exact glyph/codepoint/alphabet identities;
C-adjacent speck roles; and the semantic role of the 487 star. Candidate
indexing, star formatting, or author notes do not resolve them. No unprinted
source point, numerical alpha, extra condition, or mark role was inferred.

479 and 486 standards are intentionally absent: their candidate comparison
is DEFERRED until the caller supplies approved modern fig-230/fig-231 and
the corresponding candidate answers. Their FIRST solutions remain unchanged
and will be reused. No new source solving or source-image reopening is needed
merely to begin that later comparison.

## Counters and seal

New source solves: 0. New original/modern image loads: 0. Source-page opens:
0. Raw source-file reopens: 0. Four newly disclosed candidate documents
compared; seven newly disclosed standards compared. No old keys, choices,
standards, configs, author solution seal, or undisclosed paths were inspected.

Inherited FIRST image counters remain 3/8 in its single batch and 3/24 in
this bounded context, with zero reopens. Candidate exposure before FIRST
remains zero; disclosure/comparison occurred only after FIRST was sealed.

No app/shared code, native preparation/finalization/rendering, environment,
DB, Git/worktree, install, browser, chat/peer, or paid model action occurred.
Only COMPARISON.md and review.json are written and sealed 0444. FIRST,
retained evidence, and all candidates remain untouched.

Modern figures: NOT REVIEWED / NOT APPROVED.
Diagram-answer candidates 479/486: DEFERRED.
Whole lesson: NOT APPROVED.
Affected review remains available using this comparison and the original FIRST.
