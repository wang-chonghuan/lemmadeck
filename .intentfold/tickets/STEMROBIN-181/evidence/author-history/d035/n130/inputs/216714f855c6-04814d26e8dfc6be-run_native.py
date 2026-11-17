from __future__ import annotations

import hashlib
import json
import os
import shutil
import stat
import struct
import subprocess
import sys
import traceback
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path


REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OWNED = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d035-source318-native"
TMP = REPO / ".intentfold/tickets/STEMROBIN-181/tmp"
TOOLS = REPO / ".claude/skills/ld-s10y-lesson/tools"
PYTHON = REPO / ".claude/skills/ld-s10y-lesson/.venv/bin/python"
ROOT = OWNED / "root"
WORK = OWNED / "work"
PDIR = ROOT / "9p/pages/0318"
WDIR = WORK / "9p/pages/0318"
PREPARED = REPO / ".tmp/ld-s10y-lesson/9p/pages/0318"
PRESERVATION = TMP / "d032-start/preservation.json"
REPAIR = TMP / "d035-source318-exact-repair/repair-freeze.json"
REVIEW = TMP / "d035-source318-repair-affected-review.json"
TEXT_REFS = [f"p0318#{n}" for n in (1, 3, 4, 5, 6, 7, 8, 9)]
CANONICAL = [
    REPO / "ssot-resources/soviet10year-textbooks/artifacts/9p/book.json",
    REPO / "ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/book.json",
    REPO / ".intentfold/tickets/STEMROBIN-181/production-meter.json",
    REPO / ".intentfold/tickets/STEMROBIN-181/evidence/index.json",
]


def now():
    return datetime.now(timezone.utc).isoformat()


def owned_path(path):
    path = Path(path)
    if not path.resolve().is_relative_to(OWNED.resolve()):
        raise ValueError(f"Write outside ownership: {path}")
    return path


def write_json(path, value):
    path = owned_path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def binding(path):
    path = Path(path)
    data = path.read_bytes()
    return {
        "path": str(path),
        "sha256": hashlib.sha256(data).hexdigest(),
        "bytes": len(data),
        "mode": stat.S_IMODE(path.stat().st_mode),
    }


INPUTS = {}


class InputBindingMismatch(ValueError):
    pass


def verify(path, expected):
    actual = binding(path)
    actual["expectedSha256"] = expected
    actual["matchesExpectedSha256"] = actual["sha256"] == expected
    INPUTS[actual["path"]] = actual
    if actual["sha256"] != expected:
        raise InputBindingMismatch(
            f"Hash mismatch: {path}; expected {expected}; actual {actual['sha256']}"
        )
    return actual


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def guard_snapshot(paths):
    records = []
    for path in paths:
        try:
            records.append(binding(path))
        except OSError as error:
            records.append({"path": str(path), "error": str(error)})
    return records


def differences(expected, actual):
    current = {item["path"]: item for item in actual}
    result = []
    for item in expected:
        found = current.get(item["path"], {})
        changed = [
            key for key in ("sha256", "mode", "bytes") if item.get(key) != found.get(key)
        ]
        if changed or found.get("error"):
            result.append({"path": item["path"], "changed": changed, "actual": found})
    return result


def copy_exact(source, destination):
    destination = owned_path(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)
    original = binding(source)
    staged = binding(destination)
    if original["sha256"] != staged["sha256"]:
        raise ValueError(f"Staged bytes changed: {destination}")
    return {"input": original, "staged": staged, "byteIdentical": True}


def png_dimensions(path):
    # Header metadata only; no image is decoded or opened for visual review.
    with Path(path).open("rb") as stream:
        header = stream.read(24)
    if header[:8] != b"\x89PNG\r\n\x1a\n" or header[12:16] != b"IHDR":
        raise ValueError(f"Not a PNG IHDR: {path}")
    return list(struct.unpack(">II", header[16:24]))


