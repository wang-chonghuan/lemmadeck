"""Check only candidate display text with the existing local math module."""
from __future__ import annotations

import json
import sys
from pathlib import Path

WORKSPACE = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
sys.path.insert(0, str(WORKSPACE / ".claude/skills/ld-s10y-lesson/tools"))
import mathcheck

document = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
blocks = [
    {"id": f"{answer['id']}:{language}", "displayAnswer": text}
    for answer in document["answers"]
    for language, text in answer["displayAnswer"].items()
]
errors, warnings = mathcheck.collect_and_check(
    blocks, lambda block: [("displayAnswer", block["displayAnswer"])]
)
formula_count = sum(
    len(mathcheck.find_math_spans(block["displayAnswer"])) for block in blocks
)
result = {
    "schema": "stemrobin/local-candidate-latex-check@1",
    "status": "PASS-LOCAL-LATEX" if not errors else "FAIL-LOCAL-LATEX",
    "displayAnswers": len(blocks),
    "formulas": formula_count,
    "errors": errors,
    "warnings": warnings,
    "module": str(WORKSPACE / ".claude/skills/ld-s10y-lesson/tools/mathcheck.py"),
    "scope": "Delimiter and KaTeX parsing only; no arithmetic, scientific review, MathLive, browser, complete-lesson gate or finalize.",
    "newImages": 0,
}
print(json.dumps(result, ensure_ascii=False, indent=2))
raise SystemExit(0 if not errors else 1)
