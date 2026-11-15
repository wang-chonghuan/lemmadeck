import sys
import unittest
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "tools"))

import layout
from p2c import _page_number_errors


class UnpaginatedPlateTests(unittest.TestCase):
    def setUp(self):
        self.meta = {"unpaginated": True, "printed_page": None}
        self.figure = {"kind": "fig", "owner_lesson": "phy6-c2-s8"}

    def test_explicit_figure_and_caption_page_is_allowed(self):
        blocks = [self.figure, {"kind": "cap", "owner_lesson": "phy6-c2-s8"}]
        self.assertEqual(_page_number_errors(self.meta, blocks), [])

    def test_ordinary_missing_page_number_still_fails(self):
        self.assertTrue(_page_number_errors({"printed_page": None}, [self.figure]))

    def test_unpaginated_cannot_invent_a_page_number(self):
        self.assertTrue(_page_number_errors({**self.meta, "printed_page": 5}, [self.figure]))

    def test_unowned_empty_and_exercise_owned_plates_fail(self):
        for blocks in ([], [{"kind": "fig"}], [{**self.figure, "owner_exercise": "1"}]):
            with self.subTest(blocks=blocks):
                self.assertTrue(_page_number_errors(self.meta, blocks))

    def test_prose_exercises_headers_and_footers_cannot_bypass_numbering(self):
        for kind in ("p", "ex", "exhead", "h1", "h2", "h3", "foot"):
            with self.subTest(kind=kind):
                self.assertTrue(_page_number_errors(
                    self.meta, [self.figure, {"kind": kind, "owner_lesson": "phy6-c2-s8"}]
                ))

    def test_plate_spanning_frame_is_preserved(self):
        ink = np.zeros((200, 200), dtype=bool)
        ink[20:81, 0:200] = True
        box, info = layout.snap(ink, [0, 15, 200, 70], allow_page_spanning=True)
        self.assertEqual(box, [0, 20, 200, 61])
        self.assertEqual(info["components"], 1)

    def test_ordinary_page_spanning_noise_is_still_excluded(self):
        ink = np.zeros((200, 200), dtype=bool)
        ink[20:81, 0:200] = True
        _, info = layout.snap(ink, [0, 15, 200, 70])
        self.assertEqual(info["components"], 0)


if __name__ == "__main__":
    unittest.main()
