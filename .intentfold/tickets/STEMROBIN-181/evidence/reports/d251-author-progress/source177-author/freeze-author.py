import hashlib
import json
from pathlib import Path
import sys


OUT = Path(__file__).resolve().parent
ROOT = OUT.parents[4]
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import blocks


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


freeze = OUT / "author-freeze.json"
if freeze.exists():
    raise RuntimeError("Immutable author freeze already exists")
bindings = json.loads((OUT / "input-bindings.json").read_text())
native = json.loads((OUT / "native.json").read_text())
opens = json.loads((OUT / "actual-opens.json").read_text())
report = json.loads((OUT / "report.json").read_text())
for item in bindings["preparedInputs"]:
    assert sha256(Path(item["path"])) == item["sha256"]
    assert sha256(OUT / item["destination"]) == item["sha256"]
for key in ("manifest", "previousAuthor", "previousPage", "inheritedActualOpens"):
    item = bindings[key]
    assert sha256(Path(item["path"])) == item["sha256"]
assert native["finalizeCalls"] == native["vectorizeCalls"] == 1
assert native["finalizeExitCode"] == native["vectorizeExitCode"] == 0
assert opens["budget"]["cumulativeContextImages"] == 15
before_meta, before = blocks.load(OUT / "authored-page-before-finalize.md")
after_meta, after = blocks.load(OUT / "source/10p/pages/0177/page.md")
assert [block["lines"] for block in before] == [block["lines"] for block in after]
assert before_meta["notes"] == after_meta["notes"]
assert blocks.printed_lines(after) == 25
assert after[0]["cont"] and after[-2]["open"]
audit = json.loads((OUT / "source/10p/pages/0177/audit.json").read_text())
assert audit["lines_printed"] == audit["lines_md"] == 25
assert not audit["errors"] and not audit["normalizations"]
artifacts = [
    {"path": str(path), "sha256": sha256(path), "bytes": path.stat().st_size}
    for path in sorted(OUT.rglob("*"))
    if path.is_file() and path != freeze
]
result = {
    "schema": "bounded-source177-first-author-freeze@1",
    "ticket": "STEMROBIN-181",
    "role": "First author, not independent reviewer",
    "status": report["status"],
    "page": 177,
    "immutablePolicy": "Create once with exclusive mode; do not update after freezing.",
    "artifacts": artifacts,
    "manifestSha256": bindings["manifest"]["sha256"],
    "nativeReceiptSha256": sha256(OUT / "native.json"),
    "reportSha256": sha256(OUT / "report.json"),
    "actualOpensSha256": sha256(OUT / "actual-opens.json"),
    "finalizeExitCode": 0,
    "vectorizeExitCode": 0,
    "printedLines": 25,
    "mdLines": 25,
    "bodyAndNotesPreservedAcrossFinalize": True,
    "imagesNew": 2,
    "imagesInherited": 13,
    "imagesCumulative": 15,
    "budgetReset": False,
    "sourceIndependentStatus": "HOLD-NOT-REVIEWED",
    "raw135IndependentStatus": "HOLD-NOT-REVIEWED",
    "rightBoundaryStatus": "HOLD-UNOBSERVED",
    "canonicalSharedMeterIndexWritten": False,
}
with freeze.open("x", encoding="utf-8") as output:
    output.write(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
freeze.chmod(0o444)
print(json.dumps({"authorFreeze": str(freeze), "sha256": sha256(freeze),
                  "status": result["status"], "imagesCumulative": 15}))
