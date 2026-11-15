# S20 Targeted Source-3 Repair Review

Targeted semantic outcome: **PASS**. Only the previously failed source-3
line-count sentence was mathematically rechecked. No unchanged question,
option, image or full source task was reviewed again.

STEMROBIN-180, phy6-c3-s20, 2026-11-15.
Independent choice reviewer, not Feynman/the author.

## Affected Sentence

Read `author-solution-repair-1.md` and the affected line in current
`author-solution.md`; compare the latter's bytes against the retained
`author-solution-rejected-1.md` using diff.

The current line 78 correctly distinguishes:

- 3 N / 0.1 N = 30 equal gaps.
- 30 gaps require 31 total scale lines.
- 29 positions are interior to the full 0..3 N span.
- Of those 29, the existing 1 and 2 N lines are retained.
- With 0/1/2/3 N already marked, only 31 - 4 = **27 new lines** are needed.

This also agrees with three adjacent integer-newton intervals, each needing
nine new interior lines: 3 x 9 = 27. The old wording called the 29 interior
positions all new; the repair removes that precise error without changing
the existing-mark condition.

`diff -u` shows exactly one changed line, line 78, replacing the count
sentence. Diff exit 1 records that intended difference, not a failed
mathematical check. Whole-file line comparison and hashes establish that
every other author-source line is unchanged.

No further repair unit remains. The first error and rejected snapshot are
not erased or retroactively recorded as passing.

## Preserved Evidence And Current Binding

All values are actual SHA-256 digests. Canonical seed/draft/view hashes use
the existing contract's sorted-key, ASCII-escaped compact JSON serialization.

| Record | SHA-256 |
| --- | --- |
| Unchanged seed canonical JSON | `d2f78b91fdee80f1fdc385f397ea6cbc8b898d22da45ea1958ce0bf1df31fbe9` |
| Unchanged draft canonical JSON | `c85bc4d77a2ab5bc0b24d8148a18aad81bec870ffe81c4b4c6463de65fd5fdd5` |
| Unchanged pure view canonical JSON | `036a71c2e2efce7201d1e762b17195a1b2ec109e68e6dc5bcf9c413a2539d723` |
| Unchanged seed bytes | `a8abefd46017ff511b088be967111b9561e55812bea36505101257b90ef82d3b` |
| Unchanged draft bytes | `6c8328c4c16700d96b9707f57a210de4f329bff3fb59de0851bb055ac5f886bd` |
| Unchanged view bytes | `fd4238dabf36798c27af7a07cc78e2b62a864c7b616952db08f194e3f0dffa85` |
| Frozen source-first bytes | `55567159569786663e7fa297382566d6003469f378b6fe8e14195572cc0e35db` |
| Frozen view-first bytes | `e7407953f0c599c36e5f33c474b50e64b4f5942f81e0dcc5678117cab3aef2ca` |
| Unchanged author-notes bytes | `78aa45e3ea5d77b9816b19e350a835ddeb6443ef2393ac37da1b6a30d90a6a4e` |
| Retained rejected author-solution bytes | `1f9ee42250a673d78d1d58cfa6a5388c430448157b4b757575a7b0ae7e0d0f5a` |
| Current repaired author-solution bytes | `2a21a73855b4204936f5f0941e4bfcfc68347c68a515dd25363dc8ac7ef4f2de` |
| Repair handoff bytes | `b4f999301ec0b6f4b8416202026bbacfeb13778e9879b473d4cdcab9b01aca28` |
| Retained first review.json bytes | `94767a171120190c64cd77d3fb898ac7bc8ecdb1784bd8e2f4cb1299b84430eb` |
| Retained first key-comparison.md bytes | `e6fbbb1fee3583e297b6f0a518b03ef134333dd2f0b3ee2da524046f6240752f` |

The failed author-source snapshot is byte-identical to the file reviewed at
first failure. The first `review.json` still has `outcome: revise`; its
paired comparison still records the first validate exit 3.

The repaired review keeps the SAME seed/draft canonical bindings because
the candidate itself was not changed. Its reviewer identity and this report
bind the external repaired-author-source bytes separately; that file is not
a schema-level seed/draft field.

## Exact Reuse Of Unchanged Verdicts

`review-repaired-1.json` reuses the first review's source solutions, all
unaffected coverage evidence, all figure observations, all fidelity/
redundancy/leakage checks and every option truth/evidence without substantive
re-examination. Only these JSON fields change:

- `reviewer.identity`: states targeted scope and external repaired hash.
- `source_reviews[2].coverage.evidence`: resolves the obsolete reference to
  the external source count failure; its verdict stays pass.
- `question_reviews[2].mathematics.verdict`: revise becomes pass.
- `question_reviews[2].mathematics.independent_solution`: records this sole
  corrected sentence and arithmetic.
- `outcome`: revise becomes pass after that sole failure is resolved.

Every other JSON value must equal the retained first review exactly. In
particular all sixteen `option_checks` and all four complete sets are unchanged:
**{B} / {D} / {C} / {A,D}**.

The reused option-C evidence retains its original historical wording that
the option was true despite the external source error. It is prior frozen
evidence, not a claim that the current repaired sentence is still wrong.

All original capacity limits remain: public instrument naming, common
apparatus structure supplied in the making stem, actual assembly/marking/
measurement and independent-expression losses, rounded calibration masses,
and no guessed dial unit or multiplier. The targeted source sentence repair
does not increase coverage or change the claim of instrument ability.

## Exactly One Repaired-Review Validation

```bash
env PYTHONDONTWRITEBYTECODE=1 python3 -B \
  .agents/skills/ld-s10y-choice/scripts/validate.py \
  --repo . \
  --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s20/seed.json \
  --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s20/draft.json \
  --review .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s20/review-repaired-1.json
```

Actual single invocation: **exit 0**.
Actual output:
`mechanical checks passed; declared semantic review: pass (not automatically proved)`.
This checks the current seed/draft/assets and repaired-review contract binding;
the sole mathematical correction is justified by the targeted arithmetic above,
not by automatic proof or a rerun of the unchanged blind review. The command
was invoked exactly once with `review-repaired-1.json` and was not rerun.

Only this new report and `review-repaired-1.json` are written. First failure,
frozen blind documents, seed/draft/view, author files and images are not edited.
No browser, rendering, new image approval, publisher, app, DB, dependency,
service or Git action is performed. Stop after the validation and integrity
check; no further substantive review of unchanged units is authorized.
