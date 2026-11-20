import hashlib
import json
import os
import stat
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
inventory = ROOT / "original82-first-inventory.json"
digest_path = ROOT / "original82-first-inventory.sha256"
digest = hashlib.sha256(inventory.read_bytes()).hexdigest()
with digest_path.open("x") as out:
    out.write(f"{digest}  {inventory.name}\n")
os.chmod(inventory, 0o444)
os.chmod(digest_path, 0o444)
records = []
for path in (inventory, digest_path):
    info = path.stat()
    mode = stat.S_IMODE(info.st_mode)
    assert mode == 0o444
    records.append({
        "path": path.name,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "bytes": info.st_size,
        "mode": f"{mode:04o}",
        "ctimeNs": info.st_ctime_ns,
        "mtimeNs": info.st_mtime_ns,
    })
record = {
    "schema": "first-seal-before-manifest-evidence@1",
    "sealedAtUTC": datetime.now(timezone.utc).isoformat(),
    "inventoryAndDigestActualMode0444": True,
    "manifestOpenedYet": False,
    "files": records,
}
with (ROOT / "first-seal-evidence.json").open("x") as out:
    json.dump(record, out, indent=2)
    out.write("\n")
print(json.dumps(record, indent=2))
