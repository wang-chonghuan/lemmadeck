# n81 Figures12--20 StageB Author Handoff

Date: 2026-11-16. Existing STEMROBIN-184 delegated author role. Scratch only. Dalton remains the sole independent StageB reviewer; this document is not an independent review, review@1, source glyphPASS, semantic PASS or promotion.

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Packages: `.tmp/s10y-image/batch007/10c/fig-{12..20}/`.
Frozen own StageA inventory: `.intentfold/tickets/STEMROBIN-184/tmp/ana10-n81-figure-author-source-inventory.md`, SHA256 `28d9e880a134042deff90f9a29e516e4a80a32f4975d4bd584254ef74a8f9f89`.

## Scope And Provenance

Read the current image SKILL, routing/spec/quality-gate contracts, all nine official contexts and the already frozen own inventory. No original PNG was reopened for a repeated investigation. Current original bytes were hashed against official contexts; the full original-pixel facts remain in the frozen StageA record. Each draft includes exact complete context title/prose/captions in original order, with no exercise entries in these nine contexts. No source answer, solution report, choice, parent text review, Dalton/Ptolemy reviewer material or another author's inventory was read.

Used only the existing JSXGraph renderer and FigureSpec@2 `svgPath` fallback, with deterministic analytical sin/cos samples; no new library, geometry engine, dependency, renderer, counter or helper under the toolkit was changed. Three ticket-specific author orchestration/sampling/capture scripts and a hash/check script live inside fig12's assigned scratch package. They do not assemble, finalize, publish, build contexts or solve exercises.

All nine figures are body illustrations of stated transformations, not source exercise answer graphs. No extra point dot, grid, endpoint arrow, dimension, amplitude label, absent dashed formula or solved annotation is drawn.

## Current Outcomes

Eight current render reports are mechanically `pass`; fig13 is **BLOCKED, second render FAIL, repair allowance exhausted**. Eight mechanical passes are only author candidates awaiting Dalton, not semantic approval. Total: nine initial explicit validates/renders, three targeted repairs/second validates/renders, twelve explicit validates and twelve renderer invocations. The unchanged official renderer also internally invokes its draft validator each time. No third render or automatic retry.

|Figure|Current Attempt|Initial Render|Unique Repair|Current Render|Author Disposition|
|---|---|---|---|---|---|
|12|repair|FAIL|origin uncertainty-marker coordinate only|pass|Frozen candidate; source codepoint still UNKNOWN|
|13|repair|pass but wrong-side origin-marker fidelity defect|origin uncertainty-marker coordinate only|FAIL|BLOCKED; no further repair|
|14|initial|pass|none|pass|Frozen candidate; explicit source schematic/text regularization limit|
|15|initial|pass|none|pass|Frozen candidate|
|16|initial|pass|none|pass|Frozen candidate|
|17|repair|pass but marker on narrow-wave ink|origin uncertainty-marker x coordinate only|pass|Frozen candidate|
|18|initial|pass|none|pass|Frozen candidate|
|19|initial|pass|none|pass|Frozen candidate|
|20|initial|pass|none|pass|Frozen candidate|

Every attempt directory preserves its exact spec, original construction ledger, complete command/stdout/stderr/exits, SVG, native PNG, render report, all static captures and display evidence. Root `spec.json` and root SVG/native/render are the current candidate copies; their render report correctly points to the immutable attempt output. Nothing was hand-edited in renderer SVG/PNG/report.

Official processes were actually invoked by `spawnSync` with the executable/argument arrays saved in `execution.json`, cwd at the workspace, `PWDEBUG` deleted and `PYTHON=/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`. The appendix's displayed shell strings reconstruct those calls using the equivalent relative Python path; they are reproducible command representations, not claims that an interactive shell typed those exact strings.

### Concrete Failures And Repairs

Fig12 initial renderer exit2: `x-tick-0-value-label`, text `-pi/4`, collision score `467.37676215171814`. Full native image showed the uncertainty marker colliding with that phase label. Only `origin-unknown.at` changed from `[-0.7604539177279453,-0.22]` to `[0.33,-0.44]`, restoring the frozen source lower-right role and clearing the label. Second renderer exit0, no collision.

Fig13 initial renderer exit0 did not prove source fidelity: its unknown-origin marker was on the lower-left despite the frozen lower-right source role. The sole repair changed only `origin-unknown.at` from `[-0.7604539177279453,-0.22]` to `[0.33,-0.44]`. Second renderer exit2: `x-tick-0-value-label`, text `pi/3`, score `47.525142991449684`. Native/neutral/print and actual358 scroll-start images show the marker too close to the ascending solid branch/phase-label region. Current fig13 is FAIL/BLOCKED; initial bytes are not substituted as an accepted alternative, and no third repair/render was attempted.

Fig17 initial renderer exit0 missed the marker pressing onto the narrow solid waveform. The full native observation prompted the sole x-coordinate repair: `origin-unknown.at[0]` from `-0.08189503729377876` to `-0.04`, keeping y=`-0.22`. Second native/neutral/print observations show the marker clear of the waveform, still below-left of the axes. Second renderer exit0.

For all three repairs, every curve path, formula, axis, tick, leader, guide, bounding box, assertion and context text stays structurally identical to its initial spec. The final mechanically generated diff ledger lists the exact coordinate-only differences.

## Per-Figure Substantive Observations

12: solid `sin(x+pi/4)` leads dashed `sin x`, solid5 versus dashed6 roots; each3 crests/2 troughs. Source inside/outer end polarity and two separate arrowed formula leaders retained. Negative phase tick and +/-1 retained. Current marker is lower-right and no longer merges with the negative phase label.

13: solid `sin(x-pi/3)` lags dashed `sin x`, solid5/dashed6 roots and3 crests/2 troughs each; solid negative-left/positive-right and dashed negative ends retained. Two leaders retain curve identities. Positive phase tick and +/-1 remain. **Current origin-marker/phase-label region fails; do not promote.**

14: same-phase solid `4 cos x` and dashed `cos x`, six shared roots including both finite ends, three crests/two troughs. Only +/-4 y values and the two unled formulas are printed. The exact4 amplitude factor is explicitly **approved-text-derived regularization**. Frozen schematic source ink does not independently establish a metrologically exact4:1 excursion; this is not source pixel recovery, silent correction, erratum registration or an unconditional source-fidelity PASS. The full finite source lobe topology is retained. Dalton must adjudicate this declared interpretation.

15: solid `(2/3) cos x` and dashed `cos x`, three shared interior roots, central crest and two troughs, positive partial left ends and negative partial right ends. y1,-1,-2/3 only, no new positive2/3 or x number. Complete fraction/phase and unled formula roles retained.

16: broad solid `cos(x/2)` has two roots at +/-pi, central crest and outer negative trough regions. Dashed `cos x` has four roots and central/outer positive crests. At2pi the solid is negative and dashed positive. All three x ticks retained; no y unit labels or leaders added.

17: solid `cos20x` has ten roots including both finite zero ends, five narrow crests/four troughs. Dashed `cos x` stays positive across its longer drawn span, no dashed zero or negative lobe. pi/10 and pi/5 align with the first and second right solid maxima; y-1 only. Current marker no longer presses onto the narrow-wave stroke.

18: solid `cos2x` eight roots/five positive crest regions/four troughs; dashed comparison four roots/three positive crest regions/two troughs, with positive end regions. Atpi solid positive/dashed negative; at2pi both positive. Only the source solid formula is printed. Dashed identity `cos x` is bound by approved example step1, not added as recovered source label.

19: solid `cos(2x+4)` eight roots/four crests and negative finite ends, including terminal right trough; dashed comparison eight roots/five positive crest regions/four troughs and longer positive end regions. Solid negative/rising at origin. Separate vertical dashed guide joins the exact solid crest at printed x=-2 to the axis. Only the solid formula is printed; dashed `cos2x` is approved-step2-derived, not recovered ink.

20: solid `3 cos(2x+4)` and smaller same-phase dashed comparison retain nine shared roots including both finite ends, four crests/four troughs/eight lobes. Separate horizontal y=3 guide reaches the first right solid crest; separate unlabelled vertical guide passes through corresponding left crests to the axis. No printed x=-2, -3, +/-1 or dashed formula is invented. Dashed identity and unlabelled guide abscissa are explicitly approved-step3/text-derived.

## Numerical Coverage And Limits

Each source group maps its own axes, printed ticks/formulas, curve paths and separate guides/leaders to existing executable assertion IDs. All semantic arrows/segments have `connects`; axes have perpendicularity, ticks have axis incidence, every analytical root/extremum/crossing and transformation witness has a coordinate relationship. No `objectCount` is used as a replacement for these facts. No visible point object exists because the source prints no point dots.

The official assertion set alone cannot prove the geometry inside an opaque path. Therefore `author-curve-ledger.json` freezes the original analytical construction and exact source observations, and `author-path-check.json` separately decodes every actual current path sample, binds the current spec/render/SVG, checks formula residual/endpoints and reports interpolation error. These are author checks, not an independent mathematical gate. Curves use3201 samples each; finite numerical endpoints are declared modern choices retaining observed roots/lobes/end polarities, **not recovered source domain endpoints**. No new endpoint values or read-off queries are printed. The schema has no native function-value assertion, and no toolkit assertion was added.

For repaired12/13/17 the original construction ledger's recorded spec hash still denotes the initial construction version; those raw ledger bytes are deliberately retained in `initial/` and `repair/`. Use the final path-check/current hash bindings, not that historical root-path pointer, for current candidate identity.

All nine original oval0/O-like codepoints remain **ROUND-GLYPH-UNKNOWN**. Current visible `?` is an explicit modern uncertainty placeholder, not a recovered numeral0, LatinO, Cyrillic letter or finalized source-convention decision. It is not a request to infer a glyph from the function. Semantic acceptance of this placeholder remains with Dalton/parent; no glyphPASS is asserted. Unknown unlabelled source coordinate boundaries remain unknown.

## Actual Display And Visual Evidence

Display contract: instructional, fixed640px **scroll** media, minimum16px. Actual static measurements at desktop640 and containers358/240neutral and346print all retain media640px and measured label18px. Mobile358 scroll maximum282px,240 maximum400px and346 maximum294px; each actual scroll endpoint was reached. These are not inline358/240/346 figures and no smaller-media legibility claim is made.

Captured isolated headless Chromium with offline context, every request aborted, PWDEBUG unset, no CDP, persistent/user profile, foreground browser, OS input or auto-open. All contexts/browsers closed. Static raw-SVG harness is not headed app/product/offline acceptance.

