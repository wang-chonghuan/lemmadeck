# 7p Fig222 Author Freeze

Status: author candidate only, awaiting FIRST independent source/visual review.
No independent PASS, official review, promotion, retention or lesson approval is claimed.

## Scope And Authority

- Own root: `.tmp/s10y-image/7p/fig-222-author/`.
- Complete Feynman FIRST n88 TEXT approval is read from
  `.tmp/ld-s10y-lesson/text-review-7p-n88/reviewer-handoff.json`.
- Approved author context SHA:
  `9b85e677f1b373a9f359dec29ca73e9dbd76a9e74efc2ddaaa4fbfb631915cd5`.
- All 10 modern entries, eight complete modern/raw tasks, original full lesson
  Markdown and raw JSON, 17 actual paragraphs, and three existing anchors
  resolving to 6/10/15 were consumed. No text/source/flow gates were repeated.
- `source.authoritativeText` contains the 17 nonempty modern text targets:
  eight paragraph blocks, one caption and all eight complete prompts. The empty
  figure block remains in the complete context snapshot, not a fabricated text.
- Ten input byte snapshots include the exact context, both author/reviewer
  handoffs, three templates, three canonical raw files and actual original222.
- No answer, source-answer, choice, private solution or other figure inputs.

## Source-First Observation

Actual full original PNG opened before artwork/spec:
`ssot-resources/soviet10year-textbooks/artifacts/7p/figures/fig-222.png`.
935x272, SHA
`04ee762bbfa3ac15b465ccce296fc43635a96085ba6c1f850fa5bfc3519e5b6b`.

The inventory has six source groups, each mapped to current objects/assertions:

1. Exactly seven incoming arrows from the left, all pointing toward the black
   flask side. Unequal source lengths do not specify powers or calibrated gaps.
2. One complete round bulb with slightly flat bottom; left half soot-black,
   right half clear, full central neck, no flask liquid level.
3. One seated stopper and a narrow continuous through-stopper tube. The tube
   enters the neck air space, rises and turns right at a right angle.
4. One small colored liquid plug inside the horizontal tube, not a measured
   temperature or a fabricated displacement.
5. Source attached rectangular scale/backing and its two paired short end
   details. No readable source digits/units; no invented numbered graduations.
6. Full tube continuation beyond the scale with the far-right terminal contour
   wholly inside the frame. It is not an invented valve or sealed reservoir.

No source heat block is drawn. The original approximately-one-metre statement
is preserved only in the full approved prose; no apparatus dimension line is
added. This is the textbook thermoscope, not a calibrated thermometer.

## Route And Construction

Hybrid: one natural glass/soot/cork raster beneath the deterministic JSXGraph
overlay. Generated artwork deliberately omits tubes, rays, scale, plug and labels.
Those counts, connections and source end details are authored in the overlay.

Actual complete initial generated PNG was opened. It has one full bulb,
vertical half-coating, clear right half, complete neck, seated cork and full
bottom. No cropped edge, liquid fill, extra apparatus, labels or numbers.
The image anchor is lower-left `[130,55]`, contain box `[240,360]`;
the intrinsic 2:3 aspect ratio is preserved. The rendered artwork layer was also
actually opened, separately from the original generation.

The current spec has 23 objects, 26 assertions, six inventory groups and three
English labels: Radiation, Liquid plug, Thermoscope. Label font is 36 source
pixels; at actual 306/640 media widths it is 17.2125/36px.
Meaningful segments/arrows each have connects assertions; tube walls have
parallel/right-angle assertions; the liquid plug centre and all four corners
are asserted inside its horizontal channel.
These assertions do not pretend to mechanically prove the natural bulb/soot
semantics. The source-first semantic observations remain an independent-review
obligation.

The complete overlay SVG was read separately: no artwork image is embedded,
seven materialized arrowheads, full tube/scale/plug geometry and three English
labels. Hidden JSXGraph construction nodes are not visible source marks.
No raw SVG was hand-edited. All visible vector colors use semantic CSS roles.

## Cost And Actual Calls

Current Azure public price page read once on 2026-11-16 with isolated headless
`cloak-fetch`, status200/exit0, then closed. GPT-Image-2 Global token rates
used in the preflight: input text $5/M, input image $8/M, output image $30/M.
This is public estimated pricing, not a measured invoice.

