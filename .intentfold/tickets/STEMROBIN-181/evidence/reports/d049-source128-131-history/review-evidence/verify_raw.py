"""Read frozen author bytes; write only independent review evidence."""
from pathlib import Path
import hashlib
import json
import subprocess
import sys
import xml.etree.ElementTree as ET

import numpy as np
from PIL import Image

W = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
A = W / ".intentfold/tickets/STEMROBIN-181/tmp/d047-10p-source128-131-author"
E = Path(__file__).resolve().parent
FROZEN_SHA = "a978a990d57f6624343b3b8db9926321aa39aea2f94cb937b8cf60adbba26b6c"


def binding(path):
    data = path.read_bytes()
    return {"path": str(path), "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest()}


def save_json(name, data):
    with (E / name).open("x", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def dilation(mask):
    pad = np.pad(mask, 1, mode="constant", constant_values=False)
    h, w = mask.shape
    result = np.zeros_like(mask)
    for y in range(3):
        for x in range(3):
            result |= pad[y:y+h, x:x+w]
    return result


freeze_binding = binding(A / "author-freeze.json")
assert freeze_binding["sha256"] == FROZEN_SHA
freeze = json.loads((A / "author-freeze.json").read_text())
entries = {item["path"]: item for item in freeze["inventory"]}
selected = [
    "history/inputs/01-10p 苏联中学课本 物理 十年级 .pdf",
    "process-notes.json",
    "history/observed-p0128.json",
    "history/observed-p0129.json",
    "history/reconstructed-observation-v1-p0129.json",
    "history/inputs/14-vectorize.py",
    "history/inputs/15-svg_raster.js",
]
for page, fig in ((128, "fig-89"), (129, "fig-90")):
    n = f"{page:04d}"
    selected += [
        f"source/10p/pages/{n}/{name}"
        for name in ("page.md", "page.json", "audit.json")
    ]
    selected += [
        f"work/10p/pages/{n}/{name}"
        for name in ("page.png", "layout.json", f"figures/{fig}.png", f"figures/{fig}.svg")
    ]
    selected += [
        f"history/prepare-{page}-initial/work/page.png",
        f"history/finalize-{page}-initial/source/page.md",
        f"history/finalize-{page}-initial/source/page.json",
        f"history/finalize-{page}-initial/source/audit.json",
        f"history/finalize-{page}-initial/figures/{fig}.png",
        f"history/vectorize-{page}-initial/figures/{fig}.png",
        f"history/vectorize-{page}-initial/figures/{fig}.svg",
        f"receipts/vectorize-{page}-initial.json",
        f"receipts/vectorize-{page}-initial.stdout.txt",
    ]

bindings = []
for relative in selected:
    actual = binding(A / relative)
    expected = entries[relative]
    actual["freeze_match"] = (
        actual["sha256"] == expected["sha256"] and actual["bytes"] == expected["bytes"]
    )
    assert actual["freeze_match"], relative
    bindings.append(actual)

results = []
for page, fig in ((128, "fig-89"), (129, "fig-90")):
    n = f"{page:04d}"
    source = A / f"source/10p/pages/{n}"
    work = A / f"work/10p/pages/{n}"
    page_json = json.loads((source / "page.json").read_text())
    audit = json.loads((source / "audit.json").read_text())
    md = (source / "page.md").read_text()
    _, front, body = md.split("---", 2)
    assert json.loads(front) == page_json["meta"]
    headers = [line for line in body.splitlines() if line.startswith("<!-- ")]
    assert len(headers) == len(page_json["blocks"])
    block_bodies = []
    active = None
    for line in body.splitlines():
        if line.startswith("<!-- "):
            active = []
            block_bodies.append(active)
        elif line.strip() and active is not None:
            active.append(line)
    for b, lines in zip(page_json["blocks"], block_bodies):
        expected = [] if b["kind"] == "fig" else lines
        assert b["lines"] == expected, (page, b["kind"])
    normalized_rows = sum(
        len(b["lines"]) - (len(b["lines"]) if b["kind"] == "cap" and b["samerow"] else
                           1 if b["samerow"] and b["lines"] else 0)
        for b in page_json["blocks"] if b["kind"] != "fig"
    )
    figure = audit["figures"][0]
    assert figure["id"] == fig
    assert figure["box"] == page_json["meta"]["figures"][0]["box"]
    x, y, w, h = figure["box"]
    rectangle = [x-12, y-12, x+w+12, y+h+12]
    parent_im = Image.open(work / "page.png")
    crop_im = Image.open(work / f"figures/{fig}.png")
    parent = np.asarray(parent_im.convert("RGB"))
    actual_crop = np.asarray(crop_im.convert("RGB"))
    x0, y0, x1, y1 = rectangle
    expected_crop = parent[y0:y1, x0:x1]
    assert actual_crop.shape == expected_crop.shape
    unequal = int(np.any(actual_crop != expected_crop, axis=2).sum())
    pixel_sha = lambda arr: hashlib.sha256(arr.tobytes()).hexdigest()
    svg = work / f"figures/{fig}.svg"
    svg_root = ET.parse(svg).getroot()
    paths = svg_root.findall("{http://www.w3.org/2000/svg}path")
    output = E / f"{fig}.independent-raster.png"
    assert not output.exists()
    proc = subprocess.run(
        ["node", str(W / ".claude/skills/ld-s10y-lesson/tools/svg_raster.js"),
         str(svg), str(output)], capture_output=True, text=True, check=True,
        cwd=str(W / ".claude/skills/ld-s10y-lesson"))
    source_ink = np.asarray(crop_im.convert("L")) < 128
    rendered_ink = np.asarray(Image.open(output).convert("L")) < 128
    assert source_ink.shape == rendered_ink.shape
    missing = int((source_ink & ~dilation(rendered_ink)).sum())
    extra = int((rendered_ink & ~dilation(source_ink)).sum())
    ink = int(source_ink.sum())
    native_missing = int((source_ink & ~rendered_ink).sum())
    native_extra = int((rendered_ink & ~source_ink).sum())
    results.append({
        "pdf_page": page, "figure": fig,
        "native_audit": {"lines_printed": audit["lines_printed"],
                         "lines_md": audit["lines_md"], "errors": audit["errors"]},
        "md_json_meta_and_block_lines_equal": True,
        "normalized_md_horizontal_rows": normalized_rows,
        "crop": {
            "parent_size": list(parent_im.size),
            "parent_mode": parent_im.mode, "crop_mode": crop_im.mode,
            "audit_snapped_xywh": figure["box"],
            "audit_coarse_from_xywh": figure["from"],
            "independent_rectangle_xyxy_half_open": rectangle,
            "independent_rectangle_xywh": [x0, y0, x1-x0, y1-y0],
            "padding_px": 12, "exclusions": [],
            "actual_size": list(crop_im.size), "unequal_RGB_pixels": unequal,
            "pixels_compared": (x1-x0)*(y1-y0),
            "expected_RGB_sha256": pixel_sha(expected_crop),
            "actual_RGB_sha256": pixel_sha(actual_crop),
            "status": "PASS" if unequal == 0 else "FAIL",
        },
        "svg_raw_parity": {
            "method": "Rasterize EXISTING frozen SVG only; no vectorize/finalize/prepare invocation. White background resvg; L<128 ink; zero-padded Chebyshev 1px dilation, no wraparound.",
            "renderer_binding": binding(W / ".claude/skills/ld-s10y-lesson/tools/svg_raster.js"),
            "command": proc.args, "exit_code": proc.returncode,
            "stdout": proc.stdout, "stderr": proc.stderr,
            "raster_binding": binding(output),
            "size": list(crop_im.size), "ink_pixels": ink,
            "missing_pixels_1px": missing, "extra_pixels_1px": extra,
            "mismatch_ratio_1px": (missing+extra)/ink,
            "missing_pixels_0px": native_missing, "extra_pixels_0px": native_extra,
            "mismatch_ratio_0px": (native_missing+native_extra)/ink,
            "threshold": 0.02, "tolerance_px": 1,
            "svg_viewBox": svg_root.attrib.get("viewBox"),
            "svg_width": svg_root.attrib.get("width"),
            "svg_height": svg_root.attrib.get("height"),
            "path_count": len(paths),
            "fill": [p.attrib.get("fill") for p in paths],
            "fill_rule": [p.attrib.get("fill-rule") for p in paths],
            "status": "PASS" if (missing+extra)/ink <= 0.02 else "FAIL",
            "does_not_approve_label_codepoints": True,
        },
    })

save_json("03-independent-raw-receipts.json", {
    "schema": "independent-raw-receipts@1", "ticket": "STEMROBIN-181",
    "scope": [128, 129], "freeze": freeze_binding, "bindings": bindings,
    "results": results, "author_files_written": [], "canonical_changes": False,
    "visual_image_payloads_loaded_by_this_script": 0,
    "source_pdf_visual_rerendered": False,
})

zoom_requests = [
    (128, (190, 730, 1375, 1010), "page128-same-row-detail.png", 2),
    (129, (200, 625, 1390, 1105), "page129-disputed-rows-detail.png", 2),
    (129, None, "fig90-structure-detail.png", 3),
]
zoom_bindings = []
for page, rect, filename, scale in zoom_requests:
    original = A / f"work/10p/pages/{page:04d}/page.png"
    if rect is None:
        original = A / "work/10p/pages/0129/figures/fig-90.png"
    im = Image.open(original)
    if rect is not None:
        im = im.crop(rect)
    im = im.resize((im.width*scale, im.height*scale), Image.Resampling.NEAREST)
    out = E / filename
    assert not out.exists()
    im.save(out)
    zoom_bindings.append({"input": binding(original), "rectangle_xyxy": rect,
                          "scale": scale, "resampling": "NEAREST",
                          "output": binding(out), "size": list(im.size)})
save_json("04-narrow-detail-receipts.json", {"schema": "review-detail-receipts@1",
          "details": zoom_bindings, "new_source_content": False})
print(json.dumps({"bindings_verified": len(bindings), "results": results,
                  "narrow_detail_paths": [item["output"]["path"] for item in zoom_bindings]},
                 ensure_ascii=False, indent=2))
