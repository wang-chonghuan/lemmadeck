#!/usr/bin/env python3
"""Owned, offline author artifacts; the repository renderer owns all drawing."""

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
from collections import Counter
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n44-fig0607-author"
SKILL = ROOT / ".agents/skills/ld-s10y-image/scripts"
TEMPLATES = ROOT / (
    ".intentfold/tickets/STEMROBIN-188/tmp/g10-n44/work/adapt/9-10g/"
    "modern-us-neutral/lessons/geo910-c2-s1-n44"
)
RAW = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c2-s1-n44"
FIGURES = ("fig-g10-06", "fig-g10-07")


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write(path, data):
    path.absolute().relative_to(OWN)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")


def artifact(path):
    return {"path": str(path), "sha256": digest(path)}


def run(command, receipt_id):
    receipts_path = OWN / "commands.json"
    receipts = read(receipts_path) if receipts_path.exists() else []
    if any(item["id"] == receipt_id for item in receipts):
        raise RuntimeError(f"Already executed {receipt_id}; preserve its first result")
    result = subprocess.run(command, cwd=ROOT, text=True, capture_output=True)
    out = OWN / "diagnostics" / f"{receipt_id}.stdout.txt"
    err = OWN / "diagnostics" / f"{receipt_id}.stderr.txt"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(result.stdout, encoding="utf-8")
    err.write_text(result.stderr, encoding="utf-8")
    receipts.append({
        "id": receipt_id,
        "command": command,
        "workdir": str(ROOT),
        "exit": result.returncode,
        "stdout": artifact(out),
        "stderr": artifact(err),
    })
    write(receipts_path, receipts)
    print(json.dumps(receipts[-1], indent=2))
    return result.returncode


def prepare():
    context_root = OWN / "context-root"
    edition_lesson = context_root / (
        "9-10g/editions/modern-us-neutral/lessons/geo910-c2-s1-n44"
    )
    if edition_lesson.exists():
        raise RuntimeError("Private context already exists; no overwrite")
    edition_lesson.mkdir(parents=True)
    inputs = {}
    for stem in ("lesson", "exercises"):
        origin = TEMPLATES / f"{stem}.template.json"
        copied = edition_lesson / f"{stem}.json"
        shutil.copyfile(origin, copied)
        inputs[stem] = {"origin": str(origin), "capturedCopy": artifact(copied)}
    inputs["figures"] = artifact(TEMPLATES / "figures.template.json")
    raw_lesson = read(RAW / "lesson.json")
    raw_exercises = read(RAW / "exercises.json")
    write(OWN / "binding.json", {
        "lesson": raw_lesson["id"],
        "rawInputs": [artifact(RAW / name) for name in ("lesson.md", "lesson.json", "exercises.json")],
        "figures": [f for f in raw_lesson["figures"] if f["id"] in FIGURES],
        "proseBindings": [b for b in raw_lesson["prose"] if b.get("id") in FIGURES],
        "exerciseBindings": [
            {"number": e["number"], "figure_refs": e.get("figure_refs", []),
             "figures": [f["id"] for f in e.get("figures", [])]}
            for e in raw_exercises["exercises"]
        ],
        "rawUse": "Identity and figure/exercise binding only, not drawing content.",
    })
    inventory = read(OWN / "source-inventory.json")
    sources = context_root / "9-10g/figures"
    sources.mkdir(parents=True)
    for figure in FIGURES:
        source = Path(inventory["figures"][figure]["source"]["path"])
        assert digest(source) == inventory["figures"][figure]["source"]["sha256"]
        (sources / f"{figure}.png").symlink_to(source)
        code = run([
            sys.executable, str(SKILL / "build_context.py"),
            "--book", "9-10g", "--edition", "modern-us-neutral",
            "--figure", figure, "--root", str(context_root),
            "--output", str(OWN / "contexts" / f"{figure}.context.json"),
        ], f"{figure}-build-context")
        if code:
            return code
    write(OWN / "provenance.json", {
        "inputs": inputs,
        "inventoryBeforeDrawing": artifact(OWN / "source-inventory.json"),
        "contextRoot": str(context_root),
        "originals": [inventory["figures"][f]["source"] for f in FIGURES],
        "noPackageDuplication": "Only lesson/exercise template bytes copied; two durable PNG symlinks.",
        "prerequisites": {
            "basis": "Direct human instruction, not independently reopened or reviewed.",
            "source157-159": "Affected review PASS collected/closed.",
            "assembly": "Isolated N44, seven exercises and four figures, PASS.",
            "sourcevectorize": "PASS.",
            "modernApproval": "None of these prerequisites grants modern figure approval.",
        },
    })
    return 0


