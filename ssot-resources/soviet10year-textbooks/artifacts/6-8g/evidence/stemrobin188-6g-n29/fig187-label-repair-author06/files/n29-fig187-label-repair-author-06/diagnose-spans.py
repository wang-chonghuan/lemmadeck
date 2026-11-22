import json
import pathlib
import re
import xml.etree.ElementTree as ET

ROOT = pathlib.Path("/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck")
OWN = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n29-fig187-label-repair-author-06"
OLD = ROOT / ".intentfold/tickets/STEMROBIN-188/tmp/n29-fig187189-author-first-06"
NS = {"s": "http://www.w3.org/2000/svg"}
result = {}
for key, svg_path, spec_path in [
    ("oldFailed", OLD / "figures/fig-187.svg", OLD / "figures/fig-187.spec.json"),
    ("currentNativePass", OWN / "figures/fig-187.svg", OWN / "figures/fig-187.spec.json"),
]:
    doc = ET.parse(svg_path)
    group = doc.find(".//s:g[@id='ld-fig-187-raw-path-layer']", NS)
    assert group is not None
    transform = group.get("transform")
    assert transform == "scale(30 30)"
    spec = json.loads(spec_path.read_text())
    brackets = [o for o in spec["objects"] if o["type"] == "svgPath"]
    paths = group.findall("s:path", NS)
    assert len(paths) == len(brackets) == 6
    rows = []
    for obj, node in zip(brackets, paths):
        assert node.get("d") == obj["d"]
        assert re.fullmatch(r"[ML0-9.eE+\-\s]+", obj["d"])
        values = [float(v) for v in re.findall(r"[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?", obj["d"])]
        points = list(zip(values[::2], values[1::2]))
        bounds = [min(x for x, y in points) * 30, min(y for x, y in points) * 30,
                  max(x for x, y in points) * 30, max(y for x, y in points) * 30]
        wholly_outside = bounds[0] > 960 or bounds[1] > 480
        assert wholly_outside
        rows.append({"id": obj["id"], "sourceD": obj["d"], "nativeParentTransform": transform,
                     "transformedBounds": bounds, "canvas": [0, 0, 960, 480],
                     "whollyOutsideCanvas": wholly_outside, "stroke": node.get("stroke")})
    result[key] = {"svg": str(svg_path), "spec": str(spec_path), "brackets": rows}
assert result["oldFailed"]["brackets"] == result["currentNativePass"]["brackets"]
print(json.dumps({
    "status": "INHERITED_SPAN_RENDERING_DEFECT_CONFIRMED_TEXT_ONLY",
    "evidence": result,
    "conclusion": "All six inherited screen-coordinate bracket paths are multiplied by the installed raw-path 30x transform. They are unchanged in the h-label-only repair and lie entirely outside the rendered canvas.",
    "noNewImage": True, "rerender": False, "toolEdited": False
}, indent=2))
