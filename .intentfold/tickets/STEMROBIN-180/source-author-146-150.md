# Source Author 146–150

- Ticket: STEMROBIN-180.
- Identity: Codex source author, not an independent reviewer. Independent source review pending; no self-approval.
- Freeze: 2026-11-15T22:07:09Z.
- State: isolated draft complete; all five first official page-level mechanical gates passed. This is not content approval or permission to promote.
- Scope: physical146–150 of catalog6p, printed135–139. Frozen141–145, its144 firstFAIL, prior cohorts and source blocked108 were not read back, rewritten, repaired or promoted. No151+ was opened.

## Paths and Source

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

Draft page MD/JSON/audits: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-146-150/artifacts/6p/pages/0146` through `0150`.

Actual source pixels/grids/layouts/templates and page-local PNG/SVG crops: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-146-150/work/6p/pages/0146` through `0150`.

Existing source manifest was resolved by official prepare to `6-7p 苏联中学课本 物理 六-七年级.pdf`, SHA256 `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`. Every full source render is 1472×2161 at300dpi.

Each full actual page was opened separately. All five layouts and prepared metadata were read. Actual grids were opened for146,147,149,150;148 has no figures, and its full source image plus layout and the escape-speed detail crop were inspected. Every one of the nine finalized figure PNGs was actually opened individually, with full right/bottom contents and external captions excluded.

## Official Mechanical Results

Shared interpreter: `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`.

For each physical page, exactly one invocation of each existing official stage was made:

```text
<shared-python> -B .claude/skills/ld-s10y-lesson/tools/p2c.py prepare|finalize|vectorize
  --book 6p --page <146..150>
  --root .tmp/ld-s10y-lesson/source-author-146-150/artifacts
  --work .tmp/ld-s10y-lesson/source-author-146-150/work
```

No force flag, threshold change, new code, install, stage retry or repair was used.

| Physical / Printed | Blocks | MD / Masked Pixel Lines | Original Tasks | Numbered Figures | Prepare / Finalize / Vectorize Exit |
|---|---:|---:|---:|---|---|
| 146 / 135 | 9 | 8 / 8 | 1 unnumbered | 137,138,139 | 0 / 0 / 0; 3 vectors passed |
| 147 / 136 | 12 | 20 / 20 | 0 | 140,141 | 0 / 0 / 0; 2 vectors passed |
| 148 / 137 | 11 | 24 / 24 | 3 | none | 0 / 0 / 0; 0 figures |
| 149 / 138 | 11 | 24 / 24 | 3 | 142 | 0 / 0 / 0; 1 vector passed |
| 150 / 139 | 14 | 17 / 17 | 4 | 143,144,145 | 0 / 0 / 0; 3 vectors passed |
| Total | 57 | 93 / 93 | 11 | 9 | Five first-finalize passes; nine vectors passed |

All five audits contain zero normalizations, zero unknown characters, zero KaTeX warnings, zero errata and zero errors. Prepare's unmasked line estimates were29,22,24,24,18; they included figure ink and are not the final text counts.

The11 original tasks are: one unnumbered 作业四 task, three questions after56, three questions after57, and four exercises in练习26. All subtasks and question sentences remain within their original task objects. No new task was created from an in-text rhetorical question, from a figure-only page continuation, or from the unfinished58 opening.

First failures in this new batch: 0. Repair consumption: 0. No failure archive was fabricated. Earlier144's actual firstFAIL remains frozen and outside this batch.

## Fidelity and Continuation

- 146's first object is the complete original图137 and its caption, not an empty exercise continuation. It contains the real44米 and88米 arrows, river names and伏尔加河的水面 line. This provides the actual source image for the previously reported图137 reference; no prior page file was modified and no cross-cohort assembly was run.
- 146 preserves the complete作业四 prompt as one unnumbered task. 图138 and139 each keep the whole original water-supply system, including pumps, filtering/settling or intake structures, water tower, main pipe, taps and original Chinese diagram labels. 图139's lower汲水井 label is inside its crop.
- 147 begins “56. 大气压强”. Original bold大气, gravitational air-compression explanation and大气压强 are preserved. Original“几千千米” and“象” are not modernized. 图140 includes the full piston, upward arrow and immersed apparatus;图141 includes the full vessel, stopper, valve, tube, water jet and water container.
- 147→148 faithfully joins “塞” + “子上插着…”. The original evacuation, valve-opening and external-pressure explanation remains complete; no experimental condition was added.
- 148 keeps all three56 questions, then “57. 地球大气层的形成”, the full gravity/molecular-motion explanation and original11.2千米/秒 value. `detail-escape-speed.png` confirms the number, slash unit and all six dotted-emphasis characters in第二宇宙速度, split across two genuine printed rows. The emphasis crosses that row break; no fake extra line or numerator/denominator split was added.
- 148→149 joins “气体分子” + “只能在地球附近的空间中活动…”. Original “自由空气层，即大气” is retained.
- 149 keeps5.4千米,11千米,1/2 and1/4 exactly. The two tall fractions belong to one printed row and were transcribed as one row. The full density-height discussion, diffuse atmosphere boundary, molecular-distribution description, and all three57 questions remain present.
- 149's图142 retains its full enclosing rectangle and original nonuniform dot distribution; no dot count or invented quantitative calibration was added. Its caption shares the printed row “也不处处相同，底部的压强大于上部”, with `samerow` and genuine `p open/cont` around the figure/caption. The complete subsequent container-density/pressure caveat is retained.
- 150's练习26 has all four original tasks, including the whole multi-question automatic watering-device task. Bold移液管 and滴管 are preserved. 图143's two states, fingers, drops and both receiving vessels remain one numbered image;图144 and145 each remain complete. Their three captions genuinely share one row.
- 150 begins “58. 大气压强的测量 托里拆利实验”. The original transliteration托里拆利, “象”, and§53 are retained. The opening paragraph stops at“不行” without sentence closure and is `p open`. No151+ read, invented continuation, complete58 claim or promotion.
- No instructional footnote occurs here. `foot` blocks contain only printed page numbers. Tiny isolated page-edge marks were not treated as textbook wording;150's right-top hairline scan marks are explicitly noted.

