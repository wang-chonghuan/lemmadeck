# Source Author 131–135

Date: 2026-11-15. Identity: Codex source author; not independent reviewer.
Status: 131–134 page gates PASS; 135 BLOCKED by the existing character gate.
This is an author handoff, not independent approval or assembled-course approval.

## Scope and Execution

- Book: 6p, shared source `6-7p 苏联中学课本 物理 六-七年级.pdf`, physical 131–135 / printed 120–124.
- PDF SHA-256: `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`.
- Each actual 300-dpi page PNG was separately opened and fully read; each of the five finalized figure crops was separately opened. Grids were used only for source crop boxes.
- Existing shared Python: `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`, invoked with `-B`.
- Existing `.claude/skills/ld-s10y-lesson/tools/p2c.py`: prepare once for each page, finalize once for each page; vectorize once each for pages 131, 134, 135.
- No prepare/finalize/vectorize retries; no targeted content repair consumed. No new code, installation, browser, model/service call, DB, Git, index/assemble, modern text/answer/choice work.
- Counter repair and all other authors' pages were left untouched. Physical 126–130 and 136 were not read.

## Exact Counts

Line counts below are after source figure masking, not the unmasked prepare estimates.

| Physical | Printed | Blocks | Printed / MD lines | Figures | Normalizations | Finalize exit |
| --- | --- | --- | --- | --- | --- | --- |
| 131 | 120 | 11 | 20 / 20 | 1 | 0 | 0 |
| 132 | 121 | 14 | 24 / 24 | 0 | 0 | 0 |
| 133 | 122 | 16 | 24 / 24 | 0 | 0 | 0 |
| 134 | 123 | 12 | 15 / 15 | 3 | 0 | 0 |
| 135 | 124 | 8 | 18 / 18 | 1 | 0 | 1 |
| Total | | 61 | 101 / 101 | 5 | 0 | |

All five audits have zero KaTeX warnings and zero registered errata. Only 135 has unknown-character/errors entries: two actual `①` markers.

There are 12 original numbered exercise objects in this span, represented by 15 ex blocks including continuations: two preceding-section questions on 131; §53 five questions, three exercise-23 questions, and two homework questions. No answers or new tasks were authored.

## Source Fidelity and Continuation

- 131 retains the two opening questions, §53 heading, source emphasis, 16 square metres / 5 metres / 80 cubic metres / 1000 kilograms per cubic metre / 80000 kilograms / 9.8 newtons. Its final paragraph is open at “乘以9.8”; 132 continues with “牛顿/千克”.
- 132 retains the printed approximations and original units: about 800000 newtons, 50000 pascals, 50 kilopascals, and the general liquid-pressure derivation.
- 133 retains the definition's unit scale, the 10-metre / 800-kilogram-per-cubic-metre oil example, about 80000 pascals / 80 kilopascals, and every original question. The two-column example is stored by its four actual horizontal rows, without treating numerator/denominator or divider rules as additional text lines. A source-only detail crop was actually viewed at `.tmp/ld-s10y-lesson/6p/pages/0133/source-example-detail.png`; it confirms the density-line period and the printed `p` dash/question-mark notation.
- Exercise 23 no.3 continues from 133 to 134, retaining the 5-kilogram mass and 1-metre water-column condition. Homework no.2 is open across fig117 and across 134→135, retaining all four tubes, the two bent immersed tubes, both source subfigure letters, air-pressure methods and all follow-up questions.
- 135 retains §54 “流体静力学佯谬 帕斯卡实验”, the body reference and the complete explanatory footnote. The last paragraph is open after “但它们的底面”. No external continuation on 136 is claimed verified.
- Source text uses original Chinese wording, halfwidth sentence periods and LaTeX superscripts/formulas; source subfigure references remain Cyrillic а/б. No modern reinterpretation, solution annotation or source numeric correction.
- No unreadable source text was identified. The preceding-section ownership of the two questions on 131 and the external 135→136 continuation remain outside this page-author scope.

## Figure Crops and Vectors

Paths: `.tmp/ld-s10y-lesson/6p/pages/<physical>/figures/<id>.png|svg`.
Boxes are the exact finalize result `[x,y,w,h]`; captions are separate text blocks.

| Page / ID | Final box | PNG bytes | SVG bytes | Reported mismatch | Vectorize |
| --- | --- | --- | --- | --- | --- |
| 0131 / fig-114 | [457,990,643,349] | 6851 | 40133 | 0.000% | PASS |
| 0134 / fig-115 | [345,297,228,433] | 3844 | 14857 | 0.000% | PASS |
| 0134 / fig-116 | [755,419,582,282] | 7297 | 40340 | 0.004% | PASS |
| 0134 / fig-117 | [345,1396,823,402] | 10903 | 66338 | 0.004% | PASS |
| 0135 / fig-118 | [470,1259,621,489] | 9664 | 55904 | 0.017% | PASS |

Actual crop observations:
- 114: complete rectangular tank/water column, depth h, 4-metre lower dimension, base and full right/bottom geometry.
- 115: complete stand, vertical tube, football bladder/board and 5-kilogram marked mass.
- 116: container on its base, three outlets with direction arrows and curved jets, complete receiving tray.
- 117: both а/б bottle states, four-tube relationships, bent submerged ends, water/air marks, rubber bulbs, compressed-bulb/downward arrow at far right; both subfigure letters preserved in one grouped crop.
- 118: all three differently shaped containers, three spring balances numbered 1/2/3, support, a/b/c/d and S labels, water levels and dashed correspondence, right-side vertical extent. No added values or answer labels.

