"""Read-only algorithm reproduction; no source/semantic review or finalization."""
import importlib.util
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent
CODE = OUT / "layout.prepatch.py"
PAGE = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c102-105/10c/pages/0102/page.png"
PREPARED = PAGE.with_name("layout.json")
DURABLE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0102"
spec = importlib.util.spec_from_file_location("layout_before", CODE)
layout = importlib.util.module_from_spec(spec)
spec.loader.exec_module(layout)


def bounds_json(bounds):
    return [[rows.start, rows.stop, columns.start, columns.stop]
            for rows, columns in bounds]


trace = []


def observe(frame, event, result):
    if frame.f_code.co_filename != str(CODE):
        return observe
    loc = frame.f_locals
    name = frame.f_code.co_name
    if event == "return" and name == "_single_fraction_row":
        a, b = loc["a"], loc["b"]
        if 820 <= a <= b <= 1032:
            remaining = loc.get("remaining")
            trace.append({
                "function": name, "a": a, "b": b, "line_h": loc["line_h"],
                "accepted": bool(result), "rules": loc["rules"],
                "remaining": [int(remaining[0]), int(remaining[-1])]
                if remaining is not None and remaining.size else [],
                "glyph_bounds": bounds_json(loc.get("glyph_bounds", [])),
                "cores": loc.get("cores", []),
            })
    if event == "return" and name == "_fraction_tail_split" and loc["a"] == 820:
        trace.append({"function": name, "a": loc["a"], "b": loc["b"], "cut": result})
    if event == "return" and name == "line_bands":
        trace.append({
            "function": name, "line_h": loc["line_h"], "glyph_h": loc["glyph_h"],
            "raw": loc["raw"], "joined": loc["joined"],
            "fraction_starts": sorted(loc["fraction_starts"]),
            "typical_h": loc["typical_h"], "typical_gap": loc["typical_gap"],
        })
    return observe


protected = [PAGE, PREPARED, DURABLE / "page.md", DURABLE / "page.json", DURABLE / "audit.json"]
hashes = {str(path.relative_to(ROOT)): layout.sha256_file(path) for path in protected}
with Image.open(PAGE) as image:
    if image.size != (1695, 2580):
        raise ValueError(f"Unexpected native dimensions: {image.size}")
    ink = layout.ink_mask(image)
cols = ink.any(axis=0).nonzero()[0]
content_w = int(cols[-1] - cols[0] + 1)
sys.settrace(observe)
bands = layout.line_bands(ink, content_w)
sys.settrace(None)
report = {
    "status": "pass" if len(bands) == 15 else "fail",
    "requirement_basis": "Human-supplied independent source reviewer and author: 14 body rows plus footer; ex375 is one tall nested-fraction row.",
    "expected_count": 15, "actual_count": len(bands), "bands": bands,
    "dimensions": [1695, 2580], "content_width": content_w,
    "code_path": str(CODE.relative_to(ROOT)), "code_sha256": layout.sha256_file(CODE),
    "protected_sha256": hashes,
    "unchanged": hashes == {str(path.relative_to(ROOT)): layout.sha256_file(path) for path in protected},
    "trace": trace,
    "image_ledger": {"model_opens": 0, "crops": 0, "generated_images": 0},
}
(OUT / "before.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2))
raise SystemExit(0 if report["status"] == "pass" else 1)
