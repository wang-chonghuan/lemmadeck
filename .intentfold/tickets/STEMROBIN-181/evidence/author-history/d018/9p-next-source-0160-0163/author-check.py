import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import blocks
import layout
import mathcheck
import normalize
import p2c

assert not (OUT / "author-freeze.json").exists(), "Do not overwrite frozen author evidence"
profile_path = ROOT / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"
profile = normalize.load_profile(profile_path)
observed_rows = {160: 20, 161: 25, 162: 27, 163: 26}
inventories = {
    "fig-109": {
        "owner": "source64-worked-example4",
        "objects": [
            "Three separate small circles: left negative, middle positive, right positive",
            "Left charge: two arrows toward the right, upper vector F12 and lower vector F13",
            "Middle charge: two arrows toward the left, upper vector F21 and lower vector F23",
            "Right charge: one leftward vector F31 and one rightward vector F32",
            "All six original force labels, vector marks, arrowheads and charge signs",
        ],
        "relationships": [
            "Two same-direction force arrows at each of the first two charges",
            "Opposite-direction arrows at the third charge",
            "Source text supplies charges and separation data; diagram is uncalibrated",
        ],
        "printed_caption": "图109; separate printed row, not in figure box",
        "no_measurements_or_answers_inferred": True,
    },
    "tbl-p0163-01": {
        "owner": "source65-near-action-prose",
        "kind": "unnumbered-prose-illustration-not-table",
        "objects": [
            "Two complete standing people facing one another",
            "Left striped shirt, right crosshatched shirt; collars, trousers, shoes, faces and hair",
            "Original curved short marks between the two faces",
        ],
        "relationships": [
            "Conversation illustration beside the paragraph about transmission through an intermediate material",
            "No printed number, caption, personal names, axis, numeric scale or directional arrow",
        ],
        "uncertainty": "Short arc-like ink marks are retained; no exact wavefront count, spacing, speed or propagation direction inferred",
        "printed_caption": None,
        "no_measurements_or_answers_inferred": True,
    },
}
detail_boxes = {
    "0160-tension-emphasis-detail": (160, [285, 603, 700, 66]),
    "0160-bottom-shadow-detail": (160, [0, 2050, 1504, 239]),
    "0160-left-edge-detail": (160, [0, 0, 100, 2289]),
    "0160-right-edge-detail": (160, [1404, 0, 100, 2289]),
    "0162-ex10-exponents-detail": (162, [270, 492, 1090, 58]),
    "0162-bottom-shadow-detail": (162, [0, 2030, 1504, 259]),
    "0162-left-edge-detail": (162, [0, 0, 100, 2289]),
    "0162-right-edge-detail": (162, [1404, 0, 100, 2289]),
    "0163-near-action-emphasis-detail": (163, [165, 1194, 1165, 201]),
}


def binding(file):
    return {"path": str(file), "sha256": layout.sha256_file(file)}


def extraction_box(image, box, pad):
    x, y, width, height = box
    left, top = max(0, x - pad), max(0, y - pad)
    return [
        left, top,
        min(image.width, x + width + pad) - left,
        min(image.height, y + height + pad) - top,
    ]


