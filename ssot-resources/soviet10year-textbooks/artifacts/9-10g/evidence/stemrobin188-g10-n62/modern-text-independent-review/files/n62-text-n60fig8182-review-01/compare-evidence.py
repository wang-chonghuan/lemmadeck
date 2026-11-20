import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TMP = ROOT.parent
main = json.loads((TMP / "n62-text-n60fig8182-review-inputs-01/manifest.json").read_text())
tm = json.loads(Path(main["modernText"]["path"]).read_text())
before = json.loads((ROOT / "input-bindings-before.json").read_text())
assert before["allExpectedMatch"]

def read(path):
    return json.loads(Path(path).read_text())

def ref(path):
    p = Path(path)
    return {"path": str(p), "sha256": hashlib.sha256(p.read_bytes()).hexdigest(),
            "bytes": p.stat().st_size}

def write(name, data):
    with (ROOT / name).open("x") as out:
        json.dump(data, out, indent=2, ensure_ascii=True)
        out.write("\n")

math_pattern = re.compile(r"\$(?:[^$]|\n)*?\$")

def math(text):
    return math_pattern.findall(text)

def outside(text):
    return math_pattern.sub("", text)

def numbers(text):
    return re.findall(r"\d+(?:\.\d+)?", text)

def figrefs(text):
    return re.findall("\u56fe\\s*(\\d+)", text)

def subparts(text):
    return [m.group(0) for m in re.finditer(r"(?<!\d)[12]\u00b0?\)", outside(text))]

def comparison(raw, candidate, target, expected_changes):
    a, b = raw["text"], candidate["text"]
    fields = (["kind", "id", "label", "printed_page", "source_refs"]
              if target.startswith("prose") else
              ["number", "source_number", "group", "group_id", "pages", "figure_refs", "figures"])
    checks = {
        "sourceTextExactlyRaw": candidate["source_text"] == a,
        "identityFieldsExact": all(raw.get(k) == candidate.get(k) for k in fields),
        "orderedMathSpansExact": math(a) == math(b),
        "orderedNumbersAllExact": numbers(a) == numbers(b),
        "orderedNumbersOutsideMathExact": numbers(outside(a)) == numbers(outside(b)),
        "orderedFigureReferenceNumbersExact": figrefs(a) == figrefs(b),
        "orderedSubpartMarkersExact": subparts(a) == subparts(b),
        "declaredChangeKindsExact": candidate["changes"] == expected_changes,
        "numericChangesEmpty": candidate["numeric_changes"] == [],
        "historicalEntitiesEmpty": candidate["historical_entities"] == [],
    }
    if target.startswith("exercise"):
        checks["linesExactlyTextSplit"] = candidate["lines"] == b.split("\n")
    return {
        "target": target, "status": "PASS" if all(checks.values()) else "FAIL",
        "checks": checks, "sourceText": a, "candidateText": b,
        "orderedMathSpans": {"raw": math(a), "candidate": math(b)},
        "orderedNumbers": {"raw": numbers(a), "candidate": numbers(b)},
        "orderedOutsideMathNumbers": {"raw": numbers(outside(a)), "candidate": numbers(outside(b))},
        "figureReferences": {"raw": figrefs(a), "candidate": figrefs(b)},
        "subparts": {"raw": subparts(a), "candidate": subparts(b)},
        "identity": {k: candidate.get(k) for k in fields},
        "changes": candidate["changes"], "numeric_changes": candidate["numeric_changes"],
        "historical_entities": candidate["historical_entities"],
        "units": "No explicit physical unit in either text; all mathematical spans remain exact. No unit introduced.",
    }

lesson_path, exercises_path = [c["path"] for c in tm["candidates"]]
lesson, exercises = read(lesson_path), read(exercises_path)
raw_lesson, raw_ex = read(tm["rawLesson"]["path"]), read(tm["rawExercises"]["path"])
prose_changes = [
    ["wording", "layout"], ["layout"], ["wording", "layout"],
    [], [], [], [], ["wording", "layout"], ["wording", "layout"],
    ["wording", "layout"], [], [], ["wording", "layout"],
]
objects = [comparison(a, b, f"prose[{i}]", prose_changes[i])
           for i, (a, b) in enumerate(zip(raw_lesson["prose"], lesson["prose"]))]
objects += [comparison(a, b, f"exercise[{b['number']}]", ["layout"])
            for a, b in zip(raw_ex["exercises"], exercises["exercises"])]

