# STEMROBIN-184 Sole Stage B Author Comparison

Status: COMPLETE_STAGE_B_COMPARISON; WAIT. Date: 2026-11-17.
This is a text-only comparison and disposition, not source integration,
mathematical approval, finalization, acceptance, or publishing.

The parent explicitly confirmed consumption of the final Stage A and all eight
image events before supplying these author bytes. All six author files were
fully read once in this sole comparison. A subsequently authorized independent
resolver's report and ledger were also fully read as text before this report
was written. No duplicate whole review was performed.

## Findings

### F01: Incorrect Coordinate-Integrand Sign And False Erratum

Disposition: source transcription correction REQUIRED; not an algebra repair.

At P123 line 53 / `p0123#3` / Stage A 123 R09, the author writes
`a(z+t_0)`. Frozen A line 120 writes `a(z-t_0)` and its independent native
crop reading is recorded at A line 175 and ALED lines 47-52.

The newly attributed resolver independently concludes `a(z-t_0)` at RES
lines 10-26, with a horizontal stroke and no intersecting plus-sign stroke.
Its source hash at RESLED line 14 equals frozen A's physical-123 source hash.
This independently confirms A, without reopening either reviewer's images.

Consequently P123's `p0123-math-1` is a transcription-derived false erratum,
not a demonstrated textbook printing error. Remove that object from the
candidate corrected author artifact; do not preserve it as a genuine erratum
or use it as permission to alter otherwise correct printed mathematics.
The plus claims at P123 lines 25 and 34-35, H line 39, and AL line 75 must
be superseded explicitly in any later integrated record. Both supplied
velocity rows and the second coordinate row already match A and are untouched.

### F02: Incorrect Final-Definition Punctuation / Unsupported Open Rationale

Disposition: terminal comma correction REQUIRED. Local display closure is
confirmed; paragraph/whole-object continuation is not decided by punctuation.

At P125 line 61 / `p0125#6` / Stage A 125 R18, the author ends the definition
with `S_n(a,b)$， (2)`. Frozen A line 323 records a period.
P125 note line 27, H line 35, and AL lines 124/129 explicitly justify `open`
by claiming a printed comma.

That disagreement is now resolved by the attributed resolver, not a new
image read here. RES lines 69-90 conclusively record the complete argument
parenthesis, a separate solid round period with no comma tail, and the complete
label `(2)` with its right parenthesis. RESLED lines 44-59 bind this finding to
the same physical-125 source hash frozen in A.

Correct the terminal punctuation to a period and supersede the false
"printed comma therefore open" rationale. Do not infer that the unit ends
here, and do not mechanically delete an outbound `open` solely because the
display has a period. Whether prose objects continue into 126 requires their
bounded text, which was not supplied as exact author/source rows here.

The resolver certifies local display closure only. It expressly did not
inspect 126 or establish a section boundary. The later human transport that
104 continues on 126 and is bounded by actual heading 105 on 127 is a separate
attributed fact, recorded below.

### F03: Whole-Object Ownership Agrees, But Internal Continuation Is Not Encoded

Disposition: representation difference / integration risk, not lost source text.

A lines 400-413 retain 125 R09-R18 as one provided proposition/definition
object. R14 ends `这个命题是正确的，`, which agrees with P125 line 55.
P125 line 49 starts `<!-- p -->`; line 57 independently starts
`<!-- p open -->`, rather than encoding continuation of that comma-ended
validity comment.

All source rows are present. AL lines 107/111/143 already assign both
`p0125#5-6` to the same provided area-limit/definition span, so no
misownership or blind-seed leakage is observed in their textual inventory.
The marker representation nevertheless differs from A's single whole-object
boundary and could separate that object if later integration treats each
closed `p` as independently eligible. No parser or downstream workflow was
run to claim that this actually happened.

Keep the complete `p0125#5-6` span together. C03 supplies an optional minimal
single-block representation that preserves the conservative outbound `open`;
it is not required if the parent's integration already preserves that exact
whole provided span. F02's conclusive local period is not global object closure.

### F04: Unresolved Sentence-Separator Difference On 122

Disposition: lower-confidence source punctuation discrepancy; no automatic edit.

P122 line 52 reads `同一个公式：因为$x(t)$是`.
Frozen A line 46 / 122 R13 reads `同一个公式。因为 $x(t)$ 是`.
Unlike harmless full-stop glyph/style differences elsewhere, this is a
colon-versus-sentence-end distinction.

