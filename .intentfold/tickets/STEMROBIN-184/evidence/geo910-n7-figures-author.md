# n7 Figures17-20 Scratch Author Handoff

Date: 2026-11-16. Ticket: STEMROBIN-184. Parent-agent delegation under the existing ticket/Charter, not new direct item-by-item human or budget authorization.

## Scope And Final Candidates

Scratch only. Existing JSXGraph FigureSpec validator/renderer used without code, algorithm or dependency changes. No Azure, answers/choices, source/edition/manifest edits, DB, Git, promotion or record_review. Earlier figures72/75 untouched.

Final candidate directories, all absolute:

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/fig-17/repair/`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/fig-18/initial/`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/fig-19/repair/`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/fig-20/initial/`

Each directory contains complete `fig-N.spec.json`, `fig-N.svg`, `fig-N.render.json`, renderer `fig-N.whole.png`, actual `preview-whole-240.png`, `preview-whole-346.png`, `preview-whole-640.png`, `preview.json` and `execution.json`. Nothing was changed or rerendered after the parent's latest independent approval message.

## Source-First Order And Context

Each original faithful PNG was opened singly and its own source-inventory.md frozen before official contexts or the parent's inventory. Complete faithful n7 lesson.md, lesson.json and all13 exercises44-56 were read; exercise53 already includes its printed solution. No separate answer artifact was read.

After those inventories, the four official context.json files were consumed. Only the Figure Inventory subsection of the ticket's `tmp/geo910-n7-source-first.md` was read; its solutions remained excluded. Parent source inventory agrees with this author's source observations.

A read-only final binding check confirms exact string/order equality between each spec's authoritativeText and all corresponding official context nearbyText/exercise text: fig17 five entries, fig18 five, fig19 four, fig20 one complete exercise53 including its source analysis/construction/proof/investigation/method notes. Source image paths/hashes match those contexts.

The first version of this read-only check mistakenly selected prose.text instead of prose.nearbyText and raised AssertionError against undefined. Correcting that verification expression yielded the exact comparison above; no candidate, context or renderer change resulted.

Original PNG bindings, rehashed from current bytes before this handoff:

| Figure | Original PNG SHA256 |
| --- | --- |
| 17 | `0b4ffbcd3332c2a401aedde26e5584bc4e522e3cd4b66430a25ca2d4831fabb5` |
| 18 | `abda4d00e1a5bcd52763ac63a14a20c3fda3148d7a63db5b04ab6d3ed31b9a3e` |
| 19 | `d25e282b0d3e79fc8b02b529183eaf4cf0a6823a47949053134887d878c458d9` |
| 20 | `6549346703172e58778dbe241223a400d9f33854cfed34a2440fdb2a51492f37` |

These original paths are `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-N.png`.

Faithful lesson bindings from the earlier source-first freeze, not a new claim of rechecking those files: lesson.md `e18e3f341c77a116c71d358611651c0708c38b680a9b01ee99649bef0f9974c6`, lesson.json `f5bbd75eec0d897de1eac552492ce0f232a621449dc68beff41a722f57da5b9a`, exercises.json `caab8cb92e3a4347b05553f6e55be83965b4f6daf30dc7f09f5dad260ef435b1`.

## Actual Attempts And Changes

| Figure | Renderer attempts | Actual result | Final objects / labels / assertions |
| --- | --- | --- | --- |
| 17 | initial then one repair | initial FAIL, M bbox top-boundary collision score12295.99609375; repair renderer pass | 8 / 4 / 12 |
| 18 | initial once | renderer pass | 10 / 5 / 12 |
| 19 | initial then one repair | initial FAIL, beta bbox/stroke collision score10000; repair renderer pass | 18 / 4 / 23 |
| 20 | initial once | renderer pass | 34 / 8 / 48 |

Initial17/19 complete spec/SVG/wholePNG/render/execution bytes remain intact under their initial/ directories. Their exitCode2 and full renderer stdout/stderr are retained in execution.json. No third attempt occurred.

