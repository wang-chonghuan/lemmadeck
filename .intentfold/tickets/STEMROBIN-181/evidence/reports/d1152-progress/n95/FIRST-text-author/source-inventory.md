# FIRST pre-draft source requirement inventory

Ticket STEMROBIN-181; batch D036; card phy10-c2-s4-n95; book 10p.
Role: independent FIRST bilingual modern TEXT author only.
Written before either locale candidate. This inventory is an author requirement
inventory, not source approval, independent semantic review, or modern completion.

## Frozen inputs and boundary

- Preparation: d1133-source256-consume-n95-prepare/preparation.json;
  SHA-256 75acd5b6b975ae5c4dae4949d48081fb58aed37db7fd0eabd04167be2a37025f.
- Full source blocks: that preparation's source-requirements.json;
  SHA-256 07ec95b7b61cc79a4a2e53cf0cf3e45dea0996f90c1adcc6f6489d6ef4231c6a.
- Raw lesson: its root/10p/lessons/phy10-c2-s4-n95/lesson.json;
  SHA-256 fa73655bc6c19507cd8454a9a129e56525dfe79825e66b07147bfaa84e33cc8f.
- Raw exercises: the adjacent exercises.json;
  SHA-256 dd70d9d8ee161b9ec053d265a598be6b3f40550cd06ca076cfd04de59d24532a.
- Include p0253#10 through p0256#4; exclude the n96 heading p0256#5
  and everything after it. Source heading is **95. 同时的相对性**.
- The prepared raw lesson has 16 ordered prose objects: 12 text objects,
  two figure objects, and two caption objects. Three open/cont pairs join
  across pages. Keep every source_ref, source_text, identity and source snapshot.
- Source has zero written questions. Both exercise candidates remain empty;
  no read-check, written exercise, choice, solution or answer is authorized.
- Templates actually emitted by the saved adapt-prepare receipt are in
  work/adapt/10p/modern-us-neutral/lessons/phy10-c2-s4-n95/.
  The root/10p/editions/... location is the not-yet-created finalization target.
  Reuse the prepared templates without replaying assemble/adapt-prepare.

## Complete block inventory

1. p0253#10, h3: source heading and continuous unit number 95. Retain the
   printed title literally in the source/identity fields; English display title
   may be translated. This heading is not a prose object.
2. p0253#11, p open: begins the bold assertion about instantaneous signals and
   interactions. Join only with p0254#1. Preserve its original emphasis in the
   immutable source text, including the adjacent bold delimiters of assembly.
3. p0254#1, p cont: closes that assertion; a limiting transmission speed makes
   classical space/time assumptions insufficient, especially absolute time
   independent of matter and motion. Keep these concepts. Modern prose must not
   claim classical mechanics universally assumes physically instantaneous
   signaling, nor dismiss its usefulness as a low-speed approximation. Relativity
   needs both finite propagation and the common vacuum light speed in inertial
   frames, not finite propagation alone.
4. p0254#2, p: a counterfactual instantaneous-signal synchronization procedure
   at separated points A and B. Retain the 0 hours 45 minutes example, adjusting
   a lagging clock and the meaning of synchronization. Mark the whole procedure
   as hypothetical; it is not a method available with real light signals.
   Exact math tokens, in order: $A$, $B$, $A$, $B$, $A$, $B$.
5. p0254#3, p: two lightning strikes are simultaneous when synchronized local
   clocks record equal event times. State the common inertial frame explicitly.
   Seeing the two flashes together is not the definition.
6. p0254#4, p: local synchronized clocks at A and B provide the comparison;
   asks how to synchronize separated clocks when signal speed is finite.
   Do not turn the source's "only" into a denial of equivalent timing methods.
   Exact math tokens: $A$, $B$.
7. p0254#5, p: choose light/electromagnetic signals because their speed in vacuum
   is constant. Explicitly retain equal vacuum light speed c in each inertial
   frame; do not imply every material or accelerated frame shares this statement.
8. p0254#6, p: radio time signals link a household clock to a standard clock;
   known distance and propagation speed allow a delay correction. Local delays
   are often negligible for ordinary clock-setting, but matter for precision
   and long astronomical distances. Do not assert every delay is always tiny.
9. p0254#7, p open: introduces a symmetric clock-setting method needing no
   propagation-time calculation. Join only with p0255#1.
10. p0255#1, p cont: spacecraft-end clocks A and B, Figure 220; a light source
    at rest at the craft midpoint flashes once. In the inertial craft rest
    frame the distances are equal, so arrival events are simultaneous; equal
    readings at arrival test synchronization. Preserve the spacecraft, midpoint,
    stationary apparatus and actual physical conditions without an unnecessary
    fictional astronaut narrator. Exact math tokens: $A$, $B$.
