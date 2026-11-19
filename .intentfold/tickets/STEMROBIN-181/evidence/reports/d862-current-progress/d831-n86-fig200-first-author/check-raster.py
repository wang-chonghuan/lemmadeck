import json
import sys

from PIL import Image, ImageChops

results = []
for file in sys.argv[1:]:
    image = Image.open(file).convert("RGB")
    white = Image.new("RGB", image.size, (255, 255, 255))
    bounds = ImageChops.difference(image, white).getbbox()
    histogram = image.convert("L").histogram()
    total = image.width * image.height
    dark = sum(histogram[:171]) / total
    white_fraction = sum(histogram[246:]) / total
    assert bounds is not None, "Blank raster"
    assert 0.001 < dark < 0.4, "Blank or black raster"
    assert white_fraction > 0.6, "Unexpected dense/black background"
    assert bounds[0] > 0 and bounds[1] > 0
    assert bounds[2] < image.width and bounds[3] < image.height, "Clipped raster ink"
    results.append({
        "path": file,
        "width": image.width,
        "height": image.height,
        "nonwhiteBounds": bounds,
        "darkPixelFraction": dark,
        "nearWhitePixelFraction": white_fraction,
        "status": "pass",
    })

print(json.dumps({"schema": "d831/raster-check@1", "status": "pass", "results": results}, indent=2))
