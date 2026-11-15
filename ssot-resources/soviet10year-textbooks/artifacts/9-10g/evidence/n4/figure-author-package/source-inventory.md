# Figure11 Source Inventory

Date: 2026-11-15. Author: Codex, delegated figure author under STEMROBIN-184; not an independent approver of the forthcoming modern figure.

Frozen from one complete actual durable original PNG, opened before any FigureSpec, context build or rendering. No parent source/review report or answer material used.

Source: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-11.png`.
Raw SHA-256: `78d51e15df951d37f27e06a81d182a96e4762d7c7491e0917c5000e847843fb1`.

## Complete Pixel Inventory

One row of two separate side-by-side plane panels, each with its own alpha label and M point. They are alternative configurations, not a shared spatial coordinate frame or two planes with an asserted mutual relationship.

### Left Source Panel а)

- Complete closed four-sided, parallelogram-like plane drawing window. Top and bottom edges rise toward the right in screen coordinates; side edges are approximately vertical. No boundary corner has a point marker or name.
- Greek alpha inside the lower-left corner area.
- Two separate, solid, approximately vertical straight strokes inside the window. Left stroke is a; right stroke is b. Both have finite drawing extents with no arrows, endpoint dots or endpoint names.
- Lowercase a is immediately right of the left stroke, in its upper-middle portion. Lowercase b is immediately right of the right stroke, near its upper portion.
- One filled M dot lies directly on b, in the lower half. Uppercase M is right of that dot, with clear separation from a.
- Source depiction is two distinct parallel lines: M belongs to b and does not belong to a. The raster draws no printed parallel sign or equation; exact parallelism/nonmembership must be bound to approved modern prose, not measured from rough ink angles.
- Source panel marker а) below the plane window, approximately centred. It is a subfigure marker, not the mathematical a label.

### Right Source Panel б)

- Complete closed four-sided, parallelogram-like plane drawing window, separate from the left panel. Top/bottom edges similarly rise toward the right; no corner dots or names.
- Greek alpha inside the lower-left corner area.
- Exactly one solid, approximately vertical stroke inside the window, with finite unmarked drawing extents. Its only lowercase line label is a, immediately right of the upper portion.
- One filled M dot lies directly on this stroke in its lower half; uppercase M is to its right.
- M belongs to a. This is the coincident case b=a specified for the intended configuration, represented by a single visible line and **only** the a label. There is no second b stroke or b label in the source; do not create either or overpaint a duplicate line.
- Source panel marker б) below the plane window, approximately centred.

Across the complete PNG: two plane outlines, two alpha labels, two M dots, two M labels, three visible line strokes, three line labels (left a/b, right a), and two subfigure markers. All strokes are solid. There are no dashed parts, hatching, grids, axes, lengths, angles, tick marks, numerical givens, extra named points, figure-number caption or surrounding prose. Minor rough ink irregularities are not new mathematical objects.

## Planned Source-to-Object Mapping

No FigureSpec has been written. Stable IDs below are proposed mappings, not a pre-approved spec or output.

| Source group | Visible-object IDs | Required relationship checks |
|---|---|---|
| Left а) | `left-alpha-outline`, `left-alpha-label`, `left-line-a`, `left-line-b`, `left-M`, `left-M-label`, `left-panel-label` | Both finite depicted strokes inside the plane window; a parallel b and distinct; M on b, M not on a; M/its label/alpha label inside with clearance; each visible stroke connected to its unmarked drawing extents. |
| Right б) | `right-alpha-outline`, `right-alpha-label`, `right-line-a`, `right-M`, `right-M-label`, `right-panel-label` | M on a; M/its label/alpha label inside with clearance; one visible stroke connected to its unmarked extents; b=a as a semantic/model alias, not another visible source object or label. |

Use native `parallel`, `pointOnLine`, `inside` and `connects` assertions where supported. Distinct/nonincident lines and the right coincident alias need an honest executable supplemental check if unsupported by native assertions; `objectCount` alone must not certify these relationships. Each panel has only one source-named point M: do not invent additional visible points merely to satisfy a multi-point inventory requirement. Unmarked extent anchors may be coordinate literals or hidden construction data, never source-named points.

The plane windows are schematic representations of infinite planes. Any chosen modern projection/regularization or hidden extent coordinates must be declared as author layout, not measured 3D incidence, angle, distance, boundary or a relation between the two panels. Keep each source group complete. Modern subfigure markers will be English a)/b); mathematical alpha, a, b and M remain as shown. Preserve the right panel's single a label.

## Pending Authority And Stop

Current n4 modern text has not yet been approved/notified in this task. No modern template, `build_context`, FigureSpec, SVG, render, browser or display check has been opened/run. The requested exact left parallel/distinct and right coincident cases are recorded above, but authoritativeText must come from the subsequently approved actual modern n4 lesson, not this inventory, parent review notes or answer material.

Stop after this inventory. Await explicit approved-text notice before context binding, draft and the authorized render. No other figures reopened or changed; no source edit, services/network, dependencies, DB, promotion, commit, user profile/CDP/windows/OS input or cross-chat messaging.
