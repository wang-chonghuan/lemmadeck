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

assert not (OUT / "author-freeze.json").exists(), "Preserve the frozen source author package"
profile_path = ROOT / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"
profile = normalize.load_profile(profile_path)
observed_rows = {152: 23, 153: 27, 154: 25, 155: 25}
inventory = {
    "tbl-p0153-01": {
        "owner": "printed62-Coulomb-source-portrait",
        "objects": [
            "One complete unnumbered engraved-style head-and-shoulders portrait",
            "Hair, face, coat collar and lower bust ink retained as actually printed",
        ],
        "printed_caption_separate": "Six biography lines beginning C. A. 库仑(1736～1806)是, owned by printed62; no invented figure number.",
        "measurements_or_answers_inferred": False,
    },
    "fig-106": {
        "owner": "printed62-torsion-balance-apparatus-paragraph",
        "objects": [
            "Upper suspension adjustment piece and tall vertical tube",
            "Full cylindrical glass enclosure and lid outline",
            "Fine central suspension and lower horizontal rod with endpoint bodies",
            "Separate left-hand small sphere and visible A/B/a/b/c apparatus labels",
            "Complete rim tick scale without inferred tick count or numerical calibration",
        ],
        "text_bound_relationships": [
            "Source prose says B suspends glass rod A.",
            "Source prose says a is one rod-end sphere, c is the opposite counterweight and b is fixed to the stationary lid.",
        ],
        "uncertain_pixel_semantics_for_independent_review": "Small overlapping letters/ink are not precise coordinate evidence; all original ink retained.",
        "printed_caption_separate": "图106, same row as left text ending相互作用力.",
        "measurements_or_answers_inferred": False,
    },
    "fig-107": {
        "owner": "printed62-central-force-direction-paragraph",
        "objects": [
            "One common straight horizontal line with two marked points",
            "One plus sign above each point, point numbers 1 and 2 below",
            "Leftward force arrow extending outward from the left point",
            "Rightward force arrow extending outward from the right point",
            "Visible vector F12/F21 labels and r between the point positions",
        ],
        "printed_caption_separate": "图107, same row as left text ending(图107).",
        "measurements_or_answers_inferred": False,
    },
}


def binding(file):
    return {"path": str(file), "sha256": layout.sha256_file(file)}


record = {
    "ticket": "STEMROBIN-181",
    "role": "source-author-only",
    "status": "native-author-observations-not-independent-source-gate",
    "scope": "Only PDF152-155; no finalize, vectorize, assemble, durable edits or SCI",
    "pages": [],
    "context": {
        "incoming151": binding(ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0148-0151/0151.page.md"),
        "incoming_read_scope": "Frozen terminal paragraph ending橡皮手; no previous source pixels or gate repeated",
        "toc": binding(ROOT / "ssot-resources/soviet10year-textbooks/toc/9p/zh.json"),
    },
    "native_tools": {
        name: binding(ROOT / ".claude/skills/ld-s10y-lesson/tools" / name)
        for name in ("p2c.py", "layout.py", "blocks.py", "normalize.py", "mathcheck.py")
    },
    "profile": binding(profile_path),
    "helper": binding(Path(__file__).resolve()),
}
for page, expected in observed_rows.items():
    work = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{page:04d}"
    draft = OUT / f"{page:04d}.page.md"
    meta, page_blocks = blocks.load(draft)
    source = work / "page.png"
    source_binding = binding(source)
    assert meta["render"]["sha256"] == source_binding["sha256"]
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
            "padding_px": padding,
            "exact_source_extraction_box": [
                max(0, x - padding), max(0, y - padding),
                min(image.width, x + width + padding) - max(0, x - padding),
                min(image.height, y + height + padding) - max(0, y - padding),
            ],
            "candidate": binding(candidate), "prospective_margin": binding(margin),
            "source_inventory": inventory[fid],
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
    normalization_deltas = []
    charset = []
    texts = []
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
        errors.append("Draft rows differ from independently inventoried author physical rows")
    if len(configured_bands) != expected:
        errors.append("Configured native counter differs from author physical rows")
    if normalization_deltas or charset or math_errors:
        errors.append("Native normalization/charset/math requires attention")
    record["pages"].append({
        "pdf_page": page, "printed_page": meta["printed_page"],
        "draft": binding(draft), "source": source_binding,
        "grid": binding(work / "page.grid.png"),
        "prepare_layout": binding(work / "layout.json"),
        "prepare_template": binding(work / "page.template.md"),
        "dimensions": list(image.size), "blocks": len(page_blocks),
        "author_observed_printed_rows_including_footer": expected,
        "draft_printed_rows": blocks.printed_lines(page_blocks),
        "default_native_count": len(default_bands),
        "default_native_bands": default_bands,
        "configured_native_count": len(configured_bands),
        "configured_native_bands": configured_bands,
        "diagnostic_edge100_count": len(edge100_bands),
        "diagnostic_edge100_bands": edge100_bands,
        "counting": meta.get("counting"),
        "masked_default_bands_evidence": binding(bands_file),
        "source_figures": figures,
        "block_inventory": [
            {
                "ref": f"p{page:04d}#{index}", "kind": block["kind"],
                "label": block["label"], "owner_exercise": block["owner_exercise"],
                "physical_rows": len(block["lines"]) + sum(line.count(blocks.WRAP) for line in block["lines"]),
                "open": block["open"], "cont": block["cont"], "samerow": block["samerow"],
            }
            for index, block in enumerate(page_blocks, 1)
        ],
        "normalizations_needed": normalization_deltas, "charset_findings": charset,
        "math_errors": math_errors, "math_warnings": math_warnings,
        "math_fragments": sum(len(re.findall(r"\$[^$]*\$", item["text"])) for item in texts),
        "native_author_errors": errors,
        "source_png_and_ink_unchanged": binding(source) == source_binding,
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
        key: figure[key] for key in ("id", "rough_box", "snapped_box", "candidate")
    } for page in record["pages"] for figure in page["source_figures"]],
}, ensure_ascii=False, indent=2))
