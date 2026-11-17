"""Read-only native figure-contract checks; no finalize, review or promotion."""

import importlib.util
import json
import os
import sys
from pathlib import Path

W = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
A = W / ".intentfold/tickets/STEMROBIN-181/tmp/d045-10p-fig83-author"
tools = W / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(tools))
os.environ["PYTHONDONTWRITEBYTECODE"] = "1"
module_spec = importlib.util.spec_from_file_location("edition", tools / "edition.py")
edition = importlib.util.module_from_spec(module_spec)
module_spec.loader.exec_module(edition)
F = A / "frozen"
figure = {"id": "fig-83", "mode": "hybrid"}
spec_path = F / "fig-83.spec.json"
render_path = F / "fig-83.render.json"
checks = {
    "native_vector": edition.validate_svg(
        F / "fig-83.svg", spec_path, figure,
        metadata_path=render_path, expected_modes={"hybrid"}
    ),
    "native_artwork": edition.validate_artwork(
        F / "fig-83.artwork.png", render_path, spec_path, figure
    ),
}
result = {
    "schema": "ld-s10y-image/native-final-author-check@1",
    "status": "PASS" if not any(checks.values()) else "FAIL",
    "checks": checks,
    "nativeReviewWritten": False,
    "finalizeOrPromotionRun": False,
    "renderMetadataContextReboundNotRegenerated": True,
}
output = A / "receipts/native-final-author.json"
if output.exists():
    raise RuntimeError("Refusing receipt overwrite")
output.write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result))
sys.exit(0 if result["status"] == "PASS" else 1)
