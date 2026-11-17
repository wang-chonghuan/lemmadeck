import importlib.util
import sys
import unittest

from diagnose import OUT, TOOLS, load_layout

sys.modules["layout"] = load_layout(OUT / "layout.before.py")
spec = importlib.util.spec_from_file_location("carrier_fixtures", TOOLS / "test_layout_carrier_rows.py")
tests = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tests)
private_new_helper_checks = {
    "test_small_independent_row_is_not_an_integral_limit",
    "test_repeated_small_local_glyphs_cannot_be_limits",
}
suite = unittest.TestSuite(
    test for test in unittest.defaultTestLoader.loadTestsFromTestCase(tests.CarrierRows)
    if test._testMethodName not in private_new_helper_checks
)
print("Preserved baseline against NEW independent fixtures; two new-helper-only checks excluded.")
result = unittest.TextTestRunner(verbosity=2).run(suite)
sys.exit(0 if result.wasSuccessful() else 1)
