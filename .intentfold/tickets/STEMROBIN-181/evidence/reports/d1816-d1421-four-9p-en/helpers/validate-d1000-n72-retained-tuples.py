import hashlib
import json
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition

card = sys.argv[1] if len(sys.argv) > 1 else "phy9-c2-s2-n72"
task = sys.argv[2] if len(sys.argv) > 2 else "D1000"
book = sys.argv[3] if len(sys.argv) > 3 else "9p"
assert book in ("9p", "10p")
configurations = {
    "phy9-c1-s3-n34": {"task": "D1399", "objects": 20, "figures": {"tbl-p0085-01": "generated"}, "images": 6,
                      "inventoryHash": "62db9a883b5d1fddbf2f493bc2ca24105cb03255ec363172d5cbf118f919f6b3",
                      "inventoryDimensionsKey": "recordedOutputDimensions", "sourceFigureCount": 1,
                      "preserveDisplay": True, "lessonScopedContext": True},
    "phy9-c1-s3-n35": {"task": "D1406", "objects": 21, "figures": {"fig-51": "deterministic", "fig-52": "deterministic", "fig-53": "deterministic"}, "images": 10,
                      "inventoryHash": "62db9a883b5d1fddbf2f493bc2ca24105cb03255ec363172d5cbf118f919f6b3",
                      "sourceFigureCount": 3, "preserveDisplay": True, "lessonScopedContext": True},
    "phy9-c1-s4-n38": {"task": "D1413", "objects": 16, "figures": {"fig-54": "deterministic", "fig-55": "deterministic"}, "images": 8,
                      "inventoryHash": "62db9a883b5d1fddbf2f493bc2ca24105cb03255ec363172d5cbf118f919f6b3",
                      "sourceFigureCount": 2, "preserveDisplay": True, "lessonScopedContext": True},
    "phy9-c1-s4-n39": {"task": "D1420", "objects": 12, "figures": {"fig-56": "deterministic", "fig-55": "deterministic"}, "images": 8,
                      "inventoryHash": "62db9a883b5d1fddbf2f493bc2ca24105cb03255ec363172d5cbf118f919f6b3",
                      "sourceFigureCount": 1, "preserveDisplay": True, "lessonScopedContext": True},
    "phy9-c1-s2-n22": {"task": "D1359", "objects": 25, "figures": {"fig-35": "deterministic", "fig-36": "deterministic"}, "images": 8,
                      "inventoryHash": "6e70336e54880dd2aa6b912061221f1ccca7f993ae87acc2a28262d468a28e46"},
    "phy9-c1-s2-n25": {"task": "D1366", "objects": 16, "figures": {"fig-40": "deterministic", "fig-41": "deterministic"}, "images": 8,
                      "inventoryHash": "6e70336e54880dd2aa6b912061221f1ccca7f993ae87acc2a28262d468a28e46"},
    "phy9-c1-s2-n26": {"task": "D1373", "objects": 13, "figures": {"fig-42": "generated", "fig-43": "deterministic"}, "images": 8,
                      "inventoryHash": "6e70336e54880dd2aa6b912061221f1ccca7f993ae87acc2a28262d468a28e46",
                      "inventoryDimensionsKey": "recordedOutputDimensions"},
    "phy9-c1-s3-n29": {"task": "D1380", "objects": 15, "figures": {"fig-45": "deterministic", "fig-46": "deterministic"}, "images": 8,
                      "inventoryHash": "6e70336e54880dd2aa6b912061221f1ccca7f993ae87acc2a28262d468a28e46"},
    "phy9-c1-s2-n10": {"task": "D1314", "objects": 9, "figures": {"fig-15": "deterministic", "fig-16": "deterministic"}, "images": 8},
    "phy9-c1-s2-n15": {"task": "D1321", "objects": 14, "figures": {"fig-22": "deterministic"}, "images": 6},
    "phy9-c1-s2-n18": {"task": "D1328", "objects": 14, "figures": {"fig-25": "deterministic"}, "images": 6},
    "phy9-c1-s2-n20": {"task": "D1335", "objects": 35, "figures": {"fig-27": "generated", "fig-28": "deterministic"}, "images": 8},
}
config = configurations.get(card)
inventory = display = None
if config:
    assert book == "9p" and task == config["task"]
    evidence = repo / f".intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-{task.lower()}-{card.split('-')[-1]}-first-complete-en"
    inventory_path = evidence / "received-inventory.original.json"
    assert hashlib.sha256(inventory_path.read_bytes()).hexdigest() == config.get("inventoryHash", "a82ba906d1f347c9e88b000f737bd9b576387a10019fcfe06e1dfb5f8abe821a")
    inventory = edition.load(inventory_path)
    display_path = evidence / "full-course-dom.original.json"
    display = edition.load(display_path)
    assert display["status"] == "TWO_COMPLETE_EN_COURSE_DOM_VIEWS_PASS_BOUNDED_PIXELS_PENDING"
    assert display["browserClosed"] and display["offline"] and not display["requests"]
    assert display["browserMode"] == "isolated-headless" and not display["headedAcceptanceClaimed"]
    assert len(display["views"]) == 2
    assert sum(2 + len(view["figureScreenshots"]) for view in display["views"]) == config["images"]
