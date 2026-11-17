# STEMROBIN-184 Selected Nested-Fraction Repair

Status: both previously failing integrations pass after one focused repair.
WAIT. No finalization, publication, or new workflow.

## Diagnosis

`comparison.json` records exactly one execution of each affected integration
against the original `layout.prepatch.py` and the preserved before-repair code.
Both versions returned the same incorrect counts: 22 for `nested_fraction`,
3 for `nested_fraction_detached_singleton`. This is an existing integration
defect, not a regression introduced by the first fraction-support patch.

Both fixtures are valid one-row nested fractions. Their complete body glyphs
are 40px tall, but sparse side strokes put only eight pixels on some projection
rows. The projection retains shorter cross-stroke fragments and estimates body
scales of 4px and 22px. The normal glyph-height selection then finds no supported
components; full-glyph recovery and fraction joining cannot work at those scales.

The fixture bytes, geometry, and one-row expectations were not changed.

## Repair

`layout.py` adds `_fragmented_body_scale`, used only when the initial scale has
fewer than three supporting glyph heights. At least three coherent, larger full
components must satisfy glyph-like aspect, ink-area and non-arrow conditions.
Thin rules cannot establish the body scale. The component-derived floor is kept
across the later projection refresh, so the existing narrow-glyph recovery can
recover all parts of the nested fraction.

The first repair's `_single_fraction_row` change is untouched. No page-specific
algorithm branch, expected-count override, pixel edit, added mask, exclusion,
wrap, source row edit, or fixture weakening was introduced.

The new test now supports `--case` and `--integration-only`; selected mode skips
the already-passed direct recognizer assertions rather than rerunning them.
The omitted assertion is recorded as unchecked, not as newly passed.

## Commands and Results

Run from `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

Diagnostic comparison, run once, exit 0:

```sh
.claude/skills/ld-s10y-lesson/.venv/bin/python -B \
  .intentfold/tickets/STEMROBIN-184/tmp/production-counter10c102/repair1/diagnose_selected.py
```

Affected integrations and new fallback guards, run once after repair, exit 0:

```sh
.claude/skills/ld-s10y-lesson/.venv/bin/python -B \
  .claude/skills/ld-s10y-lesson/tools/test_layout_tall_nested_fraction.py \
  --case nested_fraction --case nested_fraction_detached_singleton \
  --integration-only --scale-invariants \
  --report .intentfold/tickets/STEMROBIN-184/tmp/production-counter10c102/repair1/after-selected.json
```

| Selected Case | Original | Before Repair | Repaired |
| --- | --- | --- | --- |
| nested_fraction | 22 | 22 | 1, y20..283 |
| nested_fraction_detached_singleton | 3 | 3 | 1, y20..293 |

Both arrays are unchanged. Their exact original fixture SHA-256 values still
match the diagnostic comparison:

- nested_fraction: `1869cb475ffdbabc339ee326c2b4aa3ef3df084a5b508294f19d64da751a2fcc`
- nested_fraction_detached_singleton: `fbbf18b7d3874d91e88bfb687e5e895980963651c9a96e730d96c6ee3abc1b6a`

Two new helper-level guard checks also pass: an already-correct 40px body scale
returns no fallback, and three thin rules cannot establish a full-body scale.
These checks address the new fallback's risk of changing correctly scaled inputs
or mistaking fraction bars for glyphs. They do not repeat a previously passed
integration, recognizer, or physical-page check.

This continuation ran zero direct recognizer checks, zero physical102 counters,
zero of the six previously passed negative integrations, and no wider tests.
No new combined all-case run is claimed. Earlier passing results remain their
original evidence, not results from the final code. Parent owns any affected-only
finalize102 retry.

## Additive Provenance Correction

The earlier `report.md`, `before.json`, `after.json`, `commands.json`, snapshots,
and patch files remain unchanged, including their original provenance wording
and failure statuses. They must be read with this correction:

- The 15-row physical102 count was parent-supplied as independently reviewed,
  not established by a new direct-human or child-side pixel review here.
- The other 14 coordinate ranges are prepared machine bands protected as
  unchanged by the first reproduction; they are not new direct-human pixel
  confirmation.
- Current test comments and `requirement_basis` qualify that provenance.
  The selected run did not access or verify the physical page at all.

## Saved Artifacts and SHA-256

All paths below are relative to this `repair1/` directory. `layout.complete.patch`
is cumulative from the original incoming algorithm; `test.complete.patch` is the
complete new-file diff. `*.repair.patch` contain only this continuation's delta.

| Artifact | SHA-256 |
| --- | --- |
| layout.before-repair.py | `42ad1874279b11ae9e72b1add40eb6617916f0321779167f97a8274fdd1964ec` |
| test.before-repair.py | `a02a9906063fe0fc7ccf3d8af61b76d94c28cf90c2ef8340ac54839d3de4baea` |
| initial-failure.json | `a7a2136d2eb01bb2187e086e5139fc889b63fd68345d63f92da3d4b99ee03d78` |
| comparison.json | `48a0c12fdb5fdf8922b14cad368157300f675607ef767eb55cb749033d2eb5ce` |
| after-selected.json | `1771570f512cd7df66aba3fd8e2a4ee15c91d4657ff42a9a14803113e70ceed2` |
| layout.repaired.py / current layout.py | `79b05100ef659e87d7f93b810e40370966c4b111c949f60008269cdeaa03bfa8` |
| test.repaired.py / current new test | `4d98cf33b6e898741c575b2c00bb471aeb67d5e3a4fb687b8a430ee253826afb` |
| layout.repair.patch | `6f52cdefb1312b46686c2cfa6c42ebcedfcbcc80008c78b39a4840a76e9a8e0c` |
| layout.complete.patch | `bfe5c4d85a8a6c333cd3ccbfcff4761e97b0a607b5cb363d9a3532e834c1b0eb` |
| test.repair.patch | `ae70af1ee2f841788b94915abc2a331848429e985da9107059cfbd0638cf7930` |
| test.complete.patch | `7dff1ea73e9b9d2186aae38533ddd2c05a5a26292feea948cf5e485dfd6ed334` |

`commands.json` records exact arguments, execution counts and exit codes.
All writes are within the two owned code files and the owned scratch directory.
Source pixels, durable pages, indexes and other workers' files were not written.
No source/semantic review, model image opens, crops, finalization, Git, database,
app, dependency, schema, Charter, or other chat/tool messaging operations occurred.