def invoke(command, environment):
    args = [
        str(PYTHON), "-B", str(TOOLS / "p2c.py"), command,
        "--book", "9p", "--page", "318",
        "--root", str(ROOT), "--work", str(WORK),
    ]
    receipt_dir = owned_path(OWNED / "receipts" / command)
    receipt_dir.mkdir(parents=True, exist_ok=False)
    stdin_path = receipt_dir / "stdin.bin"
    stdin_path.write_bytes(b"")
    receipt = {
        "command": args,
        "cwd": str(REPO),
        "startedAt": now(),
        "invocationOrdinal": 1,
        "stdin": binding(stdin_path),
        "environmentOverrides": {
            key: environment[key] for key in ("PYTHONDONTWRITEBYTECODE", "TMPDIR")
        },
    }
    write_json(receipt_dir / "started.json", receipt)
    completed = subprocess.run(args, cwd=REPO, env=environment, input=b"", capture_output=True)
    stdout_path = receipt_dir / "stdout.bin"
    stderr_path = receipt_dir / "stderr.bin"
    stdout_path.write_bytes(completed.stdout)
    stderr_path.write_bytes(completed.stderr)
    receipt.update({
        "finishedAt": now(),
        "exitCode": completed.returncode,
        "stdout": binding(stdout_path),
        "stderr": binding(stderr_path),
        "stdoutText": completed.stdout.decode("utf-8", errors="replace"),
        "stderrText": completed.stderr.decode("utf-8", errors="replace"),
    })
    write_json(receipt_dir / "receipt.json", receipt)
    receipt["receiptBinding"] = binding(receipt_dir / "receipt.json")
    return receipt


