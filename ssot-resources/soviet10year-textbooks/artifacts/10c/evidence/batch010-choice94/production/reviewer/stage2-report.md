# STEMROBIN-184 Stage2 Visible-Only Review

## Scope And State

Date: 2026-11-17. Lesson: ana10-c6-s4-n94. Role: independent choice reviewer.
Stage2 visible-only review is recorded after the two explicitly disclosed image opens.
Stage3 internal disclosure is NOT authorized. WAIT for an explicit instruction.

Only the following new inputs were read:

- `.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c94/author/views.json`.
- The two exact authorized screenshot paths recorded below, each opened once.
- `.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c6-s4-n94/choices-report.json`, for disclosed render geometry and provenance.
- The parent's binding statements reproduced as qualifications below.

No author draft, intent, key, coverage, solution, handoff, other lesson, book
answer, or other mathematical input was opened. No current seed or n97 was opened.
No browser, rerender, screenshot reopen, crop, test, finalizer, DB, environment,
publish, app, dependency, schema, Charter, Git, workflow, or other-chat action occurred.
Only new files in the owned reviewer directory were written.

This is not an `s10y-choice-review-v1` final review. The author's internal solution,
key, distractor derivations, limitations and coverage are undisclosed.
Author agreement and the final semantic gate remain pending; no candidate is approved.

## Immutable Stage1 Binding

The parent reported that Stage1 was fully consumed, and the following raw hashes
were re-read without editing either frozen file:

- `source-first.md`: `d2169648242988142876448d792b68070959985e00bf0c7237eeb807751eb01b`.
- `ledger.md`: `04ca2c1d639543a4ab08b1e383ef73f41a1a4ee4bed7ffde12e5705a2acadc0e`.
- Original Stage1 raw seed: `52df395359f23509b7c706ca07a0151db9a7fe3cb3360584e109b945d8c8966c`.
- Original Stage1 canonical seed: `598d5321a199d9f7e0cc424b1a5394b595976399d0c6f7431d476263bd9654d0`.

Additive source qualification, from parent binding evidence only:
`seed.trace[book.json]` changed because the book index now includes complete n97.
The parent reports that ALL selected seed mathematics, concepts, figures, and the
other three traces are unchanged. The reported current-seed hash prefix is
`c684fe38...`; its full digest and whether that prefix labels raw or canonical
bytes were not disclosed here. This is not an independently verified new seed
digest. The old hashes remain the exact Stage1 snapshot binding. No new n97
content was read or solved. The visible equations were compared with the frozen
n94 mathematics, not with an expanded book index.

Additive image-limit correction:
Stage1's wording that made 24 a batch limit and 8 a permanent limit was incorrect.
The operative limits are **8 images per batch and 24 per context**, with no reset.
Incoming usage was 0; this Stage2 opened exactly 2 images, once each.
Usage is now 2/8 for this batch and 2/24 for this context.
This correction does not mutate the frozen Stage1 bytes.

## Visible Snapshot

