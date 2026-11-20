"""Derive frozen author inventories with native math/layout parsers, without retrying held validation."""
import hashlib
import json
import math
import re
import sys
from pathlib import Path

W = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
sys.path.insert(0, str(W / ".claude/skills/ld-s10y-lesson/tools"))
import edition

A = W / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d057-n22-author"
F = W / ".tmp/STEMROBIN-181/d1816-d057/n22-figure-author"
T = W / ".tmp/STEMROBIN-181/d1816-d057/n22-work/adapt/10p"
ID = "phy10-c1-s3-n22"

def read(p):
    return json.loads(p.read_text())

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def save(p, obj):
    with p.open("x") as handle:
        handle.write(json.dumps(obj, ensure_ascii=False, indent=2) + "\n")

rawpath = W / f".tmp/STEMROBIN-181/d1816-d057/n22-root/10p/lessons/{ID}/lesson.json"
raw = read(rawpath)
reusepath = W / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d057-n22-source-reuse/bindings.json"
reuse = read(reusepath)
assert sha(rawpath) == reuse["source"]["sha256"]
reused = []
for item in reuse["reused"]:
    p = W / item["path"]
    assert sha(p) == item["sha256"], str(p)
    reused.append({"path": str(p), "sha256": sha(p), "unchanged": True})
source_receipt = read(A / "receipts/text-validate-readonly.stdout.txt")
texts = []
for name in ("modern-us-neutral", "modern-us-neutral-en"):
    folder = T / name / "lessons" / ID
    p = folder / "lesson.template.json"
    modern = read(p)
    assert modern["source"]["data"] == raw
    assert len(modern["prose"]) == len(raw["prose"]) == 10
    blocks = []
    for i, (s, b) in enumerate(zip(raw["prose"], modern["prose"])):
        sm, mm = edition.math_signature(s["text"]), edition.math_signature(b["text"])
        assert sm == mm, (name, i, sm, mm)
        assert edition.prose_number_signature(s["text"]) == edition.prose_number_signature(b["text"])
        if b["kind"] == "p":
            assert edition.normalize_prose_layout(b["text"]) == b["text"]
        assert b["source_text"] == s["text"]
        blocks.append({"index": i, "kind": b["kind"], "sourceRefs": b["source_refs"],
            "sourceText": s["text"], "authoredText": b["text"],
            "sourceMath": sm, "authoredMath": mm, "mathExactlyPreserved": True,
            "changes": b["changes"], "numericChanges": b["numeric_changes"]})
    exercises = read(folder / "exercises.template.json")
    assert exercises["count"] == 0 and exercises["exercises"] == []
    language = "en" if name.endswith("-en") else "zh"
    flowpath = A / f"receipts/prose-flow-{language}-final.stdout.txt"
    flow = read(flowpath)
    assert len(flow["boundaries"]) == len(modern["section_breaks"]) == 2
    assert [{"before": b["before"], "after": b["after"]} for b in flow["boundaries"]] == modern["section_breaks"]
    texts.append({"edition": name, "template": {"path": str(p), "sha256": sha(p)},
        "title": modern["title"], "entries": 10, "proseEntries": 6,
        "figureEntries": 2, "captionEntries": 2, "questions": 0,
        "blocks": blocks, "sectionBreaks": modern["section_breaks"],
        "nativeProseFlow": {"path": str(flowpath), "sha256": sha(flowpath), "data": flow},
        "heldNativeTextErrors": [
            e for r in source_receipt if r["edition"] == name for e in r["errors"]
            if "西里尔" in e
        ],
        "omittedSecondR": "Restored and native validate_text rechecked prose[1] only; see restore-r-context receipt.",
        "heldBlocksRevalidated": False})
save(A / "text-inventories.json", {
    "schema": "STEMROBIN-181/author-text-inventory@1", "role": "author",
    "sourceReuse": {"path": str(reusepath), "sha256": sha(reusepath), "files": reused},
    "boundary": reuse["sourceBoundary"], "lessons": texts})

figures = []
for name in ("modern-us-neutral", "modern-us-neutral-en"):
    folder = F / name / "lessons" / ID / "figures"
    for n in (34, 35):
        p = folder / f"fig-{n}.spec.json"
        spec = read(p)
        assert ".tmp" not in json.dumps(spec)
        assert spec["source"]["image"]["sha256"] == sha(W / spec["source"]["image"]["path"])
        reportpath = folder / f"fig-{n}.render.json"
        report = read(reportpath)
        svgpath = folder / f"fig-{n}.svg"
        assert report["spec"]["sha256"] == sha(p)
        assert report["output"]["svg"]["sha256"] == sha(svgpath)
        assert report["status"] == "pass" and report["collisions"] == []
        assert ".tmp" not in json.dumps(report)
        for test in report["displayChecks"]:
            assert test["status"] == "pass" and test["measuredMinPx"] >= 16
        curves = {}
        if n == 35:
            objects = {o["id"]: o for o in spec["objects"]}
            for tag, amplitude, end in (("voltage", 104, 560), ("current", 52, 545)):
                obj = objects[f"{tag}-curve"]
                values = re.findall(r"(?:M|L)\s+([\d.]+)\s+([\d.]+)", obj["d"])
                assert len(values) == end - 80 + 1
                for x, y in values:
                    expected = 180 - amplitude * math.cos(2 * math.pi * (float(x) - 80) / 320)
                    assert abs(float(y) - expected) <= 0.000001
                curves[tag] = {"sampleCount": len(values), "phase": "common cosine",
                    "pathMatchesFeatureAnchors": True, "physicalScaleGiven": False,
                    "note": "Coordinates, smoothing and height ratio are graphical regularization, not inferred volts, amps, time or resistance values."}
            assert objects["current-curve"]["strokeWidth"] > objects["voltage-curve"]["strokeWidth"]
            assert all(not o.get("dash") for o in (objects["current-curve"], objects["voltage-curve"]))
        figures.append({"edition": name, "figure": f"fig-{n}",
            "source": spec["source"]["image"], "spec": {"path": str(p), "sha256": sha(p)},
            "svg": {"path": str(svgpath), "sha256": sha(svgpath)},
            "render": {"path": str(reportpath), "sha256": sha(reportpath)},
            "inventory": spec["source"]["inventory"], "curveChecks": curves,
            "nativeMechanicalStatus": report["status"], "displayChecks": report["displayChecks"],
            "independentReview": "pending; no review file authored"})
save(A / "figure-inventories-final.json", {
    "schema": "STEMROBIN-181/author-final-figure-inventory@1", "role": "author",
    "figures": figures})
print(json.dumps({"textEditions": len(texts), "figureCandidates": len(figures),
    "exactSourceMath": True, "zeroQuestions": True, "heldNativeBareCyrillicRechecks": 0,
    "unchangedReusedSourceFiles": len(reused)}, indent=2))
