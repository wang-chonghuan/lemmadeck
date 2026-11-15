# geo910 Figures01–05 Author Handoff

Date: 2026-11-15. Author: Codex, delegated figure author under STEMROBIN-184; not the independent reviewer. All packages below are stable scratch drafts ready for parent source-first review. No independent approval, `record_review`, promotion, lesson finalize, DB, service, dependency, app or production-tool change was performed. No answers, choices or parent source/review reports were read.

## Packages And Scope

Root: `.tmp/s10y-image/9-10g/fig-01` through `fig-05`. Each contains:

- `source-inventory.md`, frozen from one complete actual original PNG before any spec.
- `fig-XX.spec.json`, `fig-XX.svg`, `fig-XX.render.json`, `fig-XX.canvas.png`.
- `context-binding.json`, with actual modern template byte hash and exact selected top-level prose text/source refs.
- `projection-model.json` and `projection-check.json`, supplemental executable author evidence for chosen affine geometry, not a new rendering engine.
- `fig-XX.display-{640,346,240}.{html,png}` and `display-evidence.json`, current-CSS offline display evidence.

The authoritative templates are `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n{1,2}/lesson.template.json`. Only modern top-level `prose[].text` was used, never embedded faithful `source_text` as semantic authority. Template bytes remained identical to their bindings at handoff:

| Lesson | Template SHA-256 |
|---|---|
| n1 | `df3109b37d80ea76a9209f0456e86a33bc2930ecf3a125cb86caa6e58ca16ad5` |
| n2 | `b27482f669ed847457a0da47eb19062efed18937d01f6bbf95921ef28a41fa32` |

Durable modern-text binding/promotion is parent-owned. No fallback `build_context` or faithful-context binding was used. If parent changes relevant modern wording, context-only rebind is needed; no such change was assumed. This does not claim that n1/n2 or their additional figures are approved/complete.

## Source Inventory And Realization

Originals: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-XX.png`. Current original hashes equal the independent author source freezes; source bytes were not changed.

| Figure | Original SHA-256 |
|---|---|
| 01 | `13076830720afe711c4f86b62eee075cb8e648af6cd9cd85f6ad3dd6172179b0` |
| 02 | `7fd1a20dd6acde79ffc3b9da35eb9931a37b9522caf723750021b81796e14bc4` |
| 03 | `6fed362088363e5a3ec6b73d42db732bd613bd0d2c05a4b9db60f5bbe1b1343c` |
| 04 | `2e8a7ce9667d812c5bc03a64a0657aff5a9c2e4fb644f8178478b1fac578a997` |
| 05 | `94bbc1bfe57ec5456c15380d0887c3edec38f347f795c2becaf0de845d9cf8db` |

01: Two unlettered representations, left parallelogram with lower-left alpha, right arbitrary closed footprint with lower-left beta. `alpha-outline/alpha-label` and `beta-outline/beta-label` map both source groups. Native `inside` and the alpha parallelogram's two opposite-edge `parallel` assertions realize these requirements. No points, line, subfigure letters or mathematical values added. Modern n1 refs `p0009#3/#4`. The local planar-window model checks each representation independently; it does not assert alpha=beta, alpha!=beta or a common spatial frame.

02: One parallelogram drawing window, upper-left alpha, one filled interior A with A below-right and dot right of centre. `alpha-outline/A/alpha-label/A-label`; native inside assertions separately cover A and both interior labels, plus parallelogram structure. Chosen spatial A=(0,0,0) lies on z=0. The small original right-border raster gap is regularized, not converted to a mathematical dash. Modern n1 refs `p0009#4/#9`.

03: One irregular footprint with alpha at left, one A dot above/outside with label right. `alpha-outline/A/alpha-label/A-label`. Native inside covers alpha. Supplemental model checks z(A)=1 and projects A exactly to the visible point, then checks A/label outside and at least 30 user-pixels above the complete outline. No native negated-inside or 3D assertion was fabricated. Unnamed source scratches are not points/grid/hatch. Modern n2 refs `p0010#5/#6`, `p0011#1`.

04: One irregular alpha window with alpha lower-right; one finite solid depiction of infinite a inside, label above, no point dots/arrows. `alpha-outline/line-a/a-label/alpha-label`. Native `connects`, both unmarked extent anchors inside and both label-inside assertions map the source. Spatial line p(t)=(0,0,0)+t(3.05,0.2,0) has n.p0=0 and n.d=0, so its entire infinite line lies in z=0. Modern n2 refs `p0011#9/#11`.

