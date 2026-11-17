import ast
import hashlib
import json
import sys
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
MODE = sys.argv[1]


def declarations(file):
    tree = ast.parse(file.read_bytes())
    body = []
    for node in tree.body:
        if isinstance(node, ast.Assign) and any(
            isinstance(target, ast.Name) and target.id == "suite" for target in node.targets
        ):
            break
        body.append(node)
    namespace = {"__file__": str(file), "__name__": file.stem}
    before = sys.argv
    sys.argv = [str(file), "v6"]
    try:
        exec(compile(ast.Module(body=body, type_ignores=[]), str(file), "exec"), namespace)
    finally:
        sys.argv = before
    return namespace


contracts = declarations(HERE / "test_contracts.py")
if MODE == "affected":
    suite = unittest.TestSuite([
        contracts["FractionContracts"]("test_adjacent_small_vector_prose_rows_remain_two")
    ])
elif MODE == "full":
    carriers = declarations(HERE / "test_carriers.py")
    boundaries = declarations(HERE / "test_projection_boundaries.py")
    suite = unittest.TestSuite([
        unittest.defaultTestLoader.loadTestsFromTestCase(contracts["FractionContracts"]),
        unittest.defaultTestLoader.loadTestsFromTestCase(carriers["AcceptedCarrierContracts"]),
        unittest.defaultTestLoader.loadTestsFromTestCase(boundaries["ProjectionIdentityContracts"]),
    ])
else:
    raise ValueError("Expected affected or full")
decisions = []


def trace(frame, event, result):
    if frame.f_code.co_filename != str(HERE / "candidate/layout.py"):
        return None
    if event == "return" and frame.f_code.co_name == "_overhead_arrow_continues":
        local = frame.f_locals
        decisions.append({
            "function": "_overhead_arrow_continues", "result": bool(result),
            "previous": [local["prev_a"], local["prev_b"]],
            "body": [local["a"], local["b"]], "glyph_h": local["glyph_h"],
            "content_width": local["content_w"],
            "original_ids": [int(value) for value in local.get("original_ids", [])],
        })
    return trace


sys.settrace(trace)
try:
    result = unittest.TextTestRunner(verbosity=2).run(suite)
finally:
    sys.settrace(None)
summary = {
    "mode": MODE, "candidate_sha256": hashlib.sha256((HERE / "candidate/layout.py").read_bytes()).hexdigest(),
    "tests_run": result.testsRun, "passed": result.wasSuccessful(),
    "failures": [{"test": str(test), "traceback": text} for test, text in result.failures],
    "errors": [{"test": str(test), "traceback": text} for test, text in result.errors],
    "skipped": [{"test": str(test), "reason": reason} for test, reason in result.skipped],
    "frozen_tests": [{
        "path": str(HERE / name), "sha256": hashlib.sha256((HERE / name).read_bytes()).hexdigest()
    } for name in ("test_contracts.py", "test_carriers.py")],
}
with (HERE / f"tests-{MODE}-v6.json").open("x") as stream:
    json.dump(summary, stream, indent=2)
    stream.write("\n")
with (HERE / f"projection-decisions-{MODE}-v6.json").open("x") as stream:
    json.dump(decisions, stream, indent=2)
    stream.write("\n")
print(json.dumps(summary, indent=2))
sys.exit(0 if result.wasSuccessful() else 1)
