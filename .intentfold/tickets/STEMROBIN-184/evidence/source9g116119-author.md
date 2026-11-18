# Source 9-10g pages 116-119 author evidence

- Scope: offline source authoring only in `/Users/yong/.codex/worktrees/a07e/lemmadeck`; only source Markdown pages0116-0119 and this report are manually authored. No Git operations, ticket/setup reruns, DB, publication, deploy, tools edits, assembly, modern edition, answer/choice work or chat messaging.
- Prepared input receipt: `.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p116-p119-prepare/result.json` (SHA256 `ec566fc9c68359ffad3625b6b68b786e6fcc3f998facae14f808965c67cc8175`) records one prepare invocation/page, each exit0. All four working inputs/page already existed, so copied0 and prepared/rendered0. All16 working inputs and all16 durable counterparts match the receipt. Durable originals under `ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch012-source116119-first-prepare/pages/` were treated read-only: no bytes or permissions changed by this author.
- First actual finalize call: `.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 9-10g --page 116`, exact cwd above, exit1. Trace: `p2c.py:351 -> layout.crop -> layout.py:1559 -> out.parent.mkdir -> PermissionError: [Errno 13] Permission denied: '.tmp/ld-s10y-lesson/9-10g/pages/0116/figures'`. Failure occurred before content/count audit or durable finalize outputs. Corrected only temporary directory owner-write permission for0116, then reran the same finalize; applied the same diagnosed permission correction to0118/0119 before their figure writes. No input-file chmod, reauthor or reprepare.
- Auxiliary hash/permission diagnostic initially exited1 because it incorrectly asserted that durable files had no write bits: `Error: Durable input writable .../0116/page.png`. Inspection reports all16 durable file modes644 inside the protected evidence directories. Repeated only the read-only hash comparison without that false permission assertion: exit0, all32 input instances match. No evidence chmod or content revision.

## Actual finalize results

Command per row: `.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 9-10g --page N`; cwd exactly `/Users/yong/.codex/worktrees/a07e/lemmadeck`; no `--repo`.

| Physical / printed | Calls / exits | Blocks | Printed / Markdown rows | Figures / snapped box |
| --- | --- | --- | --- | --- |
| 116 / 109 | 2: 1(permission), 0 | 10 | 25 / 25 | fig-127: [748,1243,481,441] |
| 117 / 110 | 1: 0 | 9 | 25 / 25 | none |
| 118 / 111 | 1: 0 | 10 | 19 / 19 | fig-128: [448,1256,529,409] |
| 119 / 112 | 1: 0 | 12 | 25 / 25 | fig-129: [811,1286,431,307] |

Each audit has empty `errors`, `normalizations`, `unknown_chars`, `katex_warnings`, `count_exclusions`; errata0. No content/count failures or dependent-stage bypass. Template source/render metadata used as prepared; finalize refreshed actual profile/source facts itself. Post-batch `layout.py` SHA256 observed `052ab1b50fb822ae9b77c3f7936d74cd95ed9193aaaa362b012fbbe5b89f6234`; not a claimed per-invocation snapshot because the parent may edit it concurrently.

## Boundaries and ownership

- Incoming115 was consulted as text only, never edited/reopened as an image: exercise309 is already complete before the section34 heading; theorem20 proof ends with 是点A到平面alpha的距离. Page116 starts a separate paragraph about A belonging to alpha and retains its printed proof-end square. No incoming exercise or proof `cont` was invented.
- Section34 owns exercises310-323. Page116:310-312 complete;313 includes the original worked solution, split `ex313 open -> fig/cap -> ex313 cont open`, ending 要求计算. Page117 begins `ex313 cont`, closes the full radius/distance calculation at |MK|=2cm, then314-320 complete. Page118:321-323 complete before the actual `h3` section35 heading.
- Figure127 belongs to313's printed solution, not theory: M/A/B/C/K and all printed segments; caption `samerow` with 射影K和已知三角形的顶. Figure128 belongs to section35's construction prose: alpha/beta, a/b/b1, C/D/D1/M/N, projection segments and right-angle marks; its caption has its own row. Figure129 explicitly `owner-ex324`, all eight parallelepiped vertices and solid/dashed edges; not exercise325, though its caption shares325's last row.
- Section35 starts physically118/printed111, with complete problem and initial construction. Final paragraph118 is `p open` ending 实际上，因;119 starts `p cont` with 为 and closes after (MN) perpendicular to a and b. Full common-perpendicular definition, distance proof, and parallel-plane note follow, including printed 为什么？.
- Page119:324-326 complete;327 has only its first printed row and is `ex327 open`, ending 求作直线A1D与. No page120/121 or section36 pixels were viewed; section35 is not established complete. This page batch supports the parent's four-lesson32-35 scope but does not claim all four lessons are closed or authorize a fifth lesson/extra collection.
- Source decisions: preserve exercise317's printed capital C, exercise318's `2°)`, all constructions/proofs/formulas and actual line wraps. No inferred correction, omitted object, expected-count fitting, manual line count or count exclusion. Original snapshots, page115, other authors' pages and all tooling were left untouched.

