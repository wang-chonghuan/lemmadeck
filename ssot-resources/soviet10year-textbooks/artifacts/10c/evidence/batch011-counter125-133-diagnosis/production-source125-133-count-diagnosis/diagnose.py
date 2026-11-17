"""Bounded, read-only count diagnostics for the six authorized native sources."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import shlex
import subprocess
import sys
import time
from datetime import datetime, timezone

sys.dont_write_bytecode = True

ROOT = Path("/Users/yong/.codex/worktrees/a07e/lemmadeck")
OUT = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source125-133-count-diagnosis"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
SOURCES = {
    125: ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c122-125/10c/pages/0125/page.png",
    128: ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129/10c/pages/0128/page.png",
    129: ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129/10c/pages/0129/page.png",
    130: ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133/10c/pages/0130/page.png",
    131: ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133/10c/pages/0131/page.png",
    133: ROOT / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c130-133/10c/pages/0133/page.png",
}
FIRST_GROUPS = {
    125: "production-source10c122-125-first-finalize",
    128: "production-source10c126-129-first-finalize",
    129: "production-source10c126-129-first-finalize",
    130: "production-source10c130-133-first-finalize",
    131: "production-source10c130-133-first-finalize",
    133: "production-source10c130-133-first-finalize",
}


def stamp():
    return datetime.now(timezone.utc).isoformat()


def sha(path):
    with Path(path).open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def dump(path, data):
    path = Path(path)
    if not path.is_relative_to(OUT):
        raise ValueError("Output outside the authorized directory")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=True) + "\n")


def append(path, data):
    with Path(path).open("a") as stream:
        stream.write(json.dumps(data, ensure_ascii=True) + "\n")
        stream.flush()
        os.fsync(stream.fileno())


def load_layout():
    sys.path.insert(0, str(TOOLS))
    import layout
    return layout


def audit_path(page):
    return ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/10c/pages/{page:04d}/audit.json"


def load_native(page):
    from PIL import Image
    path = SOURCES[page]
    image = Image.open(path)
    image.load()
    assert image.size == (1695, 2580), image.size
    assert image.mode == "RGB", image.mode
    return image


def masked_page(page, layout, image):
    ink = layout.ink_mask(image)
    audit = json.loads(audit_path(page).read_text())
    masked = ink.copy()
    for figure in audit["figures"]:
        x, y, w, h = figure["box"]
        masked[max(0, y):y + h, max(0, x):x + w] = False
    masked = layout.counting_ink(masked, audit.get("count_exclusions", []))
    cols = ink.any(axis=0).nonzero()[0]
    width = int(cols[-1] - cols[0] + 1) if cols.size else image.width
    return ink, masked, audit, width


def metrics(mask, y0, y1):
    import numpy as np
    from scipy import ndimage
    band = mask[y0:y1 + 1]
    ys, xs = np.nonzero(band)
    labels, _ = ndimage.label(band)
    components = []
    for ident, bounds in enumerate(ndimage.find_objects(labels), 1):
        if bounds is None:
            continue
        row, col = bounds
        pixels = int((labels[bounds] == ident).sum())
        if pixels >= 8:
            components.append({
                "box": [col.start, y0 + row.start, col.stop - col.start, row.stop - row.start],
                "ink_pixels": pixels,
            })
    components.sort(key=lambda item: -item["ink_pixels"])
    runs = []
    if xs.size:
        for x in np.flatnonzero(band.any(axis=0)):
            x = int(x)
            if runs and runs[-1][1] == x - 1:
                runs[-1][1] = x
            else:
                runs.append([x, x])
    return {
        "y_inclusive": [y0, y1],
        "ink_box": [int(xs.min()), y0 + int(ys.min()), int(xs.max() - xs.min() + 1),
                    int(ys.max() - ys.min() + 1)] if xs.size else None,
        "ink_pixels": int(band.sum()),
        "x_runs_inclusive": runs,
        "components_at_least_8px": components,
    }


def inventory():
    layout = load_layout()
    baseline = {"created": stamp(), "model_image_opens": 0, "sources": {},
                "layout": {"path": str(TOOLS / "layout.py"), "sha256": sha(TOOLS / "layout.py")},
                "p2c": {"path": str(TOOLS / "p2c.py"), "sha256": sha(TOOLS / "p2c.py")}}
    existing = OUT / "baseline.json"
    if existing.exists():
        raise ValueError("Refusing to replace the source baseline")
    for page in SOURCES:
        path = SOURCES[page]
        before = sha(path)
        image = load_native(page)
        ink, masked, audit, width = masked_page(page, layout, image)
        bands = layout.line_bands(masked, width)
        projected = masked.copy()
        edge = max(1, int(image.width * 0.01))
        projected[:, :edge] = False
        projected[:, -edge:] = False
        first = ROOT / ".intentfold/tickets/STEMROBIN-184/tmp" / FIRST_GROUPS[page] / f"{page:04d}"
        evidence = {}
        for name in ("command.json", "stdout.txt", "stderr.txt"):
            source = first / name
            raw = source.read_bytes()
            target = OUT / "first-finalize" / f"{page:04d}" / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(raw)
            evidence[name] = {
                "original_path": str(source), "copy_path": str(target),
                "sha256": sha(source),
            }
        first_audit = json.loads((first / "audit.json").read_text())
        audit_facts = {key: audit.get(key) for key in
                       ("page", "figures", "count_exclusions", "lines_printed", "lines_md", "errors")}
        data = {
            "page": page, "source": str(path), "source_sha256": before,
            "size": list(image.size), "mode": image.mode, "dpi": image.info.get("dpi"),
            "content_width_from_original_ink": width, "edge_suppression_px": edge,
            "current_audit_path": str(audit_path(page)), "current_audit_sha256": sha(audit_path(page)),
            "current_audit_facts": audit_facts, "first_finalize_evidence": evidence,
            "first_audit_sha256": sha(first / "audit.json"),
            "first_audit_facts": {key: first_audit.get(key) for key in audit_facts},
            "current_line_count": len(bands),
            "line_bands": [{"ordinal": index + 1, **metrics(projected, int(a), int(b))}
                           for index, (a, b) in enumerate(bands)],
            "margin_ink": {
                "top": metrics(projected, 0, 128),
                "bottom": metrics(projected, 2451, 2579),
            },
        }
        assert before == sha(path), "Source changed while reading"
        dump(OUT / f"{page:04d}" / "inventory.json", data)
        baseline["sources"][str(page)] = {
            "path": str(path), "sha256": before, "size": list(image.size), "mode": image.mode,
            "dpi": image.info.get("dpi"), "audit_sha256": sha(audit_path(page)),
        }
        print(f"p{page:04d}: current={len(bands)}, first={first_audit['lines_printed']}, "
              f"witness={first_audit['lines_md']}, content_w={width}, source_sha256={before}")
        for index, (a, b) in enumerate(bands, 1):
            info = metrics(projected, int(a), int(b))
            comps = info["components_at_least_8px"]
            print(f"  {index:02d} y={a}:{b} bbox={info['ink_box']} ink={info['ink_pixels']} "
                  f"largest={comps[:3]}")
        image.close()
    dump(existing, baseline)


def crop(page, rectangle, label):
    import numpy as np
    baseline = json.loads((OUT / "baseline.json").read_text())
    source = SOURCES[page]
    original_hash = baseline["sources"][str(page)]["sha256"]
    assert sha(source) == original_hash
    image = load_native(page)
    x, y, w, h = rectangle
    assert 0 <= x < x + w <= image.width and 0 <= y < y + h <= image.height
    assert (w, h) != image.size
    target = OUT / f"{page:04d}" / f"{label}.png"
    if target.exists():
        raise ValueError("Refusing to overwrite crop")
    target.parent.mkdir(parents=True, exist_ok=True)
    native = image.crop((x, y, x + w, y + h))
    native.save(target)
    from PIL import Image
    with Image.open(target) as saved:
        equality = bool(np.array_equal(np.asarray(saved), np.asarray(image)[y:y + h, x:x + w]))
        assert equality
        info = {
            "event": "crop-created-not-model-loaded", "timestamp": stamp(), "page": page,
            "source": str(source), "source_sha256_before": original_hash,
            "source_size": list(image.size), "source_mode": image.mode, "source_dpi": image.info.get("dpi"),
            "crop_path": str(target), "crop_sha256": sha(target),
            "crop_size": list(saved.size), "crop_mode": saved.mode,
            "native_rectangle_xywh": rectangle, "native_rectangle_equality": equality,
            "raw_rgb_sha256": hashlib.sha256(np.asarray(saved).tobytes()).hexdigest(),
            "operation": "Pillow crop only, no resize/enhancement/overlay",
            "source_sha256_after": sha(source), "model_loads_consumed": 0,
        }
    assert info["source_sha256_after"] == original_hash
    append(OUT / "crop-ledger.jsonl", info)
    dump(target.with_suffix(".json"), info)
    print(json.dumps(info, indent=2))
    image.close()


def preopen(page, label):
    import numpy as np
    from PIL import Image
    entries = []
    ledger = OUT / "image-open-ledger.jsonl"
    if ledger.exists():
        entries = [json.loads(line) for line in ledger.read_text().splitlines()]
    if len(entries) >= 8:
        raise ValueError("Permanent assignment image budget exhausted")
    target = OUT / f"{page:04d}" / f"{label}.png"
    meta = json.loads(target.with_suffix(".json").read_text())
    image = load_native(page)
    source_hash = sha(SOURCES[page])
    assert source_hash == meta["source_sha256_before"]
    assert sha(target) == meta["crop_sha256"]
    x, y, w, h = meta["native_rectangle_xywh"]
    with Image.open(target) as saved:
        equality = bool(np.array_equal(np.asarray(saved), np.asarray(image)[y:y + h, x:x + w]))
        assert equality
        entry = {
            **meta, "event": "pre-model-load-budget-consumed", "timestamp": stamp(),
            "native_rectangle_equality_rechecked": equality,
            "source_sha256_preload": source_hash, "crop_sha256_preload": sha(target),
            "crop_size_preload": list(saved.size), "source_size_preload": list(image.size),
            "assignment_consumption": len(entries) + 1, "assignment_limit": 8,
            "lifetime_consumption": len(entries) + 1, "lifetime_limit": 24,
            "reserved_model_tool": "functions.view_image", "detail": "original",
        }
    append(ledger, entry)
    print(json.dumps(entry, indent=2))
    image.close()


def region(page, rectangle, label):
    import numpy as np
    layout = load_layout()
    image = load_native(page)
    x, y, w, h = rectangle
    assert 0 <= x < x + w <= image.width and 0 <= y < y + h <= image.height
    ink = layout.ink_mask(image)
    local = ink[y:y + h, x:x + w]
    ys, xs = np.nonzero(local)
    box = [x + int(xs.min()), y + int(ys.min()), int(xs.max() - xs.min() + 1),
           int(ys.max() - ys.min() + 1)] if xs.size else None
    record = {
        "page": page, "timestamp": stamp(), "source": str(SOURCES[page]),
        "source_sha256": sha(SOURCES[page]), "native_region_xywh": rectangle,
        "ink_threshold": layout.INK_THRESHOLD, "ink_box_xywh": box,
        "ink_pixels": int(local.sum()), "row_ink_pixels": [int(v) for v in local.sum(axis=1)],
        "method": "Original ink-mask measurements only; no image output or model load",
    }
    dump(OUT / f"{page:04d}" / f"{label}-metrics.json", record)
    print(json.dumps(record, indent=2))
    image.close()


def trace(page):
    import inspect
    import numpy as np
    layout = load_layout()
    baseline = json.loads((OUT / "baseline.json").read_text())
    assert sha(TOOLS / "layout.py") == baseline["layout"]["sha256"]
    image = load_native(page)
    _, masked, audit, width = masked_page(page, layout, image)
    points = {
        "joined = []": "before-second-join",
        "typical_h = float(line_h)": "after-fraction-tail-split",
        "if count == 1:": "expansion-decision",
        "merged = expanded": "expanded-bands",
        "if not decoration:": "decoration-decision",
    }
    source, start = inspect.getsourcelines(layout.line_bands)
    lines = {start + offset: points[line.strip()]
             for offset, line in enumerate(source) if line.strip() in points}
    events = []
    selected = (
        "a", "b", "count", "line_h", "glyph_h", "typical_h", "typical_gap", "pitch",
        "band_h", "band_w", "thin", "edge_border", "short_text", "folio", "decoration",
        "raw", "merged", "joined", "expanded", "fraction_starts", "fragments", "glyph_rows",
        "strong_rows", "compact_text_rows", "subscript_row", "carrier_row", "rules",
        "remaining", "support_groups", "cores", "overlapping",
    )

    def plain(value):
        if isinstance(value, np.ndarray):
            return value.tolist() if value.size < 300 else {"shape": list(value.shape)}
        if isinstance(value, np.generic):
            return value.item()
        if isinstance(value, (set, tuple, list)):
            return [plain(item) for item in value]
        if value is None or isinstance(value, (str, int, float, bool)):
            return value
        return repr(value)

    def observe(frame, event, value):
        if Path(frame.f_code.co_filename) != TOOLS / "layout.py":
            return observe
        name = frame.f_code.co_name
        local = frame.f_locals
        stage = None
        if name == "line_bands" and event == "line" and frame.f_lineno in lines:
            stage = lines[frame.f_lineno]
        elif name in ("_single_fraction_row", "_fraction_tail_split") and event == "return":
            if local.get("a", -1) <= 701 and local.get("b", -1) >= 855:
                stage = "helper-return"
        if stage is not None:
            record = {"function": name, "line": frame.f_lineno, "stage": stage,
                      "locals": {key: plain(local[key]) for key in selected if key in local}}
            if event == "return":
                record["return"] = plain(value)
            events.append(record)
        return observe

    sys.settrace(observe)
    try:
        bands = layout.line_bands(masked, width)
    finally:
        sys.settrace(None)
    result = {
        "page": page, "timestamp": stamp(), "layout_sha256": sha(TOOLS / "layout.py"),
        "source_sha256": sha(SOURCES[page]), "audit_sha256": sha(audit_path(page)),
        "current_count": len(bands), "events": events,
        "method": "sys.settrace of unchanged current layout.py; no monkeypatch or production write",
    }
    dump(OUT / f"{page:04d}" / "layout-trace.json", result)
    print(json.dumps({
        **{key: value for key, value in result.items() if key != "events"},
        "events": [event for event in events
                   if event["locals"].get("a") == 701 and event["locals"].get("b") == 855],
    }, indent=2))
    image.close()


def candidate(page, path):
    layout = load_layout()
    baseline = json.loads((OUT / "baseline.json").read_text())
    assert sha(TOOLS / "layout.py") == baseline["layout"]["sha256"], "Current layout changed"
    assert sha(SOURCES[page]) == baseline["sources"][str(page)]["sha256"]
    image = load_native(page)
    ink, masked, audit, width = masked_page(page, layout, image)
    proposed = json.loads(Path(path).read_text())
    entries = proposed["proposed_delta"]
    assert proposed["disposition"] == "SAFE_CANDIDATE_NATIVE_REVIEWED"
    before = layout.line_bands(masked, width)
    try:
        after_mask = layout.counting_ink(masked, entries)
    except ValueError as error:
        print(f"EXCLUSION REJECTED: {error}")
        raise
    after = layout.line_bands(after_mask, width)
    delta = masked & ~after_mask
    report = {
        "page": page, "timestamp": stamp(), "layout_sha256": sha(TOOLS / "layout.py"),
        "source_sha256_before": sha(SOURCES[page]), "current_audit_sha256": sha(audit_path(page)),
        "current_audit_unchanged_since_inventory":
            sha(audit_path(page)) == baseline["sources"][str(page)]["audit_sha256"],
        "proposed_delta": entries, "counting_ink": "accepted",
        "count_before": len(before), "count_after": len(after),
        "bands_before": [[int(a), int(b)] for a, b in before],
        "bands_after": [[int(a), int(b)] for a, b in after],
        "bands_removed": [[int(a), int(b)] for a, b in before if (a, b) not in after],
        "bands_added": [[int(a), int(b)] for a, b in after if (a, b) not in before],
        "removed_ink_pixels": int(delta.sum()),
        "removal_bbox": metrics(delta, 0, image.height - 1)["ink_box"],
        "original_ink_unchanged": bool((ink == layout.ink_mask(image)).all()),
        "source_sha256_after": sha(SOURCES[page]),
        "method": "Existing layout.counting_ink + layout.line_bands on memory copy only; no finalize",
    }
    assert report["source_sha256_after"] == baseline["sources"][str(page)]["sha256"]
    dump(OUT / f"{page:04d}" / "candidate-count.json", report)
    print(json.dumps(report, indent=2))
    image.close()


def final_hashes():
    baseline = json.loads((OUT / "baseline.json").read_text())
    result = {"timestamp": stamp(), "sources": {}, "layout": {}, "image_opens": 0}
    for page, path in SOURCES.items():
        final = sha(path)
        result["sources"][str(page)] = {
            "path": str(path), "original_sha256": baseline["sources"][str(page)]["sha256"],
            "final_sha256": final, "unchanged": final == baseline["sources"][str(page)]["sha256"],
            "audit_path": str(audit_path(page)), "final_audit_sha256": sha(audit_path(page)),
            "audit_unchanged": sha(audit_path(page)) == baseline["sources"][str(page)]["audit_sha256"],
        }
        assert result["sources"][str(page)]["unchanged"]
    result["layout"] = {
        "path": str(TOOLS / "layout.py"), "original_sha256": baseline["layout"]["sha256"],
        "final_sha256": sha(TOOLS / "layout.py"),
        "unchanged": sha(TOOLS / "layout.py") == baseline["layout"]["sha256"],
    }
    result["p2c"] = {
        "path": str(TOOLS / "p2c.py"), "original_sha256": baseline["p2c"]["sha256"],
        "final_sha256": sha(TOOLS / "p2c.py"),
        "unchanged": sha(TOOLS / "p2c.py") == baseline["p2c"]["sha256"],
    }
    result["first_finalize_inputs"] = {}
    for page in SOURCES:
        inventory_data = json.loads((OUT / f"{page:04d}" / "inventory.json").read_text())
        result["first_finalize_inputs"][str(page)] = {}
        for name, facts in inventory_data["first_finalize_evidence"].items():
            final = sha(facts["original_path"])
            result["first_finalize_inputs"][str(page)][name] = {
                "path": facts["original_path"], "original_sha256": facts["sha256"],
                "final_sha256": final, "unchanged": final == facts["sha256"],
                "evidence_copy_unchanged": sha(facts["copy_path"]) == facts["sha256"],
            }
            assert result["first_finalize_inputs"][str(page)][name]["unchanged"]
            assert result["first_finalize_inputs"][str(page)][name]["evidence_copy_unchanged"]
    ledger = OUT / "image-open-ledger.jsonl"
    result["image_opens"] = len(ledger.read_text().splitlines()) if ledger.exists() else 0
    result["assignment_remaining"] = 8 - result["image_opens"]
    result["lifetime_remaining"] = 24 - result["image_opens"]
    dump(OUT / "final-hashes.json", result)
    print(json.dumps(result, indent=2))


def report():
    baseline = json.loads((OUT / "baseline.json").read_text())
    final = json.loads((OUT / "final-hashes.json").read_text())
    opens = [json.loads(line) for line in (OUT / "image-open-ledger.jsonl").read_text().splitlines()]
    commands = [json.loads(line) for line in (OUT / "commands.jsonl").read_text().splitlines()]
    assert len(opens) == 6
    assert all(item["unchanged"] for item in final["sources"].values())
    assert final["layout"]["unchanged"] and final["p2c"]["unchanged"]
    pages, proposals = {}, {}
    first_records = {}
    lines = [
        "# STEMROBIN-184 Session B: Six Count Failures",
        "",
        f"Generated UTC: {stamp()}",
        "",
        "## Scope",
        "",
        "Only physical 10c pages 125, 128, 129, 130, 131, and 133 were diagnosed.",
        "This is continuation evidence, not workflow setup, update, handoff, or closure.",
        "No production edit, layout patch, finalize, test, assembly, database, publishing, Git,",
        "browser operation, previous image history, or passed-page rerun was performed.",
        "All written files are beneath this diagnostic directory. Parent applies proposals.",
        "",
        "## Six Dispositions",
        "",
        "| Physical page | Actual / independent witness | Disposition | Exact proposed XYWH | Read-only count |",
        "| --- | --- | --- | --- | --- |",
    ]
    for page in SOURCES:
        folder = OUT / f"{page:04d}"
        facts = json.loads((folder / "inventory.json").read_text())
        disposition = json.loads((folder / "disposition.json").read_text())
        entry = next(item for item in opens if item["page"] == page)
        assert entry["crop_sha256"] == disposition["model_view"]["crop_sha256"]
        assert entry["native_rectangle_equality_rechecked"]
        assert disposition["model_view"]["status"] == "success"
        assert sha(entry["crop_path"]) == entry["crop_sha256"]
        count_path = folder / "candidate-count.json"
        count = json.loads(count_path.read_text()) if count_path.exists() else None
        if count:
            assert count["counting_ink"] == "accepted"
            assert count["bands_removed"] == [disposition["counted_extra_band_y_inclusive"]]
            assert not count["bands_added"]
            assert count["original_ink_unchanged"]
            assert count["proposed_delta"] == disposition["proposed_delta"]
            proposals[str(page)] = {
                "source": str(SOURCES[page]), "source_sha256": facts["source_sha256"],
                "layout_sha256": baseline["layout"]["sha256"],
                "count_exclusions_to_add": disposition["proposed_delta"],
                "status": "PROPOSED_VALIDATED_NOT_APPLIED",
            }
        pages[str(page)] = {
            "inventory_path": str(folder / "inventory.json"),
            "disposition_path": str(folder / "disposition.json"),
            "disposition_sha256": sha(folder / "disposition.json"),
            "disposition": disposition,
            "candidate_count_path": str(count_path) if count else None,
            "candidate_count": count,
            "source": facts["source"], "source_sha256": facts["source_sha256"],
            "current_audit_path": facts["current_audit_path"],
            "current_audit_sha256": facts["current_audit_sha256"],
            "figures": facts["current_audit_facts"]["figures"],
        }
        first_folder = OUT / "first-finalize" / f"{page:04d}"
        first_command = json.loads((first_folder / "command.json").read_text())
        first_records[str(page)] = {
            "command": first_command,
            "stdout": (first_folder / "stdout.txt").read_text(),
            "stderr": (first_folder / "stderr.txt").read_text(),
            "original_and_copy_hashes": facts["first_finalize_evidence"],
        }
        assert first_command["exitCode"] == 1
        actual = facts["current_line_count"]
        witness = facts["first_audit_facts"]["lines_md"]
        status = {
            "SAFE_CANDIDATE_NATIVE_REVIEWED": "Safe scan-artifact proposal",
            "UNKNOWN": "UNKNOWN; no exclusion",
            "CONFIRMED_MATH_ROW_SPLIT_NO_LEGAL_EXCLUSION": "Confirmed math-row split; no exclusion",
        }[disposition["disposition"]]
        box = str(disposition["proposed_delta"][0]["box"]) if count else "None"
        changed = f"{count['count_before']} -> {count['count_after']}" if count else "Not attempted"
        lines.append(f"| {page} | {actual} / {witness} | {status} | `{box}` | {changed} |")
    lines.extend([
        "",
        "The four proposals were selected from native non-text classification and measured",
        "object envelopes before count execution. No desired-count override is present.",
        "Each removes only the named extra band; all other returned bands remain identical.",
        "",
        "### Pixel Attribution and Protection",
        "",
        "- 125: blank bottom-margin irregular dot trail; full native envelope",
        "  `[393,2480,492,6]`, 121 ink pixels; counted core y=2482..2485.",
        "- 128: isolated irregular right-margin blot; full native object",
        "  `[1594,1550,11,12]`, 99 pixels; counted projection core y=1552..1558.",
        "  The initial core-only draft was corrected to the full native object before counting.",
        "  Adjacent printed Chinese text remains outside the proposed rectangle.",
        "- 129: short ragged bottom-margin trail `[1483,2486,153,5]`, 222 pixels;",
        "  counted core y=2486..2489. It is not an intentional separator.",
        "- 130: UNKNOWN sparse dot/stroke cluster; counted core",
        "  `[781,2395,119,19]`; full inspected-region ink envelope",
        "  `[781,2393,121,44]`, 240 pixels. No provenance is asserted.",
        "- 131: ragged descending bottom scan-edge smear",
        "  `[34,2484,1593,24]`, 11872 pixels; counted band y=2484..2507.",
        "- 133: one native equals-expression has three horizontal terms with fractions and",
        "  evaluation bars (upper 4, lower 1/4), including nested fractional notation.",
        "  Its complete y=701..855 band is split into y=701..777 and y=778..855.",
        "",
        "Legal scan-artifact zones under current counting_ink: x+w <= 84.75,",
        "x >= 1525.5, y+h <= 129, or y >= 2451. The four proposals lie wholly",
        "in blank bottom/right margins and exclude no text, footer, or mathematics.",
        "No separator-rule proposal is justified. The page-130 cluster is outside",
        "all legal margin zones, is not a separator, and is narrower than the 339px",
        "minimum separator width. No box enlargement or kind substitution was attempted.",
        "",
        "### Current Counter Cause on 133",
        "",
        "The unchanged layout joins the entire expression as `[701,855]` before expansion.",
        "At layout.py:1039: band_h=155, typical_h=46, glyph_h=43.75, typical_gap=40,",
        "pitch=86, count=2. compact_text_rows, subscript_row, and carrier_row are false;",
        "fraction_starts is empty. _single_fraction_row returns false at layout.py:423",
        "for either scale: it recognizes rules but retains only one supported core,",
        "so len(cores)>=3 fails even though overlapping=true. Equal-step expansion",
        "therefore emits two count bands from one native mathematical expression.",
        "Excluding any of these fraction/evaluation strokes would mask genuine math.",
        f"Full trace: `{OUT / '0133/layout-trace.json'}`",
        "",
        "## Native Image Ledger",
        "",
        "Exactly 6 model image opens: one fresh, native rectangle per page; no reopen,",
        "whole-page display, resizing, enhancement, overlay, or montage. Assignment 6/8;",
        "lifetime 6/24. Parent received no image payload and must not reopen these crops.",
        "Each pre-load record logs source/crop dimensions, SHA256, exact rectangle equality,",
        "and budget consumption before the successful functions.view_image(original) call.",
        "All originals are RGB 1695x2580, nominal 300dpi (PNG metadata 299.9994dpi).",
        "",
        "| Page | Native crop XYWH | Crop SHA256 |",
        "| --- | --- | --- |",
    ])
    for entry in opens:
        lines.append(f"| {entry['page']} | `{entry['native_rectangle_xywh']}` | `{entry['crop_sha256']}` |")
        lines.append(f"Crop path: `{entry['crop_path']}`")
    lines.extend([
        "",
        f"Pre-load ledger: `{OUT / 'image-open-ledger.jsonl'}`",
        f"Crop creation/equality ledger: `{OUT / 'crop-ledger.jsonl'}`",
        "Model-tool wall-clock durations are not provided by the image tool; none are invented.",
        "",
        "## Source Preservation",
        "",
        "Final SHA256 equals the baseline for all six native PNGs. Current audit JSONs,",
        "layout.py, p2c.py, and first-finalize command/stdout/stderr inputs also remain unchanged.",
        f"Full final hash record: `{OUT / 'final-hashes.json'}`",
        "",
        "| Page | Unchanged original SHA256 |",
        "| --- | --- |",
    ])
    for page, facts in baseline["sources"].items():
        lines.append(f"| {page} | `{facts['sha256']}` |")
        lines.append(f"Source path: `{facts['path']}`")
    lines.extend([
        "",
        f"Current layout SHA256: `{baseline['layout']['sha256']}`",
        "",
        "## First-Finalize Records",
        "",
        "These are existing first-failure records, not reruns. The recorded args are",
        "preserved exactly. Their command.json does not name the Python executable;",
        "that missing field is not reconstructed or presented as known.",
    ])
    for page, record in first_records.items():
        command = record["command"]
        lines.extend([
            "",
            f"### Physical {page}",
            "",
            f"Recorded args: `{shlex.join(command['args'])}`",
            f"UTC start `{command['started']}`; finish `{command['finished']}`;",
            f"exit={command['exitCode']}, signal={command['signal']}, error={command['error']}.",
            "```text",
            record["stdout"].rstrip(),
            "```",
            f"stderr: {repr(record['stderr'])}",
            f"Exact copied record directory: `{OUT / 'first-finalize' / page}`",
        ])
    lines.extend([
        "",
        "## New Read-Only Commands",
        "",
        "All diagnostic subprocess argv, UTC start/finish, elapsed time, exit/signal/status,",
        "and byte-exact stdout/stderr plus their hashes are retained in commands/*/command.json.",
        "commands.jsonl also includes this report-generation command after it returns.",
        f"Complete live command index: `{OUT / 'commands.jsonl'}`",
        "",
        "| Action | Start UTC | Elapsed seconds | Exit | Command/stdout/stderr directory |",
        "| --- | --- | --- | --- | --- |",
    ])
    for command in commands:
        argv = command["argv"]
        action = " ".join(argv[4:6])
        lines.append(f"| `{action}` | {command['started']} | {command['elapsed_seconds']:.6f} | "
                     f"{command['exit_code']} | `{Path(command['stdout_path']).parent}` |")
    lines.extend([
        "",
        "## Parent Delta",
        "",
        f"Apply-or-reject proposal file: `{OUT / 'proposed-exclusions.json'}`",
        "Only 125, 128, 129, and 131 have proposals; all are scan-artifact exclusions.",
        "130 stays UNKNOWN. 133 is confirmed mathematical row splitting, not an exclusion.",
        "Author body, expected/witness values, wraps, source pixels, and figure boxes are untouched.",
        "This bounded assignment ends with this report.",
        "",
    ])
    result = {
        "schema": "STEMROBIN-184/six-count-diagnosis@1",
        "created": stamp(), "root": str(ROOT), "output_root": str(OUT),
        "status": "BOUNDED_DIAGNOSIS_COMPLETE",
        "pages": pages, "source_baseline": baseline, "final_hashes": final,
        "image_opens": opens, "image_count": {"assignment": 6, "assignment_limit": 8,
                                            "lifetime": 6, "lifetime_limit": 24},
        "first_finalize_records": first_records,
        "diagnostic_command_records_at_report_generation": commands,
        "complete_live_command_index": str(OUT / "commands.jsonl"),
        "proposed_exclusions_path": str(OUT / "proposed-exclusions.json"),
        "production_writes": [], "finalize_runs": [], "test_runs": [], "passed_page_targets": [],
        "author_body_changes": [], "wrap_changes": [], "expected_count_overrides": [],
        "previous_image_history_read": False, "image_payload_returned_to_parent": False,
    }
    dump(OUT / "report.json", result)
    dump(OUT / "proposed-exclusions.json", {
        "status": "PROPOSED_VALIDATED_NOT_APPLIED", "pages": proposals,
        "unknown_pages": [130], "confirmed_counter_defect_pages": [133],
    })
    (OUT / "report.md").write_text("\n".join(lines))
    print(f"REPORT={OUT / 'report.md'}")
    print(f"REPORT_JSON={OUT / 'report.json'}")
    print(f"PROPOSED_EXCLUSIONS={OUT / 'proposed-exclusions.json'}")
    print("SAFE_PROPOSALS=125,128,129,131; UNKNOWN=130; MATH_ROW_SPLIT=133; MODEL_OPENS=6/8")


def delivery():
    result = {
        "timestamp": stamp(), "files": {
            str(OUT / name): sha(OUT / name)
            for name in ("report.md", "report.json", "proposed-exclusions.json",
                         "final-hashes.json", "image-open-ledger.jsonl")
        },
        "image_count": {"assignment": 6, "assignment_limit": 8, "lifetime": 6, "lifetime_limit": 24},
    }
    dump(OUT / "delivery.json", result)
    print(json.dumps(result, indent=2))


def run_logged(arguments):
    OUT.mkdir(parents=True, exist_ok=True)
    label = arguments[0] + (f"-{arguments[1]}" if len(arguments) > 1 else "")
    logdir = OUT / "commands" / (datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ") + "-" + label)
    logdir.mkdir(parents=True)
    argv = [sys.executable, "-B", str(Path(__file__).resolve()), "_execute", *arguments]
    env = dict(os.environ, PYTHONDONTWRITEBYTECODE="1")
    started = stamp()
    clock = time.monotonic()
    process = subprocess.run(argv, cwd=ROOT, capture_output=True, env=env)
    elapsed = time.monotonic() - clock
    (logdir / "stdout.txt").write_bytes(process.stdout)
    (logdir / "stderr.txt").write_bytes(process.stderr)
    record = {
        "argv": argv, "shell_command": shlex.join(argv), "cwd": str(ROOT),
        "environment_delta": {"PYTHONDONTWRITEBYTECODE": "1"},
        "started": started, "finished": stamp(), "elapsed_seconds": elapsed,
        "exit_code": process.returncode, "signal": -process.returncode if process.returncode < 0 else None,
        "stdout_path": str(logdir / "stdout.txt"), "stderr_path": str(logdir / "stderr.txt"),
        "stdout_sha256": sha(logdir / "stdout.txt"), "stderr_sha256": sha(logdir / "stderr.txt"),
        "status": "success" if process.returncode == 0 else "failure",
    }
    dump(logdir / "command.json", record)
    append(OUT / "commands.jsonl", record)
    sys.stdout.buffer.write(process.stdout)
    sys.stderr.buffer.write(process.stderr)
    print(f"\nCOMMAND_RECORD={logdir / 'command.json'}", flush=True)
    return process.returncode


def execute(arguments):
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="action", required=True)
    sub.add_parser("inventory")
    sub.add_parser("report")
    sub.add_parser("delivery")
    for action in ("crop", "preopen", "candidate", "region"):
        child = sub.add_parser(action)
        child.add_argument("page", type=int, choices=list(SOURCES))
        if action in ("crop", "region"):
            child.add_argument("rectangle", nargs=4, type=int)
        child.add_argument("label")
    trace_parser = sub.add_parser("trace")
    trace_parser.add_argument("page", type=int, choices=list(SOURCES))
    sub.add_parser("final-hashes")
    args = parser.parse_args(arguments)
    if args.action == "inventory":
        inventory()
    elif args.action == "crop":
        crop(args.page, args.rectangle, args.label)
    elif args.action == "preopen":
        preopen(args.page, args.label)
    elif args.action == "candidate":
        candidate(args.page, args.label)
    elif args.action == "region":
        region(args.page, args.rectangle, args.label)
    elif args.action == "trace":
        trace(args.page)
    elif args.action == "report":
        report()
    elif args.action == "delivery":
        delivery()
    else:
        final_hashes()
    return 0


if __name__ == "__main__":
    if sys.argv[1:2] == ["_execute"]:
        sys.exit(execute(sys.argv[2:]))
    sys.exit(run_logged(sys.argv[1:]))
