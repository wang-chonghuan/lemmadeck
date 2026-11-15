# STEMROBIN-184: Independent Transcription Review 007

Reviewed 2026-11-15. Scope: book `6-8g`, physical pages 32/33/34, printed pages 22/23/24.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Paths below are relative to this workspace. Line references refer to the hashed Markdown snapshots below.

Read the lesson skill and `profiles/soviet-cn.json`, then each actual `page.png` before that page's persistent `page.md`. Inspected enlarged regions and all five existing source figure crops. Did not consult prior reviews, answers or choices. No network, installation, environment inspection, database access, finalize or pipeline writes. Only this report and permitted review crops/overlays were written. Input hashes were unchanged on the final reread.

## Concrete Findings

1. **p33: missing shared-row flag, not missing prose or a counter defect.** `pages/0033/page.md:98` is `<!-- cap 图 25 -->`. Its caption shares the printed row with the final prose line `一段．` at line 93. Smallest remedy: `<!-- cap 图 25 samerow -->`. Keep the five prose lines and the complete caption.
2. **p34: missing shared-row flag, not a counter defect.** `pages/0034/page.md:92` is `<!-- cap 图 27 -->`. Its caption shares the printed row with the final given-statement line `线．` at line 87. Smallest remedy: `<!-- cap 图 27 samerow -->`. Keep both given-statement lines and the complete caption.
3. **p34: three substantive transcription errors in the opening paragraph, plus list punctuation.** The source row at y=211..253 ends `图26的а、в、г上画出的`; Markdown line 55 has `图26的а，б，г上画出`. Restore the missing final `的`, replace `б` (U+0431) with `в` (U+0432), and preserve the source enumeration commas `、`. The source row at y=355..393 reads `26б、д不是简单折线．`; line 57 has `26в，д不是简单折线．`. Restore `б` and `、`. These are pixel-confirmed miscopies, not textbook errata. No line insertion or rewrapping is needed.
4. **Separate profile encoding defect on all three pages.** `profiles/soviet-cn.json:15` requires `sentence_period: "."`; the body uses U+FF0E `．`, not ASCII U+002E `.`. There are 36 occurrences: p32=11, p33=10, p34=15. Smallest profile-compliant remedy is replacement of those sentence-stop codepoints only, without touching decimal points or line structure. This does not explain either count mismatch. `normalize.py` currently does not apply `sentence_period`, and its charset range accepts U+FF0E, so empty normalization/charset audit arrays do not establish profile compliance.

No further lexical, numerical, formula, subpart, or figure-boundary defects were found within these three pages. p32's 18/18 is independently supported; it needs no count remedy.

## Pixel Geometry and Count

Coordinates are original 1441x2079 pixels, zero-based. Ink extents and y bands below are inclusive; figure boxes use `[x,y,w,h]`.

| Page | Body lines before remedy | Independent horizontal printed rows / current counter | Shared-row source ink geometry |
|---|---:|---:|---|
| 32 | 18 | 18 | Caption 23: x=670..773, y=1111..1140. Following prose starts y=1186: not shared. |
| 33 | 24 | 23 | `一段．`: x=176..269, y=1859..1907, including its wavy emphasis; caption 25: x=961..1065, y=1873..1903. Both lie in counter band 22, y=1859..1906. |
| 34 | 22 | 21 | `线．`: x=149..197, y=1592..1627; caption 27: x=951..1055, y=1599..1627. Both lie in counter band 16, y=1592..1627. |

Complete observed counter y-band sequences, reproduced from the existing `line_bands` on source ink after masking only the existing figure boxes (no new exclusions):

