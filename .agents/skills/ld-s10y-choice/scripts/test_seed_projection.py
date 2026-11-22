import copy
import unittest
from unittest.mock import patch

import validate
from prepare import ContractError


class SeedProjectionTest(unittest.TestCase):
    def setUp(self):
        self.seed = {
            "schema": "s10y-choice-seed-v1",
            "source": {"book": "b", "lesson": "l", "concept_figure_ids": []},
            "exercises": [{"number": "1", "text": "Find x.", "figure_ids": []}],
            "concepts": [], "figures": [],
            "trace": [{"sha256": "index"}, {"sha256": "raw"}],
        }
        self.refreshed = copy.deepcopy(self.seed)
        self.refreshed["exercises"][0]["text"] = "Solve:\nFind x."
        self.files = (None, None, None, None, [
            {}, {}, {"exercises": [{"number": "1", "text": "Find x."}]},
        ])

    def check(self, seed):
        with patch.object(validate, "prepare_seed", return_value=self.refreshed), \
             patch.object(validate, "source_files", return_value=self.files):
            return validate.check_seed(seed, ".")

    def test_unchanged_legacy_projection(self):
        self.assertIn("1", self.check(self.seed)[0])

    def test_changed_source_hash_still_fails(self):
        self.refreshed["trace"][1]["sha256"] = "changed"
        with self.assertRaises(ContractError):
            self.check(self.seed)

    def test_explicit_group_policy(self):
        seed = copy.deepcopy(self.refreshed)
        seed["source"]["include_group_instructions"] = True
        self.check(seed)
        seed["exercises"][0]["text"] = "Find x."
        with self.assertRaises(ContractError):
            self.check(seed)


if __name__ == "__main__":
    unittest.main()
