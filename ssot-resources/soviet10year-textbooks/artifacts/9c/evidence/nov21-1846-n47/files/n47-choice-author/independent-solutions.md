# Independent source solutions, before alternatives

Authority: prepared `seed.json`, exercises 378-381 and theorem block 0 only.
No answer key, prior choices, worked example, proof, external solution or
symbolic-mathematics service was used. This file contains no candidate options.
The quotient theorem applies at points where the denominator is nonzero.
Changing the argument letter of a derivative function does not introduce a
different differentiation variable or a partial derivative.

## Exercise 378

Task: determine the derivative function at argument y and its values at 0 and
1 for f(x)=(1+2x)/(1+3x).

For a generic argument s with s != -1/3, let u(s)=1+2s and w(s)=1+3s.
Then u'(s)=2 and w'(s)=3. The quotient theorem gives

    f'(s) = [2(1+3s)-3(1+2s)]/(1+3s)^2
          = [2+6s-3-6s]/(1+3s)^2
          = -1/(1+3s)^2.

Consequently:

    f'(y) = -1/(1+3y)^2, y != -1/3;
    f'(0) = -1;
    f'(1) = -1/16.

Both evaluation points are in the natural domain. At -1/3 the original function
is undefined. The conceptual distinctions are the order of the numerator
subtraction, the squared denominator, and evaluating a derivative function
after changing its argument letter.

## Exercise 379

Task: determine g'(y), the same derivative function g'(x), and values at 0 and
1 for g(y)=(2y-3)/(1-3y).

At a generic argument s != 1/3, the numerator derivative is 2 and the
denominator derivative is -3. Thus

    g'(s) = [2(1-3s)-(2s-3)(-3)]/(1-3s)^2
          = [2-6s+6s-9]/(1-3s)^2
          = -7/(1-3s)^2.

The complete requested result is

    g'(y) = -7/(1-3y)^2, y != 1/3;
    g'(x) = -7/(1-3x)^2, x != 1/3;
    g'(0) = -7;
    g'(1) = -7/4.

The letter x in g'(x) names the argument of the same one-variable derivative;
it is not an instruction to hold y constant and differentiate it with respect
to x. The conceptual distinctions are subtracting a product containing a
negative derivative, preserving the order of the two products, and recognizing
that argument renaming preserves the derivative rule.

## Exercise 380

Task: determine h'(t), h'(0), h'(1) for h(t)=t^2/(1+6t).

The natural domain excludes t=-1/6. With numerator derivative 2t and
denominator derivative 6:

    h'(t) = [2t(1+6t)-6t^2]/(1+6t)^2
          = (2t+6t^2)/(1+6t)^2
          = 2t(1+3t)/(1+6t)^2.

Therefore:

    h'(t) = (2t+6t^2)/(1+6t)^2, t != -1/6;
    h'(0) = 0;
    h'(1) = 8/49.

The numerator is not constant, unlike the affine-over-affine tasks above.
The conceptual distinction is retaining the product-rule factors in the
quotient numerator, combining 12t^2-6t^2 correctly, and evaluating the
nonconstant derivative. No removable extension is specified.

## Exercise 381

Task: determine v'(x), v'(y), v'(0), v'(1) for
v(x)=(ax+b)/(cx+d). Treat a,b,c,d as constant parameters. Do not assume that
the unspecified denominators are nonzero at the requested arguments.

At any argument s for which cs+d != 0, the two derivatives are a and c:

    v'(s) = [a(cs+d)-c(as+b)]/(cs+d)^2
          = [acs+ad-acs-bc]/(cs+d)^2
          = (ad-bc)/(cs+d)^2.

The full conditional result is

    v'(x) = (ad-bc)/(cx+d)^2, if cx+d != 0;
    v'(y) = (ad-bc)/(cy+d)^2, if cy+d != 0;
    v'(0) = (ad-bc)/d^2, if d != 0;
    v'(1) = (ad-bc)/(c+d)^2, if c+d != 0.

When the respective denominator is zero, the original quotient is undefined
there and the derivative at that argument is undefined, even if ad-bc=0.
This is not a request to extend the function by filling a hole.

All parameter cases:

- If c != 0, the natural domain excludes exactly -d/c. The derivative formula
  applies everywhere else.
- If c=0 and d != 0, the function is affine, (a/d)s+b/d, on the full real
  line. The formula reduces to a/d, consistent with direct differentiation.
- If c=d=0, the original quotient is nowhere defined. None of the four
  requested derivatives exists.
- If ad-bc=0 and the natural domain is nonempty, the derivative is zero at
  every point of that domain. This does not create derivatives at excluded
  arguments. In particular, v'(0) remains undefined when d=0, and v'(1)
  remains undefined when c+d=0.

Thus the missing nonzero assumptions are not a blocker: a conditional answer
fully solves the written task without imposing extra restrictions.
The conceptual distinctions are symbolic cancellation of the variable terms,
argument renaming, conditional substitution, and respecting the original
domain even when the derivative numerator vanishes.

## Production capacity to preserve in coverage

All requested mathematical outputs above can be assessed through coherent
result recognition. Choosing a supplied result cannot demonstrate generating
the quotient-rule derivation, independently simplifying its numerator, writing
the derivative expressions, or producing the numerical evaluations without
alternatives. These are genuine response-format capacity losses, not unresolved
mathematical source tasks. The conditional domain facts in exercise 381 are
part of the solution, not assumptions introduced to select a unique answer.
