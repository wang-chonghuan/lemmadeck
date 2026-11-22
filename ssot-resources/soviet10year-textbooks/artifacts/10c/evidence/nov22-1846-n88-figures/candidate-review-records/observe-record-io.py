#!/usr/bin/env python3
"""Run the unchanged official recorder and observe its hash I/O, not pixels."""

from __future__ import annotations

import argparse
from collections import Counter
import json
import os
from pathlib import Path
import runpy
import sys


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--figure", required=True)
    parser.add_argument("--counts", required=True, type=Path)
    parser.add_argument("official", nargs=argparse.REMAINDER)
    args = parser.parse_args()
    official = args.official
    if official and official[0] == "--":
        official = official[1:]
    tool = Path(official[0]).resolve()
    validator = str(tool.parent / "validate_spec.py")
    repo = Path("/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck")
    candidate = repo / ".tmp/stemrobin-184-six/n88-fig38-41-author/candidate"
    directory = candidate / args.figure.replace("-", "")
    source = repo / f".tmp/stemrobin-184-six/n88-raw-assembly/artifacts/10c/figures/{args.figure}.png"
    kinds = {
        str(source): "original_png_opaque_sha256",
        str(directory / "spec.json"): "spec_text_sha256",
        str(directory / "render.json"): "render_report_text_sha256",
        str(directory / f"{args.figure}.svg"): "svg_opaque_sha256",
    }
    hashes = []
    open_counts = Counter()
    validations = []

    def profile(frame, event, _argument):
        if event != "call" or os.path.abspath(frame.f_code.co_filename) != validator:
            return
        if frame.f_code.co_name == "sha256":
            file = os.path.abspath(os.fspath(frame.f_locals["path"]))
            hashes.append({"path": file, "kind": kinds.get(file, "other")})
        elif frame.f_code.co_name == "validate":
            validations.append({
                "path": os.path.abspath(os.fspath(frame.f_locals["spec_path"])),
                "stage": frame.f_locals["stage"],
                "called_by": "official record_review.py only",
            })

    def audit(event, arguments):
        if event != "open" or not isinstance(arguments[0], (str, bytes, os.PathLike)):
            return
        file = os.path.abspath(os.fsdecode(arguments[0]))
        if file in kinds:
            open_counts[file] += 1

    # These hooks observe calls; they do not replace sha256, validation or output.
    sys.addaudithook(audit)
    sys.setprofile(profile)
    sys.path.insert(0, str(tool.parent))
    sys.argv = [str(tool), *official[1:]]
    exit_code = 0
    try:
        runpy.run_path(str(tool), run_name="__main__")
    except SystemExit as error:
        exit_code = error.code if isinstance(error.code, int) else 1
        if error.code and not isinstance(error.code, int):
            print(error.code, file=sys.stderr)
    except BaseException:
        exit_code = 1
        raise
    finally:
        sys.setprofile(None)
        counts = Counter(item["kind"] for item in hashes)
        payload = {
            "schema": "n88-official-review-record-opaque-io@1",
            "figure": args.figure,
            "officialTool": str(tool),
            "officialArgv": sys.argv,
            "officialExitCode": exit_code,
            "observedInstalledSha256Calls": hashes,
            "sha256CallCounts": dict(counts),
            "observedBoundFileOpenCounts": dict(open_counts),
            "requiredRenderedValidationCalls": validations,
            "actualOriginalPngOpaqueHashCalls": counts["original_png_opaque_sha256"],
            "actualOriginalPngByteOpens": open_counts[str(source)],
            "imageModelViews": 0,
            "nativeImageHeaderReads": 0,
            "diagnosticDecodes": 0,
            "newReviewOrMathOrVisualObservation": False,
            "observationalHooksOnly": True,
            "separateValidatorInvocations": 0,
        }
        args.counts.write_text(json.dumps(payload, indent=2) + "\n")
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
