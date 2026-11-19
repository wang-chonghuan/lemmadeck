# Figures 56-58 bounded offline author handoff

Exact checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Only this `n41-n42-figure-author/` directory was written. Others' dirty
work was left intact. No network, database, app, dependency, durable-resource,
template, publish, generation, or commit operation was performed.

## Delivered

Each of `fig-56/`, `fig-57/`, and `fig-58/` contains:

- `context-FIRST.json`: complete current modern lesson prose and exercises,
  relevant authoritative text, manifest-derived ownership, verified template
  hashes, provisional future finalized paths.
- `source-inventory.json`: independently opened PNG provenance and requirement
  mapping, including grid dimensions, traces, scales, and modern additions.
- `spec-draft-FIRST.json`: deterministic, instructional FigureSpec@2.
- `spec-validation-draft-FIRST.json`: canonical draft validator pass.
- `validation-FIRST-receipt.json`: exact command, stdout, return code, and
  validated spec hash; one invocation per figure.

Common files:

- `source-inventory-FIRST.md`: observations recorded before object planning.
- `pixel-probe-FIRST.json` and `pixel_probe.py`: numerical dark-line probes;
  these emit text, not image payloads.
- `binding-FIRST.json`: exact missing finalized paths and verified template
  binding receipt.
- `draft-check-FIRST.json`: construction checks, not rendered acceptance.
- `cap1-geometry-check-FIRST.json`: actual serialized geometry checks, source
  hashes and frozen-text checks; it does not rerun the canonical validator.
- `cap2-FIRST-blocker.json`: honest not-run receipt and parent render commands,
  not a fabricated `ld-s10y-image/render@2` report.
- `ledger.json`: image, execution, ownership, and zero-spend counters.
- `hashes.json`: every package file's absolute path, SHA-256, and byte size,
  except its own self-hash.

## Exact Blocker

Neither the isolated stage nor durable resources contains finalized n41/n42
`lesson.json` or `exercises.json`. The missing files are under:

```text
.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n41-n43-source-stage/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n41/
.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n41-n43-source-stage/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s3-n42/
ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n41/
ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s3-n42/
```

`binding-FIRST.json.paths` lists all eight absolute missing file paths.
This is a finalized-input technical path issue, not absent source images or
failed mathematical review. `build_context.py` was not invoked: it requires
finalized edition `lesson.json`/`exercises.json` and cannot read the frozen
templates. No source-only data or invented finalized edition was substituted.

Following the user's explicit fallback, FIRST rendering is deferred until the
parent binds the current finalized `source.authoritativeText`. Therefore no SVG,
render@2 report, full preview PNG, width preview PNG, or review@1 file exists.
The renderer was not run and has no failed call to repair. Preserve this
FIRST package; write a separately bound candidate before rendering.

## Source Fidelity

Figure 56 belongs only to exercise 848. Three traces a/b/c share a 36-column,
12-row unit grid, x[-24,12], y[-5,7]. Frozen exercise equations constrain
their geometry, but equations and label-to-equation answers are not printed.

Figure 57 belongs only to exercise 849. Two traces a/b share a 36-column,
12-row unit grid, x[-11,25], y[-5,7]. Independent pixel/grid readings include
(0,-2), (10,0) on a and (0,1), (1,-1), (2,-3) on b. No answer equations
or additional coordinate labels appear.

Figure 58 belongs to n42 worked-example prose, not its exercises. It retains
the 18-column, 40-row half-unit grid, x[-4.5,4.5], y[-2.5,17.5], the original
solid parabola/line, A=(-4,16), B=(2,4), and the two dashed vertical guides.
The exact parabola uses two quadratic Bezier segments, not approximate
interpolation. Supplemental checks evaluate the serialized raw path against
y=x^2 and the named intersections. Tiny explicit intersection markers are
documented modern clarification; the source does not have standalone dots.

All source axis numerals are retained; no grids are split or blanked.
Vector colors use semantic roles only. All figures declare scroll media width
640 px and minimum final text 16 px. Figures 56/57 use 26 px text on a 960 px
canvas, arithmetically 17.33 px at 640; figure 58 uses at least 20 px text on
a 640 px canvas. These are draft sizing calculations, not rendered collision,
readability, scroll-reachability, or product-surface evidence.

## Hashes

Draft FigureSpecs, in figure order 56, 57, 58:

```text
d5dcec0073339664e416bd2443518dac8060aa50470dc95425134816b476286c
3ad2bb2228913b4333b8b80680af57d88f837fd139e7febcf64ec1ad6bd267fc
336eac31232c71c89732cadac91c22ae2d2a1073dbb703fe75ee6ad74d2a1ff5
```

Complete template and source hashes are in the contexts and hash-bound
receipts. `hashes.json` is the final package-wide hash ledger.

## Usage and Next Boundary

Image payloads opened: 3 originals; 0 reopens, crops, renders, screenshots or
other images. Batch 3/8, context 3/24. Numerical probes were executed twice
and do not introduce image payloads. Canonical validation ran once per figure,
three total. Render runs 0; build-context runs 0; paid calls/spend 0.
No technical or content-revision loop was consumed.

Parent binds finalized text, retaining FIRST text/hash provenance and checking
for substantive changes, then runs cap2 on the bound specs. Full-resolution
and actual 640 px media-width previews still need creation and inspection.
Independent cap4 remains required and must compare the original PNG, current
authoritative text, and rendered output. This package is valid cap1 output
only; it is not independent approval, promotion, publication, or completion
of the larger ticket.