flow_path = Path(tm["savedFlow"]["path"])
flow = read(flow_path)
stdout_path = flow_path.parent / "stdout.txt"
stdout = stdout_path.read_text()
printed_boundaries = []
printed_paragraphs = []
current = None
for line in stdout.splitlines():
    if line.startswith("    break: "):
        printed_boundaries.append(json.loads(line.removeprefix("    break: ")))
    elif re.match(r"^\[\d+\] ", line):
        if current is not None:
            printed_paragraphs.append(current)
        match = re.match(r"^\[(\d+)\] (.*)$", line)
        current = {"index": int(match.group(1)), "text": match.group(2)}
    else:
        assert current is not None
        current["text"] += "\n" + line
if current is not None:
    printed_paragraphs.append(current)
first = read(Path(lesson_path).parent / "FIRST/lesson.template.json")
switches = []
for i, boundary in enumerate(lesson["section_breaks"]):
    switches.append({
        "status": "PASS" if (
            boundary == flow["selected_concept_switches"][i]["boundary"]
            and boundary in flow["boundaries"]
            and boundary in printed_boundaries) else "FAIL",
        "exactBoundary": boundary,
        "savedBoundaryOrdinal": flow["boundaries"].index(boundary) + 1,
        "actualStdoutBoundaryOrdinal": printed_boundaries.index(boundary) + 1,
        "genuineSwitch": [
            "Sphere-surface chord/diameter discussion to closed-ball distance-set definition.",
            "Ball rotation/interior points to the Cartesian equation of a sphere.",
        ][i],
        "paragraphIndicesCopiedFromSavedFlowNotComputedFromProse": [
            p["index"] for p in flow["paragraphs"] if p["text"] in (boundary["before"], boundary["after"])
        ],
    })

page224_path = TMP / "source222224-author/artifacts/9-10g/pages/0224/page.json"
page224 = read(page224_path)
tail = page224["blocks"][:4]
exmap = {ex["number"]: ex for ex in exercises["exercises"]}
split_line = exmap["222"]["lines"][2]
special = {
    "proofSourceRefs": lesson["prose"][9]["source_refs"],
    "proofFigureSlot": {k: lesson["prose"][10][k] for k in ("id", "kind", "source_refs")},
    "proofCaption": {k: lesson["prose"][11][k] for k in ("text", "kind", "source_refs")},
    "exercise220BothSourceRefs": exmap["220"]["pages"],
    "exercise220BothFigureFields": {
        "rawFigureRefs": raw_ex["exercises"][4]["figure_refs"],
        "candidateFigureRefs": exmap["220"]["figure_refs"],
        "rawDisplayFigures": raw_ex["exercises"][4]["figures"],
        "candidateDisplayFigures": exmap["220"]["figures"],
        "note": "Both reference/display fields are empty in the raw authoritative exercise. No figure invented.",
    },
    "exercise216RaisedMarkers": subparts(exmap["216"]["text"]),
    "exercise217Prefix": exmap["217"]["lines"][0],
    "raisedMarkerSemantics": "Source-bound question/subpart markers only, not angle givens; exact source glyph remains HOLD.",
    "exercise222CompleteFirstSubpartLine": split_line,
    "exercise222FirstCoordinateSeparateExactSpans": math(split_line)[:2],
    "exercise222FirstSubpartMath": math(split_line),
    "exercise222SecondSubpartMath": math(exmap["222"]["lines"][3]),
    "lateTailBeforeActualNextH3": {
        "input": ref(page224_path),
        "refs": ["p0224#1", "p0224#2", "p0224#3", "p0224#4"],
        "blocks": tail,
        "reviewBoundary": "Only first three blocks used for N62; actual next h3 is structural exclusion boundary. N63 body was not compared.",
    },
    "checks": {
        "proofJoinExact": lesson["prose"][9]["source_refs"] == ["p0222#11", "p0223#3"],
        "proofFigureRefExact": lesson["prose"][10]["source_refs"] == ["p0223#1"],
        "proofCaptionRefExact": lesson["prose"][11]["source_refs"] == ["p0223#2"],
        "exercise220JoinExact": exmap["220"]["pages"] == ["p0223#10", "p0224#1"],
        "exercise221RefExact": exmap["221"]["pages"] == ["p0224#2"],
        "exercise222RefExact": exmap["222"]["pages"] == ["p0224#3"],
        "exercise216RaisedMarkersExact": subparts(exmap["216"]["text"]) == ["1\u00b0)", "2\u00b0)"],
        "exercise217RaisedPrefixExact": exmap["217"]["lines"][0] == "217\u00b0.",
        "exercise222StarExact": exmap["222"]["lines"][0] == "222*.",
        "firstCoordinateNotMergedAndOnOneCompleteSubpartLine":
            math(split_line) == ["$S(2,$", "$-1,3)$", "$R=4$"] and split_line.startswith("1) "),
        "secondSubpartExact": math(exmap["222"]["lines"][3]) == ["$S(-5,0,7)$", "$R=\\sqrt{3}$"],
        "tailKindsExact": [b["kind"] for b in tail] == ["ex", "ex", "ex", "h3"],
        "tailLabelsExact": [b["label"] for b in tail[:3]] == ["220", "221", "222"],
        "tailContinuationExact": tail[0]["cont"] is True and tail[0]["open"] is False,
    },
}
global_checks = {
    "rawSnapshotLessonExact": lesson["source"]["data"] == raw_lesson,
    "rawSnapshotExercisesExact": exercises["source"]["data"] == raw_ex,
    "lessonSourceHashExact": lesson["source"]["sha256"] == ref(tm["rawLesson"]["path"])["sha256"],
    "exerciseSourceHashExact": exercises["source"]["sha256"] == ref(tm["rawExercises"]["path"])["sha256"],
    "lessonRawIdentityExact": all(lesson[k] == raw_lesson[k] for k in raw_lesson if k != "prose"),
    "exerciseLessonIdentityExact": exercises["lesson"] == raw_ex["lesson"],
    "objectLengthsExact": len(lesson["prose"]) == len(raw_lesson["prose"]) == 13
        and len(exercises["exercises"]) == len(raw_ex["exercises"]) == 7 and len(objects) == 20,
    "exerciseCountsExact": lesson["exercise_count"] == exercises["count"] == raw_ex["count"] == 7,
    "exerciseOrderExact": [ex["number"] for ex in exercises["exercises"]] == [str(n) for n in range(216, 223)],
    "allTwentyLiteralComparisonsPass": all(o["status"] == "PASS" for o in objects),
    "lessonErrataEmpty": lesson["errata"] == [],
    "nineSavedParagraphsExactlyActualStdout": flow["paragraphs"] == printed_paragraphs,
    "allEightSavedBoundariesExactlyActualStdout": flow["boundaries"] == printed_boundaries,
    "twoSectionBreaksExactlySavedAndActual": len(switches) == 2 and all(s["status"] == "PASS" for s in switches),
    "finalDiffFromFIRSTOnlySectionBreaks":
        {k: v for k, v in lesson.items() if k != "section_breaks"}
        == {k: v for k, v in first.items() if k != "section_breaks"},
    "specialBindingsPass": all(special["checks"].values()),
}
write("n62-literal-comparison-evidence.json", {
    "schema": "independent-read-only-literal-comparison@1",
    "method": "Own comparison against bound raw data; no imports of author checks, producer, proseflow, htmlfrag, layout, validator or renderer.",
    "inputs": [ref(p) for p in (lesson_path, exercises_path, tm["rawLesson"]["path"],
                               tm["rawExercises"]["path"], flow_path, stdout_path)],
    "globalChecks": global_checks, "objects": objects, "sectionBreaks": switches,
    "specialBindings": special,
    "status": "PASS" if all(global_checks.values()) else "FAIL",
    "sourceImageLoads": 0, "producerChecksExecuted": 0,
})

