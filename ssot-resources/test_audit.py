import importlib.util
from pathlib import Path
import unittest


spec = importlib.util.spec_from_file_location("resource_audit", Path(__file__).with_name("audit.py"))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class DisposableReferenceTests(unittest.TestCase):
    def test_current_relative_scratch_is_rejected(self):
        self.assertTrue(audit.is_disposable_reference(".tmp/figure/source.png"))

    def test_current_absolute_scratch_is_rejected(self):
        self.assertTrue(audit.is_disposable_reference("/Users/test/repo/.tmp/source.png"))

    def test_ticket_scratch_is_rejected(self):
        self.assertTrue(audit.is_disposable_reference(".intentfold/tickets/T-1/tmp/source.png"))

    def test_prose_is_not_a_locator(self):
        self.assertFalse(audit.is_disposable_reference("Original /Users/test/repo/.tmp/old.md; retained."))

    def test_retained_nested_directory_is_not_root_scratch(self):
        self.assertFalse(audit.is_disposable_reference(
            ".intentfold/tickets/T-1/evidence/files/.tmp/original/source.png"))
        self.assertFalse(audit.is_disposable_reference(
            "/Users/test/repo/ssot-resources/evidence/.tmp/original/source.png"))

    def test_explicit_history_does_not_hide_current_dependency(self):
        data = {"historicalPath": ".tmp/old/source.png", "image": {"path": ".tmp/current/source.png"}}
        self.assertEqual(list(audit.json_tmp_references(data)),
                         [("$.image.path", ".tmp/current/source.png")])

    def test_paid_receipt_preserves_origin_but_current_asset_still_fails(self):
        data = {"schema": "n-azure/image-generation@1",
                "output": {"path": ".tmp/original.png", "sha256": "original-hash"},
                "currentAsset": {"path": ".tmp/current.png"}}
        self.assertEqual(list(audit.json_tmp_references(data)),
                         [("$.currentAsset.path", ".tmp/current.png")])


if __name__ == "__main__":
    unittest.main()
