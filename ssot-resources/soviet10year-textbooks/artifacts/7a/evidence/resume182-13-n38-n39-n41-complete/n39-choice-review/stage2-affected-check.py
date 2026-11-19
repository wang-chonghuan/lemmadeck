#!/usr/bin/env python3
"""Read-only affected snapshot checks; no author keys or preserved math solves."""

import argparse
import copy
import hashlib
import json
import re
import stat
from collections import Counter
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path


ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
BASE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13"
OWN = BASE / "n39-choice-review"
AUTHOR = BASE / "n39-choice-affected-author"
CHANGED = {"q01", "q02", "q04", "q05", "q23"}
INPUTS = {
    "reviewer-views.json": "238a3197888e51ca0c474c1b2324d0de348455ded9cc7ca3a31277adee68c3b4",
    "change-map.json": "5074c8d031262db4591a1093cedecd9820af9439d3fb3375c8286477448cebc1",
    "diff.json": "3ed5bc82483cf158c1c9f0303d881cd074da23c4efc13e7a4cbf5cf313ab5abe",
    "preservation-proof.json": "637453c3b497336184d19eb30069c02c95e873a0f9fb25bf08735338e7738a0a",
}
FIRST_VIEWS = "c4a516e4da1e052b7fb502b21e5d1bd2759b3901c4021f853a6c0a23ead68441"
CURRENT_VIEWS = "7979e863659ddbe17796af2342b2aa136a4e9596982588b7ac9cc5f78ca7dab7"
NEW_FILES = [
    "stage2-affected-fidelity.json",
    "stage2-affected-transport.json",
    "stage2-affected-mathematics.json",
    "stage2-affected-check.py",
    "stage2-affected.receipt.json",
    "stage2-affected-hashes.json",
]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(path):
    return json.loads(path.read_bytes())


def digest(value):
    data = json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def frozen(path):
    assert stat.S_IMODE(path.stat().st_mode) == 0o444, path.name


def verify_manifest(name, expected):
    path = OWN / name
    assert sha(path) == expected, name
    frozen(path)
    manifest = read(path)
    for item in manifest["files"]:
        target = OWN / item["path"]
        assert sha(target) == item["sha256"], item["path"]
        if "canonical_sha256" in item:
            assert digest(read(target)) == item["canonical_sha256"]
        frozen(target)
    return manifest


def at(value, parts):
    for part in parts:
        value = value[int(part)] if isinstance(value, list) else value[part]
    return value


def normalize(view):
    return {
        "mode": view["mode"],
        "stem": view["stem"],
        "figure_ids": view["figure_ids"],
        "options": sorted(
            [{"text": o["text"], "figure_ids": o["figure_ids"]} for o in view["options"]],
            key=digest,
        ),
    }


def tuples(text):
    return [
        [Decimal(n.strip()) for n in group.split(",")]
        for group in re.findall(r"\$\(([^)]*)\)\$", text)
    ]


def decimals(values):
    return [Decimal(n) for n in values]


def report(values, place):
    return [n.quantize(Decimal(place), rounding=ROUND_HALF_UP) for n in values]


