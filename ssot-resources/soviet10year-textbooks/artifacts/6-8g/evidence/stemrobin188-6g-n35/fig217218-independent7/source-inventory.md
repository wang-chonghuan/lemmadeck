# N35 independent source inventory: fig-217 / fig-218

Ticket: STEMROBIN-188. Finish: review offline. Date: 2026-11-23.
Cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Owner: `.intentfold/tickets/STEMROBIN-188/tmp/n35-fig217218-independent7`.

Phase: independent source-first inventory before comparison disclosure.
Status: `SOURCE_INVENTORY_ONLY_AWAITING_COMPARISON_DISCLOSURE`.
Final figure verdict: `NOT_PERFORMED`. This is not a modern FigureSpec or a
final figure review. No modern output has been inspected, rendered or finalized.

## Inputs and isolation

Read the retained raw `lesson.json` and `exercises.json` for
`geo68-c3-s2-n35` in `artifacts/6-8g/lessons/`, and only the two assigned
original PNGs in `artifacts/6-8g/figures/`. The required image skill,
quality gate, FigureSpec contract and binding production-resume SOP were read.
The generic `.intentfold/readme.md` and engineering charter were also read for
the repo baseline; no ticket history or other lesson artifact was consulted.

No author designs/specs, label keys, answer keys, modern outputs, pages, PDFs,
crops, other lesson artifacts or ticket history were read. No DB, environment,
network, install, Git, worktree, peer or supervisor operations were performed.
All new files are within the owner above; other changes are untouched.

| Input | SHA-256 |
|---|---|
| N35 raw `lesson.json` | `06daaf76cd0a2915fd089b563086ffb37fc7ce8545048d4fd9a3c9c7b1247ada` |
| N35 raw `exercises.json` | `6f8fe3ef2022c0bc446bd7f3a1214ce599db37c47351c4a37c44a1e387b436c3` |
| original `fig-217.png` | `e0c323ab29f61d9370b91534ef62ca378ea6b2be1a7c8d273f915bc172db8343` |
| original `fig-218.png` | `6cb29778695c079a8b871d463b70471bc9638cf49a5f10e25bdd20f4a8d1adec` |

The JSON records full input paths and all four binding-reference hashes.
The output hash record is `source-inventory.sha256`.
The JSON, Markdown and hash record are to be sealed with file mode `0444`.

## Actual image counts

| Event | Payload load count |
|---|---:|
| `functions.view_image` original fig-217, first and only view | 1 |
| `functions.view_image` original fig-218, first and only view | 1 |
| Reopens / crops / pages / PDFs / screenshots / modern outputs | 0 |
| Actual batch total | 2 / maximum 8 |
| Actual context total, including prior image loads (0) | 2 / maximum 24 |

Hashing bytes is not a visual reopen. Neither original may be visually reopened
for comparison in this context.

## Evidence vocabulary

`PIXEL_FACT` means observed topology, point order, support connections or label
location. `TEXT_FACT` means explicitly stated in the retained raw JSON.
`INDEPENDENT_DERIVATION` means independently solved mathematical consequence.
Exact raster lengths, angles and regularization are not source-given metrics.

All printed glyph, script, suffix/subscript, printing, point-marker, arrowhead
and dash identities remain `UNKNOWN`. `T217-*` and `T218-*` are occurrence
transport handles, not character guesses or proposed visible modern labels.
Raw-text symbols such as `AB`, `A_1B_1`, `O`, `alpha`, `alpha_1` and `CD`
are text facts only; they do not identify similar-looking printed glyphs.

## Fig-217: complete shared frame

One unpartitioned instructional diagram, with five labelled point roles,
seven label occurrences, three supports and two half-planes. There is no
second collinear panel, numeric given, coordinate grid or measurement scale.

