"""Resolve only the new isolated probe and exercise the changed expansion guard."""
import ast
import hashlib
import json
import subprocess
import sys
import types
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

sys.dont_write_bytecode = True
ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
BASE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12"
OUT = BASE / "owned-layout-review"
original = json.loads((OUT / "probe-results.json").read_text())
assert original["verdict"] == "REVISE"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def bind(path):
    return {"path": str(path), "sha256": sha(path.read_bytes())}


def write(name, text):
    path = OUT / name
    assert path.parent == OUT
    with path.open("x") as stream:
        stream.write(text)


tree = ast.parse((OUT / "review-probes.py").read_text())
definitions = ast.Module(
    body=[node for node in tree.body if isinstance(node, ast.FunctionDef)
          and node.name in {"canvas", "glyph_row", "fraction"}],
    type_ignores=[],
)
scope = {"np": np}
exec(compile(definitions, "synthetic_definitions", "exec"), scope)
canvas, glyph_row, fraction = (scope[name] for name in ("canvas", "glyph_row", "fraction"))
sources = {
    "candidate": (BASE / "staged-layout/layout.py").read_bytes(),
    "prior_affected_only": (BASE / "counter-repair/layout229-233-PASS.py").read_bytes(),
    "HEAD": subprocess.run(
        ["git", "show", "HEAD:.claude/skills/ld-s10y-lesson/tools/layout.py"],
        cwd=ROOT, check=True, capture_output=True,
    ).stdout,
}
modules = {}
for name, source in sources.items():
    module = types.ModuleType(name)
    exec(compile(source, name, "exec"), module.__dict__)
    modules[name] = module

isolated = canvas()
for top in (20, 60, 100):
    glyph_row(isolated, top, top + 20)
fraction(isolated, 170, 200, 260)
assert sha(isolated.tobytes()) == original["synthetic_probes"][-1]["mask_sha256"]
comparison = {name: module.line_bands(isolated, 500) for name, module in modules.items()}
assert comparison["candidate"] == comparison["HEAD"] == comparison["prior_affected_only"]
assert len(comparison["candidate"]) == 5

candidate = modules["candidate"]
candidate_ast = ast.parse(sources["candidate"])
line_function = next(node for node in candidate_ast.body
                     if isinstance(node, ast.FunctionDef) and node.name == "line_bands")
expansion = next(node for node in line_function.body if isinstance(node, ast.For)
                 and any(isinstance(item, ast.Name) and item.id == "system_rows"
                         for item in ast.walk(node)))
expansion_code = compile(ast.Module(body=[expansion], type_ignores=[]), "owned_expansion", "exec")


def guard_probe(name, mask, a, b, expected):
    input_hash = sha(mask.tobytes())
    predicate_calls = []

    def legacy_predicate(*args):
        predicate_calls.append(True)
        return candidate._single_fraction_row(*args)

    env = dict(candidate.__dict__)
    env.update({
        "ink": mask, "counts": mask.sum(axis=1), "merged": [(a, b)],
        "fraction_starts": set(), "typical_h": 20.0, "typical_gap": 15.0,
        "pitch": 35.0, "glyph_h": 20.0, "expanded": [],
        "_single_fraction_row": legacy_predicate,
    })
    exec(expansion_code, env)
    assert len(env["expanded"]) == expected
    assert sha(mask.tobytes()) == input_hash
    return {
        "case": name, "expected_from_geometry": expected, "actual": len(env["expanded"]),
        "system_rows": env["system_rows"], "legacy_predicate_calls": len(predicate_calls),
        "legacy_predicate_if_called": bool(candidate._single_fraction_row(mask, a, b, 20.0)),
        "input_unchanged": True, "mask_sha256": input_hash, "passed": True,
    }


mixed = canvas()
mixed[150:220, 100:112] = True
fraction(mixed, 170, 200, 260)
glyph_row(mixed, 198, 218)
positive = guard_probe("identified_fraction_plus_plain_system_keeps_two_rows", mixed, 150, 219, 2)
assert positive["system_rows"] == 2 and positive["legacy_predicate_calls"] == 0
assert positive["legacy_predicate_if_called"] is True
nested = canvas()
fraction(nested, 170, 200, 280)
fraction(nested, 212, 220, 260)
negative = guard_probe("unbraced_nested_outer_fraction_can_still_collapse", nested, 150, 244, 1)
assert negative["system_rows"] is None and negative["legacy_predicate_calls"] > 0

inline = isolated.copy()
glyph_row(inline, 160, 180, 100, 164)
inline_bands = candidate.line_bands(inline, 500)
assert len(inline_bands) == 4
assert modules["HEAD"].line_bands(inline, 500) == inline_bands
inline_probe = {
    "case": "three_prose_rows_then_fraction_with_inline_baseline_glyphs",
    "expected_from_geometry": 4, "actual": len(inline_bands), "passed": True,
    "bands": inline_bands, "HEAD_parity": True,
}

for item in original["input_bindings"]:
    assert sha(Path(item["path"]).read_bytes()) == item["sha256"]
for page in original["affected_source_preservation"]:
    assert sha(Path(page["source_pixel_input"]["path"]).read_bytes()) == page["source_pixel_input"]["sha256"]
    for item in page["source_outputs"]:
        assert sha(Path(item["path"]).read_bytes()) == item["sha256"]

