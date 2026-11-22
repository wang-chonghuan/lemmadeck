import json
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-182-six-3129/lemmadeck")
assert Path.cwd() == ROOT
OUT = ROOT / ".tmp/ld-s10y-lesson/resume182-6-3129/local-repairs-FIRST"
for book, lesson in [("6a", "alg6-c2-s1-n8"), ("8a", "alg8-c3-s3-n20")]:
    directory = ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/{book}/editions/modern-us-neutral/lessons/{lesson}/choice-set"
    filename = directory / "seed.json"
    value = json.loads(filename.read_text())
    filename.write_text(json.dumps(value, ensure_ascii=True, indent=2) + "\n")
    if book != "6a":
        continue
    filename = directory / "review.json"
    value = json.loads(filename.read_text())
    (OUT / "expanded-review-before-format.json").write_bytes(filename.read_bytes())
    compact = lambda item: json.dumps(item, ensure_ascii=False, separators=(",", ":"))
    lines = ["{"]
    for index, (key, item) in enumerate(value.items()):
        suffix = "," if index + 1 < len(value) else ""
        if isinstance(item, list) and item:
            lines.append(f'  "{key}":[')
            lines.extend(f"    {compact(row)}{',' if at + 1 < len(item) else ''}"
                         for at, row in enumerate(item))
            lines.append(f"  ]{suffix}")
        else:
            lines.append(f'  "{key}":{compact(item)}{suffix}')
    lines.append("}")
    filename.write_text("\n".join(lines) + "\n")
print("Preserved seed ASCII encoding and compact review layout; semantic objects unchanged.")
