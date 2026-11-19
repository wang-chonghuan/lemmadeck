"""Bind frozen text/durable raw PNGs, then invoke the existing renderer."""

from pathlib import Path
import argparse
import copy
import hashlib
import json
import subprocess


ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
OWN = Path(__file__).resolve().parent
BATCH = OWN.parent
TEMPLATES = BATCH / "n41-n43-adapt-work/adapt/7a/modern-us-neutral/lessons"


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def reference(path):
    return {"path": str(path), "sha256": digest(path)}


def save(path, value):
    with path.open("x", encoding="utf-8") as handle:
        handle.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def bind():
    for entry in load(OWN / "hashes.json")["files"]:
        assert digest(Path(entry["path"])) == entry["sha256"], entry["path"]
    frozen_receipt = load(OWN / "binding-FIRST.json")
    for entry in frozen_receipt["frozenTemplates"]:
        assert digest(Path(entry["path"])) == entry["sha256"], entry["path"]
    review_path = BATCH / "n41-n43-modern-review/first-review.md"
    review = review_path.read_text(encoding="utf-8")
    assert "| alg7-c4-s2-n41 | PASS |" in review
    assert "| alg7-c4-s3-n42 | PASS |" in review
    promotion_path = BATCH / "n40-n43-raw-promotion.json"
    promotion = load(promotion_path)
    promoted = {str((ROOT / item["path"]).resolve()): item["sha256"] for item in promotion["outputs"]}
    receipts = []
    for number in (56, 57, 58):
        figure = f"fig-{number}"
        folder = OWN / figure
        first_path = folder / "spec-draft-FIRST.json"
        first = load(first_path)
        context = load(folder / "context-FIRST.json")
        lesson_id = "alg7-c4-s3-n42" if number == 58 else "alg7-c4-s2-n41"
        lesson = load(TEMPLATES / lesson_id / "lesson.template.json")
        exercises = load(TEMPLATES / lesson_id / "exercises.template.json")
        if number == 58:
            selected = [
                {"lesson": lesson_id, "text": block["text"]}
                for block in lesson["prose"] if block["kind"] == "p" and block["text"]
            ]
            assert len(selected) == 14
            selection = "All 14 current n42 prose blocks, exactly as in cap1; no exercises."
        else:
            owners = [
                item for item in exercises["exercises"]
                if figure in item.get("figure_refs", [])
                or figure in {entry["id"] for entry in item.get("figures", [])}
            ]
            assert len(owners) == 1 and owners[0]["number"] == str(number + 792)
            selected = [
                {"lesson": lesson_id, "exercise": item["number"], "text": item["text"]}
                for item in owners
            ]
            selection = f"Complete exercise {owners[0]['number']} derived from figure_refs/figures."
        assert first["source"]["authoritativeText"] == selected
        assert context["sourceAuthoritativeText"] == selected
        durable = ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/7a/figures/{figure}.png"
        source_hash = digest(durable)
        assert source_hash == first["source"]["image"]["sha256"]
        assert source_hash == promoted[str(durable)]
        assert source_hash == digest(Path(first["source"]["image"]["path"]))
        bound = copy.deepcopy(first)
        bound["source"]["image"] = {"path": str(durable), "sha256": source_hash}
        bound["source"]["authoritativeText"] = selected
        prefix, separator, _ = bound["description"].partition(" Cap1 frozen-template draft;")
        assert separator
        bound["description"] = prefix + (
            " Frozen-template authoritative text verified; cap2 candidate. "
            "Future finalized edition paths are later output bindings, not render permission gates. "
            "Independent approval is not granted."
        )
        assert bound["objects"] == first["objects"]
        assert bound["assertions"] == first["assertions"]
        assert bound["source"]["inventory"] == first["source"]["inventory"]
        bound_path = folder / "spec-bound-FIRST.json"
        save(bound_path, bound)
        bound_context = copy.deepcopy(context)
        bound_context["textStatus"] = "frozen-template-authoritative-text-verified"
        bound_context["authoritativeRule"] = (
            "Explicit source.authoritativeText equals the current frozen template selection exactly. "
            "No normalization needed. Independent n41/n42 modern text PASS is referenced. "
            "Future finalized edition paths are later output bindings, not render permission gates. "
            "Original pixels previously inspected are unchanged at the promoted durable RAW PNG path. "
            "No answers/choices or fabricated finalized files."
        )
        bound_context["sourceImage"]["path"] = str(durable)
        bound_context["laterOutputBinding"] = {
            "paths": context["futureFinalizedTextPaths"],
            "renderPermissionGate": False,
            "parentResponsibility": "Finalize later, then validate explicit text equality and assets.",
        }
        del bound_context["futureFinalizedTextPaths"]
        bound_context["independentModernTextReview"] = reference(review_path)
        bound_context["rawPromotionReceipt"] = reference(promotion_path)
        bound_context["cap1FirstContext"] = reference(folder / "context-FIRST.json")
        bound_context["cap1FirstBlocker"] = reference(OWN / "cap2-FIRST-blocker.json")
        bound_context["blockerCorrection"] = (
            "Previous finalized-input prerequisite was a technical input-path circularity. "
            "Preserved honestly as history; corrected by direct human instruction for cap2."
        )
        save(folder / "context-bound-FIRST.json", bound_context)
        receipts.append({
            "figure": figure, "selection": selection, "textEquality": "exact",
            "normalizationApplied": False, "selectedTextItems": len(selected),
            "firstSpec": reference(first_path), "boundSpec": reference(bound_path),
            "boundContext": reference(folder / "context-bound-FIRST.json"),
            "durableRawPng": reference(durable), "sameBytesAsInspectedSource": True,
            "independentFigureApproval": False,
        })
    save(OWN / "binding-cap2-FIRST.json", {
        "status": "frozen-template-authoritative-text-verified",
        "figures": receipts, "modernTextReview": reference(review_path),
        "rawPromotion": reference(promotion_path),
        "preservedHistoricalBlockers": [
            reference(OWN / "binding-FIRST.json"), reference(OWN / "cap2-FIRST-blocker.json")],
        "noFinalizedLessonFilesCreated": True, "renderPermissionGate": False,
    })
    print(json.dumps({"status": "bound", "figures": len(receipts)}))


