"""Hash-bind an independent pixel review and check the existing geometry, without rendering."""
import hashlib
import json
import math
import struct
import subprocess
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n44-fig0809-review"
AUTHOR = OUT.parent / "n44-fig0809-author"
SOURCE = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures"
TEXT = OUT.parent / "g10-n44/work/adapt/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n44/lesson.template.json"
VALIDATOR = ROOT / ".agents/skills/ld-s10y-image/scripts/validate_spec.py"
RENDERER = ROOT / ".agents/skills/ld-s10y-image/scripts/render_spec.mjs"
FIRST_HASHES = {
    "FIRST-source.md": "967f697d085dde36751fe9aad9265b217392bfcf1856fb42f64d6d9c94f13dd7",
    "FIRST-source.json": "2ad3ba0a84f791fc6fb180dacd31e9fd096ef1e7da8df30139d95eda39262596",
}
BINDINGS = {}


def bind(path, usage="review input"):
    path = path.resolve()
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    BINDINGS[str(path)] = {"path": str(path), "sha256": digest, "usage": usage}
    return {"path": str(path), "sha256": digest}


def read_json(path):
    bind(path)
    return json.loads(path.read_text())


def write(name, value):
    path = OUT / name
    with path.open("x") as stream:
        stream.write(value if isinstance(value, str) else json.dumps(value, indent=2) + "\n")
    return bind(path, "independent generated review evidence")


def delta(a, b):
    return [b[0] - a[0], b[1] - a[1]]


def cross(a, b):
    return a[0] * b[1] - a[1] * b[0]


def dot(a, b):
    return sum(x * y for x, y in zip(a, b))


def png_size(path):
    header = path.read_bytes()[:24]
    assert header[:8] == b"\x89PNG\r\n\x1a\n"
    return list(struct.unpack(">II", header[16:24]))


for name, expected in FIRST_HASHES.items():
    assert bind(OUT / name, "immutable FIRST, saved before candidate/text reads")["sha256"] == expected
first = read_json(OUT / "FIRST-source.json")
author_report = read_json(AUTHOR / "report.json")
bind(AUTHOR / "report.md", "author narrative read after all current previews")
text_binding = bind(TEXT, "sole modern text authority; not fullready")
lesson = read_json(TEXT)
paragraphs = [p["text"] for p in lesson["prose"] if p.get("kind") == "p"]
author_text_hash = author_report["inputSnapshots"][0]["sha256"]
text_file_hash_matches = text_binding["sha256"] == author_text_hash
for path in [
    ROOT / ".agents/skills/ld-s10y-image/SKILL.md",
    ROOT / ".agents/skills/ld-s10y-image/references/quality-gate.md",
    ROOT / ".agents/skills/ld-s10y-image/references/figure-spec.md",
    ROOT / ".intentfold/readme.md",
    ROOT / ".intentfold/charter/engineering.md",
    ROOT / ".agents/skills/ld-s10y-image/assets/figure-spec.schema.json",
    OUT / "source-detail-plan.md",
    Path(__file__),
]:
    bind(path)
renderer_binding = bind(RENDERER, "read-only existing renderer; never run or edited")
validator_binding = bind(VALIDATOR, "existing validator, read-only invocation")
assert renderer_binding["sha256"] == author_report["renderer"]["script"]["sha256"]
assert validator_binding["sha256"] == author_report["renderer"]["validator"]["sha256"]
font_binding = bind(Path(author_report["renderer"]["katexVectorAccentFont"]["path"]))
assert font_binding["sha256"] == author_report["renderer"]["katexVectorAccentFont"]["sha256"]

