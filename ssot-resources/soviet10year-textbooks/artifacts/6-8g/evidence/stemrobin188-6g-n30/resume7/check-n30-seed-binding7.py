import copy
import json
import sys
from pathlib import Path

repo = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
assert Path.cwd() == repo
sys.path.insert(0, str(repo / ".agents/skills/ld-s10y-choice/scripts"))
from prepare import ContractError, prepare_seed
from validate import check_seed

seed = json.loads((repo / ".intentfold/tickets/STEMROBIN-188/tmp/n30-choices7/seed.json").read_text())
assert seed["source"]["include_group_instructions"] is True
check_seed(seed, repo)
legacy = prepare_seed(repo, "6-8g", "geo68-c2-s4-n30",
                      [item["number"] for item in seed["exercises"]],
                      [item["block"] for item in seed["concepts"]], [],
                      include_group_instructions=False)
check_seed(legacy, repo)
cases = []


def rejected(name, mutate):
    changed = copy.deepcopy(seed)
    mutate(changed)
    try:
        check_seed(changed, repo)
    except ContractError:
        cases.append(name)
    else:
        raise AssertionError(f"Tampered seed accepted: {name}")


rejected("false-group-mode", lambda s: s["source"].update(include_group_instructions=False))
rejected("exercise-text", lambda s: s["exercises"][0].update(text="Changed task"))
rejected("definition-text", lambda s: s["concepts"][0].update(text="Changed definition"))
rejected("lesson-trace", lambda s: s["trace"][1].update(sha256="0" * 64))
rejected("exercise-trace", lambda s: s["trace"][2].update(sha256="0" * 64))
rejected("figure-trace", lambda s: s["trace"][3].update(sha256="0" * 64))
changed_index = copy.deepcopy(seed)
changed_index["trace"][0]["sha256"] = "0" * 64
check_seed(changed_index, repo)
print(json.dumps({"status": "pass", "accepted": [
    "current-group-mode", "legacy-no-group-mode", "historical-index-trace",
], "rejected": cases}))
