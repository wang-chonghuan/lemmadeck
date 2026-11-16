"""Append actually opened supplemental pixels, retaining blocked originals."""

import hashlib
import json
import sys
from pathlib import Path


ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
OBSERVER = "Codex independent actual-display-only observer, current chat"
N33_ENDS = {
    (2, "A"): "The last factor's a^20 and b^12 and ending punctuation are fully visible.",
    (4, "stem"): "The final parenthesized decimal-times-power term and outer superscript 3 are visible.",
    (4, "A"): "The final decimal-times-power expression and exponent 7 are visible.",
    (4, "B"): "The final decimal-times-power expression and two-digit exponent 14 are visible.",
    (5, "stem"): "The final negative fractional-coefficient term, inner superscript and outer superscript 3 are visible.",
    (5, "A"): "The final negative fraction coefficient, a^3 y^9 and ending punctuation are visible.",
    (5, "C"): "The final negative fraction coefficient, a^4 y^6 and ending punctuation are visible.",
    (6, "A"): "The last parenthesized c/q-power term and outer superscript 2 are fully visible.",
    (6, "B"): "The final parenthesized c^2 q^3 term and outer superscript 2 are visible.",
    (6, "C"): "The final negative parenthesized c^2 q^3 term and outer superscript 2 are visible.",
    (6, "D"): "The final parenthesized c^8 q^12 term and outer superscript 2 are visible.",
    (7, "C"): "The last negative parenthesized c/d-power term, inner superscripts and outer superscript 3 are visible.",
    (8, "A"): "The final long integer and punctuation are fully painted at the right endpoint.",
    (8, "B"): "The final parenthesized slash fraction and outer superscript 6 are visible.",
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify(record):
    if sha(ROOT / record["path"]) != record["sha256"]:
        raise RuntimeError(f"Observed evidence changed: {record['path']}")


def main():
    number = sys.argv[1]
    if number not in ("33", "42"):
        raise RuntimeError("Expected 33 or 42")
    manifest = json.loads((OUT / "supplement-manifest.json").read_text())
    index = 0 if number == "33" else 1
    history = manifest["preserved_history"][index]
    verify(history["before_supplement"])
    verify(history["current"])
    initial_path = ROOT / history["before_supplement"]["path"]
    initial = json.loads(initial_path.read_text())
    if initial["status"] != "blocked":
        raise RuntimeError("Initial blocked history must remain intact")
    final = json.loads(initial_path.read_text())
    if number == "33":
        verify(manifest["n33_report"])
        verify(manifest["n33_montage"])
        for entry in manifest["n33_option_pixels"]:
            verify(entry)
            notes = (
                N33_ENDS[(entry["question"], entry["option"])]
                + " No blank/black painting, missing right-end glyph or overlapping "
                  "superscript observed. Earlier left terms are intentionally "
                  "off-window in this right-scroll capture; this is not a claim "
                  "that the entire long expression fits simultaneously. Combined "
                  "with the initial observations, these pixels resolve the "
                  "mobile option-end display concern. No semantic correctness review."
            )
            final["observations"].append({
                "filename": entry["filename"],
                "sha256": entry["sha256"],
                "actually_opened": True,
                "evidence": {
                    "method": "Actually opened native pixels of all14 supplied strips in labeled montage; no resizing.",
                    "display_observation": notes,
                    "surface": "choices",
                    "viewport_width": 390,
                    "question": entry["question"],
                    "option": entry["option"],
                    "endpoint": "horizontal-end",
                    "image_size": entry["size"],
                    "reported_scroll_end": entry["reported_scroll_end"],
                    "report": manifest["n33_report"],
                    "montage": {
                        **manifest["n33_montage"],
                        "member_rect": entry["rect"],
                    },
                    "initial_blocked_history": history["before_supplement"],
                    "disposition": "Initial capture remains incomplete at its starting scroll position; new actually opened ending pixels establish reachability.",
                    "additional_unique_surface_viewport_combinations": 0,
                    "scope": "Actual-display pass only. Not semantic/choice authoring or source-figure approval. No browser or renderer run by this observer.",
                },
                "observer": OBSERVER,
            })
        final["status"] = "pass"
    else:
        verify(manifest["n42_report"])
        entry = manifest["n42_fresh_pixels"]
        verify(entry)
        final["observations"].append({
            "filename": entry["filename"],
            "sha256": entry["sha256"],
            "actually_opened": True,
            "evidence": {
                "method": "Directly opened actual fresh same-HTML mobile-last PNG at native resolution.",
                "display_observation": (
                    "The previously absent stacked lines 63,21,7,1 after126, "
                    "the long3600 factorization, its subsequent36/4/1 lines, "
                    "and left-hand fraction fragments are now painted. "
                    "Prose, fractions and exercise link remain legible and "
                    "nonoverlapping. The long factorization is horizontally "
                    "cropped at its start position; the separately opened "
                    "formula-end strip establishes its ending. This fresh "
                    "capture and the supplied unchanged-HTML report resolve "
                    "the prior partial blank painting as capture-state-related "
                    "rather than proving a missing-content defect. The initial "
                    "bad capture is retained and rejected, not retroactively "
                    "passed. Mobile choice endings1B,2A/2B/2C,21A/21B remain "
                    "unverified, so overall display status stays blocked. "
                    "The semantic rejection remains unchanged."
                ),
                "surface": "text",
                "viewport_width": 390,
                "endpoint": "fresh-last",
                "image_size": entry["size"],
                "report": manifest["n42_report"],
                "initial_blocked_history": history["before_supplement"],
                "additional_unique_surface_viewport_combinations": 0,
                "scope": "Actual display only; no semantic, source-figure, promotion or choice-authoring approval.",
            },
            "observer": OBSERVER,
        })
        final["status"] = "blocked"
        final["rejected_history_not_semantic_approval"] = True
    if final["observations"][:len(initial["observations"])] != initial["observations"]:
        raise RuntimeError("Original observations were changed")
    if final["unique_surface_viewport_combinations"] != 6:
        raise RuntimeError("Supplement must add no combinations")
    target = ROOT / history["current"]["path"]
    target.write_text(json.dumps(final, ensure_ascii=False, indent=2) + "\n")
    verify(history["before_supplement"])
    output_record = {
        "lesson": final["lesson"],
        "status": final["status"],
        "path": str(target.relative_to(ROOT)),
        "sha256": sha(target),
        "observations": len(final["observations"]),
        "initial_observations_unchanged": True,
        "initial_blocked_record": history["before_supplement"],
        "unique_surface_viewport_combinations": 6,
    }
    (OUT / f"n{number}-supplement-handoff.json").write_text(json.dumps(output_record, indent=2) + "\n")
    print(f"SAVED n{number}: {final['status']}; {len(final['observations'])} actual observations; 6 combinations.")
    print("Initial blocked record preserved byte-for-byte; only newly opened observations appended.")


if __name__ == "__main__":
    main()
