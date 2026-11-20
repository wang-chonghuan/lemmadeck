"""One focused, read-only check of the authored N8 text carriers."""

import copy
import hashlib
import json
from pathlib import Path
import sys

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition
import mathcheck

REPORT_DIR = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d140-n8-text-author"
PREPARED = REPORT_DIR / "prepared.json"
EXPECTED_PREPARED = "c42c631d3554241ddbf7d1016e5af74fa64447a02f48aeeadf7b566dcfde11e2"
LESSON = "phy9-c1-s1-n8"
LOCALES = ("modern-us-neutral", "modern-us-neutral-en")
NAMES = ("lesson.template.json", "exercises.template.json", "figures.template.json")


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def binding(path):
    data = path.read_bytes()
    return {
        "path": str(path),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


errors = []


def expect(condition, message):
    if not condition:
        errors.append(message)


prepared = load(PREPARED)
expect(binding(PREPARED)["sha256"] == EXPECTED_PREPARED, "prepared.json changed")
book = REPO / prepared["root"] / "9p"
work = REPO / prepared["work"] / "adapt/9p"
source_paths = [book / "lessons" / LESSON / name for name in
                ("lesson.json", "lesson.md", "exercises.json")]
source = load(source_paths[0])
source_exercises = load(source_paths[2])
for path in source_paths:
    suffix = f"/9p/lessons/{LESSON}/{path.name}"
    record = next(item for item in prepared["reused"] if item["path"].endswith(suffix))
    expect(binding(path)["sha256"] == record["sha256"], f"{path}: source changed")
expect(len(source["prose"]) == 13, "native source block count is not 13")
expect(source_exercises["count"] == 0 and source_exercises["exercises"] == [],
       "native source is not task-free")
expect(prepared["modernFigurePending"] == ["fig-05"], "unexpected pending figure")

profile_path = REPO / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"
profile = load(profile_path)
forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
template_bindings = []
locale_results = []
formula_checks = []
math_items = []
for locale in LOCALES:
    paths = [work / locale / "lessons" / LESSON / name for name in NAMES]
    lesson, exercises, figures = (load(path) for path in paths)
    template_bindings.extend(binding(path) for path in paths)
    errors.extend(edition.validate_source(book, lesson["source"], source_paths[0], "lesson"))
    errors.extend(edition.validate_source(book, exercises["source"], source_paths[2], "exercises"))
    errors.extend(edition.validate_lesson_identity(source, lesson))
    expect(lesson["locale"] == ("en" if locale.endswith("-en") else "zh"),
           f"{locale}: locale mismatch")
    expect(lesson["edition"] == exercises["edition"] == figures["edition"] == locale,
           f"{locale}: edition mismatch")
    expect((lesson["schema"], exercises["schema"], figures["schema"]) ==
           (edition.LESSON_SCHEMA, edition.EXERCISES_SCHEMA, edition.FIGURES_SCHEMA),
           f"{locale}: schema mismatch")
    expect(all(document["status"] == "draft" for document in (lesson, exercises, figures)),
           f"{locale}: pending carriers must remain draft")
    expect(len(lesson["prose"]) == len(source["prose"]), f"{locale}: block count changed")
    expect(lesson["errata"] == [], f"{locale}: errata introduced")
    normalized = copy.deepcopy(lesson)
    edition.normalize_lesson_layout(normalized)
    expect(normalized == lesson, f"{locale}: prose layout is not production-normalized")
    flow, flow_errors = edition.prose_flow_contract(lesson["prose"], lesson["section_breaks"])
    errors.extend(flow_errors)
    expect(len(flow.get("boundaries", [])) == 5, f"{locale}: boundary count mismatch")
    expect(all(isinstance(item, dict) and set(item) == {"before", "after"}
               for item in lesson["section_breaks"]), f"{locale}: non-anchor section break")
    changed = []
    for index, (before, after) in enumerate(zip(source["prose"], lesson["prose"])):
        label = f"{locale}.prose[{index}]"
        expect(after["source_text"] == before["text"], f"{label}: source_text changed")
        for field in ("kind", "id", "label", "printed_page", "source_refs"):
            if field == "label" and before["kind"] in ("fig", "cap"):
                expect(edition.same_figure_label(before[field], after[field], lesson["locale"]),
                       f"{label}: figure label identity changed")
            else:
                expect(before[field] == after[field], f"{label}: {field} changed")
        errors.extend(edition.validate_text(
            before["text"], after["text"], after["changes"], after["numeric_changes"],
            label, forbidden, after["historical_entities"],
        ))
        native_tokens = [match.group(0) for match in edition.MATH.finditer(before["text"])]
        authored_tokens = [match.group(0) for match in edition.MATH.finditer(after["text"])]
        expect(native_tokens == authored_tokens, f"{label}: exact formula token/order drift")
        formula_checks.append({
            "locale": lesson["locale"],
            "source_refs": before["source_refs"],
            "nativeTokens": native_tokens,
            "authoredTokensEqualInOrder": native_tokens == authored_tokens,
        })
        errors.extend(f"{label}: {error}" for error in mathcheck.check_delimiters(after["text"]))
        for tex, display in mathcheck.find_math_spans(after["text"]):
            math_items.append({"id": label, "field": "text", "tex": tex, "display": display})
        expect(after["numeric_changes"] == [], f"{label}: numeric change introduced")
        expect(after["historical_entities"] == [], f"{label}: historical entity introduced")
        if before["text"] != after["text"]:
            changed.append({"source_refs": before["source_refs"], "changes": after["changes"]})
        if lesson["locale"] == "en":
            expect(not edition.NON_ENGLISH_FIGURE_SCRIPT.search(after["text"]),
                   f"{label}: untranslated visible text")
        if before["kind"] == "fig":
            expect(after["text"] == "", f"{label}: instructions in figure placeholder")
    expect(exercises["count"] == 0 and exercises["exercises"] == [],
           f"{locale}: tasks introduced")
    expect([item["id"] for item in figures["figures"]] == ["fig-05"],
           f"{locale}: figure identity/order changed")
    figure = figures["figures"][0]
    expect(set(figure) == {"id", "label", "spec", "changes", "source"},
           f"{locale}: figure outputs or approvals introduced")
    expect(figure["spec"] == "figures/fig-05.spec.json", f"{locale}: spec contract changed")
    for kind in ("png", "svg"):
        inherited = next(item for item in prepared["reused"]
                         if item["path"].endswith(f"/9p/figures/fig-05.{kind}"))
        expect(figure["source"][kind] ==
               {"path": f"figures/fig-05.{kind}", "sha256": inherited["sha256"]},
               f"{locale}: figure source manifest changed")
    for before, after in zip(source["figures"], lesson["figures"]):
        expect(before["id"] == after["id"] and before["page"] == after["page"]
               and edition.same_figure_label(before["label"], after["label"], lesson["locale"]),
               f"{locale}: lesson figure declaration changed")
    expect(figure["label"] == ("Figure 5" if lesson["locale"] == "en" else "图 5"),
           f"{locale}: figure manifest label mismatch")
    errors.extend(edition.validate_figure_references(lesson["prose"], [], figures["figures"]))
    locale_results.append({
        "edition": locale,
        "locale": lesson["locale"],
        "sourceBlocks": len(lesson["prose"]),
        "finalParagraphs": len(flow.get("paragraphs", [])),
        "resolvedBoundaries": flow.get("resolvedBreaks", []),
        "changedProse": changed,
        "originalTasks": 0,
        "modernTasks": 0,
    })

katex_results = mathcheck.katex_validate(math_items)
for item in katex_results:
    expect(item.get("ok", False), f"KaTeX failed: {item}")

toc_bindings = []
metadata = {}
for language in ("zh", "en"):
    path = REPO / f"ssot-resources/soviet10year-textbooks/toc/9p/{language}.json"
    toc_bindings.append(binding(path))

    def visit(node, parents):
        if node.get("id") == LESSON:
            metadata[language] = {"title": node["title"], "parents": parents}
        for key in ("contents", "lessons", "topics"):
            for child in node.get(key, []):
                visit(child, parents + ([{"id": node["id"], "title": node["title"]}]
                                       if node.get("id") else []))

    visit(load(path), [])
key = lambda text: "".join(text.split())
expect(key(source["chapter"]) == key(metadata["zh"]["parents"][0]["title"]),
       "chapter has no exact normalized TOC localization")
expect(key(source["section"]) == key(metadata["zh"]["parents"][1]["title"]),
       "section has no exact normalized TOC localization")
english_lesson = load(work / LOCALES[1] / "lessons" / LESSON / NAMES[0])
expect(english_lesson["title"] == metadata["en"]["title"], "English title differs from TOC")

result = {
    "schema": "stemrobin181/n8-text-check@1",
    "status": "PASS" if not errors else "FAIL",
    "scope": "focused-read-only-text-check",
    "invocations": 1,
    "independentApproval": False,
    "prepared": binding(PREPARED),
    "sourceFiles": [binding(path) for path in source_paths],
    "templates": template_bindings,
    "locales": locale_results,
    "nativeFormulaOrderCheckInvocations": 1,
    "nativeFormulaOrder": formula_checks,
    "katexTokensChecked": len(math_items),
    "katexWarnings": [item for item in katex_results if item.get("warnings")],
    "localizationInputs": toc_bindings,
    "englishMetadata": metadata["en"],
    "productionCodeBindings": [binding(path) for path in (
        TOOLS / "edition.py", TOOLS / "mathcheck.py", TOOLS / "katex_check.js",
        TOOLS / "prose_flow.mjs", TOOLS / "htmlfrag.js",
        TOOLS / "render_lesson.js", profile_path,
    )],
    "imagesOpened": 0,
    "paidCalls": 0,
    "figurePending": ["fig-05"],
    "errors": errors,
}
print(json.dumps(result, ensure_ascii=False, indent=2))
sys.exit(0 if not errors else 1)