```text
p32 (18): 216-255, 285-329, 354-393, 425-464, 493-532, 563-602,
          1111-1140, 1186-1228, 1255-1290, 1382-1419, 1451-1494,
          1520-1558, 1590-1631, 1659-1700, 1727-1769, 1796-1838,
          1866-1907, 1940-1965.
p33 (23): 204-246, 274-315, 527-556, 584-629, 657-698, 726-757,
          795-838, 862-906, 930-976, 1001-1046, 1069-1111, 1139-1180,
          1207-1253, 1276-1323, 1345-1392, 1416-1458, 1514-1552,
          1584-1625, 1653-1694, 1722-1763, 1790-1832, 1859-1906,
          1946-1968.
p34 (21): 211-253, 280-322, 355-393, 765-793, 834-872, 903-942,
          971-1021, 1039-1089, 1109-1157, 1178-1227, 1246-1300,
          1301-1355, 1384-1422, 1453-1491, 1522-1560, 1592-1627,
          1661-1698, 1730-1768, 1797-1837, 1868-1906, 1945-1967.
```

The p34 theorem's thick vertical marker joins two actual text rows in projection. Text excluding the marker occupies y=1246..1289 and y=1316..1353; the marker occupies x=230..253, y=1245..1356. The counter correctly represents these as two bands, not one. Its marginal `12` is on the first theorem row. Equation label `(1)` shares the final displayed formula row. Wavy emphasis strokes, page-top black borders, marginal scan traces and section rules are not additional prose lines.

`p2c.py:319-336` masks figures and compares `len(layout.line_bands(...))` against `blocks.printed_lines`. `blocks.py:109-119` excludes figure blocks from the text tally and subtracts the caption's line count when `samerow` is present. The intervening figure block therefore does not require relocation. In-memory copies with only the two caption flags produce p32=18, p33=23, p34=21. These results agree with independently inspected print rows; no expected count was supplied to the counter.

## Coverage and Figure Boundaries

| Page | Full source-to-Markdown coverage checked |
|---|---|
| 32 | Opening continuation and cases 2/3; both sign cases and both complete distance identities, including every absolute-value bar, sign and subscript; four diagram references а/б/в/г; proof-ending triangle; exercise heading; all of 63, all of 64, and the printed opening of 65; caption and foot. |
| 33 | Continuation 65(2) and all six distance terms; 66; every 67(1) pair and а..е marker, every 67(2) pair and а..в marker; starred 68 and both subparts; all six movement cases of 69; section 8 and all five definition rows, with every A-subscript and segment; both captions and foot. |
| 34 | All three opening rows; all five diagram labels; definition with every segment/subscript and `n>2`; vertex/endpoint definitions; length definition; two-row theorem 12; proof introduction, both given rows, complete goal inequality, both proof rows and complete inequality (1); both captions and foot. Opening errors are itemized above. |

All checked letter enumerators are Cyrillic codepoints. The p34 wrong references are wrong members of that script, not Latin-lookalike encoding. No new formula wrap marker is justified.

| Figure | Existing exact mask box | Boundary verification |
|---|---|---|
| 23 | `[434,654,569,418]` | All four number lines, their O/E/A/B labels and а/б/в/г markers are included; caption 23 is outside. |
| 24 | `[461,370,582,126]` | Broken left ruler end, full ticks, visible 5..9 numerals and A/B labels are included; caption 24 is outside. |
| 25 | `[788,1537,447,252]` | Complete four-segment polyline and A1..A5 labels included; no left prose or caption included. |
| 26 | `[146,450,1085,279]` | All five complete subfigures and а/б/в/г/д labels included; caption and upper prose are outside. |
| 27 | `[828,1327,357,231]` | Complete three-segment polyline and A1..A4 labels included; given statement and caption are outside. |

All five existing PNG crops are pixel-identical to source crops with the documented 12px padding in `layout.crop`; padding is not part of the counting mask. No figure-box change, resnap, crop repair, exclusion rectangle or counter-code change is warranted. `page.json` matches its Markdown snapshot after disregarding generated figure `id` keys.

Profile-stop locations (`page.md` line numbers; parenthesized number is the occurrence count on that line):

