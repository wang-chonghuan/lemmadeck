#!/usr/bin/env python3
"""Trace current row segmentation without changing extraction or production code."""

from __future__ import annotations

import argparse
import hashlib
import inspect
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

REPO = Path(__file__).resolve().parents[4]
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import layout

FACTS = {
    "0015": {
        "png_sha": "eb8a734d0f3823857b8fbc1f9c72eed5c40a7486fece8e80548e69cbf80a0a41",
        "layout_sha": "f46f916975450338d5fa463b039d281ed2d5fa5b1572c9e8300b563fa45a54a9",
        "regions": [
            ("sine-limit-source-row-14", 1438, 1506, 1),
            ("thus-and-limit-source-rows-20-21", 2016, 2225, 2),
        ],
    },
    "0016": {
        "png_sha": "ccecddca9bd0eee706caea1de7612167a0e164e446b2b7874bc592d3c0698340",
        "layout_sha": "93dfdbcd477649c6660995e6d5ad2ab3372754c49add4993ca7ff9834394e173",
        "regions": [
            ("parallel-limits-source-row-4", 540, 630, 1),
            ("parallel-limits-source-row-5", 677, 779, 1),
            ("parallel-limits-source-row-6", 803, 916, 1),
            ("cases-source-rows-10-11-control", 1209, 1370, 2),
        ],
    },
}


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def plain(value):
    if isinstance(value, np.ndarray):
        return value.tolist()
    if isinstance(value, np.generic):
        return value.item()
    if isinstance(value, (tuple, list, set)):
        return [plain(item) for item in sorted(value) if isinstance(value, set)] if isinstance(value, set) else [plain(item) for item in value]
    if isinstance(value, dict):
        return {key: plain(item) for key, item in value.items()}
    return value


def trace_bands(ink: np.ndarray, width: int):
    source_lines, start = inspect.getsourcelines(layout.line_bands)
    marks = {
        start + offset: text.strip()
        for offset, text in enumerate(source_lines)
        if text.strip() in {
            "if not raw:",
            "merged = joined",
            "if count == 1:",
            "merged = expanded",
        }
    }
    events = []
    masks = {}

    def trace(frame, event, arg):
        if frame.f_code is not layout.line_bands.__code__:
            return trace
        if event == "line" and frame.f_lineno in marks:
            local = frame.f_locals
            marker = marks[frame.f_lineno]
            fields = {
                key: plain(local[key])
                for key in (
                    "line_h", "glyph_h", "merge_gap", "raw", "merged", "joined",
                    "fraction_starts", "typical_h", "nearby_gaps", "typical_gap",
                    "pitch", "a", "b", "band_h", "glyph_rows",
                    "compact_text_rows", "strong_rows", "count", "expanded",
                )
                if key in local
            }
            events.append({"line": frame.f_lineno, "marker": marker, **fields})
            if marker == "merged = joined":
                masks["counting_after_cleanup"] = local["ink"].copy()
        return trace

    previous = sys.gettrace()
    try:
        sys.settrace(trace)
        bands = layout.line_bands(ink, width)
    finally:
        sys.settrace(previous)
    return bands, events, masks["counting_after_cleanup"]


def fraction_evidence(ink: np.ndarray, a: int, b: int, height: float):
    captured = {}

    def trace(frame, event, arg):
        if frame.f_code is layout._single_fraction_row.__code__ and event == "return":
            local = frame.f_locals
            captured.update({
                key: plain(local[key])
                for key in ("height", "rules", "glyph_rows", "remaining")
                if key in local
            })
            captured["return_line"] = frame.f_lineno
            captured["result"] = bool(arg)
        return trace

    previous = sys.gettrace()
    try:
        sys.settrace(trace)
        result = layout._single_fraction_row(ink, a, b, height)
    finally:
        sys.settrace(previous)
    return {"scale": height, "result": bool(result), **captured}