Author-disclosed file:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c94/author/views.json`

- Raw bytes: 11881.
- Raw SHA-256: `700be2efce7d87ed456a30d4f44b6919140795ecc871112d3fe363dc6fa4f332`, matching the parent's disclosure.
- Canonical SHA-256: `849b80462b3bea25e7858351f840efdc430c5434e43cfcb8db020d0404cc2192`.
- Canonicalization: `json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode("utf-8")`.
- Exactly 15 `{id, view}` entries, q01 through q15, with 57 options.
- Every mode is `single`; all question and option figure lists are empty.

Individual canonical question hashes and all option checks are in `stage2-ledger.md`.
No hidden author fields were required to determine the visible propositions.

## Review Order

Phase A judged task fidelity, redundancy and answer leakage from the frozen
source and visible text, before any author-key comparison. Phase B independently
solved every visible equation, determined each complete real solution set, and
checked all 57 displayed options. Phase C inspected the two authorized images
after their raw hashes and PNG dimensions were checked.
No author key was disclosed in any phase.

## Phase A: Fidelity

Common preserved conditions: every stem asks for the **complete real solution
set**, states radians and k in Z, and introduces no finite interval. The original
equation is retained in each case. The `arctan` principal interval is explicitly
given where it is used; q11 explicitly gives the `arcsin` principal interval.
These inverse-function conventions do not restrict x to those intervals.

| Visible question | Independently inferred source | Concrete fidelity evidence |
| --- | --- | --- |
| q01 | 310 | Retains 1 + cos(x) + cos(2x) = 0 and asks for all branches, not one cosine root. |
| q02 | 311 | Retains 3 - cos(x)^2 - 3*sin(x) = 0; no range or domain is substituted for all real x. |
| q03 | 312 | Retains 4*sin(x) = 4 - cos(x)^2 and full-set quantification. |
| q04 | 313 | `tg/ctg` become tan/cot; the mixed number is correctly rendered as 5/2. Both original singularity exclusions remain implicit in the same equation. |
| q05 | 314 | Retains the unsquared half-angle equation cos(x/2) = 1 + cos(x), including its signed cosine condition. |
| q06 | 315 | Retains the complementary tangent argument pi/2 - x and minus sign; both original tangent domains still apply. |
| q07 | 316 | Retains coefficients 5 and 12 and the positive right side 13, not an absolute-value or squared version. |
| q08 | 317 | Retains sin(x) - sin(2x) = 0, so the zero-sine factor must still be accounted for. |
| q09 | 318 | Retains 1 - cos(x) = 2*sin(x/2), not a square or absolute-value replacement. |
| q10 | 319 | Retains 1 + cos(x) = 2*cos(x/2), distinguishing it from q05 and q09. |
| q11 | 320 | The mixed number is correctly rendered as 7/3; the equation remains cos(2x) = (7/3)*sin(x). |
| q12 | 321 | Retains sqrt(3)*sin(x) - cos(x) = 0 with the same coefficient and sign. |
| q13 | 322 | Retains cos(x) + sin(x) = 0, not a difference equation. |
| q14 | 323 | Retains cos(x)^2 - 3*sin(x)*cos(x) = -1, including the negative constant. |
| q15 | 324 | Retains 3*cos(x)^2 = 4*sin(x)*cos(x) - sin(x)^2, including the last minus sign. |

Local task-fidelity assessment: no changed mathematical data, quantifier, domain,
unit, or essential solution branch in the stems. Recognizing a complete family
from alternatives cannot demonstrate independently written derivation; that is
a response-format capacity limitation, not by itself a fidelity failure.
No claim is made yet about whether the author's undisclosed limitations record
acknowledges it. Source numbers are used only in this internal review, not in the
displayed stems.

## Phase A: Redundancy And Leakage

### V1: q02/q03 Duplicate Whole-Set Alternatives

Visible redundancy assessment: **revise** for the q02/q03 pair.
Cross-question answer-transfer assessment: **revise** for the same pair.

The three alternatives are exactly the same mathematical propositions, reordered:

- q02.a = q03.c: x = pi/2 + 2*k*pi.
- q02.b = q03.b: x = pi/2 + k*pi.
- q02.c = q03.a: x = -pi/2 + 2*k*pi.

The source-first record establishes independently that both original equations
have sin(x) = 1 as their only admissible sine root. Their written reductions are
different: q02 also produces the inadmissible root 2, while q03 produces 3.
Neither visible option set assesses that distinction.

Consequently the second question repeats exactly the first question's complete-set
judgment. A learner who has determined q02's answer can select the identical
proposition in q03 without independently reducing q03 or rejecting its different
out-of-range root. Changing the letter from a to c does not remove that route.
There is no rendered correctness highlight or disclosed key; this finding is
about duplication of the mathematical response and its transfer route, not about
a hidden answer marker or proof that every learner will exploit it.

Repair direction, not an author edit or approval: make the two responses assess a
nonduplicated mathematical distinction, or use a mathematically justified combined
response that actually requires handling both equations and their admissible roots.
Retain the complete-solution requirement and both sources' relevant work.
The current pair should not be justified merely by reordered labels.

### Other Visible Relationships

No within-question alternatives were found equivalent as complete solution sets.
Every question has exactly one true full-set alternative in Phase B.
Common instructions provide units and inverse-function definitions, not intermediate
solutions. No source numbers, correctness labels, worked reductions, key language,
or answer feedback are present in the visible JSON.

Concrete nonduplicate relationships:

- q01/q08 use different cosine branches (-1/2 versus +1/2), with different zero factors; substituting one full answer into the other fails.
- q04/q14 share arctan(2) + k*pi, but q04's other root is 1/2 and q14's other root is 1. Neither complete answer supplies the other.
- q05/q10 share odd multiples of pi, but q05 also has cos(x/2) = 1/2 and q10 also has cos(x/2) = 1. Their complete-set choices differ.
- q09/q10 share some multiples of pi, but q09 excludes 3*pi and q10 excludes 2*pi. The signed half-angle judgments remain distinct.
- q14/q15 share pi/4 + k*pi, but their second branches are arctan(2) and arctan(3). Both must be distinguished, not copied.
- q12/q13 each have three or four alternatives with different principal angles or periods; their complete solution sets are different.

Local redundancy/leakage assessment for the other questions: no definite
whole-answer duplication or visible answer disclosure was found.
Ordinary recognition or elimination among complete-family alternatives is not
automatically treated as a defect.

## Phase B: Independent Mathematics

The following are this reviewer's independently derived complete true option sets,
NOT an author key. Every displayed option, including false-but-incomplete families,
is checked concretely in `stage2-ledger.md`.

| Question | Complete true option set |
| --- | --- |
| q01 | {c} |
| q02 | {a} |
| q03 | {c} |
| q04 | {b} |
| q05 | {d} |
| q06 | {c} |
| q07 | {a} |
| q08 | {a} |
| q09 | {b} |
| q10 | {c} |
| q11 | {d} |
| q12 | {b} |
| q13 | {a} |
| q14 | {c} |
| q15 | {a} |

All 15 visible equations were independently solved, including the two duplicate
full-set response units. All 57 option truths were determined. No visible
mathematical ambiguity, missing true answer, or multiple true answer in a `single`
question was found. No author solution, key, misconception derivation, or claimed
coverage was consulted. Their agreement remains a Stage3 question.

## Phase C: Hash-Bound Image Observations

Both PNG dimensions were verified with metadata before image opening; both raw
hashes matched the disclosed values. `view_image(detail="original")` was called
exactly once for each path. There was no screenshot search, reopen, crop or rerender.

### Desktop

Path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c6-s4-n94/choices-1440.png`

