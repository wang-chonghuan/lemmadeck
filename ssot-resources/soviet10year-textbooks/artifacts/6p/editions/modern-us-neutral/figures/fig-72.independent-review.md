# Fig72 Independent Review

Status: **PASS**, limited to the current scratch hybrid figure. Reviewer: **Sagan**, independent_agent, not the author. Date: 2026-11-15.

Repository: `/Users/yong/.codex/worktrees/0f12/lemmadeck`. Paths below are relative to this root. No promotion, source/template/spec/output edits, answer/choice reads, service calls or browser execution.

## Independent Original Inventory

First actually opened `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-72.png` with `view_image(detail="original")`, before reading the candidate records. Two complete platform spring balances: left a and right b, with round outer/inner faces, unnumbered rim graduations, central pivots and counterweights, lower-right needles, a small printed 0 below each pivot, upper platforms with load shapes, lower stems and feet. Left pointer is closer to horizontal; right pointer is steeper downward.

In b, a human hand is above a hooked handheld spring balance. Its lower hook joins the apex of two sloping strings attached to the PLATFORM at both lower ends. The load still rests on that platform; it is not freely suspended from its own top. Source label beside the handheld instrument is 2 newtons; source panel letters map to Latin a/b. No full numbered dial range, tick value, load mass, or exact pointer-angle calibration is printed. The original full hand, two complete instruments and feet are part of the inventory.

## Actual Output And Authority Inspection

Read complete frozen modern s23 upper prose and all seven prompts, context, spec, render, author record and original generation/processing metadata. Structured comparison confirms that both context and spec contain exactly all 22 current modern title/prose/prompt entries, not source.data substituted for modern text.

Actually opened the complete existing `author-preview/width-theme-sheet.png` at original resolution, containing all six full neutral/mixed/print images at native media widths 306 and 640. Inspected both states, the whole hand-to-foot chain, both zero labels, 2/5/3 N, a/b, pointer heads and complete right/bottom edges. Also actually opened `author-preview/artwork-only.png` and `author-preview/overlay-only.png` separately at their complete 640x900 extent. Parsed the complete SVG XML, including both graduation paths, hooks, spring path, polygon borders, pointer/force heads and all seven text elements. No rerender or new screenshot was made.

## Substantive Findings

- Both source states are preserved. Identical load shapes remain in contact with the platforms. Each platform connects through its neck to the circular balance and through the lower stem to a complete foot. The left state has no invented pulling chain.
- Right-state strings end at platform coordinates `[396,411]` and `[524,411]`, meeting at `[460,510]`. In screen coordinates these are `(396,489)`, `(524,489)` and `(460,390)`. They do not end on the load's upper ring. Both are visibly taut and continuous with the tray and the lower hook.
- The handheld body runs from screen y241 to y352, with internal spring/window/indicator. Its lower link reaches y366; the lower hook starts there and reaches the string apex y390. The upper hook starts at y241, loops near y209, then its repaired vertical terminal reaches `(462,181)` inside the actual curled-finger grip. The complete composite shows a grasp, not a detached hand, floating instrument or line through an unrelated body part. This is visible at 306 as well as 640.
- Layer integrity: artwork-only contains only the natural hand and short wrist, no apparatus, scale, numbers or lettering. Overlay-only contains the complete deterministic apparatus and seven labels, not a flattened scene or embedded bitmap. The final SVG contains no visible raster image. The full-canvas raster is independently bound as `fig-72.artwork.png`; the composite preview is not substituted for either publishable layer.
- Contain/provenance: original generated image is 1024x1024; the processing record derives a padded 379x723 alpha crop. The source asset, unchanged generation metadata and final raster layer hashes were checked. Its centered contain placement preserves that intrinsic ratio in the 104x174 box, rather than stretching the hand. In the viewed result the fingers/thumb and wrist are intact, without background-removal holes, unwanted text, symbols or extra apparatus.
- Physics/values: frozen modern prose explicitly supplies a 5 N load, 2 N upward pull and remaining platform reading 3 N. The source itself supplies the upper 2-newton annotation. Added 5/3 N callouts and upward direction cue are explicitly prose-derived modern additions. In this resting, tared experimental model, 5 N downward minus 2 N upward leaves 3 N on the lower balance. This is not a claim that the supported load is force-free or that the apparatus itself has no mass.
- Both pointers still originate at their pivots, point lower-right and show b closer to the bottom zero direction than a, matching the source qualitative decrease. The 26-mark unnumbered regular rings are disclosed drawing regularization, not a measured source count or a 1 N/0.1 N/full-range calibration. I do not infer numerical readings from their angles or tick intervals. No dial unit multiplier, mass or range was invented.
- All seven labels are visible and independent: 0, 5 N, a, 0, 3 N, b, 2 N. SVG numeric labels use font36 and panel labels font40, giving 17.2125/19.125 px at actual media306, and 36/40 px at640. Existing transform records agree. No clipping, label/line collision, missing foot, invisible arrowhead or lost finger was observed.
- Semantic CSS: ink/paper/accent/accentSoft roles remain legible in neutral, mixed alternate-accent and print cases. The hand is anonymous modern natural artwork, with no jewelry, historical identity, cultural insignia or copied source script. Mathematical units use English N; subfigure letters are Latin a/b.
- Leakage/text boundary: 3 N is already stated in the modern demonstration, not a hidden answer imported into a question. No answer key was read. All seven prompts have empty figure_refs; none of their person/box, tug or parachute numerical answers was drawn. This approval neither unlocks blocked fig70 nor approves whole-s23 completeness or answer grading.

