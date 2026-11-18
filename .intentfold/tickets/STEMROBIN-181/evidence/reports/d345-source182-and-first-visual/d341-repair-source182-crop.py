import json
import sys
from pathlib import Path

tools = Path(__file__).resolve().parents[4] / ".claude/skills/ld-s10y-lesson/tools"
sys.path.insert(0, str(tools))
import blocks
import vectorize

action, directory = sys.argv[1:]
root = Path(directory)
page = root / "source/10p/pages/0182/page.md"
if action == "prepare":
    meta, objects = blocks.load(page)
    assert "fig-139" not in meta.get("figure_crops", {})
    assert objects[0]["kind"] == "fig"
    assert objects[0]["label"] == "\u56fe 139"
    assert objects[0]["box"] == [513, 259, 551, 278]
    meta.setdefault("figure_crops", {})["fig-139"] = {
        "padding_px": 4,
        "reason": (
            "D333 first source/crop observation: exact drawing bottom537, "
            "separate caption row543-574. Initial12px padding ends549 and "
            "includes caption strokes. Four-pixel padding ends541 and "
            "keeps the entire source drawing with white margin; initial "
            "RAW139-CAPTION-LEAK FAIL is preserved."
        ),
    }
    page.write_text(blocks.dump(meta, objects, 182), encoding="utf-8")
    print(json.dumps({"status": "ONE-FIGURE-PADDING-CANDIDATE", "padding_px": 4}))
elif action == "vectorize":
    png = root / "work/10p/pages/0182/figures/fig-139.png"
    result = vectorize.vectorize(png, png.with_suffix(".svg"))
    print(json.dumps(result))
    sys.exit(0 if result["ok"] else 1)
else:
    raise ValueError(action)