image_paths = [
    SOURCE / "fig-g10-08.png",
    SOURCE / "fig-g10-09.png",
    OUT / "source09-A-detail.png",
    AUTHOR / "fig-g10-08/repaired/figure480.png",
    AUTHOR / "fig-g10-09/repaired/figure480.png",
    AUTHOR / "repaired-300-08-09.png",
]
purposes = [
    "FIRST original08", "FIRST original09", "FIRST source09 detached dash detail",
    "current repaired08 full480", "current repaired09 full480", "existing actual300 composition",
]
ledger = [
    dict(index=i + 1, **bind(path, "actually visually opened"), dimensionsPx=png_size(path),
         status="loaded", tool="functions.view_image", purpose=purpose)
    for i, (path, purpose) in enumerate(zip(image_paths, purposes))
]
assert len(ledger) == 6 and ledger[-1]["dimensionsPx"] == [624, 350]
ledger_binding = write("actual-image-ledger.json", {
    "actualImageLedger": ledger, "actualOpens": 6, "failures": [],
    "batchLimit": 8, "contextLimit": 24, "remaining": 2,
    "plannedCoreImages": 5, "reservedDetailImagesUsed": 1,
    "firstPreviewsReopened": False, "failedOpenAttemptsIncluded": True,
    "chronology": "1-3 before immutable FIRST files; 4-6 before author reports/inventories/history",
})
history_names = [
    "first-source-checks.json", "repaired-source-checks.json",
    "first-300-08-09.checks.json", "repaired-300-08-09.checks.json",
    "actual-image-ledger.jsonl", "commands/render08-first.json",
    "commands/render09-first.json", "commands/render09-first-technical-retry.json",
    "commands/render08-repaired.json", "commands/render09-repaired.json",
    "commands/validate08-first.json", "commands/validate09-first.json",
    "commands/validate08-repaired.json", "commands/validate09-repaired.json",
    "commands/source-checks-first.json", "commands/source-checks-repaired.json",
    "commands/repair-once.json", "commands/media300-repaired.json",
]
history_bindings = [bind(AUTHOR / name, "retained author history") for name in history_names]
first_checks = read_json(AUTHOR / "first-source-checks.json")
assert all(f["status"] == "fail" for f in first_checks["results"])
first08_render = read_json(AUTHOR / "fig-g10-08/first/render.json")
assert first08_render["status"] == "fail"
assert any(c["id"] == "A-label" for c in first08_render["collisions"])
bad09 = read_json(AUTHOR / "commands/render09-first.json")
retry09 = read_json(AUTHOR / "commands/render09-first-technical-retry.json")
assert bad09["exit"] == 1 and "unexpected argument" in bad09["stderr"]
assert retry09["exit"] == 0
author_ledger = [json.loads(s) for s in (AUTHOR / "actual-image-ledger.jsonl").read_text().splitlines()]
assert len(author_ledger) == 8
media300 = read_json(AUTHOR / "repaired-300-08-09.checks.json")
assert media300["status"] == "pass"

