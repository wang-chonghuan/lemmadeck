# STEMROBIN-184: Independent p31 Source Audit

Date: 2026-11-15. Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Scope: PDF page 31, printed page 21, book `6-8g`. Read-only source audit.

## Evidence Order And Ownership

1. Viewed the full `.tmp/ld-s10y-lesson/6-8g/pages/0031/page.png` first, at original resolution.
2. Read `ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0031/page.md`.
3. Examined unmodified direct-source crops and independently enumerated the printed rows.
4. Viewed the already-existing `counted-lines.png` only to identify its extra counted band.

No pipeline, tests, counter changes, transcription edits, answer/choice/modern work,
network, `.env` access, or DB access. Wrote only this note and four direct-source PNG
crops in `.tmp/ld-s10y-lesson/transcription-review-006/`. Existing changes were preserved.
The live Plane ticket was not fetched because network access was explicitly prohibited.

## Definite Source Facts

- Proposition 10 actually prints `a` in its first row and `x` in its second row:
  `对于任一非负数 a，在已知射线上有且仅有一点，它到` /
  `射线始点的距离等于 x．`
  Both letters are clear in the source crop. This is a source variable discrepancy,
  not a misreading in the durable transcription. No correction was authored here.
- The proof starts with a solid downward black triangle followed by a separate
  asterisk: `▼* 证明．`. The footnote prints the same triangle:
  `* 符号▼表示供选学的内容．`
  It is not an upward triangle or outline triangle. The initial durable snapshot
  used literal `▼`; a concurrent edit subsequently changed both occurrences to
  `$\blacktriangledown$`. Both representations identify the same source symbol.
- Theorem 11 literally says:
  `定理．坐标直线上两点间的距离等于这两点的坐标` / `的差．`
  The wording does not print `绝对值`. Its separate formula does print absolute-value
  bars on both sides: `$|AB|=|x_B-x_A|$．`
  The durable wording and formula match the source, including this distinction.
- The proof's last printed word on this page is `之`; the sentence continues beyond
  the page. The durable `p open` block preserves that boundary.

## Independent Printed-Row Inventory

These are visual source rows, not a count inferred from frontmatter or the existing
overlay. Math is represented in ASCII/LaTeX; Chinese punctuation is transcribed.
Rows 1-23 are prose/formula, row 24 is the instructional footnote, row 25 is the folio.

```text
01 单位|OE|时，线段OM的长度可以用一个确定的数表示出
02 来：|OM|=x_M．数x_M是射线OA上点M的坐标．反过来，
03 给定一个数x，在射线OA上可以找到唯一的一个点M，使得
04 距离|OM|等于数x．射线的这个重要性质叙述如下：
05 10 对于任一非负数a，在已知射线上有且仅有一点，它到
06 射线始点的距离等于x．
07 3. 你们在五年级里已经学过直线上的坐标了．为了在
08 直线p上引入坐标，要选定这直线上的点O作为坐标原点和
09 选取单位线段（线段OE，图22，б）．以O为始点的两条射线
10 中的一条（即图22，б用箭头号表示的那条），叫做正射线，另
11 一条叫做负射线．于是，对于直线p的每一点都可以指定一
12 个完全确定的数作为这点的坐标：坐标原点（点O）的坐标是
13 0（零）；正射线上任一点A的坐标是x_A=|OA|，负射线上点B
14 的坐标x_B=-|OB|．例如，x_E=1，x_A=5，x_B=-3．
15 这样一来，对于直线p的每一点，都有一个确定的数即这
16 点的坐标与它对应．反过来说也对：对于任意的数x，在坐标
17 直线上有且仅有一点，它的坐标为x．
18 4. 如果知道一条直线上两点的坐标，就可以求出两点间
19 的距离．
20 11 定理．坐标直线上两点间的距离等于这两点的坐标
21 的差．
22 |AB|=|x_B-x_A|．
23 ▼* 证明．分三种情况讨论：1) 坐标原点O在点A和B之
24 * 符号▼表示供选学的内容．
25 · 21 ·
```

