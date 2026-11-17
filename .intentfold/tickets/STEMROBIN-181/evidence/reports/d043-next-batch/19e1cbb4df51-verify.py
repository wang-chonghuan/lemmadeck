"""Read frozen artifacts only; generate scoped observational evidence, not gates."""

import hashlib
import json
import math
from pathlib import Path
import re
import struct
import sys
import xml.etree.ElementTree as ET


W = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = W / ".intentfold/tickets/STEMROBIN-181"
E = T / "tmp/d043-10p-fig6667-independent-review-evidence"
F = T / "tmp/d043-10p-fig6667-author/author-freeze.json"
EXPECTED_FREEZE = "01fc6b90c14515f484dea95c210aaecc51ee747f547a2fd08ae9182a5c2d6c81"
PHASE = sys.argv[1]
assert PHASE in ("before", "after")


def resolve(p):
    p = Path(p)
    return p if p.is_absolute() else W / p


def read(p):
    return json.loads(resolve(p).read_text())


def digest(p):
    return hashlib.sha256(resolve(p).read_bytes()).hexdigest()


def binding(p):
    return {"path": str(resolve(p)), "sha256": digest(p)}


failures = []


def check(ok, label):
    if not ok:
        failures.append(label)


freeze = read(F)
check(digest(F) == EXPECTED_FREEZE, "author freeze differs from requested SHA-256")
check([f["id"] for f in freeze["figures"]] == ["fig-66", "fig-67"], "scope differs")
check(freeze["inputs"]["repairFreeze"]["sha256"] ==
      "040c999659a9c732a0039eae5c24b3c7fb8e72e56657321d9faa2e1d57800b79",
      "repair freeze authority differs")
check(freeze["inputs"]["affectedReview"]["sha256"] ==
      "efa24ec31ecda7949e6624040126e0972ad21473e137581c5c3c8f1acd3f202a",
      "affected SCI authority differs")

bound = {str(F): EXPECTED_FREEZE}
occurrences = []


def collect(value, origin):
    if isinstance(value, dict):
        if isinstance(value.get("path"), str) and isinstance(value.get("sha256"), str):
            p, h = str(resolve(value["path"])), value["sha256"]
            if p in bound:
                check(bound[p] == h, "conflicting binding: " + p)
            bound[p] = h
            occurrences.append({"path": p, "sha256": h, "origin": origin})
        for key, child in value.items():
            collect(child, origin + "/" + key)
    elif isinstance(value, list):
        for i, child in enumerate(value):
            collect(child, origin + "/" + str(i))


collect(freeze, "author-freeze")
direct_count = len(bound)
repair = read(freeze["inputs"]["repairFreeze"]["path"])
collect(repair, "repair-freeze")
sci = read(freeze["inputs"]["affectedReview"]["path"])
check(sci["effectiveSCI"] == sci["effectiveZHEN"] == "PASS",
      "affected SCI/ZHEN prerequisite is not PASS")
collect(sci, "affected-SCI")
contracts_path = F.parent / "candidate-contracts.json"
contracts = read(contracts_path)
collect(contracts, "candidate-contracts")

