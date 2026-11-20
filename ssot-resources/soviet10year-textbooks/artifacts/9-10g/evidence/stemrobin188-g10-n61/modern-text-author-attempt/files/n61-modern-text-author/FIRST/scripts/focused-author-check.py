from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

from pure_helper_loader import load_helpers


def main():
    own = Path(__file__).resolve().parent
    repo = own.parents[4]
    manifest_path = own.parent / "n61-modern-text-author-inputs-01/manifest.json"
    read = lambda filename: json.loads(Path(filename).read_text(encoding="utf-8"))
    manifest = read(manifest_path)
    freeze = read(own / "FIRST/freeze.json")
    if not freeze["frozenBeforeFocusedChecks"]:
        raise RuntimeError("FIRST not frozen")
    helpers, helper_binding = load_helpers(repo)
    lesson = read(own / "working/lesson.template.json")
    exercises = read(own / "working/exercises.template.json")
    for name in ("lesson", "exercises"):
        if (own / f"working/{name}.template.json").read_bytes() != (own / f"FIRST/{name}.template.json").read_bytes():
            raise RuntimeError("First focused check must bind the actual immutable FIRST bytes")
    raw_lesson = read(manifest["rawLesson"]["path"])
    raw_exercises = read(manifest["rawExercises"]["path"])
    initial_lesson = read(manifest["initialTemplates"][0]["path"])
    initial_exercises = read(manifest["initialTemplates"][1]["path"])
    profile = read(repo / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json")
    forbidden = profile["forbidden_terms"] + profile["forbidden_person_names"]
    failures = []

    def record(label, condition):
        if not condition:
            failures.append(label)
        return "PASS" if condition else "FAIL"

    def exact_math(text):
        return [match.group(0) for match in helpers["MATH"].finditer(text)]

    def numeric_occurrences(text):
        values = []
        math = list(helpers["MATH"].finditer(text))
        for match in re.finditer(r"-?\d+(?:\.\d+)?", text):
            values.append({
                "value": match.group(),
                "region": "math" if any(item.start() <= match.start() < item.end() for item in math) else "text",
            })
        return values

    def subparts(text):
        masked = helpers["masked_math"](text)
        depths = helpers["nesting_depths"](masked)
        return [
            match.group("label")
            for match in helpers["PART_MARKER"].finditer(masked)
            if depths[match.start()] == 0
            and not re.search(r"图\s*$", masked[max(0, match.start() - 3):match.start()])
        ]

    top = {}
    for label, raw, candidate, initial, fields in [
        ("lesson", raw_lesson, lesson, initial_lesson, tuple(key for key in raw_lesson if key != "prose")),
        ("exercises", raw_exercises, exercises, initial_exercises, ("lesson", "count")),
    ]:
        errors = helpers["validate_identity_fields"](raw, candidate, fields, label)
        errors += helpers["validate_identity_fields"](initial, candidate, ("schema", "edition", "status", "source"), label)
        failures.extend(errors)
        top[label] = {"status": "PASS" if not errors else "FAIL", "fields": list(fields), "errors": errors}
        record(f"{label} embedded raw source binding", candidate["source"]["data"] == raw)
    record("20 prose objects", len(lesson["prose"]) == len(raw_lesson["prose"]) == 20)
    record("10 exercises", len(exercises["exercises"]) == len(raw_exercises["exercises"]) == 10)
    record("empty errata", lesson["errata"] == [])
    record("pre-flow anchors intentionally empty", lesson["section_breaks"] == [])
    objects = []
    for domain, raws, candidates, initials in [
        ("prose", raw_lesson["prose"], lesson["prose"], initial_lesson["prose"]),
        ("exercise", raw_exercises["exercises"], exercises["exercises"], initial_exercises["exercises"]),
    ]:
        for index, (raw, candidate, initial) in enumerate(zip(raws, candidates, initials)):
            label = f"prose[{index}]" if domain == "prose" else f"exercises[{raw['number']}]"
            start_failures = len(failures)
            source = raw["text"]
            text = candidate["text"]
            fields = tuple(key for key in raw if key not in ("text", "lines"))
            identity_errors = helpers["validate_identity_fields"](raw, candidate, fields, label)
            text_errors = helpers["validate_text"](
                source, text, candidate["changes"], candidate["numeric_changes"],
                label, forbidden, candidate["historical_entities"], [],
            )
            failures.extend(identity_errors + text_errors)
            record(f"{label} immutable source_text", candidate["source_text"] == source == initial["source_text"])
            record(f"{label} exact codepoint/punctuation/emphasis sequence except whitespace",
                   re.sub(r"\s", "", source) == re.sub(r"\s", "", text))
            source_formulas, candidate_formulas = exact_math(source), exact_math(text)
            source_signature = helpers["math_signature"](source)
            candidate_signature = helpers["math_signature"](text)
            exact_status = record(f"{label} exact ordered formulas", source_formulas == candidate_formulas)
            signature_status = record(f"{label} helper ordered math signature", source_signature == candidate_signature)
            source_numbers = helpers["number_signature"](source)
            candidate_numbers = helpers["number_signature"](text)
            number_status = record(f"{label} ordered nonmath numeric signature", source_numbers == candidate_numbers)
            occurrence_status = record(f"{label} all ordered numeric occurrences",
                                       numeric_occurrences(source) == numeric_occurrences(text))
            record(f"{label} empty numeric changes and historical entities",
                   candidate["numeric_changes"] == [] and candidate["historical_entities"] == [])
            record(f"{label} only layout change declarations",
                   candidate["changes"] == ([] if source == text else ["layout"]))
            for formula in candidate_formulas:
                record(f"{label} no Chinese prose punctuation inside math",
                       not helpers["MATH_BOUNDARY_PUNCTUATION"].search(formula))
            source_parts, candidate_parts = subparts(source), subparts(text)
            record(f"{label} subpart order retained", source_parts == candidate_parts)
            layout_errors = []
            prefix = None
            if domain == "prose" and raw["kind"] == "p":
                normalized = helpers["normalize_prose_layout"](text)
                if normalized != text:
                    layout_errors.append("Authored prose is not stable under the existing pure layout helper")
            if domain == "exercise":
                layout_errors = helpers["validate_numbered_subpart_layout"](text)
                prefix = re.match(r"^\d+[^\d\s.]*\.", source).group()
                record(f"{label} exact printed exercise prefix", text.startswith(prefix))
                if source_parts:
                    record(f"{label} prefix separate line", text.splitlines()[0] == prefix)
                    record(f"{label} every subpart separate line",
                           len(text.splitlines()) == len(source_parts) + 1
                           and all(re.match(rf"^{part}\)", line) for part, line in zip(source_parts, text.splitlines()[1:])))
                    record(f"{label} natural source order",
                           source_parts == [str(value) for value in range(1, len(source_parts) + 1)])
                record(f"{label} lines bound to text", candidate["lines"] == text.splitlines())
            failures.extend(f"{label}: {error}" for error in layout_errors)
            changed_fields = [key for key in candidate if candidate.get(key) != initial.get(key)]
            objects.append({
                "object": label, "domain": domain, "index": index,
                "kind": raw.get("kind"), "id": raw.get("id"), "number": raw.get("number"),
                "source_refs": raw.get("source_refs", raw.get("pages")),
                "identityFields": list(fields), "identityErrors": identity_errors,
                "source_text": source, "prepared_text": initial["text"], "FIRST_text": text,
                "changedFromRaw": source != text, "changedFromPrepared": initial["text"] != text,
                "changedFieldsFromPrepared": changed_fields,
                "changes": candidate["changes"],
                "reason": "Layout only; source is already culturally neutral. Non-whitespace source codepoints are identical."
                          if source != text else "Neutral mathematics retained unchanged.",
                "orderedFormulaCheck": {
                    "source": source_formulas, "FIRST": candidate_formulas, "status": exact_status,
                    "helperSourceSignature": source_signature,
                    "helperFIRSTSignature": candidate_signature, "helperStatus": signature_status,
                },
                "orderedNumericCheck": {
                    "sourceOutsideMath": source_numbers, "FIRSTOutsideMath": candidate_numbers, "status": number_status,
                    "sourceAllOccurrences": numeric_occurrences(source),
                    "FIRSTAllOccurrences": numeric_occurrences(text), "allOccurrenceStatus": occurrence_status,
                },
                "subpartCheck": {"sourceOrder": source_parts, "FIRSTOrder": candidate_parts, "prefix": prefix},
                "layoutErrors": layout_errors, "textHelperErrors": text_errors,
                "status": "PASS" if len(failures) == start_failures else "FAIL",
            })
    record("exercise 209 two-page join", exercises["exercises"][3]["pages"] == manifest["exercise209SourceRefs"])
    record("incoming recall join", lesson["prose"][2]["source_refs"] == manifest["incomingRecallJoin"])
    record("frustum join", lesson["prose"][13]["source_refs"] == manifest["frustumDelimiterJoin"])
    record("frustum literal source closing parenthesis immediately outside math",
           "$[O_1,O]$)**" in lesson["prose"][13]["text"])
    record("raised 207 literal marker", exercises["exercises"][1]["text"].startswith("207°.\n"))
    record("roof literal verb", "铁片苫屋顶" in exercises["exercises"][4]["text"])
    record("Figure 88 exercise reference", exercises["exercises"][-1]["figure_refs"] == ["fig-g10-88"])
    pairs = []
    for figure in lesson["figures"]:
        slots = [index for index, block in enumerate(lesson["prose"]) if block["kind"] == "fig" and block["id"] == figure["id"]]
        captions = [index for index, block in enumerate(lesson["prose"]) if block["kind"] == "cap" and block["label"] == figure["label"]]
        record(f"{figure['id']} one slot and one exact caption", len(slots) == len(captions) == 1)
        pairs.append({"id": figure["id"], "label": figure["label"], "figureSlot": slots, "captionSlot": captions})
    record("six figure/caption pairs", len(pairs) == 6)
    report = {
        "schema": "n61-focused-author-check@1",
        "role": "MODERN TEXT AUTHOR ONLY; not independent review or approval",
        "status": "PASS" if not failures else "FAIL",
        "checkedCandidate": "FIRST-identical working candidates before flow and anchor insertion",
        "candidateBindings": [
            {"path": f"working/{name}.template.json",
             "sha256": hashlib.sha256((own / f"working/{name}.template.json").read_bytes()).hexdigest()}
            for name in ("lesson", "exercises")
        ],
        "helperBinding": helper_binding, "topIdentity": top,
        "all30ObjectComparison": objects, "figureCaptionPairs": pairs,
        "failures": failures, "contentRepairsUsedBeforeCheck": 0,
        "sourceGlyphOrMathReview": False, "images": 0, "formalTests": 0,
        "nativeCalls": 0, "pipelineParserCalls": 0, "rendererCalls": 0, "katexCalls": 0,
    }
    output = own / "focused-author-check-01.json"
    with output.open("x", encoding="utf-8") as handle:
        json.dump(report, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
    output.chmod(0o444)
    print(json.dumps({"status": report["status"], "objects": len(objects), "failures": failures,
                      "output": output.name}, ensure_ascii=False, indent=2))
    return 0 if not failures else 20


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as error:
        import traceback
        traceback.print_exc()
        sys.exit(2)
