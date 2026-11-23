# SAME independent reviewer: affected fig-20 r2

**Affected fig-20 r2 PASS, written before promotion.**

Date: 2026-11-23. Ticket: STEMROBIN-180 / 180-7.
Every command used explicit workdir
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
Only the first fig-20 REVISE is reassessed. Existing fig-19/21 and modern-text
PASS evidence is reused unchanged, not reviewed again.

## Preserved first verdict and source freeze

The FIRST `figure-review-19-21.md` remains unchanged, SHA-256
`4e8f17430a32339474a1e9ab206c10507328dfbb3aa8dc044d71dc9c614e5904`.
Its fig-20 r1 REVISE remains the true first disposition. This separate
affected result closes its missing-horizontal-indicator/guide distinction
finding for the actual r2 candidate only; it does not overwrite that report.

Reused independent source freeze:
`.tmp/180-7-n5-review-19-21/source-first.md`, SHA-256
`3baf7d90807cba751101d0a52edc1ca029f01810e45350c932dfe8d7d0049254`.
Original fig-20 PNG remains
`ssot-resources/soviet10year-textbooks/artifacts/8p/figures/fig-20.png`,
SHA-256 `f42099a98394107bb8d663471cc9cf97a7c9b444716173416f9685989eabc8fe`.
No original, fig-19/21, failed-output image, or source crop was reopened.

Read `figure-author-20-affected.md`, SHA-256
`d3838aa4b64bebad5b467c3a1d42fe282975c0dbb10e370d1c9735ac49c79bd1`,
and its current binding record. Author observations are not independent PASS.
The prior modern-text report remains SHA-256
`996fb829258e092d18ba7eaefbeb397c3509fc6000c8751be033d663be73425f`.
Its template digest remains
`0d64d52579593024087aec5f033d4a429e63075c1297bcf1913fc967788f6ef5`.
No full source or text review was repeated.

## Actual current candidate bindings

All candidate paths below are under `.tmp/180-7-n5-fig20-repair/`.

| File | SHA-256 |
| --- | --- |
| `specs/fig-20.r2.spec.json` | f933a50357cdab4a56cea133ce43a8af5c1df4ea854dd3aa6476110a858cb08f |
| `render/fig-20.r2.svg` | e520781b3cadb5210e8b07bc40fb675eebc3dad653c2cf01e31598d7c137ce7b |
| `render/fig-20.r2.render.json` | 83222949dadf5a7e79f455d518bfbad23962e240c1e1ac92de3c758dacb7b34f |
| `previews/fig-20.r2.png` | 500806e3234cbdab86991815cdd78fbf6c909485fda64cd2c83d91f61d3f1564 |
| `previews/fig-20.r2.composite.png` | 83b99cd39c7a7a1da4d9d3d870735cf621ffd27bf6f088d736e3838f1ed79ebb |
| `evidence/current-bindings.json` | b8ce2d28b0cefc2b76e2f6be1d6172d21cbf7479a46ff1f9cb6dbc80061f836e |

Opened **only the new r2 composite, exactly once**. It contains full 640px,
480px and 318px views of the current PNG. This is the seventh image in this
reviewer's context: **6 -> 7, cap 8**. No other image load or reopen.
The original PNG is the source; the composite is inspection evidence only.

## Actual affected pixels and mathematics: PASS

- Two separate outlined horizontal indicators are now visibly present
  above the same x axis: f_x points A-to-D, and c_x points C-to-D. They
  meet at the projected D position; the negative c direction is visible,
  not merely asserted in metadata. Hollow shafts and arrowhead interiors
  remain distinguishable at full, 480px and 318px.
- The separate upper guide visibly preserves solid A-B, dashed B-D,
  and solid D-C portions. The dashed middle span remains distinguishable
  in the normal-width views. The guide is not confused with the directed
  indicators or the lower a_x/b_x brackets.