| Point | Token | Source attachment / location |
|---|---|---|
| P217-01 | T217-01 | Upper-left ray interior; direction-defining labelled sample |
| P217-02 | T217-02 | Left junction of that ray with the rising boundary; ray origin |
| P217-03 | T217-03 | Middle boundary point; unique center role from text |
| P217-04 | T217-04 | Right junction of the second ray with the boundary; ray origin |
| P217-05 | T217-05 | Lower-right ray interior; direction-defining labelled sample |
| H217-01 | T217-06 | Upper, unhatched half-plane label occurrence |
| H217-02 | T217-07 | Lower, hatched half-plane label occurrence |

The five point labels are positioned above/near their corresponding strokes
or junctions. The center token sits above the boundary. The two region tokens
belong to their own sides, not to points on the boundary.

Support `S217-01` is the ray from P217-02 through P217-01 toward the upper-left.
Support `S217-02` is the ray from P217-04 through P217-05 toward the lower-right.
They lie on distinct parallel lines and have opposite directions.
Support `S217-03` is the common rising boundary, displayed from lower-left
to upper-right, with strict order:

`P217-02 < P217-03 < P217-04`.

The boundary continues beyond both origins. Both origins and the center lie
on it. P217-01 and the first ray interior lie in the upper open half-plane;
P217-05 and the second ray interior lie in the lower open half-plane.
The lower side has numerous oblique hatch strokes extending toward the lower
image edge. Their exact count, spacing, angle and printing identity are unknown;
they are region treatment, not an instructional grid.

### Text and independently solved symmetry

Theorem 43 and its proof (raw lesson prose indices 14, 15, 18) state that
oppositely directed non-collinear rays `AB` and `A_1B_1` are symmetric about
`O`, the midpoint of their origins. The half-turn exchanges their supporting
lines and the half-planes `alpha` and `alpha_1`; hence it exchanges the rays.
The raw text subsequently mentions the analogous coincident-support case,
but this image does not supply a second panel for it.

The origin pair transports the unordered text roles `{A,A_1}`; each sample
stays attached to its own origin and transports the corresponding role from
`{B,B_1}`. The center transports the unique `O` role. The region handles
transport `{alpha,alpha_1}`. Printed-token identities are not selected here.

For an exact realization with corresponding defining samples, the complete
center-symmetry ledger is:

| Item | Required relation about P217-03 |
|---|---|
| Origins P217-02 / P217-04 | Opposite pair; midpoint is the center |
| Corresponding defining samples P217-01 / P217-05 | Opposite pair; midpoint is the same center |
| P217-03 | Fixed center |
| The two complete supporting lines | Exchanged as sets |
| The two complete rays | Exchanged as sets |
| The two half-planes | Exchanged |
| Common boundary line | Invariant as a set |

Thus all five defining point roles must be covered; an origin-only
`centralSymmetry` assertion does not cover the two direction samples.
If a candidate defines additional finite symmetric stroke endpoints or vertices,
those also need their opposite pairs, not an opaque unchecked path.

Metric qualification: the text maps whole rays, but does not separately assert
that the printed `B` and `B_1` are mutually symmetric *measured* points. Exact
pairing of the chosen defining samples is a mathematical realization of the
claimed ray symmetry, not a source-ink distance measurement. Arbitrary samples
at unequal distances on the two rays do not invalidate set symmetry; they must
not be misrepresented as corresponding symmetric points.

With exact corresponding samples, write `S(X)=2*P217-03-X`. Then:

`P217-02 + P217-04 = 2*P217-03`

`P217-01 + P217-05 = 2*P217-03`

For every `t >= 0`, the first ray point
`P217-02+t*(P217-01-P217-02)` maps to
`P217-04+t*(P217-05-P217-04)`.
Alternatively, the proof works setwise: the transformed origin, unique parallel
support and transformed open half-plane uniquely determine the opposite ray.

Preserve every point/support incidence, both ray connections, both region
occurrences and the single shared boundary. Do not require the one-sided
hatching, typography or raster clipping to be centrally symmetric.

Not authorized as source metrics: perpendicularity to the boundary; specific
angles/slopes/lengths; equal visible ray truncations; exact sample distances
read from ink; finite clipping endpoint pairs; hatch intervals or dash styles.

## Fig-218: displayed supports and orders

