# STEMROBIN-181 / D1814 FIRST SOURCE + RAW review

Scope: 10p physical PDF 282–285, printed 272–275. Independent bounded reviewer,
not a producer. Only this review directory was written. No candidate edits, finalize,
Git, environment inspection, database, paid operations, browser, other chats/agents,
or external communications were performed.

Image count: **6 total**, each exactly once: 0282 grid, 0283 grid, 0284 grid,
0284 RAW fig-234, 0285 grid, 0285 RAW portrait. No crops/reopens/screenshots.
Each grid was frozen from pixels before reading its corresponding MD/JSON/audit.
Read the prescribed cap1 and image/background-browser rules first.

## Decisions

| Physical page | SOURCE | Native audit (read-only) | Reason |
|---|---|---|---|
| 0282 | HOLD | 25/25, errors=[] | Lexical drift and semicolon; one unresolved emphasis region |
| 0283 | HOLD | 25/25, errors=[] | Missing comma and lost printed emphasis |
| 0284 | HOLD | 25/25, errors=[] | Added chemical character, lost D subscript, changed punctuation |
| 0285 | HOLD | 26/26, errors=[] | Printed paragraph boundary converted to open/cont merge |

| RAW | Decision | Observed object |
|---|---|---|
| 0284 `fig-234.png` | PASS | Complete original hand-region X-ray plate, no neighbor/caption fragments |
| 0285 `tbl-p0285-01.png` | PASS | Complete unnumbered Rontgen portrait, not a table |

These are snapshot-bound review decisions. Existing finalize exit 0/native counts do
not constitute semantic approval. No new finalize was run.

## Confirmed findings

All findings below occur in both `page.md` and corresponding `page.json.blocks`.
Block references are 1-based; pixel boxes are approximate original-grid `[x,y,w,h]`.

1. **F282-1: wording drift**, `p0282#3`, line 1; MD line 57.
   Source `比较简单和普通的分析法` becomes `比较简单和普遍的分析方法`.
   Source region `[735,808,591,50]`: `通` has been replaced with `遍` and an extra `方`
   added before `法`. This is not faithful SOURCE normalization.
2. **F282-2: semicolon changed to comma**, `p0282#6`, line 2; MD line 70.
   Source `波；光波的能量` becomes `波，光波的能量`.
   Two-part semicolon at approximately `[208,1386,19,45]`.
3. **F283-1: punctuation omission**, `p0283#2`, line 2; MD line 41.
   Source `光谱线的“转换”，在太阳光谱` becomes `光谱线的“转换” 在太阳光谱`.
   The post-quote comma is missing, approximately `[835,334,30,42]`.
4. **F283-2: printed emphasis omitted**, `p0283#5`, line 2 / MD line 59,
   and `p0283#6`, line 2 / MD line 63.
   The source visibly uses heavier emphasis on `最大` (approximately `[596,1270,111,48]`)
   and `看不见` (approximately `[590,1416,155,48]`); candidates contain plain strings and
   no source-emphasis metadata. Other heavier spans in the frozen y≈1201 paragraph need
   exact-scope confirmation; the defect does not require guessing their function-word boundaries.
5. **F284-1: extra character**, `p0284#1`, line 1; MD line 47.
   Source `化学活性` becomes `化学活泼性`. Source `[801,224,207,50]`;
   adding `泼` is an unfaithful rewrite, not medical modernization.
6. **F284-2: comma changed to full stop**, `p0284#2`, line 4; MD line 56.
   Source `玻璃能大量吸收紫外线，所` becomes `玻璃能大量吸收紫外线. 所`.
   Separator near `[1246,735,25,45]`.
7. **F284-3: vitamin subscript omitted**, `p0284#3`, line 4; MD line 64.
   Source `维生素D₂` becomes `维生素$D$`. Source D/subscript region
   approximately `[569,1161,54,46]`, with small 2 at x≈609/y≈1194.
   Preserve the printed 2; do not substitute another vitamin on contemporary grounds.
8. **F285-1: separate paragraph incorrectly merged**, `p0285#3.open=true`,
   `p0285#5.cont=true`; MD lines 56 and 67–68.
   The biography closes with `诺贝尔奖金就是奖给伦琴的.` at y≈895. The independently
   indented, vertically separated next paragraph `伦琴促使自己的发明迅速广泛地应用于医学实践中.`
   starts at approximately `[280,940,854,40]`, below the portrait. It is not an unfinished
   sentence broken by the image. `p open` / `p cont` makes cap2 concatenate these two
   printed paragraphs. Preserve the new paragraph rather than treating the picture as
   permission to erase its boundary.

## Unresolved, not falsely confirmed

- **U282-1**, `p0282#2`, line 5: visible under-dots near `太阳的` at
  `[1040,735,166,66]` have no counterpart in candidate metadata/formatting. Their exact
  left boundary and count remain unresolved in this one viewing; this is a typography
  review item, not an asserted exact-dot inventory.
- The first freeze's 0282 tail `着` is tentative; independent 0283 source continuation
  `续光谱` supports candidate `发射连`. No confirmed tail error is alleged.
- The 0283 separator after `油漆` and 0284 full `伦琴射线` bold extent are not charged
  as defects. See `freeze-clarifications.md` for all initial-freeze limitations.

## Positive checks and boundaries

- 0282 metal names are correctly **铷 / 铯**. Candidate `source_emphasis` correctly binds
  `天蓝色`, under-dot, three dots, to `p0282#1` line 2. Its bold display wrapper does not
  erase the retained SOURCE typography metadata.
- Original `彩图 V，5–8` identity is preserved as `彩图V，5—8`; do not invent a local
  missing image for this reference.
- 0282 heading 107 closes 106; 0283 heading 108 closes 107; 0284 heading 109 closes 108.
  0285 has no new numbered title, and 109 is still open after `放电`.
- 0284 caption `图 234` is external text and correctly `samerow`; 0285 refers to `图234`.
  Its RAW crop retains the complete source field and excludes the caption.
- 0285 portrait has null label and no numbered caption; the `tbl-` ID is not semantic
  evidence for a table. Biography name/dates, figure object, chemical `铂氰化钡`,
  annual-screening wording and terminal open paragraph are preserved.
- Historical medical/safety statements remain literal SOURCE. This review gives no
  modern medical recommendation and does not authorize any edition adaptation.

## Evidence

`review.json` binds the four source grids, four non-viewed base renders, twelve candidate
files, four immutable first freezes, the clarification file, both RAW files/reviews, and
this report by SHA-256. Only the six enumerated image view calls counted as images in
the actual context. Base-render byte hashing was not a visual inspection.

Limited batch complete. No production actions or broader review remain authorized.