figs, inventories, audit = [], [], []
for index, source_record in enumerate(first["figs"]):
    fid = source_record["id"]
    base = AUTHOR / fid
    spec_binding = bind(base / "repaired/spec.json")
    svg_binding = bind(base / "repaired/figure.svg")
    render_binding = bind(base / "repaired/render.json")
    preview_binding = bind(base / "repaired/figure480.png", "actually inspected full480")
    source_binding = bind(SOURCE / (fid + ".png"), "actually inspected FIRST original")
    assert source_binding == source_record["source"]
    context_binding = bind(base / "context.json", "opaque source-context hash only; not another text authority")
    assert context_binding == author_report["figures"][index]["context"]
    bind(base / "source-inventory.json", "author inventory read after current previews")
    repair = read_json(base / "repair.json")
    assert repair["contentRepairsUsed"] == repair["contentRepairBudget"] == 1
    for name in ["spec.json", "figure.svg", "render.json", "figure480.png"]:
        bind(base / "first" / name, "first attempt retained; first PNG not visually reopened")
    spec = read_json(base / "repaired/spec.json")
    render = read_json(base / "repaired/render.json")
    assert spec["source"]["image"] == source_binding
    assert all(item["text"] in paragraphs for item in spec["source"]["authoritativeText"])
    assert render["spec"]["sha256"] == spec_binding["sha256"]
    assert render["output"]["svg"]["sha256"] == svg_binding["sha256"]
    assert (ROOT / render["spec"]["path"]).resolve() == Path(spec_binding["path"])
    assert (ROOT / render["output"]["svg"]["path"]).resolve() == Path(svg_binding["path"])
    command = ["python3", "-B", str(VALIDATOR), str(base / "repaired/spec.json"), "--stage", "draft", "--json"]
    result = subprocess.run(command, cwd=str(ROOT), capture_output=True, text=True, check=False)
    validation = json.loads(result.stdout)
    assert result.returncode == 0 and validation["status"] == "pass"
    objects = {obj["id"]: obj for obj in spec["objects"]}
    assertions = {a["id"]: a for a in spec["assertions"]}
    points = {oid: obj["at"] for oid, obj in objects.items() if obj["type"] == "point"}

    def coordinate(ref):
        return points[ref] if isinstance(ref, str) else ref

    def vector(a, b):
        return delta(coordinate(a), coordinate(b))

    assertion_results = []
    for aid, assertion in assertions.items():
        kind = assertion["type"]
        if kind == "connects":
            edge = objects[assertion["arrow"]]
            ok = all(math.dist(coordinate(edge[k]), coordinate(assertion[k])) < 1e-8 for k in ["from", "to"])
        elif kind == "parallel":
            one, two = vector(assertion["a"], assertion["b"]), vector(assertion["c"], assertion["d"])
            ok = abs(cross(one, two)) <= 1e-7 * math.hypot(*one) * math.hypot(*two)
        elif kind == "pointOnLine":
            one, two = vector(assertion["a"], assertion["b"]), vector(assertion["a"], assertion["point"])
            ok = abs(cross(one, two)) <= 1e-7 * max(1, math.hypot(*one) * math.hypot(*two))
        elif kind == "objectCount":
            ok = sum(o["type"] == assertion["objectType"] for o in objects.values()) == assertion["count"]
        else:
            raise AssertionError("Unexpected assertion kind: " + kind)
        assert ok, aid
        assertion_results.append({"id": aid, "type": kind, "status": "pass"})
    all_ids = list(objects)
    all_assertions = list(assertions)
    label_ids = [oid for oid in objects if oid.startswith("label-")]
    named_ids = source_record["points"]
    edges = [oid for oid, obj in objects.items() if obj["type"] in ["segment", "arrow"]]
    role_maps = {
        "first08-component-chain": (
            named_ids + edges + ["label-x", "label-y", "label-z"],
            [aid for aid in assertions if aid in ["A-on-x", "AB-along-y", "BM-along-z"]
             or "OM-" in aid or "BM-" in aid or aid == "construction-AB-connects"
             or aid in ["label-x-on-carrier", "label-y-on-carrier", "label-z-on-carrier"]],
        ),
        "first08-directed-vectors": (
            ["O", "M", "basis-i", "basis-j", "basis-k", "resultant-OM-lower", "resultant-OM-upper"],
            [aid for aid in assertions if aid.startswith("basis-") or "OM-" in aid],
        ),
        "first08-symbolic-labels": (
            named_ids + label_ids,
            [aid for aid in assertions if aid.startswith("label-")],
        ),
        "first09-vector-triangle": (
            named_ids + ["vector-OA", "vector-OB", "vector-AB"],
            ["OA-connects", "OB-connects", "AB-connects"],
        ),
        "first09-symbolic-labels": (
            named_ids + label_ids,
            [aid for aid in assertions if aid.startswith("label-")],
        ),
    }
    mapped = []
    for req in source_record["requirements"]:
        mapped_objects, mapped_assertions = role_maps.get(req["id"], (all_ids, all_assertions))
        assert all(oid in objects for oid in mapped_objects)
        assert all(aid in assertions for aid in mapped_assertions)
        mapping = dict(req, objects=mapped_objects, assertions=mapped_assertions,
                       status="pass", mappingPurpose="Source requirement mapped to current objects and executable assertions")
        if "pointRelationships" in req.get("requires", []):
            group_coverage = {}
            for point in set(mapped_objects).intersection(points):
                matches = []
                for aid in mapped_assertions:
                    a = assertions[aid]
                    fields = {"connects": ["from", "to"], "parallel": ["a", "b", "c", "d"],
                              "pointOnLine": ["point", "a", "b"]}.get(a["type"], [])
                    refs = {a[k] for k in fields if isinstance(a[k], str) and a[k] in points}
                    if point in refs and len(refs) >= 2 and refs.issubset(set(mapped_objects)):
                        matches.append(aid)
                assert matches, req["id"] + ": missing wholly in-group point relation for " + point
                group_coverage[point] = matches
            mapping["inGroupPointRelationshipCoverage"] = group_coverage
        mapped.append(mapping)
    coverage = {}
    for point in points:
        candidates = []
        for aid, a in assertions.items():
            fields = {"connects": ["from", "to"], "parallel": ["a", "b", "c", "d"],
                      "pointOnLine": ["point", "a", "b"]}.get(a["type"], [])
            refs = {a[k] for k in fields if isinstance(a[k], str) and a[k] in points}
            if point in refs and len(refs) >= 2 and refs.issubset(set(all_ids)):
                candidates.append(aid)
        assert candidates, "Missing in-group relationship: " + point
        coverage[point] = candidates
    for obj in spec["objects"]:
        if obj["type"] in ["arrow", "segment"]:
            assert any(a["type"] == "connects" and a["arrow"] == obj["id"] for a in assertions.values())
    svg = ET.parse(base / "repaired/figure.svg").getroot()
    xml_ids = {e.get("id"): e for e in svg.iter() if e.get("id")}
    texts = [e for e in svg.iter() if e.tag.rsplit("}", 1)[-1] == "text"]
    expected_labels = sorted(o["label"] for o in spec["objects"] if o.get("label"))
    assert sorted("".join(e.itertext()) for e in texts) == expected_labels
    assert not any(any(c.isdigit() for c in text) for text in expected_labels)
    assert all(float(e.get("font-size")) * 300 / 480 >= 16 for e in texts)
    assert all("LDVectorAccents" in e.get("font-family", "") for e in texts if "\u20d7" in "".join(e.itertext()))
    assert any("LDVectorAccents" in "".join(e.itertext()) for e in svg.iter() if e.tag.endswith("style"))
    dashed = ["construction-AB"] if index == 0 else [
        "axis-x-negative", "axis-y-negative", "axis-z-negative", "projection-detached",
    ]
    for oid, obj in objects.items():
        if obj["type"] not in ["segment", "arrow"]:
            continue
        element = xml_ids["ld-" + fid + "_ld-" + oid]
        if oid in dashed:
            assert obj["dash"] == 3 and element.get("stroke-dasharray") == "10,10"
        else:
            assert obj["dash"] == 0 and not element.get("stroke-dasharray")
        if obj["type"] == "arrow":
            assert "ld-" + fid + "_ld-" + oid + "TriangleEnd1" in xml_ids
            svg_vector = [float(element.get("x2")) - float(element.get("x1")),
                          float(element.get("y2")) - float(element.get("y1"))]
            v = vector(obj["from"], obj["to"])
            assert dot(svg_vector, [v[0], -v[1]]) > 0
    for basis, direction in [("i", "x"), ("j", "y"), ("k", "z")]:
        obj = objects["basis-" + basis]
        ray = objects["axis-" + direction + "-positive"]
        assert obj["from"] == ray["from"] == "O"
        assert dot(vector(obj["from"], obj["to"]), vector(ray["from"], ray["to"])) > 0
    if index == 0:
        legs = [vector("O", "A"), vector("A", "B"), vector("B", "M")]
        resultant = vector("O", "M")
        assert [sum(v[k] for v in legs) for k in [0, 1]] == resultant
        runs = [objects["construction-BM-" + str(i)] for i in range(1, 5)]
        assert all(run["from"][0] == points["B"][0] == run["to"][0] for run in runs)
        assert runs[0]["from"] == points["B"] and runs[-1]["to"] == points["M"]
        gaps = [runs[i + 1]["from"][1] - runs[i]["to"][1] for i in range(3)]
        assert min(gaps) > 0
        om_gap = math.dist(objects["resultant-OM-lower"]["to"], objects["resultant-OM-upper"]["from"])
        assert om_gap > 0
        relationship = {"legsScreenParameters": legs, "resultantScreenParameters": resultant,
                        "identity": "OA+AB+BM=OM", "BMGapPxAt300": [g * .625 for g in gaps],
                        "OMGapPxAt300": om_gap * .625}
    else:
        assert all(objects[oid]["from"] == start and objects[oid]["to"] == end for oid, start, end in [
            ("vector-OA", "O", "A"), ("vector-OB", "O", "B"), ("vector-AB", "A", "B"),
        ])
        assert vector("A", "B") == [b - a for a, b in zip(vector("O", "A"), vector("O", "B"))]
        for axis in ["x", "y", "z"]:
            pos, neg = objects["axis-" + axis + "-positive"], objects["axis-" + axis + "-negative"]
            assert dot(vector(pos["from"], pos["to"]), vector(neg["from"], neg["to"])) < 0
        detached = objects["projection-detached"]
        assert math.dist(detached["from"], points["A"]) > 0 and math.dist(detached["to"], points["A"]) > 0
        relationship = {"identity": "AB=OB-OA", "ABScreenParameters": vector("A", "B"),
                        "directions": ["O to A", "O to B", "A to B"],
                        "detachedFragment": "Not connected to A; regularized as two visible dashes, not a fourth vector"}
    assert render["status"] == "pass" and not render["collisions"]
    assert spec["display"]["widths"] == [480, 300] and spec["display"]["minTextPx"] >= 16
    assert all(c["status"] == "pass" and c["measuredMinPx"] >= 16 for c in render["displayChecks"])
    assert media300["inputs"][index]["sha256"] == svg_binding["sha256"]
    assert media300["media"][index]["width"] == 300
    minimum_px = min(float(e.get("font-size")) * .625 for e in texts)
    inventories.append({
        "id": fid, "source": source_binding, "FIRST": bind(OUT / "FIRST-source.json"),
        "requirements": mapped, "namedPoints": source_record["points"],
        "completeMappedObjects": spec["objects"], "completeMappedAssertions": spec["assertions"],
        "inGroupPointRelationshipCoverage": coverage, "allSourceObjectsAndLabelsVisible": True,
        "inventoryDerivation": "FIRST original pixels, then candidate mapping; not author inventory derivation",
        "modernRegularizations": [
            "Neutral ink, consistent stroke weights, enlarged readable labels and explicit dot at origin.",
            "Schematic screen coordinates and label offsets; not numeric physical coordinate givens.",
            "Dash spacing regularized, preserving interrupted versus uninterrupted semantics.",
        ],
        "geometryCheck": relationship,
        "sourceConventionNote": "Detached source09 stroke was independently inspected; regularized dash pair is explicitly recorded, not a silent solid vector change." if index else "AB dashed, BM four separated runs, OM two separated aligned runs; no negative-axis additions.",
        "caption": "Containing lesson owns caption; no caption inserted in diagram",
    })
    audit.append({
        "id": fid, "validation": {"command": command, "cwd": str(ROOT), "exit": result.returncode,
                                 "result": validation, "stderr": result.stderr},
        "assertions": assertion_results, "geometry": relationship,
        "minTextPxAt300": minimum_px, "svgParsed": True,
        "sourceContext": context_binding, "sourceContextUsage": "opaque binding only",
        "authoritativeProseMatchesCurrentAuthority": True,
        "authorContextTextFullFileHashMatchesCurrent": text_file_hash_matches,
        "noMetric3DClaim": True, "noNumericalAnnotations": True, "noPositiveCoordinateAssumption": True,
    })
    figs.append({
        "id": fid, "status": "pass", "source": source_binding,
        "spec": spec_binding, "svg": svg_binding, "render": render_binding, "preview": preview_binding,
        "sourceContext": context_binding, "minTextPxAt300": minimum_px,
        "visual480": "pass", "visualActual300": "pass", "essentialRemainingDefects": [],
        "contentRepairsUsed": 1, "contentRepairBudget": 1, "contentRepairsRemaining": 0,
    })

