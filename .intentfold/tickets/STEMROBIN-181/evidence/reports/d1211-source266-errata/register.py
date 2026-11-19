import copy
import hashlib
import json
import shutil
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
assert Path.cwd() == REPO
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import blocks
import edition
import p2c

OWN = Path(__file__).resolve().parent
TMP = OWN.parent
PREP = TMP / "d1201-n97n99-first-preparation"
SOURCE = REPO / "ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0266"
REVIEW = TMP / "d1205-source266-speed-factor-affected-review/report.json"
assert hashlib.sha256(REVIEW.read_bytes()).hexdigest() == "f070728f995577107125812981e5249bee49c172127bde3c0df46a365c6b5b6c"
assert not (OWN / "report.json").exists()


def bind(file):
    return {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


def save(file, value):
    file.parent.mkdir(parents=True, exist_ok=True)
    with file.open("x") as handle:
        handle.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    return bind(file)


review = json.loads(REVIEW.read_text())
original_page = json.loads((SOURCE / "page.json").read_text())
original_md_meta, original_md_blocks = blocks.load(SOURCE / "page.md")
assert original_md_blocks == original_page["blocks"]
assert original_md_meta == original_page["meta"]
assert original_page["meta"]["errata"] == []
original_audit = json.loads((SOURCE / "audit.json").read_text())
assert original_audit["errors"] == []
assert original_audit["lines_printed"] == original_audit["lines_md"] == 24
records = []
for index, proposed in enumerate(review["proposed_errata"], 1):
    source = proposed["source_binding"]
    assert source["raw_block_reference"] == "p0266#1"
    row_index = source["json_path"][-1]
    assert original_page["blocks"][0]["lines"][row_index] == source["original_row"]
    records.append({
        "id": f"p0266-math-{index}",
        "block": "p0266#1",
        "original": source["original_literal"],
        "reason": proposed["reason"],
    })
current_page = copy.deepcopy(original_page)
current_page["meta"]["errata"] = records
assert p2c._validate_page_errata(current_page["meta"], current_page["blocks"], 266) == []
assert current_page["blocks"] == original_page["blocks"]
assert blocks.printed_lines(current_page["blocks"]) == 24

book = OWN / "root/10p"
for page in range(259, 267):
    number = f"{page:04d}"
    for name in ("page.md", "page.json", "audit.json"):
        file = book / "pages" / number / name
        file.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(PREP / "root/10p/pages" / number / name, file)
        file.chmod(0o644)
for name in ("lesson.json", "lesson.md", "exercises.json"):
    file = book / "lessons/phy10-c2-s4-n99" / name
    file.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(PREP / "root/10p/lessons/phy10-c2-s4-n99" / name, file)
    file.chmod(0o644)
shutil.copy2(PREP / "root/10p/book.json", book / "book.json")
candidate = book / "pages/0266"
(candidate / "page.json").write_text(json.dumps(current_page, ensure_ascii=False, indent=2) + "\n")
(candidate / "page.md").write_text(blocks.dump(current_page["meta"], current_page["blocks"], 266))
audit = copy.deepcopy(original_audit)
audit["errata"] = 2
(candidate / "audit.json").write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n")
assert blocks.load(candidate / "page.md") == (current_page["meta"], original_md_blocks)
assert blocks.printed_lines(current_page["blocks"]) == blocks.printed_lines(original_page["blocks"])
stripped = copy.deepcopy(current_page)
stripped["meta"]["errata"] = []
assert stripped == original_page
stripped_audit = copy.deepcopy(audit)
stripped_audit["errata"] = 0
assert stripped_audit == original_audit
raw_lesson = json.loads((book / "lessons/phy10-c2-s4-n99/lesson.json").read_text())
raw_exercises = json.loads((book / "lessons/phy10-c2-s4-n99/exercises.json").read_text())
bound_records = edition.source_errata(book, raw_lesson, raw_exercises)
assert len(bound_records) == 2
assert len({record["target"] for record in bound_records}) == 1
target_index = int(bound_records[0]["target"].removeprefix("lesson.prose[").removesuffix("]"))
assert "p0266#1" in raw_lesson["prose"][target_index]["source_refs"]
assert all(record["source"]["sha256"] == bind(candidate / "page.json")["sha256"] for record in bound_records)
for record, proposed in zip(bound_records, review["proposed_errata"]):
    record["corrected"] = proposed["source_binding"]["corrected_literal"]
bindings = save(OWN / "modern-errata-records.json", bound_records)
report = save(OWN / "report.json", {
    "ticket": "STEMROBIN-181", "batch": "D037",
    "status": "SOURCE-METADATA-REGISTERED-EXACT-BINDING-PASS",
    "numericalIndependentReview": bind(REVIEW),
    "original": [bind(SOURCE / name) for name in ("page.md", "page.json", "audit.json")],
    "current": [bind(candidate / name) for name in ("page.md", "page.json", "audit.json")],
    "book": str(book), "modernRecords": bindings, "registeredRecords": records,
    "faithfulTextAndBlocksChanged": False, "sourcePixelEdits": 0,
    "auditDelta": {"errata": {"before": 0, "after": 2}},
    "existingNative24of24Reused": True, "passedNativeReplays": 0,
    "directNativeErrataValidation": "PASS",
    "authoritativeSourceErrataBinding": "PASS",
    "sourcePageNotYetReplaced": True, "modernTextNotYetCorrected": True,
    "parentImageOpens": 0, "paidCalls": 0, "completeCard": False,
})
print(json.dumps({"report": report, "records": bindings, "status": "PASS"}))
