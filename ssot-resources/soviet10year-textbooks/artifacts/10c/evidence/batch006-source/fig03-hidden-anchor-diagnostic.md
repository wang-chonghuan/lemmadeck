# 10c fig03 hidden-anchor diagnostic

Date: 2026-11-16. Scope: read-only diagnosis, not a FigureSpec repair,
failure exemption, independent source-image review, or figure approval.

## Conclusion

Yes: in the current renderer, a point with `visible:false` and a nonblank
string label still creates a separately rendered SVG label. `visible` controls
the point marker, not this overlay text. The current inventory check instead
rejects every mapped object with `visible is False`, conflating an invisible
marker with a missing visible representation.

That mismatch is real, but a nonblank label alone does not establish source
fidelity, correct geometric incidence, contrast, or successful display.
O/A/B/D can identify unmarked visible line locations; C must remain an arc-name
anchor, not an invented dotted point or intersection. The parent must decide
the contract interpretation before any implementation. fig03 remains BLOCKED;
the first rejection remains valid historical evidence and is not waived.

## Evidence And Execution Boundary

Read the requested author notes, current spec, retained first validation,
image skill, FigureSpec reference, inventory/assertion logic, and renderer
point/label/export branches. Also read the object schema and project baseline.
No tests were read as design evidence. No validator, render, test, browser,
source extraction, network, Git, DB, dependency, or promotion command was run.
No answer/choice artifacts, other reviewer records, or environment files were
read. The only authored artifact is this report.

No original PNG was reopened in this diagnostic. Source-pixel statements below
are the user's supplied facts and the requested author's recorded observation,
not a newly performed independent source-image review.

Read-only SHA-256 measurement of inputs:

| Input | SHA-256 |
| --- | --- |
| `.tmp/s10y-image/10c-fig03/author-notes.md` | `e1ffff50cde8bb78f68ac80b7bd97acc286e1bd3e524339317e8b2d969d8e4e7` |
| `.tmp/s10y-image/10c-fig03/spec.json` | `90fd15ccdaef1c3768e076cc7abdaf81d230e884ce317cdcda05d31ad23b72ad` |
| `.tmp/s10y-image/10c-fig03/rejected-first-inventory/spec.validation.json` | `5170db611a07b647a08d22a056ccb033bc4eed4acece2973825b0499b37dbe78` |
| `.agents/skills/ld-s10y-image/references/figure-spec.md` | `6f2b41d19de676f4a14787899a1a47310be5632c8ee8700de76e971edd467574` |
| `.agents/skills/ld-s10y-image/scripts/validate_spec.py` | `09710764de37027add910c734832a953f77b909cc50080807765b8aa20299668` |
| `.agents/skills/ld-s10y-image/scripts/render_spec.mjs` | `28ab00dbc42840537fc06289358bd7c6934d205b8f9e2fb9e60d5a25f57e7d91` |

The retained draft validation has exactly five errors, all in inventory group
0: missing visible object `point-o`, `point-a`, `point-b`, `point-d`,
`point-c`. The author records one renderer-command attempt, one preflight
validation, zero actual renders and no visual/render PASS. These execution
counts are reported evidence, not commands repeated by this diagnostic.

## Renderer Trace

Production file:
[render_spec.mjs](/Users/yong/.codex/worktrees/a07e/lemmadeck/.agents/skills/ld-s10y-image/scripts/render_spec.mjs:244).

- `addLabel`, lines 244-258, skips only falsy `text`; it does not consult
  `object.visible`. It records anchor, text, placement, font and semantic fill.
- Point creation, lines 268-286, disables JSXGraph's own label with
  `withLabel:false`. `visible: object.visible !== false` hides its marker;
  only visible markers enter `visiblePoints`. `addLabel(object, object.at)`
  executes outside that conditional.
- Lines 609-611 append a separate label layer directly to the SVG.
  Lines 707-716 append an SVG `text` node for each label, including
  `point-o-label` through `point-c-label`. The text is not a child of the
  hidden point and receives no inherited point visibility or point opacity.
- Placement checks score clipping, other labels, visible markers, avoid
  regions and geometry strokes. Lines 791-851 retain text in deterministic
  composite/overlay exports and measure it at declared widths.
- Lines 64-75 and 905-933 run draft validation before `render()` and browser
  launch. This spec currently stops there: five labels would be generated
  if rendering were reached, not five labels observed in an actual output.

For the current five labels, the strings O/A/B/D/C, `ink` fill, 44px font and
supported placements request ordinary visible text without dots. A whitespace
string can pass the renderer's truthiness check yet draw no glyphs. Paper-on-
paper labels, invisible characters, off-canvas placement and other display
failures are also not disproved merely by a truthy label. Render measurements
and independent visual review remain necessary; planned scaled font sizes
are not measured PASS evidence.

## Source Identity And Relationship Coverage

The FigureSpec reference requires source-derived stable inventory mappings,
rejects missing/invisible/unresolved representations, makes labels a renderer
overlay, and requires every mapped source point to participate in a mapped
multi-point relationship wholly inside its group. The skill assigns source
interpretation to the author/reviewer, not to deterministic inference.

Current spec definitions and assertions establish the following layout:

| Anchor | Source role and current visible geometry | Mapped relationship evidence |
| --- | --- | --- |
| O | OA/OB common endpoint and arc center, not an added dot | OA/OD radii, connects, O-D-B collinearity |
| A | OA/AB/AD common endpoint and unit-arc start | Connects, unit circle, OA perpendicular AB |
| B | AB/OB common endpoint | Connects, O-D-B collinearity |
| D | AD and unit-arc endpoint on OB | Connects, unit circle, O-D-B collinearity |
| C | Source arc name only, anchored on the A-D minor arc; no dot, OC segment or new intersection | C/O unit-circle relationship |

