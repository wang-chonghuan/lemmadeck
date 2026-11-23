# N59 affected-only blind source solutions

Reviewer: Codex, separate from the authors and Tesla's initial review.
Date: 2026-11-23. Scope: source 984, source 992, and the new authored
quadrilateral only. This is not a fresh review of the other 39 questions.

## Disclosure boundary

Before this record was written, I read only the two selected seed exercises
and the selected decimal-subtraction definition, the skill contracts, the
actual new complete PNG, and the actual rendered SVG. I did not read current
draft options/keys/intent, FigureSpec authoredBasis, author reports, or earlier
reviews. Hashing existing files did not disclose their contents.

## Source 984

The lake has no river current: 3 h at 27 km/h gives 81 km. On the intended
continuous journey from the lake into its inflowing river, motion away from
the lake opposes the current, so river speed is 27 - 3 = 24 km/h.
Four river hours give 96 km; total distance is 81 + 96 = 177 km.

The source does not literally say "upstream." Its lake-to-inflowing-river
sequence supplies the intended direction. If the river leg instead meant
downstream, the answer would be 81 + (27 + 3)*4 = 201 km. A repaired view
should make the intended journey direction clear without giving the
subtraction or answer. Ignoring the current gives 27*7 = 189 km;
applying upstream speed to all seven hours gives 24*7 = 168 km.
These latter numbers are independent diagnostics, not consulted author keys.

## Source 992

"Draw a quadrilateral and measure each angle" has no unique numeric solution.
The learner chooses a simple quadrilateral, draws its four joined sides, and
uses a protractor at each vertex, measuring interior rather than exterior
angles. For a convex quadrilateral the four interior angles total 360 degrees.
A preselected drawing can assess four-angle measurement/recognition, but
cannot assess independently choosing and constructing the quadrilateral.
That production loss must be explicit in internal coverage/limitations.

## Actual selected quadrilateral

Opened exactly once:
`ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/lessons/math4-c2-s2-n59/choice-set/figures/evidence/fig-choice-4m-992-measure.full-normal640.png`

PNG byte SHA-256:
`aeb15f48bacb1f6997d638f774c15681461d94a4c7dceee7b03f8a256793de98`

Actual geometry read from:
`ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/lessons/math4-c2-s2-n59/choice-set/figures/fig-choice-4m-992-measure.svg`

SVG byte SHA-256:
`b2f409245c84524c838bc1e46ab480b8edba36b6a8f1c015b9f69d7950f7049b`

The PNG is a complete 640 by 600 image. A is bottom left, B bottom right,
C above B, and D above and left of C. AB is horizontal, BC vertical,
CD slopes up-left, DA slopes down-left. All four junctions, all four
edges, and all four English vertex letters are visible. There are no
angle values, angle arcs, right-angle squares, construction auxiliaries,
or answer words. In particular C, B, and AB are not cropped.
This single native-width image covers full and normal-640 viewing identically.
Image usage: one batch, one new image, one open, cumulative one; no crops,
reopens, original scans, or fig223 image.

Actual SVG screen vertices (not authoredBasis):
A=(70,530), B=(570,530), C=(570,330),
D=(326.2177826491071,86.21778264910705).
The SVG is width=640, height=600, viewBox="0 0 640 600", so its screen
coordinate axes have equal physical pixel scale.

For each vertex use its two incident screen vectors and
acos(dot(u,v)/(length(u)*length(v))). Independently calculated interior
angles are A=60.00000000000001, B=90, C=135,
D=75.00000000000001 degrees; the sum is 360.
AB=500 px, BC=200 px, CD=344.76011804301845 px,
DA=512.4355652982142 px.
Equivalently DA rises at 60 degrees to AB, CD has equal horizontal and
vertical components, and D's incident directions differ by 75 degrees.
The visibly selected convex quadrilateral therefore measures
(A,B,C,D)=(60,90,135,75) degrees, independently of any eventual key.

This is a new choice drawing, not recovery of a source image. Source 992
has no figure_ids; no original-source image or original figure geometry
has been invented.
