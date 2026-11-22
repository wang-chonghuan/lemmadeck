import ast
import datetime
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path


BASE = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
TMP = BASE / ".intentfold/tickets/STEMROBIN-188/tmp"
SNAPSHOTS = {
    "repair1": TMP / "n32-modern-technical-recovery-16/edition.after-this-patch.py",
    "repair2": TMP / "n32-subpart-signature-repair2-16/edition.repair2.py",
}
EXPECTED_HASHES = {
    "repair1": "ec0202f4ed6dfac891b4f0ae5dde391e4a3da9434b1e6f035c7066943926af85",
    "repair2": "5332783f83fb56b3cc2f7173ec2bf10712c59b795ae6ce455dd9149012d82381",
}
CASES = [
    {
        "id": "two_column_formula_list_layout_only",
        "source": "12. a) $x=1$\u3000\u3000b) $y=2$\n$x=3$\u3000\u3000$y=4$",
        "modern": "12.\na) $x=1$ $x=3$\nb) $y=2$ $y=4$",
    },
    {
        "id": "comma_separated_complete_list_layout_only",
        "source": "12. a) Draw a circle, b) Name its center.",
        "modern": "12.\na) Draw a circle,\nb) Name its center.",
    },
    {
        "id": "line_start_parenthesized_list_relabel",
        "source": "12.\n(a) Draw a circle;\n(b) Name its center.",
        "modern": "12.\n(1) Draw a circle;\n(2) Name its center.",
    },
]


def scoped_namespace(path):
    raw = path.read_bytes()
    tree = ast.parse(raw, filename=str(path))
    declarations = {}
    for node in tree.body:
        if isinstance(node, ast.FunctionDef):
            declarations[node.name] = node
        elif isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name):
                    declarations[target.id] = node
    wanted = {"validate_text", "normalize_numbered_subparts", "number_signature"}
    pending = list(wanted)
    while pending:
        name = pending.pop()
        for reference in ast.walk(declarations[name]):
            if (
                isinstance(reference, ast.Name)
                and isinstance(reference.ctx, ast.Load)
                and reference.id in declarations
                and reference.id not in wanted
            ):
                wanted.add(reference.id)
                pending.append(reference.id)
    selected = [
        ast.ImportFrom(
            module="__future__",
            names=[ast.alias(name="annotations")],
            level=0,
        )
    ]
    selected.extend(
        node for node in tree.body
        if any(node is declarations[name] for name in wanted)
    )
    module = ast.fix_missing_locations(ast.Module(body=selected, type_ignores=[]))
    namespace = {"re": re}
    exec(compile(module, str(path), "exec"), namespace)
    return namespace


def run_cases():
    namespaces = {}
    for name, path in SNAPSHOTS.items():
        assert hashlib.sha256(path.read_bytes()).hexdigest() == EXPECTED_HASHES[name]
        namespaces[name] = scoped_namespace(path)
    false_rejections = []
    for case in CASES:
        result = dict(case, required="accept layout-only complete list")
        for name, namespace in namespaces.items():
            normalize = namespace["normalize_numbered_subparts"]
            errors = namespace["validate_text"](
                case["source"], case["modern"], ["layout"], [], "exercise", []
            )
            result[name] = {
                "errors": errors,
                "normalized_source": normalize(case["source"]),
                "normalized_modern": normalize(case["modern"]),
                "discovered_source_labels": [
                    match.group("label")
                    for match in namespace["numbered_subpart_markers"](case["source"])
                ],
                "discovered_modern_labels": [
                    match.group("label")
                    for match in namespace["numbered_subpart_markers"](case["modern"])
                ],
            }
            if "structural_subpart_markers" in namespace:
                result[name]["structural_source_labels"] = [
                    match.group("label")
                    for match in namespace["structural_subpart_markers"](case["source"])
                ]
                result[name]["structural_modern_labels"] = [
                    match.group("label")
                    for match in namespace["structural_subpart_markers"](case["modern"])
                ]
        regression = not result["repair1"]["errors"] and bool(result["repair2"]["errors"])
        result["new_false_rejection"] = regression
        if regression:
            false_rejections.append(case["id"])
        print(json.dumps(result, sort_keys=True))
    print(json.dumps({
        "cases": len(CASES),
        "new_false_rejections": false_rejections,
        "image_loads": 0,
        "producer_calls": 0,
        "native_calls": 0,
        "render_calls": 0,
    }, sort_keys=True))
    return 1 if false_rejections else 0


if "--child" in sys.argv:
    raise SystemExit(run_cases())

argv = [sys.executable, "-B", str(Path(__file__).resolve()), "--child"]
started = datetime.datetime.now(datetime.timezone.utc).isoformat()
completed = subprocess.run(argv, cwd=BASE, text=True, capture_output=True)
ended = datetime.datetime.now(datetime.timezone.utc).isoformat()
print(json.dumps({
    "cwd": str(BASE),
    "argv": argv,
    "startedAt": started,
    "endedAt": ended,
    "exitCode": completed.returncode,
    "signal": None,
    "streams": {
        "stdout": {
            "text": completed.stdout,
            "sha256": hashlib.sha256(completed.stdout.encode()).hexdigest(),
        },
        "stderr": {
            "text": completed.stderr,
            "sha256": hashlib.sha256(completed.stderr.encode()).hexdigest(),
        },
    },
    "codeHashes": EXPECTED_HASHES,
    "pureValidationOnly": True,
}, indent=2, sort_keys=True))
raise SystemExit(completed.returncode)
