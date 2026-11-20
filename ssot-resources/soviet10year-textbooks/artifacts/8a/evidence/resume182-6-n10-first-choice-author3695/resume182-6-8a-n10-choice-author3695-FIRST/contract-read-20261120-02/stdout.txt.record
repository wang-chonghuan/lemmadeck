# Offline Artifact Contract

JSON is UTF-8. The following tables name **all** fields; unknown fields in seed,
draft or review are rejected. Lists contain unique identifiers where applicable.
Strings must be nonempty unless explicitly nullable. There are no app/DB fields.

## Seed: `s10y-choice-seed-v1`

Prepared by the tool, not manually assembled.

| Field | Value |
| --- | --- |
| `schema` | `s10y-choice-seed-v1` |
| `source` | `{book, lesson, concept_figure_ids}`; internal source selectors |
| `exercises` | `[{number, text, figure_ids}]`; full written prose, no answer configuration |
| `concepts` | `[{block, text}]`; selected zero-based paragraph indices and definition prose |
| `figures` | `[{id, label, assets: [{path, sha256}]}]`; actual local images, repo-relative paths |
| `trace` | `[{path, sha256}]`; tool-computed hashes of the four allowed source JSON files |

`label` may be `null`. An asset path must resolve inside the selected textbook's
artifact directory, including symlink resolution. No external or auxiliary files.
Manifest asset paths are edition-root-relative (or explicitly repo-relative).
Use declared final `svg`/`png`/`artwork` outputs and require them to exist; do not
substitute `source.png` for a missing final figure. Only if no final output is
declared, project the existing `source.png`/`source.svg` image renditions. A missing
historical rendition is not required when an actual rendition exists. Hash actual
bytes, not a manifest's remembered hash. Specs, render reports and figure reviews
are not seed input.
`inspect` is only a projected inventory; its candidate paragraphs are not an
approved concept selection.

Snapshot digests below use SHA-256 of the canonical JSON:
`json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))`
encoded as UTF-8. `prepare.py digest <file>` prints this digest. Formatting-only
changes do not invalidate a review; any content change does.

## Draft: `s10y-choice-draft-v1`

| Field | Value |
| --- | --- |
| `schema` | `s10y-choice-draft-v1` |
| `seed_sha256` | Digest of the entire seed |
| `new_figures` | `[{id, path, sha256, basis}]`, or `[]`; authored images, separate from the seed |
| `questions` | Nonempty list of question objects below |
| `coverage` | One `{source_number, question_ids, omitted_tasks, reason}` per selected seed |

New figure IDs must not collide with seed figure IDs. While authoring, `path` is
repo-relative, resolves only inside ticket `tmp/` or `.tmp/`, and identifies an existing
PNG/SVG/JPG/JPEG/WebP image; `sha256` hashes its current bytes. `basis` states the
derived mathematical relationships and any intentional distractor differences.
Never mutate the seed to register an authored image. Use `ld-s10y-image` for
creation and an independent reviewer for the actual image; no new drawing engine.

The checker also accepts retained handoff images inside the selected lesson's
`choice-set/figures/` directory. A separately authorized integration may relocate
approved assets there without changing their bytes or mathematical basis, rebind
paths and obtain a review for that retained snapshot. This does not authorize
this offline skill to promote assets, publish, or write outside scratch.

Each question:

| Field | Value |
| --- | --- |
| `id` | Local unique identifier |
| `source_numbers` | Nonempty subset of selected source numbers |
| `view` | `{mode, stem, figure_ids, options}`; the only learner-facing subtree |
| `intent` | `{task, source_solution, unit_reason, concept_blocks, limitations, figure_observations}` |
| `key` | `{correct, rationales}`; internal exact set and per-option reasoning |

