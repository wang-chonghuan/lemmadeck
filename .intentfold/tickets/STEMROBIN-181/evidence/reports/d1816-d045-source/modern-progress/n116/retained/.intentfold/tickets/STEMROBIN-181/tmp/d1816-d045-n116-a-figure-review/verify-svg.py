"""Read-only XML audit. It does not render, open images, or modify evidence."""

import json
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path("/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck")
assert Path.cwd() == ROOT
freeze = json.loads((ROOT / ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d045-n116-a-figure-author/author-freeze.json").read_text())
results = []
for figure in freeze["figures"]:
    root = ET.parse(ROOT / figure["final"]["svg"]["path"]).getroot()
    parents = {child: parent for parent in root.iter() for child in parent}
    hidden_literals = 0
    visible_literals = []
    texts = []
    for element in root.iter():
        hidden = False
        node = element
        while node is not None:
            style = node.get("style", "").replace(" ", "")
            hidden |= node.get("display") == "none" or "display:none" in style
            hidden |= node.get("visibility") == "hidden" or "visibility:hidden" in style
            node = parents.get(node)
        literals = [value for key, value in element.attrib.items() if key in ("stroke", "fill") and value.startswith("#")]
        if literals and hidden:
            hidden_literals += 1
        elif literals:
            visible_literals.append({"id": element.get("id"), "colors": literals})
        if element.tag.endswith("}text") and not hidden:
            texts.append({
                "text": "".join(element.itertext()),
                "fontSize": float(element.get("font-size")),
                "x": float(element.get("x")),
                "y": float(element.get("y")),
            })
    assert not visible_literals, visible_literals
    assert all(text["fontSize"] == 32 for text in texts)
    results.append({
        "id": figure["id"],
        "hiddenLiteralConstructionElements": hidden_literals,
        "visibleLiteralColorElements": len(visible_literals),
        "visibleTexts": texts,
    })
print(json.dumps({"status": "PASS", "figures": results}, indent=2))
