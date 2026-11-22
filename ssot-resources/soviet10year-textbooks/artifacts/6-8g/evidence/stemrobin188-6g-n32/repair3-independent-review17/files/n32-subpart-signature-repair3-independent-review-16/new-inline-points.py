"""One new, renderer-free counterexample against immutable repair2/repair3."""

import ast
import hashlib
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OUT = Path(__file__).resolve().parent
SNAPSHOTS = {
    "repair2": ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n32-subpart-signature-repair2-16/edition.repair2.py",
    "repair3": ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n32-subpart-signature-repair3-16/edition.repair3.py",
}
FUNCTIONS = {
    "math_signature", "number_signature", "masked_math", "nesting_depths",
    "marker_order", "numbered_subpart_markers", "structural_subpart_markers",
    "canonical_subpart_labels", "normalize_numbered_subparts", "validate_text",
}
CONSTANTS = {
    "MATH", "MATH_TEXT_LITERAL", "MATH_BOUNDARY_PUNCTUATION", "PART_MARKER",
    "LATIN_PARTS", "CYRILLIC_PARTS", "CYRILLIC", "NUMBER",
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def unexpected_renderer(*args, **kwargs):
    raise AssertionError("Pure validation must not call any math renderer.")


def selected_namespace(path):
    tree = ast.parse(path.read_text(), filename=str(path))
    selected = [
        node for node in tree.body
        if (
            isinstance(node, ast.FunctionDef) and node.name in FUNCTIONS
        ) or (
            isinstance(node, ast.Assign)
            and any(isinstance(target, ast.Name) and target.id in CONSTANTS
                    for target in node.targets)
        )
    ]
    namespace = {"re": re, "katex_validate": unexpected_renderer}
    exec(compile(ast.Module(body=selected, type_ignores=[]), str(path), "exec"), namespace)
    return namespace


def child():
    source = "12. Points: (a) and (b) are distinct."
    modern = "12. Points: (1) and (2) are distinct."
    results = {}
    for name, path in SNAPSHOTS.items():
        ns = selected_namespace(path)
        results[name] = {
            "errors": ns["validate_text"](source, modern, ["layout"], [], "exercise", []),
            "discovered_source_labels": [
                m.group("label") for m in ns["numbered_subpart_markers"](source)
            ],
            "discovered_modern_labels": [
                m.group("label") for m in ns["numbered_subpart_markers"](modern)
            ],
            "structural_source_labels": [
                m.group("label") for m in ns["structural_subpart_markers"](source)
            ],
            "structural_modern_labels": [
                m.group("label") for m in ns["structural_subpart_markers"](modern)
            ],
            "canonical_source": ns["canonical_subpart_labels"](source),
            "canonical_modern": ns["canonical_subpart_labels"](modern),
            "raw_source_numbers": ns["number_signature"](source),
            "raw_modern_numbers": ns["number_signature"](modern),
        }
    regression = bool(results["repair2"]["errors"]) and not results["repair3"]["errors"]
    print(json.dumps({
        "case_id": "colon_inline_point_identifiers_with_nonempty_prose",
        "source": source,
        "modern": modern,
        "changes": ["layout"],
        "numeric_changes": [],
        "required": "Reject ordinary point-identifier numeric substitution outside structural task labels.",
        "results": results,
        "new_false_acceptance": regression,
        "cases": 1,
        "image_loads": 0,
        "renderer_calls": 0,
        "native_calls": 0,
        "producer_calls": 0,
    }, ensure_ascii=True, indent=2))
    return 1 if regression else 0


def parent():
    receipt = OUT / "new-inline-points.execution.json"
    stdout = OUT / "new-inline-points.stdout.txt"
    stderr = OUT / "new-inline-points.stderr.txt"
    if any(p.exists() for p in (receipt, stdout, stderr)):
        raise SystemExit("Preserved evidence exists; refusing to repeat this new case.")
    argv = [
        str(ROOT / ".claude/skills/ld-s10y-lesson/.venv/bin/python"),
        "-B", str(Path(__file__).resolve()), "--child",
    ]
    started = datetime.now(timezone.utc).isoformat()
    result = subprocess.run(argv, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    finished = datetime.now(timezone.utc).isoformat()
    for path, content in ((stdout, result.stdout), (stderr, result.stderr)):
        with path.open("xb") as stream:
            stream.write(content)
    record = {
        "cwd": str(ROOT),
        "argv": argv,
        "startedAt": started,
        "finishedAt": finished,
        "exitCode": result.returncode,
        "codeHashes": {name: sha(path) for name, path in SNAPSHOTS.items()},
        "streams": {
            "stdout": {"path": str(stdout), "sha256": sha(stdout)},
            "stderr": {"path": str(stderr), "sha256": sha(stderr)},
        },
        "launcherSHA256": sha(Path(__file__).resolve()),
        "pureValidationOnly": True,
        "cases": 1,
        "passedTestsRerun": 0,
        "imageAttemptsAdded": 0,
        "activeExecSessions": [],
    }
    with receipt.open("x", encoding="utf-8") as stream:
        json.dump(record, stream, indent=2)
        stream.write("\n")
    print(json.dumps(record, indent=2))
    print(result.stdout.decode())
    if result.stderr:
        print(result.stderr.decode(), file=sys.stderr)
    return result.returncode


raise SystemExit(child() if sys.argv[1:] == ["--child"] else parent())