ctx = read(main["figure82Context"]["path"])
draft = main["figure82CurrentDraft"]
spec = read(draft["spec"]["path"])
mapping = read(TMP / "n60-fig8182-author/fig-g10-82/draft-01/mapping.json")
render = read(draft["render"]["path"])
native = read(TMP / "n60-fig8182-author/fig-g10-82/draft-01/native.commands.json")
n60lesson, n60ex = read(ctx["editionLesson"]["path"]), read(ctx["editionExercises"]["path"])
objmap = {o["id"]: o for o in spec["objects"]}
assertmap = {a["id"]: a for a in spec["assertions"]}
groups = {g["id"]: g for g in spec["source"]["inventory"]}
point_fields = ["a", "b", "c", "d", "point", "center", "from", "to"]
loci = []
for locus in mapping["unmarkedConstructionLoci"]:
    group = groups[locus["groupId"]]
    group_coords = [p["coordinate"] for p in mapping["unmarkedConstructionLoci"] if p["groupId"] == locus["groupId"]]
    relations = []
    for aid in locus["assertions"]:
        assertion = assertmap[aid]
        points = [assertion[f] for f in point_fields if isinstance(assertion.get(f), list)]
        relations.append({
            "id": aid, "type": assertion["type"], "coordinateFields": points,
            "containsThisLocus": locus["coordinate"] in points,
            "whollyInsideGroupLoci": all(p in group_coords for p in points),
            "mappedWithinSourceGroup": aid in group["assertions"],
            "notCountSubstitution": assertion["type"] != "objectCount",
        })
    loci.append({
        "locus": locus["firstId"], "coordinate": locus["coordinate"],
        "group": locus["groupId"], "relations": relations,
        "status": "PASS" if all(r["containsThisLocus"] and r["whollyInsideGroupLoci"]
                               and r["mappedWithinSourceGroup"] and r["notCountSubstitution"]
                               for r in relations) else "FAIL",
    })
