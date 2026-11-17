"""Independent geometry expectations for paired limits within one fraction row."""
import unittest

import numpy as np
from scipy import ndimage

import layout


SCALE = 37.0


def rectangle(ink, x, y, w, h):
    ink[y:y + h, x:x + w] = True


def fixture(tall=False, multi=False):
    ink = np.zeros((240, 560), dtype=bool)
    height = 144 if tall else 96
    rectangle(ink, 70, 40, 16 if tall else 21, height)
    right = 86 if tall else 91
    upper = right + 5
    lower = right + 6
    if multi:
        rectangle(ink, upper, 38, 19, 6)
        rectangle(ink, upper + 25, 32, 9, 23)
        rectangle(ink, upper + 39, 32, 15, 23)
    else:
        rectangle(ink, upper, 32, 15, 24)
    rectangle(ink, lower, 40 + height - 16, 15, 24)
    rectangle(ink, 155, 95, 100, 4)
    rectangle(ink, 184, 53, 24, 34)
    rectangle(ink, 184, 110, 24, 34)
    for x in (20, 280, 312, 344):
        rectangle(ink, x, 78, 22, 36)
    return ink


def classify(ink, scale=SCALE, context=None):
    live = np.flatnonzero(ink.any(axis=1))
    a, b = int(live[0]), int(live[-1])
    if context is None:
        context = ndimage.label(ink)[0]
    return layout._single_fraction_row(ink, a, b, scale, context)


def owned(ink, scale=SCALE):
    components = ndimage.label(ink)[0]
    return layout._bounded_carrier_limit_ownership(components, scale)


