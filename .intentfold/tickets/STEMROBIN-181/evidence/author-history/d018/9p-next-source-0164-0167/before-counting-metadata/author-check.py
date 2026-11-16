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

assert not (OUT / "author-freeze.json").exists(), "Preserve frozen source author evidence"
profile_path = ROOT / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"
profile = normalize.load_profile(profile_path)
observed_rows = {164: 26, 165: 21, 166: 25, 167: 26}
inventories = {
    "fig-110": {
        "owner": "source65-distance-action-prose",
        "objects": [
            "Horizontal fixed support, vertical thread, and hanging rectangular weight",
            "Sloping enlargement connector with arrowhead toward circular atom inset",
            "Circular outline and all original filled dot/atom ink, including edge-clipped dots",
        ],
        "relationships": [
            "Weight suspended below support by the original thin vertical line",
            "Enlargement connector links that thread to the circular inset",
            "No printed numeric atom count, calibrated distance, or quantitative scale",
        ],
        "printed_caption": "图110, same physical row as left prose beginning拉断",
        "unprinted_measurements_inferred": False,
    },
    "tbl-p0165-01": {
        "owner": "source66-faraday-prose",
        "kind": "unnumbered-portrait-not-table",
        "objects": ["Original full Faraday head-and-shoulders portrait, hair, face, clothing and hatch ink"],
        "relationships": [
            "Identity supplied by adjacent source biography and first paragraph, not guessed from likeness",
            "Right12-row biography/quotation kept as separate caption text, not inside source crop",
        ],
        "printed_caption": "M. 法拉第(1791～1867) and the entire adjacent source biography/Maxwell quotation",
        "unprinted_measurements_or_history_inferred": False,
    },
    "fig-111": {
        "owner": "source66-propagation-prose",
        "objects": [
            "Two filled round objects with one original connecting straight line",
            "Left printed A and damaged right-hand original label ink",
            "Dashed circular outline just to right of left object",
            "Separate rightward arrow under the left portion",
        ],
        "relationships": [
            "The source165 prose calls the moved charge A; source166 names the second charge B",
            "The damaged right figure label is not reconstructed or silently transcribed as B",
            "No added charge signs, distances, numeric calibration or extra positions",
        ],
        "unreadable_glyph": "Right-hand label partly missing; actual original ink is retained but exact glyph identification remains a source-author blocker",
        "printed_caption": "图111, same row as图112",
        "unprinted_measurements_or_answers_inferred": False,
    },
    "fig-112": {
        "owner": "source66-field-prose",
        "objects": [
            "Two dark circular centers with white ring borders",
            "Full surrounding original dense stipple/radial ink texture and rectangular outer stipple extent",
        ],
        "relationships": [
            "Original source illustration referenced by166 electric-field paragraph",
            "All actual raster ink retained without assigning particles, charge signs or new field-line arrows",
        ],
        "printed_caption": "图112, same row as图111",
        "unprinted_measurements_or_answers_inferred": False,
    },
}
detail_boxes = {
    "0164-bottom-shadow-detail": (164, [0, 2050, 1504, 239]),
    "0164-left-edge-detail": (164, [0, 0, 100, 2289]),
    "0164-right-edge-detail": (164, [1404, 0, 100, 2289]),
    "0165-figure111-right-label-detail": (165, [600, 1625, 50, 60]),
    "0166-equation-case-detail": (166, [690, 1091, 180, 100]),
    "0166-c-definition-detail": (166, [220, 1216, 1150, 141]),
    "0166-bottom-shadow-detail": (166, [0, 2055, 1504, 234]),
    "0166-left-edge-detail": (166, [0, 0, 100, 2289]),
    "0166-right-edge-detail": (166, [1404, 0, 100, 2289]),
    "0167-footnote-detail": (167, [145, 1830, 1165, 155]),
}


def binding(file):
    return {"path": str(file), "sha256": layout.sha256_file(file)}


def extraction(image, box, pad):
    x, y, width, height = box
    left, top = max(0, x - pad), max(0, y - pad)
    return [left, top, min(image.width, x + width + pad) - left, min(image.height, y + height + pad) - top]


