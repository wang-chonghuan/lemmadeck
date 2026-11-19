"""Read-only Stage1 binding, coverage and arithmetic verification."""

import argparse
from collections import Counter
from decimal import Decimal, ROUND_HALF_UP
import hashlib
import json
from pathlib import Path
import re
import stat
import xml.etree.ElementTree as ET


ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n39-choice-review"
SEED = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n39-choice-author/seed.json"
EXERCISES = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n39/exercises.json"


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical(value):
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode()
    ).hexdigest()


def dec(printed):
    return Decimal(printed.replace(",", "."))


def graph_roots(svg_path):
    ns = {"s": "http://www.w3.org/2000/svg"}
    root = ET.parse(svg_path).getroot()
    group = root.find("s:g[@id='ld-fig-55-raw-path-layer']", ns)
    assert group is not None
    path = group.find("s:path", ns)
    assert path is not None
    tokens = re.findall(r"[MC]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?", path.attrib["d"])
    assert tokens[0] == "M"
    current = (float(tokens[1]), float(tokens[2]))
    segments = []
    for i in range(3, len(tokens), 7):
        assert tokens[i] == "C"
        values = list(map(float, tokens[i + 1:i + 7]))
        assert len(values) == 6
        points = [current, tuple(values[:2]), tuple(values[2:4]), tuple(values[4:6])]
        assert all(points[j][0] <= points[j + 1][0] for j in range(3))
        segments.append(points)
        current = points[-1]
    assert len(segments) == 30
    assert segments[0][0] == (1.6, 6.1)
    assert segments[-1][-1] == (15.6, 1.6)

    def cubic(points, t, axis):
        return (
            (1 - t)**3 * points[0][axis]
            + 3 * (1 - t)**2 * t * points[1][axis]
            + 3 * (1 - t) * t**2 * points[2][axis]
            + t**3 * points[3][axis]
        )

    roots = []
    turns = []
    for i, points in enumerate(segments):
        # Verify each cubic's vertical controls respect its endpoint direction.
        direction = 1 if points[3][1] > points[0][1] else -1
        assert all(direction * (points[j + 1][1] - points[j][1]) >= 0 for j in range(3))
        if i and (
            (points[0][1] - segments[i - 1][0][1])
            * (points[3][1] - points[0][1]) < 0
        ):
            turns.append([points[0][0] - 7.6, 4.6 - points[0][1]])
        if (points[0][1] - 4.6) * (points[3][1] - 4.6) < 0:
            low, high = 0.0, 1.0
            for _ in range(60):
                mid = (low + high) / 2
                if (cubic(points, low, 1) - 4.6) * (cubic(points, mid, 1) - 4.6) <= 0:
                    high = mid
                else:
                    low = mid
            roots.append(cubic(points, (low + high) / 2, 0) - 7.6)
    assert len(roots) == 3
    assert len(turns) == 2
    for actual, expected in zip(turns, [[-2, 2], [2, -1]]):
        assert all(abs(a - b) < 1e-9 for a, b in zip(actual, expected))
    return roots


