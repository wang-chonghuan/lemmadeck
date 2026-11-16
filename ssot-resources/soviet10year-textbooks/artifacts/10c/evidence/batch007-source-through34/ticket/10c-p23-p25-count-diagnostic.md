# 10c physical 23-25: read-only extra-row diagnosis

Date: 2026-11-16. Worker B, acting under the existing STEMROBIN-184 parent delegation.
Final diagnostic snapshot; not a page/content approval or a counter implementation.

## Scope and Observation Order

Reused the unique completed source review
`tmp/source-review-10c-p23-p26.md`, SHA-256
`0b81edb7e4fe94789543a2ba20c7a9db2235dfd7f6740a4361721d1657637a02`.
Its independently frozen expectations are 21/23/24 printed rows for physical
23/24/25. Those expectations were not inferred from this helper's output.
The original review's reduced-resolution/full-page observation limitations remain.
This diagnosis does not repeat or supersede that content review.

Read current production `layout.py` and the actual `p2c.py` counting path,
then current layout/page metadata and retained failure audits. Verified current
source/failure hashes against the frozen review. Ran the existing helper once
per page with exactly the current figure rectangles and current empty exclusions.
Only then created and actually opened three original-pixel local context crops.
No full-page image, page26 notation, tests, browser, answers or choices were inspected.

All diagnostic coordinates below are original 1695 x 2580 page pixels:
boxes are `[x,y,width,height]`; row-band endpoints are inclusive.

## Concrete Findings

| Physical page | Frozen source rows | Current machine/MD | Actual extra machine band | Classification |
| --- | ---: | ---: | --- | --- |
| 23 | 21 | 22/21 FAIL | machine row22, y2470-2491 | bottom scan-edge trace |
| 24 | 23 | 24/23 FAIL | machine row24, y2467-2490 | bottom scan-edge trace |
| 25 | 24 | 25/24 FAIL | machine row22, y2097-2104 | actual footnote separator, not text |

No extra formula-row split is supported by the current execution and frozen row
objects. No confirmed missing-text discrepancy is introduced by this diagnosis.
All three original count failures remain unchanged and unapproved.

### Physical 23

The actual local crop shows the complete dot-17-dot folio, a large blank gap,
then a broken, shallow, slightly tilted bottom-edge trace. There is no printed
text or formula in that lower trace.

- Frozen footer row21 is machine band y2270-2297, ink box
  `[1347,2270,131,28]`, 676 counting-ink pixels.
- Extra row22 is y2470-2491, counting-ink box `[301,2470,1378,22]`,
  825 pixels. Original pixels within that same band have box
  `[301,2470,1379,22]`, 826 pixels; the existing 1% side-edge trim accounts
  for the one-pixel difference.
- Examples of original 4-connected trace components:
  `[1642,2462,38,17]`, area153;
  `[1564,2478,36,6]`, area132;
  `[1601,2477,21,6]`, area75;
  `[533,2487,36,4]`, area44.
  These disconnected shallow pieces occur at different y positions. The
  resulting projection band is thicker than most constituent pieces.
- Current `line_h=46`, `glyph_h=45`, typical gap33, pitch79.
  At the final decoration filter, height22 is not `thin` because
  `22 < 0.4*46` is false. `edge_border` applies only above 2% page height,
  not to this bottom trace. Thus `decoration=False`, and the trace survives.
  No expansion occurred on this page.

Source figure count masks were exactly the existing audit/meta boxes:
fig10 `[383,1201,405,247]`, fig11 `[947,1204,417,244]`.
The shared caption row is one band, y1501-1564, as frozen. The extra row is
not an internal figure label, a caption duplication, or a split formula.

### Physical 24

The actual local crop shows the dot-18-dot folio, isolated small margin specks,
a large blank gap, and a long broken/tilted lower scan-edge trace. The trace
does not contain a printed row.

- Frozen footer row23 is machine band y2248-2278. Its full counting-ink
  box `[151,2248,1412,31]` includes distant marginal ink in the same
  projection band; it is still one band, not the extra row.
- Extra row24 is y2467-2490, counting-ink box `[16,2467,1622,24]`,
  2869 pixels. Original pixels in that band have box
  `[0,2467,1638,24]`, 2909 pixels, before the existing side-edge trim.
- Examples of original trace components:
  `[307,2471,243,7]`, area748;
  `[123,2469,184,7]`, area659;
  `[0,2464,82,8]`, area238;
  `[841,2479,81,3]`, area183.
  Again, individually thin, vertically staggered pieces give a thicker
  page-wide projection envelope.
