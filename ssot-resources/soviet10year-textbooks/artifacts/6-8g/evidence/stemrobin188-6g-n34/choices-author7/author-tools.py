"""Project views and capture one structural validation, without semantic review."""

import hashlib
import json
from pathlib import Path
import subprocess
import sys


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
OUT = Path(".intentfold/tickets/STEMROBIN-188/tmp/n34-choices7")
EXPECTED_SEED = "4cd9a70bc7e0574a19dbde632a8cfb44f51f6fd97dba3525a41f945bceb4cb1e"


def canonical_digest(value):
    data = json.dumps(
        value, sort_keys=True, ensure_ascii=True, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def main():
    if Path.cwd().resolve() != ROOT:
        raise RuntimeError("This author tool may run only in the authorized cwd.")
    if OUT.resolve() != ROOT / OUT:
        raise RuntimeError("The owned output path must not escape through a symlink.")

    names = (
        "view-only.json",
        "validate.stdout.txt",
        "validate.stderr.txt",
        "validate.execution.json",
    )
    if any((OUT / name).exists() for name in names):
        raise FileExistsError("Generated evidence already exists; do not overwrite or rerun.")

    with (OUT / "seed.json").open(encoding="utf-8") as handle:
        seed = json.load(handle)
    with (OUT / "draft.json").open(encoding="utf-8") as handle:
        draft = json.load(handle)
    seed_digest = canonical_digest(seed)
    if seed_digest != EXPECTED_SEED:
        raise RuntimeError("The immutable official seed digest does not match.")
    draft_digest = canonical_digest(draft)

    # This is a mechanical projection of the authored views, not new authoring.
    views = [{"id": question["id"], "view": question["view"]}
             for question in draft["questions"]]
    with (OUT / "view-only.json").open("x", encoding="utf-8") as handle:
        json.dump(views, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    argv = [
        sys.executable,
        "-B",
        ".agents/skills/ld-s10y-choice/scripts/validate.py",
        "--repo",
        ".",
        "--seed",
        str(OUT / "seed.json"),
        "--draft",
        str(OUT / "draft.json"),
    ]
    with (OUT / "validate.stdout.txt").open("xb") as stdout_handle:
        with (OUT / "validate.stderr.txt").open("xb") as stderr_handle:
            result = subprocess.run(argv, cwd=ROOT, capture_output=True, check=False)
            stdout_handle.write(result.stdout)
            stderr_handle.write(result.stderr)

    counts = {
        "sources": len(seed["exercises"]),
        "questions": len(draft["questions"]),
        "single": sum(q["view"]["mode"] == "single" for q in draft["questions"]),
        "multiple": sum(q["view"]["mode"] == "multiple" for q in draft["questions"]),
        "options": sum(len(q["view"]["options"]) for q in draft["questions"]),
        "source_images": len(seed["figures"]),
        "new_images": len(draft["new_figures"]),
    }
    receipt = {
        "cwd": str(ROOT),
        "argv": argv,
        "exit_code": result.returncode,
        "streams": {
            "stdout": "validate.stdout.txt",
            "stderr": "validate.stderr.txt",
        },
        "seed_sha256": seed_digest,
        "draft_sha256": draft_digest,
        "counts": counts,
        "validation_kind": "structural_only_no_review_argument",
        "semantic_review": "not_performed_author_only",
    }
    with (OUT / "validate.execution.json").open("x", encoding="utf-8") as handle:
        json.dump(receipt, handle, ensure_ascii=False, indent=2)
        handle.write("\n")

    print(json.dumps({
        **receipt,
        "captured_stdout": result.stdout.decode("utf-8", errors="replace"),
        "captured_stderr": result.stderr.decode("utf-8", errors="replace"),
    }, ensure_ascii=False, indent=2))
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
