import hashlib
import json
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parent
source = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d494-source198-first-preparation/work/10p/pages/0198/page.png")
baseline = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d497-source198-first-independent-text-review/source-inventory.json")
source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
baseline_hash = hashlib.sha256(baseline.read_bytes()).hexdigest()
assert source_hash == "bfb409c988f367effd26d20ce5039baf5b7b21f2579b93eef3dc1672228b4bc2"
assert baseline_hash == "3e1456cfc2213308eceaf6451d6fde849504f15abec38cb66b33724297df67fd"
output = root / "source198-p5-line2.original-strip.png"
assert not output.exists(), "First source strip already exists; no regeneration."
# One source row chosen from this helper's sealed original-grid observation.
box = (150, 1235, 1325, 1305)
with Image.open(source) as original:
    strip = original.crop(box)
    assert strip.size == (1175, 70)
    strip.save(output)
receipt = {
    "schema": "d507-first-unscaled-source-strip@1",
    "source": {"path": str(source), "sha256": source_hash},
    "own_sealed_inventory": {"path": str(baseline), "sha256": baseline_hash},
    "source_object": "s198-p5",
    "source_printed_line": 2,
    "source_grid_selection": list(box),
    "selection_reason": "Only the previously observed image-paragraph second printed row, including 物体 and neighboring regular glyphs for a fresh style comparison.",
    "author_bbox_or_style_used_to_select_expected_font": False,
    "resizing_resampling_scaling_or_pixel_filtering": False,
    "output": {
        "path": str(output),
        "sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
        "width": 1175,
        "height": 70,
    },
    "pixel_observations_performed_by_script": 0,
    "image_open_count_in_context_before_view": 22,
    "no_candidate_style_read_in_this_new_detail_batch": True,
}
receipt_path = root / "crop-receipt.json"
with receipt_path.open("x", encoding="utf8") as handle:
    json.dump(receipt, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
output.chmod(0o444)
receipt_path.chmod(0o444)
Path(__file__).chmod(0o444)
print(json.dumps(receipt, ensure_ascii=False, indent=2))
