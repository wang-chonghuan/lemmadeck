"""New-page source author measurements only; no finalize or independent gate."""

import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks
import layout
import mathcheck
import normalize
import p2c

ROWS = {172: 15, 173: 25, 174: 21, 175: 19}
BLOCK_ROWS = {
    172: [7, 0, 1, 0, 1, 0, 1, 0, 1, 5, 1],
    173: [1, 3, 9, 0, 1, 5, 4, 2, 1],
    174: [0, 1, 0, 1, 1, 6, 3, 3, 5, 1, 1],
    175: [9, 0, 1, 1, 3, 2, 2, 0, 1, 0, 1, 1],
}


def bind(file):
    file = Path(file)
    return {"path": str(file.relative_to(ROOT)), "sha256": layout.sha256_file(file)}


def new_json(file, value):
    assert not file.exists(), f"Preserve recorded evidence: {file}"
    file.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def observe():
    target = OUT / "author-check.json"
    assert not target.exists(), "Do not repeat recorded source measurements"
    assert not (OUT / "author-freeze.json").exists(), "Do not change frozen package"
    profile_file = ROOT / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"
    profile = normalize.load_profile(profile_file)
    result = {
        "ticket": "STEMROBIN-181",
        "batch": "D019",
        "role": "source-author-only",
        "status": "native-author-measurements-not-independent-source-or-science-gate",
        "pdf": bind(ROOT / "ssot-resources/soviet10year-textbooks/sources/soviet10years/9p 苏联中学课本 物理 九年级.pdf"),
        "incoming_context": {
            **bind(ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0168-0171/0171.page.md"),
            "scope": "Terminal body paragraph only; no prior image or gate repeated",
            "terminal_text": "“排列”成一定形状的曲线.",
            "paragraph_closed": True,
            "new_paragraph_at172": True,
        },
        "inherited_source_gate": {
            **bind(ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/source-review-9p-0168-0171.json"),
            "repeated": False,
        },
        "tools": {name: bind(TOOLS / name) for name in ("p2c.py", "layout.py", "blocks.py", "normalize.py", "mathcheck.py")},
        "profile": bind(profile_file),
        "helper": bind(Path(__file__).resolve()),
        "pages": [],
    }
    for page, expected in ROWS.items():
        work = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{page:04d}"
        draft = OUT / f"{page:04d}.page.md"
        source = work / "page.png"
        original_source = bind(source)
        meta, parsed = blocks.load(draft)
        assert meta["render"]["sha256"] == original_source["sha256"]
        assert meta["page"] == page and meta["printed_page"] == page - 9
        block_rows = [len(item["lines"]) + sum(line.count(blocks.WRAP) for line in item["lines"]) for item in parsed]
        assert block_rows == BLOCK_ROWS[page], (page, block_rows)
        with Image.open(source) as image:
            ink = layout.ink_mask(image)
            masked = ink.copy()
            figures = []
            sequence = 0
            for index, item in enumerate(parsed, 1):
                if item["kind"] != "fig":
                    continue
                sequence += 1
                fid = blocks.fig_id(item["label"], page, sequence)
                box, info = layout.snap(ink, item["box"])
                pad = p2c._figure_crop_padding(meta, fid)
                candidate = OUT / "candidate-figures" / f"{fid}.png"
                assert not candidate.exists(), f"Preserve initial candidate: {candidate}"
                layout.crop(source, box, candidate, pad=pad)
                x, y, width, height = box
                masked[y:y + height, x:x + width] = False
                left, top = max(0, x - pad), max(0, y - pad)
                right, bottom = min(image.width, x + width + pad), min(image.height, y + height + pad)
                figures.append({
                    "id": fid, "block": f"p{page:04d}#{index}",
                    "label": item["label"], "rough_box": item["box"],
                    "snapped_box": box, "native_snap": info,
                    "padding_px": pad,
                    "exact_source_extraction_box_xywh": [left, top, right - left, bottom - top],
                    "candidate": bind(candidate),
                })
            columns = ink.any(axis=0).nonzero()[0]
            content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
            default = layout.line_bands(masked, content_width)
            configured = p2c._counting_line_bands(meta, masked, content_width)
            masked_file = OUT / "evidence" / f"{page:04d}-figure-masked-counting-copy.png"
            masked_file.parent.mkdir(parents=True, exist_ok=True)
            assert not masked_file.exists()
            Image.fromarray((~masked).astype("uint8") * 255).save(masked_file)
            dimensions = list(image.size)
        normalizations, charset, texts = [], [], []
        for index, item in enumerate(parsed, 1):
            for row, line in enumerate(item["lines"], 1):
                normalized, changes = normalize.normalize_text(line, profile)
                if line != normalized:
                    normalizations.append({"block": index, "row": row, "changes": changes})
            text = blocks.text_of(item)
            charset.extend({"block": index, **entry} for entry in normalize.check_charset(text, profile))
            texts.append({"id": f"p{page:04d}#{index}", "text": text})
        errors, warnings = mathcheck.collect_and_check(texts, lambda item: [("text", item["text"])])
        result["pages"].append({
            "pdf_page": page, "printed_page": meta["printed_page"],
            "draft": bind(draft), "source": original_source,
            "grid": bind(work / "page.grid.png"),
            "layout": bind(work / "layout.json"),
            "prepare_template": bind(work / "page.template.md"),
            "dimensions_px": dimensions, "blocks": len(parsed),
            "author_visible_rows_including_footer": expected,
            "author_block_rows": BLOCK_ROWS[page],
            "draft_printed_rows": blocks.printed_lines(parsed),
            "default_native_count": len(default), "default_native_bands": default,
            "configured_native_count": len(configured), "configured_native_bands": configured,
            "counting": meta.get("counting"),
            "native_count_matches_author": len(configured) == expected,
            "figure_masked_counting_copy": bind(masked_file),
            "figures": figures,
            "block_inventory": [
                {
                    "ref": f"p{page:04d}#{index}", "kind": item["kind"],
                    "label": item["label"], "open": item["open"], "cont": item["cont"],
                    "samerow": item["samerow"], "footnote": item["label"] == "footnote",
                    "physical_rows_before_samerow": rows,
                }
                for index, (item, rows) in enumerate(zip(parsed, block_rows), 1)
            ],
            "normalizations_needed": normalizations,
            "charset_findings": charset, "math_errors": errors, "math_warnings": warnings,
            "source_pixels_unchanged": bind(source) == original_source,
        })
    new_json(target, result)
    print(json.dumps({
        "author_check": bind(target),
        "pages": [
            {key: page[key] for key in (
                "pdf_page", "blocks", "author_visible_rows_including_footer", "draft_printed_rows",
                "default_native_count", "configured_native_count", "normalizations_needed",
                "charset_findings", "math_errors", "math_warnings",
            )}
            for page in result["pages"]
        ],
        "figures": [figure for page in result["pages"] for figure in page["figures"]],
    }, ensure_ascii=False, indent=2))


def freeze():
    measurements = json.loads((OUT / "author-check.json").read_text())
    notes = json.loads((OUT / "author-notes.json").read_text())
    for page in measurements["pages"]:
        for field in ("draft", "source", "grid", "layout", "prepare_template"):
            item = page[field]
            assert bind(ROOT / item["path"])["sha256"] == item["sha256"], item["path"]
        for figure in page["figures"]:
            item = figure["candidate"]
            assert bind(ROOT / item["path"])["sha256"] == item["sha256"]
    blockers = [
        {
            "pdf_page": page["pdf_page"],
            "reason": "Actual author row count differs from native masked count",
            "actual": page["author_visible_rows_including_footer"],
            "native": page["configured_native_count"],
        }
        for page in measurements["pages"] if not page["native_count_matches_author"]
    ]
    for page in measurements["pages"]:
        for field in ("normalizations_needed", "charset_findings", "math_errors"):
            if page[field]:
                blockers.append({"pdf_page": page["pdf_page"], "reason": field, "details": page[field]})
    output = {
        "ticket": "STEMROBIN-181", "batch": "D019", "role": "source-author-only",
        "status": "frozen-pending-unique-independent-source-gate" if not blockers else "frozen-author-evidence-with-blockers",
        "scope": {
            "book": "9p", "pdf_pages": list(ROWS),
            "printed_pages": [page - 9 for page in ROWS],
            "lesson_group_numbering": True, "excluded_from_D018": True,
        },
        "initial_absence_and_prepare": notes["initial_absence_and_prepare"],
        "pdf": measurements["pdf"], "incoming_context": measurements["incoming_context"],
        "inherited_source_gate": measurements["inherited_source_gate"],
        "pages": measurements["pages"], "tools": measurements["tools"],
        "profile": measurements["profile"], "helper": bind(Path(__file__).resolve()),
        "author_notes": bind(OUT / "author-notes.json"),
        "author_check": bind(OUT / "author-check.json"),
        "pixel_observations": notes["pixel_observations"],
        "source_boundaries": notes["source_boundaries"],
        "figure_inventory": notes["figure_inventory"],
        "uncertainties": notes["uncertainties"], "blockers": blockers,
        "counts": {
            "visible_rows_including_footer": list(ROWS.values()),
            "total_rows": sum(ROWS.values()),
            "blocks": sum(page["blocks"] for page in measurements["pages"]),
            "source_tasks": 0,
            "source_figures": [figure["id"] for page in measurements["pages"] for figure in page["figures"]],
            "explanatory_footnote_rows": 2, "footer_rows": 4,
        },
        "source_or_science_self_approval": False,
        "no_finalize_vectorize_assemble_or_promotion": True,
        "no_prior_source_or_modern_product_changes": True,
        "browser_network_models_db_git_used": False,
        "in_flight_processes": [],
    }
    new_json(OUT / "author-freeze.json", output)
    print(json.dumps({"freeze": bind(OUT / "author-freeze.json"), "status": output["status"], "counts": output["counts"], "blockers": blockers}, ensure_ascii=False, indent=2))


if sys.argv[1:] == ["observe"]:
    observe()
elif sys.argv[1:] == ["freeze"]:
    freeze()
else:
    raise SystemExit("Expected observe or freeze; never execute finalized or old gates")
