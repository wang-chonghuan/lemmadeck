import hashlib
import json
import re
import stat
import sys
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree

from PIL import Image


REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
TMP = REPO / ".intentfold/tickets/STEMROBIN-181/tmp"
AUTHOR = TMP / "d625-source209-first-author"
INCOMING = TMP / "d612-source208-first-author"
OWN = TMP / "d631-source209-first-independent-review"
EXPECTED = {
    "report.json": "c0f184888c12605cb44be078303a6fcb2168fe19e320d5e73aa38dc4e26da594",
    "hash-manifest.json": "68b354998d6c611078d4da77ac4ce9d0bbc64fa832f7337104370b00fb14c948",
    "freeze.receipt.json": "ad5ee9ba28927df8823f345c247eec4ed65e63e8c39ccffb8858f08fd428f4c0",
}


def binding(path):
    data = path.read_bytes()
    return {
        "path": str(path),
        "sha256": hashlib.sha256(data).hexdigest(),
        "bytes": len(data),
        "mode": f"{stat.S_IMODE(path.stat().st_mode):04o}",
    }


def read_json(path):
    return json.loads(path.read_text())


def write_owned(name, value):
    path = OWN / name
    assert path.parent == OWN and not path.exists(), str(path)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def author_bindings():
    manifest = read_json(AUTHOR / "hash-manifest.json")
    result = {}
    for relative, expected in manifest["files"].items():
        path = AUTHOR / relative
        assert path.resolve().is_relative_to(AUTHOR.resolve()), relative
        current = binding(path)
        assert current["sha256"] == expected["sha256"], relative
        assert current["bytes"] == expected["bytes"], relative
        assert current["mode"] == "0444", relative
        result[relative] = current
    for relative, expected in EXPECTED.items():
        current = binding(AUTHOR / relative)
        assert current["sha256"] == expected, relative
        assert current["mode"] == "0444", relative
        result[relative] = current
    assert len(result) == 54
    receipt = read_json(AUTHOR / "freeze.receipt.json")
    assert receipt["reportSHA256"] == EXPECTED["report.json"]
    assert receipt["hashManifestSHA256"] == EXPECTED["hash-manifest.json"]
    return result


def parse_page_md(path):
    _, metadata, body = path.read_text().split("---\n", 2)
    parts = re.split(r"(?m)^<!-- (.*?) -->\n", body)
    blocks = []
    for index in range(1, len(parts), 2):
        header = parts[index]
        kind = header.split()[0]
        lines = [line for line in parts[index + 1].splitlines() if line.strip()]
        if kind == "fig":
            lines = []
        blocks.append({"kind": kind, "header": header, "lines": lines})
    return json.loads(metadata), blocks


