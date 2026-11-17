import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


WORKSPACE = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TICKET = WORKSPACE / ".intentfold/tickets/STEMROBIN-181/tmp"
AUTHOR = TICKET / "d046-10p-source124-127-author"
OUTPUT = TICKET / "d047-source124-127-review-evidence"
FREEZE_SHA = "46b89354a8536a05ce0501361239b2280d062c437dc8a24dae1d6f1e15161dcc"
PREPARE_SHA = "9377db4460fec528111df671252dbd45fde03ccfff35c16dcb34d8bb13f29ebb"
EXPECTED_ROWS = {124: 24, 125: 26, 126: 15, 127: 19}
EXPECTED_BLOCKS = {124: 13, 125: 10, 126: 10, 127: 11}

sys.path.insert(0, str(WORKSPACE / ".claude/skills/ld-s10y-lesson/tools"))
import blocks


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def absolute(path):
    path = Path(path)
    return path if path.is_absolute() else WORKSPACE / path


def binding(path, expected):
    path = absolute(path)
    actual = sha(path)
    return {"path": str(path), "expected_sha256": expected,
            "sha256": actual, "bytes": path.stat().st_size,
            "matches": actual == expected}


def main():
    phase = sys.argv[1]
    if phase not in ("initial", "end"):
        raise ValueError("phase must be initial or end")
    failures = []
    frozen_path = AUTHOR / "author-freeze.json"
    frozen = read_json(frozen_path)
    checks = [
        binding(frozen_path, FREEZE_SHA),
        binding(AUTHOR / "inputs/prepared.json", PREPARE_SHA),
    ]
    seen = {check["path"] for check in checks}

    def walk(value):
        if isinstance(value, dict):
            if isinstance(value.get("path"), str) and isinstance(value.get("sha256"), str):
                path = str(absolute(value["path"]))
                if path not in seen:
                    seen.add(path)
                    checks.append(binding(path, value["sha256"]))
                else:
                    actual = sha(Path(path))
                    if actual != value["sha256"]:
                        failures.append({"type": "conflicting-or-drifted-binding", "path": path})
            for child in value.values():
                walk(child)
        elif isinstance(value, list):
            for child in value:
                walk(child)

    walk(frozen)
    for check in checks:
        if not check["matches"]:
            failures.append({"type": "sha-drift", **check})

    prepared = read_json(AUTHOR / "inputs/prepared.json")
    walk(prepared)
    receipt_results = []
    for page in EXPECTED_ROWS:
        for verb in ("prepare", "finalize", "vectorize"):
            path = AUTHOR / f"commands/{verb}-{page}-initial.json"
            receipt = read_json(path)
            command = receipt["command"]
            command_ok = (
                verb in command and command[command.index("--page") + 1] == str(page)
                and command[command.index("--root") + 1] == str(AUTHOR / "source")
                and command[command.index("--work") + 1] == str(AUTHOR / "work")
            )
            passed = receipt["exitCode"] == 0 and command_ok and not receipt.get("stderr")
            receipt_results.append({
                "path": str(path), "sha256": sha(path), "verb": verb,
                "page": page, "exit_code": receipt["exitCode"],
                "command_target_matches": command_ok, "matches": passed,
                "executed_by_reviewer": False,
            })
            if not passed:
                failures.append({"type": "receipt-failed", "path": str(path)})

    pages = []
    images_opened_by_reviewer = []
    figures = []
    for page, expected_rows in EXPECTED_ROWS.items():
        page_id = str(page).zfill(4)
        source_dir = AUTHOR / f"source/10p/pages/{page_id}"
        work_dir = AUTHOR / f"work/10p/pages/{page_id}"
        native = read_json(source_dir / "page.json")
        md_meta, md_blocks = blocks.load(source_dir / "page.md")
        json_blocks = [{key: value for key, value in block.items() if key != "id"}
                       for block in native["blocks"]]
        audit = read_json(source_dir / "audit.json")
        rows = blocks.printed_lines(md_blocks)
        png_path = work_dir / "page.png"
        with Image.open(png_path) as image:
            dimensions = list(image.size)
            page_rgb = image.convert("RGB")
        congruent = md_meta == native["meta"] and md_blocks == json_blocks
        row_ok = rows == expected_rows == audit["lines_printed"] == audit["lines_md"]
        meta_ok = (
            native["meta"]["printed_lines"] == expected_rows
            and native["meta"]["render"]["sha256"] == sha(png_path)
            and dimensions == [native["meta"]["render"]["w"], native["meta"]["render"]["h"]]
            and not audit["errors"]
            and not native["meta"].get("counting")
            and not native["meta"].get("figure_crops")
        )
        if not (congruent and row_ok and meta_ok
                and len(native["blocks"]) == EXPECTED_BLOCKS[page]):
            failures.append({"type": "native-page-inconsistency", "page": page})
        pages.append({
            "physical_page": page, "printed_page": native["meta"]["printed_page"],
            "original_png": {"path": str(png_path), "sha256": sha(png_path),
                             "dimensions": dimensions},
            "native": [{"path": str(source_dir / name), "sha256": sha(source_dir / name)}
                       for name in ("page.md", "page.json", "audit.json")],
            "md_json_exact_structure_and_lines_match": congruent,
            "independent_pixel_rows": expected_rows, "parsed_body_rows": rows,
            "audit_rows": [audit["lines_printed"], audit["lines_md"]],
            "block_count": len(native["blocks"]),
            "block_boundaries": [
                {"ref": f"p{page_id}#{i + 1}", "kind": block["kind"],
                 "label": block.get("label"), "open": block["open"],
                 "cont": block["cont"], "samerow": block["samerow"],
                 "rows": len(block["lines"])}
                for i, block in enumerate(native["blocks"])
            ],
            "math_literals": [
                {"ref": f"p{page_id}#{i + 1}", "literal": math}
                for i, block in enumerate(native["blocks"])
                for line in block["lines"] for math in re.findall(r"\$[^$]*\$", line)
            ],
            "cyrillic_codepoints_in_candidate_body": sorted({
                f"U+{ord(char):04X}" for block in native["blocks"]
                for line in block["lines"] for char in line
                if 0x0400 <= ord(char) <= 0x04FF
            }),
        })
        images_opened_by_reviewer.append({
            "sequence": page - 123, "path": str(png_path),
            "sha256": sha(png_path), "purpose": "original-full-page",
            "opens": 1, "detail": "original",
        })
        frozen_page = next(entry for entry in frozen["pages"] if entry["physicalPage"] == page)
        vector_receipt_path = AUTHOR / f"commands/vectorize-{page}-initial.json"
        vector_stdout = read_json(vector_receipt_path)["stdout"]
        for crop in frozen_page["crops"]:
            x, y, w, h = crop["box"]
            pad = crop["paddingPx"]
            expected_rect = [x - pad, y - pad, w + 2 * pad, h + 2 * pad]
            left, top, width, height = crop["exactPixelRect"]
            crop_path = Path(crop["path"])
            svg_path = Path(crop["svg"]["path"])
            with Image.open(crop_path) as image:
                actual_crop = image.convert("RGB")
            original_rect = page_rgb.crop((left, top, left + width, top + height))
            pixel_equal = actual_crop.size == original_rect.size and (
                actual_crop.tobytes() == original_rect.tobytes())
            rect_ok = (
                expected_rect == crop["exactPixelRect"]
                and list(actual_crop.size) == crop["dimensions"] == [width, height]
                and left >= 0 and top >= 0
                and left + width <= dimensions[0] and top + height <= dimensions[1]
            )
            svg = ET.parse(svg_path).getroot()
            paths = list(svg.iter("{http://www.w3.org/2000/svg}path"))
            svg_structure_ok = (
                svg.attrib.get("viewBox") == f"0 0 {width} {height}"
                and svg.attrib.get("width") == str(width)
                and svg.attrib.get("height") == str(height)
                and len(paths) == 1 and len(list(svg)) == 1
                and paths[0].attrib.get("fill") == "currentColor"
                and paths[0].attrib.get("fill-rule") == "evenodd"
                and bool(paths[0].attrib.get("d"))
            )
            mismatch = re.search(re.escape(crop["id"]) + r"\s+不匹配\s+([0-9.]+)%", vector_stdout)
            percent = float(mismatch.group(1)) if mismatch else None
            fidelity_receipt_ok = percent is not None and percent <= 2
            history_png = AUTHOR / f"history/initial/{page_id}/figures/{crop['id']}.png"
            history_svg = AUTHOR / f"history/vectorized/{page_id}/figures/{crop['id']}.svg"
            histories_match = sha(history_png) == sha(crop_path) and sha(history_svg) == sha(svg_path)
            if not all((pixel_equal, rect_ok, svg_structure_ok, fidelity_receipt_ok, histories_match)):
                failures.append({"type": "raw-figure-inconsistency", "figure": crop["id"]})
            figures.append({
                "figure_id": crop["id"], "page": page,
                "source_png": {"path": str(png_path), "sha256": sha(png_path)},
                "png": {"path": str(crop_path), "sha256": sha(crop_path),
                        "bytes": crop_path.stat().st_size},
                "svg": {"path": str(svg_path), "sha256": sha(svg_path),
                        "bytes": svg_path.stat().st_size},
                "coarse_box": crop["from"], "snapped_box": crop["box"],
                "padding_px": pad, "exact_pixel_rect": crop["exactPixelRect"],
                "dimensions": crop["dimensions"], "rectangle_matches": rect_ok,
                "png_decoded_rgb_exactly_equals_original_rectangle": pixel_equal,
                "pixel_changes_or_cleanup": False if pixel_equal else "unexpected-difference",
                "svg_single_path_evenodd_currentcolor_and_dimensions_match": svg_structure_ok,
                "initial_png_and_post_vectorized_svg_history_bytes_match": histories_match,
                "fidelity_receipt": {
                    "path": str(vector_receipt_path), "sha256": sha(vector_receipt_path),
                    "mismatch_percent": percent, "limit_percent": 2, "edge_tolerance_px": 1,
                    "basis": "Existing initial-vectorization stdout, frozen current SVG and identical post-vectorization history; no new vectorization or SVG rasterization.",
                    "matches": fidelity_receipt_ok,
                },
            })
            images_opened_by_reviewer.append({
                "sequence": 5 + len(figures) - 1, "path": str(crop_path),
                "sha256": sha(crop_path), "purpose": "exact-final-crop",
                "opens": 1, "detail": "original",
            })
    images_opened_by_reviewer.sort(key=lambda image: image["sequence"])
    result = {
        "schema": "independent-source-raw-readonly-verification@1",
        "phase": phase, "checked_at": datetime.now(timezone.utc).isoformat(),
        "status": "PASS" if not failures else "HOLD",
        "scope": "Binding, native internal consistency, rectangle pixel equality, SVG bytes/structure and EXISTING fidelity receipts only. This script cannot confer semantic/source-script or modern science approval.",
        "freeze": checks[0], "prepare_manifest": checks[1],
        "unique_bound_files_checked": len(checks), "file_bindings": checks,
        "existing_command_receipts": receipt_results, "pages": pages, "figures": figures,
        "visual_image_open_ledger": images_opened_by_reviewer,
        "visual_image_opens": 8, "grid_or_extra_image_opens": 0,
        "read_only_decodes": "Originals and exact crops decoded only for machine equality, not emitted as extra visual images.",
        "forbidden_pipeline_invocations": 0, "author_or_canonical_writes": 0,
        "failures": failures,
    }
    path = OUTPUT / f"machine-{phase}.json"
    path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "phase": phase, "status": result["status"],
        "unique_bound_files_checked": len(checks), "rows": EXPECTED_ROWS,
        "crop_rgb_exact_equality": {figure["figure_id"]: figure["png_decoded_rgb_exactly_equals_original_rectangle"] for figure in figures},
        "existing_fidelity_percent": {figure["figure_id"]: figure["fidelity_receipt"]["mismatch_percent"] for figure in figures},
        "failures": failures, "output": str(path), "sha256": sha(path),
    }, ensure_ascii=False, indent=2))
    return 0 if not failures else 1


if __name__ == "__main__":
    sys.exit(main())
