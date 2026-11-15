# Source Author 141–145

- Ticket: STEMROBIN-180.
- Identity: Codex source author, not independent reviewer; Sagan review pending. No self-approval.
- Frozen at: 2026-11-15T21:49:56Z.
- State: isolated draft complete; physical 144 mechanically BLOCKED on faithful original circled subquestion characters. Other four pages passed their first official page-level mechanical gates.
- Scope: physical PDF pages 141–145 of catalog 6p, printed pages 130–134. No earlier cohort was reopened or changed; no 146+ read. Source blocked108 and the unrelated modern107/108 figure work remain unchanged.

## Paths and Source

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

Draft pages: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-141-145/artifacts/6p/pages/0141` through `0145`.

Actual page pixels, grids, layouts, templates and page-local PNG/SVG figures: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-141-145/work/6p/pages/0141` through `0145`.

Source manifest was resolved by the existing official tool to `6-7p 苏联中学课本 物理 六-七年级.pdf`, PDF SHA256 `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`. All five page renders are 1472×2161 at 300dpi. The shared interpreter was `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`, reporting Python 3.13.13.

Each full original page was actually opened separately. Layout JSON was read for all five pages; grids were actually opened for 141,142,144,145. Page143 has no figures and its full pixels and layout were sufficient. Every finalized crop was then actually opened individually, including complete right/bottom contents and exclusion of its external caption.

## Official Mechanical Results

Each page had exactly one official `prepare`, one `finalize`, and one page-scoped `vectorize`, with no force or parameter/threshold changes. Commands used `-B .claude/skills/ld-s10y-lesson/tools/p2c.py`, `--book 6p`, the relevant `--page`, `--root .tmp/ld-s10y-lesson/source-author-141-145/artifacts`, and `--work .tmp/ld-s10y-lesson/source-author-141-145/work`.

| Physical / Printed | Blocks | MD / Pixel Lines After Figure Masking | Logical Tasks Starting Here | Figures | Finalize Exit | Vectorize Exit |
|---|---:|---:|---:|---|---:|---:|
| 141 / 130 | 8 | 7 / 7 | 0 | 126,127 | 0 | 0: 2 passed |
| 142 / 131 | 10 | 14 / 14 | 0 | 128,129,130 | 0 | 0: 3 passed |
| 143 / 132 | 12 | 25 / 25 | 6 | none | 0 | 0: 0 figures |
| 144 / 133 | 14 | 17 / 17 | 2 | 131,132,133,134 | 1: circled markers | 0: 4 passed |
| 145 / 134 | 10 | 15 / 15 | 2, plus one incoming continuation | 135,136 | 0 | 0: 2 passed |
| Total | 54 | 78 / 78 | 10 distinct source tasks | 11 | Four passed, one blocked | 11 passed, zero over limit |

All five audits have zero normalizations, zero errata, zero KaTeX warnings. Page144 has exactly three unknown characters and one aggregate gate error; the other four have no audit errors or unknown characters. The prepare line estimates included diagram ink and were 21,24,25,29,27 respectively; they are not the final text-line counts.

There are 13 `ex` fragments, not 13 tasks. The ten source tasks are the three “问题”, the three “练习25”, two “作业一” tasks, and the one unnumbered task in each of “作业二” and “作业三”. The three circled subquestions remain within 作业一第1题, rather than being promoted to new tasks. Both 作业三 paragraphs remain one task.

## Fidelity, Boundaries and Blockers

