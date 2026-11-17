# Trace-Only Binding Update

STEMROBIN-184, ana10-c6-s4-n94, CHOICE AUTHOR. The parent explicitly authorized
only the internal seed binding update after settling this batch's source/book.
This additive report resolves the pending binding recorded in `handoff.md`;
the old handoff itself remains byte-for-byte unchanged.

## Authorized Change

Only `author/draft.json` field `seed_sha256` changed:

- Before: `598d5321a199d9f7e0cc424b1a5394b595976399d0c6f7431d476263bd9654d0`
- After: `c684fe38e40ea2d7540fe825af95d54a41a4cd867f2b8b8eb93559326cf8dfa7`

The parent reported that only the seed trace entry for `10c/book.json` changed:

- Before: `138c02f09ddd18d263c1046fdb4d5f55a0d1b2d03aee199379e65c1c949bb6a7`
- After: `027d9034031d426619153510357dadc879a438ef23dfd3f08825eab6da401904`

The parent preserved the old seed at sibling `seed-before-book-rebind.json`.
No seed, source file, answer or reviewer material was read during this update;
the new binding is the canonical digest supplied in the parent's authorization.

## Preserved Draft and Hashes

Before changing the binding, the entire original draft was copied using
`fs.copyFileSync(..., fs.constants.COPYFILE_EXCL)` to:

`.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c94/author/before-book-rebind/draft.json`

Its byte hash was asserted equal to the original draft hash before and after
the update. No previous file was overwritten to create this preservation copy.

| Draft snapshot | Canonical SHA-256 | Byte SHA-256 |
| --- | --- | --- |
| Preserved original | `41bdeace96e11ccbef5d2ae2fcfd1a2d5d2c3a71bad583bb8ab3332269c28ce3` | `31569cbb3b2c59ebdc3cf82742363f10feac821fe3176fbb2a16151a11731fad` |
| Current rebound | `6d365b223742e9fec811c77c26b784c98c1a120419cf4e489fe793ecbcba15f6` | `cc705742a6768e5527f601780f2aca3c8c6d2b50cdf7ca412da42bba1c52ce52` |

The original canonical hash is retained from the first handoff; it was not
recomputed. The new canonical hash was obtained with:

```bash
python3 .agents/skills/ld-s10y-choice/scripts/prepare.py digest .intentfold/tickets/STEMROBIN-184/tmp/production-choice10c94/author/draft.json
```

Exit 0; stdout:
`6d365b223742e9fec811c77c26b784c98c1a120419cf4e489fe793ecbcba15f6`.
This command computes a JSON digest; it does not inspect/prepare a seed or run
the structural validator.

## Equality Assertions

Executed with `node:assert/strict` and SHA-256 from `node:crypto`; exit 0:

- Full `questions`, including every view, intent and key: deep structural equal.
- Full `coverage`: deep structural equal.
- Full `new_figures`: deep structural equal, remaining `[]`.
- Entire draft after replacing its new binding with the old value: deep
  structural equal to the preserved original.
- Entire draft bytes: equal to the preserved bytes with exactly the authorized
  `seed_sha256` value replacement, including unchanged whitespace.
- `views.json`: original byte hash unchanged, and full structure exactly equal
  to the rebound draft's `questions.map(({id,view}) => ({id,view}))`.
- `solutions.md`, original `handoff.md`, and `validation-first.txt`: original
  byte hashes unchanged.

Unchanged byte hashes:

| Artifact | SHA-256 |
| --- | --- |
| `views.json` | `700be2efce7d87ed456a30d4f44b6919140795ecc871112d3fe363dc6fa4f332` |
| `solutions.md` | `ad437c1016668e9f03be742c2b62a6758a66bb08c960b0dd068a392e98524100` |
| `handoff.md` | `19e20abf5df12ca9b77787dc813f1f7cdcef376bb0f5ce6c8d3967117627570b` |
| `validation-first.txt` | `7befbee8438905b9a89478d50151971df9b4f18a9437cd6c68de299e6a160470` |

Assertion command stdout:

```text
PASS: full questions, coverage, new_figures and all other nonbinding draft structure unchanged.
PASS: draft bytes differ only by the authorized seed_sha256 value replacement.
PASS: original draft, views, solutions, old handoff and first validation evidence byte hashes unchanged.
PASS: unchanged views are exactly the full [{id,view}] projection of the rebound draft.
New draft byte SHA-256: cc705742a6768e5527f601780f2aca3c8c6d2b50cdf7ca412da42bba1c52ce52
```

No mathematics changes, validator rerun, semantic review, reviewer reads,
old-handoff rewrite, image access or publication occurred. The first structural
validator pass remains preserved against its original binding; it is not
represented as a new validation of the rebound snapshot. Parent owns subsequent
source-first freeze, rendering and independent review. Author: WAIT.
