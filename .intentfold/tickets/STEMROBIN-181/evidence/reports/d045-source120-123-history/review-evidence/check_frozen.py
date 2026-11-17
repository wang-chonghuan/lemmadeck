import hashlib
import json
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
from PIL import Image


W = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = W / ".intentfold/tickets/STEMROBIN-181/tmp"
A = T / "d044-10p-source120-123-author"
E = T / "d045-source120-123-review-evidence"
EXPECTED_FREEZE = "7c89b06fcb8ce62a2de7b90e1ac80793f8a8f636c2d2852639817734581e7e7b"
RASTER = W / ".claude/skills/ld-s10y-lesson/tools/svg_raster.js"

# These groups were counted from the four original pages, not from layout bands.
VISUAL_GROUPS = {
    120: [(1, 1), (2, 3), (3, 1), (4, 5), (5, 2), (6, 4), (8, 1), (9, 1)],
    121: [(1, 6), (4, 2), (5, 1), (6, 1), (7, 4), (8, 4), (9, 5), (10, 2), (11, 1)],
    122: [(1, 1), (2, 3), (3, 1), (4, 3), (5, 4), (8, 7), (9, 2), (10, 1), (11, 1), (12, 1)],
    123: [(1, 5), (2, 3), (3, 7), (4, 6), (5, 4), (8, 1)],
}
VISUAL_RECTS = {
    120: [531, 1482, 441, 480],
    121: [841, 246, 462, 222],
    122: [813, 804, 457, 305],
    123: [940, 1156, 344, 721],
}
VISUAL_REFERENCE_BLOCKS = {120: 6, 121: 1, 122: 8, 123: None}


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def binding(path, expected=None):
    path = Path(path)
    actual = sha(path) if path.is_file() else None
    return {
        "path": str(path),
        "expectedSha256": expected,
        "actualSha256": actual,
        "matches": actual is not None and (expected is None or actual == expected),
    }


def load(path):
    return json.loads(Path(path).read_text())


def write(name, data):
    out = E / name
    assert out.parent == E
    out.write_text(json.dumps(data, ensure_ascii=True, indent=2) + "\n")


def dilate(mask):
    # Zero-padded dilation prevents opposite image edges from wrapping together.
    padded = np.pad(mask, 1)
    h, w = mask.shape
    return np.logical_or.reduce(
        [padded[dy:dy + h, dx:dx + w] for dy in range(3) for dx in range(3)]
    )


def png_pixels(path):
    with Image.open(path) as image:
        return np.asarray(image.convert("RGBA")).copy()


def ink(path):
    with Image.open(path) as image:
        return np.asarray(image.convert("L")) < 128


def vector_difference(source, rendered):
    missing = int((source & ~dilate(rendered)).sum())
    extra = int((rendered & ~dilate(source)).sum())
    return missing, extra, (missing + extra) / int(source.sum())


