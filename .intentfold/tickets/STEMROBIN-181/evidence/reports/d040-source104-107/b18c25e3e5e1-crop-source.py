from pathlib import Path
from PIL import Image

root = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
output = root / "tmp/d040-10p-source104-107-author/source-text-crop-104.png"
assert not output.exists()
with Image.open(root / ".tmp/ld-s10y-lesson/10p/pages/0104/page.png") as image:
    image.crop((500, 1215, 1330, 1310)).resize((1660, 190)).save(output)
