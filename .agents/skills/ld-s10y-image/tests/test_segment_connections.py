from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from validate_spec import assertion_errors


class SegmentConnectionsTest(unittest.TestCase):
    def check(self, kind, target=(3, 2)):
        return assertion_errors(
            [{"type": "connects", "arrow": "edge", "from": "A", "to": "B"}],
            [{"id": "edge", "type": kind, "from": [0, 0], "to": list(target)}],
            {"A": (0, 0), "B": (3, 2)},
        )

    def test_arrow_and_segment_use_the_same_endpoint_contract(self):
        self.assertEqual(self.check("arrow"), [])
        self.assertEqual(self.check("segment"), [])

    def test_wrong_segment_endpoint_is_rejected(self):
        self.assertTrue(self.check("segment", (3, 1)))

    def test_non_edge_is_rejected(self):
        self.assertTrue(self.check("circle"))


if __name__ == "__main__":
    unittest.main()
