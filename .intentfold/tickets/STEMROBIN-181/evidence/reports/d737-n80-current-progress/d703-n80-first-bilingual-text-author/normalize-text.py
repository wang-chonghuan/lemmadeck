#!/usr/bin/env python3
"""Normalize candidate prose and exercises with the current edition helpers."""

import json
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, "/Users/yong/.codex/worktrees/00b1/lemmadeck/.claude/skills/ld-s10y-lesson/tools")
import edition


def signature(text):
    flow = [(match.start(), "math", match.group(0)) for match in edition.MATH.finditer(text)]
    flow.extend((match.start(), "figure", match.group(1))
                for match in edition.FIGURE_REFERENCE.finditer(text))
    return {
        "mathTokens": [match.group(0) for match in edition.MATH.finditer(text)],
        "figureOccurrences": [match.group(1) for match in edition.FIGURE_REFERENCE.finditer(text)],
        "interleavedMathAndFigures": [[kind, token] for _, kind, token in sorted(flow)],
        "numbersAndReferences": edition.prose_number_signature(text),
    }


def preserve(source, modern, key, changes):
    errors = edition.validate_text(source, modern, changes, [], key, [])
    if errors:
        raise ValueError("; ".join(errors))
    original = signature(source)
    current = signature(modern)
    if original != current:
        raise ValueError(f"Exact token, number or interleaved figure order changed: {key}")
    return current


request = json.load(sys.stdin)
result = {"prose": [], "exercises": []}
for item in request["prose"]:
    text = edition.normalize_prose_layout("\n".join(item["sentences"]))
    if text.replace("\n", "") != "".join(item["sentences"]):
        raise ValueError(f"Normalization changed authored sentence content: {item['key']}")
    if edition.normalize_prose_layout(text) != text:
        raise ValueError(f"Non-idempotent prose layout: {item['key']}")
    sizes = [len(paragraph.splitlines()) for paragraph in text.split("\n\n")]
    if any(size not in (2, 3) for size in sizes):
        raise ValueError(f"Not two or three complete sentences: {item['key']}")
    if any(not sentence.endswith((".", "。", "?", "？", "!", "！"))
           for sentence in item["sentences"]):
        raise ValueError(f"Unfinished sentence: {item['key']}")
    evidence = preserve(item["source_text"], text, item["key"],
                        ["modernized", "clarification", "layout", "translation"])
    result["prose"].append({
        "key": item["key"], "text": text, "completeSentenceCount": len(item["sentences"]),
        "paragraphSentenceCounts": sizes, "preservation": evidence,
    })

for item in request["exercises"]:
    exercise = {"text": item["text"], "changes": item["changes"]}
    edition.normalize_exercise_layout({"exercises": [exercise]})
    text = exercise["text"]
    if edition.normalize_numbered_subparts(text) != text:
        raise ValueError(f"Non-idempotent exercise layout: {item['number']}")
    if edition.validate_numbered_subpart_layout(text):
        raise ValueError(f"Invalid subpart layout: {item['number']}")
    if "".join(text.split()) != "".join(item["text"].split()):
        raise ValueError(f"Exercise normalization changed content/order: {item['number']}")
    evidence = preserve(item["source_text"], text, f"task{item['number']}", exercise["changes"])
    result["exercises"].append({
        "number": item["number"], "text": text, "lines": text.splitlines(),
        "changes": exercise["changes"], "preservation": evidence,
    })


class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return sorted(obj)
        return super().default(obj)


json.dump(result, sys.stdout, indent=2, ensure_ascii=False, cls=Encoder)
sys.stdout.write("\n")
