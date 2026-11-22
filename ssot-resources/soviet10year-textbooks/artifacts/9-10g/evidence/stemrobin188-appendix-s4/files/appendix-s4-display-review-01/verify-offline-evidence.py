"""Read completed S4 display evidence only; never run a producer or browser."""

import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
TMP = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp"
OUT = TMP / "appendix-s4-display-review-01"
WIDTH = TMP / "appendix-s4-display-width-repair-02"
FINISH = TMP / "appendix-s4-finish-01"
SURFACE = TMP / "offline-display-9-10g_geo910-appendix-s4-surfaces"
EDITION = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral"
HTML = TMP / "appendix-s4-source-repair-02/work/render/9-10g/modern-us-neutral/geo910-appendix-s4/text.html"
assert Path.cwd() == ROOT


def read_json(path):
    return json.loads(path.read_text())


def bound(path, expected=None):
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if expected is not None:
        assert digest == expected, str(path)
    return {"path": str(path), "sha256": digest}


class Element:
    def __init__(self, tag, attrs):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []

    def has_class(self, name):
        return name in self.attrs.get("class", "").split()


class Document(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Element("root", [])
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        element = Element(tag, attrs)
        self.stack[-1].children.append(element)
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img",
                       "input", "link", "meta", "param", "source", "track", "wbr"}:
            self.stack.append(element)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Element(tag, attrs))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                self.stack = self.stack[:index]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def elements(node):
    if isinstance(node, str):
        return
    yield node
    for child in node.children:
        yield from elements(child)


def plain(node):
    if isinstance(node, str):
        return node
    if node.tag == "br":
        return "\n"
    if node.has_class("katex"):
        annotations = [n for n in elements(node) if n.tag == "annotation"]
        assert len(annotations) == 1
        return "$" + plain(annotations[0]) + "$"
    return "".join(plain(child) for child in node.children)


def normalized(text):
    return "".join(text.split())


def differences(before, after, path=""):
    if before == after:
        return []
    if isinstance(before, dict) and isinstance(after, dict):
        result = []
        for key in sorted(before.keys() | after.keys()):
            result.extend(differences(before.get(key), after.get(key), path + "/" + key))
        return result
    return [{"path": path, "before": before, "after": after}]


def completed_receipt(path):
    receipt = read_json(path)
    assert receipt.get("cwd") == str(ROOT), str(path)
    assert receipt.get("exitCode") == 0, str(path)
    assert receipt.get("error") is None and receipt.get("exception") is None
    streams = []
    for record in [receipt] + receipt.get("nestedCompleted", []):
        assert record.get("exitCode") == 0
        assert record.get("cwd") == str(ROOT)
        assert set(record["streams"]) == {"stdout", "stderr"}
        for stream in record["streams"].values():
            stream_path = Path(stream["path"])
            if not stream_path.is_absolute():
                stream_path = path.parent / stream_path
            streams.append(bound(stream_path, stream["sha256"]))
    if "nestedRequests" in receipt:
        assert len(receipt["nestedRequests"]) == len(receipt["nestedCompleted"])
    return {
        **bound(path),
        "exitCode": 0,
        "allRecordedCommandsComplete": True,
        "recordedNestedCommands": len(receipt.get("nestedCompleted", [])),
        "streamHashesVerified": streams,
        "reexecuted": False
    }


document = Document()
html_text = HTML.read_text()
document.feed(html_text)
nodes = list(elements(document.root))
paragraphs = [n for n in nodes if n.tag == "p" and n.has_class("para")]
flow_path = FINISH / "receipts/adapt-finalize-anchor-native-nested-04.stdout"
flow = read_json(flow_path)
assert len(paragraphs) == len(flow["paragraphs"]) == 18
paragraph_matches = [
    normalized(plain(actual)) == normalized(expected["text"])
    for actual, expected in zip(paragraphs, flow["paragraphs"])
]
assert all(paragraph_matches), paragraph_matches
section_indices = [i for i, p in enumerate(paragraphs) if p.has_class("section")]
assert section_indices == flow["resolvedBreaks"] == [2, 3, 14]
figures = [n for n in nodes if n.has_class("fig")]
captions = [n for n in nodes if n.has_class("figcap")]
assert len(figures) == len(captions) == 1
assert len([n for n in elements(figures[0]) if n.tag == "svg"]) == 1
assert normalized(plain(captions[0])) == "\u56fe171"
assert not [n for n in nodes if n.has_class("err") or n.has_class("katex-error")]
assert not [n for n in nodes if n.tag == "li" and n.has_class("ex")]
assert ".nb{display:inline-block;max-width:100%;overflow-x:auto;" in html_text
long_math = r"\cos\beta\cos\gamma-\sin\beta\sin\gamma<\cos\alpha<\cos\beta\cos\gamma+\sin\beta\sin\gamma"
math_annotations = [plain(n) for n in elements(paragraphs[6]) if n.tag == "annotation"]
assert long_math in math_annotations

