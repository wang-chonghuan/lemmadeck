"""One native220 counting call; exact binary mask, no visual opens or crops."""

import hashlib
import json
import platform
import sys
import zlib
from pathlib import Path

ROOT = Path("/Users/yong/.codex/worktrees/00b1/lemmadeck")
OUT = Path(__file__).resolve().parent
OLD = OUT.parent / "d023-source220-223-author"
TOOLS = ROOT / ".claude/skills/ld-s10y-lesson/tools"
sys.dont_write_bytecode = True
sys.path.insert(0, str(TOOLS))

import blocks
import layout
import numpy
import p2c
import PIL
import scipy
from PIL import Image


def bind(file):
    data = file.read_bytes()
    return {"path": str(file.resolve()), "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)}


def save_json(name, value):
    file = OUT / name
    with file.open("x", encoding="utf-8") as stream:
        json.dump(value, stream, ensure_ascii=False, indent=2)
        stream.write("\n")
    return bind(file)


assert (OUT / "bindings-before-native-call.json").is_file()
assert (OUT / "count-attempt-started.json").is_file()
assert not (OUT / "author-counts.stdout.json").exists(), "No second invocation."
assert not (OUT / "0220-native-trace.json").exists(), "No repeated native call."
preflight = json.loads((OUT / "bindings-before-native-call.json").read_text())
for entry in preflight["bound_files"]:
    current = bind(Path(entry["path"]))
    assert current == {key: entry[key] for key in ("path", "sha256", "bytes")}, entry["path"]

source = ROOT / ".tmp/ld-s10y-lesson/9p/pages/0220/page.png"
layout_file = source.parent / "layout.json"
candidate = OLD / "0220.page.md"
saved = json.loads((OLD / "author-counts.stdout.json").read_text())
prior = next(item for item in saved["pages"] if item["pdf_page"] == 220)
apis = {
    blocks.load.__code__: "blocks.load",
    blocks.printed_lines.__code__: "blocks.printed_lines",
    layout.ink_mask.__code__: "layout.ink_mask",
    layout.snap.__code__: "layout.snap",
    p2c._counting_line_bands.__code__: "p2c._counting_line_bands",
    layout.line_bands.__code__: "layout.line_bands",
}
events, masks = [], []


def trace(frame, event, arg):
    api = apis.get(frame.f_code)
    if api is None:
        return None
    if event in ("call", "return", "exception"):
        entry = {"ordinal": len(events) + 1, "api": api, "event": event,
                 "file": frame.f_code.co_filename, "line": frame.f_lineno}
        if api == "layout.line_bands" and event == "call":
            entry["edge_margin_px"] = frame.f_locals["edge_margin_px"]
        if api == "layout.line_bands" and event == "return":
            masks.append(frame.f_locals["ink"].copy())
            entry["returned_bands_y_inclusive"] = [[int(a), int(b)] for a, b in arg]
        if event == "exception":
            entry["exception"] = repr(arg)
        events.append(entry)
    return trace


sys.settrace(trace)
try:
    meta, parsed = blocks.load(candidate)
    assert meta["page"] == 220 and "counting" not in meta
    assert all(block["kind"] != "fig" for block in parsed)
    scratch_layout = json.loads(layout_file.read_text())
    counting = scratch_layout["counting"]
    assert counting["edge_margin_px"] == 100 and counting["reason"].strip()
    effective_meta = {**meta, "counting": counting}
    # Only the native counter decodes220; no image is displayed or generated.
    with Image.open(source) as image:
        ink = layout.ink_mask(image)
        dimensions = list(image.size)
    columns = ink.any(axis=0).nonzero()[0]
    content_width = int(columns[-1] - columns[0] + 1) if columns.size else dimensions[0]
    bands = p2c._counting_line_bands(effective_meta, ink, content_width)
    candidate_rows = blocks.printed_lines(parsed)
finally:
    sys.settrace(None)
    call_counts = {
        name: sum(item["api"] == name and item["event"] == "call" for item in events)
        for name in apis.values()
    }
    trace_binding = save_json("0220-native-trace.json", {
        "pdf_page": 220, "events": events, "calls": call_counts,
        "native_count_attempts": 1, "algorithm_unmodified": True,
        "model_visible_image_opens": 0, "count_only_source_decodes": 1,
        "no_snap_finalize_vectorize_assemble": True,
    })

assert call_counts == {
    "blocks.load": 1, "blocks.printed_lines": 1, "layout.ink_mask": 1,
    "layout.snap": 0, "p2c._counting_line_bands": 1, "layout.line_bands": 1,
}
assert len(masks) == 1
mask = masks[0]
mask_bytes = mask.tobytes(order="C")
packed = numpy.packbits(mask.reshape(-1), bitorder="big").tobytes()
compressed = zlib.compress(packed, 9)
mask_file = OUT / "0220-exact-counter-mask.packed.zlib"
with mask_file.open("xb") as stream:
    stream.write(compressed)
restored = numpy.unpackbits(
    numpy.frombuffer(zlib.decompress(mask_file.read_bytes()), dtype=numpy.uint8),
    bitorder="big", count=mask.size,
).reshape(mask.shape).astype(numpy.bool_)
assert restored.tobytes(order="C") == mask_bytes
native_bands = [[int(a), int(b)] for a, b in bands]
expected_bands = [band for band in prior["native_masked_bands"] if band != [2151, 2173]]
block_rows = [len(block["lines"]) + sum(line.count(blocks.WRAP) for line in block["lines"]) for block in parsed]
assert block_rows == prior["physical_rows_per_block_before_samerow"]
print(json.dumps({
    "schema": "STEMROBIN-181/d023-affected220-native-count@1",
    "role": "metadata-author-count-only-not-independent-review",
    "pdf_page": 220, "printed_page": meta["printed_page"],
    "candidate": bind(candidate), "source_png": bind(source), "scratch_layout": bind(layout_file),
    "candidate_bytes_changed": False, "counting_override": counting,
    "effective_meta_origin": "Unchanged candidate meta plus scratch layout.counting in memory.",
    "dimensions_px": dimensions, "content_width_px": content_width,
    "candidate_rows": candidate_rows, "native_masked_rows": len(bands),
    "physical_rows_per_block_before_samerow": block_rows,
    "native_masked_bands": native_bands,
    "only_false_saved_band_removed": native_bands == expected_bands,
    "false_band_y_inclusive": [2151, 2173],
    "false_band_final_mask_clear": not bool(mask[2151:2174].any()),
    "legitimate_footer_band_retained": [2014, 2044] in native_bands,
    "exact_counter_mask": {
        "file": bind(mask_file), "shape": list(mask.shape),
        "encoding": "zlib-compressed numpy.packbits, big bit order, C-order flattened boolean ink; discard trailing padding bits to shape product",
        "native_boolean_bytes_sha256": hashlib.sha256(mask_bytes).hexdigest(),
        "native_boolean_bytes": len(mask_bytes), "packed_bytes": len(packed),
        "captured_from": "layout.line_bands return-frame local ink",
        "lossless_saved_binary_roundtrip_verified": True,
        "true_means_ink": True, "not_a_screenshot_crop_or_image": True,
        "mask_approval": False,
    },
    "trace": trace_binding,
    "runtime": {
        "executable": str(Path(sys.executable).resolve()),
        "invoked_executable": sys.executable, "version": sys.version,
        "platform": platform.platform(), "dont_write_bytecode": sys.dont_write_bytecode,
        "dependencies": {
            module.__name__: {"version": module.__version__, "entrypoint": str(Path(module.__file__).resolve())}
            for module in (PIL, numpy, scipy)
        },
        "native_helpers": [str(Path(module.__file__).resolve()) for module in (blocks, layout, p2c)],
        "all_runtime_enumerated": False,
    },
    "native_count_invocations": 1, "count_pages": [220], "other_pages_recounted": [],
    "model_visible_image_opens": 0, "count_only_source_decodes": 1,
    "new_images_screenshots_crops": 0, "source_writes": False,
    "finalizer_vectorize_assemble": False, "SOURCE_completion_or_approval": False,
}, ensure_ascii=False, indent=2))
