# n26 FIRST Independent Whole-Lesson Display Review

Date: 2026-11-23. Ticket: STEMROBIN-180.
Reviewer: sole independent semantic/display reviewer, not the producer of
these screenshots. Exact cwd for every command:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.

## Verdict

**PASS for the retained current whole-lesson desktop/mobile text display.**
No affected display unit requires a correction. The two actual saved
screenshots and two screenshot-derived native formula crops were inspected.
No source image, FigureSpec, separate figure batch or fulltext/science review
was reopened. No browser, renderer or stable keyboard test was rerun.

This review covers the headless offline whole-lesson surfaces, not a DB write,
production readback or a separate deployed-product session. The earlier
wholetext/science and Figure80/81 PASS verdicts are reused within their
unchanged substantive scope.

## Current Evidence Bindings

Directory for this report and the following display evidence:
`ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c2-s1-n26/display/`.

| Actual evidence | SHA-256 |
| --- | --- |
| `check.json` | `69830b898c488dd15e528ba4a9c7891562d307932d082c1a56e0e124e90aa2e2` |
| `desktop-text.png` | `eb412d698eff8880e774d4e123d29ad7a7921dde8fa459d3d5bc2fe4bd60fe97` |
| `mobile-text.png` | `d2e6a52ef77e87706a9aa13d400c361620c22502924dadd2ef22d21f36b45220` |
| `desktop-formula-detail.png` | `7b4d13c930661ae8146db8535070ecd752c2336ad35636d3fc40df129c623824` |
| `mobile-formula-detail.png` | `40c50213ca80c5fbd03185eaca4d55806ecdfb32854368d9937dbf0235ee6b35` |

All four current input bindings in `check.json` were confirmed against the
actual files without repeating their substantive reviews:

| Current input | SHA-256 |
| --- | --- |
| `../lesson.json` | `82e83b89f1df4b1cf3fb25366bc9b72001f8c9c4103c6ccc5a84afbf23a80610` |
| `../exercises.json` | `82a855d984deaabbc9f23a4b6e639c79ca21eb2a7925ca7183f942d7213ae3d0` |
| `../figures.json` | `b63cdce1cb78b1b1c69b8034066deb309d4c1f668414d32a4ea3ce9a6ce1ea96` |
| `../answer-keys.json` | `34d8dff027568ffddc16987d4805895ad46e65e4dd1fdc786053eeac699a6738` |

Finalized lesson/metadata hashes differ from the earlier draft bindings; this
display PASS binds the finalized inputs above, not the old draft hash.
The parent reports successful adapt-finalize with 3/8 layout changes, 0/0
exercises, two figures, and one successful render with 14 display entries.
The actual screenshots and current metrics agree with 10 paragraphs,
two figures and two captions. No additional course or exercise surface was
invented to fill the empty exercise/answer set.

## Actual Display Observations

- Desktop screenshot is 1440 x 2840 pixels from viewport 1440 x 960; mobile
  screenshot is 390 x 3258 pixels from viewport 390 x 844. Both include the
  title, introductory prose, complete derivation, final absolute Moon mass,
  both figures, both captions and the last existing zero-exercise link.
- Both surfaces show 10 distinct paragraphs. The three visible separators
  resolve to paragraph indices 4, 6 and 9: the center question to P/orbits;
  radius/experiment context to acceleration ratio; relative mass to absolute
  mass. No paragraph is missing, duplicated or merged across a separator.
  All 10 recorded text indents are `0px`.
- Prose wraps naturally on mobile. The introductory `384000`, later `380000`,
  `4700`, figure references 80/81 and section reference 23 remain visible.
  Chinese text, punctuation and inline Latin/math characters are readable;
  no raw dollars, LaTeX commands, HTML markup or duplicate visual MathML text
  appears. The metric's accessibility/math text serialization is not treated
  as a visual duplication defect.