record = {
    "ticket": "STEMROBIN-181",
    "role": "source-author-only",
    "status": "native-author-observations-not-independent-gate",
    "scope": "PDF160-163 scratch only; no finalize/assemble/vectorize/durable/SCI",
    "context": {
        "incoming159_text_only": binding(ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0156-0159/0159.page.md"),
        "incoming_block": "p0159#13",
        "incoming_terminal_text": "$F-F_{\\text{弹}}\\sin\\alpha=0$.",
        "previous_page_pixels_not_opened": True,
        "toc": binding(ROOT / "ssot-resources/soviet10year-textbooks/toc/9p/zh.json"),
    },
    "native_tools": {
        name: binding(ROOT / ".claude/skills/ld-s10y-lesson/tools" / name)
        for name in ("p2c.py", "layout.py", "blocks.py", "normalize.py", "mathcheck.py")
    },
    "lesson_skill": binding(ROOT / ".claude/skills/ld-s10y-lesson/SKILL.md"),
    "profile": binding(profile_path),
    "reference_helpers_read_only": [
        binding(ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0156-0159" / name)
        for name in ("author-check.py", "freeze-author.mjs")
    ],
    "helper": binding(Path(__file__).resolve()),
    "pages": [],
    "detail_evidence": [],
}
for page, expected in observed_rows.items():
    work = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{page:04d}"
    draft = OUT / f"{page:04d}.page.md"
    meta, page_blocks = blocks.load(draft)
    source = work / "page.png"
    source_before = binding(source)
    assert meta["render"]["sha256"] == source_before["sha256"]
    image = Image.open(source)
    ink = layout.ink_mask(image)
    ink_before = ink.copy()
    masked = ink.copy()
    figures = []
    for sequence, block in enumerate((item for item in page_blocks if item["kind"] == "fig"), 1):
        fid = blocks.fig_id(block["label"], page, sequence)
        box, info = layout.snap(ink, block["box"])
        padding = p2c._figure_crop_padding(meta, fid)
        candidate = OUT / "candidate-figures" / f"{fid}.png"
        margin = OUT / "evidence" / f"{fid}-prospective-margin.png"
        layout.crop(source, box, candidate, pad=padding)
        layout.crop(source, box, margin, pad=36)
        x, y, width, height = box
        masked[max(0, y):y + height, max(0, x):x + width] = False
        figures.append({
            "id": fid, "label": block["label"], "owner_exercise": block["owner_exercise"],
            "rough_box": block["box"], "snapped_box": box, "native_snap": info,
            "padding_px": padding, "exact_source_extraction_box": extraction_box(image, box, padding),
            "candidate": binding(candidate),
            "prospective_margin_padding_px": 36,
            "prospective_margin_extraction_box": extraction_box(image, box, 36),
            "prospective_margin": binding(margin),
            "source_inventory": inventories[fid],
        })
    columns = ink.any(axis=0).nonzero()[0]
    content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
    default_bands = layout.line_bands(masked, content_width)
    configured_bands = p2c._counting_line_bands(meta, masked, content_width)
    edge100_bands = layout.line_bands(masked, content_width, edge_margin_px=100)
    assert (ink == ink_before).all()
    evidence = OUT / "evidence"
    evidence.mkdir(parents=True, exist_ok=True)
    bands_file = evidence / f"{page:04d}-masked-default-bands.png"
    counting_image = Image.fromarray((~masked).astype("uint8") * 255).convert("RGB")
    draw = ImageDraw.Draw(counting_image)
    for index, (top, bottom) in enumerate(default_bands, 1):
        draw.rectangle((80, top, image.width - 80, bottom), outline="red", width=1)
        draw.text((100, top), str(index), fill="red")
    counting_image.save(bands_file)
    normalization_deltas, charset, texts = [], [], []
    for index, block in enumerate(page_blocks, 1):
        for row, line in enumerate(block["lines"], 1):
            normalized, changes = normalize.normalize_text(line, profile)
            if line != normalized:
                normalization_deltas.append({"block": index, "row": row, "changes": changes})
        text = blocks.text_of(block)
        charset.extend({"block": index, **item} for item in normalize.check_charset(text, profile))
        texts.append({"id": f"p{page:04d}#{index}", "text": text})
    math_errors, math_warnings = mathcheck.collect_and_check(texts, lambda item: [("text", item["text"])])
    errors = []
    if blocks.printed_lines(page_blocks) != expected:
        errors.append("Draft rows differ from author-observed physical rows")
    if len(configured_bands) != expected:
        errors.append("Configured native counter differs from author-observed physical rows")
    if normalization_deltas or charset or math_errors:
        errors.append("Native normalization/charset/math requires attention")
    record["pages"].append({
        "pdf_page": page, "printed_page": meta["printed_page"],
        "draft": binding(draft), "source": source_before,
        "grid": binding(work / "page.grid.png"),
        "prepare_layout": binding(work / "layout.json"),
        "prepare_template": binding(work / "page.template.md"),
        "dimensions": list(image.size), "blocks": len(page_blocks),
        "author_observed_printed_rows_including_footer": expected,
        "draft_printed_rows": blocks.printed_lines(page_blocks),
        "default_native_count": len(default_bands), "default_native_bands": default_bands,
        "configured_native_count": len(configured_bands), "configured_native_bands": configured_bands,
        "diagnostic_edge100_count": len(edge100_bands), "diagnostic_edge100_bands": edge100_bands,
        "counting": meta.get("counting"),
        "masked_default_bands_evidence": binding(bands_file),
        "source_figures": figures,
        "block_inventory": [
            {
                "ref": f"p{page:04d}#{index}", "kind": block["kind"],
                "label": block["label"], "owner_exercise": block["owner_exercise"],
                "physical_rows": len(block["lines"]) + sum(line.count(blocks.WRAP) for line in block["lines"]),
                "open": block["open"], "cont": block["cont"], "samerow": block["samerow"],
                "text": blocks.text_of(block),
            }
            for index, block in enumerate(page_blocks, 1)
        ],
        "normalizations_needed": normalization_deltas, "charset_findings": charset,
        "math_errors": math_errors, "math_warnings": math_warnings,
        "math_fragments": sum(len(re.findall(r"\$[^$]*\$", item["text"])) for item in texts),
        "native_author_errors": errors,
        "source_png_and_ink_unchanged": binding(source) == source_before,
    })
    for name, (detail_page, box) in detail_boxes.items():
        if detail_page != page:
            continue
        path = evidence / f"{name}.png"
        layout.crop(source, box, path, pad=0)
        record["detail_evidence"].append({
            "pdf_page": page, "id": name, "source": source_before,
            "box": box, "padding_px": 0, "exact_source_extraction_box": extraction_box(image, box, 0),
            "image": binding(path),
        })

output = OUT / "author-check.json"
output.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({
    "author_check": binding(output),
    "pages": [{
        key: page[key] for key in (
            "pdf_page", "blocks", "author_observed_printed_rows_including_footer",
            "draft_printed_rows", "default_native_count", "configured_native_count",
            "diagnostic_edge100_count", "normalizations_needed", "charset_findings",
            "math_errors", "math_warnings", "native_author_errors",
        )
    } for page in record["pages"]],
    "figures": [{
        key: figure[key] for key in ("id", "rough_box", "snapped_box", "padding_px", "candidate")
    } for page in record["pages"] for figure in page["source_figures"]],
}, ensure_ascii=False, indent=2))
