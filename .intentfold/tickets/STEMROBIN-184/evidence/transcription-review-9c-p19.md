# 9c Physical Page19 Independent Transcription Review

Ticket: STEMROBIN-184. Scope: this original page only, physical19 / printed12.
The actual clean300dpi PNG was opened before the durable page.md.
No neighboring source page, modern text, mathematical answer, choice or other
review was read. No finalize, assembly, browser, DB or source edit was run.

**Transcription content: PASS. Current mechanical audit: FAIL23/22 solely
because the bottom scan-edge line is counted.** No missing text or duplicated
formula was found. Parent retains finalization and source-edit ownership.

## Printed Words And Glyphs

- Exercises15 through21 are present in full; exercise22 begins on this page.
  No section heading or source figure occurs. Right-margin ink blobs are
  unlabelled scan marks, not diagrams.
- 15 reads `k∈N`, `k^5-k`, and30. 16 has its full stem plus Cyrillic
  `а)` and `б)`. Its first formula has the initial1, then2, then `2^2`,
  through `2^(n-1)`, and the printed right side `2^n-1`.
- **16б) damaged numerator:** actual source pixels show `n^2(n+1)^2/4`.
  The glyph between the inner n and1 has a horizontal stroke and short
  vertically aligned ink remnants both above and below it. The enlarged
  nearest-neighbor crop makes these separate vertical remnants visible.
  This supports a worn plus, not an intact minus. The durable `n+1` is
  accepted from those pixels, not by reversing the identity or checking a sum.
  No mathematical erratum should be invented from the damaged glyph.
- 17 retains `c_1=2`, `(n+2)/n` multiplying `c_n`, and a separate
  printed "证明：" line with `c_n=n(n+1)`.
- 18 retains `x_1=1`, a minus before `1/[n(n+1)]`, and the next printed
  line "给出. 求 x_n 的公式.".
- 19 has a two-line stem, `c_1=1`, `c_(n+1)=c_n(n+1)`, and one separate
  product formula. 20 has one stem row, one tall-fraction recurrence row,
  and one requested-formula row; its initial value is2/3 and its recurrence
  denominator is `(n+2)(n+3)`.
- The two-line exhead precedes21: "利用数学归纳法证明下列各等式对于任意自然数 n 都"
  followed by "成立：". The starred21 and22 labels and the two Cyrillic
  subparts of21 are preserved. The printed21 formulas match the durable text,
  including the minus in `2n^2-1`; no answer-based formula repair was performed.
- **22а) actual break:** the first printed row ends after
  `n(n+1)(n+2)` with no equals sign. The next row begins with `=`,
  followed by `1/4 n(n+1)(n+2)(n+3)` and a semicolon.
  The durable single formula with `↵` immediately before `=` represents
  exactly these two printed rows. It must not be duplicated or flattened
  into a one-row count.
- `<!-- ex 22 open -->` keeps the unfinished exercise open; the а) formula
  itself is complete. The parent supplied the next-page `22 cont` boundary;
  no next-page image was needed or inspected here.
- Folio is the one printed row `· 12 ·`, with an actual round dot on each side.

## Independent Row Inventory

Each high fraction is one mathematical print row, not separate rows for its
numerator and denominator.

| Source object | Actual printed rows |
| --- | --- |
| ex15 | 1 |
| ex16 stem + а) + б) | 3 |
| ex17 stem + recurrence + proof statement | 3 |
| ex18 recurrence stem + requested formula | 2 |
| ex19 two-line stem + product | 3 |
| ex20 stem + recurrence + request | 3 |
| exhead | 2 |
| ex21 а) + б) | 2 |
| ex22а), broken before equals | 2 |
| folio | 1 |
| Total | 22 |

Thus there are21 body/exhead/formula rows plus one folio row, matching
the durable block count22. No `samerow` or figure/caption ownership is needed.

## Exact Counting-Only Scan Exclusion

Observed current audit: `lines_printed=23`, `lines_md=22`; no other error.
Prepared layout's final line band is `[2353,2380]`.
The direct bottom crop shows a continuous irregular scan/page-edge black strip,
not glyphs, a formula, a caption, a footnote or a source separator.

Safe proposed record, for parent consideration only:

```json
{
  "kind": "scan-artifact",
  "box": [0, 2330, 1695, 51],
  "reason": "Bottom scan-edge black strip only, including detected extra band y2353..2380. All actual text ends at the folio band y2163..2191; this full-width crop lies below it with a blank gap and contains no body, formula, caption or folio pixels."
}
```

