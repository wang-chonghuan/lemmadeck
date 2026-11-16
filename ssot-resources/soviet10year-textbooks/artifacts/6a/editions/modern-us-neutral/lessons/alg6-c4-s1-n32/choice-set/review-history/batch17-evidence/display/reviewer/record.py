"""Record previously opened n32 pixels without recapture or semantic review."""

import hashlib
import json
from pathlib import Path


ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
LESSON = "alg6-c4-s1-n32"
OBSERVER = "Codex independent actual-display-only observer, current chat"
SCOPE = (
    "Supplied actual screenshot pixels only. Not semantic correctness, choice "
    "authoring, source-figure approval or publication approval. No browser, "
    "canonical validation or renderer run by this observer."
)
ENDPOINT_NOTES = {
    ("text", 1440, "first"): (
        "The short lesson is fully painted, with readable prose, expressions "
        "and nested superscripts. No overlap observed. The exercise link is "
        "visible. The first and last files have identical hashes."
    ),
    ("text", 1440, "last"): (
        "The same complete short desktop lesson and exercise link are painted. "
        "Prose, expressions and superscripts are readable and nonoverlapping. "
        "This is a separately supplied filename with pixels identical to first."
    ),
    ("text", 390, "first"): (
        "Prose and expressions paint, including readable nested superscripts, "
        "without observed overlap. The title is partially cut by the top "
        "screenshot edge; the bottom exercise link seen on desktop is absent. "
        "The supplied first and last files have identical hashes. Genuine "
        "top/bottom endpoint completeness is not established by these captures."
    ),
    ("text", 390, "last"): (
        "Prose and formulas are painted and legible, but the title is partially "
        "cut at the top and the desktop exercise link is absent. Pixels are "
        "identical to the supplied first capture. This leaves capture-position "
        "coverage unresolved, not a proven application defect."
    ),
    ("exercises", 1440, "first"): (
        "Stems beginning at 578 are painted; nested powers and fractions are "
        "readable with organized spacing and no observed overlap. Continuation "
        "at the bottom viewport edge is an ordinary endpoint crop."
    ),
    ("exercises", 1440, "last"): (
        "The visible 588-592 stems and formulas paint, including powers and "
        "fractions; the return link is visible. No overlap or partial blank "
        "painting observed in these visible items."
    ),
    ("exercises", 390, "first"): (
        "Partially blank painting: item numbers and separators are visible, "
        "but bodies of 578, 579 and 580 are absent. Body 581 paints normally. "
        "This actual screenshot is rejected as incomplete display evidence; "
        "it must not pass from the parent report alone. A fresh same-HTML "
        "capture is needed to distinguish capture-state failure from a real "
        "display defect."
    ),
    ("exercises", 390, "last"): (
        "Partially blank painting: numbers and separators for 589, 590 and 591 "
        "paint while their bodies are absent. Stem 592 and the return link "
        "paint normally. This screenshot is rejected as incomplete evidence. "
        "The cause is unresolved without fresh same-HTML pixels."
    ),
    ("choices", 1440, "first"): (
        "Visible stems and options for 1-3 and the beginning of 4 paint. "
        "Superscripts and notation are readable, with no observed overlap or "
        "right-edge option loss. The next-item continuation is an ordinary "
        "viewport crop; unseen intermediate rows were not inspected."
    ),
    ("choices", 1440, "last"): (
        "Visible items 14-16 have painted stems and options, readable powers "
        "and set notation, and no observed overlap or right-edge option loss. "
        "No claim is made about unseen intermediate rows."
    ),
    ("choices", 390, "first"): (
        "Visible items 1-3 have painted stems/options and legible superscripts "
        "and notation, with no observed overlap or missing rightmost glyph "
        "in these rows. No claim is made about unseen intermediate rows."
    ),
    ("choices", 390, "last"): (
        "The visible tail of 14 and items 15-16 paint, with legible stems, "
        "options, superscripts and set notation. No overlap or right-edge "
        "option loss observed in these rows. The top-edge continuation is "
        "an ordinary viewport crop."
    ),
}
MEDIA_NOTES = {
    ("choices", 1440, "figure-1"): (
        "The table's label column and headers 1-10 are painted and complete. "
        "Borders are visible; the lower answer cells are intentionally empty, "
        "not a partially blank screenshot."
    ),
    ("choices", 390, "figure-1"): (
        "The initial mobile table view exposes a painted left portion. "
        "The separate right-end capture, not the nominal raster width, "
        "establishes rightmost column coverage. Empty answer cells are "
        "intentional; no black raster or unexpected blank painting observed."
    ),
    ("choices", 390, "figure-1-end"): (
        "The right-scrolled table exposes headers through 10 and the final "
        "border. Empty answer cells remain intentionally blank; no unexpected "
        "blank painting or occlusion observed."
    ),
    ("exercises", 1440, "figure-1"): (
        "The initial desktop table is painted, but its capture does not fully "
        "expose the final right column. Right-end completeness is established "
        "only by the separately opened end capture."
    ),
    ("exercises", 1440, "figure-1-end"): (
        "The desktop right-end table capture paints the final header 10 "
        "and ending border; the empty answer cells are intentional."
    ),
    ("exercises", 390, "figure-1"): (
        "The initial mobile table exposes painted left headers 1-4. "
        "Its rightmost columns require the separate right-end capture. "
        "No unexpected blank painting in the visible table region."
    ),
    ("exercises", 390, "figure-1-end"): (
        "The mobile right-end table exposes painted headers 5-10 and the "
        "final border. Empty answer cells are intentional, not a painting "
        "failure. No label/border overlap observed."
    ),
}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify(entry):
    if sha(ROOT / entry["path"]) != entry["sha256"]:
        raise RuntimeError(f"Observed evidence changed: {entry['path']}")


