# B91 n160 Independent FIG Review: 345/346

Date: 2026-11-19. Ticket: STEMROBIN-180 C / 180-4.
Workspace and explicit cwd for every shell command:
`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.

## Scope and Verdicts

| Figure | First independent FIG verdict on selected candidate |
| --- | --- |
| 345 | REVISE |
| 346 | REVISE |

Limited independent FIG review only. Previously approved SOURCE/TEXT are retained,
not reopened as separate approval gates. Opening the originals below serves the
required independent comparison of these two figures, not a new SOURCE verdict.
The complete current edition prose and all six exercises embedded in both specs
were read; the two authoritativeText arrays are identical. Their SHA-256 over
`JSON.stringify(source.authoritativeText)` is
`dc672e14ebb90f3f646c7edd9712a6780b2e78571fd27cf26eabb09666ec2860`.

Read the image skill, quality-gate and figure-spec references, and the 345/346
source inventories in `modern-figure-author-n160-b91.md`. Only selector entries
345/346 were used. Candidate selection:

- 345: `.tmp/ld-s10y-lesson/resume-180-4-n160/modern-figures/fig-345/render-repair/spec.json`.
- 346: `.tmp/ld-s10y-lesson/resume-180-4-n160/modern-figures/fig-346/label-repair/spec.json`.

No author edits, official record_review, promotion or whole-course approval.
No setup, freshness workflow, Grill, backend, Git, DB, env inspection, paid
calls, other chats, agents, branches, workers, or old-session inspection/contact.
No render, validator, native or whole-lesson display rerun. Local SHA-256 reads
only checked the binding of the supplied evidence to the reviewed bytes.

## Image Ledger

Each original was opened before its selected native image. Each native PNG was
opened once: its top is the full 640px render; its bottom is the actual 297px
prose fixture. Both parts were inspected within that single load.

| Actual load | Figure | Image |
| --- | --- | --- |
| 1 | 345 | `.tmp/ld-s10y-lesson/resume-180-4-n160/artifacts/7p/figures/fig-345.png` |
| 2 | 345 | `.tmp/ld-s10y-lesson/resume-180-4-n160/modern-figures/fig-345/render-repair/native.png` |
| 3 | 346 | `.tmp/ld-s10y-lesson/resume-180-4-n160/artifacts/7p/figures/fig-346.png` |
| 4 | 346 | `.tmp/ld-s10y-lesson/resume-180-4-n160/modern-figures/fig-346/label-repair/native.png` |

Actual images: 4/8, 2 per figure. Reopens: 0. Crops: 0. Separate candidate.png
loads: 0. New screenshots: 0. Image payloads sent to other chats/parent: 0.
Binary file hashing did not load additional pixels into visual context.

## Figure 345: REVISE

### Independent Inventory Comparison

The source has two experimental states together, a/b; each has a battery with
both terminal signs, support/base/clamp, two flexible conducting suspension
leads, a straight suspended conductor, horseshoe yoke and two poles, knife
switch, adjustable horizontal resistor/slider and exterior series leads.
The left state carries A/B, and each magnet has N above S. The left switch
is open; the right switch is closed, with a changed conductor position.
No force/current arrows or numerical geometry are source requirements.

| Source requirement | Actual selected native pixels |
| --- | --- |
| Both states and a/b labels | Both are present in the full render. The 297px scroll fixture shows a at its initial scroll position, not a missing b; existing end-reach evidence is retained. |
| Support, clamp and base in each state | Present, but their contact depiction creates the blocking electrical ambiguity below. |
| Horseshoe yoke, N above S, conductor in pole gap | Present in both states; no swapped pole labels. |
| Two flexible leads and suspended straight conductor | Present in both states. The changed bend/position in b is visible; no exact displacement, angle or physical length is inferred. |
| A/B on the left conductor | Both present and separated from endpoint marks. No extra B-state A/B labels are required by the source. |
| Battery signs, open a / closed b switch | Present; a has a blade/contact gap and b has a joined blade/contact. |
| Adjustable resistor and sliding contact | Present in each state, not reduced to a fixed resistor or omitted apparatus. |
| Series supply/suspension connections | Individual routes exist, but the apparent common support junction does not preserve an unambiguous series circuit. |
| No answer-bearing additions or cultural leakage | No added force/current arrows, given measurements or source-script labels. Small endpoint marks are modern anchors, not source quantitative geometry. |

### Blocking Defect 345-1 [P1]

**The unbroken clamp visually joins the two electrical branches and bypasses
the suspended conductor.** In the full native pixels both supply branches
continue into the two suspension leads at the same continuous heavy horizontal
support bar. There are no insulating seats, separation gaps or crossing cues.
In a the two meetings are `[137,410]` and `[237,410]`, both on `a-clamp`
`[48,410] -> [255,410]`; b repeats them at `[457,410]` and `[557,410]` on
`b-clamp`. These are also the negative-return and slider-to-suspension ends.
The negative exterior lead additionally touches the base outline at
`[20,134]` in a and `[340,134]` in b.

This is an apparent electrical junction in the technical schematic, not a
claim that the physical source apparatus is shorted. The source/prose require
current through AB on closing the switch, and the spec inventory explicitly
says the supply connects to suspension ends, not to the mechanical stand.
Current object counts and per-segment connects assertions do not disambiguate
the mechanically supported but electrically separate terminals.

**Action:** retain the support and both flexible leads, but depict electrically
isolated suspension attachment points and keep the negative return clear of
the base. Provide a visible insulation/separation or unambiguous crossing
convention so no continuous ink path can be read as a clamp/base bypass of AB.
Keep the two-state, switch, resistor, polarity and A/B requirements unchanged.

## Figure 346: REVISE

### Independent Inventory Comparison

The source has one rectangular ABCD winding/frame, A/D upper left/right and
B/C lower left/right, vertical shaft/support base, curved rotation indicator,
dashed equilibrium orientation, S-left/N-right poles with exterior stubs,
two complete separate rings marked 1 at different shaft heights, two separate
brushes marked 2, and separate winding ends leading to the respective rings.
The battery, both terminal signs, open knife switch and exterior brush circuit
are also required. A projected crossing is not a source electrical junction.

| Source requirement | Actual selected native pixels |
| --- | --- |
| Rectangular winding in perspective | Present. Schematic projection and one outline representing the multi-turn winding are not source dimensions or a literal turn count. |
| A/D upper and B/C lower solid-frame corners | A/D identify the upper corners; B/C fail to identify the lower solid-frame corners unambiguously (346-2). |
| Vertical axle, support base and curved rotation indicator | Present. No new force vector or current-direction arrow is added. |
| Dashed equilibrium frame, distinct from initial solid frame | Present as a narrow dashed alternate orientation. Misplaced B/C visually associate with it (346-2). |
| S on left and N on right, exterior pole stubs | Present and correctly ordered; stubs are separate from the supply wiring. |
| Two COMPLETE separate slip rings | Both closed ovals are present at separate heights, not two split-commutator halves. Existing points close exactly; upper bounds x254..336/y215..245, lower x254..336/y169..199 describe current schematic geometry only. |
| Separate winding ends, each to its own ring | Both routes exist and terminate at different rings; rendered clearance near B permits a false junction between them (346-1). |
| Separate brushes and exterior circuit | Left brush touches upper ring, right brush touches lower ring; separate supply routes and the battery/open switch are present. Ring/brush identification is compromised by leader 1 (346-3). |
| Ring label 1 and brush label 2 | Both legible at full and actual 297px size; 2 reaches the left brush, but 1 crosses the same brush and ends at its shared ring-contact point (346-3). |
| No commutator substitution or quantitative additions | Complete rings retained; no E/F, force labels, invented angle values or source-script text. |

### Blocking Defect 346-1 [P1]

**The two winding ends are not visibly insulated from each other near B.**
The intended break is between the vertical return end `[215,328]` and frame B
`[215,312]`. However, the first end descends diagonally from `[215,328]` to
`[202,276]`, passing immediately beside the solid lower-corner/end of the other
branch at B. The full native pixels show this cluster merging into a contact
read, and the 297px fixture does not establish a clean separation.

Read-only arithmetic on the selected coordinates puts B just 3.88057 output
pixels from the first lead's centerline. The first lead is 3px wide and the
lower winding is 5px wide: combined half widths are 4px, before considering
the visible endpoint mark or antialiasing. Thus the nominal 16px endpoint
break is not actual positive stroke clearance. This arithmetic describes
modern rendered strokes, not source given geometry; it is not a gate rerun.

**Action:** route the first winding lead away from B/the second winding end,
leaving a clearly visible insulated break at both inspected sizes. Preserve
the full winding path and two distinct end-to-ring terminations. Do not make
a common node, bridge the winding opening or turn either ring into a split
commutator. Mere presence of two end objects is insufficient.

### Blocking Defect 346-2 [P2]

**B/C label placement identifies the dashed orientation rather than the solid
frame's lower corners.** In the existing SVG, B is rendered at screen
`x255/y248` with start anchoring; C at `x335/y268` with end anchoring. The
actual solid B/C corners are screen `[215,288]` and `[375,308]`. Both labels
therefore move inward/upward onto the narrow dashed orientation. The same
misassociation is visible in the 297px native fixture; readable type and an
empty collision list do not make the intended corner references correct.

**Action:** place B next to the solid lower-left corner and C next to the solid
lower-right corner, with sufficient separation from winding leads, poles and
dashed equilibrium edges. Keep A/D and the actual frame geometry unchanged.
If leaders are necessary, make their targets explicit and non-electrical.

### Blocking Defect 346-3 [P2]

**Leader 1 runs through the brush/exterior lead and targets the shared contact,
not a clean portion of the ring.** `ring-1-leader` runs
`[137,227] -> [254,230]`; the upper brush occupies x218..254/y223..237.
Its right endpoint is precisely the shared first-winding-end/ring/brush
contact. Before that, the thin leader crosses the upper brush interior and
nearly follows the negative supply route at y230. In the native pixels it
looks like another line entering the brush, while 2 also identifies that
brush. This defeats the prose distinction between metal rings 1 and brushes 2.

**Action:** move or reroute leader 1 to an exposed ring arc away from brushes,
winding terminals and supply wiring. Make its reference to the ring pair
clear, using a clean grouping leader or repeated 1 if needed. Keep leader 2
on a brush and do not create a new circuit connection with an annotation.

## Existing Evidence and Failure History

All selected source/spec/SVG/render/native-image/native-HTML SHA-256 bindings
checked below agree with the supplied metadata and selector entry hashes.
Both render.json files and both native.json files retain their existing PASS.
They establish their recorded mechanical/readability checks, not independent
semantic contact or leader correctness; the FIG verdicts above remain REVISE.

345's FIRST native failure was the invalid mobile-width paper fixture. The
existing corrected A4 basis is accepted. Seven earlier PASS observations are
retained; their numeric row measurements remain UNKNOWN/null, not recreated.
The native record totals 14 observations (7 retained and 7 subsequently
recorded). No clean-FIRST demand or reset is imposed by this review.

346's native record retains 18 observations. Its actual 297px prose labels
are recorded at 16.70625px; this does not cure their semantic placement.
345 retains scroll-width 640px and the recorded reachable scroll end.
All native records remain figure-only CSS-fixture evidence, not headed
product or full-lesson DISPLAY acceptance.

Existing author affected-label repair failures remain failures. This review
does not erase, reset, reinterpret or rerun them; FIRST here means this
independent review of the selected bytes, not a rewritten author attempt.

## Hash Manifest

Paths below are relative to the explicit workspace stated at the top.
345 candidate directory:
`.tmp/ld-s10y-lesson/resume-180-4-n160/modern-figures/fig-345/render-repair/`.

| 345 file | SHA-256 |
| --- | --- |
| Source: `.tmp/ld-s10y-lesson/resume-180-4-n160/artifacts/7p/figures/fig-345.png` | `f46298f4a256384466d7627402c5183dc30cd3f95710525e0a9158bb275b522c` |
| spec.json | `764d90f863d9226aa0f860faf4c29ae09df34a7881bd8a5980cfd6c82a2bc902` |
| figure.svg | `04450a7e5b1a8d7721163c31f6fb1350ef32f97fb3ef58bc4921561313936b0a` |
| render.json | `902a27757faf40e2666cd8aabba979b25eebc11876701c9eac5a5f099778f80d` |
| native.json | `9b2698b5d46c4ee74a00edb52f3eb7c519ade3bffcf8c8797bebd88c93deb9fd` |
| native.html | `60f042c3a9fa6a4c4f57d115d3f06bcd1b79eeef16889d061fa8aa5b60b34043` |
| native.png | `ef4a27410f46201de9d9b8cf7e2c29701b9d7ea9433f9be1c9b80475195d46ef` |

346 candidate directory:
`.tmp/ld-s10y-lesson/resume-180-4-n160/modern-figures/fig-346/label-repair/`.

| 346 file | SHA-256 |
| --- | --- |
| Source: `.tmp/ld-s10y-lesson/resume-180-4-n160/artifacts/7p/figures/fig-346.png` | `b8cb78074906bf742e14e2dad3253e637aa96f00ffa6861182743652e2c01625` |
| spec.json | `3d178ec848245145d2ffd2a75e8fd5f9b8cb85bbbaabc19efcafa5313f180232` |
| figure.svg | `37c0bd9a28c0526cacc390ea7dd37eb25b35f26355bf8cf9b60eda4d76436902` |
| render.json | `943996fb4f6362cc74ee3527cf0685292407bb8c5bb4f1cb3faeaefe1c258408` |
| native.json | `b599754935f9644a9c1b9a4356829ec61bec20daac1642aa133e5906e6874a32` |
| native.html | `17c7efa08fe36dfbf03ee04ba70af90128a48ce78e6c45602ebfaa2c95b20d42` |
| native.png | `12a356b7aa47ad86ac89a63b1566227a2181f5eafc67b5833a6595ba4cf9e7d8` |

## Actual Tool Counts

Final counts include the single read-only verification command after creating
this report:

- `exec_command`: 13, every command with the explicit requested cwd.
- `view_image`: 4, exactly the ledger above.
- `apply_patch`: 1, only this new report.
- `multi_tool_use.parallel`: 4 wrapper invocations for 11 of the commands.
- Total actual tool invocations, including wrappers: 22.
- Leaf/action tool invocations, excluding wrappers: 18.
- Render/validator/native/display reruns: 0; paid/network calls: 0.

No separate pixel evidence was created or copied. No additional evidence
files were necessary. Only this independent review report was written;
all other existing edits and artifacts were left intact.
