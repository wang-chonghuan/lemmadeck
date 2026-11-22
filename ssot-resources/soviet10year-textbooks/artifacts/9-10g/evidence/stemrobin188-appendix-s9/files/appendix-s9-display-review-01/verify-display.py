import hashlib
import json
import re
import struct
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/appendix-s9-display-review-01"
TMP = ".intentfold/tickets/STEMROBIN-188/tmp"
CORE = "ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-appendix-s9"
SURFACES = f"{TMP}/offline-display-9-10g_geo910-appendix-s9-surfaces"
HTML = f"{TMP}/appendix-s9-draft-03/work/render/9-10g/modern-us-neutral/geo910-appendix-s9/text.html"
PRIOR = f"{TMP}/s9-source-affected-and-text-review-02/text-review.json"


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def load(relative):
    return json.loads((ROOT / relative).read_text())


class Element:
    def __init__(self, tag, attrs=()):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []

    def has_class(self, name):
        return name in self.attrs.get("class", "").split()


class SavedHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Element("document")
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Element(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in {"area", "base", "br", "col", "embed", "hr", "img",
                       "input", "link", "meta", "param", "source", "track", "wbr"}:
            self.stack.append(node)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def walk(node):
    if isinstance(node, Element):
        yield node
        for child in node.children:
            yield from walk(child)


def plain(node):
    if isinstance(node, str):
        return node
    return "".join(plain(child) for child in node.children)


def projection(node):
    if isinstance(node, str):
        return node
    if node.has_class("katex-display") or node.has_class("katex"):
        annotations = [n for n in walk(node) if n.tag == "annotation"
                       and n.attrs.get("encoding") == "application/x-tex"]
        assert len(annotations) == 1
        delimiter = "$$" if node.has_class("katex-display") else "$"
        return delimiter + plain(annotations[0]) + delimiter
    if node.tag == "br":
        return "\n"
    return "".join(projection(child) for child in node.children)


def compact(text):
    return re.sub(r"\s+", "", text)


parser = SavedHTML()
parser.feed((ROOT / HTML).read_text())
nodes = list(walk(parser.root))
paragraphs = [n for n in nodes if n.tag == "p" and n.has_class("para")]
texts = [projection(p) for p in paragraphs]
lesson = load(f"{CORE}/lesson.json")
exercises = load(f"{CORE}/exercises.json")
figures = load(f"{CORE}/figures.json")
audit = load(f"{CORE}/adaptation.audit.json")
prior = load(PRIOR)
template_path = prior["bindings"]["current_lesson_template"]["path"]
template = load(template_path)
assert sha(ROOT / PRIOR) == "81cfc03fe4ef65493f308398030878b0ff491af059fd7b83ef0ccca14458fed2"
assert sha(ROOT / template_path) == prior["bindings"]["current_lesson_template"]["sha256"]
assert lesson["prose"] == template["prose"]
assert lesson.get("section_breaks") == template.get("section_breaks")
assert len(lesson["prose"]) == 28
assert len(paragraphs) == 29
assert all(compact(texts[i]) == compact(lesson["prose"][i]["text"])
           for i in range(27))
assert compact("\n".join(texts[27:])) == compact(lesson["prose"][27]["text"])

display_nodes = [n for n in nodes if n.has_class("katex-display")]
assert len(display_nodes) == 16
display_tex = [
    plain(next(n for n in walk(display) if n.tag == "annotation"))
    for display in display_nodes
]
expected_tex = [
    formula for block in lesson["prose"]
    for formula in re.findall(r"\$\$(.*?)\$\$", block["text"], re.S)
]
assert display_tex == expected_tex
labels = [re.match(r"^\$\\mathrm\{(I{1,3}|IV|V)\}_(\d)\$", t)
          for t in texts]
labels = [m.group(1) + m.group(2) for m in labels if m]
assert labels == [
    "I1", "I2", "I3", "I4", "II1", "II2", "II3", "II4",
    "III1", "III2", "III3", "III4", "IV1", "IV2", "V1", "V2", "V3",
]
group_indices = [i for i, t in enumerate(texts)
                 if re.match(r"^第[一二三四五]组", t)]
assert group_indices == [1, 7, 13, 19, 22]

seen_paragraphs = 0
separators = []
for node in nodes:
    if node in paragraphs:
        if node.has_class("section"):
            separators.append({
                "element": "p.para.section",
                "before_paragraph_index": seen_paragraphs - 1,
                "after_paragraph_index": seen_paragraphs,
                "before": texts[seen_paragraphs - 1],
                "after": texts[seen_paragraphs],
            })
        seen_paragraphs += 1
assert [s["after_paragraph_index"] for s in separators] == [1, 7, 13, 19, 22, 27]
assert len(audit["resolvedSectionBreaks"]) == 6
for anchor, separator in zip(audit["resolvedSectionBreaks"], separators):
    assert anchor["index"] == separator["after_paragraph_index"]
    assert compact(anchor["before"]) == compact(separator["before"])
    assert compact(anchor["after"]) == compact(separator["after"])

assert exercises["count"] == 0 and exercises["exercises"] == []
assert lesson["exercise_count"] == 0 and lesson["figures"] == []
assert figures["figures"] == []
assert audit["status"] == "pass" and audit["errors"] == []
assert not [n for n in nodes if n.has_class("katex-error") or n.tag == "img"]
titles = [plain(n) for n in nodes if n.tag == "h1"]
assert titles == [lesson["title"]]
links = [{"text": plain(n), "href": n.attrs.get("href")}
         for n in nodes if n.tag == "a"]
styles = [plain(n) for n in nodes if n.tag == "style"]
css_rules = [match.group(0) for css in styles
             for match in re.finditer(r"[^{}]+\{[^{}]*\}", css)
             if "@font-face" not in match.group(0)
             and "data:" not in match.group(0)]
relevant_css = [rule for rule in css_rules
                if any(term in rule.split("{", 1)[0]
                       for term in ["body", "h1", ".para", ".section", ".nb", ".katex-display",
                                    ".meta", "hr", ".next", ".btn"])]

mechanical = load(f"{SURFACES}/result.json")
assert mechanical["offline"] is True and mechanical["headless"] is True
assert len(mechanical["results"]) == 2
screenshot_metadata = []
for result, viewport in zip(mechanical["results"], [(1440, 960), (390, 844)]):
    assert result["book"] == "9-10g" and result["lesson"] == lesson["id"]
    assert result["kind"] == "text"
    assert (result["viewport"]["width"], result["viewport"]["height"]) == viewport
    assert result["layout"]["documentWidth"] == viewport[0]
    assert result["status"] == "mechanical display pass; visual inspection pending"
    for filename, digest in result["sourceHashes"].items():
        assert sha(ROOT / CORE / filename) == digest
    path = Path(result["screenshot"])
    assert sha(path) == result["screenshotSha256"]
    header = path.read_bytes()[:24]
    assert header[:8] == b"\x89PNG\r\n\x1a\n"
    width, height = struct.unpack(">II", header[16:24])
    assert width == viewport[0] and height > viewport[1]
    screenshot_metadata.append({
        "path": str(path), "sha256": sha(path), "png_width": width,
        "png_height": height, "recorded_viewport": result["viewport"],
        "recorded_layout": result["layout"],
        "pixel_decode": "None in this script; PNG header metadata only.",
    })

receipts = []
for stage in ["display", "render"]:
    relative = f"{TMP}/appendix-s9-finish-01/{stage}-01/command.json"
    receipt = load(relative)
    assert receipt["cwd"] == str(ROOT) and receipt["exitCode"] == 0
    assert receipt["signal"] is None and receipt["error"] is None
    for stream in receipt["streams"].values():
        assert sha(stream["path"]) == stream["sha256"]
    receipts.append({
        "stage": stage, "path": relative, "sha256": sha(ROOT / relative),
        "facts": receipt, "stream_hashes_verified": True,
        "execution": "Previously completed command; not replayed.",
    })

bound_paths = [f"{CORE}/{name}" for name in
               ["lesson.json", "exercises.json", "figures.json", "adaptation.audit.json"]]
bound_paths += [HTML, PRIOR, template_path, f"{SURFACES}/result.json"]
output = {
    "schema": "stemrobin188-s9-saved-html-bindings@1",
    "cwd": str(ROOT),
    "method": "Standard-library HTMLParser on saved HTML; no browser, renderer, normalizer or source/math re-review.",
    "paths_relative_to": "cwd, except screenshot and stream paths",
    "bindings": [{"path": p, "sha256": sha(ROOT / p)} for p in bound_paths],
    "semantic_reuse": {
        "prior_review_sha256_matches": True,
        "approved_template_sha256_matches": True,
        "current_core_prose_and_section_breaks_equal_approved_template": True,
    },
    "counts": {
        "core_prose_blocks": 28, "normalized_html_paragraphs": 29,
        "groups": 5, "axioms": 17, "display_formulas": 16,
        "adjacent_separators": 6, "exercises": 0, "figures": 0, "choices": 0,
    },
    "title": titles[0],
    "group_paragraph_indices": group_indices,
    "axiom_labels_in_order": labels,
    "paragraphs": [{"index": i, "projection": t} for i, t in enumerate(texts)],
    "projection_rule": "Replace each KaTeX subtree with its single TeX annotation and original display/inline delimiter; preserve br as newline; ignore whitespace only for binding comparison. Do not duplicate MathML and visual glyphs.",
    "paragraph_binding": "HTML p[0:27] matches core prose[0:27]; HTML p[27] plus p[28] matches closing core prose[27].",
    "display_tex_in_order": display_tex,
    "all_display_tex_equal_current_core_in_order": True,
    "adjacent_separators": separators,
    "all_six_audit_anchors_equal_adjacent_html_paragraphs": True,
    "relevant_saved_css": relevant_css,
    "page_tail_links": links,
    "screenshot_metadata": screenshot_metadata,
    "mechanical_result": mechanical,
    "completed_command_receipts": receipts,
    "review_script": {"path": str(Path(__file__).resolve()), "sha256": sha(__file__)},
    "status": "PASS_STATIC_BINDINGS_ONLY_NOT_PIXEL_OR_INTERACTION_APPROVAL",
}
target = OUT / "html-bindings.json"
target.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "status": output["status"], "output": str(target), "sha256": sha(target),
    "counts": output["counts"], "css": relevant_css,
    "screenshots": screenshot_metadata, "tail_links": links,
    "receipt_stream_hashes_verified": True,
}, ensure_ascii=False, indent=2))
