# 10c Physical Pages 19–22 Source Author

- Scope: STEMROBIN-184 session B short-term source author only; finish review.
- Durable target: only artifacts/10c/pages/0019–0022/page.md and p2c-generated page.json/audit.json.
- Initial check: all four target page.md files absent; no persistent draft was replaced.
- Read: .intentfold/readme.md, project.json, product/engineering/operations Charter, ld-s10y-lesson cap1, 10c zh TOC, live Plane STEMROBIN-184 (HTTP 200).
- User's current scoped authorization controls this work; no ticket update, DB write, commit, merge, publishing, deployment, dependency change, assembly, adaptation, modern figure generation, answers or choice work.
- No existing answers/choice contents or another source review read. No chat messaging. No .env read or printed.
- Stable 10c physical pages 7–18, all indices, tools and counters untouched.
- Source PDF SHA-256: `47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`.
- Offset: physical page = printed page + 6; physical 19–22 = printed 13–16.
- Author observations are not independent review. The parent performs the sole independent source review.

## First Real Gate Result

Physical 19: prepare once (exit 0), finalize once (exit 1). Actual stdout:

```text
[finalize] 10c p0019: 15 块 / 20 行（印刷 21）, 插图 0 张, 规范化 0 处
  失败 1 项:
    - 行数对不上：印刷 21 行，块体 20 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```

The first failed audit remains at `artifacts/10c/pages/0019/audit.json`; it is not rerun or overwritten. No counter/expected-count change, count_exclusions, or invented transcription line was added. Author visually counts 20 real printed lines including the footer.

Physical 20 also retains its first real failure (exit 1):

```text
[finalize] 10c p0020: 14 块 / 16 行（印刷 17）, 插图 4 张, 规范化 0 处
    fig-05(图 5) → [255, 545, 390, 339]
    fig-06(图 6) → [839, 544, 417, 333]
    fig-07(图 7) → [267, 1318, 405, 365]
    fig-08(图 8) → [824, 1293, 413, 392]
  失败 1 项:
    - 行数对不上：印刷 17 行，块体 16 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```

All pages ran the existing `.claude/skills/ld-s10y-lesson/.venv/bin/python` with `tools/p2c.py`, each prepare and finalize exactly once, with no custom flags or forced prepares.

| Physical | Printed | Prepare Exit / Raw Bands | Finalize Exit | Blocks | Tool Rows / MD Rows | Figures | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 19 | 13 | 0 / 21 | 1 | 15 | 21 / 20 | 0 | First failure retained |
| 20 | 14 | 0 / 27 | 1 | 14 | 17 / 16 | 4 | First failure retained |
| 21 | 15 | 0 / 18 | 0 | 11 | 16 / 16 | 2 | Mechanical gate passed |
| 22 | 16 | 0 / 23 | 0 | 10 | 23 / 23 | 0 | Mechanical gate passed |

All four audits report zero normalizations, zero unknown characters, zero KaTeX warnings, and empty count_exclusions. Pages 19/20 fail only line reconciliation. A passing mechanical gate does not establish independently reviewed source fidelity. The four-page batch is **not all-green** and is not accepted for downstream publication.

## Failure Diagnosis, Not A Waiver

After the actual failures, the author used the unchanged `layout.ink_mask` and `layout.line_bands` with the current finalized figure boxes to produce disposable `source-count-bands.png` overlays, then observed each `source-count-bottom-crop.png` at `[0,2420,1695,2580]`.

- Physical 19: extra last band is original y=2495–2498, well below its footer band y=2287–2315. The actual bottom crop shows a faint scan-edge line/specks rather than legible textbook prose.
- Physical 20: extra last band is original y=2464–2507, well below its footer band y=2281–2309. The actual bottom crop shows the slanting bottom scan-edge line rather than textbook prose.
- This is the source author's diagnostic observation only, not the parent's independent confirmation. No exclusion entry was added; no tool/counter was changed; neither failed finalize was rerun. The first audits remain authoritative gate failures.

## Image Observation

