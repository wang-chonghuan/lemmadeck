"""One scratch-only native observation, followed by a hash-only freeze."""

import hashlib
import json
import shutil
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

ROWS = {208: 25, 209: 29, 210: 19, 211: 24}
BLOCK_ROWS = {
    208: [3, 5, 5, 1, 1, 1, 2, 3, 3, 1],
    209: [4, 4, 1, 4, 0, 1, 3, 2, 1, 1, 1, 6, 1, 1],
    210: [1, 1, 5, 0, 0, 1, 1, 3, 4, 3, 1],
    211: [2, 1, 3, 6, 0, 1, 1, 1, 4, 1, 2, 1, 1, 1],
}
NATIVE_TOOLS = (
    "p2c.py", "layout.py", "blocks.py", "normalize.py",
    "mathcheck.py", "katex_check.js",
)
PATTERN = OUT.parent / "9p-next-source-0200-0203"


def bind(path):
    path = Path(path)
    return {"path": str(path.relative_to(ROOT)), "sha256": layout.sha256_file(path)}


def write_new(path, value):
    with Path(path).open("x", encoding="utf-8") as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def text_freeze(pages):
    manifest = "".join(
        f"{item['pdf_page']:04d}:{item['draft']['sha256']}\n" for item in pages
    )
    return {
        "algorithm": "sha256 of ordered UTF-8 NNNN:draft-sha256 newline records",
        "manifest": manifest,
        "sha256": hashlib.sha256(manifest.encode("utf-8")).hexdigest(),
    }


