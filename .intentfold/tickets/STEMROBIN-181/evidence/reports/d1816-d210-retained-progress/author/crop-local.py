import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
AUTHOR = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d210-fig31-source-gap-author"
OUTPUT = ROOT / ".tmp/STEMROBIN-181/d1816-d210"
assert Path.cwd() == ROOT
original = OUTPUT / "physical57-embedded-original/physical57-000.png"
figure = ROOT / "ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-31.png"
prior_crop = ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d200-n20-figures30-31-review/fig-31-source-local-stroke.png"


def binding(path):
    data = path.read_bytes()
    return {
        "path": str(path),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


def metadata(path):
    with Image.open(path) as image:
        return {**binding(path), "width": image.width, "height": image.height, "mode": image.mode}


box = (906, 1049, 1092, 1176)
cropped = OUTPUT / "physical57-held-local-intrinsic.png"
assert not cropped.exists()
with Image.open(original) as image:
    result = image.crop(box)
    result.save(cropped)
    original_region = np.asarray(image)[box[1]:box[3], box[0]:box[2]]
with Image.open(cropped) as image:
    assert np.array_equal(np.asarray(image), original_region)
with Image.open(figure) as image, Image.open(prior_crop) as existing:
    expected = image.crop((650, 130, 840, 260))
    exact_prior_crop = np.array_equal(np.asarray(expected), np.asarray(existing))
    assert exact_prior_crop
receipt = {
    "cwd": str(ROOT),
    "source": metadata(original),
    "crop": metadata(cropped),
    "cropBoxXYXYHalfOpen": list(box),
    "coordinateConvention": "0-based pixel indices; origin at top left; bounds half open",
    "exactCropToIntrinsicMapping": {"x": "source_x = crop_x + 906", "y": "source_y = crop_y + 1049"},
    "operation": "PIL.Image.crop only; original mode retained",
    "resampling": False,
    "scaling": False,
    "polarityConversion": False,
    "thresholding": False,
    "masking": False,
    "cropDecodedPixelsExactlyEqualSourceSlice": True,
    "existingFigure": metadata(figure),
    "existingGapCrop": metadata(prior_crop),
    "existingGapCropDecodedPixelsEqualFigureSlice": exact_prior_crop,
    "existingGapCropToFigureMapping": {"x": "figure_x = crop_x + 650", "y": "figure_y = crop_y + 130"},
    "existingGapCropBoxInFigureXYXYHalfOpen": [650, 130, 840, 260],
    "existingFigureToRenderedPageMapping": {
        "x": "rendered_page_x = figure_x + 296",
        "y": "rendered_page_y = figure_y + 965",
        "basis": "Frozen page.json fig-31 box [308,977,909,279] and existing layout.crop default 12px padding; no crop override present.",
        "notIndependentlyPixelVerifiedAgainstUnavailablePreparedPage": True,
    },
    "existingGapCropBoxInRenderedPageXYXYHalfOpen": [946, 1095, 1136, 1225],
    "crossRepresentationMapping": {
        "nominalDpiRatioOnly": "intrinsic ~= rendered_page * 288/300",
        "notAnExactVerifiedAffineTransform": True,
        "note": "Integer ppi and page-render dimensions alone do not establish exact PDF image placement. Direct raw and existing-crop coordinates are exact; inter-representation localization is approximate and not used to assert conversion causality.",
    },
    "displayOpenCountBeforeCropDisplay": 1,
    "metadataAndPixelDecodeOperationsNotModelDisplays": True,
}
with (AUTHOR / "local-crop-receipt.json").open("x", encoding="ascii") as stream:
    json.dump(receipt, stream, indent=2)
    stream.write("\n")
print(json.dumps(receipt, indent=2))
