"""One independent native count/crop measurement for the frozen160-163 gate."""

from pathlib import Path
import hashlib
import json
import sys

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[5]
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout
import p2c


OUT = Path(__file__).resolve().parent
AUTHOR = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0160-0163"
FREEZE = AUTHOR / "author-freeze.json"
EXPECTED_FREEZE = "04f7cb37a92b432f31307e312e88a9aaea12608d5a851d575a2e688d25231853"
MEASUREMENTS = OUT / "native-measurements.json"
OBSERVED_ROWS = {
    160: [4, 1, 5, 2, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    161: [1, 1, 1, 2, 1, 1, 3, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1],
    162: [2, 3, 4, 3, 1, 3, 10, 1],
    163: [2, 5, 0, 3, 4, 3, 4, 4, 1],
}
DETAILS = {
    160: [
        ("tension-emphasis", [280, 600, 740, 80]),
        ("solution-heading", [290, 1030, 470, 78]),
        ("now-emphasis", [290, 1678, 440, 72]),
    ],
    161: [
        ("first-therefore", [490, 211, 230, 72]),
        ("second-therefore", [155, 547, 260, 75]),
    ],
    163: [
        ("material-word", [160, 479, 655, 90]),
        ("near-action-bold", [170, 1190, 1160, 211]),
    ],
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


if MEASUREMENTS.exists():
    raise SystemExit("Refuse to repeat an already-recorded range measurement.")
if sha(FREEZE) != EXPECTED_FREEZE:
    raise SystemExit("Author freeze differs from the dispatched snapshot.")
freeze = json.loads(FREEZE.read_text())
pairs = {}


def visit(value):
    if isinstance(value, dict):
        if "path" in value and "sha256" in value:
            pairs[value["path"]] = value["sha256"]
        for item in value.values():
            visit(item)
    elif isinstance(value, list):
        for item in value:
            visit(item)


visit(freeze)
for path, expected in pairs.items():
    if sha(ROOT / path) != expected:
        raise SystemExit(f"Frozen binding changed: {path}")

report = {
    "author_freeze": binding(FREEZE),
    "all_declared_bindings_match": True,
    "unique_declared_files": len(pairs),
    "tools": {name: binding(TOOLS / name) for name in ("blocks.py", "layout.py", "p2c.py", "assemble.py")},
    "helper": binding(Path(__file__).resolve()),
    "pages": [],
    "figures": [],
    "details": [],
    "scope": "One native range measurement; actual full-source inspection precedes this command. No prepare/finalize, source rewriting, normalization or SCI.",
}

for page in freeze["pages"]:
    n = page["pdf_page"]
    png = Path(page["source"]["path"])
    draft = Path(page["draft"]["path"])
    meta, parsed = blocks.load(draft)
    with Image.open(png) as image:
        width, height = image.size
        ink = layout.ink_mask(image)
        masked = ink.copy()
        seq = 0
        figures = []
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
            item = {
                "id": fid, "pdf_page": n, "block": f"p{n:04d}#{index + 1}",
                "rough_box": block["box"], "snapped_box": snapped,
                "native_snap": snap_info, "padding_px": padding,
                "exact_source_extraction_box": extraction(snapped, padding, width, height),
                "candidate": binding(candidate),
                "margin36": {**binding(margin), "box": extraction(snapped, 36, width, height)},
                "author_candidate": binding(author_candidate),
                "matches_frozen_candidate": sha(candidate) == sha(author_candidate),
            }
            report["figures"].append(item)
            figures.append(fid)
        default = layout.line_bands(masked, width)
        configured = p2c._counting_line_bands(meta, masked, width)
        band_image = image.convert("RGB")
        draw = ImageDraw.Draw(band_image)
        for figure in report["figures"]:
            if figure["pdf_page"] != n:
                continue
            x, y, w, h = figure["snapped_box"]
            draw.rectangle((x, y, x + w - 1, y + h - 1), fill="white")
        for index, (top, bottom) in enumerate(configured):
            draw.rectangle((105, top, width - 105, bottom), outline="#c40000", width=2)
            draw.text((110, top), str(index + 1), fill="#c40000")
        band_path = OUT / f"p{n:04d}-configured-bands.png"
        band_image.save(band_path)
        observed = OBSERVED_ROWS[n]
        report["pages"].append({
            "pdf_page": n, "source": binding(png), "draft": binding(draft),
            "dimensions": [width, height], "blocks": len(parsed),
            "independent_observed_block_rows": observed,
            "independent_printed_lines_including_footer": sum(observed),
            "draft_printed_lines": blocks.printed_lines(parsed),
            "native_default_bands": default, "native_default_count": len(default),
            "native_configured_bands": configured, "native_configured_count": len(configured),
            "counting": meta.get("counting"), "configured_bands_evidence": binding(band_path),
            "parsed_blocks": [
                {"ref": f"p{n:04d}#{index + 1}", **block}
                for index, block in enumerate(parsed)
            ],
            "figures": figures,
        })
    for name, box in DETAILS.get(n, []):
        target = OUT / f"p{n:04d}-{name}.png"
        layout.crop(png, box, target, pad=0)
        report["details"].append({
            "pdf_page": n, "source_box": box, **binding(target),
        })

incoming = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0159/page.md"
report["incoming_canonical159_text_only"] = binding(incoming)
report["toc"] = binding(ROOT / "ssot-resources/soviet10year-textbooks/toc/9p/zh.json")
MEASUREMENTS.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "measurement": binding(MEASUREMENTS),
    "counts": [
        {"page": p["pdf_page"], "observed": p["independent_printed_lines_including_footer"],
         "draft": p["draft_printed_lines"], "default": p["native_default_count"],
         "configured": p["native_configured_count"]}
        for p in report["pages"]
    ],
    "figures": report["figures"],
    "details": report["details"],
}, ensure_ascii=False, indent=2))
