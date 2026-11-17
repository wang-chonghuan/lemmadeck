import datetime
import json
import shutil
import subprocess
from pathlib import Path

from diagnose import OUT, ROOT, TOOLS, PAGES, load_layout

layout_path = TOOLS / "layout.py"
test_path = TOOLS / "test_layout_carrier_rows.py"
layout = load_layout(layout_path)
before = json.loads((OUT / "before.json").read_text())
after = json.loads((OUT / "after-second.json").read_text())
assert layout.sha256_file(layout_path) == after["layout_sha256"], "Layout changed after source probe"
assert layout.sha256_file(OUT / "layout.before.py") == before["layout_sha256"]
for source, target in [
    (layout_path, OUT / "layout.after.py"),
    (test_path, OUT / "test_layout_carrier_rows.after.py"),
]:
    if target.exists():
        raise RuntimeError(f"Refuse to overwrite sealed bytes {target}")
    shutil.copy2(source, target)
diff = subprocess.run(
    ["git", "diff", "--", str(layout_path.relative_to(ROOT))],
    cwd=ROOT, capture_output=True, check=True,
)
(OUT / "layout.diff").write_bytes(diff.stdout)
protected = [
    {"path": path, "before_sha256": sha, "after_sha256": layout.sha256_file(Path(path)),
     "unchanged": sha == layout.sha256_file(Path(path))}
    for page in before["pages"] for path, sha in page["files_sha256"].items()
]
current_content = []
reviews = []
for group in sorted({group for group, _ in PAGES.values()}):
    reviews.extend(
        OUT.parent / f"production-source10c{group}-review" / name
        for name in ("source-first.md", "StageB.md", "ledger.md", "stageB-ledger.md")
    )
for page in PAGES:
    current_content.extend(
        ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/10c/pages/{page:04d}" / name
        for name in ("page.md", "page.json", "audit.json")
    )
commands = [
    json.loads(path.read_text()) | {"record": str(path.parent)}
    for path in sorted((OUT / "commands").glob("*/command.json"))
]
manifest = {
    "sealed_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "status": "HOLD; partial body/carrier repair, not all five reconciled",
    "layout_before_sha256": before["layout_sha256"],
    "layout_after_sha256": after["layout_sha256"],
    "test_sha256": layout.sha256_file(test_path),
    "source_inputs": protected,
    "current_content_and_reviews_observed_at_seal_only": [
        {"path": str(path), "sha256": layout.sha256_file(path)} for path in current_content + reviews
    ],
    "commands": commands,
    "owned_files": [str(layout_path), str(test_path)],
    "scratch_files_sha256": {
        str(path.relative_to(OUT)): layout.sha256_file(path)
        for path in sorted(OUT.rglob("*")) if path.is_file()
        and "__pycache__" not in path.parts
        and path.name != "manifest.json"
    },
    "image_events": 8,
    "finalize_run": False,
    "broad_suite_run": False,
}
(OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
print(json.dumps({
    "layout_before_sha256": manifest["layout_before_sha256"],
    "layout_after_sha256": manifest["layout_after_sha256"],
    "test_sha256": manifest["test_sha256"],
    "protected_files": len(protected),
    "protected_unchanged": all(item["unchanged"] for item in protected),
    "manifest": str(OUT / "manifest.json"),
}, indent=2))
