# SAME188-6 independent revision3 code review

## Findings: CHANGES_REQUESTED

One introduced P2 defect remains in the numeric-relabeling exemption. This
finding is not a preexisting same-style normalizer defect, not an inference
from the broader suite, and not a failure of the separately frozen CHOICE
semantic review.

### [P2] Colon-prefixed inline point identifiers enter the task-label exemption

Current `edition.py:758-769`, especially 760-768; used by
`canonical_subpart_labels:772-783` and `validate_text:952-972`.
The current file is byte-identical to immutable revision3 SHA
`40070e3b6ea6b99e1acae956cf0ce3458fe76d0d272e1bc7176e2cbc6a5052f4`.

Actual new pure-validation counterexample, executed once:

```text
source: 12. Points: (a) and (b) are distinct.
modern: 12. Points: (1) and (2) are distinct.
changes: ["layout"]
numeric_changes: []
```

These are two ordinary inline point identifiers in a declarative sentence,
not individual mathematical tasks or list subparts. Existing discovery finds
`a,b` / `1,2` on both snapshots, but only revision3 grants structural status:

| Observation | revision2 | revision3 |
| --- | --- | --- |
| Structural source labels | [] | [a,b] |
| Structural modern labels | [] | [1,2] |
| Raw source numbers | [12] | [12] |
| Raw modern numbers | [12,1,2] | [12,1,2] |
| Canonical modern | unchanged numeric identifiers | `12. Points: (a) and (b) are distinct.` |
| Validation result | undeclared numeric-change error | `errors=[]` |

The first marker passes the new prefix check because `Points:` ends in a
colon. Its body slice is `and`, and the last slice is `are distinct.`; both
are nonempty under the punctuation strip. These non-task prose fragments
therefore satisfy the newly relaxed structural qualifier. `marker_order`
accepts the two complete sequences. Canonicalization then replaces numeric
point identifiers by Latin letters and removes the new 1/2 tokens from the
DATA-only check. The separate count/complete-validity check cannot protect
this case: counts and order are valid for the wrongly classified identifiers.

Revision2 did not exempt these paired inline identifiers and correctly returned:

```text
exercise: nonformula numeric changes not accurately declared:
want=['12'], got=['12','1','2']
```

The actual recorded error is in Chinese in the saved stdout. Revision3 returns
no errors with the same input and no numeric declaration. This directly
violates the explicit boundary that ordinary inline parenthesized point
identifiers remain outside the structural-label exemption.

The regression is introduced by accepting all discovered paired markers once
only the first prefix and all nonempty text slices qualify. It is within the
numeric-to-nonnumeric comparison path, not the preserved numeric-to-numeric /
nonnumeric-to-nonnumeric behavior. A repair must distinguish real line-start
paired task lists from this inline identifier collection without reinstating
revision2's blanket rejection of all paired opening parentheses. No repair
was attempted in this review.

## Actual new execution

`new-inline-points.py` selects only the necessary constants and pure validation
functions by Python AST from the two immutable snapshots. It does not import
the edition module, inspect source/candidate mathematics, or execute a
producer, app, native path, normalizer command, renderer or browser. It calls
the existing pure functions internally for this one new case. No formula
appears in the fixture; a defensive renderer stub raises if called.

Child argv:

```text
<repo>/.claude/skills/ld-s10y-lesson/.venv/bin/python -B
<review-root>/new-inline-points.py --child
```

Actual start: 2026-11-22T20:47:03.415989+00:00.
Actual finish: 2026-11-22T20:47:03.469880+00:00.
Actual exit: 1; this signals the confirmed new false acceptance, not a harness
fault. Stderr is empty. `new_false_acceptance=true`, cases=1, images=0,
renderer/native/producer calls=0. Exact argv, both code hashes and
stdout/stderr hashes are preserved in `new-inline-points.execution.json`.
The returned evidence includes both raw signatures and both canonical texts.
No invocation was repeated.

## Verified existing facts

The revision3 record SHA
`9a74b67285110ae8a6dc8f87b53b1dcfc70a3dcab0d6e297074182c0a89ffe79`
matches its immutable code and both execution-receipt bindings. Current
`.claude/skills/ld-s10y-lesson/tools/edition.py` is byte-identical to that
snapshot. Revision2 SHA is
`5332783f83fb56b3cc2f7173ec2bf10712c59b795ae6ce455dd9149012d82381`.

Retained sixteen-affected-regressions receipt SHA
`2081c991ca681d25082131e17d1479c734411b234b196649029aa8a76cafb42b`:
actual exit 0, stdout empty, stderr sixteen dots, `Ran 16 tests in 0.002s`,
`OK`. Both actual streams were read and their hashes verified:
stderr `f70474bb9d3d4b78369d133e47904bb1ef43bd0a69dec6649003a49c7b092484`,
stdout the empty-file SHA. It was not rerun.

