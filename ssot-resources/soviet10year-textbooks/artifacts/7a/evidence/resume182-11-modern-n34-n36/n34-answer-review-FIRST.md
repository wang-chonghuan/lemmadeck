# N34 Independent Cap2 Answer Gate

**PASS: 8 pass, 0 revise, 0 blocked.** No affected-only repairs requested.

Sole cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Scope: STEMROBIN-182, 7a / modern-us-neutral / alg7-c4-s1-n34,
exercises 746-753. This is offline content review, not finalization or publication.

## Independence And Binding

Independent source solutions were frozen at 2026-11-18T23:47:35Z before reading
the candidate or prepare template. Parent n34-answer-candidates and choice-author
reasoning were never read. The required answer gate, production-resume contract
and shared image-batch rules were read.

- Candidate answer-keys.json SHA256:
  `17484dac16decdd66c389493a83015847d09f1a06aabbfc18d71830f8dc6b7a9`.
- Prepare template SHA256:
  `badd887704819993e58a0061803937279feca0b624ad0098a456a99e7d623d40`.
- Immutable independent-source-solutions.md SHA256:
  `6a9750f2c97fe84fce9fc5462bdf20d4d1ec5db1ab47793f285764595e32816c`.

The companion JSON contains each exercise's candidate-object, display-answer,
template-object, modern-exercise and original-exercise hashes. Object hashes use
UTF-8 JSON.stringify with parsed key order retained; file hashes use raw bytes.

Exactly four images were opened, once each, after writing pre-open hashes:
source fig52, source fig53, current complete fig52 preview, current complete fig53
preview. No crops, reopens or renders. Durable specs were read, and scratch specs,
SVGs and viewed previews are byte-bound to their durable counterparts.
The receipt ledger preserves actual pixel observations, not merely spec claims.

## Per-Exercise Verdicts

| Exercise | Verdict | Substantive Check |
| --- | --- | --- |
| 746 | pass | Both actual fig52 views fall for negative x and rise for positive x. a) f(-2.1)<f(-3.6); b) f(1.3)<f(2.8); c) f(x1)>f(x2) for x1<x2<0; d) f(x1)<f(x2) for 0<x1<x2. All four comparisons and both branch intervals are present. No formula or precise height is invented. |
| 747 | pass | Both actual fig53 views rise 0-6 s, stay at 5 m/s from 6-14 s, then fall 14-16 s; start/stop speed is zero. The answer supplies every phase and both transition speeds. Its separated open-phase notation explicitly permits endpoint inclusion in continuous monotonic segments. |
| 748 | pass | a) (0,-2),(1,15), intercept (2/17,0), slope +17; b) (0,1),(1,-1.8), intercept (5/14,0), slope -2.8. Every quantity is correct. Plotting, scale and extended straight-line construction cover both graphs and trends. |
| 749 | pass | Slopes 8,0.01 increase; -3,-49,-1/12 decrease; 0x+5 stays at 5, neither strictly increasing nor decreasing. All six functions covered, with the correct difference k(x2-x1). |
| 750 | pass | x^2 uses correct five points and upward vertex (0,0); x-axis reflection constructs -x^2. Negative/positive trends reverse correctly, origin remains in the domains, no global strict monotonicity is claimed. Smooth-curve method is supplied. |
| 751 | pass | Modern y=-6/x agrees with registered p0219-math-1; original x=-6/x stays unchanged. Every plotted point is correct. -6/x occupies II/IV and increases on each branch; 4/x occupies I/III and decreases on each branch. Axes are asymptotes, x=0 excluded, global disconnected-domain monotonicity explicitly rejected. |
| 752 | pass | Joining (-5,3),(-2,0),(4,6),(7,3) gives slopes -1,+1,-1 and the full closed domain [-5,7], including defined -2 and 4. It satisfies [-5,-2),(-2,4),(4,7]. Heights/continuity are only this valid example, not requirements; extrema at transition points are not demanded. |
| 753 | pass | Principal roots yield a) 1.2-1.5=-0.3=-3/10; b) 6+0.6=6.6=33/5. Both subparts and all coefficients are correct; no units. Intentional ungraded/empty-parts policy remains untouched. |

## Qualifications

Conventional open monotonic branches for 746/750 are valid. This review does not
require every answer to include the turning point in a maximal closed branch.
Likewise, intervals excluding transition instants in 747 are not a defect when
all ranges and transition speeds are explicitly covered.

For 751, same-sign ordered arguments give difference
-a(x2-x1)/(x1*x2), proving each branch's trend. Across -1 and 1,
-6/x changes from 6 to -6 and 4/x from -4 to 4, refuting the respective
global trends. Source retention and modern correction are separately bound.

For 752, the example is equivalently -x-2 on [-5,-2], x+2 on (-2,4],
10-x on (4,7]; all domain points occur once and adjacent values agree.
The source does not force those heights, continuity or extrema at -2/4.
The candidate does not impose those extra requirements.

All eight template prompts match the modern exercises. No original 7a
answers.json exists; both template and candidate omit bookRaw and use derived.
Thus no bookRaw string was lost, normalized or manufactured.

All eight grading fields are intentionally ungraded with parts=[] and are
read-only under the assignment, including 749 and 753. The independent solution
notes that 753 could be numeric-graded mathematically, but this is not a requested
grading change or a gate defect under the explicit locked contract.

## Verification And Handoff

The receipt's read-only check-inputs.mjs exited 0. It checks all eight identities,
per-exercise bindings, template prompts, source tags, unchanged empty parts,
bookRaw presence, input stability, source/preview/durable-asset binding, registered
751 correction and calculated points/intercepts/slopes/values. Actual graph
reading and mathematical proofs remain independent textual review evidence.

No production edits, finalize, publish, cap3, app/MathLive, DB, .env, network or
Git operations occurred. Writes are only these two review files and their
receipts, via apply_patch. Other workers' files were not reverted.

Findings are empty. Parent may reuse unchanged per-exercise verdicts; if a future
candidate, prompt or shared figure changes, review only affected exercises and
preserve this FIRST evidence. Do not reopen all four images merely to consume
this handoff. Draft status was not changed; this is not whole-ticket approval.
