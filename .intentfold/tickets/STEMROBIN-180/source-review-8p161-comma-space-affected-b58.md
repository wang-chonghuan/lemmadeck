# SOURCE REVIEW: 8p physical161 / comma-space affected / b58

## Limited PASS

Same reviewer, affected-only verification. Both FIRST findings are resolved
in current MD and JSON, with no remaining defect within this authorized
two-substitution scope. No full source rereview or physics approval.

- p0161#2 row 2 now ends `作用力，` (inserted U+FF0C).
- p0161#8 row 1 now ends `重力. ` (exactly one trailing U+0020);
  direct continuation now reads `重力. 但是`.
- Current page.md and page.json each equal their frozen FIRST bytes after
  exactly those two unique substitutions, with four added UTF-8 bytes per
  file and no other byte change. Entire parsed JSON is also identical except
  those two row values; all metadata, heading and open-colon boundary remain
  unchanged.
- Frozen audit.json, original PNG, fig-109 PNG and SVG each remain
  byte-identical to the current file and match the original FIRST hash.
- Six freeze hashes, freeze manifest paths, FIRST frozen/current report and
  original FIRST evidence hashes all match. FIRST HOLD is preserved, not
  rewritten into PASS.
- Supplied affected finalize receipt records exit 0 and 25/25. The supplied
  exact-binding receipt records exit 0 and two substitutions only. Their
  stdout/stderr bytes and hashes match their call declarations.
- Repair budget is 1/1, remaining 0. ZERO new images; previous six image
  observations reused by unchanged original/figure hashes. Images were only
  hashed as bytes, never decoded, displayed, or reinspected.

## Exact Freeze and Current Bindings

All six frozen hashes independently match the original FIRST hashes, not
merely the parent manifest. Absolute roots:

```text
Freeze:
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source161-before-comma-space/
Current:
/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-suspended-mass/
```

| Relative file | Frozen FIRST SHA256 | Current SHA256 |
| --- | --- | --- |
| artifacts/8p/pages/0161/page.md | 638b38c91a2485a8c638229f347f440c77e53a195bfc72e981e30e5e4d6dda43 | d240021fc4e2f22f3e275fc7686a0fe3a584d3bad6c54ba6ffa533e8afcba53a |
| artifacts/8p/pages/0161/page.json | 8bdabba524b5634c913da2ed77dbc5c39d454ad4807a2ccfc4b3eeffa263ada7 | 13d74b4ac24cfde20ffc3ebe20cf7a7acd9f80deb9b12dba940b7dfa094c9cf6 |
| artifacts/8p/pages/0161/audit.json | 05c9ca5565699cc8ffd5e777c65622d716a66885e17987dd0be18a9810bd2996 | 05c9ca5565699cc8ffd5e777c65622d716a66885e17987dd0be18a9810bd2996 |
| work/8p/pages/0161/page.png | 1453faae6d44ad5af9c1883e1489257eee3c50226451a0c01a8f0b475731a9b8 | 1453faae6d44ad5af9c1883e1489257eee3c50226451a0c01a8f0b475731a9b8 |
| work/8p/pages/0161/figures/fig-109.png | 4cf8bfe1cb7d51d4a367394a46883eb7d36a9238f266972aa2cb2494e884a2de | 4cf8bfe1cb7d51d4a367394a46883eb7d36a9238f266972aa2cb2494e884a2de |
| work/8p/pages/0161/figures/fig-109.svg | f01cf4c216566a9c59f56f4bfbe23a0132598c2e1844065936f581b914c6e81a | f01cf4c216566a9c59f56f4bfbe23a0132598c2e1844065936f581b914c6e81a |

MD: 3010 -> 3014 bytes. JSON: 5570 -> 5574 bytes.
Exact stored-row changes only:

```text
p0161#2 row 2:
"的支座上（图 109），则它对支座的作用力"
-> "的支座上（图 109），则它对支座的作用力，"

p0161#8 row 1 (quoted so the trailing ASCII space is visible):
"在我们讨论的几个例子中，显然，物体的重量等于重力."
-> "在我们讨论的几个例子中，显然，物体的重量等于重力. "
```

Manifest and affected metadata were read, never altered:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source161-before-comma-space/manifest.json
SHA256 28d0d13c51292a965656fc1ed936ed476b173fa29c6af6bd7a51138afeb1cf54

/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source161-before-comma-space/affected.json
SHA256 1537ca79d6f2c673c00f0b5bb6173c117c005e6e28e0711d4c4c87f2b1ebf40c
```

## FIRST Unchanged

Current FIRST report and frozen FIRST-review.md are byte-identical, both
SHA256 `9dabe79e97efcd04fe285c82cb888812ce0e87c6d84f7d0ef114c5a298d7ce5a`:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-review-8p161-b58.md
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source161-before-comma-space/FIRST-review.md
```

The original independent inventory, current-input-and-first-receipts.json,
first-comparison.json and reviewer-first-receipts.md also retain their FIRST
hashes. Their exact absolute paths/hashes are bound in the new evidence.
The old HOLD and original mechanical receipts remain historical evidence.
Only this new affected report supplies the limited outcome for repaired bytes.

## Affected Receipts

Absolute receipt root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/`.
For each prefix, existing .call.json/.stdout/.stderr were read and hashed,
not executed, regenerated, or overwritten.

| Prefix | call.json SHA256 | Existing finished UTC / result |
| --- | --- | --- |
| b58-source161-comma-space-affected-finalize | 027cb5215f2757f273fb267a191f13114d793185167c60310e7940a080e2f327 | 2026-11-17T15:44:25.330Z; exit 0, 12 blocks / 25 of 25, 1 figure, 0 normalizations |
| b58-source161-comma-space-exact-binding | 7854d23fd96d2d74390897525dc256a56a1830e66b65bdb7f96536fd21422282 | 2026-11-17T15:44:33.709Z; exit 0, exact two changes, other inputs unchanged, budget exhausted |

Finalize stdout SHA256:
`48dd4ccfe77f900638299369112e4a3ba4a26ef73cd31db8ddf0e978572e31f1`.
Exact-binding stdout SHA256:
`8abeae2ad67e1914b7362b75f2eafff5277835e9b070333ffe16eb9f1b0dc279`.
Both stderr files are zero bytes, SHA256
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
Command arrays and receipt timestamps are retained verbatim in evidence.
The exact-binding script itself was neither read as source nor rerun.

## Evidence and Stop

Reviewer-owned new evidence subdirectory:

```text
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review161/comma-space-affected/
```

Single affected-only byte-verification execution, exit 0, 58/58 assertions,
zero remaining defects in scope:

```text
/Users/yong/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review161/comma-space-affected/affected-byte-verification.py

Script SHA256:
0b9724c765c111a78862a1debaa8c849845f16c6b465d96d425ff717e6d9c86e

Result:
/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review161/comma-space-affected/affected-verification.json
SHA256 1d2decc8cb864680fe5ac2f835e26d62336273b164208435a463d37f0895fb87
```

Result binds exact six current/frozen files, manifest, affected metadata,
FIRST report and evidence, script and affected receipt bytes. No image library
or decoder was imported; original and figure bytes were hash/identity checked
only. This is not a new page-level visual review or a pipeline/gate rerun.

No source/template/candidate/FIRST/receipt/HOLD edit, repair, new image,
vector rerun, finalize/gate execution, physical162/other-page read, assembly,
promotion, app DB, Git or network operation. Only this new report and new
evidence subdirectory were written. The n38 open-colon boundary is unchanged;
no unit completion or publication is claimed. Stop at LIMITED PASS for the
two corrected FIRST findings and the exact current hashes above.
