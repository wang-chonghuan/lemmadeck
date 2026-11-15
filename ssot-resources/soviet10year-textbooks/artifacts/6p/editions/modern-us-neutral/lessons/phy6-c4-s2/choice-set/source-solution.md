# phy6-c4-s2 Independent Author Source Solution

Internal source-first work, not an answer key obtained from another author.
Only the prepared seed, current allowed modern lesson projection and actual
approved figure100/original/spec were consulted. No answer-source, authored
answer keys, previous choices, interactions, reviewer solutions or history.

Seed canonical SHA256:
`3be6ff75aa0c91884195082082948f601ec9806e56b476344669c3945ef49ebb`.
Selected all four source numbers1,2,g2-1,g2-2; concept blocks0,1,2,5,9,10.
Solved numerical example blocks11-13 are not seed data.

## Figure Observations And Conventions

Original PNG actually opened alone: complete joined unequal-width cylinders,
two approximately level piston bands, six labels A/B,S1/S2,F1/F2, downward force
arrows. Approved modern SVG actually opened via isolated headless at306 and640,
with full right and bottom boundaries visible. Each contains the six correctly
associated labels; measured text20.08125px at306 and42px at640.

S1 is the smaller left piston's area; S2 is the larger right piston's area.
F1 and F2 in the shown equilibrium convention are external downward forces,
not both pistons' motion directions. The liquid reaction on a loaded output
piston is upward, with equal magnitude to its balancing external load in the
ideal approximation. Neither drawn width nor arrow length supplies a measured
area/force ratio or stroke. Liquid dash texture is not a numerical grid.

Modern SVG SHA256 `ad4fcbca85e82aac178afe687a9c722e111d3a897e211734907b41c8fac30ace`;
original PNG `b084c7cb7596084c85e551fde2d8f32e555764db6e76277c81f12f61bf61df6b`;
spec `ccbe270068198ec5f0bef0e660cf353d801fe6285abb86b8fc8e805a0ee02b3c`.
Spec observation only; no figure regeneration or new figure approval.
The spec's full text was not used to import worked-example values or unselected
paragraphs into the seed.

## Source1: Applied Law

Task: identify the law supporting a connected liquid machine, and understand
what is transmitted rather than confuse pressure with force.

The applicable law is Pascal's law: an externally imposed change of pressure
is transmitted through a confined fluid. For a hydraulic machine this allows
the imposed pressure on the small piston to act at the large piston too.
It does not mean that the same force acts on different areas. Nor does it
erase the fluid's weight: total pressure can differ at different heights.
Naming a law alone is weaker than explaining this distinction.

## Source2: Force Gain And Its Dependence

Task: determine the symbolic force gain under all given ideal conditions,
and identify the controlling geometrical quantity.

Retain: negligible friction and piston weight, equal external pressures, and
equal lower-piston heights. Let F1>0 denote the applied force magnitude.
At the small piston the added pressure is p=F1/S1. Equal external pressures
and equal heights remove the external-pressure and liquid-column differences
from the equilibrium comparison. The same added pressure gives F2=p*S2.
Consequently F2/F1=S2/S1; since S2>S1, the output/balancing force is greater.
The gain is the large-to-small AREA ratio, not its inverse, the diameter ratio,
an arrow-length ratio, or a comparison of total force with pressure.
For round pistons S is proportional to diameter squared, so a diameter ratio
alone cannot be used linearly as the force ratio.

No areas or numerical upper bound were supplied. A numerical gain cannot be
read from the figure. The ideal relation is not a promise of unlimited useful
force in a real machine; omitted friction, height differences and structural
limits matter. Do not assert the relation for unequal heights without the
stated liquid-column approximation.

## Source g2-1: Necessary Displacement Cost

Task: explain the cost of force gain by relating the actual two piston motions,
not merely recite that there is a tradeoff.

For a sealed, nonleaking hydraulic machine with negligible liquid compression,
let the small piston move down by h1>0 while the large one moves up by h2>0.
The volume displaced on one side equals the volume delivered to the other:
S1*h1=S2*h2. Hence h1/h2=S2/S1. If the force gain is k=S2/S1>1,
the large piston moves only h1/k; for a fixed desired output lift h2,
the small piston must travel k*h2. Force gain is paid for in displacement,
not by obtaining proportionately more work.

In the ideal lossless comparison, also neglecting changing hydrostatic head,
F1*h1=F2*h2. A real machine has input work at least the useful output work
because of losses. This is not a claim that all practical strokes have equal
input/output power, or that a static force ratio determines elapsed time.

The source asks for this physical reasoning but does not explicitly list the
volume and stroke approximation. Any authored choice applying these equations
must visibly declare sealing, negligible liquid compression, and the
hydrostatic/friction/piston-weight approximation; not silently treat an
arbitrary changing-height stroke as equal-height equilibrium.

## Source g2-2: Air As Working Medium

Task: judge feasibility, give a physical reason and compare media.

Yes. Confined air can transmit an externally imposed pressure and exert force
on a piston. Its compressibility does not prevent pressure transmission.
Under an appropriate static/quasi-static pressure comparison, the force
exerted by pressure still depends on the loaded area.

Unlike an approximately incompressible liquid, air readily changes volume.
Some input piston travel can compress the air rather than immediately deliver
an equal volume to the output cylinder. Thus a gas-driven device cannot be
assigned the hydraulic stroke identity S1*h1=S2*h2 without accounting for the
air's volume change. With both strokes zero or with special operating controls
it might happen to satisfy that equality; the error is asserting it must hold
for every compression process. A categorical denial of any transmitted force,
or of pressure force depending on area, is also false.

This comparison requires no invented pressure, gas temperature, geometry,
air equation of state, pump specification or data from another lesson.
Quantitative transient air behavior is outside the supplied task.

## Capacity And Response Planning Before Draft

The two equilibrium prompts share one meaningful response unit: apply the
named law to the symbolic force/area relationship under the full ideal
conditions. The motion-cost problem is a separate unit about volume,
opposite piston motions and work; the gas comparison is a separate medium
judgment. Three substantive units can therefore cover four written prompts;
there is no quota or one-option-per-blank mapping.

Choice recognition cannot demonstrate independent recall of the law,
constructing the algebra/volume argument, or writing an original explanation.
Those production losses must be explicit in draft intent/coverage, while all
four original written questions remain in the durable course and seed.
No hand-on construction or new figure is authorized/needed.

This file is frozen before draft.json or view.json is written; freeze-source.py
verifies their absence and records current file/seed/observation hashes.
