"""Summarize existing count trace only; no pixel decoding or counter calls."""
import json

import evidence

trace = json.loads((evidence.OUT / "native-count-four-region-role-trace.json").read_text())
result = []
for a, b in evidence.REGIONS:
    events = [item for item in trace["events"] if item["region"] == [a, b]]
    ownership = [item for item in events if item["function"] == "_bounded_carrier_limit_ownership"]
    rules = [item for item in events if item["function"] == "_bounded_fraction_rules"]
    decisions = [item for item in events if item["function"] == "_single_fraction_row"]
    carriers = [item for item in events if item["function"] == "_single_carrier_row"]
    item = {
        "y": [a, b], "owned_ids": [item["owned_ids"] for item in ownership],
        "fraction_rule_additions": [
            [rule for rule in item["completed_rules"] if rule not in item["input_rules"]]
            for item in rules
        ],
        "fraction_decisions": [item["result"] for item in decisions],
        "carrier_decisions": [item["result"] for item in carriers],
    }
    result.append(item)
    print(json.dumps(item))
evidence.dump(evidence.OUT / "final-four-region-summary.json", result)
