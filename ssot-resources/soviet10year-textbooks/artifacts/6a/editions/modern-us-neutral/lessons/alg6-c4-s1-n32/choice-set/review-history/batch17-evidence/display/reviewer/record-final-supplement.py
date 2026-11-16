"""Append only actually opened final supplementary screenshots."""

import copy
import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
EVIDENCE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/batch17-offline-evidence"
OBSERVER = "Codex independent actual-display-only observer, current chat"
SCOPE = (
    "Actual display observation only. No semantic correctness, choice "
    "authoring, source-figure or publication approval. No browser, content "
    "change, canonical validation or renderer run by this observer."
)
N32_NOTES = {
    ("text", "fresh-first"): (
        "The title and chapter/page line are fully painted at the top. Prose "
        "and the power-of-a-power expressions paint, including nested "
        "superscripts, with no overlap. The two numerical examples at the "
        "bottom are painted. This resolves the initial first-capture title "
        "crop; it is not a claim that an entire page fits one viewport."
    ),
    ("text", "fresh-last"): (
        "The final prose and both numerical examples are painted, including "
        "nested powers, signs, equalities and terminal punctuation. The title "
        "is cropped at the top of this final-node scroll capture; the new "
        "fresh-first pixels establish the complete title. This file is "
        "byte-identical to the prior supplied mobile last capture, honestly "
        "retained as a distinct supplied filename, not new content. The "
        "desktop exercise link is not visible here; this observation covers "
        "the supplied text/formula endpoints and does not assert mobile "
        "navigation-link visibility."
    ),
    ("exercises", "fresh-last"): (
        "Bodies 589, 590 and 591, absent from the rejected old capture, now "
        "paint completely in the visible region. Comparison expressions, "
        "fractions, nested superscripts and interval notation are readable "
        "and nonoverlapping. Stem 592 and the return link paint. Ordinary "
        "preceding-item crop at the top is not blank painting. The supplied "
        "unchanged-HTML report supports capture-state-related omissions "
        "rather than proving missing-content defects."
    ),
    ("exercises", "fresh-first"): (
        "The title and chapter/page line paint completely. Bodies 578-580 "
        "now paint, including every visible subpart, nested superscripts "
        "and the membership notation. Body 581 and its four power options "
        "also paint. No partial blank painting, formula clipping or overlap "
        "observed. These fresh same-HTML pixels resolve the missing 578-580 "
        "body evidence without retroactively passing the old bad capture."
    ),
}
N42_ENDS = {
    (1, "B"): "The final 2^2 times 5 and ending punctuation are visible.",
    (2, "A"): "The final 2^6 5^3 and ending punctuation are visible.",
    (2, "B"): "The final 2^5 5^3 and ending punctuation are visible.",
    (2, "C"): "The final 2^3 5^6 and ending punctuation are visible.",
    (9, "B"): "The final (1,5005) pair, closing parenthesis and punctuation are visible.",
    (9, "C"): "The final (5,1001) pair, closing parenthesis and punctuation are visible.",
    (9, "D"): "The final (11,13) pair, closing parenthesis and punctuation are visible.",
    (13, "A"): "The final (2,1) pair and complete closing parenthesis are visible at the right end.",
    (15, "stem"): "The final division by 16.4, closing square bracket and punctuation are visible.",
    (16, "B"): "The final 2^3 3^2 times 113 and ending punctuation are visible.",
    (16, "C"): "The final 2^4 3^2 times 113 and ending punctuation are visible.",
    (17, "A"): "The final 3^5 5^4 and ending punctuation are visible.",
    (17, "C"): "The final 3^6 5^4 and ending punctuation are visible.",
    (21, "A"): "The final D'=D+v and ending punctuation are visible.",
    (21, "B"): "The final D'=D+v and ending punctuation are visible.",
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify(record):
    if sha(ROOT / record["path"]) != record["sha256"]:
        raise RuntimeError(f"Changed evidence: {record['path']}")


def verify_montage(entries, montage):
    verify(montage)
    with Image.open(ROOT / montage["path"]) as image:
        image = image.convert("RGB")
        for entry in entries:
            verify(entry)
            x, y, width, height = entry["member_rect"]
            with Image.open(ROOT / entry["path"]) as source:
                source = source.convert("RGB")
                crop = image.crop((x, y, x + width, y + height))
                if source.size != (width, height) or source.tobytes() != crop.tobytes():
                    raise RuntimeError(f"Montage pixels differ: {entry['filename']}")


def observation(entry, report, montage, notes, history):
    parent = entry["parent_observation"]
    evidence = {
        "method": (
            "Actually opened every labeled native-pixel montage member at "
            "original resolution in this chat; no resizing or recapture."
        ),
        "display_observation": notes,
        "surface": parent.get("surface", "choices"),
        "viewport_width": 390,
        "endpoint": parent.get("endpoint", "horizontal-math-end"),
        "image_size": entry["size"],
        "report": report,
        "montage": {
            **montage,
            "member_rect": entry["member_rect"],
            "label": entry["montage_label"],
            "resized": False,
        },
        "preserved_blocked_history": history,
        "additional_unique_surface_viewport_combinations": 0,
        "scope": SCOPE,
    }
    if "question" in parent:
        evidence["question"] = parent["question"]
        evidence["option"] = parent["option"]
        evidence["reported_scroll_end"] = {
            key: parent[key] for key in ("left", "max", "mathRight", "viewportRight")
        }
    return {
        "filename": entry["filename"],
        "sha256": entry["sha256"],
        "actually_opened": True,
        "evidence": evidence,
        "observer": OBSERVER,
    }


def main():
    manifest_path = OUT / "final-supplement-manifest.json"
    manifest = json.loads(manifest_path.read_text())
    for name in ("n32_report", "n42_report"):
        verify(manifest[name])
    for number in (32, 42):
        verify_montage(
            manifest[f"n{number}_pixels"], manifest[f"n{number}_montage"],
        )
    extra_path = EVIDENCE / "6a/alg6-c4-s1-n32-exercises-390-fresh-first.png"
    extra_sha = "00e89e2632161cb4aff4936571a946e5aa9493371637f76d2c1a4f4c91adfef1"
    if sha(extra_path) != extra_sha:
        raise RuntimeError("Directly opened fourth n32 fresh screenshot changed")
    with Image.open(extra_path) as image:
        image.load()
        extra_size = list(image.size)
    for history in manifest["preserved_blocked"]:
        number = history["number"]
        verify(history["current"])
        verify(history["backup"])
        current = ROOT / history["current"]["path"]
        initial_bytes = (ROOT / history["backup"]["path"]).read_bytes()
        if current.read_bytes() != initial_bytes:
            raise RuntimeError(f"Current record differs from blocked backup n{number}")
        initial = json.loads(initial_bytes)
        if initial["status"] != "blocked":
            raise RuntimeError("Must retain a genuinely blocked initial record")
        final = copy.deepcopy(initial)
        for entry in manifest[f"n{number}_pixels"]:
            parent = entry["parent_observation"]
            if number == 32:
                notes = N32_NOTES[(parent["surface"], parent["endpoint"])]
            else:
                notes = (
                    N42_ENDS[(parent["question"], parent["option"])]
                    + " No missing right-end glyph, blank/black painting or "
                      "overlapping superscript observed. Leading terms are "
                      "intentionally outside this right-scrolled window; "
                      "this does not claim that the entire expression fits "
                      "simultaneously. Combined with earlier opened pixels, "
                      "this resolves the mobile ending display concern. "
                      "No mathematical correctness judgment is made."
                )
            final["observations"].append(observation(
                entry, manifest[f"n{number}_report"],
                manifest[f"n{number}_montage"], notes, history["backup"],
            ))
        if number == 32:
            final["observations"].append({
                "filename": extra_path.name,
                "sha256": extra_sha,
                "actually_opened": True,
                "evidence": {
                    "method": "Directly opened fourth actual PNG at original resolution in this chat.",
                    "display_observation": N32_NOTES[("exercises", "fresh-first")],
                    "surface": "exercises",
                    "viewport_width": 390,
                    "endpoint": "fresh-first",
                    "image_size": extra_size,
                    "provenance": (
                        "Latest direct user handoff supplies this fourth "
                        "same-HTML screenshot and states source/draft/render "
                        "unchanged and browser closed. This fourth file is "
                        "not listed in the three-entry n32-fresh-captures.json; "
                        "its pixels and exact hash were independently opened "
                        "and recorded."
                    ),
                    "preserved_blocked_history": history["backup"],
                    "additional_unique_surface_viewport_combinations": 0,
                    "scope": SCOPE,
                },
                "observer": OBSERVER,
            })
            final["blocked_findings"] = []
            resolution = (
                "Fresh first/last exercise captures paint the previously "
                "absent 578-580 and 589-591 bodies. Fresh text-first paints "
                "the complete title; text-last paints the final formula "
                "and punctuation. All initial observations remain unchanged "
                "as history. No assertion of mobile text navigation-link "
                "visibility or unseen intermediate page pixels."
            )
            bad_filenames = [
                "alg6-c4-s1-n32-exercises-390-first.png",
                "alg6-c4-s1-n32-exercises-390-last.png",
            ]
            capture_limitations = [
                {
                    "filename": "alg6-c4-s1-n32-text-390-first.png",
                    "disposition": (
                        "Rejected as complete top-endpoint evidence because "
                        "the title is cut; fresh-first supplies the full title."
                    ),
                },
                {
                    "filename": "alg6-c4-s1-n32-text-390-fresh-last.png",
                    "disposition": (
                        "Final text/formula endpoint is painted. Desktop "
                        "exercise link is not visible; no mobile navigation "
                        "visibility claim is made."
                    ),
                },
            ]
        else:
            final["rejected_history_not_semantic_approval"] = True
            resolution = (
                "All fifteen newly opened mobile ending strips paint the "
                "complete rightmost terms, including 1B, 2A/2B/2C and "
                "21A/21B. Together with the previously opened fresh text "
                "capture, the display blockers are resolved. Semantic "
                "rejection is unchanged, not superseded by this display pass."
            )
            bad_filenames = ["math5-c2-s1-n42-text-390-last.png"]
            capture_limitations = []
        final["status"] = "pass"
        final["scope"] = SCOPE
        final["final_supplement"] = {
            "disposition": "pass within actual-display-only scope",
            "resolution": resolution,
            "blocked_history": history["backup"],
            "initial_observations_unchanged": True,
            "additional_unique_surface_viewport_combinations": 0,
            "historical_rejected_captures": [
                {
                    "filename": filename,
                    "sha256": next(
                        item["sha256"] for item in initial["observations"]
                        if item["filename"] == filename
                    ),
                    "status": "rejected",
                    "disposition": (
                        "Old partial blank painting remains rejected; "
                        "fresh complete pixels do not retroactively pass it."
                    ),
                }
                for filename in bad_filenames
            ],
            "capture_limitations": capture_limitations,
        }
        count = history["initial_count"]
        if final["observations"][:count] != initial["observations"]:
            raise RuntimeError("Original observations were modified")
        if len(final["observations"]) != (29 if number == 32 else 36):
            raise RuntimeError("Unexpected final actually opened PNG count")
        if final["unique_surface_viewport_combinations"] != 6:
            raise RuntimeError("Supplement must add no display combinations")
        if len({item["filename"] for item in final["observations"]}) != len(final["observations"]):
            raise RuntimeError("Duplicate screenshot filenames")
        for item in final["observations"]:
            if not item["actually_opened"]:
                raise RuntimeError("Unopened screenshot included")
            if sha(current.parent / item["filename"]) != item["sha256"]:
                raise RuntimeError(f"Observed screenshot changed: {item['filename']}")
        current.write_text(json.dumps(final, ensure_ascii=False, indent=2) + "\n")
        verify(history["backup"])
        if json.loads(current.read_text()) != final:
            raise RuntimeError("Final record did not round-trip")
        print(
            f"SAVED n{number}: actual-display-only pass; "
            f"{len(final['observations'])} opened files; 6 combinations; "
            f"sha256={sha(current)}"
        )
        handoff = {
            "lesson": final["lesson"],
            "status": "pass",
            "scope": SCOPE,
            "file": str(current.relative_to(ROOT)),
            "sha256": sha(current),
            "observations": len(final["observations"]),
            "unique_surface_viewport_combinations": 6,
            "blocked_history": history["backup"],
            "old_bad_captures_still_rejected": True,
            "initial_observations_unchanged": True,
        }
        (OUT / f"n{number}-final-supplement-handoff.json").write_text(
            json.dumps(handoff, indent=2) + "\n"
        )


if __name__ == "__main__":
    main()
