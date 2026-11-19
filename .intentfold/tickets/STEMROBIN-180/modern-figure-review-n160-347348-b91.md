# B91 n160 Independent FIG Review: 347/348

Date: 2026-11-19. Ticket scope: STEMROBIN-180 C / 180-4.
Workspace/cwd: `/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.

**fig-347: REVISE. fig-348: REVISE.**

Limited independent FIG review only. Previously approved SOURCE/TEXT conclusions are retained unchanged and are not reopened here. This is not whole-lesson approval, headed-product DISPLAY acceptance, official review metadata, or promotion.

## Inputs and Method

Read `ld-s10y-image/SKILL.md`, `references/figure-spec.md`, and `references/quality-gate.md` in this workspace, the designated author inventory, and only the fig-347/fig-348 entries returned from `selected-candidates.json`. Both selected specifications are in their respective `brush-label-repair/` directories.

Read the complete 26-entry `source.authoritativeText` in each selected specification. The two arrays are identical; their SHA-256 over compact `JSON.stringify(array)` is `dc672e14ebb90f3f646c7edd9712a6780b2e78571fd27cf26eabb09666ec2860`. The author's inventory and object counts were not treated as proof of visual fidelity.

Image inspection order, each once:

1. Original fig-347 PNG at its selected specification's `source.image.path`.
2. Original fig-348 PNG at its selected specification's `source.image.path`.
3. Selected fig-347 `native.png`.
4. Selected fig-348 `native.png`.

Each native PNG was inspected as supplied: full 640px figure at the top and current 297px app-CSS figure at the bottom. No candidate PNG, crop, screenshot regeneration, or image reopen was used. No pixels are included in this report or returned to another chat.

Existing selected `render.json` and `native.json` both report `pass`. Their source/spec/SVG/render/native-image/native-HTML/CSS bindings were independently checked against actual file bytes and all matched. This reuses successful mechanical evidence; it does not convert the semantic findings below into a pass. Native records report 14 existing fixture observations per figure, including 297px labels at 16.70625px. Those are historical evidence observations, not new executions, and not headed-product acceptance.

## fig-347: REVISE

### Independently Checked Content

The original places A at the upper/front corner, B at the upper/back corner, C at the lower/back corner, and D at the lower/front corner. Its top winding arrow runs B toward A; its lower winding arrow runs D toward C. Its separate E/F commutator pieces and external leads correspond to left brush1 negative and right brush2 positive, with F at brush2. The original rotation arrow above B has its head at the left end of the curved span.

The selected modern corner anchors preserve that A/B/C/D order. The two winding-current arrow directions are retained. Tracing the selected wiring gives positive supply -> brush2/F -> D -> C -> B -> A-side return -> E/brush1 -> negative supply. The A-side return is the separate winding terminal immediately above D, not an electrical connection across the intentional terminal gap. Half-ring E and F remain separate, with contacts at their respective left/right extremes.

Both external supply leads, both signs, both brush numerals, both winding-end leads, and the mechanical shaft are present. There is no source battery, separate switch, quantitative field/force annotation, or additional source current arrow to restore in this crop.

### Actionable Findings

1. **[P1] Reverse the modern rotation indicator to match the original.** The original arrowhead is leftward along the upper curved span. The selected native output has a rightward/down-right arrowhead. `source-rotation-head` currently runs from `[402.8198952859183, 524.071653310765]` to `[434.5234085730457, 509.22248763046196]` in spec user coordinates; the SVG confirms the same rightward direction. This changes a source feature, not just its styling. Re-author the curve/head orientation together to preserve the original direction without adding a second arrowhead. Keeping both modern figures mutually consistent is insufficient if both contradict their originals.

2. **[P2] Restore unambiguous corner-label association.** A is displaced into the winding interior, C into the interior near the right side, and D down-left into the winding-lead area. The D corner is at source-screen `[218,338]`, but its rendered label ends at x178 with baseline y378; it is closer to the nearby lead elbow than to its intended corner. A starts at `[235,191]` rather than its corner `[195,151]`; C ends at `[374,243]` rather than its corner `[414,283]`. At 297px these are still legible letters but no longer clear point labels. Place all affected letters adjacent to their unchanged corners, or use unmistakable non-electrical leaders with adequate clearance. Do not move the actual corner anchors to cure layout.

3. **[P2] Make the winding-lead/shaft crossing visibly non-electrical.** `positive-coil-end-s1` crosses `lower-shaft` at approximately `[308,204.0097087378641]` in user coordinates. Both are continuous ink strokes and the native image gives no bridge, interruption, or other distinction at the crossing. This is a misleading visual topology risk, not a claim that the specification electrically connects the shaft. The shaft also occupies the split-ring gaps, leaving only about 0.627px stroke-edge clearance to each ring end at 297px. Distinguish the mechanical shaft from the insulated winding leads and ring gaps while retaining both ring-to-brush contacts and separate winding terminals.

## fig-348: REVISE

### Independently Checked Content

The original independently shows D at the upper/front corner, C at the upper/back corner, B at the lower/back corner, and A at the lower/front corner. The top current arrow runs C toward D and the lower one A toward B. F is the left/upper commutator piece and E the lower/right-contact piece. The fixed brushes remain left1 negative and right2 positive; E now contacts brush2. Its curved rotation arrow again has its head at the left end.

The selected modern corner anchors have the correct D/C/B/A order. This finding comes from the original pixels, not a guessed planar half-turn. A physical rotation about the shaft does not require central symmetry of the perspective projection. Both modern winding-current directions are retained: positive supply -> brush2/E -> A -> B -> C -> D-side return -> F/brush1 -> negative supply. Thus E and F retain their respective winding-terminal identities across the two states even though their brush contacts exchange.

Both supply leads, both signs, both brushes/numerals, both winding-end leads, and the mechanical shaft are present. The selected split-ring pieces remain geometrically separate; the contact swap itself is not the reason for REVISE.

### Actionable Findings

1. **[P1] Restore the original rotation-arrow direction.** The original above C is left-headed, but the native modern arrow is right-headed. The same `source-rotation-head` endpoints and rightward SVG head described for fig-347 are present here. Correct both figures to the originals' shared rotation sense; do not reverse either winding-current arrow to accommodate the mistaken rotation arrow.

2. **[P2] Restore corner-label association for D, B, and A.** D is shifted into the winding interior, B into the interior near the right side, and A down-left beside the lead elbow. Their rendered positions are the same screen positions as fig-347's A, C, and D respectively: D `[235,191]`, B ending at `[374,243]`, and A ending at `[178,378]`, versus intended corner anchors `[195,151]`, `[414,283]`, and `[218,338]`. Keep the independently verified D/C/B/A corner identities and resolve the label layout without a guessed 2D rotation.

3. **[P2] Clarify the same lead/shaft crossing and insulated mounting.** `positive-coil-end-s1` crosses the ink shaft at `[308,204.0097087378641]`; the ring-gap side clearance at 297px is again about 0.627px. Make that crossing explicitly non-junctional and the separated half-rings inspectable while preserving E-to-brush2 and F-to-brush1.

## Label Leaders and Other Topology Checks

The three added identifying leaders per selected figure are not themselves an additional electrical connection: `half-E-leader`/`half-F-leader` terminate beside letters, and `brush-1-label-leader` terminates beside numeral1. They use muted 1.5px strokes, distinct from the ink circuit/shaft strokes, and do not join the two half-rings, join opposing supplies, or meet a second apparatus part. At the supplied 640px and 297px views they read as identifying stubs, not a wire between two components. Retain this distinction when repairing the other labels.

The half-ring midpoint contact coordinates are `[265,152]` for brush1 and `[351,152]` for brush2. The selected winding leads and respective brushes meet the intended half-rings there. The separate half-rings are not two complete slip rings. No omitted current arrow was inferred from author claims or the number of renderer objects. The definite changed source feature is the rotation indicator; the corner-label and shaft-crossing findings concern misleading presentation of otherwise correctly named parts.

## Exact Hashes

All file paths below are relative to the explicit workspace above. Selected directory for figure N is `.tmp/ld-s10y-lesson/resume-180-4-n160/modern-figures/fig-N/brush-label-repair/`.

| File | fig-347 SHA-256 | fig-348 SHA-256 |
| --- | --- | --- |
| Original `.tmp/ld-s10y-lesson/resume-180-4-n160/artifacts/7p/figures/fig-N.png` | `bbd064aaf54474ce2811b3f2b16347353b00037651d2a326fb583c2dff3fc714` | `32bb495b2dcc4e9eeb75f27faa5545bbd3fcef84f7a0018ae17a8506af8db9f6` |
| Selected `spec.json` | `8fbca9a6d8ce237bda6d39e20a345075befd2836c3e9b976562c30315e017794` | `e55b5dce98a10a62e8088cd22919b74adc49fe4d0fe05f8474c194f5a4b583b3` |
| Selected `figure.svg` | `c43973445ec235b89a380fff66b2a6ca2f26c7813f08b66c438cb43e1674b6c2` | `d3db69c39d6f816a38fc07c1bcb60e6df97fdf4b6a372e34a6232d838a4cf08d` |
| Selected `render.json` | `0fd98b31b47705e35f4cb2ba47fbc880acb639d0e4f86b1f1192e36902b701d7` | `0b3c41f55748c92a5349283fb7e7b63edf1048dc89d0ed5c7b6beac8b29b4e32` |
| Selected `native.json` | `e4431ef8b7efd59eda1482788d2d7376c491f56e63cb02ff737fd851d3946be9` | `a66013b3db8fcf54fe9be2a3acd433b2abb7e2ea72fb89d9984e8ca6356599de` |
| Selected `native.png` | `2da93fc06af3e661c0eb6eda999f34a9c01cb899e451490f7be43a030e32f8e2` | `d70b73e4a2c001977e4dd551ca7dab641929cb99a9ca08145992e05f32170363` |
| Selected `native.html` | `edbf3f77fb0432e0499b4c2c222db9d6238da7a11c37b6d640a29baed2b2839c` | `07d2e05a8ee7c42a5e0203ec115fe107f9a0dc2f6ee75a1ad39fddf4cad15884` |

Additional bound inputs:

- `app/src/styles/app.css`: `9fdcb8b3060e0cd0a6b97bf8a32f18c924b60a18226fa8c0d1a485221277168f`.
- `.intentfold/tickets/STEMROBIN-180/modern-figure-author-n160-b91.md`: earlier observed hash `fefcc3209f1139331840b4f70814045f124e3dc84d4eea94f2ecaf1bb3bb3518`; final preservation readback observed `83c9ec140029a56bdc60613d9e40eb422b00f0759d89c97184d72b84eca4bbbd`. The author inventory was concurrently updated outside this review. It was not reverted or edited, and no session was inspected to attribute that change. The selected source/spec/render/SVG/native files and checked prior failure records still matched their recorded hashes. Independent pixel observations, not the changing author inventory, settle the verdicts.

## Failure History Is Not Reset

No prior candidate or failure file was edited or removed. No repair was performed during this review. This is not a clean FIRST result: selected descriptions expressly retain inventory/rotation-head/label repairs followed by another brush-label repair. Multiple affected label repairs are not recategorized as one clean first attempt.

The following existing failed renderer records were read without opening their images:

- fig-347 `render-repair/render.json`: `fail`, collisions for A/B/C/D/E/F/1. Actual report hash `73dc8a5e52ababd29c2ddb8766ed29858967c56d8fe2a0a9bd0d2fc74617298b`; bound earlier spec `b814053e84f72d33c1d8f7a5550742215289464c0b02c807330b1347dd0a6531`.
- fig-347 `label-repair/render.json`: `fail`, remaining numeral1 collision. Actual report hash `f73418d012119db756029811d0c21fef2892977fb4e828237ad97bec28cc38dc`; actual previous spec hash `7f019195f6f67f3819259ebb237f170e018ffc696678a406a552890ec8ca87a3`, matching the selected manifest entry.
- fig-348 `label-repair/render.json`: `fail`, remaining numeral1 collision. Actual report hash `d1d66ea0f8c90a1d58b12b660425bfe156848a62309d1f2bc0da162c157f89aa`; actual previous spec hash `d66e7c60ca75d18d95c86101d6116f96a1aa77c8c59eee912e056f53a944b3b3`, matching the selected manifest entry.

Other prior failures remain untouched. No historical execution total is guessed from filenames or report counts, and no old sessions/chats were inspected or contacted.

## Actual Review Counts and Write Scope

- Images loaded in this review's lifetime: **4** total, **2 per figure**. Original PNGs: 2; native PNGs: 2. Reopens: 0; crops: 0; candidate PNGs: 0. Authorized lifetime maximum: 8.
- New source/gate/renderer/native/full-display executions: **0 each**. Paid calls: **0**. Browser sessions: **0**. Backend/Git/DB/env/setup/freshness/Grill operations: **0**. Other-chat/agent/session operations: **0**.
- Local read-only shell executions, including hash/arithmetic inspection and report/preservation readbacks: **25**. One scope-only existence check returned exit1 because this report did not yet exist; the first exploratory full-spec outputs were truncated, followed by compact object reads. These are not new rendering failures. The first preservation readback found the concurrent author-inventory change described above; all 20 other checked files matched.
- Report writes: **2 `apply_patch` calls**, to this Markdown file only, including the concurrency/provenance correction. New evidence files: **0**; existing hash-bound evidence is sufficient. No author asset, official review metadata, promotion asset, or unrelated file was changed by this reviewer.

Required next disposition is an authorized author repair/review decision, not promotion. This limited reviewer has made no such repair or approval.
