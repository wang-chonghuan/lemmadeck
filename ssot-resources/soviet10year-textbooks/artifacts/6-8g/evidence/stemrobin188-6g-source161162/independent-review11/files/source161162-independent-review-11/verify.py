"""Read-only binding and decoded-pixel checks; never invokes a producer."""

import hashlib
import json
import sys
from pathlib import Path

from PIL import Image, ImageChops


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
TMP = REPO / ".intentfold/tickets/STEMROBIN-188/tmp"
OWN = TMP / "source161162-independent-review-11"
INPUT = TMP / "source161162-independent-inputs-11"
AUTHOR = TMP / "source6g161162-author-first-10"
FIRST_SHA = "dc645054e03b7bceded0429de442dd72259b55a990cd4cfb9b7e5c8971fc42f7"
references = {}
failures = []


def bind(path, expected=None, purpose="read-only evidence"):
    path = Path(path).absolute()
    content = path.read_bytes()
    stat = path.stat()
    record = {
        "path": str(path),
        "sha256": hashlib.sha256(content).hexdigest(),
        "bytes": len(content),
        "mode": f"{stat.st_mode & 0o777:04o}",
        "purpose": purpose,
    }
    if expected is not None:
        record["expected_sha256"] = expected
        record["hash_matches"] = record["sha256"] == expected
        if not record["hash_matches"]:
            failures.append(f"Hash mismatch: {path}")
    references[str(path)] = record
    return record


def load(path, expected=None, purpose="structured evidence"):
    bind(path, expected, purpose)
    return json.loads(Path(path).read_text())


def write_new(name, data):
    # Only derived evidence is written, and only to this review's new files.
    with (OWN / name).open("x") as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2)
        handle.write("\n")


def manifest():
    evidence = load(OWN / "verification.json")
    for item in evidence["referenced_files"]:
        bind(item["path"], item["sha256"], item["purpose"])
    owned = []
    for path in sorted(OWN.rglob("*")):
        if path.is_file() and path.name != "manifest.json":
            owned.append(bind(path, purpose="exclusive review output"))
    write_new("manifest.json", {
        "schema": "source-independent/manifest@1",
        "scope": "Physical161162 source review only, not modern-image or course approval",
        "owned_root": str(OWN),
        "all_owned_files_except_manifest": owned,
        "referenced_files": [
            value for key, value in sorted(references.items())
            if not Path(key).is_relative_to(OWN)
        ],
        "counter_source": str(OWN / "report.json"),
        "no_active_reviewer_exec_sessions": True,
        "hash_check_failures": failures,
        "self_hash_transport": "SHA256 returned separately; no recursive self hash",
    })
    print(json.dumps({
        "owned_files_except_manifest": len(owned),
        "referenced_files": len([
            key for key in references if not Path(key).is_relative_to(OWN)
        ]),
        "hash_check_failures": failures,
    }))
    return bool(failures)


