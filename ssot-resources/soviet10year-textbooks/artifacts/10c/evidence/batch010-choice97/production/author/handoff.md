# n97 author handoff: WAIT

STEMROBIN-184 existing offline invocation; author only.
All writes are confined to:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c97/author/`.

## Artifacts

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c97/author/solutions.md`: full independent solutions, written before options.
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c97/author/draft.json`: complete offline draft and internal derivations.
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c97/author/views.json`: exact ordered projection containing only `{id, view}` for each question.
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c97/author/validation-first.txt`: actual first and only no-review validation result.
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c97/author/handoff.md`: this author handoff, not a review.

Sole mathematical seed:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c97/seed.json`.
Its authorized canonical SHA-256 was verified before authoring:
`54cb3765d97f5f74b7dc26cf5ff7cfd2e5c552f9545a0582412e5f28e67cf091`.
The whitelist is unsolved 392-401 and the complete definition across blocks
10, 11 and 12. Authorized group tasks are the twelve primitive proofs in
392-397 and four primitive constructions on R in 398-401. Exercise 401 is the
mixed number 5/2.

## Counts and units

- 10 source exercises; all 16 source tasks solved independently and accounted
  for in 10 coverage rows.
- 10 questions: 4 native single, 6 native multiple.
- 42 definite-assertion options: 17 true, 25 false, with one internal derivation
  per option and a reproducible mistaken procedure for every false option.
- 0 seed figures, 0 new figures, 0 image opens, 0 image batches.
- No source task is left without a recognition unit. This is not a claim of
  complete production-skill retention.

| Question | Mode | Options | True set | Response unit |
| --- | --- | --- | --- | --- |
| n97-392 | multiple | 4 | B, C | Cube-root rationalized quotient and sine difference quotient |
| n97-393 | multiple | 4 | A, C | Square/cube quotient factorization and cosine subtraction |
| n97-394 | multiple | 5 | A, C | Cube-root chain, tangent quotient and excluded endpoints |
| n97-395 | multiple | 5 | B, C | Square-root chain, negative cotangent and excluded endpoints |
| n97-396 | single | 4 | C | Complete reciprocal proof pair on distinct open half-lines |
| n97-397 | multiple | 5 | B, C, E | Absolute-value branches and actual versus symmetric zero quotients |
| n97-398 | single | 4 | B | Composite-polynomial primitive of x^3 |
| n97-399 | single | 3 | B | Shifted-power primitive of x^4 with full lower-degree cancellation |
| n97-400 | multiple | 4 | A, D | Distinct translated-quadratic primitives of x |
| n97-401 | single | 4 | D | Affine primitive family for the constant 5/2 |

The counts arise from the response units and distinct mistake checks, not a
quota. In particular, correct-option count is not a source-task counter.

## Capacity losses and author checks

Recognition does not demonstrate independently writing any of the twelve
source proofs or constructing the four primitive solutions from a blank page.
Coverage records those losses separately for every source exercise.

The decisive-quotient questions for 392 and 393 do not demand explicit limit
evaluation or completion of the final F'=f equality; these are additional
substantive omissions, explicitly recorded in coverage. Questions 394 and 395
likewise do not demand written final simplifications of the supplied valid
chains. The endpoint assertions supplement rather than replace the given open
intervals. For 401 the visible mixed-number conversion is supplied, so unaided
notation interpretation is not assessed.

To avoid goal copying, 392 and 393 alternatives end in quotient identities,
not a matching target derivative. The valid chains in 394 and 395 are
unsimplified; their root/quotient steps and boundary assertions require
mathematical checks. In 396 the correct derivative also appears in a false
extension assertion, so derivative matching cannot choose the correct complete
assertion. In 397 the true zero-nondifferentiability option must be distinguished
from a symmetric quotient; merely matching the two supplied f values misses it.
No false chain is made to look correct by appending a final f equality.

The primitive candidates in 398-400 require whole-function derivative checks,
not only matching the leading coefficient. The two valid functions in 400 are
distinct, x^2/2+1/2 and x^2/2+2. Their different constants are allowed and they
are not duplicate spellings of one function. In 401 all four families are
quantified over each fixed real C; their derivatives are 1, 0, (5/2)x and 5/2.

The author checked every option and its claimed mistake. This is an author
audit only, not an independent semantic gate or a self_review artifact. An
authorized reviewer must still assess fidelity, increased recognition demands,
the explicit proof-completion losses, leakage, redundancy and every option's
mathematical truth against the snapshot.

## Validation

Working directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

```text
python3 -B .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-184/tmp/production-choice10c97/seed.json --draft .intentfold/tickets/STEMROBIN-184/tmp/production-choice10c97/author/draft.json
```

Actual exit: `0`.
Actual stdout:

```text
mechanical checks passed; semantic review still required
```

Actual stderr: empty. Exactly one validator invocation, without `--review`.
No draft content changed afterward. An independent read-only equality check
confirmed that views.json is precisely the draft's ordered `{id, view}`
projection with no extra fields. Structural success does not establish
semantic approval.

## Snapshot hashes

Byte SHA-256:

| File | SHA-256 |
| --- | --- |
| seed.json | 97df505324fbe5acb9cfb4c8f23f7c20c1580c4b92713bdf75c4fd09e2d15473 |
| author/solutions.md | 861c80dba486d6c0df526a1704ed711766aa6d76e707c3622abd708d9d09c785 |
| author/draft.json | c9ca9ee2e6ccd2f19e2dd2f8cb7f73f78b3f6237cc7195ffff9efe05aa4586b6 |
| author/views.json | 30667c88c102bdcdc8a436747c413437edbfb271d3d4a90798c09971224b827f |

Canonical JSON SHA-256:

| File | SHA-256 |
| --- | --- |
| seed.json | 54cb3765d97f5f74b7dc26cf5ff7cfd2e5c552f9545a0582412e5f28e67cf091 |
| author/draft.json | d59a9210e4fa427969501515ff4c32d03f47766dda94cf23efe843a1a8909d8d |
| author/views.json | 4ab29362ac28624f69be05f6f8dc887ea22d650b524e1859f582bf2b895d16b4 |

The final response supplies byte hashes of validation-first.txt and this
handoff after writing; a file cannot usefully contain its own final byte hash.

## Boundary

No workflow refresh or grill. No prepare rerun, finalize, publication, DB or
environment access, application/dependency/schema/charter/Git changes, images,
browser use or other-chat messages. No worked owners, answers, old choices or
reviewer files consulted. Only the current authorized skill instructions and
validator implementation were read in addition to the mathematical seed and
the author's own outputs. Other collaborators' files were not edited.

Status: author handoff complete; semantic review pending. WAIT.
