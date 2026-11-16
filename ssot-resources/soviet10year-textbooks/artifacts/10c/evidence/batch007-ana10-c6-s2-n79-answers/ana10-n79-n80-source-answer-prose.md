# 10c n79/n80: source-only standard-answer prose

Date: 2026-11-16. Author: worker B under existing STEMROBIN-184 parent delegation.
Role: answer AUTHOR, not an independent approver of these answers.
14 exercise sections: n79 exercises46-51; n80 exercises52-59.
All answers are independently derived, not copied from book answers.
No bookRaw, formal answer JSON, prepare, finalize, promotion or publication.

## Source and Scope

Read current lesson/answer skills and answer Gate2. Read the faithful n79
lesson/exercises currently on disk, but they contain only the opening prose
and an empty exercise array. There is no assembled n80 lesson in that directory.
Accordingly the complete authoritative inputs for this authoring stage are
the already produced faithful page blocks, physical19-27. The n81 heading on
physical28 was read only to locate the next-unit boundary; its tasks/figures
are not part of these answers. No assemble was run.

Exact exercise block references:

```text
46 p0022#2   47 p0022#3   48 p0022#4   49 p0022#5
50 p0022#6   51 p0022#7
52 p0027#2   53 p0027#3   54 p0027#4   55 p0027#5
56 p0027#6   57 p0027#7   58 p0027#8   59 p0027#9
```

