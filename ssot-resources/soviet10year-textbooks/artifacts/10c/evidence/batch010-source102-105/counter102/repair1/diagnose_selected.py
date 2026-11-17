"""One comparison of the two unresolved integrations, with no direct recognizer checks."""
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[5]


def load(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


fixtures = load(HERE / "test.before-repair.py", "selected_fixtures")
results = []
for version, code in (
    ("original_prepatch", HERE.parent / "layout.prepatch.py"),
    ("before_repair", HERE / "layout.before-repair.py"),
):
    layout = load(code, version)
    for name, peripheral in (
        ("nested_fraction", False),
        ("nested_fraction_detached_singleton", True),
    ):
        ink = fixtures.fraction(nested=True, peripheral=peripheral)
        original = ink.copy()
        stages = []
        state = None

        def trace(frame, event, result):
            global state
            if frame.f_code.co_filename != str(code) or frame.f_code.co_name != "line_bands":
                return trace
            loc = frame.f_locals
            if event == "line" and "line_h" in loc:
                current = (loc["line_h"], loc.get("glyph_h"))
                if current != state:
                    stages.append({
                        "line": frame.f_lineno, "line_h": current[0],
                        "glyph_h": current[1], "raw": list(loc["raw"]),
                        "glyph_heights": list(loc.get("glyph_heights", [])),
                    })
                    state = current
            if event == "return":
                stages.append({
                    "phase": "return", "line_h": loc.get("line_h"),
                    "glyph_h": loc.get("glyph_h"), "raw": loc.get("raw"),
                    "joined": loc.get("joined"), "typical_h": loc.get("typical_h"),
                    "typical_gap": loc.get("typical_gap"), "bands": result,
                })
            return trace

        sys.settrace(trace)
        try:
            bands = layout.line_bands(ink, ink.shape[1])
        finally:
            sys.settrace(None)
        results.append({
            "version": version, "case": name, "expected_count": 1,
            "actual_count": len(bands), "bands": bands, "trace": stages,
            "array_unchanged": bool(np.array_equal(ink, original)),
            "fixture_sha256": layout.hashlib.sha256(ink.tobytes()).hexdigest(),
            "code": str(code.relative_to(ROOT)), "code_sha256": layout.sha256_file(code),
        })

report = {
    "status": "diagnostic comparison complete",
    "integration_executions": 4,
    "direct_recognizer_executions": 0,
    "physical_page_executions": 0,
    "negative_case_executions": 0,
    "requirement_basis": "Authored nested fraction geometry: one print row. Parent-supplied independently reviewed physical-page count is not rechecked here.",
    "results": results,
    "image_ledger": {"model_opens": 0, "crops": 0},
}
(HERE / "comparison.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2))
