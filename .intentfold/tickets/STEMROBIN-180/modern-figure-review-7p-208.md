# 7p Figure 208 FIRST Independent Review

Ticket: STEMROBIN-180. Reviewer: Ramanujan, `independent_agent`, not author Bacon. Result: **FAIL / REVISE; current candidate not approved**. This is one complete substantive review, not a renderer rerun.

## Findings

**F208-1: Semantic human artwork takes the wrong route.** The source is a natural standing person holding a ball. The candidate selects `deterministic` and encodes the person as thirteen manually authored `svgPath` objects, including anatomy, face, hair and clothing. Its route rationale explicitly substitutes a hand-drawn schematic silhouette because photorealistic identity is unnecessary. The current routing contract assigns natural object/scene identity to `generated`, or `hybrid` where deterministic relationships must be preserved; the `svgPath` fallback is for deterministic curves/regions, not an alternative person-artwork engine. This is a workflow/representation defect, not a claim that the six images fail to look like a person. The source does not require a portrait or photorealism. An authorized semantic artwork route with deterministic contact/position overlay, if necessary, is the author's/main's decision; this reviewer neither calls a service nor repairs the candidate.

**F208-2: Contact/separation assertions do not bind the visible semantic objects.** `grip-on-ball-boundary` checks literal point `[471,846]`, literal center `[471,785]` and literal radius `61`; it references neither `person-raised-hand` nor `raised-ball`. The asserted point is the mathematical top of the circle, not a declared endpoint/anchor of the visible hand path. Similarly, `ball-over-plate` uses only literal coordinates, and `fall-projection-in-plate` checks a literal projection inside `plate-top`, with no link to the rendered ball. Thus the stated grip/ball-above-plate requirements are not protected against independent movement of those visible objects. The present frozen image visually shows grip and separation; the defect is the missing executable semantic binding, not invented visual detachment. `complete-standing-person` also maps to `one-ball`, which counts circles and cannot assert complete person structure. Keep qualifying source-image relationships and tie their assertions to defining visible objects/declared anchors rather than unrelated literal arithmetic. No mutation experiment or gate rerun was performed.

The two findings are all identified necessary defects. No temperature, mass, force, height, energy amount, arrow direction or numerical source reading is claimed wrong.

## Source-First Evidence

Original full PNG opened individually: `ssot-resources/soviet10year-textbooks/artifacts/7p/figures/fig-208.png`, SHA256 `e2973cb78c7a7e877cbd449eeebc042250456830a02ec3332d52102be5072f51`, 331 x 541. Before candidate/context inspection, independent pixel observations were frozen in `source-first-inventory.json`, SHA256 `a29d7e459d9ac976ad6008f9114cb637d2908553195378732becbbb49a0d444c`.

Reviewer correction retained transparently in `source-inventory-clarification.json`: the initial independent wording mistook the two contours of the raised arm for two raised arms. The actual source has one raised/gripping arm and one bent arm at the hip. Original inventory bytes are not overwritten; this is not an author failure or repair.

Source facts: full right-facing person, raised hand touching the round ball, complete lower-right quadrilateral plate with low edge, empty space between held ball and plate, feet left of the plate. Source has no arrow, trajectory, label, scale, temperature, mass or height datum. Lead material comes from the prose, not pixels. The candidate retains these macroscopic facts. Plain unbranded top, clean contours/fills and drawing proportions are expressly modern regularization, not physical measurements.

## Complete Context

Read full approved n82 `author-context.json` and all three templates, including all 17 prose entries (13 paragraphs, two figures, two captions), four full prompts, original `source.data`, and exact source references. Figure208 is the raised, still-held state before release; it is not the impact/deformed or post-impact state. The approved prose qualifies air-resistance neglect, reference frame and gravitational zero, covers **both** ball and plate deformation/warming, includes random particle kinetic energy **and interaction potential energy**, and does not assert these are the only energy destinations. The four prompts include both lifting/falling requests, both objects' state changes, conversion, and complete internal-energy definition.

The candidate embeds the entire context byte-for-byte in `source.authoritativeText`, not merely helper `nearbyText`. No molecules or thermal inset are required in this initial-state macroscopic figure, and omitting such an inset does not deny interaction potential energy or the plate's contribution. There is no answer annotation, fabricated temperature, hazardous practical instruction or added measurement.

