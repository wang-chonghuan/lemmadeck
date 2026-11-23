# STEMROBIN-180/180-7: FIRST modern figure author batch 15-18

Date: 2026-11-23. Role: author only.
Status: **HOLD: existing validator rejects required hidden inventory points.**
This is not independent review, source-fidelity approval, or permission to
promote. The four draft specs exist; their validation fails; no rendered
output or preview exists. No source-uncertainty waiver was used.

## Scope and authority

Every executed command used the exact workdir:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.

Writes were limited to
`.tmp/180-7-n5-figures-15-18/` and this durable author report. No other checkout,
DB, Git, install, bootstrap, paid call, new agent, reviewer dispatch,
review file, edition manifest, promotion, or shared tool edit was performed.
Concurrent edits were preserved.

Candidate authority:
`.tmp/ld-s10y-lesson/adapt/8p/modern-us-neutral/lessons/phy8-c1-s1-n5/lesson.template.json`.
Initial SHA-256:
`5b158d8fffc12ace22c18514a68f00f6b5aa84091a8f54625afee12d1a4c8d23`.
Handoff observation SHA-256:
`71e7685ee56dc56a9a1314ce085959c647120ea6dbe3b0105e8ae4d7b62343b1`.
The candidate changed concurrently. At binding time every complete paragraph
in each spec's `source.authoritativeText` still exactly matched a current
candidate prose paragraph. The candidate was not modified by this author.

Complete relevant addition text is embedded, not a summary:

- fig-15: p0028#10 + p0029#5, complete parallelogram-rule paragraph.
- fig-16 and fig-17: p0029#6, complete two-vector and multi-vector
  head-to-tail paragraph.
- fig-18: p0029#11 + p0030#1, complete collinear-addition paragraph,
  plus the complete p0029#6 head-to-tail paragraph.

The unrelated projection discussion awaiting its registered erratum is not
included. Raw n5 `lesson.md` was read only as secondary context.

## Frozen source inventory

Originals were opened individually, in order 15, 16, 17, 18, once each.
The pixel inventory was saved before drawing a spec. Its fig-16 label-count
wording was corrected from "five" to "six" before the first spec was added;
the listed eight source labels and observed source structure did not change.

Full inventory:
`.tmp/180-7-n5-figures-15-18/source-inventory.md`
SHA-256:
`c7f695536780fde25fbb151a6109b7111a20f02cd1ccff91c612355aef2c2c23`.

Original root:
`ssot-resources/soviet10year-textbooks/artifacts/8p/figures/`.

| Original | SHA-256 |
| --- | --- |
| fig-15.png | 0f6c36251427b0f83722ccd7f638e159fd8ae76ef66b6c1d5fb328238c4a9b43 |
| fig-16.png | 244cc3d546a70fa6d65b9e440e33162346f32ee37e9cdc0076d310aa7516d888 |
| fig-17.png | 74ea7dcd9365da08431b4e1a406ab401f396b3d4a01ee791e6f12163a5a55c9d |
| fig-18.png | d93d3fef8cbcb120b0b5d9be02e11a92d686ff17f283ca65e165861c841af110 |

Each draft `source.image` references that durable original PNG with its
actual matching hash.

- **fig-15:** Preserve both separate input arrows (a down-left, b down)
  and the full parallelogram: common upper-right origin, a ending
  upper-left, b ending lower-right, two dashed completion sides meeting
  lower-left, and the down-left a + b diagonal. Five vector labels,
  five semantic arrows, two dashed sides, eight defining endpoints.
  No printed point names/dots, axes, grid, ticks, numerical lengths or angles.
- **fig-16:** Preserve all three source subfigures: separate input arrows,
  a-then-b chain, and b-then-a chain. Each chain's resultant connects
  its first start to its final end; both source resultant labels remain
  a + b. Eight vector-label instances, eight semantic arrows, ten
  defining points. No printed point names/dots or numeric givens.
- **fig-17:** Preserve O -> A -> B -> C -> D -> E and the O -> E
  resultant. O bottom-right, A bottom-left, B left-middle, C above/right,
  D above/right again, E top-right. Six source letter labels, five
  addends, one resultant, six defining vertices. No collapsed triangle,
  grid, numeric givens, or invented dot markers.
- **fig-18:** Preserve standalone a and longer standalone b in separate
  rightward input rows; b starts farther right. Preserve a then b on
  one baseline and the separate start/end-aligned resultant beneath.
  Five vector labels, five semantic arrows, nine defining endpoints.
  No source numerical length ratio, ticks, axis or point markers.

Modern additions are declared separately in the inventory and each spec
description: exact coordinates, regularized spacing/equality/parallelism,
English panel identifiers where useful, 36 px labels, semantic colors,
and single clear resultant arrows replacing outlined scanned shafts.
Coordinates are hidden construction data, not visible source givens.