Total: `4 + 2 + 8 + 3 + 2 + 2 + 1 + 1 + 1 + 1 = 25`.
All 25 rows are present in the durable transcription. The theorem/proposition
vertical emphasis bars are not extra text rows.

## Definite Counting-Only Separator

The full source shows a thin, broken horizontal rule separating the proof fragment
from the instructional footnote. It contains no characters, formula, numbering,
or body-text fragments. The existing overlay labels precisely that rule as band 24;
its bands 25 and 26 are the actual footnote and folio. Thus its 26 bands comprise
25 text/formula/footnote/folio rows plus one separator, not 26 text rows.

Exact proposed counting-only exclusion, not applied:

```json
{
  "kind": "separator-rule",
  "box": [170, 1822, 440, 14],
  "reason": "Thin broken footnote separator only, between the proof row and the instructional footnote; direct-source crop contains no body, formula, numbering or footnote glyph pixels."
}
```

Coordinates are zero-based pixels of the original 1441 x 2079 render; box format
is `[x,y,w,h]`. Its half-open extent is `x=[170,610), y=[1822,1836)`.
Standalone source-pixel inspection, without importing or running pipeline code:

- Inside the proposed box: exactly 447 black pixels and 5,713 white pixels;
  grayscale values are only 0 and 255.
- Actual separator ink envelope: `x=[177,596), y=[1826,1832)`; width 419, height 6.
- Proof-row ink envelope in its nearby text region: `y=[1722,1770)`.
- Footnote ink envelope in its nearby text region: `y=[1870,1902)`.
- The proposed box has 52 intervening raster rows after the proof envelope and
  34 before the footnote envelope. No body/footnote glyph pixels lie inside it.
- Small isolated specks elsewhere in the intervening strip were observed but are
  outside this box; no broader scan-noise exclusion is proposed.

This establishes a source-based separator exclusion. It does not claim that a
counter was rerun or that finalize passes; those operations were prohibited.

## Direct-Source Crops And Actual SHA-256

Crops preserve source pixels, with no resizing, masking, annotation or enhancement.
`xyxy` crop bounds below are half-open in the original render.

| Crop in `.tmp/ld-s10y-lesson/transcription-review-006/` | xyxy |
|---|---|
| `p31-proposition10.png` | `(170,475,1300,605)` |
| `p31-theorem11-proof-marker.png` | `(165,1500,1305,1775)` |
| `p31-separator-footnote.png` | `(150,1775,920,1920)` |
| `p31-separator-only.png` | `(170,1822,610,1836)` |

Hashes were computed from the actual local files, not copied from frontmatter:

```text
source PDF:
d06ea093886065380febda597331bb5d48c81303d955161f2f84a7f11c116e5c
full page.png:
88addd49cfe2548bcaad9311ec99b5e6bba76f039be9d5ffc45976be19c0a29e
durable page.md, initial read:
cc8b7a52ee0d07293941ec9f390305a0f8e6da963a4b106a67cc05ea6e3dd810
durable page.md, subsequent snapshot reread:
2ca0e38aaa0e63ea2b40e8c06c496ef7bb22bb1e5a26ec5239a7a16181f3e9de
existing counted-lines.png, observed snapshot:
4b0d5f16980b87fa67c1713b0b87614b6a8a3bbc16eedde699af3d1547e7bf2e
p31-proposition10.png:
9324e2bbef5b6b1899640da12a26ee4a9662802d94a9457ae77631f3c657a2c7
p31-theorem11-proof-marker.png:
901abc969b06e07e4d5dca9d2c0bdcf0276712bf0f0d9f7b74fd72e5a9f3cc95
p31-separator-footnote.png:
28533002f08cc9111a8beff1d4d3b3a3bac7c0b30c3a414cc042824132265591
p31-separator-only.png:
b6ad07353c62c99e7b9b76479ccfd1ca4ccfc3c2d0d89bffc81d0d2e3a332e66
```

The durable page changed concurrently during this audit; it was not edited here.
Source-image SHA-256 remained identical on the subsequent hash observation.
Hashes identify observed snapshots, not a lock on another worker's files.
Audit complete; no further action taken.
