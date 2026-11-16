"""Record actual n42 pixel observations; never grant semantic approval."""

import hashlib
import json
from pathlib import Path


ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
TARGET = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/batch17-offline-evidence/5m/n42-actual-display-observations.json"
LESSON = "math5-c2-s1-n42"
OBSERVER = "Codex independent actual-display-only observer, current chat"
NOTES = {
    "text-1440-first": (
        "Painted title, prose and factorization expressions are readable. "
        "Prose wraps without overlap. The visible fig138 tree has intact "
        "boxes, arrows, number labels and caption; it is not a blank image. "
        "This is visibility only, not source fidelity or mathematical approval."
    ),
    "text-1440-last": (
        "Painted closing prose, stacked number lines below 504, the long "
        "3600 factorization, following number lines, reduction fractions "
        "and exercise link are visible. Fractions are small inline notation "
        "but distinguishable; no visible overlap. This establishes what "
        "the supplied desktop capture paints, not lesson semantic correctness."
    ),
    "text-390-first": (
        "Painted mobile heading and cleanly wrapped prose/formulas. Fig138 "
        "is partially visible in a horizontal media window at page bottom; "
        "the supplied desktop full-image and mobile right-end captures were "
        "also opened. Its off-window right branch is not claimed missing. "
        "No visible text/image overlap."
    ),
    "text-390-last": (
        "Partially painted, not a fully blank or corrupt PNG. The top shows "
        "126 followed by a large empty area where subsequent stacked number "
        "lines are painted in the desktop-last capture. Beneath the 3600 "
        "explanation another large blank area replaces the long factorization "
        "and following number lines visible on desktop. Closing fraction "
        "equations also omit some left-hand fragments while prose and the "
        "exercise link paint normally. The separate actual mobile factorization "
        "end strip is painted, so this may be capture/compositor behavior after "
        "horizontal media scrolling, but that cause is not proven. Do not pass "
        "this actual screenshot. Ask parent for a fresh same-HTML mobile-last "
        "capture without prior media scrolling; no recapture or repair here."
    ),
    "exercises-1440-first": (
        "Nonblank heading and visible stems 756-761 with separated number "
        "gutter and content. Number lists, algebraic terms and small fractions "
        "are painted with legible operators and denominators. No visible "
        "horizontal clipping or item overlap."
    ),
    "exercises-1440-last": (
        "Nonblank ending items 768-775 and return link. Long decimal formulas "
        "and brackets fit; fractions and unit-bearing stems are readable. "
        "No collision between headings, stems and mathematical lines."
    ),
    "exercises-390-first": (
        "Nonblank title and wrapped stems 756-760. Number lists and algebraic "
        "expressions are separated; visible 760 fractions retain their "
        "numerators and denominators. Lower subitems continue below the "
        "viewport, which is ordinary vertical cropping, not claimed absent."
    ),
    "exercises-390-last": (
        "Nonblank homework heading, visible 770-775 and return link. Long "
        "stems wrap without overlap, inline fractions remain distinguishable. "
        "The 775 formula reaches the right edge; its supplied formula-end "
        "strip shows the closing bracket. No approval of mathematical content."
    ),
    "choices-1440-first": (
        "Nonblank choices title, visible questions 1-3 with complete A/B/C "
        "rows and beginning of question 4. Exponents, separators and set "
        "braces are legible without overlap at desktop width. Intermediate "
        "unseen questions are not claimed inspected or approved."
    ),
    "choices-1440-last": (
        "Nonblank final questions 20-22. Unit-bearing options, multi-select "
        "A-D rows with primed symbols/vector expressions and final decimal "
        "options are painted and separated. No visible clipping or overlap "
        "in these desktop rows; correctness is not reviewed."
    ),
    "choices-390-first": (
        "Nonblank, normally painted mobile title and wrapped stems. Visible "
        "option 1B loses its right-hand list ending. Options 2A, 2B and 2C "
        "also lose their right-hand endings at the viewport edge. Question "
        "3 begins normally. This is visible option clipping, not blank "
        "painting. The supplied formula-end report has no choice-row endpoints, "
        "so intended per-row scroll reachability versus a real overflow defect "
        "is unresolved. Do not pass option completeness."
    ),
    "choices-390-last": (
        "Nonblank tail of question 21 and complete visible question 22 "
        "ending. Long equation lines in options 21A and 21B are right-clipped "
        "around the final primed-vertex expression; ordinary following prose "
        "and other rows wrap and paint. Option endings are not established "
        "without parent-supplied horizontal end captures. Final 22 A/B/C "
        "decimal rows are legible and nonoverlapping. No semantic approval."
    ),
    "text-390-formula-0-end": (
        "Actually viewed native pixels of this supplied cropped end strip "
        "in the formula montage. The factorization's right-hand repeated "
        "factors and ending are painted. Earlier left terms are intentionally "
        "off-window. This supports one formula's scroll endpoint, not the "
        "partially blank text-last viewport; adds zero unique combinations."
    ),
    "exercises-390-formula-0-end": (
        "Painted cropped coordinate-list end, including the last labeled "
        "coordinate pair and closing punctuation. Beginning is intentionally "
        "off-window. No overlapping glyphs; adds zero unique combinations."
    ),
    "exercises-390-formula-1-end": (
        "Painted long decimal-expression end with plus, colon/division and "
        "closing bracket clearly present. Left terms are outside this end "
        "crop by design; no visible blank formula painting."
    ),
    "exercises-390-formula-2-end": (
        "Painted second decimal-expression end with distinct decimal values, "
        "parentheses, colon/division and closing bracket/punctuation. No "
        "glyph overlap; adds zero unique combinations."
    ),
    "exercises-390-formula-3-end": (
        "Painted algebraic-expression end showing the bracketed terms and "
        "complete closing bracket. The leftmost beginning is cropped at the "
        "horizontal end position. This confirms visible ending only."
    ),
    "text-1440-figure-1": (
        "Actually opened the supplied complete fig138 display capture in "
        "its native-pixel montage. Whole tree and outer bounds are present; "
        "root, intermediate and leaf boxes, arrows and number glyphs are "
        "painted without overlap or intrinsic clipping. Display observation "
        "only, no source inventory, semantic or modern-figure approval."
    ),
    "text-390-figure-1": (
        "Actually opened supplied mobile prose-image starting capture in "
        "native pixels. The visible window shows the left branch and leaf "
        "boxes clearly; root/right side extend outside the horizontal window. "
        "Screenshot canvas also includes white space outside its visible "
        "window. Not a claim that the underlying full image is blank or "
        "incomplete. Paired actual right-end capture also opened."
    ),
    "text-390-figure-1-end": (
        "Actually opened supplied mobile prose-image right-end capture. "
        "The right branch, intermediate box and rightmost leaf boxes are "
        "painted and reachable. Left-side clipping is expected horizontal "
        "scroll. Desktop full capture supplies the complete view; no source "
        "fidelity or mathematical approval. Adds zero unique combinations."
    ),
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify(entry):
    path = ROOT / entry["path"]
    if sha(path) != entry["sha256"]:
        raise RuntimeError(f"Observed evidence changed: {path}")


def main():
    manifest_path = OUT / "manifest.json"
    manifest = json.loads(manifest_path.read_text())
    for report in manifest["reports"]:
        verify(report)
    montages = {}
    for montage in manifest["montages"]:
        verify(montage)
        montage["actually_opened"] = True
        for member in montage["members"]:
            verify(member)
            montages[member["filename"]] = (montage, member)
    entries = [
        *manifest["endpoints"],
        *manifest["formula_ends"],
        *manifest["prose_image_captures"],
    ]
    observations = []
    for entry in entries:
        verify(entry)
        key = entry["filename"].removeprefix(f"{LESSON}-").removesuffix(".png")
        montage, member = montages[entry["filename"]]
        evidence = {
            "method": "Actually viewed supplied native screenshot pixels in labeled montage; no resizing.",
            "display_observation": NOTES[key],
            "surface": entry["surface"],
            "viewport_width": entry["viewport_width"],
            "endpoint": entry["endpoint"],
            "image_size": entry["size"],
            "montage": {
                "path": montage["path"],
                "sha256": montage["sha256"],
                "member_rect": member["rect"],
            },
            "reports": manifest["reports"],
            "scope": "Rejected historical outputs: actual display only, not semantic/figure approval or choice-authoring input.",
        }
        if "reported_scroll_end" in entry:
            evidence["reported_scroll_end"] = entry["reported_scroll_end"]
        observations.append({
            "filename": entry["filename"],
            "sha256": entry["sha256"],
            "actually_opened": True,
            "evidence": evidence,
            "observer": OBSERVER,
        })
    combinations = {(entry["surface"], entry["viewport_width"]) for entry in entries}
    if len(combinations) != 6 or len(observations) != 20:
        raise RuntimeError("Unexpected bounded display scope")
    result = {
        "lesson": LESSON,
        "status": "blocked",
        "observations": observations,
        "unique_surface_viewport_combinations": 6,
        "rejected_history_not_semantic_approval": True,
    }
    TARGET.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
    manifest["status"] = "blocked: suspicious partial mobile text painting and unresolved clipped mobile choice endings"
    manifest["actually_opened_screenshots"] = 20
    manifest["emitted_images"] = 9
    manifest["input_hashes_unchanged_after_observation"] = True
    manifest["observation_output"] = {
        "path": str(TARGET.relative_to(ROOT)),
        "sha256": sha(TARGET),
    }
    manifest["parent_handoff"] = [
        "Request fresh same-HTML text-390-last capture without prior horizontal media scrolling; distinguish compositor/capture omission from a real missing-content defect.",
        "Request actual mobile right-scroll evidence for options 1B, 2A/2B/2C and 21A/21B; no choice formula ends were supplied.",
        "Preserve n42's semantic rejection regardless of any later display result. No edits, authoring, promotion or fresh browser/render performed here.",
    ]
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    print("BLOCKED: 20 supplied images actually inspected; 6 display combinations; semantic rejection preserved.")
    print("All observed input/report/montage hashes unchanged. No browser, render or durable writes.")


if __name__ == "__main__":
    main()
