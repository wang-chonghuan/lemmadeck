"""Focused command evidence for the authorized native page-merge fix."""
import copy
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(TOOLS))

import assemble


def block(page, index=1, kind="p", cont=False, open=False):
    return {
        "kind": kind,
        "page": page,
        "printed_page": 1,
        "ref": f"p{page:04d}#{index}",
        "lines": [f"{kind}:{page}:{index}:first ", f"{kind}:{page}:{index}:last"],
        "cont": cont,
        "open": open,
    }


results = []


def check(name, stream, expected_refs, expected_lines, expected_open, warning_ref=None):
    out, warnings = assemble.merge_across_pages(copy.deepcopy(stream))
    refs = [item.get("spans") or [item["ref"]] for item in out]
    lines = [item["lines"] for item in out]
    assert refs == expected_refs, (name, "source_refs", refs, expected_refs)
    assert lines == expected_lines, (name, "lines", lines, expected_lines)
    assert [item.get("open", False) for item in out] == expected_open, name
    if warning_ref is None:
        assert warnings == [], (name, warnings)
    else:
        assert len(warnings) == 1, (name, warnings)
        assert warnings[0].startswith(warning_ref + ":"), (name, warnings)
    results.append({
        "case": name,
        "status": "PASS",
        "output_blocks": len(out),
        "source_refs": refs,
        "lines": lines,
        "warnings": warnings,
    })


for kind in ("p", "ex"):
    start = block(186, kind=kind, open=True)
    gap = block(188, kind=kind, cont=True)
    check(
        f"{kind}:186open->188cont-gap",
        [start, gap],
        [["p0186#1"], ["p0188#1"]],
        [start["lines"], gap["lines"]],
        [True, False],
        warning_ref="p0188#1",
    )

    adjacent = block(187, kind=kind, cont=True)
    check(
        f"{kind}:186open->187cont-adjacent",
        [start, adjacent],
        [["p0186#1", "p0187#1"]],
        [start["lines"] + adjacent["lines"]],
        [False],
    )

    first = block(185, kind=kind, open=True)
    middle = block(186, kind=kind, cont=True, open=True)
    check(
        f"{kind}:185open->186cont-open->187cont",
        [first, middle, adjacent],
        [["p0185#1", "p0186#1", "p0187#1"]],
        [first["lines"] + middle["lines"] + adjacent["lines"]],
        [False],
    )

    figure = block(186, 2, kind="fig")
    caption = block(186, 3, kind="cap")
    same_page = block(186, 4, kind=kind, cont=True)
    check(
        f"{kind}:same-page-fig-cap-interruption",
        [start, figure, caption, same_page],
        [["p0186#1", "p0186#4"], ["p0186#2"], ["p0186#3"]],
        [start["lines"] + same_page["lines"], figure["lines"], caption["lines"]],
        [False, False, False],
    )
    check(
        f"{kind}:merged-last-page-fig-cap-interruption",
        [first, middle, figure, caption, same_page],
        [["p0185#1", "p0186#1", "p0186#4"], ["p0186#2"], ["p0186#3"]],
        [
            first["lines"] + middle["lines"] + same_page["lines"],
            figure["lines"],
            caption["lines"],
        ],
        [False, False, False],
    )

print(json.dumps({
    "ticket": "STEMROBIN-181",
    "scope": "assemble.merge_across_pages only; synthetic in-memory block fixtures",
    "status": "PASS",
    "checks_passed": len(results),
    "assemble_sha256": hashlib.sha256((TOOLS / "assemble.py").read_bytes()).hexdigest(),
    "fixture_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
    "results": results,
}, ensure_ascii=True, indent=2))
