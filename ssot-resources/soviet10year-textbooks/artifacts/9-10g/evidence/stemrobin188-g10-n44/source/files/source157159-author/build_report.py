"""Build text-only, hash-bound delivery reports for this bounded author batch."""
from __future__ import annotations

import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OWNED = REPO / ".intentfold/tickets/STEMROBIN-188/tmp/source157159-author"
if Path.cwd() != REPO:
    raise SystemExit("Wrong cwd")


def entry(path):
    return {
        "path": str(path), "bytes": path.stat().st_size,
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    }


def dump(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


figure_inventory = {
    "fig-g10-06": {
        "source_label": "图 6",
        "labels": ["O", "M", "i (vector)", "j (vector)", "k (vector)"],
        "source_observations": [
            "Three rays share O: i down-left, j right, k up.",
            "The oblique arrow from O ends at marked M in the upper-right.",
            "No printed A/B/C or x/y/z labels in this figure.",
            "Small isolated source ink near the vertical and oblique rays retained in PNG.",
        ],
    },
    "fig-g10-07": {
        "source_label": "图 7",
        "labels": ["O", "A", "B", "C", "M", "x", "y", "z",
                   "i (vector)", "j (vector)", "k (vector)"],
        "source_observations": [
            "O is the common axis origin; A on down-left x, B on right y, C on up z.",
            "Thick basis arrows from O point toward A, B and C.",
            "An oblique arrow goes from O to marked M upper-right.",
            "Opposite axis extensions are dashed: x upper-right, y left, z down.",
        ],
    },
    "fig-g10-08": {
        "source_label": "图 8",
        "labels": ["O", "A", "B", "M", "x", "y", "z",
                   "i (vector)", "j (vector)", "k (vector)"],
        "source_observations": [
            "Common-origin basis arrows: i down-left, j right, k up.",
            "A lies down-left of O; B lies right of A and below the rightward axis.",
            "M lies above B; O-to-M has an arrow near M.",
            "Source x is next to OA, y next to the horizontal AB segment, z next to BM.",
            "AB and parts of the oblique/vertical strokes are broken or dashed as printed.",
        ],
    },
    "fig-g10-09": {
        "source_label": "图 9",
        "labels": ["O", "A", "B", "x", "y", "z",
                   "i (vector)", "j (vector)", "k (vector)"],
        "source_observations": [
            "Common origin O with x down-left, y right, z up.",
            "A is upper-right of O; B is above and left of A.",
            "Thick OA and OB arrows point away from O; AB points from A toward B.",
            "Opposite axis extensions are dashed.",
            "A short unlabelled oblique stroke below A is retained, not invented as a number or letter.",
        ],
    },
}

image_paths = [
    ("source-page", 157, OWNED / "work/9-10g/pages/0157/page.grid.png"),
    ("source-page", 158, OWNED / "work/9-10g/pages/0158/page.grid.png"),
    ("source-page", 159, OWNED / "work/9-10g/pages/0159/page.grid.png"),
    ("extracted-source-figure", 157, OWNED / "artifacts/9-10g/pages/0157/figures/fig-g10-06.png"),
    ("extracted-source-figure", 157, OWNED / "artifacts/9-10g/pages/0157/figures/fig-g10-07.png"),
    ("extracted-source-figure", 158, OWNED / "artifacts/9-10g/pages/0158/figures/fig-g10-08.png"),
    ("extracted-source-figure", 158, OWNED / "artifacts/9-10g/pages/0158/figures/fig-g10-09.png"),
    ("source-crop", 159, OWNED / "evidence/0159/first/lower-source-crop.png"),
]
image_ledger = [
    {"load": index, "tool": "functions.view_image", "kind": kind, "physical_page": page,
     "file": entry(path), "result": "loaded", "reopen": False}
    for index, (kind, page, path) in enumerate(image_paths, 1)
]

pages = []
verification_errors = []
for number in (157, 158, 159):
    pdir = OWNED / "artifacts/9-10g/pages" / f"{number:04d}"
    receipt_path = OWNED / "evidence" / f"{number:04d}" / "first/receipt.json"
    receipt = json.loads(receipt_path.read_text(encoding="utf-8"))
    page = json.loads((pdir / "page.json").read_text(encoding="utf-8"))
    audit = json.loads((pdir / "audit.json").read_text(encoding="utf-8"))
    figures = []
    for figure in page["meta"]["figures"]:
        path = pdir / "figures" / f"{figure['id']}.png"
        figures.append({
            **figure, "durable_png": entry(path),
            "source_inventory": figure_inventory[figure["id"]],
            "author_observation": "Viewed once after extraction; source labels and strokes retained.",
            "source_approval": False, "modern_approval": False,
        })
        working = OWNED / "work/9-10g/pages" / f"{number:04d}" / "figures" / path.name
        if entry(path)["sha256"] != entry(working)["sha256"]:
            verification_errors.append(f"Figure bytes differ: {figure['id']}")
    for filename in ("page.md", "page.json", "audit.json"):
        snapshot = OWNED / "evidence" / f"{number:04d}" / "first" / filename
        if entry(pdir / filename)["sha256"] != entry(snapshot)["sha256"]:
            verification_errors.append(f"Receipt snapshot differs: {number}/{filename}")
    if page["meta"]["numbering_scope"] != "g10":
        verification_errors.append(f"Wrong numbering scope: {number}")
    if entry(pdir / "page.png")["sha256"] != page["meta"]["render"]["sha256"]:
        verification_errors.append(f"Source image differs: {number}")
    if audit.get("count_exclusions", []) != []:
        verification_errors.append(f"Unexpected counting exclusions: {number}")
    pages.append({
        "physical_page": number, "printed_page": page["meta"]["printed_page"],
        "numbering_scope": "g10",
        "finalize": {
            "attempts": 1, "exit_code": receipt["exit_code"],
            "receipt": entry(receipt_path), "argv": receipt["argv"], "cwd": receipt["cwd"],
            "stdout": receipt["stdout"], "stderr": receipt["stderr"],
            "author_input": receipt["author_input"],
            "lines_printed": audit["lines_printed"], "lines_md": audit["lines_md"],
            "errors": audit["errors"],
            "mechanical_result": "exit0" if receipt["exit_code"] == 0 else "count_hold",
        },
        "files": {name: entry(pdir / name) for name in ("page.png", "page.md", "page.json", "audit.json")},
        "prepared_inputs": receipt["prepared_inputs"],
        "printed_inventory": [
            {"block": index, "kind": block["kind"], "source_label": block.get("label"),
             "cont": block["cont"], "open": block["open"], "samerow": block["samerow"],
             "printed_text_lines": block["lines"]}
            for index, block in enumerate(page["blocks"], 1)
        ],
        "figures": figures, "source_uncertainties": page["meta"]["notes"],
        "author_repair_count": 0, "independent_review": False, "source_approval": False,
    })

if verification_errors:
    raise SystemExit(json.dumps(verification_errors))

read_commands = [
    ("sed -n '1,240p' .claude/skills/ld-s10y-lesson/SKILL.md",
     "Read source-first cap1 grammar and bounded extraction rules."),
    ("sed -n '1,240p' .agents/skills/ld-s10y-image/SKILL.md",
     "Read image batch maximum 8 and context maximum 24."),
    ("ls -la .intentfold/tickets/STEMROBIN-188/tmp/source157159-author",
     "Owned directory initially contained only work/."),
    ("sed -n '1,200p' .intentfold/readme.md", "Read repo router; no backend operation."),
    ("sed -n '240,430p' .claude/skills/ld-s10y-lesson/SKILL.md",
     "Read g10 numbering_scope, line wraps, faithful mathematics and count exclusions constraints."),
    ("sed -n '1,220p' .claude/skills/ld-s10y-lesson/references/production-resume.md",
     "Read human authorization priority and first failure retention."),
    ("rg -n 'finalize|numbering_scope|page.template|audit|root|work' .claude/skills/ld-s10y-lesson/tools/p2c.py",
     "Located finalize implementation and owned root/work options."),
    ("sed -n '1,210p' ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0156/page.md",
     "Text-only prior boundary: §44 begins; final p open ends with 一个."),
    ("sed -n '1,240p' ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0156/page.json",
     "Text-only prior boundary: g10 scope and open prose; no image reopened."),
    ("cat .intentfold/charter/engineering.md .intentfold/charter/operations.md .intentfold/tickets/STEMROBIN-188/tmp/source157159-author/work/9-10g/pages/0157/page.template.md .intentfold/tickets/STEMROBIN-188/tmp/source157159-author/work/9-10g/pages/0158/page.template.md .intentfold/tickets/STEMROBIN-188/tmp/source157159-author/work/9-10g/pages/0159/page.template.md",
     "Read charters and prepared page templates, with three physical page identities and render hashes."),
    ("rg -n -C 7 '149|152|44|45|numbering|grade' ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json",
     "TOC hypotheses N44 printed149 and N45 printed152, in grade-ten branch."),
    ("sed -n '1,110p' .claude/skills/ld-s10y-lesson/tools/p2c.py",
     "Read routing and paths."),
    ("sed -n '267,478p' .claude/skills/ld-s10y-lesson/tools/p2c.py",
     "Read snap/crop, line count, normalization, persisted error audit and exit status."),
    ("rg --files .claude/skills/ld-s10y-lesson | rg 'blocks|grammar|page-mark|profiles/soviet|layout.py'",
     "Located block parser, profile and layout implementation."),
    ("sed -n '1,250p' .claude/skills/ld-s10y-lesson/tools/blocks.py",
     "Read parse/dump, printed_lines and continuation syntax."),
    ("cat .claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",
     "Read faithful source profile and allowed characters."),
    ("rg -n '^def |snap|pad|line_bands|crop' .claude/skills/ld-s10y-lesson/tools/layout.py",
     "Located immutable counting/snap/crop APIs."),
]

exclusions = {"report.md", "report.json", "byte-manifest.json",
              "report-generation-receipt.json", "report-generation.stdout.txt"}
manifest = {
    "schema": "bounded-source-author/byte-manifest@1",
    "root": str(OWNED),
    "scope": "All owned files present before report emission; report files excluded to avoid recursive hashes.",
    "entries": [
        entry(path) for path in sorted(OWNED.rglob("*"))
        if path.is_file() and path.name not in exclusions
    ],
}
manifest_path = OWNED / "byte-manifest.json"
dump(manifest_path, manifest)
report = {
    "schema": "bounded-source-author/report@1",
    "created_utc": datetime.now(timezone.utc).isoformat(),
    "role": "Authorized internal bounded SOURCE AUTHOR, not independent reviewer",
    "ticket": "STEMROBIN-188", "continuation": "same188-6",
    "cwd": str(REPO), "owned_root": str(OWNED),
    "book": "9-10g", "physical_pages": [157, 158, 159], "numbering_scope": "g10",
    "status": "AUTHOR_CANDIDATES_RETAINED_PAGE159_COUNT_HOLD",
    "prepare": {"reused_existing_prepared_pages": True, "runs_by_this_author": 0},
    "pages": pages,
    "source_boundary_inputs": {
        "page156_text_only": [
            entry(REPO / "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0156" / name)
            for name in ("page.md", "page.json")
        ],
        "toc": entry(REPO / "ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json"),
        "routing_hypotheses": {"N44": 149, "N45": 152},
        "page_truth": {
            "157": "Printed150; §44 continued; figures6,7; problem1 prompt.",
            "158": "Printed151; problems1-3 solutions and prompts; figures8,9; exercise16 starts.",
            "159": "Printed152; exercise16 continues, exercises17-22; §45 heading and opening prose.",
        },
        "grade10_basis": "Direct human source-confirmed grade/chapter on152; inherited g10 boundary metadata on156.",
    },
    "continuations": [
        {"from": "p0156 final p open", "to": "p0157 first p cont",
         "boundary_text": "一个 + 向量 OM", "basis": "Prior text only and actual157 source"},
        {"from": "p0157 problem1 closed prompt", "to": "p0158 first p starts 解.",
         "basis": "New solution paragraph; no invented empty continuation"},
        {"from": "p0158 ex16 open (1,2)", "to": "p0159 ex16 cont (3,4,5)",
         "identity_scope": "g10", "source_number": 16},
        {"from": "p0159 N45 final complete printed sentence", "to": "unknown/unread p0160",
         "uncertainty": "Next paragraph/continuation not established; no next-page reading or lesson-completion claim"},
    ],
    "page159_failure": {
        "first_receipt": pages[2]["finalize"]["receipt"],
        "diagnostic": entry(OWNED / "evidence/0159/first/count-diagnostic.json"),
        "extra_detected_band": {"number": 24, "y": [2105, 2121], "ink_pixels": 314},
        "source_observation": "Small residual black fragments at bottom-right below decorated footer152, plus edge ink. No legible additional source line identified.",
        "diagnosis": "The unmodified detector includes the bottom residual band; its source is not established. Current author candidate has23 source text/folio lines while detector reports24.",
        "not_claimed": ["Independent scan-artifact confirmation", "Approval to exclude ink", "Source fidelity approval", "Mechanical exit0"],
        "action": "Retain first failure and all candidate bytes; no tool change, exclusion, padding, duplicate line, invented character or rerun.",
    },
    "image_ledger": image_ledger,
    "usage": {
        "image_batch_limit": 8, "image_context_limit": 24,
        "actual_image_loads": 8, "successful_image_loads": 8,
        "failed_image_loads": 0, "reopens": 0, "source_page_loads": 3,
        "extracted_figure_loads": 4, "crop_loads": 1,
        "finalize_runs": 3, "failed_finalize_runs": 1,
        "author_repair_count": 0, "technical_recovery_count": 0,
        "count_tool_edits": 0, "count_exclusions_added": 0,
        "paid_calls": 0, "network_calls": 0,
    },
    "command_ledger": [
        {"cmd": command, "cwd": str(REPO), "exit_code": 0,
         "output_observation": observation, "raw_output_retention": "Exploratory reads summarized, not replayed"}
        for command, observation in read_commands
    ] + [
        {"cmd": ".claude/skills/ld-s10y-lesson/.venv/bin/python .intentfold/tickets/STEMROBIN-188/tmp/source157159-author/retain_author_evidence.py " + str(number),
         "cwd": str(REPO), "exit_code": page["finalize"]["exit_code"],
         "full_producer_stdout": page["finalize"]["stdout"],
         "full_producer_stderr": page["finalize"]["stderr"],
         "full_producer_argv_and_input_snapshot": page["finalize"]["receipt"]}
        for number, page in zip((157, 158, 159), pages)
    ] + [
        {"cmd": ".claude/skills/ld-s10y-lesson/.venv/bin/python .intentfold/tickets/STEMROBIN-188/tmp/source157159-author/diagnose159.py",
         "cwd": str(REPO), "exit_code": 0,
         "full_stdout": entry(OWNED / "evidence/0159/first/count-diagnostic.json")},
        {"cmd": ".claude/skills/ld-s10y-lesson/.venv/bin/python .intentfold/tickets/STEMROBIN-188/tmp/source157159-author/build_report.py",
         "cwd": str(REPO), "exit_code": 0,
         "receipt_path": str(OWNED / "report-generation-receipt.json")},
    ],
    "durable_byte_manifest": entry(manifest_path),
    "retention_verification": {
        "errors": verification_errors,
        "checked": [
            "Current md/json/audit bytes equal first-finalize snapshots",
            "Durable source PNG hashes equal finalized render hashes",
            "Durable figure PNG bytes equal working extraction bytes",
            "All three page metadata declare g10",
            "No count_exclusions added",
            "No first receipt overwritten and no finalize rerun",
        ],
        "not_a_source_review": True,
    },
    "boundaries": {
        "source_approved": False, "modern_images_approved": False,
        "independent_review_performed": False, "lessons_assembled": False,
        "lessons_claimed_complete": False,
        "core_artifact_writes": False, "other_agent_messaging": False,
        "git_modifications": False, "backend_or_database_operations": False,
        "env_install_publish_merge_deploy_closure_operations": False,
    },
}
dump(OWNED / "report.json", report)

lines = [
    "# STEMROBIN-188 Source Author: Physical157-159",
    "",
    "Authorized bounded source author only. These are unapproved source candidates, not independent-review results.",
    "",
    "## Outcome",
    "",
    "| Physical | Printed | Scope | Finalize | Lines md / detected | Figures |",
    "| --- | --- | --- | --- | --- | --- |",
]
for page in pages:
    finalize = page["finalize"]
    ids = ", ".join(figure["id"] for figure in page["figures"]) or "none"
    lines.append(f"| {page['physical_page']} | {page['printed_page']} | g10 | exit{finalize['exit_code']} | {finalize['lines_md']} / {finalize['lines_printed']} | {ids} |")
lines += [
    "",
    "Prepared inputs reused; prepare was not rerun. Each page finalized exactly once with the existing .venv Python and p2c.py, explicit owned --root/--work and the required cwd.",
    "",
    "## Source And Continuations",
    "",
    "- 157 continues the prior156 open prose; prior156 was read as page.md/page.json text only. Figure6/7 and正文问题1 retained.",
    "- 158 starts问题1解, includes问题2/3 and solutions, figure8/9, and习题16小问1/2.",
    "- 159 continues习题16小问3/4/5 without inventing a printed16; preserves exercises17-22 and the star on22.",
    "- Actual159 source shows §45. 平面的方程 on printed152. N44/N45 TOC entries remain routing context only.",
    "- N45 opening prose ends this page with a complete sentence about数组(x,y,z). Page160 was not read; later connection is unknown. No lesson completion or assembly claim.",
    "- Damaged152 footer is retained as `· 152 · [unknown]`; tiny curved ink beside its decoration is not guessed as punctuation.",
    "",
    "## First Failure Retained",
    "",
    "159 first finalize: exit1, author23 lines versus detected24. The unchanged line detector includes band24 at y2105-2121 below the footer (314 ink pixels). The limited source crop shows fragmented residual ink, not an identified additional readable line. Its origin is uncertain.",
    "",
    "No counting-tool edits, exclusions, invented text, padding or rerun. First stdout/stderr, input snapshot, normalized md/json/audit and diagnosis remain under evidence/0159/first/. Author repairs0; technical recoveries0.",
    "",
    "## Exact Durable Hashes",
    "",
    "| Physical / File | Bytes | SHA256 |",
    "| --- | --- | --- |",
]
for page in pages:
    for name, file in page["files"].items():
        lines.append(f"| {page['physical_page']} / {name} | {file['bytes']} | `{file['sha256']}` |")
    for figure in page["figures"]:
        file = figure["durable_png"]
        lines.append(f"| {page['physical_page']} / {figure['id']}.png | {file['bytes']} | `{file['sha256']}` |")
lines += [
    "",
    "All absolute paths, prepared grid/template/layout hashes, author-input snapshots, output receipts and source figure inventories are in report.json. byte-manifest.json lists every retained owned file existing before report emission, with exact bytes/SHA256; report-generation-receipt.json separately binds the report files.",
    "",
    "## Actual Image Ledger",
    "",
    "| Load | Image | Outcome |",
    "| --- | --- | --- |",
]
for load in image_ledger:
    lines.append(f"| {load['load']} | {Path(load['file']['path']).relative_to(OWNED)} | loaded |")
lines += [
    "",
    "Actual image loads8/8; current context8/24. Source pages3, extracted figures4, limited crop1. Reopens0; failed image loads0. No additional image payload returned.",
    "",
    "## Command Evidence And Boundaries",
    "",
    "Each finalize receipt records exact argv/cwd/exit, full stdout/stderr, author-input snapshot and hashes. The diagnostic stdout is retained verbatim as count-diagnostic.json. Exploratory read-command outputs are summarized in the command ledger, not misrepresented as saved raw stdout.",
    "",
    "Only the owned directory was written. No old154/155/156 image, other book, full-PDF image, core-artifact write, modern text/figure, answer, choice, Git modification, network, paid call, backend/DB/env/install, other-agent messaging, publish/merge/deploy or closure operation.",
    "",
    "Two exit0 results are mechanical only. Source fidelity and images remain unapproved. Page159 remains a count HOLD for the already separate reviewer/authorized decision-maker; this author did not contact that reviewer.",
    "",
]
(OWNED / "report.md").write_text("\n".join(lines), encoding="utf-8")
output = {
    "report_md": str(OWNED / "report.md"), "report_json": str(OWNED / "report.json"),
    "status": report["status"], "finalize_exit_codes": [0, 0, 1],
    "image_loads": 8, "author_repairs": 0,
    "manifest_entries": len(manifest["entries"]), "retention_errors": [],
}
stdout = json.dumps(output, ensure_ascii=False, indent=2) + "\n"
(OWNED / "report-generation.stdout.txt").write_text(stdout, encoding="utf-8")
dump(OWNED / "report-generation-receipt.json", {
    "cwd": str(REPO),
    "argv": [str(REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"), str(OWNED / "build_report.py")],
    "exit_code": 0,
    "script": entry(OWNED / "build_report.py"),
    "stdout": entry(OWNED / "report-generation.stdout.txt"),
    "reports": [entry(OWNED / name) for name in ("report.md", "report.json", "byte-manifest.json")],
    "image_loads_added": 0, "finalize_runs_added": 0,
})
print(stdout, end="")
