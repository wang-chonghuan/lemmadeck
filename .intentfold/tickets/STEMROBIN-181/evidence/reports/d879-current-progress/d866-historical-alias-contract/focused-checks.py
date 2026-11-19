import copy
import json
import sys
from pathlib import Path

sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")
import edition

root = Path(".intentfold/tickets/STEMROBIN-181/tmp/d866-historical-alias-contract")
checks = []


def check(name, source, modern, changes, declaration, fail=False):
    errors = edition.validate_text(
        source, modern, changes, [], name, ["Soviet", "fictional-name"], [declaration]
    )
    assert bool(errors) == fail, (name, errors)
    checks.append({"name": name, "status": "PASS", "errors": errors})


check("legacy-same-term", "Soviet credit", "Soviet credit", [],
      {"term": "Soviet", "reason": "Retained literal history"})
alias = {"term": "Soviet", "source_term": "苏联", "reason": "Translated historical attribution"}
check("explicit-source-bound-alias", "苏联 credit", "Soviet credit", ["translation"], alias)
check("missing-source-term-not-allowed", "苏联 credit", "Soviet credit", ["translation"],
      {"term": "Soviet", "reason": "Unsupported literal source"}, True)
for field, value in [
    ("source_term", ""), ("source_term", None), ("source_term", "not present"),
    ("term", ""), ("term", "absent modern"), ("reason", ""),
]:
    bad = copy.deepcopy(alias)
    bad[field] = value
    check(f"reject-{field}-{value}", "苏联 credit", "Soviet credit", ["translation"], bad, True)
check("translation-required", "苏联 credit", "Soviet credit", ["wording"], alias, True)
check("no-unrelated-whitelist", "苏联 credit", "Soviet fictional-name", ["translation"], alias, True)
check("legacy-source-binding-still-required", "unrelated", "Soviet", ["translation"],
      {"term": "Soviet", "reason": "Not source-bound"}, True)
with (root / "report.json").open("x") as handle:
    json.dump({
        "status": "PASS", "checks": checks, "checkCount": len(checks),
        "scope": "Exact per-object historical source alias binding; semantic identity still needs independent review",
        "existingDeclarationsUnchanged": True, "paidCalls": 0, "imagesOpened": 0,
    }, handle, indent=2)
    handle.write("\n")
print(f"PASS {len(checks)} focused historical alias checks")