edge_bindings = []
for aid, assertion in assertmap.items():
    if assertion["type"] == "connects":
        obj = objmap[assertion["arrow"]]
        edge_bindings.append({"assertion": aid, "object": obj["id"],
                              "from": obj["from"], "to": obj["to"],
                              "exactEndpointBinding": obj["from"] == assertion["from"] and obj["to"] == assertion["to"]})
circle_bindings = []
for side in ("upper", "lower"):
    obj = objmap[f"b-{side}-circle"]
    assertion = assertmap[f"b-{side}-contact-on-circle"]
    circle_bindings.append({
        "object": obj["id"], "center": obj["center"], "radius": obj["radius"],
        "contact": assertion["point"],
        "exactCircleObjectBinding": obj["center"] == assertion["center"] and obj["radius"] == assertion["radius"],
        "tangencyAssertions": [f"b-{side}-contact-on-edge", f"b-{side}-contact-on-circle",
                              f"b-{side}-tangent-radius", f"b-{side}-contact-midpoint"],
    })
figure_checks = {
    "completeN60ProseContextExactlyCurrent": ctx["completeEditionProse"] == n60lesson["prose"],
    "completeN60ExerciseContextExactlyCurrent": ctx["completeEditionExercises"] == n60ex["exercises"],
    "allFourteenLociHaveGroupContainedMultiPointRelationships": len(loci) == 14 and all(l["status"] == "PASS" for l in loci),
    "allNineVisibleEdgesBoundToExecutableConnects": len(edge_bindings) == 9 and all(e["exactEndpointBinding"] for e in edge_bindings),
    "bothCircleObjectsBoundToContactAssertions": len(circle_bindings) == 2 and all(c["exactCircleObjectBinding"] for c in circle_bindings),
    "noObjectCountAssertionSubstitute": all(a["type"] != "objectCount" for a in spec["assertions"]),
    "sourceHashBound": spec["source"]["image"]["sha256"] == main["figure82Source"]["sha256"],
    "savedNativePASSBoundToCurrentSpec": render["status"] == "pass" and render["spec"]["sha256"] == draft["spec"]["sha256"]
        and all(c["exitCode"] == 0 and c["spec"]["sha256"] == draft["spec"]["sha256"] for c in native["commands"]),
    "savedSVGHashBound": render["output"]["svg"]["sha256"] == draft["svg"]["sha256"],
    "leadingGlyphMeaningNotAssigned": mapping["glyphBinding"]["conventionalCircumferenceMeaningAssigned"] is False
        and mapping["glyphBinding"]["sourceCodepoint"] is None,
    "panelChoiceNotSourceCodepointClaim": mapping["panelTransliteration"]["sourceCodepointsCleared"] is False,
}
write("figure82-relationship-evidence.json", {
    "schema": "independent-source-group-relationship-comparison@1",
    "method": "Read-only inspection of current native assertion fields and their visible object endpoints. No numerical validator or renderer rerun; source geometry checked independently from FIRST inventory and single current snapshot.",
    "checks": figure_checks,
    "contextCoverage": {
        "proseObjects": len(n60lesson["prose"]),
        "exerciseObjects": len(n60ex["exercises"]),
        "exerciseNumbers": [e["number"] for e in n60ex["exercises"]],
        "semanticReference": {"source_refs": ["p0217#7"], "text": n60lesson["prose"][-1]["text"]},
        "note": "N60 text is context, not a repeated N60 text-review verdict.",
    },
    "loci": loci, "edgeBindings": edge_bindings, "circleBindings": circle_bindings,
    "mappedNativeAssertionDefinitions": list(assertmap.values()),
    "savedDisplayChecksReused": render["displayChecks"],
    "nativeValidationAndRenderingExecuted": 0,
    "status": "PASS" if all(figure_checks.values()) else "FAIL",
})
print(json.dumps({
    "n62Status": "PASS" if all(global_checks.values()) else "FAIL",
    "objectsCompared": len(objects),
    "textFailures": [k for k, v in global_checks.items() if not v],
    "objectFailures": [o["target"] for o in objects if o["status"] != "PASS"],
    "figure82RelationshipStatus": "PASS" if all(figure_checks.values()) else "FAIL",
    "figureFailures": [k for k, v in figure_checks.items() if not v],
    "loci": len(loci), "connectedEdges": len(edge_bindings),
}, indent=2))
