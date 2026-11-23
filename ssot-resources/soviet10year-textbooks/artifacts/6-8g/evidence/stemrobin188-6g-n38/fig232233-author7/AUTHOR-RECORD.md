# Figure 232/233 author record

Date: 2026-11-23. Ticket: STEMROBIN-188 ACTIVE, offline, finish=review.
Status: AUTHOR_ONLY; HOLD_UNRESOLVED_SOURCE. Author work complete as bounded
candidates. Independent review NOT PERFORMED. No promotion or publication.

Sole cwd:
/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188

Sole ownedroot:
/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/.intentfold/tickets/STEMROBIN-188/tmp/n38-fig232233-author7

The direct bounded offline assignment governs this subtask. The installed
ld-s10y-image routing/spec/gate and production-resume were read. No IntentFold
capability, bootstrap, freshness update or backend action was invoked. The
ticket.json's older checkout is not used in place of the direct sole cwd.
No answers, choices, other author or review directories were read.
No DB/env/Git/app/shared-tool edits, installs, new agents, messages or timers.

## Source-first provenance

SOURCE-INVENTORY.md was written and chmod 0444 before either draft was created.
Its sealed SHA256 is
da139e8141abc5a58dbea39d87fd8863f8d565bdb914c40021501ec0edc3fcb0.
Each original was inspected exactly once, complete, before draft specs.
Canonical source paths and verified SHA256 values remain in source.image.
The complete authoritative lesson.template.json and exercises.template.json
were read; their hashes are bound in SOURCE-INVENTORY and manifest.json.
The caller supplied independent exact text approval. This author does not
claim that approval independently. Neither assigned figure is an exercise
figure; no answer materials were used.

Original alphabet/code/fine glyph/blackbar and arc-mark roles remain UNKNOWN.
Modern role labels come only from approved prose. Three unnamed vertex slots
in figure232 and the upper-left endpoint slot in figure233 are visibly "?",
not guessed C/D/E/H roles. Those strings in object ids identify source positions
only. The unnamed label slots require independent resolution before a final
source-fidelity approval.

Fig232 exact fine hatch count is UNKNOWN; its ten clipped oblique strokes are
explicit readable modern regularization. The hatch family is retained rather
than invented away. Its interior arc is retained; fine extent/mark semantics
are UNKNOWN. Fig233 has all six numbered sectors and their visible curves.
The candidate uses 1/2/3 strokes for sectors 1/2/3 and 4/5/6; sector6's fine
source multiplicity is still UNKNOWN and that three-stroke mark is provisional.
No equality equations, computed degrees, proof statements, parallel arrows,
additional diagonals or other solution-bearing annotations were added.

## Geometry and display

Mode: deterministic. Geometry and SVG exclusively use the installed native
JSXGraph renderer (its own report identifies version 1.13.1). No hand SVG,
svgPath fallback, artwork, generation service or paid call was used.
The owned author.mjs constructs FigureSpec objects and executable assertions;
it does not construct SVG geometry.

Fig232: six-sided convex outline, all label slots, bottom extensions on both
sides, lower-left side extension, clipped parallel hatching, interior arc.
Fig233: triangle ABC, MN through C parallel to AB, both sloping sides extended
above C, unequal extension lengths, numbered angle sectors 1-6 and arc strokes.

Native source.inventory groups map every resolved source element to visible
geometry/labels and assertion ids. Point groups require pointRelationships.
Native assertions cover edges, collinearity, parallelism, displacement and
extension directions, hatch endpoint containment and arc endpoint/ray/circle
relationships. Supplemental author checks cover convex order, slot preservation,
directed sectors, arc multiplicity/orientation, numbered-label completeness,
and absence of unrequested solution additions. These are author checks only.

Both figures are instructional inline media, maxWidthPx 640, widths
294/310/346/358/640, minTextPx 16. Canvas text is 36 px; minimum measured
display text is 16.5375 px at 294. Both current native validators and render
reports pass, with no collisions and all five width checks passing.

PREVIEW-CHECKS.json records actual raster/nonblank/not-black/text evidence for
all ten figure-width combinations. Complete full canvases and both complete
294 px previews were visually inspected. The polygon hatch, arc, extensions,
triangle frame, sectors and visible labels render, with no black/blank raster,
clipping or observed overlap. At 294 px the closely spaced arc strokes are
small but distinguishable; unresolved semantic/fine-pixel facts are not cured
by their rendering. No app or full-lesson acceptance was run in this bounded
figure-only assignment.

Fig232's final assertion-completion render changes no visual geometry or
labels. Its native SVG is byte-identical to attempt2; the existing complete
full/normal inspection and all-width raster evidence remain applicable. This
is byte-determinism/applicability evidence only, not source-fidelity approval.

## Native commands and actual outcomes

Every invocation uses the sole cwd above. Exact executable/argv/exit codes
and untruncated stdout/stderr are in the corresponding *.execution.json and
*.stdout.txt / *.stderr.txt files, all hashed by the manifest.
For each listed figure/attempt, the exact command forms are:

