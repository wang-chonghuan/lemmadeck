"""Read-only schema and delimiter checks; not mathematical or rendering approval."""

import json
from pathlib import Path
import re
import sys

sys.dont_write_bytecode = True
REPO = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
TOOLS = REPO / ".claude/skills/ld-s10y-answer/tools"
sys.path.insert(0, str(TOOLS))
from lesson_answers import validate_lesson


def escaped(text, index):
    slashes = 0
    index -= 1
    while index >= 0 and text[index] == "\\":
        slashes += 1
        index -= 1
    return slashes % 2 == 1


def math_spans(text):
    spans = []
    start = None
    for index, char in enumerate(text):
        if char != "$" or escaped(text, index):
            continue
        if start is None:
            start = index + 1
        else:
            span = text[start:index]
            if not span.strip():
                raise ValueError("Empty math span")
            spans.append(span)
            start = None
    if start is not None:
        raise ValueError("Unclosed dollar math delimiter")
    for span in spans:
        depth = 0
        for index, char in enumerate(span):
            if escaped(span, index):
                continue
            if char == "{":
                depth += 1
            elif char == "}":
                depth -= 1
                if depth < 0:
                    raise ValueError("Unmatched closing TeX brace")
        if depth:
            raise ValueError("Unclosed TeX brace")
        depth = 0
        for command in re.findall(r"\\(left|right)\b", span):
            depth += 1 if command == "left" else -1
            if depth < 0:
                raise ValueError("Unmatched TeX right")
        if depth:
            raise ValueError("Unmatched TeX left")
    return len(spans)


def main():
    if Path.cwd() != REPO or len(sys.argv) != 2:
        raise ValueError("Exact repo cwd and one candidate path required")
    candidate = Path(sys.argv[1]).resolve()
    owner = REPO / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n44-answer-author"
    if not candidate.is_relative_to(owner):
        raise ValueError("Candidate outside author scratch")
    exercises = REPO / (
        "ssot-resources/soviet10year-textbooks/artifacts/7a/"
        "editions/modern-us-neutral/lessons/alg7-c4-s3-n44/exercises.json"
    )
    profile = json.loads((REPO / ".claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json").read_text())
    forbidden = profile.get("forbidden_terms", []) + profile.get("forbidden_person_names", [])
    document, schema_errors = validate_lesson(
        candidate, exercises, "7a", "alg7-c4-s3-n44", "modern-us-neutral", forbidden
    )
    syntax_errors = []
    rows = []
    required_top = {"schema", "book", "lesson", "edition", "status", "count", "answers"}
    required_answer = {"exercise", "grading", "source", "displayAnswer", "parts", "historical_entities", "notes"}
    if set(document) != required_top or document.get("status") != "draft" or document.get("count") != 15:
        syntax_errors.append("Expected exact draft candidate fields and count15")
    for answer in document.get("answers", []):
        exercise = answer.get("exercise")
        if set(answer) != required_answer:
            syntax_errors.append(f"{exercise}: nonstandard author fields or missing metadata")
        if answer.get("grading") != "ungraded" or answer.get("parts") != []:
            syntax_errors.append(f"{exercise}: expected written read-only ungraded parts[]")
        if answer.get("source") != "derived" or answer.get("historical_entities") != []:
            syntax_errors.append(f"{exercise}: incorrect source or culture metadata")
        notes = answer.get("notes", "")
        if not notes.strip() or any(token in notes for token in (".tmp/", "/tmp/", "/Users/", "http")):
            syntax_errors.append(f"{exercise}: notes must reference stable evidence filenames")
        try:
            count = math_spans(answer.get("displayAnswer", ""))
            rows.append({"exercise": exercise, "display_math_spans": count})
        except ValueError as error:
            syntax_errors.append(f"{exercise}: {error}")
    report = {
        "schema": "n44-answer-author-minimal-check-v1",
        "existing_validate_lesson_invocations": 1,
        "existing_schema_errors": schema_errors,
        "minimal_syntax_passes": 1,
        "minimal_syntax_errors": syntax_errors,
        "answer_count": len(document.get("answers", [])),
        "answers": rows,
        "display_math_spans_checked": sum(row["display_math_spans"] for row in rows),
        "status": "fail" if schema_errors or syntax_errors else "pass",
        "meaning": "JSON/schema/read-only policy and balanced math delimiters/braces only",
        "mathematics_approved": False,
        "rendering_checked": False,
        "autojudging_checked": False,
        "finalizer_called": False,
    }
    print(json.dumps(report, ensure_ascii=True, indent=2))
    return 2 if schema_errors or syntax_errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
