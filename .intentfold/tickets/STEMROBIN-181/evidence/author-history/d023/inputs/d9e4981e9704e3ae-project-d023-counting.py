import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tools").resolve()))
import blocks

candidate, layout_path, review_path = map(Path, sys.argv[1:])
review = json.loads(review_path.read_text())
assert review["status"] == "pass"
approved = next(page for page in review["effective_pages"] if page["pdf_page"] == 220)
assert approved["effective_counting_override_approved"] is True
assert approved["exact_saved_counting_mask_approved"] is True
layout = json.loads(layout_path.read_text())
assert layout["counting"] == approved["effective_counting_override"]
meta, body = blocks.parse(candidate.read_text())
assert meta["page"] == 220
assert "counting" not in meta
meta["counting"] = layout["counting"]
projected = blocks.dump(meta, body, 220)
roundtrip_meta, roundtrip_body = blocks.parse(projected)
assert roundtrip_meta == meta
assert roundtrip_body == body
sys.stdout.write(projected)