## Images and output hashes

Images loaded: one full prepared grid/page116-119 =4, plus one native page117 crop =1; total5 in this batch/context, no reopen or original+grid duplicates. Crop was necessary to resolve capital C and the degree marker; native bounds `(105,1330,1285,1745)`, no rescale. No other image/paid calls.

All paths below resolve from `/Users/yong/.codex/worktrees/a07e/lemmadeck`. Durable output base: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/`; each page has authored/normalized `page.md` and tool-generated `page.json`/`audit.json`. SHA256:

```text
0116/page.md    eaf090f0fc3f22a275330470c80b2855a4da16b300bde1967ef867fbef4ffdec
0116/page.json  d977094105496d48649f721e002f59ab72d3c5966a702ef0b607e8c3039afd04
0116/audit.json 6ea16c23d5c42403853d6bcfcafc5fbabeb9cba8bf637269546a56db9b1f8464
0117/page.md    89cfdcd2709cdc671354a3543d4113ba5b188cb57846527d9321674f7f44d9ef
0117/page.json  a326466dc66f08a173a3f3402deb46cdcf9b04c0ee78523a1780fe509f0e3c21
0117/audit.json d4b38d7894df4f3275454610c77b17f3d9797eba2e3d2640f96c46ce64567495
0118/page.md    20e393b222e9a384b78034896b32a70fb2aa23a3def4883d79a3b0a67fffecc5
0118/page.json  b89f0849594c1d623715effaf74ec586ceca1cc6fd57c6acb400455acf76508e
0118/audit.json 2366be71b57c51839bc487f7dd7f9c32a07950573a3de95606b0d390a7ec27ed
0119/page.md    119baa6328a7b4093b2797c6c5f5a5fe2dc306e5f3d23ae2a9394fa489772893
0119/page.json  e313597aeb23bc96507999b1673eddcecefb6ec193bd3d82cd546fe2297945fd
0119/audit.json cc997d2328b335fa2b60c7971f010fc67c5b3fc6a284971d8dbc73d4d65a9170
```

Generated figure base `.tmp/ld-s10y-lesson/9-10g/pages/` (source crops only, no assembler/vectorize):

```text
0116/figures/fig-127.png 424a268d99a4e9b28c8e80a6756d0b837be1cf4df2f4ee61fc4bf3e001930941
0118/figures/fig-128.png dcb73022404e8920d9fe71196f30b0e7ce9e4aee7e97f5f57d1848dc7b04246e
0119/figures/fig-129.png 82f9977a433ac3b393961c627f630c0b55cb11662b003a9f16bc5f78c625b0c2
0117-reading-crop.png   10db7cd96c3f24e626cf9be1177029c3fb399f66e02d4a7bf284cb873c5f0df3
```

## Boundary appendix: pages120-121

Authorization expanded only to new source pages0120/0121, their generated JSON/audits/crops, and this appendix. Same exact cwd `/Users/yong/.codex/worktrees/a07e/lemmadeck`; original report and pages116-119 remain unchanged. No reprepare, prior-image reopening, assembly, modern/answer/choice work, agents, Git, DB, publication or later-page acquisition.

Preparation receipt `.intentfold/tickets/STEMROBIN-184/tmp/source-9g-p120-p121-prepare/result.json`, SHA256 `100f4dc41d4cb1ebd300407b0381991c1521e8c263e29b66be0a25613f4ccb22`, records one exit0 prepare/page. All four working inputs/page existed and match the eight durable counterparts under `ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch012-source120121-first-prepare/pages/`; copied0/prepared0/rendered0 by this author, no input or evidence permission changes.

New images: one full prepared grid for120 and121, plus one necessary native121 ROI `(100,165,1285,640)` to resolve the final radical. New3 + prior5 =8 total batch/context; no further image loads. Source page.png SHA256:120 `dca58e514d30dd7c6f465676e242ba1b6cc28b1cedca173e0c7bad5c48ac565e`;121 `52524665970229be72997141949f488c32a354fb2f33877caf60c7c8e210ab5e`.

### Real finalize results and HOLD

Exactly one call/page: `.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 9-10g --page N`, exact cwd above; no `--repo`.

| Physical / printed | Exit | Blocks | Printed / Markdown rows | Figure / snapped box |
| --- | --- | --- | --- | --- |
| 120 / 113 | 0 | 8 | 19 / 19 | fig-130: [404,1095,598,398] |
| 121 / 114 | 1 | 11 | 25 / 24 | fig-131: [783,865,464,328] |

Actual121 failure retained: `行数对不上：印刷 25 行，块体 24 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）`. Its generated Markdown, JSON, audit and crop are preserved, not approved. No retry, source revision, count override/exclusion or dependent stage after failure. Both audits otherwise have empty normalization/unknown-character/KaTeX-warning lists. Errata120=0,121=1; no charset/formula/errata-validation failure.

Read-only line-band diagnosis, exit0, isolates the extra count to the first printed formula row: bands `[172,213]` and `[214,255]` cover its vector-angle accents and baseline; the native ROI shows a single `1)...;2)...` printed row. Remaining bands: `[288,321],[338,420],[439,467],[497,538],[565,612],[696,735],[783,824],[854,893],[926,963],[996,1035],[1067,1104],[1137,1175],[1209,1249],[1279,1322],[1352,1391],[1423,1462],[1494,1535],[1565,1604],[1680,1717],[1750,1792],[1823,1865],[1893,1934],[1970,1997]`. Tool remains untouched; post-failure `layout.py` hash is still `052ab1b50fb822ae9b77c3f7936d74cd95ed9193aaaa362b012fbbe5b89f6234`. Parent-owned counter repair/revalidation is required before the four-lesson batch can be considered gate-complete.

### Hash-bound source closure and counts

- Page120 `ex327 cont` closes119's 求作直线A1D与 with BC1的公垂线, then the full printed `2°)` area/distance subquestion. Exercises328/329 are complete. Exercise330* retains its complete statement and printed vector solution, including vector squares, equation(1) and vanishing dot products; `ex330 open -> fig/cap -> ex330 cont open` ends 可能有两种情况：.
- Figure130 is owned explicitly by330. Both а)/б) subfigures remain one numbered source figure, with a/b, M/N/A/B, directed vector m/n/d and AB arrows and right-angle marks; caption is a separate printed row.
- Page121 `p0121#1` is `ex330 cont`, completes both angle cases, both dot-product formulas and the printed final radical. `p0121#2` is the actual `h3` heading §36. 三垂线定理. Thus section35 ends at that adjacent source boundary; no section35 exercise remains open. This supersedes the earlier source-boundary uncertainty, not the failed121 gate.
- Read-only JSON count, exit0: page120 has5 exercise blocks /4 unique IDs (327-330) /1 figure130; page121 has2 exercise blocks /2 unique IDs (330/331) /1 figure131. Combined boundary pages contain5 unique exercise IDs, not seven new exercises; continuations are not duplicates.
- Full section35 source owner set is exactly7 exercises324-330 and3 figures128-130. Figure128 is construction prose;129 is exercise324;130 is exercise330. The118 open construction paragraph closes119. Exercise327 closes120 and330 closes121. Boundary section36 owns exercise331 and figure131, excluded from section35 counts.
- Full121 boundary content is preserved: theorem21's entire statement, proof setup, sufficiency and necessity with the printed black square, and complete exercise331. Figure131 belongs to theorem21 proof (A/B/C/m/alpha, plane outlines, projection/oblique/perpendicular segments and right-angle mark), not330/331; caption `samerow` with the final proof-setup row. Section36 is not claimed complete; no page122 or fifth-lesson work.
- Confirmed source erratum `p0121-math-1` binds `p0121#1` and the exact retained original `$|AB|=\sqrt{m^2+n^2\pm2mn\cos\varphi}$`. Native ROI verifies omitted d^2. Independent coordinate check (exit0): a=(t,0,0), b=(0,s,1), M=(0,0,0), N=(0,0,1), A=(1,0,0), B=(0,1,1) give m=n=d=1, phi=90 degrees, |AB|^2=3; printed radical gives2, while120's equation(1) gives3. No corrected formula was substituted into source Markdown.

