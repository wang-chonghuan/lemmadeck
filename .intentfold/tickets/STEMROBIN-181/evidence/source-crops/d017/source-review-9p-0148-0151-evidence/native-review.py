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
FREEZE = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0148-0151/author-freeze.json"


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


trace = []


def scalar(value):
    if isinstance(value, np.generic):
        return value.item()
    if isinstance(value, (list, tuple, set)):
        return [scalar(item) for item in value]
    return value


def trace149(frame, event, arg):
    if frame.f_code.co_filename != str(TOOLS / "layout.py"):
        return trace149
    local = frame.f_locals
    name = frame.f_code.co_name
    if event == "return" and name == "_single_fraction_row" and local.get("a", 0) >= 1750:
        entry = {
            "function": name, "return_line": frame.f_lineno,
            "a": local["a"], "b": local["b"],
            "line_h": scalar(local["line_h"]), "result": bool(arg),
            "rules": scalar(local.get("rules", [])),
        }
        if "remaining" in local:
            remaining = local["remaining"]
            entry["remaining_extent"] = (
                [int(remaining[0]), int(remaining[-1])] if remaining.size else []
            )
        trace.append(entry)
    elif event == "return" and name == "_small_prose_continuation" and local.get("top", 0) >= 1750:
        trace.append({
            "function": name, "return_line": frame.f_lineno, "result": bool(arg),
            **{key: scalar(local[key]) for key in (
                "top", "top_bottom", "bottom_top", "bottom", "glyph_h",
                "rows", "thin_rules", "local_h"
            ) if key in local},
        })
    elif event == "line" and name == "line_bands" and 1750 <= local.get("a", 0) <= 1980:
        if frame.f_lineno >= 440:
            entry = {"function": name, "line": frame.f_lineno}
            entry.update({
                key: scalar(local[key]) for key in (
                    "a", "b", "prev_a", "prev_b", "line_h", "glyph_h", "merge_gap",
                    "typical_h", "typical_gap", "pitch", "band_h", "count",
                    "strong_rows", "fraction_starts"
                ) if key in local
            })
            if not trace or entry != trace[-1]:
                trace.append(entry)
    return trace149


check_bindings(freeze)
result = {
    "role": "Independent native measurements and read-only149 counting trace; no source edits.",
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
            "id": fid, "pdf_page": number, "block": f"p{number:04d}#{block_index}",
            "rough_box": block["box"], "snapped_box": snapped, "native_snap": info,
            "padding_px": padding,
            "exact_source_extraction_box": [x - padding, y - padding, w + 2 * padding, h + 2 * padding],
            "candidate_path": str(out), "candidate_sha256": sha(out),
            "frozen_author_candidate": declared["candidate"],
            "matches_frozen_author_candidate": sha(out) == declared["candidate"]["sha256"],
            "matches_frozen_native_geometry": snapped == declared["snapped_box"],
        })
    occupied = np.flatnonzero(ink.any(axis=0))
    content_w = int(occupied[-1] - occupied[0] + 1)
    if number == 149:
        sys.settrace(trace149)
    try:
        default_bands = layout.line_bands(masked, content_w)
    finally:
        sys.settrace(None)
    configured_bands = (
        p2c._counting_line_bands(meta, masked, content_w) if meta.get("counting")
        else default_bands
    )
    row_inventory = [
        {"block": f"p{number:04d}#{i}", "kind": b["kind"], "label": b["label"],
         "printed_row_contribution": blocks.printed_lines([b]), "stored_lines": len(b["lines"]),
         "open": b["open"], "cont": b["cont"], "samerow": b["samerow"]}
        for i, b in enumerate(parsed, 1)
    ]
    result["pages"].append({
        "pdf_page": number, "printed_page": meta["printed_page"],
        "source": binding(source), "draft": binding(draft),
        "source_pdf_sha256_declared": meta["source"]["pdf_sha256"],
        "render_binding_matches_source": meta["render"]["sha256"] == sha(source),
        "dimensions": list(image.size), "block_count": len(parsed), "block_inventory": row_inventory,
        "draft_printed_lines": blocks.printed_lines(parsed), "content_width": content_w,
        "native_default_count": len(default_bands),
        "native_default_bands": [list(b) for b in default_bands],
        "native_configured_count": len(configured_bands),
        "native_configured_bands": [list(b) for b in configured_bands],
        "counting": meta.get("counting"),
    })
    if number == 149:
        trials = []
        for margin in (100, 150):
            bands = layout.line_bands(masked, content_w, edge_margin_px=margin)
            trials.append({
                "edge_margin_px": margin, "count": len(bands),
                "footnote_and_footer_bands": [list(b) for b in bands if b[0] >= 1750],
                "reason_for_diagnostic_only": "Boundary-only check; no draft override authored or count forced.",
            })
        result["p0149_existing_metadata_diagnostics"] = trials
        result["p0149_read_only_branch_trace"] = trace

details = [
    (149, "p0149-original-count-word.png", [570, 1380, 490, 90]),
    (149, "p0149-footnote-rows.png", [140, 1740, 1180, 225]),
    (148, "p0148-exponent.png", [200, 420, 715, 65]),
]
result["detail_evidence"] = []
for number, name, box in details:
    source = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{number:04d}/page.png"
    out = EVIDENCE / name
    layout.crop(source, box, out, pad=0)
    result["detail_evidence"].append(dict(binding(out), pdf_page=number, source_box=box))
out = EVIDENCE / "native-measurements.json"
out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "evidence": binding(out), "author_freeze": result["author_freeze"],
    "all_declared_file_bindings_verified": result["all_declared_file_bindings_verified"],
    "binding_checks": len(checked),
    "pages": [{key: p[key] for key in (
        "pdf_page", "draft_printed_lines", "native_default_count", "native_configured_count"
    )} for p in result["pages"]],
    "figures": result["figures"],
    "p0149_existing_metadata_diagnostics": result["p0149_existing_metadata_diagnostics"],
    "p0149_helper_returns": [item for item in trace if "result" in item],
}, ensure_ascii=False, indent=2))
