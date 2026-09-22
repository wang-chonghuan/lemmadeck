# Acceptance Check

## AC1 - Source fidelity and modern errata

- Compare physical pages 7-16 against the durable page artifacts and assert the two known formula
  facts explicitly.
- Run page finalize, assembly, modern adaptation finalize, answer finalize, interaction finalize,
  and `validate_publish.py` for both lessons.
- Assert lesson/exercise counts, stable IDs, zero figures, registered errata, corrected modern
  formulas, and retained section-boundary anchors.

Pass: every command exits zero; the faithful layer matches the printed errors, the modern layer
contains both corrections, and no unrelated lesson or question identity changes.

## AC2 - Course rendering and answer interaction

- Run real MathLive keyboard edits for the six formerly failing lesson inputs and one paired wrong
  input per class; judge emitted values with the shared production code.
- Check the existing numeric and expression controls alongside the six exact cases.
- Render both lessons through the official renderer and inspect headed Chromium at `1440x960` and
  `390x844`; assert prose/exercise counts, section boundaries, readable formulas/tables, no
  overflow, zero figures, and no answer-key data in the initial browser document.
- On localhost, inspect the actual shared math-input component and virtual keyboard using existing
  published textbook content. Record that the two target `/card/...` routes remain pending until
  an authorized publish because their database rows do not exist.

Pass: all positive inputs are accepted, paired wrong inputs are rejected, controls open a usable
math keyboard, and both lesson renders satisfy desktop/mobile assertions without leaking answers.

## AC3 - Isolated real figure sample

- Use published `5m` lesson `math5-c1-s2-n16`, source `fig-67`, and its current deterministic
  FigureSpec in a ticket scratch copy.
- Run current spec validation and JSXGraph rendering, compare source inventory and mathematical
  relations, replace the copied lesson's SVG with the regenerated output, and render the copied
  lesson.
- Inspect source, regenerated figure, isolated lesson render, and localhost product at both required
  viewports; assert complete labels/grid/points, no clipping, minimum text size, and semantic CSS
  colors rather than a fixed green theme.

Pass: deterministic generation and embedding checks exit zero and headed browser evidence is
readable at both viewports. This proves this representative figure class only.

## AC4 - Rebuildability and project checks

- Re-run the affected pipeline from the saved checkpoint-derived sources and compare output hashes.
- Run the current shared positive/negative contracts plus the project mechanical defence from the
  Charter.
- Record imported source commit, generated counts, retries, elapsed time, known usage, unpublished
  status, and uncovered figure modes/classes.

Pass: deterministic affected outputs reproduce, all required checks pass, and the handoff does not
claim publication or ten-volume coverage.
