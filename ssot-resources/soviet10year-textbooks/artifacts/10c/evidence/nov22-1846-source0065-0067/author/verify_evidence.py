import hashlib
import json
from collections import Counter
from pathlib import Path


root = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
work = root / ".tmp/stemrobin-184-six/source10c5255-work"
report_root = root / ".tmp/stemrobin-184-six/source10c6567-author"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def file_fact(path):
    return {"path": str(path), "bytes": path.stat().st_size, "sha256": digest(path)}


def receipt_fact(stage):
    directory = work / "receipts" / stage
    path = directory / "execution.json"
    receipt = json.loads(path.read_text())
    assert receipt["cwd"] == str(root)
    checked = []
    records = list(receipt["streams"].values())
    records.extend(receipt.get("outputs", []))
    records.extend(receipt.get("image_call_traces", []))
    if "input_page" in receipt:
        records.append(receipt["input_page"])
    for record in records:
        target = Path(record["path"])
        if not target.is_absolute():
            target = directory / target
        assert target.stat().st_size == record["bytes"], str(target)
        assert digest(target) == record["sha256"], str(target)
        checked.append(file_fact(target))
    categories = Counter()
    methods = Counter()
    traces = []
    for record in receipt.get("image_call_traces", []):
        trace = Path(record["path"])
        traces.append(file_fact(trace))
        for line in trace.read_text().splitlines():
            event = json.loads(line)
            categories[event["category"]] += 1
            methods[event["module"] + "." + event["method"]] += 1
    return {
        **file_fact(path),
        "exitCode": receipt["exitCode"],
        "cwd": receipt["cwd"],
        "argv": receipt["argv"],
        "checked_files": checked,
        "trace_files": traces,
        "trace_categories": dict(categories),
        "trace_methods": dict(methods)
    }


prepare = receipt_fact("nov22-prepare-p0065-0067-01")
assert prepare["exitCode"] == 0
pages = []
for number, printed, expected_exit in ((65, 59, 0), (66, 60, 1), (67, 61, 0)):
    directory = work / "artifacts" / "10c" / "pages" / f"{number:04d}"
    receipt = receipt_fact(f"nov22-finalize-p{number:04d}-01")
    assert receipt["exitCode"] == expected_exit
    document = json.loads((directory / "page.json").read_text())
    audit = json.loads((directory / "audit.json").read_text())
    assert document["meta"]["page"] == number
    assert document["meta"]["printed_page"] == printed
    files = {name: file_fact(directory / name) for name in ("page.md", "page.json", "audit.json")}
    for name, snapshot in (
        ("page.md", "output-page.md"),
        ("page.json", "output-page.json"),
        ("audit.json", "output-audit.json")
    ):
        retained = work / "receipts" / f"nov22-finalize-p{number:04d}-01" / snapshot
        assert files[name]["sha256"] == digest(retained), str(retained)
    blocks = [{
        "ref": f"p{number:04d}#{index}",
        "kind": block["kind"],
        "label": block.get("label"),
        "lines": block["lines"],
        "owners": block.get("owner_exercises"),
        "open": block["open"],
        "cont": block["cont"],
        "samerow": block["samerow"]
    } for index, block in enumerate(document["blocks"], start=1)]
    assert not any(block["open"] or block["cont"] for block in blocks)
    assert not audit["normalizations"]
    assert not audit["unknown_chars"]
    assert not audit["count_exclusions"]
    source = work / "10c" / "pages" / f"{number:04d}"
    source_files = {name: file_fact(source / name) for name in ("page.png", "page.grid.png", "page.template.md")}
    assert source_files["page.png"]["sha256"] == document["meta"]["render"]["sha256"]
    pages.append({
        "physical": number,
        "printed": printed,
        "files": files,
        "source_files": source_files,
        "receipt": receipt,
        "audit": audit,
        "blocks": blocks
    })

assert [block["label"] for block in pages[1]["blocks"] if block["kind"] == "ex"] == [
    str(number) for number in range(182, 204)
]
result = {
    "status": "evidence-integrity-pass; source-page-66-remains-HOLD",
    "ticket": "STEMROBIN-184 /184-6",
    "scope": "10c physical 65-67, printed 59-61; source author only; finish=review",
    "prepare_reused_not_rerun": prepare,
    "pages": pages,
    "figure38": file_fact(work / "10c/pages/0067/figures/fig-38.png"),
    "roi": {
        **file_fact(report_root / "p0066-inequalities-roi.png"),
        "source": str(work / "10c/pages/0066/page.png"),
        "box_xyxy": [120, 1480, 1440, 1660],
        "native_explicit_calls": {"Image.open": 1, "Image.load": 1, "Image.crop": 1, "Image.save": 1},
        "internal_codec_calls": "UNKNOWN; ROI helper not instrumented",
        "creation_count": 1,
        "model_display_count": 1
    },
    "model_image_loads": {"originals": 3, "roi": 1, "reopens": 0, "batch_total": 4, "context_total": 4},
    "recognition_UNKNOWN": 0,
    "model_tokens_and_monetary_cost": "UNKNOWN",
    "paid_service_calls_in_this_assignment": 0,
    "first_failure": {
        "stage": "nov22-finalize-p0066-01",
        "exitCode": 1,
        "errors": pages[1]["audit"]["errors"],
        "retries": 0,
        "counter_or_source_repair": False,
        "dependent_stages_stopped": True
    }
}
output = report_root / "evidence.json"
output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({
    "status": result["status"],
    "evidence": file_fact(output),
    "pages": [{
        "physical": page["physical"],
        "exitCode": page["receipt"]["exitCode"],
        "lines_printed": page["audit"]["lines_printed"],
        "lines_authored": page["audit"]["lines_md"],
        "trace_categories": page["receipt"]["trace_categories"]
    } for page in pages]
}, ensure_ascii=False))
