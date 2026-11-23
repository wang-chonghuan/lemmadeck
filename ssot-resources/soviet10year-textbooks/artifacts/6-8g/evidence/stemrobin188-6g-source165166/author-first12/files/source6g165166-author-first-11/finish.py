import hashlib
import json
from pathlib import Path
import stat
import sys

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[4]
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import blocks


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def write(path, value):
    with path.open("x", encoding="utf-8") as output:
        json.dump(value, output, ensure_ascii=False, indent=2)
        output.write("\n")


def binding(path):
    info = path.stat()
    return {
        "path": str(path),
        "sha256": digest(path),
        "bytes": info.st_size,
        "mode": oct(stat.S_IMODE(info.st_mode)),
    }


freeze = read(ROOT / "freeze-ledger.json")
receipt_bindings = []
for path in sorted((ROOT / "receipts").glob("*/execution.json")):
    receipt = read(path)
    assert receipt["cwd"] == str(REPO)
    for stream in receipt["streams"].values():
        assert digest(Path(stream["path"])) == stream["sha256"]
    receipt_bindings.append({**binding(path), "argv": receipt["argv"],
                             "cwd": receipt["cwd"], "exitCode": receipt["exitCode"],
                             "streams": receipt["streams"]})

for entry in freeze["sequence"]:
    for key in ("FIRST", "inventory"):
        path = ROOT / entry[key]["path"]
        assert digest(path) == entry[key]["sha256"]
        assert stat.S_IMODE(path.stat().st_mode) == 0o444
    commands = [read(ROOT / step["receipt"]) for step in entry["completedCommandsInOrder"]]
    assert all(command["exitCode"] == 0 for command in commands)
    assert commands[0]["endedAt"] < commands[1]["startedAt"]
    assert commands[1]["endedAt"] < commands[2]["startedAt"]
    draft = read(ROOT / f"receipts/preserve-{entry['page']:04d}-draft/execution.json")
    assert commands[2]["endedAt"] < draft["startedAt"]

prepare = read(ROOT / "receipts/prepare-range/execution.json")
prepared = read(ROOT / "receipts/prepare-range/stdout")
assert prepare["exitCode"] == 0 and prepared["ok"]
assert [entry["page"] for entry in prepared["pages"]] == [165, 166]
prepare_children = []
for child in prepared["pages"]:
    assert child["status"] == "prepared" and child["returncode"] == 0
    prepare_children.append({
        "argv": child["command"], "cwd": str(REPO), "exitCode": child["returncode"],
        "streams": {name: binding(Path(child[name])) for name in ("stdout", "stderr")},
    })

pages = []
for page, figure in ((165, "fig-219"), (166, "fig-220")):
    directory = ROOT / f"artifacts/6-8g/pages/{page:04d}"
    audit = read(directory / "audit.json")
    native = read(ROOT / f"receipts/finalize-{page:04d}-once/execution.json")
    submitted_meta, submitted_blocks = blocks.parse(
        (ROOT / f"submitted-{page:04d}.page.md").read_text(encoding="utf-8"))
    current_meta, current_blocks = blocks.parse(
        (directory / "page.md").read_text(encoding="utf-8"))
    fields = ("kind", "label", "lines", "cont", "open", "samerow")
    project = lambda items: [{key: item.get(key) for key in fields} for item in items]
    assert project(submitted_blocks) == project(current_blocks)
    assert not audit["normalizations"] and not audit["count_exclusions"]
    assert native["exitCode"] == 1 and audit["errors"]
    assert all("UNKNOWN" not in line for block in current_blocks for line in block["lines"])
    if page == 165:
        assert any(line.startswith("a)") for block in current_blocks for line in block["lines"])
    else:
        assert any("▮" in line for block in current_blocks for line in block["lines"])
        assert any("▼" in line for block in current_blocks for line in block["lines"])
        assert current_blocks[-2]["open"] and current_blocks[-2]["lines"][-1].endswith("这样，在对称")
    original = ROOT / f"work/6-8g/pages/{page:04d}/page.png"
    assert digest(original) == freeze["sourceOnlyImages"][f"{page:04d}"]["sha256"]
    pages.append({
        "physicalPage": page, "printedPage": submitted_meta["printed_page"],
        "status": "SOURCE AUTHOR_ONLY; native FAIL; source held",
        "nativeExitCode": native["exitCode"], "nativeErrors": audit["errors"],
        "authorPrintedRows": read(ROOT / f"FIRST-{page:04d}.inventory.json")["printedRows"]["total"],
        "nativePrintedRows": audit["lines_printed"], "nativeBlockRows": audit["lines_md"],
        "normalizations": audit["normalizations"], "literalBlocksUnchangedByNative": True,
        "candidate": binding(directory / "page.md"),
        "submittedDraft": binding(ROOT / f"submitted-{page:04d}.page.md"),
        "pageJSON": binding(directory / "page.json"), "audit": binding(directory / "audit.json"),
        "nativeReceipt": binding(ROOT / f"receipts/finalize-{page:04d}-once/execution.json"),
        "sourceImage": binding(original),
        "nativeCrop": binding(ROOT / f"work/6-8g/pages/{page:04d}/figures/{figure}.png"),
        "nativeGeometry": audit["figures"],
        "contentRevisionsUsed": 0, "finalizeInvocations": 1, "finalizeRetries": 0,
    })

