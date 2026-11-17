"""Trace only the failed NEW disconnected-arrow-head case."""
import sys

import numpy as np
from scipy import ndimage

import evidence

sys.path.insert(0, str(evidence.TOOLS))
import layout

ink = np.zeros((160, 260), dtype=bool)
ink[78:80, 96:119] = True
for offset in range(8):
    ink[79 - offset, 118 - offset] = True
    ink[79 + offset, 118 - offset] = True
ink[45:69, 104:114] = True
ink[90:109, 102:115] = True
components = ndimage.label(ink)[0]
facts = []
events = []
def trace(frame, event, arg):
    if event == "return" and frame.f_code.co_name == "_arrow_headed_rule":
        events.append(evidence.plain({
            "result": bool(arg), "line": frame.f_lineno,
            "locals": {key: frame.f_locals.get(key) for key in (
                "line_h", "trim", "spans", "above", "below", "middle", "head_min", "extension"
            )},
        }))
    return trace
sys.settrace(trace)
for margin in (6, 7, 8, 9):
    local = ink[78 - margin:80 + margin, 96:119]
    item = {
        "vertical_margin": margin, "complete_context_shape": list(local.shape),
        "original_head_test": layout._arrow_headed_rule(local, 37),
        "rule_width_scale_head_test": layout._arrow_headed_rule(local, min(37, 23)),
        "context_sha256": __import__("hashlib").sha256(local.tobytes()).hexdigest(),
        "taper_prefix_head_test": any(
            layout._arrow_headed_rule(direction[:, :tip + 1], 37)
            for direction in (local, local[:, ::-1])
            for spans in [np.array([
                np.ptp(ys) + 1 if ys.size else 0
                for x in range(direction.shape[1])
                for ys in [np.flatnonzero(direction[:, x])]
            ])]
            for tip in np.flatnonzero(np.diff(spans) < 0) + 1
        ),
    }
    facts.append(item)
    print(item)
sys.settrace(None)
full_bounds = ndimage.find_objects(components)
body_ids = [
    ident for ident, box in enumerate(full_bounds, 1)
    if box is not None and box[0].stop - box[0].start >= 0.35 * 37
]
role_context = (components[68:90, 96:119] > 0) & ~np.isin(
    components[68:90, 96:119], body_ids
)
spans = np.array([
    np.ptp(ys) + 1 if ys.size else 0
    for x in range(role_context.shape[1])
    for ys in [np.flatnonzero(role_context[:, x])]
])
role_head = any(
    layout._arrow_headed_rule(role_context[:, :tip + 1], 37)
    for tip in np.flatnonzero(np.diff(spans) < 0) + 1
)
print({"original_full_glyph_ids": body_ids, "complete_small_component_context_head": role_head})
evidence.dump(evidence.OUT / "failed-arrow-complete-component-role-trace.json", {
    "case": "test_arrow_head_is_not_short_fraction_rule",
    "frozen_test_sha256": evidence.sha(evidence.TEST),
    "component_geometry": [
        [c.start, r.start, c.stop - c.start, r.stop - r.start]
        for box in ndimage.find_objects(components) if box is not None for r, c in [box]
    ],
    "complete_context_probes": facts,
    "guard_events": events,
    "original_full_glyph_ids": body_ids,
    "complete_small_component_context_head": role_head,
    "original_component_sha256": __import__("hashlib").sha256(components.tobytes()).hexdigest(),
    "role_context_sha256": __import__("hashlib").sha256(role_context.tobytes()).hexdigest(),
})