No source wording was declared unreadable. Independent review may still identify transcription or crop defects; these author observations and mechanical results do not substitute for that review. Joined lesson rendering was not run because assembly is outside scope.

## Exact Crops and Observed Vector Results

Official snapped boxes are `[x,y,w,h]` in source pixels. Actual PNG dimensions include the existing crop tool's blank12px padding on each side; no caption pixels are copied into that padding. Crop PNG total:70,323 bytes. SVG total:551,218 bytes.

All nine existing potrace/resvg checks passed at unchanged2% mismatch limit and1px edge tolerance. The percentages below are actual CLI stdout rounded to three decimals; `0.000%` is not a claim of mathematically zero difference. The CLI did not persist full result JSON, and no second vectorization was run to obtain more precision.

| Page / Figure | Snapped Box | Actual PNG Pixels | PNG Bytes | SVG Bytes | Observed CLI Mismatch |
|---|---|---|---:|---:|---:|
| 146 / 137 | [358,245,792,278] | 816×302 | 12655 | 96465 | 0.000% |
| 146 / 138 | [466,918,593,449] | 617×473 | 13375 | 115503 | 0.006% |
| 146 / 139 | [423,1440,623,485] | 647×509 | 12652 | 92999 | 0.002% |
| 147 / 140 | [311,1528,179,304] | 203×328 | 2572 | 13627 | 0.038% |
| 147 / 141 | [1036,1493,171,343] | 195×367 | 2807 | 15610 | 0.029% |
| 149 / 142 | [1080,725,109,368] | 133×392 | 6231 | 65213 | 0.000% |
| 150 / 143 | [395,555,164,672] | 188×696 | 5761 | 30710 | 0.006% |
| 150 / 144 | [753,739,60,397] | 84×421 | 2099 | 7635 | 0.000% |
| 150 / 145 | [1010,591,204,592] | 228×616 | 12171 | 113456 | 0.108% |

## Frozen SHA256

The MD/JSON/audit paths are under this batch's `artifacts/6p/pages/<page>/`; original rendered PNGs are under `work/6p/pages/<page>/`.

| Physical | File | SHA256 |
|---|---|---|
| 146 | page.md | `4a39b72df343ed7972841718c160b26031aa36f3b2cfd5d2108a5e0ca51f8377` |
| 146 | page.json | `7b3581531e5994015f8284f0c9781ed1f331b94c10e40157d183488d5fa03f13` |
| 146 | audit.json | `323709e32566838bf741f87c2c27f97a84eaa7545728dc72ceda80140ec1d77f` |
| 146 | page.png | `2fe6acd99264db8c6d82b5c8fcfb4a7b0cab34f8b2e3c9f058c8d9d34de6ff74` |
| 147 | page.md | `8df7c8b3c34dde632a63986fd82f7d8107631b466216c71a0a07e9f16eb836d8` |
| 147 | page.json | `a9e975107c3b24509c0af297ed42757d97cbf9084e577fdd4d4226dbdcd61758` |
| 147 | audit.json | `d5baf26f9d5020d386d17ed04f2d5dbfee010da0578933fa036d1b8dac376fb2` |
| 147 | page.png | `a2bff5941d129d793a0a75c5a48273832ad468193854aa88bacfefbbbe51c6e1` |
| 148 | page.md | `b780eb9804c37799bf4c2b82be9c0cbfdcb18a1678618096184619ca37ef1181` |
| 148 | page.json | `a95bc04c6b4a7c3455a6544d7e16242f545a18e86d830a09a879d9037cbdcbb0` |
| 148 | audit.json | `0d42855e888f977836b3dec52d1b8a87e22b02bded6c7ad1ab2b9cf09124d993` |
| 148 | page.png | `f1228c71c16db4dec1f97bd77af066306ba9bbd808e110edf92b5fb50bc0d700` |
| 149 | page.md | `332b5f349c0a59bfc75ea25393d44ac7cdcb503430200c4d12f96d5dd3555ab6` |
| 149 | page.json | `d2613f937287ab1b99de393c6edadd090a33a111792e5bc5153296e7057f73af` |
| 149 | audit.json | `4bc7b93882bbb5bf3ca0d0c35fd17a08d94cdc6e78b99f81e0682285ecfd3e6d` |
| 149 | page.png | `d9159d517b88d2ffb22732dcbc70b7e9a612d6d75441fd84207371548cce71d2` |
| 150 | page.md | `4df2cf9f60027df21a4d31dbbb11129c67e5cae0d989e79fa54679dbe72da79d` |
| 150 | page.json | `c0d6efbb2d2826efc2262ead52213cc82dbc8ce74f2d4e30ccf0e20586ac4b1f` |
| 150 | audit.json | `ac085ec6f761425e1522a78c857703ecfd1ccaf1494afed8f3917f5a563058c1` |
| 150 | page.png | `ae6a0bd2f575404856fb05894dcb3bbb8004e6ea551a081a4bc52e88ddf6a653` |

