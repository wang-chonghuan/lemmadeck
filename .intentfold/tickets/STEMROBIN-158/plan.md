# Plan

## Findings

- STEMROBIN-151 was cut before the shared fixes merged. Importing its whole branch would revert
  current answer-normalization, errata-binding, lesson-flow, and skill changes; only its `7a`
  product resources are reusable.
- The page 12 faithful artifact changed the printed intermediate numerator from `a+b+c` to
  `a+b-c`. Page 13 preserved a printed false identity but did not register it as source-bound
  errata, so the modern edition could not correct it through the current contract.
- The six recorded MathLive failures map to exact-answer parts already present in the two answer
  keys. Current main contains the shared real-edit serialization gate and paired negative cases.
- The live content database has no rows for the two target lessons. The existing published
  `math5-c1-s2-n16` lesson contains deterministic `fig-67` and can exercise the real app figure
  surface without writing production data.

## Route

1. Import only the `ssot-resources/.../artifacts/7a` subtree from checkpoint `a9918cb...`.
   Restore the page 12 printed formula, register both page 12 and page 13 errata against stable
   blocks, and rebuild only the affected raw assembly and modern edition.
2. Preserve lesson IDs, exercise IDs, corrected transcription, section boundaries, answers, and
   interactions that are unaffected. Re-finalize answer keys and interactions with the current
   skill so the two lessons consume the real MathLive contract.
3. Run the six lesson-specific real MathLive edits and paired wrong inputs through the shared
   checker and production judge. Render both lessons with the official lesson renderer and verify
   desktop/mobile readability, structure, counts, and absence of figures.
4. In ticket scratch, copy the existing real `5m` figure lesson, regenerate deterministic
   `fig-67` with the current image tool, validate its assertions and theme-neutral SVG, embed that
   output in the copied lesson, and verify the rendered lesson plus the published localhost app at
   desktop and mobile widths.
5. Run the ticket AC script and the project mechanical defence once, commit and push the verified
   result, then record the review handoff while keeping port `52158` running.
