#!/usr/bin/env python3
"""Rebind existing independent semantic passes after path-only promotion."""

import copy
import hashlib
import json
from pathlib import Path
import subprocess
import sys


ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
OWNER = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n37-choice-figure-review"
FINAL = ROOT / (
    "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/"
    "lessons/alg7-c4-s2-n37/choice-set/figures"
)
IDENTITY = "01a1f199-5b64-7701-ad3f-af3234bccc9e"
IDS = [f"fig-choice-n37-{family}-{letter}"
       for family in ("cubic", "quadratic") for letter in "ABCD"]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def binding(path):
    return {"path": str(path), "sha256": sha(path)}


def load(path):
    return json.loads(path.read_text())


def json_sha(value):
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode()
    ).hexdigest()


def differences(left, right, prefix="$"):
    if type(left) is not type(right):
        return [prefix]
    if isinstance(left, dict):
        if left.keys() != right.keys():
            return [prefix]
        return [p for k in sorted(left) for p in differences(left[k], right[k], prefix + "." + k)]
    if isinstance(left, list):
        if len(left) != len(right):
            return [prefix]
        return [p for n, (a, b) in enumerate(zip(left, right))
                for p in differences(a, b, f"{prefix}[{n}]")]
    return [] if left == right else [prefix]


def unchanged(records):
    for item in records:
        assert sha(Path(item["path"])) == item["sha256"], item["path"]


def write_json(path, value):
    assert path.parent == OWNER and not path.exists(), "Preserve existing owned reports"
    path.write_text(json.dumps(value, ensure_ascii=True, indent=2) + "\n")