Angles are in radians. This book calls f''>0 "向下凸" (graph above
tangents) and f''<0 "向上凸" (graph below tangents). Preserve that
terminology rather than silently reversing the Chinese names.
For n80 the book's frequency parameter is angular frequency omega>0:
T=2pi/omega. Cyclic frequency, when mentioned separately, is 1/T.
Canonical cosine phase uses a representative in [0,2pi[.

No parent source solutions/review reports, modern author materials,
answer outputs, choice options/keys or historical answer files were read.
Faithful page metadata, including the page27 author's mixed-number note,
was encountered while reading source files; that note is not treated as
independent pixel or mathematical proof of exercise55's operator meaning.

## n79: Exercises46-51

### 46. Discuss sin using first and second derivatives

Let f(x)=sin x. Its domain is R:

$$f'(x)=\cos x,\qquad f''(x)=-\sin x.$$

**а) On $]-\pi,-\pi/2[$:** cos x<0 and -sin x>0.
The function decreases; its negative slope increases towards0, so the
descent slows down. The graph is 向下凸 throughout this interval.
Its values lie in $]-1,0[$; neither limiting endpoint value is attained.

**б) On $]-\pi/2,\pi/2[$:** cos x>0 throughout, so f is strictly
increasing on the whole interval. On $]-\pi/2,0[$, f''>0, hence the
rise accelerates and the graph is 向下凸. On $]0,\pi/2[$, f''<0,
hence the rise slows and the graph is 向上凸. At x=0, f''=0 and
the curvature changes; (0,0) is an inflection point, not an extremum.
The range on this open interval is $]-1,1[$.

For a sketch, retain the limiting points (-pi/2,-1), (pi/2,1) as
excluded endpoints and pass through (0,0) with slope1; do not draw an
extremum at the internal change in curvature.

### 47. Discuss tg on all three requested intervals

The full real domain of tan is
$\mathbb R\setminus\{\pi/2+k\pi:k\in\mathbb Z\}$.
On every continuous branch,

$$f'(x)=\frac1{\cos^2x}>0,\qquad
f''(x)=\frac{2\sin x}{\cos^3x}=2\tan x\,\sec^2x.$$

**а) $]-\pi/2,0[$:** tan x<0, so f''<0.
The function increases from -infinity towards0, with decreasing slope:
decelerating rise, 向上凸, range $]-\infty,0[$.

**б) $]0,\pi/2[$:** tan x>0, so f''>0.
The function increases from0 towards +infinity, with increasing slope:
accelerating rise, 向下凸, range $]0,+\infty[$.

**в) $]-\pi/2,\pi/2[$:** strictly increasing over the whole branch,
with range R. It slows on the negative half and accelerates on the
positive half; (0,0) is an inflection point with tangent slope1.
There is no single strict convexity direction on the whole interval,
and no interior maximum or minimum of f. The minimum of f' is1 at0.
The two boundary lines x=-pi/2 and x=pi/2 are vertical asymptotes,
not points belonging to the graph.

### 48. Sine tangents at0 and pi; inflection explanations

At0, f(0)=0 and f'(0)=1, hence the tangent is

$$\boxed{y=x}.$$

At pi, f(pi)=0 and f'(pi)=-1, hence

$$\boxed{y=-(x-\pi)=\pi-x}.$$

Near0, f''=-sin x is positive to the left and negative to the right.
Near pi it is negative to the left and positive to the right.
Thus (0,0) and (pi,0) are both inflection points.

The curve actually crosses each tangent locally: near0,
sin x-x has the opposite sign to x. With u=x-pi, the difference
from the second tangent is u-sin u, which has the same sign as u.
This gives the local graph/tangent configuration as well as the
second-derivative sign proof. Domain: R.

### 49. Tangent tangents at0 and -pi; graph and inflections

At both requested x values, tan x=0 and sec^2x=1:

$$\boxed{y=x\quad\text{at }(0,0)},\qquad
\boxed{y=x+\pi\quad\text{at }(-\pi,0)}.$$

On each branch centred at a=k*pi, put u=x-a. Then tan x=tan u,
and the second derivative is negative for u<0 and positive for u>0.
Both requested contacts are inflection points, changing from 向上凸
to 向下凸. The first derivative never changes sign there.

Concrete graph construction:

- On $]-\pi/2,\pi/2[$, plot (-pi/4,-1), (0,0), (pi/4,1);
  draw the increasing tangent curve with asymptotes x=+-pi/2 and
  the line y=x through its central contact.
- Translate that entire branch and tangent left by pi: on
  $]-3\pi/2,-\pi/2[$, plot (-5pi/4,-1), (-pi,0), (-3pi/4,1);
  draw asymptotes x=-3pi/2,-pi/2 and the line y=x+pi.
- Each branch tends to -infinity at its left asymptote and +infinity
  at its right asymptote. No line of the graph connects across an asymptote.

To verify tangent crossing, D(u)=tan u-u has D(0)=0 and
D'(u)=tan^2u. Therefore D(u)<0 for negative u and D(u)>0 for
positive u on the branch. The graph passes from below to above
the corresponding tangent at each contact.

### 50. Quadratic second derivatives and curvature

Original interval remains the faithful literal `$]\infty,\infty[$`.
It is not silently treated as a valid nonempty interval in this answer.
My prior independent mathematical erratum reasoning is retained:
the unique maximal common real interval is $]-\infty,+\infty[$,
although many proper subintervals also have the properties.
This is mathematics, not recovery of a printed minus glyph.

**а)** f(x)=3-2x-x^2:

$$f'(x)=-2-2x,\qquad \boxed{f''(x)=-2}.$$

**б)** g(x)=6x^2-3x+2:

$$g'(x)=12x-3,\qquad \boxed{g''(x)=12}.$$

Both have domain R. On that full real domain, f''<0 proves f's
graph is 向上凸; g''>0 proves g's graph is 向下凸. An exact
tangent comparison, valid for every real contact t, is

