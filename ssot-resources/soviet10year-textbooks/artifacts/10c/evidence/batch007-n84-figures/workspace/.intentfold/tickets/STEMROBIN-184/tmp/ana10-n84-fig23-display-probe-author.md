# n84 fig23: immutable mechanical display-probe handoff

Date: 2026-11-16. Ticket STEMROBIN-184.
Authority: parent-agent delegation under existing human ticket authority.
Role: mechanical display-evidence author only, not figure author or independent reviewer.

**Complete: sole probe invocation exit0, eight screenshots, mechanical_checks_met. No figure PASS or semantic approval is asserted. STOP.**

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
`T` below means `.intentfold/tickets/STEMROBIN-184/tmp/`.

## Frozen inputs and integrity

Only James's assigned existing first-attempt outputs were used. The original image was not opened; no separate source inventory, mathematical proof, answer, choice, parent/reviewer report or figure22 material was consulted. No source/math comparison was performed.

Input directory: `T/ana10-n84-modern-figure-author-evidence/fig-23/`.

| File | SHA256 before AND after the probe |
| --- | --- |
| `spec.attempt-01.json` | `71b366dcab545af9f8e5d755166c25bf79f9c529d106dbbb2179c2d6e9215785` |
| `fig-23.attempt-01.svg` | `1f5257f9444524e240cda62d27315d26207e934c10d3b77e0432931400cab060` |
| `fig-23.attempt-01.png` | `0bbe2fa41af8611c908260e3441392e0817acff5a935fa3ded19a69008a96b27` |
| `render.attempt-01.json` | `c6195519ac225de1540da6082ff8420a6e3e0b4e7c302a1dcc0fa690d1fcae69` |

All four hashes matched the delegated identities before any browser launch. Complete byte-identical inputs are retained in the new output directory's `input-snapshot/`. `inputs.before.json`, `inputs.after.json` and `metrics.json` retain actual hashes and `inputsUnchanged: true`. No assigned input was modified.

## Single actual command and runtime

```sh
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never node .intentfold/tickets/STEMROBIN-184/tmp/ana10-n84-fig23-display-probe/run-once.mjs
```

Output directory: `T/ana10-n84-fig23-display-probe/`.

The write-once runner invokes its new scratch `probe.mjs` exactly once. `attempt.started.json` guards against repetition. `command.json` records actual executable/argv/cwd/environment/start/end/exit; `command.stdout.txt` and `command.stderr.txt` retain complete actual stdout/stderr. Exit0; stderr empty. There was no failed probe or assertion, hence no `FAILED.json`; the helper preserves partial records and failure details and stops if a first assertion fails.

The existing installed Playwright is resolved with `createRequire` anchored at the existing renderer path, without importing/executing the renderer or installing dependencies. Both helpers are new scratch files; n83's helper was read only as an allowed pattern and its package was not changed.

Chromium launched with explicit `headless: true`, fresh isolated contexts, deviceScaleFactor1 and service workers blocked. Every context routed all resource requests to abort; actual request count0. `PWDEBUG` was actually unset; `PLAYWRIGHT_HTML_OPEN=never`. All task-owned contexts and the browser closed.

No user profile/CDP, desktop/window/tab activation or OS input was used.

## Actual product-width measurements

The existing SVG has native viewBox1280x640. The delegated scroll contract is **fixed640 media**, not native1280 media and not inline mobile240/346 media.

The local harness embeds the unchanged SVG at640x320 inside the requested-width horizontal scrolling container. Only external theme variables and container/media CSS are applied; SVG bytes, geometry, font values and labels are not rewritten. This is measured existing-output media evidence, not an application finalization or full product display gate.

All eight records have:

- Actual media640x320, native viewBox1280x640.
- Root SVG `getScreenCTM` scales0.5/0.5.
- Every one of ten actual DOM labels has scales0.5/0.5; effective font size is computed from its own `getScreenCTM`, not the nominal native canvas width.
- Six labels have native32px/effective16px; four have native34px/effective17px. Minimum effective text16px.
- Complete label-ID membership agrees with the input object/render metadata. Renderer IDs, including their existing `-label-label` suffixes, are retained exactly.
- Each label record contains native font size, full CTM, both effective font axes, user bbox, viewport bounds, media-relative bounds, viewport visibility and computed theme fill.
- ScrollWidth640. Document/body widths equal the viewport: no whole-page horizontal overflow.
- No resource requests, no input changes.

| Theme/viewport | Saved positions | Actual scrollLeft | Maximum scroll |
| --- | --- | --- | --- |
| neutral640 | full |0 |0 |
| print640 | full |0 |0 |
| neutral240 | start/middle/end |0/200/400 |400 |
| print346 | start/middle/end |0/147/294 |294 |

Both mobile end requests actually reached their measured maximum scroll. The media width and effective label sizes remain unchanged at every position. Off-viewport neighboring content is reached by scrolling, not shrunk to mobile width.

## Immutable deliverables

Eight PNGs in the output directory:

- `neutral-640-full.png`
- `print-640-full.png`
- `neutral-240-start.png`
- `neutral-240-middle.png`
- `neutral-240-end.png`
- `print-346-start.png`
- `print-346-middle.png`
- `print-346-end.png`

`metrics.json` SHA256:
`09fa54d3106778e3e13e8247554c8a3cec33aa6ecf8a9207506ee2a545e73caf`.
It contains all80 per-label measurements, per-snapshot mechanical assertions, source-before/after hashes, actual launcher information and outcome. `records.partial.json` retains the exact first-run incremental records.

`T/ana10-n84-fig23-display-probe/manifest.json` binds every screenshot, metric, command/output, helper and input snapshot plus this report by SHA256 and byte size. Report and manifest raw hashes are calculated externally after freezing, not circularly embedded.

The screenshots are supplied for Ptolemy's sole StageB inspection; no independent visual/source/math review of them was performed here. No figure PASS, approval, review record or promotion is provided.

No renderer, FigureSpec validator, source image review, spec/math/geometry/style repair, source/tool/app/dependency/DB/network/service/Git or other-chat action occurred. No n83 or n84 fig22 artifact was written. Work is stopped at this immutable mechanical-evidence handoff.
