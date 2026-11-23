"""Exact candidate/base mask comparisons; retain baseline deficiencies as failures."""
import json
from pathlib import Path
import sys

import numpy as np
from scipy import ndimage

from diagnose import BASE_SHA, NOISE_BOX, OWN, ROOT, TOOLS, bounds, counted, inputs, load, page_mask, sha
sys.path.insert(0, str(TOOLS))
from test_p121 import ROWS


def main():
    assert Path.cwd() == ROOT
    destination = OWN / "delta-controls.json"
    assert not destination.exists()
    before = inputs()
    assert sha(TOOLS / "layout.py") == BASE_SHA
    base = load("base_detector", TOOLS / "layout.py")
    candidate = load("candidate_detector", OWN / "candidate-02.py")
    _, ink, width = page_mask(base)
    x, y, w, h = NOISE_BOX
    noise = np.zeros_like(ink)
    noise[y:y + h, x:x + w] = ink[y:y + h, x:x + w]
    base_bands, base_mask, _ = counted(base, ink, width)
    candidate_bands, candidate_mask, _ = counted(candidate, ink, width)
    removed = base_mask & ~candidate_mask
    full_delta_exact = bool(np.array_equal(removed, noise))
    no_new_ink = not bool(np.any(candidate_mask & ~base_mask))
    mirror_bands, mirror_mask, _ = counted(candidate, np.fliplr(ink), width)
    mirror_exact = bool(np.array_equal(candidate_mask, np.fliplr(mirror_mask)))
    labels, _ = ndimage.label(ink)
    glyphs = [
        item for item in ndimage.find_objects(labels) if item is not None
        for r, c in [item]
        if 250 <= c.start and c.stop <= 1550
        and 18 <= r.stop - r.start <= 56 and 18 <= c.stop - c.start <= 60
        and any(a <= r.start and r.stop <= b + 1 for a, b in ROWS)
    ]
    cases, baseline_loss_cases, candidate_loss_cases = 0, 0, 0
    failures = []
    for r, c in glyphs:
        sample = ink[r, c]
        h, w = sample.shape
        for left in (24, ink.shape[1] - 24 - w):
            control = ink.copy()
            control[2400:2400 + h, left:left + w] |= sample
            _, base_cleaned, _ = counted(base, control, width)
            _, candidate_cleaned, _ = counted(candidate, control, width)
            base_sample = base_cleaned[2400:2400 + h, left:left + w][sample]
            candidate_sample = candidate_cleaned[2400:2400 + h, left:left + w][sample]
            baseline_loss_cases += int(not base_sample.all())
            candidate_loss_cases += int(not candidate_sample.all())
            cases += 1
            if not np.array_equal(candidate_cleaned, base_cleaned & ~noise):
                failures.append({
                    "box_xywh": [c.start, r.start, w, h], "destination_left": left,
                    "new_lost_sample_pixels": int(np.count_nonzero(base_sample & ~candidate_sample)),
                    "whole_mask_extra_removed_pixels": int(np.count_nonzero(
                        base_cleaned & ~candidate_cleaned & ~noise)),
                })
    after = inputs()
    output = {
        "scope": "technical counter delta only; not SOURCE row/caption/fraction approval",
        "cwd": str(ROOT), "base_sha256": BASE_SHA,
        "candidate_sha256": sha(OWN / "candidate-02.py"),
        "normal_base_bands_inclusive_y": base_bands,
        "normal_candidate_bands_inclusive_y": candidate_bands,
        "mirrored_candidate_bands_inclusive_y": mirror_bands,
        "candidate_mirror_exact_mask": mirror_exact,
        "actual_counting_copy_removed_pixels": int(removed.sum()),
        "actual_counting_copy_removed_bounds_xywh": bounds(removed),
        "actual_counting_copy_delta_exactly_isolated_noise": full_delta_exact,
        "candidate_adds_no_ink": no_new_ink,
        "actual_compact_component_samples": len(glyphs), "margin_cases": cases,
        "base_sample_loss_cases": baseline_loss_cases,
        "candidate_sample_loss_cases": candidate_loss_cases,
        "new_mask_loss_cases": failures,
        "protected_inputs_unchanged": before == after,
        "actual_images_viewed": 2,
        "image_paths": [
            str(ROOT / ".tmp/ld-s10y-lesson/8p/pages/0121/page.png"),
            str(OWN / "isolated-margin-native.png"),
        ],
        "known_absolute_control_failures": (
            "Pre-existing compact component-fragment masking and sparse numerator-1 "
            "standalone-row undercount are not repaired or approved here."
        ),
        "candidate_01": "Rejected: four additional sample losses, two 20x21 components at both margins.",
        "semantic_uncertainty": (
            "Remaining 15 geometric bands are not a SOURCE inventory. Separate reviewer "
            "owns semantic row/caption/fraction decisions; no promotion authorized."
        ),
    }
    passed = full_delta_exact and no_new_ink and mirror_exact and not failures and before == after
    output["delta_only_exit_code"] = 0 if passed else 1
    destination.write_text(json.dumps(output, indent=2) + "\n")
    print(json.dumps({key: output[key] for key in (
        "actual_counting_copy_removed_pixels", "actual_counting_copy_removed_bounds_xywh",
        "actual_compact_component_samples", "margin_cases", "base_sample_loss_cases",
        "candidate_sample_loss_cases", "new_mask_loss_cases", "delta_only_exit_code",
    )}))
    raise SystemExit(output["delta_only_exit_code"])


if __name__ == "__main__":
    sys.dont_write_bytecode = True
    sys.path.insert(0, str(TOOLS))
    main()
