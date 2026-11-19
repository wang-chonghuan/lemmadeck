# n94 Modern Figure Author, b94

Status: **AUTHOR_PASS_CANDIDATE_ONLY**. This is not independent FIG approval or
TEXT approval. No official `ld-s10y-image/review@1` pass file, promotion,
finalization, integration, or publication was performed.

## Scope And Inputs

- CWD for every command:
  `/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.
- Owner: `STEMROBIN-180/180-4`, lesson `phy7-c1-s1-n94`, two modern figures only.
- Owned scratch:
  `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-figure-author/`.
- Current text manifest:
  `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n94-text-author/manifest.json`,
  SHA-256 `1d82a274062474be35ef650aaf660b22519980ad7bfe224e9d618e223f2b155a`.
- The exact frozen lesson/exercises/figures templates were bound and retained.
  Each FigureSpec includes all 14 current prose objects and all 8 tasks, with
  explicit identity/source text for the two empty figure objects: 22 entries.
  Chinese prose and task content were not altered.
- Source 246 has the supplied new SOURCE approval; 247/248 reuse previously
  approved exact committed HEAD bytes per the current cohort bindings. No
  SOURCE review, finalize, vectorize, or Git replay was performed here.

## Source Inventory

`pixel-inventory.json` was authored from the two original PNGs, each opened
exactly once before design.

**fig-226:** two separate outlined oxygen spheres followed by one larger dark
carbon sphere on the left; one right arrow; adjoining/overlapping O-C-O spheres
on the right. Exactly three atoms per state. No source-left O2 bond, reaction
equation, bond-order marking, or source O/C labels. Modern clean circles and
O/C labels below them are explicitly additions/regularization. The source
relationship remains instructional.

**tbl-p0247-01:** 12 data rows, 3 columns, plus a header. All source-order fuels,
both coal range endpoints, every exponent, trailing `.0`, integer coefficient
`12`, and calorie value are retained. The regional fuel remains **Brown coal
(Moscow region)**, not a universal lignite value. English table labels retain
`q (J/kg)` and `q (kcal/kg or cal/g)`. Equal-width columns and full row rules
are explicit modern regularization. No solved annotations or answer highlighting.

Source PNG SHA-256:

- fig-226: `4f3547ca7325afb1dac40cecf6e8aa7262fb66390089b540adce6c22c8080285`.
- table: `072e3c3eece1c65b3d11d8b264527f41d9164ab8f13a1d0cf57b7924b7298e98`.

## Candidate Outputs

All following paths are under the owned scratch root. They are proposals only,
not installed figure entries; fresh independent review and durable-path
rebinding remain required.

| Figure | Candidate Directory | Spec SHA-256 | SVG SHA-256 |
| --- | --- | --- | --- |
| fig-226 | `fig-226/candidate-01/` | `1fdf8781467b20a3508512bfe8b935758ff742a3dbbee703d9e86472c5d7bf07` | `5662bc99c639ed5904791aeca12e6d415c598c39eee3db2ab90ea9276ed92bba` |
| tbl-p0247-01 | `tbl-p0247-01/candidate-01/` | `902b46e23af864db424dd0be66defc4e632f4137eb1450441f2b287a3d210532` | `539a9c2c708fc126edeadf3221e1036c1097488491d5f5ef578ded74f3b7bbae` |

Each directory contains `<id>.spec.json`, `<id>.svg`, `<id>.render.json`,
`native.json`, and `native-combined.{html,png}`. The existing deterministic
JSXGraph renderer was used; generated SVGs were never hand-edited.
`proposed-figure-entries.json` records current candidate paths and hashes,
with independent review explicitly absent.

Native combined image SHA-256:

- fig-226: `c5b0e8bcdb7b1cd7ed318d1d43a21ff63b17e810061b05830cd51b92ad7e31fa`.
- table: `b5f3f48d47b2ef245d939ad4343bf9f9dbcedfdfaf56d869f0d06795cd52d831`.

## Evidence And Failures

- Both FigureSpec draft validations and repaired render reports passed.
  `gridDimensions` verifies the table's 12-by-3 data lattice and 1-by-3 header;
  `inside` binds every table label to its cell. `connects` binds the single
  source transition arrow. Atom count/alignment/spacing assertions preserve
  the schematic without inventing chemical bond orders.
- Isolated preview at `preview/html/phy7-c1-s1-n94/{text,exercises}.html`
  was rendered from current frozen templates only by `render_lesson.js`.
  It retains 14 prose objects, 8 tasks, and 2 figures; no canonical or parent
  template was changed.
- 26 figure observations and 4 full offline surfaces passed in isolated
  headless Playwright, with actual SVG screen-transform font measurements,
  pixel nonblank checks, no page overflow, and scroll-end/final-column access.
- fig-226 declares instructional inline maximum 640px and measured actual
  widths 640/358/297px; minimum observed text is 17.634375px.
- Table declares instructional scroll widths 640/660px. Offline and exercise
  media are 640px; current-app prose CSS inherits 16.5px, giving 40em=660px.
  This is measured helper geometry, not live/headed product acceptance.
  Minimum observed table text is 17px.
- **First content failures preserved: 2.** fig-226's four O labels collided
  with circle edges; the table's two dual-line groups had insufficient spacing.
  Each figure received exactly one targeted repair. Only added-label
  placement/color or the four colliding table-label positions/font sizes
  changed. Original failed specs, SVGs, reports, and command receipts remain
  alongside the new candidate directories.
- **Initial read-only technical discovery failures preserved: 2.**
  A guessed `renderer.py` path and a guessed in-freeze `manifest.json` path
  did not exist. Their exact exit codes/diagnostics and path-only recovery are
  in `inspection-failures.json`. No passed author stage was replayed.

## Usage And Freeze

- Context image opens: **4** = 2 originals + 2 combined native previews.
  Reopens: 0; crops: 0. Below the batch limit 8 and context limit 24.
- Machine screenshots: 42; only the 2 combined native images were opened in
  agent context. Generated internal screenshot buffers are distinguished
  from context image opens.
- Paid calls: 0; model calls: 0; artwork services: 0; dependency installs: 0.
- First content failures: 2; technical failures: 2; total failures: 4.
  One repair round per figure; counts were never reset.
- Frozen `output-manifest.json` binds exact inputs, candidate and failed
  specs/SVGs/reports, native evidence, isolated previews, runtime source
  hashes, this author record, and all 13 completed `n94-fig-author-*`
  run-stage command receipts. All owned files and the manifest are 0444.
  The final seal operation verifies these bindings; the manifest excludes
  itself to avoid a circular hash.

Only this durable author record and the owned n94 scratch directory were
authored. The existing parent run-stage helper wrote uniquely labelled
command receipts. Other owners' work was preserved. Parent n92 choice and
n93 integration work were not accessed or modified.
