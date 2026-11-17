import ast
import importlib.util
import json
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
tree = ast.parse((HERE / "test_contracts.py").read_text())
fixture_nodes = [node for node in tree.body if isinstance(node, ast.FunctionDef)
                 and node.name in ("glyph", "arrow")]
namespace = {"np": np}
exec(compile(ast.Module(body=fixture_nodes, type_ignores=[]), "approved-fixtures", "exec"), namespace)
glyph, arrow = namespace["glyph"], namespace["arrow"]


def simple(value):
    if isinstance(value, np.generic):
        return value.item()
    if isinstance(value, np.ndarray):
        return value.tolist() if value.size < 250 else {"shape": list(value.shape)}
    if isinstance(value, slice):
        return [value.start, value.stop]
    if isinstance(value, (list, tuple, set)):
        return [simple(item) for item in value]
    return value


results = []
for version in ("baseline", "v3", "candidate"):
    code = HERE / version / "layout.py"
    spec = importlib.util.spec_from_file_location(f"probe_{version}", code)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    lines = code.read_text().splitlines()
    for kind in ("H", "hollow"):
        mask = np.zeros((160, 650), dtype=bool)
        for y in (40, 100):
            for x in range(50, 570, 40):
                glyph(mask, x, y, height=23, walls=4, shape=kind)
            arrow(mask, start=290, stop=359, y=y - 17, head=8)
        events = []

        def trace(frame, event, result):
            if frame.f_code.co_filename != str(code):
                return None
            source = lines[frame.f_lineno - 1].strip()
            function = frame.f_code.co_name
            if function == "line_bands" and event == "line" and source.startswith((
                "joined = []", "expanded = []", "if compact_text_rows:",
                "if count == 1:", "step =", "glyph_h =",
            )) or event == "return" and function in ("_supported_glyph_rows", "_small_text_rows", "_single_fraction_row"):
                events.append({
                    "function": function, "source": source, "event": event,
                    "result": simple(result),
                    "locals": {key: simple(item) for key, item in frame.f_locals.items()
                               if key in ("a", "b", "raw", "merged", "joined", "line_h", "glyph_h",
                                          "glyph_heights", "body_heights", "arrow_components",
                                          "fragments", "glyph_rows", "compact_text_rows",
                                          "typical_h", "typical_gap", "pitch", "count")},
                })
            return trace

        sys.settrace(trace)
        try:
            bands = module.line_bands(mask, 600)
        finally:
            sys.settrace(None)
        results.append({"version": version, "kind": kind, "bands": bands,
                        "count": len(bands), "events": events})
with (HERE / "small-row-probe.json").open("x") as stream:
    json.dump(results, stream, indent=2)
    stream.write("\n")
print(json.dumps(results, indent=2))
