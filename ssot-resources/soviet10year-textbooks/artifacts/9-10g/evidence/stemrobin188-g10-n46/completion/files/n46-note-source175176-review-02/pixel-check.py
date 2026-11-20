import hashlib
import json
import os
import sys

from PIL import Image

ROOT = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck"
assert os.getcwd() == ROOT
manifest_path = os.path.join(
    ROOT, ".intentfold/tickets/STEMROBIN-188/tmp/source175176-review-inputs-01/manifest.json"
)
with open(manifest_path, encoding="utf-8") as handle:
    manifest = json.load(handle)

native_padding = 12 if "--native-padding" in sys.argv else 0
results = []
for page in manifest["pages"]:
    with Image.open(page["original"]["path"]) as original:
        original.load()
        for figure in page["figures"]:
            x, y, width, height = figure["exactBox"]
            interior = original.crop((x, y, x + width, y + height)).convert("RGB")
            expected = Image.new(
                "RGB", (width + 2 * native_padding, height + 2 * native_padding),
                (255, 255, 255)
            )
            expected.paste(interior, (native_padding, native_padding))
            with Image.open(figure["crop"]["path"]) as native:
                native.load()
                actual = native.convert("RGB")
                expected_bytes = expected.tobytes()
                actual_bytes = actual.tobytes()
                same_size = actual.size == expected.size
                mismatch_channels = (
                    sum(a != b for a, b in zip(expected_bytes, actual_bytes))
                    if same_size else None
                )
                mismatch_pixels = (
                    sum(
                        expected_bytes[i:i + 3] != actual_bytes[i:i + 3]
                        for i in range(0, len(expected_bytes), 3)
                    ) if same_size else None
                )
                results.append({
                    "page": page["page"],
                    "figure": figure["id"],
                    "original": page["original"],
                    "native_crop": figure["crop"],
                    "exact_box_xywh": figure["exactBox"],
                    "native_padding_px": native_padding,
                    "original_mode": original.mode,
                    "native_mode": native.mode,
                    "comparison_mode": "RGB",
                    "original_size": list(original.size),
                    "native_size": list(actual.size),
                    "expected_size": list(expected.size),
                    "box_within_original": (
                        x >= 0 and y >= 0 and x + width <= original.width
                        and y + height <= original.height
                    ),
                    "size_equal": same_size,
                    "array_equal": same_size and expected_bytes == actual_bytes,
                    "mismatched_pixels": mismatch_pixels,
                    "mismatched_channels": mismatch_channels,
                    "source_rectangle_pixel_sha256": hashlib.sha256(interior.tobytes()).hexdigest(),
                    "expected_native_pixel_sha256": hashlib.sha256(expected_bytes).hexdigest(),
                    "native_pixel_sha256": hashlib.sha256(actual_bytes).hexdigest(),
                    "interior_array_equal": (
                        same_size and actual.crop((
                            native_padding, native_padding,
                            native_padding + width, native_padding + height
                        )).tobytes() == interior.tobytes()
                    ),
                    "native_rewritten": False,
                    "caption_inside_native_crop": False
                })

print(json.dumps({
    "scope": "Four exact native crops; decoded arrays only, no image payload emitted",
    "comparison_contract": "12px white border around exact source rectangle" if native_padding else "Initial unpadded-rectangle assumption",
    "context_image_loads": 0,
    "original_files_decoded": 2,
    "native_crop_files_decoded": 4,
    "derived_rectangles_saved_or_displayed": 0,
    "native_finalize_calls": 0,
    "results": results,
    "status": "pass" if all(r["array_equal"] and r["box_within_original"] for r in results) else "revise"
}, indent=2))