root = repo / f"ssot-resources/soviet10year-textbooks/artifacts/{book}/editions/modern-us-neutral-en"
manifest = edition.load(root / "lessons" / card / "figures.json")
if config:
    assert {entry["id"]: entry["mode"] for entry in manifest["figures"]} == config["figures"]
    lesson = edition.load(root / "lessons" / card / "lesson.json")
    assert len(lesson["prose"]) == config["objects"]
    if "sourceFigureCount" in config:
        assert len(lesson["source"]["data"]["figures"]) == config["sourceFigureCount"]
errors = []
for entry in manifest["figures"]:
    figure = entry["id"]
    spec = edition.load(root / "figures" / f"{figure}.spec.json")
    generated = spec.get("mode") == "generated"
    if generated:
        assert book == "9p" and (card in ("phy9-c1-s1-n1", "phy9-c1-s1-n2", "phy9-c1-s1-n3", "phy9-c1-s2-n20", "phy9-c1-s2-n26")
                                or config and config["figures"].get(figure) == "generated")
        assert not any(entry.get(key) for key in ("svg", "render", "artwork"))
        files = {key: root / entry[key] for key in ("spec", "png", "generation", "review")}
        evidence_name, output_name = "generation", "png"
        errors.extend(edition.validate_generation_metadata(
            files["generation"], spec, entry, files["png"]))
    else:
        if config:
            assert spec["mode"] == "deterministic"
            assert not any(key in entry for key in ("png", "generation", "artwork"))
        files = {key: root / "figures" / f"{figure}.{extension}"
                 for key, extension in [("spec", "spec.json"), ("svg", "svg"),
                                        ("render", "render.json"), ("review", "review.json")]}
        evidence_name, output_name = "render", "svg"
    errors.extend(edition.validate_review(
        files["review"], files["spec"], evidence_name, files[evidence_name],
        {output_name: files[output_name]}, figure))
    review = edition.load(files["review"])
    historical_source = Path(review["source"]["path"])
    source = repo / f"ssot-resources/soviet10year-textbooks/artifacts/{book}/figures" / f"{figure}.png"
    assert historical_source.as_posix().endswith(
        f"ssot-resources/soviet10year-textbooks/artifacts/{book}/figures/{figure}.png")
    assert spec["source"]["image"]["sha256"] == review["source"]["sha256"]
    assert hashlib.sha256(source.read_bytes()).hexdigest() == review["source"]["sha256"]
    if config:
        original = next(item for item in inventory["figureTuples"] if item["card"] == card and item["id"] == figure)
        assert original["mode"] == spec["mode"]
        assert original["source"]["sha256"] == review["source"]["sha256"]
        assert (repo / spec["source"]["image"]["path"]).resolve() == source
        assert (repo / review["source"]["path"]).resolve() == source
        assert hashlib.sha256(files[output_name].read_bytes()).hexdigest() == original["sha256ByFile"][f"figures/{figure}.{output_name}"]
        if config.get("preserveDisplay"):
            for key in ("purpose", "layout", "maxWidthPx", "minTextPx"):
                assert spec["display"][key] == original["display"][key]
            assert set(original["display"]["widths"]).issubset(spec["display"]["widths"])
        else:
            assert spec["display"]["purpose"] == "instructional"
            assert spec["display"]["layout"] == "inline" and spec["display"]["maxWidthPx"] == 640
        if config.get("lessonScopedContext"):
            projected = "\n\n".join([lesson["printed_title"], *[block["text"] for block in lesson["prose"]]])
            assert [row for row in spec["source"]["authoritativeText"] if row["lesson"] == card] == [
                {"lesson": card, "text": projected}]
            shared = review.get("sharedCanonicalContextReconciliation")
            original_spec_path = repo / f"ssot-resources/soviet10year-textbooks/artifacts/{book}/editions/modern-us-neutral/figures/{figure}.spec.json"
            original_spec = edition.load(original_spec_path)
            if shared:
                assert shared["affectedLesson"] == card and shared["reviewedOwnLessonContextUnchanged"]
                prior_spec_path = Path(shared["priorTuple"]["spec"]["path"])
                assert hashlib.sha256(prior_spec_path.read_bytes()).hexdigest() == shared["priorTuple"]["spec"]["sha256"]
                prior_spec = edition.load(prior_spec_path)
            else:
                first_native = edition.load(evidence / "first-native-result.original.json")
                metadata = next(asset for asset in first_native["rows"][0]["assets"] if asset["id"] == figure)
                reviewed_spec_path = evidence / "first-english-tuples" / figure / f"{figure}.spec.json"
                assert hashlib.sha256(reviewed_spec_path.read_bytes()).hexdigest() == metadata["spec"]["sha256"]
                prior_spec = edition.load(reviewed_spec_path)
            assert [row["lesson"] for row in spec["source"]["authoritativeText"]] == [
                row["lesson"] for row in original_spec["source"]["authoritativeText"]]
            other_rows = lambda value: [row for row in value["source"]["authoritativeText"] if row["lesson"] != card]
            assert other_rows(spec) == other_rows(prior_spec)
        assert not review.get("completeEnglishAccessibilityApproval", False)
        actual = review["actualWidthReconciliation"]
        assert actual["actualDisplay"]["sha256"] == hashlib.sha256(display_path.read_bytes()).hexdigest()
        assert not actual["currentSuppliedSavedPixelReviewPending"]
        for view in display["views"]:
            media = next(item for item in view["geometry"]["figures"] if item["id"] == figure)
            width = media["actualMediaWidth"]
            assert width > 0 and width <= spec["display"]["maxWidthPx"] + 0.01
            assert width in spec["display"]["widths"]
            assert view["geometry"]["fontsLoaded"]
            if generated:
                generation = edition.load(files["generation"])
                assert hashlib.sha256(files["generation"].read_bytes()).hexdigest() == original["sha256ByFile"][f"figures/{figure}.png.json"]
                image = media["image"]
                assert image["sha256"] == generation["output"]["sha256"]
                dimensions = original[config.get("inventoryDimensionsKey", "outputDimensions")]
                assert isinstance(dimensions, list) and len(dimensions) == 2
                assert all(isinstance(value, int) and not isinstance(value, bool) and value > 0 for value in dimensions)
                assert [image["naturalWidth"], image["naturalHeight"]] == dimensions
                assert image["naturalWidth"] == generation["output"]["width"] and image["naturalHeight"] == generation["output"]["height"]
                assert image["complete"] and abs(image["width"] - width) < 0.01
                assert abs(image["height"] - width * image["naturalHeight"] / image["naturalWidth"]) < 0.1
                if spec["display"]["purpose"] == "decorative":
                    assert spec["display"]["maxWidthPx"] == 160 and width == 160
            else:
                render = edition.load(files["render"])
                assert render["status"] == "pass" and render["spec"]["sha256"] == hashlib.sha256(files["spec"].read_bytes()).hexdigest()
                assert render["output"]["svg"]["sha256"] == original["sha256ByFile"][f"figures/{figure}.svg"]
                assert len(media["labels"]) == render["labels"]
                for label in media["labels"]:
                    assert label["fontCheck"] and label["pixels"] >= spec["display"]["minTextPx"] - 0.01
                    assert label["renderedFonts"]
                    assert all(font["glyphCount"] > 0 and font["familyName"]
                               for font in label["renderedFonts"])
                assert any(abs(check["width"] - width) < 0.01 and check["status"] == "pass" for check in render["displayChecks"])
print(json.dumps({"task": task, "status": "PASS" if not errors else "FAIL",
                  "figures": len(manifest["figures"]), "errors": errors, "scope": "First canonical EN tuple bindings only",
                  **({"actualDisplayWidthsAndFontPngEvidenceBound": True, "rendererCalls": 0,
                      "completeEnglishAccessibilityApproval": False, "historicalChineseScienceApprovalRecovered": False}
                     if config else {})}))
sys.exit(1 if errors else 0)
