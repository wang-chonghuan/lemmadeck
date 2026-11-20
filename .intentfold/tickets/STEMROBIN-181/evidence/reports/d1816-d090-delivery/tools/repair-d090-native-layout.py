import copy
import hashlib
import re
import shutil
import subprocess
import sys
from pathlib import Path

repo = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == repo
sys.dont_write_bytecode = True
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
from edition import dump, load, normalize_lesson_layout, prose_flow_contract
from mathcheck import find_math_spans

T = Path(".intentfold/tickets/STEMROBIN-181")
B = Path(".tmp/STEMROBIN-181/d1816-d090")
R = Path("ssot-resources/soviet10year-textbooks/artifacts/9p")
O = T / "tmp/d1816-d090-n128-promotion"
I = "phy9-c2-s6-n128"
before_dir = O / "before-native-layout-recovery"
assert not before_dir.exists()
before_dir.mkdir()


def bind(p):
    return {"path": str(p), "sha256": hashlib.sha256(p.read_bytes()).hexdigest()}


def retain(p, target):
    target.parent.mkdir(parents=True, exist_ok=True)
    assert not target.exists()
    shutil.copyfile(p, target)
    assert bind(p)["sha256"] == bind(target)["sha256"]
    return bind(target)


templates = []
for locale, edition in [("zh", "modern-us-neutral"), ("en", "modern-us-neutral-en")]:
    receipt = T / f"tmp/d1816-recovery/native/d090-n128-{locale}-first-finalize/receipt.json"
    assert load(receipt)["exitCode"] == 2
    template = B / f"work/adapt/9p/{edition}/lessons/{I}/lesson.template.json"
    old = load(template)
    saved = retain(template, before_dir / f"{locale}/lesson.template.json")
    audit = B / f"root/9p/editions/{edition}/lessons/{I}/adaptation.audit.json"
    saved_audit = retain(audit, before_dir / f"{locale}/adaptation.audit.json")
    flow, errors = prose_flow_contract(old["prose"], old["section_breaks"])
    assert not errors, errors
    targets = []
    for boundary in flow["boundaries"]:
        paragraph = flow["paragraphs"][boundary["index"]]
        block = paragraph["blockIndex"]
        offset = sum(p["blockIndex"] == block for p in flow["paragraphs"][:boundary["index"]])
        targets.append((block, offset))
    current = copy.deepcopy(old)
    normalize_lesson_layout(current)
    text_changes, metadata_changes = [], []
    for index, (after, prior) in enumerate(zip(current["prose"], old["prose"], strict=True)):
        assert re.sub(r"\s", "", after["text"]) == re.sub(r"\s", "", prior["text"])
        assert find_math_spans(after["text"]) == find_math_spans(prior["text"])
        assert after["source_text"] == prior["source_text"]
        assert after["source_refs"] == prior["source_refs"]
        if after["text"] != prior["text"]:
            text_changes.append(index)
        if after["text"] == after["source_text"] and after["changes"]:
            after["changes"] = []
            metadata_changes.append(index)
    new_flow, errors = prose_flow_contract(current["prose"], [])
    assert not errors, errors
    anchors = []
    for block, offset in targets:
        candidates = [p for p in new_flow["paragraphs"] if p["blockIndex"] == block]
        assert len(candidates) > offset
        paragraph = candidates[offset]
        index = paragraph["index"]
        assert index > 0
        anchors.append({"before": new_flow["paragraphs"][index - 1]["text"], "after": paragraph["text"]})
    assert len(anchors) == len(old["section_breaks"]) == 3
    current["section_breaks"] = anchors
    final_flow, errors = prose_flow_contract(current["prose"], anchors)
    assert not errors, errors
    dump(template, current)
    templates.append({
        "locale": locale, "edition": edition, "before": saved, "working": bind(template),
        "originalFailure": bind(receipt), "originalAudit": saved_audit,
        "whitespaceOnlyTextBlocks": text_changes, "unchangedTextChangesCleared": metadata_changes,
        "conceptualBoundaryBlockOffsets": targets, "anchors": anchors,
        "finalParagraphs": len(final_flow["paragraphs"]),
        "allNonWhitespaceCharactersExact": True, "allMathTokensExact": True,
        "allSourceSnapshotsAndRefsExact": True, "independentLayoutReviewPending": True,
    })

contexts = [{
    "lesson": I, "edition": row["edition"],
    "text": "\n\n".join(b["text"] for b in load(Path(row["working"]["path"]))["prose"] if b["text"]),
} for row in templates]
records = []
for row in templates:
    edition, locale = row["edition"], row["locale"]
    for figure in ["fig-290", "fig-291"]:
        directory = R / f"editions/{edition}/figures"
        spec_path, render_path, review_path, svg_path = [
            directory / f"{figure}.{ext}" for ext in ["spec.json", "render.json", "review.json", "svg"]
        ]
        old_spec, old_render = load(spec_path), load(render_path)
        retained = [
            retain(p, before_dir / f"{locale}/figures/{p.name}")
            for p in [spec_path, render_path, review_path]
        ]
        spec = copy.deepcopy(old_spec)
        spec["source"]["authoritativeText"] = contexts
        for old_context, new_context in zip(old_spec["source"]["authoritativeText"], contexts, strict=True):
            assert re.sub(r"\s", "", old_context["text"]) == re.sub(r"\s", "", new_context["text"])
        geometry_old, geometry_new = copy.deepcopy(old_spec), copy.deepcopy(spec)
        del geometry_old["source"]["authoritativeText"]
        del geometry_new["source"]["authoritativeText"]
        assert geometry_old == geometry_new
        dump(spec_path, spec)
        render = copy.deepcopy(old_render)
        render["spec"] = bind(spec_path)
        assert render["status"] == "pass"
        dump(render_path, render)
        assert bind(svg_path)["sha256"] == old_render["output"]["svg"]["sha256"]
        subprocess.run([
            "node", str(T / "tmp/d1816-recovery/run-native.mjs"),
            f"d090-{locale}-{figure}-layout-context-record-review",
            ".claude/skills/ld-s10y-lesson/.venv/bin/python",
            ".agents/skills/ld-s10y-image/scripts/record_review.py",
            "--spec", str(spec_path), "--render", str(render_path), "--output", str(review_path),
            "--status", "pass", "--notes",
            "D089 graphic and D095 affected SCI/ZH/EN/context PASS reused. Native layout normalization "
            "changes whitespace only; all non-whitespace characters and exact math/source/ref tokens "
            "remain equal. Current complete bilingual text is rebound; SVG/geometry/labels/measurements "
            "unchanged. First record and failed finalizer receipts preserved. Offline layout review pending.",
        ], cwd=repo, check=True)
        records.append({
            "edition": edition, "locale": locale, "id": figure, "before": retained,
            "spec": bind(spec_path), "render": bind(render_path), "review": bind(review_path), "svg": bind(svg_path),
            "contextWhitespaceOnly": True, "geometryRerendered": False, "newGraphicApproval": False,
        })
dump(O / "native-layout-recovery.json", {
    "schema": "STEMROBIN-181/native-layout-only-recovery@1", "batch": "D090", "lesson": I,
    "status": "native-layout-repaired-failed-finalizers-only-pending",
    "templates": templates, "records": records,
    "sourceReruns": 0, "imageOpens": 0, "geometryRerenders": 0,
    "independentLayoutAndCurrentContextReviewPending": True,
    "sourcePagesAdded": 0, "completeCoursesAdded": 0, "databaseWrites": False, "formalHandoff": False,
})
print("PASS: native whitespace, equivalent section anchors and unchanged-text change declarations repaired")
