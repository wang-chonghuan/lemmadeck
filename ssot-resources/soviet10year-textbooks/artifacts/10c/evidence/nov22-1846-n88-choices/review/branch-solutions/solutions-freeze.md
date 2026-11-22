# First Independent Affected-Ten Derivation Freeze

Scope: 222-230 and 232 only. Frozen before any new affected candidate view, option, author solution, or key is received. This supplement resolves only the newly supplied normalization; the original all34 reasoning remains unchanged.

## Explicit Premise And Notation

Let A(t)=arctg(t)=arctan(t), where A is the inverse of tg restricted to (-pi/2,pi/2). This exact source-bound premise is already authorized and must be learner-visible in affected future questions. D(A)=R and E(A)=(-pi/2,pi/2).

Let C(t)=arcctg(t)=arccot(t), reusing the original N88 inverse-cotangent branch: C is inverse cot restricted to (0,pi). D(C)=R and E(C)=(0,pi).

This ASCII naming maps the accepted mathematical functions; it does not assert original source codepoints. Angles and pi-valued answers are in radians. sqrt(3) is the positive square root.

For finite real t, neither inverse returns an excluded endpoint. A(t) is never +/-pi/2; C(t) is never 0 or pi. In particular A(0)=0 and C(0)=pi/2. A real input 0 is not an instruction to evaluate cot(0).

On these restricted branches, A is strictly increasing and C is strictly decreasing. Thus inverse uniqueness and monotonic comparisons below apply on their specified branches, not on a periodic trigonometric function's disconnected full domain.

## Exercise 222

Frozen requirement: replace the comparison star between arccot 1 and arctan 1.

cot(pi/4)=1 with pi/4 in (0,pi), so C(1)=pi/4. tan(pi/4)=1 with pi/4 in (-pi/2,pi/2), so A(1)=pi/4.

Exact relationship: C(1)=A(1). Replacement token: "=".

Domain and endpoints: the fixed input 1 is real; both inverses exist. Neither returned angle is an excluded endpoint.

Capacity: the source comparison requires the correct relation. Selecting or entering "=" records that relation, not independent evidence of the supporting reasoning.

## Exercise 223

Frozen requirement: compare arccot sqrt(3) and arctan sqrt(3).

cot(pi/6)=sqrt(3), so C(sqrt(3))=pi/6 on (0,pi). tan(pi/3)=sqrt(3), so A(sqrt(3))=pi/3 on (-pi/2,pi/2).

Exact relationship: C(sqrt(3))<A(sqrt(3)), since pi/6<pi/3. Replacement token: "<".

Domain and endpoints: sqrt(3)>0 is a real input; both returned angles are strictly inside their branches.

Capacity: a comparison response establishes the relation only; no table approximation or numerical rounding is needed.

## Exercise 224

Frozen requirement: compare arccot(1/sqrt(3)) and arctan(1/sqrt(3)).

sqrt(3)>0, so 1/sqrt(3) is defined. cot(pi/3)=1/sqrt(3), giving C(1/sqrt(3))=pi/3. tan(pi/6)=1/sqrt(3), giving A(1/sqrt(3))=pi/6.

Exact relationship: C(1/sqrt(3))>A(1/sqrt(3)). Replacement token: ">".

Domain and endpoints: the positive reciprocal input is real and defined; neither principal angle is an excluded endpoint.

Capacity: the relation is exact. Replacing the source input by sqrt(3), reversing function order, or changing the reciprocal grouping would be a different task; no candidate is inspected here.

## Exercise 225

Frozen requirement: compare arccot 0 and arctan 0.

cot(pi/2)=0 and pi/2 belongs to (0,pi), so C(0)=pi/2. tan(0)=0 and 0 belongs to (-pi/2,pi/2), so A(0)=0.

Exact relationship: C(0)>A(0). Replacement token: ">".

Domain and endpoints: both inverse functions are defined at input 0. C(0) is pi/2, not a cotangent pole; the expressions do not evaluate cot(0). A(0)=0 is an included interior point.

Capacity: a comparison token does not demonstrate an explanation of why the inverse at zero is defined.

## Exercise 226

Frozen requirement: compare arccot 2 and arctan 2.

Since 2>1, strict increase of A gives A(2)>A(1)=pi/4. Strict decrease of C gives C(2)<C(1)=pi/4. For a positive input, A(2)>0 and C(2)>0; their branch ranges give the strict bounds

0<C(2)<pi/4<A(2)<pi/2.

Exact relationship: C(2)<A(2). Replacement token: "<".

Domain and endpoints: input 2 is real; both inverse values exist and avoid their branch endpoints. No decimal approximation or assumption that either is a standard rational multiple of pi is used.