def point(name, at, visible=True, side="NE", gap=18):
    return {
        "id": f"point-{name}", "type": "point", "at": at,
        "visible": visible, "label": name,
        "size": 3.2, "strokeWidth": 1.3, "stroke": "ink", "fill": "ink",
        "fontSize": 28, "fontWeight": 400,
        "labelPlacement": {"position": side, "gap": gap},
    }


def text(name, value, at, side="CENTER", gap=0):
    return {
        "id": f"label-{name}", "type": "text", "at": at, "text": value,
        "fontSize": 28, "fontWeight": 400,
        "labelPlacement": {"position": side, "gap": gap},
    }


def edge(name, end, arrow=True, dash=0, width=4.5):
    return {
        "id": name, "type": "arrow" if arrow else "segment",
        "from": "point-O", "to": end,
        "stroke": "ink", "strokeWidth": width, "dash": dash,
    }


def connect(name, obj):
    return {
        "id": name, "type": "connects", "arrow": obj["id"],
        "from": obj["from"], "to": obj["to"],
    }


def draft():
    inventory = read(OWN / "source-inventory.json")
    for figure in FIGURES:
        first = OWN / "first" / figure / f"{figure}.spec.json"
        if first.exists():
            raise RuntimeError(f"First spec already exists: {figure}")
        context = read(OWN / "contexts" / f"{figure}.context.json")
        authoritative = []
        for lesson in context["lessons"]:
            for prose in lesson["prose"]:
                for value in prose["nearbyText"]:
                    item = {"lesson": lesson["lesson"], "text": value}
                    if item not in authoritative:
                        authoritative.append(item)
            for exercise in lesson["exercises"]:
                authoritative.append({
                    "lesson": lesson["lesson"], "exercise": exercise["exercise"],
                    "text": exercise["text"],
                })
        source = inventory["figures"][figure]
        if figure == "fig-g10-06":
            points = [
                point("O", [125, 115], False, "W", 20),
                point("M", [420, 318], True, "N", 23),
            ]
            edges = [
                edge("vector-i", [40, 30]),
                edge("vector-j", [375, 115]),
                edge("vector-k", [125, 365]),
                edge("vector-OM", "point-M"),
            ]
            labels = [
                text("i", "i\u20d7", [78, 58], "E", 20),
                text("j", "j\u20d7", [306, 115], "S", 28),
                text("k", "k\u20d7", [125, 251], "W", 23),
            ]
            assertions = [
                connect(f"connect-{name}", obj)
                for name, obj in zip(("i", "j", "k", "OM"), edges)
            ]
            assertions.append({
                "id": "count-vector-labels", "type": "objectCount",
                "objectType": "text", "count": 3,
            })
            height = 400
        else:
            points = [
                point("O", [160, 190], False, "SE", 17),
                point("A", [78, 108], True, "NW", 19),
                point("B", [376, 190], True, "N", 22),
                point("C", [160, 406], True, "E", 22),
                point("M", [408, 344], True, "E", 15),
            ]
            axes = [
                edge("axis-x-positive", [26, 56], False, width=3.2),
                edge("axis-y-positive", [440, 190], False, width=3.2),
                edge("axis-z-positive", [160, 444], False, width=3.2),
                edge("axis-x-negative", [270, 300], False, 2, 3.2),
                edge("axis-y-negative", [26, 190], False, 2, 3.2),
                edge("axis-z-negative", [160, 26], False, 2, 3.2),
            ]
            vectors = [
                edge("vector-i", "point-A", width=5),
                edge("vector-j", "point-B", width=5),
                edge("vector-k", "point-C", width=5),
                edge("vector-OM", "point-M", width=5),
            ]
            edges = axes + vectors
            labels = [
                text("i", "i\u20d7", [115, 112]),
                text("j", "j\u20d7", [333, 157]),
                text("k", "k\u20d7", [127, 390]),
                text("x", "x", [51, 64]),
                text("y", "y", [430, 160]),
                text("z", "z", [138, 435]),
            ]
            assertions = [
                connect(f"connect-{axis['id'][5:]}", axis) for axis in axes
            ] + [
                connect(f"connect-{name}", obj)
                for name, obj in zip(("i", "j", "k", "OM"), vectors)
            ]
            for name, endpoint, negative in (
                ("x", "A", [270, 300]),
                ("y", "B", [26, 190]),
                ("z", "C", [160, 26]),
            ):
                axis_end = next(o["to"] for o in axes if o["id"] == f"axis-{name}-positive")
                assertions.extend([
                    {"id": f"on-{name}", "type": "pointOnLine",
                     "point": f"point-{endpoint}", "a": "point-O", "b": axis_end},
                    {"id": f"{name}-continuation", "type": "collinear",
                     "a": axis_end, "b": "point-O", "c": negative},
                ])
            assertions.append({
                "id": "count-free-labels", "type": "objectCount",
                "objectType": "text", "count": 6,
            })
            height = 460
        native_inventory = [
            {k: fact[k] for k in ("id", "description", "objects", "assertions", "requires") if k in fact}
            for fact in source["facts"]
        ]
        write(first, {
            "schema": "ld-s10y-image/figure-spec@2", "id": figure,
            "mode": "deterministic",
            "description": (
                "Shared schematic projection of the spatial coordinate basis and OM. "
                "Preserve source vector directions, labels, dots and any axis continuations. "
                "No projected angle, vector length or canvas coordinate is a measured spatial value."
            ),
            "source": {"image": source["source"], "authoritativeText": authoritative,
                       "inventory": native_inventory},
            "canvas": {"width": 480, "height": height, "boundingBox": [0, height, 480, 0],
                       "background": "paper", "keepAspectRatio": True},
            "display": {"layout": "inline", "purpose": "instructional",
                        "maxWidthPx": 480, "minTextPx": 16, "widths": [480, 300]},
            "objects": points + edges + labels,
            "assertions": assertions,
            "layout": {"minLabelGap": 3},
        })
        print(first)
    return 0


