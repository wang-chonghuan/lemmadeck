from __future__ import annotations

import copy
import hashlib
import io
import json
import subprocess
import sys
import tempfile
import unittest
from argparse import Namespace
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

import assemble
import edition
import production
from artifact_io import write_if_changed


SKILL = Path(__file__).resolve().parent.parent
PROFILE = SKILL / "profiles" / "soviet-cn.json"
MODERN = SKILL / "profiles" / "modern-us-neutral.json"


def save(path: Path, value) -> None:
    write_if_changed(path, (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode())


class ThroughputTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.book = self.root / "5m"
        for page, title, formula in ((1, "First", "$1+1=3$"), (2, "Second", "$2+2=5$")):
            save(self.book / "pages" / f"{page:04d}" / "page.json", {
                "meta": {
                    "book": "5m", "page": page, "printed_page": page,
                    "source": {"pdf_sha256": "a" * 64},
                    "errata": [{
                        "id": f"e{page}", "block": f"p{page:04d}#2",
                        "original": formula, "reason": "Arithmetic source erratum",
                    }],
                },
                "blocks": [
                    {"kind": "h3", "lines": [f"{page}. {title}"]},
                    {"kind": "p", "lines": [formula]},
                    {"kind": "ex", "label": str(page), "lines": ["Find $x=2$."]},
                ],
            })
        self.assemble()

    def assemble(self):
        with redirect_stdout(io.StringIO()):
            self.assertEqual(assemble.run(self.book, None, PROFILE), 0)

    def raw(self, lesson):
        directory = self.book / "lessons" / lesson
        return edition.load(directory / "lesson.json"), edition.load(directory / "exercises.json")

    def snapshot(self):
        return {
            path.relative_to(self.book): (path.read_bytes(), path.stat().st_mtime_ns, path.stat().st_ino)
            for path in self.book.rglob("*") if path.is_file()
        }

    def test_noop_preserves_files_permissions_and_attached_evidence(self):
        attached = self.book / "lessons" / "1-First" / "answer-keys.json"
        attached.write_text('{"retained":true}\n')
        attached.chmod(0o444)
        inactive = self.book / "lessons" / "saved-draft" / "review.json"
        inactive.parent.mkdir()
        inactive.write_text('{"status":"hold"}\n')
        (inactive.parent / "exercises.json").write_text("unfinished draft is not an active lesson")
        before = self.snapshot()
        self.assemble()
        self.assertEqual(self.snapshot(), before)
        self.assertEqual(attached.stat().st_mode & 0o777, 0o444)
        self.assertNotIn("saved-draft", [item["id"] for item in edition.load(self.book / "book.json")["lessons"]])

    def test_changed_output_does_not_follow_an_external_directory(self):
        outside = self.root / "outside"
        outside.mkdir()
        redirected = self.book / "redirect"
        redirected.symlink_to(outside, target_is_directory=True)
        with self.assertRaises(ValueError):
            write_if_changed(redirected / "new.json", b"new", root=self.book)
        self.assertEqual(list(outside.iterdir()), [])

    def test_unchanged_source_figure_is_not_rewritten(self):
        source = self.root / "work/pages/0001/figures/fig-1.png"
        source.parent.mkdir(parents=True)
        source.write_bytes(b"source figure bytes")
        warnings = []
        assemble.promote_figures(self.book, self.root / "work", warnings)
        target = self.book / "figures/fig-1.png"
        before = target.read_bytes(), target.stat().st_ino, target.stat().st_mtime_ns
        assemble.promote_figures(self.book, self.root / "work", warnings)
        self.assertEqual((target.read_bytes(), target.stat().st_ino, target.stat().st_mtime_ns), before)

    def test_local_change_updates_only_affected_course_outputs(self):
        before = self.snapshot()
        page = self.book / "pages" / "0001" / "page.json"
        value = edition.load(page)
        value["blocks"][1]["lines"] = ["$1+1=3$ Source note."]
        save(page, value)
        self.assemble()
        after = self.snapshot()
        changed = {str(path) for path in before if before[path] != after[path]}
        self.assertEqual(changed, {
            "pages/0001/page.json", "lessons/1-First/lesson.json", "lessons/1-First/lesson.md",
        })

    def test_prepare_reads_pages_and_reconstructs_source_once_for_two_lessons(self):
        args = Namespace(
            root=self.root, book="5m", edition="modern-us-neutral", work=self.root / "work",
            profile=MODERN, lesson=["1-First", "2-Second"], force=False,
        )
        original = edition.load
        page_reads = []

        def read(path):
            if path.name == "page.json":
                page_reads.append(path)
            return original(path)

        with patch.object(edition, "load", side_effect=read), patch.object(
            assemble, "cut_lessons", wraps=assemble.cut_lessons,
        ) as reconstruction, redirect_stdout(io.StringIO()):
            self.assertEqual(edition.cmd_prepare(args), 0)
        self.assertEqual(len(page_reads), 2)
        self.assertEqual(reconstruction.call_count, 1)
        for lesson, expected in (("1-First", "e1"), ("2-Second", "e2")):
            candidate = edition.load(
                args.work / "adapt/5m/modern-us-neutral/lessons" / lesson / "lesson.template.json"
            )
            self.assertEqual([item["id"] for item in candidate["errata"]], [expected])

    def test_finalize_checks_two_lessons_with_one_source_reconstruction(self):
        args = Namespace(
            root=self.root, book="5m", edition="modern-us-neutral", work=self.root / "work",
            profile=MODERN, lesson=["1-First", "2-Second"], force=False,
        )
        with redirect_stdout(io.StringIO()):
            self.assertEqual(edition.cmd_prepare(args), 0)
        for lesson, corrected in (("1-First", "$1+1=2$"), ("2-Second", "$2+2=4$")):
            path = args.work / "adapt/5m/modern-us-neutral/lessons" / lesson / "lesson.template.json"
            value = edition.load(path)
            value["prose"][0]["text"] = corrected
            value["prose"][0]["changes"] = ["math-correction"]
            value["errata"][0]["corrected"] = corrected
            save(path, value)
        original = edition.load
        page_reads = []

        def read(path):
            if path.name == "page.json":
                page_reads.append(path)
            return original(path)

        output = io.StringIO()
        with patch.object(edition, "load", side_effect=read), patch.object(
            assemble, "cut_lessons", wraps=assemble.cut_lessons,
        ) as reconstruction, redirect_stdout(output):
            self.assertEqual(edition.cmd_finalize(args), 0, output.getvalue())
        self.assertEqual(len(page_reads), 2)
        self.assertEqual(reconstruction.call_count, 1)
        for lesson in args.lesson:
            audit = edition.load(
                self.book / "editions/modern-us-neutral/lessons" / lesson / "adaptation.audit.json"
            )
            self.assertEqual(audit["status"], "pass")
            self.assertEqual(audit["errata"], 1)

    def test_new_invocation_detects_source_change_and_wrong_binding(self):
        first, exercises = self.raw("1-First")
        before, before_errors = edition.source_errata(self.book, first, exercises)
        self.assertEqual(before_errors, [])
        page = self.book / "pages/0001/page.json"
        value = edition.load(page)
        value["meta"]["errata"][0]["reason"] = "Changed source reason"
        save(page, value)
        after, after_errors = edition.source_errata(self.book, first, exercises)
        self.assertEqual(after_errors, [])
        self.assertNotEqual(before[0]["source"]["sha256"], after[0]["source"]["sha256"])
        self.assertEqual(after[0]["reason"], "Changed source reason")
        wrong = copy.deepcopy(first)
        wrong["prose"][0]["source_refs"] = ["p0002#2"]
        _, wrong_errors = edition.source_errata(self.book, wrong, exercises)
        self.assertTrue(
            any("来源引用与权威页装订身份不一致" in error for error in wrong_errors),
            wrong_errors,
        )

    def test_page_cache_is_not_mutated_by_cross_page_merge(self):
        pages = [(Path("one"), {
            "meta": {"page": 1}, "blocks": [{"kind": "p", "lines": ["a"], "open": True}],
        }), (Path("two"), {
            "meta": {"page": 2}, "blocks": [{"kind": "p", "lines": ["b"], "cont": True}],
        })]
        before = copy.deepcopy(pages)
        merged, _ = assemble.merge_across_pages(assemble.load_stream(self.book, pages))
        self.assertEqual(merged[0]["lines"], ["a", "b"])
        self.assertEqual(pages, before)

    def test_current_image_review_reused_but_changed_output_rejected(self):
        paths = {name: self.root / name for name in ("spec", "render", "svg")}
        for name, path in paths.items():
            path.write_text(name)
        review_path = self.root / "review.json"
        save(review_path, {
            "schema": edition.IMAGE_REVIEW_SCHEMA, "figure": "fig-1", "status": "pass",
            "spec": {"sha256": edition.sha256(paths["spec"])},
            "render": {"sha256": edition.sha256(paths["render"])},
            "outputs": {"svg": {"sha256": edition.sha256(paths["svg"])}},
        })
        before = review_path.read_bytes(), review_path.stat().st_mtime_ns
        args = (review_path, paths["spec"], "render", paths["render"], {"svg": paths["svg"]}, "fig-1")
        self.assertEqual(edition.validate_review(*args), [])
        self.assertEqual((review_path.read_bytes(), review_path.stat().st_mtime_ns), before)
        paths["svg"].write_text("changed geometry")
        self.assertTrue(edition.validate_review(*args))


class ReceiptTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.output = self.root / "stdout"
        self.errors = self.root / "stderr"
        completed = subprocess.run(
            [sys.executable, "-c", "print('saved real execution')"],
            capture_output=True, cwd=self.root,
        )
        self.output.write_bytes(completed.stdout)
        self.errors.write_bytes(completed.stderr)
        self.flat = {
            "cwd": str(self.root), "argv": [sys.executable, "-c", "print('saved real execution')"],
            "exitCode": completed.returncode, "stdout": str(self.output), "stderr": str(self.errors),
            "startedAt": "old", "invocationCount": 2,
        }

    def nested(self):
        return {
            "workdir": self.flat["cwd"], "command": sys.executable,
            "child_argv": self.flat["argv"][1:], "exit_code": 0,
            "streams": {
                "stdout": {"path": "stdout", "sha256": hashlib.sha256(self.output.read_bytes()).hexdigest()},
                "stderr": {"path": "stderr", "bytes": 0},
            },
            "irrelevant_package_count": 1695,
        }

    def test_wrapper_differences_and_extra_metadata_do_not_fail_real_receipt(self):
        self.assertEqual(
            production.normalize_receipt(self.flat, self.root),
            production.normalize_receipt(self.nested(), self.root),
        )
        actual, expected = self.root / "actual.json", self.root / "expected.json"
        save(actual, self.flat)
        save(expected, self.nested())
        result = subprocess.run(
            [sys.executable, str(SKILL / "tools/production.py"), "read-receipt",
             "--input", str(actual), "--expected", str(expected)],
            capture_output=True, text=True, cwd=SKILL.parents[2],
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(json.loads(result.stdout)["ok"])

    def test_actual_failures_missing_streams_and_conflicts_are_rejected(self):
        variants = [
            {**self.flat, "exitCode": 1},
            {**self.flat, "exitCode": None},
            {**self.flat, "exit_code": 1},
            {**self.flat, "signal": "SIGTERM"},
            {**self.flat, "stdout": None},
            {**self.flat, "argv": []},
            {**self.flat, "workdir": "/wrong"},
            {**self.flat, "streams": {"stdout": str(self.errors)}},
        ]
        for record in variants:
            with self.subTest(record=record), self.assertRaises(ValueError):
                production.normalize_receipt(record, self.root)

    def test_hash_drift_and_different_execution_not_silently_accepted(self):
        record = self.nested()
        self.output.write_text("changed after capture")
        with self.assertRaises(ValueError):
            production.normalize_receipt(record, self.root)
        actual, expected = self.root / "actual.json", self.root / "expected.json"
        save(actual, self.flat)
        save(expected, {**self.flat, "argv": [sys.executable, "different.py"]})
        with self.assertRaises(ValueError):
            production.read_receipt(actual, expected)


if __name__ == "__main__":
    unittest.main()
