import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
TMP = Path(__file__).resolve().parent
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import assemble
import blocks

BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
TRACE = TMP / "source-review-9p-0160-0163-finalization-trace.json"
TOC = ROOT / "ssot-resources/soviet10year-textbooks/toc/9p/zh.json"
MANIFEST = ROOT / "ssot-resources/soviet10year-textbooks/sources/manifest.json"
OUT = TMP / "d018-prior64-recovery"
EXPECTED = "c72ef86fa45c7062add3edb61583221ffe4e8ca3b51e376b910f70b7b780ffc5"


def sha(data):
    return hashlib.sha256(data).hexdigest()


def binding(file):
    return {"path": str(file), "sha256": sha(file.read_bytes())}


trace_binding = binding(TRACE)
trace = json.loads(TRACE.read_bytes())
prior = trace["prior64"]
assert prior["sha256"] == EXPECTED
assert prior["path"] == "ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c2-s2-n64/lesson.json"
current_path = ROOT / prior["path"]
current_binding = binding(current_path)
current_doc = json.loads(current_path.read_bytes())
assert current_doc["id"] == "phy9-c2-s2-n64"
assert len(current_doc["prose"]) == 42
files = [
    file for file in sorted(BOOK.glob("pages/*/page.json"))
    if int(file.parent.name) <= 159
]
assert files and files[-1].parent.name == "0159"
inputs = [binding(file) for file in files]
toc_binding = binding(TOC)
manifest_binding = binding(MANIFEST)
catalogs = [
    item for item in json.loads(MANIFEST.read_bytes())["catalogs"]
    if item["book"] == "9p"
]
assert len(catalogs) == 1
exercise_numbering = catalogs[0].get("exerciseNumbering", "book")
page157 = json.loads((BOOK / "pages/0157/page.json").read_bytes())
assert any(
    item["id"] == "p0157-vacuum-permittivity-unit-square"
    for item in page157["meta"]["errata"]
)


class HistoricalPages:
    # The native loader sees only the historical prefix, never current160+ pages.
    def glob(self, pattern):
        assert pattern == "pages/*/page.json"
        return files


stream = assemble.load_stream(HistoricalPages())
assert max(item["page"] for item in stream) == 159
merged, merge_messages = assemble.merge_across_pages(stream)
lessons = assemble.cut_lessons(merged)
for lesson in lessons:
    lesson["prose"], lesson["exercises"] = assemble.split_lesson(lesson, exercise_numbering)
figure_messages, figure_warnings = assemble.claim_figures(lessons, merged)
toc_messages = assemble.check_toc(
    lessons, TOC, "9p",
    {item["printed_page"] for item in stream if item.get("printed_page") is not None},
)
matches = [lesson for lesson in lessons if lesson.get("card_id") == current_doc["id"]]
assert len(matches) == 1
lesson = matches[0]
lid = lesson["card_id"]

