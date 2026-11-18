import copy
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[4]
TMP = ROOT.parent


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read_bound(path, expected, immutable=True):
    path = Path(path)
    data = path.read_bytes()
    assert sha(data) == expected, path
    if immutable:
        assert path.stat().st_mode & 0o777 == 0o444, path
    return json.loads(data), data


def digest(value):
    return sha(json.dumps(value, sort_keys=True, ensure_ascii=True,
                          separators=(",", ":")).encode("utf-8"))


def write_new(path, value):
    data = (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("xb") as stream:
        stream.write(data)
    return {"path": str(path), "sha256": sha(data), "bytes": len(data)}


def array_item_bytes(data, field):
    # JSONDecoder supplies exact value ends, including quoted strings and nested values.
    text = data.decode("utf-8")
    decoder = json.JSONDecoder()

    def ws(position):
        while text[position] in " \t\r\n":
            position += 1
        return position

    position = ws(0)
    assert text[position] == "{"
    position = ws(position + 1)
    while text[position] != "}":
        key, end = decoder.raw_decode(text, position)
        position = ws(end)
        assert text[position] == ":"
        start = ws(position + 1)
        _, end = decoder.raw_decode(text, start)
        if key == field:
            assert text[start] == "["
            position = ws(start + 1)
            result = []
            while text[position] != "]":
                item_start = position
                _, position = decoder.raw_decode(text, position)
                result.append(text[item_start:position].encode("utf-8"))
                position = ws(position)
                if text[position] == ",":
                    position = ws(position + 1)
                else:
                    assert text[position] == "]"
            return result
        position = ws(end)
        if text[position] == ",":
            position = ws(position + 1)
    raise AssertionError(f"Missing array: {field}")


def differences(before, after, pointer=""):
    if before == after:
        return []
    if isinstance(before, dict) and isinstance(after, dict):
        assert before.keys() == after.keys()
        return [change for key in before for change in
                differences(before[key], after[key], f"{pointer}/{key}")]
    if isinstance(before, list) and isinstance(after, list):
        assert len(before) == len(after)
        return [change for index, (old, new) in enumerate(zip(before, after))
                for change in differences(old, new, f"{pointer}/{index}")]
    return [{"pointer": pointer, "before": before, "after": after}]


def map_reviews():
    affected_hash = "22b95787510a6a573a0927dff59c97d7b67e0fd5f8ae09697e1ab96b1848256c"
    affected, _ = read_bound(ROOT / "affected-visible-review.json", affected_hash)
    assert affected["authorNewKeyIntentDerivationsRegisterRead"] is False
    assert affected["outcome"] == "pass"
    freeze_hash = "dccbbff7d8c1ea4dfef9c48bb7937249d67ac861b88cef0365287b6528370960"
    freeze_path = TMP / "d295-t5-choice-beam-repair/author-freeze.json"
    freeze, _ = read_bound(freeze_path, freeze_hash)
    register, _ = read_bound(freeze["changeRegister"]["path"],
                             "b4bef78f35630e9c04ebab14a0ad98a18a67e22d0f7b12002c5cee7f60f44ec3")
    manifest_path = TMP / "d290-t5-scoped-choice-seeds/manifest.json"
    manifest, _ = read_bound(manifest_path,
        "6707b4228111b0f005b1a9de0a7f56dc53b0309a739adec750a02ee16400b551", False)
    outputs = []
    old_review_hashes = {
        "zh": "0e07b4a6b119be3a2ab8db5ff5bfb38e9cbef7eba7b6770f025784806e23f20b",
        "en": "437aa47c90b292745a52c1f3522ebb01786f725f032182c0127e8416a525119b"
    }
    for author in freeze["outputs"]:
        language = author["language"]
        recorded = next(row for row in register["languages"] if row["language"] == language)
        entry = next(row for row in manifest["results"] if row["language"] == language)
        old_path = TMP / f"d291-t5-choice-author/{language}/draft.json"
        old, old_bytes = read_bound(old_path, recorded["beforeDraftSHA256"])
        draft, new_bytes = read_bound(author["draft"]["path"], recorded["afterDraftSHA256"])
        visible, _ = read_bound(author["visibleOnly"]["path"], author["visibleOnly"]["sha256"])
        assert [question["view"] for question in draft["questions"]] == visible
        actual_changes = differences(old, draft)
        assert sorted(actual_changes, key=lambda row: row["pointer"]) == sorted(
            recorded["changedFields"], key=lambda row: row["pointer"])
        assert len(actual_changes) == 7
        assert draft["questions"][1:] == old["questions"][1:]
        assert draft["coverage"][1:] == old["coverage"][1:]
        assert draft["questions"][0]["view"]["options"][1:] == old["questions"][0]["view"]["options"][1:]
        assert draft["questions"][0]["key"]["rationales"][1:] == old["questions"][0]["key"]["rationales"][1:]
        assert draft["new_figures"] == old["new_figures"] == []
        assert draft["seed_sha256"] == old["seed_sha256"]
        assert draft["questions"][0]["key"]["correct"] == affected["questionReview"]["mathematics"]["correct"]
        assert draft["questions"][0]["source_numbers"] == ["1"]
        assert draft["questions"][0]["id"] == "beam-observation"
        seed_path = REPO / entry["seed"]["path"]
        seed, _ = read_bound(seed_path, entry["seed"]["sha256"], False)
        assert digest(seed) == draft["seed_sha256"] == author["canonicalSeedDigest"]
        assert digest(draft) == author["canonicalDraftDigest"]
        old_review_path = TMP / f"d293-t5-choice-review/{language}/review.json"
        inherited, _ = read_bound(old_review_path, old_review_hashes[language])
        review = copy.deepcopy(inherited)
        review["draft_sha256"] = digest(draft)
        review["source_reviews"][0]["coverage"] = affected["sourceCoverage"]
        review["question_reviews"][0] = {
            "question_id": draft["questions"][0]["id"],
            **affected["questionReview"]
        }
        review["outcome"] = "pass"
        assert review["seed_sha256"] == digest(seed)
        assert review["source_reviews"][1:] == inherited["source_reviews"][1:]
        assert review["question_reviews"][1:] == inherited["question_reviews"][1:]
        assert review["source_reviews"][0]["independent_solution"] == inherited["source_reviews"][0]["independent_solution"]
        assert review["reviewer"] == inherited["reviewer"]
        old_questions = array_item_bytes(old_bytes, "questions")
        new_questions = array_item_bytes(new_bytes, "questions")
        old_coverage = array_item_bytes(old_bytes, "coverage")
        new_coverage = array_item_bytes(new_bytes, "coverage")
        unchanged = []
        for index in range(1, 6):
            assert old_questions[index] == new_questions[index]
            assert old_coverage[index] == new_coverage[index]
            unchanged.append({
                "index": index,
                "questionId": draft["questions"][index]["id"],
                "rawQuestionBytesEqual": True,
                "rawQuestionBytes": len(new_questions[index]),
                "rawQuestionSha256": sha(new_questions[index]),
                "rawCoverageBytesEqual": True,
                "rawCoverageSha256": sha(new_coverage[index]),
                "wholeQuestionDeepEqual": True,
                "inheritedSourceAndQuestionReviewUnchanged": True
            })
        output = write_new(ROOT / language / "review.json", review)
        outputs.append({
            "language": language,
            "repo": str((REPO / entry["repository"]).resolve()),
            "seed": {"path": str(seed_path), "sha256": entry["seed"]["sha256"]},
            "draft": author["draft"],
            "review": output,
            "oldReview": {"path": str(old_review_path), "sha256": old_review_hashes[language]},
            "canonicalSeedDigest": review["seed_sha256"],
            "canonicalDraftDigest": review["draft_sha256"],
            "changedDraftPointers": [row["pointer"] for row in actual_changes],
            "exactChangeRegisterMatch": True,
            "unchangedFive": unchanged,
            "affectedTrueSet": affected["questionReview"]["mathematics"]["correct"],
            "outcome": "pass"
        })
    receipt = write_new(ROOT / "mapping.receipt.json", {
        "schema": "d296-affected-contract-mapping-receipt@1",
        "preKeyAffected": {"path": str(ROOT / "affected-visible-review.json"), "sha256": affected_hash},
        "authorFreeze": {"path": str(freeze_path), "sha256": freeze_hash},
        "changeRegister": freeze["changeRegister"],
        "method": "Exact register diff and raw JSONDecoder item-span equality; copy unchanged five native review records, replace only source1 coverage and first question checks, and bind the new draft digests. No arithmetic or full semantic review.",
        "outputs": outputs,
        "newImages": 0,
        "cumulativeImages": 24,
        "exitCode": 0
    })
    print(json.dumps(receipt))


def validate(language):
    mapping_path = ROOT / "mapping.receipt.json"
    mapping = json.loads(mapping_path.read_bytes())
    selected = next(row for row in mapping["outputs"] if row["language"] == language)
    script = REPO / ".agents/skills/ld-s10y-choice/scripts/validate.py"
    command = ["python3", str(script), "--repo", selected["repo"],
               "--seed", selected["seed"]["path"], "--draft", selected["draft"]["path"],
               "--review", selected["review"]["path"]]
    receipt_path = ROOT / language / "native-validation.receipt.json"
    assert not receipt_path.exists()
    result = subprocess.run(command, cwd=REPO, capture_output=True, text=True,
                            env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"})
    receipt = {
        "schema": "d296-native-validation-receipt@1",
        "language": language,
        "argv": command,
        "cwd": str(REPO),
        "environmentOverride": {"PYTHONDONTWRITEBYTECODE": "1"},
        "invocationCount": 1,
        "exitCode": result.returncode,
        "stdout": result.stdout,
        "stderr": result.stderr,
        "meaning": "Native structure and declared semantic outcome for the six selected tasks only; not automatic semantic proof, full DISPLAY or complete-card approval.",
        "snapshotBindings": {
            "preKeyAffected": mapping["preKeyAffected"],
            "mapping": {"path": str(mapping_path), "sha256": sha(mapping_path.read_bytes())},
            "seed": selected["seed"],
            "draft": selected["draft"],
            "review": selected["review"],
            "validator": {"path": str(script), "sha256": sha(script.read_bytes())}
        },
        "newImages": 0,
        "cumulativeImages": 24,
        "sourceArithmeticRepeated": False,
        "otherFiveSemanticReviewRepeated": False,
        "retries": 0
    }
    output = write_new(receipt_path, receipt)
    print(json.dumps({"receipt": output, "exitCode": result.returncode,
                      "stdout": result.stdout, "stderr": result.stderr}))
    return result.returncode


if __name__ == "__main__":
    mode = sys.argv[1]
    assert mode in {"map", "zh", "en"}
    if mode == "map":
        map_reviews()
    else:
        sys.exit(validate(mode))