No blocking mathematical, apparatus-connection, semantic, visual, cultural or leakage defect found.

## Sole Repair And First Failure Retention

The first actual visual FAIL remains in `failure-01-hand-contact-gap/author-visual-failure.json`, alongside its full prior spec/SVG/artwork/render/previews. Its machine render had passed despite the hand/contact gap; that failure is not rewritten as an initial independent pass.

Old/current comparison found one artwork-independent geometry edit: the upper-hook path terminal screen y196 -> y181. The added contact assertion is the only new assertion; pre-existing pull/connects and panel-count assertions remain equal when matched by ID. All other objects, labels, pointer geometry, apparatus, source and authority are unchanged. Original generated bitmap, generation JSON, derived artwork and final artwork-layer bytes are equal to the retained first snapshot. The contact assertion alone cannot prove a grip in pixels; the actual layer/composite comparison above does. Budget 1/1 consumed; no regeneration or further repair performed.

## Actual SHA-256 Bindings

Full-byte local hashes independently calculated and compared with their records:

| File | SHA-256 |
|---|---|
| Original fig-72.png | `1dba4adb50c6a7145503c5a22c637dd3ff3b7c11fe11cfe0532f8c556090ac70` |
| spec.json | `d74a972882e896461afbe45becb98919f302e25f3888cc766f6414f599adb55c` |
| fig-72.svg | `2fa557dfa834257eb81e9d5b3a0f7b05cd172abc4f20ff038a89ff005ceb57a4` |
| fig-72.artwork.png | `94bb99ac796b80db9f7136cc8c462fce7819b5a73a21d0c19639cfcfdb8ce16e` |
| render.json | `e0586a75f3eb8af0df9c0f59d376a7598714dcfe647beace9ddb3bcf119fecbe` |
| context.json | `247d24c438b2847c35d9f53aa16ddf3019391be1bfeacbd8429714cd949defa9` |
| s23 lesson.template.json | `01b0274797df4655d37db3dd0e15179d7addb19e88ce5f58f9170a851e8e73ea` |
| s23 exercises.template.json | `2df5dd3ae194f06ccabd2471bd30fd3078fee93ebc2534a0b7dbf3c9f3674019` |
| artwork.png | `79ed8815632c235a4bd2f80b712bf7b64c754b65860611d05d2510b31c455628` |
| artwork-opaque.png | `b5a4465e944bcef81d65e22600d4ca688baf65f09a84f8d084985f2e6ac2810e` |
| artwork-opaque.png.json | `ae8a0f6c70c597f11c2e30644bb319fe7be10dae4e2b6caa6500f37c463d6c9e` |
| artwork-processing.json | `0b06266a5dd35107c09df0481325c628e4d152cb58fb5f290f9a5acd810c32a9` |
| service-calls.json | `fcd9ed1e141b1e580feea6caf97be7ae92acf420eb59cd15e6e129bf8f8654cb` |
| author-preview/width-theme-sheet.png | `8d3a9f87e86654afc82cf98238fb6503eb28eb57d059c33d6a964cdae7d1caa4` |
| author-preview/media-checks.json | `42f3fcb96216ee8f2b3ff9c696b981778374debf6997628187b11921592050d9` |
| author-preview/layers.json | `3d86d2c87920738c86af872c36ded440823c338832cdbf030033a738598a1112` |
| author-preview/artwork-only.png | `f0d44ab2656e7cc13276481a9c7e7f59e4a354f93555e0f7f549b3d85227f861` |
| author-preview/overlay-only.png | `517e2d905f97302a532c1500601118473c4086803cba12abf242b72dfb1ff0c3` |
| author-preview/neutral-306.png | `4f902351546e88a9428eb52b7b5797b2642c329418172574887d5febd77c1ed2` |
| author-preview/neutral-640.png | `fcdb79bf082d6d511b503b142002434862c0881e2c43970b1c769147bfbb3e09` |
| author-preview/mixed-306.png | `56d3e644fe5dc2ef4af516e91f5bedb320035e60750cdbd5c65baf10d919e793` |
| author-preview/mixed-640.png | `54747d40db4b84d35997083561e55d3418a07fb3a11aadaadbcba097bd046fe7` |
| author-preview/print-306.png | `a2dc4ac172d2fd3e73fc37498577fc9f8f867b4026b38298bf7f18f96b460a9a` |
| author-preview/print-640.png | `288dd5555d819483d1615104e13a5cee694faf2d973c60423f7b18371e9e8ddf` |
| failure-01-hand-contact-gap/spec.json | `a088e2e6c667518dcae3f04fd678486f5cd75061337b9ed920cfa71ccbe54dda` |
| failure-01-hand-contact-gap/author-visual-failure.json | `3279bf3c69b72c50822a5bb0ba4c0765f428d41254946578d8c7b4dead9aeb33` |

Source/spec/output/asset/metadata and all six preview hashes match current evidence. Existing render PASS (47 objects, 7 labels, centered contain) is mechanical evidence only. Formal `review.json` is recorded through existing `record_review.py` with this report's hash in notes.

Reviewer runtime: Codex; exact deployed model, reasoning setting and token/cost totals unknown. Reviewer image-service calls 0, browser sessions 0. Author metadata records one gpt-image-2 edit, retry0, no regeneration; author image token/cost usage is unknown/null. No service was called to verify that record. Existing author previews explicitly use isolated headless contexts, not user-profile/CDP or desktop behavior.