def observe():
    assert not (OUT / "author-check.json").exists(), "Native observation is write-once"
    assert not (OUT / "author-freeze.json").exists()
    (OUT / "candidate-figures").mkdir(exist_ok=True)
    (OUT / "evidence").mkdir(exist_ok=True)
    incoming = OUT.parent / "9p-next-source-0204-0207/0207.page.md"
    incoming_context = {
        "next_ref": "p0208#1",
        "scope": "Text only; no inherited source, science or approval evidence.",
    }
    if incoming.exists():
        incoming_binding = bind(incoming)
        snapshot = OUT / "evidence/incoming-0207-snapshot.page.md"
        assert not snapshot.exists()
        shutil.copyfile(incoming, snapshot)
        assert bind(snapshot)["sha256"] == incoming_binding["sha256"]
        _, incoming_blocks = blocks.load(snapshot)
        last_index, last = next(
            (i, item) for i, item in reversed(list(enumerate(incoming_blocks, 1)))
            if item["kind"] in ("p", "ex") and item.get("label") != "footnote"
        )
        incoming_context.update({
            "available": True,
            "source_draft_at_read": incoming_binding,
            "snapshot": bind(snapshot),
            "terminal_ref": f"p0207#{last_index}",
            "terminal_text": blocks.text_of(last),
            "kind": last["kind"],
            "label": last["label"],
            "open": last["open"],
        })
    else:
        incoming_context.update({
            "available": False,
            "decision": "Freeze p0208#1 ex1 cont from its pixels; incoming207 unresolved.",
        })
    profile_path = TOOLS.parent / "profiles/soviet-cn.json"
    profile = normalize.load_profile(profile_path)
    result = {
        "schema": "STEMROBIN-181/source-author-native-observations@1",
        "ticket": "STEMROBIN-181",
        "batch": "9p-next-source-0208-0211",
        "role": "source-author-only",
        "status": "native-author-measurements-not-source-or-science-approval",
        "pdf": bind(ROOT / "ssot-resources/soviet10year-textbooks/sources/soviet10years/9p 苏联中学课本 物理 九年级.pdf"),
        "manifest": bind(ROOT / "ssot-resources/soviet10year-textbooks/sources/manifest.json"),
        "toc": bind(ROOT / "ssot-resources/soviet10year-textbooks/toc/9p/zh.json"),
        "profile": bind(profile_path),
        "tools": {name: bind(TOOLS / name) for name in NATIVE_TOOLS},
        "helper": bind(Path(__file__).resolve()),
        "preparation_helper": bind(OUT / "prepare-once.mjs"),
        "native_pattern": {
            "author_helper": bind(PATTERN / "author-check.py"),
            "prepare_helper": bind(PATTERN / "prepare-once.mjs"),
        },
        "lesson_skill": bind(TOOLS.parent / "SKILL.md"),
        "image_rules": bind(ROOT / ".agents/skills/ld-s10y-image/SKILL.md"),
        "authorization": "Current human request: SOURCE author208-211, scratch-only.",
        "ticket_backend_used": False,
        "incoming_context": incoming_context,
        "prepare_provenance": [],
        "pages": [],
    }
    for page, expected in ROWS.items():
        work = ROOT / f".tmp/ld-s10y-lesson/9p/pages/{page:04d}"
        source = work / "page.png"
        source_binding = bind(source)
        meta, parsed = blocks.load(OUT / f"{page:04d}.page.md")
        report = OUT / f"prepare-{page}.json"
        preparation = json.loads(report.read_text())
        assert preparation["exitCode"] == 0 and preparation["processesFinished"]
        assert preparation["initialNativeAndPersistentPageAbsent"]
        assert preparation["helper"] == result["preparation_helper"]
        assert preparation["nativeTool"] == result["tools"]["p2c.py"]
        for entry in preparation["outputs"]:
            assert bind(ROOT / entry["path"]) == entry, "Prepared bytes changed"
        result["prepare_provenance"].append(bind(report))
        assert meta["page"] == page and meta["printed_page"] == page - 9
        assert meta["render"]["sha256"] == source_binding["sha256"]
        assert meta["source"]["pdf_sha256"] == result["pdf"]["sha256"]
        assert meta["profile"]["sha256"] == result["profile"]["sha256"]
        assert "counting" not in meta and "figure_crops" not in meta
        block_rows = [
            len(item["lines"]) + sum(line.count(blocks.WRAP) for line in item["lines"])
            for item in parsed
        ]
        assert block_rows == BLOCK_ROWS[page], (page, block_rows)
        assert blocks.printed_lines(parsed) == expected
        assert all(item["lines"] for item in parsed if item["kind"] in blocks.KINDS_TEXT)
        figures = []
        with Image.open(source) as image:
            assert list(image.size) == [meta["render"]["w"], meta["render"]["h"]]
            ink = layout.ink_mask(image)
            masked = ink.copy()
            for index, item in enumerate(parsed, 1):
                if item["kind"] != "fig":
                    continue
                fid = blocks.fig_id(item["label"], page, len(figures) + 1)
                exact, native = layout.snap(ink, item["box"])
                assert native["components"] > 0
                padding = p2c._figure_crop_padding(meta, fid)
                candidate = OUT / "candidate-figures" / f"{fid}.png"
                assert not candidate.exists(), "Never re-snap an existing candidate"
                layout.crop(source, exact, candidate, pad=padding)
                x, y, width, height = exact
                masked[max(0, y):y + height, max(0, x):x + width] = False
                left, top = max(0, x - padding), max(0, y - padding)
                right = min(image.width, x + width + padding)
                bottom = min(image.height, y + height + padding)
                figures.append({
                    "id": fid,
                    "block": f"p{page:04d}#{index}",
                    "label": item["label"],
                    "rough_box": item["box"],
                    "box": exact,
                    "snapped_box": exact,
                    "native_snap": native,
                    "padding_px": padding,
                    "exact_source_extraction_box_xywh":
                        [left, top, right - left, bottom - top],
                    "candidate": bind(candidate),
                })
            geometry_errors = [
                error for i, first in enumerate(figures) for second in figures[i + 1:]
                if (error := p2c._figure_overlap_error(ink, first, second))
            ]
            columns = ink.any(axis=0).nonzero()[0]
            content_width = int(columns[-1] - columns[0] + 1) if columns.size else image.width
            bands = p2c._counting_line_bands(meta, masked, content_width)
            extents = []
            for top, bottom in bands:
                xs = masked[top:bottom + 1].any(axis=0).nonzero()[0]
                extents.append({
                    "y": [int(top), int(bottom)],
                    "x": [int(xs[0]), int(xs[-1])] if xs.size else None,
                })
            masked_file = OUT / "evidence" / f"{page:04d}-figure-masked-counting-copy.png"
            assert not masked_file.exists()
            Image.fromarray((~masked).astype("uint8") * 255).save(masked_file)
        changes, charset, enums, texts = [], [], [], []
        for index, item in enumerate(parsed, 1):
            for row, line in enumerate(item["lines"], 1):
                normalized, entries = normalize.normalize_text(line, profile)
                if normalized != line:
                    changes.append({"block": index, "row": row, "changes": entries})
            text = blocks.text_of(item)
            charset.extend({"block": index, **entry}
                           for entry in normalize.check_charset(text, profile))
            for key in p2c.ENUM_LINE.findall(blocks.text_of(item, join="\n")):
                if normalize.enum_key_script(key) not in ("cyrillic", "numeric"):
                    enums.append({"block": index, "marker": key})
            texts.append({"id": f"p{page:04d}#{index}", "text": text})
        errors, warnings = mathcheck.collect_and_check(
            texts, lambda item: [("text", item["text"])]
        )
        prepared_layout = json.loads((work / "layout.json").read_text())
        result["pages"].append({
            "pdf_page": page,
            "printed_page": meta["printed_page"],
            "draft": bind(OUT / f"{page:04d}.page.md"),
            "source": source_binding,
            "grid": bind(work / "page.grid.png"),
            "layout": bind(work / "layout.json"),
            "prepare_template": bind(work / "page.template.md"),
            "dimensions_px": [meta["render"]["w"], meta["render"]["h"]],
            "blocks": len(parsed),
            "author_visible_rows_including_footer": expected,
            "author_block_rows": block_rows,
            "draft_printed_rows": blocks.printed_lines(parsed),
            "initial_prepare_native_count": len(prepared_layout["line_bands"]),
            "native_count": len(bands),
            "native_count_matches_author": len(bands) == expected,
            "native_bands": bands,
            "native_band_extents": extents,
            "counting": None,
            "figure_masked_counting_copy": bind(masked_file),
            "figures": figures,
            "geometry_errors": geometry_errors,
            "block_inventory": [
                {
                    "ref": f"p{page:04d}#{index}", "kind": item["kind"],
                    "label": item["label"], "open": item["open"],
                    "cont": item["cont"], "samerow": item["samerow"],
                    "owner_exercise": item["owner_exercise"],
                    "physical_rows_before_samerow": count,
                    "source_lines": item["lines"],
                    "joined_source_text": blocks.text_of(item),
                }
                for index, (item, count) in enumerate(zip(parsed, block_rows), 1)
            ],
            "normalizations_needed": changes,
            "charset_findings": charset,
            "enum_findings": enums,
            "math_errors": errors,
            "math_warnings": warnings,
            "errata_errors": p2c._validate_page_errata(meta, parsed, page),
            "source_pixels_unchanged": bind(source) == source_binding,
        })
    result["text_freeze"] = text_freeze(result["pages"])
    write_new(OUT / "author-check.json", result)
    print(json.dumps({
        "author_check": bind(OUT / "author-check.json"),
        "text_freeze": result["text_freeze"],
        "incoming_context": incoming_context,
        "pages": [{key: page[key] for key in (
            "pdf_page", "blocks", "draft_printed_rows", "native_count",
            "native_band_extents", "normalizations_needed", "charset_findings",
            "enum_findings", "geometry_errors", "math_errors", "math_warnings",
        )} for page in result["pages"]],
        "figures": [figure for page in result["pages"] for figure in page["figures"]],
    }, ensure_ascii=False, indent=2))