The newly supplied resolver covers only the 123 sign and 125 final display;
it supplies no evidence for this 122 separator. This context cannot load any
more images. Record the disagreement without declaring either reading
conclusive. C04 is a conditional candidate matching A, not authorization to
change source bytes or pretend that the glyph has been independently resolved.

## Exact Input Registry

Every digest below was verified before its file was read. IDs in the remaining
tables denote these exact absolute paths and snapshots, not movable aliases.

| ID | Absolute path | SHA-256 |
| --- | --- | --- |
| A | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/source-first.md` | `515581d40dfcd139c892f865c3e748328cc05a7bb54226c0125b4f24ade5c89b` |
| ALED | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125-review/ledger.md` | `7b08172dfb3ffdae682cd1e527621dab249606a8fed30909eb2f591d4ed89677` |
| P122 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0122/page.md` | `0b498b18756f9f5b5c52fc692146080368f05f70186d3d939f6be0504ec09053` |
| P123 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0123/page.md` | `4162453e897dc5c11047309a7bfeb7a8b019602d7717be705ba00bbf713158ed` |
| P124 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0124/page.md` | `cafd046cc75b754764e61963db6ed4c172940c102a2705263a2bca2e52f68dd0` |
| P125 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0125/page.md` | `a66a6e765a42bb3cd58a76506dd61650cc43281376a9e78edd51c18c8ef2e59e` |
| H | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125/author-handoff.md` | `2f555267db463fc57befc56c869ba67ee32e2b11abc20e3936f88fd0b97baa24` |
| AL | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125/author-ledger.md` | `345355b655633197f509be85f9731a88aada715890873b26d61edbf6e2fc9824` |
| RES | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source123-125-unresolved-glyphs/report.md` | `c07f9d01e72b1b7f19f3d329a3c8ba7c867cbc150e93dc2d0ec5fbaf2a19baf0` |
| RESLED | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source123-125-unresolved-glyphs/ledger.md` | `cd06413bc4ee0ae0c7c0b066794e58bb6e639edc90d339c666f5d8d5ab417e69` |

No input file was edited. Frozen A and ALED remain exactly as consumed,
including their original UNKNOWN predecessor state. No author crop, resolver
crop, metadata JSON, source PNG, PDF, template, grid, TOC, answer, choice or
adjacent author page was opened.

## Comparison Conventions

- `M` means the row's words, mathematical tokens, source role and local owner
  agree, subject only to the explicitly listed representation differences.
  It does not mean byte identity or mathematical approval.
- Representation differences retained in the comparison: whitespace around
  inline math; full-width versus ASCII heading/number punctuation; `．`
  versus `。` full-stop styles; full-width versus ASCII equation-label
  parentheses; `例` spacing; `·116·` versus `• 116 •` footer dot styles.
  No loss of footer dots or page-number values was observed.
- P124 R17 writes `[a,\ b]` instead of A's `[a,b]`; the TeX spacing command
  changes spacing, not interval endpoints, order, or bracket type.
- A gives individual review-local formula/lead-in blocks. Author `p` blocks
  may contain those complete formula rows; that regrouping is not by itself
  a missing formula or task-role mismatch.
- Exactly three source display-wrap boundaries are represented with one
  in-formula `↵` each: P123 lines 51 and 53, P125 line 42. Each maps to two
  distinct A printed rows without an additional literal newline at the same
  boundary. No formula was repaired, solved, or validated algebraically.
- The row maps below cover all 87 A text/formula/caption/footer rows, plus
  the one figure pixel object separately. Manual observed counts agree at
  22/23/23/19. These are comparison observations, never machine-counter
  expected values, acceptance results, or raw-band-derived counts.

## Complete Row Comparison

### Physical 122

