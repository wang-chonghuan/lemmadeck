# Independent pre-option solutions

Author-only internal evidence, 2026-11-19. No draft or options existed when
this file was written. Input: the prepare.py whitelist projection of modern
alg7-c4-s3-n42, exercises 851-854; no answer files, previous choices, source
solutions, or reviewer/ticket outputs were read. Source exercise images: none.

Selected paragraphs: 3 (quadratic definition), 4 (signed coefficient names),
6 (monic means a = 1), and 9 (the general graphical root correspondence).
Paragraph 9 gives a general method, not a worked example. Paragraphs 5 and
10-12 are worked examples and are excluded. Paragraph 14 is a procedural
recommendation rather than a definition and is excluded. No figure is needed
to interpret the selected conceptual statements.

## Task inventory and full solutions

1. 851a: In the equation as printed, 2x^2+17x+3=0, (a,b,c)=(2,17,3).
2. 851b: 5x^2-9x+4=0 gives (5,-9,4). The minus belongs to b.
3. 851c: x^2-12x-6=0 gives (1,-12,-6). The implicit leading coefficient is 1.
4. 851d: -x^2+x-2=0 gives (-1,1,-2). Do not normalize the equation before
   reading its coefficients.
5. 851e: 8x^2-7x=0 gives (8,-7,0); the missing constant is zero.
6. 851f: x^2-81=0 gives (1,0,-81); the missing linear term has coefficient zero.
7. 851 monic classification: Exactly the equations in c and f have a=1 as
   printed. The equation in d has a=-1, not 1, despite |a|=1. All six are
   quadratic because a is nonzero. Dividing by a produces an equivalent
   monic equation but does not make the original displayed equation monic.
8. 852 equality: Plot P: y=x^2 and L: y=x+2 on one frame. Their intersections
   are (-1,1) and (2,4); horizontal coordinates give x=-1 and x=2.
   Independently, x^2-x-2=(x+1)(x-2).
9. 852 strict less-than: P lies below L exactly between the crossings,
   so x is in (-1,2). Crossing endpoints are excluded. At x=0 the heights
   are 0 and 2, confirming the direction.
10. 852 strict greater-than: P lies above L to the left of -1 and to the
    right of 2, so x<-1 or x>2. At x=-2 the heights are 4 and 0; at x=3
    they are 9 and 5. Endpoints remain excluded.
11. 853a: x^2+3x-4=0 becomes y=x^2 and y=-3x+4. Intersections have x=-4,1
    and y=16,1. Factoring (x+4)(x-1) independently confirms these values.
12. 853b: x^2-2x-5=0 becomes y=x^2 and y=2x+5. Completing the square gives
    (x-1)^2=6, hence x=1-sqrt(6),1+sqrt(6), approximately -1.44949,3.44949.
    Intersection heights are 7-2sqrt(6),7+2sqrt(6), approximately
    2.10102,11.89898. A graph-reading answer -1.45 and 3.45 is within 0.05.
13. 853c: x^2+2x+5=0 becomes y=x^2 and y=-2x-5. The difference of the
    parabola height and line height is (x+1)^2+4, strictly positive for
    every real x. The graphs never meet; there are no real roots.
14. 853d: 2x^2-x-3=0 gives y=2x^2 and y=x+3. For the shared y=x^2
    frame, divide every term by 2: y=x^2 and y=x/2+3/2. Crossings have
    x=-1,3/2 and shared-frame y=1,9/4. (2x-3)(x+1) confirms them.
15. 853e: 3x^2+2x-5=0 gives y=3x^2 and y=-2x+5. Divide every term by 3:
    y=x^2 and y=-(2/3)x+5/3. Crossings have x=-5/3,1 and shared-frame
    y=25/9,1. (3x+5)(x-1) confirms them.
16. 853f: 5x^2+12x-10=0 gives y=5x^2 and y=-12x+10. Divide every term by 5:
    y=x^2 and y=-(12/5)x+2. Completing the square gives
    (x+6/5)^2=86/25, hence x=(-6-sqrt(86))/5,(-6+sqrt(86))/5,
    approximately -3.05472,0.65472. The graph-reading values -3.05,0.65
    are within 0.05. Shared-frame heights are approximately 9.33134,0.42866.
17. 854: Write D=y-x and S=x+y. The divisor's common denominator is DS:
    2xy+x(y-x)-y(x+y)=2xy-x^2-y^2=-(y-x)^2.
    Therefore divisor=-D/S, and (D^2/S)/(-D/S)=-D=x-y.
    All original denominators require D!=0 and S!=0; these also make the
    divisor nonzero. With x=42/5 and y=-3/5, D=-9 and S=39/5.
    The first fraction is 135/13; the three divisor terms are
    28/195,14/13,-1/15, whose sum is 15/13. The complete value is 9.

## Distinctions to preserve

- Read signed and implicit coefficients in the equations as written.
- Distinguish a=1 from |a|=1 and from an equivalent normalized equation.
- Use actual shared graph heights for strict inequalities; intersection
  abscissas are roots, not intersection ordinates.
- Preserve all six source functions after full-equation normalization for
  shared-parabola plotting; do not omit division of any term.
- Preserve the absence of real intersections for the everywhere-positive
  quadratic, and use honest graph approximation for nonrational roots.
- Preserve the whole rational expression, division, signed decimals, and
  the nonzero-denominator/nonzero-divisor conditions.

New diagrams, if created, are authored aids with a declared mathematical
basis, never recovered originals. Exact internal values verify their geometry;
learner diagrams should not label roots or advertise a correct choice.

## Capacity limits

Choice can test recognizing a complete coefficient table, classifying displayed
equations, interpreting actual crossings and relative heights, and identifying
the value of the full substituted expression. It cannot prove independent
graph drawing, writing out a coefficient table, deriving a root approximation,
or independently producing the fraction simplification. Those losses must be
recorded in coverage. No unresolved source fact or convention was found.