def source_check(figure, snapshot):
    inventory = read(OWN / "source-inventory.json")["figures"][figure]
    base = OWN / snapshot / figure
    spec = read(base / f"{figure}.spec.json")
    objects = {obj["id"]: obj for obj in spec["objects"]}
    checks = []

    def check(identity, passed, detail):
        checks.append({"id": identity, "pass": bool(passed), "detail": detail})

    check("durable-source", spec["source"]["image"] == inventory["source"],
          "FigureSpec source is the actual durable PNG, not the context symlink.")
    check("source-sha256", digest(Path(inventory["source"]["path"])) == inventory["source"]["sha256"],
          inventory["source"])
    changes = []
    if snapshot == "repaired":
        plan = read(OWN / "repair-plan.json")["figures"][figure]
        changes = plan["changes"]
        expected_spec = read(OWN / "first" / figure / f"{figure}.spec.json")
        expected_objects = {o["id"]: o for o in expected_spec["objects"]}
        for change in changes:
            value = expected_objects[change["object"]]
            for field in change["fields"][:-1]:
                value = value[field]
            field = change["fields"][-1]
            assert value[field] == change["from"]
            value[field] = change["to"]
        check("only-planned-smallest-units-changed", spec == expected_spec,
              {"plan": artifact(OWN / "repair-plan.json"), "changes": changes})
    for fact in inventory["facts"]:
        for contract in fact["contracts"]:
            obj = objects.get(contract["object"], {})
            expected = dict(contract["expected"])
            for change in changes:
                if change["object"] == contract["object"] and change["fields"] == ["dash"]:
                    assert expected.get("dash") == change["from"]
                    expected["dash"] = change["to"]
            check(contract["id"], all(obj.get(k) == v for k, v in expected.items()),
                  {"originalPixelContract": contract, "currentStyleExpected": expected,
                   "dashRegularizationExplicitInRepairPlan": expected != contract["expected"]})
    labels = [obj.get("label") or obj.get("text") for obj in objects.values()
              if obj.get("label") or obj.get("text")]
    check("all-labels-exact", Counter(labels) == Counter(inventory["expectedVisibleLabels"]), labels)
    for kind, count in inventory["expectedCounts"].items():
        check(f"exact-count-{kind}", sum(o["type"] == kind for o in objects.values()) == count, count)
    check("no-unmapped-objects",
          set(objects) == {oid for fact in inventory["facts"] for oid in fact["objects"]},
          "Every drawing object is individually source-mapped.")
    check("no-added-values-or-angle-marks",
          all(o["type"] in inventory["expectedCounts"] for o in objects.values()),
          "Only inventoried points, arrows, segments and exact labels are allowed.")
    for identity, signs in inventory["schematicDirections"].items():
        obj = objects[identity]
        start = objects[obj["from"]]["at"]
        end = objects[obj["to"]]["at"] if isinstance(obj["to"], str) else obj["to"]
        actual = [(v > 0) - (v < 0) for v in (end[0] - start[0], end[1] - start[1])]
        check(f"{identity}-schematic-direction", actual == signs,
              {"expectedSigns": signs, "actualSigns": actual, "notSpatialMeasurements": True})
    if figure == "fig-g10-07":
        for axis, name in (("x", "A"), ("y", "B"), ("z", "C")):
            origin = objects["point-O"]["at"]
            endpoint = objects[f"point-{name}"]["at"]
            outer = objects[f"axis-{axis}-positive"]["to"]
            basis_length_sq = sum((endpoint[i] - origin[i]) ** 2 for i in range(2))
            along = sum((outer[i] - origin[i]) * (endpoint[i] - origin[i]) for i in range(2))
            check(f"{axis}-continues-beyond-basis", along > basis_length_sq,
                  "Axis extends past its named source point; not a physical length assertion.")
        origin = objects["point-O"]["at"]
        m = objects["point-M"]["at"]
        negative = objects["axis-x-negative"]["to"]
        cross = ((negative[0] - origin[0]) * (m[1] - origin[1])
                 - (negative[1] - origin[1]) * (m[0] - origin[0]))
        check("OM-below-negative-x-projection", cross < 0,
              "Source screen ordering only, not a 3D angle.")
    report = {"figure": figure, "snapshot": snapshot,
              "inventory": artifact(OWN / "source-inventory.json"),
              "spec": artifact(base / f"{figure}.spec.json"),
              "checks": checks, "status": "pass" if all(c["pass"] for c in checks) else "fail"}
    write(base / f"{figure}.source-checks.json", report)
    print(json.dumps(report, indent=2))
    return 0 if report["status"] == "pass" else 2