`view.mode` is native `single` or `multiple`. `view.options` has at least two
`{id, text, figure_ids}` entries. Text can contain mathematical Markdown or a
complete Markdown table. Figure IDs refer to seed assets or draft `new_figures`. Do not
insert arbitrary image/HTML embeds or external links into text; use `figure_ids`.
Read [authoring.md](authoring.md#when-new-diagrams-are-needed) for the offline
`ld-s10y-image` delegation boundary.

`intent.task`, `source_solution`, `unit_reason` are substantive prose.
`concept_blocks` refers to selected seed concepts. `limitations` is a list of
concrete capacity losses, empty only when none exist.
`figure_observations` is `[{figure_id, observation}]`, exactly once per figure
used by this question, including the figures of its source exercises.

`key.correct` is a nonempty subset of option IDs, exactly one for `single`.
`key.rationales` has exactly one
`{option_id, truth, derivation, misconception}` per option. `truth` is `correct`
or `incorrect` and agrees with the exact key. `misconception` is `null` for a
correct alternative; an incorrect one requires a concrete mistaken procedure.

`coverage.question_ids` exactly matches questions that cite that source number.
`omitted_tasks` is a list of substantive omissions/losses, not an item counter.
A source yielding no question requires a nonempty omission list and a reason.
This many-to-many relationship is internal. A question must not display source
numbers or source-mapping instructions to the learner.

## Review: `s10y-choice-review-v1`

| Field | Value |
| --- | --- |
| `schema` | `s10y-choice-review-v1` |
| `seed_sha256`, `draft_sha256` | Canonical snapshot digests |
| `reviewer` | `{kind, identity}`; kind `independent_agent` or `self_review` |
| `source_reviews` | One source review per seed below |
| `figure_checks` | One `{figure_id, asset_path, asset_sha256, observation}` per used figure |
| `new_figure_reviews` | One independent new-figure review per registered image below, or `[]` |
| `question_reviews` | One question review per draft question below |
| `outcome` | Aggregate `pass`, `revise` or `blocked` |

New-figure review:
`{figure_id, asset_sha256, reviewer: {kind, identity}, verdict, evidence}`.
`kind` must be `independent_agent`: the reviewer actually inspects the image,
does not create that figure, and checks its declared mathematical basis, deliberate
differences and legibility. This may be the independent question reviewer.
The hash binds the review to the current registered asset. A figure-review pass
does not imply that a distractor graph represents a true mathematical answer.
Its verdict contributes to `outcome`; a self-reviewed figure cannot be handed
off as independently approved.

Source review:
`{source_number, independent_solution, coverage: {verdict, evidence}}`.

Question review:

```text
{
  question_id,
  task_fidelity: {verdict, evidence},
  redundancy: {verdict, evidence},
  answer_leakage: {verdict, evidence},
  mathematics: {
    verdict, independent_solution, correct,
    option_checks: [{option_id, truth, evidence}]
  }
}
```

Verdicts use `pass`, `revise`, `blocked`. A blocked math check may use
`correct = null`, `option_checks = []` when the answer cannot be determined;
explain the blocker in the required `independent_solution` string.
Otherwise independently enumerate all options and the
complete true set. A passing math verdict must agree with the author's set and
per-option truth. A failed one may disagree; it is recorded, not normalized away.

## Commands and Exit Status

`prepare.py inspect/prepare` takes explicit `--repo`, `--book`, `--lesson`.
`prepare` also requires repeated `--exercise`, explicit concept selection
(`--concept-block` or `--no-concepts`), optional repeated `--concept-figure`,
and `--out`. It writes only below a ticket's `tmp/` or repository `.tmp/`,
never overwrites, and does not create options.

`validate.py --repo ... --seed ... --draft ... [--review ...]` refreshes the seed
from its allowed original files and rehashes assets. Exit `0` means mechanical
checks succeeded (with no review, semantic review is still pending). Exit `2`
means a structural/input error; exit `3` means a structurally valid review has a
non-passing semantic outcome. No command produces a publisher payload.

Self-contained tool tests:

```bash
python3 .agents/skills/ld-s10y-choice/tests/test_tools.py \
  --scratch .intentfold/tickets/<ticket>/tmp/tool-tests
```

Synthetic fixtures are generated only inside that scratch directory and removed
after testing. Real textbook experiments also belong in ticket `tmp/` or `.tmp/`.