Figure files are page-local `work/6p/pages/<page>/figures/fig-<number>.png|svg`.

| Figure | PNG SHA256 | SVG SHA256 |
|---|---|---|
| 137 | `1278eefcbec71dccd7c7cbf30e8fa8ad9675c66d6d29180a6c6af3065c6ad753` | `8ec7efb1b65dfab2f216896e58e2ba201b40d024c63b304a31c8bfdfb83276ac` |
| 138 | `f0dbfafc97409bc90f11ff5e67c3e1c115bed282eb19c807524c7447470b3eb1` | `57e5bf583fb6bcb28be3e205a2abf56847803783f641f6dc64ad00e54e882c27` |
| 139 | `e51645cf6a04c0e4eeea49a618dfeee056235b8dc506fd03a1c5820eb35d2532` | `c03eed6c064a874bc6a0d0dda6c76797f6ffbac8e6f7feefe8487f779ac4b1bc` |
| 140 | `1607d873e47e08f16f4eb4c777cae59ec7187d94476b0b223fd8d3d4f1fdd1b9` | `c1e83c401341949b63a8bb5ac739f62532a4f66c74b4d01962871f0b55afd5b2` |
| 141 | `08ee2794b8dd4008a74f78eb3b72794fd3606cc1cacb0a232a658748a4ce4825` | `77cb211129319c4cf927d4f726cf284680d1bf6df2e91ac4188908086c5c8f30` |
| 142 | `5483c38bc02bd0348e74726de343cae3f2124ca26b8a8177fffecfa336cb0b14` | `696d28a506f94e2d9f8619017863c348137e34e6f433a6dd00b4b825d4a8eba7` |
| 143 | `8f31c9fc0692b1c5e2c6a639049a9ff03b28dc0e1d03912eefe49d717d981dc9` | `5d920fe14c0a2ccc65148caed62917eb13d661771062ef50e980cf8e2b828f2a` |
| 144 | `5c93df219f07734a28a5e546c5ecc27de7b905ce4addda655b64377d9832973d` | `30f59f453c815bc477ab910a1bba6df7e218f1e64dcabb7a10c03029537c35f7` |
| 145 | `1bf99fa5f604a6b033e1149d59d22c71baaa8af610a743efaf843f4fdc3b7d34` | `4986d3718d76022a29236c68f4aec3f741b5e5abf0e1cc0ff5d341b1dde361a9` |

Actual source detail: `work/6p/pages/0148/detail-escape-speed.png`,13341 bytes, SHA256 `ab653daa7e3dc611077429c0ad8c8c1162c9dd884c693e6afba3c2640206ec6c`.

Canonical53-file frozen manifest SHA256: `0857b59f4b61e69f1c720da88aebf25375cdc4c0526213bc7ad2c8188ec47074`. It binds15 page MD/JSON/audits,20 prepared page PNG/grid/layout/template files, and18 figure PNG/SVG files. Derivation: one UTF-8 line `<sha256>  <path-relative-to-source-author-146-150>\n` per file; lexicographically sort the complete lines, concatenate, then SHA256. The additional escape-speed evidence crop is separately hashed above, not counted in53.

Unedited existing tool/profile snapshot at freeze:

| File Under .claude/skills/ld-s10y-lesson | SHA256 |
|---|---|
| tools/p2c.py | `483ebed7d79146af36e547a3d8c88ac4fdca06944fb46c759f83e2cb14a6b06b` |
| tools/layout.py | `9723a80790ee216716e4a6097c77a57cc9bf4deab78da0250f851ad6bb7d9435` |
| tools/blocks.py | `b21f0af41a8f623cfb11e29014e6d7174aafb206a0fc1463678c3496fc8f9d82` |
| tools/vectorize.py | `95e672e3646a0d77deb136e4a0427acef5d0d3543138c242f9ae3dfe83b48e8e` |
| profiles/soviet-cn.json | `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849` |

## Handoff

Ready for independent full source review of these frozen draft bytes. No independent PASS record, assemble, durable promotion, index/publication, Git, DB, app, dependency installation, model/network service, answer/choice reading or browser was used. The58 opening remains an explicitly incomplete next-page object.141–145 remains untouched while its review and any authorized minimal repair are handled separately.
