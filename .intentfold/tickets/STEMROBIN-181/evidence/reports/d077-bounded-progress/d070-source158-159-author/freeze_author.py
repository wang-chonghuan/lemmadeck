"""Freeze existing two-page author outputs, without assembly or independent approval."""
from __future__ import annotations

import json
import os
from pathlib import Path
import shutil
import sys
from datetime import datetime, timezone

from author_tools import BASE, REPO, ROOT, WORK, PAGES, sha, write_new

TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))
import blocks as B
import layout
from PIL import Image


def copy_new(source, target):
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("xb") as stream:
        with source.open("rb") as original:
            shutil.copyfileobj(original, stream)
    if sha(source) != sha(target):
        raise SystemExit(f"STOP copy mismatch: {source}")


def freeze():
    for target in (BASE / "frozen", BASE / "author-freeze.json",
                   BASE / "author-freeze.sha256", BASE / "all-files.sha256"):
        if target.exists():
            raise SystemExit(f"STOP existing destination: {target}")
    if sorted(p.name for p in (ROOT / "10p/pages").iterdir()) != ["0158", "0159"]:
        raise SystemExit("STOP source scope changed")
    observation_path = BASE / "observations.json"
    observations = json.loads(observation_path.read_text(encoding="utf-8"))
    receipts = []
    for path in sorted((BASE / "receipts").glob("*/receipt.json")):
        record = json.loads(path.read_text(encoding="utf-8"))
        receipts.append({**record, "path": str(path.relative_to(BASE)),
                         "sha256": sha(path)})
    counts = {stage: sum(r["stage"] == stage for r in receipts)
              for stage in ("prepare", "finalize", "vectorize")}
    if counts != {"prepare": 2, "finalize": 2, "vectorize": 1}:
        raise SystemExit(f"STOP unexpected command counts: {counts}")
    if any(r["exit_code"] != 0 for r in receipts):
        raise SystemExit("STOP failed receipt needs an explicit preservation/repair route")
    frozen = BASE / "frozen"
    frozen.mkdir(exist_ok=False)
    page_records = []
    for page in PAGES:
        directory = ROOT / "10p/pages" / f"{page:04d}"
        work = WORK / "10p/pages" / f"{page:04d}"
        target = frozen / "pages" / f"{page:04d}"
        target.mkdir(parents=True, exist_ok=False)
        for filename in ("page.md", "page.json", "audit.json"):
            copy_new(directory / filename, target / filename)
        copy_new(work / "page.png", target / "page.png")
        for figure in sorted((work / "figures").glob("*")):
            if figure.is_file():
                copy_new(figure, target / "figures" / figure.name)
        original = (BASE / "receipts" / f"finalize-{page:04d}-initial" /
                    "before/source/10p/pages" / f"{page:04d}/page.md")
        copy_new(original, frozen / "author-input/pages" / f"{page:04d}/page.md")
        meta, blocks = B.parse((target / "page.md").read_text(encoding="utf-8"))
        audit = json.loads((target / "audit.json").read_text(encoding="utf-8"))
        ledger_spec = observations["pages"][str(page)]
        if len(blocks) != len(ledger_spec["block_row_ledger"]):
            raise SystemExit(f"STOP block ledger mismatch: {page}")
        ink = layout.ink_mask(Image.open(target / "page.png"))
        columns = ink.any(axis=0).nonzero()[0]
        content_width = int(columns[-1] - columns[0] + 1)
        for figure in audit["figures"]:
            x, y, width, height = figure["box"]
            ink[max(0, y):y + height, max(0, x):x + width] = False
        bands = layout.line_bands(ink, content_width)
        ledger = []
        seen_rows = set()
        for block, spec in zip(blocks, ledger_spec["block_row_ledger"]):
            if block["kind"] != spec["kind"] or len(block["lines"]) != len(spec["rows"]):
                raise SystemExit(f"STOP row shape mismatch: {spec['sourceRef']}")
            lines = []
            for text, row in zip(block["lines"], spec["rows"]):
                seen_rows.add(row)
                lines.append({"printed_row": row, "source_line": text,
                              "native_y_band": list(map(int, bands[row - 1]))})
            ledger.append({**spec, "cont": block["cont"], "open": block["open"],
                           "samerow": block["samerow"], "lines": lines})
        expected = ledger_spec["independently_observed_printed_rows"]
        if (seen_rows != set(range(1, expected + 1))
                or B.printed_lines(blocks) != expected
                or audit["lines_md"] != expected
                or audit["lines_printed"] != expected
                or audit["errors"]):
            raise SystemExit(f"STOP row/audit mismatch: {page}")
        page_records.append({
            "physical_page": page, "printed_page": meta["printed_page"],
            "sourceRefs": ledger_spec["sourceRefs"], "row_ledger": ledger,
            "independent_visual_rows": expected,
            "native_lines_md": audit["lines_md"],
            "native_lines_printed": audit["lines_printed"],
            "native_finalization_exit": next(r["exit_code"] for r in receipts
                                             if r["stage"] == "finalize"
                                             and r["pages"] == [page]),
            "native_normalizations": audit["normalizations"],
            "native_errors": audit["errors"],
            "source_page_png_sha256": sha(target / "page.png"),
            "author_input_md_sha256": sha(original),
            "frozen_page_md_sha256": sha(target / "page.md"),
            "frozen_page_json_sha256": sha(target / "page.json"),
            "frozen_audit_sha256": sha(target / "audit.json"),
            "figure_count": len(audit["figures"]),
            "figures": audit["figures"],
            "SOURCE": "pending", "RAW": "pending"
        })
    manifest_path = REPO / "ssot-resources/soviet10year-textbooks/sources/manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    pdf_record = next(p for p in manifest["pdfs"] if p["book"] == "10p")
    pdf_path = REPO / manifest["pdfRoot"] / pdf_record["file"]
    actual_pdf_sha = sha(pdf_path)
    if actual_pdf_sha != pdf_record["sha256"]:
        raise SystemExit("STOP source PDF manifest hash mismatch")
    prior = REPO / observations["boundaries"]["previous_text_only"]["path"]
    inputs = [
        REPO / "AGENTS.md", REPO / ".intentfold/readme.md",
        REPO / ".intentfold/project.json",
        REPO / ".intentfold/charter/product.md",
        REPO / ".intentfold/charter/engineering.md",
        REPO / ".intentfold/charter/operations.md",
        REPO / ".intentfold/tickets/STEMROBIN-181/ticket.json",
        REPO / ".claude/skills/ld-s10y-lesson/SKILL.md",
        REPO / ".agents/skills/ld-s10y-image/SKILL.md",
        REPO / ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",
        REPO / "ssot-resources/soviet10year-textbooks/toc/10p/zh.json",
        manifest_path, pdf_path, prior,
        Path("/Users/yong/.agents/skills/intentfold/SKILL.md"),
        Path("/Users/yong/.agents/skills/ips-chrome-background/SKILL.md")
    ]
    inputs.extend(TOOLS / name for name in
                  ("p2c.py", "layout.py", "blocks.py", "normalize.py",
                   "mathcheck.py", "vectorize.py", "svg_raster.js"))
    input_records = [{"path": str(path), "sha256": sha(path),
                      "bytes": path.stat().st_size} for path in inputs]
    for event in observations["visual_open_events"]:
        path = BASE / event["path"]
        event["sha256"] = sha(path)
        with Image.open(path) as image:
            event["dimensions"] = list(image.size)
    for figure in observations["figure_inventory"]:
        directory = frozen / "pages" / f"{figure['physical_page']:04d}/figures"
        figure["frozen_png"] = str((directory / f"{figure['id']}.png").relative_to(BASE))
        figure["frozen_svg"] = str((directory / f"{figure['id']}.svg").relative_to(BASE))
        figure["png_sha256"] = sha(BASE / figure["frozen_png"])
        figure["svg_sha256"] = sha(BASE / figure["frozen_svg"])
        with Image.open(BASE / figure["frozen_png"]) as image:
            figure["actual_png_size"] = list(image.size)
        if figure["actual_png_size"] != figure["expected_final_size"]:
            raise SystemExit("STOP figure size mismatch")
    opened_paths = {event["path"]: event for event in observations["visual_open_events"]}
    retained = []
    image_inventory = []
    for path in sorted(BASE.rglob("*")):
        if not path.is_file():
            continue
        relative = str(path.relative_to(BASE))
        digest = sha(path)
        retained.append({"path": relative, "sha256": digest,
                         "bytes": path.stat().st_size})
        if path.suffix.lower() in (".png", ".svg"):
            image_inventory.append({
                "path": relative, "sha256": digest,
                "actual_path_open_count": 1 if relative in opened_paths else 0,
                "same_bytes_as_opened_paths": [e["path"] for e in opened_paths.values()
                                              if e["sha256"] == digest],
                "is_grid": path.name == "page.grid.png",
                "independently_approved": False,
                "status": "opened-author-observed-pending" if relative in opened_paths
                          else "unopened-not-approved"
            })
    branch = (REPO / ".git").read_text(encoding="utf-8") if (REPO / ".git").is_file() else None
    record = {
        "schema": "STEMROBIN-181/bounded-original-source-author-freeze@1",
        "frozen_utc": datetime.now(timezone.utc).isoformat(),
        "ticket": "STEMROBIN-181",
        "cwd": str(REPO), "branch": "codex/STEMROBIN-181-textbooks",
        "checkout_git_pointer": branch,
        "unique_new_write_domain": str(BASE),
        "existing_batch_destination_found_at_entry": False,
        "author_only_freeze": True, "not_independent_approval": True,
        "SOURCE": "pending", "RAW": "pending",
        "book": "10p", "physical_pages": list(PAGES),
        "pdf_manifest_record": pdf_record, "actual_pdf_sha256": actual_pdf_sha,
        "previous_0157_text_md_sha256": sha(prior),
        "pages": page_records,
        "observations": observations,
        "command_counts": {
            **counts, "all_actual_exits": [r["exit_code"] for r in receipts],
            "prepare_exit_counts": {"0": 2},
            "finalize_exit_counts": {"0": 2},
            "vectorize_exit_counts": {"0": 1},
            "author_repair": 0, "affected_only_refinalize": 0,
            "vectorized_figures_pass": 1, "vectorized_figures_fail": 0
        },
        "receipts": receipts,
        "input_actual_hashes": input_records,
        "retained_image_path_inventory": image_inventory,
        "actual_file_hashes": retained,
        "hash_inventory_exclusions": ["author-freeze.json", "author-freeze.sha256",
                                      "all-files.sha256"],
        "native_temp_policy": {
            "finalize_and_vectorize_TMPDIR": str(WORK / "native-tmp"),
            "PYTHONDONTWRITEBYTECODE": "1",
            "resvg_ephemeral_raster_visually_opened": False,
            "resvg_ephemeral_raster_retained": False,
            "resvg_ephemeral_raster_sha256": None,
            "reason": "Stable vectorize deletes its internal TemporaryDirectory; no invented hash or visual approval."
        },
        "prior_FAIL_HOLD": "preserved, not modified or promoted",
        "old_or_other_author_files_overwritten": False,
        "completion_scope": "two-page author freeze only; independent SOURCE and RAW reviews remain pending"
    }
    write_new(BASE / "author-freeze.json", record)
    freeze_sha = sha(BASE / "author-freeze.json")
    with (BASE / "author-freeze.sha256").open("x", encoding="ascii") as stream:
        stream.write(f"{freeze_sha}  author-freeze.json\n")
    with (BASE / "all-files.sha256").open("x", encoding="utf-8") as stream:
        for entry in retained:
            stream.write(f"{entry['sha256']}  {entry['path']}\n")
        stream.write(f"{freeze_sha}  author-freeze.json\n")
        stream.write(f"{sha(BASE / 'author-freeze.sha256')}  author-freeze.sha256\n")
    print(json.dumps({
        "author_freeze": str(BASE / "author-freeze.json"),
        "author_freeze_sha256": freeze_sha,
        "all_files_sha256": sha(BASE / "all-files.sha256"),
        "retained_files_in_freeze_inventory": len(retained),
        "pages": [{key: p[key] for key in
                   ("physical_page", "native_lines_md", "native_lines_printed",
                    "frozen_page_md_sha256", "frozen_page_json_sha256")}
                  for p in page_records],
        "figures": observations["figure_inventory"],
        "command_counts": record["command_counts"],
        "image_budget": observations["image_budget"],
        "SOURCE": "pending", "RAW": "pending"
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    if os.environ.get("PYTHONDONTWRITEBYTECODE") != "1":
        raise SystemExit("STOP bytecode writes must be disabled")
    freeze()