| A row | P122 line | Author block | Compared content / result |
| --- | --- | --- | --- |
| R01 | 32 | p0122#1 | M: heading 103*, complete first title row |
| R02 | 33 | p0122#1 | M: second title row, same heading object |
| R03 | 36 | p0122#2 | M: chapter-opening problem and particle setup |
| R04 | 37 | p0122#2 | M: rectilinear motion, coordinate x and time t |
| R05 | 38 | p0122#2 | M: x=x(t), v(t)=x'(t), prose ending 如 |
| R06 | 39 | p0122#2 | M: known v(t), Newton-Leibniz introduction |
| R07 | 40 | p0122#2 | M: 公式得 colon lead-in |
| R08 | 41 | p0122#2 | M: complete (1), integrand v(t)dt retained |
| R09 | 44 | p0122#3 | M: x(t_0), x_0 definition and (1) reference |
| R10 | 45 | p0122#3 | M: complete (2), integrand v(z)dz retained |
| R11 | 48 | p0122#4 | M: meaning of coordinate formula, ends 坐 |
| R12 | 49 | p0122#4 | M: 标 and sentence end retained |
| R13 | 52 | p0122#5 | Words/math M; F04: colon instead of A sentence period |
| R14 | 53 | p0122#5 | M: primitive v(t), t_0 value x_0 |
| R15 | 56 | p0122#6 | M: a(t)=v'(t) and known acceleration |
| R16 | 57 | p0122#6 | M: time dependence and formula introduction |
| R17 | 58 | p0122#6 | M: complete (3), a(z)dz and v(t)-v(t_0) |
| R18 | 61 | p0122#7 | M: v(t_0), v_0 definition and (3) reference |
| R19 | 62 | p0122#7 | M: complete (4), initial velocity plus integral |
| R20 | 65 | p0122#8 | M: interpretation of known acceleration |
| R21 | 66 | p0122#8 | M: exact open tail 根据(2)式可以求 |
| R22 | 69 | p0122#9 | M: footer 116 and two dot glyphs |

### Physical 123

| A row | P123 line | Author block | Compared content / result |
| --- | --- | --- | --- |
| R01 | 42 | p0123#1 | M: 质点的坐标 completes P122 open tail |
| R02 | 45 | p0123#2 | M: whole example opening, a and initial t_0 |
| R03 | 46 | p0123#2 | M: v_0, x_0 and coordinate-function request |
| R04 | 47 | p0123#2 | M: complete example statement end |
| R05 | 50 | p0123#3 | M: provided velocity derivation invokes (4) |
| R06 | 51 before ↵ | p0123#3 | M: entire velocity equality chain through -at_0 |
| R07 | 51 after ↵ | p0123#3 | M: =v_0+a(t-t_0), semicolon and one wrap |
| R08 | 52 | p0123#3 | M: provided coordinate derivation invokes (2) |
| R09 | 53 before ↵ | p0123#3 | F01: a(z+t_0), not A/resolver a(z-t_0); all other tokens present |
| R10 | 53 after ↵ | p0123#3 | M: complete provided x_0+v_0(t-t_0)+(a/2)(t-t_0)^2 result |
| R11 | 56 | p0123#4 | M: 习题* group heading, not a problem |
| R12 | 59 | p0123#5 | M: 440, upward stone, ignored air resistance |
| R13 | 60 | p0123#5 | M: g approximately 9.8, request lead-in |
| R14 | 61 | p0123#5 | M: subpart 1, v_0 relation, subpart 2 start on same row |
| R15 | 62 | p0123#5 | M: highest-position velocity and subpart 3 start |
| R16 | 63 | p0123#5 | M: 地面 question end; all three numbered requests present |
| R17 | 66 | p0123#6 | M: 441 and v=9.8t-0.003t^2 |
| R18 | 67 | p0123#6 | M: t=0 to 5, distance request and next request start |
| R19 | 68 | p0123#6 | M: terminal acceleration and parenthetical t=5 |
| R20 | 71 | p0123#7 | M: 442 and exact capital R in Rt+a sqrt(t), initial t=0 |
| R21 | 72 | p0123#7 | M: t=4, distance and terminal-acceleration request |
| R22 | 73 | p0123#7 | M: complete request end |
| R23 | 76 | p0123#8 | M: footer 117 and two dot glyphs |

### Physical 124