report = {
    **original,
    "created_at_utc": datetime.now(timezone.utc).isoformat(),
    "verdict": "PASS",
    "findings": [],
    "review_locations": [
        {"file": str(BASE / "staged-layout/layout.py"), "line": 253,
         "assessment": "Self-contained local rule centres reproduce prior affected helper behavior; no undefined dependency."},
        {"file": str(BASE / "staged-layout/layout.py"), "line": 282,
         "assessment": "Empty rules produce an empty set without executing max; absent braces and absent fractions safely return None."},
        {"file": str(BASE / "staged-layout/layout.py"), "line": 628,
         "assessment": "Identified multi-row system bypasses a legacy predicate that would return True; one outer fraction still collapses."},
        {"file": str(BASE / "staged-layout/own.patch"), "line": 6,
         "assessment": "Exactly five owned hunks reconstruct the candidate from HEAD; unrelated helper and early guard excluded."},
    ],
    "focused_guard_probes": [positive, negative, inline_probe],
    "initial_probe_resolution": {
        "original_evidence": bind(OUT / "probe-results.json"),
        "spec_expected_rows_unchanged": 4, "actual_rows": 5,
        "exact_original_fixture_bands": comparison,
        "classification": "Pre-existing row-joining limitation, identical in HEAD and both saved modules; not caused by the owned helper/guard delta.",
        "failure_preserved": True, "same_passed_synthetic_cases_rerun": False,
        "initial_REVISE_is_a_preliminary_probe_status_not_final_code_verdict": True,
    },
    "residual_risks": [
        "Spanning thin components and 1.5-glyph centre clustering remain existing geometric heuristics, not semantic brace recognition.",
        "The original isolated fraction fixture splits identically in HEAD; retained as an existing limitation, not repaired or approved here.",
        "A nested-rule fixture with a solid spanning strip also remains at two rows identically in HEAD; its expected one row and failed record are preserved. A separate unbraced nested-fraction guard probe passes.",
        "Four missing historical pixel subcases remain skipped; source counts 229=22, 233=23, 238=25 and their prior PASS gates are inherited, not re-reviewed.",
        "Existing test receipts bind commands and stream hashes; they are not cryptographic runtime attestations of imported module bytes.",
    ],
    "review_scripts": [bind(OUT / "review-probes.py"), bind(OUT / "finish-review.py")],
    "technical_probe_failure": bind(OUT / "finish-review-FIRST-failure.json"),
    "additional_existing_fixture_limitation": bind(OUT / "finish-review-SECOND-failure.json"),
}
write("owned-layout-review.json", json.dumps(report, indent=2) + "\n")
write("owned-layout-review.md", """# Owned Layout Review

PASS for the self-containment/guard delta only. No new actionable findings.

- staged-layout/layout.py:253-307: local outer-rule centres match the prior affected helper on six independent geometry cases. No unstaged helper dependency; no-brace, no-rule and empty inputs return None safely.
- staged-layout/layout.py:628-638: a braced fraction plus a separate full equation stays at two rows even when the unchanged legacy predicate would return True; a single nested outer fraction still uses that predicate and collapses to one.
- staged-layout/own.patch:6: exactly five owned hunks reconstruct the candidate from HEAD. All other existing helpers match HEAD. The dirty user helper and its entire early guard match layout-before.py byte-for-byte and are absent from the candidate.

Candidate SHA-256: bfb8d1f5207d003b5bafeb9313a63ddc916d0c0d8fed44539a6f4a162fe9a1bd
Owned patch SHA-256: 6c9659b4839a54d4924db3d3ba3368ce59e7cc93856690dabf82a7e9dd5e6397

Reused the existing successful 59-test receipt with four historical skips; no unit test sources read and no suite rerun. Confirmed opaque source-pixel input and page.md/page.json/audit.json hashes unchanged for 229, 233 and 238. Their independently confirmed counts 22, 23 and 25 remain inherited, not re-counted.

One exploratory isolated fraction fixture expected four total rows but returned five identically in HEAD, the prior saved module and the candidate. The original failure and expected value remain preserved. It is an existing row-joining limitation outside this delta, not a new finding. A separate inline-fraction fixture and focused positive/negative expansion-guard probes passed.

A second nested-rule fixture with a solid spanning strip expected one row but returned two identically in HEAD and both saved modules because the unchanged legacy predicate rejects that strip. Its failure is preserved separately. An unbraced nested outer fraction still collapses to one through the reviewed guard.

Staging condition: recheck the bound HEAD, candidate and own.patch immediately before staging only those hunks. Never stage the whole dirty layout.py or excluded-user.patch. No staging was performed. No source edits, image decoding/payloads, network, DB, .env, model, app, dependency, agent/chat, publish, merge, deploy or closure action. No whole-batch approval.
""")
manifest = {
    "ticket": "STEMROBIN-182", "verdict": "PASS",
    "reports": [bind(OUT / name) for name in (
        "owned-layout-review.json", "owned-layout-review.md", "probe-results.json",
        "review-probes.py", "finish-review.py", "finish-review-FIRST-failure.json",
        "finish-review-SECOND-failure.json",
    )],
}
write("report-hashes.json", json.dumps(manifest, indent=2) + "\n")
print(json.dumps({
    "verdict": "PASS", "new_findings": 0,
    "report": bind(OUT / "owned-layout-review.json"),
    "manifest": bind(OUT / "report-hashes.json"),
    "focused_guard_probes": report["focused_guard_probes"],
}))
