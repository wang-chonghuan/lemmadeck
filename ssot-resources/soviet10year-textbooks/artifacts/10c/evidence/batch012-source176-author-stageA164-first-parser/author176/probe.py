import hashlib
import json
import pathlib
import struct
import sys


repo = pathlib.Path.cwd()
source_root = repo / ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c176-179"
author_root = pathlib.Path(__file__).resolve().parent


def binding(path):
    payload = path.read_bytes()
    return {
        "path": str(path),
        "bytes": len(payload),
        "sha256": hashlib.sha256(payload).hexdigest(),
    }


def png_binding(path):
    data = path.read_bytes()
    result = binding(path)
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("Not a PNG")
    width, height, depth, color = struct.unpack(">IIBB", data[16:26])
    result.update(width=width, height=height, bit_depth=depth, color_type=color)
    result["mode"] = {2: "RGB", 6: "RGBA"}.get(color, "UNKNOWN")
    offset = 8
    while offset < len(data):
        length = struct.unpack(">I", data[offset:offset + 4])[0]
        tag = data[offset + 4:offset + 8]
        if tag == b"pHYs":
            x, y, unit = struct.unpack(">IIB", data[offset + 8:offset + 17])
            result["pHYs"] = {"x": x, "y": y, "unit": unit}
            result["dpi"] = [x * 0.0254, y * 0.0254] if unit == 1 else "UNKNOWN"
        offset += length + 12
    return result


mode = sys.argv[1]
if mode == "preload":
    page = int(sys.argv[2])
    folder = source_root / f"10c/pages/{page:04d}"
    result = {
        "source_image": png_binding(folder / "page.png"),
        "metadata_only": [
            binding(folder / "page.template.md"),
            binding(folder / "layout.json"),
            binding(source_root / f"prepare-{page:04d}.json"),
        ],
        "template_text": (folder / "page.template.md").read_text(),
        "layout_metadata_not_expected_rows": json.loads((folder / "layout.json").read_text()),
        "upstream_prepare_not_executed_here": json.loads(
            (source_root / f"prepare-{page:04d}.json").read_text()
        ),
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
elif mode == "png":
    print(json.dumps(png_binding(pathlib.Path(sys.argv[2]).resolve()), indent=2))
elif mode == "freeze":
    outputs = []
    ledger = []
    for page in range(176, 180):
        path = repo / f"ssot-resources/soviet10year-textbooks/artifacts/10c/pages/{page:04d}/page.md"
        payload = path.read_text()
        frontmatter, body = payload.split("---", 2)[1:]
        metadata = json.loads(frontmatter)
        block = None
        rows = []
        for line_number, line in enumerate(body.splitlines(), start=payload[:payload.index(body)].count("\n") + 1):
            if line.startswith("<!-- "):
                block = line
            elif line:
                rows.append({
                    "md_line": line_number,
                    "block_header": block,
                    "author_transcribed_row": line,
                    "formula_printed_breaks": line.count("↵"),
                })
        observations_path = author_root / f"observations-{page:04d}.json"
        observations = json.loads(observations_path.read_text())
        ledger.extend(observations["images"])
        folder = source_root / f"10c/pages/{page:04d}"
        prepare_path = source_root / f"prepare-{page:04d}.json"
        prepare = json.loads(prepare_path.read_text())
        layout = binding(folder / "layout.json")
        outputs.append({
            "page": page,
            "markdown": binding(path),
            "source_image": png_binding(source_root / f"10c/pages/{page:04d}/page.png"),
            "frontmatter": metadata,
            "row_inventory": rows,
            "visual_observations": observations,
            "visual_observations_binding": binding(observations_path),
            "metadata_inputs": [
                binding(folder / "page.template.md"),
                layout,
                binding(prepare_path),
            ],
            "upstream_prepare_qualification": "Existing parent preparation log, not executed by this source author.",
            "layout_hashes": {
                "upstream_declared": prepare["layoutSha256"],
                "current_file_sha256": layout["sha256"],
                "reason_for_difference": "UNKNOWN; no repair, preparation, or shared-tool operation performed.",
            },
            "inventory_qualification": "Snapshot of source author's first-view transcription; not an independent review, count gate, or expected-row derivation.",
        })
    result = {
        "pages": outputs,
        "image_ledger": ledger,
        "budget": {
            "current_author_batch_images": 6,
            "current_author_lifetime_images": 6,
            "batch_limit": 8,
            "author_lifetime_limit": 24,
            "original_views": 4,
            "new_native_crop_views": 2,
            "reopens": 0,
            "parent_permanent_images": "24/24, human-supplied transport; never reset or independently inspected here",
        },
        "scripts": [binding(author_root / name) for name in ("capture.py", "probe.py", "crop.py")],
        "command_records": [
            binding(path) for path in sorted(author_root.glob("*.command.json"))
        ],
        "status": "SOURCE_AUTHOR_FROZEN_TEXT_WITH_UNKNOWNS; not PASS, not independently reviewed or finalized",
    }
    with (author_root / "frozen.json").open("x") as stream:
        json.dump(result, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    print(json.dumps(result, ensure_ascii=False, indent=2))
elif mode == "seal":
    inputs = [
        repo / name for name in (
            "AGENTS.md",
            ".intentfold/readme.md",
            ".intentfold/project.json",
            ".intentfold/charter/product.md",
            ".intentfold/charter/engineering.md",
            ".intentfold/charter/operations.md",
            ".claude/skills/ld-s10y-lesson/SKILL.md",
            ".agents/skills/ld-s10y-image/SKILL.md",
        )
    ]
    inputs.append(pathlib.Path("/Users/yong/.agents/skills/intentfold/SKILL.md"))
    for page in range(176, 180):
        folder = source_root / f"10c/pages/{page:04d}"
        inputs.extend(folder / name for name in ("page.png", "page.template.md", "layout.json"))
        inputs.append(source_root / f"prepare-{page:04d}.json")
    outputs = [
        repo / f"ssot-resources/soviet10year-textbooks/artifacts/10c/pages/{page:04d}/page.md"
        for page in range(176, 180)
    ]
    outputs.extend(path for path in sorted(author_root.iterdir()) if path.is_file())
    result = {
        "input_bindings": [binding(path) for path in inputs],
        "output_bindings": [binding(path) for path in outputs],
        "qualification": "Read-only byte/hash inventory, not tests, row counting, source review, finalize, or workflow handoff. This manifest and its in-progress capture outputs cannot hash themselves.",
    }
    with (author_root / "bindings.json").open("x") as stream:
        json.dump(result, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    print(json.dumps(result, ensure_ascii=False, indent=2))
else:
    raise ValueError("Unknown mode")
