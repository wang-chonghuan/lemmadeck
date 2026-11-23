import datetime
import hashlib
import json
from pathlib import Path
import stat


OWN = Path(__file__).resolve().parent
REPO = OWN.parents[4]


def read(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def ref(path):
    path = Path(path).resolve()
    return {
        "path": str(path),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
    }


def save(path, value):
    with path.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")


receipts = OWN / "receipts"
receipt_files = sorted(receipts.glob("*"))
receipt_files = [
    path for path in receipt_files
    if path.is_file() and not path.name.startswith("report-generation.")
]
for number in (139, 140):
    work = OWN / "work/6-8g/pages" / f"{number:04}"
    receipt_files.extend(sorted(work.glob("prepare.0001.*")))
manifest = OWN / "receipt-manifest.json"
save(manifest, {"files": [ref(path) for path in receipt_files]})

pages = []
for number in (139, 140):
    prefix = f"p{number}"
    page_dir = OWN / "artifacts/6-8g/pages" / f"{number:04}"
    work = OWN / "work/6-8g/pages" / f"{number:04}"
    first = OWN / "FIRST" / f"{number:04}.source-first.md"
    snapshot = OWN / "snapshots" / f"{number:04}.candidate-before-finalize.md"
    sealed = read(receipts / f"{prefix}-first-sealed.json")
    candidate = read(receipts / f"{prefix}-candidate-before-finalize.json")
    final = read(receipts / f"{prefix}-finalize.json")
    audit = read(page_dir / "audit.json")
    assert stat.S_IMODE(first.stat().st_mode) == 0o444
    assert stat.S_IMODE(snapshot.stat().st_mode) == 0o444
    assert ref(first)["sha256"] == sealed["after"]["sha256"]
    assert ref(snapshot)["sha256"] == candidate["snapshot"]["sha256"]
    assert sealed["after"]["ctime_ns"] < candidate["source"]["mtime_ns"]
    assert candidate["finished_at"] < final["started_at"]
    assert final["exit_code"] == 0
    crop = OWN / "crops" / (
        "0139-steps.png" if number == 139 else "0140-prose.png"
    )
    pages.append({
        "physical": number,
        "printed": number - 10,
        "author_state": "FINALIZED_ONCE_NO_INDEPENDENT_REVIEW",
        "md": ref(page_dir / "page.md"),
        "json": ref(page_dir / "page.json"),
        "audit": ref(page_dir / "audit.json"),
        "png": ref(work / "page.png"),
        "grid": ref(work / "page.grid.png"),
        "detail_crop": ref(crop),
        "figure_crops": [ref(path) for path in sorted((work / "figures").glob("*.png"))],
        "FIRST": {**ref(first), "mode": "0444"},
        "candidate_before_finalize": {**ref(snapshot), "mode": "0444"},
        "chronology": {
            "first_stat_hash_completed_at": sealed["stat_and_hash_completed_at"],
            "sealed_ctime_ns": sealed["after"]["ctime_ns"],
            "candidate_mtime_ns": candidate["source"]["mtime_ns"],
            "candidate_snapshot_at": candidate["finished_at"],
            "finalize_started_at": final["started_at"],
            "seal_receipt": ref(receipts / f"{prefix}-first-sealed.json"),
            "snapshot_receipt": ref(receipts / f"{prefix}-candidate-before-finalize.json"),
            "finalize_receipt": ref(receipts / f"{prefix}-finalize.json"),
        },
        "mechanical_result": {
            "exit_code": final["exit_code"],
            "lines_printed": audit["lines_printed"],
            "lines_md": audit["lines_md"],
            "normalizations": len(audit["normalizations"]),
            "errors": audit["errors"],
            "count_exclusions": audit["count_exclusions"],
        },
    })

report = {
    "status": "AUTHOR_ONLY",
    "ticket": "STEMROBIN-188",
    "run": "SAME188-6 source6g139140-author-first-04",
    "mode": "continuous OFFLINE finish=review",
    "book": "6-8g",
    "physical_range": [139, 140],
    "cwd": str(REPO),
    "ownership": str(OWN),
    "initial_state": "OWN absent; direct ls returned 1, no directory.",
    "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "receipt_manifest": ref(manifest),
    "preparation": {
        "official_prepare_range_invocations": 1,
        "receipt": ref(receipts / "prepare.json"),
    },
    "reused_installation": {
        "delegated_identifier": "db613601/corresponding093a4baa",
        "no_setup_freshness_grill_or_shared_tool_edits": True,
        "tool_hashes_sampled_after_execution": [
            ref(REPO / ".claude/skills/ld-s10y-lesson/tools" / name)
            for name in ("p2c.py", "production.py", "layout.py")
        ],
    },
    "source_pdf": {
        "path": str(REPO / "ssot-resources/soviet10year-textbooks/sources/soviet10years"
                    / "6-8g 苏联十年制学校数学教材 几何 六-八年级.pdf"),
        "sha256": "d06ea093886065380febda597331bb5d48c81303d955161f2f84a7f11c116e5c",
        "hash_basis": "Official prepared page metadata; reference only, no PDF copy.",
    },
    "incoming138": {
        "basis": "Delegated parent text from collected Banach author report only",
        "report_sha256": "f572eb6d73828b0d2b4eee0c00c278d81a634b22755254313e7eb9e365d6b6ef",
        "independent_source_approval": False,
        "direct_human_text_or_pixel_observation": False,
        "pixels_read": False,
        "h3": "30. 作图问题",
        "tail": [
            "从所得的图形我们看到，",
            "顶点$B$和$C$可以通过截取线段",
            "$BC$为已知长$a$作出. 第三个",
            "顶点$A$: 1) 在直线$BC$过$C$点",
        ],
        "tail_state": "p open; 图190 cap samerow transparent",
    },
    "boundaries": {
        "139_first": "p cont: 的垂直线上，2) 与$B$点的距离等于线段$AB$的长，即在圆周 / $(B,C)$上. closes incoming138 p.",
        "139_headings": "No new h1/h2/h3; theorem38 and worked 习题2 are prose.",
        "139_caption": "图191 cap samerow with 径作圆周; transparent.",
        "139_tail": [
            "1) $|OA|<r$(图192,а). 在这个情况下，从圆心$O$到通过",
            "$A$点的任意的直线的距离都小于$r$(垂线比斜线短). 即，任何",
            "通过已知点$A$的直线都穿过已知圆周(第28小节). 在这种情",
        ],
        "139_tail_state": "p open; literal terminal 在这种情",
        "140_context": "Previous139 tail TEXT only; no139 pixel reopens for140.",
        "140_first": "Figure192/caption transparent, then p cont 况下，所求的切线不存在. closes139 p.",
        "140_headings": "No new headings.",
        "140_tail": "Last p closes at 线$OA$就行了. 直线$p$即为所求.; figure193/caption follow.",
        "unit_closure": "Not asserted; no TOC inference or invented unseen third case.",
    },
    "literal_readings": [
        {"page": 139, "literal": "以$C$为半径", "handling": "Uppercase C alone retained; no B/mark added, no geometry repair."},
        {"page": 140, "literal": "唯一的直线垂直直线$OA$", "handling": "No 于 added."},
    ],
    "unresolved_literals": [
        {
            "page": 140,
            "location": "fig192 left, lower-right damaged oblique/circle crossing",
            "literal": "unknown original line style at visible gaps",
            "handling": "Actual source pixels/gaps retained; neither continuous nor dashed restored. Local only, no global/human gate.",
        },
    ],
    "pages": pages,
    "counters": {
        "image_batch_cap": 8,
        "context_image_cap": 24,
        "original_loads": 2,
        "grid_loads": 2,
        "crop_loads": 2,
        "detail_loads_subset_of_crops": 2,
        "reopens": 0,
        "failed_image_operations_charged": 1,
        "actual_images_loaded_in_context": 6,
        "charged_image_total": 7,
        "image_batch_remaining": 1,
        "parent_permanently_charged": "24/24; no parent images returned",
        "official_prepare_range": 1,
        "finalize": {"139": 1, "140": 1},
        "author_candidate_revisions": 0,
        "paid_calls": 0,
        "network_calls": 0,
        "independent_reviews": 0,
    },
    "image_order": [
        "139 original", "139 grid", "139 crop-generation failure (no image loaded)",
        "139 detail crop", "140 original", "140 grid", "140 detail crop",
    ],
    "failures": [{
        "receipt": ref(receipts / "p139-detail-failure.json"),
        "preservation": "Actual traceback transcribed from tool chunk8059d2; stdout empty; not a fabricated subprocess receipt.",
        "repair": "OWN helper relative path resolution only; affected crop stage resumed before FIRST/candidate.",
    }],
    "scope_attestation": {
        "writes_only_under_OWN": True,
        "other_workers_and_in_flight_review_not_read": True,
        "no_assembly_promotion_index_modern_DB_git_chat_handoff_deploy_install": True,
        "no_independent_review_or_PASS": True,
        "no_shared_tool_or_count_exclusion_repairs_or_linecount_overrides": True,
        "own_exec_sessions": "All started exec sessions exited; no browser sessions opened.",
    },
}
save(OWN / "Report.json", report)
print(json.dumps(ref(OWN / "Report.json")))
