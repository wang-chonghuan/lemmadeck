# B89 n150 FIRST Independent FIG Review

Verdict: **REVISE**. This is the first independent review of the whole current
repaired fig-309, not a replay or adoption of the author's affected-repair PASS.
Independent review attempts: 1; blocking findings: 1; reviewer repairs: 0.

Ticket `STEMROBIN-180`; SAME cap3 invocation `180-3`; batch B89.
Every shell command ran in `/Users/yong/.codex/worktrees/0f12/lemmadeck` (W).
Only the owned review directory and this report were written.

## Finding

### F1: Battery Return Conductor Merges With The Casing

The previous front-face traversal has been removed, and the lead does not
cross the other battery lead. However, its replacement includes
`battery-switch-return-casing-1`, from `[185,685]` to `[90,720]`,
exactly on the shared border of `battery-front` and `battery-top`.
This is an exact coincidence, not a near miss or a text collision.

The current SVG gives that conductor screen endpoints `[185,455]` and
`[90,420]`; the battery polygons have the same border endpoints. At 640 px
the return terminal appears to connect into the corner of the box, after
which only the ordinary casing outline leads toward the external left wire.
The same merger is visible at 308 px in both the neutral and accent previews.
There is no independently distinguishable wire along this part of the route.

The source's battery return emerges into a separate external lead down the
left of the battery. Its terminal region is rough, but it does not establish
that the battery casing itself supplies a return conductor. The modern
terminal placement and routing may be regularized; they must still let a
learner trace a separate circuit lead without treating the casing outline
as a meaningful electrical edge. The literal `connects` ledger proves the
intended coordinate chain, not that this chain remains visually distinct.

Affected objects: `battery-switch-return-1`,
`battery-switch-return-casing-1`, `battery-switch-return-casing-2`,
`battery-switch-return-casing-3`; containing context: `battery-front`,
`battery-top`, `battery-return-terminal`, and inventory group
`source-return-leads`. Affected assertions are the four matching
`*-connects` declarations. No unrelated needle, conductor, rheostat, switch,
label or text repair is requested by this finding.

Required outcome: a distinguishable return lead from the retained terminal
to the existing left exterior route, with visible clearance from casing
edges and no new junction with the overhead lead. Do not hand-edit the SVG.
No repair or further rendering was performed by this reviewer.

## Exact Current Bindings

Candidate root:
`W/.tmp/ld-s10y-lesson/b89-fig309-author/repair-wire1/`.
All four requested candidate files were observed sealed mode `0444`.
The observed bytes match every supplied current-candidate hash.

| Binding | Path relative to W | SHA-256 |
|---|---|---|
| Original source | `ssot-resources/soviet10year-textbooks/artifacts/7p/figures/fig-309.png` | `3ee1c7b1d979b950d459f237d26b1691794da9783e71e9f2f101e3d6662ada29` |
| Current spec | `.tmp/ld-s10y-lesson/b89-fig309-author/repair-wire1/fig-309.spec.json` | `8be55856f89d9a6d2d4a410b79b54fd317950b2a2ac9dc138f75169c46693db0` |
| Current SVG | `.tmp/ld-s10y-lesson/b89-fig309-author/repair-wire1/fig-309.svg` | `ec4bb0d78f9f5853421a00536d58d0dac9ad4d30dce5c9337e262531835c8380` |
| Current render report | `.tmp/ld-s10y-lesson/b89-fig309-author/repair-wire1/fig-309.render.json` | `ffc614fd510aa5c9aefe44e745819a9814878687afa5ef1be829ef8850c2f2fc` |
| Current native report | `.tmp/ld-s10y-lesson/b89-fig309-author/repair-wire1/native-preview.FIRST.json` | `ca8f6fbcde4df597d117cf9903e41176c60ba417dbec91a87cab13ff2e11f771` |
| Approved lesson authority | `.tmp/ld-s10y-lesson/b89-recovery/n150/lesson.template.json` | `1449635e494dd954eec84243423f80cbc4851df613651aae3f8b16e679122957` |
| Approved exercise authority | `.tmp/ld-s10y-lesson/b89-recovery/n150/exercises.template.json` | `ac3602f1dd315dc646f986e8d41759dc3088d96b068f19662d256a1ab1785c6f` |
| Reused TEXT PASS | `.intentfold/tickets/STEMROBIN-180/modern-text-review-n150-b55.md` | `c00019bcfbaeefb54ab7642f500db0b443b09fc6eb585013405f6780acbccf34` |

The actual TEXT report hash is the user's corrected transcription above.
Its verdict is `PASS_TEXT_ONLY`, explicitly excluding fig-309. It is reused,
not rerun or expanded into independent SOURCE/task-solution approval.
All 16 nonempty authoritative-text items in the current spec equal the
approved lesson blocks and four exercises in order. The empty figure-reference
block remains in the lesson; it is appropriately absent from the spec's
nonempty-text envelope.

## Independent Source Comparison

