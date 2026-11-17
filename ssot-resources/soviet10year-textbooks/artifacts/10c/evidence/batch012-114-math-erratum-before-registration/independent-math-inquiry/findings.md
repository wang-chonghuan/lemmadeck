# Unit114: independent mathematical erratum investigation

Conclusion: definite mathematical typo in the retained literal, under the
printed arbitrary-base and inverse-function requirements. This is not a
transcription correction or a pixel re-review.

## Source Binding

- Lesson: `x1-114-自然对数作为具有可变积分上限的积分`.
- Target: `p0171#5`, printed page 165, source page 0171.
- Exact original: `$\exp_a(x)=\exp_a(x\cdot\ln a)$`.
- Both subscripts remain `a` in the assembly JSON and Markdown.
- Frozen BEFORE SHA-256: `cc5c595c812f745511f9c239fa22155bf5957a6a7a4cdd190e3600e13d178686` (hash independently matched).
- StageA/B literal confirmation is supplied by the human; the sealed StageB
  report was not reopened. No image, crop, or canonical page body was opened.
- Assembly inputs are captured at this investigation's read time, not claimed
  to be the parent's later/final assembly identity.

## Independent Argument

Unit114 defines ln by the integral from 1 to x of 1/t, establishes strict
increase and range R, defines e by ln(e)=1, and defines exp as ln's inverse.
The initial paragraph intends the ordinary continuous base-a exponential.
The final paragraph additionally requires exp_a to have an inverse.

Put f=exp_a and c=ln(a). The literal states f(x)=f(cx) on R.
An inverse requires injectivity. Substituting x=1 forces 1=c, hence a=e.
Consequently no injective function can satisfy the literal for ANY allowed
base a other than e, irrespective of how ordinary exponentiation is defined.
For a=e, f(x)=f(x) is a tautology: consistent with the intended exponential
but unable to define it uniquely. At x=0 the equality also holds trivially,
which does not rescue an asserted identity for all real x.

The equation by itself can have non-injective solutions (a constant function,
for example), so it is not an absolute logical contradiction without the
context. Such solutions are not the intended exponential and cannot provide
the required inverse. Treating the RHS as the preceding unsubscripted exp
would fix the issue, but would change the retained literal rather than
interpret both identical subscripts faithfully.

## Exact Counterexample

Choose a=e^2 and x=1. By the unit's logarithm addition/power property,
ln(a)=2. For the intended f(t)=a^t:

- LHS = f(1) = e^2.
- RHS = f(1*ln(a)) = f(2) = (e^2)^2 = e^4.
- e>1 follows from ln's strict increase, ln(1)=0 and ln(e)=1;
  therefore e^4>e^2. No numerical approximation or model result is needed.

This counterexample uses integer exponent arithmetic already in the opening
definition, not a corrected formula silently assumed as source.

## Separate Corrected Candidate

Candidate ONLY: `$\exp_a(x)=\exp(x\cdot\ln a)$`.

Remove only the RHS subscript a. The RHS then uses the immediately preceding
exp=ln^{-1}. Let g(x)=exp(x ln(a)). Then ln(g(x))=x ln(a).
The rational-power property gives ln(a^r)=r ln(a), hence g(r)=a^r
for rational r by injectivity of ln. Continuity extends the intended ordinary
base-a exponential to all reals. Since ln(a)!=0 for allowed a, multiplication
by ln(a) is bijective; composed with exp it is a bijection R -> (0,infinity).
It increases for a>1 and decreases for 0<a<1, with inverse ln(y)/ln(a).
In particular g(1)=a and g(0)=1. This justifies the proposed correction.

## Draft and Contract

`erratum.draft.json` contains only the contract's id, block, faithful
original and independently checked reason. `candidate-correction.json`
keeps the proposed corrected formula outside that draft and outside source.

The skill requires faithful original text to remain unchanged and confirmed
mathematical errors to be registered against an existing page block. Modern
corrections require registered errata plus matched page hash, block, original,
corrected text and authoritative source/assembly binding. None of those
registration, prepare, finalize, publication or promotion actions was run.
The BEFORE Markdown hash is source-identity evidence, not a fabricated
finalized page-JSON hash or a substitute for the parent's assembly identity.

## Limits and Stop

Only NEW `.intentfold/tickets/STEMROBIN-184/tmp/production-114-expa-erratum` is owned/written.
No source/page changes, corrected source adoption, old-unit re-review, pixel
inspection, model calls/images, counts, finalizers, assembly, rendering, Git,
backend, refresh, setup, app, schema, dependency operations or tests.
No claim about the printer's mental intent or an alternate source edition;
the mathematical defect is definite under the supplied literal and context.
Early bootstrap commands returned combined tool streams, preserved in this
chat at the chunk IDs recorded in bootstrap-transcript.md; their stdout and
stderr cannot retrospectively be separated. Investigation command streams
are captured separately and in full in the commands directory. This is an
explicit trace limit, not a claim of missing streams being empty.
The parent retains all source finalization, assembly identity and promotion
decisions. This draft is not promotion and grants no new humanpixel authority.
Stop after the scratch evidence seal.
