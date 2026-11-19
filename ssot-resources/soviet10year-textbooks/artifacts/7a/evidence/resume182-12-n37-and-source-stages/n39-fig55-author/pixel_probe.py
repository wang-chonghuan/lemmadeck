#!/usr/bin/env python3
"""Print source-pixel runs without producing or opening another image."""

import argparse
import hashlib
import json
import struct
import zlib
from pathlib import Path


def rgb_png(path):
    data = path.read_bytes()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("Not a PNG")
    pos = 8
    compressed = bytearray()
    while pos < len(data):
        length = struct.unpack(">I", data[pos:pos + 4])[0]
        kind = data[pos + 4:pos + 8]
        payload = data[pos + 8:pos + 8 + length]
        if kind == b"IHDR":
            width, height, depth, color, compression, filtering, interlace = (
                struct.unpack(">IIBBBBB", payload)
            )
            if (depth, color, compression, filtering, interlace) != (8, 2, 0, 0, 0):
                raise ValueError("This probe supports non-interlaced 8-bit RGB only")
        if kind == b"IDAT":
            compressed.extend(payload)
        pos += length + 12
    raw = zlib.decompress(compressed)
    stride = width * 3
    previous = bytearray(stride)
    rows = []
    for y in range(height):
        offset = y * (stride + 1)
        mode = raw[offset]
        row = bytearray(raw[offset + 1:offset + 1 + stride])
        for i in range(stride):
            left = row[i - 3] if i >= 3 else 0
            above = previous[i]
            corner = previous[i - 3] if i >= 3 else 0
            if mode == 0:
                predictor = 0
            elif mode == 1:
                predictor = left
            elif mode == 2:
                predictor = above
            elif mode == 3:
                predictor = (left + above) // 2
            elif mode == 4:
                p = left + above - corner
                choices = ((abs(p - left), left), (abs(p - above), above),
                           (abs(p - corner), corner))
                predictor = min(choices, key=lambda item: item[0])[1]
            else:
                raise ValueError("Unknown PNG row filter")
            row[i] = (row[i] + predictor) & 255
        rows.append(row)
        previous = row
    return width, height, rows, hashlib.sha256(data).hexdigest()


def runs(values):
    result = []
    start = None
    for coordinate, dark in values:
        if dark and start is None:
            start = coordinate
        if not dark and start is not None:
            result.append([start, coordinate - 1])
            start = None
    if start is not None:
        result.append([start, coordinate])
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--x", nargs="+", type=int, default=[])
    parser.add_argument("--y", nargs="+", type=int, default=[])
    parser.add_argument("--threshold", type=int, default=128)
    args = parser.parse_args()
    path = Path(__file__).parent.parent / (
        "n38-n39-source-stage/artifacts/7a/figures/fig-55.png"
    )
    width, height, rows, digest = rgb_png(path)

    def dark(x, y):
        return sum(rows[y][x * 3:x * 3 + 3]) / 3 < args.threshold

    print(json.dumps({
        "sourceSha256": digest,
        "size": [width, height],
        "threshold": args.threshold,
        "verticalRuns": {
            str(x): runs((y, dark(x, y)) for y in range(10, height - 8))
            for x in args.x
        },
        "horizontalRuns": {
            str(y): runs((x, dark(x, y)) for x in range(10, width - 8))
            for y in args.y
        },
        "imagePayloadsEmitted": 0,
    }, indent=2))


if __name__ == "__main__":
    main()