One unpartitioned instructional frame. Eight labelled point roles, eight token
occurrences, three supports, two shared intersections and seven consecutive
connections. No region labels/fills, numeric given, grid or dimension marks.

| Point | Token | Source attachment / label location |
|---|---|---|
| P218-01 | T218-01 | Upper horizontal left; label above |
| P218-02 | T218-02 | Upper horizontal/diagonal intersection; label below/right |
| P218-03 | T218-03 | Upper horizontal right; label above |
| P218-04 | T218-04 | Lower horizontal left; label above |
| P218-05 | T218-05 | Lower horizontal/diagonal intersection; label below/right |
| P218-06 | T218-06 | Lower horizontal right; label above |
| P218-07 | T218-07 | Exterior lower-left diagonal point; label below/right |
| P218-08 | T218-08 | Exterior upper-right diagonal point; label to the right |

All source identities in this table are transport locations, not guessed letters.

| Support | Strict source order |
|---|---|
| S218-01, upper horizontal, left to right | P218-01, P218-02, P218-03 |
| S218-02, lower horizontal, left to right | P218-04, P218-05, P218-06 |
| S218-03, diagonal, lower-left to upper-right | P218-07, P218-05, P218-02, P218-08 |

Exercise 450 states that lines `AB` and `CD` are parallel and asks which rays
in this figure have the same or opposite direction. The two horizontal supports
form that distinct parallel pair. Their printed endpoint naming is unknown here.
The diagonal is a nonparallel transversal and is a third displayed support,
not a connection to omit after recording the two horizontals.

Consecutive connections are:

`01--02`, `02--03` on the upper support;
`04--05`, `05--06` on the lower support;
`07--05`, `05--02`, `02--08` on the diagonal.

The intersection roles are shared points, not separate points in separate frames.
The diagonal continues below the lower intersection and above the upper one.
Relative to the upper horizontal, point 08 is above, and 04/05/06/07 are below.
Relative to the lower horizontal, 01/02/03/08 are above and 07 is below.
Relative to the diagonal, 01/04 lie on the left side at their respective
horizontals, while 03/06 lie on the right side. These are source side relations,
not additional printed half-plane objects.

### Independent direction solution

In the shorthand below, `ij` means the ray from P218-i through P218-j,
not an edge to add to the modern figure. Only pairs on a displayed support
are eligible.

| Direction class | All ordered ray names from labelled points |
|---|---|
| Horizontal right | 01->02, 01->03, 02->03; 04->05, 04->06, 05->06 |
| Horizontal left | 02->01, 03->01, 03->02; 05->04, 06->04, 06->05 |
| Diagonal upper-right | 07->05, 07->02, 07->08; 05->02, 05->08; 02->08 |
| Diagonal lower-left | 05->07; 02->07, 02->05; 08->07, 08->05, 08->02 |

Members of each row have the same direction. The horizontal right/left rows
are opposite, as are the diagonal upper-right/lower-left rows. Horizontal and
diagonal rays are neither same-direction nor opposite-direction to each other.
This follows from signed order on each support and the given parallel pair,
without an answer key or exact angles.

These are 24 ordered ray names, not 24 separately printed arrows.
Removing same-origin aliases gives 14 distinct geometric rays:
4 horizontal-right, 4 horizontal-left, 3 diagonal-up and 3 diagonal-down.
The JSON records every alias and direction-class relation.

Not authorized as source metrics: equal spacing, midpoint intersections, equal
horizontal spans, vertically aligned outer points, fixed transversal slope,
perpendicularity, central symmetry of the whole arrangement, or exact line/marker
printing. Adding answer-class arrows or off-support connections would change the
source instructional content.

## Boundary at seal

Batch totals: 2 figures / 2 subfigures / 13 labelled point roles /
15 label tokens / 6 supports / 2 actual image loads.

Independent source interpretation is complete for this bounded phase.
Character/script/printing/dash identities and raster-derived metrics remain
`UNKNOWN`. No author correspondence, candidate assertion execution, modern
visual comparison, desktop/mobile display check, final verdict or promotion has
occurred. Stop until comparison disclosure; do not reopen the originals or
rewrite this sealed independent record.
