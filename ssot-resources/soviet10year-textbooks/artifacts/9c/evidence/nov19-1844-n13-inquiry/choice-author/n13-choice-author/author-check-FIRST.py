"""Local author arithmetic/digest checks, not the native validator or a review."""

import hashlib
import json
from fractions import Fraction
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
AUTHOR = ROOT / ".tmp/stemrobin-184-resume/n13-choice-author"
SEED = ROOT / ".tmp/stemrobin-184-resume/n13-choices/seed.json"
DRAFT = ROOT / ".tmp/stemrobin-184-resume/n13-choices/draft.json"


def canonical_digest(value):
    data = json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def repeating_decimal(integer, prefix, block, sign=1):
    prefix_value = Fraction(int(prefix), 10 ** len(prefix)) if prefix else 0
    tail_value = Fraction(
        int(block), (10 ** len(block) - 1) * 10 ** len(prefix)
    )
    return sign * (integer + prefix_value + tail_value)


def division_cycle(numerator, denominator, steps):
    integer, remainder = divmod(numerator, denominator)
    remainders = [remainder]
    digits = []
    for _ in range(steps):
        digit, remainder = divmod(10 * remainder, denominator)
        digits.append(digit)
        remainders.append(remainder)
    return {"integer": integer, "digits": digits, "remainders": remainders}


seed = json.loads(SEED.read_bytes())
draft = json.loads(DRAFT.read_bytes())
first = json.loads((AUTHOR / "freeze-FIRST.json").read_bytes())
assert canonical_digest(seed) == first["seed_canonical_sha256"]
assert draft["seed_sha256"] == canonical_digest(seed)
for record in first["files"]:
    data = Path(record["path"]).read_bytes()
    assert len(data) == record["bytes"]
    assert hashlib.sha256(data).hexdigest() == record["sha256"]

assert seed["figures"] == []
assert seed["source"]["concept_figure_ids"] == []
assert all(exercise["figure_ids"] == [] for exercise in seed["exercises"])
assert [concept["block"] for concept in seed["concepts"]] == [1, 3, 5, 8, 9]
assert draft["new_figures"] == []
assert all(question["view"]["mode"] == "single" for question in draft["questions"])
assert all(question["view"]["figure_ids"] == [] for question in draft["questions"])
assert all(
    option["figure_ids"] == []
    for question in draft["questions"]
    for option in question["view"]["options"]
)

# Fixed author-derived values; this checker never creates questions or keys.
values = {
    "q-positive-improper": (
        Fraction(7, 3),
        {
            "a": repeating_decimal(2, "", "3"),
            "b": repeating_decimal(2, "", "1"),
            "c": repeating_decimal(2, "", "3"),
        },
    ),
    "q-nonrepeating-prefix": (
        Fraction(23, 30),
        {
            "a": repeating_decimal(0, "", "76"),
            "b": repeating_decimal(0, "7", "6"),
            "c": repeating_decimal(0, "", "6"),
            "d": repeating_decimal(0, "7", "6"),
        },
    ),
    "q-negative-long-cycle": (
        Fraction(-3, 7),
        {
            "a": repeating_decimal(0, "", "428571", -1),
            "b": repeating_decimal(0, "428571", "0", -1),
            "c": repeating_decimal(0, "", "428571", -1),
        },
    ),
    "q-negative-improper-cycle": (
        Fraction(-29, 11),
        {
            "a": repeating_decimal(2, "", "63", -1),
            "b": repeating_decimal(3, "", "36", -1),
            "c": repeating_decimal(2, "", "63", -1),
        },
    ),
}

expected_cycles = {
    "a": {"integer": 2, "digits": [3], "remainders": [1, 1]},
    "b": {"integer": 0, "digits": [7, 6], "remainders": [23, 20, 20]},
    "c": {
        "integer": 0,
        "digits": [4, 2, 8, 5, 7, 1],
        "remainders": [3, 2, 6, 4, 5, 1, 3],
    },
    "d": {"integer": 2, "digits": [6, 3], "remainders": [7, 4, 7]},
}
actual_cycles = {
    "a": division_cycle(7, 3, 1),
    "b": division_cycle(23, 30, 2),
    "c": division_cycle(3, 7, 6),
    "d": division_cycle(29, 11, 2),
}
assert actual_cycles == expected_cycles
assert repeating_decimal(0, "", "3") == Fraction(1, 3)
assert repeating_decimal(0, "", "428571") == Fraction(3, 7)
assert repeating_decimal(0, "", "63") == Fraction(7, 11)
assert repeating_decimal(0, "", "36") == Fraction(4, 11)

option_values = []
for question in draft["questions"]:
    target, candidates = values[question["id"]]
    assert set(candidates) == {
        option["id"] for option in question["view"]["options"]
    }
    for option_id, value in candidates.items():
        option_values.append(
            {
                "question_id": question["id"],
                "option_id": option_id,
                "decimal_value": str(value),
                "source_value": str(target),
                "representation_equals_source": value == target,
            }
        )

print(
    json.dumps(
        {
            "status": "AUTHOR_ARITHMETIC_AND_DIGEST_CHECKS_COMPLETED",
            "scope": "Read-only checks of whitelisted inputs and this author's own outputs; no native structural validator or semantic review.",
            "seed_canonical_sha256": canonical_digest(seed),
            "draft_canonical_sha256": canonical_digest(draft),
            "first_freeze_unchanged": True,
            "source_cycles": actual_cycles,
            "option_decimal_values": option_values,
            "semantic_boundary": "Matching a representation is not a complete-option truth judgment. False explanations are derived internally in the draft; no independent reviewer or approval is represented here.",
            "image_usage": {"cap": 0, "opened": 0, "created": 0},
        },
        indent=2,
    )
)
