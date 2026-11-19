# FIRST pre-draft source requirement inventory

Ticket STEMROBIN-181; batch D036; card phy10-c2-s4-n96; book 10p.
Role: FIRST bilingual modern TEXT author only. Written independently from the
complete approved source before either candidate is drafted. This document is
not independent source approval, substantive text review, or modern completion.

## Inputs and Scope

- Sole cwd: /Users/yong/.codex/worktrees/00b1/lemmadeck.
- Sole writable root: .intentfold/tickets/STEMROBIN-181/tmp/d1148-n96-first-bilingual-text-author/.
- Preparation: d1145-source257260-consume-n96-prepare/preparation.json;
  SHA-256 5dfa7d5d3139cf537e8525644595232f4d519552012fd670271893845e6c37fe.
- Frozen source-requirements.json:
  SHA-256 848de3823eabfba6153644f8590f9cb4d9fc2aa85c8074d53d2ccb6f81a4f06d.
- Raw lesson.json:
  SHA-256 ae6319c1d66c279080ea1eb2ae900b379021e0d4b0aba5845db70d0f823481fa.
- Raw exercises.json:
  SHA-256 a37bc651290ebac6be2ce3ed2747e7e44a2153cc3d318fc71014247dfa2c01de.
- Include p0256#5 through p0258#4. Exclude p0259#1, heading 97, and
  everything belonging to n97. Physical pages 256-258 are printed pages 246-248.
- Source has 17 requirement blocks, including its heading; assembled lesson
  has 13 ordered objects: 11 text objects (two footnotes), one figure, one caption.
  Preserve all original source_refs, source_text, source.data, object identities,
  printed title, pages, figure metadata, and original emphasis in source snapshots.
- Source has zero written questions. Both exercise templates remain empty and
  differ from the prepared originals only by locale. No added questions,
  forced choices, answers, solutions, or interaction specifications.
- Actual prepared templates are in d1145's
  work/adapt/10p/modern-us-neutral/lessons/phy10-c2-s4-n96/.
  root/10p/editions/... is a future finalization target, not an existing template
  source. No assemble, adapt-prepare, or full adapt-finalize replay.

## Complete Source Requirements

1. p0256#5, h3: 96. 时间间隔的相对性. Keep source printed title and
   continuous number 96. Translate only the English display title. Heading is
   not an assembled prose object.
2. p0256#6, p: non-absolute time intervals; two metronome ticks occur at the
   same spatial location in its inertial rest frame K1, separated by proper
   time tau0. K sees different event locations and measures coordinate time tau
   using synchronized local clocks, with light-travel delays accounted for,
   not the delay between seeing flashes. Constant nonzero relative speed makes
   tau greater than tau0. No preferred frame or defective moving clock.
   Exact tokens in order: $K$, $K_1$, $\tau_0$, $K_1$, $K$, $K$, $\tau$, $\tau_0$.
   Retain the once-per-second metronome example and original bold source claim.
3. p0256#7, p: preserve equation (8.1) exactly:
   $\tau=\frac{\tau_0}{\sqrt{1-\frac{v^2}{c^2}}}$.
   Define v as relative speed, c as vacuum light speed, and the denominator's
   reciprocal as the Lorentz factor gamma in ordinary prose. Lab time is gamma
   times proper time. Keep uniform inertial motion and speed below c explicit.
4. p0256#8, p open: two parallel plane mirrors fixed to the ends of a rod
   of length l form a light clock; each reflection at the lower mirror makes
   a tick. Figure 222 panel а becomes panel a in modern text. Join p0257#1,
   never the next paragraph. Exact token: $l$.
5. p0257#1, p cont: closes the light-clock description with
   $\tau_0=\frac{2l}{c}$. Explain that a full tick interval is a round trip,
   lower mirror to upper mirror and back, not one upward leg. The same lower
   mirror supplies both events at the same rest-frame location. Retain the
   source equation as the final token of this joined object.
6. p0257#2, p open: another inertial observer sees the clock move with vector
   velocity $\vec{v}$. Join p0257#5 across the transparent figure/caption blocks.
   Do not merge this object with the rest-frame description.
7. p0257#3, fig: fig-222, label 图 222, physical page 257, printed page 247,
   source box [807,154,490,335], no exercise owner. Owned by this lesson's
   light-clock demonstration, with source references from the two clock-view
   prose objects. Keep its ordered assembled figure object and exact ref.
   Modern figure is pending separate ld-s10y-image work; keep references only.
   No opening images, fake assets, SVG authorship, pixel/spec/render/review work.
8. p0257#4, cap samerow: 图 222. Keep exact source ownership, label and page.
   English display caption may be Figure 222; immutable source remains Chinese.
9. p0257#5, p cont: rod perpendicular to velocity; no contraction along its
   transverse mirror separation. In the lab, each straight light leg and the
   mirror's sideways displacement form a right triangle. Each leg uses half
   the full round-trip lab interval: vertical side l, sideways travel v*tau/2,
   hypotenuse c*tau/2. The two equal legs give total path
   $2\sqrt{l^2+\left(\frac{v\tau}{2}\right)^2}$.
   Joined-object exact token order: $\vec{v}$, $\vec{v}$, $\tau$, then the
   total-path expression. Panel б becomes b; retain Figure 222 identity.
