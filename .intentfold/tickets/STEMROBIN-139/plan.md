# Findings

- `ld-s10y-image/figure-spec@1` has no contract for source-required relationships, containment, final display size, semantic color roles, or review freshness.
- `render_spec.mjs` writes literal colors into SVG and records only a flattened PNG for hybrid figures.
- `edition.py`, `publish.mjs`, and the card route model a figure as either PNG or SVG, so the app cannot keep generated artwork and deterministic annotations as separate layers.
- Lesson 8 and 9 contain twelve deterministic figures. Figure 34 is the known containment and readability regression; the table and geometry figures cover other real figure families.
- `migrate_legacy_svg.py` is an obsolete inference path: it guesses semantic objects from already-rendered SVG and conflicts with the source-first contract.

# Route

1. Introduce the current FigureSpec contract with source requirement IDs, relationship and containment assertions, semantic color roles, display contexts, and review evidence tied to the current source/spec content. Keep old specs readable as historical resources, but make the current renderer and publication gate accept only the current contract.
2. Extend the validator and renderer tests with failing fixtures for omitted requirements, wrong arrow relationships, set-member containment, stale review evidence, raw colors, and undersized final text.
3. Change the renderer to emit CSS-variable SVG colors, measure labels at declared display widths, and emit a pure vector overlay for hybrid figures while using artwork only for composite previews. Remove the legacy SVG inference script and its tests.
4. Update lesson validation, publication, stored figure types, and the card UI so deterministic SVG, generated PNG, and layered hybrid artwork plus SVG each have one explicit path. Use existing app ink/accent tokens and print styles without changing the token registry.
5. Migrate and regenerate every lesson 8 and 9 figure through the current path. Recompose Figure 34 so all four relation panels remain readable, declare every membership and arrow relationship, and make all final labels at least 16px at the product widths.
6. Migrate one existing hybrid figure as the representative layered-output sample, create original/new/theme/print previews under ticket scratch, publish only through the lesson publisher, then run the ticket AC and project mechanical defence.

# Redline Lookup

- No dependency changes.
- No governed token is added, removed, renamed, or retuned; component-level figure variables reference existing tokens.
- No schema or ad hoc database operation; content writes use the existing `ld-s10y-lesson` publisher and `LEMMADECK_DATABASE_URL`.
- No production browser interaction or deployment.
- No product resource is written outside `ssot-resources/`; previews and browser evidence stay under `.intentfold/tickets/STEMROBIN-139/tmp/` or `.tmp/`.

