"""The sole ready native134 count, unmasked and computational only."""
import hashlib
import json
import sys
import time

import numpy as np
from PIL import Image

import evidence

sys.path.insert(0, str(evidence.TOOLS))
import layout


assert not (evidence.OUT / "native-count-attempt.json").exists()
tests = json.loads((evidence.OUT / "test-evidence.json").read_text())
assert len(tests["latest_case_results"]) == 20
assert all(value == "pass" for value in tests["latest_case_results"].values())
assert evidence.sha(evidence.TEST) == tests["frozen_test_sha256"]
assert evidence.sha(evidence.SOURCE) == evidence.SOURCE_SHA
evidence.dump(evidence.OUT / "native-count-attempt.json", {
    "timestamp": evidence.stamp(), "source_sha256": evidence.sha(evidence.SOURCE),
    "layout_sha256": evidence.sha(evidence.LAYOUT), "test_sha256": evidence.sha(evidence.TEST),
    "ready_new_cases": 20, "test_attempts": 22, "native_fullpage_count_calls_authorized": 1,
    "count_exclusions": [], "new_model_images": 0,
})
with Image.open(evidence.SOURCE) as image:
    dimensions, mode = list(image.size), image.mode
    assert dimensions == [1695, 2580] and mode == "RGB"
    ink = layout.ink_mask(image)
original = ink.copy()
counting = layout.counting_ink(ink, [])
width = int(np.ptp(np.flatnonzero(ink.any(axis=0))) + 1)
events = []


def region(frame):
    while frame is not None:
        if frame.f_code.co_name in ("_single_fraction_row", "_single_carrier_row"):
            value = (frame.f_locals.get("a"), frame.f_locals.get("b"))
            return value if value in evidence.REGIONS else None
        frame = frame.f_back
    return None


def trace(frame, event, arg):
    names = (
        "_single_fraction_row", "_single_carrier_row",
        "_bounded_carrier_limit_ownership", "_bounded_fraction_rules",
    )
    if frame.f_code.co_name not in names:
        return None
    target = region(frame)
    if target is None:
        return None
    if event == "return":
        item = {
            "region": list(target), "function": frame.f_code.co_name,
            "source_line": frame.f_lineno,
        }
        if frame.f_code.co_name == "_bounded_carrier_limit_ownership":
            item["owned_ids"] = sorted(frame.f_locals["owned"])
            item["ownership_array"] = evidence.plain(arg)
        elif frame.f_code.co_name == "_bounded_fraction_rules":
            item["input_rules"] = evidence.plain(frame.f_locals["rules"])
            item["completed_rules"] = evidence.plain(arg)
        else:
            item["result"] = bool(arg)
            item["locals"] = evidence.plain({
                key: frame.f_locals.get(key) for key in (
                    "line_h", "glyph_h", "cores", "overlapping", "remaining", "glyph_bounds",
                )
            })
        events.append(item)
    return trace


started = time.monotonic()
sys.settrace(trace)
try:
    bands = layout.line_bands(counting, width)
finally:
    sys.settrace(None)
elapsed = time.monotonic() - started
assert np.array_equal(original, ink) and np.array_equal(original, counting)
assert evidence.sha(evidence.SOURCE) == evidence.SOURCE_SHA
count = len(bands)
facts = {
    "timestamp": evidence.stamp(), "source": str(evidence.SOURCE),
    "source_sha256_before": evidence.SOURCE_SHA, "source_sha256_after": evidence.sha(evidence.SOURCE),
    "dimensions": dimensions, "mode": mode, "content_width": width,
    "layout_sha256": evidence.sha(evidence.LAYOUT), "test_sha256": evidence.sha(evidence.TEST),
    "count": count, "independent_witness_unchanged": 13,
    "matches_independent_witness": count == 13, "status": "PASS" if count == 13 else "FAIL",
    "bands": bands, "authorized_region_bands": [
        {"region": [a, b], "intersecting_bands": [
            [x, y] for x, y in bands if max(a, x) <= min(b, y)
        ]} for a, b in evidence.REGIONS
    ],
    "unanchored_band": {"y": [1060, 1101], "semantic_identity": "UNKNOWN",
                        "exclusion_approval": False, "masked": False},
    "native_fullpage_count_calls": 1, "diagnostic_fullpage_count_calls": 0,
    "new_model_images": 0, "permanent_model_images": 6,
    "count_exclusions": [], "figure_masks": [],
    "original_and_counting_arrays_unchanged": True, "line_bands_seconds": elapsed,
    "native_ink_sha256": hashlib.sha256(ink.tobytes()).hexdigest(),
    "finalize_called": False,
}
evidence.dump(evidence.OUT / "native-count.json", facts)
evidence.dump(evidence.OUT / "native-count-four-region-role-trace.json", {"events": events})
print(json.dumps(facts, indent=2))
sys.exit(count != 13)
