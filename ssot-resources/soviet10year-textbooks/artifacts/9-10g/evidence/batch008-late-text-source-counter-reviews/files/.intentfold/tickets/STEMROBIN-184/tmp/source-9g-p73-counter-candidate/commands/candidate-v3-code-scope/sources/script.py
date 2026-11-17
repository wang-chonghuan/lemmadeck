import ast
import difflib
import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
old_bytes = (HERE / "baseline/layout.py").read_bytes()
new_bytes = (HERE / "candidate/layout.py").read_bytes()
old = ast.parse(old_bytes)
new = ast.parse(new_bytes)


def declarations(tree):
    return {node.name: ast.dump(node, include_attributes=False)
            for node in tree.body if isinstance(node, ast.FunctionDef)}


before, after = declarations(old), declarations(new)
changed = sorted(name for name in before if before[name] != after.get(name))
added = sorted(set(after) - set(before))
old_other = [ast.dump(node, include_attributes=False) for node in old.body
             if not isinstance(node, ast.FunctionDef)]
new_other = [ast.dump(node, include_attributes=False) for node in new.body
             if not isinstance(node, ast.FunctionDef)]
result = {
    "baseline_sha256": hashlib.sha256(old_bytes).hexdigest(),
    "candidate_sha256": hashlib.sha256(new_bytes).hexdigest(),
    "changed_functions": changed, "added_functions": added,
    "other_functions_unchanged": all(
        before[name] == after[name] for name in before if name not in changed
    ),
    "imports_constants_and_module_statements_unchanged": old_other == new_other,
    "compact_height_glyph_estimator_pitch_and_exclusions_unchanged": (
        before["line_bands"] == after["line_bands"]
        and before["counting_ink"] == after["counting_ink"]
    ),
}
assert changed == ["_single_fraction_row"]
assert added == ["_bar_local_fraction_support"]
assert old_other == new_other
with (HERE / "baseline-to-candidate.diff").open("x") as stream:
    stream.writelines(difflib.unified_diff(
        old_bytes.decode().splitlines(keepends=True),
        new_bytes.decode().splitlines(keepends=True),
        fromfile="baseline/layout.py (eb6fca6d)", tofile="candidate/layout.py",
    ))
with (HERE / "code-scope.json").open("x") as stream:
    json.dump(result, stream, indent=2)
    stream.write("\n")
print(json.dumps(result, indent=2))