Capacity: the relation can be reported as a token; a full justification uses branch monotonicity. No future selected token alone is evidence of that justification.

## Exercise 227

Frozen requirement: evaluate arctan sqrt(3)+arccot sqrt(3).

A(sqrt(3))=pi/3 and C(sqrt(3))=pi/6 by their branch-selected standard angles. Therefore

A(sqrt(3))+C(sqrt(3))=pi/3+pi/6=pi/2.

Exact answer: pi/2.

Domain and endpoints: both individual inverse values are defined for the positive real input. The sum pi/2 is an output of addition, not a claim that A returns its excluded endpoint.

Capacity: exact-value recognition or entry is narrower than showing both evaluations.

## Exercise 228

Frozen requirement: evaluate arctan(1/sqrt(3))+arccot(1/sqrt(3)).

The positive reciprocal is defined. A(1/sqrt(3))=pi/6 and C(1/sqrt(3))=pi/3, hence

A(1/sqrt(3))+C(1/sqrt(3))=pi/6+pi/3=pi/2.

Exact answer: pi/2.

Domain and endpoints: both individual angles are interior branch values; the sum is not an individual inverse endpoint.

Capacity: preserve the reciprocal input and grouping. Reporting the sum alone does not show the two branch-selected evaluations.

## Exercise 229

Frozen requirement: evaluate arctan 1+arccot 1.

A(1)=C(1)=pi/4, so A(1)+C(1)=pi/4+pi/4=pi/2.

Exact answer: pi/2.

Domain and endpoints: input 1 is real; both principal angles are interior. Addition yields pi/2 without violating either inverse range.

Capacity: an exact answer records the evaluated sum, not the derivation.

## Exercise 230

Frozen requirement: evaluate arctan 0+arccot 0.

A(0)=0 and C(0)=pi/2, so A(0)+C(0)=0+pi/2=pi/2.

Exact answer: pi/2.

Domain and endpoints: both inverses exist at zero. No reciprocal 1/0 and no cot(0) is evaluated. pi/2 is inside C's branch.

Capacity: an exact sum is valid but does not demonstrate the zero-input branch reasoning.

## Exercise 232

Frozen requirement: PROVE arctan x+arccot x=pi/2.

Domain: every real x. The explicit A branch and inherited C branch are both required.

Use the branch-uniqueness proof already present in the original independent conditional reasoning. For arbitrary x in R, set y=A(x). Then

- -pi/2<y<pi/2 and tan(y)=x.
- Set z=pi/2-y. The strict y bounds give 0<z<pi, so cot(z) is defined and z lies in C's inverse branch.
- cos(y)>0 on (-pi/2,pi/2). Thus sin(z)=cos(y) is nonzero, and
  cot(z)=cos(z)/sin(z)=sin(y)/cos(y)=tan(y)=x.
- By inverse uniqueness on (0,pi), z=C(x).

Consequently C(x)=pi/2-A(x), hence A(x)+C(x)=pi/2 for every real x.

Endpoint and sign checks: x=0 gives y=0 and z=pi/2. For x<0, y is in (-pi/2,0), so z is in (pi/2,pi). For x>0, y is in (0,pi/2), so z is in (0,pi/2). No finite x produces y=+/-pi/2 or z=0,pi. No division by x, reciprocal inverse shortcut, unproved periodic branch shift, or unaffected derivative task is needed.

True relationships frozen for this task under the same visible premise:

- C(x)=pi/2-A(x), for every x in R.
- A(x)=pi/2-C(x), for every x in R.
- tan(A(x))=x and cot(C(x))=x, for every x in R.
- A(x)=C(x) if and only if x=1.
- C(x)>A(x) if and only if x<1; C(x)<A(x) if and only if x>1.

For the last three comparison statements, C(x)-A(x)=pi/2-2A(x), A(1)=pi/4, and strict increase of A selects the indicated real-input intervals. These are derived relationships, not new candidate options or assumed source questions.

Capacity: the source requires a proof for all real x. A selected constant, selected equality, or correct truth set cannot by itself demonstrate learner-produced proof, branch justification, or coverage of zero and negative inputs. This freeze supplies a complete mathematical proof, not learner proof evidence and not a reviewed answer diagram.

## Freeze Boundary

Only these ten affected tasks are resolved. No other task, source correction, all34 rewrite, candidate truth-set review, or previous comparison replay is authorized by this supplement. All six earlier unchanged questions and all24 earlier options remain outside this extension.

No future premise may silently change A's branch, C's branch, input grouping, variable quantifier, or endpoint exclusions. The explicit definition must remain a visible source-bound given. This freeze does not clear the earlier blocked review; affected views and their options require a separate release and blind truth/fidelity freeze before keys.