class IntegralLimitGeometryTests(unittest.TestCase):
    def test_paired_body_scale_bounds_extend_single_fraction_row(self):
        ink = fixture()
        original = ink.copy()
        self.assertTrue(classify(ink))
        self.assertTrue(np.array_equal(ink, original))

    def test_tall_trig_dimensions_keep_one_row(self):
        self.assertTrue(classify(fixture(tall=True)))

    def test_two_symbol_root_limit_is_owned_as_one_endpoint_group(self):
        ink = fixture(multi=True)
        mask = owned(ink)
        self.assertTrue(mask[32:55, 121:130].all())
        self.assertTrue(mask[32:55, 135:150].all())
        self.assertFalse(mask[32:55, 130:135].any())
        self.assertTrue(classify(ink))

    def test_mixed_paired_carrier_lengths_keep_one_body_row(self):
        ink = fixture(tall=True)
        rectangle(ink, 390, 40, 21, 96)
        rectangle(ink, 416, 33, 15, 23)
        rectangle(ink, 417, 122, 15, 23)
        rectangle(ink, 460, 78, 22, 36)
        self.assertTrue(classify(ink))

    def test_double_scale_and_translation_preserve_roles(self):
        ink = np.pad(np.repeat(np.repeat(fixture(multi=True), 2, axis=0), 2, axis=1),
                     ((31, 9), (43, 7)))
        self.assertTrue(classify(ink, 2 * SCALE))

    def test_missing_lower_endpoint_does_not_establish_ownership(self):
        ink = fixture(tall=True)
        ink[168:192, 92:107] = False
        self.assertFalse(owned(ink).any())

    def test_detached_paired_bounds_do_not_establish_ownership(self):
        ink = fixture(tall=True)
        ink[32:56, 91:106] = False
        ink[168:192, 92:107] = False
        rectangle(ink, 130, 32, 15, 24)
        rectangle(ink, 130, 168, 15, 24)
        self.assertFalse(owned(ink).any())

    def test_nonoverlapping_endpoint_columns_are_not_paired(self):
        ink = fixture(tall=True)
        ink[168:192, 92:107] = False
        rectangle(ink, 118, 168, 15, 24)
        self.assertFalse(owned(ink).any())

    def test_bound_at_wrong_vertical_offset_is_not_owned(self):
        ink = fixture(tall=True)
        ink[168:192, 92:107] = False
        rectangle(ink, 92, 211, 15, 24)
        self.assertFalse(owned(ink).any())

    def test_full_scale_second_equation_row_survives_paired_limits(self):
        ink = fixture(tall=True)
        for x in (280, 312, 344):
            rectangle(ink, x, 144, 22, 36)
        self.assertTrue(owned(ink).any())
        self.assertFalse(classify(ink))

    def test_independent_text_row_above_fraction_is_not_absorbed(self):
        ink = fixture(tall=True)
        for x in (280, 312, 344):
            rectangle(ink, x, 20, 22, 36)
        self.assertFalse(classify(ink))

    def test_two_complete_fraction_levels_remain_independent(self):
        ink = np.zeros((260, 560), dtype=bool)
        rectangle(ink, 70, 36, 16, 160)
        rectangle(ink, 91, 24, 15, 24)
        rectangle(ink, 92, 184, 15, 24)
        for bar_y in (86, 166):
            rectangle(ink, 155, bar_y, 100, 4)
            rectangle(ink, 184, bar_y - 37, 24, 30)
            rectangle(ink, 184, bar_y + 11, 24, 30)
        for y in (64, 144):
            for x in (280, 312, 344):
                rectangle(ink, x, y, 22, 36)
        self.assertTrue(owned(ink).any())
        self.assertFalse(classify(ink))

    def test_connected_wide_root_context_is_preserved(self):
        ink = fixture(multi=True)
        rectangle(ink, 390, 33, 4, 97)
        rectangle(ink, 390, 33, 167, 4)
        rectangle(ink, 540, 34, 17, 45)
        components = ndimage.label(ink)[0]
        original = components.copy()
        mask = layout._bounded_carrier_limit_ownership(components, SCALE)
        self.assertFalse(mask[33:130, 390:557].any())
        self.assertTrue(mask.any())
        self.assertTrue(np.array_equal(components, original))

    def test_cleanup_cannot_recast_connected_body_as_detached_limit(self):
        original = fixture(tall=True)
        rectangle(original, 94, 184, 2, 28)
        rectangle(original, 94, 210, 95, 2)
        rectangle(original, 184, 184, 24, 34)
        context = ndimage.label(original)[0]
        cleaned = fixture(tall=True)
        mask = layout._bounded_carrier_limit_ownership(context, SCALE)
        self.assertFalse(mask.any())
        snapshot = context.copy()
        self.assertFalse(classify(cleaned, context=context))
        self.assertTrue(np.array_equal(context, snapshot))

    def test_short_supported_fraction_rule_joins_only_its_quotient(self):
        ink = np.zeros((160, 260), dtype=bool)
        rectangle(ink, 96, 73, 23, 4)
        rectangle(ink, 104, 45, 10, 24)
        rectangle(ink, 102, 83, 13, 19)
        rules = layout._bounded_fraction_rules(ndimage.label(ink)[0], [], SCALE)
        self.assertIn((96, 118), rules)
        self.assertTrue(ink[45:69, 104:114].all())

    def test_short_unpaired_rule_is_not_fraction_support(self):
        ink = np.zeros((160, 260), dtype=bool)
        rectangle(ink, 96, 73, 23, 4)
        rectangle(ink, 104, 45, 10, 24)
        self.assertEqual(layout._bounded_fraction_rules(ndimage.label(ink)[0], [], SCALE), [])

    def test_collinear_broken_rule_retains_complete_denominator(self):
        ink = np.zeros((160, 260), dtype=bool)
        for x, w in ((60, 28), (93, 23), (117, 14)):
            rectangle(ink, x, 80, w, 5)
        rectangle(ink, 87, 37, 17, 32)
        rectangle(ink, 110, 92, 18, 33)
        rectangle(ink, 65, 108, 36, 6)
        rules = layout._bounded_fraction_rules(ndimage.label(ink)[0], [(60, 87)], SCALE)
        self.assertIn((60, 130), rules)

    def test_vertically_disjoint_rule_fragments_are_not_joined(self):
        ink = np.zeros((160, 260), dtype=bool)
        rectangle(ink, 60, 80, 28, 5)
        rectangle(ink, 93, 88, 23, 5)
        rectangle(ink, 87, 37, 17, 32)
        rectangle(ink, 110, 102, 18, 33)
        rules = layout._bounded_fraction_rules(ndimage.label(ink)[0], [(60, 87)], SCALE)
        self.assertNotIn((60, 115), rules)

    def test_arrow_head_is_not_short_fraction_rule(self):
        ink = np.zeros((160, 260), dtype=bool)
        rectangle(ink, 96, 78, 23, 2)
        for offset in range(8):
            rectangle(ink, 118 - offset, 79 - offset, 1, 1)
            rectangle(ink, 118 - offset, 79 + offset, 1, 1)
        rectangle(ink, 104, 45, 10, 24)
        rectangle(ink, 102, 90, 13, 19)
        self.assertEqual(layout._bounded_fraction_rules(ndimage.label(ink)[0], [], SCALE), [])

    def test_no_paired_carrier_does_not_activate_short_rule_extensions(self):
        ink = fixture(tall=True)
        ink[40:184, 70:86] = False
        self.assertFalse(owned(ink).any())
        self.assertFalse(classify(ink))


if __name__ == "__main__":
    unittest.main()
