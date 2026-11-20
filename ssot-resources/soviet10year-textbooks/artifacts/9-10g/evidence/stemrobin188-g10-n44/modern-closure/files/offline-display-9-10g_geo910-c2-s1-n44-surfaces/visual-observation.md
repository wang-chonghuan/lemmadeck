# N44 Surface Visual Observation

Status: **PASS, surface-only**. Sole independent observer; actualImages: **4**. All four existing full-page screenshots were opened in one batch. Their SHA-256 hashes were recomputed locally and match `result.json`. No images were generated and no rendering was rerun.

## Display Findings

- Both text surfaces show the complete expected prose from the opening O/M correspondence through the final distance formula, the coordinate definitions, all three worked examples, and four modern figures with captions 6-9. The assignment's expected rendered-prose count is 23; current modern JSON has 10 text blocks, four figure entries and four caption entries. This is static-image coverage verification, not a new DOM paragraph count.
- Figures retain readable O/M, A/B/C, x/y/z and vector i/j/k labels where present. Arrowheads, point markers, construction segments and dashed extensions are distinguishable. No missing geometry labels, blank glyphs, visible KaTeX errors, clipping or overlap were observed.
- Vector accents, arrows, subscripts, superscripts, negative signs and fractions are legible. The mobile distance radical is tight to the content right edge, but all three squared terms and the closing parenthesis are visible.
- Exercises 16-22 are complete on both surfaces. All five subparts of 16, both subparts of 17 and all three subparts of 20 are visible, as are the complete requests in 18, 19, 21 and 22.
- Text titles fit on one line at both widths. The exercise title fits on one desktop line and wraps cleanly to two mobile lines without colliding with the printed-page label.
- The text-end link identifies 7 exercises; the exercise-end return-to-text link is visible. Link behavior was not tested.
- Recorded document widths equal viewport widths in all four observations: 1440 and 390 px. There is no observed horizontal document overflow.

## Recorded Measurements

| Surface | Viewport | Title Width | Figure Widths | Minimum Figure Text |
| --- | --- | --- | --- | --- |
| Text desktop | 1440 x 960 | 684.8125 px | 4 x 480 px | 28 px |
| Text mobile | 390 x 844 | 358 px | 4 x 358 px | 20.883333333333333 px |
| Exercises desktop | 1440 x 960 | 684.8125 px | None | Not applicable |
| Exercises mobile | 390 x 844 | 358 px | None | Not applicable |

These are the actual layout measurements recorded in `result.json`, not estimates from the image viewer.

## Actual Image Evidence

Text desktop:
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/offline-display-9-10g_geo910-c2-s1-n44-surfaces/geo910-c2-s1-n44/text-1440.png`

SHA-256: `261fbf36062778316dda448cf7c5a466e78e5c77e6b9953084ebc94be4beff82`

Text mobile:
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/offline-display-9-10g_geo910-c2-s1-n44-surfaces/geo910-c2-s1-n44/text-390.png`

SHA-256: `745b15df24d17f6548580fd6c555f4df8112c2458b6f4ca54803a79ae2bac58c`

Exercises desktop:
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/offline-display-9-10g_geo910-c2-s1-n44-surfaces/geo910-c2-s1-n44/exercises-1440.png`

SHA-256: `cf986c0ac87701aa85a7137b7f3e3b4f9eecffe5fe269b7a042a663c309b8d8a`

Exercises mobile:
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/offline-display-9-10g_geo910-c2-s1-n44-surfaces/geo910-c2-s1-n44/exercises-390.png`

SHA-256: `105ab80b6004f478ac59ed0e9b711ddee6ab1a69126fafa121b654ee8f20be3d`

## Scope And Preservation

Mathematical, figure and source PASS are inherited and were not rereviewed. This observation does not approve the whole lesson, answers or choices, verify fresh render execution, or close the ticket.

Only `visual-observation.json` and `visual-observation.md` were written. `result.json` retains its existing `mechanical display pass; visual inspection pending` status; it and the four PNGs were left unchanged. No other reports, answers, choices or original source images were read. No setup, network, environment work, rerender, backend work or core edits were performed.
