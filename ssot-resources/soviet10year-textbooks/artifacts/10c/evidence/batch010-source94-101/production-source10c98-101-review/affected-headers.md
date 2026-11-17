# STEMROBIN-184: affected-header confirmation, 10c 99-101

Status: B1 HEADER REPAIR CONFIRMED, TEXT ONLY; WAIT.

## Scope

Compared only the three authorized preserved originals and the three current
durable page.md files. Reused all 57 earlier Stage B object observations;
did not repeat source review, read 0098, or load any image.

Workspace:
`/Users/yong/.codex/worktrees/a07e/lemmadeck`

Preserved-original root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c98-101/before-header-repair`

Current-page root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages`

## Exact Body Changes

The authorized text reads and three plain unified file diffs show exactly nine
body tag replacements: `<!-- p -->` becomes `<!-- exhead -->`.
Distribution: 0099 has 2; 0100 has 4; 0101 has 3.
There are no other body differences, added/removed body lines, changed words,
formulas, punctuation, whitespace, exercise numbers, stars, subquestion labels,
wrap markers, samerow flags, open/cont flags, or boundary text.

| Stable block | Frozen reading row | Unchanged instruction text | Unchanged task coverage |
| --- | --- | --- | --- |
| p0099#4 | 99 R10 | 求下列函数的导函数： | 335-341 |
| p0099#12 | 99 R18 | 求极限： | 342-345 |
| p0100#1 | 100 R01 | 确定谐振动的振幅、周期和初相： | 346-347 |
| p0100#4 | 100 R05 | 利用导数讨论函数并作出它的图象： | 348-349 |
| p0100#8 | 100 R10 | 把下列各式写成谐振动方程： | 351-356 |
| p0100#15 | 100 R17 | 化简： | 357-360 across 100/101 |
| p0101#4 | 101 R04 | 证明恒等式： | 361-362 |
| p0101#7 | 101 R08 | 不查表计算： | 363-369 |
| p0101#15 | 101 R16 | 验证等式： | 370 observed |

These are exactly the nine locations identified by Stage B B1. Block order and
indices are unchanged. Their instruction ownership is now explicitly encoded as
exercise headers rather than prose. B1 is resolved at the supplied text-artifact
level; this is not a downstream assembly or publication result.

Because body newlines and wrap/samerow markers are unchanged, the earlier
source reading-row evidence remains 21 / 19 / 18 for these pages. No parser,
row-counting script, gate, or test was run to re-establish those counts.

## Whole Group 357-360

The group's complete observed span is unchanged:

1. p0100#15 is now `exhead`, with the same literal `化简：`.
2. p0100#16 remains the complete independent `ex 357`.
3. Printed footer 94 follows; it is not a new instruction or task continuation.
4. Physical 101 still starts with complete independent `ex 358`, then `ex 359`
   and `ex 360`. No new heading is inserted before these three tasks.
5. p0101#4 is the next instruction header, now `exhead` with the unchanged
   `证明恒等式：`; it begins the following group at 361.

Thus the simplification instruction continues across the 100/101 page boundary
and governs exactly 357, 358, 359, 360 in the observed range. The four task owners
are not merged, renumbered, split, or marked as cross-page continuations.
361 is not pulled into the simplification group.

The earlier n96/supplement boundary, unsolved/worked-example distinction,
complete task 370, and unproven outer supplement right boundary are reused
unchanged from Stage B. No later page or new source evidence was consulted.

## Whole-File Metadata Qualification

The current files are NOT whole-file nine-tag-only variants of the preserved
originals: each current frontmatter additionally contains:

- `printed_lines`: 21 on 0099, 19 on 0100, 18 on 0101.
- `figures`: an empty array.
- `provenance`: `{ "cap": "1", "normalized": true }`.

The original `errata` empty array is retained, with a comma added to allow these
new fields. The rest of the frontmatter is unchanged. These observed
normalization metadata additions are separate from the nine header body edits.
They do not alter instruction text, formulas, body rows, numbering, or group
boundaries. No claim is made that the entire files differ only by nine tags.

The parent reported its first finalize runs passing so far. This reviewer neither
ran finalize nor read its output, generated artifacts, audits, or binders, and
does not independently attest that operational result. The metadata above was
observed only in the authorized current page.md text.

## Hash-Bound Snapshots

The preserved-original hashes match the original Stage B author-draft hashes.

| Authorized preserved original | SHA-256 |
| --- | --- |
| Preserved-original root / 0099.md | `77b87c163547037ffe7809df0eed73f7eb5e01e33b4f4c009147fe539636cbca` |
| Preserved-original root / 0100.md | `5715776407c4d5da8328db6400972ec4303173114a29e2de09345e9ed45bccd9` |
| Preserved-original root / 0101.md | `8479ab95ddfd711bb874e4f51b5a7afb5504231237ab96fe76a053b489d691cd` |

| Authorized current page | SHA-256 at comparison |
| --- | --- |
| Current-page root / 0099/page.md | `e51e5b2a72ba5ae344707a7744e6a5c0a06b97b19ae9fa6e8cd24e5663b4ebe8` |
| Current-page root / 0100/page.md | `c06f4ae2efe3092d9c6b32898b057419a9d41a4c2c2a8353178d6f08abf4890e` |
| Current-page root / 0101/page.md | `d0f5979e11647dc70487eb161baa378375398fc87472c822454c845f7240bdac` |

## Actions And Stop

Actions were limited to authorized text reads, SHA-256 checks, plain before/after
file diffs, and adding this report in the owned review directory. Diff exit 1
indicated the documented differences, not a failed test. A mistyped path in one
checksum request did not resolve or read a file; the authorized 0101 original was
then hashed at its exact correct path.

No image payload added: permanent reviewer count remains 4 original views plus
1 earlier native crop, total 5; zero reopens. No source edits, normalization
reruns, tests, gates, binders, assembly, render, Git, DB, publication, app, skill,
or workflow action occurred. Frozen Stage A, Stage B, and both prior image
ledgers remain untouched.

WAIT for explicit parent direction.
