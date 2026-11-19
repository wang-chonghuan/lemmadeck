"""Emit numerical source-grid observations only; never load image payloads."""

from pathlib import Path
import json

from PIL import Image


ROOT = Path("/Users/yong/.codex/worktrees/d9b1/lemmadeck")
SOURCE = ROOT / (
    ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13/"
    "n41-n43-source-stage/artifacts/7a/figures"
)


def runs(values, threshold):
    selected = [index for index, value in enumerate(values) if value >= threshold]
    groups = []
    for index in selected:
        if groups and index == groups[-1][-1] + 1:
            groups[-1].append(index)
        else:
            groups.append([index])
    return [
        {"center": round(sum(group) / len(group), 2), "span": [group[0], group[-1]]}
        for group in groups
    ]


for number in (56, 57, 58):
    with Image.open(SOURCE / f"fig-{number}.png") as image:
        gray = image.convert("L")
        width, height = gray.size
        pixels = gray.load()
        xs = [
            sum(pixels[x, y] < 170 for y in range(10, height - 10))
            for x in range(width)
        ]
        ys = [
            sum(pixels[x, y] < 170 for x in range(10, width - 10))
            for y in range(height)
        ]
        print(json.dumps({
            "figure": f"fig-{number}",
            "size": [width, height],
            "verticalLongDarkRuns": runs(xs, (height - 20) * 0.50),
            "horizontalLongDarkRuns": runs(ys, (width - 20) * 0.50),
            "note": "Dark-line projections supplement the independently opened pixels; scan skew can split or merge runs.",
        }))
