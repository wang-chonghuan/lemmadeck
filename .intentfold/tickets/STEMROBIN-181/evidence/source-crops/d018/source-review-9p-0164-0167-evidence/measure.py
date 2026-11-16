"""One independent native measurement of the frozen164-167 source package."""

from pathlib import Path
import hashlib
import json
import sys

from PIL import Image


ROOT = Path(__file__).resolve().parents[5]
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout
import p2c


OUT = Path(__file__).resolve().parent
AUTHOR = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0164-0167"
FREEZE = AUTHOR / "author-freeze.json"
EXPECTED_FREEZE = "8872c5f4638a99cfa7e4617b8382361815fe098086a5b4b7855a67690b0a3540"
OUTPUT = OUT / "native-measurements.json"
OBSERVED_ROWS = {
    164: [13, 0, 1, 0, 1, 3, 4, 3, 1],
    165: [1, 1, 3, 0, 12, 2, 0, 0, 1, 0, 1],
    166: [2, 3, 2, 3, 2, 1, 3, 8, 1],
    167: [10, 3, 6, 2, 1, 3, 1],
}
DETAILS = {
    165: [("fig111-right-label", [580, 1600, 95, 170])],
    167: [("footnote-separator", [150, 1830, 1150, 165])],
}


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def binding(path):
    return {"path": str(path), "sha256": sha(path)}


def extraction(box, pad, width, height):
    x, y, w, h = box
    left, top = max(0, x - pad), max(0, y - pad)
    right, bottom = min(width, x + w + pad), min(height, y + h + pad)
    return [left, top, right - left, bottom - top]


if OUTPUT.exists():
    raise SystemExit("Refuse to repeat a recorded range measurement.")
if sha(FREEZE) != EXPECTED_FREEZE:
    raise SystemExit("Freeze differs from the dispatched snapshot.")
freeze = json.loads(FREEZE.read_text())
pairs = {}


def visit(value):
    if isinstance(value, dict):
        if "path" in value and "sha256" in value:
            pairs[value["path"]] = value["sha256"]
        for child in value.values():
            visit(child)
    elif isinstance(value, list):
        for child in value:
            visit(child)


visit(freeze)
for path, expected in pairs.items():
    if sha(ROOT / path) != expected:
        raise SystemExit(f"Changed frozen binding: {path}")

report = {
    "author_freeze": binding(FREEZE),
    "all_declared_bindings_match": True,
    "unique_declared_files": len(pairs),
    "tools": {
        name: binding(TOOLS / name)
        for name in ("blocks.py", "layout.py", "p2c.py")
    },
    "helper": binding(Path(__file__).resolve()),
    "pages": [],
    "figures": [],
    "details": [],
    "scope": "One count/crop measurement after four separate full-source inspections. No prepare, normalization, finalize, assembly or SCI.",
}

for page in freeze["pages"]:
    n = page["pdf_page"]
    png, draft = Path(page["source"]["path"]), Path(page["draft"]["path"])
    meta, parsed = blocks.load(draft)
    with Image.open(png) as image:
        width, height = image.size
        ink = layout.ink_mask(image)
        masked = ink.copy()
        seq = 0
        ids = []
        for index, block in enumerate(parsed):
            if block["kind"] != "fig":
                continue
            seq += 1
            fid = blocks.fig_id(block.get("label"), n, seq)
            snapped, snap_info = layout.snap(ink, block["box"])
            x, y, w, h = snapped
            masked[y:y + h, x:x + w] = False
            padding = p2c._figure_crop_padding(meta, fid)
            candidate = OUT / f"p{n:04d}-{fid}.png"
            margin = OUT / f"p{n:04d}-{fid}-margin36.png"
            layout.crop(png, snapped, candidate, pad=padding)
            layout.crop(png, snapped, margin, pad=36)
            author_candidate = AUTHOR / "candidate-figures" / f"{fid}.png"
            report["figures"].append({
                "id": fid,
                "pdf_page": n,
                "block": f"p{n:04d}#{index + 1}",
                "rough_box": block["box"],
                "snapped_box": snapped,
                "native_snap": snap_info,
                "padding_px": padding,
                "exact_source_extraction_box": extraction(snapped, padding, width, height),
                "candidate": binding(candidate),
                "margin36": {
                    **binding(margin),
                    "box": extraction(snapped, 36, width, height),
                },
                "author_candidate": binding(author_candidate),
                "matches_frozen_candidate": sha(candidate) == sha(author_candidate),
            })
            ids.append(fid)
        default = layout.line_bands(masked, width)
        configured = p2c._counting_line_bands(meta, masked, width)
        report["pages"].append({
            "pdf_page": n,
            "source": binding(png),
            "draft": binding(draft),
            "dimensions": [width, height],
            "blocks": len(parsed),
            "independent_observed_block_rows": OBSERVED_ROWS[n],
            "independent_printed_lines_including_footer": sum(OBSERVED_ROWS[n]),
            "draft_printed_lines": blocks.printed_lines(parsed),
            "native_default_bands": default,
            "native_default_count": len(default),
            "native_configured_bands": configured,
            "native_configured_count": len(configured),
            "counting": meta.get("counting"),
            "parsed_blocks": [
                {"ref": f"p{n:04d}#{i + 1}", **block}
                for i, block in enumerate(parsed)
            ],
            "figures": ids,
        })
    for name, box in DETAILS.get(n, []):
        target = OUT / f"p{n:04d}-{name}.png"
        layout.crop(png, box, target, pad=0)
        report["details"].append({
            "pdf_page": n,
            "source_box": box,
            **binding(target),
        })

incoming = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0163/page.md"
report["incoming_canonical163_text_only"] = binding(incoming)
OUTPUT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "measurement": binding(OUTPUT),
    "counts": [
        {
            "page": p["pdf_page"],
            "observed": p["independent_printed_lines_including_footer"],
            "draft": p["draft_printed_lines"],
            "default": p["native_default_count"],
            "configured": p["native_configured_count"],
        }
        for p in report["pages"]
    ],
    "figures": report["figures"],
    "details": report["details"],
    "incoming": report["incoming_canonical163_text_only"],
}, ensure_ascii=False, indent=2))
