"""Retain a new n19 snapshot after the already-approved book extension."""

import copy
from datetime import datetime, timezone
import importlib.util
import json
from pathlib import Path
import sys


REPO = Path(__file__).resolve().parents[4]
TICKET = Path(__file__).resolve().parent
OUTPUT = TICKET / "geo910-n19-choice-current-trace"
sys.path.insert(0, str(REPO / ".agents/skills/ld-s10y-choice/scripts"))
import prepare

spec = importlib.util.spec_from_file_location(
    "retained_scalars", TICKET / "rebind-choice-provenance-once.py"
)
scalars = importlib.util.module_from_spec(spec)
spec.loader.exec_module(scalars)


def record(path):
    return {"path": str(path), "sha256": prepare.file_hash(path)}


def exclusive(path, raw):
    with path.open("xb") as stream:
        stream.write(raw)


def main():
    assert not OUTPUT.exists(), "This snapshot is created once, without overwrites"
    OUTPUT.mkdir()
    names = ("seed", "draft")
    paths = {
        name: TICKET / f"geo910-n19-choice-{name}.json" for name in names
    }
    expected = {
        "seed": "387ab4aeea2bb091ca3e07ce97dfb23e0854c05e27eb4a5c826e2a499c1d3e96",
        "draft": "66177023f289c68af900d9d4da709e47da4b8cd6c7ec4292f1ca96580dbbda25",
    }
    raw = {name: path.read_bytes() for name, path in paths.items()}
    for name, path in paths.items():
        assert prepare.file_hash(path) == expected[name]
        exclusive(OUTPUT / f"before-{name}.json", raw[name])
    before = {name: json.loads(value) for name, value in raw.items()}
    seed = before["seed"]
    assert before["draft"]["seed_sha256"] == prepare.digest(seed)
    assembly_path = TICKET / "assembly-9g-p8-p76/promotion.json"
    assembly = prepare.load_json(assembly_path)
    assert assembly["status"] == "SOURCE_N20_CLOSED_N21_OPEN_ONLY"
    book_path = REPO / seed["trace"][0]["path"]
    old_book_path = TICKET / "assembly-9g-p8-p76/before-book.json"
    assert prepare.file_hash(old_book_path) == seed["trace"][0]["sha256"]
    current_book_hash = prepare.file_hash(book_path)
    assert current_book_hash == assembly["book"]["sha256"] == (
        "5b63a28aa65fe2ce87bf8ddb4a3c9dcb3eef85b572d42812ce84172e25a4b20d"
    )
    old_book, current_book = map(prepare.load_json, (old_book_path, book_path))
    old_item = next(x for x in old_book["lessons"] if x["id"] == seed["source"]["lesson"])
    current_item = next(
        x for x in current_book["lessons"] if x["id"] == seed["source"]["lesson"]
    )
    assert old_item == current_item, "The selected source unit must not change"
    checks = []
    for trace in seed["trace"][1:]:
        assert prepare.file_hash(REPO / trace["path"]) == trace["sha256"]
        checks.append(record(REPO / trace["path"]))
    for figure in seed["figures"]:
        for asset in figure["assets"]:
            assert prepare.file_hash(REPO / asset["path"]) == asset["sha256"]
            checks.append(record(REPO / asset["path"]))
    for item in assembly["protectedFiles"]:
        if "/geo910-c1-s2-n19/" in item["path"]:
            assert prepare.file_hash(REPO / item["path"]) == item["sha256"]
            checks.append(record(REPO / item["path"]))

    after = copy.deepcopy(before)
    after["seed"]["trace"][0]["sha256"] = current_book_hash
    after["draft"]["seed_sha256"] = prepare.digest(after["seed"])
    allowed = {"seed": ["/trace/0/sha256"], "draft": ["/seed_sha256"]}
    outputs = {}
    for name in names:
        assert scalars.differences(before[name], after[name]) == allowed[name]
        encoded = scalars.replace_json_scalars(raw[name], after[name], allowed[name])
        destination = OUTPUT / f"{name}.json"
        exclusive(destination, encoded)
        outputs[name] = dict(record(destination), canonical_sha256=prepare.digest(after[name]))
        reverse = scalars.replace_json_scalars(encoded, before[name], allowed[name])
        assert reverse == raw[name], "All bytes outside the authorized scalar are retained"
        assert paths[name].read_bytes() == raw[name], "Historical reviewed snapshot is immutable"
    assert before["draft"]["questions"] == after["draft"]["questions"]
    assert before["draft"]["coverage"] == after["draft"]["coverage"]
    assert before["draft"]["new_figures"] == after["draft"]["new_figures"]
    report = {
        "schema": "s10y-choice-n19-trace-only-snapshot-v1",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "TRACE_ONLY_NEW_SNAPSHOT_AWAITING_INDEPENDENT_CONFIRMATION",
        "inputs": [record(p) for p in paths.values()],
        "assembly": record(assembly_path),
        "before_book": record(old_book_path),
        "current_book": record(book_path),
        "book_structural_differences": scalars.differences(old_book, current_book),
        "selected_book_unit_identical": old_item,
        "unchanged_source_and_assets": checks,
        "exact_changed_fields": allowed,
        "all_other_bytes_and_semantic_leaves_unchanged": True,
        "outputs": outputs,
        "no_reseed_source_solve_math_gate_or_validator_run": True,
        "phase1_phase2_historical_freshness_hold_retained": True,
        "official_review": "Not yet created; Stage3 and trace-only confirmation required",
    }
    exclusive(OUTPUT / "report.json", (json.dumps(report, indent=2) + "\n").encode())
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        if OUTPUT.exists():
            exclusive(
                OUTPUT / "first-failure.json",
                (json.dumps({"error": str(error), "type": type(error).__name__}) + "\n").encode(),
            )
        raise