Actually opened every initial full native PNG separately; opened all three repaired full natives afterward. For each CURRENT attempt, separately opened the complete `neutral-358.whole.png` and `print-346.whole.png`, plus the actual358 `viewport-start.png` and `viewport-end.png`. Thus all nine complete current neutral/print graphs and each narrow start/end were visually inspected, including the blocked13. Whole-media screenshots deliberately make ancestor overflow visible and use screenshot viewport640 **after** narrow measurements; the raw captures/evidence honestly distinguish these from358 viewport images. Desktop640/240neutral whole-media capture equality to the actually opened358-neutral whole image is mechanically checked below.

Observed semantic color separation in neutral and solid/dash separation in monochrome print. All full curve lobes, axes/arrows, printed scales and guides are visible in whole images; mobile first view intentionally cannot show the entire640 graph and can reach the final right labels/ends by scrolling. Fig13 remains blocked despite legible18px text and reachable scroll end. Label footprint tests do not override renderer collision failure or source-fidelity review.

## Freeze And Stop

The following mechanical appendices contain current/initial/repair hashes, exact command/exit records, coordinate-only differences, curve residual checks and every raw assigned-package file hash. No review@1 was written. No promotion, durable manifest/source/modern text/index change, finalize, DB, Git, network service, dependency edit or cross-chat action occurred. s13 and all closed figure scopes stayed untouched.

Author StageB ends at this immutable handoff, including the real blocked result. No further repair/render, original-image rereview, new figure or semantic selfPASS is authorized by this handoff. Wait for the original Dalton sole StageB process.

## Mechanical Freeze Appendix

Package hash manifest: `.tmp/s10y-image/batch007/10c/fig-12/author-package-hashes.json`, SHA256 `5a031de96167b0849f23055a6cfe533593a46154146f75466a803958bf37090a`. Enumerated 331 raw assigned-package files, excluding only this self-manifest and this final report.

### Current Critical Bindings

