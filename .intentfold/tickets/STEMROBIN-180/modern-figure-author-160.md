# Figure160 author freeze: ready for Ramanujan independent review

Status: **AUTHOR READY, not independent PASS**. Only fig160 authored. No self-review, promotion, durable/source/text changes, finalization, DB, Git, dependency or app operations.

## Frozen Handoff

Root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-160-author`.

| Artifact | SHA256 |
| --- | --- |
| [author-handoff.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-160-author/author-handoff.json) | `24404243019cc0ae06a78455837d9e46e2c2184704d9926ce2f4dcd8df7bdb80` |
| [spec.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-160-author/spec.json) | `0f52a1fadf5dbd69430763e5a00833f8ab3926e4317b122cde96e79ff8f19fad` |
| [fig-160.svg](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-160-author/fig-160.svg) | `d9c84611c5072befb041ef3b7614cb232825e47cf77e38fc6f5c575096c775af` |
| [fig-160.render.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-160-author/fig-160.render.json) | `0125e4c670aac9c2adb5e4c8c6cb339fa172fc91098d16a758c647576ce24da0` |
| [call-ledger.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-160-author/call-ledger.json) | `7b53d25db11112ed5289826cc6ff14f96c19632424e8811a4e4feb865e2c74b3` |
| [frozen-manifest.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-160-author/frozen-manifest.json) | `6f7212ea3227187de0a506cec89a7f208f4478555f0a239e2d191f159605f4c1` |

The manifest binds all existing author files, current outputs, frozen text, interpreter HTML, nine viewed screenshots and immutable rejection files. The handoff binds current output/evidence plus the manifest. Initial build provenance deliberately remains the pre-repair record, not a claim about the repaired spec.

## Source And Text

Actual durable [original160](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-160.png) reopened individually before [inventory](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-160-author/source-inventory.md) and spec. Original SHA256: `e7952f5be3810bc82f0aa2e268043e63045dcd0cc84f9d6a0480ffabb251afdf`.

Full approved upper s15 read: all5 blocks including caption, all6 prompts, source refs and original label owners. Unchanged text bindings:

- Lesson: `f3bd371a5328cf9743dd0cf5b4aa64d6a69945ccb6a4c6e5b9e156b73b3386e3`.
- Exercises: `c25d68eeba92d2051b6050c84751f680eea9a2caacf1e9ef5128d06959ff3060`.
- Full templates retained byte-for-byte in `frozen-text/`; complete upper objects and authoritativeText retained in `context.json`.

Deterministic route,113 objects/76 standard endpoint assertions. a retains piston1, piston valve2 and bottom valve2, upstroke/flow arrows, bridge/rod/lever/pivot/support, water on both piston sides, open submerged intake, side outlet and falling stream. b retains solid piston1 without a piston valve, closed suction2, separate bent delivery/open valve3, chamber4 air/water separation, submerged riser inlet, sealed dome/riser relation, complete downturned outlet, downstroke/flow arrows and handle5/pivot/support. Normalized a/b and semantic water fill are declared drawing modernizations, not added measurements.

## Actual Commands And Results

CWD: `/Users/yong/.codex/worktrees/0f12/lemmadeck`. Commands below are the actual shell invocations, not proposed gates:

```text
node .tmp/s10y-image/6p/fig-160-author/build-spec.mjs
  exit0; candidate built after inventory, no gate.
node .tmp/s10y-image/6p/fig-160-author/render-offline.mjs
  exit1; literal short-arrow marker aspect-ratio failure.
node .tmp/s10y-image/6p/fig-160-author/preserve-first.mjs
  exit0; original15 files preserved, including frozen text.
node .tmp/s10y-image/6p/fig-160-author/repair-01.mjs
  exit0; sole repair registered, exact spec difference recorded.
node .tmp/s10y-image/6p/fig-160-author/run-step.mjs 02-render-repaired render-offline.mjs
  exit0; canonical renderer PASS,113 objects/10 labels/no collisions.
node .tmp/s10y-image/6p/fig-160-author/run-step.mjs 03-functional check-functional.mjs
  exit0;149 executable author functional/port/identity checks.
node .tmp/s10y-image/6p/fig-160-author/run-step.mjs 04-interpreter-preview preview.mjs
  exit0; existing lesson interpreter,12 actual surface/width/theme measurements.
node .tmp/s10y-image/6p/fig-160-author/freeze.mjs
  exit0; hashes/evidence frozen, no gate rerun.
```

Renderer wrapper invokes unchanged canonical `render_spec.mjs`; its existing validator runs once per renderer attempt: **2 renderer attempts/2 internal validator invocations total**. No extra standalone validator. Interpreter child command/output/hash are recorded in `interpreter-command.json`; no finalize or reviewed validator was run.

## Actual Preview Evidence

All six `preview-{306,640}-{neutral,accent,print}.png` and three `scroll-end-306-{neutral,accent,print}.png` were opened individually after rendering. [Author observations](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-160-author/author-observation.md) describe the observed apparatus; these are not independent approvals.

The existing lesson interpreter generated both complete text and exercises HTML. Scroll media actually measures640px in306/640 lesson columns; the exercise column is naturally narrower and separately measured. All10 labels measure22px. Both scroll ends reach the complete apparatus; no hidden right outlet/number/handle or clipped reservoir. Semantic neutral/accent/print roles remain readable. Deterministic only, no hybrid layers to inspect.

Final browser evidence: existing canonical renderer and existing app Playwright, isolated headless, every request aborted, zero requests, task browsers closed; no OS input, user profile, CDP, visible fallback, Inspector or auto-open report.

## Failure And Call Budget

First actual failure: `Unsupported arrow marker aspect ratio: ld-fig-160_ld-b-delivery-flow-upTriangleEnd1`. [failure-01/manifest.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-160-author/failure-01/manifest.json) retains original spec/context/inventory/scripts/text and literal rejection. No SVG or render report existed because the renderer threw before emitting them. The first early zero-launch metadata is retained and explicitly described as premature, not reused.

**Sole repair used1/1, remaining0**: only the same upward delivery-flow arrow's drawing length and matching endpoint assertion changed (screen coordinates `[550,431]→[550,418]` became `[550,440]→[550,410]`). No source measurement or direction changed; all other spec fields/objects/assertions stayed byte-equivalent as structured data. Auxiliary browser-metadata timing fixed in the same repair so evidence is written after canonical async completion. Exact diff and before/after hashes: `repair-01.json`.

Actual image-generation calls0, external-model calls0, service retries0. No synthetic generation metadata. One functional command and one preview command; no duplicate final gates.

Ready for Ramanujan's substantive independent review. If an essential defect is found after this freeze, fig160 is BLOCKED with no further repair. No fig161 work started.