def validate(figure, snapshot):
    if source_check(figure, snapshot):
        return 2
    base = OWN / snapshot / figure
    return run([
        sys.executable, str(SKILL / "validate_spec.py"),
        str(base / f"{figure}.spec.json"), "--stage", "draft", "--json",
    ], f"{figure}-{snapshot}-validate")


def render(figure, snapshot):
    base = OWN / snapshot / figure
    receipts = read(OWN / "commands.json")
    validation = next(r for r in receipts if r["id"] == f"{figure}-{snapshot}-validate")
    if validation["exit"] != 0:
        raise RuntimeError("Stopped dependent render after validator failure")
    return run([
        "node", str(SKILL / "render_spec.mjs"),
        "--spec", str(base / f"{figure}.spec.json"),
        "--svg", str(base / f"{figure}.svg"),
        "--png", str(base / f"{figure}.png"),
        "--report", str(base / f"{figure}.render.json"),
    ], f"{figure}-{snapshot}-render")


def media(snapshot):
    return run([
        "node", str(OWN / "compose-media.mjs"), snapshot, snapshot,
    ], f"{snapshot}-media-300")


def start_repair():
    plan = read(OWN / "repair-plan.json")
    snapshots = {}
    for figure in FIGURES:
        base = OWN / "first" / figure
        target = OWN / "repaired" / figure
        if target.exists():
            raise RuntimeError("Content repair already consumed; never reset it")
        snapshots[figure] = {
            "first": [artifact(base / f"{figure}{suffix}") for suffix in (
                ".spec.json", ".svg", ".png", ".render.json", ".source-checks.json"
            )],
            "counter": plan["figures"][figure]["contentRepairCounter"],
            "firstRenderStatus": read(base / f"{figure}.render.json")["status"],
        }
        target.mkdir(parents=True)
        shutil.copyfile(base / f"{figure}.spec.json", target / f"{figure}.spec.json")
    write(OWN / "first-snapshots.json", {
        "figures": snapshots,
        "firstMedia": [artifact(OWN / name) for name in (
            "first-media-300.png", "first-media-300.checks.json"
        )],
        "repairPlan": artifact(OWN / "repair-plan.json"),
        "counterNeverReset": True,
    })
    return 0


