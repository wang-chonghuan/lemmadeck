import copy
import hashlib
import json
import re
import sys
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == REPO
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
from edition import normalize_lesson_layout, prose_flow_contract, validate_lesson_identity

T = REPO / ".intentfold/tickets/STEMROBIN-181"
OUT = T / "tmp/d1816-d365-n149-native-layout-repair"
BASE = REPO / ".tmp/STEMROBIN-181/d1816-d337"
ID = "phy10-c3-s4-n149"


def binding(file):
    raw = file.read_bytes()
    return {"path": str(file), "bytes": len(raw), "sha256": hashlib.sha256(raw).hexdigest()}


def save(file, value):
    file.parent.mkdir(parents=True, exist_ok=True)
    with file.open("x") as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def compact(text):
    return re.sub(r"\s+", "", text)


assert not OUT.exists()
failure_file = T / "tmp/d1816-d337-n149-native/result.json"
failure = json.loads(failure_file.read_text())
assert failure["status"] == "native-failure"
changes = []
for locale, edition in [("zh", "modern-us-neutral"), ("en", "modern-us-neutral-en")]:
    file = BASE / f"source-work/adapt/10p/{edition}/lessons/{ID}/lesson.template.json"
    old = json.loads(file.read_text())
    before = binding(file)
    old_flow, errors = prose_flow_contract(old["prose"], old["section_breaks"])
    assert not errors, errors
    new = copy.deepcopy(old)
    if locale == "zh":
        new["printed_title"] = new["source"]["data"]["printed_title"]
        assert compact(new["printed_title"].replace("**", "").replace("$", "")) == compact(
            old["printed_title"].replace("**", "").replace("$", "")
        )
    normalize_lesson_layout(new)
    normalized_flow, errors = prose_flow_contract(new["prose"], [])
    assert not errors, errors
    changed_entries = []
    for index, (source, target) in enumerate(zip(old["prose"], new["prose"])):
        assert compact(source["text"]) == compact(target["text"])
        for key in set(source) | set(target):
            if key not in {"text", "changes"}:
                assert source.get(key) == target.get(key), key
        if source != target:
            changed_entries.append(index)
    positions = {}
    offset = 0
    new_paragraphs = normalized_flow["paragraphs"]
    for index, paragraph in enumerate(new_paragraphs):
        positions[offset] = index
        offset += len(compact(paragraph["text"]))
    old_offset = 0
    old_breaks = {item["index"] for item in old_flow["boundaries"]}
    new_breaks = []
    for index, paragraph in enumerate(old_flow["paragraphs"]):
        if index in old_breaks:
            assert old_offset in positions, "Concept boundary moved inside a paragraph"
            target = positions[old_offset]
            assert target > 0
            new_breaks.append({"before": new_paragraphs[target - 1]["text"],
                               "after": new_paragraphs[target]["text"]})
        old_offset += len(compact(paragraph["text"]))
    new["section_breaks"] = new_breaks
    flow, errors = prose_flow_contract(new["prose"], new["section_breaks"])
    assert not errors, errors
    assert len(flow["boundaries"]) == len(old_flow["boundaries"])
    assert not validate_lesson_identity(new["source"]["data"], new)
    repeated = copy.deepcopy(new)
    normalize_lesson_layout(repeated)
    assert repeated == new
    assert new["source"] == old["source"]
    before_file = OUT / f"{locale}.before.template.json"
    save(before_file, old)
    file.write_text(json.dumps(new, ensure_ascii=False, indent=2) + "\n")
    after_file = OUT / f"{locale}.after.template.json"
    save(after_file, new)
    changes.append({"locale": locale, "edition": edition, "before": before,
                    "beforeSnapshot": binding(before_file),
                    "afterSnapshot": binding(after_file), "working": binding(file),
                    "changedEntries": changed_entries,
                    "oldParagraphs": len(old_flow["paragraphs"]),
                    "newParagraphs": len(flow["paragraphs"]),
                    "oldBoundaries": old_flow["boundaries"],
                    "newBoundaries": flow["boundaries"],
                    "metadataChange": "Restore exact source Chinese printed-title markup" if locale == "zh" else None})
source_spec_file = REPO / ".tmp/STEMROBIN-181/d1816-d352/fig-277.spec.json"
original_spec = json.loads(source_spec_file.read_text())
spec = copy.deepcopy(original_spec)
current = {}
for row in changes:
    template = json.loads(Path(row["working"]["path"]).read_text())
    for field in ["chapter", "title", "printed_title"]:
        current[f"{ID}/{row['edition']}/{field}"] = template[field]
    for index, block in enumerate(template["prose"]):
        if block["text"]:
            current[f"{ID}/{row['edition']}/prose/{index + 1:03}"] = block["text"]
context_changes = []
for row in spec["source"]["authoritativeText"]:
    text = current[row["lesson"]]
    if text != row["text"]:
        context_changes.append({"lesson": row["lesson"], "before": row["text"], "after": text})
    row["text"] = text
spec["source"]["image"]["path"] = "ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-277.png"
assert set(current) == {row["lesson"] for row in spec["source"]["authoritativeText"]}
assert spec["objects"] == original_spec["objects"]
assert spec["assertions"] == original_spec["assertions"]
assert spec["source"]["inventory"] == original_spec["source"]["inventory"]
spec_file = OUT / "fig-277.current.spec.json"
save(spec_file, spec)
save(OUT / "author-freeze.json", {
    "stage": "D365", "lesson": ID, "changes": changes, "contextChanges": context_changes,
    "currentSpec": binding(spec_file), "oldSpec": binding(source_spec_file),
    "originalNativeFailure": binding(failure_file),
    "scope": "Native-normalized whitespace/paragraphs and same-position concept anchors; exact Chinese printed-title markup; matching complete figure context and durable source path.",
    "sourceSnapshotsChanged": False, "wordingMathDigitsChanged": False,
    "figureObjectsAssertionsInventoryAndSVGChanged": False,
    "contentLayoutRepairs": 1, "imagesOpened": 0, "paidCalls": 0,
    "sourcePagesAdded": 0, "completeCoursesAdded": 0, "affectedReviewPending": True,
})
print(json.dumps({"freeze": binding(OUT / "author-freeze.json"), "changes": [row["changedEntries"] for row in changes]}))
