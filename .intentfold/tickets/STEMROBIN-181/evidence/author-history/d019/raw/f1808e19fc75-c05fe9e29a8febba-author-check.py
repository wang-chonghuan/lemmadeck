"""Scoped source-author measurements and one freeze; no source approval."""

import copy
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

ROWS = {176: 23, 177: 24, 178: 14, 179: 22}
BLOCK_ROWS = {
    176: [2, 1, 1, 3, 1, 6, 0, 3, 1, 1, 1, 1, 1, 1, 1],
    177: [4, 1, 4, 8, 6, 1],
    178: [0, 1, 0, 1, 1, 2, 4, 0, 1, 0, 1, 4, 1],
    179: [1, 9, 0, 1, 0, 1, 1, 2, 2, 1, 4, 1],
}
PDF = ROOT / "ssot-resources/soviet10year-textbooks/sources/soviet10years/9p 苏联中学课本 物理 九年级.pdf"
PRIOR = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/9p-next-source-0172-0175"


def bind(file):
    file = Path(file)
    return {"path": str(file.relative_to(ROOT)), "sha256": layout.sha256_file(file)}


def new_json(file, value):
    assert not file.exists(), f"Preserve existing evidence: {file}"
    file.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def verify_bindings(value):
    if isinstance(value, dict):
        if "path" in value and "sha256" in value:
            assert bind(ROOT / value["path"])["sha256"] == value["sha256"], value["path"]
        for child in value.values():
            verify_bindings(child)
    elif isinstance(value, list):
        for child in value:
            verify_bindings(child)


