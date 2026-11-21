# Independent source-first freeze

State: FROZEN before any candidate, author inventory, numerical ledger, manifest,
report or draft HTML was read. Recorded after source views 1-4 and text/hash
receipts at 2026-11-21T14:35:19Z. Do not rewrite this inventory after Stage 2.

ROOT: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck
Ownership: .tmp/stemrobin-184-six/n81-second-figure-review/ only.
Scope: STEMROBIN-184/184-6, n81 figures 17-20, offline, finish=review.
Initial images: 0. Current images: 4. One batch of exactly 8 is authorized.
No source reopen, crop, raster decode, new capture or other image is authorized.

## Actual input receipts

- Scope read: exec 422519, exit 0.
- Current local skill: exec d908d3, exit 0.
- FigureSpec contract: exec 209fde, exit 0.
- Quality gate: exec 2d92dd, exit 0.
- Full approved DRAFT lesson/exercises read: exec 682b1b followed by complete
  compact JSON exec 41fb00, both exit 0. The second read resolves the first
  output's truncation of duplicated embedded source text.
- Source hashes: exec 658673, exit 0. Timestamp: exec 5e0056, exit 0.
- view_image calls 1,2,3,4: fig-17.png, fig-18.png, fig-19.png, fig-20.png
  respectively, each returned its full source image successfully, once only.
- All shell commands explicitly used cwd ROOT.

SHA-256 bindings (paths below are ROOT-relative):

| Input | SHA-256 |
| --- | --- |
| .tmp/stemrobin-184-six/n81-second-figure-review-scope.md | 80a4e74bae6487ddef191fbbad9a1cf268095f9ab44f8fcfb32b56fda8167b6e |
| .agents/skills/ld-s10y-image/SKILL.md | e3cdfc32a6bbe5915ad34517327cfe62e880ce0f776500643852eda58f22b40d |
| .agents/skills/ld-s10y-image/references/figure-spec.md | 0de03f32aa271aed552d51d41c326911cc1137c17d9217a8f74c0c4b7f7bc3a9 |
| .agents/skills/ld-s10y-image/references/quality-gate.md | 36ec37ff120139309ade57b4aa315b1595490311aa50bb974f7401201ef84b29 |
| ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n81/lesson.json | 08f28c1f3356435f58a8eba12c7691abb2bf01836cdb0e7380068c9accb65ce6 |
| ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n81/exercises.json | 7a2b399482b34db36025d408b362ed9fa0506876cda74a52276d2de2771e6988 |
| ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-17.png | 2635c2d39c0b80b6e232ce9716e668a6a7d28f0ec5d1e94ac489bb7e4a7b148b |
| ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-18.png | 128bc913f07c26f427d77d931f0810df6ac01b908f6701372c868e53e973118e |
| ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-19.png | 0cbcd58f36f0eb90c458e5cb63da16c16e20e1d32f2ce7b9bc17994530641cdc |
| ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-20.png | 458541c1db6511f9532eeccd1692304e9027c082eb89aab00b85d8a8c167321a |

## Shared requirements

Each source is one shared Cartesian frame, not separate panels. Horizontal
positive direction is right, vertical positive direction is up. Solid and
dashed curves must remain distinct in that same frame. No point markers,
endpoint dots, grids, legend boxes, extra tick quantities or transformation
arrows are printed. Source line ends are finite drawing cuts, not declared
domain endpoints. Preserve complete lobes and partial branch topology without
pretending unlabelled cuts supply exact mathematical bounds.

The small origin glyphs are visually ambiguous between O and 0; no identity is
inferred from mathematical convention. Source 18 does not visibly print x at
the right arrow. These can only be explicit editorial choices, not recovered
source characters. Source mathematics and visible quantities take precedence
over a pre-existing object list or assertion report.

The complete DRAFT lesson describes horizontal compression by a factor 1/20
for figure 17, then compression by 1/2, left translation by 2, and vertical
scaling by 3 across figures 18-20. All nine exercise prompts 60-68 have no
figure references. They were read for context only; none was solved. No
answers, keys, options, choices or interaction specifications were read.

## Figure 17

