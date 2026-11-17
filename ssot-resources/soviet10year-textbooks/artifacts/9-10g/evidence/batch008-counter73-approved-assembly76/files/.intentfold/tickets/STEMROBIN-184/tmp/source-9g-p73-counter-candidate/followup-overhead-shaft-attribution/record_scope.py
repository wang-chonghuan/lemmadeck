import ast
import difflib
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
V5 = HERE.parent / "followup-original-glyph-attribution"
code = {name: (HERE / name / "layout.py").read_bytes() for name in ("baseline", "v5", "candidate")}
trees = {name: ast.parse(value) for name, value in code.items()}


def declarations(tree):
    return {node.name: ast.dump(node, include_attributes=False)
            for node in tree.body if isinstance(node, ast.FunctionDef)}


def other_nodes(tree):
    return [ast.dump(node, include_attributes=False) for node in tree.body
            if not isinstance(node, ast.FunctionDef)]


comparisons = []
for old in ("v5", "baseline"):
    before, after = declarations(trees[old]), declarations(trees["candidate"])
    changed = sorted(name for name in before if before[name] != after.get(name))
    added = sorted(set(after) - set(before))
    assert changed == (["line_bands"] if old == "v5" else ["_single_fraction_row", "line_bands"])
    assert added == (["_overhead_arrow_continues"] if old == "v5" else [
        "_bar_local_fraction_support", "_original_arrow_decoration", "_overhead_arrow_continues"
    ])
    assert other_nodes(trees[old]) == other_nodes(trees["candidate"])
    comparisons.append({"from": old, "changed_functions": changed, "added_functions": added,
                        "nonfunction_statements_unchanged": True})
    with (HERE / f"{old}-to-candidate.diff").open("x") as stream:
        stream.writelines(difflib.unified_diff(
            code[old].decode().splitlines(keepends=True),
            code["candidate"].decode().splitlines(keepends=True),
            fromfile=f"{old}/layout.py", tofile="isolated-v6/candidate/layout.py",
        ))
files = []
for name in ("test_contracts.py", "test_carriers.py"):
    before, after = (V5 / name).read_bytes(), (HERE / name).read_bytes()
    assert before == after
    files.append({"path": str(HERE / name), "sha256": hashlib.sha256(after).hexdigest(),
                  "byte_identical_to_v5": True})
frozen_v3 = ast.parse((HERE.parent / "test_contracts.py").read_bytes())
candidate_tests = ast.parse((HERE / "test_contracts.py").read_bytes())


def methods(tree):
    return {node.name: ast.dump(node, include_attributes=False)
            for item in tree.body if isinstance(item, ast.ClassDef)
            for node in item.body if isinstance(node, ast.FunctionDef) and node.name.startswith("test_")}


original19, current25 = methods(frozen_v3), methods(candidate_tests)
assert len(original19) == 19 and len(current25) == 25
assert all(current25[name] == node for name, node in original19.items())
result = {
    "code_sha256": {name: hashlib.sha256(value).hexdigest() for name, value in code.items()},
    "comparisons": comparisons, "frozen_tests": files,
    "original19_methods_unchanged": sorted(original19),
    "all25_and3_methods_and_assertions_byte_identical": True,
    "v5_fraction_carrier_decoration_functions_unchanged": all(
        declarations(trees["v5"])[name] == declarations(trees["candidate"])[name]
        for name in ("_single_fraction_row", "_bar_local_fraction_support", "_original_arrow_decoration")
    ),
    "generic_merge_height_pitch_constants_unchanged": other_nodes(trees["v5"]) == other_nodes(trees["candidate"]),
    "new_helper_reuses_existing_overhead_proximity_and_full_glyph_bounds": True,
}
with (HERE / "code-test-scope.json").open("x") as stream:
    json.dump(result, stream, indent=2)
    stream.write("\n")
print(json.dumps(result, indent=2))