SHA-256: `669b82c062da04f5aa2fcf5d3e3d007d246db6a5692efe31bb0009b4296f33d3`.
Verified PNG dimensions: 1440 x 4873.

Observed: a centered, unframed column displays the title, question headings 1
through 15, mathematical stems and all option rows. The final q15.d row and
page bottom are included. The rightmost terms are inside the content column;
no visible formula is covered by a preceding or following row. q06's signed
radical alternatives and q15's final negative arctangent alternative are visible.
q01 strands a terminal punctuation mark on its own line; q07 also wraps
punctuation separately. This is layout polish, not lost mathematical text.

Disclosed report geometry: document width 1440; 57 option boxes;
left/right edges 377.59375/1062.40625; heights 50.59375 to 50.9375.

### Mobile

Path:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/offline/ana10-c6-s4-n94/choices-390.png`

SHA-256: `6f9eb4ebe354a21a0cd7d78957c9c128199bad047c14bc6e164a618ea018cade`.
Verified PNG dimensions: 390 x 5699.

Observed: the title and all 15 question blocks are present, with all option
rows through the bottommost q15.d included. Long unions wrap at the second
family without visibly covering neighboring rows. q04's second arctangent family,
q06's radical branches, q11's supplementary-angle family, and q15.d's negative
second family remain inside the page. q14's k in Z instruction wraps across
lines, with Z still visible. q05.a/q05.d, q14.c and q15.a strand punctuation
on a separate line. No missing term, clipped right-hand family, or overlapping
option was observed in these original-detail outputs.

Disclosed report geometry: document width 390; 57 option boxes;
left/right edges 16/374; heights 50.59375 to 81.875.

### Geometry Evidence And Inspection Limits

Render report SHA-256:
`354f59574397fa19500826288ebeb4c0af057e3938963dd9e8f74995d74f75e5`.
The report labels itself `pass`, lists q01-q15 and both screenshot hashes,
and supplies HTML SHA-256
`f499ba094ba8c72c3ec3169266f64b8bae3a1f7808c0c24fec1eb7f36ae6351e`.
Both geometries have `labels: []`, `scroll: []`, and document width equal to
the reported width. The parent separately reports zero KaTeX errors and zero
horizontal overflow. Those are disclosed run evidence, not tests rerun by this reviewer.
No HTML or author internals were opened to infer renderer behavior.

The tool returned complete tall images after `detail="original"` requests.
It did not supply downstream display-rescaling metadata or a measured
one-to-one display scale; this reviewer does not certify a fit-to-view factor
or a native-pixel comparison of every glyph. The observations above are of the
returned full-page images, with authoritative full-text mathematics supplied by
the hash-bound visible JSON. No genuinely unreadable mathematical detail was
identified that requires requesting a targeted crop. No further images are opened
or proposed here.

The render report's own limitation remains: view-only offline layout; no
headed/OS behavior, judging, persistence or product integration evidence.
Passing render geometry does not resolve V1 or establish a semantic gate pass.

## Stage2 Conclusion

Visible mathematics: fully determined, 15 unique true option sets, 57 concrete checks.
Local stem fidelity: the original real, radian, unrestricted-interval tasks are retained.
Visible package finding: revise the q02/q03 duplicate response and answer-transfer route.
Image observations: both disclosed snapshots inspected once; no cropped or overlapping
mathematical content observed; stray punctuation wraps and fine-pixel limits recorded.

Final aggregate semantic outcome, author-key agreement, author distractor
derivations, limitations and declared coverage remain pending.
No candidate approval or gate pass is issued.
WAIT for explicit Stage3 internal disclosure; do not autonomously open author material.
