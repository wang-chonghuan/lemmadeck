import hashlib
import json
from pathlib import Path

from PIL import Image


W = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
T = W / ".intentfold/tickets/STEMROBIN-188/tmp"
OWN = T / "n32-repair4-and-first-choice-surfaces-review-17"
SOURCE = (
    T
    / "offline-display-6-8g_geo68-c3-s1-n32-choices"
    / "geo68-c3-s1-n32/choices-390.png"
)
EXPECTED = "d6e262b1a3388809d101eb7c8b744ad11a841ac37b20542614e5b337cbab522a"


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


assert Path.cwd() == W
assert sha256(SOURCE) == EXPECTED
items = []
with Image.open(SOURCE) as image:
    assert image.size == (390, 8486)
    for name, box in [
        ("mobile-top.png", (0, 0, 390, 3000)),
        ("mobile-middle.png", (0, 2700, 390, 5700)),
        ("mobile-bottom.png", (0, 5400, 390, 8486)),
    ]:
        target = OWN / name
        assert not target.exists()
        image.crop(box).save(target)
        items.append(
            {"path": str(target), "box": list(box), "sha256": sha256(target)}
        )
print(
    json.dumps(
        {
            "source": str(SOURCE),
            "sourceSha256": EXPECTED,
            "operation": "actual pixel crops only; no resize or rerender",
            "crops": items,
        },
        indent=2,
    )
)
