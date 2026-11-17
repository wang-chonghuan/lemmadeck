# Minimal Author Repair

Date: 2026-11-17. Ticket: STEMROBIN-184.

This is an author repair record, not a semantic review or package approval.
Only three new files were created in the existing author-owned scratch directory:
`draft-repaired.json`, `view-only-repaired.json`, and this record.
The repaired view contains only `{id, source_numbers, view}`; internal reasoning,
keys, coverage, this record, and the written proof requests below are not part
of its selection surface.

## Basis And Boundary

The explicitly authorized frozen Stage2 findings were read from
`../production-choice-n92-review/view-only.md`. They reported all 17 questions
and 67 options mathematically passing, with target-reversal/coefficient-matching
leakage in q16, q17 and q18. That review concerns the ORIGINAL snapshot, not
this repaired one. The reviewer report and original seed, draft and view were
not modified. Original Stage3 must continue comparing the original snapshot.

No answers, new source materials, images, semantic self-review, with-review
validator, global checks, browser, app, database, publishing, dependency, schema,
Charter, Git, SkillHost or archive operation was used for this repair.

## Authored Changes

| Question | Selection-stem repair | Capacity now assessed |
| --- | --- | --- |
| n92-q16 | Retain the original LHS; remove the target RHS and the request to cancel a named term to reach it. | Independent universal product-to-sum judgment for the sine product only. |
| n92-q17 | Retain the fifth-degree LHS and P; remove the printed proof RHS, its coefficients, the supplied sinx-times-P bridge, and the proof-completion request. | Independent complete power-reduction and sine-cosine identity judgments. |
| n92-q18 | Retain the triple-product LHS; remove the printed four-term RHS, its signs/quarter factor, and the proof-completion request. | Independent universal judgments of the existing two product identities. |

Options, option order, keys, rationales, source solutions, concept selectors,
figure data, source mappings, question IDs and ordering remain unchanged.
No claim is made that the repaired choices measure independent proof production
or completion. The retained operations still narrow the original open proof
tasks; final cancellation, factorization, unlisted branch expansion, substitution
and coefficient collection are not assessed where applicable.

## Exact Difference Units

For EACH of `n92-q16`, `n92-q17`, `n92-q18`, only these four fields changed:

- `view.stem`
- `intent.task`
- `intent.unit_reason`
- `intent.limitations`

The only changed coverage fields are:

- `coverage[287].reason`
- `coverage[290].omitted_tasks`
- `coverage[290].reason`
- `coverage[291].omitted_tasks`
- `coverage[291].reason`
- `coverage[292].omitted_tasks`
- `coverage[292].reason`

Total: 19 field units across 3 question objects and 4 coverage objects.
All 14 unaffected question objects were mechanically checked for deep equality
and identical ordered JSON representations. The other 24 coverage objects are
unchanged. All options, keys, source solutions and source mappings are unchanged.

## Read-Only Written Exercises

These are the COMPLETE original mathematical proof requests, retained separately
as unproved written tasks. They are not asserted true as selection premises and
must not be co-displayed with the repaired choices during selection. Choosing
an option does not mark any of these written exercises proved or completed.
Their original source records also remain intact in `seed.json`.

### n92-q16 Written Exercise

证明恒等式：

$$
2\sin4x\sin2x+\cos6x=\cos2x.
$$

### n92-q17 Written Exercise

证明恒等式：

$$
\sin^3 x\cos^2 x
=\frac18\sin x-\frac1{16}\sin5x+\frac1{16}\sin3x.
$$

### n92-q18 Written Exercise

证明恒等式：

$$
\sin5x\cos3x\cos6x
=\frac14(\sin14x+\sin2x+\sin8x-\sin4x).
$$

## Snapshot Digests

Canonical SHA-256 follows the artifact contract's sorted compact ensure_ascii JSON.

| Snapshot | Canonical SHA-256 |
| --- | --- |
| Unchanged seed | `4a03d7cd0099f8d293b307781171cb558a823070d181ae271f61f08551e52bbf` |
| Original draft | `fdebc1283448040b12c557517525d133136ed26a59e046c8ddfae803138d6155` |
| Original view | `3ba958bb6c7ef09309de59d4d1074de5d5c84f65c246ffbd819ac2b5a66ea04e` |
| Repaired draft | `56e7b584cdad6805498c41372aab502afa2c194a44d5ca39bf990bc90b8eea2b` |
| Repaired view | `58b6131aead12ac54b1dd09e368a1e808aeee8c013a31217d0a8ce314f890d72` |

| File | Byte SHA-256 |
| --- | --- |
| Unchanged seed.json | `faff454162e494af2d6b67f5c4e1b7f3a7c0e17fe4c2cfd24f36c92b78cde710` |
| Unchanged draft.json | `59fc78e3bd9a3efaab9d9acff7f3a3d4a6aa2175cf43b643541854362a06ed0e` |
| Unchanged view-only.json | `72b3d42cbea2f37034d38d53a49301b4e4f93f5e99009e178f17dcbeff56b45a` |
| Unchanged frozen reviewer view-only.md | `e08efd38b8902f5beb0f58ffebbfd218a88877fb0f031f98470bb34d7f3a7ea1` |
| draft-repaired.json | `5ef2c171b6107f5dfc7b08450c99ecf81a7a1b2b62ecff0bd87f1fb4adc7109f` |
| view-only-repaired.json | `58d68b3819f08bb665002646e08c1eeca8531c8f7725e2072a776dc1d9367f09` |

## Mechanical Command Result

Working directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Run exactly once for the REPAIRED draft, without `--review`:

```sh
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-184/tmp/production-choice-n92/seed.json --draft .intentfold/tickets/STEMROBIN-184/tmp/production-choice-n92/draft-repaired.json
```

Exit 0: `mechanical checks passed; semantic review still required`.

The mechanical export/difference command also exited 0 and confirmed:
17 single-choice questions, 67 options, 28 mapped source exercises,
14 identical unaffected question objects, the exact 19 field differences above,
and unchanged original file-byte hashes.

No semantic verdict is issued for this repaired snapshot. WAIT for independent
review; do not substitute it for the reviewer's frozen original Stage3 input.
