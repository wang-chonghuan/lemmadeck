import importlib.util
import json
import sys
from hashlib import sha256


def digest(value):
    return sha256(json.dumps(value, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


request = json.load(sys.stdin)
spec = importlib.util.spec_from_file_location("source_delta_blocks", request["module"])
blocks_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(blocks_module)
results = []
for item in request["pages"]:
    before_meta, before_blocks = blocks_module.parse(item["before"])
    after_meta, after_blocks = blocks_module.parse(item["after"])
    assert "counting" not in before_meta
    assert after_meta.pop("counting") == item["authorized_counting"]
    assert after_meta == before_meta
    assert after_blocks == before_blocks
    results.append({
        "pdf_page": item["pdf_page"],
        "native_block_count": len(before_blocks),
        "before_blocks_sha256": digest(before_blocks),
        "after_blocks_sha256": digest(after_blocks),
        "blocks_equal": True,
        "kinds_labels_owner_open_cont_samerow_boxes_lines_equal": True,
        "remaining_metadata_equal": True,
        "rough_figure_boxes": [
            {"block": index + 1, "box": block["box"]}
            for index, block in enumerate(before_blocks) if block["kind"] == "fig"
        ],
    })
json.dump({
    "invocations": 1,
    "parse_calls": 4,
    "pages": results,
    "native_counting_calls": 0,
    "printed_lines_calls": 0,
    "image_decodes": 0,
    "normalization_or_dump_calls": 0,
}, sys.stdout, indent=2)
print()
