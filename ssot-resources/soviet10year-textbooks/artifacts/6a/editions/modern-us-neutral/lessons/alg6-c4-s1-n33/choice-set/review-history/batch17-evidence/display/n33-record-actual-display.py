"""Record this observer's completed supplied-image inspection."""

import hashlib
import json
from pathlib import Path


DIRECTORY = Path(__file__).resolve().parent
LESSON = "alg6-c4-s1-n33"
OBSERVER = "Codex independent bounded actual-display observer, current chat"
NOTES = {
    "text-1440-first": (
        "Nonblank, correctly painted title and Chinese prose. Product-power "
        "derivation, three underbraces/count labels and superscript 8s are "
        "readable and separated. General n-power formula and final paragraph "
        "fit the column; bottom exercise link is visible. No text/formula overlap."
    ),
    "text-1440-last": (
        "Nonblank full short lesson, visibly the same page extent as first. "
        "Final general formula, closing paragraph and exercise link are complete. "
        "Underbraces and superscripts remain painted without collisions."
    ),
    "text-390-first": (
        "Nonblank mobile title/prose with orderly wrapping and separate "
        "superscripts. The long underbrace derivation is right-clipped within "
        "its horizontal formula region at the starting position, not across "
        "the whole page. The general formula, closing paragraph and exercise "
        "link are visible. The supplied formula-end capture separately shows "
        "the derivation's right-hand result. No prose/formula overlap."
    ),
    "text-390-last": (
        "Nonblank mobile short lesson, same vertical extent as first. Closing "
        "text and exercise link are complete. Long derivation remains at its "
        "horizontal starting position; the additional actual formula-end "
        "capture, not this last-page capture, establishes its right endpoint."
    ),
    "exercises-1440-first": (
        "Nonblank title and numbered stems 593 through 596. Exercise 593's "
        "a-h expressions, 594's two expressions and 595's four expressions "
        "are legible with distinct inner/outer exponents. Visible 596 fractions "
        "and powers are painted. No horizontal clipping or item overlap."
    ),
    "exercises-1440-last": (
        "Nonblank tail of earlier subitems, complete visible exercise 598, "
        "review heading, stems 599/600 and return link. Fraction/exponent "
        "notation and the graph-expression stem are legible. Final 600 stem "
        "wraps cleanly; no overlap or missing bottom content."
    ),
    "exercises-390-first": (
        "Nonblank title, complete visible 593 a-h and 594 a-b, and wrapped "
        "595 stem with four expressions. Superscripts, decimal points and "
        "parentheses are distinguishable. Stem 596 begins at the bottom; "
        "its continuation is below this viewport, an expected vertical endpoint "
        "crop rather than evidence that its subitems are absent."
    ),
    "exercises-390-last": (
        "Nonblank earlier subitem tail, complete visible 598 a-f, review "
        "heading, wrapped stems 599/600 and return link. Graph superscripts "
        "and scientific-notation exponents are legible. No horizontal loss or "
        "overlap in these visible ending items."
    ),
    "choices-1440-first": (
        "Nonblank choices title. Visible stems 1-3 and their A/B/C rows are "
        "legible with separated option labels, nested powers and superscripts. "
        "Stem 4 begins at the bottom and its options are below the viewport; "
        "no claim to have inspected those intermediate options. No visible "
        "horizontal clipping or overlap in the first three questions."
    ),
    "choices-1440-last": (
        "Nonblank tail of prior option rows and visible final questions 8-10. "
        "Question 8's long A/B/C rows fit at desktop width; fractions and "
        "superscripts are readable. Questions 9/10 have complete wrapped stems "
        "and all three option rows, with no overlap or missing final row."
    ),
    "choices-390-first": (
        "Nonblank, coherently painted mobile title, wrapped stems and options. "
        "Question 1's A/B/C rows fit. Question 2 option A is visibly clipped "
        "at the right edge around the last factor's exponent; its complete "
        "ending is not visible in this screenshot. Option B/C are legible. "
        "Question 3 option C is vertically cropped at the viewport bottom, "
        "which is expected page scrolling, not the blocking concern. This is "
        "not a blank/black/corrupt capture. Blocked on parent-supplied same-option "
        "horizontal end evidence or clarification of a real overflow defect; "
        "no semantic option correctness judgment."
    ),
    "choices-390-last": (
        "Nonblank and coherently painted final viewport. Question 8 option "
        "A and option B lose their right-hand endings at the screenshot's "
        "right edge; option C fits. Questions 9/10 have readable wrapped "
        "stems and complete A/B/C rows. No overlap or blank painting observed. "
        "Cannot approve completeness of clipped 8A/8B from this endpoint. "
        "Parent must supply actual right-scroll captures for those rows or "
        "identify a layout defect; no browser or rerender attempted here."
    ),
    "text-390-formula-0-end": (
        "Actually opened the supplied formula-end PNG directly, not via "
        "report text. It is a tightly cropped painted formula strip, not a "
        "blank viewport. Underbraces/count labels, multiplication and the "
        "final a^8 b^8 are visible. Its leftmost earlier terms are intentionally "
        "outside this right-end crop. The report gives left=max=94 and "
        "mathRight inside the 390 viewport. This supports the mobile text "
        "derivation endpoint only, not the clipped mobile choice rows. KaTeX "
        "brace/media rendering is not source-figure approval."
    ),
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify(record):
    path = DIRECTORY / record["filename"]
    if sha(path) != record["sha256"]:
        raise RuntimeError(f"Supplied evidence changed since opening: {path}")


def main():
    manifest_path = DIRECTORY / "n33-actual-display-montage-manifest.json"
    manifest = json.loads(manifest_path.read_text())
    for report in manifest["reports"]:
        verify(report)
    montage_by_member = {}
    for montage in manifest["montages"]:
        verify(montage)
        montage["actually_opened"] = True
        for member in montage["members"]:
            verify(member)
            montage_by_member[member["filename"]] = montage
    observations = []
    for item in [*manifest["screenshots"], *manifest["formula_screenshots"]]:
        verify(item)
        key = item["filename"].removeprefix(f"{LESSON}-").removesuffix(".png")
        montage = montage_by_member.get(item["filename"])
        evidence = {
            "method": "Viewed native pixels in labeled montage" if montage else "Directly opened actual supplied formula-end PNG",
            "display_observation": NOTES[key],
            "image_size": item["size"],
            "surface": item["surface"],
            "viewport_width": item["viewport_width"],
            "endpoint": item["endpoint"],
            "reports": manifest["reports"],
            "scope": "Actual supplied screenshot display only; no semantic review, choice authoring input, source-figure approval, fresh capture, browser or rerender.",
        }
        if montage:
            evidence["montage"] = {
                "filename": montage["filename"],
                "sha256": montage["sha256"],
                "member_rect": item["montage_rect"],
                "resized": False,
            }
        observations.append({
            "filename": item["filename"],
            "sha256": item["sha256"],
            "actually_opened": True,
            "evidence": evidence,
            "observer": OBSERVER,
        })
    combinations = {
        (item["surface"], item["viewport_width"])
        for item in [*manifest["screenshots"], *manifest["formula_screenshots"]]
    }
    if len(combinations) != 6 or len(manifest["screenshots"]) != 12:
        raise RuntimeError("Unexpected endpoint scope")
    output = {
        "lesson": LESSON,
        "status": "blocked",
        "observations": observations,
        "unique_surface_viewport_combinations": 6,
    }
    (DIRECTORY / "n33-actual-display-observations.json").write_text(
        json.dumps(output, ensure_ascii=False, indent=2) + "\n"
    )
    manifest["status"] = "blocked: mobile choice option endings not established"
    manifest["actually_opened_screenshot_count"] = len(observations)
    manifest["emitted_image_count"] = len(manifest["montages"]) + len(manifest["formula_screenshots"])
    manifest["input_hashes_unchanged_after_inspection"] = True
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"BLOCKED: {len(observations)} actual PNG observations; 6 surface/viewport combinations.")
    print("All observed screenshot/report/montage hashes verified unchanged.")
    print("Parent evidence needed: mobile choice 2A, 8A and 8B right-scroll endpoints.")


if __name__ == "__main__":
    main()
