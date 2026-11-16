# 10c Figure 04 Deterministic Author Handoff

Date: 2026-11-16. Ticket: STEMROBIN-184. Lesson: `ana10-c6-s1-n78`.

Role: sole deterministic figure author under the existing parent delegation. All work is scratch. This report is not an independent figure review or promotion approval.

Package root: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/10c-fig04`.

## Source And Context

The complete original `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-04.png` was actually opened once at native 450 x 492, before spec creation. Separate `source-inventory.md` was written and frozen before drawing. The source was not reopened afterward.

Source PNG SHA-256: `4bd4798c87397d795ad030e69c3f59dd13c3ef079a7ce5ea92b9af822d13cd71`.

Official context SHA-256: `defa2199b66611c4b1463ecbb60935a42a262ccdd776f701ac70f8313724ad58`.

`source.authoritativeText` contains all six official nearby-text entries, in the official context's exact order and text: theorem 2, example 3, complete approved angle-function note, figure caption, complete chord/arc proof and final derivative paragraph. The capture script actually checks exact JSON equality against the official context. No modern text was re-authored; the approved five `\text{ang}` occurrences and Chinese unit explanation remain unchanged. Context includes the existing worked prose but no answer or choice artifact was read.

Routing: deterministic instructional figure, using the existing JSXGraph renderer and schema only. No artwork, Azure, new geometry engine, library, network API or code/helper change.

## Source Mapping

O remains at left; B is upper right; A is lower right. Three point objects hide only their markers and retain renderer-owned labels. No extra dot or named construction point is introduced.

| Original role | Current object IDs | Current executable evidence |
| --- | --- | --- |
| O/A/B labels, without dots | `center-O`, `endpoint-A`, `endpoint-B` | `radii-equal`, `radius-A-circle`, `radius-B-circle`, two radius `connects`, `chord-AB-connects`; all three source points covered within the same `pointRelationships` inventory group |
| Two solid equal radii | `radius-OA`, `radius-OB` | Equal-distance, endpoint-circle and `connects` assertions; both styles `dash: 0` |
| Solid chord joining A/B | `chord-AB` | `chord-AB-connects`, exact A/B endpoints, `dash: 0` |
| Distinct circular arc A to B, bowing right | `outer-arc-AB` | Same O center and A/B endpoints as the equal radii; endpoint-circle assertions; counterclockwise A-to-B JSXGraph arc, `dash: 0` |
| Dashed O-to-arc bisector | `bisector` | `bisector-connects`, chord-crossing/on-chord, arc-end, equal half-chord and perpendicular assertions; final `dash: 3` |
| Small continuous angle marker crossing bisector | `half-angle-lower`, `half-angle-upper` | Adjoining circular arcs share a coordinate endpoint on the bisector; upper/lower on-radius and equal small-radius assertions |
| Both upper/lower x-over-2 values | `half-angle-upper-label`, `half-angle-lower-label` | Two text objects, exact `x/2` strings, fixed upper/lower placements; `half-angle-label-count` |

There are 12 spec objects: three labelled marker-hidden points, four segments, three arcs and two text objects. `objectCount` assertions check these aggregate type totals; they do not replace the above executable point relationships. The separate inventory's pre-spec proposed count IDs were refined to actual aggregate IDs `source-named-point-count`, `source-segment-count`, `source-arc-count` and `half-angle-label-count`; the original pixel inventory itself remains unchanged.

Modern regularization is explicit, not claimed source numerical data: a square isotropic canvas, exact equal radii and circular arcs, horizontal bisector, vertical chord and roomy labels. Native coordinates use O=(88,320), A=(508,96), B=(508,544), radius 476, unnamed chord crossing (508,320) and unnamed arc endpoint (564,320). These are design coordinates, not source-measured radius/angle/unit values.

No coordinate labels, radius units, midpoint name, total-angle label, dot, arrowhead, 90-degree marker, r/l/xr length annotation or new solved annotation is drawn. The perpendicular assertion is invisible mathematical evidence, not a rendered right-angle symbol. The source's stacked fractions are typographically modernized to two `x/2` labels, preserving values and upper/lower roles.

## Display And Actual Preview Observations

Intended inline display: maximum 346 CSS px, declared widths `[240,346]`, minimum text 16 px. All labels use native 46 px. A 640 px neutral view is native author inspection, not an asserted headed-product measurement or an additional intended inline width.

The three complete initial previews and the three complete repaired previews were each actually opened separately at their native dimensions. The renderer PNG is byte-identical to the separately captured 640-neutral PNG in each candidate; it was not redundantly reopened.

Final author observations: both oblique radii meet O and their distinct A/B endpoints; the solid vertical chord and rightward circular arc remain visibly separate. The guide passes the chord midpoint and reaches the arc as a visibly dashed line. The adjoining small arcs form the original continuous angle marker across the guide. Both `x/2` labels occupy their proper half angles without touching the radii or bisector. O/A/B are readable and there are no visible point dots, extra names or cropped geometry. These are author observations for the parent's review, not a self-review PASS.

| Actual snapshot | Complete PNG dimensions | Measured minimum label size | Visible point markers | Label/media failures |
| --- | --- | --- | --- | --- |
| 640 neutral | 640 x 640 | 46 px | 0 | 0 |
| 240 neutral | 240 x 240 | 17.25 px | 0 | 0 |
| 346 print | 346 x 346 | 24.86875 px | 0 | 0 |

Preview browser contexts were isolated, headless and offline with requests aborted, no persistent profile/CDP/OS input, `PWDEBUG` unset and no auto-opened report. Browser and contexts closed after each capture sequence. The official renderer also used its existing fresh headless launch, not a user browser session.

## Initial Limitation And One Repair

Actual execution count: first renderer once, then one authorized targeted repair renderer once. Two static capture sequences, each snapshotting the corresponding SVG without reconstructing geometry. No third render or repair.

The standalone draft validator passed before the first render. Both renderer invocations performed their existing draft validation and reported mechanical `pass`, 12 objects, 5 labels, zero collisions, and passing width checks.

Nevertheless, complete initial native/compact previews exposed a genuine line-convention concern: initial `dash: 2` looked close to dotted rather than the elongated source dashed bisector. The entire first context, inventory, spec, script, SVG, render report, renderer PNG, three static PNGs and display evidence were copied byte-identically into `initial/` before any change. `initial/author-observations.md` records the concern; initial reports retain their truthful mechanical pass and original creation paths/hashes.

The only repaired spec field was `objects[id=bisector].dash: 2 -> 3`. A structured exact comparison confirms that substituting this field makes initial/current specs equal; no other field changed. The second renderer and snapshots pass mechanical checks, and the actual final previews show a clearly dashed guide. The one-repair allowance is exhausted; any independent finding must be reported to the parent, not repaired again.

## Current Original-Byte Hashes

All paths in the following tables are relative to this package root unless stated otherwise.

| Current file | SHA-256 |
| --- | --- |
| `source-inventory.md` | `b7de3d110adcfe43c2719d3733ca586f76d43dfd3a01b29e2b0647359707f149` |
| `context.json` | `defa2199b66611c4b1463ecbb60935a42a262ccdd776f701ac70f8313724ad58` |
| `spec.json` | `1c22993466c38d7b5f8a80355dd17396a69063f42d95585a457da05182c130b3` |
| `fig-04.svg` | `bc0d73a13ffbd623cb455c3505776782e2bccefee811b30b19745b6d8e66f3df` |
| `fig-04.render.json` | `c92b35ebf98b585db643965957ace3a5d629bd4c7117c127df79eea56d1dc613` |
| `fig-04.preview.png` | `2feaeea3c258ee0615792a7aaaf8a6db6c860c0c01b49c182a40e1d6b67e89ca` |
| `fig-04.neutral-640.preview.png` | `2feaeea3c258ee0615792a7aaaf8a6db6c860c0c01b49c182a40e1d6b67e89ca` |
| `fig-04.neutral-240.preview.png` | `e438e8ed40fd0f49ea23dc96b1386a3da786a8926b1ba1e0a3a9052d923358ef` |
| `fig-04.print-346.preview.png` | `b1aff4e98e0969de0f7ebf8bd77930b7c64c5d2467f38c2ba52877b8e92e62a2` |
| `fig-04.author-display-evidence.json` | `68ca25b65b8067a156ee4540d1ed81bf4cf1f6684d5602bbae331f01226791fc` |
| `capture-previews.mjs` | `e48491ae8660b7ae5c1797ba0a63a2032b866deebaa8df646b89c94cc21d8f8a` |

| Preserved initial file | SHA-256 |
| --- | --- |
| `initial/spec.json` | `98e9d61795c7b94b81c828edb70654cda843730145bd29c16f810253cbd3110d` |
| `initial/fig-04.svg` | `25c893558d4c443cb2a7223e03dedc861f906b78cff2869e14c18bc7f197d13c` |
| `initial/fig-04.render.json` | `314ac55fdfe16b419f7b29419de27e23e637306932c4f1da191f0db322a79055` |
| `initial/fig-04.preview.png` | `282e270f16647d4b2bd342bd602ec9847698118d4baeb7d7184659bce4ae3c04` |
| `initial/fig-04.neutral-640.preview.png` | `282e270f16647d4b2bd342bd602ec9847698118d4baeb7d7184659bce4ae3c04` |
| `initial/fig-04.neutral-240.preview.png` | `312bb576ed8dc6f9d748b00abeb8cde725173686d9d3953e6242837ab63046a8` |
| `initial/fig-04.print-346.preview.png` | `e15aa89db781f489f86eef92d6c7038aea9564a6cffddad5de62b5f4058caa85` |
| `initial/fig-04.author-display-evidence.json` | `bb4aded2451a5276c11165ee790eb94f5c58e801bbb6276c517d05600a412051` |
| `initial/author-observations.md` | `a7ba6bab7cb6755c7986504ce03344e1d2bedc5eb574db0385e53bba260fed28` |

Initial `context.json`, `source-inventory.md` and `capture-previews.mjs` copies are byte-identical to the current same-named files, with the respective current hashes above. No initial evidence was relabelled as the repaired candidate.

## Stop And Independent Gate

Current candidate has mechanical renderer/display pass only. The parent is the unique independent spec, semantic, native/neutral/print reviewer. No `record_review`, review file, promotion, durable manifest or final edition validation was produced.

No approved text, original source, tools, dependencies, durable files, indices, DB, answer/choice artifact, Git or other chat was changed or used. Only this scratch package was written. Stop here for independent review; no further rendering, repair or new scope.
