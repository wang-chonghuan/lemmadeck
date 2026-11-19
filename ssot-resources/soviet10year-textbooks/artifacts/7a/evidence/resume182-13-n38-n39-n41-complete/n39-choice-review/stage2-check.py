"""Read-only view snapshot, frozen evidence and Stage2 record checks."""

import argparse
from collections import Counter
from decimal import Decimal, ROUND_HALF_UP
import hashlib
import json
from pathlib import Path
import stat


ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n39-choice-review"
VIEWS = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n39-choice-author/reviewer-views.json"
VIEWS_SHA = "70442a952f8f34d5a251f79e44e95a59d590c6e186d83910ddedc6d2418f9c8f"
STAGE1_MANIFEST_SHA = "9305f49efcc37c4f0fd5724677dfa40de93d3ef6197c0327f25446faa1d013d6"


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical(value):
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode()
    ).hexdigest()


def decimal(value):
    return Decimal(value.rstrip(",").replace(",", "."))


def entry(value):
    column, printed = value.split(":", 1)
    return column.strip(), decimal(printed.strip())


def run(expect_frozen):
    assert sha(VIEWS) == VIEWS_SHA
    views = load(VIEWS)
    assert canonical(views) == "c4a516e4da1e052b7fb502b21e5d1bd2759b3901c4021f853a6c0a23ead68441"
    # Hash the Stage1 freeze; do not run its full source arithmetic checker.
    assert sha(OWN / "hashes.json") == STAGE1_MANIFEST_SHA
    first_manifest = load(OWN / "hashes.json")
    for item in first_manifest["files"]:
        path = OWN / item["path"]
        assert sha(path) == item["sha256"]
        assert stat.S_IMODE(path.stat().st_mode) == 0o444
    assert stat.S_IMODE((OWN / "hashes.json").stat().st_mode) == 0o444
    cells = load(OWN / "source-bindings.json")["source_cells"]
    graph = load(OWN / "image-observations.json")
    fidelity = load(OWN / "stage2-fidelity.json")
    math = load(OWN / "stage2-mathematics.json")
    assert stat.S_IMODE((OWN / "stage2-fidelity.json").stat().st_mode) == 0o444
    assert sha(OWN / "stage2-fidelity.json") == math["fidelity_sha256"]
    assert fidelity["views_sha256"] == math["views_sha256"] == VIEWS_SHA
    assert fidelity["stage1_receipt_sha256"] == sha(OWN / "stage1.receipt.json")
    ids = [q["id"] for q in views]
    assert ids == [f"q{i:02d}" for i in range(1, 25)]
    assert ids == [q["question_id"] for q in fidelity["question_reviews"]]
    assert ids == [q["question_id"] for q in math["question_reviews"]]

    total_options = 0
    total_true = 0
    true_sets = {}
    for question, review in zip(views, math["question_reviews"]):
        assert set(question) == {"id", "view"}
        assert set(question["view"]) == {"mode", "stem", "figure_ids", "options"}
        view = question["view"]
        option_ids = [o["id"] for o in view["options"]]
        assert len(option_ids) == len(set(option_ids))
        assert option_ids == [c["option_id"] for c in review["option_checks"]]
        assert review["mode"] == view["mode"]
        truth = [c["option_id"] for c in review["option_checks"] if c["truth"]]
        assert truth == review["correct"]
        assert truth and set(truth) <= set(option_ids)
        if view["mode"] == "single":
            assert len(truth) == 1
        else:
            assert view["mode"] == "multiple"
        for check in review["option_checks"]:
            assert isinstance(check["truth"], bool)
            assert len(check["evidence"]) > 20
        assert review["status"] == "independently_solved"
        total_options += len(option_ids)
        total_true += len(truth)
        true_sets[question["id"]] = truth
    assert total_options == 79 and total_true == 30
    assert math["counts"] == {
        "views": 24, "options": 79, "true_options": 30, "false_options": 49,
        "determinate_views": 24, "key_compared_views": 0
    }
    revisions = [
        q["question_id"] for q in fidelity["question_reviews"]
        if any(q[field]["verdict"] == "revise" for field in ["task_fidelity", "redundancy", "answer_leakage"])
    ]
    assert revisions == ["q01", "q02", "q04", "q05", "q23"]

    def matches_source(row):
        candidates = [
            c for c in cells
            if c["table"] == row["table"]
            and decimal(c["row"]) == row["row"]
            and (c["main"]["column"], decimal(c["main"]["printed"])) == row["main"]
        ]
        for candidate in candidates:
            corrections = {(c["column"], decimal(c["printed"])) for c in candidate["corrections"]}
            if not set(row["corrections"]) <= corrections:
                continue
            if row["next_main"] is not None:
                nxt = candidate["next_main"]
                if nxt is None or (nxt["column"], decimal(nxt["printed"])) != row["next_main"]:
                    continue
            return True
        return False

    # Parse only the disclosed view tables and compare numeric cells to frozen observations.
    table_rows = {}
    row_count = 0
    for question in views:
        rows = []
        table = None
        for line in question["view"]["stem"].splitlines():
            if line.startswith("Table III ("):
                table = "III"
            elif line.startswith("Table IV ("):
                table = "IV"
            if not line.startswith("|") or line.startswith("| Row") or line.startswith("| ---"):
                continue
            parts = [p.strip() for p in line.strip("|").split("|")]
            assert len(parts) == 4 and table in ["III", "IV"]
            row = {
                "table": table, "row": decimal(parts[0]), "main": entry(parts[1]),
                "corrections": [] if parts[2] == "-" else [entry(s.strip()) for s in parts[2].split(";")],
                "next_main": None if parts[3] == "-" else entry(parts[3])
            }
            assert matches_source(row), (question["id"], row)
            rows.append(row)
            row_count += 1
        table_rows[question["id"]] = rows
    assert row_count == 61

    def root_at(qid, coefficient):
        value = Decimal(coefficient)
        scale = 100 if value >= 10 else 1000
        digit = int(value * scale) % 10
        base = value - Decimal(digit) / scale
        for row in table_rows[qid]:
            if row["table"] != "IV":
                continue
            argument = row["row"] + Decimal(row["main"][0]) * (
                Decimal("0.1") if row["row"] >= 10 else Decimal("0.01")
            )
            if argument == base:
                result = row["main"][1]
                if digit:
                    correction = next(v for c, v in row["corrections"] if c == str(digit))
                    result += correction * Decimal("0.001")
                return result
        raise AssertionError((qid, coefficient))

    view_by_id = {q["id"]: q["view"] for q in views}
    assert "first round each radicand to four significant figures" in view_by_id["q04"]["stem"]
    processed = [v.quantize(step, rounding=ROUND_HALF_UP) for v, step in [
        (Decimal("1.0058"), Decimal("0.001")),
        (Decimal("6.83251"), Decimal("0.001")),
        (Decimal("20.156"), Decimal("0.01"))
    ]]
    assert processed == [Decimal("1.006"), Decimal("6.833"), Decimal("20.16")]
    assert [root_at("q04", str(v)) for v in processed] == [Decimal("1.003"), Decimal("2.614"), Decimal("4.490")]
    assert all("keep the table numbers through" in view_by_id[qid]["stem"] for qid in ["q13", "q14"])
    total = root_at("q13", "3.768") * 10 + root_at("q13", "37.68")
    difference = root_at("q14", "8.234") * 100 - root_at("q14", "82.34") * 10
    assert total == Decimal("25.549") and difference == Decimal("196.26")
    assert total.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP) == Decimal("25.55")
    assert difference.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP) == Decimal("196.3")
    assert root_at("q15", "2") * (root_at("q15", "75") / 5) == Decimal("2.449048")
    assert root_at("q15", "6") == Decimal("2.449")
    assert "positive halfway cases rounded upward" in view_by_id["q16"]["stem"]
    assert root_at("q16", "13.95") == Decimal("3.735")
    assert root_at("q16", "13.95").quantize(Decimal("0.01"), rounding=ROUND_HALF_UP) == Decimal("3.74")
    assert root_at("q16", "35").quantize(Decimal("0.01"), rounding=ROUND_HALF_UP) == Decimal("5.92")
    assert "without further rounding" in view_by_id["q17"]["stem"]
    assert root_at("q17", "18") * root_at("q17", "2") == Decimal("5.999602")
    assert root_at("q18", "6.24").quantize(Decimal("0.01"), rounding=ROUND_HALF_UP) == Decimal("2.50")
    assert root_at("q18", "71").quantize(Decimal("0.1"), rounding=ROUND_HALF_UP) == Decimal("8.4")
    for qid in ["q19", "q20"]:
        assert "round that radicand to four significant figures" in view_by_id[qid]["stem"]
        assert "then report three significant figures" in view_by_id[qid]["stem"]
    squares_a = [row["main"][1] * 100 for row in table_rows["q19"] if row["table"] == "III"]
    squares_b = [row["main"][1] * 100 for row in table_rows["q20"] if row["table"] == "III"]
    assert squares_a == [Decimal("986.0"), Decimal("734.4")]
    assert squares_b == [Decimal("1910"), Decimal("466.6")]
    assert sum(squares_a) == Decimal("1720.4")
    assert squares_b[0] - squares_b[1] == Decimal("1443.4")
    assert root_at("q19", "17.20") * 10 == Decimal("41.47")
    assert root_at("q20", "14.43") * 10 == Decimal("37.99")
    assert graph["graph_values_used"]["endpoints_from_graph"] == [[-6, -1.5], [8, 3]]
    assert view_by_id["q23"]["figure_ids"] == view_by_id["q24"]["figure_ids"] == ["fig-55"]
    assert Counter(q["view"]["mode"] for q in views) == {"single": 20, "multiple": 4}
    assert math["canonical_key_disclosure"] == "NOT_READ"
    payload_names = ["stage2-fidelity.json", "stage2-mathematics.json", "stage2-check.py"]
    result = {
        "verification": "Read-only Stage2 record consistency, numeric excerpt bindings and selected view calculations; NOT a semantic PASS or canonical-key comparison",
        "views": 24, "options_checked_with_individual_evidence": 79,
        "true_options": 30, "false_options": 49,
        "view_table_rows_bound_to_frozen_primary_observations": row_count,
        "view_fidelity_revisions": revisions,
        "complete_independent_true_sets": true_sets,
        "authored_context_resolves_stage1_premise_groups_for_views_only": 4,
        "stage1_unchanged": True,
        "new_image_opens": 0, "full_source_resolve": False,
        "canonical_key_reads": 0,
        "payload_sha256": {name: sha(OWN / name) for name in payload_names}
    }
    if expect_frozen:
        receipt = load(OWN / "stage2.receipt.json")
        manifest = load(OWN / "stage2-hashes.json")
        assert receipt["payload_sha256"] == result["payload_sha256"]
        assert receipt["views_sha256"] == VIEWS_SHA
        assert receipt["canonical_key_disclosure"] == "NOT_READ"
        assert receipt["semantic_gate_outcome"] == "NOT_ISSUED"
        for item in manifest["files"]:
            path = OWN / item["path"]
            assert sha(path) == item["sha256"]
            if "canonical_sha256" in item:
                assert canonical(load(path)) == item["canonical_sha256"]
        for name in payload_names + ["stage2.receipt.json", "stage2-hashes.json"]:
            assert stat.S_IMODE((OWN / name).stat().st_mode) == 0o444, name
        result["freeze_verified"] = "Five Stage2 files 0444; all six Stage1 files unchanged and 0444"
        result["stage2_receipt_sha256"] = sha(OWN / "stage2.receipt.json")
        result["stage2_hash_manifest_sha256"] = sha(OWN / "stage2-hashes.json")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--expect-frozen", action="store_true")
    run(parser.parse_args().expect_frozen)
