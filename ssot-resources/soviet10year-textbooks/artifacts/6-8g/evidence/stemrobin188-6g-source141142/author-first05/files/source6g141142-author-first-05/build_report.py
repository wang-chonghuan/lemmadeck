import json
import os
import sys

from PIL import Image
from receipt import OWN, REPO, facts, now


TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks as B
from production import read_receipt


def load(relative):
    return json.loads((OWN / relative).read_text(encoding="utf-8"))


def save(relative, value):
    path = OWN / relative
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    return path


started = now()
ledger = load("image-ledger.json")
assert ledger["charged_requests"] == len(ledger["requests"]) == 6
assert ledger["charged_requests"] <= 8
for event in ledger["requests"]:
    event["binding"] = facts(OWN / event["path"])

prepare = load("receipts/prepare141142.stdout")
assert prepare["ok"] and prepare["book"] == "6-8g"
assert [entry["page"] for entry in prepare["pages"]] == [141, 142]
assert all(entry["status"] == "prepared" and entry["returncode"] == 0
           for entry in prepare["pages"])
for entry in prepare["pages"]:
    entry["stream_bindings"] = {
        name: facts(entry[name]) for name in ("stdout", "stderr")
    }

execution = {}
for name in ("prepare141142", "finalize141", "finalize142",
             "p141-detail-repair-execution", "p142-detail-execution"):
    path = OWN / "receipts" / (name + ".json")
    normalized = read_receipt(path)
    assert normalized["execution"]["cwd"] == str(REPO)
    execution[name] = {"receipt": facts(path), "actual": load("receipts/" + name + ".json")}

pages = []
output_seals = []
for page, expected in ((141, 25), (142, 24)):
    key = f"{page:04d}"
    first = OWN / "FIRST" / (key + ".md")
    seal = load(f"receipts/p{page}-FIRST-seal.json")
    assert facts(first) == seal["after"]
    assert seal["after"]["mode"] == "0o444"
    snapshot = OWN / "candidate-before-finalize" / key / "page.md"
    snapshot_receipt = load(f"receipts/p{page}-candidate-snapshot.json")
    assert facts(snapshot) == snapshot_receipt["snapshot"]
    assert facts(snapshot)["mode"] == "0o444"
    assert seal["after"]["ctime_ns"] < snapshot_receipt["source"]["mtime_ns"]
    final_receipt = execution[f"finalize{page}"]["actual"]
    assert snapshot_receipt["finished_at"] < final_receipt["started_at"]
    directory = OWN / "artifacts/6-8g/pages" / key
    audit = load(f"artifacts/6-8g/pages/{key}/audit.json")
    meta, final_blocks = B.parse((directory / "page.md").read_text(encoding="utf-8"))
    _, candidate_blocks = B.parse(snapshot.read_text(encoding="utf-8"))
    assert audit["errors"] == []
    assert audit["lines_printed"] == audit["lines_md"] == expected
    assert B.printed_lines(final_blocks) == expected
    assert len(final_blocks) == len(candidate_blocks)
    assert [block["lines"] for block in final_blocks] == [
        block["lines"] for block in candidate_blocks
    ]
    for name in ("page.md", "page.json", "audit.json"):
        path = directory / name
        before = facts(path)
        os.chmod(path, 0o444)
        after = facts(path)
        assert before["sha256"] == after["sha256"]
        output_seals.append({"before": before, "after": after, "observed_at": now()})
    pages.append({
        "physical_page": page,
        "printed_page": meta["printed_page"],
        "status": "AUTHOR_ONLY",
        "FIRST": facts(first),
        "FIRST_seal_receipt": facts(OWN / "receipts" / f"p{page}-FIRST-seal.json"),
        "candidate_before_finalize": facts(snapshot),
        "candidate_snapshot_receipt": facts(OWN / "receipts" / f"p{page}-candidate-snapshot.json"),
        "finalized": {name: facts(directory / name) for name in ("page.md", "page.json", "audit.json")},
        "source": meta["source"],
        "render": {
            **meta["render"],
            "native": facts(OWN / f"work/6-8g/pages/{key}/page.png"),
            "grid": facts(OWN / f"work/6-8g/pages/{key}/page.grid.png"),
        },
        "line_reconciliation": {"author_observed": expected, "native_printed": expected,
                                "candidate_and_finalized": expected, "status": "PASS"},
        "block_count": len(final_blocks),
        "figures": audit["figures"],
        "normalizations": len(audit["normalizations"]),
        "unknown_charset_characters": audit["unknown_chars"],
        "katex_warnings": audit["katex_warnings"],
        "count_exclusions": audit["count_exclusions"],
        "errata": audit["errata"],
    })

pdf_name = pages[0]["source"]["pdf"]
pdfs = list((REPO / "ssot-resources/soviet10year-textbooks/sources").rglob(pdf_name))
assert len(pdfs) == 1
pdf = facts(pdfs[0])
assert all(item["source"]["pdf_sha256"] == pdf["sha256"] for item in pages)
native = OWN / "work/6-8g/pages/0142/figures/fig-194.png"
retained = OWN / "artifacts/6-8g/figures/fig-194.png"
assert facts(native)["sha256"] == facts(retained)["sha256"]
with Image.open(native) as image:
    dimensions = list(image.size)
figure = {
    "id": "fig-194",
    "printed_id": "图194",
    "owner": "exercise381",
    "coarse_box_xywh": [800, 1270, 385, 235],
    "exact_box_xywh": pages[1]["figures"][0]["box"],
    "native_finalize_crop": facts(native),
    "retained_native_crop": facts(retained),
    "native_crop_size_including_tool_padding": dimensions,
    "native_copy_receipt": facts(OWN / "receipts/native-fig194-retain.json"),
    "caption_literal_lines": 1,
    "caption_additional_distinct_rows": 0,
    "author_visual_observation": ledger["requests"][-1]["observation"],
    "independent_review": "NOT_PERFORMED_BY_THIS_AUTHOR",
}
assert figure["exact_box_xywh"] == [809, 1278, 362, 220]

