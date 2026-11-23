"""Bounded runs with immutable existing test assertions and cached PNG setup."""
import argparse
import difflib
import hashlib
import io
import json
from pathlib import Path
import sys
from types import SimpleNamespace
import unittest

import numpy as np
from PIL import Image

from diagnose import BASE_SHA, OWN, ROOT, TOOLS, inputs, load, sha

P60 = ROOT / ".tmp/180-7-n12-p60-counter/test_source60.py"
P54 = ROOT / ".tmp/180-7-p54-counter/test_counter.py"
TYPOGRAPHY = ROOT / ".tmp/180-7-p54-counter/refinement/test_typography.py"


class Results(unittest.TextTestResult):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.subtests = 0
        self.failed_subtests = []

    def addSubTest(self, test, subtest, error):
        self.subtests += 1
        if error:
            self.failed_subtests.append(str(subtest))
        super().addSubTest(test, subtest, error)


def cached_source60_setup(cls):
    import blocks
    import layout
    import p2c

    page = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0060"
    cls.meta, cls.parsed = blocks.parse((page / "page.md").read_text())
    source = p2c._find_pdf(SimpleNamespace(
        book="8p", pdf=None,
        books=ROOT / "ssot-resources/soviet10year-textbooks/sources",
    ))
    if sha(source) != cls.meta["source"]["pdf_sha256"]:
        raise AssertionError("Original source PDF changed")
    retained = ROOT / ".tmp/ld-s10y-lesson/8p/pages/0060/page.png"
    original = P60.parent / "original-pdf/page60.png"
    if sha(retained) != cls.meta["render"]["sha256"] or sha(original) != sha(retained):
        raise AssertionError("Original SOURCE60 cache binding changed")
    with Image.open(retained) as image:
        cls.ink = layout.ink_mask(image)
    with Image.open(ROOT / ".tmp/ld-s10y-lesson/8p/pages/0031/page.png") as image:
        cls.minus_ink = layout.ink_mask(image)
    xs = np.flatnonzero(cls.ink.any(axis=0))
    cls.width = int(xs[-1] - xs[0] + 1)
    cls.rule = np.zeros_like(cls.ink)
    cls.rule[1960:1967, 150:633] = cls.ink[1960:1967, 150:633]


def main():
    assert Path.cwd() == ROOT
    parser = argparse.ArgumentParser()
    parser.add_argument("label", choices=("baseline", "candidate-01"))
    args = parser.parse_args()
    destination = OWN / args.label
    assert not destination.exists(), "Never overwrite retained results"
    destination.mkdir()
    sys.dont_write_bytecode = True
    sys.path.insert(0, str(TOOLS))
    assert sha(TOOLS / "layout.py") == BASE_SHA
    source = TOOLS / "layout.py" if args.label == "baseline" else OWN / "candidate.py"
    before = inputs()
    tests_paths = [OWN / "test_p121.py", P60, P54, TYPOGRAPHY,
                   TOOLS / "test_line_bands_margin_core.py",
                   TOOLS.parent / "tests/test_hollow_margin_blots.py"]
    bindings = {str(p.relative_to(ROOT)): sha(p) for p in tests_paths}
    layout = load("layout", source)

    def forbidden_renderer(*args, **kwargs):
        raise AssertionError("Renderer is prohibited; use already bound PNGs")

    layout.render_page = forbidden_renderer
    p121 = load("p121_controls", OWN / "test_p121.py")
    source60 = load("source60_controls", P60)
    source60.ROOT = ROOT
    source60.Source60Tests.setUpClass = classmethod(cached_source60_setup)
    p54 = load("p54_controls", P54)
    typography = load("typography_controls", TYPOGRAPHY)
    core = load("margin_core_controls", TOOLS / "test_line_bands_margin_core.py")
    hollow = load("hollow_controls", TOOLS.parent / "tests/test_hollow_margin_blots.py")
    groups = {
        "p121": p121, "source60-unchanged-assertions": source60,
        "p54-unchanged": p54, "p54-smalltype-unchanged": typography,
        "margin-core-branch-guards": core, "hollow-branch-guards": hollow,
    }
    outcomes = {}
    loader = unittest.defaultTestLoader
    for name, module in groups.items():
        stream = io.StringIO()
        result = unittest.TextTestRunner(stream=stream, verbosity=2, resultclass=Results).run(
            loader.loadTestsFromModule(module))
        (destination / f"{name}.txt").write_text(stream.getvalue())
        outcomes[name] = {
            "methods": result.testsRun, "subtests": result.subtests,
            "failures": len(result.failures), "errors": len(result.errors),
            "skips": len(result.skipped), "failed_subtests": result.failed_subtests,
            "failure_ids": [test.id() for test, _ in result.failures],
            "error_ids": [test.id() for test, _ in result.errors],
        }
        print(f"{name}: methods={result.testsRun} subtests={result.subtests} "
              f"failures={len(result.failures)} errors={len(result.errors)} "
              f"skips={len(result.skipped)}", flush=True)
    delta = "".join(difflib.unified_diff(
        (TOOLS / "layout.py").read_text().splitlines(keepends=True),
        source.read_text().splitlines(keepends=True),
        fromfile="live/layout.py", tofile="private/candidate.py",
    ))
    (destination / "candidate.diff").write_text(delta)
    after = inputs()
    test_after = {str(p.relative_to(ROOT)): sha(p) for p in tests_paths}
    bands = layout.line_bands(p121.Page121CounterTests.ink, p121.Page121CounterTests.width)
    output = {
        "scope": "technical only, no SOURCE approval or pipeline replay",
        "cwd": str(ROOT), "argv": sys.argv,
        "base_sha256": BASE_SHA, "candidate_sha256": sha(source),
        "tests": outcomes, "counted_bands_inclusive_y": bands,
        "protected_inputs_unchanged": before == after,
        "protected_input_bindings_before": before,
        "protected_input_bindings_after": after,
        "test_bindings": bindings, "test_bindings_unchanged": bindings == test_after,
        "source60_adapter": "setUpClass only: hash-bound retained page60/page31 PNGs; assertions unchanged",
        "actual_image_views": 2, "new_image_views_this_run": 0,
        "renderer_calls": 0,
        "global_suite_replay": False,
        "historical_shared_failures": "Not replayed, reset, or reclassified.",
        "uncertainty": "Separate SOURCE reviewer determines semantic inventory; candidate not integrated.",
    }
    failed = any(item["failures"] or item["errors"] or item["skips"] for item in outcomes.values())
    output["exit_code"] = int(failed or before != after or bindings != test_after)
    (destination / "results.json").write_text(json.dumps(output, indent=2) + "\n")
    print(json.dumps({key: output[key] for key in (
        "candidate_sha256", "counted_bands_inclusive_y",
        "protected_inputs_unchanged", "test_bindings_unchanged", "exit_code",
    )}))
    raise SystemExit(output["exit_code"])


if __name__ == "__main__":
    main()
