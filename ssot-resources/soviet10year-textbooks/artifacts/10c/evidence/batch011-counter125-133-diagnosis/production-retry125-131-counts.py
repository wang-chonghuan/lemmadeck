import hashlib
import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks as B

TICKET = REPO / ".intentfold/tickets/STEMROBIN-184/tmp"
PAGES = REPO / "ssot-resources/soviet10year-textbooks/artifacts/10c/pages"
OUTPUT = TICKET / "production-source125-131-count-retry"
PYTHON = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
PROPOSALS = json.loads((TICKET / "production-source125-133-count-diagnosis/proposed-exclusions.json").read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dump(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def now():
    return datetime.now(timezone.utc).isoformat()


assert not OUTPUT.exists(), "Do not rerun recorded failures"
OUTPUT.mkdir()
failed = False
for number in (125, 128, 129, 131):
    page = f"{number:04d}"
    proposal = PROPOSALS["pages"][str(number)]
    first = 122 if number == 125 else 126 if number < 130 else 130
    work = TICKET / f"production-source10c{first}-{first + 3}"
    native = work / f"10c/pages/{page}/page.png"
    durable = PAGES / page
    record = OUTPUT / page
    record.mkdir()
    before_json = json.loads((durable / "page.json").read_text())
    before_audit = json.loads((durable / "audit.json").read_text())
    before_meta, before_blocks = B.parse((durable / "page.md").read_text())
    old = TICKET / f"production-source125-131-before-count-metadata/{page}-page.md"
    old_meta, old_blocks = B.parse(old.read_text())
    assert before_blocks == old_blocks
    expected = dict(old_meta)
    expected["count_exclusions"] = proposal["count_exclusions_to_add"]
    assert before_meta == expected, f"{page}: unexpected metadata delta"
    assert sha(native) == proposal["source_sha256"]
    for filename in ("page.md", "page.json", "audit.json"):
        shutil.copy2(durable / filename, record / f"before-{filename}")
    inputs = {str(native): sha(native)}
    inputs.update({str(p): sha(p) for p in (native.parent / "figures").glob("*.png")})
    dump(record / "before-input-hashes.json", inputs)
    args = [str(PYTHON), "-B", str(TOOLS / "p2c.py"), "finalize",
            "--book", "10c", "--page", str(number), "--work", str(work)]
    started = now()
    result = subprocess.run(args, cwd=REPO, capture_output=True)
    dump(record / "command.json", {
        "args": args, "cwd": str(REPO), "started": started, "finished": now(),
        "exitCode": result.returncode,
    })
    (record / "stdout.txt").write_bytes(result.stdout)
    (record / "stderr.txt").write_bytes(result.stderr)
    for filename in ("page.md", "page.json", "audit.json"):
        shutil.copy2(durable / filename, record / filename)
    after_json = json.loads((durable / "page.json").read_text())
    after_audit = json.loads((durable / "audit.json").read_text())
    assert after_json["blocks"] == before_json["blocks"]
    assert after_json["meta"] == before_meta
    assert after_audit["figures"] == before_audit["figures"]
    after_inputs = {p: sha(Path(p)) for p in inputs}
    assert after_inputs == inputs
    dump(record / "after-input-hashes.json", after_inputs)
    summary = {
        "page": number, "exitCode": result.returncode,
        "lines_printed": after_audit["lines_printed"], "lines_md": after_audit["lines_md"],
        "errors": after_audit["errors"], "body_unchanged": True,
        "metadata_only_exact_proposal": True, "source_and_crops_unchanged": True,
        "figure_geometry_unchanged": True, "normalizations": after_audit["normalizations"],
    }
    dump(record / "delta-assertions.json", summary)
    print(json.dumps(summary, ensure_ascii=False), flush=True)
    failed |= result.returncode != 0
sys.exit(1 if failed else 0)
