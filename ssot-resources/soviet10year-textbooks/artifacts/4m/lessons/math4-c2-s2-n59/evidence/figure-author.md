# N59 fig-223 author evidence

Status: cap1/cap2 author candidate ready; draft validation, JSXGraph render and candidate execution checks completed. Independent review is pending/already in flight; this author does not approve, promote or run record_review.

Scope: ld-s10y-image cap1/cap2 only. Every shell command uses explicit workdir `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`. Owned writes are limited to `.tmp/stemrobin-187/n59/figures/` and this file. No other files, lesson/templates/index/progress/tools, DB/env, model services, installations, commits, pushes, messages or workflow state are authorized.

## Inputs

- Original crop: `ssot-resources/soviet10year-textbooks/artifacts/4m/figures/fig-223.png`.
- Original SHA-256: `a2c88a7878cac487edb497256bed709dca5e4dc4c8eaee6605667519a12b1cd6`.
- Authoritative edition input: `.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s2-n59/exercises.template.json`, exercise number 1005 / exercise1005.
- Initial input file SHA-256: `890f12bdada6ce32f717c68735515bd0b1be44573d8647c24c441b3eeb986164`.
- Complete applicable text: `1005. 把一长7.35米的管子锯成两段（图223）。一段长2.89米。第二段管子比第一段长多少米？`
- Live ticket read: Plane STEMROBIN-187, `692405bc-4974-4b50-ac32-b3e29ab35920`, started. The latest direct figure-author assignment narrows that ticket's production scope.
- Read the current image skill, routing, FigureSpec, quality gate and shared production-resume SOP. No source-author solutions, independent solutions, answer keys or choice-draft contents were read.

## Pixel inventory

The actual original crop was opened once, before drafting. This inventory comes from those pixels, not another author's text.

1. Two distinct horizontal pipe-carrying scenes on white: a longer/higher scene on the left and a shorter/lower scene on the right. No coordinate system, measured scale, equal intervals, ground line, saw, whole uncut pipe, total-length label, difference label or caption is present.
2. Left: one thick horizontal pipe with rounded ends and a small light hollow/rim mark at the right end. Above it is a full-span dimension with two outward arrowheads, vertical endpoint extensions and centered `x`. This labels the unknown second-piece length, not the question's difference.
3. Three left-scene people, left-to-right: a smaller person whose head is below the pipe, with one arm raised to support it; a taller middle person whose head is above the pipe, with bent supporting arms; a taller rightmost person whose head is above it, wearing a striped shirt, one arm supporting near the shoulder and the other lowered. Bodies and walking legs are below; the group reads as carrying toward the right. Hair, face, shirt/pants, shoes and gait marks are contextual drawing details, not mathematical givens.
4. Right: one visibly shorter pipe with rounded ends. No distinct hollow opening is readable at its ends. Above it is a full-span dimension with two outward arrowheads, vertical extensions and centered `2.89米`.
5. Two right-scene people, left-to-right, with heads above the pipe and bent supporting arms, bodies and walking legs below. The right person's hair is dark in the source. Clothing, faces/hair and detailed gait are contextual, not mathematical givens.
6. There are five people in all, three on the left and two on the right. This count is source illustration context only; it does not define the arithmetic. No historical identity, insignia, archival background or ideological symbol is required.

Each source item maps to the stable `source.inventory` groups and primitive/assertion IDs in the draft spec. The candidate check additionally derives the five carrier groups (one head plus nine connected limb/torso segments each), checks left/right ordering, supporting-hand contact, smaller leftmost carrier, full-span labels, unequal pipe ordering and absence of additional visible text.

## Routing and modernization

Selected mode: deterministic measured pipe/dimension schematic using only the existing JSXGraph renderer. The exercise inspects pipe lengths and dimension labels; it does not ask the learner to identify natural materials, people, clothing, ages or historical scenes. Pipe identity remains visible through thick elongated bodies and end marks; contextual carriers are retained as explicitly schematic human marks rather than silently discarded. Object-count assertions do not stand in for a mathematical scale or source point/grid facts.