Every semantic arrow has a `connects` assertion; both fig-15 completion
segments do too. Every defining point is in a complete
`requires: ["pointRelationships"]` inventory group with mapped internal
multi-point relations. All defining point objects have `visible: false`.

## Exact draft bindings

Draft root: `.tmp/180-7-n5-figures-15-18/`.

| Draft | SHA-256 |
| --- | --- |
| fig-15.spec.json | 8044085af03ba261047d40647324cc92dc07b9a29342fb689240575f9add2336 |
| fig-16.spec.json | ae529db406baa5aee732d53e918c23dd80751637adda93dad417a49d57398c78 |
| fig-17.spec.json | f5e213e1f21d208042abd8b90404ea15b99d09a40ba96816df0375dea2f6af54 |
| fig-18.spec.json | 99f5f86a478ca08f423e1469ca60f3452afc75a940c7eb9237fc5594f8866d85 |

Machine-readable binding report: `hash-bindings.json`
SHA-256:
`d1511772d7bd1961a4019aad8be95485b4bea2e5d927c459bfbbc2c515676184`.
Its paths, source/spec/report hashes, current text matches, image-open counts,
and unperformed stages describe author drafts only.

## Actual validation and first failures

Each spec was validated exactly once with the existing command:

```sh
python3 .agents/skills/ld-s10y-image/scripts/validate_spec.py \
  .tmp/180-7-n5-figures-15-18/fig-15.spec.json --stage draft --json
```

The same command was used with 16, 17 and 18 substituted individually.
A Node `spawnSync` wrapper saved the validator's actual stdout without
altering it and propagated its exit code. All four executions exited **2**.

| Preserved first report | Errors | SHA-256 |
| --- | --- | --- |
| fig-15.validation.first.json | 8 hidden mapped points | e313ecc63e79db9c7c344840de81768911335ef10d6e01e3a787e5b1b8ffcdcd |
| fig-16.validation.first.json | 10 hidden mapped points | 1755e9b2078ff9b04ad271fe4e8655d16c97c6eeb5fc849dee7c1aea41008a31 |
| fig-17.validation.first.json | 6 hidden mapped points | 2e63b7111bfb590de57e2896de6909c159b25ff03664dbcf6076e03f9b9d9362 |
| fig-18.validation.first.json | 9 hidden mapped points | 8dc51737b22cde396378652ee236807660fdfae8ae258d3b51b8e789254c8ff9 |

The exact first error is:
`source.inventory[2]: missing visible object 'input-a-start'`
for fig-15. All 33 errors have this same visibility cause. No other
mathematical/assertion errors were reported; that does not turn the overall
failed validation into approval.

Concrete conflict:
`.agents/skills/ld-s10y-image/scripts/validate_spec.py:430` rejects
`obj.get("visible") is False` for every mapped inventory object. Its
point-relationship gate at line 487 also requires mapped point objects.
The assignment requires hidden endpoints and complete internal point-group
mapping. There is no in-scope spec repair that satisfies both without adding
unmarked dots or dropping the required point inventory.

Validator hash:
`ae02c4e7467fc200dcd0dc13ef720eb328846a10f93affbf10a5509c466a3b81`.
Existing renderer
`.agents/skills/ld-s10y-image/scripts/render_spec.mjs` hash:
`a5558857b3918d8c667080751dc53b0c9ba6471556a2adf0e855bf617126373a`.
The renderer performs that same draft validation before rendering. It was
not invoked after the failed prerequisite. No repeated failed call,
validator bypass, hand-written SVG, or arbitrary retry was attempted.

## Render, preview and display status

For **each of fig-15, fig-16, fig-17 and fig-18**:

- Render status: **not run; draft validation prerequisite failed**.
- SVG, render report, preview PNG: **not produced**.
- Author visual inspection of rendered output: **not performed**.
- Independent review and promotion: **not performed**.

Image budget used: **4 source opens + 0 preview opens = 4 / 8**.
There were no crops, reopens, or other image loads.
There are no actual rendered images to return.

All four drafts declare deterministic, instructional, semantic-color-only
inline output, canvas width 640, widths 318/358/480, maximum 480, and
36 px labels. Nominal 36 * 318 / 640 = 17.8875 px is arithmetic only.
No renderer text-width, collision, final owning-lesson media-width,
mobile/product readability, theme, or cultural visual result is claimed.

## Handoff boundary

The existing tool owner's separately authorized scoped repair must allow
hidden defining points to be inventory-mapped while retaining the complete
internal relationship gate. This author did not own or edit that shared
validator. Preserve all first-failure reports when continuing.

After that repair, continue only the failed validation and downstream
existing JSXGraph render stages for these same four drafts. Use
`render_spec.mjs`, not hand-authored SVG; inspect at most one generated
preview per figure. Exact future outputs must be newly bound. The independent
reviewer owns substantive review and promotion; final product measurement
belongs to the owning lesson. Do not interpret this author handoff as a
review result or an edition-manifest entry.