def main():
    assert Path.cwd().resolve() == ROOT
    result_path = OWNER / "path-binding-result.json"
    contract_path = OWNER / "path-bound-new-figure-reviews.json"
    assert not result_path.exists() and not contract_path.exists()
    promotion_path = OWNER.parent / "n37-choice-figure-path-promotion.json"
    promotion = load(promotion_path)
    audit = load(OWNER / "input-audit.json")
    summary = load(OWNER / "result.json")
    original_contract_path = OWNER / "new-figure-reviews.json"
    original_contract = load(original_contract_path)
    original_manifest_path = OWNER / "report-manifest.json"
    original_manifest = load(original_manifest_path)
    assert summary["outcome"] == "pass" and summary["images_opened"] == 8
    assert summary["reviewer"] == {"kind": "independent_agent", "identity": IDENTITY}
    assert summary["new_figure_reviews"]["sha256"] == sha(original_contract_path)
    assert [r["id"] for r in promotion["records"]] == IDS
    approved = {r["figure_id"]: r for r in audit["figures"]}
    approvals = {r["figure_id"]: r for r in summary["per_asset_reports"]}
    semantic = {r["figure_id"]: r for r in original_contract}
    assert set(approved) == set(approvals) == set(semantic) == set(IDS)
    frozen = original_manifest["files"] + [
        binding(original_manifest_path), binding(promotion_path)
    ]
    unchanged(frozen)
    checks = []
    for row in promotion["records"]:
        fid = row["id"]
        previous = approved[fid]
        assert semantic[fid]["verdict"] == approvals[fid]["verdict"] == "pass"
        assert semantic[fid]["reviewer"] == summary["reviewer"]
        assert semantic[fid]["asset_sha256"] == previous["bindings"]["svg"]["sha256"]
        approval_binding = approvals[fid]["ld_s10y_image_review"]
        assert row["approval"] == approval_binding
        assert sha(Path(approval_binding["path"])) == approval_binding["sha256"]
        prior_review = load(Path(approval_binding["path"]))
        assert prior_review["schema"] == "ld-s10y-image/review@1"
        assert prior_review["figure"] == fid and prior_review["status"] == "pass"
        assert row["basis"] == previous["authored_basis"] == prior_review["source"]["authoredBasis"]
        final_paths = {
            "spec": FINAL / f"{fid}.spec.json",
            "render": FINAL / f"{fid}.render.json",
            "svg": FINAL / f"{fid}.svg",
        }
        review_path = FINAL / f"{fid}.review.json"
        assert ROOT / row["finalReviewPath"] == review_path
        assert review_path.resolve() == review_path and not review_path.exists()
        candidate_records = {str((ROOT / b["path"]).resolve()): b["sha256"]
                             for b in row["candidate"]}
        final_records = {str((ROOT / b["path"]).resolve()): b["sha256"] for b in row["final"]}
        assert candidate_records == {
            previous["bindings"][k]["path"]: previous["bindings"][k]["sha256"]
            for k in ("spec", "render", "svg")
        }
        assert set(final_records) == {str(p) for p in final_paths.values()}
        for key, path in final_paths.items():
            assert path.resolve() == path
            assert sha(path) == final_records[str(path)]
            candidate = previous["bindings"][key]
            assert sha(Path(candidate["path"])) == candidate["sha256"]
            assert prior_review["spec" if key == "spec" else "render"]["sha256"] == (
                candidate["sha256"] if key != "svg" else previous["bindings"]["render"]["sha256"]
            )
            frozen += [candidate, binding(path)]
        for key in ("spec", "svg"):
            assert final_paths[key].read_bytes() == Path(previous["bindings"][key]["path"]).read_bytes()
        assert prior_review["outputs"]["svg"]["sha256"] == previous["bindings"]["svg"]["sha256"]
        before = load(Path(previous["bindings"]["render"]["path"]))
        after = load(final_paths["render"])
        assert set(before["output"]) == set(after["output"]) == {"svg"}
        assert before["status"] == after["status"] == "pass"
        changed = differences(before, after)
        assert changed == ["$.output.svg.path", "$.spec.path"], changed
        assert after["spec"]["path"] == final_paths["spec"].relative_to(ROOT).as_posix()
        assert after["output"]["svg"]["path"] == final_paths["svg"].relative_to(ROOT).as_posix()
        normalized = copy.deepcopy(after)
        normalized["spec"]["path"] = before["spec"]["path"]
        normalized["output"]["svg"]["path"] = before["output"]["svg"]["path"]
        assert not differences(before, normalized)
        assert json_sha(before) == json_sha(normalized)
        assert load(final_paths["spec"])["source"]["authoredBasis"] == previous["authored_basis"]
        checks.append({
            "figure_id": fid,
            "status": "pass",
            "candidate": {k: previous["bindings"][k] for k in ("spec", "render", "svg")},
            "final": {k: binding(v) for k, v in final_paths.items()},
            "prior_semantic_approval": approval_binding,
            "prior_observed_png_sha256": previous["bindings"]["png"]["sha256"],
            "byte_identical_spec": True,
            "byte_identical_svg": True,
            "render_changed_fields": changed,
            "normalized_render_matches_approved": True,
            "normalized_render_canonical_sha256": json_sha(normalized),
            "authored_basis_unchanged": True,
            "final_review_path": str(review_path),
        })
    unchanged(frozen)
    contract = []
    for check in checks:
        fid = check["figure_id"]
        final_paths = {k: Path(v["path"]) for k, v in check["final"].items()}
        review_path = Path(check["final_review_path"])
        prior_sha = check["prior_semantic_approval"]["sha256"]
        svg_sha = check["final"]["svg"]["sha256"]
        spec_sha = check["final"]["spec"]["sha256"]
        render_sha = check["final"]["render"]["sha256"]
        notes = (
            f"Independent reviewer {IDENTITY}. PATH/HASH BINDING ONLY: retain the "
            f"existing independent semantic PASS, original approval SHA-256 {prior_sha}, "
            f"previously observed raster SHA-256 {check['prior_observed_png_sha256']}. "
            f"Current spec SHA-256 {spec_sha} and SVG SHA-256 {svg_sha} are byte-identical "
            f"to that approval; source.authoredBasis is unchanged. Current render "
            f"SHA-256 {render_sha} differs only at spec.path and output.svg.path; "
            f"normalized render canonical SHA-256 {check['normalized_render_canonical_sha256']} "
            f"matches the approved original. This file binds only durable spec, render "
            f"and SVG paths. No new semantic review, image open, rerender, option/key "
            f"comparison or final-choice/question approval. Additional images: 0."
        )
        assert ".intentfold" not in notes and "/tmp/" not in notes and ".tmp/" not in notes
        unchanged(frozen)
        assert not review_path.exists()
        run = subprocess.run(
            [sys.executable, "-B", str(ROOT / ".agents/skills/ld-s10y-image/scripts/record_review.py"),
             "--spec", str(final_paths["spec"]), "--render", str(final_paths["render"]),
             "--output", str(review_path), "--status", "pass", "--notes", notes],
            cwd=ROOT, capture_output=True, text=True, check=True,
        )
        print(run.stdout.strip())
        current_review = load(review_path)
        assert current_review["schema"] == "ld-s10y-image/review@1"
        assert current_review["figure"] == fid and current_review["status"] == "pass"
        assert current_review["source"] == load(Path(check["prior_semantic_approval"]["path"]))["source"]
        assert set(current_review["outputs"]) == {"svg"}
        for key in ("spec", "render"):
            assert current_review[key] == {
                "path": final_paths[key].relative_to(ROOT).as_posix(),
                "sha256": check["final"][key]["sha256"],
            }
        assert current_review["outputs"]["svg"] == {
            "path": final_paths["svg"].relative_to(ROOT).as_posix(), "sha256": svg_sha
        }
        encoded = json.dumps(current_review)
        assert ".intentfold" not in encoded and "/tmp/" not in encoded and ".tmp/" not in encoded
        check["final_review"] = binding(review_path)
        check["durable_review_dependencies_only"] = True
        contract.append({
            "figure_id": fid, "asset_sha256": svg_sha,
            "reviewer": semantic[fid]["reviewer"], "verdict": "pass",
            "evidence": (
                f"Path-only continuation of prior independent semantic PASS SHA-256 "
                f"{prior_sha}. Approved/current spec bytes and SVG bytes are identical; "
                f"render comparison differs exactly at spec.path and output.svg.path, "
                f"and normalized canonical render hashes match. Unchanged authoredBasis "
                f"retained. Durable review {review_path.relative_to(ROOT).as_posix()}, "
                f"SHA-256 {check['final_review']['sha256']}; final spec SHA-256 {spec_sha}; "
                f"final render SHA-256 {render_sha}. Additional images 0; no new semantic "
                f"review or choice/question approval."
            ),
        })
    unchanged(frozen)
    unchanged([c["final_review"] for c in checks])
    write_json(contract_path, contract)
    write_json(result_path, {
        "schema": "n37-choice-figure-path-binding@1",
        "status": "pass",
        "reviewer": {"kind": "independent_agent", "identity": IDENTITY},
        "scope": "Path/hash-only rebinding of eight existing independent authored-figure passes.",
        "additional_images": 0,
        "new_semantic_reviews": 0,
        "rerenders": 0,
        "final_choice_question_approval": False,
        "records": checks,
        "promotion_manifest": binding(promotion_path),
        "prior_semantic_contract": binding(original_contract_path),
        "prior_report_manifest": binding(original_manifest_path),
        "path_bound_new_figure_reviews": binding(contract_path),
        "all_prior_report_and_candidate_and_final_input_hashes_unchanged": True,
        "all_first_preserved": True,
        "durable_outputs_created": 8,
        "durable_write_allowlist": [c["final_review"]["path"] for c in checks],
        "actionable_findings": [],
    })
    print(json.dumps({
        "binder_status": "pass", "additional_images": 0,
        "final_reviews": [{"figure_id": c["figure_id"], **c["final_review"]} for c in checks],
        "path_binding_result": binding(result_path),
        "path_bound_new_figure_reviews": binding(contract_path),
    }, indent=2))


if __name__ == "__main__":
    main()
