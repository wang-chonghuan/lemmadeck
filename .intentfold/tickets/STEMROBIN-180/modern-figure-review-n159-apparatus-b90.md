# B90 n159 Apparatus: First Independent FIG Review

**fig-342: REVISE. fig-344: PASS.**

STEMROBIN-180, same cap3 invocation180-3. W is `/Users/yong/.codex/worktrees/0f12/lemmadeck`. This is an independent review of the current candidates, not official `record_review`, promotion, or approval of a new repair. Figure 343 belongs to the separate reviewer.

## Independent Source Basis

Both original PNGs were inspected before either candidate was inspected. The full approved modern lesson prose and all four exercises were read, then `tmp/b90-n159-apparatus-review/source-inventory.json` was written before reading any candidate spec or author evidence. Apparatus identity comes from the authoritative TEXT, not the speculative initial conversational shape identification, which was explicitly corrected in that inventory. The author report was hash-bound only; its verdict was not used.

342 has a tall front diaphragm, flared hatched shell and two end fittings, a recessed carbon shoe with granular regions above and below the rear horizontal electrode, rear insulating interfaces, and six numbered leaders. TEXT resolves 1 shell, 2 carbon shoe, 3 fixed insulated electrode, 4 shoe-to-shell insulating gasket, 5 carbon powder, 6 diaphragm. The contact-bearing granular arrangement and insulation are instructional: exercise 2 asks its structure and operation.

344 has a hatched lower housing and upper cover with central opening, a shallow sagging thin membrane clamped at both rims, two wound pole shoes of one permanent magnet, an intercoil connection and two exiting wires, two nonzero membrane-to-pole gaps, and five numbered leaders. TEXT resolves 1 steel diaphragm, 2 housing, 3 permanent magnet, 4 coils, 5 cover. These relationships support exercise 3. Neither source specifies current arrows, pole polarity, dimensions, turn counts, or vibration amplitude.

## fig-342: REVISE

**R342-1: Make the fixed electrode's insulation a visible material relationship, not a nominal auxiliary-point gap.** The current rear shell is a continuous hatched sectional polygon through the electrode band. Independently checking actual polygons finds section coordinate `(174,230)` inside both the electrode stem and shell material, but outside the shoe-shell gasket, whose right edge is `x=173`. The current render and native desktop/mobile image show crossing shell hatch and boundary strokes in this passage. The shaft therefore appears to traverse continuous shell material without a recognizable insulating opening/sleeve. That defeats the TEXT's explicit statement that electrode 3 is insulated from the shell.

The declared upper and lower insulation assertions each measure only one model unit between helper points. With the candidate's actual scale and opposing 3px strokes, the apparent clear-paper gap is negative at every required width: approximately -0.35px at 297, -0.36px at 308, -0.40px at 343, and -0.75px at 640. Passing these displacement assertions does not establish rendered insulation.

Targeted source-bound repair: interrupt shell section/hatching at the electrode passage and render an identifiable insulating sleeve/boundary around the shaft, keeping the separate shoe-to-shell gasket recognizable. Preserve the source's granular contact region, electrode penetration, six part numbers, and overall sectional apparatus. Check the actual painted polygons and stroke-expanded clearance at 297/308/343/640 rather than only helper-point displacement. Do not hand-edit SVG, introduce current/polarity annotations, or change approved TEXT. The affected revised candidate requires a fresh affected-only review; this report grants no repair or promotion authorization.

The front plate, flared shell, carbon recess, two granular regions, fixed contact and all six numbers otherwise remain recognizable. The 5 leader's near-front endpoint was examined; its endpoint lies in the powder pocket, so it is not a separate blocking finding. Regularized granule spacing is a disclosed schematic material indication, not invented measured particle data. No answer-bearing explanation or operating arrows were added.

## fig-344: PASS

The current candidate preserves the source's lower sectional housing, upper cover/opening, rim-clamped thin sagging membrane, two distinct winding bodies, their connection and exits, and the connected lower permanent-magnet assembly. The added current lower stems visibly join the pole bodies to that assembly. Both pole tips remain below the membrane: independently recomputed vectors are `(0,-11)` at `(205,201)->(205,190)` and `(331,201)->(331,190)`. The gaps remain visible at the existing actual mobile width, and the five leaders identify the proper parts. No N/S, current direction, field arrows, forced energized state, answer, or cultural marking was introduced.

The deterministic route genuinely retains instructional receiver construction, not just a receiver silhouette. Section/winding spacing is schematic, not an asserted original turn count. Current spec equals `spec-repair1.json`; immutable FIRST spec/SVG/render/PNG are separately hash-bound and untouched. FIRST render status remains `fail`, current render status is `pass`; the failing FIRST image was neither opened nor judged as the current candidate.

## Existing Native And Structured Evidence

