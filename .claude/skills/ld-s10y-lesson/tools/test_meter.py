#!/usr/bin/env python3
"""The meter must report real numbers, refuse to guess which session it is, and fail on budget."""
from __future__ import annotations

import json
import os
import sys
import tempfile
import time
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import checkpoint as cp
import meter


def claude_line(read=0, write=0, plain=0, out=0):
    return json.dumps({"message": {"role": "assistant", "usage": {
        "input_tokens": plain, "cache_read_input_tokens": read,
        "cache_creation_input_tokens": write, "output_tokens": out}}})


def codex_line(inp, cached, out, total):
    return json.dumps({"type": "token_usage_record", "payload": {"total_token_usage": {
        "input_tokens": inp, "cached_input_tokens": cached,
        "output_tokens": out, "total_tokens": total}}})


class Claude(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.dir.cleanup)
        self.path = Path(self.dir.name) / "sess-a.jsonl"

    def write(self, lines):
        self.path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        return self.path

    def test_per_turn_deltas_are_summed(self):
        usage = meter.read_transcript(self.write([
            claude_line(read=100, write=10, plain=5, out=7),
            claude_line(read=300, write=0, plain=2, out=9),
        ]))
        self.assertEqual("claude", usage["runtime"])
        self.assertEqual(2, usage["turns"])
        self.assertEqual(400, usage["cached"])
        self.assertEqual(17, usage["input"])        # 10+5 + 0+2
        self.assertEqual(16, usage["output"])
        self.assertEqual(433, usage["total"])
        self.assertEqual(302, usage["peakContext"])  # max(115, 302)
        self.assertEqual("sess-a", usage["session"])

    def test_all_null_usage_reports_zero_not_an_invented_number(self):
        line = json.dumps({"message": {"usage": {
            "input_tokens": None, "cache_read_input_tokens": None,
            "cache_creation_input_tokens": None, "output_tokens": None}}})
        usage = meter.read_transcript(self.write([line]))
        self.assertEqual(0, usage["total"])
        self.assertEqual(1, usage["turns"])

    def test_a_transcript_without_usage_fails(self):
        path = Path(self.dir.name) / "empty.jsonl"
        path.write_text(json.dumps({"message": {"role": "user"}}) + "\n", encoding="utf-8")
        with self.assertRaisesRegex(meter.MeterError, "no usage records"):
            meter.read_transcript(path)

    def test_a_missing_transcript_fails(self):
        with self.assertRaisesRegex(meter.MeterError, "no transcript at"):
            meter.read_transcript(Path(self.dir.name) / "nope.jsonl")


class Codex(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.dir.cleanup)

    def test_cumulative_total_takes_the_last_record(self):
        path = Path(self.dir.name) / "rollout-x.jsonl"
        path.write_text("\n".join([
            codex_line(1000, 900, 10, 1010),
            codex_line(5000, 4500, 50, 5050),
        ]) + "\n", encoding="utf-8")
        usage = meter.read_transcript(path)
        self.assertEqual("codex", usage["runtime"])
        self.assertEqual(4500, usage["cached"])
        self.assertEqual(500, usage["input"])     # 5000 - 4500
        self.assertEqual(50, usage["output"])
        self.assertEqual(5050, usage["total"])

    def test_cached_above_input_is_a_refusal_not_a_guess(self):
        path = Path(self.dir.name) / "rollout-bad.jsonl"
        path.write_text(codex_line(100, 900, 1, 1001) + "\n", encoding="utf-8")
        with self.assertRaisesRegex(meter.MeterError, "refusing to guess"):
            meter.read_transcript(path)


class Discovery(unittest.TestCase):
    def test_two_transcripts_touched_together_is_ambiguous(self):
        with tempfile.TemporaryDirectory() as home:
            repo = Path(home) / "repo"
            (repo / ".intentfold").mkdir(parents=True)
            (repo / ".intentfold/project.json").write_text("{}", encoding="utf-8")
            slug = str(repo.resolve()).replace("/", "-")
            root = Path(home) / ".claude/projects" / slug
            root.mkdir(parents=True)
            for name in ("a.jsonl", "b.jsonl"):
                (root / name).write_text(claude_line(read=1) + "\n", encoding="utf-8")
            os.environ["HOME"] = home
            self.addCleanup(os.environ.__setitem__, "HOME", str(Path.home()))
            with self.assertRaisesRegex(meter.MeterError, "pass --transcript explicitly"):
                meter.discover(repo.resolve())

    def test_a_renamed_checkout_fails_instead_of_picking_a_stranger(self):
        with tempfile.TemporaryDirectory() as home:
            repo = Path(home) / "repo"
            (repo / ".intentfold").mkdir(parents=True)
            (repo / ".intentfold/project.json").write_text("{}", encoding="utf-8")
            os.environ["HOME"] = home
            self.addCleanup(os.environ.__setitem__, "HOME", str(Path.home()))
            with self.assertRaisesRegex(meter.MeterError, "no session directory"):
                meter.discover(repo.resolve())


class Budget(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.dir.cleanup)
        self.repo = Path(self.dir.name) / "repo"
        (self.repo / ".intentfold/tickets/T-1/production").mkdir(parents=True)
        (self.repo / ".intentfold/project.json").write_text("{}", encoding="utf-8")
        self.transcript = Path(self.dir.name) / "sess-b.jsonl"
        self.transcript.write_text(claude_line(read=1000, out=10) + "\n", encoding="utf-8")
        cp.main(["init", "--repo", str(self.repo), "--ticket", "T-1", "--book", "3m"])

    def args(self, *extra):
        return ["record", "--repo", str(self.repo), "--ticket", "T-1",
                "--transcript", str(self.transcript), *extra]

    def test_within_budget_exits_zero_and_records_the_numbers(self):
        self.assertEqual(0, meter.main(self.args("--budget", "100000")))
        doc = cp.load(cp.checkpoint_path(self.repo.resolve(), "T-1"))
        row = doc["sessions"][-1]
        self.assertEqual("sess-b", row["session"])
        self.assertEqual(1010, row["total"])
        self.assertEqual(1000, row["cached"])
        self.assertEqual(1, row["turns"])

    def test_over_budget_exits_non_zero(self):
        self.assertEqual(1, meter.main(self.args("--budget", "100")))

    def test_over_budget_still_records_the_truth(self):
        meter.main(self.args("--budget", "100"))
        doc = cp.load(cp.checkpoint_path(self.repo.resolve(), "T-1"))
        self.assertEqual(1010, doc["sessions"][-1]["total"])

    def test_recording_twice_updates_one_row(self):
        meter.main(self.args("--budget", "100000"))
        meter.main(self.args("--budget", "100000"))
        doc = cp.load(cp.checkpoint_path(self.repo.resolve(), "T-1"))
        self.assertEqual(1, len(doc["sessions"]))


if __name__ == "__main__":
    unittest.main()
