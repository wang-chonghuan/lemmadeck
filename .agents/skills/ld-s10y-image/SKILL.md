---
name: ld-s10y-image
description: Load when creating, repairing, reviewing, or migrating figures for Soviet 10 Years modern-edition lessons, especially geometry, number lines, charts, measured diagrams, semantic illustrations, or hybrid figures that combine GPT Image artwork with exact mathematical overlays.
---

# ld-s10y-image

Create modern textbook figures without asking an image model to preserve exact
mathematics.

## Ownership

This skill owns the complete modern-edition figure workflow:

- authoritative edition-text context
- renderer selection
- `ld-s10y-image/figure-spec@2`
- deterministic geometry and labels
- GPT Image artwork through `n-azure`
- layered hybrid composition
- hash-bound mathematical, visual, and cultural review

`ld-s10y-lesson` owns extraction, lesson assembly, edition text, and publishing.
It must delegate modern figure work here.

## Capabilities

### cap1 — Plan one figure

Build context, inspect the edition text and original PNG, select a rendering
mode, and write a draft FigureSpec. Read
[routing.md](references/routing.md) and
[figure-spec.md](references/figure-spec.md).

Before drawing, record `source.inventory`: independently describe every source
subfigure, point, relationship, label, row/column and given value, then map
those requirements to object and assertion IDs. Use stable IDs derived from
the source inventory. Do not derive the inventory by merely counting what you
happened to draw. A pass from `objectCount` cannot detect an item omitted from
both the drawing and count.

Update the lesson edition figure entry to exactly one final-output contract:

- `deterministic`: `svg` + `render` + `review` + `spec`
- `hybrid`: `artwork` + overlay `svg` + `render` + `review` + `spec`
- `generated`: `png` + `generation` + `review` + `spec`

Remove fields from the other modes. A hybrid figure never publishes a
flattened PNG. Its artwork-generation metadata is referenced by
`spec.assets[].metadata`, not duplicated in the lesson manifest.

```bash
python .agents/skills/ld-s10y-image/scripts/build_context.py \
  --book 5m --edition modern-us-neutral --figure fig-29 \
  --output .tmp/s10y-image/fig-29/context.json
```

The host agent performs semantic interpretation. Deterministic scripts never
guess what the source diagram means.

### cap2 — Render deterministic or hybrid geometry

Validate the spec, then render it with JSXGraph:

```bash
python .agents/skills/ld-s10y-image/scripts/validate_spec.py \
  .tmp/s10y-image/fig-29/spec.json --stage draft

node .agents/skills/ld-s10y-image/scripts/render_spec.mjs \
  --spec .tmp/s10y-image/fig-29/spec.json \
  --svg .tmp/s10y-image/fig-29/fig-29.svg \
  --report .tmp/s10y-image/fig-29/fig-29.render.json
```

The validator also rejects finite geometry outside the canvas; label checks
alone miss clipped table borders and blank answer cells. The renderer fails
when labels overlap, leave the canvas, or render below `display.minTextPx` at
any declared product width. For hybrid mode, also pass `--artwork` for the
transparent artwork layer; `--svg` remains the independent mathematical
overlay. Repair the spec once; do not hand-edit generated SVG paths.

### cap3 — Generate semantic artwork

Read [generation.md](references/generation.md). Use `n-azure` cap4 with the
original PNG and complete edition text. For hybrid figures, generate only the
natural objects or scene; omit grids, measurements, coordinates, labels, and
answer-bearing annotations. Request a transparent background when practical.

### cap4 — Review and promote

Read [quality-gate.md](references/quality-gate.md). A figure is promotable only
when:

1. FigureSpec validation passes.
2. Render report status is `pass` for deterministic or hybrid output.
3. Mathematical and cultural visual review passes.
4. A separate `ld-s10y-image/review@1` file records `status: pass` and hashes
   the current source, spec, evidence, and durable outputs.
5. The lesson edition validator and offline lesson render pass.

Record the review after inspecting the figure:

```bash
python .agents/skills/ld-s10y-image/scripts/record_review.py \
  --spec .tmp/s10y-image/fig-29/spec.json \
  --render .tmp/s10y-image/fig-29/fig-29.render.json \
  --output .tmp/s10y-image/fig-29/fig-29.review.json \
  --status pass \
  --notes "Compared with the source image and current edition text."
```

Use `--generation` instead of `--render` for `generated` mode. Preview under
`.tmp/`. Do not overwrite edition assets or write the database before
approval. Promoted metadata may depend only on durable edition files.

For a corpus migration or audit, derive the target set from lesson prose,
exercise display objects, and `figure_refs`:

```bash
python .agents/skills/ld-s10y-image/scripts/audit_corpus.py \
  --edition modern-us-neutral --require-current \
  --output .tmp/s10y-image/corpus-audit.json
```

Do not substitute a glob of FigureSpec files for this audit. A referenced
figure can be absent from its lesson manifest, and an unreferenced file does
not prove that the product uses it.

## Non-negotiable rules

- Edition text is authoritative; the original PNG supplies visual structure.
- Never use an answer key to construct a question figure.
- Use deterministic geometry for points, lines, grids, axes, ticks, dimensions,
  coordinates, transformations, and mathematical labels.
- Declare every intended product display width and keep all final text at least
  16 px there. Do not judge readability from the source canvas alone.
- Hybrid artwork must preserve its intrinsic aspect ratio. FigureSpec `size`
  is a centered contain box, never permission to stretch an image.
- A central-symmetry or half-turn claim requires a `centralSymmetry` assertion
  covering every defining opposite point pair. Never represent the claimed
  symmetric object as an unchecked free-form `svgPath`.
- Use `inside` assertions (`point` + `container`) for items that must stay
  inside a set, panel, frame, or region. A set-relation figure with
  `connects` assertions must cover every visible member point and every
  `*-label`; the validator also requires clearance for the rendered point or
  text footprint, not merely an anchor barely inside the border. Give set
  polygons stable `*-set` ids and their members matching `*-<index>` plus
  `*-<index>-label`, so completeness is derived rather than optional. Use
  `connects` assertions for every arrow or edge whose endpoints carry meaning.
- Use GPT Image only for semantic artwork. In hybrid output, artwork is below
  the deterministic overlay.
- Visible labels are English; mathematical symbols and numbers are allowed.
- Vector colors use only semantic roles: `ink`, `muted`, `accent`,
  `accentSoft`, `grid`, and `paper`. The SVG emits CSS variables so the app,
  alternate themes, and print can recolor it. Do not encode a product theme
  such as teal or green into the FigureSpec.
- Do not copy Cyrillic, Chinese, decorative Soviet symbols, flags, uniforms,
  handwriting, old-book texture, or fictional cultural wording from source
  pixels. Preserve source-bound historical identities declared by the edition;
  generated portraits must read as contemporary textbook illustrations, never
  as archival photographs.
- No silent fallback. A failed assertion, collision, or visual gate blocks
  promotion.
- Source coordinates and half-unit grid steps are facts, not approximate
  decoration. Chords must include every labelled intersection, with
  `pointOnCircle` and collinearity assertions where applicable. A directed
  self-loop needs an arrowhead, not only a circle.
- A source grid, ruled plane, table lattice, or city-block array is
  instructional structure, not a decorative background. Inventory its exact
  rows, columns, offsets, and gaps; never replace it with a blank panel.
- For read-from-graph exercises, record the source curve's queried coordinates
  and extrema before interpolation. A similar-looking curve is not equivalent;
  do not change its values or extend it past the source endpoints.
