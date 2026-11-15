# fig-76 Independent Review

Date: 2026-11-15. Ticket: STEMROBIN-180. Verdict: **PASS** for the final repaired hybrid candidate. No further repair requested or authorized. **Repair budget1/1 used,0 remaining; original first FAIL remains preserved.**

## Independent Source Inventory

Opened the actual complete `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-76.png`, including all four scenes and the far-right/bottom labels.

- Upper left: a crate rests on the ground; one person on its left pushes and one person on its right pulls a rope attached to the crate. Exactly two people, with full bodies, feet and connected rope.
- Lower left: one person to the right pulls a rope attached to a low curved-runner sled carrying a crate. This is a sled, not the right-hand two-roller apparatus.
- Upper right a: block directly supported on a horizontal board, spring connection to an unnumbered rectangular gauge, internal arrow pointing left, and far-right hook.
- Lower right b: corresponding block supported on two rollers above the board, shorter spring, rectangular unnumbered gauge, internal arrow pointing right, and far-right hook.
- a/b source labels identify the right apparatus comparison. No numerical force readings, scale multiplier, mass labels, given spring lengths, measured turn counts or friction ratio can be recovered.

All four scenes remain in the actual modern composition. Both left scenes map to `semantic-scene`, but their two-person/one-person counts and rope connections were checked from actual pixels, not inferred from one image-object count. The right apparatus maps to complete `a-source-apparatus`/`b-source-apparatus` groups and `prose-same-load-comparison`.

## Frozen Text and Semantic Relationships

Reopened complete current s25 lesson/exercises: all five p blocks and all three written tasks. Actual bytes and exact context-input copies match:

| Input | SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s25/lesson.template.json` | `61244052e85a407cb5d5e37c772a21d3da6690751ee8bb7542d0e0146656af05` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s25/exercises.template.json` | `70192a95fa0209778b99277a601d3c24d4fb3d58b00c38ff1454d2f8c14fbc06` |

The full8-unit `source.authoritativeText` equals the actual frozen p/exercise text. Parsing the complete JSON text appended to the actual generation prompt gives the same8 entries exactly. No answer source was consulted.

Inspected all49 spec objects and34 assertions:

- The two right blocks have the same134x88 drawing dimensions and equal-width/equal-height assertions. Equal load is supplied by lesson prose; equal drawing dimensions alone are not a measurement of mass.
- Both springs connect horizontally from the block's right-side attachment through a10-unit link to the coil/gauge. Actual svgPath starts/ends agree with the declared spring endpoints, with screen y=256/456 corresponding to user y=384/184.
- a's32-unit coil is longer than b's22-unit coil, retaining the source qualitative difference. Both now have three schematic turns with2.2 px canvas strokes. Turns/lengths are readability regularization, not calibrated readings or a force ratio.
- The upper internal arrow points left, lower internal arrow points right, exactly as the source. `connects` assertions bind both actual arrows to their endpoint points. These are **internal source gauge indicators**, not newly claimed external-force or motion arrows. The block's horizontal spring pull in the frozen prose is rightward in both trials.
- a's lower edge and board are collinear. In b, exactly two actual circle objects have declared centers(360,125) and(435,125), radius15, tops at y140 on the block base and bottoms at y110 on the board. `pointOnCircle`, collinearity and vertical-diameter assertions cover both actual upper/lower contacts. No unsupported third roller, floating block or wheel/runner substitution was observed.

Latin a/b and modern English `Sliding`/`Rolling` identify the right apparatus modes already described by the lesson. They do not mean the left lower sled itself is rolling: it remains a runner-on-ground scene without wheels. The source qualitative comparison is retained, but no added numerical reading, fixed scale, force ratio, solution inequality or completed experimental data is provided. This illustration cannot substitute for actual constant-speed measurement or controlled equal-load experiments.

## Actual Visual Review

Read complete spec, actual SVG/XML, render, generation metadata, author report and handoff. Actually viewed:

- The full original PNG.
- Raw `artwork.png` and separate final `fig-76.artwork.png`.
- The separate `preview-overlay-640.png`.
- All six current `preview-{neutral,accent,print}-{306,640}.png` at native dimensions in `independent-preview-sheet.png`.

