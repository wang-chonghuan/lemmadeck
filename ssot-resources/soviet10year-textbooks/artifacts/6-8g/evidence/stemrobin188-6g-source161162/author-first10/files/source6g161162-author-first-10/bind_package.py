import datetime
import hashlib
import json
import os
from pathlib import Path
import stat


REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OWN = Path(__file__).resolve().parent


def bind(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    info = path.stat()
    return {
        "path": str(path.absolute()),
        "sha256": digest.hexdigest(),
        "bytes": info.st_size,
        "mode": f"{stat.S_IMODE(info.st_mode):04o}",
        "symlink": path.is_symlink(),
    }


def save_new_json(path, value):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    os.chmod(path, 0o444)


def main():
    if Path.cwd() != REPO:
        raise SystemExit("Package binding requires exact repository cwd")
    report_path = OWN / "Report.json"
    manifest_path = OWN / "Manifest.json"
    if manifest_path.exists() or stat.S_IMODE(report_path.stat().st_mode) == 0o444:
        raise SystemExit("Refusing to repeat sealed package binding")
    report = json.loads(report_path.read_text(encoding="utf-8"))
    commands = OWN / "evidence" / "commands"
    receipts = []
    for path in sorted(commands.glob("*.json")):
        receipt = json.loads(path.read_text(encoding="utf-8"))
        for stream in receipt["streams"].values():
            actual = bind(Path(stream["path"]))
            if any(actual[key] != stream[key] for key in ("sha256", "bytes", "mode")):
                raise SystemExit(f"Recorded stream drift: {stream['path']}")
        receipts.append({
            "run_id": receipt["run_id"],
            "argv": receipt["argv"],
            "cwd": receipt["cwd"],
            "exit_status": receipt["exit_status"],
            "receipt": bind(path),
            "streams": receipt["streams"],
        })
    pages = []
    for number in (161, 162):
        page = f"{number:04d}"
        files = {
            "FIRST": OWN / f"evidence/FIRST/{page}/source-FIRST.md",
            "author_draft": OWN / f"evidence/page-{page}.author-draft.md",
            "audit_snapshot": OWN / f"evidence/page-{page}.native-audit.json",
            "working_md": OWN / f"artifacts/6-8g/pages/{page}/page.md",
            "working_json": OWN / f"artifacts/6-8g/pages/{page}/page.json",
            "working_audit": OWN / f"artifacts/6-8g/pages/{page}/audit.json",
            "source_original": OWN / f"work/6-8g/pages/{page}/page.png",
            "prepared_template": OWN / f"work/6-8g/pages/{page}/page.template.md",
            "prepared_layout": OWN / f"work/6-8g/pages/{page}/layout.json",
            "unviewed_grid": OWN / f"work/6-8g/pages/{page}/page.grid.png",
        }
        bindings = {name: bind(path) for name, path in files.items()}
        expected_first = report["first_protocol"][f"{number}_sha256"]
        if bindings["FIRST"]["sha256"] != expected_first or bindings["FIRST"]["mode"] != "0444":
            raise SystemExit("FIRST hash/mode drift")
        if bindings["working_audit"]["sha256"] != bindings["audit_snapshot"]["sha256"]:
            raise SystemExit("Audit snapshot drift")
        audit = json.loads(files["working_audit"].read_text(encoding="utf-8"))
        pages.append({
            "physical_page": number,
            "files": bindings,
            "native_audit_facts": audit,
            "native_crop_files": [
                bind(path)
                for path in sorted((OWN / f"work/6-8g/pages/{page}/figures").glob("*.png"))
            ],
        })
    external_paths = {
        "source_manifest": REPO / "ssot-resources/soviet10year-textbooks/sources/manifest.json",
        "retained_source_pdf": REPO / "ssot-resources/soviet10year-textbooks/sources/soviet10years/6-8g 苏联十年制学校数学教材 几何 六-八年级.pdf",
        "native_p2c": REPO / ".claude/skills/ld-s10y-lesson/tools/p2c.py",
        "native_layout": REPO / ".claude/skills/ld-s10y-lesson/tools/layout.py",
        "python_argv_executable": REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python",
        "lesson_rules": REPO / ".claude/skills/ld-s10y-lesson/SKILL.md",
        "production_resume_rules": REPO / ".claude/skills/ld-s10y-lesson/references/production-resume.md",
        "bounded_image_rules": REPO / ".agents/skills/ld-s10y-image/SKILL.md",
    }
    external = {name: bind(path) for name, path in external_paths.items()}
    if external["retained_source_pdf"]["sha256"] != "d06ea093886065380febda597331bb5d48c81303d955161f2f84a7f11c116e5c":
        raise SystemExit("Retained source PDF differs from prepared source binding")
    report["bindings"] = {
        "pages": pages,
        "execution_receipts": receipts,
        "external_authorized_inputs": external,
        "external_binding_time": "Measured at package sealing; no execution-time immutability asserted for shared tool files.",
        "failure_crops": [
            bind(path) for path in sorted((OWN / "evidence/failure-crops").glob("*.png"))
        ],
        "manifest_query_failure": bind(OWN / "evidence/manifest-query-failure.json"),
    }
    report["sealed_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with report_path.open("w", encoding="utf-8") as stream:
        json.dump(report, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    os.chmod(report_path, 0o444)
    owned = []
    for path in sorted(OWN.rglob("*")):
        if not path.is_file() or path == manifest_path:
            continue
        item = bind(path)
        item["relative_path"] = str(path.relative_to(OWN))
        item["ownership"] = "exclusive sidecar"
        item["evidence"] = item["relative_path"].startswith("evidence/")
        if item["evidence"] and item["mode"] != "0444":
            raise SystemExit(f"Evidence not immutable: {path}")
        owned.append(item)
    manifest = {
        "schema": "source-author/manifest@1",
        "ticket": report["ticket"],
        "run": report["run"],
        "owned_root": str(OWN),
        "status": report["status"],
        "independent_approval": False,
        "all_owned_files_except_manifest_itself": owned,
        "owned_file_count_except_manifest": len(owned),
        "external_authorized_inputs": external,
        "self_binding": {
            "path": str(manifest_path),
            "mode": "0444",
            "sha256_transport": "Returned by the package command and final response, not stored recursively inside this manifest",
        },
    }
    save_new_json(manifest_path, manifest)
    print(json.dumps({
        "Report": bind(report_path),
        "Manifest": bind(manifest_path),
        "owned_file_count_including_manifest": len(owned) + 1,
        "evidence_files": sum(item["evidence"] for item in owned),
        "charged_images": report["counters"]["charged_images_total"],
        "native_finalize_exit_status": report["counters"]["finalize_exit_status"],
        "semantic_or_independent_approval": False,
        "exec_sessions_running": 0,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