Both current render reports pass and bind their actual spec/SVG bytes. The own structured check resolves all inventory object/assertion references and independently recomputes 128 relationships for 342 and 36 for 344. Its center-containment check is explicitly limited and does not replace pixel/painted-footprint inspection; object counts do not supply source fidelity. Both specs contain the complete approved nonfigure prose/captions and all four questions exactly.

Existing native evidence contains 24 measured cases per figure: prose/exercise, neutral/accent/print, and widths 297/308/343/640. All labels are inside, with zero recorded overflow, collision or missing/outside visible objects. Minimum CSS text pixels:

| Figure | 297 | 308 | 343 | 640 |
| --- | --- | --- | --- | --- |
| 342 | 16.70592 | 17.32478 | 19.29353 | 36 |
| 344 | 16.70494 | 17.32467 | 19.29342 | 36 |

The two existing native PNGs were visually inspected at desktop and actual 297px mobile presentation. They are nonblank, white-background line diagrams, not black/broken rasters. Neutral/accent/print measurements all record dark ink `rgb(21,32,31)` on white paper; the sectional distinction uses hatching and geometry rather than theme color. SVGs use the actual `--ld-figure-paper`, `--ld-figure-ink`, and `--ld-figure-accent` semantic variables. Theme evidence is the existing isolated native fixture, not a newly launched headed app or assembled-lesson acceptance.

## Binding And Recovery

Approved lesson: `7d10aa5f77ab675cc06463d1eba9df647207cc1c43f56766569718b406b1d7eb`; exercises: `ac627477efe274c2dfbafd77c81f3468c2c8d052c18196d0783c11bff8a51cda`; approved TEXT report: `fe6762451a46fc6a7c453608ecc20ec7d8705a1d1546e5275d97a30fd8b108cd`.

Source 342: `e568a9addcaa3380a8cdc4c6eb468fa825396330b276a8bf6e7ddaa476333d06`; source 344: `9add2132228f017bf40b7a5a74bd04209e7f7b54052eb4d37aab2398ce9a95ff`.

Current 342 spec: `9b7f7ac808c5786ed51ed597132a4d4a7fed638d017ee276dd98b142c01718b7`; SVG: `db32ddce84310fc61ac0a67eb4bd78633a215fecf9c3490e61d35d66e39ee73f`; render report: `238d2b46cfedbacfe8114644323677661f532f43727425830a4602a6d9861f0b`; render PNG: `083627f7b5ed2b1d22f4baaa105281b97fb23741890063caeb541ab525f9e0ea`; native PNG: `97867084f46b6224dd7250a3597ba2378082f44d4e987461bc59d24e520e7de3`.

Current 344 spec: `216f51e846d447526ff66153f53590c96c1ca43406e26f42941f4c05de672659`; SVG: `cbdce6e6bce3b994f1c7445fc80b97c3e8f9df1309cc61c4af1ede2a80c02ff6`; render report: `8bfc185306a3c7de53c09d2973195bc69551b4b8148688328c9397cc4198d967`; render PNG: `5d5186d4c7726d369acd98eb5ccb156d3a09f7f5faca04a581663bee256a8a35`; native PNG: `2a52186d9fa8ab7b9be24863177b42a220a1da89693d323c4f1d1571d3014ff5`.

Author report: `34bf5e478b1660ca370db3ae3b95e88e3d62a1933900bccbb93d37043582093d`; author manifest: `5e49bbd5d03c3693b6945a83508daba16c7374df143c70a411ad4698ecda9bdf`. Own 28-input binding check has no mismatch. The review manifest records all paths/hashes, native JSON/HTML, topology evidence and preserved FIRST bytes without copying the author package.

Original own structured check: `0e9b944edab5121c0dbdb26ff631ea03bcba8791b15255de04441461d3f3f2c6`. A reviewer-only prefix matcher mistakenly expected `--figure-*`; its false variable result was retained and corrected against actual SVG variables without changing content or replaying successful relationship checks. Corrected check: `4c77bc2b96302340e9e93b7227168dbcbfb81a538b596604960040507aa8b14c`. Three oversized text-extraction receipts are preserved; all commands exited zero. This recovery does not approve content.

## Scope And Counters

Images 6/8: source342, source344, current render342, current render344, native342, native344, each opened once; no crops/reopens/new screenshots/browser. Commands 16 total = 5 bootstrap + 11 recorded, including final seal; recorder failures 0; manual apply_patch calls 4; reviewer technical repairs 1. Producer/native/official review/generation/paid/backend/Git calls 0. No setup/freshness, dependencies, app/CSS file read, answer-key read, publisher, SOURCE/TEXT stage replay or promotion. Writes are only the authorized review directory/report and recorder ancillary receipts. Parent checkpoints, author assets, FIRST evidence and other reviewer edits are untouched. Status, manifest, report and review evidence are sealed 0444. Stop after this first review.
