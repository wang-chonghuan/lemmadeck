import json
import math
from fractions import Fraction as F


def vector(*values):
    return [F(value) for value in values]


def add(a, b):
    return [x + y for x, y in zip(a, b)]


def scale(k, a):
    return [k * x for x in a]


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def strings(values):
    return [str(value) for value in values]


a2, b2, c2 = vector(-2, 3, 0), vector(1, -1, 5), vector(7, 0, 4)
a3, b3, c3 = vector(-3, -1, 2), vector(4, 0, 6), vector(5, -2, 7)
a4, b4 = vector("3/7", "1/2", "-3/4"), vector("2/7", "1/3", "-1/2")
c4, d4 = vector("-3/2", 6, "4/3"), vector("9/8", "-9/2", -1)
lambda5 = F(5, -3)
x5, y5 = lambda5, F(-2) / lambda5
a5, b5 = vector(x5, -2, 5), vector(1, y5, -3)
a6, b6 = vector(-2, 3, 1), vector(5, 7, -4)
c6, d6 = vector("1/2", "3/5", "-5/6"), vector("-2/3", "5/6", "-1/5")
a7, b7 = vector(-2, 1, 3), vector(6, -5, 7)
c7, d7 = vector(6, 0, 12), vector(-8, 13, 4)
q2 = [add(a2, b2), add(a2, scale(-1, c2)), add(add(a2, scale(-1, b2)), c2)]
q3 = [scale(2, a3), scale(F(-7, 6), b3), add(scale(-1, a3), scale(3, c3))]
assert q2 == [vector(-1, 2, 5), vector(-9, 3, -4), vector(4, 4, -1)]
assert q3 == [vector(-6, -2, 4), vector("-14/3", 0, -7), vector(18, -5, 19)]
assert a4 == scale(F(3, 2), b4)
assert d4 == scale(F(-3, 4), c4)
assert a5 == scale(lambda5, b5)
assert dot(a6, b6) == 7 and dot(c6, d6) == F(1, 3)
assert dot(a7, b7) == 4 and dot(c7, d7) == 0
output = {
    "status": "independent-source-arithmetic-ok",
    "basis": "orthonormal unit basis (i,j,k), not screen lengths or angles",
    "sourceInputs": {
        "2": {"a": strings(a2), "b": strings(b2), "c": strings(c2)},
        "3": {"a": strings(a3), "b": strings(b3), "c": strings(c3)},
        "4": {"a": strings(a4), "b": strings(b4), "c": strings(c4), "d": strings(d4)},
        "5": {"a": ["x", "-2", "5"], "b": ["1", "y", "-3"]},
        "6": {"a": strings(a6), "b": strings(b6), "c": strings(c6), "d": strings(d6)},
        "7": {"a": strings(a7), "b": strings(b7), "c": strings(c7), "d": strings(d7)},
    },
    "tupleTargets": {
        "1": [[1, 2, -3], [8, 0, 1], [0, 0.5, -math.sqrt(2)],
              [0, 7, 0], [1, 0, 0], [0, 0, 0], [1, 0, 8]],
        "2": [[float(v) for v in item] for item in q2],
        "3": [[float(v) for v in item] for item in q3],
    },
    "exactTupleTargets": {"2": [strings(item) for item in q2], "3": [strings(item) for item in q3]},
    "collinearity": {
        "4": {"bothCollinear": True, "aOverB": "3/2", "dOverC": "-3/4",
              "aMinusScaledB": strings(add(a4, scale(F(-3, 2), b4))),
              "dMinusScaledC": strings(add(d4, scale(F(3, 4), c4)))},
        "5": {"lambda": str(lambda5), "x": str(x5), "y": str(y5),
              "substitutionResidual": strings(add(a5, scale(-lambda5, b5))),
              "uniqueness": "z coordinates fix lambda=-5/3, then first and second fix x,y"},
    },
    "numericTargets": {"5": [float(x5), float(y5)], "6": [float(dot(a6, b6)), float(dot(c6, d6))]},
    "dotProducts": {
        "6": [{"products": strings([x * y for x, y in zip(a, b)]), "sum": str(dot(a, b))}
              for a, b in [(a6, b6), (c6, d6)]],
        "7": [{"products": strings([x * y for x, y in zip(a, b)]), "sum": str(dot(a, b)),
               "perpendicular": dot(a, b) == 0, "bothNonzero": any(a) and any(b)}
              for a, b in [(a7, b7), (c7, d7)]],
    },
    "candidateRead": False,
    "source": "values transcribed directly from current edition and actually viewed source pages 154-155",
}
print(json.dumps(output, indent=2))
