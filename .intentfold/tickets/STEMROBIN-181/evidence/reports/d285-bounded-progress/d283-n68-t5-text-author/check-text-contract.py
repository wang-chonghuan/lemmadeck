import hashlib
import json
import sys
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tools"))
import edition as E


def read(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


bindings = read(OUT / "source-binding.json")
profile = read(ROOT / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
reports = []
errors = []
for card in bindings["cards"]:
    originals = {
        name: read(next(t["nativePrepared"]["path"] for t in card["templates"] if t["name"] == name))
        for name in ("lesson", "exercises", "figures")
    }
    for language in ("zh", "en"):
        folder = OUT / "frozen" / card["alias"] / language
        lesson = read(folder / "lesson.template.json")
        exercises = read(folder / "exercises.template.json")
        figure_path = folder / "figures.template.json"
        figures = read(figure_path)
        original_figure_path = next(t["nativePrepared"]["path"] for t in card["templates"] if t["name"] == "figures")
        assert figure_path.read_bytes() == Path(original_figure_path).read_bytes()
        assert figures == originals["figures"]
        for field in E.IDENTITY_FIELDS:
            assert lesson.get(field) == originals["lesson"].get(field), field
        for name, doc in (("lesson", lesson), ("exercises", exercises)):
            assert doc["source"] == originals[name]["source"]
            assert doc["status"] == "draft"
        assert lesson["errata"] == originals["lesson"]["errata"] == []
        assert len(lesson["prose"]) == len(originals["lesson"]["prose"])
        assert len(exercises["exercises"]) == len(originals["exercises"]["exercises"])
        targets = []
        for name, items in (("prose", lesson["prose"]), ("exercises", exercises["exercises"])):
            source_items = originals["lesson"]["prose"] if name == "prose" else originals["exercises"]["exercises"]
            for index, (source, authored) in enumerate(zip(source_items, items)):
                label = f"{card['alias']}/{language}/{name}[{index}]"
                assert authored["source_text"] == source["source_text"]
                fields = (
                    ("kind", "id", "label", "printed_page", "source_refs")
                    if name == "prose"
                    else ("number", "source_number", "group", "group_id", "pages", "figure_refs", "figures")
                )
                for field in fields:
                    assert authored.get(field) == source.get(field), f"{label}.{field}"
                assert authored["numeric_changes"] == []
                check = E.validate_text(
                    source["source_text"], authored["text"], authored["changes"],
                    authored["numeric_changes"], label, forbidden,
                    authored["historical_entities"], [], authored.get("notation_changes"),
                )
                if name == "exercises":
                    assert authored["lines"] == authored["text"].split("\n")
                    check.extend(E.validate_numbered_subpart_layout(authored["text"]))
                errors.extend(check)
                targets.append({
                    "target": label,
                    "errors": check,
                    "formulaSignatureUnchanged": E.math_signature(source["source_text"]) == E.math_signature(authored["text"]),
                    "numericAndReferenceSignatureUnchanged": E.prose_number_signature(source["source_text"]) == E.prose_number_signature(authored["text"]),
                    "sourceRefsAndIdentityUnchanged": True,
                    "authoredStatus": authored.get("author_review", {}).get("status", "INDEPENDENT-REVIEW-PENDING"),
                })
        reports.append({
            "card": card["card"], "language": language, "proseBlocks": len(lesson["prose"]),
            "exerciseCount": len(exercises["exercises"]),
            "figureTemplateSHA256": hashlib.sha256(figure_path.read_bytes()).hexdigest(),
            "targets": targets,
        })
print(json.dumps({
    "schema": "bounded-n68-t5-native-text-contract-only-check@1",
    "mechanicalStatus": "MATCH" if not errors else "FAIL",
    "reports": reports, "errors": errors,
    "nativeHelper": "edition.validate_text / math_signature / prose_number_signature",
    "fullAdaptFinalizeInvoked": False, "renderInvoked": False,
    "SCI": "PENDING-NOT-PROVEN-BY-MECHANICAL-CHECK",
    "ZHEN": "PENDING-NOT-PROVEN-BY-MECHANICAL-CHECK",
    "independentPASS": False, "wholeCardPASS": False, "newImages": 0,
}, ensure_ascii=False, indent=2))
sys.exit(1 if errors else 0)
