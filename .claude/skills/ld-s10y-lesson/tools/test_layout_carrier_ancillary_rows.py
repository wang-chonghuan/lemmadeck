"""Independent synthetic contracts for body-owned short ancillary components.

Run one named case per invocation. No source image, old test, or page counter is
loaded; these contracts describe component ownership, not desired page totals.
"""
import argparse
import hashlib
import json
import sys

sys.dont_write_bytecode = True
import numpy as np
from scipy import ndimage
import layout


def rectangle(ink, x, y, width, height):
    ink[y:y + height, x:x + width] = True


def base():
    ink = np.zeros((150, 480), dtype=bool)
    rectangle(ink, 110, 18, 9, 95)
    for box in (
        (20, 42, 15, 34), (45, 43, 15, 33), (65, 42, 15, 35),
        (140, 44, 16, 34), (170, 45, 17, 35), (205, 45, 18, 35),
    ):
        rectangle(ink, *box)
    rectangle(ink, 123, 18, 8, 17)
    rectangle(ink, 123, 99, 8, 17)
    return ink


def star_with_common_body():
    ink = base()
    rectangle(ink, 85, 39, 12, 12)
    return ink, True, None


def comma_with_common_body():
    ink = base()
    rectangle(ink, 235, 78, 9, 13)
    return ink, True, None


def skewed_common_body():
    ink = np.zeros((150, 480), dtype=bool)
    rectangle(ink, 110, 18, 9, 95)
    for box in (
        (20, 40, 15, 32), (45, 42, 15, 32), (65, 45, 15, 32),
        (140, 46, 16, 32), (170, 48, 17, 32), (205, 50, 18, 32),
    ):
        rectangle(ink, *box)
    rectangle(ink, 85, 39, 12, 12)
    rectangle(ink, 235, 81, 9, 12)
    rectangle(ink, 123, 18, 8, 17)
    rectangle(ink, 123, 99, 8, 17)
    return ink, True, None


def side_by_side_integrals():
    ink = base()
    rectangle(ink, 85, 39, 12, 12)
    rectangle(ink, 310, 22, 9, 95)
    for box in (
        (250, 49, 18, 32), (335, 51, 17, 33), (365, 52, 18, 31),
        (395, 52, 18, 31),
    ):
        rectangle(ink, *box)
    rectangle(ink, 275, 45, 12, 12)
    rectangle(ink, 323, 22, 8, 17)
    rectangle(ink, 323, 103, 8, 17)
    return ink, True, None


def multi_glyph_endpoint_groups():
    ink = base()
    rectangle(ink, 85, 39, 12, 12)
    rectangle(ink, 134, 19, 7, 16)
    rectangle(ink, 134, 100, 7, 17)
    return ink, True, None


def original_absolute_delimiter_context():
    ink = base()
    rectangle(ink, 98, 18, 3, 98)
    rectangle(ink, 228, 18, 3, 98)
    rectangle(ink, 85, 39, 10, 12)
    rectangle(ink, 235, 78, 9, 13)
    return ink, True, (98, 18, 3, 98)


def inline_legitimate_short_number():
    ink = base()
    rectangle(ink, 235, 57, 10, 20)
    return ink, True, (235, 57, 10, 20)


def protected_tiny_unknown_518():
    ink = base()
    rectangle(ink, 85, 39, 12, 12)
    rectangle(ink, 405, 69, 2, 3)
    return ink, True, (405, 69, 2, 3)


def two_complete_adjacent_rows():
    ink = np.zeros((150, 480), dtype=bool)
    rectangle(ink, 110, 18, 9, 98)
    for y in (38, 86):
        for x in (20, 45, 65, 140, 170, 205):
            rectangle(ink, x, y, 15, 28)
    rectangle(ink, 85, 36, 12, 12)
    return ink, False, None


def stacked_complete_fractions():
    ink = np.zeros((150, 480), dtype=bool)
    rectangle(ink, 110, 18, 9, 98)
    for x in (150, 180, 210):
        rectangle(ink, x, 28, 15, 30)
        rectangle(ink, x, 80, 15, 30)
        rectangle(ink, x - 2, 65, 20, 3)
    return ink, False, None


def standalone_legitimate_short_final_number():
    ink = base()
    rectangle(ink, 380, 92, 10, 20)
    return ink, False, (380, 92, 10, 20)


def detached_legitimate_denominator():
    ink = base()
    rectangle(ink, 200, 92, 12, 20)
    rectangle(ink, 198, 85, 17, 3)
    return ink, False, (200, 92, 12, 20)


def source140_r03_r04_boundary_guard():
    # An inline fraction's denominator does not absorb the next ordinary row.
    ink = np.zeros((150, 480), dtype=bool)
    rectangle(ink, 110, 18, 9, 98)
    for x in (20, 45, 65, 140, 205):
        rectangle(ink, x, 37, 15, 28)
        rectangle(ink, x, 88, 15, 28)
    rectangle(ink, 170, 25, 15, 20)
    rectangle(ink, 168, 68, 20, 3)
    rectangle(ink, 170, 75, 15, 18)
    return ink, False, (170, 75, 15, 18)


def unowned_unknown_is_not_discarded():
    ink = base()
    rectangle(ink, 405, 95, 10, 16)
    return ink, False, (405, 95, 10, 16)


CASES = {
    "star_with_common_body": star_with_common_body,
    "comma_with_common_body": comma_with_common_body,
    "skewed_common_body": skewed_common_body,
    "side_by_side_integrals": side_by_side_integrals,
    "multi_glyph_endpoint_groups": multi_glyph_endpoint_groups,
    "original_absolute_delimiter_context": original_absolute_delimiter_context,
    "inline_legitimate_short_number": inline_legitimate_short_number,
    "protected_tiny_unknown_518": protected_tiny_unknown_518,
    "two_complete_adjacent_rows": two_complete_adjacent_rows,
    "stacked_complete_fractions": stacked_complete_fractions,
    "standalone_legitimate_short_final_number": standalone_legitimate_short_final_number,
    "detached_legitimate_denominator": detached_legitimate_denominator,
    "source140_r03_r04_boundary_guard": source140_r03_r04_boundary_guard,
    "unowned_unknown_is_not_discarded": unowned_unknown_is_not_discarded,
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--case", required=True, choices=CASES)
    args = parser.parse_args()
    ink, expected, protected_box = CASES[args.case]()
    labels, _ = ndimage.label(ink)
    bounds = ndimage.find_objects(labels)
    before_ink = ink.copy()
    before_labels = labels.copy()
    before_bounds = list(bounds)
    actual = layout._single_carrier_row(labels, bounds, 18, 119, 40.0)
    unchanged = (
        np.array_equal(ink, before_ink)
        and np.array_equal(labels, before_labels)
        and bounds == before_bounds
    )
    protected_unchanged = True
    if protected_box is not None:
        x, y, w, h = protected_box
        protected_unchanged = np.array_equal(
            labels[y:y + h, x:x + w], before_labels[y:y + h, x:x + w]
        ) and bool(ink[y:y + h, x:x + w].all())
    passed = actual == expected and unchanged and protected_unchanged
    print(json.dumps({
        "case": args.case, "expected_single_row": expected,
        "actual_single_row": bool(actual), "passed": passed,
        "source_ink_and_original_component_context_unchanged": unchanged,
        "protected_box": protected_box, "protected_unchanged": protected_unchanged,
        "synthetic_ink_sha256": hashlib.sha256(before_ink.tobytes()).hexdigest(),
        "glyph_h": 40.0, "envelope_y_inclusive": [18, 119],
        "full_page_count_called": False,
    }, indent=2))
    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
