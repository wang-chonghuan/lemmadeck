"""Bounded offline checks; candidate files are never written."""
import hashlib
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
from PIL import Image

R = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
T = R / ".intentfold/tickets/STEMROBIN-181"
A = T / "tmp/d845-source235-first-author"
O = T / "tmp/d855-source235-first-independent-review"
TOOLS = R / ".claude/skills/ld-s10y-lesson/tools"
EXPECTED_FREEZE = "7e840e1738e34333282e6c1b9d96a15bdb1885ea6b749449a80bf751f9e27363"
assert Path.cwd() == R
sys.path.insert(0, str(TOOLS))
import blocks
from vectorize import _dilate, _ink


def binding(path):
    data = path.read_bytes()
    return {
        "path": str(path),
        "bytes": len(data),
        "sha256": hashlib.sha256(data).hexdigest(),
    }


def write_json(name, value):
    target = O / name
    assert target.parent.resolve() == O.resolve()
    with target.open("x", encoding="utf-8") as out:
        json.dump(value, out, ensure_ascii=False, indent=2)
        out.write("\n")


freeze_binding = binding(A / "freeze.json")
assert freeze_binding["sha256"] == EXPECTED_FREEZE
freeze = json.loads((A / "freeze.json").read_text())
bindings = []
for expected in freeze["files"]:
    path = Path(expected["path"])
    assert path.resolve().is_relative_to(A.resolve())
    actual = binding(path)
    actual["frozenSha256"] = expected["sha256"]
    actual["frozenBytes"] = expected["bytes"]
    actual["matchesFreeze"] = (
        actual["sha256"] == expected["sha256"]
        and actual["bytes"] == expected["bytes"]
    )
    bindings.append(actual)
assert all(item["matchesFreeze"] for item in bindings)

tool_bindings = []
recorded_tools = json.loads((A / "tool-hashes.after.json").read_text())
for path, expected in recorded_tools.items():
    path = Path(path)
    assert path.resolve().is_relative_to(R.resolve())
    actual = binding(path)
    actual["authorRecordedSha256"] = expected
    actual["matchesAuthorRecord"] = actual["sha256"] == expected
    tool_bindings.append(actual)
tools_match_author = all(item["matchesAuthorRecord"] for item in tool_bindings)

page_dir = A / "root/10p/pages/0235"
work_dir = A / "work/10p/pages/0235"
md = (page_dir / "page.md").read_text()
meta, parsed = blocks.parse(md)
page = json.loads((page_dir / "page.json").read_text())
assert meta == page["meta"]
for native, structured in zip(parsed, page["blocks"], strict=True):
    assert native == {key: value for key, value in structured.items() if key != "id"}

# Expectations come from the previously frozen source-first visual inventory.
expected_rows = [
    "同时，菲涅耳定量地研究了不同类型的障碍物的衍射.",
    "1818年在法兰西科学院会议上发生了一个有趣的情况. ",
    "出席会议的一个学者在会议上注意到由菲涅耳学说得出的事",
    "实，明显地与合情理的看法相矛盾. 在孔的大小一定和从小",
    "孔至光源及屏幕的距离一定的情况下，光斑的中心应是一小",
    "暗斑. 相反，在一个不透明的小圆盘后面的阴影中心应是一",
    "亮斑. 当实验证明的确是这么一回事时，学者们是多么惊",
    "奇啊！",
    "不同障碍物的衍射图样　由于光波的波长很短，光偏离",
    "直线传播的角度不大. 所以为了清楚地观察到衍射（尤其是",
    "象刚才讲过的那些情况）光绕过的障碍物到屏幕之间的距离",
    "应该是很大的.",
    "图205表明，在照片上的各种障碍物引起的衍射图样：а)",
    "细金属线的，б) 圆孔的，в) 圆形物的.",
    "图　205",
    "显微镜和望远镜的分辨本领　光的波动性使得用显微镜",
    "观察和辨别物体的细节或很小的物体的可能性受到限制. 衍",
    "射使我们不能得到细小物体的清晰的像，因为光并不是严格",
    "·225·",
]
actual_rows = [line for block in parsed for line in block["lines"]]
assert actual_rows == expected_rows
assert [block["kind"] for block in parsed] == [
    "p", "p", "p", "p", "fig", "cap", "p", "foot"
]
assert [len(block["lines"]) for block in parsed] == [1, 7, 4, 2, 0, 1, 3, 1]
assert blocks.printed_lines(parsed) == 19
assert not any(block["cont"] for block in parsed)
assert [i + 1 for i, block in enumerate(parsed) if block["open"]] == [7]
assert parsed[6]["lines"][-1].endswith("因为光并不是严格")
assert not any("$" in row or "↵" in row for row in actual_rows)
assert [ord(char) for char in re.findall(r"([а-бв])\)", "\n".join(actual_rows))] == [
    0x0430, 0x0431, 0x0432
]
first_md = (A / "author-first/page.md").read_text()
leadins = ["不同障碍物的衍射图样", "显微镜和望远镜的分辨本领"]
bold_present = [
    {"text": text, "markdownBold": f"**{text}**" in md,
     "authorFirstMarkdownBold": f"**{text}**" in first_md}
    for text in leadins
]