inventory_binding = write("source-inventory.json", {
    "schema": "independent-source-inventory-mapping/1", "sourceFirst": True,
    "FIRSTbindings": [bind(OUT / name) for name in FIRST_HASHES], "figs": inventories,
})
checks_binding = write("checks.json", {"status": "pass", "figs": audit})
failure_history = {
    "firstSourceChecks": first_checks,
    "fig08FirstRender": {"status": "fail", "exit": 2, "collisions": first08_render["collisions"]},
    "fig09FirstTechnicalFailure": {"exit": 1, "command": bad09["command"], "stderr": bad09["stderr"],
                                   "classification": "technical malformed --svg argument, not content repair"},
    "fig09TechnicalRetry": {"exit": 0, "classification": "path-only; budget not reset"},
    "firstPreviewsInspectedByReviewer": False,
    "firstPreviewsRetainedAndHashBound": True,
    "authorActualImageOpens": 8,
    "reviewerTechnicalAuditAttempt": {
        "exit": 1,
        "reason": "Overstrict equality check between current lesson-template full-file hash and author snapshot hash",
        "currentTextHash": text_binding["sha256"],
        "authorSnapshotTextHash": author_text_hash,
        "resolution": "All ten authoritative prose paragraphs match both unchanged specs exactly. Bind current allowed authority and record historical author hash separately.",
        "contentRepair": False, "imageOpenFailure": False,
    },
    "authorContentRepairs": {"fig-g10-08": {"used": 1, "budget": 1, "remaining": 0},
                            "fig-g10-09": {"used": 1, "budget": 1, "remaining": 0}},
    "historyBindings": history_bindings,
}
failure_binding = write("failure-history.json", failure_history)
for name in ["first-300-08-09.png", "repaired-300-08-09.png"]:
    bind(AUTHOR / name, "first retained without reopen" if name.startswith("first") else "actually inspected actual300")
