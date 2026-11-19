# Affected Independent Solve Amendment

Status: author-discovered algebra correction, not semantic review or approval.

The original `independent-solve.md` and `solve-freeze-receipt.json` remain byte-identical. The incorrect 837.e claim in that first solve is retained as evidence, not reused as a valid solution.

## Exact Affected Task

Durable whitelist seed 837.e asks to factor `10-2sqrt10`. The independently corrected factorization is:

`10-2sqrt10 = sqrt10(sqrt10-2)`.

Expansion verifies this exactly: `sqrt10*sqrt10=10` and `sqrt10*(-2)=-2sqrt10`.

The first factorization `2sqrt10(sqrt10-1)` expands to `20-2sqrt10`, not the requested expression. Its extra factor2 doubled the first term while failing to divide that term's remaining factor by2.

## Isolation And Ordering

- Only task837.e is changed; all other79 solve tasks and all table-source and figure bindings are unchanged.
- This amendment is frozen before replacing the affected alternative in the editable candidate.
- The first candidate draft is retained as `draft-FIRST.json`, including its inconsistent q07.E rationale.
- The revised q07.E will assert the corrected full factorization and supply its exact expansion.
- No external answer key, author solution or new source image was read.
- Independent semantic review of the final candidate remains pending; this amendment is not a self-PASS.
