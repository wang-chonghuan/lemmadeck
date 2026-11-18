"""Independent, read-only figure assertions; no native validation or rendering."""

import hashlib
import json
import math
import re
import struct
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d705-n79-fig184185-first-review"
TMP = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp"
AUTHOR = TMP / "d693-n79-fig184185-first-author"
CURRENT = TMP / "d700-n79-readability-repair/candidates"
PRIOR = TMP / "d683-n79-first-bilingual-text-author/candidates"
assert Path.cwd() == ROOT
assert Path(__file__).resolve().parent == OWN
assert not (OWN / "report.json").exists(), "Do not overwrite an existing review."

bindings = {}
checks = []


def check(scope, identifier, condition, observed=None):
    checks.append({
        "scope": scope,
        "id": identifier,
        "status": "PASS" if condition else "FAIL",
        "observed": observed,
    })


def read(path, expected=None):
    path = path.resolve()
    assert path.is_relative_to(ROOT)
    data = path.read_bytes()
    binding = {
        "path": str(path),
        "sha256": hashlib.sha256(data).hexdigest(),
        "bytes": len(data),
    }
    bindings[str(path)] = binding
    if expected:
        check("bindings", path.name + "-sha256", binding["sha256"] == expected, binding)
    return data


def load(path, expected=None):
    return json.loads(read(path, expected))


def near(a, b, tolerance=1e-6):
    return abs(a - b) <= tolerance


def equal_point(a, b):
    return all(near(x, y) for x, y in zip(a, b))


