# N38 Exercise 499 Independent Answer Comparison

Status: **pass**. Scope: the one disclosed exercise 499 answer candidate only.
This is a substantive proof comparison, not native finalization, a repeat image
gate, whole-lesson approval or publication.

Reviewer: Carver / original188-7 / content-independent7.
Date: 2026-11-23.
Sole cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Only write root:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/.intentfold/tickets/STEMROBIN-188/tmp/n38-content-independent7`.

## Bound Inputs

The two newly disclosed answer inputs were read and their actual hashes verified
earlier in this same task. This continuation uses that completed state; it does
not repeat those reads/hashes or reread source material.

- Candidate:
  `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/answer499-author7/candidate-answer-keys.json`
  SHA256 `50dcef2597b20965b092a5a5c73c450e79b20d10b281cacde36fe2099b0ea02b`.
- Author record:
  `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/answer499-author7/AUTHOR-RECORD.json`
  SHA256 `dbe6bf3910718f6d10d7bcc58002ef8c9248bbca95316d0d78d89ced0aae8e91`.
- Sealed FIRST at the owned root: `first-seal.json`
  SHA256 `9d58dee154d220942b28aef01471c0845e2a08bf0527e3894d02cd4491b52b64`;
  `SOURCE-FIRST.md`
  SHA256 `59753dd08d741bb7e7107416b17be428e04144a6d6484cfdbd711b35f7c867fd`;
  `source-review.json`
  SHA256 `f6d1523d74a10dc9dfb55880e37897fe30902328ca8c66b2324a1c912b88faa9`.
- Existing actual modern fig-238/current prompt PASS at the owned root:
  `modern238-review7.json`
  SHA256 `4682854d9e4b3c0398013677243770442eea88b2aa1a1f50620a693e8b87cf72`;
  `modern238-review7.md`
  SHA256 `e35d1dd6e0957f6d359090e359329556a329aa1f60a00b1a518c8cb01bf3a713`.
  Human-confirmed unchanged retention is reused. That review approved the
  actual figure and complete prompt, not an answer.
- Current prompt:
  `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/text-author7/candidate/exercises.template.json`,
  `/exercises/11/text`, field SHA256
  `19ddfa75866beacec52dd341404cf9c14763266c7e50d720e7e8b9aba3117bdb`.
  Previously bound file SHA256
  `ebb0a3a864771163705b9c6f441deedbab5d1e611992e63439da11c328784f60`.
  Source reference `p0177#11`, figure `fig-238`.
  The request is: given MN parallel to KL in the retained figure, prove
  `angle ABC = angle NAB + angle BCL`.

The FIRST and modern review hashes above are prior bindings, not fresh hashes.
Their files were not modified. Their retained copies were already confirmed by
the human at N38/content-independent7. Full absolute paths and binding details
are recorded in the companion JSON.

## Substantive Comparison

The retained figure basis is upper order M-A-N, lower order K-C-L, C left of A,
and B right of both A and C and strictly between the parallel frame lines.
Thus AN and CL point right; BA points up-left and BC down-left. These are
previously observed and passed diagram facts, not newly solved source facts.
The following comparison applies to this topology, not arbitrary placements.

1. **Auxiliary construction: PASS.** The candidate constructs the parallel to
   MN through B and takes new D strictly left of B. Parallelism to KL then
   follows from the given MN parallel to KL. D selects the same left auxiliary
   ray that sealed FIRST names BX. D is not B, is not the rightward ray and is
   not claimed to be an original source label or an existing figure point.
2. **Interior decomposition: PASS.** With BA up-left and BC down-left, the left
   ray BD lies strictly inside ordinary, non-reflex ABC. Hence
   `angle ABC = angle ABD + angle DBC` is valid angle addition. There is no
   reflex angle, overlapping sum or silently supplementary interpretation.
3. **Upper alternate-interior equality: PASS.** AB crosses MN and the through-B
   parallel. At A, rightward AN and down-right AB bound NAB inside their strip.
   At B, leftward BD and up-left BA bound ABD inside the same strip on the
   opposite side of AB. Therefore `angle ABD = angle NAB` is the correct
   alternate-interior equality. It agrees with FIRST's simultaneous reversal
   of the two ray directions; it is not a same-side interior sum.
4. **Lower alternate-interior equality: PASS.** BC crosses the through-B line
   and KL. At B, leftward BD and down-left BC bound DBC inside their strip.
   At C, up-right CB and rightward CL bound BCL inside the strip on the opposite
   side of BC. Therefore `angle DBC = angle BCL` is the correct alternate pair.
   FIRST's simultaneous ray-reversal justification gives the same equality.
   The vertex C in BCL is preserved.
5. **Conclusion and non-circularity: PASS.** Substituting these two independent
   parallel-angle equalities into the interior decomposition gives exactly
   `angle ABC = angle NAB + angle BCL`. The dependency order is given
   parallelism/topology, auxiliary parallel, angle addition, alternate
   interior angles, then substitution. The target identity is never a premise.
   No source d/glyph convention, numerical triangle-sum calculation or visual
   measurement is needed.
6. **Request coverage: PASS.** `/answers/0/displayAnswer` supplies the entire
   single proof request for `/answers/0/exercise = "499"`, with vertices B, A
   and C aligned correctly. No numerical subpart, construction deliverable
   beyond the auxiliary proof step, or additional printed case is omitted.
   This comparison adds no newly solved source case.

## Metadata And History

- `/answers/0/source = "derived"`: PASS. The proof is not represented as a
  transcription of a printed book answer.
- `/answers/0/grading = "ungraded"`: PASS. A proof is appropriately ungraded
  under cap2, and its complete displayAnswer is supplied.
- `/answers/0/parts = []`: PASS. There is one proof request and no automatic
  expected-value subpart to encode. Empty parts does not mean missing proof.
- `/status = "draft"` remains unchanged. This review approves the substantive
  answer content only and does not claim candidate finalization.
- Existing candidate notes saying image review was pending remain historical
  author-scope facts predating the retained actual fig-238/prompt PASS. They
  are neither edited nor presented as current native-finalization evidence.
  AUTHOR-RECORD's source-solving/native paths were not followed, and its
  image counts were not merged with this reviewer's counts.

No candidate field requires revision. No answer outside 499 was reviewed.
The fig-238 and current 499 prompt PASS is reused, not reissued on new evidence.

## Unknowns And Counters

Original alphabet/code, Unicode/fine-glyph, and previously UNKNOWN fine-mark or
blackbar-role identities remain provenance UNKNOWN. Modern A/B/C/D does not
recover an old code. Those unknowns are not new mathematical errors and do not
authorize source reopening. Original failures, observations, and label
failure/repair history remain in their existing immutable records.

Actual images remain **8/8 assignment and 8/24 context**: seven original images
once each plus one prior complete modern238 preview. This stage adds zero image
loads, reopenings, crops or renders. Paid calls remain **0**. There are no
remaining assignment image slots and no owned background job.

## Disposition

**pass** for the single bound exercise 499 candidate proof and
`derived / ungraded / parts:[]` metadata. FIRST, earlier comparison, modern238
PASS, candidate bytes, historical notes, UNKNOWNs and prior failures are
unchanged. No DB, paid model, Git, installation, production, new worker or
message operation was performed.

Deliver only this MD and `answer499-review7.json`, sealed 0444, with their
actual output hashes. Stop after handoff; no automatic continuation or
whole-lesson/publication approval.
