import importlib.util
import json
from pathlib import Path

import numpy as np
from scipy import ndimage

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("fixture_baseline", HERE / "baseline/layout.py")
baseline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(baseline)


def glyph(mask, x, y, width=24, height=38, walls=6, H=False):
    mask[y:y + height, x:x + walls] = True
    mask[y:y + height, x + width - walls:x + width] = True
    if H:
        mask[y + height // 2 - 3:y + height // 2 + 3, x:x + width] = True
    else:
        mask[y:y + walls, x:x + width] = True
        mask[y + height - walls:y + height, x:x + width] = True


equality = np.zeros((110, 250), dtype=bool)
equality[48:51, 50:120] = True
equality[62:65, 50:120] = True
radical = np.zeros((110, 250), dtype=bool)
radical[48:51, 50:120] = True
glyph(radical, 70, 62, 22, 30, 4)
radical[30:51, 48:51] = True
for y in range(40, 51):
    radical[y, 38 + (y - 40)] = True
arrow = np.zeros((110, 250), dtype=bool)
glyph(arrow, 70, 4, 22, 30, 4)
glyph(arrow, 70, 62, 22, 30, 4)
arrow[48:51, 50:120] = True
for x in range(107, 120):
    reach = 119 - x
    for dy in (-reach, reach):
        arrow[49 + dy - 1:49 + dy + 2, x] = True
components, _ = ndimage.label(arrow)
component_id = components[49, 51]
bounds = ndimage.find_objects(components)[component_id - 1]
H_body = np.zeros((110, 250), dtype=bool)
H_body[48:51, 50:120] = True
glyph(H_body, 114, 32, H=True)
opened = ndimage.binary_opening(H_body, structure=np.ones((1, 26), dtype=bool))
out = {
    "v1_equality_baseline_fraction": bool(baseline._single_fraction_row(equality, 0, 109, 38)),
    "v1_radical_baseline_fraction": bool(baseline._single_fraction_row(radical, 0, 109, 38)),
    "v1_arrow_arbitrary_crop_predicate": bool(baseline._arrow_headed_rule(arrow[35:64, 50:120], 38)),
    "v1_arrow_original_component_predicate": bool(baseline._arrow_headed_rule(
        components[bounds] == component_id, 38
    )),
    "v1_H_merged_rule_x": np.flatnonzero(opened[49]).tolist(),
    "unchanged_expected_assertions": True,
    "disposition": [
        "Equality/radical alone already compact in baseline; preserve no-local-support assertion.",
        "Add genuine independent full-glyph rows beside those strokes for tall-band negative classification.",
        "Check actual arrow component, not a crop that contains detached lower-glyph pixels.",
        "Move connected H body vertically so its middle crossbar is not merged into the intended short bar.",
    ],
}
with (HERE / "v1-fixture-disposition.json").open("x") as stream:
    json.dump(out, stream, indent=2)
    stream.write("\n")
print(json.dumps(out, indent=2))