def verify():
    frozen = author_bindings()
    first_meta, first = parse_page_md(AUTHOR / "first-source/page.md")
    final_meta, final = parse_page_md(AUTHOR / "source/10p/pages/0209/page.md")
    page = read_json(AUTHOR / "source/10p/pages/0209/page.json")
    audit = read_json(AUTHOR / "source/10p/pages/0209/audit.json")
    assert len(first) == len(final) == len(page["blocks"]) == 9
    assert {key: final_meta[key] for key in first_meta} == first_meta
    for before, after, structured in zip(first, final, page["blocks"]):
        assert before["kind"] == after["kind"] == structured["kind"]
        assert before["lines"] == after["lines"] == structured["lines"]
        if after["kind"] != "fig":
            assert before["header"] == after["header"]
        for flag in ("open", "cont", "samerow"):
            assert structured[flag] == (flag in after["header"].split())
    assert page["meta"] == final_meta
    raw_text_lines = sum(len(block["lines"]) for block in page["blocks"])
    shared = sum(len(block["lines"]) for block in page["blocks"] if block["samerow"])
    assert raw_text_lines == 18 and shared == 1
    assert raw_text_lines - shared == audit["lines_md"] == audit["lines_printed"] == 17
    assert not audit["errors"] and not audit["normalizations"]
    assert not audit["unknown_chars"] and not audit["katex_warnings"]
    assert audit["errata"] == 0
    assert all(block["kind"] not in ("ex", "exhead") for block in page["blocks"])
    assert page["blocks"][4]["lines"][6] == "到在角膜后边某距离上是用特"
    incoming_bindings = {
        "report.json": binding(INCOMING / "report.json"),
        "source/10p/pages/0208/page.json": binding(INCOMING / "source/10p/pages/0208/page.json"),
    }
    assert incoming_bindings["report.json"]["sha256"] == "6b96c152c684ff01d1a9eb38cacc986af5e3a9b4d6a6ef5a1d02a75955e42cc8"
    assert incoming_bindings["source/10p/pages/0208/page.json"]["sha256"] == "a6982b5dbf0cf6401e3a46edfe44c4a49833e9d59d1238f935fe13dbdc077722"
    incoming = read_json(INCOMING / "source/10p/pages/0208/page.json")["blocks"][5]
    continuation = page["blocks"][2]
    assert incoming["kind"] == "p" and incoming["open"]
    assert incoming["lines"][-1].endswith("为了得到不透明物")
    assert continuation["kind"] == "p" and continuation["cont"] and not continuation["open"]
    assert continuation["lines"][0].startswith("体的像")
    assert continuation["lines"][-1] == "影在屏幕上."
    assert page["blocks"][3]["kind"] == "h3"
    assert page["blocks"][3]["lines"] == ["79. 眼睛　眼镜"]
    assert page["blocks"][7]["open"] and page["blocks"][7]["cont"]
    assert page["blocks"][7]["lines"][-1].endswith("特殊")
    mechanical = read_json(AUTHOR / "verification.json")
    figures = []
    with Image.open(AUTHOR / "work/10p/pages/0209/page.png") as source:
        source.load()
        assert source.size == (1536, 2337)
        for entry in mechanical["figures"]:
            figure = entry["id"]
            raw_path = AUTHOR / f"work/10p/pages/0209/figures/{figure}.png"
            with Image.open(raw_path) as raw:
                expected_crop = source.crop(tuple(entry["rawCropBoxXYXY"]))
                assert raw.size == expected_crop.size
                assert raw.mode == expected_crop.mode
                assert raw.tobytes() == expected_crop.tobytes()
                raw_size = list(raw.size)
            svg_path = AUTHOR / f"work/10p/pages/0209/figures/{figure}.svg"
            root = ElementTree.fromstring(svg_path.read_bytes())
            elements = list(root.iter())
            assert len(elements) == 2
            assert root.tag.rsplit("}", 1)[-1] == "svg"
            path = elements[1]
            assert path.tag.rsplit("}", 1)[-1] == "path"
            assert path.attrib["fill"] == "currentColor"
            assert path.attrib["fill-rule"] == "evenodd"
            assert root.attrib["viewBox"] == f"0 0 {raw_size[0]} {raw_size[1]}"
            assert not any(key.rsplit("}", 1)[-1] == "href" for item in elements for key in item.attrib)
            preview_receipt = read_json(AUTHOR / f"evidence/{figure}.svg-preview-repaired.receipt.json")
            assert preview_receipt["exitCode"] == 0
            assert preview_receipt["svgSHA256"] == frozen[f"work/10p/pages/0209/figures/{figure}.svg"]["sha256"]
            assert preview_receipt["previewSHA256"] == frozen[f"evidence/{figure}.full-svg-preview.png"]["sha256"]
            with Image.open(AUTHOR / f"evidence/{figure}.full-svg-preview.png") as preview:
                assert list(preview.size) == raw_size
            assert entry["mismatchRatio"] <= entry["mismatchLimit"] == 0.02
            figures.append({
                "id": figure,
                "raw_exact_unaltered_source_crop_independently_recomputed": True,
                "crop_xyxy": entry["rawCropBoxXYXY"],
                "size": raw_size,
                "svg_single_evenodd_currentColor_path_independently_parsed": True,
                "svg_path_subpaths": path.attrib["d"].count("M"),
                "preview_receipt_hash_binding_verified": True,
                "native_mismatch_ratio_existing_not_rerun": entry["mismatchRatio"],
                "native_missing_pixels_existing_not_rerun": entry["missingPixels"],
                "native_extra_pixels_existing_not_rerun": entry["extraPixels"],
                "native_tolerance_px": entry["tolerancePx"],
                "native_limit": entry["mismatchLimit"],
            })
    for step in ("finalize", "vectorize"):
        receipt = read_json(AUTHOR / f"native/{step}-first/receipt.json")
        assert receipt["exitCode"] == 0 and receipt["invocations"] == 1
        assert receipt["stdoutSHA256"] == frozen[f"native/{step}-first/stdout.txt"]["sha256"]
        assert receipt["stderrSHA256"] == frozen[f"native/{step}-first/stderr.txt"]["sha256"]
    write_owned("checks.json", {
        "status": "PASS",
        "time_utc": datetime.now(timezone.utc).isoformat(),
        "author_files_current_hash_verified": frozen,
        "incoming208_text_current_hash_verified": incoming_bindings,
        "independent_inventory_binding": binding(OWN / "independent-inventory.json"),
        "additional_crop_binding": binding(OWN / "p0209-eye-row7.pixel-crop.png"),
        "first_final_json_nonfigure_text_equal": True,
        "block_count": 9,
        "raw_block_text_lines_including_footer": raw_text_lines,
        "shared_caption_rows": shared,
        "physical_rows_including_footer": raw_text_lines - shared,
        "physical_rows_excluding_footer": raw_text_lines - shared - 1,
        "exercise_count": 0,
        "local_join": "".join(incoming["lines"] + continuation["lines"]),
        "incoming208_dependency_accepted": False,
        "n78_local_right_boundary": {"after": "p0209#3", "before": "p0209#4", "closed_locally": True},
        "n79_outgoing_open_unchanged": True,
        "figures": figures,
        "automated_image_decoding": "Only exact crop equality and native-size metadata; no additional images displayed in model context.",
        "native_finalize_vectorize_or_mismatch_reruns": 0,
    })