| A row | P124 line | Author block | Compared content / result |
| --- | --- | --- | --- |
| R01 | 34 | p0124#1 | M: 443 Cyrillic а, exact x^2-2x+3 parabola |
| R02 | 35 | p0124#1 | M: constant horizontal-projection v, vertical-axis request |
| R03 | 36 | p0124#1 | M: velocity/acceleration and 用x表示 restriction |
| R04 | 37 | p0124#1 | M: Cyrillic б, exact x^3-2x^2 law |
| R05 | 38 | p0124#1 | M: same constant horizontal v and vertical-axis request |
| R06 | 39 | p0124#1 | M: complete second subpart; one whole 443 |
| R07 | 42 | p0124#2 | M: new 104* heading after all of 443 |
| R08 | 45 | p0124#3 | M: prior integral-definition introduction |
| R09 | 46 | p0124#3 | M: entire integral =F(b)-F(a), comma retained |
| R10 | 49 | p0124#4 | M: F primitive of f, new-definition method |
| R11 | 50 | p0124#4 | M: derivative-property explanation |
| R12 | 51 | p0124#4 | M: variable-upper-limit derivative introduction |
| R13 | 52 | p0124#4 | M: complete (1), lower bound b unchanged |
| R14 | 55 | p0124#5 | M: subsection 100 reference, theorem explanation |
| R15 | 56 | p0124#5 | M: complete continuous-function primitive claim |
| R16 | 59 | p0124#6 | M: geometric setup and a<b |
| R17 | 60 | p0124#6 | M: positive continuous f on [a,b]; TeX spacing only |
| R18 | 61 | p0124#6 | M: figure 48 reference retained with 104* prose |
| R19 | 64 | p0124#7 | M: n equal subdivisions of [a,b] |
| R20 | 65 | p0124#7 | M: Delta x=(b-a)/n, one display row |
| R21 | 68 | p0124#8 | M: endpoint-sequence introduction |
| R22 | 69 | p0124#8 | M: entire a=x_0<...<x_n=b sequence, open comma |
| R23 | 72 | p0124#9 | M: footer 118 and two dot glyphs |

### Physical 125

| A row / pixel object | P125 line | Author block | Compared content / result |
| --- | --- | --- | --- |
| R01 | 35 | p0125#1 | M: x_k-x_(k-1)=Delta x, completes endpoint spacing |
| R02 | 38 | p0125#2 | M: [x_(k-1),x_k] base, f(x_(k-1)) height, rectangle |
| R03 | 39 | p0125#2 | M: individual-area introduction |
| R04 | 40 | p0125#2 | M: f(x_(k-1)) times Delta x, comma |
| R05 | 41 | p0125#2 | M: all-rectangle sum, direct figure 56 reference |
| R06 | 42 before ↵ | p0125#2 | M: entire S_n equality with all three sampled terms/ellipsis |
| R07 | 42 after ↵ | p0125#2 | M: entire (b-a)/n bracketed sum, one wrap |
| Figure pixels | 44 | p0125#3 | Coarse inventory/owner agreement; exact retained pixels not reverified |
| R08 | 47 | p0125#4 | M: caption 图 56, separate from figure pixels |
| R09 | 50 | p0125#5 | M: continuity, large n / small Delta x |
| R10 | 51 | p0125#5 | M: accumulated rectangles, 几乎相同 explanation |
| R11 | 52 | p0125#5 | M: complete 提出一个命题：极限 introduction |
| R12 | 53 | p0125#5 | M: complete S=lim S_n(a,b) |
| R13 | 54 | p0125#5 | M: existence, [a,b] base and upper graph boundary |
| R14 | 55 | p0125#5 | Text M, including validity-comment comma; F03 internal join not marked |
| R15 | 58 | p0125#6 | M: general continuous f, full not-necessarily-positive parenthetical starts |
| R16 | 59 | p0125#6 | M: parenthetical closes, limit exists, integral introduction |
| R17 | 60 | p0125#6 | M: 的定义 colon lead-in |
| R18 | 61 | p0125#6 | Math/label M; F02: comma instead of conclusive source period |
| R19 | 64 | p0125#7 | M: footer 119 and two dot glyphs |

No unmatched A row, extra unsolved task, omitted display row, missing source
subpart, dropped initial condition, or duplicated footer/caption was found.
This conclusion is distinct from the glyph/boundary findings above.

## Complete Block Correspondence

All 33 author blocks are accounted for. The 51 A review-local blocks may map
many-to-one into a complete author block; equality of block counts is not
required. Figure and caption are distinct objects in both representations.

