# n12 rejected review: serialization-only figure membership repair

Ticket: STEMROBIN-184. Existing independent reviewer; parent-agent delegation under existing human ticket authority.
Scope: the serialized review's figure_checks membership only. No new semantic review, mathematics, source/figure observation, validation or approval.

## First actual failure retained

The parent ran the current with-review validator ONCE and obtained actual exit2, not the intended semantic-rejection exit3.
Preserved evidence root:
`ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch007-n12-choice-rejected/`.

| Actual evidence | SHA256 |
| --- | --- |
| `validation-command.json` | `85e44f97ec7ed67fbaddf2c4a06d34009b4d01fe7f9a4b4825648062236c85bd` |
| `validation.stdout.txt` (empty) | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| `validation.stderr.txt` | `7c4e60cbdcd6196fb6c295e1e2afb7e5df66aba7e77a5a6b65a6200e9a2ddefb` |

Actual stderr: `contract error: figure_checks: incomplete or extra records`.
The command record retains the executable, complete argv, exit2, null signal and runCount1. These files were read only, not altered. No new validator execution occurred and no actual exit3 is claimed.

## Exact snapshots before editing

All paths below are under `.intentfold/tickets/STEMROBIN-184/tmp/`.
Before modifying the review, copied both complete current files with no overwrite and verified identical bytes:

| Preserved first snapshot | SHA256 |
| --- | --- |
| `geo910-n12-choice-independent-review-rejected.serialization-first.json` | `3f3266bb933c54b257f4af3a6576c67016001dc31289e8a854a2ff2d73adf5d5` |
| `geo910-n12-choice-independent-stage3.serialization-first.md` | `230f448c3aaff3fff351a854a19f252fde83fbbb860933ffb1227eecf45addaa` |

The original Stage3 report itself remains unchanged at the second hash. Stage1 remains unchanged at `354cdd50c340ad9b0abb02a2839ecdab55b2f6f773940c5e5b29e7acd01cae92`.

## Tool derivation and exact serialized diff

Read `.agents/skills/ld-s10y-choice/scripts/validate.py`; current source SHA256:
`812c39df07ebe1d8fbaef4b2bd3c9b2a52993708a62436837802a0e2b2385fe0`.

At question_figures (line81), the member set is the union of:

1. The question view's figure_ids.
2. Every option's figure_ids.
3. Figure IDs on each source exercise selected by that question.

At check_review (lines199-201), used_figures is the union of those per-question sets, and keyed requires figure_checks identifiers to equal it exactly.
This does NOT automatically include seed.source.concept_figure_ids, every available seed asset, or selected concept text. Intent figure_observations must also match the question-level set, but are not a separate source of extra concept membership.

The current nine questions have empty view/option figure IDs, and all their selected source exercises have empty figure IDs. A read-only calculation of the exact formula gave an empty set for each q01-q09 and an empty aggregate usedset.

Only JSON diff:

```text
figure_checks: [complete fig-39 record, complete fig-41 record] -> []
```

No other top-level field changed. A parsed comparison of the complete old/current JSON with figure_checks removed returned true. Thus all10 source_reviews, all9 question_reviews and their42 option_checks, every verdict/evidence, reviewer identity, new_figure_reviews, outcome and snapshot binding are exactly equal, not regenerated.

## Current immutable review

File: `geo910-n12-choice-independent-review-rejected.json`.
Current FILE-BYTE SHA256:
`fe11b7ea3e8b6493278f8c0d318ca644c7fa44c3aba1aaf271152578c8dce7a0`.

Current contract CANONICAL JSON digest:
`fbca5f896111d9f57faa9b781d2c983968b579eb1af54ad8e26c1ab5c85fe1c8`.

Unchanged seed binding:
`e4a23600dcc57983ae486b56ef88280f79707dbe0b5a0d8ad0f0265f27facdcd`.
Unchanged draft binding:
`89bb79bab062e97e250b678d779f667d0df4964f0681ad89384f7f3b6b08cb85`.
Outcome remains `blocked`, with all existing source99/101/104 findings intact.

Seed raw SHA256 remains `b902a808e1fbe32a89e0060b8091f1970c717083b6d40ca3f82616029feedf17`.
Draft raw SHA256 remains `aa2aa67d4e467cc5749683d8d52ad3bbe1d1038a1c4c9279f3314a65302f1397`.
View raw SHA256 remains `ee989f8ed5a5846020fd878116e2d1388870541e6a27e61f2912462ae4fd9e86`.

## Actual observations preserved and stop

Figures39/41 were actually viewed in Stage1 and remain definition context. Empty serialized figure_checks means only that neither belongs to this draft's tool-derived question-used set; it does NOT claim either was unviewed.

The complete original observation records and asset/native-PNG hashes remain in the first review snapshot. Stage1's detailed actual source-context observations and Stage3's existing reference to that frozen evidence remain unchanged. The original Stage3 described the pre-repair two-record review; this note documents the serialization-only successor without rewriting its historical claims.

No image was reopened, no source/math/figure gate repeated, no validator was run, and no approval was made. Only the requested review list was edited with apply_patch; the two snapshots and this note were added. Sources, seed/view/draft, author files, original Stage1/Stage2/Stage3, tools and the parent's first failure evidence were not modified.

STOP at immutable corrected rejected review. Further validator execution or any substantive repair belongs to a separately authorized next action.