- 141 starts a newly indented paragraph about 海底潜水考察箱, then “55. 连通器”. Its ending “这样的” is `p open`, continuing as “容器叫做连通器” on142, across the intervening figure.
- 142 preserves all experiment actions and references to the three original 图127 subfigures with Cyrillic а/б/в. 图128 remains one whole three-apparatus image; 图129 remains one whole three-configuration image. 142→143 joins “自由表” + “面总是在同一水平面内”. Source bold and dotted emphasis were distinguished; page-fragment bold markers are closed within each page. Joined typography was not assembled or rendered in this draft-only task.
- 143 preserves both separate numbered groups 1–3, the original “小于” density/height statement, and the water-level, surveying and artesian-well exercise wording. It has references but no fabricated image blocks.
- 144 preserves 图131's full two-line caption and its 1/2/3 legend. 图132's caption shares the first caption row of 图131, not its second legend row; this physical relation is explicit in notes and `samerow`. 图134's caption shares the row of subquestion①. `ex 1 open/cont` preserves the wrapped task around figure/caption, without splitting it.
- 144's first and only finalize rejected the real source glyphs ①(U+2460), ②(U+2461), ③(U+2462). Line count is correctly 17/17. No replacement, deletion, code/profile repair, retry, or claimed PASS. Repair consumption: 0; this requires authorized handling outside the present author scope.
- 144 local crop `detail-task-1.png` confirms “比较高的，各面” uses a comma and the material reads “铅铁桶”. `detail-subquestions.png` confirms the three circled subquestion markers. A tiny isolated dot follows③; it was retained as `③.` with an explicit uncertainty note about print punctuation versus scanning speck. No other wording was declared unreadable.
- 144→145 completes 作业一第2题 “随便什” + “么地方…”. 作业二 keeps its proof request and printed hint. 作业三 keeps the complete ship-lock prompts and original 伏尔加河-顿河/列宁通航运河 historical naming; no answers, modernization or new physics conditions were inserted.
- 图135 retains its original machine-room, earth-dam, concrete-dam, upstream/downstream and lock labels. 图136 retains both boats, the rightward arrow, I/II/III and A/B, with no invented readings or dimensions.
- 图137 is referenced on145 but is absent from the owned141–145 pixels. No146+ was opened. The next source cohort must close this image dependency before any complete-unit assembly; it is not claimed missing from the book.
- No instructional footnote occurs in this batch. Page-number `foot` blocks contain only the actual printed page numbers.