result = read_json(SURFACE / "result.json")
assert result["headless"] is True and result["offline"] is True
assert len(result["results"]) == 2
for observation, viewport, width, font in zip(
        result["results"], [1440, 390], [480, 358], [28, 20.883333333333333]):
    assert observation["kind"] == "text"
    assert observation["lesson"] == "geo910-appendix-s4"
    assert observation["viewport"]["width"] == viewport
    assert observation["layout"]["documentWidth"] == viewport
    assert observation["layout"]["figures"] == [{"id": "fig-g10-171", "width": width}]
    assert abs(observation["layout"]["minFigureTextPx"] - font) < 0.001
    bound(Path(observation["screenshot"]), observation["screenshotSha256"])

before = read_json(WIDTH / "before.spec.json")
after = read_json(WIDTH / "spec.json")
spec_diff = differences(before, after)
assert spec_diff == [{"path": "/display/widths", "before": [300, 480], "after": [300, 358, 480]}]
render = read_json(WIDTH / "fig-g10-171.render.json")
assert render["status"] == "pass"
assert render["collisions"] == []
assert [c["width"] for c in render["displayChecks"]] == [300, 358, 480]
assert all(c["status"] == "pass" and not c["failures"] for c in render["displayChecks"])
assert abs(render["displayChecks"][1]["measuredMinPx"] - 20.883333333333333) < 0.001
bound(WIDTH / "spec.json", render["spec"]["sha256"])
svg_hash = "31ff8269e9ee7ba918b285f51fe672a749dbfcdf3a0971c6534edc550aed7226"
svg_paths = [WIDTH / "before.svg", WIDTH / "fig-g10-171.svg", EDITION / "figures/fig-g10-171.svg"]
svgs = [bound(path, svg_hash) for path in svg_paths]
assert svg_paths[0].read_bytes() == svg_paths[1].read_bytes() == svg_paths[2].read_bytes()

reuse = []
for relative, expected in [
    ("appendix-s4-figure171-review-01/figure-review.json", "7b0a6aec2b6a9cd2937d9debb7b9f960106894fb3f3259074b3eef4933665157"),
    ("appendix-s4-text-review-01/text-review.json", "f506ba846a8ce04a624689f28c3f1c042a06c1a5a97bfc257f002ae924aa7fa6"),
    ("appendix-s4-anchor-affected-review-02/affected-review.json", "3d32d65ebba2de70c9c4599d1cb944341d4a5b471b18d3200ac87951cf79020f")
]:
    path = TMP / relative
    assert read_json(path)["verdict"] == "PASS"
    reuse.append({**bound(path, expected), "verdict": "PASS", "reusedWithoutRerun": True})

lesson_path = EDITION / "lessons/geo910-appendix-s4/lesson.json"
exercise_path = lesson_path.with_name("exercises.json")
audit_path = lesson_path.with_name("adaptation.audit.json")
lesson, exercises, audit = map(read_json, [lesson_path, exercise_path, audit_path])
assert len(lesson["prose"]) == audit["proseBlocks"] == 12
assert len(lesson["section_breaks"]) == audit["sectionBreaks"] == 3
assert len(lesson["figures"]) == audit["figures"] == 1
assert lesson["exercise_count"] == exercises["count"] == audit["exercises"] == 0
assert exercises["exercises"] == []
assert audit["errors"] == []

receipts = [completed_receipt(path) for path in [
    FINISH / "receipts/offline-display.command.json",
    WIDTH / "render.command.json",
    FINISH / "receipts/adapt-finalize-anchor-native.command.json",
    FINISH / "receipts/render.command.json"
]]
files = [bound(path) for path in [
    OUT / "initial-visual-judgments.json",
    OUT / "verify-offline-evidence.py",
    HTML,
    flow_path,
    SURFACE / "result.json",
    FINISH / "display.json",
    FINISH / "finish.json",
    WIDTH / "before.spec.json",
    WIDTH / "spec.json",
    WIDTH / "fig-g10-171.render.json",
    lesson_path,
    exercise_path,
    audit_path,
    OUT / "desktop-figure-and-continuation-crop.png",
    OUT / "mobile-figure-and-caption-crop.png",
    OUT / "desktop-case-b-tail-crop.png",
    OUT / "mobile-contained-math-edge-crop.png"
]]
print(json.dumps({
    "status": "PASS_READ_ONLY_EVIDENCE_CHECK",
    "allcommandcomplete": True,
    "html": {
        "textParagraphCount": len(paragraphs),
        "matchesCompletedNativeParagraphs": paragraph_matches,
        "sectionParagraphIndices": section_indices,
        "figureCount": len(figures),
        "captionCount": len(captions),
        "errorElements": 0,
        "exerciseElements": 0,
        "longMobileMathCompleteInContainedOverflowAutoSpan": True,
        "scrollEndInteractionNotClaimed": True,
        "paragraphLocations": [
            {"index": i, "nativeBlockIndex": expected["blockIndex"],
             "displayStart": plain(actual)[:60], "displayEnd": plain(actual)[-60:]}
            for i, (actual, expected) in enumerate(zip(paragraphs, flow["paragraphs"]))
        ]
    },
    "nativeScope": {"blocks": 12, "breaks": 3, "exercises": 0, "figures": 1},
    "specDiff": spec_diff,
    "widthChecks": render["displayChecks"],
    "byteIdenticalSvgs": svgs,
    "reusedReviews": reuse,
    "receipts": receipts,
    "files": files,
    "noProducerOrBrowserOrSourceValidatorReexecuted": True,
    "parentWidthRepairSemanticReportRead": False
}, ensure_ascii=True, indent=2))
