#!/usr/bin/env python3
"""Offline, affected-only probes. No imports of producers or image libraries."""
from __future__ import annotations

import ast
import copy
import hashlib
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from types import SimpleNamespace

ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
assert Path.cwd() == ROOT
OUT = Path(__file__).resolve().parent
B = OUT.parent
EVIDENCE = B.parent
assert OUT == EVIDENCE / "numbering-affected-review/numbering-binding-affected-review"
ASSEMBLE = ROOT / ".claude/skills/ld-s10y-lesson/tools/assemble.py"
EDITION = ROOT / ".claude/skills/ld-s10y-lesson/tools/edition.py"
ANSWERS = ROOT / ".claude/skills/ld-s10y-answer/tools/lesson_answers.py"
BLOCKS = ROOT / ".claude/skills/ld-s10y-lesson/tools/blocks.py"
BOOK = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/7a"
CANDIDATE = EVIDENCE / "n37-source-stage-affected/artifacts/7a/lessons/alg7-c4-s2-n37"
LESSON_ID = "alg7-c4-s2-n37"
checks = []
references = {}
function_bindings = {}


def fingerprint(path):
    data = path.read_bytes()
    return {"sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)}


def retained(path):
    path = Path(path)
    references[str(path.relative_to(ROOT))] = fingerprint(path)
    return path


def read_json(path):
    return json.loads(retained(path).read_text(encoding="utf-8"))


def compile_functions(path, names, namespace, text=None):
    text = text if text is not None else retained(path).read_text(encoding="utf-8")
    tree = ast.parse(text)
    selected = [n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name in names]
    assert {n.name for n in selected} == set(names)
    for node in selected:
        segment = "".join(text.splitlines(keepends=True)[node.lineno - 1:node.end_lineno])
        if path in (ASSEMBLE, EDITION, ANSWERS) and text == path.read_text(encoding="utf-8"):
            key = f"{path.relative_to(ROOT)}:{node.name}"
            function_bindings[key] = {
                "line": node.lineno, "end_line": node.end_lineno,
                "sha256": hashlib.sha256(segment.encode()).hexdigest(),
                "file_sha256": fingerprint(path)["sha256"],
            }
    module = ast.Module(body=[ast.ImportFrom(module="__future__", names=[
        ast.alias(name="annotations")], level=0), *selected], type_ignores=[])
    exec(compile(ast.fix_missing_locations(module), str(path), "exec"), namespace)
    return tree


def check(name, passed, **detail):
    checks.append({"case": name, "status": "PASS" if passed else "REVISE", **detail})


class LookupAttempt(Exception):
    pass


class LookupTripwire(list):
    def __init__(self):
        super().__init__()
        self.iterations = 0

    def __iter__(self):
        self.iterations += 1
        raise LookupAttempt("answer lookup reached before rejection")


def reject_answer(name, exercise, source_book=BOOK, replacement_doc=None):
    tripwire = LookupTripwire()
    old_json = assembly["json"]
    if replacement_doc is not None:
        assembly["json"] = SimpleNamespace(loads=lambda _: copy.deepcopy(replacement_doc))
    try:
        answer["captured_answer"](tripwire, LESSON_ID, exercise, "book", source_book)
    except ValueError as error:
        check(name, tripwire.iterations == 0, error=str(error),
              answer_iterations=tripwire.iterations)
    except (Exception, SystemExit) as error:
        check(name, False, error=f"{type(error).__name__}: {error}",
              answer_iterations=tripwire.iterations)
    else:
        check(name, False, error="invalid binding accepted",
              answer_iterations=tripwire.iterations)
    finally:
        assembly["json"] = old_json


def mutated(item, **values):
    result = copy.deepcopy(item)
    result.update(values)
    return result


def changed_record(item, **values):
    result = copy.deepcopy(item)
    result["numbering_erratum"].update(values)
    return result


def baseline_text(path):
    result = subprocess.run(
        ["git", "show", f"HEAD:{path.relative_to(ROOT)}"], cwd=ROOT,
        capture_output=True, text=True, check=True)
    return result.stdout


prior = read_json(B / "numbering-affected-review.json")
retained(B / "numbering-affected-review.md")
retained(B / "report-hashes.json")
for relative, binding in prior["references"].items():
    path = ROOT / relative
    # Preserve inherited evidence by hashes; do not reopen source images/content.
    if path.is_file() and path.suffix in (".json", ".md", ".stdout", ".stderr"):
        retained(path)
retained(EVIDENCE / "numbering-before-binding-repair.patch")
retained(EVIDENCE / "numbering-tests-FIRST.py")
for relative in (".intentfold/readme.md", ".intentfold/charter/engineering.md",
                 ".intentfold/charter/operations.md", ".claude/skills/ld-s10y-lesson/SKILL.md"):
    retained(ROOT / relative)

block_namespace = {"re": re, "Path": Path, "WRAP": "\u21b5"}
compile_functions(BLOCKS, ["text_of", "exercise_numbering_errata"], block_namespace)
assembly = {"json": json, "re": re, "Path": Path,
            "B": SimpleNamespace(**block_namespace), "BLOCKREF": re.compile(r"^p(\d+)#(\d+)$")}
compile_functions(ASSEMBLE, ["_source_number", "_sequence_number", "bound_sequence_number"], assembly)
answer = {"assemble": SimpleNamespace(**assembly), "Path": Path}
answer_tree = compile_functions(
    ANSWERS, ["source_number", "same_source_number", "captured_answer", "cmd_prepare"], answer)
candidate_doc = read_json(CANDIDATE / "exercises.json")
raw_lesson = read_json(CANDIDATE / "lesson.json")
assert len(candidate_doc["exercises"]) == 22
items = {str(item["number"]): item for item in candidate_doc["exercises"]}
source_documents = {}
for item in items.values():
    match = assembly["BLOCKREF"].fullmatch(item["pages"][0])
    page = int(match.group(1))
    source_documents[page] = read_json(BOOK / f"pages/{page:04d}/page.json")

canonical_selection = []
for number, printed, start in (("786", "736", "p0231#8"),
                               ("787", "737", "p0232#2"),
                               ("788", "738", "p0232#3")):
    item = items[number]
    page = int(assembly["BLOCKREF"].fullmatch(start).group(1))
    doc = source_documents[page]
    ledger = block_namespace["exercise_numbering_errata"](doc["meta"], doc["blocks"], page)
    check(f"{number}-exact-current-start-ledger",
          item["pages"][0] == start and item["source_number"] == printed
          and item["numbering_erratum"] == ledger[start],
          start=start, record_sha256=hashlib.sha256(
              json.dumps(ledger[start], sort_keys=True, ensure_ascii=True).encode()).hexdigest())
    historical = {"exercise": printed, "raw": "historical-sentinel"}
    canonical = {"exercise": int(number), "raw": "canonical-sentinel"}
    selected = answer["captured_answer"]([historical, canonical], LESSON_ID, item, "book", BOOK)
    old_only = answer["captured_answer"]([historical], LESSON_ID, item, "book", BOOK)
    bound = assembly["bound_sequence_number"](item, BOOK)
    check(f"{number}-canonical-only-selection",
          selected is canonical and old_only is None and bound == number,
          canonical=number, historical=printed, old_only=None if old_only is None else old_only)
    canonical_selection.append({"number": number, "printed": printed, "start": start,
                                "canonical_selected": selected is canonical,
                                "historical_only_returned_none": old_only is None})
    removed = copy.deepcopy(item)
    removed.pop("numbering_erratum")
    reject_answer(f"{number}-missing-record", removed)
    reject_answer(f"{number}-null-record", mutated(item, numbering_erratum=None))
    reject_answer(f"{number}-stale-id", changed_record(item, id="stale-id"))
    reject_answer(f"{number}-stale-reason", changed_record(item, reason="stale-reason"))
    reject_answer(f"{number}-unbound-authority", item, source_book=None)
    erased = mutated(removed, number=printed)
    reject_answer(f"{number}-erase-record-and-restore-printed-identity", erased)

first = items["786"]
for name, item in (
    ("forged-self-consistent-787", mutated(changed_record(first, corrected="787"), number="787")),
    ("continuation-rebinding", mutated(changed_record(first, block="p0232#1"),
                                      pages=["p0232#1", "p0231#8"])),
    ("missing-id", changed_record(first, id="")),
    ("missing-reason", changed_record(first, reason="")),
    ("missing-start-refs", mutated(first, pages=[])),
    ("malformed-start-ref", mutated(changed_record(first, block="not-a-ref"), pages=["not-a-ref"])),
    ("integer-record-printed", changed_record(first, printed=736)),
    ("zero-corrected", mutated(changed_record(first, corrected="0"), number="0")),
    ("negative-corrected", mutated(changed_record(first, corrected="-1"), number="-1")),
):
    reject_answer(name, item)
reject_answer("missing-authoritative-page", first, source_book=OUT / "absent-book")
for name, item in (
    ("ordinary-malformed-ref", {"number": "736", "source_number": "736", "pages": ["bad"]}),
    ("ordinary-zero-index", {"number": "736", "source_number": "736", "pages": ["p0231#0"]}),
    ("ordinary-index-out-of-range", {"number": "736", "source_number": "736", "pages": ["p0231#999"]}),
    ("ordinary-non-ex-start", {"number": "736", "source_number": "736", "pages": ["p0231#1"]}),
    ("ordinary-continuation-start", {"number": "736", "source_number": "736", "pages": ["p0232#1"]}),
    ("ordinary-printed-mismatch", {"number": "999", "source_number": "999", "pages": ["p0231#8"]}),
):
    reject_answer(name, item)
changed_page = copy.deepcopy(source_documents[231])
changed_page["meta"]["page"] = 232
reject_answer("meta-page-mismatch", first, replacement_doc=changed_page)
for name, field, value in (("registered-non-ex-start", "kind", "p"),
                            ("registered-cont-start", "cont", True),
                            ("registered-printed-mismatch", "label", "735")):
    changed_page = copy.deepcopy(source_documents[231])
    changed_page["blocks"][7][field] = value
    reject_answer(name, first, replacement_doc=changed_page)

prepare = next(n for n in answer_tree.body if isinstance(n, ast.FunctionDef) and n.name == "cmd_prepare")
calls = [n for n in ast.walk(prepare) if isinstance(n, ast.Call)
         and isinstance(n.func, ast.Name) and n.func.id == "captured_answer"]
check("cmd-prepare-static-root-authority-wiring", len(calls) == 1 and any(
    kw.arg == "source_book" and isinstance(kw.value, ast.Name) and kw.value.id == "root"
    for kw in calls[0].keywords), proof="AST only; cmd_prepare was never executed")

# Execute the unchanged binding tail only. Upstream reconstruction is deliberately excluded.
edition_namespace = {"Path": Path, "load": read_json}
edition_tree = compile_functions(
    EDITION, ["_source_target_map", "_refs_by_target", "source_errata",
              "_authoritative_source_targets"], edition_namespace)
authority_node = copy.deepcopy(next(n for n in edition_tree.body
    if isinstance(n, ast.FunctionDef) and n.name == "_authoritative_source_targets"))
tail_start = next(i for i, node in enumerate(authority_node.body)
                  if isinstance(node, ast.Assign) and any(isinstance(target, ast.Name)
                  and target.id == "identity_fields" for target in node.targets))
authority_node.body = [ast.parse("candidates = authoritative_candidates").body[0],
                       *authority_node.body[tail_start:]]
authority_node.name = "authoritative_binding_tail"
exec(compile(ast.fix_missing_locations(ast.Module(body=[
    ast.ImportFrom(module="__future__", names=[ast.alias(name="annotations")], level=0),
    authority_node], type_ignores=[])), str(EDITION), "exec"), edition_namespace)
authoritative = copy.deepcopy(raw_lesson)
authoritative["exercises"] = copy.deepcopy(candidate_doc["exercises"])
for prose in authoritative["prose"]:
    prose["ref"] = prose["source_refs"][0]
    prose["spans"] = prose["source_refs"]
for item in authoritative["exercises"]:
    start = item["pages"][0]
    match = assembly["BLOCKREF"].fullmatch(start)
    page, index = int(match.group(1)), int(match.group(2)) - 1
    doc = source_documents[page]
    block = doc["blocks"][index]
    ledger = block_namespace["exercise_numbering_errata"](doc["meta"], doc["blocks"], page)
    expected = ledger.get(start)
    item["source_number"] = block.get("label")
    item["number"] = expected["corrected"] if expected else block.get("label", item["number"])
    item.pop("numbering_erratum", None)
    if expected is not None:
        item["numbering_erratum"] = expected
edition_namespace["authoritative_candidates"] = [authoritative]
authority_calls = []


def authority(book, lesson, exercises):
    authority_calls.append(1)
    return edition_namespace["authoritative_binding_tail"](book, lesson, exercises)


edition_namespace["_authoritative_source_targets"] = authority


class NumberingOnlyPages:
    def glob(self, pattern):
        assert pattern == "pages/*/page.json"
        return [BOOK / "pages/0231/page.json", BOOK / "pages/0232/page.json"]


numbering_only_book = NumberingOnlyPages()
assert all(not source_documents[p]["meta"].get("errata") for p in (231, 232))
before = len(authority_calls)
result = edition_namespace["source_errata"](numbering_only_book, raw_lesson, candidate_doc)
check("numbering-only-valid-runs-authority", result == [] and len(authority_calls) == before + 1,
      authority_calls=1, mathematical_errata=0, numbering_records=3)
for name, changed in (
    ("missing", {k: v for k, v in first.items() if k != "numbering_erratum"}),
    ("null", mutated(first, numbering_erratum=None)),
    ("stale-id", changed_record(first, id="stale-id")),
    ("stale-reason", changed_record(first, reason="stale-reason")),
    ("forged", mutated(changed_record(first, corrected="787"), number="787")),
    ("continuation-ref", mutated(first, pages=["p0232#1", "p0231#8"])),
    ("empty-record", mutated(first, numbering_erratum={})),
):
    document = copy.deepcopy(candidate_doc)
    position = next(i for i, item in enumerate(document["exercises"]) if item["number"] == "786")
    document["exercises"][position] = changed
    before = len(authority_calls)
    try:
        edition_namespace["source_errata"](numbering_only_book, raw_lesson, document)
    except SystemExit as error:
        check(f"numbering-only-{name}-raw-and-matching-modern-rejected",
              len(authority_calls) == before + 1, error=str(error), authority_calls=1,
              proof="matching modern cannot rescue a rejected raw authority binding; no finalize run")
    else:
        check(f"numbering-only-{name}-raw-and-matching-modern-rejected", False)

baseline = {"Path": Path}
head_answers = baseline_text(ANSWERS)
compile_functions(ANSWERS, ["source_number", "same_source_number", "captured_answer"],
                  baseline, text=head_answers)
head_assembly = baseline_text(ASSEMBLE)
old_assembly = {"Path": Path}
compile_functions(ASSEMBLE, ["_source_number"], old_assembly, text=head_assembly)
ordinary = [{"number": "1"}, {"number": 2}, {"number": "q1", "source_number": None},
            {"number": "g2-1", "source_number": "1", "group_id": "g2", "group": "practice"},
            {"number": None}, {"number": "x", "source_number": "x"}]
for scope in ("book", "lesson", "lesson-group"):
    for index, item in enumerate(ordinary):
        captured = [{"exercise": item.get("source_number", item["number"]),
                     "lesson": LESSON_ID, "exerciseId": str(item["number"]),
                     "sourceNumber": item.get("source_number", item["number"]),
                     "groupId": item.get("group_id"), "group": item.get("group"),
                     "raw": "ordinary-sentinel"}]
        current = answer["captured_answer"](captured, LESSON_ID, item, scope)
        old = baseline["captured_answer"](captured, LESSON_ID, item, scope)
        check(f"ordinary-{scope}-{index}-HEAD-compatible", current == old
              and assembly["_sequence_number"](item) == old_assembly["_source_number"](item))
for number, item in items.items():
    if "numbering_erratum" not in item:
        check(f"ordinary-actual-{number}-start-compatible",
              assembly["bound_sequence_number"](item, BOOK) == item["source_number"])

retained(Path(__file__))
for name in ("numbering-final-binding-tests-affected", "numbering-assembly-regression-FIRST",
             "numbering-answers-regression-FIRST", "numbering-edition-regression-FIRST",
             "n37-assembly-FIRST", "n37-assembly-numbering-affected"):
    receipt = read_json(EVIDENCE / f"stages/{name}.receipt.json")
    for stream in receipt["streams"]:
        path = retained(ROOT / stream["path"])
        check(f"retained-{name}-{path.suffix}-hash",
              fingerprint(path)["sha256"] == stream["sha256"])
    check(f"retained-{name}-cwd", receipt["cwd"] == str(ROOT),
          exit=receipt["exit"], reused_not_rerun=True)
    if name == "numbering-final-binding-tests-affected":
        check("inherited-final-seven-pass", receipt["exit"] == 0 and
              "Ran 7 tests" in (EVIDENCE / f"stages/{name}.stderr").read_text())

stable = all(fingerprint(ROOT / path) == value for path, value in references.items())
check("read-set-and-preserved-FIRST-stable", stable)
report = {
    "schema": "ld-s10y-numbering-binding-affected-review@1",
    "ticket": "STEMROBIN-182", "created_at": datetime.now(timezone.utc).isoformat(),
    "cwd": str(ROOT), "finish": "review", "offline": True,
    "status": "PASS" if all(c["status"] == "PASS" for c in checks) else "REVISE",
    "source_numbering_metadata": "inherited PASS; no source re-review",
    "isolated_candidate_fidelity": "inherited PASS; no candidate-body re-review",
    "findings": [
        {"prior_priority": 1, "id": "numbering-answer-authority-bypass",
         "status": "PASS" if all(c["status"] == "PASS" for c in checks
                               if "authority" not in c["case"] and "numbering-only" not in c["case"])
         else "REVISE",
         "evidence": "Missing/null/forged/stale/continuation records reject before any answer iteration."},
        {"prior_priority": 2, "id": "numbering-only-edition-gate-skipped",
         "status": "PASS" if all(c["status"] == "PASS" for c in checks
                               if "numbering-only" in c["case"]) else "REVISE",
         "evidence": "Numbering-only current page metadata enters authority; binding tail rejects changed raw metadata."},
    ],
    "canonical_selection": canonical_selection,
    "checks": checks, "function_bindings": function_bindings, "references": references,
    "baseline_file_hashes": {
        "HEAD:lesson_answers.py": hashlib.sha256(head_answers.encode()).hexdigest(),
        "HEAD:assemble.py": hashlib.sha256(head_assembly.encode()).hexdigest()},
    "limits": [
        "AST-extracted helpers execute unchanged bodies; producer modules were not imported.",
        "Edition upstream load/merge/cut/split/figure-claim reconstruction was NOT run.",
        "Edition binding tail uses inherited candidate structure and numbering identity derived from current start-block ledger.",
        "cmd_prepare authority keyword wiring was checked statically, never executed.",
        "No full modern validation, mathematical answer content or full lesson approval.",
        "Earlier assembly25/answer8/edition51 receipts predate fixes and are NOT final-code coverage.",
        "Final seven-test receipt has stream hashes but no source code digest; current code is independently bound here.",
        "Parent owns affected shared tests and promotion gate; this is not promotion authorization.",
        "User B contains prior reports; candidate/stages/snapshots resolve under B.parent from prior references.",
    ],
    "controls": {"image_opens": 0, "suite_reruns": 0, "producer_reruns": 0,
                 "cmd_prepare_runs": 0, "tooling_resource_edits": 0,
                 "git_writes": 0, "DB_network_app_dependencies_publish": 0,
                 "agents_chats": 0, "writes": "new reports only in script directory",
                 "fixtures": "in-memory only", "all_commands_sole_cwd": True},
}
target = OUT / "helper-probes-FIRST.json"
with target.open("x", encoding="utf-8") as handle:
    handle.write(json.dumps(report, ensure_ascii=True, indent=2) + "\n")
print(json.dumps({"status": report["status"], "checks": len(checks),
                  "failures": [c for c in checks if c["status"] != "PASS"],
                  "report": str(target), "sha256": fingerprint(target)["sha256"]}, indent=2))
sys.exit(0 if report["status"] == "PASS" else 1)
