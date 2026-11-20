import json
import sys
from pathlib import Path

repo = Path(sys.argv[1])
sys.path.insert(0, str(repo / ".claude/skills/ld-s10y-lesson/tools"))
from edition import math_signature, number_signature, validate_text

errors = []
targets = []
for filename, key in ((sys.argv[2], "prose"), (sys.argv[3], "exercises")):
    document = json.loads(Path(filename).read_text(encoding="utf-8"))
    for index, item in enumerate(document[key]):
        label = f"{key}[{index}]"
        target_errors = validate_text(
            item["source_text"], item["text"], item["changes"],
            item["numeric_changes"], label, [],
            item["historical_entities"], [],
        )
        errors.extend(target_errors)
        targets.append({
            "target": label,
            "ordered_math_signature_equal": math_signature(item["source_text"]) == math_signature(item["text"]),
            "ordered_number_signature_equal": number_signature(item["source_text"]) == number_signature(item["text"]),
            "errors": target_errors,
        })
print(json.dumps({
    "validator": str(repo / ".claude/skills/ld-s10y-lesson/tools/edition.py"),
    "stage": "validate_text only; no finalize, no source-page inspection",
    "targets": targets,
    "errors": errors,
}, ensure_ascii=False, indent=2))
sys.exit(1 if errors else 0)
