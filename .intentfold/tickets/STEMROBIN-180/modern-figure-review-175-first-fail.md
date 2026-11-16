# Fig175 Independent Full Review

2026-11-16. Reviewer: Codex, separate from Ramanujan's figure authoring.
Result: **FAIL / BLOCKED pending main-owned sole repair**.
This is the one complete source-first review of the submitted freeze, not a
lesson approval, modern-text re-review, or experiment safety certification.

## Substantive Finding

**F175-1: The balance pedestal floats above the bell-jar base instead of being
supported by it.** This is an essential apparatus relationship, not a request
for a cosmetic change.

The actual original175 PNG was opened first, in full. Its balance pedestal
rests on the sectioned bell-jar platform. The source contact region
`x=90..207, y=330..360` contains connected dark apparatus/platform strokes,
with no separating white row. Modern neutral/accent/print images at both306
and640 show a distinct horizontal white gap underneath the pedestal. No
leg, suspension, or other support bridges it.

The complete current SVG confirms this is authored geometry, not a theme or
capture problem. `source-balance-pedestal` ends at user-space `y=138`, whereas
`source-section-base` and `source-jar-base-rim` start at `y=120`. Their
centerline separation is18 canvas units:18px at640 and8.60625px at306 before
stroke footprints. In the640 neutral sample, the pedestal bottom is at SVG
screen `y=762`, and the platform top is at `y=780`. Existing raster rows764
through777 in `x=249..412` have zero dark pixels, a14-row open band. At306,
rows365 through371 in `x=120..196` similarly contain no dark pixels.

The same support chain also has a small post/pedestal separation:
`source-balance-post` ends at user-space `y=195`; the pedestal top is
`y=190`. Its4px outlines leave a fine separation at640. This is part of the
same missing continuous support relationship, not a separate repair request.

The assertion `source-pedestal-above-jar-base` explicitly asserts
`[330,138] -> [330,120], dy=-18`; it verifies the invented separation, not
source contact. The other literal-coordinate displacement/connects checks do
not test the pedestal/platform support boundary. Hence47 assertions and
canonicalPASS do not settle apparatus fidelity.

Minimal candidate direction, **not executed**: restore continuous
post-to-pedestal-to-platform contact in the FigureSpec, with a source-bound
relationship assertion. Keep the existing beam/pivot/left-ball/right-weight
positions, state, labels, port/hose and all nonaffected geometry. Do not add
invented legs or an extra apparatus state. Main may dispatch the author's
remaining single repair; this reviewer has changed no candidate bytes.

## Complete Review Coverage

Read the full approved upper modern lesson:10 prose items and both2 complete
exercise prompts, including source snapshots, changes and historical
declarations, from the frozen templates. The full-context prose and exercises
match these templates exactly, and all13 entries of
`spec.source.authoritativeText` match the full context. The local official
`context.json` honestly contains only exercise2; it was not substituted for
the full lesson.

Exercise1 uses fig174, not175. Exercise2 specifies the light glass ball on
the balance, balancing weights, bell jar and evacuation, then asks why
equilibrium is lost. The candidate preserves that task and its printed
left-low/right-high state; no answer source, answer key, choice, or private
solution was read or derived into figure annotations.

All47 objects, all47 assertions and all7 inventory groups were read in full.
The full existing SVG was parsed and inspected, including all71 visible
primitives, path fills/ordering and English text. Nonrendering construction
and definition primitives are retained in the evidence but are not counted
as source apparatus.

| Inventory Group | Independent Observation | Finding |
| --- | --- | --- |
| Bell jar | One complete rounded jar, descending walls, loop handle and short crown attachment; walls meet platform; no extra state. | No additional defect |
| Base and port/hose | Broad sectioned platform and two-wall under-base port join the bent hose; right external end stays open. No invented pump body, valve or flow arrow. | No additional defect |
| Balance frame | Pivot, slanted beam, angular upper ridge, upright post, lower curved fixture and pedestal are present; left end remains lower, right higher. Pedestal/platform support is absent. | **F175-1** |
| Left glass ball | One larger necked glass-ball outline, hook and short attachment hang from low left end; no contact with jar wall or pedestal, no invented wall thickness or internal gas specification. | No additional defect |
| Right compact weight | Much smaller solid weight/attachment remains at high right beam end; no invented pan, long suspension, calibrated mass or stack. | No additional defect |
| Section regularization | All16 modern hatch strokes are present and declared illustrative, not a measured source grid or scale. | No additional defect |
| Part identification | Four English labels, Bell jar / Glass ball / Weight / Hose, identify the correct components with non-arrow leaders; no explanation or numerical answer. | No additional defect |

Chosen arm coordinates, smooth outlines, hardware simplification and hatch
spacing are declared schematic additions rather than measured source data.
There is no source numerical scale, tick grid or given pressure/mass value to
invent. The modern diagram does not introduce Cyrillic/Chinese labels,
historical emblems, archival texture, a person or promotional wording.