def notes(entry):
    key = (entry["surface"], entry["viewport_width"], entry["kind"])
    if key in ENDPOINT_NOTES:
        return ENDPOINT_NOTES[key]
    if key in MEDIA_NOTES:
        return MEDIA_NOTES[key]
    if entry["surface"] == "choices" and entry["viewport_width"] == 390:
        if entry["kind"].startswith(("table-", "formula-")):
            return (
                "This supplied option-table right-end strip is painted; "
                "headers through 10, ending value cells and the final border "
                "are visible without overlap. No black or partially blank "
                "painting observed. The table-end and formula-end files can "
                "have identical pixels; they are distinct supplied filenames, "
                "not additional surface/viewport combinations. No judgment "
                "of the option's mathematical correctness is made."
            )
    raise RuntimeError(f"Missing actual pixel notes: {entry['filename']}")


def main():
    manifest_path = OUT / "manifest.json"
    manifest = json.loads(manifest_path.read_text())
    if manifest["lesson"] != LESSON:
        raise RuntimeError("Unexpected lesson manifest")
    entries = manifest["endpoints"] + manifest["additional"]
    if len(entries) != 25 or len({entry["filename"] for entry in entries}) != 25:
        raise RuntimeError("Expected exactly 25 observed PNG filenames")
    members = {}
    for montage in manifest["montages"]:
        verify(montage)
        for member in montage["members"]:
            verify(member)
            members[member["filename"]] = {
                "path": montage["path"],
                "sha256": montage["sha256"],
                "member_rect": member["rect"],
                "resized": member["resized"],
            }
    for report in manifest["reports"]:
        verify(report)
    for history in manifest["preserved_initial_blocked_records"]:
        verify(history["preserved"])
        verify(history["named_before_supplement"])
    combinations = {
        (entry["surface"], entry["viewport_width"]) for entry in entries
    }
    if len(combinations) != 6:
        raise RuntimeError("Expected exactly six observed display combinations")
    observations = []
    for entry in entries:
        verify(entry)
        evidence = {
            "method": (
                "Actually opened native pixels in the labeled montage in this "
                "same chat before context compaction; no resizing or recapture."
            ),
            "display_observation": notes(entry),
            "surface": entry["surface"],
            "viewport_width": entry["viewport_width"],
            "endpoint": entry["kind"],
            "image_size": entry["size"],
            "montage": members[entry["filename"]],
            "reports": manifest["reports"],
            "scope": SCOPE,
        }
        if "reported_scroll_end" in entry:
            evidence["reported_scroll_end"] = entry["reported_scroll_end"]
        if entry["kind"] not in ("first", "last"):
            evidence["additional_unique_surface_viewport_combinations"] = 0
        observations.append({
            "filename": entry["filename"],
            "sha256": entry["sha256"],
            "actually_opened": True,
            "evidence": evidence,
            "observer": OBSERVER,
        })
    payload = {
        "lesson": LESSON,
        "status": "blocked",
        "observations": observations,
        "unique_surface_viewport_combinations": 6,
        "scope": SCOPE,
        "manifest": {
            "path": str(manifest_path.relative_to(ROOT)),
            "sha256": sha(manifest_path),
        },
        "blocked_findings": [
            {
                "filenames": [
                    f"{LESSON}-exercises-390-first.png",
                    f"{LESSON}-exercises-390-last.png",
                ],
                "finding": (
                    "Partial blank painting: bodies 578-580 and 589-591 "
                    "are absent while numbers/separators paint."
                ),
                "disposition": (
                    "Reject these captures; cause remains unresolved. Ask "
                    "parent for bounded fresh same-HTML mobile exercise "
                    "first/last captures without prior media scrolling."
                ),
            },
            {
                "filenames": [
                    f"{LESSON}-text-390-first.png",
                    f"{LESSON}-text-390-last.png",
                ],
                "finding": (
                    "Identical captures partially crop the title and omit "
                    "the desktop exercise link; endpoint coverage uncertain."
                ),
                "disposition": (
                    "Request genuine mobile text top/bottom endpoint pixels; "
                    "do not classify as a proven content defect."
                ),
            },
        ],
    }
    target = ROOT / (
        ".intentfold/tickets/STEMROBIN-182/tmp/batch17-offline-evidence/"
        "6a/n32-actual-display-observations.json"
    )
    if target.exists():
        raise RuntimeError(f"Preserve existing observation record: {target}")
    target.write_text(json.dumps(payload, indent=2) + "\n")
    saved = json.loads(target.read_text())
    if saved != payload:
        raise RuntimeError("Saved record did not round-trip")
    print(f"SAVED {target.relative_to(ROOT)}")
    print(f"status=blocked observations=25 combinations=6 sha256={sha(target)}")


if __name__ == "__main__":
    main()