Exact parsed initial-to-repair diff: fig17 only `/objects/7/at/1`,388 to368; fig19 only `/objects/15/at/1`,455 to430. Both move only an existing label down in screen space. All other JSON values, source text, geometry and assertions are unchanged. Before its first render, fig18's unrendered draft M label was moved385 to365 for sufficient top margin; this was not a repair of a rendered result. Fig20 hatch endpoint arithmetic was made exact before its first render, with normal assertion tolerance rather than a loosened tolerance.

## Source Mappings And Actual Visual Observations

- **17:** all four labels alpha,a,b,M; one complete plane patch, two full line spans, one marked M on a. Assertions bind M incidence, a/b projected parallelism and b/alpha-label placement in the patch. Three whole previews actually opened separately; the repaired M has clear top margin. No invented N, endpoint dots, length or angle marks.
- **18:** all five labels alpha,a,b,M,N, two marks on a, complete patch and separate b. Source M/N projected incidence has pointRelationships coverage. This is the source's rejected supposition, not a realizable contradictory conjunction of true spatial parallelism and intersection. No assertion claims that conjunction or actual skewness. Three whole previews actually opened separately; neither label nor point is clipped.
- **19:** two complete plane patches, four labels alpha,beta,a,b, no named points; shared b and parallel a preserved. Separate solid/dashed segments retain rear-alpha broken spans and the upper-beta broken span, without solid polygon borders underneath dashes. All12 boundary/line segments have endpoint assertions. Three whole previews actually opened separately; beta now clears a. No perpendicular/equal-length assertion or invented named projected crossing.
- **20:** all8 labels/points A,B,C,D,M,N,P,Q, all6 complete tetrahedron edges, closed N-M-Q-P-N section and separate dashed BC/NP. M-AD,N-AB,P-BC,Q-DC have collinear assertions covering every source point in the incidence group. Six wireframe edges and all4 section sides have connects assertions; source MQ/NP parallel AC is retained in the affine screen projection. Seven thin oblique hatch strokes are confined inside the section with endpoint-inside/connects/parallel assertions. Three whole previews actually opened separately; all labels, full edges, both dash roles and hatching visible. AD's hatch/NP screen crossings have no extra dots or physical-incidence claims.

Modern choices: cleaned affine canvas coordinates and very light neutral plane/section fills, not inferred source measurements. Fig20's seven regular inset hatches preserve the whole source hatch field/direction but are not a pixel-certified original hatch count. The source supplies no tetrahedron dimensions, regularity or M/N midpoint ratios. The already printed worked section is retained, not new answer leakage or a figure repurposed as an unsolved task.

## Display Evidence And Limits

All four specs declare instructional inline maxWidth640 and widths240/346/640 with minimum16px. All final renderer reports have zero collisions. Actual final text measures18,25.95,48px respectively. Preview DOM checks found all text footprints inside each full canvas and no pageErrors.

Fig17/18 have640x420 canvases, with CSS preview heights157.5/227.0625/420; fig19/20 have square canvases240/346/640. The twelve whole PNGs were actually opened one at a time. Initial17/19 whole failure PNGs were also actually opened for the targeted diagnosis; width previews were not produced for those failed initial attempts because the runner stopped on the real renderer failure.