# Match the native run() lesson.json projection and serializer without calling run().
document = {
    "id": lid, "card_id": lesson.get("card_id"),
    "chapter": lesson["chapter"], "section": lesson["section"],
    "number": lesson["number"], "title": lesson["title"],
    "printed_title": lesson["printed_title"], "start_page": lesson["start_page"],
    "start_printed": lesson["start_printed"],
    "figures": lesson["figures"], "exercise_count": len(lesson["exercises"]),
    "prose": [
        {
            "kind": item["kind"], "text": blocks.text_of(item),
            "id": item.get("id"), "label": item.get("label"),
            "printed_page": item.get("printed_page"),
            "source_refs": item.get("spans") or [item["ref"]],
        }
        for item in lesson["prose"]
    ],
}
candidate = (json.dumps(document, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
candidate_sha = sha(candidate)
print(json.dumps({
    "candidate_sha256": candidate_sha, "expected_prior64_sha256": EXPECTED,
    "exact_bytes_match": candidate_sha == EXPECTED,
    "historical_prose_blocks": len(document["prose"]),
    "historical_source_pages": sorted({
        int(ref.split("#")[0][1:]) for item in document["prose"] for ref in item["source_refs"]
    }),
}, ensure_ascii=False, indent=2), flush=True)
assert candidate_sha == EXPECTED, "No candidate saved: prior64 byte hash mismatch"
for entry in inputs:
    assert binding(Path(entry["path"])) == entry
assert binding(TRACE) == trace_binding
assert binding(TOC) == toc_binding
assert binding(MANIFEST) == manifest_binding
assert binding(current_path) == current_binding
OUT.mkdir(exist_ok=True)
target = OUT / "lesson.json"
assert not target.exists(), "Preserve existing archival recovery"
with target.open("xb") as file:
    file.write(candidate)
assert target.read_bytes() == candidate
recovered_binding = binding(target)
record = {
    "ticket": "STEMROBIN-181", "invocation": "D018", "author": "Einstein",
    "status": "later-archival-recovery-exact-byte-match-not-approval",
    "created_at": datetime.now(timezone.utc).isoformat(),
    "purpose": "Recover the exact pre160-163-integration raw n64 lesson.json for subsequent evidence retention.",
    "original_trace": trace_binding, "trace_json_pointer": "/prior64",
    "historical_binding_unchanged": prior,
    "recovered": recovered_binding,
    "exact_aliases": [
        {
            "originalPath": prior["path"], "sha256": EXPECTED,
            "path": str(target.relative_to(ROOT)),
            "absolutePath": str(target),
            "traceField": "/prior64",
            "meaning": "Historical bytes only; never substitute for the current durable42-block n64 lesson.",
        }
    ],
    "current_durable_binding_read_only": current_binding,
    "current_durable_prose_blocks": len(current_doc["prose"]),
    "historical_prose_blocks": len(document["prose"]),
    "historical_figures": document["figures"],
    "historical_exercise_count": document["exercise_count"],
    "historical_source_pages": sorted({
        int(ref.split("#")[0][1:]) for item in document["prose"] for ref in item["source_refs"]
    }),
    "historical_prefix": {
        "max_pdf_page": 159, "page_json_count": len(inputs),
        "actual_pdf_pages": [int(file.parent.name) for file in files],
        "only_prefix_page_json_read_by_native_loader": True,
        "inputs": inputs,
    },
    "page157_errata": {
        "input": binding(BOOK / "pages/0157/page.json"),
        "meta_errata_preserved": page157["meta"]["errata"],
        "registration_preceded_historical_assembly_per_main": True,
        "no_rollback_or_source_math_rewrite": True,
        "native_raw_lesson_projection_does_not_add_errata_metadata": True,
    },
    "native_reconstruction": {
        "exercise_numbering_from_source_manifest": exercise_numbering,
        "functions": [
            "assemble.load_stream", "assemble.merge_across_pages", "assemble.cut_lessons",
            "assemble.split_lesson", "assemble.claim_figures", "assemble.check_toc",
            "blocks.text_of",
        ],
        "check_toc_purpose": "Native TOC canonical card-ID assignment only; no acceptance or approval inferred.",
        "serializer": "Exact native run() lesson.json field projection; json.dumps(ensure_ascii=False, indent=2) + LF, UTF-8",
        "candidate_byte_count": len(candidate),
        "candidate_sha256_verified_before_saving": candidate_sha,
        "native_run_audit_promote_figures_or_cli_not_called": True,
        "diagnostic_messages_not_gate_results": {
            "merge": merge_messages, "figure": figure_messages,
            "figure_warnings": figure_warnings, "toc": toc_messages,
        },
    },
    "tools": [binding(TOOLS / name) for name in ("assemble.py", "blocks.py")],
    "toc": toc_binding, "source_manifest": manifest_binding,
    "helper": binding(Path(__file__).resolve()),
    "not_prior_approval_or_retroactive_authorization": True,
    "no_source_review_science_review_or_pixel_review": True,
    "existing_gate_reports_not_modified": True,
    "source164_167_freeze_and_candidates_not_read_or_modified": True,
    "source_or_modern_artifacts_tools_index_meter_db_git_dependencies_not_modified": True,
    "prepare_finalize_assemble_cli_vectorize_render_review_commands": [],
    "in_flight_processes": 0,
}
record_path = OUT / "recovery.json"
with record_path.open("x", encoding="utf-8") as file:
    file.write(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "recovered": recovered_binding, "recovery_record": binding(record_path),
    "exact_aliases": record["exact_aliases"], "status": record["status"],
    "in_flight_processes": 0,
}, ensure_ascii=False, indent=2))
