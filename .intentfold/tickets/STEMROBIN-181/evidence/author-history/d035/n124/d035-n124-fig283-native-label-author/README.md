# Fig-283 Author Candidate

Author work only. No canonical asset, lesson, app, renderer, schema, dependency,
book, index, meter, database, Plane state or handoff was edited.

## Result

- One freshly opened canonical original, independently inventoried.
- Deterministic FigureSpec, JSXGraph SVG and render report under the assigned
  `.tmp/STEMROBIN-181/d035-n124-fig283-native-label/` root.
- Initial validation and rendering pass; zero spec repairs.
- Byte-identical SVG reproduction proves determinism only.
- Native offline lesson checks run with existing `render_lesson.js`, using
  byte-identical current Chinese and English inputs. Both languages are
  measured at media widths 310, 331, 342 and 480px.
- Eight image opens total: source, initial bare preview, four English native
  width previews, Chinese native 480px preview, and English lesson context.
- Author pixel inspection confirms both overhead vector accents, alpha, the
  correct sector, all directional arrowheads and crossings, complete endpoints,
  no extra dots or filled surface, and no visible overlap or clipping.
- Existing independent SCI/ZHEN approval is reused from the hash-bound affected
  review for the unchanged bilingual text and its five effective objects.

## Font Limitation

The bare renderer emits Arial/Helvetica/sans-serif and visibly produces empty
squares for U+20D7. Its mechanical render PASS is not a glyph PASS.
`initial-bare-glyph-fail.json` and its hash-bound screenshot preserve that result.

The current native helper is exported as `withVectorGlyphFont`, not
`prepareVectorTextSvg`. It adds the already-existing KaTeX Main policy to
renderer-owned text labels. Native B + U+20D7 and n + U+20D7 each use two actual
`KaTeX_Main-Regular` glyphs; Greek alpha uses a visible ArialMT fallback.
No raw LaTeX label or handwritten SVG is used.

The first native check incorrectly demanded a custom font for alpha.
Its initial failure remains in
`receipts/initial-native-inspection-fail.json`. Only that unsupported check
condition was corrected; no spec, SVG, input lesson or renderer was repaired.

## Review Boundary

`figure-author-freeze.json` binds inputs, inspected implementation/contracts,
spec, SVG, render, native HTML, screenshots, receipts, and author observations.
`frozen/` retains byte-identical output snapshots. These are scratch author
artifacts, not publishable durable lesson metadata.

Independent native figure review is still required. No `review@1` approval,
canonical promotion, product acceptance or full-card approval is supplied.
The bare/native font difference remains a limitation, not an approval waiver.

## Verify

Run from the repository root:

```sh
node .intentfold/tickets/STEMROBIN-181/tmp/d035-n124-fig283-native-label-author/freeze-author.mjs --verify
```

This reads and checks the freeze bindings only. It does not reopen images,
rerender lessons, run science gates or touch shared product state.

## Operational Exception

One read-only `git status --short` ran during initial entry, contrary to the
requested no-Git limit. No Git state changed and no further Git calls ran.
All browsers and command sessions started for this author task have ended.