def inspect(mode):
    previous_raw = None
    if mode == "initial" and (E / "raw-pixel-vector-check.json").is_file():
        previous_raw = load(E / "raw-pixel-vector-check.json")
        if not (E / "raw-pixel-vector-first-run.json").is_file():
            write("raw-pixel-vector-first-run.json", previous_raw)
            write("integrity-first-run.json", load(E / "integrity-initial.json"))
    frozen = load(A / "author-freeze.json")
    bound = binding(A / "author-freeze.json", EXPECTED_FREEZE)
    assert bound["matches"], "Author freeze is not the requested freeze"
    inventory = [binding(b["path"], b["sha256"]) for b in frozen["inventory"]]
    tools = [binding(b["path"], b["sha256"]) for b in frozen["toolBindings"]]
    ancillary = [
        binding(frozen[k]["path"], frozen[k]["sha256"])
        for k in ["preparation", "sourcePdf", "precedingFreeze"]
    ]
    prior_path = T / "d044-source116-119-source-review.json"
    prior = load(prior_path)
    prior119 = next(p for p in prior["pages"] if p["physicalPage"] == 119)
    prior_binding = prior119["bindings"]["pageMd"]
    upstream = {
        "review": binding(prior_path),
        "overallPriorStatus": prior["status"],
        "page119Status": prior119["sourceStatus"],
        "page119Rows": [prior119["independentPrintedRows"], prior119["nativeCountedRows"]],
        "page119Md": binding(prior_binding["path"], prior_binding["sha256"]),
        "frozenTailCopy": binding(A / "inputs/preceding-page119.md", prior_binding["sha256"]),
        "page119ImageOpens": 0,
        "unrelated116HoldRepeated": False,
    }
    assert upstream["page119Status"] == "SOURCE PASS"
    assert upstream["frozenTailCopy"]["matches"] and upstream["page119Md"]["matches"]
    integrity = {
        "schema": "ld-s10y-lesson/frozen-review-integrity@1",
        "mode": mode,
        "authorFreeze": bound,
        "frozenInventoryCount": len(inventory),
        "frozenInventory": inventory,
        "toolBindings": tools,
        "ancillaryBindings": ancillary,
        "upstream119": upstream,
        "allFrozenInventoryMatches": all(b["matches"] for b in inventory + ancillary),
        "allFrozenToolBindingsMatch": all(b["matches"] for b in tools),
        "reviewerCode": binding(__file__),
        "editionPy": {
            **binding(W / ".claude/skills/ld-s10y-lesson/tools/edition.py"),
            "inAuthorToolBindings": False,
            "executed": False,
            "note": "Modern-edition normalizer is outside SOURCE finalize/RAW validation; no rerun or freeze rewrite.",
        },
        "forbiddenReruns": {"prepare": 0, "finalize": 0, "vectorize": 0, "assemble": 0},
    }
    write("integrity-" + mode + ".json", integrity)
    assert integrity["allFrozenInventoryMatches"], "Frozen author artifact drift"
    assert integrity["allFrozenToolBindingsMatch"], "Bound tool drift"
    if mode == "final":
        return integrity

    pages = []
    raw = []
    for page in frozen["pages"]:
        n = page["physicalPage"]
        d = A / "source/10p/pages" / f"{n:04d}"
        data = load(d / "page.json")
        audit = load(d / "audit.json")
        md = (d / "page.md").read_text()
        meta_md, body = md.split("---", 2)[1:]
        metadata_matches = json.loads(meta_md) == data["meta"]
        markers = list(re.finditer(r"<!-- (.*?) -->\n", body))
        parsed = []
        for i, marker in enumerate(markers):
            end = markers[i + 1].start() if i + 1 < len(markers) else len(body)
            text = body[marker.end():end].strip("\n")
            parsed.append((marker.group(1), text.splitlines() if text else []))
        assert len(parsed) == len(data["blocks"])
        md_matches = metadata_matches
        groups = []
        native_rows = 0
        expected_groups = dict(VISUAL_GROUPS[n])
        for i, block in enumerate(data["blocks"], 1):
            marker, lines = parsed[i - 1]
            assert marker.split()[0] == block["kind"]
            for flag in ["cont", "open", "samerow"]:
                assert (flag in marker.split()) == block[flag]
            if block["kind"] != "fig":
                md_matches = md_matches and lines == block["lines"]
            else:
                assert lines == [f'![{block["label"]}](figures/{block["id"]}.png)']
            count = 0 if block["kind"] == "fig" or block["samerow"] else len(block["lines"])
            native_rows += count
            if count:
                groups.append({
                    "block": f"p{n:04d}#{i}",
                    "kind": block["kind"],
                    "sourceVisualRows": expected_groups.get(i),
                    "nativeRows": count,
                    "matches": expected_groups.get(i) == count,
                    "linesVisuallyReviewed": block["lines"],
                })
        captions = [
            {"block": f"p{n:04d}#{i}", "literal": b["lines"], "samerow": b["samerow"]}
            for i, b in enumerate(data["blocks"], 1) if b["kind"] == "cap"
        ]
        prose = [
            {"block": f"p{n:04d}#{i}", "lines": b["lines"]}
            for i, b in enumerate(data["blocks"], 1) if b["kind"] == "p"
        ]
        references = []
        for p in prose:
            for ref in re.findall(r"图\s*(\d+)", "".join(p["lines"])):
                references.append({"block": p["block"], "figureId": f"fig-{int(ref):02d}"})
        expected_ref = VISUAL_REFERENCE_BLOCKS[n]
        assert references == ([] if expected_ref is None else [{
            "block": f"p{n:04d}#{expected_ref}", "figureId": page["crops"][0]["id"]
        }])
        row_pass = (
            native_rows == sum(expected_groups.values()) == page["linesPrinted"]
            == audit["lines_printed"] == audit["lines_md"] == data["meta"]["printed_lines"]
            and len(groups) == len(expected_groups) and all(g["matches"] for g in groups)
        )
        source = {
            "physicalPage": n,
            "printedPage": data["meta"]["printed_page"],
            "bindings": [binding(b["path"], b["sha256"]) for b in page["native"]],
            "sourceImageBinding": binding(page["crops"][0]["source"]["path"], data["meta"]["render"]["sha256"]),
            "visualRows": sum(expected_groups.values()),
            "nativeRows": native_rows,
            "rowGroups": groups,
            "rowPass": row_pass,
            "mdJsonPass": md_matches,
            "captionRows": captions,
            "explicitProseReferences": references,
            "exerciseCount": sum(b["kind"] == "ex" for b in data["blocks"]),
            "errata": data["meta"]["errata"],
            "auditErrors": audit["errors"],
            "auditUnknownChars": audit["unknown_chars"],
            "auditKatexWarnings": audit["katex_warnings"],
            "headings": [
                {"block": f"p{n:04d}#{i}", "literal": b["lines"]}
                for i, b in enumerate(data["blocks"], 1) if b["kind"] == "h3"
            ],
            "emphasis": re.findall(r"\*\*(.*?)\*\*", "\n".join("\n".join(p["lines"]) for p in prose), re.S),
        }
        assert row_pass and md_matches and source["sourceImageBinding"]["matches"]
        assert source["exerciseCount"] == 0 and not source["auditErrors"]
        pages.append(source)

        crop = page["crops"][0]
        x, y, w, h = VISUAL_RECTS[n]
        source_pixels = png_pixels(crop["source"]["path"])
        crop_pixels = png_pixels(crop["path"])
        exact = source_pixels[y:y + h, x:x + w]
        pixel_matches = (
            crop["exactPixelRect"] == [x, y, w, h]
            and crop_pixels.shape == exact.shape == (h, w, 4)
            and np.array_equal(crop_pixels, exact)
        )
        src_ink = ink(crop["path"])
        svg = Path(crop["svg"]["path"])
        root = ET.fromstring(svg.read_bytes())
        tags = [e.tag.rsplit("}", 1)[-1] for e in root.iter()]
        path_nodes = [e for e in root.iter() if e.tag.endswith("}path")]
        pure_vector = (
            tags == ["svg", "path"] and len(path_nodes) == 1
            and path_nodes[0].get("fill-rule") == "evenodd"
            and path_nodes[0].get("fill") == "currentColor"
            and root.get("viewBox") == f"0 0 {w} {h}"
            and root.get("width") == str(w) and root.get("height") == str(h)
        )
        output = E / f'{crop["id"]}.resvg.png'
        assert output.parent == E
        command = ["node", str(RASTER), str(svg), str(output)]
        reused = previous_raw is not None
        if reused:
            previous = next(r for r in previous_raw["figures"] if r["figureId"] == crop["id"])
            assert previous["resvgCommand"] == command
            assert previous["rasterizerBinding"]["actualSha256"] == sha(RASTER)
            assert previous["svg"]["actualSha256"] == sha(svg)
            assert previous["resvgOutput"]["actualSha256"] == sha(output)
            returncode = previous["resvgExitCode"]
            stdout = previous["resvgStdout"]
            stderr = previous["resvgStderr"]
        else:
            proc = subprocess.run(command, capture_output=True, text=True, cwd=str(RASTER.parent.parent))
            returncode, stdout, stderr = proc.returncode, proc.stdout, proc.stderr
        result = json.loads(stdout) if stdout else {"ok": False}
        assert returncode == 0 and result.get("ok"), stderr
        rendered_ink = ink(output)
        assert rendered_ink.shape == src_ink.shape
        missing, extra, ratio = vector_difference(src_ink, rendered_ink)
        source_ink_count = int(src_ink.sum())
        blank_ratio = vector_difference(src_ink, np.zeros_like(src_ink))[2]
        mutated_pixels = crop_pixels.copy()
        mutated_pixels[0, 0, 0] ^= 1
        initial = A / "initial" / f"{n:04d}" / "figures" / f'{crop["id"]}.png'
        vector_copy = A / "vectorized" / f"{n:04d}" / "figures" / svg.name
        xs, ys, bw, bh = crop["box"]
        box_matches = crop["exactPixelRect"] == [xs - 12, ys - 12, bw + 24, bh + 24]
        fig_blocks = [b for b in data["blocks"] if b["kind"] == "fig"]
        native_binding_matches = (
            len(fig_blocks) == 1 and fig_blocks[0]["id"] == crop["id"]
            and fig_blocks[0]["box"] == crop["box"] == data["meta"]["figures"][0]["box"]
            == audit["figures"][0]["box"]
            and sha(initial) == crop["sha256"] and sha(vector_copy) == crop["svg"]["sha256"]
        )
        r = {
            "physicalPage": n,
            "figureId": crop["id"],
            "source": binding(crop["source"]["path"], crop["source"]["sha256"]),
            "png": binding(crop["path"], crop["sha256"]),
            "svg": binding(svg, crop["svg"]["sha256"]),
            "initialPng": binding(initial, crop["sha256"]),
            "vectorizedCopy": binding(vector_copy, crop["svg"]["sha256"]),
            "exactPixelRect": [x, y, w, h],
            "dimensions": [w, h],
            "pixelDifferenceCount": int(np.any(crop_pixels != exact, axis=2).sum()),
            "exactPixelsPass": pixel_matches,
            "snappedBoxPlus12PxPaddingPass": box_matches,
            "nativeMdJsonAuditBindingPass": native_binding_matches,
            "svgStructuralPass": pure_vector,
            "svgTags": tags,
            "rasterizerBinding": binding(RASTER),
            "resvgCommand": command,
            "resvgExitCode": returncode,
            "resvgStdout": stdout,
            "resvgStderr": stderr,
            "resvgInitialHashBoundOutputReusedWithoutRerasterization": reused,
            "resvgOutput": binding(output),
            "resvgOutputVisuallyOpened": False,
            "threshold": 128,
            "edgeTolerancePx": 1,
            "sourceInkPixels": source_ink_count,
            "missingInkPixels": missing,
            "extraInkPixels": extra,
            "mismatchRatio": ratio,
            "mismatchPercent": round(ratio * 100, 6),
            "limitRatio": 0.02,
            "nativeVectorPass": ratio <= 0.02,
            "negativeControls": {
                "onePixelShiftedSourceRectangleRejected": not np.array_equal(
                    crop_pixels, source_pixels[y:y + h, x + 1:x + w + 1]
                ),
                "onePixelInMemoryCropMutationRejected": bool(
                    not np.array_equal(mutated_pixels, exact)
                ),
                "allWhiteVectorWouldFail": {
                    "mismatchRatio": blank_ratio,
                    "passes": blank_ratio <= 0.02,
                },
                "alteredImagesSavedOrOpened": False,
            },
            "visualCompletenessIsSeparate": True,
            "allMechanicalPass": all([
                pixel_matches, box_matches, native_binding_matches, pure_vector, ratio <= 0.02,
            ]),
        }
        raw.append(r)
        assert r["allMechanicalPass"], crop["id"]
        negatives = r["negativeControls"]
        assert negatives["onePixelShiftedSourceRectangleRejected"]
        assert negatives["onePixelInMemoryCropMutationRejected"]
        assert not negatives["allWhiteVectorWouldFail"]["passes"]
    write("source-text-line-bindings.json", {
        "pages": pages,
        "totalRows": sum(p["visualRows"] for p in pages),
        "totalExercises": sum(p["exerciseCount"] for p in pages),
        "sharedCaptionRowCountsOnce": True,
        "visualSourceCheckIsHumanObservation": True,
        "officialFinalizeReruns": 0,
    })
    write("raw-pixel-vector-check.json", {"figures": raw, "allMechanicalPass": all(r["allMechanicalPass"] for r in raw)})
    return integrity


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "initial"
    assert mode in ["initial", "final"]
    result = inspect(mode)
    print(json.dumps({
        "mode": mode,
        "freezeMatches": result["authorFreeze"]["matches"],
        "inventoryCount": result["frozenInventoryCount"],
        "allFrozenInventoryMatches": result["allFrozenInventoryMatches"],
        "allFrozenToolBindingsMatch": result["allFrozenToolBindingsMatch"],
        "outputDirectory": str(E),
    }, indent=2))