Before the actual request, frozen preflight reserved:
10,000 text + 400,000 reference-image + 10,000 output-image tokens.
`10000*5/1e6 + 400000*8/1e6 + 10000*30/1e6 = $3.55 < $5`.
Original has 254,320 pixels. The token budgets are conservative planning
allowances, not returned encoding measurements or an API-enforced billing cap.

One actual Azure image-edit request: gpt-image-2, medium, 1024x1536, opaque,
one original reference, n=1, retries=0; exit0, exactly one returned PNG.
Generation metadata records endpoint/model/auth method/request/reference and
output hashes, but the existing helper does not retain usage or billing.
Actual billed USD and usage tokens therefore remain null, not invented.
No second model call, no new service or installation.

## Commands And Results

All paths below are relative to the owned workspace. Full argv, timestamps,
stdout/stderr byte hashes and tool epochs are in `*.execution.json`.

1. `node .../prepare-inputs.mjs`: exit0; ten original-byte snapshots.
2. `node .../cost-preflight.mjs`: exit0; $3.55 planned allowance.
3. `node .../run-stage.mjs azure-session az account show --query
   '{state:state,environmentName:environmentName}' --output json`: exit0.
4. `node .../run-stage.mjs generation SHARED_PY -B
   /Users/yong/.agents/skills/n-azure/scripts/generate_image.py
   --prompt-file OWN/artwork-prompt.txt --reference-image ORIGINAL222
   --output OWN/artwork-opaque.png
   --endpoint https://finleyswedencentralinstance.openai.azure.com
   --model gpt-image-2 --size 1024x1536 --quality medium --background opaque
   --retries 0`: exit0, one successful request.
5. `node .../build-spec.mjs`: exit0; 23 objects / 26 assertions.
6. `node .../run-stage.mjs validate SHARED_PY -B
   .agents/skills/ld-s10y-image/scripts/validate_spec.py OWN/fig-222.spec.json
   --stage draft`: exit0, FIRST explicit canonical validation only.
7. `node .../run-stage.mjs render node --import OWN/network-off.mjs
   .agents/skills/ld-s10y-image/scripts/render_spec.mjs
   --spec OWN/fig-222.spec.json --svg OWN/fig-222.svg
   --report OWN/fig-222.render.json --artwork OWN/fig-222.artwork.png`:
   exit0, render status pass, collisions0, contain-fit pass.
8. `node .../run-stage.mjs native node OWN/preview.mjs`: exit0, six samples,
   all mechanical statuses pass, external requests0, browserClosed=true.
9. `node OWN/freeze.mjs`: byte-binding handoff, not another figure/text gate.

SHARED_PY is
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`,
always `PYTHONDONTWRITEBYTECODE=1` / `-B`.

## Actual Native Observation

All six existing complete samples actually opened, each captured once:
306-neutral, 306-accent, 306-print, 640-neutral, 640-accent, 640-print.
Exact paths and hashes are frozen in native-preview/observations/manifest.

Each shows the full flask/neck/cork/bottom, seven separate arrowheads, the
through-stopper two-wall tube and right-angle connection, source backing/end
details, the plug within the horizontal channel and complete far-right end.
English labels fit without collisions or clipped edges at both actual widths.
Accent changes vector ray/plug color, not source facts; neutral/print preserve
contrast. Layer placement is coherent with the separate rendered artwork and
overlay. No pressure/temperature/displacement data, operating instructions,
answer annotations, Cyrillic or cultural symbols.

Layout is inline at max640, so scroll-end checks are inapplicable, not omitted.
Every preview uses a new offline context, existing Chromium, no user profile,
CDP, desktop focus or server. Browser closed. No active execution sessions.

## Failure And Boundary

Figure222 repair budget remains 0/1; FIRST failures0; no repair was needed.
Do not confuse this new figure allowance with any older exhausted unit.
242 remains permanently BLOCKED, restored tool unchanged; its two failed new
regression files were archived as original bytes under the separate additive
archival-handoff. No242 check, finalize, repair or review was performed here.

FIRST independent source/geometry/semantic/full-native review remains pending.
No official record_review, promotion, canonical edit, lesson finalize, source
change, database operation, Git command, dependency or stable-tool change.
Only this exact author freeze is handed off; not complete n88 approval and not
a safety certification or child experiment recommendation.
