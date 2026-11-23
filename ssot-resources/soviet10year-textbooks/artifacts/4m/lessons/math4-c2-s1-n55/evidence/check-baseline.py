from pathlib import Path
import sys
import types
import unittest

tools = Path(".claude/skills/ld-s10y-lesson/tools").resolve()
sys.path.insert(0, str(tools))
source = (tools / "layout.py").read_text()
start = source.index("    # A shallow one-stroke glyph")
end = source.index("    short_rows = [", start)
source = source[:start] + source[end:]
start = source.index("    supported_short_rows = [")
end = source.index("    raw.sort()", start)
source = source[:start] + source[end:]
module = types.ModuleType("layout")
module.__file__ = str(tools / "layout.py")
exec(compile(source, module.__file__, "exec"), module.__dict__)
sys.modules["layout"] = module
sys.path.insert(0, str(Path(".claude/skills/ld-s10y-lesson/tests").resolve()))
suite = unittest.defaultTestLoader.loadTestsFromNames([
    "test_6a_printed_rows",
    "test_sparse_shallow_rules",
])
result = unittest.TextTestRunner(verbosity=1).run(suite)
sys.exit(not result.wasSuccessful())
