import hashlib
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent
DECODER = json.JSONDecoder()


def digest(data):
    return hashlib.sha256(data).hexdigest()


def skip_space(raw, position):
    while position < len(raw) and raw[position].isspace():
        position += 1
    return position


# JSONDecoder provides exact value endpoints; retain the original UTF-8 slices.
def object_ranges(raw, start):
    assert raw[start] == "{"
    result = {}
    position = skip_space(raw, start + 1)
    while raw[position] != "}":
        key, position = DECODER.raw_decode(raw, position)
        position = skip_space(raw, position)
        assert raw[position] == ":"
        value_start = skip_space(raw, position + 1)
        _, value_end = DECODER.raw_decode(raw, value_start)
        result[key] = (value_start, value_end)
        position = skip_space(raw, value_end)
        if raw[position] == "}":
            break
        assert raw[position] == ","
        position = skip_space(raw, position + 1)
    return result


def array_ranges(raw, start):
    assert raw[start] == "["
    result = []
    position = skip_space(raw, start + 1)
    while raw[position] != "]":
        value, end = DECODER.raw_decode(raw, position)
        result.append((value, position, end))
        position = skip_space(raw, end)
        if raw[position] == "]":
            break
        assert raw[position] == ","
        position = skip_space(raw, position + 1)
    return result


def differences(before, after, pointer=""):
    assert type(before) is type(after), pointer
    if isinstance(before, dict):
        assert before.keys() == after.keys(), pointer
        return [
            row for key in before
            for row in differences(before[key], after[key], f"{pointer}/{key}")
        ]
    if isinstance(before, list):
        assert len(before) == len(after), pointer
        return [
            row for index, (old, new) in enumerate(zip(before, after))
            for row in differences(old, new, f"{pointer}/{index}")
        ]
    return [] if before == after else [{"pointer": pointer, "before": before, "after": after}]


binding = json.loads((OUT / "source-binding.json").read_bytes())
allowed_paths = {
    "/questions/0/view/options/0/text",
    "/questions/0/intent/task",
    "/questions/0/intent/source_solution",
    "/questions/0/intent/unit_reason",
    "/questions/0/intent/limitations/1",
    "/questions/0/key/rationales/0/derivation",
    "/coverage/0/reason",
}
reports = []
for item in binding["languages"]:
    language = item["language"]
    old_path = Path(item["originalDraft"]["path"])
    new_path = OUT / language / "draft.json"
    old_bytes = old_path.read_bytes()
    new_bytes = new_path.read_bytes()
    assert digest(old_bytes) == item["originalDraft"]["sha256"]
    old_raw, new_raw = old_bytes.decode("utf-8"), new_bytes.decode("utf-8")
    old, new = json.loads(old_raw), json.loads(new_raw)
    changed = differences(old, new)
    assert {row["pointer"] for row in changed} == allowed_paths
    assert old["seed_sha256"] == new["seed_sha256"] == item["canonicalSeedDigest"]
    assert old["new_figures"] == new["new_figures"] == []
    assert old["questions"][0]["key"]["correct"] == new["questions"][0]["key"]["correct"] == ["A", "D"]
    assert old["questions"][0]["view"]["stem"] == new["questions"][0]["view"]["stem"]
    old_ranges = object_ranges(old_raw, skip_space(old_raw, 0))
    new_ranges = object_ranges(new_raw, skip_space(new_raw, 0))
    old_questions = array_ranges(old_raw, old_ranges["questions"][0])
    new_questions = array_ranges(new_raw, new_ranges["questions"][0])
    old_coverage = array_ranges(old_raw, old_ranges["coverage"][0])
    new_coverage = array_ranges(new_raw, new_ranges["coverage"][0])
    unchanged = []
    for index in range(1, 6):
        old_value, old_start, old_end = old_questions[index]
        new_value, new_start, new_end = new_questions[index]
        old_slice = old_raw[old_start:old_end].encode("utf-8")
        new_slice = new_raw[new_start:new_end].encode("utf-8")
        assert old_value == new_value
        assert old_slice == new_slice
        _, old_start, old_end = old_coverage[index]
        _, new_start, new_end = new_coverage[index]
        old_cover = old_raw[old_start:old_end].encode("utf-8")
        new_cover = new_raw[new_start:new_end].encode("utf-8")
        assert old_cover == new_cover
        unchanged.append({
            "question_id": old_value["id"],
            "source_numbers": old_value["source_numbers"],
            "rawQuestionBeforeSHA256": digest(old_slice),
            "rawQuestionAfterSHA256": digest(new_slice),
            "rawQuestionBytes": len(old_slice),
            "rawQuestionByteEqual": True,
            "rawCoverageBeforeSHA256": digest(old_cover),
            "rawCoverageAfterSHA256": digest(new_cover),
            "rawCoverageByteEqual": True,
            "optionCountPreserved": len(old_value["view"]["options"]),
            "semanticReReview": False,
        })
    unchanged_beam_options = []
    old_first = object_ranges(old_raw, old_questions[0][1])
    new_first = object_ranges(new_raw, new_questions[0][1])
    for section, array_name in (("view", "options"), ("key", "rationales")):
        old_nested = object_ranges(old_raw, old_first[section][0])
        new_nested = object_ranges(new_raw, new_first[section][0])
        old_items = array_ranges(old_raw, old_nested[array_name][0])
        new_items = array_ranges(new_raw, new_nested[array_name][0])
        for index in range(1, 4):
            old_value, old_start, old_end = old_items[index]
            new_value, new_start, new_end = new_items[index]
            old_slice = old_raw[old_start:old_end].encode("utf-8")
            new_slice = new_raw[new_start:new_end].encode("utf-8")
            assert old_value == new_value
            assert old_slice == new_slice
            unchanged_beam_options.append({
                "section": f"{section}.{array_name}",
                "option_id": old_value.get("id", old_value.get("option_id")),
                "beforeSHA256": digest(old_slice), "afterSHA256": digest(new_slice),
                "rawByteEqual": True,
            })
    reports.append({
        "language": language,
        "originalDraftSHA256": digest(old_bytes), "candidateDraftSHA256": digest(new_bytes),
        "changedFields": changed, "unchangedFiveQuestions": unchanged,
        "unchangedBeamBCD": unchanged_beam_options,
        "trueSetBefore": ["A", "D"], "trueSetAfter": ["A", "D"],
        "sourceSeedDigestAndNewFiguresUnchanged": True,
        "comparisonScope": "Only changed source1 fields and exact unaffected byte equality; no full source solve or other task semantic review.",
    })
print(json.dumps({
    "schema": "bounded-t5-beam-only-choice-repair-isolation-check@1",
    "status": "MATCH-LOCAL-DIFF-AND-BYTE-ISOLATION",
    "languages": reports,
    "substantiveVisibleOptionsChanged": 2,
    "unchangedQuestionObjects": 10,
    "unchangedOtherQuestionOptions": 42,
    "newImages": 0, "cumulativeImages": 24,
    "semanticPASS": False, "independentReview": "PENDING-D296",
}, ensure_ascii=False, indent=2))
