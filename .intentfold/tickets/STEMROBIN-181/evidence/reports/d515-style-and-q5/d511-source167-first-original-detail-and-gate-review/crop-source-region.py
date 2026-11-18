import hashlib
import json
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parent
source = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d494-source198-first-preparation/work/10p/pages/0198/page.png")
baseline = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d497-source198-first-independent-text-review/source-inventory.json")
ledger = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d507-source198-style-first-detail-review/actual-opens.json")
sha = lambda filename: hashlib.sha256(filename.read_bytes()).hexdigest()
assert sha(source) == "bfb409c988f367effd26d20ce5039baf5b7b21f2579b93eef3dc1672228b4bc2"
assert sha(baseline) == "3e1456cfc2213308eceaf6451d6fde849504f15abec38cb66b33724297df67fd"
assert sha(ledger) == "2f9165a64b9bb991158764e8327faf775eca65b108a631ae4d0159c2119e5f42"
prior = json.loads(ledger.read_text())
assert prior["context_cumulative_opens"] == 23
output = root / "source167-first-original-region.png"
assert not output.exists(), "First original region already exists; do not regenerate."
# Expand this helper's own x860-1260/y250-510 observation by15 pixels.
box = (845, 235, 1275, 525)
with Image.open(source) as original:
    region = original.crop(box)
    assert region.size == (430, 290)
    region.save(output)
bindings = {
    "schema": "d511-first-original-source-region-bindings@1",
    "source": {"path": str(source), "sha256": sha(source)},
    "own_preexposure_inventory": {"path": str(baseline), "sha256": sha(baseline)},
    "source_object": "s198-fig167",
    "region_selected_from_own_grid_observation": list(box),
    "author_bbox_or_candidate_shapes_used_for_selection": False,
    "resize_resample_pixel_filter_or_new_render": False,
    "detail": {"path": str(output), "sha256": sha(output), "width": 430, "height": 290},
    "prior_actual_ledger": {"path": str(ledger), "sha256": sha(ledger)},
    "prior_context_actual_opens": 23,
    "permitted_new_original_region_observations": 1,
    "maximum_after_observation": 24,
    "candidate_image_reopens_permitted": 0,
    "machine_crop_not_a_context_image_observation": True,
}
with (root / "detail-bindings.json").open("x", encoding="utf8") as handle:
    json.dump(bindings, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
for filename in [output, root / "detail-bindings.json", Path(__file__)]:
    filename.chmod(0o444)
print(json.dumps(bindings, ensure_ascii=False, indent=2))