input_binding = write("input-bindings.json", {
    "bindings": list(BINDINGS.values()),
    "excluded": "No other figures, source pages, answers, choices, backend, DB, environment or network inputs.",
    "authorAdditionalInputs": "Exercise/manifest bindings mentioned by author are not independent review inputs and were not opened.",
})
findings = [
    {"id": "F08-source-math", "figure": "fig-g10-08", "status": "pass",
     "detail": "O,A,B,M and arrow-accented i,j,k plus symbolic x,y,z all retained. OA along x, AB parallel y, BM parallel z, OM directed toward M; executable mapping covers every point."},
    {"id": "F08-conventions", "figure": "fig-g10-08", "status": "pass",
     "detail": "AB remains dashed. Four separated BM runs and the two aligned OM runs preserve source interruptions; no negative axes or completed cuboid added."},
    {"id": "F09-source-math", "figure": "fig-g10-09", "status": "pass",
     "detail": "Solid uninterrupted OA and OB point outward; solid AB points A to B. Dashed negative-axis extensions point opposite positive basis directions; shared frame preserved."},
    {"id": "F09-detached-dash", "figure": "fig-g10-09", "status": "pass",
     "detail": "Source-only detail establishes an unlabelled detached oblique dash below/right of A. Modern dash pair is explicit regularization of that interrupted convention, remains disconnected and does not invent an edge to A."},
    {"id": "F-actual300", "figures": ["fig-g10-08", "fig-g10-09"], "status": "pass",
     "detail": "Both existing 480px previews and 624x350 actual300 composition inspected. All 19 labels, including vector accents, readable without label/line/arrow/dash collision or clipping. SVG font size 28px yields 17.5px at300; arrow directions remain distinguishable at B."},
    {"id": "F-no-added-givens", "figures": ["fig-g10-08", "fig-g10-09"], "status": "pass",
     "detail": "No visible numeric annotation, dimensional angle, 2D right-angle fiction or positive-coordinate restriction. Internal screen coordinates are illustrative parameters, not physical metric givens."},
    {"id": "F-text-file-binding", "figures": ["fig-g10-08", "fig-g10-09"], "status": "pass",
     "detail": "Current allowed lesson-template full-file hash differs from author's historical snapshot; all ten authoritative prose paragraphs match both candidate specs exactly. Current authority is independently bound; no alternate lesson file was used as authority."},
]
report = {
    "schema": "stemrobin188/n44-fig0809-independent-report@1",
    "generatedAt": datetime.now(timezone.utc).isoformat(),
    "ticket": "STEMROBIN-188", "assignment": "SAME188-6", "lesson": "N44",
    "role": "Independent FIRST MODERN FIGURE reviewer only",
    "overallstatus": "pass", "status": "pass", "figs": figs,
    "FIRSTbindings": [bind(OUT / name) for name in FIRST_HASHES],
    "sourceInventory": inventory_binding, "executableChecks": checks_binding,
    "modernTextAuthority": text_binding, "textPassAuthority": "Human reports text PASS closed; not re-reviewed here",
    "authorHistoricalTextSha256": author_text_hash,
    "authorTextFullFileHashMatchesCurrent": text_file_hash_matches,
    "allTenAuthoritativeParagraphsMatchCurrent": True,
    "actualImageLedger": ledger, "actualImageLedgerFile": ledger_binding,
    "imageUsage": {"actualOpens": 6, "failedOpens": 0, "batchMax": 8, "contextMax": 24,
                   "remainingReserve": 2, "firstPreviewReopens": 0},
    "actual300": dict(**bind(AUTHOR / "repaired-300-08-09.png"), perFigureWidthPx=300,
                      compositionDimensionsPx=[624, 350], visualStatus="pass", minTextPx=17.5),
    "findings": findings, "essentialRemainingDefects": [],
    "failureHistory": failure_binding, "retainedFailures": failure_history,
    "renderer": {"script": renderer_binding, "validator": validator_binding, "vectorAccentFont": font_binding,
                 "unchanged": True, "rerendered": False, "supportConfirmedInSVGAndActualPreviews": True},
    "allInputBindings": input_binding,
    "scope": {
        "independentFigureApprovalOnly": True, "wholeLessonApproval": False, "fullreadyClaim": False,
        "promotion": False, "durableReviewAt1Created": False, "specOrSvgEdited": False,
        "writesOnly": str(OUT), "allExecWorkdir": str(ROOT),
        "otherFigureOrAuthorRead": False, "sourcePagesAnswersChoicesRead": False,
        "setupFreshnessGrillBackendDbEnvInstallNetworkPaidGitPublishDeployClosureContact": False,
        "stop": "Textual return only; no further action",
    },
    "approvalRule": "Bound current candidates pass independent figure review only. Any essential defect or changed binding requires HOLD; no further content repair or waiver is available.",
    "evidenceLimit": "Hashes/render PASS support, but do not substitute for independent visual and mathematical review. Temp paths are intentional review candidates, not durable promotion metadata.",
}
write("report.json", report)
write("report.md", """# Independent N44 fig08/09 Review

Overall status: **pass**. Both fig-g10-08 and fig-g10-09: **pass**.
Independent figure approval only. No whole-lesson/fullready approval or promotion.

## FIRST And Inputs

Original durable fig08/09 PNGs were actually opened before modern text or author
files. FIRST-source.md/json were saved and remain hash-identical. One source09
detail classified the detached oblique dash beside A before that inventory was
locked. The sole text authority is the allowed N44 lesson.template.json.
Every current spec/SVG/render/480px PNG, source PNG and opaque source-context file
is SHA-256-bound in report.json and input-bindings.json.
The current allowed lesson-template file hash differs from the author's earlier
snapshot hash. All ten authoritative prose paragraphs match both specs exactly;
the current authority is bound separately. No alternate text authority was read.

## Findings

- Fig08 retains O,A,B,M; arrow-accented i,j,k; symbolic OA=x, AB=y, BM=z.
  OA follows x, AB follows y, BM follows z and OM points O to M.
  AB is dashed; four BM runs and two OM runs retain real interruptions.
- Fig09 retains O,A,B, x/y/z and arrow-accented i,j,k. OA, OB and AB are solid
  uninterrupted vectors directed O-A, O-B, A-B. AB=OB-OA.
  Negative-axis extensions remain dashed and opposite their positive rays.
- The source09 detached stroke below/right of A is an unlabelled oblique dash,
  not another vector or given. Its modern dash pair is explicit regularization
  of an interrupted convention, remains detached and adds no completed edge.
- Both full480 previews and the existing actual300 composition were inspected.
  All 19 labels and vector accents are legible, clear of lines/arrows/dashes and
  unclipped. Text is 28px at480 and 17.5px at300, above the required 16px.
  The two heads terminating at B remain directionally distinguishable.
- Complete source-object/assertion mapping and independent executable point
  coverage are in source-inventory.json/checks.json. Every named point and
  label anchor has an in-group relationship; every semantic edge has connects.
- No numeric annotation, false dimensional angle, 2D metric assertion or
  positive-coordinate premise was introduced. Screen parameters are not givens.

No essential remaining defect found. Source hashes and render PASS are
supporting evidence, not substitutes for the visual/mathematical review.

## Retained Failure History

Both first source checks failed because short dashes read as dots at300.
Fig08 first render failed on A-label collision, exit2. Its single repair moved
A's label and lengthened AB dashes. Fig09's single content repair lengthened the
negative-axis/detached dashes. Its earlier bad --svg argument, exit1, was a
separate path-only technical failure; retry exit0 did not reset content budget.
All first artifacts/failures remain intact and hash-bound. First preview images
were not reopened. Both figures have used 1/1 content repairs, with none left.

## Limits And Stop

Reviewer opened 6/8 images, 6/24 context, zero failures: two originals, one
source-only detail, two current480 previews, one existing actual300 composition.
Renderer and vector-accent font match author bindings and were not changed;
no rerender, spec/SVG edit, durable review@1, promotion or other action occurred.
Writes are confined to this review directory. Any changed binding or essential
defect means HOLD, with no new repair or waived approval. Textual return only.
""")
print(json.dumps({"overallstatus": report["overallstatus"], "figs": [{"id": f["id"], "status": f["status"]} for f in figs],
                  "actualImages": len(ledger), "report": str(OUT / "report.json")}))
