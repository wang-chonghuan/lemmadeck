from decimal import Decimal, localcontext
import json


def sine(x):
    term = x
    total = term
    n = 1
    while abs(term) > Decimal("1e-110"):
        term = -term * x * x / Decimal((2 * n) * (2 * n + 1))
        total += term
        n += 1
    return total


def cosine(x):
    term = Decimal(1)
    total = term
    n = 1
    while abs(term) > Decimal("1e-110"):
        term = -term * x * x / Decimal((2 * n - 1) * (2 * n))
        total += term
        n += 1
    return total


with localcontext() as context:
    context.prec = 100
    alpha = Decimal("2.36")
    left_denominator = 1 + sine(2 * alpha)
    right_denominator = cosine(alpha) + sine(alpha)
    left = cosine(2 * alpha) / left_denominator
    right = (cosine(alpha) - sine(alpha)) / right_denominator
    residual = abs(left - right)
    threshold = Decimal("1e-80")
    passed = left_denominator != 0 and right_denominator != 0 and residual < threshold
    print(json.dumps({
        "exercise": "374",
        "alpha_radians_exact_decimal": str(alpha),
        "precision_decimal_digits": context.prec,
        "method": "independent direct sine/cosine Taylor series, Python standard-library Decimal",
        "left_denominator": str(left_denominator),
        "right_denominator": str(right_denominator),
        "left": str(left),
        "right": str(right),
        "absolute_residual": str(residual),
        "threshold": str(threshold),
        "passed": passed,
        "source_ownership_approval": False,
        "candidate_comparison": False,
    }, indent=2))
    if not passed:
        raise SystemExit(1)