def main(expect_frozen):
    verify_manifest("hashes.json", "9305f49efcc37c4f0fd5724677dfa40de93d3ef6197c0327f25446faa1d013d6")
    verify_manifest("stage2-hashes.json", "92fcd210d367251a313691aa3be9b3c104f50a2ca78d408591539fe1a0fabe04")
    for name, expected in INPUTS.items():
        assert sha(AUTHOR / name) == expected, name
    views = read(AUTHOR / "reviewer-views.json")
    assert digest(views) == CURRENT_VIEWS
    assert len(views) == 24
    assert [q["id"] for q in views] == [f"q{i:02d}" for i in range(1, 25)]
    for q in views:
        assert set(q) == {"id", "view"}
        assert set(q["view"]) == {"mode", "stem", "figure_ids", "options"}
        for option in q["view"]["options"]:
            assert set(option) == {"id", "text", "figure_ids"}
    assert sum(len(q["view"]["options"]) for q in views) == 81
    assert Counter(q["view"]["mode"] for q in views) == {"single": 20, "multiple": 4}

    # Reconstruct only learner-facing FIRST data; never traverse key/intent diffs.
    first = copy.deepcopy(views)
    diff = read(AUTHOR / "diff.json")
    differences = [d for d in diff["differences"] if "/view/" in d["pointer"]]
    assert len(differences) == 42
    for d in differences:
        parts = d["pointer"].split("/")[1:]
        assert parts[0] == "questions" and parts[2] == "view"
        idx = int(parts[1])
        path = parts[2:]
        assert at(views[idx], path) == d["after"]
        parent = at(first[idx], path[:-1])
        key = int(path[-1]) if isinstance(parent, list) else path[-1]
        parent[key] = copy.deepcopy(d["before"])
    assert digest(first) == FIRST_VIEWS

    old_math = {q["question_id"]: q for q in read(OWN / "stage2-mathematics.json")["question_reviews"]}
    old_fidelity = read(OWN / "stage2-fidelity.json")
    tasks = [t for q in old_fidelity["question_reviews"] for t in q["inferred_source_tasks"]]
    assert len(tasks) == len(set(tasks)) == 76
    assert {t.split(".")[0] for t in tasks} == {str(n) for n in range(806, 820)}
    transport = read(OWN / "stage2-affected-transport.json")
    transported = {q["question_id"]: q for q in transport["records"]}
    assert set(transported) == {q["id"] for q in views} - CHANGED
    change_map = read(AUTHOR / "change-map.json")
    maps = change_map["questions"]
    assert change_map["scope"] == ["q01", "q02", "q04", "q05", "q23"]
    kinds = Counter()
    truths = {}
    for current, previous, mapping in zip(views, first, maps):
        qid = current["id"]
        assert qid == previous["id"] == mapping["question_id"]
        kinds[mapping["kind"]] += 1
        if qid in CHANGED:
            assert mapping["kind"] == "affected_content_replacement"
            if qid != "q23":
                stem = current["view"]["stem"]
                old_stem = previous["view"]["stem"]
                assert stem[stem.index("| Row N |"):] == old_stem[old_stem.index("| Row N |"):]
            continue
        entries = mapping["option_map"]
        count = len(current["view"]["options"])
        assert {e["input_position"] for e in entries} == set(range(1, count + 1))
        assert {e["output_position"] for e in entries} == set(range(1, count + 1))
        assert {e["input_id"] for e in entries} == {o["id"] for o in previous["view"]["options"]}
        assert {e["output_id"] for e in entries} == {o["id"] for o in current["view"]["options"]}
        inverse = copy.deepcopy(current["view"])
        inverse["options"] = []
        for entry in sorted(entries, key=lambda e: e["input_position"]):
            option = current["view"]["options"][entry["output_position"] - 1]
            assert option["id"] == entry["output_id"]
            assert hashlib.sha256(option["text"].encode()).hexdigest() == entry["text_sha256"]
            option = copy.deepcopy(option)
            option["id"] = entry["input_id"]
            inverse["options"].append(option)
        assert inverse == previous["view"]
        assert normalize(current["view"]) == normalize(previous["view"])
        is_exact = mapping["kind"] == "exact_question_reuse"
        assert (current == previous) == is_exact
        record = transported[qid]
        id_map = {e["input_id"]: e["output_id"] for e in entries}
        old = old_math[qid]
        option_truths = {id_map[o["option_id"]]: o["truth"] for o in old["option_checks"]}
        assert record["FIRST_to_current_option_ids"] == id_map
        assert record["FIRST_correct"] == old["correct"]
        assert record["correct"] == sorted(id_map[c] for c in old["correct"])
        assert record["truths"] == option_truths
        assert record["kind"] == ("exact" if is_exact else "id_order_only")
        assert record["inverse_full_view_equal"] is True
        truths[qid] = option_truths
    assert kinds == {"affected_content_replacement": 5, "exact_question_reuse": 10, "option_order_id_remap_only": 9}
    assert sum(len(t) for t in truths.values()) == 64
    assert sum(sum(t.values()) for t in truths.values()) == 25

    fidelity_path = OWN / "stage2-affected-fidelity.json"
    frozen(fidelity_path)
    fidelity = read(fidelity_path)
    assert {q["question_id"] for q in fidelity["question_reviews"]} == CHANGED
    math = read(OWN / "stage2-affected-mathematics.json")
    assert math["fidelity_sha256"] == sha(fidelity_path)
    fresh = {q["question_id"]: q for q in math["changed_question_reviews"]}
    assert set(fresh) == CHANGED
    current = {q["id"]: q["view"] for q in views}
    raw = {
        "q01": decimals(["2.074", "2.490", "2.983", "3.162", "7.071", "8.660"]),
        "q02": decimals(["1.118", "3.834", "4.561", "6.332", "9.121"]),
        "q04": decimals(["1.000", "2.613", "4.483"]),
        "q05": decimals(["2.258", "2.449", "6.928", "1.439", "5.612", "7.403"]),
    }
    originals = decimals(["1.0058", "6.83251", "20.156"])
    args4 = [n.quantize(Decimal(1).scaleb(n.adjusted() - 3), rounding=ROUND_HALF_UP) for n in originals]
    roots4 = [n + c / 1000 for n, c in zip(raw["q04"], decimals(["3", "1", "7"]))]
    args2 = [
        Decimal(row) + Decimal(col) * (Decimal("0.01") if Decimal(row) < 10 else Decimal("0.1"))
        for row, col in [("1.2", "5"), ("14", "7"), ("20", "8"), ("40", "1"), ("83", "2")]
    ]
    expected = {
        "q01": [raw["q01"], report(raw["q01"], "0.1")],
        "q02": [args2, raw["q02"], report(raw["q02"], "0.01")],
        "q04": [args4, roots4],
        "q05": [raw["q05"], report(raw["q05"], "0.01")],
    }
    for qid, vectors in expected.items():
        record = fresh[qid]
        assert decimals(record["expected_table_values"]) == vectors[-2 if qid != "q04" else -1]
        if "expected_reports" in record:
            assert decimals(record["expected_reports"]) == vectors[-1]
        if "expected_arguments" in record:
            assert decimals(record["expected_arguments"]) == vectors[0]
        truths[qid] = {o["id"]: tuples(o["text"]) == vectors for o in current[qid]["options"]}

    graph = read(OWN / "image-observations.json")["graph_values_used"]
    assert graph["approximate_zero_abscissae_from_pixels"] == [-4.0, 0.6, 3.0]
    assert graph["endpoints_from_graph"] == [[-6, -1.5], [8, 3]]
    assert abs(graph["approximate_zero_abscissae_from_current_svg_path"][1] - 0.6) < 0.05
    graph_text = (
        r"Readings $\alpha\approx-4,\beta\approx0.6,\gamma\approx3$; "
        r"zeros $\{\alpha,\beta,\gamma\}$; "
        r"negative $[-6,\alpha)\cup(\beta,\gamma)$; "
        r"positive $(\alpha,\beta)\cup(\gamma,8]$."
    )
    truths["q23"] = {o["id"]: o["text"] == graph_text for o in current["q23"]["options"]}
    for qid, record in fresh.items():
        options = current[qid]["options"]
        assert [o["option_id"] for o in record["option_checks"]] == [o["id"] for o in options]
        assert {o["option_id"]: o["truth"] for o in record["option_checks"]} == truths[qid]
        assert all(o["evidence"].strip() for o in record["option_checks"])
        assert record["correct"] == sorted(k for k, v in truths[qid].items() if v)
    assert sum(len(q["option_checks"]) for q in fresh.values()) == 17
    sets = {q["question_id"]: q for q in math["whole_package_true_sets"]}
    assert set(sets) == set(current)
    positions = Counter()
    for qid, view in current.items():
        record = sets[qid]
        assert set(truths[qid]) == {o["id"] for o in view["options"]}
        assert record["correct"] == sorted(k for k, v in truths[qid].items() if v)
        assert record["basis"] == ("fresh" if qid in CHANGED else "transport")
        if view["mode"] == "single":
            assert len(record["correct"]) == 1
            positions.update(record["correct"])
    assert sum(sum(t.values()) for t in truths.values()) == 30
    assert sum(len(t) - sum(t.values()) for t in truths.values()) == 51
    assert math["post_solution_position_assessment"]["single_question_position_counts"] == positions
    first14 = ",".join(sets[f"q{i:02d}"]["correct"][0] for i in range(1, 15))
    assert first14 == math["post_solution_position_assessment"]["affected_q01_q14"]
    assert first14 != math["post_solution_position_assessment"]["FIRST_q01_q14"]
    if expect_frozen:
        manifest = read(OWN / "stage2-affected-hashes.json")
        assert {i["path"] for i in manifest["files"]} == set(NEW_FILES) - {"stage2-affected-hashes.json"}
        for entry in manifest["files"]:
            path = OWN / entry["path"]
            assert sha(path) == entry["sha256"]
            if "canonical_sha256" in entry:
                assert digest(read(path)) == entry["canonical_sha256"]
        for name in NEW_FILES:
            frozen(OWN / name)
        receipt = read(OWN / "stage2-affected.receipt.json")
        assert receipt["input_sha256"] == INPUTS
        assert receipt["payload_sha256"] == {
            name: sha(OWN / name) for name in NEW_FILES[:4]
        }
        assert receipt["counts"]["options"] == 81
        assert receipt["overall_semantic_PASS"] is False
    files = []
    for name in NEW_FILES:
        path = OWN / name
        if path.exists():
            item = {"path": name, "sha256": sha(path)}
            if name.endswith(".json"):
                item["canonical_sha256"] = digest(read(path))
            files.append(item)
    print(json.dumps({
        "result": "affected mechanical checks verified; not semantic or canonical-key approval",
        "FIRST_eleven_files_preserved_0444": True,
        "questions": 24, "options": 81, "original_tasks": 76,
        "fresh_option_checks": 17, "transported_option_checks": 64,
        "true": 30, "false": 51, "inverse_view_differences": 42,
        "exact_views": 10, "id_order_only_views": 9,
        "first14_positions": first14, "single_position_counts": dict(positions),
        "files": files,
    }, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--expect-frozen", action="store_true")
    main(parser.parse_args().expect_frozen)
