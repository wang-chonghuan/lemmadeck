# fig161 Frozen Figure Author Handoff

Ticket: STEMROBIN-180. Role: author only.
Status: frozen initial candidate ready for one independent full figure review; NOT approved or promoted.

## Authority And Inventory

Only owned figure: fig161. Scratch: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-161-author`.

Original PNG actually opened completely first:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-161.png`.
Source SHA256: `1c920bb357648907e6c91062c7622c15d2e86896f40fb8bf4d1b9a139c179308`.

Complete approved authority:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s15-s15t1/adapt/6p/modern-us-neutral/lessons/phy6-c4-s15-t1`.
Lesson SHA256: `26216c12f3fd5245be681b9eb6a41ad9c3f0d09fe05d41efa8676b3a5e002f6f`.
Exercises SHA256: `0f3b5186c37e1c50c567344dac711cae5705ee5b332d2f6a68d72dce2a9113d0`.
All14 blocks and zero tasks read; complete modern text, source snapshots, historical attributions and safety/model qualifications retained in context/spec. No answer, key, choice, solver or private main solution accessed.

`source-inventory.md` records both full source stages before geometry authoring. B upper narrow tube is closed, B reservoir opens within A, C inner arm opens into A, C arch returns to an outside narrow tube and reservoir, both lower/U connections remain. Pump base passage, hose, rightward arrows, A/B/C/h, initial/final liquid levels and both height references retained.

Modern changes are declared separately: taller regularized front schematic, consistent wall widths, continuous semantic mercury fill replacing hatches, Latin a/b and English “To vacuum pump”. No physical dimensions, numerical h, pressure labels, units, extra apparatus or derived annotations added.

## Route And Initial Gate

Deterministic instructional mode reported before authoring/service. No Azure or other generation/model-service call. Existing JSXGraph renderer and app Playwright only; no renderer/schema/dependency edits.

Display: inline, maxWidth640, actual tested widths306 and640, minTextPx16. Canvas640×660; font34/36. No horizontal scroll is required; each actual media frame displays both complete stages.

One initial author gate round: draft validator PASS, renderer PASS, actual six-theme preview checks PASS.72 objects,23 relationship/connection assertions,12 labels. Dedicated draft validator called once; the renderer also performs its own built-in validation once. Renderer called once; no repeated render/gate.

Actual headless measurements: min16.25625px at306 and34px at640. All six actual screenshots are nonblank; labels fit, including both pump annotations. Native640 and the complete unscaled306/640 three-theme sheets were actually viewed. Author observations are recorded in author-visual-notes.md, not an independent review@1 record.

FirstFAIL: none. Repair budget:0/1 used; no repair and no failure snapshot falsely claimed.

## Exact Commands And Ledger

Shared existing interpreter:
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`.
Task helper: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-161-author/author_tools.py`.
Actions prepare, validate, render, preview, sheets and freeze each run once.

The task-local cohort contains only the supplied complete frozen lesson/exercises and original PNG. Existing build_context.py was called once against it; unchanged context-nearby.json retained and full context.json separately built.

`ledger/01-build-context.json`, `02-draft-validate.json`, `03-render.json`, `04-six-theme-previews.json` retain exact command arrays, stdout/stderr, exit0 and elapsed durations. Render uses `node --import <task-root>/network-off.mjs <existing-render_spec.mjs> --spec <spec> --svg <svg> --png <native> --report <render>`. Preview uses `node <task-root>/preview.mjs` and existing app Playwright.

Both browser launches were isolated headless. All task-owned contexts/browsers closed: one renderer context and six preview contexts. Offline and abort-all external routing enforced by task-local preload; preview observed zero request attempts. No user profile, CDP, headed/debug/PWDEBUG/Inspector/UI, desktop input, report opening or network/service access.

PIL contact-sheet/pixel-statistics command exited0 with an existing getdata deprecation warning; no output failure or repair. Sheets paste native screenshots without resizing. No new environment/dependency.

## Frozen Files

`fig-161.spec.json` SHA256: `a31e65ca2ae594ae7411ab6f4b6dab93bcabd1e03ed4d3dd948c3f64e6ff3025`.
`fig-161.svg` SHA256: `b75c7a461e0ce5cf4652bbd5ab3d981fd1d22b33f96a0b4bf6ca4e7af48a5485`.
`fig-161.render.json` SHA256: `ad12827486d1e2b163fcc9e87f56323880566f6afafb56214777eb6c0af754d1`.

Six complete native PNGs: previews/fig-161-{306,640}-{neutral,accent,print}.png.
Sheets: fig-161-306-three-theme-sheet.png and fig-161-640-three-theme-sheet.png.
Full source/context/inventory, route declaration, native PNG, author-preview-report.json, pixel statistics, author notes and exact ledger are retained. author-handoff.json binds these hashes and author-freeze-manifest.json.

Frozen author bytes are not self-approved. No official record_review, retention, promotion, assemble, finalize, source/durable/app/DB/Git/index write or test suite. s14 and blocked150 untouched. No in-flight sessions. Service tokens/cost not measured; actual service calls0. Authoring stops after this handoff.
