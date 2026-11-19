"""Private SOURCE238 FIRST staging, receipts, and immutable evidence."""
import argparse
import hashlib
import json
import os
import shutil
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path

R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = R / ".intentfold/tickets/STEMROBIN-181"
D = T / "tmp/d890-source238-first-author"
PREPARED = T / "tmp/d889-source238-first-preparation/work/10p/pages/0238"
WORK = D / "work"
ROOT = D / "root"
PAGE = ROOT / "10p/pages/0238"
FIRST = D / "first"
TOOL = R / ".claude/skills/ld-s10y-lesson/tools/p2c.py"
PYTHON = R / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
PDF = R / (
    "ssot-resources/soviet10year-textbooks/sources/soviet10years/"
    "10p 苏联中学课本 物理 十年级 .pdf"
)
NAMES = (
    "page.png", "page.grid.png", "layout.json", "page.template.md",
    "prepare.0001.stdout", "prepare.0001.stderr",
)
INCOMING = "当角度为 $\\varphi$ 时出现各最大值. 角 $\\varphi$ 由下列条件求出:"


def sha(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def save(path, value):
    assert path.absolute().resolve().is_relative_to(D)
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


def timestamp():
    return datetime.now(timezone.utc).isoformat()


def setup():
    from PIL import Image

    assert not WORK.exists() and not ROOT.exists() and not FIRST.exists()
    assert all((PREPARED / name).is_file() for name in NAMES)
    work_page = WORK / "10p/pages/0238"
    work_page.mkdir(parents=True)
    PAGE.mkdir(parents=True)
    (D / "inspection").mkdir()
    inputs = []
    for name in NAMES:
        source = PREPARED / name
        assert not source.is_symlink()
        target = work_page / name
        shutil.copyfile(source, target)
        inputs.append({
            "source": str(source), "copy": str(target),
            "bytes": source.stat().st_size, "sha256": sha(source),
            "copy_sha256": sha(target),
        })
        assert inputs[-1]["sha256"] == inputs[-1]["copy_sha256"]
    with Image.open(work_page / "page.png") as image:
        assert image.size == (1536, 2337)
        image.crop((160, 1000, 1360, 1295)).save(
            D / "inspection/colour-plate-citation.png"
        )
    save(D / "input-reuse.json", {
        "schema": "d890/source238-first-input-reuse@1",
        "created_utc": timestamp(), "repo": str(R), "write_root": str(D),
        "ticket": "STEMROBIN-181", "book": "10p", "source_page": 238,
        "prepare_reruns": 0, "prepared_inputs": inputs,
        "incoming_source237_author_openblock_exact": INCOMING,
        "source237_pass_claimed": False,
        "source239_opened": False,
        "inspection_crop": {
            "path": str(D / "inspection/colour-plate-citation.png"),
            "source": str(work_page / "page.png"),
            "box_xyxy": [160, 1000, 1360, 1295],
            "purpose": "Read the printed IV2,3 citation; not a figure crop.",
        },
    })
    print(json.dumps({"status": "STAGED", "work": str(WORK), "root": str(ROOT)}))


def native(command, name):
    receipt_dir = FIRST / "native"
    stdout = receipt_dir / f"{name}.0001.stdout"
    stderr = receipt_dir / f"{name}.0001.stderr"
    started = timestamp()
    start = time.monotonic()
    returncode = None
    execution_error = None
    with stdout.open("xb") as output, stderr.open("xb") as errors:
        try:
            result = subprocess.run(
                command, cwd=R, stdout=output, stderr=errors, check=False,
                env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"},
            )
            returncode = result.returncode
        except OSError as error:
            execution_error = str(error)
            errors.write((execution_error + "\n").encode("utf-8"))
    receipt = {
        "attempt": "FIRST", "command": command, "cwd": str(R),
        "started_utc": started, "finished_utc": timestamp(),
        "elapsed_seconds": round(time.monotonic() - start, 3),
        "returncode": returncode, "execution_error": execution_error,
        "stdout": str(stdout), "stdout_sha256": sha(stdout),
        "stderr": str(stderr), "stderr_sha256": sha(stderr),
    }
    save(receipt_dir / f"{name}.0001.receipt.json", receipt)
    return receipt


def finalize():
    assert not FIRST.exists(), "FIRST already exists: no rerun permitted"
    inputs = json.loads((D / "input-reuse.json").read_text(encoding="utf-8"))
    for item in inputs["prepared_inputs"]:
        assert sha(Path(item["source"])) == item["sha256"]
        assert sha(Path(item["copy"])) == item["sha256"]
    assert (PAGE / "page.md").is_file()
    (FIRST / "author").mkdir(parents=True)
    (FIRST / "native").mkdir()
    (FIRST / "output").mkdir()
    shutil.copyfile(PAGE / "page.md", FIRST / "author/page.md")
    author_sha = sha(FIRST / "author/page.md")
    command = [
        str(PYTHON), "-B", str(TOOL), "finalize", "--book", "10p",
        "--page", "238", "--root", str(ROOT), "--work", str(WORK),
        "--pdf", str(PDF),
        "--books", str(R / "ssot-resources/soviet10year-textbooks/sources"),
    ]
    finalize_receipt = native(command, "finalize")
    for name in ("page.md", "page.json", "audit.json"):
        if (PAGE / name).is_file():
            shutil.copyfile(PAGE / name, FIRST / "output" / name)
    audit = (
        json.loads((PAGE / "audit.json").read_text(encoding="utf-8"))
        if (PAGE / "audit.json").is_file() else None
    )
    passed = (
        finalize_receipt["returncode"] == 0
        and audit is not None and audit.get("errors") == []
    )
    pngs = sorted((WORK / "10p/pages/0238/figures").glob("*.png"))
    vectorize_receipt = None
    vectorize_status = "BLOCKED_FIRST_FINALIZE_FAILURE"
    if passed and pngs:
        vectorize_receipt = native([
            str(PYTHON), "-B", str(TOOL), "vectorize", "--book", "10p",
            "--page", "238", "--root", str(ROOT), "--work", str(WORK),
            "--pdf", str(PDF),
            "--books", str(R / "ssot-resources/soviet10year-textbooks/sources"),
        ], "vectorize")
        vectorize_status = (
            "PASS" if vectorize_receipt["returncode"] == 0 else "FAIL"
        )
        shutil.copytree(
            WORK / "10p/pages/0238/figures", FIRST / "output/figures"
        )
    elif passed:
        vectorize_status = "NOT_APPLICABLE_NO_OWNED_CROPS"
    status = "PASS" if passed else "FAIL"
    if vectorize_status == "FAIL":
        status = "FAIL"
    for item in inputs["prepared_inputs"]:
        assert sha(Path(item["source"])) == item["sha256"]
        assert sha(Path(item["copy"])) == item["sha256"]
    inventory = [
        {"path": str(path), "bytes": path.stat().st_size, "sha256": sha(path)}
        for path in sorted(FIRST.rglob("*")) if path.is_file()
    ]
    save(FIRST / "output-sha256.json", {"files": inventory})
    holds = [
        "FIRST author/native page result only; not SOURCE238 approval.",
        "Independent source-fidelity review and full-card approval are not performed.",
        "SOURCE237 is only the supplied author-bound openblock, not a full SOURCE237 PASS.",
        "SOURCE239 was not opened; no claim about its content or full-card completion.",
        "Original second colour-plate citation is IV2,3 without a comma after IV; "
        "preserved, not silently corrected or registered as a confirmed erratum.",
        "No canonical promotion, index/meter changes, Git writes, DB, publisher, "
        "deployment, or other-chat operations.",
    ]
    if status == "FAIL":
        holds.insert(0, "Stopped at the first native failure; no repair or rerun.")
    report = {
        "schema": "d890/source238-first-author@1",
        "created_utc": timestamp(), "status": status, "stage": "FIRST_AUTHOR_ONLY",
        "repo": str(R), "write_root": str(D), "ticket": "STEMROBIN-181",
        "book": "10p", "source_page": 238, "printed_page": 228,
        "input_reuse": str(D / "input-reuse.json"),
        "incoming_source237_author_openblock_exact": INCOMING,
        "incoming_boundary": "First p cont begins with d sin varphi = k lambda (7.9).",
        "right_boundary": {
            "last_line": "光线以比较大的角度入射到唱片上，图样将是很清晰的.",
            "last_prose_open": False, "source239_opened": False,
            "observation": "Final paragraph is complete on SOURCE238; no outgoing open block.",
        },
        "source_inventory": {
            "printed_text_rows_observed": 26, "prose_blocks": 6,
            "headings": 0, "exercises": 0, "tables": 0, "figures": 0,
            "footer": "• 228 •",
            "emphasis": "Only 主最大值 is bold in the definition line.",
            "formula": "$d\\sin\\varphi=k\\lambda$",
            "equation_number": "(7.9)",
            "greek": ["\\varphi", "\\lambda"], "latin": ["d", "k", "sin", "IV"],
            "superscripts": 0, "footnotes": 0,
        },
        "original_uncertainties": [{
            "kind": "printed_citation_irregularity",
            "block": "p0238#4",
            "original": "(彩图 IV2,3).",
            "observation": "The original and its private inspection crop show no comma "
            "between IV and 2. The intended separator is unverified.",
            "handling": "Preserved as printed; not corrected. Independent review HOLD.",
        }],
        "author_snapshot": str(FIRST / "author/page.md"),
        "author_sha256": author_sha,
        "native_output_directory": str(FIRST / "output"),
        "native_receipts_directory": str(FIRST / "native"),
        "finalize": finalize_receipt, "audit": audit,
        "vectorize": {
            "status": vectorize_status, "owned_crop_count": len(pngs),
            "receipt": vectorize_receipt,
        },
        "source_approval": "HOLD", "full_card_approval": "HOLD",
        "holds": holds,
        "usage": {
            "prepare_reruns": 0, "author_candidates": 1, "author_revisions": 0,
            "native_finalize_calls": 1,
            "native_vectorize_calls": int(vectorize_receipt is not None),
            "author_image_inspection_loads": 2, "batch_image_loads": [2],
            "context_image_loads": 2, "image_loads_include_reopens_and_crops": True,
            "image_paths_in_load_order": [
                str(PREPARED / "page.png"),
                str(D / "inspection/colour-plate-citation.png"),
            ],
            "paid_generation_calls": 0, "external_model_calls": 0,
            "source_pages_opened": [238], "other_chats_accessed": 0,
            "token_usage": None,
            "token_usage_note": "This runtime does not expose per-turn token billing.",
            "elapsed_native_seconds": finalize_receipt["elapsed_seconds"] + (
                vectorize_receipt["elapsed_seconds"] if vectorize_receipt else 0
            ),
        },
        "first_inventory": inventory,
        "pipeline_code": [
            {"path": str(path), "sha256": sha(path)}
            for path in (
                TOOL, TOOL.parent / "blocks.py", TOOL.parent / "layout.py",
                TOOL.parent / "normalize.py", TOOL.parent / "mathcheck.py",
                TOOL.parent / "production.py",
                TOOL.parent.parent / "profiles/soviet-cn.json",
            )
        ],
    }
    save(D / "report.json", report)
    report_text = (
        "# d890 SOURCE238 FIRST Author\n\n"
        f"FIRST native status: {status}. SOURCE approval: HOLD. Full-card approval: HOLD.\n\n"
        "Book 10p, physical SOURCE238, printed page 228. Only this original page was opened.\n"
        "Prepared d889 inputs and prepare.0001 logs reused byte-for-byte; prepare not rerun.\n\n"
        f"Incoming SOURCE237 author-bound openblock, exactly:\n\n> {INCOMING}\n\n"
        "SOURCE238 starts with `$d\\sin\\varphi=k\\lambda$`, numbered `(7.9)`.\n"
        "Its last prose line is `光线以比较大的角度入射到唱片上，图样将是很清晰的.`\n"
        "That paragraph closes on this page; no outgoing open block. SOURCE239 not opened.\n\n"
        "Inventory: 26 printed rows; six prose blocks; one footer; no headings, exercises, "
        "tables, figures, superscripts, or footnotes. The definition's 主最大值 is bold. "
        "Footer ornaments are preserved as `• 228 •`.\n\n"
        "Original uncertainty: `(彩图 IV2,3).` has no printed comma after `IV`. "
        "Preserved exactly; intended separator unverified. No confirmed erratum added.\n\n"
        f"Author snapshot: `{FIRST / 'author/page.md'}`\n"
        f"Author SHA-256: `{author_sha}`\n"
        f"Native outputs: `{FIRST / 'output'}`\n"
        f"Native receipts: `{FIRST / 'native'}`\n"
        f"Vectorize: {vectorize_status}; owned crops {len(pngs)}.\n\n"
        "Usage: one author candidate, zero revisions; prepare 0; finalize 1; "
        f"vectorize {int(vectorize_receipt is not None)}; image loads 2 "
        "(one original plus one citation crop; batch 2/8, context 2/24); "
        "paid-generation calls 0, external-model calls 0. Per-turn tokens are not exposed.\n\n"
        "HOLD:\n" + "".join(f"- {reason}\n" for reason in holds)
    )
    with (D / "report.md").open("x", encoding="utf-8") as stream:
        stream.write(report_text)
    all_files = sorted(
        path for path in D.rglob("*")
        if path.is_file() and path.name != "SHA256SUMS"
    )
    with (D / "SHA256SUMS").open("x", encoding="utf-8") as stream:
        for path in all_files:
            stream.write(f"{sha(path)}  {path.relative_to(D)}\n")
    for path in FIRST.rglob("*"):
        if path.is_file():
            path.chmod(0o444)
    for path in sorted(
        (path for path in FIRST.rglob("*") if path.is_dir()), reverse=True
    ):
        path.chmod(0o555)
    FIRST.chmod(0o555)
    for name in ("report.json", "report.md", "SHA256SUMS", "input-reuse.json", "first_run.py"):
        (D / name).chmod(0o444)
    print(json.dumps({
        "status": status, "source_approval": "HOLD", "full_card_approval": "HOLD",
        "report": str(D / "report.json"), "report_sha256": sha(D / "report.json"),
        "author_sha256": author_sha,
        "output_page_sha256": sha(FIRST / "output/page.md")
        if (FIRST / "output/page.md").exists() else None,
        "sha256sums": str(D / "SHA256SUMS"),
        "sha256sums_sha256": sha(D / "SHA256SUMS"),
        "vectorize_status": vectorize_status,
        "usage": report["usage"],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    assert Path.cwd() == R
    assert D.absolute().resolve() == D
    parser = argparse.ArgumentParser()
    parser.add_argument("stage", choices=("setup", "finalize"))
    args = parser.parse_args()
    setup() if args.stage == "setup" else finalize()
