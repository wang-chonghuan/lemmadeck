"""Ticket-only, provenance-only rebinding of retained s2-s6 choice sets."""

import copy
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile


REPO = Path(__file__).resolve().parents[4]
SCRATCH = Path(__file__).resolve().parent
BOOK_ROOT = REPO / "ssot-resources/soviet10year-textbooks/artifacts/6-8g"
LESSONS = BOOK_ROOT / "editions/modern-us-neutral/lessons"
BOOK_TRACE = (BOOK_ROOT / "book.json").relative_to(REPO).as_posix()
SCRIPTS = REPO / ".agents/skills/ld-s10y-choice/scripts"
SPEC = importlib.util.spec_from_file_location("choice_prepare", SCRIPTS / "prepare.py")
prepare = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(prepare)


def differences(before, after, path=""):
    if type(before) is not type(after):
        return [path]
    if isinstance(before, dict):
        result = []
        for key in sorted(before.keys() | after.keys()):
            child = f"{path}/{key}"
            if key not in before or key not in after:
                result.append(child)
            else:
                result.extend(differences(before[key], after[key], child))
        return result
    if isinstance(before, list):
        if len(before) != len(after):
            return [path]
        return [
            child
            for index, (left, right) in enumerate(zip(before, after))
            for child in differences(left, right, f"{path}/{index}")
        ]
    return [] if before == after else [path]


def require_equal(before, after, label):
    changed = differences(before, after)
    if changed:
        raise ValueError(f"{label} changed: {changed}")


def replace_json_scalars(raw, target, allowed_paths):
    text = raw.decode("utf-8")
    decoder = json.JSONDecoder()
    spans = {}

    def whitespace(index):
        while index < len(text) and text[index].isspace():
            index += 1
        return index

    def scan(index, path):
        index = whitespace(index)
        if text[index] == "{":
            index = whitespace(index + 1)
            while text[index] != "}":
                key, index = decoder.raw_decode(text, index)
                index = whitespace(index)
                if text[index] != ":":
                    raise ValueError("Expected JSON object colon")
                index = whitespace(scan(index + 1, path + (key,)))
                if text[index] == "}":
                    break
                if text[index] != ",":
                    raise ValueError("Expected JSON object separator")
                index = whitespace(index + 1)
            return index + 1
        if text[index] == "[":
            index = whitespace(index + 1)
            item = 0
            while text[index] != "]":
                index = whitespace(scan(index, path + (str(item),)))
                item += 1
                if text[index] == "]":
                    break
                if text[index] != ",":
                    raise ValueError("Expected JSON array separator")
                index = whitespace(index + 1)
            return index + 1
        _, end = decoder.raw_decode(text, index)
        spans["/" + "/".join(path)] = (index, end)
        return end

    if whitespace(scan(0, ())) != len(text):
        raise ValueError("Unexpected trailing JSON content")
    replacements = []
    for pointer in allowed_paths:
        value = target
        for key in pointer.split("/")[1:]:
            value = value[int(key)] if isinstance(value, list) else value[key]
        if not isinstance(value, str):
            raise ValueError("Only authorized string scalars may be rebound")
        start, end = spans[pointer]
        replacements.append((start, end, json.dumps(value, ensure_ascii=True)))
    for start, end, encoded in sorted(replacements, reverse=True):
        text = text[:start] + encoded + text[end:]
    require_equal(json.loads(text), target, "scalar-only serialization")
    return text.encode("utf-8")


def exclusive_bytes(path, raw):
    with path.open("xb") as stream:
        stream.write(raw)