PNG SHA-256:
```text
fig-114 10405c879c73804cc0a5bff9f7d7bb6090ee05085414fea86071fb7a8dbbffb6
fig-115 359dde9dac76ba26875c7073e7f93e5256954c227239157de58e9a4f48b3f912
fig-116 9841fdbb95c89262bc5d52d85241e0bd44eb5aad7a610cd7634aaf717e0332f4
fig-117 4a505fab84fff7c89224cd2f8fa062b4acb3245db2435d5090a9bdd21aeb517f
fig-118 a6c2b4cc10eb2afc1a5b87d31800864077cc2c0d2fafaee1e30593063a0f3718
```

SVG SHA-256:
```text
fig-114 c3593be043fef8d838f25060addb3043be60eb7bb5d4fe0cb0f8f9347a6575b1
fig-115 be42e14b858e93bee8260104459d33a56207d8f0c6693ee60e6622cf05ae9364
fig-116 b18d48ae378ee68145f19ce71fee367b68b7de0e4c361a38ad55d4f934385306
fig-117 1d1070cc7814e78798c3331d1057d84ba051901d63ca1bac8c8f17bb2821f7da
fig-118 c3232807ceed818cff7a3bebfcf8b22ae4d61158a7ba25aa18059e91eef9d8b3
```

## Frozen Page Hashes

Durable files: `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/0131` through `0135`.

```text
0131 page.md    a910d4894fc49bec4fd2fea4497437146943eab730551295a12e19e2820f98b4
0131 page.json  8e1f2c2159ac2c262e4bef6839c2caa2842dee7d92bf5e88655e6c22a0799d5f
0131 audit.json 2954d327e1055228782687023e751100a9fdff2b8c65ba824b5f49a9b8174842
0132 page.md    1be26f9fae410f0755ae36c5c91c0f9d1f389718f795ff70b6203ab769fc986e
0132 page.json  5969d81c57cb42b72cbf36dccbe0b6ee683e111e236ef4b7be8d2e0ff945c297
0132 audit.json 120565bac1e6d3477e0744d4e2119784d8505b58a91ef5790b8d4bd581ecebc5
0133 page.md    9cdda261f0f31ac5baf8bef19ab9bb7787db6c5290c02c9d16af31488434eddd
0133 page.json  74d57c43076ba882b50dbf7ff32b58010661914038168a5b6825d8a5987f2438
0133 audit.json f3943516d22cb7b9b27d5d4ad01864e79f8f6073716c7bd7766b05dc2b8d15cc
0134 page.md    fef070eb1e50dd30784a673bc7666b64ec6d8d6e3ba3897cadecfbef721bcd12
0134 page.json  c66be088a068b4b1003081c11f4f512e8d0e187035355befa8faa9208c3a5550
0134 audit.json 4da1ed1f5f62d2a4d688f9582dcd9a8a744def7f551335422baa65f8a0fbb05e
0135 page.md    91029e2b050584db51c9da56829a2e64cf32dcd19f05351fba5849c78b585e5c
0135 page.json  8db1064f9079f5b321d1b1c96e735036239143762e3a23e0a80e4122a187eb46
0135 audit.json 9f917a4d249bd723089a6f79f57efc54b78b69deca0bf5328bb63575e7b7515e
```

Original rendered page PNG SHA-256:
```text
0131 ff846003ef52d16f655952b61435c1f566b9ea4bbfef12c4ab5984e345eb4c29
0132 2c5f25c5c1fc4deadecfe934eaaee7fd10f6b79f1ce5218fa8cb18eca187fc2d
0133 5f194ab3c2144fa18f21c8dd50b88cb4c559df2d9a04e0c07e7c088b3d913696
0134 47c20a1ad3898c263f78f45ec65a4b9309e858447c9ceea6f25fd7e0557d5781
0135 450725c8269e5a2de292c341ca70409336af17ee0af145bcef3077840eb47069
```

## Mechanical Blockers and Retention

1. **135 character gate BLOCKED.** Actual source `①` occurs at `p0135#3` and `p0135#7`. The first finalize rejects both as U+2460. Source characters have not been deleted, replaced or normalized to fabricate a PASS; profile/code remain untouched. Line count and figure geometry pass independently, but the page must not be treated as finalize-PASS.
2. **Downstream footnote retention blocker.** The complete explanatory footnote is preserved in `p0135#7` as a foot block, separately from page number `p0135#8`, so it does not disrupt the open body paragraph. Current `assemble.py:103` skips foot blocks. This would omit an instructional definition during later assembly unless separately resolved. No assemble command was run, and no out-of-scope code workaround was made.

135 first-failure directory:
`.tmp/ld-s10y-lesson/6p/pages/0135/failure-01-circled-footnote/`.
It preserves page.md/page.json/audit.json, original page/grid/template/layout and the first PNG crop before vectorization. The snapshot hashes match current blocked durable artifacts and PNG. Repair consumption: 0. No failure was overwritten or waived.

Await independent source review for 131–134 and separately authorized handling of the genuine 135 mechanical blockers. No promotion, index change or assembled-course approval is claimed.