Loaded the image skill and `quality-gate`, `figure-spec`, `routing` and
`production-resume` references. Opened `source.image` once, recorded
[source-inventory.md](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b89-n150-FIG/source-inventory.md)
before reading the candidate inventory/objects/assertions or modern previews.
Inventory SHA-256:
`35dc7057f35d1a98dd871c40cc00dd7769a7953dd7f6d6c95c3a9c0a9e7211a2`.
The source was not reopened, cropped, re-extracted or replaced with an
author-generated reference.

| Independent source requirement | Current realization and review |
|---|---|
| S1: One apparatus scene; needle above, battery left, resistance apparatus right/lower, switch at bottom | Preserved as one scene. No on/off panels, duplicated apparatus or enclosing panel objects are present. |
| S2: Pivoted needle, solid changed orientation, broken original orientation, support block/foot/stem | Both needle halves and common center, `needle-rest-axis`, support stem/foot and two support faces are present. Broken line remains broken at both inspected widths. No N/S or numerical angle added. |
| S3: Circuit conductor above the needle, independent of needle/support | Five battery lead spans, `overhead-test-wire`, nine rheostat lead spans. The overhead segment is above the needle and is not electrically joined to its pivot or support. |
| S4: Battery casing, two top terminal regions, source plus mark | Three faces, two terminals and one plus preserved. No minus, voltage, chemistry or inferred terminal-to-pole assignment. Exterior return readability fails F1. |
| S5: Elongated resistance apparatus, upper control and two circuit joins | Base/end supports, resistance body, upper rail, slider/control, rail terminal and lower return terminal preserved. Twelve winding marks are explicitly modern uncalibrated styling, not a source count. |
| S6: Open knife switch at bottom, two separated contacts and raised handle | Base, separated contacts, pivot, raised blade/handle and knob present. Open gap is visible; return wires reach different contacts. |
| S7: Single intended switched series circuit, no wire through the needle or extra branch | Coordinate topology is retained. No extra lamp/meter/battery, needle junction or bypass is declared. F1 prevents accepting the casing-overlapped span as clear visual topology. |

The same original image contains the thick upper-right, upper-left-directed
arrow. The initial independent inventory recorded the overhead route but
did not separately itemize this arrow; this explicit supplemental mapping
is not a source reopen or an edit to that pre-spec inventory.
`source-current-arrow` preserves exactly one such arrow on the upper-right
lead, rather than adding a field vector or labeling a new current magnitude.
The current spec has separate direct `overhead-test-wire-connects` coverage;
the arrow's own assertion is not substituted for conductor coverage.

The source scene combines an apparatus view, a needle's two orientations,
a directional convention and a raised switch. The current spec explicitly
declares the same apparatus/orientation purpose, not a simultaneous
energized-state result. `Open switch` truthfully identifies the raised
switch; it does not license claiming current flows through that open gap.
This review does not approve a quantitative angle/polarity interpretation.

Modern wrappers/additions were checked separately: English apparatus labels,
deterministic simplified outlines, enlarged canvas, regularized lead bends,
shared needle center, symbolic winding marks and display sizing. They are
not source measurements. The actual labels are only `+`, `Needle`,
`Battery`, `Rheostat`, and `Open switch`. No source cultural writing,
Soviet markers, new historical identity, new numerical given, field-strength
claim or worked answer appears. The diagram remains an instructional figure.

## Relationship And Endpoint Review

The complete current object/assertion lists were read: 81 objects, 67
assertions, nine inventory groups. A read-only JSON/XML observation found
no missing inventory object/assertion references and no literal `connects`
endpoint mismatches. This was not an invocation of an official validator.

All 52 ordinary segment/line SVG endpoints equal their current spec coordinates
after the canvas y-transform. The one arrow shaft is shortened for its
materialized arrowhead; this is not a missing conductor endpoint.
The materialized triangle points upper-left at approximately
`[442.1273,62.1273]` screen pixels, consistent with the intended
`[442,62]` tip within the normal marker-reference offset. The direct
overhead segment is exactly `[190,50] -> [430,50]` in the SVG.

Complete intended wire polylines in spec coordinates:

- Battery to overhead:
  `[150,730] -> [100,820] -> [70,940] -> [78,1025] ->
  [125,1080] -> [190,1090]`.
- Overhead test wire:
  `[190,1090] -> [430,1090]`.
- Overhead to rheostat rail terminal:
  `[430,1090] -> [480,1040] -> [525,970] -> [540,850] ->
  [555,690] -> [555,565] -> [520,505] -> [430,465] ->
  [300,445] -> [205,430]`.
- Battery return to switch pivot/contact:
  `[215,715] -> [185,685] -> [90,720] -> [65,715] ->
  [55,585] -> [42,420] -> [50,260] -> [115,170] -> [250,120]`.
- Rheostat lower terminal to other switch contact:
  `[195,330] -> [155,265] -> [180,230] -> [230,225] ->
  [350,265] -> [470,230] -> [530,175] -> [530,110] ->
  [495,85] -> [430,120]`.

