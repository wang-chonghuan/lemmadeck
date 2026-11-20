# 188-6 N42 bounded image-author report

**Disposition: author previews only, awaiting independent review. Figure 2
has a residual notation/hidden-edge visual concern. No figure or whole lesson
is approved or promoted, and no review@1 file was written.**

## Scope and current authority

Only fig-g10-01/02 for geo910-c2-s1-n42 were authored. Every exec explicitly
used `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`. All writes are
inside `.intentfold/tickets/STEMROBIN-188/tmp/n42-image-author/`.

Current stable templates were bound once after the parent's layout-only update,
not by reusing the earlier temporary text hashes:

- lesson.template.json: `11058459b1f1c04bf85be90c32773e0fefeec3790a49441135085894b7fb296e`
- exercises.template.json: `d4df1a3d39000be2b6d4027b3e303641e8df9c7d8a5f014ce05fe5f6b7b17fbf`
- figures.template.json: `df9016d5cbccd3f1f10f00da1a05f02569e153662077fe387161ccab9c5fc5e8`
- exact authoritativeText array SHA-256: `9355ab588245d177b4b1b56771e3e00169050c82faa931beeec16662c3717388`
- context-binding.json SHA-256: `7dbf4a46570dc21011b9ed4be12c8f317334b9af4922a84232a714cb64229140`

`context-binding.json` preserves the full bound prose/exercise text and template
paths. Specs use that same text; the label repair did not rebind templates.
`author-report.json` embeds the COMPLETE `source-inventory.md` inventory.

## Source inventory and mathematics

Both original PNGs were actually opened exactly once. Complete per-object,
per-label, solid/dashed, shared-point and relationship inventory is retained
in `source-inventory.md`, including approximate scan positions and separate
modern regularization.

- fig-g10-01 PNG SHA: `cfd9bf74e90a570ba9fe696a32cf461a0c01adfb040343ae4daea5306b3cba98`.
  Four unlabelled source points, three common-tail solid basis arrows and
  exactly three vector labels i/j/k.
- fig-g10-02 PNG SHA: `a9ecfdaa5aeb62cec584ca0d89c76e0e7207736323642b393fc82e8903b18614`.
  Eight box vertices plus three unit-arrow tips. All twelve box edges:
  nine solid and three concealed dashed. One additional dashed space diagonal
  O-A, three common-tail component arrows, three common-tail unit-arrow
  overlays, and all seven labels i/j/k/xi/yj/zk/a.
- Every source edge/arrow has its own connects assertion. Every source point
  has wholly internal pointRelationships coverage. The repaired specs contain
  9 assertions / 6 connects for fig-g10-01 and 51 assertions / 23 connects
  for fig-g10-02; the additional connects account for vector notation arrows.
- The box also checks all three translated parallel edge families,
  unit/component collinearity and the component-sum diagonal projection.
  Projection crossings are not fabricated vertices.
- Spatial UNIT lengths and pairwise orthogonality are checked in a separate
  3D basis/model in `context-binding.json`. There are NO 2D perpendicular or
  equal-length assertions misrepresenting spatial facts.
- Illustrative internal box parameters 2/3/3 are modern construction values,
  NOT source givens, answers, measurements, or visible labels.

## Actual attempts, preserved failures and outputs

Each figure received one explicit draft-validator call and one initial render.
The existing renderer internally invokes draft validation. Both explicit
validator calls exited 0. Initial fig-g10-01 render exited 0; initial
fig-g10-02 render exited 2 with k/a label collisions. Original artifacts
and stdout/stderr are retained unchanged.

Visual inspection found missing-glyph squares for the combining vector
overarrow in BOTH initial PNGs. Thus fig-g10-01's machine result did not mean
its output was visually accepted. One real label repair per figure retained
the Latin text and replaced unsupported vector glyphs with deterministic
JSXGraph notation arrows; fig-g10-02's k/a text anchors were also spaced.
No original source PNG was reopened. No output was regenerated merely for
the parent's layout-only prose change.