| Author block / header line | Entire A block coverage | Role / owner / boundary |
| --- | --- | --- |
| p0122#1 / 31 | 122-B01 | h3, two title rows, owner 103* |
| p0122#2 / 35 | 122-B02-B03 | Teaching setup + whole (1), 103* |
| p0122#3 / 43 | 122-B04-B05 | x_0 definition + whole (2), 103* |
| p0122#4 / 47 | 122-B06 | Complete coordinate interpretation, 103* |
| p0122#5 / 51 | 122-B07 | Alternative primitive derivation, 103*; F04 separator |
| p0122#6 / 55 | 122-B08-B09 | Acceleration setup + whole (3), 103* |
| p0122#7 / 60 | 122-B10-B11 | v_0 definition + whole (4), 103* |
| p0122#8 / 64 | 122-B12 | p open, 103*, exact continuation into 123-B01 |
| p0122#9 / 68 | 122-B13 | Foot only |
| p0123#1 / 41 | 123-B01 | p cont, closes 122-B12 |
| p0123#2 / 44 | 123-B02 | Example statement p open, 103* |
| p0123#3 / 49 | 123-B03-B06 | p cont, both complete supplied derivations; F01 sign |
| p0123#4 / 55 | 123-B07 | exhead 习题*, 103* |
| p0123#5 / 58 | 123-B08 | ex440, all three requests, 103* / 习题* |
| p0123#6 / 65 | 123-B09 | ex441, both requests, same owner |
| p0123#7 / 70 | 123-B10 | ex442, both requests, same owner |
| p0123#8 / 75 | 123-B11 | Foot only |
| p0124#1 / 33 | 124-B01-B02 | One ex443, both Cyrillic subparts, 103* / 习题* |
| p0124#2 / 41 | 124-B03 | h3 starts 104*, closes local 103* span |
| p0124#3 / 44 | 124-B04-B05 | Prior definition p open, 104* |
| p0124#4 / 48 | 124-B06-B07 | p cont, explanation + entire derivative (1), 104* |
| p0124#5 / 54 | 124-B08 | Complete cited theorem paragraph, 104* |
| p0124#6 / 58 | 124-B09 | Positive-area setup and figure48 reference, 104* |
| p0124#7 / 63 | 124-B10-B11 | Subdivision introduction + Delta-x formula, 104* |
| p0124#8 / 67 | 124-B12-B13 | p open, endpoint ordering, 104* |
| p0124#9 / 71 | 124-B14 | Foot only |
| p0125#1 / 34 | 125-B01 | p cont, same 104* endpoint explanation |
| p0125#2 / 37 | 125-B02-B05 | Construction, area, introduction and both sum rows, 104* |
| p0125#3 / 44 | 125-B06 | One fig56, 104* teaching owner |
| p0125#4 / 46 | 125-B07 | cap fig56, same owner |
| p0125#5 / 49 | 125-B08-B10 | Complete positive-area claim, 104*; F03 comma-ended internal connection |
| p0125#6 / 57 | 125-B11-B12 | Generality + definition, 104*; F02 false comma/open rationale |
| p0125#7 / 63 | 125-B13 | Foot only |

## Figures, Tables And Whole Objects

### Figure / Table Comparison

There are no printed figures or tables in A's 122-124 inventory, agreeing
with P122/P123/P124 notes and AL page inventories. The figure48 reference is
present in 124 R18 / P124 line 61; it is owned by 104* prose, not ex443.
No supplied evidence resolves figure48 or permits renumbering it.

P125 line 44 declares one fig56 box `[490,900,710,365]`. A's coarse orientation
box is `[500,905,700,355]`. These are two approximate boxes for the same
whole diagram, not conflicting exact crop geometries. No snapping, crop
retention test, figure rendering, or pixel verification was performed here.

H line 33 and AL lines 109-115 agree with A on one continuous curve, seven
adjacent shaded rectangles, both arrowed axes, x/y, x_0/x_1/x_2/x_n,
origin round glyph and the separate far-left round glyph. A additionally
records eight partition boundaries, the y-axis between x_1 and x_2,
curve extensions and variable top relationships. The author text does not
contradict those details or substitute a different diagram.

The exact identity/role of the isolated far-left `o`/`0`-like glyph remains
unresolved. AL explicitly retains it as source pixels; no textual omission
or reinterpretation was found. Neither the new resolver nor the human
transport resolves that glyph. Exact later crop retention remains unverified.
Caption fig56 is separately present at P125 lines 46-47, matching A R08.

### Whole Provided Teaching / Eligible Task Inventory

