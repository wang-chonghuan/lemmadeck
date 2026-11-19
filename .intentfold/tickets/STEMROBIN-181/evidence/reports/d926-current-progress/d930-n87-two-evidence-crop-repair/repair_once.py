import hashlib
import json
from pathlib import Path

from PIL import Image

REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
assert Path.cwd() == REPO
OUT = Path(__file__).parent
TICKET = REPO / ".intentfold/tickets/STEMROBIN-181"
CAPTURE = TICKET / "tmp/d910-n87-first-dom-capture"
FIRST = TICKET / "tmp/d923-n87-first-display-figure-detail/report.json"


def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def save(name, data):
    with (OUT / name).open("x", encoding="utf-8") as stream:
        json.dump(data, stream, indent=2)
        stream.write("\n")


assert not (OUT / "started.json").exists()
first = json.loads(FIRST.read_text())
assert first["status"] == "FAIL"
failures = [o for o in first["observations"] if o["verdict"] == "FAIL"]
assert [o["recipeId"] for o in failures] == [
    "en-text-390-fig-201", "en-text-390-fig-202",
]
recipes_file = CAPTURE / "crop-recipes.json"
assert sha(recipes_file) == "65f36b384d4ac2b0aee732e59d2a8faf82fde5c18e3537d2be57cfdd460a0ab7"
recipes = {r["id"]: r for r in json.loads(recipes_file.read_text())["recipes"]}
source = Path(recipes[failures[0]["recipeId"]]["source"]["path"])
assert sha(source) == "4560bd2036631f78b0ad8f5ed75b0dbd4a0dc5437aeaade0fb1faf2f84abc94d"
save("started.json", {
    "firstReview": {"path": str(FIRST), "sha256": sha(FIRST)},
    "source": {"path": str(source), "sha256": sha(source)},
    "scope": "Only two incomplete evidence crops; no page or content repair",
})
image = Image.open(source)
assert image.size == (375, 11363)
outputs = []
for finding in failures:
    recipe = recipes[finding["recipeId"]]
    old = recipe["crop"]
    tile_height = recipe["viewport"]["height"]
    # Include the preceding full-coverage tile instead of assuming the missing ink's offset.
    top = max(0, (old["top"] // tile_height - 1) * tile_height)
    bottom = min(image.height, ((old["top"] + old["height"] + tile_height - 1) // tile_height) * tile_height)
    destination = OUT / (recipe["id"] + "-expanded-evidence.png")
    assert not destination.exists()
    image.crop((0, top, image.width, bottom)).save(destination)
    outputs.append({
        "recipeId": recipe["id"], "source": recipe["source"], "originalRecipe": recipe,
        "crop": {"left": 0, "top": top, "width": image.width, "height": bottom - top},
        "path": str(destination), "sha256": sha(destination), "resized": False,
        "materializedOnce": True, "openedIntoModel": False,
        "criterion": "Complete English mobile figure including previously missing upper labels",
    })
save("report.json", {
    "schema": "STEMROBIN-181/d930-evidence-crop-repair@1",
    "ticket": "STEMROBIN-181", "card": "phy10-c2-s3-n87",
    "status": "TWO-EXPANDED-EVIDENCE-CROPS-READY-INDEPENDENT-AFFECTED-REVIEW-PENDING",
    "firstReview": {"path": str(FIRST), "sha256": sha(FIRST)}, "outputs": outputs,
    "diagnosis": "The exact assigned crops omit upper figure targets despite the saved DOM boxes predicting containment. This is established evidence insufficiency; the screenshot-to-DOM offset cause is not inferred or waived.",
    "repair": "Use untouched original screenshot pixels, from the full-coverage tile preceding the failed window through the tile containing its bottom. Independent review must determine whether all figure targets are actually present.",
    "previousSixRegionPassReplayed": False, "originalScreenshotChanged": False,
    "nativeRenderOrScreenshotReplays": 0, "parentNewImages": 0, "paidCalls": 0,
    "DISPLAY": False, "completeCard": False, "firstFailuresPreserved": True,
})
save("freeze.json", {
    "report": {"path": str(OUT / "report.json"), "sha256": sha(OUT / "report.json")},
    "outputs": [{"path": o["path"], "sha256": o["sha256"]} for o in outputs],
})
print(json.dumps({"report": str(OUT / "report.json"), "sha256": sha(OUT / "report.json"),
                  "outputs": len(outputs), "parentNewImages": 0}))
