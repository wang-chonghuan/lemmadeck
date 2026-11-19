"""Read-only count diagnosis and one-shot native crops; no production writes."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck")
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))

import layout
import numpy as np
from PIL import Image

EXCLUSIONS = {
    "0035": [
        {"kind": "scan-artifact", "box": [0, 2350, 1695, 31],
         "reason": "Glyph-free bottom scan edge visible in original and new native ROI."},
    ],
    "0036": [
        {"kind": "scan-artifact", "box": [0, 1640, 60, 40],
         "reason": "Isolated left-edge blob, outside the approved table and body type."},
        {"kind": "scan-artifact", "box": [0, 1815, 75, 50],
         "reason": "Second isolated left-edge blob, outside the approved table and body type."},
    ],
    "0037": [
        {"kind": "scan-artifact", "box": [1540, 1800, 65, 45],
         "reason": "Right-edge blob below and separate from the one printed section heading."},
        {"kind": "scan-artifact", "box": [0, 2325, 1695, 56],
         "reason": "Glyph-free bottom scan edge; does not include the interior curved mark."},
    ],
}

# Windows locate visually identified rows, not a new classifier or count mask.
ROW_WINDOWS = {
    "0035": [
        (1, 1, [650, 250, 230, 65]),
        (2, 1, [140, 355, 220, 65]),
        (2, 2, [420, 425, 720, 70]),
        (2, 3, [420, 505, 720, 70]),
        (3, 1, [140, 590, 420, 65]),
        (3, 2, [465, 660, 550, 70]),
        (4, 1, [140, 745, 510, 65]),
        (4, 2, [420, 815, 630, 75]),
        (4, 3, [420, 895, 630, 75]),
        (5, 1, [140, 980, 230, 65]),
        (5, 2, [565, 1055, 370, 65]),
        (6, 1, [140, 1135, 1250, 65]),
        (6, 2, [245, 1210, 1145, 70]),
        (6, 3, [245, 1290, 340, 65]),
        (7, 1, [140, 1370, 1250, 65]),
        (7, 2, [245, 1450, 465, 65]),
        (8, 1, [140, 1525, 1250, 65]),
        (8, 2, [245, 1605, 270, 65]),
        (9, 1, [425, 1740, 640, 75]),
        (10, 1, [245, 1850, 1145, 65]),
        (10, 2, [145, 1925, 1245, 65]),
        (10, 3, [145, 2005, 1245, 65]),
        (10, 4, [145, 2080, 1145, 65]),
        (11, 1, [165, 2170, 150, 50]),
    ],
    "0036": [
        (1, 1, [590, 185, 870, 70]),
        (2, 1, [310, 265, 905, 70]),
        (2, 2, [510, 350, 640, 110]),
        (2, 3, [495, 480, 870, 115]),
        (3, 1, [215, 615, 220, 65]),
        (3, 2, [310, 695, 990, 110]),
        (3, 3, [595, 825, 775, 115]),
        (3, 4, [525, 960, 890, 115]),
        (3, 5, [525, 1090, 865, 120]),
        (4, 1, [310, 1225, 1150, 65]),
        (4, 2, [215, 1300, 925, 70]),
        (5, 1, [310, 1380, 760, 65]),
        (7, 1, [1290, 2165, 155, 50]),
    ],
    "0037": [
        (1, 1, [240, 170, 910, 60]),
        (2, 1, [235, 235, 1175, 65]),
        (2, 2, [155, 305, 1255, 60]),
        (2, 3, [155, 365, 190, 65]),
        (3, 1, [235, 435, 1085, 60]),
        (3, 2, [235, 500, 470, 60]),
        (3, 3, [230, 565, 435, 60]),
        (4, 1, [230, 630, 295, 60]),
        (4, 2, [595, 700, 350, 60]),
        (4, 3, [150, 765, 1260, 65]),
        (4, 4, [150, 830, 110, 55]),
        (5, 1, [230, 895, 1175, 65]),
        (5, 2, [150, 960, 1130, 65]),
        (5, 3, [675, 1030, 205, 55]),
        (6, 1, [235, 1090, 1170, 70]),
        (6, 2, [150, 1160, 940, 65]),
        (6, 3, [590, 1225, 345, 65]),
        (7, 1, [670, 1340, 205, 70]),
        (8, 1, [145, 1430, 410, 70]),
        (8, 2, [240, 1515, 635, 70]),
        (8, 3, [240, 1590, 805, 75]),
        (9, 1, [360, 1740, 800, 80]),
        (10, 1, [480, 1875, 560, 75]),
        (11, 1, [235, 1975, 460, 65]),
        (11, 2, [525, 2055, 330, 65]),
        (12, 1, [155, 2140, 155, 50]),
    ],
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def traced_bands(ink, content_w):
    snapshot = {}
    target = layout.line_bands.__code__

    def capture(frame, event, arg):
        if frame.f_code is not target:
            return None
        if event == "return":
            for key in (
                "line_h", "glyph_h", "typical_h", "typical_gap", "pitch",
                "raw", "joined", "expanded", "fraction_starts",
            ):
                value = frame.f_locals.get(key)
                if isinstance(value, set):
                    value = sorted(value)
                snapshot[key] = value
        return capture

    sys.settrace(capture)
    try:
        bands = layout.line_bands(ink, content_w)
    finally:
        sys.settrace(None)
    return bands, snapshot


def summarize_bands(ink, bands):
    result = []
    for index, (a, b) in enumerate(bands, 1):
        xs = np.flatnonzero(ink[a:b + 1].any(axis=0))
        result.append({
            "machine_row": index, "y_inclusive": [a, b],
            "ink_x_inclusive": [int(xs[0]), int(xs[-1])] if xs.size else None,
            "ink_pixels": int(ink[a:b + 1].sum()),
        })
    return result


def main():
    if sys.argv[1:] == ["--bounded-check"]:
        for page, rows in ROW_WINDOWS.items():
            source = ROOT / f".tmp/ld-s10y-lesson/9c/pages/{page}/page.png"
            canonical = ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/9c/pages/{page}"
            document = json.loads((canonical / "page.json").read_text())
            with Image.open(source) as image:
                ink = layout.ink_mask(image)
            columns = np.flatnonzero(ink.any(axis=0))
            content_w = int(columns[-1] - columns[0] + 1)
            masked = ink.copy()
            for figure in document["meta"]["figures"]:
                x, y, w, h = figure["box"]
                masked[y:y + h, x:x + w] = False
            candidate = layout.counting_ink(masked, EXCLUSIONS[page])
            bands, trace = traced_bands(candidate, content_w)
            located = []
            for row, (block, line, box) in enumerate(rows, 1):
                x, y, w, h = box
                yy, xx = np.nonzero(ink[y:y + h, x:x + w])
                located.append({
                    "row": row, "canonical_block_1based": block,
                    "logical_line_1based": line, "kind": document["blocks"][block - 1]["kind"],
                    "source_window_xywh": box,
                    "window_ink_y_inclusive": [y + int(yy.min()), y + int(yy.max())],
                    "window_ink_x_inclusive": [x + int(xx.min()), x + int(xx.max())],
                })
            print(json.dumps({
                "page": page, "exclusions": EXCLUSIONS[page],
                "counting_copy_result": len(bands),
                "bands": summarize_bands(candidate, bands),
                "trace": trace, "source_rowmap": located,
                "source_unchanged": digest(source) == document["meta"]["render"]["sha256"],
            }))
        return
    if sys.argv[1:] == ["--native-rois"]:
        output = ROOT / ".tmp/stemrobin-184-resume/9c-count3537-review/native-rois"
        output.mkdir(exist_ok=False)
        for page, box in (
            ("0035", [0, 2325, 1695, 56]),
            ("0036", [0, 1620, 150, 270]),
            ("0037", [350, 1715, 1280, 140]),
        ):
            source = ROOT / f".tmp/ld-s10y-lesson/9c/pages/{page}/page.png"
            x, y, w, h = box
            target = output / f"p{page}-native.png"
            with Image.open(source) as image:
                image.crop((x, y, x + w, y + h)).save(target)
            print(json.dumps({
                "page": page, "source_sha256": digest(source),
                "roi": str(target), "box_xywh": box, "sha256": digest(target),
                "operation": "native pixel crop only; no resize, enhancement or overlay",
            }))
        return
    if sys.argv[1:]:
        raise SystemExit("Supported options: --native-rois, --bounded-check")
    print(json.dumps({
        "checkout": str(ROOT),
        "layout_sha256": digest(ROOT / ".claude/skills/ld-s10y-lesson/tools/layout.py"),
        "p2c_sha256": digest(ROOT / ".claude/skills/ld-s10y-lesson/tools/p2c.py"),
        "contract_sha256": digest(ROOT / ".claude/skills/ld-s10y-lesson/SKILL.md"),
        "runtime": sys.executable,
        "method": "unchanged live line_bands, read-only; no expected-count parameter",
    }))
    for page in ("0035", "0036", "0037"):
        source = ROOT / f".tmp/ld-s10y-lesson/9c/pages/{page}/page.png"
        canonical = ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/9c/pages/{page}"
        document = json.loads((canonical / "page.json").read_text())
        audit = json.loads((canonical / "audit.json").read_text())
        with Image.open(source) as image:
            ink = layout.ink_mask(image)
        columns = np.flatnonzero(ink.any(axis=0))
        content_w = int(columns[-1] - columns[0] + 1)
        masked = ink.copy()
        for figure in document["meta"]["figures"]:
            x, y, w, h = figure["box"]
            masked[y:y + h, x:x + w] = False
        masked = layout.counting_ink(masked, document["meta"].get("count_exclusions", []))
        bands, trace = traced_bands(masked, content_w)
        print(json.dumps({
            "page": page, "source_sha256": digest(source),
            "canonical_sha256": {
                name: digest(canonical / name)
                for name in ("page.md", "page.json", "audit.json")
            },
            "content_w": content_w,
            "canonical_audit": audit,
            "bands": summarize_bands(masked, bands),
            "trace": trace,
        }, ensure_ascii=True))


if __name__ == "__main__":
    main()
