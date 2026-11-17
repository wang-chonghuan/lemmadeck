"""Read-only assertions for the affected 221 representation delta, not source acceptance."""
import hashlib
import importlib.util
import json
from pathlib import Path

root = Path(__file__).resolve().parents[5]
paths = {
    "contract": ".claude/skills/ld-s10y-lesson/tools/blocks.py",
    "before_md": ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-first-finalize/0221/page.md",
    "before_json": ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-first-finalize/0221/page.json",
    "before_audit": ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c220-221-first-finalize/0221/audit.json",
    "current_md": "ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0221/page.md",
}
pins = {
    "contract": "1b6540373067b80cdc34ab7973a26ccfc1b21b62f655139731f16408ea072b66",
    "before_md": "5e356bb1251af757dd08196b4d3608aaae5f9eb6696f00a1ee4972861b2c1f77",
    "before_json": "2b91f048039bcb36fffb98512672887e94b7eaebaffa8bf039678238204e22a6",
    "before_audit": "2b2aa35918257dc375c6aea90d94dd8530b88e5b31722a65dc8431424e10858f",
    "current_md": "d4c53c851288d8354a0f17cf8afd295583ead110bd6d02c817e908bc418d1855",
}
data = {key: (root / path).read_bytes() for key, path in paths.items()}
for key, value in data.items():
    assert hashlib.sha256(value).hexdigest() == pins[key], key
    print(f"SHA256 {key} {pins[key]}")

spec = importlib.util.spec_from_file_location("B", root / paths["contract"])
B = importlib.util.module_from_spec(spec)
spec.loader.exec_module(B)
before = data["before_md"].decode("utf-8")
current = data["current_md"].decode("utf-8")
old_meta, old_blocks = B.parse(before)
new_meta, new_blocks = B.parse(current)
assert json.loads(data["before_json"]) == {"meta": old_meta, "blocks": old_blocks}
audit = json.loads(data["before_audit"])
assert audit["page"] == 221
assert (audit["lines_md"], audit["lines_printed"]) == (25, 23)
assert len(audit["errors"]) == 1
assert "25" in audit["errors"][0] and "23" in audit["errors"][0]
assert audit["count_exclusions"] == []
print("Original retained MD/JSON agree; retained audit remains FAIL 25/23, exclusions=[].")

assert new_meta.keys() == old_meta.keys()
assert new_meta["notes"][:-1] == old_meta["notes"]
assert len(new_meta["notes"]) == len(old_meta["notes"]) + 1
assert all(new_meta[key] == old_meta[key] for key in old_meta if key != "notes")
note = new_meta["notes"][-1]
assert all(token in note for token in ("25/23", "906", "907", "LF", "samerow"))
note_insertion = ",\n    " + json.dumps(note, ensure_ascii=False)
assert current.count(note_insertion) == 1
assert before.count(B.WRAP + "\n") == 2
assert current.count(B.WRAP + "\n") == 0
assert current.replace(note_insertion, "", 1) == before.replace(B.WRAP + "\n", B.WRAP)
print("Exact byte delta: only two LF removals after existing WRAP + one appended failure note.")
print("All other body/frontmatter bytes unchanged, including printed_lines=25.")

equations = {
    "906": [r"\frac{x}{2}+\frac{3}{y}=\frac{3}{2}", r"\frac{2}{x}+\frac{y}{3}=3"],
    "907": [r"y^2+xy=15", r"x^2+xy=10"],
}
assert len(old_blocks) == len(new_blocks)
affected = []
for old, new in zip(old_blocks, new_blocks):
    if old["kind"] != "ex" or old["label"] not in equations:
        assert old == new
        continue
    label = old["label"]
    assert {key: value for key, value in old.items() if key != "lines"} == {
        key: value for key, value in new.items() if key != "lines"
    }
    assert len(old["lines"]) == 2 and len(new["lines"]) == 1
    assert old["lines"][0].endswith(r"\\" + B.WRAP)
    assert new["lines"] == ["".join(old["lines"])]
    formula = new["lines"][0].split("$")[1]
    assert formula.startswith(r"\begin{cases}") and formula.endswith(r"\end{cases}")
    rows = formula.removeprefix(r"\begin{cases}").removesuffix(r"\end{cases}")
    assert rows.split(r"\\" + B.WRAP) == equations[label]
    assert new["samerow"] == (label == "907")
    old_contribution = len(old["lines"]) + sum(line.count(B.WRAP) for line in old["lines"]) - int(old["samerow"])
    new_contribution = len(new["lines"]) + sum(line.count(B.WRAP) for line in new["lines"]) - int(new["samerow"])
    affected.append((label, old_contribution, new_contribution))
assert affected == [("906", 3, 2), ("907", 2, 1)]
print("Four retained equations, both cases braces, both LaTeX breaks/WRAP, and samerow unchanged.")
print("All 8 unaffected parsed blocks and all affected non-lines fields unchanged.")
rest = audit["lines_md"] - sum(old for _, old, _ in affected)
adjusted = rest + sum(new for _, _, new in affected)
assert (rest, adjusted) == (20, 23)
print("Text-contract arithmetic only: original affected 3+2=5; current 2+(2-1)=3.")
print("Unchanged remainder from retained FAIL: 25-5=20; adjusted representation: 20+3=23.")
for key, path in paths.items():
    assert (root / path).read_bytes() == data[key], f"changed during review: {key}"
print("Read inputs unchanged at command end; no source writes.")
print("PASS: affected representation delta only; no source/visual/counting/finalizer acceptance.")