Durable output base remains `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/`. SHA256 (0121 entries preserve the failed candidate, not a pass):

```text
0120/page.md    e88dd3425ad578cd0fe2660512451333bbf627464515b94443f16a1690bf9f27
0120/page.json  c01e701d9a729d69759842450709fbc313f377ac09ed0a1c8dfaced0e541a2dc
0120/audit.json df3e978ea5e60e1d7c693a11f7f019903d76711a46e49f78b4984109d040e63e
0121/page.md    9d52cc4ba630c16f434fd4bbf1869a9a183c92a1326c891fdcff1b5ceb9d72fc
0121/page.json  30713ce7b2ef0c5ce8166521c8a37f0170ba4519ebf66713931fd7cae34926ce
0121/audit.json f7939d2d2fe3f8ba160d588d2b4183d736af14c69ce43291c329f2aeea308029
```

Generated crop base remains `.tmp/ld-s10y-lesson/9-10g/pages/`:

```text
0120/figures/fig-130.png 4d263feab200f4c503c12fab90d75e56d7dc93a733cab6e933f5f8a899bbbaba
0121/figures/fig-131.png 01fc492e7d404410f1766ab17e10f9b8ef3272b716778396629ef446080633bc
0121-reading-crop.png   0de774f36654483ee19deb014a5a959bd7a8277d1818e11e43c41d16bf4d991d
```
