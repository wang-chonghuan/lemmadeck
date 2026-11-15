# Physical p43 Independent Transcription Review

Verdict: **REVISE**. Source-first review of physical page43 / printed page33 only. Opened actual clean PNG, then grid PNG, before page.md/page.json/audit. No answer solving, source-page edit, finalize, assembly, or crop modification.

## Concrete Defects

1. Exercise99(1), page block `p0043#5`, first paired formula row, approximately x300-550/y758-799: the printed expression is `$(AB)\subset[CD)$`, not current `$(AB)\subset[CD]$`. The final delimiter after D is a curved right parenthesis, not a right square bracket. Preserve the printed ray notation, even though this exercise deliberately presents erroneous assertions.
2. Exercise99(2), same block/row, approximately x625-951/y758-799: the printed expression is `$[AB]\not\subset(AB)$`, not current `$[AB]\notin(AB)$`. Its crossed inclusion symbol has no membership middle bar; compare the unmistakable crossed membership symbol in99(6) on the third formula row. Change only the faithfully transcribed glyph, not the mathematical problem.

Both defects occur in page.md and page.json and are repeated in the first metadata note. Smallest valid remedy: parent corrects those two expressions and corresponding descriptive note, then refreshes the page's derived artifacts by the existing pipeline. No correction of the intentionally wrong mathematical assertions is proposed.

Detail evidence: `p43-review-symbols.png`, a 2x crop of clean page coordinates `[220,745,960,950]` (default Pillow resize; not an altered source).

## Confirmed Content And Boundaries

- 95: two print rows; all four subparts present: empty set, point, one original segment, a segment different from both. 96: one row, including "同一直线上" and "并集". 97: two rows, both "圆", with union then intersection and both question marks. 98 starred: two rows, first "两个不同的圆周", second "圆和圆周". No prose/subpart omission found.
- 99: heading plus three paired rows. Remaining four expressions match pixels exactly: `3) $[MN)\in(MN)$`; `4) $A\subset(MA)$`; `5) $[PQ]\not\subset[QP]$`; `6) $[AB]\notin(CD)$`. Do not replace membership/subset symbols or bracket types to make these statements mathematically true.
- 100: two two-row subparts; first union is 圆/intersection is 三角形, second union is 三角形/intersection is 圆. Both end "画出这两个图形." and the line breaks after "这两" are faithful.
- Section10 begins here as `10. 区域`, below the horizontal separator (approximately y1238-1248); exercises95-100 belong before this boundary. The separator is not a prose row.
- First section10 paragraph is exactly six print rows, approximately y1373-1758: "圆周将平面上不属于它的" / "点的集合分成两个集合（图" / "46）.其中一个集合的点离圆周" / "中心的距离小于圆周半径，而" / "另一集合的点离圆周中心的距" / "离大于圆周半径." No omitted character or altered less/greater relationship found.
- Caption46 (approximately x952-1068/y1728-1760) shares the paragraph's sixth print row. Its `samerow` flag is correct; no extra prose row should be invented. The following two-row paragraph starts approximately y1785 and ends `性质：` around y1855-1894; `p open` is appropriate because no properties follow on this page.
- Figure46 exact audit box `[784,1323,416,374]` retains the complete circular boundary, diagonal hatching inside and stippling outside, all O/M/N labels and their associated dots. O and M are inside, N is outside; no boundary dot, additional mathematical point or radius is supplied. The crop excludes the caption and adjacent prose. The stippling's irregular rectangular perimeter is source ink, not a missing circular boundary.
- Independent row tally: exercises 15 + section title1 + first paragraph6 + last paragraph2 + decorated folio1 =25. Caption46 contributes0 additional rows. This supports25/25 without using it as evidence for the two incorrect glyph transcriptions.
- Sentence-stop normalization to ASCII follows the loaded soviet-cn profile; printed numeric subpart labels are retained.

## Snapshot Hashes

| File | SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/6-8g/pages/0043/page.png` | `605bbcf8921a66dc3189c618e637aad8449aa477f22fa60e08b0dc312917f3fb` |
| `.tmp/ld-s10y-lesson/6-8g/pages/0043/page.grid.png` | `73b208d252fb2f2695ebacc7aa6c5cd7e64edd5cdf3b86b8f293aa59cc393783` |
| `artifacts/6-8g/pages/0043/page.md` | `0ad00c533a7e489bea629c34c95fd269a0b4961a6a7d156121717a5b7e69b07e` |
| `artifacts/6-8g/pages/0043/page.json` | `bb5767919c3612a24024346ec4dda945a7d8c6436a909bccb94a19b9949cd069` |
| `artifacts/6-8g/pages/0043/audit.json` | `c30028ba6850c46c182ed78ea291373775938f7eedcd0d7490477ccbfaad76ad` |
| `.tmp/ld-s10y-lesson/6-8g/pages/0043/figures/fig-46.png` | `b60daa4c746c7582cdf6f39610462081d9de5a8d963bcfef4a844b917ed8a9f9` |

Artifact paths in the table are relative to `ssot-resources/soviet10year-textbooks/`; scratch paths are relative to the repository. This review binds the inspected snapshot, not any subsequent parent repair.

## Changed-Only Repair Confirmation

Current verdict: **PASS**, superseding the initial REVISE after the parent's two glyph repairs. This is the completion of that review, not a second full-page semantic pass.

Checked only exercise99(1)/(2) in current page.md/page.json and their corrected metadata note against the retained source-cell evidence. Both artifacts now contain the exact row:

```tex
1) $(AB)\subset[CD)$；2) $[AB]\not\subset(AB)$；
```

The curved right delimiter in99(1) and crossed subset symbol in99(2) now match the already-inspected source pixels. The first metadata note is corrected and identical between page.md and page.json. No other mathematical assertion is corrected or re-solved.

The clean source, grid, and figure46 crop hashes are unchanged from the original review. The audit is byte-identical (`c30028ba6850c46c182ed78ea291373775938f7eedcd0d7490477ccbfaad76ad`) and continues to record25/25 with no errors; no counter or finalize command was run here. All other prior wording, row, crop, caption and open-boundary observations above are reused without another page/image/browser review.

Current corrected snapshot hashes:

| File | SHA-256 |
| --- | --- |
| `artifacts/6-8g/pages/0043/page.md` | `45807c93ea194e805266820970571cdee37c66f08346949c8eaa18f163603b8e` |
| `artifacts/6-8g/pages/0043/page.json` | `57577646240f148cc4e0866ed70ebd0f8f277dfcfda057a8105282f2e0774034` |
| `p43-review-symbols.png` (retained ticket-tmp cell evidence) | `11649e9550e5a4960677860030b5d58e89cc2e75cc9b85d0da48cb9ae0c6ae3e` |
