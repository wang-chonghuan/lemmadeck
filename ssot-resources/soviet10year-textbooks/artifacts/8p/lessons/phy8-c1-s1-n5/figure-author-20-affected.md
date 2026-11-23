# Affected Figure 20 AUTHOR repair, n5 / 180-7

Date: 2026-11-23. Ticket: STEMROBIN-180 / 180-7.

Status: HOLD, awaiting the same independent reviewer's affected Figure 20
review. This is an AUTHOR repair and actual-preview observation, not a
source-fidelity PASS, independent review, promotion, or publication.

Every command used explicit workdir:
/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180.

Only the owned .tmp/180-7-n5-fig20-repair/ scratch, this raw n5 report, and
the explicitly requested byte-identical durable first-r1 failure snapshots
were written. Figure19/21 and their PASS evidence were not edited or replayed.
No other asset, edition manifest/text, original source, shared tool, or review
file was edited. No DB, Git, installation, bootstrap, new agent/task, paid
call, wrapper package, intake, or extra acceptance/pixel gate was used.

## Source first, independently frozen

The durable original artifacts/8p/figures/fig-20.png was actually opened
once, before reading the previous spec, author report, or independent review.
The relevant actual-pixel inventory was immediately frozen at:

/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/.tmp/180-7-n5-fig20-repair/source-pixel-inventory.freeze.md

SHA-256: 62ae5f2efe26aceb6a6f5386631b69e4e5aa9c25dd6adde1e780b229633ba281.
The freeze was not amended after reading previous interpretations.

Source PNG SHA-256:
f42099a98394107bb8d663471cc9cf97a7c9b444716173416f9685989eabc8fe.

Relevant observations: the vector chain and direct resultant, four broken
vertical drops, feet A-B-D-C, a rightward x-axis, separate directed horizontal
projection indicators A-to-D / C-to-D above the axis, continuous and broken
horizontal guide strokes, f_x/c_x above, and two curved a_x/b_x brackets
below. Upper low-resolution bends do not authorize extra brackets, labels,
ticks, coordinates, or new mathematical givens.

The existing raw figure-review-19-21.md was then read. Its exact FIRST
verdict remains fig-19 PASS, fig-20 REVISE, fig-21 PASS. The missing horizontal
indicators and solid/dashed distinction are the sole affected repair.

## Durable first-r1 failure snapshots

Before authoring r2, the exact inspected r1 spec/SVG/PNG/render report were
copied exclusively, without overwrite, to this durable raw n5 directory:

/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c1-s1-n5/figure20-r1-first-revise/

| File | SHA-256 |
| --- | --- |
| fig-20.r1.spec.json | c88c7e68bb9a62cf75a91650bbf27522c7e50898f971cba5a4d8fce55283e232 |
| fig-20.r1.svg | 2497b6f2d177e2faa6e21fafe7bd9663ba2eba78a6159cab7d46d29eee559747 |
| fig-20.r1.png | d5b447e64c699f0cb711a044c63df61e0bea388c551ce130f127ab78a5e67767 |
| fig-20.r1.render.json | e9ae7459a48e0f6fe629d44bce7007d8830a147294a7dedfb57e5c24ba39b9f6 |

All four still match the original candidate and FIRST review hashes.
Their internal path metadata was deliberately not rebound: these are unchanged
historical failure snapshots. A mechanical r1 render PASS never overturned
the independent source-fidelity REVISE. Original r0/r1 failures and review
files remain intact.

## Narrow Repair And Current Mathematics

Replaced only the old upper f_x/c_x bracket-classified geometry and its
mapping/assertions: 26 old construction objects removed, 16 native JSXGraph
objects added. The two existing f_x/c_x text objects retain their original IDs,
text, anchors, size, and placement; their legacy bracket-prefixed IDs do not
claim that the new indicators are brackets.

New source groups map outlined projection-f A-to-D and projection-c C-to-D
separately from horizontal-guide-A-B (solid), horizontal-guide-B-D (broken),
and horizontal-guide-D-C (solid). Every arrow/core/guide has executable
connects and displacement assertions; parallel and foot-to-endpoint offset
assertions preserve the common frame. Both groups require pointRelationships,
and every mapped point has an internal mapped relationship.

Modern additions/regularization are explicitly separate from source facts:
straight arrow row y=247 and guide row y=270, their 71/94 offsets from the
axis, small visible unlabelled endpoint markers, and native paper-core arrows
and paper head polygons. These are rendering coordinates/components, not
source measurements, extra vectors, source dot markers, brackets, or labels.
No generated SVG path was hand-edited and no validator was weakened.

All unaffected objects and assertions were compared structurally against
the preserved r1 spec and are unchanged: vector chain, hollow f shaft/head,
ordinary vector letters and over-arrows, all 13 labels, four foot coordinates
and vertical drops, x-axis, lower a_x/b_x bracket objects, canvas, layout,
and display contract.

- a=(250,60), b=(210,173), c=(-140,-251).
- f=(320,-18)=a+b+c.
- a_x=250, b_x=210, c_x=-140, f_x=320=250+210-140.
- Foot x order 60 < 310 < 380 < 520 is A-B-D-C.
- New directed projection endpoint displacements are (320,0) and (-140,0).

The complete relevant authoritative text is the current template's prose
indices 20-23, embedded unchanged in r2. Template:

/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/.tmp/ld-s10y-lesson/adapt/8p/modern-us-neutral/lessons/phy8-c1-s1-n5/lesson.template.json

