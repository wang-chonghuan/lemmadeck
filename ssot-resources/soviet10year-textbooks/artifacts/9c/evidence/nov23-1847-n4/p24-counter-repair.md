# N4 p24 Technical Repair

Latest delegation authorizes this reversible technical repair. This replaces the
old only-p53 repair restriction for p24; it does not release unrelated source HOLDs.

Original source: `sources/soviet10years/9c`, physical page24; prepared PNG SHA256
`f49f7f171441b5a813428e80703e7dd67ef0ebd4842ed98aae65d2311d48aa6c`.
Original failed outputs in `pages/0024/` remain unchanged (25 printed/24 authored).
Independent source/text comparison remains PASS and was not replayed.

The lower envelope [1809,2143] contained four full-glyph-supported projection
groups [1813,1864], [1882,1934], [1950,2040], [2065,2122]. Glyph height44,
line height50 and typical pitch80 caused a sparse connector to inflate the
rounded estimate to five. The exact pre-p53 algorithm also counted25 page rows:
this was not a p53 regression.

The added rule applies only to estimates of four or more, with exactly one fewer
strong group, full glyph support in each group, and every complete glyph's central
half affiliated to a supported group within half a glyph height. It preserves the
existing three-to-two rule. No source/pixel changes, exclusions or count overrides.

First strict candidate: synthetic cases passed, original p24 fixture failed.
Corrected affiliation tolerance: five focused tests passed, including hash-bound
p24, sparse four-row tail, true fifth row, weak fifth row and five normal rows.
The existing 15 layout tests passed before the final tolerance correction;
that earlier run is not claimed as verification of the later change.

One affected native `p2c.py finalize --book 9c --page 24` exited0: 11 blocks,
24/24 rows, zero normalizations and zero figures. Its changed audit is retained
as `p24-counter-repair.audit.json`. This passed stage is not replayed.
Technical source opens: two diagnostics and two real-fixture test opens; codec
internals UNKNOWN. No new model-image opens in this repair continuation.

The exact staged Git algorithm, excluding all unrelated unstaged layout changes,
also passes all five focused cases, including one additional hash-bound original
p24 open. No successful native page finalizer was rerun for this staging check.
All15 existing layout tests also pass on that exact staged final algorithm.

Scoped assembly of pages22-26 exited0: N4 has14 prose blocks and11 complete
exercises32-42. Only N4 was promoted, not the partial N5 boundary candidate.
