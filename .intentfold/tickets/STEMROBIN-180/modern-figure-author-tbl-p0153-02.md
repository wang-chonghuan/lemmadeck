# tbl-p0153-02 Portrait Author: BLOCKED Freeze

Role: figure author only. Final status: **BLOCKED / frozen / not approved / not promotable**. Total repair budget **1/1 used**, including preparation/checker/preview failures; no further repair or request. Only this stable figure ID was handled.

## Authority And Actual Source

- Reopened the complete original PNG with `functions.view_image`: one engraved adult male head-and-upper-torso portrait, dark wavy hair, moustache, pointed beard, period clothing/light collar edge, dark hatched surround and white crop margins. No table cells, values, units, rules, label, caption or footnote exist inside this crop.
- Main's initial table classification was corrected before any table spec, gate or service call. The stable ID and all original bytes remain unchanged.
- Torricelli's name, 1608–1647 dates, Italy and Galileo-student identity come from the frozen full lesson's `p0153#11` / `p0154#5` declarations, not a guessed identity from pixels.
- Full modern authority was read and copied byte-identically: all 16 prose blocks, all 8 written prompts, boundaries, figure references and historical declarations. No answer, key, choice, private solution or other figure was used.
- Source: `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/tbl-p0153-02.png`
- Source SHA256: `567148f69a572e48b92fecda5430c836124752b6ffc9329fae8d87e5751fa208`
- Full lesson SHA256: `1b596f214fffb492a482e3c83cc1f6df848e302c45bb9dc5c0eda97c6e2ed80a`
- Full exercises SHA256: `a353e2708557e3995a2c6b9c09b56cebf736b272e6a992857ea5faf17d9319d6`
- Text author-handoff SHA256: `05fbd09876e18cfb0786336d8044beee3f8a824001c66dd6f78fceecc1067c9f`

## Route And Display

Selected mode was reported before the service call: `generated`, `decorative`, inline maximum/media width **160 CSS px**. Intended evidence: neutral/accent/print in 306/640 px containers, with the portrait remaining 160 px wide. The spec declares `widths:[160]`, `minTextPx:16`; no visible text is requested. No 306/640 image enlargement was substituted for the compact-portrait contract.

Requested one modern full-color digital textbook illustration, not an archival photograph, old-paper copy or halftone. Original facial/bust traits and source-bound historical identity were retained; exact colors and simplified clothing details were explicitly interpretive. No apparatus, measurements, labels, dates, flags or answer-bearing annotations were requested. Generated-mode objects/assertions are intentionally empty; no fake mathematical assertion claims semantic portrait fidelity.

## Actual Failures And Sole Repair

1. **First FAIL, preserved:** existing `build_context.py` sent the frozen `label:null` to `normalized_reference` / `re.sub`, causing `TypeError: expected string or bytes-like object, got 'NoneType'`. Exit 1. The genuine null caption was not changed.
2. **Sole scratch repair:** separate `repair-01` reads the full byte-identical frozen templates directly, bypassing only the optional nearby-context selector. No source, text, tool, renderer or dependency was modified. Draft FigureSpec validator then ran once: exit 0 / PASS.
3. **Terminal FAIL:** exactly one `n-azure` image-edit request, `n:1`, `retries:0`, returned **HTTP 400 `string_above_max_length`**. Actual prompt length **33,557**, service maximum **32,000**. No PNG or generation metadata was created. No prompt shortening, second request or further repair occurred.
4. The task-local terminal-snapshot recorder also raised `FileExistsError` because its copied initial `failure.json` already existed. Its command evidence/partial snapshot is retained unchanged; a separate complete `failure-02-generation` snapshot and `terminal-failure.json` record the actual terminal error. Recorder code was not repaired or rerun.

## Commands And Checks

Existing Python: `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`.

- Initial task-local `author_pipeline.py prepare`: exit 1 at the sole `build_context.py` call; exact argv/stdout/stderr in root `context-build-command.json`.
- `repair-01/author_pipeline.py prepare`: exit 0; exact draft validator argv/result in `repair-01/draft-validation-command.json`.
- `repair-01/author_pipeline.py generate`: helper exit 1; exact request argv, prompt/source bindings, time and service error in `repair-01/generation-command.json` and `service-request-ledger.json`.
- `freeze.py`: exit 0; froze 80 existing artifacts and rechecked the specified source/full-text hashes without repeating an author gate.
- Generated-integrity check, rendered-stage validator, all six 306/640 previews, output visual checks, independent review and official `record_review`: **NOT RUN** because no image exists.

## Frozen Handoff

Root: `.tmp/s10y-image/6p/tbl-p0153-02-author`.

- `author-handoff.json`: `beced5bdfaaea82927124355889526ca2c1482597931bc2489aa48fe267a577b`
- `freeze-manifest.json`: `4d0ff23d49b1b27c7189226cc2bbf32a31fa11772a19374c2e2b9a2c8faf7002`
- `actual-call-ledger.json`: `768da16632dd08e03b4c9709d651c048d6c491de16a01d4f30cc729686a91919`
- Final draft `repair-01/tbl-p0153-02.spec.json`: `769d8ed4e0a6bea7532342085f94ccceb02a355ed0b6300f677ab50f33d488e4`
- Full context `repair-01/context.json`: `7d51a56361cb7e5cb35373127bf9195885a13f0290bb50811372333f72f6daa4`
- Full prompt `repair-01/portrait-prompt.txt`: `a10eeb818708e7de977da9d773f71f1afdb742ee00ddd28fffd0b9c411db1700`
- Terminal request evidence `repair-01/generation-command.json`: `66a5a5930e83fd0beb749f2d5262c7f53f48c449611567a7107b668a798e5a0a`
- Immutable first snapshot: `failure-01`; separate terminal snapshot: `failure-02-generation`. All individual evidence hashes are in the manifest.

## Usage And Boundaries

One Azure account-session check; one submitted image request; zero successful images; zero retries. Image model requested: `gpt-image-2`, medium, opaque, 1024x1536. Exact token usage and cost are **unknown**, not assumed zero from the rejection.

No browser was launched. No production/durable/source/app/schema/tool/dependency/DB/Git/assembly/publication changes. No independent approval or promotion. Exec session `85788` exited; no task-owned context, browser or in-flight session remains. Author work is stopped.
