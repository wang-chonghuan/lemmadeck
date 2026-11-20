import copy
import json
import math
import subprocess
import sys
from pathlib import Path

sys.dont_write_bytecode = True
W = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == W
O = W / ".tmp/STEMROBIN-181/d1816-d073"
E = W / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d073-n126-author"
sys.path.insert(0, str(W / ".claude/skills/ld-s10y-lesson/tools"))
import edition
import mathcheck

ID = "phy9-c2-s6-n126"
BOOK = O / "root/9p"
CONTENT = edition.load(E / "content.json")
RAW = edition.load(BOOK / "lessons" / ID / "lesson.json")
EDITIONS = [("zh", "modern-us-neutral"), ("en", "modern-us-neutral-en")]


def target(name):
    return O / "work/adapt/9p" / name / "lessons" / ID


def bind(file):
    return {"path": str(file), "sha256": edition.sha256(file)}


def save(file, value):
    assert file.is_relative_to(O) or file.is_relative_to(E)
    edition.dump(file, value)


def native(name, command, input_text=None):
    run = subprocess.run(command, cwd=W, capture_output=True, text=True, input=input_text)
    folder = E / "native" / name
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "stdout.txt").write_text(run.stdout)
    (folder / "stderr.txt").write_text(run.stderr)
    save(folder / "receipt.json", {"role": "FIRST_AUTHOR", "cwd": str(W),
         "command": command, "exitCode": run.returncode})
    assert run.returncode == 0, (name, run.stdout, run.stderr)
    return json.loads(run.stdout)


