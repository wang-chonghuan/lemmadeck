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

freeze_path = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0152-0155/author-freeze.json"
freeze = json.loads(freeze_path.read_text())


def binding(path):
    return {"path": str(path), "sha256": layout.sha256_file(path)}


declared = []
seen = {}


def verify(value):
    if not isinstance(value, dict):
        if isinstance(value, list):
            for item in value:
                verify(item)
        return
    if "path" in value and "sha256" in value:
        path = Path(value["path"])
        actual = seen.setdefault(str(path), layout.sha256_file(path))
        assert actual == value["sha256"], path
        declared.append({"path": str(path), "sha256": actual})
    else:
        for item in value.values():
            verify(item)


verify(freeze)
record = {
    "author_freeze": binding(freeze_path),
    "all_declared_bindings_match": True,
    "declared_path_sha_pairs": len(declared),
    "unique_declared_files": len(seen),
    "declared_binding_checks": declared,
    "native_tools": {
        name: binding(ROOT / ".claude/skills/ld-s10y-lesson/tools" / name)
        for name in ("blocks.py", "layout.py", "p2c.py")
    },
    "pages": [],
    "figures": [],
}
for frozen in freeze["pages"]:
    page = frozen["pdf_page"]
    draft = Path(frozen["draft"]["path"])
    meta, items = blocks.load(draft)
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
            prior = next(f for f in frozen["source_figures"] if f["id"] == fid)
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
                "author_candidate": prior["candidate"],
                "matches_frozen_candidate": binding(candidate)["sha256"] == prior["candidate"]["sha256"],
            }
            assert figure["matches_frozen_candidate"]
            assert box == prior["snapped_box"]
            record["figures"].append(figure)
            page_figures.append(fid)
        columns = ink.any(axis=0).nonzero()[0]
        content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
        default_bands = layout.line_bands(masked, content_width)
        configured_bands = p2c._counting_line_bands(meta, masked, content_width)
        record["pages"].append({
            "pdf_page": page,
            "printed_page": meta["printed_page"],
            "draft": binding(draft),
            "source": binding(source),
            "dimensions": list(image.size),
            "blocks": len(items),
            "block_physical_rows": [
                len(b["lines"]) + sum(line.count(blocks.WRAP) for line in b["lines"])
                for b in items
            ],
            "block_inventory": [
                {
                    "ref": f"p{page:04d}#{index}",
                    "kind": b["kind"],
                    "open": b["open"],
                    "cont": b["cont"],
                    "samerow": b["samerow"],
                    "label": b["label"],
                    "owner_exercise": b["owner_exercise"],
                }
                for index, b in enumerate(items, 1)
            ],
            "draft_printed_lines": blocks.printed_lines(items),
            "native_default_bands": default_bands,
            "native_default_count": len(default_bands),
            "native_configured_bands": configured_bands,
            "native_configured_count": len(configured_bands),
            "counting": meta.get("counting"),
            "figures": page_figures,
        })

details = [
    (153, "p0153-footnote-emphasis.png", [140, 1620, 1160, 205]),
    (154, "p0154-coulomb-force-dot-emphasis.png", [190, 1625, 365, 100]),
]
record["details"] = []
for page, name, box in details:
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
    "declared_pairs": len(declared),
    "unique_files": len(seen),
    "pages": [
        {k: p[k] for k in ("pdf_page", "blocks", "block_physical_rows", "draft_printed_lines", "native_default_count", "native_configured_count")}
        for p in record["pages"]
    ],
    "figures": record["figures"],
    "details": record["details"],
}, ensure_ascii=False, indent=2))