def region_evidence(ink: np.ndarray, a: int, b: int, line_h: float, glyph_h: float):
    labels, _ = ndimage.label(ink)
    objects = ndimage.find_objects(labels)
    components = []
    for identity, bounds in enumerate(objects, 1):
        if bounds is None:
            continue
        rows, columns = bounds
        if rows.start > b or rows.stop - 1 < a:
            continue
        height, width = rows.stop - rows.start, columns.stop - columns.start
        area = int(np.count_nonzero(labels[bounds] == identity))
        if area < 3:
            continue
        components.append({
            "id": identity,
            "box": [columns.start, rows.start, width, height],
            "area": area,
            "production_glyph_row_component": (
                0.6 * glyph_h <= height <= 1.8 * glyph_h
                and width >= 0.2 * glyph_h
            ),
        })
    fragments = [
        [a + x, a + y] for x, y in layout._row_fragments(ink[a:b + 1], ink.shape[1])
    ]
    return {
        "projection_fragments": fragments,
        "row_ink_counts": ink[a:b + 1].sum(axis=1).tolist(),
        "components": components,
        "single_fraction_tests": [
            fraction_evidence(ink, a, b, scale)
            for scale in dict.fromkeys((line_h, min(line_h, glyph_h)))
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()
    output = args.out.resolve()
    scratch = (REPO / ".intentfold/tickets/STEMROBIN-184/tmp").resolve()
    if not output.is_relative_to(scratch):
        raise SystemExit("Output must be within ticket scratch.")
    output.mkdir(parents=True, exist_ok=False)
    report = {
        "role": "read-only segmentation diagnostic, not source approval or validator",
        "layout_path": str(TOOLS / "layout.py"),
        "layout_sha256": digest(TOOLS / "layout.py"),
        "source_observations": str(scratch / "transcription-review-10c-p15-p18.md"),
        "observation_sha256": digest(scratch / "transcription-review-10c-p15-p18.md"),
        "pages": {},
        "unresolved": [],
    }
    guarded_files = {}
    for page, facts in FACTS.items():
        root = REPO / ".tmp/ld-s10y-lesson/10c/pages" / page
        durable = REPO / "ssot-resources/soviet10year-textbooks/artifacts/10c/pages" / page
        png, prior_layout = root / "page.png", root / "layout.json"
        for path, expected in ((png, facts["png_sha"]), (prior_layout, facts["layout_sha"])):
            actual = digest(path)
            if actual != expected:
                raise SystemExit(f"Frozen input changed: {path}: {actual}")
        for path in (png, prior_layout, durable / "page.md", durable / "page.json", durable / "audit.json"):
            guarded_files[str(path)] = digest(path)
        prior = json.loads(prior_layout.read_text(encoding="utf-8"))
        audit = json.loads((durable / "audit.json").read_text(encoding="utf-8"))
        if audit["figures"] or audit["count_exclusions"]:
            raise SystemExit(f"Unexpected masking prerequisites on {page}")
        original = Image.open(png).convert("RGB")
        extraction = layout.ink_mask(original)
        counting = layout.counting_ink(extraction, audit["count_exclusions"])
        bands, events, cleaned = trace_bands(counting, prior["content_width"])
        if plain(bands) != prior["line_bands"]:
            raise SystemExit(f"Current production segmentation no longer matches frozen {page}")
        state = next(event for event in events if event["marker"] == "merged = joined")
        line_h, glyph_h = state["line_h"], state["glyph_h"]
        Image.fromarray(np.where(cleaned, 0, 255).astype(np.uint8)).save(output / f"{page}-counting-mask.png")
        regions = []
        for name, a, b, actual_source_rows in facts["regions"]:
            intersecting = [[x, y] for x, y in bands if x <= b and y >= a]
            details = region_evidence(cleaned, a, b, line_h, glyph_h)
            top, bottom = max(0, a - 12), min(original.height, b + 13)
            image = original.crop((0, top, original.width, bottom))
            draw = ImageDraw.Draw(image)
            for x, y in intersecting:
                draw.line((0, x - top, original.width - 1, x - top), fill=(210, 0, 0), width=1)
                draw.line((0, y - top, original.width - 1, y - top), fill=(0, 80, 210), width=1)
            image_path = output / f"{page}-{name}.png"
            image.save(image_path)
            region = {
                "name": name, "source_rows": actual_source_rows,
                "production_rows": len(intersecting),
                "production_bands": intersecting,
                "crop_xywh": [0, top, original.width, bottom - top],
                "image_sha256": digest(image_path),
                **details,
            }
            regions.append(region)
            if len(intersecting) != actual_source_rows:
                report["unresolved"].append({
                    "page": page, "region": name,
                    "source_rows": actual_source_rows,
                    "production_rows": len(intersecting),
                })
        report["pages"][page] = {
            "png_sha256": digest(png),
            "prior_layout_sha256": digest(prior_layout),
            "audit": audit,
            "mask_sha256": digest(output / f"{page}-counting-mask.png"),
            "line_h": line_h, "glyph_h": glyph_h,
            "production_bands": plain(bands),
            "trace": events, "regions": regions,
        }
    for path, expected in guarded_files.items():
        if digest(Path(path)) != expected:
            raise SystemExit(f"Read-only guard changed: {path}")
    report["guarded_files"] = guarded_files
    report["guarded_files_unchanged"] = True
    report["exit"] = 1 if report["unresolved"] else 0
    (output / "diagnostic.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps({
        "output": str(output / "diagnostic.json"),
        "unresolved": report["unresolved"],
        "guarded_files_unchanged": True,
        "exit": report["exit"],
    }, ensure_ascii=False, indent=2))
    return report["exit"]


if __name__ == "__main__":
    raise SystemExit(main())
