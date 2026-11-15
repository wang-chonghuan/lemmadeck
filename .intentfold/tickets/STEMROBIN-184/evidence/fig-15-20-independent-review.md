# STEMROBIN-184: Independent Current Fig-15 Through Fig-20 Review

Date: 2026-11-15.
Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Result: **PASS for all six figures within the requested review scope.**
Required corrections: **none** for the hashed snapshots below.

## Scope And Method

Read `.agents/skills/ld-s10y-image/SKILL.md` and its `references/quality-gate.md`.
Independently opened all six original `artifacts/6-8g/figures/fig-NN.png` images
before comparing any current FigureSpec or preview. Original observations,
not reused spec inventories or renderer status, established the expected objects.

Then read each complete current spec, including its full
`source.authoritativeText`, and compared the SVG, render JSON and actual preview
PNG in `.tmp/s10y-image/6-8g/fig-NN/`. No answers, choices, other reviewers'
reports, or source solutions were consulted.

Opened the actual current SVG bytes in offline Chromium using the app's existing
Playwright dependency, without rerendering the figures. Browser version:
`149.0.7827.55`. At device scale factor 1, inspected all six SVGs at their
full 560 px canvas width and at actual media widths 280, 310, 343 and 358 CSS px.
Fig-15's full canvas is 560 x 440; the other five are 560 x 320.
Screenshots were emitted for visual inspection from in-memory buffers only.
No screenshot, harness, crop or other evidence file was written.

Measured each visible SVG text element using its computed font size and
`getScreenCTM()` transform, and inspected its screen bounds against the actual
SVG bounds. Also enumerated visible point markers and line endpoints, rather
than counting hidden JSXGraph helper elements.

Browser context was offline and requests were blocked; observed network requests:
zero. The browser/context were closed. No image/spec/page/pipeline edits, model
calls, installs, environment access, DB access or production operation occurred.
Only this Markdown report was written. Other changes were preserved.

## Per-Figure Results And Direct Visual Evidence

| Figure | Result | Independent original observation and current visual comparison |
|---|---|---|
| fig-15 | PASS | Original has two subfigures: ascending segment A,M,X,B with M/X strictly inside A/B, then a horizontal line extending beyond marked A and B. Current SVG and preview show exactly those two arrangements, six visible dots total and eight text labels including `(a)`/`(b)`. Upper M and X remain on the segment and strictly interior; lower stroke extends on both sides. No measurements or equality marks appear. |
| fig-16 | PASS | Original shows P,M,O,N,Q in order on one line, with lower-right lowercase p naming the line. Current SVG has five dots in that order and six labels P,M,O,N,Q,p. Lower-right p is text, not another point. The line extends beyond P and Q, and O remains between both M/N and P/Q. |
| fig-17 | PASS | Original begins at A, then marked D,B,C along an ascending stroke continuing beyond C. Current has four visible dots A,D,B,C in that order and an unmarked tail past C. No invented far endpoint marker, arrowhead or distance annotation. |
| fig-18 | PASS | Original has exactly one marked dot A at the start; B is text below the far part of the ascending stroke, without a B dot. Current SVG has exactly one visible ellipse, A, and two labels A/B. B is a separate text object; the far stroke endpoint has no visible dot. Preview and all width views preserve the source's unmarked-B presentation. |
| fig-19 | PASS | Original segment ends at A/B with L then E inside; C is above and left of E, D above and right of B, M below E. Current shows all seven dots and all seven labels A,L,E,B,C,D,M with the same on/off-segment relationships. Stroke stops at A and B: no line extension. No membership symbols, classifications or answer highlighting were added. |
| fig-20 | PASS | Original named line a has marked M,A,B in that order, with line continuing beyond the outer marked points. Current has exactly three visible dots M,A,B and four labels M,A,B,a; lowercase a is a lower-left line-name label. No X, locus, answer shading, cutoff, arrow or answer-bearing annotation appears. |

Complete authoritative-text comparison:

- fig-15: the entire supplied prose defines the segment and its endpoints,
  explicitly calls X/M interior points, and distinguishes the containing line.
  Both source subfigures remain present and unambiguous.
- fig-16: the entire supplied prose describes points left/right of O and the
  two nonempty subsets; the five-point order and line-name label support it.
- fig-17 and fig-18: the entire shared prose permits names AB/AC/AD and explicitly
  says B is generally not specially marked in fig-18. The current visible-dot
  distinction between the two figures matches that statement.