First failure archive: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-141-145/failure-01-p0144-original-circled-subquestions/`. It contains the immediate failed `page.md`, `page.json`, `audit.json`, the entire pre-vectorize `work/` page material including crops and both detail images, and `finalize-result.md` with observed stdout. A read-only comparison confirmed all 13 archived source/evidence/crop files still byte-match current counterparts. The first failure is retained, not overwritten.

## Exact Crop Bytes and Observed Vector Results

Boxes below are official snapped source coordinates `[x,y,w,h]`. PNGs include the existing crop tool's 12px border on each side. All numbered groups were kept intact, and external captions were not baked into crops. PNG totals: 1,074,952 bytes. SVG totals: 678,072 bytes.

The mismatch column is the actual official CLI stdout percentage rounded to three decimals, not a claim of unrounded precision; in particular `0.000%` does not establish exactly zero differing pixels. The CLI did not persist full vector result JSON. Its existing resvg self-check accepted all11 with the unchanged 2% limit and 1px edge tolerance; no second vectorization was run.

| Page / Figure | Snapped Box | Actual PNG Pixels | PNG Bytes | SVG Bytes | CLI Mismatch |
|---|---|---|---:|---:|---:|
| 141 / 126 | [297,365,919,680] | 943×704 | 297221 | 48424 | 0.001% |
| 141 / 127 | [315,1385,903,510] | 927×534 | 213549 | 54433 | 0.011% |
| 142 / 128 | [429,440,636,495] | 660×519 | 10690 | 44641 | 0.014% |
| 142 / 129 | [240,1635,444,268] | 468×292 | 6347 | 37221 | 0.009% |
| 142 / 130 | [916,1592,251,314] | 275×338 | 3805 | 18522 | 0.008% |
| 144 / 131 | [268,230,293,327] | 317×351 | 5830 | 34157 | 0.008% |
| 144 / 132 | [867,265,424,251] | 448×275 | 3099 | 13558 | 0.000% |
| 144 / 133 | [297,710,921,339] | 945×363 | 25119 | 189298 | 0.009% |
| 144 / 134 | [1033,1369,191,293] | 215×317 | 3786 | 30062 | 0.012% |
| 145 / 135 | [220,1129,1107,404] | 1131×428 | 381805 | 161439 | 0.013% |
| 145 / 136 | [402,1660,721,265] | 745×289 | 123701 | 46317 | 0.005% |

## Frozen SHA256

Page MD/JSON/audit paths are under this batch's `artifacts/6p/pages/<page>/`; PNGs are under its `work/6p/pages/<page>/`.

| Physical | File | SHA256 |
|---|---|---|
| 141 | page.md | `210a23b6271e486f984f7c91ffc1b29cdef9dbe181c1af5d3d080d8c57452691` |
| 141 | page.json | `20b5b8d45e4457fd0077569e2ce51df3d4660636a22f9e0ba5f1b76fbd1acbf1` |
| 141 | audit.json | `40dc48650030d4c8b1d224065a4fe8ca9d733933b9606e04074cc903c0cd2c89` |
| 141 | page.png | `2d4842fe95832914110b52124a61f0e741498e38d51939d9e48643b398684348` |
| 142 | page.md | `78179346bc7a01b219c1497bca085a3339d504f8fac5207f20434931e0992126` |
| 142 | page.json | `8b00c46c297a0cee7b0da5ca5f5a553b8c7d26db7f83754a3fa2a062a43ccaae` |
| 142 | audit.json | `319ca71cb19301975e36ccd910fb958fed8038dd2c05c29926bb1f57dc2cfe37` |
| 142 | page.png | `e0549c378e29567197ea001a41da377fae45ffb3ee0838a61fea59ea6195b521` |
| 143 | page.md | `a087a738a208ba18d98b665d0cb5d414b6b0b00a67fcaea02a11f7ea0259375e` |
| 143 | page.json | `32238a5dcad1f8453c70d99cd9e4bb00b80850fd89ce51054efedd9d2eee6c7f` |
| 143 | audit.json | `7557be0e8f89d757f93681a22ea1dbaa1f9a151c9f3bb23e0c8c1447a14d058d` |
| 143 | page.png | `bdc8926973df6afa77611a326e634c131aed7cab45bb7ad955b08ee93e9498d4` |
| 144 | page.md | `490411e389ec9513a51087212e46dfdcea977cc4831c3b1739920b126490d6f1` |
| 144 | page.json | `67b7b2253437aba745ab9f086a2a97b1ef05aae46f3e28cfaf75e448e9364ed8` |
| 144 | audit.json | `c35ff116ae8b511276fa266d95ab3536ad59a122e70c32206a60f6f144c61128` |
| 144 | page.png | `299a9a440c949dd0f82c30bfe2ea026e7e0e25f7188b99b2f47d2219ead9bbbc` |
| 145 | page.md | `e27f1ec56bdb203ce075b257d06917ba9fd7be0b204c6beeea7a37f02dbf4939` |
| 145 | page.json | `a95ea2cfd8b0a48a2804da4442fc9bbeca26473a5c50b0ae0822271e338961a8` |
| 145 | audit.json | `b54e3c04abc32a2a4bca502900e88f0c44ae0f19ae7e9a66516873c73ddab6cf` |
| 145 | page.png | `cc30f88ebbf60842adb0bdb6266a46365273e17ca0d7776aafaf74d13f854141` |

Figure hashes refer to each page's `work/6p/pages/<page>/figures/fig-<number>.png|svg`.

| Figure | PNG SHA256 | SVG SHA256 |
|---|---|---|
| 126 | `9fa43056425519df9929653387fe6058d1a50c0de3c6a264606c6c5a6f26342c` | `656bbb5c756d2a2765fe0590ade557dda389b1ffa2406a614df5681a43ec1893` |
| 127 | `57efa5cc541f742f8a3a8e828268a4642fad3e144a31eb21b3be7cebe080b7b2` | `3994c51940f55fea76dae0afc96ee7c8b8760c0c75986b08fa4eb11611d4aa5b` |
| 128 | `ca78af75eb4ef899b2897b33aba479fa45825bde9157593e3329363c0a03395b` | `b93060734d56aa0d4c3823d088e89fc0396e45e03da513be3a250b095e634039` |
| 129 | `258536473afd63d0a510a7e5dc25654db188b6ff04d6a5235ef0920ef3f1db09` | `f787e23717ece5dd88d7c5efe415aaae55e2bdb01c2ef41324776506aae49511` |
| 130 | `539ff5e0dcb75011b31210064fcb50232effb3a402ce186babfc782c4ac1f94a` | `96ab8f5a8e87b4c6610ca24a714b0d16437d8ec87825b7665547f091f39b8e2a` |
| 131 | `6cd9b3bfb0d7716f6a5520a79e2c713cb9994967e3ec48fa8a2901e7d51173c1` | `4ee46c3f4604f10d0af5f618c132dfd17277e37c3c4d837d836ec9ada4c2cbcf` |
| 132 | `9f372ffa4fac4f737574778f44e9b27029760c6d8f206129e04f6896c1300266` | `d2f658120bbd149253f85f1510c5f2cb03509a04b2d0191698596e575a209c13` |
| 133 | `6f452d0a6abd02e13158f6c6336b13a27e04a6e9444d291823070ab25b66be7d` | `ac9201c7491e38594de2c20e3a860f6c2489033887350c594b83239f0f0e42f0` |
| 134 | `151853a5aa35d1ddf0f478fe6bbd24eb816259a6d5e91d70fcb0ac37e678f3d8` | `dc7f790ec714bd3e866387d2475b873dace4da4562d0e156a8834bcea8f97631` |
| 135 | `151d990754dc06d2a511389d14ccaf3edc2d19d919fb2ef4d239f52c005f926f` | `134bc19564ae831146051a86812dea7ca41c312085f1cba0eee7539c2dc8422b` |
| 136 | `e3e895c02f659ec49d6062144b30a50cc82a4d444421fe7c94bbc78c9c16b981` | `0940a97d3d34da0bee386fc1454fe94ab9f1de3282acc7e18d2987328551ebf1` |

Additional actual evidence crops on144:

- `detail-task-1.png`: 10441 bytes; SHA256 `136a2664998f71d9e1ea69bb27bf7f637aa659128bbfda620aef1895e9d8e824`.
- `detail-subquestions.png`: 16337 bytes; SHA256 `00c8a90f121269b6333677c66b28ea6b4f17da2d56d325c1bfdb1967b37e40a3`.

The canonical 57-file frozen manifest digest is `e2925c1586589b3292601f3a219c0128c9cbdea1bf55954a65663d4c87185b0f`. This binds each of the five `page.md/page.json/audit.json`, each `page.png/page.grid.png/layout.json/page.template.md`, and all22 figure PNG/SVG files. Derivation: form one UTF-8 line per file as `<sha256>  <path-relative-to-source-author-141-145>\n`, sort these complete ASCII-path lines lexicographically, concatenate, then SHA256. Evidence detail crops and the preserved failure directory are additional files, not silently included in that57-file digest.

Current existing tool/profile snapshot hashes at handoff, without any edits:

| File | SHA256 |
|---|---|
| tools/p2c.py | `483ebed7d79146af36e547a3d8c88ac4fdca06944fb46c759f83e2cb14a6b06b` |
| tools/layout.py | `9723a80790ee216716e4a6097c77a57cc9bf4deab78da0250f851ad6bb7d9435` |
| tools/blocks.py | `b21f0af41a8f623cfb11e29014e6d7174aafb206a0fc1463678c3496fc8f9d82` |
| tools/vectorize.py | `95e672e3646a0d77deb136e4a0427acef5d0d3543138c242f9ae3dfe83b48e8e` |
| profiles/soviet-cn.json | `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849` |

## Handoff Boundary

No assemble, durable promotion, index change, final publication, modern lesson authoring, answer/choice reading, DB, app, Git, dependency installation, model/network service or browser was used. There are no new independent-review records. Ready for Sagan's source-first review of these exact isolated bytes; physical144 is explicitly not mechanically approved, and 图137 remains a later-cohort dependency.