def finish_report():
    if (OWN / "report.json").exists() or (OWN / "report.md").exists():
        raise RuntimeError("Final author report already exists; no overwrite")
    inventory = read(OWN / "source-inventory.json")
    provenance = read(OWN / "provenance.json")
    first = read(OWN / "first-snapshots.json")
    ledger = read(OWN / "image-ledger.json")
    observations = read(OWN / "author-observations.json")
    commands = read(OWN / "commands.json")
    loaded = [item for item in ledger["loads"] if item["status"] == "loaded"]
    failed = [item for item in ledger["loads"] if item["status"] == "failed"]
    assert len(loaded) == 8 and len(failed) == 1
    assert all(digest(Path(item["path"])) == item["sha256"] for item in loaded)
    assert digest(OWN / "source-inventory.json") == provenance["inventoryBeforeDrawing"]["sha256"]
    assert all(item["workdir"] == str(ROOT) for item in commands)
    integrity = []
    for bundle in first["figures"].values():
        for item in bundle["first"]:
            integrity.append({**item, "unchanged": digest(Path(item["path"])) == item["sha256"]})
    for item in first["firstMedia"]:
        integrity.append({**item, "unchanged": digest(Path(item["path"])) == item["sha256"]})
    assert all(item["unchanged"] for item in integrity)
    write(OWN / "retained-first-integrity.json", {"status": "pass", "artifacts": integrity})
    final_media = read(OWN / "repaired-media-300.checks.json")
    assert final_media["status"] == "pass"
    figures = {}
    for figure in FIGURES:
        base = OWN / "repaired" / figure
        render_report = read(base / f"{figure}.render.json")
        source_checks = read(base / f"{figure}.source-checks.json")
        assert render_report["status"] == source_checks["status"] == "pass"
        assert render_report["collisions"] == []
        assert observations["figures"][figure]["candidateStatus"] == "PASS_CANDIDATE"
        files = {kind: artifact(base / f"{figure}{suffix}") for kind, suffix in (
            ("spec", ".spec.json"), ("svg", ".svg"), ("png480", ".png"),
            ("renderChecks", ".render.json"), ("sourceChecks", ".source-checks.json")
        )}
        assert files["spec"]["sha256"] == render_report["spec"]["sha256"]
        assert files["svg"]["sha256"] == render_report["output"]["svg"]["sha256"]
        figures[figure] = {
            "candidateStatus": "PASS_CANDIDATE",
            "approvalStatus": "HOLD",
            "source": inventory["figures"][figure]["source"],
            "sourceInventory": inventory["figures"][figure],
            "context": artifact(OWN / "contexts" / f"{figure}.context.json"),
            "final": files,
            "first": first["figures"][figure],
            "firstFailures": read(OWN / "first" / figure / f"{figure}.render.json")["collisions"],
            "repairCounter": 1, "repairLimit": 1, "repairRemaining": 0,
            "repair": read(OWN / "repair-plan.json")["figures"][figure],
            "display": read(base / f"{figure}.spec.json")["display"],
            "renderDisplayChecks": render_report["displayChecks"],
            "actual300Media": next(check for check in final_media["checks"] if check["figure"] == figure),
            "authorObservations": observations["figures"][figure],
        }
    report = {
        "schema": "stemrobin-188/offline-modern-figure-author-report@1",
        "assignment": "SAME188-6/STEMROBIN-188, N44, fig-g10-06 and fig-g10-07 only",
        "date": "2026-11-20",
        "role": "AUTHOR ONLY",
        "candidateStatus": "PASS_CANDIDATE",
        "approvalStatus": "HOLD",
        "ownedDirectory": str(OWN),
        "workdirEveryExec": str(ROOT),
        "figures": figures,
        "sourceInventoryBeforeDrawing": artifact(OWN / "source-inventory.json"),
        "inputProvenance": provenance,
        "rawBinding": artifact(OWN / "binding.json"),
        "actualImageLedger": ledger,
        "imageLedgerFile": artifact(OWN / "image-ledger.json"),
        "firstSnapshotManifest": artifact(OWN / "first-snapshots.json"),
        "firstIntegrity": artifact(OWN / "retained-first-integrity.json"),
        "repairPlan": artifact(OWN / "repair-plan.json"),
        "firstMedia": first["firstMedia"],
        "finalMedia": [artifact(OWN / name) for name in (
            "repaired-media-300.png", "repaired-media-300.checks.json"
        )],
        "commands": commands,
        "commandReceipts": artifact(OWN / "commands.json"),
        "validatorCallAccounting": (
            "One standalone validate_spec and one render_spec per first figure. "
            "After one consumed content repair each, one affected standalone validation "
            "and one affected render per figure. Each render inherently invokes the "
            "unmodified renderer's internal draft validator; no duplicate author render."
        ),
        "authorObservations": artifact(OWN / "author-observations.json"),
        "holds": observations["approvalHold"],
        "boundaries": {
            "independentReviewPerformed": False,
            "reviewAt1Written": False,
            "promoted": False,
            "coreOrRendererEdits": False,
            "lessonManifestEdits": False,
            "otherAuthorOutputsOpened": False,
            "sourcePagesOpened": False,
            "answersOrChoicesUsed": False,
            "networkPaidGitBackendDBPublishDeployClosureOrAgentContact": False,
            "candidatePathsAreTemporary": True,
        },
        "technicalFailures": failed,
        "stoppedAt": "Author-only final report; no independent approval or dependent promotion.",
    }
    write(OWN / "report.json", report)
    lines = [
        "# N44 Figures 6 and 7: Offline Author Report",
        "",
        "SAME188-6/STEMROBIN-188, 2026-11-20. **AUTHOR ONLY**.",
        "**PASS candidates** for both figures. **HOLD** independent modern review and promotion.",
        "",
        "All authored files are below `" + str(OWN) + "`.",
        "Every exec used `" + str(ROOT) + "`.",
        "",
        "## Final Artifacts",
        "",
        "| Figure | Artifact | Absolute Path | SHA-256 |",
        "| --- | --- | --- | --- |",
    ]
    for figure, payload in figures.items():
        for kind, item in payload["final"].items():
            lines.append(f"| {figure} | {kind} | `{item['path']}` | `{item['sha256']}` |")
    lines += [
        "",
        "## Source and Executable Inventory",
        "",
        "Inventory was written from the two original PNG opens before any drawing. Every source point, vector, axis, dashed continuation and label is individually mapped to native assertion IDs and exact executable object/label contracts. The shared-frame groups require pointRelationships.",
        "Figure 6: O junction, M dot, four arrows, five labels; no continuation axes.",
        "Figure 7: O junction, A/B/C/M dots, four vector arrows, three solid positive axes, three dashed unarrowed negative continuations, eleven labels. Positive axes extend beyond A/B/C without invented terminal arrows.",
        "All numeric canvas coordinates are layout-only. No inferred 3D angle/value, tick, grid, right-angle mark, coordinate number or answer annotation was added.",
        "The private context root contains only copied candidate lesson.json/exercises.json and two symlinks to the durable originals. Source.image uses the actual original PNG path, not those symlinks.",
    ]
    for figure, payload in figures.items():
        lines.append(f"- {figure} source: `{payload['source']['path']}`; SHA-256 `{payload['source']['sha256']}`.")
    lines += [
        "",
        "## First Results and One Repair",
        "",
        "Both FIRST spec/SVG/PNG/render reports, source checks and all stdout/stderr receipts are retained. Hash checks confirm the first snapshots are unchanged.",
        "Figure 6 FIRST render exit 2: M label clearance. One repair: M gap 23 -> 32. Final validator/render exit 0; no collisions.",
        "Figure 7 FIRST render exit 2: O/B/x clearance. One repair: O/B gaps -> 32, x text anchor [51,64] -> [53,45], existing negative-ray dash style 2 -> 3 (5,5 -> 10,10). Final validator/render exit 0; no collisions.",
        "Counters: figure 6 = 1/1; figure 7 = 1/1; no further content repair remains. Executable comparison proves only these smallest planned fields changed.",
        "",
        "## Commands and Exits",
        "",
        "commands.json and report.json contain the exact argv, workdir, exits and hashed stdout/stderr for every build_context, validator, renderer and media command.",
        "| Command Receipt | Exit |",
        "| --- | --- |",
    ]
    for command in commands:
        lines.append(f"| `{command['id']}` | {command['exit']} |")
    lines += [
        "Each figure had one first standalone validation/render and one affected validation/render after its sole repair. The existing renderer also performs its own internal draft validation; it was not modified.",
        "",
        "## Actual Image and Visual Evidence",
        "",
        "8 actual image payloads in this batch/context: 2 originals, 2 first 480 px previews, 1 first two-figure 300 px composition, 2 repaired 480 px previews, 1 repaired two-figure 300 px composition. Batch allowance exhausted; context total 8/24.",
        "9 load attempts include one failed wrong-path attempt with no image payload. The full failed path and diagnosis remain in image-ledger.json and report.json; corrected-path recovery did not reset or credit any budget.",
        "Final visual inspection at both 480 and actual 300 px: intact, nonblank, legible source labels/vector accents, clear points/arrowheads, distinct dashes and no visual collisions. Measured label size is 28 px at 480 and 17.5 px at 300 for both figures.",
        "",
        "## HOLD and Boundaries",
        "",
        "These are temporary author candidates, not approved modern outputs or durable published metadata. No independent review claim and no review@1 file.",
        "Source157-159 affected review/closed PASS, isolated N44 7-exercise/4-figure assembly PASS and sourcevectorize PASS are prerequisites supplied by the human, not modern approval.",
        "No core/renderer/manifest edits, promotion, answers/choices, other authors' outputs, source pages, setup/freshness/Grill, network/paid, backend/DB/env/install, Git/publish/deploy/closure or agent contact.",
        "Stopped at this author-only report. Detailed paths, hashes, inventory, image ledger, commands, first/repaired snapshots and observations are in report.json.",
    ]
    (OWN / "report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({
        "status": "PASS_CANDIDATE", "approval": "HOLD",
        "figures": {figure: {"final": value["final"], "repairCounter": value["repairCounter"]}
                    for figure, value in figures.items()},
        "actualImageLoads": len(loaded), "failedImageAttempts": len(failed),
        "reports": [artifact(OWN / "report.md"), artifact(OWN / "report.json")],
    }, indent=2))
    return 0


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", choices=("prepare", "draft", "validate", "render", "media", "start-repair", "report"))
    parser.add_argument("--figure", choices=FIGURES)
    parser.add_argument("--snapshot", choices=("first", "repaired"), default="first")
    args = parser.parse_args()
    assert Path.cwd() == ROOT
    if args.stage == "prepare":
        return prepare()
    if args.stage == "draft":
        return draft()
    if args.stage == "media":
        return media(args.snapshot)
    if args.stage == "start-repair":
        return start_repair()
    if args.stage == "report":
        return finish_report()
    if not args.figure:
        parser.error("--figure required")
    return globals()[args.stage](args.figure, args.snapshot)


if __name__ == "__main__":
    raise SystemExit(main())
