"""Offline behavioral checks for the small production CLI."""
import contextlib
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import production


FAKE_PREPARE = """
import sys
from pathlib import Path
args = sys.argv[1:]
assert args[0] == "prepare"
page = int(args[args.index("--page") + 1])
book = args[args.index("--book") + 1]
work = Path(args[args.index("--work") + 1])
assert Path.cwd() == Path(args[args.index("--root") + 1]).parents[2]
assert Path(args[args.index("--books") + 1]).is_absolute()
print(f"[prepare] {book} page {page}", flush=True)
print(f"diagnostic page {page}", file=sys.stderr, flush=True)
if page == 2 and not (work / "allow-second").exists():
    sys.exit(7)
output = work / book / "pages" / f"{page:04d}"
output.mkdir(parents=True, exist_ok=True)
for name in ("page.png", "page.grid.png", "layout.json", "page.template.md"):
    (output / name).write_text(f"prepared {page}: {name}")
"""


class ProductionTests(unittest.TestCase):
    def setUp(self):
        self.scratch = tempfile.TemporaryDirectory(
            prefix=".production-test-", dir=Path(__file__).resolve().parent
        )
        self.addCleanup(self.scratch.cleanup)
        self.repo = Path(self.scratch.name).resolve()
        subprocess.run(
            ["git", "init", "--quiet", str(self.repo)], check=True, capture_output=True
        )
        self.make_markers(self.repo)
        self.work = self.repo / "work"

    def make_markers(self, root):
        files = {
            ".intentfold/readme.md": "# Test project\n",
            ".intentfold/project.json": '{"project": "lemmadeck"}',
            ".claude/skills/ld-s10y-lesson/tools/p2c.py": FAKE_PREPARE,
            "ssot-resources/soviet10year-textbooks/sources/manifest.json":
                '{"catalogs": [{"book": "6p"}], "pdfs": [{"book": "6-7p"}]}',
        }
        for name, content in files.items():
            path = root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")

    @contextlib.contextmanager
    def cwd(self, path):
        previous = Path.cwd()
        os.chdir(path)
        try:
            yield
        finally:
            os.chdir(previous)

    def invoke(self, args, cwd=None):
        stdout, stderr = io.StringIO(), io.StringIO()
        with self.cwd(cwd or self.repo), contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            code = production.main(args)
        return code, json.loads(stdout.getvalue()), stderr.getvalue()

    def prepare(self, first=1, last=3, book="6p", repo=None, cwd=None, work=None):
        return self.invoke([
            "prepare-range", "--repo", str(repo or self.repo), "--book", book,
            "--first", str(first), "--last", str(last), "--work", str(work or self.work),
        ], cwd)

    def test_exact_root_and_wrong_cwd_no_writes(self):
        with self.cwd(self.repo):
            self.assertEqual(production.validate_workspace(self.repo), self.repo)
        code, result, logs = self.prepare(cwd=self.repo.parent)
        self.assertEqual(code, 1)
        self.assertFalse(result["ok"])
        self.assertIn("cwd", logs)
        self.assertFalse(self.work.exists())

    def test_lookalike_nested_checkout_rejected_before_writes(self):
        nested = self.repo / "suppliedbranch"
        self.make_markers(nested)
        before = {p: p.read_bytes() for p in nested.rglob("*") if p.is_file()}
        code, result, logs = self.prepare(repo=nested, cwd=nested)
        self.assertEqual(code, 1)
        self.assertIn("exact git checkout root", logs)
        self.assertFalse(result["ok"])
        self.assertFalse(self.work.exists())
        self.assertEqual(before, {p: p.read_bytes() for p in nested.rglob("*") if p.is_file()})

    def test_missing_project_marker_no_writes(self):
        (self.repo / ".intentfold/readme.md").unlink()
        code, result, _ = self.prepare()
        self.assertEqual(code, 1)
        self.assertFalse(result["ok"])
        self.assertFalse(self.work.exists())

    def test_missing_or_non_catalog_book_no_writes(self):
        for book in ("", "unknown", "6-7p", "../6p"):
            with self.subTest(book=book):
                code, result, logs = self.prepare(book=book)
                self.assertEqual(code, 1)
                self.assertIn("manifest.catalogs", logs)
                self.assertFalse(result["ok"])
                self.assertFalse(self.work.exists())
        with self.cwd(self.repo), contextlib.redirect_stderr(io.StringIO()):
            with self.assertRaises(SystemExit) as error:
                production.main([
                    "prepare-range", "--repo", str(self.repo),
                    "--first", "1", "--last", "1", "--work", str(self.work),
                ])
        self.assertEqual(error.exception.code, 2)
        self.assertFalse(self.work.exists())

    def test_invalid_ranges_no_writes(self):
        for first, last in ((0, 1), (2, 1), (1, 5)):
            with self.subTest(first=first, last=last):
                code, result, _ = self.prepare(first=first, last=last)
                self.assertEqual(code, 1)
                self.assertFalse(result["ok"])
                self.assertFalse(self.work.exists())

    def test_outside_and_symlink_escaped_work_rejected_before_mkdir(self):
        with tempfile.TemporaryDirectory(
            prefix=self.repo.name + "-outside-", dir=self.repo.parent
        ) as directory:
            outside = Path(directory).resolve()
            marker = outside / "existing-receipt"
            marker.write_bytes(b"preserve original receipt")
            link = self.repo / "work-link"
            link.symlink_to(outside, target_is_directory=True)
            for work in (outside / "new-work", link / "new-work"):
                with self.subTest(work=work), patch.object(
                    Path, "mkdir", side_effect=AssertionError("must reject before mkdir")
                ):
                    code, result, logs = self.prepare(work=work)
                self.assertEqual(code, 1)
                self.assertFalse(result["ok"])
                self.assertIn("inside the validated repository", logs)
                self.assertEqual(list(outside.iterdir()), [marker])
                self.assertEqual(marker.read_bytes(), b"preserve original receipt")
                self.assertFalse(self.work.exists())

    def test_fail_fast_then_reuse_and_preserve_failure_receipts(self):
        code, result, logs = self.prepare()
        self.assertEqual(code, 1)
        self.assertEqual([p["status"] for p in result["pages"]], ["prepared", "failed"])
        failed = result["pages"][1]
        self.assertEqual(failed["returncode"], 7)
        self.assertIn("failed", logs)
        self.assertFalse((self.work / "6p/pages/0003").exists())
        self.assertEqual(failed["command"], [
            sys.executable, str(self.repo / ".claude/skills/ld-s10y-lesson/tools/p2c.py"),
            "prepare", "--book", "6p", "--page", "2",
            "--root", str(self.repo / "ssot-resources/soviet10year-textbooks/artifacts"),
            "--books", str(self.repo / "ssot-resources/soviet10year-textbooks/sources"),
            "--work", str(self.work),
        ])
        receipts = {Path(failed[key]): Path(failed[key]).read_bytes()
                    for key in ("stdout", "stderr")}
        self.assertEqual(receipts[Path(failed["stdout"])], b"[prepare] 6p page 2\n")
        self.assertEqual(receipts[Path(failed["stderr"])], b"diagnostic page 2\n")
        first_page = self.work / "6p/pages/0001"
        original = {p: p.read_bytes() for p in first_page.iterdir()}
        (self.work / "allow-second").touch()
        code, result, _ = self.prepare()
        self.assertEqual(code, 0)
        self.assertEqual([p["status"] for p in result["pages"]], ["reused", "prepared", "prepared"])
        self.assertEqual(original, {p: p.read_bytes() for p in first_page.iterdir()})
        self.assertEqual(receipts, {p: p.read_bytes() for p in receipts})
        self.assertNotEqual(result["pages"][1]["stdout"], str(next(iter(receipts))))
        self.assertTrue(all(p.is_relative_to(self.work) for p in receipts))

    def test_complete_outputs_reused_without_running_prepare(self):
        page = self.work / "6p/pages/0001"
        page.mkdir(parents=True)
        names = ("page.png", "page.grid.png", "layout.json", "page.template.md")
        for name in names:
            (page / name).write_bytes(b"existing bytes")
        (self.repo / ".claude/skills/ld-s10y-lesson/tools/p2c.py").write_text(
            'raise RuntimeError("must not rerun")'
        )
        code, result, _ = self.prepare(last=1)
        self.assertEqual(code, 0)
        self.assertEqual(result["pages"][0]["status"], "reused")
        self.assertEqual(sorted(p.name for p in page.iterdir()), sorted(names))
        self.assertTrue(all(p.read_bytes() == b"existing bytes" for p in page.iterdir()))

    def test_partial_outputs_are_not_reused(self):
        page = self.work / "6p/pages/0001"
        page.mkdir(parents=True)
        for name in ("page.png", "page.grid.png", "layout.json", "page.template.md"):
            (page / name).write_bytes(b"")
        code, result, _ = self.prepare(last=1)
        self.assertEqual(code, 0)
        self.assertEqual(result["pages"][0]["status"], "prepared")
        self.assertTrue((page / "page.template.md").stat().st_size)

    def test_spawn_error_stops_before_next_page(self):
        run = subprocess.run

        def fail_prepare(command, **kwargs):
            if command[0] == "git":
                return run(command, **kwargs)
            raise OSError("injected spawn failure")

        with patch.object(production.subprocess, "run", side_effect=fail_prepare):
            code, result, _ = self.prepare()
        self.assertEqual(code, 1)
        self.assertEqual(len(result["pages"]), 1)
        failed = result["pages"][0]
        self.assertEqual(failed["status"], "failed")
        self.assertIsNone(failed["returncode"])
        self.assertEqual(Path(failed["stdout"]).read_bytes(), b"")
        self.assertIn(b"injected spawn failure", Path(failed["stderr"]).read_bytes())
        self.assertFalse((self.work / "6p/pages/0002").exists())

    def test_mixed_json_logs_and_concatenated_documents(self):
        text = (
            'INFO preparing\n[prepare] page 1\n[p2c] reading\n300 dpi\n'
            '{"candidate": {"text": "braces { inside } and \\"quotes\\""}}\n'
            'log between documents\n[\n{"page": 1}, {"page": 2}\n]\n'
            '{"done": true}null\nfinished\n'
        )
        self.assertEqual(production.read_json_documents(text), [
            {"candidate": {"text": 'braces { inside } and "quotes"'}},
            [{"page": 1}, {"page": 2}], {"done": True},
        ])

    def test_retained_stage_records_with_number_prefixed_directory_listings(self):
        text = (
            '{\n"scope": "read-existing-index-and-stage-metadata-only",\n'
            '"first_stage_permission_inferred": false, "books": [{"book": "7p"}]\n}\n'
            '{"index": 0, "id": "7p8p-resumed-batch-59", "keys": ["status"]}\n'
            'DIR ssot-resources/soviet10year-textbooks/artifacts\n5m\n6a\n6p\n7a\n7p\n8p\n'
            '1. retained items\n300 dpi\n7p-resumed-batch-59 record\n'
            'DIR .tmp/ld-s10y-lesson\nb58-earth-mass\n'
            '[{"candidate": "unchanged"}]{"after_listing": true}\n'
        )
        self.assertEqual(production.read_json_documents(text), [
            {
                "scope": "read-existing-index-and-stage-metadata-only",
                "first_stage_permission_inferred": False, "books": [{"book": "7p"}],
            },
            {"index": 0, "id": "7p8p-resumed-batch-59", "keys": ["status"]},
            [{"candidate": "unchanged"}], {"after_listing": True},
        ])

    def test_no_documents_and_truncated_json_are_errors(self):
        for text in (
            "", "plain logs\n[prepare] done", '{"unfinished":', "[1",
            '{"ok": true}\n{"unfinished":', '{"ok": true}\n[fal',
            '5m\n6a\n6p\n300 dpi', "true\nnull\n1",
        ):
            with self.subTest(text=text), self.assertRaises(ValueError):
                production.read_json_documents(text)

    def test_read_saved_stdout_without_rerunning_command(self):
        saved = self.repo / "saved.stdout"
        saved.write_text('original command log\n{"candidate": 1}\n[{"second": 2}]\n')
        before = saved.read_bytes()
        with patch.object(production.subprocess, "run", side_effect=AssertionError("no rerun")):
            code, result, _ = self.invoke(["read-json", "--input", str(saved)])
        self.assertEqual(code, 0)
        self.assertEqual(result, {"docs": [{"candidate": 1}, [{"second": 2}]]})
        self.assertEqual(saved.read_bytes(), before)
        self.assertFalse(self.work.exists())
        saved.write_text('{"unfinished":')
        code, result, logs = self.invoke(["read-json", "--input", str(saved)])
        self.assertEqual(code, 1)
        self.assertFalse(result["ok"])
        self.assertIn("JSON", logs)


if __name__ == "__main__":
    unittest.main()
