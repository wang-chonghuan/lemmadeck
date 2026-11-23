import argparse
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import sys
import unittest

import numpy as np
from PIL import Image

from diagnose import ROOT, SCRATCH, load_layout

TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
PAGES = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/8p/pages"
BODY_ROWS = {
    29: (
        (900, 948), (981, 1027), (1061, 1108), (1142, 1188), (1223, 1269),
        (1302, 1350), (1382, 1430), (1462, 1512), (1545, 1594), (2173, 2223),
    ),
    31: (
        (718, 793), (806, 850), (888, 938), (1528, 1581), (1614, 1681),
        (1690, 1763), (1780, 1824), (1860, 1905), (1940, 1984),
        (2020, 2065), (2102, 2147), (2174, 2226),
    ),
}
EXPECTED_COUNTS = {29: 13, 31: 15, 158: 27}


def main():
    if Path.cwd() != ROOT:
        raise SystemExit("Unexpected working directory")
    parser = argparse.ArgumentParser()
    parser.add_argument("--layout", required=True)
    parser.add_argument("--label", required=True)
    args = parser.parse_args()
    out = SCRATCH / args.label
    out.mkdir()
    source = ROOT / args.layout
    with (out / "layout.py").open("xb") as stream:
        stream.write(source.read_bytes())
    layout = load_layout(out / "layout.py")
    sys.path.insert(0, str(TOOLS))
    sys.modules["layout"] = layout
    import blocks
    import p2c

    modules, test_bindings = [], {}
    for name, path in (
        ("test_line_bands_fraction", TOOLS / "test_line_bands_fraction.py"),
        ("test_line_bands_margin_core", TOOLS / "test_line_bands_margin_core.py"),
        ("test_line_bands_short_continuation", TOOLS / "test_line_bands_short_continuation.py"),
        ("test_layout", ROOT / ".claude/skills/ld-s10y-lesson/tests/test_layout.py"),
    ):
        data = path.read_bytes()
        frozen = out / f"{name}.py"
        with frozen.open("xb") as stream:
            stream.write(data)
        test_bindings[str(path.relative_to(ROOT))] = hashlib.sha256(data).hexdigest()
        spec = importlib.util.spec_from_file_location(name, frozen)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        modules.append(module)
    suite = unittest.TestSuite(
        unittest.defaultTestLoader.loadTestsFromModule(module) for module in modules
    )
    log = io.StringIO()
    report = unittest.TextTestRunner(stream=log, verbosity=2).run(suite)
    with (out / "tests.txt").open("x") as stream:
        stream.write(log.getvalue())
    rows, checks, inputs = {}, [], {}
    for number in (29, 31, 158):
        page = PAGES / f"{number:04d}"
        png = ROOT / f".tmp/ld-s10y-lesson/8p/pages/{number:04d}/page.png"
        with Image.open(png) as image:
            original = layout.ink_mask(image)
        _, parsed = blocks.parse((page / "page.md").read_text())
        audit = json.loads((page / "audit.json").read_text())
        masked, _, errors = p2c._counting_mask(original, audit["figures"], parsed)
        assert not errors, errors
        cols = np.flatnonzero(original.any(axis=0))
        width = int(cols[-1] - cols[0] + 1)
        before = masked.copy()
        bands = layout.line_bands(masked, width)
        checks.append((f"p{number} count", len(bands) == EXPECTED_COUNTS[number]))
        checks.append((f"p{number} mask unchanged", bool(np.array_equal(masked, before))))
        controls = []
        for first, last in BODY_ROWS.get(number, ()):
            missing = masked.copy()
            missing[first:last + 1] = False
            count = len(layout.line_bands(missing, width))
            controls.append({"deleted": [first, last], "actual_count": count})
            checks.append((f"p{number} delete {first}-{last}",
                           count == EXPECTED_COUNTS[number] - 1))
        rows[number] = {"count": len(bands), "bands": bands, "deletions": controls}
        for path in (png, page / "page.md", page / "audit.json"):
            inputs[str(path.relative_to(ROOT))] = hashlib.sha256(path.read_bytes()).hexdigest()
        if number == 158:
            checks.append(("p158 cutoff first five rows", bands[:5] == [
                (248, 295), (331, 376), (414, 458), (487, 584), (628, 673),
            ]))
            for first, last, required in (
                (1672, 1781, [(1672, 1711), (1743, 1781)]),
                (1876, 1982, [(1876, 1929), (1930, 1982)]),
            ):
                found = [(a, b) for a, b in bands if first <= a and b <= last]
                checks.append((f"p158 cutoff {first}-{last}", found == required))
    success = report.wasSuccessful() and all(passed for _, passed in checks)
    result = {
        "role": "technical regression guard only; no finalize/source approval",
        "cwd": str(ROOT), "argv": [sys.executable, *sys.argv],
        "exit_code": 0 if success else 1,
        "layout_sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
        "tests_run": report.testsRun, "test_failures": len(report.failures),
        "test_errors": len(report.errors), "test_skips": len(report.skipped),
        "tests_sha256": test_bindings, "inputs_sha256": inputs, "pages": rows,
        "checks": [{"name": name, "satisfied": passed} for name, passed in checks],
    }
    with (out / "result.json").open("x") as stream:
        json.dump(result, stream, indent=2)
        stream.write("\n")
    print(json.dumps({
        "result": str(out / "result.json"),
        "tests_run": report.testsRun, "failures": len(report.failures),
        "errors": len(report.errors), "skips": len(report.skipped),
        "counts": {number: row["count"] for number, row in rows.items()},
        "failed_checks": [name for name, passed in checks if not passed],
    }, indent=2))
    if not report.wasSuccessful():
        print(log.getvalue())
    return 0 if success else 1


if __name__ == "__main__":
    raise SystemExit(main())
