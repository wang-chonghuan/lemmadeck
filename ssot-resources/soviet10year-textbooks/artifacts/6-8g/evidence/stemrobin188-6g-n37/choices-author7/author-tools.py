import argparse
import hashlib
import http.server
import json
import os
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timezone


ROOT = Path("/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n37-choices7"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def serve(port):
    seed = json.loads((OWN / "seed.json").read_text())
    assets = {
        "/" + figure["id"] + ".svg": ROOT / figure["assets"][0]["path"]
        for figure in seed["figures"]
    }

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            asset = assets.get(self.path)
            if asset is None:
                self.send_error(404)
                return
            data = asset.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "image/svg+xml")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)

    http.server.HTTPServer(("127.0.0.1", port), Handler).serve_forever()


def validate(tag):
    paths = {
        name: OWN / (tag + "." + suffix)
        for name, suffix in (
            ("stdout", "stdout.txt"),
            ("stderr", "stderr.txt"),
            ("execution", "execution.json"),
        )
    }
    if any(path.exists() for path in paths.values()):
        raise SystemExit("Refusing to overwrite an execution record.")
    argv = [
        sys.executable,
        ".agents/skills/ld-s10y-choice/scripts/validate.py",
        "--repo", str(ROOT),
        "--seed", str(OWN / "seed.json"),
        "--draft", str(OWN / "draft.json"),
    ]
    started = datetime.now(timezone.utc).isoformat()
    draft_sha = sha(OWN / "draft.json")
    with paths["stdout"].open("xb") as out, paths["stderr"].open("xb") as err:
        result = subprocess.run(argv, cwd=ROOT, stdout=out, stderr=err)
    receipt = {
        "cwd": str(ROOT),
        "argv": argv,
        "exitCode": result.returncode,
        "started_at": started,
        "finished_at": datetime.now(timezone.utc).isoformat(),
        "draft_file_sha256": draft_sha,
        "streams": {
            name: {"path": str(paths[name]), "sha256": sha(paths[name])}
            for name in ("stdout", "stderr")
        },
        "review_argument_present": False,
    }
    with paths["execution"].open("x") as output:
        json.dump(receipt, output, ensure_ascii=False, indent=2)
        output.write("\n")
    print(json.dumps(receipt, ensure_ascii=False, indent=2))
    print(paths["stdout"].read_text(), end="")
    print(paths["stderr"].read_text(), end="", file=sys.stderr)
    raise SystemExit(result.returncode)


parser = argparse.ArgumentParser()
parser.add_argument("action", choices=("serve", "validate"))
parser.add_argument("--port", type=int, default=8937)
parser.add_argument("--tag", default="structural-001")
args = parser.parse_args()
if Path.cwd() != ROOT:
    raise SystemExit("Wrong workdir.")
if args.action == "serve":
    serve(args.port)
else:
    validate(args.tag)
