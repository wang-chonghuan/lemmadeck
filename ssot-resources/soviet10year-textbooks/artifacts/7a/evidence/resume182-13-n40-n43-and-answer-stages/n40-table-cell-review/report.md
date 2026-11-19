# n40 Independent Table IV Source-Cell Review

STEMROBIN-182. OFFLINE. Exact checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.

## Final Cell Approval

**SOURCE_CELLS_APPROVED: 11/11 exact cells; 8/8 target addresses PASS.**

Approve the eight specified main cells and the three specified correction cells in the authorized author captures.json at the verified SHA-256. This includes the source-printed zero correction at row 3,9, correction column 1. Approve their exact Table IV source addresses, all three footers, all three source-image hashes, and the stated argument/root-correction units.

The numbers below are literal source MAIN/correction cell captures, not evaluated exercise answers. A dash means no correction was requested, not a synthetic printed zero.

| Target Address | Footer | Exact Row | Main Column | Exact MAIN Cell | Correction Column | Exact Correction Cell | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1.2 | 35 | 1,2 | 0 | 1,095 | - | - | PASS |
| 4.5 | 35 | 4,5 | 0 | 2,121 | - | - | PASS |
| 2.624 | 35 | 2,6 | 2 | 1,619 | 4 | 1 | PASS |
| 3.981 | 35 | 3,9 | 8 | 1,995 | 1 | 0 | PASS |
| 12 | 37 | 12, | 0 | 3,464 | - | - | PASS |
| 28 | 37 | 28, | 0 | 5,292 | - | - | PASS |
| 33.33 | 37 | 33, | 3 | 5,771 | 3 | 3 | PASS |
| 80 | 39 | 80, | 0 | 8,944 | - | - | PASS |

## Rows, Corrections, And Scales

- All requested rows and columns match exactly, including trailing commas on integer rows `12,`, `28,`, `33,`, and `80,`.
- Below 10: main argument columns advance by `0.01`; correction argument columns advance by `0.001`.
- From 10: main argument columns advance by `0.1`; correction argument columns advance by `0.01`. Thus address `33.33` uses row `33,`, main column `3`, correction column `3`: main address `33,3`, correction argument increment `0.03`.
- For `2.624` and `3.981`, correction argument increments are `0.004` and `0.001`, respectively. The printed zero for the latter is a real captured correction cell.
- Root-correction integers always have unit `0.001` in both regimes. Argument increment and root-correction amount are distinct.
- Header bands are `N`, main `0` through `9`, correction `1` through `9`, repeated at the bottom. Units are not literal header captions: the independent unit check uses exact row-comma positions and the source explanation/examples on printed page 39.
- The five main-only targets need no requested correction cell; the source prints no correction column 0.

## Source And Freeze

- `page-36.png`: printed footer `35`, Table IV, source SHA-256 `8d1d232406017798e3de096da4b2cbb94727ca76bd0059bd5f5087a91064ac13`; source/hash/footer/header comparison PASS.
- `page-38.png`: printed footer `37`, Table IV, source SHA-256 `6688b0e854f86491b17848aba513c5e8935a5ecf54b9f0952d29a26a4616e03c`; source/hash/footer/header comparison PASS.
- `page-40.png`: printed footer `39`, Table IV, source SHA-256 `f34ed45d00239ac00fa10a6d1262718460602fb8e44b07b95a143be4f4a9f658`; source/hash/footer/header comparison PASS.

Stage 1 was frozen at `2026-11-19T04:07:31.017Z` before the first author read at `2026-11-19T04:07:47.283Z`.

- Frozen independent captures: `captures.json`, SHA-256 `aa31b153eef42b3b0abbe5f6407201f28c63ca0a7be68de57f0ff7f096dd048d`.
- Frozen image ledger: `image-load-ledger.json`, SHA-256 `55bd41682fa202047178df264197f19f8d9fece979616758f4a5fe2132abcd98`.
- Freeze receipt: `freeze-receipt.json`, SHA-256 `d09a73fc60afcdc5fb5089b9036757d71ce3bab334ef2c42210597a781a4c9c5`.
- Compared only authorized `../n40-table-cell-author/captures.json`, verified SHA-256 `ad91b77f81f4949cf6b4bdd5eda0d8690eaa6879cfa04e3e127208e0002fd2e8`.
- All Stage 1 files and the freeze receipt remain byte-identical and read-only.

## Discrepancies And Scope

No discrepancies. No source-cell repair is required. Every unaffected PASS is retained; no source image is reopened.

Source-cell approval only. No final numeric answers or preprocessing/precision adjudication. No historical-equivalence or human-approval gate is introduced.

`derived.json` was not read because source-cell comparison needs no root arithmetic. No answer keys or other author files were read. No original transcript, durable content, app, database, network, or commit action was performed.

Counts: 3 source images, 3 full-image loads (one each), 0 crops/reopens/renders; 8 main cells plus 3 requested correction cells approved; 3 footers and 3 image hashes compatible; 2 scale regimes compatible; 0 discrepancies; 0 author reads before freeze; 0 answer-key reads.

Detailed machine comparison and final file hashes are in `comparison.json` and `completion-receipt.json`. Stop after this source-cell report.
