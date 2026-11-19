# Affected1 Stage2 Review: RECOVERY1

**Affected outcome: pass.** Author key, draft and reasoning remain undisclosed.

Final view byte SHA-256:
`258b69e4a41864bbd76d258701138dad28fd6b40a6b8b2aba07b5e0ff4d216af`

Final view canonical SHA-256:
`b7cab1a3eae341dc7c25d352bfb4658a0d928e26d3c957b1fb2f68653ec5601c`

## Affected Findings

- **q886a / S2-F-001 resolved:** every argument now makes the same equality
  claim. There is no uniquely matching terminal 22. Learners must judge the
  proposed common-denominator operation. A is valid; B adds denominators
  separately and yields 1/11; C uses denominator 241 instead of 1.
- **q886b / S2-F-002 resolved:** every argument has the same concluding claim.
  No terminal 18 versus different values identifies an option. A supplies the
  missing numerator factors and conjugate product; B omits the factors and
  yields 2sqrt(5); C uses denominator 9 and yields 2.
- **q889 / S2-F-003 resolved:** equality rows now vary among {1,5}, {0,4}
  and {0}, rather than giving the same intersection answer everywhere.
  Above/below components and completeness also vary. Only B has all three
  actual graph sets correct. All three rows of A/C fail; D's equality row is
  true but both inequality rows reverse the actual curve.

Original rejected records are preserved. These resolutions apply only to
the final hash-bound view, not retrospectively to the original snapshot.

## Frozen Order And Counts

Fidelity/redundancy/leakage for the three changed questions was written and
frozen `0444` before affected mathematics or truth-set files existed.
Then all **10 changed options** were solved independently:
**3 true, 7 false**, native single mode in all three.

Reviewer true sets: **q886a A; q886b A; q889 B**.
These happen to retain the original option IDs, but the changed procedures
and tables were independently checked, not presumed to preserve the key.

All 48 final question objects were compared against the owned original view.
Exactly **q886a/q886b/q889** changed; the other **45 questions / 142 options**
are canonically identical and inherit their original passed records.
The final projection omits only the old root's lesson metadata, not a task.

Rechecked affected source coverage: **886's two proofs and 889's three
level-set tasks**, 5 tasks total. Retain the other 52 frozen source tasks.
Combined coverage is **19 exercises / 57 tasks** with no remaining
affected fidelity or coverage failure. Combined mathematics is **48 questions /
152 options**, 53 true and 99 false, 43 single and 5 multiple questions.

## Production Losses And Relationships

Proof recognition still does not demonstrate constructing/writing a proof
unaided. Whole-table recognition still does not demonstrate independently
writing all three intervals. These concrete production losses are recorded;
the repaired views now require mathematical procedure/graph judgment and
no longer have the specific answer-copying bypasses.

The two distinct proofs remain separate; the three tasks from the same graph
remain jointly represented. B/D sharing crossings is meaningful because their
inequality directions differ, while A/C give genuinely different crossings.
General conjugate rules and the unrelated remainder/coordinate questions do
not disclose each other's concrete answers. Unchanged 880/890 conventions
and their source-definition limitations are inherited, not reopened.

Reused all four frozen image observations. **Zero new figure reads, opens,
rerenders or new figures.** No author draft/key/reasoning or canonical
review/validator was accessed. No source/code/app/DB/dependency/Git changes.

## Binding And Hold

Optional `RECOVERY1/bindings.json` was absent during initial inspection.
Actual final view bytes and canonical per-unit comparison bind this review;
no draft content was substituted.

The eight new files are confined to this owned `affected1/` directory and
frozen `0444`; the hash manifest binds the final view and inherited records.

**Wait for explicit Stage3 author-key disclosure.** A source-to-view pass
does not establish agreement with the still-undisclosed author key,
misconception derivations, internal coverage or recorded limitations.
