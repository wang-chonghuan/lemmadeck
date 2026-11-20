"""Verify this bounded author's evidence, then freeze current file hashes."""

import argparse
import hashlib
import json
import math
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageChops


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
AUTHOR = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d212-source63-bar-diagnosis-author"
CROPS = ROOT / ".tmp/STEMROBIN-181/d1816-d212"
SOURCE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0063/page.json"
REVIEW = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d202-n23-text-review/report.json"
RECONSTRUCTION = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d212-source63-missing-original-render-reconstruction/receipt.json"
PDF = ROOT / "ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf"
EXPECTED = {
    AUTHOR / "input-freeze.json": "1db8f33029189b60b3727305827c3252d7591be06438fbfac1c01ad9c00f2ba9",
    CROPS / "page.png": "454569355a876cee9fd0eed41efb485598bef95294b561b51f173bde59d1d8f6",
    SOURCE: "c10c5d2b9951b4989f5b9e961fc2bbd2308f3748753275a3dc50f85756655cae",
    REVIEW: "8c50da6a6aef468899487455e996d1532377b233c9efcf677c92f67831b81725",
    RECONSTRUCTION: "1ead2a50d3ea113e1176a6ad1e76f122b60a4e488d1c887f0b32b1391a9d402f",
    PDF: "7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40",
    AUTHOR / "original-first-open-observation.json": "4cc8dfdb80e44743d79cecfa16db0cd8f4c51d60f2a9b2636280b748b182eb3a",
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def save_new(path, value):
    with path.open("x", encoding="utf-8") as handle:
        json.dump(value, handle, ensure_ascii=True, indent=2)
        handle.write("\n")


def file_record(path):
    return {"path": str(path), "bytes": path.stat().st_size, "sha256": digest(path)}


def assert_input_hashes():
    for path, expected in EXPECTED.items():
        assert digest(path) == expected, f"Changed input: {path}"


def find_id(value, target):
    if isinstance(value, dict):
        if value.get("id") == target:
            yield value
        for child in value.values():
            yield from find_id(child, target)
    elif isinstance(value, list):
        for child in value:
            yield from find_id(child, target)


def verify():
    outputs = [
        AUTHOR / "scoped-transcription-snapshot.json",
        AUTHOR / "affected-finding-snapshot.json",
        AUTHOR / "verification.json",
    ]
    assert all(not path.exists() for path in outputs), "Never overwrite saved evidence."
    assert_input_hashes()
    source = load(SOURCE)
    proposal = load(AUTHOR / "errata-proposal.json")
    baseline = load(AUTHOR / "original-pixel-baseline.json")
    crops = load(AUTHOR / "pixel-crops.json")
    assert source["meta"]["errata"] == []
    assert len(proposal["proposed_records"]) == 3
    assert [record["block"] for record in proposal["proposed_records"]] == [
        "p0063#4", "p0063#6", "p0063#8"
    ]
    exact_matches = []
    for record in proposal["proposed_records"]:
        index = int(record["block"].split("#")[1]) - 1
        lines = source["blocks"][index]["lines"]
        assert lines == [record["exact_original_block_line"]]
        assert lines[0].count(record["original"]) == 1
        assert record["source_page_sha256"] == digest(SOURCE)
        assert record["source_image_sha256"] == digest(CROPS / "page.png")
        assert record["corrected"] == record["original"].replace(
            "\\overline{i}^2", "\\overline{i^2}"
        )
        exact_matches.append({"block": record["block"], "exact_original_match": True})
    assert source["blocks"][10]["lines"] == [
        proposal["voltage_contrast_diagnosis_only"]["exact_current_transcription"]
    ]
    pixels = []
    with Image.open(CROPS / "page.png") as original:
        for crop in crops["crops"]:
            path = Path(crop["path"])
            assert digest(path) == crop["sha256"]
            with Image.open(path) as image:
                expected_crop = original.crop(crop["coordinates_xyxy_half_open"])
                assert ImageChops.difference(image, expected_crop).getbbox() is None
                assert hashlib.sha256(image.tobytes()).hexdigest() == crop["decoded_rgb_sha256"]
            pixels.append({"equation": crop["equation"], "native_pixel_equality": True})
        for observation in baseline["observations"]:
            for field in (
                "bar_ink_scanline", "superscript_ink_scanline", "radical_roof_ink_scanline"
            ):
                scanline = observation.get(field)
                if scanline:
                    y = scanline["y"]
                    runs = scanline.get("ink_runs", [scanline["x_inclusive"]])
                    for left, right in runs:
                        assert all(
                            max(original.getpixel((x, y))) < 128
                            for x in range(left, right + 1)
                        )
            assert observation["bar_ink_scanline"]["x_inclusive"][1] < (
                observation["superscript_ink_scanline"]["x_inclusive"][0]
            )
    assert baseline["opens"]["actual"] == 5 <= 6
    assert baseline["opens"]["context_total"] == 5 <= 24
    assert baseline["opens"]["parent"] == 0
    for key in ("source_approval", "course_approval", "scientific_approval"):
        assert baseline[key] == 0
    numeric_cases = []
    for amplitude, omega, phase, t0, cycles, resistance in (
        (2.0, 1.0, 0.0, 0.0, 1, 3.0),
        (2.5, 1.3, 0.7, 0.35, 3, 4.2),
    ):
        length = cycles * 2 * math.pi / omega
        samples = 4096 * cycles
        values = [
            amplitude * math.cos(omega * (t0 + length * k / samples) + phase)
            for k in range(samples)
        ]
        mean = math.fsum(values) / samples
        mean_square = math.fsum(value * value for value in values) / samples
        assert abs(mean) < 1e-12
        assert math.isclose(mean_square, amplitude**2 / 2, abs_tol=1e-12)
        literal_middle = [mean**2 * resistance, mean**2, abs(mean)]
        corrected_middle = [
            mean_square * resistance, mean_square, math.sqrt(mean_square)
        ]
        rhs = [
            amplitude**2 * resistance / 2,
            amplitude**2 / 2,
            amplitude / math.sqrt(2),
        ]
        assert all(
            not math.isclose(left, right, abs_tol=1e-10)
            for left, right in zip(literal_middle, rhs)
        )
        assert all(
            math.isclose(left, right, abs_tol=1e-12)
            for left, right in zip(corrected_middle, rhs)
        )
        numeric_cases.append({
            "A": amplitude, "omega": omega, "phi": phase, "t0": t0,
            "complete_cycles": cycles, "R": resistance, "samples": samples,
            "mean_i": mean, "mean_square_i": mean_square,
            "literal_current_middle_terms": literal_middle,
            "proposed_current_middle_terms": corrected_middle,
            "unchanged_right_sides": rhs,
            "literal_relations_fail": True,
            "proposed_relations_agree": True,
        })
    findings = list(find_id(load(REVIEW), "D202-SCI-01"))
    assert len(findings) == 1
    snapshot = {
        "schema": "d212.scoped-transcription-snapshot.v1",
        "source_file": file_record(SOURCE),
        "book": "10p", "physical_page": 63, "printed_page": 53,
        "source_pdf_sha256": source["meta"]["source"]["pdf_sha256"],
        "original_render_sha256": source["meta"]["render"]["sha256"],
        "existing_registered_errata": source["meta"]["errata"],
        "blocks": [
            {"source_pointer": f"p0063#{index + 1}", "lines": source["blocks"][index]["lines"]}
            for index in range(2, 11)
        ],
        "scope": "Four formulas and immediate prose only; no figure or other-page snapshot.",
    }
    save_new(outputs[0], snapshot)
    save_new(outputs[1], {
        "schema": "d212.affected-finding-snapshot.v1",
        "source_file": file_record(REVIEW),
        "read_after_original_first_open_observation_saved": True,
        "finding": findings[0],
        "authority": "Context only; no review replay, replacement verdict, or approval.",
    })
    assert_input_hashes()
    receipt = {
        "schema": "d212.verification.v1",
        "status": "PASS_FOR_EVIDENCE_INTEGRITY_ONLY",
        "verified_at": datetime.now(timezone.utc).isoformat(),
        "cwd": str(ROOT),
        "scope": "Only this author's current inputs, four crops, three proposed replacements and independent cosine calculation.",
        "input_hashes": [file_record(path) for path in EXPECTED],
        "exact_original_formula_matches": exact_matches,
        "pixel_checks": pixels,
        "bar_endpoint_and_roof_scanline_checks": True,
        "numeric_sanity_checks": numeric_cases,
        "analytic_proof": "Exact complete-cycle integration is in errata-proposal.json; numeric samples are corroboration only.",
        "output_snapshots": [file_record(path) for path in outputs[:2]],
        "actual_image_opens": 5,
        "parent_image_opens": 0,
        "source_approval": 0,
        "scientific_approval": 0,
        "course_approval": 0,
        "content_or_review_replay": False,
        "original_reconstructions_this_author": 0,
    }
    save_new(outputs[2], receipt)
    print(json.dumps(file_record(outputs[2]), indent=2))


def freeze():
    target = AUTHOR / "author-freeze.json"
    assert not target.exists(), "Never overwrite an author freeze."
    assert_input_hashes()
    report = load(AUTHOR / "report.json")
    receipt = load(AUTHOR / "verification.json")
    assert report["status"] == "AUTHOR_DIAGNOSIS_COMPLETE_PROPOSAL_ONLY"
    assert report["downstream_disposition"] == "HOLD_UNCHANGED_PENDING_AUTHORIZED_OWNER"
    assert receipt["status"] == "PASS_FOR_EVIDENCE_INTEGRITY_ONLY"
    for record in report["hash_bound_evidence"]:
        assert digest(Path(record["path"])) == record["sha256"]
    owned = sorted(path for path in AUTHOR.iterdir() if path.is_file() and path != target)
    crop_paths = [Path(crop["path"]) for crop in load(AUTHOR / "pixel-crops.json")["crops"]]
    external_paths = [
        SOURCE, REVIEW, RECONSTRUCTION, PDF,
        ROOT / "AGENTS.md",
        ROOT / ".agents/skills/ld-s10y-image/SKILL.md",
        ROOT / ".claude/skills/ld-s10y-lesson/references/production-resume.md",
        ROOT / ".claude/skills/ld-s10y-lesson/references/edition-text-contract.md",
    ]
    freeze_value = {
        "schema": "d212.author-freeze.v1",
        "frozen_at": datetime.now(timezone.utc).isoformat(),
        "cwd": str(ROOT),
        "role": "AUTHOR_ONLY_NOT_INDEPENDENT_REVIEWER",
        "status": report["status"],
        "downstream_disposition": report["downstream_disposition"],
        "author_directory_current_files": [file_record(path) for path in owned],
        "saved_native_pixel_crops": [file_record(path) for path in crop_paths],
        "existing_original_page_unchanged": file_record(CROPS / "page.png"),
        "external_inputs_current_at_freeze": [file_record(path) for path in external_paths],
        "hash_semantics": "Every listed digest was recomputed from that exact current path during this freeze. External paths are not asserted immutable. Future use must rehash them; the saved scoped snapshots and native crops preserve this observation.",
        "self_hash": "Not embedded, to avoid a self-reference; compute SHA256 of this completed file externally.",
        "ownership": "Only new files in the authorized author directory and four new crops; existing input-freeze, dispatch and page.png untouched.",
        "counters": report["counters"],
    }
    assert_input_hashes()
    save_new(target, freeze_value)
    for section in (
        "author_directory_current_files", "saved_native_pixel_crops",
        "external_inputs_current_at_freeze"
    ):
        for record in freeze_value[section]:
            assert digest(Path(record["path"])) == record["sha256"]
    assert digest(CROPS / "page.png") == freeze_value["existing_original_page_unchanged"]["sha256"]
    print(json.dumps(file_record(target), indent=2))


assert Path.cwd() == ROOT, "Every command must use the authorized cwd."
parser = argparse.ArgumentParser()
parser.add_argument("mode", choices=("verify", "freeze"))
args = parser.parse_args()
verify() if args.mode == "verify" else freeze()
