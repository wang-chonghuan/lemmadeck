from pathlib import Path
import hashlib
import json
import sys

import numpy as np
from PIL import Image

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout
import p2c

EVIDENCE = Path(__file__).resolve().parent
FREEZE = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0144-0147/author-freeze.json"


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def binding(path):
    return {"path": str(path), "sha256": sha(path)}


freeze = json.loads(FREEZE.read_text())
checked = []


def check_bindings(value):
    if isinstance(value, dict):
        if isinstance(value.get("path"), str) and isinstance(value.get("sha256"), str):
            path = Path(value["path"])
            if not path.is_absolute():
                path = ROOT / path
            actual = sha(path)
            checked.append({"path": str(path), "sha256": actual, "matches": actual == value["sha256"]})
        for child in value.values():
            check_bindings(child)
    elif isinstance(value, list):
        for child in value:
            check_bindings(child)


check_bindings(freeze)
result = {
    "role": "Independent read-only native measurements, not a substitute for actual visual source judgment.",
    "author_freeze": binding(FREEZE),
    "all_declared_file_bindings_verified": all(item["matches"] for item in checked),
    "declared_file_binding_checks": checked,
    "native_tools": {name: binding(TOOLS / name) for name in ("blocks.py", "layout.py", "p2c.py")},
    "pages": [],
    "figures": [],
}
for page in freeze["pages"]:
    number = page["pdf_page"]
    source = Path(page["source"]["path"])
    draft = Path(page["draft"]["path"])
    meta, parsed = blocks.load(draft)
    image = Image.open(source)
    ink = layout.ink_mask(image)
    masked = ink.copy()
    for declared in page["source_figures"]:
        fid = declared["id"]
        block_index, block = next(
            (i, b) for i, b in enumerate(parsed, 1)
            if b["kind"] == "fig" and blocks.fig_id(b["label"], number, 1) == fid
        )
        snapped, info = layout.snap(ink, block["box"])
        padding = p2c._figure_crop_padding(meta, fid)
        out = EVIDENCE / f"p{number:04d}-{fid}.png"
        layout.crop(source, snapped, out, pad=padding)
        x, y, w, h = snapped
        masked[y:y + h, x:x + w] = False
        result["figures"].append({
            "id": fid,
            "pdf_page": number,
            "block": f"p{number:04d}#{block_index}",
            "source": binding(source),
            "rough_box": block["box"],
            "snapped_box": snapped,
            "native_snap": info,
            "padding_px": padding,
            "exact_source_extraction_box": [
                max(0, x - padding), max(0, y - padding),
                min(image.width, x + w + padding) - max(0, x - padding),
                min(image.height, y + h + padding) - max(0, y - padding),
            ],
            "candidate_path": str(out),
            "candidate_sha256": sha(out),
            "frozen_author_candidate": declared["candidate"],
            "matches_frozen_author_candidate": sha(out) == declared["candidate"]["sha256"],
            "matches_frozen_native_geometry": snapped == declared["snapped_box"],
        })
    occupied = np.flatnonzero(ink.any(axis=0))
    content_w = int(occupied[-1] - occupied[0] + 1)
    default_bands = layout.line_bands(masked, content_w)
    configured_bands = p2c._counting_line_bands(meta, masked, content_w)
    row_inventory = []
    for index, block in enumerate(parsed, 1):
        row_inventory.append({
            "block": f"p{number:04d}#{index}",
            "kind": block["kind"],
            "label": block["label"],
            "printed_row_contribution": blocks.printed_lines([block]),
            "stored_lines": len(block["lines"]),
            "open": block["open"],
            "cont": block["cont"],
            "samerow": block["samerow"],
        })
    result["pages"].append({
        "pdf_page": number,
        "printed_page": meta["printed_page"],
        "source": binding(source),
        "draft": binding(draft),
        "source_pdf_sha256_declared": meta["source"]["pdf_sha256"],
        "render_binding_matches_source": meta["render"]["sha256"] == sha(source),
        "dimensions": list(image.size),
        "block_count": len(parsed),
        "block_inventory": row_inventory,
        "draft_printed_lines": blocks.printed_lines(parsed),
        "content_width": content_w,
        "native_default_count": len(default_bands),
        "native_default_bands": [list(b) for b in default_bands],
        "native_configured_count": len(configured_bands),
        "native_configured_bands": [list(b) for b in configured_bands],
        "counting": meta.get("counting"),
    })

# Unscaled source pixels for the single cross-row emphasis judgment.
detail = EVIDENCE / "p0147-emphasis-detail.png"
layout.crop(Path(freeze["pages"][3]["source"]["path"]), [164, 1360, 1165, 155], detail, pad=0)
result["detail_evidence"] = [dict(binding(detail), source_box=[164, 1360, 1165, 155])]
out = EVIDENCE / "native-measurements.json"
out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "evidence": binding(out),
    "author_freeze": result["author_freeze"],
    "all_declared_file_bindings_verified": result["all_declared_file_bindings_verified"],
    "binding_checks": len(checked),
    "pages": [{key: p[key] for key in (
        "pdf_page", "draft_printed_lines", "native_default_count", "native_configured_count"
    )} for p in result["pages"]],
    "figures": [{key: f[key] for key in (
        "id", "candidate_path", "candidate_sha256", "snapped_box", "padding_px",
        "matches_frozen_author_candidate", "matches_frozen_native_geometry"
    )} for f in result["figures"]],
}, ensure_ascii=False, indent=2))
