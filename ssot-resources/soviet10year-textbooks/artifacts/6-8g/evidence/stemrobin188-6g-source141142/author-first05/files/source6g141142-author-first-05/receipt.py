import datetime
import hashlib
import json
import os
from pathlib import Path
import shutil
import stat
import subprocess
import sys


OWN = Path(__file__).resolve().parent
REPO = OWN.parents[4]


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def facts(path):
    path = Path(path).resolve()
    info = path.stat()
    return {
        "path": str(path),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "bytes": info.st_size,
        "mode": oct(stat.S_IMODE(info.st_mode)),
        "mtime_ns": info.st_mtime_ns,
        "ctime_ns": info.st_ctime_ns,
    }


def owned(path):
    path = Path(path)
    if not path.is_absolute():
        path = OWN / path
    path = path.resolve()
    if not path.is_relative_to(OWN):
        raise ValueError("Write outside OWN refused")
    return path


def save(name, record):
    directory = OWN / "receipts"
    directory.mkdir(exist_ok=True)
    target = directory / (name + ".json")
    with target.open("x", encoding="utf-8") as stream:
        json.dump(record, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    print(json.dumps(facts(target), ensure_ascii=False))


if __name__ == "__main__":
    action, name, *args = sys.argv[1:]
    started = now()
    if action == "run":
        if args[0] == "--":
            args = args[1:]
        directory = OWN / "receipts"
        directory.mkdir(exist_ok=True)
        stdout = directory / (name + ".stdout")
        stderr = directory / (name + ".stderr")
        with stdout.open("xb") as out, stderr.open("xb") as err:
            result = subprocess.run(args, cwd=REPO, stdout=out, stderr=err)
        save(name, {
            "argv": args,
            "cwd": str(REPO),
            "started_at": started,
            "finished_at": now(),
            "exit_code": result.returncode,
            "streams": {"stdout": facts(stdout), "stderr": facts(stderr)},
        })
        sys.exit(result.returncode)
    elif action == "seal":
        source = owned(args[0])
        before = facts(source)
        os.chmod(source, 0o444)
        after = facts(source)
        assert before["sha256"] == after["sha256"]
        save(name, {
            "argv": ["chmod", "0444", str(source)],
            "cwd": str(REPO),
            "started_at": started,
            "finished_at": now(),
            "exit_code": 0,
            "before": before,
            "after": after,
            "stat_and_hash_completed_at": now(),
        })
    elif action == "snapshot":
        source, destination = owned(args[0]), owned(args[1])
        before = facts(source)
        destination.parent.mkdir(parents=True, exist_ok=True)
        if destination.exists():
            raise FileExistsError(destination)
        shutil.copyfile(source, destination)
        os.chmod(destination, 0o444)
        after = facts(destination)
        assert before["sha256"] == after["sha256"]
        save(name, {
            "argv": ["snapshot", str(source), str(destination)],
            "cwd": str(REPO),
            "started_at": started,
            "finished_at": now(),
            "exit_code": 0,
            "source": before,
            "snapshot": after,
        })
    elif action == "crop":
        from PIL import Image
        source = owned(args[0])
        destination = owned(args[1])
        box = tuple(map(int, args[2:]))
        destination.parent.mkdir(parents=True, exist_ok=True)
        if destination.exists():
            raise FileExistsError(destination)
        with Image.open(source) as image:
            image.crop(box).save(destination)
        save(name, {
            "argv": ["crop", str(source), str(destination), *map(str, box)],
            "cwd": str(REPO),
            "started_at": started,
            "finished_at": now(),
            "exit_code": 0,
            "source": facts(source),
            "output": facts(destination),
            "box_xyxy": box,
        })
    else:
        raise ValueError(action)
