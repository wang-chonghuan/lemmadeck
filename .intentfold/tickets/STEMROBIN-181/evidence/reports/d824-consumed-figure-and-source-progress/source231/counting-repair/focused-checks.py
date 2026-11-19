import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

REPO = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
AUTHOR = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d797-source231-first-author"
REVIEW = REPO / ".intentfold/tickets/STEMROBIN-181/tmp/d808-source231-raw201202-first-review"
sys.path.insert(0, str(REPO / ".claude/skills/ld-s10y-lesson/tools"))
import layout


def glyph(ink, x, y, height):
    # Connected square glyph with an internal stroke: not a detached fraction rule.
    width = height
    ink[y:y + height, x:x + 3] = True
    ink[y:y + height, x + width - 3:x + width] = True
    ink[y:y + 3, x:x + width] = True
    ink[y + height - 3:y + height, x:x + width] = True
    ink[y + height // 2:y + height // 2 + 3, x:x + width] = True


def prose(ink, y, count, height=28, left=200):
    for index in range(count):
        glyph(ink, left + index * (height + 8), y, height)


def anchored_page():
    ink = np.zeros((900, 1200), dtype=bool)
    for y in (30, 110, 190, 270, 350):
        prose(ink, y, 20, 40)
    return ink


ANCHORS = [(30, 69), (110, 149), (190, 229), (270, 309), (350, 389)]
results = []


def exact(name, actual, expected):
    assert actual == expected, f"{name}: expected {expected!r}, got {actual!r}"
    return {"expected": expected, "actual": actual}


def count_without_mutation(ink, content_width):
    original = ink.copy()
    bands = layout.line_bands(ink, content_width)
    assert np.array_equal(ink, original), "Counter changed its input pixels"
    return bands


def source231():
    report = json.loads((REVIEW / "report.json").read_text())
    diagnostics = json.loads((REVIEW / "diagnostics.json").read_text())
    assert report["SOURCE231"]["independently_visible_text_rows"] == 19
    # Authoritative d808 source review, not assertions from existing unit tests.
    projection_expected = [(1755, 1797), (1813, 1852), (1863, 1892)]
    # d808's pre-repair raw trace records these one-pixel component fringes.
    footnote_expected = [(1755, 1798), (1812, 1853), (1862, 1892)]
    recorded_raw = diagnostics["native_function_return_locals"]["raw"]
    for a, b in footnote_expected:
        fragments = [tuple(band) for band in recorded_raw if a <= band[0] <= b]
        assert (min(x for x, _ in fragments), max(y for _, y in fragments)) == (a, b)
    image = Image.open(AUTHOR / "work/10p/pages/0231/page.png")
    ink = layout.ink_mask(image)
    columns = np.flatnonzero(ink.any(axis=0))
    content_width = int(columns[-1] - columns[0] + 1)
    assert content_width == 1344
    first_audit = json.loads((AUTHOR / "FIRST/outputs/audit.json").read_text())
    for figure in first_audit["figures"]:
        x, y, w, h = figure["box"]
        ink[y:y + h, x:x + w] = False
    masked = ink.copy()
    masked[:, :15] = False
    masked[:, -15:] = False
    projections = [
        band for band in layout._row_fragments(masked, content_width)
        if 1740 <= band[0] < 1900
    ]
    bands = count_without_mutation(ink, content_width)
    expected = [
        tuple(row["source_y_inclusive"]) for row in report["SOURCE231"]["rows"]
    ]
    expected[15:18] = footnote_expected
    result = {
        "name": "source231-19-rows-and-three-exact-footnote-bands",
        "projection": exact("reviewed source projection", projections, projection_expected),
        "bands": exact("component-inclusive source rows", bands, expected),
        "total": exact("source231 count", len(bands), 19),
    }
    assert not any(a <= 1720 <= b for a, b in bands), "Footnote separator became text"
    for upper, lower in zip(footnote_expected, footnote_expected[1:]):
        assert layout._small_prose_continuation(masked, *upper, *lower, 40)
    results.append(result)


def continuation(name, lower_count, lower_top, lower_left=200):
    ink = anchored_page()
    prose(ink, 450, 20)
    prose(ink, lower_top, lower_count, left=lower_left)
    expected = ANCHORS + [(450, 477), (lower_top, lower_top + 27)]
    assert layout._small_prose_continuation(ink, 450, 477, lower_top, lower_top + 27, 40)
    results.append({
        "name": name,
        "bands": exact(name, count_without_mutation(ink, 1200), expected),
    })


def three_row_continuation():
    ink = anchored_page()
    prose(ink, 450, 20)
    prose(ink, 488, 20)
    prose(ink, 526, 4)
    expected = ANCHORS + [(450, 477), (488, 515), (526, 553)]
    results.append({
        "name": "full-full-short-small-font-prose",
        "bands": exact("three prose rows", count_without_mutation(ink, 1200), expected),
    })


def fraction_row(nested):
    ink = anchored_page()
    prose(ink, 450, 5, left=300)
    if nested:
        ink[489:492, 285:485] = True
        prose(ink, 503, 5, left=300)
        ink[540:543, 290:478] = True
        prose(ink, 554, 5, left=300)
        bottom_top, bottom, expected_bottom = 554, 581, 581
        expected = ANCHORS + [(450, 581), (630, 669)]
    else:
        ink[492:495, 290:478] = True
        prose(ink, 509, 5, left=300)
        bottom_top, bottom, expected_bottom = 509, 536, 536
        expected = ANCHORS + [(450, 536), (630, 669)]
    prose(ink, 630, 20, 40)
    upper = (503, 530) if nested else (450, 477)
    assert not layout._small_prose_continuation(
        ink, *upper, bottom_top, bottom, 40,
    ), "Numerator/denominator falsely recognized as prose continuation"
    assert layout._single_fraction_row(ink, 450, expected_bottom, 40)
    name = "nested-single-row-fraction" if nested else "tall-single-row-fraction"
    results.append({
        "name": name,
        "bands": exact(name, count_without_mutation(ink, 1200), expected),
    })


source231()
continuation("short-small-font-continuation", 4, 488)
continuation("full-length-small-font-continuation-gap-merge", 20, 488, 202)
continuation("full-length-small-font-continuation-joining-only", 20, 495, 202)
three_row_continuation()
fraction_row(False)
fraction_row(True)
print(json.dumps({
    "status": "PASS",
    "independently_expected_cases": len(results),
    "expected_basis": "d808 independently reviewed source rows and skill prose/fraction contract",
    "existing_unit_tests_used_for_design": False,
    "input_pixels_unchanged": True,
    "image_opens": 0,
    "results": results,
}, indent=2))