05: One irregular alpha window; A inside, B above-right outside, both on rising a; alpha left, a lower-left, A below-right, B above-left. `alpha-outline/A/B`, the three `line-a-*` pieces and four separate labels map the source. Native group requires `pointRelationships`; both visible points are covered by mapped AB collinearity assertions wholly inside the group, not merely object counts. Three `connects` assertions preserve the exact solid lower exterior -> dashed lower outline crossing to A -> solid A through B sequence. Alpha/A/A-label each have inside assertions. The lower crossing is an unmarked layout break; neither outline crossing gains a dot or name. Modern n2 refs `p0010#5`, `p0011#3/#9/#12/#13` (complete merged proof includes `p0011#16`, `p0012#1`), `p0012#2`.

For 05 the chosen oblique spatial model is plane z=0, A=(0,0,0), B=(1,0,1), a(t)=(t,0,t), with projection (330+80u+55z, 205+60v+135z). Thus n.d=1 and intersection requires t=0, exactly A. This is explicit text-consistent schematic geometry, not measured source depth/perpendicularity. The footprint is only a finite drawing window for an infinite plane; its visible outline crossings cannot create extra spatial intersections.

All arbitrary outline regularization, font sizes, semantic fill, finite depiction extents and affine coordinate choices are modern layout, not source-measured lengths, angles, incidence or physical plane boundaries. `objectCount` checks only completeness/absence and does not replace mapped relations.

## Execution And Display

Existing `.agents/skills/ld-s10y-image/scripts/validate_spec.py`: initial draft validation PASS for every spec. Existing `render_spec.mjs` (JSXGraph 1.13.1): first render PASS for 01/03/04/05; final second render PASS for the sole targeted source-position repair of 02. Renderer also validates the current spec internally. No hand-edited SVG, new renderer, broad test suite or redundant rerender.

| Figure | Final native assertions | Supplemental model checks | Render calls | Final render | 640 / 346 / 240 display |
|---|---:|---:|---:|---|---|
| 01 | 8 | 2 | 1 | PASS | PASS / PASS / PASS |
| 02 | 9 | 3 | 2 | PASS | PASS / PASS / PASS |
| 03 | 5 | 4 | 1 | PASS | PASS / PASS / PASS |
| 04 | 9 | 3 | 1 | PASS | PASS / PASS / PASS |
| 05 | 13 | 5 | 1 | PASS | PASS / PASS / PASS |

Author inspected the current full canvas output and actual current-CSS desktop/mobile/minimum screenshots. Display uses actual `sr-read > sr-read-fig > sr-figure-media > sr-figure-vector`, including the current FigureMedia inline width=640px/max-width=100% contract, not only source-canvas sizing. No clipping, missing labels, page horizontal overflow or blank image detected. Labels scale to 44px / 23.7875px / 16.5px respectively, satisfying >=16px at minimum240. Canvas sizes are 640x320 for 01/02/04, 640x360 for 03 and 640x440 for 05.

| Figure | Dark screenshot pixels at 640 / 346 / 240 |
|---|---|
| 01 | 4305 / 1130 / 473 |
| 02 current | 3544 / 947 / 521 |
| 03 | 4030 / 1060 / 473 |
| 04 | 5009 / 1355 / 611 |
| 05 | 5803 / 1766 / 778 |

Current CSS SHA-256: `9fdcb8b3060e0cd0a6b97bf8a32f18c924b60a18226fa8c0d1a485221277168f`.
Combined current display evidence: `.tmp/s10y-image/9-10g/fig01-05-display-evidence.json`, SHA-256 `9525215c2d574e519333c5169352a4c1666cdfeb9cbb0411ac2884fcbcb55fb0`.

Both existing renderer and scratch display launcher were inspected to use explicit `headless:true`; commands used `env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never`. Preview uses existing app Playwright, a new isolated context, no profile/CDP, and aborts external requests. Screenshots are task-local. All task browsers/processes closed. No visible window, tab activation or OS input.

## Only Targeted Repair

02 first renderer/display checks mechanically passed but author's frozen source comparison found A exactly centred rather than right of centre. One correction changes only `objects[A].at` [320,150] -> [365,150] and `objects[A-label].at` [370,115] -> [415,115]. All other spec fields, source/context wording, native assertions, outline, styles and labels remain deep-equal. Model coordinates and derived bindings follow the changed projection origin honestly; source A membership remains unchanged.

Initial complete package and display bytes remain in `fig-02/before-source-position-repair/`. Exact change record: `fig-02/source-position-repair.json`. Initial combined display evidence is retained as `fig01-05-display-evidence-initial.json`. Only 02's three affected widths were repeated; the other 12 cases were reused byte-value unchanged. No second source scan or repeated mathematics. No further correction allowance used/remaining for 02. Initial issue was source placement, not a falsely claimed native-render failure.

01/02 were separately handed off as soon as stable, with current hashes; they are frozen and will not be changed by this author. 03–05 now likewise stable. Independent review and all durable path rebasing/promotion remain parent-owned.

## Current Hashes

These are SHA-256 of current scratch artifacts, not approval hashes.

