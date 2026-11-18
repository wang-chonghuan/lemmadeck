import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image


REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TMP = REPO / ".intentfold/tickets/STEMROBIN-181/tmp"
OUT = TMP / "d342-source182-first-independent-review"
CANDIDATE = TMP / "d341-source182-raw139-sole-padding-repair"
INITIAL = TMP / "d333-source182-first-author"
PAGE = Path("10p/pages/0182")
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
from vectorize import _dilate, _ink


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(path):
    return json.loads(path.read_text())


def bound(path):
    return {"path": str(path), "sha256": sha(path)}


freeze = load(CANDIDATE / "author-freeze.json")
frozen_files = []
for entry in freeze["files"]:
    path = REPO / entry["path"]
    frozen_files.append({
        **bound(path),
        "expected_sha256": entry["sha256"],
        "matches_author_freeze": sha(path) == entry["sha256"],
    })
assert all(item["matches_author_freeze"] for item in frozen_files)

source = Image.open(CANDIDATE / "work" / PAGE / "page.png").convert("RGB")
detail = OUT / "source-typography-detail.png"
assert not detail.exists()
detail_box = [180, 1530, 1350, 2020]
crop = source.crop(detail_box)
crop.resize((crop.width * 2, crop.height * 2), Image.Resampling.NEAREST).save(detail)

figures = []
for number, box, padding in [
    (139, [513, 259, 551, 278], 4),
    (140, [950, 1329, 362, 248], 12),
]:
    x, y, w, h = box
    raw = CANDIDATE / "work" / PAGE / f"figures/fig-{number}.png"
    svg = raw.with_suffix(".svg")
    raster = OUT / f"fig-{number}.existing-svg.png"
    extent = [x - padding, y - padding, x + w + padding, y + h + padding]
    expected_crop = np.asarray(source.crop(extent))
    got_crop = np.asarray(Image.open(raw).convert("RGB"))
    src_ink = _ink(raw)
    got_ink = _ink(raster)
    assert src_ink.shape == got_ink.shape
    missing = int((src_ink & ~_dilate(got_ink, 1)).sum())
    extra = int((got_ink & ~_dilate(src_ink, 1)).sum())
    count = int(src_ink.sum())
    figures.append({
        "figure": f"RAW{number}",
        "raw": bound(raw),
        "svg": bound(svg),
        "raster": bound(raster),
        "box_xywh": box,
        "padding_px": padding,
        "crop_extent_xyxy_exclusive": extent,
        "size_wh": [got_crop.shape[1], got_crop.shape[0]],
        "pixel_identical_to_source_crop": bool(np.array_equal(expected_crop, got_crop)),
        "ink_pixels": count,
        "missing_pixels_1px_tolerance": missing,
        "extra_pixels_1px_tolerance": extra,
        "mismatch_ratio": (missing + extra) / count,
        "limit": 0.02,
        "contour_contract_pass": (missing + extra) / count <= 0.02,
        "semantic_verdict_from_ratio": False,
    })

old139 = Image.open(INITIAL / "work" / PAGE / "figures/fig-139.png").convert("RGB")
new139 = Image.open(CANDIDATE / "work" / PAGE / "figures/fig-139.png").convert("RGB")
preserved_paths = [
    INITIAL / "crop-observations.json",
    INITIAL / "native/finalize-182.receipt.json",
    INITIAL / "native/finalize-PASS-initial/source" / PAGE / "audit.json",
    INITIAL / "native/finalize-PASS-initial/work" / PAGE / "figures/fig-139.png",
    CANDIDATE / "native/metadata.receipt.json",
    CANDIDATE / "native/finalize.receipt.json",
    CANDIDATE / "native/vectorize-raw139-only.receipt.json",
]
old_blocks = load(INITIAL / "source" / PAGE / "page.json")["blocks"]
new_blocks = load(CANDIDATE / "source" / PAGE / "page.json")["blocks"]
result = {
    "purpose": "Read-only crop/contour/preservation evidence, not a semantic review.",
    "resvg_invocations": {"RAW139": 1, "RAW140": 1},
    "native_prepare_finalize_vectorize_invocations_by_reviewer": 0,
    "figure_checks": figures,
    "repaired139_equals_initial139_inset8": bool(np.array_equal(
        np.asarray(old139.crop((8, 8, old139.width - 8, old139.height - 8))),
        np.asarray(new139),
    )),
    "text_blocks_unchanged_from_initial": old_blocks == new_blocks,
    "raw140_png_unchanged": sha(INITIAL / "work" / PAGE / "figures/fig-140.png") == sha(CANDIDATE / "work" / PAGE / "figures/fig-140.png"),
    "raw140_svg_unchanged": sha(INITIAL / "work" / PAGE / "figures/fig-140.svg") == sha(CANDIDATE / "work" / PAGE / "figures/fig-140.svg"),
    "candidate_freeze_files_verified": frozen_files,
    "preserved_original_evidence": [bound(path) for path in preserved_paths],
    "detail": {
        **bound(detail),
        "source": bound(CANDIDATE / "work" / PAGE / "page.png"),
        "source_box_xyxy_exclusive": detail_box,
        "scale": 2,
        "resampling": "nearest",
        "source_glyphs_redrawn_or_inferred": False,
    },
}
target = OUT / "pixel-checks.json"
assert not target.exists()
target.write_text(json.dumps(result, ensure_ascii=True, indent=2) + "\n")
print(json.dumps({
    "figures": figures,
    "detail": result["detail"],
    "text_blocks_unchanged": result["text_blocks_unchanged_from_initial"],
    "repaired139_equals_initial139_inset8": result["repaired139_equals_initial139_inset8"],
    "frozen_input_files_verified": len(frozen_files),
    "pixel_checks": bound(target),
}, indent=2))
