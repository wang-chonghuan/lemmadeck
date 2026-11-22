import ast
import json
import re
from pathlib import Path


BASE = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
RECOVERY = BASE / ".intentfold/tickets/STEMROBIN-188/tmp/n32-modern-technical-recovery-16"


def scoped_namespace(path):
    tree = ast.parse(path.read_text(), filename=str(path))
    declarations = {}
    for node in tree.body:
        if isinstance(node, ast.FunctionDef):
            declarations[node.name] = node
        elif isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name):
                    declarations[target.id] = node
    wanted = {
        "normalize_numbered_subparts", "validate_text", "number_signature",
    }
    if "canonical_subpart_labels" in declarations:
        wanted.update({"canonical_subpart_labels", "numbered_subpart_markers"})
    pending = list(wanted)
    while pending:
        name = pending.pop()
        for referenced in ast.walk(declarations[name]):
            if (
                isinstance(referenced, ast.Name)
                and isinstance(referenced.ctx, ast.Load)
                and referenced.id in declarations
                and referenced.id not in wanted
            ):
                wanted.add(referenced.id)
                pending.append(referenced.id)
    selected = [
        ast.ImportFrom(
            module="__future__",
            names=[ast.alias(name="annotations")],
            level=0,
        )
    ]
    selected.extend(node for node in tree.body if any(
        node is declarations[name] for name in wanted
    ))
    module = ast.fix_missing_locations(ast.Module(body=selected, type_ignores=[]))
    namespace = {"re": re}
    exec(compile(module, str(path), "exec"), namespace)
    return namespace


before = scoped_namespace(RECOVERY / "edition.before-this-patch.reconstructed.py")
after = scoped_namespace(RECOVERY / "edition.after-this-patch.py")
cases = [
    {
        "id": "missing_label_replaced_by_plain_number",
        "source": "12. a) Draw a circle; b) Name its center.",
        "modern": "12.\n1) Draw a circle; Name its center, step 2.",
        "required": "Reject the missing second subpart and undeclared new problem number.",
    },
    {
        "id": "duplicate_extra_label_replaces_real_data",
        "source": "12. a) Red; b) 3 blue; c) Green.",
        "modern": "12.\n1) Red;\n2) Blue;\n3) Green;\n3) Green.",
        "required": "Reject duplicate/extra subparts and removal of the real data value 3.",
    },
    {
        "id": "figure_number_replaces_missing_label",
        "source": "12. a) Trace the line; b) Mark its end.",
        "modern": "12.\n1) Trace the line; See Figure2) for its end.",
        "required": "Reject a missing second subpart; a figure number is not its label.",
    },
    {
        "id": "parenthesized_point_identifiers_are_not_a_list",
        "source": "12. Consider the points (a) and (b).",
        "modern": "12. Consider the points (1) and (2).",
        "required": "Reject undeclared new point identifiers; there is no subpart list.",
    },
]
failures = []
for case in cases:
    result = dict(case)
    for name, namespace in [("before", before), ("after", after)]:
        normalize = namespace["normalize_numbered_subparts"]
        canonicalize = namespace.get("canonical_subpart_labels", lambda text: text)
        source = canonicalize(normalize(case["source"]))
        modern = canonicalize(normalize(case["modern"]))
        errors = namespace["validate_text"](
            case["source"], case["modern"], ["layout"], [], "exercise", []
        )
        result[name] = {
            "errors": errors,
            "canonical_source": source,
            "canonical_modern": modern,
            "source_numbers": namespace["number_signature"](source),
            "modern_numbers": namespace["number_signature"](modern),
        }
    markers = after["numbered_subpart_markers"]
    result["source_marker_labels"] = [
        match.group("label") for match in markers(case["source"])
    ]
    result["modern_marker_labels"] = [
        match.group("label") for match in markers(case["modern"])
    ]
    result["new_false_acceptance"] = bool(result["before"]["errors"]) and not result["after"]["errors"]
    print(json.dumps(result, sort_keys=True))
    if not result["after"]["errors"]:
        failures.append(case["id"])
print(json.dumps({
    "cases": len(cases),
    "required_rejections_not_met": failures,
    "producer_calls": 0,
    "image_loads": 0,
}, sort_keys=True))
raise SystemExit(1 if failures else 0)
