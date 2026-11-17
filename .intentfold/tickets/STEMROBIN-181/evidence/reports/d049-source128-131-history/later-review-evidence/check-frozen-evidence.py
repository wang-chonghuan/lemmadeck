import hashlib
import json
import re
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image


WORKSPACE = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
AUTHOR = WORKSPACE / ".intentfold/tickets/STEMROBIN-181/tmp/d047-10p-source128-131-author"
OWN = Path(__file__).resolve().parent
EXPECTED_FREEZE = "a978a990d57f6624343b3b8db9926321aa39aea2f94cb937b8cf60adbba26b6c"


def binding(file):
    data = file.read_bytes()
    return {"path": str(file), "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)}


def write_json(file, value):
    with file.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


def dilate(mask):
    result = mask.copy()
    for dy in range(-1, 2):
        for dx in range(-1, 2):
            result |= np.roll(np.roll(mask, dy, axis=0), dx, axis=1)
    return result


freeze_binding = binding(AUTHOR / "author-freeze.json")
assert freeze_binding["sha256"] == EXPECTED_FREEZE
freeze = json.loads((AUTHOR / "author-freeze.json").read_text())
inventory_errors = []
for entry in freeze["inventory"]:
    actual = binding(AUTHOR / entry["path"])
    if actual["sha256"] != entry["sha256"] or actual["bytes"] != entry["bytes"]:
        inventory_errors.append({"expected": entry, "actual": actual})
assert not inventory_errors, inventory_errors

# Preserve relevant input bytes without replacing any author or reviewer evidence.
selected = [
    "author-freeze.json",
    "process-notes.json",
    "observations.json",
    "observations.draft.json",
    "history/observed-p0131.json",
    "history/reconstructed-observation-v1-p0131.json",
    "history/observed-p0130.json",
    "history/inputs/01-10p 苏联中学课本 物理 十年级 .pdf",
]
for page in (130, 131):
    stem = f"{page:04d}"
    selected.extend(f"source/10p/pages/{stem}/{name}" for name in ("page.md", "page.json", "audit.json"))
    selected.append(f"work/10p/pages/{stem}/page.png")
    for operation in ("prepare", "finalize", "vectorize"):
        selected.extend(
            f"receipts/{operation}-{page}-initial{suffix}"
            for suffix in (".json", ".invocation.json", ".stdout.txt", ".stderr.txt")
        )
    for figure in freeze["pages"][page - 128]["figures"]:
        selected.extend(f"work/10p/pages/{stem}/figures/{figure}.{ext}" for ext in ("png", "svg"))
snapshots = []
for relative in selected:
    source = AUTHOR / relative
    destination = OWN / "inputs" / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    with destination.open("xb") as stream:
        stream.write(source.read_bytes())
    source_binding = binding(source)
    copy_binding = binding(destination)
    assert source_binding["sha256"] == copy_binding["sha256"]
    snapshots.append({"input": source_binding, "snapshot": copy_binding})

pages = []
figures = []
for page in (130, 131):
    stem = f"{page:04d}"
    source_dir = AUTHOR / f"source/10p/pages/{stem}"
    work_dir = AUTHOR / f"work/10p/pages/{stem}"
    structured = json.loads((source_dir / "page.json").read_text())
    md = (source_dir / "page.md").read_text()
    body = md.split("\n---\n", 1)[1]
    chunks = re.split(r"^<!-- (.*?) -->\n", body, flags=re.MULTILINE)
    parsed = []
    for index in range(1, len(chunks), 2):
        header, text = chunks[index], chunks[index + 1]
        lines = [line for line in text.splitlines() if line.strip()]
        parsed.append({"header": header, "lines": lines})
    assert len(parsed) == len(structured["blocks"])
    block_comparisons = []
    rows = 0
    for index, (raw, block) in enumerate(zip(parsed, structured["blocks"]), 1):
        kind = raw["header"].split()[0]
        lines = [] if kind == "fig" else raw["lines"]
        assert kind == block["kind"] and lines == block["lines"]
        if kind != "fig":
            rows += sum(1 + line.count("↵") for line in lines)
            if block["samerow"]:
                rows -= len(lines) if kind == "cap" else 1
        block_comparisons.append({"block": index, "kind": kind, "md_json_lines_equal": True})
    pages.append({
        "page": page,
        "serialized_visual_rows": rows,
        "native_audit": json.loads((source_dir / "audit.json").read_text()),
        "md_json_block_comparisons": block_comparisons,
    })
    parent = Image.open(work_dir / "page.png").convert("RGB")
    for figure in structured["meta"]["figures"]:
        identifier = figure["id"]
        png = work_dir / f"figures/{identifier}.png"
        svg = work_dir / f"figures/{identifier}.svg"
        actual = Image.open(png).convert("RGB")
        x, y, width, height = figure["box"]
        rectangle = [max(0, x - 12), max(0, y - 12), min(parent.width, x + width + 12), min(parent.height, y + height + 12)]
        expected = parent.crop(rectangle)
        assert expected.size == actual.size
        differences = np.any(np.asarray(expected) != np.asarray(actual), axis=2)
        raster = OWN / f"{identifier}.existing-svg.native.png"
        process = subprocess.run(
            ["node", str(OWN / "render-existing-svg.mjs"), str(svg), str(raster)],
            check=True, capture_output=True, text=True,
        )
        source_ink = np.asarray(actual.convert("L")) < 128
        raster_image = Image.open(raster)
        rendered_ink = np.asarray(raster_image.convert("L")) < 128
        assert source_ink.shape == rendered_ink.shape
        missing = int((source_ink & ~dilate(rendered_ink)).sum())
        extra = int((rendered_ink & ~dilate(source_ink)).sum())
        ink_pixels = int(source_ink.sum())
        ratio = (missing + extra) / ink_pixels if ink_pixels else 0
        figures.append({
            "page": page, "id": identifier, "parent": binding(work_dir / "page.png"),
            "png": binding(png), "svg": binding(svg), "raster": binding(raster),
            "snapped_box_xywh": figure["box"], "padding_px": 12,
            "parent_rectangle_ltrb": rectangle, "crop_size": list(actual.size),
            "parent_different_rgb_pixels": int(differences.sum()),
            "native_svg_parity": {
                "method": "Existing SVG rendered with installed Resvg, white background, intrinsic dimensions; native threshold128, 1px square dilation, missing+extra divided by source ink.",
                "source_ink_pixels": ink_pixels, "missing_pixels": missing,
                "extra_pixels": extra, "mismatch_ratio": ratio, "limit": 0.02,
                "status": "PASS" if ratio <= 0.02 else "FAIL",
                "renderer_stdout": json.loads(process.stdout),
            },
        })

targeted = [
    (131, "p0131-terminology-detail.png", [170, 500, 1340, 710], "Resolve printed 体系 and emphasis boundary."),
    (131, "p0131-upholstery-detail.png", [170, 1360, 1340, 1440], "Compare candidate 色布 against the source 包布 strokes."),
    (130, "p0130-formula-detail.png", [160, 880, 1325, 1200], "Inspect speed glyph and both complete printed formulas without contextual guessing."),
]
crops = []
for page, filename, rectangle, reason in targeted:
    parent_path = AUTHOR / f"work/10p/pages/{page:04d}/page.png"
    image = Image.open(parent_path)
    target = OWN / filename
    assert not target.exists()
    image.crop(rectangle).save(target)
    crops.append({"file": binding(target), "parent": binding(parent_path), "rectangle_ltrb": rectangle, "reason": reason})

write_json(OWN / "mechanical-evidence.json", {
    "schema": "independent-source-raw-mechanical-evidence@1",
    "freeze": freeze_binding, "inventory_entries_verified": len(freeze["inventory"]),
    "inventory_errors": inventory_errors, "snapshots": snapshots,
    "pages": pages, "figures": figures, "targeted_crops": crops,
    "image_opens_by_this_script": 0,
    "prepare_invocations": 0, "finalize_invocations": 0, "vectorize_invocations": 0,
    "scope": "Read-only author inputs; existing SVG rasterization and diagnostic evidence only. No source mutation or generation pipeline rerun.",
    "review_helpers": [binding(Path(__file__).resolve()), binding(OWN / "render-existing-svg.mjs")],
})
print(json.dumps({"inventory_entries_verified": len(freeze["inventory"]), "pages": pages, "figures": figures, "targeted_crops": crops}, ensure_ascii=False, indent=2))
