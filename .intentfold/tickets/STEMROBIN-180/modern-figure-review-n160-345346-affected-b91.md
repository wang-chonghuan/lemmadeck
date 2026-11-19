# B91 n160 Independent Affected FIG Review: 345/346

Date: 2026-11-19. Ticket: STEMROBIN-180 / 180-4. Reviewer scope: two figures only.
Explicit workspace/cwd for every shell command:
`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.

## Verdict

| Figure | Preserved FIRST independent FIG | Current bounded affected FIG |
| --- | --- | --- |
| fig-345 | REVISE | PASS |
| fig-346 | REVISE | PASS |

The four prior defects are resolved in the selected repaired pixels. This is
neither clean-FIRST nor whole-lesson approval. It does not issue SOURCE, TEXT,
full DISPLAY, official review, promotion, publication, or headed-product acceptance.
The user's explicit targeted-repair authorization beyond the historical
one-attempt limit governs this affected review; no failure or usage is reset.

Targets were derived only from the 345/346 entries in
`.tmp/ld-s10y-lesson/resume-180-4-n160/modern-figures/FIG-FIRST-affected-final-selected.json`:

- 345: `modern-figures/fig-345/FIG-FIRST-affected/spec.json`.
- 346: `modern-figures/fig-346/FIG-FIRST-affected-B-only/spec.json`.

These abbreviated paths are below `.tmp/ld-s10y-lesson/resume-180-4-n160/`.
Selector status remains the author's `AFFECTED_AUTHOR_DRAFT_NOT_REVIEWED`;
this reviewer did not alter it.

Read the image skill, quality gate, ips-chrome-background skill, project
engineering/operations boundaries, and the prior independent report.
Read the entire approved modern-us-neutral lesson prose and all six exercise
texts in `artifacts/7p/editions/modern-us-neutral/lessons/phy7-c2-s4-n160/`.
All 26 nonempty prose/caption and exercise context entries exactly match both
selected specs' `source.authoritativeText`; its JSON.stringify SHA-256 remains
`dc672e14ebb90f3f646c7edd9712a6780b2e78571fd27cf26eabb09666ec2860`.
No answer key was used.

## Image Ledger

Each original was opened before its selected native image. Both full-size and
297px prose-fixture portions of each native PNG were inspected in its one load.

| Actual load | Figure | Path below the n160 scratch root |
| --- | --- | --- |
| 1 | 345 | `artifacts/7p/figures/fig-345.png` |
| 2 | 345 | `modern-figures/fig-345/FIG-FIRST-affected/native.png` |
| 3 | 346 | `artifacts/7p/figures/fig-346.png` |
| 4 | 346 | `modern-figures/fig-346/FIG-FIRST-affected-B-only/native.png` |

Actual image loads: 4/8 batch, 4/24 current context, two per figure.
Reopens: 0. Crops: 0. Separate SVG/candidate-image loads: 0.
New screenshots: 0. Pixel copies or payloads to parent/other chats: 0.
Binary hashing is not an additional visual load.

## Figure 345: Affected PASS

### Independent Original-Pixel Inventory

The original contains two complete apparatus states side by side, a/b. Each
contains a battery with both polarity signs, a stand/clamp/base, two flexible
conducting suspension leads, one suspended straight conductor in a horseshoe
magnet's pole gap, the yoke and both poles, a knife switch, an adjustable
horizontal resistor with its sliding contact, and the exterior series leads.
N is above S in both panels. A/B occur only in a. The switch is open in a,
closed in b, with changed suspension/conductor position in b. There are no
source force/current arrows, given lengths, angles, grids, or numerical data.

| Source inventory | Selected native pixels and existing spec mapping |
| --- | --- |
| Two states and panel labels | Both complete states and Latin a/b are visible in the full-size portion; `a-panel-label`, `b-panel-label`. The 297px initial scroll position shows a, not a missing b; existing reachable-end evidence is retained. |
| Stand, clamp, base in both | Retained in `a-support` / `b-support`; the new insulating seats are explicitly modern clarification, not source apparatus measurements. |
| Yoke, both poles, N above S | Present in `a-horseshoe-magnet` / `b-horseshoe-magnet`; no polarity reversal. |
| Two flexible leads and suspended straight conductor per panel | Present in both `*-suspended-conductor` groups; straight AB and changed b-state bend/position remain visible. No exact displacement is asserted as source data. |
| Source A/B labels in a only | Both label their original left-state conductor endpoints; b has no invented visible A/B. |
| Battery and both signs, exterior series leads | Present in both `*-series-circuit` groups; the supply goes to separate conducting suspension ends. |
| Open a / closed b knife switch | Visible blade/contact gap in a and joined blade/contact in b, unchanged by the repair. |
| Adjustable resistor and slider | Both present in each circuit; not replaced with a fixed resistor or missing contact. |

All eight source-inventory groups are complete against the original pixels.
Modern endpoint anchors, schematic lead bends, and insulating seats do not
introduce new given quantities. No source-script/cultural decoration leaked.

### Resolution of 345-1

At each of the two suspension attachments in each state, the heavy clamp is
interrupted by a paper-filled, thin-outlined insulating seat. The thin vertical
conductor remains continuous through that seat, while the heavy mechanical
clamp does not bridge across it. The two branches are visibly separate, not
joined by an unbroken conducting-looking clamp.

The negative return now runs to the left of the base with a visible gap in
both states, rather than touching the base outline. The seat separation and
base clearance are also visible in the 297px prose fixture's unscaled scroll
media. Following either circuit does not yield the former clamp/base bypass of
AB. Both flexible leads, both supports, magnet labels, switches, sliders, and
the two-state distinction survive the repair.

## Figure 346: Affected PASS

### Independent Original-Pixel Inventory

The original contains one rectangular ABCD winding/frame, A/D at its upper
left/right and B/C at its lower left/right corners; a vertical axle with base
support; a curved rotation indicator; a dashed equilibrium orientation; S-left
and N-right poles with exterior stubs; two separate complete rings marked 1 at
different shaft heights; two separate brushes marked 2; two distinct winding
ends, each leading to its own ring; and the battery, both polarity signs,
open knife switch, and exterior brush circuit.

The original is a perspective apparatus illustration, not a measured turn
count, grid, or numerical geometry. Brush mounting detail is schematic;
the instructional distinction is two brushes contacting two complete rings.
Projected crossings are not new electrical junctions.

| Source inventory | Selected native pixels and existing spec mapping |
| --- | --- |
| Rectangular frame/winding and A/D upper, B/C lower solid corners | All retained in `winding-axle-equilibrium`; the repaired B/C leaders explicitly terminate at the true solid corners, not the dashed orientation. A/D remain unchanged. |
| Vertical axle, base, rotation indication | Axle/support and curved arrow are present. The repair does not change arrow geometry or add current/force vectors. |
| Dashed alternate equilibrium orientation | Visible and distinct from the solid frame; not confused with B/C labels. |
| Left S, right N and separate exterior pole stubs | Retained in `magnetic-poles`, without pole swapping or substitution by supply wires. |
| Two complete rings at different heights | Both closed ovals retained in `rings-brushes-and-winding-leads`; no split-ring/commutator substitution. |
| Separate winding ends to different rings | First end reaches the upper ring, second reaches the lower ring; the B-area opening remains visibly separated. |
| Two brushes and ring/brush identification | Separate left/right brush contacts retained; 2 identifies a brush, and the two visible 1 leaders identify exposed arcs of the respective rings. |
| Battery signs, open switch, exterior brush circuit | Present in `support-and-exterior-circuit`, with an actual switch gap and separate supply routes. |

All four source-inventory groups are complete against the original pixels.
The clean winding outline is a schematic representation of the prose's
insulated multi-turn winding, not a claim of one literal turn.
Repeated 1 and B/C leaders are modern clarifying annotations, not new data.
No E/F commutator labels, angle values, answer-bearing annotations, or
source-script/cultural symbols were introduced.

### Resolution of 346-1

The first winding end now leaves its vertical return toward the left,
away from B and the second end. The clear opening between that return and
the solid lower-left corner remains visible at full size and in the 297px
fixture; the former near-tangent diagonal no longer merges at B.
Each end still reaches its own distinct complete ring.

The added paper underlay at the second lead's crossing over the mechanical
shaft visibly establishes foreground occlusion/non-contact. It neither makes
a common electrical node nor replaces the shaft or either ring. The repaired
lead route does not reconnect the winding opening.

### Resolution of 346-2

B is below the lower-left solid corner with a short leader terminating there.
C is below the lower-right solid corner with its own short leader. Neither
leader targets the dashed equilibrium frame. Both associations are readable
in the 297px portion as well as the full-size portion; the letters do not
obscure winding contacts, pole labels, or the dashed orientation.

### Resolution of 346-3

The upper 1 leader now terminates on the exposed upper-left ring arc, above
the brush/contact cluster. It no longer passes through the brush interior or
terminates at the shared brush/winding contact. Its incidental thin crossing
of the winding route has no junction marker and its target is plainly the
ring arc, not that wire. The additional lower 1 leader terminates on the
exposed lower-right ring arc, clear of the right brush and its supply lead.
Label 2 still identifies the brush. These are annotation leaders, not new
circuit branches. Both references remain distinguishable in the 297px fixture.

## Retained Gates and Failure History

Both current `render.json` and `native.json` records retain PASS; all their
source/spec/SVG/render/HTML/PNG/CSS hash bindings match the bytes inspected.
They were read and reused, not rerun. Render collision lists are empty.
Current native records contain 14 observations for 345 and 14 for 346, each
with `reusedFirstObservations: 0`; these counts are not rewritten as FIRST.
345 records 640px scroll media in exercise/print fixtures and 660px in screen
prose fixtures, reachable end, and minimum label sizes of 22/22.6875px.
346 records 297px prose media with 16.70625px labels.

The prior report remains byte-identical and retains FIRST REVISE for both.
Its historical selected native counts remain 14 for 345 and 18 for 346,
distinct from the current affected records' 14/14. The earlier 345 invalid
paper-fixture failure remains a failure; its seven retained observation
measurements remain UNKNOWN/null as recorded in that prior report.
Do not pool observations across different candidates into one validation.
The selector's two failed 346 affected-spec candidates and unrendered layout
hash remain history, not successful attempts. Their available spec hashes
were checked without rendering or reopening their images.

No new misleading topology, label, direction, or cultural issue was found
in these two repaired candidates. Other n160 figures and disjoint n161 work
are outside this review.

## Hash Manifest

Paths are relative to the explicit workspace. Current candidate directories:
345 `.../modern-figures/fig-345/FIG-FIRST-affected/`;
346 `.../modern-figures/fig-346/FIG-FIRST-affected-B-only/`,
where `...` is `.tmp/ld-s10y-lesson/resume-180-4-n160`.

| File | SHA-256 |
| --- | --- |
| Selector | `a3a2dc9563ddb4ee407dc1553a4c0c136d1c313fcf04ba13338dbebfac2f85b6` |
| Prior independent report | `c05f5153726c29fd70b9a869eb93e311ed1137317e49793b4c11e019f5141316` |
| Approved edition lesson.json | `0d7ee8aeee804ce571696fee2d5967abb7e7b8d1cab4b468c78b66ba1cb0ad43` |
| Approved edition exercises.json | `d7b6f7e903067ffb029879de583c04f8bdc353116c297d56847e443c5c1a2e64` |
| app/src/styles/app.css | `9fdcb8b3060e0cd0a6b97bf8a32f18c924b60a18226fa8c0d1a485221277168f` |
| 345 original PNG | `f46298f4a256384466d7627402c5183dc30cd3f95710525e0a9158bb275b522c` |
| 345 spec.json | `a177cd7f55fa77eff28d25bea73da41b12e716d8ad0f66b6c6b1ca055155ec03` |
| 345 figure.svg | `00a89216cd267918f4e24064a3a37c14236f0df05e33064212d45bef61689e76` |
| 345 render.json | `93110fb6979555b8c552cf4c270633566f6f360ff4c9669bcc8858f287d80835` |
| 345 native.json | `5e54f1c146794685543a0b5d1be87f843203cda741852829e2c33a1cfc9e209f` |
| 345 native.html | `0abab427a36553ab40a7e7d46bf9552a072c773a4317af100fec6aac19069e86` |
| 345 native.png | `caa438e1b51e0846a381b5d938f5622d5ccc2e34bf06ab5ce99e754c945a5f34` |
| 346 original PNG | `b8cb78074906bf742e14e2dad3253e637aa96f00ffa6861182743652e2c01625` |
| 346 spec.json | `1a3fd5ea9c7d3be08c4c06771dd8ea41bbfeb88055005dbed2c7a8ba13941ab5` |
| 346 figure.svg | `f9a1c6f9c58070de0f13c22d0954f358d9d9696cc5ef4d43be5df24146516256` |
| 346 render.json | `f36f1a0d6743f4e9fa022144277133b0367e0d7567ef3d9dd9708b9f076e281c` |
| 346 native.json | `e662301a1f8572bd01ca4d18857346f8397d563043b670d447052d30d42c397c` |
| 346 native.html | `33ba18796ae9444ce736b11b305ee0841f5c19dee8a0d768e98769f49285bd94` |
| 346 native.png | `bb2c48477b137bf76aa1048a25632df3f2f70dea132098eaa9dd4c469c51a952` |

Own textual evidence:
`.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/fig-review345346-affected/bindings.json`.
It binds the exact current files and preserved candidate-spec history.
This report and that evidence file are frozen at mode 0444 after final
read-only hash verification. No existing file's content or mode was changed.

## Actual Tool Counts

Final counts include the one command that verifies the written manifest,
rechecks the input bindings, freezes the two owned files, and reports modes/hashes.

- `exec_command`: 18, all with the exact requested explicit workdir.
- `view_image`: 4, exactly the image ledger.
- `apply_patch`: 1, adding only this report and own bindings.json.
- `multi_tool_use.parallel`: 4 wrapper invocations, containing 16 shell calls.
- Total tool invocations including wrappers: 27.
- Leaf/action invocations excluding wrappers: 23.
- Renderer/validator/native/SOURCE/TEXT/full DISPLAY reruns: 0.
- Browser launch/interaction, network, paid calls: 0.
- Task/agent management, Git/backend/DB/publish/promote operations: 0.

Only the two authorized new textual files were written and frozen. Author
specs, official reviews, shared main, and others' work were left untouched.
