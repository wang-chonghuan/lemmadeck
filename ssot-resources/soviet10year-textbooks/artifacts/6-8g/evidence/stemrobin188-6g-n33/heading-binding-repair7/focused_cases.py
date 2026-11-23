"""Offline, affected-function evidence only; not a production pipeline."""

import ast
import copy
import difflib
import hashlib
import json
import re
import sys
from pathlib import Path
from types import SimpleNamespace


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
ARTIFACTS = ROOT / "ssot-resources/soviet10year-textbooks/artifacts"
EVIDENCE = Path(__file__).resolve().parent
ASSEMBLE = ROOT / ".claude/skills/ld-s10y-lesson/tools/assemble.py"
SOURCE = ARTIFACTS / (
    "6-8g/evidence/stemrobin188-6g-source155/footnote-owner-repair09/files/"
    "source155-footnote-owner-repair-09/artifacts/6-8g/pages/0155/page.json"
)
TOC = ROOT / "ssot-resources/soviet10year-textbooks/toc/6-8g/zh.json"


def selected(path, names):
    # Execute only the named definitions, without importing the pipeline.
    text = path.read_text(encoding="utf-8")
    nodes = [
        node for node in ast.parse(text).body
        if (
            isinstance(node, ast.FunctionDef) and node.name in names
        ) or (
            isinstance(node, ast.Assign)
            and any(isinstance(t, ast.Name) and t.id in names for t in node.targets)
        )
    ]
    assert len(nodes) == len(names)
    snippet = "\n\n".join(ast.get_source_segment(text, node) for node in nodes) + "\n"
    return ast.Module(body=nodes, type_ignores=[]), snippet


