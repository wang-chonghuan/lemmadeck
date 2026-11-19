import hashlib
import json
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
from PIL import Image

R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = R / ".intentfold/tickets/STEMROBIN-181/tmp/d808-source231-raw201202-first-review"
A = R / ".intentfold/tickets/STEMROBIN-181/tmp/d797-source231-first-author"
TOOLS = R / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import layout


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


freeze = json.loads((A / "freeze.json").read_text())
assert digest(A / "freeze.json") == "f1e1e2544ffa9c54ceec54625b5af59f1fef5cf74cf42caef8e776ca022a1f01"
bindings = {}
for relative, expected in freeze["sha256_relative_to_base"].items():
    path = A / relative
    actual = digest(path)
    assert actual == expected, (str(path), expected, actual)
    bindings[str(path)] = {"sha256": actual, "matches_freeze": True}
for name, expected in freeze["referenced_contract_sha256"].items():
    actual = digest(Path(name))
    assert actual == expected, (name, expected, actual)
    bindings[name] = {"sha256": actual, "matches_freeze": True}

page_path = A / "work/10p/pages/0231/page.png"
page = Image.open(page_path)
original = layout.ink_mask(page)
masked = original.copy()
audit = json.loads((A / "root/10p/pages/0231/audit.json").read_text())
for figure in audit["figures"]:
    x, y, w, h = figure["box"]
    masked[max(0, y):y + h, max(0, x):x + w] = False
columns = np.flatnonzero(original.any(axis=0))
content_w = int(columns[-1] - columns[0] + 1)
edge = max(1, int(page.width * 0.01))
edged = masked.copy()
edged[:, :edge] = False
edged[:, -edge:] = False
fragments = layout._row_fragments(edged, content_w)
trace = {}


def capture(frame, event, arg):
    if frame.f_code is layout.line_bands.__code__ and event == "return":
        for key in ("raw", "merged", "line_h", "glyph_h", "merge_gap",
                    "typical_h", "typical_gap", "pitch", "fraction_starts",
                    "radical_starts"):
            value = frame.f_locals.get(key)
            trace[key] = sorted(value) if isinstance(value, set) else value
    return capture


sys.settrace(capture)
bands = layout.line_bands(masked, content_w)
sys.settrace(None)
candidate = json.loads((A / "root/10p/pages/0231/page.json").read_text())
rows = [
    {"ref": f"p0231#{block_index}", "line": line_index, "text": text}
    for block_index, block in enumerate(candidate["blocks"], 1)
    if block["kind"] != "fig"
    for line_index, text in enumerate(block["lines"], 1)
]
footnote_fragments = [list(band) for band in fragments if 1740 <= band[0] <= 1900]
assert len(rows) == 19 and len(bands) == 18
assert footnote_fragments == [[1755, 1797], [1813, 1852], [1863, 1892]]
diagnostics = {
    "schema": "source231-independent-counting-diagnostic@1",
    "mode": "Read-only counting functions on an in-memory copy; no finalize, replay, prepare, or counter patch.",
    "source_dimensions": list(page.size),
    "content_width": content_w,
    "default_edge_margin_px": edge,
    "native_snapped_boxes": [f["box"] for f in audit["figures"]],
    "candidate_rows": rows,
    "candidate_rows_by_block": [len(b["lines"]) for b in candidate["blocks"]],
    "masked_projection_fragments": fragments,
    "native_line_bands": bands,
    "footnote_projection_fragments": footnote_fragments,
    "footnote_native_bands": [band for band in bands if 1740 <= band[0] <= 1900],
    "native_function_return_locals": trace,
    "saved_native_audit": audit,
    "source_and_frozen_input_hash_checks": bindings,
}

# This is a bounded source-pixel detail, not OCR or an altered transcription.
detail_box = (570, 1745, 915, 1805)
detail = page.crop(detail_box).resize((1035, 180), Image.Resampling.NEAREST)
detail_path = OUT / "footnote-index-detail.png"
detail.save(detail_path)
diagnostics["detail"] = {
    "path": str(detail_path),
    "source": str(page_path),
    "source_box_ltrb_half_open": detail_box,
    "scale": 3,
    "resampling": "NEAREST; original pixels repeated, no enhancement",
    "sha256": digest(detail_path),
}

