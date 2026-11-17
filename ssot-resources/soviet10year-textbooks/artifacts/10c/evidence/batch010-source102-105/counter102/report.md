# STEMROBIN-184 bounded counter sidecar

Status: physical 10c102 defect corrected; supplemental nested-fraction integration
coverage has two unresolved failures. Not an all-green algorithm handoff. WAIT.

## Diagnosis and Patch

The preserved prepatch reproduction returned 17 rows instead of the independently
reviewed 15. In `_single_fraction_row(820, 1032, 35)`, the outer fraction rules were
accepted, and seven formula-body glyphs shared their central row. A detached
component at x1628..1666, y989..1032 failed whole-band glyph-core overlap. The
fraction therefore remained two disconnected bands, and expansion split the
upper band again.

`layout.py:398` now derives horizontal support groups from accepted fraction bars
and full glyphs, with a two-glyph-height joining gap. A remote singleton without
bar or peer support cannot veto a tall fraction; bar-associated glyphs and
repeated glyph groups still participate. Compact fraction behavior is unchanged.
No extra pixel mask, exclusion, count override, page-specific algorithm branch,
source edit, invented wrap, or semantic/source re-review was introduced.

Code changes:

- `.claude/skills/ld-s10y-lesson/tools/layout.py`
- NEW `.claude/skills/ld-s10y-lesson/tools/test_layout_tall_nested_fraction.py`

The new test is reusable without source scratch: its default mode checks the
synthetic arrays only. Its optional `--page`/`--baseline` mode also reproduces the
specific physical-page criterion and checks protected-file hashes.

## Evidence

Exactly one prepatch reproduction and one postpatch targeted test/reproduction
were run; both exited 1, for different reasons. The postpatch exit 1 must not be
reported as a pass.

- `layout.prepatch.py`: exact incoming code.
- `first-finalize/`: preserved parent's first failed finalize, including exit 1
  command and 17/15 audit.
- `reproduce_before.py`, `before.json`: independent reviewed count 15, actual 17,
  component support trace, and original source/durable hashes.
- `layout.patched.py`, `layout.patch`: exact patched code and complete code diff.
- `test_layout_tall_nested_fraction.py`, `test.patch`: exact new test and new-file diff.
- `after.json`: complete postpatch results and protected-file hashes.
- `commands.json`: reproduction commands, exit codes, and execution limits.

Postpatch results:

- Physical 10c102: 15 rows; ex375 is one band y820..1032. All other 14 bands match
  the preserved, independently confirmed preparation layout exactly.
- Fraction recognizer: 10/10 explicit synthetic True/False expectations pass.
- Integrated synthetic row counter: 8/10 pass. All six true-two/three-row
  negatives pass, including a local single-glyph row and a remote multi-glyph row.
- Unresolved positive `nested_fraction`: expected 1, actual 22 bands.
- Unresolved positive `nested_fraction_detached_singleton`: expected 1, actual 3.
  Both are accepted by the fraction recognizer, but not integrated correctly by
  `line_bands`. Expectations and fixtures remain unchanged; no rerun or wider
  fix was attempted after the one allowed post-edit execution.
- Overall combined cases: 9/11 pass; overall report status is `fail`.

The sparse nested fixtures use one 40px H glyph for each nested numerator and
denominator. Their side-stem rows contain eight pixels, at the existing
projection threshold rather than above it. That is a possible scale/projection
interaction, not a proven regression: these synthetic cases were not run against
the old code. It remains unresolved within this bounded run.

Source PNG, source layout.json, and durable page.md/page.json/audit.json all retain
their original SHA-256 values. No page or index was written. No finalize,
assemble, parent progress check, prior passed checks, whole-project test/build,
database, publish, app, dependency, schema, Charter, Git, workflow, or other chat
messaging operations occurred.

Image ledger: model opens 0; crops 0; generated images 0. Native PNG dimensions
1695x2580 were checked by the read-only array-loading commands, with no image
payload returned.

## SHA-256

| Artifact | SHA-256 |
| --- | --- |
| layout.prepatch.py | `0e03889f54d21a3f509e1da1f3d1eebef88d9f531a558a346197c59aada25014` |
| layout.patched.py | `42ad1874279b11ae9e72b1add40eb6617916f0321779167f97a8274fdd1964ec` |
| new test | `a02a9906063fe0fc7ccf3d8af61b76d94c28cf90c2ef8340ac54839d3de4baea` |
| before.json | `ad992d7d8e6483951f26782b6dafc0fb9a00974e7750e3a68a2b6d619bfa1b9b` |
| after.json | `a7a2136d2eb01bb2187e086e5139fc889b63fd68345d63f92da3d4b99ee03d78` |
| layout.patch | `c9a97fb0eb32dfc2024606f94bc2bd429b46fe0aa1d0b791649a4bb764a11ee4` |
| test.patch | `676be350ef68b5aea5ea3edaa5baa476eb438a49fdff9b6b236b60fc7697a703` |

Parent owns the affected-only finalize102 retry. This sidecar has not finalized
or established all-green supplemental integration coverage and is waiting.