The box uses `[x,y,w,h]` on the actual1695x2381 PNG and ends exactly at
the image bottom. It is not an instruction to modify source pixels.
Only a counting-copy exclusion is justified. The right-margin blobs already
merge into existing row bands and need not be broadly excluded to fix this
specific extra row. No counter override or expected-line manipulation is proposed.

## Actual SHA-256

Source and durable snapshot:

- `.tmp/ld-s10y-lesson/9c/pages/0019/page.png`:
  `6227d6f7f08d822ad0da54ccd4edfdb0b89c95ea494a8c9da4e079cd122f8db9`
- The same scratch page's `layout.json`:
  `5676ae4966f28a583a450417fa9ccd2d69121d898cd27efb19d5f65cf164fbef`
- `ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0019/page.md`:
  `0528038f9dbd13ab330968c6fb0b476ee3968e04d60a27a19047ae38daa5022e`
- The same durable page's `page.json`:
  `4120be09bb73bc879e3eda095bd91c38854c0264c8f95f934ab66f355a8f5ff3`
- The same durable page's failed `audit.json`:
  `56c575c262c28d8aad54e115d9a12fcb898967502e699b9357d1c80f82ae1132`

Direct-source crops are retained under ticket
`tmp/transcription-review-9c-p19-crops/`:

- `16b-numerator.png`, source box `[715,400,247,125]`, unchanged pixels:
  `aadd4fadfbf5612e0a77cd9d6b5fc20001962a3d4463568a3691af90567b3656`
- `16b-sign-8x.png`, source box `[832,414,38,49]`, nearest-neighbor8x only:
  `6f37281911a2b41c7f17fb9c51ed199b2616491e36f6d4b93e258fd9f06fa2c4`
- `22a-break.png`, source box `[90,1915,1265,220]`, unchanged pixels:
  `1fefe5b7a6d63689f80234b74c3b7991a421a18c09665fc7989ebe1f7a8d7973`
- `bottom-edge.png`, exact proposed box `[0,2330,1695,51]`, unchanged pixels:
  `84722d3235110b82be0c29f8da2912ac0e0014d7bf4fe11c799684e79b9a48ce`

No durable file was edited. The complete faithful transcription should be
preserved while parent addresses the single counting-only scan artifact.

## Metadata-Only Follow-Up: Current PASS22/22

The statements and failed hashes above describe the initial reviewed snapshot
and remain preserved. Parent subsequently added the exact previously justified
`scan-artifact` box `[0,2330,1695,51]`. This follow-up read metadata and audit
only; the p19 scan and crops were not reopened, and no finalize was run here.

**Current conclusion: transcription PASS; current audit PASS22/22.**
The current audit has `lines_printed=22`, `lines_md=22`, this one exclusion,
and empty `errors`, `normalizations`, `unknown_chars` and `katex_warnings`.
There are still no figures or errata.

Exact unchanged-content verification was performed entirely in memory:
remove only `count_exclusions` from the current MD front matter and serialize
its JSON with the existing two-space formatting, leaving the body bytes intact.
The reconstructed MD SHA-256 is
`0528038f9dbd13ab330968c6fb0b476ee3968e04d60a27a19047ae38daa5022e`,
exactly the initial reviewed MD hash above. Likewise, removing only
`meta.count_exclusions` from current `page.json` reconstructs
`4120be09bb73bc879e3eda095bd91c38854c0264c8f95f934ab66f355a8f5ff3`,
exactly the initial JSON hash. Thus all body/formula bytes, block boundaries,
and other metadata are unchanged. No reconstructed file was written.

Current actual SHA-256:

- Source PNG, unchanged:
  `6227d6f7f08d822ad0da54ccd4edfdb0b89c95ea494a8c9da4e079cd122f8db9`
- Scratch `layout.json`, unchanged:
  `5676ae4966f28a583a450417fa9ccd2d69121d898cd27efb19d5f65cf164fbef`
- Durable `page.md`:
  `18977f66ea8d5cce4aa3b0c6c59a5239a16eed5ee6084237ae404e7f0265cc2d`
- Durable `page.json`:
  `53b6a640cbfcafb497c4b4d13d744eb11da44b487b61cf9a770e57f09348a109`
- Durable passing `audit.json`:
  `0b2f7496935d600a4502f394c310e17e7ef9fb22c38c99bf505bd59444f91b98`

Only this report was updated. The initial FAIL23/22 and the original no-body-
pixels justification remain the historical basis for the accepted exclusion.