def update_course(lesson):
    directory = LESSONS / lesson / "choice-set"
    names = ("seed", "draft", "review")
    paths = {name: directory / f"{name}.json" for name in names}
    raw = {name: path.read_bytes() for name, path in paths.items()}
    old = {name: prepare.load_json(path) for name, path in paths.items()}
    old_digests = {name: prepare.digest(value) for name, value in old.items()}
    seed, draft, review = (old[name] for name in names)
    require_equal(seed["source"]["book"], "6-8g", "seed book")
    require_equal(seed["source"]["lesson"], lesson, "seed lesson")
    require_equal(draft["seed_sha256"], old_digests["seed"], "old draft binding")
    require_equal(review["seed_sha256"], old_digests["seed"], "old review seed binding")
    require_equal(review["draft_sha256"], old_digests["draft"], "old review draft binding")
    require_equal(review["outcome"], "pass", "retained semantic outcome")

    selectors = {
        "exercise_numbers": [item["number"] for item in seed["exercises"]],
        "concept_blocks": [item["block"] for item in seed["concepts"]],
        "concept_figure_ids": seed["source"]["concept_figure_ids"],
    }
    refreshed = prepare.prepare_seed(
        REPO, "6-8g", lesson, selectors["exercise_numbers"],
        selectors["concept_blocks"], selectors["concept_figure_ids"],
    )
    require_equal(
        {key: value for key, value in seed.items() if key != "trace"},
        {key: value for key, value in refreshed.items() if key != "trace"},
        "all non-trace seed fields",
    )
    if len(seed["trace"]) != 4 or len(refreshed["trace"]) != 4:
        raise ValueError("Expected exactly four source trace entries")
    require_equal(
        [item["path"] for item in seed["trace"]],
        [item["path"] for item in refreshed["trace"]],
        "source trace paths/order",
    )
    book_indices = [
        index for index, item in enumerate(seed["trace"]) if item["path"] == BOOK_TRACE
    ]
    require_equal(book_indices, [0], "book trace identity/index")
    for index in range(1, 4):
        require_equal(seed["trace"][index], refreshed["trace"][index],
                      f"non-book source trace[{index}]")
    old_book = seed["trace"][0]["sha256"]
    new_book = refreshed["trace"][0]["sha256"]
    if old_book == new_book:
        raise ValueError("No book trace change; do not add redundant provenance notes")
    require_equal(
        differences(seed, refreshed), ["/trace/0/sha256"], "allowed seed change",
    )

    new_draft = copy.deepcopy(draft)
    new_draft["seed_sha256"] = prepare.digest(refreshed)
    new_review = copy.deepcopy(review)
    new_review["seed_sha256"] = new_draft["seed_sha256"]
    new_review["draft_sha256"] = prepare.digest(new_draft)
    new_review["reviewer"]["identity"] += (
        " Provenance-only rebinding by Codex on 2026-11-15 for STEMROBIN-184, "
        "explicitly authorized after assemble extended physical pages 11-40. "
        f"Prior canonical seed_sha256={old_digests['seed']}; "
        f"prior canonical draft_sha256={old_digests['draft']}; "
        f"prior canonical review_sha256={old_digests['review']}; "
        f"prior book.json byte SHA256={old_book}; current book.json byte SHA256={new_book}. "
        "Current prepare.py prepare_seed used the prior exercise numbers, concept.block "
        "indices and concept_figure_ids. Every non-trace seed field is strictly deep "
        "equal, including exercise prose, selected definitions, figure paths and actual "
        "asset hashes. The other three source JSON byte hashes are identical. The "
        "faithful s1-s6 lesson directories have no staged/unstaged diff or status change. "
        "Only the book trace and dependent snapshot digests are rebound. Original "
        "source_reviews, figure_checks, new_figure_reviews and question_reviews are "
        "retained exactly, together with the prior reviewer kind and semantic outcome. "
        "No new independent semantic review, source solving, option checking, figure "
        "inspection or mathematical approval is claimed; unchanged semantic inputs "
        "justify retaining the existing review. Exact pre-rebind seed/draft/review "
        f"bytes are preserved in ticket tmp/provenance-before/{lesson}/. "
        "One post-update mechanical validate command checks this provenance binding; "
        "it does not automatically prove semantics."
    )
    expected_changes = {
        "seed": ["/trace/0/sha256"],
        "draft": ["/seed_sha256"],
        "review": ["/draft_sha256", "/reviewer/identity", "/seed_sha256"],
    }
    new = {"seed": refreshed, "draft": new_draft, "review": new_review}
    changes = {name: differences(old[name], new[name]) for name in names}
    require_equal(changes, expected_changes, "exact allowed changed fields")
    for field in (
        "source_reviews", "figure_checks", "new_figure_reviews", "question_reviews"
    ):
        require_equal(review[field], new_review[field], f"retained review.{field}")
    encoded_new = {
        name: replace_json_scalars(raw[name], new[name], expected_changes[name])
        for name in names
    }

    # Recheck source and artifact bytes immediately before the bounded rewrite.
    for trace in refreshed["trace"]:
        require_equal(prepare.file_hash(REPO / trace["path"]), trace["sha256"],
                      f"concurrent source edit: {trace['path']}")
    for figure in refreshed["figures"]:
        for asset in figure["assets"]:
            require_equal(prepare.file_hash(REPO / asset["path"]), asset["sha256"],
                          f"concurrent figure edit: {asset['path']}")
    for name in names:
        require_equal(paths[name].read_bytes(), raw[name], f"concurrent {name} edit")

    before_dir = SCRATCH / "provenance-before" / lesson
    before_dir.mkdir(parents=True, exist_ok=False)
    for name in names:
        exclusive_bytes(before_dir / f"{name}.json", raw[name])
    manifest = {
        "lesson": lesson, "selectors": selectors,
        "canonical_sha256": old_digests,
        "file_sha256": {name: prepare.file_hash(paths[name]) for name in names},
    }
    exclusive_bytes(
        before_dir / "manifest.json",
        (json.dumps(manifest, indent=2, ensure_ascii=True) + "\n").encode(),
    )

    # Stage all three JSON encodings before replacing any artifact.
    pending = {}
    try:
        for name in names:
            fd, temporary = tempfile.mkstemp(prefix=f".{name}-rebind-", dir=directory)
            pending[name] = Path(temporary)
            with os.fdopen(fd, "wb") as stream:
                stream.write(encoded_new[name])
            pending[name].chmod(paths[name].stat().st_mode & 0o777)
        for name in names:
            require_equal(paths[name].read_bytes(), raw[name], f"concurrent {name} edit")
        for name in names:
            os.replace(pending[name], paths[name])
    finally:
        for temporary in pending.values():
            temporary.unlink(missing_ok=True)

    command = [
        sys.executable, "-B", str(SCRIPTS / "validate.py"), "--repo", str(REPO),
        "--seed", str(paths["seed"]), "--draft", str(paths["draft"]),
        "--review", str(paths["review"]),
    ]
    result = subprocess.run(command, cwd=REPO, capture_output=True, text=True)
    return {
        "lesson": lesson,
        "status": "pass" if result.returncode == 0 else "validation-failed",
        "exact_changed_fields": changes,
        "selectors": selectors,
        "old_book_sha256": old_book, "new_book_sha256": new_book,
        "old_canonical_sha256": old_digests,
        "new_canonical_sha256": {name: prepare.digest(value) for name, value in new.items()},
        "retained_review_records_exactly_equal": True,
        "before_snapshot": str(before_dir.relative_to(REPO)),
        "validation": {
            "attempts": 1, "command": command, "exit_code": result.returncode,
            "stdout": result.stdout, "stderr": result.stderr,
        },
        "usage_updated": False,
    }


def main():
    report_path = SCRATCH / "provenance-rebind-results-002.json"
    if report_path.exists():
        raise SystemExit("One-shot report already exists; refusing to repeat")
    results = []
    for number in range(2, 7):
        lesson = f"geo68-c1-s{number}"
        try:
            result = update_course(lesson)
        except (OSError, ValueError, KeyError, TypeError) as error:
            result = {"lesson": lesson, "status": "stopped", "reason": str(error),
                      "usage_updated": False}
        results.append(result)
        print(json.dumps(result, ensure_ascii=True), flush=True)
    report = {
        "scope": "provenance-only; existing semantic reviews retained, not repeated",
        "faithful_s1_s6": "git diff, cached diff and status were empty before rewrite",
        "courses": results,
        "usage": "Untouched; parent must update current batch1 hashes from this report.",
    }
    exclusive_bytes(
        report_path, (json.dumps(report, indent=2, ensure_ascii=True) + "\n").encode(),
    )
    return 0 if all(result["status"] == "pass" for result in results) else 1


if __name__ == "__main__":
    sys.exit(main())
