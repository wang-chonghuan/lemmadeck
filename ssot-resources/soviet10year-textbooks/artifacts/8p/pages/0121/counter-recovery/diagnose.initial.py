"""Read-only classifier evidence; generated output stays in this private root."""
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180")
OWN = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
BASE_SHA = "b7c18ef0992b98a27b56ecd0437c3a5f2286f6da1ab5df02b0189ed14cc9a03a"
PNG = ROOT / ".tmp/ld-s10y-lesson/8p/pages/0121/page.png"
PAGE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0121"
FIGURES = ((282, 213, 603, 620), (932, 208, 605, 617))
NOISE_BOX = (29, 696, 47, 43)


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def inputs():
    paths = [TOOLS / "layout.py", TOOLS / "blocks.py", TOOLS / "p2c.py", PNG,
             ROOT / ".tmp/ld-s10y-lesson/8p/pages/0121/layout.json"]
    paths.extend(path for path in PAGE.rglob("*") if path.is_file())
    return {str(path.relative_to(ROOT)): sha(path) for path in paths}


def page_mask(layout):
    with Image.open(PNG) as image:
        original = layout.ink_mask(image)
    mask = original.copy()
    receipt = json.loads((PAGE / "audit.json").read_text())
    assert tuple(tuple(item["box"]) for item in receipt["figures"]) == FIGURES
    for x, y, width, height in FIGURES:
        mask[y:y + height, x:x + width] = False
    xs = np.flatnonzero(original.any(axis=0))
    return original, mask, int(xs[-1] - xs[0] + 1)


def counted(layout, ink, width):
    captured = []

    def trace(frame, event, arg):
        if frame.f_code is layout.line_bands.__code__ and event == "return":
            captured.append({
                "ink": frame.f_locals["ink"].copy(),
                "scale": {key: float(frame.f_locals[key])
                          for key in ("line_h", "glyph_h", "merge_gap", "typical_h")},
            })
        return trace

    old = sys.gettrace()
    try:
        sys.settrace(trace)
        bands = layout.line_bands(ink, width)
    finally:
        sys.settrace(old)
    return bands, captured[0]["ink"], captured[0]["scale"]


def bounds(mask):
    ys, xs = np.nonzero(mask)
    return ([int(xs.min()), int(ys.min()), int(xs.max() - xs.min() + 1),
             int(ys.max() - ys.min() + 1)] if xs.size else None)


def main():
    assert Path.cwd() == ROOT
    assert sha(TOOLS / "layout.py") == BASE_SHA
    before = inputs()
    layout = load("layout", TOOLS / "layout.py")
    original, mask, width = page_mask(layout)
    normal, cleaned, scale = counted(layout, mask, width)
    mirrored, mirrored_cleaned, mirrored_scale = counted(layout, np.fliplr(mask), width)
    x, y, w, h = NOISE_BOX
    without = mask.copy()
    without[y:y + h, x:x + w] = False
    no_noise, no_noise_cleaned, _ = counted(layout, without, width)
    isolated = np.zeros_like(mask)
    isolated[y:y + h, x:x + w] = mask[y:y + h, x:x + w]
    blob = mask[y:y + h, x:x + w]
    holes = ndimage.binary_fill_holes(blob) & ~blob
    labels, _ = ndimage.label(holes)
    core_size = max(2, int(0.2 * scale["glyph_h"]))
    core = ndimage.binary_opening(blob, structure=np.ones((core_size, core_size), bool))
    filled_core = ndimage.binary_opening(
        ndimage.binary_fill_holes(blob),
        structure=np.ones((core_size, core_size), bool),
    )
    output = {
        "scope": "technical morphology only; no SOURCE review or approval",
        "cwd": str(ROOT), "layout_sha256": BASE_SHA,
        "inputs_before": before, "inputs_after": inputs(),
        "shape_hw": list(mask.shape), "content_width": width,
        "figure_boxes_xywh": FIGURES, "caption_mask_restoration": "none needed",
        "normal_bands_inclusive_y": normal,
        "mirrored_bands_inclusive_y": mirrored,
        "normal_scale": scale, "mirrored_scale": mirrored_scale,
        "mirror_cleaned_mask_equal": bool(np.array_equal(cleaned, np.fliplr(mirrored_cleaned))),
        "isolated_noise_box_xywh": NOISE_BOX,
        "isolated_noise_area": int(blob.sum()),
        "extra_band_ink_bounds_xywh": bounds(mask[698:737])[:],
        "isolated_noise_bands": layout.line_bands(isolated, width),
        "without_noise_bands": no_noise,
        "without_noise_counting_mask_exact_delta": bool(np.array_equal(
            cleaned & ~isolated, no_noise_cleaned)),
        "noise_holes": [
            {"area": int((labels[item] == i).sum()),
             "height": item[0].stop - item[0].start,
             "width": item[1].stop - item[1].start}
            for i, item in enumerate(ndimage.find_objects(labels), 1)
            if item is not None
        ],
        "noise_density": float(blob.mean()), "core_size": core_size,
        "original_core_area": int(core.sum()), "filled_core_area": int(filled_core.sum()),
        "original_core_has_holes": bool(np.any(ndimage.binary_fill_holes(core) & ~core)),
        "filled_core_has_holes": bool(np.any(
            ndimage.binary_fill_holes(filled_core) & ~filled_core)),
        "actual_images_viewed": 1,
        "uncertainty": "SOURCE row/caption/fraction interpretation belongs to separate reviewer.",
    }
    output["extra_band_ink_bounds_xywh"][1] += 698
    assert output["inputs_before"] == output["inputs_after"]
    destination = OWN / "baseline-diagnosis.json"
    assert not destination.exists()
    destination.write_text(json.dumps(output, indent=2) + "\n")
    crop = OWN / "isolated-margin-native.png"
    assert not crop.exists()
    with Image.open(PNG) as image:
        image.crop((16, 680, 95, 755)).save(crop)
    print(json.dumps({key: output[key] for key in (
        "normal_bands_inclusive_y", "mirrored_bands_inclusive_y",
        "isolated_noise_box_xywh", "isolated_noise_area", "noise_holes",
        "core_size", "original_core_area", "filled_core_area",
        "without_noise_counting_mask_exact_delta",
    )}))


if __name__ == "__main__":
    main()
