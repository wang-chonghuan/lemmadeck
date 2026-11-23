# 180-7 p0158 counter repair

Scope: STEMROBIN-180; only this counter defect. All commands used explicit
workdir `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.

## First failure retained

Before edits/finalize, copied the existing failed `audit.json` once to
`audit-counter-first-failure.snapshot.json`: printed 28, Markdown 27.
SHA256: `3b2929bcf748877362cd11219236f2a115167c9a3e084642f416eaf00b6d177c`.
Historical B76 remains in the existing STEMROBIN-180 checkpoint, unchanged.

## Cause and minimal change

The isolated right-margin blot occupies x1610:1652, y581:616 (exclusive stops).
The fractional cutoff was 0.95 * 1695 = 1610.25, so x1610 missed removal.
Its ink overlapped the formula's bottom projection, extending 487-584 to
487-615. Fraction recognition then failed; the next body row joined it and
the combined 487-673 band expanded into three rows.
`layout.py` now floors that right-margin pixel cutoff. All existing blot
shape, density and isolation guards remain. No page-specific count override.

## Actual verification

- Focused `test_line_bands_fraction.py`: old code exit 1, 2/4 failures;
  repaired code exit 0, 4/4 passed (single tall fraction, isolated blot,
  fraction plus body, true separate body rows).
- Two read-only diagnostic assertions exited 1: the actual next body starts
  at 628, not the supplied 629; removing another margin blot changes the
  1672-1781 boundaries, not its two-row count. These were probe expectations,
  not finalize failures; no pixels or source text were altered to satisfy them.
- Actual repaired first five bands: 248-295, 331-376, 414-458, 487-584, 628-673.
  True two-row controls: 1672-1711 / 1743-1781; 1876-1929 / 1930-1982.
- Exactly one repaired finalize: `p2c.py finalize --book 8p --page 158`,
  exit 0; 10 blocks, printed 27 / Markdown 27, errors empty.
  Final audit SHA256: `f3ca4658865be4bdb55ed2eb1cbcd31349c89cd24e286705e821cee0a376a20b`.
- `page.md` unchanged SHA256:
  `33a2a8b96ccbab9adab2c903751ef010ab6b290a0924b32c29765dce51546d11`.
- Source `.tmp/ld-s10y-lesson/8p/pages/0158/page.png` visually loaded once,
  no reopens/crops; image context 1/24, assignment 1/4. Source SHA256:
  `f9a23b05878086191be10b9d56b51341625f87fe6b54a7ad4f316511b921af8e`.

Code SHA256: `33c4211baf7c18f14503678d02a8ddd7ea4c28910e608bd0f54109b277abcc5e`.
Test SHA256: `75d79e1504ab103dd4f2722def33063873d69bd465519271113a7fce45883039`.
No p0159 work, DB, paid call, messaging, commit or new tree/branch/chat.
This is counter verification only, not a source or mathematics PASS.
