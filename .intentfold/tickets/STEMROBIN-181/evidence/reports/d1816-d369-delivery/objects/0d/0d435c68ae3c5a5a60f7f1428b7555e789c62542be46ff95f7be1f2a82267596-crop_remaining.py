"""Two final native-pixel crops within the strict eight-open author budget."""
import json

from PIL import Image

from crop_once import EVIDENCE, REPO, WORK, sha


def main():
    from pathlib import Path

    if Path.cwd().resolve() != REPO:
        raise RuntimeError("cwd must be the authorized checkout")
    entries = []
    for page, name, box in [
        (396, "0396-rows17-19-emphasis", (195, 1340, 1370, 1575)),
        (395, "0395-rows19-25-emphasis", (155, 1370, 1340, 1900)),
    ]:
        source = WORK / "10p/pages" / f"{page:04d}" / "page.png"
        output = WORK / "crops" / f"{name}.png"
        if output.exists():
            raise RuntimeError(f"crop already exists: {output}")
        with Image.open(source) as image:
            image.crop(box).save(output)
        entries.append({
            "source_page": page, "source": str(source),
            "source_sha256": sha(source), "box_xyxy": box,
            "output": str(output), "output_sha256": sha(output),
            "operation": "native-pixel crop only; no rescale, threshold, OCR or synthesis",
        })
    with (EVIDENCE / "crop-remaining-receipt.json").open("x", encoding="utf-8") as stream:
        json.dump({"schema": "STEMROBIN-181/crop-receipt@1", "entries": entries}, stream, indent=2)
        stream.write("\n")
    print(json.dumps(entries, indent=2))


if __name__ == "__main__":
    main()
