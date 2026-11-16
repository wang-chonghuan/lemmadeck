# s4 choice author key and comparison notes

Internal author material. A separate reviewer must freeze source reasoning and
pure-view judgments before opening this file or `draft.json`.
This is not an independent semantic PASS.

## Source-first order

`source-solution.md` and `source-freeze.json` were written while draft/view did
not exist. They cover all seven sources and the complete actual 180/181 SVGs.
No original source answer, modern answer key, main-private solution, old choice,
interaction or other author's answer was consulted. This author key is derived
only after that source freeze.

## Units and intended complete sets

Seven sources become five native questions, 22 alternatives: two single and
three multiple. No new figures are created.

| Question | Sources | Mode | Options | Intended true set |
| --- | --- | --- | --- | --- |
| lever-definition | 1 | single | a–d | b |
| arm-and-construction | 2, 3 | multiple | a–e | a, b, e |
| rotation-and-balance | 4, 5 | multiple | a–e | b, c |
| book-history | 6 | single | a–c | c |
| ruler-experiment | q1 | multiple | a–e | a, c |

## Every alternative

### lever-definition

- a false: replaces “can rotate” by “currently rotates”; a stationary balanced
  lever still meets the fixed-pivot solid definition.
- b true: concept0 specifies a solid and ability to rotate about a fixed pivot,
  without an extra shape restriction.
- c false: extracts the midpoint setup of q1 and treats it as a universal
  definition; “fixed” is not “central”.
- d false: broadens the definition to any force-driven translation, discarding
  the fixed-pivot rotation constraint.

### arm-and-construction

- a true: concept9 is the shortest point-to-force-line distance.
- b true: extend the force line if needed and drop the perpendicular from O;
  this supplies the operational construction from concept10.
- c false: extrapolates the special perpendicular geometry of fig181. At
  nonzero OA, a force along OA has zero perpendicular arm, not OA.
- d false: substitutes the whole physical rod for each geometrical arm. A
  nonzero-length rod can experience a force through O with zero arm.
- e true: O on the force line gives point-to-line distance zero.

The definition, construction, wrong geometric object and zero-arm boundary are
one coherent task, not independent clicks for each word of the definition.

### rotation-and-balance

- a false: reversal at the same A preserves nonnegative arm length but changes
  the signed turning effect; downward clockwise becomes upward counterclockwise.
  The error computes only magnitude Fl and loses the sign.
- b true: actual right A/F₁ down is clockwise; left B/F₂ down is counterclockwise.
  Both arrows are downward but are on opposite sides of O.
- c true: opposing tendencies and F₁l₁ = F₂l₂ cancel; the explicitly stationary,
  friction/self-turning-effect-free two-load model remains at rest.
- d false: actual l₁ > l₂; equal nonzero forces leave F₁l₁ > F₂l₂. It wrongly
  uses force equality instead of comparing turning effects.
- e false: copying matching subscripts into a direct arm ratio gives
  F₁/F₂ = l₁/l₂, not the source's inverse ratio l₂/l₁. On this actual unequal-arm
  diagram it puts the larger force on the longer arm.

The stem states model scope, not the correct equilibrium law. No new N values
or measured lengths are inferred from the marks or hanging weight count.

### book-history

- a false: conflates a later experimental verification with the first discovery
  and substitutes the verifier for the explicitly named historical person.
- b false: infers anonymity from universality of a law and ignores the named
  attribution in concept18.
- c true: the selected modern sentence attributes discovery to Archimedes
  expressly as the textbook's historical introduction.

No other historical name/date is added. This intentionally preserves the
informational history task; it is not an external claim of independent historical
verification. It does not use the main's standard answers as evidence.

### ruler-experiment

- a true: 5l₅ = l₁ implies 1:5; 2l₂ = 3l₃ implies 3:2. Same local g cancels
  for each mass pair; this gives two model predictions, not observed lengths.
- b false: first-round arms a and 5a become moments proportional to 3a and 10a
  on replacing 5→3 and 1→2 at unchanged positions. Mere past balance cannot
  preserve balance after a changed mass ratio.
- c true: P_b l_b = P_k l_k and P_k = g(m_k/1000) N; therefore
  P_b = g(m_k/1000)(l_k/l_b) N and m_b = m_k(l_k/l_b) g.
  No unprovided numerical g or matchbox measurement is guessed.
- d false: inserts a gram number directly as a Newton weight, skipping both
  gram→kilogram and multiplication by local g. The missing factor is g/1000.
- e false: observing horizontal equilibrium is not measuring the arms or
  comparing products; it omits the expressly requested quantitative test.

The conditions in the stem are an explicit ideal analysis model, not claims
about already observed equipment performance. Both mass pairs, their footnote
values, the empty-ruler midpoint procedure, resetting balance, quantitative
measurement and matchbox method remain accounted for.

## Whole-package independence and capacity loss

No visible stem states another question's definition, discovery name, true set
or equilibrium formula. Shared underlying knowledge between the balance question
and its experimental application is intentional; each has all its own context
and does not refer to another question's answer. The history question does not
provide a mechanical hint. Exact pureview projection contains only id/view.

Definition and construction are merged because they refer to one perpendicular
distance; force effects and equilibrium are merged because they concern the same
signed turning mechanism. The history request remains separate. The full
experiment is one connected protocol rather than isolated mass/measurement slots.

Coverage does NOT mean full productive performance. Source1/2 lose independent
definition writing; source3 loses drawing and measuring the perpendicular;
source4/5 lose independent explanations/derivation; source6 loses unprompted
name recall. q1 loses actual midpoint setup, both physical rebalancing trials,
arm measurement/data/error recording, empirical quantitative verification and
weighing the real matchbox. No choice result can be called completed practical
work. The original q1 written experiment must remain available read-only.

The draft keeps these exact losses in every affected `intent.limitations` and
in all seven `coverage` entries. Independent review must decide whether this
reasoning adaptation is faithful enough; this author does not approve itself.

## Execution boundary

Official whitelist inspect and prepare each ran once. Actual source SVG
observation used a fresh headless context with external requests blocked and
closed it. One structural validation without review will follow this draft.
No new figure, model/service request, DB, app, publisher, retention or Git action.
Command records and full-byte/canonical bindings are frozen by the handoff.
