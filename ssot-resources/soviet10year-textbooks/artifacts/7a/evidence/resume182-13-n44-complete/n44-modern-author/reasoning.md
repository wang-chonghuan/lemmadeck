# n44 Modern Author Reasoning

Date: 2026-11-19. Ticket: STEMROBIN-182. Offline author scope only.
Checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch: `codex/STEMROBIN-182-textbooks`.
Observed entry HEAD: `e16207d939526da0ebb2cfc528f084f0c3791afb`.

## Reader And Purpose

The product charter names a strong eight-year-old independent learner.
When studying quadratic equations, the learner wants to understand how the
root formula follows from completing the square, then use it without losing
the reasoning about the number of roots. The lesson answers: how can the
roots of a general quadratic equation be found?

The source has already fixed the instructional structure. Preserve all 78
source-bound prose blocks, the derivation, three discriminant cases, worked
examples, incomplete quadratics, alternative formula, and all 15 original
exercises. No content is dropped or added to fill a template. Modern wording
reduces obsolete phrasing; it does not replace the mathematical argument.

## Authoring Decisions

- Keep original formula spans, signs, numbers, variables, equation references,
  all root alternatives, quantifiers, and source references.
- Keep source ASCII sentence terminators where replacing them could change
  the existing exact outside-math number signature.
- Use modern Chinese wording and explicit sentence breaks. Normalize prose
  with the existing deterministic lesson-layout helper, then obtain all
  section boundaries from `prose_flow.mjs` output.
- Replace complete Cyrillic exercise-label sequences with natural Latin
  `a), b), ...`, retaining each label's original mathematical subpart.
  Exercise 866's column-major source is already normalized in the prepared
  template; do not reassign its formulas by source reading order.
- Keep exercise 862's lookup-table method and 0.01 accuracy request. No
  calculator substitution or numerical context changes.
- Keep the method requirements in 865, the parameter-set requests and exact
  root counts in 866-868, both universal claims in 869, all forward/inverse
  questions and proof requests in 870, and the strict bound in 872.
- Make exactly the registered replacement `$c=1.21$` -> `$c=-1.21$` in
  `lesson.prose[53]`, set its `math-correction` change, and fill only the
  erratum's `corrected` field. All source snapshots and erratum evidence stay
  unchanged.
- Keep exercise 870's unprimed `$E(7)$` and primed `$F'(0)$` as printed.
  Do not resolve a suspected intention by adding a prime.
- No figures, answers, source repair, finalization, publishing, app, database,
  environment or dependency operations are part of this author stage.

## Evidence Boundary

The raw candidate and text-only independent source review are reused.
No source pixels are loaded. Prepared-FIRST snapshots were copied before
author edits and set to 0444. Author verification compares source and prepared
snapshots, source and modern math/number signatures, per-subpart formula
bindings, root/endpoint guards, final proseFlow boundaries, and all 15 exercises.
Final candidate snapshots and this evidence will be frozen 0444; WORKING
templates remain writable. Independent modern content review and parent
finalization remain pending.

## Parent Metadata Update

After the author checks passed, the parent reported that independent Stage1
confirmed the sign correction and identified inaccurate wording in the erratum
reason: the affected paragraph is the incomplete-quadratic discussion, not
numbered example 3. The parent owns the metadata-only reason repair and page
SHA rebind. By direct instruction, this author keeps the prepared-FIRST and
current candidate bindings unchanged, does not rerun preparation or source/math
checks, and freezes the current candidate first. The parent will then rebind
only `errata.reason` and the source page SHA in scratch/WORKING files. The same
independent reviewer will inspect the full modern candidate and affected binding.