Runner: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/n7-render-preview.mjs`; SHA256 `67fb958001ef196675a862d53b4bd4564f10374a109ff49e03a9442c47777790`.

Execution used existing renderer with the existing lesson Python environment, PWDEBUG unset, fresh isolated headless browser contexts, no CDP/user profile/OS input/auto-open. Width-preview HTTP requests were blocked. No app or service was started. These are actual scratch media-width checks, not a claim of a newly measured offline learner/product surface; preview.json explicitly states productMeasurement:false and independentReview:pending.

The parent now reports its own independent full-text/spec/source-inventory and640-neutral/240-neutral/346-print visual/math PASS for all4 current candidates. That is the parent's review, not an author self-PASS or a record_review file from this author. Parent owns recording review and promotion against these exact bytes.

## Current Candidate Hashes

All below were computed from actual file bytes after rendering and before writing this handoff. Filename rows resolve inside the corresponding absolute final directory listed above.

### Figure17 Repair

| File | SHA256 |
| --- | --- |
| fig-17.spec.json | `c600734f63f2b292b4d8d3d99a0626b00a9361617d0b3691fdb5f94993e51b51` |
| fig-17.svg | `64592b506fbdca07f3f5439f081d31c09d7fb738d0a870fae6a5cbf62bb664c0` |
| fig-17.render.json | `8ee50a6fc94b9bdca588bf1a63abed781e7661de11d2095efa96438c30c8e07a` |
| fig-17.whole.png | `1af9dd27c2786a0c1c849de4ff1bca0b988e9377f978fb677306c152ccef6b8e` |
| preview-whole-240.png | `7156e2cad29e23682e5edecb42a90fafd8da0b48ebc3fb4982725f69e580dc1d` |
| preview-whole-346.png | `9683f521280ace4312751f6bcda627bb54b457aec45785f08e7dad1820abbfdf` |
| preview-whole-640.png | `1af9dd27c2786a0c1c849de4ff1bca0b988e9377f978fb677306c152ccef6b8e` |
| preview.json | `fcaa71e580939ac9d92f7f1d520104359007702154b581f245c8744357a1470b` |
| execution.json | `813cf1122b9caa3964d864c70e8c2b55172d9d106ca00b22cf14b6891c489e68` |

### Figure18 Initial

| File | SHA256 |
| --- | --- |
| fig-18.spec.json | `61ae8c4cfc0dd759937a5ed20907047bee6d3115314c85188cd071a41cc0d09b` |
| fig-18.svg | `d9e086619150971f8a7da069b796f954c68cdca36b31b655c06b93ba9010e2fc` |
| fig-18.render.json | `5f363cfb557cbb19779bb523cc2efd131d1540d525a56b601ed3e4b816c5707b` |
| fig-18.whole.png | `7a627e491138f4d4ae22f629e21ca754f7de83cb2f89842d1a2f6a191fe7d8ec` |
| preview-whole-240.png | `126ff7a7e307d2f465280e1bb4738e42f772c7a0b18b927e697c3340a3ebc953` |
| preview-whole-346.png | `3009045318e21949cafebe3b48d61e0bbb8357f021204a12a34479709d8c08a0` |
| preview-whole-640.png | `7a627e491138f4d4ae22f629e21ca754f7de83cb2f89842d1a2f6a191fe7d8ec` |
| preview.json | `30772b9ea7dc2c3df89c7372267894f0c0562e37239a008634e4ea0bc4e7b492` |
| execution.json | `78a6ce1ddf492d2c0c60a04e09341621df729855bbbae5d07a3b04699fb58af0` |

### Figure19 Repair

| File | SHA256 |
| --- | --- |
| fig-19.spec.json | `afa227c32e03d6dd43b77b7bdc2faecc53f4c2f7bf17e689aff7f1adaeab6c2b` |
| fig-19.svg | `ea4423fa1f9ff308cccd91ac9aa2187635904f32125fa14095adff16e3264433` |
| fig-19.render.json | `cb205023a2f87012b6245af5d553c0cfb6f15e5bf0a28b5570fd9a7f3df44a21` |
| fig-19.whole.png | `113e59c255eb184fb3b3371328ccb90d6acc6d4c44c371e23a2a143109e64bf8` |
| preview-whole-240.png | `06a57fd103f28ffcbbeb971358e46e651bc3f945946b7325ae68a4c87a8758f9` |
| preview-whole-346.png | `8193c22ebf2f57b49da5f6b334c867dbd4887778c5eee39c5579d34720ab6195` |
| preview-whole-640.png | `113e59c255eb184fb3b3371328ccb90d6acc6d4c44c371e23a2a143109e64bf8` |
| preview.json | `022016f848a59d16b9556b35a3dfe2d6428b350f2af5f41ddf7dfad59e21f819` |
| execution.json | `6e01db6aa7a500ab58f49ff1f6ca9d2095d5d644170ba98aa2d08deed2b3bde6` |

### Figure20 Initial

| File | SHA256 |
| --- | --- |
| fig-20.spec.json | `edd0060c1e3a0a9daf32c0f528da716085a8120cc501a0c81dc1e0d39df6f95c` |
| fig-20.svg | `2845341e9a1e9e2b68f9a3a301c125261377ba0a8930accaaab4996572a5e596` |
| fig-20.render.json | `27ce0faabab5dd3bcc2273ddaeabd9e292dc2be7d8f78e56695b5707fee49801` |
| fig-20.whole.png | `8f4e8f0dc50d00113cdf419dd30c9711b59c2a3924db97e0116e8fe6ade6c9d5` |
| preview-whole-240.png | `4ce270e480678daaa4787466982cc9d98905b84aff96b45e3901912de375d7b3` |
| preview-whole-346.png | `d08f5986a699c7f99a87072a20f020b33178deb0a9e3291d2b196b3119e5838d` |
| preview-whole-640.png | `8f4e8f0dc50d00113cdf419dd30c9711b59c2a3924db97e0116e8fe6ade6c9d5` |
| preview.json | `46df60c79fe4e0bbb52870b7d1489ee1c3a1ea736ad64a7250f37827ee2920ee` |
| execution.json | `f420ff0f5757c00bc2eedbac9bb9c49a8eb98998a0d4db149d7d99450dff5ffa` |

## Preserved Initial Failure Hashes

These rows resolve inside `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/fig-17/initial/` and the equivalent fig-19/initial/ directory. No initial evidence was overwritten.

| Figure / File | SHA256 |
| --- | --- |
| 17 / fig-17.spec.json | `4e87d2187cbca00fd8a4f1b466b3f1ad889ec8da2c12c9c27f32518c80376a85` |
| 17 / fig-17.svg | `f6dc3363764879fb7af341fb1aa59f350febd2b6eaf2908dbfd562a908c41427` |
| 17 / fig-17.render.json | `111d5d655ee6f1dff82cd603b9741f4eeb8fb42dee272f37a37cf73ded04c413` |
| 17 / fig-17.whole.png | `8ed66cd8ca38826f689a61371669d667467cd877c779f35ae092abc47d2809a2` |
| 17 / execution.json | `2f0f341ab433f56803e0bc9ec5e8ec6ab3bc2da41c779f04393067ad949b1f8c` |
| 19 / fig-19.spec.json | `d96fe8910fc0391ce26ca87468c3a861f91bc9d8dd7d7918ed1823158094dbc2` |
| 19 / fig-19.svg | `75c1143236a0fe046b1c8178f3b5ffdae1b850061899ad012d771bb5d0db2db2` |
| 19 / fig-19.render.json | `b513d91f629957f6009d906baabf4ab628d7f02df7495dbbe5c9281ea84585f7` |
| 19 / fig-19.whole.png | `bf14187e768e1f0ead9cbe8e330fbab6cebb4ddbedb0ffb7855f974136127454` |
| 19 / execution.json | `2fa9f70d746343af002755c24b4531fefb7e879fbdbcca6411609e0f4dc79000` |

## Context And Inventory Hashes

These rows resolve inside each absolute `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/fig-N/` directory.

| Figure / File | SHA256 |
| --- | --- |
| 17 / context.json | `dde1b3446df18203097009bdc279f6ad4aa7601e0626a5c3a00341168507e037` |
| 17 / source-inventory.md | `7f265b413a67aba6395dff28ee3f0d7044d43f21b5a7fb59c9c5c4bb48070365` |
| 18 / context.json | `39ec6bd68145fc62c2fc51fee810c28f0cc05d40ab7e533ccb6e03669a8697f0` |
| 18 / source-inventory.md | `73710bcb91e75cb491ae63e4826a19765fe0a4235f5f04570cacc5a05a8490a5` |
| 19 / context.json | `6968606b3ccee605f64071665fa6522dbb6ffe4f7dd48a8a32e018598d77a2dd` |
| 19 / source-inventory.md | `d01e2c7a12b859d545007bc16845657a5e01a0cc80b4aaa142536d61f5e1b850` |
| 20 / context.json | `92de54fa0c6015eab9ff6b4e18aee25448c4615f16469324e2134b93480a82b2` |
| 20 / source-inventory.md | `720b61198b6c9f0dbe5e88e3ea8c2ba1032e6609e7ffbc53d7c39e0f6b1c7cb1` |

Bounded author task complete. Current candidates frozen; parent owns independent record_review and promotion. No automatic next scope.
