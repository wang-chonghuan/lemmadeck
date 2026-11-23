"""Bind the verified private delta without changing a live artifact."""
import ast
import copy
import hashlib
import json
from pathlib import Path


OWN = Path(__file__).resolve().parent
ROOT = OWN.parents[1]
BASE = OWN / "layout.original.py"
CANDIDATE = OWN / "layout.py"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dump(node):
    return ast.dump(node, include_attributes=False)


old = ast.parse(BASE.read_text())
new = ast.parse(CANDIDATE.read_text())
old_other = [node for node in old.body if not (
    isinstance(node, ast.FunctionDef) and node.name == "line_bands"
)]
new_other = [node for node in new.body if not (
    isinstance(node, ast.FunctionDef) and node.name == "line_bands"
)]
assert list(map(dump, old_other)) == list(map(dump, new_other))
old_function = next(node for node in old.body if isinstance(
    node, ast.FunctionDef
) and node.name == "line_bands")
new_function = next(node for node in new.body if isinstance(
    node, ast.FunctionDef
) and node.name == "line_bands")
old_rule = next(node for node in old_function.body if isinstance(
    node, ast.For
) and dump(node.target) == dump(ast.parse("index, (a, b)", mode="eval").body))
new_rule = next(node for node in new_function.body if isinstance(
    node, ast.For
) and dump(node.target) == dump(ast.parse("index, (a, b)", mode="eval").body))
normalized = copy.deepcopy(new_rule)
normalizations = 0
for node in ast.walk(normalized):
    if isinstance(node, ast.ListComp) and isinstance(node.elt, ast.Name) and node.elt.id == "c":
        for value in ast.walk(node):
            if (
                isinstance(value, ast.BinOp)
                and isinstance(value.op, ast.Mult)
                and isinstance(value.left, ast.Constant) and value.left.value == 0.5
                and isinstance(value.right, ast.Name) and value.right.id == "body_h"
            ):
                value.left.value = 0.75
                normalizations += 1
assert normalizations == 1
assert dump(old_rule) == dump(normalized), "Unexpected classifier predicate change"
outcomes = json.loads((OWN / "candidate-02/results.json").read_text())
assert outcomes["candidate_sha256"] == sha(CANDIDATE)
assert sha(CANDIDATE) == sha(OWN / "candidate-02/layout.py")
assert outcomes["base_sha256"] == sha(BASE)
assert outcomes["protected_bindings_unchanged"]
assert all(
    not result["failures"] and not result["errors"] and not result["skips"]
    for result in outcomes["tests"].values()
)
live = ROOT / ".claude/skills/ld-s10y-lesson/tools/layout.py"
assert sha(live) == sha(BASE)
assert sha(BASE) == "8cb92aec54903cec817cec5c0f4fa29502e6f16ffc3919b7052ef217ed4d9e8d"
first = json.loads((OWN / "baseline/results.json").read_text())
source_md = "ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0060/page.md"
source_png = ".tmp/ld-s10y-lesson/8p/pages/0060/page.png"
assert first["bindings_before"][source_png] == outcomes["bindings_after"][source_png]
assert sha(ROOT / source_md) == outcomes["bindings_after"][source_md]
assert sha(ROOT / source_png) == outcomes["bindings_after"][source_png]
summary = {
    "technical_counter": "PASS",
    "candidate_path": str(CANDIDATE),
    "candidate_sha256": sha(CANDIDATE),
    "base_sha256": sha(BASE),
    "diff_path": str(OWN / "candidate-02/candidate.diff"),
    "diff_sha256": sha(OWN / "candidate-02/candidate.diff"),
    "results_sha256": sha(OWN / "candidate-02/results.json"),
    "outside_line_bands_AST_identical": True,
    "all_original_separator_predicates_identical_except_body_edge_fragment_height": True,
    "body_edge_fragment_height_old_new": [0.75, 0.5],
    "source_png_unchanged": True,
    "source_md_entry_sha256": first["bindings_before"][source_md],
    "source_md_verified_sha256": outcomes["bindings_after"][source_md],
    "source_md_change_owner": "Parent explicitly reported p-to-named-foot change; no worker write",
    "source_and_finalize_bindings_unchanged_during_verified_run": True,
    "visual_image_payloads_viewed": 1,
    "visual_image_limit": 2,
    "visual_image": str(ROOT / source_png),
    "numerical_original_PDF_fixture_pages": [60, 31, 54],
    "tests": outcomes["tests"],
    "shared_suite": "Not run; historical 4 failures/2 skips are not re-proven or claimed green",
    "scope": "Technical counter PASS only; parent applies exact delta and finalizes",
}
(OWN / "verified.json").write_text(json.dumps(summary, indent=2) + "\n")
paths = sorted(
    str(path.relative_to(ROOT)) for path in OWN.rglob("*") if path.is_file()
)
(OWN / "owned-paths.json").write_text(json.dumps(paths, indent=2) + "\n")
print(json.dumps({
    key: summary[key] for key in (
        "technical_counter", "candidate_sha256", "diff_sha256",
        "results_sha256", "outside_line_bands_AST_identical",
        "source_png_unchanged", "source_md_verified_sha256",
    )
}, indent=2))
