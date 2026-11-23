import hashlib
import json
import shutil
from html.parser import HTMLParser
from pathlib import Path

repo = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-181")
assert Path.cwd() == repo
ticket = repo / ".intentfold/tickets/STEMROBIN-181"
prior = ticket / "evidence/reports/d1274-n98-readiness"
author = ticket / "evidence/reports/d1238-current-progress/d1210-n98-fig226-first-author"
out = ticket / "tmp/d1816-d1885-n98-approved-figure-recovery"
out.mkdir(parents=True, exist_ok=False)
review = json.loads((prior / "figure-affected-review.json").read_text())
expected = review["bindings"]


def digest(data):
    return hashlib.sha256(data).hexdigest()


def binding(file):
    data = file.read_bytes()
    return {"path": str(file), "bytes": len(data), "sha256": digest(data)}


class SvgRanges(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=False)
        self.text = text
        self.offsets = [0]
        for line in text.splitlines(keepends=True):
            self.offsets.append(self.offsets[-1] + len(line))
        self.depth = 0
        self.start = None
        self.ranges = []

    def offset(self):
        line, column = self.getpos()
        return self.offsets[line - 1] + column

    def handle_starttag(self, tag, attrs):
        if tag == "svg":
            if self.depth == 0:
                self.start = self.offset()
            self.depth += 1

    def handle_endtag(self, tag):
        if tag == "svg":
            self.depth -= 1
            if self.depth == 0:
                self.ranges.append((self.start, self.offset() + len("</svg>")))


spec_file = author / "fig-226.spec.json"
assert binding(spec_file)["sha256"] == expected["spec"]["sha256"]
shutil.copyfile(spec_file, out / "fig-226.spec.json")
html_file = prior / "en/html/text.html"
html = html_file.read_text()
parser = SvgRanges(html)
parser.feed(html)
matches = []
for start, end in parser.ranges:
    for ending in ("", "\n"):
        data = (html[start:end] + ending).encode()
        if digest(data) == expected["svg"]["sha256"]:
            matches.append(data)
matches = list(dict.fromkeys(matches))
if matches:
    assert len(matches) == 1
    (out / "fig-226.svg").write_bytes(matches[0])

original_render_file = author / "fig-226.render.json"
render = json.loads(original_render_file.read_text())
render["output"]["svg"] = {
    "path": ".intentfold/tickets/STEMROBIN-181/tmp/d1230-fig226-vector-glyph-native-repair/fig-226.svg",
    "sha256": expected["svg"]["sha256"],
}
render_bytes = (json.dumps(render, ensure_ascii=False, indent=2) + "\n").encode()
render_matches = digest(render_bytes) == expected["render"]["sha256"]
if render_matches:
    (out / "fig-226.render.json").write_bytes(render_bytes)
report = {
    "card": "phy10-c2-s4-n98",
    "status": "EXACT_APPROVED_FIGURE_BYTES_RECOVERED" if matches and render_matches
              else "PARTIAL_EXACT_RECOVERY_NO_APPROVAL_INVENTED",
    "existingAffectedReview": binding(prior / "figure-affected-review.json"),
    "svgCarrier": binding(html_file),
    "originalRender": binding(original_render_file),
    "recovered": [binding(file) for file in sorted(out.glob("fig-226.*"))],
    "svgRecoveredWithApprovedSha": bool(matches),
    "renderRecoveredWithApprovedSha": render_matches,
    "nativeReviewExpected": review["nativeReview"]["file"],
    "nativeReviewStillMissing": True,
    "svgCandidates": len(parser.ranges),
    "recoveredDrawingContentChanged": False,
    "figureRegenerationCalls": 0,
    "newApprovals": 0,
    "imagesOpened": 0,
    "databaseWrites": 0,
    "paidCalls": 0,
}
(out / "result.json").write_text(json.dumps(report, indent=2) + "\n")
print(json.dumps(report))
