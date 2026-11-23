# N22 fresh offline choice-author report

Date: 2026-11-23. Authorization: STEMROBIN-184 9c/10c finishreview; author scope here is only `9c/ana9-c3-s2-n22`, written exercise 163, all four tasks, zero figures.

Status: authored and structurally checked; independent semantic review is pending. No review file, semantic PASS, retained-choice approval, publication or product integration is claimed.

## Root, authority and ownership

Every shell invocation used explicit workdir `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`. `pwd` confirmed that exact root.

Only `prepare.py`'s whitelist projection and its prepared seed supplied mathematical source authority: the official `--book 9c` selector, modern N22 lesson/exercises/figures and book index. Exercise 163 contains two convergence and two divergence proof tasks. Explicit concept selection was block 1 (limit uniqueness theorem) and block 5 (convergent/divergent definitions). The displayed theorem proof and worked examples were not selected or used to solve the exercise.

No answers/keys/interactions, earlier choices or ticket results, reviewer freeze/solutions, or N23 body were read. Reading this newly authored draft for counts and hashing is not a read of earlier choices. No images, model-service calls, browser, network, DB, environment-file, app, library-freshness, installation/update, Git or peer actions occurred. No skill tests or history lookup occurred.

Only the four authorized files were created; other content and staging were untouched:

- `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n22-nov23-source8283/choices/seed.json`
- `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n22-nov23-source8283/choices/draft.json`
- `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n22-source8283/choice-author/source-solve.md`
- `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n22-source8283/choice-author/author-report.md`

The seed was written by the official preparation tool. The other three files were authored with `apply_patch`. Existence checks confirmed the draft and both author-evidence files did not already exist. Complete source proofs were saved in `source-solve.md` before options were constructed; `chmod 444` made that snapshot read-only. Its byte hash was unchanged after draft construction. No failure or rejected snapshot was overwritten; every executed command exited 0 and no stage was retried.

## Required commands and actual results

All commands below ran at the exact ROOT above, with `--repo .`:

```text
python3 .agents/skills/ld-s10y-choice/scripts/prepare.py inspect --repo . --book 9c --lesson ana9-c3-s2-n22
```

Executed exactly once; exit 0. Projected inventory: one exercise, number 163, all four expressions; concept candidates 0-11; zero figures.

```text
python3 .agents/skills/ld-s10y-choice/scripts/prepare.py prepare --repo . --book 9c --lesson ana9-c3-s2-n22 --exercise 163 --concept-block 1 --concept-block 5 --out .tmp/stemrobin-184-six/n22-nov23-source8283/choices/seed.json
```

Executed exactly once; exit 0. Output: `prepared 1 written seeds; no questions generated`, followed by seed canonical digest `f713b6f8f3c412228bf221de9e11c1bdda443c159540489a2443a7bbd95ae8d6`.

```text
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .tmp/stemrobin-184-six/n22-nov23-source8283/choices/seed.json --draft .tmp/stemrobin-184-six/n22-nov23-source8283/choices/draft.json
```

Executed exactly once, without `--review`; exit 0. Exact output: `mechanical checks passed; semantic review still required`. This is structural/input evidence only, not mathematical or task-fidelity review.

## Hashes and count commands

```text
chmod 444 ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n22-source8283/choice-author/source-solve.md
shasum -a 256 ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n22-source8283/choice-author/source-solve.md
python3 .agents/skills/ld-s10y-choice/scripts/prepare.py digest .tmp/stemrobin-184-six/n22-nov23-source8283/choices/draft.json
shasum -a 256 .tmp/stemrobin-184-six/n22-nov23-source8283/choices/seed.json .tmp/stemrobin-184-six/n22-nov23-source8283/choices/draft.json ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n22-source8283/choice-author/source-solve.md
jq '{questions: (.questions | length), options: ([.questions[].view.options | length] | add), types: ([.questions[].view.mode] | group_by(.) | map({mode: .[0], count: length})), units: [.questions[] | {id, mode: .view.mode, options: (.view.options | length)}], new_figures: (.new_figures | length)}' .tmp/stemrobin-184-six/n22-nov23-source8283/choices/draft.json
```

Each exited 0. The first source hash was taken before options; the second was identical. Count output: 3 questions, 13 options, 2 `single`, 1 `multiple`, 0 new figures. The report's own byte SHA-256 is computed after its final write and returned externally, avoiding a self-referential digest.