SHA-256: 0d64d52579593024087aec5f033d4a429e63075c1297bcf1913fc967788f6ef5.

## True Repair Failures, Preserved

All paths in this section are under the owned scratch evidence directory:
/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/.tmp/180-7-n5-fig20-repair/evidence/.

First r2 draft validation exited 2: five parallel assertions incorrectly used
two endpoint-pair arrays instead of this validator's a/b/c/d point fields.
The failed spec and original stdout/stderr are preserved unchanged:

- fig-20.r2.first-draft-fail.spec.json:
  a60fc6232580f02b3d1da64aec5143ac5bb31891480da2ca791d98f7cf9f5e42.
- fig-20.r2.first-draft-fail.stdout.log:
  700352a4f5081deade725e326342e488a5dde11624c5548dbdb7ccc15ed9f427.
- fig-20.r2.first-draft-fail.stderr.log is empty.

Corrected only those five assertion field shapes; validation then passed.
The first actual render exited 2 with a collision at foot-B-name-label.
No failed pixels were opened. That failed spec/SVG/PNG/report set remains:

- fig-20.r2.first-render-fail.spec.json:
  b18adf08e479c25b7cf226f92f2a5781b5b1a10a3d19c320597cca0c5bca9458.
- fig-20.r2.first-render-fail.svg:
  8203c41abf426c2d3595d1a9628ffa1cf8075995f8d4ed2e72bff17293531007.
- fig-20.r2.first-render-fail.png:
  8968c843e97a256d5b81907d1d81bfa041c04d47327a38dc3828f2032c39d311.
- fig-20.r2.first-render-fail.render.json:
  863ff195903e1dd4fff48bc2e2fdc51dc9b53e7dc1e72c6ac34248a379f83ae5.

Moved only the new arrow row 239-to-247 and guide row 265-to-270, including
their paper cores and offset assertions. Existing B and other labels stayed
fixed. Original failed render stdout/stderr were not overwritten.

Composite generation initially exited 1 because system python3 lacks PIL.
Reused the already-existing lesson .venv/bin/python successfully; no install
or bootstrap. This environment failure consumed no model image load.

repair-r2.json binds the initial failed authoring attempt, not the final
candidate. current-bindings.json explicitly supersedes that initial spec
binding and lists all current and failed-file hashes.

## Current Candidate And Executed Evidence

Current scratch root:
/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/.tmp/180-7-n5-fig20-repair/

| Current File | SHA-256 |
| --- | --- |
| specs/fig-20.r2.spec.json | f933a50357cdab4a56cea133ce43a8af5c1df4ea854dd3aa6476110a858cb08f |
| render/fig-20.r2.svg | e520781b3cadb5210e8b07bc40fb675eebc3dad653c2cf01e31598d7c137ce7b |
| render/fig-20.r2.render.json | 83222949dadf5a7e79f455d518bfbad23962e240c1e1ac92de3c758dacb7b34f |
| previews/fig-20.r2.png | 500806e3234cbdab86991815cdd78fbf6c909485fda64cd2c83d91f61d3f1564 |
| previews/fig-20.r2.composite.png | 83b99cd39c7a7a1da4d9d3d870735cf621ffd27bf6f088d736e3838f1ed79ebb |
| evidence/current-bindings.json | b8ce2d28b0cefc2b76e2f6be1d6172d21cbf7479a46ff1f9cb6dbc80061f836e |

Executed the existing validate_spec.py with --stage draft --json, then
render_spec.mjs with --spec specs/fig-20.r2.spec.json, --svg
render/fig-20.r2.svg, --png previews/fig-20.r2.png and --report
render/fig-20.r2.render.json, then validate_spec.py --stage rendered --json.
All paths were prefixed by the current scratch root above; validator/renderer
were the existing .agents/skills/ld-s10y-image/scripts/ files.

Final stages exit 0. Logs remain evidence/fig-20.r2.final-draft.*.log,
fig-20.r2.final-render.*.log and fig-20.r2.rendered.*.log. The report binds the
current spec/SVG, has status pass, 80 objects, 13 labels, no collisions, and
no display failures. Minimum text sizes: 17.8875px at 318, 20.1375px at 358,
27px at 480. These are declared figure checks, not owning-lesson DOM claims.
Source/spec/output/template/snapshot/tool hashes and all unaffected object
structures were checked again at final binding.

## Actual Preview, Budget, Reviewer Handoff

Opened only the current r2 composite once. It contains the full 640px render
and 480px/318px resized views of that same render, not additional source
images. Actual observed pixels show opposed outlined projection arrows meeting
at D, the solid/broken/solid horizontal guide above them, readable existing
vector marks/component/foot labels, unchanged lower brackets, and unchanged
vector chain/drops/axis. This observation is not an independent PASS review.

Model image loads: exactly 2/2 = original figure20 once + final r2 composite
once. No crop, other image, failed-render load, source/preview reopen, or
additional author pixel gate. Two renderer invocations produced a preserved
failed output and the repaired output; only the final output was visually
loaded. New paid calls: 0. New agents/tasks: 0.

The same independent reviewer should reuse the existing source freeze and
unchanged 19/21 PASS evidence, inspect only the new Figure20 composite, and
bind the current r2 spec/SVG/render evidence. Figure20 remains HOLD; no review
file was authored, no asset was promoted, and no lesson was published.
