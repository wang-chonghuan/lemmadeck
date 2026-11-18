import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parent
repo = root.parents[4]
sys.dont_write_bytecode = True
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
import edition


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


baseline = read(root / "inputs-before.json")
original_path = next(
    Path(item["path"])
    for item in baseline["inputs"]
    if item["path"].endswith("/lesson.template.json")
)
original = read(original_path)
profile = read(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = [
    *profile.get("forbidden_terms", []),
    *profile.get("forbidden_person_names", []),
]
errors = []
block_checks = []
for name in ["lesson.template.json", "english.lesson.template.json"]:
    candidate = read(root / "candidate" / name)
    assert candidate["source"] == original["source"]
    assert len(candidate["prose"]) == 26
    for field in edition.IDENTITY_FIELDS:
        assert candidate.get(field) == original.get(field), (name, field)
    assert candidate["figures"] == original["figures"]
    assert candidate["errata"] == original["errata"] == []
    for index, (source, modern) in enumerate(zip(original["prose"], candidate["prose"])):
        for field in ["kind", "id", "label", "printed_page", "source_refs", "source_text"]:
            assert modern.get(field) == source.get(field), (name, index, field)
        block_errors = edition.validate_text(
            source["source_text"],
            modern["text"],
            modern["changes"],
            modern["numeric_changes"],
            f"{name}.prose[{index}]",
            forbidden,
            modern["historical_entities"],
        )
        assert edition.math_signature(source["source_text"]) == edition.math_signature(modern["text"])
        assert edition.prose_number_signature(source["source_text"]) == edition.prose_number_signature(modern["text"])
        assert "$$" not in modern["text"]
        if modern["kind"] != "fig":
            assert modern["text"].strip()
        errors.extend(block_errors)
        block_checks.append({
            "file": name,
            "blockIndex": index,
            "sourceRefs": modern["source_refs"],
            "mathSignature": edition.math_signature(modern["text"]),
            "numberSignature": edition.prose_number_signature(modern["text"])[0],
            "status": "FAIL" if block_errors else "PASS-SCOPED-TEXT",
            "errors": block_errors,
        })
    assert candidate["status"] == "draft"

exercise_baseline_path = original_path.with_name("exercises.template.json")
exercise_baseline = read(exercise_baseline_path)
for name in ["exercises.template.json", "english.exercises.template.json"]:
    ex = read(root / "candidate" / name)
    assert ex["source"] == exercise_baseline["source"]
    assert ex["lesson"] == "phy10-c2-s2-n70"
    assert ex["count"] == 0 and ex["exercises"] == []
    assert ex["status"] == "draft"

fig_original = read(original_path.with_name("figures.template.json"))
fig_candidate = read(root / "candidate/figures.template.json")
assert len(fig_candidate["figures"]) == 6
for before, after in zip(fig_original["figures"], fig_candidate["figures"]):
    for field in ["id", "label", "source", "spec"]:
        assert after[field] == before[field]
    assert after["status"] == "pending-FIG"
    assert after["changes"] == []
    assert after["association_only"]
    assert not after["source_pixels_observed_in_this_authoring"]
    assert not (root / "candidate" / after["spec"]).exists()
    assert not any(key in after for key in ["render", "review", "svg", "png", "artwork", "generation"])

mapping = read(root / "source-sentence-mapping.json")
assert mapping["sourceSentenceCount"] == mapping["mappedSourceSentenceCount"] == 45
assert not mapping["missingSourceSentences"]
assert all(item["zh"] and item["en"] and item["mappedUnitIds"] for item in mapping["mappings"])
assert not any(
    int(ref.split("#")[1]) > 6
    for block in original["prose"]
    for ref in block["source_refs"]
    if ref.startswith("p0185#")
)
assert not list((root / "candidate").rglob("*.png"))
assert not list((root / "candidate").rglob("*.svg"))
result = {
    "schema": "STEMROBIN-181/n70-scoped-text-check@1",
    "status": "FAIL" if errors else "PASS-SCOPED-STRUCTURE-TEXT-ONLY",
    "errors": errors,
    "blockChecks": block_checks,
    "count": {"languages": 2, "blocksPerLanguage": 26, "sourceSentences": 45, "exercisesPerLanguage": 0},
    "checks": [
        "Complete source snapshot equality and unchanged source hashes",
        "Original metadata, prose kind/order/identity/source_refs/source_text retained",
        "Existing edition.validate_text on every bilingual block",
        "Exact existing math signatures and reference/number signatures retained",
        "All source sentences mapped into nonempty bilingual text",
        "Original empty exercises retained in both languages",
        "Only six associated pending figures, no figure artifacts or ready claims",
        "No imported n71 source_refs",
    ],
    "notRun": [
        "Full edition.validate_lesson",
        "Source/native finalize",
        "SCI or ZHEN independent review",
        "FIG spec/render/review",
        "HTML, browser, screenshot, DISPLAY or product acceptance",
        "Git, DB, publication or index/meter operations",
    ],
    "normalizationNote": "Authored complete sentences and explicit paragraph groups are preserved here. No adapt-finalize normalization or native action was run.",
}
target = root / (sys.argv[1] if len(sys.argv) > 1 else "text-check.json")
assert target.parent == root
with target.open("x", encoding="utf-8") as output:
    json.dump(result, output, ensure_ascii=False, indent=2)
    output.write("\n")
print(json.dumps({"status": result["status"], "errorCount": len(errors), "blocksChecked": len(block_checks)}))
if errors:
    sys.exit(1)