def objects(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from objects(child)
    elif isinstance(value, list):
        for child in value:
            yield from objects(child)


def main():
    assert Path.cwd() == ROOT
    assert len(sys.argv) in (1, 2)
    phase = sys.argv[1] if len(sys.argv) == 2 else "check"
    assert phase in ("before", "after", "check")
    results_path = EVIDENCE / f"{phase}.json"
    snippet_path = EVIDENCE / f"assemble.{phase}.snippet.py"
    if phase != "check":
        assert not results_path.exists() and not snippet_path.exists()
    source_bytes, toc_bytes = SOURCE.read_bytes(), TOC.read_bytes()
    page = json.loads(source_bytes)
    headings = [
        (index, block) for index, block in enumerate(page["blocks"])
        if block["kind"] == "h3"
    ]
    assert len(headings) == 1 and headings[0][0] == 5
    heading = headings[0][1]
    assert heading["lines"] == ["33\u25bc\uff0e\u975e\u6b27\u51e0\u4f55\uff0e\u51e0\u4f55\u548c\u7269\u7406"]
    cards = list(objects(json.loads(toc_bytes)))
    card33 = [card for card in cards if card.get("printedNumber") == 33]
    card30 = [card for card in cards if card.get("printedNumber") == 30]
    assert len(card33) == len(card30) == 1
    assert card33[0]["id"] == "geo68-c3-s1-n33"
    title33, title30 = card33[0]["title"], card30[0]["title"]

    text_module, _ = selected(ASSEMBLE.with_name("blocks.py"), {"WRAP", "text_of"})
    text_namespace = {"re": re}
    exec(compile(text_module, "blocks.py:selected", "exec"), text_namespace)
    module, snippet = selected(ASSEMBLE, {"SEC_NUM", "_slug", "cut_lessons"})
    namespace = {
        "re": re, "Path": Path,
        "B": SimpleNamespace(text_of=text_namespace["text_of"]),
    }
    exec(compile(module, "assemble.py:selected", "exec"), namespace)
    regex, cut = namespace["SEC_NUM"], namespace["cut_lessons"]
    results = []

    def check(name, actual, expected):
        results.append({
            "case": name, "expected": expected, "actual": actual,
            "pass": actual == expected,
        })

    printed = heading["lines"][0]
    heading_input = {**copy.deepcopy(heading), "page": 155, "ref": "p0155#6"}
    check("actual-source-ref", heading_input["ref"], "p0155#6")
    cases = [
        ("actual-literal-n33", printed, "33", title33),
        ("math-wrapper-n33", "33$\\blacktriangledown$\uff0e" + title33, "33", title33),
        ("plain-n30", "30\uff0e" + title30, "30", title30),
        ("section-prefix", "\u00a7 30. " + title30, "30", title30),
        ("plain-star", "30*." + title30, "30", title30),
        ("math-star", "30$^{*}$." + title30, "30", title30),
        ("math-number", "$30$." + title30, "30", title30),
        ("math-number-star", "$30^{*}$." + title30, "30", title30),
        ("math-number-plus", "$30^{+}$." + title30, "30", title30),
        ("comma-punctuation", "30\u3001" + title30, "30", title30),
        ("space-punctuation", "30 " + title30, "30", title30),
    ]
    for name, text, number, title in cases:
        match = regex.match(text)
        check(name + ":SEC_NUM", list(match.groups()) if match else None, [number, title])
        block = {**heading_input, "lines": [text]}
        body = {"kind": "p", "page": 155, "ref": "p0155#7", "lines": ["body"]}
        stream = [block, body]
        original = copy.deepcopy(stream)
        lessons = cut(stream)
        check(name + ":identity", [
            [item["number"], item["title"], item["printed_title"]] for item in lessons
        ], [[number, title, text]])
        check(name + ":input-unchanged", stream, original)
        check(name + ":body-preserved", lessons[0]["blocks"], [body])

    for name, text in [
        ("inline-number-marker", "body 33\u25bc\uff0e" + title33),
        ("inline-math-marker", "body 33$\\blacktriangledown$\uff0e" + title33),
        ("unsupported-black-block", "33\u25ae\uff0e" + title33),
        ("unsupported-white-triangle", "33\u25bd\uff0e" + title33),
        ("missing-separator", "33\u25bc" + title33),
    ]:
        check(name + ":SEC_NUM-reject", regex.match(text) is None, True)
        block = {**heading_input, "lines": [text]}
        lesson = cut([block])[0]
        check(name + ":no-number-invented", [
            lesson["number"], lesson["title"], lesson["printed_title"]
        ], [None, text, text])

    paragraph = {
        **heading_input, "kind": "p",
        "lines": [printed + " body 30*." + title30],
    }
    stream = [heading_input, paragraph]
    original = copy.deepcopy(stream)
    check("inline-paragraph-not-heading", len(cut(stream)), 1)
    check("inline-paragraph-preserved", stream, original)
    check("source-file-bytes-unchanged", SOURCE.read_bytes() == source_bytes, True)
    check("toc-file-bytes-unchanged", TOC.read_bytes() == toc_bytes, True)
    failed = [item["case"] for item in results if not item["pass"]]
    record = {
        "phase": phase,
        "source": str(SOURCE.relative_to(ROOT)),
        "source_sha256": hashlib.sha256(source_bytes).hexdigest(),
        "toc_sha256": hashlib.sha256(toc_bytes).hexdigest(),
        "assemble_sha256": hashlib.sha256(ASSEMBLE.read_bytes()).hexdigest(),
        "source_heading": {"ref": "p0155#6", "kind": heading["kind"], "lines": heading["lines"]},
        "source_meta_notes": page["meta"]["notes"],
        "toc_n33": card33[0],
        "scope": "Technical recognizer only; independent affected-code review pending.",
        "historical_id_user_reported_not_regenerated": "x1-33-\u975e\u6b27\u51e0\u4f55-\u51e0\u4f55\u548c\u7269\u7406",
        "results": results, "failed": failed, "exit_code": int(bool(failed)),
    }
    if phase != "check":
        snippet_path.write_text(snippet, encoding="utf-8")
        results_path.write_text(json.dumps(record, ensure_ascii=True, indent=2) + "\n", encoding="utf-8")
    if phase == "after":
        before = (EVIDENCE / "assemble.before.snippet.py").read_text(encoding="utf-8")
        (EVIDENCE / "minimal.diff").write_text("".join(difflib.unified_diff(
            before.splitlines(keepends=True), snippet.splitlines(keepends=True),
            fromfile="assemble.before.snippet.py", tofile="assemble.after.snippet.py",
        )), encoding="utf-8")
    print(json.dumps({
        "phase": phase, "checks": len(results), "failed": failed,
        "exit_code": record["exit_code"],
    }))
    return record["exit_code"]


if __name__ == "__main__":
    sys.exit(main())
