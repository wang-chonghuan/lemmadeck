import hashlib
import json
import runpy
import subprocess
import sys
from pathlib import Path

root = Path.cwd()
evidence = root / ".tmp/stemrobin-184-resume/n13-answer-child-streams"
assert not evidence.exists(), "Existing child streams protected"
evidence.mkdir()
original_run = subprocess.run
receipts = []

def captured_run(*args, **kwargs):
    result = original_run(*args, **kwargs)
    number = len(receipts) + 1
    streams = {}
    for name in ("stdout", "stderr"):
        value = getattr(result, name)
        if value is None:
            streams[name] = {"captured": False}
            continue
        data = value.encode("utf-8") if isinstance(value, str) else value
        file = evidence / f"child-{number}.{name}"
        with file.open("xb") as handle:
            handle.write(data)
        streams[name] = {
            "path": str(file.relative_to(root)), "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
            "fromCompletedProcess": True,
        }
    receipts.append({
        "command": result.args, "actualExit": result.returncode,
        "streams": streams, "resultReturnedUnmodified": True,
    })
    return result

subprocess.run = captured_run
target = root / ".claude/skills/ld-s10y-answer/tools/lesson_answers.py"
sys.path.insert(0, str(target.parent))
sys.argv = [
    str(target), "finalize", "--book", "9c",
    "--edition", "modern-us-neutral", "--lesson", "ana9-c3-s1-n13",
]
try:
    runpy.run_path(str(target), run_name="__main__")
finally:
    subprocess.run = original_run
    receipt = {
        "schema": "official-answer-finalizer-child-streams@1",
        "officialEntry": str(target.relative_to(root)),
        "officialEntrySha256": hashlib.sha256(target.read_bytes()).hexdigest(),
        "children": receipts, "producerReruns": 0,
        "contract": "Original subprocess.run and CompletedProcess returned unchanged; retain text=True captured streams as UTF-8.",
        "editorTransactionClaimed": False,
        "parentImages": "Permanent24/24;0newopens/payloads",
    }
    (evidence / "receipt.json").write_text(json.dumps(receipt, indent=2) + "\n")
