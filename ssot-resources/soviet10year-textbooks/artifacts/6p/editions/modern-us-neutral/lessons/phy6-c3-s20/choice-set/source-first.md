# S20 Frozen Independent Source-First

STEMROBIN-180, phy6-c3-s20, 2026-11-15.
Role: independent choice reviewer, not Feynman and not this choice author.
Stage: source-only; no view, draft, author solution or internal key has been
read. This is not a final choice review or a new approval of the seed figures.

## Permitted Inputs And Binding

Read only the current choice `review.md`/`contract.md`, this directory's
`seed.json`, and its three actual durable SVG assets. Did not open s20 author
notes/solution/draft, standard answers, Sagan answers/solutions, old choices,
interactions, or s21 choice material.

The seed contains all four written exercises, definitions at blocks
0, 1, 4, 5, 6, 7, 10, and concept figures 65, 66, 67.

- Seed canonical JSON SHA-256:
  `d2f78b91fdee80f1fdc385f397ea6cbc8b898d22da45ea1958ce0bf1df31fbe9`.
- Seed file-byte SHA-256:
  `a8abefd46017ff511b088be967111b9561e55812bea36505101257b90ef82d3b`.

Canonical serialization is the contract's Python `json.dumps` with
`sort_keys=True`, `ensure_ascii=True`, `separators=(",", ":")`, encoded UTF-8.
No current-source reconstruction or author structural command was run at
this stage; the seed trace is recorded input, not newly certified freshness.
Actual asset hashes were recomputed and match the seed.

## Actual Figure Observations

A disposable offline script displayed the three exact SVGs individually at
640 px and saved full-height screenshots. The complete screenshots were
actually opened, including every rightmost/bottommost visible object.
No product session, service, external dependency installation or model call
was used. These are displays of existing assets, not new diagrams.

