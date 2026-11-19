import hashlib
import json
from decimal import Decimal, localcontext
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1289-n101-t11-first-choice"
LESSONS = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/lessons"
TMP = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp"


def digest(value):
    return hashlib.sha256(
        json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()


def selected(path, indices):
    raw = path.read_bytes()
    document = json.loads(raw)
    return {
        "path": str(path),
        "file_sha256": hashlib.sha256(raw).hexdigest(),
        "canonical_sha256": digest(document),
        "role": "Definitions only; not answer authority",
        "blocks": [
            {
                "block": index,
                "text": document["prose"][index]["text"],
                "text_utf8_sha256": hashlib.sha256(
                    document["prose"][index]["text"].encode("utf-8")
                ).hexdigest(),
            }
            for index in indices
        ],
    }


entries = [
    selected(LESSONS / "phy10-c2-s4-n101/lesson.json", [1, 7, 9, 10, 14]),
    selected(LESSONS / "phy10-c2-s4-n95/lesson.json", [2]),
]
for language in ("zh", "en"):
    entries.append(
        selected(TMP / "d1218-n97-rigid-rod-affected-repair" / language / "lesson.template.json", [19, 21])
    )
supplementary = {
    "schema": "first-choice-definition-provenance-v1",
    "seed_policy": "Outside both seeds; t11 remains --no-concepts",
    "authorities": entries,
    "uses": {
        "t11:1": [
            {"authority": 1, "blocks": [2]},
            {"authority": 2, "blocks": [19, 21]},
            {"authority": 3, "blocks": [19, 21]},
        ],
        "t11:2": [{"authority": 0, "blocks": [1, 7]}],
        "t11:3": [{"authority": 0, "blocks": [1, 9, 10]}],
    },
}
native = []
for card in ("n101", "t11"):
    folder = (
        TMP / "d1277-n101-t11-first-native" / card
        / "en/artifacts/10p/editions/modern-us-neutral/lessons" / ("phy10-c2-s4-" + card)
    )
    for name in ("lesson.json", "exercises.json"):
        path = folder / name
        raw = path.read_bytes()
        document = json.loads(raw)
        projection = (
            [{"block": i, "text": block["text"]} for i, block in enumerate(document["prose"])]
            if name == "lesson.json"
            else [{"number": item["number"], "text": item["text"]} for item in document["exercises"]]
        )
        native.append(
            {
                "path": str(path),
                "file_sha256": hashlib.sha256(raw).hexdigest(),
                "canonical_sha256": digest(document),
                "role": "Current native-English prompt/prose wording only; no solution authority",
                "projection": projection,
                "projection_canonical_sha256": digest(projection),
            }
        )
for name, value in (
    ("supplementary-definitions.json", supplementary),
    ("native-wording-provenance.json", {"files": native}),
):
    path = OUT / name
    with path.open("x", encoding="utf-8") as stream:
        stream.write(json.dumps(value, ensure_ascii=False, indent=2) + "\n")
    print(name + " canonical_sha256=" + digest(value))
    if name == "supplementary-definitions.json":
        for entry in entries:
            for block in entry["blocks"]:
                print(entry["path"] + " prose[" + str(block["block"]) + "] " + block["text_utf8_sha256"])
with localcontext() as context:
    context.prec = 65
    gamma = Decimal(40000)
    x = Decimal(1) / (gamma * gamma)
    beta = (1 - x).sqrt()
    deficit = x / (1 + beta)
    print("gamma^-2=" + str(x))
    print("v/c=" + str(beta))
    print("(c-v)/c stable=" + str(deficit))
