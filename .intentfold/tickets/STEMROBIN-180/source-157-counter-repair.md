# Source157 Counter Repair Freeze

STEMROBIN-180, 2026-11-15. Authorized affected mechanical repair only.
**Focused verification complete; independent affected-only comparison pending.**
Not a source approval, cohort approval, promotion or assembly.

## Specification And Sole Tool Delta

Read the actual-pixel diagnosis and independent full-source finding M157-1.
The frozen paragraph has separate prose rows at y429-470 and y500-537;
the emphasis dot at x710.5 is only0.5px left of digit2's body at x711.
The implementation was changed from this source-first specification before
consulting existing tests for unittest style; no expectation was derived from
new counter output.

Production edit, applied with `apply_patch`:
[/layout.py:283](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py:283)

```python
any(columns.start - 1 <= center <= columns.stop + 1 for columns in body_columns)
```

Only this horizontal containment gained +/-1px. All dot sizes, preceding-body
height/gap, minimum sequence size, regular spacing,80% area guard, merge-gap,
fraction classification and all other production bytes are unchanged.
Whole-file comparison against the preserved prepatch proves exactly this one
replacement. No source row, `samerow`, text, figure box or figure pixel was edited.

| Binding | SHA256 |
|---|---|
|Prepatch tool, `evidence/layout.py.prepatch`|`9723a80790ee216716e4a6097c77a57cc9bf4deab78da0250f851ad6bb7d9435`|
|Patched tool|`eaafad8cb8ce582742b0196de2402b3fb5a56262fded609f354335c61054d92c`|
|Generated exact patch, `evidence/layout.py.patch`|`295c43d2408a66253bf820e7437b9bd15ea7fe9daf6c4f286af07bc8500549fa`|

Evidence root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-157-counter-repaired`

## Focused Tests Once

Added [test_emphasis_dot_alignment.py](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tests/test_emphasis_dot_alignment.py).
SHA256 `90f82b54291231b8359af19e40e91a5af677949b344db61c0f093030bd4c0978`.
No old test was edited.

Seven unittest methods: actual frozen157 with independent expected16 rows;
four positive half/one-pixel left/right boundary subcases; two outside2px
negative subcases; unmodified80% area guard; single-dot non-sequence;
one inline fraction; one tall nested fraction. Every case checks that the
input counting mask is unchanged.

The code-owned fixture is a byte-identical copy of the original157 PNG:
[/tests/fixtures/6p-0157.png](/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tests/fixtures/6p-0157.png),
SHA256 `6ea043493bbef3974ceefc70783670ee6de9c5b4f83c2d0b42311e85f33312b4`.
The fixed frozen figure152 mask is `[213,658,1109,442]`, content width1186.
No skip, alternate fixture, regenerated raster or scratch-path fallback.

All commands below ran from
`/Users/yong/.codex/worktrees/0f12/lemmadeck`:

```sh
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B -m unittest discover -s .claude/skills/ld-s10y-lesson/tests -p test_emphasis_dot_alignment.py -v
```

One invocation, exit0: `Ran 7 tests in 0.154s`, `OK`. No suite or other page
replay. Unittest evidence is on stderr,1295bytes,
SHA256 `b4610cc92dcb7ce7573465bfa0957a5a8f4d1b64b73b19c98f5a50a3367b3b2b`;
stdout is empty. Exact argv/timestamps/exit/stream hashes are preserved in
`evidence/focused-tests-1.call.json` and `.stdout`/`.stderr`.

## Official Finalize Once

Only original157 artifact/work files were copied into the new isolated root,
leaving the entire `source-author-156-160` freeze untouched. No prepare.
After the focused PASS:

```sh
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 6p --page 157 --root .tmp/ld-s10y-lesson/source-157-counter-repaired/artifacts --work .tmp/ld-s10y-lesson/source-157-counter-repaired/work
```

`--books` omitted: default original PDF/source manifest retained.
Exactly one finalize, exit0:

```text
[finalize] 6p p0157: 10 blocks /16 body rows (16 printed),1 figure,0 normalizations
fig-152 -> [213,658,1109,442]
row/charset/formula checks passed
```

The original stdout is177bytes, SHA256
`252605bf10ef48869f5abe2856281fc3690aa20acc212e5ee8d5a6c2047261a0`;
stderr empty. Exact original output and argv are
`evidence/0157-finalize-1.{stdout,stderr,call.json}`.
Both child commands were launched through the scratch-only
`evidence/run-recorded.py`, which refuses to overwrite prior evidence.

## Exact New Bindings And Delta

New artifact directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-157-counter-repaired/artifacts/6p/pages/0157`

| File | Bytes | SHA256 |
|---|---:|---|
|page.md|2527|`b381005d791ecdc8c8441391ee151b0bc5c52983cbd26162354909b0eb1d73a7`|
|page.json|4624|`ecfff7ff392f2aab8ed931c9b9b2d6d7f5c444cc060a6b57408f89133f4c172c`|
|audit.json|419|`ef9fa12944b97da64f58ac24a33cff7acae3df6f0ebe2d947d3b57563b1aa239`|

MD and JSON are byte-identical to the author freeze. Audit changes only
`lines_printed:15 ->16` and the original row-mismatch `errors` array to `[]`.
All audit figure geometry/component/from metadata and other fields remain equal.

All six copied work files are byte-identical: original PNG, grid, template,
historical prepare layout, final fig152 PNG and SVG. The old prepare layout is
retained as historical evidence, not presented as a newly computed layout.
Final fig152 box `[213,658,1109,442]` and1133x466 crop dimensions unchanged.
Official finalize recropped its PNG deterministically; bytes unchanged.
No SVG generation or edit:

| Figure file under `work/6p/pages/0157/figures/` | SHA256 |
|---|---|
|fig-152.png|`ab51ebbbf1edd3b248b2fc8f53ba02801a261bd486b3a8e5ce8da121a5b77117`|
|fig-152.svg|`dd8f86b966988885b6a2aea05a9143dd11b4572b257d5c25bb5302a12ce1f849`|

## First Failure And Frozen Handoff

The original15/16 mechanical FAIL remains untouched at
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-156-160/evidence/0157-finalize-1-first-failure`.
All9 files in that first-failure tree and the affected156/157 author files
(25 files total) still match their original frozen manifest bytes/hash.
No158/159/160 pixels, content or gates were replayed.

Original author manifest SHA256:
`8a42de8925fc702072f448c58dfb5c896ae2b2545f9001e9a0123b2bcaa19921`.
Original failed157 audit SHA256:
`a6744445a6d85a2b27536972414df6a5850c41a7ae5f590c49e1160f99407d65`.

[repair-manifest.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-157-counter-repaired/repair-manifest.json):
21572bytes, SHA256
`ae8b2f5bd23f147e772ee1b84fd5ee32af0bfc7ad03c29777f9e867235781983`.
Contains exact absolute paths/hashes, original/new work pairs, retained first
FAIL bindings, command ledger and exact allowed delta. Generated once by
`evidence/freeze-affected.py`; that is byte comparison, not a gate rerun.

Call totals for157: focused tests1, finalize1, prepare0, vectorize0, assemble0.
No further repair, source fiction,161+, DB, Git, service, dependency, app/schema
or modern/answer/choice writes. Tool sessions closed. Hand back to Ramanujan for
affected-only mechanical comparison; source semantic/crop decisions remain
those of the independent source review.
