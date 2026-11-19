# STEMROBIN-182 n34 Figures 46-49: FIRST Author Checkpoint

Sole cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`. Candidate artifacts only. No independent review or promotion.

**Result:** figures 46, 48 and 49 are candidate-ready-for-independent-review. Figure 47 is locally held for inspection of its repaired current preview in a fresh bounded context. Its current render, offline surface checks and dense curve-label check pass.

**Images:** exactly 8 loaded: four originals once each, then one preview per figure (47, 48, 46, 49). No reopens/crops. Figure 47 was repaired after that single preview; its current preview remains uninspected.

| Figure | Grid / Bounds | Core Source Facts | Renderer Exits | Offline Exits | Status |
| --- | --- | --- | --- | --- | --- |
| fig-46 | 36x14; [-4,12,32,-2]; step 1/1 | (0,7), min (6,3), max (16,10), (24,6); solid curve, dashed guides 16/24 | [1,2,0] | [0] | candidate-ready-for-independent-review |
| fig-47 | 12x12; [-4,7,8,-5]; step 1/1 | [-3,7]; endpoints (-3,-4)/(7,-3), maximum (2,4), zeros -2/6 | [0,0] | [0,0] | checkpoint-repaired-preview-inspection-required |
| fig-48 | 12x12; [-10,16,14,-8]; step 2/2 | y=x/3+2; plotted x=-10..14 | [0] | [0] | candidate-ready-for-independent-review |
| fig-49 | 12x12; [-5,7,7,-5]; step 1/1 | y=-0.5x+1; plotted x=-5..7 | [2,0] | [0] | candidate-ready-for-independent-review |

All four FIRST spec producers and standalone draft validations exited 0. Each renderer also invokes draft validation. Technical execution recovery and layout repairs are counted, not reset. Current text at actual fixed 640 is >=16px, source grids are complete, and offline specimen scrolling reaches its end at 390/960 viewports.
Report assembly first exited 1 on malformed local fig-47 repair metadata. That file and raw failure receipt were retained; only metadata/report assembly was repaired. Report-02 receipt records the final assembly outcome.

## Repairs
- fig-46: initial short-axis-arrow execution error (exit 1); technical tail-length correction; then numeric-label clearance failure (exit 2); one layout repair; final renderer exit 0. Both failures and all available outputs retained.
- fig-47: initial renderer/offline checks exited 0, but author preview failed visually. Dense 0.5px SVG probe found labels -2 and 2 (exit 2). One layout repair; final renderer/offline/dense probe all exit 0. Current preview visual inspection is held by the image allowance.
- fig-48: one render and one offline attempt, both exit 0.
- fig-49: initial x=4 label collision (exit 2); one label-layout repair; final renderer/offline exit 0. Failed spec/SVG/report/PNG retained.

No source coordinates, formulas, curve endpoints/extrema, numeric ticks or font sizes were changed for passing. Added layout regularization, subpixel assertion anchors, cubic interpolation controls and exact equation-derived boundary heights are explicitly separated from original source facts in specs and authored-additions.json.

## Hashes
### fig-46
- source: `bd429b597ed80be8fd6eded658a3cf0f5bad1903372dc2c766a2acc2f9ea03bc` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-46.png`)
- sourceInventory: `e858d595fb3005b345c8d2f4f0b0491015fbffcd1eb13f0c4ba8be9c55eb99ee` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-46/source-inventory.json`)
- spec: `152363efe91288ac9b4c7df5b495043d4d06cb6e72dbce4bded4a9ad7d774b2b` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-46/spec.json`)
- render: `53f6e117b98b1a6c9e2ad0e1822efbf1eeb1b8247d39f7242f838ec4d5d25b31` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-46/render.json`)
- svg: `1289c54d660ec1679e52ec8bb7f96834f900159db6b355505ec0b38825884392` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-46/fig-46.svg`)
- preview: `d4919b5799b1e711060dbdb8ebf826140c09858e85ad067e569856ddcab38a3d` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-46/complete-preview.png`)
- offline: `1598bd1c69948d2209c899f01b98e0069bf71f030d19d004a4461a460c98138d` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-46/offline-check.json`)
- Source inventory/spec mappings, complete original facts, justified additions, raw FIRST command/cwd/start/stdout/stderr/finish/exit/hash receipts and preserved failure hashes: see the paired JSON report.

