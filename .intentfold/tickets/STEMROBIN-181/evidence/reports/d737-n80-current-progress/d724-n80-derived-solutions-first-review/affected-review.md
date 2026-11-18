# d724 Affected-Only Text Review

Ticket: STEMROBIN-181
Card: phy10-c2-s2-n80
Review date: 2026-11-18
Verdict: PASS-AFFECTED-ONLY -- original findings for tasks 4, 11 and 12 resolved.
Scope: mathematical/bilingual explanatory-construction repair only.
Whole-card approval: NOT GIVEN.
Images opened/generated/rendered: 0/0/0.

## Bound Inputs

Sole checkout: `/Users/yong/.codex/worktrees/00b1/lemmadeck`.
All paths below are relative to that checkout; every shell invocation used it
as its explicit working directory.

| Input | SHA-256 |
| --- | --- |
| `.intentfold/tickets/STEMROBIN-181/tmp/d733-n80-solutions-affected-repair/solutions.json` | `9889b3b24d8e9a1377e36b97ce440d15ffb5d61e3ea254b3654499f16fd70b88` |
| `.intentfold/tickets/STEMROBIN-181/tmp/d724-n80-derived-solutions-first-review/review.md` | `9400cdf6bfe0014867947b12f8e43837a99407218f298fd5b50bdeae72fdd663` |
| `.intentfold/tickets/STEMROBIN-181/tmp/d720-n80-text-only-derived-solutions/solutions.json` | `51f4a2bca863f9d560a6ba233e5a2edb8149babd44ad49e745f67973ea5299f1` |

The new candidate's SHA-256 was checked against the exact human-supplied hash.
The original first-review SHA-256 matches its previously returned hash.
The d720 binding is inherited from the original review; its JSON was used only
for the unchanged-record comparison, not a repeated content review.
The original report remains an unchanged historical FAIL. This is a separate
affected-only receipt, not a replacement or retroactive first-review approval.
Defining source and d703 prose bindings are reused from that original report.

## Original Findings And Repair Decisions

### Task 4 -- RESOLVED

Original finding: missing requested ray-construction instructions.
Reviewed fields: `displayAnswerZh`, `displayAnswerEn`, `reason`.

Both languages now instruct the learner to draw a converging lens, optical axis
and fixed film plane; choose an off-axis point on the person and on the farther
forest; and draw, from each point, a parallel ray refracted through the far
focus plus an undeviated optical-center ray.

The person's pair meets on the film. The forest's pair meets between the lens
and film, then spreads into a spot at the film. Moving the lens toward the film
reduces lens-to-film distance until the forest is focused; the person's pair
then meets beyond the film. This follows v = Fu/(u-F) decreasing with u > F.
Both languages retain the distinction between exact ideal-model focus and
practical depth of field. The added operations are sufficient text-only diagram
instructions and repair the specific original construction/readability gap.

### Task 11 -- RESOLVED

Original finding: coincident axial chief rays and unspecified non-axis
outgoing-ray construction.
Reviewed fields: `derivation`, `displayAnswerZh`, `displayAnswerEn`.

Both languages define F > 0 as focal-length magnitude and -F as the diverging
lens's signed focal length. With a real source at distance F,
1/f = -1/F - 1/F = -2/F, so f = -F/2: a virtual axial image at F/2 on the source
side. No numerical focal length or off-axis source is invented.

Both explicitly warn that the source's axis-parallel and optical-center rays
coincide and cannot locate an image by intersection. The calculated virtual
point is marked first. Two rays are then drawn from the SAME axial source to
small nonzero lens heights, one above and one below the axis; their outgoing
rays spread away from the axis and back-project through the calculated point.

Independent geometry check: in the unmirrored source-to-lens coordinate
direction, source (-F,0) and lens intercept (0,h) give incoming slope h/F.
The negative lens power adds h/F, giving outgoing slope 2h/F. Its backward
extension has y = h + (2h/F)x and meets the axis at x = -F/2 for either sign
of the nonzero small height. Thus the two distinct near-axis rays give the
same virtual point without pretending that coincident chief rays determine it.
The actual outgoing rays do not meet at that point.

Both languages explain slope and permit left-right mirroring while preserving
the distance and source-side location. Mirroring also reverses illumination
direction; it is not a fixed-direction virtual-object-at-far-focus premise.
The repaired explanation now covers the original on-axis and side concerns
without changing the source geometry.

### Task 12 -- RESOLVED

Original finding: English lens-side/axis-side mismatch and incomplete
actual-arrow construction.
Reviewed fields: `displayAnswerZh`, `displayAnswerEn`,
`noUnspecifiedTiltInvented`.

Both languages now put the image tail ON the optical axis, at 2F on the
opposite side of the LENS. They mark it using the 2F conjugacy rather than
claiming an intersection of coincident axial rays.

For the actual drawn off-axis tip, both specify a parallel-to-axis ray
refracted through the far focus and an undeviated optical-center ray. Their
intersection determines the image tip; joining image tail to image tip
determines the image arrow. An axial tip, if encountered, is located by its own
object distance and the thin-lens formula, not by degenerate special rays.

Both retain the condition that every object point lies outside the source-side
focal plane for the entire image to be finite, real and inverted. They do not
invent the tip's direction or infer equal size or a single 2F image plane from
the tail alone. This agrees with pointwise v = Fu/(u-F) and transverse
coordinate y_image = -Fy/(u-F); the actual tilted segment's points need not
share one object distance. The prior bilingual and construction gaps are closed.

## Unaffected Results Reused

A scoped JSON structural comparison exited 0: exercise identity/order is
unchanged, and only answer records 4, 11 and 12 differ from d720. Answer records
1, 2, 3, 5, 6, 7, 8, 9 and 10 are structurally identical.
No mathematical or bilingual content review of those records was repeated.

- Tasks 3, 5 and 6: original TEXT-CONTENT-OK results carried forward.
- Tasks 7 and 10: original TEXT-CONTENT-OK results and nonblocking readability
  notes carried forward; no rewrite required or performed.
- Task 9: original TEXT-CONTENT-OK for its explicitly qualified real off-axis
  construction carried forward, with that qualification unchanged.
- Task 2: original DATA-HOLD carried forward. Literal d = 1.25 cm,
  l = 2.4 cm and millimeter divisions remain unchanged; no imaged ruler-segment
  length or numerical focal length was supplied.
- Tasks 1 and 8: original FIGURE-DEPENDENT-PENDING carried forward; no generic
  answer or figure-dependent approval supplied.

## Limits And Preservation

No unresolved blocking finding remains in the three authorized repairs.
Only the affected semantic/explanation portion of gate 2 was reviewed here.
No full-card review, native schema/parts/grading/MathLive validation,
finalization, canonical write or publication was performed or approved.

Only this new report was authored. The first FAIL report and candidate files
were not edited; other contributors' files were preserved. No images, old
choice/answer-key consultation, meter edits, Git operations, backend/DB access,
paid calls, new agents, freshness operations, other chats or whole tests occurred.
PASS-AFFECTED-ONLY does not change the remaining holds or grant whole-card approval.