|Figure|File|SHA256|
|---|---|---|
|fig-12|`.tmp/s10y-image/batch007/10c/fig-12/context.json`|`0fc52a554d56b5e01220ebf7fd90ceb124e5b5f77ac3f79a903f8379a9c7bb67`|
|fig-12|`ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-12.png`|`a5970d8c13709475dcfd0fec39a8730bdf595686c2d8218e307b19e3507648a7`|
|fig-12|`.tmp/s10y-image/batch007/10c/fig-12/spec.json`|`016a8e44ef65d83fe1583b0104a0deb47868c78d3e0d958ab8d41be9e143a091`|
|fig-12|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.svg`|`77947e1ed57440f59433bc20318db7b4c0c792a2b961fb24bf73c3a817f1f10f`|
|fig-12|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.render.json`|`67dc0c53f51ff251f33eac138c583c402230d17d5efb7933cd539dbde3cb0bd2`|
|fig-12|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.native.png`|`82e6f00bf7766adba510cf99832abf04db0188d1ac0fc7f13bed71f5a7da2723`|
|fig-12|`.tmp/s10y-image/batch007/10c/fig-12/repair/author-display-evidence.json`|`6f963434f6c5e17fe3b296fd494a637c5de500dcd6a0040ab6030275a62069f2`|
|fig-12|`.tmp/s10y-image/batch007/10c/fig-12/author-path-check.json`|`2492eafeb5a4a64f653fedbdc07363ccaf5e88db82859019c10bc40990649dae`|
|fig-13|`.tmp/s10y-image/batch007/10c/fig-13/context.json`|`a8ea1c42c852a52c04d3dd7c2e4e68f1949ff20a933ad0b1f83042ed704681b4`|
|fig-13|`ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-13.png`|`a30cdcdf8c7213a6d1544a427405f6e5ebd292cfc063383ae55345d79f22b989`|
|fig-13|`.tmp/s10y-image/batch007/10c/fig-13/spec.json`|`35eaddd293e83a7575fb0a85b223ce994bb19ebaaa4af478f7d636213b087ac3`|
|fig-13|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.svg`|`a41327eb685017f8c8a6bb03f965d1ae32cbe554e70247e0b93d4f891a41b65a`|
|fig-13|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.render.json`|`ff067a3eb74663dd77c0e3830cf354d0414e937a0c3b83a13839c3ad009c96c0`|
|fig-13|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.native.png`|`aff71237aee73953fc93d8c40b23340b8f11b6b8dbccdda4ff81f76d18573190`|
|fig-13|`.tmp/s10y-image/batch007/10c/fig-13/repair/author-display-evidence.json`|`c9b51212d2367af1c449a045d65f31ee33a49ecbeb91a6fb5683f799714dc011`|
|fig-13|`.tmp/s10y-image/batch007/10c/fig-13/author-path-check.json`|`8907d92992d96312959e9d281bc45ccfc282bd5d3a6da8a9dbb7a13524c57ff3`|
|fig-14|`.tmp/s10y-image/batch007/10c/fig-14/context.json`|`55bb96a17da1654f6478de6d77cf9fa094c587bd4b5a32238c0408f95e945585`|
|fig-14|`ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-14.png`|`fab7ca5f77d266a4f6b300f539a452bcc2ceac5fa6c08a4b8e9e6d358dd8e5bc`|
|fig-14|`.tmp/s10y-image/batch007/10c/fig-14/spec.json`|`f16822e7c17d1a75b20724b45a37695c0843e033634a9f9bab5448f14ee100ab`|
|fig-14|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.svg`|`b991a16407803d026b1e7b8a87c9ced2ab99a10e9e98b87f5dfd52c96efee3b1`|
|fig-14|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.render.json`|`0e198d98791e46298f9e9d6b3d8a393d52861b7974d1657204e60b0a9c23a280`|
|fig-14|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.native.png`|`2c2beff09f3ef25ebba8ba2a0cf57667ea3cdf525da15238adaf0f2d5f8f0d78`|
|fig-14|`.tmp/s10y-image/batch007/10c/fig-14/initial/author-display-evidence.json`|`f7b5ca2d00c2345ee51ab04b726d832f58ea589e4f37b2489847bef9d62ec4f4`|
|fig-14|`.tmp/s10y-image/batch007/10c/fig-14/author-path-check.json`|`388e064a6273ad12fe2ec04adf8e8c55e94a3c21eabadcb0952c51664c33f865`|
|fig-15|`.tmp/s10y-image/batch007/10c/fig-15/context.json`|`eda2e024a8c077ebadfe8229f26b0b8b65d999a8fe8b84c65ef61070d6f70e96`|
|fig-15|`ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-15.png`|`3e50483b4fdcdefe9c816d7f76a77cf0100d2fe8417c3821341883efac2084b2`|
|fig-15|`.tmp/s10y-image/batch007/10c/fig-15/spec.json`|`d5548d965ab86cbfceefde0091b6c75cd1400cd2ed878810b111304dca90c256`|
|fig-15|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.svg`|`54bb510fc31778706f94ebca39e883336a7db767d294646559176d3f30d231f8`|
|fig-15|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.render.json`|`0863a1a27d6291d2af74d56ef09e224f9493e3a04bb7633fb17fa92866932a32`|
|fig-15|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.native.png`|`0fb78b1f24d3efbf5bb4cc87d3d8ae7185bbed813f7af62f5cbd51e20f35a043`|
|fig-15|`.tmp/s10y-image/batch007/10c/fig-15/initial/author-display-evidence.json`|`adeba44bb2f624aa49dde1d408fb72752c3bc17df2c79f8dc4fda796fcf3af84`|
|fig-15|`.tmp/s10y-image/batch007/10c/fig-15/author-path-check.json`|`c4e5b5de145d20a84176cb566e95c2486e7a8b8e34a2a1ab732b1e494f4a55e5`|
|fig-16|`.tmp/s10y-image/batch007/10c/fig-16/context.json`|`32fd71fff6077e33d01ee09440b74e5ff33836ccccb5ed8846b69b93eb98aec5`|
|fig-16|`ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-16.png`|`31a56cd4f038577c8d24ce43ce1c2888c2e1aecd45183008cda39cdbe79577bd`|
|fig-16|`.tmp/s10y-image/batch007/10c/fig-16/spec.json`|`f6b00403a88ba748d1c6ffc8972e7d62f8a6d92c2e5fc6ace1bbd161169778b2`|
|fig-16|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.svg`|`b45fb2ef22623ca3c3ddc940f8e05042d87b81528953244340f4a794d71873e0`|
|fig-16|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.render.json`|`14945d27ac6349ec4f4cb9ae95d015cc02f41e1c465f7c0e9e586d00ee5d9c9e`|
|fig-16|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.native.png`|`a502ad429180f6ab37bc7bfbeec3b0771f984f7af3ac88c3caeb49cd60b8d19d`|
|fig-16|`.tmp/s10y-image/batch007/10c/fig-16/initial/author-display-evidence.json`|`dd899af754c0d652d6c9eebed86f7750e6417224d8c2ef58742c0353272b4973`|
|fig-16|`.tmp/s10y-image/batch007/10c/fig-16/author-path-check.json`|`e38dd040830952add95aad8de8f2de5d447ec2982a202531c1fae6ab6fb77334`|
|fig-17|`.tmp/s10y-image/batch007/10c/fig-17/context.json`|`39b344776454bb94b5bbfb40142665e48e2774c3e90d01d42ee251e6f104ec84`|
|fig-17|`ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-17.png`|`2635c2d39c0b80b6e232ce9716e668a6a7d28f0ec5d1e94ac489bb7e4a7b148b`|
|fig-17|`.tmp/s10y-image/batch007/10c/fig-17/spec.json`|`00942216217600fe095129f33b1c0ca13a8b7af39f4cdfd83f348fa119623b03`|
|fig-17|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.svg`|`42ee42aa4f9024ff6ca43d3eb30c1ab22eef40da2b442cb000a927784453df38`|
|fig-17|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.render.json`|`2854974c093934f2a3877136e7b0806bea5bce9f41e622f44f4db3f169bf44de`|
|fig-17|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.native.png`|`6228317527d2792f41d40f5023199010b990129c41a63e2b434174854cae10ec`|
|fig-17|`.tmp/s10y-image/batch007/10c/fig-17/repair/author-display-evidence.json`|`06c30fbbcb579f85e6aea763d0e8ed2bdb1906be796ab445002b7bad83ec25f2`|
|fig-17|`.tmp/s10y-image/batch007/10c/fig-17/author-path-check.json`|`1ce3f5ebb29619bed8e9241c9f19851bf656f455207973e162b6f4e869ef9015`|
|fig-18|`.tmp/s10y-image/batch007/10c/fig-18/context.json`|`826231656428bdcc855b40b7da1e246fef4dbc82334468667c89c9eb39acd3a0`|
|fig-18|`ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-18.png`|`128bc913f07c26f427d77d931f0810df6ac01b908f6701372c868e53e973118e`|
|fig-18|`.tmp/s10y-image/batch007/10c/fig-18/spec.json`|`3e3a185d133ecd62d43ee0eb0fc9f176964e92666be3c4ba5d8e76baf2ccf6ca`|
|fig-18|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.svg`|`d683c152185255f1e33540e7fdfdb5e9848bca8a704f4bca2cf1f01fadafda19`|
|fig-18|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.render.json`|`f2858c994a965cb27a351bab00300882df7f41b58725cafcfaafa8ddf270abf7`|
|fig-18|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.native.png`|`544ea22eef5c4fba636d66957560bafb0f79debfd8ccd49c88eec7bfdb8feab9`|
|fig-18|`.tmp/s10y-image/batch007/10c/fig-18/initial/author-display-evidence.json`|`a8c4f95c759a6badfcccb43dc5c29464fe38ebf5431d5738e84dbb5fb85c7ce2`|
|fig-18|`.tmp/s10y-image/batch007/10c/fig-18/author-path-check.json`|`2ed93b7815c194e7a0081f51f9988507c4d0f7be5efa37894bc0c8f7ccd89c2e`|
|fig-19|`.tmp/s10y-image/batch007/10c/fig-19/context.json`|`42db17d8c0fef1b72b648bb2dbc8d13fb173292ecd9d697e43dc4ec0b92b2dfb`|
|fig-19|`ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-19.png`|`0cbcd58f36f0eb90c458e5cb63da16c16e20e1d32f2ce7b9bc17994530641cdc`|
|fig-19|`.tmp/s10y-image/batch007/10c/fig-19/spec.json`|`88720abf1ad615c401aa12142f28350efbeb3cd42646c79b8b1977aaf8b61b22`|
|fig-19|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.svg`|`5c448ff94934a4c866e71d82aa222e23fda849c04beef5a377a625518474407f`|
|fig-19|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.render.json`|`873342ed910b321e385889fe8799417de5adf4e0de4d0b7ec54903fa40786382`|
|fig-19|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.native.png`|`ead2daceb775b0f91c430b7742f984997b5ec4c17ec6cce08cefff24b59193c1`|
|fig-19|`.tmp/s10y-image/batch007/10c/fig-19/initial/author-display-evidence.json`|`65461787afb2c239d1ea3c8abac97c21f9e48c49b0c5d1c16bf72266c82115a6`|
|fig-19|`.tmp/s10y-image/batch007/10c/fig-19/author-path-check.json`|`a9bee8599f8128bb12c6f047c2519dbbac2e4dfdfc010afca910c12e0d4e1df0`|
|fig-20|`.tmp/s10y-image/batch007/10c/fig-20/context.json`|`23268c2cc3b0ae0e6b58af0d9ec40c6d238c80e3a532b90e2c2a827eac8b0d5b`|
|fig-20|`ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-20.png`|`458541c1db6511f9532eeccd1692304e9027c082eb89aab00b85d8a8c167321a`|
|fig-20|`.tmp/s10y-image/batch007/10c/fig-20/spec.json`|`176e4af6011934e7de18193f9061a4342db145ce323750b610fd906c95b690da`|
|fig-20|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.svg`|`beb5731465e3cfe8a08d948d341375064777eb6c0c4390bb01d2426f3ace2092`|
|fig-20|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.render.json`|`9a64f8f0ee208637fdabd19a85faa279924114823b62f038112e44169543359e`|
|fig-20|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.native.png`|`c19dc4395c3ddf717225b1231964406df4623a35cef92276c2f0fbd445c380e5`|
|fig-20|`.tmp/s10y-image/batch007/10c/fig-20/initial/author-display-evidence.json`|`a152bd72aed0f7f238896945cd902b9f333d80d7ea108dbba0f36c7972aa702d`|
|fig-20|`.tmp/s10y-image/batch007/10c/fig-20/author-path-check.json`|`a97d822da8bea6cde2f45b8127fb0f6dfbe0d530dc9a4ce390885b8eb808dfc5`|

### Exact Initial To Current Differences

```json
[
  {
    "figure": "fig-12",
    "differences": [
      {
        "at": "$.objects.4.at.0",
        "initial": -0.7604539177279453,
        "current": 0.33
      },
      {
        "at": "$.objects.4.at.1",
        "initial": -0.22,
        "current": -0.44
      }
    ]
  },
  {
    "figure": "fig-13",
    "differences": [
      {
        "at": "$.objects.4.at.0",
        "initial": -0.7604539177279453,
        "current": 0.33
      },
      {
        "at": "$.objects.4.at.1",
        "initial": -0.22,
        "current": -0.44
      }
    ]
  },
  {
    "figure": "fig-14",
    "differences": []
  },
  {
    "figure": "fig-15",
    "differences": []
  },
  {
    "figure": "fig-16",
    "differences": []
  },
  {
    "figure": "fig-17",
    "differences": [
      {
        "at": "$.objects.4.at.0",
        "initial": -0.08189503729377876,
        "current": -0.04
      }
    ]
  },
  {
    "figure": "fig-18",
    "differences": []
  },
  {
    "figure": "fig-19",
    "differences": []
  },
  {
    "figure": "fig-20",
    "differences": []
  }
]
```

### Actual Numerical Path Checks

|Figure/Role|Samples|Roots/Crests/Troughs|Max Formula Residual|Max Midpoint Linear Error|
|---|---|---|---|---|
|fig-12/solid|3201|5/3/2|9.36591443290169e-10|0.0000028694183261679385|
|fig-12/dashed|3201|6/3/2|9.545100543295604e-10|0.000003258011076701095|
|fig-13/solid|3201|5/3/2|9.538612122383938e-10|0.0000028108440327523354|
|fig-13/dashed|3201|6/3/2|9.545100543295604e-10|0.000003258011076701095|
|fig-14/solid|3201|6/3/2|2.3495603795886666e-9|0.000012047651547053562|
|fig-14/dashed|3201|6/3/2|9.625996250095525e-10|0.0000030120378865516884|
|fig-15/solid|3201|3/1/2|7.841778754125173e-10|7.474522774053582e-7|
|fig-15/dashed|3201|3/1/2|9.785359328384757e-10|0.0000011211077091122235|
|fig-16/solid|3201|2/1/2|7.386209144311096e-10|5.316597609938967e-7|
|fig-16/dashed|3201|4/3/2|9.813467538588583e-10|0.0000021052218375228193|
|fig-17/solid|3201|10/5/4|1.0251363365826327e-8|0.000009759048449131669|
|fig-17/dashed|3201|0/1/0|8.364864356735779e-10|3.820757632500005e-8|
|fig-18/solid|3201|8/5/4|1.4536248801877427e-9|0.000008022328641388299|
|fig-18/dashed|3201|4/3/2|9.331545744450942e-10|0.0000020056650632538364|
|fig-19/solid|3201|8/4/4|1.3768167023142652e-9|0.000007143521852936985|
|fig-19/dashed|3201|8/5/4|1.4437175135939562e-9|0.000008180461636531078|
|fig-20/solid|3201|9/4/4|3.3568308133169467e-9|0.000023131651979202417|
|fig-20/dashed|3201|9/4/4|1.452277270663771e-9|0.000007710383992720615|

### Exact Official Commands And Exits

#### fig-12

`initial`:
```text
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/batch007/10c/fig-12/spec.json --stage draft --json
exit=0; signal=null; error=null; start=2026-11-16T06:13:59.979Z; end=2026-11-16T06:14:00.045Z
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/batch007/10c/fig-12/spec.json --svg .tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.svg --png .tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.native.png --report .tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.render.json
exit=2; signal=null; error=null; start=2026-11-16T06:14:00.045Z; end=2026-11-16T06:14:01.528Z
```
`repair`:
```text
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/batch007/10c/fig-12/spec.json --stage draft --json
exit=0; signal=null; error=null; start=2026-11-16T06:18:10.879Z; end=2026-11-16T06:18:10.916Z
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/batch007/10c/fig-12/spec.json --svg .tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.svg --png .tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.native.png --report .tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.render.json
exit=0; signal=null; error=null; start=2026-11-16T06:18:10.916Z; end=2026-11-16T06:18:12.464Z
```
#### fig-13

`initial`:
```text
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/batch007/10c/fig-13/spec.json --stage draft --json
exit=0; signal=null; error=null; start=2026-11-16T06:14:00.050Z; end=2026-11-16T06:14:00.086Z
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/batch007/10c/fig-13/spec.json --svg .tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.svg --png .tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.native.png --report .tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.render.json
exit=0; signal=null; error=null; start=2026-11-16T06:14:00.086Z; end=2026-11-16T06:14:01.528Z
```
`repair`:
```text
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/batch007/10c/fig-13/spec.json --stage draft --json
exit=0; signal=null; error=null; start=2026-11-16T06:18:10.879Z; end=2026-11-16T06:18:10.916Z
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/batch007/10c/fig-13/spec.json --svg .tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.svg --png .tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.native.png --report .tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.render.json
exit=2; signal=null; error=null; start=2026-11-16T06:18:10.916Z; end=2026-11-16T06:18:12.464Z
```
#### fig-14

`initial`:
```text
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/batch007/10c/fig-14/spec.json --stage draft --json
exit=0; signal=null; error=null; start=2026-11-16T06:14:06.232Z; end=2026-11-16T06:14:06.266Z
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/batch007/10c/fig-14/spec.json --svg .tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.svg --png .tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.native.png --report .tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.render.json
exit=0; signal=null; error=null; start=2026-11-16T06:14:06.266Z; end=2026-11-16T06:14:07.288Z
```
#### fig-15

`initial`:
```text
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/batch007/10c/fig-15/spec.json --stage draft --json
exit=0; signal=null; error=null; start=2026-11-16T06:14:06.237Z; end=2026-11-16T06:14:06.271Z
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/batch007/10c/fig-15/spec.json --svg .tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.svg --png .tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.native.png --report .tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.render.json
exit=0; signal=null; error=null; start=2026-11-16T06:14:06.271Z; end=2026-11-16T06:14:07.296Z
```
#### fig-16

`initial`:
```text
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/batch007/10c/fig-16/spec.json --stage draft --json
exit=0; signal=null; error=null; start=2026-11-16T06:14:37.422Z; end=2026-11-16T06:14:37.461Z
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/batch007/10c/fig-16/spec.json --svg .tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.svg --png .tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.native.png --report .tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.render.json
exit=0; signal=null; error=null; start=2026-11-16T06:14:37.461Z; end=2026-11-16T06:14:38.881Z
```
#### fig-17

`initial`:
```text
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/batch007/10c/fig-17/spec.json --stage draft --json
exit=0; signal=null; error=null; start=2026-11-16T06:14:37.416Z; end=2026-11-16T06:14:37.460Z
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/batch007/10c/fig-17/spec.json --svg .tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.svg --png .tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.native.png --report .tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.render.json
exit=0; signal=null; error=null; start=2026-11-16T06:14:37.460Z; end=2026-11-16T06:14:38.863Z
```
`repair`:
```text
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/batch007/10c/fig-17/spec.json --stage draft --json
exit=0; signal=null; error=null; start=2026-11-16T06:18:11.000Z; end=2026-11-16T06:18:11.034Z
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/batch007/10c/fig-17/spec.json --svg .tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.svg --png .tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.native.png --report .tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.render.json
exit=0; signal=null; error=null; start=2026-11-16T06:18:11.034Z; end=2026-11-16T06:18:12.464Z
```
#### fig-18

`initial`:
```text
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/batch007/10c/fig-18/spec.json --stage draft --json
exit=0; signal=null; error=null; start=2026-11-16T06:14:44.272Z; end=2026-11-16T06:14:44.308Z
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/batch007/10c/fig-18/spec.json --svg .tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.svg --png .tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.native.png --report .tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.render.json
exit=0; signal=null; error=null; start=2026-11-16T06:14:44.308Z; end=2026-11-16T06:14:45.607Z
```
#### fig-19

`initial`:
```text
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/batch007/10c/fig-19/spec.json --stage draft --json
exit=0; signal=null; error=null; start=2026-11-16T06:14:44.285Z; end=2026-11-16T06:14:44.319Z
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/batch007/10c/fig-19/spec.json --svg .tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.svg --png .tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.native.png --report .tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.render.json
exit=0; signal=null; error=null; start=2026-11-16T06:14:44.319Z; end=2026-11-16T06:14:45.600Z
```
#### fig-20

`initial`:
```text
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/s10y-image/batch007/10c/fig-20/spec.json --stage draft --json
exit=0; signal=null; error=null; start=2026-11-16T06:14:58.723Z; end=2026-11-16T06:14:58.756Z
env -u PWDEBUG PYTHON=.claude/skills/ld-s10y-lesson/.venv/bin/python node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/s10y-image/batch007/10c/fig-20/spec.json --svg .tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.svg --png .tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.native.png --report .tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.render.json
exit=0; signal=null; error=null; start=2026-11-16T06:14:58.756Z; end=2026-11-16T06:14:59.982Z
```

### All Raw Package Hashes

|Path|Bytes|SHA256|
|---|---|---|
|`.tmp/s10y-image/batch007/10c/fig-12/author-capture-n81.mjs`|7494|`f17e3900d6a6bebc3b9aa5d33aa491146d43983c431ee44ade741d524f5f65f4`|
|`.tmp/s10y-image/batch007/10c/fig-12/author-curve-ledger.json`|7497|`33919452dccecabd58acd2cc632a8e96b78d6163ba04e6ccd4a779ecc52b6137`|
|`.tmp/s10y-image/batch007/10c/fig-12/author-draft-n81.mjs`|21044|`0c34db3f78b010aba742832d51775a6a5726b31627fcd8373c46df93b3ffd719`|
|`.tmp/s10y-image/batch007/10c/fig-12/author-freeze-n81.mjs`|11514|`0cec39b1035e9bb9ee6cac237cf8fd3bf1ec20bc78f8b7ffd6bf31d95d8c7e1f`|
|`.tmp/s10y-image/batch007/10c/fig-12/author-path-check.json`|3443|`2492eafeb5a4a64f653fedbdc07363ccaf5e88db82859019c10bc40990649dae`|
|`.tmp/s10y-image/batch007/10c/fig-12/author-run-n81.mjs`|3877|`dfd721a04ca3d508c11e4279ff1b1f0e290a4160be3cf54b546680c9a92356ab`|
|`.tmp/s10y-image/batch007/10c/fig-12/context.json`|1342|`0fc52a554d56b5e01220ebf7fd90ceb124e5b5f77ac3f79a903f8379a9c7bb67`|
|`.tmp/s10y-image/batch007/10c/fig-12/fig-12.native.png`|16743|`82e6f00bf7766adba510cf99832abf04db0188d1ac0fc7f13bed71f5a7da2723`|
|`.tmp/s10y-image/batch007/10c/fig-12/fig-12.render.json`|932|`67dc0c53f51ff251f33eac138c583c402230d17d5efb7933cd539dbde3cb0bd2`|
|`.tmp/s10y-image/batch007/10c/fig-12/fig-12.svg`|180220|`77947e1ed57440f59433bc20318db7b4c0c792a2b961fb24bf73c3a817f1f10f`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/author-curve-ledger.json`|7497|`33919452dccecabd58acd2cc632a8e96b78d6163ba04e6ccd4a779ecc52b6137`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/author-display-evidence.json`|11961|`434e9afa083d7d3c4bebdbac676689490e977827e6b5bd70893c6ba62b9b6d88`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/execution.json`|4173|`d6ef1351da3e5545a02c792f057ccf779d83454b16a0c71b3eb067843d450170`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.native.png`|16701|`6b4bea42e19afbe67b1f12ed6d02c16a49bb2588ab3d5f1d8f94a3cef5518d8d`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.neutral-240.viewport-end.png`|6868|`b73e169371ec2a6fe2ea63b2520a9ed6b62fe65827bc582580aa6eba81388471`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.neutral-240.viewport-start.png`|6318|`40eca1f885d0b9e663f7c683d5967902470d25150c9dad257c7d15a54cc4ea28`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.neutral-240.whole.png`|16652|`53d683c1720f51743e05ab17db3408b63acb8fd4766463d237c02a7521c145bf`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.neutral-358.viewport-end.png`|9565|`ace87075506808a5f58be0ab688f1b6a9f93599cc942f4570ec8745ffca51950`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.neutral-358.viewport-start.png`|10223|`9c9881482e94108899e5313a83b39a3601685de74867ee94a880fbd51c21228a`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.neutral-358.whole.png`|16652|`53d683c1720f51743e05ab17db3408b63acb8fd4766463d237c02a7521c145bf`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.neutral-640.viewport-start.png`|16652|`53d683c1720f51743e05ab17db3408b63acb8fd4766463d237c02a7521c145bf`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.neutral-640.whole.png`|16652|`53d683c1720f51743e05ab17db3408b63acb8fd4766463d237c02a7521c145bf`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.print-346.viewport-end.png`|8994|`6db5427a50fa86bb27b72662a467c7520ea482387800512f83155d4f99efc353`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.print-346.viewport-start.png`|9861|`8ddefa6cc29e409bc799a6ff7e2392c88105b7ca313f94d45f55568c70af58e3`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.print-346.whole.png`|16395|`f264c08d96a7eb8b01b67d4e952cc9c31e82a9b1bcbebbf703aa65b449457e08`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.render.json`|1069|`63cea6122a04e28259d47c61b70f5eb598c46e1df7d7aa2aceaf3e75f45aaa80`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/fig-12.svg`|180219|`541f8bd8f238b2ea26a5bd53b49072b121bd148433cd002c83245699e670fe39`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/official-draft-validation.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/official-draft-validation.stdout.txt`|165|`dbdd160cb05d592120b96a067eb3341f5a51d50018c59a80ed5e134282f7b45d`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/official-render.stderr.txt`|1069|`63cea6122a04e28259d47c61b70f5eb598c46e1df7d7aa2aceaf3e75f45aaa80`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/official-render.stdout.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-12/initial/spec.json`|185884|`f9957d0f64c23f76357019a9aedca9081abf44e41f2bf6633ce5d5125550164e`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/author-curve-ledger.json`|7497|`33919452dccecabd58acd2cc632a8e96b78d6163ba04e6ccd4a779ecc52b6137`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/author-display-evidence.json`|11944|`6f963434f6c5e17fe3b296fd494a637c5de500dcd6a0040ab6030275a62069f2`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/execution.json`|4154|`6e2733d648d092f27abdfd165b1310a064ad9c38451643844f516daa1d5b2926`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.native.png`|16743|`82e6f00bf7766adba510cf99832abf04db0188d1ac0fc7f13bed71f5a7da2723`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.neutral-240.viewport-end.png`|6871|`8155e87817b965f38bd2cb08836c8f0ee597cbfd58339d0804267f914877f10c`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.neutral-240.viewport-start.png`|6214|`cee1518a2f9494b109aea25e4e24004e478f749d17deebdeec3a651336c81921`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.neutral-240.whole.png`|16686|`f7b97b857f479673327045da0f15139caf8da56b773b0d745f8e1716bb513098`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.neutral-358.viewport-end.png`|9565|`ace87075506808a5f58be0ab688f1b6a9f93599cc942f4570ec8745ffca51950`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.neutral-358.viewport-start.png`|10266|`98672c0f4506c85b09f34aad8ac630684b42c8bd810040de59eff4ce5c8434f1`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.neutral-358.whole.png`|16686|`f7b97b857f479673327045da0f15139caf8da56b773b0d745f8e1716bb513098`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.neutral-640.viewport-start.png`|16686|`f7b97b857f479673327045da0f15139caf8da56b773b0d745f8e1716bb513098`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.neutral-640.whole.png`|16686|`f7b97b857f479673327045da0f15139caf8da56b773b0d745f8e1716bb513098`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.print-346.viewport-end.png`|8994|`6db5427a50fa86bb27b72662a467c7520ea482387800512f83155d4f99efc353`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.print-346.viewport-start.png`|9909|`258f145ec13329944bd29d9f3732256c354bf3dad40bd4b554ea42e5ee373130`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.print-346.whole.png`|16430|`99d61e06449af6fc580207ae55571fd5c911e4881248041fa18f19d858506c7c`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.render.json`|932|`67dc0c53f51ff251f33eac138c583c402230d17d5efb7933cd539dbde3cb0bd2`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/fig-12.svg`|180220|`77947e1ed57440f59433bc20318db7b4c0c792a2b961fb24bf73c3a817f1f10f`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/official-draft-validation.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/official-draft-validation.stdout.txt`|165|`dbdd160cb05d592120b96a067eb3341f5a51d50018c59a80ed5e134282f7b45d`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/official-render.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/official-render.stdout.txt`|36|`aff59802b2234f5dc1de65f5c749ae37559229a88701b3f305fcc33a69058f3d`|
|`.tmp/s10y-image/batch007/10c/fig-12/repair/spec.json`|185869|`016a8e44ef65d83fe1583b0104a0deb47868c78d3e0d958ab8d41be9e143a091`|
|`.tmp/s10y-image/batch007/10c/fig-12/spec.json`|185869|`016a8e44ef65d83fe1583b0104a0deb47868c78d3e0d958ab8d41be9e143a091`|
|`.tmp/s10y-image/batch007/10c/fig-13/author-curve-ledger.json`|7146|`ee52bb40e852df39a6c9c0f8bd1b643ff9e0e1b11010ba1aa6ba1cd191a1e96c`|
|`.tmp/s10y-image/batch007/10c/fig-13/author-path-check.json`|3445|`8907d92992d96312959e9d281bc45ccfc282bd5d3a6da8a9dbb7a13524c57ff3`|
|`.tmp/s10y-image/batch007/10c/fig-13/context.json`|1976|`a8ea1c42c852a52c04d3dd7c2e4e68f1949ff20a933ad0b1f83042ed704681b4`|
|`.tmp/s10y-image/batch007/10c/fig-13/fig-13.native.png`|18805|`aff71237aee73953fc93d8c40b23340b8f11b6b8dbccdda4ff81f76d18573190`|
|`.tmp/s10y-image/batch007/10c/fig-13/fig-13.render.json`|1067|`ff067a3eb74663dd77c0e3830cf354d0414e937a0c3b83a13839c3ad009c96c0`|
|`.tmp/s10y-image/batch007/10c/fig-13/fig-13.svg`|180284|`a41327eb685017f8c8a6bb03f965d1ae32cbe554e70247e0b93d4f891a41b65a`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/author-curve-ledger.json`|7146|`ee52bb40e852df39a6c9c0f8bd1b643ff9e0e1b11010ba1aa6ba1cd191a1e96c`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/author-display-evidence.json`|11958|`44fd1f87b8a471b3ac7f298c40392afa1d0753f36094b85e0d65f464c328ce38`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/execution.json`|4170|`400e6ef2d77eb5ff76678248bf2947e0d500148c0bd670086d21e96842735755`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.native.png`|18791|`dff43e2a3fca392ba21e0b7acca9ab5697d8a49db340fa9011925d9d3559ac71`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.neutral-240.viewport-end.png`|6996|`02482eda311284282a9e2a16584843068a9a6c6e7d7f62df17aceb6d00fe7581`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.neutral-240.viewport-start.png`|6021|`cce1829e3a94fae27cd9fae13d8816491b8e4195c55b3f37f1c0e9e53261db59`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.neutral-240.whole.png`|18790|`fac44c9aa8243444db1cac5496ad699cc732c91bc75be39a6cd2c8c6c8b19d2c`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.neutral-358.viewport-end.png`|12404|`58fd62499110d4133e5a872262ec0b8d567e7246a4ca6c0ae155a7f441b8862f`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.neutral-358.viewport-start.png`|11244|`dddf17206df986ea1f9f119fc0a64fd3038ad2da48b811e78fab34169900c0fd`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.neutral-358.whole.png`|18790|`fac44c9aa8243444db1cac5496ad699cc732c91bc75be39a6cd2c8c6c8b19d2c`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.neutral-640.viewport-start.png`|18790|`fac44c9aa8243444db1cac5496ad699cc732c91bc75be39a6cd2c8c6c8b19d2c`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.neutral-640.whole.png`|18790|`fac44c9aa8243444db1cac5496ad699cc732c91bc75be39a6cd2c8c6c8b19d2c`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.print-346.viewport-end.png`|11297|`ba148e006c139ac6a94056e12c646bfaa806159528f1e4bfe0ff6b680b34df31`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.print-346.viewport-start.png`|10591|`956c41db65649b3db3034f9910d577763c0a6746269bb3c574ab647dbf257a9d`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.print-346.whole.png`|17512|`65a9b03d330df38a31f4ea4702134ca5ff9dff9b3e74c28b8d0445c87ce42089`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.render.json`|933|`d7cc1acf15abc4a63e2189d4462de3e308c7178f3ca8e44fdb6265f4cf1bad70`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/fig-13.svg`|180283|`6563ccf7507a8aabe81b7fbdf1168e6fdd29cd3e3ab2a695e2fd26492f1cfd8e`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/official-draft-validation.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/official-draft-validation.stdout.txt`|165|`487dd3cadf79632c3401b748e99e1f80ae9f120151d9de5f09c43f9730cb8ecc`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/official-render.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/official-render.stdout.txt`|36|`54d3dfdf321db0d1bcf9d331bb58ab519c307bb0eb934f5fbe625bd771e6f7ed`|
|`.tmp/s10y-image/batch007/10c/fig-13/initial/spec.json`|186647|`50ac39ca8994f9aa794344b8a8a3a6f509801f41b349578d6d4f6cf6a5bc4298`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/author-curve-ledger.json`|7146|`ee52bb40e852df39a6c9c0f8bd1b643ff9e0e1b11010ba1aa6ba1cd191a1e96c`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/author-display-evidence.json`|11943|`c9b51212d2367af1c449a045d65f31ee33a49ecbeb91a6fb5683f799714dc011`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/execution.json`|4157|`b48c9be3487babc4e9642c49ccb6394356db7c31c143020be58dfb69cc520ef6`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.native.png`|18805|`aff71237aee73953fc93d8c40b23340b8f11b6b8dbccdda4ff81f76d18573190`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.neutral-240.viewport-end.png`|6996|`02482eda311284282a9e2a16584843068a9a6c6e7d7f62df17aceb6d00fe7581`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.neutral-240.viewport-start.png`|5885|`bb153f8cc027977f87c0519747bfc1e47d4c4d245b3a227f340805effe91c15a`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.neutral-240.whole.png`|18813|`fecef2a48ed6f89f89e967bbe2dca57103573183eabc500dea2a888f7feb3f82`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.neutral-358.viewport-end.png`|12404|`58fd62499110d4133e5a872262ec0b8d567e7246a4ca6c0ae155a7f441b8862f`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.neutral-358.viewport-start.png`|11263|`74b6631cf0bf8e66fc536719e1e643a6825d5844108e078c447ce320f4708fb5`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.neutral-358.whole.png`|18813|`fecef2a48ed6f89f89e967bbe2dca57103573183eabc500dea2a888f7feb3f82`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.neutral-640.viewport-start.png`|18813|`fecef2a48ed6f89f89e967bbe2dca57103573183eabc500dea2a888f7feb3f82`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.neutral-640.whole.png`|18813|`fecef2a48ed6f89f89e967bbe2dca57103573183eabc500dea2a888f7feb3f82`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.print-346.viewport-end.png`|11297|`ba148e006c139ac6a94056e12c646bfaa806159528f1e4bfe0ff6b680b34df31`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.print-346.viewport-start.png`|10602|`524b5b8ffb5e8691b9599f7ffdffe230bc3ae30ebdd04f07f86425a477cc20ef`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.print-346.whole.png`|17532|`6cd5ec9bc51bf899c11841de779d9c4b53f75031b60446400153af0de53f4088`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.render.json`|1067|`ff067a3eb74663dd77c0e3830cf354d0414e937a0c3b83a13839c3ad009c96c0`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/fig-13.svg`|180284|`a41327eb685017f8c8a6bb03f965d1ae32cbe554e70247e0b93d4f891a41b65a`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/official-draft-validation.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/official-draft-validation.stdout.txt`|165|`487dd3cadf79632c3401b748e99e1f80ae9f120151d9de5f09c43f9730cb8ecc`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/official-render.stderr.txt`|1067|`ff067a3eb74663dd77c0e3830cf354d0414e937a0c3b83a13839c3ad009c96c0`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/official-render.stdout.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-13/repair/spec.json`|186632|`35eaddd293e83a7575fb0a85b223ce994bb19ebaaa4af478f7d636213b087ac3`|
|`.tmp/s10y-image/batch007/10c/fig-13/spec.json`|186632|`35eaddd293e83a7575fb0a85b223ce994bb19ebaaa4af478f7d636213b087ac3`|
|`.tmp/s10y-image/batch007/10c/fig-14/author-curve-ledger.json`|6827|`9b6c8972ac874e73d00c94a077759cf415020651a323082961284803a746edfa`|
|`.tmp/s10y-image/batch007/10c/fig-14/author-path-check.json`|3257|`388e064a6273ad12fe2ec04adf8e8c55e94a3c21eabadcb0952c51664c33f865`|
|`.tmp/s10y-image/batch007/10c/fig-14/context.json`|1743|`55bb96a17da1654f6478de6d77cf9fa094c587bd4b5a32238c0408f95e945585`|
|`.tmp/s10y-image/batch007/10c/fig-14/fig-14.native.png`|15448|`2c2beff09f3ef25ebba8ba2a0cf57667ea3cdf525da15238adaf0f2d5f8f0d78`|
|`.tmp/s10y-image/batch007/10c/fig-14/fig-14.render.json`|933|`0e198d98791e46298f9e9d6b3d8a393d52861b7974d1657204e60b0a9c23a280`|
|`.tmp/s10y-image/batch007/10c/fig-14/fig-14.svg`|174637|`b991a16407803d026b1e7b8a87c9ced2ab99a10e9e98b87f5dfd52c96efee3b1`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/author-curve-ledger.json`|6827|`9b6c8972ac874e73d00c94a077759cf415020651a323082961284803a746edfa`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/author-display-evidence.json`|11337|`f7b5ca2d00c2345ee51ab04b726d832f58ea589e4f37b2489847bef9d62ec4f4`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/execution.json`|4170|`54c31bef99389bfe16f702e8e984289d2c0ef3643d268d975a0adbd9c53e18f3`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.native.png`|15448|`2c2beff09f3ef25ebba8ba2a0cf57667ea3cdf525da15238adaf0f2d5f8f0d78`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.neutral-240.viewport-end.png`|6542|`e2a4ac11d0c09139b9038f4568e87951d4aae424047d6da298b48c5e71aca9ce`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.neutral-240.viewport-start.png`|6396|`0a64ebe5ff8f40d4e6e141ae3927bd0623c63ca6c143a5fcc32f727271ab3219`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.neutral-240.whole.png`|15474|`6ad0989a008443e249396b6f74006062e7a143532e99e000a430c6c022e1a768`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.neutral-358.viewport-end.png`|10032|`273e4712e87e67d4d986fb59aba942af53f3fbebeb8deaaefbd5bb99c65c5a5b`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.neutral-358.viewport-start.png`|10066|`772010e1dcaae882545124416139c7b71bfcf04ada3425fabb02895da40225a5`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.neutral-358.whole.png`|15474|`6ad0989a008443e249396b6f74006062e7a143532e99e000a430c6c022e1a768`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.neutral-640.viewport-start.png`|15474|`6ad0989a008443e249396b6f74006062e7a143532e99e000a430c6c022e1a768`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.neutral-640.whole.png`|15474|`6ad0989a008443e249396b6f74006062e7a143532e99e000a430c6c022e1a768`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.print-346.viewport-end.png`|9154|`100a77848e7ba1f6588edf89700981e95b4dea8305bd3586624e7092522efc6c`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.print-346.viewport-start.png`|9687|`4ae631959cd473437e0c90e044af73c088c0609aca24e99d7a3fd0f5f55b957a`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.print-346.whole.png`|15293|`30e648fae8b8dc8b47d851b7c57a5045ce40ef39c4a08e021dd1fb3b026cd756`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.render.json`|933|`0e198d98791e46298f9e9d6b3d8a393d52861b7974d1657204e60b0a9c23a280`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/fig-14.svg`|174637|`b991a16407803d026b1e7b8a87c9ced2ab99a10e9e98b87f5dfd52c96efee3b1`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/official-draft-validation.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/official-draft-validation.stdout.txt`|165|`f0414c92c38514ec5fc1f15e0b37153e23b9db9f20bd94123feed20599e185e6`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/official-render.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/official-render.stdout.txt`|36|`e0c841c5884e1d9c4d313248ae3f478ffdf9668fd25c78e1359cc2eec5729512`|
|`.tmp/s10y-image/batch007/10c/fig-14/initial/spec.json`|186360|`f16822e7c17d1a75b20724b45a37695c0843e033634a9f9bab5448f14ee100ab`|
|`.tmp/s10y-image/batch007/10c/fig-14/spec.json`|186360|`f16822e7c17d1a75b20724b45a37695c0843e033634a9f9bab5448f14ee100ab`|
|`.tmp/s10y-image/batch007/10c/fig-15/author-curve-ledger.json`|6086|`346bee59bd1eb98f36c128670024686c979372b6994b37874eeed99d1251811d`|
|`.tmp/s10y-image/batch007/10c/fig-15/author-path-check.json`|3242|`c4e5b5de145d20a84176cb566e95c2486e7a8b8e34a2a1ab732b1e494f4a55e5`|
|`.tmp/s10y-image/batch007/10c/fig-15/context.json`|1624|`eda2e024a8c077ebadfe8229f26b0b8b65d999a8fe8b84c65ef61070d6f70e96`|
|`.tmp/s10y-image/batch007/10c/fig-15/fig-15.native.png`|14491|`0fb78b1f24d3efbf5bb4cc87d3d8ae7185bbed813f7af62f5cbd51e20f35a043`|
|`.tmp/s10y-image/batch007/10c/fig-15/fig-15.render.json`|933|`0863a1a27d6291d2af74d56ef09e224f9493e3a04bb7633fb17fa92866932a32`|
|`.tmp/s10y-image/batch007/10c/fig-15/fig-15.svg`|172990|`54bb510fc31778706f94ebca39e883336a7db767d294646559176d3f30d231f8`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/author-curve-ledger.json`|6086|`346bee59bd1eb98f36c128670024686c979372b6994b37874eeed99d1251811d`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/author-display-evidence.json`|11947|`adeba44bb2f624aa49dde1d408fb72752c3bc17df2c79f8dc4fda796fcf3af84`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/execution.json`|4170|`b846cc7e67ae4766f53c4fc2df2942f6b2f318dd53415906af38bdceb743fc5a`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.native.png`|14491|`0fb78b1f24d3efbf5bb4cc87d3d8ae7185bbed813f7af62f5cbd51e20f35a043`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.neutral-240.viewport-end.png`|5988|`fee6cf40c92fcb3f1d1d2e57a4da05ded34353f252bb6bfa44715a686ff5409a`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.neutral-240.viewport-start.png`|5224|`e16505eda0106325bbcabbe5e96aeed457b6687605070eedc7f1af6397f27bea`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.neutral-240.whole.png`|14618|`ca5969b64295b4f4389e350fc6f15d9f465314e8fc4f848fe5acb0fb47436b6f`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.neutral-358.viewport-end.png`|10077|`0b4212ebbeec9fae4db97922d4d8e5d9c797d53d2363f1fb0df3f68d6a1a8fda`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.neutral-358.viewport-start.png`|8701|`c6cf6de4649aac5ecabb04e115788a44a2bca77a510e193014e18a594a7d5eba`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.neutral-358.whole.png`|14618|`ca5969b64295b4f4389e350fc6f15d9f465314e8fc4f848fe5acb0fb47436b6f`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.neutral-640.viewport-start.png`|14618|`ca5969b64295b4f4389e350fc6f15d9f465314e8fc4f848fe5acb0fb47436b6f`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.neutral-640.whole.png`|14618|`ca5969b64295b4f4389e350fc6f15d9f465314e8fc4f848fe5acb0fb47436b6f`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.print-346.viewport-end.png`|9849|`e06a27b7427558e5362a6caa2ef7193c496cb0209596c58e6c5d1868bdf39d6d`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.print-346.viewport-start.png`|8276|`95757a9a931323a077ba6500a058730c4b75fc39937f6b3cc83da0c974bbc83b`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.print-346.whole.png`|12977|`b0dad404282db73cd9dfaf6e709cb06e4e48b0e0dd774f1b5ca18a1934812d6f`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.render.json`|933|`0863a1a27d6291d2af74d56ef09e224f9493e3a04bb7633fb17fa92866932a32`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/fig-15.svg`|172990|`54bb510fc31778706f94ebca39e883336a7db767d294646559176d3f30d231f8`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/official-draft-validation.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/official-draft-validation.stdout.txt`|165|`b65774ebdd6d3ff99d68f5a6e7dc237f1ee0398a83dd70baf6c563e010f9104d`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/official-render.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/official-render.stdout.txt`|36|`4b28be99cbc399d03061657fd81b5a11cd13d87095cce85711713aede31f7054`|
|`.tmp/s10y-image/batch007/10c/fig-15/initial/spec.json`|179018|`d5548d965ab86cbfceefde0091b6c75cd1400cd2ed878810b111304dca90c256`|
|`.tmp/s10y-image/batch007/10c/fig-15/spec.json`|179018|`d5548d965ab86cbfceefde0091b6c75cd1400cd2ed878810b111304dca90c256`|
|`.tmp/s10y-image/batch007/10c/fig-16/author-curve-ledger.json`|6165|`f87a6d3f21d8a29ba8ce2576f2f9a38782e87d34e0e3d4de2ca79c1ca580977b`|
|`.tmp/s10y-image/batch007/10c/fig-16/author-path-check.json`|3226|`e38dd040830952add95aad8de8f2de5d447ec2982a202531c1fae6ab6fb77334`|
|`.tmp/s10y-image/batch007/10c/fig-16/context.json`|1515|`32fd71fff6077e33d01ee09440b74e5ff33836ccccb5ed8846b69b93eb98aec5`|
|`.tmp/s10y-image/batch007/10c/fig-16/fig-16.native.png`|13642|`a502ad429180f6ab37bc7bfbeec3b0771f984f7af3ac88c3caeb49cd60b8d19d`|
|`.tmp/s10y-image/batch007/10c/fig-16/fig-16.render.json`|933|`14945d27ac6349ec4f4cb9ae95d015cc02f41e1c465f7c0e9e586d00ee5d9c9e`|
|`.tmp/s10y-image/batch007/10c/fig-16/fig-16.svg`|175243|`b45fb2ef22623ca3c3ddc940f8e05042d87b81528953244340f4a794d71873e0`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/author-curve-ledger.json`|6165|`f87a6d3f21d8a29ba8ce2576f2f9a38782e87d34e0e3d4de2ca79c1ca580977b`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/author-display-evidence.json`|11938|`dd899af754c0d652d6c9eebed86f7750e6417224d8c2ef58742c0353272b4973`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/execution.json`|4170|`e80212727370eaffceb39d522ff9bcdf850d1bea27075083e4ac7182fe28360c`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.native.png`|13642|`a502ad429180f6ab37bc7bfbeec3b0771f984f7af3ac88c3caeb49cd60b8d19d`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.neutral-240.viewport-end.png`|6414|`31f9cd9c7f6756dc2c487468f02ed3579a32726e460df72084b7f1261b68d7c6`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.neutral-240.viewport-start.png`|5360|`4ec7b34a9ce263840b7138920c24365037ccf62a029894c2a7cbf2157350223d`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.neutral-240.whole.png`|13830|`612b947a65e8ae89bc509e32cccf8a7570b5473ca291afeb4ff0d86066b26ade`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.neutral-358.viewport-end.png`|9060|`e1e33eba73f1e2b884b39260783d897a3047b346c753f86c24e8350a9eeb8642`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.neutral-358.viewport-start.png`|7586|`8d30e1a67f8511d9477a25e1d2cef5a25231b114f1ae59892656daf06d4b756b`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.neutral-358.whole.png`|13830|`612b947a65e8ae89bc509e32cccf8a7570b5473ca291afeb4ff0d86066b26ade`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.neutral-640.viewport-start.png`|13830|`612b947a65e8ae89bc509e32cccf8a7570b5473ca291afeb4ff0d86066b26ade`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.neutral-640.whole.png`|13830|`612b947a65e8ae89bc509e32cccf8a7570b5473ca291afeb4ff0d86066b26ade`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.print-346.viewport-end.png`|8562|`9818ec5223c7048547e4b5d8e93984c2667581198e6a5c6296ae5c0b70bf9283`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.print-346.viewport-start.png`|7396|`4c877441c0406dfe844d2acc231b64aca22e7d25679462bc94dcaa3bc22a67fd`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.print-346.whole.png`|12130|`f228a6e5bd0d14c45c150a1b85ed3000e002c023f051712df42d39d9f608b0e8`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.render.json`|933|`14945d27ac6349ec4f4cb9ae95d015cc02f41e1c465f7c0e9e586d00ee5d9c9e`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/fig-16.svg`|175243|`b45fb2ef22623ca3c3ddc940f8e05042d87b81528953244340f4a794d71873e0`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/official-draft-validation.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/official-draft-validation.stdout.txt`|165|`552fba7432bca7e12613dc223c3526e2de2aa9b8034a07c77893e94897725ef1`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/official-render.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/official-render.stdout.txt`|36|`29dd7ae449782d75fd75b9cb0e4a9583b834ed59fcb4bc424cdfcb789d05debd`|
|`.tmp/s10y-image/batch007/10c/fig-16/initial/spec.json`|181289|`f6b00403a88ba748d1c6ffc8972e7d62f8a6d92c2e5fc6ace1bbd161169778b2`|
|`.tmp/s10y-image/batch007/10c/fig-16/spec.json`|181289|`f6b00403a88ba748d1c6ffc8972e7d62f8a6d92c2e5fc6ace1bbd161169778b2`|
|`.tmp/s10y-image/batch007/10c/fig-17/author-curve-ledger.json`|6742|`18f048e257fabef0197e80fd015469942a7e02a0a6daa3e4e982dbd4152aa7c8`|
|`.tmp/s10y-image/batch007/10c/fig-17/author-path-check.json`|3355|`1ce3f5ebb29619bed8e9241c9f19851bf656f455207973e162b6f4e869ef9015`|
|`.tmp/s10y-image/batch007/10c/fig-17/context.json`|1677|`39b344776454bb94b5bbfb40142665e48e2774c3e90d01d42ee251e6f104ec84`|
|`.tmp/s10y-image/batch007/10c/fig-17/fig-17.native.png`|17684|`6228317527d2792f41d40f5023199010b990129c41a63e2b434174854cae10ec`|
|`.tmp/s10y-image/batch007/10c/fig-17/fig-17.render.json`|932|`2854974c093934f2a3877136e7b0806bea5bce9f41e622f44f4db3f169bf44de`|
|`.tmp/s10y-image/batch007/10c/fig-17/fig-17.svg`|172378|`42ee42aa4f9024ff6ca43d3eb30c1ab22eef40da2b442cb000a927784453df38`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/author-curve-ledger.json`|6742|`18f048e257fabef0197e80fd015469942a7e02a0a6daa3e4e982dbd4152aa7c8`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/author-display-evidence.json`|11949|`e73879131bcfa69deb37d2b84fc44d9deebef6b36783db1d6bb4afc5a8918899`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/execution.json`|4170|`d8b8cb3760a7a7a4d40dfa50c7025dfbffd76f255dd05da0987fdf1f65ce3007`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.native.png`|17659|`33c493e4c132ace5ee8963bfff3b0f555858b53231ac174189c44dcae13ee30e`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.neutral-240.viewport-end.png`|8110|`02b696a08cfbe876f20fe84433ab87009e222ee30f54d2f02615fc1b04022203`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.neutral-240.viewport-start.png`|6559|`87a01e4387bb0b24f3b6ed738eb06e5edef92c3f8afc6230e1e02487f0882150`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.neutral-240.whole.png`|17939|`d43818f91995aa8aea429e02452890c77b1396806e65a31052613067054b39d3`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.neutral-358.viewport-end.png`|12330|`5dc83ba250c91ed11a5e642f183b31c20ec73159461febe2a3ff50649f5a6585`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.neutral-358.viewport-start.png`|9885|`4d5d38dfcff7192d5c26be2757f018d704540aa3bba9b22e42f7ecb95b24ef82`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.neutral-358.whole.png`|17939|`d43818f91995aa8aea429e02452890c77b1396806e65a31052613067054b39d3`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.neutral-640.viewport-start.png`|17939|`d43818f91995aa8aea429e02452890c77b1396806e65a31052613067054b39d3`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.neutral-640.whole.png`|17939|`d43818f91995aa8aea429e02452890c77b1396806e65a31052613067054b39d3`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.print-346.viewport-end.png`|11679|`a2aecb7671133cec093eddc0de6e761bac6b75f3f64e59e739cef94bec8cbba8`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.print-346.viewport-start.png`|9574|`0803b55534b788b3f8f841c41aebefc58f71ff1c77585f6df744b9ca24312f52`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.print-346.whole.png`|16408|`54d2de596899176d929381612ae5a481d87b297bddae8574fbddb76548a04d48`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.render.json`|933|`df8a3c101818bfee06eb610471b7e1e9372751156a88cc3a4ae6e0065770ca0b`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/fig-17.svg`|172378|`e27167eac47171819e2b4b8c527e850c5ccc19b8dc2264713e4946590cc92818`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/official-draft-validation.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/official-draft-validation.stdout.txt`|165|`b90d2bbb5e9d35dd92cdf407a7a69f70ef25349cb93b98e394bca7d5922199a3`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/official-render.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/official-render.stdout.txt`|36|`f9d214c27026678cd505eaff6c1fe0bbc3feaf6d605c6fc7305e2ef8c67ec78d`|
|`.tmp/s10y-image/batch007/10c/fig-17/initial/spec.json`|182180|`b5b3a6d28ab7e9c3236e269a3d48bd20d5520d11a5ed9c8de736772d54353ea5`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/author-curve-ledger.json`|6742|`18f048e257fabef0197e80fd015469942a7e02a0a6daa3e4e982dbd4152aa7c8`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/author-display-evidence.json`|11933|`06c30fbbcb579f85e6aea763d0e8ed2bdb1906be796ab445002b7bad83ec25f2`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/execution.json`|4154|`20a63eadf75f3e204bbcd5e25b655402313c0d8c36d0ded3d26f80849a45898a`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.native.png`|17684|`6228317527d2792f41d40f5023199010b990129c41a63e2b434174854cae10ec`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.neutral-240.viewport-end.png`|8110|`02b696a08cfbe876f20fe84433ab87009e222ee30f54d2f02615fc1b04022203`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.neutral-240.viewport-start.png`|6559|`87a01e4387bb0b24f3b6ed738eb06e5edef92c3f8afc6230e1e02487f0882150`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.neutral-240.whole.png`|17937|`7585c3c62dab11b3d8f5c1ee04c3b51c706b9e6b9abde201cfd147364c35d66b`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.neutral-358.viewport-end.png`|12350|`9776c4be9457a9596609fd5257f36b00d368379b43086f4244cd2e2d51978895`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.neutral-358.viewport-start.png`|9905|`c3169545917a6714d70c38eba80840435a025a82f03ef2991210676fba71345d`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.neutral-358.whole.png`|17937|`7585c3c62dab11b3d8f5c1ee04c3b51c706b9e6b9abde201cfd147364c35d66b`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.neutral-640.viewport-start.png`|17937|`7585c3c62dab11b3d8f5c1ee04c3b51c706b9e6b9abde201cfd147364c35d66b`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.neutral-640.whole.png`|17937|`7585c3c62dab11b3d8f5c1ee04c3b51c706b9e6b9abde201cfd147364c35d66b`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.print-346.viewport-end.png`|11878|`977fe7fc540b9677e6e5e25dae5ea05dbb10a01c941c58fafad55c1acfd87469`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.print-346.viewport-start.png`|9614|`22d6ca0f189589932c1404e83a2522719395b4c739912e624b12ff4e7bb0a8c3`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.print-346.whole.png`|16438|`43d65319946f3301c78db06cecaa7d8011da17118705ad72b9bdfa1057e7a495`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.render.json`|932|`2854974c093934f2a3877136e7b0806bea5bce9f41e622f44f4db3f169bf44de`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/fig-17.svg`|172378|`42ee42aa4f9024ff6ca43d3eb30c1ab22eef40da2b442cb000a927784453df38`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/official-draft-validation.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/official-draft-validation.stdout.txt`|165|`b90d2bbb5e9d35dd92cdf407a7a69f70ef25349cb93b98e394bca7d5922199a3`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/official-render.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/official-render.stdout.txt`|36|`f9d214c27026678cd505eaff6c1fe0bbc3feaf6d605c6fc7305e2ef8c67ec78d`|
|`.tmp/s10y-image/batch007/10c/fig-17/repair/spec.json`|182165|`00942216217600fe095129f33b1c0ca13a8b7af39f4cdfd83f348fa119623b03`|
|`.tmp/s10y-image/batch007/10c/fig-17/spec.json`|182165|`00942216217600fe095129f33b1c0ca13a8b7af39f4cdfd83f348fa119623b03`|
|`.tmp/s10y-image/batch007/10c/fig-18/author-curve-ledger.json`|6695|`5c344334f8f8a9b24291a8c637284e91b980702f341e3195e37bba34dd6c219c`|
|`.tmp/s10y-image/batch007/10c/fig-18/author-path-check.json`|3242|`2ed93b7815c194e7a0081f51f9988507c4d0f7be5efa37894bc0c8f7ccd89c2e`|
|`.tmp/s10y-image/batch007/10c/fig-18/context.json`|1694|`826231656428bdcc855b40b7da1e246fef4dbc82334468667c89c9eb39acd3a0`|
|`.tmp/s10y-image/batch007/10c/fig-18/fig-18.native.png`|14278|`544ea22eef5c4fba636d66957560bafb0f79debfd8ccd49c88eec7bfdb8feab9`|
|`.tmp/s10y-image/batch007/10c/fig-18/fig-18.render.json`|933|`f2858c994a965cb27a351bab00300882df7f41b58725cafcfaafa8ddf270abf7`|
|`.tmp/s10y-image/batch007/10c/fig-18/fig-18.svg`|173068|`d683c152185255f1e33540e7fdfdb5e9848bca8a704f4bca2cf1f01fadafda19`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/author-curve-ledger.json`|6695|`5c344334f8f8a9b24291a8c637284e91b980702f341e3195e37bba34dd6c219c`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/author-display-evidence.json`|10723|`a8c4f95c759a6badfcccb43dc5c29464fe38ebf5431d5738e84dbb5fb85c7ce2`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/execution.json`|4170|`8faa7f07a876969726c3e4a641e988ba9d5525def3d093350d946bcfae70a47d`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.native.png`|14278|`544ea22eef5c4fba636d66957560bafb0f79debfd8ccd49c88eec7bfdb8feab9`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.neutral-240.viewport-end.png`|7327|`40f228228e28e406e462120ef6cff756d1b288b36429c29974ee609d474e4db2`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.neutral-240.viewport-start.png`|4719|`1a4c8151388f6f55e003a3e91b03f467d364f9b50c4a2092c6f7ae9c10b0189e`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.neutral-240.whole.png`|14330|`8cc4d0dc66a554408b53191970c39b14f96bb6b91b25c9a82cd26a0a37eedbf0`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.neutral-358.viewport-end.png`|10260|`41fd2117cf9ecfe97c6fddccac71bb765da0d97cfd1ada373f87cfea3d784a5f`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.neutral-358.viewport-start.png`|7610|`8c7a8f1898839a1852da681cd6a8f75f18cf14da2c5229476ec97b51fffd480d`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.neutral-358.whole.png`|14330|`8cc4d0dc66a554408b53191970c39b14f96bb6b91b25c9a82cd26a0a37eedbf0`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.neutral-640.viewport-start.png`|14330|`8cc4d0dc66a554408b53191970c39b14f96bb6b91b25c9a82cd26a0a37eedbf0`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.neutral-640.whole.png`|14330|`8cc4d0dc66a554408b53191970c39b14f96bb6b91b25c9a82cd26a0a37eedbf0`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.print-346.viewport-end.png`|9608|`75219a8a19b3b1ebc44a0b012ab7e56f3d7063d204ac2308f867ed5347f2270e`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.print-346.viewport-start.png`|7241|`261ace02dbfafef9b8816f0918c8181244e027bdfded43487de8bb17040f9a30`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.print-346.whole.png`|14035|`e7e6d1bf30efbdbdf26d4be615ff1aab59b914c33bc4c77eae55881c4ee0292f`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.render.json`|933|`f2858c994a965cb27a351bab00300882df7f41b58725cafcfaafa8ddf270abf7`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/fig-18.svg`|173068|`d683c152185255f1e33540e7fdfdb5e9848bca8a704f4bca2cf1f01fadafda19`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/official-draft-validation.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/official-draft-validation.stdout.txt`|165|`1b724657ca98542db46e5a6fde3125ecdcecb0ce91840445deafc8dfdae6f434`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/official-render.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/official-render.stdout.txt`|36|`39b092991b4bfd32f3bc0349525069394ca19263767eee27f66d73ede85081e6`|
|`.tmp/s10y-image/batch007/10c/fig-18/initial/spec.json`|185718|`3e3a185d133ecd62d43ee0eb0fc9f176964e92666be3c4ba5d8e76baf2ccf6ca`|
|`.tmp/s10y-image/batch007/10c/fig-18/spec.json`|185718|`3e3a185d133ecd62d43ee0eb0fc9f176964e92666be3c4ba5d8e76baf2ccf6ca`|
|`.tmp/s10y-image/batch007/10c/fig-19/author-curve-ledger.json`|7240|`221f932ad450ba90acbed5f20abef764757ba44fa2a7731b8b37b7639fb399b8`|
|`.tmp/s10y-image/batch007/10c/fig-19/author-path-check.json`|3227|`a9bee8599f8128bb12c6f047c2519dbbac2e4dfdfc010afca910c12e0d4e1df0`|
|`.tmp/s10y-image/batch007/10c/fig-19/context.json`|1140|`42db17d8c0fef1b72b648bb2dbc8d13fb173292ecd9d697e43dc4ec0b92b2dfb`|
|`.tmp/s10y-image/batch007/10c/fig-19/fig-19.native.png`|15862|`ead2daceb775b0f91c430b7742f984997b5ec4c17ec6cce08cefff24b59193c1`|
|`.tmp/s10y-image/batch007/10c/fig-19/fig-19.render.json`|933|`873342ed910b321e385889fe8799417de5adf4e0de4d0b7ec54903fa40786382`|
|`.tmp/s10y-image/batch007/10c/fig-19/fig-19.svg`|172860|`5c448ff94934a4c866e71d82aa222e23fda849c04beef5a377a625518474407f`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/author-curve-ledger.json`|7240|`221f932ad450ba90acbed5f20abef764757ba44fa2a7731b8b37b7639fb399b8`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/author-display-evidence.json`|10152|`65461787afb2c239d1ea3c8abac97c21f9e48c49b0c5d1c16bf72266c82115a6`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/execution.json`|4170|`51fe9e3675e815bdd9344ec45f25985a3ba9d275f5d8e01f19260872079fd0b9`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.native.png`|15862|`ead2daceb775b0f91c430b7742f984997b5ec4c17ec6cce08cefff24b59193c1`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.neutral-240.viewport-end.png`|6976|`1126138620555c127f75706e6bc5a1b94f10ccb7f18144311efde4a3c8346ce4`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.neutral-240.viewport-start.png`|5698|`e6854704a1f491219ab5d3d37aca4089f6f405b517d3753423053f0390608c7a`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.neutral-240.whole.png`|15748|`e99b960d6bf9c24c9937e4cb8125fdcfccec821f9dc408a7419a91109afbc8a2`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.neutral-358.viewport-end.png`|10527|`bf7313d337faf5bf63ead94eb44a4f9e01874ec98b405b2460e85ab07db0c490`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.neutral-358.viewport-start.png`|9044|`2f3b173c1516f098430a352ec37cab261e01e226e17fec2b7ddeba0264bad525`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.neutral-358.whole.png`|15748|`e99b960d6bf9c24c9937e4cb8125fdcfccec821f9dc408a7419a91109afbc8a2`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.neutral-640.viewport-start.png`|15748|`e99b960d6bf9c24c9937e4cb8125fdcfccec821f9dc408a7419a91109afbc8a2`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.neutral-640.whole.png`|15748|`e99b960d6bf9c24c9937e4cb8125fdcfccec821f9dc408a7419a91109afbc8a2`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.print-346.viewport-end.png`|9977|`26705bf6e6d13f84218f3e81003641a73c076ac82a48ff6335864881618d919e`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.print-346.viewport-start.png`|8777|`bf624ae1fd6a405c7b99d4dff85ed9ebfb07b1114d724fe9c00751b4022ff31b`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.print-346.whole.png`|15578|`8657e3e9feaf514c9521e8a372dab020b4a50618dbc6357c5fb63990d68a3942`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.render.json`|933|`873342ed910b321e385889fe8799417de5adf4e0de4d0b7ec54903fa40786382`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/fig-19.svg`|172860|`5c448ff94934a4c866e71d82aa222e23fda849c04beef5a377a625518474407f`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/official-draft-validation.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/official-draft-validation.stdout.txt`|165|`36c2935c577c137a841eb55df9e158184a5b6a24f633ce27a706ff6682a83f7e`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/official-render.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/official-render.stdout.txt`|36|`1c0c400fe0659e054debe8e932c02354ffe2a61a48ac4e126d11e604dae81a45`|
|`.tmp/s10y-image/batch007/10c/fig-19/initial/spec.json`|187069|`88720abf1ad615c401aa12142f28350efbeb3cd42646c79b8b1977aaf8b61b22`|
|`.tmp/s10y-image/batch007/10c/fig-19/spec.json`|187069|`88720abf1ad615c401aa12142f28350efbeb3cd42646c79b8b1977aaf8b61b22`|
|`.tmp/s10y-image/batch007/10c/fig-20/author-curve-ledger.json`|7692|`3f0bc2043c4a75cbf2b7fc72fef6826fd76d42d6780f9c22a9728f6f66fd8f13`|
|`.tmp/s10y-image/batch007/10c/fig-20/author-path-check.json`|3253|`a97d822da8bea6cde2f45b8127fb0f6dfbe0d530dc9a4ce390885b8eb808dfc5`|
|`.tmp/s10y-image/batch007/10c/fig-20/context.json`|1140|`23268c2cc3b0ae0e6b58af0d9ec40c6d238c80e3a532b90e2c2a827eac8b0d5b`|
|`.tmp/s10y-image/batch007/10c/fig-20/fig-20.native.png`|17623|`c19dc4395c3ddf717225b1231964406df4623a35cef92276c2f0fbd445c380e5`|
|`.tmp/s10y-image/batch007/10c/fig-20/fig-20.render.json`|933|`9a64f8f0ee208637fdabd19a85faa279924114823b62f038112e44169543359e`|
|`.tmp/s10y-image/batch007/10c/fig-20/fig-20.svg`|174210|`beb5731465e3cfe8a08d948d341375064777eb6c0c4390bb01d2426f3ace2092`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/author-curve-ledger.json`|7692|`3f0bc2043c4a75cbf2b7fc72fef6826fd76d42d6780f9c22a9728f6f66fd8f13`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/author-display-evidence.json`|10157|`a152bd72aed0f7f238896945cd902b9f333d80d7ea108dbba0f36c7972aa702d`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/execution.json`|4170|`94c2c34c3a04e593337af5d5bacb2bee8872ca702818f9b91b4cd407b63734d6`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.native.png`|17623|`c19dc4395c3ddf717225b1231964406df4623a35cef92276c2f0fbd445c380e5`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.neutral-240.viewport-end.png`|8277|`72fdc951b6d554d8f416844ff221d710f84ef72307b98f605538ae48b23bf187`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.neutral-240.viewport-start.png`|5816|`e3c1f025d28da5963711be416e55a524620b422f1eea263b4e9769d1d11fa5e3`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.neutral-240.whole.png`|17669|`69a6994586d0f3b51e4c181affa48edfc656ec2a96488dee931e4ce4987bd50d`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.neutral-358.viewport-end.png`|12062|`eebf2efbed7e90011a911d491aaf5ef3eac24826e83b67edc403233281706487`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.neutral-358.viewport-start.png`|9936|`24895dd1646c09fd1b61460999869f5306e7fdf5ccc07fa5be42b5caac3fc7f3`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.neutral-358.whole.png`|17669|`69a6994586d0f3b51e4c181affa48edfc656ec2a96488dee931e4ce4987bd50d`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.neutral-640.viewport-start.png`|17669|`69a6994586d0f3b51e4c181affa48edfc656ec2a96488dee931e4ce4987bd50d`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.neutral-640.whole.png`|17669|`69a6994586d0f3b51e4c181affa48edfc656ec2a96488dee931e4ce4987bd50d`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.print-346.viewport-end.png`|11597|`995a0dfd00813fc2e24cffa106d23448498e8bc0a6605bd081784c92878e3486`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.print-346.viewport-start.png`|9650|`5b23d192755c47da616932bbe703dbb07bd9fa6bda23dc0f01133a7f4eb52b66`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.print-346.whole.png`|17610|`fbb7e70d3998ddaffd861cd285026c7b552af728afa86ceb89a42a7660829d09`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.render.json`|933|`9a64f8f0ee208637fdabd19a85faa279924114823b62f038112e44169543359e`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/fig-20.svg`|174210|`beb5731465e3cfe8a08d948d341375064777eb6c0c4390bb01d2426f3ace2092`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/official-draft-validation.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/official-draft-validation.stdout.txt`|165|`25239b06cb7f74cccecc2686f22ea34297fede4e5e3bbcf369a87fd9749e3c7f`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/official-render.stderr.txt`|0|`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/official-render.stdout.txt`|36|`c752ab9b556d0a103042a7281b3e13a858c691e56b82f0429b93f728b921f762`|
|`.tmp/s10y-image/batch007/10c/fig-20/initial/spec.json`|189689|`176e4af6011934e7de18193f9061a4342db145ce323750b610fd906c95b690da`|
|`.tmp/s10y-image/batch007/10c/fig-20/spec.json`|189689|`176e4af6011934e7de18193f9061a4342db145ce323750b610fd906c95b690da`|
|`.tmp/s10y-image/batch007/10c/fig-12/author-package-hashes.json`|165856|`5a031de96167b0849f23055a6cfe533593a46154146f75466a803958bf37090a`|
