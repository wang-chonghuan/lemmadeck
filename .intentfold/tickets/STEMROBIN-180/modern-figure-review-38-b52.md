# fig-38 batch52 FIRST independent FIG review

Verdict: **PASS**. No blocking finding. Reviewed independently on 2026-11-17; candidate FIG review only, not promotion or finalization.

## Observations

- Original PNG was inspected before candidate inventory: one horizontal hammer head, one vertical handle entering it, one wood-grained horizontal plank below the handle end, and one left-side down arrow. No labels, given values, grid, hands, nails or second panel.
- Candidate inventory maps apparatus to `source-apparatus-artwork` / `one-apparatus-artwork`, and action to `tap-arrow` / `tap-label` with `tap-connects`, `tap-down`, `one-label`. Raster anatomy was independently checked; a count assertion was not substituted for visual source fidelity.
- Current full lesson, all six exercises and figure template were read. All ten relevant strings exactly match the spec. Exercise `g2-1` explicitly gives downward tapping of the handle end onto a wood plank. The image shows that action correctly, not the head striking the plank.
- Full separate artwork, separate SVG text and existing native composites agree. One apparatus, one arrow, one English `Tap` label; no inertia explanation, relative head-motion answer arrow, answer key or cultural leakage.
- Actual 306 px and 640 px composites are clear, complete and unclipped. Existing hash-bound render/native evidence measures `Tap` at 17.2125 px and 36 px, with preserved contain fitting and no collisions.
- Requested `text-repair-inertialife-b52/adapt/...` is absent. Actual root repair templates and `text-retain-inertialife-b52/adapt/6p/modern-us-neutral/lessons/phy6-c3-s7` are byte-identical at the approved L/E/F hashes below. No text substitution by inference.

## Actual Images

Exactly four image loads, all at original resolution; no reopens or crops, parent loads 0:

- `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-38.png` (274 x 260)
- `.tmp/s10y-image/b52-fig37-38/fig-38/fig-38.artwork.png` (640 x 640)
- `.tmp/s10y-image/b52-fig37-38/fig-38/native-306.png` (306 x 306)
- `.tmp/s10y-image/b52-fig37-38/fig-38/native-640.png` (640 x 640)

## Hashes

SHA-256, derived from actual bytes:

| Artifact | SHA-256 |
| --- | --- |
| Approved lesson | `ccaa81776333db58b42cfac68df783a8bd47ad595bfcfe1c8afe33a42cd61a52` |
| Approved exercises | `fcce37f6b3bf0a16020edfb00be2c64aa1f91ce01e74021e175dbc9294667cea` |
| Approved figures | `6110e97c32e4a69048e3e96b3630af95042ac3f3f4a18d5f00198ec42b6ae1cd` |
| Candidate manifest | `7b2c6678e3210e5218f55e9b38fa5d26f7cd688b697d985836015bb643d79dac` |
| Original PNG | `8e33d96f13edb5ddf5d646106399acd3c0daf7afe9ae5a45a7544576669472a9` |
| Spec | `48d3bfbdcf7bd518a92445060764f4380b6147eb999f69abd1d03945d786ac00` |
| Render | `9f1cc34079917a932e078dbfeb8be3dd25a005db6720e3b7f8c5769c7911b0e3` |
| SVG | `6535f088618114b5dfaffccadfef0f51f2c2491b6964dcea7011263692ef06e3` |
| Artwork | `4701f6c4985a763cf443784b2344f81bf24ca5cd372404b5c14ce6c2ff5c9947` |
| Native 306 | `67b9273f62209ee21b23fbf78469da6e6720de20b889d6966d4712a4e78b87d4` |
| Native 640 | `6e84485ea45c61f5a739bf346cc2c1a68006742c1cd8d598f9ac0732b72e5a8e` |
| Review JSON | `62de2de5579a42d90406a87be56801547828f90d44eafa1b19f2e0f2e6b02841` |
| Command record | `019429cd251b5fafae9f2b17c453dbc29e8eaf77245e9a5aecbe53e7f6dde572` |

## Command Result

`record_review.py` executed exactly once through existing `tmp/record-step.mjs`, label `b52-fig38-first-review`, using current candidate spec/render and writing candidate `fig-38.review.json`.

Exit `0`, signal `null`, stdout `PASS: fig-38 -> .tmp/s10y-image/b52-fig37-38/fig-38/fig-38.review.json`, stderr `0` bytes.

Invocation and stream hashes: `.intentfold/tickets/STEMROBIN-180/tmp/commands/b52-fig38-first-review.call.json`.
Full textual evidence: `.tmp/s10y-image/b52-fig38-first-review/review-evidence.json`.

No rerender, generation, repair, external gate rerun, source/page/other-figure review, promotion, finalization, database/publish/Git operation, dependency change or global check. Other workers' files preserved.