| Physical | Observed Original/Crops | Page PNG SHA-256 | Author Rows | Status |
| --- | --- | --- | --- | --- |
| 19 | page.png; source-top-crop.png `[200,250,1520,1190]`; source-bottom-crop.png `[200,1270,1520,2280]` | `6f92272f422792c85533ace5c1c162497fecdc89b92bfe5c5bba6a4473de5405` | 20 | First finalize failed, retained |
| 20 | page.png; page.grid.png; source-case1-crop.png `[100,240,1430,500]`; source-cases2-3-crop.png `[100,970,1430,1280]`; source-case4-concavity-crop.png `[100,1770,1430,2270]` | `002a378a9cf68497a328097cc687f3b9c3f5ce06a0dbfc2ca5119e0502ae632d` | 16 | First finalize failed, retained |
| 21 | page.png; page.grid.png; source-top-crop.png `[200,220,1530,780]`; source-table-crop.png `[200,790,1470,1140]`; source-example-bottom-crop.png `[200,1190,1530,2160]` | `cad9ed0128b3c2865a28c22fe7a42cb71602d88c0b6923d3b30926c91afc0328` | 16 | First finalize mechanically passed |
| 22 | page.png; source-exercises-crop.png `[100,260,1490,1510]`; source-ex51-n80-crop.png `[100,1490,1490,2300]`; source-ex50-interval-detail.png `[220,1340,960,1450]` | `7ec00b97ccfe7d77efcaf998ccd7db194178b13cf3d62de647c7700b179bba72` | 23 | First finalize mechanically passed |

Crop boxes above are PIL `(left,top,right,bottom)` coordinates in the unchanged 1695x2580 original PNG. Crops are disposable tool-derived .tmp observations, not durable source substitutes.

## Actual Figure Crops Observed

Each finalized PNG below was opened and observed individually after finalize. Boxes are tool-snapped original-page `[x,y,w,h]`, not manually measured final geometry.

| Physical | Crop | Box | PNG SHA-256 | Author Observation |
| --- | --- | --- | --- | --- |
| 20 | fig-05.png | `[255,545,390,339]` | `9762fd425047afc9880b1a6ef6380fa307fdcd1fc3bbca1c7f2f3664d4b909bf` | Increasing, convex upward curve; axes, open endpoints and dashed drops retained |
| 20 | fig-06.png | `[839,544,417,333]` | `c0f74409bab468a675ff077d2feb49ba79dc9b3df89ff88a1618f6e6d5dfb50a` | Increasing, concave downward curve; original left endpoint partly open/broken as scanned, not repaired |
| 20 | fig-07.png | `[267,1318,405,365]` | `7b226880647ee9f862dbcf80728eed3faa1ff17928f848b4a0ec4361b9dd7c1e` | Decreasing, convex upward curve; original labels/endpoints/drop lines retained |
| 20 | fig-08.png | `[824,1293,413,392]` | `a6ae8ab3af00e358db0f0b83cbe34ff49b8a09f3c6c5dd32c76f0b4e14231974` | Decreasing, concave downward curve; original labels/endpoints/drop lines retained |
| 21 | tbl-p0021-01.png | `[315,806,1109,344]` | `d578034e371c0d94ac215e834abdd2f24ca41e13e1fdfeeb9e9123aeeb661d1e` | Complete original sign table: interval columns, first/second derivative rows, all four sign entries and table rules retained |
| 21 | fig-09.png | `[1021,1711,454,370]` | `0f174d4af846f09e62f547fbe6aba503c5098218b8bf9a2ab312b37721c2ca12` | Cosine curve and tangent, axes, 0, 1, -1, π/2, π and x/y labels retained |

These are original scan crops generated by cap1, not generated replacement figures. Figure captions stay outside crops. The unnumbered table belongs to the n79 prose example, not an exercise, so no owner-ex was invented.

## Boundaries Observed

