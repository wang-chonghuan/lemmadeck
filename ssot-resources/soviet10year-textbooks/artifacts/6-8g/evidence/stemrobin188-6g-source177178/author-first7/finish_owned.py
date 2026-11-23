from pathlib import Path
import hashlib
import json
import stat
from PIL import Image

CWD = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
ROOT = CWD / ".intentfold/tickets/STEMROBIN-188/tmp/source6g177178-author7"
assert Path.cwd() == CWD
manifest_path = ROOT / "author-manifest.json"
assert not manifest_path.exists(), "Refusing to replace completed manifest"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def reference(path):
    return {"path": str(path), "sha256": digest(path)}


def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8")


first = read_json(ROOT / "FIRST.json")
assert digest(ROOT / "FIRST.md") == first["FIRST_md"]["sha256"]
for path in (ROOT / "FIRST.md", ROOT / "FIRST.json"):
    assert stat.S_IMODE(path.stat().st_mode) == 0o444
for original in first["originals"]:
    for item in original["files"].values():
        assert digest(Path(item["path"])) == item["sha256"]

observations = read_json(ROOT / "source-observations.json")
crop_observations = read_json(ROOT / "native-crop-observations.json")
pages = []
receipts = []
bound_hashes = []
for observed in observations["pages"]:
    page = observed["physical"]
    pdir = ROOT / f"artifacts/6-8g/pages/{page:04d}"
    native_dir = ROOT / f"native/p{page:04d}-attempt1"
    receipt = read_json(native_dir / "receipt.json")
    audit = read_json(pdir / "audit.json")
    candidate = read_json(pdir / "page.json")
    assert receipt["exit_code"] == 0
    assert receipt["cwd"] == str(CWD)
    assert receipt["FIRST"]["json_sha256"] == digest(ROOT / "FIRST.json")
    assert receipt["FIRST"]["md_sha256"] == digest(ROOT / "FIRST.md")
    assert not audit["errors"]
    assert audit["lines_printed"] == audit["lines_md"] == observed["visual_printed_text_lines"]
    for stream in receipt["streams"].values():
        assert digest(Path(stream["path"])) == stream["sha256"]
    original_md = ROOT / f"original/6-8g/pages/{page:04d}/page.md"
    assert digest(native_dir / "firstcandidate.page.md") == digest(original_md)
    for item in receipt["outputs"]:
        assert digest(Path(item["path"])) == digest(Path(item["snapshot"])) == item["sha256"]
    copied_images = {}
    for name in ("page.png", "page.grid.png"):
        image = ROOT / f"work/6-8g/pages/{page:04d}/{name}"
        sha = digest(image)
        assert sha == first["original_image_hashes_checked_once"][f"{page:04d}/{name}"]
        copied_images[name] = {"path": str(image), "sha256": sha}
    assert candidate["meta"]["render"]["sha256"] == copied_images["page.png"]["sha256"]
    assert candidate["meta"]["source"]["pdf_sha256"] == (
        "d06ea093886065380febda597331bb5d48c81303d955161f2f84a7f11c116e5c")
    bound_hashes.append({
        "physical": page, "copied_inputs": copied_images,
        "native_render": candidate["meta"]["render"],
        "native_pdf": candidate["meta"]["source"],
        "native_profile": candidate["meta"]["profile"],
        "all_copied_source_hashes_match_once_verified_originals": True,
        "native_render_matches_copied_source": True,
        "original_candidate_matches_first_native_input": True
    })
    pages.append({
        "physical": page, "printed": observed["printed"],
        "visual_printed_text_lines": observed["visual_printed_text_lines"],
        "native_printed_lines": audit["lines_printed"],
        "native_body_lines": audit["lines_md"],
        "native_exit": receipt["exit_code"],
        "native_block_count": len(candidate["blocks"]),
        "native_figures": audit["figures"],
        "original": first["originals"][len(pages)]["files"],
        "native_candidate": {name: reference(pdir / name)
                             for name in ("page.md", "page.json", "audit.json")},
        "source_inventory": observed
    })
    receipts.append(reference(native_dir / "receipt.json"))

figure_path = ROOT / crop_observations["observations"][0]["path"]
assert digest(figure_path) == crop_observations["observations"][0]["sha256"]
with Image.open(figure_path) as image:
    crop_dimensions = list(image.size)
assert crop_dimensions == [378, 241]
crop_observations["observations"][0]["native_png_dimensions"] = crop_dimensions
crop_observations["observations"][0]["native_padding_px"] = 12
crop_observations["observations"][0]["dimension_check_basis"] = (
    "PNG header dimensions; no image payload reopen")
write_json(ROOT / "native-crop-observations.json", crop_observations)
write_json(ROOT / "input-native-bound-hashes.json", {
    "schema": "ld-s10y-input-native-bindings@1", "cwd": str(CWD),
    "original_inputs_rehashed": False, "pages": bound_hashes,
    "native_crop": reference(figure_path),
    "native_crop_box_xywh": [521, 275, 354, 217],
    "native_crop_png_dimensions": crop_dimensions,
    "native_crop_observations": reference(ROOT / "native-crop-observations.json"),
    "original_input_hash_execution": reference(ROOT / "input-hash-verification.json")
})

for path in ROOT.rglob("*"):
    assert not path.is_symlink(), f"Unexpected link in owned root: {path}"
    if path.is_file():
        path.chmod(0o444)

