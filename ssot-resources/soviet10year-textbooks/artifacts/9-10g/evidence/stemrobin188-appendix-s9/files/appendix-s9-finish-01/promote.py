import hashlib
import json
from pathlib import Path
import shutil
import sys

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
assert Path.cwd() == REPO
TMP = REPO / ".intentfold/tickets/STEMROBIN-188/tmp"
OWN = TMP / "appendix-s9-finish-01"
SCOPED = TMP / "appendix-s9-draft-03/artifacts/9-10g"
CORE = REPO / "ssot-resources/soviet10year-textbooks/artifacts/9-10g"
LESSON = "geo910-appendix-s9"


def binding(file):
    return {"path": str(file), "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}


source_review, source_sha, text_review, text_sha = sys.argv[1:]
review_bindings = []
for name, expected in ((source_review, source_sha), (text_review, text_sha)):
    file = Path(name).resolve()
    assert file.is_relative_to(TMP)
    item = binding(file)
    assert item["sha256"] == expected
    review_bindings.append(item)
native_receipt = TMP / "appendix-s9-draft-03/adapt-finalize-01/command.json"
receipt = json.loads(native_receipt.read_text())
assert receipt["exitCode"] == 0
assert receipt["cwd"] == str(REPO)
ready = SCOPED / f"editions/modern-us-neutral/lessons/{LESSON}"
audit = json.loads((ready / "adaptation.audit.json").read_text())
assert audit["status"] == "pass"
lesson = json.loads((ready / "lesson.json").read_text())
exercises = json.loads((ready / "exercises.json").read_text())
figures = json.loads((ready / "figures.json").read_text())
assert lesson["id"] == LESSON and len(lesson["prose"]) == 28
assert len(exercises["exercises"]) == len(figures["figures"]) == 0
assert "答案和提示" not in json.dumps(lesson, ensure_ascii=False)
copies = []
for page in (320, 321, 322):
    for name in ("page.md", "page.json"):
        copies.append((SCOPED / f"pages/{page:04d}/{name}", CORE / f"pages/{page:04d}/{name}"))
    audit_root = TMP / ("source319320-author" if page == 320 else "source321322-author")
    copies.append((audit_root / f"artifacts/9-10g/pages/{page:04d}/audit.json",
                   CORE / f"pages/{page:04d}/audit.json"))
for name in ("lesson.json", "lesson.md", "exercises.json"):
    copies.append((SCOPED / f"lessons/{LESSON}/{name}", CORE / f"lessons/{LESSON}/{name}"))
for name in ("lesson.json", "exercises.json", "figures.json", "adaptation.audit.json"):
    copies.append((ready / name, CORE / f"editions/modern-us-neutral/lessons/{LESSON}/{name}"))
for source, target in copies:
    assert source.is_file()
    if target.exists():
        assert target.read_bytes() == source.read_bytes(), target
for name, source in (
    ("source-index-before.json", CORE / "book.json"),
    ("edition-index-before.json", CORE / "editions/modern-us-neutral/book.json"),
):
    target = OWN / name
    assert not target.exists()
    shutil.copyfile(source, target)
observed = []
for source, target in copies:
    target.parent.mkdir(parents=True, exist_ok=True)
    reused = target.exists()
    if not reused:
        with source.open("rb") as input_file, target.open("xb") as output_file:
            shutil.copyfileobj(input_file, output_file)
    observed.append({"from": binding(source), "to": binding(target), "reused": reused})
record = {
    "status": "S9_NATIVE_READY_FILES_ATTACHED_INDEX_RENDER_DISPLAY_PENDING",
    "lesson": LESSON, "reviews": review_bindings,
    "nativeFinalizer": binding(native_receipt),
    "copies": observed, "bookAnswerPagesCopied": False,
    "sourceAuditReuse": "320 original23/23 audit plus independent heading-affected review; 321322 original native audits.",
    "scope": "Limited authoritative source root; not a canonical whole-book rebuild PASS.",
    "sourceFinalizerReplays": 0, "wholeLessonApproved": False,
    "displayPassed": False, "published": False,
}
with (OWN / "promotion.json").open("x") as handle:
    json.dump(record, handle, ensure_ascii=False, indent=2)
    handle.write("\n")
print(json.dumps({"promotion": binding(OWN / "promotion.json")}))