save("finalized-output-seals.json", {
    "started_at": started, "finished_at": now(), "seals": output_seals
})
receipt_files = sorted((OWN / "receipts").glob("*.json"))
receipt_bindings = [facts(path) for path in receipt_files]
report = {
    "schema": "s10y-source-author-report@1",
    "status": "AUTHOR_ONLY",
    "ticket": "STEMROBIN-188",
    "authorization": "SAME188-6 OFFLINE source production only",
    "repo": str(REPO),
    "owned_root": str(OWN),
    "book": "6-8g",
    "physical_pages": [141, 142],
    "installed_skill_authority": "User supplied db613601 / corresponding093a4baa; no setup, freshness or Grill",
    "contracts": [facts(REPO / path) for path in (
        ".claude/skills/ld-s10y-lesson/SKILL.md",
        ".claude/skills/ld-s10y-lesson/references/production-resume.md",
        ".agents/skills/ld-s10y-image/SKILL.md",
        ".claude/skills/ld-s10y-lesson/tools/production.py",
        ".claude/skills/ld-s10y-lesson/tools/p2c.py",
    )],
    "source_pdf": pdf,
    "scope": facts(OWN / "scope.json"),
    "incoming_boundary": load("scope.json")["incoming_text_only"],
    "pages": pages,
    "figure": figure,
    "prepare_range_actual": prepare,
    "execution": execution,
    "receipt_bindings": receipt_bindings,
    "image_ledger": {"file": facts(OWN / "image-ledger.json"), "bound_events": ledger},
    "counters": {
        "prepare_range_calls": 1,
        "pages_newly_prepared": 2,
        "finalize_calls": {"141": 1, "142": 1},
        "finalize_passes": 2,
        "finalize_failures": 0,
        "charged_image_requests_batch_and_context": 6,
        "loaded_image_payloads": 5,
        "failed_image_related_requests": 1,
        "technical_crop_repairs": 1,
        "source_content_revisions": 0,
        "paid_generation_calls": 0,
        "modern_outputs": 0,
        "FIRST_seals": 2,
        "immutable_candidate_snapshots": 2,
        "figures": 1,
        "captions": 1,
        "unique_exercises_observed": 11,
        "complete_exercises_observed": 10,
        "open_exercises": 1,
        "distinct_printed_text_lines": 49,
        "independent_review_calls": 0,
        "parent_image_payloads_sent": 0,
    },
    "failures": [facts(OWN / "crop-first-failure.json")],
    "chronology": {
        "source_image_order": [event["index"] for event in ledger["requests"]],
        "timed_execution_events": [
            load(f"receipts/{name}.json") for name in (
                "prepare141142", "p141-detail-repair-execution", "p141-FIRST-seal",
                "p141-candidate-snapshot", "finalize141", "p142-detail-execution",
                "p142-FIRST-seal", "p142-candidate-snapshot", "finalize142",
                "native-fig194-retain",
            )
        ],
        "FIRST_seals_precede_candidate_creation": True,
        "candidate_snapshots_precede_finalize": True,
        "finalized_output_seals": facts(OWN / "finalized-output-seals.json"),
        "image_view_timestamps": "Unavailable; actual invocation order retained without backdating",
    },
    "boundaries": {
        "141_start": "New closed paragraph: 3) |OA|>r(图193, а).",
        "141_end": "Exercise374 closed at 为底, h为一腰上的高.",
        "142_collection_boundary": "After closed exercise380, actual printed 第二章补充习题",
        "142_exercise381": "Six-line open part + transparent fig194/cap samerow + one-line cont, closed",
        "142_last_object": "exercise383 open",
        "next_boundary_text": "=|AD|. 1)证明存在四个将这个图形映射到它自身的",
        "next_required_action": "Continue exercise383 from physical143 only in separately authorized scope; not done here",
        "numbered_unit_or_TOC_closure": "NOT_ASSERTED",
    },
    "local_holds": [
        "AUTHOR_ONLY: independent source review is in flight separately; no human or independent approval claimed.",
        "Figure194 diagram p/P-shaped label case unresolved; exact native pixels retained, no invented identity.",
        "Exercise383 source-open at 自身的; unseen physical143 completion not supplied.",
        "First а-shaped subfigure marker is glyph-identical to Latin a; Cyrillic transcription follows visible б/в and installed source-profile convention, awaiting independent review.",
        "No whole-unit assembly, whole-book reconciliation, modern adaptation or publication authorized/performed.",
    ],
    "constraints_observed": {
        "writes_outside_own_root": 0,
        "prior139140_pixels": 0,
        "prior_modern_candidates_read": 0,
        "backend_or_chat_messages": 0,
        "DB_connections": 0,
        "git_mutations": 0,
        "assemble_or_package_gates": 0,
        "publish_deploy_merge_handoff_closure": 0,
        "browser_sessions_opened": 0,
        "ongoing_owned_exec_sessions": 0,
    },
    "build_started_at": started,
    "build_finished_at": now(),
}
path = save("Report.json", report)
os.chmod(path, 0o444)
binding = facts(path)
with (OWN / "Report.sha256").open("x", encoding="ascii") as stream:
    stream.write(binding["sha256"] + "  Report.json\n")
os.chmod(OWN / "Report.sha256", 0o444)
print(json.dumps(binding, ensure_ascii=False))
