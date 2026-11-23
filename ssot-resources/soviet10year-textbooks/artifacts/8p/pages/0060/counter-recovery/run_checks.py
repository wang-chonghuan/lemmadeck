"""Run only the bounded private counter controls and unchanged P54 guards."""
import difflib
import hashlib
import importlib.util
import io
import json
import os
from pathlib import Path
import sys
import unittest


OWN = Path(__file__).resolve().parent
ROOT = OWN.parents[1]
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
BASE_SHA = "8cb92aec54903cec817cec5c0f4fa29502e6f16ffc3919b7052ef217ed4d9e8d"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def bindings():
    paths = [
        TOOLS / "layout.py", TOOLS / "p2c.py", TOOLS / "blocks.py",
        TOOLS / "test_line_bands_footnote_separator.py",
        ROOT / ".tmp/ld-s10y-lesson/8p/pages/0060/page.png",
        ROOT / ".tmp/ld-s10y-lesson/8p/pages/0060/layout.json",
        ROOT / ".intentfold/tickets/STEMROBIN-180/source-8p60-blocker.md",
        ROOT / ".intentfold/tickets/STEMROBIN-180/production-usage.json",
    ]
    paths.extend(sorted((ROOT /
        "ssot-resources/soviet10year-textbooks/artifacts/8p/pages/0060"
    ).rglob("*")))
    return {
        str(path.relative_to(ROOT)): sha(path)
        for path in paths if path.is_file()
    }


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    value = importlib.util.module_from_spec(spec)
    sys.modules[name] = value
    spec.loader.exec_module(value)
    return value


class Results(unittest.TextTestResult):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.assertions_failed = []
        self.successful = []

    def addSuccess(self, test):
        super().addSuccess(test)
        self.successful.append(test.id())

    def addSubTest(self, test, subtest, err):
        super().addSubTest(test, subtest, err)
        if err:
            self.assertions_failed.append(str(subtest))

    def addFailure(self, test, err):
        super().addFailure(test, err)
        self.assertions_failed.append(test.id())


def main():
    snapshot = sys.argv[1]
    if snapshot not in ("baseline", "candidate-01", "candidate-02"):
        raise SystemExit("Unknown private snapshot")
    run_name = sys.argv[2] if len(sys.argv) == 3 else snapshot
    if not run_name or any(
        character not in "abcdefghijklmnopqrstuvwxyz0123456789-_" for character in run_name
    ):
        raise SystemExit("Run name must be a single private directory name")
    destination = OWN / run_name
    destination.mkdir(exist_ok=True)
    results_path = destination / "results.json"
    if results_path.exists():
        raise SystemExit("Refusing to overwrite retained results")
    private = OWN / ("layout.original.py" if snapshot == "baseline" else "layout.py")
    before = bindings()
    if before[str((TOOLS / "layout.py").relative_to(ROOT))] != BASE_SHA:
        raise SystemExit("Live detector changed; no verification against a drifting base")
    # Existing P54 tests render only into this owned scratch.
    temporary = OWN / "temporary"
    temporary.mkdir(exist_ok=True)
    os.environ["TMPDIR"] = str(temporary)
    import tempfile
    tempfile.tempdir = str(temporary)
    sys.path.insert(0, str(TOOLS))
    layout = module("layout", private)
    outcomes = {}
    targets = {
        "source60": OWN / "test_source60.py",
        "p54-unchanged": TOOLS / "test_line_bands_footnote_separator.py",
    }
    for name, path in targets.items():
        tests = module(name.replace("-", "_"), path)
        log = io.StringIO()
        result = unittest.TextTestRunner(
            stream=log, verbosity=2, resultclass=Results,
        ).run(unittest.defaultTestLoader.loadTestsFromModule(tests))
        (destination / f"{name}.txt").write_text(log.getvalue())
        outcomes[name] = {
            "methods": result.testsRun,
            "failures": len(result.failures),
            "errors": len(result.errors),
            "skips": len(result.skipped),
            "failed_ids": result.assertions_failed,
            "successful_ids": result.successful,
            "test_sha256": sha(path),
        }
        print(f"{name}: methods={result.testsRun}, failures={len(result.failures)}, "
              f"errors={len(result.errors)}, skips={len(result.skipped)}")
    (destination / "layout.py").write_bytes(private.read_bytes())
    delta = "".join(difflib.unified_diff(
        (OWN / "layout.original.py").read_text().splitlines(keepends=True),
        private.read_text().splitlines(keepends=True),
        fromfile="a/.claude/skills/ld-s10y-lesson/tools/layout.py",
        tofile="b/.claude/skills/ld-s10y-lesson/tools/layout.py",
    ))
    (destination / "candidate.diff").write_text(delta)
    after = bindings()
    outcome = {
        "scope": "technical counter only; no source or course approval",
        "cwd": str(ROOT),
        "candidate_sha256": sha(private),
        "base_sha256": sha(OWN / "layout.original.py"),
        "diff_sha256": sha(destination / "candidate.diff"),
        "bindings_before": before,
        "bindings_after": after,
        "protected_bindings_unchanged": before == after,
        "tests": outcomes,
        "known_shared": "4 failures/2 skips acknowledged; shared/project suites not run",
        "new_images_viewed": 1,
        "image_views_limit": 2,
    }
    results_path.write_text(json.dumps(outcome, indent=2) + "\n")
    passed = before == after and all(
        not result["failures"] and not result["errors"] and not result["skips"]
        for result in outcomes.values()
    )
    print("Bounded technical counter:", "PASS" if passed else "FAIL")
    raise SystemExit(0 if passed else 1)


if __name__ == "__main__":
    main()
