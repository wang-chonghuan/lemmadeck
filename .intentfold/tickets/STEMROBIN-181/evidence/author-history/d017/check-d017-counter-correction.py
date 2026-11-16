import hashlib
import json
import sys
from pathlib import Path

from PIL import Image

root = Path.cwd()
work = root / ".intentfold/tickets/STEMROBIN-181/tmp"
tools = root / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(tools))
import blocks
import layout
import p2c


def bind(file):
    return {
        "path": str(file.relative_to(root)),
        "sha256": hashlib.sha256(file.read_bytes()).hexdigest(),
    }


before_tool = work / "d017-layout.before.py"
current_tool = tools / "layout.py"
before = before_tool.read_text()
current = current_tool.read_text()
old_guard = "0.5 * glyph_h <= b - a + 1 <= 1.2 * glyph_h"
new_guard = "0.5 * glyph_h <= b - a + 1 <= 1.3 * glyph_h"
assert before.count(old_guard) == 1
assert current == before.replace(old_guard, new_guard)
folder = work / "9p-next-source-0148-0151"
before_draft = folder / "0149.before.page.md"
current_draft = folder / "0149.page.md"
old_word = "因为原子中的电子数等于原子核中的质子数."
new_word = "因为原子中的电子数等于原子核中的原子数."
assert before_draft.read_text().count(old_word) == 1
assert current_draft.read_text() == before_draft.read_text().replace(old_word, new_word)
meta, page_blocks = blocks.load(current_draft)
source = root / ".tmp/ld-s10y-lesson/9p/pages/0149/page.png"
source_binding = bind(source)
assert source_binding["sha256"] == meta["render"]["sha256"]
ink = layout.ink_mask(Image.open(source))
before_ink = ink.copy()
columns = ink.any(axis=0).nonzero()[0]
content_width = int(columns[-1] - columns[0] + 1)
bands = p2c._counting_line_bands(meta, ink, content_width)
assert len(bands) == 25
assert blocks.printed_lines(page_blocks) == 25
assert (1865, 1911) in bands
assert (1918, 1946) in bands
assert (1795, 1838) in bands
assert (1987, 2011) in bands
assert layout._small_prose_continuation(ink, 1865, 1911, 1918, 1946, 38)
assert not layout._single_fraction_row(ink, 1865, 1946, 38)
assert (before_ink == ink).all()
assert bind(source) == source_binding
report = {
    "ticket": "STEMROBIN-181",
    "status": "affected-counter-correction-verified-pending-independent-recheck",
    "initialGate": bind(work / "source-review-9p-0148-0151.json"),
    "toolBefore": bind(before_tool),
    "toolCurrent": bind(current_tool),
    "onlyToolChange": {
        "function": "_small_prose_continuation",
        "before": old_guard,
        "after": new_guard,
        "reason": "A 47px full-row band enclosing small-font prose was rejected at45.6px although its glyphs meet the separate small-font/left-alignment/short-continuation/no-fraction-rule checks. Permit49.4px; all other checks remain unchanged.",
    },
    "draftBefore": bind(before_draft),
    "draftCurrent": bind(current_draft),
    "source": source_binding,
    "onlyTextChange": "One source-fidelity character:质->原; printed scientific error preserved for later modern SCI treatment.",
    "nativeCount": len(bands),
    "printedRows": blocks.printed_lines(page_blocks),
    "bands": bands,
    "footnoteLastTwoRowsRemainSeparate": True,
    "precedingFractionRowAndFooterUnchanged": True,
    "sourcePixelsAndInkUnchanged": True,
    "gateScope": "Only F1 and F2 on149; no other page/figure approval repeated, no native finalize or full-project test.",
}
output = work / "d017-native-counter-correction.json"
assert not output.exists()
output.write_text(json.dumps(report, indent=2) + "\n")
print("149 counter25/printed25; two footnote rows separate; preceding fraction/footer unchanged.")