$$f(x)-[f(t)+f'(t)(x-t)]=-(x-t)^2,$$
$$g(x)-[g(t)+g'(t)(x-t)]=6(x-t)^2.$$

They are respectively below and above their tangents, strictly away
from the contact. These establish the requested proof without
changing either polynomial. A later modern binding must explicitly
apply the separately registered interval erratum rather than conceal it.

### 51. Cubic second derivative and the two convexity intervals

For f(x)=3-3x^2+x^3, domain R:

$$f'(x)=3x^2-6x,\qquad \boxed{f''(x)=6x-6=6(x-1)}.$$

On $]-\infty,1[$, f''<0, hence the graph is 向上凸.
On $]1,+\infty[$, f''>0, hence it is 向下凸.
At x=1, f(1)=1 and the sign changes, so (1,1) is an inflection.
Its tangent is y=-3x+4; the difference from that tangent is
(x-1)^3, which changes sign across the contact. This supplies
both the sign proof and the local graph interpretation.

## n80: Exercises52-59

### 52. Formula from amplitude, period and phase; frequency

Given A=3.5=7/2, T=3pi/2, and cosine phase pi/3:

$$\omega=\frac{2\pi}{T}=\boxed{\frac43},\qquad
\boxed{f(t)=\frac72\cos\left(\frac43t+\frac\pi3\right)}.$$

Domain: all real t. A>0, so T is the least positive period.
The book's requested frequency is omega=4/3, not the cyclic
frequency; the latter is separately 1/T=2/(3pi).

### 53. Parameters of the printed SINE expression

Faithful function:

$$y(t)=0.8\sin\left(\frac t3+\pi\right).$$

Domain: R. Its amplitude is **0.8=4/5**, angular frequency
**1/3**, and least positive period **6pi**.

The constant phase in the **printed sine form** is **pi** modulo2pi.
It must not be identified with the phase of the book's canonical
cosine form:

$$y(t)=\frac45\cos\left(\frac t3+\frac\pi2\right).$$

Thus the **canonical COSINE phase is pi/2**, not pi. These are
two equivalent representations with different phase conventions,
not contradictory answers to one fixed convention. A later formal
prompt/key must state which convention it requests.

For concrete graph orientation: y(0)=0 and y'(0)=-4/15.
One period passes through
(0,0), (3pi/2,-4/5), (3pi,0), (9pi/2,4/5), (6pi,0);
repeat with period6pi. The motion initially goes downward.
Cyclic frequency, separately, is1/(6pi).

### 54. Convert the complete expression to cosine form

Keep both printed terms. Since sin(pi/6)=1/2 and cos(pi/6)=sqrt3/2,

$$
\begin{aligned}
y&=2\sin\frac\pi6\cos x+2\sin x\cos\frac\pi6\\
 &=\cos x+\sqrt3\sin x
 =2\sin\left(x+\frac\pi6\right)
 =\boxed{2\cos\left(x-\frac\pi3\right)}.
\end{aligned}
$$

Amplitude **2**, angular frequency **1**, least positive period
**2pi**, cosine phase **-pi/3 modulo2pi**, with canonical
representative **5pi/3**. Domain R. The intermediate sine phase
pi/6 is not the cosine phase.

### 55. Numeric-adjacency interpretation and conditional full solution

Exact source block `p0027#5`:

```latex
y=3\frac{1}{2}\cos2x+3\frac{\sqrt{3}}{2}\sin2x
```

Actually opened original page27 local pixels
[200,1440,1320,145] in memory. They show the numeral3 immediately
before a stacked1/2, with no visible multiplication dot, cross,
parentheses or plus sign between them. The second coefficient
shows3 followed by the radical fraction sqrt3/2. No numeric
mark is erased or inserted in this interpretation.

**Conventional mixed-number reading of the first coefficient:**
3-and-1/2 is7/2. The second coefficient is ordinary
3 times sqrt3/2. Under that reading, write

$$p=\frac72,\qquad q=\frac{3\sqrt3}{2},\qquad
A=\sqrt{p^2+q^2}=\boxed{\sqrt{19}}.$$

Let theta=arctan(3sqrt3/7), so 0<theta<pi/2. Then

$$\cos\theta=\frac7{2\sqrt{19}},\qquad
\sin\theta=\frac{3\sqrt3}{2\sqrt{19}},$$
$$\boxed{y=\sqrt{19}\cos(2x-\theta)}.$$

Parameters: amplitude sqrt19; angular frequency2; least positive
period pi; cosine phase -theta modulo2pi, canonical2pi-theta.
Domain R. Expanding the cosine verifies both original coefficients;
in particular y(0)=7/2 and y'(0)=3sqrt3.

**Residual interpretation limit, not a neat-answer override:**
the source text's numeric adjacency convention was not explicitly
defined in the already produced pages consulted. A targeted source-only
search found no other independent whole-number/proper-numeric-fraction
example establishing the convention. The page27 metadata calls it a
mixed number, but that is the source author's interpretation, not a
separate mathematical authority. Standard mixed-number typography
favours7/2; absence of a multiplication dot alone cannot logically
exclude every implicit-product reading.

If the parent/source gate instead explicitly settles the first3 as a
numeric factor multiplying1/2, the DIFFERENT function would have
p=3/2, q=3sqrt3/2 and

$$y=3\cos(2x-\pi/3),\quad A=3,\quad\omega=2,\quad
T=\pi,\quad\varphi=5\pi/3.$$

That alternative has y(0)=3/2, so it is not equivalent to the
mixed-number function. It is recorded solely as a conditional branch,
NOT as another accepted key for the same function. The neat amplitude3
is not evidence for changing the printed coefficient. No source
erratum for55 is proposed. Until the mathematical interpretation is
explicitly settled, this section is a conditional source-prose
answer, not an unconditional formal-key approval.

### 56. Any nonzero solution of y''=-25y

One valid choice, defined on R, is

$$\boxed{y(x)=\cos5x}.$$

Indeed y'=-5sin5x and y''=-25cos5x=-25y.
It is not identically0 since y(0)=1. The complete real solution
family is C1 cos5x+C2 sin5x, with (C1,C2) not both0 to respect
the explicit exclusion y identically0.

### 57. Check x=3cos(2t+pi) against x''=-4x

$$x'=-6\sin(2t+\pi),\qquad x''=-12\cos(2t+\pi)
=-4[3\cos(2t+\pi)]=-4x.$$

**Yes**, it is a solution for every real t. The phase pi and
coefficient3 have both been retained.

### 58. Prove x=2cos4t solves x''=-16x

$$x'=-8\sin4t,\qquad x''=-32\cos4t
=-16[2\cos4t]=-16x.$$

The required equality holds on R, proving the claim without
dropping the amplitude2 or confusing4 with the coefficient16.

### 59. Check x=7cos(3t+5) against x''=-9x

$$x'=-21\sin(3t+5),\qquad x''=-63\cos(3t+5)
=-9[7\cos(3t+5)]=-9x.$$

**Yes**, for all real t. The complete printed function, including
phase5, is retained.

## Physical26 Vector/Phase Finding: Candidate Only

Actually opened original page26 local context
[210,240,1380,1110] in memory, containing systems(10)/(10a),
amplitude(11), the positive-coordinate vector prose, and formula(12).
The faithful positives are retained; no minus glyph is claimed recovered.

With x(t)=A cos(omega*t+phi), omega>0, differentiation gives

$$x_0=A\cos\varphi,\qquad v_0=-A\omega\sin\varphi.$$

Hence system(10a) correctly reads

$$-\frac{v_0}{\omega}=A\sin\varphi.$$

For A>0, the vector whose directed argument is phi modulo2pi is

$$\left(x_0,-\frac{v_0}{\omega}\right)
=A(\cos\varphi,\sin\varphi).$$

The printed positive-coordinate vector
(x0,+v0/omega)=A(cos phi,-sin phi) instead has directed argument
-phi modulo2pi. Its length is stillA, so the amplitude formula(11)
is correct and needs no sign change inside its square.
An unsigned angle cannot encode the book's full phase interval
[0,2pi[ either.

Concrete counterexample: take omega=1 and x(t)=cos(t+3pi/2)=sin t.
Then A=1, x0=0, v0=1 and the cosine phase is3pi/2.
The printed vector(0,1) has argument pi/2, not3pi/2;
the vector(0,-1) has the required argument3pi/2.
Formula(12) gives tan(phi/2)=-1, agreeing with phi=3pi/2,
and disagreeing with the positive-vector phase pi/2.

**Precise mathematical candidate, not registered or applied:**
block `p0026#4`, the sole vector/phase explanation block.

```text
Original prose-coordinate expression:
$\frac{v_0}{\omega}$
Candidate:
$-\frac{v_0}{\omega}$

Original vector expression:
$\vec{r}\left(x_0,\frac{v_0}{\omega}\right)^{*}$
Candidate:
$\vec{r}\left(x_0,-\frac{v_0}{\omega}\right)^{*}$
```

Both changes form one coherent candidate remedy: preserve the meaning of
phi in the existing cosine solution, systems(10)/(10a), and formula(12),
while changing the reflected vector's second coordinate. This is a
statement-level mathematical erratum, not a source transcription repair.
Changing only one of the two occurrences would leave the explanation
internally inconsistent.

Formula(12) follows from
tan(phi/2)=sin phi/(1+cos phi), but its finite quotient needs
A>0 and x0+A !=0. If x0=-A and v0=0 with A>0, phi=pi and the
displayed quotient is0/0, so choose that phase separately.
If A=0, the solution is identically0, the vector's argument is
undefined and phase is arbitrary. These are application limits,
not an additional source correction registered by this author.
A robust mathematical phase specification for nonzero data is
the argument of (x0,-v0/omega) in [0,2pi[.

## Actual Figure and Pixel Observations

Opened individually, original faithful PNGs only:

- fig05: open interval endpoints a/b, upward/increasing curve with
  increasing slope; x/y axes and vertical endpoint projections.
- fig06: increasing curve flattening towards b; open endpoints and
  the same coordinate/projection apparatus.
- fig07: decreasing curve flattening towards b; open endpoints.
- fig08: decreasing curve becoming steeper towards b; open endpoints.
- table p0021-01: on (0,pi/2)/(pi/2,pi), cos'=-sin is negative
  in both columns; cos''=-cos is negative then positive.
- fig09: cosine curve, tangent through (pi/2,0), x/y axes,
  y levels1/-1 and x markings pi/2/pi. This is the source's
  inflection/tangent illustration, not an answer diagram for49.
- fig10: two fixed supports, two springs, central equilibrium ball,
  rightward coordinate axis, origin tick/glyph and terminal x.
- fig11: displaced ball, stretched/compressed spring appearance,
  separate origin and displaced-position ticks/labels, rightward axis.
  No measured physical constant is inferred from raster distances.

No exercise46-59 explicitly references an illustration. These are
lesson-definition/apparatus observations, not future modern figureEvidence.
Graph requests are answered with concrete functions, contacts, plotted
points, asymptotes and curve/tangent relations above; no new figure is made.

Local-crop order limit: an initial in-memory crop at
[650,1290,850,175] missed the exercise55 formula and was not used to
interpret its coefficients. The corrected local crop above was observed
before that interpretation was frozen. In-memory image loading first
encountered an unsupported/missing sharp import; existing Pillow was
used without installation. No crop or helper file was persisted.

## Input Hash Bindings

Snapshot at prose handoff. These identify faithful inputs, not an approval
of page metadata or command gates. Source page22 metadata changed during
this assignment; the mathematical answer uses its unchanged ex50 block.
No parent's newly registered reason or independent solutions were consulted.

Page root:
`ssot-resources/soviet10year-textbooks/artifacts/10c/pages/`.

```text
0019/page.md   4726852859ea0a9f64b63e1d2db04d763669c5c4f1220cba0ecf18ace7799581
0020/page.md   04f6f1d0a3f2673f8e1263da71a0a49c405969ef3b1e1281e1602be5d93065f6
0021/page.md   0ca8869e35944a1807faf47240b39a4f4a7bded8fe9814e2b657120b64d3340f
0022/page.md   8e6a83f428bc016043a87aefe789d9abde3730b494b594f981c94c5bdc406bae
0023/page.md   e881e8ec262683fa3e93397185f5c0530153e3e0081ed5d3dc6a9218f49ca4cc
0024/page.md   bbd97fc9a2a9261c1b5dcc295de29ee5ccbab84c6c283f413a5eb29aef9e8659
0025/page.md   4ea7b77a330b738adb9c28c4744c72a23e61ca07ee3568052316279ab17d5986
0026/page.md   e8530f0b51790e9b0d127ae8a3c47fd9959c41d9db24815eb7336a2ee18ac71e
0027/page.md   b101e6e3fcc5399cdbd06881f14dbe9bafec29252ac3dd08d783c2e840969eb3

0022/page.json 58bd337ac06e13b0b9e29c9325b64d5d8d63fa731835ede82b9e34a783a31f47
0026/page.json c4df28b46c4fc33ac3ff8ca228aa56b7c1a101377743a34b1bfad57d9d9c2c39
0027/page.json 180480cf59a57e22ed7348f97a83ba16c729a0775237c14c1dfc02fc6ae0085e
```

Additional metadata-independent blocks-array digests: SHA-256 of UTF-8
json.dumps(blocks, ensure_ascii=False, sort_keys=True, separators=(',',':')).

```text
0022 blocks 35f9afbf65c656a2f4074a7ed23e04108fce044be5da4a1a07b10f8e05f2ce0a
0026 blocks 3e3b30a941ea5b2eb4a0d6912ce40f73aa7ff9b4bd8d3c7ca25e5b278942b052
0027 blocks 526a7e482a06dc507e3d0afec41962738b86df1cb3c4cd4b8c6dc86f1a19354f
```

Original-pixel root: `.tmp/ld-s10y-lesson/10c/pages/`.

```text
0020/figures/fig-05.png 9762fd425047afc9880b1a6ef6380fa307fdcd1fc3bbca1c7f2f3664d4b909bf
0020/figures/fig-06.png c0f74409bab468a675ff077d2feb49ba79dc9b3df89ff88a1618f6e6d5dfb50a
0020/figures/fig-07.png 7b226880647ee9f862dbcf80728eed3faa1ff17928f848b4a0ec4361b9dd7c1e
0020/figures/fig-08.png a6ae8ab3af00e358db0f0b83cbe34ff49b8a09f3c6c5dd32c76f0b4e14231974
0021/figures/fig-09.png 0f174d4af846f09e62f547fbe6aba503c5098218b8bf9a2ab312b37721c2ca12
0021/figures/tbl-p0021-01.png d578034e371c0d94ac215e834abdd2f24ca41e13e1fdfeeb9e9123aeeb661d1e
0023/figures/fig-10.png f51e919518420811f91d74e077f174442ec2acdb35346a21914f7a96329b91ef
0023/figures/fig-11.png 4d30e4fe5c3590cc51cc90dace7b72e43a0ccfd23bfd56c6d50805c0b7aa135a
0026/page.png bf022335af80cf286a6b933ef4dc1dfc505726d130d92f9ee009bc6ffa83c55e
0027/page.png 0a50daeabe59fed1935454ce84e6304733e20d808160221b061d3c0d115cf721
```

Contracts:

```text
.claude/skills/ld-s10y-answer/SKILL.md
afc242003e5bc2f3165dfc5bee60e2e684ed85e2627c7d57ce3501cdd76bfc83
.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md
9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9
```

## Immutable Author Handoff

All14 exercises have complete source-prose responses. Exercise55 has an
explicit interpretation hold with both non-equivalent conditional results;
exercise53 separates sine and cosine phase conventions. Physical26 has a
precise, unregistered mathematical vector-sign candidate and formula limits.
Exercise50 preserves its faithful original and mathematical interval caveat.
No answer or lesson gate is self-approved.

Only this report was written. No source, tool, index, app, schema, dependency,
Git, DB, network, browser, modern draft or formal answer JSON was changed.
Stop author edits here; await an explicitly supplied approved modern context
and official template before any later binding.