11. p0255#2, fig: fig-220, label 图 220, physical page 255, printed page 245.
    Owned by this lesson's spacecraft synchronization explanation, not an
    exercise. Keep its figure object and exact source_ref. Modern pixels/specs
    are pending a separate ld-s10y-image author; no image input in this task.
12. p0255#3, cap samerow: 图 220. Preserve caption source ownership, label and
    page; translate only displayed English caption to Figure 220.
13. p0255#4, fig: fig-221, label 图 221, physical page 255, printed page 245.
    Owned by this lesson's moving-frame comparison, not the next heading or
    an exercise. Keep its original ordered placement even though explanatory
    p0255#6 follows it; no guessed reassignment or pending-image placeholder.
14. p0255#5, cap: 图 221. Preserve source_ref, label, page and placement;
    translate only displayed English caption to Figure 221.
15. p0255#6, p: compare craft rest frame K1 with relatively moving frame K.
    In the shown forward motion the front clock A recedes from the flash's
    emission location; the rear clock B approaches it. In K, light travels farther
    than half the craft's K-measured length to the front and less to the rear,
    so the rear receives it first. Light itself has speed c in both frames.
    Distinguish the fixed emission location from a moving source after emission.
    "The clocks run differently" must mean a synchronization offset when judged
    by K, not unequal intrinsic ticking rates or broken clocks. Preserve Figure
    221's panels: Cyrillic а, б become Latin a, b by the neutral adaptation rule.
    Exact math tokens: $K_1$, $K$, $A$, $B$, $K$, $A$, $B$.
16. p0255#7, p open: events at separated A and B simultaneous in K1 need not
    be simultaneous in K; K1 and K are equivalent, neither privileged; emphasized
    conclusion that separated-event simultaneity is relative. Join p0256#1.
    Qualify the broad "any two events": this demonstration separates the events
    along the relative-motion direction, not every possible spatial orientation.
    Exact math tokens: $A$, $B$, $K_1$, $K$, $K_1$, $K$.
17. p0256#1, p cont: completes the stated finite-signal-speed explanation.
    Preserve finite propagation while identifying invariant c and inertial-frame
    relativity as essential assumptions; finite sound speed alone is insufficient.
18. p0256#2, p: resolve section 94's spherical-wavefront puzzle. Events on the
    O-centered sphere simultaneous in K are not all simultaneous in K1.
    Specify "not all": points with equal position along the relative-motion
    direction need not differ in transformed time. Each frame's wavefront is
    constructed at its own common time, not from a universal simultaneity slice.
    Keep section 94 and exact math tokens: $K$, $O$, $K_1$.
19. p0256#3, p: reciprocal O1-centered sphere case. Events simultaneous in K1
    are not all simultaneous in K. Correct the assembled source's concluding
    "just as K1 sees" ambiguity with explicit opposite-frame comparison; neither
    frame becomes preferred. Exact math tokens: $K$, $O_1$, $K_1$.
20. p0256#4, p: conclude that the apparent contradiction is resolved. Do not
    restate "nothing counterintuitive exists in reality" as a universal claim;
    modern conclusion concerns this consistent relativistic description only.

## Authoring and evidence contract

- Preserve all source math tokens in their original per-object order. No
  mathematical erratum is registered here; do not invent one. Added c is prose
  notation, not a new formula. Keep all numerical and figure/section references.
- Original source emphasis stays byte-faithful in source.data and source_text.
  Modern emphasis highlights the actual conceptual claims, with natural short
  explanatory sentences, not inherited broken print layout.
- Each rewrite declares the existing changes categories; report adaptationChanges
  separately with exact source refs and source/modern text provenance. Preserve
  raw evidence rather than changing approved transcription.
- Obtain true before/after section anchors from prose_flow.mjs final paragraphs:
  counterfactual time -> finite signals; radio delay -> symmetric spacecraft
  method; rest-frame method -> moving-frame comparison; relative simultaneity
  -> reciprocal wavefront explanation. Do not guess paragraph indices.
- Freeze this pre-draft inventory and four FIRST candidates. Run the existing
  n94 TEXT-only checker once with n95 path/boundary substitutions, reusing native
  edition APIs, proseFlow and KaTeX. No full adapt-finalize or figure checks.
- Independent substantive text review remains pending. Modern completion,
  consumption, parent counts (24/24), source approval, Git, DB, publisher, paid
  calls, images, app, skills changes and whole-project checks are outside scope.
