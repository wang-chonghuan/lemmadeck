import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import blocks
import layout
import p2c

freeze_path = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0156-0159/author-freeze.json"
freeze = json.loads(freeze_path.read_text())


def binding(path):
    return {"path": str(path), "sha256": layout.sha256_file(path)}


seen = {}
checks = []


def verify(value):
    if isinstance(value, list):
        for item in value:
            verify(item)
    elif isinstance(value, dict):
        if "path" in value and "sha256" in value:
            path = str(value["path"])
            if path not in seen:
                seen[path] = layout.sha256_file(Path(path))
            assert seen[path] == value["sha256"], path
            checks.append({"path": path, "sha256": seen[path]})
        else:
            for item in value.values():
                verify(item)


verify(freeze)
record = {
    "author_freeze": binding(freeze_path),
    "all_declared_bindings_match": True,
    "declared_path_sha_pairs": len(checks),
    "unique_declared_files": len(seen),
    "declared_binding_checks": checks,
    "native_tools": {
        name: binding(ROOT / ".claude/skills/ld-s10y-lesson/tools" / name)
        for name in ("blocks.py", "layout.py", "p2c.py")
    },
    "pages": [],
    "figures": [],
}
for frozen in freeze["pages"]:
    page = frozen["pdf_page"]
    meta, items = blocks.load(Path(frozen["draft"]["path"]))
    source = Path(frozen["source"]["path"])
    with Image.open(source) as image:
        ink = layout.ink_mask(image)
        masked = ink.copy()
        page_figures = []
        for sequence, item in enumerate((b for b in items if b["kind"] == "fig"), 1):
            fid = blocks.fig_id(item["label"], page, sequence)
            box, snap = layout.snap(ink, item["box"])
            padding = p2c._figure_crop_padding(meta, fid)
            candidate = OUT / f"p{page:04d}-{fid}.png"
            margin = OUT / f"p{page:04d}-{fid}-margin36.png"
            assert not candidate.exists() and not margin.exists()
            layout.crop(source, box, candidate, pad=padding)
            layout.crop(source, box, margin, pad=36)
            x, y, width, height = box
            masked[max(0, y):y + height, max(0, x):x + width] = False
            author = next(f for f in frozen["source_figures"] if f["id"] == fid)
            figure = {
                "id": fid,
                "pdf_page": page,
                "rough_box": item["box"],
                "snapped_box": box,
                "native_snap": snap,
                "padding_px": padding,
                "exact_source_extraction_box": [
                    max(0, x - padding),
                    max(0, y - padding),
                    min(image.width, x + width + padding) - max(0, x - padding),
                    min(image.height, y + height + padding) - max(0, y - padding),
                ],
                "candidate": binding(candidate),
                "margin36": binding(margin),
                "author_candidate": author["candidate"],
            }
            figure["matches_frozen_candidate"] = figure["candidate"]["sha256"] == author["candidate"]["sha256"]
            assert figure["matches_frozen_candidate"]
            assert box == author["snapped_box"]
            record["figures"].append(figure)
            page_figures.append(fid)
        columns = ink.any(axis=0).nonzero()[0]
        content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
        default_bands = layout.line_bands(masked, content_width)
        configured_bands = p2c._counting_line_bands(meta, masked, content_width)
        record["pages"].append({
            "pdf_page": page,
            "printed_page": meta["printed_page"],
            "draft": binding(Path(frozen["draft"]["path"])),
            "source": binding(source),
            "dimensions": list(image.size),
            "blocks": len(items),
            "block_physical_rows": [
                len(b["lines"]) + sum(line.count(blocks.WRAP) for line in b["lines"])
                for b in items
            ],
            "block_inventory": [
                {
                    "ref": f"p{page:04d}#{i}",
                    "kind": b["kind"],
                    "open": b["open"],
                    "cont": b["cont"],
                    "samerow": b["samerow"],
                    "label": b["label"],
                    "owner_exercise": b["owner_exercise"],
                }
                for i, b in enumerate(items, 1)
            ],
            "draft_printed_lines": blocks.printed_lines(items),
            "native_default_bands": default_bands,
            "native_default_count": len(default_bands),
            "native_configured_bands": configured_bands,
            "native_configured_count": len(configured_bands),
            "counting": meta.get("counting"),
            "figures": page_figures,
        })

record["details"] = []
for page, name, box in [
    (158, "p0158-definition-dot-span.png", [318, 1568, 570, 84]),
    (158, "p0158-oil-punctuation.png", [1100, 485, 292, 70]),
    (159, "p0159-worked-examples-heading.png", [225, 270, 165, 68]),
]:
    source = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{page:04d}/page.png"
    path = OUT / name
    assert not path.exists()
    layout.crop(source, box, path, pad=0)
    record["details"].append({**binding(path), "pdf_page": page, "source_box": box})

output = OUT / "native-measurements.json"
assert not output.exists()
output.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "evidence": binding(output),
    "freeze": record["author_freeze"],
    "declared_pairs": len(checks),
    "unique_files": len(seen),
    "pages": [
        {k: p[k] for k in (
            "pdf_page", "draft", "source", "blocks", "block_physical_rows",
            "draft_printed_lines", "native_default_count", "native_configured_count",
        )}
        for p in record["pages"]
    ],
    "figures": record["figures"],
    "details": record["details"],
}, ensure_ascii=False, indent=2))
