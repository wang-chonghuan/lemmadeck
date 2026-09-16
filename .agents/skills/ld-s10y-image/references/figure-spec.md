# FigureSpec contract

The canonical schema is
`assets/figure-spec.schema.json`; the semantic validator is
`scripts/validate_spec.py`.

## Required top-level fields

- `schema`: `ld-s10y-image/figure-spec@2`
- `id`: original figure id
- `mode`: `deterministic`, `hybrid`, or `generated`
- `description`: instructional purpose, not merely appearance
- `source.image`: original PNG path and SHA-256
- `source.authoritativeText`: complete relevant edition text
- `source.inventory`: source-based groups with `description`, `objects`, and
  `assertions`. Record source requirements first, give them stable IDs, then
  map them to the object and assertion IDs that realize each requirement.
  Missing, invisible, or unresolved IDs fail validation.
- `canvas`: pixel size and mathematical bounding box
- `display`: product `layout`, minimum final text size, and every width that
  must be checked
- `objects`: ordered render objects
- `assertions`: ID-addressable machine-checkable mathematical facts

Coordinates use JSXGraph user space. `canvas.boundingBox` is
`[xMin, yMax, xMax, yMin]`.

Review is not embedded in the spec. Record it separately as
`ld-s10y-image/review@1` after rendering or generation so any spec or output
change invalidates the review evidence.

## Supported objects

- `point`: `at`, optional `label`, `visible`, style
- `segment`, `line`, `arrow`: `from`, `to`
- `circle`: `center`, `radius`
- `polygon`: `points`
- `arc`: `center`, `start`, `end`
- `grid`: `xStep`, `yStep`
- `axis`: `from`, `to`, optional ticks
- `measure`: `from`, `to`, `label`
- `text`: `at`, `text`
- `image`: `asset`, `at`, `size`; hybrid artwork only. `size` is a fit box:
  the renderer always preserves the source artwork's intrinsic aspect ratio
  with centered `contain` behavior and must never stretch it to fill the box.
  Put image objects before geometry objects so the exact overlay is always on
  top. Set `avoidLabels: true` only when its tight image rectangle must exclude
  labels; otherwise use `layout.avoidRegions` for occupied artwork areas.
  Optional `rotation` contains `angleDegrees` and `center`; the renderer
  applies an exact JSXGraph rotation around that user-coordinate center.
- `svgPath`: deterministic fallback for a curve or filled region JSXGraph
  cannot express directly. It uses source-screen path coordinates and must not
  contain labels, ticks, points, or measurements.

Point references may be object ids. Coordinate literals are `[x, y]`.

## Labels

Labels are an overlay owned by the renderer, not freehand SVG text. Default
placement tests eight candidates around the anchor and scores collisions
against earlier labels, visible points, declared image regions, and
`layout.avoidRegions`.

Use `labelPlacement` only when the semantic layout requires a fixed side:

```json
{
  "position": "NE",
  "offset": [8, -8]
}
```

Never compensate for a wrong coordinate by moving a label.

## Display and color

`display.widths` contains the actual CSS widths at which the product may show
the figure. The renderer measures labels at each width and rejects any text
smaller than `display.minTextPx`, which must be at least 16. Use
`display.layout: "scroll"` when keeping labels readable requires a figure
wider than its viewport.

Use semantic color roles rather than literal product-theme colors:

- `ink`
- `muted`
- `accent`
- `accentSoft`
- `grid`
- `paper`

The renderer converts these roles to `--ld-figure-*` CSS variables. This keeps
the same SVG usable in neutral, accent, and print themes.

## Assertions

Use assertions for every relationship required by the exercise:

- `distance`
- `equalDistance`
- `collinear`
- `parallel`
- `perpendicular`
- `pointOnLine`
- `pointOnCircle`: `point`, `center`, `radius`, optional tolerance
- `centralSymmetry`: `center` plus every defining opposite point pair in
  `pairs`; each pair's midpoint must equal the declared center
- `inside`: `point` plus the containing polygon `container`; use for points,
  labels, or other anchored items that must remain inside a set, panel, or
  frame. In a set-relation figure, every visible member point and every
  `*-label` requires its own `inside` assertion. The anchor and the rendered
  footprint must both have clear boundary space. Name a set polygon
  `<group>-set`, its points `<group>-<index>`, and labels
  `<group>-<index>-label`; the validator derives mandatory coverage from those
  ids instead of trusting a hand-written assertion list.
- `connects`: `arrow`, `from`, and `to`; use for arrows or edges whose
  endpoints are part of the source meaning
- `objectCount`

Assertions validate source-space mathematics before rendering. The render
report separately validates label overlap and clipping.

When the description or authoritative text says a figure is centrally
symmetric or invariant under a half-turn, `centralSymmetry` is mandatory.
Do not use an opaque `svgPath` for the claimed symmetric object: construct its
defining vertices deterministically and include all opposite pairs.
