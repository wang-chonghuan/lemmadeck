"""Bounded checks derived from SOURCE267 review and the original-page contract."""
import copy
import json
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
SCRATCH = Path(__file__).resolve().parent
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import p2c

profile = p2c.nz.load_profile(p2c.DEFAULT_PROFILE)
source_path = SCRATCH.parent / "d1188-source267-first-author/root/10p/pages/0267/page.json"
source = json.loads(source_path.read_text(encoding="utf-8"))
source_blocks = source["blocks"]
figure = next(b for b in source_blocks if b["kind"] == "fig")
caption = next(b for b in source_blocks if b["kind"] == "cap")
assert figure["label"] == caption["label"] == "\u56fe 228a"
assert source_blocks[4]["lines"][4].endswith("\uff08\u56fe 228")
assert source_blocks[4]["lines"][5].startswith("a\uff09.")
known = [copy.deepcopy(figure), copy.deepcopy(caption)]


def block(kind, text):
    return {"kind": kind, "label": None, "lines": text.splitlines()}


cases = [
    ("source_split_figure_suffix", source_blocks, []),
    ("split_figure_suffix_prose", [block("p", "\uff08\u56fe 228\na\uff09. text"), *known], []),
    ("compact_figure_spacing", [
        block("p", "\uff08\u56fe228\na\uff09. text"),
        {"kind": "cap", "label": "\u56fe228a", "lines": ["\u56fe228a"]},
    ], []),
    ("ordinary_latin_exercise", [block("ex", "a) text"), *known],
     ["ex#1: \u5c0f\u95ee\u6807\u53f7 'a' \u4e0d\u662f\u897f\u91cc\u5c14"]),
    ("ordinary_latin_prose", [block("p", "a) text"), *known],
     ["p#1: \u5c0f\u95ee\u6807\u53f7 'a' \u4e0d\u662f\u897f\u91cc\u5c14"]),
    ("cyrillic_and_numeric_exercise", [block("ex", "\u0430) text\n\u0431\uff09 text\n1) text\n2\uff09 text")], []),
    ("cyrillic_and_numeric_prose", [block("p", "\u0430) text\n1) text")], []),
    ("unrelated_prose_latin", [block("p", "unrelated text\na) text"), *known],
     ["p#1: \u5c0f\u95ee\u6807\u53f7 'a' \u4e0d\u662f\u897f\u91cc\u5c14"]),
    ("unknown_figure_number", [block("p", "\uff08\u56fe 229\na\uff09. text"), *known],
     ["p#1: \u5c0f\u95ee\u6807\u53f7 'a' \u4e0d\u662f\u897f\u91cc\u5c14"]),
    ("wrong_known_suffix", [block("p", "\uff08\u56fe 228\nb\uff09. text"), *known],
     ["p#1: \u5c0f\u95ee\u6807\u53f7 'b' \u4e0d\u662f\u897f\u91cc\u5c14"]),
    ("no_current_figure_or_caption", [block("p", "\uff08\u56fe 228\na\uff09. text")],
     ["p#1: \u5c0f\u95ee\u6807\u53f7 'a' \u4e0d\u662f\u897f\u91cc\u5c14"]),
    ("exercise_not_waived_by_figure", [block("ex", "\uff08\u56fe 228\na\uff09. text"), *known],
     ["ex#1: \u5c0f\u95ee\u6807\u53f7 'a' \u4e0d\u662f\u897f\u91cc\u5c14"]),
    ("later_prose_marker_still_rejected", [block("p", "\uff08\u56fe 228\na\uff09. text\na) subquestion"), *known],
     ["p#1: \u5c0f\u95ee\u6807\u53f7 'a' \u4e0d\u662f\u897f\u91cc\u5c14"]),
    ("not_a_parenthesized_reference", [block("p", "\u56fe 228\na\uff09. text"), *known],
     ["p#1: \u5c0f\u95ee\u6807\u53f7 'a' \u4e0d\u662f\u897f\u91cc\u5c14"]),
    ("numeric_prefix_not_a_suffix", [block("p", "\uff08\u56fe 228\n1. a) text"), *known],
     ["p#1: \u5c0f\u95ee\u6807\u53f7 'a' \u4e0d\u662f\u897f\u91cc\u5c14"]),
]
results = []
for name, blocks, expected in cases:
    original = copy.deepcopy(blocks)
    actual = p2c._validate_page_enums(blocks, profile)
    assert actual == expected, (name, actual, expected)
    assert blocks == original, name
    results.append({"check": name, "pass": True, "expected_errors": expected})

assert p2c.nz.enum_key_script("\u0430") == "cyrillic"
assert p2c.nz.enum_key_script("1") == "numeric"
meta, blocks = p2c.B.load(SCRATCH / "root/10p/pages/0267/page.md")
assert p2c.B.printed_lines(blocks) == 25
expected_meta = copy.deepcopy(source["meta"])
expected_meta["printed_lines"] = meta["printed_lines"]
assert meta == expected_meta
assert meta["printed_lines"] in (25, 26)
expected_blocks = copy.deepcopy(source_blocks)
expected_blocks[6]["samerow"] = True
for value in expected_blocks:
    value.pop("id", None)
assert blocks == expected_blocks
assert p2c._validate_page_enums(blocks, profile) == []
results.append({
    "check": "copied_source_only_caption_samerow_and_computed_25",
    "pass": True,
    "computed_rows": 25,
    "source_block_lines_and_attributes_preserved": True,
})
print(json.dumps({
    "schema": "source267-caption-enum-focused-checks/v1",
    "specification": "Direct bounded repair authorization, independent SOURCE267 report and original-page enum/samerow contract.",
    "existing_test_assertions_read": False,
    "passed": len(results),
    "failed": 0,
    "results": results,
}, ensure_ascii=False, indent=2))