- One solid rapid cosine, labelled y=cos20x; one broad dashed cosine, labelled
  y=cos x. Dashed curve is a positive arch rising on the left to its maximum
  at the y-axis, then falling right, not an additional rapid curve.
- Solid has five positive peaks (including the central one at the y-axis)
  and four complete negative troughs, with outer ends meeting or approaching
  the x-axis. Do not lose the two outer positive lobes or add a negative lobe.
- Printed horizontal quantities pi/10 and pi/5 sit under the first and
  second positive peaks to the right. Printed vertical quantity -1 denotes
  the negative trough level. No +1 label is visibly printed.
- Visible x and y axis labels plus ambiguous origin glyph; no guides.
- Mathematics to test independently: solid cos(20x), amplitude 1, period
  pi/10; peaks at n*pi/10, troughs at (2n+1)*pi/20, zeros at
  (2n+1)*pi/40. Dashed cos(x), same amplitude, maximum at (0,1).
  pi/10 and pi/5 correspond to solid maxima, not zeros.

## Figure 18

- Solid labelled y=cos2x, dashed unlabelled comparison from cos x in the
  complete lesson. Both share their maximum at the y-axis, same amplitude.
- Solid contains three interior positive peaks at -pi, 0, pi, outer positive
  branches near -2pi and 2pi, and four complete negative troughs.
- Dashed has central positive lobe, two complete negative troughs (one on
  either side), and positive outer branches; it is half the solid frequency.
- Printed pi and 2pi occur below the right-side solid maxima. Visible y and
  ambiguous origin glyph; x is not visibly printed. No vertical quantities,
  guides or point dots.
- Mathematics: cos(2x) has period pi, maxima n*pi, minima (n+1/2)*pi,
  zeros pi/4+n*pi/2; dashed cos(x) has period 2*pi. Do not alter amplitude
  when compressing horizontally.

## Figure 19

- Solid labelled y=cos(2x+4); dashed unlabelled previous cos(2x).
  Equal amplitudes and equal period, but shifted left by 2.
- Four complete solid positive lobes; three complete interior solid troughs.
  At the left there is a negative partial branch rising into the first peak;
  at the right a descending negative partial branch approaches the next
  trough. These two partial branches must not be silently dropped.
- Dashed has central maximum at the y-axis, complete troughs on each side,
  additional full maxima on each side, and positive outer branches.
- One dashed vertical guide connects (-2,0) to the solid peak (-2,1).
  Printed -2 below that guide must retain its minus sign. No horizontal
  guide and no transformation arrow. Visible x,y and ambiguous origin glyph.
- Mathematics: solid maxima -2+n*pi, troughs -2+(n+1/2)*pi, zeros
  -2+pi/4+n*pi/2; solid at x=0 is cos(4)<0 while dashed at x=0 is +1.
  Check the actual guide connection, not just its numeric label.

## Figure 20

- Solid labelled y=3cos(2x+4); dashed unlabelled cos(2x+4).
  Same phase, same zeros and same period; solid amplitude exactly triple
  dashed. Four complete positive and four complete negative solid lobes,
  matching dashed lobe signs. Ends approach/meet the baseline.
- One vertical dashed guide from the x-axis through the dashed positive peak
  to the corresponding solid positive peak left of the y-axis (x=-2 from
  the lesson). No -2 label is visibly printed in this source.
- One horizontal dashed guide at y=3 runs rightward from the y-axis to the
  adjacent solid maximum. Printed 3 identifies that level. The guide must
  reach the actual peak x=-2+pi, not an arbitrary x.
- Visible x,y and ambiguous origin glyph; no +1 or -3 labels, point dots,
  guide endpoint markers or added equations for the dashed curve.
- Mathematics: solid 3*cos(2x+4), dashed cos(2x+4), period pi, maxima
  at -2+n*pi. Vertical guide endpoint (-2,3); horizontal guide endpoint
  (-2+pi,3). Both curves negative at x=0. Test full path fidelity and
  guide incidence independently rather than accepting literal arithmetic.

## Not yet inspected

No author inventories, source decisions, numerical ledgers, manifests,
render reports, validator receipts, candidate SVG/spec, preview HTML or
native640 captures have been inspected at this freeze.
No verdict is issued before Stage 2.
