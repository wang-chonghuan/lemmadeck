# Independent source mathematics: n46 / n47

STEMROBIN-182. Worktree `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Authority: `n46-n47-source-stage/artifacts/7a/lessons/<id>/{lesson.json,exercises.json}`
under the same `resume182-13` directory. Exact raw-file SHA-256 bindings are in
`source-solutions.json`. All work below was derived from raw definitions/exercises
before opening modern outputs. No author keys, choice drafts, previous choices,
old ticket packages, or images were read. This is a reusable independent reference,
not an authored answer key.

Real-number convention: roots are unordered; exclude nonreal roots. Count an
unsubdivided exercise as one task. Counts: n46 = 10 originals / 41 tasks / 25 prose
blocks / 6 grouped prose-mathematics checks; n47 = 7 originals / 24 tasks / 17 prose
blocks / 4 grouped prose-mathematics checks. Total = 17 originals / 65 tasks /
42 prose blocks / 10 grouped prose-mathematics checks / zero figures.

## n46: prose mathematics

1. `p0273#12,p0274#1-4`: $5x^2-4x-12=(5x+6)(x-2)$ gives roots
   $-6/5,2$, sum $4/5$, product $-12/5$.
2. `p0274#5-7`: completing the square gives $(2ax+b)^2=D=b^2-4ac$.
   For $a\ne0,D>0$, roots are $(-b\pm\sqrt D)/(2a)$, with sum $-b/a$
   and product $(b^2-D)/(4a^2)=c/a$. Raw `p0274#5` has erroneous
   $\sqrt b$ in the second root. With the introductory equation, $b=-4$
   but $D=256$, so that raw formula is not even real. Replacing only
   $\sqrt b$ by $\sqrt D$ is mathematically necessary; leave raw faithful.
3. `p0274#8,p0275#1-4,6`: at $D=0$, the single distinct root $-b/(2a)$,
   counted twice, still has sum $-b/a$ and product $c/a$. For $a=1$ these
   become $-b,c$. The source has already restricted attention to real roots.
4. `p0275#7`: $x^2-7x+10=(x-2)(x-5)$; $D=9$, sum $7$, product $10$.
5. `p0275#8-9,p0276#1-6`: $m+n=-b/a,mn=c/a$ imply
   $ax^2+bx+c=a(x-m)(x-n)$, so exactly $m,n$ are roots, including the
   coincident case. Dividing by nonzero $a$ preserves equivalence of
   numbered equations (1), (2), (3). The $a=1$ converse follows.
6. `p0276#7-9,p0277#1`: roots $7,-2$ yield
   $x^2-5x-14=(x-7)(x+2)=0$. Every nonzero scalar multiple has the same
   roots, proving the arbitrary-many-equations assertion.

## n46: originals 892-901

892. Check $D$ before applying Viete; no solving is needed.
- a: $D=161$, sum $9/2$, product $-5$.
- b: $D=4$, sum $-12/5$, product $7/5$.
- c: $D=1261$, sum $37$, product $27$.
- d: $D=3165$, sum $-41$, product $-371$.
- e: $D=15$, sum $-2$, product $-14$.
- f: $D=-56$, no real roots. Formal ratios $8/3,10/3$ are not a pair
  of real-root sum/product answers to this conditional task.
- g: $D=304$, sum $0$, product $-19/4$.
- h: $D=44100$, sum $210$, product $0$.

893. Solve and check both sum and product.
- a: $(3x+2)(x-2)=0$; roots $-2/3,2$; sum $4/3$, product $-4/3$.
- b: $(2x+3)(x+2)=0$; roots $-2,-3/2$; sum $-7/2$, product $3$.
- c: $(x-1)^2=10$; roots $1\pm\sqrt{10}$; sum $2$, product $-9$.
- d: $D=17$; roots $(-9\pm\sqrt{17})/4$; sum $-9/2$, product $4$.

894. a: $7r=-35$ gives other root $-5$, then $p=-(7-5)=-2$.
b: other root $13-12.5=0.5$; $q=12.5(0.5)=6.25$.

895. a: $8r=24/5$ gives $r=3/5$; $b=-5(8+3/5)=-43$.
b: $r=33/10-5.3=-2$; $c=10(5.3)(-2)=-106$.

896. With sum $S$ and separation $d$, the unordered roots are
$(S+d)/2,(S-d)/2$, product $(S^2-d^2)/4$.
a: roots $7,5$, $q=35$. b: roots $5/2,-7/2$, $c=-35/4$.
Either ordering of the two root names gives the same coefficient.

897. a: $D=12853>0$, product $-7/3<0$.
b: $D=85001>0$, product $-16/5<0$.
Both have two nonzero real roots of opposite signs; same signs are impossible.

898. Use existence, product sign, then sum sign.
- a: $D=53$, product $-1$: opposite signs.
- b: $D=45$, product $1$, sum $7$: both positive.
- c: $D=289-320=-31$: no real roots.
- d: $D=149$, product $5/19$, sum $23/19$: both positive.
- e: $D=75-88=-13$: no real roots.
- f: $5\sqrt2>7$ since $50>49$, so product $(7-5\sqrt2)/11<0$;
  $D=220\sqrt2-227>0$: opposite signs.

899. Construct and solve each equation; any nonzero scalar multiple is valid.
- a: $x^2-13x+30=(x-3)(x-10)=0$; roots $3,10$.
- b: $x^2+11x+28=(x+7)(x+4)=0$; roots $-7,-4$.
- c: $8x^2-19x-15=(8x+5)(x-3)=0$; roots $-5/8,3$.
- d: $4x^2-20x+21=(2x-3)(2x-7)=0$; roots $1.5,3.5$.
- e: $x^2-4x+1=0$, or $(x-2)^2=3$; roots $2\pm\sqrt3$.
- f: $x^2-5=0$; roots $\pm\sqrt5$.
- g: $x^2-10x+7=0$, or $(x-5)^2=18$; roots $5\pm3\sqrt2$.
- h: $x^2+14x+1=0$, or $(x+7)^2=48$; roots $-7\pm4\sqrt3$.