```text
p32: 45, 48(2), 52, 58, 68, 75, 79, 80, 83, 84.
p33: 55, 58, 69, 71, 74, 77, 80, 90, 91, 93.
p34: 55, 56(2), 57, 68, 72, 75, 78, 79, 83, 87, 96, 99, 100, 103.
```

## Source Hashes

SHA-256 of the actual PDF at `ssot-resources/soviet10year-textbooks/sources/soviet10years/6-8g 苏联十年制学校数学教材 几何 六-八年级.pdf`:
`d06ea093886065380febda597331bb5d48c81303d955161f2f84a7f11c116e5c`.

Raster paths: `.tmp/ld-s10y-lesson/6-8g/pages/<page>/page.png`.
Persistent paths: `ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/<page>/<file>`.

```text
0032/page.png  525d9e772b19270564116d2f21e17e7b5e14abc10c91f7d2d29d85c702d0af02
0032/page.md   4da5e4c44e99eca54a6143e78775a82b074cba41e224e361f10105be8fa4ce77
0032/page.json f9bfa8d3b269602b5449a09e22e324155dfff1ec9837464be2d7015be95e7382
0032/audit.json 4bdb3408f3e5f435a26e4b2bd01bd7916c5d7c4c7aacc39f97f3e41a88bfba38
0033/page.png  31da3198958d338c61d7c005b68ffd61e99b01211644980a190b5ac54fe6bdcc
0033/page.md   cdc1ebf5ac5eab556773da3d203bdf8a999e636fe61ac45aa036ea8c7849e5b3
0033/page.json 4670497ef73542c6508111d73de791aa1a74a21ce8fad9cb67c75de99c6b7090
0033/audit.json f809030dfc06a3cd24a44ae451119ea53191e4f1a8e4f63ef4885e77d605f5f0
0034/page.png  4df44b4d587b31c0a4f1cb2f1e4ffd2787b4bc3e66a5ec3ebb826cc46f4d8641
0034/page.md   96a5f72cbc503296353d175b81fd45a16c04be550fb81ccadeb59969e13ee898
0034/page.json 7a4af9c4e42a1be69c07a8af852dcf44e266b72d01ef896e9b2bbf9e7d87415b
0034/audit.json 0cbbdb4e0b69c47fd7f32fcae1d219ffa34aa13235386420a1b7d468efbcb5bb
```

Reviewed rules/code paths under `.claude/skills/ld-s10y-lesson/`:

```text
SKILL.md                4cf89f8448aeeab992340aef218c1a5188ca6880019003c8de567f00e93d456d
profiles/soviet-cn.json dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849
tools/layout.py         039827dcd798d8ed1fd173368bce5179595c17fe335482dd15f4a3b4ab2d321a
tools/blocks.py         1b6540373067b80cdc34ab7973a26ccfc1b21b62f655139731f16408ea072b66
tools/p2c.py            edce2ee6e293216cde3fb067115b64121cf7c2030358943c563c68ef9431c1df
tools/normalize.py      65db6b013806f0dd9de0a739e09714c8cdfaebd8f9cb41c4edcb5e242beae29f
```

Review evidence in `.intentfold/tickets/STEMROBIN-184/tmp/`: `review007-p0032-row-overlay.png`, `review007-p0033-row-overlay.png`, `review007-p0034-row-overlay.png`; `review007-p0032-top.png`, `review007-p0032-lower.png`, `review007-p0033-exercises.png`, `review007-p0033-shared-row.png`, `review007-p0034-opening.png`, `review007-p0034-lower.png`. Overlays visualize existing masks/bands only; source pixels are unchanged.

## Proposed Smallest Valid Remedy

Parent author: add the two caption `samerow` flags; restore the p34 opening word, reference letters and enumeration commas; normalize the explicitly listed U+FF0E sentence stops to the profile's ASCII period. Preserve every existing printed line and all five exact figure boxes. Let the normal authoring/finalize path regenerate metadata and audit rather than manually setting any expected count. No repair was promoted or applied by this review. Stop here.
