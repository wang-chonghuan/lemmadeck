import json
import subprocess
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1289-n101-t11-first-choice"


def capture(name, command):
    receipt = OUT / "receipts" / (name + ".json")
    if receipt.exists():
        raise SystemExit("Refusing to overwrite receipt: " + str(receipt))
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
    receipt.parent.mkdir(parents=True, exist_ok=True)
    receipt.write_text(
        json.dumps(
            {
                "cwd": str(ROOT),
                "argv": command,
                "exit_code": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr,
            },
            ensure_ascii=False,
            indent=2,
        ) + "\n",
        encoding="utf-8",
    )
    print(json.dumps({"receipt": str(receipt), "exit_code": result.returncode}))
    print(result.stdout, end="")
    print(result.stderr, end="")
    if result.returncode:
        raise SystemExit(result.returncode)


if __name__ == "__main__":
    import sys

    phase = sys.argv[1]
    if phase == "prepare":
        for card in ("n101", "t11"):
            lesson = "phy10-c2-s4-" + card
            base = [
                "python3", ".agents/skills/ld-s10y-choice/scripts/prepare.py",
            ]
            selectors = ["--repo", ".", "--book", "10p", "--lesson", lesson]
            capture(card + "-inspect", base + ["inspect"] + selectors)
            command = base + ["prepare"] + selectors
            for number in range(1, 5 if card == "n101" else 4):
                command += ["--exercise", str(number)]
            if card == "n101":
                for block in (1, 7, 9, 10, 14):
                    command += ["--concept-block", str(block)]
            else:
                command += ["--no-concepts"]
            command += ["--out", str(OUT / card / "seed.json")]
            capture(card + "-prepare", command)
    elif phase == "freeze":
        import hashlib

        paths = [OUT / card / language / "draft.json" for card in ("n101", "t11") for language in ("zh", "en")]
        if any(path.exists() for path in paths):
            raise SystemExit("Draft exists before FIRST freeze")
        path = OUT / "source-solutions-FIRST.json"
        raw = path.read_bytes()
        value = json.loads(raw)
        if len(value["solutions"]) != 7:
            raise SystemExit("Expected seven independent source solutions")
        capture(
            "source-solutions-FIRST-digest",
            ["python3", ".agents/skills/ld-s10y-choice/scripts/prepare.py", "digest", str(path)],
        )
        canonical = json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":")).encode("utf-8")
        receipt = {
            "path": str(path),
            "file_sha256": hashlib.sha256(raw).hexdigest(),
            "canonical_sha256": hashlib.sha256(canonical).hexdigest(),
            "source_count": 7,
            "all_four_drafts_absent_at_freeze": True,
            "frozen": True,
        }
        with (OUT / "receipts/source-solutions-FIRST-freeze.json").open("x", encoding="utf-8") as stream:
            stream.write(json.dumps(receipt, indent=2) + "\n")
        path.chmod(0o444)
        print(json.dumps(receipt, indent=2))
    elif phase == "validate":
        for card in ("n101", "t11"):
            for language in ("zh", "en"):
                capture(
                    card + "-" + language + "-validate-first",
                    [
                        "python3", ".agents/skills/ld-s10y-choice/scripts/validate.py",
                        "--repo", ".", "--seed", str(OUT / card / "seed.json"),
                        "--draft", str(OUT / card / language / "draft.json"),
                    ],
                )
    else:
        raise SystemExit("Unknown phase")
