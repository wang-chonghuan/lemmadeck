"""Seal the owned evidence manifest without opening images for inspection."""
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import stat

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[4]


def sha(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def main():
    if Path.cwd().resolve() != REPO:
        raise SystemExit("Wrong checkout cwd")
    if (ROOT / "MANIFEST.json").exists():
        raise SystemExit("Manifest already sealed; do not overwrite")
    firstlocks = []
    for page in (163, 164):
        record = json.loads((ROOT / f"source0{page}.FIRSTlock.json").read_text())
        for entry in record["files"]:
            path = Path(entry["path"])
            if sha(path) != entry["sha256"] or stat.S_IMODE(path.stat().st_mode) != 0o444:
                raise SystemExit(f"FIRSTlock drift: {path}")
        candidate = json.loads((ROOT / f"candidate0{page}.FIRSTlock.json").read_text())
        if datetime.fromisoformat(record["frozen_at"]) >= datetime.fromisoformat(candidate["frozen_at"]):
            raise SystemExit(f"FIRSTlock not before candidate: {page}")
        candidate_stat = candidate["files"][0]["stat"]
        if max(entry["stat"]["ctime_ns"] for entry in record["files"]) >= candidate_stat["mtime_ns"]:
            raise SystemExit(f"Source freeze not before candidate creation: {page}")
        for entry in candidate["files"]:
            if sha(Path(entry["path"])) != entry["sha256"]:
                raise SystemExit(f"Draft drift: {page}")
        firstlocks.append({"page": page, "source": record, "candidate": candidate})
    receipts = []
    for name in ("prepare-range", "finalize0163", "finalize0164"):
        path = ROOT / f"{name}.receipt.json"
        receipt = json.loads(path.read_text())
        for entry in receipt["streams"].values():
            if sha(Path(entry["path"])) != entry["sha256"]:
                raise SystemExit(f"Execution stream drift: {name}")
        receipts.append(receipt)
    for path in ROOT.rglob("*"):
        if path.is_file() and (path.name.endswith(".FIRSTlock.json")
                               or path.name.endswith(".receipt.json")
                               or path.suffix in (".stdout", ".stderr")):
            path.chmod(0o444)
    files = []
    for path in sorted(ROOT.rglob("*")):
        if path.is_file():
            st = path.stat()
            files.append({
                "path": str(path), "relative_path": str(path.relative_to(ROOT)),
                "sha256": sha(path), "bytes": st.st_size,
                "mode": oct(stat.S_IMODE(st.st_mode)), "mtime_ns": st.st_mtime_ns,
            })
    manifest = {
        "status": "SOURCE AUTHOR_ONLY; no independent review or canonical approval",
        "cwd": str(Path.cwd()), "root": str(ROOT),
        "sealed_at": datetime.now(timezone.utc).isoformat(),
        "scope": {"book": "6-8g", "physical_pages": [163, 164]},
        "ledger": json.loads((ROOT / "ledger.json").read_text()),
        "firstlocks": firstlocks, "actual_executions": receipts, "files": files,
        "manifest_self_hash": "excluded; returned by seal stdout",
    }
    path = ROOT / "MANIFEST.json"
    with path.open("x", encoding="utf-8") as stream:
        json.dump(manifest, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    path.chmod(0o444)
    print(json.dumps({
        "manifest": str(path), "sha256": sha(path), "mode": "0444",
        "owned_files": len(files), "FIRSTlock_checks": "passed",
        "actual_execution_receipts": len(receipts),
        "charged_images": manifest["ledger"]["charged_images"],
        "author_active_sessions": 0,
    }, indent=2))


if __name__ == "__main__":
    main()
