"""Independent geometric fixtures for one fraction row versus true text rows.

No existing test assertions, OCR, expected-count override, or source-pixel edits.
Synthetic arrays describe rows by construction, not by counter output.
"""
from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path

import numpy as np
from PIL import Image

TOOLS = Path(__file__).resolve().parent
ROOT = TOOLS.parents[3]
DURABLE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0102"


def glyph(ink, x, y):
    """A connected 24x40 H-shaped body glyph, with no fraction-length stroke."""
    ink[y:y + 40, x:x + 4] = True
    ink[y:y + 40, x + 20:x + 24] = True
    ink[y + 18:y + 22, x:x + 24] = True


def text_row(ink, x, y, count=3):
    for index in range(count):
        glyph(ink, x + 40 * index, y)


def fraction(nested=False, peripheral=False):
    ink = np.zeros((450, 1300), dtype=bool)
    if nested:
        # One outer fraction; both numerator and denominator contain a fraction.
        for top in (20, 170):
            glyph(ink, 360, top)
            ink[top + 55:top + 59, 345:400] = True
            glyph(ink, 360, top + 74)
            glyph(ink, 280, top + 45)
            glyph(ink, 430, top + 45)
        bar, baseline, peripheral_y = 145, 127, 254
    else:
        text_row(ink, 280, 30)
        text_row(ink, 280, 115)
        bar, baseline, peripheral_y = 90, 74, 144
    ink[bar:bar + 4, 260:470] = True
    text_row(ink, 60, baseline)
    text_row(ink, 510, baseline)
    if peripheral:
        # Detached singleton ink is not a second authored print row.
        glyph(ink, 1160, peripheral_y)
    return ink


def fixtures():
    yield "tall_fraction", fraction(), 1, True
    yield "nested_fraction", fraction(nested=True), 1, True
    yield "tall_fraction_detached_singleton", fraction(peripheral=True), 1, True
    yield "nested_fraction_detached_singleton", fraction(nested=True, peripheral=True), 1, True
    two = fraction()
    text_row(two, 510, 210)
    yield "fraction_then_true_row", two, 2, False
    three = fraction()
    text_row(three, 510, 210)
    text_row(three, 510, 270)
    yield "fraction_then_two_true_rows", three, 3, False
    remote = fraction()
    text_row(remote, 1100, 210)
    yield "fraction_then_remote_supported_row", remote, 2, False
    single = fraction()
    glyph(single, 510, 210)
    yield "fraction_then_true_single_glyph_row", single, 2, False
    for count in (2, 3):
        ink = np.zeros((450, 1300), dtype=bool)
        for index in range(count):
            text_row(ink, 100, 30 + 70 * index)
        yield f"{count}_true_rows", ink, count, False


def physical_case(layout, page, baseline_path):
    protected = [page, page.with_name("layout.json"),
                 DURABLE / "page.md", DURABLE / "page.json", DURABLE / "audit.json"]
    hashes = {str(path.relative_to(ROOT)): layout.sha256_file(path) for path in protected}
    with Image.open(page) as image:
        if image.size != (1695, 2580):
            raise ValueError(f"Unexpected native dimensions: {image.size}")
        ink = layout.ink_mask(image)
    original = ink.copy()
    cols = np.flatnonzero(ink.any(axis=0))
    bands = layout.line_bands(ink, int(cols[-1] - cols[0] + 1))
    # Independent reviewed row count. The other 14 coordinates come from the
    # preserved preparation layout, whose rows the human explicitly confirmed.
    prepared = json.loads(page.with_name("layout.json").read_text(encoding="utf-8"))
    expected_bands = (prepared["line_bands"][:5] + [[820, 1032]]
                      + prepared["line_bands"][8:])
    baseline = json.loads(baseline_path.read_text(encoding="utf-8"))
    current_hashes = {str(path.relative_to(ROOT)): layout.sha256_file(path) for path in protected}
    unchanged = hashes == current_hashes == baseline["protected_sha256"]
    case = {
        "name": "10c_physical102", "expected_count": 15, "actual_count": len(bands),
        "expected_bands": expected_bands, "bands": bands,
        "other_14_rows_unchanged": [list(band) for band in bands] == expected_bands,
        "source_array_unchanged": bool(np.array_equal(ink, original)),
        "protected_files_unchanged": unchanged,
        "pass": len(bands) == 15 and [list(band) for band in bands] == expected_bands
        and np.array_equal(ink, original) and unchanged,
    }
    return case, current_hashes


def run(code, report_path, page=None, baseline_path=None):
    spec = importlib.util.spec_from_file_location("layout_target", code)
    layout = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(layout)
    cases = []
    for name, ink, expected_count, expected_fraction in fixtures():
        original = ink.copy()
        ys = np.flatnonzero(ink.any(axis=1))
        is_fraction = layout._single_fraction_row(ink, int(ys[0]), int(ys[-1]), 40.0)
        bands = layout.line_bands(ink, ink.shape[1])
        cases.append({
            "name": name, "expected_count": expected_count, "actual_count": len(bands),
            "expected_single_fraction": expected_fraction,
            "actual_single_fraction": bool(is_fraction), "bands": bands,
            "array_unchanged": bool(np.array_equal(ink, original)),
            "pass": len(bands) == expected_count and is_fraction == expected_fraction
            and np.array_equal(ink, original),
        })
    current_hashes = {}
    if page is not None:
        physical, current_hashes = physical_case(layout, page, baseline_path)
        cases.append(physical)
    report = {
        "status": "pass" if all(case["pass"] for case in cases) else "fail",
        "requirement_basis": "User-supplied independent 15-row review for 10c102; synthetic row geometry is authored before the patch and has explicit 1/2/3-row expectations.",
        "code_path": str(code.relative_to(ROOT)), "code_sha256": layout.sha256_file(code),
        "test_path": str(Path(__file__).resolve().relative_to(ROOT)),
        "test_sha256": layout.sha256_file(Path(__file__)),
        "baseline_path": str(baseline_path.relative_to(ROOT)) if baseline_path else None,
        "baseline_sha256": layout.sha256_file(baseline_path) if baseline_path else None,
        "protected_sha256": current_hashes,
        "cases": cases,
        "image_ledger": {"model_opens": 0, "crops": 0, "generated_images": 0},
        "limitations": "Algorithm-only targeted proof, not finalize/assembly, semantic review, full-project tests, build, database, or publication.",
    }
    if report_path is not None:
        report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0 if report["status"] == "pass" else 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--code", type=Path, default=TOOLS / "layout.py")
    parser.add_argument("--report", type=Path)
    parser.add_argument("--page", type=Path)
    parser.add_argument("--baseline", type=Path)
    args = parser.parse_args()
    if (args.page is None) != (args.baseline is None):
        parser.error("--page and --baseline must be provided together")
    raise SystemExit(run(
        args.code.resolve(),
        args.report.resolve() if args.report else None,
        args.page.resolve() if args.page else None,
        args.baseline.resolve() if args.baseline else None,
    ))
