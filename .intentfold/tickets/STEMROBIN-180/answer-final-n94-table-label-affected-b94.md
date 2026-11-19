# n94 Table-Label Affected Answer Review

## Verdict

**PASS for the one localized edition-label replacement. M1 passes offline
generated-metadata binding.** Post-repair answer finalize and runtime behavior
remain unverified. R1 remains PASS; its original FIRST REVISE record is preserved.
No course completion, publication or runtime approval follows from this review.

The entire new candidate equals the prepared/bound R1 candidate with exactly
one occurrence of the display phrase replaced in `answers[5].displayAnswer`,
exercise `g2-2`:

- Old: `表中莫斯科附近出产的褐煤`
- New: `表中标为 Brown coal (Moscow region) 的褐煤`

All other fields and every other character of the display remain unchanged.
This includes all numbers/units, equal-mass and complete-combustion conditions,
the specific measurement restriction, Q=qm reasoning, the unequal-mass caveat,
notes, grading, parts, prompts, figureEvidence and historical_entities.

## Specific Row Identity

The prior independently sealed source inventory's third data row is brown coal
produced near Moscow, with the previously accepted q values. The approved durable
modern table spells its identity using `source-row-03-fuel-1 = Brown coal`
and `source-row-03-fuel-2 = (Moscow region)`. The new phrase reproduces exactly
those two labels, explicitly as the table-labelled fuel. It does not replace the
object with generic brown coal, a newly invented locality, or a universal fuel
property. The source row's recorded identity and values are reused, not re-solved.

The durable figure spec's source PNG hash matches the original frozen fuel
inventory, and its SVG is byte-identical to the previously accepted rendered
figure. Only the specific row label/source binding is inspected; there is no
new visual or whole-figure review and no image is opened.

No historical declaration is fabricated. Current prompts and prose contain
neither the Chinese locality term nor its English place name, and the candidate's
historical_entities arrays remain empty. The specific locality is instead
referenced using the already approved table label. The tool contract is untouched.
This is a substantive display-surface change requiring this affected review,
not a pretext for silently rebinding the old protected digest.

## Exact Bindings

- Parent-bound R1 affected manifest:
  `08444a810a4fdbb7c99cdf554f3477422f131ac103ff294ca898ef5a46ad523d`,
  29 entries, PASS.
- Prepared/bound R1 candidate:
  `60adcdf13b151e6537e67b12da125bb728255274e4736fa8ee39097c0cca9863`.
- Prepare-binding record:
  `9e07d5f1505d7cf1bbe297856cb309ede66bb301b7f031137b437f0f5909d56a`.
- New table-label candidate:
  `989df3acb11c634941739bc11dd7a7608129cc5e2d491356469c9b1826f65bee`.
- Table-label repair manifest:
  `db35eecacd373198bef23c2c5d0676f1a30f23f9c04f162354fc1c70d5c1f91d`.
- New protected semantic SHA-256:
  `e2b674aea2cbffa4959dabb9544d898da06c0c58dad723a88e8f0139af060f6b`.

The imported prior projection module is unchanged. Its previously bound R1
projection provides stable identities only. The prepared candidate projects
exactly to the accepted R1 projection/digest; the new projection differs only
in the one display phrase. Previously accepted semantic findings are carried,
not subjected to a fresh SOURCE or full-answer review.

## M1 Metadata Checks

All eight generated prompts and ordered stable IDs exactly match the current
finalized durable exercises. Group/source-number identities agree with the
previously accepted projection. Prompt comparison is literal, with no whitespace
normalization or new science/question edits.

Finalized durable exercises SHA-256:
`5274cfc3b4dee6bfd9997df7d2c72fd061b1cc327e19db2f9bee2459fe37f06f`.
The isolated finalized exercises have identical bytes. Durable lesson SHA-256:
`a6dc32c5760422c6ecd38c0f961d36ed2d639a65330bb94a12c01f71a9fe0477`.
This lesson read is only to confirm the absent locality text, not to reassess
the lesson or validate a nonexistent lessonSourceRef.

Generated figureEvidence IDs exactly match finalized figure_refs: the table
entry for `g2-1` and empty lists for the other seven tasks. Implicit table
dependencies in the already reviewed explanatory answers are not converted into
invented figure metadata. All three recorded table paths are actual durable
SSOT paths; each matches the prepare record and its isolated counterpart:

| Dependency | Durable SHA-256 |
| --- | --- |
| Original PNG | `072e3c3eece1c65b3d11d8b264527f41d9164ab8f13a1d0cf57b7924b7298e98` |
| Edition SVG | `539a9c2c708fc126edeadf3221e1036c1097488491d5f5ef578ded74f3b7bbae` |
| Edition FigureSpec | `924d393134bdf1565c431b3655203abe2679e136cdff953c941cb4cca59a07d9` |

The FigureSpec names the same durable original PNG and original source hash.
These are cryptographic/path/metadata checks, not newly opened images or actual
learner rendering. M1 is resolved for this frozen offline candidate only.
It is not a claim that answer metadata was published or installed in runtime.

## Dispositions

| Item | Disposition |
| --- | --- |
| Table-label repair | PASS, one phrase and one display field only. |
| R1 | Carried PASS; question 4 remains ungraded with empty parts. |
| M1 | RESOLVED_OFFLINE_METADATA_BINDING; actual prompts, IDs, paths and source/asset hashes checked. |
| M2 | NOT APPLICABLE; zero exact parts remain, no exact input chain executed. |
| M3 | HOLD; no post-repair answer finalize or numeric runtime acceptance is executed here. |
| M4 | Carried RESOLVED_EXTERNALLY from the already bound R1 review; no layout/width rerun. |

Parent reports the prior finalize exited 2 for the Chinese locality term and
the failed receipt is preserved. This is carried as the stated failure context,
not independently rerun or erased. The replacement's semantic correctness does
not prove the tool will now pass: a separate actual finalize receipt is still
required. No tool exemption or new historical binding is invented.

The same unit continues through R1 and this one label repair. No repair/image/
paid-call budget or stage history is reset. No paid/model calls or new images
occur in this reviewer run.

## Evidence And Freeze

`affected-review.json` records the exact one-phrase comparison, row-label
identity, generated metadata checks and scoped dispositions.
`semantic-projection.json` freezes the exact current protected projection.
`manifest.json` and `input-output-receipt.json` hash-bind actual inputs, outputs
and completed `n94-tl-` command receipts.

Manual writes use apply_patch; all commands use the mandated recorder and exact
active cwd. All new owned artifacts are 0444. Existing candidates, prior review
reports, canonical content, failure receipts, tool contract and other workers'
edits are preserved. New images: 0; new SOURCE/full-answer reviews: 0.
Stop after this scoped handoff.