## Object and Assertion Audit

All 16 objects and the full SVG were read. No object or assertion was skipped.

| Objects | Independent conclusion |
| --- | --- |
| `plate-top`, `plate-front-edge` | Four corners and low thickness visible, complete and below ball; source-relative plate position retained. |
| `raised-ball` | Exactly one round, held, undeformed ball, no ghost or motion arrow. |
| `person-left-leg`, `person-right-leg`, `person-left-shoe`, `person-right-shoe` | Both legs and shoes complete; no foot on the plate. |
| `person-shirt`, `person-shorts`, `person-sleeve-and-collar` | Plain unbranded clothing; modern simplification declared. |
| `person-hip-arm`, `person-raised-arm`, `person-raised-hand` | Source arm states and present visible grip retained; F208-1 route and F208-2 binding apply. |
| `person-head`, `person-hair`, `person-face` | Full right-facing profile retained; F208-1 applies to semantic artwork construction. |

`one-ball`: count of one circle agrees with actual image. `one-plate-top`: count of one polygon agrees. `grip-on-ball-boundary`: arithmetic true but no hand/visible-circle binding, F208-2. `ball-over-plate`: vertical literal displacement is drawing layout, not a physical datum; F208-2. `fall-projection-in-plate`: declared layout point lies inside the complete polygon, but its link to the rendered ball is absent, F208-2. No source grid, labelled point lattice, half-unit scale or quantitative geometry requires invented assertions.

## Six Actual Native Samples

Each existing PNG was opened **individually**, not only the author's two composite sheets:

| Sample | Actual image conclusion |
| --- | --- |
| 306 neutral, 306 x 459 | Full person/hand/ball/plate; no clipping or illegible instructional detail. |
| 306 accent, 306 x 459 | Same geometry; semantic accent fill keeps hand and plate clear. |
| 306 print, 306 x 459 | Monochrome outlines/fills remain distinct and complete. |
| 640 neutral, 640 x 960 | Full right-facing anatomy and plate edge, held round ball; no impact drawn. |
| 640 accent, 640 x 960 | Same relationships/contacts retained; no color-only assertion. |
| 640 print, 640 x 960 | Same complete macro-state with clear plate, fingers, legs and shoes. |

SVG uses semantic CSS variables for visible geometry; JSXGraph internal literal-color construction elements are hidden. Raw person paths are above the circle and do not erase the plate. No visible labels exist, so actual min16 text is **not applicable**, not a measured font PASS. Inline canvas at actual media widths306/640 is fully contained; no scroll end is required.

## Bytes, Mechanics, Budget and Decision

Actual author handoff SHA256 `378e5fb00734ce9821af1278d2d693917ead91939bb6da6890e947d09f4ad43e`. Candidate spec `abc42d607f5e2cfdc9399ca2b249bef8074a4c2e4acd9d44e4d451609c2456e3`; SVG `e82db605b6cf57559b4fea152f69a9946737695d394f445d9a14ac93430881fe`; render `6dc5fea022a68f19a7f9d35b1763c34ae4de156598d51adc19c30a2f7976ec0e`; context `f439eb259b6c0d4b60fee00fac2740fb3f0aefe07cc304a94366403eda447bd5`. `binding-audit.json` verifies the current handoff, manifest, input copies, templates, all six samples, full embedded authority and source/output identity without calling gates.

Author's existing four stage ledgers read: build-context1/draft-validate1/render1/native1 (six samples), all exit0; service0/retry0/repair0. Reused as mechanical evidence only. Reviewer: actual original views1, existing native images6; source/validator/render/native gate calls0; `record_review.py` calls0 because FIRST is FAIL; browser0/service0/author edits0/promotion0. No new context or browser was opened.

Author budget from frozen handoff is **0/1 used**, inclusive of mechanics. Do not reset it. This FIRST failure preserves all author bytes and grants no repair or service permission. Main may assign the single affected author repair; this reviewer stops figure208 and does not begin209. `review-ramanujan.json` is a manually recorded hash-bound FAIL, not an official PASS. No whole-lesson or durable figure approval.