Sheet SHA-256: `e7d84347c2189ecce3747f4e805ff6fe00d54df0ac5463c1e9647cdf65e3cacd`. It contains existing screenshot bitmaps only, not a new figure render.

**Visual PASS evidence:** both practical scenes retain complete people, feet, hand actions, connected ropes, crates and the curved sled runner. The two right blocks, both coils, both rectangular gauges, opposite internal arrowheads, both hooks, both rollers and both board ends are present. The repaired b spring is visibly a short three-turn spring rather than the first rejected black stub, at both306 and640; the distinction survives neutral/accent/print. The a spring remains visibly longer. No bottom runner/feet, bottom roller, right hook or board endpoint is clipped.

Actual screenshots are306x306 and640x640. All four English/Latin labels remain separate and readable. Existing bound isolated-headless DOM records measure17.2125 px minimum at306 and36 px at640, all label bounds inside, loaded artwork, no overflow and zero nonwhite edge pixels, consistent with the viewed complete images. Inline media fits; there is no horizontal scroll end to test.

Raw artwork is1024x1536; centered-contain into300x450 preserves its aspect ratio. Final artwork and overlay share640x640 alignment; actual SVG is transparent and embeds no image. Separate PNG transparent margins are not black failure, as confirmed by the actual white-background composite previews. No typography, scale, apparatus or arrow is hidden in the generated natural layer. No Cyrillic/Chinese, Soviet symbol, uniform, flag, watermark or unintended culture cue appears.

## First Failure Preserved

The author first visual FAIL is not replaced by this final independent PASS:

- `failure-01-spring-legibility/author-first-visual-failure.md` describes b's original seven turns over12 drawing units merging at306/640.
- `failure-01-spring-legibility/snapshot.json`, hash `2a8c9005a633fca68e2e29c05c85533cc9e573c79b8103c46bf3379f7825f7ce`, binds20 original files.
- Read-only hash checks confirmed all20 saved files still match their original snapshot hashes. The failure report hash is `36ef2b3304cb2d0b60ad47819f9863508b0cd66cc821dabb65a36e090176aa3c`.
- Current raw artwork, generation metadata and fitted artwork are byte-identical to their rejected-snapshot versions. The final coil correction did not trigger a new image call.

No original failure evidence was overwritten, no additional repair was made, and no future repair capacity is implied. If this bound candidate changes or a further essential defect is established, it cannot receive a second repair under this mandate.

## Bound Final Candidate

All current byte hashes match final handoff/render/preview records:

| Record | SHA-256 |
| --- | --- |
| Source PNG | `5e32a223d64c7188b6e8284c84352918711344a2cddef64f24b9e491ae48b059` |
| `spec.json` | `a01ea3e194f8ab217835b45992b39479ce3c95ae63c85dfb9e2d85af0cb1b882` |
| `fig-76.render.json` | `6fda27e2711afeb72fb67144dc78424748a79b1da79e637532333db202271009` |
| `fig-76.svg` | `14000467eefeec90a4341bee4d5795ea7296441fbae9a599728edcd1c37cb7a0` |
| `fig-76.artwork.png` | `e1aca1c1175c6f0649fa669c86b3c5d7dccbc8ad84e4582af650b9256540aa4a` |
| Raw `artwork.png` | `a681d8ea3d35b358688cb3dda41fac0f337359131b9ed89b4ef095a52d71f526` |
| `artwork.png.json` | `5596d707873a7a17b7b487d5e0043efc92c7bca8b44b11c9eb311457ff1b8f39` |
| `author-preview.json` | `031f0947e8ebff34808ed7a492d5eb816b450ce5f45fba4d393e831ebcc9dca9` |

## Closure and Boundary

`review.json` is recorded with `record_review.py --spec spec.json --render fig-76.render.json --status pass`, binding actual source/spec/render and both final separate outputs and referring to this report. This is approval of the observed final candidate, not erasure of the initial failure or approval based on author PASS alone.

No author assets/spec/SVG/text/preview, first-failure bytes, keys or choices were modified. No answers were read. No author render or standalone mechanical validation was rerun; only the required record command performs its internal current-contract/hash check. No new browser, user window/tab/input/profile/CDP, app, DB, Git, dependency, Azure/model/service or promotion action was performed. Existing isolated-headless preview evidence was reused; no untested headed/product behavior is claimed.
