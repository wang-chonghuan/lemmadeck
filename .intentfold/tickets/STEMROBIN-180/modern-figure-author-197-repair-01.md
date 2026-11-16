# Modern Figure197 Sole Repair Author Report

Ticket: STEMROBIN-180. Finding: F197-1. Role: author only.
Final author status: **BLOCKED**, repair1/1 exhausted, no independent approval.

## Preservation And Exact Scope

The original author freeze `111537e8769b6a6cf8038809a78e8d86ef82b0ee9d8c9fd59c511369749c07d7`
and Sagan FIRST FAIL/reviewer handoff
`16e1529e559b3e9c1e821224dc9f5336e1cfe09c41f5b5b1a324e92f17c8a66c`
remain unchanged. Their manifest-owned files and review evidence are
copied under `first-failure/`. The s12 choice original handoff remains
unchanged. `preservation.json` binds protected original bytes.

Only the unsupported intermediate wheel's three paths and related
source-fact descriptions were removed/corrected. All 48 retained object
dictionaries/order/coordinates and all 17 assertions are unchanged.
No new hidden wheel or three-wheel physical-cart assertion was introduced.
The complete approved s10 context and original PNG are reused unchanged.
No source solution, answer, key or choice content was input to the figure.

## Actual Calls

Existing interpreter:
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`.
Root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-197-author/repair-01`.

Executed `repair_tools.py snapshot`, `bind`, `render`, `preview`, and
`pixels`, each once. Render invokes the stable `render_spec.mjs` with
the existing original `network-off.mjs` preload and `--spec`, `--svg`,
`--png`, `--report` paths in the repair root. Preview uses the copied
isolated headless script with only its relative imports/root adjusted.
Exact argv, stdout/stderr, exit and before/after tool hashes are in
`ledger/01-sole-canonical-render.json` and
`ledger/02-sole-six-native-themes.json`.

Canonical render: one call exit0, internal draft validation PASS,
48 objects, 0 labels, no collision. Native preview: one call exit0,
all six sample media/font/bounds checks PASS, no network requests,
all own contexts closed. New explicit validator/context/service/
record_review/promotion calls:0. Automatic retries:0.

## Affected Evidence And Failure

Actually viewed both native unscaled affected before/after three-theme
sheets at 306 and 640. The added intermediate wheel is absent and the
wound axle and its true endpoint wheels are readable.

Exact pixel comparison is not fully successful. Outside the fixed640
envelope `[186,832,240,889]` (scaled306 envelope `[88,397,115,426]`),
five samples are identical. Print306 has one pixel at `(213,379)`:
RGB183 becomes RGB184. The cause is not established. It remains a
reported failure, with no threshold relaxation or further rendering.
Full facts and every current sample hash are in
`affected-pixel-evidence.json`; the failed repaired candidate and
evidence are preserved under `failure-02/`.

The remaining label checks are not a claim of a measured16px font:
there are no source-required labels and the measured minimum is null.
No unchanged full-apparatus source/visual gate was rerun.

## Freeze Boundary

Original author, FIRST FAIL, full text/source and s12 choice freezes are
unchanged. No stable renderer/tool/app/dependency/canonical/DB/Git/service
or publication writes occurred. Repair budget is1/1 including mechanics;
no opportunity for another author repair remains. Current bytes are
frozen BLOCKED, for main's disposition, not self-approved or promoted.
Service/image tokens and cost:0. Agent token usage is not independently
measured. No in-flight tool session remains.

## Exact Sole Repair Freeze

```json
{
  "figure": "fig-197",
  "finding": "F197-1",
  "role": "author_not_independent_reviewer",
  "status": "blocked",
  "repair_budget": {
    "maximum": 1,
    "used": 1,
    "includes_mechanics": true,
    "remaining": 0
  },
  "original_author_freeze": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-197-author/author-handoff.json",
    "bytes": 3682,
    "sha256": "111537e8769b6a6cf8038809a78e8d86ef82b0ee9d8c9fd59c511369749c07d7"
  },
  "preserved_first_independent_FAIL": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-197-author/independent-review-sagan.md",
    "bytes": 8076,
    "sha256": "37cb42df94d72fd8021693aff7e4bab61a102ff89d560e223e481eabfb9681fa"
  },
  "original_reviewer_handoff": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-197-review-sagan/reviewer-handoff.json",
    "bytes": 3323,
    "sha256": "16e1529e559b3e9c1e821224dc9f5336e1cfe09c41f5b5b1a324e92f17c8a66c"
  },
  "removed_objects": [
    "wheel-far-left-occluded",
    "wheel-far-left-occluded-hub",
    "wheel-far-left-occluded-inner"
  ],
  "current_outputs": {
    "fig-197.spec.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-197-author/repair-01/fig-197.spec.json",
      "bytes": 27457,
      "sha256": "86e3ef8c9584337eede76f6e00398e99211a2d414fae48ad554afd794f5fb929"
    },
    "fig-197.svg": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-197-author/repair-01/fig-197.svg",
      "bytes": 28750,
      "sha256": "d7c4cb776518833d73336d94ff81c77f88b6fc1fac651ce59f3f2d93c3e167f8"
    },
    "fig-197.render.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-197-author/repair-01/fig-197.render.json",
      "bytes": 1083,
      "sha256": "f5e5e65536984a6e806dd749a2f0874d01f9eeb25cb0561787099f21ef7ce081"
    },
    "author-preview-report.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-197-author/repair-01/author-preview-report.json",
      "bytes": 4035,
      "sha256": "1156beb730724b5f778078564a6295a0076b7f0ddd7fbd9f127691fb97cfa69c"
    },
    "affected-pixel-evidence.json": {
      "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-197-author/repair-01/affected-pixel-evidence.json",
      "bytes": 6052,
      "sha256": "329e91df4d92c0c80171fc26472e847123a8a6ddbd065e2b9234d29c194022fb"
    }
  },
  "context": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-197-author/repair-01/context.json",
    "bytes": 35826,
    "sha256": "47ed6ca9505a18734109be35f29ee643ac251218787e6a544d612b3a9b28857b"
  },
  "diff": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-197-author/repair-01/repair-diff.json",
    "bytes": 1166,
    "sha256": "fcfc1b313885c5b8ce0dccfe2b9901fece09e0e8f8a8496b8620c2a2cb01b5a6"
  },
  "source": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-197.png",
    "bytes": 5352,
    "sha256": "208c08a429e081f08c33eeb20dee50b31ebe7a5cfb002ca2d747643d3e6c2520",
    "width": 256,
    "height": 493
  },
  "original_author_and_s12_choice_bytes_unchanged": true,
  "calls": {
    "build_context": 0,
    "explicit_validator": 0,
    "canonical_render": 1,
    "renderer_internal_validation": 1,
    "native_six_theme_preview": 1,
    "new_service": 0,
    "record_review": 0,
    "automatic_retry": 0
  },
  "independent_approval": false,
  "promotion": false,
  "image_service_cost_usd": 0,
  "token_usage": "Agent token usage not independently measured",
  "inflight_sessions": []
}
```