figures = []
ns = {"s": "http://www.w3.org/2000/svg"}
for f in freeze["figures"]:
    fid = f["id"]
    spec = read(f["spec"]["path"])
    render = read(f["render"]["path"])
    review = read(f["review"]["path"])
    snapshots = read(f["snapshots"]["path"])
    directory = Path(f["spec"]["path"]).parent
    attempt = read(directory / "attempt.json")
    validation_cmd = read(directory / "validation-command.json")
    native_validation = json.loads(validation_cmd["stdout"])
    render_cmd = read(directory / "render-command.json")
    initial_directory = directory.parent / "initial"
    initial = read(initial_directory / (fid + ".spec.json"))
    initial_validation = read(initial_directory / "validation-command.json")
    initial_failures = json.loads(initial_validation["stdout"])["errors"]
    for name, value in (("spec", spec), ("render", render), ("review", review),
                        ("snapshots", snapshots), ("attempt", attempt)):
        collect(value, fid + "/" + name)
    check(spec["schema"] == "ld-s10y-image/figure-spec@2" and spec["id"] == fid,
          fid + ": spec identity/schema")
    check(spec["mode"] == "deterministic" and
          spec["display"] == f["display"] and
          spec["display"]["purpose"] == "instructional", fid + ": mode/display")
    check(resolve(spec["source"]["image"]["path"]) == Path(f["source"]["path"]) and
          spec["source"]["image"]["sha256"] == f["source"]["sha256"] and
          spec["source"]["image"]["path"].startswith("ssot-resources/"),
          fid + ": canonical source contract")
    check(spec["display"]["widths"] == [640, 358, 331, 310] and
          spec["display"]["minTextPx"] == 16 and
          spec["display"]["maxWidthPx"] == 640 and
          spec["display"]["layout"] == "inline", fid + ": width contract")
    check(validation_cmd["exitCode"] == 0 and native_validation["status"] == "pass" and
          not native_validation["errors"] and render_cmd["exitCode"] == 0 and
          attempt["status"] == render["status"] == review["status"] == "pass",
          fid + ": existing native receipts")
    check(initial_validation["exitCode"] == 2 and
          initial_failures == f["initialFailures"] and f["targetedRepairs"] == 1,
          fid + ": preserved initial failure/sole-repair history")
    reverse = json.loads(json.dumps(spec))
    repaired_pointers = []
    for i, a in enumerate(reverse["assertions"]):
        if a["type"] == "objectCount":
            a["value"] = a.pop("count")
            repaired_pointers.append("/assertions/" + str(i))
    check(reverse == initial, fid + ": repair changed more than value-to-count")

    native_bindings = {}
    for name in ("source", "spec", "render"):
        native_bindings[name] = review[name]
        check(resolve(review[name]["path"]) == Path(f[name]["path"]) and
              review[name]["sha256"] == f[name]["sha256"], fid + ": review " + name)
    check(resolve(review["outputs"]["svg"]["path"]) == Path(f["svg"]["path"]) and
          review["outputs"]["svg"]["sha256"] == f["svg"]["sha256"] and
          resolve(render["spec"]["path"]) == Path(f["spec"]["path"]) and
          render["spec"]["sha256"] == f["spec"]["sha256"] and
          resolve(render["output"]["svg"]["path"]) == Path(f["svg"]["path"]) and
          render["output"]["svg"]["sha256"] == f["svg"]["sha256"],
          fid + ": native source/spec/render/review/SVG chain")
    args = render_cmd["args"]
    for option, name in (("--spec", "spec"), ("--svg", "svg"),
                         ("--png", "nativePng"), ("--report", "render")):
        check(resolve(args[args.index(option) + 1]) == Path(f[name]["path"]),
              fid + ": native renderer command " + option)

    contract = next(c for c in contracts["figures"] if c["id"] == fid)
    final_fields = {"svg", "render", "review", "spec"}
    check(final_fields.issubset(contract) and
          not {"png", "artwork", "generation"}.intersection(contract) and
          contract["mode"] == "deterministic", fid + ": candidate output mode exclusivity")
    for key in final_fields:
        check(contract[key] == f[key], fid + ": candidate " + key + " binding")

    objects = {o["id"]: o for o in spec["objects"]}
    assertions = {a["id"]: a for a in spec["assertions"]}
    check(len(objects) == len(spec["objects"]) and
          len(assertions) == len(spec["assertions"]), fid + ": duplicate IDs")
    for group in spec["source"]["inventory"]:
        check(all(i in objects for i in group["objects"]) and
              all(i in assertions for i in group["assertions"]),
              fid + ": unresolved inventory group " + group["id"])
    mapped_objects = {i for g in spec["source"]["inventory"] for i in g["objects"]}
    check(set(objects) == mapped_objects, fid + ": unmapped visible objects")
    for o in objects.values():
        for key in ("from", "to", "at"):
            if key in o:
                x, y = o[key]
                check(0 <= x <= 640 and 0 <= y <= 360, fid + ": off-canvas " + o["id"])
        check(o["type"] in ("arrow", "segment", "text"),
              fid + ": unanticipated physical object type")
    arrows = [o for o in spec["objects"] if o["type"] == "arrow"]
    for o in (o for o in spec["objects"] if o["type"] in ("arrow", "segment")):
        check(any(a["type"] == "connects" and a["arrow"] == o["id"] and
                  a["from"] == o["from"] and a["to"] == o["to"]
                  for a in assertions.values()), fid + ": unbound edge " + o["id"])
    check(len(arrows) == 3, fid + ": source has exactly three directional heads")
    text_objects = [o for o in spec["objects"] if o["type"] == "text"]
    check([o["text"] for o in text_objects] == ["Particle motion", "Wave propagation"],
          fid + ": two English source-equivalent labels")
    check(all(o["fontSize"] == 34 for o in text_objects), fid + ": label size")
    for a in assertions.values():
        if a["type"] == "objectCount":
            check(sum(o["type"] == a["objectType"] for o in objects.values()) == a["count"],
                  fid + ": count field " + a["id"])

    tree = ET.parse(f["svg"]["path"])
    root = tree.getroot()
    svg_ids = {e.get("id"): e for e in root.iter() if e.get("id")}
    heads = root.findall(".//s:g[@data-arrowhead-for]", ns)
    svg_texts = root.findall(".//s:text", ns)
    check(root.get("viewBox") == "0 0 640 360" and
          root.get("width") == "640" and root.get("height") == "360",
          fid + ": SVG canvas contract")
    check(["".join(e.itertext()) for e in svg_texts] ==
          ["Particle motion", "Wave propagation"], fid + ": SVG English labels")
    check(len(heads) == 3, fid + ": native materialized arrowhead count")
    svg_segment_checks = 0
    svg_arrow_checks = []
    for o in objects.values():
        if o["type"] not in ("arrow", "segment"):
            continue
        element_id = "ld-" + fid + "_ld-" + o["id"]
        line = svg_ids[element_id]
        start = [float(line.get("x1")), float(line.get("y1"))]
        end = [float(line.get("x2")), float(line.get("y2"))]
        expected_start = [o["from"][0], 360 - o["from"][1]]
        expected_end = [o["to"][0], 360 - o["to"][1]]
        check(math.dist(start, expected_start) < 1e-7, fid + ": SVG start " + o["id"])
        check(line.get("stroke").startswith("var(--ld-figure-"),
              fid + ": visible non-semantic line color")
        if o["type"] == "segment":
            check(math.dist(end, expected_end) < 1e-7, fid + ": SVG end " + o["id"])
            svg_segment_checks += 1
        else:
            head = next(h for h in heads if h.get("data-arrowhead-for") == element_id)
            numbers = [float(n) for n in re.findall(r"-?\d+(?:\.\d+)?", head.get("transform"))]
            tx, ty, angle, scale, ox, oy = numbers
            theta = math.radians(angle)
            px, py = scale * (10 + ox), scale * (5 + oy)
            tip = [tx + math.cos(theta) * px - math.sin(theta) * py,
                   ty + math.sin(theta) * px + math.cos(theta) * py]
            error = math.dist(tip, expected_end)
            check(error < 0.2, fid + ": materialized native tip " + o["id"])
            svg_arrow_checks.append({"id": o["id"], "angleDegrees": angle,
                                     "nativeTip": tip, "expectedScreenTip": expected_end,
                                     "tipErrorPx": error})
    label_styles = [{"text": "".join(e.itertext()), "style": e.get("style"),
                     "fontSize": e.get("font-size")} for e in svg_texts]

    waveform = None
    if fid == "fig-66":
        segments = [o for o in spec["objects"] if o["type"] == "segment"]
        vertices = [segments[0]["from"]] + [o["to"] for o in segments]
        check(all(a["to"] == b["from"] for a, b in zip(segments, segments[1:])),
              fid + ": wave trace discontinuity")
        contacts = [p for p in vertices if p[1] == arrows[0]["from"][1]]
        crest = max(vertices, key=lambda p: p[1])
        trough = min(vertices, key=lambda p: p[1])
        check(len(contacts) == 3 and crest[0] < trough[0] and
              crest == arrows[1]["to"] and vertices[-1] == arrows[0]["from"] and
              arrows[0]["to"][0] < arrows[0]["from"][0] and
              arrows[1]["from"] == arrows[2]["from"] and
              arrows[1]["to"][1] > arrows[1]["from"][1] > arrows[2]["to"][1],
              fid + ": source contact/crest/direction relationships")
        waveform = {"sourceContinuousTraceCount": 1, "nativeSamplingSegments": len(segments),
                    "segmentCountIsNotSourceObjectCount": True, "contacts": contacts,
                    "crest": crest, "trough": trough}
    else:
        check(arrows[0]["to"][0] > arrows[0]["from"][0] and
              arrows[1]["to"][0] < arrows[1]["from"][0] < arrows[2]["to"][0] and
              arrows[1]["from"] == arrows[2]["from"] and
              all(p[1] == arrows[0]["from"][1] for a in arrows
                  for p in (a["from"], a["to"])), fid + ": shared collinear directions")

    bilingual = []
    for lang in ("zh", "en"):
        lesson = read(freeze["inputs"][lang]["path"])
        body = "\n\n".join("[" + b["id"] + "]" if b["kind"] == "fig" else b["text"]
                            for b in lesson["prose"])
        expected_text = "Language: " + lang + "\n" + lesson["printed_title"] + "\n" + body
        check(any(a["lesson"] == lesson["id"] and a["text"] == expected_text
                  for a in spec["source"]["authoritativeText"]),
              fid + ": full current " + lang + " authoritative lesson mismatch")
        index = next(i for i, b in enumerate(lesson["prose"])
                     if b["kind"] == "fig" and b["id"] == fid)
        check(lesson["prose"][index + 1]["text"] ==
              ("Figure " if lang == "en" else "\u56fe ") + fid[4:],
              fid + ": " + lang + " caption")
        ref = next(r for r in f["bilingualReferences"] if r["language"] == lang)
        check(ref["figurePointer"] == "/prose/" + str(index) and
              ref["sourceRefs"] == lesson["prose"][index]["source_refs"],
              fid + ": " + lang + " figure reference")
        manifest = read(Path(freeze["inputs"][lang]["path"]).with_name("figures.template.json"))
        entry = next(e for e in manifest["figures"] if e["id"] == fid)
        check(entry["source"]["png"]["sha256"] == f["source"]["sha256"],
              fid + ": " + lang + " figure manifest source")
        bilingual.append({"language": lang, "template": freeze["inputs"][lang],
                          "fullTextSha256": hashlib.sha256(expected_text.encode()).hexdigest(),
                          "characterCount": len(expected_text), "fullTextMatchesSpec": True,
                          "figurePointer": ref["figurePointer"],
                          "captionPointer": ref["captionPointer"],
                          "referencePointer": ref["referencePointer"]})

    checks = render["displayChecks"]
    check([c["width"] for c in checks] == [640, 358, 331, 310] and
          all(c["status"] == "pass" and not c["failures"] and
              c["measuredMinPx"] >= 16 for c in checks) and not render["collisions"],
          fid + ": frozen renderer width/collision measurements")
    pngs = []
    for record in [f["source"], f["nativePng"]] + snapshots["snapshots"]:
        data = Path(record["path"]).read_bytes()
        check(data[:8] == b"\x89PNG\r\n\x1a\n", fid + ": PNG signature")
        width, height = struct.unpack(">II", data[16:24])
        if "width" in record:
            check(width == record["width"], fid + ": snapshot width header")
        if record["path"] == f["nativePng"]["path"]:
            check((width, height) == (640, 360), fid + ": native PNG canvas")
        pngs.append({**record, "pixelWidth": width, "pixelHeight": height,
                     "inspection": "PNG header and SHA only; not a new image open"})
    figures.append({"id": fid, "bindings": {k: f[k] for k in
                    ("source", "spec", "render", "svg", "review", "nativePng", "snapshots")},
                    "initialFailures": initial_failures, "soleRepairReversedExactly": reverse == initial,
                    "soleRepairPointers": repaired_pointers, "nativeValidationConsumed": native_validation,
                    "nativeRendererCommandConsumed": binding(directory / "render-command.json"),
                    "candidateModeContract": "svg + render + review + spec only",
                    "candidateNotDurablePromotion": True, "bilingualFullText": bilingual,
                    "mappedObjects": len(mapped_objects), "mappedAssertions": len(assertions),
                    "svgSegmentEndpointChecks": svg_segment_checks,
                    "svgArrowheadChecks": svg_arrow_checks, "svgLabelStyles": label_styles,
                    "sourceWaveformComparison": waveform,
                    "frozenRendererDisplayChecks": checks, "pngHeaderChecks": pngs})