def run(expect_frozen):
    solutions = load(OWN / "source-solutions.json")
    bindings = load(OWN / "source-bindings.json")
    image = load(OWN / "image-observations.json")
    seed = load(SEED)
    assert canonical(seed) == solutions["seed_canonical_sha256"] == bindings["seed_canonical_sha256"]
    originals = load(EXERCISES)["exercises"]
    assert [(e["number"], e["text"], e["figure_refs"]) for e in originals] == [
        (e["number"], e["text"], e["figure_ids"]) for e in seed["exercises"]
    ]
    expected_counts = [18, 12, 6, 8, 8, 2, 1, 2, 4, 2, 2, 2, 4, 5]
    reviews = solutions["source_reviews"]
    assert [r["source_number"] for r in reviews] == [str(n) for n in range(806, 820)]
    assert [len(r["tasks"]) for r in reviews] == expected_counts
    tasks = [t for r in reviews for t in r["tasks"]]
    assert len(tasks) == len({t["id"] for t in tasks}) == 76
    kinds = Counter(t["kind"] for t in tasks)
    assert kinds == {"table": 49, "conditional": 8, "exact": 13, "concept": 1, "graph": 5}
    missing = {p["id"]: p["tasks"] for p in solutions["missing_premises"]}
    assert len(missing) == 4
    assert sorted(t["id"] for t in tasks if t["kind"] == "conditional") == sorted(
        task_id for ids in missing.values() for task_id in ids
    )

    for item in bindings["raw_input_bindings"]:
        assert sha(ROOT / item["path"]) == item["sha256"], item["path"]
    for item in [image["current_final_asset"], image["image_actually_opened"]]:
        assert sha(ROOT / item["path"]) == item["sha256"], item["path"]
    assert image["current_final_asset"]["sha256"] == seed["figures"][0]["assets"][0]["sha256"]
    assert image["image_ledger"]["images_loaded_into_context"] == 1

    cells = {c["id"]: c for c in bindings["source_cells"]}
    assert len(cells) == len(bindings["source_cells"]) == 58
    used = {cell_id for t in tasks for cell_id in t["bindings"]}
    assert used == set(cells)
    capture_cache = {}
    for cell in cells.values():
        number = cell["capture"]
        if number not in capture_cache:
            capture_cache[number] = load(ROOT / bindings["capture_root"] / f"capture-{number}.json")
        capture = capture_cache[number]
        records = [r for r in capture["records_in_request_address_order"] if r["id"] == cell["source_id"]]
        assert len(records) == 1
        record = records[0]
        assert record["status"] == "READ"
        assert capture["table"] == cell["table"]
        for field in ["row", "main", "corrections", "next_main"]:
            assert record[field] == cell[field], (cell["id"], field)

    def root_value(cell_id):
        cell = cells[cell_id]
        assert cell["table"] == "IV"
        coefficient = Decimal(cell_id[1:])
        digit = int(coefficient * (1000 if coefficient < 10 else 100)) % 10
        if coefficient < 10:
            row = (coefficient * 10 // 1) / 10
            assert cell["row"] == f"{row:.1f}".replace(".", ",")
            column = int(coefficient * 100) % 10
        else:
            assert cell["row"] == str(int(coefficient)) + ","
            column = int(coefficient * 10) % 10
        assert cell["main"]["column"] == str(column)
        value = dec(cell["main"]["printed"])
        if digit:
            correction = [c for c in cell["corrections"] if c["column"] == str(digit)]
            assert len(correction) == 1
            value += dec(correction[0]["printed"]) * Decimal("0.001")
        return value

    numeric_tasks = 0
    for task in tasks:
        if task["id"].split(".")[0] not in ["806", "807", "809", "810"]:
            continue
        cell_id = task["bindings"][0]
        value = root_value(cell_id)
        coefficient = Decimal(cell_id[1:])
        radicand = coefficient if task["kind"] == "conditional" else Decimal(task["input"])
        scales = [k for k in range(-12, 13) if coefficient * Decimal(10)**(2*k) == radicand]
        assert len(scales) == 1
        expected = task["conditional_result"] if task["kind"] == "conditional" else task["result"]
        assert value * Decimal(10)**scales[0] == Decimal(expected), task["id"]
        numeric_tasks += 1
    assert numeric_tasks == 46

    by_id = {t["id"]: t for t in tasks}
    assert root_value("r3.768") * 10 + root_value("r37.68") == Decimal(by_id["811.a"]["raw_table_arithmetic"])
    assert root_value("r8.234") * 100 - root_value("r82.34") * 10 == Decimal(by_id["811.b"]["raw_table_arithmetic"])
    assert root_value("r18") * root_value("r2") == Decimal("5.999602")
    assert root_value("r35").quantize(Decimal("0.01"), rounding=ROUND_HALF_UP) == Decimal(by_id["813.a"]["result"])
    assert root_value("r13.95") == Decimal(by_id["813.b"]["raw_table_arithmetic"]) == Decimal("3.735")
    assert root_value("r6.24").quantize(Decimal("0.01"), rounding=ROUND_HALF_UP) == Decimal("2.50")
    assert root_value("r71").quantize(Decimal("0.1"), rounding=ROUND_HALF_UP) == Decimal("8.4")
    square_a = dec(cells["square31.4"]["main"]["printed"]) * 100 + dec(cells["square27.1"]["main"]["printed"]) * 100
    square_b = dec(cells["square43.7"]["main"]["printed"]) * 100 - dec(cells["square21.6"]["main"]["printed"]) * 100
    assert square_a == Decimal("1720.4") and square_b == Decimal("1443.4")
    assert root_value("r17.20") * 10 == Decimal("41.47")
    assert root_value("r14.43") * 10 == Decimal("37.99")
    route_alternatives = {}
    for cell_id, digit in [("r66.38", "2"), ("r53.49", "1"), ("r37.68", "2")]:
        cell = cells[cell_id]
        correction = next(c for c in cell["corrections"] if c["column"] == digit)
        upper = dec(cell["next_main"]["printed"]) - dec(correction["printed"]) * Decimal("0.001")
        assert upper != root_value(cell_id)
        route_alternatives[cell_id] = {"lower_additive": str(root_value(cell_id)), "upper_deficit": str(upper)}
    roots = graph_roots(ROOT / image["current_final_asset"]["path"])
    assert all(abs(a-b) < 1e-9 for a, b in zip(roots, image["graph_values_used"]["approximate_zero_abscissae_from_current_svg_path"]))

    payload_names = ["source-solutions.json", "source-bindings.json", "image-observations.json", "stage1-check.py"]
    result = {
        "verification": "Stage1-only counts, bindings and stated arithmetic checked; NOT a semantic PASS",
        "originals": 14, "tasks": len(tasks), "per_original_counts": expected_counts,
        "task_kinds": dict(kinds), "source_cell_records_bound": len(cells),
        "numeric_root_tasks_recomputed_from_captured_cells": numeric_tasks,
        "unresolved_premise_groups": 4, "conditional_tasks": 8,
        "alternate_printed_routes": route_alternatives,
        "current_svg_crossings": roots,
        "payload_hashes": {name: sha(OWN / name) for name in payload_names},
        "no_views_or_keys_read": True
    }
    if expect_frozen:
        receipt = load(OWN / "stage1.receipt.json")
        manifest = load(OWN / "hashes.json")
        assert receipt["counts"]["originals"] == 14 and receipt["counts"]["tasks"] == 76
        assert receipt["payload_sha256"] == result["payload_hashes"]
        assert receipt["semantic_gate_outcome"] == "NOT_ISSUED"
        for item in manifest["files"]:
            path = OWN / item["path"]
            assert sha(path) == item["sha256"]
            if "canonical_sha256" in item:
                assert canonical(load(path)) == item["canonical_sha256"]
        for name in payload_names + ["stage1.receipt.json", "hashes.json"]:
            assert stat.S_IMODE((OWN / name).stat().st_mode) == 0o444, name
        result["freeze_verified"] = "6 files mode 0444; manifest and receipt hashes match"
        result["receipt_sha256"] = sha(OWN / "stage1.receipt.json")
        result["hash_manifest_sha256"] = sha(OWN / "hashes.json")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--expect-frozen", action="store_true")
    run(parser.parse_args().expect_frozen)