def distance(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


def on_line(a, b, c):
    area = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    return near(area, 0, 1e-5)


author = load(
    AUTHOR / "report.json",
    "ab639dfb726435dbeda8de26895dbec32477ae240f396b26e70cb6294d0c9cad",
)
inventory = load(AUTHOR / "source-inventory.json", author["fullSourceInventory"]["sha256"])
affected = load(
    TMP / "d692-n79-first-bilingual-text-review/affected-report.json",
    "e769cf59b09a1e3179ecaa406817e5e74bf92e0e35d8b440db8951e7aef0f414",
)
display = load(AUTHOR / "display-render-checks.json", author["displayChecks"]["sha256"])
read(ROOT / "app/src/styles/app.css", display["css"]["sha256"])
check("SCI", "affected-review-is-pass-not-whole-card", affected["status"] == "PASS"
      and not affected["scope"]["wholeCardApproved"])

current_lessons = {}
for locale, digest in [
    ("zh", "b6904b7ff9af8aebd7d36abe11df384dfd2683bdaf8baea226ca4be2dbded752"),
    ("en", "457367f015d51bb4972b48ada95f5a2d857c54e99e07cb274850a35bb651f8b1"),
]:
    current = load(CURRENT / locale / "phy10-c2-s2-n79/lesson.template.json", digest)
    prior_binding = next(x for x in inventory["authoritativeCandidates"] if x["locale"] == locale)
    prior = load(ROOT / prior_binding["path"], prior_binding["sha256"])
    current_lessons[locale] = current
    check("SCI", locale + "-anatomy-and-optical-model-unchanged",
          current["prose"][0] == prior["prose"][0] and current["prose"][3] == prior["prose"][3])
    check("SCI", locale + "-visual-angle-source-and-references-preserved",
          current["prose"][4]["source_text"] == prior["prose"][4]["source_text"]
          and current["prose"][4]["source_refs"] == prior["prose"][4]["source_refs"])
    angle_paragraph = next(p for p in current["prose"][4]["text"].split("\n\n")
                           if "$\\varphi$" in p)
    check("SCI", locale + "-visual-angle-paragraph-preserved",
          re.sub(r"\s+", "", angle_paragraph)
          in re.sub(r"\s+", "", prior["prose"][4]["text"]), angle_paragraph)
    role = "repaired-" + locale + "-candidate"
    reviewed = next(x for x in affected["inputBindings"] if x["role"] == role)
    check("SCI", locale + "-current-candidate-bound-to-affected-pass",
          reviewed["sha256"] == digest)

anatomy_map = [
    ("1", "sclera", "sclera-target"),
    ("2", "cornea", "cornea-target"),
    ("3", "iris", "iris-target"),
    ("4", "aqueous humor", "aqueous-target"),
    ("5", "pupil", "pupil-upper"),
    ("6", "crystalline lens", "lens-target"),
    ("7", "muscle involved in accommodation", "muscle-target"),
    ("8", "vitreous", "vitreous-target"),
    ("9", "retina", "retina-target"),
    ("10", "optic nerve", "nerve-target"),
]
check("fig-184", "inventory-label-map-matches-independent-pixel-observation",
      [(x["label"], x["feature"]) for x in inventory["figures"][0]["labelMap"]]
      == [(number, feature) for number, feature, _ in anatomy_map])

figures = []
opened_images = []
for identifier, attempt in [("fig-184", "repair-1"), ("fig-185", "first")]:
    native = next(x for x in author["nativeVerdicts"] if x["figure"] == identifier)
    spec_path = Path(native["spec"]["path"])
    svg_path = Path(native["svg"]["path"])
    render_path = Path(native["render"]["path"])
    spec = load(spec_path, native["spec"]["sha256"])
    svg = ET.fromstring(read(svg_path, native["svg"]["sha256"]))
    render = load(render_path, native["render"]["sha256"])
    validation_path = AUTHOR / (identifier + "." + attempt + ".validation.json")
    validation_binding = next(x for x in author["files"] if x["path"] == str(validation_path))
    validation = load(validation_path, validation_binding["sha256"])
    validation_result = json.loads(validation["stdout"])
    check(identifier, "reuse-hash-bound-native-pass",
          validation["exitCode"] == 0 and validation_result["status"] == "pass"
          and render["status"] == "pass" and render["collisions"] == []
          and render["spec"]["sha256"] == bindings[str(spec_path)]["sha256"]
          and render["output"]["svg"]["sha256"] == bindings[str(svg_path)]["sha256"])
    original_path = ROOT / spec["source"]["image"]["path"]
    original = read(original_path, spec["source"]["image"]["sha256"])
    pixel_inventory = next(x for x in inventory["figures"] if x["id"] == identifier)
    check(identifier, "source-inventory-current-source-hash",
          pixel_inventory["original"]["sha256"] == bindings[str(original_path)]["sha256"])
    display_figure = next(x for x in display["figures"] if x["id"] == identifier)
    media_path = Path(display_figure["media640"]["path"])
    media = read(media_path, display_figure["media640"]["sha256"])
    png_size = struct.unpack(">II", media[16:24])
    check(identifier, "actual-640-preview-dimensions",
          png_size == (640, math.ceil(spec["canvas"]["height"] * 640 / 960)), png_size)
    for kind, path in [("original", original_path), ("final-actual-640-media", media_path)]:
        opened_images.append({
            "figure": identifier, "kind": kind, "opens": 1,
            **bindings[str(path)], "inspection": "Opened once at original resolution via view_image.",
        })

    objects = {x["id"]: x for x in spec["objects"]}
    assertions = {x["id"]: x for x in spec["assertions"]}
    elements = {x.get("id"): x for x in svg.iter() if x.get("id")}

    def point(reference):
        return objects[reference]["at"] if isinstance(reference, str) else reference

    def screen(reference):
        x, y = point(reference)
        return [x, spec["canvas"]["height"] - y]

    for group in spec["source"]["inventory"]:
        check(identifier, group["id"] + "-mapped-objects-and-assertions-exist",
              all(x in objects for x in group["objects"])
              and all(x in assertions for x in group["assertions"]),
              {"objects": group["objects"], "assertions": group["assertions"]})

    path_layer = elements["ld-" + identifier + "-raw-path-layer"]
    paths = [x for x in spec["objects"] if x["type"] == "svgPath"]
    check(identifier, "svg-anatomical-outline-composition-equals-spec",
          [x.get("d") for x in path_layer] == [x["d"] for x in paths]
          and path_layer.get("transform") == "scale(1 1)")
    for obj in spec["objects"]:
        if obj["type"] == "point":
            element = elements["ld-" + identifier + "_ld-" + obj["id"]]
            check(identifier, obj["id"] + "-svg-target-coordinate",
                  equal_point([float(element.get("cx")), float(element.get("cy"))], screen(obj["id"])))
        elif obj["type"] == "segment":
            element = elements["ld-" + identifier + "_ld-" + obj["id"]]
            check(identifier, obj["id"] + "-svg-connection-coordinates",
                  equal_point([float(element.get("x1")), float(element.get("y1"))], screen(obj["from"]))
                  and equal_point([float(element.get("x2")), float(element.get("y2"))], screen(obj["to"])))

    label_nodes = [x for x in svg.iter() if x.tag.endswith("}text")]
    check(identifier, "svg-labels-complete-English-or-math",
          [x.text for x in label_nodes] == [x["text"] for x in spec["objects"] if x["type"] == "text"]
          and all(re.fullmatch(r"[A-Za-z0-9 ]+|[\u03c6\u2081\u2082]+", x.text or "") for x in label_nodes),
          [x.text for x in label_nodes])
    minimum_px = min(float(x.get("font-size")) * 640 / spec["canvas"]["width"] for x in label_nodes)
    check(identifier, "svg-text-at-actual-640-at-least-16px", minimum_px >= 16, minimum_px)
    check(identifier, "instructional-scroll-not-shrunken-inline",
          spec["display"] == {"purpose": "instructional", "layout": "scroll",
                              "minTextPx": 16, "widths": [640]})
    check(identifier, "existing-display-report-bound-to-exact-spec-svg",
          display_figure["status"] == "pass"
          and display_figure["spec"]["sha256"] == bindings[str(spec_path)]["sha256"]
          and display_figure["svg"]["sha256"] == bindings[str(svg_path)]["sha256"])
    scroll_checks = []
    for container_width in [331, 342]:
        receipt = next(x for x in display_figure["checks"] if x["containerWidth"] == container_width)
        check(identifier, "existing-scroll-end-" + str(container_width),
              receipt["mediaWidth"] == receipt["svgWidth"] == 640
              and receipt["minTextPx"] >= 16
              and receipt["maxScroll"] == receipt["scrollEnd"] == 640 - container_width
              and receipt["reachable"] and not receipt["textFailures"] and not receipt["geometryFailures"])
        scroll_checks.append({k: receipt[k] for k in [
            "containerWidth", "mediaWidth", "svgWidth", "minTextPx", "maxScroll", "scrollEnd", "reachable",
        ]})
    role_failures = []
    for element in svg.iter():
        if element.get("display") == "none" or element.tag.endswith("}filter"):
            continue
        for property_name in ["stroke", "fill"]:
            value = element.get(property_name)
            if value and value not in ["none", "context-stroke"] and not value.startswith("var(--ld-figure-"):
                role_failures.append({"id": element.get("id"), "property": property_name, "value": value})
    check(identifier, "visible-svg-colors-use-semantic-roles", not role_failures, role_failures)

    if identifier == "fig-184":
        for number, _, target in anatomy_map:
            callout_id = "callout-" + number + ("-upper" if number == "5" else "")
            assertion_id = "label-" + number + ("-upper" if number == "5" else "") + "-target"
            check(identifier, "source-label-" + number + "-callout-target",
                  objects[callout_id]["to"] == target
                  and assertions[assertion_id]["type"] == "connects"
                  and assertions[assertion_id]["arrow"] == callout_id
                  and assertions[assertion_id]["to"] == target
                  and objects["number-" + number]["text"] == number)
        check(identifier, "pupil-fork-both-aperture-margins",
              objects["callout-5-lower"]["to"] == "pupil-lower"
              and assertions["label-5-lower-target"]["to"] == "pupil-lower"
              and equal_point(objects["callout-5-upper"]["from"], objects["callout-5-lower"]["from"])
              and point("pupil-upper")[0] == point("pupil-lower")[0]
              and point("pupil-lower")[1] < 390 < point("pupil-upper")[1])
        check(identifier, "anterior-anatomy-and-posterior-relationship-order",
              point("cornea-target")[0] < point("aqueous-target")[0] < point("iris-target")[0]
              < point("lens-target")[0] < point("vitreous-target")[0]
              < point("retina-target")[0] < point("nerve-target")[0]
              and point("muscle-target")[1] > point("lens-target")[1])
        check(identifier, "axis-dashed-horizontal-unarrowed",
              objects["eye-axis"]["type"] == "segment" and objects["eye-axis"]["dash"] == 2
              and point(objects["eye-axis"]["from"])[1] == point(objects["eye-axis"]["to"])[1]
              and not any(x["type"] == "arrow" for x in spec["objects"]))
        first_spec_binding = next(x for x in author["firstFailPreserved"] if x["path"].endswith("spec.json"))
        first = load(Path(first_spec_binding["path"]), first_spec_binding["sha256"])
        first_render_binding = next(x for x in author["firstFailPreserved"] if x["path"].endswith("render.json"))
        first_render = load(Path(first_render_binding["path"]), first_render_binding["sha256"])
        expected_first = json.loads(json.dumps(spec))
        next(x for x in expected_first["objects"] if x["id"] == "heading")["at"] = [520, 707]
        check(identifier, "only-one-heading-repair-first-fail-preserved",
              first == expected_first and objects["heading"]["at"] == [520, 725]
              and native["contentRepairs"] == 1 and first_render["status"] == "fail")
        observations = [
            "One anterior-left/posterior-right cross-section. All source labels 1..10 and eleven leaders, including the two branches of 5, are visible at actual 640 px.",
            "1 outer scleral wall; 2 distinct transparent corneal bulge; 3 lower iris; 4 anterior aqueous chamber; 5 aperture margins; 6 convex lens behind pupil; 7 upper accommodation attachment; 8 clear vitreous chamber; 9 posterior inner retinal lining; 10 exiting nerve bundle.",
            "Target 9 ends on the inner posterior lining, not the nerve. The smooth lining and nerve remain distinguishable; rods/cones are not invented as nerve branches.",
            "Cornea, iris aperture, convex lens and vitreous preserve the authoritative d700 anatomical distinctions. Upper/lower attachment strokes are schematic, not a complete anatomical model or a demonstration of muscle motion.",
            "Source dashed horizontal axis is retained without ray arrows or focal labels. Old scan texture and unnumbered tangential outline strokes are omitted as declared noninstructional simplification.",
            "The repaired heading clears label 8. All numbers and English orientation labels are readable; no clipped feature, missing anatomy, black raster or text collision was seen.",
        ]
        geometry = {"labels": 10, "calloutBranches": 11, "contentRepairsUsed": 1}
    else:
        far_base, far_tip = point("far-base"), point("far-tip")
        near_base, near_tip = point("near-base"), point("near-tip")
        vertex = point("eye-vertex")
        phi1 = math.atan2(far_tip[1] - vertex[1], vertex[0] - far_tip[0])
        phi2 = math.atan2(near_tip[1] - vertex[1], vertex[0] - near_tip[0])
        check(identifier, "equal-upright-object-heights-shared-baseline",
              distance(far_base, far_tip) == distance(near_base, near_tip) == 65
              and far_base[0] == far_tip[0] and near_base[0] == near_tip[0]
              and far_base[1] == near_base[1] == vertex[1]
              and far_tip[1] > far_base[1] and near_tip[1] > near_base[1])
        check(identifier, "nearer-distance-smaller-and-phi2-larger",
              far_base[0] < near_base[0] < vertex[0] and 0 < phi1 < phi2,
              {"farDistance": vertex[0] - far_base[0], "nearDistance": vertex[0] - near_base[0],
               "phi1Radians": phi1, "phi2Radians": phi2, "schematicNotSourceMeasurements": True})
        for prefix, tip in [("far", far_tip), ("near", near_tip)]:
            rear = point(prefix + "-rear")
            check(identifier, prefix + "-upper-ray-shares-vertex-crosses-below-baseline",
                  on_line(tip, vertex, rear) and rear[0] > vertex[0] and rear[1] < vertex[1]
                  and near(distance(rear, point("eye-center")), 85))
            arc = objects["phi-" + ("1" if prefix == "far" else "2") + "-arc"]
            start, end = point(arc["start"]), point(arc["end"])
            check(identifier, prefix + "-phi-arc-bound-to-correct-ray-and-common-vertex",
                  arc["center"] == "eye-vertex" and on_line(tip, vertex, start)
                  and end[1] == vertex[1] and near(distance(start, vertex), distance(end, vertex))
                  and near(math.atan2(start[1] - vertex[1], vertex[0] - start[0]),
                           phi1 if prefix == "far" else phi2))
        arrows = [x for x in spec["objects"] if x["type"] == "arrow"]
        heads = {x.get("data-arrowhead-for"): x for x in svg.iter() if x.get("data-arrowhead-for")}
        check(identifier, "six-actual-svg-arrowheads", len(heads) == len(arrows) == 6)
        for arrow in arrows:
            a, b = point(arrow["from"]), point(arrow["to"])
            direction = math.degrees(math.atan2(-(b[1] - a[1]), b[0] - a[0]))
            head = heads.get("ld-" + identifier + "_ld-" + arrow["id"])
            rotation = re.search(r"rotate\(([-+0-9.eE]+)\)", head.get("transform", "")) if head is not None else None
            exported_direction = float(rotation.group(1)) if rotation is not None else None
            check(identifier, arrow["id"] + "-exported-arrowhead-direction",
                  rotation is not None and near(exported_direction, direction, 1e-5)
                  and len(list(head)) == 1 and list(head)[0].get("d") == "M 0,0 L 10,5 L 0,10 z"
                  and head.get("opacity") == "1",
                  {"expectedDegrees": direction, "svgDegrees": exported_direction,
                   "toleranceDegrees": 1e-5, "reason": "Exported SVG transform float serialization."})
            if "direction" in arrow["id"]:
                check(identifier, arrow["id"] + "-incident-toward-eye",
                      a[0] < b[0] < vertex[0] and on_line(a, vertex, b))
        check(identifier, "phi-labels-smaller-far-larger-near-below-baseline",
              objects["phi-1"]["text"] == "\u03c6\u2081"
              and objects["phi-2"]["text"] == "\u03c6\u2082"
              and objects["phi-1"]["at"][1] < vertex[1]
              and objects["phi-2"]["at"][1] < vertex[1]
              and point("far-arc-end")[0] > point("near-arc-end")[0])
        check(identifier, "zero-repairs-no-magnifier-or-future-card-claim", native["contentRepairs"] == 0)
        observations = [
            "One shared optical frame, not independently scaled panels. Equal-height upright objects share the lower ray; the nearer object lies between the farther object and the eye.",
            "All four incident ray arrowheads point toward the eye, while both object arrowheads point upward. Two upper sight rays and the lower line share one anterior eye vertex.",
            "The smaller inner/rightward arc and phi_1 belong to the farther object. The larger outer/leftward arc and phi_2 belong to the nearer object. Labels and their leaders remain distinct at actual 640 px.",
            "Upper-ray continuations cross below the baseline and terminate at the posterior eye outline, preserving the source's schematic inverted-image direction. No separate retina layer, image-height arrow, calibrated refraction model or guaranteed photoreceptor resolution is claimed.",
            "English comparison labels are modern additions. No source angle value, focal point, magnifier or spectacle-correction lens was added. There is no scan texture or leaked cultural lettering.",
            "At actual 640 px the eye outline, rays, arrowheads, arcs and both indexed phi labels are visible without clipping, missing content, black rendering or text overlap.",
        ]
        geometry = {"objectHeight": 65, "incidentRayArrowheads": 4, "uprightObjectArrowheads": 2,
                    "phi1Radians": phi1, "phi2Radians": phi2, "contentRepairsUsed": 0,
                    "numericalGeometryIsSchematicAndNotPublished": True}
    figures.append({
        "id": identifier,
        "status": "PASS",
        "scope": "Independent FIG source/composition/scientific-consistency/cultural/actual-640 review only.",
        "bindings": {key: bindings[str(path)] for key, path in [
            ("source", original_path), ("spec", spec_path), ("svg", svg_path),
            ("render", render_path), ("validationReceipt", validation_path), ("media640", media_path),
        ]},
        "nativeEvidence": {"status": "pass", "reusedNotReexecuted": True},
        "sourceInventory": {
            "status": "PASS-RECHECKED-AGAINST-ORIGINAL-PIXELS",
            "subfigures": pixel_inventory["subfigures"],
            "groupIds": [x["id"] for x in spec["source"]["inventory"]],
            "modernAdditionsRemainSeparatedFromSourceFacts": True,
        },
        "scientificConsistency": {
            "status": "PASS",
            "currentText": [bindings[str(CURRENT / locale / "phy10-c2-s2-n79/lesson.template.json")]
                            for locale in ["zh", "en"]],
            "existingAffectedSCI": bindings[str(TMP / "d692-n79-first-bilingual-text-review/affected-report.json")],
            "fullProseSCIReplayed": False,
        },
        "independentVisualObservations": observations,
        "geometry": geometry,
        "display": {"layout": "scroll", "mediaWidth": 640, "svgDerivedMinTextPx": minimum_px,
                    "existingReportedMinTextPx": display_figure["checks"][0]["minTextPx"],
                    "existingHashBoundScrollChecks": scroll_checks,
                    "headedWholeCardDisplayApproved": False},
        "findings": [],
    })

for path, binding in list(bindings.items()):
    check("bindings", "stable-through-review-" + str(Path(path).relative_to(ROOT)),
          hashlib.sha256(Path(path).read_bytes()).hexdigest() == binding["sha256"])
read(Path(__file__))
first_check_path = OWN / "review-checks-first-tolerance-fail.json"
if first_check_path.exists():
    read(first_check_path)
failures = [x for x in checks if x["status"] == "FAIL"]
for figure in figures:
    applicable = [x for x in failures if x["scope"] in [figure["id"], "SCI", "bindings"]]
    if applicable:
        figure["status"] = "FAIL"
        figure["findings"] = applicable

report = {
    "schema": "stemrobin181/independent-first-figure-review@1",
    "ticket": "STEMROBIN-181",
    "invocation": "continuing181-3",
    "review": "FIG184185FIRST",
    "card": "phy10-c2-s2-n79",
    "status": "FAIL" if failures else "PASS",
    "checkout": str(ROOT),
    "ownedDirectory": str(OWN),
    "independence": "Fresh review context; reviewer did not author or repair these figures. Author native passes reused, with independent original-pixel and final-media inspection.",
    "figures": figures,
    "findings": failures,
    "technicalCheckRecovery": {
        "firstReceipt": bindings.get(str(first_check_path)),
        "diagnosis": "Two exported arrow rotations differed by approximately 0.0000015 degrees due to float serialization. The first checker used 0.000001 degree; corrected to an explicit 0.00001 degree tolerance.",
        "figureBytesOrRepairUsageChanged": False,
        "nativeCallsRepeated": False,
    },
    "nonBlockingProvenanceNote": {
        "specEmbeddedTextBasis": "d683 original bilingual prose, retained as author-time provenance; not byte-identical to d700.",
        "currentScientificAuthority": "Exact d700 bilingual candidates, bound here to existing d692 affected PASS.",
        "decision": "Source inventory still covers the actual pixels. d700 leaves anatomy/model and the visual-angle paragraph intact, and its affected accommodation readability repair does not change these figures' semantic relationships.",
        "invalidationRule": "This PASS covers only the exact bound source/spec/output/evidence bytes. Any changed spec, source, SVG, render or preview needs appropriate new bindings and affected evidence. This is not native review@1 or promotion.",
    },
    "assertions": checks,
    "inputBindings": list(bindings.values()),
    "images": {"opened": opened_images, "total": 4, "originalOpens": 2, "final640Opens": 2,
               "reopens": 0, "crops": 0, "newGeneratedImages": 0, "batchMaximum": 8, "contextMaximum": 24},
    "scopeBoundary": {
        "wholeCardApproved": False,
        "fig186187": "Excluded; parent/user reports terminal native FAIL. Their outputs were not opened or validated here.",
        "fig185ReuseForN80": "Exact reviewed figure may be considered for reuse after this independent PASS; no n80 text, future card or future composition is approved.",
        "nativeRecordReview": "Not called. Parent composes and records native recordReview only after separate PASS.",
        "promotion": False,
    },
    "execution": {
        "everyExecExplicitCwd": str(ROOT),
        "writes": ["review-checks.py", "report.json", "review-checks-first-tolerance-fail.json"],
        "nativeValidateCalls": 0, "nativeRenderCalls": 0, "nativeRecordReviewCalls": 0,
        "paidCalls": 0, "newAgentsBranchesWorktrees": 0,
        "canonicalToolMeterIndexGitBackendDBPublisherWritesOrCalls": 0,
        "wholeProjectTestsOrBuilds": 0, "browserCalls": 0,
        "evidenceMethod": "Python standard-library structured JSON/XML parsing, SHA-256, focused source/composition assertions and already-produced hash-bound native/display receipts; not a native validator rerun.",
    },
}
(OWN / "report.json").write_text(json.dumps(report, ensure_ascii=True, indent=2) + "\n")
print(json.dumps({"report": str(OWN / "report.json"), "status": report["status"],
                  "figures": [{"id": x["id"], "status": x["status"]} for x in figures],
                  "assertions": len(checks), "failures": failures}, indent=2))
raise SystemExit(1 if failures else 0)