Reviewed the remaining declarations as relationships, not only as counts:
solid needle horizontal; original axis diagonal and through the needle center;
overhead conductor above the needle; its regularized horizontal frame;
arrow start/end on the upper bend and upper-left orientation;
slider on the rail and contact reaching the resistance body;
switch contact separation, raised blade and nonzero open gap; source plus
inside the front face. No exact angle, circuit value, field magnitude,
pole direction or source winding count is inferred from these layout values.
No instructional grid, shared coordinate grid, table, set-membership panel
or symmetry assertion applies to this apparatus scene.

## Existing Mechanical Evidence

Read saved draft receipts/results, current render receipt/results, current
native receipt/results, repair guard and edge coverage. None was rerun.

- Existing B89 draft FIRST failed only because an empty figure-reference
  item entered `authoritativeText`. The saved envelope correction passed at
  `2026-11-19T04:04:32.890Z -> 04:04:32.929Z`, exit 0.
  This earlier standalone result is not mislabeled as a final repaired-spec
  draft invocation. The current render performed its mandatory internal
  draft validation on the bound current spec.
- Current repair render FIRST:
  `2026-11-19T04:20:17.182Z -> 04:20:18.422Z`, exit 0,
  `status: pass`, 81 objects, five labels, collisions 0.
- Current native FIRST:
  `2026-11-19T04:20:22.605Z -> 04:20:25.052Z`, exit 0,
  `status: pass`, 12/12 samples, errors 0. This is the existing offline
  native media evidence, not a headed app, whole-lesson or A4 acceptance run.
- Current derived edge coverage: 53/53, missing `connects` 0,
  uncovered inventory edges 0, conductor covered independently of the arrow.
  These are mechanical facts, not independent source or FIG approval.

| Declared and measured media width | Actual minimum text size |
|---|---|
| 308 px | 17.325 px |
| 331 px | 18.61875 px |
| 358 px | 20.1375 px |
| 640 px | 36 px |

`display.purpose=instructional`, `layout=inline`, `maxWidthPx=640`,
`minTextPx=16`. Each declared width is measured as that actual SVG media width
in all three saved themes. Existing screen transforms, not source-canvas
font size alone, support these minima. Text is legible and not clipped in
the inspected previews. No new app-width measurement is claimed.
Semantic CSS roles are retained. Neutral and accent previews were visually
inspected; print was read from existing native results only.

Additional existing evidence hashes:

- `edge-coverage.final.json`:
  `88d6fb6386deadde4be5864ef955dbe0f694ecfbdb7caf4d3ce241afc78d6625`.
- `repair-guard.FIRST.json`:
  `c51c48875d1f70fbb4ba81218a790594669d8768816100234a7576a963cce355`.
- `author-handoff.json`:
  `2b620aa84785af9f745c8f4d5853ea24c5bf24a45133ac392b73e299345775c9`.
- Current render `commands/render-FIRST/call.json`:
  `d67af3d7a68be87791bf677a3f7231817edd1461be4233b9dede9c6448393737`.
- Current native `commands/native-FIRST/call.json`:
  `df3e14101e9b22f9adc7f68077ee8cfdd540ff3e7623a9c1e2bbaeb98dba1f51`.

## Images, Usage And Freeze

Images opened in this fresh context: **4/8**.
Source opens 1; source reopens 0; native opens 3; preview reopens 0;
crops 0; additional screenshots/renders generated 0.

| Inspected existing image | SHA-256 |
|---|---|
| `native-308-neutral.FIRST.png` | `5a4a2252ac3b7055aadd87a99c1059f37d773b1a01804f47541e2e70fcd9e18a` |
| `native-640-neutral.FIRST.png` | `fe5dbb4fffd9d6c001458ceae25230fdc9b8f5d6bdc2d0545a38db45e13d2233` |
| `native-308-accent.FIRST.png` | `912bc921c9a9e9c48735ec8f737b199079d224e16a20bb59f9824d80b3fb4510` |

New reviewer render calls 0; native calls 0; standalone draft calls 0;
official `record_review` calls 0; TEXT/SOURCE review replays 0;
paid calls 0; paid cost 0; reviewer content revisions 0.
The read-only endpoint/binding observation is not a render/native replay.

Historical author usage is not reset: current repair ordinal 3, actual author
content revisions 2. The author's original FIRST HOLD for the front traversal
and its later affected-repair PASS remain historical author evidence.
The present REVISE concerns a residual casing/lead ambiguity in the current
whole figure; author PASS is not independent approval.
Historical B55 old specs/SVG/native bindings remain UNKNOWN where already
unknown, and its historical semantic FAIL is not retroapproved.

Freeze:
`W/.intentfold/tickets/STEMROBIN-180/tmp/b89-n150-FIG/review-freeze.json`
binds this report, original-first inventory, current inputs and image counts.
No whole evidence package was copied.

Stopped at the review verdict. No freshness/setup, source re-extraction,
full TEXT/SOURCE solution, paid generation, app/dependency work, DB/backend,
Git, publication, promotion, official recorder or other-chat action occurred.
All candidate, source and other-agent work was preserved.