- Current `line_h=47`, `glyph_h=45.75`, typical gap35.5, pitch82.5.
  Height24 is not thin: `24 < 0.4*47` is false. The top-only border
  condition also fails. The final filter leaves `decoration=False`.
  No expansion occurred on this page.

There are no figure masks or footnotes on this page. The initial k/m formula
remains one band y230-321. The radical/interval display remains one band
y2052-2104. Neither creates the extra row.

### Physical 25

The actual local crop shows the final body clause, a standalone horizontal
footnote rule, exactly two real teaching-footnote rows, then dot-19-dot.
The counted extra band is the rule, not a third footnote row.

- Rule: one original 4-connected component with exact box
  `[232,2097,484,8]`, area2673. It is also machine row22, y2097-2104.
- Previous body row21 ends at y2049; the rule starts48 pixels later.
  First footnote band starts y2149, 45 pixels after the rule's last y.
  The crop directly confirms distinct ownership of rule versus text.
- Current `line_h=44`, `glyph_h=45`, typical gap35, pitch79.
  The rule is thin (`8 < 17.6`), but its width484 is neither
  `>0.3*1695=508.5` nor `<0.05*1695=84.75`.
  Consequently the current decoration predicate is false and keeps it.
- Machine rows23/24 map to frozen footnote rows22/23, with bands
  y2149-2195 and y2196-2243. Machine row25 maps to the frozen footer24,
  y2290-2319.
- The current expansion path produced three genuine two-row groups:
  y1501-1634 -> two prose bands;
  y1840-1958 -> the two initial-condition rows;
  y2149-2243 -> the two footnote rows.
  These match the frozen row inventory. None is an extra formula row.
- T=2pi/omega remains one band y665-753; the radical containing k/m
  remains one band y1355-1454. The bottom trace y2484-2493 is already
  removed by the existing thin-decoration predicate; it is not this failure.

## Complete Band-to-Frozen-Row Mapping

These are recorded helper bands, not newly authored expected counts.

Physical23: machine rows1-21 map in order to frozen rows1-21.
Machine22 is the identified bottom artifact.

```text
229-276, 324-373, 418-467, 498-544, 578-624, 657-705,
738-785, 818-866, 900-943, 984-1019, 1058-1105,
1501-1564, 1588-1641, 1668-1719, 1763-1796, 1841-1895,
1924-1967, 2007-2052, 2089-2143, 2168-2215, 2270-2297;
extra: 2470-2491
```

Physical24: machine rows1-23 map in order to frozen rows1-23.
Machine24 is the identified bottom artifact.

```text
230-321, 363-411, 441-490, 521-569, 600-648, 681-729,
761-808, 829-888, 937-983, 1034-1082, 1113-1162, 1216-1263,
1295-1344, 1397-1443, 1496-1563, 1592-1640, 1694-1739,
1793-1840, 1872-1920, 1953-2000, 2052-2104, 2157-2208,
2248-2278; extra: 2467-2490
```

Physical25: machine1-21 map to frozen1-21; machine22 is the rule;
machine23-25 map to frozen22-24.

```text
258-301, 338-384, 415-467, 497-547, 583-627, 665-753,
797-844, 877-926, 959-1002, 1037-1086, 1118-1164, 1203-1247,
1279-1323, 1355-1454, 1501-1567, 1568-1634, 1662-1716,
1742-1792, 1840-1899, 1900-1958, 2004-2049;
extra rule: 2097-2104;
footnotes/footer: 2149-2195, 2196-2243, 2290-2319
```

## Smallest Justified Recommendation

Do not alter transcription, expected row counts, formula joining/expansion,
or global thresholds for these three failures.

If separately authorized by the parent, the existing explicitly reviewed
non-text-object counting path is sufficient in scope: the p23/p24 trace
components are below y2451, the bottom5% boundary, while their genuine folios
end at y2297/y2278. The p25 object satisfies the existing separator geometry
contract: height8 <= 0.015*2580=38.7 and width484 >= 0.20*1695=339.
Keep original extraction pixels, body, footnotes, folios and figure crops intact.

This report registers/applies no exclusion, deletes no mark, proposes no new
algorithm, and makes no claim about an unexecuted repaired finalize result.
It is not authority to mask any body/formula row. All three FAIL audits remain
the actual evidence pending a separately owned repair.

## Execution and Preserved Bytes

Used an inline read-only Python invocation with:

```text
env PYTHONDONTWRITEBYTECODE=1 .claude/skills/ld-s10y-lesson/.venv/bin/python -
```

