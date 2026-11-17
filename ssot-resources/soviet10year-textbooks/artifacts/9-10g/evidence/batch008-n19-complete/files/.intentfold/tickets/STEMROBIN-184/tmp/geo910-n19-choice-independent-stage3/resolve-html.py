"""Inspect the expressly disclosed static HTML without a browser or image load."""

from datetime import datetime, timezone
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re


DIRECTORY = Path(__file__).resolve().parent
TMP = DIRECTORY.parent
HTML = Path(
    "/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/render/"
    "9-10g/modern-us-neutral/geo910-c1-s2-n19/choices.html"
)
EXPECTED = "7365b1bf83cd1a75425e2e034ae9b1817d58823956c4156527d3bc9bbcaa706c"
INPUTS = []


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def read(path, role, expected=None):
    raw = path.read_bytes()
    actual = digest(raw)
    if expected is not None:
        assert actual == expected, (str(path), actual, expected)
    INPUTS.append(
        {"path": str(path), "role": role, "sha256": actual, "byte_length": len(raw)}
    )
    return raw


def load(path, role, expected=None):
    return json.loads(read(path, role, expected))


class Element:
    def __init__(self, tag, attrs=()):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []


class TreeParser(HTMLParser):
    VOID = {
        "area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr",
    }

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Element("document")
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        element = Element(tag, attrs)
        self.stack[-1].children.append(element)
        if tag not in self.VOID:
            self.stack.append(element)

    def handle_startendtag(self, tag, attrs):
        element = Element(tag, attrs)
        self.stack[-1].children.append(element)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                return

    def handle_data(self, text):
        self.stack[-1].children.append(text)


def elements(node):
    if isinstance(node, str):
        return
    yield node
    for child in node.children:
        yield from elements(child)


def has_class(node, name):
    return name in node.attrs.get("class", "").split()


def select(node, tag=None, class_name=None):
    return [
        child for child in elements(node)
        if (tag is None or child.tag == tag)
        and (class_name is None or has_class(child, class_name))
    ]


def one(nodes):
    assert len(nodes) == 1, len(nodes)
    return nodes[0]


def plain(node):
    if isinstance(node, str):
        return node
    return "".join(plain(child) for child in node.children)


def recover_math_text(node):
    if isinstance(node, str):
        return node
    if has_class(node, "katex"):
        annotation = one(select(node, "annotation"))
        assert annotation.attrs.get("encoding") == "application/x-tex"
        return "$" + plain(annotation) + "$"
    return "".join(recover_math_text(child) for child in node.children)


def normalize(text):
    return re.sub(r"\s+", "", text)


def canonical(value):
    return json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode()


raw_html = read(HTML, "new_explicit_actual_html_disclosure_static_parse", EXPECTED)
parser = TreeParser()
parser.feed(raw_html.decode("utf-8"))
parser.close()
tree = parser.root
main = one(select(tree, "main"))
sections = select(main, "section", "question")
assert len(sections) == 6
phase2 = load(
    TMP / "geo910-n19-choice-independent-phase2/phase2.json",
    "immutable_independent_view_snapshot_only_no_mathematical_recheck",
    "c0ace941b0ed1643056ffbd84e79320605fcb64206177818a6c9bcfb25575fec",
)
old_stage3 = load(
    DIRECTORY / "old-stage3-comparison.json",
    "immutable_observed_screenshot_inventory",
    "c1f4b89bce741d7ba99e2d1a50add97c3f3be2eba1fdeafded3bef685845c8e1",
)
report = load(
    TMP / "offline/geo910-c1-s2-n19/choices-report.json",
    "previously_disclosed_hash_bound_screenshot_geometry_report",
    "d6bad43525ac22eceb4b07043d40381b1298d96b970870f758dacaa5230529b1",
)
assert report["htmlSha256"] == digest(raw_html)
assert one(select(main, "h1"))
assert [
    child.tag for child in main.children
    if isinstance(child, Element)
] == ["h1", "section", "section", "section", "section", "section", "section"]
assert not select(tree, "script")
assert not select(tree, "iframe")
assert not select(tree, "object")
assert not select(tree, "embed")
assert len(select(tree, "input")) == 24
assert len(select(tree, "label", "option")) == 24

for node in elements(tree):
    assert "hidden" not in node.attrs
    assert not any(key.startswith("on") for key in node.attrs), node.attrs
    assert not any(
        key.startswith("data-") and re.search(
            r"(correct|answer|key|solution|source|rationale|misconception|coverage)", key
        )
        for key in node.attrs
    ), node.attrs