def audit():
    source = load(
        INPUT / "source-only.json",
        "e2f84a15541cf7bec4984dcce02369fdd8856c18c5aeb8c351b1a4d9aa60d3f9",
    )
    post = load(
        INPUT / "post-FIRST.json",
        "0ceb81c6b2398378758ce1807bcce6f369354267e64723c2a8ff2d71353cf4b4",
    )
    frozen = bind(OWN / "FIRST.md", FIRST_SHA, "unchanged frozen independent FIRST")
    if frozen["mode"] != "0444":
        failures.append("FIRST is not mode0444")
    for item in source["originalImages"]:
        bind(item["path"], item["sha256"], "original source page; independently viewed")
    # The inherited incoming160 report is intentionally not read or reopened.
    for key in ("authorReport", "authorManifest", "receiverRecord"):
        item = post[key]
        bind(item["path"], item["sha256"], "post-FIRST package binding")
    author_report = load(Path(post["authorReport"]["path"]))
    author_manifest = load(Path(post["authorManifest"]["path"]))
    for item in author_manifest["all_owned_files_except_manifest_itself"]:
        if item["relative_path"] in (
            "evidence/FIRST/0161/source-FIRST.md",
            "evidence/FIRST/0162/source-FIRST.md",
        ):
            bind(item["path"], item["sha256"], "author FIRST preserved; not independent evidence")
    for item in post["sourceCrops"]:
        bind(item["path"], item["sha256"], "original native figure crop")
    for item in post["candidates"]:
        for file in item["files"]:
            bind(file["path"], file["sha256"], "actual candidate source md/json/audit")
        bind(item["nativeReceipt"]["path"], item["nativeReceipt"]["sha256"],
             "original native finalize receipt")

    rules = [
        REPO / ".intentfold/readme.md",
        REPO / ".intentfold/project.json",
        REPO / ".intentfold/charter/product.md",
        REPO / ".intentfold/charter/engineering.md",
        REPO / ".intentfold/charter/operations.md",
        REPO / ".claude/skills/ld-s10y-lesson/SKILL.md",
        REPO / ".claude/skills/ld-s10y-lesson/references/production-resume.md",
        REPO / ".agents/skills/ld-s10y-image/SKILL.md",
        Path("/Users/yong/.agents/skills/intentfold/SKILL.md"),
    ]
    for path in rules:
        bind(path, purpose="routed instructions read")
    for name in ("image-request-failure.json", "manifest-query-failure.json"):
        path = AUTHOR / "evidence" / name
        expected = next(
            item["sha256"]
            for item in author_manifest["all_owned_files_except_manifest_itself"]
            if item["path"] == str(path)
        )
        load(path, expected, "original author failure preserved")

    executions = []
    for command in ("prepare", "finalize"):
        for page in (161, 162):
            path = AUTHOR / f"evidence/commands/{command}-{page:04d}.json"
            expected = next(
                item["sha256"]
                for item in author_manifest["all_owned_files_except_manifest_itself"]
                if item["path"] == str(path)
            )
            receipt = load(path, expected, "original execution receipt, never replayed")
            wanted_argv = [
                ".claude/skills/ld-s10y-lesson/.venv/bin/python",
                "-B", ".claude/skills/ld-s10y-lesson/tools/p2c.py",
                command, "--book", "6-8g", "--page", str(page),
                "--root", str(AUTHOR.relative_to(REPO) / "artifacts"),
                "--work", str(AUTHOR.relative_to(REPO) / "work"),
                "--books", "ssot-resources/soviet10year-textbooks/sources",
            ]
            wanted_exit = 1 if command == "finalize" and page == 161 else 0
            streams = {}
            for stream_name in ("stdout", "stderr"):
                stream = receipt["streams"][stream_name]
                checked = bind(stream["path"], stream["sha256"], "original execution stream")
                checked["bytes_match"] = checked["bytes"] == stream["bytes"]
                checked["mode_matches"] = checked["mode"] == stream["mode"]
                streams[stream_name] = checked
                if not checked["bytes_match"] or not checked["mode_matches"]:
                    failures.append(f"Stream metadata mismatch: {stream['path']}")
            matched = (
                receipt["cwd"] == str(REPO)
                and receipt["argv"] == wanted_argv
                and receipt["exit_status"] == wanted_exit
                and receipt["started_at"] < receipt["ended_at"]
            )
            if not matched:
                failures.append(f"Execution fact mismatch: {path}")
            executions.append({
                "receipt": str(path), "cwd": receipt["cwd"], "argv": receipt["argv"],
                "exit_status": receipt["exit_status"], "binding_matches": matched,
                "started_at": receipt["started_at"], "ended_at": receipt["ended_at"],
                "streams": streams, "replayed": False, "semantic_approval": False,
            })

    page162 = AUTHOR / "work/6-8g/pages/0162/page.png"
    with Image.open(page162) as image:
        original162 = image.convert("RGB")
    audit162 = load(AUTHOR / "artifacts/6-8g/pages/0162/audit.json")
    structured162 = load(AUTHOR / "artifacts/6-8g/pages/0162/page.json")
    crops = []
    for figure in audit162["figures"]:
        name = figure["id"]
        box = figure["box"]
        entry = next(item for item in structured162["meta"]["figures"] if item["id"] == name)
        block = next(item for item in structured162["blocks"] if item.get("id") == name)
        x, y, width, height = box
        rectangle = (x - 12, y - 12, x + width + 12, y + height + 12)
        crop_path = AUTHOR / f"work/6-8g/pages/0162/figures/{name}.png"
        with Image.open(crop_path) as image:
            crop = image.convert("RGB")
        original_slice = original162.crop(rectangle)
        size_matches = crop.size == original_slice.size
        difference = ImageChops.difference(crop, original_slice) if size_matches else None
        different_pixels = (
            sum(pixel != (0, 0, 0) for pixel in difference.getdata())
            if difference is not None else None
        )
        ink = crop.convert("L").point(lambda pixel: 255 if pixel < 160 else 0)
        ink_bounds = ink.getbbox()
        min_ink_margin = min(
            ink_bounds[0], ink_bounds[1],
            crop.width - ink_bounds[2], crop.height - ink_bounds[3],
        )
        passed = (
            box == entry["box"] == block["box"]
            and size_matches and different_pixels == 0 and min_ink_margin > 0
        )
        if not passed:
            failures.append(f"Exact crop binding mismatch: {name}")
        crops.append({
            "id": name, "audit_page_json_block_boxes_identical": box == entry["box"] == block["box"],
            "exact_native_box_xywh": box,
            "native_padding_px": 12,
            "source_rectangle_ltrb": list(rectangle),
            "decoded_crop_size": list(crop.size),
            "decoded_pixel_differences_from_original_rectangle": different_pixels,
            "ink_bounds_ltrb_at_threshold160": list(ink_bounds),
            "minimum_ink_margin_px": min_ink_margin,
            "exact_pixel_binding_pass": passed,
        })

    page161 = AUTHOR / "work/6-8g/pages/0161/page.png"
    layout = load(AUTHOR / "work/6-8g/pages/0161/layout.json",
                  purpose="original native row bands, not a recomputed counter")
    audit161 = load(AUTHOR / "artifacts/6-8g/pages/0161/audit.json")
    with Image.open(page161) as image:
        original161 = image.convert("RGB")
    strip_rect = (100, 1788, 1340, 1794)
    strip = original161.crop(strip_rect).convert("L")
    ink = strip.point(lambda pixel: 255 if pixel < 160 else 0)
    bounds = ink.getbbox()
    region = [
        strip_rect[0] + bounds[0], strip_rect[1] + bounds[1],
        bounds[2] - bounds[0], bounds[3] - bounds[1],
    ]
    punctuation_path = OWN / "p161-row14-punctuation.png"
    bind(punctuation_path, purpose="one post-FIRST affected source punctuation crop")
    with Image.open(punctuation_path) as image:
        punctuation = image.convert("RGB")
    expected_punctuation = original161.crop((180, 1205, 1290, 1270))
    punctuation_exact = (
        punctuation.size == expected_punctuation.size
        and ImageChops.difference(punctuation, expected_punctuation).getbbox() is None
    )
    if not punctuation_exact:
        failures.append("Punctuation crop does not match declared original rectangle")

    result = {
        "schema": "source-independent/read-only-verification@1",
        "cwd": str(REPO),
        "frozen_FIRST": frozen,
        "original_executions": executions,
        "source_crop_pixel_bindings": crops,
        "p161_row_diagnosis": {
            "original_layout_band_count": len(layout["line_bands"]),
            "original_audit": {
                "lines_printed": audit161["lines_printed"],
                "lines_md": audit161["lines_md"], "errors": audit161["errors"],
            },
            "independent_FIRST_text_rows": 24,
            "extra_native_band_1based_index": 22,
            "extra_native_band": layout["line_bands"][21],
            "source_ink_region_xywh_threshold160": region,
            "source_pixel_object": "short teaching-footnote separator rule, not missing text",
            "mapping": "native1..21=FIRST1..21; native22=rule; native23..25=FIRST22..24",
            "counter_recomputed_or_changed": False,
            "exclusions_changed": False,
        },
        "punctuation_crop": {
            "path": str(punctuation_path),
            "source_rectangle_xywh": [180, 1205, 1110, 65],
            "sips_crop_exit_code_observed": 0,
            "decoded_pixels_match_original": punctuation_exact,
            "image_views": 1,
            "source_observation": "concept noun followed by a full stop, then 但是",
            "candidate_defect": "p0161#8 row1 uses a comma instead of the source full stop",
        },
        "preserved_author_counters_not_independent_evidence": author_report["counters"],
        "referenced_files": list(references.values()),
        "check_failures": failures,
        "producer_invocations": 0,
        "model_image_payloads_emitted_by_this_script": 0,
        "source_writes": 0,
        "exec_sessions_created_or_left_running": 0,
    }
    write_new("verification.json", result)
    print(json.dumps({
        "check_failures": failures,
        "original_execution_receipts_bound": len(executions),
        "crop_pixel_bindings": crops,
        "p161_row_diagnosis": result["p161_row_diagnosis"],
        "punctuation_crop_exact": punctuation_exact,
        "referenced_files": len(references),
    }, ensure_ascii=False, indent=2))
    return bool(failures)


if __name__ == "__main__":
    sys.exit(manifest() if sys.argv[1:] == ["--manifest"] else audit())
