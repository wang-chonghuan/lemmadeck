"""Check source-bound draft geometry without rerunning the canonical validator."""

from pathlib import Path
import hashlib
import json
import math
import re


OWN = Path(__file__).resolve().parent
ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
EXPECTED = {
    56: {
        "grid": [-24, 7, 12, -5], "columns": 36, "rows": 12, "step": 1,
        "traces": {"a": (1.5, 2), "b": (-2, 2), "c": (-0.25, -3)},
        "visibleText": {"x", "y", "0", "a", "b", "c"},
    },
    57: {
        "grid": [-11, 7, 25, -5], "columns": 36, "rows": 12, "step": 1,
        "traces": {"a": (0.2, -2), "b": (-2, 1)},
        "visibleText": {"x", "y", "0", "a", "b"},
    },
    58: {"grid": [-4.5, 17.5, 4.5, -2.5], "columns": 18, "rows": 40, "step": 0.5},
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def main():
    assert Path.cwd() == ROOT
    receipt = OWN / "cap1-geometry-check-FIRST.json"
    assert not receipt.exists(), "Do not overwrite FIRST evidence"
    checks = []
    binding = load(OWN / "binding-FIRST.json")
    for entry in binding["frozenTemplates"]:
        assert digest(Path(entry["path"])) == entry["sha256"]
    for number, requirements in EXPECTED.items():
        figure = f"fig-{number}"
        spec = load(OWN / figure / "spec-draft-FIRST.json")
        context = load(OWN / figure / "context-FIRST.json")
        assert spec["source"]["authoritativeText"] == context["sourceAuthoritativeText"]
        assert digest(Path(spec["source"]["image"]["path"])) == spec["source"]["image"]["sha256"]
        objects = {obj["id"]: obj for obj in spec["objects"]}
        grid = objects["source-grid"]
        assert grid["bounds"] == requirements["grid"]
        assert grid["xStep"] == grid["yStep"] == requirements["step"]
        dimensions = next(item for item in spec["assertions"] if item["type"] == "gridDimensions")
        assert (dimensions["columns"], dimensions["rows"]) == (
            requirements["columns"], requirements["rows"])
        if number in (56, 57):
            visible = {obj["text"] for obj in spec["objects"] if obj["type"] == "text"}
            assert visible == requirements["visibleText"]
            assert all(obj.get("visible") is False for obj in spec["objects"] if obj["type"] == "point")
            for label, (slope, intercept) in requirements["traces"].items():
                trace = objects[f"source-trace-{label}"]
                start = objects[trace["from"]]["at"]
                end = objects[trace["to"]]["at"]
                assert trace["dash"] == 0
                assert math.isclose((end[1] - start[1]) / (end[0] - start[0]), slope, abs_tol=1e-10)
                assert all(math.isclose(y, slope * x + intercept, abs_tol=1e-10) for x, y in (start, end))
                xmin, ymax, xmax, ymin = requirements["grid"]
                for x, y in (start, end):
                    assert xmin <= x <= xmax and ymin <= y <= ymax
                    assert any(math.isclose(value, edge, abs_tol=1e-10) for value, edge in (
                        (x, xmin), (x, xmax), (y, ymin), (y, ymax)))
            checks.append({"figure": figure, "check": "actual-trace-endpoints-values-and-no-answer-labels", "status": "pass"})
        else:
            path = objects["source-parabola"]["d"]
            tokens = re.findall(r"[MQ]|[-+]?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?", path)
            assert len(tokens) == 13 and tokens[0] == "M" and tokens[3] == tokens[8] == "Q"
            start = [float(value) for value in tokens[1:3]]
            maximum_error = 0
            checked_intersections = set()
            for offset in (3, 8):
                control = [float(value) for value in tokens[offset + 1:offset + 3]]
                end = [float(value) for value in tokens[offset + 3:offset + 5]]
                for index in range(101):
                    t = index / 100
                    rawx, rawy = [
                        (1 - t) ** 2 * start[axis] + 2 * t * (1 - t) * control[axis] + t ** 2 * end[axis]
                        for axis in (0, 1)
                    ]
                    x, y = rawx - 5, 18 - rawy
                    maximum_error = max(maximum_error, abs(y - x * x))
                    assert -4.5 <= x <= 4.5 and -1e-9 <= y <= 17.5 + 1e-9
                for point_id in ("source-A", "source-B"):
                    x, y = objects[point_id]["at"]
                    t = (x + 5 - start[0]) / (end[0] - start[0])
                    if 0 <= t <= 1:
                        rawy = (1 - t) ** 2 * start[1] + 2 * t * (1 - t) * control[1] + t ** 2 * end[1]
                        assert math.isclose(18 - rawy, y, abs_tol=1e-9)
                        checked_intersections.add(point_id)
                start = end
            assert maximum_error < 1e-9 and checked_intersections == {"source-A", "source-B"}
            for label, coordinate in (("A", [-4, 16]), ("B", [2, 4])):
                assert objects[f"source-{label}"]["at"] == coordinate
                guide = objects[f"source-{label}-projection"]
                assert guide["from"] == f"source-{label}"
                assert guide["to"] == [coordinate[0], 0] and guide["dash"] == 2
            assert objects["source-line"]["from"] == [-4.5, 17]
            assert objects["source-line"]["to"] == [4.5, -1]
            assert objects["source-line"]["dash"] == objects["source-parabola"]["dash"] == 0
            checks.append({
                "figure": figure, "check": "serialized-quadratic-path-A-B-and-dashed-projections",
                "status": "pass", "maximumSerializedPathError": maximum_error,
            })
        checks.append({"figure": figure, "check": "frozen-text-source-hash-and-source-grid", "status": "pass"})
    with receipt.open("x", encoding="utf-8") as handle:
        handle.write(json.dumps({
            "status": "pass", "checks": checks, "canonicalValidatorReexecuted": False,
            "semanticApproval": False, "renderedInspection": False,
        }, indent=2) + "\n")
    entries = [
        {"path": str(path), "sha256": digest(path), "bytes": path.stat().st_size}
        for path in sorted(OWN.rglob("*")) if path.is_file()
    ]
    with (OWN / "hashes.json").open("x", encoding="utf-8") as handle:
        handle.write(json.dumps({
            "schema": "STEMROBIN-182/offline-author-hashes@1",
            "files": entries, "excludes": ["hashes.json (self-hash)"],
        }, indent=2) + "\n")
    print(json.dumps({"status": "pass", "checks": len(checks), "fileHashes": len(entries),
                      "hashManifest": str(OWN / "hashes.json")}))


if __name__ == "__main__":
    main()
