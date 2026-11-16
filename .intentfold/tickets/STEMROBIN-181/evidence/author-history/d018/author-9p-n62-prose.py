"""Scoped n62 preparation, native layout normalization and author-contract freeze."""

from pathlib import Path
import copy
import json
import shutil
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[4]
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import edition
import mathcheck


LESSON = "phy9-c2-s2-n62"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9p"
RAW = BOOK / "lessons" / LESSON
WORK = ROOT / ".tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral"
TARGET = WORK / "lessons" / LESSON
TMP = Path(__file__).resolve().parent
BASELINE = TMP / "9p-n62-prepared-baseline.json"
BEFORE = TMP / "9p-n62-before-authoring.lesson.template.json"
FLOW = TMP / "9p-n62-prose-flow.json"
PREANCHOR_FLOW = TMP / "9p-n62-prose-flow-before-anchors.json"
FREEZE = TMP / "9p-n62-prose-freeze.json"
PROFILE = ROOT / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json"

TOPICS = {
    0: "Static classical regime, electrostatics and source-bound Coulomb1785.",
    1: "Cavendish/Maxwell historical note; manuscript and priority story explicitly source-attributed.",
    2: "Unmodified Coulomb portrait placeholder.",
    3: "Finite-body point-charge approximation, nonzero monopole and non-negligible shape/distribution limits.",
    4: "Charge elements and vector superposition for a given static distribution; conductor equilibrium.",
    5: "Coulomb1736-1806 caption; electric/magnetic/friction research, without invented priority.",
    6: "Vacuum law and conditional air approximation.",
    7: "Force sensitivity is conditional; complete torsion-balance B/A/a/c/b description.",
    8: "Unmodified fig106 placeholder.",
    9: "Unmodified fig106 caption.",
    10: "Identical isolated conducting spheres in symmetric surroundings: equilibrium, equal sharing, repeated halving and2/4 reduction.",
    11: "Magnitude form of vacuum static Coulomb law.",
    12: "Absolute charges and separation in the magnitude expression.",
    13: "Original equation8-2; magnitude versus sign-controlled direction.",
    14: "Unit-dependent proportionality coefficient and unit-charge/unit-distance interpretation.",
    15: "Analogy with gravitation does not equate mass, charge or attraction/repulsion.",
    16: "Magnitude alone does not determine direction.",
    17: "Attraction/repulsion, central force and action/reaction restricted to the static system.",
    18: "Unmodified fig107 placeholder.",
    19: "Unmodified fig107 caption.",
    20: "Coulomb interaction characterizes charge in this classical regime, not a universal definition.",
}


def binding(path):
    return {"path": str(path), "sha256": edition.sha256(path)}


def write_json(path, value):
    edition.dump(path, value)


def prepare():
    if BASELINE.exists() or any(TARGET.glob("*.template.json")):
        raise SystemExit("Refuse to repeat prepare or overwrite an existing n62 template.")
    raw = edition.load(RAW / "lesson.json")
    refs = sorted({
        ref.split("#")[0][1:]
        for block in raw["prose"]
        for ref in block["source_refs"]
    })
    sources = {
        "lesson": binding(RAW / "lesson.json"),
        "markdown": binding(RAW / "lesson.md"),
        "exercises": binding(RAW / "exercises.json"),
    }
    for page in refs:
        sources[f"page-{page}"] = binding(BOOK / "pages" / page / "page.json")
    tools = {
        name: binding(TOOLS / name)
        for name in (
            "p2c.py", "edition.py", "assemble.py", "blocks.py", "normalize.py",
            "mathcheck.py", "prose_flow.mjs", "htmlfrag.js",
        )
    }
    tools["profile"] = binding(PROFILE)
    tools["skill"] = binding(TOOLS.parent / "SKILL.md")
    tools["text-contract"] = binding(TOOLS.parent / "references/edition-text-contract.md")
    previous_book = WORK / "book.template.json"
    book_before = None
    if previous_book.exists():
        preserved = TMP / "9p-n62-before-prepare.book.template.json"
        if preserved.exists():
            raise SystemExit("Refuse to overwrite the pre-prepare book snapshot.")
        shutil.copy2(previous_book, preserved)
        book_before = binding(preserved)
    command = [
        sys.executable, "-B", str(TOOLS / "p2c.py"), "adapt-prepare",
        "--book", "9p", "--edition", "modern-us-neutral", "--lesson", LESSON,
    ]
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
    print(result.stdout, end="")
    if result.stderr:
        print(result.stderr, end="", file=sys.stderr)
    if result.returncode:
        raise SystemExit(result.returncode)
    shutil.copy2(TARGET / "lesson.template.json", BEFORE)
    templates = {
        name: binding(TARGET / name)
        for name in (
            "lesson.template.json", "exercises.template.json", "figures.template.json",
        )
    }
    write_json(BASELINE, {
        "source": sources, "tools": tools, "templates": templates,
        "before": binding(BEFORE),
        "sharedBookTemplateBefore": book_before,
        "sharedBookTemplateAfterPrepare": binding(previous_book),
        "prepare": {
            "command": command, "invocations": 1, "exitCode": result.returncode,
            "stdout": result.stdout, "stderr": result.stderr,
            "sourceBlocks": len(raw["prose"]),
            "tasks": edition.load(RAW / "exercises.json")["count"],
            "figurePlaceholders": [figure["id"] for figure in raw["figures"]],
        },
    })


