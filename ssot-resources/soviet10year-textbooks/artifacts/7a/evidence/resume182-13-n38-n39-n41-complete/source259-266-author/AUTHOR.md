# 7a physical 259-266: Source AUTHOR Facts

Role: source AUTHOR only. This is not independent source review or an independent PASS.

Repository: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`

Branch: `codex/STEMROBIN-182-textbooks`

Page root: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages`

Evidence root: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/source259-266-author`

## Counts

Exactly one image batch, eight complete prepared grids, eight loads, zero reopens, zero crop loads.
No preparation, rerendering, earlier page image, modernization, answer-key or choice read.

Rows include the printed page-number footer. Source-author rows are observations from the single
grid batch; detected rows are the existing tool's numeric result, not an independent source verdict.

| Physical | Printed | Source-Author Rows | MD Rows | Detected Rows | First Exit | New Exercises | Figures |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 259 | 253 | 18 | 18 | 18 | 0 | 0 | 0 |
| 260 | 254 | 19 | 19 | 19 | 0 | 0 | 0 |
| 261 | 255 | 20 | 20 | 21 | 1 | 0 | 0 |
| 262 | 256 | 24 | 24 | 24 | 0 | 0 | 0 |
| 263 | 257 | 22 | 22 | 22 | 0 | 0 | 0 |
| 264 | 258 | 25 | 25 | 26 | 1 | 858-861 (4) | 0 |
| 265 | 259 | 26 | 26 | 26 | 0 | 862-869 (8) | 0 |
| 266 | 260 | 25 | 25 | 25 | 0 | 870-872 (3) | 0 |
| Total | | 179 | 179 | 181 | 6 zero / 2 nonzero | 15 | 0 |

Exercise 869 has one additional continuation block on physical 266.
There are no source figures, tables, captions, figure owners or necessary figure crops in this range.
Printed worked examples remain textbook prose, not added answers.

## Boundaries

- Physical 259 starts a new paragraph in `alg7-c4-s3-n44`; physical 258's equation (2)
  was already complete, so no incoming `cont` is fabricated.
- Physical 260's final prose block is `open`; physical 261's first prose block is `cont`.
- Physical 262's final prose block is `open` after `左`; physical 263's first block is `cont`.
- Physical 263's final equation is complete. Physical 264 continues the example with new
  complete formula rows; neither a missing formula nor an artificial paragraph continuation is added.
- Physical 265's exercise 869 is `open` after `正`; physical 266's exercise 869 is `cont`
  and closes after part б.
- Exercises 870-872 close before the printed unit-45 title on physical 266.
- `alg7-c4-s3-n45` starts at printed 260 / physical 266. Its final paragraph is `open`
  after `以后，`; no next-page content is inferred.
- No errata or numbering errata were authored. Physical 262's printed `c=1.21`
  was retained without a mathematical correction.

## First Count Failures

Both pages remain affected technical work, not a content-approval or retry gate.
The only errors are the one-row count differences. Charset, formula and figure errors are absent.
No rows, formula wraps, empty blocks or duplicate text were added to satisfy the counter.

- Physical 261: detected bands `[1542,1574]` and `[1590,1629]` split the single
  displayed fraction row `$x=\frac{-7\pm\sqrt{1}}{24}$.`.
  First receipt SHA-256:
  `aec003c83fd1f9de77883f4d3ed47b680b757de758f52db3d23e5935f6d9e684`.
- Physical 264: detected bands `[238,268]` and `[293,316]` split the single
  opening fraction row `$x=\frac{7\pm\sqrt{4}}{9}$，`.
  First receipt SHA-256:
  `498ceea763c7346f8b1821f0df9e6bd9e84393fdf0ead3ca5456b58f5b9902c5`.

`count-diagnostic.stdout.json` records affected-only numerical band coordinates, without another
image payload load. SHA-256:
`c354f3cc0b726e8ca09c25a4688b64ef4ec65d866f6979862b29c2054654b37d`.

The pre-existing layout tool was not edited. Its hash during all runs and the diagnostic was
`84ca1f30b171f38d593bfb1145aa9e6cc88099c8682ef0082994ee4bf96fbc8a`.

## Execution Evidence

Exact parser flags were checked with the existing virtual-environment Python and
`p2c.py finalize --help`, then checked against the parser code. Each actual page had exactly one
`finalize` call, eight total, zero retries:

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 7a --page N --root ssot-resources/soviet10year-textbooks/artifacts --work .tmp/ld-s10y-lesson --books ssot-resources/soviet10year-textbooks/sources
```

All eight original authored Markdown files were frozen read-only under `original-authored/`
before the first finalize at `2026-11-19T05:01:18.383Z`.

`freeze.json` SHA-256:
`a15696b1fd0bf118dd624a4cf1da250e572841a795aa0cb8770da852fcbb111c`.

`author-report.json` SHA-256:
`f4f09ec846098f97d3ac615bf766bf396f36b63f1fad944a6149bb1df9aeb02c`.

`first-finalize/0259` through `first-finalize/0266` contain `start.json`, `stdout.txt`,
`stderr.txt`, `receipt.json`, and first-result snapshots of `page.md`, `page.json`, `audit.json`.
Start/finish timestamps, complete arguments, stdout/stderr hashes and actual exit codes are retained.
The first failure files have not been overwritten. Per-output hashes are in `author-report.json`.

## Current Markdown Hashes

Each path below is `<Page root>/<physical>/page.md`.

| Physical | SHA-256 |
| --- | --- |
| 0259 | `c6464ece0123da962bd4bf371d7870634ba87b0d4a66c30158711b98b001d3bc` |
| 0260 | `4acf3588fc6ad414ee33b02f8d710841b21b69ae611adec3684b45202e95d2d9` |
| 0261 | `255f2adb1a1ab0d33b34c9e96ee784db4d2c6a7801d2656187a20962b1fdaf41` |
| 0262 | `2f554fbd6942bd0c77a556f97f22d4e11cae4a64abe4711a3abd41766eb16a52` |
| 0263 | `86b42141f355e4b9ae8136f47efe07377986a9703b650f861714487a41da6205` |
| 0264 | `d8d2dc80642d8cd83b792d294bc6096a84a2195e8c0508c760ce1e9ef20015da` |
| 0265 | `d15b9412d3f085e4069d5a3f74ac929f029a215607804d28a28b8340d218c5b2` |
| 0266 | `26bda2711f1e20b8c49c6dcbe4d009612abbf676160509618f085d984844ffb2` |

## Scope Close

Only the owned eight page directories and this author evidence directory were written.
Other agents' edits were preserved; no earlier page, index, layout tool, charter or ticket-progress
file was changed by this author. No DB, environment-file, network, paid, app, dependency, publish,
assemble, commit or branch operation was performed.

Source-author work stops here after the eight-page report. Independent source review remains with
the parent; the two count defects remain affected technical work.