| Entire provided / unsolved object | Author coverage | Comparison disposition |
| --- | --- | --- |
| 103* coordinate/velocity/acceleration exposition | p0122#2-8 + p0123#1 | Every setup, initial-value definition, (1)-(4), interpretation and cross-page tail retained as teaching |
| 103* full constant-acceleration worked example | p0123#2-3, lines 45-53 | Full statement, a/t_0/v_0/x_0, requested function, both velocity rows, both coordinate rows retained; F01 is a sign error, not missing object content |
| 104* prior definition and derivative-property explanation | p0124#3-4 | Whole F(b)-F(a), primitive explanation and derivative formula with lower b retained as teaching |
| 104* cited subsection-100 theorem statement | p0124#5, lines 55-56 | Complete printed continuous-function primitive claim retained; no missing proof fabricated |
| 104* positive continuous-function geometric setup | p0124#6 | Entire a<b, positivity, [a,b] and fig48-area setup retained |
| 104* complete provided subdivision / rectangle-sum construction | p0124#7-8 + p0125#1-4 | All endpoint/spacing formulas, rectangle instructions, area, both sum rows, fig56 and caption retained together |
| 104* area proposition and general integral definition provided here | p0125#5-6 | Entire A R09-R18 retained; F03 marker difference and F02 punctuation/open rationale recorded; no whole-unit closure inferred |
| 103*/习题*/440 | p0123#5 | Eligible complete unsolved object, three numbered subparts and g approximately 9.8 retained |
| 103*/习题*/441 | p0123#6 | Eligible complete unsolved object, exact law, endpoints 0/5 and both requests retained |
| 103*/习题*/442 | p0123#7 | Eligible complete unsolved object, exact capital R, law, endpoints 0/4 and both requests retained |
| 103*/习题*/443 | p0124#1 | Eligible complete unsolved object, Cyrillic а/б, both laws, v and all restrictions/requests retained |

AL lines 131-143 and H lines 29-34 preserve the same whole provided spans
and the same four unsolved objects. No provided `例`, theorem statement,
proof-related prose, partition construction, proposition or definition was
recast as an eligible unsolved question. No answer or choice is added here.

## Author Metadata And Sidecar Comparison

| Author field / claim | Comparison result |
| --- | --- |
| book/page/pdf_page/printed_page | 10c, physical 122-125, printed 116-119 agree with frozen A |
| render w/h/hash | All four 1695x2580 dimensions and source-image SHA-256 values agree with A/ ALED; no source image reopened |
| source PDF name/hash, dpi=300, profile/schema hashes | Author provenance claims only; A does not independently verify the PDF/profile bytes or schema, and no further file was opened |
| P122/P124/P125 errata arrays empty | No disagreement within A for those pages; F02 is transcription punctuation, not a new textbook erratum |
| P123 erratum p0123-math-1 | F01: remove false transcription-derived erratum; no algebraic errata judgment |
| four footer notes / omitted scan specks | Agree on page values and non-teaching scan noise; no count exclusions introduced |
| H deliverable hashes, AL final hash table | All four page digests match P122-P125; H/AL own file digests separately match the human-supplied snapshots |
| AL complete row/block maps and H row totals | Match A row coverage, with three single wrap markers; no machine-counter validation claimed |
| H/AL example exclusion and unsolved ownership | Agree with A on complete provided example and all four eligible unsolved tasks |
| H/AL figure56 ownership / fig48 unresolved | Agree with A; coarse box difference is not exact-crop validation |
| H/AL coefficient R and derivative lower b | Agree with independent crop-bound frozen A observations; unchanged |
| H/AL physical121 UNKNOWN | Historical pre-transport state agrees with original A; new parent transport is appended below, not a retrospective contradiction |
| H/AL physical125 comma / open due to comma | F02: superseded by attributed conclusive local-display evidence |
| H/AL 7/8 author image events | Author's separate historical context; not the independent review's 8/8 budget and not transferable image capacity |
| H/AL source-only completion / no finalize | Appropriate scope claims; this comparison does not certify production or math acceptance |

## Attributed Text Transport / Boundaries

### Historical State Is Not Rewritten

At Stage A freeze, physical121 owner was UNKNOWN. A lines 18-19/429 and
ALED lines 105-106 correctly record what was then available. Those bytes
remain unchanged. The author's historical UNKNOWN notes similarly predate
the transport and are not retroactively treated as evidence that the owner
is still unknowable after transport.

### Parent's First Stage B Transport

The human supplied these bounded facts as TEXT, not exact adjacent-page rows:

- Actual heading 102 on physical120 follows exercises 425-439.
- Physical120 has variable-integral prose and a provided proof:
  `120 p open -> 121 p cont`.
- Physical121 contains provided derivative/zero-initial properties and ends
  with the q-initial-value formula
  `F(x)=q+\int_a^x f(t)dt` labelled (2), ending in a period.
- Physical122 actually starts heading 103, locally closing preceding unit102.

