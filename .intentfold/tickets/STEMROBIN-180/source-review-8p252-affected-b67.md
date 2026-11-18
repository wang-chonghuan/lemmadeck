# b67 SOURCE252 Affected Review

**SOURCE252 limited PASS**, solely for the frozen F1 repair at the current hashes
below. C/STEMROBIN-180, same invocation. Zero new images. Source253 FIRST SOURCE
PASS survives at its unchanged bytes; this is not a replay of the original review
or a new scientific review.

## BEFORE Evidence

Combined the two existing BEFORE manifests, not the helper's incomplete input set:

| Manifest | Actual Entries | SHA-256 |
| --- | --- | --- |
| `tmp/b67-source252-sole-repair/before.json` | 4 controls | 7a5e12bd24916d392e375bcbfb653262d63514d5830d04662dd79d7048f64e35 |
| `tmp/b67-source252-sole-repair/inputs-before.json` | 52 actual bare-array inputs | 990e40c9ffdcd8c2c64fdc0718b17250ff04a79c815107ceb4c97c03afec338c |

Both paths are under
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/`.
The original bare-array binding is unchanged. The 52 entries match its actual
`[{path,sha256}]` entries exactly; they were not obtained from its inherited
Array `.entries` function. `inputs-before.json` also binds the original
`before.json` hash. The original successful helper receipt
`b67-freeze252-sole-repair` still reports four inputs and exit 0; it was read,
not rerun or altered.

Independently verified every actual snapshot blob's hash and every current input
across the combined 56 unique paths. Exactly two files changed, both source252
MD/JSON; all 54 remaining inputs and controls are unchanged. The existing
`comparison.json` was checked entry-by-entry against that independently computed
result, including paths, snapshot identities, BEFORE hashes, current hashes,
unchanged flags, and the single frozen wrap:

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b67-source252-sole-repair/comparison.json`

SHA-256: `ee94a82da185223fdf5f2bfdb897c12710fd92b09fd7a348f0550b1a262c58f5`.
The flawed helper compare was not executed.

## Exact F1 Closure

Verified FULL Markdown bytes equal the authentic BEFORE snapshot with exactly
one full-row substitution, at line 40. Verified FULL JSON bytes equal its
authentic BEFORE snapshot with exactly one corresponding JSON string substitution.
The full parsed JSON differs only at `/blocks/0/lines/2`. All 24 rows and 12
blocks also match the frozen independent source expectations, not merely a
changed-row excerpt.

Full unchanged context and repaired MD rows:

```markdown
的速度平方的乘积的一半. 这个量具有特殊的名称，叫做*物
体的<span style="text-emphasis: filled dot; text-emphasis-position: under;">动能</span>*，用字母$E_k$表示. 于是，公式(1)可以写成
```

The JSON scalars at `/blocks/0/lines/1` and `/blocks/0/lines/2` are exactly those
same full rows. The italic opener after `叫做` and closing `*` are retained:
the term `物体的动能` remains italic across the physical row boundary, while
the new nested dot span covers exactly `动能`. Removing only that added span
restores the original row exactly, proving unchanged visible scientific prose,
formula, punctuation, and sentence spacing.

| Approved Source252 File | BEFORE SHA-256 | Current SHA-256 |
| --- | --- | --- |
| `page.md` | 6edcf00238edbf174983530b5e83aae51edc2254fdbb33f0c32f3a655e78337b | a99a1cf234d2c55a94a2e9905b1379f00ab3270df942b05482647f7f49da3f4a |
| `page.json` | 21b409b8914d8096657dc2b2726dbfd752cd5b53c8afd76a4d96cbae6b1bde5b | 22edd235d9a7097c69de4c777ecccc8154a4a04f5a24e46c75c32dc8ae88a6fd |

These files are under
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/0252/`.

## Preserved Controls

Both complete audits are byte-unchanged, as are metadata, errata, source/tool
inputs, all 12 FIRST receipt files, the original frozen review, inventory,
expectations, and bare-array binding. Original FIRST gates are not rewritten.
Source252's final `p open` and source253's opening `p cont` are unchanged.

All three source253 artifacts are byte-unchanged:

| File | SHA-256 |
| --- | --- |
| `0253/page.md` | 809d1792a42190f82a31223b53c275c69a62e5e3d6c3bb44a24d416492092115 |
| `0253/page.json` | 5a66faebefdfb6c6b2975a633c637a0671306dcbceb7bb2837144b72612bde0f |
| `0253/audit.json` | 289dfeb3940a4a5e072de386ec0c5dcfc5c2f23d7e3148023443c93f695213b1 |

The source253 `2 千米`, `200 米`, `125000 牛顿`, `125 千牛顿`, and existing
errata remain untouched. No scientific correction or new solution is authorized.
Incoming251 and outgoing254 remain UNKNOWN.

## Actual Affected Receipt

Read and byte-verified `b67-source252-sole-affected-finalize.call.json`,
`.stdout`, and `.stderr`, including the exact source252-only command and
recorded stream hashes/lengths. Actual exit 0; 12 blocks; 24/24 rows;
zero figures; zero normalizations; empty stderr.

- Call SHA-256: `28b67276da75c3b3a024b09e9219a1e3569517788d387b026a9a927ae4993628`.
- Stdout SHA-256: `334a21d7dbc90e29320f7e1e79f95663f2d841b0bbc2709a6042dc5ac8ff6dc0`.
- Stderr SHA-256: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

This affected finalize is distinct from preserved FIRST gates. No finalize,
prepare, vectorize, helper freeze/compare, or repair was executed by this review.

The independent read-only comparison command is recorded as
`b67-review252253-affected-independent-compare` under the ticket's `tmp/commands/`.
Its exit is 0; call SHA-256
`f4dda8d7ea2c020524ed3c6f785eddb0af379422c8b6882dc85f245a277275cb`;
stdout SHA-256
`c1d188104d551557ea8ea28133d8c0051decb9b74637e6a6fdd255d63f462be1`.

Minimal machine-readable result:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b67-source252253-review/affected252.json`.

Only this report and that result were authored. Zero images, crops, or reopens;
no original-review/pipeline replay, second repair, Git, DB, publish, deployment,
checkpoint, usage, or seal operation. SOURCE252 limited PASS is restricted to
the approved current hashes above.