bindings = []
for index, section in enumerate(sections):
    frozen = phase2["view_solutions"][index]
    view = frozen["exact_disclosed_view"]
    identifier = old_stage3["question_key_comparisons"][index]["question_id"]
    assert section.attrs["data-question"] == identifier
    assert report["questionIds"][index] == identifier
    heading = plain(one(select(section, "h2"))).strip()
    expected_heading = f"{index + 1}. {'单选题' if view['mode'] == 'single' else '多选题'}"
    assert heading == expected_heading, (heading, expected_heading)
    stem = recover_math_text(one(select(section, "div", "stem"))).strip()
    assert normalize(stem) == normalize(view["stem"]), (index + 1, stem, view["stem"])
    options = select(section, "label", "option")
    assert len(options) == 4
    option_bindings = []
    for option_index, label in enumerate(options):
        expected = view["options"][option_index]
        control = one(select(label, "input"))
        assert control.attrs == {
            "type": "radio" if view["mode"] == "single" else "checkbox",
            "name": identifier,
            "value": expected["id"],
        }
        assert plain(one(select(label, "span", "letter"))) == expected["id"] + "."
        contents = [
            child for child in label.children
            if isinstance(child, Element) and child.tag == "div"
        ]
        content = recover_math_text(one(contents)).strip()
        assert normalize(content) == normalize(expected["text"]), (
            index + 1, expected["id"], content, expected["text"]
        )
        assert not select(label, "figure")
        assert not expected["figure_ids"]
        option_bindings.append(
            {
                "option_id": expected["id"],
                "control": control.attrs,
                "recovered_text": content,
                "expected_text_utf8_sha256": digest(expected["text"].encode()),
                "normalized_text_matches": True,
                "preselected": False,
            }
        )
    figures = select(section, "figure")
    assert len(figures) == len(view["figure_ids"])
    assert not select(section, "figcaption")
    bindings.append(
        {
            "ordinal": index + 1,
            "question_id": identifier,
            "view_canonical_sha256": frozen["view_sha256"],
            "heading": heading,
            "recovered_stem": stem,
            "normalized_stem_matches": True,
            "figure_inventory": view["figure_ids"],
            "inline_figure_count": len(figures),
            "option_bindings": option_bindings,
        }
    )

assert sum(item["inline_figure_count"] for item in bindings) == 2
learner_payload = "".join(recover_math_text(section) for section in sections)
for phrase in ("source_solution", "correct_index", "seed_sha256", "draft_sha256",
               "misconception", "rationales", "source_numbers", "omitted_tasks"):
    assert phrase not in learner_payload

record = {
    "schema": "s10y-choice-independent-stage3-prospective-html-resolution-v1",
    "resolved_at": datetime.now(timezone.utc).isoformat(),
    "status": "pass",
    "actual_html_path": str(HTML),
    "actual_html_sha256": digest(raw_html),
    "parent_disclosure_correction": "Original T/offline/choices.html was a mistaken path, not repaired content. This exact explicitly disclosed file has the original report's HTML hash.",
    "historical_missing_html_record": {
        "old_stage3_comparison_path": str(DIRECTORY / "old-stage3-comparison.json"),
        "old_stage3_sha256": digest((DIRECTORY / "old-stage3-comparison.json").read_bytes()),
        "old_exact_path": str(TMP / "offline/geo910-c1-s2-n19/choices.html"),
        "old_ENOENT_record_unchanged": True,
        "retroactive_pass": False,
    },
    "method": "Standard-library HTMLParser; recover exact application/x-tex annotations once per KaTeX block. Compare every stem/option with Phase 2 projection allowing only whitespace differences. No browser, renderer, image open, source solve or math recheck.",
    "question_count": len(bindings),
    "option_count": sum(len(item["option_bindings"]) for item in bindings),
    "all_six_complete_views_match": True,
    "bindings": bindings,
    "learner_payload_audit": {
        "scripts": 0,
        "active_external_frames_or_objects": 0,
        "hidden_key_nodes_or_answer_attributes": 0,
        "preselected_options": 0,
        "source_solution_key_rationale_coverage_payloads": 0,
        "only_main_content": "Lesson title, six numbered mode headings, stems, two actual concept figures and 24 blank options.",
        "internal_question_ids_in_control_names": "Procedural identifiers only, not displayed source mappings or answer keys.",
        "caption_error_observed": False,
    },
    "screenshot_binding": {
        "report_path": str(TMP / "offline/geo910-c1-s2-n19/choices-report.json"),
        "report_sha256": digest((TMP / "offline/geo910-c1-s2-n19/choices-report.json").read_bytes()),
        "report_html_hash_matches_actual_bytes": True,
        "screenshots": [
            {
                "path": old_stage3["learner_screenshot_comparison"][size]["path"],
                "sha256": old_stage3["learner_screenshot_comparison"][size]["sha256"],
                "dimensions": old_stage3["learner_screenshot_comparison"][size]["dimensions"],
                "observation_reused": old_stage3["learner_screenshot_comparison"][size]["evidence"],
                "reopened": False,
            }
            for size in ("desktop", "mobile")
        ],
        "limitation": "Hash-bound supplied screenshots and static HTML, not a new live browser run or application integration test.",
    },
    "image_budget": {"opens_added": 0, "cumulative_opens": 4, "reopens": 0, "hard_limit": 8},
    "inputs": INPUTS,
    "parser_script_path": str(Path(__file__).resolve()),
    "parser_script_sha256": digest(Path(__file__).read_bytes()),
}
output = DIRECTORY / "html-resolution.json"
with output.open("xb") as stream:
    stream.write((json.dumps(record, ensure_ascii=True, indent=2) + "\n").encode())
print(json.dumps(
    {
        "status": record["status"],
        "actual_html_sha256": record["actual_html_sha256"],
        "matching_views": record["question_count"],
        "matching_options": record["option_count"],
        "scripts_or_keys_found": False,
        "report_html_binding_matches": True,
        "new_image_opens": 0,
        "cumulative_opens": 4,
        "resolution_sha256": digest(output.read_bytes()),
    },
    indent=2,
))
