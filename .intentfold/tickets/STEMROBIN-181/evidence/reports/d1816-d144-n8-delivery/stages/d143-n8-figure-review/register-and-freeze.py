#!/usr/bin/env python3
"""Register once and retain immutable candidate-only review evidence."""

import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d143-n8-figure-review"
INPUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d143-n8-figure-review-input"


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def record(path):
    path = Path(path).absolute()
    data = path.read_bytes()
    return {"path": str(path), "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}


def write_json(path, payload):
    path = Path(path)
    if path.parent.resolve() != OWN or path.exists():
        raise SystemExit("Refusing out-of-scope write or evidence overwrite: " + str(path))
    path.write_text(json.dumps(payload, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")


if Path.cwd() != ROOT:
    raise SystemExit("Explicit repository cwd required")

assessment = load(OWN / "review-assessment.json")
proof = load(OWN / "independent-geometry.json")
candidate = load(INPUT / "candidate-only.json")
selected = candidate["selected"]
native_path = OWN / "fig-05.review.json"
for name in ("fig-05.review.json", "native-record.receipt.json", "report.json", "review-freeze.json",
             "native-record.stdout.txt", "native-record.stderr.txt"):
    if (OWN / name).exists():
        raise SystemExit("Registration already attempted; refusing replay: " + name)

if proof["status"] != "pass" or assessment["semanticVerdict"] != "pass" \
        or assessment["offlineVisualVerdict"] != "pass":
    raise SystemExit("Passing native review is forbidden for a held or failed figure")

inputs = {item["path"]: item for item in proof["inputs"]}
for path in INPUT.iterdir():
    if path.is_file():
        inputs[str(path.resolve())] = record(path)
for expected in proof["inputs"]:
    if record(expected["path"]) != expected:
        raise SystemExit("Frozen input changed before registration: " + expected["path"])
if record(INPUT / "input-freeze.json")["sha256"] != \
        "744cf35a707383e8c050dff1658ce1f4249047ab69bf83d56476be32677bb960":
    raise SystemExit("Input freeze changed")

rules = [
    ROOT / "AGENTS.md",
    ROOT / ".intentfold/readme.md",
    ROOT / ".intentfold/project.json",
    ROOT / ".intentfold/charter/product.md",
    ROOT / ".intentfold/charter/engineering.md",
    ROOT / ".intentfold/charter/operations.md",
    ROOT / ".agents/skills/ld-s10y-image/SKILL.md",
    ROOT / ".agents/skills/ld-s10y-image/references/figure-spec.md",
    ROOT / ".agents/skills/ld-s10y-image/references/routing.md",
    ROOT / ".agents/skills/ld-s10y-image/references/quality-gate.md",
    ROOT / ".claude/skills/ld-s10y-lesson/references/production-resume.md",
    ROOT / ".agents/skills/ld-s10y-image/scripts/render_spec.mjs",
    Path("/Users/yong/.agents/skills/intentfold/SKILL.md"),
]
for path in rules:
    inputs[str(path.resolve())] = record(path)

tool = ROOT / ".agents/skills/ld-s10y-image/scripts/record_review.py"
dependency = ROOT / ".agents/skills/ld-s10y-image/scripts/validate_spec.py"
snapshots = []
for source, target in ((tool, OWN / "native-tool-record_review.py.txt"),
                       (dependency, OWN / "native-tool-validate_spec.py.txt")):
    if target.exists():
        raise SystemExit("Refusing to overwrite tool bytes")
    data = source.read_bytes()
    target.write_bytes(data)
    source_record = record(source)
    snapshot_record = record(target)
    if source_record["sha256"] != snapshot_record["sha256"]:
        raise SystemExit("Tool snapshot mismatch")
    inputs[str(source.resolve())] = source_record
    snapshots.append({"original": source_record, "retainedBytes": snapshot_record})

notes = assessment["nativeReviewNotesBase"] + " Hash bindings: source PNG " + \
    selected["source"]["sha256"] + "; current spec " + selected["spec"]["sha256"] + \
    "; current render " + selected["render"]["sha256"] + "; actual SVG " + \
    selected["svg"]["sha256"] + "; whole640 PNG " + selected["preview"]["sha256"] + \
    "; mobile start PNG " + selected["mobileScrollStart"]["sha256"] + \
    "; mobile end PNG " + selected["mobileScrollEnd"]["sha256"] + \
    "; independent SVG proof " + record(OWN / "independent-geometry.json")["sha256"] + \
    "; independent source inventory " + record(OWN / "source-inventory.json")["sha256"] + "."
write_json(OWN / "native-review-notes.json", {"notes": notes})

argv = [sys.executable, "-B", str(tool), "--spec", selected["spec"]["path"],
        "--render", selected["render"]["path"], "--output", str(native_path),
        "--status", "pass", "--notes", notes]
started = datetime.now(timezone.utc).isoformat()
result = subprocess.run(argv, cwd=str(ROOT), capture_output=True, check=False)
finished = datetime.now(timezone.utc).isoformat()
(OWN / "native-record.stdout.txt").write_bytes(result.stdout)
(OWN / "native-record.stderr.txt").write_bytes(result.stderr)

native_created = native_path.exists()
native_valid = False
if native_created:
    native = load(native_path)
    native_valid = (
        native.get("schema") == "ld-s10y-image/review@1"
        and native.get("status") == "pass"
        and native.get("figure") == "fig-05"
        and native["source"]["sha256"] == selected["source"]["sha256"]
        and native["spec"]["sha256"] == selected["spec"]["sha256"]
        and native["render"]["sha256"] == selected["render"]["sha256"]
        and native["outputs"]["svg"]["sha256"] == selected["svg"]["sha256"]
        and native["notes"] == notes
    )
receipt = {
    "schema": "native-review-registration-receipt@1",
    "cwd": str(ROOT),
    "argv": argv,
    "startedAt": started,
    "finishedAt": finished,
    "exitCode": result.returncode,
    "invocationCount": 1,
    "purpose": "Metadata registration only, not author/native producer replay",
    "internalValidation": "record_review.py internally validates current metadata; no standalone validator invocation",
    "toolBytes": snapshots,
    "stdout": record(OWN / "native-record.stdout.txt"),
    "stderr": record(OWN / "native-record.stderr.txt"),
    "nativeReviewAt1Created": native_created and native_valid and result.returncode == 0,
    "nativeReview": record(native_path) if native_created else None,
}
write_json(OWN / "native-record.receipt.json", receipt)

for expected in inputs.values():
    if record(expected["path"]) != expected:
        raise SystemExit("Input/tool changed during registration: " + expected["path"])
for snapshot in snapshots:
    if record(snapshot["retainedBytes"]["path"]) != snapshot["retainedBytes"]:
        raise SystemExit("Retained tool bytes changed")

holds = list(assessment["remainingHolds"])
if not receipt["nativeReviewAt1Created"]:
    holds.append({"scope": "native-metadata-registration",
                  "reason": "Single authorized registration did not produce a current passing review. Receipt retained; no retry or repair performed."})
outputs = [record(path) for path in sorted(OWN.iterdir()) if path.is_file()]
report = {
    **assessment,
    "schema": "independent-figure-review-report@1",
    "reviewedAt": finished,
    "nativeReviewNotes": notes,
    "nativeReviewAt1Created": receipt["nativeReviewAt1Created"],
    "nativeReview": receipt["nativeReview"],
    "nativeRegistrationInvocations": 1,
    "nativeRegistrationVerdict": "pass" if receipt["nativeReviewAt1Created"] else "hold",
    "independentGeometry": record(OWN / "independent-geometry.json"),
    "independentGeometryCheckCount": len(proof["checks"]),
    "independentGeometryFailedChecks": [check for check in proof["checks"] if check["status"] != "pass"],
    "inputs": list(inputs.values()),
    "selected": selected,
    "outputs": outputs,
    "remainingHolds": holds,
    "bindingManifest": str(OWN / "review-freeze.json"),
    "hashPolicy": "The freeze binds this report and all other owned outputs. The freeze's own SHA is returned externally to avoid circular self-hashes."
}
write_json(OWN / "report.json", report)
freeze = {
    "schema": "independent-figure-review-freeze@1",
    "ticket": "STEMROBIN-181",
    "batch": "D143",
    "book": "9p",
    "lesson": "phy9-c1-s1-n8",
    "figure": "fig-05",
    "selectedCandidate": 2,
    "frozenAt": datetime.now(timezone.utc).isoformat(),
    "cwd": str(ROOT),
    "ownership": str(OWN),
    "independent": True,
    "reviewerIsAuthor": False,
    "semanticVerdict": assessment["semanticVerdict"],
    "offlineVisualVerdict": assessment["offlineVisualVerdict"],
    "actualImageOpens": assessment["actualImageOpens"],
    "nativeReviewNotes": notes,
    "nativeReviewAt1Created": receipt["nativeReviewAt1Created"],
    "nativeReview": receipt["nativeReview"],
    "remainingHolds": holds,
    "inputFreeze": record(INPUT / "input-freeze.json"),
    "inputs": list(inputs.values()),
    "outputs": [record(path) for path in sorted(OWN.iterdir()) if path.is_file()],
    "report": record(OWN / "report.json"),
    "sourceFirstInventory": record(OWN / "source-inventory.json"),
    "imageEvidence": {key: selected[key] for key in
                      ("source", "preview", "mobileScrollStart", "mobileScrollEnd")},
    "nativeMetadataRegistrationOnly": True,
    "nativeProducerReplay": False,
    "repairsPerformed": 0,
    "paidCalls": 0,
    "canonicalPromotion": False,
    "courseAcceptance": False,
    "productAcceptance": False,
    "hashPolicy": "All current referenced inputs and owned outputs are bound. This file is externally hash-bound, not recursively self-hashed."
}
write_json(OWN / "review-freeze.json", freeze)
print(json.dumps({
    "semanticVerdict": assessment["semanticVerdict"],
    "offlineVisualVerdict": assessment["offlineVisualVerdict"],
    "actualImageOpens": assessment["actualImageOpens"],
    "nativeReviewAt1Created": receipt["nativeReviewAt1Created"],
    "nativeExitCode": result.returncode,
    "report": record(OWN / "report.json"),
    "freeze": record(OWN / "review-freeze.json"),
    "nativeReview": receipt["nativeReview"],
    "inputBindings": len(inputs),
    "ownedOutputBindings": len(freeze["outputs"])
}, indent=2))
sys.exit(0 if receipt["nativeReviewAt1Created"] else 1)
