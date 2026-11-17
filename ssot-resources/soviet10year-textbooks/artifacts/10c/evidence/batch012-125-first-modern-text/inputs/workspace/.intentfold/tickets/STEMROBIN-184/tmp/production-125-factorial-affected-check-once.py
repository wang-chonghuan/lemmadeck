import hashlib
import importlib.util
import json
from pathlib import Path
import sys
from datetime import datetime, timezone

root = Path.cwd()
tmp = root / ".intentfold/tickets/STEMROBIN-184/tmp"
out = tmp / "production-125-factorial-affected-check"
out.mkdir()
started = datetime.now(timezone.utc).isoformat()
tool = root / ".claude/skills/ld-s10y-lesson/tools/edition.py"
sys.path.insert(0, str(tool.parent))
spec = importlib.util.spec_from_file_location("edition_125_affected", tool)
edition = importlib.util.module_from_spec(spec)
spec.loader.exec_module(edition)
source = json.loads((tmp / "production-assembly10c125-corrected/10c/lessons/ana10-c9-s2-n125/lesson.json").read_text())
text = source["prose"][1]["text"]
result = edition.normalize_prose_layout(text)
assert "$n!$ 项的和" in result
assert edition.math_signature(result) == edition.math_signature(text)
assert edition.number_signature(result) == edition.number_signature(text)
cases = [
    ("阶乘 $n!$ 项的和．下一句话．", "阶乘 $n!$ 项的和．"),
    ("求 $5!$ 项的和．", "求 $5!$ 项的和．"),
    ("考虑 $k!$ 与 $n!$ 的乘积．", "考虑 $k!$ 与 $n!$ 的乘积．"),
]
for original, expected in cases:
    normalized = edition.normalize_prose_layout(original)
    assert expected in normalized
    assert edition.math_signature(normalized) == edition.math_signature(original)
outside = edition.normalize_prose_layout("第一句话！第二句话．")
assert outside == "第一句话！\n第二句话．"
receipt = {
    "scope": "Only affected new factorial prose boundary; no prior PASS review or finalizer rerun",
    "started": started, "finished": datetime.now(timezone.utc).isoformat(),
    "tool": str(tool), "tool_sha256": hashlib.sha256(tool.read_bytes()).hexdigest(),
    "actual125Normalized": result, "factorialCases": len(cases), "outsidePunctuation": outside,
    "mathAndNonMathNumbersUnchanged": True, "images": 0,
}
(out / "receipt.json").write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(receipt, ensure_ascii=False))