def native_flow(path):
    command = ["node", str(TOOLS / "prose_flow.mjs"), "--json", str(path)]
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
    if result.returncode:
        raise SystemExit(result.stderr or result.stdout)
    return json.loads(result.stdout), command


def normalize():
    path = TARGET / "lesson.template.json"
    document = edition.load(path)
    edition.normalize_lesson_layout(document)
    write_json(path, document)
    flow, command = native_flow(path)
    write_json(FLOW, {"command": command, "output": flow})
    for paragraph in flow["paragraphs"]:
        print(f"[{paragraph['index']}] {paragraph['text']}")
        index = paragraph["index"]
        if index:
            print("    break: " + json.dumps({
                "before": flow["paragraphs"][index - 1]["text"],
                "after": paragraph["text"],
            }, ensure_ascii=False))


def freeze():
    if FREEZE.exists():
        raise SystemExit("Refuse to overwrite a frozen author report.")
    baseline = edition.load(BASELINE)
    errors = []
    for group in ("source", "tools"):
        for name, item in baseline[group].items():
            if edition.sha256(Path(item["path"])) != item["sha256"]:
                errors.append(f"Changed {group} binding: {name}")
    if binding(BEFORE) != baseline["before"]:
        errors.append("Prepared before snapshot changed.")
    for name in ("exercises.template.json", "figures.template.json"):
        if binding(TARGET / name) != baseline["templates"][name]:
            errors.append(f"Non-prose template changed: {name}")
    current = edition.load(TARGET / "lesson.template.json")
    before = edition.load(BEFORE)
    raw = edition.load(RAW / "lesson.json")
    raw_exercises = edition.load(RAW / "exercises.json")
    exercises = edition.load(TARGET / "exercises.template.json")
    profile = edition.load(PROFILE)
    forbidden = profile.get("forbidden_terms", []) + profile.get("forbidden_person_names", [])
    normalized = copy.deepcopy(current)
    edition.normalize_lesson_layout(normalized)
    if normalized != current:
        errors.append("Native prose normalization is not stable.")
    for key, value in before.items():
        if key not in ("prose", "section_breaks") and current.get(key) != value:
            errors.append(f"Non-prose lesson field changed: {key}")
    if set(current) != set(before):
        errors.append("Lesson field set changed.")
    if len(current["prose"]) != len(raw["prose"]):
        errors.append("Source block count changed.")
    errors += edition.validate_source(BOOK, current["source"], RAW / "lesson.json", "lesson")
    errors += edition.validate_source(BOOK, exercises["source"], RAW / "exercises.json", "exercises")
    corrections, errata_errors = edition.validate_errata(
        BOOK, raw, raw_exercises, current, exercises,
    )
    errors += errata_errors
    coverage = []
    for index, (source, modern, prepared) in enumerate(zip(raw["prose"], current["prose"], before["prose"])):
        target = f"lesson.prose[{index}]"
        errors += edition.validate_identity_fields(
            source, modern, ("kind", "id", "label", "printed_page", "source_refs"), target,
        )
        if modern["source_text"] != source["text"]:
            errors.append(f"Source text changed: {target}")
        if {k: v for k, v in modern.items() if k not in ("text", "changes", "historical_entities")} != {
            k: v for k, v in prepared.items() if k not in ("text", "changes", "historical_entities")
        }:
            errors.append(f"Unauthorized block field change: {target}")
        text_errors = edition.validate_text(
            source["text"], modern["text"], modern["changes"], modern["numeric_changes"],
            target, forbidden, modern["historical_entities"], corrections.get(target),
        )
        errors += text_errors
        exact_math = [m.group(0) for m in edition.MATH.finditer(source["text"])] == [
            m.group(0) for m in edition.MATH.finditer(modern["text"])
        ]
        if not exact_math:
            errors.append(f"Exact math-token sequence changed: {target}")
        if source["kind"] == "fig" and modern != prepared:
            errors.append(f"Figure placeholder changed: {target}")
        coverage.append({
            "target": target, "source_refs": source["source_refs"], "kind": source["kind"],
            "topic": TOPICS[index], "source_text_unchanged": modern["source_text"] == source["text"],
            "math_token_sequence_exact": exact_math,
            "source_number_signature": edition.number_signature(source["text"]),
            "modern_number_signature": edition.number_signature(modern["text"]),
            "changes": modern["changes"], "historical_entities": modern["historical_entities"],
            "text_errors": text_errors,
        })
    math_errors, math_warnings = mathcheck.collect_and_check(
        current["prose"], lambda item: [("text", item["text"])],
    )
    errors += math_errors
    flow, command = native_flow(TARGET / "lesson.template.json")
    previous_outline = edition.load(PREANCHOR_FLOW)["output"]["paragraphs"]
    if previous_outline != flow["paragraphs"]:
        errors.append("Paragraphs changed after the actual pre-anchor prose_flow output.")
    reported_pairs = [
        {"before": previous_outline[index - 1]["text"], "after": paragraph["text"]}
        for index, paragraph in enumerate(previous_outline) if index
    ]
    if any(anchor not in reported_pairs for anchor in current["section_breaks"]):
        errors.append("Section anchor does not match an actual native output boundary.")
    write_json(FLOW, {"command": command, "output": flow})
    errors += edition.validate_figure_references(
        current["prose"], exercises["exercises"],
        edition.load(TARGET / "figures.template.json")["figures"],
    )
    report = {
        "ticket": "STEMROBIN-181", "batch": "D018", "lesson": LESSON,
        "role": "modern-prose-author-only",
        "status": "author-frozen-awaiting-independent-science-review" if not errors else "author-blocked",
        "bindings": {
            "template": binding(TARGET / "lesson.template.json"),
            "source": baseline["source"]["lesson"],
            "sourceMarkdown": baseline["source"]["markdown"],
            "sourceExercises": baseline["source"]["exercises"],
            "sourcePages": [item for name, item in baseline["source"].items() if name.startswith("page-")],
            "before": binding(BEFORE),
            "exercisesTemplate": binding(TARGET / "exercises.template.json"),
            "figuresTemplate": binding(TARGET / "figures.template.json"),
            "helper": binding(Path(__file__).resolve()),
            "preparedBaseline": binding(BASELINE),
            "nativeProseFlow": binding(FLOW),
            "preAnchorProseFlow": binding(PREANCHOR_FLOW),
            "tools": baseline["tools"],
        },
        "prepare": baseline["prepare"],
        "sourceBlocks": len(raw["prose"]),
        "normalizedParagraphs": len(flow["paragraphs"]),
        "mathFragments": sum(len(list(edition.MATH.finditer(b["text"]))) for b in current["prose"]),
        "tasks": raw_exercises["count"],
        "figurePlaceholders": [f["id"] for f in current["figures"]],
        "coverage": coverage,
        "sectionBreaks": current["section_breaks"],
        "resolvedBoundaries": flow["boundaries"],
        "anchorDerivation": "Five before/after objects copied manually from actual native prose_flow output; final native output resolves them and its paragraph stream matches the preserved pre-anchor output exactly.",
        "fullAuthoritativeTextSha256": __import__("hashlib").sha256(
            "\n\n".join(b["text"] for b in current["prose"] if b.get("text")).encode()
        ).hexdigest(),
        "nativeAuthorCheck": {
            "status": "pass" if not errors else "blocked", "errors": errors,
            "mathWarnings": math_warnings, "normalizationStable": normalized == current,
            "sourceAndToolHashesUnchanged": not any(e.startswith("Changed ") for e in errors),
            "sourceSnapshotRefsOrderAndMathPreserved": not errors,
            "exerciseAndFigureTemplatesByteUnchanged": not any("Non-prose template changed" in e for e in errors),
            "scope": "Scoped native source/identity/errata/text/math/number/figure-reference and actual prose_flow author checks; no SCI gate or figure-output validation.",
        },
        "historyApproach": "Retain source-bound names,1785 and1736-1806; qualify the source footnote's priority/manuscript-discovery story rather than invent a replacement story/date. No external research or new quantitative data.",
        "sourceErrataAdded": [],
        "independentScience": "pending main unique gate",
        "modernFigures": "Three original placeholders untouched; future author/review work not performed.",
        "limits": "Author candidate only: no source/pixel/counting review, SCI self-approval, task invention, figure drawing/rendering/promotion, finalize, source/tool/app/dependency/DB/git/browser changes.",
        "inFlightProcesses": [],
    }
    write_json(FREEZE, report)
    print(json.dumps({
        "status": report["status"], "sourceBlocks": report["sourceBlocks"],
        "normalizedParagraphs": report["normalizedParagraphs"], "tasks": report["tasks"],
        "mathFragments": report["mathFragments"], "errors": errors, "mathWarnings": math_warnings,
        "freeze": binding(FREEZE), "template": report["bindings"]["template"],
    }, ensure_ascii=False, indent=2))
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) == 2 else ""
    if mode == "prepare":
        prepare()
    elif mode == "normalize":
        normalize()
    elif mode == "freeze":
        freeze()
    else:
        raise SystemExit("Use prepare, normalize or freeze.")
