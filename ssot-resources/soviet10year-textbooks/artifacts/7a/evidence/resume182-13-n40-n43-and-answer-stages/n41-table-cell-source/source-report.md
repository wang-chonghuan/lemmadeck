# n41 Bounded SOURCE-ONLY Lookup Capture

**Complete source lookup coverage: eight tasks, four distinct main cells. No answer or candidate approval.**

Exact checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`. New ownership: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n41-table-cell-source`. OFFLINE.

Exercise template SHA-256: `c9e95c8bbb123b3c06ce5620adc2d96b9794adf538d3a07a9beff8dd998bb3c3`. The supplied current frozen template was read only for 835.c/d/e and 843.a/b/c/d/e. No n41 author keys or solutions were opened.

## Tasks And Literal Cells

| Task | Inferred Exact Simplification | Literal Main Cell / Address / Provenance | Correction |
| --- | --- | --- | --- |
| 835.c | 2*sqrt(3) | N=3: row 3,0, main 0, exact 1,732, PDF 36/footer 35, new | none |
| 835.d | 14*sqrt(5) | N=5: row 5,0, main 0, exact 2,236, PDF 37/footer 36, new | none |
| 835.e | sqrt(3) | N=3: row 3,0, main 0, exact 1,732, PDF 36/footer 35, new | none |
| 843.a | sqrt(5)+sqrt(3) | N=5: row 5,0, main 0, exact 2,236, PDF 37/footer 36, new; N=3: row 3,0, main 0, exact 1,732, PDF 36/footer 35, new | none |
| 843.b | sqrt(10)-sqrt(7) | N=10: row 10,, main 0, exact 3,162, PDF 38/footer 37, reused; N=7: row 7,0, main 0, exact 2,646, PDF 37/footer 36, new | none |
| 843.c | sqrt(5)+2 | N=5: row 5,0, main 0, exact 2,236, PDF 37/footer 36, new | none |
| 843.d | 6-2*sqrt(7) | N=7: row 7,0, main 0, exact 2,646, PDF 37/footer 36, new | none |
| 843.e | 9+4*sqrt(5) | N=5: row 5,0, main 0, exact 2,236, PDF 37/footer 36, new | none |

Every raw main string uses its full printed decimal comma. The simplifications are inferred algebra, not printed table content or decimal answers.

## Existing Coverage And New Capture

- Existing independent `capture-38.json` covers the main root-10 cell: row `10,`, main column `0`, exact `3,162`, printed footer `37`, record `r10`, pointer `#/records_in_request_address_order/0/main`. It covers the root-10 part of 843.b without reopening page 38.
- The independent `capture-33.json` through `capture-40.json` inventory has no exact main-cell address for root 3, 5 or 7. Table III square cells cannot substitute for Table IV root cells. No fourth-digit correction from a different argument is needed or reused.
- Page 36 was opened once for the missing root-3 cell only; printed footer `35` and Table IV identity were verified. Page 37 was opened once for the missing root-5 and root-7 cells; footer `36` was verified at bottom left.
- Each new capture file is write-once and read-only. The root-10 capture is reused with its original independent freeze and hash, not recaptured.

## Units And Rule Provenance

- Root 3, 5 and 7: numeric main column step in the argument is `0.01`; right correction-column argument unit is `0.001`.
- Root 10: numeric main column step in the argument is `0.1`; right correction-column argument unit is `0.01`.
- In both regimes, a root-correction integer has unit `0.001`. All four requested roots are exact main-table arguments, so correction column/string is null: no correction cell is needed, and no printed correction column 0 exists.
- Header bands are `N`, main `0` through `9`, correction `1` through `9`, repeated at the bottom. Units are interpretations from row layout and the allowed source rules, not invented literal header captions.

Corrected Table IV source-rules SHA-256: `41a84bf4ad20217b9eb056bdaebcf5417d5d72d08820119b63bbf05308611f46`. Locators: `tables[1].grid.below_10`, `grid.at_or_above_10`, `grid.correction_result_unit`; rules `IV-domain-and-precision`, `IV-addition`, `IV-scale`, `IV-over-resolution-and-guard`.

General-rules SHA-256: `a0f08bfe1b78099bd6489bc53fd869c4c215f16bf6ea7cf3787050080df1d05a`. Their precision, reserve-digit, interpolation and last-digit caveats are reused as textual context only; no final-precision, tie-policy, physical-error or historical-equivalence guarantee is introduced.

## Exact Hashes

- IV-root-3: capture `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n41-table-cell-source/capture-36.json`, SHA-256 `767a592963e1e0b70307a25c6b126224a9580720df3df3047ddc2d4fd4d35b3a`; source image `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/bradis-source/page-36.png`, SHA-256 `8d1d232406017798e3de096da4b2cbb94727ca76bd0059bd5f5087a91064ac13`.
- IV-root-5: capture `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n41-table-cell-source/capture-37.json`, SHA-256 `974f211b10f15ca84037706e0a2ace0d237da8b7361419b7e3472889e907859c`; source image `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/bradis-source/page-37.png`, SHA-256 `fb41fa4a0cde55bcee30522ca1750e0cde391822a16101641ac64e024bf3d138`.
- IV-root-7: capture `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n41-table-cell-source/capture-37.json`, SHA-256 `974f211b10f15ca84037706e0a2ace0d237da8b7361419b7e3472889e907859c`; source image `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/bradis-source/page-37.png`, SHA-256 `fb41fa4a0cde55bcee30522ca1750e0cde391822a16101641ac64e024bf3d138`.
- IV-root-10: capture `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/bradis-cell-review/capture-38.json`, SHA-256 `b784dc5059c147378f9d5dd15bc8fecbf1d9a1e7730819838d33712a61dc9c07`; source image `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/bradis-source/page-38.png`, SHA-256 `6688b0e854f86491b17848aba513c5e8935a5ecf54b9f0952d29a26a4616e03c`.

Existing independent freeze SHA-256: `f7a1dfdfed44fe5bf7d0b6c961fc091d88a76ce40f658d5a22075db2cab54e1d`. Existing capture and image-ledger hashes match that freeze. All source/capture/rule/template input hashes are included in the machine package and final receipt.

## Boundary And Stop

The exact simplifications, conjugate rationalizations and argument addresses are inferred from actual exercise prose. Only the four mainCellExact strings are printed-cell facts, each bound to its independent source capture. No root arithmetic is used to create any source string. Null corrections do not mean a source-printed zero.

The prompt does not specify a unique alternate absorbed-factor lookup route. This source package supplies the shared root cells for the standard simplified forms, not a full method/answer verdict.

No final rounding or precision is adjudicated. The allowed general rules warn against last-digit guarantees and do not specify a universal table-first sum/product/difference or tie convention. The parent handles author comparison and any subsequent affected review.

Counts: 8 tasks; 10 lookup occurrences; 4 distinct main cells (1 reused, 3 newly captured); 0 requested correction cells; 2 needed full-image loads, one per page; 0 images for already-covered addresses; 0 crops/renders/within-job reopens; 0 n41 author-key/solution reads; 0 numeric answers.

The context count includes the prior disjoint n40 images: 3 carried + 2 new = 5, below 24. The newly needed page-36 read is counted again; no page is opened twice in this job.

No network, full-PDF read or redistribution, DB, paid calls, durable/app changes, finalizer, publish or commit. Existing n40 PASS evidence and other workers files remain untouched. Parent owns author comparison and subsequent affected method/answer review. Stop.
