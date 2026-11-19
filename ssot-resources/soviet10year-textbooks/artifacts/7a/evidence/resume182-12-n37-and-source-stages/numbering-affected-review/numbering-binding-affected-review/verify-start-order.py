#!/usr/bin/env python3
"""Confirm only the start-order defect observed in the preserved FIRST probes."""
from __future__ import annotations

import ast
import copy
import hashlib
import json
import re
from pathlib import Path
from types import SimpleNamespace

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
OUT = Path(__file__).resolve().parent
EVIDENCE = OUT.parent.parent
ASSEMBLE = ROOT / ".claude/skills/ld-s10y-lesson/tools/assemble.py"
EDITION = ROOT / ".claude/skills/ld-s10y-lesson/tools/edition.py"
CANDIDATE = EVIDENCE / "n37-source-stage-affected/artifacts/7a/lessons/alg7-c4-s2-n37"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/7a"
reads = {}


def digest(path):
    data = path.read_bytes()
    return {"sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)}


def read(path):
    reads[str(path.relative_to(ROOT))] = digest(path)
    return path.read_text(encoding="utf-8")


def load(path):
    return json.loads(read(path))


def functions(path, names, namespace):
    tree = ast.parse(read(path))
    nodes = [n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name in names]
    assert {n.name for n in nodes} == set(names)
    module = ast.Module(body=[ast.ImportFrom(module="__future__", names=[
        ast.alias(name="annotations")], level=0), *nodes], type_ignores=[])
    exec(compile(ast.fix_missing_locations(module), str(path), "exec"), namespace)
    return tree


first_path = OUT / "helper-probes-FIRST.json"
first = load(first_path)
assert first["status"] == "REVISE"
assert len([c for c in first["checks"] if c["status"] == "REVISE"]) == 1
assert all(digest(ROOT / path) == value for path, value in first["references"].items())
namespace = {"Path": Path, "load": load}
tree = functions(EDITION, ["source_errata", "_source_target_map", "_refs_by_target"], namespace)
tail = copy.deepcopy(next(n for n in tree.body if isinstance(n, ast.FunctionDef)
                         and n.name == "_authoritative_source_targets"))
start = next(i for i, n in enumerate(tail.body) if isinstance(n, ast.Assign)
             and any(isinstance(t, ast.Name) and t.id == "identity_fields" for t in n.targets))
tail.body = [ast.parse("candidates = authoritative_candidates").body[0], *tail.body[start:]]
tail.name = "authority_tail"
exec(compile(ast.fix_missing_locations(ast.Module(body=[
    ast.ImportFrom(module="__future__", names=[ast.alias(name="annotations")], level=0),
    tail], type_ignores=[])), str(EDITION), "exec"), namespace)
lesson = load(CANDIDATE / "lesson.json")
exercises = load(CANDIDATE / "exercises.json")
candidate = copy.deepcopy(lesson)
candidate["exercises"] = copy.deepcopy(exercises["exercises"])
for item in candidate["prose"]:
    item["ref"] = item["source_refs"][0]
    item["spans"] = item["source_refs"]
namespace["authoritative_candidates"] = [candidate]
calls = []


def authority(book, raw, document):
    calls.append(1)
    return namespace["authority_tail"](book, raw, document)


namespace["_authoritative_source_targets"] = authority


class PageView:
    def glob(self, pattern):
        assert pattern == "pages/*/page.json"
        return [BOOK / "pages/0231/page.json", BOOK / "pages/0232/page.json"]


book = PageView()
source231 = load(BOOK / "pages/0231/page.json")
source232 = load(BOOK / "pages/0232/page.json")
assert not source231["meta"].get("errata") and not source232["meta"].get("errata")
position = next(i for i, item in enumerate(exercises["exercises"]) if item["number"] == "786")
original = exercises["exercises"][position]
assert original["pages"] == ["p0231#8", "p0232#1"]
assert not source231["blocks"][7].get("cont")
assert source232["blocks"][0]["cont"] is True
ledger_record = next(r for r in source231["meta"]["exercise_numbering_errata"]
                     if r["block"] == "p0231#8")
assert original["numbering_erratum"] == ledger_record
assert namespace["source_errata"](book, lesson, exercises) == []
changed = copy.deepcopy(exercises)
changed["exercises"][position]["pages"].reverse()
assert changed["exercises"][position]["numbering_erratum"] == ledger_record
before = len(calls)
accepted = namespace["source_errata"](book, lesson, changed)
assert accepted == [] and len(calls) == before + 1
assembly = {"Path": Path, "re": re, "BLOCKREF": re.compile(r"^p(\d+)#(\d+)$")}
functions(ASSEMBLE, ["_source_number", "_sequence_number"], assembly)
try:
    assembly["_sequence_number"](changed["exercises"][position])
except ValueError as error:
    answer_error = str(error)
else:
    raise AssertionError("answer boundary unexpectedly accepted reversed start")
rebound = copy.deepcopy(changed)
rebound["exercises"][position]["numbering_erratum"]["block"] = "p0232#1"
try:
    namespace["source_errata"](book, lesson, rebound)
except SystemExit as error:
    rebound_error = str(error)
else:
    raise AssertionError("edition accepted forged continuation record")
prior = load(OUT.parent / "numbering-affected-review.json")
inherited_paths = [
    CANDIDATE / "lesson.json", CANDIDATE / "exercises.json",
    BOOK / "pages/0231/page.json", BOOK / "pages/0232/page.json",
    BOOK / "pages/0231/page.md", BOOK / "pages/0232/page.md",
]
inherited_bindings = {}
for path in inherited_paths:
    key = str(path.relative_to(ROOT))
    inherited_bindings[key] = digest(path)
    assert inherited_bindings[key] == prior["references"][key]
read(Path(__file__))
assert all(digest(ROOT / path) == value for path, value in reads.items())
assert all(digest(ROOT / path) == value for path, value in first["references"].items())
result = {
    "status": "REVISE", "priority": 2,
    "title": "Edition authority accepts continuation-first refs when their set is unchanged",
    "original_refs": original["pages"],
    "mutated_refs": changed["exercises"][position]["pages"],
    "record_block_unchanged": ledger_record["block"],
    "current_authoritative_first_block_cont": False,
    "mutated_first_block_cont": True,
    "numbering_only_authority_calls": len(calls) - before,
    "reversed_refs_authority_calls": 1,
    "source_errata_accepted_reversed_refs": accepted,
    "answer_boundary_rejected_same_input": answer_error,
    "edition_rejected_record_itself_rebound_to_continuation": rebound_error,
    "root_cause": "_authoritative_source_targets omits pages identity; _refs_by_target compares sets.",
    "required_fix": "Validate the authoritative exercise start ref (or ordered pages) even when the full ref set matches. Add this affected negative case.",
    "limit": "Unchanged binding tail only; inherited candidate supplied, no source re-review or upstream reconstruction.",
    "FIRST_preserved": digest(first_path), "read_set": reads,
    "inherited_approved_inputs_still_match_prior": inherited_bindings,
    "current_code_still_matches_FIRST_probe_bindings": True,
}
target = OUT / "start-order-confirmation.json"
with target.open("x", encoding="utf-8") as handle:
    handle.write(json.dumps(result, ensure_ascii=True, indent=2) + "\n")
print(json.dumps({"status": result["status"], "confirmed": result["title"],
                  "report": str(target), "sha256": digest(target)["sha256"]}, indent=2))