The modern rendering intentionally preserves both scenes, their higher-left/lower-right arrangement, three/two carrier placement and qualitative unequal lengths. It replaces faces, hair/clothing/striped texture, original detailed poses and book-style marks with neutral clean circles and limbs. Circular end caps, standardized limb geometry, margins and canvas coordinates are modern regularization, not pixel-derived exact proportions. No metric scale is claimed or linked to canvas coordinates; the drawn ratio is deliberately illustrative. Source `2.89米` becomes `2.89 m`; `x` stays `x`. The total stays in the authoritative prose, never an extra picture label. No calculated length or difference is added.

This does not need hybrid/generated artwork because no natural-object feature is an instructional given; it does not recast a required identification/counting scene as geometry. No paid/model image service was used. This is an author's routing justification, not independent acceptance.

Display: instructional scroll media, actual product standard width 640 px plus full 1040 px canvas. Labels use 32 source pixels, measured at 19.691666666666666 px at 640 and 32 px at full width, above the 16 px minimum. The normal640 preview uses the produced SVG under the actual 640 px CSS transform. The isolated 390 px scroll surface reached its horizontal end (client width 390, scroll width 640, scrollLeft 250). This is candidate display evidence, not complete-lesson acceptance or independent review.

## Actual commands and first failures

- `pwd`: exit 0; exact authorized workdir confirmed.
- Read-only skill/router/charter/source-text reads: exit 0.
- First path probe, `ls -l ssot-resources/soviet10year-textbooks/artifacts/4m/figures/fig-223.png .tmp/stemrobin-187/n59/figures`: exit 1 because the candidate directory did not exist. Original crop existed (11,461 bytes). This is a filesystem preflight result, not a figure content failure; new owned candidate files create the absent directory.
- Initial template-reading command mistakenly printed the full exercise-template wrapper because the document is an object, not an array. Exit 0 but overbroad/truncated output; corrected by selecting `data.exercises.find(number === "1005")`. No template writes or solution reads occurred.
- Plane helper `verify`: exit 0, users/me HTTP 200 and workspace projects HTTP 200.
- Initial Plane work-item query with `sequence_id=187` returned an unfiltered page (HTTP 200, exit 0, oversized/truncated output). Corrected by a ten-item GET filtered on stdout with jq; exact STEMROBIN-187 content read successfully, exit 0.
- Original and tool hashes: exit 0. Renderer initial SHA-256 `cc55cf5875722e25e96e1c52ed2c3fbe75fc6f2d6ca85fc160ae23f0b25e0e9d`; validator initial SHA-256 `07178e284c492d9a28ebadaf2fc36209e2cc5c06870ef335fd34b7e7ff670f7d`. These existing parallel-modified tools are used in place and not edited by this author.
- FIRST draft validation: `python3 .agents/skills/ld-s10y-image/scripts/validate_spec.py .tmp/stemrobin-187/n59/figures/fig-223.spec.json --stage draft --json`, exit 2. The two parallel assertions used arrays of pairs; the existing validator requires individual `a/b/c/d` endpoint coordinates. Exact output is retained in `.tmp/stemrobin-187/n59/figures/fig-223.validation-FIRST.json`, and the unchanged failed spec snapshot is retained as `fig-223.spec-FIRST-validation-failure.json` (copy exit 0). Repaired only those assertion fields; no geometry or image was changed/reloaded.
- Corrected draft validation: same exact command, exit 0; stdout `schema=ld-s10y-image/spec-validation@1`, `stage=draft`, `status=pass`, `errors=[]`. Only the failed assertion-format stage was resumed.
- Render: `node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec .tmp/stemrobin-187/n59/figures/fig-223.spec.json --svg .tmp/stemrobin-187/n59/figures/fig-223.svg --report .tmp/stemrobin-187/n59/figures/fig-223.render.json`, exit 0; exact stdout `PASS: fig-223 (67 objects, 2 labels)`. Report: deterministic JSXGraph 1.13.1, 67 objects, 2 labels, collisions `[]`, no artwork/assets, semantic CSS variables, 640/full display checks pass, render status `pass`. Render was run once; no failed render or geometry repair.
- Candidate execution/preview: `node .tmp/stemrobin-187/n59/figures/fig-223.check.mjs`, exit 0; stdout `status=pass`, explicitly scoped to author candidate execution, not review/approval. Derived carrier counts: left 3, right 2, 10 primitives per carrier; all 67 intended objects are source-inventory mapped. Verified unchanged exercise1005 text, current source hash, output/report/spec binding, exact two visible labels, support and dimension placement, full/640 text transforms, and reachable 390 px scroll end. Browser closed in `finally`.
- During candidate execution the exercise-template file SHA-256 was `849b9942623db708662591480584bc098804cbef12ecac6add5948fb08ff8120`, different from the initial wrapper bytes. The exact exercise1005 text still equalled the spec's complete authoritative text. This parallel edit was preserved; this author did not modify the template.
- Output hashes and existing renderer/validator hashes: `shasum -a 256` exit 0. Renderer/validator hashes still matched their initial values.
- Scoped `git status --short --untracked-files=all -- .tmp/stemrobin-187/n59/figures ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s2-n59/evidence/figure-author.md`: exit 0, only this new evidence file is visible to Git; candidates remain ignored scratch. No staging, commit, promotion or review file was created by this author.