def freeze():
    check = json.loads((OUT / "author-check.json").read_text())
    notes = json.loads((OUT / "author-notes.json").read_text())
    bindings = list(check["tools"].values()) + [
        check[key] for key in (
            "pdf", "manifest", "toc", "profile", "helper", "preparation_helper",
            "lesson_skill", "image_rules",
        )
    ]
    bindings += list(check["native_pattern"].values())
    bindings += check["prepare_provenance"]
    if check["incoming_context"]["available"]:
        bindings.append(check["incoming_context"]["snapshot"])
    blockers = []
    for page in check["pages"]:
        bindings += [page[key] for key in (
            "draft", "source", "grid", "layout", "prepare_template",
            "figure_masked_counting_copy",
        )]
        bindings += [figure["candidate"] for figure in page["figures"]]
        if not page["native_count_matches_author"]:
            blockers.append({
                "pdf_page": page["pdf_page"],
                "reason": "Native masked count differs from source physical-row count",
                "actual": page["draft_printed_rows"], "native": page["native_count"],
            })
        for key in (
            "normalizations_needed", "charset_findings", "enum_findings",
            "geometry_errors", "math_errors", "errata_errors",
        ):
            if page[key]:
                blockers.append({"pdf_page": page["pdf_page"], "reason": key,
                                 "details": page[key]})
    ledger = [
        {"load": index, "kind": entry["kind"], "file": bind(ROOT / entry["path"]),
         "detail": "original"}
        for index, entry in enumerate(notes["image_ledger"], 1)
    ]
    candidates = [figure for page in check["pages"] for figure in page["figures"]]
    viewed_ids = [entry["id"] for entry in notes["candidate_crop_observations"]]
    unviewed_ids = [entry["id"] for entry in notes.get("unviewed_candidates", [])]
    assert 4 <= len(ledger) <= 8
    assert [entry["kind"] for entry in ledger] == ["source-original"] * 4 + ["candidate"] * len(viewed_ids)
    assert len(viewed_ids) <= 4 and len(set(viewed_ids)) == len(viewed_ids)
    assert set(viewed_ids + unviewed_ids) == {entry["id"] for entry in candidates}
    assert all(entry["actuallyOpenedOriginal"] for entry in notes["source_image_observations"])
    assert all(entry["actuallyOpenedOriginal"] for entry in notes["candidate_crop_observations"])
    bindings += [entry["file"] for entry in ledger]
    for entry in bindings:
        assert bind(ROOT / entry["path"]) == entry, f"Input changed: {entry['path']}"
    blockers += notes.get("crop_or_fidelity_blockers", [])
    blockers += [
        {"figure": entry["id"], "reason": "Unviewed candidate: image-budget stop",
         "details": entry} for entry in notes.get("unviewed_candidates", [])
    ]
    output = {
        **check,
        "schema": "STEMROBIN-181/source-author-freeze@1",
        "status": "frozen-author-evidence-with-blockers" if blockers
            else "frozen-pending-independent-source-gate",
        "scope": {"book": "9p", "pdf_pages": list(ROWS),
                  "printed_pages": [page - 9 for page in ROWS]},
        "author_check": bind(OUT / "author-check.json"),
        "author_notes": bind(OUT / "author-notes.json"),
        "source_image_observations": notes["source_image_observations"],
        "candidate_crop_observations": notes["candidate_crop_observations"],
        "unviewed_candidates": notes.get("unviewed_candidates", []),
        "source_boundaries": notes["source_boundaries"],
        "source_group_inventory": notes["source_group_inventory"],
        "figure_inventory": notes["figure_inventory"],
        "uncertainties": notes["uncertainties"],
        "count_observations": notes["count_observations"],
        "image_ledger": ledger,
        "images_loaded_total": len(ledger),
        "grid_images_loaded": 0,
        "detail_images_loaded": 0,
        "reopens": 0,
        "image_batch_limit": 8,
        "blockers": blockers,
        "counts": {
            "visible_rows_including_footer": list(ROWS.values()),
            "native_rows": [page["native_count"] for page in check["pages"]],
            "initial_prepare_native_rows": [
                page["initial_prepare_native_count"] for page in check["pages"]
            ],
            "total_visible_rows": sum(ROWS.values()),
            "blocks": sum(page["blocks"] for page in check["pages"]),
            "source_tasks": 11,
            "worked_examples_including_incoming_fragment": 2,
            "explanatory_footnote_rows": 0,
            "separator_rows": 1,
            "footer_rows": 4,
            "source_figures": [figure["id"] for figure in candidates],
        },
        "source_or_science_self_approval": False,
        "native_author_audit_runs": 1,
        "native_prepare_runs_per_page": 1,
        "initial_native_counter_runs_per_page": 1,
        "masked_native_counter_runs_per_page_in_single_author_check": 1,
        "normalization_changes_applied": False,
        "no_finalize_vectorize_assemble_or_promotion": True,
        "browser_models_db_git_used": False,
        "shared_tools_or_skills_edited": False,
        "persistent_content_and_unowned_files_written": False,
        "in_flight_processes": [],
    }
    write_new(OUT / "author-freeze.json", output)
    print(json.dumps({
        "freeze": bind(OUT / "author-freeze.json"),
        "text_freeze_sha256": output["text_freeze"]["sha256"],
        "status": output["status"], "counts": output["counts"],
        "blockers": blockers, "images_loaded_total": len(ledger),
    }, ensure_ascii=False, indent=2))


if sys.argv[1:] == ["observe"]:
    observe()
elif sys.argv[1:] == ["freeze"]:
    freeze()
else:
    raise SystemExit("Expected observe or freeze")