```text
python3 .agents/skills/ld-s10y-image/scripts/validate_spec.py /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/.intentfold/tickets/STEMROBIN-188/tmp/n38-fig232233-author7/<id>.spec.json --stage draft --json
node .agents/skills/ld-s10y-image/scripts/render_spec.mjs --spec /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/.intentfold/tickets/STEMROBIN-188/tmp/n38-fig232233-author7/<id>.spec.json --svg /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/.intentfold/tickets/STEMROBIN-188/tmp/n38-fig232233-author7/<id>.svg --png /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/.intentfold/tickets/STEMROBIN-188/tmp/n38-fig232233-author7/<id>.full.png --report /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/.intentfold/tickets/STEMROBIN-188/tmp/n38-fig232233-author7/<id>.attempt<n>.native-render.json
```

| Figure/attempt | Validator exit/output | Renderer exit/output |
| --- | --- | --- |
| 232/1 | 0, JSON status pass/errors [] | 2, label/stroke collisions A/B/D/F/G; all text widths passed |
| 232/2 | 0, JSON status pass/errors [] | 0, PASS: fig-232 (30 objects, 7 labels) |
| 232/3 | 0, JSON status pass/errors [] | 0, PASS: fig-232 (30 objects, 7 labels) |
| 233/1 | 2, sector5 containment margin 13 failure | Not run: dependent stage stopped |
| 233/2 | 0, JSON status pass/errors [] | 2, C label/stroke collision; all text widths passed |
| 233/3 | 0, JSON status pass/errors [] | 0, PASS: fig-233 (38 objects, 13 labels) |

Actual driver commands, with the prefix
`node .intentfold/tickets/STEMROBIN-188/tmp/n38-fig232233-author7/author.mjs`:

| Arguments | Driver exit/output |
| --- | --- |
| draft | 0, two source-inventory-bound FigureSpecs/supplemental checks |
| render | 1, stopped on native fig232/1 exit2 |
| repair-labels | 0, label clearance; failed232 and unrendered233 draft snapshots retained |
| render fig-232 2 | 0, native validation/render pass |
| render fig-233 1 | 1, stopped on native validation exit2 |
| repair-sector5 | 0, label moved 6 canvas px inward; margin unchanged |
| render fig-233 2 | 1, stopped on native render exit2 |
| repair-C | 0, C label shifted below horizontal; source coordinate/assertions unchanged |
| render fig-233 3 | 0, native validation/render pass |
| preview | 0, {"status":"pass","checks":10}; browser closed, session finished |
| complete-extension-assertions | 0, completed planned directional mapping, no visual changes |
| render fig-232 3 | 0, native validation/render pass, unchanged SVG |

The initial ownedroot `ls -ld` exited 1 because the directory did not yet
exist. It is retained as a technical pre-draft observation, not a content
verdict. There were three substantive nonzero native attempts above.
All failed native streams/reports and failed spec/SVG/PNG snapshots survive.
The fig233 attempt1.spec.json is the initial unrendered draft;
attempt1.validation-fail.spec.json is the actual failed validator input.

## Output binding and sealing

Actual candidates stay wholly inside ownedroot. Eventual destination prefix:
ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures

For each figure: *.spec.json, *.svg, *.render.json, *.full.png,
*.width-{294,310,346,358,640}.png, and *.supplemental.json.
No canonical/durable promotion was performed.
The final render.json copies the native report and changes only spec.path and
output.svg.path to eventual durable names. The untouched native reports and
execution paths retain actual author output locations. Geometry, measurements,
status and hashes are not changed. SVG bytes are untouched native outputs.
No review@1 file was created; no pass/promotable review claim is made.

The seal action creates manifest.json and SHA256SUMS over the actual owned
bytes, then chmods every owned file 0444. The manifest binds inputs, commands,
all attempts, final outputs, eventual paths, source inventory, this record,
preview evidence, unresolved facts and actual image counts. It does not
self-hash. SHA256SUMS binds manifest.json as well as all other owned files;
its own hash is returned directly by the final seal command.

## Actual image usage

One batch, six context image loads out of max8 batch/max24 context:

1. Canonical original fig232, once, complete.
2. Canonical original fig233, once, complete.
3. Current native fig232.full.png, once, complete.
4. Current native fig233.full.png, once, complete.
5. Current fig232.width-294.png, once, complete.
6. Current fig233.width-294.png, once, complete.

Reopens 0; crops 0; failed preview loads 0; paid calls 0.
Five native renderer invocations produced five full PNGs (including two
failed-render PNGs); ten unchanged-SVG width rasters were generated. These
15 raster production events are not 15 context image loads. Failed rasters
were retained but not opened. The final fig232 assertion-only regeneration
has identical SVG/PNG bytes and required no new image load.

Parent may collect this textual/hash-bound result for separate independent
review. It must not infer source approval or promotion from native pass,
author visual inspection, or a sealed manifest.