## Candidate paths and SHA-256

All following candidate names are beneath `.tmp/stemrobin-187/n59/figures/` in the exact authorized checkout. These are scratch outputs for the independent reviewer and lesson owner, not durable promoted assets.

| File | SHA-256 |
| --- | --- |
| `fig-223.spec.json` | `58e8f9f6e028203d5b730d98ba83223471da6815d8673ed0813d7412f293ad31` |
| `fig-223.render.json` | `3c03f775f7f47b37f73ff9cb9eb82da351558912417de66c68f62edc24f76335` |
| `fig-223.svg` | `e6cadbce72140f56b9ea5075409f845b3bfa4b004ac25373ed4a0b41f8a60ffd` |
| `fig-223.full.png` | `b7f251b5c2eb5a6a9240eeff696fe293bc8c2c7422f9f2a8c69ae58cb116d9e2` |
| `fig-223.normal640.png` | `5b790613e97fbc84c8d72ece97e0ed50c92f00129d2a8435befe81cc66cfd536` |
| `fig-223.check.mjs` | `90613c5313199ef603a22dcf2c8c8c39f39f0bdab499787834f37331a1b0c712` |
| `fig-223.spec-FIRST-validation-failure.json` | `883235c8331ca3d84b68b76504519d949848276c9dfbf2878739a9809c26c197` |
| `fig-223.validation-FIRST.json` | `6cb9046de0a906f8a98720624dfa342d5d66f28663ef2affaf12914d7ab4eeab` |

Full/normal observations were made by this figure author solely for cap2 candidate verification. Both show the two pipe/dimension scenes, three-left/two-right neutral carriers, and English labels. Normal640 labels are legible; no answer label, metric scale, Soviet/archival styling or raster breakage was observed. Independent source-fidelity/mathematical/cultural review remains the separate reviewer's responsibility.

## Exact image loads

1. `functions.view_image`: original `fig-223.png`, opened once for pixel inventory.
2. `functions.view_image`: `.tmp/stemrobin-187/n59/figures/fig-223.full.png`, final full-canvas 1040 x 480 preview, once.
3. `functions.view_image`: `.tmp/stemrobin-187/n59/figures/fig-223.normal640.png`, final normal-width 640 px preview, once.
4. No repair image loaded.

Final actual loads: 3/4 (one original, one full preview, one normal640 preview). No reopens, no additional original crop, no repair view, no paid/model generation. Assertion-format repair consumed no image load. Parent's permanent 24/24 context receives text only.
