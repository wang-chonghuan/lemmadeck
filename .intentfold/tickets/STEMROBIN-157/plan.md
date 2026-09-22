# Plan

## Observed Contracts

- Published and offline lesson rendering already share `htmlfrag.js` `proseFlow`; edition validation is the duplicate path.
- MathLive submits `MathfieldElement.value` as LaTeX, while `exact` currently applies only plain-text normalization.
- Edition preparation snapshots raw lesson JSON, but there is no page-bound record that authorizes a mathematical correction.

## Route

1. Make `htmlfrag.js` the canonical paragraph and section-boundary engine. Add an author-facing outline command, semantic before/after boundary anchors in new templates, and have Python validation call that same engine.
2. Extend the shared answer normalizer with general MathLive-LaTeX canonicalization, use one exact-match helper in runtime judging, and add a reusable real-MathLive contract checker to answer finalization.
3. Add page-level mathematical errata records and propagate them through assembly and edition preparation. Replace the absolute formula-signature prohibition with exact source-page/hash/block/original/correction validation.
4. Update both skills, gates, examples, and focused regression coverage; rebuild an isolated minimal source sample through the formal lesson and answer tools.
5. Run ticket acceptance, browser checks at both required viewports, and the project mechanical defence, then commit, push, and hand off with the preview left running.
