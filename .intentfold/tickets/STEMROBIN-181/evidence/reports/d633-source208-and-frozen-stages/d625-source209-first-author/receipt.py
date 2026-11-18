import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[4]
PREP = ROOT.parent / "d621-source209-first-preparation"
EXPECTED = "c550188789a2792cab47fb22e63abd4e258297364b709c98a27d15ae4a0471fe"
PYTHON = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
P2C = REPO / ".claude/skills/ld-s10y-lesson/tools/p2c.py"


def sha(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def tree(path):
    return {
        str(p.relative_to(ROOT)): {"sha256": sha(p), "bytes": p.stat().st_size}
        for p in sorted(path.rglob("*")) if p.is_file()
    }


def clock():
    return datetime.now(timezone.utc).isoformat()


def status():
    result = subprocess.run(
        ["git", "status", "--short", "--branch", "--untracked-files=no"],
        cwd=REPO, capture_output=True, text=True,
    )
    return {"exitCode": result.returncode, "stdout": result.stdout, "stderr": result.stderr}


def external():
    files = [P2C, P2C.with_name("vectorize.py"), P2C.with_name("layout.py"),
             P2C.with_name("blocks.py"), P2C.with_name("normalize.py"),
             P2C.with_name("mathcheck.py"), P2C.parent.parent / "profiles/soviet-cn.json",
             PREP / "manifest.json"]
    manifest = json.loads((PREP / "manifest.json").read_text())
    files += [REPO / item["path"] for item in manifest["inputs"]]
    return {str(p): sha(p) for p in files}


def initialize():
    assert sha(PREP / "manifest.json") == EXPECTED, "Preparation manifest SHA mismatch"
    assert not (ROOT / "initialized.json").exists(), "Already initialized"
    manifest = json.loads((PREP / "manifest.json").read_text())
    expected_files = {REPO / item["path"]: item["sha256"] for item in manifest["inputs"]}
    actual_files = {p for p in (PREP / "work").rglob("*") if p.is_file()}
    assert actual_files == set(expected_files), "Preparation work is not exactly source209"
    assert not list((PREP / "source").iterdir()), "Unexpected prepared source contents"
    for path, digest in expected_files.items():
        assert sha(path) == digest, str(path)
    shutil.copytree(PREP / "source", ROOT / "source")
    shutil.copytree(PREP / "work", ROOT / "work")
    for path in (ROOT / "work").rglob("*"):
        if path.is_file():
            path.chmod(0o444)
    (ROOT / "source/10p/pages/0209").mkdir(parents=True)
    (ROOT / "tmp").mkdir()
    shutil.copy2(PREP / "manifest.json", ROOT / "preparation-manifest.json")
    shutil.copy2(PREP / "prepare-209.receipt.json", ROOT / "preparation-native.receipt.json")
    save(ROOT / "initialized.json", {
        "time": clock(), "ticket": "STEMROBIN-181", "batch": "D033",
        "book": "10p", "physicalPage": 209, "ownedRoot": str(ROOT),
        "preparationManifestSHA256": EXPECTED,
        "copiedInputs": tree(ROOT / "work"),
        "externalBefore": external(), "gitBefore": status(),
        "parentOldImageCount": 24, "newParentImages": 0, "oldBudgetReset": False,
        "incoming208": {
            "status": "AUTHOR-TEXT-ONLY-INDEPENDENT-REVIEW-PENDING",
            "block": "p0208#6", "open": True,
            "start": "像透明物体一样，不透明的物体同样也可以用投影仪在屏上成像. 这样的仪器叫做反射映画器. 为了得到不透明物",
            "authorReportSHA256": "6b96c152c684ff01d1a9eb38cacc986af5e3a9b4d6a6ef5a1d02a75955e42cc8",
            "review": "d624-running",
        },
        "excluded": ["source208-images", "backend", "auth", ".env", "prepare",
                     "canonical-writes", "assemble", "database", "git-writes",
                     "deploy", "paid-calls", "new-workers", "worktrees", "branches"],
    })
    save(ROOT / "open-ledger.json", {
        "context": "fresh-short-lived-source209-author", "batchLimit": 8,
        "contextLimit": 24, "count": 0, "images": [],
        "parentOldImageCount": 24, "newParentImages": 0, "oldBudgetReset": False,
    })


def record_open(value, purpose):
    path = Path(value).resolve()
    assert path.is_relative_to(ROOT) and path.is_file()
    ledger = json.loads((ROOT / "open-ledger.json").read_text())
    assert ledger["count"] < 8 and ledger["count"] < 24, "Image-open budget exhausted"
    ledger["count"] += 1
    ledger["images"].append({
        "open": ledger["count"], "path": str(path), "sha256": sha(path),
        "purpose": purpose, "time": clock(),
    })
    save(ROOT / "open-ledger.json", ledger)


def crop(name, box):
    from PIL import Image
    out = ROOT / "evidence" / name
    assert not out.exists()
    out.parent.mkdir(exist_ok=True)
    Image.open(ROOT / "work/10p/pages/0209/page.png").crop(tuple(box)).save(out)
    save(out.with_suffix(".crop.json"), {
        "source": str(ROOT / "work/10p/pages/0209/page.png"),
        "sourceSHA256": sha(ROOT / "work/10p/pages/0209/page.png"),
        "boxXYXY": box, "output": str(out), "outputSHA256": sha(out),
        "transformation": "unscaled-unaltered-source-pixel-crop",
    })


def seal_first():
    target = ROOT / "first-source"
    assert not (target / "seal.json").exists()
    page = ROOT / "source/10p/pages/0209/page.md"
    shutil.copy2(page, target / "page.md")
    assert (target / "inventory.json").is_file()
    save(target / "seal.json", {
        "status": "FIRST-AUTHOR-INPUT-FROZEN-BEFORE-FIRST-NATIVE-FINALIZE",
        "time": clock(), "files": tree(target),
        "nativeFinalizeInvocationsBeforeSeal": 0,
        "nativeVectorizeInvocationsBeforeSeal": 0,
        "sourceSHA256": sha(ROOT / "work/10p/pages/0209/page.png"),
        "preparationManifestSHA256": EXPECTED,
        "openLedgerAtSeal": json.loads((ROOT / "open-ledger.json").read_text()),
        "independentApproval": False,
    })
    for path in target.iterdir():
        if path.is_file():
            path.chmod(0o444)


def native(command):
    assert command in ("finalize", "vectorize")
    seal = ROOT / "first-source/seal.json"
    assert seal.is_file()
    for rel, info in json.loads(seal.read_text())["files"].items():
        assert sha(ROOT / rel) == info["sha256"]
    stage = ROOT / "native" / (command + "-first")
    assert not stage.exists(), "First native invocation already exists; no retry loop"
    if command == "vectorize":
        result = json.loads((ROOT / "native/finalize-first/receipt.json").read_text())
        assert result["exitCode"] == 0, "Finalize did not pass"
    stage.mkdir(parents=True)
    save(stage / "before.json", {"time": clock(), "source": tree(ROOT / "source"),
                                "work": tree(ROOT / "work"), "git": status()})
    args = [str(PYTHON), "-B", str(P2C), command, "--book", "10p", "--page", "209",
            "--root", str(ROOT / "source"), "--work", str(ROOT / "work")]
    env = dict(os.environ, TMPDIR=str(ROOT / "tmp"), TMP=str(ROOT / "tmp"),
               TEMP=str(ROOT / "tmp"), PYTHONDONTWRITEBYTECODE="1")
    save(stage / "started.json", {"time": clock(), "command": args, "invocations": 1,
                                  "TMPDIR": env["TMPDIR"], "bytecode": False})
    result = subprocess.run(args, cwd=REPO, env=env, capture_output=True, text=True)
    (stage / "stdout.txt").write_text(result.stdout)
    (stage / "stderr.txt").write_text(result.stderr)
    shutil.copytree(ROOT / "source", stage / "output-source")
    figures = ROOT / "work/10p/pages/0209/figures"
    if figures.exists():
        shutil.copytree(figures, stage / "output-figures")
    save(stage / "after.json", {"time": clock(), "source": tree(ROOT / "source"),
                               "work": tree(ROOT / "work"), "git": status()})
    save(stage / "receipt.json", {
        "command": args, "invocations": 1, "exitCode": result.returncode,
        "signal": -result.returncode if result.returncode < 0 else None,
        "status": "PASS" if result.returncode == 0 else "FAIL",
        "stdoutSHA256": sha(stage / "stdout.txt"),
        "stderrSHA256": sha(stage / "stderr.txt"),
        "beforeSHA256": sha(stage / "before.json"),
        "afterSHA256": sha(stage / "after.json"),
        "firstInputSealSHA256": sha(seal),
        "independentSourceRawSvgApproval": False,
    })
    print(result.stdout, end="")
    print(result.stderr, end="", file=sys.stderr)
    print("RECEIPT", str(stage / "receipt.json"))
    return result.returncode


def preview(figure):
    assert figure in ("fig-183", "fig-184")
    svg = ROOT / "work/10p/pages/0209/figures" / (figure + ".svg")
    out = ROOT / "evidence" / (figure + ".full-svg-preview.png")
    assert svg.is_file() and not out.exists()
    first_receipt = ROOT / "evidence" / (figure + ".svg-preview.receipt.json")
    assert first_receipt.is_file() and json.loads(first_receipt.read_text())["exitCode"] == 1
    first_receipt.chmod(0o444)
    repaired_receipt = ROOT / "evidence" / (figure + ".svg-preview-repaired.receipt.json")
    assert not repaired_receipt.exists(), "Preview repair already attempted"
    out.parent.mkdir(parents=True, exist_ok=True)
    args = ["node", str(P2C.with_name("svg_raster.js")), str(svg), str(out)]
    env = dict(os.environ, TMPDIR=str(ROOT / "tmp"), PYTHONDONTWRITEBYTECODE="1")
    result = subprocess.run(args, cwd=P2C.parent.parent, env=env, capture_output=True, text=True)
    save(repaired_receipt, {
        "command": args, "exitCode": result.returncode,
        "stdout": result.stdout, "stderr": result.stderr,
        "svgSHA256": sha(svg), "previewSHA256": sha(out) if out.exists() else None,
        "note": "Full SVG raster preview only; no second vectorize invocation",
        "preservedFirstFailure": str(first_receipt),
        "preservedFirstFailureSHA256": sha(first_receipt),
        "surgicalRepair": "Create owned evidence directory before native preview output write",
        "previewRepairAttempts": 1,
    })
    print(result.stdout, end="")
    return result.returncode


def verify():
    import numpy as np
    from PIL import Image
    import xml.etree.ElementTree as ET
    sys.path.insert(0, str(P2C.parent))
    import vectorize as vector_module

    data = json.loads((ROOT / "source/10p/pages/0209/page.json").read_text())
    audit = json.loads((ROOT / "source/10p/pages/0209/audit.json").read_text())
    inventory = json.loads((ROOT / "first-source/inventory.json").read_text())
    assert audit["errors"] == [] and audit["lines_printed"] == audit["lines_md"] == 17
    assert len(data["blocks"]) == len(inventory["objects"]) == 9
    assert not [b for b in data["blocks"] if b["kind"] in ("ex", "exhead")]
    assert data["blocks"][2]["cont"] and not data["blocks"][2]["open"]
    assert data["blocks"][3]["lines"] == ["79. 眼睛　眼镜"]
    assert data["blocks"][4]["open"]
    assert data["blocks"][6]["samerow"]
    assert data["blocks"][7]["cont"] and data["blocks"][7]["open"]
    assert data["blocks"][7]["lines"][-1].endswith("特殊")
    assert not data["meta"]["errata"] and not audit["normalizations"]
    source = Image.open(ROOT / "work/10p/pages/0209/page.png")
    figures = []
    for item in audit["figures"]:
        fid = item["id"]
        x, y, w, h = item["box"]
        padding = item.get("crop_padding_px", 12)
        box = [max(0, x - padding), max(0, y - padding),
               min(source.width, x + w + padding), min(source.height, y + h + padding)]
        png = ROOT / "work/10p/pages/0209/figures" / (fid + ".png")
        svg = png.with_suffix(".svg")
        preview_file = ROOT / "evidence" / (fid + ".full-svg-preview.png")
        actual = Image.open(png)
        crop_exact = np.array_equal(np.asarray(actual), np.asarray(source.crop(box)))
        assert crop_exact, fid + " RAW is not exact source crop"
        document = ET.parse(svg).getroot()
        paths = document.findall("{http://www.w3.org/2000/svg}path")
        assert len(paths) == 1 and paths[0].get("fill-rule") == "evenodd"
        assert paths[0].get("fill") == "currentColor"
        assert not document.findall(".//{http://www.w3.org/2000/svg}image")
        original_ink = vector_module._ink(png)
        preview_ink = vector_module._ink(preview_file)
        assert original_ink.shape == preview_ink.shape
        missing = int((original_ink & ~vector_module._dilate(preview_ink, 1)).sum())
        extra = int((preview_ink & ~vector_module._dilate(original_ink, 1)).sum())
        ink = int(original_ink.sum())
        ratio = (missing + extra) / ink
        assert ratio <= 0.02
        figures.append({
            "id": fid, "sourceBoxXYWH": item["box"], "rawCropBoxXYXY": box,
            "paddingPx": padding, "rawIsExactUnalteredSourceCrop": crop_exact,
            "rawSize": list(actual.size), "rawSHA256": sha(png), "svgSHA256": sha(svg),
            "fullSvgPreviewSHA256": sha(preview_file), "svgSingleEvenOddCurrentColorPath": True,
            "svgRasterImageElements": 0, "missingPixels": missing, "extraPixels": extra,
            "sourceInkPixels": ink, "mismatchRatio": ratio,
            "mismatchLimit": 0.02, "tolerancePx": 1,
            "nativeVectorizeInvocations": 1,
            "authorVisualObservations": "Full original RAW crop and full SVG preview opened; source labels, geometry and strokes retained; no caption or adjacent prose contamination observed.",
            "independentSourceRawSvgApproval": False,
        })
    save(ROOT / "verification.json", {
        "time": clock(), "status": "AUTHOR-MECHANICAL-PASS-INDEPENDENT-PENDING",
        "firstInventorySHA256": sha(ROOT / "first-source/inventory.json"),
        "firstPageMDSHA256": sha(ROOT / "first-source/page.md"),
        "firstSealSHA256": sha(ROOT / "first-source/seal.json"),
        "nativePageMDSHA256": sha(ROOT / "source/10p/pages/0209/page.md"),
        "nativePageJSONSHA256": sha(ROOT / "source/10p/pages/0209/page.json"),
        "nativeAuditSHA256": sha(ROOT / "source/10p/pages/0209/audit.json"),
        "printedRows": 17, "blocks": 9, "originalProblems": 0, "figures": figures,
        "n78RightBoundary": inventory["boundaries"]["n78Right"],
        "n79RightBoundary": inventory["boundaries"]["n79Right"],
        "imageOpenCount": json.loads((ROOT / "open-ledger.json").read_text())["count"],
        "independentSourceRawSvgApproval": False,
    })
    print(json.dumps(figures, ensure_ascii=False, indent=2))


def finish():
    report = ROOT / "report.json"
    assert report.is_file()
    before = json.loads((ROOT / "initialized.json").read_text())["externalBefore"]
    after = external()
    save(ROOT / "outside-after.json", {
        "time": clock(), "git": status(), "hashes": after,
        "changedReadOnlyInputs": [p for p, digest in before.items() if after[p] != digest],
        "writesOutsideOwnedRootByThisAuthor": 0,
    })
    assert before == after, "Read-only preparation/tool input changed; inspect receipt"
    save(ROOT / "hash-manifest.json", {
        "schema": "source209-first-author/hash-manifest@1",
        "time": clock(), "ownedRoot": str(ROOT), "files": tree(ROOT),
        "exclusions": ["hash-manifest.json (self)", "freeze.receipt.json (self-receipt)"],
        "finalMode": "0444", "independentApproval": False,
    })
    for path in ROOT.rglob("*"):
        if path.is_file():
            path.chmod(0o444)
    failures = [str(p) for p in ROOT.rglob("*") if p.is_file() and p.stat().st_mode & 0o777 != 0o444]
    save(ROOT / "freeze.receipt.json", {
        "time": clock(), "status": "FROZEN-0444" if not failures else "FAIL",
        "fileCountIncludingThisReceipt": sum(p.is_file() for p in ROOT.rglob("*")) + 1,
        "non0444": failures, "hashManifestSHA256": sha(ROOT / "hash-manifest.json"),
        "reportSHA256": sha(report), "allFilesSHA256Verified": all(
            sha(ROOT / rel) == info["sha256"]
            for rel, info in json.loads((ROOT / "hash-manifest.json").read_text())["files"].items()
        ),
    })
    (ROOT / "freeze.receipt.json").chmod(0o444)
    assert not failures
    for name in ("report.json", "first-source/inventory.json", "first-source/page.md",
                 "first-source/seal.json", "source/10p/pages/0209/page.md",
                 "source/10p/pages/0209/page.json", "source/10p/pages/0209/audit.json",
                 "open-ledger.json", "hash-manifest.json", "freeze.receipt.json"):
        path = ROOT / name
        if path.is_file():
            print(str(path), sha(path))


parser = argparse.ArgumentParser()
parser.add_argument("action", choices=["initialize", "open", "crop", "seal-first", "finalize",
                                      "vectorize", "preview", "verify", "finish"])
parser.add_argument("--path")
parser.add_argument("--purpose")
parser.add_argument("--name")
parser.add_argument("--box", nargs=4, type=int)
parser.add_argument("--figure")
args = parser.parse_args()
if args.action == "initialize":
    initialize()
elif args.action == "open":
    record_open(args.path, args.purpose)
elif args.action == "crop":
    crop(args.name, args.box)
elif args.action == "seal-first":
    seal_first()
elif args.action in ("finalize", "vectorize"):
    sys.exit(native(args.action))
elif args.action == "preview":
    sys.exit(preview(args.figure))
elif args.action == "verify":
    verify()
elif args.action == "finish":
    finish()