### fig-47
- source: `72165e8a75007707922d08a40e395fcee748fef3b5050ed747f7de772e639917` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-47.png`)
- sourceInventory: `f5fde031c34879c168efc81cee00665253487e29c316cbc063883d29118bdf03` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-47/source-inventory.json`)
- spec: `c40b6436eb0d20163d5fdfb300659df928371a18056e615fbd30e60f31c08205` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-47/spec.json`)
- render: `54f38cf901d9d0e8f8316eb7dc62e108ddfd10c7806738ee4ed264eaf96d90db` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-47/render.json`)
- svg: `c2acf69b27f59f019ac8220d461f0c862320d728f2ff0ff9e2bcedbfc7be5e4d` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-47/fig-47.svg`)
- preview: `f5faccaa7717730bc9b4ec907ea14b565897503e4188cf8079f6daab110eb037` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-47/complete-preview.png`)
- offline: `3a5510292384a8435dab591e05bb570c700f2578daa98abae89510dd0b4ed5f7` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-47/offline-check.json`)
- Source inventory/spec mappings, complete original facts, justified additions, raw FIRST command/cwd/start/stdout/stderr/finish/exit/hash receipts and preserved failure hashes: see the paired JSON report.

### fig-48
- source: `a54c9daafa15b6c7371d1c09af93f533dd514fb4270c7653c9841c9cc6684f41` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-48.png`)
- sourceInventory: `661ad846590c4402ec82c1f3ac0186f2b81419d240396a087c185a1af0c1d7d0` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-48/source-inventory.json`)
- spec: `24e9bc8f8f8970fc849a8177fc9255ee1295ded7af0c3d811081365b07b72b07` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-48/spec.json`)
- render: `2c43d312fe0ad26e47843174d6b35385ed3305576151006b95140ae15cf9d860` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-48/render.json`)
- svg: `9a3c3183db554d779643569b4d910ded28db0ed838da027dff0dc268c6f78caf` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-48/fig-48.svg`)
- preview: `09b31dff2119cb756b376d3ad3de4ba08a361eb01c09038e73fd649a66bc3e12` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-48/complete-preview.png`)
- offline: `d6caa9f7aa065b0ec8f9877639360bab28e38dd4a11baec86593dac70e53de71` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-48/offline-check.json`)
- Source inventory/spec mappings, complete original facts, justified additions, raw FIRST command/cwd/start/stdout/stderr/finish/exit/hash receipts and preserved failure hashes: see the paired JSON report.

### fig-49
- source: `86c26faec49ea75dc416664018e3e278f53faf66ecaed34f5eb3f7f9022af835` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-49.png`)
- sourceInventory: `07b6cceab82ee2905d64d31ff7854114bc41d69bee190412ee4f08dcd4c95168` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-49/source-inventory.json`)
- spec: `98d49dcb9a0e484478095b0f476d72e56f1ef4d3471dfb19fd346dbc1bd0ad73` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-49/spec.json`)
- render: `4cd57ce8901ecc3e5207017335a36f668f38a866774b83f6bba113b9af413f98` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-49/render.json`)
- svg: `8e8ec68a02697580bed72a5ae04740b3c237b7231e9c9fec65077ab7e137fb4c` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-49/fig-49.svg`)
- preview: `e0e7ae0afdf693510114195d6bfe77719c93c25d420f9bf23078b7022e0d8dcc` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-49/complete-preview.png`)
- offline: `722594995f0b83f7d0b43b5c636cd63d1aa852b74b9214a1f16faa1a24f32cd4` (`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-49/offline-check.json`)
- Source inventory/spec mappings, complete original facts, justified additions, raw FIRST command/cwd/start/stdout/stderr/finish/exit/hash receipts and preserved failure hashes: see the paired JSON report.

## Boundary
No Git, .env, DB, network, paid generation, app UI, source/edition/lesson edits, publishing or deployment. Current DRAFT contexts reused, build_context not rerun. No answers, choices, external old figures or history consulted. No independent-review record, review@1 file or promotion created.

## Continuation
Only fig-47 needs a fresh bounded preview inspection: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-47/complete-preview.png`. Its current hashes are above and in the JSON report. Do not claim it candidate-ready until that author visual check is complete; all four candidates still need independent figure review.
