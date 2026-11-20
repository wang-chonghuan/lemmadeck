import copy
import json
import sys

sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")
from edition import normalize_lesson_layout

payload = json.load(sys.stdin)
results = []
for item in payload["locales"]:
    normalized_before = copy.deepcopy(item["before"])
    normalize_lesson_layout(normalized_before)
    once = copy.deepcopy(item["after"])
    normalize_lesson_layout(once)
    twice = copy.deepcopy(once)
    normalize_lesson_layout(twice)
    results.append({
        "locale": item["locale"],
        "beforeNormalizationProducesAfterProse": normalized_before["prose"] == item["after"]["prose"],
        "currentLessonUnchangedAfterOneNormalization": once == item["after"],
        "currentLessonUnchangedAfterTwoNormalizations": twice == item["after"],
        "changedBeforeProseIndices": [
            i for i, (before, after) in enumerate(zip(item["before"]["prose"], normalized_before["prose"]))
            if before != after
        ],
        "unexpectedAfterProseIndices": [
            i for i, (before, after) in enumerate(zip(item["after"]["prose"], once["prose"]))
            if before != after
        ],
        "affectedText": [
            {"entry": i, "normalizerOutput": normalized_before["prose"][i]["text"]}
            for i in (4, 17)
        ]
    })
print(json.dumps({"method": "Actual production normalize_lesson_layout, in-memory only; no producer or image operation.", "results": results}, ensure_ascii=False))