def freeze():
    before = read_json(OWN / "checks.json")
    assert author_bindings() == before["author_files_current_hash_verified"]
    for relative, expected in before["incoming208_text_current_hash_verified"].items():
        assert binding(INCOMING / relative) == expected
    report = read_json(OWN / "report.json")
    assert report["imageBudget"]["totalOpens"] == 6
    assert report["gates"]["SOURCE209"]["status"] == "PASS"
    paths = sorted(path for path in OWN.iterdir() if path.is_file())
    assert not (OWN / "review-freeze.json").exists()
    for path in paths:
        path.chmod(0o444)
    files = {path.name: binding(path) for path in paths}
    assert all(item["mode"] == "0444" for item in files.values())
    write_owned("review-freeze.json", {
        "schema": "source209-first-independent-review/freeze@1",
        "status": "FROZEN-0444",
        "time_utc": datetime.now(timezone.utc).isoformat(),
        "ownedRoot": str(OWN),
        "files": files,
        "reportSHA256": files["report.json"]["sha256"],
        "initialIndependentInventorySHA256": files["independent-inventory.json"]["sha256"],
        "authorFrozenInputsReverifiedAtEnd": True,
        "incoming208TextInputsReverifiedAtEnd": True,
        "exclusions": ["review-freeze.json (self)"],
        "fileCountIncludingThisReceipt": len(files) + 1,
        "allFileModes": "0444",
        "outsideBytesRestoredOrAltered": False,
        "source208IndependentDependency": "PENDING",
        "n79Outgoing": "HOLD-OPEN-UNTOUCHED",
        "modernFigureApproval": False,
        "fullLessonApproval": False,
    })
    (OWN / "review-freeze.json").chmod(0o444)
    print(json.dumps({
        "status": "FROZEN-0444",
        "report": binding(OWN / "report.json"),
        "freeze": binding(OWN / "review-freeze.json"),
        "files": len(files) + 1,
    }, indent=2))


if __name__ == "__main__":
    if sys.argv[1:] == ["verify"]:
        verify()
        print("PASS: frozen inputs, first/final text, rows, local join, exact RAW crops, SVG structure and existing evidence bindings")
    elif sys.argv[1:] == ["freeze"]:
        freeze()
    else:
        raise SystemExit("Use verify or freeze")