def main():
    with owned_path(OWNED / "execution-once.json").open("x", encoding="utf-8") as stream:
        json.dump({"startedAt": now(), "finalizeLimit": 1, "vectorizeLimit": 1}, stream)

    manifest = {
        "schema": "ld-s10y-lesson/isolated-native-pages@1",
        "ticket": "STEMROBIN-181",
        "batch": "d035-source318-native",
        "role": "ISOLATED NATIVE EXECUTOR",
        "startedAt": now(),
        "status": "NOT-RUN",
        "ownership": {"directory": str(OWNED), "unownedWrites": 0},
        "book": "9p",
        "physicalPage": 318,
        "printedPage": 309,
        "sourceApproval": False,
        "sourceApprovalMethod": "Reused hash-bound independent affected TEXT review; no recertification.",
        "sourceApprovalBindingValidatedForThisExecution": False,
        "sourceApprovalScope": TEXT_REFS,
        "excludedSourceRefs": ["p0318#2"],
        "fullPageSourceApproval": False,
        "rawApproval": False,
        "cropApproval": False,
        "sciApproval": False,
        "modernApproval": False,
        "fullCardApproval": False,
        "canonicalPromotion": False,
        "sourceCountIncrease": 0,
        "newImageOpens": 0,
        "priorContextImageOpens": 8,
        "imageHandling": "Native processing authorized; helper reads PNG headers and hashes only; no visual opens.",
        "nativeFinalizeInvocations": 0,
        "nativeVectorizeInvocations": 0,
        "helperRecountInvocations": 0,
        "gateReplayInvocations": 0,
        "receipts": {},
        "prohibitedOperationsPerformed": [],
        "requestedInputs": {
            "repairFreeze": {
                "path": str(REPAIR),
                "sha256": "9fe2521cc023f39e6767d64ecb6dc0302714087fdda2dd3ae21936a3d25997fb",
            },
            "independentTextReview": {
                "path": str(REVIEW),
                "sha256": "0a688f86a5713f76c0373e545e048ec4c293a209000813e2ad88df5b48f3fb4f",
            },
        },
        "native318": {
            "notRun": True, "linesPrinted": None, "linesMarkdown": None,
            "errors": [], "warnings": [],
        },
        "targetRAW294": {
            "id": "fig-294", "sourceBlockRef": "p0318#2",
            "roughBox": [915, 245, 390, 315], "paddingPx": 12,
            "actualSnappedBox": None, "dimensions": None, "crop": None, "svg": None,
            "rawApproval": False, "fullPageSourceApproval": False,
            "cropProduced": False,
        },
    }
    expected_preserved = []
    before_preserved = []
    before_canonical = []
    staged = []
    try:
        INPUTS[str(PRESERVATION)] = binding(PRESERVATION)
        preservation = load(PRESERVATION)
        if preservation["fileCount"] != 103 or len(preservation["files"]) != 103:
            raise ValueError("Expected exactly103 preservation entries")
        expected_preserved = [
            {**item, "path": str(REPO / item["path"])} for item in preservation["files"]
        ]
        before_preserved = guard_snapshot([item["path"] for item in expected_preserved])
        before_canonical = guard_snapshot(CANONICAL)
        before_diff = differences(expected_preserved, before_preserved)
        write_json(OWNED / "preservation-before.json", {
            "authority": binding(PRESERVATION),
            "expected": expected_preserved,
            "observed": before_preserved,
            "mismatches": before_diff,
            "canonicalBooksMeterIndex": before_canonical,
        })
        if before_diff or any("error" in item for item in before_canonical):
            raise ValueError("Preservation baseline mismatch; no native invocation allowed")

        verify(REPAIR, "9fe2521cc023f39e6767d64ecb6dc0302714087fdda2dd3ae21936a3d25997fb")
        repair = load(REPAIR)
        entry = next(item for item in repair["pages"] if item["page"] == 318)
        manifest["initialFailure"] = entry["initialFailure"]
        manifest["initial25Versus26FailureRetained"] = True
        manifest["independentPrintedRows"] = entry["printedRowsRetained"]
        manifest["targetRAW294"]["source"] = verify(
            entry["source"]["path"], entry["source"]["sha256"]
        )
        manifest["requestedInputs"]["repairedCandidate"] = verify(
            entry["candidate"]["path"], entry["candidate"]["sha256"]
        )
        verify(REVIEW, "0a688f86a5713f76c0373e545e048ec4c293a209000813e2ad88df5b48f3fb4f")
        review = load(REVIEW)
        if (
            review["status"] != "PASS"
            or review["sourceApproval"] is not True
            or review["fullPageSourceApproval"] is not False
            or review["effectiveSource318"]["approvedTextRefs"] != TEXT_REFS
            or review["remainingRawExclusion"]["markOriginUnknownRetained"] is not True
        ):
            raise ValueError("Independent review does not match the authorized TEXT-only scope")
        for item in review["hashBindings"].values():
            if isinstance(item, dict) and "path" in item and "sha256" in item:
                verify(item["path"], item["sha256"])
        for item in repair["generatedOutputs"]:
            verify(item["path"], item["sha256"])
        verify(repair["inputBindings"]["path"], repair["inputBindings"]["sha256"])
        repair_inputs = load(repair["inputBindings"]["path"])
        for key in ("reviewInputsAndSources", "snapshots"):
            for item in repair_inputs[key]:
                verify(item["path"], item["sha256"])

        prepared_hashes = {
            "page.png": "e454f4df18da41fe1421956da8e6786d32c981f5b761d75aecab135b413a777a",
            "page.grid.png": "74a8e253f427d7921d44c1776c13385cf95a646823c27f104ad17291bacd42f8",
            "layout.json": "df7b12e148d69e9e41ca89917ef62c16a391bebfe1dc2f05eaa07f9947375aa5",
            "page.template.md": "83d7e6ab6b723716f9eef434753646ba8935a13fda0b351c537b6bf4f72e06ca",
        }
        for name, expected in prepared_hashes.items():
            verify(PREPARED / name, expected)
        candidate = entry["candidate"]
        verify(candidate["path"], candidate["sha256"])
        verify(entry["original"]["path"], entry["original"]["sha256"])
        if candidate["sha256"] != "dd34654e4beb6ef063c1aed05f942fc4c42dd72bdc0ccb664d3d82b94c56352b":
            raise ValueError("Unexpected repaired candidate")
        sys.path.insert(0, str(TOOLS))
        import blocks as B

        meta, blocks = B.parse(Path(candidate["path"]).read_text(encoding="utf-8"))
        if meta["counting"] != entry["counting"] or meta.get("figure_crops"):
            raise ValueError("Counting or crop configuration drift")
        pdf = REPO / "ssot-resources/soviet10year-textbooks/sources/soviet10years" / meta["source"]["pdf"]
        verify(pdf, meta["source"]["pdf_sha256"])
        verify(TOOLS.parent / "profiles/soviet-cn.json", meta["profile"]["sha256"])
        for name in ("p2c.py", "layout.py", "blocks.py"):
            frozen = next(
                item for item in repair_inputs["reviewInputsAndSources"]
                if item["path"].endswith(f"/snapshots/tools/{name}")
            )
            verify(TOOLS / name, frozen["sha256"])
        for path in (
            TOOLS / "vectorize.py", TOOLS / "mathcheck.py", TOOLS / "normalize.py",
            TOOLS / "katex_check.js", TOOLS / "svg_raster.js",
            TOOLS.parent / "package.json", TOOLS.parent / "package-lock.json",
            REPO / "ssot-resources/soviet10year-textbooks/sources/manifest.json",
        ):
            INPUTS[str(path)] = binding(path)

        manifest["sourceApproval"] = True
        manifest["sourceApprovalBindingValidatedForThisExecution"] = True
        manifest["initialFailure"] = entry["initialFailure"]
        manifest["initial25Versus26FailureRetained"] = True
        manifest["independentPrintedRows"] = entry["printedRowsRetained"]
        manifest["counting"] = entry["counting"]
        manifest["textScopeBinding"] = {
            "repairFreeze": binding(REPAIR),
            "independentReview": binding(REVIEW),
            "repairedCandidate": binding(candidate["path"]),
            "approvedTextRefs": TEXT_REFS,
            "fullPageSourceApproval": False,
            "rawExclusion": review["remainingRawExclusion"],
        }
        manifest["initialFailureReceiptBindings"] = [
            item for item in INPUTS.values()
            if Path(item["path"]).name in ("initial-counts.json", "initial-failed-receipts.json", "initial-count-receipt.json")
        ]
        staged.append(copy_exact(candidate["path"], PDIR / "page.md"))
        for name in prepared_hashes:
            staged.append(copy_exact(PREPARED / name, WDIR / name))
        manifest["staging"] = staged
        write_json(OWNED / "input-freeze.json", {
            "frozenAt": now(), "inputs": list(INPUTS.values()), "staging": staged,
            "helper": binding(__file__),
            "sourceScope": manifest["textScopeBinding"],
            "initialFailure": entry["initialFailure"],
        })
        owned_path(OWNED / "temporary").mkdir()
        environment = dict(os.environ)
        environment.update({
            "PYTHONDONTWRITEBYTECODE": "1", "TMPDIR": str(OWNED / "temporary"),
        })

        manifest["nativeFinalizeInvocations"] = 1
        finalized = invoke("finalize", environment)
        manifest["receipts"]["finalize"] = finalized
        audit_path = PDIR / "audit.json"
        audit = load(audit_path) if audit_path.exists() else None
        manifest["native318"] = {
            "auditBinding": binding(audit_path) if audit else None,
            "audit": audit,
            "linesPrinted": audit["lines_printed"] if audit else None,
            "linesMarkdown": audit["lines_md"] if audit else None,
            "errors": audit["errors"] if audit else ["Finalize emitted no audit"],
            "warnings": audit["katex_warnings"] if audit else [],
            "exitCode": finalized["exitCode"],
        }
        finalize_pass = finalized["exitCode"] == 0 and audit is not None and not audit["errors"]
        manifest["nativeFinalizePassed"] = finalize_pass
        if finalize_pass:
            manifest["nativeVectorizeInvocations"] = 1
            vectorized = invoke("vectorize", environment)
            manifest["receipts"]["vectorize"] = vectorized
            manifest["nativeVectorizePassed"] = vectorized["exitCode"] == 0
            manifest["status"] = "NATIVE-PASS" if vectorized["exitCode"] == 0 else "VECTORIZE-FAIL"
        else:
            manifest["status"] = "FINALIZE-FAIL"
            manifest["vectorizeSkippedReason"] = "First isolated finalize did not pass; no retry or replay."

        if audit:
            figure = next(item for item in audit["figures"] if item["id"] == "fig-294")
            crop = WDIR / "figures/fig-294.png"
            svg = crop.with_suffix(".svg")
            x, y, width, height = figure["box"]
            source_width, source_height = png_dimensions(WDIR / "page.png")
            rectangle = [
                max(0, x - 12), max(0, y - 12),
                min(source_width, x + width + 12), min(source_height, y + height + 12),
            ]
            manifest["targetRAW294"] = {
                "id": "fig-294",
                "sourceBlockRef": "p0318#2",
                "captionTextRef": "p0318#3",
                "roughBox": entry["figure294Box"],
                "actualSnappedBox": figure["box"],
                "nativeGeometryReceipt": figure,
                "paddingPx": 12,
                "actualCropRectangleXYXY": rectangle,
                "dimensions": png_dimensions(crop),
                "sourceDimensions": [source_width, source_height],
                "source": binding(entry["source"]["path"]),
                "stagedSource": binding(WDIR / "page.png"),
                "crop": binding(crop),
                "svg": binding(svg) if svg.exists() else None,
                "excludedPixelBoxes": figure.get("crop_excluded_figures", []),
                "sourcePixelEdits": False,
                "cropPostProcessingByHelper": False,
                "markOriginUnknownRetained": True,
                "markErasureOrReinterpretation": False,
                "markRetentionBasis": "Unmodified source; unchanged rough box; native crop only, no exclusion or pixel cleanup.",
                "rawApproval": False,
                "fullPageSourceApproval": False,
                "vectorizationEvidence": "Existing p2c.py vectorize stdout/exit code only; no second fidelity gate.",
            }
            if svg.exists():
                svg_root = ET.parse(svg).getroot()
                manifest["targetRAW294"]["svgDimensions"] = [
                    int(svg_root.attrib["width"]), int(svg_root.attrib["height"])
                ]
            native_meta, native_blocks = B.parse((PDIR / "page.md").read_text(encoding="utf-8"))
            body_changes = []
            for index, (before, after) in enumerate(zip(blocks, native_blocks), 1):
                if before["lines"] != after["lines"]:
                    body_changes.append({"ref": f"p0318#{index}", "before": before["lines"], "after": after["lines"]})
            manifest["nativeSerialization"] = {
                "blockCountBefore": len(blocks),
                "blockCountAfter": len(native_blocks),
                "textLineChanges": body_changes,
                "textLinesUnchanged": not body_changes and len(blocks) == len(native_blocks),
                "frontmatterChangedKeys": sorted(
                    key for key in set(meta) | set(native_meta) if meta.get(key) != native_meta.get(key)
                ),
                "sourceTextApprovalNotExpanded": True,
                "rowCountsReadOnlyFromSingleFinalizeAudit": True,
            }
    except Exception as error:
        manifest["status"] = "INPUT-BINDING-HOLD" if isinstance(error, InputBindingMismatch) else "EXECUTION-ERROR"
        manifest["executionError"] = str(error)
        manifest["traceback"] = traceback.format_exc()
    finally:
        after_preserved = guard_snapshot([item["path"] for item in expected_preserved])
        after_canonical = guard_snapshot(CANONICAL) if before_canonical else []
        after_inputs = guard_snapshot(list(INPUTS))
        historical_diff = differences(expected_preserved, after_preserved)
        preservation_diff = differences(before_preserved, after_preserved)
        canonical_diff = differences(before_canonical, after_canonical)
        input_diff = differences(list(INPUTS.values()), after_inputs)
        guards = {
            "preservationAuthority": binding(PRESERVATION),
            "preservedFileCount": len(expected_preserved),
            "before": before_preserved,
            "after": after_preserved,
            "historicalHashAndPermissionMismatchesAfter": historical_diff,
            "preservedHashAndPermissionChangesDuringRun": preservation_diff,
            "canonicalBooksMeterIndexBefore": before_canonical,
            "canonicalBooksMeterIndexAfter": after_canonical,
            "canonicalHashAndPermissionChangesDuringRun": canonical_diff,
            "inputsBefore": list(INPUTS.values()),
            "inputsAfter": after_inputs,
            "inputHashAndPermissionChangesDuringRun": input_diff,
            "allPreservedHashesAndPermissionsUnchanged": bool(before_preserved) and not historical_diff and not preservation_diff,
            "canonicalBooksMeterIndexUnchanged": bool(before_canonical) and not canonical_diff,
            "inputBytesAndPermissionsUnchanged": not input_diff,
            "restoreOrRevertPerformed": False,
        }
        write_json(OWNED / "preservation-after.json", guards)
        manifest["preservation"] = guards
        manifest["inputFreeze"] = binding(OWNED / "input-freeze.json") if (OWNED / "input-freeze.json").exists() else None
        manifest["inputBindings"] = list(INPUTS.values())
        manifest["inputBindingMismatches"] = [
            item for item in INPUTS.values() if item.get("matchesExpectedSha256") is False
        ]
        manifest["helper"] = binding(__file__)
        manifest["finishedAt"] = now()
        if historical_diff or preservation_diff or canonical_diff or input_diff:
            manifest["executionStatusBeforeGuardHold"] = manifest["status"]
            manifest["status"] = "PRESERVATION-HOLD"
        manifest["generatedArtifacts"] = [
            binding(path) for path in sorted(OWNED.rglob("*"))
            if path.is_file() and path.name != "pages-native.json"
        ]
        write_json(OWNED / "pages-native.json", manifest)
        print(json.dumps({
            "status": manifest["status"],
            "manifest": binding(OWNED / "pages-native.json"),
            "nativeRows": manifest.get("native318", {}).get("linesPrinted"),
            "markdownRows": manifest.get("native318", {}).get("linesMarkdown"),
            "finalizeInvocations": manifest["nativeFinalizeInvocations"],
            "vectorizeInvocations": manifest["nativeVectorizeInvocations"],
            "targetRAW294": manifest.get("targetRAW294"),
            "error": manifest.get("executionError"),
        }, ensure_ascii=False, indent=2))
    return 0 if manifest["status"] == "NATIVE-PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