| Artifact | Byte SHA-256 | Canonical JSON SHA-256 |
| --- | --- | --- |
| Seed | `21bbcb5881fd5d2c21dce3f82a48c2672fb57caf85bfb1c2fb9be0754c8095eb` | `f713b6f8f3c412228bf221de9e11c1bdda443c159540489a2443a7bbd95ae8d6` |
| Draft | `8af771c3f25d1291ccb3ceef2ab5284f29b3c1674da4bb73385075761bf2b709` | `f743ed7e037f836cb895c4e41b23dafec74fa45ea01ccabbd049899b7d2301f6` |
| Immutable source solve | `147b3fba7238b81a72d0a706386ab1e0fa100f065400d7ec891cd735808af357` | Not JSON |

Canonical JSON digests use the contract's sorted-key, ASCII-escaped compact serialization, not the formatted file bytes. The prepared seed's four authorized source-file trace hashes are retained in the seed and immutable source-solve record.

## Response units and coverage

| Question | Native type | Options | Source mathematical coverage |
| --- | --- | --- | --- |
| `n22-common-tail` | `single` | 4 | Parts a and b: exact shared absolute error \(1/n\), valid reciprocal cutoff, every tail index and both parities |
| `n22-persistent-oscillation` | `multiple` | 5 | Part c: recurring values 0 and 2 exclude every finite candidate, with fixed separation and whole-tail quantifiers |
| `n22-unbounded-tail` | `single` | 4 | Part d: for every candidate \(a\) and cutoff \(N\), a correctly bounded late index escapes radius 1 |

There was no fixed question or option quota. Parts a and b were grouped because their absolute errors and full-tail proof control coincide, not because of answer slots. The two divergence mechanisms remain separate. Every visible option is a mathematical argument, not a copied convergence/divergence slot or a combination code. A true final conclusion does not rescue an argument containing a false step. Each option has an internal derivation; incorrect ones identify the exact mistaken procedure and counterexample or failed implication. True positions differ across the three questions; no shared always-first position is used. These are authoring decisions, not independent leakage or mathematics verdicts.

No convergence/divergence case is deferred. The explicit production losses are substantial: selection does not demonstrate independently writing the four proofs, discovering the limit 2 for the first two expressions, choosing an epsilon threshold, constructing the parity contradiction or inventing a late witness. The first question supplies the target 2. The latter questions supply candidate proof ingredients. These losses are recorded in both question intents and coverage; the original written-proof production requirement is not claimed fulfilled.

There are no source figures, authored figures or figure-dependent unresolved conditions. Positive integer indices make the rational expression defined; finite-real convergence is explicit. Structural success does not settle whether these recognition tasks sufficiently preserve the written task, whether arguments are equivalent or redundant, or whether wording permits unintended shortcuts.

## Instruction reads and non-content checks

The following exact shell commands all exited 0; their outputs were instruction text, the new prepared seed, the ROOT path, or empty successful existence tests:

```text
pwd
sed -n '1,260p' .agents/skills/ld-s10y-choice/SKILL.md
sed -n '1,280p' .agents/skills/ld-s10y-choice/references/authoring.md
sed -n '1,300p' .agents/skills/ld-s10y-choice/references/contract.md
sed -n '1,300p' .agents/skills/ld-s10y-choice/references/review.md
sed -n '1,260p' .agents/skills/ld-s10y-image/SKILL.md
sed -n '1,280p' .claude/skills/ld-s10y-lesson/references/production-resume.md
sed -n '1,220p' .intentfold/readme.md
sed -n '1,240p' .intentfold/charter/engineering.md
sed -n '1,240p' .tmp/stemrobin-184-six/n22-nov23-source8283/choices/seed.json
test ! -e ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n22-source8283/choice-author/source-solve.md
test ! -e .tmp/stemrobin-184-six/n22-nov23-source8283/choices/draft.json
test ! -e ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n22-source8283/choice-author/author-report.md
```

## Handoff boundary

The existing independent reviewer must receive the seed first and the question `view` subtrees next, before author solutions or keys. This report and `source-solve.md` are internal author evidence, not blind reviewer intake. No peer was messaged or review file created by this author. Await concrete affected-repair findings; do not re-inspect, re-prepare, rewrite the source solution, or modify unaffected units merely to package this handoff.