The current static test file SHA is
`f909056c430b1e4ae14b943ca87fee1d64d28c327d9208cdc220f1c7c03a8e40`.
Inspection finds the four former false-acceptance protections, all three
previous compatibility examples, inline-comma numeric/data protection,
empty identifier-collection rejection, and formula/nested/data/declaration/
count controls. The historical receipt does not separately bind test-source
bytes; this hash records the inspected current test file, not an invented
historical test snapshot. The sixteen-dot result is actual retained execution
evidence, not a completeness proof.

Retained unchanged-written438 receipt SHA
`346cbfea0c128c5203c484996787ba16112f7df348e42dd49425620f85e6c896`:
actual exit 0, stderr empty. Its actual stdout has sourceLabels=10,
modernLabels=10, errors=[], with identical DATA-only signatures:

```text
["438","208","1","8","7","2","2","4","8","5"]
```

Actual stdout SHA
`77e5665838e543b8ff654fb1d1cb52171936a603d16feb2688692cd10edddf34`
and stderr SHA match the receipt. It was not rerun, and the bound exercise
template was not reopened or edited for content. The record's unchanged
template hash remains a received binding, not new source approval.

The closed prior review and its actual three-case compatibility receipt were
read on explicit user authority. Prior manifest SHA
`aa08186d786d905939f17fc07266dab5adc53ef5407e9406b7105b5a67e11838`
matches revision3's historical binding. The three-case receipt SHA is
`f5cbe2881e872862edab6b1af64a12fdb6881269c9dc535006e0d78c83683466`;
its inline streams rehash correctly and actual exit is 1, recording all three
revision2 false rejections. No old test, old counterexample or surface was
replayed.

## Affected static behavior

The revision2-to-revision3 diff changes exactly the structural qualifier and
the conditional structure gate. Existing marker discovery remains unchanged:
formula spans are equal-length masked; nested markers, unpaired delimiters and
the existing Chinese figure-number exclusion remain filtered. The
suffix/two-column normalizer and full marker-order mechanism are unchanged.

The first-prefix rather than every-prefix qualification supports a later
comma/two-column marker when the full list is recognized. Line-start paired
markers with separate nonempty task bodies can qualify, recovering the third
prior compatibility case. Restricting the separate structural count gate to
numeric-style presence changes leaves same-style layouts on the old
normalizer and math/data signatures rather than imposing revision2's new
pre-normalization count mismatch.

For genuinely structural complete numeric/letter lists, label spans become
nonnumeric Latin; mathematical formulas remain outside replacement and DATA
signatures still include problem numbers, figure references and ordinary
values. Count or invalid sequence failures append a separate error before
numeric declarations are processed, so a declared data substitution cannot
cancel an already detected missing/duplicate structural-label error. The
observed P2 is earlier: deciding that an ordinary point collection is itself
a task list.

The retained 16 tests exercise exactly the intended successful cases, but
the two point-identifier tests either lack a qualifying first prefix or have
empty bodies. They do not cover a colon prefix plus nonempty connective /
declarative fragments. The new counterexample therefore adds a genuinely
missing affected case, without rerunning a passed fixture.

Numeric-to-numeric and nonnumeric-to-nonnumeric limitations of the old
normalizer/signature checks are not expanded into new findings. No broader
cleanup was requested or performed. The unchanged historical broader result
remains 34 PASS + one
`test_prose_is_line_broken_at_sentences_and_introduced_formulas` FAIL, not a
green 35-test suite; the old 11/6/18/35 runs were not reexecuted. No claim is
made that the prior source uncertainties, code identities or live acceptance
are resolved.

## Separate phase and final ledger

Before any code-phase input was opened, every completed CHOICE artifact was
actually chmod 0444, stat'd, and its manifest-listed hashes verified. Tool
receipt `914818` reports all listed files matching and all files mode 0444.
CHOICE manifest SHA:
`6808ac2231883ff06e58382f2879ec957c8ad0a5b631c0aa98b057a49c0a9d3a`.
CHOICE source FIRST and PREKEY snapshots and its semantic PASS were not edited
or reopened in this phase. Its one with-review validator exit 0 remains
independent of this code CHANGES_REQUESTED finding.

Code-phase image loads=0. Cumulative reviewer charged attempts=2/8 and context
images=2/24, unchanged from the completed choice phase. Parent remains 24/24
with zero new image payloads. New pure-validation invocations=1, cases=1;
passed test/native/editor/renderer/browser/producer reruns=0. Source/native/
screenshots were not reopened. Technical code revisions remain cumulative 3;
this reviewer made zero fixes, content revisions, schema changes or product
changes.

Writes only under the new independent code-review root. No network/docs,
environment, DB, paid, install, dependency, Charter, Git, app, publisher or
retainer activity. No concurrent reviewer, fork or worker was started.
The already retained four surface PASS results remain received/closed, not
newly reviewed or modified. Code review is not mathematical, surface,
whole-lesson, whole-ticket or publishing approval. Final activeExecSessions=[].
