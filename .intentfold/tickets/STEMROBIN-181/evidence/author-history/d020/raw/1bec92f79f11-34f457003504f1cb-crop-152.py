"""Produce only the review-authorized exact source rectangle; no visual review."""

import hashlib
import json
import sys
from pathlib import Path

import PIL
from PIL import Image, PngImagePlugin

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = Path(__file__).resolve().parent
BEFORE = OUT / "before"
REVIEW_SHA = "5be67f9bbb43dcc9ab1c90bbac0e47b0f48e182fe61e5682cb20ae9f47a0cce6"
INITIAL_FILE_SHA = "9fdc65209158e832f3fb9ec7459c2c78bcdb1155eb951a7cf77984980efe54e1"
INITIAL_TEXT_SHA = "63b9870437b07e78a17f56c21970a619c72afdef784070ac9116d834ab28f9d1"
RECTANGLE = [771, 220, 554, 436]


def bind(path, expected=None):
    value = {
        "path": str(path.resolve()),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    }
    if expected is not None:
        assert value["sha256"] == expected, f"Changed frozen bytes: {path}"
    return value


def main():
    assert OUT == ROOT / (
        ".intentfold/tickets/STEMROBIN-181/tmp/"
        "9p-next-source-0200-0203-correction-1"
    )
    target = OUT / "candidate-figures/fig-152.png"
    report = OUT / "crop-152-binding.json"
    assert not target.exists() and not report.exists(), "One exact crop only"
    review_file = BEFORE / "source-review-9p-0200-0203.json"
    initial_file = BEFORE / "author-freeze.json"
    review_binding = bind(review_file, REVIEW_SHA)
    initial_binding = bind(initial_file, INITIAL_FILE_SHA)
    review = json.loads(review_file.read_bytes())
    initial = json.loads(initial_file.read_bytes())
    assert initial["text_freeze"]["sha256"] == INITIAL_TEXT_SHA
    assert review["binding"]["text_freeze_sha256"] == INITIAL_TEXT_SHA
    assert review["binding"]["author_freeze"]["sha256"] == INITIAL_FILE_SHA
    finding = next(item for item in review["findings"] if item["id"] == "F-crop-152")
    assert finding["one_probe_result"]["proposed_source_rectangle_xywh"] == RECTANGLE
    assert finding["allowed_metadata"]["figure_crops"]["fig-152"]["padding_px"] == 6
    page = next(item for item in initial["pages"] if item["pdf_page"] == 202)
    figure = next(item for item in page["figures"] if item["id"] == "fig-152")
    assert figure["snapped_box"] == finding["preserve_snapped_box_xywh"]
    source = ROOT / page["source"]["path"]
    source_binding = bind(source, page["source"]["sha256"])
    candidate_binding = bind(
        BEFORE / "candidate-figures/fig-152.png", figure["candidate"]["sha256"]
    )
    x, y, width, height = RECTANGLE
    sx, sy, sw, sh = figure["snapped_box"]
    assert [sx - x, sy - y, x + width - sx - sw, y + height - sy - sh] == [6] * 4
    with Image.open(source) as image:
        assert list(image.size) == page["dimensions_px"]
        cropped = image.crop((x, y, x + width, y + height))
        assert list(cropped.size) == [width, height]
        pixel_sha = hashlib.sha256(cropped.tobytes()).hexdigest()
        with target.open("xb") as handle:
            cropped.save(handle, format="PNG")
        mode = cropped.mode
        cropped.close()
    bind(source, source_binding["sha256"])
    bind(BEFORE / "candidate-figures/fig-152.png", candidate_binding["sha256"])
    result = {
        "schema": "s10y/source-author-exact-crop-binding@1",
        "ticket": "STEMROBIN-181",
        "delivery": "D020",
        "book": "9p",
        "role": "source-correction-author-only",
        "finding_id": "F-crop-152",
        "status": "produced-unviewed-awaiting-independent-delta-review",
        "review": review_binding,
        "initial_author_freeze": initial_binding,
        "initial_text_freeze_sha256": INITIAL_TEXT_SHA,
        "source": source_binding,
        "preserved_initial_candidate": candidate_binding,
        "output": bind(target),
        "source_ref": figure["block"],
        "caption_ref": "p0202#3",
        "owner": "phy9-c2-s2-n81",
        "frozen_rough_box_xywh": figure["rough_box"],
        "frozen_snapped_box_xywh": figure["snapped_box"],
        "preserved_native_snap": figure["native_snap"],
        "source_rectangle_xywh": RECTANGLE,
        "pillow_crop_rectangle_xyxy_exclusive": [x, y, x + width, y + height],
        "padding_px": 6,
        "dimensions_px": [width, height],
        "mode": mode,
        "decoded_pixel_sha256": pixel_sha,
        "whole_frozen_snapped_rectangle_preserved": True,
        "source_bytes_unchanged": True,
        "candidate_extraction_reused": False,
        "method": "Pillow Image.open(source).crop(exact xyxy).save(format=PNG)",
        "crop_calls": 1,
        "resize_convert_whiten_resnap_or_finalize_calls": 0,
        "images_viewed": 0,
        "visual_completeness_or_leakage_approval": False,
        "helper": bind(Path(__file__).resolve()),
        "tool_bindings": {
            "python_executable": bind(Path(sys.executable).resolve()),
            "python_version": sys.version,
            "pillow_version": PIL.__version__,
            "PIL": bind(Path(PIL.__file__)),
            "Image": bind(Path(Image.__file__)),
            "PngImagePlugin": bind(Path(PngImagePlugin.__file__)),
        },
        "command": (
            ".claude/skills/ld-s10y-lesson/.venv/bin/python -B "
            + str(Path(__file__).resolve().relative_to(ROOT))
        ),
    }
    with report.open("x", encoding="utf-8") as handle:
        handle.write(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"crop_binding": bind(report), "output": bind(target)}, indent=2))


if __name__ == "__main__":
    main()