- fig-19: supplied exercise 48 asks membership in segment AB; the figure provides
  the original points and geometry without printing membership answers.
- fig-20: supplied exercise 55 includes all three conditions about X relative to
  M/A/B. The figure retains only the given M/A/B arrangement, leaving the requested
  loci unannotated.

## Concrete Current SVG Geometry

Coordinates below are SVG canvas pixels, not source measurements.

| Figure | Visible current geometry |
|---|---|
| fig-15 | Upper A=(60,190), M=(200,150), X=(340,110), B=(480,70); M/X have segment parameters 1/3 and 2/3, strictly inside. Lower line runs (20,360) to (540,360), with A=(190,360), B=(380,360). |
| fig-16 | P,M,O,N,Q have x=50,150,300,410,510 at y=160; line extends x=15 to 540. |
| fig-17 | A=(50,260), D=(170,220), B=(300,176.667), C=(450,126.667); unmarked stroke end=(520,103.333), beyond C. |
| fig-18 | Sole visible dot A=(50,210); stroke ends at unmarked (515,120). No visible B marker. |
| fig-19 | A=(30,240), L=(150,216), E=(290,188), B=(420,162) lie on the segment; C=(200,80), D=(525,90), M=(290,275) lie off it. Stroke endpoints are A/B. |
| fig-20 | M=(120,160), A=(250,160), B=(430,160); line extends x=20 to 540. No fourth visible point. |

The originals contain no given lengths, coordinates, ratio/equality marks or
ticks. Current coordinates, spacing and horizontal regularizations are schematic,
not source data. In particular, fig-15's equalized upper gaps are not presented
as given distances: there are no equality marks or numeric labels. All required
orders, incidence, strict interior/exterior relationships and continuing strokes
are preserved. The figures introduce no mathematical value claim.

## Width, Clipping, Collision And Language Checks

Each row covers all six SVGs, totaling 30 figure/width views.

| Actual SVG media width, CSS px | Smallest effective text size, screen px | Outcome |
|---|---|---|
| 280 | 16.000000 | PASS |
| 310 | 17.713636, fig-15; 17.714063, others | PASS |
| 343 | 19.600000 | PASS |
| 358 | 20.456818, fig-15; 20.456250, others | PASS |
| 560 | 32.000000 | PASS |

These are independently measured screen-transform sizes, not merely the source
font-size attribute or copied renderer numbers. Actual SVG widths equal each
declared width. All visible text meets the 16 px minimum, including tags and line
names. All views are nonblank, show complete geometry and agree with current
preview PNGs.

No visible text falls outside the SVG, no label-label screen rectangles overlap,
and visual inspection found no label/point/stroke collision or clipped geometry.
Minimum text-to-canvas clearance at 280 px, in figure order 15 through 20:
`2.2375, 18.7734, 5.2375, 3.7375, 9.2188, 19.7000` screen px.
Fig-15's left A is close to the edge but remains fully visible; it is not clipped.

Visible text is restricted to Latin mathematical labels and `(a)`/`(b)` tags.
No Chinese/Cyrillic prose, cultural symbols, units, invented measures, membership
answers or locus annotations appear. Uppercase point names and lowercase line
names remain distinct.

Visible text/line colors resolve through semantic ink variables. Offline neutral,
accent-ink and print overrides resolve to dark ink on white:
`rgb(21,32,31)`, `rgb(16,47,56)` and `rgb(0,0,0)` respectively. Paper remains white.
Hidden renderer helper geometry is not a visible point, colored annotation or
source-inventory addition.

## Currentness And Boundaries

All six current render reports have `status: pass`, zero reported collisions,
and passing display checks at all five declared widths. Independently computed
source PNG hashes match `source.image.sha256`; spec and SVG hashes match their
current render-report bindings. Every inventory object/assertion ID resolves.
All 30 reviewed input files were rehashed after inspection and were unchanged.

This is a bounded source/figure/layout review, not a claim that an edition
validator, full offline lesson render, live app or formal promotion workflow ran.
Temporary paths in these staging render reports are not certified as durable
promotion metadata. No formal `review@1` artifact was authored because the request
allows only this report.

## Actual File SHA-256

