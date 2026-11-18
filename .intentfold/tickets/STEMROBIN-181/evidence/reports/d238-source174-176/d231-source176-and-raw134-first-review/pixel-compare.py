import ast
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = Path(__file__).resolve().parent
TOOL = ROOT / ".claude/skills/ld-s10y-lesson/tools/vectorize.py"
RAW = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d216-source174-175-first-author/work/10p/pages/0175/figures/fig-134.png"
PREVIEW = OUT / "fig-134.svg-preview.png"

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
# Execute only the existing mask/dilation primitives, never the vectorizer.
tree = ast.parse(TOOL.read_text())
nodes = [
    node for node in tree.body
    if isinstance(node, ast.FunctionDef) and node.name in {"_ink", "_dilate"}
    or isinstance(node, ast.Assign)
    and any(isinstance(t, ast.Name) and t.id in {"INK_THRESHOLD", "EDGE_TOLERANCE", "MISMATCH_LIMIT"} for t in node.targets)
]
namespace = {"np": np, "Image": Image, "Path": Path}
exec(compile(ast.Module(body=nodes, type_ignores=[]), str(TOOL), "exec"), namespace)
src = namespace["_ink"](RAW)
got = namespace["_ink"](PREVIEW)
if src.shape != got.shape:
    raise RuntimeError("Preview dimensions differ from RAW.")
src_d = namespace["_dilate"](src, namespace["EDGE_TOLERANCE"])
got_d = namespace["_dilate"](got, namespace["EDGE_TOLERANCE"])
missing = int((src & ~got_d).sum())
extra = int((got & ~src_d).sum())
ink = int(src.sum())
ratio = (missing + extra) / ink if ink else 0.0
result = {
    "schema": "stemrobin/existing-native-svg-pixel-comparison@1",
    "source": {"path": str(RAW), "sha256": sha(RAW)},
    "preview": {"path": str(PREVIEW), "sha256": sha(PREVIEW)},
    "existingAlgorithm": {"path": str(TOOL), "sha256": sha(TOOL), "executedFunctions": ["_ink", "_dilate"]},
    "size": [int(src.shape[1]), int(src.shape[0])],
    "inkPixels": ink,
    "missingPixels": missing,
    "extraPixels": extra,
    "mismatchRatio": ratio,
    "mismatchPercent": ratio * 100,
    "limitRatio": namespace["MISMATCH_LIMIT"],
    "tolerancePx": namespace["EDGE_TOLERANCE"],
    "status": "PASS" if ratio <= namespace["MISMATCH_LIMIT"] else "FAIL",
    "imagePayloadsLoadedIntoConversation": 0,
    "vectorizeInvoked": False,
    "rawRecropped": False,
}
with (OUT / "raw134-pixel-comparison.json").open("x") as handle:
    json.dump(result, handle, indent=2)
    handle.write("\n")
print(json.dumps(result))