record = {
    "ticket": "STEMROBIN-181", "invocation": "D018", "role": "source-author-only",
    "status": "native-author-observations-not-independent-source-gate",
    "scope": "PDF164-167 scratch only; no repeated prepare, finalize/assemble/vectorize/durable/SCI",
    "context": {
        "incoming163_text_only": binding(ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0160-0163/0163.page.md"),
        "incoming_block": "p0163#8",
        "incoming_terminal_text": "物体传给另一物体作用的某种媒介物，这完全是没有必要的.",
        "incoming_paragraph_complete_not_open": True,
        "previous163_pixels_not_opened": True,
        "toc": binding(ROOT / "ssot-resources/soviet10year-textbooks/toc/9p/zh.json"),
        "source_manifest": binding(ROOT / "ssot-resources/soviet10year-textbooks/sources/manifest.json"),
    },
    "native_tools": {
        name: binding(ROOT / ".claude/skills/ld-s10y-lesson/tools" / name)
        for name in ("p2c.py", "layout.py", "blocks.py", "normalize.py", "mathcheck.py")
    },
    "profile": binding(profile_path),
    "lesson_skill": binding(ROOT / ".claude/skills/ld-s10y-lesson/SKILL.md"),
    "reference_helpers_read_only": [
        binding(ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0160-0163" / name)
        for name in ("author-check.py", "freeze-author.mjs")
    ],
    "helper": binding(Path(__file__).resolve()),
    "pages": [], "detail_evidence": [],
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
    ink_before, masked = ink.copy(), ink.copy()
    figures = []
    for sequence, item in enumerate((item for item in page_blocks if item["kind"] == "fig"), 1):
        fid = blocks.fig_id(item["label"], page, sequence)
        box, info = layout.snap(ink, item["box"])
        padding = p2c._figure_crop_padding(meta, fid)
        candidate = OUT / "candidate-figures" / f"{fid}.png"
        margin = OUT / "evidence" / f"{fid}-prospective-margin.png"
        layout.crop(source, box, candidate, pad=padding)
        layout.crop(source, box, margin, pad=36)
        x, y, width, height = box
        masked[max(0, y):y + height, max(0, x):x + width] = False
        figures.append({
            "id": fid, "label": item["label"], "owner_exercise": item["owner_exercise"],
            "rough_box": item["box"], "snapped_box": box, "native_snap": info,
            "padding_px": padding, "exact_source_extraction_box": extraction(image, box, padding),
            "candidate": binding(candidate),
            "prospective_margin_padding_px": 36, "prospective_margin_extraction_box": extraction(image, box, 36),
            "prospective_margin": binding(margin), "source_inventory": inventories[fid],
        })
    columns = ink.any(axis=0).nonzero()[0]
    content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
    default_bands = layout.line_bands(masked, content_width)
    configured_bands = p2c._counting_line_bands(meta, masked, content_width)
    edge100_bands = layout.line_bands(masked, content_width, edge_margin_px=100)
    assert (ink == ink_before).all()
    evidence = OUT / "evidence"
    evidence.mkdir(parents=True, exist_ok=True)
    counting_image = Image.fromarray((~masked).astype("uint8") * 255).convert("RGB")
    draw = ImageDraw.Draw(counting_image)
    for index, (top, bottom) in enumerate(default_bands, 1):
        draw.rectangle((80, top, image.width - 80, bottom), outline="red", width=1)
        draw.text((100, top), str(index), fill="red")
    bands_file = evidence / f"{page:04d}-masked-default-bands.png"
    counting_image.save(bands_file)
    normalization_deltas, charset, texts = [], [], []
    for index, item in enumerate(page_blocks, 1):
        for row, line in enumerate(item["lines"], 1):
            normalized, changes = normalize.normalize_text(line, profile)
            if line != normalized:
                normalization_deltas.append({"block": index, "row": row, "changes": changes})
        text = blocks.text_of(item)
        charset.extend({"block": index, **finding} for finding in normalize.check_charset(text, profile))
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
        "grid": binding(work / "page.grid.png"), "prepare_layout": binding(work / "layout.json"),
        "prepare_template": binding(work / "page.template.md"),
        "dimensions": list(image.size), "blocks": len(page_blocks),
        "author_observed_printed_rows_including_footer": expected,
        "draft_printed_rows": blocks.printed_lines(page_blocks),
        "default_native_count": len(default_bands), "default_native_bands": default_bands,
        "configured_native_count": len(configured_bands), "configured_native_bands": configured_bands,
        "diagnostic_edge100_count": len(edge100_bands), "diagnostic_edge100_bands": edge100_bands,
        "counting": meta.get("counting"),
        "masked_default_bands_evidence": binding(bands_file), "source_figures": figures,
        "block_inventory": [
            {
                "ref": f"p{page:04d}#{index}", "kind": item["kind"], "label": item["label"],
                "owner_exercise": item["owner_exercise"], "footnote": item["kind"] == "p" and item["label"] == "footnote",
                "physical_rows": len(item["lines"]) + sum(line.count(blocks.WRAP) for line in item["lines"]),
                "open": item["open"], "cont": item["cont"], "samerow": item["samerow"], "text": blocks.text_of(item),
            }
            for index, item in enumerate(page_blocks, 1)
        ],
        "normalizations_needed": normalization_deltas, "charset_findings": charset,
        "math_errors": math_errors, "math_warnings": math_warnings,
        "math_fragments": sum(len(re.findall(r"\$[^$]*\$", item["text"])) for item in texts),
        "native_author_errors": errors, "source_png_and_ink_unchanged": binding(source) == source_before,
    })
    for name, (detail_page, box) in detail_boxes.items():
        if detail_page != page:
            continue
        target = evidence / f"{name}.png"
        layout.crop(source, box, target, pad=0)
        record["detail_evidence"].append({
            "pdf_page": page, "id": name, "source": source_before, "box": box, "padding_px": 0,
            "exact_source_extraction_box": extraction(image, box, 0), "image": binding(target),
        })
output = OUT / "author-check.json"
output.write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({
    "author_check": binding(output),
    "pages": [{
        key: page[key] for key in (
            "pdf_page", "blocks", "author_observed_printed_rows_including_footer", "draft_printed_rows",
            "default_native_count", "configured_native_count", "diagnostic_edge100_count",
            "normalizations_needed", "charset_findings", "math_errors", "math_warnings", "native_author_errors",
        )
    } for page in record["pages"]],
    "figures": [{
        key: figure[key] for key in ("id", "rough_box", "snapped_box", "padding_px", "candidate")
    } for page in record["pages"] for figure in page["source_figures"]],
}, ensure_ascii=False, indent=2))