10. p0257#6, p: light has the same vacuum speed c in both inertial frames.
    Divide the full two-leg path by c to obtain the full lab interval:
    $\tau=\frac{2\sqrt{l^2+\left(\frac{v\tau}{2}\right)^2}}{c}$.
    Explain that both factor two outside the root and half-time inside refer
    to the same full round trip. Do not mix a one-way time with a two-way path.
11. p0257#7, p: solve the preceding equation for $\tau$, using
    $\frac{2l}{c}=\tau_0$, to recover (8.1). Explain squaring, moving the
    velocity term to the left, and taking the positive time root without
    inserting or altering mathematical tokens.
12. p0257#8, p: define emphasized proper time by a single rest clock present
    at both events at the same spatial location in that inertial frame.
    For this fixed same event pair, that frame measures the shortest coordinate
    interval among inertial frames; proper time is invariant, but coordinate
    time is frame-dependent. Do not generalize this to competing accelerated
    clock paths. Keep 5 seconds, then 6 seconds and 10 seconds in that order,
    depending on different relative speeds, not one clock showing all readings.
    Keep emphasized time dilation and the reciprocal K/K1/K example with exact
    tokens $K$, $K_1$, $K$. Equivalence concerns exchanging event/frame roles,
    not changing the chosen event pair halfway through an argument.
13. p0257#9, p open: particle-decay experiments test time dilation. Join only
    p0258#1. Modern text must not call a pion unqualifiedly elementary.
14. p0258#1, p cont: charged $\pi$ meson/pion, footnote marker ①; average
    rest-frame lifetime $\tau_0=2.6\times10^{-8}$ seconds. This is a mean over
    many random decays, not the fixed lifetime of every individual particle.
    Retain dependence on lab speed $v$, near-light comparison $v$ and $c$,
    equation (8.1), and Lorentz factor
    $\frac{1}{\sqrt{1-\frac{v^2}{c^2}}}$.
    Preserve the source's 10 factor, $\tau_0c=7.8$ meters, and final 10 factor
    in that sequence. Mean lab lifetime is gamma*tau0 and mean flight distance
    at constant speed before decay is speed times mean lab lifetime, neglecting
    slowing/collisions. The 7.8-meter expression is c times proper lifetime,
    an approximate near-c scale, not the distance a stationary pion travels.
    With gamma ten, mean distance is about ten times that scale (about
    seventy-eight meters), not an exact c-speed assertion. Massive pions
    remain slower than c. Different individual pions decay at different times
    and distances. Replace the historical ignorance/superiority flourish with
    the predictive relation between two measured mean lifetimes; no slogan.
    Preserve all seven joined-object math tokens exactly and in order.
15. p0258#2, p: simultaneity and coordinate time depend on the reference frame.
    Everyday speeds are much less than c, so relativistic effects ② are small,
    not nonexistent. Everyday intuition is a useful low-speed approximation;
    precise clocks and experiments test high-speed predictions. Remove blanket
    claims that imagination cannot reach them and scientific-superiority rhetoric.
    Source object follows the owned first footnote in assembled order; keep that.
16. p0258#3, p footnote: marker ① belongs to the charged-pion paragraph.
    Preserve exact $\pi$ token and the source mass comparison (above electron,
    below proton). Transparently state the original's historical "elementary"
    classification, then correct the modern description: pion is composite,
    consisting of a quark and an antiquark. The original is retained unmodified
    in source_text/source.data; record the correction and its source ref in
    adaptation provenance. No mathematical erratum is invented.
17. p0258#4, p footnote: marker ② belongs to the low-speed paragraph.
    Preserve definition: effects following from relativity are relativistic
    effects. Keep this separate footnote and its ownership; no dropped marker.

## Draft and Evidence Rules

- All per-object source math tokens and their order stay exact. Use plain prose
  names for explanatory gamma, speeds, half-times, and derivation steps instead
  of inventing additional formulas. Preserve all numeric and figure references.
- Source snapshots, emphasis and source_refs stay immutable. Declare each changed
  object's existing changes categories and precise source-bound adaptation reason.
- Short complete sentences and deterministic native layout must keep science
  intact. No praise slogans, fictional narrator, or watered-down geometry.
- Derive actual adjacent before/after paragraphs using existing prose_flow.mjs:
  interval formula -> light clock; derivation -> proper-time meaning;
  frame reciprocity -> pion experiment; pion plus its footnote -> everyday limit.
  No hand-counted indices. Keep first footnote with pion discussion.
- Freeze inventory before drafting. Freeze the four FIRST templates and inventory
  before invoking the existing n94/n95 TEXT-only mechanical checker once, with
  only n96 ownership/source/boundary substitutions. Do not alter its assertions.
- Independent substantive text review stays pending. No source/text approvals,
  counters/consumption, Git, DB, publisher, paid calls, images, app operations,
  skill changes, dependency changes, or whole-project checks. Parent 24/24 stays
  unchanged. Zero sessions and zero servers.
