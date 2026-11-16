# Modern Figure Author Freeze: 110–112

2026-11-15. Ticket STEMROBIN-180. All three are **frozen author-ready, independent review pending**. Not approved, not promoted, no official substantive review record. Main owns the sole full independent source/full-text/306/640 review. No further author edits or checks are in progress.

## Exact Frozen Roots

| Figure | Frozen scratch root | Repairs used |
| --- | --- | --- |
| 110 | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-110-author` | 0/1 |
| 111 | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-111-author` | 1/1, exhausted |
| 112 | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-112-author` | 0/1 |

Each root contains `spec.json`, `fig-N.svg`, author snapshot `fig-N.png`, `render.json`, full `context.json`, `source-inventory.md`, `geometry-provenance.json`, `author-notes.md`, actual six `preview-{306|640}-{neutral|accent|print}.png`, two unscaled `preview-sheet-{306|640}.png`, `preview-evidence.json`, `author-pixel-evidence.json`, exact `command-ledger.json`, `author-handoff.json`, `freeze-manifest.json` and independent copies of the author scratch tools. The manifest inventories every frozen file with absolute path, byte count and measured SHA-256; no durable resource depends on scratch.

## Frozen Hashes

| Figure | author-handoff.json SHA-256 | freeze-manifest.json SHA-256 |
| --- | --- | --- |
| 110 | c99421a8109020a16332443b69d4b6172dd0dbf46abfa2eac4c9eaea3ee997e5 | 4e062c0ad57356608d319447af05fe84d0841bc2c47b20a03ca512a9d2fa74d9 |
| 111 | 55bcf6a3781de9b4bbfbd78c5fad1ca6b30723aa191d47363e7e445fe65d2801 | 92c1c8a4b194a6f73e6929c0e35217d1a22eedb8c5f7791cc85d93a918f707fe |
| 112 | be224d5d38b04c86859d1935868f89811aaad9ad68ea1f77b6555c12cfe4a096 | 367e4a769b7bab27309e946e2d8f0dd5ef204bb7f4582d074864d477cd067575 |

| Figure | spec.json SHA-256 | SVG SHA-256 |
| --- | --- | --- |
| 110 | c573523324c4d6e581fd52084b2e6639ea6bb35f402f8766d78edb98f827db8d | 57554e3adb175076dc6ae7bd6a37d1a49ea7bd2c910310f7ff06b7965dd70a72 |
| 111 | 4e77d401a2919f6d6aab686193e54cd0b5a40447284e16f3e5dce02b1b309d59 | 5821ccc2b08d0af6cea7d3a9c9fff8864caca340ee662ece25cdec98af6dfb62 |
| 112 | 27205559a7c01060c7c7cb5422fd733fafadd6ed2bbbb3a879cfbe292a5426f9 | 0ec65ebcf574938db68e2d677f8a3aff4551faa66e736e3bcc8fd130a19c7ee9 |

Original PNG hashes remain 110 `548846db3beb89c382fb1dfa0c3e04b65c6f5e4f22704c873e19c708833a9768`; 111 `dcaad029275b118366eecb41b16217e97a862daf24a58c4b016782a3a2d22edc`; 112 `43250c2de718983c669a1bd03a56e70c757b82cbc19d83321a99e7bac306b184`.

## Author Results And Source Relationships

All three use the least-generative **deterministic** route, declared before service use. All source PNGs independently opened and complete pixel inventories recorded before spec construction. Complete frozen s5 and s6 prose plus all 12 prompts copied into each context/spec; raw embedded snapshots match the approved durable cohort. No key/answer/solver/choice/history read.

110 retains one vessel/headspace, paired aa/bb/cc/dd, eight letters, only numbers 1/2, water continuing below dd and symbolic short-stroke rows 4/5/5/6. Horizontal plane bindings, parallelism and numeral containment are asserted. Source row counts are independently derived from mapped row objects; not misrepresented by a grid or the official global-type `objectCount`.

111 distinguishes a rounded downward bottom membrane in a from a flat horizontal immersed bottom membrane in b. The original up-arrow is inside above it, down-arrow outside below it. Explicit shared waterline in b is declared modern-prose-backed regularization, not an uninterrupted original line. 112 retains the closed bottom and connected low right side port; a membrane bulges right, b membrane is flat vertical, with original left/right arrows. No invented dimensions, pressure values, scales, units or answer annotations.

Final existing draft/render/author six-view/pixel evidence statuses are PASS for all three, **not independent approval**. Actual 306px screen-transform font minimum is **18.16875px**, 640px is **38px**. Each actual six-view screenshot was inspected through the two no-resampling theme sheets. Semantic shafts/head/membranes remain visible after fill paths; exact `connects` endpoints are supplemented by real layer rectangles, dark shaft-pixel samples and actual viewing.

## Preserved First Failure And Sole Repair

111 first author preview FAIL is retained unchanged at
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-111-author/failure-01-preview`.
It contains first spec/context/inventory/render/all six actual screenshots/logs and immutable `snapshot-sha256.json`. The first harness remains `first-failure-preview-harness.mjs`.

First official render had passed; first author preview rejected its overly broad later-opaque-path check, including nonintersecting/self arrowheads. Full-width actual inspection also found doubled native/raw heads. Sole repair: two logical source arrows become supported segments with unchanged endpoints/assertions, keeping one deterministic visible head each; scratch preview checks only later intersecting opaque paths and excludes a mirror's own head. No renderer/schema/stable-tool edit or threshold relaxation. Final second result passed; repair 1/1 exhausted. 112 adopted this single-head construction before its first render, without a replay. Neither 110 nor 112 had a failure.

## Actual Commands, Calls And Stop State

Existing Python: `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`, with `-B`. Scratch `prepare-context.py N` called existing `build_context.py --book 6p --edition modern-us-neutral --figure fig-N --root <own-context-root> --output <own-context-nearby.json>` once per figure. Scratch `author-specs.py N` constructed fresh specs.

Scratch `run-stage.py N validate|render|preview` records full argv/cwd/time/status/spec hash/stdout/stderr. Validation used existing `validate_spec.py <spec> --stage draft --json`; rendering used existing `render_spec.mjs --spec <spec> --svg <SVG> --png <snapshot> --report <render.json>`. The renderer itself validates the current spec before rendering. `preview-sheets.py N` composed actual images with PIL/numpy, without resampling.

Actual explicit validation calls: 110 one, 111 two, 112 one. Official renderer calls: 110 one, 111 two, 112 one. Author preview headless calls: 110 one, 111 two, 112 one, producing 24 actual screenshots including 111's six retained first-failure views; final set has 18. All 24 task-owned preview contexts and all task-owned browsers closed. Existing headless launch only; PWDEBUG unset, HTML auto-open disabled, network blocked in previews, no user profile/CDP/visible/OS interaction.

Azure image calls **0**, other image-model calls **0**, service retries **0**, cost **0**. No services, DB/publication, app/schema/dependency/Git, durable edition/source/index, assembly/finalize, self-review approval or promotion.

The separate s5 historical-identity candidate does not change prose or these figure bytes/context hashes. Original frozen text/handoffs and first text REVISE remain intact; its separate report is `modern-text-author-c4-s5-history-repair.md`. No geometry rerender or source inventory repetition for that metadata-only repair.

On main's freeze request only author notes/hash/manifest bookkeeping completed; no author gate replay. All three authored directories now frozen. **In-flight task-owned sessions: 0.** Stop and await main's independent review; no new assignment taken.
