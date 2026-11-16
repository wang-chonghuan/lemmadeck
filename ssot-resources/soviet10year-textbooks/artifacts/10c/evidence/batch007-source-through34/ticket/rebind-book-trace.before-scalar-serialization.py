"""Rebind only an appended book index; retain existing semantic evidence."""

import copy
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import subprocess
import sys


REPO = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(REPO / ".agents/skills/ld-s10y-choice/scripts"))
import prepare


def rebind(book, lesson, scratch=False):
    if scratch:
        directory = Path(__file__).parent
        paths = {
            name: directory / f"{lesson}-choice-{name}.json"
            for name in ("seed", "draft", "review")
        }
    else:
        directory = REPO / (
            f"ssot-resources/soviet10year-textbooks/artifacts/{book}/"
            f"editions/modern-us-neutral/lessons/{lesson}/choice-set"
        )
        paths = {name: directory / f"{name}.json" for name in ("seed", "draft", "review")}
    before = {name: prepare.load_json(path) for name, path in paths.items()}
    seed, draft, review = (before[name] for name in paths)
    assert draft["seed_sha256"] == prepare.digest(seed)
    assert review["seed_sha256"] == prepare.digest(seed)
    assert review["draft_sha256"] == prepare.digest(draft)
    assert review["outcome"] == "pass"
    fresh = prepare.prepare_seed(
        REPO, book, lesson,
        [item["number"] for item in seed["exercises"]],
        [item["block"] for item in seed["concepts"]],
        seed["source"]["concept_figure_ids"],
    )
    assert {k: v for k, v in seed.items() if k != "trace"} == {
        k: v for k, v in fresh.items() if k != "trace"
    }, "Non-trace seed content changed; existing semantic evidence cannot be reused"
    assert len(seed["trace"]) == len(fresh["trace"]) == 4
    assert seed["trace"][0]["path"] == fresh["trace"][0]["path"] == (
        f"ssot-resources/soviet10year-textbooks/artifacts/{book}/book.json"
    )
    assert seed["trace"][1:] == fresh["trace"][1:], "A lesson input changed"
    if seed == fresh:
        print(f"{lesson}: unchanged; no rewrite or redundant validation")
        return

    after = copy.deepcopy(before)
    after["seed"] = fresh
    after["draft"]["seed_sha256"] = prepare.digest(fresh)
    after["review"]["seed_sha256"] = prepare.digest(fresh)
    after["review"]["draft_sha256"] = prepare.digest(after["draft"])
    after["review"]["reviewer"]["identity"] += (
        f" Parent provenance-only book-index rebinding on {datetime.now(timezone.utc).date().isoformat()} under the "
        "existing STEMROBIN-184 scope. All non-trace seed fields and the other "
        "three source hashes are strictly equal. Source solutions, questions, "
        "views, keys, coverage and every semantic/figure review record are "
        "unchanged; no new independent review or mathematical approval claimed. "
        f"Prior seed digest={prepare.digest(seed)}; "
        f"prior draft digest={prepare.digest(draft)}; "
        f"prior review digest={prepare.digest(review)}."
    )
    backup = (
        Path(__file__).parent / "provenance-before-current" / book / lesson
        / seed["trace"][0]["sha256"][:12]
    )
    backup.mkdir(parents=True, exist_ok=False)
    for name, path in paths.items():
        (backup / path.name).write_bytes(path.read_bytes())
    for trace in fresh["trace"]:
        assert prepare.file_hash(REPO / trace["path"]) == trace["sha256"]
    for name, path in paths.items():
        path.write_text(json.dumps(after[name], ensure_ascii=False, indent=2) + "\n")
    command = [
        sys.executable, str(REPO / ".agents/skills/ld-s10y-choice/scripts/validate.py"),
        "--repo", str(REPO), "--seed", str(paths["seed"]),
        "--draft", str(paths["draft"]), "--review", str(paths["review"]),
    ]
    env = dict(os.environ, PLAYWRIGHT_HTML_OPEN="never")
    env.pop("PWDEBUG", None)
    result = subprocess.run(command, cwd=REPO, env=env, capture_output=True, text=True)
    print(json.dumps({
        "lesson": lesson, "book_trace_only": True,
        "prior_book_sha256": seed["trace"][0]["sha256"],
        "current_book_sha256": fresh["trace"][0]["sha256"],
        "validation_exit": result.returncode,
        "stdout": result.stdout, "stderr": result.stderr,
    }))
    if result.returncode:
        raise SystemExit(result.returncode)


arguments = sys.argv[1:]
scratch_mode = bool(arguments and arguments[0] == "--scratch")
if scratch_mode:
    arguments = arguments[1:]
for lesson_id in arguments[1:]:
    rebind(arguments[0], lesson_id, scratch=scratch_mode)