900. a: $t=3x+1$, $t(t-1)=0$; $x=-1/3,0$.
b: $(3x+2)(3x-1)=0$; $x=-2/3,1/3$.
c: $(9x+2)(x+2)=0$; $x=-2,-2/9$.
d: $2x+6=2(x+3)$ makes the equality an identity: every real $x$.

901. a: the first inequality alone requires $7<1$, impossible.
b: the square inequality forces $x=2$, contradicting $x<1$.
c: $|x|<3$ gives $(-3,3)$, disjoint from $(12,\infty)$.
Each complete system has empty solution set.

## n47: prose mathematics

1. `p0278#8-10,p0279#1-3`: $x^3-9x=x(x+3)(x-3)$;
   exactly $\{0,-3,3\}$.
2. `p0279#4-9,p0280#1-2`: $y=x^2-5x$ gives
   $y^2-30y-216=(y+6)(y-36)=0$. Back-substitute both branches:
   $x^2-5x=-6$ gives $2,3$; $x^2-5x=36$ gives $-4,9$.
   Union $\{2,3,-4,9\}$. Direct expansion:
   $x^4-10x^3-5x^2+150x-216=0$.
3. `p0280#3-6`: $y=x^2\ge0$ gives
   $4y^2-5y+1=(4y-1)(y-1)=0$, hence $y=1/4,1$.
   Restore both signs: $\{-1/2,1/2,-1,1\}$.
4. `p0280#7`: $ax^4+bx^2+c=0$ with $a\ne0$ is biquadratic.
   Substitute $y=x^2\ge0$: positive $y$ gives two real roots, zero one
   distinct root, negative $y$ none.

## n47: originals 902-908

902. Use substitutions and retain every back-substitution branch.
- a: $t=5x-1$, but $5x+1=t+2$, not $t$.
  $t^2+6(t+2)-7=(t+1)(t+5)=0$.
  $t=-1$ gives $x=0$; $t=-5$ gives $x=-4/5$.
  Direct check: the original expression expands to $5x(5x+4)$.
- b: $t=x^2-9$, $(t-1)(t-7)=0$.
  $t=1$ gives $x=\pm\sqrt{10}$; $t=7$ gives $x=\pm4$.
- c: $t=2a^2+3a$, $(t-2)(t-5)=0$.
  $t=2$: $(2a-1)(a+2)=0$, giving $a=1/2,-2$.
  $t=5$: $(2a+5)(a-1)=0$, giving $a=-5/2,1$.
- d: $t=y^2+2y+4=(y+1)^2+3\ge3$, $(t-3)(t-4)=0$.
  $t=3$ gives $y=-1$ (double); $t=4$ gives $y=-2,0$.
  Distinct solution set $\{-2,-1,0\}$.

903. Put $t$ equal to the original variable squared, require $t\ge0$.
- a: $(t-1)(t+2)=0$; discard $-2$, $x=\pm1$.
- b: $(t-9)(t+1)=0$; discard $-1$, $x=\pm3$.
- c: $(t-16)(t+9)=0$; discard $-9$, $y=\pm4$.
- d: $(4t-1)(9t-1)=0$; $z=\pm1/2,\pm1/3$.
- e: $(2t-1)(8t-1)=0$; $x=\pm\sqrt2/2,\pm\sqrt2/4$.
- f: $(t+5)(t+10)=0$; both $t$ negative: no real roots.
- g: $(t-4)^2=0$; $y=\pm2$, each double.
- h: $(3t-1)^2=0$; $y=\pm\sqrt3/3$, each double.
- i: $t(t-25)=0$; $x=0,\pm5$, with zero double.
- j (raw label к): $t(t+0.16)=0$; discard $-0.16$, only $x=0$,
  double. Modern labels must be natural Latin a-j, not a-i,k.

904. $2x^4+3x^2+1\ge1>0$ for all real $x$, so no roots.
Equivalently, $(2t+1)(t+1)=0$ has only negative $t$.

905. Intersections with **both** axes:
- a: $(t-1)(t-9)=0$; x-axis $(-3,0),(-1,0),(1,0),(3,0)$;
  y-axis $(0,9)$.
- b: $(t-3)(t+1)=0$; reject $-1$; x-axis $(\pm\sqrt3,0)$;
  y-axis $(0,-3)$.
- c: $(x^2+1)^2+5>0$; no x-axis intersections; y-axis $(0,6)$.
- d: $x^2(x^2+36)=0$; only $(0,0)$, shared by both axes.

906. a:
$(\sqrt{30}-6)/\sqrt{15}=\sqrt2-2\sqrt{15}/5
=(5\sqrt2-2\sqrt{15})/5$.
b: numerator $=\sqrt5(\sqrt{15}+3)$; denominator is positive,
so the reduced value is $\sqrt5$.

907. For $a\ge0$, the range on $[-a,a]$ is $[0,1.7a^2]$.
$1.7a^2=6.8$ gives $a=2$; domain $[-2,2]$.

908. a: $2x-5\ge0$ and $7-x\ge0$, so $[5/2,7]$.
b: $x-10\ge0$ but $25-2x>0$ (nonzero denominator), so
$[10,25/2)$. The lower endpoint is included, upper excluded.

## Freeze

Both companion files are to be set to mode `0444` before any modern-output
inspection. Later review reports bind these immutable source solutions by SHA-256.
No source correction, finalize, network, DB, Git, dependency, production, or app/test
operation is part of this independent mathematics review.