Stage B addendum: predecessor physical121 owner is 102 on this explicitly
attributed bounded transport, not on an invented visual reading or heading
guess. No 120/121 files, images, row counts, or extra proofs were discovered.
The provided proof/properties/q formula are teaching, not newly seeded tasks.
No unsupplied continuous text or exact stable production ID is reconstructed.

### Later Human Global-Boundary Transport

The latest human message independently supplies:
`global104 continues126 and actual105 heading127 bounds it`.

This updates Stage B's section-level boundary knowledge only. The exact 126
prose and 127 author/source bytes were not read. RES lines 88-90 explicitly
do not certify those pages; do not attribute this global boundary to RES.

### Boundary Disposition

| Boundary | Final Stage B disposition / provenance |
| --- | --- |
| 121 -> 122 | Preceding unit102 locally closes at actual 103 heading; human transport plus frozen 122 heading |
| 122 -> 123 | Exact `根据(2)式可以求` + `质点的坐标。`, correct author open/cont |
| worked example | Complete whole p0123#2-3, no omitted solution; F01 correction candidate only |
| 103 -> 104 | Complete ex443 before actual 104 heading on 124, agrees with A/author |
| 124 -> 125 | Correct endpoint-ordering p open / spacing p cont, agrees with A/author |
| 125 R14 -> R15 | Matching printed comma and same provided owner; marker connection differs, F03 |
| 125 final display | Period, full argument parenthesis and complete (2) label conclusive, attributed RES |
| 125 -> 126 prose-object join | Not determined from local display punctuation; exact bounded 126 prose absent |
| unit104 global boundary | Human says continues126, bounded by actual 105 heading127; not a resolver finding or unseen-row claim |
| fig48 | Unresolved in supplied 122-125 evidence; do not repair number |
| far-left round figure56 glyph | Exact character/role unresolved; preserve source inventory uncertainty |

## Candidate Minimal Edits, Not Applied

All candidates are pinned to the exact author hashes in the registry.
Any later edits invalidate those snapshots and require new external digests.
This report neither applies them nor approves content/math/workflow action.

### C01: Required Source Sign And False-Erratum Correction

Target P123:
`4162453e897dc5c11047309a7bfeb7a8b019602d7717be705ba00bbf713158ed`.

At line 53 only, replace `a(z+t_0)` with `a(z-t_0)`; leave every other
formula token, both results and the one wrap marker unchanged.

```latex
% Author formula line before:
$x(t)=x_0+\int_{t_0}^{t}[v_0+a(z+t_0)]dz↵=x_0+v_0(t-t_0)+\frac{a}{2}(t-t_0)^2$。
% Candidate line:
$x(t)=x_0+\int_{t_0}^{t}[v_0+a(z-t_0)]dz↵=x_0+v_0(t-t_0)+\frac{a}{2}(t-t_0)^2$。
```

Remove the entire errata object whose `id` is `p0123-math-1` at lines 31-36,
leaving `"errata": []`. Do not retarget it to the correct minus expression.
Supersede note line 25 with a source-evidence statement, for example:

```text
独立原尺寸字形解析确认坐标积分括号内为a(z-t_0)；原加号为转写错误，p0123-math-1不是真实书籍勘误，已撤销；未按代数期望修书。
```

The plus claims in H line 39 (hash
`2f555267db463fc57befc56c869ba67ee32e2b11abc20e3936f88fd0b97baa24`)
and AL line 75 (hash
`345355b655633197f509be85f9731a88aada715890873b26d61edbf6e2fc9824`)
need an explicit attributed correction/supersession in later integration,
not silent preservation as current source truth. No historical Stage A text
or image ledger is rewritten.

### C02: Required Local Definition Punctuation Correction

Target P125:
`a66a6e765a42bb3cd58a76506dd61650cc43281376a9e78edd51c18c8ef2e59e`.

```latex
% Author line 61:
$\int_a^b f(x)dx=\lim_{n\to\infty}S_n(a,b)$， (2)
% Candidate line:
$\int_a^b f(x)dx=\lim_{n\to\infty}S_n(a,b)$。 (2)
```

This changes one punctuation glyph only. It does not alter the formula,
argument parentheses, equation label, footer or unit owner.
Replace/supersede P125 note 27 and H line35 / AL lines124,129's comma-based
outbound rationale with the attributed local period/closure finding.
Retain the distinction between local display closure and uninspected
125->126 prose-object continuity; do not replace it with "104 ends here".