- Existing f_x and c_x labels are readable above their corresponding
  intervals. All four foot labels remain readable and correctly ordered
  A-B-D-C; the projection arrows do not obscure B or D. Lower a_x A-B
  and b_x B-C brackets, four vertical dashed drops, and rightward x axis
  remain intact. No extra upper brace, label, tick or numerical given.
- The chain, hollow direct f, all vector letters and over-arrows remain
  visible, correctly directed, and free of glyph boxes, clipping, label
  overlap or broken/black/empty output. No cultural residue or nonsemantic
  color addition. Small unlabelled markers and paper outline components
  are explicitly declared modern additions/regularization, not source facts.

Current new endpoint relationships are executable: projection-f displacement
(320,0) equals A-to-D; projection-c displacement (-140,0) equals C-to-D.
Parallel and zero-horizontal-offset assertions bind the new endpoints and
guide portions to the original shared foot frame. Both new inventory groups
require pointRelationships, with internal mapped relationship coverage.
Solid/dashed guide object styles match the inspected pixels.

Structural r1-to-r2 comparison found **no changed retained object or
assertion**. Only the affected old upper bracket-classified geometry/mapping
is replaced by projection indicators and the solid/dashed guide. All
13 label objects, chain endpoints, feet, vertical drops, lower brackets,
canvas, layout, display and complete authoritative figure20 text are
unchanged. Thus the existing algebra is reused, not solved/reviewed again:
a=(250,60), b=(210,173), c=(-140,-251), f=(320,-18)=a+b+c;
f_x=250+210-140=320, and 60<310<380<520 is A-B-D-C.

The current render report is PASS, 80 objects, 13 labels, collisions [].
Text minima remain 17.8875px at 318, 20.1375px at 358, and 27px at 480.
Previously executed final draft/render/rendered evidence and actual current
hashes were checked; unchanged geometry was not rerendered, guards were not
modified, and no source/text acceptance stages were replayed.

## Failure preservation and permitted promotion

The durable raw `figure20-r1-first-revise/` files retain the true first
reviewed r1 spec/SVG/PNG/report hashes unchanged. Their historical report
path metadata is not current approval. The original first report remains.

The r2 first draft FAIL is bound to spec
`a60fc6232580f02b3d1da64aec5143ac5bb31891480da2ca791d98f7cf9f5e42`
and original validator stdout
`700352a4f5081deade725e326342e488a5dde11624c5548dbdb7ccc15ed9f427`.
The first render FAIL is bound to spec
`b18adf08e479c25b7cf226f92f2a5781b5b1a10a3d19c320597cca0c5bca9458`,
SVG `8203c41abf426c2d3595d1a9628ffa1cf8075995f8d4ed2e72bff17293531007`,
PNG `8968c843e97a256d5b81907d1d81bfa041c04d47327a38dc3828f2032c39d311`,
and report
`863ff195903e1dd4fff48bc2e2fdc51dc9b53e7dc1e72c6ac34248a379f83ae5`.
Those true originals and the environment failure remain historical failures,
not recast as success. No failed pixels were opened.

After this written PASS, copy only unchanged current r2 SVG/spec to canonical
`artifacts/8p/editions/modern-us-neutral/figures/fig-20.svg` and
`fig-20.spec.json`. Rebind only copied current render-report paths
structurally, without geometry regeneration, then use existing
`record_review.py` for a durable current hash-bound PASS.

Retain indispensable source freeze, original/current review binding,
current inspected PNG/composite, r1 first REVISE bytes and r0/r2 true failure
bytes under raw n5 `figures/fig-20-review-evidence/`. Historical original
JSON/log records with ticket-temp paths are retained as `.snapshot.txt`,
not active durable metadata. A separate durable promotion receipt records
the final canonical spec/SVG/render/review hashes.

No edition manifest/text, other figure, DB, Git, app, schema, shared tool,
installation, paid call or new agent/task was touched. This affected figure
PASS is not owning-lesson DOM acceptance or publication authorization.