| Seed asset | SHA-256 | Independent visible observation |
| --- | --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/figures/fig-65.svg` | `f70ce7ca51c92fbe6fb8c9a34d331dc101c4c94d6b4914914ce9de75f2b7170e` | Two complete panels a/b, fixed upper suspension, spring, backing/scale area, rod, horizontal pointer and bottom hook. In a the unloaded pointer is at 0. In b the spring/rod is extended downward, the pointer is at the mark 1 below 0, and the hook carries a visible 102 g mass. Both panels show N. The bottom mass outline/ring and both complete lower hooks are visible. |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/figures/fig-66.svg` | `aaa9c9d6f936ec7c73f8076064d3a3a1b75b2bef5f2adb945556b82d23894f71` | A hand with thumb/fingers grips an oval spring-like frame around a pointer mechanism. Caption is Grip dynamometer. A pointer and transverse dial marks are visible, but no numerical labels, force unit or multiplier appears. The complete outer oval, lower hand contour and right fingers are visible. |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/figures/fig-67.svg` | `dccbd22bc7ab84b980e4c2637d152af8516f2a3bc318a1a61f0c1005b7c6f31c` | Upper circular dial with 0,1,2,3,4,5, tick marks, needle and top/bottom attachment rings; caption Dynamometer. Below, a tractor pulls a loaded wheeled cart through a coupling with an indicated inline instrument. The needle points toward the left dial sector; no N/kN unit or multiplication factor is visible. The full right cart/load, coupling and bottom wheels are visible. |

Screenshots and SHA-256:

- `source-only-fig-65.png` (640 x 900):
  `59dd15fe070790f91a0add9b4ae9ecc0d694c33ca48f346b21d56e3db8387805`.
- `source-only-fig-66.png` (640 x 740):
  `cd97d5a91b0709756f4a3e4c65ae6ca87a163754609b902df0fa6b8da1580d2d`.
- `source-only-fig-67.png` (640 x 1050):
  `2000d55b990a06d7a6d51df2325b6658b40481f39197d50c802bf830e350e50f`.

Fig-65 supports a known 1 N calibration; the 102 g label is a MASS, not a
force-unit label. Fig-66 alone cannot give a numerical grip force. Fig-67's
0..5 cannot be read as 0..5 N, 0..5 kN or 0..50000 N without an explicitly
supplied calibration. Its needle position and dial appearance cannot supply
a missing exact reading, scale multiplier, maximum rating or resolution.
Definition block 10 independently supplies the qualitative tens-of-thousands
of newtons use case; it does not assign a multiplier to each visible numeral.

## Source 1: Measuring Instrument And Principle

Written task: name the force-measuring instrument and explain its construction
principle. A name alone is incomplete.

Independent solution:

The instrument is a dynamometer. In the lesson's linear elastic spring model,
the elastic force and deformation from the unloaded reference are
proportional: F = kx for one spring with constant k in its working range.
If deformation becomes r times as large, elastic force becomes r times as
large. This compares extension/compression x, not the spring's total length
L0+x; doubling total length does not generally double force.

A pointer linked to the spring maps deformation to a calibrated force scale.
Under a stationary axial hanging calibration, the applied load and restoring
spring force have equal magnitudes, so an observed pointer displacement can
measure the load's force. No numerical k can be inferred from a schematic
coil or unmeasured screen length.

Spring deformation need not mean extension only: a grip instrument uses
compression and a mechanism translating it into pointer deflection. The
supplied definitions also say dynamometers measure friction, elastic force
and other forces, not only the gravity of a hanging mass. A mass label by
itself is not the instrument's measured force.

Essential distinctions to retain later:
instrument plus deformation/force proportionality; deformation versus total
length; force versus mass; known calibration versus arbitrary pointer numbers.
A recognition item cannot certify unaided verbal explanation or measurement
procedure merely by selecting the word dynamometer.

## Source 2: Constructing The Simplest Dynamometer

Written task: explain the construction and calibration of the simplest
spring dynamometer. Physical assembly and calibration form one process,
not an instrument-name task or one numerical load slot.

Independent complete procedure:

1. Mount a spring with its upper end fixed to a small board covered with
   paper. Attach a thin rod with a hook to its lower end and a pointer at
   the rod's upper region. The pointer moves with the loaded spring.
2. With no additional calibration load on the hook, mark the pointer's
   reference position as 0. The seed describes this as the unextended
   spring position; use that idealized unloaded setup rather than trying
   to infer spring/rod self-weight from the drawing.
3. Hang a known calibration mass, let the pointer settle, and mark the
   force corresponding to that position using F=mg.
   With the seed's g=9.8 N/kg, a mass (1/9.8) kg gives exactly 1 N.
   Its value is approximately 0.102040816 kg, or 102.040816 g.
   The printed 102 g is an approximation: 0.102 x 9.8 = 0.9996 N,
   conventionally marked 1 N at this precision.
4. Use TOTAL masses approximately 204 g and 306 g to mark 2 N and 3 N,
   respectively; continue only within the spring's calibrated linear range.
   Their exact rounded-mass forces are 1.9992 N and 2.9988 N.
   For exact integral force n N, total mass is (n/9.8) kg.
5. Add the intermediate force divisions and force unit N; verify the zero
   reference and readings in the intended orientation/range.

The phrase about subsequently hanging 204 g denotes the load producing
about 2 N, not an EXTRA 204 g while leaving the initial 102 g attached.
An initial 102 g plus an additional 204 g is total 306 g, about 3 N.
One may replace the load with total 204 g or add another 102 g to the first,
but cannot label total 306 g as 2 N.

In fig-65 the pointer moves downward from 0 to 1 under the 102 g load,
consistent with this procedure. The known loads determine scale positions;
the figure's spacing is not a physical-centimetre specification or spring k.
Uniform divisions are justified by the selected proportionality definition,
not by simply drawing a ruler beside an arbitrary elastic object.

Essential tasks: fixed attachment, movable hook/rod/pointer, unloaded zero,
known TOTAL loads, force-unit calibration and usable elastic range. Supplying
a complete plan can test process coherence, but not physical assembly,
checking/adjusting zero, waiting for equilibrium, selecting masses, actual
marking or unaided explanation.

## Source 3: Marking 0.1 N Divisions

Written task: explain how to obtain divisions corresponding to 0.1 N.
The selected definition supplies calibrated integer marks and linear response.

Independent solution:

Between adjacent known integer-newton marks (0 to 1, 1 to 2, 2 to 3, etc.),
divide that spatial interval into TEN EQUAL SEGMENTS. Each segment represents
(1 N)/10 = 0.1 N. Add NINE new INTERNAL marks between the two existing
endpoints. For 0 to 1 N they correspond to 0.1,0.2,...,0.9 N; the existing
far endpoint is 1.0 N. For 1 to 2 N the internal labels are 1.1,...,1.9 N,
not another sequence starting at 0.1.

In coordinates for consecutive calibrated positions p_n and p_(n+1), the
jth internal mark is p_n + (j/10)(p_(n+1)-p_n), j=1,...,9, and denotes
(n+j/10) N. Its spacing is one tenth of THAT 1 N interval. Dividing a
complete 0..3 N range into only ten equal segments would yield 0.3 N
per segment, not 0.1 N.

An alternative independent force calibration uses a mass for 0.1 N:
(0.1/9.8) kg = (1/98) kg = approximately 10.2040816 g.
A rounded 10.2 g load produces 0.09996 N, approximately 0.1 N. Under the
same linear model its settled displacement is one tenth of the 1 N
displacement. This is an alternative known-load check, not a requirement
to invent a missing mass or to infer one from an unnumbered dial.

Equal subdivision applies because the chosen spring model is linear over the
calibrated range. Without that condition, equally spaced force marks could
not simply be assumed. The given range does not imply arbitrary extension
beyond the apparatus's safe rating.

Important distinctions: ten intervals versus ten internal lines; using
adjacent 1 N marks versus the entire scale; force difference versus absolute
label; grams versus newtons. Recognition of a correct subdivision procedure
does not verify ruler use, physically locating equal marks, calibration
accuracy or producing the scale unaided.

## Source 4: Grip And Traction Dynamometer Uses

Written task: explain the purpose of BOTH specialized instruments.

Independent solution:

- A grip dynamometer measures the force exerted by a hand when squeezing.
  Its main element in the supplied definition is an oval spring; compression
  operates an indicating mechanism that turns the pointer to a calibrated
  force division. It does not measure the hand's mass or count finger
  movements. Fig-66's hand and frame support this application, but its
  unnumbered dial cannot specify a numerical grip force.
- A traction dynamometer measures large pulling forces, such as a tractor's
  traction, in the stated range of tens of thousands of newtons. An instrument
  in the load path responds to the pull; fig-67 shows it between tractor and
  loaded cart. Its purpose is force measurement, not speed, travel distance
  or cargo mass. Capacity and calibration must be suitable for the expected
  pulling force; one cannot substitute an arbitrary small spring instrument
  merely because all instruments are called dynamometers.

Neither specialized name assigns an exact scale to the drawing. The stated
large-force use in block 10 is not evidence that the depicted numeral 5
means 50000 N or that the pictured device has that exact maximum.
No corresponding quantitative inference is needed to solve the original
purpose question; such an inference would require additional visible data
if introduced in a later view.

The source does not require demonstrating actual safe instrument use or
determining numeric readings from these figures. Recognition of matched
uses can preserve both instrument-purpose distinctions, but it does not
test unaided explanation, instrument selection in every unfamiliar setup,
calibration/overload checks, or actual hand/traction measurement.

## Frozen Stage Result And Next Boundary

All four source tasks have independent solutions from the permitted seed.
No unresolved datum prevents those qualitative/procedural solutions.
Approximate calibration masses and missing numeric dial multipliers remain
explicit limits; they were not normalized into exact unprovided data.

This record contains no choice key, no option judgments, no final PASS
and no new figure approval. Later blind review must receive only main's
authorized pure view, judge fidelity/redundancy/leakage first, and then
determine every option's truth and complete sets before internal key
comparison is permitted.

Only this source-first record and disposable actual-seed display script/
screenshots were written in the s20 choice scratch directory. The seed,
author artifacts, source/edition assets and other agents' work were not
modified. No structural validator, publisher, DB, Git or service action
was run. Stop here for main's next staged authorization.
