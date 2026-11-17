from __future__ import annotations

import argparse
import importlib.util
import json
import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
OUT = Path(__file__).parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
PAGES = {
    110: ("110-113", 22),
    114: ("114-117", 23),
    117: ("114-117", 25),
    118: ("118-121", 18),
    121: ("118-121", 20),
}


def load_layout(path):
    spec = importlib.util.spec_from_file_location("counter_layout", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def inputs(page):
    group, expected = PAGES[page]
    prep = OUT.parent / f"production-source10c{group}"
    png = prep / f"10c/pages/{page:04d}/page.png"
    record = OUT.parent / f"production-source10c{group}-first-finalize/{page:04d}"
    return png, record, expected


def trace_bands(layout, mask, width):
    state = {}
    stages = []

    def trace(frame, event, arg):
        if frame.f_code.co_name != "line_bands":
            return None
        if event == "line":
            text = source_lines[frame.f_lineno - 1].strip()
            if text in ("joined = []", "merged = []", "merged = expanded", "out = []"):
                stages.append({
                    "line": frame.f_lineno,
                    "statement": text,
                    "merged": frame.f_locals.get("merged"),
                    "joined": frame.f_locals.get("joined"),
                })
        if event == "return":
            state.update(frame.f_locals)
        return trace

    source_lines = Path(layout.__file__).read_text().splitlines()
    sys.settrace(trace)
    try:
        result = layout.line_bands(mask, width)
    finally:
        sys.settrace(None)
    return result, state, stages


def describe_components(layout, mask):
    labels, _ = ndimage.label(mask)
    result = []
    for cid, bounds in enumerate(ndimage.find_objects(labels), 1):
        if bounds is None:
            continue
        rows, cols = bounds
        part = labels[bounds] == cid
        widths = part.sum(axis=1)
        result.append({
            "id": cid,
            "xywh": [cols.start, rows.start, cols.stop-cols.start, rows.stop-rows.start],
            "area": int(part.sum()),
            "row_width_max": int(widths.max()),
            "row_width_median": float(np.median(widths)),
        })
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--label", required=True)
    parser.add_argument("--layout", type=Path, default=TOOLS / "layout.py")
    parser.add_argument("--preserve", action="store_true")
    args = parser.parse_args()
    if args.preserve:
        backup = OUT / "layout.before.py"
        if backup.exists():
            raise RuntimeError("Refuse to overwrite preserved layout")
        shutil.copy2(args.layout, backup)
    layout = load_layout(args.layout)
    report = {"layout": str(args.layout), "layout_sha256": layout.sha256_file(args.layout), "pages": []}
    for page in PAGES:
        png, record, expected = inputs(page)
        audit = json.loads((record / "audit.json").read_text())
        data = json.loads((record / "page.json").read_text())
        with Image.open(png) as img:
            mask = layout.ink_mask(img)
        if audit["figures"] or audit["count_exclusions"]:
            raise RuntimeError("Inspect actual figure/exclusion masking before proceeding")
        cols = np.flatnonzero(mask.any(axis=0))
        width = int(cols[-1] - cols[0] + 1) if cols.size else mask.shape[1]
        bands, state, stages = trace_bands(layout, mask, width)
        counting = state["ink"]
        band_details = []
        for a, b in bands:
            part = counting[a:b + 1]
            xs = np.flatnonzero(part.any(axis=0))
            band_details.append({
                "y": [a, b], "x": [int(xs[0]), int(xs[-1])],
                "height": b - a + 1, "area": int(part.sum()),
                "fraction": layout._single_fraction_row(counting, a, b, state["glyph_h"]),
                "fragments": layout._row_fragments(part, width),
                "body_rows": layout._supported_glyph_rows(part, layout._row_fragments(part, width), state["glyph_h"]),
            })
        entry = {
            "page": page, "source": str(png), "source_sha256": layout.sha256_file(png),
            "size": [mask.shape[1], mask.shape[0]], "content_width": width,
            "expected_independent": expected, "saved_detector": audit["lines_printed"],
            "saved_md_count": audit["lines_md"], "saved_page_json_keys": sorted(data),
            "count": len(bands), "line_h": state["line_h"], "glyph_h": state["glyph_h"],
            "typical_gap": state["typical_gap"], "pitch": state["pitch"],
            "raw": state["raw"], "joined": state["joined"],
            "fraction_starts": sorted(state["fraction_starts"]), "stages": stages,
            "bands": band_details, "components": describe_components(layout, counting),
            "files_sha256": {
                str(path): layout.sha256_file(path)
                for path in [png, *[record / name for name in ("before.md", "page.json", "audit.json", "stdout.txt")]]
            },
        }
        report["pages"].append(entry)
        print(f"{page}: saved {audit['lines_printed']}/{audit['lines_md']} reproduced {len(bands)} expected {expected}; line_h={state['line_h']} glyph_h={state['glyph_h']} gap={state['typical_gap']}")
        print("bands:", " ".join(f"{a['y']}x{a['x']}h{a['height']}" for a in band_details))
    (OUT / f"{args.label}.json").write_text(json.dumps(report, indent=2) + "\n")


if __name__ == "__main__":
    main()