The separate label-repair candidate render for each figure exited 0 and
reported literal machine `status: "pass"` with no text collisions. This is
renderer evidence ONLY, not author or independent approval. No second repair
or green-seeking retry was attempted.

Candidate files (all names are relative to this author directory; absolute
paths, SHA-256 values and byte counts are in `author-report.json`):

| Figure | Candidate spec | Actual SVG | Renderer evidence | Actual PNG |
| --- | --- | --- | --- | --- |
| 01 | fig-g10-01.label-repair.spec.json | fig-g10-01.label-repair.svg | fig-g10-01.label-repair.render.json | fig-g10-01.label-repair.preview.png |
| 02 | fig-g10-02.label-repair.spec.json | fig-g10-02.label-repair.svg | fig-g10-02.label-repair.render.json | fig-g10-02.label-repair.preview.png |

- 01 spec SHA: `a3c60681295c5c6428b7cd5110b2e7d8b51ef5b951ea6e8f2623f84a6e20ca44`
- 01 SVG SHA: `349fe50a8e1d821f35dd2dd78c7d06d6ca9bd82181505c9bc8a85d19342ab35f`
- 02 spec SHA: `116a4b670df30a73482ef60af6a6c0ce5a2a44b5908751cfc59130c4d2869c08`
- 02 SVG SHA: `966add51d25295944303db05c574f451582a2e1569f5cfc4ce369f4a53851f5c`

Both use instructional inline media with maxWidthPx 480 and minTextPx 16:
actual measured minima were 17.5px at 300, 20.88296875px at 358, 28px at 480.
The complex figure additionally has a 300px snapshot of the EXISTING SVG
(`fig-g10-02.label-repair.width-300.png`), not a geometry redraw.
No complexity-based scroll640 fallback was necessary for text size.

## Author visual findings and cultural/label check

Source directions, common tails, twelve-edge topology, solid/dashed distinction,
seven box labels and three basis labels were preserved in the candidate.
No Cyrillic/Chinese words, Soviet decorations, invented identities, added
given values, extra coordinates, or exercise answers were placed in either
image. English/Latin mathematical labels retain explicit vector overarrows.

**Remaining concern: fig-g10-02's small k-vector overarrow grazes/touches
the horizontal dashed hidden edge at 300px.** Its arrowhead top is y=135.875px;
the hidden-edge center is y=135.625px with 1.5625px stroke width, so the
stroke footprint reaches y=136.40625px. Their vertical footprints overlap
by approximately 0.53125px. The nearby dash also intersects that horizontal
range. This is a geometry/notation concern which the renderer's text-collision
gate does not certify. See `normal-width-evidence.json` and image ledger
entry 8. Repair quota is exhausted, so do not silently approve it or run
another content revision under this assignment.

No additional visible source-fidelity issue was identified for candidate 01
by this author. That statement is not independent review.

## Ledger, cost and boundaries

`image-ledger.json` records EVERY open call. Total: 8 calls, 7 loaded images
in this context, source opens 2 with 0 source reopens, within 8-call and
24-context-image limits. One mistyped preview path failed with ENOENT and
was corrected once without a new render; its actual path is preserved.

Per figure: explicit draft validator 1; initial render 1; targeted content
repair 1; repair render 1. Total renderer invocations 4; explicit validators 2;
internal renderer validator invocations 4; normal-width raster screenshot 1.
External model/image calls 0, paid image calls 0, installation calls 0.
Known external generation expenditure: 0. Codex session/token billing is not
available here and is not represented as free or estimated.

No setup, freshness, Grill, backend, .env, API, DB, install, paid generation,
publication, Git mutation, other-chat operation, answer work, old-exercise
work, N43 work or six-page independent rework was performed.

Render metadata truthfully still names ticket-preview paths. It is NOT final
durable metadata. The parent may mechanically migrate paths only after its
separate review decision, preserving original attempt snapshots; this author
has neither migrated assets nor fabricated review approval.
