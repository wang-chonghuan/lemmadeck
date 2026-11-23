# N59 exercise 992 authored measurement figure

Role: author report only. Independent affected-figure and affected-question review is pending.
No `ld-s10y-image/review@1` approval was created. Mechanical PASS and author observations
are not an independent approval or authorization to publish.

## Scope and provenance

All shell commands used workdir:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.
All created/changed files are inside:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/stemrobin-187/n59/choice-figures/`.

Original exercise 992 has no figure. Its complete written task is:
`画一个四边形，量出每个角的大小。`

The new ID is `fig-choice-4m-992-measure`. The deterministic spec uses only
`source.authoredBasis`, with no `source.image`, invented scan, or claimed reconstructed
drawing. `authoritativeText` contains the complete original task and a separately identified
authored selected-quadrilateral measurement basis.

This selects one new shape for the choice task. The affected question must measure the
actual pictured angles at the named vertices, not screen lists for an angle sum.
The question, options, answer records, manifests, and lesson were not edited or reviewed here.

Read the image skill, routing, FigureSpec, and quality-gate references and the repository
entry/charter routing. No DB or `.env` access, external service, network request, model call,
paid service, install, publishing, Git command/edit, branch/worktree/chat/timer creation,
or original223 image reopening/review occurred. Existing edits and staging were not touched.
This bounded offline author task did not invoke an IntentFold capability or live backend.

## Geometry

Let `r=sqrt(3)` and `t=7/(1+r)`. The selected vertices, in order, are:

- `A=(0,0)`.
- `B=(5,0)`.
- `C=(5,2)`.
- `D=(t,r*t)=(2.562177826491071,4.43782217350893)`.

Since `t+r*t=7`, `CD=(-q,q)`, where `q=5-t>0`. Also `AD=(t,r*t)`.
At each vertex, `u=previous-vertex` and `v=next-vertex`. These adjacent vectors
give the following normalized dot products:

| Vertex | `dot(u,v)/(|u||v|)` | Interior angle |
| --- | --- | --- |
| A | `1/2` | 60 degrees |
| B | `0` | 90 degrees |
| C | `-1/sqrt(2)` | 135 degrees |
| D | `(sqrt(6)-sqrt(2))/4` | 75 degrees |

All four `cross(u,v)` values are strictly negative, confirming the local convex
interior-angle branch for counterclockwise A-B-C-D. The focused check separately evaluates
`acos(dot/(|u||v|))` and `atan2(abs(cross),dot)` at every vertex, checks the exact-basis
coordinate evaluations, and measures every angle again from the rendered SVG line endpoints.
It does not use an angle-sum list to identify the answer.

Actual results:

| Vertex | Dot/acos degrees | Cross/dot atan2 degrees | SVG endpoint degrees |
| --- | --- | --- | --- |
| A | 60.00000000000001 | 59.99999999999999 | 59.99999999999999 |
| B | 90 | 90 | 90 |
| C | 135 | 135 | 135 |
| D | 75.00000000000001 | 75.00000000000001 | 75.00000000000001 |

The spec maps all four visible letters and each semantic edge through source-inventory
groups to executable displacement/connects assertions, plus AB/BC perpendicularity.
The local check binds each visible letter anchor to its exact hidden construction vertex.
Hidden construction points suppress the otherwise visible round point markers.

## Actual execution

Commands below ran once per stated stage. Exact arguments, cwd, timestamps, exit code,
stdout and stderr are retained in the named command receipts/logs in the owned directory.

1. `node .tmp/stemrobin-187/n59/choice-figures/run.mjs`
   launched the existing draft validator, then the existing renderer, then the local check.
   Overall exit was **1**, because of the real local-check FIRST failure described below.
2. Draft validation: **exit 0**, `status: pass`, `errors: []`.
   Receipt: `validation-FIRST.command.json`; output: `validation-FIRST.stdout.txt`.
3. Existing JSXGraph render: **exit 0**,
   `PASS: fig-choice-4m-992-measure (12 objects, 4 labels)`.
   Receipt: `render-FIRST.command.json`; output: `render-FIRST.stdout.txt`.
   JSXGraph version: `1.13.1`; report status `pass`; zero collisions.
4. Initial focused check: **exit 1**, `AssertionError: missing edge-AB`.
   Receipt/logs: `check-FIRST.command.json`, `check-FIRST.stdout.txt`,
   `check-FIRST.stderr.txt`; original failing code: `check-FIRST-source.mjs`.
5. `node .tmp/stemrobin-187/n59/choice-figures/run-check-repair1.mjs`:
   **exit 0**. Receipt/logs: `check-REPAIR1.command.json`,
   `check-REPAIR1.stdout.txt`, `check-REPAIR1.stderr.txt`.
   Bound results: `check-REPAIR1.json`.

There was exactly one explicit draft-validation invocation and one renderer invocation.
The unchanged existing renderer also invokes the draft validator internally as its own
precondition; that built-in invocation was not removed or bypassed.
No renderer rerun, spec change, or SVG/PNG hand edit occurred.

The initial check assumed DOM ID `ld-edge-AB`. The rendered line actually has the existing
JSXGraph board prefix: `ld-fig-choice-4m-992-measure_ld-edge-AB`.
Inspection of all four actual line elements showed the requested coordinates, so the repair
only corrected that check locator and changed the check evidence output to `check-REPAIR1.json`.
FIRST failure logs and the original failing check source remain intact. No mathematical,
display, renderer, schema, or general-validator repair was needed.

Read-only preflight file enumerations also returned exit 2 when this not-yet-created output
directory and a nonexistent lesson `scripts/` directory were named. They did not run a
figure gate or change any files.

## Display and actual image inspection

Canvas: `640x600`, bbox `[-0.7,5.3,5.7,-0.7]`, spans `6.4x6.0`.
Scale: exactly `100px/unit` for both x and y. `keepAspectRatio: true`.
Display: instructional, scroll, width `[640]`, `minTextPx:16`, no `maxWidthPx`.

The separate mechanical screen-transform measurement on the final SVG at CSS width 640
was the identity matrix: `a=d=1`, `b=c=e=f=0`, DPR 1, width 640, height 600.
Its actual screen vertices were A `(70,530)`, B `(570,530)`, C `(570,330)`,
D `(326.2177826491071,86.21778264910705)`.
Every expected visible edge was found, with matching endpoints and stroke width 3px.
Only four visible line elements and four visible text elements remained; there was no extra
visible geometry. All label fonts measured 24px, and every label footprint and outline
endpoint was inside the full canvas. The scroll wrapper reached its end.
This is the focused offline SVG surface, not an assembled lesson or live product claim.

The renderer's single PNG is both the full-canvas preview and normal640 preview:
its intrinsic raster dimensions and the normal CSS presentation are both exactly `640x600`.
No second screenshot or reopen was needed.

Loaded this PNG **once** with `view_image`. Actual full-boundary observations:
the A-B-C-D outline is closed, all four sides and corners are present and uncropped,
the background is white rather than broken/black, and A/B/C/D are distinct and readable
outside the adjacent lines. The image visibly contains only the outline and these English
letters. No coordinates, angle values, right-angle corners, slope marks, lengths,
protractor/answer hints, axes, grid, or cultural text/symbols appear.

Image usage: **1 loaded image total**, one batch of 1; source images 0, crops 0,
reopens 0. Limit 2 respected; batch <=8 and cumulative <=24 respected.
The browser scripts read SVG DOM and did not load image payloads into the author context.

## Bound paths and SHA-256

Every basename below resolves in the absolute owned directory given under Scope.

| File | SHA-256 |
| --- | --- |
| `fig-choice-4m-992-measure.spec.json` | `1d2a1ea9b4954ce07f7d0539e923bb5a0d50a78e7b43aa9f9e235db01c305ba8` |
| `fig-choice-4m-992-measure.svg` | `b2f409245c84524c838bc1e46ab480b8edba36b6a8f1c015b9f69d7950f7049b` |
| `fig-choice-4m-992-measure.render.json` | `0357e551950e5f46c7f0a51dd7c00e5e370cdc3d8774978a771ae7ff1ec53349` |
| `fig-choice-4m-992-measure.full-normal640.png` | `aeb15f48bacb1f6997d638f774c15681461d94a4c7dceee7b03f8a256793de98` |
| `check.mjs` | `aa0cdfe91091c0484e076306b1a343d8afd85ed8e099656eaa286bedb65659dc` |
| `check-FIRST-source.mjs` | `02b41f0b1014907cbf6811b311ec75926f7036f00e7cd92bb21ecad676c27075` |
| `check-REPAIR1.json` | `253c2766832c9f1bfd803120d5b8c52497d94eb09825bd80efa477052860473f` |

The render report hashes the spec and SVG; `check-REPAIR1.json` separately hashes the
spec, SVG, render report and PNG and records their absolute paths.
The FIRST receipts use exclusive creation and the initial runner refuses to replay them.

## Handoff

Current render/spec/evidence paths are intentionally ticket-temporary, not promoted durable paths.
The parent owns durable-path settlement and subsequent binding of final review evidence.
Keep the final SVG, spec, and mathematics unchanged for the fresh independent reviewer.
An unchanged output can reuse this execution evidence; byte equality alone is not approval.
The independent reviewer still needs substantive affected-figure and affected-question review,
including the actual selected-shape measurement wording and options after the parent settles
the durable paths. No broader lesson review, original223 review, or publication was performed.