References: current
[spec.json](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/10c-fig03/spec.json:93)
maps all five points and the visible primitives in the same group; assertions
start at line 277. The point coordinates are declared display regularization,
not printed numerical givens.

The identity guarantee is the combination of original-source comparison,
honest inventory descriptions, correct geometry references, satisfied
relationships, and labels visibly naming those same locations. It is not a
label-string test. A source with an actual dot cannot have that dot silently
removed under a label-anchor rule; an arbitrary labeled construction point
does not thereby become a source point.

Static inspection of
[validate_spec.py](/Users/yong/.codex/worktrees/a07e/lemmadeck/.agents/skills/ld-s10y-image/scripts/validate_spec.py:460)
shows that mapped hidden points are already included in `mapped_points`.
Lines 472-501 require at least two referenced points, references wholly inside
the group, and union coverage of every mapped point. C is covered by
`relation-c-on-circle`, whose references are C and O; B by its connects and
collinearity. No count assertion is needed or sufficient for this coverage.
This is code/spec reasoning, not a newly executed validation.

Important limit: `pointOnCircle`, lines 683-692, checks radius only. It does
not tie C to the visible arc object or enforce minor-arc membership. For the
current coordinates OA=(1,0), OC=(0.8,0.6), OD=(0.6,0.8), OC has unit length;
the positive cross products OA x OC=0.6 and OC x OD=0.28 place C strictly
between the rays of this first-quadrant minor arc. This is a direct check of
the supplied layout, not an executable arc-membership assertion. Changing C
to (0,1) would still satisfy its circle assertion and group coverage while
incorrectly placing the name beyond D. Do not report circle coverage as a
general arc-fidelity guarantee.

## Minimal Generic Recommendation

Subject to the parent's contract decision, distinguish a visible marker from
a visible label representation for explicitly declared point objects. Clarify
the inventory contract accordingly; do not special-case fig03, letters,
book/page IDs, or failed diagnostics.

The smallest inventory predicate change is:

```python
labelled_point_representation = (
    current
    and obj is not None
    and obj.get("type") == "point"
    and isinstance(obj.get("label"), str)
    and bool(obj["label"].strip())
)
missing_representation = (
    obj is None
    or (obj.get("visible") is False and not labelled_point_representation)
)
```

This is a patch recommendation only. Retain existing coordinate, label-
language, placement, assertion and ID checks. Preserve legacy behavior unless
the parent separately decides to revise it. Keep hidden non-point inventory
objects rejected, even if they carry a label. Keep missing/empty/whitespace/
non-string labels on hidden inventory points rejected. Unmapped hidden
construction points remain allowed; the rejection concerns claiming them as
visible source inventory.

Keep `mapped_points` and lines 465-501 unchanged: hidden labelled anchors must
not be filtered out of `pointRelationships`, replaced with text to evade it,
or covered using counts/unrelated/out-of-group assertions.

Two companion visibility consumers need explicit attention before calling
this a general fix:

- Bounds, lines 509-553, currently skip every `visible:false` object. Reuse
  the narrowly typed representation predicate there for labelled hidden
  points, so their anchors still undergo finite-canvas checks. Do not claim
  a one-condition inventory patch preserves hidden-anchor bounds. Offsetting
  a label to compensate for an incorrect coordinate is forbidden.
- Set-relation member discovery, lines 227-249, also skips hidden points.
  A generally admissible labelled hidden member must not evade mandatory
  `inside` coverage. If that scope is supported, retain membership checks
  for its visible label and account for its label footprint, not merely
  a hidden marker's size. This is not exercised by fig03; it is a static
  generalization risk, not permission for an unrelated refactor here.

No new dot, transparent marker, noise whitelist, changed inventory count,
deleted relation, or suppressed error is an acceptable repair. No renderer
change is needed to make the current point labels render. If the parent
retains a marker-only interpretation of inventory visibility, this spec must
remain blocked pending an approved label-anchor representation contract.
If automatic arc-membership proof is required, the current assertion set is
insufficient; that needs a separately approved general mechanism, not a
pretended `pointOnCircle` guarantee or a fig03 exception.

## Independently Expected Cases

These expectations come from the contract and renderer semantics; no tests
were read, authored as executable files, or run.

| Case | Expected result |
| --- | --- |
| Valid v2 hidden point, source-faithful nonblank label, group coverage and in-bounds anchor | Inventory representation accepted under the approved interpretation; still needs all later gates |
| Hidden point with omitted, empty, whitespace or non-string label | Inventory rejected |
| Hidden non-point object with a label, or unresolved inventory ID | Inventory rejected |
| Visible point with or without a label | Existing visibility behavior unchanged; source fidelity still reviewed |
| Unmapped hidden construction point | No new inventory rejection |
| Hidden labelled point omitted from mapped relationship coverage | Rejected exactly as a visible mapped point would be |
| Only object counts, unrelated relations, or relations escaping the group | Coverage rejected |
| False radius, collinearity or endpoint assertion | Mathematical validation still rejects |
| Hidden labelled anchor outside canvas, including offset compensation | Bounds reject after companion guard correction |
| Clipped, overlapping, unreadably small or visually invisible label | No visual approval; applicable render gates still reject |
| C on its circle but outside the source minor arc, e.g. (0,1) | Source/arc-fidelity rejection required; existing circle/coverage checks alone cannot detect it |
| Hidden labelled set member without its required containment evidence | Must not bypass `inside` checks under a general fix |

## Stop

Only this report was added. Tool, spec, source, indices and retained failure
files were not edited. No independent text/image/render PASS is claimed.
Await the parent's contract and implementation decision; no further action
is authorized by this diagnostic.
