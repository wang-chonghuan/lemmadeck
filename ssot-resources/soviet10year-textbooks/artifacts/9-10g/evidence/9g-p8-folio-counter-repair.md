# 9-10g P8 Narrow Folio Counter Repair

2026-11-15. Source author Confucius and independent source reviewer
Banach both observed21 real printed rows, including one `dot 1 dot`
folio. Their initial machine audit was20/21 FAIL. The independent
source review and local diagnostic crop precede this repair.

Parent actually opened the original-pixel diagnostic crop
`tmp/9g-p8-folio-diagnostic.png`, source box `[0,1948,1300,85]`,
SHA-256 `7b0adcc6c394e4c9586bfeb35ed05e5a2a6b58b59d01d6b194bf614b9da15c05`.
It shows the complete folio and isolated left-side specks, not a
missing printed body row. Parent reproduced the current20 count once
on the original PNG: existing folio recognition fails on projected
rows1974--1985 and passes on the full glyph rows1965--1992.

The source-supported candidate noise box at x197/y1984 is not inside
the permitted outer5% of the1506x2126 image. No exclusion was
registered, no interior ink was masked, and no expected count was
overridden. Removing a source foot block or adding a fictitious line
would be wrong.

## Minimal Change

Only the final thin-bottom-band decoration filter in `layout.py`
changes. For that limited case, full extents of intersecting non-speck
connected components are supplied to the existing `_decorated_folio`
predicate. A recognized folio is not thrown away as a broad decorative
band merely because unrelated specks widen the clipped projection.

The folio predicate, row merge/split/fraction algorithms, source pixels,
crop algorithm and source transcription are unchanged. New tests derive
the expected behavior from synthetic printed body rows, a narrow serif
digit with two ornaments, and non-text negative controls.

Focused verification:4 new clipped-folio tests,5 decorated-folio tests,
6 compound-fraction tests and3 short-numeric tests PASS. Four optional
source-render subcases in the existing compound-fraction test are
SKIP because their local fixtures are unavailable, not claimed tested.
No full project suite was run; that remains for formal handoff.

Actual subsequent `finalize --book 9-10g --page 8` ran once and
passed21/21,9 blocks, no normalization, no exclusions. Complete source
MD and page JSON remain byte-identical to the independently reviewed
initial files. The audit changes only `lines_printed:20->21` and
`errors:[]`; restoring those fields in memory reproduces the entire
initial audit. Initial failure/source files remain in
`tmp/source-9g-p8-initial/`.

## Current Hashes

| Artifact | SHA-256 |
| --- | --- |
|Source MD|`5fbb2ca6c412bb0255b3c094ca7142c75e2cf4051b0f5f02b41cc1ce761456d4`|
|Source JSON|`185e13a5fa2618d9fc406ea145db7fa16677d3849764990eee9a206ac415e65a`|
|Actual PASS audit|`766c14af3d9f2eb9fa88e542926e6792ed7abe01cdf6315b3a9debbcbcd3c0c8`|
|layout.py|`7b9fa08b4757dc2c12b8527dc8d2d0042c596786a3b1997b13c0b0f886167f67`|
|New synthetic tests|`69ad4c27262c253838824ab778bf70c014886d6d4ba4d34c0c5e57abfe289494`|

Pages9--11 retain their first passing audits and source reviews. No
repeat source/math/figure/display review, DB, publisher or dependency
operation was performed.
