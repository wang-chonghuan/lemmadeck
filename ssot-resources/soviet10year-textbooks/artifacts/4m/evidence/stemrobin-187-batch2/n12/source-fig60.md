# fig-60 source inventory and independent 181 solution

Frozen before accessing any fig-60 author inventory, candidate spec, render
report, candidate image, or parent `n12-answers-c.json`.
The original fig-60 PNG was inspected exactly once, with no crop/reopen.
This is new image view 2 of 3, cumulative view 10.

## Authoritative inputs

- Original:
  `ssot-resources/soviet10year-textbooks/artifacts/4m/figures/fig-60.png`
  SHA-256 `02c303247b05022afa248503851dd03cff25a1fd68760fdf7ac695ac18785c27`.
- Authoritative n12 `exercises.template.json` SHA-256:
  `ca87b1e124d56f2a42f3d8610411dc28fe0ea5ebfa9b06ad5a20ef92d74430b3`.
- Exercise 181 asks: in fig-60, which segments contain C, and which segments
  do not contain B?

Paths are relative to `/Users/yong/.codex/worktrees/stemrobin-187-six/lemmadeck`.

## Complete independently observed source inventory

One straight horizontal, finite closed segment runs from A on the left to D
on the right. Four uniformly filled point markers lie on it, in strict order
A, B, C, D. A and D are the endpoints; B and C are interior points.
All four visible Latin labels A/B/C/D are above their respective markers.

No arrows, infinite extension, separate ray, dashed edge, other point, grid,
tick, unit, distance value, equality mark, solved membership label, or extra
numeric annotation is present. Source spacings appear unequal, but no exact
length or ratio is given; do not invent a measured distance or equal-spacing
premise. Any renderer coordinates are construction choices, not source data.

Required relationships: all four points collinear; A<B<C<D along the segment;
the drawn line terminates at A and D; both interior markers belong to AD;
C is also interior to BD. Endpoint membership is inclusive. Every mapped
source point must have executable within-group incidence/order coverage.

## Independent full solution, including endpoints

The six distinct segments named by pairs of the four points are AB, AC, AD,
BC, BD, CD. Reversing endpoints names the same segment.

| Segment | C belongs? | B belongs? | Reason |
| --- | --- | --- | --- |
| AB | No | Yes | C lies beyond B; B is an endpoint. |
| AC | Yes | Yes | C is an endpoint; B is interior. |
| AD | Yes | Yes | Both B and C are interior. |
| BC | Yes | Yes | B and C are endpoints. |
| BD | Yes | Yes | B is an endpoint; C is interior. |
| CD | Yes | No | C is an endpoint; B lies to the left outside CD. |

Thus C belongs to AC, AD, BC, BD, CD and does not belong to AB.
B does not belong only to CD; B belongs to AB, AC, AD, BC, BD.
This answers both full requested membership tasks, not merely the shortest
adjacent segments. No arbitrary distance is needed.

A complete displayed explanation with `grading: ungraded` is appropriate
for this visual segment-identification task. No author key was consulted.

Do not revise this freeze after author evidence access. Other 18 text answers,
171, and the three earlier PASS figures are reused without re-review. No full
Gate2, MathLive, rendering, or DOM/product-width check belongs to this task.
