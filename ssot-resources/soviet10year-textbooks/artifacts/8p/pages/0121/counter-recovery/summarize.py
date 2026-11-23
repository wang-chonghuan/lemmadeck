"""Compact final technical facts bound to the caller's independent SOURCE freeze."""
import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image

from diagnose import BASE_SHA, NOISE_BOX, OWN, ROOT, TOOLS, counted, inputs, load, page_mask, sha

FREEZE = ROOT / (
    "ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/"
    "phy8-c2-s1-n26/source-review/independent-original-observations.md"
)
REVIEW = ROOT / ".intentfold/tickets/STEMROBIN-180/source-review-8p-n26.md"


def main():
    assert Path.cwd() == ROOT
    destination = OWN / "technical-summary.json"
    assert not destination.exists()
    before = inputs()
    assert sha(TOOLS / "layout.py") == BASE_SHA
    section = FREEZE.read_text().split(
        "## Physical 121 / printed 109: 15 distinct printed rows", 1,
    )[1].split("The first formula", 1)[0]
    anchors = []
    for line in section.splitlines():
        parts = [part.strip() for part in line.split("|")]
        if len(parts) >= 4 and parts[1].isdigit() and parts[2].isdigit():
            anchors.append({"row": int(parts[1]), "approximate_y": int(parts[2])})
    assert [item["row"] for item in anchors] == list(range(1, 16))
    results = {
        label: json.loads((OWN / label / "results.json").read_text())
        for label in ("baseline", "candidate-01", "candidate-02")
    }
    delta = json.loads((OWN / "delta-controls.json").read_text())
    assert delta["delta_only_exit_code"] == 0
    bands = results["candidate-02"]["counted_bands_inclusive_y"]
    assert len(bands) == len(anchors)
    for (a, b), item in zip(bands, anchors):
        assert a <= item["approximate_y"] <= b
        assert sum(a <= other["approximate_y"] <= b for other in anchors) == 1
    original_failures = set(results["baseline"]["tests"]["p121"]["failed_subtests"])
    refined_failures = set(results["candidate-02"]["tests"]["p121"]["failed_subtests"])
    assert not refined_failures - original_failures
    sys.path.insert(0, str(TOOLS))
    base = load("summary_base_detector", TOOLS / "layout.py")
    candidate = load("summary_candidate_detector", OWN / "candidate-02.py")
    original, ink, width = page_mask(base)
    x, y, w, h = NOISE_BOX
    noise = np.zeros_like(ink)
    noise[y:y + h, x:x + w] = ink[y:y + h, x:x + w]
    with Image.open(ROOT / ".tmp/ld-s10y-lesson/8p/pages/0031/page.png") as image:
        minus_ink = base.ink_mask(image)
    samples = (
        ("new-loss-fragment-A", ink, (732, 1277, 20, 21)),
        ("new-loss-fragment-B", ink, (839, 1793, 20, 21)),
        ("inline-fraction-numerator-1", ink, (963, 2065, 46, 42)),
        ("inline-fraction-denominator-81", ink, (955, 2120, 63, 40)),
        ("whole-display-fraction-chain", ink, (710, 1414, 365, 103)),
        ("actual-caption", ink, (490, 860, 160, 45)),
        ("actual-fraction-bar", ink, (959, 2110, 52, 10)),
        ("unchanged-portable-minus", minus_ink, (394, 730, 57, 24)),
    )
    focused_controls = []
    for role, source, (x, y, w, h) in samples:
        sample = source[y:y + h, x:x + w]
        assert sample.any()
        counts = []
        for left in (24, 600, ink.shape[1] - 24 - w):
            for mirrored in (False, True):
                control = ink.copy()
                control[2400:2400 + h, left:left + w] |= sample
                expected_noise = noise
                if mirrored:
                    control = np.fliplr(control)
                    expected_noise = np.fliplr(noise)
                baseline_bands, baseline_mask, _ = counted(base, control, width)
                actual_bands, actual_mask, _ = counted(candidate, control, width)
                assert np.array_equal(actual_mask, baseline_mask & ~expected_noise)
                if mirrored:
                    actual_mask = np.fliplr(actual_mask)
                surviving = actual_mask[2400:2400 + h, left:left + w][sample]
                counts.append({
                    "left": left, "mirrored": mirrored,
                    "baseline_count": len(baseline_bands), "candidate_count": len(actual_bands),
                    "sample_ink_px": int(sample.sum()),
                    "candidate_preserved_sample_ink_px": int(surviving.sum()),
                })
        focused_controls.append({"role": role, "source_box_xywh": [x, y, w, h], "cases": counts})
    compact_runs = {}
    for label, run in results.items():
        compact_runs[label] = {
            "exit_code": run["exit_code"], "layout_sha256": run["candidate_sha256"],
            "protected_inputs_unchanged": run["protected_inputs_unchanged"],
            "tests": {name: {key: item[key] for key in (
                "methods", "subtests", "failures", "errors", "skips",
            )} for name, item in run["tests"].items()},
        }
    assert before == inputs()
    assert all(run["protected_inputs_unchanged"] and run["test_bindings_unchanged"]
               for run in results.values())
    assert all(not item["failures"] and not item["errors"] and not item["skips"]
               for name, item in results["candidate-02"]["tests"].items() if name != "p121")
    output = {
        "scope": "SOURCE121 n26 technical counter only; no live edits or pipeline calls",
        "cwd": str(ROOT), "base_sha256": BASE_SHA,
        "independent_SOURCE_inventory": {
            "freeze": str(FREEZE), "freeze_sha256": sha(FREEZE),
            "review": str(REVIEW), "review_sha256": sha(REVIEW),
            "caller_supplied_source_fidelity": "PASS",
            "distinct_rows": 15, "shared_caption_rows": 1, "prose_rows": 10,
            "display_formula_rows": 3, "footer_rows": 1,
            "anchors": anchors, "candidate_anchor_mapping": "one-to-one PASS",
            "semantic_review_replayed": False,
        },
        "extra_band_inclusive_y": [698, 736],
        "extra_component_xywh": NOISE_BOX,
        "cause": (
            "Compact isolated margin blot: density 1199/2021 is below 0.6; "
            "small internal holes veto the >=0.35 density branch. Normal-sized "
            "compact shapes never enter the old solid-core recovery branch."
        ),
        "candidate": str(OWN / "candidate-02.py"),
        "candidate_diff": str(OWN / "candidate-02/candidate.diff"),
        "candidate_delta": (
            "Body-scale margin-only sub-core pinhole evidence, using existing "
            "0.75 glyph-height, 0.2 glyph-core, 0.7 core-area scales. No row, "
            "caption, fraction, spacing, or authored-count threshold changes."
        ),
        "delta_scope_status": "PASS, private candidate only; NOT integrated",
        "mask_delta": {
            "removed_pixels": delta["actual_counting_copy_removed_pixels"],
            "removed_bounds_xywh": delta["actual_counting_copy_removed_bounds_xywh"],
            "only_isolated_noise_removed": delta["actual_counting_copy_delta_exactly_isolated_noise"],
            "mirror_exact": delta["candidate_mirror_exact_mask"],
            "real_component_mutation_cases": delta["margin_cases"],
            "new_mutation_mask_loss_cases": len(delta["new_mask_loss_cases"]),
        },
        "runs": compact_runs,
        "refined_p121_deletion_cases": 30,
        "refined_new_failure_labels_vs_baseline": [],
        "refined_absolute_test_limitations": (
            "P121 absolute mutation suite still exits 1: 60 baseline compact "
            "connected-fragment mask-loss cases plus six baseline sparse "
            "numerator-1 standalone count misses. These are retained, not "
            "fixed or waived. Candidate-01's four new losses are rejected."
        ),
        "additional_focused_pixel_controls": focused_controls,
        "actual_image_views": 2,
        "image_paths": delta["image_paths"],
        "initial_finalize": "Retained exit 1, 16 counted / 15 authored; not rerun",
        "live_source_layout_receipts_reports_unchanged": True,
        "source122": "Not inspected or changed; outgoing n27 is unrelated",
        "residual_uncertainty": (
            "No semantic row-count uncertainty after caller-supplied independent "
            "freeze. Broader classifier behavior is not certified: no global "
            "suite replay, promotion, or actual finalize was performed."
        ),
    }
    destination.write_text(json.dumps(output, indent=2) + "\n")
    print(json.dumps({
        "source_rows": len(anchors), "candidate_rows": len(bands),
        "delta_scope_status": output["delta_scope_status"],
        "absolute_p121_failures_retained": compact_runs["candidate-02"]["tests"]["p121"]["failures"],
        "additional_focused_pixel_cases": sum(len(item["cases"]) for item in focused_controls),
        "protected_inputs_unchanged": True,
    }))


if __name__ == "__main__":
    sys.dont_write_bytecode = True
    main()
