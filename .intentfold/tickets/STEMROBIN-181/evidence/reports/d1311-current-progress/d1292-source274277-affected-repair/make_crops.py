"""Create the eight affected native source crops without reading candidates."""

import ast
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops


CWD = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TICKET = CWD / ".intentfold/tickets/STEMROBIN-181/tmp"
OWNED = TICKET / "d1292-source274277-affected-repair"
REVIEW = TICKET / "d1283-source274277-first-independent-review"
FIRST = TICKET / "d1273-source274277-first-author"
SOURCE = TICKET / "d1271-source274277-first-preparation/work/10p/pages"
LAYOUT_IMPL = CWD / ".claude/skills/ld-s10y-lesson/tools/layout.py"
PAGES = (274, 276, 277)
MARGIN = (48, 20, 48, 20)
IDS = (
    "F274-1", "F277-1", "U274-1", "U276-1",
    "U276-2", "U276-3", "U276-4", "U276-5",
)


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def binding(path):
    return {"path": str(path), "sha256": sha256(path)}


def main():
    assert Path.cwd() == CWD
    findings_report = json.loads((REVIEW / "report.json").read_text())
    findings = findings_report["findings"]
    assert tuple(item["id"] for item in findings) == IDS
    assert {item["page"] for item in findings} == set(PAGES)
    assert not (OWNED / "crop-manifest.json").exists()
    crop_dir = OWNED / "crops"
    crop_dir.mkdir(parents=True, exist_ok=True)
    assert not list(crop_dir.iterdir())

    implementation = LAYOUT_IMPL.read_text()
    module = ast.parse(implementation)
    overlay = next(
        node for node in module.body
        if isinstance(node, ast.FunctionDef) and node.name == "grid_overlay"
    )
    function_source = ast.get_source_segment(implementation, overlay)
    attribute_calls = {
        node.func.attr for node in ast.walk(overlay)
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute)
    }
    assert not attribute_calls & {
        "resize", "thumbnail", "transform", "rotate", "crop", "transpose",
    }
    assert "img.width" in function_source and "img.height" in function_source
    assert 'Image.open(png).convert("RGB")' in function_source
    grid_assignment = next(
        node for node in module.body
        if isinstance(node, ast.Assign)
        and any(isinstance(target, ast.Name) and target.id == "GRID"
                for target in node.targets)
    )
    assert ast.literal_eval(grid_assignment.value) == 100
    metadata = {
        "schema": "ld-s10y-lesson/affected-native-crop-manifest@1",
        "cwd": str(CWD),
        "source_only": True,
        "candidate_text_read": False,
        "image_opens": 0,
        "crop_resampling": "none",
        "margin_left_top_right_bottom": list(MARGIN),
        "grid_overlay": {
            **binding(LAYOUT_IMPL),
            "function": "grid_overlay",
            "start_line": overlay.lineno,
            "end_line": overlay.end_lineno,
            "function_sha256": hashlib.sha256(
                function_source.encode()
            ).hexdigest(),
            "function_source": function_source,
            "grid_step_native_pixels": 100,
            "geometric_transform_calls": [],
            "proof": "Draws grid lines and coordinate labels on an RGB conversion "
                     "of the input canvas, using img.width/img.height; no "
                     "resizing, cropping, rotation or coordinate transform.",
        },
        "input_bindings": [
            binding(REVIEW / "report.json"),
            binding(FIRST / "report.json"),
            binding(FIRST / "author-freeze.json"),
            *[binding(REVIEW / f"source-{page:04d}.freeze.json")
              for page in PAGES],
        ],
        "reused_without_opening": {
            "page275_SOURCE": "Existing FIRST SOURCE PASS reused as directed; "
                              "no page275 file read, hash-read or image open.",
            "RAWPNG": "All three existing RAW PNG PASS results reused as "
                      "directed; no RAW figure read, hash-read or image open.",
        },
        "pages": {},
        "crops": [],
    }
    images = {}
    try:
        for page in PAGES:
            directory = SOURCE / f"{page:04d}"
            png = directory / "page.png"
            grid_path = directory / "page.grid.png"
            layout_path = directory / "layout.json"
            layout = json.loads(layout_path.read_text())
            image = Image.open(png)
            image.load()
            images[page] = image
            with Image.open(grid_path) as grid:
                grid.load()
                assert image.size == grid.size == (layout["w"], layout["h"])
                # These pixels are away from the overlay's lines and labels.
                unchanged_boxes = []
                for y in range(50, image.height - 40, 100):
                    for x in range(50, image.width - 40, 100):
                        box = (x, y, x + 40, y + 40)
                        difference = ImageChops.difference(
                            image.crop(box).convert("RGB"),
                            grid.crop(box).convert("RGB"),
                        )
                        assert difference.getbbox() is None, (page, box)
                        unchanged_boxes.append(list(box))
                grid_size = list(grid.size)
            expected = findings_report["input_hashes"]["source_image_sha256"]
            assert sha256(png) == expected[f"{page:04d}/page.png"]
            assert sha256(grid_path) == expected[f"{page:04d}/page.grid.png"]
            metadata["pages"][str(page)] = {
                "page_png": binding(png),
                "page_grid_png": binding(grid_path),
                "layout_json": binding(layout_path),
                "page_png_size": list(image.size),
                "page_grid_png_size": grid_size,
                "layout_w_h": [layout["w"], layout["h"]],
                "grid_to_native_scale_xy": [1, 1],
                "grid_to_native_offset_xy": [0, 0],
                "unchanged_native_pixel_test_boxes": unchanged_boxes,
                "unchanged_native_pixel_tests_pass": True,
                "whole_page_visual_opened": False,
                "whole_grid_visual_opened": False,
            }
        for item in findings:
            page = item["page"]
            image = images[page]
            x, y, w, h = item["future_focus_xywh"]
            assert all(isinstance(v, int) for v in (x, y, w, h))
            assert 0 <= x < x + w <= image.width
            assert 0 <= y < y + h <= image.height
            left = max(0, x - MARGIN[0])
            top = max(0, y - MARGIN[1])
            right = min(image.width, x + w + MARGIN[2])
            bottom = min(image.height, y + h + MARGIN[3])
            output = crop_dir / f"{item['id']}.png"
            assert not output.exists()
            crop = image.crop((left, top, right, bottom))
            crop.save(output)
            actual = [left, top, right - left, bottom - top]
            assert crop.size == tuple(actual[2:])
            metadata["crops"].append({
                "id": item["id"],
                "page": page,
                "future_focus_xywh": item["future_focus_xywh"],
                "actual_native_xywh": actual,
                "actual_native_ltrb": [left, top, right, bottom],
                "margin_rationale": "48 native pixels at each horizontal edge "
                                    "and 20 at each vertical edge retain nearby "
                                    "text and complete punctuation/strokes.",
                "source_page": binding(SOURCE / f"{page:04d}/page.png"),
                "crop": binding(output),
                "crop_size": list(crop.size),
                "native_to_crop_scale_xy": [1, 1],
                "native_to_crop_translation_xy": [-left, -top],
                "resampled": False,
            })
        assert len(list(crop_dir.glob("*.png"))) == 8
        metadata["script"] = binding(Path(__file__).resolve())
        manifest = OWNED / "crop-manifest.json"
        manifest.write_text(
            json.dumps(metadata, ensure_ascii=False, indent=2) + "\n"
        )
        print(json.dumps({
            "manifest": binding(manifest),
            "page_sizes": {
                key: value["page_png_size"]
                for key, value in metadata["pages"].items()
            },
            "crops": metadata["crops"],
        }, ensure_ascii=False, indent=2))
    finally:
        for image in images.values():
            image.close()


if __name__ == "__main__":
    main()
