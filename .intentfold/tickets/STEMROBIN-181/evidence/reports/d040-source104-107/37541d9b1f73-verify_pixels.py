"""Read-only RAW65 binding and pixel verification; never invokes native tools."""

import hashlib
import io
import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image


W = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = W / ".intentfold/tickets/STEMROBIN-181"
A = W / "tmp/d040-10p-source104-107-author"
E = T / "tmp/d040-10p-raw65-review-evidence"
FREEZE_SHA = "3923b7e3391d79c2b0da5e9238a8be99b234cf713bcf196686f5f33bef0b0b46"
CONTEXT_SHA = "9a0e9af22001b40da12fc53645fc30cde7901b03c95ad7913089cd416bb62486"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def bound_file(path, expected_sha, expected_bytes=None):
    data = path.read_bytes()
    result = {
        "path": str(path),
        "sha256": digest(data),
        "bytes": len(data),
        "expectedSha256": expected_sha,
        "expectedBytes": expected_bytes,
        "status": "PASS" if digest(data) == expected_sha
        and (expected_bytes is None or len(data) == expected_bytes) else "FAIL",
    }
    return data, result


freeze_bytes, freeze_binding = bound_file(
    A / "author-freeze.json", FREEZE_SHA
)
context_bytes, context_binding = bound_file(
    T / "tmp/d040-10p-source104-107-review.json", CONTEXT_SHA
)
freeze = json.loads(freeze_bytes)
artifact_map = {entry["path"]: entry for entry in freeze["artifacts"]}
input_path = A / "input-bindings.json"
input_entry = artifact_map[str(input_path.relative_to(W))]
input_bytes, input_binding = bound_file(
    input_path, input_entry["sha256"], input_entry["bytes"]
)
inputs = json.loads(input_bytes)

artifact_bindings = []
for entry in freeze["artifacts"]:
    if "/0105/" not in entry["path"]:
        continue
    if entry["path"].endswith("page.grid.png"):
        continue
    _, binding = bound_file(W / entry["path"], entry["sha256"], entry["bytes"])
    artifact_bindings.append(binding)

input_bindings = []
for entry in inputs["inputs"]:
    if not (
        entry["path"].endswith(".pdf")
        or entry["path"] in {
            ".agents/skills/ld-s10y-image/SKILL.md",
            ".claude/skills/ld-s10y-lesson/SKILL.md",
            ".claude/skills/ld-s10y-lesson/tools/p2c.py",
            ".claude/skills/ld-s10y-lesson/tools/layout.py",
        }
    ):
        continue
    _, binding = bound_file(W / entry["path"], entry["sha256"], entry["bytes"])
    input_bindings.append(binding)

source_path = A / "native-work/10p/pages/0105/page.png"
crop_path = A / "native-work/10p/pages/0105/figures/fig-65.png"
audit_path = A / "native/10p/pages/0105/audit.json"
page_path = A / "native/10p/pages/0105/page.json"
audit = json.loads(audit_path.read_bytes())
page = json.loads(page_path.read_bytes())
figure = [f for f in audit["figures"] if f["id"] == "fig-65"]
assert len(figure) == 1, "RAW65 must have exactly one audit geometry entry"
figure = figure[0]
meta_figure = [f for f in page["meta"]["figures"] if f["id"] == "fig-65"]
block = [b for b in page["blocks"] if b.get("id") == "fig-65"]
assert len(meta_figure) == len(block) == 1
assert figure["box"] == meta_figure[0]["box"] == block[0]["box"]
assert audit["page"] == page["meta"]["page"] == 105
assert page["meta"]["printed_page"] == 95
assert page["meta"]["source"]["pdf_page"] == 105
assert not page["meta"].get("figure_crops")
assert "crop_padding_px" not in figure
assert not figure.get("crop_excluded_figures")