report = {
    "status": "SOURCE AUTHOR_ONLY; HOLD; no independent or canonical approval",
    "ticket": "STEMROBIN-188", "continuation": "SAME188-6",
    "repo": str(REPO), "ownedRoot": str(ROOT), "physicalPages": [165, 166],
    "sourcePDF": {
        "path": str(REPO / "ssot-resources/soviet10year-textbooks/sources/soviet10years" /
                    submitted_meta["source"]["pdf"]),
        "sha256": submitted_meta["source"]["pdf_sha256"],
        "hashEvidence": "existing production.py prepare-range verified actual PDF during this call",
    },
    "freezeLedger": binding(ROOT / "freeze-ledger.json"),
    "FIRST": freeze["sequence"], "pages": pages,
    "allCompletedExecutionReceiptsBeforeManifestBuild": receipt_bindings,
    "prepareChildren": prepare_children,
    "manifestBuildReceipt": str(ROOT / "receipts/manifest-build/execution.json"),
    "firstNativeFailure": {
        "page": 165, "exitCode": 1,
        "error": pages[0]["nativeErrors"][0],
        "receipt": str(ROOT / "receipts/finalize-0165-once/execution.json"),
        "retainedDraft": str(ROOT / "submitted-0165.page.md"),
        "dependentStagesStopped": True,
        "independent166": "continued only its separately authorized page finalize; also FAIL",
    },
    "imageLedger": binding(ROOT / "image-ledger.json"),
    "images": read(ROOT / "image-ledger.json"),
    "counters": {
        "prepareRangeInvocations": 1, "nativePrepareChildren": 2,
        "finalizeInvocations": 2, "finalizePerPage": {"165": 1, "166": 1},
        "finalizeRetries": 0, "contentRevisionsUsed": 0, "contentRevisionLimit": 1,
        "counterReset": False, "paidCalls": 0, "networkCalls": 0,
        "independentReviews": 0, "childAgents": 0, "furtherPages": 0,
    },
    "boundaries": {
        "incoming164": "human AUTHOR_ONLY text only; ex453 locally closed; not independent approved",
        "actual165Start": "exercise454",
        "actual165NewHeading": "36. 平移",
        "165166Join": "source text locally joins; not whole-section approval",
        "lastPageOpen": True, "lastVisibleText": "这样，在对称",
        "actualOutgoing166NextUnseenPage": "UNKNOWN", "whole36RightBoundary": "UNKNOWN",
    },
    "limitations": [
        "No source-finalized claim: both actual native commands failed.",
        "Unknown source glyph identities/printing roles remain in notes/inventory only.",
        "Literal visible proxies preserved; no fake placeholder, deletion, whitelist/tool/count edit.",
        "No source165/166 review independent of this author; no canonical promotion or publishing.",
        "Native crops retained but not visually opened; exact small-mark interpretation remains held.",
    ],
    "activeExecSessionsAtAuthorFinish": [],
    "endedExecSession": {"id": 14658, "result": "prepare-range exited0; observed completion"},
    "initialReadObservations": [
        {"command": "ls -ld ownedRoot existingVenv", "exitCode": 1,
         "cause": "ownedRoot absent before creation; existing venv symlink present",
         "classification": "initial existence observation, not native failure"},
        {"command": "initial broad rg of ticket tmp and lesson tools",
         "exitCode": 0, "output": "oversized/truncated; discarded for source authoring",
         "classification": "navigation only; source FIRST is solely original165/166 pixels"},
    ],
}
write(ROOT / "report.json", report)
excluded = {
    "manifest.json", "receipts/manifest-build/stdout",
    "receipts/manifest-build/stderr", "receipts/manifest-build/execution.json",
}
files = [binding(path) for path in sorted(ROOT.rglob("*"))
         if path.is_file() and str(path.relative_to(ROOT)) not in excluded]
write(ROOT / "manifest.json", {
    "schema": "source-author-file-manifest@1", "root": str(ROOT),
    "status": report["status"], "files": files,
    "selfExclusions": [
        "manifest.json", "receipts/manifest-build/stdout",
        "receipts/manifest-build/stderr", "receipts/manifest-build/execution.json",
    ],
    "selfExclusionReason": "manifest/self-execution output cannot hash itself; completed build receipt retained separately",
})
print(json.dumps({
    "status": report["status"], "reportSHA256": digest(ROOT / "report.json"),
    "manifestSHA256": digest(ROOT / "manifest.json"),
    "freezeLedgerSHA256": digest(ROOT / "freeze-ledger.json"),
    "imageLedgerSHA256": digest(ROOT / "image-ledger.json"),
    "completedReceipts": len(receipt_bindings), "prepareChildReceipts": len(prepare_children),
    "nativeExits": [page["nativeExitCode"] for page in pages],
    "chargedImages": report["images"]["chargedRequests"],
    "lastPageOpen": True, "outgoing166": "UNKNOWN",
}, ensure_ascii=False, indent=2))