| Figure | Spec | SVG |
|---|---|---|
| 01 | `52fb79e950da70ce3cafc0b19b2075505ee65f29d65a7c6ec48a2ba0c75c4b35` | `a0dd8cc2040d748584a84656dc74956bcb1effbab60624fe8748757d9526dbfe` |
| 02 | `34b30da3eeb17ef42fa038fe265f507705e0c5a2406e7fbf8276aa5e43f4421c` | `660e11f152ea174e0ce351abbf61b76f68ea373f2e982c2ecb97120aacb68f4e` |
| 03 | `6949326b8e7a0f6900abbd5893ffcd2ace05090c49a2f540b10ec56b6043ef87` | `4d4bf634988ae8229b2b8addbe81ebbac19cfc462866f1d05b951a10438362cc` |
| 04 | `690ff5cf81e17b43edbeace623cc22210057b1e6085b0cc28afaa817d5105cbe` | `7333cc283c8fefce6cc6660f6c4d00084de0452d24236abc8513c9c8c3272646` |
| 05 | `48196fb5ad51ebac02b49590bdcab561ddad911bc1281a5f1ee1764d16ce6ff8` | `a50c48592b7f6dd72bd0236d6e45b680650ce01274710b10c7e84bd2202be948` |

| Figure | Render | Per-figure display evidence |
|---|---|---|
| 01 | `59df8e514e6c29f6cec148cd522fc6f0d9723534496263db69fdf7d98a0f96f8` | `c470cdf452a06b35cfc84bd80ff72c8eb91fabfd4da25121ab9909c26d7f091c` |
| 02 | `a9e26b2260e9c14647e50090cb809fc22c1b13b786072610d00f3cf73b7d5cb4` | `db2a127ac1ca9eb0a571bd9ecba1a309083fe87f47a57d850efcc38cf0622a04` |
| 03 | `c68c779b5d1f47fca0b7925584b8dc14df15e31b0a85cd36d9ab0750fab13be8` | `6560e9a85b41a305d78a99698a55ab1872bb1fd1e313b15d8d9260c4c0129a84` |
| 04 | `19aed2bc6035942d10eb723cf32f10c0ca517bea2c0c05b3190f92c0c32e055a` | `ffe4c67328213a6e9dce9a99cbfd7f57b697fd555a5b109ae93e002a6c1fcfdf` |
| 05 | `b3c2b53f47ddf2cce91ac6539b69ca351cd32b6b35a89a1be4f845316bedc196` | `6b73dc9bbfc06ae09b0701227ca9242c721f75cddac23e8e999b172d1e7a6d1e` |

| Figure | Frozen source inventory | Context binding | Supplemental projection check |
|---|---|---|---|
| 01 | `515c6ba76f4a98ae92ee38307bb4a4c3dc6ab0de0c47809a138ca5cb1a7e50a6` | `2b961fe8e0a2152a7ec894b80e30925fc8718cb9be5325c54ea062aad5588b48` | `9bf2d76ebe2fabf3063a09091c29c1e0d3edcb65deaec3cbaa6a20445913302c` |
| 02 | `e78daa133f9e8f09b4be48f6dccc67c9f5f6281accd85a913bf8265a8144e0a4` | `122a9aef5b7e672dc75ba92118494e15336d39b7f7441eef1c3397e13e6abf19` | `36bb9d440e69d07ed8f7aae1a7c393aac936fa46549ef6ca415374916deffbe5` |
| 03 | `e8de1702d9f6b7718fae02d824e1f7200016d1bbde8f50d99cafaf0008b69121` | `c328cc6e156310379658a04bb2b0a708630a49a09f76ec9f3a90761049f31f68` | `84b57761b3cb1693e3358ccef63ca5a253a0a729e87dcb4503b2f9792b4f66cf` |
| 04 | `8916246d5da584f52c3fcf784fcadb7ef49d734c418a7c19f6caa28962122cee` | `5fc2e67d918eeff1e0c1596784e3b57597e1755278e3efd6b44de3dec6fbfda9` | `3bf8d26bc0dc4787d4e7e4640ffeb16d0a6c975defc75690baa2149042c32035` |
| 05 | `02f45dcab63200606ffc80f6a59177229d0a7903da8b94c01b38e321f9d4dcf2` | `7dbfe7e6cd76807b19d9c429d36d0fd27304cf825dc9e7c4aa8f94cbce8f5ff7` | `8d68d890eeab500a32b3afb80851bfceea3eeeed3e0079d2936ae9cd3f6e1d04` |

No known mathematical or renderer/display blocker remains in this authored range. The spatial checks are explicitly supplemental author checks because native FigureSpec assertions are 2D; reviewer must assess their source/semantic fit, not treat render PASS as source approval. Await parent independent review; no further author mutation planned.
