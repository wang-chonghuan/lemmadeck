import argparse
import json
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == ROOT
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import edition

parser = argparse.ArgumentParser()
parser.add_argument("--stage", choices=["before", "after"], required=True)
args = parser.parse_args()
cases = [
    (r"$u=U_м\cos\omega t$", r"$u=U_{\mathrm{m}}\cos\omega t$"),
    (r"$i=\frac{u}{R}=\frac{U_м\cos\omega t}{R}=I_м\cos\omega t$",
     r"$i=\frac{u}{R}=\frac{U_{\mathrm{m}}\cos\omega t}{R}=I_{\mathrm{m}}\cos\omega t$"),
    (r"$I_м=\frac{U_м}{R}$", r"$I_{\mathrm{m}}=\frac{U_{\mathrm{m}}}{R}$"),
]
equivalent = [edition.math_signature(left) == edition.math_signature(right) for left, right in cases]
assert equivalent == [args.stage == "after"] * 3
assert edition.math_signature(r"$u=U_м\cos\omega t$") != edition.math_signature(
    r"$u=2U_{\mathrm{m}}\cos\omega t$")
assert edition.math_signature(r"$i=I_м\cos\omega t$") != edition.math_signature(
    r"$i=I_{\mathrm{m}}\sin\omega t$")
assert edition.math_signature(r"$x_мz$") != edition.math_signature(r"$x_{\mathrm{m}}z$")
assert edition.math_signature(r"$x_ж$") != edition.math_signature(r"$x_{\mathrm{m}}$")
assert edition.math_signature(r"$U_m$") != edition.math_signature(r"$U_{\mathrm{m}}$")
assert edition.math_signature(r"$U_{\mathrm{м}}$") == edition.math_signature(r"$U_{\mathrm{m}}$")
print(json.dumps({
    "stage": args.stage, "status": "pass", "amplitudeEquivalence": equivalent,
    "numericAndFunctionChangesRemainDifferent": True,
    "unrelatedIdentifiersRemainDifferent": True,
    "existingUprightAliasPreserved": True,
}))