For each page: parse current MD; use current audit/meta-identical snapped figure
boxes; construct the same in-memory figure mask as p2c; pass current empty
exclusions to `counting_ink`; derive content width from unmasked original ink;
call `line_bands` once. A Python trace observed local stage/filter values without
altering them. Returned counts matched the retained audits, and `printed_lines`
matched the current MD counts. No finalize, test, speculative exclusion,
threshold change, source edit, model call, browser, network, DB or Git operation.

After diagnosis, all20 input files below matched their opening raw SHA-256:
review1, production2, originalPNG3, prepared layout3, durable MD/JSON/audit9,
existing figurePNG2. The nine durable hashes and three originalPNG hashes also
match the prior source review. No failure snapshot was replaced.

### Input Hash Bindings

Paths are relative to the worktree root. For page rows below:
PNG/layout root is `.tmp/ld-s10y-lesson/10c/pages/`;
MD/JSON/audit root is `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/`.

```text
layout.py f1cf22ba2bf945665bd607fbe2b74adc01006215a39fecf54a1f8d41a6b9e20c
p2c.py    691f50adcd8e3e8b72f035ef0f3521c943b03e30f6d57daa099d40d3b16725e1

0023/page.png    b2f092cd2bac82542ace677f942429734af5a04379c5499cb62c0082b006ca86
0023/layout.json aa6bb529821ae65d7052288b5e3a4afe174825e44df0a11cf3f980aec31acbe3
0023/page.md     91b61ba004f64137b18f89e3ec44c38ec2b9a1ecc51ac0d3c999ac79ab1b505a
0023/page.json   7d1fe15b2a0e9330b3bfcb848f097d513fae358632f9b2fcfbf652e3887428f3
0023/audit.json  48a00ea00515ccc3968812456da7bed935fc8e8961146c2b1845c4fd8e20a148

0024/page.png    47fd3f37eb74d76e56ea798d46f3fb7e72f1e7b66f437327bf8902d8831568bc
0024/layout.json 37b03e3ef2ba28824e1db832251025bfc30e81c2575b39333352be2b15677f86
0024/page.md     d75c66f6f119327cc46bb72b3cdf6cffeafda046987a0b0010657c199401bd0c
0024/page.json   0a5aaee6d6371304187e0f9fc524d5d7f33d540e7389b50115ed4cdaba20b22c
0024/audit.json  0136d5888fcf30fefc24995b70e30fa087d97a6131ddd70120bfc847dc897393

0025/page.png    597d669b9b3c8a8abac3b6d53a27e5c35c7bf8e81150b7dc60b6537c28e64019
0025/layout.json 4bb0517c8987d38a7b7d2e75524df9e1796606dba35910ad510ca2d4d1c4ac18
0025/page.md     d288be73e121b03f67c6dee2d308d64f786775551c5c7f3754eafd8d8d9dd697
0025/page.json   a301516bee69f39a82f6ce69c22d6fb367f6f2097fcb3050655696cdebf8afb7
0025/audit.json  1521154f61eb559da587b6f484db229b47f364652ff33ff8e699f44c5fd2038d

0023/figures/fig-10.png f51e919518420811f91d74e077f174442ec2acdb35346a21914f7a96329b91ef
0023/figures/fig-11.png 4d30e4fe5c3590cc51cc90dace7b72e43a0ccfd23bfd56c6d50805c0b7aa135a
```

Production paths above are `.claude/skills/ld-s10y-lesson/tools/`.

### Actually Opened Local Evidence

All three files are direct, unscaled/unannotated original-pixel crops in
`tmp/10c-p23-p25-count-diagnostic/` beneath this ticket.

```text
p0023-folio-bottom-artifact.png
crop box [0,2240,1695,300]
file SHA-256   dd7e0339936448b35ddae922f6d8147b88ae2abb9b1f894851bf6e59ba2473d6
pixel SHA-256  6bf153cf657b8f21e501752772fe2ca242c08bf6dd57b3a7546e3baef0e3b73d

p0024-folio-bottom-artifact.png
crop box [0,2220,1695,320]
file SHA-256   439d02fd1473ef4abf97efad62771face753aef1cc3069697d30f44e9166a89d
pixel SHA-256  500ec17d2e09c27d5d86d8046092bdc6c6de5fa17927d1c7146d7aa2ac0ec503

p0025-separator-footnotes-folio.png
crop box [200,1990,1340,350]
file SHA-256   c6f8016f921f05581c1a68102b21a19043d1e905de0cec4e9a062c2787383755
pixel SHA-256  0e8a80d7daf3fd37a2647ef5b4f0c1792eabdc7be1b67e6bf1a33404c603a722
```

Pixel digests are SHA-256 of the cropped image array's raw `tobytes()`.
Only this report and these three new authorized local evidence crops were written.
Stop after this diagnosis; no implementation or self-approval.