No automatic `p open -> p` candidate is authorized solely by that period.
Any later marker disposition needs the relevant bounded object continuation
text, not just the human's knowledge that unit104 contains more material.

### C03: Optional Whole-Span Marker Representation

Same P125 hash as C02. If parent integration needs one source block for A's
whole R09-R18 provided span, the minimal conservative merge is:

- At original line49, replace `<!-- p -->` with `<!-- p open -->`.
- Remove the internal blank separator and `<!-- p open -->` header at
  original lines56-57, preserving line55's printed comma and every following
  source row. Leave the unresolved outer `open` conservative, not approved.

```text
Before internal boundary:
梯形的面积。这个命题是正确的，

<!-- p open -->
实际上，对于在$[a,b]$上任何连续函数$f$(不一定是正值

Candidate internal boundary:
梯形的面积。这个命题是正确的，
实际上，对于在$[a,b]$上任何连续函数$f$(不一定是正值
```

Do not introduce guessed combined-marker syntax or select a closed outer
object from the period alone. This merge changes subsequent review-local
block ordinals: the old `p0125#5-6` becomes one #5 and the old foot #7 becomes
#6. A later actor must update the affected author sidecar references and row
map explicitly; no such edits or parser checks were performed here.
The candidate is optional if the parent already preserves the whole #5-6
provided span without relying on individual `p` eligibility.

### C04: Conditional 122 Separator Candidate

Target P122:
`0b498b18756f9f5b5c52fc692146080368f05f70186d3d939f6be0504ec09053`.

At original line52, a candidate matching frozen A replaces only
`同一个公式：因为$x(t)$是` with `同一个公式。因为$x(t)$是`.
This remains conditional: no newly attributed native evidence resolves the
colon/period. Do not execute this candidate or call it a confirmed correction.
P124 needs no source-fidelity candidate edit from this bounded comparison.

## Attributed Resolver Evidence, Text Only

RES/RESLED report three distinct native crop events in a separate fresh
context, not new events in this reviewer context. The following values are
attributed from their verified text, not recomputed by reading images:

| Resolver event | Original physical page / source SHA-256 | Native XYWH / dimensions | Reported crop SHA-256 |
| --- | --- | --- | --- |
| Q1 minus | 123 / `47d3d19da383163f00bac4457c47557d7473cb548408d982b5a82ccba2fc9b07` | `[300,940,1180,140]`, 1180x140 | `8d86f5b9a1d59ef0066fca8142947591061c4bcf2c77a38666726979e2dac3ea` |
| Q2 initial period | 125 / `141bb38b345bb0889b511f70207a49c81530d848be0195ae870a3d47461e7aaf` | `[200,2010,1260,350]`, 1260x350 | `6ddff5ae887eb23c499c7d556037aa62536c32a08e6e0627590378a5b2c21346` |
| Q2 complete label/right closure | 125 / same source hash | `[525,2125,1035,130]`, 1035x130 | `31763e1d0379ebb26f1e649e647db44ab3cb836f738433df8fa16dc7364860e6` |

Their ledger reports pre-view pixel-rectangle equality and unchanged source
hashes. This reviewer did not reopen, hash, decode, inspect metadata for, or
load any of those crop files. The resolver confirms only the specified glyphs
and local closures, not the whole-page/whole-example comparison done in A.

## Final Scope / Freeze

This sole comparison accounts for every authorized author row/block,
formula, figure/owner, whole provided span, unsolved task and relevant
metadata/sidecar claim against frozen A. The newest narrow resolver evidence
is attributed within the same report, not used to contaminate or rewrite A.
Two conclusive source discrepancies have correction candidates; one internal
marker/whole-span difference and one unresolved separator are explicitly
distinguished. There is no blanket author-source or mathematical approval.

Only this new `StageB.md` and new `stageB-ledger.md` were written, using
`apply_patch`. Image budget remains permanently 8/8; Stage B adds zero images,
no reset and no borrowed author/resolver allowance.

No source edit, counter, finalize, assemble, vectorize, adaptation, answers,
choices, tests, Git, DB, publish, app, dependencies, schema, Charter,
SkillHost, workflow or other-chat action. No proactive discovery.

Final text-only readback and digest checks bind the handoff. This file's
SHA-256 and the new ledger's SHA-256 are returned externally; neither file
is edited after that output freeze. WAIT for parent integration; no further
review or source operation is initiated.
