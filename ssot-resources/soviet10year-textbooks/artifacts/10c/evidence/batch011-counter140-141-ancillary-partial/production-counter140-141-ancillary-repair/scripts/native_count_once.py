#!/usr/bin/env python3
"""The single authorized native array count per page after the frozen proof."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
import numpy as np
from PIL import Image

OWNED = Path(__file__).resolve().parents[1]
ROOT = OWNED.parents[4]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--page", required=True, type=int, choices=(140, 141))
    args = parser.parse_args()
    gate_path = OWNED / "proof/gate.json"
    gate = json.loads(gate_path.read_text())
    if gate["status"] != "ALL_NEW_PROOF_CASES_PASS_FROZEN":
        raise SystemExit("Frozen proof gate is not ready")
    tool = Path(gate["layout_path"])
    if sha(tool) != gate["layout_sha256"]:
        raise SystemExit("Tool changed after proof freeze")
    before = json.loads((OWNED / "before/inputs.json").read_text())
    for item in before["inputs"]:
        if item["immutable"] and sha(Path(item["path"])) != item["sha256"]:
            raise SystemExit("Immutable input changed: " + item["path"])
    page = args.page
    source = ROOT / (
        ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c140-143/"
        f"10c/pages/{page:04d}/page.png"
    )
    durable = ROOT / f"ssot-resources/soviet10year-textbooks/artifacts/10c/pages/{page:04d}"
    metadata = json.loads((durable / "page.json").read_text())
    meta = metadata["meta"]
    exclusions = meta.get("count_exclusions", [])
    figures = meta.get("figures", [])
    if exclusions or figures:
        raise SystemExit("Authorized pages must still have no figures or count exclusions")
    attempts = OWNED / "native"
    attempts.mkdir(exist_ok=True)
    claim = attempts / f"{page}-attempt.json"
    # Exclusive creation is the one-count fence, including a failed attempt.
    with claim.open("x", encoding="ascii") as stream:
        json.dump({
            "page": page, "source": str(source), "source_sha256": sha(source),
            "layout_sha256": sha(tool), "proof_gate_sha256": sha(gate_path),
            "maximum_full_page_count_calls": 1,
        }, stream, indent=2)
        stream.write("\n")
    spec = importlib.util.spec_from_file_location("frozen_layout", tool)
    layout = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(layout)
    # Numerical decode only for this explicitly authorized count; no image UI,
    # save, crop, preview, plotting or payload APIs are used.
    with Image.open(source) as image:
        ink = layout.ink_mask(image)
    source_ink_sha = hashlib.sha256(ink.tobytes()).hexdigest()
    columns = np.flatnonzero(ink.any(axis=0))
    content_w = int(columns[-1] - columns[0] + 1)
    original = ink.copy()
    bands = layout.line_bands(ink, content_w)
    expected = gate["authorized_native_pages"][str(page)]
    result = {
        "page": page, "phase": "authorized_once_after_frozen_new_proof",
        "source": str(source), "source_sha256": sha(source),
        "source_ink_sha256": source_ink_sha, "layout_path": str(tool),
        "layout_sha256": sha(tool), "proof_gate_sha256": sha(gate_path),
        "array_shape": list(ink.shape), "content_width": content_w,
        "figures": figures, "count_exclusions": exclusions,
        "mask_policy": "unaltered original native ink; figures and exclusions are empty",
        "full_page_count_calls": 1, "line_bands": bands, "lines_printed": len(bands),
        "expected_rows_from_independent_source": expected,
        "passed": len(bands) == expected,
        "source_array_unchanged": bool(np.array_equal(ink, original)),
        "source_file_unchanged": sha(source) == meta["render"]["sha256"],
        "unknown518_policy": "no new mask, intent classification, normalization or source modification",
        "p2c_called": False,
    }
    (attempts / f"{page}-result.json").write_text(json.dumps(result, indent=2) + "\n", encoding="ascii")
    print(json.dumps(result, indent=2))
    return 0 if result["passed"] and result["source_array_unchanged"] and result["source_file_unchanged"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
