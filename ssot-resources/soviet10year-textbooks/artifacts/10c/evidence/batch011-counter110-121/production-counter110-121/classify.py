import sys

from PIL import Image
from scipy import ndimage

from diagnose import inputs, load_layout, TOOLS

layout = load_layout(TOOLS / "layout.py")
for page, a, b, scale in [(118, 491, 584, 45), (121, 742, 835, 45)]:
    png, _, _ = inputs(page)
    with Image.open(png) as img:
        ink = layout.ink_mask(img)
    edge = max(1, int(ink.shape[1]*0.01))
    ink[:, :edge] = ink[:, -edge:] = False
    labels, _ = ndimage.label(ink)
    state = {}

    def trace(frame, event, arg):
        if frame.f_code.co_name == "_single_carrier_row":
            if event == "return":
                state.update(frame.f_locals)
                state["return_line"] = frame.f_lineno
            return trace
        return None

    sys.settrace(trace)
    value = layout._single_carrier_row(labels, ndimage.find_objects(labels), a, b, scale)
    sys.settrace(None)
    print("RESULT", page, a, b, value, "return line", state["return_line"])
    for key in ("carriers", "bodies", "top", "bottom", "limits", "height", "width", "nearest", "rows", "columns"):
        print(key, state.get(key))