def author_text():
    for locale, name in EDITIONS:
        file = target(name) / "lesson.template.json"
        doc = edition.load(file)
        if not (target(name) / "lesson.before-author.json").exists():
            save(target(name) / "lesson.before-author.json", doc)
        doc["locale"] = locale
        doc["title"] = CONTENT[locale]["title"]
        doc["printed_title"] = RAW["printed_title"]
        for i, block in enumerate(doc["prose"]):
            block["text"] = CONTENT[locale]["texts"][i]
            if locale == "en" and block["kind"] in ("fig", "cap"):
                block["label"] = "Figure 286"
            block["changes"] = (
                ["wording", "layout"] + (["translation"] if locale == "en" else [])
                if block["text"] != block["source_text"] else []
            )
        if locale == "en":
            doc["figures"][0]["label"] = "Figure 286"
        edition.normalize_lesson_layout(doc)
        save(file, doc)
        flow = native(locale + "-prose-flow", [
            "node", str(W / ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs"),
            "--json", str(file)])
        save(E / (locale + "-prose-flow.json"), flow)
        # Anchors come from the native final-paragraph stream, never block counts.
        starts = [doc["prose"][i]["text"].split("\n\n")[0] for i in (5, 10)]
        paragraphs = [p["text"] for p in flow["paragraphs"]]
        doc["section_breaks"] = []
        for after in starts:
            position = paragraphs.index(after)
            assert position > 0
            doc["section_breaks"].append({
                "before": paragraphs[position - 1], "after": paragraphs[position]})
        save(file, doc)
    print("Authored both editions from native snapshots; no finalize.")


def spec():
    height = 640
    objects, assertions, inventory = [], [], []

    def user(p):
        return [round(p[0], 6), round(height - p[1], 6)]

    def line(id_, a, b, arrow=False, stroke="ink", width=2, dash=0):
        objects.append({"id": id_, "type": "arrow" if arrow else "segment",
                        "from": user(a), "to": user(b), "stroke": stroke,
                        "strokeWidth": width, "dash": dash})
        if arrow:
            assertions.append({"id": id_ + "-connects", "type": "connects",
                               "arrow": id_, "from": user(a), "to": user(b)})
        return id_

    def text(id_, at, label, size=22, role="ink"):
        objects.append({"id": id_, "type": "text", "at": user(at),
                        "text": label, "fontSize": size, "labelColor": role,
                        "labelPlacement": {"position": "CENTER", "offset": [0, 0]}})
        return id_

    def group(id_, description, ids, assertion_ids):
        inventory.append({"id": id_, "description": description, "objects": ids,
                          "assertions": assertion_ids})

    def ellipse(cx, cy, rx, ry, angle, t):
        x, y = rx * math.cos(t), ry * math.sin(t)
        return [cx + x * math.cos(angle) - y * math.sin(angle),
                cy + x * math.sin(angle) + y * math.cos(angle)]

    rim = [ellipse(300, 370, 112, 188, 0, i * math.tau / 72) for i in range(72)]
    objects.append({"id": "source-circular-loop", "type": "polygon",
                    "points": [user(p) for p in rim], "stroke": "ink",
                    "strokeWidth": 2.5, "fill": "accentSoft", "opacity": 0.5})
    left_rim = []
    for k in range(18, 54):
        left_rim.append(line(f"source-heavy-left-rim-{k}",
                            rim[k], rim[(k + 1) % 72], width=3))
    hatch = []
    # Sparse clipping to the oval keeps source diagonal hatching without scan texture.
    for j in range(-5, 6):
        samples = []
        for x in range(189, 412):
            y = -1.4 * (x - 300) + 370 + j * 45
            if ((x - 300) / 112) ** 2 + ((y - 370) / 188) ** 2 <= 0.93:
                samples.append([x, y])
        if len(samples) > 1:
            hatch.append(line(f"modern-hatch-{j+5}", samples[0], samples[-1],
                              stroke="grid", width=1))
    group("source-loop-area", "Source pixels: one upright perspective oval for the circular loop, with diagonal hatching and heavier left edge. Modern addition: a regular polygon approximation, sparse hatch density and neutral area fill; hatch count is not source data.",
          ["source-circular-loop"] + left_rim + hatch, [])
    traces = []
    for i, level in enumerate([-2, -1, 0, 1, 2], 1):
        path_ids = []
        points = []
        for k in range(25):
            x = 70 + k * 20
            y = 370 + level * (61 + 0.0008 * (x - 300) ** 2)
            points.append([x, y])
        for k, (a, b) in enumerate(zip(points, points[1:])):
            path_ids.append(line(f"source-field-{i}-{k}", a, b, k == 23,
                                 stroke="accent", width=2.5))
        traces += path_ids
        group(f"source-field-trace-{i}",
              f"Source trace{i}, of five: traverses the loop left-to-right, with an outgoing rightward arrow. Upper/lower traces bend away vertically; the middle trace is axial. Modern regularization: smooth sampled curve, not a measured field map.",
              path_ids, [path_ids[-1] + "-connects"])
    labels = [text("source-B-label", [586, 192], "B", 25, "accent"),
              text("source-right-B-prime-label", [473, 319], "B'", 25),
              text("source-left-B-prime-label", [64, 469], "B'", 25)]
    group("source-labels", "Source pixels contain B at top-right and B-prime at upper-right and lower-left; retain all three mathematical labels.", labels, [])
    for side, cx, cy, rx, ry, angle in [
        ("left", 185, 408, 79, 24, 0.17),
        ("right", 430, 370, 49, 15, 0.0),
    ]:
        ids = []
        arrow_start, arrow_end = (3, 7) if side == "left" else (9, 13)
        for k in range(16):
            if arrow_start < k < arrow_end:
                continue
            a = ellipse(cx, cy, rx, ry, angle, math.pi + k * math.pi / 16)
            end = arrow_end if k == arrow_start else k + 1
            b = ellipse(cx, cy, rx, ry, angle, math.pi + end * math.pi / 16)
            ids.append(line(f"source-{side}-circulation-upper-{k}", a, b,
                            arrow=k == arrow_start,
                            width=2.3))
        for k in range(16):
            if k % 2:
                continue
            a = ellipse(cx, cy, rx, ry, angle, k * math.pi / 16)
            b = ellipse(cx, cy, rx, ry, angle, (k + 1) * math.pi / 16)
            ids.append(line(f"source-{side}-circulation-lower-dash-{k}", a, b, width=2.3))
        arrow_id = f"source-{side}-circulation-upper-{arrow_start}"
        group(f"source-{side}-circulation",
              f"Source pixels: small {side} oval trace beside/crossing the rim near the middle field trace, solid upper part and dashed lower part. Upper arrow proceeds locally rightward (left: rising; right: descending). This is a visual correspondence only. HOLD: the detailed physical identity of this circulation is unresolved; do not infer a lower arrowhead or relabel the trace as current or a local field vector.",
              ids, [arrow_id + "-connects"])
    for prefix, x, label, role in [
        ("text-applied-field", 90, "B", "accent"),
        ("text-induced-field", 370, "B'", "ink"),
    ]:
        a, b = [x, 68], [x + 145, 68]
        arrow = line(prefix + "-direction", a, b, True, role, 3)
        t = text(prefix + "-label", [x + 72, 35], label, 25, role)
        group(prefix, "Justified modern text-binding addition, not a source pixel object: a direction arrow for the field inside the loop. The paired arrows both point right, exactly matching the positive convention in the whole edition text.",
              [arrow, t], [arrow + "-connects"])
    assertions.append({"id": "text-fields-parallel", "type": "parallel",
                       "a": [90, 572], "b": [235, 572],
                       "c": [370, 572], "d": [515, 572]})
    inventory[-1]["assertions"].append("text-fields-parallel")
    top = text("text-decreasing-flux", [320, 117], "Decreasing flux", 22)
    bottom = text("text-positive-convention", [320, 605], "Positive current and EMF", 22)
    group("text-convention", "Modern text-binding captions identify decreasing flux and the positive-current/EMF case. They are not claims of additional source-image words or an increasing-flux subfigure.", [top, bottom], [])
    whole_text = []
    bindings = []
    for locale, name in EDITIONS:
        file = target(name) / "lesson.template.json"
        doc = edition.load(file)
        whole_text.append({"lesson": ID, "text": f"{locale.upper()}: {doc['title']}\n" +
                          "\n\n".join(b["text"] for b in doc["prose"] if b["text"])})
        bindings.append({"edition": name, "locale": locale, "template": bind(file),
                         "source": bind(BOOK / "lessons" / ID / "lesson.json"),
                         "source_refs": [b["source_refs"] for b in doc["prose"]]})
    common = {
        "schema": "ld-s10y-image/figure-spec@2", "id": "fig-286",
        "mode": "deterministic",
        "description": "Circular conducting loop in decreasing applied magnetic flux. Five field traces, all B/B-prime labels and both small directed solid/dashed circulation details are retained as readable schematic structure. Paired modern arrows explicitly show B and B-prime aligned inside the loop under the source's positive convention. Circulation semantics remain HOLD; this first-author candidate is not approved.",
        "source": {"image": bind(W / ".tmp/ld-s10y-lesson/9p/pages/0311/figures/fig-286.png"),
                   "authoritativeText": whole_text, "inventory": inventory},
        "canvas": {"width": 640, "height": height, "boundingBox": [0, height, 640, 0],
                   "background": "paper", "keepAspectRatio": True},
        "display": {"layout": "scroll", "purpose": "instructional",
                    "minTextPx": 16, "widths": [640]},
        "objects": objects, "assertions": assertions, "layout": {"minLabelGap": 8},
    }
    save(E / "bilingual-text-bindings.json", {
        "bindings": bindings, "sameGeometryAndLabels": True, "sourceRefsDerived": True,
        "modernFigureSemanticHold": "Detailed physical identity of source circulation traces.",
    })
    for _, name in EDITIONS:
        folder = O / "figures" / name
        save(folder / "fig-286.spec.json", copy.deepcopy(common))
        figures_file = target(name) / "figures.template.json"
        doc = edition.load(figures_file)
        row = doc["figures"][0]
        row.update({"mode": "deterministic", "spec": "figures/fig-286.spec.json",
                    "svg": "figures/fig-286.svg", "render": "figures/fig-286.render.json",
                    "review": "figures/fig-286.review.json"})
        if name.endswith("-en"):
            row["label"] = "Figure 286"
        save(figures_file, doc)
    print(f"One common geometry: {len(objects)} JSXGraph objects, {len(assertions)} assertions, {len(inventory)} inventory groups.")


def validate():
    profile = edition.load(W / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
    reports, all_errors = [], []
    for locale, name in EDITIONS:
        doc = edition.load(target(name) / "lesson.template.json")
        exercises = edition.load(target(name) / "exercises.template.json")
        figures = edition.load(target(name) / "figures.template.json")
        errors = edition.validate_lesson_identity(RAW, doc)
        errors += edition.validate_source(BOOK, doc["source"], BOOK / "lessons" / ID / "lesson.json", "lesson")
        errors += edition.validate_source(BOOK, exercises["source"], BOOK / "lessons" / ID / "exercises.json", "exercises")
        # Native authoritative reconstruction validates populated refs without rewriting raw.
        errata = edition.source_errata(BOOK, RAW, edition.load(BOOK / "lessons" / ID / "exercises.json"))
        assert errata == doc["errata"] == []
        errors += edition.validate_figure_references(doc["prose"], [], figures["figures"])
        blocks, items = [], []
        for i, (raw, modern) in enumerate(zip(RAW["prose"], doc["prose"])):
            assert modern["source_text"] == raw["text"]
            for field in ["kind", "id", "printed_page", "source_refs"]:
                assert modern[field] == raw[field], (i, field)
            assert edition.same_figure_label(raw["label"], modern["label"], locale)
            block_errors = edition.validate_text(raw["text"], modern["text"],
                modern["changes"], modern["numeric_changes"], f"{locale}.prose[{i}]",
                profile["forbidden_terms"] + profile["forbidden_person_names"],
                modern["historical_entities"])
            block_errors += mathcheck.check_delimiters(modern["text"])
            for tex, display in mathcheck.find_math_spans(modern["text"]):
                items.append({"id": f"{locale}-{i}", "tex": tex, "display": display, "field": "text"})
            blocks.append({"index": i, "kind": raw["kind"], "source_refs": raw["source_refs"],
                           "sourceMath": edition.math_signature(raw["text"]),
                           "modernMath": edition.math_signature(modern["text"]), "errors": block_errors})
            errors += block_errors
        results = native(locale + "-katex", ["node", str(W / ".claude/skills/ld-s10y-lesson/tools/katex_check.js")], json.dumps(items))
        errors += [str(r) for r in results if not r.get("ok")]
        flow, flow_errors = edition.prose_flow_contract(doc["prose"], doc["section_breaks"])
        errors += flow_errors
        native_flow = native(locale + "-prose-flow-final", ["node",
            str(W / ".claude/skills/ld-s10y-lesson/tools/prose_flow.mjs"), "--json",
            str(target(name) / "lesson.template.json")])
        assert flow == native_flow
        assert len(doc["prose"]) == len(RAW["prose"]) == 15
        assert sum(b["kind"] == "p" for b in doc["prose"]) == 13
        assert exercises["count"] == doc["exercise_count"] == 0 and exercises["exercises"] == []
        assert "$\\mathcal{E}_i$" in doc["prose"][8]["text"]
        assert [b["id"] for b in doc["prose"] if b["kind"] == "fig"] == ["fig-286"]
        reports.append({"locale": locale, "errors": errors, "blocks": blocks,
                        "paragraphs": len(flow["paragraphs"]), "flow": flow,
                        "mathTokens": len(items)})
        all_errors += errors
    save(E / "native-text-validation.json", {
        "role": "FIRST_AUTHOR", "status": "pass" if not all_errors else "fail",
        "reports": reports, "errors": all_errors, "rawEntries": 15, "proseEntries": 13,
        "figureCount": 1, "writtenTasks": 0, "adaptFinalize": False,
        "fullLessonValidationNotInvoked": "Independent modern review and installed assets do not exist.",
    })
    print(json.dumps({"status": "pass" if not all_errors else "fail", "errors": all_errors}))
    if all_errors:
        sys.exit(2)


if sys.argv[1] == "text":
    author_text()
elif sys.argv[1] == "figure":
    spec()
elif sys.argv[1] == "validate":
    validate()
elif sys.argv[1] == "retain-first-failure":
    for _, name in EDITIONS:
        for file in target(name).glob("*.template.json"):
            save(E / "first-validation-failure" / name / file.name, edition.load(file))
        file = O / "figures" / name / "fig-286.spec.json"
        save(E / "first-validation-failure" / name / file.name, edition.load(file))
    save(E / "first-validation-failure/native-text-validation.json",
         edition.load(E / "native-text-validation.json"))
elif sys.argv[1] == "retain-marker-failure":
    for _, name in EDITIONS:
        file = O / "figures" / name / "fig-286.spec.json"
        save(E / "marker-execution-failure" / name / file.name, edition.load(file))
elif sys.argv[1] == "retain-rim-before":
    for _, name in EDITIONS:
        folder = O / "figures" / name
        for file in folder.iterdir():
            if file.is_file():
                destination = E / "rim-visual-before" / name / file.name
                destination.parent.mkdir(parents=True, exist_ok=True)
                assert not destination.exists()
                destination.write_bytes(file.read_bytes())