- The acceleration-magnitude fraction chain, radius/reciprocal-mass equality,
  `380000/4700` approximation to 81, `1/81`, Earth mass `6 x 10^24` kg and
  the closing Moon-mass expression ending in `7 x 10^22` kg all render.
  Native formula crops show readable signs, numerator/denominator ordering,
  subscripts and exponents, with no clipping or collision. The final unit
  `千克` appears both in the numerator and after the final approximate mass.
  This is display inspection, not renewed scientific adjudication.
- Recorded math/number families begin with `KaTeX_Main`; measured size is
  18.656 px against Chinese parent size 16.96 px, ratio 1.10 on BOTH surfaces.
  Relevant saved-render CSS also specifies `font-size:1.1em`. Normal fractional
  script sizing does not indicate a mismatched base font.
- Both current figures render at actual media size 640 x 640 px on both
  surfaces. Geometry is present (115 and 15 measured geometry nodes), with
  six visible labels per figure, minimum label size 18 px, and no recorded
  label overlaps. Desktop shows both complete diagrams clearly. Their
  already passed geometry/source relationships are not re-reviewed here.
- Mobile shows the initial left-hand windows of the two fixed-width scrolling
  figures. The visible cutoff is confined to the figure scrollers, not a
  clipped/shrunken whole page or blank asset. Both actual captions `图 80`
  and `图 81` sit below the correct media, and the final caption/link remain
  visible after the complete content. No figure/caption overlap was found.
- Document widths equal document scroll widths: 1440/1440 desktop and
  390/390 mobile. `rawMarkup` is false and console-error lists are empty for
  both text surfaces. No broken raster, missing diagram, black canvas,
  title/prose collision or whole-page horizontal overflow was observed.
- Both surfaces record zero written questions, answers, choices and options.
  The existing link truthfully displays 0 questions; there is no fabricated
  answer, choice, interaction or extra exercise screenshot in this review.

## Reused Figure Scroll Evidence

Horizontal-end reachability is reused from the earlier independently passed
current Figure80/81 headless inspection, not represented as a fresh scroll
measurement in the new `check.json`. That earlier evidence records 640 px
media, a 331 px mobile fixture host, scroll end 309/309 px and a reachable
right edge for both unchanged figures.

The current whole-lesson screenshots/metrics retain 640 px media; the saved
rendered HTML retains `data-figure-layout="scroll"` and figure-local
`overflow-x:auto; overflow-y:hidden`. Relevant app CSS retains the same
scroll contract and 40em media sizing. Its SHA-256 is still
`9fdcb8b3060e0cd0a6b97bf8a32f18c924b60a18226fa8c0d1a485221277168f`,
matching the prior figure inspection's CSS binding. This is applicable reuse
of the existing passed display contract, not an invented current numerical
scroll-end value. No right-end screenshot or browser replay was required.

The durable resource-owned exact figure-review copy is present at:
`ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s1-n26/figure-review.md`,
with unchanged SHA-256
`bcc56a9cb614378a2166f9eed9ed280ca741c8a753e2ea71f0f9063bf7055148`.
The parent-retained `figure-review-evidence/` and `figure-author-evidence/`
directories also exist under that same raw lesson owner. Their original
ticket/raw copies and frozen inventory remain untouched. This review did
not reopen those image batches or relabel headed author history.

## Image Usage and Ownership

Actual image loads this phase, in order:

1. Existing `desktop-text.png`.
2. Existing `mobile-text.png`.
3. Native `desktop-formula-detail.png`, cropped from desktop screenshot pixel
   box `(365,835,1075,1305)` with no resizing or added marks.
4. Native `mobile-formula-detail.png`, cropped from mobile screenshot pixel
   box `(10,1155,380,1760)` with no resizing or added marks.

**4/6 images this phase; 12/24 cumulative in this reviewer context**
(prior figure phase 8, earlier wholetext phase 0). No screenshot was reopened
in full, and no original/figure asset was loaded in this phase.

Only this display review and the two optional screenshot-derived crops were
created. The existing check, screenshots, rendered HTML, lesson content,
figure geometry/reviews, author history and previous independent reports were
not edited. No Git, DB, install, paid call, browser/renderer run, keyboard test,
message, new thread/worktree, suite or polling occurred.
