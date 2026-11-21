import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d565-source419-first-review"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import layout


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_new(path, data):
    with path.open("x", encoding="utf-8") as output:
        json.dump(data, output, ensure_ascii=False, indent=2)
        output.write("\n")


def main():
    source_path = ROOT / ".tmp/STEMROBIN-181/d1816-d561/work/10p/pages/0419/page.png"
    raw_path = source_path.parent / "figures/tbl-p0419-01.png"
    candidate_path = ROOT / ".tmp/STEMROBIN-181/d1816-d564/root/10p/pages/0419/page.json"
    audit_path = candidate_path.parent / "audit.json"
    candidate = json.loads(candidate_path.read_text(encoding="utf-8"))
    audit = json.loads(audit_path.read_text(encoding="utf-8"))
    assert "counting" not in candidate["meta"]
    assert "figure_crops" not in candidate["meta"]
    with Image.open(source_path) as original, Image.open(raw_path) as raw:
        ink = layout.ink_mask(original)
        masked = ink.copy()
        for figure in audit["figures"]:
            x, y, width, height = figure["box"]
            masked[max(0, y):y + height, max(0, x):x + width] = False
        columns = np.flatnonzero(ink.any(axis=0))
        content_width = int(columns[-1] - columns[0] + 1)
        bands = layout.line_bands(masked, content_width)
        assert len(bands) == audit["lines_printed"] == 3
        assert candidate["meta"]["printed_lines"] == audit["lines_md"] == 2

        edge = max(1, int(original.width * 0.01))
        residual = masked.copy()
        residual[:, :edge] = False
        residual[:, -edge:] = False
        band_records = []
        for index, (top, bottom) in enumerate(bands, 1):
            xs = np.flatnonzero(residual[top:bottom + 1].any(axis=0))
            band_records.append({
                "order_top_to_bottom": index,
                "y_inclusive": [int(top), int(bottom)],
                "residual_ink_x_inclusive": [int(xs[0]), int(xs[-1])],
                "residual_ink_pixels": int(residual[top:bottom + 1].sum()),
            })

        x, y, width, height = audit["figures"][0]["box"]
        pad = 12
        crop_box = (x - pad, y - pad, x + width + pad, y + height + pad)
        expected = original.crop(crop_box)
        source_pixels = np.asarray(expected)
        raw_pixels = np.asarray(raw)
        assert expected.mode == raw.mode
        assert source_pixels.shape == raw_pixels.shape
        different_pixels = int(np.any(source_pixels != raw_pixels, axis=2).sum())
        assert different_pixels == 0

        # This diagnostic changes only an in-memory counting mask, never inputs.
        stamp_removed = masked.copy()
        stamp_removed[:100] = False
        counterfactual_bands = layout.line_bands(stamp_removed, content_width)
        assert len(counterfactual_bands) == 2

        overlay_path = OWN / "native-count-bands-overlay.png"
        if overlay_path.exists():
            raise FileExistsError(overlay_path)
        overlay = original.convert("RGB")
        draw = ImageDraw.Draw(overlay)
        draw.rectangle((x, y, x + width - 1, y + height - 1), outline=(0, 155, 0), width=3)
        for record in band_records:
            top, bottom = record["y_inclusive"]
            left, right = record["residual_ink_x_inclusive"]
            draw.rectangle((left - 4, top - 4, right + 4, bottom + 4), outline=(210, 0, 170), width=3)
            draw.text((35, max(0, top - 15)), f"band {record['order_top_to_bottom']} y={top}..{bottom}", fill=(210, 0, 170))
        overlay.save(overlay_path)

        result = {
            "status": "READ_ONLY_DIAGNOSIS_NOT_FINALIZE",
            "source_sha256": sha(source_path),
            "raw_sha256": sha(raw_path),
            "candidate_sha256": sha(candidate_path),
            "audit_sha256": sha(audit_path),
            "layout_sha256": sha(TOOLS / "layout.py"),
            "p2c_sha256": sha(TOOLS / "p2c.py"),
            "content_width": content_width,
            "default_edge_margin_px": edge,
            "mask_basis": "Existing audit figure xywh masked in memory, matching p2c.py cmd_finalize lines 526-537; current candidate has no counting override.",
            "default_bands": band_records,
            "default_band_count": len(bands),
            "md_count_from_existing_candidate_and_audit": 2,
            "diagnostic_only_top100_exclusion": {
                "in_memory_only": True,
                "authorization_or_fix": False,
                "y_excluded_half_open": [0, 100],
                "result_bands": [[int(a), int(b)] for a, b in counterfactual_bands],
                "result_count": len(counterfactual_bands),
                "warning": "Not applied to candidate, tool or persisted native gate. Does not waive the first native failure.",
            },
            "raw_pixel_comparison": {
                "snapped_figure_box_xywh": [x, y, width, height],
                "additional_default_padding_each_side_px": pad,
                "actual_source_crop_xyxy_half_open": list(crop_box),
                "source_mode": expected.mode,
                "raw_mode": raw.mode,
                "raw_dimensions": list(raw.size),
                "compared_pixels": int(raw.width * raw.height),
                "different_pixels": different_pixels,
                "different_channels": int(np.count_nonzero(source_pixels != raw_pixels)),
                "interpretation": "Exact unchanged source-pixel rectangle, not calibrated spectral-content approval.",
            },
            "overlay": {"path": str(overlay_path), "sha256": sha(overlay_path)},
            "finalize_calls": 0,
            "paid_calls": 0,
            "input_writes": 0,
        }
        write_new(OWN / "readonly-diagnosis.json", result)
        print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