Source PNG root:
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/`.
Current output root: `.tmp/s10y-image/6-8g/fig-NN/`.
Hashes are from actual bytes, not copied metadata.

```text
fig-15
source PNG eb292aa8904f09f19c4ff1febf81c0abd3df7089c4e428ee75d252506a0c6c27
spec JSON  dfc25557c5afe330ba5a9bfef436e4e216dc11d2a053157660aba6224cae61aa
SVG        d687066ffeb9a26ea0b4485c337783d4f102193344832fdc4a53ce1579bf0fab
render JSON 2072ec8eab888518a906c44df184b53391fa600a1e497a0afbdfc2dd0bcfb9c8
preview PNG e275685d2ae05aa5ce46e9170f0bbaba013498e0f6415adf58f9b67ae2d16ccf

fig-16
source PNG 31b96389d45ae129edc15b73a0cef1d959d4559e999e932e4c566f6b3b26dca7
spec JSON  ec65b8e02f25e05db89ccb73cd9d244005b0a153762dc6b18ff89ad7fe379494
SVG        213e819a7308d14ad245caf9fd19500564666e18a16aa6284f07e8b11b77f926
render JSON 748e424901e7d8146d409ccd72cfb1dacf5be9165edb6768d2a6eca5a7df7808
preview PNG 16ea2c57ce205b9aab96b6b83ce141efe5d20a750d1ea2bcb78308de163fd850

fig-17
source PNG b4d2fd70e04d0a332f49b9ded5d9e5aa948f9814fe29136782a68d4bcb3c505b
spec JSON  e9d7c70b45eecaf3c14242beb577daa07ece7a46945bd082d17a45b4756f6c8d
SVG        3a5bdf6d8bbd0fc8706fe46d7502ac7f4fe1501ff08637351511de613ecf26fd
render JSON f05cbde725d942541cf154e4943fe61ab1269242054991f4542b57e5a721c1c2
preview PNG 933e6685bb4bcb6561d0efb1d4099a9e80469145ee4618e5da627e5469fab0a6

fig-18
source PNG a29dffdc396aeea3d98b96aa0b58a9044b58c1ca6be87061fdb25f8833455f1b
spec JSON  b6224829a83d7358c35f5ffc60fad1cf7983f736f632667934feba9efb5a03c4
SVG        b17bb66720203bf2bb1563018c25e60545ce6a5facd3e5b4636afdf9559a3867
render JSON 94c9a84e5d2eb8206d49e9f1481866abd4dfb80c83909eeb123ca4a0cff06e53
preview PNG 9f3fc66d317631179d5348ad546451c98d492e2b683ee11bd5bcd0acdfd4ad7d

fig-19
source PNG 144c1092b8af4f1f557018af98b518d0a8fa902f20e26d6a72e7db4ce991f311
spec JSON  45f8edb29ceb888ad7f90b3801723a96099bb01a62fb8d44d4b0b8fa9c56a336
SVG        6235bf38626343febc1c2feeb07898851dbcd094467150f19a639799f4acde12
render JSON dd211e640b3322ab8781e2fe728076792b862b148884e48223ba6dcee10857f0
preview PNG 0c5bc3a044832246cc21a07a65c677207348fc9ba9ec13b9d658d095e49090bc

fig-20
source PNG 562f869cea3d07eb3c4d693c4a1cc9dc846d3f5e7e4e122c0f6bc67951916efa
spec JSON  546655737a0e05b11b8a919941fccbd4dc47dc9676dc687634756b8e84722b69
SVG        a5d147d219ded67279b06be6028f2afb93180e181b4875964635bc2701813ad6
render JSON 7e95d376e287126b12b0bcff7f4bbd8e2cdaddbe519275bf8bb7ad7bb0971920
preview PNG a953bb7fc0f646ba511226cf3da242fdb747d41b3c7730a67aa2302ed3c24efc
```

In-memory screenshot SHA-256, one six-figure contact sheet per exact media width:

```text
280 px 623ece38b9a29b1d38c5213e637d25abbdf35d9614b20090e09fa197c8598348
310 px 99d2adb5e756f92d7016d09c2832135327306ee60bac53ddb1134aff352fb3e4
343 px 48df2817c7603876ed930cf62f06d0b40fa9a343c1ff9e61d158fe47c8b87cc4
358 px f5b4063c6475e2e00ba107ca2e484064e2ea0023a62a89be8ed362f1c75200da
560 px 9de2a6d7de24d93bba1015593a83e694f915c386f5c20f68c51a4fa642ee323a
```

Review complete. No corrections made or requested; no further action taken.
