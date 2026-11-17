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
OUTPUT = TICKET / "production-source110-121-count-retry-after-preflight-fix"
PYTHON = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
SUPPORTED = {
    110: ("scan-artifact", [107, 2479, 438, 4]),
    114: ("scan-artifact", [16, 2474, 1586, 40]),
    117: ("separator-rule", [245, 1986, 483, 8]),
    121: ("scan-artifact", [17, 823, 15, 15]),
}


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def dump(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n",
                    encoding="utf-8")


def now():
    return datetime.now(timezone.utc).isoformat()


assert not OUTPUT.exists(), "Preserve the original retry record"
OUTPUT.mkdir()
failed = False
for number in (110, 114, 117, 118, 121):
    page = f"{number:04d}"
    first = 110 if number <= 113 else 114 if number <= 117 else 118
    work = TICKET / f"production-source10c{first}-{first + 3}"
    native = work / f"10c/pages/{page}/page.png"
    crop_dir = native.parent / "figures"
    durable = PAGES / page
    record = OUTPUT / page
    record.mkdir()
    before_json = read_json(durable / "page.json")
    before_audit = read_json(durable / "audit.json")
    before_meta, before_blocks = B.parse((durable / "page.md").read_text(encoding="utf-8"))
    if number in SUPPORTED:
        old = TICKET / f"production-source110-121-before-count-metadata/{page}-page.md"
        old_meta, old_blocks = B.parse(old.read_text(encoding="utf-8"))
        assert before_blocks == old_blocks, f"{page}: changed body"
        expected = dict(old_meta)
        expected["notes"] = before_meta["notes"]
        expected["count_exclusions"] = before_meta["count_exclusions"]
        if number in (110, 121):
            assert len(before_meta["notes"]) == len(old_meta["notes"])
            assert before_meta["notes"][:-1] == old_meta["notes"][:-1]
        else:
            assert len(before_meta["notes"]) == len(old_meta["notes"]) + 1
            assert before_meta["notes"][:-1] == old_meta["notes"]
        assert len(before_meta["count_exclusions"]) == 1
        entry = before_meta["count_exclusions"][0]
        kind, box = SUPPORTED[number]
        assert entry["kind"] == kind and entry["box"] == box and entry["reason"]
        assert before_meta == expected, f"{page}: unexpected metadata change"
    for filename in ("page.md", "page.json", "audit.json"):
        shutil.copy2(durable / filename, record / f"before-{filename}")
    inputs = {str(native): sha(native)}
    inputs.update({str(p): sha(p) for p in crop_dir.glob("*.png")})
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
    after_json = read_json(durable / "page.json")
    after_audit = read_json(durable / "audit.json")
    assert after_json["blocks"] == before_json["blocks"], f"{page}: changed JSON body"
    assert after_json["meta"] == before_meta, f"{page}: unexpected finalization metadata"
    assert after_audit["figures"] == before_audit["figures"], f"{page}: changed crop geometry"
    after_inputs = {p: sha(Path(p)) for p in inputs}
    assert after_inputs == inputs, f"{page}: source/crop bytes changed"
    dump(record / "after-input-hashes.json", after_inputs)
    summary = {
        "page": number, "exitCode": result.returncode,
        "lines_printed": after_audit["lines_printed"],
        "lines_md": after_audit["lines_md"],
        "errors": after_audit["errors"],
        "body_unchanged": True, "source_and_crops_unchanged": True,
        "figure_geometry_unchanged": True,
        "normalizations": after_audit["normalizations"],
    }
    dump(record / "delta-assertions.json", summary)
    print(json.dumps(summary, ensure_ascii=False), flush=True)
    failed |= result.returncode != 0
sys.exit(1 if failed else 0)
