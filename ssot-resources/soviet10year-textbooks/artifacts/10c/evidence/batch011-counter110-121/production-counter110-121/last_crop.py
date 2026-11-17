import json

from PIL import Image

from diagnose import OUT, inputs, load_layout, TOOLS

layout = load_layout(TOOLS / "layout.py")
source, _, _ = inputs(121)
target = OUT / "121-distant-component-native.png"
if target.exists():
    raise RuntimeError("Refuse to recreate the eighth crop")
with Image.open(source) as img:
    img.crop((0, 810, 80, 860)).save(target)
entry = {
    "source": str(source), "source_sha256": layout.sha256_file(source),
    "path": str(target), "xywh": [0, 810, 80, 50], "size": [80, 50],
    "sha256": layout.sha256_file(target), "transformation": "native rectangular subset only",
}
(OUT / "crop-08.json").write_text(json.dumps(entry, indent=2) + "\n")
print(json.dumps(entry, indent=2))
