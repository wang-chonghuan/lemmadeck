# First Finalize Failures

Exactly one official finalize call was made for each of the eight authorized pages. No finalize was rerun.

## 0251

- Leading identity was technically resolved by the direct user's text-only sibling-tail follow-up: exercise 842 ends on 250; new exercise 843 begins 251, under n41 until physical 252.
- The durable pre-finalize input compared byte-identical to the frozen `page0251.first-source.md` with `cmp` exit 0.
- First finalize exit: 1.
- Exact error: `行数对不上：印刷 20 行，块体 19 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）`.
- Output: 8 blocks, 19 MD rows, 20 detected printed rows, 0 figures, 0 normalizations.
- Preserved evidence: `finalize0251.start.json`, `.stdout`, `.stderr`, `.receipt.json`; durable `pages/0251/page.md`, `page.json`, `audit.json`; frozen first-source MD.
- No specific false/missing row has been diagnosed by a new visual review. No image was reopened and no row was inserted to match the detector.

## 0258

- First finalize exit: 1.
- Exact error: `行数对不上：印刷 22 行，块体 21 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）`.
- Output: 12 blocks, 21 MD rows, 22 detected printed rows, 0 figures, 0 normalizations.
- Preserved evidence: `finalize0258.start.json`, `.stdout`, `.stderr`, `.receipt.json`; durable `pages/0258/page.md`, `page.json`, `audit.json`; frozen first-source MD.
- The single original grid read had already recorded unidentified upper-margin strokes. Their causal relationship to this count discrepancy is not established.
- No tests, detector experiments, tools changes, source-image reopen, repeat finalize, or fabricated row was used.

Independent pages 0252-0257 retain their first-finalize exits of 0. These are mechanical page-stage outcomes only, not independent source-content approval.