figures = [
    ("202", A / "work/10p/pages/0231/figures/fig-202.png"),
    ("201", R / ".intentfold/tickets/STEMROBIN-181/tmp/d781-source230-first-author/work/10p/pages/0230/figures/fig-201.png"),
]
diagnostics["svg_previews"] = []
for number, png_path in figures:
    svg_path = png_path.with_suffix(".svg")
    preview = OUT / f"fig-{number}-actual-svg-preview.png"
    command = ["node", str(TOOLS / "svg_raster.js"), str(svg_path), str(preview)]
    result = subprocess.run(command, cwd=str(R), text=True, capture_output=True)
    assert result.returncode == 0, result.stderr or result.stdout
    rendered_result = json.loads(result.stdout)
    assert rendered_result["ok"]
    source_pixels = np.asarray(Image.open(png_path).convert("RGB"))
    preview_pixels = np.asarray(Image.open(preview).convert("RGB"))
    assert source_pixels.shape == preview_pixels.shape
    source_ink = np.asarray(Image.open(png_path).convert("L")) < 128
    preview_ink = np.asarray(Image.open(preview).convert("L")) < 128

    def dilate_one(mask):
        result = mask.copy()
        padded = np.pad(mask, 1)
        for dy in range(3):
            for dx in range(3):
                result |= padded[dy:dy + mask.shape[0], dx:dx + mask.shape[1]]
        return result

    missing = int((source_ink & ~dilate_one(preview_ink)).sum())
    extra = int((preview_ink & ~dilate_one(source_ink)).sum())
    ink_pixels = int(source_ink.sum())
    tree = ET.parse(svg_path)
    tags = [element.tag.rsplit("}", 1)[-1] for element in tree.iter()]
    result_entry = {
        "figure": f"fig-{number}",
        "command": command,
        "cwd": str(R),
        "exit_code": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
        "png": {"path": str(png_path), "sha256": digest(png_path)},
        "svg": {"path": str(svg_path), "sha256": digest(svg_path)},
        "preview": {"path": str(preview), "sha256": digest(preview)},
        "size": [source_ink.shape[1], source_ink.shape[0]],
        "svg_attributes": tree.getroot().attrib,
        "svg_element_inventory": {tag: tags.count(tag) for tag in sorted(set(tags))},
        "threshold": 128,
        "edge_tolerance_px": 1,
        "source_ink_pixels": ink_pixels,
        "preview_ink_pixels": int(preview_ink.sum()),
        "exact_binary_difference_pixels": int((source_ink != preview_ink).sum()),
        "missing_pixels_outside_tolerance": missing,
        "extra_pixels_outside_tolerance": extra,
        "tolerant_mismatch_percent": 100 * (missing + extra) / ink_pixels,
        "svg_regenerated": False,
    }
    if number == "202":
        x, y, w, h = audit["figures"][0]["box"]
        box = (x - 12, y - 12, x + w + 12, y + h + 12)
        expected = np.asarray(page.crop(box).convert("RGB"))
        result_entry["source_crop_box_ltrb_half_open"] = box
        result_entry["crop_pixel_identical_to_source_rectangle"] = bool(
            np.array_equal(source_pixels, expected)
        )
        assert result_entry["crop_pixel_identical_to_source_rectangle"]
    result_entry["outermost_png_border_white"] = bool(
        np.all(source_pixels[0] == 255)
        and np.all(source_pixels[-1] == 255)
        and np.all(source_pixels[:, 0] == 255)
        and np.all(source_pixels[:, -1] == 255)
    )
    diagnostics["svg_previews"].append(result_entry)

prior_review = R / ".intentfold/tickets/STEMROBIN-181/tmp/d787-source230-first-independent-review/review-report.json"
prior = json.loads(prior_review.read_text())
assert prior["status"]["RAWfig201PNG"] == "PASS"
assert digest(figures[1][1]) == prior["bindings"]["rawFigurePNG"]["sha256"]
retained_png = R / ".intentfold/tickets/STEMROBIN-181/tmp/d793-reviews-consume-source230/root/10p/figures/fig-201.png"
canonical_png = R / "ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-201.png"
canonical_previous = R / "ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0230/page.md"
diagnostics["retained_source201_png"] = {
    "prior_review_path": str(prior_review),
    "prior_review_sha256": digest(prior_review),
    "prior_png_status": "PASS carried forward; source review not repeated",
    "retained_png_path": str(retained_png),
    "retained_png_sha256": digest(retained_png),
    "canonical_png_path": str(canonical_png),
    "canonical_png_sha256": digest(canonical_png),
}
assert digest(retained_png) == digest(figures[1][1]) == digest(canonical_png)
diagnostics["canonical_source230_text_only"] = {
    "path": str(canonical_previous),
    "sha256": digest(canonical_previous),
    "image_opened": False,
}
assert digest(canonical_previous) == freeze["source"]["previous_context"]["sha256"]
for path in (
    A / "freeze.json",
    R / ".intentfold/tickets/STEMROBIN-181/tmp/d807-raw201-vectorize/receipt.json",
    R / ".intentfold/tickets/STEMROBIN-181/tmp/d797-source231-first-author/VECTORIZE/receipt.json",
):
    diagnostics.setdefault("receipt_hashes", {})[str(path)] = digest(path)
output = OUT / "diagnostics.json"
output.write_text(json.dumps(diagnostics, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "source_rows": len(rows),
    "native_bands": len(bands),
    "footnote_fragments": footnote_fragments,
    "footnote_native_bands": diagnostics["footnote_native_bands"],
    "return_locals": trace,
    "svg_previews": diagnostics["svg_previews"],
    "diagnostics": str(output),
}, ensure_ascii=False, indent=2))