- Physical 18 tail text read only: n78 theorem 2 proof ends in `=1`; no open paragraph to join into 19.
- Physical 19 starts n78 concluding prose, then all four exercises 42*–45*. The prompt is printed “求极限：”; exercises occupy two shared rows. §16 and n79 start on that same page. The final paragraph introducing four cases is a complete sentence; detailed cases begin on 20.
- Physical 20 preserves all four cases and original figures 5–8. Its last complete sentence ends with “向上凸”.
- Physical 21 continues n79 with the cosine example, sign table, inflection-point discussion and tangent equation `y=π/2-x`; the example's final sentence and printed black left triangle are complete on the page.
- Physical 22 contains the complete n79 exercise group 46*–51* and then the n80 title and first paragraph/equation `f''(t)=-f(t).`
- Source-page content boundaries for n78 and n79 are now closed by the observed next-unit headings, but no assembled lesson or whole-lesson validation is claimed. The retained 19/20 failures still block claiming a fully finalized source batch.
- N80 is only started: no physical 23 page prepared/read, and no complete n80 unit claimed. Its first paragraph is a complete sentence on 22, so no fabricated `open` paragraph marker was added.
- All actually printed mathematics here stays within its own single physical text row. Separate derivative identities on 19 use two actual block-body rows; shared exercise rows remain shared. There is no observed formula broken across physical rows in this four-page range, so no artificial `↵` was introduced.

## Source Glyph Note Requiring Parent Attention

Physical 22 exercise 50*: the direct high-resolution original crop `source-ex50-interval-detail.png` shows `]∞,∞[`. The first infinity has no visible minus sign. The durable source preserves `$]\infty,\infty[$` and records this in notes. No corrected mathematical interval was inferred, no errata correction authorized, and no answer/choice material consulted.

## Durable Output Identity

These hashes were measured after each page's one actual finalize. Hashes bind the retained gate outcomes to the delivered source, not to an independent audit.

| Physical | page.md SHA-256 | page.json SHA-256 | audit.json SHA-256 |
| --- | --- | --- | --- |
| 19 | `10e59899d82f5254325fb3fa845db56247eb137b3d27cc1540608066a99b9231` | `99a74d045f1ad00d921699267e959f8bf3c8800f71bd9b63d369c38f5fabc5be` | `7a2fb1f7edddbe335c08c111e6a890011d36fc60808ff375549faddbf61879cc` |
| 20 | `dd5ff3a198180727f90b06bf8ad2fa465b09e004baca9cf6c38bcd21287ba7b0` | `eb7ee80c806c2b25d1f2662c50dece378564db7b7cd14d465ef916647fb46791` | `409ae8f80792fbea921d04c7c18c9273b51f806a997189a5669f91b1a13cd0e3` |
| 21 | `0ca8869e35944a1807faf47240b39a4f4a7bded8fe9814e2b657120b64d3340f` | `9869ff8528257f3f9a6ef062ff7f7082123a3db138455225c5b61059e9cf54cd` | `2024b7abe73a7e62c4ff86ab02ce0c1cc93f53b4e4a10239573a5cea8048c96c` |
| 22 | `de9fbcf73b5add38a5cf6f670f22d52ac4daa1fdf88575fd9cfe36946e799353` | `1851ccd8bfdc226ca9795b2b8db3605bc01ce82e315b049820706e4328575461` | `b52f130e6cff8b52897a2090cdcbf65fc5f9ed6c98fa533fe5f7246c3cce41aa` |

## Changed Files And Stop

Only these durable files were authored/derived by this worker:

```text
ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0019/page.md
ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0019/page.json
ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0019/audit.json
ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0020/page.md
ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0020/page.json
ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0020/audit.json
ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0021/page.md
ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0021/page.json
ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0021/audit.json
ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0022/page.md
ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0022/page.json
ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0022/audit.json
```

Scratch report: `.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p19-p22-author.md`. Tool-derived renders/templates/layouts/crops live only in `.tmp/ld-s10y-lesson/10c/pages/0019–0022/`.

No other durable source, index, tool, counter, dependency or Charter was modified, and no existing change was reverted. No tests/build/publication gates beyond the requested cap1 work were invoked. Completed scoped source-author work stops here, with 19/20 genuinely failed, 21/22 mechanically passed, parent independent review outstanding and n80 incomplete.
