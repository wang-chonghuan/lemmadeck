"""Run the authored physical-row fixtures against the preserved pre-repair tool."""
import importlib.util
import sys
import unittest
from pathlib import Path

ROOT = Path.cwd()
sys.path.insert(0, str(ROOT / ".claude/skills/ld-s10y-lesson/tests"))
import test_interval_fraction_rows

path = Path(__file__).resolve().parent / "layout.before.py"
spec = importlib.util.spec_from_file_location("layout_before", path)
before = importlib.util.module_from_spec(spec)
spec.loader.exec_module(before)
test_interval_fraction_rows.line_bands = before.line_bands
test_interval_fraction_rows._single_fraction_row = before._single_fraction_row
suite = unittest.defaultTestLoader.loadTestsFromModule(test_interval_fraction_rows)
result = unittest.TextTestRunner(verbosity=2).run(suite)
sys.exit(0 if result.wasSuccessful() else 1)
