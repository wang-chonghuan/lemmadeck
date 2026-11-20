import json
from pathlib import Path
from xml.etree import ElementTree as ET
from PIL import Image

own = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d1816-d280-fig2425-author")
results = []
for figure in ("fig-24", "fig-25"):
    directory = own / figure
    svg = ET.parse(directory / f"{figure}.svg")
    texts = [n.text for n in svg.iter() if n.tag.endswith("}text")]
    assert texts == (["u\u209a", "O", "t"] if figure == "fig-24" else [])
    assert not any(n.tag.endswith("}image") for n in svg.iter())
    for variant in ("source-width", "full-width", "mobile331-scroll-end"):
        file = directory / f"{figure}.{variant}.png"
        image = Image.open(file).convert("RGBA")
        opaque = 0
        paper = 0
        ink = 0
        for r, g, b, a in image.getdata():
            opaque += a == 255
            paper += r > 248 and g > 248 and b > 248 and a == 255
            ink += r < 150 and g < 150 and b < 150 and a == 255
        total = image.width * image.height
        assert opaque == total
        assert paper > total * 0.1
        assert ink > total * 0.005
        assert ink < total * 0.9
        results.append({
            "figure": figure, "variant": variant, "path": str(file),
            "width": image.width, "height": image.height,
            "opaquePixels": opaque, "whitePixels": paper, "inkPixels": ink,
            "status": "nonblank-opaque-white-background",
        })
output = {"schema": "d280-preview-pixel-audit@1", "status": "pass", "previews": results,
          "svgXmlChecked": True, "imagesLoadedIntoModelContext": 0,
          "meaning": "PNG byte/pixel analysis plus XML structure checks, not additional visual image opens or independent approval."}
with (own / "pixel-audit.json").open("x") as stream:
    json.dump(output, stream, indent=2)
    stream.write("\n")
print(json.dumps(output))
