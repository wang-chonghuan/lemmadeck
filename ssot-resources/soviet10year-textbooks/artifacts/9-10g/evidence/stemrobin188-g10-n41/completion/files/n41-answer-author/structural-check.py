import importlib.util
import json
import sys
from fractions import Fraction as F
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
if Path.cwd() != REPO:
    raise SystemExit("Exact repository cwd required")
sys.dont_write_bytecode = True
tool = REPO / ".claude/skills/ld-s10y-answer/tools/lesson_answers.py"
spec = importlib.util.spec_from_file_location("n41_lesson_answers", tool)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
profile = module.load(module.MODERN_US_PROFILE)
forbidden = profile.get("forbidden_terms", []) + profile.get("forbidden_person_names", [])
candidate = Path(sys.argv[1])
exercises = REPO / (
    "ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/"
    "modern-us-neutral/lessons/geo910-c1-s3-n41/exercises.json"
)
document, errors = module.validate_lesson(
    candidate, exercises, "9-10g", "geo910-c1-s3-n41", "modern-us-neutral", forbidden
)
if document.get("status") != "draft":
    errors.append("Author candidate must remain draft")
if any(item.get("source") != "derived" or "bookRaw" in item for item in document["answers"]):
    errors.append("Absent book answers require derived source and no fabricated bookRaw")

checks = [
    ("391(1) largest exceeds remaining sum", 120 > 100 + 10),
    ("391(2) degenerate triangle equality", 80 == 50 + 30),
    ("391(3) forbidden total equality", 125 + 120 + 115 == 360),
    ("392(1) strict range endpoints", (abs(70-80), min(150, 360-150, 180)) == (10, 150)),
    ("392(2) strict range endpoints", (abs(100-120), min(220, 360-220, 180)) == (20, 140)),
    ("396 exact cosine from squared lengths", (F(2)-2*F(1, 2))/F(2) == F(1, 2)),
    ("397 squared distance coefficient", F(1)-F(1, 3) == F(2, 3)),
    ("397 alternative coefficient squares", F(6, 9) == F(2, 3)),
    ("398 squared normal component", F(1)-2*F(1, 4) == F(1, 2)),
    ("402(1) convex total obstruction", 80+130+70+100 == 380 and 380 > 360),
    ("402(2) polygon inequality obstruction", 160 > 10+20+40+80),
    ("403 single dihedral cosine", (F(1, 2)-F(1, 4))/F(3, 4) == F(1, 3)),
    ("403 opposite-edge direction dot product", F(1, 3)-F(2, 3) == -F(1, 3)),
    ("403 doubled dihedral cosine", (-F(1, 3)-F(1, 4))/F(3, 4) == -F(7, 9)),
    ("403 double-angle identity", 2*F(1, 3)**2-1 == -F(7, 9)),
]
for angles in [(80, 130, 100), (70, 100, 100)]:
    checks.append((
        f"402(1) nonconvex construction trihedral {angles}",
        all(0 < angle < 180 and angle < sum(angles)-angle for angle in angles)
        and sum(angles) < 360,
    ))

def ray_distances_squared(point):
    norm = sum(F(coordinate)**2 for coordinate in point)
    return [norm - max(F(coordinate), F(0))**2 for coordinate in point]

def line_distances_squared(point):
    norm = sum(F(coordinate)**2 for coordinate in point)
    return [norm - F(coordinate)**2 for coordinate in point]

checks.extend([
    ("399 polar cone point is ray-equidistant",
     ray_distances_squared((-1, -1, -1)) == [F(3)]*3),
    ("399 positive equal-projection ray point",
     ray_distances_squared((1, 1, 1)) == [F(2)]*3),
    ("399 mixed-sign supporting-line locus point",
     line_distances_squared((1, 1, -1)) == [F(2)]*3),
    ("399 same mixed-sign point fails ray equality",
     ray_distances_squared((1, 1, -1)) == [F(2), F(2), F(3)]),
])
a = (F(0), F(0), F(1))
b = (F(3), F(0), F(1))
c = (F(2), F(2), F(1))
d = (F(0), F(1), F(1))
t, s = F(5, 8), F(1, 4)
o_ac = tuple(t*x+(1-t)*y for x, y in zip(a, c))
o_bd = tuple(s*x+(1-s)*y for x, y in zip(b, d))
new_ac = tuple(2*t*x+2*(1-t)*y for x, y in zip(a, c))
new_bd = tuple(2*s*x+2*(1-s)*y for x, y in zip(b, d))
checks.append(("404 exact concrete positive midpoint construction",
               0 < t < 1 and 0 < s < 1 and o_ac == o_bd
               and new_ac == new_bd == tuple(2*x for x in o_ac)))
arithmetic_errors = [label for label, passed in checks if not passed]
print(json.dumps({
    "schema": "n41-answer-author/structural-and-arithmetic-check@1",
    "status": "fail" if errors or arithmetic_errors else "pass",
    "structure": {"status": "fail" if errors else "pass", "errors": errors},
    "exactArithmetic": {
        "status": "fail" if arithmetic_errors else "pass",
        "checks": [{"name": label, "passed": passed} for label, passed in checks],
        "errors": arithmetic_errors,
    },
    "proofLimit": (
        "The current validator checks schema, identity/order and grading structure. "
        "Fraction arithmetic and examples do not prove the general mathematical arguments "
        "or settle the 399/402 intended conventions. No finalize or MathLive was invoked."
    ),
}, ensure_ascii=False, indent=2))
raise SystemExit(2 if errors or arithmetic_errors else 0)
