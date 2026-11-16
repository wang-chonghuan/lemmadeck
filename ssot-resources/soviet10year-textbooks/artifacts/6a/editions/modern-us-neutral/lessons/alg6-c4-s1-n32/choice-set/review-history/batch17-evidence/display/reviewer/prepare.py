"""Prepare only supplied n32 pixels and preserve prior blocked records."""

import hashlib
import json
import re
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path.cwd()
OUT = Path(__file__).resolve().parent
SOURCE = ROOT / ".intentfold/tickets/STEMROBIN-182/tmp/batch17-offline-evidence/6a"
LESSON = "alg6-c4-s1-n32"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def record(path):
    return {"path": str(path.relative_to(ROOT)), "sha256": sha(path)}


def screenshot(path, surface, width, kind):
    with Image.open(path) as image:
        image.load()
        size = list(image.size)
    return {
        **record(path),
        "filename": path.name,
        "surface": surface,
        "viewport_width": width,
        "kind": kind,
        "size": size,
    }


def montage(entries, name, columns):
    images = [Image.open(ROOT / entry["path"]).convert("RGB") for entry in entries]
    width = max(image.width for image in images)
    height = max(image.height for image in images)
    pad, caption = 8, 24
    rows = (len(entries) + columns - 1) // columns
    canvas = Image.new(
        "RGB", (columns * (width + pad) + pad,
                rows * (height + caption + pad) + pad), "white",
    )
    draw = ImageDraw.Draw(canvas)
    members = []
    for index, (entry, image) in enumerate(zip(entries, images)):
        x = pad + index % columns * (width + pad)
        y = pad + index // columns * (height + caption + pad)
        draw.text((x, y + 4), entry["filename"], fill="black")
        canvas.paste(image, (x, y + caption))
        members.append({
            **entry,
            "rect": [x, y + caption, image.width, image.height],
            "resized": False,
        })
    output = OUT / name
    canvas.save(output)
    return {**record(output), "size": list(canvas.size), "members": members}


def main():
    preserved = []
    for book, number in (("6a", "33"), ("5m", "42")):
        path = SOURCE.parent / book / f"n{number}-actual-display-observations.json"
        payload = json.loads(path.read_text())
        if payload["status"] != "blocked":
            raise RuntimeError(f"Expected initial blocked record: {path}")
        output = OUT / f"n{number}-initial-blocked-observations.json"
        if output.exists() and sha(output) != sha(path):
            raise RuntimeError(f"Existing preserved record differs: {output}")
        output.write_bytes(path.read_bytes())
        named_backup = path.with_name(
            f"n{number}-actual-display-observations-before-supplement.json"
        )
        if named_backup.exists() and sha(named_backup) != sha(path):
            raise RuntimeError(f"Existing named blocked record differs: {named_backup}")
        named_backup.write_bytes(path.read_bytes())
        preserved.append({
            "original": record(path),
            "preserved": record(output),
            "named_before_supplement": record(named_backup),
        })
    report_paths = [
        SOURCE / "n32-report.json",
        SOURCE / f"{LESSON}-formula-ends.json",
    ]
    endpoints, montages = [], []
    for surface in ("text", "exercises", "choices"):
        for width in (1440, 390):
            entries = [
                screenshot(SOURCE / f"{LESSON}-{surface}-{width}-{end}.png",
                           surface, width, end)
                for end in ("first", "last")
            ]
            endpoints.extend(entries)
            montages.append(montage(
                entries, f"{surface}-{width}-endpoints.png",
                1 if width == 1440 else 2,
            ))
    additional = []
    pattern = re.compile(
        rf"{LESSON}-(text|exercises|choices)-(1440|390)-((?:figure|table)-\d+(?:-end)?)\.png"
    )
    for path in sorted(SOURCE.glob(f"{LESSON}-*.png")):
        match = pattern.fullmatch(path.name)
        if match:
            additional.append(screenshot(
                path, match.group(1), int(match.group(2)), match.group(3),
            ))
    formula_report = json.loads(report_paths[1].read_text())
    if len(formula_report["observations"]) != 3:
        raise RuntimeError("Expected the three supplied formula endpoints")
    for observation in formula_report["observations"]:
        path = ROOT / observation["screenshot"]
        if path.parent != SOURCE:
            raise RuntimeError(f"Unexpected capture: {path}")
        entry = screenshot(path, observation["surface"],
                           observation["viewport"]["width"],
                           f"formula-{observation['region']['i']}-end")
        entry["reported_scroll_end"] = observation["end"]
        additional.append(entry)
    montages.append(montage(additional, "tables-media-and-formula-ends.png", 3))
    payload = {
        "lesson": LESSON,
        "status": "pending actual pixel observation",
        "reports": [record(path) for path in report_paths],
        "preserved_initial_blocked_records": preserved,
        "endpoints": endpoints,
        "additional": additional,
        "montages": montages,
        "unique_surface_viewport_combinations": 6,
        "method": "Supplied screenshot native pixels only. All supplemental captures remain within existing display combinations. No renderer, browser, canonical or semantic review.",
    }
    (OUT / "manifest.json").write_text(json.dumps(payload, indent=2) + "\n")
    print(f"Prepared 12 endpoints and {len(additional)} table/media/formula captures in {len(montages)} montages.")
    print("Preserved exact initial blocked n33/n42 JSONs in this review directory.")


if __name__ == "__main__":
    main()