source_bytes = source_path.read_bytes()
crop_bytes = crop_path.read_bytes()
with Image.open(io.BytesIO(source_bytes)) as source:
    source.load()
    with Image.open(io.BytesIO(crop_bytes)) as crop:
        crop.load()
        x, y, width, height = figure["box"]
        padding = 12
        extent = [
            max(0, x - padding),
            max(0, y - padding),
            min(source.width, x + width + padding),
            min(source.height, y + height + padding),
        ]
        expected = source.crop(tuple(extent))
        expected_pixels = np.asarray(expected)
        crop_pixels = np.asarray(crop)
        same_shape = expected_pixels.shape == crop_pixels.shape
        mismatch = (
            np.any(expected_pixels != crop_pixels, axis=2)
            if same_shape and crop_pixels.ndim == 3
            else expected_pixels != crop_pixels if same_shape else None
        )
        different_pixels = int(mismatch.sum()) if mismatch is not None else None
        encoded = io.BytesIO()
        expected.save(encoded, format="PNG")
        encoded_bytes = encoded.getvalue()
        gray = np.asarray(crop.convert("L"))
        ink = gray < 200
        ys, xs = np.nonzero(ink)
        ink_extent = [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1]
        edges = {
            "top": int(ink[0, :].sum()),
            "bottom": int(ink[-1, :].sum()),
            "left": int(ink[:, 0].sum()),
            "right": int(ink[:, -1].sum()),
        }
        pixels = {
            "status": "PASS" if same_shape and different_pixels == 0 else "FAIL",
            "sourcePath": str(source_path),
            "cropPath": str(crop_path),
            "auditPath": str(audit_path),
            "sourceDimensions": list(source.size),
            "sourceMode": source.mode,
            "sourceRenderHashMatchesPageMetadata": digest(source_bytes) == page["meta"]["render"]["sha256"],
            "sourceDimensionsMatchPageMetadata": list(source.size) == [
                page["meta"]["render"]["w"], page["meta"]["render"]["h"]
            ],
            "auditBoxXYWH": figure["box"],
            "candidateBoxFromAuditNotUsedForCropping": figure["from"],
            "auditComponentsNotUsedAsSemanticInventory": figure["components"],
            "paddingPx": padding,
            "paddingBasis": "No override: p2c.py _figure_crop_padding returns 12.",
            "exclusions": [],
            "extentLTRBExclusive": extent,
            "coordinateRule": "left/top included, right/bottom excluded",
            "cropDimensions": list(crop.size),
            "expectedDimensions": list(expected.size),
            "cropMode": crop.mode,
            "expectedMode": expected.mode,
            "sameShape": same_shape,
            "comparedPixelCount": expected.width * expected.height,
            "differentPixelCount": different_pixels,
            "decodedPixelSha256": digest(crop_pixels.tobytes()),
            "expectedDecodedPixelSha256": digest(expected_pixels.tobytes()),
            "sourceRegionPngSha256InMemory": digest(encoded_bytes),
            "sourceRegionPngBytesInMemory": len(encoded_bytes),
            "sourceRegionEncodedByteEquality": encoded_bytes == crop_bytes,
            "inkThreshold": "grayscale < 200; mechanical boundary diagnostic only",
            "inkExtentLTRBExclusive": ink_extent,
            "boundaryInkPixelCounts": edges,
            "boundaryDiagnosticIsNotSemanticEvidence": True,
            "derivedImageWrittenOrOpened": False,
            "nativeCommandsOrModulesInvoked": False,
        }

all_bindings = [freeze_binding, context_binding, input_binding] + artifact_bindings + input_bindings
snapshot_unchanged = all(
    digest(Path(b["path"]).read_bytes()) == b["sha256"]
    for b in all_bindings
)
checks = {
    "bindingsMatch": all(b["status"] == "PASS" for b in all_bindings),
    "pixelEquality": pixels["status"] == "PASS",
    "sourceMetadataMatches": pixels["sourceRenderHashMatchesPageMetadata"]
    and pixels["sourceDimensionsMatchPageMetadata"],
    "currentInputsUnchangedAfterPixelVerification": snapshot_unchanged,
}
result = {
    "schema": "ld-s10y-raw65-independent-pixel-evidence@1",
    "ticket": "STEMROBIN-181",
    "recordedAt": datetime.now(timezone.utc).isoformat(),
    "status": "PASS" if all(checks.values()) else "FAIL",
    "scope": "RAW65 only; other SOURCE/RAW approvals consumed as text context, not replayed.",
    "checks": checks,
    "authorFreeze": freeze_binding,
    "contextReview": context_binding,
    "inputManifest": input_binding,
    "owningPageArtifactBindings": artifact_bindings,
    "sourceAndContractInputBindings": input_bindings,
    "pixels": pixels,
    "visualImagesOpened": 2,
    "evidenceOutput": str(E / "pixel-verification.json"),
}
output = E / "pixel-verification.json"
with output.open("x", encoding="utf-8") as stream:
    json.dump(result, stream, ensure_ascii=True, indent=2)
    stream.write("\n")
print(json.dumps({
    "status": result["status"],
    "checks": checks,
    "pixels": pixels,
    "path": str(output),
    "sha256": digest(output.read_bytes()),
}, indent=2))
raise SystemExit(0 if result["status"] == "PASS" else 1)