def render(figures, candidate):
    results = []
    for figure in figures:
        folder = OWN / figure
        spec = folder / f"spec-bound-{candidate}.json"
        assert spec.is_file()
        svg = folder / f"{figure}-{candidate}.svg"
        report = folder / f"{figure}-{candidate}.render.json"
        png = folder / f"{figure}-full-{candidate}.png"
        receipt = folder / f"render-{candidate}-receipt.json"
        assert not any(path.exists() for path in (svg, report, png, receipt)), "Preserve existing outputs"
        command = [
            "node", ".agents/skills/ld-s10y-image/scripts/render_spec.mjs",
            "--spec", str(spec), "--svg", str(svg), "--report", str(report), "--png", str(png),
        ]
        result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
        render_report = load(report) if report.is_file() else None
        save(receipt, {
            "command": command, "cwd": str(ROOT), "exitCode": result.returncode,
            "stdout": result.stdout, "stderr": result.stderr,
            "spec": reference(spec),
            "outputs": [reference(path) for path in (svg, report, png) if path.is_file()],
            "rendererBuiltinDraftValidation": True,
            "standaloneValidatorExecuted": False,
            "status": render_report["status"] if render_report else "execution-fail",
            "independentApproval": False,
        })
        results.append({
            "figure": figure, "candidate": candidate, "exitCode": result.returncode,
            "status": render_report["status"] if render_report else "execution-fail",
            "collisions": render_report.get("collisions") if render_report else None,
            "displayChecks": render_report.get("displayChecks") if render_report else None,
            "stderr": result.stderr if not render_report else None,
            "receipt": str(receipt),
        })
    print(json.dumps(results, indent=2))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("step", choices=("bind", "render"))
    parser.add_argument("--figure", choices=("fig-56", "fig-57", "fig-58"), action="append")
    parser.add_argument("--candidate", default="FIRST")
    args = parser.parse_args()
    assert Path.cwd() == ROOT
    assert OWN == BATCH / "n41-n42-figure-author"
    if args.step == "bind":
        bind()
    else:
        render(args.figure or ["fig-56", "fig-57", "fig-58"], args.candidate)


if __name__ == "__main__":
    main()