inventory = []
for path in sorted(ROOT.rglob("*")):
    if path.is_file():
        assert stat.S_IMODE(path.stat().st_mode) == 0o444
        inventory.append({**reference(path), "relative_path": str(path.relative_to(ROOT)),
                          "bytes": path.stat().st_size, "mode": "0444"})

manifest = {
    "schema": "ld-s10y-source-author-manifest@1",
    "ticket": "STEMROBIN-188", "book": "6-8g",
    "status": "AUTHOR_ONLY", "finish": "review/offline",
    "independent_approval": False, "publication_authorized": False,
    "cwd": str(CWD), "owned_root": str(ROOT),
    "scope": {"physical": [177, 178], "printed": [167, 168]},
    "FIRST": {
        "md": reference(ROOT / "FIRST.md"), "json": reference(ROOT / "FIRST.json"),
        "modes": "0444", "sealed_before_native_outputs_or_repair": True,
        "unchanged_after_native": True
    },
    "pages": pages, "native_execution_receipts": receipts,
    "first_native_failures": [],
    "input_native_bindings": reference(ROOT / "input-native-bound-hashes.json"),
    "native_crop_observations": reference(ROOT / "native-crop-observations.json"),
    "native_crops": [reference(figure_path)],
    "counts": {
        "visual_printed_text_lines_total": 46,
        "native_printed_lines_total": 46, "native_body_lines_total": 46,
        "complete_exercise_text": 20, "open_exercise_text": 1,
        "native_figures": 1, "native_crops_inspected_once_each": 1,
        "native_finalize_invocations": 2, "prepare_reruns": 0,
        "content_revisions": 0, "technical_recoveries": 0,
        "source_grid_loads": 2, "source_detail_crop_loads": 2,
        "actual_native_crop_loads": 1, "total_image_loads": 5,
        "batch_image_limit": 8, "context_image_limit": 24,
        "reopens": 0, "paid_calls": 0
    },
    "image_ledger": observations["image_loads_before_FIRST_seal"] + [{
        "sequence": 5, "physical": 178, "kind": "actual-native-crop",
        "path": str(figure_path), "sha256": digest(figure_path), "loaded_once": True
    }],
    "heading_boundary": {
        "actual_text": "第三章补充习题", "physical": 178, "printed": 168,
        "after_exercise": 505, "before_exercise": 506,
        "basis": "current source pixels, not TOC prediction",
        "new_supplement_right_boundary": "UNKNOWN"
    },
    "observed_exercise_range": [489, 509],
    "observed_figure_range": [238, 238],
    "unobserved_figure_references": [239, 240],
    "open_objects": [{
        "exercise": 509, "physical": 178, "printed_lines": 1,
        "ends_with": "平行线", "native_open_flag": True,
        "next_content": "UNKNOWN; no physical179+ observation"
    }],
    "left_continuation": {
        "physical177": "No continuing text from exercise488; starts complete489.",
        "physical178": "Figure238/caption belonging to complete text499 on177; no continuing exercise wording.",
        "ex_cont_blocks": 0
    },
    "source_uncertainties": [page["unknown"] for page in observations["pages"]],
    "specific_HOLD": [
        crop_observations["observations"][0]["specific_HOLD"],
        {"id": "source-glyph-identities", "reason": "Exact letter-marker script493 and round center subscript506 are UNKNOWN; retain explicit placeholders and visual inventory."},
        {"id": "unobserved-right-boundary", "reason": "Exercise509 and supplement extend beyond authorized observed pixels; no complete exercise509 or complete supplement is claimed."}
    ],
    "native_checks": {
        "both_exit_zero": True, "count_charset_katex_pass": True,
        "normalizations": 0, "count_exclusions": [], "row_overrides": [],
        "author_supplied_masks": [], "receiver_figures": [],
        "native_count_pass_is_content_or_independent_approval": False
    },
    "constraints": {
        "other_worker_roots_read": False, "older_page_pixels_or_authors_read": False,
        "page179_plus_read": False, "git_commands": 0, "DB_operations": 0,
        "env_reads_or_writes": 0, "dependency_changes": 0, "model_service_calls": 0,
        "modern_edition_changes": 0, "answer_or_choice_work": 0,
        "publication_calls": 0, "shared_implementation_changes": 0,
        "messages_to_others": 0, "timers": 0, "vectorization": 0,
        "assembly": 0, "source_OCR": 0, "source_math_solving": 0,
        "writes_outside_owned_root": 0
    },
    "all_outputs_mode": "0444",
    "file_inventory_excludes_manifest_self_hash": True,
    "file_inventory": inventory
}
write_json(manifest_path, manifest)
manifest_path.chmod(0o444)
for path in ROOT.rglob("*"):
    if path.is_file():
        assert stat.S_IMODE(path.stat().st_mode) == 0o444
print(json.dumps({
    "status": "AUTHOR_ONLY", "native_exits": [0, 0],
    "image_loads": 5, "content_revisions": 0, "technical_recoveries": 0,
    "all_files_sealed_0444": True, "file_count": len(inventory) + 1,
    "manifest": reference(manifest_path),
    "FIRST_md": reference(ROOT / "FIRST.md"),
    "FIRST_json": reference(ROOT / "FIRST.json")
}))
