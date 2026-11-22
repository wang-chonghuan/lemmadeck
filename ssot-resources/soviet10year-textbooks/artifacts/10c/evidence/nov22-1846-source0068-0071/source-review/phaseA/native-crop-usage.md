# Actual bounded visual usage

Date: 2026-11-22. Ticket: STEMROBIN-184 /184-6.

R = `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck`.
W = `R/.tmp/stemrobin-184-six/source10c5255-work`.
Output = `R/.tmp/stemrobin-184-six/source10c6871-review/phaseA`.

## Read order and accounting

| Order | Operation | New model payload | New creation | Cumulative payload | Conservative cumulative |
| --- | --- | ---: | ---: | ---: | ---: |
| 1 | Original `W/10c/pages/0068/page.grid.png`, once | 1 | 0 | 1 | 1 |
| 2 | Original `W/10c/pages/0069/page.grid.png`, once | 1 | 0 | 2 | 2 |
| 3 | Original `W/10c/pages/0070/page.grid.png`, once | 1 | 0 | 3 | 3 |
| 4 | Create p0070 native ROI01, once | 0 | 1 | 3 | 4 |
| 5 | Read p0070 native ROI01, once | 1 | 0 | 4 | 5 |
| 6 | Original `W/10c/pages/0071/page.grid.png`, once | 1 | 0 | 5 | 6 |
| 7 | Create p0071 native ROI01, once | 0 | 1 | 5 | 7 |
| 8 | Read p0071 native ROI01, once | 1 | 0 | 6 | 8 |

Actual model-bearing visual reads: **6**, within the specified model 4..6 range and max 6 payloads.
Actual conservative usage including image creation: **8**, at the specified max 8.
Current-context image payloads: **6**, below max 24. No compaction/reset is claimed.
Original grid reopens: 0. Old ROI reads: 0. Other-page payloads: 0.
Further PhaseA images: forbidden; this batch is closed.
Parent image budget was supplied as permanently 24/24; return text/path/hash only, never these image payloads.

Hashing PNG bytes/header for evidence is mechanical input binding, not a model visual read, image reopen, image creation, OCR or baseline diagnostic.

## Native ROI01 on physical 70

- Purpose: distinguish the printed character after `任一`, not infer it from interval mathematics.
- Input: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-work/10c/pages/0070/page.png`
- Input SHA256: `d83dc5f270be7d7f98d19bd02672a60bd9ca2e8a1ef5f290ec16c6c6224f9e0f`
- Input size checked during creation: 1695 x 2580.
- Rectangle xyxy: `(1115,260,1450,330)`; xywh: `[1115,260,335,70]`.
- Output: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c6871-review/phaseA/p0070-roi01-native.png`
- Output size: 335 x 70; native scale 1.
- Output SHA256: `724be3cd351f7acc6dafd021e4dd79ce913b9e7028bf9a83b2d62ede2ad38063`
- Creator: local `make_roi.py`, executed once with existing skill Python, `-B`; actual exit 0.
- Read: one `view_image`.
- Observation: visible `任一闭区`, including the closed-character frame and interior; U70-1 resolved visually to `闭`.

## Native ROI01 on physical 71

- Purpose: inspect the actual glyphs between `x∈` and `(ctg)` in property 4; no mathematical repair.
- Input: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c5255-work/10c/pages/0071/page.png`
- Input SHA256: `e06fe27f13f95891355de8250b999fd6d4aedf6375b81f60eca706cd7ffe74c2`
- Input size checked during creation: 1695 x 2580.
- Rectangle xyxy: `(215,473,835,540)`; xywh: `[215,473,620,67]`.
- Output: `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source10c6871-review/phaseA/p0071-roi01-native.png`
- Output size: 620 x 67; native scale 1.
- Output SHA256: `8c541ef5614dcee73f0d6a6c43246dde0b0a6fce8b82098d1acbd3fade3ff9c2`
- Creator: local `make_roi_p0071.py`, executed once with existing skill Python, `-B`; actual exit 0.
- Read: one `view_image`.
- Observation: `x∈(ctg), ctg(x+π)=ctgx.`; no intervening D-shaped glyph. U71-1 resolved visually. No error/correction judgment.

Both creators refuse an existing output, create only the single allowed native rectangle under the new PhaseA root, and do not rescale, enhance, OCR, reprepare or modify source pixels. The scripts are retained for traceability, not permission to run them again.

## Calls and fees

- External image-generation/API calls: 0.
- Paid browser/network/DB calls: 0.
- New explicit paid model-generation jobs: 0.
- Base-assistant billed tokens, image tariff, account charge and total monetary fees: **UNKNOWN**. No billing receipt was available/read. Zero explicit paid jobs does not establish zero total fee.