bindings = []
for p, h in sorted(bound.items()):
    try:
        actual = digest(p)
    except OSError as e:
        actual = str(e)
    check(actual == h, "hash mismatch: " + p)
    bindings.append({"path": p, "expectedSha256": h, "actualSha256": actual,
                     "matches": actual == h})

if PHASE == "after":
    prior = read(E / "verification-before.json")
    check(prior["bindings"] == bindings, "before/after frozen bindings changed")
    check(prior["figures"] == figures, "before/after figure evidence changed")
    unchanged = prior["bindings"] == bindings and prior["figures"] == figures
else:
    unchanged = None

result = {
    "schema": "ld-s10y-image/independent-observational-evidence@1",
    "phase": PHASE, "status": "PASS" if not failures else "HOLD",
    "notOfficialGate": True, "authorFreeze": binding(F),
    "firstTerminalBeforeCheck": {"directAuthorFreezeDistinctFiles": 64, "mismatches": [],
                                 "timing": "Before any native/mobile candidate image opens"},
    "directAuthorFreezeDistinctFiles": direct_count,
    "extendedDistinctBoundFiles": len(bindings), "bindingOccurrences": len(occurrences),
    "sourceFirstInventory": binding(E / "source-first-inventory.json"),
    "bindings": bindings, "figures": figures, "beforeAfterUnchanged": unchanged,
    "failures": failures, "figureRendererOrValidatorExecuted": False,
    "newImagesOpenedByScript": 0, "newOfficialReviewWritten": False,
    "canonicalPromotion": False, "wholeCardApproval": False,
    "writeScope": str(E)
}
destination = E / ("verification-" + PHASE + ".json")
assert destination.parent == E
with destination.open("x") as handle:
    json.dump(result, handle, ensure_ascii=True, indent=2)
    handle.write("\n")
print(json.dumps({"status": result["status"], "phase": PHASE,
                  "directBindings": direct_count, "extendedBindings": len(bindings),
                  "failureCount": len(failures), "failures": failures,
                  "evidence": binding(destination)}, indent=2))