## Actual Pixels Opened

Each of the following was opened individually once during this review;
existing images only, with no browser or render invocation:

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-175.png` (321x448).
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-175-author/evidence/native-neutral-306.png`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-175-author/evidence/native-neutral-640.png`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-175-author/evidence/native-accent-306.png`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-175-author/evidence/native-accent-640.png`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-175-author/evidence/native-print-306.png`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-175-author/evidence/native-print-640.png`

All six are nonblank, correctly framed and legible; no label collision or
clipping was observed. Existing native evidence reports actual media widths
306/640 and transformed label sizes17.2125/36px, respectively. Those values
are reused, not remeasured by a new preview. Each image still shows F175-1.
Inline layout has no scroll-end requirement; deterministic output has no
hybrid artwork layer to inspect. This is not a product/offline-lesson render.

## Exact Frozen Bindings

46 distinct manifest/input/tool/evidence files were hash-and-byte compared
read-only:46 matched,0 mismatches. Frozen source, templates, spec, SVG,
render and six native samples remain unchanged.

| Artifact | SHA256 |
| --- | --- |
| Submitted author-handoff.json | `a27eab0a1abf65aab46fdb8e7fcef5e007035fb416f3035cc20417556f5d0173` |
| Submitted freeze-manifest.json | `377ba9d58a66938f71c345faf85ffff866cd1559055e161e7a4e8ef2a01aeed0` |
| Actual original175 PNG | `54d8b2180594415531c64e9f1212cbced85234f7d21236da63b455f545e9125b` |
| Full modern s20 text handoff | `fd29ab8fd53dd4f682df31c85537f5665a6e4019d5b93365f5d717f1b13e0ded` |
| Modern lesson template | `9921c9d0d5bdfe5701ab8a3acb4ef54d426c79911e7129440a64621447a43268` |
| Modern exercises template | `73426fc0ddb6832d553ba543dcfed61be6c9bd2030ecf3ec8347b8f94154957d` |
| Modern figure template | `557a30df7347e8dafd7ef922b70305cf95c02486df6d32a1b7a4b47fac203e04` |
| fig-175.spec.json | `802bd61f22c1c6e6ebd2202131cc4c1e9cb65e8876db743c0a301d48cb82df25` |
| fig-175.svg | `9cad2b0eb20aea6f94b201f360666713ea79ded7bcb955ffae1d73d5efd45c01` |
| fig-175.render.json | `ee0e691cbc261999a1dabcbfc51df4c988821198f129e2eb5e4ddac26212daac` |
| native-preview.json | `39d2d9b33b5a5d940c00b25c18479cf9695e325bf19e74113d210f30f5b287d4` |
| neutral306 PNG | `dd162be85cbbafbc3b8db57a2fc59474c8e60fee8eaebc498ab019532f36aa33` |
| neutral640 PNG | `1e62de17a17be7173c2c0ea917da16d74d880b143ac665a0069d3ec18f1bff5e` |
| accent306 PNG | `edbf83f23d81f80edcc729ccbaa4d94c4bba1239d81cf6c53c0a55becd691fc6` |
| accent640 PNG | `e3eaa51b3876316458b2d018cab7abb40df597417e53659bea042c02e42e9660` |
| print306 PNG | `3b7cb55fbf9b5b5a0afcdb72a74b41a9e2129fed8cb7debe82f8683a0375c7ce` |
| print640 PNG | `b94b2033532a1cefc459fb6661244c4165b94790d7b6ffe22ce284af8862d14b` |
| Reviewer bindings-and-svg.json | `73459116456ec9bd6b41fa01916370d17bc69226e7ccb80e34dbbad17792a17a` |

The complete bindings, all SVG primitive attributes and existing-source/
preview row observations are in `review-evidence/bindings-and-svg.json`.
This read-only evidence command exited0:

```sh
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/s10y-image/6p/fig-175-author/review-evidence/collect.py
```

The submitted author's five context/spec/validate/render/theme stages all
exited0, with canonicalPASS, nativePASS,0 collisions, repair0/1 and service
calls0. These existing outcomes were reused without rerunning gates.

## Disposition And Uncompleted Boundary

One essential independent failure, F175-1. The first rejected figure bytes
and this report are retained in `independent-first-failure/manifest.json`.
The original author freeze stays unchanged; review files are outside its
frozen file list. No author repair was made or consumed here.

**Official record_review was not invoked:** the user's authorization permits
it only after independentPASS. No official review.json or approval exists
from this review. No promotion, lesson-finalize, full-lesson gate, image
service, browser, DB, Git, dependency, source/text/tool/app write was performed.

Main may now authorize the sole targeted author repair and an affected-only
comparison. Do not reuse this rejected freeze as an approved figure; do not
repeat this full review or repair in the reviewer role.
