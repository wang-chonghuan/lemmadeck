# STEMROBIN-184 B Independent Semantic Review

Outcome: **REVISE**. 11 seeds, 11 questions, 44 checked options, zero images.
Question units: 7 pass, 4 revise, 0 blocked. Source coverage: 6 pass, 5 revise.
All 11 redundancy checks and all 11 leakage checks pass.

## Ordered Evidence

1. Read only `references/contract.md`, `references/review.md`, then `seed.json`.
   Solved all 11 original exercises; wrote `source_solutions.json` before any draft disclosure.
2. A structured Node projection disclosed only question IDs and `view` fields.
   Recorded fidelity, redundancy, leakage, every option and complete conditional
   true sets in `visible_review.json` before reading intent, source mapping or key.
3. Only then projected author internals, key and coverage. General/intended keys
   agree with independent derivations. They do not resolve visible domain/wording
   failures. q244's initial ordinary-angle pass was revised after comparison
   exposed that its claimed visible nondegeneracy condition was only internal.
4. No old answers, old review evidence, chats, network, model, browser, DB,
   publishing or Git operations. No seed/draft/canonical edits. All authored
   files are confined to this review directory and written with `apply_patch`.

## Exact Smallest Affected Units

- **q242**: Expand only this question's response unit to judge the FIRST images'
  midpoint/equal-distance/opposite-side relationships as well as the double images.
  Its first subtask is currently given, not tested. Add an explicit universal
  identity qualifier (preserving coincident inputs) or a justified visible
  distinctness condition: true sets are `{b}`, `{b,c}` when B=C, or all four when
  A=B=C=O. Update this question's intent/key reasoning as needed and only
  `coverage[source_number=242]`, which currently overclaims first-task coverage.
- **q243.view.stem**: Say the chosen rule must hold for EVERY allowed A,A_1 pair.
  Keep A=A_1 allowed: in that particular instance both a and c are true.
  Rebind/review q243 and `coverage[243]`; unrelated option rows need not change.
- **q244.view.stem**: Make `0 < angle ABC < 180 degrees` and proper rays explicit.
  "Non-flat" alone does not exclude zero. Internal intent/coverage already claim
  a visible nondegenerate condition that is not there. Rebind/review q244 and
  `coverage[244]`; the ordinary-domain answer c need not change.
- **q246247**: Add the definition judgment `Z_O(F)=F` (setwise, not every point
  fixed) to this merged response unit. In each of its four option texts change
  the line-center clause to "any point ON that line". Update only corresponding
  intent/key reasoning and `coverage[246]` / `coverage[247]`. Polygon clauses
  correctly mean existence by side count; a parallelogram witnesses four sides,
  not every quadrilateral. No new question or image is required.

Affected-only follow-up: q242, q243, q244, q246247 and coverage sources
242, 243, 244, 246, 247; retain this rejected snapshot. Do not edit the other
seven question units merely to obtain approval.

## Commands And Digests

Every shell command used explicit cwd:
`/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck`.

`env PYTHONDONTWRITEBYTECODE=1 python3 .agents/skills/ld-s10y-choice/scripts/prepare.py digest <file>`
ran separately for seed and draft, both exit 0, with exact outputs:

```text
seed canonical SHA-256:
d51e4bf71d8575b0ccb56cb910d8adfdb36dfe3b4035d4d75cee242b8d82a9fb
draft canonical SHA-256:
b945285c026a2125b286f33a23a47f4484493190d5441c907d90ca998c2ac2a5
```

Independent Node canonicalization agreed. Input byte snapshots:

```text
seed.json: 6780 bytes
24f12d49ee5a615023de132a6a6c247bd09269961385ed430f79fec13884ebda
draft.json: 30684 bytes
3def317a064df8ba661aeb0e5b45b92dbd8a567445824413b13f06eb4bbe603f
```

The independent Node assertion command exited 0 and printed `status: PASS`:
7 coordinate/fixed-point assertions; seven nonzero compass inputs, both initial
branches (14 runs); five vector midpoint/length cases, including M=N=O;
regular 3/4/5-vertex examples false/true/false. Circle intersections were computed,
not assumed. B=O uses identity without attempting zero-radius intersections.
General odd-vertex pairing and arbitrary-center proofs are recorded separately;
numeric examples are not claimed as proofs. Seed, registered new figures and all
view image references are empty.

The validator was invoked **once**, after `review.json` was written:

```text
env PYTHONDONTWRITEBYTECODE=1 python3 .agents/skills/ld-s10y-choice/scripts/validate.py
  --repo /Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck
  --seed /Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n20/choices/seed.json
  --draft /Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n20/choices/draft.json
  --review /Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n20/choices/review/review.json
```

Actual exit code: **3**. Exact output:

```text
mechanical checks passed; semantic review outcome: revise
```

A separate read-only Node audit exited 0, printed `status: PASS`, confirmed
both input byte digests were unchanged, counted all 44 option checks, and
confirmed exactly the four revised units listed above. Structural consistency
is not semantic approval. No validator rerun, draft repair, or image payload.