def observe():
    assert not (OUT / "author-check.json").exists()
    assert not (OUT / "author-freeze.json").exists()
    profile_file = ROOT / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"
    profile = normalize.load_profile(profile_file)
    prior = json.loads((PRIOR / "author-freeze.json").read_text())
    prior_page = next(page for page in prior["pages"] if page["pdf_page"] == 175)
    assert bind(PRIOR / "0175.page.md")["sha256"] == prior_page["draft"]["sha256"]
    result = {
        "ticket": "STEMROBIN-181",
        "batch": "D019",
        "role": "source-author-only",
        "status": "native-author-measurements-not-independent-source-or-science-gate",
        "pdf": bind(PDF),
        "incoming_context": {
            "draft": bind(PRIOR / "0175.page.md"),
            "freeze": bind(PRIOR / "author-freeze.json"),
            "scope": "Frozen outgoing text only; no prior pixels or source gate repeated.",
            "from": "p0175#7",
            "terminal_text": "如果电力线的分布一致，则场强也应",
            "continues_in": "p0176#1",
            "trailing_figures_and_captions_transparent": True,
        },
        "tools": {
            name: bind(TOOLS / name)
            for name in ("p2c.py", "layout.py", "blocks.py", "normalize.py", "mathcheck.py", "katex_check.js")
        },
        "skill": bind(TOOLS.parent / "SKILL.md"),
        "profile": bind(profile_file),
        "manifest": bind(ROOT / "ssot-resources/soviet10year-textbooks/sources/manifest.json"),
        "toc": bind(ROOT / "ssot-resources/soviet10year-textbooks/toc/9p/zh.json"),
        "helper": bind(Path(__file__).resolve()),
        "pages": [],
    }
    for page, expected in ROWS.items():
        work = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{page:04d}"
        source = work / "page.png"
        source_binding = bind(source)
        draft = OUT / f"{page:04d}.page.md"
        meta, parsed = blocks.load(draft)
        assert meta["page"] == page and meta["printed_page"] == page - 9
        assert meta["render"]["sha256"] == source_binding["sha256"]
        assert meta["source"]["pdf_sha256"] == result["pdf"]["sha256"]
        block_rows = [
            len(item["lines"]) + sum(line.count(blocks.WRAP) for line in item["lines"])
            for item in parsed
        ]
        assert block_rows == BLOCK_ROWS[page], (page, block_rows)
        assert blocks.printed_lines(parsed) == expected
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
                padding = p2c._figure_crop_padding(meta, fid)
                candidate = OUT / "candidate-figures" / f"{fid}.png"
                assert not candidate.exists(), f"Preserve initial candidate: {candidate}"
                layout.crop(source, box, candidate, pad=padding)
                x, y, width, height = box
                masked[y:y + height, x:x + width] = False
                left, top = max(0, x - padding), max(0, y - padding)
                right = min(image.width, x + width + padding)
                bottom = min(image.height, y + height + padding)
                figures.append({
                    "id": fid,
                    "block": f"p{page:04d}#{index}",
                    "label": item["label"],
                    "rough_box_xywh": item["box"],
                    "snapped_box_xywh": box,
                    "native_snap": info,
                    "padding_px": padding,
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
        deltas, charset, texts = [], [], []
        for index, item in enumerate(parsed, 1):
            for row, line in enumerate(item["lines"], 1):
                normalized, changes = normalize.normalize_text(line, profile)
                if normalized != line:
                    deltas.append({
                        "block": index, "row": row, "before": line,
                        "after": normalized, "changes": changes,
                    })
            text = blocks.text_of(item)
            charset.extend({"block": index, **entry} for entry in normalize.check_charset(text, profile))
            texts.append({"id": f"p{page:04d}#{index}", "text": text})
        errors, warnings = mathcheck.collect_and_check(texts, lambda item: [("text", item["text"])])
        result["pages"].append({
            "pdf_page": page,
            "printed_page": meta["printed_page"],
            "draft": bind(draft),
            "source": source_binding,
            "grid": bind(work / "page.grid.png"),
            "layout": bind(work / "layout.json"),
            "prepare_template": bind(work / "page.template.md"),
            "dimensions_px": dimensions,
            "blocks": len(parsed),
            "author_visible_rows_including_footer": expected,
            "author_block_rows": block_rows,
            "draft_printed_rows": blocks.printed_lines(parsed),
            "default_native_count": len(default),
            "default_native_bands": default,
            "configured_native_count": len(configured),
            "configured_native_bands": configured,
            "counting": meta.get("counting"),
            "native_count_matches_author": len(configured) == expected,
            "figure_masked_counting_copy": bind(masked_file),
            "figures": figures,
            "block_inventory": [
                {
                    "ref": f"p{page:04d}#{index}",
                    "kind": item["kind"],
                    "label": item["label"],
                    "owner_exercise": item["owner_exercise"],
                    "open": item["open"],
                    "cont": item["cont"],
                    "samerow": item["samerow"],
                    "physical_rows_before_samerow_adjustment": rows,
                }
                for index, (item, rows) in enumerate(zip(parsed, block_rows), 1)
            ],
            "original_tasks": sum(item["kind"] == "ex" for item in parsed),
            "footnote_rows": sum(
                len(item["lines"]) for item in parsed
                if item["kind"] == "p" and item["label"] == "footnote"
            ),
            "normalizations_needed": deltas,
            "charset_findings": charset,
            "math_errors": errors,
            "math_warnings": warnings,
            "source_pixels_unchanged": bind(source) == source_binding,
        })
    new_json(OUT / "author-check.json", result)
    print(json.dumps({
        "author_check": bind(OUT / "author-check.json"),
        "pages": [
            {key: page[key] for key in (
                "pdf_page", "blocks", "author_visible_rows_including_footer",
                "draft_printed_rows", "default_native_count", "configured_native_count",
                "normalizations_needed", "charset_findings", "math_errors", "math_warnings",
            )}
            for page in result["pages"]
        ],
        "figures": [figure for page in result["pages"] for figure in page["figures"]],
    }, ensure_ascii=False, indent=2))


def count_edges():
    assert not (OUT / "author-counting-correction-check.json").exists()
    assert not (OUT / "author-freeze.json").exists()
    initial = json.loads((OUT / "author-check.json").read_text())
    effective = copy.deepcopy(initial)
    effective["initial_author_check"] = bind(OUT / "author-check.json")
    effective["status"] = "author-counting-copy-correction-not-independent-gate"
    effective["helper"] = bind(Path(__file__).resolve())
    effective["initial_helper_sha256"] = initial["helper"]["sha256"]
    effective["history_aliases"] = []
    for page in effective["pages"]:
        number = page["pdf_page"]
        if number not in (176, 178):
            continue
        before = OUT / "evidence" / f"{number:04d}-before-counting.page.md"
        assert bind(before)["sha256"] == page["draft"]["sha256"]
        current = ROOT / page["draft"]["path"]
        old_meta, old_blocks = blocks.load(before)
        meta, parsed = blocks.load(current)
        old_meta.pop("counting", None)
        current_meta = copy.deepcopy(meta)
        current_meta.pop("counting", None)
        assert current_meta == old_meta and parsed == old_blocks
        assert meta["counting"]["edge_margin_px"] == 100
        effective["history_aliases"].append({
            "original_path": page["draft"]["path"],
            "sha256": page["draft"]["sha256"],
            "retained_before": bind(before),
        })
        with Image.open(ROOT / page["source"]["path"]) as image:
            ink = layout.ink_mask(image)
            for figure in page["figures"]:
                x, y, width, height = figure["snapped_box_xywh"]
                ink[y:y + height, x:x + width] = False
            columns = ink.any(axis=0).nonzero()[0]
            content_width = int(columns[-1] - columns[0] + 1)
            bands = p2c._counting_line_bands(meta, ink, content_width)
        assert len(bands) == ROWS[number]
        page["draft"] = bind(current)
        page["counting"] = meta["counting"]
        page["configured_native_count"] = len(bands)
        page["configured_native_bands"] = bands
        page["native_count_matches_author"] = True
        page["body_flags_rows_order_unchanged_from_before"] = True
    new_json(OUT / "author-counting-correction-check.json", effective)
    print(json.dumps({
        "effective_measurements": bind(OUT / "author-counting-correction-check.json"),
        "rows": [
            {"page": page["pdf_page"], "actual": page["author_visible_rows_including_footer"],
             "default": page["default_native_count"], "configured": page["configured_native_count"]}
            for page in effective["pages"]
        ],
        "history_aliases": effective["history_aliases"],
    }, ensure_ascii=False, indent=2))


def freeze():
    assert not (OUT / "author-freeze.json").exists()
    measurement_file = OUT / "author-counting-correction-check.json"
    measurements = json.loads(measurement_file.read_text())
    notes = json.loads((OUT / "author-notes.json").read_text())
    verify_bindings(measurements)
    verify_bindings(notes)
    blockers = []
    for page in measurements["pages"]:
        if not page["native_count_matches_author"]:
            blockers.append({
                "pdf_page": page["pdf_page"],
                "reason": "Actual printed rows differ from configured native figure-masked count.",
                "actual": page["author_visible_rows_including_footer"],
                "native": page["configured_native_count"],
            })
        for field in ("normalizations_needed", "charset_findings", "math_errors"):
            if page[field]:
                blockers.append({"pdf_page": page["pdf_page"], "reason": field, "details": page[field]})
    blockers.extend(notes["blockers"])
    opened_candidates = {
        item["id"] for item in notes["figure_inventory"] if item["actuallyOpened"]
    }
    expected_candidates = {
        figure["id"] for page in measurements["pages"] for figure in page["figures"]
    }
    assert opened_candidates == expected_candidates
    output = {
        "ticket": "STEMROBIN-181",
        "batch": "D019",
        "role": "source-author-only",
        "status": "frozen-pending-unique-independent-source-gate" if not blockers else "frozen-author-evidence-with-blockers",
        "scope": {
            "book": "9p",
            "pdf_pages": list(ROWS),
            "printed_pages": [page - 9 for page in ROWS],
            "scratch_only": True,
        },
        "initial_absence_and_prepare": notes["initial_absence_and_prepare"],
        "pdf": measurements["pdf"],
        "incoming_context": measurements["incoming_context"],
        "pages": measurements["pages"],
        "tools": measurements["tools"],
        "skill": measurements["skill"],
        "profile": measurements["profile"],
        "manifest": measurements["manifest"],
        "toc": measurements["toc"],
        "helper": bind(Path(__file__).resolve()),
        "author_notes": bind(OUT / "author-notes.json"),
        "author_check": bind(OUT / "author-check.json"),
        "effective_author_check": bind(measurement_file),
        "history_aliases": measurements["history_aliases"],
        "pixel_observations": notes["pixel_observations"],
        "source_boundaries": notes["source_boundaries"],
        "figure_inventory": notes["figure_inventory"],
        "source_details": notes["source_details"],
        "uncertainties": notes["uncertainties"],
        "blockers": blockers,
        "counts": {
            "actual_rows_including_footer": list(ROWS.values()),
            "total_rows": sum(ROWS.values()),
            "blocks": sum(page["blocks"] for page in measurements["pages"]),
            "original_tasks": sum(page["original_tasks"] for page in measurements["pages"]),
            "source_figures": [
                figure["id"] for page in measurements["pages"] for figure in page["figures"]
            ],
            "footnote_rows": sum(page["footnote_rows"] for page in measurements["pages"]),
            "footer_rows": 4,
        },
        "source_or_science_self_approval": False,
        "no_finalize_vectorize_assemble_or_promotion": True,
        "no_prior_source_or_modern_product_changes": True,
        "browser_network_models_db_git_used": False,
        "in_flight_processes": [],
    }
    new_json(OUT / "author-freeze.json", output)
    print(json.dumps({
        "freeze": bind(OUT / "author-freeze.json"),
        "status": output["status"],
        "counts": output["counts"],
        "blockers": blockers,
    }, ensure_ascii=False, indent=2))


if sys.argv[1:] == ["observe"]:
    observe()
elif sys.argv[1:] == ["freeze"]:
    freeze()
elif sys.argv[1:] == ["count-edges"]:
    count_edges()
else:
    raise SystemExit("Use observe, count-edges or freeze; no source gate or old-page operation.")
