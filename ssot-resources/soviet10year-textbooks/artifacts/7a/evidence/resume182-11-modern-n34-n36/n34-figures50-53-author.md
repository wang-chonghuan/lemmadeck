# STEMROBIN-182 n34 Figures 50-53 Author Checkpoint

Sole cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`. Candidate author only; no independent review, promotion or persistent edits.

**Status:** fig50 candidate-ready-independent-review; fig51-53 HOLD-final-preview-checkpoint.
All current render reports pass at fixed 640 px, with no collisions and minimum text >=16 px. This is not visual approval.
Actual images loaded: source 4 + preview 4 = 8. No crops, reopens, network, paid calls or image generation.
Eight preview files were produced across render attempts; only four previews were loaded into context.

## Latest Continuation
Human confirmed p0218#9 final comparison: last greater -> smaller, retaining does not hold. Geometry remains y=12/x with separate branches and (-2,-6), (6,2).
Parent owns metadata, persistent modern-draft correction and fig51 nearby-text binding. Current candidate fig51 is still bound to the pre-correction context and is explicitly on binding HOLD.

## Technical Recovery
Initial specs for 51-53 supplied already-scaled pixel raw paths. The existing renderer scaled them again, so viewed previews had axes/labels but absent curves despite machine render pass.
FIRST specs and outputs were preserved; the inverse raw-path scale was applied only to d, preserving all source knots/endpoints and mathematics. Only affected render stages were rerun.
Fig53 also had FIRST render exit 2 for three label collisions. Its first targeted repair changed only offsets for 16, 0 and (m/s), without font reduction.
Corrected current previews of 51-53 were NOT viewed because all eight image slots were consumed. Keep their author HOLD until a fresh bounded preview checkpoint.

## fig-50
Status: **candidate-ready-independent-review**.

Source inventory: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-50/source-inventory.json`
Candidate directory: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-50`
- source SHA-256: `f8e2225b74353fbdd6b941ed5ba822416bb11cf8d2778012772f516124ab8f9f`
- sourceInventory SHA-256: `942dfd2ac3f193b27417f59a2910283f8bc79a7976d047576a260b5d1b0224a6`
- spec SHA-256: `a8507daef172da15b4d27161900f94c4be328c17391efba0847eb41e06ef2c36`
- render SHA-256: `98107abcab67bb0666cc1171dc966365a67de272d10b77003334d9a3234171d8`
- svg SHA-256: `f544d39f77d8645cc59d7f0d6ae0f2e43569645d2c4c7860ef90c2ec40d98a0d`
- preview SHA-256: `2a89e691910c160bee3290d3b90d1b92461d261514dd98c5687d421b0f7cea82`
- Attempts: {"buildContextExistingFirst":1,"buildContextReruns":0,"author":1,"standaloneValidation":1,"render":1,"ordinaryLabelOffsetRepairs":0,"technicalPathScaleRepairs":0,"mathematicalSourceRevisions":0}
- Exits: {"buildContextExistingFirst":[0],"author":[0],"validate":[0],"render":[0],"pathScaleRepair":[],"preserveBeforeLayoutRepair":[]}
- Actual image loads: source 1 + preview 1; viewed preview hash `2a89e691910c160bee3290d3b90d1b92461d261514dd98c5687d421b0f7cea82`; current preview viewed: true.

Source facts:
- One subfigure; 13 vertical rulings x=-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7 and 13 horizontal rulings y=-3,-2,-1,0,1,2,3,4,5,6,7,8,9: 12 columns, 12 rows; no half-unit lattice or gaps.
- Positive-axis arrows; x values -4,-2,0,2,4 and y values 2,4,6; visible x,y and y=|x|. Origin is the shared axis intersection.
- A solid V, left boundary at (-5,5), vertex (0,0), right boundary at (7,7); left arm decreases and right arm increases. No curve arrows, endpoint disks, dashed strokes or named points.

Deliberate additions:
- Formula-authoritative straight segments exactly y=|x|, not a fitted source curve.
- Crisp semantic-color vector strokes and English/math typography; same lattice counts, scale, labels and endpoints. Subpixel assertion anchors are covered by existing strokes, not added point markers.

## fig-51
Status: **HOLD-final-preview-checkpoint**.

Source inventory: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-51/source-inventory.json`
Candidate directory: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-51`
- source SHA-256: `83e3626bdbb44ee252a050beb49956a99b04e67635c2678ba471bab59e8882da`
- sourceInventory SHA-256: `623d217051da3abe123ff8c75a7ddd41292f2e98130028b71a2fec7b3d888547`
- spec SHA-256: `8f0cc159f55fe6b5446af036e40a08f4fa2c3b2ec517a42a6d9b7702dbda6a84`
- render SHA-256: `c6e94ea178184151c1c1a1a27f2fe018cff99d3b93582fd1647460914175828d`
- svg SHA-256: `9591a6fb10790f591749a562d0db13d2a4062c413ca15629887e9adeb55890aa`
- preview SHA-256: `9ceac4d70512ad9691d596a35dff9c740846ab2ab7e7539d97f31dcbe787c6c6`
- Attempts: {"buildContextExistingFirst":1,"buildContextReruns":0,"author":1,"standaloneValidation":1,"render":2,"ordinaryLabelOffsetRepairs":0,"technicalPathScaleRepairs":1,"mathematicalSourceRevisions":0}
- Exits: {"buildContextExistingFirst":[0],"author":[0],"validate":[0],"render":[0,0],"pathScaleRepair":[0],"preserveBeforeLayoutRepair":[]}
- Actual image loads: source 1 + preview 1; viewed preview hash `9c8a326ba54e8e4aa64b81d0dfc0e08aadc37940da243cb7c68771722db8059f`; current preview viewed: false.

Source facts:
- One subfigure; 13 vertical rulings x=-10,-8,-6,-4,-2,0,2,4,6,8,10,12,14 and 13 horizontal rulings y=-10,-8,-6,-4,-2,0,2,4,6,8,10,12,14: 12 columns, 12 rows, each cell 2 by 2.
- Positive-axis arrows; x values -8,-4,0,4,8; y values -8,-4,4,8; x,y and y=12/x labels. No curve or axis value at x=0 for this function.
- Solid disconnected branches in the first and third quadrants, decreasing separately; neither joins nor crosses an axis. Negative branch is cropped at the left and lower frame, positive branch at upper and right frame. No marked curve points or endpoint arrows/disks.
- Formula and prose pair are authoritative: x1=-2 gives -6 and x2=6 gives 2. These are not visible point labels in the source and are not added as answer annotations.

Deliberate additions:
- Exact formula sampling of separate branches clipped to the observed frame; no invented domain connection or alternative graph.
- Crisp semantic-color vectors; source grid cell scale and labels retained. Subpixel assertion anchors on existing strokes add no discernible markers or answer labels.
- The context's last sentence remains verbatim provenance only. Its unapproved math adjudication is not a text correction or graph authority.

HOLD: One allowed completed preview was viewed before the raw-path scale repair and showed absent curves. Corrected current preview has not been opened; bounded author visual gate remains incomplete.
HOLD: The parent confirmed the third p0218#9 erratum (last greater -> smaller, retaining does not hold). Current context/spec still contain the pre-correction nearby text; parent-owned binding is pending. Geometry is unchanged.

## fig-52
Status: **HOLD-final-preview-checkpoint**.

Source inventory: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-52/source-inventory.json`
Candidate directory: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-52`
- source SHA-256: `adde632a2af9ee3f00659b01b2758caebb2684b39e8713835298441158a6a4b7`
- sourceInventory SHA-256: `beab42f542c0734e01691f61f69fe45d06d4196492029e2948fe790f56875250`
- spec SHA-256: `837cdf8d41146033adc606ed6cc301572b40f6025bd2b9f6a4fe5ac7664f5e7d`
- render SHA-256: `2784b30188acc23c33af9692aa47a35840df43cf8a6d85d7bcc2f4279016d80e`
- svg SHA-256: `8fc492d5eb6dabdb3983936fbca77e3098ccb126e7668ab15932d7f79514d1c5`
- preview SHA-256: `a0b591708acea5e423a18925b2318f5b8ae3497f203ae257b219f98ee81d1066`
- Attempts: {"buildContextExistingFirst":1,"buildContextReruns":0,"author":1,"standaloneValidation":1,"render":2,"ordinaryLabelOffsetRepairs":0,"technicalPathScaleRepairs":1,"mathematicalSourceRevisions":0}
- Exits: {"buildContextExistingFirst":[0],"author":[0],"validate":[0],"render":[0,0],"pathScaleRepair":[0],"preserveBeforeLayoutRepair":[]}
- Actual image loads: source 1 + preview 1; viewed preview hash `f323c777141f5c664483fda1d55fa7000292a034f3575b229afc095f4ee3039f`; current preview viewed: false.

Source facts:
- One subfigure; 13 vertical rulings x=-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6 and 13 horizontal rulings y=-3,-2,-1,0,1,2,3,4,5,6,7,8,9: 12 columns, 12 rows, unit cells.
- Positive-axis arrows; x values -4,-2,0,2,4 and y values 2,4; x,y only, with no printed formula. No separately marked points, dashed curve, curve arrows or endpoint markers.
- One solid U-shaped curve; it falls on the negative side and rises on the positive side. Its minimum is below the origin near the y axis, not on y=0. Left visible endpoint is about pixel (16,54), right about (374,49); there is no permission to extend either beyond the source stroke.
- Calibration recorded before interpolation: source origin approximately (196,293), x unit 30 pixels, y unit 30.3 pixels. Pixel readings are approximate, not exact given ordinates.
- Queried x=-3.6 is approximately pixel x=88,y=185 (y about 3.6); x=-2.1 is x=133,y=266 (y about 0.9); x=1.3 is x=235,y=291 (y about 0.1); x=2.8 is x=280,y=243 (y about 1.7). Ordinate reading uncertainty about 0.2 units; order is clear, no numeric answers are printed.
- Negative same-sign ordered arguments follow the falling source arm; positive same-sign ordered arguments follow the rising source arm. No formula, symmetry or exact zero/minimum ordinate is asserted from appearance.

Deliberate additions:
- Piecewise-linear digitization joins independently inventoried source knots; it is not a parabola or any analytic formula, and makes no extrapolation. Slight printed stroke irregularity remains represented by the knots.
- Approximate queried ordinates are evidence coordinates with uncertainty, not exact source values or visible annotations.
- Semantic vector grid and source-label typography; subpixel assertion anchors sit on the existing curve without introducing endpoint or query markers.

HOLD: One allowed completed preview was viewed before the raw-path scale repair and showed absent curves. Corrected current preview has not been opened; bounded author visual gate remains incomplete.

## fig-53
Status: **HOLD-final-preview-checkpoint**.

Source inventory: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-53/source-inventory.json`
Candidate directory: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures/fig-53`
- source SHA-256: `be4c8a21df186566df4a4d75fa7b354feb0d3173adbb85df69ad61695f59d0d8`
- sourceInventory SHA-256: `fd7e400b690ac84637100632b29adc3ad2248de36c04c8bf106c1628c707ac02`
- spec SHA-256: `f4a34d074def8d350457c201d23ea4727ad57cb9c45adb316703d3892d0e0b16`
- render SHA-256: `ab767384dfc4b2a4cf7adaaf4a4ed7a29d824dc385b34ba1b7aa917fa6c08b06`
- svg SHA-256: `0837b07d3cc374b0ea8d1f906f57464775f9e9b780ddec669b58a4a9a18a9d16`
- preview SHA-256: `72b19bd615c1e5be24352e27d5934037d5777aa3468593d1ef995858e54ec164`
- Attempts: {"buildContextExistingFirst":1,"buildContextReruns":0,"author":1,"standaloneValidation":1,"render":3,"ordinaryLabelOffsetRepairs":1,"technicalPathScaleRepairs":1,"mathematicalSourceRevisions":0}
- Exits: {"buildContextExistingFirst":[0],"author":[0],"validate":[0],"render":[2,0,0],"pathScaleRepair":[0],"preserveBeforeLayoutRepair":[0]}
- Actual image loads: source 1 + preview 1; viewed preview hash `715c526015ce0609d945e7af6e8af1578c1e591a21ced971628ffc734fad6468`; current preview viewed: false.

Source facts:
- One wide subfigure; 25 vertical rulings t=-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21 and 13 horizontal rulings v=-2,-1,0,1,2,3,4,5,6,7,8,9,10: 24 columns and 12 rows, unit cells. Grid extends beyond the data and includes three negative-time columns.
- Shared axes t and v, positive-axis arrows; t tick values 0,2,4,6,8,10,12,14,16; v values 2,4,6. Original unit words mean seconds and metres per second, translated to t (s) and v (m/s). No other numbers are added.
- All queried turns/endpoints before interpolation: start (0,0), rise-to-flat (6,5), flat-to-fall (14,5), stop (16,0). Constant v=5 segment spans exactly t=6 through t=14. No curve beyond t=16 or before t=0.
- Solid stroke, rising arm mildly bent, plateau horizontal, falling arm bent and steep; preserve these as traced segments, not a straight-line model or smooth regularized curve. No curve arrows, labeled points, open/closed endpoint disks or dashed strokes.
- Intermediate visual readings have finite stroke uncertainty, not exact queried values: t=1 about v=1, t=2 about 1.8, t=3 about 2.6, t=4 about 3.4, t=5 about 4.2; on fall t=14.5 about 3.3, t=15 about 1.9 and t=15.5 about 0.6.

Deliberate additions:
- Piecewise-linear source digitization retains all four calibrated turns/endpoints and observed bending; no regression, smooth interpolation, extrapolation or invented speed formula.
- English unit abbreviations replace the source's Chinese unit words. Crisp vectors retain 24-by-12 cells and source numbers; no extra ticks, values or answer intervals are annotated.
- Subpixel executable anchors are covered by the graph stroke, not new point markers.

HOLD: One allowed completed preview was viewed before the raw-path scale repair and showed absent curves. Corrected current preview has not been opened; bounded author visual gate remains incomplete.

## Receipt Index
Full command/cwd/start/finish/exit and stream/output hashes: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-11/n34-figures50-53-author.json`.
Receipts were created before each producer, preserving FIRST failures and historical outputs. No review@1 pass file was written.

