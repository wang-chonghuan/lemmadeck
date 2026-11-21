# Independent mathematical text review: SOURCE164/165, n45

Status: independent source-text baseline complete; FULL parent TEXT intake and
actual close remain pending. No parent draft was disclosed or read.
This is a mathematical review only, not SOURCE, physical-count, folio,
review-delivery, lesson-closure, or publication approval.

## Evidence and independence

Root: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck

- S164: .tmp/stemrobin-184-six/source164165-source/0164.body.md
- S165: .tmp/stemrobin-184-six/source164165-source/0165.body.md
- T163: .tmp/stemrobin-184-six/source164165-native-nov21/preparation.json,
  restricted to prior163Tail textual association and association metadata.
  The referenced page file was not opened. The accepted SOURCE163 lemma
  proof was neither re-solved nor re-reviewed.
- Generic guidance read: production-resume.md under
  .claude/skills/ld-s10y-lesson/references/. An attempted read of generic
  image-batches.md at that same directory returned file-not-found; no image
  workflow was needed or used.
- No image, encoded image, decoder, ROI, render, screenshot, native page output,
  earlier answer/choice/derived solution, parent draft, or other reviewer read.
  No Git, DB, paid/model call, environment/credential inspection, backend,
  setup, freshness, TOC, SOURCE166 read, agent inspection, or messaging.
  The existing stage runner is used as authorized, without modifying it.

The companion manifest binds the two literal source texts and restricted-use
preparation reference by byte length and SHA-256. Hashing the preparation bytes
does not extend the scope of its textual review.

## Product rule: complete local derivation

Fix a real point x in a common open interval on which real-valued u and v are
defined. Assume both ordinary two-sided derivatives u'(x), v'(x) exist as
finite real numbers. Take nonzero increments t tending to zero with x+t in
that interval. All unmarked u, v, u', v' below are evaluated at this fixed x;
u(x) and v(x) are constants with respect to t, not globally constant functions.

Define w(x)=u(x)v(x), du=u(x+t)-u(x), dv=v(x+t)-v(x). Then

    w(x+t)-w(x)
      = (u+du)(v+dv)-uv
      = v du + u dv + du dv,

    [w(x+t)-w(x)]/t
      = v(du/t) + u(dv/t) + du(dv/t).

Differentiability gives lim(du/t)=u'(x), lim(dv/t)=v'(x).
Invoke the already accepted differentiability-implies-continuity lemma,
without repeating its proof: lim du=0 and lim dv=0.
Consequently every limit used in the displayed source proof exists:

    lim v(du/t) = v(x)u'(x),
    lim u(dv/t) = u(x)v'(x),
    lim du(dv/t) = (lim du)(lim dv/t) = 0*v'(x) = 0.

The finite derivative limit also makes dv/t bounded near zero. Thus the cross
term tends to zero even when v'(x)=0: a bounded factor multiplied by du->0
tends to zero. No division by u, v, u', or v' is required. This avoids the
incorrect inference that du dv/t vanishes merely because du and dv vanish;
the finite limit of dv/t is the needed additional fact.

The finite-limit sum law now gives

    w'(x) = v(x)u'(x)+u(x)v'(x)+0
          = u'(x)v(x)+u(x)v'(x).

S164's difference-quotient expansion and S165's successive sum/product limits
are valid under these local hypotheses. S165's reordered final expression
uv'+u'v is the same two-term formula. Applying this pointwise wherever both
derivatives exist gives the stated product rule.

## Examples and constant factor

Example 1 (S165): F(x)=(x+3)(x+15), domain R.
Both factors have derivative 1, so

    F'(x)=1*(x+15)+(x+3)*1=2x+18.

An independent increment calculation confirms the result:
F(x)=x^2+18x+45, so F(x+t)-F(x)=(2x+18)t+t^2.
For t!=0 its quotient is 2x+18+t, tending to 2x+18 for every real x.

Constant-factor corollary (S165): let k be any fixed finite real constant and
let f be differentiable at the point under consideration in its domain.
The constant function has derivative lim(k-k)/t=0. The product rule gives

    (kf)'=0*f+k*f'=k*f'.

Equivalently, the increment quotient for kf is k times that for f. This
argument includes k=0 without dividing by k: the product is identically zero
on f's domain and its derivative is zero. Under the corollary's hypothesis,
0*f'=0 is defined. If f' does not exist, the written right-hand side is not
defined; this does not prevent the zero function itself being differentiable
on an open domain. No stronger hypothesis-free identity is claimed.

Example 2 (S165): G(x)=x/15-3, domain R.
The constant-factor and difference rules give G'=1/15-0=1/15.
Directly, G(x+t)-G(x)=t/15, so its nonzero-increment quotient is exactly 1/15.
The derivative exists for every real x.

## Visible exercise 367 only

367a: y(x)=x/5 has domain R. For t!=0,

    [y(x+t)-y(x)]/t=(t/5)/t=1/5.

Thus y'(x)=1/5 for all x in R; derivative domain R.

367b: h(x)=-3x/4 has domain R. Using t as the increment to avoid confusing
the function name h with an increment,

    [h(x+t)-h(x)]/t=(-3t/4)/t=-3/4.

Thus h'(x)=-3/4 for all x in R; derivative domain R. The negative sign is
retained. Neither expression has a variable denominator or a domain exclusion.

## Important note and logic

At a point, write D for existence of a finite ordinary derivative and C for
continuity. The accepted lemma is D=>C. Its valid logical contrapositive is
not C=>not D: a discontinuous function cannot have that derivative there.
Continuity alone is insufficient: C=>D is false. The converse of the
contrapositive, not D=>not C, is also false.

For f(x)=|x|, domain R, f(0)=0 and |f(x)-f(0)|=|x|. Given epsilon>0,
delta=epsilon proves continuity at zero. For nonzero t,

    [f(0+t)-f(0)]/t=|t|/t
      = 1 for t>0,
      = -1 for t<0.

The one-sided quotient limits differ, so no ordinary derivative exists at
zero. This is exactly C and not D, disproving both false implications above.
S164's note has the correct direction of implication and a valid counterexample.

## Text association and unresolved boundary

Use T163 only as the supplied tail association: it reports no prior open
object and associates S164's opening conclusion with the already reviewed
continuity lemma. S164's first block is ordinary p, appropriately closing
that thought without an invented continuation marker. This is a textual
association judgment, not a re-review of SOURCE163 mathematics.

S164 marks the product-rule proof p open and ends after the difference-quotient
expansion. S165 starts p cont, immediately discussing its fixed-x factors and
limits. It correctly continues that same proof to the two-term derivative.
Completion of this particular proof does not establish closure of n45.

SOURCE166 is unseen. Owners beyond the visible 367 are UNKNOWN; owners must
keep that status until authorized original text establishes any further scope.
The original 13 HOLDs remain unchanged, as instructed, not independently
inspected or cleared. No additional exercise, future answer draft, or parent
derived solution is reviewed. FULL parent TEXT intake and actual close remain
open; this frozen baseline is not parent-output approval.

Mathematical errors found in the permitted visible text: 0.
Acceptance blockers retained: unseen continuation and parent-text intake/close.
