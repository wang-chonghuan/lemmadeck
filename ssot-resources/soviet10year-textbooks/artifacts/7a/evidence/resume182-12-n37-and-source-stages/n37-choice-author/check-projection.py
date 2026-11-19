"""Verify projection, asset binding and full task accounting, not semantics."""
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
BASE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-author"
assert Path.cwd() == ROOT, "Wrong cwd"


def read(name):
    return json.loads((BASE / name).read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


draft = read("draft.json")
view = read("view-only/view.json")
manifest = read("package-manifest.json")
freeze = read("source-solutions.freeze.json")
coverage = read("task-coverage.json")
opens = read("image-opens.json")
assert set(view) == {"questions", "figures"}
assert view["questions"] == [{"id": q["id"], "view": q["view"]} for q in draft["questions"]]
for q in view["questions"]:
    assert set(q) == {"id", "view"}
    assert set(q["view"]) == {"mode", "stem", "figure_ids", "options"}
    for option in q["view"]["options"]:
        assert set(option) == {"id", "text", "figure_ids"}
registered = {f["id"]: f for f in draft["new_figures"]}
assert len(registered) == len(view["figures"]) == 8
expected_files = {BASE / "view-only/view.json"}
svg_ns = "{http://www.w3.org/2000/svg}"
for figure in view["figures"]:
    assert set(figure) == {"id", "path", "sha256"}
    asset = (ROOT / figure["path"]).resolve()
    assert asset.is_relative_to((BASE / "view-only/public-figures").resolve())
    original = ROOT / registered[figure["id"]]["path"]
    assert sha(asset) == sha(original) == figure["sha256"] == registered[figure["id"]]["sha256"]
    expected_files.add(asset)
    document = ET.fromstring(asset.read_bytes())
    assert document.tag == svg_ns + "svg"
    for element in document.iter():
        tag = element.tag.rsplit("}", 1)[-1]
        assert tag not in {"script", "foreignObject", "metadata", "image"}, tag
        for key, value in element.attrib.items():
            assert not key.lower().startswith("on")
            if key.rsplit("}", 1)[-1] == "href":
                assert value.startswith("#"), "External SVG resource"
    text_nodes = [e.text for e in document.iter(svg_ns + "text")]
    assert len(text_nodes) == 16
    assert text_nodes.count("Origin (0,0)") == 2
assert {p.resolve() for p in (BASE / "view-only").rglob("*") if p.is_file()} == expected_files
assert sha(BASE / "source-solutions.md") == freeze["sha256"]
assert freeze["options_exist_at_freeze"] is False
assert (BASE / "source-solutions.md").stat().st_mode & 0o222 == 0
letters = sum(t["task"] != "proof" for row in coverage for t in row["tasks"])
proofs = sum(t["task"] == "proof" for row in coverage for t in row["tasks"])
assert (len(coverage), letters, proofs) == (22, 100, 1)
assert all(not row["deferred_mathematical_tasks"] for row in coverage)
assert all(len(t["question_ids"]) == 1 for row in coverage for t in row["tasks"])
assert (manifest["counts"]["original_subparts"], manifest["counts"]["unlettered_proof_tasks"]) == (100, 1)
assert len(draft["questions"]) == 31
assert sum(len(q["view"]["options"]) for q in draft["questions"]) == 124
assert opens["initial_context_images"] == opens["other_image_opens"] == 0
assert opens["image_opens"] == len(opens["opens"]) == 8
assert {item["batch"] for item in opens["opens"]} == {1}
for item in opens["opens"]:
    assert sha(ROOT / item["asset_opened"]) == item["asset_sha256"]
    assert sha(ROOT / item["registered_svg"]) == item["registered_svg_sha256"]
    assert item["observation"]
key_counts = manifest["counts"]["key_position_totals"]
assert max(key_counts.values()) - min(key_counts.values()) <= 1
print(json.dumps({
    "status": "pass",
    "scope": "structural projection/asset/freeze/task-count checks only; no semantic approval",
    "public_question_fields": ["id", "view"],
    "public_figures": 8,
    "sources": 22,
    "lettered_subparts": letters,
    "unlettered_proofs": proofs,
    "questions": 31,
    "options": 124,
    "image_opens": 8,
    "frozen_solution_sha256": freeze["sha256"],
    "no_private_projection_fields": True,
    "no_external_svg_resources": True
}, indent=2))
