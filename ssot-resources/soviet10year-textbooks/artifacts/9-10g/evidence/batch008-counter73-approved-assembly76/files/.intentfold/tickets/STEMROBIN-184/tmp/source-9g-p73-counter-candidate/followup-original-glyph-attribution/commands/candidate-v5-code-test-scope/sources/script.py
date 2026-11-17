import ast
import difflib
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
files = {name: (HERE / name / "layout.py").read_bytes() for name in ("baseline", "v3", "candidate")}
trees = {name: ast.parse(value) for name, value in files.items()}


def functions(tree):
    return {node.name: ast.dump(node, include_attributes=False)
            for node in tree.body if isinstance(node, ast.FunctionDef)}


def nonfunctions(tree):
    return [ast.dump(node, include_attributes=False) for node in tree.body
            if not isinstance(node, ast.FunctionDef)]


comparisons = []
for old in ("baseline", "v3"):
    before, after = functions(trees[old]), functions(trees["candidate"])
    changed = sorted(name for name in before if before[name] != after.get(name))
    added = sorted(set(after) - set(before))
    result = {
        "from": old, "changed_functions": changed, "added_functions": added,
        "nonfunction_statements_unchanged": nonfunctions(trees[old]) == nonfunctions(trees["candidate"]),
    }
    assert changed == ["_single_fraction_row"]
    assert added == (["_bar_local_fraction_support", "_original_arrow_decoration"]
                     if old == "baseline" else ["_original_arrow_decoration"])
    assert result["nonfunction_statements_unchanged"]
    comparisons.append(result)
    with (HERE / f"{old}-to-followup.diff").open("x") as stream:
        stream.writelines(difflib.unified_diff(
            files[old].decode().splitlines(keepends=True),
            files["candidate"].decode().splitlines(keepends=True),
            fromfile=f"{old}/layout.py", tofile="followup/candidate/layout.py",
        ))
old_test = ast.parse((HERE.parent / "test_contracts.py").read_text())
new_test_bytes = (HERE / "test_contracts.py").read_bytes()
new_test = ast.parse(new_test_bytes)


def methods(tree):
    return {node.name: ast.dump(node, include_attributes=False)
            for item in tree.body if isinstance(item, ast.ClassDef)
            for node in item.body if isinstance(node, ast.FunctionDef) and node.name.startswith("test_")}


before, after = methods(old_test), methods(new_test)
assert len(before) == 19
assert all(after[name] == node for name, node in before.items())
for name in ("glyph", "arrow", "fraction", "opened_bounds", "supported"):
    assert functions(old_test)[name] == functions(new_test)[name]
v4_test = HERE / "commands/candidate-v4-contracts/sources/script.py"
assert v4_test.read_bytes() == new_test_bytes
result = {
    "code_sha256": {name: hashlib.sha256(value).hexdigest() for name, value in files.items()},
    "comparisons": comparisons,
    "approved19_methods_unchanged": sorted(before),
    "approved_fixture_and_support_helpers_unchanged": True,
    "all25_v4_test_methods_and_assertions_unchanged": v4_test.read_bytes() == new_test_bytes,
    "added_followup_methods": sorted(set(after) - set(before)),
    "bar_local_helper_unchanged_from_v3": functions(trees["v3"])["_bar_local_fraction_support"]
        == functions(trees["candidate"])["_bar_local_fraction_support"],
    "line_bands_counting_ink_glyph_and_pitch_functions_unchanged": all(
        functions(trees["baseline"])[name] == functions(trees["candidate"])[name]
        for name in functions(trees["baseline"]) if name != "_single_fraction_row"
    ),
}
with (HERE / "code-test-scope.json").open("x") as stream:
    json.dump(result, stream, indent=2)
    stream.write("\n")
print(json.dumps(result, indent=2))
