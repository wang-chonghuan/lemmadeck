import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")
import layout


root = Path(".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p63-selection-diagnostic")
assert not root.exists(), "Preserve first diagnostic"
source = Path("ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0063")
image = Path(".tmp/ld-s10y-lesson/9-10g/pages/0063/page.png")
review = Path(".intentfold/tickets/STEMROBIN-184/tmp/source-9g-p63-independent-review.md")
digest = lambda file: hashlib.sha256(file.read_bytes()).hexdigest()
assert digest(review) == "08106168dc44a191a7f691739e757e8e6c528704f28221e35ad7c77a43c17afa"
assert digest(image) == "f83211d4d4952b88719cf5fb93f348ac2bfdbb9c53bf32080e2fb05c5b68d795"
before = {str(file): digest(file) for file in [image, review, *source.iterdir()]}
audit = json.loads((source / "audit.json").read_text())
first, second = audit["figures"]
ink = layout.ink_mask(Image.open(image))
labels, ids66, bounds = layout._figure_components(ink, first["from"])
_, ids67, _ = layout._figure_components(ink, second["from"])
shared = sorted(set(ids66) & set(ids67))
assert len(shared) == 1, "Only independently identified figure66 B may be reassigned"
rows, columns = bounds[shared[0] - 1]
assert 680 <= columns.start <= columns.stop <= 735
assert 640 <= rows.start <= rows.stop <= 695
left, top, width, height = second["from"]
candidate = [columns.stop, top, left + width - columns.stop, height]
_, candidate_ids, _ = layout._figure_components(ink, candidate)
expected = set(ids67) - set(shared)
exact_selection = set(candidate_ids) == expected
box, info = layout.snap(ink, candidate)
old_owned = np.isin(labels, ids67)
desired_owned = np.isin(labels, sorted(expected))
candidate_owned = layout.figure_ink(ink, candidate)
columns_with_ink = np.flatnonzero(ink.any(axis=0))
content_width = int(columns_with_ink[-1] - columns_with_ink[0] + 1)


def bands(boxes):
    masked = ink.copy()
    for x, y, w, h in boxes:
        masked[max(0, y):y + h, max(0, x):x + w] = False
    return layout.line_bands(masked, content_width)


old_bands = bands([first["box"], second["box"]])
candidate_bands = bands([first["box"], box]) if exact_selection else None
result = {
    "status": "READ_ONLY_COMPONENT_SELECTION_DIAGNOSTIC",
    "authority": "Sole independent63 StageB identifies the shared component semantically as figure66 B only.",
    "sourceHash": digest(image),
    "sharedComponent": {
        "id": shared[0], "box": [columns.start, rows.start, columns.stop - columns.start, rows.stop - rows.start],
        "pixels": int(np.count_nonzero(labels == shared[0])),
    },
    "originalRough67": second["from"],
    "proposedRough67": candidate,
    "proposedSnapped67": box,
    "original67ComponentIds": ids67,
    "proposed67ComponentIds": candidate_ids,
    "expected67ComponentIds": sorted(expected),
    "onlySharedBRemoved": exact_selection and bool(np.array_equal(candidate_owned, desired_owned)),
    "everyOtherOriginal67PixelPreserved": bool(np.array_equal(candidate_owned, old_owned & ~(labels == shared[0]))),
    "snapping": info,
    "baselineBands": old_bands,
    "baselinePrintedCount": len(old_bands),
    "candidateBands": candidate_bands,
    "candidatePrintedCount": len(candidate_bands) if candidate_bands is not None else None,
    "transcribedRowsUnchanged": audit["lines_md"],
    "limits": "No source, crop, audit, tool, expected-count override or exclusion edit. This is not optical approval of a future crop.",
}
for file, sha in before.items():
    assert digest(Path(file)) == sha
root.mkdir()
(root / "diagnostic.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result, indent=2))