src = Image.open(work_dir / "page.png").convert("RGB")
raw = Image.open(work_dir / "figures/fig-205.png").convert("RGB")
x, y, w, h = parsed[4]["box"]
padding = 12
rect = (x - padding, y - padding, x + w + padding, y + h + padding)
expected_crop = src.crop(rect)
raw_array = np.asarray(raw)
crop_array = np.asarray(expected_crop)
assert raw_array.shape == crop_array.shape
crop_mismatch = int(np.any(raw_array != crop_array, axis=2).sum())
assert crop_mismatch == 0

svg_path = work_dir / "figures/fig-205.svg"
svg = ET.parse(svg_path).getroot()
ns = "{http://www.w3.org/2000/svg}"
paths = svg.findall(f".//{ns}path")
tags = [node.tag.removeprefix(ns) for node in svg.iter()]
assert tags == ["svg", "path"]
assert svg.attrib["viewBox"] == "0 0 1107 488"
assert svg.attrib["width"] == "1107" and svg.attrib["height"] == "488"
assert paths[0].attrib["fill"] == "currentColor"
assert paths[0].attrib["fill-rule"] == "evenodd"
assert not any("href" in key for node in svg.iter() for key in node.attrib)
ink = _ink(work_dir / "figures/fig-205.png")
got = _ink(O / "svg205.review.png")
assert ink.shape == got.shape
missing = int((ink & ~_dilate(got, 1)).sum())
extra = int((got & ~_dilate(ink, 1)).sum())
ink_pixels = int(ink.sum())
ratio = (missing + extra) / ink_pixels
assert ratio <= 0.02

checks = {
    "schema": "d855-source235-independent-mechanical-checks@1",
    "cwd": str(R),
    "sourceFirstAuthority": binding(O / "source-first-inventory.md"),
    "sourceText": {
        "rowsExactUnderProfileConventions": True,
        "printedRows": 19, "blocks": 8,
        "rowsPerBlock": [1, 7, 4, 2, 0, 1, 3, 1],
        "markdownJsonAgreement": True,
        "incoming": 0, "outgoing": ["p0235#7"],
        "outgoingSuffix": "因为光并不是严格",
        "mathSpans": 0,
        "cyrillicSubfigureCodepoints": ["U+0430", "U+0431", "U+0432"],
        "boldLeadins": bold_present,
        "note": "Row equality is text only, not a typography PASS.",
    },
    "raw205": {
        "size": list(raw.size), "sourceRectangleXYXY": list(rect),
        "paddingPx": padding, "sourcePixelMismatch": crop_mismatch,
        "pixelsCompared": raw.size[0] * raw.size[1],
    },
    "svg205": {
        "tags": tags, "pathCount": len(paths),
        "viewBox": svg.attrib["viewBox"],
        "fill": "currentColor", "fillRule": "evenodd",
        "externalReferences": 0, "rasterSize": list(raw.size),
        "inkPixels": ink_pixels, "missingPixels": missing, "extraPixels": extra,
        "mismatchRatio": ratio, "mismatchPercent": ratio * 100,
        "limitRatio": 0.02, "tolerancePx": 1,
        "note": "Existing SVG raster-only review; no vectorize/finalize rerun.",
    },
}
write_json("input-bindings.json", {
    "schema": "d855-source235-input-bindings@1",
    "candidateFreeze": freeze_binding,
    "expectedFreezeSha256": EXPECTED_FREEZE,
    "candidateFiles": bindings,
    "allCandidateFilesMatchFreeze": True,
    "currentToolBindings": tool_bindings,
    "currentToolsMatchAuthorRecord": tools_match_author,
    "toolDriftNote": (
        "Shared tool drift is recorded, not repaired. p2c.py was not executed; "
        "the imported read-only parser, mask comparator and invoked SVG "
        "rasterizer still match the author-recorded hashes."
    ),
    "reviewGateBindings": [
        binding(R / ".claude/skills/ld-s10y-lesson/SKILL.md"),
        binding(R / ".agents/skills/ld-s10y-image/SKILL.md"),
    ],
    "sourcePdfSha256MetadataOnly": meta["source"]["pdf_sha256"],
    "sourcePdfIndependentlyRehashed": False,
})
write_json("mechanical-checks.json", checks)
print(json.dumps({
    "candidateFilesMatched": len(bindings),
    "sourceRowsMatched": len(actual_rows),
    "sourcePixelMismatch": crop_mismatch,
    "svgMismatchPercent": ratio * 100,
    "boldLeadinsEncoded": [item["markdownBold"] for item in bold_present],
}))
