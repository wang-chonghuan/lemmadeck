# SAME188-6 independent technical review

Verdict: CHANGES_REQUESTED. This is a narrow code-recovery review, not source,
mathematical lesson, figure, answer, publication or whole-ticket approval.

## Findings

### [P1] Numeric data can cancel missing, duplicate or extra subpart labels

Location: `.claude/skills/ld-s10y-lesson/tools/edition.py:938-939`,
with numeric comparison at 953-979 and canonicalization at 758-769.

Both texts are canonicalized independently. Source letter labels become ordinary
numeric tokens, but the validator does not compare the two marker structures.
When a modern list is missing a label or is invalid, returning its unchanged
text is not a rejection. Its ordinary data numbers or malformed labels can
match the newly synthesized source label tokens.

Actual new counterexamples, executed together once:

- Source `12. a) Draw a circle; b) Name its center.` versus modern
  `12.\n1) Draw a circle; Name its center, step 2.`: source has two
  labels, modern has one. Both after signatures are `['12','1','2']`.
  The missing subpart and undeclared inserted data number are accepted.
- Source `12. a) Red; b) 3 blue; c) Green.` versus modern
  `12.\n1) Red;\n2) Blue;\n3) Green;\n3) Green.`: real data value 3
  disappears and a duplicate/extra label appears. Both after signatures are
  `['12','1','2','3','3']`, so the validator returns no errors.
- A modern `Figure2)` reference can supply the missing ordinary numeric token
  even though the marker regex correctly excludes it as a marker:
  `12.\n1) Trace the line; See Figure2) for its end.` is accepted against
  `12. a) Trace the line; b) Mark its end.`. Marker counts are two versus one.

All three return errors on the reconstructed before snapshot and `[]` on the
after snapshot. Strict source part counts and ordinary problem-data preservation
are therefore not maintained. Label structure/validity and problem data must
remain separate comparison domains; a passing untyped numeric sequence cannot
establish either. No code fix was made by this reviewer.

### [P2] Ordinary parenthesized identifiers are newly exempted as list labels

Location: `.claude/skills/ld-s10y-lesson/tools/edition.py:760-768`;
marker discovery at 748-754 supplies the ambiguous spans.

Source `12. Consider the points (a) and (b).` versus modern
`12. Consider the points (1) and (2).` is now accepted with only `layout`
and no numeric declaration. These are prose point identifiers, not a subpart
list. Both canonical strings become exactly the same numeric representation.
The before snapshot rejects the added numeric identifiers; the after returns
`[]`. Existing normalization already misclassified these spans, but the new
canonicalization newly removes the numeric validation barrier. Nesting depth
alone cannot distinguish a top-level parenthesized identifier from a list label.

## Actual failure and recovery

The retained first native modern invocation exited 2 on November 22, 2026,
20:13:47 UTC. The sole retained audit error is `exercises[6]`, written438:

`want=['438','208','1','8','7','2','2','4','8','5']`

`got=['438','208','1','2','3','4','5','6','7','8','9','10','1','8','7','2','2','4','8','5']`

The unchanged template contains ten Cyrillic source labels and ten numeric modern
labels, the same ordered formula statements, and a separate explanatory tail.
Its declared changes are `['layout']`, with `numeric_changes=[]`.
Static inspection explains the failure as ten structural labels entering the
modern non-formula signature, not ten approved problem-data changes.

The retained recovery invocation exited 0 on November 22, 2026, 20:17:06 UTC.
Its stdout records `[adapt-finalize] geo68-c3-s1-n32: PASS`. First/recovery
receipts record matching lesson, exercise and figure input hashes. The exercise
file itself was independently hashed and matches both receipts. Lesson/figure
bytes, sources outside this exercise's embedded source_text, and outputs were
not independently inspected; their unchanged claims remain receipt evidence.
No invocation was replayed, and technical recovery is not content approval.

Current edition.py is byte-identical to the immutable after snapshot:
`ec0202f4ed6dfac891b4f0ae5dde391e4a3da9434b1e6f035c7066943926af85`.
The before snapshot is the explicitly supplied reconstruction obtained by
inverting only the parent patch, not a clean Git baseline:
`47d611217eeb78b61d04df262045dce5f1001b8373c3c986b8e192792391cd81`.
The snapshot diff contains only extracted marker discovery, new canonical label
conversion, helper reuse in normalization, and the two validate_text assignments.
No Git operation was used.

## Risk And Existing Verification

- Formula spans are length-preserving masked during marker discovery; the new
  reversed label-span edits do not rewrite formula bytes. The independent math
  signature comparison and bound-errata handling remain unchanged. No new formula
  bypass was demonstrated or asserted.
- `marker_order` rejects duplicates, gaps, mixed alphabets and incomplete sets
  within a recognized sequence. `canonical_subpart_labels` returns the original
  text in those cases rather than recording an error. Finding P1 demonstrates
  why that does not enforce strict cross-text structure or data preservation.
  Gaps were inspected but not separately executed.
- Truly nested parenthetical markers are excluded by the existing depth check.
  Ordinary outer `(a)`/`(b)` references are ambiguous and fail as in P2.
  `Figure2)` is excluded as a marker, but its data number can still cancel a
  missing label as in P1. The nearby explicit figure guard only names Chinese
  figure prose. No spaced-English-figure counterexample was separately run.
- The existing two-column and independent-suffix normalization logic is unchanged
  by this patch. This review did not replay its existing tests.
- Read `test_subpart_label_signature.py` as verification only, not as a design
  specification. Its six tests check valid relabeling, isolated data/formula
  changes, several malformed lists, one non-list marker example, and a declared
  context-number change. They do not cover data/label token cancellation or
  complete-looking parenthesized prose identifiers.
- The user's supplied results are six focused tests passing, eighteen existing
  suffix tests passing, and broader test_edition: 34 pass plus one FAIL. Separate
  execution receipts for those three runs were not provided by the recovery
  binding; no independent rerun or blanket green-suite claim is made.
- Read the retained before-code single-test execution receipt and stderr.
  It exited 1 and reproduces the exact broader failing test:
  `test_prose_is_line_broken_at_sentences_and_introduced_formulas`,
  `test_edition.py:333`, a blank-paragraph-placement disagreement in
  `normalize_prose_layout`. That function is outside and unchanged by the
  snapshot patch. The existing failure remains disclosed, not repaired,
  weakened or attributed to this patch.

## Evidence And Scope

`manifest.json` binds the reviewed current/before/after code, production-resume
contract, exact first failure/audit/recovery records, unchanged exercise input,
existing verification artifacts, this report, and the new command receipt.

The one new command uses AST-selected pure validation definitions from the two
snapshots, not whole-module imports or a producer/native/renderer replay. It
compares four new counterexamples, preserving before/after errors, canonical
strings, numeric signatures and marker labels. The child exits 1 because all
four required rejections are absent after the patch. Stdout is retained verbatim;
stderr is the actual empty stream, stored inline in the receipt.

Writes: only this independently owned review root, created/updated via
apply_patch. Source/candidates/tests/Charter/dependencies/Git were not edited.
No answers, unrelated worker-root contents, external docs/network, .env, DB,
paid calls, installs, app operations, source/figure/image loads or fixes.
Filename-only inventories were used to locate authorized contract/results;
other discovered worker files were not opened.

Image loads: reviewer 0/8; no additional parent loads (parent permanent24/24
remains exhausted). Producer/native/renderer replays: 0. Existing passed-test
reruns: 0. New targeted regression invocations: 1.

finish=review; wholeLessonApproved=false; published=false;
activeExecSessions=[].
